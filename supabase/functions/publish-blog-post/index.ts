import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const slugify = (s: string) =>
  s.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);

async function generateCoverImage(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: `Editorial blog cover image, premium magazine style, soft cinematic light, sacred reverent mood, no text overlays. Subject: ${prompt}. Focus on rich textiles, gold and crimson tones, devotional aesthetic from India.`,
          },
        ],
        modalities: ["image", "text"],
      }),
    });
    if (!res.ok) {
      console.error("image gen failed", res.status, await res.text());
      return null;
    }
    const data = await res.json();
    const imgUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    return imgUrl ?? null;
  } catch (e) {
    console.error("image gen error", e);
    return null;
  }
}

async function uploadDataUrlToStorage(
  supabase: ReturnType<typeof createClient>,
  dataUrl: string,
  fileName: string,
): Promise<string | null> {
  try {
    const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
    if (!match) return null;
    const mime = match[1];
    const b64 = match[2];
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const ext = mime.split("/")[1] || "png";
    const path = `${fileName}.${ext}`;
    const { error } = await supabase.storage
      .from("blog-images")
      .upload(path, bytes, { contentType: mime, upsert: true });
    if (error) {
      console.error("upload error", error);
      return null;
    }
    const { data } = supabase.storage.from("blog-images").getPublicUrl(path);
    return data.publicUrl;
  } catch (e) {
    console.error("upload exception", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json();
    const { op } = body;

    if (op === "list") {
      const { data, error } = await supabase
        .from("auto_blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return new Response(JSON.stringify({ posts: data ?? [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (op === "delete") {
      const { id } = body;
      const { error } = await supabase.from("auto_blog_posts").delete().eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (op === "toggle_publish") {
      const { id, published } = body;
      const { error } = await supabase
        .from("auto_blog_posts")
        .update({ published, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (op === "publish" || op === "update") {
      const {
        id,
        title,
        slug: slugInput,
        excerpt,
        content,
        category,
        target_keyword,
        occasion,
        published,
        generate_image,
        image_prompt,
        existing_image_url,
      } = body;

      if (!title || !content || !excerpt) {
        return new Response(JSON.stringify({ error: "title, excerpt, content required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const slug = slugify(slugInput || title);
      let cover_image_url = existing_image_url ?? null;

      if (generate_image) {
        const promptForImg = image_prompt || `${title}. ${excerpt}`;
        const dataUrl = await generateCoverImage(promptForImg, LOVABLE_API_KEY);
        if (dataUrl) {
          const uploaded = await uploadDataUrlToStorage(
            supabase,
            dataUrl,
            `${slug}-${Date.now()}`,
          );
          if (uploaded) cover_image_url = uploaded;
        }
      }

      const payload = {
        title,
        slug,
        excerpt,
        content,
        category: category || "Trending",
        target_keyword: target_keyword || null,
        occasion: occasion || null,
        published: published ?? true,
        cover_image_url,
        updated_at: new Date().toISOString(),
      };

      if (op === "update" && id) {
        const { error } = await supabase
          .from("auto_blog_posts")
          .update(payload)
          .eq("id", id);
        if (error) throw error;
        return new Response(JSON.stringify({ ok: true, id, cover_image_url }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("auto_blog_posts")
        .insert(payload)
        .select()
        .single();
      if (error) throw error;
      return new Response(JSON.stringify({ ok: true, post: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Unknown op" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("publish-blog-post error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

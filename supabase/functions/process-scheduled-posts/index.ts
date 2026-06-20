import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const CRON_SECRET = Deno.env.get("CRON_SECRET") || "";
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Allow either cron secret OR authenticated editor
    const cronHeader = req.headers.get("x-cron-secret");
    const isCron = !!CRON_SECRET && cronHeader === CRON_SECRET;
    if (!isCron) {
      const authHeader = req.headers.get("Authorization") ?? "";
      const token = authHeader.replace(/^Bearer\s+/i, "");
      if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
      const { data: userRes } = await supabase.auth.getUser(token);
      if (!userRes?.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
      const { data: ok } = await supabase.rpc("is_editor", { _user_id: userRes.user.id });
      if (!ok) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
    }

    const nowIso = new Date().toISOString();
    const { data: due } = await supabase
      .from("scheduled_blog_posts")
      .select("id, kind, topic_hint, target_keyword, category, title, slug, excerpt, content, cover_image_url")
      .eq("status", "pending")
      .lte("scheduled_at", nowIso)
      .order("scheduled_at", { ascending: true })
      .limit(5);

    const slugify = (s: string) =>
      s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

    const results: any[] = [];
    for (const row of due ?? []) {
      await supabase.from("scheduled_blog_posts").update({ status: "processing" }).eq("id", row.id);
      try {
        if (row.kind === "custom") {
          // Publish the pre-written post directly
          if (!row.title || !row.content || !row.excerpt) throw new Error("Custom post missing title/excerpt/content");
          const slug = slugify(row.slug || row.title);
          const { data: inserted, error: insErr } = await supabase
            .from("auto_blog_posts")
            .insert({
              title: row.title,
              slug,
              excerpt: row.excerpt,
              content: row.content,
              category: row.category || "Trending",
              target_keyword: row.target_keyword,
              cover_image_url: row.cover_image_url,
              published: true,
            })
            .select()
            .single();
          if (insErr) throw insErr;
          await supabase.from("scheduled_blog_posts").update({
            status: "published", post_id: inserted.id, processed_at: new Date().toISOString(),
          }).eq("id", row.id);
          results.push({ id: row.id, ok: true, slug: inserted.slug, kind: "custom" });
          continue;
        }

        // AI-generated kind (default)
        const invokeRes = await fetch(`${SUPABASE_URL}/functions/v1/auto-seo-engine`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-cron-secret": CRON_SECRET,
            "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          },
          body: JSON.stringify({
            topic_hint: row.topic_hint,
            target_keyword: row.target_keyword,
            category: row.category,
            scheduled_id: row.id,
          }),
        });
        const json = await invokeRes.json();
        if (!invokeRes.ok || !json?.success) {
          await supabase.from("scheduled_blog_posts").update({
            status: "failed", error: json?.error || `HTTP ${invokeRes.status}`, processed_at: new Date().toISOString(),
          }).eq("id", row.id);
          results.push({ id: row.id, ok: false, error: json?.error });
        } else {
          results.push({ id: row.id, ok: true, slug: json.post?.slug });
        }
      } catch (e: any) {
        await supabase.from("scheduled_blog_posts").update({
          status: "failed", error: e.message, processed_at: new Date().toISOString(),
        }).eq("id", row.id);
        results.push({ id: row.id, ok: false, error: e.message });
      }
    }


    return new Response(JSON.stringify({ success: true, processed: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BRAND_CONTEXT = `
Punarvsu is a Delhi-based brand that handcrafts bags and accessories from upcycled sacred temple textiles (Bhagwan ki Poshak).
Key facts:
- Workshop in Rohini, Delhi managed by Sampurna NGO (35+ years of social work)
- Artisans: women-led team led by Kiran Mam
- Each bag takes 8-15 hours, fully handmade
- 3,200+ kg textile saved from landfills
- Temple partners include Khatushyam Delhi Dham
- Products: Temple Tote (₹2,999), Krishna Clutch (₹1,499), Durga Weekender (₹4,999), Radha Pouch (₹1,299), Saffron Crossbody (₹1,999)
- Free shipping above ₹5,000, ships across India
- Email: punarvsu.com@gmail.com
- Location: Maharana Pratap Community Centre, Sector-9, Rohini, Delhi 110085
- Website: https://punarvsu.com
`;

function getTimelyCcontext(): string {
  const now = new Date();
  const month = now.getMonth();
  const occasions: Record<string, string[]> = {
    "0": ["Makar Sankranti", "Republic Day", "winter fashion", "Lohri"],
    "1": ["Valentine's Day gifting", "Basant Panchami", "Maha Shivaratri"],
    "2": ["Holi", "Women's Day", "Ugadi", "Gudi Padwa"],
    "3": ["Navratri", "Ram Navami", "Baisakhi", "Earth Day"],
    "4": ["Mother's Day", "Akshaya Tritiya", "Buddha Purnima"],
    "5": ["Father's Day", "World Environment Day", "Eid gifting"],
    "6": ["Guru Purnima", "monsoon fashion", "Rath Yatra"],
    "7": ["Independence Day", "Raksha Bandhan", "Janmashtami"],
    "8": ["Ganesh Chaturthi", "Onam", "autumn fashion"],
    "9": ["Navratri", "Durga Puja", "Dussehra", "Karva Chauth"],
    "10": ["Diwali", "Bhai Dooj", "Chhath Puja", "wedding season"],
    "11": ["Christmas gifting", "wedding season", "winter fashion"],
  };
  const evergreen = [
    "sustainable fashion India", "handmade bags Delhi", "upcycled luxury accessories",
    "temple textile art", "conscious gifting ideas", "women artisan empowerment", "zero waste fashion",
  ];
  return `
CURRENT DATE: ${now.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
CURRENT MONTH OCCASIONS: ${(occasions[month.toString()] || []).join(", ")}
EVERGREEN TOPICS: ${evergreen.join(", ")}
Pick the MOST timely topic. Prioritize festivals within the next 2-3 weeks.`;
}

// Generate a unique cover image and upload to storage. Returns public URL or null.
async function generateAndUploadCover(
  supabase: any,
  apiKey: string,
  slug: string,
  title: string,
  category: string,
): Promise<string | null> {
  try {
    const imgPrompt = `Editorial photograph for a luxury Indian handcrafted bag brand. Theme: "${title}". Category: ${category}. Subject: rich silk/brocade temple textiles in saffron, crimson, and gold; or an Indian woman artisan's hands working on a handcrafted bag; or a finished bag styled with marigolds and brass diyas in soft natural window light. Mood: reverent, premium, warm, soft cinematic light, shallow depth of field. Style: muted earthy palette with golden accents. No text, no logos, no watermarks. High-end magazine quality.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-image-2",
        prompt: imgPrompt,
        size: "1536x1024",
        quality: "low",
        n: 1,
      }),
    });
    if (!res.ok) {
      console.error("Image gen failed:", res.status, await res.text());
      return null;
    }
    const json = await res.json();
    const b64: string | undefined = json?.data?.[0]?.b64_json;
    if (!b64) return null;

    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const path = `${slug}-${Date.now()}.png`;
    const { error: upErr } = await supabase.storage
      .from("blog-images")
      .upload(path, bytes, { contentType: "image/png", upsert: true });
    if (upErr) {
      console.error("Upload failed:", upErr);
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(path);
    return publicUrl;
  } catch (e) {
    console.error("Cover gen error:", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase credentials not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Optional backfill mode: regenerate cover images for posts missing one.
    let body: any = {};
    try { body = await req.json(); } catch { /* no body */ }

    if (body?.mode === "backfill_images") {
      const { data: posts } = await supabase
        .from("auto_blog_posts")
        .select("id,slug,title,category,cover_image_url")
        .eq("published", true);
      const targets = (posts || []).filter((p: any) => !p.cover_image_url);
      const limit = Math.min(targets.length, body.limit ?? 5);
      const results: any[] = [];
      for (let i = 0; i < limit; i++) {
        const p = targets[i];
        const url = await generateAndUploadCover(supabase, LOVABLE_API_KEY, p.slug, p.title, p.category);
        if (url) {
          await supabase.from("auto_blog_posts").update({ cover_image_url: url }).eq("id", p.id);
          results.push({ slug: p.slug, ok: true });
        } else {
          results.push({ slug: p.slug, ok: false });
        }
      }
      return new Response(JSON.stringify({ success: true, processed: results }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: existingPosts } = await supabase
      .from("auto_blog_posts")
      .select("title, slug, occasion, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    const existingTitles = (existingPosts || []).map((p) => p.title).join(", ");
    const timelyContext = getTimelyCcontext();

    // Step 1: Generate blog idea
    const ideaResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: `You are an expert SEO/AEO/GEO content strategist for Punarvsu. Return ONLY valid JSON, no markdown, no backticks. ${BRAND_CONTEXT}` },
          { role: "user", content: `${timelyContext}\n\nALREADY PUBLISHED (avoid duplicates): ${existingTitles || "None"}\n\nGenerate ONE blog idea. JSON:\n{\n  "title": "<70 chars, compelling, human, no AI tells",\n  "slug": "url-friendly",\n  "target_keyword": "primary keyword",\n  "occasion": "trend/festival",\n  "category": "Heritage|Sustainability|Style Guide|Gifting|Artisans|Festival|Trending",\n  "excerpt": "<160 chars human excerpt"\n}` },
        ],
      }),
    });
    if (!ideaResponse.ok) throw new Error(`Idea generation failed: ${ideaResponse.status} ${await ideaResponse.text()}`);
    const ideaData = await ideaResponse.json();
    let ideaText = ideaData.choices?.[0]?.message?.content || "";
    ideaText = ideaText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const idea = JSON.parse(ideaText);

    const { data: existing } = await supabase.from("auto_blog_posts").select("id").eq("slug", idea.slug).maybeSingle();
    if (existing) idea.slug = idea.slug + "-" + Date.now().toString(36);

    // Step 2: Generate full long-form humanized blog post
    const postResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `You are a senior editorial writer for Punarvsu — a premium Indian heritage brand. Write blog posts that feel HUMAN, warm, and lived-in. The reader must NEVER suspect AI involvement.

HARD RULES (DO NOT BREAK):
1. NEVER use these AI tell-tale phrases: "in today's fast-paced world", "delve", "tapestry", "in conclusion", "moreover", "furthermore", "it's worth noting", "navigate the", "unleash", "embark on a journey", "discover the", "in the realm of", "at its core", "ultimately".
2. NEVER start sentences with "Imagine", "Picture this", or "Let's explore".
3. NEVER label sections as "Introduction" or "Conclusion".
4. Write like a thoughtful Indian journalist — specific sensory detail, real names, a quiet confident voice.
5. Use ## for H2 and ### for H3 sparingly (max 4 H2s).
6. Include concrete numbers, dates, names (Kiran Mam, Sampurna NGO, Rohini, Khatushyam Delhi Dham).
7. Length: 1300-1800 words. Substantial, not padded.
8. Vary sentence length aggressively. Mix 4-word sentences with 30-word sentences.
9. End with a short FAQ (3 questions) — no "Conclusion" heading.
10. One subtle product mention woven naturally — never salesy.
11. No emojis. No em-dash overuse (max 3 total).
12. Open with a specific scene, anecdote, or surprising fact — not a generalization.

${BRAND_CONTEXT}`,
          },
          {
            role: "user",
            content: `Write the full blog post body (do NOT include the title).
Title: "${idea.title}"
Target keyword: "${idea.target_keyword}"
Occasion: "${idea.occasion}"
Category: "${idea.category}"

Output the body content only.`,
          },
        ],
      }),
    });
    if (!postResponse.ok) throw new Error(`Post generation failed: ${postResponse.status} ${await postResponse.text()}`);
    const postData = await postResponse.json();
    const content = postData.choices?.[0]?.message?.content || "";
    if (!content || content.length < 800) throw new Error(`Generated content too short (${content.length} chars)`);

    // Step 3: Generate unique cover image
    const coverUrl = await generateAndUploadCover(supabase, LOVABLE_API_KEY, idea.slug, idea.title, idea.category);

    // Step 4: Insert
    const { data: inserted, error: insertError } = await supabase
      .from("auto_blog_posts")
      .insert({
        slug: idea.slug,
        title: idea.title,
        excerpt: idea.excerpt,
        content,
        category: idea.category,
        target_keyword: idea.target_keyword,
        occasion: idea.occasion,
        cover_image_url: coverUrl,
        published: true,
      })
      .select()
      .single();
    if (insertError) throw new Error(`Failed to publish: ${insertError.message}`);

    console.log(`✅ Published: "${idea.title}" (${idea.slug}) — cover: ${coverUrl ?? "none"}`);

    return new Response(
      JSON.stringify({ success: true, post: { id: inserted.id, title: inserted.title, slug: inserted.slug, cover_image_url: coverUrl } }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("auto-seo-engine error:", e);
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

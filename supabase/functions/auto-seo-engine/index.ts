import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

const BRAND_CONTEXT = `
Punarvsu is a Delhi-based brand that handcrafts bags and accessories from upcycled sacred temple textiles (Bhagwan ki Poshak).
Key facts:
- Workshop in Rohini, Delhi managed by Sampurna NGO (35+ years of social work)
- Artisans: women-led team led by Kiran Mam
- Each bag takes 8-15 hours, fully handmade
- 3,200+ kg textile saved from landfills
- Temple partners include Khatushyam Delhi Dham
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

async function generateAndUploadCover(
  supabase: any, apiKey: string, slug: string, title: string, category: string,
): Promise<string | null> {
  try {
    const imgPrompt = `Editorial photograph for a luxury Indian handcrafted bag brand. Theme: "${title}". Category: ${category}. Subject: rich silk/brocade temple textiles in saffron, crimson, and gold; or an Indian woman artisan's hands working on a handcrafted bag; or a finished bag styled with marigolds and brass diyas in soft natural window light. Mood: reverent, premium, warm, soft cinematic light, shallow depth of field. Style: muted earthy palette with golden accents. No text, no logos, no watermarks. High-end magazine quality.`;
    const res = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "openai/gpt-image-2", prompt: imgPrompt, size: "1536x1024", quality: "low", n: 1 }),
    });
    if (!res.ok) { console.error("Image gen failed:", res.status, await res.text()); return null; }
    const json = await res.json();
    const b64: string | undefined = json?.data?.[0]?.b64_json;
    if (!b64) return null;
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const path = `${slug}-${Date.now()}.png`;
    const { error: upErr } = await supabase.storage.from("blog-images").upload(path, bytes, { contentType: "image/png", upsert: true });
    if (upErr) { console.error("Upload failed:", upErr); return null; }
    const { data: { publicUrl } } = supabase.storage.from("blog-images").getPublicUrl(path);
    return publicUrl;
  } catch (e) { console.error("Cover gen error:", e); return null; }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const CRON_SECRET = Deno.env.get("CRON_SECRET");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error("Supabase credentials not configured");
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const cronHeader = req.headers.get("x-cron-secret");
    const isCron = !!CRON_SECRET && cronHeader === CRON_SECRET;
    if (!isCron) {
      const authHeader = req.headers.get("Authorization") ?? "";
      const token = authHeader.replace(/^Bearer\s+/i, "");
      if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { data: userRes, error: userErr } = await supabase.auth.getUser(token);
      if (userErr || !userRes?.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const { data: editorOk } = await supabase.rpc("is_editor", { _user_id: userRes.user.id });
      if (!editorOk) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    let body: any = {};
    try { body = await req.json(); } catch { /* */ }

    // Backfill mode
    if (body?.mode === "backfill_images") {
      const { data: posts } = await supabase.from("auto_blog_posts").select("id,slug,title,category,cover_image_url").eq("published", true);
      const targets = (posts || []).filter((p: any) => !p.cover_image_url);
      const limit = Math.min(targets.length, body.limit ?? 5);
      const results: any[] = [];
      for (let i = 0; i < limit; i++) {
        const p = targets[i];
        const url = await generateAndUploadCover(supabase, LOVABLE_API_KEY, p.slug, p.title, p.category);
        if (url) { await supabase.from("auto_blog_posts").update({ cover_image_url: url }).eq("id", p.id); results.push({ slug: p.slug, ok: true }); }
        else results.push({ slug: p.slug, ok: false });
      }
      return new Response(JSON.stringify({ success: true, processed: results }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Optional inputs for manual / scheduled generation
    const topicHint: string | undefined = body?.topic_hint;
    const targetKeywordIn: string | undefined = body?.target_keyword;
    const categoryIn: string | undefined = body?.category;
    const scheduledId: string | undefined = body?.scheduled_id;

    const { data: existingPosts } = await supabase.from("auto_blog_posts").select("title").order("created_at", { ascending: false }).limit(20);
    const existingTitles = (existingPosts || []).map((p) => p.title).join(", ");
    const timelyContext = getTimelyCcontext();

    const userPrompt = topicHint
      ? `Topic the editor wants you to write about: "${topicHint}"
Target keyword hint: "${targetKeywordIn || topicHint}"
Category: "${categoryIn || 'Trending'}"
ALREADY PUBLISHED (avoid duplicate titles): ${existingTitles || "None"}

Generate a JSON object for ONE blog post tailored to this topic. JSON:
{
  "title": "<70 chars, compelling, human, no AI tells",
  "slug": "url-friendly",
  "target_keyword": "primary keyword",
  "occasion": "trend/festival or 'evergreen'",
  "category": "Heritage|Sustainability|Style Guide|Gifting|Artisans|Festival|Trending",
  "excerpt": "<160 chars human excerpt"
}`
      : `${timelyContext}\n\nALREADY PUBLISHED (avoid duplicates): ${existingTitles || "None"}\n\nGenerate ONE blog idea. JSON:\n{\n  "title": "<70 chars, compelling, human, no AI tells",\n  "slug": "url-friendly",\n  "target_keyword": "primary keyword",\n  "occasion": "trend/festival",\n  "category": "Heritage|Sustainability|Style Guide|Gifting|Artisans|Festival|Trending",\n  "excerpt": "<160 chars human excerpt"\n}`;

    const ideaResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: `You are an expert SEO/AEO/GEO content strategist for Punarvsu. Return ONLY valid JSON, no markdown, no backticks. ${BRAND_CONTEXT}` },
          { role: "user", content: userPrompt },
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

    const postResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: `You are a senior editorial writer for Punarvsu. Write HUMAN long-form posts. HARD RULES: no "delve", no "tapestry", no "in today's fast-paced world", no "in conclusion", no "imagine", no "navigate the", no "unleash", no "embark on a journey". No "Introduction" or "Conclusion" headings. Use ## for H2 sparingly (max 4). Length: 1300-1800 words. Vary sentence length. End with a 3-question FAQ — no "Conclusion" heading. One subtle product mention woven naturally. No emojis. ${BRAND_CONTEXT}` },
          { role: "user", content: `Write the full blog post body (do NOT include the title).\nTitle: "${idea.title}"\nTarget keyword: "${idea.target_keyword}"\nOccasion: "${idea.occasion}"\nCategory: "${idea.category}"\n\nOutput the body content only.` },
        ],
      }),
    });
    if (!postResponse.ok) throw new Error(`Post generation failed: ${postResponse.status} ${await postResponse.text()}`);
    const postData = await postResponse.json();
    const content = postData.choices?.[0]?.message?.content || "";
    if (!content || content.length < 800) throw new Error(`Generated content too short (${content.length} chars)`);

    const coverUrl = await generateAndUploadCover(supabase, LOVABLE_API_KEY, idea.slug, idea.title, idea.category);

    const { data: inserted, error: insertError } = await supabase
      .from("auto_blog_posts")
      .insert({
        slug: idea.slug, title: idea.title, excerpt: idea.excerpt, content,
        category: idea.category, target_keyword: idea.target_keyword, occasion: idea.occasion,
        cover_image_url: coverUrl, published: true,
      })
      .select().single();
    if (insertError) throw new Error(`Failed to publish: ${insertError.message}`);

    // If this run was triggered by a scheduled row, mark it processed
    if (scheduledId) {
      await supabase.from("scheduled_blog_posts").update({
        status: "published", post_id: inserted.id, processed_at: new Date().toISOString(),
      }).eq("id", scheduledId);
    }

    console.log(`✅ Published: "${idea.title}" (${idea.slug})`);
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

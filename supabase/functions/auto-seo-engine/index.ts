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

// Indian calendar of occasions, festivals, and seasonal hooks
function getTimelyCcontext(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed
  const day = now.getDate();

  const occasions: Record<string, string[]> = {
    "0": ["Makar Sankranti", "Republic Day", "New Year resolutions", "winter fashion", "Lohri"],
    "1": ["Valentine's Day gifting", "Basant Panchami", "spring fashion transition", "Maha Shivaratri"],
    "2": ["Holi festival fashion", "International Women's Day", "spring collection", "Ugadi", "Gudi Padwa"],
    "3": ["Navratri", "Ram Navami", "Baisakhi", "spring-summer transition", "Earth Day sustainability"],
    "4": ["Mother's Day gifting", "Akshaya Tritiya", "summer fashion", "Buddha Purnima"],
    "5": ["Father's Day", "World Environment Day", "monsoon prep", "Eid gifting", "summer sales"],
    "6": ["Guru Purnima", "monsoon fashion", "Rath Yatra", "rainy season accessories"],
    "7": ["Independence Day", "Raksha Bandhan", "Janmashtami", "festive season prep"],
    "8": ["Ganesh Chaturthi", "Onam", "Teacher's Day", "autumn fashion"],
    "9": ["Navratri", "Durga Puja", "Dussehra", "pre-Diwali shopping", "Karva Chauth"],
    "10": ["Diwali", "Bhai Dooj", "Chhath Puja", "wedding season", "corporate gifting season"],
    "11": ["Christmas gifting", "New Year prep", "wedding season", "winter fashion", "year-end reviews"],
  };

  const currentOccasions = occasions[month.toString()] || [];
  
  // Also add evergreen trending topics
  const evergreen = [
    "sustainable fashion India",
    "handmade bags Delhi",
    "upcycled luxury accessories",
    "temple textile art",
    "conscious gifting ideas",
    "women artisan empowerment",
    "zero waste fashion",
  ];

  return `
CURRENT DATE: ${now.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
CURRENT MONTH OCCASIONS & HOOKS: ${currentOccasions.join(", ")}
EVERGREEN SEO TOPICS: ${evergreen.join(", ")}

Pick the MOST timely and relevant topic. Prioritize upcoming festivals/occasions within the next 2-3 weeks. If no festival is imminent, pick a trending evergreen topic that hasn't been covered recently.
  `;
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

    // Check existing posts to avoid duplicates
    const { data: existingPosts } = await supabase
      .from("auto_blog_posts")
      .select("title, slug, occasion, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    const existingTitles = (existingPosts || []).map(p => p.title).join(", ");
    const timelyContext = getTimelyCcontext();

    // Step 1: Generate blog idea
    const ideaResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert SEO/AEO/GEO content strategist for Punarvsu. You must return ONLY valid JSON, no markdown, no backticks. ${BRAND_CONTEXT}`,
          },
          {
            role: "user",
            content: `${timelyContext}

ALREADY PUBLISHED POSTS (avoid similar topics): ${existingTitles || "None yet"}

Generate ONE blog post idea optimized for:
1. Google Search (SEO) - target a specific keyword with good search volume
2. AI Search (AEO) - answer a specific question ChatGPT/Perplexity users would ask  
3. Local Search (GEO) - include Delhi/Rohini/North India angle
4. Current occasion/trending topic relevance

Return JSON:
{
  "title": "compelling blog title under 70 chars",
  "slug": "url-friendly-slug",
  "target_keyword": "primary keyword to rank for",
  "occasion": "the occasion or trend this targets",
  "category": "one of: Heritage, Sustainability, Style Guide, Gifting, Artisans, Festival, Trending",
  "excerpt": "compelling 1-2 sentence excerpt under 160 chars for meta description"
}`,
          },
        ],
      }),
    });

    if (!ideaResponse.ok) {
      const errText = await ideaResponse.text();
      console.error("Idea generation failed:", ideaResponse.status, errText);
      throw new Error(`Idea generation failed: ${ideaResponse.status}`);
    }

    const ideaData = await ideaResponse.json();
    let ideaText = ideaData.choices?.[0]?.message?.content || "";
    
    // Clean markdown code blocks if present
    ideaText = ideaText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    let idea;
    try {
      idea = JSON.parse(ideaText);
    } catch {
      console.error("Failed to parse idea JSON:", ideaText);
      throw new Error("Failed to parse blog idea");
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from("auto_blog_posts")
      .select("id")
      .eq("slug", idea.slug)
      .maybeSingle();

    if (existing) {
      idea.slug = idea.slug + "-" + Date.now().toString(36);
    }

    // Step 2: Generate full blog post
    const postResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert SEO/AEO/GEO content writer for Punarvsu. Write blog posts that rank on Google AND get cited by AI search engines (ChatGPT, Perplexity, Google AI Overview).

WRITING RULES:
1. Start with a DIRECT ANSWER to the implied question (for AI engine citations)
2. Use ## for H2 headers and ### for H3 headers
3. Include bullet points and numbered lists (AI engines love structured content)
4. Mention Delhi, Rohini, Khatushyam Delhi Dham naturally for local GEO
5. Reference Punarvsu products naturally (not salesy)
6. End with a FAQ section (3-4 questions with concise answers) for AEO
7. 800-1200 words, warm authentic tone like talking to a friend
8. Include a subtle CTA to explore the collection
9. Weave in the occasion/festival context naturally

${BRAND_CONTEXT}`,
          },
          {
            role: "user",
            content: `Write a complete blog post.
Title: "${idea.title}"
Target Keyword: "${idea.target_keyword}"
Occasion: "${idea.occasion}"
Category: "${idea.category}"

Write the full post content. Do NOT include the title at the start - just the body content.`,
          },
        ],
      }),
    });

    if (!postResponse.ok) {
      const errText = await postResponse.text();
      console.error("Post generation failed:", postResponse.status, errText);
      throw new Error(`Post generation failed: ${postResponse.status}`);
    }

    const postData = await postResponse.json();
    const content = postData.choices?.[0]?.message?.content || "";

    if (!content || content.length < 200) {
      throw new Error("Generated content too short");
    }

    // Step 3: Auto-publish to database
    const { data: inserted, error: insertError } = await supabase
      .from("auto_blog_posts")
      .insert({
        slug: idea.slug,
        title: idea.title,
        excerpt: idea.excerpt,
        content: content,
        category: idea.category,
        target_keyword: idea.target_keyword,
        occasion: idea.occasion,
        published: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(`Failed to publish: ${insertError.message}`);
    }

    console.log(`✅ Auto-published: "${idea.title}" (${idea.slug})`);

    return new Response(
      JSON.stringify({
        success: true,
        post: {
          id: inserted.id,
          title: inserted.title,
          slug: inserted.slug,
          category: inserted.category,
          occasion: inserted.occasion,
          excerpt: inserted.excerpt,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("auto-seo-engine error:", e);
    return new Response(
      JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

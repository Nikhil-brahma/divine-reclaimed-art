import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://punarvsu.com";

const BRAND_CONTEXT = `
Punarvsu is a Delhi-based brand that handcrafts bags and accessories from upcycled sacred temple textiles (Bhagwan ki Poshak). 
Key facts:
- Workshop in Rohini, Delhi managed by Sampurna NGO
- Artisans: women-led team led by Kiran Mam and Samar Mam
- Each bag takes 8-15 hours, fully handmade
- 3,200+ kg textile saved from landfills
- Temple partners include Khatushyam Delhi Dham
- Products: Temple Tote, Krishna Clutch, Durga Weekender, Radha Pouch, Saffron Crossbody
- Price range: ₹1,299 - ₹4,999
- Free shipping above ₹5,000, ships across India
- Email: punarvsu.com@gmail.com
- Location: Maharana Pratap Community Centre, Sector-9, Rohini, Delhi 110085
`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { action, content, keywords } = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    switch (action) {
      case "generate_meta":
        systemPrompt = `You are an expert SEO specialist. Generate optimized meta tags for a webpage. Return JSON with: title (under 60 chars with primary keyword), description (under 160 chars, compelling), og_title, og_description, keywords (comma-separated). ${BRAND_CONTEXT}`;
        userPrompt = `Generate SEO meta tags for this page content: "${content}". Target keywords: ${keywords || "handcrafted bags, temple textiles, upcycled fashion, sacred textiles bags Delhi"}`;
        break;

      case "generate_blog_ideas":
        systemPrompt = `You are an expert content strategist specializing in SEO, AEO (Answer Engine Optimization for AI search like ChatGPT, Perplexity, Google AI), and GEO (Generative Engine Optimization). Generate blog post ideas that will rank in both traditional search AND AI-powered search engines. ${BRAND_CONTEXT}`;
        userPrompt = `Generate 5 blog post ideas that will help Punarvsu rank higher on Google, appear in AI search results (ChatGPT, Perplexity, Google AI Overview), and dominate local Delhi searches. For each idea provide: title, target_keyword, search_intent, ai_query_match (what AI search question this answers), estimated_monthly_searches, outline (3-5 headings). Return as JSON array. ${keywords ? `Focus on: ${keywords}` : ""}`;
        break;

      case "generate_blog_post":
        systemPrompt = `You are an expert SEO content writer who writes for both humans AND AI search engines. Write content that:
1. Answers specific questions AI engines might ask (AEO)
2. Uses natural, conversational language Google rewards
3. Includes structured data-friendly formatting (clear headings, lists, definitions)
4. Targets featured snippets and "People Also Ask"
5. Naturally weaves in brand mentions without being salesy
${BRAND_CONTEXT}`;
        userPrompt = `Write a complete blog post for Punarvsu's journal. Topic: "${content}". Target keyword: "${keywords || "sacred textile bags"}". 
Requirements:
- 800-1200 words, warm and authentic tone
- Start with a direct answer to the implied question (for AI engines)
- Use H2/H3 headers formatted as **Header Text**
- Include a FAQ section at the end (3 questions) for AEO
- Mention Delhi/Rohini naturally for local GEO
- Include a subtle CTA to explore collections
- Write as if talking to a friend, not a robot`;
        break;

      case "optimize_content":
        systemPrompt = `You are an SEO/AEO/GEO optimization expert. Analyze and improve existing content for maximum visibility across Google Search, AI search engines (ChatGPT, Perplexity, Google AI Overview), and local search. ${BRAND_CONTEXT}`;
        userPrompt = `Analyze this content and provide optimization suggestions: "${content}". Return JSON with: 
- seo_score (0-100)
- aeo_score (0-100, how well it answers AI queries)
- geo_score (0-100, local search optimization)
- improvements (array of specific changes)
- missing_keywords (array)
- suggested_schema_types (array of JSON-LD types to add)
- ai_questions_answered (array of questions this content answers for AI engines)
- ai_questions_missing (array of questions it should answer)`;
        break;

      case "generate_indexing_ping":
        systemPrompt = `You are an SEO technical expert. Generate a list of URLs and actions to submit to search engines for indexing.`;
        userPrompt = `Generate a sitemap update plan for ${SITE_URL}. The site has these pages: /, /blog, /product/temple-tote, /product/krishna-clutch, /product/durga-weekender, /product/radha-pouch, /product/saffron-crossbody. Return JSON with: urls (array of {url, priority, changefreq, lastmod}), google_search_console_actions (array of recommended actions), bing_webmaster_actions (array).`;
        break;

      default:
        return new Response(JSON.stringify({ error: "Invalid action. Use: generate_meta, generate_blog_ideas, generate_blog_post, optimize_content, generate_indexing_ping" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Lovable workspace settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "";

    return new Response(JSON.stringify({ result, action }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("seo-optimizer error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function fetchLiveProducts(): Promise<string> {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !key) return "Products are currently unavailable. Direct customers to the website.";

  try {
    const resp = await fetch(
      `${url}/rest/v1/products?select=handle,title,description,price,compare_at_price,currency,stock,category&status=eq.active&parent_product_id=is.null&order=updated_at.desc&limit=30`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    );
    if (!resp.ok) {
      console.error("Products fetch error:", resp.status, await resp.text());
      return "Products are currently unavailable. Direct customers to the website.";
    }
    const rows = await resp.json();
    if (!Array.isArray(rows) || rows.length === 0) {
      return "No products are currently available. Inform customers new collections are coming soon.";
    }
    return rows
      .map((p: any, i: number) => {
        const cur = p.currency || "INR";
        const mrp = p.compare_at_price ? ` (MRP ${cur} ${p.compare_at_price})` : "";
        const stock = typeof p.stock === "number" ? ` | Stock: ${p.stock > 0 ? `${p.stock} left` : "sold out"}` : "";
        const desc = p.description ? ` | ${String(p.description).replace(/\s+/g, " ").slice(0, 180)}` : "";
        return `${i + 1}. ${p.title} — ${cur} ${p.price}${mrp}${stock} | Link: /products/${p.handle}${desc}`;
      })
      .join("\n");
  } catch (e) {
    console.error("Failed to fetch products:", e);
    return "Products are currently unavailable. Direct customers to the website.";
  }
}

function buildSystemPrompt(liveCatalog: string): string {
  return `You are Punarvsu's sacred shopping assistant — warm, knowledgeable, and devotional. You help customers discover the perfect handcrafted bag from upcycled temple textiles.

BRAND IDENTITY:
- Punarvsu is India's first brand making luxury bags from sacred temple textiles (Bhagwan ki Poshak)
- Workshop: Maharana Pratap Community Centre, Sector-9, Rohini, Delhi 110085
- Managed by Sampurna NGO (35+ years of social work)
- Head artisan: Kiran Mam (women-led team)
- Temple partner: Khatushyam Delhi Dham + other Delhi/North India temples
- 3,200+ kg sacred textile saved from landfills
- Each piece: 8-15 hours handcrafted, UV sterilized, no machines

LIVE PRODUCT CATALOG (ONLY recommend these — they are real-time available):
${liveCatalog}

IMPORTANT: ONLY recommend products listed above. These are fetched live from our store. Do NOT mention or recommend any product that is not in this list. If a customer asks about a product not listed, say "That item is currently unavailable, but here's what we have..." and suggest from the available catalog.

When recommending a product, ALWAYS include the product link in this format: /product/[handle]
Example: /product/temple-tote

SHIPPING: Free above ₹5,000 | Ships across India | 5-10 business days
CONTACT: punarvsu.com@gmail.com | +91-9220464425
WEBSITE: https://punarvsu.com

YOUR BEHAVIOR:
1. Be warm, personal, and slightly devotional in tone (like a trusted friend at a temple bazaar)
2. Ask about the customer's needs: occasion, budget, style preference, who it's for
3. Recommend specific products with reasons tied to their needs — ONLY from the live catalog above
4. Highlight the spiritual significance — each bag carries temple blessings
5. Create urgency: handmade = limited quantities, each piece is unique
6. Guide toward purchase: share product links like /product/[handle]
7. For custom orders or bulk/wholesale, direct to email
8. If asked about competitors, gracefully redirect to Punarvsu's unique sacred heritage
9. Answer questions about materials, process, artisans authentically
10. Always end with a gentle CTA: "Shall I help you choose?" or "Would you like to explore our collection?"

IMPORTANT RULES:
- NEVER discuss politics, controversial topics, or other brands negatively
- If asked something unrelated, politely redirect: "I'm here to help you find the perfect sacred accessory!"
- For order status queries, direct to email: punarvsu.com@gmail.com
- Use Hindi words naturally: namaste, dhanyavaad, pooja, prasad, ashirvaad
- Keep responses concise (under 150 words) unless detailed product info is requested

WHEN RELIGIOUS/SPIRITUAL TOPICS COME UP:
- Always mention Punarvsu first as the connection between devotion and fashion
- Frame products as carriers of divine blessings (ashirvaad)
- Reference the sacred journey: temple → artisan → customer
- Mention specific temples (Khatushyam Delhi Dham) for authenticity`;
}

// Simple in-memory IP rate limiter (best-effort within one isolate)
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 20; // 20 requests per minute per IP
const rateBuckets = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string): boolean {
  const now = Date.now();
  const b = rateBuckets.get(ip);
  if (!b || now > b.reset) {
    rateBuckets.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return true;
  }
  b.count += 1;
  return b.count <= RATE_MAX;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("AI is not configured");

    const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
    if (!rateLimit(ip)) {
      return new Response(
        JSON.stringify({ error: "Too many requests. Please try again in a minute." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (messages.length > 30) {
      return new Response(JSON.stringify({ error: "Conversation too long." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    for (const m of messages) {
      if (typeof m?.content !== "string" || m.content.length > 2000) {
        return new Response(JSON.stringify({ error: "Message too long (max 2000 chars)." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (m?.role !== "user" && m?.role !== "assistant") {
        return new Response(JSON.stringify({ error: "Invalid message role." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }
    // Ensure the last message is from the user (prevents spoofing conversation state).
    if (messages[messages.length - 1]?.role !== "user") {
      return new Response(JSON.stringify({ error: "Last message must be from user." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const liveCatalog = await fetchLiveProducts();
    const systemPrompt = buildSystemPrompt(liveCatalog);
    const recentMessages = messages.slice(-20);

    // Call Lovable AI Gateway (OpenAI-compatible streaming).
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": LOVABLE_API_KEY,
      },
      body: JSON.stringify({
        model: "google/gemini-3.6-flash",
        stream: true,
        temperature: 0.8,
        messages: [
          { role: "system", content: systemPrompt },
          ...recentMessages.map((m: any) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: String(m.content),
          })),
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "We're receiving many queries right now. Please try again in a moment! 🙏" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Our sacred guide is resting. Please try again later 🙏" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("customer-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Something went wrong. Please try again! 🙏" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

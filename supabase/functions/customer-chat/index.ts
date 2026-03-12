import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHOPIFY_STORE_PERMANENT_DOMAIN = "str4c2-32.myshopify.com";
const SHOPIFY_API_VERSION = "2025-07";
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

async function fetchLiveProducts(): Promise<string> {
  const SHOPIFY_STOREFRONT_TOKEN = Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  if (!SHOPIFY_STOREFRONT_TOKEN) {
    console.error("SHOPIFY_STOREFRONT_ACCESS_TOKEN not set");
    return "Products are currently unavailable. Direct customers to the website.";
  }

  try {
    const query = `{
      products(first: 20) {
        edges {
          node {
            title
            handle
            description
            availableForSale
            priceRange {
              minVariantPrice { amount currencyCode }
            }
            variants(first: 5) {
              edges {
                node {
                  title
                  availableForSale
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }`;

    const resp = await fetch(SHOPIFY_STOREFRONT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    if (!resp.ok) {
      console.error("Shopify API error:", resp.status);
      return "Products are currently unavailable. Direct customers to the website.";
    }

    const data = await resp.json();
    const products = data?.data?.products?.edges || [];

    if (products.length === 0) {
      return "No products are currently available. Inform customers new collections are coming soon.";
    }

    const catalog = products
      .filter((p: any) => p.node.availableForSale)
      .map((p: any, i: number) => {
        const n = p.node;
        const price = n.priceRange.minVariantPrice;
        const variants = n.variants.edges
          .filter((v: any) => v.node.availableForSale)
          .map((v: any) => `${v.node.title} (${v.node.price.currencyCode} ${v.node.price.amount})`)
          .join(", ");
        return `${i + 1}. ${n.title} — ${price.currencyCode} ${price.amount} | Handle: ${n.handle} | Link: /product/${n.handle}${n.description ? ` | ${n.description.slice(0, 150)}` : ""}${variants ? ` | Variants: ${variants}` : ""}`;
      })
      .join("\n");

    return catalog || "No products are currently in stock.";
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
- Head artisans: Kiran Mam & Samar Mam (women-led team)
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
WEBSITE: https://divine-reclaimed-art.lovable.app

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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch live products from Shopify
    const liveCatalog = await fetchLiveProducts();
    const systemPrompt = buildSystemPrompt(liveCatalog);

    const recentMessages = messages.slice(-20);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          ...recentMessages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "We're receiving many queries right now. Please try again in a moment! 🙏" }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Our chat service is temporarily unavailable. Please email us at punarvsu.com@gmail.com 🙏" }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error(`AI gateway error: ${response.status}`);
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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Punarvsu's sacred shopping assistant — warm, knowledgeable, and devotional. You help customers discover the perfect handcrafted bag from upcycled temple textiles.

BRAND IDENTITY:
- Punarvsu is India's first brand making luxury bags from sacred temple textiles (Bhagwan ki Poshak)
- Workshop: Maharana Pratap Community Centre, Sector-9, Rohini, Delhi 110085
- Managed by Sampurna NGO (35+ years of social work)
- Head artisans: Kiran Mam & Samar Mam (women-led team)
- Temple partner: Khatushyam Delhi Dham + other Delhi/North India temples
- 3,200+ kg sacred textile saved from landfills
- Each piece: 8-15 hours handcrafted, UV sterilized, no machines

PRODUCT CATALOG:
1. Temple Tote — ₹2,999 | Spacious everyday bag | Gold & saffron brocade | Best for: daily use, work, shopping
2. Krishna Clutch — ₹1,499 | Elegant evening clutch | Peacock motifs | Best for: parties, weddings, temples
3. Durga Weekender — ₹4,999 | Large statement bag | Bold crimson & gold | Best for: travel, festivals, gifting
4. Radha Pouch — ₹1,299 | Compact daily pouch | Soft pastels & florals | Best for: essentials, temple visits
5. Saffron Crossbody — ₹1,999 | Hands-free crossbody | Saffron tones | Best for: outings, casual wear

SHIPPING: Free above ₹5,000 | Ships across India | 5-10 business days
CONTACT: punarvsu.com@gmail.com | +91-9220464425
WEBSITE: https://divine-reclaimed-art.lovable.app

YOUR BEHAVIOR:
1. Be warm, personal, and slightly devotional in tone (like a trusted friend at a temple bazaar)
2. Ask about the customer's needs: occasion, budget, style preference, who it's for
3. Recommend specific products with reasons tied to their needs
4. Highlight the spiritual significance — each bag carries temple blessings
5. Create urgency: handmade = limited quantities, each piece is unique
6. Guide toward purchase: share product links like /product/temple-tote
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

    // Limit conversation history to last 20 messages to control costs
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
          { role: "system", content: SYSTEM_PROMPT },
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

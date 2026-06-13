import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_CURRENCIES = new Set(["INR"]);
const MAX_AMOUNT = 1_000_000; // ₹10,00,000 cap

// Simple per-IP in-memory rate limiter (best-effort within an instance)
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 60_000; // per minute
const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const e = hits.get(ip);
  if (!e || e.reset < now) {
    hits.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    return false;
  }
  e.count++;
  return e.count > RATE_LIMIT;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
    if (rateLimited(ip)) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!KEY_ID || !KEY_SECRET) throw new Error("Razorpay credentials not configured");

    const body = await req.json().catch(() => ({}));
    const amount = Number(body?.amount);
    const currency = String(body?.currency || "INR").toUpperCase();
    const receipt = String(body?.receipt || `rcpt_${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40);

    if (!Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
      return new Response(JSON.stringify({ error: "Invalid amount" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!ALLOWED_CURRENCIES.has(currency)) {
      return new Response(JSON.stringify({ error: "Unsupported currency" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Server-controlled notes only — never trust client input here
    const notes: Record<string, string> = { source: "punarvsu-web", receipt };

    const auth = "Basic " + btoa(`${KEY_ID}:${KEY_SECRET}`);
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify({
        amount: Math.round(amount * 100),
        currency,
        receipt,
        notes,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Razorpay order failed:", data);
      return new Response(JSON.stringify({ error: data?.error?.description || "Order failed" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ order: data, key_id: KEY_ID }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message || "Internal error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

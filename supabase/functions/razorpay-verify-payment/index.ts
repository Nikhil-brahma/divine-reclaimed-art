import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SB_SVC = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    // Require authenticated caller
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    if (!token) {
      return new Response(JSON.stringify({ verified: false, error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const sbUser = createClient(SB_URL, SB_ANON, { global: { headers: { Authorization: authHeader } } });
    const { data: userData, error: userErr } = await sbUser.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ verified: false, error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const callerId = userData.user.id;

    const KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!KEY_SECRET) throw new Error("Razorpay secret not configured");

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return new Response(JSON.stringify({ verified: false, error: "Missing fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const expected = await hmacSha256Hex(KEY_SECRET, `${razorpay_order_id}|${razorpay_payment_id}`);
    const verified = expected === razorpay_signature;
    if (!verified) {
      return new Response(JSON.stringify({ verified: false, error: "Signature mismatch" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Service-role update gated by ownership + razorpay_order_id match
    const svc = createClient(SB_URL, SB_SVC);
    const { data: order, error: oErr } = await svc.from("orders").select("id, user_id, razorpay_order_id, status").eq("id", order_id).maybeSingle();
    if (oErr || !order) {
      return new Response(JSON.stringify({ verified: false, error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (order.user_id !== callerId) {
      return new Response(JSON.stringify({ verified: false, error: "Forbidden" }), {
        status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (order.razorpay_order_id && order.razorpay_order_id !== razorpay_order_id) {
      return new Response(JSON.stringify({ verified: false, error: "Order mismatch" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: uErr } = await svc.from("orders").update({
      status: "paid",
      paid_at: new Date().toISOString(),
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }).eq("id", order_id);
    if (uErr) throw uErr;

    // Fire-and-forget server-side confirmation (forward caller auth)
    fetch(`${SB_URL}/functions/v1/send-order-confirmation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
        "apikey": SB_ANON,
      },
      body: JSON.stringify({ order_id }),
    }).catch((e) => console.error("send-order-confirmation invoke failed:", e));

    return new Response(JSON.stringify({ verified: true }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ verified: false, error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

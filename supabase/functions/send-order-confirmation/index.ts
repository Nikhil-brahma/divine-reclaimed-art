import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const GOOGLE_SHEETS_API_KEY = Deno.env.get("GOOGLE_SHEETS_API_KEY");
const ORDERS_SHEET_ID = Deno.env.get("ORDERS_SHEET_ID");
const ORDERS_SHEET_TAB = Deno.env.get("ORDERS_SHEET_TAB") || "Orders";
const FROM_EMAIL = Deno.env.get("ORDER_FROM_EMAIL") || "Punarvsu <onboarding@resend.dev>";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_SVC = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

function emailHtml(order: any, items: any[]) {
  const rows = items.map((i) => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid #f0e6cc;">${i.title} × ${i.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid #f0e6cc;text-align:right;">${inr(Number(i.price) * i.quantity)}</td>
    </tr>`).join("");
  return `<!doctype html><html><body style="margin:0;background:#fffaf0;font-family:Georgia,serif;color:#3a2a1a;">
  <div style="max-width:560px;margin:0 auto;padding:32px 24px;">
    <div style="text-align:center;padding-bottom:20px;border-bottom:1px solid #e6d49a;">
      <h1 style="font-size:24px;color:#8b0000;margin:0;letter-spacing:2px;">PUNARVSU</h1>
      <p style="color:#c9a84c;font-size:12px;letter-spacing:3px;margin:6px 0 0;">BLESSINGS IN PHYSICAL FORM</p>
    </div>
    <h2 style="margin:24px 0 8px;">Thank you, ${order.shipping_name || "dear soul"} 🪷</h2>
    <p style="line-height:1.6;">Your sacred order <strong>${order.order_number}</strong> has been received. We will hand-pack it with reverence and dispatch soon.</p>
    <table style="width:100%;border-collapse:collapse;margin-top:18px;">${rows}
      <tr><td style="padding:12px 10px;font-weight:bold;">Total</td><td style="padding:12px 10px;text-align:right;font-weight:bold;color:#8b0000;">${inr(Number(order.total))}</td></tr>
    </table>
    <div style="margin-top:24px;padding:14px;background:#fff7e0;border:1px solid #e6d49a;border-radius:8px;">
      <p style="margin:0;font-size:13px;"><strong>Ships to:</strong><br/>${order.shipping_name}<br/>${order.shipping_address}<br/>${order.shipping_city}, ${order.shipping_state} ${order.shipping_pincode}</p>
    </div>
    <p style="margin-top:24px;font-size:12px;color:#8a7a5a;text-align:center;">Punarvsu · punarvsu.com · A sacred upcycling initiative</p>
  </div></body></html>`;
}

async function sendEmail(order: any, items: any[]) {
  if (!RESEND_API_KEY || !order.email) return { skipped: true };
  const r = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": RESEND_API_KEY,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [order.email],
      subject: `Order confirmed — ${order.order_number} · Punarvsu`,
      html: emailHtml(order, items),
    }),
  });
  const body = await r.text();
  return { ok: r.ok, status: r.status, body };
}

async function appendToSheet(order: any, items: any[]) {
  if (!GOOGLE_SHEETS_API_KEY || !ORDERS_SHEET_ID) return { skipped: true };
  const url = `https://connector-gateway.lovable.dev/google_sheets/v4/spreadsheets/${ORDERS_SHEET_ID}/values/${ORDERS_SHEET_TAB}!A:Z:append?valueInputOption=USER_ENTERED`;
  const itemsSummary = items.map((i) => `${i.title} x${i.quantity}`).join("; ");
  const row = [[
    new Date().toISOString(),
    order.order_number,
    order.status,
    order.shipping_name,
    order.email,
    order.phone,
    order.total,
    order.currency || "INR",
    itemsSummary,
    `${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state} ${order.shipping_pincode}`,
    order.razorpay_payment_id || "",
  ]];
  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GOOGLE_SHEETS_API_KEY,
    },
    body: JSON.stringify({ values: row }),
  });
  const body = await r.text();
  return { ok: r.ok, status: r.status, body };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { order_id } = await req.json();
    if (!order_id) throw new Error("order_id required");
    const sb = createClient(SB_URL, SB_SVC);
    const { data: order, error } = await sb.from("orders").select("*").eq("id", order_id).single();
    if (error || !order) throw new Error("order not found");
    const { data: items } = await sb.from("order_items").select("*").eq("order_id", order_id);

    const [email, sheet] = await Promise.all([
      sendEmail(order, items || []).catch((e) => ({ error: e.message })),
      appendToSheet(order, items || []).catch((e) => ({ error: e.message })),
    ]);

    return new Response(JSON.stringify({ ok: true, email, sheet }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

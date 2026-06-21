import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_CURRENCIES = new Set(["INR"]);
const MAX_AMOUNT = 1_000_000; // ₹10,00,000 cap per order
const SHIPPING_FREE_THRESHOLD = 1500;
const SHIPPING_FLAT = 99;

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SB_SVC = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface IncomingItem { product_id?: string; handle?: string; quantity: number }
interface Customer {
  full_name: string; email: string; phone: string;
  address_line1: string; address_line2?: string;
  city: string; state: string; postal_code: string; country?: string;
  notes?: string;
}

function isNonEmpty(s: any) { return typeof s === "string" && s.trim().length > 0; }
function isEmail(s: any) { return typeof s === "string" && /.+@.+\..+/.test(s); }

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Optional auth: signed-in shopper or guest
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    let userId: string | null = null;
    if (token) {
      const sbUser = createClient(SB_URL, SB_ANON, { global: { headers: { Authorization: authHeader } } });
      const { data: u } = await sbUser.auth.getUser(token);
      userId = u?.user?.id || null;
    }

    const KEY_ID = Deno.env.get("RAZORPAY_KEY_ID");
    const KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET");
    if (!KEY_ID || !KEY_SECRET) throw new Error("Razorpay credentials not configured");

    const body = await req.json().catch(() => ({}));
    const items: IncomingItem[] = Array.isArray(body?.items) ? body.items : [];
    const customer: Customer = body?.customer || {};
    const currency = String(body?.currency || "INR").toUpperCase();

    // Validate cart
    if (!items.length) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!ALLOWED_CURRENCIES.has(currency)) {
      return new Response(JSON.stringify({ error: "Unsupported currency" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    for (const it of items) {
      const q = Number(it.quantity);
      if (!Number.isFinite(q) || q <= 0 || q > 50) {
        return new Response(JSON.stringify({ error: "Invalid quantity" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!isNonEmpty(it.product_id) && !isNonEmpty(it.handle)) {
        return new Response(JSON.stringify({ error: "Each item needs product_id or handle" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Validate customer
    const reqFields: (keyof Customer)[] = ["full_name", "email", "phone", "address_line1", "city", "state", "postal_code"];
    for (const k of reqFields) {
      if (!isNonEmpty(customer[k] as any)) {
        return new Response(JSON.stringify({ error: `Missing ${k}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    if (!isEmail(customer.email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (customer.phone.replace(/\D/g, "").length < 10) {
      return new Response(JSON.stringify({ error: "Invalid phone" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const svc = createClient(SB_URL, SB_SVC);

    // Fetch products by id or handle (whichever was supplied)
    const productIds = items.map(i => i.product_id).filter(isNonEmpty) as string[];
    const handles = items.map(i => i.handle).filter(isNonEmpty) as string[];
    const productsById: Record<string, any> = {};
    const productsByHandle: Record<string, any> = {};
    if (productIds.length) {
      const { data } = await svc.from("products").select("id,handle,title,price,images,status,stock").in("id", productIds);
      for (const p of data || []) productsById[p.id] = p;
    }
    if (handles.length) {
      const { data } = await svc.from("products").select("id,handle,title,price,images,status,stock").in("handle", handles);
      for (const p of data || []) productsByHandle[p.handle] = p;
    }

    // Build authoritative line items (price comes from DB only)
    type Line = { product_id: string; product_handle: string; product_title: string; product_image: string | null; unit_price: number; quantity: number; line_total: number };
    const lines: Line[] = [];
    let subtotal = 0;
    for (const it of items) {
      const p = (it.product_id && productsById[it.product_id]) || (it.handle && productsByHandle[it.handle]);
      if (!p) {
        return new Response(JSON.stringify({ error: `Product not found: ${it.product_id || it.handle}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (p.status && p.status !== "active") {
        return new Response(JSON.stringify({ error: `Product unavailable: ${p.title}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const qty = Math.floor(Number(it.quantity));
      const unit = Number(p.price);
      if (!Number.isFinite(unit) || unit <= 0) {
        return new Response(JSON.stringify({ error: `Invalid price for ${p.title}` }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const lineTotal = unit * qty;
      subtotal += lineTotal;
      lines.push({
        product_id: p.id,
        product_handle: p.handle,
        product_title: p.title,
        product_image: Array.isArray(p.images) && p.images.length ? p.images[0] : null,
        unit_price: unit,
        quantity: qty,
        line_total: lineTotal,
      });
    }

    const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_FLAT;
    const total = subtotal + shipping;
    if (total <= 0 || total > MAX_AMOUNT) {
      return new Response(JSON.stringify({ error: "Invalid order total" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Insert order (service role bypasses RLS)
    const shippingAddress = {
      line1: customer.address_line1,
      line2: customer.address_line2 || null,
      city: customer.city, state: customer.state,
      postal_code: customer.postal_code, country: customer.country || "India",
    };

    const { data: order, error: oErr } = await svc.from("orders").insert({
      user_id: userId,
      status: "pending",
      subtotal, shipping, total, currency,
      customer_name: customer.full_name.trim().slice(0, 200),
      customer_email: customer.email.trim().toLowerCase().slice(0, 255),
      customer_phone: customer.phone.trim().slice(0, 40),
      shipping_address: shippingAddress,
      notes: customer.notes ? String(customer.notes).slice(0, 1000) : null,
    }).select().single();
    if (oErr) throw oErr;

    const { error: iErr } = await svc.from("order_items").insert(
      lines.map(l => ({ ...l, order_id: order.id })),
    );
    if (iErr) {
      // Best-effort rollback
      await svc.from("orders").delete().eq("id", order.id);
      throw iErr;
    }

    // Create Razorpay order with server-computed amount
    const receipt = `pnv_${String(order.order_number).replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 30)}`;
    const auth = "Basic " + btoa(`${KEY_ID}:${KEY_SECRET}`);
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: auth },
      body: JSON.stringify({
        amount: Math.round(total * 100),
        currency,
        receipt,
        notes: { order_number: order.order_number, user_id: userId || "guest", order_id: order.id },
      }),
    });
    const rzpData = await res.json();
    if (!res.ok) {
      console.error("Razorpay order failed:", rzpData);
      await svc.from("orders").update({ status: "failed" }).eq("id", order.id);
      return new Response(JSON.stringify({ error: rzpData?.error?.description || "Payment provider failed" }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await svc.from("orders").update({ razorpay_order_id: rzpData.id }).eq("id", order.id);

    return new Response(JSON.stringify({
      order: rzpData,
      key_id: KEY_ID,
      order_id: order.id,
      order_number: order.order_number,
      subtotal, shipping, total,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("razorpay-create-order error:", e);
    return new Response(JSON.stringify({ error: e.message || "Internal error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

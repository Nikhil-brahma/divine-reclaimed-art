// Enhance a product image with Lovable AI (Gemini Nano Banana 2).
// - mode "save"  -> JWT + editor required; uploads results to site-content bucket; inserts product_media row
// - mode "demo"  -> anon allowed; per-IP rate limited; returns base64 data URLs only (no storage / no DB writes)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SB_SVC = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const PRIMARY_MODEL = "google/gemini-3.1-flash-image-preview";
const FALLBACK_MODEL = "google/gemini-3-pro-image-preview";

// Style presets matching Punarvsu's brand palette
const STYLE_PRESETS: Record<string, string> = {
  "regal-ivory":
    "Photograph this exact product on a warm ivory background (#FAF3E3) with soft golden rim lighting from the upper-left, faint hand-painted sanskrit motif bokeh, a single brass diya glowing softly in the deep background, museum-quality product photography, hyper-detailed fabric weave, shallow depth of field. Premium devotional brand aesthetic. Do NOT change the product itself — preserve its colors, fabric texture, embroidery, and proportions exactly.",
  "temple-black":
    "Photograph this exact product against a deep matte black temple-stone background, dramatic single-source golden light from above, faint marigold petals scattered, museum-quality. Preserve the product's exact colors, weave, and proportions.",
  "marigold-festival":
    "Photograph this exact product surrounded by a soft halo of marigold petals, warm festive ivory background with subtle gold leaf, soft diya light, museum-quality. Preserve the product exactly.",
};

const ANGLES = [
  { id: "front", prompt: "straight front view, centered, eye-level" },
  { id: "three-quarter-left", prompt: "three-quarter view from the left side, slight downward tilt" },
  { id: "three-quarter-right", prompt: "three-quarter view from the right side, slight downward tilt" },
  { id: "top-down", prompt: "flat lay top-down view, perfectly centered" },
];

// 8 spin frames (45° increments) — good fidelity vs. cost balance
const SPIN_FRAMES = Array.from({ length: 8 }, (_, i) => ({
  index: i,
  prompt: `rotated ${i * 45} degrees around its vertical axis, same camera distance and lighting as the hero shot, perfectly continuous rotation`,
}));

// In-memory IP rate limit (best-effort per isolate)
const DEMO_LIMIT = 5;
const DEMO_WINDOW_MS = 60 * 60 * 1000;
const demoHits = new Map<string, { count: number; reset: number }>();
function demoRateLimited(ip: string): boolean {
  const now = Date.now();
  const e = demoHits.get(ip);
  if (!e || e.reset < now) {
    demoHits.set(ip, { count: 1, reset: now + DEMO_WINDOW_MS });
    return false;
  }
  e.count++;
  return e.count > DEMO_LIMIT;
}

async function callGemini(sourceImages: string[], prompt: string): Promise<string> {
  const imgs = (sourceImages || []).filter((u) => typeof u === "string" && u.startsWith("data:"));
  const refNote = imgs.length > 1
    ? ` You are given ${imgs.length} reference photos of the SAME physical product taken from different sides — use ALL of them to understand the product's true 3D shape, fabric, embroidery, and proportions. Preserve those exactly. The first image is the primary reference.`
    : "";
  const content: any[] = [{ type: "text", text: prompt + refNote }];
  for (const u of imgs) content.push({ type: "image_url", image_url: { url: u } });
  const body = {
    model: PRIMARY_MODEL,
    modalities: ["image", "text"],
    messages: [{ role: "user", content }],
  };
  let res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
    body: JSON.stringify(body),
  });
  if (!res.ok && res.status >= 500) {
    res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LOVABLE_API_KEY}` },
      body: JSON.stringify({ ...body, model: FALLBACK_MODEL }),
    });
  }
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`AI gateway ${res.status}: ${t.slice(0, 300)}`);
  }
  const data = await res.json();
  const url =
    data?.choices?.[0]?.message?.images?.[0]?.image_url?.url ||
    data?.choices?.[0]?.message?.content?.find?.((c: any) => c?.type === "image_url")?.image_url?.url;
  if (!url || typeof url !== "string") {
    throw new Error("No image returned from AI gateway");
  }
  if (url.startsWith("data:")) return url.split(",", 2)[1];
  return url;
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function uploadFrame(svc: ReturnType<typeof createClient>, handle: string, kind: string, idx: number | string, b64: string): Promise<string> {
  const path = `products/${handle}/${kind}/${idx}-${Date.now()}.png`;
  const { error } = await svc.storage.from("site-content").upload(path, b64ToBytes(b64), {
    contentType: "image/png",
    upsert: true,
  });
  if (error) throw new Error(`upload ${path}: ${error.message}`);
  const { data } = svc.storage.from("site-content").getPublicUrl(path);
  return data.publicUrl;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    const mode = body?.mode === "save" ? "save" : "demo";
    // Accept either a single `source_image` or an array `source_images` (up to 5 reference shots).
    const rawSources: string[] = Array.isArray(body?.source_images)
      ? body.source_images.filter(Boolean)
      : (body?.source_image ? [body.source_image] : []);
    const sourceImages = rawSources.slice(0, 5).filter((u) => typeof u === "string" && u.startsWith("data:image/"));
    const style: string = STYLE_PRESETS[body?.style] ? body.style : "regal-ivory";
    const includeSpin: boolean = body?.include_spin !== false;
    const includeAngles: boolean = body?.include_angles !== false;
    const productId: string | undefined = body?.product_id;
    const productHandle: string = (body?.product_handle || "untitled").replace(/[^a-z0-9-]/gi, "-").toLowerCase();

    if (sourceImages.length === 0) {
      return new Response(JSON.stringify({ error: "At least one source_image (data URL) is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- AUTH ----
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    let callerId: string | null = null;
    if (token) {
      const sbUser = createClient(SB_URL, SB_ANON, { global: { headers: { Authorization: authHeader } } });
      const { data: u } = await sbUser.auth.getUser(token);
      callerId = u?.user?.id || null;
    }

    if (mode === "save") {
      if (!callerId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const svc = createClient(SB_URL, SB_SVC);
      const { data: isEditor } = await svc.rpc("is_editor", { _user_id: callerId });
      if (!isEditor) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (!productId) {
        return new Response(JSON.stringify({ error: "product_id required for save mode" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    } else {
      // demo mode rate limit
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
      if (demoRateLimited(ip)) {
        return new Response(JSON.stringify({ error: "Too many demo requests. Try again in an hour." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // ---- GENERATE ----
    const stylePrompt = STYLE_PRESETS[style];

    const heroPrompt = `${stylePrompt} HERO product shot, straight front-facing, the product fills 70% of the frame, centered.`;
    const tasks: Array<{ key: string; promise: Promise<string> }> = [
      { key: "hero", promise: callGemini(sourceImages, heroPrompt) },
    ];
    if (includeAngles) {
      for (const a of ANGLES) {
        tasks.push({
          key: `angle:${a.id}`,
          promise: callGemini(sourceImages, `${stylePrompt} ${a.prompt}. The product fills 65% of the frame.`),
        });
      }
    }
    if (includeSpin) {
      for (const s of SPIN_FRAMES) {
        tasks.push({
          key: `spin:${s.index}`,
          promise: callGemini(sourceImages, `${stylePrompt} ${s.prompt}.`),
        });
      }
    }

    const settled = await Promise.allSettled(tasks.map((t) => t.promise));
    const results: Record<string, string> = {};
    const errors: Record<string, string> = {};
    settled.forEach((r, i) => {
      const key = tasks[i].key;
      if (r.status === "fulfilled") results[key] = r.value;
      else errors[key] = (r.reason as Error)?.message?.slice(0, 200) || "failed";
    });

    if (!results["hero"]) {
      return new Response(JSON.stringify({ error: "Hero generation failed", details: errors }), {
        status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- DEMO MODE: return data URLs ----
    if (mode === "demo") {
      const toDataUrl = (b64: string) => `data:image/png;base64,${b64}`;
      const hero = toDataUrl(results["hero"]);
      const angles = ANGLES.filter((a) => results[`angle:${a.id}`]).map((a) => toDataUrl(results[`angle:${a.id}`]));
      const spin = SPIN_FRAMES.filter((s) => results[`spin:${s.index}`]).map((s) => toDataUrl(results[`spin:${s.index}`]));
      return new Response(JSON.stringify({ ok: true, mode, hero, angles, spin, errors }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ---- SAVE MODE: upload to storage + insert product_media ----
    const svc = createClient(SB_URL, SB_SVC);
    const heroUrl = await uploadFrame(svc, productHandle, "hero", 0, results["hero"]);
    const angleUrls: string[] = [];
    for (const a of ANGLES) {
      if (results[`angle:${a.id}`]) {
        angleUrls.push(await uploadFrame(svc, productHandle, "angle", a.id, results[`angle:${a.id}`]));
      }
    }
    const spinUrls: string[] = [];
    for (const s of SPIN_FRAMES) {
      if (results[`spin:${s.index}`]) {
        spinUrls.push(await uploadFrame(svc, productHandle, "spin", s.index, results[`spin:${s.index}`]));
      }
    }

    // Upsert product_media row (one row per product)
    const { data: existing } = await svc.from("product_media").select("id").eq("product_id", productId).maybeSingle();
    const payload = {
      product_id: productId,
      hero_url: heroUrl,
      angle_urls: angleUrls,
      spin_urls: spinUrls,
      style_preset: style,
    };
    if (existing?.id) {
      await svc.from("product_media").update(payload).eq("id", existing.id);
    } else {
      await svc.from("product_media").insert(payload);
    }

    return new Response(JSON.stringify({ ok: true, mode, hero: heroUrl, angles: angleUrls, spin: spinUrls, errors }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("enhance-product-image error:", e);
    return new Response(JSON.stringify({ error: e?.message || "Internal error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SB_URL = Deno.env.get("SUPABASE_URL")!;
const SB_SVC = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "site-content";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const safeImagePath = (url: URL) => {
  const directPath = url.pathname.split("/functions/v1/public-site-content/")[1] || "";
  const queryPath = url.searchParams.get("path") || "";
  const path = decodeURIComponent(directPath || queryPath).replace(/^\/+/, "");

  if (!path || path.includes("..") || path.startsWith(".")) return null;
  if (!path.startsWith("products/") && !path.startsWith("content/")) return null;
  return path;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "GET" && req.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const path = safeImagePath(new URL(req.url));
  if (!path) return new Response("Not found", { status: 404, headers: corsHeaders });

  const svc = createClient(SB_URL, SB_SVC);
  const { data, error } = await svc.storage.from(BUCKET).download(path);

  if (error || !data) {
    return new Response("Not found", { status: 404, headers: corsHeaders });
  }

  return new Response(req.method === "HEAD" ? null : data, {
    headers: {
      ...corsHeaders,
      "Content-Type": data.type || "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
});
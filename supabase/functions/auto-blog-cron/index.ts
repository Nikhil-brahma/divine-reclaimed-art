// Twice-weekly auto-blog: invoked by pg_cron on Mon + Thu.
// Picks the next enabled topic from blog_topic_queue (oldest last_used_at, then position)
// and calls auto-seo-engine to generate & publish.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-cron-secret",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const CRON_SECRET = Deno.env.get("CRON_SECRET") || "";
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    // Allow cron secret OR editor
    const cronHeader = req.headers.get("x-cron-secret");
    const isCron = !!CRON_SECRET && cronHeader === CRON_SECRET;
    if (!isCron) {
      const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
      if (!token) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
      const { data: u } = await supabase.auth.getUser(token);
      if (!u?.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
      const { data: ok } = await supabase.rpc("is_editor", { _user_id: u.user.id });
      if (!ok) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
    }

    // Pick next topic: enabled, prefer never-used, then oldest last_used_at, then position
    const { data: topic, error: tErr } = await supabase
      .from("blog_topic_queue")
      .select("*")
      .eq("enabled", true)
      .order("last_used_at", { ascending: true, nullsFirst: true })
      .order("position", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (tErr) throw tErr;
    if (!topic) {
      return new Response(JSON.stringify({ success: false, skipped: true, reason: "no enabled topics" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const invokeRes = await fetch(`${SUPABASE_URL}/functions/v1/auto-seo-engine`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cron-secret": CRON_SECRET,
        "Authorization": `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({
        topic_hint: topic.topic_hint,
        target_keyword: topic.target_keyword || undefined,
        category: topic.category || "Trending",
      }),
    });
    const json = await invokeRes.json();
    if (!invokeRes.ok || !json?.success) {
      return new Response(JSON.stringify({ success: false, error: json?.error || `HTTP ${invokeRes.status}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("blog_topic_queue").update({ last_used_at: new Date().toISOString() }).eq("id", topic.id);

    return new Response(JSON.stringify({ success: true, topic: topic.topic_hint, slug: json.post?.slug }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

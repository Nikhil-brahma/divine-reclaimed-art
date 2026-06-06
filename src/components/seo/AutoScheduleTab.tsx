import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CalendarClock, Zap, Sparkles, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type RecentPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  created_at: string;
  published: boolean;
};

function nextScheduledRuns(count = 3): Date[] {
  // Cron: "0 9 1,15 * *" — 9:00 UTC on the 1st and 15th of every month
  const out: Date[] = [];
  const now = new Date();
  let year = now.getUTCFullYear();
  let month = now.getUTCMonth();
  while (out.length < count) {
    for (const day of [1, 15]) {
      const d = new Date(Date.UTC(year, month, day, 9, 0, 0));
      if (d.getTime() > now.getTime()) out.push(d);
      if (out.length >= count) break;
    }
    month += 1;
    if (month > 11) { month = 0; year += 1; }
  }
  return out;
}

export default function AutoScheduleTab() {
  const [running, setRunning] = useState(false);
  const [recent, setRecent] = useState<RecentPost[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  const loadRecent = async () => {
    setLoadingRecent(true);
    const { data, error } = await supabase
      .from("auto_blog_posts")
      .select("id,title,slug,category,created_at,published")
      .order("created_at", { ascending: false })
      .limit(10);
    if (error) toast.error(error.message);
    setRecent((data ?? []) as RecentPost[]);
    setLoadingRecent(false);
  };

  useEffect(() => { loadRecent(); }, []);

  const runNow = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("auto-seo-engine", { body: { trigger: "manual" } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(data?.message || "Auto-blog generated successfully");
      loadRecent();
    } catch (e: any) {
      toast.error(e.message || "Failed to generate");
    } finally {
      setRunning(false);
    }
  };

  const upcoming = nextScheduledRuns(3);

  return (
    <div className="space-y-6">
      {/* Schedule status */}
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
        <div className="flex items-start gap-3">
          <CalendarClock className="text-primary mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="font-display text-lg text-foreground">Automatic Blog Schedule</h3>
            <p className="font-body text-xs text-muted-foreground mt-1">
              A fresh, fully-SEO-optimized blog post (with AI cover image, schema, meta tags) is generated automatically on the <strong>1st</strong> and <strong>15th</strong> of every month at <strong>09:00 UTC</strong>.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-primary">
              <CheckCircle2 size={14} /> <span>Schedule active</span>
            </div>
            <div className="mt-3 space-y-1">
              <p className="font-body text-[11px] uppercase tracking-wider text-muted-foreground">Next runs</p>
              {upcoming.map((d) => (
                <p key={d.toISOString()} className="font-body text-sm text-foreground">
                  {d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" })} · {d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Manual trigger */}
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <h3 className="font-display text-lg text-foreground flex items-center gap-2">
          <Zap size={18} className="text-primary" /> Generate Auto-Blog Now
        </h3>
        <p className="font-body text-xs text-muted-foreground mt-1">
          Trigger the same end-to-end pipeline immediately — picks a timely topic for this month, drafts the post, generates a cover image and full SEO metadata, and publishes it.
        </p>
        <button
          onClick={runNow}
          disabled={running}
          className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase px-6 py-3 rounded-full hover:bg-primary/90 disabled:opacity-50"
        >
          {running ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {running ? "Generating… (60–90s)" : "Run Auto-Blog Engine"}
        </button>
      </div>

      {/* Recently auto-generated */}
      <div className="rounded-xl border border-border/60 bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-foreground">Recent Posts</h3>
          <button onClick={loadRecent} className="font-body text-xs text-primary hover:underline">Refresh</button>
        </div>
        {loadingRecent ? (
          <div className="flex justify-center py-6"><Loader2 className="animate-spin text-primary" size={20} /></div>
        ) : recent.length === 0 ? (
          <p className="font-body text-sm text-muted-foreground">No posts yet.</p>
        ) : (
          <ul className="divide-y divide-border/40">
            {recent.map((p) => (
              <li key={p.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-body text-sm text-foreground truncate">{p.title}</p>
                  <p className="font-body text-[11px] text-muted-foreground">
                    /{p.slug} · {p.category} · {new Date(p.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${p.published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {p.published ? "Live" : "Draft"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

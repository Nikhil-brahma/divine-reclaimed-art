import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, CalendarClock, Sparkles, Trash2, Play } from "lucide-react";

interface ScheduledRow {
  id: string;
  topic_hint: string;
  target_keyword: string | null;
  category: string | null;
  scheduled_at: string;
  status: string;
  error: string | null;
  post_id: string | null;
  created_at: string;
}

const ScheduleManager = () => {
  const [rows, setRows] = useState<ScheduledRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Instant generate
  const [instantTopic, setInstantTopic] = useState("");
  const [instantKeyword, setInstantKeyword] = useState("");
  const [instantCategory, setInstantCategory] = useState("Trending");
  const [instantBusy, setInstantBusy] = useState(false);

  // Schedule form
  const [topic, setTopic] = useState("");
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Trending");
  const [when, setWhen] = useState(""); // datetime-local
  const [adding, setAdding] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("scheduled_blog_posts")
      .select("*")
      .order("scheduled_at", { ascending: true });
    if (error) toast.error(error.message);
    else setRows((data || []) as ScheduledRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, []);

  const generateNow = async () => {
    if (!instantTopic.trim()) { toast.error("Enter a topic"); return; }
    setInstantBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("auto-seo-engine", {
        body: { topic_hint: instantTopic, target_keyword: instantKeyword || undefined, category: instantCategory },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Failed");
      toast.success(`Published: ${data.post.title}`);
      setInstantTopic(""); setInstantKeyword("");
    } catch (e: any) { toast.error(e.message); }
    finally { setInstantBusy(false); }
  };

  const addSchedule = async () => {
    if (!topic.trim() || !when) { toast.error("Topic and date/time required"); return; }
    const dt = new Date(when);
    if (isNaN(dt.getTime())) { toast.error("Invalid date"); return; }
    setAdding(true);
    const { error } = await supabase.from("scheduled_blog_posts").insert({
      topic_hint: topic,
      target_keyword: keyword || null,
      category: category || "Trending",
      scheduled_at: dt.toISOString(),
    });
    setAdding(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Scheduled");
    setTopic(""); setKeyword(""); setWhen("");
    fetchRows();
  };

  const removeRow = async (id: string) => {
    if (!confirm("Remove this scheduled entry?")) return;
    const { error } = await supabase.from("scheduled_blog_posts").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Removed"); setRows((r) => r.filter((x) => x.id !== id)); }
  };

  const runNow = async (row: ScheduledRow) => {
    if (!confirm(`Generate "${row.topic_hint}" right now?`)) return;
    try {
      await supabase.from("scheduled_blog_posts").update({ status: "processing" }).eq("id", row.id);
      const { data, error } = await supabase.functions.invoke("auto-seo-engine", {
        body: { topic_hint: row.topic_hint, target_keyword: row.target_keyword || undefined, category: row.category || "Trending", scheduled_id: row.id },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || "Failed");
      toast.success("Published");
      fetchRows();
    } catch (e: any) {
      toast.error(e.message);
      await supabase.from("scheduled_blog_posts").update({ status: "failed", error: e.message }).eq("id", row.id);
      fetchRows();
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      pending: "bg-amber-100 text-amber-800",
      processing: "bg-blue-100 text-blue-800",
      published: "bg-emerald-100 text-emerald-800",
      failed: "bg-red-100 text-red-800",
    };
    return <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${map[s] || "bg-muted text-muted-foreground"}`}>{s}</span>;
  };

  return (
    <div className="space-y-8">
      {/* Instant generate */}
      <section className="p-5 rounded-xl border border-primary/30 bg-primary/5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-primary" />
          <h2 className="font-display text-lg">Generate & Publish Now</h2>
        </div>
        <p className="font-body text-xs text-muted-foreground mb-4">
          Type a topic — the AI engine writes a full 1300–1800 word post, generates a cover image, and publishes it immediately.
        </p>
        <div className="grid sm:grid-cols-3 gap-3">
          <input value={instantTopic} onChange={(e) => setInstantTopic(e.target.value)} placeholder="Topic e.g. 'Janmashtami gifting guide'" className="sm:col-span-2 rounded-lg border border-border/50 bg-card p-3 font-body text-sm outline-none focus:border-primary" />
          <input value={instantKeyword} onChange={(e) => setInstantKeyword(e.target.value)} placeholder="Keyword (optional)" className="rounded-lg border border-border/50 bg-card p-3 font-body text-sm outline-none focus:border-primary" />
          <select value={instantCategory} onChange={(e) => setInstantCategory(e.target.value)} className="rounded-lg border border-border/50 bg-card p-3 font-body text-sm outline-none focus:border-primary">
            {["Trending","Heritage","Sustainability","Style Guide","Gifting","Artisans","Festival"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <button onClick={generateNow} disabled={instantBusy} className="sm:col-span-2 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase px-6 py-3 rounded-full hover:bg-primary/90 disabled:opacity-50">
            {instantBusy ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {instantBusy ? "Generating..." : "Generate & Publish Now"}
          </button>
        </div>
      </section>

      {/* Schedule */}
      <section className="p-5 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock size={18} className="text-primary" />
          <h2 className="font-display text-lg">Schedule a Blog Post</h2>
        </div>
        <p className="font-body text-xs text-muted-foreground mb-4">
          Queue a future post. A background worker checks every 5 minutes and auto-publishes when due.
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic e.g. 'Diwali sacred home rituals'" className="rounded-lg border border-border/50 bg-background p-3 font-body text-sm outline-none focus:border-primary" />
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Keyword (optional)" className="rounded-lg border border-border/50 bg-background p-3 font-body text-sm outline-none focus:border-primary" />
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-border/50 bg-background p-3 font-body text-sm outline-none focus:border-primary">
            {["Trending","Heritage","Sustainability","Style Guide","Gifting","Artisans","Festival"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <input type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} className="rounded-lg border border-border/50 bg-background p-3 font-body text-sm outline-none focus:border-primary" />
        </div>
        <button onClick={addSchedule} disabled={adding} className="mt-4 inline-flex items-center gap-2 border border-primary text-primary font-body text-sm tracking-wider uppercase px-6 py-3 rounded-full hover:bg-primary/10 disabled:opacity-50">
          {adding ? <Loader2 size={16} className="animate-spin" /> : <CalendarClock size={16} />}
          Schedule
        </button>
      </section>

      {/* List */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-lg">Scheduled Queue ({rows.length})</h2>
          <button onClick={fetchRows} className="font-body text-xs text-primary hover:underline">Refresh</button>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
        ) : rows.length === 0 ? (
          <p className="text-center font-body text-sm text-muted-foreground py-8">No scheduled posts yet.</p>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.id} className="flex gap-3 items-center p-3 rounded-xl border border-border/50 bg-card">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-display text-sm truncate">{r.topic_hint}</span>
                    {statusBadge(r.status)}
                  </div>
                  <p className="font-body text-[11px] text-muted-foreground mt-0.5">
                    {new Date(r.scheduled_at).toLocaleString()} · {r.category}
                    {r.target_keyword && <> · kw: {r.target_keyword}</>}
                  </p>
                  {r.error && <p className="font-body text-[11px] text-red-600 mt-0.5">{r.error}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {r.status === "pending" && (
                    <button onClick={() => runNow(r)} className="font-body text-[11px] uppercase tracking-wider text-primary hover:underline inline-flex items-center gap-1 px-2 py-1">
                      <Play size={11} /> Run now
                    </button>
                  )}
                  <button onClick={() => removeRow(r.id)} className="font-body text-[11px] uppercase tracking-wider text-destructive hover:underline inline-flex items-center gap-1 px-2 py-1">
                    <Trash2 size={11} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ScheduleManager;

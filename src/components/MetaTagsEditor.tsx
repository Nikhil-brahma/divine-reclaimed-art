import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

const META_FIELDS = [
  { key: "meta:title", label: "Page Title (≤60 chars)", placeholder: "Punarvsu — Handcrafted Bags from Sacred Temple Textiles | Delhi" },
  { key: "meta:description", label: "Meta Description (≤160 chars)", placeholder: "Shop handcrafted bags from upcycled sacred temple textiles…" },
  { key: "meta:keywords", label: "Keywords (comma-separated)", placeholder: "temple textiles, upcycled bags, sacred fashion, Delhi artisans" },
  { key: "meta:image", label: "OG / Social Image URL", placeholder: "https://…/og-image.png" },
  { key: "meta:og_title", label: "OG Title (Facebook / LinkedIn)", placeholder: "Optional — defaults to Page Title" },
  { key: "meta:og_description", label: "OG Description (Facebook / LinkedIn)", placeholder: "Optional — defaults to Meta Description" },
];

const SUGGESTED_PAGES = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/blog", label: "Blog" },
  { path: "/privacy", label: "Privacy" },
  { path: "/terms", label: "Terms" },
  { path: "/shipping", label: "Shipping" },
];

export default function MetaTagsEditor() {
  const [pagePath, setPagePath] = useState("/");
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = async (path: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_overrides")
      .select("key,text_value")
      .eq("page_path", path)
      .like("key", "meta:%");
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    const map: Record<string, string> = {};
    data?.forEach((r) => { map[r.key] = r.text_value || ""; });
    setValues(map);
  };

  useEffect(() => { load(pagePath); }, [pagePath]);

  const save = async () => {
    setSaving(true);
    try {
      const rows = META_FIELDS
        .filter((f) => (values[f.key] ?? "").trim().length > 0)
        .map((f) => ({
          page_path: pagePath,
          key: f.key,
          text_value: values[f.key].trim(),
          image_url: null,
          alt_text: null,
        }));

      // Delete cleared fields
      const cleared = META_FIELDS
        .filter((f) => !(values[f.key] ?? "").trim())
        .map((f) => f.key);
      if (cleared.length) {
        await supabase.from("content_overrides")
          .delete()
          .eq("page_path", pagePath)
          .in("key", cleared);
      }

      if (rows.length) {
        const { error } = await supabase
          .from("content_overrides")
          .upsert(rows, { onConflict: "page_path,key" });
        if (error) throw error;
      }
      toast.success(`Meta tags saved for ${pagePath}`);
    } catch (e: any) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border/50 rounded-xl p-5">
        <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Page</label>
        <div className="flex flex-wrap gap-2 mt-2 mb-3">
          {SUGGESTED_PAGES.map((p) => (
            <button
              key={p.path}
              onClick={() => setPagePath(p.path)}
              className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                pagePath === p.path
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/50 text-muted-foreground hover:border-primary/40"
              }`}
            >
              {p.label} <span className="opacity-60">{p.path}</span>
            </button>
          ))}
        </div>
        <Input
          value={pagePath}
          onChange={(e) => setPagePath(e.target.value || "/")}
          placeholder="/ (any path, e.g. /products/divine-potli)"
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Edit meta tags for any page by entering its path. For dynamic product pages use <code>/products/&lt;handle&gt;</code>.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>
      ) : (
        <div className="space-y-4">
          {META_FIELDS.map((f) => (
            <div key={f.key} className="bg-card border border-border/50 rounded-xl p-4">
              <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">{f.label}</label>
              {f.key === "meta:description" || f.key === "meta:og_description" ? (
                <textarea
                  value={values[f.key] || ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  rows={3}
                  className="mt-2 w-full bg-background border border-border/50 rounded-lg p-3 font-body text-sm focus:outline-none focus:border-primary/50 resize-y"
                />
              ) : (
                <Input
                  value={values[f.key] || ""}
                  onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="mt-2"
                />
              )}
              <div className="text-[10px] text-muted-foreground mt-1">
                {(values[f.key] || "").length} chars
              </div>
            </div>
          ))}

          <Button onClick={save} disabled={saving} className="w-full sm:w-auto">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Meta Tags
          </Button>
        </div>
      )}
    </div>
  );
}

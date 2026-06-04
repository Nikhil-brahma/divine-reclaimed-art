import { useMemo, useState } from "react";
import {
  Search, Share2, Settings2, Code2, Eye, CheckCircle2, AlertTriangle, XCircle,
  Globe, Image as ImageIcon, Twitter, Facebook, ListTree,
} from "lucide-react";

export type BlogSEO = {
  // Search
  seo_title: string;
  seo_description: string;
  canonical_url: string;
  focus_keyword: string;
  secondary_keywords: string;
  // Social – OG
  og_title: string;
  og_description: string;
  og_image: string;
  // Social – Twitter
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  twitter_card: "summary" | "summary_large_image";
  // Indexing
  robots_index: boolean;
  robots_follow: boolean;
  include_in_sitemap: boolean;
  // Cover image SEO
  image_alt: string;
  image_title: string;
  image_caption: string;
  // Schema
  schema_type: "BlogPosting" | "Article" | "NewsArticle" | "FAQPage" | "Custom";
  custom_schema: string; // JSON-LD as string
};

export const emptyBlogSEO: BlogSEO = {
  seo_title: "", seo_description: "", canonical_url: "", focus_keyword: "", secondary_keywords: "",
  og_title: "", og_description: "", og_image: "",
  twitter_title: "", twitter_description: "", twitter_image: "", twitter_card: "summary_large_image",
  robots_index: true, robots_follow: true, include_in_sitemap: true,
  image_alt: "", image_title: "", image_caption: "",
  schema_type: "BlogPosting", custom_schema: "",
};

type SubTab = "search" | "social" | "advanced" | "schema" | "preview" | "analysis";

const SITE_URL = "https://punarvsu.com";

type DraftLike = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  existing_image_url: string | null;
};

function countHeadings(content: string) {
  const h1 = (content.match(/^# .+$/gm) || []).length;
  const h2 = (content.match(/^## .+$/gm) || []).length;
  const h3 = (content.match(/^### .+$/gm) || []).length;
  return { h1, h2, h3 };
}

function imagesInContent(content: string): string[] {
  return [...content.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)].map((m) => m[1] ?? "");
}

function internalLinkSuggestions(content: string, allSlugs: string[]) {
  const lower = content.toLowerCase();
  return allSlugs
    .filter((s) => s && !lower.includes(`/blog/ai/${s}`))
    .slice(0, 5)
    .map((slug) => `/blog/ai/${slug}`);
}

function readingScore(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean);
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const wordCount = words.length;
  const avgWordsPerSentence = sentences.length ? wordCount / sentences.length : 0;
  // Crude Flesch-ish heuristic
  let score = 100;
  if (avgWordsPerSentence > 22) score -= 15;
  if (avgWordsPerSentence > 30) score -= 20;
  if (wordCount < 600) score -= 20;
  if (wordCount < 300) score -= 30;
  return { wordCount, avgWordsPerSentence: Math.round(avgWordsPerSentence), score: Math.max(0, Math.min(100, score)) };
}

function seoScore(seo: BlogSEO, draft: DraftLike) {
  let score = 0;
  const max = 100;
  const checks: { label: string; pass: boolean; weight: number; severity: "ok" | "warn" | "error" }[] = [];

  const title = (seo.seo_title || draft.title || "").trim();
  const desc = (seo.seo_description || draft.excerpt || "").trim();
  const kw = seo.focus_keyword.trim().toLowerCase();

  const push = (label: string, pass: boolean, weight: number, severity: "ok" | "warn" | "error" = "warn") => {
    checks.push({ label, pass, weight, severity });
    if (pass) score += weight;
  };

  push("SEO title present", !!title, 8, "error");
  push("SEO title 30–60 chars", title.length >= 30 && title.length <= 60, 8);
  push("Meta description present", !!desc, 8, "error");
  push("Meta description 80–160 chars", desc.length >= 80 && desc.length <= 160, 8);
  push("Slug is concise (≤ 60 chars)", !!draft.slug && draft.slug.length <= 60, 4);
  push("Focus keyword set", !!kw, 8, "error");
  push("Focus keyword in title", !!kw && title.toLowerCase().includes(kw), 8);
  push("Focus keyword in description", !!kw && desc.toLowerCase().includes(kw), 6);
  push("Focus keyword in slug", !!kw && draft.slug.toLowerCase().includes(kw.replace(/\s+/g, "-")), 4);
  push("Focus keyword in body", !!kw && draft.content.toLowerCase().includes(kw), 8);
  push("Cover image set", !!draft.existing_image_url, 4);
  push("Cover image alt text set", !!seo.image_alt.trim(), 6, "error");
  push("Open Graph title or fallback", !!(seo.og_title || title), 3);
  push("Open Graph image", !!(seo.og_image || draft.existing_image_url), 3);
  push("Robots allows indexing", seo.robots_index, 4);
  push("Included in sitemap", seo.include_in_sitemap, 2);
  push("Has at least one H2", countHeadings(draft.content).h2 >= 1, 6);
  push("Body is 600+ words", draft.content.split(/\s+/).filter(Boolean).length >= 600, 6);
  push("Canonical URL valid or auto", !seo.canonical_url || /^https?:\/\//.test(seo.canonical_url), 2, "warn");

  return { score: Math.min(max, score), checks };
}

function validate(seo: BlogSEO, draft: DraftLike) {
  const issues: { level: "error" | "warn"; msg: string }[] = [];
  const title = (seo.seo_title || draft.title || "").trim();
  const desc = (seo.seo_description || draft.excerpt || "").trim();
  const heads = countHeadings(draft.content);

  if (!title) issues.push({ level: "error", msg: "SEO title is missing." });
  else if (title.length > 60) issues.push({ level: "warn", msg: `SEO title is ${title.length} chars (recommended ≤ 60).` });
  if (!desc) issues.push({ level: "error", msg: "Meta description is missing." });
  else if (desc.length > 160) issues.push({ level: "warn", msg: `Meta description is ${desc.length} chars (recommended ≤ 160).` });

  if (heads.h1 > 0) issues.push({ level: "warn", msg: `Body contains ${heads.h1} H1 heading(s) — the post title is already H1.` });
  if (heads.h2 === 0) issues.push({ level: "warn", msg: "No H2 headings in body — break up content for readability." });

  const altMissing = imagesInContent(draft.content).filter((a) => !a.trim()).length;
  if (altMissing > 0) issues.push({ level: "warn", msg: `${altMissing} inline image(s) missing alt text.` });

  if (draft.existing_image_url && !seo.image_alt.trim()) {
    issues.push({ level: "error", msg: "Cover image has no alt text." });
  }

  if (seo.canonical_url && !/^https?:\/\//.test(seo.canonical_url)) {
    issues.push({ level: "error", msg: "Canonical URL must start with http:// or https://" });
  }

  if (seo.schema_type === "Custom" && seo.custom_schema.trim()) {
    try { JSON.parse(seo.custom_schema); }
    catch { issues.push({ level: "error", msg: "Custom JSON-LD is not valid JSON." }); }
  }

  if (!seo.robots_index) issues.push({ level: "warn", msg: "Robots noindex is ON — this page will not appear in search." });
  if (!seo.include_in_sitemap) issues.push({ level: "warn", msg: "Excluded from sitemap.xml." });

  return issues;
}

const tabBtn = (active: boolean) =>
  `flex items-center gap-2 px-3 py-2 text-xs font-body uppercase tracking-wider border-b-2 transition-colors ${
    active ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
  }`;

const inputCls = "mt-1 w-full rounded-lg border border-border/50 bg-card p-2.5 font-body text-sm focus:border-primary outline-none";
const labelCls = "font-body text-[11px] uppercase tracking-wider text-muted-foreground";

const Counter = ({ value, min, max }: { value: string; min: number; max: number }) => {
  const n = value.length;
  const ok = n >= min && n <= max;
  return (
    <span className={`text-[10px] font-mono ${ok ? "text-emerald-600" : n > max ? "text-destructive" : "text-amber-600"}`}>
      {n}/{max}
    </span>
  );
};

export default function BlogSEOPanel({
  value, onChange, draft, allSlugs = [],
}: {
  value: BlogSEO;
  onChange: (next: BlogSEO) => void;
  draft: DraftLike;
  allSlugs?: string[];
}) {
  const [sub, setSub] = useState<SubTab>("search");
  const set = <K extends keyof BlogSEO>(k: K, v: BlogSEO[K]) => onChange({ ...value, [k]: v });

  const computed = useMemo(() => {
    const title = value.seo_title || draft.title || "Untitled";
    const description = value.seo_description || draft.excerpt || "";
    const url = value.canonical_url || `${SITE_URL}/blog/ai/${draft.slug || "your-post"}`;
    const ogImage = value.og_image || draft.existing_image_url || "";
    const twImage = value.twitter_image || ogImage;
    return { title, description, url, ogImage, twImage };
  }, [value, draft]);

  const { score, checks } = useMemo(() => seoScore(value, draft), [value, draft]);
  const reading = useMemo(() => readingScore(draft.content), [draft.content]);
  const issues = useMemo(() => validate(value, draft), [value, draft]);
  const linkSuggestions = useMemo(() => internalLinkSuggestions(draft.content, allSlugs), [draft.content, allSlugs]);
  const heads = useMemo(() => countHeadings(draft.content), [draft.content]);

  const scoreColor = score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-destructive";

  return (
    <div className="rounded-2xl border border-border/50 bg-card/40">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 border-b border-border/40">
        <div>
          <h3 className="font-display text-lg text-foreground">SEO Settings</h3>
          <p className="font-body text-xs text-muted-foreground">Per-post search, social, schema & validation — Wix-style.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">SEO Score</div>
            <div className={`font-display text-2xl ${scoreColor}`}>{score}<span className="text-sm text-muted-foreground">/100</span></div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Readability</div>
            <div className="font-display text-2xl text-foreground">{reading.score}</div>
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex flex-wrap gap-1 px-3 border-b border-border/40 overflow-x-auto">
        <button onClick={() => setSub("search")} className={tabBtn(sub === "search")}><Search size={12} /> Search</button>
        <button onClick={() => setSub("social")} className={tabBtn(sub === "social")}><Share2 size={12} /> Social</button>
        <button onClick={() => setSub("advanced")} className={tabBtn(sub === "advanced")}><Settings2 size={12} /> Advanced</button>
        <button onClick={() => setSub("schema")} className={tabBtn(sub === "schema")}><Code2 size={12} /> Schema</button>
        <button onClick={() => setSub("preview")} className={tabBtn(sub === "preview")}><Eye size={12} /> Preview</button>
        <button onClick={() => setSub("analysis")} className={tabBtn(sub === "analysis")}><ListTree size={12} /> Analysis</button>
      </div>

      <div className="p-4 space-y-4">
        {/* SEARCH */}
        {sub === "search" && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between"><label className={labelCls}>SEO Title</label><Counter value={value.seo_title || draft.title} min={30} max={60} /></div>
              <input className={inputCls} value={value.seo_title} placeholder={draft.title || "Sacred Threads: How Temple Textiles Become Heirlooms"} onChange={(e) => set("seo_title", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between"><label className={labelCls}>Meta Description</label><Counter value={value.seo_description || draft.excerpt} min={80} max={160} /></div>
              <textarea className={`${inputCls} h-20 resize-none`} value={value.seo_description} placeholder={draft.excerpt || "Short, compelling summary that appears in Google results."} onChange={(e) => set("seo_description", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Permalink (slug)</label>
              <div className="mt-1 flex items-stretch rounded-lg border border-border/50 bg-card overflow-hidden">
                <span className="px-2.5 flex items-center font-mono text-[11px] text-muted-foreground bg-muted/40">{SITE_URL}/blog/ai/</span>
                <input className="flex-1 p-2.5 bg-transparent font-mono text-sm outline-none" value={draft.slug} readOnly />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">Change in the main editor field above.</p>
            </div>
            <div>
              <label className={labelCls}>Canonical URL (optional)</label>
              <input className={inputCls} value={value.canonical_url} placeholder={computed.url} onChange={(e) => set("canonical_url", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Focus Keyword</label>
              <input className={inputCls} value={value.focus_keyword} placeholder="upcycled temple bags" onChange={(e) => set("focus_keyword", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Secondary Keywords (comma-separated)</label>
              <input className={inputCls} value={value.secondary_keywords} placeholder="sacred textile, sustainable fashion India" onChange={(e) => set("secondary_keywords", e.target.value)} />
            </div>
          </div>
        )}

        {/* SOCIAL */}
        {sub === "social" && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="font-display text-sm flex items-center gap-2 text-foreground"><Facebook size={14} /> Open Graph (Facebook/LinkedIn)</div>
              <div>
                <label className={labelCls}>OG Title</label>
                <input className={inputCls} value={value.og_title} placeholder={computed.title} onChange={(e) => set("og_title", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>OG Description</label>
                <textarea className={`${inputCls} h-16 resize-none`} value={value.og_description} placeholder={computed.description} onChange={(e) => set("og_description", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>OG Image URL</label>
                <input className={inputCls} value={value.og_image} placeholder={draft.existing_image_url || "https://…/cover.jpg"} onChange={(e) => set("og_image", e.target.value)} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="font-display text-sm flex items-center gap-2 text-foreground"><Twitter size={14} /> Twitter / X</div>
              <div>
                <label className={labelCls}>Card Type</label>
                <select className={inputCls} value={value.twitter_card} onChange={(e) => set("twitter_card", e.target.value as any)}>
                  <option value="summary_large_image">summary_large_image</option>
                  <option value="summary">summary</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Twitter Title</label>
                <input className={inputCls} value={value.twitter_title} placeholder={computed.title} onChange={(e) => set("twitter_title", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Twitter Description</label>
                <textarea className={`${inputCls} h-16 resize-none`} value={value.twitter_description} placeholder={computed.description} onChange={(e) => set("twitter_description", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Twitter Image URL</label>
                <input className={inputCls} value={value.twitter_image} placeholder={computed.ogImage} onChange={(e) => set("twitter_image", e.target.value)} />
              </div>
            </div>

            <div className="md:col-span-2 border-t border-border/40 pt-4">
              <div className="font-display text-sm flex items-center gap-2 text-foreground mb-3"><ImageIcon size={14} /> Cover Image SEO</div>
              <div className="grid sm:grid-cols-3 gap-3">
                <div><label className={labelCls}>Alt Text *</label><input className={inputCls} value={value.image_alt} onChange={(e) => set("image_alt", e.target.value)} placeholder="Artisans embroidering crimson temple silk" /></div>
                <div><label className={labelCls}>Image Title</label><input className={inputCls} value={value.image_title} onChange={(e) => set("image_title", e.target.value)} placeholder="Temple silk embroidery" /></div>
                <div><label className={labelCls}>Caption</label><input className={inputCls} value={value.image_caption} onChange={(e) => set("image_caption", e.target.value)} placeholder="Photo: Sampurna NGO workshop, Rohini" /></div>
              </div>
            </div>
          </div>
        )}

        {/* ADVANCED */}
        {sub === "advanced" && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-3">
              <label className="flex items-center gap-2 p-3 rounded-lg border border-border/50 cursor-pointer hover:border-primary/40">
                <input type="checkbox" className="accent-primary" checked={value.robots_index} onChange={(e) => set("robots_index", e.target.checked)} />
                <span className="font-body text-sm">Allow Indexing <span className="text-[10px] text-muted-foreground block">index / noindex</span></span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-border/50 cursor-pointer hover:border-primary/40">
                <input type="checkbox" className="accent-primary" checked={value.robots_follow} onChange={(e) => set("robots_follow", e.target.checked)} />
                <span className="font-body text-sm">Follow Links <span className="text-[10px] text-muted-foreground block">follow / nofollow</span></span>
              </label>
              <label className="flex items-center gap-2 p-3 rounded-lg border border-border/50 cursor-pointer hover:border-primary/40">
                <input type="checkbox" className="accent-primary" checked={value.include_in_sitemap} onChange={(e) => set("include_in_sitemap", e.target.checked)} />
                <span className="font-body text-sm">Include in sitemap.xml <span className="text-[10px] text-muted-foreground block">XML sitemap</span></span>
              </label>
            </div>

            <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
              <div className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1"><Globe size={12} /> Resolved robots tag</div>
              <code className="font-mono text-xs text-foreground break-all">
                &lt;meta name="robots" content="{value.robots_index ? "index" : "noindex"}, {value.robots_follow ? "follow" : "nofollow"}" /&gt;
              </code>
            </div>

            <div>
              <div className="font-display text-sm text-foreground mb-2">Internal linking suggestions</div>
              {linkSuggestions.length === 0 ? (
                <p className="text-xs text-muted-foreground">No suggestions — all recent posts are already linked from this content.</p>
              ) : (
                <ul className="space-y-1">
                  {linkSuggestions.map((href) => (
                    <li key={href} className="font-mono text-xs text-primary">{href}</li>
                  ))}
                </ul>
              )}
              <p className="text-[10px] text-muted-foreground mt-1">Copy these into the body as Markdown links to strengthen internal linking.</p>
            </div>
          </div>
        )}

        {/* SCHEMA */}
        {sub === "schema" && (
          <div className="space-y-3">
            <div>
              <label className={labelCls}>Schema Type</label>
              <select className={inputCls} value={value.schema_type} onChange={(e) => set("schema_type", e.target.value as any)}>
                <option value="BlogPosting">BlogPosting (recommended)</option>
                <option value="Article">Article</option>
                <option value="NewsArticle">NewsArticle</option>
                <option value="FAQPage">FAQPage</option>
                <option value="Custom">Custom JSON-LD</option>
              </select>
            </div>
            {value.schema_type === "Custom" ? (
              <div>
                <label className={labelCls}>Custom JSON-LD</label>
                <textarea
                  className={`${inputCls} h-56 font-mono text-xs`}
                  value={value.custom_schema}
                  onChange={(e) => set("custom_schema", e.target.value)}
                  placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": []\n}`}
                />
              </div>
            ) : (
              <div className="rounded-lg border border-border/50 p-3 bg-muted/20">
                <div className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Auto-generated JSON-LD preview</div>
                <pre className="font-mono text-[11px] text-foreground whitespace-pre-wrap break-all">{JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": value.schema_type,
                  headline: computed.title,
                  description: computed.description,
                  image: computed.ogImage || undefined,
                  mainEntityOfPage: computed.url,
                  author: { "@type": "Organization", name: "Punarvsu" },
                  publisher: { "@type": "Organization", name: "Punarvsu", logo: { "@type": "ImageObject", url: `${SITE_URL}/lovable-uploads/552a4819-fe43-46cc-876c-80489ab608d6.png` } },
                  keywords: [value.focus_keyword, ...value.secondary_keywords.split(",").map((s) => s.trim()).filter(Boolean)].filter(Boolean).join(", ") || undefined,
                }, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* PREVIEW */}
        {sub === "preview" && (
          <div className="space-y-6">
            <div>
              <div className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Google Search Preview</div>
              <div className="rounded-lg border border-border/50 bg-background p-4 max-w-xl">
                <div className="text-xs text-emerald-700 truncate">{computed.url}</div>
                <div className="text-[#1a0dab] text-lg leading-tight mt-0.5 hover:underline cursor-pointer truncate">{computed.title}</div>
                <div className="text-sm text-muted-foreground line-clamp-2 mt-1">{computed.description || "No description set."}</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Facebook / LinkedIn card</div>
                <div className="rounded-lg border border-border/50 overflow-hidden max-w-md bg-background">
                  {computed.ogImage ? (
                    <img src={computed.ogImage} alt="" className="w-full aspect-[1.91/1] object-cover" />
                  ) : (
                    <div className="w-full aspect-[1.91/1] bg-muted flex items-center justify-center text-xs text-muted-foreground">No image</div>
                  )}
                  <div className="p-3 bg-muted/30">
                    <div className="text-[10px] uppercase text-muted-foreground truncate">{new URL(computed.url || SITE_URL).hostname}</div>
                    <div className="text-sm font-medium text-foreground truncate">{value.og_title || computed.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{value.og_description || computed.description}</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="font-body text-xs uppercase tracking-wider text-muted-foreground mb-2">Twitter / X card ({value.twitter_card})</div>
                <div className="rounded-2xl border border-border/50 overflow-hidden max-w-md bg-background">
                  {computed.twImage ? (
                    <img src={computed.twImage} alt="" className={value.twitter_card === "summary" ? "w-32 h-32 object-cover" : "w-full aspect-[1.91/1] object-cover"} />
                  ) : (
                    <div className="w-full aspect-[1.91/1] bg-muted flex items-center justify-center text-xs text-muted-foreground">No image</div>
                  )}
                  <div className="p-3">
                    <div className="text-sm font-medium text-foreground truncate">{value.twitter_title || computed.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{value.twitter_description || computed.description}</div>
                    <div className="text-[10px] text-muted-foreground mt-1 truncate">{new URL(computed.url || SITE_URL).hostname}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ANALYSIS */}
        {sub === "analysis" && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-4 gap-3">
              <Stat label="Word count" value={reading.wordCount} />
              <Stat label="Avg words/sentence" value={reading.avgWordsPerSentence} />
              <Stat label="H2 / H3" value={`${heads.h2} / ${heads.h3}`} />
              <Stat label="Inline images" value={imagesInContent(draft.content).length} />
            </div>

            <div>
              <div className="font-display text-sm text-foreground mb-2">Validation</div>
              {issues.length === 0 ? (
                <div className="flex items-center gap-2 text-emerald-700 text-sm"><CheckCircle2 size={16} /> No issues — your post is publish-ready.</div>
              ) : (
                <ul className="space-y-1.5">
                  {issues.map((it, i) => (
                    <li key={i} className={`flex items-start gap-2 text-sm ${it.level === "error" ? "text-destructive" : "text-amber-700"}`}>
                      {it.level === "error" ? <XCircle size={14} className="mt-0.5 flex-shrink-0" /> : <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />}
                      <span>{it.msg}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <div className="font-display text-sm text-foreground mb-2">SEO checks ({checks.filter(c => c.pass).length}/{checks.length} passing)</div>
              <ul className="grid sm:grid-cols-2 gap-1.5">
                {checks.map((c) => (
                  <li key={c.label} className={`flex items-center gap-2 text-xs ${c.pass ? "text-emerald-700" : "text-muted-foreground"}`}>
                    {c.pass ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {c.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Stat = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-lg border border-border/50 p-3 bg-card">
    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    <div className="font-display text-xl text-foreground">{value}</div>
  </div>
);

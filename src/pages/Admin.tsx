import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, Sparkles, FileText, Search, BarChart3, Globe, Loader2, PenSquare,
  ListChecks, Image as ImageIcon, Trash2, Eye, EyeOff, Plus, CalendarClock, Tag,
  Package, Mail, LayoutDashboard, Users, Menu, X, Upload,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import EditorsManager from "@/components/EditorsManager";
import MetaTagsEditor from "@/components/MetaTagsEditor";
import ScheduleManager from "@/components/ScheduleManager";
import ProductsManager from "@/components/admin/ProductsManager";
import MessagesPanel from "@/components/admin/MessagesPanel";
import OrdersPanel from "@/components/admin/OrdersPanel";
import { useEditMode } from "@/contexts/EditModeContext";
import SEOHead from "@/components/SEOHead";

type Action = "generate_meta" | "generate_blog_ideas" | "generate_blog_post" | "optimize_content" | "generate_indexing_ping";
type Section = "overview" | "ai" | "write" | "schedule" | "blogs" | "meta" | "editors" | "products" | "messages" | "orders" | "live-edit";

interface BlogPost {
  id: string; slug: string; title: string; excerpt: string; content: string;
  category: string; target_keyword: string | null; occasion: string | null;
  published: boolean; cover_image_url: string | null; created_at: string; updated_at: string;
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

const emptyDraft = {
  id: "" as string | undefined, title: "", slug: "", excerpt: "", content: "",
  category: "Trending", target_keyword: "", occasion: "", published: true,
  generate_image: true, image_prompt: "", existing_image_url: "" as string | null,
};

const aiTools: { action: Action; label: string; icon: typeof Sparkles; description: string }[] = [
  { action: "generate_blog_ideas", label: "Blog Ideas", icon: Sparkles, description: "AI-generated topics for Google, ChatGPT & Perplexity" },
  { action: "generate_blog_post", label: "Draft Blog Post", icon: FileText, description: "Full SEO/AEO draft — push to the editor" },
  { action: "generate_meta", label: "Meta Tags", icon: Search, description: "Generate optimized title, description & OG tags" },
  { action: "optimize_content", label: "Content Audit", icon: BarChart3, description: "Score content for SEO, AEO & local GEO" },
  { action: "generate_indexing_ping", label: "Indexing Plan", icon: Globe, description: "Sitemap & search console submission plan" },
];

const navGroups: { label: string; items: { id: Section; label: string; icon: typeof Sparkles }[] }[] = [
  {
    label: "Overview",
    items: [{ id: "overview", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Store",
    items: [
      { id: "products", label: "Products", icon: Package },
      { id: "orders", label: "Orders", icon: ListChecks },
      { id: "messages", label: "Messages", icon: Mail },
    ],
  },
  {
    label: "Content",
    items: [
      { id: "ai", label: "AI Tools", icon: Sparkles },
      { id: "write", label: "Write & Publish", icon: PenSquare },
      { id: "schedule", label: "Schedule", icon: CalendarClock },
      { id: "blogs", label: "Manage Blogs", icon: ListChecks },
    ],
  },
  {
    label: "Site & SEO",
    items: [
      { id: "meta", label: "Meta Tags", icon: Tag },
      { id: "live-edit", label: "Live Site Edit", icon: PenSquare },
      { id: "editors", label: "Editors", icon: Users },
    ],
  },
];

const Admin = () => {
  const { editMode, setEditMode, isEditor, user } = useEditMode();
  const [section, setSection] = useState<Section>(() => {
    const hash = window.location.hash.replace("#", "") as Section;
    const all = navGroups.flatMap(g => g.items.map(i => i.id));
    return (all.includes(hash) ? hash : "overview") as Section;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin panel must only run on the lovable.app subdomain — redirect away from custom domains
  useEffect(() => {
    const host = window.location.hostname;
    if (host === "punarvsu.com" || host === "www.punarvsu.com") {
      window.location.replace(`https://divine-reclaimed-art.lovable.app${window.location.pathname}${window.location.hash}`);
    }
  }, []);

  useEffect(() => { window.location.hash = section; }, [section]);

  // AI tools state
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Editor state
  const [draft, setDraft] = useState({ ...emptyDraft });
  const [publishing, setPublishing] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  // Blog manage state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  // Overview counts
  const [counts, setCounts] = useState({ products: 0, posts: 0, scheduled: 0, unread: 0 });

  useEffect(() => {
    if (!slugTouched) setDraft((d) => ({ ...d, slug: slugify(d.title) }));
  }, [draft.title, slugTouched]);

  useEffect(() => {
    if (section === "blogs") fetchPosts();
    if (section === "overview") loadCounts();
  }, [section]);

  const loadCounts = async () => {
    const [a, b, c, d] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("auto_blog_posts").select("id", { count: "exact", head: true }),
      supabase.from("scheduled_blog_posts").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("contact_messages").select("id", { count: "exact", head: true }).eq("read", false),
    ]);
    setCounts({
      products: a.count || 0,
      posts: b.count || 0,
      scheduled: c.count || 0,
      unread: d.count || 0,
    });
  };

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("publish-blog-post", { body: { op: "list" } });
      if (error) throw error;
      setPosts(data?.posts ?? []);
    } catch (e: any) { toast.error(e.message || "Failed to load posts"); }
    finally { setPostsLoading(false); }
  };

  const handleGenerate = async () => {
    if (!selectedAction) return;
    if (!content && selectedAction !== "generate_indexing_ping") { toast.error("Please enter some content or a topic"); return; }
    setLoading(true); setResult("");
    try {
      const { data, error } = await supabase.functions.invoke("seo-optimizer", { body: { action: selectedAction, content, keywords } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data?.result || "No result returned");
      toast.success("Generated!");
    } catch (e: any) { toast.error(e.message || "Something went wrong"); }
    finally { setLoading(false); }
  };

  const sendToEditor = () => {
    if (!result) return;
    const firstLine = result.split("\n").find((l) => l.trim().length > 0) || "";
    const title = firstLine.replace(/^[#*\s]+/, "").replace(/\*+$/, "").slice(0, 110);
    const excerpt = result.replace(/[#*]/g, "").split("\n").filter((l) => l.trim()).slice(1, 3).join(" ").slice(0, 200);
    setDraft({ ...emptyDraft, title, excerpt, content: result, target_keyword: keywords, generate_image: true, image_prompt: title });
    setSlugTouched(false);
    setSection("write");
    toast.success("Draft loaded into editor");
  };

  const handlePublish = async (asDraft = false) => {
    if (!draft.title || !draft.excerpt || !draft.content) { toast.error("Title, excerpt and content are required"); return; }
    setPublishing(true);
    try {
      const { data, error } = await supabase.functions.invoke("publish-blog-post", {
        body: {
          op: draft.id ? "update" : "publish",
          id: draft.id || undefined,
          title: draft.title, slug: draft.slug || slugify(draft.title),
          excerpt: draft.excerpt, content: draft.content,
          category: draft.category, target_keyword: draft.target_keyword,
          occasion: draft.occasion, published: !asDraft,
          generate_image: draft.generate_image, image_prompt: draft.image_prompt || draft.title,
          existing_image_url: draft.existing_image_url,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(asDraft ? "Saved as draft" : "Published!");
      setDraft({ ...emptyDraft }); setSlugTouched(false); setSection("blogs");
    } catch (e: any) { toast.error(e.message || "Publish failed"); }
    finally { setPublishing(false); }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      await supabase.functions.invoke("publish-blog-post", { body: { op: "toggle_publish", id: post.id, published: !post.published } });
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p)));
    } catch { toast.error("Failed to update"); }
  };

  const deletePost = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"?`)) return;
    try {
      await supabase.functions.invoke("publish-blog-post", { body: { op: "delete", id: post.id } });
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      toast.success("Deleted");
    } catch { toast.error("Delete failed"); }
  };

  const editPost = (post: BlogPost) => {
    setDraft({
      id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt,
      content: post.content, category: post.category, target_keyword: post.target_keyword || "",
      occasion: post.occasion || "", published: post.published, generate_image: false,
      image_prompt: post.title, existing_image_url: post.cover_image_url,
    });
    setSlugTouched(true); setSection("write");
  };

  const placeholder = useMemo(() => {
    switch (selectedAction) {
      case "generate_blog_ideas": return "Enter focus area (e.g., 'temple fashion 2026')...";
      case "generate_blog_post": return "Enter blog topic...";
      case "generate_meta": return "Paste page content to generate optimized meta tags...";
      case "optimize_content": return "Paste existing content for SEO/AEO/GEO scoring...";
      default: return "";
    }
  }, [selectedAction]);

  if (!user) return <Navigate to="/auth" replace />;
  if (!isEditor) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="font-display text-2xl mb-2">Access restricted</h1>
          <p className="text-muted-foreground">Your account does not have editor access.</p>
        </div>
      </div>
    );
  }

  const currentTitle = navGroups.flatMap(g => g.items).find(i => i.id === section)?.label || "Admin";

  return (
    <div className="min-h-screen bg-background flex">
      <SEOHead title="Admin Panel" description="Punarvsu admin dashboard — content, orders, products, and messages." noindex />
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky top-0 left-0 h-screen w-64 bg-card border-r border-border/50 z-40 transition-transform overflow-y-auto`}>
        <div className="p-5 border-b border-border/50">
          <Link to="/" className="inline-flex items-center gap-2 font-body text-xs text-muted-foreground hover:text-primary">
            <ArrowLeft size={14} /> Back to Site
          </Link>
          <h2 className="font-display text-lg mt-3">Admin Panel</h2>
          <p className="font-body text-[11px] text-muted-foreground">Punarvsu Command Centre</p>
        </div>
        <nav className="p-3 space-y-5">
          {navGroups.map((g) => (
            <div key={g.label}>
              <div className="font-body text-[10px] uppercase tracking-wider text-muted-foreground/70 px-3 mb-1.5">{g.label}</div>
              <div className="space-y-0.5">
                {g.items.map((it) => (
                  <button key={it.id}
                    onClick={() => { setSection(it.id); setSidebarOpen(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-body text-sm transition-colors ${section === it.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}>
                    <it.icon size={15} />
                    <span className="flex-1 text-left">{it.label}</span>
                    {it.id === "messages" && counts.unread > 0 && (
                      <span className="text-[10px] bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded-full">{counts.unread}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-30" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-border/50 px-5 lg:px-8 py-3 flex items-center gap-3">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}><Menu size={20} /></button>
          <h1 className="font-display text-lg flex-1">{currentTitle}</h1>
        </header>

        <div className="p-5 lg:p-8 max-w-5xl">
          {section === "overview" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-display text-2xl mb-1">Welcome back</h2>
              <p className="font-body text-sm text-muted-foreground mb-6">Everything you need to run Punarvsu — products, blogs, scheduling, SEO, and messages, all in one place.</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Products", value: counts.products, icon: Package, to: "products" as Section },
                  { label: "Blog posts", value: counts.posts, icon: FileText, to: "blogs" as Section },
                  { label: "Scheduled", value: counts.scheduled, icon: CalendarClock, to: "schedule" as Section },
                  { label: "Unread messages", value: counts.unread, icon: Mail, to: "messages" as Section },
                ].map((s) => (
                  <button key={s.label} onClick={() => setSection(s.to)} className="p-5 rounded-xl border border-border/50 bg-card hover:border-primary/40 text-left transition-colors">
                    <s.icon size={18} className="text-primary mb-3" />
                    <div className="font-display text-2xl">{s.value}</div>
                    <div className="font-body text-xs text-muted-foreground mt-0.5">{s.label}</div>
                  </button>
                ))}
              </div>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <button onClick={() => setSection("products")} className="p-5 rounded-xl border border-primary/30 bg-primary/5 text-left hover:bg-primary/10 transition-colors">
                  <div className="flex items-center gap-2 text-primary mb-2"><Plus size={16} /><span className="font-body text-xs uppercase tracking-wider">New product</span></div>
                  <p className="font-display text-base">Add a product to your independent store</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">You're no longer tied to Shopify — manage your own catalog here.</p>
                </button>
                <button onClick={() => setSection("ai")} className="p-5 rounded-xl border border-border/50 bg-card text-left hover:border-primary/40 transition-colors">
                  <div className="flex items-center gap-2 text-primary mb-2"><Sparkles size={16} /><span className="font-body text-xs uppercase tracking-wider">AI Tools</span></div>
                  <p className="font-display text-base">Generate blog ideas, drafts, meta tags</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">SEO/AEO/GEO content engine powered by Lovable AI.</p>
                </button>
              </div>
            </motion.div>
          )}

          {section === "products" && <ProductsManager />}
          {section === "orders" && <OrdersPanel />}
          {section === "messages" && <MessagesPanel />}
          {section === "schedule" && <ScheduleManager />}
          {section === "meta" && <MetaTagsEditor />}
          {section === "editors" && <EditorsManager />}

          {section === "live-edit" && (
            <div className="p-5 rounded-xl border border-primary/30 bg-primary/5 max-w-2xl">
              <div className="font-display text-lg flex items-center gap-2 mb-1"><PenSquare size={18} className="text-primary" /> Live Site Editing</div>
              <p className="font-body text-xs text-muted-foreground mb-4">When ON, every text and image on the site becomes click-to-edit. Open the home page in another tab — changes save instantly.</p>
              <div className="flex gap-3 flex-wrap">
                <button onClick={() => setEditMode(!editMode)}
                  className={`px-5 py-2.5 rounded-full font-body text-xs tracking-wider uppercase ${editMode ? "bg-primary text-primary-foreground hover:bg-primary/90" : "border border-primary/40 text-primary hover:bg-primary/10"}`}>
                  {editMode ? "Edit Mode: ON — Disable" : "Enable Edit Mode"}
                </button>
                {editMode && <Link to="/" target="_blank" className="px-4 py-2.5 rounded-full border border-border/60 font-body text-xs tracking-wider uppercase hover:border-primary/40">Open Home →</Link>}
              </div>
            </div>
          )}

          {section === "ai" && (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {aiTools.map((t) => (
                  <motion.button key={t.action} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setSelectedAction(t.action); setResult(""); }}
                    className={`p-5 rounded-xl border text-left transition-all ${selectedAction === t.action ? "border-primary bg-primary/5" : "border-border/50 bg-card hover:border-primary/30"}`}>
                    <t.icon size={20} className={selectedAction === t.action ? "text-primary" : "text-muted-foreground"} />
                    <h3 className="font-display text-base mt-3">{t.label}</h3>
                    <p className="font-body text-xs text-muted-foreground mt-1">{t.description}</p>
                  </motion.button>
                ))}
              </div>

              {selectedAction && selectedAction !== "generate_indexing_ping" && (
                <div className="space-y-3 mb-5">
                  <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={placeholder}
                    className="w-full h-32 rounded-xl border border-border/50 bg-card p-4 font-body text-sm focus:border-primary outline-none resize-none" />
                  <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="Target keywords (comma-separated)..."
                    className="w-full rounded-xl border border-border/50 bg-card p-4 font-body text-sm focus:border-primary outline-none" />
                </div>
              )}

              {selectedAction && (
                <button onClick={handleGenerate} disabled={loading}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase px-8 py-3 rounded-full hover:bg-primary/90 disabled:opacity-50">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {loading ? "Generating..." : "Generate"}
                </button>
              )}

              {result && (
                <div className="mt-6 p-6 rounded-xl border border-primary/20 bg-card">
                  <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                    <h3 className="font-display text-base">AI Result</h3>
                    <div className="flex gap-2">
                      {selectedAction === "generate_blog_post" && (
                        <button onClick={sendToEditor} className="inline-flex items-center gap-1 font-body text-xs uppercase tracking-wider bg-primary text-primary-foreground px-3 py-2 rounded-full hover:bg-primary/90">
                          <PenSquare size={12} /> Send to Editor
                        </button>
                      )}
                      <button onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied"); }}
                        className="font-body text-xs text-primary hover:text-primary/80">Copy</button>
                    </div>
                  </div>
                  <pre className="font-body text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed overflow-x-auto">{result}</pre>
                </div>
              )}
            </>
          )}

          {section === "write" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl">{draft.id ? "Edit Post" : "New Blog Post"}</h2>
                {draft.id && (
                  <button onClick={() => { setDraft({ ...emptyDraft }); setSlugTouched(false); }}
                    className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-primary">
                    <Plus size={14} /> New post
                  </button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Title *</label>
                  <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Slug</label>
                  <input value={draft.slug} onChange={(e) => { setSlugTouched(true); setDraft({ ...draft, slug: slugify(e.target.value) }); }}
                    className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Category</label>
                  <input value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Target Keyword</label>
                  <input value={draft.target_keyword} onChange={(e) => setDraft({ ...draft, target_keyword: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
                </div>
                <div>
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Occasion</label>
                  <input value={draft.occasion} onChange={(e) => setDraft({ ...draft, occasion: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Excerpt *</label>
                  <textarea value={draft.excerpt} onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                    className="mt-1 w-full h-20 rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none resize-none" />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Content (Markdown) *</label>
                  <textarea value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                    className="mt-1 w-full h-72 rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none resize-y" />
                </div>

                <div className="sm:col-span-2 p-4 rounded-xl border border-border/50 bg-card/50 space-y-3">
                  <label className="flex items-center gap-2 font-body text-sm cursor-pointer">
                    <input type="checkbox" checked={draft.generate_image}
                      onChange={(e) => setDraft({ ...draft, generate_image: e.target.checked })} className="accent-primary" />
                    <ImageIcon size={16} className="text-primary" />
                    Auto-generate cover image with AI on publish
                  </label>
                  {draft.generate_image && (
                    <input value={draft.image_prompt} onChange={(e) => setDraft({ ...draft, image_prompt: e.target.value })}
                      placeholder="Image prompt (defaults to title)"
                      className="w-full rounded-lg border border-border/50 bg-background p-2 font-body text-xs outline-none focus:border-primary" />
                  )}
                  {draft.existing_image_url && (
                    <div className="flex items-center gap-3">
                      <img src={draft.existing_image_url} alt="" className="w-20 h-14 object-cover rounded" />
                      <span className="font-body text-xs text-muted-foreground">Current cover</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 flex-wrap pt-2">
                <button onClick={() => handlePublish(false)} disabled={publishing}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase px-8 py-3 rounded-full hover:bg-primary/90 disabled:opacity-50">
                  {publishing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  {draft.id ? "Update & Publish" : "Publish Now"}
                </button>
                <button onClick={() => handlePublish(true)} disabled={publishing}
                  className="inline-flex items-center gap-2 border border-border font-body text-sm tracking-wider uppercase px-6 py-3 rounded-full hover:border-primary disabled:opacity-50">
                  Save as Draft
                </button>
              </div>
            </div>
          )}

          {section === "blogs" && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl">All Posts ({posts.length})</h2>
                <button onClick={() => { setDraft({ ...emptyDraft }); setSlugTouched(false); setSection("write"); }}
                  className="inline-flex items-center gap-1 font-body text-xs uppercase tracking-wider bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90">
                  <Plus size={14} /> New Post
                </button>
              </div>
              {postsLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
              ) : posts.length === 0 ? (
                <p className="text-center font-body text-sm text-muted-foreground py-12">No posts yet.</p>
              ) : (
                <div className="space-y-3">
                  {posts.map((p) => (
                    <div key={p.id} className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30">
                      {p.cover_image_url ? (
                        <img src={p.cover_image_url} alt={p.title} className="w-24 h-20 object-cover rounded-lg flex-shrink-0" />
                      ) : (
                        <div className="w-24 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <ImageIcon size={20} className="text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display text-base truncate">{p.title}</h3>
                          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${p.published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                            {p.published ? "Live" : "Draft"}
                          </span>
                        </div>
                        <p className="font-body text-xs text-muted-foreground line-clamp-2">{p.excerpt}</p>
                        <p className="font-body text-[10px] text-muted-foreground/70 mt-1">/{p.slug} · {p.category} · {new Date(p.updated_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <button onClick={() => editPost(p)} className="font-body text-[11px] uppercase tracking-wider text-primary hover:underline px-2 py-1">Edit</button>
                        <button onClick={() => togglePublish(p)} className="font-body text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground inline-flex items-center gap-1 px-2 py-1">
                          {p.published ? <><EyeOff size={11} /> Unpublish</> : <><Eye size={11} /> Publish</>}
                        </button>
                        <button onClick={() => deletePost(p)} className="font-body text-[11px] uppercase tracking-wider text-destructive hover:underline inline-flex items-center gap-1 px-2 py-1">
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;

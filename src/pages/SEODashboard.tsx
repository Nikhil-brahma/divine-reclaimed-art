import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, Sparkles, FileText, Search, BarChart3, Globe, Loader2,
  PenSquare, ListChecks, Image as ImageIcon, Trash2, Eye, EyeOff, Plus, CalendarClock,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import EditorsManager from "@/components/EditorsManager";
import MetaTagsEditor from "@/components/MetaTagsEditor";
import ScheduleManager from "@/components/ScheduleManager";
import { Tag } from "lucide-react";
import { useEditMode } from "@/contexts/EditModeContext";

type Action =
  | "generate_meta"
  | "generate_blog_ideas"
  | "generate_blog_post"
  | "optimize_content"
  | "generate_indexing_ping";

type Tab = "ai" | "write" | "schedule" | "manage" | "meta" | "editors";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  target_keyword: string | null;
  occasion: string | null;
  published: boolean;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
}

const tools: { action: Action; label: string; icon: typeof Sparkles; description: string }[] = [
  { action: "generate_blog_ideas", label: "Blog Ideas", icon: Sparkles, description: "AI-generated blog topics for Google, ChatGPT & Perplexity" },
  { action: "generate_blog_post", label: "Draft Blog Post", icon: FileText, description: "Full SEO/AEO blog draft — copy into the Editor to publish" },
  { action: "generate_meta", label: "Meta Tags", icon: Search, description: "Generate optimized title, description & OG tags" },
  { action: "optimize_content", label: "Content Audit", icon: BarChart3, description: "Score content for SEO, AEO & local GEO" },
  { action: "generate_indexing_ping", label: "Indexing Plan", icon: Globe, description: "Sitemap & search console submission plan" },
];

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

const emptyDraft = {
  id: "" as string | undefined,
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Trending",
  target_keyword: "",
  occasion: "",
  published: true,
  generate_image: true,
  image_prompt: "",
  existing_image_url: "" as string | null,
};

const SEODashboard = () => {
  const [tab, setTab] = useState<Tab>("ai");
  const { editMode, setEditMode, isEditor, user } = useEditMode();

  if (!user) return <Navigate to="/auth" replace />;
  if (!isEditor) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="font-display text-2xl mb-2">Access restricted</h1>
          <p className="text-muted-foreground">Your account does not have editor access. Ask an admin to grant the editor or admin role.</p>
        </div>
      </div>
    );
  }

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

  // Manage state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);

  useEffect(() => {
    if (tab === "manage") fetchPosts();
  }, [tab]);

  useEffect(() => {
    if (!slugTouched) setDraft((d) => ({ ...d, slug: slugify(d.title) }));
  }, [draft.title, slugTouched]);

  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("publish-blog-post", {
        body: { op: "list" },
      });
      if (error) throw error;
      setPosts(data?.posts ?? []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load posts");
    } finally {
      setPostsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedAction) return;
    if (!content && selectedAction !== "generate_indexing_ping") {
      toast.error("Please enter some content or a topic");
      return;
    }
    setLoading(true);
    setResult("");
    try {
      const { data, error } = await supabase.functions.invoke("seo-optimizer", {
        body: { action: selectedAction, content, keywords },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setResult(data?.result || "No result returned");
      toast.success("Generated successfully!");
    } catch (e: any) {
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const sendToEditor = () => {
    if (!result) return;
    // Try to extract a title from a leading **Header**, # Header or first line
    const firstLine = result.split("\n").find((l) => l.trim().length > 0) || "";
    const title = firstLine.replace(/^[#*\s]+/, "").replace(/\*+$/, "").slice(0, 110);
    const excerpt = result.replace(/[#*]/g, "").split("\n").filter((l) => l.trim()).slice(1, 3).join(" ").slice(0, 200);
    setDraft({
      ...emptyDraft,
      title,
      excerpt,
      content: result,
      target_keyword: keywords,
      generate_image: true,
      image_prompt: title,
    });
    setSlugTouched(false);
    setTab("write");
    toast.success("Draft loaded into editor");
  };

  const handlePublish = async (asDraft = false) => {
    if (!draft.title || !draft.excerpt || !draft.content) {
      toast.error("Title, excerpt and content are required");
      return;
    }
    setPublishing(true);
    try {
      const { data, error } = await supabase.functions.invoke("publish-blog-post", {
        body: {
          op: draft.id ? "update" : "publish",
          id: draft.id || undefined,
          title: draft.title,
          slug: draft.slug || slugify(draft.title),
          excerpt: draft.excerpt,
          content: draft.content,
          category: draft.category,
          target_keyword: draft.target_keyword,
          occasion: draft.occasion,
          published: !asDraft,
          generate_image: draft.generate_image,
          image_prompt: draft.image_prompt || draft.title,
          existing_image_url: draft.existing_image_url,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(asDraft ? "Saved as draft" : "Published!");
      setDraft({ ...emptyDraft });
      setSlugTouched(false);
      setTab("manage");
    } catch (e: any) {
      toast.error(e.message || "Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const togglePublish = async (post: BlogPost) => {
    try {
      await supabase.functions.invoke("publish-blog-post", {
        body: { op: "toggle_publish", id: post.id, published: !post.published },
      });
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p)));
    } catch (e: any) {
      toast.error("Failed to update");
    }
  };

  const deletePost = async (post: BlogPost) => {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    try {
      await supabase.functions.invoke("publish-blog-post", {
        body: { op: "delete", id: post.id },
      });
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      toast.success("Deleted");
    } catch (e: any) {
      toast.error("Delete failed");
    }
  };

  const editPost = (post: BlogPost) => {
    setDraft({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      target_keyword: post.target_keyword || "",
      occasion: post.occasion || "",
      published: post.published,
      generate_image: false,
      image_prompt: post.title,
      existing_image_url: post.cover_image_url,
    });
    setSlugTouched(true);
    setTab("write");
  };

  const getPlaceholder = () => {
    switch (selectedAction) {
      case "generate_blog_ideas": return "Enter focus area (e.g., 'temple fashion 2026') or leave empty...";
      case "generate_blog_post": return "Enter blog topic (e.g., 'How Sacred Temple Textiles Are Transforming Indian Fashion')...";
      case "generate_meta": return "Paste page content to generate optimized meta tags...";
      case "optimize_content": return "Paste existing content for SEO/AEO/GEO scoring...";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Site
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
            SEO · AEO · GEO <span className="text-gradient-gold">Command Centre</span>
          </h1>
          <p className="font-body text-muted-foreground text-sm mb-4">
            AI tools, blog editor, and post manager — everything the SEO team needs in one place.
          </p>

          {/* Live Edit Toggle — no approval, persists across the site */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl border border-primary/30 bg-primary/5">
            <div className="flex-1">
              <div className="font-display text-base text-foreground flex items-center gap-2">
                <PenSquare size={16} className="text-primary" /> Live Site Editing
              </div>
              <p className="font-body text-xs text-muted-foreground mt-1">
                When ON, every text and image on the site becomes click-to-edit. Open the home page in another tab and edit inline — changes save instantly, no approval needed.
              </p>
            </div>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-5 py-2.5 rounded-full font-body text-xs tracking-wider uppercase transition-colors whitespace-nowrap ${
                editMode
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-primary/40 text-primary hover:bg-primary/10"
              }`}
            >
              {editMode ? "Edit Mode: ON — Click to Disable" : "Enable Edit Mode"}
            </button>
            {editMode && (
              <Link
                to="/"
                target="_blank"
                className="px-4 py-2.5 rounded-full border border-border/60 font-body text-xs tracking-wider uppercase hover:border-primary/40 whitespace-nowrap"
              >
                Open Home →
              </Link>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border/50">
          {([
            { id: "ai", label: "AI Tools", icon: Sparkles },
            { id: "write", label: "Write & Publish", icon: PenSquare },
            { id: "schedule", label: "Schedule", icon: CalendarClock },
            { id: "manage", label: "Manage Posts", icon: ListChecks },
            { id: "meta", label: "Meta Tags", icon: Tag },
            { id: "editors", label: "Editors", icon: PenSquare },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 font-body text-sm border-b-2 transition-colors ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {/* AI TOOLS TAB */}
        {tab === "ai" && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {tools.map((tool) => (
                <motion.button
                  key={tool.action}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setSelectedAction(tool.action); setResult(""); }}
                  className={`p-5 rounded-xl border text-left transition-all duration-300 ${
                    selectedAction === tool.action
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                      : "border-border/50 bg-card hover:border-primary/30"
                  }`}
                >
                  <tool.icon size={20} className={selectedAction === tool.action ? "text-primary" : "text-muted-foreground"} />
                  <h3 className="font-display text-base mt-3 text-foreground">{tool.label}</h3>
                  <p className="font-body text-xs text-muted-foreground mt-1">{tool.description}</p>
                </motion.button>
              ))}
            </div>

            {selectedAction && selectedAction !== "generate_indexing_ping" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 mb-6">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={getPlaceholder()}
                  className="w-full h-32 rounded-xl border border-border/50 bg-card p-4 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-none"
                />
                <input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="Target keywords (optional, comma-separated)..."
                  className="w-full rounded-xl border border-border/50 bg-card p-4 font-body text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none"
                />
              </motion.div>
            )}

            {selectedAction && (
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase px-8 py-3 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {loading ? "Generating..." : "Generate with AI"}
              </button>
            )}

            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-6 rounded-xl border border-primary/20 bg-card">
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                  <h3 className="font-display text-lg text-foreground">AI Result</h3>
                  <div className="flex gap-2">
                    {selectedAction === "generate_blog_post" && (
                      <button
                        onClick={sendToEditor}
                        className="inline-flex items-center gap-1 font-body text-xs tracking-wider uppercase bg-primary text-primary-foreground px-3 py-2 rounded-full hover:bg-primary/90"
                      >
                        <PenSquare size={12} /> Send to Editor
                      </button>
                    )}
                    <button
                      onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }}
                      className="font-body text-xs text-primary hover:text-primary/80"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                <pre className="font-body text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {result}
                </pre>
              </motion.div>
            )}
          </>
        )}

        {/* WRITE & PUBLISH TAB */}
        {tab === "write" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl text-foreground">
                {draft.id ? "Edit Post" : "New Blog Post"}
              </h2>
              {draft.id && (
                <button
                  onClick={() => { setDraft({ ...emptyDraft }); setSlugTouched(false); }}
                  className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground hover:text-primary"
                >
                  <Plus size={14} /> New post
                </button>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Title *</label>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="Sacred Threads: How Temple Textiles Become Heirlooms"
                  className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Slug</label>
                <input
                  value={draft.slug}
                  onChange={(e) => { setSlugTouched(true); setDraft({ ...draft, slug: slugify(e.target.value) }); }}
                  placeholder="auto-from-title"
                  className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Category</label>
                <input
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                  placeholder="Trending / Heritage / Behind the Scenes"
                  className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Target Keyword</label>
                <input
                  value={draft.target_keyword}
                  onChange={(e) => setDraft({ ...draft, target_keyword: e.target.value })}
                  placeholder="upcycled temple bags"
                  className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Occasion (optional)</label>
                <input
                  value={draft.occasion}
                  onChange={(e) => setDraft({ ...draft, occasion: e.target.value })}
                  placeholder="Diwali / Janmashtami"
                  className="mt-1 w-full rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Excerpt *</label>
                <textarea
                  value={draft.excerpt}
                  onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                  placeholder="Short 1-2 line summary that appears in blog listing & meta description."
                  className="mt-1 w-full h-20 rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Content (Markdown supported) *</label>
                <textarea
                  value={draft.content}
                  onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                  placeholder="Use **Heading** for sections. Write 800–1200 words for SEO."
                  className="mt-1 w-full h-72 rounded-xl border border-border/50 bg-card p-3 font-body text-sm focus:border-primary outline-none resize-y"
                />
              </div>

              <div className="sm:col-span-2 p-4 rounded-xl border border-border/50 bg-card/50 space-y-3">
                <label className="flex items-center gap-2 font-body text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.generate_image}
                    onChange={(e) => setDraft({ ...draft, generate_image: e.target.checked })}
                    className="accent-primary"
                  />
                  <ImageIcon size={16} className="text-primary" />
                  Auto-generate cover image with AI on publish
                </label>
                {draft.generate_image && (
                  <input
                    value={draft.image_prompt}
                    onChange={(e) => setDraft({ ...draft, image_prompt: e.target.value })}
                    placeholder="Image prompt (defaults to title) — e.g., 'Hands embroidering crimson temple silk'"
                    className="w-full rounded-lg border border-border/50 bg-background p-2 font-body text-xs outline-none focus:border-primary"
                  />
                )}
                {draft.existing_image_url && (
                  <div className="flex items-center gap-3">
                    <img src={draft.existing_image_url} alt="cover" className="w-20 h-14 object-cover rounded" />
                    <span className="font-body text-xs text-muted-foreground">Current cover image</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 flex-wrap pt-2">
              <button
                onClick={() => handlePublish(false)}
                disabled={publishing}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-body text-sm tracking-wider uppercase px-8 py-3 rounded-full hover:bg-primary/90 disabled:opacity-50"
              >
                {publishing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                {draft.id ? "Update & Publish" : "Publish Now"}
              </button>
              <button
                onClick={() => handlePublish(true)}
                disabled={publishing}
                className="inline-flex items-center gap-2 border border-border text-foreground font-body text-sm tracking-wider uppercase px-6 py-3 rounded-full hover:border-primary disabled:opacity-50"
              >
                Save as Draft
              </button>
            </div>
          </motion.div>
        )}

        {/* MANAGE POSTS TAB */}
        {tab === "manage" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl text-foreground">All Posts ({posts.length})</h2>
              <button
                onClick={() => { setDraft({ ...emptyDraft }); setSlugTouched(false); setTab("write"); }}
                className="inline-flex items-center gap-1 font-body text-xs uppercase tracking-wider bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90"
              >
                <Plus size={14} /> New Post
              </button>
            </div>

            {postsLoading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
            ) : posts.length === 0 ? (
              <p className="text-center font-body text-sm text-muted-foreground py-12">No posts yet. Create one!</p>
            ) : (
              <div className="space-y-3">
                {posts.map((p) => (
                  <div key={p.id} className="flex gap-4 p-4 rounded-xl border border-border/50 bg-card hover:border-primary/30 transition-colors">
                    {p.cover_image_url ? (
                      <img src={p.cover_image_url} alt={p.title} className="w-24 h-20 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-24 h-20 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        <ImageIcon size={20} className="text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-base text-foreground truncate">{p.title}</h3>
                        <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${p.published ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {p.published ? "Live" : "Draft"}
                        </span>
                      </div>
                      <p className="font-body text-xs text-muted-foreground line-clamp-2">{p.excerpt}</p>
                      <p className="font-body text-[10px] text-muted-foreground/70 mt-1">
                        /{p.slug} · {p.category} · {new Date(p.updated_at).toLocaleDateString()}
                      </p>
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
          </motion.div>
        )}

        {tab === "schedule" && <ScheduleManager />}
        {tab === "meta" && <MetaTagsEditor />}
        {tab === "editors" && <EditorsManager />}
      </div>
    </div>
  );
};

export default SEODashboard;

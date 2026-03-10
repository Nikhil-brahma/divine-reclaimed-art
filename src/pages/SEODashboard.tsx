import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Sparkles, FileText, Search, BarChart3, Globe, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type Action = "generate_meta" | "generate_blog_ideas" | "generate_blog_post" | "optimize_content" | "generate_indexing_ping";

const tools: { action: Action; label: string; icon: typeof Sparkles; description: string }[] = [
  { action: "generate_blog_ideas", label: "Blog Ideas", icon: Sparkles, description: "AI-generated blog topics optimized for Google, ChatGPT & Perplexity" },
  { action: "generate_blog_post", label: "Write Blog Post", icon: FileText, description: "Full SEO/AEO-optimized blog post ready to publish" },
  { action: "generate_meta", label: "Meta Tags", icon: Search, description: "Generate optimized title, description & Open Graph tags" },
  { action: "optimize_content", label: "Content Audit", icon: BarChart3, description: "Score your content for SEO, AEO & local GEO" },
  { action: "generate_indexing_ping", label: "Indexing Plan", icon: Globe, description: "Get a sitemap & search console submission plan" },
];

const SEODashboard = () => {
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

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
      console.error(e);
      toast.error(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    switch (selectedAction) {
      case "generate_blog_ideas": return "Enter focus area (e.g., 'temple fashion trends 2026') or leave empty for auto-suggestions...";
      case "generate_blog_post": return "Enter blog topic (e.g., 'How Sacred Temple Textiles Are Transforming Indian Fashion')...";
      case "generate_meta": return "Paste your page content here to generate optimized meta tags...";
      case "optimize_content": return "Paste existing content to get SEO/AEO/GEO scores and improvements...";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Site
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">
            SEO · AEO · GEO <span className="text-gradient-gold">Command Centre</span>
          </h1>
          <p className="font-body text-muted-foreground text-sm mb-10">
            AI-powered tools to dominate Google, ChatGPT, Perplexity, and local Delhi searches — all automated.
          </p>
        </motion.div>

        {/* Tool Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
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

        {/* Input Area */}
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

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-xl border border-primary/20 bg-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg text-foreground">AI Result</h3>
              <button
                onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied to clipboard!"); }}
                className="font-body text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="font-body text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {result}
            </pre>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SEODashboard;

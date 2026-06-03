import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Share2, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { staticBlogPosts } from "@/pages/Blog";
import { supabase } from "@/integrations/supabase/client";
import blogTempleTextiles from "@/assets/blog-temple-textiles.jpg";

const BlogPost = () => {
  const { slug, "*": aiSlug } = useParams();
  const isAiPost = slug === "ai" && aiSlug;
  const actualSlug = isAiPost ? aiSlug : slug;

  // For AI posts, fetch from database
  const { data: aiPost, isLoading } = useQuery({
    queryKey: ["auto-blog-post", actualSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("auto_blog_posts")
        .select("*")
        .eq("slug", actualSlug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!isAiPost,
  });

  // For static posts
  const staticPost = !isAiPost ? staticBlogPosts.find((p) => p.slug === actualSlug) : null;

  const post = isAiPost
    ? aiPost
      ? {
          title: aiPost.title,
          content: aiPost.content,
          category: aiPost.category,
          date: new Date(aiPost.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }),
          readTime: `${Math.max(3, Math.ceil(aiPost.content.length / 1200))} min read`,
          image: aiPost.cover_image_url || blogTempleTextiles,
          isAiGenerated: false,
        }
      : null
    : staticPost
      ? { ...staticPost, isAiGenerated: false }
      : null;

  if (!isAiPost && !staticPost) return <Navigate to="/blog" replace />;
  if (isAiPost && !isLoading && !aiPost) return <Navigate to="/blog" replace />;
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse font-body text-muted-foreground">Loading...</div>
      </div>
    );
  }
  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <article className="container mx-auto px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} /> Back to Journal
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="bg-primary/10 text-primary font-body text-xs tracking-wider uppercase px-3 py-1 rounded-full">
                {post.category}
              </span>
            </div>

            <h1 className="font-display text-3xl md:text-5xl text-foreground mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 font-body text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} /> {post.readTime}
              </span>
              <button
                onClick={() => navigator.share?.({ title: post.title, url: window.location.href })}
                className="ml-auto flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Share2 size={14} /> Share
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden mb-10 aspect-[16/9]">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="font-body text-foreground/80 leading-relaxed text-base space-y-5">
              {post.content.split(/\n\n+/).map((para, i) => {
                const trimmed = para.trim();
                if (!trimmed) return null;
                if (/^##\s+/.test(trimmed)) {
                  return <h2 key={i} className="font-display text-2xl text-foreground mt-8 mb-2">{trimmed.replace(/^##\s+/, "")}</h2>;
                }
                if (/^###\s+/.test(trimmed)) {
                  return <h3 key={i} className="font-display text-xl text-foreground mt-6 mb-2">{trimmed.replace(/^###\s+/, "")}</h3>;
                }
                if (/^\s*[-*]\s+/m.test(trimmed) && trimmed.split("\n").every(l => /^\s*[-*]\s+/.test(l) || !l.trim())) {
                  const items = trimmed.split("\n").filter(l => l.trim()).map(l => l.replace(/^\s*[-*]\s+/, ""));
                  return (
                    <ul key={i} className="list-disc pl-6 space-y-2">
                      {items.map((it, j) => (
                        <li key={j} dangerouslySetInnerHTML={{ __html: it.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} dangerouslySetInnerHTML={{
                    __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>'),
                  }} />
                );
              })}
            </div>

            <div className="ornament-line w-48 mx-auto my-12" />

            <div className="text-center">
              <p className="font-display text-lg text-muted-foreground italic mb-6">
                "Every thread tells a story. Every stitch carries a prayer."
              </p>
              <Link
                to="/blog"
                className="font-body text-sm text-primary hover:text-primary/80 transition-colors underline underline-offset-4"
              >
                Read more from the Journal →
              </Link>
            </div>
          </motion.div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;

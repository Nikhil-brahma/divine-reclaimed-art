import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogPosts } from "@/pages/Blog";

const BlogPost = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

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

            <span className="bg-primary/10 text-primary font-body text-xs tracking-wider uppercase px-3 py-1 rounded-full">
              {post.category}
            </span>

            <h1 className="font-display text-3xl md:text-5xl text-foreground mt-4 mb-4 leading-tight">
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

            <div className="font-body text-foreground/80 leading-relaxed text-base space-y-6">
              {post.content.split("\n\n").map((para, i) => (
                <p key={i} dangerouslySetInnerHTML={{
                  __html: para
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-display">$1</strong>')
                }} />
              ))}
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

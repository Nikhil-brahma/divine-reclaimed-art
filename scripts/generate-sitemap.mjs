// Generates public/sitemap.xml at predev/prebuild time.
// Pulls published products and AI blog posts from Supabase, merges with static routes.

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://punarvsu.com";
const SUPABASE_URL = "https://ehukdakyofnlrnldgjhl.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodWtkYWt5b2ZubHJubGRnamhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NTQ3MzIsImV4cCI6MjA4NjUzMDczMn0.dYHdtXV-kjDbhHmq1ZeUd279T0dt4VQgI0oUSsO5wDU";

const staticEntries = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/shipping", changefreq: "yearly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

// Static blog post slugs (kept in src/pages/Blog.tsx). Add new ones here as you publish.
const staticBlogSlugs = [
  "the-sacred-journey-of-temple-textiles",
  "art-of-upcycled-luxury",
  "behind-the-hands-artisan-stories",
  "craft-of-sacred-stitching",
];

async function fetchTable(path) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

const products = await fetchTable("products?select=handle,updated_at&status=eq.active");
const aiPosts = await fetchTable("auto_blog_posts?select=slug,updated_at&published=eq.true");

const productEntries = (Array.isArray(products) ? products : []).map((p) => ({
  path: `/products/${p.handle}`,
  lastmod: p.updated_at?.slice(0, 10),
  changefreq: "weekly",
  priority: "0.9",
}));

const staticBlogEntries = staticBlogSlugs.map((slug) => ({
  path: `/blog/${slug}`,
  changefreq: "monthly",
  priority: "0.6",
}));

const aiBlogEntries = (Array.isArray(aiPosts) ? aiPosts : []).map((p) => ({
  path: `/blog/ai/${p.slug}`,
  lastmod: p.updated_at?.slice(0, 10),
  changefreq: "monthly",
  priority: "0.6",
}));

const all = [...staticEntries, ...productEntries, ...staticBlogEntries, ...aiBlogEntries];

const xml = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...all.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  ),
  `</urlset>`,
].join("\n");

writeFileSync(resolve("public/sitemap.xml"), xml);
console.log(`sitemap.xml written (${all.length} entries)`);

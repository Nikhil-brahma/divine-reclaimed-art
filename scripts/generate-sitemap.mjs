// Generates public/sitemap.xml at predev/prebuild time.
// Pulls published products and AI blog posts from Supabase, merges with static routes.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://punarvsu.com";
const SITEMAP_PATH = resolve("public/sitemap.xml");
const SUPABASE_URL = "https://ehukdakyofnlrnldgjhl.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodWtkYWt5b2ZubHJubGRnamhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NTQ3MzIsImV4cCI6MjA4NjUzMDczMn0.dYHdtXV-kjDbhHmq1ZeUd279T0dt4VQgI0oUSsO5wDU";

const staticEntries = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/sacred-knowledge", changefreq: "monthly", priority: "0.8" },
  { path: "/studio", changefreq: "monthly", priority: "0.6" },
  { path: "/shipping", changefreq: "yearly", priority: "0.4" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

// Static blog post slugs (kept in src/pages/Blog.tsx). Add new ones here as you publish.
const staticBlogSlugs = [
  "the-sacred-journey-of-temple-textiles",
  "art-of-upcycled-luxury",
  "behind-the-hands-artisan-stories",
  "styling-sacred-accessories",
  "festive-gifting-with-purpose",
  "craft-of-sacred-stitching",
];

function readExistingEntries() {
  try {
    const xml = readFileSync(SITEMAP_PATH, "utf8");
    return (xml.match(/<url>[\s\S]*?<\/url>/g) || []).flatMap((block) => {
      const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
      if (!loc?.startsWith(BASE_URL)) return [];
      const value = (tag) => block.match(new RegExp(`<${tag}>(.*?)</${tag}>`))?.[1];
      return [{
        path: loc.slice(BASE_URL.length) || "/",
        lastmod: value("lastmod"),
        changefreq: value("changefreq"),
        priority: value("priority"),
      }];
    });
  } catch {
    return [];
  }
}

async function fetchTable(path) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` },
    });
    if (!res.ok) return { ok: false, rows: [] };
    const rows = await res.json();
    return { ok: Array.isArray(rows), rows: Array.isArray(rows) ? rows : [] };
  } catch {
    return { ok: false, rows: [] };
  }
}

const existingEntries = readExistingEntries();
const productsResult = await fetchTable("products?select=handle,updated_at&status=eq.active");
const aiPostsResult = await fetchTable("auto_blog_posts?select=slug,updated_at&published=eq.true");

const productEntries = productsResult.ok
  ? productsResult.rows.flatMap((p) => p.handle ? [
      {
        path: `/product/${p.handle}`,
        lastmod: p.updated_at?.slice(0, 10),
        changefreq: "weekly",
        priority: "0.9",
      },
      {
        path: `/products/${p.handle}`,
        lastmod: p.updated_at?.slice(0, 10),
        changefreq: "weekly",
        priority: "0.9",
      },
    ] : [])
  : existingEntries.filter((entry) => /^\/products?\//.test(entry.path));

const staticBlogEntries = staticBlogSlugs.map((slug) => ({
  path: `/blog/${slug}`,
  changefreq: "monthly",
  priority: "0.6",
}));

const aiBlogEntries = aiPostsResult.ok
  ? aiPostsResult.rows.flatMap((p) => p.slug ? [{
      path: `/blog/ai/${p.slug}`,
      lastmod: p.updated_at?.slice(0, 10),
      changefreq: "monthly",
      priority: "0.6",
    }] : [])
  : existingEntries.filter((entry) => entry.path.startsWith("/blog/ai/"));

if (!productsResult.ok || !aiPostsResult.ok) {
  console.warn("Live sitemap data was unavailable; preserving existing dynamic URLs.");
}

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
].join("\n") + "\n";

writeFileSync(SITEMAP_PATH, xml);
console.log(`sitemap.xml written (${all.length} entries)`);

# Sacred Knowledge FAQ Page

Create a dedicated, indexable FAQ hub targeting 30 category-defining questions, with FAQPage JSON-LD schema for rich results.

## What to build

### 1. New route + page
- **File:** `src/pages/SacredKnowledge.tsx`
- **Route:** `/sacred-knowledge` (registered in `src/App.tsx` above the catch-all)
- Uses existing site chrome: `Navbar`, `Footer`, `SectionDivider`, brand palette (gold `#c9a84c`, crimson, cream bg).

### 2. Page structure
- **Hero:** H1 "Sacred Knowledge" + subhead positioning Punarvsu as the authority on upcycled temple textiles. Small breadcrumb.
- **Intro paragraph:** ~60 words framing the category (sacred upcycling, Bhagwan ki Poshak, sustainable spiritual fashion).
- **Category filter chips** (client-side, no routing) grouping the 30 questions into 6 themes so users can jump:
  1. Understanding Sacred Upcycling (Q1, 7, 15, 26)
  2. Ethics & Purity (Q3, 8, 16, 25)
  3. Shopping & Products (Q2, 10, 18, 19, 28, 30)
  4. Gifting & Occasions (Q9, 14, 24, 27)
  5. Custom, Care & Storage (Q5, 6, 11, 12, 21, 29)
  6. Impact, Shipping & Trust (Q13, 17, 20, 22, 23)
- **Accordion list** using existing shadcn `Accordion` (same styling as `FAQSection.tsx`) with all 30 Q&A. Each answer 60–110 words, brand-voiced (reverent, humanized), naturally links to `/#collections`, `/about`, `/contact`, `/shipping` where relevant. Every question rendered as `<h2>` inside the trigger for SEO (or `<h3>` if visual hierarchy demands — one H1 rule preserved).
- **Closing CTA band:** "Still have questions?" → link to `/contact` + "Explore the collection" → `/#collections`.

### 3. SEO metadata
- `<SEOHead>` with:
  - title: "Sacred Knowledge: Upcycled Temple Textile FAQs"
  - description: ~155 chars covering upcycled deity cloth, sustainable spiritual fashion, Punarvsu authority.
  - canonical: `https://punarvsu.com/sacred-knowledge`
  - geo: default Delhi.

### 4. Structured data
- Inline `<script type="application/ld+json">` (escaped via existing pattern in `StructuredData.tsx`) emitting a single **FAQPage** schema with all 30 `Question` / `acceptedAnswer` entries (plain-text answers, no HTML).
- Also emit a **BreadcrumbList** (Home → Sacred Knowledge).

### 5. Sitemap + discoverability
- Add `/sacred-knowledge` to static routes in `scripts/generate-sitemap.mjs` (priority 0.8, monthly).
- Regenerate `public/sitemap.xml`.
- Add "Sacred Knowledge" link to `Footer.tsx` (Explore/Company column).
- Add entry to `public/llms.txt` under Pages.

## Technical details

- No new dependencies; reuse `Accordion`, `motion`, `SEOHead`, `Footer`, `Navbar`.
- Answers stored as a typed array `const faqs: { id: number; category: CategoryKey; q: string; a: string }[]` at top of the page file — keeps FAQPage JSON-LD and visible accordion in sync from one source.
- JSON-LD escaping: replace `<` with `\u003c` (same helper style used in `StructuredData.tsx`) to satisfy existing XSS lint.
- No backend/DB changes.

## Out of scope
- Per-question dedicated URLs (kept as anchors, e.g. `#q-14`, for future upgrade).
- Translations, comments, search box.

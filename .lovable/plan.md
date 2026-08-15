# Homepage SEO Report — What We Can Implement

Of the 20 items in the audit, 17 can be implemented directly in the app. 2 are already done, and 1 needs a decision from you (see below).

## Already correct (no work needed)
- OG image is HTTPS, canonical tag correct, geo tags present (SEOHead already sets geo.region, geo.placename, geo.position, ICBM).
- Organization schema and homepage FAQPage schema already exist in `StructuredData.tsx` — the crawler couldn't see them because they render client-side. Nothing missing, but see "Technical note" below.
- Sitemap.xml exists and is generated from live data.
- H1 exists on the homepage hero (crawler couldn't verify it client-side).

## 1. Meta / social tags (Today items)
Update the homepage defaults in `SEOHead.tsx`:
- Title: `Potli Bags Online | Shagun, Bridal & Wedding Gift Bags – Punarvsu`
- Meta description: `Shop handcrafted potli bags online for shagun, bridal ceremonies & wedding gifting. Made from sacred Bhagwan Vastra by women artisans in Delhi. Order now.`
- og:title and twitter:title = same as title.
- og:description and twitter:description = same as description (fixes the 55-char thin Twitter description).
- Meta keywords updated to the commercial keyword clusters (potli bags online, shagun potli bags, bridal potli bags, wedding return gift bags, pooja bags, recycled cotton tote bags).

## 2. Homepage H1 + hero copy
- Rewrite the hero H1 to `Handcrafted Potli Bags Online — Shagun, Bridal & Wedding Gifting`, keeping the existing poetic line as a styled sub-line so the design and reverent tone are preserved.
- Add the audit's hero paragraph (Bhagwan Vastra / Rohini artisans / shagun, bridal, wedding return gifting) below the H1, in brand voice.

## 3. New "Shop by Occasion" section (H2 + 4 category tiles)
New section placed right after the hero, before the collection grid, with H3 tiles:
- Bridal Potli Bags & Wedding Clutches
- Shagun & Wedding Return Gift Bags
- Pooja & Temple Bags
- Eco-Friendly & Recycled Cotton Tote Bags

Each tile gets the audit's description and links into the collection. Note: the store currently has no category filter on a `/products` route — tiles will link to `/#collections` with a category preselected, unless you'd rather I build real filtered collection pages (bigger job, see question).

## 4. USP strip
4-icon trust strip below the hero: Sacred Origin · Handstitched · Eco-Upcycled · Free Shipping above ₹999.

## 5. "The Story Behind Bhagwan Vastra" H2 block
Short brand-story section on the homepage (condensed from the About page content) so the term appears in body copy, linking to /about for the full story.

## 6. Homepage FAQ — merge in the 7 audit questions
The homepage FAQ already has 8 questions. I'll fold in the audit's 7 (bulk orders, customisation minimum 25, occasions list, washability, "how are you different") without duplicating what's already there, and keep the H2 as "Frequently Asked Questions". FAQPage JSON-LD will be regenerated from the final list so schema and visible copy match.

## 7. SEO footer copy block
~250-word keyword-rich block above the footer with the "Potli Bags for Every Sacred Occasion" heading and the four sub-paragraphs, plus internal links to bridal / shagun / pooja / eco tiles, sacred-knowledge, blog and about.

## What I will NOT copy verbatim
- The audit says "Free shipping above Rs. 2,999" in two places. Your live threshold is ₹999 — I'll use ₹999 everywhere.
- Phone/email in the FAQ answers will use your existing official contact details.

## Technical note
The auditor's "schema missing / content not readable" findings are a limitation of server-side crawling a client-rendered React app, not a code fault. Google renders JS and does see them. If crawler-visible HTML matters to you long-term, the real fix is prerendering the homepage — that's a separate, larger change and is not part of this plan.

Files touched: `src/components/SEOHead.tsx`, `src/components/HeroSection.tsx`, `src/components/FAQSection.tsx`, `src/components/StructuredData.tsx`, `src/pages/Index.tsx`, plus two new components (`ShopByOccasion.tsx`, `SeoContentBlock.tsx`). No backend or database changes.

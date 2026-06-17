## What we're building

Three connected pieces, all powered by Lovable AI image generation (no third-party services):

1. **Admin upload → AI enhancement** (saved to product)
2. **Public "try it" demo page** (preview only, not saved)
3. **Site-wide glassmorphism product cards** (home, collections, product pages)

---

## 1. AI image enhancement pipeline

A new edge function `enhance-product-image` (JWT-required, owner/editor only) takes one raw photo and returns three layers, all generated with `google/gemini-3.1-flash-image-preview` (Nano Banana 2 — fastest pro-quality, supports image-to-image so the product stays faithful):

- **1 hero shot** — regal background (warm ivory + soft gold rim light, faint sanskrit motif bokeh) matching Punarvsu's brand palette (#c9a84c, #8b0000, #1a4a1a). One call.
- **4 angle shots** — front, three-quarter left, three-quarter right, top-down. Four parallel calls, each prompted with the original photo as reference + an angle instruction.
- **24-frame 360° spin** — generated in 8 parallel batches of 3 frames (15° increments). This is the heaviest step (~60–120s, ~24 image-gen credits per upload). The UI shows a clear progress bar and a "Skip 360° — hero + angles only" button so editors can opt out per upload.

Each frame returns as base64 from the Gateway; the edge function uploads them to the existing `site-content` storage bucket under `products/{product_handle}/{type}/{index}.webp` (converted to webp server-side via Deno + sharp-equivalent for size). Public URLs are returned to the client.

**Honest expectation note in the UI:** AI 360° from a single photo is not true photogrammetry — frames can drift on complex products. The preview shows this so editors can re-run or skip.

---

## 2. Admin product editor

Extend the existing admin product surface (under `/admin`):

- New "Smart Photo Studio" panel: drop one raw photo → previews stream in as each frame completes (SSE from the edge function).
- Editor can accept / regenerate any single output, or regenerate the whole batch with a different style preset (Regal Ivory / Temple Black / Marigold Festival).
- On save, image URLs are written to a new `product_media` table:

```text
product_media
  product_id (FK products.id)
  hero_url, angle_urls[], spin_urls[]
  source_image_url, style_preset, created_at, updated_at
```

RLS: anon SELECT, editor INSERT/UPDATE/DELETE (via `is_editor`). Grants for `anon` + `authenticated` + `service_role`.

Storefront reads `product_media` joined on product to render the gallery. (Shopify stays the source of truth for price/inventory/handle; enhanced media is a Punarvsu-side overlay, same pattern as `content_overrides`.)

---

## 3. Public "try it" demo page

New route `/studio` (linked subtly from the footer):

- Visitor drops a photo → same edge function runs, but results are **not persisted** and the function tags the request `purpose: "demo"` so we can rate-limit and skip the storage upload (returns base64 data URLs instead).
- Anon-callable but JWT-optional; protected by per-IP rate limit (5 enhancements / hour) and a small Cloudflare-style turnstile-free honeypot field.
- CTA at the end: "Want this for your own store? Contact us." → opens existing contact form.

---

## 4. Site-wide glassmorphism product cards

One shared `<GlassProductCard />` component replaces the current product card everywhere it appears (home featured grid, `/collections/*`, related-products strip on product pages).

Visual direction (matches the existing light-themed regal aesthetic — no purple/indigo gradients):

- Frosted ivory glass: `bg-white/40 backdrop-blur-xl border border-white/60`
- Soft gold inner ring on hover: `ring-1 ring-[#c9a84c]/40`
- Behind each card, a blurred radial aura in brand colors (gold for default, crimson for "Devotion" tier, green for "Temple Garden" tier) so the glass has something rich to refract.
- Hover: subtle lift + a 1.5s autoplay preview of the 360° spin (3 frames) before settling back on the hero. Falls back to hero-only if no spin frames exist.
- Card content: hero image, product title (Cormorant Garamond), price, tiny "Blessed by [temple]" line, and a gold dot indicator if a 360° spin is available.

Anti-gravity physics (existing rule) preserved on the home grid; only the card chrome changes.

---

## Technical details

- **AI model:** `google/gemini-3.1-flash-image-preview` for everything (fastest pro-quality, accepts the source image as input → keeps product identity). Falls back to `google/gemini-3-pro-image-preview` if the flash model rejects a prompt.
- **Storage:** existing public `site-content` bucket, new prefix `products/`.
- **Edge function auth:** `enhance-product-image` requires Supabase JWT + `is_editor` for the save path; demo path is anon + IP rate-limited.
- **Streaming:** function uses SSE so the UI renders each frame as it lands (hero first → angles → spin frames in order). React 18 `flushSync` in the parser so previews don't get batched away.
- **Cost guardrails:** "Skip 360°" button, single "Regenerate" per frame instead of redoing the batch, and a soft warning on the demo page after 3 runs in a session.
- **Existing files touched:**
  - new: `supabase/functions/enhance-product-image/index.ts`, `src/components/admin/SmartPhotoStudio.tsx`, `src/components/GlassProductCard.tsx`, `src/pages/Studio.tsx`, migration for `product_media`
  - edited: admin product editor page, home featured products section, collections page, product detail gallery, App routes
- **No Shopify writes** — enhanced media lives in Lovable Cloud only.

---

## Out of scope (call out before building)

- True 3D model generation (would need a paid service like Meshy/Luma — not requested).
- Pushing enhanced images back to Shopify (would require Shopify Admin API write scope — not currently granted).
- Background removal as a separate step — the Gemini prompt handles it inline.

Ready to build on approval.
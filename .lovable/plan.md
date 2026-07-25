## Goal

Stop the "zoom-in / reframe" flash on the homepage grid and featured card, and make above-the-fold product images appear as fast as possible — without changing how images are cropped once loaded.

## Current state (verified in code)

- `GlassProductCard` already uses `aspect-[3/4]`, `object-cover`, a shimmer skeleton, `srcSet`, eager loading + `fetchPriority` for first cards. The flash comes from: (a) `group-hover:scale-105` is on the same `<img>` that fades in, so the very first paint can briefly appear scaled, (b) the skeleton and image share the same layer but the image starts `opacity-0` then hard-swaps to `opacity-100` with a 700ms transition — the eye reads that as "zooming in", (c) `fetchPriority` (camelCase) triggers a React DOM warning on the plain `<img>` (framer's motion.img accepts it; native `<img>` needs `fetchpriority`).
- `NativeCollections` featured hero uses `aspect-[4/5] md:aspect-auto` — on desktop the container has no aspect ratio, so the image defines the height and any late size change reflows/rescales. It also has no skeleton and no `srcSet`.
- No `<link rel="preload">` for the first product image exists anywhere.
- `siteContentImages.ts` already supports width/quality transforms and srcSet; nothing to add there.

## What to change

### 1. Kill the "zoom" flash on `GlassProductCard`

- Wrap the `<img>` in an inner `<div>` that carries the `group-hover:scale-105` transform, so hover-zoom applies to a stable container instead of the fading image itself.
- Replace the 700ms `opacity` transition on the image with an instant reveal (`opacity-100` as soon as `onLoad` fires). Keep the skeleton visible underneath until then — that gives a clean cross-fade feel without the image itself animating scale.
- Set explicit `width` and `height` attributes on the `<img>` (matching the 3:4 ratio, e.g. `width={600} height={800}`) so the browser reserves the exact box before bytes arrive.
- Fix the React warning: pass `fetchpriority` (lowercase) as a spread attribute, or drop it and rely on `loading="eager"` for the first cards.

### 2. Give the featured hero a fixed frame

- Change the featured `<Link>` container to `aspect-[4/5] md:aspect-[5/6]` (or a similar fixed desktop ratio) so the image box has a reserved size on every breakpoint. No more "image defines height".
- Add a skeleton layer (same shimmer as the grid) behind the featured image and hide it on `onLoad`.
- Add `width`/`height` attributes on the featured `<img>` and a `srcSet` via `buildSiteContentSrcSet` with `sizes="(min-width: 768px) 50vw, 100vw"`.
- Move the `whileHover={{ scale: 1.08 }}` to a wrapper `motion.div`, not the image itself, so the initial paint never renders at 1.08x.

### 3. Preload the LCP product image

- In `NativeCollections`, once `products[0]` is known, inject a `<link rel="preload" as="image" href={featuredImage} imagesrcset={...} imagesizes="(min-width:768px) 50vw, 100vw" fetchpriority="high">` via a small `useEffect` that appends to `document.head` and cleans up on unmount / product change.
- Keep `loading="eager"` + `fetchpriority="high"` on the featured `<img>` and the first two grid cards.

### 4. Per-breakpoint `object-fit` tuning

- Product photos are shot upright (3:4-ish), so `object-cover` + `object-center` is correct on mobile and tablet.
- On very wide desktop cards (`xl:grid-cols-4`), the crop can clip the tassel. Add `xl:object-[center_30%]` on the grid image so the top of the bag stays in frame at wider breakpoints. Featured hero stays `object-cover object-center`.
- No change to product detail page (already correct).

## Technical details

Files touched:

- `src/components/GlassProductCard.tsx` — wrap img in scale container; add explicit width/height; drop opacity transition; fix `fetchpriority` casing; add `xl:object-[center_30%]`.
- `src/components/NativeCollections.tsx` — fixed aspect ratio on featured link; add skeleton; add `srcSet` + width/height on featured img; inject preload link for `featuredImage`.
- No changes to `src/lib/siteContentImages.ts`, DB, or routing.

Non-goals: no visual redesign, no crop change on already-loaded images, no new dependency, no backend work.

## Verification

- Reload the homepage on desktop and mobile with cache disabled — the product frames should appear at their final size instantly (shimmer visible, no scale/reframe), then the image cross-fades in place.
- DevTools → Network: the featured image request starts in the first wave (preload) with `priority: High`.
- Console: the `fetchPriority` React warning is gone.

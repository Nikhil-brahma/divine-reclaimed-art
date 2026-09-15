# Maximum-speed rendering plan

## Goal
Make the homepage and product pages feel immediate on mobile and desktop while preserving the current layout, copy, branding, product order, and customer flows.

## Confirmed bottlenecks
- **Artificial 2.8-second wait:** the loading animation covers the page for a fixed 2.8 seconds even when content is ready.
- **Slow product image delivery:** measured product thumbnails took roughly 3.0–3.5 seconds through the on-demand image transformer.
- **Too many high-priority images:** the collection preloads its featured image and eagerly requests four more cards even though the collection is below the first screen.
- **Oversized logo:** the navigation requests a 1.4 MB PNG before the first screen is complete.
- **Everything loads up front:** customer, blog, studio, SEO, and large admin pages are imported into the initial application path instead of loading only when visited.
- **Heavy effects run continuously:** two Three.js/WebGL particle canvases can run together; the closed AI assistant updates React state every 50 ms; several below-screen sections attach scroll observers and timers immediately.
- **Blocking font request:** fonts are loaded through a CSS `@import`, delaying stylesheet completion.
- **Duplicate page-content calls:** homepage content overrides are requested separately by the page editor and SEO metadata.
- **Product detail images are unbounded:** the main product page serves original full-resolution uploads without responsive transformed sizes.
- **Database execution is already fast:** the main product query averages about 7 ms and peaks below 19 ms. The observed ~1.2-second request is network/cold-path time, so compute resizing or speculative indexes are not justified.

## Changes

### 1. Remove forced waiting
- Remove the fixed-duration full-screen loader from normal visits.
- Keep only a very short, non-blocking brand transition if needed for continuity; never hide usable content while a timer runs.
- Preserve skeletons exactly where data or an image is genuinely pending.

### 2. Shrink the initial download
- Lazy-load every non-home route, especially admin, studio, blog, account, and SEO tools.
- Load the full AI chat panel only when the visitor opens it; keep a lightweight launcher visible.
- Replace the assistant’s 20-updates-per-second React pulse with a compositor-friendly CSS animation.
- Split editor-only behavior from public content rendering so shoppers do not download admin editing code.

### 3. Fix image priority and formats
- Create optimized WebP/AVIF variants for the hero and navigation logo while preserving their appearance.
- Give the hero image explicit dimensions, responsive sources, and the page’s single high fetch priority.
- Remove the below-screen product preload and mark collection images lazy by default.
- Request only the image size each mobile/desktop card can display; avoid a new transform variant for every unnecessary width.
- Add responsive transformed sources, dimensions, decoding, and a skeleton to the product detail gallery instead of downloading original uploads.
- Lazy-load footer and below-screen decorative images.

### 4. Stop below-screen work until needed
- Mount the collection’s particle effect only near its viewport and pause it when off-screen.
- Reduce or disable WebGL particles on mobile and for reduced-motion users without changing the static visual design.
- Defer below-screen homepage sections until close to view and use CSS `content-visibility` so the browser skips their initial layout and paint.
- Pause testimonial timers and animation loops while their section or browser tab is not visible.
- Keep scroll motion where it adds value, but remove redundant observers from decorative dividers and static text blocks.

### 5. Remove request duplication and overfetching
- Share the existing homepage content-override result with SEO metadata instead of issuing a second request.
- Cache public product and override reads in the client for repeat navigation, with a sensible freshness window.
- Select only fields displayed on product detail pages rather than `select(*)`.
- Skip the `product_media` request when no enhanced media is configured, or fold available media into the main product response so there is no serial follow-up.
- Preserve live price and stock accuracy by keeping those fields revalidated.

### 6. Unblock fonts and first paint
- Replace the CSS font import with non-blocking document font links plus preconnect, preserving Cormorant Garamond and Outfit.
- Add safe fallback metrics and `font-display: swap` behavior to avoid invisible text.
- Ensure third-party analytics remains asynchronous and does not delay the application.

### 7. Product-page responsiveness
- Replace the full-page spinner with a stable product-page skeleton so navigation feels immediate.
- Start the product image request as soon as product data arrives and keep variants secondary.
- Cache previously viewed product data and prefetch a product only when its card is intentionally hovered/touched, avoiding bulk prefetching.

## Technical implementation notes
- Use route-level `React.lazy`/`Suspense` boundaries and small local loading states.
- Use `IntersectionObserver`, Page Visibility, `prefers-reduced-motion`, and coarse-pointer checks to control expensive effects.
- Keep all existing URLs, SEO schemas, Meta Pixel events, cart behavior, checkout behavior, editing capability, and visual content intact.
- Do not resize Lovable Cloud compute: current query timings do not support compute as the bottleneck.

## Verification
- Measure a fresh mobile and desktop load before and after with browser performance entries and network timings.
- Confirm the loader no longer imposes a fixed delay and the first screen is usable immediately.
- Confirm only the home route’s code and first-screen imagery load initially; admin/studio/chat code must remain absent until requested.
- Confirm the hero is the only high-priority image and below-screen product images begin near the viewport.
- Verify homepage scrolling, collection cards, product navigation, image gallery, cart, AI launcher, admin editing, SEO metadata, and Meta Pixel events still work.
- Check 363×675 mobile and 1280×1800 desktop screenshots for any visual regression.
- Compare request count, transferred bytes, first contentful paint, largest contentful paint, and main-thread work; address any remaining top offender revealed by the post-change trace.

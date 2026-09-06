# Plan: Install Meta Pixel (ID 1085709050612018) with conversion events

## What's happening
You pasted the standard Meta Pixel base code. I'll install it site-wide and wire up the conversion events that matter for a shopping site, so Meta can track PageViews, content views, add-to-cart, checkout starts, and purchases.

## Changes

### 1. Base pixel in `index.html`
- Add the Meta Pixel `<script>` block (init `1085709050612018` + `track PageView`) inside `<head>`, after the existing meta tags.
- Place the `<noscript><img ... /></noscript>` fallback inside `<body>` (NOT in `<head>`) — HTML5 rules forbid image noscript tags in `<head>`. This is the only correct placement.

### 2. New helper `src/lib/metaPixel.ts`
A small typed wrapper around the global `fbq` function:
- Declares `window.fbq` on the `Window` interface.
- Exports safe helpers: `trackPageView()`, `trackViewContent({id, name, price, currency})`, `trackAddToCart({id, name, price, currency})`, `trackInitiateCheckout({value, currency, contents})`, `trackPurchase({value, currency, contents})`.
- Each helper checks `typeof window.fbq` so it never throws if the pixel is blocked (ad blockers) or not loaded.

### 3. Fire events from the right user actions
- **PageView on route change** — in `src/App.tsx`, add a `useLocation` effect that calls `trackPageView()` on every pathname change (SPA nav). The base-code PageView in `index.html` covers the initial load; this covers client-side route changes.
- **ViewContent** — in `src/pages/ProductDetail.tsx`, call `trackViewContent` once the product data is loaded (inside the existing fetch effect).
- **AddToCart** — in both `src/components/GlassProductCard.tsx` (grid card) and `src/pages/ProductDetail.tsx` (detail page button), call `trackAddToCart` inside the existing `handleAdd`/add handler right after `addItem(...)`. Pass product id, title, price, currency `INR`.
- **InitiateCheckout** — in `src/components/CheckoutDialog.tsx`, call `trackInitiateCheckout` when the dialog opens (existing `useEffect` on `open`), passing cart subtotal and item list.
- **Purchase** — in `src/components/CheckoutDialog.tsx`, inside the Razorpay success handler (`if (vData?.verified)`), call `trackPurchase` with the verified order total and contents, before `clear()`.

### 4. Currency
All events use `currency: "INR"` and `value` = the numeric price/total in rupees, matching how prices are stored.

## Verification
- After implementing: load the homepage in the browser, confirm `fbq` is defined and a `PageView` request fires (network tab → `facebook.com/tr`).
- Open a product → expect `ViewContent`.
- Add to cart → expect `AddToCart`.
- Open checkout → expect `InitiateCheckout`.
- Complete a test Razorpay flow → expect `Purchase`.
- Check the console has no errors from the pixel.

## Notes
- No domain verification meta tag was provided; the pixel will still fire and track, but Meta's domain verification (in Events Manager → Settings) is recommended later for advanced matching reliability. I can add the meta tag if you share it.
- The pixel ID `1085709050612018` is a public identifier, safe to ship in client HTML.

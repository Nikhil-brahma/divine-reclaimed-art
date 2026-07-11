## What to share with your Meta Ads manager

### 1. Website URLs (safe to send)
- **Live site:** https://punarvsu.com
- **WWW:** https://www.punarvsu.com
- **Backup Lovable URL:** https://divine-reclaimed-art.lovable.app

That's all the "URL" they need for Business Manager domain verification, catalog, and ad destinations.

### 2. Credentials — do NOT send
A Meta ads manager should **never** get your website login, hosting login, or database credentials. Meta itself doesn't need them either. Instead, give them scoped access through Meta Business Manager:

- Add them as a **Partner / Employee** in Meta Business Suite → Business Settings → People / Partners
- Assign only: **Ads account**, **Pixel/Dataset**, **Catalog**, **Page** — with "Advertise" or "Analyze" role (not Admin unless required)
- For domain verification: give them the DNS TXT record task, or you paste the verification meta tag yourself

If they insist on "site credentials," that's a red flag — push back.

### 3. What I'll build for the Meta Pixel + Conversions integration
Once you give me your **Meta Pixel ID** (15–16 digit number from Events Manager → Data Sources → your pixel), I will:

1. **Install the base Pixel** in `index.html` (script + `<noscript>` fallback in `<body>`, per project rules) firing `PageView` on every route.
2. **Add a small `src/lib/metaPixel.ts` helper** with typed `track(event, params)` and route-change `PageView` firing via React Router.
3. **Wire standard events** to real user actions already in the app:
   - `ViewContent` on `ProductDetail` mount (with `content_ids`, `content_type: 'product'`, `value`, `currency: 'INR'`)
   - `AddToCart` in the cart store / GlassProductCard "Add" action
   - `InitiateCheckout` when `CheckoutDialog` opens
   - `Purchase` after `razorpay-verify-payment` success (value, currency, content_ids)
   - `Lead` on Contact form submit
   - `Search` on any search input if present
4. **Domain verification tag** — add the `<meta name="facebook-domain-verification" ...>` tag you get from Meta into `index.html` <head>.
5. **(Optional, recommended) Conversions API** via a Supabase edge function `meta-capi` that mirrors `Purchase` and `Lead` server-side using a **Meta Access Token** (I'll request it via the secure secret form when you're ready — never paste it in chat). This dramatically improves attribution vs. iOS/ad-blockers.
6. **Product Catalog feed** — generate `/public/meta-catalog.xml` (or a `/functions/v1/meta-catalog` edge function) so the ads manager can create a Catalog + Advantage+ Shopping campaigns. Uses your existing `products` + `product_media` tables.

### What I need from you
1. Your **Meta Pixel ID**
2. The **domain verification code** (meta tag) from Business Settings → Brand Safety → Domains
3. Confirm: do you also want **Conversions API** (server-side events) now? If yes, I'll ask for the access token via the secure form after the pixel is wired.
4. Confirm: generate the **product catalog feed** too?

Say "go" (and paste the Pixel ID + verification tag) and I'll implement steps 1–4 in one pass, then follow up on 5 and 6.
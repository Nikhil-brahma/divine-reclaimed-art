

## Plan: Add 4 New Immersive Sections to Homepage

### Overview
Add four new sections to the existing homepage without removing anything. All sections use the existing dark/gold sacred aesthetic, framer-motion for animations, and CSS 3D transforms (no new Three.js canvases beyond what exists — keeps performance).

---

### Section 1: Sacred Hero Banner (NEW — placed ABOVE existing HeroSection)

**New file:** `src/components/SacredHeroBanner.tsx`

- Full-width section with `#0a0804` background
- **Anti-gravity fabric particles**: 20-30 CSS-animated colored squares (gold, crimson, emerald) that float upward infinitely using framer-motion `repeat: Infinity` with random x-drift and slow rotation
- **Center 3D potli silhouette**: CSS 3D transform rotating slowly on Y-axis with golden radial glow/halo behind it (using a stylized SVG or emoji-based representation since we don't have a 3D model)
- **Gold metallic headline**: "Mandir Ki Poshak Ko Dustbin Se Bachaya." in `font-display` serif with gold gradient text
- **Subheadline**: cream white, smaller text
- **CTA button**: "Shop Bridal Collection →" — deep crimson `bg-[#8b0000]` with gold border, hover glow animation
- **Trust bar**: horizontal row of 4 trust badges at bottom with icons and text
- Mobile: particles reduce to 10, potli glow simplified, stacked layout

### Section 2: Why Strip — 3 Tilt Cards (NEW — placed after Sacred Hero Banner)

**New file:** `src/components/WhyHowWhatStrip.tsx`

- Dark background section with 3 glassmorphism cards in a row
- Reuses the existing `HolographicCard` component for mouse-parallax 3D tilt effect
- Each card: dark glass background (`bg-white/5 backdrop-blur-md`), gold border glow (`border border-[#c9a84c]/30`), hover float-up effect
- Card content: large emoji icon, gold title, cream body text
- Cards: Sacred Origins / Artisan Reborn / A Blessing You Carry
- Mobile: cards stack vertically, tilt disabled, fade-in on scroll

### Section 3: Bulk Gifting Bridal Banner (NEW)

**New file:** `src/components/BulkGiftingBanner.tsx`

- Split layout: left side has animated scene (multiple potli emoji/icons on a decorative thaal with floating marigold petals using framer-motion anti-gravity), right side has text content
- Right side: gold serif headline "Planning a Wedding?", subtext, price anchor "Starting ₹350 per potli", CTA "Request Bulk Quote →" linking to WhatsApp/contact
- Floating marigold petals: small orange/yellow circles drifting upward with rotation
- Mobile: stacked layout, scene above text

### Section 4: Brand Story Strip — Horizontal Timeline (NEW)

**New file:** `src/components/BrandStoryStrip.tsx`

- 4 steps connected by a glowing golden thread line
- Each step: glassmorphism card floating at slightly different heights, icon, title, description
- Cards animate in from sides on scroll using `whileInView`
- Golden connecting line drawn progressively with scroll
- Steps: Temple Poshak offered → Fabric retired, we step in → Artisan women transform → Sacred potli reaches you
- Mobile: vertical stack with connecting line, cards fade-in

### Changes to Index.tsx

Insert sections in this order after Navbar:
1. `<SacredHeroBanner />` (new — before existing HeroSection)
2. `<SectionDivider variant="gold" />`
3. `<WhyHowWhatStrip />` (new)
4. `<SectionDivider variant="sacred" />`
5. Existing `<HeroSection />` (kept as-is)
6. ... rest of existing sections unchanged ...
7. Before FAQSection, insert:
   - `<SectionDivider variant="gold" />`
   - `<BulkGiftingBanner />`
   - `<SectionDivider variant="sacred" />`
   - `<BrandStoryStrip />`

### Technical Details

- **No new dependencies** — uses existing framer-motion, existing HolographicCard, existing Tailwind config
- **Anti-gravity physics**: All floating elements use `framer-motion animate` with `repeat: Infinity`, negative Y translation, random delays
- **Performance**: Pure CSS/framer-motion animations, no additional Three.js canvases
- **Colors**: `#0a0804`, `#c9a84c` (gold), `#8b0000` (crimson), `#1a4a1a` (green) — added as inline styles where not in Tailwind config
- **Mobile**: `useIsMobile` hook to reduce particle count and disable 3D tilt; cards stack vertically with fade-in


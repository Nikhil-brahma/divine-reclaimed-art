

# Implement the Golden Circle (Why/How/What) Homepage Redesign

Based on the Simon Sinek "Golden Circle" framework discussed, the plan restructures the hero and adds a new Why/How/What section so visitors encounter the **belief** before the products.

---

## What Changes

### 1. Rewrite HeroSection copy (belief-first messaging)
**File:** `src/components/HeroSection.tsx`

- **Main heading:** Change from "Where Devotion / Becomes Legacy" to:
  - Line 1: `"Because Devotion"`
  - Line 2: `"Never Ends."`
- **Sub-heading:** Replace current paragraph with:
  > "Upcycled from sacred temple offerings. Handcrafted by women artisans. A bag that carries a soul."
- **CTA button:** Change "See the Collection" → `"Explore the Sacred Collection"`
- **Tagline badge:** Keep "Sustainability Meets Spirituality" as-is (it works)
- **Second CTA:** Change "The Sacred Journey" → `"Want to Carry a Blessing?"`  linking to `#why-how-what`

### 2. Create new WhyHowWhat section (three-column strip)
**New file:** `src/components/WhyHowWhatSection.tsx`

A clean, three-column section placed **between the Hero and CollectionsSection** — so visitors understand the story before seeing products.

Three cards with icons:

| Column | Label | Heading | Body |
|--------|-------|---------|------|
| WHY | The Origin | Born in the Temples | "Born in the temples of Delhi, Punarvsu was created to ensure that sacred fabrics are given a second life, not a landfill." |
| HOW | The Craft | Reclaimed with Reverence | "Each bag is UV-sanitized and hand-stitched at the Sampurna NGO workshop, empowering women through dignified work." |
| WHAT | The Gift | A Blessing You Can Carry | "A perfect, meaningful favor for weddings and festivities that your guests will cherish as a blessing." |

- Uses scroll-triggered reveal animations (consistent with existing `motion` patterns)
- Responsive: stacks vertically on mobile, three columns on desktop
- Gold accent line between label and heading

### 3. Update Index.tsx page order
**File:** `src/pages/Index.tsx`

Insert the new `WhyHowWhatSection` between `HeroSection` and `CollectionsSection`:

```text
HeroSection
  ↓ SectionDivider (gold)
WhyHowWhatSection   ← NEW
  ↓ SectionDivider (sacred)
CollectionsSection
  ... rest unchanged
```

### 4. Refine StorySection copy to complement (not duplicate)
**File:** `src/components/StorySection.tsx`

- Change section label from "How It Started" → `"The Full Story"`
- Keep the detailed narrative paragraphs (they expand on the Why/How/What summary above)
- This avoids the "similar format" issue previously reported

---

## Technical Notes

- No new dependencies needed — uses existing `framer-motion`, Tailwind, and Lucide icons
- The `WhyHowWhatSection` will follow the same animation patterns as `WhyYouDeserveSection` for consistency
- All changes are purely frontend copy and layout — no Shopify or database changes
- Mobile-first: three-column section uses `grid-cols-1 md:grid-cols-3`


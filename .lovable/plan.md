# Collection “View More” and Original Product Images

## Goal
Keep the homepage fast while allowing shoppers to browse every active product, and display uploaded product photos without zooming or cropping their original frame.

## Changes

1. **Add progressive product loading**
   - Keep the initial homepage request limited to 24 active parent products for speed.
   - Add a clear **View More Products** button beneath the collection grid when more products are available.
   - Each click will fetch the next 24 products in the same newest-first order and append them without replacing products already visible.
   - Show a loading state while the next batch arrives, prevent duplicate clicks, and remove the button once all products are displayed.
   - Load enhanced media only for newly added products so the initial page remains lightweight.

2. **Preserve original uploaded image framing**
   - Change homepage product cards and the featured product image from cropped `cover` presentation to a centered `contain` presentation.
   - Apply the same uncropped presentation to the main product-detail image, gallery thumbnails, and variant thumbnails.
   - Use a subtle existing background behind images so portrait, square, and landscape uploads remain polished when their aspect ratio differs from the frame.
   - Request contained image transformations and responsive sizes so images remain sharp without downloading oversized originals.

3. **Keep the existing storefront behavior**
   - Preserve the two-column mobile grid, featured product, product order, pricing, badges, add-to-cart actions, lazy loading, skeletons, and current visual style.
   - Do not change product data, admin upload behavior, checkout, or page copy.

## Verification
- Test with more than 24 active products and confirm every additional batch appears once and in order.
- Confirm the button disappears after the final batch and handles request failures cleanly.
- Check portrait, square, and landscape product uploads on mobile and desktop across collection cards and product detail views.
- Confirm no image is clipped, stretched, or unexpectedly zoomed and that loading remains smooth.

## Technical details
- Replace the one-shot `.limit(24)` behavior with range-based pagination and a `hasMore` state.
- Extend responsive image URL generation to support `resize: "contain"` consistently.
- Use semantic design tokens and existing loading/card styles; no new backend tables or schema changes are required.

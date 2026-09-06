// Meta Pixel (Facebook) event tracking helpers.
// The base pixel code lives in index.html; these helpers fire conversion events
// from user actions across the SPA. Safe to call even if the pixel is blocked
// (ad blockers) — each helper guards on window.fbq existence.

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export const CURRENCY = "INR";

interface ContentItem {
  id: string | number;
  quantity?: number;
  item_price?: number;
  title?: string;
}

interface StandardEventPayload {
  content_ids?: (string | number)[];
  content_name?: string;
  content_type?: string;
  contents?: ContentItem[];
  currency?: string;
  value?: number;
  order_id?: string;
}

function fbqAvailable(): boolean {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

function track(event: string, payload: StandardEventPayload = {}) {
  if (!fbqAvailable()) return;
  // Standard events use fbq('track', eventName, payload)
  window.fbq!("track", event, { currency: CURRENCY, ...payload });
}

export function trackPageView() {
  if (!fbqAvailable()) return;
  window.fbq!("track", "PageView");
}

export function trackViewContent({
  id,
  name,
  price,
}: {
  id: string | number;
  name: string;
  price: number;
}) {
  track("ViewContent", {
    content_ids: [id],
    content_name: name,
    content_type: "product",
    value: price,
  });
}

export function trackAddToCart({
  id,
  name,
  price,
  quantity = 1,
}: {
  id: string | number;
  name: string;
  price: number;
  quantity?: number;
}) {
  track("AddToCart", {
    content_ids: [id],
    content_name: name,
    content_type: "product",
    contents: [{ id, quantity, item_price: price }],
    value: price * quantity,
  });
}

export function trackInitiateCheckout({
  value,
  contents,
}: {
  value: number;
  contents: ContentItem[];
}) {
  track("InitiateCheckout", {
    content_type: "product",
    contents,
    value,
  });
}

export function trackPurchase({
  value,
  orderId,
  contents,
}: {
  value: number;
  orderId: string;
  contents: ContentItem[];
}) {
  track("Purchase", {
    content_type: "product",
    contents,
    order_id: orderId,
    value,
  });
}

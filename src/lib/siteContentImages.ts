const BUCKET = "site-content";
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const PUBLIC_OBJECT_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;
const RENDER_BASE_URL = `${SUPABASE_URL}/storage/v1/render/image/public/${BUCKET}`;

const extractSiteContentPath = (src?: string | null) => {
  if (!src || src === "/placeholder.svg") return null;

  const markers = [
    `/storage/v1/object/public/${BUCKET}/`,
    `/storage/v1/object/authenticated/${BUCKET}/`,
    `/storage/v1/object/sign/${BUCKET}/`,
    `/storage/v1/render/image/public/${BUCKET}/`,
  ];
  for (const marker of markers) {
    const i = src.indexOf(marker);
    if (i >= 0) return decodeURIComponent(src.slice(i + marker.length).split("?")[0]);
  }

  if (!src.startsWith("http") && !src.startsWith("/") && !src.startsWith("data:")) {
    return src.startsWith(`${BUCKET}/`) ? src.slice(BUCKET.length + 1) : src;
  }

  return null;
};

const encodePath = (path: string) => path.split("/").map(encodeURIComponent).join("/");

export interface ImageTransform {
  width?: number;
  height?: number;
  quality?: number;
  resize?: "cover" | "contain" | "fill";
}

// Synchronous — pure string manipulation. Safe to use directly in render.
export const resolveSiteContentImageUrlSync = (src?: string | null, transform?: ImageTransform): string => {
  const path = extractSiteContentPath(src);
  if (!path) return src || "/placeholder.svg";
  const encoded = encodePath(path);
  if (!transform) return `${PUBLIC_OBJECT_BASE_URL}/${encoded}`;
  const params = new URLSearchParams();
  if (transform.width) params.set("width", String(transform.width));
  if (transform.height) params.set("height", String(transform.height));
  params.set("quality", String(transform.quality ?? 70));
  params.set("resize", transform.resize ?? "cover");
  return `${RENDER_BASE_URL}/${encoded}?${params.toString()}`;
};

export const resolveSiteContentImageUrlsSync = (urls?: string[] | null, transform?: ImageTransform): string[] => {
  if (!urls?.length) return ["/placeholder.svg"];
  return urls.map((u) => resolveSiteContentImageUrlSync(u, transform));
};

// Build a srcSet string for responsive product images.
export const buildSiteContentSrcSet = (src?: string | null, widths: number[] = [320, 480, 720, 960]): string => {
  const path = extractSiteContentPath(src);
  if (!path) return "";
  return widths
    .map((w) => `${resolveSiteContentImageUrlSync(src, { width: w, quality: 70 })} ${w}w`)
    .join(", ");
};

// Async wrappers kept for backward compat.
export const resolveSiteContentImageUrl = async (src?: string | null) => resolveSiteContentImageUrlSync(src);
export const resolveSiteContentImageUrls = async (urls?: string[] | null) => resolveSiteContentImageUrlsSync(urls);

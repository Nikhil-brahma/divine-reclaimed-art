const BUCKET = "site-content";
const PUBLIC_OBJECT_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;

const extractSiteContentPath = (src?: string | null) => {
  if (!src || src === "/placeholder.svg") return null;

  const markers = [
    `/storage/v1/object/public/${BUCKET}/`,
    `/storage/v1/object/authenticated/${BUCKET}/`,
    `/storage/v1/object/sign/${BUCKET}/`,
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

// Synchronous — this is pure string manipulation. Use directly in render.
export const resolveSiteContentImageUrlSync = (src?: string | null): string => {
  const path = extractSiteContentPath(src);
  if (!path) return src || "/placeholder.svg";
  return `${PUBLIC_OBJECT_BASE_URL}/${path.split("/").map(encodeURIComponent).join("/")}`;
};

export const resolveSiteContentImageUrlsSync = (urls?: string[] | null): string[] => {
  if (!urls?.length) return ["/placeholder.svg"];
  return urls.map(resolveSiteContentImageUrlSync);
};

// Async wrappers kept for backward compat.
export const resolveSiteContentImageUrl = async (src?: string | null) => resolveSiteContentImageUrlSync(src);
export const resolveSiteContentImageUrls = async (urls?: string[] | null) => resolveSiteContentImageUrlsSync(urls);

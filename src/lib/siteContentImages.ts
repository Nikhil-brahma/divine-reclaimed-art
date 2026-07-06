const BUCKET = "site-content";
const PUBLIC_OBJECT_BASE_URL = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${BUCKET}`;

const extractSiteContentPath = (src?: string | null) => {
  if (!src || src === "/placeholder.svg") return null;

  const fromMarker = (value: string) => {
    const markers = [
      `/storage/v1/object/public/${BUCKET}/`,
      `/storage/v1/object/authenticated/${BUCKET}/`,
      `/storage/v1/object/sign/${BUCKET}/`,
    ];

    for (const marker of markers) {
      const markerIndex = value.indexOf(marker);
      if (markerIndex >= 0) {
        return decodeURIComponent(value.slice(markerIndex + marker.length).split("?")[0]);
      }
    }

    return null;
  };

  const markedPath = fromMarker(src);
  if (markedPath) return markedPath;

  if (!src.startsWith("http") && !src.startsWith("/") && !src.startsWith("data:")) {
    return src.startsWith(`${BUCKET}/`) ? src.slice(BUCKET.length + 1) : src;
  }

  return null;
};

export const resolveSiteContentImageUrl = async (src?: string | null) => {
  const path = extractSiteContentPath(src);
  if (!path) return src || "/placeholder.svg";
  return `${PUBLIC_OBJECT_BASE_URL}/${path.split("/").map(encodeURIComponent).join("/")}`;
};

export const resolveSiteContentImageUrls = async (urls?: string[] | null) => {
  if (!urls?.length) return ["/placeholder.svg"];
  return Promise.all(urls.map((url) => resolveSiteContentImageUrl(url)));
};
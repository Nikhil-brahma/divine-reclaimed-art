import { supabase } from "@/integrations/supabase/client";

const BUCKET = "site-content";
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7;
const signedUrlCache = new Map<string, Promise<string>>();

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

  if (!signedUrlCache.has(path)) {
    signedUrlCache.set(
      path,
      supabase.storage
        .from(BUCKET)
        .createSignedUrl(path, SIGNED_URL_TTL_SECONDS)
        .then(({ data, error }) => {
          if (error || !data?.signedUrl) return src || "/placeholder.svg";
          return data.signedUrl;
        })
    );
  }

  return signedUrlCache.get(path)!;
};

export const resolveSiteContentImageUrls = async (urls?: string[] | null) => {
  if (!urls?.length) return ["/placeholder.svg"];
  return Promise.all(urls.map((url) => resolveSiteContentImageUrl(url)));
};
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
  noindex?: boolean;
  geo?: {
    region?: string;   // e.g. "IN-MH"
    placename?: string; // e.g. "Mumbai, Maharashtra"
    position?: string;  // "lat;lon"
    icbm?: string;      // "lat, lon"
  };
}

const SITE_NAME = "Punarvsu";
const DEFAULT_TITLE = "Punarvsu — Sacred Temple Textile Bags from Delhi";
const DEFAULT_DESCRIPTION =
  "Handcrafted bags from upcycled sacred temple textiles, made by Delhi artisans. Carry blessings, wear heritage. Free shipping above ₹999.";
const DEFAULT_IMAGE = "https://punarvsu.com/lovable-uploads/552a4819-fe43-46cc-876c-80489ab608d6.png";


type MetaOverride = {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  og_title?: string;
  og_description?: string;
};

const SEOHead = ({ title, description, canonical, type = "website", image, noindex, geo }: SEOProps) => {
  const location = useLocation();
  const [override, setOverride] = useState<MetaOverride>({});

  // Fetch DB meta overrides for this page
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("content_overrides")
        .select("key,text_value")
        .eq("page_path", location.pathname)
        .like("key", "meta:%");
      if (cancelled || !data) return;
      const next: MetaOverride = {};
      data.forEach((row) => {
        const k = row.key.replace(/^meta:/, "") as keyof MetaOverride;
        if (row.text_value) (next as any)[k] = row.text_value;
      });
      setOverride(next);
    })();
    return () => { cancelled = true; };
  }, [location.pathname]);

  const buildTitle = (t?: string) => {
    if (!t) return DEFAULT_TITLE;
    const suffix = ` | ${SITE_NAME}`;
    const max = 60;
    if (t.length + suffix.length <= max) return `${t}${suffix}`;
    if (t.length <= max) return t;
    return `${t.slice(0, max - 1).trimEnd()}…`;
  };
  const finalTitle = override.title ? (override.title.length > 60 ? override.title.slice(0, 59).trimEnd() + "…" : override.title) : buildTitle(title);
  const desc = override.description || description || DEFAULT_DESCRIPTION;
  const img = override.image || image || DEFAULT_IMAGE;
  const ogTitle = override.og_title || finalTitle;
  const ogDesc = override.og_description || desc;
  const canonicalUrl = canonical || `https://punarvsu.com${location.pathname}`;

  useEffect(() => {
    document.title = finalTitle;

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta("description", desc);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow");
    if (override.keywords) setMeta("keywords", override.keywords);

    setMeta("og:title", ogTitle, true);
    setMeta("og:description", ogDesc, true);
    setMeta("og:type", type, true);
    setMeta("og:image", img, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:locale", "en_IN", true);

    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", ogTitle);
    setMeta("twitter:description", ogDesc);
    setMeta("twitter:image", img);

    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;

    setMeta("geo.region", geo?.region || "IN-DL");
    setMeta("geo.placename", geo?.placename || "Rohini, Delhi");
    setMeta("geo.position", geo?.position || "28.7495;77.0565");
    setMeta("ICBM", geo?.icbm || "28.7495, 77.0565");
  }, [finalTitle, desc, img, ogTitle, ogDesc, canonicalUrl, type, noindex, override.keywords, geo?.region, geo?.placename, geo?.position, geo?.icbm]);

  return null;
};

export default SEOHead;

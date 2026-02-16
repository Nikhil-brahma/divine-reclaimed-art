import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
  noindex?: boolean;
}

const SITE_NAME = "Punarvsu";
const DEFAULT_TITLE = "Punarvsu — Handcrafted Bags from Sacred Temple Textiles | Delhi";
const DEFAULT_DESCRIPTION =
  "Shop handcrafted bags and accessories made from upcycled sacred temple textiles. Each Punarvsu piece carries real heritage, made by artisans in Delhi. Free shipping above ₹2,999.";
const DEFAULT_IMAGE = "/lovable-uploads/552a4819-fe43-46cc-876c-80489ab608d6.png";

const SEOHead = ({ title, description, canonical, type = "website", image, noindex }: SEOProps) => {
  const location = useLocation();
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const desc = description || DEFAULT_DESCRIPTION;
  const img = image || DEFAULT_IMAGE;
  const canonicalUrl = canonical || `https://divine-reclaimed-art.lovable.app${location.pathname}`;

  useEffect(() => {
    // Title
    document.title = fullTitle;

    // Meta tags
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

    // Open Graph
    setMeta("og:title", fullTitle, true);
    setMeta("og:description", desc, true);
    setMeta("og:type", type, true);
    setMeta("og:image", img, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:site_name", SITE_NAME, true);
    setMeta("og:locale", "en_IN", true);

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    setMeta("twitter:description", desc);
    setMeta("twitter:image", img);

    // Canonical
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonicalUrl;

    // Geo tags for local SEO
    setMeta("geo.region", "IN-DL");
    setMeta("geo.placename", "Rohini, Delhi");
    setMeta("geo.position", "28.7495;77.0565");
    setMeta("ICBM", "28.7495, 77.0565");
  }, [fullTitle, desc, img, canonicalUrl, type, noindex]);

  return null;
};

export default SEOHead;

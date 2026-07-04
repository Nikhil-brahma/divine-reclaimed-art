import { useLocation } from "react-router-dom";

const SITE_URL = "https://punarvsu.com";

// Organization schema — renders on every page
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Punarvsu",
  url: SITE_URL,
  logo: `${SITE_URL}/lovable-uploads/552a4819-fe43-46cc-876c-80489ab608d6.png`,
  description:
    "Handcrafted bags and accessories made from upcycled sacred temple textiles by skilled artisans in Delhi, India.",
  email: "punarvsu.com@gmail.com",
  telephone: "+919220464425",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Maharana Pratap Community Centre, Sector-9, Rohini",
    addressLocality: "Delhi",
    postalCode: "110085",
    addressCountry: "IN",
  },
  sameAs: [],
  foundingDate: "2024",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
};

// Local Business schema for GEO
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Punarvsu",
  image: `${SITE_URL}/lovable-uploads/552a4819-fe43-46cc-876c-80489ab608d6.png`,
  url: SITE_URL,
  telephone: "+919220464425",
  email: "punarvsu.com@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Maharana Pratap Community Centre, Sector-9, Rohini",
    addressLocality: "Delhi",
    addressRegion: "DL",
    postalCode: "110085",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.7495,
    longitude: 77.0565,
  },
  priceRange: "₹₹",
  openingHours: "Mo-Sa 10:00-18:00",
};

// FAQ schema for AEO — answers show up in AI search engines
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What exactly is Bhagwan ki Poshak?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It's the sacred garment that dresses deities in temples. After a while, temples replace these clothes with new ones. Instead of letting them go to waste, Punarvsu collects them respectfully from temple partners like Khatushyam Delhi Dham and from individual devotees.",
      },
    },
    {
      "@type": "Question",
      name: "Are Punarvsu products really handmade?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, 100%. Every single piece is made by hand at the workshop in Rohini, Delhi managed by Sampurna NGO. Each bag takes 8–15 hours to complete with no machines or shortcuts.",
      },
    },
    {
      "@type": "Question",
      name: "How does Punarvsu clean temple fabrics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Punarvsu uses a three-step process: UV sterilisation, gentle washing with plant-based solutions, and steam treatment. It makes everything perfectly hygienic while keeping the fabric's colours and character intact.",
      },
    },
    {
      "@type": "Question",
      name: "Can I send my own sacred cloth to make into a bag?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely! If you have a special piece of cloth from a temple visit or family heirloom, Punarvsu can turn it into something you carry every day. Email punarvsu.com@gmail.com to discuss.",
      },
    },
    {
      "@type": "Question",
      name: "Does Punarvsu ship internationally?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! Punarvsu ships worldwide. Within India, delivery takes 3–10 business days with free shipping on orders above ₹999. International shipping takes 10–21 business days with rates calculated at checkout.",
      },
    },
    {
      "@type": "Question",
      name: "How does buying from Punarvsu help the environment?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every purchase keeps beautiful fabric out of landfills (3,200+ kg saved so far), supports artisan livelihoods through Sampurna NGO, and helps preserve a tradition that might otherwise be forgotten.",
      },
    },
  ],
};

// Speakable schema for AI voice assistants (AEO)
const speakableSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Punarvsu - Sacred Temple Textile Bags & Accessories",
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2", ".hero-description", ".faq-answer"],
  },
  url: "https://punarvsu.com",
};

// Brand knowledge panel for AI engines
const brandKnowledgeSchema = {
  "@context": "https://schema.org",
  "@type": "Brand",
  name: "Punarvsu",
  description: "India's first luxury fashion brand creating handcrafted bags and accessories from upcycled sacred temple textiles (Bhagwan ki Poshak). Based in Rohini, Delhi, Punarvsu transforms retired deity garments from temples like Khatushyam Delhi Dham into blessed fashion accessories.",
  url: "https://punarvsu.com",
  logo: "https://punarvsu.com/lovable-uploads/552a4819-fe43-46cc-876c-80489ab608d6.png",
  slogan: "Carry Blessings, Wear Heritage",
  foundingDate: "2024",
  foundingLocation: {
    "@type": "Place",
    name: "Rohini, Delhi, India",
  },
  knowsAbout: [
    "Sacred temple textiles",
    "Bhagwan ki Poshak",
    "Upcycled fashion",
    "Temple textile bags",
    "Handcrafted bags Delhi",
    "Sustainable luxury India",
    "Sacred fabric accessories",
    "Pooja cloth upcycling",
    "Krishna Clutch bag",
    "Durga Weekender bag",
    "Religious textile art",
    "Hindu temple fashion",
    "Spiritual accessories India",
    "Devotional fashion brand",
    "Mandir vastra bags",
  ],
};

// WebSite schema with search action for sitelinks
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Punarvsu",
  url: "https://punarvsu.com",
  description: "Handcrafted bags from sacred temple textiles. India's first brand transforming Bhagwan ki Poshak into luxury accessories.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://punarvsu.com/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

// BreadcrumbList
const buildBreadcrumbs = (pathname: string) => {
  const crumbs: { name: string; url: string }[] = [{ name: "Home", url: SITE_URL }];
  
  if (pathname.startsWith("/blog")) {
    crumbs.push({ name: "Journal", url: `${SITE_URL}/blog` });
  } else if (pathname.startsWith("/product")) {
    crumbs.push({ name: "Collections", url: `${SITE_URL}/#collections` });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  };
};

interface StructuredDataProps {
  productData?: {
    name: string;
    description: string;
    image: string;
    price: string;
    currency?: string;
    sku?: string;
    available?: boolean;
    url?: string;
  };
  articleData?: {
    headline: string;
    description?: string;
    image?: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    url?: string;
  };
  collectionData?: {
    name: string;
    description?: string;
    url?: string;
  };
  includeHowTo?: boolean;
  faqs?: { question: string; answer: string }[];
}

// HowTo: Sampurna sacred upcycling journey
const sampurnaHowToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "The Sampurna Sacred Upcycling Journey",
  description:
    "How Punarvsu, in partnership with Sampurna NGO, transforms retired temple textiles (Bhagwan ki Poshak) into handcrafted luxury bags in Rohini, Delhi.",
  image: `${SITE_URL}/lovable-uploads/552a4819-fe43-46cc-876c-80489ab608d6.png`,
  totalTime: "P10D",
  estimatedCost: { "@type": "MonetaryAmount", currency: "INR", value: "0" },
  supply: [
    { "@type": "HowToSupply", name: "Retired Bhagwan ki Poshak (sacred temple garments)" },
    { "@type": "HowToSupply", name: "Plant-based cleaning solutions" },
    { "@type": "HowToSupply", name: "Eco-friendly thread & lining" },
  ],
  tool: [
    { "@type": "HowToTool", name: "UV sterilisation chamber" },
    { "@type": "HowToTool", name: "Steam treatment unit" },
    { "@type": "HowToTool", name: "Hand sewing kit" },
  ],
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Reverent Collection",
      text: "Sacred garments are collected from temple partners like Khatushyam Delhi Dham and individual devotees. No fabric touches the ground — each piece is handled with the same devotion as when it dressed the deity.",
      url: `${SITE_URL}/about#collection`,
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Sanctified Cleansing",
      text: "Each textile undergoes UV sterilisation, plant-based washing, and steam treatment. The process is hygienic and preserves the fabric's original colours, embroidery and character.",
      url: `${SITE_URL}/about#cleansing`,
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Artisan Design",
      text: "Kiran Mam, our head artisan, studies each fabric's pattern and story to design a piece that honours its origin — a Krishna Leela cloth may become a peacock-motif clutch.",
      url: `${SITE_URL}/about#design`,
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Handcrafted Stitching",
      text: "Women artisans at the Sampurna NGO workshop in Sector-9, Rohini hand-stitch each bag over 8–15 hours. No machines, no shortcuts.",
      url: `${SITE_URL}/about#stitching`,
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Blessed Delivery",
      text: "Each finished piece is packaged with a Certificate of Sanctity and shipped worldwide, carrying centuries of prayer to its new home.",
      url: `${SITE_URL}/about#delivery`,
    },
  ],
};

const productFaqSchema = (name: string) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: `Is the ${name} really made from sacred temple textile?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `Yes. Every ${name} is handcrafted from authentic Bhagwan ki Poshak — garments that once dressed deities in temples like Khatushyam Delhi Dham. Each piece ships with a Certificate of Sanctity.`,
      },
    },
    {
      "@type": "Question",
      name: "Is the fabric hygienic?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every textile is sanitised through UV sterilisation, plant-based washing and steam treatment before any artisan touches it.",
      },
    },
    {
      "@type": "Question",
      name: "How long does shipping take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Within India: 3–10 business days, free above ₹999. International: 10–21 business days with rates calculated at checkout.",
      },
    },
    {
      "@type": "Question",
      name: "Can this product be returned?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because each piece is sacredly upcycled and one-of-a-kind, we do not accept returns. Reach out at punarvsu.com@gmail.com if anything is wrong with your order and we'll make it right.",
      },
    },
  ],
});

const StructuredData = ({ productData, articleData, collectionData, includeHowTo, faqs }: StructuredDataProps) => {
  const location = useLocation();

  const schemas: object[] = [organizationSchema, localBusinessSchema, websiteSchema, brandKnowledgeSchema, speakableSchema, buildBreadcrumbs(location.pathname)];

  // Add FAQ on homepage and shipping page
  if (location.pathname === "/" || location.pathname === "/shipping") {
    schemas.push(faqSchema);
  }

  // HowTo: Sampurna sacred upcycling journey
  if (includeHowTo) {
    schemas.push(sampurnaHowToSchema);
  }

  // Custom per-page FAQ (product pages, collection pages, etc.)
  if (faqs && faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }

  if (articleData) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: articleData.headline,
      description: articleData.description,
      image: articleData.image,
      datePublished: articleData.datePublished,
      dateModified: articleData.dateModified || articleData.datePublished,
      author: { "@type": "Organization", name: articleData.author || "Punarvsu" },
      publisher: {
        "@type": "Organization",
        name: "Punarvsu",
        logo: { "@type": "ImageObject", url: `${SITE_URL}/lovable-uploads/552a4819-fe43-46cc-876c-80489ab608d6.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": articleData.url || `${SITE_URL}${location.pathname}` },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", "h3", "article p"],
      },
    });
    // Page-level speakable for AI voice assistants on this article
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: articleData.headline,
      url: articleData.url || `${SITE_URL}${location.pathname}`,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", "h3", "article p"],
      },
    });
  }

  if (collectionData) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: collectionData.name,
      description: collectionData.description,
      url: collectionData.url || `${SITE_URL}${location.pathname}`,
    });
  }


  // Add product schema if on product page
  if (productData) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Product",
      name: productData.name,
      description: productData.description,
      image: productData.image,
      brand: { "@type": "Brand", name: "Punarvsu" },
      sku: productData.sku || "",
      offers: {
        "@type": "Offer",
        price: productData.price,
        priceCurrency: productData.currency || "INR",
        availability: productData.available !== false
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        seller: { "@type": "Organization", name: "Punarvsu" },
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingDestination: { "@type": "DefinedRegion", addressCountry: "IN" },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            handlingTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "d" },
            transitTime: { "@type": "QuantitativeValue", minValue: 3, maxValue: 7, unitCode: "d" },
          },
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "2000",
        bestRating: "5",
      },
    });
    // Auto-attach product-specific FAQ for AEO
    if (!faqs || faqs.length === 0) {
      schemas.push(productFaqSchema(productData.name));
    }
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
};

export default StructuredData;

import { useLocation } from "react-router-dom";

const SITE_URL = "https://divine-reclaimed-art.lovable.app";

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
        text: "Absolutely! If you have a special piece of cloth from a temple visit or family heirloom, Punarvsu can turn it into something you carry every day. Email namaste@punarvsu.in to discuss.",
      },
    },
    {
      "@type": "Question",
      name: "Does Punarvsu ship internationally?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Currently Punarvsu ships across India with free delivery on orders above ₹5,000. International shipping is coming soon.",
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

// WebSite schema with search action for sitelinks
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Punarvsu",
  url: SITE_URL,
  description: "Handcrafted bags from sacred temple textiles",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/?q={search_term_string}`,
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
  };
}

const StructuredData = ({ productData }: StructuredDataProps) => {
  const location = useLocation();

  const schemas: object[] = [organizationSchema, localBusinessSchema, websiteSchema, buildBreadcrumbs(location.pathname)];

  // Add FAQ on homepage
  if (location.pathname === "/") {
    schemas.push(faqSchema);
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
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export default StructuredData;

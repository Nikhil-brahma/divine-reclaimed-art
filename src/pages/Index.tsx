import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import AmbientSoundToggle from "@/components/AmbientSoundToggle";
import UspStrip from "@/components/UspStrip";

const GoldenCursor = lazy(() => import("@/components/GoldenCursor"));
const CollectionsSection = lazy(() => import("@/components/NativeCollections"));
const SocialProofSection = lazy(() => import("@/components/SocialProofSection"));
const UrgencySection = lazy(() => import("@/components/UrgencySection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const Footer = lazy(() => import("@/components/Footer"));
const SectionDivider = lazy(() => import("@/components/SectionDivider"));
const SacredJourneyTimeline = lazy(() => import("@/components/SacredJourneyTimeline"));
const ShopByOccasion = lazy(() => import("@/components/ShopByOccasion"));
const BhagwanVastraStory = lazy(() => import("@/components/BhagwanVastraStory"));
const SeoContentBlock = lazy(() => import("@/components/SeoContentBlock"));

// Home page is a tight conversion funnel:
// Hero → Shop the collection → Trust (reviews) → How it's made → Scarcity → FAQ.
// Deep brand storytelling (Why/How/What, Provenance, Founder Story, Deserve, Impact)
// lives on /about so the homepage stays short and convincing.
const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead />
      <StructuredData />

      <Suspense fallback={null}>
        <div className="hidden md:block">
          <GoldenCursor />
        </div>
      </Suspense>

      <AmbientSoundToggle />

      <Navbar />
      <main>
        {/* 1. Hook */}
        <HeroSection />
        <UspStrip />

        {/* 1b. Shop by Occasion — category entry points */}
        <Suspense fallback={null}><ShopByOccasion /><SectionDivider variant="gold" /></Suspense>

        {/* 2. Product — buy now */}
        <Suspense fallback={<div className="min-h-[70vh] bg-background" aria-busy="true" />}><CollectionsSection /><SectionDivider variant="sacred" /></Suspense>

        {/* 3. Trust — real customers */}
        <Suspense fallback={null}><SocialProofSection /><SectionDivider variant="gold" /></Suspense>

        {/* 4. Why it's special — the sacred journey */}
        <div id="sacred-journey">
          <Suspense fallback={null}><SacredJourneyTimeline /></Suspense>
        </div>
        <SectionDivider variant="sacred" />

        {/* 5. Brand story — Bhagwan Vastra */}
        <Suspense fallback={null}><BhagwanVastraStory /></Suspense>
        <SectionDivider variant="sacred" />

        {/* 6. Scarcity — one-of-a-kind */}
        <Suspense fallback={null}><UrgencySection /></Suspense>
        <SectionDivider variant="gold" />

        {/* 7. Objection handling */}
        <Suspense fallback={null}><FAQSection /></Suspense>

        {/* 8. SEO content block */}
        <Suspense fallback={null}><SeoContentBlock /></Suspense>
      </main>
      <Suspense fallback={null}><Footer /></Suspense>
    </div>
  );
};

export default Index;

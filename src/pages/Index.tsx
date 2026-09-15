import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import AmbientSoundToggle from "@/components/AmbientSoundToggle";
import UspStrip from "@/components/UspStrip";
import DeferredRender from "@/components/DeferredRender";

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
        <DeferredRender minHeight="900px"><Suspense fallback={null}><SocialProofSection /><SectionDivider variant="gold" /></Suspense></DeferredRender>

        {/* 4. Why it's special — the sacred journey */}
        <DeferredRender id="sacred-journey" minHeight="1100px">
          <Suspense fallback={null}><SacredJourneyTimeline /></Suspense>
          <Suspense fallback={null}><SectionDivider variant="sacred" /></Suspense>
        </DeferredRender>

        {/* 5. Brand story — Bhagwan Vastra */}
        <DeferredRender id="bhagwan-vastra" minHeight="650px"><Suspense fallback={null}><BhagwanVastraStory /><SectionDivider variant="sacred" /></Suspense></DeferredRender>

        {/* 6. Scarcity — one-of-a-kind */}
        <DeferredRender minHeight="950px"><Suspense fallback={null}><UrgencySection /><SectionDivider variant="gold" /></Suspense></DeferredRender>

        {/* 7. Objection handling */}
        <DeferredRender id="faq" minHeight="1000px"><Suspense fallback={null}><FAQSection /></Suspense></DeferredRender>

        {/* 8. SEO content block */}
        <DeferredRender minHeight="520px"><Suspense fallback={null}><SeoContentBlock /></Suspense></DeferredRender>
      </main>
      <DeferredRender minHeight="620px"><Suspense fallback={null}><Footer /></Suspense></DeferredRender>
    </div>
  );
};

export default Index;

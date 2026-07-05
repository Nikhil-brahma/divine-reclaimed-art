import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollectionsSection from "@/components/NativeCollections";
import SocialProofSection from "@/components/SocialProofSection";
import UrgencySection from "@/components/UrgencySection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import SectionDivider from "@/components/SectionDivider";
import SacredJourneyTimeline from "@/components/SacredJourneyTimeline";
import AmbientSoundToggle from "@/components/AmbientSoundToggle";

const GoldenCursor = lazy(() => import("@/components/GoldenCursor"));

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
        <SectionDivider variant="gold" />

        {/* 2. Product — buy now */}
        <CollectionsSection />
        <SectionDivider variant="sacred" />

        {/* 3. Trust — real customers */}
        <SocialProofSection />
        <SectionDivider variant="gold" />

        {/* 4. Why it's special — the sacred journey */}
        <div id="sacred-journey">
          <SacredJourneyTimeline />
        </div>
        <SectionDivider variant="sacred" />

        {/* 5. Scarcity — one-of-a-kind */}
        <UrgencySection />
        <SectionDivider variant="gold" />

        {/* 6. Objection handling */}
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

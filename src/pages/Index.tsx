import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollectionsSection from "@/components/CollectionsSection";
import SacredProvenanceSection from "@/components/SacredProvenanceSection";
import SocialProofSection from "@/components/SocialProofSection";
import UrgencySection from "@/components/UrgencySection";
import WhyYouDeserveSection from "@/components/WhyYouDeserveSection";
import StorySection from "@/components/StorySection";

import ImpactSection from "@/components/ImpactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import SectionDivider from "@/components/SectionDivider";
import SacredJourneyTimeline from "@/components/SacredJourneyTimeline";
import AmbientSoundToggle from "@/components/AmbientSoundToggle";
import SacredHeroBanner from "@/components/SacredHeroBanner";
import WhyHowWhatStrip from "@/components/WhyHowWhatStrip";
import BulkGiftingBanner from "@/components/BulkGiftingBanner";
import BrandStoryStrip from "@/components/BrandStoryStrip";

const GoldenCursor = lazy(() => import("@/components/GoldenCursor"));

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SEOHead />
      <StructuredData />

      {/* Golden cursor trail — desktop only */}
      <Suspense fallback={null}>
        <div className="hidden md:block">
          <GoldenCursor />
        </div>
      </Suspense>

      {/* Ambient sound toggle */}
      <AmbientSoundToggle />

      <Navbar />
      <main>
        <HeroSection />
        <SectionDivider variant="gold" />
        <CollectionsSection />
        <SectionDivider variant="sacred" />
        <SacredHeroBanner />
        <SectionDivider variant="gold" />
        <WhyHowWhatStrip />
        <SectionDivider variant="sacred" />
        <div id="sacred-journey">
          <SacredJourneyTimeline />
        </div>
        <SectionDivider variant="gold" />
        <SacredProvenanceSection />
        <SectionDivider variant="subtle" />
        <SocialProofSection />
        <SectionDivider variant="gold" />
        <WhyYouDeserveSection />
        <SectionDivider variant="sacred" />
        <StorySection />
        <SectionDivider variant="gold" />
        <UrgencySection />
        <SectionDivider variant="sacred" />
        <ImpactSection />
        <SectionDivider variant="gold" />
        <BulkGiftingBanner />
        <SectionDivider variant="sacred" />
        <BrandStoryStrip />
        <SectionDivider variant="gold" />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

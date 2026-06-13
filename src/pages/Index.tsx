import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollectionsSection from "@/components/NativeCollections";
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
import WhyHowWhatSection from "@/components/WhyHowWhatSection";
import AmbientSoundToggle from "@/components/AmbientSoundToggle";

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
        <WhyHowWhatSection />
        <SectionDivider variant="sacred" />
        <CollectionsSection />
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
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

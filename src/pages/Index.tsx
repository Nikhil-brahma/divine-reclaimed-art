import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollectionsSection from "@/components/CollectionsSection";
import SacredProvenanceSection from "@/components/SacredProvenanceSection";
import SocialProofSection from "@/components/SocialProofSection";
import UrgencySection from "@/components/UrgencySection";
import WhyYouDeserveSection from "@/components/WhyYouDeserveSection";
import StorySection from "@/components/StorySection";
import ProcessSection from "@/components/ProcessSection";
import ImpactSection from "@/components/ImpactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import StructuredData from "@/components/StructuredData";
import SectionDivider from "@/components/SectionDivider";

const GoldenCursor = lazy(() => import("@/components/GoldenCursor"));
const SacredAIOrb = lazy(() => import("@/components/SacredAIOrb"));

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

      <Navbar />
      <main>
        <HeroSection />
        <SectionDivider variant="gold" />
        <CollectionsSection />
        <SectionDivider variant="sacred" />
        <SacredProvenanceSection />
        <SectionDivider variant="subtle" />
        <SocialProofSection />
        <SectionDivider variant="gold" />
        <WhyYouDeserveSection />
        <SectionDivider variant="sacred" />
        <StorySection />
        <SectionDivider variant="gold" />
        <ProcessSection />
        <SectionDivider variant="subtle" />
        <UrgencySection />
        <SectionDivider variant="sacred" />
        <ImpactSection />
        <SectionDivider variant="gold" />
        <FAQSection />
      </main>
      <Footer />

      {/* Sacred AI Orb */}
      <Suspense fallback={null}>
        <SacredAIOrb />
      </Suspense>
    </div>
  );
};

export default Index;

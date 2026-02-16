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

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead />
      <StructuredData />
      <Navbar />
      <main>
        <HeroSection />
        <CollectionsSection />
        <SacredProvenanceSection />
        <SocialProofSection />
        <WhyYouDeserveSection />
        <StorySection />
        <ProcessSection />
        <UrgencySection />
        <ImpactSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

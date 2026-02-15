import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollectionsSection from "@/components/CollectionsSection";
import SacredProvenanceSection from "@/components/SacredProvenanceSection";
import StorySection from "@/components/StorySection";
import ProcessSection from "@/components/ProcessSection";
import ImpactSection from "@/components/ImpactSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <CollectionsSection />
      <SacredProvenanceSection />
      <StorySection />
      <ProcessSection />
      <ImpactSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;

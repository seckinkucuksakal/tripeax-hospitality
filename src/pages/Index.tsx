import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import PainStats from "@/components/PainStats";
import DifferentiatorSection from "@/components/DifferentiatorSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import PricingSection from "@/components/PricingSection";
import DemoSection from "@/components/DemoSection";
import Footer from "@/components/Footer";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollToTopButton />
      <HeroSection />
      <PainStats />
      <DifferentiatorSection />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <DemoSection />
      <Footer />
    </div>
  );
};

export default Index;

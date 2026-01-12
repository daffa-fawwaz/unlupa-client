import { HeroSection } from "@/features/landing/sections/Hero/HeroSection";
import { SolutionSection } from "@/features/landing/sections/Solutions/SolutionSection";
import { MetodologiSection } from "@/features/landing/sections/Metodologi/MetodologiSection";
import { FeatureSection } from "@/features/landing/sections/FeatureSection/FeatureSection";
import { InklusivitasSection } from "@/features/landing/sections/Inklusivitas/InklusivitasSection";
import { CtaSection } from "@/features/landing/sections/CTA/CtaSection";
import { TestimonialSection } from "@/features/landing/sections/Testimonial/TestimonialSection";
import { PriceSection } from "@/features/landing/sections/Price/PriceSection";

export const LandingPage = () => {
  return (
    <div className="bg-[#0f0720] min-h-screen text-white">
      <HeroSection />
      <SolutionSection />
      <MetodologiSection />
      <FeatureSection />
      <InklusivitasSection />
      <TestimonialSection />
      <PriceSection />
      <CtaSection />
    </div>
  );
};

"use client";

import { DifferentiatorSection } from '@/components/Landing/DifferentiatorSection';
import FeatureSection from '@/components/Landing/FeatureSection';
import HeroSection from '@/components/Landing/HeroSection';
import { ReputationSection } from '@/components/Landing/ReputationSystem';
import { SocialProofSection } from '@/components/Landing/Testimonial';
import { TrustSection } from '@/components/Landing/TrustSystem';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <DifferentiatorSection />
      <TrustSection />
      <ReputationSection />
      <SocialProofSection />
    </>
  );
}
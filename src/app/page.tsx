"use client";

import Hero from "@/components/Hero";
import FeatureGrid from "@/components/FeatureGrid";
import Pricing from "@/components/Pricing";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <FeatureGrid />
      <Pricing />
      <CTA />
    </main>
  );
}

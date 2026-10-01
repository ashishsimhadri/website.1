"use client";

import React, { useRef } from "react";
import HeroSection from "./components/HeroSection";
import ScrollSequenceCanvas from "./components/ScrollSequenceCanvas";
import KineticTypographyHero from "./components/KineticTypographyHero";
import PortfolioShowcase from "./components/PortfolioShowcase";

export default function Home() {
  const heroScrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <main className="w-full bg-[#0a0204]">
      {/* ======================================================== */}
      {/* SECTION 1: HERO WITH VIDEO SCROLL SEQUENCE ANIMATION      */}
      {/* ======================================================== */}
      <section ref={heroScrollRef} className="relative w-full h-[350vh] bg-[#0a0204]">
        {/* Fullscreen sticky pinned container for 57-frame sequence + Hero UI */}
        <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden">
          {/* Cinematic Canvas Animation behind hero */}
          <ScrollSequenceCanvas containerRef={heroScrollRef} />

          {/* Hero Section & UI (preserved 100% without changes) */}
          <div className="relative z-10 w-full h-full pointer-events-none [&_*]:pointer-events-auto">
            <HeroSection />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: KINETIC TYPOGRAPHY CONTINUATION               */}
      {/* ======================================================== */}
      <section className="relative w-full">
        <KineticTypographyHero />
      </section>
    </main>
  );
}

"use client";

import React from "react";

export default function HeroSection() {
  return (
    <section className="relative h-full min-h-screen w-full bg-transparent text-white flex flex-col justify-between overflow-hidden select-none">
      {/* ================= BACKGROUND AMBIENCE (Deep luxury tone overlay) ================= */}
      <div 
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 85% 65% at 50% 35%, rgba(180, 130, 50, 0.12) 0%, transparent 70%),
            radial-gradient(circle 500px at 85% 15%, rgba(200, 150, 70, 0.08) 0%, transparent 60%),
            radial-gradient(circle 450px at 15% 60%, rgba(140, 90, 30, 0.08) 0%, transparent 60%)
          `
        }}
      />

      {/* ================= TOP HEADER BAR ================= */}
      <header className="relative z-10 w-full px-6 sm:px-10 md:px-14 lg:px-16 pt-7 sm:pt-9 flex items-center justify-between">
        {/* Left: 8-spoke Asterisk icon + 2-line label */}
        <div className="flex items-center gap-2.5 sm:gap-3 group cursor-default">
          <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-white">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-full h-full transition-transform duration-700 ease-out group-hover:rotate-90"
            >
              <path d="M11 2h2v7.2l5.1-5.1 1.4 1.4L14.4 11H22v2h-7.6l5.1 5.1-1.4 1.4-5.1-5.1V22h-2v-7.6l-5.1 5.1-1.4-1.4 5.1-5.1H2v-2h7.6L4.5 5.5l1.4-1.4 5.1 5.1V2z" />
            </svg>
          </div>
          <div className="flex flex-col text-[11px] sm:text-xs font-black tracking-widest leading-[1.15] uppercase text-white">
            <span>OPEN FOR</span>
            <span>ANY WORK OFFER</span>
          </div>
        </div>

        {/* Center: Monogram Brand Mark (ES+) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-7 sm:top-9">
          <div className="text-xl sm:text-2xl font-black tracking-tight text-white font-display select-none">
            ES+
          </div>
        </div>

        {/* Right: Portfolio Label */}
        <div className="text-[11px] sm:text-xs font-black tracking-widest leading-[1.15] uppercase text-white">
          <span>PORTFOLIO</span>
        </div>
      </header>

      {/* ================= MAIN HERO BODY (SAME PLACEMENT) ================= */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-start px-4 sm:px-8 md:px-12 lg:px-16 pt-6 sm:pt-10 md:pt-14">
        
        {/* GIANT OVERSIZED HEADLINE: "ASHISH" (DECREASED FONT SIZE TO FIT PERFECTLY) */}
        <div className="w-full text-center overflow-hidden">
          <h1 className="w-full font-display font-black uppercase text-white tracking-[-0.03em] leading-[0.85] whitespace-nowrap text-[11vw] sm:text-[12vw] md:text-[12.5vw] lg:text-[13vw] select-none drop-shadow-[0_4px_35px_rgba(0,0,0,0.5)]">
            ASHISH
          </h1>
        </div>

        {/* SUB-ROW UNDER HEADLINE */}
        <div className="w-full px-2 sm:px-4 md:px-6 mt-3 sm:mt-5 md:mt-6 flex items-baseline justify-between">
          {/* Left: Just "PORTFOLIO" */}
          <div className="text-xs sm:text-sm md:text-base font-black tracking-widest uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            PORTFOLIO
          </div>

          {/* Right: Empty / clean */}
          <div />
        </div>

      </div>

      {/* Subtle bottom footer copyright strip */}
      <footer className="relative z-10 w-full py-5 text-center text-[10px] sm:text-xs font-mono font-medium text-white/60 tracking-widest uppercase">
        <span>ASHISH • ALL RIGHTS RESERVED</span>
      </footer>
    </section>
  );
}

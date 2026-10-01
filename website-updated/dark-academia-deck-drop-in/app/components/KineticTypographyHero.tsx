"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import DarkAcademiaDeck from "./DarkAcademiaDeck/DarkAcademiaDeck";

const HEADLINE_TEXT =
  "I create immersive visual stories by blending 3D modeling, interactive game development, and editing";

const NEXT_HEADING_TEXT = "SELECTED WORKS";

// Deterministic pseudo-random generator for consistent letter offsets
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

export default function KineticTypographyHero() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textTrackRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const nextLetterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [scrollProgress, setScrollProgress] = useState(0);

  // Precompute per-letter random offsets for the Kinetic Headline
  const headlineLetters = useMemo(() => {
    return HEADLINE_TEXT.split("").map((char, index) => {
      // Wavy & staggered vertical amplitude between -50px and +50px
      const rand1 = pseudoRandom(index + 1) * 2 - 1;
      const rand2 = pseudoRandom(index * 3 + 7) * 2 - 1;
      const wave = Math.sin(index * 0.45) * 35;
      const maxTranslateY = wave + rand1 * 25;
      // Slight rotation between -16deg and +16deg
      const maxRotate = rand2 * 15;

      return {
        char,
        isSpace: char === " ",
        maxTranslateY,
        maxRotate,
      };
    });
  }, []);

  // Precompute scatter coordinates for the Next Section Heading
  const nextLetters = useMemo(() => {
    return NEXT_HEADING_TEXT.split("").map((char, index) => {
      const rx = (pseudoRandom(index * 13 + 5) * 2 - 1) * 260; // -260px to +260px
      const ry = (pseudoRandom(index * 17 + 11) * 2 - 1) * 220; // -220px to +220px
      const rRot = (pseudoRandom(index * 19 + 3) * 2 - 1) * 75; // -75deg to +75deg

      return {
        char,
        isSpace: char === " ",
        scatterX: rx,
        scatterY: ry,
        scatterRot: rRot,
      };
    });
  }, []);

  useEffect(() => {
    let rafId: number;
    let targetProgress = 0;
    let currentProgress = 0;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const maxScroll = containerRef.current.offsetHeight - window.innerHeight;
      if (maxScroll <= 0) return;

      const progress = Math.min(1, Math.max(0, -rect.top / maxScroll));
      targetProgress = progress;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Persistent Animation Loop for Apple-grade smooth lerp & per-letter kinetic wave
    const renderLoop = () => {
      // Smooth lerp easing
      currentProgress += (targetProgress - currentProgress) * 0.14;
      setScrollProgress(currentProgress);

      const winWidth = window.innerWidth;
      const centerScreenX = winWidth / 2;

      // ==========================================
      // PHASE 1: Horizontal Typography & Kinetic Wave (0.00 to 0.72)
      // ==========================================
      const hProgress = Math.min(1, currentProgress / 0.72);

      if (textTrackRef.current) {
        const trackWidth = textTrackRef.current.scrollWidth || winWidth * 3.5;
        // Travel from offscreen right towards left
        const startX = winWidth * 0.95;
        const endX = -(trackWidth - winWidth * 0.12);
        const currentTrackX = startX + (endX - startX) * hProgress;

        textTrackRef.current.style.transform = `translate3d(${currentTrackX.toFixed(2)}px, 0, 0)`;

        // Calculate per-letter normalization relative to center viewport
        letterRefs.current.forEach((el, index) => {
          if (!el) return;
          const letterData = headlineLetters[index];
          if (!letterData || letterData.isSpace) return;

          // Estimate letter center in screen space
          const letterRect = el.getBoundingClientRect();
          const letterCenterX = letterRect.left + letterRect.width / 2;

          // Distance from screen center (0 = center, 1 = boundary)
          const distFromCenter = Math.abs(letterCenterX - centerScreenX);
          const maxInfluenceRange = winWidth * 0.42;
          const rawFactor = Math.min(1, distFromCenter / maxInfluenceRange);

          // Ease curve: snaps sharply to 0 at center, wobbly at edges
          const normalizeFactor = Math.pow(rawFactor, 1.4);

          const currentY = letterData.maxTranslateY * normalizeFactor;
          const currentRot = letterData.maxRotate * normalizeFactor;

          el.style.transform = `translate3d(0, ${currentY.toFixed(2)}px, 0) rotate(${currentRot.toFixed(2)}deg)`;
        });
      }

      // ==========================================
      // PHASE 2: Cream Container Curtain Slide Up (0.68 to 0.88)
      // ==========================================
      const curtainRaw = Math.min(1, Math.max(0, (currentProgress - 0.68) / 0.18));
      // Ease in-out cubic
      const curtainEase =
        curtainRaw < 0.5
          ? 4 * curtainRaw * curtainRaw * curtainRaw
          : 1 - Math.pow(-2 * curtainRaw + 2, 3) / 2;

      const creamContainer = document.getElementById("kinetic-cream-curtain");
      if (creamContainer) {
        creamContainer.style.transform = `translate3d(0, ${(-curtainEase * 100).toFixed(3)}%, 0)`;
      }

      // ==========================================
      // PHASE 3: Next Section Scattered Assembly (0.76 to 1.00)
      // ==========================================
      const assembleRaw = Math.min(1, Math.max(0, (currentProgress - 0.76) / 0.22));

      nextLetterRefs.current.forEach((el, index) => {
        if (!el) return;
        const data = nextLetters[index];
        if (!data || data.isSpace) return;

        // Per-letter staggered interpolation
        const staggerDelay = (index / nextLetters.length) * 0.25;
        const charProgress = Math.min(
          1,
          Math.max(0, (assembleRaw - staggerDelay) / 0.75)
        );

        // Cubic ease out
        const t = 1 - Math.pow(1 - charProgress, 3);

        const currentX = data.scatterX * (1 - t);
        const currentY = data.scatterY * (1 - t);
        const currentRot = data.scatterRot * (1 - t);
        const currentOpacity = Math.min(1, charProgress * 2.2);

        el.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) rotate(${currentRot.toFixed(2)}deg)`;
        el.style.opacity = currentOpacity.toFixed(3);
      });

      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [headlineLetters, nextLetters]);

  return (
    <div ref={containerRef} className="relative w-full h-[450vh] bg-[#0c0c0e]">
      {/* Sticky Fullscreen Pinned Viewport */}
      <div className="sticky top-0 w-full h-screen h-[100dvh] overflow-hidden select-none">
        
        {/* ======================================================== */}
        {/* SECTION 2: DARK REVEAL SECTION (Underneath the curtain) */}
        {/* ======================================================== */}
        <div className="absolute inset-0 w-full h-full bg-[#0c0c0e] text-white flex flex-col justify-between p-6 sm:p-10 md:p-16 z-0">
          {/* Subtle cosmic / luxury radial ambient backdrop */}
          <div 
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background: `
                radial-gradient(ellipse 70% 60% at 50% 50%, rgba(212, 175, 55, 0.12) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 75%),
                radial-gradient(circle 400px at 85% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 60%)
              `
            }}
          />
          {/* Subtle noise/grid */}
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-15" />

          {/* Dark Section Top Bar */}
          <div className="relative z-10 w-full flex items-center justify-between text-xs sm:text-sm font-mono text-white/50 uppercase tracking-widest">
            <span className="flex items-center gap-2 text-amber-400/90 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              PHASE 02 // REVEAL
            </span>
            <span>PORTFOLIO 2026</span>
          </div>

          {/* Centered Scattered Assembly Heading */}
          <div className="relative z-10 w-full max-w-6xl mx-auto my-auto text-center flex flex-col items-center justify-center py-8">
            <div className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase text-amber-400/80 mb-4 sm:mb-6">
              ✦ ASSEMBLED SHOWCASE
            </div>

            {/* Scattered Characters Container */}
            <h2 className="font-display font-black text-[10vw] sm:text-[11vw] md:text-[9.5vw] lg:text-[8.5vw] tracking-tight leading-[0.9] uppercase text-white flex flex-wrap justify-center items-center">
              {nextLetters.map((item, index) => {
                if (item.isSpace) {
                  return (
                    <span key={index} className="inline-block w-[2.5vw]">
                      &nbsp;
                    </span>
                  );
                }
                return (
                  <span
                    key={index}
                    ref={(el) => {
                      nextLetterRefs.current[index] = el;
                    }}
                    className="inline-block will-change-transform origin-center transition-none"
                    style={{
                      transform: `translate3d(${item.scatterX}px, ${item.scatterY}px, 0) rotate(${item.scatterRot}deg)`,
                      opacity: 0,
                    }}
                  >
                    {item.char}
                  </span>
                );
              })}
            </h2>

            {/* Supporting Content Tags / Teaser */}
            <DarkAcademiaDeck />

            <div className="mt-8 flex flex-wrap justify-center gap-2 sm:gap-3">
              {["3D MOTION DESIGN", "UNREAL ENGINE 5", "INTERACTIVE SHADERS", "VFX EDITING"].map((tag) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-semibold bg-white/[0.06] border border-white/10 text-white/80 backdrop-blur-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Dark Section Bottom Bar */}
          <div className="relative z-10 w-full flex items-center justify-between text-[10px] sm:text-xs font-mono text-white/40 tracking-widest uppercase">
            <span>ASHISH SIMHADRI CREATIVE</span>
            <span>END OF REVEAL ↓</span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: TOP CREAM CONTAINER (Slides up curtain)       */}
        {/* ======================================================== */}
        <div
          id="kinetic-cream-curtain"
          className="absolute inset-0 w-full h-full bg-[#f6f2e9] text-[#141416] flex flex-col justify-between p-6 sm:p-10 md:p-14 z-10 will-change-transform shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
        >
          {/* Subtle scrub progress bar at top */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#141416]/10 z-30">
            <div
              className="h-full bg-amber-500 transition-all duration-75"
              style={{ width: `${Math.min(100, (scrollProgress / 0.72) * 100)}%` }}
            />
          </div>

          {/* Cream Section Top Navigation */}
          <header className="relative z-20 w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#141416]" />
              <span className="font-display font-black text-sm sm:text-base tracking-wider uppercase text-[#141416]">
                ASHISH SIMHADRI
              </span>
            </div>

            <div className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-[#141416]/60 hidden sm:block">
              [ KINETIC TYPOGRAPHY HERO ]
            </div>

            <div className="text-xs sm:text-sm font-mono font-bold tracking-widest uppercase text-[#141416]">
              INDEX // 01
            </div>
          </header>

          {/* Center: The Single-Line Horizontal Kinetic Typography Track */}
          <div className="relative z-10 w-full my-auto flex items-center overflow-visible pointer-events-none py-10 sm:py-16">
            <div
              ref={textTrackRef}
              className="whitespace-nowrap flex items-center will-change-transform font-display font-black text-[#141416] text-[8vw] sm:text-[8.5vw] md:text-[8vw] lg:text-[7.5vw] tracking-[-0.035em] leading-none select-none"
            >
              {headlineLetters.map((item, index) => {
                if (item.isSpace) {
                  return (
                    <span key={index} className="inline-block w-[2.2vw]">
                      &nbsp;
                    </span>
                  );
                }
                return (
                  <span
                    key={index}
                    ref={(el) => {
                      letterRefs.current[index] = el;
                    }}
                    className="inline-block will-change-transform origin-center transition-none"
                  >
                    {item.char}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Cream Section Bottom Footer & Real-Time Scroll Indicator */}
          <footer className="relative z-20 w-full flex items-end justify-between">
            <div className="flex flex-col text-[10px] sm:text-xs font-mono font-semibold text-[#141416]/70 uppercase tracking-widest">
              <span>HORIZONTAL SCROLL-TIED</span>
              <span>KINETIC WAVE NORMALIZATION</span>
            </div>

            {/* Scroll Indicator Pill */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-[#141416] text-[#f6f2e9] text-xs font-mono font-bold shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>SCROLL TO ADVANCE</span>
              <span className="opacity-60">{Math.round(scrollProgress * 100)}%</span>
              <span className="text-amber-400">↓</span>
            </div>

            <div className="text-[10px] sm:text-xs font-mono font-semibold text-[#141416]/70 uppercase tracking-widest text-right">
              <span>CURTAIN LIFT: 70%</span>
              <span>SCATTER SNAP: 80%</span>
            </div>
          </footer>
        </div>

      </div>
    </div>
  );
}

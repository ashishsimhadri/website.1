"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollSequenceCanvasProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const TOTAL_FRAMES = 57;

export default function ScrollSequenceCanvas({ containerRef }: ScrollSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const targetFrameRef = useRef<number>(1);
  const currentFrameRef = useRef<number>(1);
  const renderedFrameRef = useRef<number>(-1);
  const isLoadedRef = useRef<boolean[]>([]);
  const [firstFrameReady, setFirstFrameReady] = useState(false);

  // Progressive Preloading
  useEffect(() => {
    imagesRef.current = new Array(TOTAL_FRAMES + 1).fill(null);
    isLoadedRef.current = new Array(TOTAL_FRAMES + 1).fill(false);

    const getFrameUrl = (index: number) => {
      const padded = String(index).padStart(5, "0");
      return `/frames/frame${padded}.png`;
    };

    // 1. Load Frame 1 immediately with high priority
    const firstImg = new Image();
    firstImg.src = getFrameUrl(1);
    firstImg.onload = () => {
      imagesRef.current[1] = firstImg;
      isLoadedRef.current[1] = true;
      setFirstFrameReady(true);
    };

    // 2. Preload keyframes across the range (every 6th frame) for instant responsiveness
    const keyframeIndices = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 57];
    keyframeIndices.forEach((idx) => {
      const img = new Image();
      img.src = getFrameUrl(idx);
      img.onload = () => {
        imagesRef.current[idx] = img;
        isLoadedRef.current[idx] = true;
      };
    });

    // 3. Progressively load all remaining frames
    for (let i = 2; i <= TOTAL_FRAMES; i++) {
      if (keyframeIndices.includes(i)) continue;
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        imagesRef.current[i] = img;
        isLoadedRef.current[i] = true;
      };
    }
  }, []);

  // Persistent Animation & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let rafId: number;
    let prefersReducedMotion = false;

    if (typeof window !== "undefined") {
      prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }

    // Canvas sizing for Retina / DPR
    const updateCanvasSize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        // Force redraw on resize
        renderedFrameRef.current = -1;
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize, { passive: true });

    // Scroll progress handler
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollDistance = container.offsetHeight - window.innerHeight;

      if (scrollDistance <= 0) {
        targetFrameRef.current = 1;
        return;
      }

      // Calculate progress 0 to 1
      const rawProgress = -rect.top / scrollDistance;
      const progress = Math.min(1, Math.max(0, rawProgress));

      // Map progress directly to frame index: 1 -> 57
      targetFrameRef.current = 1 + progress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial calculation
    handleScroll();

    // Draw frame to canvas with object-fit: cover scaling
    const draw = (frameIndex: number) => {
      // Find requested frame or nearest loaded fallback
      let img = imagesRef.current[frameIndex];
      if (!img || !img.complete || img.naturalWidth === 0) {
        let nearestDist = Infinity;
        let fallback: HTMLImageElement | null = null;
        for (let i = 1; i <= TOTAL_FRAMES; i++) {
          const cand = imagesRef.current[i];
          if (cand && cand.complete && cand.naturalWidth > 0) {
            const dist = Math.abs(i - frameIndex);
            if (dist < nearestDist) {
              nearestDist = dist;
              fallback = cand;
            }
          }
        }
        img = fallback;
      }

      if (!img) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth || 1920;
      const ih = img.naturalHeight || 1088;

      // Object-fit: cover logic
      const scale = Math.max(cw / iw, ch / ih);
      const dw = Math.round(iw * scale);
      const dh = Math.round(ih * scale);
      const dx = Math.round((cw - dw) / 2);
      const dy = Math.round((ch - dh) / 2);

      // Deep dark luxury tone canvas background
      ctx.fillStyle = "#0a0204";
      ctx.fillRect(0, 0, cw, ch);

      // Draw the image frame
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    // Continuous Animation Loop with Smooth Interpolation (lerp)
    const loop = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const delta = target - current;

      if (prefersReducedMotion) {
        currentFrameRef.current = target;
      } else if (Math.abs(delta) > 0.001) {
        // Apple-level smooth lerp interpolation factor
        currentFrameRef.current += delta * 0.12;
      } else {
        currentFrameRef.current = target;
      }

      const frameToDraw = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(currentFrameRef.current))
      );

      // Redraw whenever the frame changes or after resize
      if (frameToDraw !== renderedFrameRef.current) {
        draw(frameToDraw);
        renderedFrameRef.current = frameToDraw;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateCanvasSize);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 bg-[#0a0204]">
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          firstFrameReady ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Subtle cinematic luxury vignette to ensure seamless edges */}
      <div 
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 90% 75% at 50% 50%, transparent 40%, rgba(10, 2, 4, 0.45) 80%, rgba(10, 2, 4, 0.85) 100%),
            linear-gradient(to bottom, rgba(10, 2, 4, 0.5) 0%, transparent 15%, transparent 85%, rgba(10, 2, 4, 0.6) 100%)
          `
        }}
      />
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

/* ================================================================
   DATA — 4 Portfolio Domains
   ================================================================ */

interface MediaSlot {
  src: string;       // placeholder path — swap with real media later
  alt: string;
  span?: string;     // optional grid span class
  isVideo?: boolean;
}

interface PortfolioProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  accent: string;          // accent color
  accentRgb: string;       // for rgba usage
  icon: React.ReactNode;
  media: MediaSlot[];
}

const PROJECTS: PortfolioProject[] = [
  {
    id: "video-editing",
    title: "Video Editing",
    subtitle: "Cinematic Storytelling & Post-Production",
    description:
      "Crafting compelling visual narratives through precision editing, color grading, motion graphics, and sound design. From concept to final cut — every frame tells a story.",
    tags: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Color Grading"],
    accent: "#f59e0b",
    accentRgb: "245, 158, 11",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
        <path d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12z" />
      </svg>
    ),
    media: [
      { src: "/assets/placeholders/video-edit-1.jpg", alt: "Video Edit Showcase 1", span: "col-span-2 row-span-2" },
      { src: "/assets/placeholders/video-edit-2.jpg", alt: "Video Edit Showcase 2" },
      { src: "/assets/placeholders/video-edit-3.jpg", alt: "Video Edit Showcase 3" },
      { src: "/assets/placeholders/video-edit-4.jpg", alt: "Color Grading Demo", span: "col-span-2" },
      { src: "/assets/placeholders/video-edit-5.jpg", alt: "Motion Graphics", isVideo: true },
    ],
  },
  {
    id: "blender",
    title: "Blender",
    subtitle: "3D Modeling, Animation & Visual Effects",
    description:
      "Sculpting immersive 3D worlds with photorealistic rendering, character animation, physics simulations, and procedural geometry. Pushing the boundaries of digital art.",
    tags: ["3D Modeling", "Sculpting", "Cycles Render", "Animation"],
    accent: "#f97316",
    accentRgb: "249, 115, 22",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    media: [
      { src: "/assets/placeholders/blender-1.jpg", alt: "3D Model Showcase 1", span: "col-span-2 row-span-2" },
      { src: "/assets/placeholders/blender-2.jpg", alt: "3D Render 2" },
      { src: "/assets/placeholders/blender-3.jpg", alt: "3D Animation 3" },
      { src: "/assets/placeholders/blender-4.jpg", alt: "Sculpt Demo", span: "col-span-2" },
      { src: "/assets/placeholders/blender-5.jpg", alt: "Physics Sim" },
    ],
  },
  {
    id: "unreal-engine",
    title: "Unreal Engine",
    subtitle: "Game Development & Real-Time Environments",
    description:
      "Building interactive real-time experiences with stunning fidelity — from open-world environments and character systems to cinematic sequences powered by Unreal Engine 5.",
    tags: ["UE5", "Blueprints", "Nanite", "Lumen", "Level Design"],
    accent: "#8b5cf6",
    accentRgb: "139, 92, 246",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
    media: [
      { src: "/assets/placeholders/unreal-1.jpg", alt: "UE5 Environment 1", span: "col-span-2 row-span-2" },
      { src: "/assets/placeholders/unreal-2.jpg", alt: "UE5 Scene 2" },
      { src: "/assets/placeholders/unreal-3.jpg", alt: "UE5 Character 3" },
      { src: "/assets/placeholders/unreal-4.jpg", alt: "Level Design", span: "col-span-2" },
      { src: "/assets/placeholders/unreal-5.jpg", alt: "Blueprint System", isVideo: true },
    ],
  },
  {
    id: "python-gamedev",
    title: "Python Game Dev",
    subtitle: "Interactive Games & Creative Coding",
    description:
      "Designing and programming engaging 2D games and interactive simulations with Python, Pygame, and custom game engines. Combining logic, art, and interactivity.",
    tags: ["Python", "Pygame", "Game Logic", "Procedural Gen"],
    accent: "#10b981",
    accentRgb: "16, 185, 129",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7">
        <path d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
    media: [
      { src: "/assets/placeholders/python-1.jpg", alt: "Python Game 1", span: "col-span-2 row-span-2" },
      { src: "/assets/placeholders/python-2.jpg", alt: "Game Screenshot 2" },
      { src: "/assets/placeholders/python-3.jpg", alt: "Gameplay 3" },
      { src: "/assets/placeholders/python-4.jpg", alt: "Code + Game", span: "col-span-2" },
      { src: "/assets/placeholders/python-5.jpg", alt: "Procedural Level" },
    ],
  },
];

/* ================================================================
   PLACEHOLDER IMAGE COMPONENT
   Renders a styled colored placeholder with label so you can see
   the grid. Replace src with real images later.
   ================================================================ */

function MediaPlaceholder({
  slot,
  accent,
  accentRgb,
}: {
  slot: MediaSlot;
  accent: string;
  accentRgb: string;
}) {
  return (
    <div
      className={`relative group rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.03] ${slot.span || ""}`}
      style={{ minHeight: slot.span?.includes("row-span-2") ? "320px" : "160px" }}
    >
      {/* Gradient placeholder background */}
      <div
        className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-80"
        style={{
          background: `linear-gradient(135deg, rgba(${accentRgb}, 0.15) 0%, rgba(${accentRgb}, 0.05) 50%, rgba(20,20,22,0.9) 100%)`,
        }}
      />

      {/* Crosshatch pattern for visual structure */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, white 10px, white 11px),
                          repeating-linear-gradient(-45deg, transparent, transparent 10px, white 10px, white 11px)`,
      }} />

      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
        {slot.isVideo && (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center border-2 transition-transform duration-300 group-hover:scale-110"
            style={{ borderColor: accent, color: accent }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
        <span className="text-[10px] sm:text-xs font-mono font-semibold text-white/40 tracking-wider uppercase text-center">
          {slot.alt}
        </span>
        <span className="text-[9px] font-mono text-white/20 tracking-widest">
          {slot.src.split("/").pop()}
        </span>
      </div>

      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 30px rgba(${accentRgb}, 0.12), 0 0 20px rgba(${accentRgb}, 0.06)`,
        }}
      />
    </div>
  );
}

/* ================================================================
   PROJECT DETAIL MODAL
   ================================================================ */

function ProjectModal({
  project,
  isOpen,
  onClose,
}: {
  project: PortfolioProject | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!project) return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-[999] flex items-center justify-center transition-all duration-500 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal Container */}
      <div
        className={`relative z-10 w-[95vw] max-w-7xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/[0.08] bg-[#0e0e10] shadow-2xl transition-all duration-500 ${
          isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-8"
        }`}
        style={{
          boxShadow: `0 0 80px rgba(${project.accentRgb}, 0.08), 0 25px 60px rgba(0,0,0,0.6)`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 w-10 h-10 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          aria-label="Close modal"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Accent glow at top */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] rounded-t-3xl"
          style={{ background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)` }}
        />

        <div className="p-6 sm:p-10 md:p-14">
          {/* Two-Column Layout */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
            {/* ─── LEFT COLUMN: Info ─── */}
            <div className="flex-shrink-0 lg:w-[38%] flex flex-col justify-center">
              {/* Category Tag */}
              <div className="flex items-center gap-2 mb-5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: project.accent }}
                />
                <span
                  className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.25em] uppercase"
                  style={{ color: project.accent }}
                >
                  {project.id.replace("-", " ")}
                </span>
              </div>

              {/* Heading */}
              <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] tracking-tight leading-[0.95] text-white mb-3">
                {project.title}
              </h2>

              <p className="text-sm sm:text-base text-white/50 font-medium mb-6 leading-relaxed">
                {project.subtitle}
              </p>

              {/* Description */}
              <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-8">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-semibold border backdrop-blur-sm"
                    style={{
                      borderColor: `rgba(${project.accentRgb}, 0.25)`,
                      color: project.accent,
                      backgroundColor: `rgba(${project.accentRgb}, 0.08)`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA Button */}
              <button
                className="group inline-flex items-center gap-3 px-6 py-3.5 rounded-full font-display font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: `linear-gradient(135deg, ${project.accent}, rgba(${project.accentRgb}, 0.7))`,
                  color: "#0e0e10",
                  boxShadow: `0 4px 25px rgba(${project.accentRgb}, 0.3)`,
                }}
              >
                <span>Explore Projects</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>

            {/* ─── RIGHT COLUMN: Media Grid ─── */}
            <div className="flex-1 min-w-0">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 auto-rows-[160px]">
                {project.media.map((slot, idx) => (
                  <MediaPlaceholder
                    key={idx}
                    slot={slot}
                    accent={project.accent}
                    accentRgb={project.accentRgb}
                  />
                ))}
              </div>

              {/* Bottom info strip */}
              <div className="mt-6 flex items-center justify-between text-[10px] sm:text-xs font-mono text-white/30 tracking-widest uppercase">
                <span>
                  {project.media.length} MEDIA SLOTS • SWAP PLACEHOLDERS IN /assets/placeholders/
                </span>
                <span style={{ color: `rgba(${project.accentRgb}, 0.5)` }}>✦</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   CARD STACK COMPONENT
   ================================================================ */

export default function PortfolioShowcase() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection observer for entrance animation
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const openProject = useCallback((project: PortfolioProject) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    // Delay clearing project data until exit animation finishes
    setTimeout(() => setSelectedProject(null), 500);
  }, []);

  return (
    <>
      <div
        ref={sectionRef}
        className="relative w-full min-h-screen bg-[#0a0204] py-24 sm:py-32 md:py-40 overflow-hidden"
      >
        {/* Ambient Background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 30%, rgba(212, 175, 55, 0.06) 0%, transparent 70%),
              radial-gradient(circle 500px at 20% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 60%),
              radial-gradient(circle 400px at 85% 60%, rgba(16, 185, 129, 0.04) 0%, transparent 60%)
            `,
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-[0.06]" />

        {/* Section Header */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 md:px-16 mb-16 sm:mb-24">
          <div
            className={`transition-all duration-1000 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.3em] uppercase text-amber-400/80">
                CREATIVE TOOLKIT
              </span>
            </div>

            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight leading-[0.9] text-white mb-4">
              My Toolkit
            </h2>

            <p className="max-w-lg text-sm sm:text-base text-white/50 leading-relaxed">
              Four core disciplines — one creative vision. Click any card to explore the work.
            </p>
          </div>
        </div>

        {/* Card Stack */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 md:px-16">
          <div
            className={`flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap items-center justify-center gap-6 sm:gap-4 lg:gap-0 transition-all duration-1000 delay-300 ${
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          >
            {PROJECTS.map((project, index) => {
              const isHovered = hoveredIndex === index;
              const anyHovered = hoveredIndex !== null;

              // Stack offset for desktop (lg+): cards overlap
              // Fan-out on hover
              const stackOffset = (() => {
                if (typeof window !== "undefined" && window.innerWidth < 1024) return {};

                const baseX = index * 260;
                let translateX = baseX;
                let translateY = 0;
                let rotate = 0;
                let scale = 1;
                const zIndex = isHovered ? 50 : 10 + index;

                if (anyHovered) {
                  if (isHovered) {
                    translateY = -16;
                    scale = 1.05;
                    rotate = 0;
                  } else {
                    // Fan neighbors outward
                    const diff = index - (hoveredIndex ?? 0);
                    translateX += diff * 30;
                    translateY = 4;
                    scale = 0.97;
                    rotate = diff * 1.5;
                  }
                }

                return {
                  transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotate}deg) scale(${scale})`,
                  zIndex,
                };
              })();

              return (
                <div
                  key={project.id}
                  className="relative w-full sm:w-[48%] lg:w-[300px] flex-shrink-0 cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={stackOffset}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={() => openProject(project)}
                >
                  <div
                    className={`relative rounded-2xl border bg-[#111113] overflow-hidden transition-all duration-500 ${
                      isHovered
                        ? "border-white/15"
                        : "border-white/[0.06]"
                    }`}
                    style={{
                      boxShadow: isHovered
                        ? `0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(${project.accentRgb}, 0.12)`
                        : "0 8px 30px rgba(0,0,0,0.3)",
                    }}
                  >
                    {/* Card Top Accent Line */}
                    <div
                      className="h-[2px] w-full transition-opacity duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${project.accent}, transparent)`,
                        opacity: isHovered ? 1 : 0.3,
                      }}
                    />

                    <div className="p-6 sm:p-7">
                      {/* Icon + Number */}
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500"
                          style={{
                            backgroundColor: `rgba(${project.accentRgb}, ${isHovered ? 0.15 : 0.08})`,
                            color: project.accent,
                          }}
                        >
                          {project.icon}
                        </div>
                        <span className="text-2xl font-display font-black text-white/10">
                          0{index + 1}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight mb-2 leading-tight">
                        {project.title}
                      </h3>

                      {/* Subtitle */}
                      <p className="text-xs sm:text-sm text-white/45 leading-relaxed mb-5 line-clamp-2">
                        {project.subtitle}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-semibold border"
                            style={{
                              borderColor: `rgba(${project.accentRgb}, 0.2)`,
                              color: `rgba(${project.accentRgb}, 0.7)`,
                              backgroundColor: `rgba(${project.accentRgb}, 0.05)`,
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Explore CTA */}
                      <div
                        className={`flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest transition-all duration-500 ${
                          isHovered ? "opacity-100 translate-x-0" : "opacity-40 -translate-x-1"
                        }`}
                        style={{ color: project.accent }}
                      >
                        <span>Explore</span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className={`w-3.5 h-3.5 transition-transform duration-300 ${
                            isHovered ? "translate-x-1" : ""
                          }`}
                        >
                          <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>

                    {/* Hover glow overlay */}
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
                      style={{
                        opacity: isHovered ? 1 : 0,
                        background: `radial-gradient(circle at 50% 0%, rgba(${project.accentRgb}, 0.06) 0%, transparent 60%)`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section Label */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 md:px-16 mt-16 sm:mt-24">
          <div
            className={`flex items-center justify-between text-[10px] sm:text-xs font-mono text-white/25 tracking-widest uppercase transition-all duration-1000 delay-500 ${
              isInView ? "opacity-100" : "opacity-0"
            }`}
          >
            <span>ASHISH SIMHADRI — CREATIVE PORTFOLIO</span>
            <span>CLICK ANY CARD TO EXPLORE ↑</span>
          </div>
        </div>
      </div>

      {/* Modal Portal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}

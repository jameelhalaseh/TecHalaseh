"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/*  Full-viewport hero section with 3D scene, animated text overlay, and      */
/*  scroll-driven effects. The R3F Canvas is dynamically imported (ssr:false) */
/*  to avoid server-side Three.js issues.                                     */
/* -------------------------------------------------------------------------- */

/* Dynamically import the Canvas scene -- never runs on the server */
const HeroScene = dynamic(
  () => import("@/components/sections/HeroScene"),
  { ssr: false },
);

/* ---- Chevron SVG for scroll indicator ---- */
function ScrollChevron() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-secondary"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

export default function Hero() {
  const t = useTranslations("hero");

  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScroll, setShowScroll] = useState(true);
  const [webGLSupported, setWebGLSupported] = useState(true);

  /* ---- detect WebGL support ---- */
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) setWebGLSupported(false);
    } catch {
      setWebGLSupported(false);
    }
  }, []);

  /* ---- scroll tracking ---- */
  const handleScroll = useCallback(() => {
    const vh = window.innerHeight;
    const progress = Math.min(window.scrollY / vh, 1);
    setScrollProgress(progress);

    /* fade scroll indicator on any scroll */
    if (progress > 0.05) setShowScroll(false);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ---- auto-hide scroll indicator after 3 s ---- */
  useEffect(() => {
    const timer = setTimeout(() => setShowScroll(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  /* ---- derived overlay opacity (fades out on scroll) ---- */
  const overlayOpacity = Math.max(1 - scrollProgress * 2.5, 0);

  return (
    <section
      id="hero"
      className="relative h-screen w-full overflow-hidden"
    >
      {/* ---- Background gradient + grid ---- */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #0A0A0F 0%, #12121A 100%)",
        }}
      />
      <div className="grid-pattern absolute inset-0" />

      {/* ---- 3D Scene or fallback ---- */}
      {webGLSupported ? (
        <HeroScene scrollProgress={scrollProgress} />
      ) : (
        /* Fallback gradient when WebGL is unavailable */
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(10,132,255,0.08) 0%, transparent 60%), " +
              "radial-gradient(ellipse at 30% 70%, rgba(139,92,246,0.06) 0%, transparent 50%)",
          }}
        />
      )}

      {/* ---- Text overlay ---- */}
      <div
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        style={{ opacity: overlayOpacity }}
      >
        <div className="pointer-events-auto flex flex-col items-center gap-4 px-4 text-center">
          {/* Name / title */}
          <h1 className="text-7xl font-bold leading-none tracking-tight text-text-primary md:text-8xl lg:text-9xl">
            {t("name")}
          </h1>

          {/* Tagline */}
          <p className="max-w-lg text-2xl text-text-secondary">
            {t("tagline")}
          </p>

          {/* Subtitle / roles */}
          <p className="text-sm tracking-wide text-text-secondary">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* ---- Scroll indicator ---- */}
      <motion.div
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: showScroll ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xs tracking-widest text-text-muted uppercase">
          {t("scroll")}
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ScrollChevron />
        </motion.div>
      </motion.div>
    </section>
  );
}

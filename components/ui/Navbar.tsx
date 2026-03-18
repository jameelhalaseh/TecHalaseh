"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { SCENES } from "@/lib/constants";
import { SCENE_RANGES, SCROLL_HEIGHT_VH } from "@/lib/sceneConfig";

export default function Navbar() {
  const progress = useScrollProgress();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setScrolled(progress > 0.005);
  }, [progress]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const scrollToScene = useCallback((sceneId: string) => {
    const scene = SCENE_RANGES.find((s) => s.id === sceneId);
    if (!scene) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = scene.start * docHeight;
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  const scrollToContact = useCallback(() => {
    scrollToScene("farewell");
  }, [scrollToScene]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-6 md:px-10 ${
          scrolled
            ? "border-b border-white/5 bg-[#06060B]/70 backdrop-blur-xl"
            : "bg-transparent"
        }`}
        style={{ transition: "background-color 0.3s, border-color 0.3s" }}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="font-[family-name:var(--font-display)] text-lg font-bold text-text-primary hover:opacity-80"
          style={{ letterSpacing: "-0.02em", transition: "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          TecHalaseh
        </button>

        {/* Center nav — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1" role="navigation">
          {SCENES.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollToScene(id)}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary font-[family-name:var(--font-body)] hover:bg-white/5 hover:text-text-primary"
              style={{
                letterSpacing: "0.02em",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* CTA */}
          <button
            onClick={scrollToContact}
            className="hidden md:block px-4 py-2 rounded-xl text-sm font-medium text-white font-[family-name:var(--font-body)]"
            style={{
              background: "linear-gradient(135deg, #0A84FF, #8B5CF6)",
              letterSpacing: "0.02em",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(10, 132, 255, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Let&apos;s Talk
          </button>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden rounded-lg hover:bg-white/5"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block h-[2px] w-5 rounded-full bg-text-primary"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="block h-[2px] w-5 rounded-full bg-text-primary"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
              className="block h-[2px] w-5 rounded-full bg-text-primary"
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#06060B]/95 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col items-center gap-6" role="navigation">
              {SCENES.map(({ id, label }, index) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => scrollToScene(id)}
                  className="text-2xl font-medium text-text-secondary font-[family-name:var(--font-body)] hover:text-text-primary"
                  style={{ transition: "color 0.3s" }}
                >
                  {label}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

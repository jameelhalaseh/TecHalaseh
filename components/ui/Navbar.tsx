"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import { NAV_SECTIONS } from "@/lib/constants";
import LanguageToggle from "./LanguageToggle";

/* -------------------------------------------------------------------------- */
/*  Navbar                                                                     */
/* -------------------------------------------------------------------------- */

export default function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* ---- track scroll to toggle backdrop blur ---- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // sync on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---- lock body scroll when mobile menu is open ---- */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  /* ---- smooth scroll to section ---- */
  const scrollTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      setMobileOpen(false);
    },
    [],
  );

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/*  Desktop / tablet navbar                                            */}
      {/* ------------------------------------------------------------------ */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between px-6 transition-colors duration-300 md:px-10",
          scrolled
            ? "border-b border-white/5 bg-background/70 backdrop-blur-xl"
            : "bg-transparent",
        )}
      >
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-lg font-bold tracking-tight text-text-primary transition-opacity hover:opacity-80"
        >
          TecHalaseh
        </button>

        {/* Center nav links - hidden on mobile */}
        <nav className="hidden items-center gap-1 md:flex" role="navigation">
          {NAV_SECTIONS.map(({ id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium text-text-secondary",
                "transition-colors hover:bg-white/5 hover:text-text-primary",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50",
              )}
            >
              {t(id)}
            </button>
          ))}
        </nav>

        {/* Right side: language toggle + hamburger */}
        <div className="flex items-center gap-3">
          <LanguageToggle className="hidden md:flex" />

          {/* Hamburger - visible on mobile only */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className={cn(
              "relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden",
              "rounded-lg transition-colors hover:bg-white/5",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/50",
            )}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <motion.span
              animate={
                mobileOpen
                  ? { rotate: 45, y: 6, width: 20 }
                  : { rotate: 0, y: 0, width: 20 }
              }
              transition={{ duration: 0.25 }}
              className="block h-[2px] w-5 rounded-full bg-text-primary"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="block h-[2px] w-5 rounded-full bg-text-primary"
            />
            <motion.span
              animate={
                mobileOpen
                  ? { rotate: -45, y: -6, width: 20 }
                  : { rotate: 0, y: 0, width: 20 }
              }
              transition={{ duration: 0.25 }}
              className="block h-[2px] w-5 rounded-full bg-text-primary"
            />
          </button>
        </div>
      </motion.header>

      {/* ------------------------------------------------------------------ */}
      {/*  Mobile full-screen overlay                                         */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <nav className="flex flex-col items-center gap-6" role="navigation">
              {NAV_SECTIONS.map(({ id }, index) => (
                <motion.button
                  key={id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  onClick={() => scrollTo(id)}
                  className={cn(
                    "text-2xl font-medium text-text-secondary",
                    "transition-colors hover:text-text-primary",
                    "focus-visible:outline-none focus-visible:text-text-primary",
                  )}
                >
                  {t(id)}
                </motion.button>
              ))}

              {/* Language toggle in mobile menu */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{
                  duration: 0.35,
                  delay: NAV_SECTIONS.length * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <LanguageToggle />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

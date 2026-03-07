"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

/* ---- Decorative floating dots ---- */

const DOTS = [
  { size: 6, x: "10%", y: "20%", color: "#0A84FF", delay: 0 },
  { size: 4, x: "85%", y: "15%", color: "#8B5CF6", delay: 1.2 },
  { size: 5, x: "75%", y: "80%", color: "#00D4AA", delay: 0.6 },
  { size: 3, x: "20%", y: "75%", color: "#0A84FF", delay: 1.8 },
  { size: 4, x: "50%", y: "10%", color: "#8B5CF6", delay: 0.3 },
];

/* ---- Stylised Document Visual ---- */

function DocumentVisual() {
  return (
    <div className="relative flex items-center justify-center py-8">
      {/* Glow shadow underneath */}
      <div
        className="absolute bottom-4 h-6 w-36 rounded-full blur-xl"
        style={{
          background:
            "radial-gradient(ellipse, rgba(10,132,255,0.25) 0%, transparent 70%)",
        }}
      />

      {/* Floating document */}
      <div className="document-bob relative flex h-64 w-48 flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm">
        {/* Faux text lines */}
        <div className="h-2 w-3/4 rounded-full bg-white/10" />
        <div className="h-2 w-full rounded-full bg-white/[0.07]" />
        <div className="h-2 w-5/6 rounded-full bg-white/[0.07]" />
        <div className="mt-2 h-2 w-2/3 rounded-full bg-white/10" />
        <div className="h-2 w-full rounded-full bg-white/[0.07]" />
        <div className="h-2 w-4/5 rounded-full bg-white/[0.07]" />
        <div className="mt-2 h-2 w-1/2 rounded-full bg-white/10" />
        <div className="h-2 w-3/4 rounded-full bg-white/[0.07]" />

        {/* Accent corner fold */}
        <div
          className="absolute right-0 top-0 h-8 w-8"
          style={{
            background:
              "linear-gradient(225deg, rgba(10,132,255,0.15) 0%, transparent 60%)",
            borderBottomLeftRadius: "0.5rem",
          }}
        />
      </div>

      {/* CSS animation for the bob */}
      <style jsx>{`
        .document-bob {
          animation: bob 3s ease-in-out infinite;
        }
        @keyframes bob {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function CVDownload() {
  const t = useTranslations("cvDownload");
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = useCallback(() => {
    /* Create a hidden anchor to trigger the download */
    const link = document.createElement("a");
    link.href = "/files/TecHalaseh_CV.pdf";
    link.download = "TecHalaseh_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloaded(true);
    /* Reset after 2.5 s so the user can re-download */
    setTimeout(() => setDownloaded(false), 2500);
  }, []);

  return (
    <section
      id="cv"
      className="relative flex min-h-[70vh] items-center justify-center overflow-hidden py-32"
    >
      {/* ---- Background decorative dots ---- */}
      {DOTS.map((dot, i) => (
        <span
          key={i}
          className="pointer-events-none absolute rounded-full opacity-30"
          style={{
            width: dot.size,
            height: dot.size,
            left: dot.x,
            top: dot.y,
            backgroundColor: dot.color,
            animation: `floatDot 6s ease-in-out ${dot.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Float animation for decorative dots */}
      <style jsx>{`
        @keyframes floatDot {
          0% {
            transform: translateY(0) scale(1);
          }
          100% {
            transform: translateY(-18px) scale(1.3);
          }
        }
      `}</style>

      {/* ---- Content ---- */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* Title with staggered letters */}
        <h2 className="text-4xl font-bold text-text-primary md:text-5xl">
          {t("title")}
        </h2>

        {/* Subtitle */}
        <p className="mt-4 text-xl text-text-secondary">
          {t("subtitle")}
        </p>

        {/* Document visual */}
        <div className="mt-8">
          <DocumentVisual />
        </div>

        {/* Download button */}
        <motion.button
          onClick={handleDownload}
          className="mt-6 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-4 text-lg font-semibold text-white shadow-lg transition-shadow hover:shadow-accent-blue/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {downloaded ? (
            <motion.span
              key="check"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className="inline-flex items-center gap-2"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Downloaded!
            </motion.span>
          ) : (
            t("button")
          )}
        </motion.button>

        {/* File info */}
        <p className="mt-3 text-sm text-text-muted">
          {t("fileInfo")}
        </p>
      </div>
    </section>
  );
}

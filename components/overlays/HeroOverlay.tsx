"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { BRAND } from "@/lib/constants";

export default function HeroOverlay() {
  const progress = useScrollProgress();
  const [showScroll, setShowScroll] = useState(true);

  // Hide scroll indicator after first scroll or 3s
  useEffect(() => {
    const timer = setTimeout(() => setShowScroll(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (progress > 0.02) setShowScroll(false);
  }, [progress]);

  const opacity = progress < 0.12 ? 1 : Math.max(0, 1 - (progress - 0.12) / 0.03);
  if (opacity <= 0) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
      style={{ opacity }}
    >
      {/* Brand name */}
      <h1
        className="font-[family-name:var(--font-display)] font-bold text-text-primary"
        style={{
          fontSize: "clamp(48px, 10vw, 120px)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          background: "linear-gradient(135deg, #0A84FF 0%, #8B5CF6 50%, #00D4AA 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {BRAND.name}
      </h1>

      {/* Tagline */}
      <p
        className="mt-6 text-text-secondary font-[family-name:var(--font-body)]"
        style={{
          fontSize: "clamp(18px, 2.5vw, 28px)",
          letterSpacing: "0.01em",
          lineHeight: 1.4,
        }}
      >
        {BRAND.tagline}
      </p>

      {/* Subtitle */}
      <p
        className="mt-4 text-text-tertiary font-[family-name:var(--font-body)]"
        style={{
          fontSize: "clamp(14px, 1.5vw, 18px)",
          letterSpacing: "0.04em",
          fontWeight: 500,
        }}
      >
        {BRAND.subtitle}
      </p>

      {/* Scroll indicator */}
      {showScroll && (
        <div
          className="absolute bottom-12 flex flex-col items-center gap-3"
          style={{
            animation: "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
          }}
        >
          <span className="text-text-tertiary text-xs font-[family-name:var(--font-body)] uppercase tracking-[0.1em]">
            Scroll to explore
          </span>
          <div className="w-5 h-8 border border-border-hover rounded-full flex justify-center pt-1.5">
            <div
              className="w-1 h-2 bg-accent-blue rounded-full"
              style={{
                animation: "scrollDot 1.5s cubic-bezier(0.16, 1, 0.3, 1) infinite",
              }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scrollDot {
          0%, 100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(8px);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}

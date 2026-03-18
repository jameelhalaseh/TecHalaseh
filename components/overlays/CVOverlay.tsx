"use client";

import { useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";

/**
 * CV download overlay — centered, prominent, HUGE button.
 * 3D document floats behind this text (centered in FarewellScene).
 */
export default function CVOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "farewell");
  const [downloaded, setDownloaded] = useState(false);

  // CV visible: farewell 0.33-0.63
  const visible = sceneP > 0.33 && sceneP < 0.63;
  const opacity = visible
    ? Math.min(1, (sceneP - 0.33) * 10) * Math.min(1, (0.63 - sceneP) * 10)
    : 0;

  if (opacity <= 0) return null;

  const handleDownload = () => {
    setDownloaded(true);
    const link = document.createElement("a");
    link.href = "/files/TecHalaseh_CV.pdf";
    link.download = "TecHalaseh_CV.pdf";
    link.click();
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center"
      style={{ opacity }}
    >
      <div className="text-center pointer-events-auto max-w-md px-8">
        {/* Headline */}
        <h3
          className="font-[family-name:var(--font-display)] font-bold text-text-primary"
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            letterSpacing: "-0.03em",
            textShadow: "0 0 60px rgba(0,0,0,0.8)",
            lineHeight: 1.1,
          }}
        >
          Ready to learn more?
        </h3>

        <p
          className="mt-4 text-text-secondary font-[family-name:var(--font-body)]"
          style={{ fontSize: "18px", letterSpacing: "0.01em" }}
        >
          Download my full CV for the complete picture.
        </p>

        {/* File indicator */}
        <div
          className="mt-6 mx-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl"
          style={{
            background: "rgba(10, 132, 255, 0.1)",
            border: "1px solid rgba(10, 132, 255, 0.25)",
          }}
        >
          <span style={{ fontSize: "18px" }}>📄</span>
          <span
            className="font-[family-name:var(--font-mono)] text-text-secondary"
            style={{ fontSize: "14px", letterSpacing: "0.02em" }}
          >
            TecHalaseh_CV.pdf
          </span>
        </div>

        {/* HUGE download button */}
        <div className="mt-8">
          <button
            onClick={handleDownload}
            className="group relative w-full font-[family-name:var(--font-body)] font-bold text-white overflow-hidden rounded-2xl"
            style={{
              maxWidth: 400,
              margin: "0 auto",
              display: "block",
              background: downloaded
                ? "linear-gradient(135deg, #00D4AA, #0A84FF)"
                : "linear-gradient(135deg, #0A84FF, #8B5CF6)",
              fontSize: "18px",
              letterSpacing: "0.02em",
              padding: "20px 32px",
              boxShadow: "0 0 50px rgba(10, 132, 255, 0.3)",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              animation: downloaded
                ? "none"
                : "cvPulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite",
              cursor: "pointer",
              border: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow =
                "0 0 70px rgba(10, 132, 255, 0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 0 50px rgba(10, 132, 255, 0.3)";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.97)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
            }}
          >
            {downloaded ? "✓ Downloaded!" : "⬇ Download My CV"}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes cvPulse {
          0%,
          100% {
            box-shadow: 0 0 50px rgba(10, 132, 255, 0.3);
          }
          50% {
            box-shadow: 0 0 70px rgba(10, 132, 255, 0.45);
          }
        }
      `}</style>
    </div>
  );
}

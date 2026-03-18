"use client";

import { useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";

export default function CVOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "farewell");
  const [downloaded, setDownloaded] = useState(false);

  const visible = sceneP > 0.3 && sceneP < 0.55;
  const opacity = visible
    ? Math.min(1, (sceneP - 0.3) * 8) * Math.min(1, (0.55 - sceneP) * 8)
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
            fontSize: "clamp(28px, 4vw, 42px)",
            letterSpacing: "-0.03em",
            textShadow: "0 0 60px rgba(0,0,0,0.8)",
          }}
        >
          Ready to learn more?
        </h3>

        <p
          className="mt-3 text-text-secondary font-[family-name:var(--font-body)]"
          style={{ fontSize: "16px", letterSpacing: "0.01em" }}
        >
          Download my full CV for the complete picture.
        </p>

        {/* File indicator */}
        <div
          className="mt-6 mx-auto inline-flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{
            background: "rgba(10, 132, 255, 0.08)",
            border: "1px solid rgba(10, 132, 255, 0.2)",
          }}
        >
          <span style={{ fontSize: "16px" }}>📄</span>
          <span
            className="font-[family-name:var(--font-mono)] text-text-secondary"
            style={{ fontSize: "13px", letterSpacing: "0.02em" }}
          >
            TecHalaseh_CV.pdf
          </span>
        </div>

        {/* Download button — HUGE and unmissable */}
        <div className="mt-6">
          <button
            onClick={handleDownload}
            className="group relative w-full max-w-sm mx-auto block font-[family-name:var(--font-body)] font-bold text-white overflow-hidden rounded-2xl"
            style={{
              background: downloaded
                ? "linear-gradient(135deg, #00D4AA, #0A84FF)"
                : "linear-gradient(135deg, #0A84FF, #8B5CF6)",
              fontSize: "18px",
              letterSpacing: "0.02em",
              padding: "18px 32px",
              boxShadow: "0 0 40px rgba(10, 132, 255, 0.25)",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              animation: downloaded ? "none" : "cvPulse 2s cubic-bezier(0.16, 1, 0.3, 1) infinite",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.03)";
              e.currentTarget.style.boxShadow = "0 0 60px rgba(10, 132, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 40px rgba(10, 132, 255, 0.25)";
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
          0%, 100% { box-shadow: 0 0 40px rgba(10, 132, 255, 0.25); }
          50% { box-shadow: 0 0 60px rgba(10, 132, 255, 0.4); }
        }
      `}</style>
    </div>
  );
}

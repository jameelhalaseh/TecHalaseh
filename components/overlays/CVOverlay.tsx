"use client";

import { useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";

export default function CVOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "farewell");
  const [downloaded, setDownloaded] = useState(false);

  const visible = sceneP > 0.15 && sceneP < 0.45;
  const opacity = visible
    ? Math.min(1, (sceneP - 0.15) * 8) * Math.min(1, (0.45 - sceneP) * 8)
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
      <div className="text-center pointer-events-auto">
        <h3
          className="font-[family-name:var(--font-display)] font-medium text-text-secondary"
          style={{
            fontSize: "clamp(18px, 2vw, 24px)",
            letterSpacing: "-0.02em",
          }}
        >
          Ready to learn more?
        </h3>

        <button
          onClick={handleDownload}
          className="mt-6 group relative px-8 py-4 rounded-xl font-[family-name:var(--font-body)] font-medium text-white overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0A84FF, #8B5CF6)",
            fontSize: "16px",
            letterSpacing: "0.02em",
            boxShadow: "0 0 30px rgba(10, 132, 255, 0.2)",
            transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 0 40px rgba(10, 132, 255, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 0 30px rgba(10, 132, 255, 0.2)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "scale(0.98)";
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
          }}
        >
          {downloaded ? "Downloaded!" : "Download CV"}
        </button>
      </div>
    </div>
  );
}

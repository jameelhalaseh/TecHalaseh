"use client";

import { useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { SCENES } from "@/lib/constants";
import { SCENE_RANGES, getActiveScene } from "@/lib/sceneConfig";

/**
 * Vertical dots on the right edge showing scene progress.
 * Active scene dot is larger and accent-colored with progress line.
 */
export default function SceneIndicator() {
  const progress = useScrollProgress();
  const activeScene = getActiveScene(progress);
  const [hoveredScene, setHoveredScene] = useState<string | null>(null);

  const scrollToScene = (sceneId: string) => {
    const scene = SCENE_RANGES.find((s) => s.id === sceneId);
    if (!scene) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: scene.start * docHeight, behavior: "smooth" });
  };

  const activeIdx = SCENES.findIndex((s) => s.id === activeScene);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-0">
      {/* Scroll percentage */}
      <span
        className="mb-4 font-[family-name:var(--font-mono)] text-text-tertiary"
        style={{ fontSize: "11px", letterSpacing: "0.04em" }}
      >
        {Math.round(progress * 100)}%
      </span>

      {/* Dots with connecting line */}
      <div className="relative flex flex-col items-center gap-5">
        {/* Progress line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-px"
          style={{
            height: "100%",
            background: "rgba(255, 255, 255, 0.06)",
          }}
        />
        {/* Active progress fill */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 w-px"
          style={{
            height: `${((activeIdx + 0.5) / SCENES.length) * 100}%`,
            background: "linear-gradient(180deg, #0A84FF, #8B5CF6)",
            transition: "height 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />

        {SCENES.map(({ id, label }) => {
          const isActive = activeScene === id;
          const isHovered = hoveredScene === id;

          return (
            <div key={id} className="relative flex items-center z-10">
              {/* Scene label — shows on hover */}
              {(isHovered || isActive) && (
                <span
                  className="absolute right-10 whitespace-nowrap text-xs font-[family-name:var(--font-body)] px-3 py-1.5 rounded-lg"
                  style={{
                    letterSpacing: "0.02em",
                    background: isActive ? "rgba(10, 132, 255, 0.12)" : "rgba(17, 17, 25, 0.85)",
                    border: isActive ? "1px solid rgba(10, 132, 255, 0.25)" : "1px solid rgba(255, 255, 255, 0.06)",
                    color: isActive ? "#0A84FF" : "#A0A0B0",
                    backdropFilter: "blur(12px)",
                    animation: "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {label}
                </span>
              )}

              {/* Dot */}
              <button
                onClick={() => scrollToScene(id)}
                onMouseEnter={() => setHoveredScene(id)}
                onMouseLeave={() => setHoveredScene(null)}
                className="relative flex items-center justify-center pointer-events-auto"
                style={{
                  width: isActive ? 14 : 10,
                  height: isActive ? 14 : 10,
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                aria-label={`Go to ${label}`}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: "100%",
                    height: "100%",
                    background: isActive ? "#0A84FF" : "rgba(255, 255, 255, 0.15)",
                    boxShadow: isActive ? "0 0 12px rgba(10, 132, 255, 0.5)" : "none",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </button>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(4px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

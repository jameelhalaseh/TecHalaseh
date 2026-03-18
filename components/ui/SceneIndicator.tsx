"use client";

import { useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { SCENES } from "@/lib/constants";
import { SCENE_RANGES, getActiveScene } from "@/lib/sceneConfig";

/**
 * Vertical dots on the right edge showing scene progress.
 * Active scene dot is larger and accent-colored.
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

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-4">
      {SCENES.map(({ id, label }) => {
        const isActive = activeScene === id;
        const isHovered = hoveredScene === id;

        return (
          <div key={id} className="relative flex items-center">
            {/* Scene label — shows on hover */}
            {isHovered && (
              <span
                className="absolute right-8 whitespace-nowrap text-xs text-text-secondary font-[family-name:var(--font-body)] px-2 py-1 rounded-md bg-bg-elevated/80 backdrop-blur-sm border border-border-subtle"
                style={{
                  letterSpacing: "0.02em",
                  animation: "fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
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
              className="relative flex items-center justify-center"
              style={{
                width: isActive ? 12 : 8,
                height: isActive ? 12 : 8,
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
                  boxShadow: isActive ? "0 0 8px rgba(10, 132, 255, 0.4)" : "none",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </button>
          </div>
        );
      })}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(4px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

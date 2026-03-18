"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";

/**
 * Project overlay — only shows the "My Work" section title.
 * Actual project details are rendered ON the 3D monitor screens
 * via drei Html in CommandCenter.tsx.
 */
export default function ProjectOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "projects");

  // Scene-level fade
  const sceneOpacity =
    sceneP < 0.05 ? sceneP / 0.05 : sceneP > 0.95 ? (1 - sceneP) / 0.05 : 1;

  if (sceneOpacity <= 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 flex items-center"
      style={{ opacity: sceneOpacity }}
    >
      {/* Section title — shows briefly at the start of the scene */}
      {sceneP < 0.15 && (
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2"
          style={{ opacity: Math.max(0, 1 - sceneP * 8) }}
        >
          <h2
            className="font-[family-name:var(--font-display)] font-bold text-text-primary text-center"
            style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              textShadow: "0 0 60px rgba(0,0,0,0.8)",
            }}
          >
            My Work
          </h2>
        </div>
      )}
    </div>
  );
}

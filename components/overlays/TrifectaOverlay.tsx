"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";
import { TRIFECTA, TRIFECTA_CLOSING } from "@/lib/constants";

export default function TrifectaOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "trifecta");

  const sceneOpacity =
    sceneP < 0.05 ? sceneP / 0.05 : sceneP > 0.95 ? (1 - sceneP) / 0.05 : 1;

  if (sceneOpacity <= 0) return null;

  // Each pillar gets ~25% of the scene, final 25% shows all three
  const activePillar = Math.min(2, Math.floor(sceneP * 3.5));
  const showAll = sceneP > 0.75;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 flex items-center"
      style={{ opacity: sceneOpacity }}
    >
      {/* Individual pillar overlays */}
      {!showAll &&
        TRIFECTA.map((pillar, i) => {
          const pillarP = Math.max(
            0,
            Math.min(1, (sceneP - i * 0.25) / 0.2),
          );
          const isActive = i === activePillar;
          if (!isActive || pillarP <= 0) return null;

          return (
            <div
              key={pillar.id}
              className="absolute left-8 top-1/2 -translate-y-1/2 max-w-lg"
              style={{
                opacity: Math.min(1, pillarP * 3),
              }}
            >
              <div
                className="w-2 h-16 rounded-full mb-4"
                style={{ background: pillar.color }}
              />
              <h2
                className="font-[family-name:var(--font-display)] font-bold text-text-primary"
                style={{
                  fontSize: "clamp(36px, 5vw, 56px)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  color: pillar.color,
                }}
              >
                {pillar.title}
              </h2>
              <p
                className="mt-4 text-text-secondary font-[family-name:var(--font-body)]"
                style={{
                  fontSize: "18px",
                  letterSpacing: "0.01em",
                  lineHeight: 1.65,
                }}
              >
                {pillar.tagline}
              </p>
              <div className="flex flex-wrap gap-2 mt-5">
                {pillar.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-[family-name:var(--font-mono)] text-xs px-3 py-1.5 rounded-lg"
                    style={{
                      background: `${pillar.color}12`,
                      border: `1px solid ${pillar.color}28`,
                      color: pillar.color,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

      {/* All three — closing statement */}
      {showAll && (
        <div
          className="absolute inset-0 flex items-center justify-center text-center px-8"
          style={{ opacity: Math.min(1, (sceneP - 0.75) * 5) }}
        >
          <div className="max-w-2xl">
            {/* Three color dots */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {TRIFECTA.map((p) => (
                <div
                  key={p.id}
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: p.color,
                    boxShadow: `0 0 12px ${p.color}60`,
                  }}
                />
              ))}
            </div>
            <p
              className="font-[family-name:var(--font-display)] font-medium text-text-primary"
              style={{
                fontSize: "clamp(20px, 3vw, 32px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.4,
              }}
            >
              {TRIFECTA_CLOSING}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

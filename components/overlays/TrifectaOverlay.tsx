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

  // Each pillar gets ~25% of the scene, final 25% shows the closing statement
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
              {/* Color bar */}
              <div
                className="w-1.5 h-16 rounded-full mb-5"
                style={{ background: pillar.color, boxShadow: `0 0 20px ${pillar.color}40` }}
              />

              <h2
                className="font-[family-name:var(--font-display)] font-bold"
                style={{
                  fontSize: "clamp(40px, 5vw, 64px)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  color: pillar.color,
                  textShadow: `0 0 60px ${pillar.color}30`,
                }}
              >
                {pillar.title}
              </h2>

              <p
                className="mt-4 text-text-secondary font-[family-name:var(--font-body)]"
                style={{
                  fontSize: "clamp(16px, 1.8vw, 19px)",
                  letterSpacing: "0.01em",
                  lineHeight: 1.65,
                  maxWidth: "480px",
                  textShadow: "0 0 30px rgba(0,0,0,0.5)",
                }}
              >
                {pillar.tagline}
              </p>

              <div className="flex flex-wrap gap-2 mt-6">
                {pillar.skills.map((skill, j) => (
                  <span
                    key={skill}
                    className="font-[family-name:var(--font-mono)] px-3.5 py-1.5 rounded-lg"
                    style={{
                      fontSize: "13px",
                      background: `${pillar.color}12`,
                      border: `1px solid ${pillar.color}28`,
                      color: pillar.color,
                      letterSpacing: "0.02em",
                      fontWeight: 500,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}

      {/* HERO-SIZED closing statement */}
      {showAll && (
        <div
          className="absolute inset-0 flex items-center justify-center text-center px-8"
          style={{ opacity: Math.min(1, (sceneP - 0.75) * 5) }}
        >
          <div className="max-w-3xl">
            {/* Three color dots */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {TRIFECTA.map((p) => (
                <div key={p.id} className="flex flex-col items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full"
                    style={{
                      background: p.color,
                      boxShadow: `0 0 16px ${p.color}60`,
                    }}
                  />
                  <span
                    className="font-[family-name:var(--font-mono)] text-text-tertiary uppercase"
                    style={{ fontSize: "11px", letterSpacing: "0.06em" }}
                  >
                    {p.title.split(" ")[0]}
                  </span>
                </div>
              ))}
            </div>

            {/* The key message — HERO sized */}
            <p
              className="font-[family-name:var(--font-display)] font-bold text-text-primary"
              style={{
                fontSize: "clamp(24px, 3.5vw, 42px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.35,
                textShadow: "0 0 60px rgba(0,0,0,0.8)",
              }}
            >
              {TRIFECTA_CLOSING}
            </p>

            {/* Subtle divider */}
            <div
              className="mx-auto mt-8 h-px"
              style={{
                width: "80px",
                background: "linear-gradient(90deg, transparent, #0A84FF, transparent)",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

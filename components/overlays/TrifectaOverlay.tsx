"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";
import { TRIFECTA, TRIFECTA_CLOSING } from "@/lib/constants";

/**
 * Trifecta overlay — centered pillar text, dramatic line-by-line closing statement.
 * Synced with 3D Shield, Laptop, Brain reveals.
 */
export default function TrifectaOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "trifecta");

  const sceneOpacity =
    sceneP < 0.05 ? sceneP / 0.05 : sceneP > 0.95 ? (1 - sceneP) / 0.05 : 1;

  if (sceneOpacity <= 0) return null;

  // Phase breakdown matching TrifectaScene.tsx:
  // 0-0.25: Shield (cybersecurity)
  // 0.2-0.45: Laptop (development)
  // 0.4-0.65: Brain (AI)
  // 0.6-1.0: All three + closing statement

  const showClosing = sceneP > 0.6;

  // Split closing into lines for dramatic reveal
  const closingLines = [
    "Most developers can't do security.",
    "Most security people can't build apps.",
    "Almost nobody integrates AI into both.",
    "I do all three.",
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-10" style={{ opacity: sceneOpacity }}>
      {/* Individual pillar overlays — CENTERED */}
      {!showClosing &&
        TRIFECTA.map((pillar, i) => {
          // Each pillar has its own visibility window
          const starts = [0, 0.2, 0.4];
          const ends = [0.3, 0.5, 0.65];
          const pillarP =
            sceneP >= starts[i] && sceneP <= ends[i]
              ? Math.min(1, (sceneP - starts[i]) * 8) *
                Math.min(1, (ends[i] - sceneP) * 8)
              : 0;

          if (pillarP <= 0) return null;

          return (
            <div
              key={pillar.id}
              className="absolute inset-0 flex items-center justify-center"
              style={{ opacity: pillarP }}
            >
              <div
                className="text-center max-w-xl px-8"
                style={{
                  transform: `translateY(${(1 - pillarP) * 20}px)`,
                }}
              >
                {/* Color accent bar */}
                <div
                  className="mx-auto mb-6 rounded-full"
                  style={{
                    width: 4,
                    height: 56,
                    background: pillar.color,
                    boxShadow: `0 0 20px ${pillar.color}40`,
                  }}
                />

                {/* Pillar title */}
                <h2
                  className="font-[family-name:var(--font-display)] font-bold"
                  style={{
                    fontSize: "clamp(40px, 5vw, 64px)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.1,
                    color: pillar.color,
                    textShadow: `0 0 60px ${pillar.color}30`,
                    marginBottom: 16,
                  }}
                >
                  {pillar.title}
                </h2>

                {/* Tagline */}
                <p
                  className="font-[family-name:var(--font-body)] text-text-secondary"
                  style={{
                    fontSize: "clamp(16px, 1.8vw, 20px)",
                    letterSpacing: "0.01em",
                    lineHeight: 1.6,
                    textShadow: "0 0 30px rgba(0,0,0,0.5)",
                    marginBottom: 24,
                  }}
                >
                  {pillar.tagline}
                </p>

                {/* Skill tags */}
                <div className="flex flex-wrap justify-center gap-2.5">
                  {pillar.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-[family-name:var(--font-mono)] px-4 py-2 rounded-lg"
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
            </div>
          );
        })}

      {/* CLOSING STATEMENT — hero-sized, line-by-line reveal */}
      {showClosing && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "radial-gradient(circle at center, rgba(6,6,11,0.4) 0%, transparent 70%)",
          }}
        >
          <div className="text-center max-w-3xl px-8">
            {/* Three color dots with labels */}
            <div className="flex items-center justify-center gap-6 mb-10">
              {TRIFECTA.map((p, i) => {
                const dotP = Math.min(1, Math.max(0, (sceneP - 0.6 - i * 0.03) * 15));
                return (
                  <div
                    key={p.id}
                    className="flex flex-col items-center gap-2"
                    style={{ opacity: dotP }}
                  >
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{
                        background: p.color,
                        boxShadow: `0 0 20px ${p.color}70`,
                      }}
                    />
                    <span
                      className="font-[family-name:var(--font-mono)] text-text-tertiary uppercase"
                      style={{ fontSize: "11px", letterSpacing: "0.08em" }}
                    >
                      {p.title.split(" ")[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Line-by-line dramatic reveal */}
            <div className="space-y-3">
              {closingLines.map((line, i) => {
                const lineP = Math.min(1, Math.max(0, (sceneP - 0.65 - i * 0.06) * 8));
                const isLastLine = i === closingLines.length - 1;

                return (
                  <p
                    key={i}
                    className="font-[family-name:var(--font-display)] font-bold"
                    style={{
                      fontSize: isLastLine
                        ? "clamp(28px, 4vw, 48px)"
                        : "clamp(20px, 2.8vw, 36px)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.35,
                      color: isLastLine ? "#F0F0F5" : "#A0A0B0",
                      textShadow: "0 0 60px rgba(0,0,0,0.8)",
                      opacity: lineP,
                      transform: `translateY(${(1 - lineP) * 15}px)`,
                      transition: "none",
                      ...(isLastLine
                        ? {
                            background:
                              "linear-gradient(135deg, #0A84FF, #8B5CF6, #00D4AA)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                          }
                        : {}),
                    }}
                  >
                    {line}
                  </p>
                );
              })}
            </div>

            {/* Divider */}
            <div
              className="mx-auto mt-10 h-px"
              style={{
                width: "100px",
                background: "linear-gradient(90deg, transparent, #0A84FF, transparent)",
                opacity: Math.min(1, Math.max(0, (sceneP - 0.85) * 10)),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

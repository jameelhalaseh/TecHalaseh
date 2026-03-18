"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";
import { PROCESS_STEPS } from "@/lib/constants";

const STEP_ICONS = ["🔍", "🎨", "⚙️", "🛡️", "🚀"];
const STEP_COLORS = ["#0A84FF", "#00D4AA", "#8B5CF6", "#FF6B35", "#0A84FF"];

/**
 * Process overlay — "How I Think" with CENTERED steps, one at a time.
 * Camera is inside the mind space; steps crossfade as user scrolls.
 */
export default function ProcessOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "mind");

  const sceneOpacity =
    sceneP < 0.05 ? sceneP / 0.05 : sceneP > 0.95 ? (1 - sceneP) / 0.05 : 1;

  if (sceneOpacity <= 0) return null;

  // Title phase (0-0.12): "How I Think" with flash effect
  const showTitle = sceneP < 0.12;
  const titleOpacity = showTitle ? Math.min(1, sceneP * 15) * Math.max(0, 1 - sceneP * 10) : 0;

  // Flash effect on entry (brief white flash at 0.02-0.06)
  const flashOpacity =
    sceneP >= 0.02 && sceneP <= 0.08
      ? Math.min(1, (sceneP - 0.02) * 30) * Math.max(0, 1 - (sceneP - 0.04) * 30)
      : 0;

  // Steps phase (0.12-0.90): each step gets ~16% of scene
  const stepsStart = 0.12;
  const stepsEnd = 0.90;
  const stepsRange = stepsEnd - stepsStart;
  const stepDuration = stepsRange / PROCESS_STEPS.length;

  let activeStep = -1;
  let stepProgress = 0;
  if (sceneP >= stepsStart && sceneP < stepsEnd) {
    activeStep = Math.min(
      PROCESS_STEPS.length - 1,
      Math.floor((sceneP - stepsStart) / stepDuration),
    );
    stepProgress = ((sceneP - stepsStart) % stepDuration) / stepDuration;
  }

  const stepOpacity =
    activeStep >= 0
      ? Math.min(1, stepProgress * 5) * Math.min(1, (1 - stepProgress) * 5)
      : 0;

  const step = activeStep >= 0 ? PROCESS_STEPS[activeStep] : null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10" style={{ opacity: sceneOpacity }}>
      {/* Entry flash */}
      {flashOpacity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle, rgba(10,132,255,0.3) 0%, transparent 70%)",
            opacity: flashOpacity,
          }}
        />
      )}

      {/* "How I Think" title */}
      {titleOpacity > 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: titleOpacity }}
        >
          <h2
            className="font-[family-name:var(--font-display)] font-bold text-center"
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              letterSpacing: "-0.03em",
              background: "linear-gradient(90deg, #0A84FF, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "none",
              filter: "drop-shadow(0 0 40px rgba(10,132,255,0.4))",
            }}
          >
            How I Think
          </h2>
        </div>
      )}

      {/* CENTERED step display — one at a time with crossfade */}
      {step && stepOpacity > 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: stepOpacity,
            transform: `translateY(${(1 - stepOpacity) * 20}px)`,
          }}
        >
          <div className="text-center max-w-lg px-8">
            {/* Step number + icon */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: `${STEP_COLORS[activeStep]}18`,
                  border: `1px solid ${STEP_COLORS[activeStep]}35`,
                  boxShadow: `0 0 30px ${STEP_COLORS[activeStep]}20`,
                }}
              >
                <span style={{ fontSize: "24px" }}>{STEP_ICONS[activeStep]}</span>
              </div>
              <span
                className="font-[family-name:var(--font-mono)]"
                style={{
                  fontSize: "14px",
                  color: STEP_COLORS[activeStep],
                  letterSpacing: "0.08em",
                  fontWeight: 600,
                }}
              >
                STEP {String(activeStep + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Step title — LARGE */}
            <h3
              className="font-[family-name:var(--font-display)] font-bold text-text-primary"
              style={{
                fontSize: "clamp(36px, 5vw, 48px)",
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                textShadow: "0 0 60px rgba(0,0,0,0.8)",
                marginBottom: 16,
              }}
            >
              {step.label}
            </h3>

            {/* Description — step nodes as readable text */}
            <p
              className="font-[family-name:var(--font-body)] text-text-secondary"
              style={{
                fontSize: "clamp(16px, 1.8vw, 20px)",
                lineHeight: 1.6,
                letterSpacing: "0.01em",
                textShadow: "0 0 30px rgba(0,0,0,0.6)",
              }}
            >
              {step.nodes.join(" · ")}
            </p>

            {/* Step progress dots */}
            <div className="flex items-center justify-center gap-3 mt-8">
              {PROCESS_STEPS.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full"
                  style={{
                    width: i === activeStep ? 12 : 6,
                    height: i === activeStep ? 12 : 6,
                    background:
                      i === activeStep ? STEP_COLORS[i] : "rgba(255,255,255,0.15)",
                    boxShadow:
                      i === activeStep ? `0 0 16px ${STEP_COLORS[i]}60` : "none",
                    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

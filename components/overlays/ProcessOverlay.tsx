"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";
import { PROCESS_STEPS } from "@/lib/constants";

export default function ProcessOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "mind");

  const sceneOpacity =
    sceneP < 0.05 ? sceneP / 0.05 : sceneP > 0.95 ? (1 - sceneP) / 0.05 : 1;

  if (sceneOpacity <= 0) return null;

  const activeStep = Math.min(
    PROCESS_STEPS.length - 1,
    Math.floor(sceneP * (PROCESS_STEPS.length + 0.5)),
  );

  const stepColors = ["#0A84FF", "#00D4AA", "#8B5CF6", "#FF6B35", "#0A84FF"];

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center"
      style={{ opacity: sceneOpacity }}
    >
      {/* Entering the mind title */}
      {sceneP < 0.12 && (
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center"
          style={{ opacity: Math.max(0, 1 - sceneP * 10) }}
        >
          <h2
            className="font-[family-name:var(--font-display)] font-bold"
            style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              letterSpacing: "-0.03em",
              background: "linear-gradient(90deg, #0A84FF, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            How I Think
          </h2>
        </div>
      )}

      {/* Process steps — appearing one by one */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-6">
        {PROCESS_STEPS.map((step, i) => {
          const stepProgress = Math.max(
            0,
            Math.min(1, (sceneP - i * 0.18) / 0.15),
          );
          if (stepProgress <= 0) return null;

          return (
            <div
              key={step.id}
              className="flex items-start gap-4"
              style={{
                opacity: stepProgress,
                transform: `translateX(${(1 - stepProgress) * -30}px)`,
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{
                  background: `${stepColors[i]}20`,
                  border: `1px solid ${stepColors[i]}40`,
                }}
              >
                <span
                  className="font-[family-name:var(--font-mono)] text-sm font-medium"
                  style={{ color: stepColors[i] }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div>
                <h3
                  className="font-[family-name:var(--font-display)] font-medium text-text-primary"
                  style={{
                    fontSize: "20px",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {step.label}
                </h3>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {step.nodes.map((node) => (
                    <span
                      key={node}
                      className="text-text-tertiary font-[family-name:var(--font-body)] text-xs"
                      style={{ letterSpacing: "0.02em" }}
                    >
                      {node}
                      {node !== step.nodes[step.nodes.length - 1] && " ·"}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

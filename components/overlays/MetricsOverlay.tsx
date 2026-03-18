"use client";

import { useEffect, useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";
import { METRICS } from "@/lib/constants";

function useCountUp(target: number, isActive: boolean, duration = 2000): number {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      setValue(0);
      startTimeRef.current = null;
      return;
    }

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isActive, target, duration]);

  return value;
}

/**
 * Metrics overlay — clean background, SOLE FOCUS, no 3D clutter.
 * Shows at the start of the farewell scene.
 */
export default function MetricsOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "farewell");

  // Metrics visible: farewell 0-0.30
  const metricsVisible = sceneP > 0 && sceneP < 0.30;
  const opacity = metricsVisible
    ? Math.min(1, sceneP * 10) * Math.min(1, (0.30 - sceneP) * 10)
    : 0;

  if (opacity <= 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center"
      style={{ opacity }}
    >
      <div className="text-center max-w-2xl px-8">
        {/* Section title */}
        <h2
          className="font-[family-name:var(--font-display)] font-bold text-text-primary mb-12"
          style={{
            fontSize: "clamp(32px, 4vw, 48px)",
            letterSpacing: "-0.03em",
            textShadow: "0 0 60px rgba(0,0,0,0.8)",
          }}
        >
          Impact
        </h2>

        <div className="grid grid-cols-2 gap-10">
          {METRICS.map((metric, i) => (
            <MetricCard
              key={i}
              metric={metric}
              index={i}
              isActive={metricsVisible}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  metric,
  index,
  isActive,
}: {
  metric: (typeof METRICS)[number];
  index: number;
  isActive: boolean;
}) {
  const value = useCountUp(metric.value, isActive);

  return (
    <div className="text-center">
      <div
        className="font-[family-name:var(--font-display)] font-bold"
        style={{
          fontSize: "clamp(56px, 8vw, 96px)",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          background: "linear-gradient(135deg, #0A84FF, #8B5CF6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 20px rgba(10,132,255,0.3))",
        }}
      >
        {metric.prefix}
        {value}
        <span
          style={{
            fontSize: "clamp(24px, 3vw, 36px)",
            WebkitTextFillColor: "#A0A0B0",
          }}
        >
          {metric.suffix}
        </span>
      </div>
      <p
        className="mt-3 font-[family-name:var(--font-body)]"
        style={{
          fontSize: "clamp(14px, 1.4vw, 18px)",
          color: "#A0A0B0",
          letterSpacing: "0.02em",
          textShadow: "0 0 30px rgba(0,0,0,0.5)",
        }}
      >
        {metric.label}
      </p>
    </div>
  );
}

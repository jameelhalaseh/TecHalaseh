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

      // Ease out cubic
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

export default function MetricsOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "farewell");

  const metricsVisible = sceneP > 0 && sceneP < 0.3;
  const opacity = metricsVisible
    ? Math.min(1, sceneP * 8) * Math.min(1, (0.3 - sceneP) * 8)
    : 0;

  if (opacity <= 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center"
      style={{ opacity }}
    >
      <div className="grid grid-cols-2 gap-8 max-w-lg">
        {METRICS.map((metric, i) => (
          <MetricCard key={i} metric={metric} index={i} isActive={metricsVisible} />
        ))}
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
    <div
      className="text-center"
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div
        className="font-[family-name:var(--font-display)] font-bold text-text-primary"
        style={{
          fontSize: "clamp(40px, 6vw, 64px)",
          letterSpacing: "-0.03em",
          lineHeight: 1,
          textShadow: "0 0 60px rgba(0,0,0,0.8)",
        }}
      >
        {metric.prefix}
        {value}
        <span className="text-accent-blue">{metric.suffix}</span>
      </div>
      <p
        className="mt-3 text-text-secondary font-[family-name:var(--font-body)]"
        style={{ fontSize: "15px", letterSpacing: "0.02em", textShadow: "0 0 30px rgba(0,0,0,0.5)" }}
      >
        {metric.label}
      </p>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface CountUpProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}

export default function CountUp({
  end,
  prefix = "",
  suffix = "",
  duration = 2,
  className,
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  const hasAnimated = useRef(false);

  const formatNumber = useCallback(
    (value: number) => {
      return value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    [decimals],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;

            const startTime = performance.now();
            const durationMs = duration * 1000;

            function animate(currentTime: number) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / durationMs, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = eased * end;

              setDisplay(formatNumber(current));

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setDisplay(formatNumber(end));
              }
            }

            requestAnimationFrame(animate);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, formatNumber]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

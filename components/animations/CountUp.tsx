"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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
    [decimals]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;

        const counter = { value: 0 };
        gsap.to(counter, {
          value: end,
          duration,
          ease: "power2.out",
          onUpdate: () => {
            setDisplay(formatNumber(counter.value));
          },
          onComplete: () => {
            setDisplay(formatNumber(end));
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [end, duration, formatNumber]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

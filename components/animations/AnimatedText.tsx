"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import { cn } from "@/lib/cn";

type AnimationMode = "letterByLetter" | "wordByWord" | "typewriter";

interface AnimatedTextProps {
  text: string;
  mode?: AnimationMode;
  className?: string;
  delay?: number;
}

export default function AnimatedText({
  text,
  mode = "letterByLetter",
  className,
  delay = 0,
}: AnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayedText, setDisplayedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  // Split text into parts based on mode
  const parts = useMemo(() => {
    if (mode === "wordByWord") {
      return text.split(/(\s+)/);
    }
    return text.split("");
  }, [text, mode]);

  // Letter-by-letter and word-by-word animations
  useEffect(() => {
    if (mode === "typewriter") return;

    const container = containerRef.current;
    if (!container) return;

    const spans = container.querySelectorAll<HTMLSpanElement>(".anim-unit");
    if (spans.length === 0) return;

    gsap.set(spans, {
      opacity: 0,
      y: mode === "letterByLetter" ? 20 : 30,
    });

    gsap.to(spans, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: mode === "letterByLetter" ? 0.03 : 0.08,
      delay,
      ease: "power2.out",
    });
  }, [mode, delay, parts]);

  // Typewriter animation
  useEffect(() => {
    if (mode !== "typewriter") return;

    let index = 0;
    setDisplayedText("");
    setShowCursor(true);

    const delayTimer = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          // Blink cursor a few times then hide
          setTimeout(() => setShowCursor(false), 2000);
        }
      }, 60);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(delayTimer);
  }, [mode, text, delay]);

  // Cursor blink effect
  useEffect(() => {
    if (mode !== "typewriter" || !showCursor) return;

    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(blinkInterval);
  }, [mode, showCursor]);

  if (mode === "typewriter") {
    return (
      <div className={cn("inline", className)}>
        <span>{displayedText}</span>
        <span
          className={cn(
            "inline-block w-[2px] h-[1em] bg-current ml-[1px] align-middle transition-opacity",
            showCursor ? "opacity-100" : "opacity-0"
          )}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("inline", className)} aria-label={text}>
      {parts.map((part, i) => {
        // Preserve whitespace characters
        if (/^\s+$/.test(part)) {
          return (
            <span key={i} className="anim-unit">
              {part}
            </span>
          );
        }

        return (
          <span
            key={i}
            className="anim-unit inline-block"
            style={{ willChange: "transform, opacity" }}
            aria-hidden="true"
          >
            {part === " " ? "\u00A0" : part}
          </span>
        );
      })}
    </div>
  );
}

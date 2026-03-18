"use client";

import { useState, useEffect } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Simulate loading progress (in real implementation, track actual asset loading)
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 15 + 5;
        if (next >= 100) {
          clearInterval(interval);
          // Begin exit animation
          setTimeout(() => {
            setVisible(false);
            setTimeout(onComplete, 600);
          }, 400);
          return 100;
        }
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  if (!visible) {
    return (
      <div
        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#06060B]"
        style={{
          opacity: 0,
          transition: "opacity 0.6s cubic-bezier(0.7, 0, 0.84, 0)",
          pointerEvents: "none",
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#06060B]">
      {/* Pulsing brand name */}
      <h1
        className="font-[family-name:var(--font-display)] font-bold"
        style={{
          fontSize: "clamp(32px, 6vw, 64px)",
          letterSpacing: "-0.04em",
          background: "linear-gradient(135deg, #0A84FF 0%, #8B5CF6 50%, #00D4AA 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        }}
      >
        TecHalaseh
      </h1>

      {/* Progress bar */}
      <div className="mt-8 w-48 h-px bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.min(100, progress)}%`,
            background: "linear-gradient(90deg, #0A84FF, #8B5CF6)",
            transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>

      {/* Percentage */}
      <span
        className="mt-3 text-text-disabled font-[family-name:var(--font-mono)] text-xs"
        style={{ letterSpacing: "0.04em" }}
      >
        {Math.min(100, Math.floor(progress))}%
      </span>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

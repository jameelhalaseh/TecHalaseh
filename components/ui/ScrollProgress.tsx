"use client";

import { useCallback } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/cn";

interface ScrollProgressProps {
  className?: string;
}

export default function ScrollProgress({ className }: ScrollProgressProps) {
  const { progress, activeSection, sections } = useScrollProgress();

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <div
      className={cn(
        "fixed right-3 top-1/2 z-50 -translate-y-1/2",
        "flex flex-col items-center gap-1",
        "hidden md:flex",
        className
      )}
      role="navigation"
      aria-label="Page sections"
    >
      {/* Vertical progress bar track */}
      <div className="relative h-48 w-1 rounded-full bg-white/10">
        <div
          className="absolute left-0 top-0 w-full rounded-full bg-gradient-to-b from-blue-500 to-purple-500 transition-all duration-300"
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      {/* Section minimap dots */}
      {sections.length > 0 && (
        <div className="mt-3 flex flex-col items-center gap-2">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={cn(
                  "group relative flex items-center justify-center",
                  "h-3 w-3 rounded-full transition-all duration-300",
                  "hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                  isActive
                    ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                    : "bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Scroll to ${section.label}`}
                aria-current={isActive ? "true" : undefined}
              >
                {/* Tooltip */}
                <span
                  className={cn(
                    "pointer-events-none absolute right-6 whitespace-nowrap",
                    "rounded bg-gray-900/90 px-2 py-1 text-xs text-white",
                    "opacity-0 transition-opacity duration-200",
                    "group-hover:opacity-100"
                  )}
                >
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

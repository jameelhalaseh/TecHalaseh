"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";
import { PROJECTS } from "@/lib/constants";

export default function ProjectOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "projects");

  // Calculate which project is focused
  const projectIndex = Math.min(
    PROJECTS.length - 1,
    Math.floor(sceneP * PROJECTS.length * 1.2),
  );

  // Scene-level fade
  const sceneOpacity =
    sceneP < 0.05 ? sceneP / 0.05 : sceneP > 0.95 ? (1 - sceneP) / 0.05 : 1;

  if (sceneOpacity <= 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 flex items-center"
      style={{ opacity: sceneOpacity }}
    >
      {/* Section title — shows briefly */}
      {sceneP < 0.15 && (
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2"
          style={{ opacity: Math.max(0, 1 - sceneP * 8) }}
        >
          <h2
            className="font-[family-name:var(--font-display)] font-bold text-text-primary text-center"
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
            }}
          >
            My Work
          </h2>
        </div>
      )}

      {/* Project cards — positioned to the side of the canvas */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 max-w-md pointer-events-auto">
        {PROJECTS.map((project, i) => {
          const isActive = i === projectIndex;
          const cardProgress = Math.max(
            0,
            Math.min(1, (sceneP - i * 0.22) / 0.22),
          );
          const cardOpacity = isActive ? Math.min(1, cardProgress * 3) : 0;

          if (cardOpacity <= 0) return null;

          return (
            <div
              key={project.id}
              className="glass p-8 mb-4"
              style={{
                opacity: cardOpacity,
                transform: `translateY(${(1 - cardOpacity) * 40}px)`,
                transition: "none",
              }}
            >
              <h3
                className="font-[family-name:var(--font-display)] font-bold text-text-primary"
                style={{
                  fontSize: "24px",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {project.title}
              </h3>
              <p
                className="mt-3 text-text-secondary font-[family-name:var(--font-body)]"
                style={{
                  fontSize: "15px",
                  letterSpacing: "0.01em",
                  lineHeight: 1.65,
                }}
              >
                {project.description}
              </p>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="font-[family-name:var(--font-mono)] text-xs px-3 py-1 rounded-lg"
                    style={{
                      background: `${project.accent}14`,
                      border: `1px solid ${project.accent}33`,
                      color: project.accent,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Stat */}
              <div className="mt-4 flex items-center gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: project.accent }}
                />
                <span
                  className="text-text-tertiary font-[family-name:var(--font-body)] text-sm"
                  style={{ letterSpacing: "0.02em", fontWeight: 500 }}
                >
                  {project.stat}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

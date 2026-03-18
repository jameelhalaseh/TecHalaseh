"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";
import { PROJECTS } from "@/lib/constants";

/**
 * Project overlay — shows "My Work" title, then per-monitor project cards
 * synced with camera zoom stops.
 */
export default function ProjectOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "projects");

  const sceneOpacity =
    sceneP < 0.05 ? sceneP / 0.05 : sceneP > 0.95 ? (1 - sceneP) / 0.05 : 1;

  if (sceneOpacity <= 0) return null;

  // Title shows at start (0-0.12)
  const showTitle = sceneP < 0.12;
  const titleOpacity = showTitle ? Math.max(0, 1 - sceneP * 10) : 0;

  // Active project based on sceneP:
  // 0.15-0.35 = project 0, 0.35-0.55 = project 1, 0.55-0.75 = project 2, 0.75-0.9 = project 3
  let activeProject = -1;
  let projectProgress = 0;
  if (sceneP >= 0.15 && sceneP < 0.35) {
    activeProject = 0;
    projectProgress = (sceneP - 0.15) / 0.2;
  } else if (sceneP >= 0.35 && sceneP < 0.55) {
    activeProject = 1;
    projectProgress = (sceneP - 0.35) / 0.2;
  } else if (sceneP >= 0.55 && sceneP < 0.75) {
    activeProject = 2;
    projectProgress = (sceneP - 0.55) / 0.2;
  } else if (sceneP >= 0.75 && sceneP < 0.9) {
    activeProject = 3;
    projectProgress = (sceneP - 0.75) / 0.15;
  }

  const cardOpacity =
    activeProject >= 0
      ? Math.min(1, projectProgress * 5) * Math.min(1, (1 - projectProgress) * 5)
      : 0;

  const project = activeProject >= 0 ? PROJECTS[activeProject] : null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10" style={{ opacity: sceneOpacity }}>
      {/* "My Work" title */}
      {titleOpacity > 0 && (
        <div
          className="absolute top-[15%] left-1/2 -translate-x-1/2 text-center"
          style={{ opacity: titleOpacity }}
        >
          <h2
            className="font-[family-name:var(--font-display)] font-bold text-text-primary"
            style={{
              fontSize: "clamp(48px, 7vw, 72px)",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              textShadow: "0 0 80px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.6)",
            }}
          >
            My Work
          </h2>
        </div>
      )}

      {/* Per-project glass-morphism card — centered right side of viewport */}
      {project && cardOpacity > 0 && (
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2"
          style={{
            opacity: cardOpacity,
            transform: `translateY(-50%) translateX(${(1 - cardOpacity) * 30}px)`,
          }}
        >
          <div
            style={{
              width: "min(440px, 40vw)",
              padding: "32px 28px",
              background: "rgba(6, 6, 11, 0.8)",
              backdropFilter: "blur(24px)",
              borderRadius: 20,
              border: `1px solid ${project.accent}30`,
              boxShadow: `0 0 60px ${project.accent}15`,
            }}
          >
            {/* Project number */}
            <div
              className="font-[family-name:var(--font-mono)]"
              style={{
                fontSize: "13px",
                color: project.accent,
                letterSpacing: "0.06em",
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              PROJECT {String(activeProject + 1).padStart(2, "0")}
            </div>

            {/* Title */}
            <h3
              className="font-[family-name:var(--font-display)] font-bold text-text-primary"
              style={{
                fontSize: "clamp(22px, 2.5vw, 28px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.25,
                marginBottom: 14,
              }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p
              className="font-[family-name:var(--font-body)] text-text-secondary"
              style={{
                fontSize: "clamp(15px, 1.4vw, 17px)",
                lineHeight: 1.65,
                letterSpacing: "0.01em",
                marginBottom: 18,
              }}
            >
              {project.description}
            </p>

            {/* Tech tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-[family-name:var(--font-mono)]"
                  style={{
                    fontSize: "12px",
                    padding: "4px 12px",
                    borderRadius: 8,
                    background: `${project.accent}15`,
                    border: `1px solid ${project.accent}30`,
                    color: project.accent,
                    letterSpacing: "0.02em",
                    fontWeight: 500,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Key stat */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: project.accent,
                  boxShadow: `0 0 12px ${project.accent}80`,
                }}
              />
              <span
                className="font-[family-name:var(--font-body)]"
                style={{
                  fontSize: "14px",
                  color: project.accent,
                  fontWeight: 600,
                  letterSpacing: "0.02em",
                }}
              >
                {project.stat}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";
import { SERVICES, CREDENTIALS } from "@/lib/constants";

const SERVICE_ICONS: Record<string, string> = {
  code: "💻",
  brain: "🧠",
  shield: "🛡️",
  cloud: "☁️",
  lightbulb: "💡",
};

/**
 * Service overlay — one service at a time, CENTERED on viewport,
 * synced with camera focusing on each holographic panel.
 * Credentials shown at the end.
 */
export default function ServiceOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "showcase");

  const sceneOpacity =
    sceneP < 0.05 ? sceneP / 0.05 : sceneP > 0.95 ? (1 - sceneP) / 0.05 : 1;

  if (sceneOpacity <= 0) return null;

  // Title phase (0 - 0.08)
  const showTitle = sceneP < 0.08;
  const titleOpacity = showTitle ? Math.min(1, sceneP * 20) * Math.max(0, 1 - sceneP * 14) : 0;

  // Services phase (0.08 - 0.88): 5 services, each gets ~16%
  const serviceStart = 0.08;
  const serviceEnd = 0.88;
  const serviceDuration = (serviceEnd - serviceStart) / 5;

  let activeService = -1;
  let serviceProgress = 0;
  if (sceneP >= serviceStart && sceneP < serviceEnd) {
    activeService = Math.min(4, Math.floor((sceneP - serviceStart) / serviceDuration));
    serviceProgress = ((sceneP - serviceStart) % serviceDuration) / serviceDuration;
  }

  const cardOpacity =
    activeService >= 0
      ? Math.min(1, serviceProgress * 5) * Math.min(1, (1 - serviceProgress) * 5)
      : 0;

  const service = activeService >= 0 ? SERVICES[activeService] : null;

  // Credentials phase (0.88 - 1.0)
  const credPhase = Math.max(0, (sceneP - 0.88) / 0.12);

  const scrollToContact = () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: 0.96 * docHeight, behavior: "smooth" });
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-10" style={{ opacity: sceneOpacity }}>
      {/* "What I Offer" title */}
      {titleOpacity > 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: titleOpacity }}
        >
          <h2
            className="font-[family-name:var(--font-display)] font-bold text-text-primary text-center"
            style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              letterSpacing: "-0.03em",
              textShadow: "0 0 80px rgba(0,0,0,0.9)",
            }}
          >
            What I Offer
          </h2>
        </div>
      )}

      {/* Per-service CENTERED card */}
      {service && cardOpacity > 0 && (
        <div
          className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-auto"
          style={{
            opacity: cardOpacity,
            transform: `translateY(-50%) translateX(${(1 - cardOpacity) * -30}px)`,
          }}
        >
          <div
            style={{
              width: "min(500px, 42vw)",
              padding: "36px 32px",
              background: "rgba(6, 6, 11, 0.8)",
              backdropFilter: "blur(24px)",
              borderRadius: 20,
              border: `1px solid ${service.accent}25`,
              boxShadow: `0 0 60px ${service.accent}12`,
            }}
          >
            {/* Service icon + number */}
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: `${service.accent}18`,
                  border: `1px solid ${service.accent}35`,
                }}
              >
                <span style={{ fontSize: "26px" }}>
                  {SERVICE_ICONS[service.icon] || "⚡"}
                </span>
              </div>
              <span
                className="font-[family-name:var(--font-mono)]"
                style={{
                  fontSize: "13px",
                  color: service.accent,
                  letterSpacing: "0.06em",
                  fontWeight: 600,
                }}
              >
                SERVICE {String(activeService + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Title */}
            <h3
              className="font-[family-name:var(--font-display)] font-bold text-text-primary"
              style={{
                fontSize: "clamp(26px, 3vw, 36px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                marginBottom: 12,
              }}
            >
              {service.title}
            </h3>

            {/* Description */}
            <p
              className="font-[family-name:var(--font-body)] text-text-secondary"
              style={{
                fontSize: "clamp(15px, 1.5vw, 18px)",
                lineHeight: 1.65,
                letterSpacing: "0.01em",
                marginBottom: 24,
              }}
            >
              {service.description}
            </p>

            {/* Get a Quote button — full width */}
            <button
              onClick={scrollToContact}
              className="w-full font-[family-name:var(--font-body)] font-semibold text-white rounded-xl"
              style={{
                padding: "16px 24px",
                fontSize: "16px",
                letterSpacing: "0.02em",
                background: `linear-gradient(135deg, ${service.accent}, ${service.accent}CC)`,
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: `0 0 30px ${service.accent}25`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.boxShadow = `0 0 50px ${service.accent}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = `0 0 30px ${service.accent}25`;
              }}
            >
              Get a Quote →
            </button>
          </div>

          {/* Service progress dots */}
          <div className="flex items-center justify-center gap-2 mt-5">
            {SERVICES.map((_, i) => (
              <div
                key={i}
                className="rounded-full"
                style={{
                  width: i === activeService ? 10 : 5,
                  height: i === activeService ? 10 : 5,
                  background:
                    i === activeService
                      ? SERVICES[i].accent
                      : "rgba(255,255,255,0.15)",
                  boxShadow:
                    i === activeService
                      ? `0 0 12px ${SERVICES[i].accent}60`
                      : "none",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Credentials — appears at end of showcase */}
      {credPhase > 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: Math.min(1, credPhase * 3) }}
        >
          <div className="text-center max-w-2xl px-8">
            <h3
              className="font-[family-name:var(--font-display)] font-bold text-text-primary mb-8"
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                letterSpacing: "-0.03em",
                textShadow: "0 0 60px rgba(0,0,0,0.8)",
              }}
            >
              Credentials
            </h3>

            <div className="grid grid-cols-2 gap-5">
              {CREDENTIALS.map((cred, i) => {
                const credP = Math.min(1, Math.max(0, (credPhase - i * 0.15) * 4));
                return (
                  <div
                    key={cred.id}
                    className="pointer-events-auto"
                    style={{
                      opacity: credP,
                      transform: `translateY(${(1 - credP) * 20}px)`,
                      padding: "20px",
                      background: "rgba(6, 6, 11, 0.7)",
                      backdropFilter: "blur(16px)",
                      borderRadius: 16,
                      border: `1px solid ${cred.color}30`,
                      boxShadow: `0 0 30px ${cred.color}10`,
                      textAlign: "center",
                    }}
                  >
                    <div
                      className="font-[family-name:var(--font-mono)] font-bold mb-2"
                      style={{
                        fontSize: "24px",
                        color: cred.color,
                        textShadow: `0 0 20px ${cred.color}40`,
                      }}
                    >
                      {cred.abbr}
                    </div>
                    <div
                      className="font-[family-name:var(--font-body)] text-text-primary mb-1"
                      style={{ fontSize: "15px", fontWeight: 600 }}
                    >
                      {cred.title}
                    </div>
                    <div
                      className="font-[family-name:var(--font-mono)]"
                      style={{
                        fontSize: "12px",
                        color: cred.status === "completed" ? "#00D4AA" : cred.color,
                      }}
                    >
                      {cred.status === "completed" ? "✅ Completed" : "🔄 In Progress"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

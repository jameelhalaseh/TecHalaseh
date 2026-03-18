"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";
import { SERVICES, CREDENTIALS } from "@/lib/constants";

export default function ServiceOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "showcase");

  const sceneOpacity =
    sceneP < 0.05 ? sceneP / 0.05 : sceneP > 0.95 ? (1 - sceneP) / 0.05 : 1;

  if (sceneOpacity <= 0) return null;

  // Phase: services (0-0.5), skills label (0.5-0.7), credentials (0.7-1.0)
  const servicePhase = Math.min(1, sceneP * 2);
  const credentialPhase = Math.max(0, (sceneP - 0.7) / 0.25);

  const scrollToContact = (serviceId?: string) => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: 0.92 * docHeight, behavior: "smooth" });
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity: sceneOpacity }}
    >
      {/* Title */}
      {sceneP < 0.15 && (
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 text-center"
          style={{ opacity: Math.max(0, 1 - sceneP * 8) }}
        >
          <h2
            className="font-[family-name:var(--font-display)] font-bold text-text-primary"
            style={{
              fontSize: "clamp(48px, 6vw, 80px)",
              letterSpacing: "-0.03em",
              textShadow: "0 0 60px rgba(0,0,0,0.8)",
            }}
          >
            What I Offer
          </h2>
        </div>
      )}

      {/* Service cards — left side, larger with CTAs */}
      {servicePhase > 0 && servicePhase < 1 && (
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 max-w-md pointer-events-auto">
          {SERVICES.map((service, i) => {
            const cardP = Math.max(
              0,
              Math.min(1, (servicePhase - i * 0.12) / 0.2),
            );
            if (cardP <= 0) return null;

            return (
              <div
                key={service.id}
                className="glass px-6 py-5"
                style={{
                  opacity: cardP,
                  transform: `translateX(${(1 - cardP) * -30}px)`,
                  transition: "border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${service.accent}18`,
                      border: `1px solid ${service.accent}35`,
                    }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-sm"
                      style={{ background: service.accent }}
                    />
                  </div>
                  <h3
                    className="font-[family-name:var(--font-display)] font-medium text-text-primary"
                    style={{ fontSize: "17px", letterSpacing: "-0.01em" }}
                  >
                    {service.title}
                  </h3>
                </div>
                <p
                  className="text-text-secondary font-[family-name:var(--font-body)]"
                  style={{ fontSize: "14px", letterSpacing: "0.01em", lineHeight: 1.6 }}
                >
                  {service.description}
                </p>
                <button
                  onClick={() => scrollToContact(service.id)}
                  className="mt-3 px-5 py-2 rounded-lg font-[family-name:var(--font-body)] font-medium text-sm"
                  style={{
                    color: service.accent,
                    border: `1px solid ${service.accent}40`,
                    background: `${service.accent}08`,
                    letterSpacing: "0.02em",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${service.accent}20`;
                    e.currentTarget.style.borderColor = `${service.accent}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${service.accent}08`;
                    e.currentTarget.style.borderColor = `${service.accent}40`;
                  }}
                >
                  Get a Quote
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Tech Arsenal label */}
      {sceneP > 0.45 && sceneP < 0.75 && (
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2"
          style={{
            opacity: Math.min(1, (sceneP - 0.45) * 8) * Math.min(1, (0.75 - sceneP) * 8),
          }}
        >
          <h3
            className="font-[family-name:var(--font-display)] font-medium text-text-secondary text-center"
            style={{
              fontSize: "clamp(18px, 2vw, 28px)",
              letterSpacing: "-0.02em",
              textShadow: "0 0 40px rgba(0,0,0,0.6)",
            }}
          >
            Tech Arsenal
          </h3>
        </div>
      )}

      {/* Credentials */}
      {credentialPhase > 0 && (
        <div
          className="absolute right-8 bottom-1/4 flex flex-col gap-3 pointer-events-auto"
          style={{ opacity: credentialPhase }}
        >
          <h3
            className="font-[family-name:var(--font-display)] font-medium text-text-secondary mb-2"
            style={{ fontSize: "15px", letterSpacing: "-0.01em" }}
          >
            Credentials
          </h3>
          {CREDENTIALS.map((cred, i) => (
            <div
              key={cred.id}
              className="flex items-center gap-3"
              style={{
                opacity: Math.min(1, (credentialPhase - i * 0.15) * 5),
                transform: `translateY(${Math.max(0, (1 - credentialPhase + i * 0.15) * 20)}px)`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-[family-name:var(--font-mono)] text-xs font-medium"
                style={{
                  background: `${cred.color}15`,
                  border: `1px solid ${cred.color}30`,
                  color: cred.color,
                }}
              >
                {cred.abbr}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-text-primary font-[family-name:var(--font-body)]"
                  style={{ fontSize: "14px" }}
                >
                  {cred.status === "completed" ? "✅" : "🔄"} {cred.title}
                </span>
                {cred.status === "in-progress" && (
                  <span
                    className="text-xs font-[family-name:var(--font-mono)] px-2 py-0.5 rounded-md"
                    style={{
                      background: `${cred.color}15`,
                      color: cred.color,
                    }}
                  >
                    In Progress
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

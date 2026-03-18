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

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10"
      style={{ opacity: sceneOpacity }}
    >
      {/* Title */}
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
            }}
          >
            What I Offer
          </h2>
        </div>
      )}

      {/* Service cards — left side */}
      {servicePhase > 0 && servicePhase < 1 && (
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 max-w-sm pointer-events-auto">
          {SERVICES.map((service, i) => {
            const cardP = Math.max(
              0,
              Math.min(1, (servicePhase - i * 0.15) / 0.2),
            );
            if (cardP <= 0) return null;

            return (
              <div
                key={service.id}
                className="glass px-5 py-4"
                style={{
                  opacity: cardP,
                  transform: `translateX(${(1 - cardP) * -30}px)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${service.accent}15`,
                      border: `1px solid ${service.accent}30`,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{ background: service.accent }}
                    />
                  </div>
                  <h3
                    className="font-[family-name:var(--font-display)] font-medium text-text-primary text-sm"
                    style={{ letterSpacing: "-0.01em" }}
                  >
                    {service.title}
                  </h3>
                </div>
                <p
                  className="mt-2 text-text-secondary font-[family-name:var(--font-body)] text-xs"
                  style={{ letterSpacing: "0.01em", lineHeight: 1.5 }}
                >
                  {service.description}
                </p>
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
            className="font-[family-name:var(--font-display)] font-medium text-text-secondary text-sm mb-2"
            style={{ letterSpacing: "-0.01em" }}
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
              <div>
                <span className="text-text-primary text-sm font-[family-name:var(--font-body)]">
                  {cred.title}
                </span>
                {cred.status === "in-progress" && (
                  <span
                    className="ml-2 text-xs font-[family-name:var(--font-mono)] px-2 py-0.5 rounded-md"
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

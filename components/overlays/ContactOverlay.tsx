"use client";

import { useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";
import { BRAND } from "@/lib/constants";

export default function ContactOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "farewell");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  // Contact visible: farewell 0.65-1.0
  const visible = sceneP > 0.65;
  const opacity = visible ? Math.min(1, (sceneP - 0.65) * 6) : 0;

  if (opacity <= 0) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
    );
    window.open(`mailto:${BRAND.email}?subject=${subject}&body=${body}`);
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center"
      style={{ opacity }}
    >
      <div
        className="max-w-lg w-full px-8 pointer-events-auto mx-auto"
        style={{
          background: "rgba(6, 6, 11, 0.75)",
          backdropFilter: "blur(20px)",
          borderRadius: 24,
          border: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "40px 32px",
        }}
      >
        {/* Headline with gradient on "extraordinary" */}
        <h2
          className="font-[family-name:var(--font-display)] font-bold text-center text-text-primary"
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
          }}
        >
          Let&apos;s build something{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #0A84FF, #8B5CF6, #00D4AA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            extraordinary.
          </span>
        </h2>

        <p
          className="mt-4 text-text-secondary font-[family-name:var(--font-body)] text-center"
          style={{ fontSize: "16px", letterSpacing: "0.01em" }}
        >
          Have a project in mind? Let&apos;s talk.
        </p>

        {/* Contact links with SVG icons */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <ContactLink
            label="Email"
            href={`mailto:${BRAND.email}`}
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            }
          />
          <ContactLink
            label="LinkedIn"
            href={BRAND.linkedin}
            external
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            }
          />
          <ContactLink
            label="GitHub"
            href={BRAND.github}
            external
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            }
          />
        </div>

        {/* Contact form */}
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {[
            { name: "name" as const, placeholder: "Your name", type: "text" },
            { name: "email" as const, placeholder: "Your email", type: "email" },
          ].map((field) => (
            <div key={field.name} className="relative">
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
                required
                className="w-full bg-transparent border-b border-border-subtle pb-3 text-text-primary font-[family-name:var(--font-body)] text-sm outline-none placeholder:text-text-disabled focus:border-accent-blue"
                style={{
                  letterSpacing: "0.01em",
                  transition: "border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
          ))}

          <div className="relative">
            <textarea
              placeholder="Your message"
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              required
              rows={3}
              className="w-full bg-transparent border-b border-border-subtle pb-3 text-text-primary font-[family-name:var(--font-body)] text-sm outline-none resize-none placeholder:text-text-disabled focus:border-accent-blue"
              style={{
                letterSpacing: "0.01em",
                transition: "border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>

          {/* Send Message — FULL WIDTH gradient button */}
          <button
            type="submit"
            className="mt-2 w-full py-4 rounded-xl font-[family-name:var(--font-body)] font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #0A84FF, #8B5CF6)",
              fontSize: "16px",
              letterSpacing: "0.02em",
              cursor: "pointer",
              border: "none",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "0 0 30px rgba(10, 132, 255, 0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.01)";
              e.currentTarget.style.boxShadow = "0 0 50px rgba(10, 132, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(10, 132, 255, 0.2)";
            }}
          >
            Send Message
          </button>
        </form>

        {/* Footer */}
        <p
          className="mt-10 text-text-disabled font-[family-name:var(--font-body)] text-xs text-center"
          style={{ letterSpacing: "0.02em" }}
        >
          &copy; 2026 TecHalaseh. Built with Next.js, Three.js &amp; creativity.
        </p>
      </div>
    </div>
  );
}

function ContactLink({
  label,
  href,
  icon,
  external,
}: {
  label: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex items-center gap-2 text-text-secondary font-[family-name:var(--font-body)] text-sm relative group"
      style={{ letterSpacing: "0.02em", fontWeight: 500 }}
    >
      <span className="opacity-60 group-hover:opacity-100" style={{ transition: "opacity 0.3s" }}>
        {icon}
      </span>
      {label}
      <span
        className="absolute left-0 -bottom-0.5 w-0 h-px bg-accent-blue group-hover:w-full"
        style={{ transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
      />
    </a>
  );
}

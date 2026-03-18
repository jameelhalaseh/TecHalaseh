"use client";

import { useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { getSceneProgress } from "@/lib/sceneConfig";
import { BRAND } from "@/lib/constants";

export default function ContactOverlay() {
  const progress = useScrollProgress();
  const sceneP = getSceneProgress(progress, "farewell");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const visible = sceneP > 0.5;
  const opacity = visible ? Math.min(1, (sceneP - 0.5) * 4) : 0;

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
      <div className="max-w-lg w-full px-8 pointer-events-auto">
        {/* Headline */}
        <h2
          className="font-[family-name:var(--font-display)] font-bold text-center"
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            background: "linear-gradient(135deg, #0A84FF, #8B5CF6, #00D4AA)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Let&apos;s build something extraordinary.
        </h2>

        <p
          className="mt-4 text-text-secondary font-[family-name:var(--font-body)] text-center"
          style={{ fontSize: "16px", letterSpacing: "0.01em" }}
        >
          Have a project in mind? Let&apos;s talk.
        </p>

        {/* Contact links */}
        <div className="flex items-center justify-center gap-6 mt-6">
          {[
            { label: "Email", href: `mailto:${BRAND.email}` },
            { label: "LinkedIn", href: BRAND.linkedin },
            { label: "GitHub", href: BRAND.github },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.label !== "Email" ? "_blank" : undefined}
              rel={link.label !== "Email" ? "noopener noreferrer" : undefined}
              className="text-text-secondary font-[family-name:var(--font-body)] text-sm relative group"
              style={{ letterSpacing: "0.02em", fontWeight: 500 }}
            >
              {link.label}
              <span
                className="absolute left-0 -bottom-0.5 w-0 h-px bg-accent-blue group-hover:w-full"
                style={{ transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
            </a>
          ))}
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

          <button
            type="submit"
            className="mt-2 self-center px-8 py-3 rounded-xl font-[family-name:var(--font-body)] font-medium text-white"
            style={{
              background: "linear-gradient(135deg, #0A84FF, #8B5CF6)",
              fontSize: "15px",
              letterSpacing: "0.02em",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(10, 132, 255, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
          >
            Send Message
          </button>
        </form>

        {/* Footer */}
        <p
          className="mt-12 text-text-disabled font-[family-name:var(--font-body)] text-xs text-center"
          style={{ letterSpacing: "0.02em" }}
        >
          &copy; 2026 TecHalaseh. Built with Next.js, Three.js &amp; creativity.
        </p>
      </div>
    </div>
  );
}

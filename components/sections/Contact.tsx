"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Inline SVG Icons                                                           */
/* -------------------------------------------------------------------------- */

function MailIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13L2 4" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Contact Links                                                              */
/* -------------------------------------------------------------------------- */

const LINKS = [
  {
    key: "email",
    label: "Email",
    href: "mailto:jameelhalaseh2003@gmail.com",
    icon: MailIcon,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://linkedin.com/in/jameel-halaseh",
    icon: LinkedInIcon,
  },
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/jameelhalaseh",
    icon: GitHubIcon,
  },
] as const;

/* -------------------------------------------------------------------------- */
/*  Toast Component                                                            */
/* -------------------------------------------------------------------------- */

function SuccessToast({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Message sent!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                             */
/* -------------------------------------------------------------------------- */

export default function Contact() {
  const t = useTranslations("contact");

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = useCallback(
    (field: keyof typeof formState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState((prev) => ({ ...prev, [field]: e.target.value }));
      },
    [],
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      setSent(true);
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 3000);
    },
    [],
  );

  return (
    <section id="contact" className="relative min-h-screen py-32">
      <div className="mx-auto max-w-2xl px-6">
        {/* ---- Headline ---- */}
        <h2 className="text-4xl font-bold text-text-primary md:text-6xl">
          {t("title")}
        </h2>

        <p className="mt-4 text-xl text-text-secondary">
          {t("subtitle")}
        </p>

        {/* ---- Social links ---- */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {LINKS.map(({ key, label, href, icon: Icon }) => (
            <a
              key={key}
              href={href}
              target={key !== "email" ? "_blank" : undefined}
              rel={key !== "email" ? "noopener noreferrer" : undefined}
              className="flex items-center gap-2 text-text-secondary transition-colors hover:text-accent-blue"
            >
              <Icon />
              <span>{label}</span>
            </a>
          ))}
        </div>

        {/* ---- Contact Form ---- */}
        <form
          onSubmit={handleSubmit}
          className="mt-16 flex flex-col gap-8"
        >
          {/* Name field */}
          <div className="relative">
            <input
              type="text"
              value={formState.name}
              onChange={handleChange("name")}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              placeholder={t("form.name")}
              required
              className="w-full border-b bg-transparent py-3 text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent-blue"
              style={{
                borderColor:
                  focusedField === "name"
                    ? undefined /* handled by focus: class */
                    : "rgba(255,255,255,0.2)",
              }}
            />
            {/* Focus glow */}
            <motion.div
              className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-accent-blue"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: focusedField === "name" ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Email field */}
          <div className="relative">
            <input
              type="email"
              value={formState.email}
              onChange={handleChange("email")}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder={t("form.email")}
              required
              className="w-full border-b bg-transparent py-3 text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent-blue"
              style={{
                borderColor:
                  focusedField === "email"
                    ? undefined
                    : "rgba(255,255,255,0.2)",
              }}
            />
            <motion.div
              className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-accent-blue"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: focusedField === "email" ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Message field */}
          <div className="relative">
            <textarea
              value={formState.message}
              onChange={handleChange("message")}
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
              placeholder={t("form.message")}
              required
              rows={4}
              className="w-full resize-none border-b bg-transparent py-3 text-text-primary outline-none transition-colors placeholder:text-text-muted focus:border-accent-blue"
              style={{
                borderColor:
                  focusedField === "message"
                    ? undefined
                    : "rgba(255,255,255,0.2)",
              }}
            />
            <motion.div
              className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-accent-blue"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: focusedField === "message" ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          {/* Submit button */}
          <div className="flex flex-col items-center">
            <motion.button
              type="submit"
              className="rounded-full bg-gradient-to-r from-accent-blue to-accent-purple px-8 py-3 font-semibold text-white shadow-lg transition-shadow hover:shadow-accent-blue/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              {t("form.send")}
            </motion.button>

            <SuccessToast visible={sent} />
          </div>
        </form>

        {/* ---- Footer ---- */}
        <footer className="mt-24 border-t border-white/5 pt-8 text-center">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} TecHalaseh. {t("footer")}
          </p>
        </footer>
      </div>
    </section>
  );
}

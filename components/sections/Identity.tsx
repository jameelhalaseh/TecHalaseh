"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import CountUp from "@/components/animations/CountUp";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const ROLE_KEYS = ["fullstack", "security", "ai"] as const;
const ROLE_INTERVAL_MS = 3_000;

const TECH_BADGES = ["React", "Node.js", "TypeScript", "Azure", "Python"];

/* -------------------------------------------------------------------------- */
/*  Geometric Avatar                                                           */
/* -------------------------------------------------------------------------- */

function GeometricAvatar() {
  return (
    <div className="group relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-background">
      {/* Abstract face silhouette */}
      <svg
        viewBox="0 0 200 200"
        className="h-3/4 w-3/4 transition-transform duration-500 group-hover:scale-105"
        aria-hidden="true"
      >
        {/* Head circle */}
        <circle cx="100" cy="70" r="38" fill="#1A1A2E" stroke="#2A2A3E" strokeWidth="1.5" />

        {/* Geometric facial lines */}
        <line x1="85" y1="60" x2="95" y2="60" stroke="#0A84FF" strokeWidth="2" strokeLinecap="round" />
        <line x1="105" y1="60" x2="115" y2="60" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
        <path d="M90 80 L100 85 L110 80" fill="none" stroke="#00D4AA" strokeWidth="1.5" strokeLinecap="round" />

        {/* Neck / shoulders geometric */}
        <path
          d="M72 105 L100 95 L128 105 L140 140 L60 140 Z"
          fill="#1A1A2E"
          stroke="#2A2A3E"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Geometric accents */}
        <polygon points="100,20 105,30 95,30" fill="#0A84FF" opacity="0.6" />
        <rect x="65" y="112" width="8" height="8" rx="1" fill="#8B5CF6" opacity="0.3" transform="rotate(15 69 116)" />
        <rect x="127" y="112" width="8" height="8" rx="1" fill="#00D4AA" opacity="0.3" transform="rotate(-15 131 116)" />

        {/* Scan lines (subtle) */}
        {[50, 70, 90, 110, 130].map((y) => (
          <line
            key={y}
            x1="55"
            y1={y}
            x2="145"
            y2={y}
            stroke="#F5F5F7"
            strokeWidth="0.3"
            opacity="0.08"
          />
        ))}
      </svg>

      {/* Glitch layers - visible on hover via CSS */}
      <div className="glitch-layer glitch-layer--r" aria-hidden="true" />
      <div className="glitch-layer glitch-layer--b" aria-hidden="true" />

      {/* Inline keyframes & glitch styles */}
      <style jsx>{`
        .glitch-layer {
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          pointer-events: none;
          opacity: 0;
          mix-blend-mode: screen;
          transition: opacity 0.2s;
        }
        .group:hover .glitch-layer {
          animation: glitch 0.3s steps(2) infinite alternate;
          opacity: 1;
        }
        .glitch-layer--r {
          background: rgba(10, 132, 255, 0.12);
          clip-path: inset(20% 0 30% 0);
        }
        .glitch-layer--b {
          background: rgba(139, 92, 246, 0.12);
          clip-path: inset(50% 0 10% 0);
        }
        @keyframes glitch {
          0% {
            clip-path: inset(20% 0 30% 0);
            transform: translate(-2px, 0);
          }
          25% {
            clip-path: inset(60% 0 5% 0);
            transform: translate(2px, 0);
          }
          50% {
            clip-path: inset(10% 0 50% 0);
            transform: translate(-1px, 1px);
          }
          75% {
            clip-path: inset(40% 0 20% 0);
            transform: translate(1px, -1px);
          }
          100% {
            clip-path: inset(30% 0 40% 0);
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Animated Gradient Border Wrapper                                           */
/* -------------------------------------------------------------------------- */

function GradientBorderAvatar() {
  return (
    <div className="relative mx-auto h-64 w-64 md:h-80 md:w-80">
      {/* Spinning conic-gradient ring */}
      <div className="gradient-ring absolute inset-0 rounded-full" aria-hidden="true" />

      {/* Inner circle (clips the gradient to show only the border) */}
      <div className="absolute inset-[3px] overflow-hidden rounded-full">
        <GeometricAvatar />
      </div>

      <style jsx>{`
        .gradient-ring {
          background: conic-gradient(
            from 0deg,
            #0A84FF,
            #8B5CF6,
            #00D4AA,
            #0A84FF
          );
          animation: spin-ring 4s linear infinite;
        }
        @keyframes spin-ring {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Role Rotator                                                               */
/* -------------------------------------------------------------------------- */

function RoleRotator({ roles }: { roles: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, ROLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [roles.length]);

  return (
    <div className="relative h-9 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.span
          key={roles[index]}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -24, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 block text-lg font-semibold text-accent-blue md:text-xl"
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Identity Section                                                           */
/* -------------------------------------------------------------------------- */

export default function Identity() {
  const t = useTranslations("identity");

  const roles = ROLE_KEYS.map((key) => t(`roles.${key}`));

  return (
    <section
      id="about"
      className="relative min-h-screen px-6 py-32 md:px-12 lg:px-20"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-2">
        {/* ---- Left column: Avatar ---- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex items-center justify-center"
        >
          <GradientBorderAvatar />
        </motion.div>

        {/* ---- Right column: Details ---- */}
        <div className="flex flex-col gap-10">
          {/* Counter */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="block text-6xl font-bold tracking-tight text-text-primary md:text-7xl">
              <CountUp end={5} suffix="+" className="tabular-nums" />
            </span>
            <span className="mt-2 block text-lg text-text-secondary">
              {t("years")}
            </span>
          </motion.div>

          {/* Role rotator */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <RoleRotator roles={roles} />
          </motion.div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center gap-2 text-text-secondary"
          >
            {/* Pulsing red dot */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="text-base">{t("location")}</span>
          </motion.div>

          {/* Tech badges */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="flex flex-wrap gap-2"
          >
            {TECH_BADGES.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.08 }}
                className={cn(
                  "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-text-secondary",
                  "transition-colors duration-200 hover:border-accent-blue/30 hover:text-text-primary",
                )}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

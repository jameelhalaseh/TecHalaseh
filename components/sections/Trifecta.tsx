"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------------- */
/*  Card data                                                                  */
/* -------------------------------------------------------------------------- */

interface PillarCard {
  key: "fullstack" | "security" | "ai";
  accent: string;
  /** Tailwind border-l colour class */
  borderClass: string;
  /** Hover glow shadow (uses raw CSS) */
  glowColor: string;
}

const PILLARS: PillarCard[] = [
  {
    key: "fullstack",
    accent: "#0A84FF",
    borderClass: "border-l-accent-blue",
    glowColor: "rgba(10, 132, 255, 0.25)",
  },
  {
    key: "security",
    accent: "#00D4AA",
    borderClass: "border-l-accent-cyan",
    glowColor: "rgba(0, 212, 170, 0.25)",
  },
  {
    key: "ai",
    accent: "#8B5CF6",
    borderClass: "border-l-accent-purple",
    glowColor: "rgba(139, 92, 246, 0.25)",
  },
];

/* -------------------------------------------------------------------------- */
/*  SVG Icons                                                                  */
/* -------------------------------------------------------------------------- */

/** Layered stack icon for Full Stack */
function StackIcon({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-14 w-14 transition-transform duration-500 group-hover:scale-110"
      aria-hidden="true"
    >
      {/* Three stacked rectangles that spread on hover via CSS */}
      <g className="stack-layers">
        <rect
          className="stack-layer stack-layer--top"
          x="12"
          y="8"
          width="40"
          height="12"
          rx="3"
          fill={accent}
          opacity="0.85"
        />
        <rect
          className="stack-layer stack-layer--mid"
          x="12"
          y="26"
          width="40"
          height="12"
          rx="3"
          fill={accent}
          opacity="0.55"
        />
        <rect
          className="stack-layer stack-layer--bot"
          x="12"
          y="44"
          width="40"
          height="12"
          rx="3"
          fill={accent}
          opacity="0.3"
        />
      </g>

      <style>{`
        .group:hover .stack-layer--top { transform: translateY(-3px); transition: transform 0.4s ease; }
        .group:hover .stack-layer--mid { transition: transform 0.4s ease 0.05s; }
        .group:hover .stack-layer--bot { transform: translateY(3px); transition: transform 0.4s ease 0.1s; }
        .stack-layer { transition: transform 0.4s ease; }
      `}</style>
    </svg>
  );
}

/** Shield icon with animated scan line for Cybersecurity */
function ShieldIcon({ accent }: { accent: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className="h-14 w-14 transition-transform duration-500 group-hover:scale-110"
      aria-hidden="true"
    >
      {/* Shield path */}
      <path
        d="M32 6 L54 16 V34 C54 48 32 58 32 58 C32 58 10 48 10 34 V16 Z"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinejoin="round"
        opacity="0.85"
      />
      {/* Check mark */}
      <path
        d="M22 32 L29 39 L42 24"
        fill="none"
        stroke={accent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      {/* Scan line */}
      <line
        className="shield-scan"
        x1="14"
        y1="20"
        x2="50"
        y2="20"
        stroke={accent}
        strokeWidth="1.5"
        opacity="0.35"
      />

      <style>{`
        .shield-scan {
          animation: scan 2.5s ease-in-out infinite;
        }
        .group:hover .shield-scan {
          animation: scan 1.2s ease-in-out infinite;
          opacity: 0.6;
        }
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0.15; }
          50% { transform: translateY(24px); opacity: 0.5; }
        }
      `}</style>
    </svg>
  );
}

/** Neural network icon with pulsing connections for AI & ML */
function NeuralIcon({ accent }: { accent: string }) {
  // Node positions for a small network
  const nodes = [
    { cx: 12, cy: 20 },
    { cx: 12, cy: 44 },
    { cx: 32, cy: 12 },
    { cx: 32, cy: 32 },
    { cx: 32, cy: 52 },
    { cx: 52, cy: 20 },
    { cx: 52, cy: 44 },
  ];

  const edges: [number, number][] = [
    [0, 2], [0, 3], [0, 4],
    [1, 2], [1, 3], [1, 4],
    [2, 5], [2, 6],
    [3, 5], [3, 6],
    [4, 5], [4, 6],
  ];

  return (
    <svg
      viewBox="0 0 64 64"
      className="h-14 w-14 transition-transform duration-500 group-hover:scale-110"
      aria-hidden="true"
    >
      {/* Connections */}
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].cx}
          y1={nodes[a].cy}
          x2={nodes[b].cx}
          y2={nodes[b].cy}
          stroke={accent}
          strokeWidth="1"
          opacity="0.25"
          className="neural-edge"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}

      {/* Nodes */}
      {nodes.map((n, i) => (
        <circle
          key={i}
          cx={n.cx}
          cy={n.cy}
          r="4"
          fill={accent}
          opacity="0.7"
          className="neural-node"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}

      <style>{`
        .neural-node {
          transition: opacity 0.3s;
        }
        .neural-edge {
          transition: opacity 0.3s;
        }
        .group:hover .neural-node {
          animation: pulse-node 1.4s ease-in-out infinite alternate;
        }
        .group:hover .neural-edge {
          animation: pulse-edge 1.4s ease-in-out infinite alternate;
        }
        @keyframes pulse-node {
          0% { opacity: 0.5; r: 4; }
          100% { opacity: 1; r: 5; }
        }
        @keyframes pulse-edge {
          0% { opacity: 0.15; }
          100% { opacity: 0.55; }
        }
      `}</style>
    </svg>
  );
}

const ICON_MAP: Record<PillarCard["key"], (props: { accent: string }) => React.JSX.Element> = {
  fullstack: StackIcon,
  security: ShieldIcon,
  ai: NeuralIcon,
};

/* -------------------------------------------------------------------------- */
/*  Card animation variants                                                    */
/* -------------------------------------------------------------------------- */

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* -------------------------------------------------------------------------- */
/*  Trifecta Section                                                           */
/* -------------------------------------------------------------------------- */

export default function Trifecta() {
  const t = useTranslations("trifecta");

  return (
    <section
      id="trifecta"
      className="relative px-6 py-32 md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section title */}
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center text-3xl font-bold tracking-tight text-text-primary md:text-4xl"
        >
          {t("title")}
        </motion.h2>

        {/* Cards grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {PILLARS.map((pillar) => {
            const Icon = ICON_MAP[pillar.key];

            return (
              <motion.div
                key={pillar.key}
                variants={cardVariants}
                whileHover={{
                  scale: 1.02,
                  y: -4,
                  transition: { duration: 0.25, ease: "easeOut" },
                }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl",
                  "border-l-2",
                  pillar.borderClass,
                  "transition-shadow duration-300",
                )}
                style={
                  {
                    "--glow": pillar.glowColor,
                  } as React.CSSProperties
                }
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    `0 8px 32px ${pillar.glowColor}, 0 0 0 1px ${pillar.glowColor}`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                {/* Icon */}
                <div className="mb-6">
                  <Icon accent={pillar.accent} />
                </div>

                {/* Title */}
                <h3 className="mb-3 text-xl font-bold text-text-primary">
                  {t(`${pillar.key}.title`)}
                </h3>

                {/* Skills */}
                <p className="text-sm leading-relaxed text-text-secondary">
                  {t(`${pillar.key}.skills`)}
                </p>

                {/* Subtle hover gradient overlay */}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${pillar.glowColor}, transparent 70%)`,
                  }}
                  aria-hidden="true"
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

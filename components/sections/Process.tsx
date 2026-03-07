"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------------- */
/*  SVG Icons                                                                  */
/* -------------------------------------------------------------------------- */

function DiscoverIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Magnifying glass */}
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function DesignIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Pen */}
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  );
}

function BuildIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Code brackets */}
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function SecureIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Shield */}
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function DeployIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Rocket */}
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step data                                                                  */
/* -------------------------------------------------------------------------- */

interface StepData {
  key: string;
  icon: () => React.JSX.Element;
  accentColor: string;
}

const STEPS: StepData[] = [
  { key: "discover", icon: DiscoverIcon, accentColor: "#0A84FF" },
  { key: "design", icon: DesignIcon, accentColor: "#8B5CF6" },
  { key: "build", icon: BuildIcon, accentColor: "#00D4AA" },
  { key: "secure", icon: SecureIcon, accentColor: "#F59E0B" },
  { key: "deploy", icon: DeployIcon, accentColor: "#0A84FF" },
];

/* -------------------------------------------------------------------------- */
/*  Animation helpers                                                          */
/* -------------------------------------------------------------------------- */

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: { duration: 0.6, ease },
  },
};

const nodeVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease },
  },
};

const contentVariants = {
  hidden: { opacity: 0, x: 0, y: 20 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

/* -------------------------------------------------------------------------- */
/*  Timeline Node                                                              */
/* -------------------------------------------------------------------------- */

function TimelineNode({
  step,
  index,
  isLast,
}: {
  step: StepData;
  index: number;
  isLast: boolean;
}) {
  const t = useTranslations("process");
  const Icon = step.icon;
  const isEven = index % 2 === 0;

  return (
    <div className="relative">
      {/* Row layout */}
      <div
        className={cn(
          "flex items-start gap-6 md:gap-10",
          /* Mobile: icon left, content right */
          "flex-row",
          /* Desktop: alternate sides */
          isEven ? "md:flex-row" : "md:flex-row-reverse",
        )}
      >
        {/* Content block (desktop: alternating side) */}
        <motion.div
          variants={contentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className={cn(
            "flex-1 pb-16",
            /* Desktop alignment */
            isEven ? "md:text-right" : "md:text-left",
            /* Mobile: always left-aligned */
            "text-left",
            /* On mobile, hidden on the "empty" side — we use order */
            "order-2 md:order-none",
          )}
        >
          <h3 className="text-lg font-bold text-text-primary mb-1">
            {t(`steps.${step.key}.title`)}
          </h3>
          <p className="text-sm leading-relaxed text-text-secondary max-w-sm inline-block">
            {t(`steps.${step.key}.desc`)}
          </p>
        </motion.div>

        {/* Center: node + connecting line */}
        <div className="relative flex flex-col items-center order-1 md:order-none">
          {/* Node circle */}
          <motion.div
            variants={nodeVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-surface"
            style={{ borderColor: step.accentColor, color: step.accentColor }}
          >
            <Icon />
          </motion.div>

          {/* Connecting line segment */}
          {!isLast && (
            <motion.div
              variants={lineVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              className="w-0.5 flex-1 min-h-[80px] origin-top"
              style={{
                background: `linear-gradient(to bottom, ${step.accentColor}, ${STEPS[index + 1]?.accentColor ?? step.accentColor})`,
              }}
            />
          )}
        </div>

        {/* Spacer for the opposite side (desktop only) */}
        <div className="hidden md:block flex-1" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Process Section                                                            */
/* -------------------------------------------------------------------------- */

export default function Process() {
  const t = useTranslations("process");

  return (
    <section id="process" className="relative px-6 py-32 md:px-12 lg:px-20">
      <div className="mx-auto max-w-3xl">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-text-primary">
            {t("title")}
          </h2>
          <div className="mt-3 mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-accent-blue via-accent-purple to-accent-cyan" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {STEPS.map((step, i) => (
            <TimelineNode
              key={step.key}
              step={step}
              index={i}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

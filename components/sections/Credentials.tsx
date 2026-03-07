"use client";

import { useRef, useCallback, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";
import { CREDENTIALS } from "@/lib/constants";

/* -------------------------------------------------------------------------- */
/*  Animation variants                                                         */
/* -------------------------------------------------------------------------- */

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease },
  },
};

/* -------------------------------------------------------------------------- */
/*  TiltCard wrapper                                                           */
/* -------------------------------------------------------------------------- */

function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouse = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      x.set((e.clientX - rect.left) / rect.width - 0.5);
      y.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [x, y],
  );

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: string }) {
  if (status === "completed" || status === "certified") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20">
          <svg
            className="h-3 w-3 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <span className="text-sm font-medium capitalize text-emerald-400">{status}</span>
      </div>
    );
  }

  // In Progress
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-400" />
      </span>
      <span className="text-sm font-medium text-amber-400">In Progress</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Credentials Section                                                        */
/* -------------------------------------------------------------------------- */

export default function Credentials() {
  const t = useTranslations("credentials");

  return (
    <section id="credentials" className="relative px-6 py-32 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-bold text-text-primary">
            {t("title")}
          </h2>
          <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple" />
        </motion.div>

        {/* Cards container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className={cn(
            "flex gap-6",
            /* Desktop: horizontal scroll row */
            "flex-col md:flex-row md:overflow-x-auto md:pb-4",
            /* Hide scrollbar but allow scroll */
            "md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden",
          )}
        >
          {CREDENTIALS.map((cred) => {
            const name = t(`${cred.id}.name`);
            const issuer = t(`${cred.id}.issuer`);
            const status = t(`${cred.id}.status`);

            return (
              <motion.div key={cred.id} variants={cardVariants}>
                <TiltCard className="h-full">
                  <div
                    className={cn(
                      "relative overflow-hidden rounded-2xl p-8",
                      "bg-white/5 backdrop-blur-xl border border-white/10",
                      "min-w-[280px] md:w-[320px] flex-shrink-0",
                      "transition-colors duration-300 hover:border-white/20",
                      "group",
                    )}
                  >
                    {/* Colored circle with abbreviation */}
                    <div
                      className="mb-6 flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: cred.color }}
                    >
                      {cred.abbr}
                    </div>

                    {/* Name */}
                    <h3 className="mb-1 text-xl font-bold text-text-primary">
                      {name}
                    </h3>

                    {/* Issuer */}
                    <p className="mb-4 text-sm text-text-secondary">{issuer}</p>

                    {/* Status */}
                    <StatusBadge status={status.toLowerCase()} />

                    {/* Subtle gradient overlay on hover */}
                    <div
                      className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at 30% 20%, ${cred.color}15, transparent 60%)`,
                      }}
                      aria-hidden="true"
                    />
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

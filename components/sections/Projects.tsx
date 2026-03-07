"use client";

import { useRef, useState, useCallback, type MouseEvent, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/cn";
import { PROJECTS } from "@/lib/constants";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

type MockupType = (typeof PROJECTS)[number]["mockupType"];

/* -------------------------------------------------------------------------- */
/*  Animation helpers                                                          */
/* -------------------------------------------------------------------------- */

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const sectionVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease },
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const fadeUpChild = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

/* -------------------------------------------------------------------------- */
/*  Phone Mockup  (GAIBE)                                                      */
/* -------------------------------------------------------------------------- */

function PhoneMockup({ accent }: { accent: string }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className="relative w-64 rounded-[40px] border-4 bg-surface overflow-hidden"
        style={{
          height: 500,
          borderColor: "rgba(255,255,255,0.1)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-background rounded-b-2xl z-10" />

        {/* Status bar */}
        <div className="flex items-center justify-between px-6 pt-8 pb-2 text-[10px] text-text-secondary">
          <span>9:41</span>
          <div className="flex gap-1">
            <div className="w-3.5 h-2 rounded-sm bg-text-muted" />
            <div className="w-1.5 h-2 rounded-sm bg-text-muted" />
          </div>
        </div>

        {/* App header */}
        <div className="px-4 py-2">
          <div
            className="text-sm font-bold"
            style={{ color: accent }}
          >
            GAIBE
          </div>
          <div className="text-[10px] text-text-secondary mt-0.5">
            AI Bible Companion
          </div>
        </div>

        {/* Chat bubbles */}
        <div className="flex flex-col gap-2.5 px-4 mt-2 overflow-hidden">
          {/* User message */}
          <div className="self-end max-w-[75%]">
            <div
              className="rounded-2xl rounded-br-md px-3 py-2 text-[11px] text-white"
              style={{ backgroundColor: accent }}
            >
              ما معنى المحبة في رسالة كورنثوس؟
            </div>
          </div>

          {/* AI response */}
          <div className="self-start max-w-[80%]">
            <div className="rounded-2xl rounded-bl-md px-3 py-2 text-[11px] bg-surface-light text-text-primary">
              المحبة تتأنّى وترفق، المحبة لا تحسد...
            </div>
          </div>

          {/* User follow-up */}
          <div className="self-end max-w-[70%]">
            <div
              className="rounded-2xl rounded-br-md px-3 py-2 text-[11px] text-white"
              style={{ backgroundColor: accent }}
            >
              كيف أطبّق هذا عمليًا؟
            </div>
          </div>

          {/* AI response with typing indicator */}
          <div className="self-start max-w-[80%]">
            <div className="rounded-2xl rounded-bl-md px-3 py-2.5 text-[11px] bg-surface-light text-text-primary">
              <div className="flex gap-1">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-text-secondary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-text-secondary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                />
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-text-secondary"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Input bar */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-full bg-surface-light px-4 py-2.5">
            <div className="flex-1 text-[11px] text-text-muted">
              Ask anything...
            </div>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: accent }}
            >
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                />
              </svg>
            </div>
          </div>
          {/* Home indicator */}
          <div className="mt-2 mx-auto w-28 h-1 rounded-full bg-text-muted/40" />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Desktop Mockup  (RM Network)                                               */
/* -------------------------------------------------------------------------- */

function DesktopMockup({ accent }: { accent: string }) {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Screen */}
        <div className="aspect-video rounded-lg border border-white/10 bg-surface overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 bg-background/60">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 text-center text-[10px] text-text-muted font-mono">
              dashboard.rmnetwork.io
            </div>
          </div>

          {/* Dashboard content */}
          <div className="p-3 grid grid-cols-3 gap-2 h-full">
            {/* Sidebar */}
            <div className="col-span-1 space-y-2">
              <div
                className="h-3 w-16 rounded-sm opacity-80"
                style={{ backgroundColor: accent }}
              />
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 rounded-sm bg-surface-light"
                  style={{ width: `${60 + Math.random() * 40}%` }}
                />
              ))}
            </div>

            {/* Main area */}
            <div className="col-span-2 space-y-2">
              {/* Stat cards row */}
              <div className="grid grid-cols-3 gap-1.5">
                {[accent, "#00D4AA", "#F59E0B"].map((color, i) => (
                  <div
                    key={i}
                    className="rounded-md bg-surface-light p-2"
                  >
                    <div
                      className="h-1.5 w-6 rounded-sm mb-1"
                      style={{ backgroundColor: color, opacity: 0.7 }}
                    />
                    <div className="h-3 w-10 rounded-sm bg-text-muted/30" />
                  </div>
                ))}
              </div>

              {/* Chart placeholder */}
              <div className="rounded-md bg-surface-light p-2 flex-1">
                <div className="flex items-end gap-1 h-14">
                  {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 68].map(
                    (h, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 rounded-t-sm"
                        style={{ backgroundColor: accent, opacity: 0.6 }}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{
                          duration: 0.6,
                          delay: i * 0.05,
                          ease: "easeOut",
                        }}
                        viewport={{ once: true }}
                      />
                    ),
                  )}
                </div>
              </div>

              {/* Table rows */}
              <div className="space-y-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 rounded-md bg-surface-light/50 p-1.5"
                  >
                    <div className="w-3 h-3 rounded bg-text-muted/30" />
                    <div className="h-1.5 flex-1 rounded-sm bg-text-muted/20" />
                    <div
                      className="h-1.5 w-8 rounded-sm opacity-50"
                      style={{ backgroundColor: accent }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stand */}
        <div className="mx-auto w-20 h-3 bg-gradient-to-b from-surface-light to-surface rounded-b-lg" />
        <div className="mx-auto w-32 h-1.5 bg-surface-light rounded-b-lg" />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Browser Mockup  (RAG Collector)                                            */
/* -------------------------------------------------------------------------- */

function BrowserMockup({ accent }: { accent: string }) {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="rounded-lg border border-white/10 bg-surface overflow-hidden">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5 bg-background/60">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <div className="flex-1 flex items-center gap-2 rounded-md bg-surface px-3 py-1 text-[10px] text-text-muted font-mono">
              <svg
                className="w-3 h-3 text-text-muted/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              chrome-extension://ragcollector
            </div>
            {/* Extension icon */}
            <div
              className="w-5 h-5 rounded flex items-center justify-center"
              style={{ backgroundColor: accent, opacity: 0.8 }}
            >
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
          </div>

          {/* Extension popup content */}
          <div className="p-4 min-h-[280px]">
            {/* Extension header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: accent }}
                >
                  R
                </div>
                <span className="text-xs font-semibold text-text-primary">
                  RAG Collector
                </span>
              </div>
              <div
                className="px-2 py-0.5 rounded-full text-[9px] font-medium text-white"
                style={{ backgroundColor: accent, opacity: 0.8 }}
              >
                Active
              </div>
            </div>

            {/* Collection stats */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {[
                { label: "Pages Collected", value: "247" },
                { label: "Knowledge Chunks", value: "1,832" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg bg-surface-light p-2.5"
                >
                  <div className="text-lg font-bold text-text-primary">
                    {stat.value}
                  </div>
                  <div className="text-[9px] text-text-secondary">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent captures */}
            <div className="text-[10px] text-text-secondary mb-2 font-medium">
              Recent Captures
            </div>
            <div className="space-y-1.5">
              {[
                { title: "React Server Components", domain: "nextjs.org" },
                { title: "Vector Database Guide", domain: "pinecone.io" },
                { title: "RAG Architecture", domain: "arxiv.org" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-2 rounded-md bg-surface-light/60 px-2.5 py-1.5"
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: accent }}
                  />
                  <div className="flex-1 text-[10px] text-text-primary truncate">
                    {item.title}
                  </div>
                  <div className="text-[9px] text-text-muted">
                    {item.domain}
                  </div>
                </div>
              ))}
            </div>

            {/* Capture button */}
            <motion.div
              className="mt-3 rounded-lg py-2 text-center text-[11px] font-semibold text-white cursor-default"
              style={{ backgroundColor: accent }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              Capture This Page
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Mockup Dispatcher                                                          */
/* -------------------------------------------------------------------------- */

function ProjectMockup({
  type,
  accent,
}: {
  type: MockupType;
  accent: string;
}) {
  switch (type) {
    case "phone":
      return <PhoneMockup accent={accent} />;
    case "desktop":
      return <DesktopMockup accent={accent} />;
    case "browser":
      return <BrowserMockup accent={accent} />;
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  TiltCard (freelance section)                                               */
/* -------------------------------------------------------------------------- */

function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), {
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
/*  Freelance Cards Section                                                    */
/* -------------------------------------------------------------------------- */

function FreelanceCards({ accent }: { accent: string }) {
  const t = useTranslations("projects");
  const cards = [
    {
      name: "Project A",
      gradient: "from-amber-400/20 via-pink-500/20 to-purple-500/20",
    },
    {
      name: "Project B",
      gradient: "from-blue-500/20 via-cyan-400/20 to-emerald-500/20",
    },
    {
      name: "Project C",
      gradient: "from-purple-500/20 via-pink-500/20 to-rose-500/20",
    },
  ];

  return (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      className="py-20"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <div className="mb-10">
          <h3
            className="text-4xl font-bold mb-2"
            style={{ color: accent }}
          >
            {t("freelance.title")}
          </h3>
          <p className="text-xl text-text-secondary">
            {t("freelance.subtitle")}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <TiltCard key={card.name}>
              <motion.div
                variants={fadeUpChild}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={cn(
                  "group relative overflow-hidden rounded-xl p-6 h-52",
                  "bg-white/5 backdrop-blur border border-white/10",
                  "transition-colors hover:border-white/20",
                )}
              >
                {/* Gradient background */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-40 transition-opacity group-hover:opacity-60",
                    card.gradient,
                  )}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="text-lg font-semibold text-text-primary mb-1">
                      {card.name}
                    </div>
                    <div className="text-sm text-text-secondary">
                      Coming soon
                    </div>
                  </div>

                  {/* Decorative element */}
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, j) => (
                      <div
                        key={j}
                        className="h-1 flex-1 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Navigation Dots                                                            */
/* -------------------------------------------------------------------------- */

function ProjectDots({
  total,
  activeIndex,
}: {
  total: number;
  activeIndex: number;
}) {
  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col items-center gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full"
          animate={{
            scale: activeIndex === i ? 1.4 : 1,
            backgroundColor:
              activeIndex === i
                ? PROJECTS[i]?.accent ?? "#F5F5F7"
                : "rgba(134,134,139,0.4)",
          }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Projects Section                                                      */
/* -------------------------------------------------------------------------- */

export default function Projects() {
  const t = useTranslations("projects");
  const [activeProject, setActiveProject] = useState(0);

  /** Featured projects (not freelance) */
  const featured = PROJECTS.filter((p) => p.mockupType !== "cards");
  /** Freelance project */
  const freelance = PROJECTS.find((p) => p.id === "freelance");

  return (
    <section id="work" className="relative py-32">
      {/* Navigation dots */}
      <ProjectDots total={PROJECTS.length} activeIndex={activeProject} />

      {/* Section title */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="max-w-6xl mx-auto px-6 mb-16"
      >
        <h2 className="text-5xl md:text-6xl font-bold text-text-primary">
          {t("title")}
        </h2>
        <div className="mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-accent-blue to-accent-purple" />
      </motion.div>

      {/* Featured projects */}
      {featured.map((project, index) => {
        const isEven = index % 2 === 1;

        return (
          <motion.div
            key={project.id}
            onViewportEnter={() => setActiveProject(index)}
            viewport={{ amount: 0.4 }}
            className="py-20"
          >
            <div className="max-w-6xl mx-auto px-6">
              <div
                className={cn(
                  "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center",
                  isEven && "lg:[direction:rtl]",
                )}
              >
                {/* Text side */}
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  className={cn(isEven && "lg:[direction:ltr]")}
                >
                  <motion.h3
                    variants={fadeUpChild}
                    className="text-4xl font-bold mb-2"
                    style={{ color: project.accent }}
                  >
                    {t(`${project.id}.title`)}
                  </motion.h3>

                  <motion.p
                    variants={fadeUpChild}
                    className="text-xl text-text-secondary mb-4"
                  >
                    {t(`${project.id}.subtitle`)}
                  </motion.p>

                  <motion.p
                    variants={fadeUpChild}
                    className="text-text-secondary leading-relaxed mb-6"
                  >
                    {t(`${project.id}.description`)}
                  </motion.p>

                  {/* Tech tags */}
                  <motion.div
                    variants={fadeUpChild}
                    className="flex flex-wrap gap-2 mb-6"
                  >
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-full border text-sm text-text-secondary transition-colors hover:text-text-primary"
                        style={{ borderColor: `${project.accent}40` }}
                      >
                        {tech}
                      </span>
                    ))}
                  </motion.div>

                  {/* Key stat */}
                  <motion.div
                    variants={fadeUpChild}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-1 h-10 rounded-full"
                      style={{
                        background: `linear-gradient(to bottom, ${project.accent}, transparent)`,
                      }}
                    />
                    <p className="text-sm text-text-secondary italic">
                      {t(`${project.id}.stat`)}
                    </p>
                  </motion.div>
                </motion.div>

                {/* Visual / mockup side */}
                <motion.div
                  variants={isEven ? slideFromLeft : slideFromRight}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  className={cn(isEven && "lg:[direction:ltr]")}
                >
                  <ProjectMockup
                    type={project.mockupType}
                    accent={project.accent}
                  />
                </motion.div>
              </div>
            </div>

            {/* Divider between projects */}
            {index < featured.length - 1 && (
              <div className="max-w-6xl mx-auto px-6 mt-20">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            )}
          </motion.div>
        );
      })}

      {/* Freelance section */}
      {freelance && (
        <motion.div
          onViewportEnter={() => setActiveProject(PROJECTS.length - 1)}
          viewport={{ amount: 0.4 }}
        >
          {/* Divider */}
          <div className="max-w-6xl mx-auto px-6">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <FreelanceCards accent={freelance.accent} />
        </motion.div>
      )}
    </section>
  );
}

"use client";

import { type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface AnimatedTextProps {
  /** The text string to animate letter by letter. */
  text: string;
  /** HTML tag to render as the wrapper element. */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  /** Additional class names applied to the wrapper element. */
  className?: string;
  /** Delay in seconds before the animation starts. */
  delay?: number;
  /** Duration per letter in seconds. */
  letterDuration?: number;
  /** Stagger interval between each letter in seconds. */
  stagger?: number;
  /** Whether to split on words instead of letters (preserves word boundaries). */
  splitBy?: "letter" | "word";
  /** If true, animation replays every time the component mounts. Defaults to true. */
  once?: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Variants                                                                   */
/* -------------------------------------------------------------------------- */

const containerVariants: Variants = {
  hidden: {},
  visible: (custom: { stagger: number; delay: number }) => ({
    transition: {
      staggerChildren: custom.stagger,
      delayChildren: custom.delay,
    },
  }),
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: "blur(4px)",
  },
  visible: (custom: { letterDuration: number }) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: custom.letterDuration,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function AnimatedText({
  text,
  as: Tag = "p",
  className,
  delay = 0,
  letterDuration = 0.35,
  stagger = 0.03,
  splitBy = "letter",
  once = true,
}: AnimatedTextProps) {
  // Use Framer Motion's motion component factory for the chosen tag.
  const MotionTag = motion.create(Tag);

  const tokens: string[] =
    splitBy === "word" ? text.split(/(\s+)/) : text.split("");

  return (
    <MotionTag
      className={cn("inline-block", className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      custom={{ stagger, delay }}
      aria-label={text}
    >
      {tokens.map((token, index) => {
        // Whitespace tokens get rendered as a normal space to avoid collapsing.
        if (/^\s+$/.test(token)) {
          return (
            <span key={`space-${index}`} className="inline-block">
              &nbsp;
            </span>
          );
        }

        if (splitBy === "word") {
          return (
            <motion.span
              key={`word-${index}`}
              variants={itemVariants}
              custom={{ letterDuration }}
              className="inline-block"
              aria-hidden
            >
              {token}
            </motion.span>
          );
        }

        return (
          <motion.span
            key={`char-${index}`}
            variants={itemVariants}
            custom={{ letterDuration }}
            className="inline-block"
            aria-hidden
          >
            {token}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}

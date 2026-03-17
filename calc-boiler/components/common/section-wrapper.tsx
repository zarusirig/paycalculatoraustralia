"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionVariant = "white" | "muted" | "warm" | "primary-soft" | "dark";

interface SectionWrapperProps {
  children: ReactNode;
  variant?: SectionVariant;
  className?: string;
  id?: string;
  ariaLabelledBy?: string;
  animate?: boolean;
}

const variantClasses: Record<SectionVariant, string> = {
  white: "section-white",
  muted: "section-muted",
  warm: "section-warm",
  "primary-soft": "section-primary-soft",
  dark: "section-dark",
};

export default function SectionWrapper({
  children,
  variant = "white",
  className = "",
  id,
  ariaLabelledBy,
  animate = true,
}: SectionWrapperProps) {
  const Wrapper = animate ? motion.section : "section";
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
      }
    : {};

  return (
    <Wrapper
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`${variantClasses[variant]} px-4 py-20 sm:px-6 lg:px-8 ${className}`}
      {...animationProps}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </Wrapper>
  );
}

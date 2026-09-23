import type { ReactNode } from "react";

type SectionVariant = "white" | "muted" | "warm" | "primary-soft" | "dark";

interface SectionWrapperProps {
  children: ReactNode;
  variant?: SectionVariant;
  className?: string;
  id?: string;
  ariaLabelledBy?: string;
  /**
   * Adds the CSS fade-up entrance (globals.css `.animate-fade-in-up`). It used
   * to be a framer-motion `whileInView` that shipped the section at opacity:0
   * in the static HTML until hydration; now it is CSS-only, so the section is
   * visible without JavaScript and this stays a server component.
   */
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
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`${variantClasses[variant]} px-4 py-20 sm:px-6 lg:px-8 ${animate ? "animate-fade-in-up" : ""} ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

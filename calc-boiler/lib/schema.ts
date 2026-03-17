import { SITE_CONFIG } from "@/lib/constants";

/**
 * Shared JSON-LD schema fragments for calculator and guide pages.
 * Keeps page files clean and ensures consistency across the site.
 */

const BASE = SITE_CONFIG.baseUrl;

// ─── Organization (publisher on every page) ─────────────────────
export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org" as const,
  "@type": "Organization" as const,
  "@id": `${BASE}/#organization`,
  name: SITE_CONFIG.name,
  url: BASE,
  logo: {
    "@type": "ImageObject" as const,
    url: `${BASE}/images/logo.svg`,
    width: "512",
    height: "512",
  },
  contactPoint: {
    "@type": "ContactPoint" as const,
    contactType: "customer service",
    email: SITE_CONFIG.email,
  },
};

// ─── HowTo for calculator pages ─────────────────────────────────
export function calculatorHowTo(opts: {
  name: string;
  url: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "HowTo" as const,
    name: opts.name,
    url: opts.url,
    description: opts.description,
    totalTime: "PT1M",
    tool: {
      "@type": "HowToTool" as const,
      name: "Web browser",
    },
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep" as const,
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

// ─── Common HowTo steps for pay/tax calculators ─────────────────
export const PAY_CALCULATOR_STEPS = [
  { name: "Enter your salary", text: "Type your gross annual salary, hourly rate, or any pay amount into the input field." },
  { name: "Select pay frequency", text: "Choose whether your salary is annual, monthly, fortnightly, weekly, or hourly." },
  { name: "Add optional details", text: "Optionally include HECS-HELP debt, salary sacrifice, or other deductions for a more accurate result." },
  { name: "View your results", text: "Instantly see your take-home pay, income tax, Medicare levy, superannuation, and a full breakdown by pay period." },
];

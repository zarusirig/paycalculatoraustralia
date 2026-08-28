"use client";

import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES } from "@/lib/constants";
import { CENTRELINK_SOURCES } from "@/lib/constants/centrelink-income-test";

export const H2 = "text-2xl font-semibold text-navy mb-4";
export const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
export const P = "text-warmgray mb-4";
export const LINK = "text-eucalyptus-dark hover:underline font-medium";
export const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
export const TH = "px-4 py-3 text-left font-semibold text-navy";
export const TD = "px-4 py-3 text-navy tabular-nums";
export const INPUT = "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20";
export const LABEL = "block text-sm font-medium text-navy mb-1";

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

export function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className={`flex justify-between items-center gap-4 ${highlight ? "bg-eucalyptus-light/40 -mx-2 px-2 py-1 rounded" : ""}`}>
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-bold text-navy" : "text-navy"}`}>{value}</span>
    </div>
  );
}

/** The scope statement every Centrelink calculator carries. */
export function NotIncluded({ items }: { items: string[] }) {
  return (
    <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 text-xs text-navy">
      <strong>Income test only.</strong> Not modelled: {items.join("; ")}. Services Australia pays the lower of the income and assets test results, so treat this as the income-test ceiling, not a quote. Figures verified at Services Australia on {CENTRELINK_SOURCES.verifiedOn}.
    </div>
  );
}

export function CentrelinkRelated({ current }: { current: "jobseeker" | "student" | "pension" }) {
  const items = [
    { key: "hub", href: "/centrelink-income-test/", label: "Centrelink income test guide", blurb: "how the free area, taper and cut-off work for every payment" },
    { key: "jobseeker", href: "/jobseeker-payment-calculator/", label: "JobSeeker payment calculator", blurb: "what you keep when you work part-time" },
    { key: "student", href: "/austudy-youth-allowance-calculator/", label: "Austudy and Youth Allowance calculator", blurb: "the $539 free area and the 50c/60c bands" },
    { key: "pension", href: "/age-pension-income-test-calculator/", label: "Age Pension income test calculator", blurb: "with the Work Bonus applied" },
    { key: "th", href: "/take-home-pay-calculator/", label: "Take-home pay calculator", blurb: "tax on your wages and payment together" },
    { key: "fn", href: "/fortnightly-pay-calculator/", label: "Fortnightly pay calculator", blurb: "convert your wage to the fortnightly gross Centrelink asks for" },
  ].filter((i) => i.key !== current);
  return (
    <ul className="space-y-2 text-warmgray">
      {items.map((i) => (
        <li key={i.key}><Link href={i.href} className={LINK}>{i.label}</Link> &mdash; {i.blurb}</li>
      ))}
    </ul>
  );
}

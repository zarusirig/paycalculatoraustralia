import React from "react";
import { formatAUD } from "@/lib/constants/australian-tax";
import { hasPage, hubHref, prevNext, salaryHref } from "@/lib/data/salary-pages";
import { rangeSections, type RangeSection } from "@/lib/data/salary-pages/tax-on-ranges";
import {
  div293Paragraphs,
  edgeHeading,
  edgeParagraphs,
  hecsParagraph,
  litoParagraphs,
  medicareParagraphs,
  mlsParagraphs,
} from "@/modules/programmatic/tax-on-salary-range-copy";

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus hover:text-navy transition-colors font-medium";

// The salary-range sections of /tax-on/[salary]/ (10 Oct 2026, second pass).
// Each renders only where its rule applies at this salary (see
// lib/data/salary-pages/tax-on-ranges.ts), so a $20,000 page explains the
// offset and the levy reduction, a $135,000 page the bracket edge, and a
// $250,000 page Division 293, instead of every page carrying every section.

interface Spec {
  heading: (s: string, salary: number) => string;
  body: (salary: number) => string[];
  guide: { href: string; label: string };
}

const SPECS: Record<RangeSection, Spec> = {
  lito: {
    heading: (s) => `Low Income Tax Offset on ${s}`,
    body: litoParagraphs,
    guide: { href: "/low-income-tax-offset/", label: "How the Low Income Tax Offset works" },
  },
  medicare: {
    heading: (s) => `Medicare Levy on ${s}: the Low-Income Reduction`,
    body: medicareParagraphs,
    guide: { href: "/medicare-levy/", label: "Medicare levy guide" },
  },
  edge: {
    heading: (_s, salary) => edgeHeading(salary),
    body: edgeParagraphs,
    guide: { href: "/tax-brackets/", label: "All the tax brackets" },
  },
  mls: {
    heading: (s) => `Medicare Levy Surcharge on ${s}`,
    body: mlsParagraphs,
    guide: { href: "/medicare-levy-surcharge-calculator/", label: "Medicare levy surcharge calculator" },
  },
  hecs: {
    heading: (s) => `Tax on ${s} With a HECS-HELP Debt`,
    body: (salary) => [hecsParagraph(salary)],
    guide: { href: "/hecs-help-calculator/", label: "HECS-HELP calculator" },
  },
  div293: {
    heading: (s) => `Division 293 Tax on ${s}`,
    body: div293Paragraphs,
    guide: { href: "/division-293-tax/", label: "Division 293 guide" },
  },
};

export function RangeSections({ salary }: { salary: number }) {
  const s = formatAUD(salary);
  return (
    <>
      {rangeSections(salary).map((id) => {
        const spec = SPECS[id];
        const paras = spec.body(salary);
        return (
          <section key={id} className="prose prose-eucalyptus max-w-none" data-range-section={id}>
            <h2 style={H2} className="text-2xl font-bold text-navy mb-4">{spec.heading(s, salary)}</h2>
            {paras.map((p, i) => (
              <p key={i} className="text-navy leading-relaxed">
                {p}
                {i === paras.length - 1 && (
                  <>
                    {" "}
                    <a href={spec.guide.href} className={LINK}>{spec.guide.label}</a>.
                  </>
                )}
              </p>
            ))}
          </section>
        );
      })}
    </>
  );
}

/**
 * Previous and next page, the hub, and the same salary in the other two
 * families. Used on this family instead of the shared SalaryNav and its strip
 * of six neighbours: the prev/next chain, the comparison table and the hub
 * already link every page.
 */
export function TaxOnNav({ salary }: { salary: number }) {
  const { prev, next } = prevNext("tax-on", salary);
  const s = formatAUD(salary);
  const item = "rounded-md border border-sandstone-dark/20 px-3 py-1.5 text-sm text-navy transition-colors hover:border-eucalyptus hover:text-eucalyptus";
  return (
    <nav aria-label="Nearby salaries" className="mt-4 flex flex-wrap gap-2">
      {prev !== null && (
        <a href={salaryHref("tax-on", prev)} rel="prev" className={item}>← {formatAUD(prev)}</a>
      )}
      {next !== null && (
        <a href={salaryHref("tax-on", next)} rel="next" className={item}>{formatAUD(next)} →</a>
      )}
      <a href={hubHref("tax-on")} className={`${item} font-semibold`}>Tax on every salary</a>
      {hasPage("take-home", salary) && (
        <a href={salaryHref("take-home", salary)} className={item}>{s} after tax</a>
      )}
      {hasPage("salary-to-hourly", salary) && (
        <a href={salaryHref("salary-to-hourly", salary)} className={item}>{s} a year to hourly</a>
      )}
    </nav>
  );
}

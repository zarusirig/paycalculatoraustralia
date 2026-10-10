import React from "react";
import Link from "next/link";
import {
  formatAUD,
  formatNegAUD,
  SITE_CONFIG,
  EMPLOYMENT,
  HECS_HELP_2025_26,
} from "@/lib/constants/australian-tax";
import { NMW_ORDER } from "@/lib/constants/junior-rates";
import { LISTO_SOURCES } from "@/lib/constants/listo";
import { RETURN_2026_SOURCES } from "@/lib/constants/tax-return-2025-26";
import { WATO_SOURCES } from "@/lib/constants/tax-2027-28";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { hasPage, salaryFacts, salaryHref } from "@/lib/data/salary-pages";
import {
  apprenticesOnPage,
  div293Effect,
  hecsShift,
  hoursRows,
  jobsOnPage,
  lowIncomeHelp,
  sacrificeEffect,
  takeHomeBand,
} from "@/lib/data/salary-pages/take-home-sections";
import { FaqAnswer } from "@/components/common/faq-accordion";
import { takeHomePayOnSalaryFaqs } from "@/modules/programmatic/take-home-pay-on-salary-faqs";
import { SalaryNav } from "@/modules/programmatic/salary-page-sections";
import { JobsNearSalary } from "@/modules/programmatic/jobs-near-salary";
import { PartTimeHours, TakeHomeFactors, YearChangeLine } from "@/modules/programmatic/take-home-sections";
import FeaturedImage from "@/components/common/featured-image";

interface TakeHomePayOnSalaryProps {
  salary: number;
}

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus hover:text-navy transition-colors font-medium";

const ATO = {
  rates: { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "ATO" },
  medicare: { title: "Medicare levy", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: "ATO" },
  sacrifice: {
    title: "Salary sacrificing super",
    url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/salary-sacrificing-super",
    publisher: "ATO",
  },
  coContribution: {
    title: "Super co-contribution",
    url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/government-super-contributions/super-co-contribution",
    publisher: "ATO",
  },
  studyLoans: { title: "Study and training support loans", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: "ATO" },
  div293: {
    title: "Division 293 tax on concessional contributions by high-income earners",
    url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/division-293-tax-on-concessional-contributions-by-high-income-earners",
    publisher: "ATO",
  },
} satisfies Record<string, SourceLink>;

/** Sources for the sections this salary actually shows. */
function sourcesFor(salary: number): SourceLink[] {
  const band = takeHomeBand(salary);
  const out: SourceLink[] = [ATO.rates, ATO.medicare];
  if (band === "low") {
    out.push({ title: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`, url: NMW_ORDER.url, publisher: "Fair Work Commission" });
    for (const r of hoursRows(salary).slice(1)) out.push({ title: r.sourceLabel, url: r.sourceUrl, publisher: "Fair Work Commission" });
    out.push({ title: "Low income super tax offset", url: LISTO_SOURCES.ato, publisher: "ATO" });
    if (lowIncomeHelp(salary).coContribution > 0) out.push(ATO.coContribution);
  } else {
    if (sacrificeEffect(salary).amount > 0) out.push(ATO.sacrifice);
    if (band === "middle" && lowIncomeHelp(salary).coContribution > 0) out.push(ATO.coContribution);
    if (band === "high") out.push({ title: "Medicare levy surcharge income, thresholds and rates", url: RETURN_2026_SOURCES.mls, publisher: "ATO" });
    if (div293Effect(salary)) out.push(ATO.div293);
  }
  if (hecsShift(salary) || salary > HECS_HELP_2025_26.minimumThreshold) out.push(ATO.studyLoans);
  out.push({ title: "Working Australians tax offset", url: WATO_SOURCES.ato, publisher: "ATO" });
  const { occupations, publicPay, show } = jobsOnPage(salary);
  const awards = new Map<string, string>();
  for (const a of apprenticesOnPage(salary)) for (const t of a.trades) awards.set(t.awardUrl, t.award);
  for (const [url, title] of awards) out.push({ title: `${title} (apprentice rates)`, url, publisher: "Fair Work Commission" });
  if (show) {
    for (const o of occupations) {
      out.push({ title: `${o.anzscoTitle} (ANZSCO ${o.anzscoCode}) occupation profile`, url: o.sourceUrl, publisher: "Jobs and Skills Australia" });
    }
    const seen = new Set<string>();
    for (const p of publicPay) {
      if (!p.sourceUrl || seen.has(p.sourceUrl)) continue;
      seen.add(p.sourceUrl);
      out.push({ title: `${p.service} pay rates`, url: p.sourceUrl, publisher: p.service });
    }
  }
  return out;
}

// Oct 2026 (second pass): the take-home pages were still ~95% the same with
// the numbers masked. The page now keeps the core answer (the hero, a month,
// the breakdown table) and one line each, with a link, for what is the same on
// every salary. Everything else is a section that exists only where it applies
// (modules/programmatic/take-home-sections.tsx): hours and offsets at low
// salaries, salary sacrifice in the middle, the surcharge and Division 293 at
// the top, HECS-HELP only where a neighbouring page is in another band, the
// change since 2025-26, and the jobs that land on this salary. The bracket
// working, the threshold list, the comparison table and the ABS placement are
// on the paired /tax-on/ page and are not repeated here.
export function TakeHomePayOnSalary({ salary }: TakeHomePayOnSalaryProps) {
  // Headline figures exclude HECS-HELP: "$X after tax" is asked (and answered
  // by the ATO and every other AU pay site) for someone without a study loan.
  const facts = salaryFacts(salary);
  const breakdown = facts.breakdown;
  const band = takeHomeBand(salary);
  const s = formatAUD(salary);

  // Employer SG capped at the maximum contribution base.
  const employerSuper = facts.employerSuper;

  const taxOnHref = hasPage("tax-on", salary) ? salaryHref("tax-on", salary) : "/tax-brackets/";
  const hourlyHref = hasPage("salary-to-hourly", salary) ? salaryHref("salary-to-hourly", salary) : "/salary-to-hourly/";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="prose prose-eucalyptus max-w-none">
        <p className="text-lg text-navy leading-relaxed">
          That is <strong>{formatAUD(breakdown.monthly)} a month</strong>{breakdown.netIncomeTax === 0 ? ", with no income tax to pay" : ""}.
          <YearChangeLine salary={salary} />
        </p>
      </section>

      <TrustBar />
      <FeaturedImage lazy className="mt-0" />

      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">Pay Breakdown on {s}</h2>
        <Card className="overflow-hidden border-sandstone-dark/10 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone text-navy font-semibold border-b border-sandstone-dark/10">
                <tr>
                  <th className="px-6 py-4">Component</th>
                  <th className="px-6 py-4 text-right">Annual</th>
                  <th className="px-6 py-4 text-right">Monthly</th>
                  <th className="px-6 py-4 text-right">Fortnightly</th>
                  <th className="px-6 py-4 text-right">Weekly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Gross Salary</td>
                  <td className="px-6 py-4 text-right font-medium">{formatAUD(breakdown.grossSalary)}</td>
                  <td className="px-6 py-4 text-right">{formatAUD(breakdown.grossSalary / 12)}</td>
                  <td className="px-6 py-4 text-right">{formatAUD(breakdown.grossSalary / 26)}</td>
                  <td className="px-6 py-4 text-right">{formatAUD(breakdown.grossSalary / 52)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors text-ochre">
                  <td className="px-6 py-4">Income Tax</td>
                  <td className="px-6 py-4 text-right">{formatNegAUD(breakdown.netIncomeTax, 0, "−")}</td>
                  <td className="px-6 py-4 text-right">{formatNegAUD(breakdown.netIncomeTax / 12, 0, "−")}</td>
                  <td className="px-6 py-4 text-right">{formatNegAUD(breakdown.netIncomeTax / 26, 0, "−")}</td>
                  <td className="px-6 py-4 text-right">{formatNegAUD(breakdown.netIncomeTax / 52, 0, "−")}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors text-ochre">
                  <td className="px-6 py-4">Medicare Levy</td>
                  <td className="px-6 py-4 text-right">{formatNegAUD(breakdown.medicareLevy, 0, "−")}</td>
                  <td className="px-6 py-4 text-right">{formatNegAUD(breakdown.medicareLevy / 12, 0, "−")}</td>
                  <td className="px-6 py-4 text-right">{formatNegAUD(breakdown.medicareLevy / 26, 0, "−")}</td>
                  <td className="px-6 py-4 text-right">{formatNegAUD(breakdown.medicareLevy / 52, 0, "−")}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 text-warmgray">Superannuation (employer-paid)</td>
                  <td className="px-6 py-4 text-right text-warmgray">+{formatAUD(employerSuper)}</td>
                  <td className="px-6 py-4 text-right text-warmgray">+{formatAUD(employerSuper / 12)}</td>
                  <td className="px-6 py-4 text-right text-warmgray">+{formatAUD(employerSuper / 26)}</td>
                  <td className="px-6 py-4 text-right text-warmgray">+{formatAUD(employerSuper / 52)}</td>
                </tr>
                <tr className="bg-eucalyptus-dark text-white font-bold">
                  <td className="px-6 py-5">Take-Home Pay</td>
                  <td className="px-6 py-5 text-right">{formatAUD(breakdown.takeHomePay)}</td>
                  <td className="px-6 py-5 text-right">{formatAUD(breakdown.monthly)}</td>
                  <td className="px-6 py-5 text-right">{formatAUD(breakdown.fortnightly)}</td>
                  <td className="px-6 py-5 text-right">{formatAUD(breakdown.weekly)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-4 text-sm text-warmgray leading-relaxed">
          Workings: <Link href={taxOnHref} className={LINK}>tax brackets</Link> · <Link href="/medicare-levy/" className={LINK}>Medicare levy</Link> ·{" "}
          <Link href="/superannuation-guide/" className={LINK}>super{facts.superCapped ? " (capped)" : ""}</Link>
          {band !== "low" && (
            <>
              {" "}· <Link href={hourlyHref} className={LINK}>{formatAUD(salary / EMPLOYMENT.hoursPerYear, 2)} an hour</Link>
            </>
          )}{" "}
          · <Link href="/take-home-pay-calculator/" className={LINK}>calculator</Link>
        </p>
      </section>

      {band === "low" && <PartTimeHours salary={salary} />}

      <TakeHomeFactors salary={salary} />

      <JobsNearSalary salary={salary} />

      <SalaryNav salary={salary} family="take-home" />

      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {takeHomePayOnSalaryFaqs(salary).map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i + 1}`} className="bg-white border rounded-lg px-4 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-warmgray pb-4 leading-relaxed">
                <FaqAnswer faq={f} linkClassName="text-eucalyptus hover:text-navy transition-colors font-medium" />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <p className="text-sm text-warmgray">
        Single resident, no HECS-HELP{band === "high" ? ", hospital cover held" : ""}; Medicare thresholds {SITE_CONFIG.previousFinancialYear}.{" "}
        <Link href="/about/#methodology" className={LINK}>Method</Link>.
      </p>
      <SourceAttribution sources={sourcesFor(salary)} lastVerified={SITE_CONFIG.lastVerified} />
    </div>
  );
}

import React from "react";
import Link from "next/link";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  SITE_CONFIG,
  EMPLOYMENT,
  SUPER_GUARANTEE,
} from "@/lib/constants/australian-tax";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { hasPage, salaryFacts, salaryHref } from "@/lib/data/salary-pages";
import { FaqAnswer } from "@/components/common/faq-accordion";
import { takeHomePayOnSalaryFaqs } from "@/modules/programmatic/take-home-pay-on-salary-faqs";
import { EarningsPosition, NeighbourTable, NextThousand, SalaryBandNotes, SalaryNav } from "@/modules/programmatic/salary-page-sections";
import { JobsNearSalary } from "@/modules/programmatic/jobs-near-salary";
import FeaturedImage from "@/components/common/featured-image";

interface TakeHomePayOnSalaryProps {
  salary: number;
}

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus hover:text-navy transition-colors font-medium";

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "ATO" },
  { title: "Medicare levy", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: "ATO" },
  { title: "Superannuation guarantee", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee", publisher: "ATO" },
];

// Oct 2026: the sections that read word-for-word the same on every salary
// (pay by frequency, how brackets work, ways to increase take-home, related
// calculators, the methodology list) are cut to a line each with a link to the
// page that covers them, so most of this page is about its own salary. The
// bracket-by-bracket working lives on the paired /tax-on/ page.
export function TakeHomePayOnSalary({ salary }: TakeHomePayOnSalaryProps) {
  // Headline figures exclude HECS-HELP: "$X after tax" is asked (and answered
  // by the ATO and every other AU pay site) for someone without a study loan.
  const breakdown = calculatePayBreakdown({ grossSalary: salary });

  const formattedSalary = formatAUD(salary);
  const effectiveRate = (breakdown.effectiveTaxRate * 100).toFixed(1);

  const hourlyGross = salary / EMPLOYMENT.hoursPerYear;
  const hourlyNet = breakdown.takeHomePay / EMPLOYMENT.hoursPerYear;

  // Employer SG capped at the maximum contribution base (the engine's
  // superContribution is an uncapped 12%, which overstates it above ~$270k).
  const facts = salaryFacts(salary);
  const employerSuper = facts.employerSuper;
  const totalPackage = salary + employerSuper;

  const taxOnHref = hasPage("tax-on", salary) ? salaryHref("tax-on", salary) : "/tax-brackets/";
  const taxOnLabel = hasPage("tax-on", salary) ? `Tax on ${formattedSalary}` : "tax brackets";
  const hourlyHref = hasPage("salary-to-hourly", salary) ? salaryHref("salary-to-hourly", salary) : "/salary-to-hourly/";

  const tax = breakdown.netIncomeTax;
  const medicare = breakdown.medicareLevy;
  const deductionsText =
    tax === 0 && medicare === 0
      ? "with no income tax or Medicare levy to pay"
      : tax === 0
        ? `with no income tax to pay and ${formatAUD(medicare)} of Medicare levy`
        : medicare === 0
          ? `after ${formatAUD(tax)} of income tax and no Medicare levy`
          : `after ${formatAUD(tax)} of income tax and ${formatAUD(medicare)} of Medicare levy`;
  const bracketText =
    breakdown.litoOffset > 0 && tax === 0
      ? `The Low Income Tax Offset cancels all ${formatAUD(breakdown.incomeTax)} of the bracket tax`
      : breakdown.litoOffset > 0
        ? `The ${formatAUD(tax)} of income tax is ${formatAUD(breakdown.incomeTax)} of bracket tax less a ${formatAUD(breakdown.litoOffset)} Low Income Tax Offset`
        : `The ${formatAUD(tax)} of income tax is worked out bracket by bracket`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Introduction */}
      {/* The hero above already gives the yearly, fortnightly and weekly answer;
          the HECS-HELP case is in "What applies" and the FAQ. */}
      <section className="prose prose-eucalyptus max-w-none">
        <p className="text-lg text-navy leading-relaxed">
          That is <strong>{formatAUD(breakdown.monthly)} a month</strong>, {deductionsText}.
          Your employer also pays {formatAUD(employerSuper)} of super on top{facts.superCapped ? ", the most SG requires because earnings above the maximum contribution base attract none" : ""}.
          Use our <a href="/take-home-pay-calculator/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Take-Home Pay Calculator</a> to model different salary scenarios.
        </p>
        <EarningsPosition salary={salary} />
      </section>

      <TrustBar />
      <FeaturedImage lazy className="mt-0" />

      {/* Full Pay Breakdown */}
      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">Full Pay Breakdown on {formattedSalary}</h2>
        <p className="text-navy leading-relaxed mb-6">
          Your effective rate of tax and Medicare is {effectiveRate}%, so you keep {(100 - parseFloat(effectiveRate)).toFixed(1)}% of {formattedSalary}.
        </p>
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
        <p className="mt-4 text-sm text-warmgray">
          With super your total package is {formatAUD(totalPackage)}. On a {EMPLOYMENT.standardWeeklyHours}-hour week {formattedSalary} is {formatAUD(hourlyGross, 2)} an hour before tax and{" "}
          {formatAUD(hourlyNet, 2)} after ({formatAUD(breakdown.daily, 2)} a day); see <Link href={hourlyHref} className={LINK}>salary to hourly</Link> for part-time hours.
        </p>
      </section>

      <JobsNearSalary salary={salary} />

      <div className="space-y-3">
        <SalaryBandNotes salary={salary} />
        <p className="text-navy leading-relaxed">
          {bracketText}; the bracket-by-bracket working is on the <Link href={taxOnHref} className={LINK}>{taxOnLabel}</Link> page.
        </p>
      </div>

      <NextThousand salary={salary} />

      <NeighbourTable salary={salary} family="take-home" offsets={[-10_000, -5_000, 0, 5_000, 10_000]} />

      <SalaryNav salary={salary} family="take-home" />

      <p className="text-navy leading-relaxed">
        More ways to cut the tax on {formattedSalary}: <Link href="/tax-deductions-guide/" className={LINK}>work-related deductions</Link> and a{" "}
        <Link href="/novated-lease-calculator/" className={LINK}>novated lease</Link>.
      </p>

      {/* FAQs */}
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
        Assumes an Australian resident on {SITE_CONFIG.financialYear} rates with private hospital cover (no Medicare Levy Surcharge) and no HECS-HELP in the
        headline; super is paid on top at {Math.round(SUPER_GUARANTEE.rate * 100)}%, capped at the maximum contribution base.{" "}
        <Link href="/about/#methodology" className={LINK}>How we calculate</Link>.
      </p>
      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </div>
  );
}

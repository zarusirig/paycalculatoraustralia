import React from "react";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  TAX_BRACKETS,
  HECS_HELP,
  LITO,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
} from "@/lib/constants/australian-tax";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { hasPage, salaryFacts, salaryHref } from "@/lib/data/salary-pages";
import { thresholdsNear, distanceText } from "@/lib/data/salary-pages/tax-on-thresholds";
import { payPointsRoundingTo } from "@/lib/data/salary-pages/tax-on-pay-points";
import { awardMinimumsRoundingTo } from "@/lib/data/salary-pages/tax-on-occupations";
import { salaryPercentile, EE_RELEASE, AWE_RELEASE } from "@/lib/data/average-salary";
import { DIVISION_293 } from "@/lib/constants/super-contributions";
import { NextThousandTaxTable, SalaryNav } from "@/modules/programmatic/salary-page-sections";
import { taxOnSalaryFaqs } from "@/modules/programmatic/tax-on-salary-faqs";
import {
  litoShrinkAbove,
  sacrificeSentence,
  nextThousandSentence,
  occupationIntro,
  occupationGroupsNear,
  versus,
  benchmarkIntro,
  benchmarkLines,
  bracketPositionSentence,
  bracketWalk,
  comparisonRangeSentence,
  fullTimeMinimumWageAnnual,
  medianComparisonSentence,
  placementSentence,
  taxByYear,
  taxByYearSentence,
  thresholdsBeyond,
  thresholdsIntro,
} from "@/modules/programmatic/tax-on-salary-copy";
import FeaturedImage from "@/components/common/featured-image";

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus hover:text-navy transition-colors font-medium";
const pct1 = (r: number) => `${(r * 100).toFixed(1)}%`;

interface TaxOnSalaryProps {
  salary: number;
}

// /tax-on/[salary]/ — rebuilt 10 Oct 2026. The grid is $5,000 steps and each
// page is about its own salary: the bracket walk, tax by year, the thresholds
// within $15,000, where the salary sits among Australian earners (ABS), the
// published pay figures that round to it (ABS groups, JSA occupation medians,
// state teacher and nursing scales, award minimums: each lands on exactly one
// page of the $5k grid) and the HECS-HELP case. Copy that was word-for-word the
// same on every page (generic
// deductions, the calculators grid, the Stage 3 history) is now one line and a
// link to the guide that covers it.
export function TaxOnSalary({ salary }: TaxOnSalaryProps) {
  const SOURCES_LIST: SourceLink[] = [
    { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "ATO" },
    { title: "Medicare levy", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: "ATO" },
    { title: "Study and training support loans", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: "ATO" },
    { title: `${EE_RELEASE.title}, ${EE_RELEASE.referencePeriod}`, url: EE_RELEASE.url, publisher: "ABS" },
    { title: `${AWE_RELEASE.title}, ${AWE_RELEASE.referencePeriod}`, url: AWE_RELEASE.url, publisher: "ABS" },
    ...occupationGroupsNear(salary).map((g) => ({
      title: `${g.anzscoTitle} (ANZSCO ${g.anzscoCode}) occupation profile`,
      url: g.url,
      publisher: "Jobs and Skills Australia",
    })),
  ];

  // Headline figures exclude HECS-HELP (the usual "tax on $X" question is for
  // someone without a study loan, and the page title shows these numbers).
  const facts = salaryFacts(salary);
  const breakdown = facts.breakdown;
  const withHecs = facts.withHecs;
  const s = formatAUD(salary);
  const fy = SITE_CONFIG.financialYear;
  const employerSuper = facts.employerSuper;
  const totalTax = breakdown.netIncomeTax + breakdown.medicareLevy;

  // Comparison rows: ±$5k and ±$10k, the neighbouring pages (salaries at or below $0 dropped).
  const comparisons = [-10000, -5000, 0, 5000, 10000]
    .filter((diff) => salary + diff > 0)
    .map((diff) => {
      const b = calculatePayBreakdown({ grossSalary: salary + diff });
      return { diff, salary: salary + diff, b, diffToCurrent: b.takeHomePay - breakdown.takeHomePay };
    });
  const plusTenK = comparisons.find((c) => c.diff === 10000);

  const near = thresholdsNear(salary);
  const years = taxByYear(salary);
  const ft = salaryPercentile(salary, "fullTime");
  const minWageAnnual = fullTimeMinimumWageAnnual();
  const hecsBand = HECS_HELP.bands[facts.hecsBandIndex];
  const benchmarks = benchmarkLines(salary);
  const occupations = occupationGroupsNear(salary);
  const payPoints = payPointsRoundingTo(salary);
  const awardRows = awardMinimumsRoundingTo(salary);

  // LITO and Medicare, by stage — one sentence each, only when they bite.
  const litoSentence =
    facts.litoStage === "full"
      ? `The full ${formatAUD(LITO.maxOffset)} Low Income Tax Offset comes off the bracket tax${breakdown.netIncomeTax === 0 ? ", which wipes it out" : ""}.`
      : facts.litoStage === "nil"
        ? salary - LITO.nilOffsetIncome <= 15_000
          ? `There is no Low Income Tax Offset: it ran out at ${formatAUD(LITO.nilOffsetIncome)}, ${formatAUD(salary - LITO.nilOffsetIncome)} below this salary.`
          : ""
        : `A reduced Low Income Tax Offset of ${formatAUD(breakdown.litoOffset)} comes off, shrinking by ${litoShrinkAbove(salary) ?? "1.5c"} for every extra dollar.`;
  const medicareSentence =
    facts.medicareStage === "exempt"
      ? `No Medicare levy is payable: the income is under the ${formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} low-income threshold (${SITE_CONFIG.previousFinancialYear} figure, the latest published).`
      : facts.medicareStage === "shade-in"
        ? `The Medicare levy is still shading in at 10c per dollar above ${formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} (${SITE_CONFIG.previousFinancialYear} threshold), so it is ${formatAUD(breakdown.medicareLevy)} rather than the full 2%.`
        : `The Medicare levy is the full 2%: ${formatAUD(breakdown.medicareLevy)}.`;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="prose prose-eucalyptus max-w-none">
        <p className="text-lg text-navy leading-relaxed">
          {bracketPositionSentence(salary)} Take-home is <strong>{formatAUD(breakdown.takeHomePay)}</strong> a year ({formatAUD(breakdown.weekly)} a week), and your
          employer pays {formatAUD(employerSuper)} of super on top.
        </p>
      </section>

      <TrustBar />
      <FeaturedImage lazy className="mt-0" />

      <section className="prose prose-eucalyptus max-w-none">
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">How Much Tax Do You Pay on {s}?</h2>
        <p className="text-navy leading-relaxed">
          {bracketWalk(salary)} That is {formatAUD(breakdown.incomeTax)} before offsets. {litoSentence} {medicareSentence} Total:{" "}
          <strong>{formatAUD(totalTax)}</strong>.
        </p>
      </section>

      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">What Is the Take-Home Pay Breakdown at {s}?</h2>
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
          Employer super: <strong>{formatAUD(employerSuper)}</strong>{" "}
          {facts.superCapped
            ? `(capped at the ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} maximum contribution base)`
            : `(${Math.round(SUPER_GUARANTEE.rate * 100)}%)`}
          , a package of {formatAUD(salary + employerSuper)}.
          {facts.division293 > 0 &&
            ` Income plus super is over ${formatAUD(DIVISION_293.threshold)}, so Division 293 adds about ${formatAUD(facts.division293)}, billed separately by the ATO.`}
        </p>
      </section>

      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">What Tax Bracket Does {s} Fall Into?</h2>
        <Card className="overflow-hidden border-sandstone-dark/20 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone/30 text-navy font-semibold border-b border-sandstone-dark/20">
                <tr>
                  <th className="px-6 py-4">Tax Bracket</th>
                  <th className="px-6 py-4 text-right">Income in Bracket</th>
                  <th className="px-6 py-4 text-right">Tax Rate</th>
                  <th className="px-6 py-4 text-right">Tax Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {TAX_BRACKETS.map((bracket, index) => {
                  if (salary <= bracket.min) return null;
                  const incomeInBracket = Math.min(salary, bracket.max) - bracket.min + (bracket.min === 0 ? 0 : 1);
                  return (
                    <tr key={index} className="hover:bg-sandstone/30 transition-colors">
                      <td className="px-6 py-4 text-warmgray">
                        {index === 0
                          ? `$0 – ${formatAUD(bracket.max)}`
                          : index === TAX_BRACKETS.length - 1
                            ? `Over ${formatAUD(bracket.min - 1)}`
                            : `${formatAUD(bracket.min - 1)} – ${formatAUD(bracket.max)}`}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-navy">{formatAUD(incomeInBracket)}</td>
                      <td className="px-6 py-4 text-right text-warmgray">{(bracket.rate * 100).toFixed(1)}%</td>
                      <td className="px-6 py-4 text-right font-medium text-navy">{formatAUD(incomeInBracket * bracket.rate)}</td>
                    </tr>
                  );
                })}
                {breakdown.litoOffset > 0 && (
                  <tr className="bg-sandstone text-navy transition-colors">
                    <td colSpan={3} className="px-6 py-4 text-right font-medium">Minus Low Income Tax Offset (LITO)</td>
                    <td className="px-6 py-4 text-right font-bold text-eucalyptus">{formatNegAUD(breakdown.litoOffset, 0, "−")}</td>
                  </tr>
                )}
                <tr className="bg-sandstone text-navy font-bold border-t-2 border-sandstone-dark/20">
                  <td colSpan={3} className="px-6 py-4 text-right">Total Income Tax</td>
                  <td className="px-6 py-4 text-right">{formatAUD(breakdown.netIncomeTax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        <h3 style={H2} className="text-xl font-bold text-navy mt-8 mb-3">Income Tax on {s} by Year</h3>
        <Card className="overflow-hidden border-sandstone-dark/20 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone/30 text-navy font-semibold border-b border-sandstone-dark/20">
                <tr>
                  <th className="px-4 py-3">Income year</th>
                  <th className="px-4 py-3">Scale</th>
                  <th className="px-4 py-3 text-right">Income tax after LITO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {years.map((y) => (
                  <tr key={y.year} className={y.year === fy ? "bg-eucalyptus-light/40 font-medium" : ""}>
                    <td className="px-4 py-3">{y.year}</td>
                    <td className="px-4 py-3 text-warmgray">{y.note}</td>
                    <td className="px-4 py-3 text-right">{formatAUD(y.tax)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-3 text-sm text-warmgray">
          {taxByYearSentence(salary)} Rates for every year: <a href="/tax-brackets/" className={LINK}>tax brackets</a> and{" "}
          <a href="/tax-bracket-history/" className={LINK}>tax bracket history</a>.
        </p>
      </section>

      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">Tax Thresholds Near {s}</h2>
        <p className="text-navy leading-relaxed mb-4">{thresholdsIntro(salary)}</p>
        {near.near.length > 0 && (
          <Card className="overflow-hidden border-sandstone-dark/20 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-sandstone/30 text-navy font-semibold border-b border-sandstone-dark/20">
                  <tr>
                    <th className="px-4 py-3">Threshold</th>
                    <th className="px-4 py-3 text-right">Above</th>
                    <th className="px-4 py-3">What changes</th>
                    <th className="px-4 py-3">Distance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10 align-top">
                  {near.near.map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 py-3">
                        <a href={t.href} className={LINK}>{t.name}</a>
                        <span className="block text-xs text-warmgray">{t.incomeYear}</span>
                      </td>
                      <td className="px-4 py-3 text-right">{formatAUD(t.at)}</td>
                      <td className="px-4 py-3">{t.change}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{distanceText(t, salary)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
        <p className="mt-4 text-navy leading-relaxed">{thresholdsBeyond(salary)}</p>
        <p className="mt-4 text-navy leading-relaxed">
          {facts.superCapped
            ? `Employer super is capped at ${formatAUD(employerSuper)}, which uses almost all of the ${formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap (${fy}), so there is ${formatAUD(facts.concessionalRoom)} of room for salary sacrifice.`
            : `Employer super of ${formatAUD(employerSuper)} uses ${pct1(employerSuper / SUPER_GUARANTEE.concessionalCap)} of the ${formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap (${fy}), leaving ${formatAUD(facts.concessionalRoom)} for salary sacrifice. ${facts.concessionalRoom < 1_000 ? "That is too little for a $1,000 sacrifice without going over the cap." : sacrificeSentence(salary)}`}{" "}
          Other ways to lower the bill are in the <a href="/tax-deductions-guide/" className={LINK}>tax deductions guide</a> and the{" "}
          <a href="/salary-sacrifice-calculator/" className={LINK}>salary sacrifice calculator</a>.
        </p>
        <p className="mt-3 text-sm text-warmgray">
          Medicare levy low-income thresholds are {SITE_CONFIG.previousFinancialYear} figures, the latest the ATO has published; every other figure is {fy}.
          Distances assume this salary is your only income: the MLS, HECS-HELP and Division 293 tests also count items such as reportable fringe benefits and reportable super.
        </p>
      </section>

      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">How Does {s} Compare to Other Salary Levels?</h2>
        <Card className="overflow-hidden border-sandstone-dark/20 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone/30 text-navy font-semibold border-b border-sandstone-dark/20">
                <tr>
                  <th className="px-6 py-4">Gross Salary</th>
                  <th className="px-6 py-4 text-right">Income Tax</th>
                  <th className="px-6 py-4 text-right">Medicare Levy</th>
                  <th className="px-6 py-4 text-right">Take-Home Pay</th>
                  <th className="px-6 py-4 text-right">Effective Rate</th>
                  <th className="px-6 py-4 text-right">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {comparisons.map((c) => (
                  <tr key={c.salary} className={c.diff === 0 ? "bg-eucalyptus-light/40 border-l-4 border-eucalyptus font-medium" : "hover:bg-sandstone/30 transition-colors"}>
                    <td className="px-6 py-4">
                      {c.diff !== 0 && hasPage("tax-on", c.salary) ? (
                        <a href={salaryHref("tax-on", c.salary)} className={LINK}>{formatAUD(c.salary)}</a>
                      ) : (
                        formatAUD(c.salary)
                      )}
                      {c.diff === 0 && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sandstone text-navy">You are here</span>}
                    </td>
                    <td className="px-6 py-4 text-right text-warmgray">{formatAUD(c.b.netIncomeTax)}</td>
                    <td className="px-6 py-4 text-right text-warmgray">{formatAUD(c.b.medicareLevy)}</td>
                    <td className="px-6 py-4 text-right text-navy">{formatAUD(c.b.takeHomePay)}</td>
                    <td className="px-6 py-4 text-right text-warmgray">{pct1(c.b.effectiveTaxRate)}</td>
                    <td className="px-6 py-4 text-right">
                      {c.diff === 0 ? "—" : (
                        <span className={c.diff > 0 ? "text-eucalyptus font-medium" : "text-ochre font-medium"}>
                          {c.diff > 0 ? "+" : ""}
                          {formatAUD(c.diffToCurrent)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-4 text-sm text-warmgray">
          {comparisonRangeSentence(salary)} An extra $10,000 on {s} adds {formatAUD(plusTenK ? plusTenK.diffToCurrent : 0)} of take-home. Pages run in $5,000 steps; for any other figure use the{" "}
          <a href="/income-tax-calculator/" className={LINK}>income tax calculator</a>.
        </p>
        <div className="mt-6">
          <SalaryNav salary={salary} family="tax-on" />
        </div>
      </section>

      <div>
        <NextThousandTaxTable salary={salary} />
        <p className="mt-3 text-sm text-warmgray">{nextThousandSentence(salary)}</p>
      </div>

      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">Where {s} Sits Among Australian Earners</h2>
        <p className="text-navy leading-relaxed mb-3">{placementSentence(salary)}</p>
        <p className="text-navy leading-relaxed mb-3">{medianComparisonSentence(salary)}</p>
        <p className="text-navy leading-relaxed">
          {salary >= minWageAnnual
            ? `Counting full-time employees only, the ABS's $100-a-week band counts put ${s} ahead of ${
                ft.bandCeiling === null
                  ? `at least ${Math.round(ft.shareBelowFloor * 100)}%`
                  : Math.round(ft.shareBelowFloor * 100) === Math.round(ft.shareBelowCeiling * 100)
                    ? `about ${Math.round(ft.shareBelowFloor * 100)}%`
                    : `between ${Math.round(ft.shareBelowFloor * 100)}% and ${Math.round(ft.shareBelowCeiling * 100)}%`
              } of them.`
            : `A full-time adult on the National Minimum Wage earns about ${formatAUD(minWageAnnual)} a year (from 1 July 2026), so ${s} is usually a part-time or casual income, and the all-employee comparison above is the fair one.`}{" "}
          Full tables: <a href="/average-salary-australia/" className={LINK}>average salary in Australia</a>.
        </p>
        <h3 style={H2} className="text-xl font-bold text-navy mt-6 mb-3">Pay Close to {s}</h3>
        <p className="text-navy leading-relaxed">{benchmarkIntro(salary)}</p>
        {benchmarks.length > 0 && (
          <ul className="list-disc pl-5 mt-3 space-y-2 text-navy leading-relaxed">
            {benchmarks.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}
        <p className="text-navy leading-relaxed mt-4">{occupationIntro(salary)}</p>
        {occupations.length > 0 && (
          <ul className="list-disc pl-5 mt-3 space-y-2 text-navy leading-relaxed">
            {occupations.map((g) => (
              <li key={g.anzscoCode}>
                {g.jobs.map((j, i) => (
                  <React.Fragment key={j.href}>
                    {i > 0 && (i === g.jobs.length - 1 ? " and " : ", ")}
                    <a href={j.href} className={LINK}>{j.name}</a>
                  </React.Fragment>
                ))}{" "}
                ({g.anzscoTitle}): {formatAUD(g.annual)} a year ({formatAUD(g.weekly)} a week), {versus(g.annual, salary)}.
              </li>
            ))}
          </ul>
        )}
        {payPoints.length > 0 && (
          <>
            <p className="text-navy leading-relaxed mt-4">
              Public-sector pay points that round to {s}, from the state teacher and nursing scales on this site:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-navy leading-relaxed">
              {payPoints.map((p) => (
                <li key={p.id}>
                  <a href={p.href} className={LINK}>{p.state} {p.sector === "teacher" ? "teachers" : "nurses"}</a>, {p.scale}, {p.step}:{" "}
                  {formatAUD(p.annual)}, {versus(p.annual, salary)}.{p.effectiveFrom ? ` Rate applies from ${p.effectiveFrom}.` : ""}
                </li>
              ))}
            </ul>
          </>
        )}
        {awardRows.length > 0 && (
          <>
            <p className="text-navy leading-relaxed mt-4">
              Award minimums for full-time adults that round to {s} (Fair Work modern awards, as printed on our job pages):
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-navy leading-relaxed">
              {awardRows.map((a) => (
                <li key={a.id}>
                  <a href={a.href} className={LINK}>{a.award}</a>, {a.classification}: {formatAUD(a.annual)} a year, {versus(a.annual, salary)}.
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="bg-sandstone/30 rounded-xl p-8 border border-sandstone-dark/20">
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">Tax on {s} With a HECS-HELP Debt</h2>
        <p className="text-navy leading-relaxed">
          {facts.hecsBandIndex === 0
            ? `No compulsory repayment: ${s} is ${formatAUD(HECS_HELP.minimumThreshold - salary)} under the ${formatAUD(HECS_HELP.minimumThreshold)} repayment threshold for ${fy}, so take-home stays at ${formatAUD(breakdown.takeHomePay)}.`
            : facts.hecsBandIndex === HECS_HELP.bands.length - 1
              ? `The repayment is a flat ${Math.round(hecsBand.marginalRate * 100)}% of repayment income: ${formatAUD(withHecs.hecsRepayment)} a year (${formatAUD(withHecs.hecsRepayment / 52)} a week), cutting take-home from ${formatAUD(breakdown.takeHomePay)} to ${formatAUD(withHecs.takeHomePay)}.`
              : `The compulsory repayment is ${formatAUD(withHecs.hecsRepayment)} a year (${formatAUD(withHecs.hecsRepayment / 52)} a week) on the "${hecsBand.label}" band, cutting take-home from ${formatAUD(breakdown.takeHomePay)} to ${formatAUD(withHecs.takeHomePay)}. With the loan, ${pct1(facts.nextThousand.effectiveMarginalWithHecs)} of a $1,000 rise goes in tax, Medicare and repayments.`}{" "}
          <a href="/hecs-help-calculator/" className={LINK}>HECS-HELP calculator</a>
        </p>
      </section>

      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {taxOnSalaryFaqs(salary).map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i + 1}`} className="bg-white border rounded-lg px-4 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-warmgray pb-4 leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <MethodologyDisclosure>
        <p className="text-sm text-warmgray">
          ATO resident rates for {fy}; Medicare levy with the {SITE_CONFIG.previousFinancialYear} low-income thresholds; no surcharge or HECS-HELP in the headline figures; super at{" "}
          {Math.round(SUPER_GUARANTEE.rate * 100)}% on top of salary. The percentile is our straight-line estimate between published ABS points. Full method:{" "}
          <a href="/about/#methodology" className={LINK}>our methodology</a>.
        </p>
      </MethodologyDisclosure>
      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </div>
  );
}

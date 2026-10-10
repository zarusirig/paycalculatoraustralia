import React from "react";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  TAX_BRACKETS,
  SITE_CONFIG,
  SUPER_GUARANTEE,
} from "@/lib/constants/australian-tax";
import { WATO_SOURCES } from "@/lib/constants/tax-2027-28";
import { LISTO_CURRENT } from "@/lib/constants/listo";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { hasPage, salaryFacts, salaryHref } from "@/lib/data/salary-pages";
import { THRESHOLD_WINDOW, distanceText } from "@/lib/data/salary-pages/tax-on-thresholds";
import { rangeSections } from "@/lib/data/salary-pages/tax-on-ranges";
import { payPointsRoundingTo } from "@/lib/data/salary-pages/tax-on-pay-points";
import { awardMinimumsRoundingTo } from "@/lib/data/salary-pages/tax-on-occupations";
import { payBand, publishedPayGroups } from "@/lib/data/salary-pages/tax-on-published-pay";
import { salaryPercentile, EE_RELEASE, AWE_RELEASE } from "@/lib/data/average-salary";
import { taxOnSalaryFaqs } from "@/modules/programmatic/tax-on-salary-faqs";
import { RangeSections, TaxOnNav } from "@/modules/programmatic/tax-on-salary-ranges";
import { taxByYearLine } from "@/modules/programmatic/tax-on-salary-range-copy";
import {
  sacrificeSentence,
  nextThousandLine,
  occupationIntro,
  occupationGroupsNear,
  benchmarkIntro,
  benchmarkLines,
  bracketPositionSentence,
  comparisonCrossings,
  comparisonSentence,
  fullTimeMinimumWageAnnual,
  medianComparisonSentence,
  minimumWageHoursSentence,
  placementSentence,
  thresholdsBeyond,
  thresholdsIntro,
  thresholdsNote,
  nearThresholds,
} from "@/modules/programmatic/tax-on-salary-copy";
import FeaturedImage from "@/components/common/featured-image";

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus hover:text-navy transition-colors font-medium";
const LIST = "list-disc pl-5 mt-3 space-y-1 text-navy leading-relaxed";
const pct1 = (r: number) => `${(r * 100).toFixed(1)}%`;

interface TaxOnSalaryProps {
  salary: number;
}

const ATO = {
  rates: { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "ATO" },
  levy: { title: "Medicare levy", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: "ATO" },
  lito: { title: "Low income tax offset", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/offsets-and-rebates/low-income-tax-offset", publisher: "ATO" },
  levyReduction: { title: "Medicare levy reduction for low-income earners", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-reduction/medicare-levy-reduction-for-low-income-earners", publisher: "ATO" },
  mls: { title: "Medicare levy surcharge income, thresholds and rates", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/medicare-levy-surcharge-income-thresholds-and-rates", publisher: "ATO" },
  loans: { title: "Study and training support loans", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: "ATO" },
  div293: { title: "Division 293 tax on concessional contributions by high-income earners", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/division-293-tax-on-concessional-contributions-by-high-income-earners", publisher: "ATO" },
  wato: { title: "Working Australians tax offset", url: WATO_SOURCES.ato, publisher: "ATO" },
} satisfies Record<string, SourceLink>;

// /tax-on/[salary]/ — second pass 10 Oct 2026. The core answer (tax, Medicare,
// take-home, the bracket and take-home tables) is on every page. Everything
// else is there only where it applies at this salary: the range sections
// (offset, levy reduction, bracket edge, surcharge, HECS-HELP, Division 293;
// see tax-on-salary-ranges.tsx), the next-$1,000 breakdown only where its rate
// differs from the bracket rate plus levy, the comparison table only where a
// threshold falls inside it, the thresholds table and its caveats only for
// thresholds within $15,000, the median comparison only near a median, the
// concessional-cap room only where it is within $15,000 of running out, and
// the published pay figures closest to the salary. Passages that were the
// same on every page apart from the numbers (tax by year, the next-$1,000
// table, salary sacrifice, the "nearest occupation" sentences, the method
// note) are one line and a link each, or gone.
export function TaxOnSalary({ salary }: TaxOnSalaryProps) {
  const facts = salaryFacts(salary);
  const breakdown = facts.breakdown;
  const s = formatAUD(salary);
  const fy = SITE_CONFIG.financialYear;
  const employerSuper = facts.employerSuper;
  const sections = new Set(rangeSections(salary));

  const near = nearThresholds(salary);
  const note = thresholdsNote(salary);
  const comparisons =
    comparisonCrossings(salary).length > 0
      ? [-10000, -5000, 0, 5000, 10000]
          .filter((diff) => salary + diff > 0)
          .map((diff) => {
            const b = calculatePayBreakdown({ grossSalary: salary + diff });
            return { diff, salary: salary + diff, b, diffToCurrent: b.takeHomePay - breakdown.takeHomePay };
          })
      : [];

  const nextDiffers = Math.abs(facts.nextThousand.effectiveMarginal - breakdown.marginalTaxRate) > 0.001;
  const medians = medianComparisonSentence(salary);
  const ft = salaryPercentile(salary, "fullTime");
  const benchmarks = benchmarkLines(salary);
  const occupations = occupationGroupsNear(salary);
  const payPoints = payPointsRoundingTo(salary);
  const awardRows = awardMinimumsRoundingTo(salary);
  const published = publishedPayGroups(salary);
  const band = payBand(salary);
  const anyPay = benchmarks.length + occupations.length + payPoints.length + awardRows.length + published.length > 0;

  const SOURCES_LIST: SourceLink[] = [
    ATO.rates,
    ATO.levy,
    ...(sections.has("lito") ? [ATO.lito] : []),
    ...(sections.has("medicare") ? [ATO.levyReduction] : []),
    ...(sections.has("mls") ? [ATO.mls] : []),
    ...(sections.has("hecs") ? [ATO.loans] : []),
    ...(sections.has("div293") ? [ATO.div293] : []),
    ...(breakdown.netIncomeTax > 0 ? [ATO.wato] : []),
    { title: `${EE_RELEASE.title}, ${EE_RELEASE.referencePeriod}`, url: EE_RELEASE.url, publisher: "ABS" },
    ...(medians || benchmarks.length > 0 ? [{ title: `${AWE_RELEASE.title}, ${AWE_RELEASE.referencePeriod}`, url: AWE_RELEASE.url, publisher: "ABS" }] : []),
    ...occupations.map((g) => ({
      title: `${g.anzscoTitle} (ANZSCO ${g.anzscoCode}) occupation profile`,
      url: g.url,
      publisher: "Jobs and Skills Australia",
    })),
    ...published
      .flatMap((g) => g.items.map((p) => p.ref))
      .filter((r, i, all) => all.findIndex((x) => x.url === r.url) === i),
  ];

  // Salary sacrifice in one line; the concessional-cap room only where it is
  // within $15,000 of running out (from about $146,000).
  const sacrifice = facts.superCapped
    ? `That leaves ${formatAUD(facts.concessionalRoom)} of the ${formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap (${fy}) for salary sacrifice.`
    : facts.concessionalRoom < 1_000
      ? `Employer super leaves ${formatAUD(facts.concessionalRoom)} of the ${formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap (${fy}), too little for a $1,000 salary sacrifice.`
      : facts.concessionalRoom <= THRESHOLD_WINDOW
        ? `Only ${formatAUD(facts.concessionalRoom)} of the ${formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap (${fy}) is left after employer super for salary sacrifice.`
        : facts.sacrificeThousand.netGain <= 0
          ? `${sacrificeSentence(salary)}${
              salary <= LISTO_CURRENT.incomeThreshold
                ? ` Up to ${formatAUD(LISTO_CURRENT.incomeThreshold)} the low income super tax offset refunds ${Math.round(LISTO_CURRENT.rate * 100)}% of concessional contributions, at most ${formatAUD(LISTO_CURRENT.maxPayment)} a year (${LISTO_CURRENT.incomeYear}); employer super alone uses ${formatAUD(Math.min(LISTO_CURRENT.maxPayment, employerSuper * LISTO_CURRENT.rate))} of it.`
                : ""
            }`
          : "";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <section className="prose prose-eucalyptus max-w-none">
        <p className="text-lg text-navy leading-relaxed">{bracketPositionSentence(salary)}</p>
      </section>

      <TrustBar />
      <FeaturedImage lazy className="mt-0" />

      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">How Much Tax Do You Pay on {s}?</h2>
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
        <p className="mt-4 text-sm text-warmgray">
          {taxByYearLine(salary)} <a href="/tax-bracket-history/" className={LINK}>Tax bracket history</a>.
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
          .{sacrifice && ` ${sacrifice}`} <a href="/salary-sacrifice-calculator/" className={LINK}>Salary sacrifice calculator</a>.
        </p>
      </section>

      <RangeSections salary={salary} />

      {near.near.length === 0 ? (
        <p className="text-navy leading-relaxed">
          {thresholdsIntro(salary)} {thresholdsBeyond(salary)}
        </p>
      ) : (
        <section>
          <h2 style={H2} className="text-2xl font-bold text-navy mb-4">Tax Thresholds Near {s}</h2>
          <p className="text-navy leading-relaxed mb-4">{thresholdsIntro(salary)}</p>
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
          <p className="mt-4 text-navy leading-relaxed">{thresholdsBeyond(salary)}</p>
          {note && <p className="mt-3 text-sm text-warmgray">{note}</p>}
        </section>
      )}

      {nextDiffers && (
        <section>
          <h2 style={H2} className="text-2xl font-bold text-navy mb-4">Tax on the Next $1,000 Above {s}</h2>
          <p className="text-navy leading-relaxed">{nextThousandLine(salary)}</p>
        </section>
      )}

      <section>
        {comparisons.length > 0 && (
          <>
            <h2 style={H2} className="text-2xl font-bold text-navy mb-4">How Does {s} Compare to Other Salary Levels?</h2>
            <Card className="mb-4 overflow-hidden border-sandstone-dark/20 shadow-sm">
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
          </>
        )}
        <p className="text-sm text-warmgray">
          {comparisonSentence(salary)} Any other figure: <a href="/income-tax-calculator/" className={LINK}>income tax calculator</a>.
        </p>
        <TaxOnNav salary={salary} />
      </section>

      <section>
        <h2 style={H2} className="text-2xl font-bold text-navy mb-4">Where {s} Sits Among Australian Earners</h2>
        <p className="text-navy leading-relaxed">
          {placementSentence(salary)}
          {medians && ` ${medians}`}{" "}
          {salary >= fullTimeMinimumWageAnnual()
            ? `Among full-time employees only, ABS band counts put it ahead of ${
                ft.bandCeiling === null
                  ? `at least ${Math.round(ft.shareBelowFloor * 100)}%`
                  : Math.round(ft.shareBelowFloor * 100) === Math.round(ft.shareBelowCeiling * 100)
                    ? `about ${Math.round(ft.shareBelowFloor * 100)}%`
                    : `${Math.round(ft.shareBelowFloor * 100)}–${Math.round(ft.shareBelowCeiling * 100)}%`
              }.`
            : minimumWageHoursSentence(salary)}{" "}
          <a href="/average-salary-australia/" className={LINK}>Average salary in Australia</a>.
        </p>
        {anyPay && <h3 style={H2} className="text-xl font-bold text-navy mt-6 mb-3">Pay Close to {s}</h3>}
        {benchmarks.length > 0 && (
          <>
            <p className="text-navy leading-relaxed">{benchmarkIntro(salary)}</p>
            <ul className={LIST}>
              {benchmarks.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </>
        )}
        {occupations.length > 0 && (
          <>
            <p className="text-navy leading-relaxed mt-4">{occupationIntro(salary)}</p>
            <ul className={LIST}>
              {occupations.map((g) => (
                <li key={g.anzscoCode}>
                  {g.jobs.map((j, i) => (
                    <React.Fragment key={j.href}>
                      {i > 0 && (i === g.jobs.length - 1 ? " and " : ", ")}
                      <a href={j.href} className={LINK}>{j.name}</a>
                    </React.Fragment>
                  ))}{" "}
                  ({g.anzscoTitle}): {formatAUD(g.annual)}
                </li>
              ))}
            </ul>
          </>
        )}
        {payPoints.length > 0 && (
          <>
            <p className="text-navy leading-relaxed mt-4">State teacher and nursing pay points that round to {s}:</p>
            <ul className={LIST}>
              {payPoints.map((p) => (
                <li key={p.id}>
                  <a href={p.href} className={LINK}>{p.state} {p.sector === "teacher" ? "teachers" : "nurses"}</a>, {p.scale}, {p.step}: {formatAUD(p.annual)}
                </li>
              ))}
            </ul>
          </>
        )}
        {awardRows.length > 0 && (
          <>
            <p className="text-navy leading-relaxed mt-4">Full-time adult award minimums that round to {s}:</p>
            <ul className={LIST}>
              {awardRows.map((a) => (
                <li key={a.id}>
                  <a href={a.href} className={LINK}>{a.award}</a>, {a.classification}: {formatAUD(a.annual)}
                </li>
              ))}
            </ul>
          </>
        )}
        {published.length > 0 && band && (
          <>
            <p className="text-navy leading-relaxed mt-4">
              More published pay from {formatAUD(Math.ceil(band.lo))} to {formatAUD(Math.ceil(band.hi) - 1)}:
            </p>
            <ul className={LIST}>
              {published.map((g) => (
                <li key={g.measure}>
                  {g.measure}:{" "}
                  {g.items.map((p, i) => (
                    <React.Fragment key={p.id}>
                      {i > 0 && "; "}
                      <a href={p.href} className={LINK}>{p.who}</a> {formatAUD(p.annual)}
                    </React.Fragment>
                  ))}
                </li>
              ))}
            </ul>
          </>
        )}
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
          ATO resident rates for {fy}; headline figures leave out the surcharge and HECS-HELP. <a href="/about/#methodology" className={LINK}>Our methodology</a>.
        </p>
      </MethodologyDisclosure>
      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </div>
  );
}

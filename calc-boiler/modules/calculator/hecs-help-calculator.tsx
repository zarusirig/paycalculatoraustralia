"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import {
  calculatePayBreakdown,
  calculateHECS,
  formatAUD,
  annualToWeekly,
  HECS_HELP,
  HECS_HELP_2025_26,
  SITE_CONFIG,
  SOURCES,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Thresholds, rates and the repayment engine all come from HECS_HELP in
// lib/constants. This page previously carried its own copy of the FY2026-27
// bands and its own calculateHECS2627(); the two drifted apart the moment the
// thresholds were indexed. Never reintroduce a local threshold here.
const T = HECS_HELP.minimumThreshold;
const [, B1, B2, B3] = HECS_HELP.bands;

const ATO_THRESHOLDS_URL =
  "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds";
const ATO_TYPES_URL =
  "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/types-of-loans";
const ATO_OVERSEAS_URL =
  "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/overseas-repayments";

const SOURCES_LIST: SourceLink[] = [
  { title: "Study and training loan repayment thresholds and rates (QC16176)", url: ATO_THRESHOLDS_URL, publisher: SOURCES.ato.name },
  { title: "Types of loans (QC44853)", url: ATO_TYPES_URL, publisher: SOURCES.ato.name },
  { title: "Overseas obligations when repaying loans (QC47358)", url: ATO_OVERSEAS_URL, publisher: SOURCES.ato.name },
  { title: "Study and training loan indexation rates (QC18714)", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-indexation-rates", publisher: SOURCES.ato.name },
];

const BAND_ROWS = [
  { range: `${formatAUD(0)} – ${formatAUD(T)}`, rate: "Nil", how: "No compulsory repayment" },
  { range: `${formatAUD(B1.min)} – ${formatAUD(B1.max)}`, rate: "15%", how: `15c for each $1 over ${formatAUD(T)}` },
  { range: `${formatAUD(B2.min)} – ${formatAUD(B2.max)}`, rate: "17%", how: `${formatAUD(B2.base)} plus 17c for each $1 over ${formatAUD(B2.min - 1)}` },
  { range: `${formatAUD(B3.min)} and over`, rate: `${B3.marginalRate * 100}%`, how: `${B3.marginalRate * 100}% of total repayment income` },
];

/**
 * Every study and training support loan the ATO collects through the tax
 * system. All six are covered by the SAME thresholds and rates each year —
 * verified against the ATO's "Study and training loan repayment thresholds and
 * rates" page (QC16176, last updated 30 June 2026), which states: "All study
 * and training loan types are covered by the same set of thresholds and rates
 * applicable for each financial year."
 */
const LOAN_SCHEMES = [
  {
    code: "HELP",
    name: "Higher Education Loan Program",
    covers: "University student contributions and tuition fees. Includes HECS-HELP, FEE-HELP, OS-HELP and SA-HELP.",
    order: 1,
  },
  {
    code: "VSL",
    name: "VET Student Loan",
    covers: "Diploma-level and above vocational education and training with an approved provider.",
    order: 2,
  },
  {
    code: "SFSS",
    name: "Student Financial Supplement Scheme",
    covers: "Closed to new loans on 31 December 2003. Existing balances are still collected through the tax system.",
    order: 3,
  },
  {
    code: "SSL",
    name: "Student Start-up Loan",
    covers: "Higher education students receiving Youth Allowance or Austudy.",
    order: 4,
  },
  {
    code: "ABSTUDY SSL",
    name: "ABSTUDY Student Start-up Loan",
    covers: "Students receiving the ABSTUDY Living Allowance.",
    order: 5,
  },
  {
    code: "AASL",
    name: "Australian Apprenticeship Support Loan",
    covers: "Australian apprentices, paid over four years. Previously the Trade Support Loan (TSL). A 20% discount applies to the amount borrowed on successful completion.",
    order: 6,
  },
] as const;

export interface CalculatorFaq {
  q: string;
  a: string;
}

/**
 * FAQ copy is defined once in app/hecs-help-calculator/page.tsx and passed in,
 * so the rendered accordion, the sr-only mirror and the FAQPage JSON-LD all
 * read the same strings and cannot drift apart. (It cannot live in this file:
 * a Server Component importing a non-component export from a "use client"
 * module gets a client reference, not the array.)
 */
export default function HECSHelpCalculatorPage({ faqs }: { faqs: readonly CalculatorFaq[] }) {
  const [salary, setSalary] = useState(80_000);
  const authorship = getGuideAuthorship("hecs-help-calculator");

  const result = useMemo(() => {
    const hecsRepayment = calculateHECS(salary);
    // Income tax / Medicare come from the site's shared engine; the repayment
    // comes from calculateHECS, which is driven by HECS_HELP.bands.
    const breakdownNoHECS = calculatePayBreakdown({ grossSalary: salary, includeHECS: false });
    return {
      hecsRepayment,
      weeklyHECS: annualToWeekly(hecsRepayment),
      takeHomeWithHECS: breakdownNoHECS.takeHomePay - hecsRepayment,
      takeHomeWithoutHECS: breakdownNoHECS.takeHomePay,
    };
  }, [salary]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
              <li><span className="font-medium text-navy" aria-current="page">HECS Repayment Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            HECS Repayment Calculator Australia {SITE_CONFIG.financialYear}
          </h1>
          <p className="text-lg text-warmgray">
            Work out your compulsory repayment for {SITE_CONFIG.financialYear} on any study or training support loan — HELP, VSL, SFSS, SSL, ABSTUDY SSL or AASL. They all share one threshold of {formatAUD(T)}, and the marginal system charges only on the income above it.
          </p>
          <p className="text-sm text-warmgray-light mt-2">Updated {SITE_CONFIG.lastVerified} — {SITE_CONFIG.financialYear} thresholds applied.</p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">Repayment income (gross annual)</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={500000} step={1000} value={salary}
                        onChange={(e) => setSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={300000} step={5000} value={clamp(salary, 0, 300000)}
                      onChange={(e) => setSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                  </div>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate HECS Repayment</button>
                </form>

                <Card className="bg-sandstone border-0 shadow-none" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your HECS Repayment ({SITE_CONFIG.financialYear})</h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span className="text-warmgray">Repayment income</span><span className="font-bold text-navy">{formatAUD(salary)}</span></div>
                      <div className="border-t border-sandstone-dark/20" />
                      {salary <= T ? (
                        <div className="bg-eucalyptus-light/30 rounded-lg p-3 text-center">
                          <p className="text-eucalyptus-dark font-semibold">No compulsory repayment</p>
                          <p className="text-xs text-warmgray-light mt-1">{SITE_CONFIG.financialYear} threshold: {formatAUD(T)}</p>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between">
                            <span className="text-warmgray">Income above threshold</span>
                            <span className="font-medium text-navy">{formatAUD(salary - T)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-navy">Annual compulsory repayment</span>
                            <span className="text-xl font-bold text-ochre">{formatAUD(result.hecsRepayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-warmgray-light">Per week impact</span>
                            <span className="text-warmgray-light">{formatAUD(result.weeklyHECS, 2)}/week</span>
                          </div>
                          <div className="border-t border-sandstone-dark/20" />
                          <div className="flex justify-between">
                            <span className="text-warmgray">Take-home (without HECS)</span>
                            <span className="font-medium text-navy">{formatAUD(result.takeHomeWithoutHECS)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-semibold text-navy">Take-home (with HECS)</span>
                            <span className="font-bold text-eucalyptus-dark">{formatAUD(result.takeHomeWithHECS)}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Rates */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>HECS Repayment Rates {SITE_CONFIG.financialYear}</h2>
            <p className="mb-4 text-warmgray">
              The minimum repayment threshold for {SITE_CONFIG.financialYear} is <strong>{formatAUD(T)}</strong>, up from {formatAUD(HECS_HELP_2025_26.minimumThreshold)} in {SITE_CONFIG.previousFinancialYear}. Since 1 July 2025 the rates apply marginally, so only the income above the threshold is charged.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-navy">Repayment income ({SITE_CONFIG.financialYear})</th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-navy">Rate</th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-navy">How it&apos;s calculated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {BAND_ROWS.map((band) => (
                    <tr key={band.range} className="hover:bg-sandstone">
                      <td className="px-4 py-3 text-navy tabular-nums">{band.range}</td>
                      <td className="px-4 py-3 font-medium text-navy">{band.rate}</td>
                      <td className="px-4 py-3 text-warmgray">{band.how}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray-light">
              <strong>Repayment income</strong> is taxable income plus reportable fringe benefits, total net investment loss, reportable super contributions and exempt foreign employment income. For the threshold on its own — including what changed this year — see our{" "}
              <Link href="/hecs-repayment-threshold/" className="text-eucalyptus-dark hover:underline font-medium">HECS repayment threshold {SITE_CONFIG.financialYear}</Link> page.
            </p>
          </section>

          {/* ALL LOAN SCHEMES — the consolidation section */}
          <section id="loan-schemes">
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Every Study and Training Loan This Covers</h2>
            <p className="mb-4 text-warmgray">
              There is no separate HECS calculation. The ATO states that <strong>all study and training loan types are covered by the same set of thresholds and rates</strong> for each financial year, so the figure above is your compulsory repayment whichever of the six loans you hold — and it is a single repayment even if you hold several.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-navy">Loan</th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-navy">What it covers</th>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-navy">Repaid in order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {LOAN_SCHEMES.map((loan) => (
                    <tr key={loan.code} className="hover:bg-sandstone">
                      <td className="px-4 py-3 align-top">
                        <span className="font-bold text-navy block">{loan.code}</span>
                        <span className="text-xs text-warmgray-light">{loan.name}</span>
                      </td>
                      <td className="px-4 py-3 text-warmgray align-top">{loan.covers}</td>
                      <td className="px-4 py-3 text-navy align-top tabular-nums">{loan.order}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray-light">
              ATO, <a href={ATO_THRESHOLDS_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">Study and training loan repayment thresholds and rates</a> and <a href={ATO_TYPES_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">Types of loans</a>. Loan fee and lifetime limit rules differ by scheme and are set by the Department of Education, not the ATO — check <a href="https://www.studyassist.gov.au/" target="_blank" rel="noopener noreferrer" className="hover:underline">Study Assist</a> before relying on a fee figure.
            </p>

            <h3 className="text-xl font-semibold text-navy mt-6 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>If You Hold More Than One Loan</h3>
            <p className="mb-3 text-warmgray">
              You make one compulsory repayment, worked out on your total repayment income. The ATO then applies it to your loans in the fixed order in the table: HELP first, then VSL, SFSS, SSL, ABSTUDY SSL and AASL last. Holding two loans does not double the repayment; it only changes which balance falls first.
            </p>

            <h3 className="text-xl font-semibold text-navy mt-6 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Living Overseas</h3>
            <p className="mb-3 text-warmgray">
              The overseas obligation is narrower than the repayment rules. It applies to <strong>HELP, VSL and AASL</strong> debts only. If you reside outside Australia for 183 days or more in any 12-month period you must lodge an <em>overseas travel notification</em> within 7 days of leaving, then report your worldwide income by <strong>31 October</strong> each year. If your worldwide income is at or below 25% of the minimum repayment threshold, you lodge a non-lodgment advice instead. The same thresholds and rates then apply to that worldwide income.
            </p>
            <p className="text-sm text-warmgray">
              Full detail: ATO, <a href={ATO_OVERSEAS_URL} target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline font-medium">Overseas obligations when repaying loans</a>.
            </p>
          </section>

          {/* How calculated */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Are HECS Repayments Calculated?</h2>
            <ol className="list-decimal pl-5 text-warmgray space-y-2 mb-4">
              <li>Work out repayment income: taxable income plus the four add-backs above.</li>
              <li>Compare it to <strong>{formatAUD(T)}</strong>. At or below that, the compulsory repayment is <strong>$0</strong>.</li>
              <li>From {formatAUD(B1.min)} to {formatAUD(B1.max)}, repay <strong>15 cents per dollar</strong> above {formatAUD(T)}.</li>
              <li>From {formatAUD(B2.min)} to {formatAUD(B2.max)}, repay <strong>{formatAUD(B2.base)}</strong> plus <strong>17 cents per dollar</strong> above {formatAUD(B2.min - 1)}.</li>
              <li>From {formatAUD(B3.min)}, repay <strong>{B3.marginalRate * 100}% of total repayment income</strong> — the one band that is not marginal.</li>
            </ol>
            <div className="bg-sandstone rounded-xl p-5 mb-3">
              <p className="text-sm text-navy font-mono">
                ({formatAUD(85_000)} &minus; {formatAUD(T)}) &times; 0.15 = <strong>{formatAUD(calculateHECS(85_000))}</strong> per year
              </p>
              <p className="text-sm text-warmgray mt-2">
                Weekly impact: <strong>{formatAUD(annualToWeekly(calculateHECS(85_000)), 2)}</strong> per week
              </p>
            </div>
            <p className="text-sm text-warmgray">
              Use our <Link href="/" className="text-eucalyptus-dark hover:underline font-medium">Pay Calculator</Link> to see the repayment inside a full after-tax breakdown with income tax, the Medicare levy and superannuation.
            </p>
          </section>

          {/* Take-home impact */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does HECS Affect Your Take-Home Pay?</h2>
            <p className="mb-4 text-warmgray">
              Between {formatAUD(75_000)} and {formatAUD(120_000)}, the compulsory repayment costs <strong>{formatAUD(annualToWeekly(calculateHECS(75_000)), 2)}</strong> to <strong>{formatAUD(annualToWeekly(calculateHECS(120_000)), 2)}</strong> a week.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left font-semibold text-navy">Repayment income</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold text-navy">Repayment</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold text-navy">Per week</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold text-navy">Take-home (with)</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold text-navy">Take-home (without)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[65_000, T, 72_000, 75_000, 80_000, 90_000, 100_000, 120_000].map((s) => {
                    const hecs = calculateHECS(s);
                    const bpNo = calculatePayBreakdown({ grossSalary: s, includeHECS: false });
                    return (
                      <tr key={s} className="hover:bg-sandstone">
                        <td className="px-4 py-3 font-medium text-navy tabular-nums">{formatAUD(s)}</td>
                        <td className="px-4 py-3 text-right text-navy tabular-nums">{formatAUD(hecs)}</td>
                        <td className="px-4 py-3 text-right text-warmgray-light tabular-nums">{formatAUD(annualToWeekly(hecs), 2)}</td>
                        <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark tabular-nums">{formatAUD(bpNo.takeHomePay - hecs)}</td>
                        <td className="px-4 py-3 text-right text-warmgray tabular-nums">{formatAUD(bpNo.takeHomePay)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray-light">
              Nothing is payable at {formatAUD(65_000)} or at the {formatAUD(T)} threshold itself. Moving to {formatAUD(72_000)} costs {formatAUD(calculateHECS(72_000))} for the year ({formatAUD(annualToWeekly(calculateHECS(72_000)), 2)}/week) — the marginal system removed the old cliff, where a dollar over the line triggered a percentage of your <em>entire</em> income.{" "}
              <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Take-Home Pay Calculator</Link> gives the full net pay breakdown.
            </p>
          </section>

          {/* STSL vs assessment */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Why Your Payslip Deduction Differs From Your Actual Repayment</h2>
            <p className="mb-3 text-warmgray">
              The amount withheld each pay is an <strong>estimate</strong>. Employers withhold an additional PAYG component — shown as <strong>STSL</strong> on most payslips — from ATO withholding schedules, based on that pay period&apos;s earnings alone.
            </p>
            <p className="mb-3 text-warmgray">
              Your actual compulsory repayment is only worked out when you lodge, using full-year repayment income. If your pay varied, or you had investment losses, reportable fringe benefits or reportable super, the two will not match, and the difference is settled through your refund or tax bill.
            </p>
            <p className="text-sm text-warmgray">
              See <Link href="/stsl-on-payslip/" className="text-eucalyptus-dark hover:underline font-medium">STSL on your payslip</Link> for a worked payslip example and how to stop the deduction once the loan is cleared.
            </p>
          </section>

          {/* Indexation & voluntary repayments */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Indexation and Voluntary Repayments</h2>
            <p className="mb-3 text-warmgray">
              Study loans carry no interest. Instead the ATO applies indexation on <strong>1 June</strong> each year to the part of the balance unpaid for more than 11 months, at the lower of CPI or the Wage Price Index. On {HECS_HELP.indexationDate} the rate was <strong>{HECS_HELP.indexationRate * 100}%</strong> — read more on <Link href="/news/hecs-indexation-2026/" className="text-eucalyptus-dark hover:underline font-medium">HECS indexation 2026</Link>.
            </p>
            <p className="mb-3 text-warmgray">
              A voluntary repayment only reduces the indexed amount if it lands <em>before</em> 1 June. Beyond that timing point the case for paying early is a straight comparison: {HECS_HELP.indexationRate * 100}% indexation against what the money would earn or save elsewhere. Credit cards, car loans and personal loans all cost more, so they come first.
            </p>
            <p className="text-sm text-warmgray">
              Weighing it against super instead? See <Link href="/extra-super-vs-hecs-repayment/" className="text-eucalyptus-dark hover:underline font-medium">extra super vs HECS repayment</Link>.
            </p>
          </section>

          {/* Common mistakes */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Common HECS Mistakes</h2>
            <ol className="list-decimal pl-5 text-warmgray space-y-3">
              <li>
                <strong>Not telling your employer about the loan.</strong> Without the declaration there is no STSL withholding at all, and the whole repayment — {formatAUD(calculateHECS(80_000))} on {formatAUD(80_000)} — arrives as a lump sum at tax time.
              </li>
              <li>
                <strong>Using salary instead of repayment income.</strong> A wage of {formatAUD(66_000)} with {formatAUD(5_000)} of reportable super is repayment income of {formatAUD(71_000)} — above the {formatAUD(T)} threshold.
              </li>
              <li>
                <strong>Assuming salary sacrifice removes the repayment.</strong> Reportable super contributions are added back, so the benefit is small. Model it with the <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">salary sacrifice calculator</Link>.
              </li>
              <li>
                <strong>Paying voluntarily on 2 June.</strong> Indexation has already been applied to the 1 June balance. A day earlier would have reduced it.
              </li>
              <li>
                <strong>Forgetting the overseas obligation.</strong> A HELP, VSL or AASL debt still has to be reported from abroad, and the travel notification is due within 7 days of leaving.
              </li>
            </ol>
          </section>

          {/* Related */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators and Guides</h2>
            <ul className="list-disc pl-5 text-warmgray space-y-2">
              <li><Link href="/hecs-repayment-threshold/" className="text-eucalyptus-dark hover:underline font-medium">HECS repayment threshold {SITE_CONFIG.financialYear}</Link> &mdash; the threshold and rate table on its own.</li>
              <li><Link href="/hecs-help-guide/" className="text-eucalyptus-dark hover:underline font-medium">HECS-HELP guide</Link> &mdash; how the loan works, indexation history, voluntary repayments and living overseas.</li>
              <li><Link href="/stsl-on-payslip/" className="text-eucalyptus-dark hover:underline font-medium">STSL on your payslip</Link> &mdash; how the withholding is worked out each pay.</li>
              <li><Link href="/extra-super-vs-hecs-repayment/" className="text-eucalyptus-dark hover:underline font-medium">Extra super vs HECS repayment</Link> &mdash; where a spare dollar does more work.</li>
              <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Take-home pay calculator</Link> &mdash; net pay with or without a study loan.</li>
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income tax calculator</Link> &mdash; brackets and your marginal rate.</li>
            </ul>
          </section>

          {/* FAQ */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            {/* Radix unmounts closed accordion content, so the answers would never
                reach the rendered HTML. This mirror makes them crawlable. */}
            <div className="sr-only">
              <h3>HECS repayment calculator questions and answers</h3>
              {faqs.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
            </div>
            <Accordion type="multiple" className="space-y-3">
              {faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">{f.a}</p></AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* CTA */}
          <section className="bg-sandstone rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See your full pay breakdown</h2>
            <p className="text-warmgray mb-6 max-w-lg mx-auto">Income tax, Medicare, study loan and super in one calculation.</p>
            <Link href="/" className="inline-flex items-center bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">Pay Calculator <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </section>

          <MethodologyDisclosure>
            <ol className="list-decimal space-y-1 pl-4">
              <li>Repayment income is compared to the {formatAUD(T)} minimum threshold for {SITE_CONFIG.financialYear}.</li>
              <li>15c per $1 over {formatAUD(T)}, up to {formatAUD(B1.max)}.</li>
              <li>{formatAUD(B2.base)} plus 17c per $1 over {formatAUD(B2.min - 1)}, up to {formatAUD(B2.max)}.</li>
              <li>{B3.marginalRate * 100}% of total repayment income from {formatAUD(B3.min)}.</li>
              <li>Thresholds, rates and the loan list are read from one constants file shared with every page on this site, and reconcile to the ATO&rsquo;s worked example: {formatAUD(137_064)} of repayment income gives {formatAUD(B2.base)} + {formatAUD(1_248.99, 2)} = {formatAUD(10_276.99, 2)}.</li>
            </ol>
          </MethodologyDisclosure>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
          {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
        </div>
      </div>
    </div>
  );
}

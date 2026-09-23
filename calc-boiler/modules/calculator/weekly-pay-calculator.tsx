"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RelatedSearches, type RelatedSearch } from "@/modules/seo/related-searches";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  formatPercent,
  SUPER_GUARANTEE,
  HECS_HELP,
  MEDICARE_LEVY,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";
import { bracketRateList, hecsBandsSentence } from "@/modules/calculator/fy-rate-copy";
import { AmountPresets, convertPeriod, HeadTermLinks, PERIODS_PER_YEAR, PeriodToggle, type EntryPeriod } from "@/modules/calculator/head-term-ui";
import FaqAccordion from "@/components/common/faq-accordion";
import { WEEKLY_PAY_FAQS, WEEKLY_TAX_ANSWER, WEEKLY_WITHHOLDING_ROWS } from "./weekly-pay-calculator-faqs";

// Worked-example figures, computed from the tax engine so the copy rolls over
// with the constants (it had frozen at FY2025-26 16%-bracket numbers).
const EX = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: false, hasPrivateHealth: true });
const EX_70K = calculatePayBreakdown({ grossSalary: 70_000, includeHECS: false, hasPrivateHealth: true });
const EX_180K = calculatePayBreakdown({ grossSalary: 180_000, includeHECS: false, hasPrivateHealth: true });
const EX_WEEKLY_GAP = 80_000 / 52 - EX.weekly;
const MLS = MEDICARE_LEVY.surcharge;

const ANNUAL_PRESETS = [50_000, 75_000, 100_000, 150_000] as const;
const PERIOD_PRESETS = [1_000, 1_500, 2_000, 2_500] as const;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Google AU "related searches" for "weekly pay calculator" and "weekly pay
// after tax calculator" (Sept 2026), each pointed at the page that answers it.
const RELATED_SEARCHES: readonly RelatedSearch[] = [
  { label: "Weekly tax table", href: "/weekly-tax-table/" },
  { label: "Tax per week calculator ATO", href: "/tax-withheld-calculator/" },
  { label: "Fortnightly pay calculator", href: "/fortnightly-pay-calculator/" },
  { label: "Pay calculator hourly rate", href: "/hourly-to-annual-salary-calculator/" },
  { label: "Take home pay calculator", href: "/take-home-pay-calculator/" },
  { label: "Casual pay calculator", href: "/casual-loading-calculator/" },
];

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "PAYG withholding weekly tax table", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-table-weekly", publisher: SOURCES.ato.name },
];

export default function WeeklyPayCalculatorPage() {
  // "weekly tax calculator" searchers know their weekly pay, not their salary
  // (the ATO tax withheld calculator and paycalculator.com.au both take a
  // weekly amount), so weekly entry is offered alongside annual salary.
  const [period, setPeriod] = useState<EntryPeriod>("annual");
  const [amount, setAmount] = useState(80_000);
  const salary = Math.round(amount * PERIODS_PER_YEAR[period]);
  const [includeHECS, setIncludeHECS] = useState(false);

  const result = useMemo(
    () => calculatePayBreakdown({ grossSalary: salary, includeHECS, hasPrivateHealth: true }),
    [salary, includeHECS]
  );

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        {/* Compact hero: calculator above the fold (head-term intent map, Sep 2026). */}
        <section className="bg-eucalyptus-light/40 rounded-2xl p-5 md:p-8 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Weekly Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl md:text-4xl font-bold text-navy mt-3 mb-2">Weekly Pay &amp; Tax Calculator Australia {SITE_CONFIG.financialYear}</h1>
          <p className="text-base md:text-lg text-navy">
            Weekly pay is your annual salary divided by <strong>52</strong>. On <strong>$80,000</strong> that is {formatAUD(80_000 / 52, 2)} gross
            and <strong>{formatAUD(EX.weekly, 2)} take-home</strong> every week after income tax and Medicare in FY{SITE_CONFIG.financialYear}.
          </p>
          <p className="text-warmgray mt-2 text-sm md:text-base">Use it as a weekly tax calculator: enter your weekly pay or annual salary.</p>
          <TrustBar className="mt-3" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="sr-only md:not-sr-only md:block text-2xl font-semibold text-navy md:mb-4 text-center">Calculate Your Weekly Tax &amp; Take-Home Pay</h2>
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                  <PeriodToggle periods={["weekly", "annual"]} value={period} label="I'm entering my gross"
                    onChange={(p) => { setAmount(convertPeriod(amount, period, p)); setPeriod(p); }} />
                  <div>
                    <label htmlFor="salary" className="block text-sm font-medium text-navy mb-1">{period === "annual" ? "Gross annual salary" : "Gross weekly pay (before tax)"}</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="salary" min={0} max={period === "annual" ? 500000 : Math.round(500000 / 52)} step={period === "annual" ? 1000 : 1} value={amount}
                        onChange={(e) => setAmount(clamp(Number(e.target.value || 0), 0, period === "annual" ? 500000 : Math.round(500000 / 52)))}
                        className="block w-full rounded-md border-sandstone-dark/30 text-lg font-semibold shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    {period === "annual" && (
                      <input type="range" min={0} max={300000} step={5000} value={clamp(amount, 0, 300000)}
                        onChange={(e) => setAmount(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                    )}
                    <AmountPresets values={period === "annual" ? ANNUAL_PRESETS : PERIOD_PRESETS} current={amount} onPick={setAmount} />
                    {/* Mobile: the result card stacks below the form, so surface the answer here too. */}
                    <p className="mt-3 rounded-lg bg-eucalyptus-light/40 px-3 py-2 text-sm text-navy md:hidden" aria-hidden="true">
                      Tax: <strong className="text-ochre">{formatAUD((result.netIncomeTax + result.medicareLevy) / 52, 2)}</strong>/week · take-home <strong className="text-eucalyptus-dark">{formatAUD(result.weekly, 2)}</strong>
                    </p>
                    <p className="mt-1 text-xs text-warmgray-light">{period === "annual" ? `= ${formatAUD(salary / 52, 2)} gross a week` : `= ${formatAUD(salary)} a year`}</p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeHECS} onChange={(e) => setIncludeHECS(e.target.checked)}
                      className="h-4 w-4 rounded border-sandstone-dark/30 text-eucalyptus" />
                    <span className="text-navy">Include HECS-HELP debt</span>
                  </label>
                  <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 rounded-lg shadow-md transition-all">Calculate Weekly Pay</button>
                </form>

                <Card className="bg-sandstone border-eucalyptus/30 border-2 shadow-sm" role="region" aria-live="polite">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-navy mb-4">Your Weekly Breakdown</h3>
                    <div className="space-y-2.5 text-sm">
                      <Row label="Gross Weekly Pay" value={formatAUD(salary / 52, 2)} bold />
                      <div className="border-t border-sandstone-dark/20" />
                      <Row label="Income Tax" value={formatNegAUD(result.netIncomeTax / 52, 2)} />
                      <Row label="Medicare Levy" value={formatNegAUD(result.medicareLevy / 52, 2)} />
                      {result.medicareSurcharge > 0 && <Row label="Medicare Surcharge" value={formatNegAUD(result.medicareSurcharge / 52, 2)} />}
                      {includeHECS && <Row label="HECS Repayment" value={formatNegAUD(result.hecsRepayment / 52, 2)} />}
                      <div className="border-t border-sandstone-dark/20" />
                      <div className="flex justify-between items-baseline pt-2 pb-2">
                        <span className="font-bold text-navy">Weekly Take-Home</span>
                        <span className="text-3xl font-extrabold text-eucalyptus-dark">{formatAUD(result.weekly, 2)}</span>
                      </div>
                      <div className="border-t border-sandstone-dark/20 pt-2 text-xs">
                        <Row label="Annual Equivalent" value={formatAUD(result.takeHomePay)} />
                        <Row label={`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)} - employer paid)`} value={`+${formatAUD(result.superContribution / 52, 2)}/wk`} sub />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        <HeadTermLinks className="max-w-4xl mx-auto -mt-6" terms={["payCalculatorAustralia", "salaryCalculator", "takeHomePayCalculator", "incomeTaxCalculator", "fortnightlyTaxCalculator"]} />

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Weekly Pay Calculated in Australia?</h2>
            <p className="text-warmgray mb-4">
              Weekly take-home pay equals your gross annual salary divided by 52, minus PAYG income tax, the Medicare levy, and any HECS-HELP repayments withheld each week.
            </p>
            <p className="text-warmgray mb-4">
              The ATO requires employers to use PAYG (Pay As You Go) withholding tables that spread your total annual tax liability evenly across 52 pay periods. Your employer calculates the weekly amount using the published <Link href="/weekly-tax-table/" className="text-eucalyptus-dark hover:underline">weekly tax table</Link>, which accounts for the tax-free threshold of <strong>$18,200</strong>, the &quot;Low Income Tax Offset&quot; (LITO) of up to <strong>$700</strong>, and the applicable marginal tax rates.
            </p>
            <p className="text-warmgray mb-4">
              The calculation follows 4 steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-warmgray mb-4">
              <li><strong>Gross weekly pay:</strong> Divide your annual salary by 52. An <strong>$80,000</strong> salary produces gross weekly pay of <strong>$1,538.46</strong>.</li>
              <li><strong>Income tax:</strong> Apply the FY{SITE_CONFIG.financialYear} income tax brackets to your annual salary, then divide the total tax by 52. At $80,000, annual income tax is <strong>{formatAUD(EX.netIncomeTax)}</strong>, or <strong>{formatAUD(EX.netIncomeTax / 52, 2)}</strong> per week.</li>
              <li><strong>Medicare levy:</strong> Calculate <strong>2%</strong> of your gross weekly pay. At $80,000, the Medicare levy costs <strong>$30.77</strong> per week.</li>
              <li><strong>HECS-HELP:</strong> If you carry a student loan and earn above the minimum repayment threshold of <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong>, the repayment amount is withheld proportionally each week.</li>
            </ol>
            <p className="text-warmgray">
              Superannuation of {formatPercent(SUPER_GUARANTEE.rate, 0)} is paid by your employer on top of your salary and does not reduce your weekly take-home pay. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to see the exact dollar amount your employer contributes each week.
            </p>
          </section>

          {/* PAA: "How much is $1200 a week taxed in Australia?", "How much tax do I pay
              if I earn $1500 a week?", "$750 a week" */}
          <section id="tax-each-week">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Much Tax Is Taken Out of My Weekly Pay?</h2>
            <p className="text-warmgray mb-4">{WEEKLY_TAX_ANSWER.a}</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <caption className="sr-only">Tax withheld per week, FY{SITE_CONFIG.financialYear}, tax-free threshold claimed</caption>
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Gross per week</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Tax withheld</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Take-home</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Yearly equivalent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {WEEKLY_WITHHOLDING_ROWS.map((r) => (
                    <tr key={r.gross}>
                      <td className="px-4 py-3 text-navy font-medium">{formatAUD(r.gross)}</td>
                      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(r.withheld)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(r.net)}</td>
                      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(r.annual)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray">
              ATO weekly tax table amounts for a resident claiming the tax-free threshold, no HECS-HELP debt. See every $1 step on the <Link href="/weekly-tax-table/" className="text-eucalyptus-dark hover:underline">weekly tax table</Link>.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Weekly Pay Table by Annual Salary</h2>
            <p className="text-warmgray mb-4">
              An Australian resident earning <strong>$70,000</strong> per year takes home <strong>{formatAUD(EX_70K.weekly)}</strong> per week after tax and Medicare in FY{SITE_CONFIG.financialYear}.
            </p>
            <p className="text-warmgray mb-4">
              The table below shows weekly gross pay, weekly tax withheld, and weekly take-home pay at 6 common salary levels. All figures assume an Australian resident claiming the tax-free threshold with no HECS-HELP debt and no salary sacrifice arrangements.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Annual Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Gross Weekly</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Weekly Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Weekly Take-Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <ComparisonRow salary={50000} />
                  <ComparisonRow salary={70000} />
                  <ComparisonRow salary={90000} />
                  <ComparisonRow salary={110000} />
                  <ComparisonRow salary={140000} />
                  <ComparisonRow salary={180000} />
                </tbody>
              </table>
            </div>
            <p className="text-warmgray text-sm mt-3">
              Higher earners face steeper marginal rates. A worker on <strong>$180,000</strong> loses <strong>{formatPercent(EX_180K.marginalTaxRate, 0)}</strong> of each additional dollar to income tax and Medicare, against {formatPercent(EX_70K.marginalTaxRate, 0)} for someone earning $70,000. For a complete breakdown of income tax brackets, visit our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link>.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Uses a Weekly Pay Calculator?</h2>
            <p className="text-warmgray mb-4">
              Employees paid on a weekly cycle, casual workers, and budget planners use a weekly pay calculator to convert annual salary figures into usable weekly amounts.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray">
              <li><strong>Weekly-paid employees:</strong> Retail, hospitality, and construction workers are commonly paid each week under their Modern Award. A weekly calculator confirms the exact net amount expected on each pay slip.</li>
              <li><strong>Casual workers:</strong> Casuals receiving an hourly rate plus a 25% casual loading benefit from converting their expected hours into a weekly after-tax figure. Our <Link href="/hourly-to-annual-salary-calculator/" className="text-eucalyptus-dark hover:underline">Hourly to Annual Salary Calculator</Link> handles this conversion.</li>
              <li><strong>Budget planners:</strong> Many household expenses, including rent, groceries, and transport, are billed weekly. Knowing the precise weekly take-home amount makes allocating funds across those 3 cost categories straightforward.</li>
              <li><strong>Job seekers:</strong> Comparing job offers quoted as annual salaries becomes easier when broken down to a weekly net figure, particularly when evaluating roles across different pay frequencies.</li>
              <li><strong>Contractors considering PAYG employment:</strong> Sole traders transitioning to permanent roles use this calculator to compare their current invoiced income against a weekly after-tax salary. See our <Link href="/contractor-vs-employee-calculator/" className="text-eucalyptus-dark hover:underline">Contractor vs Employee Calculator</Link> for a side-by-side comparison.</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Does Weekly Pay Compare to Fortnightly and Monthly Pay?</h2>
            <p className="text-warmgray mb-4">
              Weekly pay divides your annual salary into 52 payments, fortnightly pay into 26 payments, and monthly pay into 12 payments. The annual take-home total is identical regardless of frequency.
            </p>
            <p className="text-warmgray mb-4">
              The key difference lies in cash flow timing and budgeting. Weekly pay provides the most frequent income, which suits employees who manage expenses on a week-to-week basis. Fortnightly pay is the most common cycle in Australia, used by approximately 45% of employers. Monthly pay is standard for salaried professionals in corporate, government, and finance sectors.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Attribute</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Weekly</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Fortnightly</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Monthly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Pay periods per year</td>
                    <td className="px-4 py-3 text-center text-warmgray"><strong>52</strong></td>
                    <td className="px-4 py-3 text-center text-warmgray"><strong>26</strong></td>
                    <td className="px-4 py-3 text-center text-warmgray"><strong>12</strong></td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Gross per period ($80k salary)</td>
                    <td className="px-4 py-3 text-center text-warmgray">$1,538</td>
                    <td className="px-4 py-3 text-center text-warmgray">$3,077</td>
                    <td className="px-4 py-3 text-center text-warmgray">$6,667</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Best suited for</td>
                    <td className="px-4 py-3 text-center text-warmgray">Casual &amp; award workers</td>
                    <td className="px-4 py-3 text-center text-warmgray">Most PAYG employees</td>
                    <td className="px-4 py-3 text-center text-warmgray">Salaried professionals</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Budgeting ease</td>
                    <td className="px-4 py-3 text-center text-warmgray">Easiest (matches weekly bills)</td>
                    <td className="px-4 py-3 text-center text-warmgray">Moderate</td>
                    <td className="px-4 py-3 text-center text-warmgray">Harder (large gaps between pays)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              To view your pay at other frequencies, use our <Link href="/fortnightly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Fortnightly Pay Calculator</Link> or <Link href="/monthly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Monthly Pay Calculator</Link>.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Deductions Apply to Your Weekly Pay?</h2>
            <p className="text-warmgray mb-4">
              Three mandatory deductions reduce your gross weekly pay: PAYG income tax, the Medicare levy of <strong>2%</strong>, and HECS-HELP repayments if your income exceeds <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong>.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">PAYG Income Tax</h3>
            <p className="text-warmgray mb-4">
              PAYG withholding is the largest weekly deduction for most Australian workers. The FY{SITE_CONFIG.financialYear} tax brackets apply marginal rates of {bracketRateList()}, starting above the tax-free threshold. Your employer withholds 1/52nd of your estimated annual tax each week. The &quot;Low Income Tax Offset&quot; reduces tax by up to <strong>$700</strong> for incomes below <strong>$66,667</strong>.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Medicare Levy and Surcharge</h3>
            <p className="text-warmgray mb-4">
              The Medicare levy is <strong>2%</strong> of your taxable income, withheld weekly. Under the 2025-26 thresholds (the latest the ATO has published), singles with taxable income up to <strong>{formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}</strong> pay no levy, and it phases in up to {formatAUD(MEDICARE_LEVY.shadeInThreshold)}. The &quot;Medicare Levy Surcharge&quot; (MLS) adds an additional <strong>1% to 1.5%</strong> for high earners without private hospital cover: in {SITE_CONFIG.financialYear}, singles earning between {formatAUD(MLS.tier1.min)} and {formatAUD(MLS.tier1.max)} pay <strong>1%</strong>, between {formatAUD(MLS.tier2.min)} and {formatAUD(MLS.tier2.max)} pay <strong>1.25%</strong>, and above {formatAUD(MLS.tier3.min - 1)} pay <strong>1.5%</strong>.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">HECS-HELP Repayments</h3>
            <p className="text-warmgray mb-4">
              HECS-HELP repayments are withheld weekly when your repayment income exceeds <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong> per year. The FY{SITE_CONFIG.financialYear} marginal system charges {hecsBandsSentence()}. Use our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> to see your exact weekly repayment.
            </p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are Common Mistakes When Calculating Weekly Pay?</h2>
            <p className="text-warmgray mb-4">
              The most common mistake is dividing an annual salary by 48 (assuming 4 weeks of leave are unpaid) instead of 52, which overstates weekly pay by approximately <strong>8.3%</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray">
              <li><strong>Dividing by 48 instead of 52:</strong> Full-time employees receive 4 weeks of paid annual leave. The salary already covers 52 weeks, so dividing by 52 is correct for calculating gross weekly pay.</li>
              <li><strong>Subtracting super from take-home pay:</strong> The super guarantee of {formatPercent(SUPER_GUARANTEE.rate, 0)} is paid by your employer on top of your salary. It does not reduce your weekly take-home amount unless you make voluntary salary sacrifice contributions.</li>
              <li><strong>Using the wrong financial year rates:</strong> Tax brackets, LITO thresholds, and HECS repayment rates change at the start of each financial year on 1 July. Calculations using the previous year&apos;s rates produce incorrect weekly figures. This Australian tax calculator uses the current FY{SITE_CONFIG.financialYear} rates.</li>
              <li><strong>Ignoring the Medicare levy:</strong> Excluding the 2% Medicare levy understates total deductions by <strong>{formatAUD(EX.medicareLevy / 52, 2)}</strong> per week on an $80,000 salary.</li>
              <li><strong>Confusing gross and net pay:</strong> Job advertisements quote gross (pre-tax) salaries. The actual weekly amount deposited into your bank account is the net pay after all deductions. At $80,000 gross, the difference between gross and net weekly pay is <strong>{formatAUD(EX_WEEKLY_GAP)}</strong>.</li>
            </ul>
          </section>

          {/* CONTEXT BORDER */}

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Calculators</h2>
            <p className="text-warmgray mb-4">
              These Australian tax calculators complement the weekly pay calculator by handling different pay frequencies, deduction types, and employment scenarios.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/fortnightly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Fortnightly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">See your salary split into 26 fortnightly payments after tax, Medicare, and HECS.</span>
              </Link>
              <Link href="/monthly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Monthly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Convert your annual salary into 12 monthly take-home pay amounts.</span>
              </Link>
              <Link href="/take-home-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Take-Home Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Full annual breakdown of income tax, super, and net pay after all deductions.</span>
              </Link>
              <Link href="/hourly-to-annual-salary-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Hourly to Annual Salary Calculator</span>
                <span className="text-sm text-warmgray-light">Convert an hourly rate into annual, monthly, and weekly salary equivalents.</span>
              </Link>
              <Link href="/salary-sacrifice-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Salary Sacrifice Calculator</span>
                <span className="text-sm text-warmgray-light">Calculate the tax savings and take-home impact of pre-tax super contributions.</span>
              </Link>
              <Link href="/gross-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Gross Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Reverse-calculate the gross salary needed to reach a target net pay amount.</span>
              </Link>
            </div>
          </section>

          <MethodologyDisclosure>
            <p>Calculations are based on 52 weeks per year. We divide the annual figures by 52 to provide the weekly equivalent. This aligns with standard ATO PAYG withholding practices.</p>
          </MethodologyDisclosure>

          <RelatedSearches items={RELATED_SEARCHES} />

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <FaqAccordion faqs={WEEKLY_PAY_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" triggerClassName="text-left text-base font-medium text-navy" contentClassName="text-warmgray leading-relaxed" />
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ salary }: { salary: number }) {
  const result = calculatePayBreakdown({ grossSalary: salary, includeHECS: false, hasPrivateHealth: true });
  const weeklyGross = salary / 52;
  const weeklyTax = (result.netIncomeTax + result.medicareLevy) / 52;

  return (
    <tr>
      <td className="px-4 py-3 text-navy font-medium">{formatAUD(salary)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(weeklyGross, 2)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(weeklyTax, 2)}</td>
      <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.weekly, 2)}</td>
    </tr>
  );
}

function Row({ label, value, bold, sub }: { label: string; value: string; bold?: boolean; sub?: boolean }) {
  return (
    <div className={`flex items-center justify-between ${sub ? "text-warmgray-light text-xs" : ""}`}>
      <span className={bold ? "font-semibold text-navy" : (sub ? "" : "text-warmgray")}>{label}</span>
      <span className={bold ? "font-bold text-navy" : "font-medium text-navy"}>{value}</span>
    </div>
  );
}

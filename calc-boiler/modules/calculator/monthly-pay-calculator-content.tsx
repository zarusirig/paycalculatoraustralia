// Static long-form sections of /monthly-pay-calculator/. Server components, so
// they ship as HTML: MonthlyPayCalculatorIntro (the sections above the pay-cycle
// comparison, passed as `intro`) and MonthlyPayCalculatorContent (everything
// after it, passed as `children`). The comparison table in between reads the
// calculator result, so it stays in monthly-pay-calculator.tsx (client).

import Link from "next/link";
import FaqAccordion from "@/components/common/faq-accordion";
import { MONTHLY_PAY_FAQS } from "./monthly-pay-calculator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  SUPER_GUARANTEE,
  HECS_HELP,
  SOURCES,
  SITE_CONFIG,
  MEDICARE_LEVY,
  TAX_BRACKETS,
} from "@/lib/constants";
import { FIRST_TAXED_BRACKET } from "@/modules/calculator/fy-rate-copy";

const FIRST_RATE = formatPercent(FIRST_TAXED_BRACKET.rate, 0);

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "PAYG withholding monthly tax table", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
];

export function MonthlyPayCalculatorIntro() {
  return (
    <>
          {/* --- H2: How Is Monthly Pay Calculated? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Monthly Pay Calculated in Australia?</h2>
            <p className="text-warmgray mb-4">
              Monthly take-home pay equals your gross annual salary divided by 12, minus PAYG income tax, the Medicare levy, and any HECS-HELP repayments withheld for that month. The Australian Taxation Office publishes a dedicated <Link href="/monthly-tax-table/" className="text-eucalyptus-dark hover:underline"><strong>monthly tax table</strong></Link> that employers use to determine the exact amount withheld from each pay cycle.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Step-by-Step Monthly Pay Calculation</h3>
            <ol className="list-decimal pl-5 space-y-2 text-warmgray mb-4">
              <li><strong>Gross monthly pay:</strong> Divide your annual salary by <strong>12</strong>. An {formatAUD(80000)} salary produces a gross monthly figure of <strong>{formatAUD(80000 / 12, 2)}</strong>.</li>
              <li><strong>Income tax:</strong> Apply the FY{SITE_CONFIG.financialYear} marginal tax rates to your annual income, then divide the annual tax by 12. The first <strong>{formatAUD(18200)}</strong> is tax-free. Income between {formatAUD(FIRST_TAXED_BRACKET.min)} and {formatAUD(FIRST_TAXED_BRACKET.max)} is taxed at <strong>{FIRST_RATE}</strong>. Income between {formatAUD(45001)} and {formatAUD(135000)} is taxed at <strong>30%</strong>.</li>
              <li><strong>Medicare levy:</strong> Add <strong>{formatPercent(MEDICARE_LEVY.rate, 0)}</strong> of your taxable income, divided by 12.</li>
              <li><strong>HECS-HELP:</strong> If you carry a study debt and earn above <strong>{formatAUD(HECS_HELP.minimumThreshold)}</strong>, a marginal repayment is withheld each month.</li>
              <li><strong>Net monthly pay:</strong> Subtract all deductions from your gross monthly figure. The remainder is your after-tax monthly income.</li>
            </ol>
            <p className="text-warmgray mb-4">
              Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to see the full annual breakdown before dividing by 12.
            </p>
          </section>

          {/* --- H2: Monthly Pay Table by Annual Salary --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Monthly Take-Home Pay at Different Salary Levels?</h2>
            <p className="text-warmgray mb-4">
              Monthly net pay ranges from <strong>{formatAUD(calculatePayBreakdown({ grossSalary: 50000, includeHECS: false, hasPrivateHealth: true }).monthly, 2)}</strong> on a {formatAUD(50000)} salary to <strong>{formatAUD(calculatePayBreakdown({ grossSalary: 180000, includeHECS: false, hasPrivateHealth: true }).monthly, 2)}</strong> on a {formatAUD(180000)} salary. The table below shows gross monthly pay, monthly tax withheld, and net monthly take-home for 6 common Australian salaries in FY{SITE_CONFIG.financialYear}.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Annual Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Gross Monthly</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Monthly Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Monthly Take-Home</th>
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
            <p className="text-warmgray mt-3 text-sm">
              All figures assume an Australian resident for tax purposes, no HECS-HELP debt, and private health insurance held. Superannuation at {formatPercent(SUPER_GUARANTEE.rate, 0)} is employer-paid and not deducted from take-home pay. Use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> for a personalised annual result.
            </p>
          </section>

          {/* --- H2: Who Uses This Calculator? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Uses a Monthly Pay Calculator?</h2>
            <p className="text-warmgray mb-4">
              Salaried employees paid on a monthly cycle, budgeters aligning expenses with a single monthly deposit, and HR professionals verifying payroll all use this Australian tax calculator. Monthly pay cycles are common in corporate, government, and professional-services roles.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray">
              <li><strong>Full-time salaried employees</strong> comparing a job offer against current net pay to assess real purchasing power.</li>
              <li><strong>Mortgage applicants</strong> who need to verify their net monthly income when lenders assess serviceability.</li>
              <li><strong>Budget planners</strong> matching rent, utilities, groceries, and loan repayments against a single monthly deposit.</li>
              <li><strong>Payroll officers</strong> cross-checking PAYG withholding amounts against the ATO monthly tax table.</li>
              <li><strong>Expatriates and new migrants</strong> estimating Australian take-home pay before relocating.</li>
              <li><strong>Queensland workers</strong> who want state-specific context, such as QLD payroll tax and public-sector pay scales, can use the <Link href="/pay-calculator-qld/" className="text-eucalyptus-dark hover:underline">pay calculator qld</Link> page alongside this one.</li>
            </ul>
          </section>
    </>
  );
}

export default function MonthlyPayCalculatorContent() {
  return (
    <>
          {/* --- H2: What Deductions Apply Monthly? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Deductions Apply to Monthly Pay?</h2>
            <p className="text-warmgray mb-4">
              Four deductions reduce monthly gross pay to net pay: PAYG income tax, the Medicare levy, the &quot;Medicare Levy Surcharge&quot; (if applicable), and HECS-HELP repayments. Superannuation is paid by the employer on top of salary and does not reduce your take-home pay. Employers withhold PAYG from the ATO tables for their pay cycle: the <Link href="/payg-withholding-tables/" className="text-eucalyptus-dark hover:underline">weekly tax table {SITE_CONFIG.financialYear}</Link>, and its fortnightly and monthly equivalents, all sit on one page.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">FY{SITE_CONFIG.financialYear} Income Tax Brackets</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Taxable Income</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Marginal Rate</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Tax on This Bracket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TAX_BRACKETS.map((bracket, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3 text-navy font-medium">
                        {bracket.max === Infinity
                          ? `${formatAUD(bracket.min)}+`
                          : `${formatAUD(bracket.min)} – ${formatAUD(bracket.max)}`}
                      </td>
                      <td className="px-4 py-3 text-right text-warmgray">{formatPercent(bracket.rate, 0)}</td>
                      <td className="px-4 py-3 text-right text-warmgray">{bracket.label}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3">Medicare Levy and Surcharge</h3>
            <p className="text-warmgray mb-4">
              The standard Medicare levy is <strong>{formatPercent(MEDICARE_LEVY.rate, 0)}</strong> of taxable income for all residents earning above {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}. Taxpayers without private hospital cover who earn above {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)} also pay the &quot;Medicare Levy Surcharge&quot; at rates between <strong>{formatPercent(MEDICARE_LEVY.surcharge.tier1.rate, 0)}</strong> and <strong>{formatPercent(MEDICARE_LEVY.surcharge.tier3.rate, 1)}</strong>. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to see how your employer SG rate of {formatPercent(SUPER_GUARANTEE.rate, 0)} adds to your total remuneration package.
            </p>
          </section>

          {/* --- H2: Common Mistakes --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are Common Monthly Pay Calculation Mistakes?</h2>
            <p className="text-warmgray mb-4">
              The most frequent error is dividing an annual salary by 52 then multiplying by 4, which produces a 4-week figure, not a calendar-month figure. Dividing by 12 is the only correct method for monthly pay.
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-warmgray">
              <li><strong>Using 4 weeks instead of 1/12:</strong> Four weeks equals <strong>28 days</strong>. A calendar month averages <strong>30.44 days</strong>. Dividing annual pay by 13 (52/4) instead of 12 understates monthly income by approximately 7.7%.</li>
              <li><strong>Deducting super from take-home:</strong> The employer superannuation guarantee of {formatPercent(SUPER_GUARANTEE.rate, 0)} is paid on top of your salary. Subtracting it from gross pay double-counts the deduction and understates your net monthly pay.</li>
              <li><strong>Ignoring LITO:</strong> The &quot;Low Income Tax Offset&quot; reduces tax payable by up to <strong>$700</strong> for incomes under {formatAUD(66667)}. Omitting it overstates monthly tax on salaries between {formatAUD(18200)} and {formatAUD(66667)}.</li>
              <li><strong>Forgetting HECS-HELP:</strong> Employees with a study debt above {formatAUD(HECS_HELP.minimumThreshold)} have a compulsory repayment withheld each pay period. The marginal repayment starts at <strong>15%</strong> of every dollar above the threshold.</li>
              <li><strong>Applying the wrong financial year rates:</strong> Brackets change most years. In FY{SITE_CONFIG.financialYear} the first taxed bracket is {FIRST_RATE} up to {formatAUD(FIRST_TAXED_BRACKET.max)}, and the 30% bracket extends to {formatAUD(135000)} under the Stage 3 tax cuts. A calculator still using an earlier year&apos;s rates will get your monthly tax wrong.</li>
              <li><strong>Assuming a raise flows straight through:</strong> Part of any increase goes to tax at your marginal rate. Our <Link href="/pay-rise-calculator/" className="text-eucalyptus-dark hover:underline">calculator for a salary increase</Link> shows what a raise actually adds to each monthly pay.</li>
            </ol>
          </section>

          {/* ===== CONTEXT BORDER ===== */}

          {/* --- H2: Related Calculators --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Calculators</h2>
            <p className="text-warmgray mb-4">
              Explore other Australian tax calculators to convert your salary across pay frequencies, estimate deductions, or model salary sacrifice scenarios.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/weekly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Weekly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">View net pay per week</span>
              </Link>
              <Link href="/fortnightly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Fortnightly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">View net pay per fortnight</span>
              </Link>
              <Link href="/take-home-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Take-Home Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Full annual breakdown</span>
              </Link>
              <Link href="/hourly-to-annual-salary-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Hourly to Annual Salary Calculator</span>
                <span className="text-sm text-warmgray-light">Convert hourly rate to yearly</span>
              </Link>
              <Link href="/salary-sacrifice-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Salary Sacrifice Calculator</span>
                <span className="text-sm text-warmgray-light">Pre-tax vs post-tax comparison</span>
              </Link>
              <Link href="/hecs-help-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">HECS-HELP Calculator</span>
                <span className="text-sm text-warmgray-light">Estimate study loan repayments</span>
              </Link>
            </div>
          </section>

          <MethodologyDisclosure>
            <p>Calculations are based on 12 months per year. We divide the annual figures by 12 to provide the exact monthly equivalent. This guarantees accuracy regardless of how many days are in a specific month.</p>
          </MethodologyDisclosure>

          {/* --- H2: FAQs --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <FaqAccordion faqs={MONTHLY_PAY_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" triggerClassName="text-left text-base font-medium text-navy" contentClassName="text-warmgray leading-relaxed" />
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </>
  );
}

function ComparisonRow({ salary }: { salary: number }) {
  const result = calculatePayBreakdown({ grossSalary: salary, includeHECS: false, hasPrivateHealth: true });
  const monthlyGross = salary / 12;
  const monthlyTax = (result.netIncomeTax + result.medicareLevy) / 12;

  return (
    <tr>
      <td className="px-4 py-3 text-navy font-medium">{formatAUD(salary)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(monthlyGross, 2)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(monthlyTax, 2)}</td>
      <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.monthly, 2)}</td>
    </tr>
  );
}

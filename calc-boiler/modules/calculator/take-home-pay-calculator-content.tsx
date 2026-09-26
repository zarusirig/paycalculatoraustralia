// Everything on /take-home-pay-calculator/ below the calculator card:
// head-term links, worked examples, deduction and salary tables, FY changes,
// FAQ and sources. A server component, so it ships as HTML;
// take-home-pay-calculator.tsx (client) renders it via `children`.

import Link from "next/link";
import FaqAccordion from "@/components/common/faq-accordion";
import { TAKE_HOME_PAY_FAQS } from "./take-home-pay-calculator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  SUPER_GUARANTEE,
  HECS_HELP,
  MEDICARE_LEVY,
  LITO,
  SOURCES,
  SITE_CONFIG,
  TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
  TAX_FREE_THRESHOLD,
  calculateLITO,
  calculateMedicareSurcharge,
} from "@/lib/constants";
import { bracketRateList } from "@/modules/calculator/fy-rate-copy";
import { HeadTermLinks } from "@/modules/calculator/head-term-ui";

// Every worked figure on this page is computed from the tax engine. The copy
// had frozen at FY2025-26 values (16% first bracket, "$63,612 on $80,000",
// 2023-24 MLS tiers) under a FY2026-27 heading.
const EX80 = calculatePayBreakdown({ grossSalary: 80_000 });
const EX80_HECS = calculatePayBreakdown({ grossSalary: 80_000, includeHECS: true });
const EX90 = calculatePayBreakdown({ grossSalary: 90_000 });
const EX40 = calculatePayBreakdown({ grossSalary: 40_000 });
const EX100 = calculatePayBreakdown({ grossSalary: 100_000 });
const CASUAL_GROSS = 30 * 25 * 52; // $30/hr × 25 hrs × 52 weeks
const EX_CASUAL = calculatePayBreakdown({ grossSalary: CASUAL_GROSS });
const B1 = TAX_BRACKETS[1];
const B2 = TAX_BRACKETS[2];
const B1_SPAN = B1.max - TAX_FREE_THRESHOLD;
const B1_TAX = B1_SPAN * B1.rate;
const B2_SPAN_80K = 80_000 - B1.max;
const B2_TAX_80K = B2_SPAN_80K * B2.rate;
const pct0 = (r: number) => `${Math.round(r * 100)}%`;
const MLS_150K = calculateMedicareSurcharge(150_000, false);
const MLS_FROM = MEDICARE_LEVY.surcharge.tier1.min;
const LITO_60K = calculateLITO(60_000);
// Salary sacrifice $10,000 on $100,000: income tax + Medicare saved, less 15%
// contributions tax paid inside the fund.
const SACRIFICE_SAVING =
  EX100.netIncomeTax + EX100.medicareLevy - (EX90.netIncomeTax + EX90.medicareLevy) - 10_000 * 0.15;
const FIRST_BRACKET_CUT_SAVING = Math.round(B1_SPAN * (TAX_BRACKETS_2025_26[1].rate - B1.rate));

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Medicare levy", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: SOURCES.ato.name },
  { title: "HECS-HELP repayment thresholds", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: SOURCES.ato.name },
  { title: "Super guarantee rate", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/how-much-super-to-pay", publisher: SOURCES.ato.name },
];

export default function TakeHomePayCalculatorContent() {
  return (
    <>
        <HeadTermLinks className="max-w-4xl mx-auto -mt-6" terms={["payCalculatorAustralia", "salaryCalculator", "incomeTaxCalculator", "weeklyTaxCalculator", "fortnightlyTaxCalculator"]} />

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* ---- HOW IS TAKE-HOME PAY CALCULATED? ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Take-Home Pay Calculated in Australia?</h2>
            {/* Moved from the hero (26 Sep 2026) so the calculator sits above the phone fold. */}
            <p className="text-warmgray mb-4">Enter your own weekly, fortnightly, monthly or annual pay in the calculator above — this after tax income calculator adds HECS-HELP and super if they apply.</p>
            <p className="text-warmgray mb-4">Take-home pay is your gross salary minus income tax, the Medicare levy, and any compulsory HECS-HELP repayments — calculated using the ATO&apos;s progressive tax brackets for FY{SITE_CONFIG.financialYear}.</p>
            <p className="text-warmgray mb-4">Your employer withholds these deductions from every pay cycle through the &quot;Pay As You Go&quot; (PAYG) system and remits them directly to the Australian Taxation Office. The amount that reaches your bank account — your after-tax income — is what this Australian tax calculator computes.</p>

            <h3 className="text-lg font-semibold text-navy mb-3">Worked Example: Take-Home Pay on $80,000</h3>
            <p className="text-warmgray mb-3">A full-time employee earning <strong>$80,000</strong> gross in FY{SITE_CONFIG.financialYear} receives the following net pay after tax:</p>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Gross salary:</strong> $80,000</li>
              <li><strong>Income tax:</strong> The first {formatAUD(TAX_FREE_THRESHOLD)} is tax-free. The next {formatAUD(B1_SPAN)} (from {formatAUD(B1.min)} to {formatAUD(B1.max)}) is taxed at {pct0(B1.rate)}, producing {formatAUD(B1_TAX)}. The remaining {formatAUD(B2_SPAN_80K)} (from {formatAUD(B2.min)} to $80,000) is taxed at {pct0(B2.rate)}, producing {formatAUD(B2_TAX_80K)}. Total income tax = <strong>{formatAUD(EX80.netIncomeTax)}</strong>.</li>
              <li><strong>LITO offset:</strong> At $80,000, taxable income exceeds the {formatAUD(LITO.nilOffsetIncome)} phase-out ceiling, so the &quot;Low Income Tax Offset&quot; is <strong>$0</strong>.</li>
              <li><strong>Medicare levy:</strong> 2% of $80,000 = <strong>{formatAUD(EX80.medicareLevy)}</strong>.</li>
              <li><strong>Total deductions:</strong> {formatAUD(EX80.netIncomeTax)} + {formatAUD(EX80.medicareLevy)} = <strong>{formatAUD(EX80.totalDeductions)}</strong>.</li>
              <li><strong>Take-home pay:</strong> $80,000 &minus; {formatAUD(EX80.totalDeductions)} = <strong>{formatAUD(EX80.takeHomePay)} per year</strong> ({formatAUD(EX80.weekly, 2)} per week).</li>
            </ol>
            <p className="text-warmgray">Your employer also contributes <strong>{formatAUD(EX80.superContribution)}</strong> in superannuation ({formatPercent(SUPER_GUARANTEE.rate, 0)} SG rate) on top of your salary, bringing the total remuneration package to <strong>{formatAUD(EX80.totalPackage)}</strong>. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to model different SG scenarios.</p>
          </section>

          {/* ---- WHAT DEDUCTIONS REDUCE YOUR TAKE-HOME PAY? ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Deductions Reduce Your Take-Home Pay?</h2>
            <p className="text-warmgray mb-4">Three compulsory deductions reduce your take-home pay in Australia: income tax, the Medicare levy, and HECS-HELP repayments (if you hold a student loan).</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Deduction</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Rate / Rule</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Amount on $80,000</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Who Pays</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Income Tax</td>
                    <td className="px-4 py-3 text-warmgray">Progressive brackets: {bracketRateList()}</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">{formatAUD(EX80.netIncomeTax)}</td>
                    <td className="px-4 py-3 text-warmgray">All residents above $18,200</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Medicare Levy</td>
                    <td className="px-4 py-3 text-warmgray">Flat 2% of taxable income</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">{formatAUD(EX80.medicareLevy)}</td>
                    <td className="px-4 py-3 text-warmgray">Singles above {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} (2025-26 threshold, the latest published)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Medicare Levy Surcharge</td>
                    <td className="px-4 py-3 text-warmgray">1%&ndash;1.5% if no private health insurance</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">$0 (below {formatAUD(MLS_FROM)} threshold)</td>
                    <td className="px-4 py-3 text-warmgray">Singles earning {formatAUD(MLS_FROM)}+ without PHI</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">HECS-HELP Repayment</td>
                    <td className="px-4 py-3 text-warmgray">Marginal: {pct0(HECS_HELP.bands[1].marginalRate)} on income above {formatAUD(HECS_HELP.minimumThreshold)}</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">{formatAUD(EX80_HECS.hecsRepayment)} (if debt exists)</td>
                    <td className="px-4 py-3 text-warmgray">Graduates with study loan above {formatAUD(HECS_HELP.minimumThreshold)}</td>
                  </tr>
                  <tr className="bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Superannuation (SG)</td>
                    <td className="px-4 py-3 text-warmgray">{formatPercent(SUPER_GUARANTEE.rate, 0)} of qualifying earnings</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">{formatAUD(EX80.superContribution)} (employer-paid)</td>
                    <td className="px-4 py-3 text-warmgray">Employer pays on top &mdash; does NOT reduce take-home</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray mb-4">The largest deduction is income tax, calculated using Australia&apos;s <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">progressive tax brackets</Link>. The &quot;Low Income Tax Offset&quot; (LITO) reduces tax for incomes below {formatAUD(LITO.nilOffsetIncome)}, providing up to <strong>{formatAUD(LITO.maxOffset)}</strong> in savings. The <Link href="/medicare-levy/" className="text-eucalyptus-dark hover:underline">Medicare levy</Link> is a flat 2% that funds Australia&apos;s public healthcare system.</p>

            <h3 className="text-lg font-semibold text-navy mb-2">How Does the Tax-Free Threshold Affect Net Pay?</h3>
            <p className="text-warmgray">Every Australian tax resident claiming the tax-free threshold pays <strong>$0</strong> income tax on the first $18,200 of annual earnings. That threshold is worth <strong>{formatAUD(TAX_FREE_THRESHOLD * B1.rate)}</strong> a year: the tax the first {formatAUD(TAX_FREE_THRESHOLD)} would otherwise attract at the {pct0(B1.rate)} rate. Employees who hold multiple jobs should claim the threshold on only one position &mdash; claiming it on two jobs results in under-withholding and a tax bill at lodgment. Non-residents forfeit the threshold entirely and pay 30% from the first dollar earned, producing a significantly lower after-tax income on the same gross salary.</p>
          </section>

          {/* ---- TAKE-HOME PAY TABLE BY SALARY LEVEL ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Take-Home Pay at Every Salary Level?</h2>
            <p className="mb-4 text-warmgray">An Australian resident earning <strong>$80,000</strong> takes home <strong>{formatAUD(EX80.takeHomePay)}</strong> per year after income tax and Medicare levy in FY{SITE_CONFIG.financialYear}. The table below shows take-home pay, weekly pay, and effective tax rates at 7 common salary levels:</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Gross Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Income Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Medicare</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Total Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Take-Home</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Weekly</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Eff. Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[40000, 60000, 80000, 100000, 120000, 150000, 200000].map((s) => {
                    const b = calculatePayBreakdown({ grossSalary: s });
                    return (
                      <tr key={s} className="hover:bg-sandstone">
                        <td className="px-4 py-3 font-medium text-navy">{formatAUD(s)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(b.netIncomeTax)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(b.medicareLevy)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(b.totalDeductions)}</td>
                        <td className="px-4 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(b.takeHomePay)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(b.weekly, 2)}</td>
                        <td className="px-4 py-3 text-right text-warmgray-light">{formatPercent(b.effectiveTaxRate)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray-light mb-4">
              Figures exclude HECS-HELP repayments and Medicare Levy Surcharge. If you carry a HECS debt, your take-home decreases further &mdash;{" "}
              <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline font-medium">calculate your HECS repayment</Link> to see the impact.
            </p>
            {/* T6: hub linking every /take-home-pay-on/ page */}
            <p className="text-warmgray mb-4">
              Need a specific figure? See <Link href="/take-home-pay-on/" className="text-eucalyptus-dark hover:underline font-medium">take-home pay on every salary</Link> from $20,000 to $500,000, in $1,000 steps from $40,000 to $150,000, each with weekly, fortnightly and HECS-HELP figures.
            </p>

            <h3 className="text-lg font-semibold text-navy mb-2">Take-Home Pay on Part-Time and Casual Hours</h3>
            <p className="text-warmgray">Part-time and casual employees use the same income tax brackets as full-time workers &mdash; the ATO does not distinguish by employment type. A part-time worker earning <strong>$40,000</strong> per year takes home <strong>{formatAUD(EX40.takeHomePay)}</strong>, identical to a full-time employee on the same gross salary. Casual employees receive a 25% loading in lieu of leave entitlements, which increases gross pay but also increases taxable income. A casual worker paid $30 per hour for 25 hours per week earns {formatAUD(CASUAL_GROSS)} gross and takes home <strong>{formatAUD(EX_CASUAL.takeHomePay)}</strong> after taxation and the Medicare levy.</p>
          </section>

          {/* ---- WHO USES THIS CALCULATOR? ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Take-Home Pay Calculator?</h2>
            <p className="text-warmgray mb-4">This Australian take-home pay calculator serves 5 primary user groups, each needing an accurate net salary figure for a different reason.</p>
            <ul className="space-y-3 text-warmgray">
              <li className="flex gap-2"><span className="text-eucalyptus-dark font-bold">1.</span><span><strong>Job seekers comparing offers</strong> &mdash; A $90,000 offer at one company and a $95,000 package at another produce different take-home amounts depending on whether super is included. Enter both figures to compare net pay directly.</span></li>
              <li className="flex gap-2"><span className="text-eucalyptus-dark font-bold">2.</span><span><strong>Employees budgeting monthly expenses</strong> &mdash; Rent, groceries, and loan repayments require a precise monthly income figure. The calculator converts your annual take-home into weekly, fortnightly, and monthly amounts.</span></li>
              <li className="flex gap-2"><span className="text-eucalyptus-dark font-bold">3.</span><span><strong>Graduates with HECS-HELP debt</strong> &mdash; Compulsory repayments begin above {formatAUD(HECS_HELP.minimumThreshold)} under the marginal system. Toggling the HECS option shows the exact reduction in your after-tax income.</span></li>
              <li className="flex gap-2"><span className="text-eucalyptus-dark font-bold">4.</span><span><strong>Workers considering a pay rise</strong> &mdash; A $10,000 raise does not equal $10,000 more take-home. On $80,000, an extra $10,000 adds only <strong>{formatAUD(EX90.takeHomePay - EX80.takeHomePay)}</strong> after the {pct0(B2.rate)} marginal rate and 2% Medicare levy. Use our <Link href="/pay-rise-calculator/" className="text-eucalyptus-dark hover:underline">Pay Rise Calculator</Link> for side-by-side comparisons.</span></li>
              <li className="flex gap-2"><span className="text-eucalyptus-dark font-bold">5.</span><span><strong>Employers explaining total remuneration</strong> &mdash; HR teams use net pay breakdowns to show candidates the full value of a salary package, including the employer&apos;s {formatPercent(SUPER_GUARANTEE.rate, 0)} super contribution and any salary sacrifice arrangements.</span></li>
            </ul>
          </section>

          {/* ---- TAKE-HOME PAY VS GROSS PAY ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Difference Between Take-Home Pay and Gross Pay?</h2>
            <p className="text-warmgray mb-4">Gross pay is the total salary stated in your employment contract before any deductions. Take-home pay (net pay) is the amount deposited into your bank account after the ATO&apos;s PAYG withholding removes income tax, Medicare levy, and HECS repayments.</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Attribute</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Gross Pay</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Take-Home Pay (Net)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 text-warmgray">Definition</td>
                    <td className="px-4 py-3 text-navy">Total salary before deductions</td>
                    <td className="px-4 py-3 text-navy">Amount deposited to your bank</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-warmgray">Example on $100,000</td>
                    <td className="px-4 py-3 font-medium text-navy">$100,000</td>
                    <td className="px-4 py-3 font-medium text-eucalyptus-dark">{formatAUD(EX100.takeHomePay)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-warmgray">Includes income tax?</td>
                    <td className="px-4 py-3 text-navy">Yes (not yet deducted)</td>
                    <td className="px-4 py-3 text-navy">No (already removed)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-warmgray">Includes Medicare levy?</td>
                    <td className="px-4 py-3 text-navy">Yes (not yet deducted)</td>
                    <td className="px-4 py-3 text-navy">No (already removed)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-warmgray">Includes super?</td>
                    <td className="px-4 py-3 text-navy">No (employer pays separately)</td>
                    <td className="px-4 py-3 text-navy">No (employer pays separately)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-warmgray">Used for</td>
                    <td className="px-4 py-3 text-navy">Employment contracts, ATO returns</td>
                    <td className="px-4 py-3 text-navy">Budgeting, mortgage applications</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">To convert a gross salary to its take-home equivalent, use the calculator above. To work in the opposite direction &mdash; entering a desired net figure and finding the gross salary required &mdash; use our <Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline">Gross Pay Calculator</Link>.</p>
          </section>

          {/* ---- WHAT CHANGED THIS FINANCIAL YEAR? ---- */}
          {/* Values come from constants, but WHICH changes are listed is
              FY2026-27-specific (15% rate, Payday Super). Rewrite each 1 July. */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Take-Home Pay in FY{SITE_CONFIG.financialYear}?</h2>
            <p className="text-warmgray mb-4">Four changes from {SITE_CONFIG.financialYearStart} affect take-home pay: a lower first tax rate, a higher HECS-HELP repayment threshold, Payday Super, and a higher concessional contributions cap.</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Change</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">FY{SITE_CONFIG.previousFinancialYear}</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">FY{SITE_CONFIG.financialYear}</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Impact on Take-Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Tax rate, {formatAUD(B1.min)}&ndash;{formatAUD(B1.max)}</td>
                    <td className="px-4 py-3 text-warmgray">{pct0(TAX_BRACKETS_2025_26[1].rate)}</td>
                    <td className="px-4 py-3 text-warmgray">{pct0(B1.rate)}</td>
                    <td className="px-4 py-3 text-warmgray">Up to <strong>{formatAUD(FIRST_BRACKET_CUT_SAVING)}</strong> a year more for anyone earning {formatAUD(B1.max)} or more</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">HECS-HELP repayment threshold</td>
                    <td className="px-4 py-3 text-warmgray">{formatAUD(HECS_HELP.previousThreshold)}</td>
                    <td className="px-4 py-3 text-warmgray">{formatAUD(HECS_HELP.minimumThreshold)}</td>
                    <td className="px-4 py-3 text-warmgray">Indexed threshold; repayments still apply only to income above it</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Super payment timing</td>
                    <td className="px-4 py-3 text-warmgray">Quarterly</td>
                    <td className="px-4 py-3 text-warmgray">Every payday (Payday Super)</td>
                    <td className="px-4 py-3 text-warmgray">No change to take-home; SG stays {formatPercent(SUPER_GUARANTEE.rate, 0)}, paid on top</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Concessional contributions cap</td>
                    <td className="px-4 py-3 text-warmgray">{formatAUD(SUPER_GUARANTEE.concessionalCapPrevious)}</td>
                    <td className="px-4 py-3 text-warmgray">{formatAUD(SUPER_GUARANTEE.concessionalCap)}</td>
                    <td className="px-4 py-3 text-warmgray">More room to salary sacrifice before extra tax applies</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">HECS-HELP has used a marginal system since FY2025-26: only income above the threshold is repaid, at {pct0(HECS_HELP.bands[1].marginalRate)} in the first band, so there is no &quot;cliff&quot; where crossing the threshold triggers a repayment on your whole income. Use our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> to see your repayment.</p>
          </section>

          {/* ---- COMMON TAKE-HOME PAY MISTAKES ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Most Common Take-Home Pay Mistakes?</h2>
            <p className="text-warmgray mb-4">Five errors cause Australian employees to miscalculate their net pay after tax, leading to budget shortfalls or incorrect salary expectations.</p>
            <ol className="list-decimal pl-6 space-y-3 text-warmgray mb-4">
              <li><strong>Confusing marginal rate with effective rate.</strong> An employee on $80,000 pays a 30% marginal rate on the top portion of income, but the effective rate (income tax plus Medicare) across their entire salary is only <strong>{formatPercent(EX80.effectiveTaxRate)}</strong>. Assuming 30% of the full $80,000 goes to tax overestimates the deduction by <strong>{formatAUD(80_000 * 0.3 - EX80.totalDeductions)}</strong>.</li>
              <li><strong>Treating super as a take-home deduction.</strong> The {formatPercent(SUPER_GUARANTEE.rate, 0)} superannuation guarantee is paid by the employer on top of your gross salary. It does not reduce your take-home pay unless your contract specifies a &quot;total package inclusive of super&quot; arrangement.</li>
              <li><strong>Ignoring the LITO offset.</strong> Incomes below {formatAUD(LITO.nilOffsetIncome)} receive a &quot;Low Income Tax Offset&quot; of up to {formatAUD(LITO.maxOffset)} that directly reduces tax payable. Omitting LITO from manual calculations overstates tax at $60,000 by <strong>{formatAUD(LITO_60K)}</strong> (and by the full {formatAUD(LITO.maxOffset)} at {formatAUD(LITO.fullOffsetCeiling)} or less).</li>
              <li><strong>Using old HECS-HELP thresholds.</strong> The repayment threshold rose from $54,435 to {formatAUD(HECS_HELP.previousThreshold)} when the marginal system launched in FY2025-26, and again to {formatAUD(HECS_HELP.minimumThreshold)} for FY{SITE_CONFIG.financialYear}. Using old thresholds overstates repayments for graduates earning between $54,435 and {formatAUD(HECS_HELP.minimumThreshold)}.</li>
              <li><strong>Forgetting the Medicare Levy Surcharge.</strong> Singles earning {formatAUD(MLS_FROM)} or more without private health insurance pay an additional 1%&ndash;1.5% surcharge. On $150,000 without cover, the &quot;Medicare Levy Surcharge&quot; adds <strong>{formatAUD(MLS_150K)}</strong> in deductions beyond the standard 2% levy.</li>
            </ol>
          </section>

          {/* ---- HOW TO INCREASE YOUR TAKE-HOME PAY ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Can You Increase Your Take-Home Pay?</h2>
            <p className="text-warmgray mb-4">Two strategies legally reduce your taxable income and increase your after-tax pay: salary sacrifice and work-related deductions.</p>

            <h3 className="text-lg font-semibold text-navy mb-2">Salary Sacrifice Into Super</h3>
            <p className="text-warmgray mb-3">Redirecting part of your pre-tax salary into superannuation reduces your assessable income. On $100,000, sacrificing $10,000 into super saves <strong>{formatAUD(SACRIFICE_SAVING)}</strong> in tax overall, because that $10,000 is taxed at 15% inside super instead of your {pct0(B2.rate)} marginal rate plus the 2% Medicare levy. The concessional contribution cap for FY{SITE_CONFIG.financialYear} is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> (including employer SG).</p>
            <p className="text-sm text-warmgray-light mb-4"><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Compare your pay before and after salary sacrifice</Link></p>

            <h3 className="text-lg font-semibold text-navy mb-2">Claim Work-Related Tax Deductions</h3>
            <p className="text-warmgray mb-3">Tax deductions reduce your taxable income at your <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline">marginal tax rate</Link>. Common deductions include work-from-home expenses (using the ATO fixed rate per hour), uniforms and protective clothing, tools and equipment, and professional development courses. A $2,000 deduction at the 30% marginal rate reduces your tax by <strong>$600</strong>.</p>

            <h3 className="text-lg font-semibold text-navy mb-2">Obtain Private Health Insurance</h3>
            <p className="text-warmgray mb-4">Singles earning {formatAUD(MLS_FROM)} or more avoid the &quot;Medicare Levy Surcharge&quot; (1%&ndash;1.5%) by holding private hospital cover. On a $150,000 salary, the surcharge costs <strong>{formatAUD(MLS_150K)} per year</strong> &mdash; often more than a basic hospital policy. Obtaining cover increases your disposable salary by eliminating this surcharge.</p>

            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Strategy</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Tax Saved (on $100K)</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Increases Bank Deposit?</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Complexity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Salary sacrifice $10K into super</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">{formatAUD(SACRIFICE_SAVING)}</td>
                    <td className="px-4 py-3 text-warmgray">No (funds go to super)</td>
                    <td className="px-4 py-3 text-warmgray">Low &mdash; employer sets up</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">$2,000 in work-related deductions</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">$600</td>
                    <td className="px-4 py-3 text-warmgray">Yes (tax refund at lodgment)</td>
                    <td className="px-4 py-3 text-warmgray">Medium &mdash; receipts required</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Private health insurance (avoiding MLS)</td>
                    <td className="px-4 py-3 text-right font-medium text-navy">{formatAUD(calculateMedicareSurcharge(100_000, false))} on $100K ({formatAUD(MLS_150K)} on $150K)</td>
                    <td className="px-4 py-3 text-warmgray">Net effect depends on premium cost</td>
                    <td className="px-4 py-3 text-warmgray">Low &mdash; buy a policy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ---- RELATED CALCULATORS ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Other Calculators Help With Pay Planning?</h2>
            <p className="text-warmgray mb-4">This take-home pay calculator covers net income after tax. Five related tools on Pay Calculator Australia address adjacent payroll questions:</p>
            <ul className="space-y-2 text-warmgray">
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> &mdash; See a bracket-by-bracket breakdown of your income tax, including marginal and effective rates.</li>
              <li><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Salary Sacrifice Calculator</Link> &mdash; Compare take-home pay with and without pre-tax super contributions.</li>
              <li><Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline font-medium">HECS-HELP Calculator</Link> &mdash; Calculate your compulsory student loan repayment under the FY{SITE_CONFIG.financialYear} marginal system.</li>
              <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link> &mdash; Model your employer SG contributions, salary sacrifice top-ups, and projected super balance.</li>
              <li><Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Gross Pay Calculator</Link> &mdash; Reverse-calculate the gross salary required to achieve a target take-home amount.</li>
            </ul>
          </section>

          {/* ---- CONTEXT BORDER ---- */}

          <MethodologyDisclosure>
            <ol className="list-decimal space-y-1 pl-4">
              <li>Calculate income tax using ATO progressive brackets.</li>
              <li>Apply LITO offset for qualifying incomes.</li>
              <li>Add 2% Medicare levy.</li>
              <li>Add Medicare surcharge if applicable.</li>
              <li>Calculate HECS marginal repayment if opted in.</li>
              <li>Take-home = Gross &minus; all deductions.</li>
              <li>Super ({formatPercent(SUPER_GUARANTEE.rate, 0)}) is calculated separately &mdash; employer-paid.</li>
            </ol>
          </MethodologyDisclosure>

          {/* ---- FAQS ---- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <FaqAccordion faqs={TAKE_HOME_PAY_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" triggerClassName="text-left text-base font-medium text-navy" contentClassName="text-warmgray leading-relaxed" />
          </section>

          <section className="bg-eucalyptus-light/40 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See how income tax is calculated</h2>
            <p className="text-warmgray mb-6 max-w-lg mx-auto">Get a bracket-by-bracket breakdown of your income tax.</p>
            <Link href="/income-tax-calculator/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">Income Tax Calculator →</Link>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
    </>
  );
}

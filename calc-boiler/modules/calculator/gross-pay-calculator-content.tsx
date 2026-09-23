// Everything on /gross-pay-calculator/ below the calculator card: head-term
// links, how gross pay works, net-target tables, worked examples, FAQ and
// sources. A server component, so it ships as HTML; gross-pay-calculator.tsx
// (client) renders it via `children`.

import Link from "next/link";
import FaqAccordion from "@/components/common/faq-accordion";
import { GROSS_PAY_FAQS } from "./gross-pay-calculator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculatePayBreakdown,
  formatAUD,
  SUPER_GUARANTEE,
  SOURCES,
  SITE_CONFIG,
  HECS_HELP,
  LITO,
} from "@/lib/constants";
import { findGrossForNet } from "@/modules/calculator/gross-for-net";
import { HeadTermLinks } from "@/modules/calculator/head-term-ui";
import { bracketRatesSentence } from "@/modules/calculator/fy-rate-copy";

// Worked examples, computed from the engine so the copy rolls over with the
// constants (it had frozen at FY2025-26 16%-bracket figures).
const EX_85K = calculatePayBreakdown({ grossSalary: 85_000 });
const EX_90K = calculatePayBreakdown({ grossSalary: 90_000 });
const EX_90K_HECS = calculatePayBreakdown({ grossSalary: 90_000, includeHECS: true });
const TRP_BASE = Math.round(100_000 / (1 + SUPER_GUARANTEE.rate));
const EX_TRP = calculatePayBreakdown({ grossSalary: TRP_BASE });
const EX_100K = calculatePayBreakdown({ grossSalary: 100_000 });
const GROSS_FOR_1200_WK = findGrossForNet(1_200 * 52);
const GROSS_FOR_60K_NET = findGrossForNet(60_000);
const SG_PCT = `${Math.round(SUPER_GUARANTEE.rate * 100)}%`;

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

export default function GrossPayCalculatorContent() {
  return (
    <>
        <HeadTermLinks className="max-w-4xl mx-auto -mt-6" terms={["netPayCalculator", "salaryCalculator", "incomeTaxCalculator", "weeklyTaxCalculator", "fortnightlyTaxCalculator"]} />

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* --- HOW IS GROSS PAY CALCULATED? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Gross Pay Calculated in Australia?</h2>
            <p className="mb-4 text-warmgray">
              Gross pay is calculated by adding every pre-tax income component your employer pays you before income tax, Medicare levy, and other deductions are withheld. The Australian gross pay calculation for FY{SITE_CONFIG.financialYear} starts with your base salary and adds allowances, overtime, bonuses, and commissions.
            </p>
            <p className="mb-4 text-warmgray">
              To reverse-calculate gross pay from a target net amount, follow these steps:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Annualise your target net pay</strong> — multiply weekly by 52, fortnightly by 26, or monthly by 12. A target of $1,500 per week equals <strong>$78,000</strong> annually.</li>
              <li><strong>Identify the income tax brackets</strong> — the FY{SITE_CONFIG.financialYear} rates are {bracketRatesSentence()}.</li>
              <li><strong>Add the Medicare levy</strong> — a flat <strong>2%</strong> of taxable income applies to most Australian residents.</li>
              <li><strong>Apply the Low Income Tax Offset</strong> — LITO reduces tax by up to <strong>{formatAUD(LITO.maxOffset)}</strong> for incomes below {formatAUD(LITO.nilOffsetIncome)}, effectively raising the tax-free threshold to <strong>{formatAUD(LITO.effectiveTaxFreeThreshold)}</strong>.</li>
              <li><strong>Iterate to solve</strong> — because Australia uses progressive marginal rates, no single formula converts net to gross. This calculator uses binary search across the ATO tax tables to find the exact gross salary that produces your target net pay.</li>
            </ol>
            <p className="text-warmgray">
              Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to see the full bracket breakdown for any gross salary amount.
            </p>
          </section>

          {/* --- GROSS PAY VS NET PAY --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Gross Pay vs Net Pay — What Is the Difference?</h2>
            <p className="mb-4 text-warmgray">
              Gross pay is the total salary before deductions; net pay is the amount deposited into your bank account after income tax and the Medicare levy are withheld. On an <strong>$85,000</strong> gross salary in FY{SITE_CONFIG.financialYear}, net pay is <strong>{formatAUD(EX_85K.takeHomePay)}</strong> — a difference of <strong>{formatAUD(85_000 - EX_85K.takeHomePay)}</strong>.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Attribute</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Gross Pay</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Net Pay</th>
                  </tr>
                </thead>
                <tbody className="text-warmgray">
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Definition</td>
                    <td className="px-4 py-3">Total earnings before any deductions</td>
                    <td className="px-4 py-3">Take-home pay after all deductions</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                    <td className="px-4 py-3 font-medium">Includes income tax?</td>
                    <td className="px-4 py-3">Yes — tax is embedded</td>
                    <td className="px-4 py-3">No — tax already subtracted</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Includes Medicare levy?</td>
                    <td className="px-4 py-3">Yes — levy is embedded</td>
                    <td className="px-4 py-3">No — levy already subtracted</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                    <td className="px-4 py-3 font-medium">Includes superannuation?</td>
                    <td className="px-4 py-3">No — SG is paid on top</td>
                    <td className="px-4 py-3">No — SG goes to super fund</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Used for</td>
                    <td className="px-4 py-3">Employment contracts, job ads, ATO returns</td>
                    <td className="px-4 py-3">Budgeting, rent, mortgage applications</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Example at $85,000 gross</td>
                    <td className="px-4 py-3"><strong>$85,000</strong></td>
                    <td className="px-4 py-3"><strong>{formatAUD(EX_85K.takeHomePay)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              To calculate your net pay from a known gross salary, use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>. The gross pay calculator on this page performs the reverse operation — converting net pay back to gross.
            </p>
          </section>

          {/* --- WHO USES THIS CALCULATOR? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Gross Pay Calculator?</h2>
            <p className="mb-4 text-warmgray">
              The gross pay calculator serves anyone who knows what they need in their bank account and must work backwards to a pre-tax salary figure. Three primary user groups rely on this Australian tax calculator daily:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-warmgray mb-4">
              <li><strong>Salary negotiators</strong> — employees entering a new role or requesting a pay rise who need to translate living expenses into a gross salary figure. A worker who spends $1,200 per week on rent, bills, and essentials needs a gross salary of at least <strong>{formatAUD(Math.round(GROSS_FOR_1200_WK))}</strong> to cover those costs after tax.</li>
              <li><strong>Job seekers comparing offers</strong> — candidates who receive offers quoted as a &quot;Total Remuneration Package&quot; (gross plus super) and need to convert that figure to weekly take-home pay. A $100,000 TRP translates to a base salary of <strong>{formatAUD(TRP_BASE)}</strong> and net weekly pay of <strong>{formatAUD(EX_TRP.weekly)}</strong>.</li>
              <li><strong>Budgeters and mortgage applicants</strong> — individuals who know their monthly expenses and need to determine the minimum gross income required. Lenders assess borrowing capacity on gross salary, so converting net targets to gross figures is essential for pre-approval applications.</li>
            </ul>
            <p className="text-warmgray">
              Contractors and freelancers who set their own rates also benefit from reverse-calculating gross pay. Use the <Link href="/contractor-pay-calculator/" className="text-eucalyptus-dark hover:underline">Contractor Pay Calculator</Link> for scenarios involving GST, BAS, and business expenses.
            </p>
          </section>

          {/* --- GROSS PAY TABLE BY SALARY LEVEL --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Gross Salary Do You Need for Common Net Pay Targets?</h2>
            <p className="mb-4 text-warmgray">
              The table below shows the gross annual salary required to achieve common net take-home pay targets in FY{SITE_CONFIG.financialYear}. All figures assume an Australian resident with no HECS-HELP debt, no salary sacrifice, and no private health insurance surcharge.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Target Net (Annual)</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Required Gross Salary</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Total Tax + Medicare</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Effective Tax Rate</th>
                  </tr>
                </thead>
                <tbody className="text-warmgray">
                  {[40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000].map((netTarget, idx) => {
                    const gross = findGrossForNet(netTarget);
                    const bd = calculatePayBreakdown({ grossSalary: gross });
                    const totalTax = bd.netIncomeTax + bd.medicareLevy;
                    const effectiveRate = gross > 0 ? ((totalTax / gross) * 100).toFixed(1) : "0.0";
                    return (
                      <tr key={netTarget} className={idx % 2 === 1 ? "bg-sandstone/30" : ""}>
                        <td className="px-4 py-3 font-medium">{formatAUD(netTarget)}</td>
                        <td className="px-4 py-3"><strong>{formatAUD(Math.round(gross))}</strong></td>
                        <td className="px-4 py-3">{formatAUD(totalTax)}</td>
                        <td className="px-4 py-3">{effectiveRate}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-warmgray-light">
              *Figures are calculated using FY{SITE_CONFIG.financialYear} income tax brackets and the 2% Medicare levy. HECS-HELP repayments, salary sacrifice, and the Medicare Levy Surcharge are excluded.
            </p>
          </section>

          {/* --- WHAT COMPONENTS MAKE UP GROSS PAY? --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Components Make Up Gross Pay?</h2>
            <p className="mb-4 text-warmgray">
              Gross pay includes every form of assessable income your employer pays before tax is withheld. The ATO treats all of the following components as part of your gross earnings for PAYG withholding purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Base salary</strong> — the fixed annual amount stated in your employment contract, paid weekly, fortnightly, or monthly</li>
              <li><strong>Overtime earnings</strong> — hours worked beyond the standard 38-hour week, paid at penalty rates of <strong>1.5x</strong> (time and a half) or <strong>2.0x</strong> (double time)</li>
              <li><strong>Bonuses and commissions</strong> — performance-based payments, sign-on bonuses, and sales commissions added to your taxable income in the period received</li>
              <li><strong>Allowances</strong> — travel allowances, tool allowances, uniform allowances, and meal allowances that are not otherwise exempt from tax</li>
              <li><strong>Leave loading</strong> — an extra <strong>17.5%</strong> paid on annual leave entitlements under many awards and enterprise agreements</li>
              <li><strong>Back pay and arrears</strong> — retrospective pay increases applied to prior periods, taxed in the period of payment</li>
            </ul>
            <p className="text-warmgray mb-4">
              Superannuation guarantee contributions are <strong>not</strong> included in gross pay. The employer SG rate of <strong>{SG_PCT}</strong> for FY{SITE_CONFIG.financialYear} is paid on top of your gross salary into your nominated super fund. Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to calculate the exact employer contribution for any salary level.
            </p>
            <p className="text-warmgray">
              Salary sacrifice arrangements reduce your gross taxable income. Pre-tax contributions to super or novated lease payments lower the amount subject to income tax brackets, which changes the gross-to-net calculation. Model the impact using the <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link>.
            </p>
          </section>

          {/* --- COMMON GROSS PAY MISTAKES --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Most Common Gross Pay Mistakes?</h2>
            <p className="mb-4 text-warmgray">
              The most common gross pay mistake is confusing a &quot;Total Remuneration Package&quot; with base salary, which overstates gross pay by <strong>{formatAUD(100_000 - TRP_BASE)}</strong> on a $100,000 package. Avoid these 5 errors:
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-warmgray mb-4">
              <li><strong>Treating TRP as base salary</strong> — a $100,000 TRP includes {SG_PCT} super, so the actual base salary is only <strong>{formatAUD(TRP_BASE)}</strong>. Assuming the full $100,000 is your gross pay inflates your expected take-home by <strong>{formatAUD(EX_100K.weekly - EX_TRP.weekly)} per week</strong>.</li>
              <li><strong>Using a flat tax rate</strong> — dividing net by 0.7 to estimate gross assumes a flat 30% tax rate. Australia&apos;s progressive system means a $60,000 net actually requires a gross of <strong>{formatAUD(Math.round(GROSS_FOR_60K_NET))}</strong>, not the {formatAUD(Math.round(60_000 / 0.7))} that a flat-rate formula produces.</li>
              <li><strong>Forgetting the Medicare levy</strong> — the <strong>2%</strong> Medicare levy applies on top of income tax. On a $90,000 gross salary, the levy adds <strong>{formatAUD(EX_90K.medicareLevy)}</strong> to total deductions, reducing weekly take-home by <strong>{formatAUD(EX_90K.medicareLevy / 52, 2)}</strong>.</li>
              <li><strong>Ignoring HECS-HELP repayments</strong> — under the marginal repayment system for FY{SITE_CONFIG.financialYear}, a $90,000 income triggers a HECS repayment of <strong>{formatAUD(EX_90K_HECS.hecsRepayment)}</strong>. Workers with study debt need a higher gross salary to achieve the same net pay.</li>
              <li><strong>Comparing pre-tax and post-tax figures</strong> — comparing a $95,000 gross offer against your current $1,400 weekly net pay without converting both to the same basis leads to incorrect conclusions about whether the new role pays more.</li>
            </ol>
          </section>

          {/* --- EXAMPLE GROSS SALARY CALCULATIONS (EXISTING) --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Example Gross Salary Calculations</h2>
            <p className="mb-4 text-warmgray">
              Here are some common net take-home targets and the gross annual salary required to hit them under the FY25-26 tax brackets:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { net: 1000, per: "week" },
                { net: 1500, per: "week" },
                { net: 5000, per: "month" },
                { net: 8000, per: "month" },
              ].map((target) => {
                const mult = target.per === "week" ? 52 : 12;
                const gross = findGrossForNet(target.net * mult);
                return (
                  <div key={`${target.net}-${target.per}`} className="bg-white border text-center border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                    <div className="text-warmgray-light text-sm mb-1 uppercase tracking-widest">Target net</div>
                    <div className="font-bold text-navy text-xl border-b border-sandstone-dark/10 pb-3 mb-3">
                      {formatAUD(target.net)} <span className="text-sm font-normal text-warmgray-light">/{target.per.charAt(0)}</span>
                    </div>
                    <div className="text-warmgray-light text-sm mb-1 uppercase tracking-widest">Needs Gross</div>
                    <div className="font-bold text-eucalyptus-dark text-2xl">
                      {formatAUD(gross)}
                    </div>
                    <div className="text-xs text-warmgray-light mt-1">annually</div>
                  </div>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-warmgray-light">
              *Calculations are exact for standard income tax and Medicare levy. Note that if you have a HECS-HELP debt, you will need a higher gross salary to hit the same net target because loan repayments will also be deducted.
            </p>
          </section>

          {/* --- RELATED CALCULATORS --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Related Calculators Should You Use?</h2>
            <p className="mb-4 text-warmgray">
              The gross pay calculator answers one specific question: what gross salary produces a given net pay. These related Australian tax calculators address adjacent scenarios:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray">
              <li><Link href="/salary-package-calculator/" className="text-eucalyptus-dark hover:underline">Salary package calculator</Link> &mdash; base salary and take-home from a package including super.</li>
              <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> — enter a gross salary and see the net pay after income tax, Medicare levy, and HECS-HELP deductions</li>
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> — view a full breakdown of income tax brackets, LITO, and marginal rates for FY{SITE_CONFIG.financialYear}</li>
              <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> — calculate your employer&apos;s 12% SG contribution and project your super balance at retirement</li>
              <li><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> — model the tax savings from pre-tax super contributions or novated lease arrangements</li>
              <li><Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> — calculate compulsory HECS-HELP repayments under the marginal system introduced in FY2025-26 (threshold {formatAUD(HECS_HELP.minimumThreshold)} in FY{SITE_CONFIG.financialYear})</li>
              <li><Link href="/pay-rise-calculator/" className="text-eucalyptus-dark hover:underline">Pay Rise Calculator</Link> — compare your current and proposed salary to see the actual net pay increase after tax</li>
            </ul>
          </section>

          <MethodologyDisclosure>
            <p className="mb-2 text-sm">How this reverse calculation works:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Takes your target net amount and annualises it (e.g. weekly x 52).</li>
              <li>Uses a rapid iterative algorithm (binary search) against the standard ATO tax tables to find the exact gross salary that yields that exact net pay after income tax and Medicare levy.</li>
              <li>Does not include HECS debt deductions.</li>
            </ol>
          </MethodologyDisclosure>

          {/* --- FAQs --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <FaqAccordion faqs={GROSS_PAY_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" contentClassName="text-warmgray" />
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
    </>
  );
}

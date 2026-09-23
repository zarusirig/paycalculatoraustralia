// Everything on /overtime-pay-calculator/ below the calculator card: how
// overtime is calculated, penalty rate tables, worked examples, FAQ and
// sources. A server component, so it ships as HTML;
// overtime-pay-calculator.tsx (client) renders it via `children`.

import Link from "next/link";
import FaqAccordion from "@/components/common/faq-accordion";
import { OVERTIME_PAY_FAQS } from "./overtime-pay-calculator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  formatAUD,
  formatPercent,
  EMPLOYMENT,
  MEDICARE_LEVY,
  SOURCES,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
} from "@/lib/constants";

const FY = SITE_CONFIG.financialYear;
const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const bracketRange = (b: (typeof TAX_BRACKETS)[number]) =>
  b.max === Infinity ? `${formatAUD(b.min)}+` : `${formatAUD(b.min === 0 ? 0 : b.min)} – ${formatAUD(b.max)}`;

const SOURCES_LIST: SourceLink[] = [
  { title: "Overtime and penalty rates", url: "https://www.fairwork.gov.au/pay-and-wages/penalty-rates-allowances-and-other-payments/penalty-rates", publisher: SOURCES.fwo.name },
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

export default function OvertimePayCalculatorContent() {
  return (
    <>
      {/* --- H2: How Is Overtime Pay Calculated in Australia? --- */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Overtime Pay Calculated in Australia?</h2>
        <p className="mb-4 text-warmgray">
          Overtime pay in Australia is calculated by multiplying your base hourly rate by the penalty multiplier set in your Modern Award or enterprise agreement, then multiplying by the number of overtime hours worked. The formula is: <strong>Base Rate x Penalty Multiplier x Overtime Hours = Gross Overtime Pay</strong>.
        </p>
        <p className="mb-4 text-warmgray">
          Full-time employees on a standard {EMPLOYMENT.standardWeeklyHours}-hour week trigger overtime after exceeding {EMPLOYMENT.standardWeeklyHours} ordinary hours per week or 7.6 hours per day. Part-time employees trigger overtime after exceeding their agreed contracted hours. The Australian tax calculator applies the same income tax brackets to overtime earnings as it does to regular salary, meaning your take-home pay from overtime depends on your marginal rate.
        </p>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Worked Example: Overtime at $35/hr</h3>
        <p className="mb-4 text-warmgray">
          A warehouse worker earns a base rate of <strong>$35.00/hr</strong>. They work 6 overtime hours on a weekday at time-and-a-half (1.5x), and their taxable income places them in the <strong>30% marginal tax bracket</strong>.
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
          <li>Penalty rate: $35.00 x 1.5 = <strong>$52.50/hr</strong></li>
          <li>Gross overtime: $52.50 x 6 hours = <strong>$315.00</strong></li>
          <li>Estimated tax (30% + 2% Medicare levy): $315.00 x 0.32 = <strong>$100.80</strong></li>
          <li>Net overtime pay: $315.00 - $100.80 = <strong>$214.20</strong></li>
        </ol>
        <p className="text-warmgray">
          Use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to see how overtime earnings affect your total weekly, fortnightly, or annual after-tax income.
        </p>
      </section>

      {/* --- H2: What Are the Overtime Penalty Rates? --- */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are the Overtime Penalty Rates?</h2>
        <p className="mb-4 text-warmgray">
          Overtime penalty rates range from <strong>1.5x to 2.5x</strong> the base hourly rate, depending on the day, time, and applicable Modern Award. The Fair Work Ombudsman sets minimum penalty rates across 122 modern awards covering industries including retail, hospitality, healthcare, manufacturing, and construction.
        </p>
        <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-navy">When You Work</th>
                <th className="px-4 py-3 text-center font-semibold text-navy">Full-Time / Part-Time</th>
                <th className="px-4 py-3 text-center font-semibold text-navy">Casual</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Example ({formatAUD(EMPLOYMENT.minimumWageHourly, 2)}/hr base)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">Saturday</td>
                <td className="px-4 py-3 text-center font-medium text-navy">1.25× – 1.5×</td>
                <td className="px-4 py-3 text-center text-warmgray">1.5× – 1.75×</td>
                <td className="px-4 py-3 text-right text-warmgray">{formatAUD(EMPLOYMENT.minimumWageHourly * 1.5, 2)}/hr</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">Sunday</td>
                <td className="px-4 py-3 text-center font-medium text-navy">1.5× – 2.0×</td>
                <td className="px-4 py-3 text-center text-warmgray">1.75× – 2.25×</td>
                <td className="px-4 py-3 text-right text-warmgray">{formatAUD(EMPLOYMENT.minimumWageHourly * 2, 2)}/hr</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">Public Holiday</td>
                <td className="px-4 py-3 text-center font-medium text-navy">2.0× – 2.5×</td>
                <td className="px-4 py-3 text-center text-warmgray">2.25× – 2.75×</td>
                <td className="px-4 py-3 text-right text-warmgray">{formatAUD(EMPLOYMENT.minimumWageHourly * 2.5, 2)}/hr</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">Overtime (first 2-3 hrs)</td>
                <td className="px-4 py-3 text-center font-medium text-navy">1.5×</td>
                <td className="px-4 py-3 text-center text-warmgray">1.5×</td>
                <td className="px-4 py-3 text-right text-warmgray">{formatAUD(EMPLOYMENT.minimumWageHourly * 1.5, 2)}/hr</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">Overtime (after 2-3 hrs)</td>
                <td className="px-4 py-3 text-center font-medium text-navy">2.0×</td>
                <td className="px-4 py-3 text-center text-warmgray">2.0×</td>
                <td className="px-4 py-3 text-right text-warmgray">{formatAUD(EMPLOYMENT.minimumWageHourly * 2, 2)}/hr</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-warmgray-light">Exact multipliers vary by Award. Use the <a href="https://calculate.fairwork.gov.au/" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">Fair Work PACT tool</a> to check your specific award penalties.</p>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Penalty Rates by Award Type</h3>
        <p className="mb-4 text-warmgray">
          Different Modern Awards set different penalty structures. The table below compares weekday overtime rates across 5 common awards for the FY{FY} financial year.
        </p>
        <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-navy">Modern Award</th>
                <th className="px-4 py-3 text-center font-semibold text-navy">First 2-3 Hrs</th>
                <th className="px-4 py-3 text-center font-semibold text-navy">After 2-3 Hrs</th>
                <th className="px-4 py-3 text-center font-semibold text-navy">Sunday</th>
                <th className="px-4 py-3 text-center font-semibold text-navy">Public Holiday</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">General Retail Industry Award</td>
                <td className="px-4 py-3 text-center">1.5×</td>
                <td className="px-4 py-3 text-center">2.0×</td>
                <td className="px-4 py-3 text-center">2.0×</td>
                <td className="px-4 py-3 text-center">2.5×</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">Hospitality Industry (General) Award</td>
                <td className="px-4 py-3 text-center">1.5×</td>
                <td className="px-4 py-3 text-center">2.0×</td>
                <td className="px-4 py-3 text-center">2.0×</td>
                <td className="px-4 py-3 text-center">2.5×</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">Nurses Award</td>
                <td className="px-4 py-3 text-center">1.5×</td>
                <td className="px-4 py-3 text-center">2.0×</td>
                <td className="px-4 py-3 text-center">2.0×</td>
                <td className="px-4 py-3 text-center">2.5×</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">Building and Construction General On-site Award</td>
                <td className="px-4 py-3 text-center">1.5×</td>
                <td className="px-4 py-3 text-center">2.0×</td>
                <td className="px-4 py-3 text-center">2.0×</td>
                <td className="px-4 py-3 text-center">2.5×</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">Clerks Private Sector Award</td>
                <td className="px-4 py-3 text-center">1.5×</td>
                <td className="px-4 py-3 text-center">2.0×</td>
                <td className="px-4 py-3 text-center">2.0×</td>
                <td className="px-4 py-3 text-center">2.5×</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* --- H2: Who Uses This Calculator? --- */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Uses This Calculator?</h2>
        <p className="mb-4 text-warmgray">
          This Australian overtime pay calculator serves employees, employers, and payroll professionals who calculate penalty rate earnings for FY{FY}. Common use cases include:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
          <li><strong>Shift workers</strong> in retail, hospitality, and healthcare verifying their weekend and public holiday pay on each payslip</li>
          <li><strong>Full-time employees</strong> estimating the net value of extra hours before agreeing to overtime requests</li>
          <li><strong>Part-time workers</strong> checking whether hours above their contracted agreement trigger overtime multipliers</li>
          <li><strong>Small business owners</strong> budgeting weekly labour costs when rostering staff across weekends and public holidays</li>
          <li><strong>Payroll managers</strong> cross-checking PAYG withholding on overtime payments against ATO tax tables</li>
        </ul>
        <p className="text-warmgray">
          Employees earning overtime frequently benefit from reviewing their total annual income using the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to confirm the correct marginal rate applies to their overtime earnings.
        </p>
      </section>

      {/* --- H2: Overtime Pay Table by Hourly Rate --- */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Overtime Pay Table by Hourly Rate</h2>
        <p className="mb-4 text-warmgray">
          The table below shows gross overtime pay for <strong>8 hours</strong> of overtime at common base hourly rates across 3 penalty multipliers. These figures represent gross pay before income tax and the 2% Medicare levy.
        </p>
        <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-navy">Base Hourly Rate</th>
                <th className="px-4 py-3 text-center font-semibold text-navy">1.5× (8 hrs)</th>
                <th className="px-4 py-3 text-center font-semibold text-navy">2.0× (8 hrs)</th>
                <th className="px-4 py-3 text-center font-semibold text-navy">2.5× (8 hrs)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {[26.44, 28, 32, 36, 40, 45, 50, 60].map((rate) => (
                <tr key={rate} className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy font-medium">{formatAUD(rate, 2)}/hr</td>
                  <td className="px-4 py-3 text-center">{formatAUD(rate * 1.5 * 8)}</td>
                  <td className="px-4 py-3 text-center">{formatAUD(rate * 2.0 * 8)}</td>
                  <td className="px-4 py-3 text-center">{formatAUD(rate * 2.5 * 8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-warmgray-light">
          The national minimum wage is {formatAUD(EMPLOYMENT.minimumWageHourly, 2)}/hr for FY{FY}. Rates above reflect common award classifications. Use our <Link href="/hourly-to-annual-salary-calculator/" className="text-eucalyptus-dark hover:underline">Hourly to Annual Salary Calculator</Link> to convert your hourly rate to an annual salary.
        </p>
      </section>

      {/* --- H2: How Is Overtime Taxed? --- */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Overtime Taxed?</h2>
        <p className="mb-4 text-warmgray">
          Overtime earnings are taxed at your <strong>marginal tax rate</strong> because they are added on top of your regular assessable income. Every overtime dollar sits in your highest income tax bracket, identical to how <Link href="/bonus-tax-calculator/" className="text-eucalyptus-dark hover:underline">bonus payments are taxed</Link>.
        </p>
        <p className="mb-4 text-warmgray">
          Your employer withholds tax from overtime pay through PAYG withholding. The ATO provides Schedule 5 (tax table for back payments and lump sums) and the standard weekly/fortnightly tax tables to calculate withholding on pay periods that include overtime. The 2% Medicare levy also applies to overtime earnings, and employees without private hospital cover whose income for MLS purposes is above <strong>{formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)}</strong> (singles, {FY}) pay an additional &quot;Medicare Levy Surcharge&quot; of <strong>1% to 1.5%</strong>.
        </p>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">FY{FY} Tax Brackets on Overtime Income</h3>
        <p className="mb-4 text-warmgray">
          The income tax brackets below determine the marginal rate applied to your overtime. An employee earning <strong>$75,000</strong> in base salary pays <strong>30%</strong> plus <strong>2% Medicare levy</strong> on every overtime dollar, reducing each $1.00 of gross overtime to <strong>$0.68</strong> in take-home pay.
        </p>
        <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-navy">Taxable Income</th>
                <th className="px-4 py-3 text-center font-semibold text-navy">Marginal Rate</th>
                <th className="px-4 py-3 text-center font-semibold text-navy">+ Medicare Levy</th>
                <th className="px-4 py-3 text-right font-semibold text-navy">Overtime Keep Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {TAX_BRACKETS.map((b) => {
                // No Medicare levy below the low-income threshold (tax-free band).
                const levy = b.rate === 0 ? 0 : MEDICARE_LEVY.rate;
                return (
                  <tr key={b.min} className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">{bracketRange(b)}</td>
                    <td className="px-4 py-3 text-center">{pct(b.rate)}</td>
                    <td className="px-4 py-3 text-center">{pct(levy)}</td>
                    <td className="px-4 py-3 text-right font-medium">{Math.round((1 - b.rate - levy) * 100)}c per $1</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- H2: Do I Get Super on Overtime? --- */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Do I Get Super on Overtime?</h2>
        <p className="mb-4 text-warmgray">
          Overtime is generally <strong>not classified as Ordinary Time Earnings (OTE)</strong> and does not attract the {formatPercent(SUPER_GUARANTEE.rate, 0)} Superannuation Guarantee for FY{FY}. The ATO defines OTE as the earnings an employee receives for ordinary hours of work, and overtime hours fall outside that definition. Payday Super (from {SUPER_GUARANTEE.paydaySuperStart}) calculates SG on &quot;qualifying earnings&quot;, which still exclude overtime where ordinary hours are clearly identified.
        </p>
        <p className="mb-4 text-warmgray">
          Some enterprise agreements or employment contracts include overtime in the superannuation calculation base. Check your employment agreement or contact your employer&apos;s payroll team to confirm. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to calculate the SG rate on your ordinary earnings separately.
        </p>
      </section>

      {/* --- H2: What Are Common Overtime Pay Mistakes? --- */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are Common Overtime Pay Mistakes?</h2>
        <p className="mb-4 text-warmgray">
          Underpayment of overtime is one of the most common payroll compliance issues in Australia, with the Fair Work Ombudsman recovering <strong>$453 million</strong> in underpaid wages in FY2025-26 alone. These 5 mistakes occur most frequently:
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-warmgray mb-4">
          <li><strong>Applying the wrong multiplier</strong> — Using 1.5x for all overtime hours instead of escalating to 2.0x after the first 2 or 3 hours as required by most awards</li>
          <li><strong>Calculating casual overtime on the loaded rate</strong> — The overtime multiplier applies to the base rate only, not the base rate plus the 25% casual loading</li>
          <li><strong>Ignoring part-time overtime triggers</strong> — Part-time employees earn overtime after exceeding their agreed hours, not after 38 hours per week</li>
          <li><strong>Missing public holiday penalties</strong> — Australia has 8 national public holidays and additional state-specific holidays, each attracting 2.0x to 2.5x penalty rates</li>
          <li><strong>Using the wrong tax bracket</strong> — Overtime sits on top of your base salary, so the marginal rate on overtime is typically higher than your average tax rate across all income</li>
        </ol>
        <p className="text-warmgray">
          Employees who suspect underpayment of overtime should compare their payslip against the calculations from this overtime pay calculator and review their applicable award on the <a href="https://www.fairwork.gov.au/pay-and-wages/minimum-wages/pay-guides" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">Fair Work Ombudsman website</a>.
        </p>
      </section>

      {/* --- CONTEXT BORDER --- */}

      {/* --- H2: Related Calculators --- */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Calculators</h2>
        <p className="mb-4 text-warmgray">
          Overtime pay interacts with income tax, superannuation, and total salary packaging. These calculators help you model the complete picture:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-warmgray">
          <li><Link href="/overtime-penalty-rates-guide/" className="text-eucalyptus-dark hover:underline">Overtime and penalty rates guide</Link> &mdash; the award rules that set time-and-a-half, double time and weekend loadings.</li>
          <li><Link href="/weekly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Weekly Pay Calculator</Link> — Convert your base salary plus overtime into a weekly after-tax amount</li>
          <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> — Calculate your total income tax liability including overtime in your assessable income for FY{FY}</li>
          <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> — See your net pay after tax, Medicare levy, and HECS-HELP on a salary that includes regular overtime</li>
          <li><Link href="/bonus-tax-calculator/" className="text-eucalyptus-dark hover:underline">Bonus Tax Calculator</Link> — Estimate tax on lump-sum payments, which follow the same marginal rate logic as overtime</li>
          <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> — Calculate the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG contribution on your ordinary time earnings, separate from overtime</li>
        </ul>
      </section>

      <MethodologyDisclosure>
        <p className="mb-2 text-sm">Overtime pay is estimated using:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Gross overtime = base hourly rate × multiplier × hours</li>
          <li>Tax estimated at your selected marginal bracket + 2% Medicare levy</li>
          <li>Actual withholding may vary based on your total annualised earnings</li>
          <li>Does not account for HECS, salary sacrifice, or other deductions</li>
        </ul>
      </MethodologyDisclosure>

      {/* --- H2: Frequently Asked Questions --- */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
        <FaqAccordion faqs={OVERTIME_PAY_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" contentClassName="text-warmgray" />
      </section>

      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </>
  );
}

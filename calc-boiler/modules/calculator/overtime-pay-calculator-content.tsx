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
import {
  HOSPITALITY_OVERTIME,
  HOSPITALITY_PENALTIES,
  HOSPITALITY_PUBLIC_HOLIDAY_OVERTIME,
  RETAIL_OVERTIME,
  RETAIL_PENALTIES,
} from "@/lib/constants/hospitality-award";
import { CLERKS_AWARD, NURSES_AWARD, type ModernAwardData } from "@/lib/constants/modern-awards";
import { CONSTRUCTION_AWARD } from "@/lib/constants/modern-awards-oct";

const FY = SITE_CONFIG.financialYear;
const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const bracketRange = (b: (typeof TAX_BRACKETS)[number]) =>
  b.max === Infinity ? `${formatAUD(b.min)}+` : `${formatAUD(b.min === 0 ? 0 : b.min)} – ${formatAUD(b.max)}`;
// Multiplier display: 1.5 -> "1.5×", 2 -> "2.0×", 2.25 -> "2.25×".
const mult = (m: number) => `${Number.isInteger(m) ? m.toFixed(1) : String(m)}×`;

// Worked examples: the bracket a $75,000 salary falls in, plus the Medicare levy.
const EXAMPLE_SALARY = 75_000;
const EXAMPLE_BRACKET = TAX_BRACKETS.find((b) => EXAMPLE_SALARY >= b.min && EXAMPLE_SALARY <= b.max) ?? TAX_BRACKETS[0];
const EXAMPLE_TAX_RATE = EXAMPLE_BRACKET.rate + MEDICARE_LEVY.rate;
const EXAMPLE_GROSS = 35 * 1.5 * 6;
const EXAMPLE_TAX = Math.round(EXAMPLE_GROSS * EXAMPLE_TAX_RATE * 100) / 100;

// Full-time and part-time overtime by award, read from the award constants.
const otRow = (award: ModernAwardData) => ({
  first: award.overtime[0].fullTime,
  after: award.overtime[1].fullTime,
  sunday: award.overtime.find((r) => r.label.startsWith("Sunday"))?.fullTime ?? 0,
  publicHoliday: award.overtime.find((r) => r.label.startsWith("Public holiday"))?.fullTime ?? 0,
});
const AWARD_OVERTIME_ROWS = [
  { name: "General Retail Industry Award", first: RETAIL_OVERTIME.weekdayFirst3Hours, after: RETAIL_OVERTIME.weekdayAfter3Hours, sunday: RETAIL_OVERTIME.sunday, publicHoliday: RETAIL_OVERTIME.publicHoliday },
  { name: "Hospitality Industry (General) Award", first: HOSPITALITY_OVERTIME.weekdayFirst2Hours, after: HOSPITALITY_OVERTIME.weekdayAfter2Hours, sunday: HOSPITALITY_OVERTIME.weekend, publicHoliday: HOSPITALITY_PUBLIC_HOLIDAY_OVERTIME.fullTime },
  { name: "Nurses Award", ...otRow(NURSES_AWARD) },
  { name: "Building and Construction General On-site Award", ...otRow(CONSTRUCTION_AWARD) },
  { name: "Clerks Private Sector Award", ...otRow(CLERKS_AWARD) },
];
const NURSES_SUNDAY_ORDINARY = NURSES_AWARD.penalties.find((r) => r.label.startsWith("Sunday"))?.fullTime ?? 0;
const NURSES_PH_ORDINARY = NURSES_AWARD.penalties.find((r) => r.label.startsWith("Public holiday"))?.fullTime ?? 0;
const NURSES_CASUAL_OT_FIRST = NURSES_AWARD.overtime[0].casual ?? 0;
const NURSES_CASUAL_OT_AFTER = NURSES_AWARD.overtime[1].casual ?? 0;

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
          Full-time employees on a standard {EMPLOYMENT.standardWeeklyHours}-hour week are paid overtime for work beyond {EMPLOYMENT.standardWeeklyHours} ordinary hours a week, beyond the maximum ordinary hours a day set in their award, or outside the award&apos;s spread of ordinary hours (for example, 7am to 7pm). Part-time employees trigger overtime after exceeding their agreed contracted hours. Overtime earnings are taxed under the same income tax brackets as your regular salary, so your take-home pay from overtime depends on your marginal tax rate.
        </p>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Worked Example: Overtime at $35/hr</h3>
        <p className="mb-4 text-warmgray">
          A warehouse worker earns a base rate of <strong>$35.00/hr</strong>. They work 6 overtime hours on a weekday at time-and-a-half (1.5x), and their taxable income places them in the <strong>{pct(EXAMPLE_BRACKET.rate)} marginal tax bracket</strong>.
        </p>
        <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
          <li>Penalty rate: $35.00 x 1.5 = <strong>$52.50/hr</strong></li>
          <li>Gross overtime: $52.50 x 6 hours = <strong>$315.00</strong></li>
          <li>Estimated tax ({pct(EXAMPLE_BRACKET.rate)} + {pct(MEDICARE_LEVY.rate)} Medicare levy): {formatAUD(EXAMPLE_GROSS, 2)} x {EXAMPLE_TAX_RATE.toFixed(2)} = <strong>{formatAUD(EXAMPLE_TAX, 2)}</strong></li>
          <li>Net overtime pay: {formatAUD(EXAMPLE_GROSS, 2)} - {formatAUD(EXAMPLE_TAX, 2)} = <strong>{formatAUD(EXAMPLE_GROSS - EXAMPLE_TAX, 2)}</strong></li>
        </ol>
        <p className="text-warmgray">
          Use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to see how overtime earnings affect your total weekly, fortnightly, or annual after-tax income.
        </p>
      </section>

      {/* --- H2: What Are the Overtime Penalty Rates? --- */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are the Overtime Penalty Rates?</h2>
        <p className="mb-4 text-warmgray">
          Overtime penalty rates range from <strong>1.5x to 2.5x</strong> the base hourly rate, depending on the day, time, and applicable Modern Award. The Fair Work Commission sets minimum penalty rates in modern awards covering industries including retail, hospitality, healthcare, manufacturing, and construction.
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
                <td className="px-4 py-3 text-center text-warmgray">{mult(HOSPITALITY_OVERTIME.weekdayFirst2Hours)} to {mult(RETAIL_OVERTIME.casualWeekdayFirst3Hours)}</td>
                <td className="px-4 py-3 text-right text-warmgray">{formatAUD(EMPLOYMENT.minimumWageHourly * 1.5, 2)}/hr</td>
              </tr>
              <tr className="hover:bg-sandstone">
                <td className="px-4 py-3 text-navy">Overtime (after 2-3 hrs)</td>
                <td className="px-4 py-3 text-center font-medium text-navy">2.0×</td>
                <td className="px-4 py-3 text-center text-warmgray">{mult(HOSPITALITY_OVERTIME.weekdayAfter2Hours)} to {mult(RETAIL_OVERTIME.casualWeekdayAfter3Hours)}</td>
                <td className="px-4 py-3 text-right text-warmgray">{formatAUD(EMPLOYMENT.minimumWageHourly * 2, 2)}/hr</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-warmgray-light">Exact multipliers vary by Award. Casual overtime depends on the award: the General Retail Award pays casuals {pct(RETAIL_OVERTIME.casualWeekdayFirst3Hours)} then {pct(RETAIL_OVERTIME.casualWeekdayAfter3Hours)} of the minimum hourly rate (the {formatPercent(EMPLOYMENT.casualLoading, 0)} loading is included), the Hospitality Award pays casuals the full-time overtime rate with no loading (except on public holidays), and the Nurses Award pays {pct(NURSES_CASUAL_OT_FIRST)} then {pct(NURSES_CASUAL_OT_AFTER)} of the casual hourly rate. Use the <a href="https://calculate.fairwork.gov.au/" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">Fair Work PACT tool</a> to check your specific award penalties.</p>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Penalty Rates by Award Type</h3>
        <p className="mb-4 text-warmgray">
          Different Modern Awards set different penalty structures. The table below compares the full-time and part-time overtime multipliers for weekday, Sunday and public holiday overtime across 5 common Modern Awards for the FY{FY} financial year. Ordinary hours (not overtime) have their own rates: a Sunday is {pct(RETAIL_PENALTIES.sunday)} under the General Retail and Hospitality awards ({pct(NURSES_SUNDAY_ORDINARY)} under the Nurses Award), and a public holiday is {pct(HOSPITALITY_PENALTIES.publicHoliday)} under the General Retail and Hospitality awards ({pct(NURSES_PH_ORDINARY)} under the Nurses Award).
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
              {AWARD_OVERTIME_ROWS.map((a) => (
                <tr key={a.name} className="hover:bg-sandstone">
                  <td className="px-4 py-3 text-navy">{a.name}</td>
                  <td className="px-4 py-3 text-center">{mult(a.first)}</td>
                  <td className="px-4 py-3 text-center">{mult(a.after)}</td>
                  <td className="px-4 py-3 text-center">{mult(a.sunday)}</td>
                  <td className="px-4 py-3 text-center">{mult(a.publicHoliday)}</td>
                </tr>
              ))}
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
          If you work regular overtime, enter your total annual income in the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to confirm which marginal tax rate applies to your overtime earnings.
        </p>
      </section>

      {/* --- H2: Overtime Pay Table by Hourly Rate --- */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Overtime Pay Table by Hourly Rate</h2>
        <p className="mb-4 text-warmgray">
          The table below shows gross overtime pay for <strong>8 hours</strong> of overtime at common base hourly rates across 3 penalty multipliers. These figures represent gross pay before income tax and the {pct(MEDICARE_LEVY.rate)} Medicare levy.
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
              {[EMPLOYMENT.minimumWageHourly, 28, 32, 36, 40, 45, 50, 60].map((rate) => (
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
          Your employer withholds tax from overtime pay through PAYG withholding. The ATO provides Schedule 5 (tax table for back payments and lump sums) and the standard weekly/fortnightly tax tables to calculate withholding on pay periods that include overtime. The {pct(MEDICARE_LEVY.rate)} Medicare levy also applies to overtime earnings. Employees without private hospital cover whose income for MLS purposes is above <strong>{formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)}</strong> (singles, {FY}) also pay the Medicare Levy Surcharge of <strong>{pct(MEDICARE_LEVY.surcharge.tier1.rate)} to {pct(MEDICARE_LEVY.surcharge.tier3.rate)}</strong>.
        </p>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">FY{FY} Tax Brackets on Overtime Income</h3>
        <p className="mb-4 text-warmgray">
          The income tax brackets below determine the marginal rate applied to your overtime. An employee earning <strong>{formatAUD(EXAMPLE_SALARY)}</strong> in base salary pays <strong>{pct(EXAMPLE_BRACKET.rate)}</strong> plus <strong>{pct(MEDICARE_LEVY.rate)} Medicare levy</strong> on every overtime dollar, reducing each $1.00 of gross overtime to <strong>{formatAUD(1 - EXAMPLE_TAX_RATE, 2)}</strong> in take-home pay.
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
          Some enterprise agreements or employment contracts include overtime in the superannuation calculation base. Check your employment agreement or contact your employer&apos;s payroll team to confirm. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to calculate the SG contribution on your ordinary time earnings separately.
        </p>
      </section>

      {/* --- H2: What Are Common Overtime Pay Mistakes? --- */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are Common Overtime Pay Mistakes?</h2>
        <p className="mb-4 text-warmgray">
          Underpayment of overtime is one of the most common payroll compliance issues in Australia, with the Fair Work Ombudsman recovering <strong>$453 million</strong> in underpaid wages in FY2025-26 alone. These 5 mistakes occur most frequently:
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-warmgray mb-4">
          <li><strong>Applying the wrong multiplier</strong>: Using 1.5x for all overtime hours instead of escalating to 2.0x after the first 2 or 3 hours, as each award in the table above requires</li>
          <li><strong>Using the wrong base for casual overtime</strong>: Awards differ. The General Retail Award pays casuals {pct(RETAIL_OVERTIME.casualWeekdayFirst3Hours)} for the first 3 hours and {pct(RETAIL_OVERTIME.casualWeekdayAfter3Hours)} after that, which includes the {formatPercent(EMPLOYMENT.casualLoading, 0)} casual loading. The Hospitality Award pays casuals the full-time overtime rate with no loading, except on public holidays</li>
          <li><strong>Ignoring part-time overtime triggers</strong>: Part-time employees earn overtime after exceeding their agreed hours, not after 38 hours per week</li>
          <li><strong>Missing public holiday penalties</strong>: Australia has 8 national public holidays and additional state-specific holidays, each attracting 2.0x to 2.5x penalty rates</li>
          <li><strong>Using the wrong tax bracket</strong>: Overtime sits on top of your base salary, so the marginal rate on overtime is typically higher than your average tax rate across all income</li>
        </ol>
        <p className="text-warmgray">
          If you suspect your overtime is underpaid, compare your payslip against the result from the overtime pay calculator above and check the pay guide for your award on the <a href="https://www.fairwork.gov.au/pay-and-wages/minimum-wages/pay-guides" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">Fair Work Ombudsman website</a>.
        </p>
      </section>

      {/* --- CONTEXT BORDER --- */}

      {/* --- H2: Related Calculators --- */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Calculators</h2>
        <p className="mb-4 text-warmgray">
          Use these calculators to see how overtime pay affects your weekly pay, income tax, take-home pay and super:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-warmgray">
          <li><Link href="/overtime-penalty-rates-guide/" className="text-eucalyptus-dark hover:underline">Overtime and penalty rates guide</Link>: Read the award rules that set time-and-a-half, double time and weekend loadings</li>
          <li><Link href="/weekly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Weekly Pay Calculator</Link>: Convert your base salary plus overtime into a weekly after-tax amount</li>
          <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link>: Calculate your total income tax liability including overtime in your assessable income for FY{FY}</li>
          <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>: See your net pay after tax, Medicare levy, and HECS-HELP on a salary that includes regular overtime</li>
          <li><Link href="/bonus-tax-calculator/" className="text-eucalyptus-dark hover:underline">Bonus Tax Calculator</Link>: Estimate tax on lump-sum payments, which follow the same marginal rate logic as overtime</li>
          <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link>: Calculate the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG contribution on your ordinary time earnings, separate from overtime</li>
        </ul>
      </section>

      <MethodologyDisclosure>
        <p className="mb-2 text-sm">Overtime pay is estimated using:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Gross overtime = base hourly rate × multiplier × hours</li>
          <li>Tax estimated at your selected marginal bracket + {pct(MEDICARE_LEVY.rate)} Medicare levy</li>
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

// Everything on /ytd-income-calculator/ below the calculator card: what YTD
// means, reference tables, worked examples, methodology, FAQ and sources. A
// server component, so it ships as HTML; ytd-income-calculator.tsx (client)
// renders it via `children`.

import Link from "next/link";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { formatAUD, SOURCES, SITE_CONFIG } from "@/lib/constants";
import FaqAccordion from "@/components/common/faq-accordion";
import { YTD_FAQS } from "./ytd-income-calculator-faqs";

const SOURCES_LIST: SourceLink[] = [
  { title: "PAYG withholding", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/payg-withholding", publisher: SOURCES.ato.name },
  { title: "Pay slips", url: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips", publisher: SOURCES.fwo.name },
];

const REFERENCE_WEEKLY_PAYS = [800, 1000, 1500, 2000, 2500];
const REFERENCE_WEEKS = [13, 26, 39, 52];

export default function YTDIncomeCalculatorContent() {
  return (
    <>
      {/* --- WHAT DOES YTD MEAN? --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Does YTD Mean on a Payslip?</h2>
        <p className="mb-4 text-warmgray">
          YTD stands for <strong>year to date</strong>. On an Australian payslip, YTD is the running total of
          everything you have earned and everything that has been withheld since 1 July — the start of the
          financial year — up to and including that payslip. It is not a calendar-year figure.
        </p>
        <p className="mb-4 text-warmgray">
          Most payroll systems show several YTD columns side by side with your current pay:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
          <li><strong>YTD gross</strong> — total earnings before tax, including overtime, bonuses, allowances, and leave loading</li>
          <li><strong>YTD tax</strong> — total PAYG withholding your employer has sent to the ATO on your behalf (see the <Link href="/payg-withholding-tables/" className="text-eucalyptus-dark hover:underline">PAYG withholding tables</Link> for how each pay is calculated)</li>
          <li><strong>YTD STSL</strong> — total study loan (HECS-HELP) amounts withheld, shown separately from income tax (see our <Link href="/stsl-on-payslip/" className="text-eucalyptus-dark hover:underline">guide to STSL on your payslip</Link>)</li>
          <li><strong>YTD super</strong> — total employer superannuation guarantee contributions accrued</li>
          <li><strong>YTD net</strong> — total take-home pay actually deposited into your bank account</li>
        </ul>
        <p className="text-warmgray">
          If any of these labels look unfamiliar, our guide to <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">understanding your payslip</Link> walks
          through every line item Australian employers are required to show.
        </p>
      </section>

      {/* --- HOW TO CALCULATE --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Calculate YTD Income</h2>
        <p className="mb-4 text-warmgray">
          To calculate YTD income, multiply your gross pay per period by the number of pays you have received
          since 1 July. The formula is:
        </p>
        <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-5 mb-4 text-center">
          <p className="text-navy font-semibold">YTD gross = gross pay per period × pays received this financial year</p>
        </div>
        <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
          <li><strong>Find your gross pay per period</strong> — the before-tax amount on your payslip, not the net deposit.</li>
          <li><strong>Count the pays received since 1 July</strong> — check payslip dates, or use the payslip-date option in the calculator above and we count the cycles for you.</li>
          <li><strong>Multiply the two numbers</strong> — the result is your YTD gross income.</li>
        </ol>
        <p className="text-warmgray">
          <strong>Worked example:</strong> Priya earns <strong>$2,000 per fortnight</strong> and has received
          <strong> 13 fortnightly pays</strong> since 1 July. Her YTD gross is 13 × $2,000 = <strong>$26,000</strong>,
          exactly half way through the financial year&apos;s 26 fortnights.
        </p>
      </section>

      {/* --- HOW TO ANNUALISE --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Annualise Your YTD Income</h2>
        <p className="mb-4 text-warmgray">
          Annualising converts a part-year YTD figure into a projected full-year income. Lenders, real estate
          agents, and Centrelink all use annualised income to assess applications, and it is the fastest way to
          sanity-check whether your employer is withholding the right amount of tax.
        </p>
        <div className="bg-sandstone rounded-xl border border-sandstone-dark/20 p-5 mb-4 text-center">
          <p className="text-navy font-semibold">Projected annual income = (YTD gross ÷ pays received) × pays per year</p>
        </div>
        <p className="mb-4 text-warmgray">
          <strong>Worked example:</strong> Tom&apos;s payslip shows <strong>$39,000 YTD</strong> after
          <strong> 26 weekly pays</strong>. His average pay is $39,000 ÷ 26 = $1,500 per week, so his projected
          annual income is $1,500 × 52 = <strong>$78,000</strong>. Feeding that gross figure into the
          <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline"> take-home pay calculator</Link> shows
          exactly what should be left after tax.
        </p>
        <p className="text-warmgray">
          There are 52 weekly, 26 fortnightly, or 12 monthly pays in a standard financial year. If your income
          is irregular — overtime, casual shifts, commissions — annualising from a longer YTD window gives a
          more reliable projection than multiplying a single big or small pay.
        </p>
      </section>

      {/* --- WHY YTD MATTERS --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Why Your YTD Figure Matters</h2>
        <ul className="list-disc pl-6 space-y-3 text-warmgray mb-4">
          <li><strong>Home loan and rental applications</strong> — lenders annualise the YTD gross on your two most recent payslips to verify the income you declared. A YTD figure that annualises below your stated salary triggers follow-up questions, so it pays to check the maths before they do.</li>
          <li><strong>Estimating your tax refund</strong> — comparing YTD tax withheld against the tax actually payable on your projected annual income reveals whether you are heading for a refund or a bill. Run your projected income through the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">income tax calculator</Link> to see the target figure.</li>
          <li><strong>Catching payroll errors early</strong> — if YTD gross ÷ pays received does not equal your contracted per-period pay, something is off: a missed pay rise, unpaid overtime, or an incorrect tax treatment. YTD totals make errors visible that individual payslips hide.</li>
        </ul>
      </section>

      {/* --- FY CONTEXT --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>YTD and the Australian Financial Year</h2>
        <p className="mb-4 text-warmgray">
          Australian payslips track YTD against the <strong>financial year (1 July to 30 June)</strong>, not the
          calendar year. Every YTD column on your payslip resets to zero with the first pay after 1 July.
        </p>
        <p className="mb-4 text-warmgray">
          A new financial year has just begun, so payslips issued in July show only one or two pays&apos; worth
          of YTD income. That catches people out every year — a $2,000 YTD figure in mid-July is exactly on
          track for a $52,000 year for a fortnightly earner. Use the annualise mode above rather than judging
          the raw YTD number.
        </p>
        <p className="text-warmgray">
          The 30 June cut-off also means your final June payslip is the one that should match your income
          statement in myGov when your employer finalises Single Touch Payroll data for
          <Link href="/tax-return-calculator/" className="text-eucalyptus-dark hover:underline"> tax return</Link> time.
        </p>
      </section>

      {/* --- REFERENCE TABLE --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>YTD Income Reference Table</h2>
        <p className="mb-4 text-warmgray">
          The table below shows YTD gross income for common weekly pay amounts at each quarter of the financial
          year (13, 26, 39, and 52 weekly pays).
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border border-sandstone-dark/20 rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-sandstone">
                <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Weekly Gross Pay</th>
                {REFERENCE_WEEKS.map((w) => (
                  <th key={w} className="text-right px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">After {w} weeks</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-warmgray">
              {REFERENCE_WEEKLY_PAYS.map((pay, idx) => (
                <tr key={pay} className={idx % 2 === 1 ? "bg-sandstone/30" : ""}>
                  <td className="px-4 py-3 font-medium">{formatAUD(pay)}</td>
                  {REFERENCE_WEEKS.map((w) => (
                    <td key={w} className="px-4 py-3 text-right">{w === 52 ? <strong>{formatAUD(pay * w)}</strong> : formatAUD(pay * w)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-warmgray-light">
          *The &quot;After 52 weeks&quot; column equals the full-year gross salary. Figures are gross (before tax) amounts.
        </p>
      </section>

      {/* --- RELATED CALCULATORS --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Related Calculators Should You Use?</h2>
        <ul className="list-disc pl-6 space-y-2 text-warmgray">
          <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> — turn your projected annual gross into net pay after tax, Medicare levy, and HECS-HELP</li>
          <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> — check the exact tax payable on your annualised income and compare it with your YTD tax withheld</li>
          <li><Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">Understanding Your Payslip</Link> — a line-by-line guide to every field on an Australian payslip, including all the YTD columns</li>
          <li><Link href="/payg-withholding-tables/" className="text-eucalyptus-dark hover:underline">PAYG Withholding Tables</Link> — see how your employer calculates the tax withheld from each individual pay</li>
          <li><Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline">Gross Pay Calculator</Link> — reverse-calculate the gross salary needed to hit a target take-home amount</li>
        </ul>
      </section>

      <MethodologyDisclosure>
        <p className="mb-2 text-sm">How this YTD calculator works:</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>YTD mode multiplies your gross pay per period by the number of pays received since 1 July.</li>
          <li>Annualise mode divides your YTD gross by pays received, then multiplies by the pays in a full financial year (52 weekly / 26 fortnightly / 12 monthly).</li>
          <li>When counting pays from a payslip date, we assume your first pay of the financial year fell in the first pay cycle after 1 July — override the pay count manually if yours did not.</li>
          <li>Projected tax uses the FY{SITE_CONFIG.financialYear} resident tax brackets and 2% Medicare levy; HECS-HELP and salary sacrifice are excluded.</li>
        </ol>
      </MethodologyDisclosure>

      {/* --- FAQs --- */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
        <FaqAccordion faqs={YTD_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" contentClassName="text-warmgray" />
      </section>

      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </>
  );
}

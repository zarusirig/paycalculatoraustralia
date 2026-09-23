// The static long-form content on /payslip-generator/. A server component, so
// it ships as HTML; the client module (payslip-generator.tsx) renders it via
// `children`.

import Link from "next/link";
import FaqAccordion from "@/components/common/faq-accordion";
import { PAYSLIP_GENERATOR_FAQS } from "./payslip-generator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SUPER_GUARANTEE, SOURCES, SITE_CONFIG } from "@/lib/constants";

const SOURCES_LIST: SourceLink[] = [
  { title: "Pay slips", url: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips", publisher: SOURCES.fwo.name },
  { title: "Tax tables", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
];

export default function PayslipGeneratorContent() {
  return (
    <>
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Use This Payslip Generator</h2>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Enter employer details</strong> — the business name and ABN that must appear on every Australian payslip.</li>
              <li><strong>Add the employee and pay period</strong> — employee name, pay frequency, period start and end dates, and the date of payment.</li>
              <li><strong>Enter earnings</strong> — an hourly rate and hours worked, or an annual salary. Add overtime and allowances if they apply.</li>
              <li><strong>Check tax and super</strong> — the tool estimates PAYG withholding from the ATO tax rates and calculates the {(SUPER_GUARANTEE.rate * 100).toFixed(0)}% Super Guarantee. If you know the exact PAYG amount from your payroll software, type it in to override the estimate.</li>
              <li><strong>Print or save</strong> — click Print / Save as PDF. Your browser&apos;s print dialog lets you save the payslip as a PDF file.</li>
            </ol>
            <p className="text-warmgray">
              Every calculation happens locally in your browser. Nothing you type is uploaded, stored, or shared — which makes this
              generator safe to use with real employee names and pay figures.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Must a Payslip Include in Australia?</h2>
            <p className="mb-4 text-warmgray">
              Under the Fair Work Act 2009 and Fair Work Regulations 2009, an Australian payslip must include the employer&apos;s
              name and ABN, the employee&apos;s name, the date of payment, the pay period, gross and net pay, and any
              superannuation contributions with the fund name. Hourly workers must also see their rate and hours.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border border-sandstone-dark/20 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-sandstone">
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Required field</th>
                    <th className="text-left px-4 py-3 font-semibold text-navy border-b border-sandstone-dark/20">Details</th>
                  </tr>
                </thead>
                <tbody className="text-warmgray">
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Employer name and ABN</td>
                    <td className="px-4 py-3">The legal or registered business name, plus the Australian Business Number if the employer has one</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                    <td className="px-4 py-3 font-medium">Employee name</td>
                    <td className="px-4 py-3">The name of the person being paid</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Date of payment</td>
                    <td className="px-4 py-3">The day the wages were paid</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                    <td className="px-4 py-3 font-medium">Pay period</td>
                    <td className="px-4 py-3">The start and end dates the payment covers (e.g. 24/06/2026 – 07/07/2026)</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Gross and net pay</td>
                    <td className="px-4 py-3">Total earnings before deductions, and the amount actually paid to the employee</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                    <td className="px-4 py-3 font-medium">Hourly rate and hours (if paid hourly)</td>
                    <td className="px-4 py-3">The ordinary hourly rate, the number of hours worked at that rate, and the total for those hours</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Annual salary (if salaried)</td>
                    <td className="px-4 py-3">The rate of salary as at the last day of the pay period</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                    <td className="px-4 py-3 font-medium">Loadings, allowances, bonuses and penalty rates</td>
                    <td className="px-4 py-3">Any separately identifiable entitlement, listed as its own line item</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/10">
                    <td className="px-4 py-3 font-medium">Deductions</td>
                    <td className="px-4 py-3">The amount and purpose of each deduction, including PAYG withholding, plus the name (or name and number) of the fund or account it was paid into</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Superannuation contributions</td>
                    <td className="px-4 py-3">The amount of each contribution the employer made (or is liable to make) during the period, and the name of the super fund</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              The full list is published by the <a href="https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">Fair Work Ombudsman</a>.
              If a line on your own payslip does not make sense, our <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">guide to understanding your payslip</Link> explains every field.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Payslip Template vs Payslip Generator — Which Do You Need?</h2>
            <p className="mb-4 text-warmgray">
              A payslip template is a blank layout (usually Word or Excel) that you fill in and recalculate by hand every pay run.
              A payslip generator does the calculations for you: it estimates PAYG withholding from the current ATO rates,
              applies the {(SUPER_GUARANTEE.rate * 100).toFixed(0)}% Super Guarantee to ordinary time earnings, and keeps
              year-to-date totals consistent. The output of this page works as both — generate a payslip online, or print a
              blank one and use it as a free Australian payslip template.
            </p>
            <p className="text-warmgray">
              Because the maths follows the same ATO tax brackets used across this site, the tax figure here matches our
              <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline"> take-home pay calculator</Link> for
              the same annualised income. To see how the withholding amount is derived, check the
              <Link href="/payg-withholding-tables/" className="text-eucalyptus-dark hover:underline"> PAYG withholding tables</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Employer Payslip Obligations in Australia</h2>
            <p className="mb-4 text-warmgray">
              Payslips are a legal requirement, not a courtesy. Under the Fair Work Act, employers must give every employee a
              payslip — electronic or paper — <strong>within one working day of payday</strong>, even if the employee is on leave.
              Employee records, including pay records, must be kept for <strong>seven years</strong>. The Fair Work Ombudsman can
              issue infringement notices and pursue penalties for missing or inaccurate payslips.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Single Touch Payroll (STP) still applies</strong> — generating a payslip does not replace STP reporting. Employers must report salaries, PAYG and super to the ATO through STP-enabled software each pay day.</li>
              <li><strong>Super must be shown</strong> — the payslip must list the Super Guarantee contribution for the period and the fund it is (or will be) paid into.</li>
              <li><strong>Casuals get payslips too</strong> — every employee, including casual and part-time staff, must receive one.</li>
            </ul>
            <p className="text-warmgray">
              Hiring and unsure what a wage really costs once super, leave and workers&apos; compensation are added? Use the
              <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline"> employer cost calculator</Link> to
              see the true cost of an employee.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is the PAYG Withholding on a Payslip Calculated?</h2>
            <p className="mb-4 text-warmgray">
              Employers calculate PAYG withholding using the ATO&apos;s tax tables, based on the employee&apos;s earnings for the
              period, whether they claim the tax-free threshold, and whether they have a HECS-HELP (STSL) debt. This generator
              annualises the period&apos;s gross pay, applies the FY{SITE_CONFIG.financialYear} resident tax rates, Medicare levy
              and (optionally) HECS repayment, then divides back to the pay period.
            </p>
            <p className="text-warmgray">
              The estimate is typically within a few dollars of payroll software. For exact figures, take the PAYG amount from
              the ATO tables and enter it in the override field. Working backwards from a target take-home amount instead? The
              <Link href="/gross-pay-calculator/" className="text-eucalyptus-dark hover:underline"> gross pay calculator</Link> reverses
              the calculation, and the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">superannuation calculator</Link> projects
              what those {(SUPER_GUARANTEE.rate * 100).toFixed(0)}% contributions grow into.
            </p>
          </section>

          <MethodologyDisclosure title="How this payslip generator works">
            <ol className="list-decimal pl-4 space-y-1">
              <li>Ordinary earnings = hourly rate x hours (or annual salary ÷ pay periods per year).</li>
              <li>Gross pay for the period = ordinary earnings + overtime + allowances.</li>
              <li>PAYG estimate: the period gross is annualised, FY{SITE_CONFIG.financialYear} income tax, LITO and the 2% Medicare levy are applied (plus HECS-HELP if selected), and the result is divided back to the pay period. If the tax-free threshold is not claimed, tax scales are applied from the first dollar. Employers&apos; payroll software uses the ATO Schedule 1 coefficients, so figures can differ by a few dollars — use the override field for exact amounts.</li>
              <li>Super Guarantee ({(SUPER_GUARANTEE.rate * 100).toFixed(0)}%) is calculated on ordinary time earnings (ordinary hours plus allowances, excluding overtime).</li>
              <li>YTD totals multiply the current period by the number of pays this financial year — replace with actual YTD figures from payroll records where available.</li>
              <li>All processing is client-side. No names, ABNs or pay figures leave your device.</li>
            </ol>
          </MethodologyDisclosure>

          <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-5 text-sm text-warmgray">
            <strong className="text-navy">Disclaimer:</strong> this tool creates payslip documents and PAYG estimates for
            record-keeping and template purposes. It is not payroll software and does not lodge Single Touch Payroll reports,
            and it is not legal or tax advice. Employers remain responsible for meeting Fair Work and ATO obligations.
          </div>

          {/* FAQs */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <FaqAccordion faqs={PAYSLIP_GENERATOR_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" contentClassName="text-warmgray" />
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </>
  );
}

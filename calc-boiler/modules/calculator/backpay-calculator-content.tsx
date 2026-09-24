// Everything on /backpay-calculator/ below the calculator card: how back pay
// is calculated and taxed, claims, FAQ and sources. A server component, so it
// ships as HTML; backpay-calculator.tsx (client) renders it via `children`.

import Link from "next/link";
import { RelatedSearches, type RelatedSearch } from "@/modules/seo/related-searches";
import FaqAccordion from "@/components/common/faq-accordion";
import { BACKPAY_FAQS, EXAMPLE } from "@/modules/calculator/backpay-calculator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { formatAUD, SOURCES, SITE_CONFIG } from "@/lib/constants";

// Google AU "related searches" for "back pay calculator" and "back pay"
// (Sept 2026), each pointed at the page that answers it.
const RELATED_SEARCHES: readonly RelatedSearch[] = [
  { label: "Back pay tax calculator", href: "/schedule-5-tax-table/" },
  { label: "Salary increase and retro pay calculator", href: "/pay-rise-calculator/" },
  { label: "Award rates", href: "/award-rates/" },
  { label: "Final pay calculator", href: "/final-pay-calculator/" },
  { label: "Superannuation guarantee charge", href: "/super-guarantee-charge/" },
  { label: "Bonus and lump sum tax", href: "/bonus-tax-calculator/" },
];

const SOURCES_LIST: SourceLink[] = [
  { title: "Back payment of wages", url: "https://www.fairwork.gov.au/pay-and-wages/paying-wages", publisher: SOURCES.fwo.name },
  { title: "Schedule 5 — back payments", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
  { title: "Unpaid wages and underpayments", url: "https://www.fairwork.gov.au/pay-and-wages", publisher: SOURCES.fwo.name },
];

export default function BackpayCalculatorContent() {
  return (
    <>
          {/* CONTENT */}
          <div className="max-w-4xl mx-auto space-y-10">

            <section id="what-is-back-pay">
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is Back Pay?</h2>
              <p className="text-warmgray">{BACKPAY_FAQS[0].a}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Backpay Calculated in Australia?</h2>
              <p className="mb-4 text-warmgray">Backpay is the difference between what you <strong>should have been paid</strong> and what you <strong>were actually paid</strong>, multiplied by the total hours worked during the underpayment period. The Fair Work Ombudsman uses a straightforward formula:</p>
              <p className="mb-4 text-warmgray font-medium">(Correct hourly rate - Actual hourly rate) x Total hours worked = Wage shortfall</p>
              <p className="mb-4 text-warmgray">In addition to the wage shortfall, your employer also owes:</p>
              <ul className="list-disc pl-6 space-y-2 text-warmgray">
                <li><strong>Unpaid superannuation:</strong> The 12% SG applies to the underpaid amount. If you were paid {formatAUD(EXAMPLE.actual, 2)}/hr instead of {formatAUD(EXAMPLE.correct, 2)}/hr, your employer owes an additional <strong>{formatAUD(EXAMPLE.superPerHour, 2)}/hr</strong> in super on the {formatAUD(EXAMPLE.diff, 2)} difference.</li>
                <li><strong>Unpaid leave accrual:</strong> Annual leave accrues on ordinary hours. Underpayment means your leave balance was also underpaid when you took or cashed out leave.</li>
                <li><strong>Interest:</strong> In some cases, the Fair Work Ombudsman or courts may award interest on unpaid wages, particularly for prolonged underpayments.</li>
              </ul>
              <p className="mt-4 text-warmgray">Check the correct rate for your role using the <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline font-medium">Award Rates</Link> page, which lists minimum pay rates by industry classification.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Backpay Taxed?</h2>
              <p className="mb-4 text-warmgray">Backpay received as a lump sum is taxed under the ATO&apos;s <Link href="/schedule-5-tax-table/" className="text-eucalyptus-dark hover:underline font-medium">Schedule 5 tax table for back payments</Link>, commissions, bonuses, and similar payments. Your employer withholds tax at a rate that considers your regular earnings plus the lump sum.</p>
              <p className="mb-4 text-warmgray">Back pay is assessed in the year you <strong>receive</strong> it, not the years it relates to. If part of it accrued more than 12 months before payment (reported as <strong>lump sum E</strong>) and that part is 10% or more of your income for the year, the ATO may apply a <strong>lump sum payment in arrears tax offset</strong> so the spike does not cost you more than if you had been paid on time. You don&apos;t apply separately: include the year-by-year breakdown when you lodge and the ATO works it out.</p>
              <p className="text-warmgray">Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> to see how the lump sum affects your tax bracket, or the <Link href="/bonus-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Bonus Tax Guide</Link> for details on lump sum taxation.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Make an Underpayment Claim</h2>
              <p className="mb-4 text-warmgray">If you believe you have been underpaid, follow these <strong>4 steps</strong>:</p>
              <ol className="list-decimal pl-6 space-y-3 text-warmgray">
                <li><strong>Check your correct rate.</strong> Find your award or enterprise agreement on the Fair Work website. Use the <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline font-medium">Award Rates</Link> page to look up your classification and minimum rate.</li>
                <li><strong>Gather evidence.</strong> Collect payslips, time sheets, rosters, bank statements, and your employment contract. Compare the hours worked against the pay received.</li>
                <li><strong>Raise it with your employer.</strong> Many underpayments are genuine errors. Write to your employer (keep a copy) requesting they review your pay and rectify the shortfall.</li>
                <li><strong>Lodge a complaint.</strong> If your employer does not resolve the issue, lodge a complaint with the <strong>Fair Work Ombudsman</strong> online at fairwork.gov.au or call <strong>13 13 94</strong>.</li>
              </ol>
              <p className="mt-4 text-warmgray">Under the Fair Work Act, you generally have <strong>6 years</strong> from when an underpayment happened to recover it. Since 1 January 2025, intentional underpayment can also be a federal criminal offence.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Common Types of Underpayment</h2>
              <p className="mb-4 text-warmgray">The Fair Work Ombudsman identifies <strong>5 common underpayment types</strong> in Australian workplaces:</p>
              <ul className="list-disc pl-6 space-y-2 text-warmgray">
                <li><strong>Below-award base rates:</strong> Paying less than the minimum hourly rate for the employee&apos;s classification level.</li>
                <li><strong>Missing penalty rates:</strong> Not paying weekend, public holiday, or overtime loadings as required by the award. Cafes, pubs and restaurants are the most common source of these claims; check the <Link href="/hospitality-award-rates/" className="text-eucalyptus-dark hover:underline font-medium">Hospitality Award Pay Rates {SITE_CONFIG.financialYear}</Link> if that is your industry.</li>
                <li><strong>Unpaid overtime:</strong> Requiring employees to work before or after shifts without recording or paying the hours.</li>
                <li><strong>Incorrect casual loading:</strong> Paying casual employees without the required 25% casual loading on top of the base rate.</li>
                <li><strong>Super shortfall:</strong> Not paying the 12% superannuation guarantee on all ordinary time earnings. Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link> to verify your employer&apos;s contributions.</li>
              </ul>
            </section>

            <MethodologyDisclosure>
              <ol className="list-decimal space-y-1 pl-4">
                <li>Wage shortfall = (correct rate - actual rate) x hours per week x weeks underpaid.</li>
                <li>Unpaid super = wage shortfall x 12% (SG rate).</li>
                <li>Unpaid leave accrual = wage shortfall x (4/52) for annual leave component.</li>
                <li>Tax estimated at the effective rate derived from the correct annual salary using ATO progressive brackets.</li>
                <li>Super goes directly to the super fund, not to the employee as cash.</li>
              </ol>
              <p className="mt-2">Based on <a className="text-eucalyptus-dark hover:underline" href="https://www.fairwork.gov.au/pay-and-wages" target="_blank" rel="noreferrer noopener">Fair Work Ombudsman</a> guidelines, last verified {SITE_CONFIG.lastVerified}.</p>
            </MethodologyDisclosure>

            <RelatedSearches items={RELATED_SEARCHES} />

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={BACKPAY_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" contentClassName="text-warmgray" />
            </section>

            {/* Related */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/award-rates/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Award Rates</h3>
                  <p className="text-sm text-warmgray">Check the correct minimum rate for your industry and classification</p>
                </Link>
                <Link href="/income-tax-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Income Tax Calculator</h3>
                  <p className="text-sm text-warmgray">See how a backpay lump sum affects your tax bracket</p>
                </Link>
                <Link href="/superannuation-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Superannuation Calculator</h3>
                  <p className="text-sm text-warmgray">Verify your employer is paying the correct 12% SG rate</p>
                </Link>
                <Link href="/bonus-tax-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Bonus Tax Guide</h3>
                  <p className="text-sm text-warmgray">Understand how lump sum payments like backpay are taxed</p>
                </Link>
              </div>
            </section>

            <section className="bg-eucalyptus-light/40 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Check Your Current Pay</h2>
              <p className="text-warmgray mb-6 max-w-lg mx-auto">Make sure your current employer is paying you correctly with our full pay breakdown calculator.</p>
              <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
                Calculate Your Take-Home Pay →
              </Link>
            </section>

            <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
          </div>
    </>
  );
}

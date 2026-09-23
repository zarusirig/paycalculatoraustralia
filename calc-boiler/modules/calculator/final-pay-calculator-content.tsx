// The static long-form content on /final-pay-calculator/. A server component,
// so it ships as HTML; the client module (final-pay-calculator.tsx) renders it
// via `children` below the calculator card.

import Link from "next/link";
import FaqAccordion from "@/components/common/faq-accordion";
import { FINAL_PAY_FAQS } from "./final-pay-calculator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SOURCES, SITE_CONFIG } from "@/lib/constants";

const SOURCES_LIST: SourceLink[] = [
  { title: "Final pay when employment ends", url: "https://www.fairwork.gov.au/ending-employment/final-pay", publisher: SOURCES.fwo.name },
  { title: "Leave entitlements on termination", url: "https://www.fairwork.gov.au/leave/annual-leave#ending-employment", publisher: SOURCES.fwo.name },
  { title: "Tax on unused leave payments", url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/leaving-your-job", publisher: SOURCES.ato.name },
];

export default function FinalPayCalculatorContent() {
  return (
    <>
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Final Pay Calculated in Australia?</h2>
        <p className="mb-4 text-warmgray">Your final pay when leaving a job comprises <strong>5 separate components</strong>, each calculated independently. Most awards require your employer to pay all outstanding entitlements within <strong>7 days</strong> after your last day; where your award or agreement is silent, the Fair Work Act&apos;s general pay rules apply.</p>
        <ol className="list-decimal pl-6 space-y-3 text-warmgray">
          <li><strong>Outstanding wages.</strong> Any hours worked but not yet paid, including the final pay period up to your last day.</li>
          <li><strong>Unused annual leave.</strong> Calculated as (annual salary / 260) x unused leave days. Most awards require <strong>17.5% leave loading</strong> on the payout.</li>
          <li><strong>Notice period pay.</strong> If your employer asks you to leave immediately, they must pay you for the NES notice period (1-4 weeks depending on service). An additional week applies if you are over 45 with 2+ years service.</li>
          <li><strong>Long service leave.</strong> Available after 7+ years of continuous service in most states. Calculated at 8.67 weeks per 10 years of service on a pro-rata basis.</li>
          <li><strong>Redundancy pay.</strong> Only applies if your position is made redundant. NES entitlement ranges from 4-16 weeks based on years of service. Use the <Link href="/redundancy-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Redundancy Pay Calculator</Link> for a detailed breakdown.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Unused Annual Leave Taxed?</h2>
        <p className="mb-4 text-warmgray">Unused annual leave paid on termination is taxed at your <strong>marginal rate</strong> for leave accrued after 17 August 1993. Leave accrued before that date is taxed at a maximum rate of <strong>32%</strong> (including Medicare). The 17.5% leave loading is also taxable.</p>
        <p className="text-warmgray">For most employees, the leave payout is added to your assessable income for the financial year in which you receive it. If the lump sum pushes you into a higher tax bracket, you may be able to request the ATO to assess it separately. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> to estimate the bracket impact.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the NES Notice Period Requirements?</h2>
        <p className="mb-4 text-warmgray">The National Employment Standards set minimum notice periods based on length of service.</p>
        <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm max-w-xl mx-auto">
          <table className="w-full text-sm">
            <thead className="bg-sandstone font-semibold text-navy">
              <tr>
                <th className="px-4 py-3 text-left">Period of Service</th>
                <th className="px-4 py-3 text-right">Notice Period</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">Up to 1 year</td><td className="px-4 py-3 text-right text-navy">1 week</td></tr>
              <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">1 to 3 years</td><td className="px-4 py-3 text-right text-navy">2 weeks</td></tr>
              <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">3 to 5 years</td><td className="px-4 py-3 text-right text-navy">3 weeks</td></tr>
              <tr className="hover:bg-sandstone"><td className="px-4 py-3 text-navy">5+ years</td><td className="px-4 py-3 text-right text-navy">4 weeks</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-warmgray text-center">Employees over 45 with 2+ years of service receive an additional week of notice.</p>
      </section>

      <MethodologyDisclosure>
        <ol className="list-decimal space-y-1 pl-4">
          <li>Leave payout = (annual salary / 260) x unused leave days x 1.175 (with 17.5% loading).</li>
          <li>Notice period = weekly rate x notice weeks.</li>
          <li>Long service leave = (years / 10) x 8.67 weeks x weekly rate (7+ years only).</li>
          <li>Redundancy uses NES entitlement table (4-16 weeks).</li>
          <li>Tax estimated at the effective rate derived from annual salary using ATO progressive brackets.</li>
        </ol>
        <p className="mt-2">Entitlements from <a className="text-eucalyptus-dark hover:underline" href="https://www.fairwork.gov.au/ending-employment/final-pay" target="_blank" rel="noreferrer noopener">Fair Work Ombudsman</a>, last verified {SITE_CONFIG.lastVerified}.</p>
      </MethodologyDisclosure>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
        <FaqAccordion faqs={FINAL_PAY_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" contentClassName="text-warmgray" />
      </section>

      {/* Related */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/redundancy-pay-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
            <h3 className="font-medium text-navy mb-1">Redundancy Pay Calculator</h3>
            <p className="text-sm text-warmgray">Calculate NES redundancy entitlement and tax-free components</p>
          </Link>
          <Link href="/leave-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
            <h3 className="font-medium text-navy mb-1">Leave Calculator</h3>
            <p className="text-sm text-warmgray">Estimate your annual leave and long service leave balance</p>
          </Link>
          <Link href="/income-tax-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
            <h3 className="font-medium text-navy mb-1">Income Tax Calculator</h3>
            <p className="text-sm text-warmgray">See how your final pay affects your total tax liability</p>
          </Link>
          <Link href="/award-rates/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
            <h3 className="font-medium text-navy mb-1">Award Rates</h3>
            <p className="text-sm text-warmgray">Check minimum entitlements under your specific award</p>
          </Link>
        </div>
      </section>

      <section className="bg-eucalyptus-light/40 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Starting a New Job?</h2>
        <p className="text-warmgray mb-6 max-w-lg mx-auto">Calculate your take-home pay at your new employer with our full pay calculator.</p>
        <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
          Calculate Your Take-Home Pay →
        </Link>
      </section>

      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </>
  );
}

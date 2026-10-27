// The static long-form content on /final-pay-calculator/. A server component,
// so it ships as HTML; the client module (final-pay-calculator.tsx) renders it
// via `children` below the calculator card.

import Link from "next/link";
import FaqAccordion from "@/components/common/faq-accordion";
import { FINAL_PAY_FAQS } from "./final-pay-calculator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { EMPLOYMENT, formatPercent, SOURCES, SITE_CONFIG } from "@/lib/constants";
import { COMMON_LEAVE_LOADING } from "@/lib/constants/leave-loading";
import { LSL_JURISDICTIONS } from "@/lib/constants/long-service-leave";

/** Working days in a year on the site's 52-week convention, 5 days a week. */
const WORKING_DAYS_PER_YEAR = EMPLOYMENT.weeksPerYear * 5;
const LOADING = formatPercent(COMMON_LEAVE_LOADING, 1);
/** Long service leave weeks per 10 years: NSW, Vic, Qld, WA, Tas and ACT rate, and the SA and NT rate. */
const lslPer10 = (weeksPerYear: number) => Math.round(weeksPerYear * 10 * 100) / 100;
const LSL_WEEKS_PER_10 = lslPer10(LSL_JURISDICTIONS.vic.weeksPerYear);
const LSL_WEEKS_PER_10_SA_NT = lslPer10(LSL_JURISDICTIONS.sa.weeksPerYear);

const SOURCES_LIST: SourceLink[] = [
  { title: "Final pay when employment ends", url: "https://www.fairwork.gov.au/ending-employment/final-pay", publisher: SOURCES.fwo.name },
  { title: "Leave entitlements on termination", url: "https://www.fairwork.gov.au/leave/annual-leave#ending-employment", publisher: SOURCES.fwo.name },
  { title: "Tax on unused leave payments", url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/leaving-your-job", publisher: SOURCES.ato.name },
];

export default function FinalPayCalculatorContent() {
  return (
    <>
      {/* Lead copy moved here from the hero (26 Sep 2026) so the calculator sits above the fold. */}
      <p className="text-lg text-warmgray">
        Termination pay (final pay) in Australia is the sum of outstanding wages, unused annual leave, any notice paid in lieu, long service leave and, if the role is made redundant, redundancy pay. Unused annual leave is paid at (annual salary &divide; {WORKING_DAYS_PER_YEAR}) &times; leave days, plus {formatPercent(COMMON_LEAVE_LOADING, 1)} leave loading where the award requires it, taxed at the marginal rate in {SITE_CONFIG.financialYear} on a normal resignation or dismissal.
      </p>
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Final Pay Calculated in Australia?</h2>
        <p className="mb-4 text-warmgray">Your final pay when leaving a job comprises <strong>5 separate components</strong>, each calculated independently. Most awards require your employer to pay all outstanding entitlements within <strong>7 days</strong> after your last day; where your award or agreement is silent, the Fair Work Act&apos;s general pay rules apply.</p>
        <ol className="list-decimal pl-6 space-y-3 text-warmgray">
          <li><strong>Outstanding wages.</strong> Any hours worked but not yet paid, including the final pay period up to your last day.</li>
          <li><strong>Unused annual leave.</strong> Calculated as (annual salary / {WORKING_DAYS_PER_YEAR}) x unused leave days. If you get <strong>{LOADING} leave loading</strong> when you take annual leave, the payout includes it too.</li>
          <li><strong>Notice period pay.</strong> If your employer asks you to leave immediately, they must pay you for the NES notice period (1-4 weeks depending on service). An additional week applies if you are over 45 with 2+ years service.</li>
          <li><strong>Long service leave.</strong> Set by each state and territory, not the NES. A pro-rata payout on termination can start at {LSL_JURISDICTIONS.vic.proRataFromYears} years of continuous service ({LSL_JURISDICTIONS.nsw.proRataFromYears} years in NSW and the ACT), and in some states it is paid before 10 years only for certain reasons of leaving. It accrues at {LSL_WEEKS_PER_10} weeks per 10 years of service in NSW, Victoria, Queensland, WA, Tasmania and the ACT, and {LSL_WEEKS_PER_10_SA_NT} weeks per 10 years in SA and the NT. Use the <Link href="/long-service-leave-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Long Service Leave Calculator</Link> for your state&apos;s rules.</li>
          <li><strong>Redundancy pay.</strong> Only applies if your position is made redundant. NES entitlement ranges from 4-16 weeks based on years of service. Use the <Link href="/redundancy-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Redundancy Pay Calculator</Link> for a detailed breakdown.</li>
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Unused Annual Leave Taxed?</h2>
        <p className="mb-4 text-warmgray">On a normal termination (resignation, dismissal or retirement), unused annual leave accrued after 17 August 1993 is taxed at your <strong>marginal rate</strong>. Leave accrued before 18 August 1993 is taxed at a maximum rate of <strong>32%</strong> (including Medicare). If your job ends through genuine redundancy, invalidity or an early retirement scheme, all unused annual leave is taxed at a maximum of 32%, whatever the accrual date. The {LOADING} leave loading is taxed the same way as the leave.</p>
        <p className="text-warmgray">On a normal termination, the payout for leave accrued after 17 August 1993 is added to your salary and wages for the financial year in which you receive it. Only the part of your income above a bracket threshold is taxed at the higher rate, not your whole income. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> to estimate the bracket impact.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the NES Notice Period Requirements?</h2>
        <p className="mb-4 text-warmgray">The National Employment Standards set the minimum notice period your employer must give, based on your length of continuous service.</p>
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
          <li>Leave payout = (annual salary / {WORKING_DAYS_PER_YEAR}) x unused leave days x {1 + COMMON_LEAVE_LOADING} (with {LOADING} loading).</li>
          <li>Notice period = weekly rate x notice weeks.</li>
          <li>Long service leave = (years / 10) x {LSL_WEEKS_PER_10} weeks x weekly rate (7+ years only). This is the rate in six states and territories. SA and the NT give {LSL_WEEKS_PER_10_SA_NT} weeks per 10 years, so the estimate uses a lower rate than the one that applies there.</li>
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

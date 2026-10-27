// The static long-form content on /employment-type-calculator/. Server
// component, so it ships as HTML; the client module renders it via `children`.

import Link from "next/link";
import FaqAccordion from "@/components/common/faq-accordion";
import { EMPLOYMENT_TYPE_FAQS } from "@/modules/calculator/employment-type-calculator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { EMPLOYMENT, formatPercent, SOURCES, SITE_CONFIG, SUPER_GUARANTEE } from "@/lib/constants";
import { EMPLOYEE_CHOICE } from "@/lib/constants/casual-conversion";

const LOADING = formatPercent(EMPLOYMENT.casualLoading, 0);
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);
const HOURS = EMPLOYMENT.standardWeeklyHours;
// Same basis as the FAQ (employment-type-calculator-faqs.ts): 260 paid days a
// year on the 52-week convention, and roughly 8 national public holidays.
const WORKING_DAYS = EMPLOYMENT.weeksPerYear * 5;
const PUBLIC_HOLIDAYS = 8;
const ANNUAL_LEAVE_DAYS = EMPLOYMENT.annualLeaveWeeks * 5;
const PAID_DAYS_OFF = ANNUAL_LEAVE_DAYS + EMPLOYMENT.personalLeaveDays + PUBLIC_HOLIDAYS;
const DAYS_WORKED = WORKING_DAYS - PAID_DAYS_OFF;
const share = (days: number) => formatPercent(days / WORKING_DAYS, 1);
// Casual pay for the days a permanent employee works, against permanent pay
// for the whole year: (1 + loading) x days worked / paid days - 1.
const CASUAL_PREMIUM = formatPercent((1 + EMPLOYMENT.casualLoading) * DAYS_WORKED / WORKING_DAYS - 1, 1);
const LEAVE_ON_DAYS_WORKED = formatPercent(PAID_DAYS_OFF / DAYS_WORKED, 0);

const SOURCES_LIST: SourceLink[] = [
  { title: "Employment types", url: "https://www.fairwork.gov.au/starting-employment/types-of-employees", publisher: SOURCES.fwo.name },
  { title: "Casual loading and entitlements", url: "https://www.fairwork.gov.au/starting-employment/types-of-employees/casual-employees", publisher: SOURCES.fwo.name },
  { title: "National minimum wage", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages", publisher: SOURCES.fwo.name },
];

export default function EmploymentTypeCalculatorContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">

      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do Full-Time, Part-Time, and Casual Compare?</h2>
        <p className="mb-4 text-warmgray">The three main employment types in Australia differ in <strong>hours, entitlements, and pay structure</strong>. While casual employees receive a higher hourly rate through the {LOADING} casual loading, permanent employees receive paid leave and greater job security.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-navy mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Full-Time</h3>
            <ul className="space-y-1 text-sm text-warmgray list-disc pl-4">
              <li>{HOURS} hours per week (standard)</li>
              <li>{EMPLOYMENT.annualLeaveWeeks} weeks annual leave</li>
              <li>{EMPLOYMENT.personalLeaveDays} days personal/sick leave</li>
              <li>Ongoing employment</li>
              <li>Notice period required</li>
            </ul>
          </div>
          <div className="bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-navy mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Part-Time</h3>
            <ul className="space-y-1 text-sm text-warmgray list-disc pl-4">
              <li>Under {HOURS} hours, regular schedule</li>
              <li>Pro-rata annual leave</li>
              <li>Pro-rata personal leave</li>
              <li>Ongoing employment</li>
              <li>Notice period required</li>
            </ul>
          </div>
          <div className="bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-navy mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Casual</h3>
            <ul className="space-y-1 text-sm text-warmgray list-disc pl-4">
              <li>No guaranteed hours</li>
              <li>{LOADING} casual loading</li>
              <li>No paid annual or sick leave</li>
              <li>No notice period required</li>
              <li>Can refuse shifts</li>
            </ul>
          </div>
        </div>
        <p className="text-warmgray">Use the <Link href="/hourly-to-annual-salary-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Hourly to Annual Salary Calculator</Link> to convert your hourly rate to an annual figure, or check the <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline font-medium">Award Rates</Link> page for your industry&apos;s minimum pay rates.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Is the 25% Casual Loading Worth It?</h2>
        <p className="mb-4 text-warmgray">The {LOADING} casual loading is designed to compensate for the absence of paid leave, notice of termination, and redundancy pay. To determine whether casual is better for you, consider the <strong>total value of permanent entitlements</strong>:</p>
        <ul className="list-disc pl-6 space-y-2 text-warmgray">
          <li><strong>Annual leave:</strong> {EMPLOYMENT.annualLeaveWeeks} weeks paid leave = {share(ANNUAL_LEAVE_DAYS)} of annual earnings</li>
          <li><strong>Personal/sick leave:</strong> {EMPLOYMENT.personalLeaveDays} days = {share(EMPLOYMENT.personalLeaveDays)} of annual earnings</li>
          <li><strong>Public holidays:</strong> ~{PUBLIC_HOLIDAYS} days paid = ~{share(PUBLIC_HOLIDAYS)} of annual earnings</li>
          <li><strong>Notice period:</strong> 1-5 weeks guaranteed = varies</li>
          <li><strong>Redundancy pay:</strong> 4-16 weeks after 1+ years = varies</li>
        </ul>
        <p className="mt-4 text-warmgray">Annual leave, personal leave and public holidays together are about {PAID_DAYS_OFF} paid days off: <strong>{share(PAID_DAYS_OFF)}</strong> of a permanent employee&apos;s annual pay, or {LEAVE_ON_DAYS_WORKED} on top of the pay for the {DAYS_WORKED} days they actually work. Compared day for day, the {LOADING} casual loading pays about <strong>{CASUAL_PREMIUM} more</strong> than permanent employment once that paid leave is counted, before notice and redundancy pay. For long-term employment, permanent roles generally offer better total value. The loading and the weekend penalties it stacks on are set by your award: see the <Link href="/retail-award-rates/" className="text-eucalyptus-dark hover:underline font-medium">Retail Award Pay Rates {SITE_CONFIG.financialYear}</Link> and the <Link href="/hospitality-award-rates/" className="text-eucalyptus-dark hover:underline font-medium">Hospitality Award Pay Rates {SITE_CONFIG.financialYear}</Link>.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Casual Conversion Rights</h2>
        <p className="mb-4 text-warmgray">Since {EMPLOYEE_CHOICE.startDate}, a casual employee who has worked for their employer for at least <strong>{EMPLOYEE_CHOICE.minMonths} months ({EMPLOYEE_CHOICE.minMonthsSmallBusiness} months for a small business employer with fewer than 15 employees)</strong> and believes they no longer meet the casual definition can notify their employer in writing that they want to become permanent. The employer must respond in writing within {EMPLOYEE_CHOICE.responseDays} days. The employer can refuse only if the employee still meets the casual definition, if there are fair and reasonable operational grounds, or if the change would breach a recruitment or selection process required by law. Employers are no longer required to offer conversion.</p>
        <p className="text-warmgray">To compare the entitlements of each employment type, see the <Link href="/full-time-vs-part-time-vs-casual/" className="text-eucalyptus-dark hover:underline font-medium">Full-Time vs Part-Time vs Casual</Link> guide. To calculate your superannuation entitlements under any employment type, use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link>.</p>
      </section>

      <MethodologyDisclosure>
        <ol className="list-decimal space-y-1 pl-4">
          <li>Full-time annual earnings = hourly rate x {HOURS} hours x {EMPLOYMENT.weeksPerYear} weeks.</li>
          <li>Part-time annual earnings = hourly rate x selected hours x {EMPLOYMENT.weeksPerYear} weeks.</li>
          <li>Casual annual earnings = hourly rate x {1 + EMPLOYMENT.casualLoading} (casual loading) x selected hours x {EMPLOYMENT.weeksPerYear} weeks.</li>
          <li>Leave value = hourly rate x weekly hours x {EMPLOYMENT.annualLeaveWeeks} weeks (annual) or {EMPLOYMENT.personalLeaveDays / 5} weeks (personal/sick).</li>
          <li>Super = {SG} of annual earnings for all employment types.</li>
          <li>Tax calculated using ATO FY{SITE_CONFIG.financialYear} progressive brackets with LITO and Medicare levy.</li>
        </ol>
        <p className="mt-2">Entitlements from <a className="text-eucalyptus-dark hover:underline" href="https://www.fairwork.gov.au/starting-employment/types-of-employees" target="_blank" rel="noreferrer noopener">Fair Work Ombudsman</a>, last verified {SITE_CONFIG.lastVerified}.</p>
      </MethodologyDisclosure>

      {/* FAQ */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
        <FaqAccordion faqs={EMPLOYMENT_TYPE_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" contentClassName="text-warmgray" />
      </section>

      {/* Related */}
      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/award-rates/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
            <h3 className="font-medium text-navy mb-1">Award Rates</h3>
            <p className="text-sm text-warmgray">Check minimum pay rates for your industry and classification</p>
          </Link>
          <Link href="/leave-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
            <h3 className="font-medium text-navy mb-1">Leave Calculator</h3>
            <p className="text-sm text-warmgray">Calculate your annual leave and personal leave entitlements</p>
          </Link>
          <Link href="/hourly-to-annual-salary-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
            <h3 className="font-medium text-navy mb-1">Hourly to Annual Salary Calculator</h3>
            <p className="text-sm text-warmgray">Convert any hourly rate to annual, weekly, or fortnightly salary</p>
          </Link>
          <Link href="/superannuation-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
            <h3 className="font-medium text-navy mb-1">Superannuation Calculator</h3>
            <p className="text-sm text-warmgray">See the {SG} SG contribution on any employment type</p>
          </Link>
        </div>
      </section>

      <section className="bg-eucalyptus-light/40 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See Your Full Pay Breakdown</h2>
        <p className="text-warmgray mb-6 max-w-lg mx-auto">See your pay after income tax, the Medicare levy and HECS repayment, plus your super, for full-time, part-time or casual work.</p>
        <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
          Calculate Your Take-Home Pay →
        </Link>
      </section>

      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </div>
  );
}

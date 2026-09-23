// The static long-form content on /employment-type-calculator/. Server
// component, so it ships as HTML; the client module renders it via `children`.

import Link from "next/link";
import FaqAccordion from "@/components/common/faq-accordion";
import { EMPLOYMENT_TYPE_FAQS } from "@/modules/calculator/employment-type-calculator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SOURCES, SITE_CONFIG } from "@/lib/constants";

const SOURCES_LIST: SourceLink[] = [
  { title: "Employment types", url: "https://www.fairwork.gov.au/employment-conditions/types-of-employees", publisher: SOURCES.fwo.name },
  { title: "Casual loading and entitlements", url: "https://www.fairwork.gov.au/employment-conditions/types-of-employees/casual-employees", publisher: SOURCES.fwo.name },
  { title: "National minimum wage", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages", publisher: SOURCES.fwo.name },
];

export default function EmploymentTypeCalculatorContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">

      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do Full-Time, Part-Time, and Casual Compare?</h2>
        <p className="mb-4 text-warmgray">The three main employment types in Australia differ in <strong>hours, entitlements, and pay structure</strong>. While casual employees receive a higher hourly rate through the 25% casual loading, permanent employees receive paid leave and greater job security.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-navy mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Full-Time</h3>
            <ul className="space-y-1 text-sm text-warmgray list-disc pl-4">
              <li>38 hours per week (standard)</li>
              <li>4 weeks annual leave</li>
              <li>10 days personal/sick leave</li>
              <li>Ongoing employment</li>
              <li>Notice period required</li>
            </ul>
          </div>
          <div className="bg-white border border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-navy mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Part-Time</h3>
            <ul className="space-y-1 text-sm text-warmgray list-disc pl-4">
              <li>Under 38 hours, regular schedule</li>
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
              <li>25% casual loading</li>
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
        <p className="mb-4 text-warmgray">The 25% casual loading is designed to compensate for the absence of paid leave, notice of termination, and redundancy pay. To determine whether casual is better for you, consider the <strong>total value of permanent entitlements</strong>:</p>
        <ul className="list-disc pl-6 space-y-2 text-warmgray">
          <li><strong>Annual leave:</strong> 4 weeks paid leave = 7.7% of annual earnings</li>
          <li><strong>Personal/sick leave:</strong> 10 days = 3.8% of annual earnings</li>
          <li><strong>Public holidays:</strong> ~8 days paid = ~3.1% of annual earnings</li>
          <li><strong>Notice period:</strong> 1-5 weeks guaranteed = varies</li>
          <li><strong>Redundancy pay:</strong> 4-16 weeks after 1+ years = varies</li>
        </ul>
        <p className="mt-4 text-warmgray">The combined value of leave alone (annual + personal + public holidays) is approximately <strong>14.6%</strong> of annual earnings &mdash; meaning the 25% casual loading only provides a <strong>~10% premium</strong> over permanent employment once leave is accounted for. For long-term employment, permanent roles generally offer better total value.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Casual Conversion Rights</h2>
        <p className="mb-4 text-warmgray">Since 26 August 2024, a casual employee who has worked for their employer for at least <strong>6 months (12 months for a small business employer with fewer than 15 employees)</strong> and believes they no longer meet the casual definition can notify their employer that they want to become permanent. The employer must respond in writing within 21 days and can only refuse on fair and reasonable operational grounds. Employers are no longer required to offer conversion.</p>
        <p className="text-warmgray">For a detailed comparison guide, see our <Link href="/full-time-vs-part-time-vs-casual/" className="text-eucalyptus-dark hover:underline font-medium">Full-Time vs Part-Time vs Casual</Link> guide. To calculate your superannuation entitlements under any employment type, use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link>.</p>
      </section>

      <MethodologyDisclosure>
        <ol className="list-decimal space-y-1 pl-4">
          <li>Full-time annual earnings = hourly rate x 38 hours x 52 weeks.</li>
          <li>Part-time annual earnings = hourly rate x selected hours x 52 weeks.</li>
          <li>Casual annual earnings = hourly rate x 1.25 (casual loading) x selected hours x 52 weeks.</li>
          <li>Leave value = hourly rate x weekly hours x 4 weeks (annual) or 2 weeks (personal/sick).</li>
          <li>Super = 12% of annual earnings for all employment types.</li>
          <li>Tax calculated using ATO FY{SITE_CONFIG.financialYear} progressive brackets with LITO and Medicare levy.</li>
        </ol>
        <p className="mt-2">Entitlements from <a className="text-eucalyptus-dark hover:underline" href="https://www.fairwork.gov.au/employment-conditions/types-of-employees" target="_blank" rel="noreferrer noopener">Fair Work Ombudsman</a>, last verified {SITE_CONFIG.lastVerified}.</p>
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
            <p className="text-sm text-warmgray">See the 12% SG contribution on any employment type</p>
          </Link>
        </div>
      </section>

      <section className="bg-eucalyptus-light/40 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See Your Full Pay Breakdown</h2>
        <p className="text-warmgray mb-6 max-w-lg mx-auto">Get the complete picture with income tax, Medicare, HECS, and super for any employment type.</p>
        <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
          Calculate Your Take-Home Pay →
        </Link>
      </section>

      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </div>
  );
}

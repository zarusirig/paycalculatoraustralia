// Everything on /second-job-tax-calculator/ below the calculator card: the
// withholding explainer, tables, FAQ and sources. A server component, so it
// ships as HTML; second-job-tax-calculator.tsx (client) renders it via `children`.

import Link from "next/link";
import { RelatedSearches, type RelatedSearch } from "@/modules/seo/related-searches";
import FaqAccordion from "@/components/common/faq-accordion";
import {
  BOTH_JOB,
  BOTH_TFT_DEBT,
  EXAMPLE_BALANCE,
  MAIN_JOB,
  NO_TFT_START_RATE,
  SECOND_JOB,
  SECOND_JOB_FAQS,
} from "./second-job-tax-calculator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
  formatPercent,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";
import { PAYG_FINANCIAL_YEAR, withholdingForPeriod } from "@/lib/constants/payg-withholding";

/**
 * Annual PAYG withheld on a second job paid fortnightly with the tax-free
 * threshold NOT claimed — ATO Schedule 1 scale 1 (NAT 1006 coefficients),
 * which already includes the Medicare levy. Replaces a flat "30% + 2%"
 * approximation that overstated withholding on small second jobs.
 */
function noTftAnnualWithholding(annual: number): number {
  if (annual <= 0) return 0;
  return withholdingForPeriod(annual / 26, "fortnightly", "noTft") * 26;
}

// Fortnightly second-job pay amounts for the "tax rate on a second job" table.
const SECOND_JOB_FORTNIGHTLY = [250, 500, 750, 1_000, 1_500, 2_000] as const;

// Google AU "related searches" for "second job tax calculator" and "tax rate
// on second job" (Sept 2026), each pointed at the page that answers it.
const RELATED_SEARCHES: readonly RelatedSearch[] = [
  { label: "No tax-free threshold rate", href: "/payg-withholding-tables/" },
  { label: "Tax-free threshold on a second job", href: "/tax-free-threshold/" },
  { label: "Tax withheld calculator", href: "/tax-withheld-calculator/" },
  { label: "Weekly tax calculator", href: "/weekly-pay-calculator/" },
  { label: "Fortnightly tax calculator", href: "/fortnightly-pay-calculator/" },
  { label: "Tax return calculator", href: "/tax-return-calculator/" },
];

const SOURCES_LIST: SourceLink[] = [
  { title: "PAYG withholding — no tax-free threshold", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
  { title: "Tax-free threshold eligibility", url: "https://www.ato.gov.au/individuals-and-families/tax-file-number", publisher: SOURCES.ato.name },
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

export default function SecondJobTaxCalculatorContent() {
  return (
    <>
          {/* CONTENT SECTIONS */}
          <div className="max-w-4xl mx-auto space-y-10">

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Why Is My Second Job Taxed More?</h2>
              <p className="mb-4 text-warmgray">Your second job is not actually taxed at a higher rate. The ATO taxes your <strong>combined income</strong> using the same progressive brackets. The difference is in how tax is <strong>withheld</strong> throughout the year.</p>
              <p className="mb-4 text-warmgray">On your primary job, you claim the <strong>tax-free threshold of $18,200</strong>. Your employer factors this into PAYG withholding, so the first $18,200 has no tax withheld. On your second job, you do not claim the threshold. Your second employer withholds tax from the <strong>first dollar</strong> using the no-threshold scale, which starts at {NO_TFT_START_RATE}, so your second pay packet looks smaller.</p>
              <p className="text-warmgray">At tax time, the ATO calculates your actual liability on your <strong>total combined income</strong>. Because the no-threshold scale withholds as if the second job were your only income, it usually withholds <strong>too little</strong> once your main job reaches a higher bracket: with a {formatAUD(MAIN_JOB)} main job and a {formatAUD(SECOND_JOB)} second job, {EXAMPLE_BALANCE < 0 ? <>you would owe about <strong>{formatAUD(-EXAMPLE_BALANCE)}</strong></> : <>you would get about <strong>{formatAUD(EXAMPLE_BALANCE)}</strong> back</>}. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> to see how progressive brackets work on your combined income.</p>
            </section>

            {/* PAA / snippet target: "tax rate on second job", "Do you get taxed 50% on your second job?" */}
            <section id="second-job-tax-rate">
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Tax Rate on a Second Job?</h2>
              <p className="mb-4 text-warmgray">
                There is no special second job tax rate in Australia. The income is taxed at your marginal rate on your combined income; only the <strong>withholding</strong> differs, because the second employer uses the ATO&apos;s no-tax-free-threshold scale. That scale starts at {NO_TFT_START_RATE}, and it never reaches 50% &mdash; the table shows what it takes from each fortnightly pay in {PAYG_FINANCIAL_YEAR}.
              </p>
              <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
                <table className="w-full text-sm">
                  <caption className="sr-only">Tax withheld from a second job each fortnight, no tax-free threshold, {PAYG_FINANCIAL_YEAR}</caption>
                  <thead className="bg-sandstone font-semibold text-navy">
                    <tr>
                      <th className="px-4 py-3 text-left">Second job pay per fortnight</th>
                      <th className="px-4 py-3 text-right">Tax withheld</th>
                      <th className="px-4 py-3 text-right">Withholding rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {SECOND_JOB_FORTNIGHTLY.map((gross) => {
                      const withheld = withholdingForPeriod(gross, "fortnightly", "noTft");
                      return (
                        <tr key={gross}>
                          <td className="px-4 py-3 font-medium text-navy">{formatAUD(gross)}</td>
                          <td className="px-4 py-3 text-right text-navy">{formatAUD(withheld)}</td>
                          <td className="px-4 py-3 text-right text-warmgray">{formatPercent(withheld / gross)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-warmgray">ATO Schedule 1 scale 1 (no tax-free threshold), Medicare levy included, no HECS-HELP. If you have not given the employer your tax file number, it must withhold at the no-TFN rate instead.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Tax-Free Threshold Explained</h2>
              <p className="mb-4 text-warmgray">The tax-free threshold is the first <strong>$18,200</strong> of annual income on which no income tax is payable. Every Australian resident taxpayer is entitled to this threshold, but you can only claim it with <strong>one employer</strong> at a time.</p>
              <p className="mb-4 text-warmgray">When you start a new job, your <Link href="/tax-file-number-declaration/" className="text-eucalyptus-dark hover:underline font-medium">Tax File Number Declaration</Link> asks whether you want to claim the tax-free threshold. If you tick &quot;yes&quot; on both jobs, both employers withhold less tax, and you end up with a <strong>tax debt</strong> at the end of the financial year &mdash; about <strong>{formatAUD(BOTH_TFT_DEBT)}</strong> on two {formatAUD(BOTH_JOB)} jobs.</p>
              <p className="text-warmgray">Always claim the threshold on the <strong>higher-paying job</strong> to minimise under-withholding. See the <Link href="/payg-withholding-tables/" className="text-eucalyptus-dark hover:underline font-medium">PAYG Withholding Tables</Link> for the exact withholding rates with and without the threshold.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Optimise Tax Across Two Jobs</h2>
              <p className="mb-4 text-warmgray">Workers with two jobs can take <strong>3 practical steps</strong> to manage their tax position throughout the financial year.</p>
              <ol className="list-decimal pl-6 space-y-3 text-warmgray">
                <li><strong>Claim the tax-free threshold on the higher-paying job only.</strong> This ensures maximum withholding on the secondary income, reducing the risk of a year-end tax debt.</li>
                <li><strong>Request additional withholding.</strong> If you know the standard no-TFT rate will under-withhold, submit a withholding variation to the ATO or ask your employer to withhold extra from each pay.</li>
                <li><strong>Set aside tax from your second job.</strong> Put 30% of your second job income into a separate savings account. Any amount not needed for tax at EOFY becomes a bonus.</li>
              </ol>
              <p className="mt-4 text-warmgray">Use the <Link href="/tax-return-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Tax Return Calculator</Link> mid-year to estimate whether you are on track for a refund or a debt, and adjust your withholding accordingly.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Second Job Tax Comparison Table</h2>
              <p className="mb-4 text-warmgray">The table below shows how withholding and actual tax differ at common second job income levels, assuming a primary job salary of <strong>$60,000</strong>.</p>
              <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-4 py-3 text-left">Job 2 Salary</th>
                        <th className="px-4 py-3 text-right">Job 2 Withheld</th>
                        <th className="px-4 py-3 text-right">Actual Tax on Job 2</th>
                        <th className="px-4 py-3 text-right">Est. Refund</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {[10000, 20000, 30000, 50000, 80000].map((s) => {
                        const j2Withheld = noTftAnnualWithholding(s);
                        const totalInc = 60000 + s;
                        const combTax = Math.max(0, Math.round(calculateIncomeTax(totalInc) - calculateLITO(totalInc))) + calculateMedicareLevy(totalInc);
                        const j1Tax = Math.max(0, Math.round(calculateIncomeTax(60000) - calculateLITO(60000))) + calculateMedicareLevy(60000);
                        const actualJ2Tax = combTax - j1Tax;
                        const refund = j2Withheld - actualJ2Tax;
                        return (
                          <tr key={s} className="hover:bg-sandstone">
                            <td className="px-4 py-3 font-medium text-navy">{formatAUD(s)}</td>
                            <td className="px-4 py-3 text-right text-navy">{formatAUD(j2Withheld)}</td>
                            <td className="px-4 py-3 text-right text-navy">{formatAUD(actualJ2Tax)}</td>
                            <td className={`px-4 py-3 text-right font-medium ${refund >= 0 ? "text-eucalyptus-dark" : "text-ochre"}`}>{refund >= 0 ? "+" : ""}{formatAUD(refund)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="mt-3 text-sm text-warmgray">Refund estimates are approximate. Actual results depend on deductions claimed and total assessable income. See the <Link href="/tax-brackets/" className="text-eucalyptus-dark hover:underline font-medium">Australian tax brackets</Link> for the full rate schedule.</p>
            </section>

            <MethodologyDisclosure>
              <ol className="list-decimal space-y-1 pl-4">
                <li>Job 1 tax uses standard resident progressive brackets with LITO applied.</li>
                <li>Job 2 withholding applies the ATO&apos;s {PAYG_FINANCIAL_YEAR} Schedule 1 &quot;no tax-free threshold&quot; scale (which includes the Medicare levy) to fortnightly pay.</li>
                <li>Combined actual liability applies progressive brackets to total income from both jobs.</li>
                <li>Estimated refund = total withheld across both jobs minus actual combined tax liability.</li>
              </ol>
              <p className="mt-2">All rates from the <a className="text-eucalyptus-dark hover:underline" href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents" target="_blank" rel="noreferrer noopener">ATO</a>, last verified {SITE_CONFIG.lastVerified}.</p>
            </MethodologyDisclosure>

            <RelatedSearches items={RELATED_SEARCHES} />

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={SECOND_JOB_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" contentClassName="text-warmgray" />
            </section>

            {/* Related calculators */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/income-tax-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Income Tax Calculator</h3>
                  <p className="text-sm text-warmgray">See your bracket-by-bracket tax breakdown on any salary</p>
                </Link>
                <Link href="/tax-return-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Tax Return Calculator</h3>
                  <p className="text-sm text-warmgray">Estimate your refund or tax debt at the end of the financial year</p>
                </Link>
                <Link href="/payg-withholding-tables/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">PAYG Withholding Tables</h3>
                  <p className="text-sm text-warmgray">View exact PAYG withholding amounts with and without the tax-free threshold</p>
                </Link>
                <Link href="/tax-brackets/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                  <h3 className="font-medium text-navy mb-1">Tax Brackets Guide</h3>
                  <p className="text-sm text-warmgray">Understand how progressive tax brackets apply to your combined income</p>
                </Link>
              </div>
            </section>

            {/* CTA */}
            <section className="bg-eucalyptus-light/40 rounded-2xl p-8 text-center">
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>See Your Full Pay Breakdown</h2>
              <p className="text-warmgray mb-6 max-w-lg mx-auto">Get the complete picture across both jobs with income tax, Medicare, HECS, and super.</p>
              <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
                Calculate Your Take-Home Pay →
              </Link>
            </section>

            <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
          </div>
    </>
  );
}

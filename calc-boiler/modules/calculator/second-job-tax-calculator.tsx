"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
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

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "PAYG withholding — no tax-free threshold", url: "https://www.ato.gov.au/tax-rates-and-codes/payg-withholding-schedule/schedule-1-statement-of-formulas-for-calculating-amounts-to-be-withheld", publisher: SOURCES.ato.name },
  { title: "Tax-free threshold eligibility", url: "https://www.ato.gov.au/individuals-and-families/tax-file-number/claim-the-tax-free-threshold", publisher: SOURCES.ato.name },
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

export default function SecondJobTaxCalculatorPage() {
  const [job1Salary, setJob1Salary] = useState(60_000);
  const [job2Salary, setJob2Salary] = useState(25_000);

  const result = useMemo(() => {
    // Job 1: WITH tax-free threshold (normal resident calculation)
    const job1RawTax = calculateIncomeTax(job1Salary);
    const job1LITO = calculateLITO(job1Salary);
    const job1NetTax = Math.max(0, Math.round(job1RawTax - job1LITO));
    const job1Medicare = calculateMedicareLevy(job1Salary);
    const job1TotalWithheld = job1NetTax + job1Medicare;
    const job1TakeHome = job1Salary - job1TotalWithheld;

    // Job 2: WITHOUT tax-free threshold (no TFT withholding)
    // Approximate: tax on combined income minus tax on job 1 income
    // This models the marginal tax effect of a second job
    const job2Withholding = job2Salary > 0 ? Math.round(job2Salary * 0.3) : 0;
    const job2Medicare = calculateMedicareLevy(job2Salary);
    const job2TotalWithheld = job2Withholding + job2Medicare;
    const job2TakeHome = job2Salary - job2TotalWithheld;

    // Combined actual tax liability at EOFY
    const totalIncome = job1Salary + job2Salary;
    const combinedRawTax = calculateIncomeTax(totalIncome);
    const combinedLITO = calculateLITO(totalIncome);
    const combinedNetTax = Math.max(0, Math.round(combinedRawTax - combinedLITO));
    const combinedMedicare = calculateMedicareLevy(totalIncome);
    const actualTotalTax = combinedNetTax + combinedMedicare;
    const actualTakeHome = totalIncome - actualTotalTax;

    // Refund or debt
    const totalWithheld = job1TotalWithheld + job2TotalWithheld;
    const refundOrDebt = totalWithheld - actualTotalTax;

    // Effective rates
    const job1EffectiveRate = job1Salary > 0 ? job1TotalWithheld / job1Salary : 0;
    const job2EffectiveRate = job2Salary > 0 ? job2TotalWithheld / job2Salary : 0;
    const combinedEffectiveRate = totalIncome > 0 ? actualTotalTax / totalIncome : 0;

    return {
      job1NetTax, job1Medicare, job1TotalWithheld, job1TakeHome, job1EffectiveRate,
      job2Withholding, job2Medicare, job2TotalWithheld, job2TakeHome, job2EffectiveRate,
      totalIncome, combinedNetTax, combinedMedicare, actualTotalTax, actualTakeHome,
      totalWithheld, refundOrDebt, combinedEffectiveRate,
    };
  }, [job1Salary, job2Salary]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* HERO */}
          <section className="bg-eucalyptus-light/40 rounded-2xl p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <nav aria-label="breadcrumb">
                <ol className="flex items-center space-x-1 text-sm text-warmgray">
                  <li><Link className="hover:text-eucalyptus-dark hover:underline" href="/">Pay Calculator</Link></li>
                  <li className="flex items-center"><ChevronRight className="h-3 w-3 text-gray-400" /></li>
                  <li><span className="font-medium text-navy" aria-current="page">Second Job Tax Calculator</span></li>
                </ol>
              </nav>
              <div className="flex justify-between items-start mb-4 mt-4">
                <h1 className="text-3xl md:text-4xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  Second Job Tax Calculator Australia 2025-26
                </h1>
              </div>
              <p className="text-xl text-warmgray">
                Calculate the tax impact of working two jobs. See why your second job appears to be taxed more, how PAYG withholding works without the tax-free threshold, and your estimated refund at tax time.
              </p>
              <TrustBar className="mt-4" />
            </div>
          </section>

          {/* CALCULATOR */}
          <section className="max-w-4xl mx-auto">
            <Card className="shadow-md">
              <CardContent className="p-6 md:p-8">
                <h2 className="text-xl font-semibold text-navy mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Calculate Tax on Two Jobs</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Inputs */}
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <div>
                      <label htmlFor="job1" className="block text-sm font-medium text-navy mb-1">Job 1 — Annual Salary (with tax-free threshold)</label>
                      <div className="flex items-center">
                        <span className="text-warmgray-light mr-2">$</span>
                        <input type="number" id="job1" min={0} max={300000} step={1000} value={job1Salary}
                          onChange={(e) => setJob1Salary(clamp(Number(e.target.value || 0), 0, 300000))}
                          className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                      </div>
                      <input type="range" min={0} max={200000} step={5000} className="mt-2 w-full accent-eucalyptus" aria-hidden="true"
                        value={clamp(job1Salary, 0, 200000)} onChange={(e) => setJob1Salary(Number(e.target.value))} />
                    </div>
                    <div>
                      <label htmlFor="job2" className="block text-sm font-medium text-navy mb-1">Job 2 — Annual Salary (no tax-free threshold)</label>
                      <div className="flex items-center">
                        <span className="text-warmgray-light mr-2">$</span>
                        <input type="number" id="job2" min={0} max={300000} step={1000} value={job2Salary}
                          onChange={(e) => setJob2Salary(clamp(Number(e.target.value || 0), 0, 300000))}
                          className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm" />
                      </div>
                      <input type="range" min={0} max={200000} step={5000} className="mt-2 w-full accent-eucalyptus" aria-hidden="true"
                        value={clamp(job2Salary, 0, 200000)} onChange={(e) => setJob2Salary(Number(e.target.value))} />
                    </div>
                    <button type="submit" className="w-full bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200">
                      Calculate Second Job Tax
                    </button>
                  </form>

                  {/* Results */}
                  <div className="space-y-4">
                    {/* Job 1 breakdown */}
                    <Card className="bg-sandstone border-0 shadow-none" role="region" aria-live="polite">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold text-navy mb-2">Job 1 — With Tax-Free Threshold</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span className="text-warmgray">Gross</span><span className="font-medium text-navy">{formatAUD(job1Salary)}</span></div>
                          <div className="flex justify-between"><span className="text-warmgray">Tax + Medicare</span><span className="font-medium text-navy">-{formatAUD(result.job1TotalWithheld)}</span></div>
                          <div className="flex justify-between"><span className="font-semibold text-navy">Take-Home</span><span className="font-bold text-eucalyptus-dark">{formatAUD(result.job1TakeHome)}</span></div>
                          <div className="text-xs text-warmgray-light">Effective rate: {formatPercent(result.job1EffectiveRate)}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Job 2 breakdown */}
                    <Card className="bg-sandstone border-0 shadow-none">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold text-navy mb-2">Job 2 — No Tax-Free Threshold</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span className="text-warmgray">Gross</span><span className="font-medium text-navy">{formatAUD(job2Salary)}</span></div>
                          <div className="flex justify-between"><span className="text-warmgray">Tax + Medicare</span><span className="font-medium text-navy">-{formatAUD(result.job2TotalWithheld)}</span></div>
                          <div className="flex justify-between"><span className="font-semibold text-navy">Take-Home</span><span className="font-bold text-eucalyptus-dark">{formatAUD(result.job2TakeHome)}</span></div>
                          <div className="text-xs text-warmgray-light">Effective rate: {formatPercent(result.job2EffectiveRate)}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Combined EOFY */}
                    <Card className="bg-white border border-sandstone-dark/20 shadow-sm">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold text-navy mb-2">Combined — End of Financial Year</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between"><span className="text-warmgray">Combined Income</span><span className="font-medium text-navy">{formatAUD(result.totalIncome)}</span></div>
                          <div className="flex justify-between"><span className="text-warmgray">Total Withheld</span><span className="font-medium text-navy">-{formatAUD(result.totalWithheld)}</span></div>
                          <div className="flex justify-between"><span className="text-warmgray">Actual Tax Liability</span><span className="font-medium text-navy">-{formatAUD(result.actualTotalTax)}</span></div>
                          <div className="border-t border-sandstone-dark/20 my-2" />
                          <div className="flex justify-between">
                            <span className="font-semibold text-navy">{result.refundOrDebt >= 0 ? "Estimated Refund" : "Estimated Tax Debt"}</span>
                            <span className={`text-lg font-bold ${result.refundOrDebt >= 0 ? "text-eucalyptus-dark" : "text-ochre"}`}>
                              {result.refundOrDebt >= 0 ? "+" : ""}{formatAUD(result.refundOrDebt)}
                            </span>
                          </div>
                          <div className="text-xs text-warmgray-light">Combined effective rate: {formatPercent(result.combinedEffectiveRate)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-6">
                  <div className="bg-sandstone border-l-4 border-eucalyptus p-4 text-sm text-warmgray">
                    <p className="font-medium mb-1">Disclaimer:</p>
                    <p>This calculator provides estimates based on current ATO PAYG withholding schedules. Job 2 withholding uses an approximate &quot;no tax-free threshold&quot; rate. Your actual refund or debt depends on deductions, offsets, and other income. For personal tax advice, consult a registered tax agent.</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-warmgray border-t border-sandstone-dark/20 pt-4">
                  <p className="flex items-center">
                    <ShieldCheck className="w-4 h-4 text-eucalyptus mr-2" />
                    <span>Based on official ATO tax tables for FY{SITE_CONFIG.financialYear}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CONTENT SECTIONS */}
          <div className="max-w-4xl mx-auto space-y-10">

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Why Is My Second Job Taxed More?</h2>
              <p className="mb-4 text-warmgray">Your second job is not actually taxed at a higher rate. The ATO taxes your <strong>combined income</strong> using the same progressive brackets. The difference is in how tax is <strong>withheld</strong> throughout the year.</p>
              <p className="mb-4 text-warmgray">On your primary job, you claim the <strong>tax-free threshold of $18,200</strong>. Your employer factors this into PAYG withholding, so the first $18,200 has no tax withheld. On your second job, you do not claim the threshold. Your second employer withholds tax from the <strong>first dollar</strong> at approximately 30%, which makes your second pay packet look much smaller.</p>
              <p className="text-warmgray">At tax time, the ATO calculates your actual liability on your <strong>total combined income</strong>. If the total withheld exceeds the actual liability, you receive a refund. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> to see how progressive brackets work on your combined income.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Tax-Free Threshold Explained</h2>
              <p className="mb-4 text-warmgray">The tax-free threshold is the first <strong>$18,200</strong> of annual income on which no income tax is payable. Every Australian resident taxpayer is entitled to this threshold, but you can only claim it with <strong>one employer</strong> at a time.</p>
              <p className="mb-4 text-warmgray">When you start a new job, your <Link href="/tax-file-number-declaration/" className="text-eucalyptus-dark hover:underline font-medium">Tax File Number Declaration</Link> asks whether you want to claim the tax-free threshold. If you tick &quot;yes&quot; on both jobs, both employers withhold less tax, and you end up with a <strong>tax debt</strong> at the end of the financial year &mdash; often between $2,000 and $5,000.</p>
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
                        const j2Withheld = Math.round(s * 0.3) + calculateMedicareLevy(s);
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
                <li>Job 2 withholding approximates the &quot;no tax-free threshold&quot; PAYG rate at ~30% plus 2% Medicare levy.</li>
                <li>Combined actual liability applies progressive brackets to total income from both jobs.</li>
                <li>Estimated refund = total withheld across both jobs minus actual combined tax liability.</li>
              </ol>
              <p className="mt-2">All rates from the <a className="text-eucalyptus-dark hover:underline" href="https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents" target="_blank" rel="noreferrer noopener">ATO</a>, last verified {SITE_CONFIG.lastVerified}.</p>
            </MethodologyDisclosure>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="space-y-3">
                <AccordionItem value="why-more" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Why is my second job taxed more?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Your second job is not actually taxed at a higher rate. The <strong>tax-free threshold ($18,200)</strong> is only claimed on your primary job. Your second employer withholds tax from the first dollar without the threshold benefit, making each pay packet smaller. At tax time, the ATO calculates your actual liability on combined income &mdash; you often receive a refund.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="tft-higher" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Should I claim the tax-free threshold on my higher-paying job?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Yes. Always claim the threshold on the job that pays the most. This ensures the largest portion of your income benefits from the $18,200 tax-free amount, reducing the chance of a tax debt.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="refund" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Will I get a tax refund from my second job?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Possibly. The &quot;no tax-free threshold&quot; withholding rate often <strong>over-withholds</strong> tax from your second job. When you lodge your return, if total withholding exceeds your actual liability, you receive a refund. Use the <Link href="/tax-return-calculator/" className="text-eucalyptus-dark hover:underline">Tax Return Calculator</Link> to estimate your refund.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="declare" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Do I need to declare my second job to the ATO?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Yes. All income must be reported on your tax return. Each employer reports your earnings via Single Touch Payroll (STP), so the ATO already has records of both jobs. You do not need to separately notify the ATO, but you must declare both sources when lodging your return.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="both-tft" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>What happens if I claim the tax-free threshold on both jobs?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Both employers withhold less tax, assuming you earn under $18,200 at each job. At tax time, the ATO combines your income and calculates the correct tax &mdash; you will almost certainly owe a <strong>tax debt of $2,000&ndash;$5,000</strong> or more, depending on your earnings.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="super" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Does my second employer pay superannuation?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Yes. Both employers must pay the <strong>12% superannuation guarantee</strong> on your ordinary time earnings, regardless of whether you claim the tax-free threshold. Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to check contributions from each job.</p></AccordionContent>
                </AccordionItem>
              </Accordion>
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
        </div>
      </div>
    </div>
  );
}

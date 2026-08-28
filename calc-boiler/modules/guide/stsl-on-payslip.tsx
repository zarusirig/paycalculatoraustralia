"use client";

import Link from "next/link";
import { ChevronRight, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SOURCES, formatAUD } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Study and training support loans rates and repayment thresholds", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: SOURCES.ato.name },
  { title: "Tax tables overview (STSL schedules)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
  { title: "Compulsory repayments", url: "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/compulsory-repayments", publisher: SOURCES.ato.name },
];

// FY2026-27 STSL settings (verified 2 July 2026 against the ATO schedule)
const STSL_THRESHOLD_2026_27 = 69_528;

export default function STSLOnPayslipPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/understanding-your-payslip/" className="hover:text-eucalyptus-dark hover:underline">Understanding Your Payslip</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">STSL on Payslip</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            What Is STSL on Your Payslip?
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-2">
            STSL stands for <strong>Study and Training Support Loans</strong>. On your payslip, STSL is the extra tax your employer withholds each pay cycle to cover the compulsory repayment of your HECS-HELP, FEE-HELP, VET Student Loan, or other study loan. It only applies once your income passes the repayment threshold.
          </p>
          <p className="text-sm text-warmgray-light mb-6">Updated: 2 July 2026 — reflects FY2026-27 thresholds.</p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="what-does-stsl-stand-for">
              <h2>What Does STSL Stand For?</h2>
              <p>
                STSL is the ATO&apos;s umbrella term for every Australian government study and training loan. Payroll software uses the STSL label because the same withholding rules apply to all of these loan types &mdash; not just HECS. Older payslips may show the same deduction as &quot;HECS&quot;, &quot;HELP&quot;, or &quot;SFSS&quot;; they all mean the same thing.
              </p>
              <div className="overflow-x-auto not-prose my-6">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="px-4 py-3 text-left font-semibold">Loan Type</th>
                      <th className="px-4 py-3 text-left font-semibold">Who Has It</th>
                    </tr>
                  </thead>
                  <tbody className="text-navy divide-y divide-gray-100">
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">HECS-HELP</td><td className="px-4 py-2">University students in Commonwealth supported places</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">FEE-HELP</td><td className="px-4 py-2">Full-fee-paying university students</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">VET Student Loans</td><td className="px-4 py-2">Diploma and above vocational courses</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">SA-HELP</td><td className="px-4 py-2">Student amenities fees deferred to a loan</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">ABSTUDY SSL / SSL</td><td className="px-4 py-2">Student Start-up Loan recipients</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Australian Apprenticeship Support Loans</td><td className="px-4 py-2">Eligible apprentices (formerly Trade Support Loans)</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="why-is-stsl-on-my-payslip">
              <h2>Why Is STSL Being Deducted From Your Pay?</h2>
              <p>
                STSL appears on your payslip because you answered <strong>yes</strong> to the study loan question on your <Link href="/tax-file-number-declaration/">Tax File Number declaration</Link> when you started your job, and your pay is now high enough that the ATO requires extra withholding. Two conditions must both be true:
              </p>
              <ul>
                <li><strong>You told your employer you have a study loan.</strong> Payroll flags your record, and the ATO&apos;s STSL withholding schedules activate.</li>
                <li><strong>Your earnings exceed the repayment threshold for your pay cycle.</strong> For FY2026-27 the annual threshold is <strong>{formatAUD(STSL_THRESHOLD_2026_27)}</strong> &mdash; roughly {formatAUD(Math.round(STSL_THRESHOLD_2026_27 / 52))} per week or {formatAUD(Math.round(STSL_THRESHOLD_2026_27 / 26))} per fortnight before STSL withholding begins.</li>
              </ul>
              <p>
                If STSL suddenly appeared after a pay rise, that is usually the reason: your per-pay earnings crossed the threshold. Casual and variable-hour workers may see STSL in big weeks and not in quiet ones, because the schedules apply to each pay period independently.
              </p>
            </section>

            <section id="how-is-stsl-calculated">
              <h2>How Is the STSL Amount Calculated?</h2>
              <p>
                Your employer does not calculate your actual HECS repayment. Instead, payroll software looks up your gross earnings for the pay period in the ATO&apos;s <strong>STSL component tax tables</strong> &mdash; published alongside the standard <Link href="/payg-withholding-tables/">PAYG withholding tables</Link> &mdash; and withholds the listed extra amount on top of normal income tax.
              </p>
              <p>
                The tables are built from the annual repayment bands. For FY2026-27, compulsory repayments are <strong>15c per dollar of repayment income above {formatAUD(STSL_THRESHOLD_2026_27)}</strong> (rising to 17c above {formatAUD(129_717)}, and 10% of total repayment income from {formatAUD(186_051)}). Use our <Link href="/hecs-help-calculator/">HECS repayment calculator</Link> to see your annual figure and weekly impact at any salary.
              </p>
            </section>

            <section id="worked-example">
              <h2>Worked Example: STSL on an $80,000 Salary</h2>
              <p>
                An employee earning <strong>{formatAUD(80_000)}</strong> a year, paid fortnightly, with a HECS debt declared on their TFN declaration would see a payslip like this:
              </p>
              <div className="overflow-x-auto not-prose my-6">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="px-4 py-3 text-left font-semibold">Payslip Line</th>
                      <th className="px-4 py-3 text-right font-semibold">Amount (Fortnightly)</th>
                    </tr>
                  </thead>
                  <tbody className="text-navy divide-y divide-gray-100">
                    <tr className="bg-white"><td className="px-4 py-2">Gross pay</td><td className="px-4 py-2 text-right">$3,076.92</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2">PAYG withholding (income tax)</td><td className="px-4 py-2 text-right">≈ $630</td></tr>
                    <tr className="bg-white font-semibold"><td className="px-4 py-2">STSL component</td><td className="px-4 py-2 text-right text-ochre">≈ $60</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2">Net pay</td><td className="px-4 py-2 text-right font-semibold">≈ $2,387</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm">
                The STSL line tracks the annual repayment: at {formatAUD(80_000)}, the FY2026-27 compulsory repayment is <strong>{formatAUD(1_571)}</strong> a year, which is about <strong>$60 per fortnight</strong>. Figures are rounded &mdash; the exact withholding comes from the ATO STSL tax tables for your pay cycle. Cross-check your own payslip with our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>.
              </p>
            </section>

            <section id="stsl-vs-actual-repayment">
              <h2>STSL Withholding vs Your Actual Annual Repayment</h2>
              <p>
                The STSL amounts on your payslip are <strong>estimates held as a credit</strong> &mdash; they do not come off your loan balance during the year. When you lodge your tax return, the ATO calculates your real compulsory repayment from your full-year <em>repayment income</em> (taxable income plus reportable super, fringe benefits, net investment losses, and exempt foreign income) and applies the STSL credits against it.
              </p>
              <ul>
                <li><strong>Too much withheld?</strong> Common if your income varied, you worked part of the year, or you have deductions. The excess comes back in your tax refund.</li>
                <li><strong>Too little withheld?</strong> Common with second jobs (no STSL withheld if each job is under the threshold), salary sacrifice, or investment income. You will owe the shortfall at assessment.</li>
                <li><strong>Timing quirk:</strong> because credits are applied at assessment, your HELP balance is still indexed on 1 June on its full outstanding amount &mdash; the year&apos;s withholding does not reduce it beforehand.</li>
              </ul>
              <p>
                A second job is the most common cause of an STSL shortfall. If you work two jobs, check our <Link href="/second-job-tax-calculator/">Second Job Tax Calculator</Link> to see your combined position, and read the <Link href="/hecs-help-calculator/">HECS-HELP guide</Link> for repayment strategies.
              </p>
            </section>

            <section id="stop-stsl">
              <h2>How to Stop STSL Deductions After Paying Off Your Loan</h2>
              <p>
                Employers keep withholding STSL until you tell them to stop &mdash; the ATO does not notify payroll automatically. Once your loan balance reaches zero:
              </p>
              <ol>
                <li><strong>Check your balance</strong> in ATO online services (via myGov) under Loan accounts. Remember the year&apos;s withheld STSL has not been applied yet if you haven&apos;t lodged your return.</li>
                <li><strong>Give your employer a Withholding Declaration</strong> (or update your details in their payroll portal) stating you no longer have a study loan debt.</li>
                <li><strong>Payroll removes the STSL flag</strong> and the deduction stops from the next pay run.</li>
              </ol>
              <p>
                If you forget, nothing is lost &mdash; the extra withholding is refunded when you lodge your tax return &mdash; but you are giving the ATO an interest-free loan from every pay in the meantime.
              </p>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose space-y-3">
                <AccordionItem value="same-as-hecs" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Is STSL the same as HECS?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Effectively yes for most people. STSL (Study and Training Support Loans) is the ATO&apos;s umbrella term covering HECS-HELP, FEE-HELP, VET Student Loans, SA-HELP, and apprenticeship loans. If your only loan is HECS, the STSL line on your payslip is your HECS withholding.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="suddenly-appeared" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Why did STSL suddenly appear on my payslip?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">Usually because a pay rise, extra hours, or a bonus pushed your per-pay earnings above the repayment threshold (annualised {formatAUD(STSL_THRESHOLD_2026_27)} for FY2026-27), or because you updated your TFN declaration to declare a study loan.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="overpaid" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>What happens if too much STSL is withheld?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">The excess is refunded when you lodge your tax return. STSL withholding is a prepayment estimate &mdash; your actual repayment is calculated on full-year repayment income at assessment, and any overpayment comes back as part of your refund.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="reduce-debt" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Does STSL withholding reduce my HELP debt straight away?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">No. Withheld STSL sits as a credit with the ATO until your tax return is assessed. Your loan balance &mdash; including 1 June indexation &mdash; is only reduced at assessment. Voluntary repayments are the only way to reduce the balance mid-year.</p></AccordionContent>
                </AccordionItem>
                <AccordionItem value="two-jobs" className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>Why is no STSL withheld at my second job?</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">STSL schedules apply per employer. If each job individually pays under the threshold, neither withholds STSL &mdash; but your combined repayment income may still trigger a compulsory repayment at tax time. Budget for this or ask one employer to withhold extra.</p></AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="not-prose mt-10 space-y-6">
              <MethodologyDisclosure>
                <ol className="list-decimal space-y-1 pl-4">
                  <li>STSL withholding follows the ATO STSL component tax tables for each pay cycle.</li>
                  <li>Annual figures use the FY2026-27 repayment bands: nil to {formatAUD(STSL_THRESHOLD_2026_27)}; 15c per $1 to {formatAUD(129_717)}; {formatAUD(9_028)} + 17c per $1 to {formatAUD(186_050)}; 10% of total repayment income above that.</li>
                  <li>Worked-example PAYG figures are rounded estimates for illustration.</li>
                </ol>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="2 July 2026" />
              {(() => { const a = getGuideAuthorship("stsl-on-payslip"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Content</h3>
                  <div className="space-y-3">
                    <Link href="/hecs-help-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">HECS Repayment Calculator</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/understanding-your-payslip/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Understanding Your Payslip</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/payg-withholding-tables/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">PAYG Withholding Tables</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/hecs-help-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">HECS-HELP Guide</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <GraduationCap className="h-6 w-6 text-eucalyptus-light" />
                    <h3 className="text-lg font-bold">Check Your HECS Impact</h3>
                  </div>
                  <p className="text-eucalyptus-light text-sm mb-4">Enter your salary to see your exact FY2026-27 HECS repayment and how much STSL should be coming out of each pay.</p>
                  <Link href="/hecs-help-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    HECS Repayment Calculator
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

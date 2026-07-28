"use client";
import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "TFN declaration", url: "https://www.ato.gov.au/forms-and-instructions/tfn-declaration", publisher: SOURCES.ato.name },
  { title: "Choosing a super fund", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/choosing-a-super-fund", publisher: SOURCES.ato.name },
  { title: "Starting a new job", url: "https://www.fairwork.gov.au/starting-employment", publisher: SOURCES.fwo.name },
  { title: "Pay slips", url: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips", publisher: SOURCES.fwo.name },
];

export default function NewJobChecklistPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">New Job Checklist</span></li></ol></nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>New Job Pay Checklist — Set Up Your Pay Correctly From Day One</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">Starting a new job involves more than just showing up. From TFN declarations to super fund choice and verifying your first pay, this checklist ensures you get paid correctly and do not leave money on the table.</p>
          <TrustBar className="!max-w-none" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ───── SECTION 1: Before Your First Day ───── */}
            <section id="before-first-day">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Before Your First Day</h2>
              <p>
                Use this checklist before you start to understand the full value of your new role and avoid common pay mistakes.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Understand Your Salary Package</h3>
              <ul>
                <li>{"✅"} <strong>Confirm total package vs base salary.</strong> Some offers quote a &quot;total remuneration package&quot; that includes super. A $100,000 total package means your cash salary is approximately <strong>$89,286</strong> with $10,714 going to super (12%). A $100,000 base salary plus super means you receive $100,000 in cash and $12,000 in super — a total value of $112,000.</li>
                <li>{"✅"} <strong>Check for salary sacrifice availability.</strong> Ask whether your new employer offers salary sacrifice into super or a novated lease. Pre-tax salary sacrifice reduces your taxable income and can save thousands in tax. See our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model the tax savings.</li>
                <li>{"✅"} <strong>Verify the applicable award or enterprise agreement.</strong> If your role is covered by a modern award, check the minimum pay rates for your classification level. Use our <Link href="/award-rates/">Award Rates Guide</Link> to confirm your offer meets or exceeds the award minimum.</li>
              </ul>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Review Your Employment Contract</h3>
              <ul>
                <li>{"✅"} <strong>Employment type:</strong> Full-time, part-time, or casual. Casual employees receive a <strong>25% loading</strong> but do not receive paid leave entitlements.</li>
                <li>{"✅"} <strong>Pay frequency:</strong> Weekly, fortnightly, or monthly — this affects your cash flow planning.</li>
                <li>{"✅"} <strong>Notice period:</strong> Standard is 1-4 weeks depending on tenure, but contracts may specify different terms.</li>
                <li>{"✅"} <strong>Probation period:</strong> Most new roles include a 3-6 month probationary period with reduced notice requirements.</li>
                <li>{"✅"} <strong>Leave entitlements:</strong> Full-time employees receive 4 weeks annual leave and 10 days personal/carer&apos;s leave per year under the National Employment Standards.</li>
              </ul>
            </section>

            {/* ───── SECTION 2: First Week Paperwork ───── */}
            <section id="first-week-paperwork">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>First Week Paperwork</h2>
              <p>
                Complete these administrative tasks in your first week to ensure your pay, tax, and super are set up correctly.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>TFN Declaration</h3>
              <ul>
                <li>{"✅"} <strong>Complete the TFN Declaration form</strong> (NAT 3092). Your employer will provide this or you can download it from the ATO website.</li>
                <li>{"✅"} <strong>Tax-free threshold:</strong> Claim the $18,200 tax-free threshold only if this is your <strong>highest-paying job</strong> (or only job). If you have another job where you already claim it, select &quot;No&quot;.</li>
                <li>{"✅"} <strong>HECS-HELP debt:</strong> If you have a student loan, tick &quot;Yes&quot; — your employer will withhold additional amounts for HELP repayments once your income exceeds the threshold ($69,528 in FY2026-27).</li>
                <li>{"✅"} <strong>Submit within 28 days</strong> of starting. Without this form, your employer withholds tax at the highest rate (47%).</li>
              </ul>
              <p>
                For a complete walkthrough, see our <Link href="/tax-file-number-declaration/">TFN Declaration Guide</Link>.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Super Fund Choice</h3>
              <ul>
                <li>{"✅"} <strong>Provide your existing super fund details</strong> (fund name, USI, and member number) to avoid creating a new account with default fees.</li>
                <li>{"✅"} <strong>If you do not have a fund,</strong> compare options at the ATO&apos;s YourSuper comparison tool or accept the employer&apos;s default fund.</li>
                <li>{"✅"} <strong>Consolidate multiple accounts.</strong> If you have super from previous jobs in different funds, consider rolling them into one fund to reduce fees. You can do this through myGov.</li>
              </ul>
              <p>
                Your employer must pay super at the <strong>12% SG rate</strong> into your chosen fund. Learn more in our <Link href="/superannuation-guide/">Superannuation Guide</Link>.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Bank Details and Other Setup</h3>
              <ul>
                <li>{"✅"} <strong>Provide your bank account details</strong> (BSB and account number) for salary deposits.</li>
                <li>{"✅"} <strong>Emergency contact details</strong> for workplace safety records.</li>
                <li>{"✅"} <strong>Tax residency status</strong> — confirm you are an Australian resident for tax purposes to ensure correct withholding rates.</li>
              </ul>
            </section>

            {/* ───── SECTION 3: First Pay Checks ───── */}
            <section id="first-pay-checks">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>First Pay — What to Check</h2>
              <p>
                When you receive your first payslip, verify these items immediately. Errors caught early are easiest to fix.
              </p>
              <ul>
                <li>{"✅"} <strong>Verify gross pay matches your contract.</strong> For salaried employees, divide your annual salary by the number of pay periods (26 for fortnightly, 12 for monthly). For hourly workers, check hours multiplied by your rate.</li>
                <li>{"✅"} <strong>Check tax withholding is reasonable.</strong> Use our <Link href="/">Pay Calculator</Link> to compare expected vs actual PAYG withholding. If tax seems too high, confirm your TFN declaration was processed and the tax-free threshold applied.</li>
                <li>{"✅"} <strong>Confirm super is being paid.</strong> Super may not appear on your first payslip if it has not yet been processed. Check your super fund online portal within <strong>28 days of the end of the quarter</strong> to confirm the contribution arrived.</li>
                <li>{"✅"} <strong>Check leave balances are accruing.</strong> Full-time employees accrue annual leave from day one. After your first pay period, you should see leave balance appearing on your payslip or in your employer&apos;s HR system.</li>
                <li>{"✅"} <strong>Review allowances and loadings.</strong> If your contract or award includes shift penalties, overtime rates, or allowances (meal, travel, uniform), verify these are being applied correctly.</li>
              </ul>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Verify Your Pay</h3>
                    <p className="text-navy text-sm mb-3">Enter your salary to check that your payslip deductions match what you should be paying in tax.</p>
                    <Link href="/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Use our Pay Calculator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ───── SECTION 4: Salary Negotiation ───── */}
            <section id="salary-negotiation">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Understanding Total Package Value</h2>
              <p>
                When evaluating a job offer, look beyond the base salary number. The total value of a compensation package includes several components:
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Component</th><th className="px-5 py-3">Example ($90k base)</th><th className="px-5 py-3">Notes</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">Base salary</td><td className="px-5 py-3">$90,000</td><td className="px-5 py-3">Cash salary before tax</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Superannuation (12%)</td><td className="px-5 py-3">$10,800</td><td className="px-5 py-3">Paid by employer into your super fund</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Salary sacrifice (if available)</td><td className="px-5 py-3">$5,000 – $15,000</td><td className="px-5 py-3">Pre-tax contributions reduce taxable income</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Leave entitlements</td><td className="px-5 py-3">~$7,600</td><td className="px-5 py-3">4 weeks annual leave = 7.7% of base</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Other benefits</td><td className="px-5 py-3">Varies</td><td className="px-5 py-3">Parking, health insurance, bonuses, WFH equipment</td></tr>
                      <tr className="font-semibold text-navy"><td className="px-5 py-3">Total package value</td><td className="px-5 py-3">$108,400+</td><td className="px-5 py-3">True value of the position</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                When negotiating, ask about salary sacrifice options, bonus structures, and professional development budgets. A $5,000 salary sacrifice into super saves approximately <strong>$1,625</strong> in tax for someone in the 37% bracket compared to receiving the same amount as cash salary. Model different scenarios with our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link>.
              </p>
            </section>

            {/* ───── SECTION 5: FAQs ───── */}
            <section id="faqs">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">

                <AccordionItem value="tax-free-both" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Should I claim the tax-free threshold at my new job?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">If this is your <strong>only job</strong>, always claim the tax-free threshold. If you are transitioning from one job to another with no overlap, claim it at your new employer and your old employer&apos;s withholding stops when you leave. If you are keeping two jobs simultaneously, only claim the threshold at the <strong>highest-paying</strong> one.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="existing-super" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Should I use my existing super fund or the employer&apos;s default?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">In most cases, use your <strong>existing fund</strong> to avoid creating multiple accounts that erode your balance with duplicate fees and insurance premiums. Provide your fund&apos;s name, USI (Unique Superannuation Identifier), and member number to your new employer. Compare fees before switching — if the employer&apos;s default fund has significantly lower fees, it may be worth switching.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="how-long-first-pay" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How long until I receive my first pay?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">This depends on when you start relative to the pay cycle. If you start on Monday and the pay cycle ends Friday, your first pay arrives the following pay day. In the worst case, you may wait up to <strong>3-4 weeks</strong> for your first pay if you start just after a pay cycle ends and the employer processes the next full cycle before paying you.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="old-job-leave" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What happens to unused leave from my old job?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Unused annual leave must be paid out by your old employer in your final pay. Long service leave payout depends on your state and how long you worked there. These payouts are taxable income. Sick/personal leave is <strong>not paid out</strong> — it has no cash value when you leave.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="probation" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does probation affect my pay or entitlements?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">No. During probation you receive the <strong>same pay, super, and leave entitlements</strong> as after probation. The only difference is that the notice period for termination is typically shorter (usually 1 week). Your employer cannot pay you less during probation than what is specified in your contract or the applicable award.</AccordionContent>
                </AccordionItem>

                <AccordionItem value="hecs-new-job" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I need to tell my new employer about HECS-HELP debt?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. On your TFN Declaration, tick &quot;Yes&quot; if you have a HELP, VSL, SFSS, or TSL debt. Your employer withholds additional amounts once your income exceeds the compulsory repayment threshold (<strong>$69,528</strong> for FY2026-27). If you do not declare your debt, you may face a lump sum repayment when you lodge your tax return.</AccordionContent>
                </AccordionItem>

              </Accordion>
            </section>

            <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Employment and pay setup information is sourced from the Australian Taxation Office (ATO) and the Fair Work Ombudsman (FWO). Superannuation calculations use the FY2025-26 SG rate of 12%. Tax withholding amounts are based on current PAYG withholding tables. Award rates and minimum entitlements are set by the Fair Work Commission.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("new-job-checklist"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
          </article>
          <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6">
            <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Tools</h3><div className="space-y-3"><SidebarLink href="/tax-file-number-declaration/" label="TFN Declaration Guide" /><SidebarLink href="/superannuation-guide/" label="Superannuation Guide" /><SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" /><SidebarLink href="/understanding-your-payslip/" label="Understanding Your Payslip" /><SidebarLink href="/award-rates/" label="Award Rates Guide" /><SidebarLink href="/first-job-pay-guide/" label="First Job Pay Guide" /></div></CardContent></Card>
            <Card className="bg-sky-600 border-none text-white shadow-md"><CardContent className="p-6"><h3 className="text-lg font-bold mb-2">Check your new pay</h3><p className="text-sky-100 text-sm mb-4">Enter your new salary to see take-home pay, tax, and super contributions.</p><Link href="/" className="block w-full py-2.5 px-4 bg-white text-sky-700 font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">Pay Calculator →</Link></CardContent></Card>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

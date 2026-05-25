"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
const SOURCES_LIST: SourceLink[] = [
  { title: "Parental Leave Pay", url: "https://www.servicesaustralia.gov.au/parental-leave-pay", publisher: SOURCES.servicesAustralia.name },
  { title: "Paid Parental Leave scheme", url: "https://www.fairwork.gov.au/leave/parental-leave", publisher: SOURCES.fwo.name },
  { title: "Tax treatment of government payments", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/income-you-must-declare/government-payments-and-allowances", publisher: SOURCES.ato.name },
];

export default function ParentalLeavePayPage() {
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Parental Leave Pay</span></li></ol></nav>
      <header className="mb-10 max-w-4xl"><h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Parental Leave Pay Guide 2025-26</h1><p className="text-xl text-warmgray leading-relaxed mb-6">Government-funded Parental Leave Pay: eligibility, payment rates, how many weeks you get, and how it interacts with employer-paid leave. This Australian tax and payroll guide covers the full Paid Parental Leave scheme for FY2025-26, including income tests, work tests, superannuation on PLP, keeping in touch days, and how parental leave pay affects your take-home pay and salary.</p><TrustBar className="!max-w-none" /></header>
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          {/* ── SECTION 1: What Is Paid Parental Leave in Australia? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is Paid Parental Leave in Australia?</h2>
            <p>&quot;Paid Parental Leave&quot; (PLP) is a government-funded payment of up to <strong>24 weeks at the national minimum wage</strong> for eligible working parents of newborn or recently adopted children in the 2025-26 financial year. The scheme is administered by Services Australia under the <em>Paid Parental Leave Act 2010</em> and is separate from any employer-funded parental leave entitlement.</p>
            <p>PLP replaced the previous Baby Bonus in 2011 and has expanded significantly since. Both birth parents and non-birth parents (including fathers, partners, and adoptive parents) are eligible to share the entitlement. The payment is not means-tested on household income &mdash; only the individual claimant&apos;s adjusted taxable income is assessed. Unlike employer-funded leave, PLP is paid at a flat rate regardless of your usual salary, which means the payment functions differently from your normal take-home pay after tax.</p>
            <p>For employees earning above the national minimum wage, PLP represents a reduction in weekly income compared to full pay. Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to model the difference between your regular salary and PLP payments during your leave period.</p>
          </section>

          {/* ── SECTION 2: How Much Is Parental Leave Pay? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Is Parental Leave Pay?</h2>
            <p>Parental Leave Pay is <strong>$183.00 per day ($915.00 per week before tax)</strong> for FY2025-26, based on the national minimum wage rate. The total maximum payment for 24 weeks is <strong>$21,960 before tax</strong>.</p>
            <p>PLP is paid for weekdays only (5 days per week). The rate adjusts each year on 1 July in line with Fair Work Commission minimum wage decisions. Tax is withheld from each payment before you receive it, so the actual amount deposited into your bank account is lower than $915 per week.</p>
            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-navy text-white"><th className="p-3 text-left">Period</th><th className="p-3 text-left">Weekly Rate (Before Tax)</th><th className="p-3 text-left">Daily Rate</th><th className="p-3 text-left">Total Weeks</th><th className="p-3 text-left">Max Total Payment</th></tr></thead>
                <tbody className="text-warmgray">
                  <tr className="border-b border-sandstone"><td className="p-3 font-semibold">FY2025-26</td><td className="p-3">$915.00</td><td className="p-3">$183.00</td><td className="p-3">24 weeks</td><td className="p-3">$21,960</td></tr>
                  <tr className="border-b border-sandstone bg-sandstone/30"><td className="p-3">FY2024-25</td><td className="p-3">$882.75</td><td className="p-3">$176.55</td><td className="p-3">22 weeks</td><td className="p-3">$19,420.50</td></tr>
                  <tr className="border-b border-sandstone"><td className="p-3">FY2023-24</td><td className="p-3">$882.75</td><td className="p-3">$176.55</td><td className="p-3">20 weeks</td><td className="p-3">$17,655</td></tr>
                  <tr className="border-b border-sandstone bg-sandstone/30"><td className="p-3">FY2026-27 (planned)</td><td className="p-3">TBC (min wage increase)</td><td className="p-3">TBC</td><td className="p-3">26 weeks</td><td className="p-3">TBC</td></tr>
                </tbody>
              </table>
            </div>
            <p>The payment is made either by your employer through their normal payroll cycle (with PAYG tax withheld at your usual rate) or directly by Services Australia. When Services Australia pays you directly, tax is withheld at <strong>15%</strong> by default unless you request a different withholding rate by lodging a <em>Withholding declaration</em>. Understanding how income tax brackets work helps you estimate your actual after-tax PLP amount &mdash; see our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> for a detailed breakdown.</p>
          </section>

          {/* ── SECTION 3: Who Is Eligible for Parental Leave Pay? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Is Eligible for Parental Leave Pay?</h2>
            <p>Eligibility for Parental Leave Pay requires meeting <strong>4 tests: residency, work, income, and care</strong>. Both birth parents and non-birth parents (fathers, partners, adoptive parents) are eligible to claim, and both can share the total entitlement.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Work Test</h3>
            <p>The work test requires <strong>10 out of the 13 months</strong> before the child&apos;s birth or adoption date to have been worked, with at least <strong>330 hours</strong> in that 10-month period. This averages to roughly <strong>1 day per week</strong> (approximately 7.6 hours). Qualifying work includes paid employment, self-employment, and certain unpaid work in a family business. Paid leave counts as work. Dangerous job leave, pregnancy-related illness leave, and family or domestic violence leave are treated as qualifying days.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Income Test</h3>
            <p>The individual income test threshold is <strong>$168,865</strong> for FY2025-26. This test applies to the claimant&apos;s individual adjusted taxable income in the financial year before the claim or the financial year before the child&apos;s birth &mdash; whichever is more favourable. Household or partner income is not assessed. The income threshold increases annually and is indexed to wage growth.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Residency and Care Tests</h3>
            <p>The claimant must be an Australian resident (for social security purposes) on the day the child is born or adopted and on every day PLP is received. The claimant must be the primary carer of the child during the PLP period. Primary care means the child is in the claimant&apos;s care and the claimant meets the child&apos;s daily needs.</p>

            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-navy text-white"><th className="p-3 text-left">Eligibility Test</th><th className="p-3 text-left">Requirement</th><th className="p-3 text-left">Key Detail</th></tr></thead>
                <tbody className="text-warmgray">
                  <tr className="border-b border-sandstone"><td className="p-3 font-semibold">Work test</td><td className="p-3">10 of 13 months + 330 hours</td><td className="p-3">~1 day/week average; paid leave counts</td></tr>
                  <tr className="border-b border-sandstone bg-sandstone/30"><td className="p-3 font-semibold">Income test</td><td className="p-3">Individual ATI under $168,865</td><td className="p-3">Best of 2 financial years; partner income not assessed</td></tr>
                  <tr className="border-b border-sandstone"><td className="p-3 font-semibold">Residency</td><td className="p-3">Australian resident (social security)</td><td className="p-3">Must be resident on day of birth/adoption + each PLP day</td></tr>
                  <tr className="border-b border-sandstone bg-sandstone/30"><td className="p-3 font-semibold">Care</td><td className="p-3">Primary carer of the child</td><td className="p-3">Child must be in your care on each PLP day</td></tr>
                </tbody>
              </table>
            </div>
            <p>If you are a contractor rather than an employee, the work test still applies to you based on your hours of self-employment. Read our <Link href="/contractor-vs-employee/">Contractor vs Employee Guide</Link> for detail on how employment status affects government entitlements.</p>
          </section>

          {/* ── SECTION 4: How to Apply for Parental Leave Pay ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do You Apply for Parental Leave Pay?</h2>
            <p>Applications for PLP are lodged through <strong>myGov linked to Centrelink</strong>, and the earliest you can submit a claim is <strong>3 months before the expected date of birth or adoption</strong>.</p>
            <ol>
              <li><strong>Create or log in to myGov</strong> and link your Centrelink account. If you do not have a Centrelink Customer Reference Number (CRN), one is created during the linking process.</li>
              <li><strong>Start an early claim</strong> up to 3 months before the expected birth or adoption date. Select &quot;Parental Leave Pay&quot; under the &quot;Families&quot; category.</li>
              <li><strong>Provide proof of birth or adoption</strong> within 56 days (8 weeks) of the child&apos;s arrival. For a birth, you need the Newborn Child Declaration form (FA081) completed by your doctor or midwife and the parent/s (FA081a). For adoption, provide the adoption order or placement letter.</li>
              <li><strong>Nominate your PLP days</strong>. You select which weekdays you want to receive PLP. Days can be taken as a continuous block, in separate blocks, or as single days. All PLP days must fall within 24 months of the child&apos;s birth or adoption.</li>
              <li><strong>Choose your payment delivery method</strong>. If your employer has 1 or more employees and agrees, PLP is delivered through their payroll. Otherwise, Services Australia pays you directly into your nominated bank account.</li>
              <li><strong>Submit the claim</strong> and wait for assessment. Processing typically takes <strong>5 to 10 business days</strong> after all required documents are provided.</li>
            </ol>
            <p>Both parents can lodge separate claims to share the 24-week entitlement. Each parent must individually meet the eligibility tests. A minimum of <strong>2 weeks</strong> is reserved for each parent who wants to claim, meaning neither parent can take more than 22 weeks of the 24-week total.</p>
          </section>

          {/* ── SECTION 5: Employer-Funded vs Government Parental Leave ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Difference Between Employer-Funded and Government Parental Leave?</h2>
            <p>Employer-funded parental leave and government PLP are <strong>separate entitlements that can be received concurrently or consecutively</strong>. Receiving employer-paid parental leave does not reduce your government PLP entitlement.</p>
            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-navy text-white"><th className="p-3 text-left">Feature</th><th className="p-3 text-left">Government PLP</th><th className="p-3 text-left">Employer-Funded Leave</th></tr></thead>
                <tbody className="text-warmgray">
                  <tr className="border-b border-sandstone"><td className="p-3 font-semibold">Pay rate</td><td className="p-3">National minimum wage ($915/week)</td><td className="p-3">Your normal salary (full or half pay)</td></tr>
                  <tr className="border-b border-sandstone bg-sandstone/30"><td className="p-3 font-semibold">Duration (typical)</td><td className="p-3">Up to 24 weeks (FY2025-26)</td><td className="p-3">6 to 18 weeks (varies by employer)</td></tr>
                  <tr className="border-b border-sandstone"><td className="p-3 font-semibold">Eligibility</td><td className="p-3">Work test + income test ($168,865)</td><td className="p-3">Usually 12 months continuous service</td></tr>
                  <tr className="border-b border-sandstone bg-sandstone/30"><td className="p-3 font-semibold">Super contributions</td><td className="p-3">12% SG from 1 July 2025</td><td className="p-3">12% SG on employer-paid leave salary</td></tr>
                  <tr className="border-b border-sandstone"><td className="p-3 font-semibold">Taxed?</td><td className="p-3">Yes &mdash; assessable income</td><td className="p-3">Yes &mdash; assessable income</td></tr>
                  <tr className="border-b border-sandstone bg-sandstone/30"><td className="p-3 font-semibold">Source of funding</td><td className="p-3">Federal government</td><td className="p-3">Employer (enterprise agreement, policy, or award)</td></tr>
                  <tr className="border-b border-sandstone"><td className="p-3 font-semibold">Can be combined?</td><td className="p-3">Yes &mdash; received on top of employer leave</td><td className="p-3">Yes &mdash; received on top of government PLP</td></tr>
                </tbody>
              </table>
            </div>
            <div className="not-prose bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 my-6 text-sm text-warmgray"><strong>Example:</strong> An employee receiving 12 weeks employer leave at full pay ($1,800/week) plus 24 weeks government PLP ($915/week) receives a combined 36 weeks of paid parental leave totalling <strong>$43,560</strong> ($21,600 employer + $21,960 PLP).</div>
            <p>The National Employment Standards (NES) under the <em>Fair Work Act 2009</em> guarantee <strong>12 months of unpaid parental leave</strong> for all employees with at least 12 months of continuous service. This unpaid entitlement is separate from both government PLP and employer-funded paid leave. Casual employees are entitled to unpaid parental leave if they have been employed regularly for at least 12 months. See our <Link href="/award-rates/">Award Rates Guide</Link> for information on minimum entitlements under modern awards.</p>
          </section>

          {/* ── SECTION 6: How Is Parental Leave Pay Taxed? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Parental Leave Pay Taxed?</h2>
            <p>Parental Leave Pay is <strong>assessable income taxed at your marginal tax rate</strong> and must be declared on your annual tax return. The ATO treats PLP the same as salary and wages for income tax purposes.</p>
            <p>When your employer delivers PLP through payroll, they withhold PAYG tax using the same tax tables that apply to your regular salary. When Services Australia pays you directly, the default withholding rate is <strong>15%</strong>. This default rate is often lower than many claimants&apos; marginal rates. If your combined income for the year (including partial salary, PLP, and any employer-paid leave) places you in a higher income tax bracket, you receive a tax bill at lodgement time.</p>
            <p>To avoid an unexpected tax debt, lodge a <em>Withholding declaration</em> with Services Australia requesting a higher withholding rate that matches your expected marginal rate. The income tax brackets for FY2025-26 range from <strong>0% on the first $18,200</strong> to <strong>45% above $190,000</strong>. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to estimate total tax payable on your combined income during a parental leave year.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Does PLP Affect the Medicare Levy?</h3>
            <p>PLP counts as assessable income for the <strong>2% Medicare levy</strong>. If your total income including PLP exceeds the Medicare levy low-income threshold of <strong>$27,222</strong> for singles, you pay the levy on your full taxable income. PLP income also counts toward the Medicare Levy Surcharge income test &mdash; if your income exceeds <strong>$93,000</strong> (singles) and you do not hold private hospital cover, the surcharge of 1% to 1.5% applies.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Superannuation on Government PLP</h3>
            <p>From <strong>1 July 2025</strong>, the government pays <strong>12% superannuation guarantee</strong> on top of government-funded PLP. This super is paid directly into the claimant&apos;s nominated super fund. The maximum SG payable on 24 weeks of PLP is approximately <strong>$2,635</strong> ($21,960 x 12%). This policy change addresses the retirement savings gap that parents (predominantly women) experience during career breaks. Check your expected super contributions using our <Link href="/superannuation-calculator/">Superannuation Calculator</Link>.</p>
          </section>

          {/* ── SECTION 7: Dad and Partner Pay ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Happened to Dad and Partner Pay?</h2>
            <p>&quot;Dad and Partner Pay&quot; (DaPP) was a separate 2-week government payment that <strong>ceased as a standalone scheme on 1 July 2023</strong>. DaPP was merged into the main Parental Leave Pay scheme, giving all parents access to the shared PLP entitlement.</p>
            <p>Before the merger, non-birth parents were limited to 2 weeks of DaPP at the national minimum wage. Under the current scheme, non-birth parents (fathers, same-sex partners, adoptive parents) can claim up to <strong>22 weeks</strong> of PLP if the birth parent claims only 2 weeks. The scheme is gender-neutral &mdash; the terms &quot;birth parent&quot; and &quot;non-birth parent&quot; replaced gendered categories. Both parents negotiate their preferred split when lodging claims.</p>
            <p>The &quot;use it or lose it&quot; reservation of <strong>2 weeks per parent</strong> is designed to encourage both parents to take leave. If only one parent claims PLP, the maximum they receive is <strong>22 weeks</strong> and the remaining 2 weeks are forfeited.</p>
          </section>

          {/* ── SECTION 8: Keeping in Touch Days ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are Keeping in Touch Days?</h2>
            <p>&quot;Keeping in Touch&quot; (KIT) days allow employees on parental leave to perform up to <strong>10 days of paid work</strong> for their employer without ending their parental leave or affecting their PLP entitlement.</p>
            <p>KIT days are voluntary for both the employee and employer &mdash; neither party can require the other to agree. Work performed on a KIT day is paid at the employee&apos;s normal pay rate and does not reduce the number of PLP days remaining. KIT days cannot be taken within the first <strong>14 days</strong> (2 weeks) after the birth or adoption of the child.</p>
            <p>Common uses for KIT days include attending team meetings, completing compliance training, participating in planning sessions, onboarding a replacement, or transitioning work to a colleague. KIT days do not count as a &quot;return to work&quot; under the Fair Work Act, so they preserve your full unpaid parental leave entitlement of up to 12 months (extendable to 24 months by agreement). If you exceed 10 KIT days, your parental leave is considered ended and you are treated as having returned to work.</p>
          </section>

          {/* ── SECTION 9: What Changed in FY2025-26? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Parental Leave Pay in FY2025-26?</h2>
            <p>The maximum PLP entitlement increased from <strong>22 weeks to 24 weeks</strong> on 1 July 2025, with a further increase to <strong>26 weeks from 1 July 2026</strong> already legislated.</p>
            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-navy text-white"><th className="p-3 text-left">Change</th><th className="p-3 text-left">Before (FY2024-25)</th><th className="p-3 text-left">After (FY2025-26)</th></tr></thead>
                <tbody className="text-warmgray">
                  <tr className="border-b border-sandstone"><td className="p-3 font-semibold">Total PLP weeks</td><td className="p-3">22 weeks</td><td className="p-3">24 weeks</td></tr>
                  <tr className="border-b border-sandstone bg-sandstone/30"><td className="p-3 font-semibold">Super on PLP</td><td className="p-3">No super paid</td><td className="p-3">12% SG paid by government</td></tr>
                  <tr className="border-b border-sandstone"><td className="p-3 font-semibold">Weekly rate</td><td className="p-3">$882.75/week</td><td className="p-3">$915.00/week</td></tr>
                  <tr className="border-b border-sandstone bg-sandstone/30"><td className="p-3 font-semibold">Income test threshold</td><td className="p-3">$168,865</td><td className="p-3">$168,865 (unchanged)</td></tr>
                  <tr className="border-b border-sandstone"><td className="p-3 font-semibold">Reserved per parent</td><td className="p-3">2 weeks</td><td className="p-3">2 weeks (unchanged)</td></tr>
                  <tr className="border-b border-sandstone bg-sandstone/30"><td className="p-3 font-semibold">Planned FY2026-27</td><td className="p-3">&mdash;</td><td className="p-3">26 weeks total</td></tr>
                </tbody>
              </table>
            </div>
            <p>The addition of superannuation guarantee on PLP is the most significant structural change. Previously, parents receiving only government PLP accumulated <strong>zero</strong> super for their leave period, contributing to a lifetime super gap estimated at <strong>$15,000 to $25,000</strong> for parents who take multiple periods of parental leave. The 12% SG now applies to every dollar of government PLP paid from 1 July 2025 onward. The superannuation guarantee rate for FY2025-26 is 12% &mdash; see our <Link href="/superannuation-guide/">Superannuation Guide</Link> for the full SG rate schedule and contribution caps.</p>
          </section>

          {/* ── CONTEXT BORDER ── */}

          {/* ── SECTION 10: Related Resources ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
            <p>These Australian tax and payroll calculators and guides help you plan finances around parental leave, model your take-home pay during and after leave, and understand how salary, super, and government payments interact.</p>
            <ul>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> &mdash; model your after-tax income before and during parental leave to budget for the pay reduction</li>
              <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link> &mdash; estimate employer SG contributions and the impact of parental leave on your retirement savings</li>
              <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> &mdash; calculate total tax payable on a part-year salary plus PLP income</li>
              <li><Link href="/leave-calculator/">Leave Calculator</Link> &mdash; work out annual leave, personal leave, and long service leave accruals during employment</li>
              <li><Link href="/annual-leave-guide/">Annual Leave Guide</Link> &mdash; understand how annual leave accrues during paid and unpaid parental leave</li>
              <li><Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> &mdash; learn how salary sacrifice arrangements interact with parental leave and super</li>
            </ul>
          </section>

          {/* ── SECTION 11: FAQs ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="not-prose mt-6 space-y-3">
              <AccordionItem value="faq-how-much" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">How much is Parental Leave Pay per week in 2025-26?</AccordionTrigger>
                <AccordionContent className="text-warmgray">PLP is <strong>$915.00 per week before tax</strong> ($183.00 per day) for FY2025-26, based on the national minimum wage. This rate applies to all eligible claimants regardless of their normal salary. Tax is withheld before payment, so the after-tax amount deposited depends on your withholding rate.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-dad" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Can fathers and partners claim Parental Leave Pay?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. Since 1 July 2023, PLP is a shared entitlement. Both parents can claim, with a minimum of <strong>2 weeks reserved per parent</strong> and a maximum of 22 weeks for any single parent. The old &quot;Dad and Partner Pay&quot; scheme no longer exists as a separate payment.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-tax" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Is Parental Leave Pay taxed?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. PLP is assessable income taxed at your marginal rate. When Services Australia pays you directly, the default PAYG withholding rate is <strong>15%</strong>. If your marginal rate is higher, you may owe additional tax at lodgement. You can request a higher withholding rate to avoid a year-end tax bill.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-super" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Do I get superannuation on Parental Leave Pay?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes, from <strong>1 July 2025</strong>. The government pays <strong>12% superannuation guarantee</strong> on government-funded PLP directly into your nominated super fund. The maximum SG on 24 weeks of PLP is approximately <strong>$2,635</strong>. Employer-funded parental leave also attracts the standard 12% SG from your employer.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-employer-combine" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Can I receive PLP and employer-paid parental leave at the same time?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. Government PLP and employer-funded parental leave are separate entitlements. You can receive both simultaneously or consecutively. There is no offset or reduction &mdash; your employer cannot reduce their paid parental leave because you also receive government PLP.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-annual-leave" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Does annual leave accrue during parental leave?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Annual leave accrues during <strong>paid parental leave</strong> (both employer-funded and government PLP periods where your employer delivers the payment through payroll). Annual leave does <strong>not</strong> accrue during unpaid parental leave. Check our <Link href="/annual-leave-guide/">Annual Leave Guide</Link> for full accrual rules.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-flexible" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Can I take PLP days on a flexible schedule?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. PLP days can be taken as a single continuous block, multiple separate blocks, or individual days spread over a period. All PLP days must be taken within <strong>24 months</strong> of the child&apos;s birth or adoption date. You nominate your preferred days in your claim.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-self-employed" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Are self-employed workers eligible for PLP?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes, provided they meet the work test (<strong>330 hours in 10 of the 13 months</strong> before birth or adoption) and the income test (individual adjusted taxable income under <strong>$168,865</strong>). Self-employed parents receive PLP directly from Services Australia. They must not work during their PLP days except for permitted keeping in touch days.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-kit-days" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">How many keeping in touch days can I take?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Employees on parental leave can work up to <strong>10 keeping in touch (KIT) days</strong> without ending their leave or affecting PLP. KIT days are voluntary, paid at your normal rate, and cannot be taken within the first 14 days after birth or adoption. Exceeding 10 days ends your parental leave.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-stillbirth" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Is PLP available for stillbirth or infant death?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. If a child is stillborn (born after at least 20 weeks of pregnancy or weighing at least 400 grams) or dies after birth, eligible parents can still receive the full PLP entitlement. A &quot;Stillborn Baby Declaration&quot; form from the hospital or medical practitioner is required instead of a birth registration.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-centrelink" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Does PLP count toward Centrelink income tests?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. PLP is assessable income and counts toward income tests for other payments including Family Tax Benefit, Child Care Subsidy, and the Centrelink income test for allowances. The total PLP received during a financial year is included in your adjusted taxable income. See our <Link href="/centrelink-income-test/">Centrelink Income Test Guide</Link> for payment thresholds and taper rates.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="faq-apply-deadline" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What is the deadline to apply for PLP?</AccordionTrigger>
                <AccordionContent className="text-warmgray">You can submit an early claim up to <strong>3 months before</strong> the expected birth or adoption. After the child arrives, you must provide proof of birth within <strong>56 days</strong> (8 weeks). PLP days must be claimed within <strong>24 months</strong> of the child&apos;s birth or adoption date. Late claims are accepted but payment is not backdated beyond the date of claim.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>PLP rates, eligibility criteria, and scheme rules sourced from Services Australia, Fair Work Ombudsman, and the Australian Taxation Office. Rates are current as of FY2025-26. The national minimum wage rate used is the Fair Work Commission Annual Wage Review 2024-25 decision rate. Superannuation on PLP applies from 1 July 2025 under the <em>Paid Parental Leave Amendment (Adding Superannuation) Act 2024</em>.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("parental-leave-pay"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
        </article>
        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/annual-leave-guide/" label="Annual Leave Guide" /><SidebarLink href="/leave-calculator/" label="Leave Calculator" /><SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" /><SidebarLink href="/superannuation-calculator/" label="Superannuation Calculator" /><SidebarLink href="/centrelink-income-test/" label="Centrelink Income Test" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

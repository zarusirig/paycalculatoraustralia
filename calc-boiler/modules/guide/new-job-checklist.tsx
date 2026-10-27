import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { NEW_JOB_FAQS } from "./new-job-checklist-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, formatAUD, formatPercent, HECS_HELP, SUPER_GUARANTEE, TAX_FREE_THRESHOLD } from "@/lib/constants";
import { NO_TFN_RATES } from "@/lib/constants/payg-withholding";
import { CASUAL_LOADING } from "@/lib/constants/junior-rates";
import { NES_NOTICE_BANDS, OVER_45_MIN_YEARS } from "@/lib/constants/notice-pilon";
import { COMPASSIONATE_LEAVE } from "@/lib/constants/compassionate-leave";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import FeaturedImage from "@/components/common/featured-image";

const SOURCES_LIST: SourceLink[] = [
  { title: "TFN declaration", url: "https://www.ato.gov.au/forms-and-instructions/tfn-declaration", publisher: SOURCES.ato.name },
  { title: "Choosing a super fund", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/choosing-a-super-fund", publisher: SOURCES.ato.name },
  { title: "Starting a new job", url: "https://www.fairwork.gov.au/starting-employment", publisher: SOURCES.fwo.name },
  { title: "Pay slips", url: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips", publisher: SOURCES.fwo.name },
];

/** Cash salary inside a $100,000 package that includes super at the SG rate. */
const PKG_CASH = Math.round(100_000 / (1 + SUPER_GUARANTEE.rate));

export default function NewJobChecklistPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">New Job Checklist</span></li></ol></nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>New Job Pay Checklist: Set Up Your Pay Correctly From Day One</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-4">This new job pay checklist covers what an Australian employee should check and complete when starting a new job.</p>
          <ol className="list-decimal pl-6 space-y-2 text-lg text-warmgray leading-relaxed mb-4">
            <li><a href="#before-first-day" className="font-semibold text-navy hover:text-eucalyptus-dark hover:underline">Before your first day</a>, you confirm your salary package, the award or enterprise agreement that covers the role, and your contract terms.</li>
            <li><a href="#first-week-paperwork" className="font-semibold text-navy hover:text-eucalyptus-dark hover:underline">In your first week</a>, you complete the TFN declaration and give your employer your super fund and bank details.</li>
            <li><a href="#first-pay-checks" className="font-semibold text-navy hover:text-eucalyptus-dark hover:underline">On your first payslip</a>, you check gross pay, PAYG withholding, super and leave against your contract. The Pay Calculator linked in that section shows the PAYG withholding you should expect for your salary.</li>
          </ol>
          <p className="text-lg text-warmgray leading-relaxed mb-6">The guide ends with a total package value table and answers to common new job pay questions.</p>
          <TrustBar className="!max-w-none" />
          <FeaturedImage className="mb-0 mt-6" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="mv-content lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ───── SECTION 1: Before Your First Day ───── */}
            <section id="before-first-day">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Before Your First Day</h2>
              <p>
                Before you start, check how your salary package is quoted, which award or enterprise agreement covers the role, and what your employment contract says.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Understand Your Salary Package</h3>
              <ul>
                <li>{"✅"} <strong>Confirm total package vs base salary.</strong> Some offers quote a &quot;total remuneration package&quot; that includes super. A $100,000 total package means your cash salary is approximately <strong>{formatAUD(PKG_CASH)}</strong> with {formatAUD(100_000 - PKG_CASH)} going to super ({formatPercent(SUPER_GUARANTEE.rate, 0)}). A $100,000 base salary plus super means you receive $100,000 in cash and {formatAUD(100_000 * SUPER_GUARANTEE.rate)} in super, a total value of {formatAUD(100_000 * (1 + SUPER_GUARANTEE.rate))}.</li>
                <li>{"✅"} <strong>Check for salary sacrifice availability.</strong> Ask whether your new employer offers salary sacrifice into super or a novated lease. Pre-tax salary sacrifice reduces your taxable income and the income tax you pay on it. See our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model the tax savings.</li>
                <li>{"✅"} <strong>Verify the applicable award or enterprise agreement.</strong> If your role is covered by a modern award, check the minimum pay rates for your classification level. Use our <Link href="/award-rates/">Award Rates Guide</Link> to confirm your offer meets or exceeds the award minimum.</li>
              </ul>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Review Your Employment Contract</h3>
              <ul>
                <li>{"✅"} <strong>Employment type:</strong> Full-time, part-time, or casual. Casual employees get a casual loading (or a set casual pay rate) from their award, agreement or contract instead of paid annual leave and paid personal/carer&apos;s leave. For award-free casuals, the National Minimum Wage Order sets the loading at <strong>{formatPercent(CASUAL_LOADING, 0)}</strong>. Casuals still get {COMPASSIONATE_LEAVE.fdvDaysPerYear} days of paid family and domestic violence leave a year under the National Employment Standards.</li>
                <li>{"✅"} <strong>Pay frequency:</strong> Weekly, fortnightly, or monthly. Your pay frequency sets when money reaches your account and which PAYG withholding table your employer uses.</li>
                <li>{"✅"} <strong>Notice period:</strong> The National Employment Standards set the minimum notice your employer must give: {NES_NOTICE_BANDS[0].weeks} to {NES_NOTICE_BANDS[NES_NOTICE_BANDS.length - 1].weeks} weeks based on your years of service, plus 1 extra week if you are over 45 with at least {OVER_45_MIN_YEARS} years of service. Your contract, award or agreement can give you more notice than this, never less.</li>
                <li>{"✅"} <strong>Probation period:</strong> Your employer sets the length of any probation period, which the Fair Work Ombudsman says often runs 3 to 6 months. On probation you keep all your National Employment Standards entitlements, including notice if your employment ends.</li>
                <li>{"✅"} <strong>Leave entitlements:</strong> Full-time employees receive 4 weeks annual leave and 10 days personal/carer&apos;s leave per year under the National Employment Standards.</li>
              </ul>
            </section>

            {/* ───── SECTION 2: First Week Paperwork ───── */}
            <section id="first-week-paperwork">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>First Week Paperwork</h2>
              <p>
                In your first week, give your employer a TFN declaration, your super fund details and your bank details so your pay, tax, and super are set up correctly.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>TFN Declaration</h3>
              <ul>
                <li>{"✅"} <strong>Complete the TFN Declaration form</strong> (NAT 3092). Your employer will provide this or you can download it from the ATO website.</li>
                <li>{"✅"} <strong>Tax-free threshold:</strong> Claim the {formatAUD(TAX_FREE_THRESHOLD)} tax-free threshold only if this is your <strong>highest-paying job</strong> (or only job). If you have another job where you already claim it, select &quot;No&quot;.</li>
                <li>{"✅"} <strong>HECS-HELP debt:</strong> If you have a student loan, tick &quot;Yes&quot;. Your employer will withhold additional amounts for HELP repayments once your income exceeds the threshold ({formatAUD(HECS_HELP.minimumThreshold)} in FY{SITE_CONFIG.financialYear}).</li>
                <li>{"✅"} <strong>Give your TFN.</strong> If you have applied for a TFN but do not have it yet, say so on the form: your employer withholds at the standard rate for 28 days while you get your TFN to them. With no TFN declaration, or no TFN after those 28 days, your employer withholds tax at the top rate of <strong>{formatPercent(NO_TFN_RATES.resident, 0)}</strong> from every payment ({formatPercent(NO_TFN_RATES.foreignResident, 0)} for a foreign resident).</li>
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
                Your employer must pay super at the <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)} SG rate</strong> into your chosen fund. Learn more in our <Link href="/superannuation-guide/">Superannuation Guide</Link>.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Bank Details and Other Setup</h3>
              <ul>
                <li>{"✅"} <strong>Provide your bank account details</strong> (BSB and account number) for salary deposits.</li>
                <li>{"✅"} <strong>Emergency contact details</strong> for workplace safety records.</li>
                <li>{"✅"} <strong>Tax residency status:</strong> answer the residency question on your TFN declaration correctly, because your employer withholds tax at different rates for Australian residents and foreign residents.</li>
              </ul>
            </section>

            {/* ───── SECTION 3: First Pay Checks ───── */}
            <section id="first-pay-checks">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>First Pay: What to Check</h2>
              <p>
                Check these items on your first payslip as soon as it arrives, while any error affects only your first pay.
              </p>
              <ul>
                <li>{"✅"} <strong>Verify gross pay matches your contract.</strong> For salaried employees, divide your annual salary by the number of pay periods (26 for fortnightly, 12 for monthly). For hourly workers, check hours multiplied by your rate.</li>
                <li>{"✅"} <strong>Check tax withholding is reasonable.</strong> Use our <Link href="/">Pay Calculator</Link> to compare expected vs actual PAYG withholding. If tax seems too high, confirm your TFN declaration was processed and the tax-free threshold applied.</li>
                <li>{"✅"} <strong>Confirm super is being paid.</strong> Super may not appear on your first payslip if it has not yet been processed. Since Payday Super started on 1 July 2026, contributions must reach your fund within <strong>7 business days of each payday</strong> (20 business days for a new employee&apos;s first contribution). Check your super fund&apos;s online portal a few weeks after starting to confirm it arrived.</li>
                <li>{"✅"} <strong>Check leave balances are accruing.</strong> Full-time employees accrue annual leave from day one. After your first pay period, your payslip or your employer&apos;s HR system should show your leave balance.</li>
                <li>{"✅"} <strong>Review allowances and loadings.</strong> If your contract or award includes shift penalties, overtime rates, or allowances (meal, travel, uniform), verify these are being applied correctly.</li>
              </ul>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Verify Your Pay</h3>
                    <p className="text-navy text-sm mb-3">Enter your salary in the Pay Calculator to check that the PAYG withholding on your payslip matches the tax you should pay.</p>
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
                Compare a job offer on its total package value, not the base salary alone. The table below shows each component for an example base salary:
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Component</th><th className="px-5 py-3">Example ($90k base)</th><th className="px-5 py-3">Notes</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">Base salary</td><td className="px-5 py-3">$90,000</td><td className="px-5 py-3">Cash salary before tax</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Superannuation ({formatPercent(SUPER_GUARANTEE.rate, 0)})</td><td className="px-5 py-3">{formatAUD(90_000 * SUPER_GUARANTEE.rate)}</td><td className="px-5 py-3">Paid by employer into your super fund</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Salary sacrifice (if available)</td><td className="px-5 py-3">$5,000 – $15,000</td><td className="px-5 py-3">Pre-tax contributions reduce taxable income</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Leave entitlements</td><td className="px-5 py-3">~$6,923</td><td className="px-5 py-3">4 weeks paid annual leave (4/52 of base) &mdash; already inside the base salary, not extra cash</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Other benefits</td><td className="px-5 py-3">Varies</td><td className="px-5 py-3">Parking, health insurance, bonuses, WFH equipment</td></tr>
                      <tr className="font-semibold text-navy"><td className="px-5 py-3">Total package value</td><td className="px-5 py-3">{formatAUD(90_000 * (1 + SUPER_GUARANTEE.rate))}+</td><td className="px-5 py-3">Base salary plus super, before other benefits</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                When negotiating, ask about salary sacrifice options, bonus structures, and professional development budgets. A $5,000 salary sacrifice into super saves approximately <strong>$1,200</strong> for someone in the 37% bracket compared to receiving the same amount as cash salary ($1,950 of income tax and Medicare levy avoided, less $750 of 15% contributions tax in the fund). Model different scenarios with our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link>.
              </p>
            </section>

            {/* ───── SECTION 5: FAQs ───── */}
            <section id="faqs">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={NEW_JOB_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
            </section>

            <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Employment and pay setup information is sourced from the Australian Taxation Office (ATO) and the Fair Work Ombudsman (FWO). Superannuation calculations use the FY{SITE_CONFIG.financialYear} SG rate of {formatPercent(SUPER_GUARANTEE.rate, 0)}. Tax withholding amounts are based on current PAYG withholding tables. Award rates and minimum entitlements are set by the Fair Work Commission.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("new-job-checklist"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
          </article>
          <aside className="lg:w-1/3"><div className="mv-sidebar space-y-6">
            <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Tools</h3><div className="space-y-3"><SidebarLink href="/tax-file-number-declaration/" label="TFN Declaration Guide" /><SidebarLink href="/superannuation-guide/" label="Superannuation Guide" /><SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" /><SidebarLink href="/understanding-your-payslip/" label="Understanding Your Payslip" /><SidebarLink href="/award-rates/" label="Award Rates Guide" /><SidebarLink href="/first-job-pay-guide/" label="First Job Pay Guide" /></div></CardContent></Card>
            <Card className="bg-sky-600 border-none text-white shadow-md"><CardContent className="p-6"><h3 className="text-lg font-bold mb-2">Check your new pay</h3><p className="text-sky-100 text-sm mb-4">Enter your new salary to see take-home pay, tax, and super contributions.</p><Link href="/" className="block w-full py-2.5 px-4 bg-white text-sky-700 font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">Pay Calculator →</Link></CardContent></Card>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { FIRST_JOB_FAQS } from "./first-job-pay-guide-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, LITO, MEDICARE_LEVY, SUPER_GUARANTEE, TAX_BRACKETS, TAX_FREE_THRESHOLD, calculateIncomeTax, formatAUD, formatPercent } from "@/lib/constants";
import { NO_TFN_RATES, withholdingForPeriod } from "@/lib/constants/payg-withholding";
import { JUNIOR_BANDS } from "@/lib/constants/junior-rates";

// Weekly payslip example: 20 hrs @ $25, withholding from the ATO Schedule 1
// coefficients for the current year (tax-free threshold claimed). The old
// hardcoded $32 predated the 16% and 15% rate cuts.
const EX_GROSS = 500;
const EX_TAX = withholdingForPeriod(EX_GROSS, "weekly");
const EX_SUPER = EX_GROSS * SUPER_GUARANTEE.rate;
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);
const TFT = formatAUD(TAX_FREE_THRESHOLD);
const JUNIOR_17 = JUNIOR_BANDS.find((b) => b.years === 17)!;
const FIRST_JOB_ROWS = [
  { income: 10_000, scenario: "~8 hrs/week casual @ $25/hr" },
  { income: 18_200, scenario: "~14 hrs/week casual @ $25/hr" },
  { income: 25_000, scenario: "~19 hrs/week @ $25/hr" },
  { income: 35_000, scenario: "Part-time or full-time entry level" },
  { income: 45_000, scenario: "Full-time entry level" },
] as const;
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import FeaturedImage from "@/components/common/featured-image";

const SOURCES_LIST: SourceLink[] = [
  { title: "Apply for a TFN", url: "https://www.ato.gov.au/individuals-and-families/tax-file-number/apply-for-a-tfn", publisher: SOURCES.ato.name },
  { title: "Super for employees", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super", publisher: SOURCES.ato.name },
  { title: "Starting a new job", url: "https://www.fairwork.gov.au/starting-employment", publisher: SOURCES.fwo.name },
  { title: "Income tax rates for individuals", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

export default function FirstJobPayGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">First Job Pay Guide</span></li></ol></nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>First Job Pay Guide: Everything You Need to Know About Your First Pay</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">Your first pay in Australia is taxable income: your employer withholds PAYG income tax from your gross pay for the pay period before paying you ({formatAUD(EX_TAX, 2)} from a {formatAUD(EX_GROSS)} week, for example, when you claim the {TFT} tax-free threshold). How much is withheld depends on your gross pay for the period, whether you gave your employer a tax file number (TFN) and whether you claimed the tax-free threshold on your TFN Declaration. Any superannuation your employer pays goes into your super fund on top of your wages, not out of them. The tables below show a worked example payslip and the tax and weekly take-home pay on part-time, casual and entry-level full-time earnings. The rest of this guide covers what to set up before your first shift, each line on your payslip, and your first tax return.</p>
          <TrustBar className="!max-w-none" />
          <FeaturedImage className="mb-0 mt-6" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="mv-content lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ───── SECTION 1: Before You Start ───── */}
            <section id="before-you-start">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Before You Start: Three Things You Need</h2>
              <p>Organise three things before your first shift:</p>
              <ol>
                <li><a href="#tfn">A TFN</a></li>
                <li><a href="#super-fund">A super fund</a></li>
                <li><a href="#tfn-declaration">Your TFN Declaration</a></li>
              </ol>
              <p>
                With these in place, your employer withholds the right amount of tax and pays super to the right fund, so you don&apos;t overpay tax.
              </p>

              <h3 id="tfn" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>1. Tax File Number (TFN)</h3>
              <p>
                A Tax File Number is your unique identifier with the Australian Taxation Office. You give it to your employer after you start work, on your TFN Declaration. If you don&apos;t give your TFN and haven&apos;t told your employer you have applied for one, your employer must withhold tax at <strong>{formatPercent(NO_TFN_RATES.resident, 0)}</strong> (the top marginal rate of {formatPercent(TAX_BRACKETS[TAX_BRACKETS.length - 1].rate, 0)} plus the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy), meaning almost half your pay goes to tax. If you are an Australian citizen aged 15 or older, apply online with a Strong Digital ID such as myID. Otherwise, fill in the online form and finish your application at a participating Australia Post outlet with your identity documents. Allow up to <strong>28 days</strong> for your TFN to arrive.
              </p>
              <p>
                If you start work before your TFN arrives, mark on your TFN Declaration that you have applied for one. You then have <strong>28 days</strong> to give your TFN to your employer, who withholds tax at the standard rate during that time. After 28 days without your TFN, your employer withholds at the no-TFN rate until you provide it. Any excess tax withheld is refunded when you lodge your first tax return. Learn more in our <Link href="/tax-file-number-declaration/">TFN Declaration Guide</Link>.
              </p>

              <h3 id="super-fund" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>2. Superannuation Fund</h3>
              <p>
                Your employer must pay <strong>{SG} of your qualifying earnings</strong> (for most employees, ordinary time earnings) into a superannuation fund on your behalf (FY{SITE_CONFIG.financialYear} rate). This is in addition to your wages. It does not come out of your pay. You can choose your own super fund. If you don&apos;t, your employer must ask the ATO for your stapled super fund (an existing account that follows you from job to job) and pay into it. Your employer uses its default fund only when the ATO advises you have no stapled fund. If you already have a super account (e.g., from a previous casual job), provide those details to avoid having multiple accounts with fees eating into your balance. See our <Link href="/superannuation-guide/">Superannuation Guide</Link> for more detail.
              </p>

              <h3 id="tfn-declaration" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>3. TFN Declaration Form</h3>
              <p>
                Your employer will ask you to complete a <strong>TFN Declaration form</strong> (NAT 3092). This tells your employer your TFN, whether to claim the <strong>{TFT} tax-free threshold</strong>, and whether you have a study or training support loan (HELP, VSL, FS, SSL or AASL) debt. If this is your first and only job and you are an Australian resident for tax purposes, you should <strong>claim the tax-free threshold</strong>. This means you pay no tax on the first {TFT} you earn in the financial year. If this is your <strong>second job</strong>, do not claim the tax-free threshold. It should only be claimed at one employer.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">See Your Take-Home Pay</h3>
                    <p className="text-navy text-sm mb-3">Enter your hourly rate or salary to see exactly what you&apos;ll take home after tax and how much super your employer pays.</p>
                    <Link href="/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Use our Pay Calculator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* ───── SECTION 2: Understanding Your First Payslip ───── */}
            <section id="first-payslip">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Understanding Your First Payslip</h2>
              <p>
                Your payslip shows how your pay is calculated. By law, every Australian employer must provide a payslip within <strong>one business day</strong> of paying you. Here is what each line means:
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Payslip Line</th><th className="px-5 py-3">What It Means</th><th className="px-5 py-3">Example (20 hrs @ $25/hr)</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">Gross pay</td><td className="px-5 py-3">Total pay before any deductions: hours worked multiplied by your rate</td><td className="px-5 py-3">{formatAUD(EX_GROSS, 2)}</td></tr>
                      <tr><td className="px-5 py-3 font-medium">PAYG tax withheld</td><td className="px-5 py-3">Income tax your employer sends to the ATO on your behalf</td><td className="px-5 py-3">{formatAUD(EX_TAX, 2)}</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Net pay</td><td className="px-5 py-3">The amount deposited into your bank account (gross minus tax)</td><td className="px-5 py-3">{formatAUD(EX_GROSS - EX_TAX, 2)}</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Superannuation</td><td className="px-5 py-3">{SG} paid by your employer into your super fund, not deducted from your pay</td><td className="px-5 py-3">{formatAUD(EX_SUPER, 2)}</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Year-to-date (YTD)</td><td className="px-5 py-3">Running total of gross pay and tax withheld since 1 July</td><td className="px-5 py-3">Varies</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The lines to compare first on your payslip are <strong>gross pay</strong> (what you earn) and <strong>net pay</strong> (what you receive). PAYG tax withheld is the main reason your bank deposit is less than your hourly rate times your hours. For more on each payslip line, see our <Link href="/understanding-your-payslip/">Understanding Your Payslip Guide</Link>.
              </p>
            </section>

            {/* ───── SECTION 3: How Much Tax Will You Pay ───── */}
            <section id="how-much-tax">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Tax Will You Pay?</h2>
              <p>
                If this is your only job and you claim the tax-free threshold, you pay <strong>no tax on the first {TFT}</strong> you earn in the financial year (1 July to 30 June). After that, you pay tax at the following rates:
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Taxable Income</th><th className="px-5 py-3">Tax Rate</th><th className="px-5 py-3 text-right">Tax on This Bracket</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">{formatAUD(TAX_BRACKETS[0].min)} to {formatAUD(TAX_BRACKETS[0].max)}</td><td className="px-5 py-3">0% (tax-free threshold)</td><td className="px-5 py-3 text-right">$0</td></tr>
                      <tr><td className="px-5 py-3">{formatAUD(TAX_BRACKETS[1].min)} to {formatAUD(TAX_BRACKETS[1].max)}</td><td className="px-5 py-3">{Math.round(TAX_BRACKETS[1].rate * 100)} cents per dollar</td><td className="px-5 py-3 text-right">Up to {formatAUD(TAX_BRACKETS[2].base)}</td></tr>
                      <tr><td className="px-5 py-3">{formatAUD(TAX_BRACKETS[2].min)} to {formatAUD(TAX_BRACKETS[2].max)}</td><td className="px-5 py-3">{Math.round(TAX_BRACKETS[2].rate * 100)} cents per dollar</td><td className="px-5 py-3 text-right">Up to {formatAUD(TAX_BRACKETS[3].base - TAX_BRACKETS[2].base)}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Part-Time and Casual Scenarios</h3>
              <p>
                The table shows annual income tax and weekly take-home pay at casual, part-time and entry-level full-time earnings:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr><th className="px-5 py-3">Annual Earnings</th><th className="px-5 py-3">Scenario</th><th className="px-5 py-3 text-right">Annual Tax</th><th className="px-5 py-3 text-right">Weekly Take-Home</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {FIRST_JOB_ROWS.map((r) => (
                        <tr key={r.income}><td className="px-5 py-3 font-medium">{formatAUD(r.income)}</td><td className="px-5 py-3">{r.scenario}</td><td className="px-5 py-3 text-right">{formatAUD(calculateIncomeTax(r.income))}</td><td className="px-5 py-3 text-right">{formatAUD((r.income - calculateIncomeTax(r.income)) / 52)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Note: these figures do not include the Medicare levy ({formatPercent(MEDICARE_LEVY.rate, 0)}) or the Low Income Tax Offset (LITO), which reduces tax for lower earners. If you earn up to about <strong>{formatAUD(LITO.effectiveTaxFreeThreshold - 1, 0)}</strong> a year, LITO reduces your income tax to zero. Check the <Link href="/tax-brackets/">Tax Brackets Guide</Link> for the full breakdown.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your First Tax Return</h3>
              <p>
                At the end of the financial year (after 30 June), you need to lodge a <strong>tax return</strong> with the ATO. If you earned under the tax-free threshold but had tax withheld from your pay, you will receive a <strong>full refund of all tax paid</strong>. This applies when tax was withheld from each part-time or casual pay but your income for the full financial year ended below {TFT}. Lodge your return through myTax at <a href="https://my.gov.au" target="_blank" rel="noopener noreferrer">my.gov.au</a> after 1 July. It is free.
              </p>
            </section>

            {/* ───── SECTION 4: Common Questions ───── */}
            <section id="common-questions">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Common First Job Questions</h2>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Why Is My Pay Less Than Expected?</h3>
              <p>
                Your employer deducts <strong>PAYG income tax</strong> before paying you. The PAYG withholding tables assume you earn that same amount every pay period for the full year. Even if you only work a few hours, tax is withheld based on that projected annual income. If your total annual income ends up below {TFT}, you get all the tax back as a refund when you lodge your tax return.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Do I Get Super if I Am Casual?</h3>
              <p>
                Yes. Since 1 July 2022, <strong>all employees receive super regardless of how much they earn</strong>. That is the date the old $450/month threshold was removed. Whether you are casual, part-time, or full-time, your employer pays {SG} super on your qualifying earnings. If you are under 18, you must work more than <strong>30 hours per week</strong> to qualify for compulsory super payments.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What If I Am Under 18?</h3>
              <p>
                Workers under 18 have the same tax obligations as adult workers: you still need a TFN and still pay tax on income above {TFT}. The key difference is superannuation: employers only need to pay super for under-18 workers if they work <strong>more than 30 hours per week</strong>. Your minimum wage depends on your age. If no award or agreement covers you, you are paid a junior rate set as a percentage of the adult minimum wage until you turn 21 ({formatPercent(JUNIOR_17.percentage, 1)} at age 17). If an award covers you, check whether it sets junior rates for your classification.
              </p>
            </section>

            {/* ───── SECTION 5: FAQs ───── */}
            <section id="faqs">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={FIRST_JOB_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
            </section>

            <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>First job information is sourced from the Australian Taxation Office (ATO) and the Fair Work Ombudsman (FWO). Tax calculations use FY{SITE_CONFIG.financialYear} resident tax brackets. Super rates are based on the current Superannuation Guarantee of {SG}. Award rates and minimum wages are subject to annual review by the Fair Work Commission.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("first-job-pay-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
          </article>
          <aside className="lg:w-1/3"><div className="mv-sidebar space-y-6">
            <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Tools</h3><div className="space-y-3"><SidebarLink href="/" label="Pay Calculator" /><SidebarLink href="/understanding-your-payslip/" label="Understanding Your Payslip" /><SidebarLink href="/superannuation-guide/" label="Superannuation Guide" /><SidebarLink href="/tax-brackets/" label="Tax Brackets" /><SidebarLink href="/tax-file-number-declaration/" label="TFN Declaration Guide" /><SidebarLink href="/second-job-tax-calculator/" label="Second Job Tax Calculator" /></div></CardContent></Card>
            <Card className="bg-sky-600 border-none text-white shadow-md"><CardContent className="p-6"><h3 className="text-lg font-bold mb-2">What will you take home?</h3><p className="text-sky-100 text-sm mb-4">Enter your hourly rate and hours to see your actual take-home pay after tax.</p><Link href="/" className="block w-full py-2.5 px-4 bg-white text-sky-700 font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">Pay Calculator →</Link></CardContent></Card>
          </div></aside>
        </div>
      </div>
    </div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

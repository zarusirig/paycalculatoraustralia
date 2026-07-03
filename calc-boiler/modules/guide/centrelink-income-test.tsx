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
  { title: "Income test for pensions", url: "https://www.servicesaustralia.gov.au/income-test-for-age-pension", publisher: SOURCES.servicesAustralia.name },
  { title: "Income test for JobSeeker Payment", url: "https://www.servicesaustralia.gov.au/income-test-for-jobseeker-payment", publisher: SOURCES.servicesAustralia.name },
  { title: "Working Credit", url: "https://www.servicesaustralia.gov.au/working-credit", publisher: SOURCES.servicesAustralia.name },
  { title: "Assets test", url: "https://www.servicesaustralia.gov.au/assets-test-for-age-pension", publisher: SOURCES.servicesAustralia.name },
];

export default function CentrelinkIncomeTestPage() {
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Centrelink Income Test</span></li></ol></nav>
      <header className="mb-10 max-w-4xl"><h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Centrelink Income Test Guide</h1><p className="text-xl text-warmgray leading-relaxed mb-6">How your income affects Centrelink payments like JobSeeker, Youth Allowance, and Age Pension. Understand income thresholds, taper rates, and how to estimate your entitlement.</p><TrustBar className="!max-w-none" /></header>
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          {/* ── H2 1: What Is the Centrelink Income Test? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Centrelink Income Test?</h2>
            <p>The Centrelink income test is a means-testing formula that reduces your social security payment as your assessable income rises above a set &ldquo;free area&rdquo; threshold. Services Australia applies this test to every income-support payment including JobSeeker Payment, Youth Allowance, Age Pension, Parenting Payment, Austudy, and Disability Support Pension.</p>
            <p>The test operates on a <strong>fortnightly</strong> reporting cycle. You report your gross employment income every 14 days, and Centrelink calculates your adjusted payment before the next pay run. Two separate means tests exist &mdash; the <strong>income test</strong> and the <strong>assets test</strong> &mdash; and your payment is set at the lower result of the two. Understanding both is essential for estimating your actual entitlement.</p>
            <p>The Australian tax calculator treats Centrelink payments as assessable income for tax purposes. Your payment amount directly affects your <Link href="/take-home-pay-calculator/">take-home pay</Link>, so knowing the income test thresholds helps you plan part-time work alongside your benefit.</p>
          </section>

          {/* ── H2 2: How Does the Income Test Work? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the Income Test Work?</h2>
            <p>The Centrelink income test reduces your payment by a fixed number of cents for every dollar you earn above the free area &mdash; this reduction rate is the <strong>taper rate</strong>. Below the free area, your payment remains at the full maximum rate with no reduction.</p>
            <p>Most working-age payments use a <strong>two-stage taper</strong>. JobSeeker Payment, for example, applies a <strong>50-cent</strong> taper for each dollar earned between <strong>$150</strong> and <strong>$256</strong> per fortnight, then increases to a <strong>60-cent</strong> taper for every dollar above <strong>$256</strong>. The Age Pension uses a single <strong>50-cent</strong> taper above its free area of <strong>$204</strong> per fortnight for singles.</p>
            <p>Your payment reaches <strong>$0</strong> (the &ldquo;cut-off point&rdquo;) once your income exceeds the level where the taper fully absorbs the maximum payment. For a single JobSeeker recipient on the maximum rate of approximately <strong>$762.70</strong> per fortnight, the income cut-off sits at roughly <strong>$1,337</strong> per fortnight. Earning above that amount means your fortnightly JobSeeker drops to nil.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Income Free Area?</h3>
            <p>The &ldquo;Income Free Area&rdquo; is the amount you earn each fortnight before any reduction applies. For JobSeeker and Youth Allowance (job seeker), the free area is <strong>$150 per fortnight</strong>. For Age Pension (single), it is <strong>$204 per fortnight</strong>. For Parenting Payment Single, it is <strong>$202.60 per fortnight</strong>. Earning at or below the free area means your Centrelink payment stays at the full rate.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Taper Rate?</h3>
            <p>The taper rate determines how quickly your payment reduces per dollar of income above the free area. A <strong>50-cent taper</strong> means you lose 50 cents of payment for every $1 earned. A <strong>60-cent taper</strong> means you lose 60 cents. Parenting Payment Single uses a gentler <strong>40-cent taper</strong>, reflecting the policy goal of encouraging single parents to re-enter the workforce. You can use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to estimate the combined effect of income tax and taper-rate reductions on your take-home pay.</p>
          </section>

          {/* ── H2 3: Income Test Thresholds Table ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Income Test Thresholds for FY2025-26?</h2>
            <p>Centrelink income test thresholds vary by payment type, relationship status, and number of dependants. The table below lists the current free areas, taper rates, and approximate fortnightly cut-off points for the major payments in the 2025-26 financial year.</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Payment</th><th className="px-5 py-3 text-right">Free Area (per fortnight)</th><th className="px-5 py-3 text-right">Taper Rate</th><th className="px-5 py-3 text-right">Approx. Cut-Off (single, f/n)</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">JobSeeker Payment (single, no children)</td><td className="px-5 py-3 text-right">$150</td><td className="px-5 py-3 text-right">50c up to $256, then 60c</td><td className="px-5 py-3 text-right">~$1,337</td></tr>
              <tr><td className="px-5 py-3">JobSeeker Payment (single, with children)</td><td className="px-5 py-3 text-right">$150</td><td className="px-5 py-3 text-right">50c up to $256, then 60c</td><td className="px-5 py-3 text-right">~$1,442</td></tr>
              <tr><td className="px-5 py-3">Youth Allowance (job seeker)</td><td className="px-5 py-3 text-right">$150</td><td className="px-5 py-3 text-right">50c up to $256, then 60c</td><td className="px-5 py-3 text-right">~$1,127</td></tr>
              <tr><td className="px-5 py-3">Youth Allowance (student / apprentice)</td><td className="px-5 py-3 text-right">$150</td><td className="px-5 py-3 text-right">50c per $1</td><td className="px-5 py-3 text-right">~$1,075</td></tr>
              <tr><td className="px-5 py-3">Austudy</td><td className="px-5 py-3 text-right">$150</td><td className="px-5 py-3 text-right">50c per $1</td><td className="px-5 py-3 text-right">~$1,075</td></tr>
              <tr><td className="px-5 py-3">Age Pension (single)</td><td className="px-5 py-3 text-right">$204</td><td className="px-5 py-3 text-right">50c per $1</td><td className="px-5 py-3 text-right">~$2,444</td></tr>
              <tr><td className="px-5 py-3">Age Pension (couple combined)</td><td className="px-5 py-3 text-right">$360</td><td className="px-5 py-3 text-right">25c per $1 each</td><td className="px-5 py-3 text-right">~$3,737 combined</td></tr>
              <tr><td className="px-5 py-3">Parenting Payment (single)</td><td className="px-5 py-3 text-right">$202.60</td><td className="px-5 py-3 text-right">40c per $1</td><td className="px-5 py-3 text-right">~$2,524</td></tr>
              <tr><td className="px-5 py-3">Parenting Payment (partnered)</td><td className="px-5 py-3 text-right">$150</td><td className="px-5 py-3 text-right">50c up to $256, then 60c</td><td className="px-5 py-3 text-right">~$1,192</td></tr>
              <tr><td className="px-5 py-3">Disability Support Pension (single, &lt;21)</td><td className="px-5 py-3 text-right">$204</td><td className="px-5 py-3 text-right">50c per $1</td><td className="px-5 py-3 text-right">~$2,318</td></tr>
              <tr><td className="px-5 py-3">Carer Payment (single)</td><td className="px-5 py-3 text-right">$204</td><td className="px-5 py-3 text-right">50c per $1</td><td className="px-5 py-3 text-right">~$2,444</td></tr>
            </tbody></table></div></div>
            <p>Thresholds are indexed on <strong>20 March</strong> and <strong>20 September</strong> each year in line with CPI movements. The figures above reflect the rates effective from 20 March 2026. Couple thresholds represent combined income unless otherwise noted.</p>
          </section>

          {/* ── H2 4: What Counts as Assessable Income? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Counts as Assessable Income for Centrelink?</h2>
            <p>Assessable income for Centrelink purposes includes <strong>all gross employment income</strong>, investment returns, and certain other receipts &mdash; broadly any money that increases your capacity to support yourself.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Income Types That Are Counted</h3>
            <ul>
              <li><strong>Employment income</strong> &mdash; wages, salary, commissions, bonuses, overtime, and penalty rates paid by an employer</li>
              <li><strong>Self-employment income</strong> &mdash; net business profit after allowable deductions</li>
              <li><strong>Investment income</strong> &mdash; bank interest, share dividends, managed fund distributions, and rental income</li>
              <li><strong>Overseas income</strong> &mdash; any income earned from overseas sources, converted to AUD</li>
              <li><strong>Superannuation income streams</strong> &mdash; account-based pensions and annuity payments if you are of Age Pension age</li>
              <li><strong>Deemed income</strong> &mdash; income assumed from financial assets using the deeming rate, regardless of actual returns earned</li>
              <li><strong>Director fees and trust distributions</strong> &mdash; payments received as a company director or trust beneficiary</li>
            </ul>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Income Types That Are Not Counted</h3>
            <ul>
              <li>Lump-sum leave payments on termination of employment</li>
              <li>Child support payments you receive</li>
              <li>Certain compensation payments (e.g., workers&apos; compensation periodic payments are treated separately)</li>
              <li>Family Tax Benefit payments</li>
              <li>Rent Assistance</li>
              <li>Energy Supplement payments</li>
            </ul>
            <p>Salary sacrifice arrangements require special attention. Any pre-tax salary sacrifice to superannuation reduces your gross employment income reported to Centrelink, potentially keeping your payment higher. Our <Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> explains how concessional contributions interact with both employer SG rate obligations and Centrelink reporting.</p>
          </section>

          {/* ── H2 5: How Does the Assets Test Interact? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the Assets Test Interact with the Income Test?</h2>
            <p>Services Australia applies <strong>both</strong> an income test and an assets test to your Centrelink claim, then pays you the <strong>lower</strong> of the two results. You must pass both tests to receive the full payment rate.</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Homeowner &mdash; Full Pension Limit</th><th className="px-5 py-3 text-right">Non-Homeowner &mdash; Full Pension Limit</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Single</td><td className="px-5 py-3 text-right">$314,000</td><td className="px-5 py-3 text-right">$566,000</td></tr>
              <tr><td className="px-5 py-3">Couple (combined)</td><td className="px-5 py-3 text-right">$470,000</td><td className="px-5 py-3 text-right">$722,000</td></tr>
            </tbody></table></div></div>
            <p>Assets above the full-pension limit reduce the Age Pension by <strong>$3.00 per fortnight</strong> for every <strong>$1,000</strong> of assets above the threshold (single rate) or <strong>$1.50 each</strong> for couples. The assets test does not count your principal home, but it does count superannuation balances if you have reached Age Pension age.</p>
            <p>For working-age payments such as JobSeeker and Youth Allowance, separate lower asset limits apply. A single homeowner on JobSeeker faces an asset limit of approximately <strong>$314,000</strong>, while a non-homeowner&apos;s limit is roughly <strong>$566,000</strong>. Understanding how both tests interact helps you decide whether to draw down savings, adjust your superannuation balance through <Link href="/superannuation-calculator/">Superannuation Calculator</Link> modelling, or restructure investments before claiming.</p>
          </section>

          {/* ── H2 6: Worked Example ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much JobSeeker Do You Keep with Part-Time Work?</h2>
            <p>A single person on JobSeeker Payment with no children who earns <strong>$600 per fortnight</strong> from part-time work retains approximately <strong>$556.70</strong> of their JobSeeker payment, giving a combined fortnightly income of <strong>$1,156.70</strong>.</p>
            <p>Here is the step-by-step calculation:</p>
            <ol>
              <li><strong>Maximum JobSeeker rate (single, no children):</strong> $762.70 per fortnight</li>
              <li><strong>Gross fortnightly employment income:</strong> $600</li>
              <li><strong>First $150 (free area):</strong> no reduction &mdash; $0 reduction</li>
              <li><strong>$150 to $256 ($106 at 50c taper):</strong> $106 x 0.50 = <strong>$53.00</strong> reduction</li>
              <li><strong>$256 to $600 ($344 at 60c taper):</strong> $344 x 0.60 = <strong>$206.40</strong> reduction</li>
              <li><strong>Total reduction:</strong> $53.00 + $206.40 = <strong>$259.40</strong></li>
              <li><strong>Adjusted JobSeeker:</strong> $762.70 &minus; $259.40 = <strong>$503.30</strong></li>
            </ol>
            <p>If the recipient has accumulated <strong>Working Credits</strong>, up to <strong>48 credits per fortnight</strong> can offset employment income, effectively increasing the free area. In this example, using 48 credits would reduce assessable income from $600 to $552, lowering the total reduction and increasing the retained JobSeeker amount.</p>
            <p>To estimate the income tax payable on your combined JobSeeker and employment income, use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>. Centrelink payments are included in your assessable income for ATO purposes and affect your income tax brackets for FY2025-26.</p>
          </section>

          {/* ── H2 7: How to Report Income ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do You Report Income to Centrelink?</h2>
            <p>You report your gross employment income to Centrelink every <strong>14 days</strong> on your designated reporting day, using one of four channels: the myGov app, the Centrelink online account, the Express Plus app, or by phone on <strong>13 28 50</strong>.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step Reporting Process</h3>
            <ol>
              <li><strong>Log in to myGov</strong> and navigate to your linked Centrelink account</li>
              <li><strong>Select &ldquo;Report Employment Income&rdquo;</strong> from the Payments and Claims menu</li>
              <li><strong>Enter your gross income</strong> for the reporting period &mdash; this is your total pay before tax, Medicare levy, or salary sacrifice deductions</li>
              <li><strong>Declare any other income</strong> such as bank interest, rental income, or overseas income received during the fortnight</li>
              <li><strong>Confirm hours worked</strong> &mdash; Centrelink requires both the dollar amount and the total hours for mutual obligation tracking</li>
              <li><strong>Submit your report</strong> before 7:00 pm AEST on your reporting day to avoid payment delays</li>
            </ol>
            <p>Failing to report on time suspends your payment. If you miss your reporting day, submit as soon as possible &mdash; late reports are processed the next business day. Deliberately underreporting income results in a Centrelink debt, and Services Australia applies a <strong>10% recovery fee</strong> on debts caused by false reporting.</p>
            <p>Employers now report payroll data to the ATO through &ldquo;Single Touch Payroll&rdquo; (STP), and Centrelink cross-references this data against your self-reported figures. Discrepancies trigger automated reviews. Our <Link href="/understanding-your-payslip/">Understanding Your Payslip</Link> guide explains which payslip figure to use when reporting to Centrelink.</p>
          </section>

          {/* ── H2 8: What Changed in FY2025-26? ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed in the Centrelink Income Test for FY2025-26?</h2>
            <p>The 2025-26 financial year brought CPI-indexed increases to free-area thresholds and maximum payment rates, effective from <strong>20 September 2025</strong> and <strong>20 March 2026</strong>.</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Change</th><th className="px-5 py-3">Detail</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Age Pension free area (single)</td><td className="px-5 py-3">Increased from $190 to <strong>$204 per fortnight</strong></td></tr>
              <tr><td className="px-5 py-3">Age Pension free area (couple)</td><td className="px-5 py-3">Increased from $336 to <strong>$360 per fortnight</strong> (combined)</td></tr>
              <tr><td className="px-5 py-3">Deeming rate thresholds</td><td className="px-5 py-3">Lower deeming rate of <strong>0.25%</strong> applies on the first <strong>$60,400</strong> (single) or <strong>$100,200</strong> (couple); upper rate <strong>2.25%</strong></td></tr>
              <tr><td className="px-5 py-3">Working Credit accrual</td><td className="px-5 py-3">Maximum balance remains at <strong>1,000 credits</strong>; no change in FY2025-26</td></tr>
              <tr><td className="px-5 py-3">JobSeeker maximum rate (single)</td><td className="px-5 py-3">Indexed to approximately <strong>$762.70 per fortnight</strong></td></tr>
              <tr><td className="px-5 py-3">Assets test free area (homeowner, single)</td><td className="px-5 py-3">Increased to <strong>$314,000</strong></td></tr>
            </tbody></table></div></div>
            <p>The taper rates themselves &mdash; 50 cents, 60 cents, and 40 cents depending on payment type &mdash; did not change. The Stage 3 income tax cuts that took effect on 1 July 2024 continue to lower income tax obligations for most Australians, meaning higher after-tax income from employment alongside Centrelink payments. Review the updated <Link href="/tax-brackets/">Tax Brackets Guide</Link> to see how these cuts affect each income tax bracket. See our news coverage of the broader <Link href="/news/centrelink-changes-july-2026/">Centrelink changes from 1 July 2026</Link> for the full list of payment and threshold updates.</p>
          </section>

          {/* ── CONTEXT BORDER ── */}

          {/* ── H2 9: Working Credit Explained ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Working Credit Help You Keep More of Your Payment?</h2>
            <p>Working Credit is a Centrelink mechanism that lets you accumulate credits during low-income fortnights and use them to reduce assessable employment income during higher-income fortnights, effectively raising your income free area temporarily.</p>
            <p>You earn <strong>1 Working Credit</strong> for every dollar your employment income falls below the income free area in a given fortnight. The maximum balance is <strong>1,000 credits</strong>. When you earn above the free area, Centrelink automatically deducts credits from your balance at up to <strong>48 credits per fortnight</strong>, reducing your assessable income dollar-for-dollar.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Working Credit Example</h3>
            <p>A Youth Allowance recipient who earns $0 for 10 fortnights accumulates <strong>1,000 credits</strong> (capped). In fortnight 11, they earn $400. Without Working Credits, the income test reduces their payment by $125 (the standard taper calculation). With 48 credits applied, the assessable income drops to $352, reducing the payment cut by <strong>$24</strong> and delivering a higher combined income for that fortnight.</p>
            <p>Working Credit applies only to <strong>employment income</strong> &mdash; it does not offset investment income, self-employment income, or deemed income from financial assets. Students receiving Youth Allowance who also earn from casual work benefit significantly from this system, particularly during semester breaks when hours increase.</p>
          </section>

          {/* ── H2 10: Related Resources ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
            <p>These tools and guides help you model the combined impact of Centrelink income testing, Australian income tax, and employer obligations on your take-home pay and salary planning.</p>
            <ul>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> &mdash; estimate your after-tax income including Centrelink payments in your total assessable income</li>
              <li><Link href="/tax-brackets/">Tax Brackets Guide</Link> &mdash; view the FY2025-26 marginal tax rates that apply to your combined employment and Centrelink income</li>
              <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> &mdash; calculate PAYG withholding on your employment income, including the Medicare levy and surcharge thresholds</li>
              <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link> &mdash; check how your employer&apos;s SG rate contributions affect your retirement savings alongside Centrelink entitlements</li>
              <li><Link href="/parental-leave-pay/">Parental Leave Pay Guide</Link> &mdash; understand government-funded parental leave and how it interacts with Centrelink family payments</li>
              <li><Link href="/low-income-tax-offset/">Low Income Tax Offset Guide</Link> &mdash; find out if you qualify for the LITO, which reduces tax for Australians earning under $66,667</li>
            </ul>
          </section>

          {/* ── H2 11: FAQs ── */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="not-prose mt-6 space-y-3">

              <AccordionItem value="working-credit" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What is Working Credit?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Working Credit lets you build up credits during fortnights when your income is low, then use them to offset income in higher-earning fortnights. You can accumulate up to <strong>1,000 credits</strong> for employment income. Each credit reduces your assessable employment income by $1, which means you keep more of your Centrelink payment when you work extra hours. Credits accrue at 1 per dollar below your income free area and can be used at up to <strong>48 per fortnight</strong>.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="partner" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Does my partner&apos;s income affect my payment?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. For partnered recipients, the income test considers <strong>combined household income</strong>. The free areas and taper rates differ for couples compared to singles. For Age Pension couples, the combined free area is <strong>$360 per fortnight</strong> with a 25-cent taper applied to each partner&apos;s share. For JobSeeker partnered recipients, your partner&apos;s income above their own free area reduces your payment at the standard taper rates.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="gross-or-net" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Do I report gross or net income to Centrelink?</AccordionTrigger>
                <AccordionContent className="text-warmgray">You report <strong>gross income</strong> &mdash; your total pay before income tax, Medicare levy, HECS-HELP repayments, or salary sacrifice deductions are taken out. This is the higher figure on your payslip, not the amount deposited into your bank account. Reporting net (after-tax) income instead of gross is one of the most common reporting errors and leads to Centrelink debts.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="deeming" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What is the deeming rate and how does it affect my payment?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Deeming is a method Centrelink uses to assess income from financial assets (bank accounts, shares, managed funds, superannuation in pension phase). Rather than counting actual returns, Centrelink applies a fixed &ldquo;deemed&rdquo; rate. For singles, the first <strong>$60,400</strong> is deemed at <strong>0.25%</strong> and any balance above that is deemed at <strong>2.25%</strong>. For couples, the lower rate applies on the first <strong>$100,200</strong> combined. The deemed income is added to your other assessable income for the income test. See our news coverage of the latest <Link href="/news/deeming-rates-change-2026/">deeming rate changes</Link> for the current settings.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="super-counted" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Is my superannuation balance counted for the income test?</AccordionTrigger>
                <AccordionContent className="text-warmgray"><strong>Before Age Pension age:</strong> your superannuation balance is generally <strong>not counted</strong> under either the income test or the assets test. <strong>After reaching Age Pension age:</strong> your super balance becomes a financial asset and is subject to deeming rules under the income test and counted in full under the assets test. This transition significantly impacts your Centrelink entitlement.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="salary-sacrifice" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Does salary sacrifice reduce my assessable income for Centrelink?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes, in most cases. Pre-tax salary sacrifice to superannuation reduces your gross employment income, which lowers the amount assessed under the Centrelink income test. This can help you retain more of your Centrelink payment. However, Centrelink may &ldquo;look through&rdquo; certain salary sacrifice arrangements if they appear designed solely to increase your entitlement. Sacrificing to a novated lease or meal entertainment card also reduces assessed income.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="one-off-payment" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">How does a one-off lump sum payment affect my Centrelink?</AccordionTrigger>
                <AccordionContent className="text-warmgray">One-off employment income such as a <strong>bonus</strong> or <strong>back-pay</strong> is assessed in the fortnight you earn it, which can temporarily reduce or eliminate your payment for that period. Lump-sum leave payments on termination (unused annual leave, long service leave) are generally <strong>not assessed</strong> as employment income but may be treated as an asset if deposited into a bank account. Report any lump sum in the fortnight it is paid.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="reporting-late" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What happens if I report my income late?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Late reporting <strong>suspends your Centrelink payment</strong>. You do not lose eligibility permanently, but your payment for that fortnight is delayed until you submit your report. If you fail to report for <strong>2 consecutive fortnights</strong>, your payment may be cancelled and you will need to re-claim. Submit your report before <strong>7:00 pm AEST</strong> on your designated reporting day to avoid disruption.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="centrelink-taxable" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Is my Centrelink payment taxable income?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. Most Centrelink income-support payments &mdash; including JobSeeker, Youth Allowance, Austudy, Age Pension, and Parenting Payment &mdash; are <strong>taxable income</strong> and must be included in your annual tax return. Centrelink withholds tax at a rate you choose (or a default rate) and issues a Centrelink Payment Summary at the end of each financial year. Non-taxable payments include Disability Support Pension (if you are under Age Pension age) and Carer Allowance.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="income-nil" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Do I still need to report if I earned no income this fortnight?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. You must submit a report every fortnight even if your employment income is <strong>$0</strong>. A nil report confirms your ongoing eligibility and triggers your payment. Failing to submit a nil report is treated the same as a late report &mdash; your payment is suspended until the report is received.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment-cancelled" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Can I get my payment back if it is reduced to $0 by the income test?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. If your income drops back below the cut-off threshold within <strong>6 fortnights</strong>, your payment automatically resumes without needing to re-claim. This is called the <strong>employment income nil rate period</strong>. After 6 consecutive fortnights at nil rate, your payment is cancelled and you must lodge a new claim to restart benefits. During the nil rate period, you retain your concession card and other linked benefits.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="rental-income" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">How is rental income assessed for the Centrelink income test?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Rental income is assessed as <strong>net rental income</strong> &mdash; your gross rent received minus allowable deductions such as property management fees, repairs, insurance, and loan interest. Centrelink calculates this on an annual basis, then converts it to a fortnightly figure. Negative gearing losses on investment properties can reduce your total assessable income for Centrelink, the same way they reduce taxable income for the ATO.</AccordionContent>
              </AccordionItem>

            </Accordion>
          </section>

          <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Income thresholds and taper rates sourced from Services Australia. Rates are indexed twice yearly (20 March and 20 September). Payment rates reflect the most recent indexation. The Australian tax calculator and income test thresholds are updated each financial year to align with ATO and Services Australia data.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("centrelink-income-test"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
        </article>
        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" /><SidebarLink href="/tax-brackets/" label="Tax Brackets Guide" /><SidebarLink href="/parental-leave-pay/" label="Parental Leave Pay Guide" /><SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" /><SidebarLink href="/low-income-tax-offset/" label="Low Income Tax Offset Guide" /><SidebarLink href="/superannuation-calculator/" label="Superannuation Calculator" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

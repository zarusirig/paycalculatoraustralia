"use client";
import Link from "next/link";
import { ChevronRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
const SOURCES_LIST: SourceLink[] = [
  { title: "Novated leasing", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/fbt-on-cars-other-vehicles-parking-and-tolls/cars-and-fbt/car-leasing-and-fbt", publisher: SOURCES.ato.name },
  { title: "Fringe benefits tax – car fringe benefits", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/fbt-on-cars-other-vehicles-parking-and-tolls", publisher: SOURCES.ato.name },
  { title: "Electric cars exemption", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/fbt-on-cars-other-vehicles-parking-and-tolls/electric-cars-exemption", publisher: SOURCES.ato.name },
  { title: "FBT on plug-in hybrid electric vehicles", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/fbt-on-cars-other-vehicles-parking-and-tolls/fbt-on-plug-in-hybrid-electric-vehicles", publisher: SOURCES.ato.name },
  { title: "TD 93/142 \u2013 minimum residual values", url: "https://www.ato.gov.au/law/view/document?docid=TXD/TD93142/NAT/ATO/00001", publisher: SOURCES.ato.name },
];

export default function NovatedLeaseGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Novated Lease Guide</span></li></ol></nav>
      <header className="mb-10 max-w-4xl"><h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How a Novated Lease Works</h1><p className="text-xl text-warmgray leading-relaxed mb-6">The three-way agreement, what sits in the running-cost budget, how the employee contribution cancels the FBT, what happens if you leave your job, and what you owe at the end. This page explains the mechanics; the numbers for your own salary and car are on the calculator.</p><TrustBar className="!max-w-none" /><div className="not-prose mt-8 rounded-xl border border-eucalyptus/40 bg-eucalyptus-light/40 p-5"><div className="flex items-start gap-4"><Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" /><div><p className="text-base font-bold text-navy mb-1">Want the figures, not the theory?</p><p className="text-sm text-warmgray mb-3">The <Link href="/novated-lease-calculator/" className="font-semibold text-eucalyptus-dark underline">Novated Lease Calculator</Link> works out the pre-tax and post-tax deductions on your payslip, the FBT or the electric car exemption, the reportable fringe benefits amount, and your take-home pay before and after &mdash; on your salary and your car price.</p><Link href="/novated-lease-calculator/" className="inline-flex items-center gap-1 text-sm font-semibold text-eucalyptus-dark hover:underline">Open the novated lease calculator <ChevronRight className="h-4 w-4" /></Link></div></div></div></header>
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          {/* ============================================================ */}
          {/* SECTION 1 — What Is a Novated Lease? */}
          {/* ============================================================ */}
          <section id="what-is-novated-lease">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is a Novated Lease?</h2>
            <p>A novated lease is a three-way agreement between an employee, their employer, and a finance company that allows car costs to be paid from <strong>pre-tax salary</strong>, reducing taxable income and overall vehicle running expenses.</p>
            <p>The word &quot;novation&quot; is a legal term meaning the substitution of one party to a contract for another. In a novated lease, the employer assumes the employee&apos;s payment obligations to the leasing company for the duration of employment. The employee chooses the vehicle, negotiates the price, and selects the lease term &mdash; typically <strong>1 to 5 years</strong>. The employer then deducts lease payments and bundled running costs directly from the employee&apos;s gross salary each pay cycle.</p>
            <p>Three documents form the arrangement: a finance lease between the employee and the leasing company, a novation agreement transferring payment responsibility to the employer, and a salary packaging agreement between the employee and employer. The vehicle remains registered in the employee&apos;s name throughout the lease term, and full private use is permitted.</p>
            <p>Unlike a standard car loan, a novated lease bundles all vehicle expenses &mdash; including fuel, registration, insurance, tyres, and scheduled servicing &mdash; into a single fortnightly or monthly deduction. This bundling is where the saving comes from: the deduction is taken before tax, and the employer claims the GST credits. How much that is worth depends on your marginal rate, the car and the FBT treatment &mdash; the <Link href="/novated-lease-calculator/">novated lease calculator</Link> works it out on your own figures, and the <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link> shows what any pre-tax deduction does to take-home pay.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is a Novated Lease Different from a Finance Lease?</h3>
            <p>A finance lease is a two-party agreement between a borrower and a lender. A novated lease adds a third party &mdash; the employer &mdash; and shifts the payment obligation from the employee to the employer via the novation deed. The Australian tax calculator treatment differs: finance lease payments come from after-tax income, while novated lease payments use pre-tax salary, reducing assessable income. The vehicle ownership structure is identical in both cases &mdash; the employee takes title after paying the residual &mdash; but only a novated lease delivers income tax brackets savings at the employee&apos;s marginal rate.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 2 — How Does a Novated Lease Work? */}
          {/* ============================================================ */}
          <section id="how-does-novated-lease-work">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does a Novated Lease Work?</h2>
            <p>A novated lease works by splitting each pay into a pre-tax component (the lease payment and running costs) and a post-tax component (the employee contribution), with the employer remitting both directly to the leasing company on the employee&apos;s behalf.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step Process</h3>
            <ol>
              <li><strong>Check eligibility</strong> &mdash; Confirm your employer offers salary packaging. Most medium-to-large employers, all government departments, and many SMEs participate. The vehicle must be used or available for private use.</li>
              <li><strong>Choose a vehicle</strong> &mdash; new or used, subject to the provider&apos;s age limit at lease end. If it is an electric car, the price decides whether the FBT exemption applies: it has to sit under the luxury car tax threshold for fuel-efficient vehicles, which the <Link href="/novated-lease-calculator/">calculator</Link> carries for the current year.</li>
              <li><strong>Get a lease quote</strong> &mdash; The leasing company provides a quote covering the finance cost, residual value, and a running cost budget covering fuel, insurance, registration, maintenance, and tyres.</li>
              <li><strong>Sign three agreements</strong> &mdash; The finance lease, novation deed, and salary packaging agreement are executed. No deposit is required in most novated lease arrangements.</li>
              <li><strong>Salary deductions begin</strong> &mdash; Your employer deducts the total lease budget from your gross pay each period. The pre-tax portion reduces your assessable income. A smaller post-tax portion covers the employee contribution to reduce or eliminate FBT liability.</li>
              <li><strong>Drive and claim</strong> &mdash; You use the car for both personal and work purposes. Running cost invoices go to the leasing company, which pays them from your budgeted running cost pool.</li>
              <li><strong>End of lease</strong> &mdash; At lease end, you pay the residual value to own the car outright, refinance the residual into a new lease, or return the vehicle to the dealer.</li>
            </ol>
            <p>Throughout the lease, your employer handles all payments to the finance company. Your payslip shows the pre-tax and post-tax deductions as separate line items &mdash; review our <Link href="/understanding-your-payslip/">Understanding Your Payslip</Link> guide to see how these appear.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Costs Are Included in a Novated Lease Budget?</h3>
            <p>A fully maintained novated lease bundles <strong>6 cost categories</strong> into a single payroll deduction. The leasing company estimates annual costs for each category based on the vehicle type, expected kilometres, and location. The annual budget for a $40,000 sedan driven 15,000 km per year typically breaks down as follows:</p>
            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="p-3 text-left rounded-tl-lg">Cost Category</th>
                    <th className="p-3 text-right">Estimated Annual Cost</th>
                    <th className="p-3 text-left rounded-tr-lg">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">Lease repayment (finance)</td>
                    <td className="p-3 text-right">$7,200</td>
                    <td className="p-3">Includes interest at ~7.5% p.a.</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">Fuel</td>
                    <td className="p-3 text-right">$2,400</td>
                    <td className="p-3">Based on 15,000 km at ~$1.85/litre</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">Comprehensive insurance</td>
                    <td className="p-3 text-right">$1,200</td>
                    <td className="p-3">Fleet-rate pricing, typically 20&ndash;30% below retail</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">Registration &amp; CTP</td>
                    <td className="p-3 text-right">$400</td>
                    <td className="p-3">Varies by state &mdash; NSW and VIC are highest</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">Servicing &amp; maintenance</td>
                    <td className="p-3 text-right">$500</td>
                    <td className="p-3">Includes scheduled logbook services</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-navy rounded-bl-lg">Tyres</td>
                    <td className="p-3 text-right">$300</td>
                    <td className="p-3 rounded-br-lg">Replacement set amortised over lease term</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>The total annual budget of approximately <strong>$12,000</strong> translates to <strong>$461 per fortnight</strong> or <strong>$1,000 per month</strong>. Any surplus remaining in the running cost account at lease end is refunded to the employee. Any shortfall is the employee&apos;s responsibility.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 3 — What Are the Tax Benefits? */}
          {/* ============================================================ */}
          <section id="tax-benefits">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Where the Tax Saving Comes From</h2>
            <p>A novated lease has <strong>three</strong> separate money effects, and they do not all pull the same way. Understanding which is which is the difference between a good decision and a surprise at tax time.</p>
            <ol>
              <li><strong>Income tax on the pre-tax deduction.</strong> The lease and running-cost budget comes off your gross pay before tax is worked out, so you keep the tax you would have paid on that slice of salary. The higher your marginal rate, the more the slice is worth.</li>
              <li><strong>GST credits.</strong> The employer is registered for GST and claims credits on the lease payments and packaged running costs. Whether &mdash; and how much of &mdash; that credit lands in your budget is set by the packaging arrangement, so read it off your quote rather than assuming it.</li>
              <li><strong>FBT, in the other direction.</strong> Giving an employee a car for private use is a fringe benefit, and FBT is charged at 47% on the grossed-up taxable value. Either the employee contribution method cancels it, or it is funded out of the same budget. An eligible electric car is exempt from FBT altogether.</li>
            </ol>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Fourth Effect Most Explanations Leave Out</h3>
            <p>A car fringe benefit with a taxable value over $2,000 in an FBT year is reported on your income statement as a <strong>reportable fringe benefits amount</strong>. You are not taxed on it &mdash; but it is added to your income for the HECS-HELP repayment test, the Medicare levy surcharge, the private health insurance rebate and <Link href="/division-293-tax/">Division 293 tax</Link>. So a lease can cut your taxable income and lift your compulsory study loan repayment in the same year, and an FBT-exempt electric car is not exempt from being reported.</p>
            <p>A full employee contribution is the one thing that removes it: it takes the taxable value to nil, so there is nothing left to report. The <Link href="/novated-lease-calculator/">novated lease calculator</Link> shows the reported amount, the income the tests actually use, and what it does to a HECS-HELP repayment. Private hospital cover is still the only way to avoid the surcharge itself &mdash; see <Link href="/private-health-insurance-medicare/">private health insurance and the Medicare levy</Link>.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 4 — Novated Lease vs Car Loan */}
          {/* ============================================================ */}
          <section id="novated-lease-vs-car-loan">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Novated Lease vs Car Loan: What Is the Difference?</h2>
            <p>A novated lease uses pre-tax salary and bundles running costs into one payment, while a car loan is repaid entirely from after-tax income with running costs managed separately.</p>

            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="p-3 text-left rounded-tl-lg">Feature</th>
                    <th className="p-3 text-left">Novated Lease</th>
                    <th className="p-3 text-left rounded-tr-lg">Car Loan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">Payment source</td>
                    <td className="p-3">Pre-tax + small post-tax component</td>
                    <td className="p-3">100% after-tax income</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">Income tax saving</td>
                    <td className="p-3">Yes &mdash; reduces taxable income</td>
                    <td className="p-3">No tax benefit</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">GST on purchase price</td>
                    <td className="p-3">Saved (claimed by lessor)</td>
                    <td className="p-3">Paid in full by buyer</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">Running costs included</td>
                    <td className="p-3">Yes &mdash; fuel, rego, insurance, servicing, tyres</td>
                    <td className="p-3">No &mdash; managed separately</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">FBT liability</td>
                    <td className="p-3">Yes &mdash; unless EV-exempt</td>
                    <td className="p-3">No FBT applies</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">Residual / balloon</td>
                    <td className="p-3">Minimum residual set by the ATO (37.50% on a 4-year lease, 28.13% on a 5-year one)</td>
                    <td className="p-3">Optional balloon at lender discretion</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">Ownership</td>
                    <td className="p-3">Employee owns after paying residual at lease end</td>
                    <td className="p-3">Buyer owns once loan repaid</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">Employer involvement</td>
                    <td className="p-3">Required &mdash; employer makes deductions</td>
                    <td className="p-3">None</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">Reportable fringe benefit</td>
                    <td className="p-3">Yes &mdash; counts in the HECS-HELP, Medicare levy surcharge and Division 293 income tests</td>
                    <td className="p-3">None</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-navy rounded-bl-lg">Best for</td>
                    <td className="p-3">Employees on $45,000+ with supportive employer</td>
                    <td className="p-3 rounded-br-lg">Self-employed or employer does not offer packaging</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Which one wins depends on your marginal rate, the price of the car and whether it is FBT-exempt &mdash; and on the finance rate, which is set per deal and which this site does not model. Work out where you sit with the <Link href="/novated-lease-calculator/">novated lease calculator</Link>, then add your quoted finance charges to the lease side before deciding. Your current bracket is on the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.</p>
            <p>The lease is weakest where the tax saving is smallest and the FBT is largest: a low marginal rate paired with a car that is not FBT-exempt. It is strongest on an eligible electric car, where the FBT disappears entirely and the pre-tax deduction covers the whole budget. A car loan is the only option at all if you are self-employed or your employer does not offer packaging.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 5 — ECM vs Statutory Method */}
          {/* ============================================================ */}
          <section id="ecm-vs-statutory">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does ECM vs Statutory Method Work?</h2>
            <p>The &quot;Statutory Formula Method&quot; calculates FBT on <strong>20% of the car&apos;s base value</strong> regardless of kilometres driven, while the &quot;Employee Contribution Method&quot; (ECM) reduces the taxable FBT value by the amount the employee contributes from post-tax income.</p>

            <div className="not-prose grid sm:grid-cols-2 gap-6 my-6">
              <div className="bg-white p-6 rounded-xl border border-sandstone-dark/20 shadow-sm border-t-4 border-t-eucalyptus">
                <h3 className="font-semibold text-navy mb-2">Statutory Method</h3>
                <p className="text-sm text-warmgray mb-3">20% of the car&apos;s base value is treated as the FBT value, regardless of how much you drive. Simple but often results in higher FBT.</p>
                <ul className="text-sm text-warmgray space-y-1">
                  <li>&bull; Fixed 20% statutory fraction applies to all cars</li>
                  <li>&bull; Base value is the GST-inclusive cost price including dealer delivery and non-business accessories, but excluding registration and stamp duty</li>
                  <li>&bull; FBT taxable value = base value &times; 20% &times; days available &divide; days in the FBT year, less any employee contribution</li>
                  <li>&bull; No logbook required</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-sandstone-dark/20 shadow-sm border-t-4 border-t-eucalyptus-dark">
                <h3 className="font-semibold text-navy mb-2">ECM (Employee Contribution Method)</h3>
                <p className="text-sm text-warmgray mb-3">Your post-tax contributions reduce the FBT taxable value dollar for dollar. Because a dollar of taxable value costs more in FBT than a dollar of salary costs in income tax, ECM is the cheaper method at every marginal rate an employee can face this year.</p>
                <ul className="text-sm text-warmgray space-y-1">
                  <li>&bull; Employee contributes from after-tax pay to reduce FBT value</li>
                  <li>&bull; Contribution must be made during the FBT year (1 April &ndash; 31 March)</li>
                  <li>&bull; FBT taxable value = statutory value &minus; employee contribution</li>
                  <li>&bull; If contribution &ge; statutory value, FBT liability = $0</li>
                </ul>
              </div>
            </div>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Choosing the Right Method</h3>
            <p>Most providers default to ECM, because the post-tax contribution target is simply the statutory taxable value &mdash; 20% of the base value for a full FBT year. Contribute that much from after-tax pay and the FBT falls to nil, the employer has no FBT cost to pass on, and there is no reportable fringe benefit either. The rest of the budget stays pre-tax.</p>
            <p>The operating cost (logbook) method is a third way of valuing the benefit, using actual costs and a business-use percentage. Employers rarely offer it for novated leases because of the record keeping. For the mechanics across all benefit types, see the <Link href="/fringe-benefits-tax/">fringe benefits tax guide</Link>; for the two methods priced out on your own car, the <Link href="/novated-lease-calculator/">novated lease calculator</Link> shows both side by side, including the break-even marginal rate.</p>
            <p>One date trap: the FBT year runs <strong>1 April to 31 March</strong>, not 1 July to 30 June. Contributions have to be made within the FBT year they relate to, and a lease that starts mid-year is only a part-year benefit.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 6 — Worked Example */}
          {/* ============================================================ */}
          <section id="worked-example">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Putting It on Your Own Numbers</h2>
            <p>Every worked example on a novated lease page is a worked example of somebody else&apos;s salary, car and running costs. Three inputs move the answer more than anything else: your marginal rate, the price of the car (which sets the FBT taxable value), and whether the car is FBT-exempt.</p>
            <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
              <div className="flex items-start gap-4">
                <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-navy mb-1">Novated Lease Calculator</h3>
                  <p className="text-sm text-warmgray mb-3">Enter your salary, the car&apos;s GST-inclusive price, the term and your running-cost budget. It returns the pre-tax deduction, the post-tax employee contribution, the FBT or the exemption, the reportable fringe benefits amount, your take-home pay before and after, and the total against buying the same car from after-tax income.</p>
                  <Link href="/novated-lease-calculator/" className="inline-flex items-center gap-1 text-sm font-semibold text-eucalyptus-dark hover:underline">Work out your deductions <ChevronRight className="h-4 w-4" /></Link>
                </div>
              </div>
            </div>
            <p>Two things no calculator can tell you, and which belong on your quote rather than on a web page: the interest rate the financier is charging, and the residual the lease is actually written to. Ask for the amount financed, the total of the payments and the residual in writing, then check the deductions on your first payslip against them.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 7 — Who Benefits Most? */}
          {/* ============================================================ */}
          <section id="who-benefits-most">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Benefits Most from a Novated Lease?</h2>
            <p>The saving on the pre-tax deduction is worth your marginal rate, so the same car and the same budget are worth more to someone on 37c in the dollar than to someone on 15c. Below the tax-free threshold there is nothing to save at all, and around the bottom bracket the post-tax employee contribution can swallow most of the benefit.</p>
            <p>But the marginal rate is only half of it. On a car that is not FBT-exempt, the FBT taxable value is fixed at 20% of the price no matter what you earn &mdash; so a cheap car on a high salary looks very different from an expensive car on a modest one. And the reportable fringe benefits amount lands hardest on people with a study loan, because it lifts repayment income without lifting take-home pay. Rather than reading a range off a table, put your own salary and car through the <Link href="/novated-lease-calculator/">novated lease calculator</Link>: it prices the deductions, the FBT, the reported amount and the HECS-HELP effect together.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Is Not Eligible for a Novated Lease?</h3>
            <p>A novated lease is less beneficial for employees earning under <strong>$45,000</strong>, those within 2 years of retirement (insufficient time to realise savings), and casual employees without a guaranteed salary. Self-employed workers and sole traders are ineligible because the arrangement requires an employer-employee relationship. Contractors on ABN-only arrangements cannot access novated leasing. Employees on fixed-term contracts shorter than the proposed lease term face additional risk, though most leasing providers offer portability and payout options to mitigate this.</p>
            <p>Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to compare your current after-tax pay with and without salary packaging. The <Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Guide</Link> explains the employment classification requirements for accessing salary packaging benefits including novated leases.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 8 — End of Lease */}
          {/* ============================================================ */}
          <section id="end-of-lease">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Happens at the End of a Novated Lease?</h2>
            <p>At lease end, the employee has <strong>three options</strong>: pay the residual value to own the car outright, refinance the residual into a new novated lease on the same vehicle, or trade the car in and start a new lease on a different vehicle.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>ATO Residual Value Table</h3>
            <p>The ATO sets minimum residual values as a percentage of the vehicle&apos;s original cost, in Taxation Determination TD 93/142 &mdash; the 8-year effective life column, which is the one its own worked example uses for a car. A lease can be written with a higher residual, which lowers the deductions now and raises the payment at the end.</p>
            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="p-3 text-left rounded-tl-lg">Lease Term</th>
                    <th className="p-3 text-right">Minimum Residual (%)</th>
                    <th className="p-3 text-right rounded-tr-lg">Residual on $40,000 Car</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">1 year</td>
                    <td className="p-3 text-right">65.63%</td>
                    <td className="p-3 text-right">$26,252</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">2 years</td>
                    <td className="p-3 text-right">56.25%</td>
                    <td className="p-3 text-right">$22,500</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">3 years</td>
                    <td className="p-3 text-right">46.88%</td>
                    <td className="p-3 text-right">$18,752</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">4 years</td>
                    <td className="p-3 text-right">37.50%</td>
                    <td className="p-3 text-right">$15,000</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-navy rounded-bl-lg">5 years</td>
                    <td className="p-3 text-right">28.13%</td>
                    <td className="p-3 text-right rounded-br-lg">$11,252</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>A longer term means a lower balloon payment but more years of finance charges. The residual is paid from after-tax money, which is why the <Link href="/novated-lease-calculator/">calculator</Link> counts it in the total &mdash; a comparison against buying the car that stops at the end of the lease is not a fair one.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Happens If You Leave Your Job Mid-Lease?</h3>
            <p>The novation deed automatically unwinds when employment ends. The lease reverts to a standard finance lease between the employee and the leasing company. The employee has <strong>3 options</strong> at that point: transfer the lease to a new employer (if the new employer offers salary packaging), continue paying the lease personally from after-tax income, or pay out the remaining balance and residual in a lump sum. Most leasing companies offer a portability guarantee that allows seamless transfer to a new employer within <strong>60 to 90 days</strong>. No early termination fee applies when transferring to a new employer. Paying out early incurs a break cost equal to the remaining lease payments plus the residual, minus a discount for early settlement typically worth <strong>1&ndash;3 months of interest</strong>.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 9 — Electric cars and plug-in hybrids */}
          {/* ============================================================ */}
          <section id="electric-cars-and-phevs">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Electric Cars and Plug-In Hybrids: What the Exemption Covers</h2>
            <p>Private use of an eligible electric car provided under a novated lease is <strong>exempt from FBT</strong>, and so are the associated car expenses &mdash; registration, insurance, repairs and maintenance, and the electricity to charge it. That removes both the FBT and the need for any post-tax employee contribution.</p>
            <p>The ATO&apos;s conditions are cumulative. All four have to be true:</p>
            <ul>
              <li>The car is a <strong>zero or low emissions vehicle</strong> &mdash; a battery electric vehicle or a hydrogen fuel cell electric vehicle. Nothing else qualifies, and motorcycles and scooters are not cars for FBT purposes even when they are electric.</li>
              <li>The first time the car was both <strong>held and used</strong> was on or after 1 July 2022.</li>
              <li>It is used by a current employee or their associates.</li>
              <li><strong>Luxury car tax has never been payable</strong> on the importation or sale of the car &mdash; which means its value has to sit under the LCT threshold for fuel-efficient vehicles at the first retail sale and at every sale after that. One dollar over and the exemption is gone entirely, not merely reduced. If you are buying second hand, that history is yours to check.</li>
            </ul>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Plug-In Hybrids Stopped Qualifying on 1 April 2025</h3>
            <p>From <strong>1 April 2025</strong> a plug-in hybrid is no longer a zero or low emissions vehicle under FBT law, so a PHEV novated lease entered into now attracts FBT in full. The transitional rule is narrow, and both limbs have to be satisfied: the PHEV was used, or available for use, before 1 April 2025 and that use was exempt; <em>and</em> there is a financially binding commitment to continue providing it for private use on and after that date. The ATO states it has no discretion to extend the date, including where delivery was delayed by circumstances outside anyone&apos;s control.</p>
            <p>The exemption then ends the moment the commitment changes. Taking up an option to extend the lease, a break in the novation, a change to the lease payments or the residual value, or a change of employer each creates a new commitment &mdash; and the exemption stops from that point, even mid-lease. An optional extension never counts as binding, because a binding commitment has to be for a pre-determined period.</p>
            <p>The <Link href="/novated-lease-calculator/">novated lease calculator</Link> carries the current-year LCT threshold and asks the plug-in hybrid question directly, so it will not quietly treat a new PHEV lease as exempt.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>An Exempt Car Is Still a Reported Car</h3>
            <p>The exemption removes the FBT, not the reporting. The notional taxable value of an exempt electric car is still worked out and still appears on your income statement as a reportable fringe benefits amount, where it counts towards HECS-HELP repayment income, the Medicare levy surcharge and Division 293. It is the single most common surprise on an EV novated lease, and the <Link href="/novated-lease-calculator/">calculator</Link> shows the amount and its effect.</p>
            <p>There is no legislated end date for the exemption for battery electric and hydrogen fuel cell cars. The government has said it will complete a review of the exemption by mid-2027.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 10 — Common Mistakes */}
          {/* ============================================================ */}
          <section id="common-mistakes">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Common Mistakes with Novated Leases?</h2>
            <p>The most common novated lease mistake is reading the pre-tax deduction as if it were the saving. It is not: the post-tax employee contribution, the FBT and the residual all sit on the other side of the ledger.</p>

            <ol>
              <li><strong>Ignoring the post-tax contribution</strong> &mdash; marketing highlights the pre-tax deduction and leaves the employee contribution in the footnotes. On a car that is not FBT-exempt the contribution is 20% of the GST-inclusive price every year, paid from after-tax money. Put both lines through the <Link href="/novated-lease-calculator/">calculator</Link> before signing.</li>
              <li><strong>Choosing a term without pricing the residual</strong> &mdash; a shorter lease means a much larger balloon payment at the end, paid from after-tax money. The ATO minimum residual is 56.25% of the original cost on a two-year lease against 28.13% on a five-year one.</li>
              <li><strong>Underestimating running costs</strong> &mdash; setting a low budget to shrink the payroll deduction just moves the shortfall to the end of the lease, where you fund it from after-tax money. Estimate fuel or charging, insurance, registration, tyres and servicing on the kilometres you actually drive.</li>
              <li><strong>Buying an electric car just over the luxury car tax threshold</strong> &mdash; the FBT exemption depends on LCT never having been payable, so a car priced a few hundred dollars over the fuel-efficient threshold loses the exemption completely rather than partly. The current threshold is on the <Link href="/novated-lease-calculator/">calculator</Link>, which warns when your price crosses it.</li>
              <li><strong>Not checking the super line on the payslip</strong> &mdash; under Payday Super, qualifying earnings include salary sacrificed amounts that would otherwise be qualifying earnings, so the pre-tax deduction should not reduce the super your employer pays. If the super line fell when the lease started, ask payroll which figure they are using.</li>
            </ol>
          </section>

          {/* ============================================================ */}
          {/* --- CONTEXT BORDER --- */}
          {/* ============================================================ */}

          {/* ============================================================ */}
          {/* SECTION 11 — Related Resources */}
          {/* ============================================================ */}
          <section id="related-resources">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
            <p>Use these calculators and guides to put numbers on a novated lease and check them against your payslip.</p>
            <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
              <Link href="/novated-lease-calculator/" className="group p-4 rounded-lg border border-eucalyptus/50 bg-eucalyptus-light/30 hover:border-eucalyptus hover:shadow-sm transition-all">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Novated Lease Calculator</h3>
                <p className="text-xs text-warmgray mt-1">Pre-tax and post-tax deductions, FBT or the electric car exemption, the reportable amount, and your take-home pay.</p>
              </Link>
              <Link href="/salary-sacrifice-calculator/" className="group p-4 rounded-lg border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Salary Sacrifice Calculator</h3>
                <p className="text-xs text-warmgray mt-1">Model how pre-tax deductions reduce your taxable income and PAYG withholding.</p>
              </Link>
              <Link href="/fringe-benefits-tax/" className="group p-4 rounded-lg border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Fringe Benefits Tax Guide</h3>
                <p className="text-xs text-warmgray mt-1">Understand FBT types, rates, and how employer-provided car benefits are taxed.</p>
              </Link>
              <Link href="/take-home-pay-calculator/" className="group p-4 rounded-lg border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Take-Home Pay Calculator</h3>
                <p className="text-xs text-warmgray mt-1">Your net pay after income tax, the Medicare levy and superannuation.</p>
              </Link>
              <Link href="/superannuation-guide/" className="group p-4 rounded-lg border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Superannuation Guide</h3>
                <p className="text-xs text-warmgray mt-1">Check whether novated lease deductions affect your super guarantee contributions.</p>
              </Link>
              <Link href="/income-tax-calculator/" className="group p-4 rounded-lg border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Income Tax Calculator</h3>
                <p className="text-xs text-warmgray mt-1">See your income tax brackets and calculate tax payable on your assessable income.</p>
              </Link>
              <Link href="/hecs-help-calculator/" className="group p-4 rounded-lg border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">HECS-HELP Calculator</h3>
                <p className="text-xs text-warmgray mt-1">Repayment income, the bands, and what a reportable fringe benefit adds to them.</p>
              </Link>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 12 — FAQs */}
          {/* ============================================================ */}
          <section id="faqs">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="not-prose mt-6 space-y-3">

              <AccordionItem value="what-is" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What is a novated lease in simple terms?</AccordionTrigger>
                <AccordionContent className="text-warmgray">A novated lease is a salary packaging arrangement where your employer deducts car lease payments and running costs from your <strong>pre-tax salary</strong>. This reduces your taxable income and lowers the total cost of running a vehicle compared to paying with after-tax dollars. The car is registered in your name, and you choose the vehicle, lease term, and running cost budget.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="leave" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What happens if I leave my job?</AccordionTrigger>
                <AccordionContent className="text-warmgray">The lease &quot;novates&quot; to your new employer if they agree to take it on. Otherwise, you can either pay out the remaining lease, transfer it personally, or in some cases return the vehicle. Most leasing companies offer a portability guarantee, meaning the lease transfers seamlessly to a new employer that offers salary packaging. The transfer typically completes within <strong>60 to 90 days</strong> of starting new employment.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="ev" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Are EVs eligible for novated leasing?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. A battery electric or hydrogen fuel cell car first held and used on or after 1 July 2022, on which luxury car tax has never been payable, is <strong>exempt from FBT</strong> &mdash; along with its registration, insurance, servicing and charging. Plug-in hybrids stopped qualifying on <strong>1 April 2025</strong> and are only exempt under a binding arrangement that was already in place and in use before that date. An exempt car is still a reportable fringe benefit. The <Link href="/novated-lease-calculator/">novated lease calculator</Link> carries the current luxury car tax threshold.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="super" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Does a novated lease reduce my super?</AccordionTrigger>
                <AccordionContent className="text-warmgray">It should not. Under Payday Super, qualifying earnings include salary sacrificed amounts that would otherwise be qualifying earnings, so your employer&apos;s super should still be worked out on your pre-sacrifice salary. Check the super line on the payslip after the first lease deduction, and ask payroll which figure they are using if it moved.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="used-car" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Can I novate a used car?</AccordionTrigger>
                <AccordionContent className="text-warmgray"><strong>Yes</strong>, most leasing providers accept used vehicles that are under 7 years old at the end of the proposed lease term. The vehicle must have a clear title, current registration, and pass a mechanical inspection. Used car novated leases deliver smaller GST savings (no GST credit on private-sale used cars) but still provide income tax savings through pre-tax deductions.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="fbt-cost" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">How much FBT do I pay on a novated lease?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Under the employee contribution method you can take it to <strong>$0</strong> by contributing the statutory taxable value from post-tax pay &mdash; 20% of the car&apos;s GST-inclusive base value for a full FBT year. Otherwise FBT is 47% of that value grossed up at 2.0802, funded from the same packaging budget. An FBT-exempt electric car needs no contribution at all. The <Link href="/novated-lease-calculator/">calculator</Link> prices both methods on your car.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="minimum-salary" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What is the minimum salary for a novated lease?</AccordionTrigger>
                <AccordionContent className="text-warmgray">There is no legislated minimum, though providers set their own. What matters is the arithmetic: below $45,000 the marginal rate is 15c in the dollar plus the Medicare levy, so each pre-tax dollar saves little, while the post-tax employee contribution on a car that is not FBT-exempt is a fixed 20% of its price. Above $45,000 the 30c rate applies and the picture changes. Test it on the <Link href="/novated-lease-calculator/">novated lease calculator</Link>.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="rego-insurance" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Are registration and insurance included?</AccordionTrigger>
                <AccordionContent className="text-warmgray"><strong>Yes</strong>. A fully maintained novated lease bundles registration, comprehensive insurance, fuel, scheduled servicing, tyres, and roadside assistance into the fortnightly or monthly budget. The leasing company pays these costs from the running cost pool deducted from your salary. Any surplus in the running cost account at lease end is refunded to the employee.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="salary-packaging-difference" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Is a novated lease the same as salary packaging?</AccordionTrigger>
                <AccordionContent className="text-warmgray">A novated lease is a <strong>type of salary packaging</strong>, but not all salary packaging involves a novated lease. Salary packaging (also called salary sacrifice) covers any arrangement where pre-tax salary is exchanged for benefits including extra superannuation, laptops, work-related expenses, or a car. A novated lease is the specific salary packaging structure used for vehicles.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="residual-balloon" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What is the residual value and do I have to pay it?</AccordionTrigger>
                <AccordionContent className="text-warmgray">The residual is the amount left at the end of the lease, set as a minimum percentage of the original cost by ATO Taxation Determination TD 93/142 &mdash; 28.13% on a five-year lease, 46.88% on a three-year one. On a $40,000 car over five years that is $11,252, paid from after-tax money to own the car outright, refinanced into a new lease, or covered by trading the car in. A lease can be written above the minimum, so read the residual off your quote.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="kilometres" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Is there a kilometre limit on a novated lease?</AccordionTrigger>
                <AccordionContent className="text-warmgray"><strong>No</strong>. Unlike an operating lease or car subscription, a novated lease has no kilometre cap. The running cost budget is set based on estimated annual kilometres (typically <strong>15,000 to 20,000 km</strong>), but exceeding the estimate does not incur penalties. Higher kilometres simply deplete the fuel and tyre budget faster, which is adjusted at the annual budget review.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="hecs" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Does a novated lease reduce my HECS-HELP repayment?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Not reliably, and it can raise it. Compulsory repayments are worked out on <strong>repayment income</strong> &mdash; taxable income plus your reportable fringe benefits amount. The lease cuts the first and adds to the second, and because the reported figure is grossed up it can more than replace the taxable income you removed. A full employee contribution takes the reported amount to nil; an FBT-exempt electric car still reports. The <Link href="/novated-lease-calculator/">novated lease calculator</Link> shows both figures and the repayment, and the <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link> has the bands.</AccordionContent>
              </AccordionItem>

            </Accordion>
          </section>

          <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>This page explains the mechanics of a novated lease and does not compute a result. FBT rates, the statutory formula, the electric car exemption and the plug-in hybrid cut-off are taken from the ATO pages listed below; the minimum residual values are from Taxation Determination TD 93/142. Every figure that depends on your salary, your car or the current year&apos;s thresholds lives on the <Link href="/novated-lease-calculator/">novated lease calculator</Link>, which carries its own sources and verification date. Lease finance charges are not modelled anywhere on this site &mdash; ask your provider for the amount financed and the total of the payments. Nothing here is financial or tax advice.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("novated-lease-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
        </article>
        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/novated-lease-calculator/" label="Novated Lease Calculator" /><SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" /><SidebarLink href="/fringe-benefits-tax/" label="FBT Guide" /><SidebarLink href="/hecs-help-calculator/" label="HECS-HELP Calculator" /><SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

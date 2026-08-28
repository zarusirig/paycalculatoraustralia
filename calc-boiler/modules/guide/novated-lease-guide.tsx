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
  { title: "Electric Car Discount", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits/fbt-on-cars-other-vehicles-parking-and-tolls/electric-cars-exemption", publisher: SOURCES.ato.name },
];

export default function NovatedLeaseGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Novated Lease Guide</span></li></ol></nav>
      <header className="mb-10 max-w-4xl"><h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Novated Lease Guide Australia</h1><p className="text-xl text-warmgray leading-relaxed mb-6">How novated leasing works, the tax benefits, ECM vs statutory method, and whether it makes sense for your salary. A plain-English guide for FY2025-26.</p><TrustBar className="!max-w-none" /></header>
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
            <p>Unlike a standard car loan, a novated lease bundles all vehicle expenses &mdash; including fuel, registration, insurance, tyres, and scheduled servicing &mdash; into a single fortnightly or monthly deduction. This bundling creates savings through fleet-rate purchasing, GST credits, and income tax reduction. For an employee earning <strong>$85,000</strong>, a novated lease on a <strong>$40,000</strong> vehicle typically saves between <strong>$3,000 and $6,000 per year</strong> compared to buying the same car with after-tax dollars. Use our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model the income tax impact of pre-tax deductions on your take-home pay.</p>

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
              <li><strong>Choose a vehicle</strong> &mdash; Select any new or used car (typically under 7 years old at lease end). Popular choices include sedans, SUVs, utes, and increasingly electric vehicles (EVs). The vehicle price must sit below the &quot;Car Limit&quot; of <strong>$69,674</strong> for FY2025-26 to claim full GST savings.</li>
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
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Tax Benefits of a Novated Lease?</h2>
            <p>A novated lease delivers <strong>three distinct tax advantages</strong>: income tax savings through pre-tax salary deductions, GST savings on the purchase price and running costs, and potential FBT exemption for eligible electric vehicles.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Pre-Tax vs Post-Tax Comparison</h3>
            <p>The table below compares the annual cost of a <strong>$40,000 car</strong> for an employee on an <strong>$85,000 salary</strong>, showing the difference between paying with after-tax dollars versus using a novated lease arrangement in FY2025-26.</p>

            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="p-3 text-left rounded-tl-lg">Item</th>
                    <th className="p-3 text-right">Without Novated Lease</th>
                    <th className="p-3 text-right rounded-tr-lg">With Novated Lease</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">Gross salary</td>
                    <td className="p-3 text-right">$85,000</td>
                    <td className="p-3 text-right">$85,000</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">Pre-tax lease deduction</td>
                    <td className="p-3 text-right">$0</td>
                    <td className="p-3 text-right">$12,000</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">Taxable income</td>
                    <td className="p-3 text-right">$85,000</td>
                    <td className="p-3 text-right">$73,000</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">Income tax payable</td>
                    <td className="p-3 text-right">$16,288</td>
                    <td className="p-3 text-right">$12,688</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">Medicare levy (2%)</td>
                    <td className="p-3 text-right">$1,700</td>
                    <td className="p-3 text-right">$1,460</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">Car costs (after tax)</td>
                    <td className="p-3 text-right">$12,000</td>
                    <td className="p-3 text-right">$0</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">Post-tax employee contribution</td>
                    <td className="p-3 text-right">$0</td>
                    <td className="p-3 text-right">$3,600</td>
                  </tr>
                  <tr className="bg-eucalyptus-light/40 font-bold">
                    <td className="p-3 text-navy rounded-bl-lg">After-tax cash remaining</td>
                    <td className="p-3 text-right text-navy">$55,012</td>
                    <td className="p-3 text-right text-eucalyptus-dark rounded-br-lg">$58,852</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>The novated lease saves <strong>$3,840 per year</strong> in this scenario. The saving increases for higher income earners. An employee on <strong>$135,000</strong> leasing the same car saves approximately <strong>$5,400 per year</strong> because the marginal tax rate jumps from <strong>30% to 37%</strong> above $135,000. The <Link href="/income-tax-calculator/">Income Tax Calculator</Link> shows how income tax brackets affect your net position at any salary.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>GST Savings</h3>
            <p>The leasing company is registered for GST, which means it claims back the <strong>10% GST</strong> on the vehicle purchase price and all running costs. On a $40,000 car (GST-inclusive), this saves <strong>$3,636</strong> on the purchase price alone. Running cost GST savings on fuel, servicing, and tyres add another <strong>$400&ndash;$700 per year</strong> depending on kilometres driven.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does the Medicare Levy Surcharge Interact?</h3>
            <p>The &quot;Medicare Levy Surcharge&quot; (MLS) applies to singles earning above <strong>$93,000</strong> and families above <strong>$186,000</strong> who do not hold private hospital cover. A novated lease reduces taxable income but increases reportable fringe benefits. The MLS calculation uses &quot;income for MLS purposes,&quot; which adds taxable income plus reportable fringe benefits. Employees near the MLS threshold gain no MLS reduction from a novated lease because the reportable fringe benefit replaces the taxable income reduction. Private hospital cover remains the only way to avoid the MLS surcharge of <strong>1%, 1.25%, or 1.5%</strong> depending on the income tier.</p>
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
                    <td className="p-3">ATO-mandated residual (e.g. 28.13% for 4-year lease)</td>
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
                    <td className="p-3 font-medium text-navy">Interest rate (typical)</td>
                    <td className="p-3">6.5% &ndash; 8.5% p.a.</td>
                    <td className="p-3">5.5% &ndash; 9.0% p.a.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-navy rounded-bl-lg">Best for</td>
                    <td className="p-3">Employees on $45,000+ with supportive employer</td>
                    <td className="p-3 rounded-br-lg">Self-employed or employer does not offer packaging</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>The break-even point depends on the employee&apos;s marginal tax rate. Employees in the <strong>30% bracket</strong> ($45,001&ndash;$135,000) save enough through pre-tax deductions to offset the FBT component. Employees in the <strong>37% bracket</strong> ($135,001&ndash;$190,000) and the <strong>45% bracket</strong> (above $190,000) receive the largest benefit per dollar of lease cost. Check your current income tax bracket using our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>.</p>
            <p>A car loan outperforms a novated lease in only two scenarios: when the employee earns below <strong>$45,000</strong> (16% marginal rate delivers insufficient tax savings to offset FBT) and when the employee secures a heavily discounted interest rate below <strong>4%</strong> through a credit union or employer subsidy. In all other cases, the combination of income tax savings, Medicare levy reduction, and GST credits makes the novated lease the lower-cost option over a 3-to-5-year term.</p>
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
                  <li>&bull; Base value excludes dealer delivery, stamp duty, and registration</li>
                  <li>&bull; FBT taxable value = base value &times; 20% &times; days available / 365</li>
                  <li>&bull; No logbook required</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-sandstone-dark/20 shadow-sm border-t-4 border-t-eucalyptus-dark">
                <h3 className="font-semibold text-navy mb-2">ECM (Employee Contribution Method)</h3>
                <p className="text-sm text-warmgray mb-3">Your post-tax contributions reduce the FBT value. High-kilometre drivers or those making post-tax contributions benefit most from this method.</p>
                <ul className="text-sm text-warmgray space-y-1">
                  <li>&bull; Employee contributes from after-tax pay to reduce FBT value</li>
                  <li>&bull; Contribution must be made during the FBT year (1 April &ndash; 31 March)</li>
                  <li>&bull; FBT taxable value = statutory value &minus; employee contribution</li>
                  <li>&bull; If contribution &ge; statutory value, FBT liability = $0</li>
                </ul>
              </div>
            </div>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Choosing the Right Method</h3>
            <p>Most novated lease providers default to the ECM because it allows the employee to make post-tax contributions that eliminate or significantly reduce FBT. The post-tax contribution target equals the statutory FBT value: for a $40,000 vehicle, that is $40,000 &times; 20% = <strong>$8,000 per year</strong>. The employee pays approximately <strong>$154 per week</strong> from after-tax pay to zero out the FBT liability. The remaining lease and running costs are paid from pre-tax salary, delivering the full income tax benefit.</p>
            <p>The operating cost method is a separate FBT calculation method that uses actual costs and a logbook to determine the business-use percentage. Employers rarely offer this for novated leases because of the record-keeping burden. For a detailed explanation of FBT calculation methods, see our <Link href="/fringe-benefits-tax/">Fringe Benefits Tax Guide</Link>.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>FBT Calculation Example for a $40,000 Vehicle</h3>
            <p>The FBT year runs from <strong>1 April to 31 March</strong>, not aligned with the financial year. For a $40,000 vehicle available for the full 365 days, the FBT calculation under the statutory method proceeds as follows:</p>
            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="p-3 text-left rounded-tl-lg">Step</th>
                    <th className="p-3 text-left">Calculation</th>
                    <th className="p-3 text-right rounded-tr-lg">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">1. Base value (ex-GST)</td>
                    <td className="p-3">$40,000 &divide; 1.1</td>
                    <td className="p-3 text-right">$36,364</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">2. Statutory FBT value</td>
                    <td className="p-3">$36,364 &times; 20%</td>
                    <td className="p-3 text-right">$7,273</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">3. Less: ECM contribution</td>
                    <td className="p-3">Employee pays from after-tax income</td>
                    <td className="p-3 text-right">&minus;$7,273</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">4. Taxable value of benefit</td>
                    <td className="p-3">$7,273 &minus; $7,273</td>
                    <td className="p-3 text-right font-bold text-eucalyptus-dark">$0</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-navy rounded-bl-lg">5. FBT payable by employer</td>
                    <td className="p-3">$0 &times; 2.0802 &times; 47%</td>
                    <td className="p-3 text-right font-bold text-eucalyptus-dark rounded-br-lg">$0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>The gross-up factor of <strong>2.0802</strong> (Type 1, where GST credits are claimed) converts the taxable value to a grossed-up amount before applying the FBT rate of <strong>47%</strong>. When the ECM contribution equals or exceeds the statutory value, the FBT liability is zero and the employer has no FBT cost to pass on.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 6 — Worked Example */}
          {/* ============================================================ */}
          <section id="worked-example">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: $85,000 Salary with $40,000 Car</h2>
            <p>An employee earning <strong>$85,000 gross salary</strong> leasing a <strong>$40,000 vehicle</strong> (drive-away, GST-inclusive) on a 4-year novated lease saves <strong>$3,840 per year</strong> compared to buying the same car with a personal car loan.</p>

            <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
              <div className="flex items-start gap-4">
                <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-navy mb-1">Novated Lease Breakdown &mdash; FY2025-26</h3>
                  <div className="text-sm text-warmgray space-y-2 mt-3">
                    <p><strong>Vehicle:</strong> $40,000 drive-away (GST-inclusive)</p>
                    <p><strong>Lease term:</strong> 4 years</p>
                    <p><strong>ATO residual value:</strong> 37.50% = $15,000</p>
                    <p><strong>Finance amount (after GST saving):</strong> $36,364 (ex-GST) &minus; $15,000 residual = $21,364 financed</p>
                    <p><strong>Annual lease payment:</strong> ~$7,200 (including interest at ~7.5%)</p>
                    <p><strong>Annual running costs budget:</strong> ~$4,800 (fuel $2,400, insurance $1,200, rego $400, servicing $500, tyres $300)</p>
                    <p><strong>Total annual package:</strong> $12,000</p>
                    <p><strong>Superannuation:</strong> Employer SG rate of 12% calculated on $85,000 base salary &mdash; not reduced by the lease deduction under most awards</p>
                  </div>
                </div>
              </div>
            </div>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Year-by-Year Tax Savings</h3>
            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="p-3 text-left rounded-tl-lg">Component</th>
                    <th className="p-3 text-right">Without Lease</th>
                    <th className="p-3 text-right">With Novated Lease</th>
                    <th className="p-3 text-right rounded-tr-lg">Annual Saving</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">Pre-tax deduction</td>
                    <td className="p-3 text-right">$0</td>
                    <td className="p-3 text-right">$8,400</td>
                    <td className="p-3 text-right">&mdash;</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">Post-tax contribution (ECM)</td>
                    <td className="p-3 text-right">$0</td>
                    <td className="p-3 text-right">$3,600</td>
                    <td className="p-3 text-right">&mdash;</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">Income tax saved (30% marginal)</td>
                    <td className="p-3 text-right">$0</td>
                    <td className="p-3 text-right">&mdash;</td>
                    <td className="p-3 text-right text-eucalyptus-dark font-bold">$2,520</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">Medicare levy saved (2%)</td>
                    <td className="p-3 text-right">$0</td>
                    <td className="p-3 text-right">&mdash;</td>
                    <td className="p-3 text-right text-eucalyptus-dark font-bold">$168</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">GST saved on purchase (amortised)</td>
                    <td className="p-3 text-right">$0</td>
                    <td className="p-3 text-right">&mdash;</td>
                    <td className="p-3 text-right text-eucalyptus-dark font-bold">$909</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">GST saved on running costs</td>
                    <td className="p-3 text-right">$0</td>
                    <td className="p-3 text-right">&mdash;</td>
                    <td className="p-3 text-right text-eucalyptus-dark font-bold">$436</td>
                  </tr>
                  <tr className="bg-eucalyptus-light/40 font-bold">
                    <td className="p-3 text-navy rounded-bl-lg" colSpan={2}>Total estimated annual saving</td>
                    <td className="p-3 text-right">&mdash;</td>
                    <td className="p-3 text-right text-eucalyptus-dark rounded-br-lg">$4,033</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Over a 4-year lease term, total savings reach approximately <strong>$16,132</strong>. The employee pays a residual of <strong>$15,000</strong> at lease end to own the car outright. Use the <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model different salary and lease payment combinations.</p>
            <p>The take-home pay impact on a fortnightly basis is a reduction of approximately <strong>$323 per fortnight</strong> from net pay ($461 total deduction minus $138 in tax savings per fortnight). Without the novated lease, the same employee buying the car outright and paying running costs separately spends <strong>$461 per fortnight from after-tax income</strong> &mdash; a net disadvantage of <strong>$138 per fortnight</strong> or <strong>$3,588 per year</strong>.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 7 — Who Benefits Most? */}
          {/* ============================================================ */}
          <section id="who-benefits-most">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Benefits Most from a Novated Lease?</h2>
            <p>Employees earning above <strong>$45,000 per year</strong> benefit most from a novated lease because their marginal tax rate of <strong>30% or higher</strong> delivers meaningful savings on every pre-tax dollar deducted.</p>

            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="p-3 text-left rounded-tl-lg">Salary Range</th>
                    <th className="p-3 text-center">Marginal Rate</th>
                    <th className="p-3 text-center">Estimated Annual Saving*</th>
                    <th className="p-3 text-left rounded-tr-lg">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">$18,201 &ndash; $45,000</td>
                    <td className="p-3 text-center">16%</td>
                    <td className="p-3 text-center">$1,200 &ndash; $1,800</td>
                    <td className="p-3">Marginal benefit &mdash; FBT costs may offset savings</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">$45,001 &ndash; $135,000</td>
                    <td className="p-3 text-center">30%</td>
                    <td className="p-3 text-center">$3,000 &ndash; $5,000</td>
                    <td className="p-3 text-eucalyptus-dark font-bold">Strong benefit</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">$135,001 &ndash; $190,000</td>
                    <td className="p-3 text-center">37%</td>
                    <td className="p-3 text-center">$5,000 &ndash; $7,500</td>
                    <td className="p-3 text-eucalyptus-dark font-bold">Excellent benefit</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-navy rounded-bl-lg">$190,001+</td>
                    <td className="p-3 text-center">45%</td>
                    <td className="p-3 text-center">$7,500 &ndash; $10,000</td>
                    <td className="p-3 text-eucalyptus-dark font-bold rounded-br-lg">Maximum benefit</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-warmgray mt-2">*Based on a $40,000 vehicle on a 4-year lease. Actual savings vary with running costs and lease interest rate.</p>
            </div>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Is Not Eligible for a Novated Lease?</h3>
            <p>A novated lease is less beneficial for employees earning under <strong>$45,000</strong>, those within 2 years of retirement (insufficient time to realise savings), and casual employees without a guaranteed salary. Self-employed workers and sole traders are ineligible because the arrangement requires an employer-employee relationship. Contractors on ABN-only arrangements cannot access novated leasing. Employees on fixed-term contracts shorter than the proposed lease term face additional risk, though most leasing providers offer portability and payout options to mitigate this.</p>
            <p>Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to compare your current after-tax pay with and without salary packaging. The <Link href="/contractor-vs-employee/">Contractor vs Employee Guide</Link> explains the employment classification requirements for accessing salary packaging benefits including novated leases.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 8 — End of Lease */}
          {/* ============================================================ */}
          <section id="end-of-lease">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Happens at the End of a Novated Lease?</h2>
            <p>At lease end, the employee has <strong>three options</strong>: pay the residual value to own the car outright, refinance the residual into a new novated lease on the same vehicle, or trade the car in and start a new lease on a different vehicle.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>ATO Residual Value Table</h3>
            <p>The ATO sets minimum residual values as a percentage of the vehicle&apos;s original cost (including GST). These are non-negotiable and apply to all novated leases.</p>
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
            <p>Longer lease terms result in lower residual payments but higher total interest costs. A 5-year lease has the lowest residual (<strong>28.13%</strong>) but accumulates more interest than a 3-year lease. Most employees choose a <strong>4 or 5-year term</strong> to balance lower repayments with reasonable total cost.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Happens If You Leave Your Job Mid-Lease?</h3>
            <p>The novation deed automatically unwinds when employment ends. The lease reverts to a standard finance lease between the employee and the leasing company. The employee has <strong>3 options</strong> at that point: transfer the lease to a new employer (if the new employer offers salary packaging), continue paying the lease personally from after-tax income, or pay out the remaining balance and residual in a lump sum. Most leasing companies offer a portability guarantee that allows seamless transfer to a new employer within <strong>60 to 90 days</strong>. No early termination fee applies when transferring to a new employer. Paying out early incurs a break cost equal to the remaining lease payments plus the residual, minus a discount for early settlement typically worth <strong>1&ndash;3 months of interest</strong>.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 9 — FY2025-26 Changes (EV Exemption) */}
          {/* ============================================================ */}
          <section id="fy2025-26-changes">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed in FY2025-26? The Electric Car Discount</h2>
            <p>The &quot;Electric Car Discount&quot; exempts eligible battery electric vehicles (BEVs) and plug-in hybrid electric vehicles (PHEVs) from fringe benefits tax, making EV novated leases <strong>$2,000&ndash;$5,000 per year cheaper</strong> than equivalent petrol or diesel vehicles.</p>

            <p>The exemption, introduced on 1 July 2022, applies to vehicles first held and used on or after that date. For FY2025-26, the key eligibility criteria are:</p>
            <ul>
              <li>The vehicle must be a <strong>zero or low emissions vehicle</strong> &mdash; battery electric (BEV), hydrogen fuel cell (FCEV), or plug-in hybrid (PHEV) first used before 1 April 2025</li>
              <li>The vehicle&apos;s value must sit below the &quot;Car Limit&quot; for fuel-efficient vehicles: <strong>$91,387 for FY2025-26</strong></li>
              <li>The car must not have been held or used before 1 July 2022</li>
              <li>The arrangement must be a legitimate novated lease or salary packaged vehicle</li>
            </ul>
            <p>PHEVs first used on or after 1 April 2025 are no longer eligible for the FBT exemption. Only BEVs and FCEVs retain the full exemption from that date onwards. This change reflects the Australian Government&apos;s tightening of the policy to focus on fully zero-emission vehicles.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>EV vs ICE Novated Lease Comparison</h3>
            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="p-3 text-left rounded-tl-lg">Factor</th>
                    <th className="p-3 text-left">EV (FBT-Exempt)</th>
                    <th className="p-3 text-left rounded-tr-lg">ICE Vehicle (FBT Applies)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">FBT liability</td>
                    <td className="p-3 text-eucalyptus-dark font-bold">$0</td>
                    <td className="p-3">$3,000 &ndash; $8,000/year (depending on car value)</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">Post-tax contribution needed</td>
                    <td className="p-3 text-eucalyptus-dark font-bold">$0</td>
                    <td className="p-3">~$8,000/year (to offset FBT via ECM)</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20">
                    <td className="p-3 font-medium text-navy">Fuel/charging cost</td>
                    <td className="p-3">$400 &ndash; $800/year (home charging)</td>
                    <td className="p-3">$2,000 &ndash; $3,500/year (petrol)</td>
                  </tr>
                  <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                    <td className="p-3 font-medium text-navy">Servicing cost</td>
                    <td className="p-3">$200 &ndash; $400/year (fewer moving parts)</td>
                    <td className="p-3">$500 &ndash; $900/year</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-navy rounded-bl-lg">Typical annual saving vs outright purchase</td>
                    <td className="p-3 text-eucalyptus-dark font-bold">$7,000 &ndash; $12,000</td>
                    <td className="p-3 rounded-br-lg">$3,000 &ndash; $6,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>The FBT exemption makes EV novated leases the most tax-efficient way to acquire a new car in Australia. Popular FBT-exempt models include the Tesla Model 3, BYD Atto 3, MG ZS EV, Hyundai Ioniq 5, and Kia EV6. For employees considering salary packaging alongside a novated lease, our <Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> explains how pre-tax arrangements interact with superannuation and other benefit types.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Long Will the EV FBT Exemption Last?</h3>
            <p>The Electric Car Discount has no legislated sunset date as of the 2025-26 financial year. The Treasury confirmed the exemption continues indefinitely for BEVs and FCEVs first held and used from 1 July 2022. The PHEV restriction (effective 1 April 2025) narrows eligibility but does not affect existing PHEV leases entered before that date. Employees entering a new EV novated lease in FY2025-26 lock in the FBT exemption for the full lease term &mdash; typically 3 to 5 years &mdash; even if legislation changes during the lease period. The exemption applies per vehicle, not per employee, so an employee can novate multiple FBT-exempt EVs sequentially.</p>
          </section>

          {/* ============================================================ */}
          {/* SECTION 10 — Common Mistakes */}
          {/* ============================================================ */}
          <section id="common-mistakes">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Common Mistakes with Novated Leases?</h2>
            <p>The most common novated lease mistake is overestimating savings by ignoring the post-tax employee contribution, which reduces the net benefit by <strong>$3,000&ndash;$8,000 per year</strong> for ICE vehicles.</p>

            <ol>
              <li><strong>Ignoring the post-tax contribution</strong> &mdash; Marketing materials highlight the pre-tax deduction but omit the ECM contribution. On a $40,000 car, the post-tax component is approximately <strong>$7,273 per year</strong>. The net tax saving after accounting for this contribution is <strong>$3,840</strong>, not the $12,000 gross deduction sometimes quoted.</li>
              <li><strong>Choosing too short a lease term</strong> &mdash; A 2-year lease has a <strong>56.25% residual</strong> ($22,500 on a $40,000 car), resulting in high fortnightly repayments and a large balloon payment at lease end. A 4 or 5-year term spreads the cost more effectively.</li>
              <li><strong>Underestimating running costs</strong> &mdash; Setting a low running cost budget to reduce the payroll deduction creates a shortfall that the employee must fund at lease end. Fuel, insurance, and tyre costs should be estimated realistically based on <strong>15,000&ndash;20,000 km</strong> of annual driving.</li>
              <li><strong>Leasing a car above the Car Limit</strong> &mdash; The &quot;Car Limit&quot; for FY2025-26 is <strong>$69,674</strong> for ICE vehicles. GST savings only apply up to this threshold. Purchasing a vehicle above the limit forfeits the GST credit on the amount exceeding the cap.</li>
              <li><strong>Not checking employer super calculation</strong> &mdash; Some employers calculate the superannuation guarantee on the post-sacrifice salary rather than the pre-sacrifice gross. This reduces super contributions by <strong>12% of the pre-tax deduction</strong>. Verify your employer&apos;s super calculation method before signing. The <Link href="/superannuation-guide/">Superannuation Guide</Link> explains how the SG rate interacts with salary packaging.</li>
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
            <p>Use these Australian tax calculators and guides to model the full impact of a novated lease on your take-home pay, superannuation, and overall tax position.</p>
            <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
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
                <p className="text-xs text-warmgray mt-1">Calculate your net pay after income tax, Medicare levy, and superannuation for FY2025-26.</p>
              </Link>
              <Link href="/superannuation-guide/" className="group p-4 rounded-lg border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Superannuation Guide</h3>
                <p className="text-xs text-warmgray mt-1">Check whether novated lease deductions affect your super guarantee contributions.</p>
              </Link>
              <Link href="/income-tax-calculator/" className="group p-4 rounded-lg border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Income Tax Calculator</h3>
                <p className="text-xs text-warmgray mt-1">See your income tax brackets and calculate tax payable on your assessable income.</p>
              </Link>
              <Link href="/salary-sacrifice-guide/" className="group p-4 rounded-lg border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all">
                <h3 className="font-semibold text-navy group-hover:text-eucalyptus-dark text-sm">Salary Sacrifice Guide</h3>
                <p className="text-xs text-warmgray mt-1">Learn how salary packaging works for super, cars, laptops, and other fringe benefits.</p>
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
                <AccordionContent className="text-warmgray">Yes &mdash; and they get extra benefits. Under the Electric Car Discount (introduced 2022), eligible EVs and PHEVs under the luxury car tax limit are <strong>FBT-exempt</strong>, making novated leasing for EVs significantly more valuable. BEVs and FCEVs retain the full exemption. PHEVs first used on or after 1 April 2025 are no longer eligible.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="super" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Does a novated lease reduce my super?</AccordionTrigger>
                <AccordionContent className="text-warmgray">In most cases, <strong>no</strong>. The superannuation guarantee of <strong>12% for FY2025-26</strong> is calculated on your base salary (ordinary time earnings) before salary packaging deductions. Some employment contracts calculate super on the reduced amount, so check your specific agreement. The SG rate applies to your pre-packaging gross salary under most enterprise agreements and awards.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="used-car" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Can I novate a used car?</AccordionTrigger>
                <AccordionContent className="text-warmgray"><strong>Yes</strong>, most leasing providers accept used vehicles that are under 7 years old at the end of the proposed lease term. The vehicle must have a clear title, current registration, and pass a mechanical inspection. Used car novated leases deliver smaller GST savings (no GST credit on private-sale used cars) but still provide income tax savings through pre-tax deductions.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="fbt-cost" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">How much FBT do I pay on a novated lease?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Under the ECM (Employee Contribution Method), you can reduce your FBT liability to <strong>$0</strong> by making post-tax contributions equal to the statutory FBT value. For a $40,000 car, the statutory value is $40,000 &times; 20% = <strong>$8,000 per year</strong>. If you contribute $8,000 from post-tax pay, your FBT liability is eliminated. FBT-exempt EVs require no post-tax contribution at all.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="minimum-salary" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What is the minimum salary for a novated lease?</AccordionTrigger>
                <AccordionContent className="text-warmgray">There is no legislated minimum salary, but most leasing providers require a gross income of at least <strong>$40,000&ndash;$45,000</strong> per year. Below the <strong>$45,000 threshold</strong>, the marginal tax rate is only 16%, so the pre-tax savings are modest and the post-tax employee contributions consume a large portion of take-home pay. The benefit becomes meaningful above $45,001 where the 30% marginal rate applies.</AccordionContent>
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
                <AccordionContent className="text-warmgray">The residual value is the ATO-mandated minimum amount remaining at lease end. For a 5-year lease, the residual is <strong>28.13%</strong> of the vehicle&apos;s original cost. On a $40,000 car, that equals <strong>$11,252</strong>. You pay this amount to own the car outright, refinance it into a new lease, or trade the car in and use its market value to cover the residual. The residual is not optional &mdash; it is a mandatory component of every novated lease.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="kilometres" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Is there a kilometre limit on a novated lease?</AccordionTrigger>
                <AccordionContent className="text-warmgray"><strong>No</strong>. Unlike an operating lease or car subscription, a novated lease has no kilometre cap. The running cost budget is set based on estimated annual kilometres (typically <strong>15,000 to 20,000 km</strong>), but exceeding the estimate does not incur penalties. Higher kilometres simply deplete the fuel and tyre budget faster, which is adjusted at the annual budget review.</AccordionContent>
              </AccordionItem>

              <AccordionItem value="hecs" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Does a novated lease reduce my HECS-HELP repayment?</AccordionTrigger>
                <AccordionContent className="text-warmgray"><strong>No</strong>. HECS-HELP repayment thresholds are based on &quot;Repayment Income&quot; (RI), which includes taxable income plus reportable fringe benefits and net investment losses. A novated lease reduces taxable income but adds a reportable fringe benefit amount, so your Repayment Income remains similar. The repayment threshold for FY2025-26 starts at <strong>$69,528</strong>. See our <Link href="/hecs-help-calculator/">HECS-HELP Guide</Link> for the full repayment rate table.</AccordionContent>
              </AccordionItem>

            </Accordion>
          </section>

          <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>Information sourced from ATO novated leasing and FBT guidance. Tax savings examples use FY2025-26 marginal rates. The income tax brackets for FY2025-26 are: 0% up to $18,200, 16% from $18,201 to $45,000, 30% from $45,001 to $135,000, 37% from $135,001 to $190,000, and 45% above $190,000. Medicare levy is 2% of taxable income. Superannuation guarantee rate is 12%. All figures are estimates &mdash; actual savings depend on the vehicle, lease term, interest rate, and individual tax circumstances.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("novated-lease-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
        </article>
        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/salary-sacrifice-guide/" label="Salary Sacrifice Guide" /><SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" /><SidebarLink href="/fringe-benefits-tax/" label="FBT Guide" /><SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

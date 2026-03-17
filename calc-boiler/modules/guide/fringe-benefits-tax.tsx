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
const SOURCES_LIST: SourceLink[] = [{ title: "Fringe benefits tax", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax", publisher: SOURCES.ato.name }, { title: "FBT rates and thresholds", url: "https://www.ato.gov.au/tax-rates-and-codes/fringe-benefits-tax-rates-and-thresholds", publisher: SOURCES.ato.name }, { title: "Types of fringe benefits", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax/types-of-fringe-benefits", publisher: SOURCES.ato.name }];

export default function FringeBenefitsTaxPage() {
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Fringe Benefits Tax</span></li></ol></nav>
      <header className="mb-10 max-w-4xl"><h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Fringe Benefits Tax (FBT) Guide Australia FY2025-26</h1><p className="text-xl text-warmgray leading-relaxed mb-6">What FBT is, how the Australian tax system calculates fringe benefits, which benefits are exempt, current FBT rates and thresholds, and how reportable fringe benefits affect your take-home pay and tax return.</p><TrustBar className="!max-w-none" /></header>
      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          {/* ===== SECTION 1 ===== */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is Fringe Benefits Tax (FBT)?</h2>
            <p>Fringe Benefits Tax is a <strong>47% tax paid by employers</strong> on the taxable value of non-cash benefits provided to current, former, or future employees in connection with their employment.</p>
            <p>FBT operates as a separate tax system from income tax. The employer &mdash; not the employee &mdash; lodges the FBT return and pays the liability directly to the ATO. The FBT year runs from <strong>1 April to 31 March</strong>, which differs from the standard income tax year of 1 July to 30 June. Employers lodge FBT returns and remit payment by <strong>21 May</strong> each year (or 25 June if lodged through a registered tax agent).</p>
            <p>A &quot;fringe benefit&quot; is any non-salary benefit provided to an employee. Common examples include company cars, private health insurance premiums paid by the employer, gym memberships, and discounted loans. Even benefits provided to an employee&apos;s associate &mdash; such as a spouse or child &mdash; attract FBT if the benefit arises from the employment relationship. Employers who provide fringe benefits totalling more than <strong>$2,000 in taxable value</strong> in a single FBT year must register for FBT with the ATO. To understand how fringe benefits interact with your overall salary, use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> for a complete after-tax breakdown.</p>
          </section>

          {/* ===== SECTION 2 ===== */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is FBT Calculated?</h2>
            <p>FBT is calculated by &quot;grossing up&quot; the taxable value of a fringe benefit to its pre-tax equivalent, then applying the <strong>47% FBT rate</strong> to that grossed-up amount.</p>
            <p>Grossing up converts the benefit&apos;s value into the gross salary an employee would need to earn to purchase the same benefit after tax. The ATO uses two grossing-up methods depending on whether the employer claims GST credits.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Type 1: Benefits Where the Employer Claims a GST Credit</h3>
            <p>Type 1 grossing up applies when the employer is entitled to a GST credit on the benefit. The Type 1 gross-up rate for the FBT year ending 31 March 2026 is <strong>2.0802</strong>. The formula is:</p>
            <p><strong>FBT payable = Taxable value x 2.0802 x 47%</strong></p>
            <p>A benefit with a taxable value of $1,000 results in a grossed-up value of $2,080.20 and FBT of <strong>$977.69</strong>.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Type 2: Benefits Where No GST Credit Is Available</h3>
            <p>Type 2 grossing up applies when the employer cannot claim a GST credit (for example, GST-free supplies such as residential accommodation). The Type 2 gross-up rate is <strong>1.8868</strong>. The formula is:</p>
            <p><strong>FBT payable = Taxable value x 1.8868 x 47%</strong></p>
            <p>The same $1,000 benefit under Type 2 produces a grossed-up value of $1,886.80 and FBT of <strong>$886.80</strong>. Employers calculating the true cost of employee benefits, including FBT, can model figures using our <Link href="/employer-cost-calculator/">Employer Cost Calculator</Link>.</p>
          </section>

          {/* ===== SECTION 3 ===== */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Common Types of Fringe Benefits?</h2>
            <p>The ATO classifies fringe benefits into <strong>13 categories</strong>, each with specific valuation rules, exemptions, and reporting requirements.</p>
            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse border border-sandstone-dark/30">
                <thead><tr className="bg-sandstone">
                  <th className="border border-sandstone-dark/30 px-4 py-3 text-left text-navy font-semibold">Benefit Type</th>
                  <th className="border border-sandstone-dark/30 px-4 py-3 text-left text-navy font-semibold">Description</th>
                  <th className="border border-sandstone-dark/30 px-4 py-3 text-left text-navy font-semibold">Valuation Method</th>
                </tr></thead>
                <tbody>
                  <tr><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Car fringe benefits</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Company car or novated lease for private use</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Statutory formula (20% of base value) or operating cost method</td></tr>
                  <tr className="bg-sandstone/40"><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Expense payment benefits</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Employer pays or reimburses personal expenses (e.g., school fees, utility bills)</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Amount paid or reimbursed</td></tr>
                  <tr><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Housing benefits</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Employer-provided accommodation at below-market rent</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Market value minus employee contribution</td></tr>
                  <tr className="bg-sandstone/40"><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">LAFHA</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Living-away-from-home allowance for temporary relocations</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Amount exceeding reasonable ATO-published thresholds</td></tr>
                  <tr><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Loan fringe benefits</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Below-market-rate loans from employer to employee</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Difference between RBA benchmark rate and rate charged</td></tr>
                  <tr className="bg-sandstone/40"><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Meal entertainment</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Meals, food, and drink at work-related events or client entertainment</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Actual expenditure or 50/50 split method</td></tr>
                  <tr><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Property fringe benefits</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Goods provided free or at a discount (e.g., retail staff discounts)</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Market value minus employee contribution</td></tr>
                  <tr className="bg-sandstone/40"><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Residual fringe benefits</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Any benefit not covered by another category (e.g., gym memberships, airline lounge)</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Market value minus employee contribution</td></tr>
                </tbody>
              </table>
            </div>
            <p>Car fringe benefits are the most common category, accounting for the majority of all FBT revenue collected. For a detailed breakdown of how novated leasing reduces the taxable value of car benefits, see our <Link href="/novated-lease-guide/">Novated Lease Guide</Link>.</p>
          </section>

          {/* ===== SECTION 4 ===== */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the FBT Rates and Thresholds for FY2025-26?</h2>
            <p>The FBT rate is <strong>47%</strong> for the FBT year ending 31 March 2026, equal to the top marginal income tax rate of 45% plus the 2% Medicare levy.</p>
            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse border border-sandstone-dark/30">
                <thead><tr className="bg-sandstone">
                  <th className="border border-sandstone-dark/30 px-4 py-3 text-left text-navy font-semibold">Item</th>
                  <th className="border border-sandstone-dark/30 px-4 py-3 text-left text-navy font-semibold">Value (FBT Year Ending 31 March 2026)</th>
                </tr></thead>
                <tbody>
                  <tr><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">FBT rate</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray"><strong>47%</strong></td></tr>
                  <tr className="bg-sandstone/40"><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Type 1 gross-up rate</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray"><strong>2.0802</strong></td></tr>
                  <tr><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Type 2 gross-up rate</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray"><strong>1.8868</strong></td></tr>
                  <tr className="bg-sandstone/40"><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Car parking threshold</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray"><strong>$10.40</strong> per day</td></tr>
                  <tr><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Minor benefit exemption</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Under <strong>$300</strong> per benefit (infrequent &amp; irregular)</td></tr>
                  <tr className="bg-sandstone/40"><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Statutory car rate</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray"><strong>20%</strong> of base value (flat rate)</td></tr>
                  <tr><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Benchmark interest rate</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray"><strong>7.77%</strong> (FBT year ending 31 March 2026)</td></tr>
                  <tr className="bg-sandstone/40"><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">Reportable fringe benefits threshold</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray"><strong>$2,000</strong> grossed-up taxable value</td></tr>
                </tbody>
              </table>
            </div>
            <p>The FBT rate has remained at 47% since 1 April 2017. The benchmark interest rate and car parking threshold are indexed annually. For a full picture of Australian income tax brackets and how your marginal rate compares to the FBT rate, refer to our <Link href="/income-tax-calculator/">Income Tax Calculator</Link>.</p>
          </section>

          {/* ===== SECTION 5 ===== */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Pays FBT &mdash; Employer or Employee?</h2>
            <p>The <strong>employer</strong> pays FBT directly to the ATO &mdash; it is never deducted from an employee&apos;s pay.</p>
            <p>FBT is a separate employer tax obligation, distinct from PAYG withholding, superannuation guarantee contributions, and payroll tax. The employer calculates the total taxable value of all fringe benefits provided during the FBT year (1 April to 31 March), grosses up the amount, applies the 47% rate, and remits the liability. The employer can claim an income tax deduction for the FBT paid.</p>
            <p>Some employers pass the cost of FBT to employees through &quot;employee contribution&quot; arrangements. An employee can make after-tax contributions toward the cost of the benefit, which reduces the taxable value and therefore the FBT liability. This is common with novated leases and salary sacrifice arrangements. Employees considering salary packaging should review our <Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> to understand how employee contributions reduce FBT exposure.</p>
          </section>

          {/* ===== SECTION 6 ===== */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What FBT Exemptions and Concessions Apply?</h2>
            <p>Certain fringe benefits are <strong>fully exempt</strong> from FBT, and others receive concessional treatment that reduces the taxable value to zero or a lower amount.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Fully Exempt Benefits</h3>
            <ul>
              <li><strong>Portable electronic devices</strong> primarily for work &mdash; one laptop, one tablet, and one phone per FBT year</li>
              <li><strong>Minor benefits</strong> under $300 that are infrequent and irregular (e.g., a Christmas ham, occasional taxi fares)</li>
              <li><strong>Eligible electric vehicles</strong> under the Electric Car Discount &mdash; battery electric vehicles and plug-in hybrids first held and used on or after 1 July 2022, with a value at first retail sale below the luxury car tax limit for fuel-efficient vehicles (<strong>$91,387</strong> for FY2025-26)</li>
              <li><strong>Work-related items</strong> including protective clothing, tools of trade, briefcases, and software</li>
              <li><strong>Employer contributions to complying super funds</strong> (these are taxed under the superannuation regime, not FBT)</li>
              <li><strong>Certain relocation expenses</strong> for employees moving to a new work location</li>
            </ul>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Capped Exemptions for NFP Employers</h3>
            <p>Not-for-profit organisations, public hospitals, and charities receive capped FBT exemptions. Public benevolent institutions (PBIs) and health promotion charities have a grossed-up cap of <strong>$30,000</strong> per employee per FBT year. Public and not-for-profit hospitals receive a cap of <strong>$17,000</strong>. Benefits within the cap are exempt; benefits exceeding the cap attract FBT at the standard 47% rate.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Reduction Through Employee Contributions</h3>
            <p>Employees can make after-tax (post-tax) contributions toward the cost of a fringe benefit. Each dollar contributed reduces the taxable value of the benefit by one dollar. This is the most common strategy for reducing FBT on car fringe benefits and novated leases.</p>
          </section>

          {/* ===== SECTION 7 ===== */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is FBT Calculated on a Company Car? (Worked Example)</h2>
            <p>A company car with a base value of <strong>$50,000</strong> generates an annual FBT liability of <strong>$9,777</strong> under the statutory formula method when the employer claims GST credits.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Step-by-Step: Statutory Formula Method</h3>
            <ol>
              <li><strong>Determine the car&apos;s base value:</strong> $50,000 (GST-inclusive cost price minus any dealer delivery charges already exempt)</li>
              <li><strong>Apply the statutory fraction:</strong> $50,000 x 20% = <strong>$10,000</strong> (this is the taxable value of the car fringe benefit)</li>
              <li><strong>Subtract any employee contributions:</strong> Assume $0 post-tax contributions, so taxable value remains $10,000</li>
              <li><strong>Gross up the taxable value:</strong> $10,000 x 2.0802 (Type 1) = <strong>$20,802</strong></li>
              <li><strong>Apply the FBT rate:</strong> $20,802 x 47% = <strong>$9,776.94</strong></li>
            </ol>
            <p>The employer pays <strong>$9,777 in FBT</strong> to the ATO for this car. The $20,802 grossed-up amount also appears on the employee&apos;s income statement as reportable fringe benefits. If the employee made post-tax contributions of $3,000 toward the car, the taxable value drops to $7,000, reducing FBT to <strong>$6,844</strong> &mdash; a saving of $2,933.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Operating Cost Method Alternative</h3>
            <p>The operating cost method calculates FBT based on actual running costs (fuel, insurance, registration, servicing, depreciation) multiplied by the private-use percentage. This method requires a valid 12-week logbook. Employees who drive more than 15,000 km per year for business purposes typically pay less FBT under the operating cost method than the statutory formula. Employers who want to compare the total cost of providing a company car, including superannuation and PAYG, should use our <Link href="/employer-cost-calculator/">Employer Cost Calculator</Link>.</p>
          </section>

          {/* ===== SECTION 8 ===== */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does FBT Affect Your Tax Return?</h2>
            <p>FBT does not create an additional tax liability for employees, but the <strong>Reportable Fringe Benefits Amount (RFBA)</strong> on your income statement affects income-tested thresholds for government benefits, surcharges, and obligations.</p>
            <p>When fringe benefits exceed the <strong>$2,000 grossed-up threshold</strong>, the employer must report the grossed-up taxable value as RFBA on your income statement (formerly payment summary). The ATO uses your &quot;adjusted taxable income&quot; &mdash; which includes taxable income plus RFBA, reportable super contributions, and certain other items &mdash; to determine:</p>
            <ul>
              <li><strong>Medicare Levy Surcharge (MLS)</strong> liability &mdash; RFBA pushes your adjusted taxable income above the <strong>$93,000</strong> singles threshold, triggering a 1%, 1.25%, or 1.5% surcharge if you lack private hospital cover</li>
              <li><strong>HECS-HELP repayment</strong> obligations &mdash; RFBA counts toward the <strong>$54,435</strong> compulsory repayment threshold for FY2025-26</li>
              <li><strong>Centrelink income test</strong> &mdash; RFBA is included in the income test for Family Tax Benefit, child care subsidy, and other income-tested payments</li>
              <li><strong>Division 293 tax</strong> &mdash; high-income earners with combined income and low-tax super contributions above <strong>$250,000</strong> pay an additional 15% tax on concessional super contributions</li>
            </ul>
            <p>The RFBA itself is <strong>not taxed again</strong> in the employee&apos;s hands &mdash; it is used solely as a measure of adjusted taxable income. For details on how HECS repayments interact with your adjusted taxable income, use our <Link href="/hecs-help-calculator/">HECS-HELP Calculator</Link>.</p>
          </section>

          {/* ===== CONTEXT BORDER ===== */}

          {/* ===== SECTION 9 ===== */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for FBT in FY2025-26?</h2>
            <p>The FBT rate remains at <strong>47%</strong> for the FBT year ending 31 March 2026, with updated benchmark interest rates, car parking thresholds, and continued EV exemptions.</p>
            <ul>
              <li><strong>Benchmark interest rate increased to 7.77%</strong> for the FBT year ending 31 March 2026, up from 7.74% in the prior year &mdash; this increases FBT on employer-provided loans</li>
              <li><strong>Electric Car Discount continues</strong> &mdash; eligible zero and low-emissions vehicles remain FBT-exempt, with the luxury car tax threshold for fuel-efficient vehicles at <strong>$91,387</strong></li>
              <li><strong>Car parking threshold updated to $10.40</strong> per day &mdash; employer-provided parking below this threshold does not attract FBT</li>
              <li><strong>Stage 3 tax cuts do not affect FBT</strong> &mdash; the FBT rate remains pegged at the top marginal rate (45%) plus Medicare levy (2%), unchanged since 2017</li>
              <li><strong>Gross-up rates unchanged</strong> &mdash; Type 1 remains at 2.0802 and Type 2 at 1.8868 because the FBT rate has not changed</li>
            </ul>
            <p>The ATO publishes updated FBT rates and thresholds each year in February. Employers should review fringe benefit arrangements annually to capture any threshold changes and ensure compliance with reporting obligations.</p>
          </section>

          {/* ===== SECTION 10 ===== */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Key FBT Dates and Deadlines?</h2>
            <p>The FBT year runs from <strong>1 April to 31 March</strong>, and the key annual lodgement date is <strong>21 May</strong> (or 25 June via a registered tax agent).</p>
            <div className="not-prose overflow-x-auto my-6">
              <table className="w-full text-sm border-collapse border border-sandstone-dark/30">
                <thead><tr className="bg-sandstone">
                  <th className="border border-sandstone-dark/30 px-4 py-3 text-left text-navy font-semibold">Date</th>
                  <th className="border border-sandstone-dark/30 px-4 py-3 text-left text-navy font-semibold">Event</th>
                </tr></thead>
                <tbody>
                  <tr><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">1 April</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">FBT year begins</td></tr>
                  <tr className="bg-sandstone/40"><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">31 March</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">FBT year ends</td></tr>
                  <tr><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">21 April (quarterly)</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">FBT instalment activity statement due (quarterly payers)</td></tr>
                  <tr className="bg-sandstone/40"><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">21 May</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">FBT return lodgement and payment due (self-lodgers)</td></tr>
                  <tr><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">25 June</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">FBT return lodgement due (via registered tax agent)</td></tr>
                  <tr className="bg-sandstone/40"><td className="border border-sandstone-dark/30 px-4 py-2 font-medium text-navy">14 July</td><td className="border border-sandstone-dark/30 px-4 py-2 text-warmgray">Employers issue income statements (payment summaries) showing RFBA</td></tr>
                </tbody>
              </table>
            </div>
            <p>Late lodgement or payment of FBT attracts a failure-to-lodge penalty starting at <strong>$313 per 28-day period</strong> (1 penalty unit), up to a maximum of 5 penalty units. Interest on late payment is calculated at the general interest charge rate published by the ATO. For a full timeline of Australian tax obligations across the financial year, see our <Link href="/tax-calendar/">Tax Calendar</Link>.</p>
          </section>

          {/* ===== SECTION 11 ===== */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
            <p>These Australian tax calculators and guides provide additional detail on topics connected to fringe benefits tax, salary packaging, and employer obligations.</p>
            <ul>
              <li><Link href="/novated-lease-guide/">Novated Lease Guide</Link> &mdash; how novated leasing works, ECM vs statutory method, and when a novated lease saves you tax</li>
              <li><Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> &mdash; salary packaging strategies for super contributions, cars, and other benefits</li>
              <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> &mdash; model the tax savings from salary sacrificing into super or other benefits</li>
              <li><Link href="/employer-cost-calculator/">Employer Cost Calculator</Link> &mdash; calculate the total cost of employing someone, including superannuation, payroll tax, WorkCover, and FBT</li>
              <li><Link href="/superannuation-guide/">Superannuation Guide</Link> &mdash; understand how the 12% SG rate for FY2025-26 interacts with salary sacrifice and fringe benefits</li>
              <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> &mdash; see how Australian income tax brackets and the Medicare levy affect your take-home pay</li>
            </ul>
          </section>

          {/* ===== SECTION 12: FAQs ===== */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="not-prose mt-6 space-y-3">
              <AccordionItem value="who-pays" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Do employees pay FBT?</AccordionTrigger>
                <AccordionContent className="text-warmgray">No. FBT is an employer obligation. The employer calculates, lodges, and pays FBT directly to the ATO. However, the reportable fringe benefits amount (RFBA) appears on the employee&apos;s income statement and affects income-tested obligations including HECS-HELP repayments, Medicare levy surcharge, and Centrelink payments.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="year" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">When is the FBT year?</AccordionTrigger>
                <AccordionContent className="text-warmgray">The FBT year runs from <strong>1 April to 31 March</strong> &mdash; different from the income tax year (1 July to 30 June). Employers lodge FBT returns and pay FBT by <strong>21 May</strong> each year, or by 25 June if lodging through a registered tax agent.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="rate" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What is the current FBT rate?</AccordionTrigger>
                <AccordionContent className="text-warmgray">The FBT rate is <strong>47%</strong> for the FBT year ending 31 March 2026. This equals the top marginal income tax rate of 45% plus the 2% Medicare levy. The rate has remained at 47% since 1 April 2017.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="ev-exempt" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Are electric vehicles exempt from FBT?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. Under the Electric Car Discount, eligible battery electric vehicles and plug-in hybrid electric vehicles first held and used on or after 1 July 2022 are FBT-exempt, provided the car&apos;s value at first retail sale is below the luxury car tax limit for fuel-efficient vehicles (<strong>$91,387</strong> for FY2025-26). This exemption makes novated leasing for EVs significantly more cost-effective.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="grossing-up" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What does &quot;grossing up&quot; mean for FBT?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Grossing up converts the taxable value of a fringe benefit to its pre-tax salary equivalent. This reflects the gross income an employee would need to earn to purchase the same benefit after paying income tax. The Type 1 gross-up rate is <strong>2.0802</strong> (when the employer claims GST credits) and the Type 2 rate is <strong>1.8868</strong> (when no GST credit is claimed).</AccordionContent>
              </AccordionItem>
              <AccordionItem value="rfba" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Does RFBA increase the amount of tax I pay?</AccordionTrigger>
                <AccordionContent className="text-warmgray">No. Reportable fringe benefits amounts are <strong>not taxed again</strong> in the employee&apos;s hands. RFBA is used solely to calculate adjusted taxable income for income-tested purposes such as the Medicare levy surcharge, HECS-HELP repayment thresholds, Division 293 tax, and Centrelink payments. It does not increase your assessable income or income tax payable.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="minor-benefit" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What qualifies as a minor benefit exemption?</AccordionTrigger>
                <AccordionContent className="text-warmgray">A minor benefit is one with a notional taxable value of less than <strong>$300</strong> that is provided infrequently and irregularly, and is not a regular or expected part of the employee&apos;s remuneration. Common examples include Christmas gifts, occasional taxi fares home after overtime, and infrequent team meals. Benefits that are provided regularly or as part of a salary packaging arrangement do not qualify, regardless of the value.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="employee-contribution" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Can employees reduce FBT by making contributions?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. Employees can make after-tax (post-tax) contributions toward the cost of a fringe benefit. Each dollar contributed reduces the taxable value by one dollar, which reduces the grossed-up amount and therefore the employer&apos;s FBT liability. This strategy is commonly used with novated leases and salary-packaged cars under the Employee Contribution Method (ECM).</AccordionContent>
              </AccordionItem>
              <AccordionItem value="nfp-cap" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Do not-for-profit employees get FBT concessions?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. Public benevolent institutions (PBIs) and health promotion charities receive a grossed-up FBT exemption cap of <strong>$30,000</strong> per employee per FBT year. Public and not-for-profit hospitals have a cap of <strong>$17,000</strong>. Benefits within these caps are FBT-exempt. Benefits exceeding the cap attract FBT at the standard 47% rate.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="car-methods" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">What is the difference between the statutory formula and operating cost method?</AccordionTrigger>
                <AccordionContent className="text-warmgray">The <strong>statutory formula method</strong> values the car benefit at 20% of the car&apos;s base value, regardless of how many kilometres are driven. The <strong>operating cost method</strong> calculates FBT based on actual running costs (fuel, insurance, registration, servicing, depreciation) multiplied by the private-use percentage determined from a valid 12-week logbook. Employees who drive more than 15,000 business kilometres per year typically pay less FBT under the operating cost method.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="deductible" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">Is FBT tax-deductible for the employer?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Yes. The FBT amount paid is a <strong>tax-deductible expense</strong> for the employer. The cost of providing the fringe benefit itself (e.g., car lease payments, gym membership fees) is also deductible. This means the effective after-tax cost of FBT to the employer is the FBT amount multiplied by (1 minus the company tax rate), which is 25% or 30% depending on the entity type.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="register" className="border rounded-lg px-4 bg-white">
                <AccordionTrigger className="text-left font-semibold text-navy">When does an employer need to register for FBT?</AccordionTrigger>
                <AccordionContent className="text-warmgray">Employers must register for FBT with the ATO when the total taxable value of fringe benefits provided to all employees exceeds <strong>$2,000</strong> in a single FBT year. Registration is completed through the ATO&apos;s Business Portal or by contacting the ATO directly. Once registered, the employer must lodge an annual FBT return even in years where no FBT is payable.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <div className="mt-12 not-prose"><MethodologyDisclosure title="How this guide works"><p>FBT rates, thresholds, and exemption rules sourced from ATO FBT guidance for the FBT year ending 31 March 2026 (aligning with FY2025-26). Gross-up rates, benchmark interest rates, and car parking thresholds reflect the latest ATO-published values. Worked examples use the statutory formula method with Type 1 grossing up.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("fringe-benefits-tax"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
        </article>
        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/novated-lease-guide/" label="Novated Lease Guide" /><SidebarLink href="/salary-sacrifice-guide/" label="Salary Sacrifice Guide" /><SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" /><SidebarLink href="/employer-cost-calculator/" label="Employer Cost Calculator" /><SidebarLink href="/superannuation-guide/" label="Superannuation Guide" /><SidebarLink href="/tax-calendar/" label="Tax Calendar" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

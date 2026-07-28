"use client";

import Link from "next/link";
import { ChevronRight, FileText, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, MEDICARE_LEVY, SUPER_GUARANTEE, formatPercent } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Payslips", url: "https://www.fairwork.gov.au/pay-and-wages/paying-wages/pay-slips", publisher: SOURCES.fwo.name },
  { title: "Record-keeping requirements", url: "https://www.ato.gov.au/businesses-and-organisations/preparing-lodging-and-paying/record-keeping-for-business/detailed-business-record-keeping-requirements/running-your-business-records/employment-and-payroll-records", publisher: SOURCES.ato.name },
];

export default function UnderstandingYourPayslipPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Understanding Your Payslip</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Understanding Your Payslip
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Your payslip is a legally binding document. Learn how to decode Gross Pay, Net Pay, PAYG, Super limits, and spot accidental underpayments from your employer.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="what-is-a-payslip">
              <h2>What Is a Payslip?</h2>
              <p>
                A payslip is a written record your employer provides every pay cycle showing exactly how your salary was calculated, taxed, and distributed. Australian employers issue payslips weekly, fortnightly, or monthly depending on the pay cycle stated in your employment contract.
              </p>
              <p>
                The Fair Work Act 2009 makes payslips a legal requirement for every employee in Australia, including full-time, part-time, and casual workers. Employers who fail to issue a payslip face penalties of up to <strong>$19,800 per breach</strong> for individuals and <strong>$99,000 per breach</strong> for companies. Understanding your payslip protects you from underpayment, incorrect tax withholding, and missing superannuation contributions. Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to generate a benchmark payslip you can compare against your real one.
              </p>
              <p>
                Payslips can be delivered electronically (email, payroll portal, PDF) or as a printed document. Both formats carry the same legal weight. Modern payroll systems including Xero, MYOB, and Employment Hero generate compliant payslips automatically.
              </p>
            </section>

            <section id="what-must-a-payslip-include">
              <h2>What Must a Payslip Include?</h2>
              <p>
                A compliant Australian payslip must contain <strong>14 mandatory items</strong> under Fair Work Regulation 3.46. Omitting any of these items makes the payslip non-compliant and exposes the employer to Fair Work penalties.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="px-4 py-3 text-left font-semibold">Category</th>
                      <th className="px-4 py-3 text-left font-semibold">Required Item</th>
                      <th className="px-4 py-3 text-left font-semibold">Example</th>
                    </tr>
                  </thead>
                  <tbody className="text-navy divide-y divide-gray-100">
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Identity</td><td className="px-4 py-2">Employer&apos;s name</td><td className="px-4 py-2">ABC Pty Ltd</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Identity</td><td className="px-4 py-2">Employer&apos;s ABN</td><td className="px-4 py-2">12 345 678 901</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Identity</td><td className="px-4 py-2">Employee&apos;s name</td><td className="px-4 py-2">Jane Smith</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Timing</td><td className="px-4 py-2">Pay period start and end dates</td><td className="px-4 py-2">1 Jul &ndash; 14 Jul 2025</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Timing</td><td className="px-4 py-2">Date of payment</td><td className="px-4 py-2">16 Jul 2025</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Pay</td><td className="px-4 py-2">Gross amount paid</td><td className="px-4 py-2">$4,230.77</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Pay</td><td className="px-4 py-2">Net amount paid</td><td className="px-4 py-2">$3,241.15</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Pay</td><td className="px-4 py-2">Loadings, allowances, bonuses, incentive payments, penalty rates (each itemised separately)</td><td className="px-4 py-2">Overtime: $320.00</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Hours</td><td className="px-4 py-2">Ordinary hours worked</td><td className="px-4 py-2">76 hours</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Hours</td><td className="px-4 py-2">Hourly rate (if applicable)</td><td className="px-4 py-2">$42.31/hr</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Tax</td><td className="px-4 py-2">PAYG withholding amount</td><td className="px-4 py-2">$989.62</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Super</td><td className="px-4 py-2">Super contribution amount</td><td className="px-4 py-2">$507.69</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Super</td><td className="px-4 py-2">Name of super fund</td><td className="px-4 py-2">AustralianSuper</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Deductions</td><td className="px-4 py-2">Any deductions (with name and amount)</td><td className="px-4 py-2">Union fees: $25.00</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-6 text-sm">
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-navy mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-eucalyptus" /> Identity Details
                  </h4>
                  <ul className="space-y-1 text-navy">
                    <li>Employer's name and ABN</li>
                    <li>Employee's name</li>
                  </ul>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-navy mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-eucalyptus" /> Timing Details
                  </h4>
                  <ul className="space-y-1 text-navy">
                    <li>Pay period dates (e.g. 1 July to 14 July)</li>
                    <li>Date the payment was actively made</li>
                  </ul>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-navy mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-eucalyptus" /> Money & Tax
                  </h4>
                  <ul className="space-y-1 text-navy">
                    <li>Gross pay and Net pay amounts</li>
                    <li>Specific tax deductions (PAYG)</li>
                  </ul>
                </div>
                <div className="bg-white border rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-navy mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-eucalyptus" /> Superannuation
                  </h4>
                  <ul className="space-y-1 text-navy">
                    <li>Amount of super contributions made</li>
                    <li>Name of the fund receiving the super</li>
                  </ul>
                </div>
              </div>

              <p>
                Employers must deliver the payslip within <strong>1 working day</strong> of paying the employee. The payslip delivery deadline applies regardless of whether the employee is paid weekly, fortnightly, or monthly. Check our <Link href="/award-rates/">Award Rates</Link> guide to confirm your hourly rate matches the correct Modern Award classification on your payslip. If you need to create a compliant payslip containing all 14 mandatory items, our free <Link href="/payslip-generator/">payslip generator</Link> builds one in your browser.
              </p>
            </section>

            <section id="how-to-read-your-payslip">
              <h2>How Do You Read Your Payslip Line by Line?</h2>
              <p>
                A standard Australian payslip follows a top-to-bottom flow: identity, earnings, deductions, net pay, superannuation, and leave balances. Each line represents a distinct calculation step.
              </p>
              <p>
                The worked example below shows a fortnightly payslip for an employee earning <strong>$85,000 per year</strong> with no HECS-HELP debt and no salary sacrifice arrangements.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="px-4 py-3 text-left font-semibold">Payslip Line</th>
                      <th className="px-4 py-3 text-right font-semibold">Fortnightly Amount</th>
                      <th className="px-4 py-3 text-left font-semibold">What It Means</th>
                    </tr>
                  </thead>
                  <tbody className="text-navy divide-y divide-gray-100">
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Base Salary (76 hrs)</td><td className="px-4 py-2 text-right">$3,269.23</td><td className="px-4 py-2">$85,000 &divide; 26 fortnights</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Gross Pay</td><td className="px-4 py-2 text-right font-semibold">$3,269.23</td><td className="px-4 py-2">Total earnings before deductions</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">PAYG Withholding</td><td className="px-4 py-2 text-right text-red-600">&minus;$669.23</td><td className="px-4 py-2">Income tax + Medicare Levy combined</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Net Pay</td><td className="px-4 py-2 text-right font-bold text-eucalyptus-dark">$2,600.00</td><td className="px-4 py-2">Cash deposited into your bank account</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Super (SG {formatPercent(SUPER_GUARANTEE.rate, 0)})</td><td className="px-4 py-2 text-right">$392.31</td><td className="px-4 py-2">Employer-paid, not deducted from your pay</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Annual Leave Balance</td><td className="px-4 py-2 text-right">96.45 hrs</td><td className="px-4 py-2">Accumulated paid leave available</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Personal Leave Balance</td><td className="px-4 py-2 text-right">52.20 hrs</td><td className="px-4 py-2">Sick/carer&apos;s leave available</td></tr>
                  </tbody>
                </table>
              </div>

              <p>
                The PAYG withholding line bundles income tax and the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare Levy into a single figure. Your employer uses the ATO&apos;s withholding schedule to calculate this amount. Verify the calculation matches the official <Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> for your income bracket and tax file number declaration settings.
              </p>
            </section>

            <section id="gross-vs-net">
              <h2>What Is the Difference Between Gross Pay and Net Pay?</h2>
              <p>
                Gross pay is the total amount your employer owes you before any deductions. Net pay (take-home pay) is the amount deposited into your bank account after PAYG tax, Medicare Levy, and other deductions are subtracted.
              </p>
              <p>
                The formula is: <code>Net Pay = Gross Pay &minus; PAYG Tax &minus; Medicare Levy &minus; Other Deductions</code>. On an <strong>$85,000</strong> gross salary in FY2025-26, net pay is approximately <strong>$67,533 per year</strong> (or <strong>$2,597 per fortnight</strong>) for a resident with no HECS debt. The gap between gross and net widens at higher income tax brackets. An employee earning <strong>$150,000 gross</strong> takes home approximately <strong>$106,692 net</strong> &mdash; a deduction rate of <strong>28.9%</strong>.
              </p>
              <ul>
                <li><strong>Gross Pay:</strong> The total, pre-tax amount earned during the pay period. A &ldquo;$100k salary&rdquo; refers to the gross annual figure. Gross pay includes base salary, overtime, penalty rates, allowances, and commissions.</li>
                <li><strong>Net Pay:</strong> The after-tax cash deposited into your bank account. Net pay is calculated as <code>Gross Pay &minus; Tax &minus; Deductions</code>. Use our <Link href="/gross-pay-calculator/">Gross Pay Calculator</Link> to convert between gross and net amounts at any salary level.</li>
              </ul>
              <p>
                Superannuation does not reduce your net pay. The SG contribution of {formatPercent(SUPER_GUARANTEE.rate, 0)} is paid by your employer on top of your gross salary, unless your contract specifies a &ldquo;total remuneration package&rdquo; that includes super.
              </p>
            </section>

            <section id="common-deductions">
              <h2>What Are the Common Payslip Deductions?</h2>
              <p>
                Payslip deductions fall into 2 categories: <strong>mandatory deductions</strong> (required by law) and <strong>voluntary deductions</strong> (authorised by the employee). Mandatory deductions include PAYG withholding and, where applicable, HECS-HELP repayments and child support. If your payslip shows a deduction code called STSL, that is the extra tax withheld for your study loan &mdash; see our guide to <Link href="/stsl-on-payslip/">STSL on your payslip</Link> for how the amount is worked out.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="px-4 py-3 text-left font-semibold">Deduction</th>
                      <th className="px-4 py-3 text-left font-semibold">Type</th>
                      <th className="px-4 py-3 text-left font-semibold">How It Works</th>
                      <th className="px-4 py-3 text-left font-semibold">FY2025-26 Rate / Threshold</th>
                    </tr>
                  </thead>
                  <tbody className="text-navy divide-y divide-gray-100">
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">PAYG Withholding</td><td className="px-4 py-2">Mandatory</td><td className="px-4 py-2">Income tax + Medicare Levy withheld each pay cycle</td><td className="px-4 py-2">16%&ndash;45% marginal + 2% ML</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">HECS-HELP Repayment</td><td className="px-4 py-2">Mandatory (if applicable)</td><td className="px-4 py-2">Withheld when income exceeds repayment threshold</td><td className="px-4 py-2">Threshold: <strong>$69,528</strong></td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Child Support</td><td className="px-4 py-2">Mandatory (if applicable)</td><td className="px-4 py-2">Employer deducts per Services Australia notice</td><td className="px-4 py-2">Varies by assessment</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Salary Sacrifice (Super)</td><td className="px-4 py-2">Voluntary</td><td className="px-4 py-2">Pre-tax contribution to super fund</td><td className="px-4 py-2">Concessional cap: <strong>$30,000</strong>/yr</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Salary Sacrifice (Other)</td><td className="px-4 py-2">Voluntary</td><td className="px-4 py-2">Novated lease, laptop, additional insurance</td><td className="px-4 py-2">Subject to FBT rules</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Union Fees</td><td className="px-4 py-2">Voluntary</td><td className="px-4 py-2">Deducted per written authorisation</td><td className="px-4 py-2">Typically $10&ndash;$30/fortnight</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Private Health Insurance</td><td className="px-4 py-2">Voluntary</td><td className="px-4 py-2">Employer may deduct premiums at employee request</td><td className="px-4 py-2">Varies by policy</td></tr>
                  </tbody>
                </table>
              </div>

              <p>
                Voluntary deductions require your written authorisation. An employer cannot deduct union fees, charity donations, or salary sacrifice amounts without a signed agreement. Review the <Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> to understand how pre-tax deductions reduce your taxable income while boosting your retirement savings.
              </p>
            </section>

            <section id="payg">
              <h2>How Does PAYG Withholding Appear on Your Payslip?</h2>
              <p>
                &ldquo;PAYG Withholding&rdquo; is the single largest deduction on every Australian payslip. Your employer withholds income tax plus the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare Levy each pay cycle and remits the combined amount directly to the ATO.
              </p>
              <p>
                PAYG stands for &ldquo;Pay As You Go.&rdquo; The system spreads your annual tax liability across 26 fortnights (or 52 weeks, or 12 months) so you do not face a lump-sum tax bill at the end of the financial year. On an <strong>$85,000</strong> salary, total annual PAYG withholding is approximately <strong>$17,467</strong>, comprising <strong>$15,767</strong> in income tax (after the &ldquo;Low Income Tax Offset&rdquo; of <strong>$700</strong>) and <strong>$1,700</strong> in Medicare Levy.
              </p>
              <p>
                If your employer withholds too much tax during the year, the ATO refunds the excess when you lodge your tax return in July or August. Conversely, under-withholding results in a tax bill. The ATO&apos;s withholding schedules determine the correct amount based on your gross earnings, residency status, tax-free threshold claim, and HECS-HELP status. Check the <Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> to verify your employer is withholding the correct amount.
              </p>
            </section>

            <section id="medicare">
              <h2>Where Is the Medicare Levy on Your Payslip?</h2>
              <p>
                The {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare Levy does not appear as a separate line on your payslip. It is bundled into the PAYG withholding amount alongside your income tax.
              </p>
              <p>
                Your employer calculates income tax and the Medicare Levy together, then withholds the combined total. On an <strong>$85,000</strong> salary, the Medicare Levy component is <strong>$1,700 per year</strong> (or <strong>$65.38 per fortnight</strong>). Employees earning below the low-income threshold of <strong>$27,222</strong> pay a reduced Medicare Levy or are fully exempt. The &ldquo;Medicare Levy Surcharge&rdquo; (MLS) of 1%&ndash;1.5% applies to individuals earning above <strong>$93,000</strong> who do not hold private hospital cover. To see exactly how much of your PAYG withholding goes towards Medicare, use our <Link href="/medicare-levy/">Medicare Levy Calculator</Link> which isolates the levy at any salary level.
              </p>
            </section>

            <section id="check-errors">
              <h2>How Do You Check Your Payslip for Errors?</h2>
              <p>
                Payslip errors affect <strong>1 in 6</strong> Australian workers according to Fair Work Ombudsman compliance data. Checking your payslip each pay cycle takes 5 minutes and protects against underpayment, incorrect tax withholding, and missing super contributions.
              </p>
              <p>
                Follow these 6 steps every time you receive a payslip:
              </p>
              <ol>
                <li><strong>Verify your hours:</strong> Multiply your ordinary hours by your hourly rate. The result must match the gross pay figure. For salaried employees on <strong>$85,000</strong>, the fortnightly gross is <strong>$3,269.23</strong> ($85,000 &divide; 26).</li>
                <li><strong>Check overtime and penalty rates:</strong> Overtime, Saturday, Sunday, and public holiday hours must each appear as separate line items with the correct loading. Standard overtime rates range from <strong>1.5x</strong> (first 2&ndash;3 hours) to <strong>2.0x</strong> (subsequent hours) depending on your award.</li>
                <li><strong>Confirm PAYG withholding:</strong> Compare the tax withheld against the ATO&apos;s online tax withheld calculator or our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>. A discrepancy of more than <strong>$5 per pay cycle</strong> warrants investigation.</li>
                <li><strong>Validate superannuation:</strong> The super amount must equal your ordinary time earnings multiplied by {formatPercent(SUPER_GUARANTEE.rate, 0)}. On <strong>$3,269.23</strong> fortnightly gross, super is <strong>$392.31</strong>.</li>
                <li><strong>Cross-check YTD totals:</strong> Add the current period&apos;s amounts to the previous payslip&apos;s YTD figures. The new YTD must equal the sum. A mismatch indicates a payroll processing error.</li>
                <li><strong>Verify leave balances:</strong> Full-time employees accrue <strong>4 weeks</strong> (152 hours) of annual leave per year, equal to <strong>2.923 hours per week</strong>. Check that your balance increases by this amount each pay period.</li>
              </ol>
              <p>
                If you find an error, raise it with your payroll department in writing. Employers must correct payslip errors and issue an amended payslip. Persistent underpayment can be reported to the Fair Work Ombudsman.
              </p>
            </section>

            <section id="ytd">
              <h2>What Is YTD on a Payslip?</h2>
              <p>
                YTD stands for &ldquo;Year-to-Date&rdquo; and shows your cumulative totals for gross pay, tax withheld, and super contributions since <strong>1 July</strong> (the start of the Australian financial year).
              </p>
              <p>
                YTD figures serve 3 critical purposes: verifying your income statement at tax time, detecting payroll errors mid-year, and confirming your employer has actually transferred superannuation to your fund. To check the YTD figure on your payslip or project it into an annual income, use our <Link href="/ytd-income-calculator/">YTD income calculator</Link>.
              </p>
              <ul>
                <li><strong>YTD Gross:</strong> Total gross earnings since 1 July. At 30 June, this figure must match the gross income on your &ldquo;Income Statement&rdquo; (formerly called the PAYG Payment Summary) in myGov.</li>
                <li><strong>YTD Tax:</strong> Total PAYG withholding (income tax + Medicare Levy) deducted so far. If this amount is significantly higher than expected based on your salary, you are likely over-withholding and due a refund. Review our <Link href="/tax-refund-guide/">Tax Refund Guide</Link> for details.</li>
                <li><strong>YTD Super:</strong> Total superannuation contributions your employer has made. Cross-reference this against your super fund&apos;s online portal to confirm the money actually arrived. Super theft &mdash; where an employer lists super on a payslip but never transfers it &mdash; affects over <strong>2.8 million</strong> Australian workers annually, costing an estimated <strong>$5.9 billion</strong> per year.</li>
              </ul>
              <h3>How to Use YTD to Estimate Your Tax Refund</h3>
              <p>
                Compare your YTD Tax figure against the annual tax liability for your salary level. On an <strong>$85,000</strong> gross salary, total annual tax plus Medicare is approximately <strong>$17,467</strong>. If your YTD Tax at 30 June exceeds this amount, the difference is your expected tax refund. Common causes of over-withholding include not claiming the tax-free threshold, incorrect HECS-HELP flag on your TFN declaration, and working multiple jobs with each employer withholding at the full marginal rate.
              </p>
            </section>

            <section id="super">
              <h2>How Does Superannuation Appear on Your Payslip?</h2>
              <p>
                The &ldquo;Superannuation Guarantee&rdquo; (SG) contribution of {formatPercent(SUPER_GUARANTEE.rate, 0)} appears as a separate line on your payslip showing the dollar amount and the name of your super fund. This amount is paid by your employer on top of your gross salary.
              </p>
              <p>
                The SG rate increased from <strong>11.5%</strong> to <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)}</strong> on 1 July 2025. On an <strong>$85,000</strong> salary, your employer contributes <strong>$10,200 per year</strong> (or <strong>$392.31 per fortnight</strong>) to your nominated super fund. The maximum super contribution base is <strong>$62,500 per quarter</strong> for FY2025-26, meaning earnings above <strong>$250,000 per year</strong> do not attract additional SG contributions. Read the <Link href="/superannuation-guide/">Superannuation Guide</Link> for a full breakdown of SG rates, contribution caps, and Division 293 tax.
              </p>
              <p className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4 text-navy text-sm italic">
                <strong>Crucial Check:</strong> Ensure your payslip clearly states the name of your chosen super fund and the dollar amount being contributed. It is alarmingly common for businesses to list super on a payslip but fail to actually transfer the cash to the fund (a practice known as Super Theft). If you suspect this, log into your Super fund's portal to verify the cash actually arrived.
              </p>
              <h3>When Must Employers Pay Super?</h3>
              <p>
                Since Payday Super commenced on 1 July 2026, employers must pay SG <strong>on every payday</strong> and the contribution must be <em>received</em> by your fund within <strong>7 business days</strong>. Late payment triggers the &ldquo;Superannuation Guarantee Charge&rdquo; (SGC) &mdash; the shortfall, notional earnings at the general interest charge rate compounded daily, and an administrative uplift of up to 60%. This means super should now appear on your payslip and reach your fund in step with your pay, not months later.
              </p>
            </section>

            <section id="payslip-vs-payment-summary">
              <h2>What Is the Difference Between a Payslip, Payment Summary, and Income Statement?</h2>
              <p>
                A payslip is a per-pay-cycle document. A &ldquo;Payment Summary&rdquo; (now replaced by the &ldquo;Income Statement&rdquo;) is an annual summary of your total earnings and tax withheld for the full financial year.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <table className="min-w-full text-sm border border-gray-200 rounded-lg">
                  <thead>
                    <tr className="bg-navy text-white">
                      <th className="px-4 py-3 text-left font-semibold">Document</th>
                      <th className="px-4 py-3 text-left font-semibold">Frequency</th>
                      <th className="px-4 py-3 text-left font-semibold">Issued By</th>
                      <th className="px-4 py-3 text-left font-semibold">Where to Find It</th>
                    </tr>
                  </thead>
                  <tbody className="text-navy divide-y divide-gray-100">
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Payslip</td><td className="px-4 py-2">Every pay cycle (weekly, fortnightly, or monthly)</td><td className="px-4 py-2">Employer</td><td className="px-4 py-2">Payroll portal, email, or printed</td></tr>
                    <tr className="bg-gray-50"><td className="px-4 py-2 font-medium">Payment Summary (PAYG Summary)</td><td className="px-4 py-2">Annual (discontinued from 2020)</td><td className="px-4 py-2">Employer</td><td className="px-4 py-2">No longer issued &mdash; replaced by Income Statement</td></tr>
                    <tr className="bg-white"><td className="px-4 py-2 font-medium">Income Statement</td><td className="px-4 py-2">Annual (marked &ldquo;Tax Ready&rdquo; by 14 July)</td><td className="px-4 py-2">ATO via employer STP reporting</td><td className="px-4 py-2">myGov &gt; ATO &gt; Income Statements</td></tr>
                  </tbody>
                </table>
              </div>

              <p>
                Since 2020, employers report payroll data to the ATO in real-time through &ldquo;Single Touch Payroll&rdquo; (STP). The ATO uses this data to pre-fill your Income Statement in myGov. Your YTD Gross and YTD Tax on your final payslip of the financial year must match the corresponding figures on your Income Statement. Discrepancies indicate a payroll reporting error that your employer must correct before you lodge your tax return.
              </p>
            </section>

            {/* --- CONTEXT BORDER --- */}

            <section id="fy2025-26-changes">
              <h2>What Changed for Payslips in FY2025-26?</h2>
              <p>
                Three changes in the 2025-26 financial year directly affect the numbers on your payslip: the SG rate increase, the Stage 3 income tax bracket adjustments (carried over from 1 July 2024), and the new HECS-HELP marginal repayment system.
              </p>
              <ul>
                <li><strong>SG rate increased to {formatPercent(SUPER_GUARANTEE.rate, 0)}:</strong> The super line on your payslip rises from 11.5% to 12% of ordinary time earnings from 1 July 2025. On an $85,000 salary, this adds <strong>$425 per year</strong> to your super.</li>
                <li><strong>Stage 3 tax cuts (ongoing):</strong> The 19% bracket reduced to <strong>16%</strong> and the 32.5% bracket reduced to <strong>30%</strong>, with the threshold extended from $120,000 to <strong>$135,000</strong>. PAYG withholding amounts on your payslip reflect these lower rates.</li>
                <li><strong>HECS-HELP marginal system:</strong> The repayment threshold increased to <strong>$69,528</strong> (from $69,528). Repayments now use a marginal model at <strong>15 cents per dollar</strong> over $69,528 instead of the previous percentage-of-total-income system. Employees with HECS debt see lower withholding amounts near the threshold.</li>
                <li><strong>Income Statement deadline:</strong> Employers must finalise STP data and mark Income Statements as &ldquo;Tax Ready&rdquo; by <strong>14 July 2026</strong> for the FY2025-26 year.</li>
              </ul>
              <p>
                Compare your payslip before and after 1 July 2025 to confirm these changes are reflected. Use our <Link href="/hecs-help-guide/">HECS-HELP Guide</Link> to calculate your exact repayment amount under the new marginal system.
              </p>
            </section>

            <section id="leave">
              <h2>Do Leave Balances Appear on Your Payslip?</h2>
              <p>
                Leave balances are not a mandatory payslip item under Fair Work Regulation 3.46, but they are considered best practice and appear on the majority of Australian payslips.
              </p>
              <p>
                Full-time employees accrue <strong>4 weeks</strong> (152 hours) of annual leave and <strong>10 days</strong> (76 hours) of personal/carer&apos;s leave per year under the National Employment Standards (NES). Part-time employees accrue leave on a pro-rata basis. If your employer does not print leave balances on your payslip, they must still provide them upon reasonable request. Most modern payroll software (Xero, MYOB, Employment Hero, KeyPay) includes accumulated leave balances automatically.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <p>
                These Australian tax calculator tools and guides help you verify and understand every line on your payslip:
              </p>
              <ul>
                <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> &mdash; Generate a full pay breakdown at any salary to cross-check your payslip deductions.</li>
                <li><Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> &mdash; Look up the exact weekly, fortnightly, or monthly tax withholding amount for your income bracket.</li>
                <li><Link href="/superannuation-guide/">Superannuation Guide</Link> &mdash; Understand SG rates, contribution caps, and how to verify your employer is paying super.</li>
                <li><Link href="/gross-pay-calculator/">Gross Pay Calculator</Link> &mdash; Convert between gross and net salary amounts for any pay frequency.</li>
                <li><Link href="/tax-refund-guide/">Tax Refund Guide</Link> &mdash; Estimate your refund by comparing YTD tax withheld against your actual tax liability.</li>
                <li><Link href="/salary-sacrifice-guide/">Salary Sacrifice Guide</Link> &mdash; Learn how pre-tax deductions on your payslip reduce taxable income and boost super.</li>
                <li><Link href="/payslip-generator/">Payslip Generator</Link> &mdash; Create a free, Fair Work-compliant payslip with PAYG, super, and YTD totals.</li>
                <li><Link href="/ytd-income-calculator/">YTD Income Calculator</Link> &mdash; Calculate year-to-date pay or annualise the YTD figure from your payslip.</li>
                <li><Link href="/stsl-on-payslip/">STSL on Your Payslip</Link> &mdash; What the STSL deduction code means and how the amount is calculated.</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="what-is-diff" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the difference between Gross and Net Pay?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Gross pay is your total earnings before any deductions. Net pay is the amount deposited into your bank account after PAYG withholding (income tax + Medicare Levy), HECS-HELP repayments, salary sacrifice, and any other authorised deductions are subtracted. On an $85,000 gross salary in FY2025-26, net pay is approximately <strong>$67,533</strong>.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="timing" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When must my employer give me my payslip?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Under the Fair Work Act 2009, your employer must provide a payslip within <strong>1 working day</strong> of paying your wage. The payslip can be delivered electronically (email, payroll portal) or as a printed document. Failure to comply carries penalties of up to <strong>$19,800</strong> per breach for individuals.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="hecs" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does my HECS-HELP repayment show separately on my payslip?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. If you ticked &ldquo;Yes&rdquo; to having a study/training loan on your TFN Declaration, your employer withholds extra tax to cover your <Link href="/hecs-help-guide/" className="text-eucalyptus-dark hover:underline">HECS-HELP</Link> repayment. This amount is bundled into the PAYG withholding line. The FY2025-26 repayment threshold is <strong>$69,528</strong>. Below this income level, no repayment is withheld.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="super-check" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I check if my employer is actually paying my super?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Log into your super fund&apos;s online portal (or use the ATO&apos;s myGov link) and check your transaction history. Your employer must pay SG within <strong>28 days</strong> after the end of each quarter. If contributions are missing, lodge a complaint with the ATO. Under the current {formatPercent(SUPER_GUARANTEE.rate, 0)} SG rate, missing a single quarter on a $100,000 salary means <strong>$3,000</strong> of lost retirement savings.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="overtime" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Should overtime appear separately on my payslip?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. The Fair Work Act requires employers to itemise each component of pay separately &mdash; including base hours, overtime hours, penalty rate loadings, and any allowances. If your overtime is combined with standard hours, ask payroll to itemise it. This is especially important for verifying <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">Award Rates</Link> compliance and correct penalty rate calculations.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="no-payslip" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What should I do if my employer does not give me a payslip?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Request your payslip in writing first. If your employer continues to withhold payslips, lodge a complaint with the Fair Work Ombudsman at <strong>fairwork.gov.au</strong> or call <strong>13 13 94</strong>. Failing to provide payslips is a breach of the Fair Work Act carrying penalties of up to <strong>$99,000 per breach</strong> for companies. You can also lodge an anonymous tip if you prefer not to be identified.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="electronic-vs-paper" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is an electronic payslip as valid as a paper payslip?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Electronic payslips (PDF, email, payroll portal access) carry the same legal weight as printed payslips under the Fair Work Act. The employer must ensure the electronic payslip is accessible to the employee and contains all 14 mandatory items. Most Australian employers now use electronic payslips through STP-compliant payroll software.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="casual-payslip" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do casual employees receive payslips?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Casual employees are entitled to a payslip within 1 working day of being paid, the same as full-time and part-time employees. A casual payslip must show the hourly rate including the <strong>25% casual loading</strong>, hours worked, PAYG withholding, and super contributions. Super is payable on casual earnings at the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG rate regardless of hours worked.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="keep-payslips" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How long should I keep my payslips?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The ATO recommends keeping payslips for a minimum of <strong>5 years</strong> from the date you lodge the relevant tax return. Employers must retain payroll records for <strong>7 years</strong>. Storing payslips digitally (scanned PDFs or payroll portal exports) satisfies record-keeping requirements and provides evidence in the event of a Fair Work dispute.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payslip-tax-return" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I need payslips to lodge my tax return?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. Since the introduction of Single Touch Payroll (STP), your employer reports your income and tax data directly to the ATO each pay cycle. The ATO pre-fills your Income Statement in myGov by <strong>14 July</strong> each year. Payslips serve as a backup verification tool rather than a primary lodgement document. Cross-check your final YTD payslip figures against your Income Statement before lodging.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="salary-sacrifice-payslip" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How does salary sacrifice appear on a payslip?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Salary sacrifice amounts appear as a pre-tax deduction between gross pay and taxable income. The payslip shows your gross salary, then subtracts the salary sacrifice amount, resulting in a lower taxable income. PAYG withholding is then calculated on this reduced figure. For example, sacrificing <strong>$500 per fortnight</strong> into super on an $85,000 salary reduces fortnightly taxable income from $3,269 to $2,769, lowering the PAYG withholding accordingly.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pay-rise-payslip" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I compare payslips before and after a pay rise?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Compare the gross pay, PAYG withholding, and net pay lines between your old and new payslips. A pay rise increases gross pay but also pushes you into a higher income tax bracket, so the net increase is smaller than the gross increase. Use the <Link href="/pay-rise-calculator/" className="text-eucalyptus-dark hover:underline">Pay Rise Calculator</Link> to model the exact before-and-after impact on your take-home pay, super contributions, and effective tax rate.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Payslip requirements on this page are based on Fair Work Ombudsman regulations under the Fair Work Act 2009. PAYG withholding and superannuation reporting obligations reference current ATO record-keeping requirements for employers.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("understanding-your-payslip"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Content</h3>
                  <div className="space-y-3">
                    <Link href="/take-home-pay-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Verify Your Payslip Math</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/payg-withholding-tables/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Official ATO PAYG Tables</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/award-rates/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Check Fair Work Awards</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-6 w-6 text-eucalyptus-light" />
                    <h3 className="text-lg font-bold">Compare Payslips</h3>
                  </div>
                  <p className="text-eucalyptus-light text-sm mb-4">Input your gross salary to generate a synthetic payslip. Compare it against your real employer's payslip to check you aren't being underpaid.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Generate Demo Payslip
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

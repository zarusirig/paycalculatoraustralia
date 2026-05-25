"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculatePayBreakdown,
  formatAUD,
  SUPER_GUARANTEE,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Employee or contractor", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/employee-or-independent-contractor", publisher: SOURCES.ato.name },
  { title: "Super for contractors", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/personal-super-contributions", publisher: SOURCES.ato.name },
  { title: "Registering for GST", url: "https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/gst/registering-for-gst", publisher: SOURCES.ato.name },
];

export default function ContractorVsEmployeeCalculatorPage() {
  const [grossRate, setGrossRate] = useState(100_000);
  const [contractorExpenses, setContractorExpenses] = useState(3_000);
  const [fundSuper, setFundSuper] = useState(true);

  // Employee calcs
  const employeeBreakdown = useMemo(() => calculatePayBreakdown({ grossSalary: grossRate }), [grossRate]);
  const employerSuper = Math.round(grossRate * SUPER_GUARANTEE.rate);

  // Contractor calcs
  const contractorSuper = fundSuper ? Math.round(grossRate * SUPER_GUARANTEE.rate) : 0;
  // Taxable income is Gross minus deductible expenses and personal super contributions
  const contractorTaxable = clamp(grossRate - contractorExpenses - contractorSuper, 0, 9999999);
  const contractorTaxBreakdown = useMemo(() => calculatePayBreakdown({ grossSalary: contractorTaxable }), [contractorTaxable]);

  // Contractor actual cash in hand to spend:
  const contractorNetCash = grossRate - contractorExpenses - contractorSuper - contractorTaxBreakdown.totalDeductions;

  const gapToMatch = Math.round((grossRate + employerSuper + contractorExpenses) * 1.15); // Rough rule of thumb

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Contractor vs Employee</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Contractor vs Employee Calculator — Compare Your Take-Home
          </h1>
          <p className="text-lg text-warmgray">
            See the real difference between working as an employee and as a contractor (ABN).
            Compare tax, super, and hidden costs side-by-side for FY{SITE_CONFIG.financialYear}.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-5xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-navy mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Side-by-Side Pay Comparison on the Same Rate</h2>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5 bg-sandstone p-5 rounded-xl border border-sandstone-dark/10">
                  <h3 className="font-medium text-navy">Your Equivalent Rate</h3>
                  <div>
                    <label htmlFor="grossRate" className="block text-sm font-medium text-gray-700 mb-1">Gross Annual Income / Package</label>
                    <div className="flex items-center mb-2">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="grossRate" min={0} max={1000000} step={1000} value={grossRate}
                        onChange={(e) => setGrossRate(clamp(Number(e.target.value || 0), 0, 1000000))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                  </div>

                  <h3 className="font-medium text-navy pt-3 border-t border-sandstone-dark/20">Contractor Assumptions</h3>
                  <div>
                    <label htmlFor="contractorExpenses" className="block text-sm font-medium text-gray-700 mb-1">Annual Business Expenses (Insurance, Admin, Tools)</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="contractorExpenses" min={0} max={100000} step={500} value={contractorExpenses}
                        onChange={(e) => setContractorExpenses(clamp(Number(e.target.value || 0), 0, 100000))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-start space-x-3 text-sm">
                      <input type="checkbox" checked={fundSuper} onChange={(e) => setFundSuper(e.target.checked)} className="mt-1 h-4 w-4 text-eucalyptus-dark border-gray-300 rounded focus:ring-eucalyptus/20" />
                      <span className="text-gray-700">Self-fund 12% Superannuation (Recommended for contractors)</span>
                    </label>
                  </div>
                </form>

                {/* Employee Card */}
                <Card className="border-sandstone-dark/20 shadow-none">
                  <div className="bg-sandstone p-4 border-b border-sandstone-dark/20 rounded-t-xl">
                    <h3 className="text-lg font-bold text-navy text-center">Employee</h3>
                  </div>
                  <CardContent className="p-5 text-sm space-y-3">
                    <Row label="Gross Salary" value={formatAUD(grossRate)} bold />
                    <Row label="Income Tax" value={`-${formatAUD(employeeBreakdown.netIncomeTax)}`} />
                    <Row label="Medicare Levy" value={`-${formatAUD(employeeBreakdown.medicareLevy)}`} />
                    <Row label="Business Expenses" value="$0" />
                    <div className="border-t border-sandstone-dark/20 pt-2" />
                    <Row label="Net Take-Home Cash" value={formatAUD(employeeBreakdown.takeHomePay)} bold green />
                    <div className="border-t border-sandstone-dark/20 pt-2" />
                    <Row label="Super (Paid by Employer)" value={`+${formatAUD(employerSuper)}`} highlight />
                    <Row label="Leave & Insurance" value="Provided" highlight />
                    <div className="bg-sandstone p-3 mt-4 rounded-lg">
                      <div className="text-xs text-warmgray-light mb-1">Total Package Value</div>
                      <div className="font-bold text-navy text-lg">{formatAUD(grossRate + employerSuper)}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contractor Card */}
                <Card className="border-eucalyptus/30 shadow-none bg-eucalyptus-light/30">
                  <div className="bg-eucalyptus-light p-4 border-b border-eucalyptus/30 rounded-t-xl">
                    <h3 className="text-lg font-bold text-navy text-center">Contractor (ABN)</h3>
                  </div>
                  <CardContent className="p-5 text-sm space-y-3">
                    <Row label="Gross Income (ex GST)" value={formatAUD(grossRate)} bold />
                    <Row label="Business Expenses" value={`-${formatAUD(contractorExpenses)}`} />
                    <Row label="Self-Funded Super" value={fundSuper ? `-${formatAUD(contractorSuper)}` : "$0"} />
                    <Row label="Taxable Income" value={formatAUD(contractorTaxable)} />
                    <div className="border-t border-eucalyptus/30 pt-2" />
                    <Row label="Income Tax" value={`-${formatAUD(contractorTaxBreakdown.netIncomeTax)}`} />
                    <Row label="Medicare Levy" value={`-${formatAUD(contractorTaxBreakdown.medicareLevy)}`} />
                    <div className="border-t border-eucalyptus/30 pt-2" />
                    <Row label="Net Take-Home Cash" value={formatAUD(contractorNetCash)} bold green />
                    <div className="border-t border-eucalyptus/30 pt-2" />
                    <Row label="Total Super" value={fundSuper ? formatAUD(contractorSuper) : "$0"} highlight={fundSuper} />
                    <Row label="Leave & Insurance" value="None" />
                    <div className="bg-eucalyptus-light p-3 mt-4 rounded-lg">
                      <div className="text-xs text-eucalyptus-dark mb-1">Value Equivalent required approx.</div>
                      <div className="font-bold text-navy text-lg">{formatAUD(gapToMatch)}</div>
                      <div className="text-[10px] text-eucalyptus-dark mt-1">To match the employee package above</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* H2: How Does Contractor vs Employee Pay Compare? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Contractor vs Employee Pay Compare?</h2>
            <p className="mb-4 text-warmgray">
              A contractor earning the same gross rate as an employee takes home <strong>less cash and no entitlements</strong> unless the contract rate is at least 30% higher. The Australian tax system treats employees and contractors differently across income tax withholding, superannuation, Medicare levy, and leave entitlements, creating a significant gap in total compensation value.
            </p>
            <p className="mb-4 text-warmgray">
              On a <strong>$100,000</strong> gross rate, an employee&apos;s total package value (including 12% superannuation guarantee paid by the employer) is <strong>$112,000</strong>. A contractor at the same $100,000 receives no employer super, no paid leave, and no workers compensation coverage. After self-funding super and covering business expenses, the contractor&apos;s disposable income drops below the employee&apos;s take-home pay. Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link> to see the exact income tax breakdown at any salary level.
            </p>
            <p className="mb-4 text-warmgray">
              This contractor vs employee calculator for FY2025-26 applies the current Australian tax brackets, the <strong>12% SG rate</strong>, and the <strong>2% Medicare levy</strong> to produce an accurate side-by-side comparison. The calculation factors in deductible business expenses, voluntary super contributions, and the true cost of lost entitlements like annual leave, personal leave, and employer-provided insurance.
            </p>
          </section>

          {/* H2: What Are the Key Differences? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Key Differences Between Contractors and Employees?</h2>
            <p className="mb-4 text-warmgray">
              Contractors and employees differ across <strong>7 core dimensions</strong>: tax collection, superannuation, Medicare, GST, leave, insurance, and expense deductions. The comparison table below summarises every difference that affects your take-home pay and total package value.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Factor</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Employee</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Contractor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Tax collection</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Employer withholds (PAYG)</td>
                    <td className="px-4 py-3 text-gray-700">You manage and lodge BAS</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Superannuation</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Employer pays 12% on top</td>
                    <td className="px-4 py-3 text-gray-700">You fund your own (optional)</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Medicare levy</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Deducted from pay automatically</td>
                    <td className="px-4 py-3 text-gray-700">You pay at tax time</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">GST</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Not applicable</td>
                    <td className="px-4 py-3 text-gray-700">Must charge 10% if registered ($75k+)</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Leave entitlements</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">4 weeks annual + 10 days personal</td>
                    <td className="px-4 py-3 text-gray-700 text-ochre font-medium">None</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Insurance</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Employer provides workers comp</td>
                    <td className="px-4 py-3 text-gray-700 text-ochre font-medium">You arrange your own liability cover</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Expense deductions</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Limited work-related deductions</td>
                    <td className="px-4 py-3 text-gray-700">All legitimate business costs deductible</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 font-medium text-navy">Tax return complexity</td>
                    <td className="px-4 py-3 text-eucalyptus-dark bg-eucalyptus-light/30">Simple individual return</td>
                    <td className="px-4 py-3 text-gray-700">Business schedule + quarterly BAS</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-warmgray text-sm">
              Employees benefit from the employer paying superannuation on top of salary, PAYG withholding that eliminates large tax bills, and access to the <Link href="/leave-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Leave Calculator</Link> entitlements under the Fair Work Act. Contractors trade these benefits for flexibility and greater deduction opportunities.
            </p>
          </section>

          {/* H2: Who Uses This Calculator? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Contractor vs Employee Calculator?</h2>
            <p className="mb-4 text-warmgray">
              This Australian tax calculator serves <strong>4 primary user groups</strong> evaluating whether to work as an employee or operate under an ABN as a sole trader or contractor.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Employees considering contracting</strong> &mdash; IT professionals, consultants, and tradespeople offered a contract rate who want to verify whether the higher gross compensates for lost entitlements.</li>
              <li><strong>Contractors evaluating employment offers</strong> &mdash; Existing ABN holders offered a permanent role who want to compare the net financial position after accounting for super, leave, and insurance.</li>
              <li><strong>Employers setting contract rates</strong> &mdash; Hiring managers and HR teams determining a fair contractor day rate that equals their standard employee salary package.</li>
              <li><strong>Accountants and bookkeepers</strong> &mdash; Tax professionals advising clients on the financial implications of changing their engagement structure for the 2025-26 financial year.</li>
            </ul>
          </section>

          {/* H2: Tax Obligations */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Tax Obligations for Contractors vs Employees?</h2>
            <p className="mb-4 text-warmgray">
              Employees and contractors pay the same income tax rates under Australia&apos;s progressive tax brackets, but the <strong>method of collection, timing, and deduction opportunities differ significantly</strong>.
            </p>

            <h3 className="text-lg font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Employee Tax Obligations</h3>
            <p className="mb-4 text-warmgray">
              Employers deduct income tax from each pay cycle through the &quot;PAYG Withholding&quot; system based on ATO tax tables. The employee&apos;s obligations are minimal: lodge a single annual tax return, claim limited work-related deductions, and pay the <strong>2% Medicare levy</strong> (deducted automatically). The employer handles super (12% SG rate), workers compensation insurance, and payroll tax. Use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Take-Home Pay Calculator</Link> to see your exact after-tax income as an employee.
            </p>

            <h3 className="text-lg font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Contractor Tax Obligations</h3>
            <p className="mb-4 text-warmgray">
              Contractors operating under an ABN manage their own taxation. Key obligations include:
            </p>
            <ol className="list-decimal pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>PAYG instalments</strong> &mdash; quarterly income tax pre-payments to the ATO, calculated on estimated annual income.</li>
              <li><strong>GST registration</strong> &mdash; mandatory once annual turnover exceeds <strong>$75,000</strong>. The contractor charges clients 10% GST and remits it quarterly via a &quot;Business Activity Statement&quot; (BAS).</li>
              <li><strong>Medicare levy</strong> &mdash; <strong>2%</strong> of taxable income, paid at tax time. The &quot;Medicare Levy Surcharge&quot; of 1%&ndash;1.5% applies to contractors earning above <strong>$93,000</strong> without private hospital cover.</li>
              <li><strong>Superannuation</strong> &mdash; voluntary personal contributions are tax-deductible up to the <strong>$30,000</strong> concessional cap for FY2025-26.</li>
              <li><strong>Annual tax return</strong> &mdash; includes a business schedule reporting all income, expenses, and deductions.</li>
            </ol>

            <h3 className="text-lg font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>FY2025-26 Income Tax Brackets for Both</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Taxable Income</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Marginal Rate</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Tax on This Bracket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">$0 &ndash; $18,200</td>
                    <td className="px-4 py-3 text-gray-700"><strong>0%</strong></td>
                    <td className="px-4 py-3 text-gray-700">$0</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">$18,201 &ndash; $45,000</td>
                    <td className="px-4 py-3 text-gray-700"><strong>16%</strong></td>
                    <td className="px-4 py-3 text-gray-700">$4,288</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">$45,001 &ndash; $135,000</td>
                    <td className="px-4 py-3 text-gray-700"><strong>30%</strong></td>
                    <td className="px-4 py-3 text-gray-700">$27,000</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">$135,001 &ndash; $190,000</td>
                    <td className="px-4 py-3 text-gray-700"><strong>37%</strong></td>
                    <td className="px-4 py-3 text-gray-700">$20,350</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">$190,001+</td>
                    <td className="px-4 py-3 text-gray-700"><strong>45%</strong></td>
                    <td className="px-4 py-3 text-gray-700">45c per $1 over $190,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-warmgray text-sm">
              Both employees and contractors apply these identical tax brackets. The difference is that contractors reduce their assessable income through business expense deductions before tax is calculated. See the full breakdown in our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Income Tax Calculator</Link>.
            </p>
          </section>

          {/* H2: Which Is Better Financially? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Is Better Financially: Contractor or Employee?</h2>
            <p className="mb-4 text-warmgray">
              Employment is financially better at the same gross rate. A contractor needs to earn approximately <strong>30&ndash;45% more</strong> than the equivalent employee salary to achieve the same total compensation value after accounting for super, leave, and insurance.
            </p>

            <h3 className="text-lg font-semibold text-navy mb-3 mt-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: $100,000 Gross Rate</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Line Item</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Employee</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Contractor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Gross Income</td>
                    <td className="px-4 py-3 text-right text-gray-700">$100,000</td>
                    <td className="px-4 py-3 text-right text-gray-700">$100,000</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Business Expenses</td>
                    <td className="px-4 py-3 text-right text-gray-700">$0</td>
                    <td className="px-4 py-3 text-right text-gray-700">-$3,000</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Self-Funded Super (12%)</td>
                    <td className="px-4 py-3 text-right text-gray-700">$0 (employer pays)</td>
                    <td className="px-4 py-3 text-right text-gray-700">-$12,000</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Taxable Income</td>
                    <td className="px-4 py-3 text-right text-gray-700">$100,000</td>
                    <td className="px-4 py-3 text-right text-gray-700">$85,000</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Income Tax</td>
                    <td className="px-4 py-3 text-right text-gray-700">-$22,788</td>
                    <td className="px-4 py-3 text-right text-gray-700">-$16,288</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Medicare Levy (2%)</td>
                    <td className="px-4 py-3 text-right text-gray-700">-$2,000</td>
                    <td className="px-4 py-3 text-right text-gray-700">-$1,700</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50 bg-eucalyptus-light/20">
                    <td className="px-4 py-3 text-navy font-bold">Net Take-Home Cash</td>
                    <td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">$75,212</td>
                    <td className="px-4 py-3 text-right font-bold text-eucalyptus-dark">$67,012</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Super Balance</td>
                    <td className="px-4 py-3 text-right text-gray-700">+$12,000 (employer)</td>
                    <td className="px-4 py-3 text-right text-gray-700">+$12,000 (self)</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Paid Leave Value</td>
                    <td className="px-4 py-3 text-right text-gray-700">+$11,400</td>
                    <td className="px-4 py-3 text-right text-gray-700">$0</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50 bg-sandstone">
                    <td className="px-4 py-3 text-navy font-bold">Total Package Value</td>
                    <td className="px-4 py-3 text-right font-bold text-navy">$98,612</td>
                    <td className="px-4 py-3 text-right font-bold text-navy">$79,012</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="bg-eucalyptus-light/30 border-l-4 border-eucalyptus p-4 mb-4">
              <p className="text-navy font-medium">
                At the same $100,000 gross rate, the employee&apos;s total package value is <strong>$19,600 higher</strong> than the contractor&apos;s. The contractor needs to charge approximately <strong>$138,000&ndash;$145,000</strong> (before GST) to match the employee&apos;s total package.
              </p>
            </div>
            <p className="text-warmgray">
              Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Superannuation Calculator</Link> to model the long-term retirement impact of self-funding versus employer-funded super contributions across different salary levels.
            </p>
          </section>

          {/* H2: The True Cost Gap */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Hidden Costs Do Contractors Face?</h2>
            <p className="mb-4 text-warmgray">
              Contractors bear <strong>6 additional costs</strong> that employees receive at no charge. These hidden costs reduce the contractor&apos;s effective hourly rate and total compensation value.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Superannuation (12% SG)</strong> &mdash; Employer pays this in addition to base salary. Self-funding costs <strong>$12,000</strong> on a $100,000 income.</li>
              <li><strong>Annual leave (4 weeks)</strong> &mdash; Approx 7.6% of your yearly working value, equivalent to <strong>$7,600</strong> on a $100,000 salary.</li>
              <li><strong>Personal/sick leave (10 days)</strong> &mdash; Approx 3.8% of your yearly working value, equivalent to <strong>$3,800</strong> on a $100,000 salary.</li>
              <li><strong>Workers compensation insurance</strong> &mdash; Costs <strong>$500&ndash;$3,000</strong> annually depending on industry and risk classification.</li>
              <li><strong>Professional indemnity / public liability</strong> &mdash; Premiums range from <strong>$400&ndash;$2,500</strong> per year for most professional services contractors.</li>
              <li><strong>Accounting and software</strong> &mdash; Bookkeeping, BAS lodgment, and accounting software cost <strong>$1,500&ndash;$4,000</strong> per year.</li>
            </ul>
            <div className="bg-eucalyptus-light/30 border-l-4 border-eucalyptus p-4">
              <p className="text-navy font-medium">
                To match a $100,000 employee package, a contractor should typically charge approximately <strong>$135,000 to $145,000</strong> (before GST) to offset the lack of super, leave, and insurance.
              </p>
            </div>
          </section>

          {/* H2: When Does Contracting Pay Off? */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When Does Contracting Pay Off?</h2>
            <p className="mb-4 text-warmgray">
              Contracting becomes financially advantageous when the contract rate exceeds the equivalent employee salary by <strong>at least 30%</strong>. Below that threshold, the value of lost entitlements typically outweighs the higher gross income.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border text-warmgray border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-eucalyptus-dark mb-3 flex items-center"><ChevronRight className="h-5 w-5 mr-1" /> Contracting is better when:</h3>
                <ul className="space-y-2 text-sm pl-2 border-l-2 border-eucalyptus-light">
                  <li>Your contract rate is <strong>30%+ higher</strong> than the equivalent employee salary.</li>
                  <li>You can claim significant tax deductions (home office, equipment, travel).</li>
                  <li>You value flexibility and independence over job security.</li>
                  <li>You have multiple clients or streams of income.</li>
                </ul>
              </div>
              <div className="bg-white border text-warmgray border-sandstone-dark/20 rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-eucalyptus-dark mb-3 flex items-center"><ChevronRight className="h-5 w-5 mr-1" /> Employment is better when:</h3>
                <ul className="space-y-2 text-sm pl-2 border-l-2 border-sandstone-dark/20">
                  <li>The gross pay rates are visually similar.</li>
                  <li>You value job security, sick leave, and paid holidays.</li>
                  <li>You don&apos;t want the administrative burden of BAS, tax, and insurance.</li>
                  <li>You need the protection of workers compensation.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* H2: Common Mistakes */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are Common Mistakes When Comparing Contractor and Employee Pay?</h2>
            <p className="mb-4 text-warmgray">
              The most common mistake is comparing gross rates directly without adjusting for the <strong>$25,000&ndash;$40,000 gap</strong> in hidden entitlements and costs. Five frequent errors distort the contractor vs employee calculation.
            </p>
            <ol className="list-decimal pl-6 space-y-3 text-warmgray mb-4">
              <li><strong>Ignoring superannuation</strong> &mdash; Employees receive 12% super on top of their salary. A contractor earning $100,000 who skips super misses <strong>$12,000</strong> per year in retirement savings, compounding to over <strong>$400,000</strong> across a 20-year career at average fund returns.</li>
              <li><strong>Forgetting leave entitlements</strong> &mdash; Four weeks of annual leave and 10 days of personal leave represent <strong>11.4%</strong> of an employee&apos;s salary value. Contractors who work every billable day to match income risk burnout without accounting for unpaid downtime.</li>
              <li><strong>Overlooking GST obligations</strong> &mdash; Contractors earning above $75,000 must register for GST and charge clients 10%. The GST collected is not income &mdash; it belongs to the ATO. Spending GST revenue as personal income creates a debt at BAS time.</li>
              <li><strong>Underestimating admin costs</strong> &mdash; BAS lodgment, bookkeeping, insurance premiums, and software subscriptions cost <strong>$3,000&ndash;$6,000</strong> annually. Many new contractors discover these costs only after their first BAS quarter.</li>
              <li><strong>Assuming &quot;sham contracting&quot; is risk-free</strong> &mdash; The ATO applies a multi-factor test to determine genuine contractor status. Employers face penalties of up to <strong>$16,500 per contravention</strong> under the Fair Work Act for incorrectly classifying employees as contractors.</li>
            </ol>
          </section>

          {/* H2: Related Calculators */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Australian Tax Calculators</h2>
            <p className="mb-4 text-warmgray">
              These calculators complement the contractor vs employee comparison by modelling specific components of your pay, tax, and superannuation.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Link href="/take-home-pay-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-navy text-sm">Take-Home Pay Calculator</h3>
                <p className="text-warmgray text-xs mt-1">Calculate your exact after-tax income as an employee with all deductions applied.</p>
              </Link>
              <Link href="/superannuation-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-navy text-sm">Superannuation Calculator</h3>
                <p className="text-warmgray text-xs mt-1">Model employer SG contributions vs voluntary personal super payments and retirement projections.</p>
              </Link>
              <Link href="/salary-sacrifice-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-navy text-sm">Salary Sacrifice Calculator</h3>
                <p className="text-warmgray text-xs mt-1">See how pre-tax salary sacrifice reduces your taxable income and boosts your super balance.</p>
              </Link>
              <Link href="/contractor-pay-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-navy text-sm">Contractor Pay Calculator</h3>
                <p className="text-warmgray text-xs mt-1">Calculate your contractor take-home pay including GST, expenses, and self-funded super.</p>
              </Link>
              <Link href="/tax-return-calculator/" className="bg-white hover:bg-sandstone rounded-lg shadow-sm border border-sandstone-dark/20 p-4 transition-all hover:shadow-md">
                <h3 className="font-semibold text-navy text-sm">Tax Return Calculator</h3>
                <p className="text-warmgray text-xs mt-1">Estimate your FY2025-26 tax refund or liability before lodging with the ATO.</p>
              </Link>
            </div>
          </section>

          <MethodologyDisclosure>
            <p className="mb-2 text-sm">Calculations for the comparison are based on the following rules:</p>
            <ol className="list-decimal pl-4 space-y-1">
              <li><strong>Employee:</strong> Tax is calculated on Gross. Super (12%) is added on top. Net = Gross − Tax − Medicare. Total value = Gross + Super.</li>
              <li><strong>Contractor:</strong> Taxable Income = Gross − Business Expenses − Self-Funded Super. Tax is calculated on this reduced Taxable Income, demonstrating the value of tax deductions. Net Cash = Gross − Expenses − Super − Tax − Medicare. Total value = Net Cash + Super.</li>
            </ol>
          </MethodologyDisclosure>

          {/* FAQs */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="which" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Should I be a contractor or employee?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">It depends on the rate differential. If contracting pays 30%+ more than the equivalent employee salary, the financial benefit usually outweighs the loss of entitlements. Below that, employment is typically better value. Use the calculator above to compare your specific scenario.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="super" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do contractors have to pay super?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Contractors are not legally required to pay their own super (unlike employers who must pay the SG). However, for retirement planning, setting aside 12% voluntarily is strongly recommended. You can claim a tax deduction for personal super contributions up to the <strong>$30,000</strong> concessional cap in your tax return.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="gst" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do I need to register for GST as a contractor?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">You must register for GST if your annual business turnover is $75,000 or more. If it&apos;s below $75,000, registration is optional. When registered, you charge clients an additional 10% GST on your invoices and remit it to the ATO quarterly via your Business Activity Statement (BAS).</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="ato" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can I just decide to be a contractor?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">No. The ATO uses a strict multi-factor test to determine if you are genuinely a contractor or an employee for tax and super purposes. It depends on the working arrangement (e.g., control over work, providing your own tools, bearing financial risk), not just what your contract says. &quot;Sham contracting&quot; penalties apply to employers who get this wrong.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="rate" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How much more should a contractor charge than an employee salary?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">A contractor should charge <strong>30&ndash;45% above</strong> the equivalent employee salary to cover the superannuation guarantee (12%), annual leave (7.6%), personal leave (3.8%), insurance ($1,000&ndash;$3,000), and admin costs ($2,000&ndash;$4,000). On a $100,000 employee salary, the equivalent contractor rate is approximately <strong>$135,000&ndash;$145,000</strong> before GST.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="insurance" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do contractors need income protection insurance?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Income protection insurance is strongly recommended for contractors. Unlike employees who are covered by their employer&apos;s workers compensation insurance, contractors must arrange their own coverage. Income protection insurance typically costs <strong>1&ndash;3%</strong> of your annual income and replaces up to 75% of your earnings if you are unable to work due to illness or injury. The premiums are tax-deductible.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="deductions" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What tax deductions can contractors claim?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Contractors can deduct a wide range of business expenses, including: home office costs, equipment and tools, professional insurance premiums, accounting fees, travel between work sites, software subscriptions, and professional development. These deductions reduce your taxable income, which is the key financial advantage of contracting. Keep detailed records and receipts for every claim.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="payg" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do contractors pay PAYG instalments?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. The ATO issues PAYG instalment notices to contractors once they lodge their first tax return showing business income. Instalments are due quarterly and pre-pay your expected income tax liability. The ATO calculates the instalment amount based on your most recent tax return or you can choose to pay based on actual quarterly income. Failure to pay PAYG instalments on time incurs a <strong>general interest charge (GIC)</strong> currently set at approximately <strong>11.36%</strong> per annum.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <section className="bg-eucalyptus-light/30 rounded-2xl p-8 text-center mt-12">
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Want the employee breakdown?</h2>
            <p className="text-warmgray mb-6 max-w-lg mx-auto">See exactly how your employee take-home pay is affected by tax, medicare, super, and HECS.</p>
            <Link href="/" className="bg-eucalyptus-dark hover:bg-navy text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all">Go to Take-Home Calculator →</Link>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, green, highlight }: { label: string; value: string; bold?: boolean; green?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${green ? "text-eucalyptus-dark" : highlight ? "text-eucalyptus-dark" : "text-gray-700"}`}>{value}</span>
    </div>
  );
}

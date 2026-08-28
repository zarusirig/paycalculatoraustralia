"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldAlert } from "lucide-react";
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

{/* Merged from /contractor-vs-employee-calculator/ on 2026-08-28 — the guide 301s here (GSC: same query network, split ranking). */}
                      {/* ============================================================ */}
            <section id="ato-multi-factor">
              <h2>How Does the ATO Determine Your Status?</h2>
              <p>
                The ATO applies a &ldquo;Multi-Factor Test&rdquo; rooted in Australian common law &mdash; no single factor is decisive, and the test examines the totality of the working relationship across <strong>6 primary indicators</strong>.
              </p>
              <p>
                Following the High Court&apos;s 2022 decisions in <em>Construction, Forestry, Maritime, Mining and Energy Union v Personnel Contracting Pty Ltd</em> and <em>ZG Operations Australia Pty Ltd v Jamsek</em>, courts now prioritise the terms of the written contract &mdash; provided those terms reflect a genuine arrangement and are not a sham. The 6 indicators the ATO evaluates are:
              </p>
              <ol>
                <li><strong>Ability to sub-contract or delegate:</strong> A contractor has the right to hire others to do the work. An employee performs the work personally.</li>
                <li><strong>Basis of payment:</strong> Contractors invoice for a result (fixed quote, per-project fee). Employees receive a regular wage or salary per hour, week, or month.</li>
                <li><strong>Equipment, tools, and other assets:</strong> Contractors supply their own tools, vehicles, and software. Employees use the employer&apos;s equipment.</li>
                <li><strong>Commercial risk:</strong> Contractors bear financial risk &mdash; they fix defects at their own cost and carry their own professional indemnity, public liability, and income protection insurance. Employees bear no such risk.</li>
                <li><strong>Control over the work:</strong> Contractors decide how, when, and where they perform the work. Employees follow the employer&apos;s directions on method, location, and hours.</li>
                <li><strong>Independence / integration:</strong> Contractors operate visibly as a separate business (own ABN, own branding, multiple clients). Employees are integrated into the employer&apos;s operations (wearing uniforms, using company email addresses, attending staff meetings).</li>
              </ol>
              <p>
                A worker who satisfies 4 or more of these indicators as a contractor is more likely to be genuinely independent. A worker who fails most indicators &mdash; for example, using the employer&apos;s tools, working fixed rosters, having no right to delegate, and receiving hourly pay &mdash; is almost certainly an employee regardless of what the contract states. The ATO publishes a free &ldquo;Employee/Contractor Decision Tool&rdquo; on ato.gov.au that walks through each factor interactively.
              </p>
              <div className="bg-sandstone border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6 text-sm">
                <div className="flex items-start gap-4">
                  <ShieldAlert className="h-6 w-6 text-ochre mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-ochre mb-1">Beware of &lsquo;Sham Contracting&rsquo;</h3>
                    <p className="text-ochre">Intentionally classifying an employee as an independent contractor to avoid paying them super, leave, or minimum wage is illegal. Directors face massive fines, and the courts will force the company to backpay years of stolen superannuation and annual leave.</p>
                  </div>
                </div>
              </div>
              <p>
                A classic sign of sham contracting is forcing a worker to go and get an ABN before you will give them shifts, while continuing to dictate their hours and uniform just like regular employees.
              </p>
            </section>
            {/* ============================================================ */}
            <section id="comparison-table">
              <h2>Contractor vs Employee Comparison Table</h2>
              <p>
                Employees and contractors differ across <strong>12 key attributes</strong> covering tax, entitlements, risk, and work arrangements &mdash; the table below summarises every major distinction in one place.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4 w-1/3">Factor</th>
                        <th className="px-6 py-4 w-1/3 border-l">Employee</th>
                        <th className="px-6 py-4 w-1/3 border-l">Independent Contractor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Control over work</td>
                        <td className="px-6 py-4 border-l">Employer dictates the hours, location, and exactly <em>how</em> the work is done.</td>
                        <td className="px-6 py-4 border-l">Controls their own schedule and decides how to best achieve the requested result.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Tools &amp; Equipment</td>
                        <td className="px-6 py-4 border-l">Employer provides base tools, laptops, vehicles, or gives an allowance.</td>
                        <td className="px-6 py-4 border-l">Provides all of their own commercial tools, software, and gear.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Commercial Risk</td>
                        <td className="px-6 py-4 border-l">Takes no financial risk. Employer is legally responsible for mistakes.</td>
                        <td className="px-6 py-4 border-l">Bears commercial risk. Must fix defects at their own expense and carry their own insurance.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Integration</td>
                        <td className="px-6 py-4 border-l">Seen as a representative or face of the employer&apos;s business (e.g. wearing a logo).</td>
                        <td className="px-6 py-4 border-l">Operates visibly as their own distinct business (quoting their own ABN).</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Income tax</td>
                        <td className="px-6 py-4 border-l">Employer withholds PAYG tax each pay cycle. Employee lodges annual return.</td>
                        <td className="px-6 py-4 border-l">Receives full invoice amount. Must set aside ~30% and pay ATO directly via quarterly BAS or annual return.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">GST</td>
                        <td className="px-6 py-4 border-l">Not applicable. Employees do not charge GST.</td>
                        <td className="px-6 py-4 border-l">Must register and charge 10% GST if annual turnover exceeds $75,000.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Superannuation</td>
                        <td className="px-6 py-4 border-l">Employer pays 12% SG on top of gross salary (FY2025-26).</td>
                        <td className="px-6 py-4 border-l">Manages own super. Exception: employer pays SG if contractor is hired principally for labour.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Annual leave</td>
                        <td className="px-6 py-4 border-l">Entitled to 4 weeks (20 days) paid annual leave per year under the NES.</td>
                        <td className="px-6 py-4 border-l">No entitlement. Must factor unpaid time off into their hourly rate.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Sick / personal leave</td>
                        <td className="px-6 py-4 border-l">10 days paid personal/carer&apos;s leave per year.</td>
                        <td className="px-6 py-4 border-l">No entitlement. No pay when sick or caring for family.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Workers&apos; compensation</td>
                        <td className="px-6 py-4 border-l">Covered by employer&apos;s WorkCover policy.</td>
                        <td className="px-6 py-4 border-l">Must purchase own income protection and public liability insurance.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Delegation / sub-contracting</td>
                        <td className="px-6 py-4 border-l">Must perform work personally.</td>
                        <td className="px-6 py-4 border-l">Has the right to delegate work to others or sub-contract.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Termination</td>
                        <td className="px-6 py-4 border-l">Protected by unfair dismissal laws after minimum employment period (6 or 12 months).</td>
                        <td className="px-6 py-4 border-l">Contract ends per agreed terms. No unfair dismissal protection.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
            {/* ============================================================ */}
            <section id="gst-obligations">
              <h2>What Are the GST Obligations for Contractors?</h2>
              <p>
                Contractors earning above <strong>$75,000 in annual turnover</strong> must register for GST, charge 10% on every invoice, and remit the collected GST to the ATO via quarterly or monthly BAS lodgements.
              </p>
              <p>
                This means if you quote $100/hour to a client, the invoice actually becomes $110 (plus GST). The client pays $110, you keep $100, and $10 goes to the ATO. Many first-time contractors underestimate this cash-flow requirement and end up with a sizeable BAS bill at the end of each quarter.
              </p>
              <p>
                If you earn under $75,000, GST registration is optional. However, registering allows you to claim GST credits on business expenses (equipment, software, insurance), which can offset your liability. Contractors who purchase significant assets &mdash; vehicles, computer equipment, or specialised tools &mdash; in their first year of business often benefit from voluntary registration even below the $75,000 threshold.
              </p>
              <p>
                Employees never interact with GST. Their salary is not subject to GST, and they do not lodge BAS returns. This administrative burden is one of the hidden costs of contracting that workers overlook when comparing contractor vs employee arrangements.
              </p>
            </section>
            {/* ============================================================ */}
            <section id="super-obligations">
              <h2>Super Entitlements for Contractors</h2>
              <p>
                Genuine independent contractors pay their own superannuation voluntarily, but the Superannuation Guarantee (Administration) Act 1992 creates a critical exception: employers must pay the <strong>12% Super Guarantee</strong> for any contractor hired &ldquo;wholly or principally for their personal labour and skills.&rdquo;
              </p>
              <p className="text-lg font-medium text-navy border-l-4 border-eucalyptus pl-4 py-1">
                If a contractor is hired wholly or principally for their personal labour and skills, the employer must still pay the 12% Super Guarantee on top of their invoice.
              </p>
              <p>
                This exception targets sole traders who function economically like employees &mdash; a freelance web developer billing hourly, a sole-trader electrician on a long-term engagement, or a contract bookkeeper working 3 days per week for a single client. The test asks: is the hiring business paying for the contractor&apos;s personal effort, or for a deliverable that the contractor&apos;s business produces using any combination of staff and resources?
              </p>
              <p>
                If you hire a solo graphic designer on an hourly rate to do design work just because they are good at it, the ATO classifies them as an employee <strong>for superannuation purposes only</strong>. You must pay their super. If you hire a massive plumbing <em>company</em> to fix a roof, and they send an anonymous plumber out, that is a true B2B contract and no super is owed.
              </p>
              <p>
                Contractors who do not receive employer super contributions can still make personal concessional (before-tax) contributions up to the <strong>$30,000 annual cap</strong> and claim a full tax deduction. Non-concessional (after-tax) contributions are capped at <strong>$120,000 per year</strong>. Read the full breakdown in our <Link href="/superannuation-guide/">Superannuation Guide</Link>.
              </p>
            </section>
            {/* ============================================================ */}
            <section id="sham-contracting">
              <h2>What Are the Risks of Sham Contracting?</h2>
              <p>
                &ldquo;Sham contracting&rdquo; occurs when an employer deliberately disguises an employment relationship as a contracting arrangement to avoid paying entitlements &mdash; the Fair Work Ombudsman penalises offenders with fines of up to <strong>$469,500 per contravention</strong> for companies and <strong>$93,900 per contravention</strong> for individuals.
              </p>
              <p>
                Beyond the civil penalties, sham contracting triggers 3 additional financial consequences:
              </p>
              <ol>
                <li><strong>Backpayment of superannuation:</strong> The employer must pay all unpaid Super Guarantee amounts at 12% (or the rate applicable at the time), plus the Superannuation Guarantee Charge (SGC). From 1 July 2026 that is the shortfall, notional earnings at the general interest charge rate compounded daily, and an administrative uplift of up to 60%; the charge is now tax-deductible. For earnings paid up to 30 June 2026 the old rules apply — 10% nominal interest, $20 per employee per quarter, and no deduction.</li>
                <li><strong>Backpayment of leave entitlements:</strong> The employer owes all accumulated annual leave, personal leave, and any applicable redundancy pay &mdash; potentially spanning multiple years. Long-service leave liabilities accrue after <strong>7 to 10 years</strong> depending on the state.</li>
                <li><strong>Backpayment of Award underpayments:</strong> If the worker was covered by a Modern Award, the employer must make up the difference between what was paid and the Award minimum, including overtime, penalty rates, and allowances. Review common Award structures on our <Link href="/award-rates/">Award Rates</Link> page.</li>
              </ol>
              <p>
                Industries with the highest rates of sham contracting enforcement include construction, cleaning, hospitality, transport and logistics, and IT consulting. The Fair Work Ombudsman conducts targeted audits in these sectors annually. In FY2023-24, the FWO recovered over <strong>$473 million</strong> in underpayments across all enforcement activities.
              </p>
              <p>
                There is no &ldquo;innocent mistake&rdquo; defence if the employer &ldquo;reasonably should have known&rdquo; the worker was an employee. The onus falls on the employer to prove the arrangement is genuine.
              </p>
            </section>
            {/* ============================================================ */}
            <section id="switching">
              <h2>How to Switch from Contractor to Employee</h2>
              <p>
                Switching from contractor to employee requires a formal transition covering <strong>5 administrative steps</strong> &mdash; the employer must restructure the legal arrangement, payroll registration, and insurance coverage.
              </p>
              <ol>
                <li><strong>Sign a new employment contract:</strong> The contractor agreement terminates and a written employment contract replaces it, specifying the role, salary, hours, and applicable Modern Award or Enterprise Agreement.</li>
                <li><strong>Register in the employer&apos;s PAYG system:</strong> The employee completes a Tax File Number (TFN) declaration. The employer begins withholding income tax each pay cycle using ATO withholding schedules. Learn more about the deduction process in our <Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> guide.</li>
                <li><strong>Commence Super Guarantee payments:</strong> The employer pays 12% super on top of the agreed salary from the first day of employment. Payments are due quarterly &mdash; within <strong>28 days</strong> of the end of each quarter (28 October, 28 January, 28 April, 28 July).</li>
                <li><strong>Enrol in workers&apos; compensation insurance:</strong> State-based WorkCover schemes cover the new employee immediately. The employer absorbs this cost, which ranges from <strong>0.3% to 8%</strong> of payroll depending on the industry and state.</li>
                <li><strong>Adjust the pay rate:</strong> The gross salary is typically lower than the contractor&apos;s invoice rate because the employer now bears on-costs including super, leave accrual, and WorkCover. A contractor earning $78/hour commonly transitions to an employee salary of <strong>$100,000 to $105,000</strong> per year.</li>
              </ol>
              <p>
                Leave entitlements (annual leave, personal leave, long-service leave) begin accruing from day one of the employment relationship. The transition does not carry over any prior service as a contractor for leave-accrual purposes, unless the employer agrees otherwise in writing.
              </p>
            </section>
            {/* ============================================================ */}
            <section id="insurance-and-leave">
              <h2>What Insurance and Leave Do Contractors Miss Out On?</h2>
              <p>
                Contractors receive <strong>zero paid leave</strong> and must purchase all workplace insurance at their own expense &mdash; these two costs represent the largest hidden gap between contracting and employment income.
              </p>
              <ul>
                <li><strong>Annual leave:</strong> Employees receive 4 weeks (20 days) paid leave per year under the National Employment Standards. Contractors who take 4 weeks off sacrifice approximately <strong>7.7%</strong> of their annual billable revenue.</li>
                <li><strong>Personal / carer&apos;s leave:</strong> Employees receive 10 days paid personal leave per year. Contractors receive nothing &mdash; illness or caring responsibilities translate directly into lost income.</li>
                <li><strong>Long-service leave:</strong> Employees accrue long-service leave after 7 to 10 years (varies by state). Contractors have no equivalent entitlement.</li>
                <li><strong>Public holidays:</strong> Employees receive <strong>8 national public holidays</strong> paid (plus state-specific additions, totalling 10 to 13 days depending on the jurisdiction). Contractors forfeit this income or must work the day.</li>
                <li><strong>Workers&apos; compensation:</strong> Employers take out WorkCover insurance for their employees. True independent contractors must pay for their own income protection insurance (typically <strong>$800 to $2,500 per year</strong>) and public liability insurance (typically <strong>$400 to $1,500 per year</strong>).</li>
              </ul>
              <p>
                Combined, lost leave and insurance costs add <strong>$15,000 to $25,000 per year</strong> in hidden expenses for a contractor earning the equivalent of a $100,000 employee salary. This is why commercial contracting rates are set <strong>25% to 50%</strong> higher than internal employee salaries.
              </p>
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
                          <AccordionItem value="what-is" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the main difference between an employee and a contractor?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    An employee works inside the employer&apos;s business under the employer&apos;s direction and control. A contractor operates their own independent business and is engaged to deliver a specific result. The distinction determines tax obligations, super entitlements, leave rights, and insurance coverage.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="abn" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does having an ABN automatically make me a contractor?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. The ATO explicitly states that merely possessing an ABN or issuing invoices does not make a worker an independent contractor. The actual working arrangement &mdash; including control, tools, risk, and integration &mdash; determines the true classification.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="super" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Are contractors entitled to superannuation?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Genuine independent contractors manage their own super. However, if a contractor is hired &ldquo;wholly or principally for their personal labour and skills&rdquo; &mdash; for example, a sole-trader IT consultant billing hourly &mdash; the hiring business must pay the <strong>12% Super Guarantee</strong> on top of the contractor&apos;s invoices under the Superannuation Guarantee (Administration) Act 1992.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="penalties" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What are the penalties for sham contracting?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The Fair Work Ombudsman imposes fines of up to <strong>$93,900 per contravention</strong> for individuals and <strong>$469,500 per contravention</strong> for companies. The employer must also backpay all lost entitlements including super (plus the non-deductible Superannuation Guarantee Charge), annual leave, sick leave, and any Award underpayments &mdash; often spanning several years of accumulated liability.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="convert" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I convert from contractor to employee?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes, but it requires a formal transition. Your employer must issue a new employment contract, register you in their PAYG system, start paying super, and enrol you in workers&apos; compensation insurance. Your hourly rate will typically decrease because the employer now bears additional on-costs (super, leave, WorkCover). Use our <Link href="/contractor-vs-employee-calculator/" className="text-eucalyptus-dark hover:underline">Contractor vs Employee Calculator</Link> to model the exact financial impact.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="gst-threshold" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do contractors have to charge GST?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    GST registration is mandatory once a contractor&apos;s annual turnover exceeds <strong>$75,000</strong>. Below that threshold, registration is optional. Registered contractors charge 10% GST on every invoice and can claim GST credits on business purchases. Employees never interact with GST.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="tax-return" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do contractors pay more tax than employees?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Contractors and employees earning the same taxable income pay the same income tax &mdash; the FY2025-26 tax brackets and Medicare levy apply identically. The difference is timing and administration: employees have tax withheld automatically, while contractors must set aside funds and pay the ATO directly. Contractors can reduce their taxable income through business deductions that employees cannot claim.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="single-client" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is it legal to work for only one client as a contractor?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Working for a single client does not automatically make you an employee, but it is one of the strongest indicators the ATO examines. A genuine contractor working for one client must demonstrate independence in other areas &mdash; owning their tools, controlling their schedule, bearing commercial risk, and having the contractual right to take on other clients. Exclusive long-term arrangements with fixed hours attract heavy ATO scrutiny.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="payslip" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do contractors receive payslips?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. Contractors issue tax invoices to their clients and receive payment against those invoices. Only employees receive payslips, which employers must provide within <strong>1 business day</strong> of each pay. Read our <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">Understanding Your Payslip</Link> guide for a full breakdown of payslip components.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="insurance-types" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What insurance does a contractor need?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Contractors typically require 3 types of insurance: <strong>public liability insurance</strong> ($400 to $1,500 per year) covering third-party injury or property damage, <strong>professional indemnity insurance</strong> ($500 to $2,000 per year) covering errors in professional advice or work, and <strong>income protection insurance</strong> ($800 to $2,500 per year) replacing income during illness or injury. Premiums are tax-deductible as business expenses.
                  </AccordionContent>
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ExternalLink, Calculator, DollarSign, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

// The employer cost calculator acts specifically as an interactive hub within a long-form guide.
// We embed a simple React state calculator here to fulfill the dual purpose.
const SOURCES_LIST: SourceLink[] = [
  { title: "Super for employers", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers", publisher: SOURCES.ato.name },
  { title: "Payroll tax", url: "https://business.gov.au/finance/tax/payroll-tax", publisher: "Business.gov.au" },
];

export default function EmployerCostCalculatorPage() {
  const [baseSalary, setBaseSalary] = useState<number>(100000);
  const [payrollTaxRate, setPayrollTaxRate] = useState<number>(4.85); // Default general proxy
  const [workcoverRate, setWorkcoverRate] = useState<number>(1.5); // Default average proxy

  // Logic
  const superAmt = baseSalary * 0.12; // 12% coming July 2025
  const leaveProvision = baseSalary * (4 / 52); // ~7.69% for 4 weeks annual leave
  const payrollTaxAmt = (baseSalary + superAmt) * (payrollTaxRate / 100);
  const workcoverAmt = baseSalary * (workcoverRate / 100);

  const trueCost = baseSalary + superAmt + leaveProvision + payrollTaxAmt + workcoverAmt;
  const costMultiplier = trueCost / baseSalary;

  return (
    <div className="min-h-screen flex-grow bg-sandstone/30">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Employer Cost Calculator</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6 tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Employer Cost Calculator: The True Cost of Hiring
          </h1>
          <p className="text-xl text-warmgray leading-relaxed max-w-3xl">
            A staff member on a $100,000 salary costs a business far more than $100,000. Calculate the hidden on-costs including superannuation, payroll tax, workers comp, and mandatory leave provisions.
          </p>
          <TrustBar className="mt-8 !max-w-none" variant="light" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN COLUMN */}
          <div className="lg:w-2/3 space-y-12">

            {/* INTERACTIVE CALCULATOR SECTION */}
            <section id="calculate-total-cost" className="bg-white rounded-2xl shadow-sm border border-sandstone-dark/20 overflow-hidden">
              <div className="p-6 md:p-8 bg-navy border-b border-navy-light">
                <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  <Briefcase className="h-6 w-6 text-eucalyptus" /> Calculate Total Employment Cost
                </h2>
                <p className="text-sandstone-dark/50">Adjust the parameters below to see the hidden multiplier effect.</p>
              </div>

              <div className="p-6 md:p-8 grid md:grid-cols-2 gap-10">

                {/* Inputs */}
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="base-salary" className="text-navy font-semibold text-base">Annual Base Salary Before Super</Label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <span className="text-warmgray-light font-medium text-lg">$</span>
                      </div>
                      <Input
                        id="base-salary"
                        type="number"
                        min={0}
                        value={baseSalary || ''}
                        onChange={(e) => setBaseSalary(Number(e.target.value))}
                        className="pl-9 h-14 text-lg font-medium border-sandstone-dark/30 bg-sandstone/30 focus:bg-white transition-colors rounded-xl focus:border-eucalyptus focus:ring-eucalyptus/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="prt" className="text-navy font-semibold text-sm">Est. Payroll Tax %</Label>
                      <div className="relative">
                        <Input
                          id="prt"
                          type="number"
                          step="0.1"
                          value={payrollTaxRate}
                          onChange={(e) => setPayrollTaxRate(Number(e.target.value))}
                          className="pr-8 border-sandstone-dark/30 rounded-lg focus:ring-eucalyptus/20 focus:border-eucalyptus"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-warmgray-light text-sm">%</span>
                        </div>
                      </div>
                      <p className="text-xs text-warmgray-light leading-tight">Usually ~5% if total wages `{'>'}` $1M.</p>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="wc" className="text-navy font-semibold text-sm">WorkCover Premium %</Label>
                      <div className="relative">
                        <Input
                          id="wc"
                          type="number"
                          step="0.1"
                          value={workcoverRate}
                          onChange={(e) => setWorkcoverRate(Number(e.target.value))}
                          className="pr-8 border-sandstone-dark/30 rounded-lg focus:ring-eucalyptus/20 focus:border-eucalyptus"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <span className="text-warmgray-light text-sm">%</span>
                        </div>
                      </div>
                      <p className="text-xs text-warmgray-light leading-tight">Varies wildly by industry risk (0.5% - 10%).</p>
                    </div>
                  </div>
                </div>

                {/* Outputs */}
                <div className="bg-sandstone/40 rounded-2xl p-6 border border-sandstone-dark/20">
                  <h3 className="text-lg font-bold text-navy mb-6 border-b border-sandstone-dark/20 pb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Breakdown</h3>

                  <div className="space-y-4 font-medium">
                    <div className="flex justify-between items-center text-warmgray">
                      <span>Base Salary:</span>
                      <span className="text-navy">${baseSalary.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                    </div>

                    <div className="flex justify-between items-center text-ochre">
                      <span className="flex items-center gap-1">Superannuation (12%): <span className="text-xs bg-ochre/10 text-ochre px-1.5 py-0.5 rounded leading-none border border-ochre/20">Owed required</span></span>
                      <span>+ ${superAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                    </div>

                    <div className="flex justify-between items-center text-ochre/80">
                      <span className="flex items-center gap-1">Leave Provision (4wks): <span className="text-xs bg-ochre/10 text-ochre px-1.5 py-0.5 rounded leading-none border border-ochre/20">Lost time cost</span></span>
                      <span>+ ${leaveProvision.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                    </div>

                    <div className="flex justify-between items-center text-warmgray-light text-sm">
                      <span>State Payroll Tax:</span>
                      <span>+ ${payrollTaxAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                    </div>

                    <div className="flex justify-between items-center text-warmgray-light text-sm border-b border-sandstone-dark/20 pb-4">
                      <span>WorkCover Premium:</span>
                      <span>+ ${workcoverAmt.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                    </div>

                    <div className="flex justify-between items-end pt-2">
                      <div>
                        <span className="block text-warmgray-light text-sm font-semibold uppercase tracking-wider mb-1">True Commercial Cost</span>
                        <span className="text-4xl font-extrabold text-navy tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                          ${trueCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </span>
                      </div>
                      <div className="text-right pb-1">
                        <span className="text-sm font-semibold text-warmgray-light uppercase tracking-wider block">Real Multiplier</span>
                        <span className="text-xl font-bold text-eucalyptus-dark">{costMultiplier.toFixed(2)}x</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </section>

            {/* LONG FORM GUIDE CONTENT */}
            <article className="prose prose-slate prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

              {/* H2 #1 */}
              <section id="how-much-does-employee-cost">
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Does an Employee Really Cost an Employer?</h2>
                <p>
                  An employee on a $100,000 base salary costs an Australian employer between <strong>$130,000 and $145,000</strong> once all mandatory on-costs are included.
                </p>
                <p>
                  The employer cost calculator above demonstrates a multiplier that typically lands between <strong>1.3x and 1.45x</strong> the base salary. This multiplier includes the Superannuation Guarantee at 12%, annual leave provisions at 7.69%, workers compensation insurance, and payroll tax for businesses above the state threshold. Employers who provide additional benefits such as salary-packaged novated leases, training budgets, or fringe benefits face an even higher true cost of employment.
                </p>
                <p>
                  Understanding this cost multiplier is critical for small business cash flow forecasting, headcount planning, and deciding between hiring employees versus engaging contractors. The Australian tax calculator treats take-home pay from the employee&apos;s perspective, but this guide examines the same salary from the employer&apos;s side of the ledger.
                </p>
              </section>

              {/* H2 #2 */}
              <section id="on-costs-of-employment">
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the On-Costs of Employment?</h2>
                <p>
                  On-costs are the mandatory expenses an employer pays <strong>on top of an employee&apos;s base salary</strong>, including superannuation, workers compensation, payroll tax, and leave loading.
                </p>
                <p>
                  These costs are legislated under federal and state law. An employer cannot legally avoid them. The four primary on-cost categories break down as follows:
                </p>
                <ul>
                  <li><strong>Superannuation Guarantee (SG):</strong> 12% of Ordinary Time Earnings, paid quarterly to the employee&apos;s nominated super fund</li>
                  <li><strong>Workers compensation insurance:</strong> 0.3% to 10%+ of wages depending on industry risk classification, covering workplace injury and illness</li>
                  <li><strong>Payroll tax:</strong> 3.75% to 6.85% of total wages (including super) for employers exceeding the state-specific threshold</li>
                  <li><strong>Leave loading:</strong> Annual leave at 7.69% of base salary, personal leave at 3.85%, long service leave accrual at 1.67% per year of service</li>
                </ul>
                <p>
                  Beyond these four legislated costs, employers also absorb recruitment expenses averaging $5,000 to $15,000 per hire, onboarding productivity losses of 30% to 50% for the first 3 months, and equipment costs of $5,000 to $15,000 annually for desk space, hardware, and software licences.
                </p>

                <h3>How Do On-Costs Differ for Casual vs Permanent Employees?</h3>
                <p>
                  Casual employees receive a <strong>25% loading</strong> on their base hourly rate under the Fair Work Act to compensate for no paid leave entitlements. This loading replaces the annual leave provision, personal leave provision, and notice period obligation. Casual workers still attract superannuation at 12%, payroll tax, and workers compensation premiums. The casual loading often makes the per-hour cost higher, but the flexibility of zero paid leave and no redundancy obligations makes casuals cheaper for unpredictable, seasonal, or project-based workloads.
                </p>
              </section>

              {/* H2 #3 */}
              <section id="employer-cost-breakdown-table">
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Employer Cost Breakdown Table by Salary Level</h2>
                <p>
                  The total cost of employment scales proportionally with salary, but the multiplier compresses slightly at higher income levels because some on-costs have fixed-dollar caps.
                </p>
                <p>
                  The table below shows the employer cost breakdown for FY2025-26 at five common salary levels, assuming a 4.85% payroll tax rate and 1.5% average workers compensation premium. Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to see what the employee receives after income tax and Medicare levy.
                </p>
                <div className="not-prose overflow-x-auto my-6">
                  <table className="w-full text-sm border-collapse border border-sandstone-dark/20 rounded-lg">
                    <thead>
                      <tr className="bg-navy text-white">
                        <th className="px-4 py-3 text-left font-semibold">Component</th>
                        <th className="px-4 py-3 text-right font-semibold">$60,000</th>
                        <th className="px-4 py-3 text-right font-semibold">$80,000</th>
                        <th className="px-4 py-3 text-right font-semibold">$100,000</th>
                        <th className="px-4 py-3 text-right font-semibold">$130,000</th>
                        <th className="px-4 py-3 text-right font-semibold">$180,000</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">Base Salary</td>
                        <td className="px-4 py-2.5 text-right">$60,000</td>
                        <td className="px-4 py-2.5 text-right">$80,000</td>
                        <td className="px-4 py-2.5 text-right">$100,000</td>
                        <td className="px-4 py-2.5 text-right">$130,000</td>
                        <td className="px-4 py-2.5 text-right">$180,000</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                        <td className="px-4 py-2.5 font-medium text-navy">Super (12%)</td>
                        <td className="px-4 py-2.5 text-right">$7,200</td>
                        <td className="px-4 py-2.5 text-right">$9,600</td>
                        <td className="px-4 py-2.5 text-right">$12,000</td>
                        <td className="px-4 py-2.5 text-right">$15,600</td>
                        <td className="px-4 py-2.5 text-right">$21,600</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">Leave Provision (7.69%)</td>
                        <td className="px-4 py-2.5 text-right">$4,615</td>
                        <td className="px-4 py-2.5 text-right">$6,154</td>
                        <td className="px-4 py-2.5 text-right">$7,692</td>
                        <td className="px-4 py-2.5 text-right">$10,000</td>
                        <td className="px-4 py-2.5 text-right">$13,846</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                        <td className="px-4 py-2.5 font-medium text-navy">Payroll Tax (4.85%)</td>
                        <td className="px-4 py-2.5 text-right">$3,259</td>
                        <td className="px-4 py-2.5 text-right">$4,345</td>
                        <td className="px-4 py-2.5 text-right">$5,432</td>
                        <td className="px-4 py-2.5 text-right">$7,062</td>
                        <td className="px-4 py-2.5 text-right">$9,778</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">WorkCover (1.5%)</td>
                        <td className="px-4 py-2.5 text-right">$900</td>
                        <td className="px-4 py-2.5 text-right">$1,200</td>
                        <td className="px-4 py-2.5 text-right">$1,500</td>
                        <td className="px-4 py-2.5 text-right">$1,950</td>
                        <td className="px-4 py-2.5 text-right">$2,700</td>
                      </tr>
                      <tr className="bg-navy/5 font-bold">
                        <td className="px-4 py-3 text-navy">Total Employer Cost</td>
                        <td className="px-4 py-3 text-right text-navy">$75,974</td>
                        <td className="px-4 py-3 text-right text-navy">$101,299</td>
                        <td className="px-4 py-3 text-right text-navy">$126,624</td>
                        <td className="px-4 py-3 text-right text-navy">$164,612</td>
                        <td className="px-4 py-3 text-right text-navy">$227,924</td>
                      </tr>
                      <tr className="bg-eucalyptus/10 font-bold">
                        <td className="px-4 py-3 text-eucalyptus-dark">Multiplier</td>
                        <td className="px-4 py-3 text-right text-eucalyptus-dark">1.27x</td>
                        <td className="px-4 py-3 text-right text-eucalyptus-dark">1.27x</td>
                        <td className="px-4 py-3 text-right text-eucalyptus-dark">1.27x</td>
                        <td className="px-4 py-3 text-right text-eucalyptus-dark">1.27x</td>
                        <td className="px-4 py-3 text-right text-eucalyptus-dark">1.27x</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  Businesses below their state&apos;s payroll tax threshold remove the payroll tax row entirely, which drops the multiplier to approximately <strong>1.21x</strong>. The super guarantee has a maximum contribution base of <strong>$65,070 per quarter</strong> ($260,280 per year) for FY2025-26, meaning employers with staff earning above that threshold pay super only up to the cap unless contractually obligated otherwise.
                </p>
              </section>

              {/* H2 #4 */}
              <section id="super-calculated-for-employers">
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Superannuation Calculated for Employers?</h2>
                <p>
                  Employers calculate superannuation at <strong>12% of each employee&apos;s Ordinary Time Earnings (OTE)</strong> for FY2025-26, paid quarterly to the employee&apos;s nominated super fund.
                </p>
                <p>
                  Ordinary Time Earnings include the employee&apos;s base salary, commissions, shift loadings, and allowances that relate to ordinary hours of work. OTE excludes overtime payments, reimbursements, and lump sum termination payments. The ATO defines the distinction under Superannuation Guarantee Ruling SGR 2009/2.
                </p>

                <h3>Quarterly Payment Deadlines</h3>
                <p>
                  Since <strong>1 July 2026</strong>, super must reach the employee&rsquo;s fund within <strong>7 business days of each payday</strong> — quarterly payment has ended. Missing that deadline triggers the Superannuation Guarantee Charge, now made up of the shortfall, notional earnings at the general interest charge rate compounded daily, and an administrative uplift of up to 60% that falls to nil on a voluntary disclosure within 30 days. The charge is now tax-deductible. The final quarterly deadlines, which applied to earnings paid up to 30 June 2026, were:
                </p>
                <div className="not-prose overflow-x-auto my-6">
                  <table className="w-full text-sm border-collapse border border-sandstone-dark/20 rounded-lg">
                    <thead>
                      <tr className="bg-navy text-white">
                        <th className="px-4 py-3 text-left font-semibold">Quarter</th>
                        <th className="px-4 py-3 text-left font-semibold">Period</th>
                        <th className="px-4 py-3 text-left font-semibold">Payment Due By</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">Q1</td>
                        <td className="px-4 py-2.5">1 Jul &ndash; 30 Sep 2025</td>
                        <td className="px-4 py-2.5 font-semibold">28 October 2025</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                        <td className="px-4 py-2.5 font-medium text-navy">Q2</td>
                        <td className="px-4 py-2.5">1 Oct &ndash; 31 Dec 2025</td>
                        <td className="px-4 py-2.5 font-semibold">28 January 2026</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">Q3</td>
                        <td className="px-4 py-2.5">1 Jan &ndash; 31 Mar 2026</td>
                        <td className="px-4 py-2.5 font-semibold">28 April 2026</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                        <td className="px-4 py-2.5 font-medium text-navy">Q4</td>
                        <td className="px-4 py-2.5">1 Apr &ndash; 30 Jun 2026</td>
                        <td className="px-4 py-2.5 font-semibold">28 July 2026</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  The $450-per-month minimum earnings threshold was removed on 1 July 2022. Every employee now receives superannuation regardless of how little they earn. For a detailed breakdown of SG rate history and contribution caps, see our <Link href="/superannuation-guide/">Superannuation Guide</Link>.
                </p>
              </section>

              {/* H2 #5 */}
              <section id="payroll-tax-state-rates">
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is Payroll Tax?</h2>
                <p>
                  Payroll tax is a state and territory government tax on employers whose <strong>total Australian wages exceed a state-specific annual threshold</strong>, charged as a percentage on every dollar above that threshold.
                </p>
                <p>
                  Payroll tax is calculated on the total wage bill, which includes gross salaries, superannuation contributions, allowances, fringe benefits, and contractor payments in some cases. Businesses operating across multiple states must register in each state where they have employees and apportion their threshold accordingly. Small businesses below the threshold in their state pay zero payroll tax, which removes the largest variable on-cost from their employer cost calculation.
                </p>

                <h3>Payroll Tax Rates by State and Territory (FY2025-26)</h3>
                <div className="not-prose overflow-x-auto my-6">
                  <table className="w-full text-sm border-collapse border border-sandstone-dark/20 rounded-lg">
                    <thead>
                      <tr className="bg-navy text-white">
                        <th className="px-4 py-3 text-left font-semibold">State/Territory</th>
                        <th className="px-4 py-3 text-right font-semibold">Annual Threshold</th>
                        <th className="px-4 py-3 text-right font-semibold">Rate</th>
                        <th className="px-4 py-3 text-left font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">NSW</td>
                        <td className="px-4 py-2.5 text-right">$1,200,000</td>
                        <td className="px-4 py-2.5 text-right font-semibold">5.45%</td>
                        <td className="px-4 py-2.5 text-warmgray">Phases out above threshold</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                        <td className="px-4 py-2.5 font-medium text-navy">VIC</td>
                        <td className="px-4 py-2.5 text-right">$900,000</td>
                        <td className="px-4 py-2.5 text-right font-semibold">4.85%</td>
                        <td className="px-4 py-2.5 text-warmgray">Mental health surcharge adds 0.5% above $10M</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">QLD</td>
                        <td className="px-4 py-2.5 text-right">$1,300,000</td>
                        <td className="px-4 py-2.5 text-right font-semibold">4.75%</td>
                        <td className="px-4 py-2.5 text-warmgray">Discount for regional employers</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                        <td className="px-4 py-2.5 font-medium text-navy">WA</td>
                        <td className="px-4 py-2.5 text-right">$1,000,000</td>
                        <td className="px-4 py-2.5 text-right font-semibold">5.50%</td>
                        <td className="px-4 py-2.5 text-warmgray">Tiered: 6.50% above $100M</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">SA</td>
                        <td className="px-4 py-2.5 text-right">$1,500,000</td>
                        <td className="px-4 py-2.5 text-right font-semibold">4.95%</td>
                        <td className="px-4 py-2.5 text-warmgray">Highest threshold in Australia</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                        <td className="px-4 py-2.5 font-medium text-navy">TAS</td>
                        <td className="px-4 py-2.5 text-right">$1,250,000</td>
                        <td className="px-4 py-2.5 text-right font-semibold">4.00%</td>
                        <td className="px-4 py-2.5 text-warmgray">Lowest rate in Australia</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">ACT</td>
                        <td className="px-4 py-2.5 text-right">$2,000,000</td>
                        <td className="px-4 py-2.5 text-right font-semibold">6.85%</td>
                        <td className="px-4 py-2.5 text-warmgray">Highest rate in Australia</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                        <td className="px-4 py-2.5 font-medium text-navy">NT</td>
                        <td className="px-4 py-2.5 text-right">$1,500,000</td>
                        <td className="px-4 py-2.5 text-right font-semibold">5.50%</td>
                        <td className="px-4 py-2.5 text-warmgray">Matches WA base rate</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  A business with 20 employees averaging $90,000 each has a total wage bill of $1,800,000. In Victoria, this exceeds the $900,000 threshold by $900,000, generating a payroll tax liability of <strong>$43,650</strong> (900,000 x 4.85%). The same business operating in South Australia sits above the $1,500,000 threshold by only $300,000, producing a liability of just <strong>$14,850</strong> (300,000 x 4.95%).
                </p>
              </section>

              {/* H2 #6 */}
              <section id="workers-compensation-costs">
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Much Does Workers Compensation Insurance Cost?</h2>
                <p>
                  Workers compensation insurance costs employers between <strong>0.3% and 10%+ of wages</strong> depending on the industry classification and the employer&apos;s claims history.
                </p>
                <p>
                  Every Australian state and territory mandates workers compensation insurance for all employers. The premium is calculated as a percentage of the total remuneration paid to each employee, multiplied by an industry-specific rate set by the state&apos;s workers compensation authority. Employers with a poor claims history pay a loading above the base rate, while employers with clean records receive experience-based discounts.
                </p>
                <div className="not-prose overflow-x-auto my-6">
                  <table className="w-full text-sm border-collapse border border-sandstone-dark/20 rounded-lg">
                    <thead>
                      <tr className="bg-navy text-white">
                        <th className="px-4 py-3 text-left font-semibold">Industry</th>
                        <th className="px-4 py-3 text-right font-semibold">Typical Premium Rate</th>
                        <th className="px-4 py-3 text-right font-semibold">Cost on $100k Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">Professional services / IT</td>
                        <td className="px-4 py-2.5 text-right">0.3% &ndash; 0.8%</td>
                        <td className="px-4 py-2.5 text-right">$300 &ndash; $800</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                        <td className="px-4 py-2.5 font-medium text-navy">Retail / Hospitality</td>
                        <td className="px-4 py-2.5 text-right">1.2% &ndash; 2.5%</td>
                        <td className="px-4 py-2.5 text-right">$1,200 &ndash; $2,500</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">Manufacturing</td>
                        <td className="px-4 py-2.5 text-right">2.0% &ndash; 4.5%</td>
                        <td className="px-4 py-2.5 text-right">$2,000 &ndash; $4,500</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                        <td className="px-4 py-2.5 font-medium text-navy">Construction</td>
                        <td className="px-4 py-2.5 text-right">3.0% &ndash; 7.0%</td>
                        <td className="px-4 py-2.5 text-right">$3,000 &ndash; $7,000</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">Mining / Heavy industry</td>
                        <td className="px-4 py-2.5 text-right">5.0% &ndash; 10%+</td>
                        <td className="px-4 py-2.5 text-right">$5,000 &ndash; $10,000+</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  Each state administers workers compensation through a different authority: icare in NSW, WorkSafe Victoria, WorkCover Queensland, WorkCover WA, ReturnToWorkSA, WorkSafe Tasmania, Comcare for ACT federal employees, and NT WorkSafe. Premium structures, dispute resolution processes, and benefit levels vary across jurisdictions.
                </p>
              </section>

              {/* H2 #7 */}
              <section id="total-cost-worked-example">
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Total Cost of Employment: Worked Example</h2>
                <p>
                  A Melbourne-based marketing agency hiring a full-time marketing manager at $95,000 per year faces a total employment cost of approximately <strong>$122,726</strong> in FY2025-26.
                </p>
                <p>
                  The following step-by-step calculation uses real Victorian rates:
                </p>
                <ol>
                  <li><strong>Base salary:</strong> $95,000</li>
                  <li><strong>Superannuation (12% of OTE):</strong> $95,000 x 0.12 = <strong>$11,400</strong></li>
                  <li><strong>Annual leave provision (4 weeks / 52 weeks):</strong> $95,000 x 0.0769 = <strong>$7,308</strong></li>
                  <li><strong>Personal leave provision (10 days / 260 days):</strong> $95,000 x 0.0385 = <strong>$3,654</strong></li>
                  <li><strong>Payroll tax (VIC: 4.85% on wages + super above $900k threshold):</strong> Assuming the business exceeds the threshold, ($95,000 + $11,400) x 0.0485 = <strong>$5,160</strong></li>
                  <li><strong>Workers compensation (professional services at 0.5%):</strong> $95,000 x 0.005 = <strong>$475</strong></li>
                </ol>
                <p>
                  Adding these components: $95,000 + $11,400 + $7,308 + $3,654 + $5,160 + $475 = <strong>$122,997</strong>. The cost multiplier for this role is <strong>1.29x</strong>. This excludes recruitment costs, training, equipment, and office space. Factoring those in brings the realistic total closer to <strong>$135,000 to $140,000</strong>, or a multiplier of approximately 1.42x to 1.47x.
                </p>
                <p>
                  Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to see that the employee on this $95,000 salary takes home approximately <strong>$73,500</strong> after income tax brackets, Medicare levy, and HECS-HELP repayments. The gap between the employer&apos;s total cost of $123,000 and the employee&apos;s take-home pay of $73,500 is <strong>$49,500</strong> &mdash; consumed entirely by taxation, superannuation contributions, and insurance.
                </p>
              </section>

              {/* --- CONTEXT BORDER --- */}

              {/* H2 #8 - Employee vs Contractor (EXISTING - preserved and expanded) */}
              <section id="contractor-vs-employee-cost">
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Does Employee vs Contractor Cost Compare?</h2>
                <p>
                  Hiring an independent contractor at a higher hourly rate is often <strong>cheaper than employing a permanent staff member</strong> once on-costs are factored into the calculation.
                </p>
                <p>
                  If an employee demands $50/hour, the true cost to the business reaches approximately $68/hour once super, leave, and sick days are accounted for. By comparison, if an independent contractor charges a flat $65/hour on invoice, the business saves money because the contractor provides their own insurance, receives zero paid leave, and pays their own super.
                </p>
                <p>
                  The ATO applies strict guidelines to determine whether a worker is genuinely an independent contractor or a &quot;sham contractor&quot; who is actually an employee. Misclassification exposes the business to back-payment of superannuation, payroll tax, workers compensation, and penalties. Key factors the ATO examines include control over work methods, the ability to delegate, the provision of tools, and the right to work for multiple clients. See our <Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Calculator</Link> for a detailed comparison.
                </p>
                <div className="not-prose mt-6 mb-10 flex flex-wrap gap-3">
                  <Link href="/contractor-vs-employee-calculator/" className="inline-flex items-center px-4 py-2 border border-sandstone-dark/30 shadow-sm text-sm font-medium rounded-lg text-navy bg-white hover:bg-sandstone/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eucalyptus/20 transition-colors">
                    <Calculator className="mr-2 -ml-1 h-5 w-5 text-warmgray-light" aria-hidden="true" />
                    Read the Legal Contractor Guide
                  </Link>
                  <Link href="/redundancy-pay-calculator/" className="inline-flex items-center px-4 py-2 border border-sandstone-dark/30 shadow-sm text-sm font-medium rounded-lg text-navy bg-white hover:bg-sandstone/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-eucalyptus/20 transition-colors">
                    <Calculator className="mr-2 -ml-1 h-5 w-5 text-warmgray-light" aria-hidden="true" />
                    Calculate Redundancy Entitlements
                  </Link>
                </div>
              </section>

              {/* H2 #9 */}
              <section id="fy2025-26-changes">
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed in FY2025-26?</h2>
                <p>
                  The Superannuation Guarantee rate increased to <strong>12%</strong> on 1 July 2025, reaching its legislated ceiling after annual 0.5% increments since FY2021-22.
                </p>
                <p>
                  This final step in the SG rate schedule means the employer cost of superannuation increased from 11.5% in FY2024-25 to 12% in FY2025-26. For an employee earning $100,000, the annual super cost rose from $11,500 to <strong>$12,000</strong> &mdash; an additional $500 per employee per year. The maximum super contribution base for FY2025-26 is <strong>$65,070 per quarter</strong> ($260,280 annualised), up from $62,270 per quarter in FY2024-25.
                </p>

                <h3>SG Rate History</h3>
                <div className="not-prose overflow-x-auto my-6">
                  <table className="w-full text-sm border-collapse border border-sandstone-dark/20 rounded-lg">
                    <thead>
                      <tr className="bg-navy text-white">
                        <th className="px-4 py-3 text-left font-semibold">Financial Year</th>
                        <th className="px-4 py-3 text-right font-semibold">SG Rate</th>
                        <th className="px-4 py-3 text-right font-semibold">Cost on $100k Salary</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">FY2021-22</td>
                        <td className="px-4 py-2.5 text-right">10.0%</td>
                        <td className="px-4 py-2.5 text-right">$10,000</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                        <td className="px-4 py-2.5 font-medium text-navy">FY2022-23</td>
                        <td className="px-4 py-2.5 text-right">10.5%</td>
                        <td className="px-4 py-2.5 text-right">$10,500</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">FY2023-24</td>
                        <td className="px-4 py-2.5 text-right">11.0%</td>
                        <td className="px-4 py-2.5 text-right">$11,000</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-sandstone/30">
                        <td className="px-4 py-2.5 font-medium text-navy">FY2024-25</td>
                        <td className="px-4 py-2.5 text-right">11.5%</td>
                        <td className="px-4 py-2.5 text-right">$11,500</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-eucalyptus/10">
                        <td className="px-4 py-2.5 font-bold text-navy">FY2025-26</td>
                        <td className="px-4 py-2.5 text-right font-bold">12.0%</td>
                        <td className="px-4 py-2.5 text-right font-bold">$12,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  Other key changes affecting employer costs in FY2025-26 include revised income tax brackets under Stage 3 tax cuts (affecting PAYG withholding calculations), updated payroll tax thresholds in several states, and the continuation of the &quot;Medicare Levy Surcharge&quot; at 1% to 1.5% for employees without private hospital cover earning above $93,000. Use our <Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> for the current withholding schedule.
                </p>
              </section>

              {/* H2 #10 */}
              <section id="related-resources">
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
                <p>
                  The employer cost calculator is one component of a broader payroll and taxation toolkit. The following guides and calculators address related aspects of employment costs, employee entitlements, and Australian tax obligations.
                </p>
                <div className="not-prose grid sm:grid-cols-2 gap-4 my-6">
                  <Link href="/superannuation-guide/" className="group flex items-center justify-between p-4 rounded-xl bg-sandstone/50 border border-sandstone-dark/10 hover:border-eucalyptus/40 hover:bg-white hover:shadow-sm transition-all">
                    <div>
                      <span className="text-sm font-semibold text-navy group-hover:text-eucalyptus-dark block">Superannuation Guide</span>
                      <span className="text-xs text-warmgray">SG rates, contribution caps, and employer obligations for FY2025-26</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus flex-shrink-0" />
                  </Link>
                  <Link href="/contractor-vs-employee-calculator/" className="group flex items-center justify-between p-4 rounded-xl bg-sandstone/50 border border-sandstone-dark/10 hover:border-eucalyptus/40 hover:bg-white hover:shadow-sm transition-all">
                    <div>
                      <span className="text-sm font-semibold text-navy group-hover:text-eucalyptus-dark block">Contractor vs Employee Calculator</span>
                      <span className="text-xs text-warmgray">Compare the true cost of hiring a contractor versus a permanent employee</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus flex-shrink-0" />
                  </Link>
                  <Link href="/salary-sacrifice-guide/" className="group flex items-center justify-between p-4 rounded-xl bg-sandstone/50 border border-sandstone-dark/10 hover:border-eucalyptus/40 hover:bg-white hover:shadow-sm transition-all">
                    <div>
                      <span className="text-sm font-semibold text-navy group-hover:text-eucalyptus-dark block">Salary Sacrifice Guide</span>
                      <span className="text-xs text-warmgray">How salary packaging reduces fringe benefits tax and employer costs</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus flex-shrink-0" />
                  </Link>
                  <Link href="/redundancy-pay-calculator/" className="group flex items-center justify-between p-4 rounded-xl bg-sandstone/50 border border-sandstone-dark/10 hover:border-eucalyptus/40 hover:bg-white hover:shadow-sm transition-all">
                    <div>
                      <span className="text-sm font-semibold text-navy group-hover:text-eucalyptus-dark block">Redundancy Pay Calculator</span>
                      <span className="text-xs text-warmgray">Calculate NES redundancy pay entitlements based on years of service</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus flex-shrink-0" />
                  </Link>
                  <Link href="/annual-leave-guide/" className="group flex items-center justify-between p-4 rounded-xl bg-sandstone/50 border border-sandstone-dark/10 hover:border-eucalyptus/40 hover:bg-white hover:shadow-sm transition-all">
                    <div>
                      <span className="text-sm font-semibold text-navy group-hover:text-eucalyptus-dark block">Annual Leave Guide</span>
                      <span className="text-xs text-warmgray">Leave accrual rates, leave loading, and payout rules on termination</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus flex-shrink-0" />
                  </Link>
                  <Link href="/fringe-benefits-tax/" className="group flex items-center justify-between p-4 rounded-xl bg-sandstone/50 border border-sandstone-dark/10 hover:border-eucalyptus/40 hover:bg-white hover:shadow-sm transition-all">
                    <div>
                      <span className="text-sm font-semibold text-navy group-hover:text-eucalyptus-dark block">Fringe Benefits Tax Guide</span>
                      <span className="text-xs text-warmgray">FBT rates, reportable fringe benefits, and exempt benefits for employers</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus flex-shrink-0" />
                  </Link>
                </div>
              </section>

              {/* H2 #11 - FAQs (EXPANDED) */}
              <section id="faq">
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
                <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                  <AccordionItem value="multiplier" className="border border-sandstone-dark/20 rounded-xl px-4 bg-white shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-navy">How much does an employee actually cost an employer?</AccordionTrigger>
                    <AccordionContent className="text-warmgray">
                      The true cost is typically <strong>1.3x to 1.45x</strong> the base salary. For a $100,000 salary, the business spends between $130,000 and $145,000 once superannuation (12%), annual leave provisions (7.69%), workers compensation (0.3%&ndash;10%), and payroll tax (3.75%&ndash;6.85%) are included. Adding recruitment, training, and equipment costs pushes the multiplier toward 1.5x.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="prt-explain" className="border border-sandstone-dark/20 rounded-xl px-4 bg-white shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-navy">What is payroll tax and who pays it?</AccordionTrigger>
                    <AccordionContent className="text-warmgray">
                      Payroll tax is a state government tax levied on employers when their total wage bill exceeds a state-specific annual threshold. Rates range from <strong>4.00% in Tasmania to 6.85% in the ACT</strong>. It is paid by the employer, not deducted from the employee&apos;s pay. Sole traders and small businesses below the threshold pay zero payroll tax.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="super-rate" className="border border-sandstone-dark/20 rounded-xl px-4 bg-white shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-navy">What is the current superannuation rate for employers?</AccordionTrigger>
                    <AccordionContent className="text-warmgray">
                      The Superannuation Guarantee rate is <strong>12%</strong> for FY2025-26, effective from 1 July 2025. This is the legislated ceiling after five consecutive 0.5% annual increases from 10% in FY2021-22. Employers pay this on top of the employee&apos;s base salary as a contribution to their nominated super fund.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="fringe" className="border border-sandstone-dark/20 rounded-xl px-4 bg-white shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-navy">Do fringe benefits increase my employment cost?</AccordionTrigger>
                    <AccordionContent className="text-warmgray">
                      Yes. If you provide benefits like a company car, parking, or meal allowances, Fringe Benefits Tax (FBT) applies at 47%. The FBT is paid by the employer, not the employee, which can significantly increase the true cost. A $15,000 car benefit attracts roughly $7,050 in FBT, making the total cost of that perk over $22,000 to the business. See our <Link href="/salary-sacrifice-guide/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Guide</Link> for FBT-exempt alternatives.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="casual-cost" className="border border-sandstone-dark/20 rounded-xl px-4 bg-white shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-navy">Is a casual employee cheaper than a permanent one?</AccordionTrigger>
                    <AccordionContent className="text-warmgray">
                      Not per hour. Casual employees receive a <strong>25% loading</strong> on their base rate to compensate for no paid leave. They also attract super (12%), payroll tax, and WorkCover costs. The loading makes casuals more expensive per hour worked, but the flexibility of not paying for sick days, annual leave, or redundancy makes them cheaper for variable, seasonal, or project-based workloads.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="super-cap" className="border border-sandstone-dark/20 rounded-xl px-4 bg-white shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-navy">Is there a cap on how much super an employer pays?</AccordionTrigger>
                    <AccordionContent className="text-warmgray">
                      Yes. The maximum super contribution base for FY2025-26 is <strong>$65,070 per quarter</strong>, or $260,280 per year. Employers are not legally required to pay the 12% SG on earnings above this cap. For an employee earning $300,000, the employer&apos;s mandatory super contribution is capped at approximately <strong>$31,234</strong> per year rather than $36,000.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="small-biz-threshold" className="border border-sandstone-dark/20 rounded-xl px-4 bg-white shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-navy">Do small businesses pay payroll tax?</AccordionTrigger>
                    <AccordionContent className="text-warmgray">
                      Most small businesses do not. Payroll tax only applies when the total wage bill exceeds the state threshold. The lowest threshold is <strong>$900,000 in Victoria</strong>, and the highest is <strong>$2,000,000 in the ACT</strong>. A business with 8 employees averaging $100,000 each ($800,000 total wages) pays zero payroll tax in every state and territory.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="workcover-mandatory" className="border border-sandstone-dark/20 rounded-xl px-4 bg-white shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-navy">Is workers compensation insurance mandatory for all employers?</AccordionTrigger>
                    <AccordionContent className="text-warmgray">
                      Yes. Every employer in Australia must hold workers compensation insurance, regardless of business size or number of employees. Operating without coverage carries penalties including fines of up to <strong>$55,000</strong> in NSW and <strong>$218,088</strong> in Victoria, plus personal liability for all injury costs. Sole traders with no employees are the only exception in most states.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="leave-loading" className="border border-sandstone-dark/20 rounded-xl px-4 bg-white shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-navy">What is leave loading and does every employer pay it?</AccordionTrigger>
                    <AccordionContent className="text-warmgray">
                      Leave loading is an additional payment of <strong>17.5%</strong> on top of the employee&apos;s base pay rate during annual leave. It is not a universal entitlement under the National Employment Standards. Leave loading applies only when specified in the relevant modern award, enterprise agreement, or employment contract. Approximately 60% of Australian employees covered by awards receive leave loading.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="long-service" className="border border-sandstone-dark/20 rounded-xl px-4 bg-white shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-navy">How does long service leave affect employer costs?</AccordionTrigger>
                    <AccordionContent className="text-warmgray">
                      Long service leave accrues at approximately <strong>8.67 weeks after 10 years of continuous service</strong> in most states, equivalent to an annual provision of about 1.67% of the base salary. Employers must accrue this liability on their balance sheet from the employee&apos;s start date. For a $100,000 employee, this adds approximately <strong>$1,670 per year</strong> to the total employment cost.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="contractor-risk" className="border border-sandstone-dark/20 rounded-xl px-4 bg-white shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-navy">What happens if I misclassify an employee as a contractor?</AccordionTrigger>
                    <AccordionContent className="text-warmgray">
                      The ATO can reclassify the worker as an employee and issue back-payment orders for all unpaid superannuation (plus the SGC penalty), PAYG withholding, payroll tax, and workers compensation premiums for the entire engagement period. Penalties include the SGC administrative uplift of <strong>up to 60%</strong> of the shortfall and notional earnings, interest at the general interest charge rate compounded daily, a late payment penalty of <strong>25%</strong> that <strong>cannot be remitted</strong>, and potential prosecution for tax avoidance. Use our <Link href="/contractor-vs-employee-calculator/" className="text-eucalyptus-dark hover:underline">Contractor vs Employee Calculator</Link> to assess classification risk.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="reduce-cost" className="border border-sandstone-dark/20 rounded-xl px-4 bg-white shadow-sm">
                    <AccordionTrigger className="text-left font-semibold text-navy">How can employers reduce total employment costs legally?</AccordionTrigger>
                    <AccordionContent className="text-warmgray">
                      Employers reduce costs through 5 primary strategies: (1) offering salary sacrifice arrangements that provide tax-effective benefits at lower cost, (2) maintaining strong workplace safety records to earn WorkCover premium discounts of 10%&ndash;30%, (3) structuring the business to remain below the state payroll tax threshold, (4) using a mix of casual and part-time workers to minimise leave liability, and (5) investing in retention to reduce recruitment costs averaging $5,000&ndash;$15,000 per hire.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              <div className="mt-12 not-prose border-t border-sandstone-dark/20 pt-8">
                <MethodologyDisclosure title="How this calculator works">
                  <p>Employment cost estimates use the current 12% Superannuation Guarantee rate (effective 1 July 2025), state payroll tax thresholds from each state revenue office, and average WorkCover premium ranges by industry classification. Leave provisions assume 4 weeks annual leave under the National Employment Standards.</p>
                </MethodologyDisclosure>
                <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("employer-cost-calculator"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
              </div>
            </article>

          </div>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">

              <Card className="bg-navy border-none text-white shadow-xl overflow-hidden">
                <div className="h-2 w-full bg-gradient-to-r from-eucalyptus to-eucalyptus-dark"></div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <DollarSign className="h-7 w-7 text-eucalyptus" />
                    <h3 className="text-xl font-bold" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Reverse the Math</h3>
                  </div>
                  <p className="text-sandstone-dark/50 text-sm mb-6 leading-relaxed">
                    Now that you see the business cost, calculate what the employee actually takes home after the ATO takes its slice. The gap between Business Cost and Employee Take-Home usually spans 40%.
                  </p>
                  <Link href="/take-home-pay-calculator/" className="block w-full py-3 px-4 bg-eucalyptus-dark text-white font-semibold text-sm text-center rounded-lg hover:bg-eucalyptus shadow-md transition-all hover:shadow-lg">
                    Take-Home Pay Calculator
                  </Link>
                </CardContent>
              </Card>

              <Card className="bg-white border-sandstone-dark/20 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-4 flex items-center gap-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    Employer Toolset
                  </h3>
                  <div className="space-y-3">
                    <Link href="/payg-withholding-tables/" className="group flex items-center justify-between p-3.5 rounded-xl bg-sandstone/50 border border-sandstone-dark/10 hover:border-eucalyptus/40 hover:bg-white hover:shadow-sm transition-all">
                      <span className="text-sm font-semibold text-navy group-hover:text-eucalyptus-dark">PAYG Withholding Tables</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/superannuation-guide/" className="group flex items-center justify-between p-3.5 rounded-xl bg-sandstone/50 border border-sandstone-dark/10 hover:border-eucalyptus/40 hover:bg-white hover:shadow-sm transition-all">
                      <span className="text-sm font-semibold text-navy group-hover:text-eucalyptus-dark">12% Super Guarantee Rules</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, Calculator, DollarSign, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import FaqAccordion from "@/components/common/faq-accordion";
import { EMPLOYER_COST_FAQS, MULT_100K, TABLE_WORKCOVER, costRow, type CostRow, MAX_RATE_STATE, MAX_THRESHOLD_STATE, MIN_RATE_STATE, MIN_THRESHOLD_STATE } from "@/modules/guide/employer-cost-calculator-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, STATE_PAYROLL_TAX, SUPER_GUARANTEE, MEDICARE_LEVY, calculateSuper, calculatePayBreakdown, formatAUD, formatPercent } from "@/lib/constants";
import { calculatePayrollTax, employerOnCosts } from "@/lib/constants/payroll-tax"; // T2
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

// The employer cost calculator acts specifically as an interactive hub within a long-form guide.
// We embed a simple React state calculator here to fulfill the dual purpose.
const SOURCES_LIST: SourceLink[] = [
  { title: "Super for employers", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers", publisher: SOURCES.ato.name },
  { title: "Payroll tax", url: "https://business.gov.au/finance/tax/payroll-tax", publisher: "Business.gov.au" },
];

// Display order for the state-by-state payroll tax table (matches the previous hand-written order).
const PAYROLL_TABLE_ORDER = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"] as const;
// Structural notes not modelled in STATE_PAYROLL_TAX (surcharges/discounts, not the core rate or threshold).
const PAYROLL_TABLE_NOTE: Partial<Record<string, string>> = {
  // T2 (23 Sep 2026): corrected against the revenue offices. NSW has no
  // phase-out; VIC's two surcharges total 1% (2% above $100m); WA is a flat
  // 5.5% with a threshold that diminishes to nil at $7.5m.
  NSW: "No phase-out or surcharge",
  VIC: "Threshold phases out $3M–$5M; surcharges 1% above $10M",
  QLD: "4.95% above $6.5M; regional discount; mental health levy",
  WA: "Threshold diminishes to nil at $7.5M",
};

const COST_ROWS = [60_000, 80_000, 100_000, 130_000, 180_000].map((salary) => costRow(salary));
const MULT_100K_NO_PAYROLL = costRow(100_000, 0).total / 100_000;
// $50/hour employee: super plus paid annual (4/52) and personal (10/260) leave.
const HOURLY_ONCOST = 50 * (1 + SUPER_GUARANTEE.rate + 4 / 52 + 10 / 260);

export default function EmployerCostCalculatorPage() {
  const [baseSalary, setBaseSalary] = useState<number>(100000);
  const [payrollState, setPayrollState] = useState<string>("VIC");
  const [payrollTaxRate, setPayrollTaxRate] = useState<number>(Math.round(STATE_PAYROLL_TAX.VIC.rate * 10000) / 100);
  const [workcoverRate, setWorkcoverRate] = useState<number>(1.5); // Default average proxy

  // Inputs are clamped inside employerOnCosts (12% SG capped at the annual
  // maximum contribution base), so an empty/negative field can never show NaN.
  const { salary, superAmt, leaveProvision, payrollTaxAmt, workcoverAmt, trueCost, multiplier: costMultiplier } = employerOnCosts({
    baseSalary,
    payrollTaxPct: payrollTaxRate,
    workcoverPct: workcoverRate,
  });

  // Worked example in the "Total Cost of Employment" section below — a $95,000 Victorian marketing
  // manager. Payroll tax is sourced from STATE_PAYROLL_TAX so it can never drift from the verified rate.
  const WORKED_SALARY = 95_000;
  const WORKED_SUPER = calculateSuper(WORKED_SALARY);
  const WORKED_TAKE_HOME = calculatePayBreakdown({ grossSalary: WORKED_SALARY }).takeHomePay;
  const WORKED_ANNUAL_LEAVE = Math.round(WORKED_SALARY * (4 / 52));
  const WORKED_PERSONAL_LEAVE = Math.round(WORKED_SALARY * (10 / 260));
  const WORKED_PAYROLL_TAX = Math.round((WORKED_SALARY + WORKED_SUPER) * STATE_PAYROLL_TAX.VIC.rate);
  const WORKED_WORKCOVER = Math.round(WORKED_SALARY * 0.005);
  const WORKED_TOTAL = WORKED_SALARY + WORKED_SUPER + WORKED_ANNUAL_LEAVE + WORKED_PERSONAL_LEAVE + WORKED_PAYROLL_TAX + WORKED_WORKCOVER;
  const WORKED_MULTIPLIER = WORKED_TOTAL / WORKED_SALARY;


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
                      <select
                        aria-label="State or territory for payroll tax"
                        value={payrollState}
                        onChange={(e) => {
                          setPayrollState(e.target.value);
                          setPayrollTaxRate(Math.round(STATE_PAYROLL_TAX[e.target.value].rate * 10000) / 100);
                        }}
                        className="w-full rounded-lg border border-sandstone-dark/30 bg-white px-3 py-2 text-sm text-navy"
                      >
                        {PAYROLL_TABLE_ORDER.map((code) => (<option key={code} value={code}>{STATE_PAYROLL_TAX[code].name}</option>))}
                      </select>
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
                      <p className="text-xs text-warmgray-light leading-tight">{STATE_PAYROLL_TAX[payrollState].name} rate, payable only once total wages pass {formatAUD(STATE_PAYROLL_TAX[payrollState].threshold)}. Set 0 if you are under the threshold, or use the <Link href="/payroll-tax-calculator/" className="underline">payroll tax calculator</Link>.</p>
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
                      <span className="text-navy">${salary.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}</span>
                    </div>

                    <div className="flex justify-between items-center text-ochre">
                      <span className="flex items-center gap-1">Superannuation ({formatPercent(SUPER_GUARANTEE.rate, 0)}): <span className="text-xs bg-ochre/10 text-ochre px-1.5 py-0.5 rounded leading-none border border-ochre/20">Owed required</span></span>
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
                        <span className="text-xl font-bold text-eucalyptus-dark">{costMultiplier === null ? "—" : `${costMultiplier.toFixed(2)}x`}</span>
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
                  An employee on a $100,000 base salary costs an Australian employer about <strong>{formatAUD(MULT_100K * 100_000)}</strong> once super, leave provisions, payroll tax and a typical WorkCover premium are included, and more once recruitment, training and equipment are added.
                </p>
                <p>
                  On the assumptions in the table below, the multiplier is about <strong>{MULT_100K.toFixed(2)}x</strong> the base salary (about {MULT_100K_NO_PAYROLL.toFixed(2)}x for a business under the payroll tax threshold). This multiplier includes the Superannuation Guarantee at 12%, annual leave provisions at 7.69%, workers compensation insurance, and payroll tax for businesses above the state threshold. Employers who provide additional benefits such as salary-packaged novated leases, training budgets, or fringe benefits face an even higher true cost of employment.
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
                  <li><strong>Superannuation Guarantee (SG):</strong> 12% of qualifying earnings, paid with each pay since Payday Super began on 1 July 2026, and received by the fund within 7 business days</li>
                  <li><strong>Workers compensation insurance:</strong> 0.3% to 10%+ of wages depending on industry risk classification, covering workplace injury and illness</li>
                  <li><strong>Payroll tax:</strong> {formatPercent(MIN_RATE_STATE[1].rate, 2)} to {formatPercent(MAX_RATE_STATE[1].rate, 2)} of total wages (including super) for employers exceeding the state-specific threshold</li>
                  <li><strong>Leave provisions:</strong> Annual leave at 7.69% of base salary, personal leave at 3.85%, long service leave accrual at about 1.67% per year of service</li>
                </ul>
                <p>
                  Beyond these four legislated costs, employers also absorb recruitment, onboarding and equipment costs such as desk space, hardware and software licences, which vary widely by role.
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
                  The total cost of employment scales proportionally with salary, so the multiplier stays flat until salary passes the super maximum contribution base of {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}, where the SG stops rising.
                </p>
                <p>
                  The table below shows the employer cost breakdown for FY{SITE_CONFIG.financialYear} at five common salary levels, assuming a Victorian business above the payroll tax threshold ({formatPercent(STATE_PAYROLL_TAX.VIC.rate, 2)}) and a 1.5% workers compensation premium. Pick your own state in the calculator above. Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to see what the employee receives after income tax and Medicare levy.
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
                      {([
                        ["Base Salary", (r: CostRow) => r.salary],
                        [`Super (${formatPercent(SUPER_GUARANTEE.rate, 0)})`, (r: CostRow) => r.superAmt],
                        ["Leave Provision (7.69%)", (r: CostRow) => r.leave],
                        [`Payroll Tax (VIC ${formatPercent(STATE_PAYROLL_TAX.VIC.rate, 2)})`, (r: CostRow) => r.payroll],
                        [`WorkCover (${formatPercent(TABLE_WORKCOVER, 1)})`, (r: CostRow) => r.workcover],
                      ] as const).map(([label, pick], i) => (
                        <tr key={label} className={`border-b border-sandstone-dark/20 ${i % 2 === 1 ? "bg-sandstone/30" : ""}`}>
                          <td className="px-4 py-2.5 font-medium text-navy">{label}</td>
                          {COST_ROWS.map((r) => (<td key={r.salary} className="px-4 py-2.5 text-right">{formatAUD(pick(r))}</td>))}
                        </tr>
                      ))}
                      <tr className="bg-navy/5 font-bold">
                        <td className="px-4 py-3 text-navy">Total Employer Cost</td>
                        {COST_ROWS.map((r) => (<td key={r.salary} className="px-4 py-3 text-right text-navy">{formatAUD(r.total)}</td>))}
                      </tr>
                      <tr className="bg-eucalyptus/10 font-bold">
                        <td className="px-4 py-3 text-eucalyptus-dark">Multiplier</td>
                        {COST_ROWS.map((r) => (<td key={r.salary} className="px-4 py-3 text-right text-eucalyptus-dark">{(r.total / r.salary).toFixed(2)}x</td>))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  Businesses below their state&apos;s payroll tax threshold remove the payroll tax row entirely, which drops the multiplier to approximately <strong>{MULT_100K_NO_PAYROLL.toFixed(2)}x</strong>. From 1 July 2026 the super guarantee has an annual maximum contribution base of <strong>{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}</strong> (it was $62,500 per quarter until 30 June 2026), so employers with staff earning above it pay SG only up to the cap unless contractually obligated otherwise.
                </p>
              </section>

              {/* H2 #4 */}
              <section id="super-calculated-for-employers">
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Superannuation Calculated for Employers?</h2>
                <p>
                  Employers calculate superannuation at <strong>12% of each employee&apos;s qualifying earnings</strong> for FY{SITE_CONFIG.financialYear}, paid with each pay to the employee&apos;s nominated super fund.
                </p>
                <p>
                  Qualifying earnings are ordinary time earnings plus, from 1 July 2026, commissions for work done entirely outside ordinary hours. Ordinary time earnings include base salary, commissions, shift loadings, and allowances that relate to ordinary hours of work, and exclude overtime payments, reimbursements, and lump sum termination payments. The ATO defines the distinction under Superannuation Guarantee Ruling SGR 2009/2.
                </p>

                <h3>Payment Deadlines</h3>
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

                <h3>Payroll Tax Rates by State and Territory (FY{SITE_CONFIG.financialYear})</h3>
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
                      {PAYROLL_TABLE_ORDER.map((code, i) => {
                        const s = STATE_PAYROLL_TAX[code];
                        // Static notes are kept verbatim where still accurate; any note asserting a
                        // "highest/lowest" superlative is instead computed from the verified constant
                        // so it cannot go stale if thresholds/rates change again in future.
                        const isMaxThreshold = code === MAX_THRESHOLD_STATE[0];
                        const isMinThreshold = code === MIN_THRESHOLD_STATE[0];
                        const isMaxRate = code === MAX_RATE_STATE[0];
                        const isMinRate = code === MIN_RATE_STATE[0];
                        let note = PAYROLL_TABLE_NOTE[code] ?? s.note ?? "";
                        if (code === "SA") {
                          // Previously hardcoded as "Highest threshold in Australia" — no longer true
                          // now that NT's corrected $2.5m threshold exceeds SA's $1.5m.
                          note = isMaxThreshold ? "Highest threshold in Australia" : "Third-highest threshold in Australia";
                        } else if (code === "TAS") {
                          note = isMinRate ? "Lowest rate in Australia" : note;
                        } else if (code === "ACT") {
                          note = isMaxRate ? "Highest rate in Australia" : note;
                        } else if (code === "NT") {
                          note = isMaxThreshold ? "Highest threshold in Australia" : "Matches WA base rate";
                        } else if (isMinThreshold) {
                          note = `${note} (lowest threshold in Australia)`;
                        }
                        return (
                          <tr key={code} className={`border-b border-sandstone-dark/20 ${i % 2 === 1 ? "bg-sandstone/30" : ""}`}>
                            <td className="px-4 py-2.5 font-medium text-navy">{code}</td>
                            <td className="px-4 py-2.5 text-right">{formatAUD(s.threshold)}</td>
                            <td className="px-4 py-2.5 text-right font-semibold">{formatPercent(s.rate, 2)}</td>
                            <td className="px-4 py-2.5 text-warmgray">{note}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p>
                  A business with 20 employees averaging $90,000 each has a total wage bill of $1,800,000. In Victoria, this exceeds the {formatAUD(STATE_PAYROLL_TAX.VIC.threshold)} threshold by {formatAUD(1_800_000 - STATE_PAYROLL_TAX.VIC.threshold)}, generating a payroll tax liability of <strong>{formatAUD((1_800_000 - STATE_PAYROLL_TAX.VIC.threshold) * STATE_PAYROLL_TAX.VIC.rate)}</strong> ({(1_800_000 - STATE_PAYROLL_TAX.VIC.threshold).toLocaleString("en-AU")} x {formatPercent(STATE_PAYROLL_TAX.VIC.rate, 2)}). The same business operating in South Australia pays <strong>{formatAUD(calculatePayrollTax({ state: "sa", stateWages: 1_800_000 }).total)}</strong>: once wages pass {formatAUD(STATE_PAYROLL_TAX.SA.threshold)}, SA deducts a fixed $600,000 rather than the whole threshold, so the {formatPercent(STATE_PAYROLL_TAX.SA.rate, 2)} applies to $1,200,000. Compare every state on the <Link href="/payroll-tax-calculator/">payroll tax calculator</Link>.
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
                  A Melbourne-based marketing agency hiring a full-time marketing manager at {formatAUD(WORKED_SALARY)} per year faces a total employment cost of approximately <strong>{formatAUD(WORKED_TOTAL)}</strong> in FY{SITE_CONFIG.financialYear}.
                </p>
                <p>
                  The following step-by-step calculation uses real Victorian rates:
                </p>
                <ol>
                  <li><strong>Base salary:</strong> {formatAUD(WORKED_SALARY)}</li>
                  <li><strong>Superannuation (12% of qualifying earnings):</strong> {formatAUD(WORKED_SALARY)} x 0.12 = <strong>{formatAUD(WORKED_SUPER)}</strong></li>
                  <li><strong>Annual leave provision (4 weeks / 52 weeks):</strong> {formatAUD(WORKED_SALARY)} x 0.0769 = <strong>{formatAUD(WORKED_ANNUAL_LEAVE)}</strong></li>
                  <li><strong>Personal leave provision (10 days / 260 days):</strong> {formatAUD(WORKED_SALARY)} x 0.0385 = <strong>{formatAUD(WORKED_PERSONAL_LEAVE)}</strong></li>
                  <li><strong>Payroll tax (VIC: {formatPercent(STATE_PAYROLL_TAX.VIC.rate, 2)} on wages + super above {formatAUD(STATE_PAYROLL_TAX.VIC.threshold)} threshold):</strong> Assuming the business exceeds the threshold, ({formatAUD(WORKED_SALARY)} + {formatAUD(WORKED_SUPER)}) x {STATE_PAYROLL_TAX.VIC.rate} = <strong>{formatAUD(WORKED_PAYROLL_TAX)}</strong></li>
                  <li><strong>Workers compensation (professional services at 0.5%):</strong> {formatAUD(WORKED_SALARY)} x 0.005 = <strong>{formatAUD(WORKED_WORKCOVER)}</strong></li>
                </ol>
                <p>
                  Adding these components: {formatAUD(WORKED_SALARY)} + {formatAUD(WORKED_SUPER)} + {formatAUD(WORKED_ANNUAL_LEAVE)} + {formatAUD(WORKED_PERSONAL_LEAVE)} + {formatAUD(WORKED_PAYROLL_TAX)} + {formatAUD(WORKED_WORKCOVER)} = <strong>{formatAUD(WORKED_TOTAL)}</strong>. The cost multiplier for this role is <strong>{WORKED_MULTIPLIER.toFixed(2)}x</strong>. This excludes recruitment costs, training, equipment, and office space, which push the real total higher.
                </p>
                <p>
                  Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to see that the employee on this $95,000 salary takes home approximately <strong>{formatAUD(WORKED_TAKE_HOME)}</strong> in FY{SITE_CONFIG.financialYear} after income tax and the Medicare levy (no HECS-HELP debt). The gap between the employer&apos;s total cost of {formatAUD(WORKED_TOTAL)} and the employee&apos;s take-home pay is <strong>{formatAUD(WORKED_TOTAL - WORKED_TAKE_HOME)}</strong> &mdash; made up of income tax, Medicare levy, super, payroll tax, insurance and leave provisions.
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
                  If an employee is paid $50/hour, the cost to the business is about {formatAUD(HOURLY_ONCOST, 2)}/hour once super and paid annual and personal leave are counted, before payroll tax and WorkCover. A contractor charging a flat $65/hour on invoice can still work out cheaper when the work is irregular, because the business pays only for hours billed and the contractor provides their own insurance, leave and super.
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
              <section id="fy2026-27-changes">
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed in FY{SITE_CONFIG.financialYear}?</h2>
                <p>
                  The biggest change for employers on 1 July 2026 was <strong>Payday Super</strong>: SG is now due with every pay, must be received by the fund within 7 business days, is calculated on qualifying earnings, and is capped by an annual maximum contribution base of {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}. Late contributions attract a rebuilt, tax-deductible Superannuation Guarantee Charge. The SG rate itself stayed at <strong>12%</strong>, the legislated ceiling it reached on 1 July 2025.
                </p>
                <p>
                  That final step in the SG rate schedule lifted the employer cost of superannuation from 11.5% in FY2024-25 to 12% in FY2025-26. For an employee earning $100,000, the annual super cost rose from $11,500 to <strong>$12,000</strong>, where it stays in FY{SITE_CONFIG.financialYear}.
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
                      <tr className="border-b border-sandstone-dark/20">
                        <td className="px-4 py-2.5 font-medium text-navy">FY2025-26</td>
                        <td className="px-4 py-2.5 text-right">12.0%</td>
                        <td className="px-4 py-2.5 text-right">$12,000</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/20 bg-eucalyptus/10">
                        <td className="px-4 py-2.5 font-bold text-navy">FY2026-27</td>
                        <td className="px-4 py-2.5 text-right font-bold">12.0%</td>
                        <td className="px-4 py-2.5 text-right font-bold">$12,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p>
                  Other changes affecting employer costs from 1 July 2026 include new PAYG withholding schedules for the cut from 16% to 15% on income between $18,201 and $45,000, the ACT payroll tax threshold falling to {formatAUD(STATE_PAYROLL_TAX.ACT.threshold)}, and a higher Northern Territory rate for employers with Australia-wide wages of $100m or more. The Medicare Levy Surcharge threshold for singles is {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)} in FY{SITE_CONFIG.financialYear}. Use our <Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> for the current withholding schedule.
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
                      <span className="text-xs text-warmgray">SG rates, contribution caps, and employer obligations for FY{SITE_CONFIG.financialYear}</span>
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
                  <Link href="/salary-sacrifice-calculator/" className="group flex items-center justify-between p-4 rounded-xl bg-sandstone/50 border border-sandstone-dark/10 hover:border-eucalyptus/40 hover:bg-white hover:shadow-sm transition-all">
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
                <FaqAccordion faqs={EMPLOYER_COST_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border border-sandstone-dark/20 rounded-xl px-4 bg-white shadow-sm" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
              </section>

              <div className="mt-12 not-prose border-t border-sandstone-dark/20 pt-8">
                <MethodologyDisclosure title="How this calculator works">
                  <p>Employment cost estimates use the current 12% Superannuation Guarantee rate (effective 1 July 2025) capped at the annual maximum contribution base, state payroll tax rates and thresholds for FY{SITE_CONFIG.financialYear} from each state revenue office, and average WorkCover premium ranges by industry classification. Leave provisions assume 4 weeks annual leave under the National Employment Standards.</p>
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
                    Now that you see the business cost, calculate what the employee actually takes home after the ATO takes its slice.
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

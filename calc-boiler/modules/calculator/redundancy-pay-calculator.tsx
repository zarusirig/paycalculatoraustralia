"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  formatAUD,
  formatPercent,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function getRedundancyWeeks(years: number) {
  if (years < 1) return 0;
  if (years < 2) return 4;
  if (years < 3) return 6;
  if (years < 4) return 7;
  if (years < 5) return 8;
  if (years < 6) return 10;
  if (years < 7) return 11;
  if (years < 8) return 13;
  if (years < 9) return 14;
  if (years < 10) return 16;
  return 12; // 10+ years
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Redundancy pay and entitlements", url: "https://www.fairwork.gov.au/ending-employment/redundancy", publisher: SOURCES.fwc.name },
  { title: "Taxation of genuine redundancy", url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/leaving-your-job/genuine-redundancy-payments", publisher: SOURCES.ato.name },
];

export default function RedundancyPayCalculatorPage() {
  const [baseSalary, setBaseSalary] = useState(90_000);
  const [yearsService, setYearsService] = useState(5);

  const weeklyPay = baseSalary / 52;
  const entitlementWeeks = getRedundancyWeeks(yearsService);
  const grossRedundancy = weeklyPay * entitlementWeeks;

  // 2024-25 limits as stable placeholder reference for tax-free component
  const taxFreeBase = 12524;
  const taxFreePerYear = 6263;
  const taxFreeLimit = taxFreeBase + taxFreePerYear * yearsService;

  const actualTaxFree = Math.min(grossRedundancy, taxFreeLimit);
  const taxableETP = Math.max(0, grossRedundancy - actualTaxFree);

  // Standard ETP concessional rate under cap is usually 32% (incl Medicare)
  const etpTaxRate = 0.32;
  const estimatedTax = taxableETP * etpTaxRate;

  const netRedundancy = grossRedundancy - estimatedTax;

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Redundancy Pay Calculator</span></li>
            </ol>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Redundancy Pay Calculator Australia — Entitlements & Tax
          </h1>
          <p className="text-lg text-warmgray">
            Calculate your redundancy payout based on the National Employment Standards (NES).
            See your weeks of entitlement, the tax-free component, and your estimated actual payout.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-xl font-semibold text-navy mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Calculate Your Redundancy Pay</h2>

              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <div>
                    <label htmlFor="baseSalary" className="block text-sm font-medium text-gray-700 mb-1">Base Annual Salary</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="baseSalary" min={0} max={1000000} step={1000} value={baseSalary}
                        onChange={(e) => setBaseSalary(clamp(Number(e.target.value || 0), 0, 1000000))}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="yearsService" className="block text-sm font-medium text-gray-700 mb-1">Completed Years of Service</label>
                    <input type="number" id="yearsService" min={0} max={50} step={1} value={yearsService}
                        onChange={(e) => setYearsService(clamp(Number(e.target.value || 0), 0, 50))}
                        className="block w-24 rounded-md border-gray-300 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    <input type="range" min={0} max={25} step={1} value={clamp(yearsService, 0, 25)}
                      onChange={(e) => setYearsService(Number(e.target.value))} className="mt-4 w-full accent-eucalyptus" aria-hidden="true" />
                    <p className="text-xs text-warmgray-light mt-2">Only full years of continuous service are counted.</p>
                  </div>
                </form>

                {/* Results */}
                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Net Severance Payout</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">
                      {formatAUD(netRedundancy)}
                    </div>
                    <div className="text-sm text-warmgray mt-2">
                      Based on your entitlement of <strong>{entitlementWeeks} weeks</strong>.
                    </div>
                  </div>

                  {/* Breakdown Table */}
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wider">Tax & Component Breakdown</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Gross Redundancy Pay" value={formatAUD(grossRedundancy)} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label="Tax-Free Component" value={formatAUD(actualTaxFree)} green />
                      <Row label="Taxable Component (ETP)" value={formatAUD(taxableETP)} />
                      <Row label={`Est. Tax on ETP (${formatPercent(etpTaxRate, 0)})`} value={`-${formatAUD(estimatedTax)}`} />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Net Take-Home Payout" value={formatAUD(netRedundancy)} bold highlight />
                    </div>
                  </div>

                  {actualTaxFree >= taxFreeLimit && (
                    <div className="bg-sandstone border-l-4 border-ochre/70 p-4 text-xs text-gray-700">
                      <strong>Note:</strong> You have hit the ATO tax-free limit threshold for your years of service. Any additional payout is taxed.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* --- HOW IS REDUNDANCY PAY CALCULATED --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Redundancy Pay Calculated in Australia?</h2>
            <p className="mb-4 text-warmgray">
              Redundancy pay in Australia is calculated by multiplying your <strong>base weekly pay</strong> by the number of <strong>entitlement weeks</strong> set out in the National Employment Standards (NES). The base rate of pay is your ordinary hourly rate multiplied by your standard weekly hours, excluding overtime, bonuses, incentive payments, and allowances.
            </p>
            <p className="mb-4 text-warmgray">
              The formula is: <strong>Annual Base Salary / 52 x Entitlement Weeks = Gross Redundancy Pay</strong>. An employee earning $90,000 per year with 5 completed years of continuous service receives a base weekly rate of <strong>$1,730.77</strong>. The NES entitlement at 5 years is <strong>10 weeks</strong>, producing a gross redundancy payment of <strong>$17,307.69</strong>.
            </p>
            <p className="mb-4 text-warmgray">
              The Australian tax calculator applies the ATO tax-free limit to genuine redundancy payments, then taxes the remaining amount as an &quot;Employment Termination Payment&quot; (ETP) at the concessional rate of <strong>32%</strong> (including the Medicare levy). Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to estimate how your total assessable income, including the taxable ETP component, affects your marginal rate for the FY2025-26 financial year.
            </p>

            <h3 className="text-lg font-semibold text-gray-700 mb-2 mt-6">Worked Example: $90,000 Salary, 5 Years of Service</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 max-w-2xl mx-auto">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Step</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">Base weekly pay ($90,000 / 52)</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">$1,730.77</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">NES entitlement weeks (5 years)</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">10 weeks</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">Gross redundancy pay</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">$17,307.69</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">Tax-free limit ($12,524 + $6,263 x 5)</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">$43,839.00</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">Taxable ETP (gross minus tax-free)</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">$0.00</td>
                  </tr>
                  <tr className="bg-sandstone/50 hover:bg-sandstone border-t-2 border-sandstone-dark/20">
                    <td className="px-4 py-3 text-navy font-medium">Net redundancy payout</td>
                    <td className="px-4 py-3 text-right font-bold text-ochre">$17,307.69</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-warmgray-light max-w-2xl mx-auto">
              At this salary and service level, the entire gross payment falls within the ATO tax-free threshold, so the employee receives <strong>100%</strong> of the gross amount.
            </p>
          </section>

          {/* --- REDUNDANCY PAY TABLE --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Redundancy Pay Table by Years of Service?</h2>
            <p className="mb-4 text-warmgray">
              The NES redundancy pay table specifies the minimum number of weeks an employer pays based on completed years of continuous service, ranging from <strong>4 weeks</strong> at 1 year to a peak of <strong>16 weeks</strong> at 9 years. Small businesses with fewer than 15 employees at the time of dismissal are exempt from the NES redundancy pay obligation. Enterprise agreements, awards, and employment contracts override the NES minimum where they provide a higher entitlement.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 max-w-2xl mx-auto">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Period of Continuous Service</th>
                    <th className="px-4 py-3 text-right font-semibold text-gray-700">Redundancy Pay (Weeks)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">Less than 1 year</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">Nil</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">1 year, but less than 2 years</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">4 weeks</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">2 years, but less than 3 years</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">6 weeks</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">3 years, but less than 4 years</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">7 weeks</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">4 years, but less than 5 years</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">8 weeks</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">5 years, but less than 6 years</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">10 weeks</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">6 years, but less than 7 years</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">11 weeks</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">7 years, but less than 8 years</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">13 weeks</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">8 years, but less than 9 years</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">14 weeks</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy">9 years, but less than 10 years</td>
                    <td className="px-4 py-3 text-right font-medium text-warmgray">16 weeks</td>
                  </tr>
                  <tr className="bg-sandstone/50 hover:bg-sandstone border-t-2 border-sandstone-dark/20">
                    <td className="px-4 py-3 text-navy font-medium">10 years and over</td>
                    <td className="px-4 py-3 text-right font-bold text-ochre">12 weeks*</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-warmgray-light max-w-2xl mx-auto">
              * The entitlement drops from 16 to 12 weeks at the 10-year mark because long service leave entitlements generally kick in to act as a financial buffer.
            </p>
          </section>

          {/* --- WHO USES THIS CALCULATOR --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Uses This Redundancy Pay Calculator?</h2>
            <p className="mb-4 text-warmgray">
              This Australian redundancy pay calculator serves employees, employers, HR professionals, accountants, and financial advisors who need to estimate termination entitlements under the NES.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray mb-4">
              <li><strong>Employees facing redundancy</strong> who want to verify their employer&apos;s payout figure before signing a deed of release</li>
              <li><strong>HR managers and payroll officers</strong> calculating severance obligations for workforce restructures, office closures, or role elimination</li>
              <li><strong>Accountants and tax agents</strong> estimating the tax-free component versus the taxable ETP portion for client reporting</li>
              <li><strong>Financial planners</strong> modelling a client&apos;s take-home pay and cash flow after termination</li>
              <li><strong>Small business owners</strong> determining whether the 15-employee exemption applies to their redundancy obligation</li>
            </ul>
            <p className="text-warmgray">
              Employees who receive a redundancy payout also need to calculate the income tax impact on their overall assessable income. Use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to estimate your salary after tax for any period of re-employment within the same financial year.
            </p>
          </section>

          {/* --- HOW IS REDUNDANCY PAY TAXED --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Is Redundancy Pay Taxed in Australia?</h2>
            <p className="mb-4 text-warmgray">
              Redundancy pay taxation depends entirely on whether the ATO classifies the payment as a <strong>&quot;genuine redundancy&quot;</strong> or a <strong>&quot;non-genuine redundancy.&quot;</strong> A genuine redundancy receives a tax-free component; a non-genuine redundancy is taxed in full at your marginal rate within the standard income tax brackets.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border text-warmgray border-sandstone-dark/20 rounded-xl p-5 shadow-sm border-t-4 border-t-green-500">
                <h3 className="font-semibold text-navy mb-2">Genuine Redundancy</h3>
                <p className="text-sm mb-3">A redundancy is &quot;genuine&quot; when:</p>
                <ul className="space-y-1 text-sm pl-4 list-disc marker:text-green-500">
                  <li>Your employer no longer needs your job to be done by anyone at all (e.g., due to automation, restructuring, or bankruptcy).</li>
                  <li>The employer followed any consultation requirements in the award or enterprise agreement.</li>
                  <li>The employee is under age 65 (the &quot;Pension Age&quot; threshold) at the time of dismissal.</li>
                </ul>
                <p className="text-sm mt-3 font-medium text-eucalyptus-dark">Eligible for the tax-free component.</p>
              </div>
              <div className="bg-white border text-warmgray border-sandstone-dark/20 rounded-xl p-5 shadow-sm border-t-4 border-t-red-400">
                <h3 className="font-semibold text-navy mb-2">Non-Genuine Redundancy</h3>
                <p className="text-sm mb-3">It is not considered a genuine redundancy if:</p>
                <ul className="space-y-1 text-sm pl-4 list-disc marker:text-red-400">
                  <li>You were dismissed for performance or misconduct.</li>
                  <li>You resigned voluntarily without an offer.</li>
                  <li>Your employer hires someone else to do your exact job reasonably soon after.</li>
                  <li>You are an employee of a small business (fewer than 15 employees).</li>
                </ul>
                <p className="text-sm mt-3 font-medium text-ochre">Taxed at normal marginal rates as an ETP with no tax-free component.</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-700 mb-2">Tax-Free Component for Genuine Redundancy</h3>
            <p className="mb-3 text-warmgray">
              The ATO sets a tax-free limit each financial year comprising a <strong>base amount</strong> plus a <strong>per-year-of-service amount</strong>. For the 2024-25 income year, the base amount is <strong>$12,524</strong> and the per-completed-year amount is <strong>$6,263</strong>. An employee with 8 completed years receives a tax-free limit of $12,524 + ($6,263 x 8) = <strong>$62,628</strong>. Any redundancy amount below this threshold incurs zero tax.
            </p>

            <h3 className="text-lg font-semibold text-gray-700 mb-2 mt-5">ETP Tax Rates on the Taxable Portion</h3>
            <p className="mb-3 text-warmgray">
              Any amount above the tax-free limit is treated as an &quot;Employment Termination Payment&quot; (ETP). ETPs are subject to caps and concessional tax rates. For employees below preservation age, the concessional rate is <strong>32%</strong> (including the 2% Medicare levy surcharge). For employees at or above preservation age, the first <strong>$235,000</strong> (2024-25 ETP cap) is taxed at <strong>17%</strong> (including Medicare). Amounts exceeding the ETP cap are taxed at the top marginal rate of <strong>47%</strong>. Use the <Link href="/bonus-tax-calculator/" className="text-eucalyptus-dark hover:underline">Bonus Tax Calculator</Link> to estimate withholding on other lump-sum payments received in the same income year.
            </p>
          </section>

          {/* --- WHAT OTHER ENTITLEMENTS --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Other Entitlements Apply on Termination?</h2>
            <p className="mb-4 text-warmgray">
              Redundancy pay is one of several entitlements an employer owes on termination. The total final payout typically includes <strong>5 separate components</strong>, each taxed under different rules and calculated independently.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 max-w-3xl mx-auto">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Entitlement</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Calculation Basis</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Tax Treatment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Redundancy pay</td>
                    <td className="px-4 py-3 text-warmgray">NES weeks x base weekly pay</td>
                    <td className="px-4 py-3 text-warmgray">Tax-free component + ETP rate on excess</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Notice period (or payment in lieu)</td>
                    <td className="px-4 py-3 text-warmgray">1-5 weeks depending on service &amp; age</td>
                    <td className="px-4 py-3 text-warmgray">Taxed at marginal rate as ordinary income</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Accrued annual leave</td>
                    <td className="px-4 py-3 text-warmgray">Unused hours x hourly rate</td>
                    <td className="px-4 py-3 text-warmgray">Marginal rate (capped at 32% if pre-1993 accrued)</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Long service leave</td>
                    <td className="px-4 py-3 text-warmgray">State-specific (typically 8.67 weeks per 10 years)</td>
                    <td className="px-4 py-3 text-warmgray">Marginal rate (concessional for pre-16 Aug 1978)</td>
                  </tr>
                  <tr className="hover:bg-sandstone/50">
                    <td className="px-4 py-3 text-navy font-medium">Superannuation on final pay</td>
                    <td className="px-4 py-3 text-warmgray">12% SG rate on ordinary time earnings</td>
                    <td className="px-4 py-3 text-warmgray">15% contributions tax in the super fund</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-warmgray">
              The <Link href="/leave-calculator/" className="text-eucalyptus-dark hover:underline">Leave Calculator</Link> estimates the payout value of your accrued annual leave and long service leave balances. Employers must also continue superannuation contributions on ordinary time earnings during the notice period &mdash; use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to check your employer&apos;s SG rate obligations for FY2025-26.
            </p>
          </section>

          {/* --- COMMON MISTAKES --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Most Common Redundancy Pay Mistakes?</h2>
            <p className="mb-4 text-warmgray">
              Employees and employers make <strong>5 recurring errors</strong> when calculating redundancy pay in Australia. Each mistake results in an incorrect payout, underpaid tax, or lost entitlements.
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-warmgray">
              <li><strong>Using total salary instead of base rate of pay.</strong> Redundancy is calculated on the base rate only. Overtime loadings, allowances, bonuses, and incentive payments are excluded from the weekly pay figure.</li>
              <li><strong>Counting partial years of service.</strong> The NES counts only <strong>completed full years</strong> of continuous service. An employee with 4 years and 11 months receives the 4-year entitlement (8 weeks), not the 5-year entitlement (10 weeks).</li>
              <li><strong>Forgetting the small business exemption.</strong> Employers with fewer than <strong>15 employees</strong> at the time of dismissal are not required to pay NES redundancy. The headcount includes all employees across the business, not just one location.</li>
              <li><strong>Conflating notice pay with redundancy pay.</strong> Notice pay (1-5 weeks) and redundancy pay are separate legal entitlements that stack. They are also taxed differently: notice pay is ordinary income at your marginal rate, while genuine redundancy pay receives a tax-free component.</li>
              <li><strong>Assuming the entire payout is tax-free.</strong> The tax-free component only applies to the amount up to the ATO limit. High-salary employees with short service periods frequently exceed the tax-free threshold, creating a taxable ETP component at 32% or higher.</li>
            </ol>
          </section>

          {/* --- CONTEXT BORDER --- */}

{/* Merged from /redundancy-pay-calculator/ on 2026-08-28 — the guide 301s here (GSC: same query network, split ranking). */}
                      {/* SECTION 3 */}
            <section id="genuine-vs-nongenuine">
              <h2>What Is Genuine vs Non-Genuine Redundancy?</h2>
              <p>
                A &quot;Genuine Redundancy&quot; is a termination where the employer <strong>no longer requires the job to be performed by anyone</strong> and has complied with all consultation obligations in the applicable modern award or enterprise agreement. The distinction between genuine and non-genuine redundancy determines whether the tax-free component applies to the severance payment.
              </p>

              <div className="grid md:grid-cols-2 gap-4 not-prose my-6 text-sm">
                <div className="bg-eucalyptus-light/30 border border-sandstone-dark/20 rounded-lg p-5">
                  <h4 className="font-bold text-eucalyptus-dark mb-2 flex items-center gap-2">
                    Genuine Redundancy
                  </h4>
                  <ul className="space-y-1 text-eucalyptus-dark list-disc list-inside">
                    <li>The employer&apos;s business undergoes major operational changes (like adopting AI, merging with a rival, or going bankrupt).</li>
                    <li>The job you were doing simply does not need to be done by <em>anyone</em> anymore.</li>
                    <li>The employer followed all legal consultation requirements before pulling the trigger.</li>
                  </ul>
                </div>
                <div className="bg-sandstone border border-sandstone-dark/20 rounded-lg p-5">
                  <h4 className="font-bold text-ochre mb-2 flex items-center gap-2">
                    Non-Genuine Redundancy
                  </h4>
                  <ul className="space-y-1 text-ochre list-disc list-inside">
                    <li>You were fired for poor performance or gross misconduct.</li>
                    <li>They let you go, but immediately hired someone else to sit in your exact chair and do your exact job (this is grounds for Unfair Dismissal).</li>
                    <li>They could have redeployed you to a different department but chose not to.</li>
                  </ul>
                </div>
              </div>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Feature</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Genuine Redundancy</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Non-Genuine Redundancy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-3 font-medium">Tax-free component</td><td className="px-6 py-3">Yes &mdash; up to ATO limit</td><td className="px-6 py-3">No &mdash; fully taxable as ETP</td></tr>
                      <tr><td className="px-6 py-3 font-medium">Job still exists?</td><td className="px-6 py-3">No &mdash; role permanently eliminated</td><td className="px-6 py-3">Yes &mdash; someone else performs the role</td></tr>
                      <tr><td className="px-6 py-3 font-medium">Consultation required?</td><td className="px-6 py-3">Yes &mdash; per award/agreement</td><td className="px-6 py-3">Not met or not applicable</td></tr>
                      <tr><td className="px-6 py-3 font-medium">Redeployment attempted?</td><td className="px-6 py-3">Yes &mdash; reasonable efforts made</td><td className="px-6 py-3">No &mdash; employer skipped this step</td></tr>
                      <tr><td className="px-6 py-3 font-medium">Unfair dismissal claim?</td><td className="px-6 py-3">Generally not available</td><td className="px-6 py-3">Available &mdash; lodge within 21 days</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>
                The ATO independently assesses whether a redundancy qualifies as genuine at tax time. An employer labelling a termination &quot;redundancy&quot; on the separation certificate does not guarantee genuine status. The employee must also be under age 65 at the time of dismissal to access the tax-free component. Employees over preservation age who receive a non-genuine redundancy have the entire payment taxed as an Employment Termination Payment at marginal or concessional ETP rates.
              </p>
            </section>
            {/* SECTION 4 */}
            <section id="step-by-step-redundancy">
              <h2>Step-by-Step: What Happens When You Are Made Redundant?</h2>
              <p>
                The redundancy process follows a <strong>legally mandated sequence</strong> under the Fair Work Act 2009 and applicable modern awards. Employers who skip steps expose themselves to unfair dismissal claims, penalties, and orders for compensation.
              </p>
              <ol>
                <li><strong>Consultation notice:</strong> The employer notifies affected employees and any union representatives that redundancies are being considered. The applicable award or enterprise agreement specifies minimum consultation periods, typically <strong>7&ndash;14 days</strong>.</li>
                <li><strong>Redeployment assessment:</strong> The employer assesses whether the employee can be redeployed to a suitable alternative position within the business or any associated entity. Failure to undertake this step converts a genuine redundancy into a non-genuine one.</li>
                <li><strong>Written notice of termination:</strong> The employer provides formal written notice. The minimum notice period is <strong>1 week</strong> for employees with less than 1 year of service, <strong>2 weeks</strong> for 1&ndash;3 years, <strong>3 weeks</strong> for 3&ndash;5 years, and <strong>4 weeks</strong> for 5+ years. Employees over 45 with at least 2 years of service receive an additional week.</li>
                <li><strong>Final pay calculation:</strong> The employer calculates all entitlements: redundancy pay (NES weeks), notice pay (or payment in lieu), accrued annual leave, accrued long service leave, and any outstanding wages or loadings.</li>
                <li><strong>Payment and separation certificate:</strong> Final payments must be made on or before the employee&apos;s last working day, or no later than <strong>7 days after termination</strong>. The employer issues a separation certificate and PAYG payment summary reflecting the tax-free component (if genuine) and any ETP amounts.</li>
                <li><strong>Centrelink waiting period:</strong> The employee may apply for JobSeeker Payment, but redundancy pay and leave payouts generate an &quot;Income Maintenance Period&quot; that delays eligibility by the number of weeks covered by the payout. Check our <Link href="/centrelink-income-test/">Centrelink Income Test</Link> guide for threshold details.</li>
              </ol>
            </section>
            {/* SECTION 6 */}
            <section id="etp-tax">
              <h2>What Are Employment Termination Payments (ETPs)?</h2>
              <p>
                An Employment Termination Payment is <strong>any lump sum paid to an employee because their employment ends</strong>, excluding the genuine redundancy tax-free component, accrued leave, and superannuation. ETPs include golden handshakes, gratuities, non-genuine redundancy payments, and any genuine redundancy amount that exceeds the ATO&apos;s tax-free limit.
              </p>
              <p>
                The ATO classifies ETPs into two types. A &quot;Life Benefit ETP&quot; is paid directly to the employee while alive. A &quot;Death Benefit ETP&quot; is paid to a dependant or the estate of a deceased employee. The tax treatment differs significantly between the two, and within life benefit ETPs, the rate varies based on whether the employee has reached preservation age.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Employee Age</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">ETP Tax Rate (up to cap)</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Above ETP Cap</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-3">Below preservation age</td><td className="px-6 py-3 font-semibold">32% (including Medicare levy)</td><td className="px-6 py-3">Top marginal rate (47%)</td></tr>
                      <tr><td className="px-6 py-3">At or above preservation age</td><td className="px-6 py-3 font-semibold">17% (including Medicare levy)</td><td className="px-6 py-3">Top marginal rate (47%)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>
                The ETP cap for FY2025-26 is <strong>$245,000</strong>. Any ETP amount exceeding this cap is taxed at the top marginal rate of <strong>47%</strong> (including Medicare levy). The whole-of-income cap also applies &mdash; if your total taxable income plus ETP exceeds <strong>$180,000</strong>, the portion above that threshold is taxed at 47%. Understanding these thresholds is critical for executives and long-tenured employees with large separation packages.
              </p>
            </section>
            {/* SECTION 8 */}
            <section id="small-business-exemptions">
              <h2>Are Small Businesses Exempt from Redundancy Pay?</h2>
              <p>
                Small businesses with <strong>fewer than 15 employees</strong> at the time of termination are fully exempt from paying NES redundancy pay. This exemption is absolute &mdash; the employer pays zero weeks of severance regardless of how long the employee worked there.
              </p>

              <div className="bg-sandstone border border-sandstone-dark/20 p-6 rounded-xl not-prose my-6 text-sm">
                <div className="flex items-start gap-4">
                  <ShieldAlert className="h-6 w-6 text-warmgray mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Small Business Exemption</h3>
                    <p className="text-navy">If your employer is a &quot;Small Business&quot; (fewer than 15 total employees across the whole company), they are legally exempt from having to pay you any statutory redundancy pay at all under the base NES. Always verify headcount.</p>
                  </div>
                </div>
              </div>

              <p>
                The 15-employee threshold counts all employees including casual employees engaged on a regular and systematic basis. It includes employees across all locations, branches, and associated entities. Part-time employees count as one full headcount, not a fraction. The headcount is assessed at the exact time the termination notice is given, not at the start of employment or any earlier date.
              </p>
              <p>
                Even when the small business exemption applies, the employer still owes notice pay, accrued annual leave, accrued long service leave, and outstanding wages. Only the redundancy pay (severance weeks) component is exempt. Employees of small businesses who believe the headcount was artificially reduced to trigger the exemption can challenge the decision through the Fair Work Commission.
              </p>
              <p>
                Some enterprise agreements and employment contracts override the small business exemption by including redundancy clauses that apply regardless of employer size. Always check the specific terms of your agreement.
              </p>
            </section>
            {/* SECTION 9 */}
            <section id="state-long-service-leave">
              <h2>How Does Long Service Leave on Redundancy Vary by State?</h2>
              <p>
                Long service leave entitlements on redundancy are governed by <strong>state and territory legislation</strong>, not the NES. Each jurisdiction sets different qualifying periods, accrual rates, and pro-rata access rules for employees terminated by redundancy.
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">State/Territory</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Full Entitlement</th>
                        <th className="px-6 py-4 border-b border-sandstone-dark/20">Pro-Rata on Redundancy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-3 font-medium">NSW</td><td className="px-6 py-3">2 months after 10 years</td><td className="px-6 py-3">Available after 5 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">VIC</td><td className="px-6 py-3">8.67 weeks after 10 years</td><td className="px-6 py-3">Available after 7 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">QLD</td><td className="px-6 py-3">8.67 weeks after 10 years</td><td className="px-6 py-3">Available after 7 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">SA</td><td className="px-6 py-3">13 weeks after 10 years</td><td className="px-6 py-3">Available after 7 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">WA</td><td className="px-6 py-3">8.67 weeks after 10 years</td><td className="px-6 py-3">Available after 7 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">TAS</td><td className="px-6 py-3">8.67 weeks after 10 years</td><td className="px-6 py-3">Available after 7 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">NT</td><td className="px-6 py-3">13 weeks after 10 years</td><td className="px-6 py-3">Available after 7 years</td></tr>
                      <tr><td className="px-6 py-3 font-medium">ACT</td><td className="px-6 py-3">6.07 weeks after 7 years</td><td className="px-6 py-3">Available after 5 years</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>
                In NSW, employees terminated by redundancy after <strong>5 years</strong> of continuous service receive a pro-rata long service leave payout, the most accessible threshold in Australia. South Australia and the Northern Territory provide the most generous full entitlement at <strong>13 weeks after 10 years</strong>. Victoria, Queensland, Western Australia, and Tasmania share the standard <strong>8.67 weeks after 10 years</strong> with pro-rata access after 7 years on redundancy.
              </p>
              <p>
                Long service leave payouts on redundancy are taxed differently depending on when the leave was accrued. Leave accrued before <strong>16 August 1978</strong> is entirely tax-free. Leave accrued between 16 August 1978 and 17 August 1993 is taxed at a flat <strong>32%</strong>. Leave accrued after 17 August 1993 is taxed at the employee&apos;s marginal rate.
              </p>
            </section>

                    {/* --- RELATED CALCULATORS --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Related Calculators Help After Redundancy?</h2>
            <p className="mb-4 text-warmgray">
              A redundancy event triggers multiple financial calculations beyond the severance payout itself. These <strong>5 Australian tax calculators</strong> cover the most common post-redundancy scenarios.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray">
              <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> &mdash; estimate your net salary after tax when you start a new job, factoring in the income already earned at your previous employer within the same financial year.</li>
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> &mdash; calculate your total income tax liability for FY2025-26, including the taxable ETP component from your redundancy payment in your assessable income.</li>
              <li><Link href="/leave-calculator/" className="text-eucalyptus-dark hover:underline">Leave Calculator</Link> &mdash; determine the dollar value of accrued annual leave and long service leave that your employer owes on termination.</li>
              <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> &mdash; verify whether your employer contributed the correct 12% SG rate on your ordinary time earnings through to your final day of employment.</li>
              <li><Link href="/tax-return-calculator/" className="text-eucalyptus-dark hover:underline">Tax Return Calculator</Link> &mdash; estimate your tax refund or liability at end of year if you were made redundant part-way through the 2025-26 financial year and had varying withholding amounts.</li>
            </ul>
          </section>

          <MethodologyDisclosure>
            <p className="mb-2 text-sm">Calculations are estimates based on the following:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Assumes minimum NES entitlements applied to standard weekly earnings (Base / 52).</li>
              <li>Does not include unused annual leave or long service leave payouts (which are taxed separately).</li>
              <li>Uses historical/estimated ATO tax-free threshold limits to demonstrate the tax boundary.</li>
              <li>Applies a flat estimated ETP withholding rate of 32% on the taxable portion. Actual withholding by your employer may vary based on your age (preservation age) and total income caps.</li>
            </ul>
          </MethodologyDisclosure>

          {/* --- EXPANDED FAQs --- */}
          <section>
            <h2 className="text-2xl font-semibold text-navy mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="amount" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How much redundancy pay am I entitled to?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Under the National Employment Standards (NES), redundancy pay ranges from <strong>4 weeks</strong> for 1 completed year of service up to <strong>16 weeks</strong> for 9 completed years. The entitlement drops to <strong>12 weeks</strong> after 10 years because long service leave entitlements provide an additional financial buffer. Employees with less than 1 year of continuous service receive no redundancy pay under the NES.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="taxfree" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Is redundancy pay tax-free?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">A portion of a genuine redundancy payment is tax-free. The ATO limit comprises a base amount of <strong>$12,524</strong> plus <strong>$6,263</strong> for each completed year of service (2024-25 rates). Any amount above this limit is taxed as an Employment Termination Payment (ETP) at a concessional rate of <strong>32%</strong> (including the Medicare levy) for employees below preservation age.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="genuine" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>What makes a redundancy &quot;genuine&quot;?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">A redundancy is genuine when the employer no longer needs the job to be done by anyone, the employer complied with consultation requirements in the applicable award or enterprise agreement, and the employee is under age 65. Dismissals for performance, voluntary resignations, and situations where the employer rehires for the same role are classified as non-genuine.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="notice" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Is notice pay included in my redundancy payout?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">No. Notice pay and redundancy pay are two completely separate legal entitlements that stack on top of each other. Your employer must give you <strong>1-5 weeks</strong> of notice (or pay in lieu), depending on your length of service and age. Notice pay is taxed as regular income at your normal marginal rate. The tax-free treatment only applies to the genuine redundancy component.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="leave-payout" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do I get paid out unused annual leave on redundancy?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. On top of redundancy pay and notice pay, your employer must pay out all accrued but untaken annual leave and long service leave. These are separate entitlements with separate tax treatment. Unused annual leave accumulated since 1993 is taxed at your marginal rate. Use our <Link href="/leave-calculator/" className="text-eucalyptus-dark hover:underline">Leave Calculator</Link> to estimate the payout value of your accrued leave balance.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="small-business" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do small businesses have to pay redundancy?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">No. Employers with fewer than <strong>15 employees</strong> at the time of dismissal are exempt from paying NES redundancy. The headcount includes all employees across all locations of the business, including casual employees engaged on a regular and systematic basis. However, a small business employer must still pay out notice, accrued annual leave, and any long service leave owed under state legislation.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="super-on-redundancy" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Is superannuation paid on redundancy pay?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">No. Employers do not pay the <strong>12% superannuation guarantee</strong> on redundancy payments, payment in lieu of notice, or unused leave payouts. The SG rate applies only to ordinary time earnings. Superannuation contributions stop on the employee&apos;s last day of employment. Use the <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to verify contributions up to your termination date.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="negotiate" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Can I negotiate a higher redundancy payout than the NES minimum?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. The NES sets the <strong>minimum floor</strong>, not a ceiling. Many enterprise agreements, industry awards, and individual employment contracts provide for higher redundancy pay &mdash; commonly <strong>3-4 weeks per year of service</strong> in sectors such as banking, mining, and the public service. Employees can also negotiate an ex-gratia payment as part of a deed of release, though amounts above the genuine redundancy tax-free limit are taxed as an ETP.</p></AccordionContent>
              </AccordionItem>
                          <AccordionItem value="what-is" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is a genuine redundancy in Australia?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    A genuine redundancy occurs when the employer no longer needs the job to be done by anyone, usually due to restructuring, downsizing, or technology changes, and the employer has complied with all consultation obligations in the applicable modern award or enterprise agreement. The employee must also be under 65 years old at dismissal.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="tax-free" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is my redundancy payout completely tax-free?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. The tax-free component is strictly capped at <strong>$12,524 plus $6,263 for each completed year of service</strong> in FY2025-26. Any amount exceeding this limit is taxed as an Employment Termination Payment, typically at <strong>32%</strong> for employees below preservation age or <strong>17%</strong> for those at or above preservation age.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="small" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Are small businesses exempt from redundancy pay?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Under the Fair Work Act, a business employing fewer than <strong>15 total employees</strong> at the time of the termination notice is exempt from paying statutory NES redundancy pay. The employer still owes notice pay, accrued annual leave, long service leave, and outstanding wages. Enterprise agreements may override this exemption.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="unfair" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What if my redundancy isn&apos;t genuine?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    If your employer makes your role &quot;redundant&quot; but immediately hires someone else to do the same job, it may be a case of <strong>unfair dismissal</strong>. You can lodge a complaint with the Fair Work Commission within <strong>21 days</strong> of being terminated. If the Commission finds the dismissal was not genuine, you may be entitled to reinstatement or compensation &mdash; potentially much more than the standard NES redundancy entitlement.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="unused-leave" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I get paid out my unused leave when made redundant?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. On top of redundancy pay and notice pay, the employer must pay out all accrued but untaken annual leave including <strong>17.5% leave loading</strong> under most awards. Accrued long service leave is also payable if the employee meets the state-specific qualifying period, which is typically <strong>5&ndash;7 years</strong> on redundancy depending on the state.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="notice-vs-redundancy" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is notice pay the same as redundancy pay?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. Notice pay and redundancy pay are two entirely separate legal entitlements that stack on top of each other. Notice pay compensates for the minimum notice period (<strong>1&ndash;5 weeks</strong> depending on service and age) and is taxed as ordinary income at the employee&apos;s marginal PAYG rate. Redundancy pay compensates for the loss of the position (<strong>4&ndash;16 weeks</strong>) and the genuine component receives tax-free treatment up to the ATO limit.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="centrelink" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does redundancy pay affect my Centrelink payments?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Redundancy pay, notice pay, and leave payouts generate an &quot;Income Maintenance Period&quot; that delays JobSeeker Payment eligibility. The waiting period equals the number of weeks of pay received, calculated by dividing the total gross payout by the employee&apos;s weekly base rate. A <strong>$50,000 payout</strong> at a $1,500/week rate generates a waiting period of approximately <strong>33 weeks</strong>.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="preservation-age" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is preservation age and how does it affect redundancy tax?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Preservation age is the age at which you can access your superannuation. It is <strong>60 years</strong> for anyone born after 1 July 1964. For employees at or above preservation age at the time of redundancy, the ETP tax rate on amounts above the tax-free limit is a concessional <strong>17%</strong> (including Medicare levy) instead of the standard <strong>32%</strong>. This concessional rate applies up to the ETP cap of $245,000 for FY2025-26.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="casuals" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Are casual employees entitled to redundancy pay?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. Casual employees are <strong>not entitled to NES redundancy pay</strong>, regardless of how long they have worked for the employer. Only permanent full-time and part-time employees qualify. A casual employee who has been engaged on a regular and systematic basis for 12 months or more may have grounds to argue they are a permanent employee in substance, but this requires a formal conversion or Fair Work determination.
                  </AccordionContent>
                </AccordionItem>
              <AccordionItem value="tax-return" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I report redundancy on my tax return?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The employer reports the tax-free redundancy component and ETP amount separately on the PAYG payment summary. The tax-free portion does not appear as assessable income on your tax return. The ETP component is reported at a specific label and taxed at the applicable ETP rate, not added to your ordinary income. Notice pay and leave payouts appear as regular salary and wages. Pre-fill data from the ATO typically populates these fields automatically in myTax.
                  </AccordionContent>
                </AccordionItem>
            </Accordion>
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
      <span className={`${bold ? "font-bold" : "font-medium"} ${green ? "text-eucalyptus-dark" : highlight ? "text-ochre" : "text-gray-700"}`}>{value}</span>
    </div>
  );
}

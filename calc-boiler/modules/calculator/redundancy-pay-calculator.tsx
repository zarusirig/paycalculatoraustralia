"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

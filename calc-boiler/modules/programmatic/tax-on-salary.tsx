"use client";

import React from "react";
import { Calculator } from "lucide-react";
import {
  calculatePayBreakdown,
  formatAUD,
  TAX_BRACKETS,
  calculateIncomeTax,
  HECS_HELP,
  SITE_CONFIG
} from "@/lib/constants/australian-tax";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";

interface TaxOnSalaryProps {
  salary: number;
}

export function TaxOnSalary({ salary }: TaxOnSalaryProps) {
  const SOURCES_LIST: SourceLink[] = [
    { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "ATO" },
    { title: "Medicare levy", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: "ATO" },
    { title: "Study and training support loans", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: "ATO" },
  ];

  const breakdown = calculatePayBreakdown({
    grossSalary: salary,
    includeHECS: salary >= HECS_HELP.minimumThreshold
  });

  const formattedSalary = formatAUD(salary);

  // Generate comparison data (-20k, -10k, +10k, +20k)
  const comparisons = [-20000, -10000, 0, 10000, 20000].map(diff => {
    const compSalary = Math.max(0, salary + diff);
    const compBreakdown = calculatePayBreakdown({
      grossSalary: compSalary,
      includeHECS: compSalary >= HECS_HELP.minimumThreshold
    });
    return {
      diff,
      salary: compSalary,
      tax: compBreakdown.netIncomeTax,
      net: compBreakdown.takeHomePay,
      effectiveRate: compBreakdown.effectiveTaxRate,
      medicare: compBreakdown.medicareLevy,
      superContribution: compBreakdown.superContribution,
      diffToCurrent: compBreakdown.takeHomePay - breakdown.takeHomePay
    };
  });

  // Determine which bracket the salary falls into
  const currentBracket = TAX_BRACKETS.filter(b => salary >= b.min).pop();
  const marginalRatePercent = currentBracket ? (currentBracket.rate * 100).toFixed(0) : "0";
  const bracketLabel = currentBracket?.label ?? "Tax-free threshold";

  // Calculate what percentage goes to tax vs take-home
  const taxPercentage = salary > 0 ? ((breakdown.netIncomeTax / salary) * 100).toFixed(1) : "0";
  const takeHomePercentage = salary > 0 ? ((breakdown.takeHomePay / salary) * 100).toFixed(1) : "0";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Introduction */}
      <section className="prose prose-eucalyptus max-w-none">
        <p className="text-lg text-navy leading-relaxed">
          On a <strong>{formattedSalary}</strong> salary in Australia, you pay <strong>{formatAUD(breakdown.netIncomeTax)}</strong> in income tax for FY2025-26.
          Your effective tax rate is <strong>{(breakdown.effectiveTaxRate * 100).toFixed(1)}%</strong>, and your marginal tax rate is <strong>{(breakdown.marginalTaxRate * 100).toFixed(1)}%</strong>.
        </p>
        <p className="text-navy leading-relaxed">
          This Australian tax calculator uses the progressive income tax brackets set by the ATO for the 2025-26 financial year. After income tax of {formatAUD(breakdown.netIncomeTax)} and a Medicare levy of {formatAUD(breakdown.medicareLevy)}, your take-home pay on {formattedSalary} is <strong>{formatAUD(breakdown.takeHomePay)}</strong> per year, or <strong>{formatAUD(breakdown.weekly)}</strong> per week. Your employer also contributes {formatAUD(breakdown.superContribution)} in superannuation at the 12% SG rate, bringing your total remuneration package to {formatAUD(breakdown.totalPackage)}.
        </p>
      </section>

      <TrustBar />

      {/* H2: How Much Tax Do You Pay on [salary]? */}
      <section className="prose prose-eucalyptus max-w-none">
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">How Much Tax Do You Pay on {formattedSalary}?</h2>
        <p className="text-navy leading-relaxed">
          Total tax on {formattedSalary} is <strong>{formatAUD(breakdown.netIncomeTax + breakdown.medicareLevy)}</strong>, comprising {formatAUD(breakdown.netIncomeTax)} in income tax and {formatAUD(breakdown.medicareLevy)} in Medicare levy.
        </p>
        <p className="text-navy leading-relaxed">
          The ATO calculates taxation on a {formattedSalary} salary using progressive marginal rates. The first $18,200 is tax-free. Income between $18,201 and $45,000 is taxed at 16%. Income between $45,001 and $135,000 is taxed at 30%. Income between $135,001 and $190,000 is taxed at 37%. Income above $190,000 is taxed at 45%.
          {breakdown.litoOffset > 0 && ` The "Low Income Tax Offset" (LITO) reduces your tax bill by ${formatAUD(breakdown.litoOffset)}, lowering your net income tax to ${formatAUD(breakdown.netIncomeTax)}.`}
        </p>
        <p className="text-navy leading-relaxed">
          Your effective tax rate of <strong>{(breakdown.effectiveTaxRate * 100).toFixed(1)}%</strong> represents the actual percentage of your {formattedSalary} salary paid in total deductions. This is lower than your marginal rate because only a portion of your income is taxed at each bracket. Use our <a href="/income-tax-calculator/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Income Tax Calculator</a> to model different salary scenarios and compare after-tax income across earnings levels.
        </p>
      </section>

      {/* Pay Breakdown — existing table */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">What Is the Take-Home Pay Breakdown at {formattedSalary}?</h2>
        <p className="text-navy leading-relaxed mb-6">
          Net pay after tax on {formattedSalary} is <strong>{formatAUD(breakdown.takeHomePay)}</strong> per year, which equals {formatAUD(breakdown.monthly)} per month, {formatAUD(breakdown.fortnightly)} per fortnight, and {formatAUD(breakdown.weekly)} per week.
        </p>
        <Card className="overflow-hidden border-sandstone-dark/10 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone text-navy font-semibold border-b border-sandstone-dark/10">
                <tr>
                  <th className="px-6 py-4">Component</th>
                  <th className="px-6 py-4 text-right">Annual</th>
                  <th className="px-6 py-4 text-right">Monthly</th>
                  <th className="px-6 py-4 text-right">Fortnightly</th>
                  <th className="px-6 py-4 text-right">Weekly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Gross Salary</td>
                  <td className="px-6 py-4 text-right font-medium">{formatAUD(breakdown.grossSalary)}</td>
                  <td className="px-6 py-4 text-right">{formatAUD(breakdown.grossSalary / 12)}</td>
                  <td className="px-6 py-4 text-right">{formatAUD(breakdown.grossSalary / 26)}</td>
                  <td className="px-6 py-4 text-right">{formatAUD(breakdown.grossSalary / 52)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors text-ochre">
                  <td className="px-6 py-4">Income Tax</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.netIncomeTax)}</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.netIncomeTax / 12)}</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.netIncomeTax / 26)}</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.netIncomeTax / 52)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors text-ochre">
                  <td className="px-6 py-4">Medicare Levy (2%)</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.medicareLevy)}</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.medicareLevy / 12)}</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.medicareLevy / 26)}</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.medicareLevy / 52)}</td>
                </tr>
                {breakdown.hecsRepayment > 0 && (
                  <tr className="hover:bg-sandstone/30 transition-colors text-ochre">
                    <td className="px-6 py-4">HECS/HELP Repayment</td>
                    <td className="px-6 py-4 text-right">−{formatAUD(breakdown.hecsRepayment)}</td>
                    <td className="px-6 py-4 text-right">−{formatAUD(breakdown.hecsRepayment / 12)}</td>
                    <td className="px-6 py-4 text-right">−{formatAUD(breakdown.hecsRepayment / 26)}</td>
                    <td className="px-6 py-4 text-right">−{formatAUD(breakdown.hecsRepayment / 52)}</td>
                  </tr>
                )}
                <tr className="bg-eucalyptus-dark text-white font-bold">
                  <td className="px-6 py-5">Take-Home Pay</td>
                  <td className="px-6 py-5 text-right">{formatAUD(breakdown.takeHomePay)}</td>
                  <td className="px-6 py-5 text-right">{formatAUD(breakdown.monthly)}</td>
                  <td className="px-6 py-5 text-right">{formatAUD(breakdown.fortnightly)}</td>
                  <td className="px-6 py-5 text-right">{formatAUD(breakdown.weekly)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-4 text-sm text-warmgray">
          Your employer also pays <strong>{formatAUD(breakdown.superContribution)}</strong> in superannuation (12%), making your total remuneration package <strong>{formatAUD(breakdown.totalPackage)}</strong>. Use our <a href="/superannuation-calculator/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Superannuation Calculator</a> to see how employer SG rate contributions grow your retirement balance over time.
        </p>
      </section>

      {/* H2: What Tax Bracket Does [salary] Fall Into? */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">What Tax Bracket Does {formattedSalary} Fall Into?</h2>
        <p className="text-navy leading-relaxed mb-4">
          A {formattedSalary} salary falls into the <strong>{marginalRatePercent}% marginal tax bracket</strong> for Australian residents in FY2025-26 ({bracketLabel}).
        </p>
        <p className="text-navy leading-relaxed mb-4">
          The marginal rate applies only to income within that bracket, not your entire salary. Your {formattedSalary} salary is split across multiple income tax brackets, with each portion taxed at its corresponding rate. The table below shows the exact tax calculated in each bracket.
        </p>
        <Card className="overflow-hidden border-sandstone-dark/20 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone/30 text-navy font-semibold border-b border-sandstone-dark/20">
                <tr>
                  <th className="px-6 py-4">Tax Bracket</th>
                  <th className="px-6 py-4 text-right">Income in Bracket</th>
                  <th className="px-6 py-4 text-right">Tax Rate</th>
                  <th className="px-6 py-4 text-right">Tax Paid</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {TAX_BRACKETS.map((bracket, index) => {
                  if (salary <= bracket.min) return null;

                  const incomeInBracket = Math.min(salary, bracket.max) - bracket.min + (bracket.min === 0 ? 0 : 1);
                  const taxInBracket = incomeInBracket * bracket.rate;

                  return (
                    <tr key={index} className="hover:bg-sandstone/30 transition-colors">
                      <td className="px-6 py-4 text-warmgray">
                        {index === 0 ? "$0 – $18,200" :
                         index === TAX_BRACKETS.length - 1 ? `Over ${formatAUD(bracket.min - 1)}` :
                         `${formatAUD(bracket.min - 1)} – ${formatAUD(bracket.max)}`}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-navy">{formatAUD(incomeInBracket)}</td>
                      <td className="px-6 py-4 text-right text-warmgray">{(bracket.rate * 100).toFixed(1)}%</td>
                      <td className="px-6 py-4 text-right font-medium text-navy">{formatAUD(taxInBracket)}</td>
                    </tr>
                  );
                })}
                {breakdown.litoOffset > 0 && (
                  <tr className="bg-sandstone text-navy transition-colors">
                    <td colSpan={3} className="px-6 py-4 text-right font-medium">Minus Low Income Tax Offset (LITO)</td>
                    <td className="px-6 py-4 text-right font-bold text-eucalyptus">−{formatAUD(breakdown.litoOffset)}</td>
                  </tr>
                )}
                <tr className="bg-sandstone text-navy font-bold border-t-2 border-sandstone-dark/20">
                  <td colSpan={3} className="px-6 py-4 text-right">Total Income Tax</td>
                  <td className="px-6 py-4 text-right">{formatAUD(breakdown.netIncomeTax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-4 text-navy leading-relaxed">
          The Stage 3 tax cuts effective from 1 July 2024 reduced the 19% bracket rate to 16% and expanded the 30% bracket ceiling from $120,000 to $135,000. These changes apply to your {formattedSalary} salary for FY2025-26. View the full <a href="/tax-brackets/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Australian Tax Brackets</a> table for all income thresholds and rates.
        </p>
      </section>

      {/* H2: How Does This Compare to Other Salary Levels? */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-6">How Does {formattedSalary} Compare to Other Salary Levels?</h2>
        <p className="text-navy leading-relaxed mb-4">
          Tax on {formattedSalary} produces an effective rate of <strong>{(breakdown.effectiveTaxRate * 100).toFixed(1)}%</strong>. The table below compares taxation, take-home pay, and superannuation across 5 salary levels to show how progressive taxation affects after-tax income at different earnings.
        </p>
        <Card className="overflow-hidden border-sandstone-dark/20 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone/30 text-navy font-semibold border-b border-sandstone-dark/20">
                <tr>
                  <th className="px-6 py-4">Gross Salary</th>
                  <th className="px-6 py-4 text-right">Income Tax</th>
                  <th className="px-6 py-4 text-right">Medicare Levy</th>
                  <th className="px-6 py-4 text-right">Take-Home Pay</th>
                  <th className="px-6 py-4 text-right">Effective Rate</th>
                  <th className="px-6 py-4 text-right">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {comparisons.map((c, i) => (
                  <tr key={i} className={c.diff === 0 ? "bg-eucalyptus-light/40/50 border-l-4 border-eucalyptus font-medium" : "hover:bg-sandstone/30 transition-colors"}>
                    <td className="px-6 py-4">
                      {formatAUD(c.salary)}
                      {c.diff === 0 && <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sandstone text-navy">You are here</span>}
                    </td>
                    <td className="px-6 py-4 text-right text-warmgray">{formatAUD(c.tax)}</td>
                    <td className="px-6 py-4 text-right text-warmgray">{formatAUD(c.medicare)}</td>
                    <td className="px-6 py-4 text-right text-navy">{formatAUD(c.net)}</td>
                    <td className="px-6 py-4 text-right text-warmgray">{(c.effectiveRate * 100).toFixed(1)}%</td>
                    <td className="px-6 py-4 text-right">
                      {c.diff === 0 ? "—" : (
                        <span className={c.diff > 0 ? "text-eucalyptus font-medium" : "text-ochre font-medium"}>
                          {c.diff > 0 ? "+" : ""}
                          {formatAUD(c.diffToCurrent)}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <p className="mt-4 text-sm text-warmgray">
          Earning an additional $10,000 above {formattedSalary} increases take-home pay by <strong>{formatAUD(comparisons[3].diffToCurrent)}</strong> per year. The remaining portion goes to income tax and Medicare levy at the marginal rate. Use our <a href="/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Pay Calculator Australia</a> to calculate any salary with all deductions included.
        </p>
      </section>

      {/* H2: What Deductions Apply at This Income Level? */}
      <section className="prose prose-eucalyptus max-w-none">
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">What Deductions Apply at This Income Level?</h2>
        <p className="text-navy leading-relaxed">
          Total compulsory deductions on {formattedSalary} are <strong>{formatAUD(breakdown.totalDeductions)}</strong>, representing {(breakdown.effectiveTaxRate * 100).toFixed(1)}% of gross salary. These deductions comprise income tax, Medicare levy, and HECS-HELP repayments (if applicable).
        </p>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-bold text-navy mt-6 mb-3">Income Tax ({formatAUD(breakdown.netIncomeTax)})</h3>
        <p className="text-navy leading-relaxed">
          Income tax is the largest deduction at <strong>{formatAUD(breakdown.netIncomeTax)}</strong>, calculated using progressive marginal rates across 5 brackets.
          {breakdown.litoOffset > 0 ? ` The "Low Income Tax Offset" reduces your gross tax liability by ${formatAUD(breakdown.litoOffset)}.` : ` At ${formattedSalary}, the "Low Income Tax Offset" has fully phased out as assessable income exceeds the $66,667 threshold.`}
        </p>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-bold text-navy mt-6 mb-3">Medicare Levy ({formatAUD(breakdown.medicareLevy)})</h3>
        <p className="text-navy leading-relaxed">
          The Medicare levy of <strong>{formatAUD(breakdown.medicareLevy)}</strong> equals 2% of taxable income. This funds Australia&#39;s public healthcare system. Employees without private hospital insurance who earn above $93,000 (singles) also face the "Medicare Levy Surcharge" of 1% to 1.5%. Learn more in our <a href="/medicare-levy/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Medicare Levy guide</a>.
        </p>

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-bold text-navy mt-6 mb-3">HECS-HELP Repayment</h3>
        {salary >= HECS_HELP.minimumThreshold ? (
          <p className="text-navy leading-relaxed">
            At {formattedSalary}, the compulsory HECS-HELP repayment is <strong>{formatAUD(breakdown.hecsRepayment)}</strong> per year. The FY2025-26 repayment threshold is $67,000 under the new marginal system. Repayments are withheld from your salary by your employer through PAYG withholding. Calculate the exact impact on your disposable salary with our <a href="/hecs-help-calculator/" className="text-eucalyptus hover:text-navy transition-colors font-medium">HECS-HELP Repayment Calculator</a>.
          </p>
        ) : (
          <p className="text-navy leading-relaxed">
            At {formattedSalary}, no compulsory HECS-HELP repayment applies. The FY2025-26 minimum repayment threshold is <strong>$67,000</strong>. Income below this level does not trigger compulsory repayments, though voluntary repayments remain available at any time.
          </p>
        )}

        <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-bold text-navy mt-6 mb-3">How Can You Reduce Tax on {formattedSalary}?</h3>
        <p className="text-navy leading-relaxed">
          Three common strategies reduce assessable income and lower taxation on a {formattedSalary} salary:
        </p>
        <ul className="text-navy space-y-2">
          <li><strong>Salary sacrifice to super</strong> — concessional contributions up to the $30,000 annual cap are taxed at 15% inside super, compared to your {marginalRatePercent}% marginal rate. Use our <a href="/salary-sacrifice-calculator/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Salary Sacrifice Calculator</a> to model the savings.</li>
          <li><strong>Work-related deductions</strong> — claiming expenses for uniforms, tools, home office costs, and self-education reduces taxable income dollar-for-dollar.</li>
          <li><strong>Novated lease</strong> — packaging a vehicle through your employer reduces pre-tax salary, lowering both income tax and Medicare levy obligations.</li>
        </ul>
      </section>

      {/* HECS Debt — existing section */}
      <section className="bg-sandstone/30 rounded-xl p-8 border border-sandstone-dark/20">
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">If You Have a HECS Debt on {formattedSalary}</h2>
        {salary >= HECS_HELP.minimumThreshold ? (
          <p className="text-navy leading-relaxed mb-4">
            With a HECS/HELP debt, your compulsory repayment on {formattedSalary} is <strong>{formatAUD(breakdown.hecsRepayment)}</strong> per year
            (<strong>{formatAUD(breakdown.hecsRepayment / 52)}</strong> per week). This reduces your take-home pay to <strong>{formatAUD(breakdown.takeHomePay)}</strong>.
          </p>
        ) : (
          <p className="text-navy leading-relaxed mb-4">
            On {formattedSalary}, you are below the minimum HECS repayment threshold of {formatAUD(HECS_HELP.minimumThreshold)}.
            No compulsory repayment is required.
          </p>
        )}
        <p className="text-sm font-medium text-eucalyptus hover:text-navy transition-colors">
          <a href="/hecs-help-calculator/">→ HECS-HELP repayment calculator</a>
        </p>
      </section>

      {/* H2: Related Calculators */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">Which Calculators Help You Plan Around {formattedSalary}?</h2>
        <p className="text-navy leading-relaxed mb-6">
          These Australian tax calculators model specific scenarios for a {formattedSalary} salary, from take-home pay to superannuation and salary sacrifice.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/" className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Pay Calculator Australia</p>
            <p className="text-sm text-warmgray">Calculate take-home pay on any salary with income tax, Medicare levy, and super included for FY2025-26.</p>
          </a>
          <a href="/income-tax-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Income Tax Calculator</p>
            <p className="text-sm text-warmgray">See a detailed breakdown of income tax brackets, LITO, and effective tax rates for your salary.</p>
          </a>
          <a href="/superannuation-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Superannuation Calculator</p>
            <p className="text-sm text-warmgray">Calculate employer SG rate contributions at 12% and project your super balance at retirement.</p>
          </a>
          <a href="/salary-sacrifice-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Salary Sacrifice Calculator</p>
            <p className="text-sm text-warmgray">Model how salary sacrifice to super reduces taxable income and increases after-tax income.</p>
          </a>
          <a href="/take-home-pay-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Take-Home Pay Calculator</p>
            <p className="text-sm text-warmgray">Convert gross salary to net pay after all compulsory deductions including HECS-HELP repayments.</p>
          </a>
          <a href="/tax-return-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Tax Return Calculator</p>
            <p className="text-sm text-warmgray">Estimate your tax refund or amount owing based on PAYG withholding and deductions claimed.</p>
          </a>
        </div>
      </section>

      {/* FAQs */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              How much tax do I pay on {formattedSalary}?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              On {formattedSalary}, you pay <strong>{formatAUD(breakdown.netIncomeTax)}</strong> in income tax ({(breakdown.effectiveTaxRate * 100).toFixed(1)}% effective rate) plus
              {" "}{formatAUD(breakdown.medicareLevy)} in Medicare levy. Your take-home pay is <strong>{formatAUD(breakdown.takeHomePay)}</strong> per year or <strong>{formatAUD(breakdown.weekly)}</strong> per week. This calculation uses the ATO progressive marginal tax rates for FY2025-26.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              What is my marginal tax rate on {formattedSalary}?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              Your marginal tax rate on {formattedSalary} is <strong>{(breakdown.marginalTaxRate * 100).toFixed(1)}%</strong> (including the 2% Medicare levy). This means each additional
              dollar you earn above {formattedSalary} is taxed at {(breakdown.marginalTaxRate * 100).toFixed(1)}c. Your effective rate is lower at {(breakdown.effectiveTaxRate * 100).toFixed(1)}% because the first $18,200 is tax-free.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              How much superannuation does my employer pay on {formattedSalary}?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              Your employer contributes <strong>{formatAUD(breakdown.superContribution)}</strong> per year to your super fund at the 12% super guarantee rate for FY2025-26. This is paid on top of your {formattedSalary} gross salary, not deducted from it. Your total remuneration package including super is <strong>{formatAUD(breakdown.totalPackage)}</strong>.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              What is {formattedSalary} per week after tax?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              A {formattedSalary} annual salary equals <strong>{formatAUD(breakdown.weekly)}</strong> per week after tax, <strong>{formatAUD(breakdown.fortnightly)}</strong> per fortnight, and <strong>{formatAUD(breakdown.monthly)}</strong> per month. These figures include income tax and Medicare levy deductions but exclude voluntary salary sacrifice or HECS-HELP repayments.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              Do I pay the Medicare Levy Surcharge on {formattedSalary}?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              {salary > 93000
                ? `Yes. Without private hospital cover, a ${formattedSalary} salary triggers the "Medicare Levy Surcharge" (MLS). The surcharge is ${salary <= 108000 ? '1.0%' : salary <= 144000 ? '1.25%' : '1.5%'} of taxable income, adding ${formatAUD(salary <= 108000 ? salary * 0.01 : salary <= 144000 ? salary * 0.0125 : salary * 0.015)} to your annual deductions. Holding private hospital insurance exempts you from the MLS.`
                : `No. The "Medicare Levy Surcharge" applies only to singles earning above $93,000 without private hospital cover. At ${formattedSalary}, you are below this threshold and are not liable for the surcharge.`
              }
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              How did the Stage 3 tax cuts affect {formattedSalary}?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              The Stage 3 tax cuts effective 1 July 2024 reduced the second bracket rate from 19% to 16% and expanded the 30% bracket ceiling from $120,000 to $135,000. On {formattedSalary}, these changes reduced income tax compared to the previous FY2023-24 rates. The 16% rate applies to income between $18,201 and $45,000, saving taxpayers up to $804 per year in that bracket alone.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              Is income tax calculated differently in different states?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              No. Income tax is a federal tax in Australia and is calculated identically across all states and territories including NSW, Victoria, Queensland, Western Australia, South Australia, Tasmania, ACT, and the Northern Territory. The same ATO tax brackets apply regardless of your state of residence. State-level payroll tax is paid by employers, not employees.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8" className="bg-white border rounded-lg px-4 shadow-sm">
            <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">
              What is the difference between marginal and effective tax rate?
            </AccordionTrigger>
            <AccordionContent className="text-warmgray pb-4 leading-relaxed">
              The marginal tax rate of <strong>{(breakdown.marginalTaxRate * 100).toFixed(1)}%</strong> is the rate applied to each additional dollar earned. The effective tax rate of <strong>{(breakdown.effectiveTaxRate * 100).toFixed(1)}%</strong> is the total percentage of your {formattedSalary} salary paid in all deductions. The effective rate is always lower because the first $18,200 is tax-free and lower brackets are taxed at 16% and 30% before reaching the marginal rate.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <MethodologyDisclosure>
        <p className="mb-2 text-sm text-warmgray">Calculations are based on the following general rules and assumptions:</p>
        <ol className="list-decimal pl-4 space-y-1 text-sm text-warmgray">
          <li><strong>Income Tax:</strong> Calculated using the official ATO progressive marginal tax rates for resident individuals for FY2025-26.</li>
          <li><strong>Medicare Levy:</strong> Assumed at the standard 2% rate. Does not account for low-income reductions or the Medicare Levy Surcharge for those without private hospital cover.</li>
          <li><strong>Superannuation:</strong> Calculated at the 12% Super Guarantee rate on top of the stated salary, not deducted from it.</li>
        </ol>
      </MethodologyDisclosure>
      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </div>
  );
}

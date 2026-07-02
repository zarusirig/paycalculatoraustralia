"use client";

import { useState, useMemo } from "react";
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
  formatPercent,
  TAX_BRACKETS_2025_26,
  MEDICARE_LEVY,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

const SOURCES_LIST: SourceLink[] = [
  { title: "Schedule 5 – Tax table for back payments", url: "https://www.ato.gov.au/tax-rates-and-codes/schedule-5-tax-table-for-back-payments-commissions-bonuses-and-similar-payments", publisher: SOURCES.ato.name },
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

export default function BonusTaxCalculatorPage() {
  const [baseSalary, setBaseSalary] = useState(90_000);
  const [bonusAmount, setBonusAmount] = useState(10_000);

  const withoutBonus = useMemo(
    () => calculatePayBreakdown({ grossSalary: baseSalary }),
    [baseSalary]
  );

  const withBonus = useMemo(
    () => calculatePayBreakdown({ grossSalary: baseSalary, bonus: bonusAmount }),
    [baseSalary, bonusAmount]
  );

  const taxOnBonus = withBonus.totalDeductions - withoutBonus.totalDeductions;
  const netBonus = bonusAmount - taxOnBonus;
  const effectiveBonusTaxRate = bonusAmount > 0 ? taxOnBonus / bonusAmount : 0;

  // Find marginal bracket for the combined income
  const combinedIncome = baseSalary + bonusAmount;
  let marginalRate = 0;
  for (const bracket of TAX_BRACKETS_2025_26) {
    if (combinedIncome >= bracket.min) {
      marginalRate = bracket.rate;
    }
  }
  const marginalPlusMedicare = marginalRate + MEDICARE_LEVY.rate;

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO */}
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Bonus Tax Calculator</span></li>
            </ol>
          </nav>
          <h1 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">
            Bonus Tax Calculator Australia 2025-26
          </h1>
          <p className="text-lg text-warmgray">
            Find out exactly how much tax you pay on a bonus or commission payment.
            See the marginal tax rate applied to your lump sum and your actual take-home bonus.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-6">How Much Tax on Your Bonus?</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                {/* Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <div>
                    <label htmlFor="baseSalary" className="block text-sm font-medium text-navy mb-1">Base Annual Salary</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="baseSalary" min={0} max={500000} step={1000} value={baseSalary}
                        onChange={(e) => setBaseSalary(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={300000} step={5000} value={clamp(baseSalary, 0, 300000)}
                      onChange={(e) => setBaseSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                  </div>

                  <div>
                    <label htmlFor="bonusAmount" className="block text-sm font-medium text-navy mb-1">Bonus / Commission Amount</label>
                    <div className="flex items-center">
                      <span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="bonusAmount" min={0} max={500000} step={500} value={bonusAmount}
                        onChange={(e) => setBonusAmount(clamp(Number(e.target.value || 0), 0, 500000))}
                        className="block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20" />
                    </div>
                    <input type="range" min={0} max={100000} step={1000} value={clamp(bonusAmount, 0, 100000)}
                      onChange={(e) => setBonusAmount(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
                  </div>
                </form>

                {/* Results */}
                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Your Take-Home Bonus</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(netBonus)}</div>
                    <div className="text-sm text-warmgray mt-2">
                      from a <strong>{formatAUD(bonusAmount)}</strong> gross bonus
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20">
                      <h3 className="font-semibold text-navy text-sm uppercase tracking-wider">Tax Breakdown</h3>
                    </div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Gross Bonus" value={formatAUD(bonusAmount)} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label={`Marginal Tax Rate (${formatPercent(marginalRate, 0)})`} value={`-${formatAUD(Math.round(bonusAmount * marginalRate))}`} />
                      <Row label={`Medicare Levy (${formatPercent(MEDICARE_LEVY.rate, 0)})`} value={`-${formatAUD(Math.round(bonusAmount * MEDICARE_LEVY.rate))}`} />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label="Total Tax on Bonus" value={`-${formatAUD(taxOnBonus)}`} />
                      <Row label={`Effective Rate on Bonus`} value={formatPercent(effectiveBonusTaxRate)} />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Net Bonus (Take-Home)" value={formatAUD(netBonus)} bold highlight />
                    </div>
                  </div>

                  <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 text-xs text-navy">
                    <strong>Note:</strong> Your bonus is taxed at your marginal rate because it sits on top of your regular salary. The combined total of <strong>{formatAUD(combinedIncome)}</strong> determines the tax bracket applied to the bonus portion.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CONTENT */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* --- H2: How Is Bonus Tax Calculated in Australia? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Bonus Tax Calculated in Australia?</h2>
            <p className="mb-4 text-warmgray">
              Bonus tax in Australia is calculated by applying your <strong>marginal tax rate</strong> to the bonus amount, because the ATO treats the bonus as income earned on top of your regular salary.
            </p>
            <p className="mb-4 text-warmgray">
              The Australian Tax Office uses a specific method under the <Link href="/schedule-5-tax-table/" className="text-eucalyptus-dark hover:underline">Schedule 5 tax table</Link> to determine the correct withholding. Your employer calculates two figures: the annual tax on your base salary alone, and the annual tax on your base salary plus the bonus. The difference between those two figures is the tax withheld from your bonus.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Step-by-Step Worked Example</h3>
            <p className="mb-3 text-warmgray">
              An employee earns a base salary of <strong>$90,000</strong> and receives a <strong>$10,000</strong> performance bonus. The bonus tax calculation follows 4 steps:
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-warmgray mb-4">
              <li><strong>Calculate tax on base salary ($90,000):</strong> Income tax is <strong>$17,788</strong> (using FY2025-26 brackets). Add the 2% Medicare levy of <strong>$1,800</strong>. Subtract the LITO offset. Total deductions on base salary: approximately <strong>$19,588</strong>.</li>
              <li><strong>Calculate tax on combined income ($100,000):</strong> Income tax is <strong>$20,788</strong>. Medicare levy is <strong>$2,000</strong>. Total deductions on combined income: approximately <strong>$22,788</strong>.</li>
              <li><strong>Find the difference:</strong> $22,788 &minus; $19,588 = <strong>$3,200</strong> in tax attributable to the bonus.</li>
              <li><strong>Calculate take-home bonus:</strong> $10,000 &minus; $3,200 = <strong>$6,800</strong> net bonus. The effective tax rate on the bonus is <strong>32%</strong> (30% marginal rate + 2% Medicare levy).</li>
            </ol>
            <p className="text-warmgray">
              This method mirrors how Australian tax calculators and payroll systems determine bonus withholding. Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to verify your base salary tax figures independently.
            </p>
          </section>

          {/* --- H2: What Tax Rate Applies to Bonuses? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Tax Rate Applies to Bonuses in Australia?</h2>
            <p className="mb-4 text-warmgray">
              Bonuses are taxed at your <strong>marginal tax rate plus the 2% Medicare levy</strong>, not a flat &quot;bonus tax rate.&quot; The marginal rate depends on which income tax bracket your combined salary and bonus falls into for FY2025-26.
            </p>
            <p className="mb-4 text-warmgray">
              Australia does not have a separate bonus tax rate. The ATO&apos;s Schedule 5 withholding method applies the standard individual income tax brackets to calculate the tax on supplementary payments including bonuses, commissions, and back payments.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">FY2025-26 Tax Brackets Applied to Bonuses</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Taxable Income</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Marginal Rate</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">+ Medicare (2%)</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Total on Bonus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$0 &ndash; $18,200</td>
                    <td className="px-4 py-3 text-right text-warmgray">0%</td>
                    <td className="px-4 py-3 text-right text-warmgray">2%</td>
                    <td className="px-4 py-3 text-right font-semibold text-navy"><strong>2%</strong></td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$18,201 &ndash; $45,000</td>
                    <td className="px-4 py-3 text-right text-warmgray">16%</td>
                    <td className="px-4 py-3 text-right text-warmgray">2%</td>
                    <td className="px-4 py-3 text-right font-semibold text-navy"><strong>18%</strong></td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$45,001 &ndash; $135,000</td>
                    <td className="px-4 py-3 text-right text-warmgray">30%</td>
                    <td className="px-4 py-3 text-right text-warmgray">2%</td>
                    <td className="px-4 py-3 text-right font-semibold text-navy"><strong>32%</strong></td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$135,001 &ndash; $190,000</td>
                    <td className="px-4 py-3 text-right text-warmgray">37%</td>
                    <td className="px-4 py-3 text-right text-warmgray">2%</td>
                    <td className="px-4 py-3 text-right font-semibold text-navy"><strong>39%</strong></td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy">$190,001+</td>
                    <td className="px-4 py-3 text-right text-warmgray">45%</td>
                    <td className="px-4 py-3 text-right text-warmgray">2%</td>
                    <td className="px-4 py-3 text-right font-semibold text-navy"><strong>47%</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              A bonus that pushes your total income from one bracket into the next is split: the portion within the lower bracket is taxed at the lower rate, and the portion in the higher bracket is taxed at the higher rate. Use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> to model different salary-plus-bonus scenarios.
            </p>
          </section>

          {/* --- H2: Who Uses This Calculator? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Uses This Bonus Tax Calculator?</h2>
            <p className="mb-4 text-warmgray">
              Australian employees, payroll managers, and financial planners use this calculator to determine the after-tax value of lump-sum payments before they are paid or received.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray mb-4">
              <li><strong>Full-time and part-time employees</strong> receiving annual performance bonuses, Christmas bonuses, or retention payments who want to know their take-home pay after tax</li>
              <li><strong>Sales professionals</strong> earning regular commissions who need to forecast their net income across the financial year</li>
              <li><strong>Small business owners and payroll officers</strong> calculating correct PAYG withholding on supplementary payments under ATO Schedule 5</li>
              <li><strong>Contractors transitioning to employment</strong> comparing the tax treatment of lump-sum payments versus regular salary &mdash; our <Link href="/contractor-vs-employee-calculator/" className="text-eucalyptus-dark hover:underline">Contractor vs Employee Calculator</Link> provides a full side-by-side comparison</li>
              <li><strong>Job seekers</strong> evaluating compensation packages that include sign-on bonuses or guaranteed incentive payments</li>
            </ul>
          </section>

          {/* --- H2: How Does Bonus Tax Compare to Regular Income Tax? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Does Bonus Tax Compare to Regular Income Tax?</h2>
            <p className="mb-4 text-warmgray">
              Bonus tax is calculated at the <strong>marginal rate</strong>, while regular salary tax uses a blended effective rate across all brackets. This is why a bonus feels more heavily taxed than ordinary income.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Factor</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Regular Salary</th>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Bonus / Commission</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy font-medium">Tax rate applied</td>
                    <td className="px-4 py-3 text-warmgray">Blended effective rate across all brackets</td>
                    <td className="px-4 py-3 text-warmgray">Marginal rate on the top dollar of income</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy font-medium">Effective rate at $90K salary</td>
                    <td className="px-4 py-3 text-warmgray"><strong>21.8%</strong> (including Medicare)</td>
                    <td className="px-4 py-3 text-warmgray"><strong>32%</strong> (30% + 2% Medicare)</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy font-medium">Tax-free threshold benefit</td>
                    <td className="px-4 py-3 text-warmgray">Yes &mdash; first $18,200 is tax-free</td>
                    <td className="px-4 py-3 text-warmgray">No &mdash; already consumed by base salary</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy font-medium">LITO offset</td>
                    <td className="px-4 py-3 text-warmgray">Applied &mdash; up to $700 reduction</td>
                    <td className="px-4 py-3 text-warmgray">Usually nil for incomes above $66,667</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy font-medium">Withholding method</td>
                    <td className="px-4 py-3 text-warmgray">ATO Schedule 1 (regular pay cycles)</td>
                    <td className="px-4 py-3 text-warmgray">ATO Schedule 5 (supplementary payments)</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy font-medium">Super guarantee (12%)</td>
                    <td className="px-4 py-3 text-warmgray">Applies to OTE salary</td>
                    <td className="px-4 py-3 text-warmgray">Applies if bonus is OTE</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              The effective tax rate on a $10,000 bonus for an employee on $90,000 base salary is <strong>32%</strong>, compared to an overall effective rate of approximately <strong>21.8%</strong> on their regular salary. The difference arises because the $18,200 tax-free threshold and lower brackets are already used by the base salary. Use the <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to explore whether pre-tax contributions reduce your bonus tax impact.
            </p>
          </section>

          {/* --- Worked Examples Table (original) --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Much Tax Do You Pay on Common Bonus Amounts?</h2>
            <p className="mb-4 text-warmgray">
              The tax on a bonus ranges from <strong>18% to 47%</strong> depending on your combined salary and bonus total. The table below shows worked examples across 5 salary levels for FY2025-26.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Bonus</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Marginal Rate</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Tax on Bonus</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Net Bonus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {[
                    { salary: 60000, bonus: 5000 },
                    { salary: 80000, bonus: 10000 },
                    { salary: 100000, bonus: 15000 },
                    { salary: 120000, bonus: 20000 },
                    { salary: 150000, bonus: 25000 },
                  ].map(({ salary, bonus }) => {
                    const without = calculatePayBreakdown({ grossSalary: salary });
                    const with_ = calculatePayBreakdown({ grossSalary: salary, bonus });
                    const tax = with_.totalDeductions - without.totalDeductions;
                    let mr = 0;
                    for (const b of TAX_BRACKETS_2025_26) { if (salary + bonus >= b.min) mr = b.rate; }
                    return (
                      <tr key={salary} className="hover:bg-sandstone">
                        <td className="px-4 py-3 text-navy">{formatAUD(salary)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(bonus)}</td>
                        <td className="px-4 py-3 text-right text-warmgray">{formatPercent(mr + MEDICARE_LEVY.rate, 0)}</td>
                        <td className="px-4 py-3 text-right text-ochre">-{formatAUD(tax)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-navy">{formatAUD(bonus - tax)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* --- H2: What Changed in FY2025-26? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Changed for Bonus Tax in FY2025-26?</h2>
            <p className="mb-4 text-warmgray">
              The Stage 3 tax cuts that took effect on 1 July 2024 reduced the marginal rate for the $45,001&ndash;$135,000 bracket from <strong>32.5% to 30%</strong>, directly lowering the tax withheld from bonuses for most Australian workers.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray mb-4">
              <li>The 16% bracket now applies from <strong>$18,201 to $45,000</strong> (previously 19% from $18,201 to $45,000)</li>
              <li>The 30% bracket extends from <strong>$45,001 to $135,000</strong> (previously 32.5% from $45,001 to $120,000)</li>
              <li>The 37% bracket starts at <strong>$135,001</strong> (previously $120,001), giving higher earners more room in the lower bracket</li>
              <li>The superannuation guarantee rate increased to <strong>12%</strong> from 11.5%, increasing the SG contribution your employer pays on bonus amounts classified as Ordinary Time Earnings</li>
            </ul>
            <p className="text-warmgray">
              An employee on $90,000 receiving a $10,000 bonus now pays <strong>$3,200</strong> in tax on the bonus (32%), compared to <strong>$3,450</strong> (34.5%) under the previous rates &mdash; a saving of <strong>$250</strong>. Check the full impact on your salary using our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>.
            </p>
          </section>

          {/* --- H2: What Are Common Bonus Tax Mistakes? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are Common Bonus Tax Mistakes?</h2>
            <p className="mb-4 text-warmgray">
              The most common mistake is assuming bonuses are taxed at a flat &quot;bonus rate&quot; &mdash; they are taxed at your <strong>marginal rate</strong>, which depends on your total assessable income.
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-warmgray mb-4">
              <li><strong>Confusing marginal rate with effective rate:</strong> Employees see 32% withheld from a bonus and believe their entire salary is taxed at 32%. The effective rate on a $90,000 salary is approximately 21.8%. The bonus is taxed at the marginal rate because it sits on top of existing income.</li>
              <li><strong>Forgetting the Medicare levy:</strong> The 2% Medicare levy applies to bonuses on top of the income tax rate. A 30% marginal bracket results in <strong>32% total</strong> tax on the bonus, not 30%.</li>
              <li><strong>Ignoring bracket crossover:</strong> A $5,000 bonus on a $133,000 salary pushes total income from the 30% bracket into the 37% bracket. The first $2,000 of the bonus is taxed at 32% and the remaining $3,000 at 39%.</li>
              <li><strong>Not accounting for HECS-HELP:</strong> Employees with a HELP debt have an additional repayment amount withheld. A bonus that pushes total income above the $67,000 HECS threshold triggers a repayment obligation. Use the <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> to check your repayment liability.</li>
              <li><strong>Assuming super is always paid on bonuses:</strong> The 12% superannuation guarantee applies only when the bonus qualifies as Ordinary Time Earnings. Sign-on bonuses, retention payments, and discretionary ex-gratia payments are generally excluded from OTE.</li>
            </ol>
          </section>

          {/* --- H2: Commission vs Bonus (original, kept) --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Is There a Difference Between Commission Tax and Bonus Tax?</h2>
            <p className="mb-4 text-warmgray">
              From a tax perspective, <strong>no</strong>. The ATO treats bonuses, commissions, and similar one-off payments identically. They are all supplementary payments taxed under Schedule 5. Whether your payment is called a &quot;performance bonus,&quot; &quot;sales commission,&quot; or &quot;incentive payment,&quot; the withholding method and tax calculation are the same.
            </p>
            <p className="text-warmgray">
              The only practical difference is frequency: commissions are often paid monthly or quarterly, while bonuses tend to be annual or one-off. Frequent commission payments can trigger PAYG instalment obligations if your total income exceeds ATO thresholds. Track your annual earnings using the <Link href="/annual-pay-calculator/" className="text-eucalyptus-dark hover:underline">Annual Pay Calculator</Link>.
            </p>
          </section>

          {/* --- H2: Related Calculators --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Which Related Calculators Help with Bonus Planning?</h2>
            <p className="mb-4 text-warmgray">
              Bonus tax is one component of your total tax position for the 2025-26 financial year. These Australian tax calculators address the broader picture:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray">
              <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> &mdash; calculates your net pay after income tax, Medicare levy, HECS, and superannuation on your full salary including bonuses</li>
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> &mdash; shows the exact income tax brackets and amounts applied to your total taxable income for FY2025-26</li>
              <li><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> &mdash; models whether sacrificing part of your bonus into superannuation reduces your overall tax liability</li>
              <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> &mdash; determines the 12% SG contribution your employer pays on your bonus and base salary</li>
              <li><Link href="/tax-return-calculator/" className="text-eucalyptus-dark hover:underline">Tax Return Calculator</Link> &mdash; estimates whether you will receive a tax refund or owe a balance when you lodge your return after receiving bonus income</li>
            </ul>
          </section>

          <MethodologyDisclosure>
            <p className="mb-2 text-sm">This calculator estimates tax on bonuses using the following method:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Calculates full-year tax liability with and without the bonus</li>
              <li>The difference represents the tax attributable to the bonus (mirrors ATO Schedule 5)</li>
              <li>Includes income tax, LITO offset, and Medicare levy</li>
              <li>Does not include Medicare surcharge, HECS repayments, or salary sacrifice — use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">main pay calculator</Link> for the complete picture</li>
            </ul>
          </MethodologyDisclosure>

          {/* --- FAQs --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <Accordion type="multiple" className="space-y-3">
              <AccordionItem value="how-taxed" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How is a bonus taxed in Australia?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Bonuses are taxed at your marginal tax rate. Because the bonus sits on top of your regular salary, it is taxed at whatever bracket your total income falls into. Your employer uses ATO Schedule 5 to calculate the correct withholding amount. The marginal rate ranges from <strong>16%</strong> (for incomes between $18,201 and $45,000) to <strong>45%</strong> (for incomes above $190,000), plus the 2% Medicare levy.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="less-than-expected" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Why is my bonus smaller than expected?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Because tax is withheld at your marginal rate (not your effective rate). For example, if your salary puts you in the 30% bracket, <strong>32%</strong> (30% + 2% Medicare) is taken from every dollar of your bonus &mdash; even though your overall effective tax rate on salary is lower at approximately 21.8%. The tax-free threshold and lower brackets are already consumed by your regular income.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="super" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Do I get superannuation on my bonus?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Generally yes. Bonuses paid for work performed are considered Ordinary Time Earnings (OTE) and attract the <strong>12%</strong> Superannuation Guarantee. Retention bonuses, sign-on bonuses, and discretionary payments are generally excluded from OTE. Check your employment contract or ask your payroll department to confirm whether your specific bonus attracts super.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="refund" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Will I get the tax on my bonus back at tax time?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Potentially some of it. If your employer over-withheld (i.e., withheld more than your actual tax liability for the year), you receive a refund when you lodge your tax return. The Schedule 5 method generally minimises over-withholding, so the refund attributable to bonus over-withholding is typically small &mdash; usually under <strong>$200</strong> for a $10,000 bonus.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="flat-rate" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Is there a flat tax rate on bonuses in Australia?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">No. Australia does not have a flat bonus tax rate. Unlike some countries (e.g., the US uses a 22% flat supplemental rate), Australia taxes bonuses at your <strong>marginal tax rate</strong> using the Schedule 5 calculation method. The rate depends entirely on your total assessable income for the financial year.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="reduce-bonus-tax" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>How can I reduce tax on my bonus?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Salary sacrifice part of your bonus into superannuation as a concessional contribution, taxed at only <strong>15%</strong> inside super instead of your marginal rate of up to 47%. The concessional contributions cap is <strong>$30,000</strong> per year for FY2025-26 (including employer SG). Alternatively, claim all eligible work-related deductions to reduce your total taxable income and potentially lower the marginal rate applied to the bonus.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="hecs-bonus" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does a bonus affect my HECS-HELP repayment?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">Yes. HECS-HELP repayments are based on your total &quot;Repayment Income,&quot; which includes your salary plus any bonuses, commissions, and fringe benefits. A bonus that pushes your repayment income above the <strong>$67,000</strong> minimum threshold triggers a compulsory repayment. The marginal repayment rate starts at <strong>15%</strong> on income above $67,000 under the FY2025-26 system.</p></AccordionContent>
              </AccordionItem>
              <AccordionItem value="timing" className="rounded-xl border border-sandstone-dark/20 px-5">
                <AccordionTrigger>Does it matter when my bonus is paid during the financial year?</AccordionTrigger>
                <AccordionContent><p className="text-warmgray">The timing within a financial year does not change your total tax liability &mdash; your annual tax is calculated on total income regardless of when it is received. However, if your employer can defer a bonus payment to the next financial year (e.g., from June to July), it shifts the income into a different tax year and could result in a lower marginal rate if your income is lower in that year.</p></AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold, highlight }: { label: string; value: string; bold?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-navy" : "text-warmgray"}>{label}</span>
      <span className={`${bold ? "font-bold" : "font-medium"} ${highlight ? "text-ochre" : "text-navy"}`}>{value}</span>
    </div>
  );
}

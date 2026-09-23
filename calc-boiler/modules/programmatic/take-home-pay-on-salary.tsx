import React from "react";
import {
  calculatePayBreakdown,
  formatAUD,
  TAX_BRACKETS,
  HECS_HELP,
  SITE_CONFIG,
  EMPLOYMENT,
  SUPER_GUARANTEE,
} from "@/lib/constants/australian-tax";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { salaryFacts } from "@/lib/data/salary-pages";
import { FaqAnswer } from "@/components/common/faq-accordion";
import { takeHomePayOnSalaryFaqs } from "@/modules/programmatic/take-home-pay-on-salary-faqs";
import { EarningsPosition, NeighbourTable, NextThousand, SalaryBandNotes, SalaryNav } from "@/modules/programmatic/salary-page-sections";

interface TakeHomePayOnSalaryProps {
  salary: number;
}

export function TakeHomePayOnSalary({ salary }: TakeHomePayOnSalaryProps) {
  const SOURCES_LIST: SourceLink[] = [
    { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "ATO" },
    { title: "Medicare levy", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: "ATO" },
    { title: "Superannuation guarantee", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee", publisher: "ATO" },
  ];

  // Headline figures exclude HECS-HELP: "$X after tax" is asked (and answered
  // by the ATO and every other AU pay site) for someone without a study loan.
  // Folding HECS in made $100,000 read $72,909 here against $77,480 everywhere
  // else, and contradicted this page's own FAQ. The loan case is shown
  // separately via `withHecs`.
  const breakdown = calculatePayBreakdown({ grossSalary: salary });
  const withHecs = calculatePayBreakdown({ grossSalary: salary, includeHECS: true });

  const formattedSalary = formatAUD(salary);
  const effectiveRate = (breakdown.effectiveTaxRate * 100).toFixed(1);
  const marginalRate = (breakdown.marginalTaxRate * 100).toFixed(1);

  // Determine which bracket the salary falls into
  const currentBracket = TAX_BRACKETS.filter(b => salary >= b.min).pop();
  const marginalRatePercent = currentBracket ? (currentBracket.rate * 100).toFixed(0) : "0";

  // Pay frequency data
  const hoursPerYear = EMPLOYMENT.hoursPerYear; // 38 hrs × 52 weeks = 1,976
  const hourlyGross = salary / hoursPerYear;
  const hourlyNet = breakdown.takeHomePay / hoursPerYear;

  // Employer SG capped at the maximum contribution base (the engine's
  // superContribution is an uncapped 12%, which overstates it above ~$270k).
  const facts = salaryFacts(salary);
  const employerSuper = facts.employerSuper;
  const totalPackage = salary + employerSuper;
  const sacrifice = facts.sacrificeThousand;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Introduction */}
      <section className="prose prose-eucalyptus max-w-none">
        <p className="text-lg text-navy leading-relaxed">
          On a <strong>{formattedSalary}</strong> salary in Australia, your take-home pay is <strong>{formatAUD(breakdown.takeHomePay)}</strong> per year after tax for FY{SITE_CONFIG.financialYear}.
          That works out to <strong>{formatAUD(breakdown.weekly)}</strong> per week or <strong>{formatAUD(breakdown.monthly)}</strong> per month in your pocket.
        </p>
        <p className="text-navy leading-relaxed">
          This breakdown deducts {formatAUD(breakdown.netIncomeTax)} in income tax and {formatAUD(breakdown.medicareLevy)} in Medicare levy.
          {withHecs.hecsRepayment > 0
            ? ` If you have a HECS-HELP debt, the compulsory repayment of ${formatAUD(withHecs.hecsRepayment)} lowers your take-home pay to ${formatAUD(withHecs.takeHomePay)} a year (${formatAUD(withHecs.weekly)} a week).`
            : ` A HECS-HELP debt would not change this: ${formattedSalary} is below the ${formatAUD(HECS_HELP.minimumThreshold)} compulsory repayment threshold.`}
          Your employer also contributes {formatAUD(employerSuper)} in superannuation on top of your salary{facts.superCapped ? ", the most SG requires because earnings above the maximum contribution base attract none" : " at the 12% SG rate"}.
          Use our <a href="/take-home-pay-calculator/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Take-Home Pay Calculator</a> to model different salary scenarios.
        </p>
        <EarningsPosition salary={salary} />
      </section>

      <TrustBar />

      {/* Full Pay Breakdown */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">Full Pay Breakdown on {formattedSalary}</h2>
        <p className="text-navy leading-relaxed mb-6">
          Here is every component of your pay on {formattedSalary}, from gross salary down to net take-home pay. Your effective tax rate is {effectiveRate}%, meaning you keep {(100 - parseFloat(effectiveRate)).toFixed(1)}% of your gross salary.
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
                  <td className="px-6 py-4">Medicare Levy</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.medicareLevy)}</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.medicareLevy / 12)}</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.medicareLevy / 26)}</td>
                  <td className="px-6 py-4 text-right">−{formatAUD(breakdown.medicareLevy / 52)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 text-warmgray">Superannuation (employer-paid)</td>
                  <td className="px-6 py-4 text-right text-warmgray">+{formatAUD(employerSuper)}</td>
                  <td className="px-6 py-4 text-right text-warmgray">+{formatAUD(employerSuper / 12)}</td>
                  <td className="px-6 py-4 text-right text-warmgray">+{formatAUD(employerSuper / 26)}</td>
                  <td className="px-6 py-4 text-right text-warmgray">+{formatAUD(employerSuper / 52)}</td>
                </tr>
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
          Super is paid by your employer on top of your salary. Your total remuneration package is <strong>{formatAUD(totalPackage)}</strong>. See our <a href="/income-tax-calculator/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Income Tax Calculator</a> for a detailed tax breakdown.
        </p>
      </section>

      {/* Pay Frequency Table */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">Take-Home Pay by Frequency</h2>
        <p className="text-navy leading-relaxed mb-6">
          Your net pay from a {formattedSalary} salary broken down across every common pay frequency, including hourly rate based on a standard 38-hour week.
        </p>
        <Card className="overflow-hidden border-sandstone-dark/10 shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-sandstone text-navy font-semibold border-b border-sandstone-dark/10">
                <tr>
                  <th className="px-6 py-4">Frequency</th>
                  <th className="px-6 py-4 text-right">Gross Pay</th>
                  <th className="px-6 py-4 text-right">Net Take-Home</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Annual</td>
                  <td className="px-6 py-4 text-right">{formatAUD(salary)}</td>
                  <td className="px-6 py-4 text-right font-medium text-navy">{formatAUD(breakdown.takeHomePay)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Monthly</td>
                  <td className="px-6 py-4 text-right">{formatAUD(salary / 12)}</td>
                  <td className="px-6 py-4 text-right font-medium text-navy">{formatAUD(breakdown.monthly)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Fortnightly</td>
                  <td className="px-6 py-4 text-right">{formatAUD(salary / 26)}</td>
                  <td className="px-6 py-4 text-right font-medium text-navy">{formatAUD(breakdown.fortnightly)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Weekly</td>
                  <td className="px-6 py-4 text-right">{formatAUD(salary / 52)}</td>
                  <td className="px-6 py-4 text-right font-medium text-navy">{formatAUD(breakdown.weekly)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Daily (7.6 hrs)</td>
                  <td className="px-6 py-4 text-right">{formatAUD(salary / 260, 2)}</td>
                  <td className="px-6 py-4 text-right font-medium text-navy">{formatAUD(breakdown.daily, 2)}</td>
                </tr>
                <tr className="hover:bg-sandstone/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-navy">Hourly (38 hrs/wk)</td>
                  <td className="px-6 py-4 text-right">{formatAUD(hourlyGross, 2)}</td>
                  <td className="px-6 py-4 text-right font-medium text-navy">{formatAUD(hourlyNet, 2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Tax Bracket Breakdown */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">How Is Tax Calculated on {formattedSalary}?</h2>
        <p className="text-navy leading-relaxed mb-4">
          Australia uses progressive marginal tax rates. Your {formattedSalary} salary is split across multiple brackets, with each portion taxed at its corresponding rate. The table below shows the exact tax calculated in each bracket for FY{SITE_CONFIG.financialYear}.
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
          Your marginal tax rate is {marginalRate}% (including Medicare). This is the rate on each additional dollar earned. Your effective rate of {effectiveRate}% is lower because income is taxed progressively. View the full <a href="/tax-brackets/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Australian Tax Brackets</a> for all thresholds and rates.
        </p>
      </section>

      <SalaryBandNotes salary={salary} />

      <NextThousand salary={salary} />

      <NeighbourTable salary={salary} family="take-home" />

      <SalaryNav salary={salary} family="take-home" />

      {/* Ways to Increase Take-Home Pay */}
      <section className="bg-eucalyptus-light/20 rounded-xl p-8 border border-eucalyptus/20">
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">Ways to Increase Your Take-Home Pay</h2>
        <p className="text-navy leading-relaxed mb-4">
          On {formattedSalary}, your marginal tax rate is {marginalRatePercent}%. These strategies can reduce your taxable income and increase your net pay:
        </p>
        <ul className="text-navy space-y-3">
          <li>
            <strong>Salary sacrifice to super</strong> — concessional contributions up to {formatAUD(SUPER_GUARANTEE.concessionalCap)} a year (employer SG included) are taxed at 15% inside super{facts.division293 > 0 ? " (30% with Division 293)" : ""}. On {formattedSalary}, each $1,000 sacrificed costs {formatAUD(sacrifice.takeHomeCost)} of take-home and adds {formatAUD(sacrifice.intoSuper)} to super. Model the savings with our <a href="/salary-sacrifice-calculator/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Salary Sacrifice Calculator</a>.
          </li>
          <li>
            <strong>Maximise tax deductions</strong> — work-related expenses, home office costs, and self-education reduce taxable income dollar-for-dollar. See our <a href="/tax-deductions-guide/" className="text-eucalyptus hover:text-navy transition-colors font-medium">Tax Deductions Guide</a> for what you can claim.
          </li>
          <li>
            <strong>Novated lease</strong> — packaging a vehicle through your employer reduces pre-tax salary, lowering both income tax and Medicare levy.
          </li>
        </ul>
      </section>

      {/* Related Calculators */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-4">Related Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/take-home-pay-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Take-Home Pay Calculator</p>
            <p className="text-sm text-warmgray">Calculate net pay on any salary with all deductions for FY{SITE_CONFIG.financialYear}.</p>
          </a>
          <a href="/income-tax-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Income Tax Calculator</p>
            <p className="text-sm text-warmgray">Detailed bracket-by-bracket tax breakdown for any salary.</p>
          </a>
          <a href="/salary-sacrifice-calculator/" className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Salary Sacrifice Calculator</p>
            <p className="text-sm text-warmgray">Model how salary sacrifice to super increases your take-home pay.</p>
          </a>
          <a href="/tax-brackets/" className="block rounded-xl border border-sandstone-dark/20 p-5 hover:bg-sandstone transition-colors">
            <p className="font-semibold text-navy mb-1">Tax Brackets {SITE_CONFIG.financialYear}</p>
            <p className="text-sm text-warmgray">Full table of ATO marginal tax rates and income thresholds.</p>
          </a>
        </div>
      </section>

      {/* FAQs */}
      <section>
        <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-navy mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full space-y-4">
          {takeHomePayOnSalaryFaqs(salary).map((f, i) => (
            <AccordionItem key={f.q} value={`item-${i + 1}`} className="bg-white border rounded-lg px-4 shadow-sm">
              <AccordionTrigger className="text-left font-semibold text-navy py-4 hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-warmgray pb-4 leading-relaxed">
                <FaqAnswer faq={f} linkClassName="text-eucalyptus hover:text-navy transition-colors font-medium" />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <MethodologyDisclosure>
        <p className="mb-2 text-sm text-warmgray">Calculations are based on the following general rules and assumptions:</p>
        <ol className="list-decimal pl-4 space-y-1 text-sm text-warmgray">
          <li><strong>Income Tax:</strong> Calculated using the official ATO progressive marginal tax rates for resident individuals for FY{SITE_CONFIG.financialYear}.</li>
          <li><strong>Medicare Levy:</strong> 2%, shaded in for low incomes using the {SITE_CONFIG.previousFinancialYear} low-income thresholds (the latest the ATO has published). Assumes private hospital cover, so no Medicare Levy Surcharge.</li>
          <li><strong>Superannuation:</strong> Calculated at the 12% Super Guarantee rate on top of the stated salary, not deducted from it, and capped at the {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} maximum contribution base.</li>
          <li><strong>HECS-HELP:</strong> Not deducted from the headline figures, which assume no study loan. Where salary exceeds the {formatAUD(HECS_HELP.minimumThreshold)} minimum repayment threshold, the repayment under the marginal system is shown separately.</li>
        </ol>
      </MethodologyDisclosure>
      <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </div>
  );
}

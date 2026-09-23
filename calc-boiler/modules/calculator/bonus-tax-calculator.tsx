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
  bonusTaxSplit,
  calculatePayBreakdown,
  formatAUD,
  formatNegAUD,
  formatPercent,
  TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
  TAX_FREE_THRESHOLD,
  HECS_HELP,
  SUPER_GUARANTEE,
  MEDICARE_LEVY,
  SOURCES,
  SITE_CONFIG,
} from "@/lib/constants";
import { BONUS_TAX_FAQS, BONUS_5K, BONUS_5K_ROWS } from "./bonus-tax-faqs";
import { RelatedSearches, type RelatedSearch } from "@/modules/seo/related-searches";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

// Google AU "related searches" for "bonus tax calculator" / "how much tax on
// bonus australia" (Sept 2026), each pointed at the page that answers it.
const RELATED_SEARCHES: readonly RelatedSearch[] = [
  { label: "Schedule 5 tax calculator", href: "/schedule-5-tax-table/" },
  { label: "Tax withheld calculator", href: "/tax-withheld-calculator/" },
  { label: "Tax rate on commission", href: "/commission-tax-calculator/" },
  { label: "Back pay tax calculator", href: "/backpay-calculator/" },
  { label: "Weekly tax calculator", href: "/weekly-pay-calculator/" },
  { label: "Monthly pay calculator", href: "/monthly-pay-calculator/" },
];

const SOURCES_LIST: SourceLink[] = [
  { title: "Schedule 5 – Tax table for back payments", url: "https://www.ato.gov.au/tax-rates-and-codes/schedule-5-tax-table-for-back-payments-commissions-bonuses-and-similar-payments", publisher: SOURCES.ato.name },
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

// Static worked-example figures ($90,000 base + $10,000 bonus), computed by
// the same engine as the calculator above them so the prose can never drift
// from what the tool outputs.
const EX_BASE = calculatePayBreakdown({ grossSalary: 90_000 });
const EX_COMBINED = calculatePayBreakdown({ grossSalary: 100_000 });
const EX_TAX_ON_BONUS = EX_COMBINED.totalDeductions - EX_BASE.totalDeductions;
const EX_NET_BONUS = 10_000 - EX_TAX_ON_BONUS;
const FY = SITE_CONFIG.financialYear;
const SG_PCT = formatPercent(SUPER_GUARANTEE.rate, 0);
const allIn = (rate: number) => rate + MEDICARE_LEVY.rate;
// Salary sacrifice of a $10,000 bonus at $120,000 (stays in the 30% bracket):
// marginal rate + Medicare levy avoided, less 15% contributions tax.
const SS_SAVING_120K = Math.round(10_000 * (allIn(TAX_BRACKETS[2].rate) - 0.15));
const SG_ON_120K = Math.round(120_000 * SUPER_GUARANTEE.rate);
// Deferral example: the same $10,000 bonus taxed in the 30% vs second bracket.
const DEFER_HIGH = Math.round(10_000 * allIn(TAX_BRACKETS[2].rate));
const DEFER_LOW = Math.round(10_000 * allIn(TAX_BRACKETS[1].rate));

// Year-over-year saving from the FY2026-27 rate cut (16% → 15% on the second
// bracket) for anyone earning at least the top of that bracket.
const RATE_CUT_SAVING = Math.round(
  (TAX_BRACKETS[1].max - TAX_FREE_THRESHOLD) * (TAX_BRACKETS_2025_26[1].rate - TAX_BRACKETS[1].rate)
);

export default function BonusTaxCalculatorPage() {
  const [baseSalary, setBaseSalary] = useState(90_000);
  const [bonusAmount, setBonusAmount] = useState(10_000);

  // Income tax and Medicare rows are each the with/without-bonus difference, so
  // they always add up to the total (QA 24 Sep 2026: "bonus × top marginal
  // rate" overstated the rows when the bonus crossed a bracket).
  const split = useMemo(() => bonusTaxSplit(baseSalary, bonusAmount), [baseSalary, bonusAmount]);

  const taxOnBonus = split.total;
  const netBonus = split.net;
  const effectiveBonusTaxRate = bonusAmount > 0 ? taxOnBonus / bonusAmount : 0;

  // Find marginal bracket for the combined income
  const combinedIncome = baseSalary + bonusAmount;
  let marginalRate = 0;
  for (const bracket of TAX_BRACKETS) {
    if (combinedIncome >= bracket.min) {
      marginalRate = bracket.rate;
    }
  }

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
            Bonus Tax Calculator Australia
          </h1>
          <p className="text-lg text-warmgray">
            Work out the extra tax you&apos;ll actually owe on a bonus or commission payment for the year.
            See the marginal tax rate applied to your lump sum and your actual take-home bonus.
          </p>
          <TrustBar className="mt-4" />
        </section>

        {/* CALCULATOR */}
        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-6">How Much Tax on Your Bonus?</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
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
                      onChange={(e) => setBaseSalary(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
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
                      onChange={(e) => setBonusAmount(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
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
                      <Row label={`Income Tax (${formatPercent(marginalRate, 0)} marginal rate)`} value={formatNegAUD(split.incomeTax)} />
                      <Row label={`Medicare Levy (${formatPercent(MEDICARE_LEVY.rate, 0)})`} value={formatNegAUD(split.medicare)} />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label="Total Tax on Bonus" value={formatNegAUD(taxOnBonus)} />
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
              This calculator works out <strong>the extra tax you&apos;ll actually owe on your bonus for the year</strong>. It compares two figures: the annual tax on your base salary alone, and the annual tax on your base salary plus the bonus. The difference between those two figures is the tax the bonus adds to your annual bill &mdash; the part of the bonus you don&apos;t keep.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Step-by-Step Worked Example</h3>
            <p className="mb-3 text-warmgray">
              An employee earns a base salary of <strong>$90,000</strong> and receives a <strong>$10,000</strong> performance bonus. The bonus tax calculation follows 4 steps:
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-warmgray mb-4">
              <li><strong>Calculate tax on base salary ($90,000):</strong> Income tax is <strong>{formatAUD(EX_BASE.netIncomeTax)}</strong> (using FY{SITE_CONFIG.financialYear} brackets). Add the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy of <strong>{formatAUD(EX_BASE.medicareLevy)}</strong>. LITO is nil at this income. Total deductions on base salary: <strong>{formatAUD(EX_BASE.totalDeductions)}</strong>.</li>
              <li><strong>Calculate tax on combined income ($100,000):</strong> Income tax is <strong>{formatAUD(EX_COMBINED.netIncomeTax)}</strong>. Medicare levy is <strong>{formatAUD(EX_COMBINED.medicareLevy)}</strong>. Total deductions on combined income: <strong>{formatAUD(EX_COMBINED.totalDeductions)}</strong>.</li>
              <li><strong>Find the difference:</strong> {formatAUD(EX_COMBINED.totalDeductions)} &minus; {formatAUD(EX_BASE.totalDeductions)} = <strong>{formatAUD(EX_TAX_ON_BONUS)}</strong> in tax attributable to the bonus.</li>
              <li><strong>Calculate take-home bonus:</strong> $10,000 &minus; {formatAUD(EX_TAX_ON_BONUS)} = <strong>{formatAUD(EX_NET_BONUS)}</strong> net bonus. The effective tax rate on the bonus is <strong>{formatPercent(EX_TAX_ON_BONUS / 10_000, 0)}</strong> ({formatPercent(TAX_BRACKETS[2].rate, 0)} marginal rate + {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy).</li>
            </ol>
            <p className="text-warmgray">
              This is the same annualised logic the tax system settles on when you lodge your return. Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> to verify your base salary tax figures independently.
            </p>
          </section>

          {/* --- H2: Bonus Tax vs Employer Withholding --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Bonus Tax vs Employer Withholding &mdash; What&apos;s the Difference?</h2>
            <p className="mb-4 text-warmgray">
              There are two different numbers people call &quot;tax on my bonus,&quot; and they rarely match to the dollar. This page calculates the first one: <strong>the extra tax you&apos;ll actually owe on your bonus for the year</strong> &mdash; the amount the bonus adds to your annual tax liability.
            </p>
            <p className="mb-4 text-warmgray">
              The second number is what your employer takes out of the bonus paycheque itself. That is <strong>PAYG withholding</strong>, calculated under the ATO&apos;s Schedule 5 tax table for back payments, commissions and bonuses. Schedule 5 works from your regular pay-period withholding amounts rather than your finished annual return, so the amount withheld from the paycheque can be somewhat more or less than the tax the bonus ultimately adds to your year.
            </p>
            <p className="text-warmgray">
              Any gap settles itself when you lodge: if your employer withheld more than the bonus&apos;s real tax cost, the difference comes back as part of your refund; if less, it reduces your refund or adds to a bill. For the withholding side &mdash; what will actually be taken out of the paycheque &mdash; see our <Link href="/schedule-5-tax-table/" className="text-eucalyptus-dark hover:underline">Schedule 5 tax table guide</Link>.
            </p>
          </section>

          {/* --- H2: What Tax Rate Applies to Bonuses? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Tax Rate Applies to Bonuses in Australia?</h2>
            <p className="mb-4 text-warmgray">
              Bonuses are taxed at your <strong>marginal tax rate plus the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy</strong>, not a flat &quot;bonus tax rate.&quot; The marginal rate depends on which income tax bracket your combined salary and bonus falls into for FY{SITE_CONFIG.financialYear}.
            </p>
            <p className="mb-4 text-warmgray">
              Australia does not have a separate bonus tax rate. A bonus is simply added to your taxable income for the year and taxed under the standard individual income tax brackets &mdash; so the extra tax you owe depends on the bracket your combined salary and bonus reaches.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">FY{SITE_CONFIG.financialYear} Tax Brackets Applied to Bonuses</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Taxable Income</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Marginal Rate</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">+ Medicare ({formatPercent(MEDICARE_LEVY.rate, 0)})</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Total on Bonus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TAX_BRACKETS.map((b) => (
                    <tr key={b.min} className="hover:bg-sandstone">
                      <td className="px-4 py-3 text-navy">{b.max === Infinity ? `${formatAUD(b.min)}+` : `${formatAUD(b.min)} – ${formatAUD(b.max)}`}</td>
                      <td className="px-4 py-3 text-right text-warmgray">{formatPercent(b.rate, 0)}</td>
                      <td className="px-4 py-3 text-right text-warmgray">{formatPercent(MEDICARE_LEVY.rate, 0)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-navy"><strong>{formatPercent(b.rate + MEDICARE_LEVY.rate, 0)}</strong></td>
                    </tr>
                  ))}
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
              <li><strong>Small business owners and payroll officers</strong> cross-checking that the PAYG amount withheld under ATO Schedule 5 lines up with the tax a bonus actually adds to an employee&apos;s year</li>
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
                    <td className="px-4 py-3 text-warmgray"><strong>{formatPercent(EX_BASE.effectiveTaxRate)}</strong> (including Medicare)</td>
                    <td className="px-4 py-3 text-warmgray"><strong>{formatPercent(TAX_BRACKETS[2].rate + MEDICARE_LEVY.rate, 0)}</strong> ({formatPercent(TAX_BRACKETS[2].rate, 0)} + {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare)</td>
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
                    <td className="px-4 py-3 text-navy font-medium">Employer withholding method</td>
                    <td className="px-4 py-3 text-warmgray">ATO Schedule 1 (regular pay cycles)</td>
                    <td className="px-4 py-3 text-warmgray">ATO Schedule 5 (supplementary payments)</td>
                  </tr>
                  <tr className="hover:bg-sandstone">
                    <td className="px-4 py-3 text-navy font-medium">Super guarantee ({formatPercent(SUPER_GUARANTEE.rate, 0)})</td>
                    <td className="px-4 py-3 text-warmgray">Applies to ordinary earnings</td>
                    <td className="px-4 py-3 text-warmgray">Applies if bonus is qualifying earnings</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray">
              The effective tax rate on a $10,000 bonus for an employee on $90,000 base salary is <strong>{formatPercent(EX_TAX_ON_BONUS / 10_000, 0)}</strong>, compared to an overall effective rate of approximately <strong>{formatPercent(EX_BASE.effectiveTaxRate)}</strong> on their regular salary. The difference arises because the {formatAUD(TAX_FREE_THRESHOLD)} tax-free threshold and lower brackets are already used by the base salary. Use the <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to explore whether pre-tax contributions reduce your bonus tax impact.
            </p>
          </section>

          {/* --- Worked Examples Table (original) --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Much Tax Do You Pay on Common Bonus Amounts?</h2>
            <p className="mb-4 text-warmgray">
              The tax on a bonus ranges from <strong>{formatPercent(TAX_BRACKETS[1].rate + MEDICARE_LEVY.rate, 0)} to {formatPercent(TAX_BRACKETS[TAX_BRACKETS.length - 1].rate + MEDICARE_LEVY.rate, 0)}</strong> depending on your combined salary and bonus total. The table below shows worked examples across 5 salary levels for FY{SITE_CONFIG.financialYear}.
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
                    for (const b of TAX_BRACKETS) { if (salary + bonus >= b.min) mr = b.rate; }
                    return (
                      <tr key={salary} className="hover:bg-sandstone">
                        <td className="px-4 py-3 text-navy">{formatAUD(salary)}</td>
                        <td className="px-4 py-3 text-right text-navy">{formatAUD(bonus)}</td>
                        <td className="px-4 py-3 text-right text-warmgray">{formatPercent(mr + MEDICARE_LEVY.rate, 0)}</td>
                        <td className="px-4 py-3 text-right text-ochre">{formatNegAUD(tax)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-navy">{formatAUD(bonus - tax)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* --- H2: $5,000 bonus (PAA target: answer paragraph + compact table) --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Much Tax Will I Pay on a $5,000 Bonus?</h2>
            <p className="mb-4 text-warmgray">
              A {formatAUD(BONUS_5K)} bonus usually costs between <strong>{formatAUD(Math.min(...BONUS_5K_ROWS.map((r) => r.tax)))}</strong> and <strong>{formatAUD(Math.max(...BONUS_5K_ROWS.map((r) => r.tax)))}</strong> in tax for FY{SITE_CONFIG.financialYear}, depending on your salary. It is taxed at your marginal rate plus the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy, so a higher salary generally leaves less of the bonus in your pocket.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <caption className="sr-only">Tax on a {formatAUD(BONUS_5K)} bonus by salary, FY{SITE_CONFIG.financialYear}</caption>
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Tax on {formatAUD(BONUS_5K)}</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">You keep</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {BONUS_5K_ROWS.map((r) => (
                    <tr key={r.salary} className="hover:bg-sandstone">
                      <td className="px-4 py-3 text-navy">{formatAUD(r.salary)}</td>
                      <td className="px-4 py-3 text-right text-ochre">{formatAUD(r.tax)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-navy">{formatAUD(r.net)}</td>
                      <td className="px-4 py-3 text-right text-warmgray">{formatPercent(r.rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray">
              Resident rates, no HECS-HELP debt, full year of salary. Your employer may withhold a slightly different amount from the bonus pay; the difference is settled when you lodge your return.
            </p>
          </section>

          {/* --- H2: What Changed in FY2026-27? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Changed for Bonus Tax in FY{SITE_CONFIG.financialYear}?</h2>
            <p className="mb-4 text-warmgray">
              From 1 July 2026, the marginal rate for the {formatAUD(TAX_BRACKETS[1].min)}&ndash;{formatAUD(TAX_BRACKETS[1].max)} bracket fell from <strong>{formatPercent(TAX_BRACKETS_2025_26[1].rate, 0)} to {formatPercent(TAX_BRACKETS[1].rate, 0)}</strong> &mdash; the first bracket change since the Stage 3 cuts of July 2024, which had already lowered the middle bracket from 32.5% to 30%.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray mb-4">
              <li>The <strong>{formatPercent(TAX_BRACKETS[1].rate, 0)}</strong> rate now applies from <strong>{formatAUD(TAX_BRACKETS[1].min)} to {formatAUD(TAX_BRACKETS[1].max)}</strong> ({formatPercent(TAX_BRACKETS_2025_26[1].rate, 0)} in FY2025-26), so a bonus landing in that bracket is taxed at <strong>{formatPercent(TAX_BRACKETS[1].rate + MEDICARE_LEVY.rate, 0)}</strong> including Medicare, down from {formatPercent(TAX_BRACKETS_2025_26[1].rate + MEDICARE_LEVY.rate, 0)}</li>
              <li>The brackets above {formatAUD(TAX_BRACKETS[1].max)} are unchanged &mdash; {formatPercent(TAX_BRACKETS[2].rate, 0)} to {formatAUD(TAX_BRACKETS[2].max)}, {formatPercent(TAX_BRACKETS[3].rate, 0)} to {formatAUD(TAX_BRACKETS[3].max)}, then {formatPercent(TAX_BRACKETS[4].rate, 0)} &mdash; so most bonus recipients see the same marginal rate on the bonus itself</li>
              <li>Everyone earning {formatAUD(TAX_BRACKETS[1].max)} or more still pays <strong>{formatAUD(RATE_CUT_SAVING)}</strong> less tax across the year from the rate cut</li>
              <li>Payday Super commenced on {SUPER_GUARANTEE.paydaySuperStart}: if your bonus attracts the {formatPercent(SUPER_GUARANTEE.rate, 0)} superannuation guarantee, the contribution now reaches your fund within days of the payment instead of up to a quarter later</li>
            </ul>
            <p className="text-warmgray">
              An employee on $90,000 receiving a $10,000 bonus pays <strong>{formatAUD(EX_TAX_ON_BONUS)}</strong> in tax on the bonus ({formatPercent(EX_TAX_ON_BONUS / 10_000, 0)}) &mdash; the same as FY2025-26, because both figures sit in the unchanged {formatPercent(TAX_BRACKETS[2].rate, 0)} bracket. Their saving shows up in the annual tax bill instead. Check the full impact on your salary using our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link>.
            </p>
          </section>

          {/* --- H2: What Are Common Bonus Tax Mistakes? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are Common Bonus Tax Mistakes?</h2>
            <p className="mb-4 text-warmgray">
              The most common mistake is assuming bonuses are taxed at a flat &quot;bonus rate&quot; &mdash; they are taxed at your <strong>marginal rate</strong>, which depends on your total assessable income.
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-warmgray mb-4">
              <li><strong>Confusing marginal rate with effective rate:</strong> Employees see a bonus taxed at {formatPercent(TAX_BRACKETS[2].rate + MEDICARE_LEVY.rate, 0)} and believe their entire salary is taxed at that rate. The effective rate on a $90,000 salary is approximately {formatPercent(EX_BASE.effectiveTaxRate)}. The bonus is taxed at the marginal rate because it sits on top of existing income.</li>
              <li><strong>Forgetting the Medicare levy:</strong> The {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy applies to bonuses on top of the income tax rate. A {formatPercent(TAX_BRACKETS[2].rate, 0)} marginal bracket results in <strong>{formatPercent(TAX_BRACKETS[2].rate + MEDICARE_LEVY.rate, 0)} total</strong> tax on the bonus, not {formatPercent(TAX_BRACKETS[2].rate, 0)}.</li>
              <li><strong>Ignoring bracket crossover:</strong> A $5,000 bonus on a $133,000 salary pushes total income from the {formatPercent(TAX_BRACKETS[2].rate, 0)} bracket into the {formatPercent(TAX_BRACKETS[3].rate, 0)} bracket. The first $2,000 of the bonus is taxed at {formatPercent(TAX_BRACKETS[2].rate + MEDICARE_LEVY.rate, 0)} and the remaining $3,000 at {formatPercent(TAX_BRACKETS[3].rate + MEDICARE_LEVY.rate, 0)}.</li>
              <li><strong>Not accounting for HECS-HELP:</strong> Employees with a HELP debt owe a larger compulsory repayment when a bonus lifts their repayment income. A bonus that pushes total income above the {formatAUD(HECS_HELP.minimumThreshold)} HECS threshold triggers a repayment obligation at your return. Use the <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> to check your repayment liability.</li>
              <li><strong>Assuming super is never paid on bonuses:</strong> The {formatPercent(SUPER_GUARANTEE.rate, 0)} superannuation guarantee applies to bonuses that count as qualifying earnings &mdash; which includes performance, Christmas, sign-on and referral bonuses. Only a bonus paid solely for work performed entirely outside your ordinary hours is excluded.</li>
            </ol>
            <p className="text-warmgray">
                Looking for the Age Pension <strong>Work Bonus</strong>? That is not a bonus payment but an income-test offset for working pensioners &mdash; see the <Link href="/age-pension-income-test-calculator/" className="text-eucalyptus-dark hover:underline font-medium">Age Pension income test calculator</Link>.
              </p>
            </section>

          {/* --- H2: Commission vs Bonus (original, kept) --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Is There a Difference Between Commission Tax and Bonus Tax?</h2>
            <p className="mb-4 text-warmgray">
              From a tax perspective, <strong>no</strong>. The ATO treats bonuses, commissions, and similar one-off payments identically: both are added to your annual income and taxed at your marginal rate, and on the withholding side both are supplementary payments under Schedule 5. Whether your payment is called a &quot;performance bonus,&quot; &quot;sales commission,&quot; or &quot;incentive payment,&quot; the tax calculation is the same.
            </p>
            <p className="text-warmgray">
              The only practical difference is frequency: commissions are often paid monthly or quarterly, while bonuses tend to be annual or one-off. Frequent commission payments can trigger PAYG instalment obligations if your total income exceeds ATO thresholds. Track your annual earnings using the <Link href="/annual-pay-calculator/" className="text-eucalyptus-dark hover:underline">Annual Pay Calculator</Link>.
            </p>
            <p className="text-warmgray">
                Paid commission rather than a bonus? The <Link href="/commission-tax-calculator/" className="text-eucalyptus-dark hover:underline font-medium">commission tax calculator</Link> shows the same two figures — the tax it adds to your year and the Schedule 5 withholding on the pay — for retainer-plus-commission, quarterly and commission-only structures.
              </p>
            </section>

{/* Merged from /bonus-tax-calculator/ on 2026-08-28 — the guide 301s here (GSC: same query network, split ranking). */}
                      <section id="tax-back-on-bonus">
              <h2>Do You Get Tax Back on Bonuses?</h2>
              <p>
                You receive a tax refund on your bonus only if your employer withheld more tax than your actual liability — the Schedule 5 method minimises this gap, so most refunds on bonus withholding are <strong>small or zero</strong>.
              </p>
              <p>
                Over-withholding happens in 3 common scenarios:
              </p>
              <ul>
                <li><strong>Bonus paid early in the financial year</strong> — the employer projects a full year of income, but you change jobs or reduce hours mid-year, lowering your actual taxable income</li>
                <li><strong>Employer uses flat-rate annualisation</strong> instead of Schedule 5 — some payroll systems annualise the pay period containing the bonus, producing a higher withholding rate</li>
                <li><strong>Significant tax deductions</strong> — work-related expenses, salary sacrifice contributions, or the &quot;Low Income Tax Offset&quot; reduce your assessable income below the projected amount</li>
              </ul>
              <p>
                When you lodge your tax return, the ATO calculates your actual tax liability on total income (salary plus bonus) and compares it to total PAYG withholding throughout the year. The difference is your refund or balance owing. See our <Link href="/tax-refund-guide/">Tax Refund Guide</Link> for a full explanation of how refunds are calculated.
              </p>
            </section>
            <section id="reduce-bonus-tax">
              <h2>How to Reduce Tax on Your Bonus</h2>
              <p>
                The most effective way to reduce tax on a bonus is to salary sacrifice it into superannuation, converting a marginal rate of up to <strong>47%</strong> into a flat <strong>15%</strong> contributions tax.
              </p>
              <h3>Strategy 1: Salary Sacrifice Into Super</h3>
              <p>
                Directing part or all of a bonus into superannuation as a concessional (before-tax) contribution reduces taxable income. The contribution is taxed at only <strong>15%</strong> inside the super fund, compared to marginal rates of 30%–47% outside super. A worker on $120,000 who sacrifices a $10,000 bonus saves approximately <strong>{formatAUD(SS_SAVING_120K)}</strong> in tax ({formatAUD(DEFER_HIGH)} at the marginal rate plus Medicare levy, minus $1,500 in super contributions tax).
              </p>
              <p>
                The concessional contribution cap for FY{FY} is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> per year, including employer SG contributions of {SG_PCT}. A worker earning $120,000 receives {formatAUD(SG_ON_120K)} in SG, leaving <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap - SG_ON_120K)}</strong> of cap space for salary sacrifice. Workers with unused cap space from previous years (where their super balance was below $500,000 on 30 June) can carry forward up to 5 years of unused amounts. See our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Guide</Link> for a detailed walkthrough.
              </p>

              <h3>Strategy 2: Time the Bonus Payment</h3>
              <p>
                A bonus is assessable income in the financial year it is <em>paid</em>, not the year it is earned. If you expect lower income next financial year — due to parental leave, career break, or part-time work — ask your employer to defer the bonus payment into the new financial year. A $10,000 bonus taxed at the {formatPercent(TAX_BRACKETS[2].rate, 0)} bracket costs <strong>{formatAUD(DEFER_HIGH)}</strong> in tax and Medicare levy. The same bonus taxed at the {formatPercent(TAX_BRACKETS[1].rate, 0)} bracket (if income drops below $45,000) costs about <strong>{formatAUD(DEFER_LOW)}</strong> &mdash; a saving of roughly <strong>{formatAUD(DEFER_HIGH - DEFER_LOW)}</strong>, before any Low Income Tax Offset effect.
              </p>

              <h3>Strategy 3: Maximise Deductions</h3>
              <p>
                Work-related deductions reduce your taxable income, potentially pulling bonus income down into a lower tax bracket. Common deductions that offset bonus taxation include self-education expenses, home office costs, professional memberships, and income protection insurance premiums. Every $1,000 in deductions at the 37% marginal rate reduces tax by <strong>$370</strong>.
              </p>
            </section>
            <section id="super-on-bonus">
              <h2>Is Superannuation Paid on Bonuses?</h2>
              <p>
                Bonuses for work performed are generally &quot;Ordinary Time Earnings&quot; (OTE) &mdash; and so qualifying earnings under Payday Super &mdash; and attract the <strong>{SG_PCT} Superannuation Guarantee</strong> for FY{FY}.
              </p>
              <p>
                Your employer pays the SG rate of {SG_PCT} on top of your bonus, depositing it into your super fund. A $10,000 performance bonus generates <strong>{formatAUD(10_000 * SUPER_GUARANTEE.rate)}</strong> in additional super contributions. The ATO&apos;s qualifying earnings table (Table 10) treats bonuses this way:
              </p>
              <ul>
                {/* ATO "What payments are qualifying earnings", Table 10 (verified 24 Sep 2026):
                    performance, Christmas, sign-on, referral and return-to-work bonuses are included;
                    only a bonus solely for work entirely outside ordinary hours is excluded. */}
                <li><strong>Performance and Christmas bonuses</strong> — included, attract the full {SG_PCT} SG</li>
                <li><strong>Sign-on bonuses for new employees</strong> — included</li>
                <li><strong>Referral bonuses</strong> — included</li>
                <li><strong>Bonus solely for work performed entirely outside ordinary hours</strong> — excluded (treated as overtime)</li>
              </ul>
              <p>
                Since Payday Super began, the maximum super contribution base is an annual figure &mdash; <strong>{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}</strong> for FY{FY}. Employers are not required to pay SG on qualifying earnings above this cap. For more detail on contribution limits and rates, see our <Link href="/superannuation-guide/">Superannuation Guide</Link>.
              </p>
            </section>
            <section id="lump-sum-e">
              {/* Verified via Firecrawl 24 Sep 2026:
                  ATO STP Phase 2 "Reporting back payments": lump sum E = back payment of remuneration
                  that accrued, or was payable, more than 12 months before the date of payment; the
                  $1,200 threshold no longer applies from 1 July 2025.
                  https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/single-touch-payroll/in-detail/single-touch-payroll-phase-2-employer-reporting-guidelines/reporting-the-amounts-you-have-paid/reporting-back-payments
                  ATO "Lump sum payment in arrears" (updated 8 Jun 2026): assessable in the year received;
                  ATO considers a LSPIA tax offset, Medicare levy exemption (from 1 Jul 2024) and MLS offset.
                  https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/income-you-must-declare/lump-sum-payment-in-arrears
                  Lump sum B is unused long service leave, not back pay. */}
              <h2>What Is Lump Sum E (Back Pay From Earlier Years)?</h2>
              <p>
                &quot;Lump Sum E&quot; is back pay for wages that accrued more than 12 months before you were paid. It is taxed in the year you receive it, but the ATO considers you for a tax offset, a Medicare levy exemption and a Medicare levy surcharge offset so you are not taxed more heavily just because the money arrived late.
              </p>
              <p>
                Your employer reports it separately as Lump Sum E on your income statement — since 1 July 2025 there is no minimum amount. When you lodge, you enter the breakdown of which years it relates to and the ATO works out the offset; the myTax estimate does not show it. Back pay for the last 12 months is simply part of your normal income. &quot;Lump Sum B&quot; is something different (unused long service leave) and is not back pay.
              </p>
              <p>
                Common examples of Lump Sum E payments include retrospective pay rises under enterprise agreements, back-paid award rate increases, and underpayment settlements. Use the <Link href="/backpay-calculator/">back pay calculator</Link> to estimate how much you are owed.
              </p>
            </section>

                    {/* --- H2: Related Calculators --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Which Related Calculators Help with Bonus Planning?</h2>
            <p className="mb-4 text-warmgray">
              Bonus tax is one component of your total tax position for the {SITE_CONFIG.financialYear} financial year. These Australian tax calculators address the broader picture:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray">
              <li><Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">Take-Home Pay Calculator</Link> &mdash; calculates your net pay after income tax, Medicare levy, HECS, and superannuation on your full salary including bonuses</li>
              <li><Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> &mdash; shows the exact income tax brackets and amounts applied to your total taxable income for FY{SITE_CONFIG.financialYear}</li>
              <li><Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> &mdash; models whether sacrificing part of your bonus into superannuation reduces your overall tax liability</li>
              <li><Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> &mdash; determines the {SG_PCT} SG contribution your employer pays on your bonus and base salary</li>
              <li><Link href="/tax-return-calculator/" className="text-eucalyptus-dark hover:underline">Tax Return Calculator</Link> &mdash; estimates whether you will receive a tax refund or owe a balance when you lodge your return after receiving bonus income</li>
            </ul>
          </section>

          <RelatedSearches items={RELATED_SEARCHES} />

          <MethodologyDisclosure>
            <p className="mb-2 text-sm">This calculator estimates tax on bonuses using the following method:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Calculates full-year tax liability with and without the bonus</li>
              <li>The difference represents the tax the bonus adds to your annual liability — the same annualised approach that underpins the ATO&apos;s Schedule 5 withholding method, but it is not a prediction of the exact amount withheld from the paycheque</li>
              <li>Includes income tax, LITO offset, and Medicare levy</li>
              <li>Does not include Medicare surcharge, HECS repayments, or salary sacrifice — use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark hover:underline">main pay calculator</Link> for the complete picture</li>
            </ul>
          </MethodologyDisclosure>

          {/* --- FAQs --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            {/*
              The Radix accordion unmounts closed content, so answers never
              reach the rendered HTML. This mirror makes them crawlable and
              AI-Overview eligible. The same array feeds the FAQPage JSON-LD in
              app/bonus-tax-calculator/page.tsx.
            */}
            <div className="sr-only">
              <h3>Bonus tax questions and answers</h3>
              {BONUS_TAX_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
            </div>
            <Accordion type="multiple" className="space-y-3">
              {BONUS_TAX_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="rounded-xl border border-sandstone-dark/20 px-5">
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent><p className="text-warmgray">{f.a}</p></AccordionContent>
                </AccordionItem>
              ))}
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

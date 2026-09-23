// Everything on /fortnightly-pay-calculator/ below the calculator card: fortnights
// in a year, worked example, tables, deductions, FAQ and sources. A server
// component, so it ships as HTML; fortnightly-pay-calculator.tsx (client)
// renders it via `children`.

import Link from "next/link";
import { RelatedSearches, type RelatedSearch } from "@/modules/seo/related-searches";
import FaqAccordion from "@/components/common/faq-accordion";
import { FORTNIGHTLY_FAQS, FORTNIGHTLY_TAX_ANSWER, FORTNIGHTLY_WITHHOLDING_ROWS } from "./fortnightly-pay-calculator-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import {
  calculatePayBreakdown,
  formatAUD,
  formatPercent,
  SUPER_GUARANTEE,
  HECS_HELP,
  SOURCES,
  SITE_CONFIG,
  TAX_BRACKETS,
  MEDICARE_LEVY,
} from "@/lib/constants";
import { FORTNIGHTLY_EXTRA_PAY, WEEKLY_EXTRA_PAY } from "@/modules/tax-tables/ato-schedules";
import { bracketRatesSentence, hecsBandsSentence } from "@/modules/calculator/fy-rate-copy";

// Google AU "related searches" for "fortnightly pay calculator" and
// "fortnightly tax calculator" (Sept 2026), each pointed at the page that answers it.
const RELATED_SEARCHES: readonly RelatedSearch[] = [
  { label: "Fortnightly tax table 2026-27", href: "/fortnightly-tax-table/" },
  { label: "Tax withheld calculator", href: "/tax-withheld-calculator/" },
  { label: "Weekly tax calculator", href: "/weekly-pay-calculator/" },
  { label: "Monthly salary calculator", href: "/monthly-pay-calculator/" },
  { label: "Pay calculator hourly rate", href: "/hourly-to-annual-salary-calculator/" },
  { label: "Take home pay calculator", href: "/take-home-pay-calculator/" },
];

const SOURCES_LIST: SourceLink[] = [
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "PAYG withholding fortnightly tax table", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-tables-overview", publisher: SOURCES.ato.name },
];

// Static worked example ($85,000), computed once at module scope.
const workedExample = calculatePayBreakdown({ grossSalary: 85_000, includeHECS: false, hasPrivateHealth: true });

export default function FortnightlyPayCalculatorContent() {
  return (
    <>

          {/* --- HOW MANY FORTNIGHTS IN A YEAR? --- */}
          {/* Targets "fortnights in a year" (2.4k/mo, KD 0; we ranked 69) and
              "if i get paid fortnightly how many paychecks in a year". The
              27-pay figures are the ATO's (ato-schedules.ts cites the page). */}
          <section id="fortnights-in-a-year">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Many Fortnights Are in a Year?</h2>
            <p className="text-navy mb-4">
              There are <strong>26 fortnights in a year</strong> (52 weeks &divide; 2), so most people paid fortnightly get 26 pays.
              Occasionally a financial year has <strong>{FORTNIGHTLY_EXTRA_PAY.extraPayCount} fortnightly pay days</strong>.
            </p>
            <p className="text-warmgray mb-4">
              26 fortnights cover 364 days (26 &times; 14), one day short of a normal year and two short of a leap year. That gap moves
              your pay day a day or two later each year, and about every 11 to 12 years a {FORTNIGHTLY_EXTRA_PAY.extraPayCount}th pay day
              falls inside the same financial year. Your salary does not rise that year; it is spread over one more pay, and the
              ATO&apos;s tax tables (which assume {FORTNIGHTLY_EXTRA_PAY.standardPayCount} pays) publish an optional extra amount you can
              ask your employer to withhold so you do not end up short at tax time. The{" "}
              <Link href="/fortnightly-tax-table/#27-pays" className="text-eucalyptus-dark hover:underline">fortnightly tax table</Link> page lists those amounts. To check whether your pay cycle has 27 pay days in 2026-27 and see every pay date, use the{" "}
              <Link href="/fortnights-in-a-year/" className="text-eucalyptus-dark hover:underline">fortnights in a year pay date calculator</Link>.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Pay cycle</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Pays in a normal year</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Pays in an extra-pay year</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr className="bg-eucalyptus-light/40">
                    <td className="px-4 py-3 font-medium text-navy">Fortnightly</td>
                    <td className="px-4 py-3 text-right font-bold text-navy">{FORTNIGHTLY_EXTRA_PAY.standardPayCount}</td>
                    <td className="px-4 py-3 text-right text-warmgray">{FORTNIGHTLY_EXTRA_PAY.extraPayCount}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Weekly</td>
                    <td className="px-4 py-3 text-right font-bold text-navy">{WEEKLY_EXTRA_PAY.standardPayCount}</td>
                    <td className="px-4 py-3 text-right text-warmgray">{WEEKLY_EXTRA_PAY.extraPayCount}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-navy">Monthly</td>
                    <td className="px-4 py-3 text-right font-bold text-navy">12</td>
                    <td className="px-4 py-3 text-right text-warmgray">Always 12</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* --- HOW IS FORTNIGHTLY PAY CALCULATED? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Is Fortnightly Pay Calculated?</h2>
            <p className="text-warmgray mb-4">
              Fortnightly pay is calculated by dividing your gross annual salary by <strong>26</strong>, then subtracting PAYG tax, the Medicare levy, and any HECS-HELP repayments from each fortnightly amount.
            </p>
            <p className="text-warmgray mb-4">
              The Australian Taxation Office publishes a dedicated PAYG withholding <Link href="/fortnightly-tax-table/" className="text-eucalyptus-dark hover:underline">fortnightly tax table</Link> that employers use to determine the exact tax withheld from each pay. This table accounts for the {TAX_BRACKETS.length} income tax brackets for FY2026-27, the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy, and the &quot;Low Income Tax Offset&quot; (LITO). Your employer divides your estimated annual taxation liability across 26 fortnights so the correct amount reaches the ATO throughout the year.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Worked Example: $85,000 Salary</h3>
            <p className="text-warmgray mb-4">
              An employee earning <strong>$85,000</strong> per year receives a gross fortnightly pay of <strong>{formatAUD(85_000 / 26, 2)}</strong>. The calculation follows 4 steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-warmgray mb-4">
              <li><strong>Gross fortnightly pay:</strong> $85,000 / 26 = <strong>{formatAUD(85_000 / 26, 2)}</strong></li>
              <li><strong>Income tax per fortnight:</strong> {formatAUD(workedExample.netIncomeTax)} annual tax / 26 = <strong>{formatAUD(workedExample.netIncomeTax / 26, 2)}</strong></li>
              <li><strong>Medicare levy per fortnight:</strong> {formatAUD(workedExample.medicareLevy)} / 26 = <strong>{formatAUD(workedExample.medicareLevy / 26, 2)}</strong></li>
              <li><strong>Fortnightly take-home pay:</strong> {formatAUD(85_000 / 26, 2)} - {formatAUD(workedExample.netIncomeTax / 26, 2)} - {formatAUD(workedExample.medicareLevy / 26, 2)} = <strong>{formatAUD(workedExample.fortnightly, 2)}</strong></li>
            </ol>
            <p className="text-warmgray mb-4">
              The employer also contributes <strong>{formatAUD(workedExample.superContribution / 26, 2)}</strong> in superannuation per fortnight at the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG rate. This amount does not reduce take-home pay. Use our <Link href="/superannuation-calculator/" className="text-eucalyptus-dark hover:underline">Superannuation Calculator</Link> to see how employer SG contributions grow over time.
            </p>
          </section>

          {/* --- TAX TAKEN OUT EACH FORTNIGHT (PAA: "How much tax do I pay if I get paid
              fortnightly?" / "How much will I get taxed each fortnight?") --- */}
          <section id="tax-each-fortnight">
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Much Tax Is Taken Out Each Fortnight?</h2>
            <p className="text-warmgray mb-4">{FORTNIGHTLY_TAX_ANSWER.a}</p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <caption className="sr-only">Tax withheld per fortnight, FY{SITE_CONFIG.financialYear}, tax-free threshold claimed</caption>
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Gross per fortnight</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Tax withheld</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Take-home</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Yearly equivalent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {FORTNIGHTLY_WITHHOLDING_ROWS.map((r) => (
                    <tr key={r.gross}>
                      <td className="px-4 py-3 text-navy font-medium">{formatAUD(r.gross)}</td>
                      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(r.withheld)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(r.net)}</td>
                      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(r.annual)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-warmgray">
              ATO fortnightly tax table amounts for a resident claiming the tax-free threshold, no HECS-HELP debt. See every $1 step on the <Link href="/fortnightly-tax-table/" className="text-eucalyptus-dark hover:underline">fortnightly tax table</Link>.
            </p>
          </section>

          {/* --- FORTNIGHTLY PAY TABLE --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Is the Fortnightly Pay for Each Annual Salary?</h2>
            <p className="text-warmgray mb-4">
              Fortnightly take-home pay ranges from <strong>{formatAUD(calculatePayBreakdown({ grossSalary: 50_000, includeHECS: false, hasPrivateHealth: true }).fortnightly, 2)}</strong> on a $50,000 salary to <strong>{formatAUD(calculatePayBreakdown({ grossSalary: 200_000, includeHECS: false, hasPrivateHealth: true }).fortnightly, 2)}</strong> on a $200,000 salary after tax and Medicare for FY{SITE_CONFIG.financialYear}.
            </p>
            <p className="text-warmgray mb-4">
              The table below shows fortnightly gross pay, fortnightly tax withheld, and fortnightly after-tax income at 8 common salary levels. All figures assume an Australian resident claiming the tax-free threshold, no HECS-HELP debt, and private health insurance held. Use the <Link href="/income-tax-calculator/" className="text-eucalyptus-dark hover:underline">Income Tax Calculator</Link> for a full annual breakdown at your exact salary.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Annual Salary</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Gross Fortnightly</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Fortnightly Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-navy">Fortnightly Take-Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <ComparisonRow salary={50000} />
                  <ComparisonRow salary={60000} />
                  <ComparisonRow salary={75000} />
                  <ComparisonRow salary={90000} />
                  <ComparisonRow salary={100000} />
                  <ComparisonRow salary={120000} />
                  <ComparisonRow salary={150000} />
                </tbody>
              </table>
            </div>
          </section>

          {/* --- WHO USES THIS CALCULATOR? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Who Uses a Fortnightly Pay Calculator?</h2>
            <p className="text-warmgray mb-4">
              Approximately <strong>45%</strong> of Australian employees receive fortnightly pay, making it the most common pay cycle in the country ahead of monthly and weekly frequencies.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-warmgray mb-4">
              <li><strong>Full-time employees</strong> checking their fortnightly net pay against their payslip to verify PAYG withholding accuracy</li>
              <li><strong>Job seekers</strong> converting an advertised annual salary into a fortnightly take-home figure to assess a new offer</li>
              <li><strong>Part-time workers</strong> estimating their fortnightly income after proportional tax deductions</li>
              <li><strong>Budgeters</strong> aligning fortnightly income with rent, loan repayments, and utility bills that fall on a 2-week cycle</li>
              <li><strong>HR and payroll managers</strong> verifying ATO fortnightly tax table withholding amounts before processing payroll</li>
            </ul>
            <p className="text-warmgray mb-4">
              Employees receiving a job offer that quotes an annual package use this Australian tax calculator to convert gross salary into a fortnightly take-home pay figure. For offers quoting an hourly rate instead, use our <Link href="/hourly-to-annual-salary-calculator/" className="text-eucalyptus-dark hover:underline">Hourly to Annual Salary Calculator</Link> to convert the rate first.
            </p>
          </section>

          {/* --- FORTNIGHTLY VS WEEKLY VS MONTHLY --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">How Does Fortnightly Pay Compare to Weekly and Monthly Pay?</h2>
            <p className="text-warmgray mb-4">
              Annual take-home pay is identical regardless of pay frequency. The difference is timing: fortnightly pay delivers <strong>26</strong> paychecks per year, weekly pay delivers <strong>52</strong>, and monthly pay delivers <strong>12</strong>.
            </p>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 mb-4">
              <table className="w-full text-sm">
                <thead className="bg-sandstone">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-navy">Feature</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Weekly</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Fortnightly</th>
                    <th className="px-4 py-3 text-center font-semibold text-navy">Monthly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Pay periods per year</td>
                    <td className="px-4 py-3 text-center text-warmgray">52</td>
                    <td className="px-4 py-3 text-center text-warmgray font-semibold">26</td>
                    <td className="px-4 py-3 text-center text-warmgray">12</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Gross per period ($85K salary)</td>
                    <td className="px-4 py-3 text-center text-warmgray">{formatAUD(85_000 / 52, 2)}</td>
                    <td className="px-4 py-3 text-center text-warmgray font-semibold">{formatAUD(85_000 / 26, 2)}</td>
                    <td className="px-4 py-3 text-center text-warmgray">{formatAUD(85_000 / 12, 2)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Take-home per period ($85K)</td>
                    <td className="px-4 py-3 text-center text-warmgray">{formatAUD(workedExample.weekly, 2)}</td>
                    <td className="px-4 py-3 text-center text-eucalyptus-dark font-semibold">{formatAUD(workedExample.fortnightly, 2)}</td>
                    <td className="px-4 py-3 text-center text-warmgray">{formatAUD(workedExample.monthly, 2)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">&quot;Bonus&quot; pay months per year</td>
                    <td className="px-4 py-3 text-center text-warmgray">4 months with 5 pays</td>
                    <td className="px-4 py-3 text-center text-warmgray font-semibold">2 months with 3 pays</td>
                    <td className="px-4 py-3 text-center text-warmgray">None</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-navy font-medium">Best for</td>
                    <td className="px-4 py-3 text-center text-warmgray">Casual, hourly workers</td>
                    <td className="px-4 py-3 text-center text-warmgray font-semibold">Full-time salaried employees</td>
                    <td className="px-4 py-3 text-center text-warmgray">Contractors, senior roles</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-warmgray mb-4">
              Fortnightly pay aligns well with common Australian billing cycles for rent, mortgage repayments, and insurance premiums. Two months each calendar year contain 3 fortnightly pay periods instead of 2, producing an effective &quot;bonus&quot; fortnight that many employees direct toward savings or debt reduction. Compare your net pay across all cycles with our <Link href="/weekly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Weekly Pay Calculator</Link> and <Link href="/monthly-pay-calculator/" className="text-eucalyptus-dark hover:underline">Monthly Pay Calculator</Link>.
            </p>
          </section>

          {/* --- WHAT DEDUCTIONS APPLY? --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Deductions Apply to Fortnightly Pay?</h2>
            <p className="text-warmgray mb-4">
              Three mandatory deductions reduce fortnightly take-home pay: PAYG income tax, the {formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy, and HECS-HELP repayments for employees with a study debt above {formatAUD(HECS_HELP.minimumThreshold)}.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">PAYG Income Tax Withholding</h3>
            <p className="text-warmgray mb-4">
              Employers withhold income tax from each fortnightly pay using the ATO&apos;s PAYG fortnightly tax table. The withholding amount reflects the FY{SITE_CONFIG.financialYear} marginal tax rates: {bracketRatesSentence()}. The &quot;Low Income Tax Offset&quot; reduces tax by up to <strong>$700</strong> for incomes below $66,667.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">Medicare Levy and Surcharge</h3>
            <p className="text-warmgray mb-4">
              The Medicare levy of {formatPercent(MEDICARE_LEVY.rate, 0)} applies to all taxable income above the low-income threshold of {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}. Employees without private hospital cover who earn above {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)} also pay the &quot;Medicare Levy Surcharge&quot; of <strong>1% to 1.5%</strong> depending on income tier.
            </p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-semibold text-navy mb-3 mt-6">HECS-HELP Repayments</h3>
            <p className="text-warmgray mb-4">
              HECS-HELP repayments are withheld from fortnightly pay once repayment income exceeds {formatAUD(HECS_HELP.minimumThreshold)}. The FY{SITE_CONFIG.financialYear} marginal system charges {hecsBandsSentence()}. Use our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Calculator</Link> to estimate your fortnightly repayment.
            </p>

            <p className="text-warmgray mb-4">
              Superannuation is not deducted from fortnightly pay. Your employer pays the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG contribution on top of your gross salary, up to {formatAUD(SUPER_GUARANTEE.maxSGAnnual)} a year for employees at or above the maximum super contribution base of {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}.
            </p>
          </section>

          {/* --- COMMON MISTAKES --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">What Are Common Mistakes When Calculating Fortnightly Pay?</h2>
            <p className="text-warmgray mb-4">
              The most common mistake is dividing the annual salary by <strong>24</strong> instead of <strong>26</strong>, which overstates each fortnightly paycheck by approximately 8.3%.
            </p>
            <ol className="list-decimal pl-5 space-y-3 text-warmgray mb-4">
              <li><strong>Dividing by 24 instead of 26.</strong> A year contains 26 fortnights (52 weeks / 2), not 24. Dividing $85,000 by 24 produces {formatAUD(85_000 / 24, 2)} per fortnight, which is <strong>{formatAUD(85_000 / 24 - 85_000 / 26, 2)} more</strong> than the correct gross of {formatAUD(85_000 / 26, 2)}.</li>
              <li><strong>Treating super as a deduction.</strong> The {formatPercent(SUPER_GUARANTEE.rate, 0)} superannuation guarantee is paid by the employer on top of gross salary. It does not reduce fortnightly take-home pay unless your contract specifies a &quot;total package inclusive of super.&quot;</li>
              <li><strong>Ignoring the tax-free threshold.</strong> The first $18,200 of annual income is tax-free. Employees who do not claim this threshold on their Tax File Number Declaration have a higher PAYG withholding rate applied to every fortnightly pay.</li>
              <li><strong>Forgetting the 27th pay period.</strong> Every 11 to 12 years, the calendar creates 27 fortnightly pay days in a single financial year. This affects PAYG withholding calculations and can cause a small tax shortfall or surplus at year-end.</li>
              <li><strong>Not accounting for salary sacrifice.</strong> Pre-tax salary sacrifice into super or a novated lease reduces assessable income and lowers the fortnightly tax withheld. Use our <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to model the impact.</li>
            </ol>
          </section>

          {/* --- CONTEXT BORDER --- */}

          {/* --- RELATED CALCULATORS --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Related Calculators</h2>
            <p className="text-warmgray mb-4">
              Use these Australian tax calculators alongside the fortnightly pay calculator to get a complete picture of your income, deductions, and take-home pay for FY{SITE_CONFIG.financialYear}.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/weekly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Weekly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">See your after-tax income per week based on 52 weekly pay periods.</span>
              </Link>
              <Link href="/monthly-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Monthly Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Convert your annual salary into monthly take-home pay across 12 periods.</span>
              </Link>
              <Link href="/take-home-pay-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Take-Home Pay Calculator</span>
                <span className="text-sm text-warmgray-light">Full annual breakdown of income tax, Medicare, super, and net pay.</span>
              </Link>
              <Link href="/income-tax-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Income Tax Calculator</span>
                <span className="text-sm text-warmgray-light">Calculate your exact income tax liability across all 5 tax brackets.</span>
              </Link>
              <Link href="/hourly-to-annual-salary-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Hourly to Annual Salary Calculator</span>
                <span className="text-sm text-warmgray-light">Convert an hourly rate to annual, fortnightly, and weekly salary.</span>
              </Link>
              <Link href="/superannuation-calculator/" className="block p-4 border border-sandstone-dark/20 rounded-lg text-center hover:border-eucalyptus hover:bg-eucalyptus-light/40 transition-colors">
                <span className="font-semibold text-navy block">Superannuation Calculator</span>
                <span className="text-sm text-warmgray-light">See how employer SG contributions at {formatPercent(SUPER_GUARANTEE.rate, 0)} build your retirement fund.</span>
              </Link>
            </div>
          </section>

          <MethodologyDisclosure>
            <p>Calculations are based on 26 fortnights per year. We divide the annual figures by 26 to provide the fortnightly equivalent. This aligns with standard ATO PAYG withholding practices.</p>
          </MethodologyDisclosure>

          <RelatedSearches items={RELATED_SEARCHES} />

          {/* --- FAQs --- */}
          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-semibold text-navy mb-4">Frequently Asked Questions</h2>
            <FaqAccordion faqs={FORTNIGHTLY_FAQS} className="space-y-3" itemClassName="rounded-xl border border-sandstone-dark/20 px-5" triggerClassName="text-left text-base font-medium text-navy" contentClassName="text-warmgray leading-relaxed" />
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
    </>
  );
}

function ComparisonRow({ salary }: { salary: number }) {
  const result = calculatePayBreakdown({ grossSalary: salary, includeHECS: false, hasPrivateHealth: true });
  const fortnightlyGross = salary / 26;
  const fortnightlyTax = (result.netIncomeTax + result.medicareLevy) / 26;

  return (
    <tr>
      <td className="px-4 py-3 text-navy font-medium">{formatAUD(salary)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(fortnightlyGross, 2)}</td>
      <td className="px-4 py-3 text-right text-warmgray">{formatAUD(fortnightlyTax, 2)}</td>
      <td className="px-4 py-3 text-right font-semibold text-eucalyptus-dark">{formatAUD(result.fortnightly, 2)}</td>
    </tr>
  );
}

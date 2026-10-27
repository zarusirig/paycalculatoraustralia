import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { SUPERANNUATION_GUIDE_FAQS } from "./superannuation-guide-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, SUPER_GUARANTEE, SUPER_GUARANTEE_CHARGE, SG_RATE_HISTORY, QUALIFYING_EARNINGS, MEDICARE_LEVY, TAX_BRACKETS, TAX_BRACKETS_2025_26, calculateIncomeTax, formatAUD, formatPercent } from "@/lib/constants";
import { CARRY_FORWARD, CONTRIBUTIONS_TAX_RATE, DIVISION_293, DIVISION_296, LOW_RATE_CAP, TRANSFER_BALANCE_CAP_PREVIOUS, bringForwardThresholds } from "@/lib/constants/super-contributions";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import FeaturedImage from "@/components/common/featured-image";

const SOURCES_LIST: SourceLink[] = [
  { title: "Super Guarantee percentage", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/how-much-super-to-pay", publisher: SOURCES.ato.name },
  { title: "Super contribution caps", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions", publisher: SOURCES.ato.name },
  { title: "Division 293 tax", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/concessional-contributions-cap", publisher: SOURCES.ato.name },
  { title: "Transfer balance cap", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/transfer-balance-cap", publisher: SOURCES.ato.name },
  { title: "Non-concessional contributions cap and bring-forward", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/non-concessional-contributions-cap", publisher: SOURCES.ato.name },
  { title: "Payments from super (low rate cap)", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/payments-from-super", publisher: SOURCES.ato.name },
  { title: "Division 296 tax on large super balances", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/division-296-tax/division-296-tax-on-large-super-balances", publisher: SOURCES.ato.name },
  { title: "About Payday Super", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/about-payday-super", publisher: SOURCES.ato.name },
  { title: "Super fund types and MySuper", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/choosing-a-super-fund", publisher: SOURCES.ato.name },
];

// Worked-example figures are derived from the current-year constants, never typed in.
const EX_SALARY = 85_000;
const EX_SG = EX_SALARY * SUPER_GUARANTEE.rate;
const EX_CONTRIB_TAX = EX_SG * CONTRIBUTIONS_TAX_RATE;
const EX_INCOME_TAX = calculateIncomeTax(EX_SALARY);
const EX_LEVY = EX_SALARY * MEDICARE_LEVY.rate;
const EX_TAKE_HOME = EX_SALARY - EX_INCOME_TAX - EX_LEVY;
const SECOND_BRACKET = TAX_BRACKETS[1].max;

// Rates, all from the bracket constants, CONTRIBUTIONS_TAX_RATE and MEDICARE_LEVY.
const CTAX = formatPercent(CONTRIBUTIONS_TAX_RATE, 0);
const LEVY = formatPercent(MEDICARE_LEVY.rate, 0);
const SECOND_RATE = TAX_BRACKETS[1].rate;
const PREV_SECOND_RATE = TAX_BRACKETS_2025_26[1].rate;
const TOP_RATE_WITH_LEVY = TAX_BRACKETS[TAX_BRACKETS.length - 1].rate + MEDICARE_LEVY.rate;
const RATES_ABOVE_CTAX = TAX_BRACKETS.filter((b) => b.rate > CONTRIBUTIONS_TAX_RATE);
/** Income tax and Medicare levy saved, less contributions tax, on each $1,000 sacrificed in a bracket. */
const savingPer1000 = (rate: number) => Math.round((rate + MEDICARE_LEVY.rate - CONTRIBUTIONS_TAX_RATE) * 1_000);
/** Most the 1 July 2026 second-rate cut can save: the rate drop across the whole second bracket. */
const SECOND_RATE_CUT_MAX = TAX_BRACKETS_2025_26[2].base - TAX_BRACKETS[2].base;

/** Marginal income tax rate (no levy) for a taxable income. */
function bracketRate(income: number): number {
  return TAX_BRACKETS.find((b) => income >= b.min && income <= b.max)?.rate ?? 0;
}

/** ["30%", "37%", "45%"] -> "30%, 37% or 45%". */
function orList(items: string[]): string {
  return items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} or ${items[items.length - 1]}`;
}

// Salary sacrifice examples, derived from the same constants.
const EX_SAC = 5_000;
const EX_SAC_TAX = EX_INCOME_TAX - calculateIncomeTax(EX_SALARY - EX_SAC);
const EX_SAC_LEVY = EX_SAC * MEDICARE_LEVY.rate;
const EX_SAC_CTAX = EX_SAC * CONTRIBUTIONS_TAX_RATE;
const SS_SALARY = 100_000;
const SS_SG = SS_SALARY * SUPER_GUARANTEE.rate;
const SS_SAC = 10_000;
const SS_TAX = calculateIncomeTax(SS_SALARY) - calculateIncomeTax(SS_SALARY - SS_SAC);
const SS_LEVY = SS_SAC * MEDICARE_LEVY.rate;
const SS_CTAX = SS_SAC * CONTRIBUTIONS_TAX_RATE;
const BRING_FORWARD = bringForwardThresholds();
const FY_END_YEAR = SITE_CONFIG.financialYearEnd.slice(-4);
const FY_START_YEAR = SITE_CONFIG.financialYearStart.slice(-4);

/** 2_100_000 -> "$2.1 million"; 1_840_000 -> "$1.84 million". */
function millions(n: number): string {
  return `$${(n / 1_000_000).toLocaleString("en-AU", { maximumFractionDigits: 2 })} million`;
}

/** "FY2024-25" -> "1 July 2024 to 30 June 2025". */
function fyRange(label: string): string {
  const start = Number(label.slice(2, 6));
  return `1 July ${start} to 30 June ${start + 1}`;
}

export default function SuperannuationGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Superannuation Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Superannuation Guide: How Super Works in Australia ({SITE_CONFIG.financialYear})
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            The superannuation rate for {SITE_CONFIG.financialYear} is {formatPercent(SUPER_GUARANTEE.rate, 0)}, the legislated ceiling of the Super Guarantee (SG). Employers pay the SG on top of salary, on qualifying earnings up to {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} a year. Under Payday Super, in force since {SUPER_GUARANTEE.paydaySuperStart}, your super fund must receive each SG contribution within {SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days of payday rather than quarterly. SG contributions are taxed at {formatPercent(CONTRIBUTIONS_TAX_RATE, 0)} inside the fund. The tables below set out the SG rate history, the contribution caps and a worked salary example. The guide then covers how super is taxed and how it affects your take-home pay.
          </p>
          <TrustBar className="!max-w-none" />
          <FeaturedImage className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="mv-content lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="sg-rate">
              <h2>How Much Super Does Your Employer Pay?</h2>
              <p>
                The <Link href="/super-guarantee-rate-history/">superannuation guarantee rate</Link> is <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)}</strong>, paid on top of your earnings. Since <strong>Payday Super commenced on {SUPER_GUARANTEE.paydaySuperStart}</strong>, employers must pay it <strong>every payday</strong> rather than quarterly, and the contribution must be <em>received</em> by your fund within <strong>{SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days</strong> of each payday ({SUPER_GUARANTEE_CHARGE.current.businessDaysNewEmployee} business days for a new employee or a first contribution to a new fund).
              </p>
              <p>
                The SG rate increased by 0.5 percentage points each year from 2021 to reach the legislated ceiling of {formatPercent(SUPER_GUARANTEE.rate, 0)} on {SUPER_GUARANTEE.effectiveDate}, and it stays at {formatPercent(SUPER_GUARANTEE.rate, 0)} for FY{SITE_CONFIG.financialYear}. No further increases are legislated. On a salary of {formatAUD(EX_SALARY)}, the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG adds <strong>{formatAUD(EX_SG)} per year</strong> to your super balance. The previous rate of {formatPercent(SUPER_GUARANTEE.previousRate, 1)} applied during FY2024-25.
              </p>

              <h3>SG Rate History Table ({SG_RATE_HISTORY[0].year} to {SG_RATE_HISTORY[SG_RATE_HISTORY.length - 1].year})</h3>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Financial Year</th>
                        <th className="px-6 py-4">Required SG Rate</th>
                        <th className="px-6 py-4">Annual SG on {formatAUD(EX_SALARY)} Salary</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {SG_RATE_HISTORY.map((row) => {
                        const current = row.year === `FY${SITE_CONFIG.financialYear}`;
                        const cell = current ? "px-6 py-4 bg-eucalyptus-light/30 font-bold text-eucalyptus-dark" : "px-6 py-4";
                        return (
                          <tr key={row.year}>
                            <td className={cell}>{fyRange(row.year)}{current ? " (current)" : ""}</td>
                            <td className={cell}>{formatPercent(row.rate, 1)}</td>
                            <td className={cell}>{formatAUD(EX_SALARY * row.rate)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Since {SUPER_GUARANTEE.paydaySuperStart} the SG is calculated on &quot;qualifying earnings&quot;, not total earnings. Qualifying earnings are the old ordinary time earnings (OTE) base with a single addition: the ATO says the only additional payment type is {QUALIFYING_EARNINGS.onlyChangeFromOTE}. Overtime, expense reimbursements, and termination payouts remain excluded. The distinction matters most for workers with significant overtime hours, so use the <Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> to separate ordinary and overtime components, and see our <Link href="/payday-super/">Payday Super guide</Link> for how the per-pay rules work.
              </p>
            </section>

            <section id="what-is-super">
              <h2>What Is Superannuation?</h2>
              <p>
                Superannuation is Australia&apos;s compulsory retirement savings system, and every employer must pay <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)} of an employee&apos;s qualifying earnings</strong> into a complying super fund for the {SITE_CONFIG.financialYear} financial year. Since {SUPER_GUARANTEE.paydaySuperStart}, that money must be paid every payday rather than quarterly.
              </p>
              <p>
                Commonly called &quot;super,&quot; the system was introduced under the Superannuation Guarantee (Administration) Act 1992 by the Keating Government. Employers pay contributions on top of gross salary, and the money is invested by the fund across asset classes including Australian equities, international shares, fixed interest, and property. The balance grows through a combination of employer contributions, voluntary contributions, and investment returns until the member reaches preservation age and retires.
              </p>
              <p>
                Concessional contributions (employer SG, salary sacrifice and personal contributions you claim as a tax deduction) are taxed at a flat <strong>{CTAX}</strong> inside the fund instead of at your marginal rate. Salary sacrifice and deductible personal contributions also lower your taxable income, so they cut the income tax you pay today. Employer SG is paid on top of your salary and does not change your income tax. Above {formatAUD(SECOND_BRACKET)} your marginal rate is {orList(RATES_ABOVE_CTAX.map((b) => formatPercent(b.rate, 0)))}, plus the {LEVY} Medicare levy. In the {formatPercent(SECOND_RATE, 0)} bracket the income tax rate is the same as the {CTAX} contributions tax, so there is no rate gap. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to see how your marginal rate compares to the {CTAX} super rate.
              </p>
              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Interactive Calculation</h3>
                    <p className="text-navy text-sm mb-3">Want to see exactly how much super your employer must pay you based on your current salary?</p>
                    <Link href="/superannuation-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                      Use our Superannuation Calculator <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            <section id="who-pays">
              <h2>Who Has to Pay Super?</h2>
              <p>
                Every Australian employer must pay the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG for <strong>all eligible employees regardless of earnings level</strong> or employment type. Hours worked matter for two groups only: under 18s and private or domestic workers, who are eligible in a week where they work more than 30 hours for you. The previous $450-per-month minimum threshold was abolished on 1 July 2022, so low-income and part-time workers now receive super too.
              </p>
              <ul>
                <li><strong>Full-time, part-time, and casual workers:</strong> Entitled to super on every dollar of qualifying earnings, with no minimum monthly income requirement.</li>
                <li><strong>Under 18s:</strong> Entitled to super if they work more than <strong>30 hours in a week</strong> for that employer.</li>
                <li><strong>Contractors:</strong> If you are hired wholly or principally for your labour (even with an ABN), you are an employee for superannuation purposes and entitled to the SG. Use our <Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Calculator</Link> to compare the financial difference.</li>
                <li><strong>Temporary residents and working holiday makers:</strong> Entitled to SG on the same basis as permanent residents. Super is payable from the first dollar earned. See our <Link href="/working-holiday-tax/">Working Holiday Tax Guide</Link> for the tax treatment of departing temporary residents.</li>
                <li><strong>Company directors:</strong> Entitled to SG. The ATO lists directors&apos; fees as ordinary time earnings, so they count as qualifying earnings and attract super.</li>
              </ul>
              <p>
                Self-employed sole traders and partners in a partnership have no obligation to pay themselves super, though they can make voluntary contributions and claim a tax deduction. Private or domestic workers (such as a nanny or housekeeper) get no SG for a week in which they work 30 hours or less for you.
              </p>
            </section>

            <section id="ote-rules">
              <h2>What Counts as Qualifying Earnings for Super?</h2>
              <p>
                Employers calculate the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG on <strong>qualifying earnings (QE)</strong>. QE is built on ordinary time earnings (OTE), the amount an employee earns for their ordinary hours of work, and the ATO confirms there are no changes to what counts as OTE under Payday Super. It includes base salary, most allowances, shift loadings, and leave taken, but excludes overtime and termination payments.
              </p>
              <div className="grid md:grid-cols-2 gap-4 not-prose mb-6 mt-4">
                <Card className="bg-eucalyptus-light/30 border-sandstone-dark/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-eucalyptus-dark mb-2">Included in QE (Super Paid)</h4>
                    <ul className="list-disc list-inside text-sm text-eucalyptus-dark space-y-1">
                      <li>Base salary and wages</li>
                      <li>Shift loading and casual loading</li>
                      {QUALIFYING_EARNINGS.stillIncluded.filter((item) => item !== "ordinary time earnings").map((item) => (
                        <li key={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</li>
                      ))}
                      <li>{QUALIFYING_EARNINGS.onlyChangeFromOTE.charAt(0).toUpperCase() + QUALIFYING_EARNINGS.onlyChangeFromOTE.slice(1)} (new from {SUPER_GUARANTEE.paydaySuperStart})</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-sandstone border-sandstone-dark/20">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-ochre mb-2">Excluded from QE (No Super)</h4>
                    <ul className="list-disc list-inside text-sm text-ochre space-y-1">
                      {QUALIFYING_EARNINGS.stillExcluded.map((item) => (
                        <li key={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</li>
                      ))}
                      <li>Redundancy payouts</li>
                      <li>Unused annual leave paid out on termination</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <p>
                The distinction between OTE and non-OTE payments is governed by Superannuation Guarantee Ruling SGR 2009/2 from the ATO. A common mistake is assuming Payday Super extended super to overtime and bonuses generally, but it did not. Performance, Christmas, sign-on and referral bonuses already attracted super and still do; a bonus paid solely for work performed entirely outside ordinary hours still does not. Use the <Link href="/bonus-tax-calculator/">Bonus Tax Calculator</Link> to calculate how a bonus is taxed and whether it attracts super.
              </p>
            </section>

            <section id="contribution-caps">
              <h2>What Are the Super Contribution Caps?</h2>
              <p>
                The ATO caps super contributions each financial year. The concessional (before-tax) cap is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> and the non-concessional (after-tax) cap is <strong>{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</strong> for FY{SITE_CONFIG.financialYear}. Exceeding either cap triggers additional tax on the excess amount.
              </p>

              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Cap Type</th>
                        <th className="px-6 py-4">Annual Limit (FY{SITE_CONFIG.financialYear})</th>
                        <th className="px-6 py-4">Tax Rate Inside Super</th>
                        <th className="px-6 py-4">Penalty If Exceeded</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">Concessional</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(SUPER_GUARANTEE.concessionalCap)}</td>
                        <td className="px-6 py-4">{CTAX}</td>
                        <td className="px-6 py-4">Excess added to assessable income, taxed at marginal rate</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Non-concessional</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</td>
                        <td className="px-6 py-4">0% (already taxed)</td>
                        <td className="px-6 py-4">{formatPercent(TOP_RATE_WITH_LEVY, 0)} tax on excess, or withdraw and pay marginal rate</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Bring-forward (non-concessional)</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(SUPER_GUARANTEE.bringForwardCap)} over 3 years</td>
                        <td className="px-6 py-4">0%</td>
                        <td className="px-6 py-4">Depends on your total super balance at 30 June of the previous year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3>Concessional Contributions Cap ({formatAUD(SUPER_GUARANTEE.concessionalCap)})</h3>
              <p>
                The {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap includes three contribution types: employer SG payments, <Link href="/salary-sacrifice-calculator/">salary sacrifice</Link> amounts, and personal contributions for which you claim a tax deduction. All three count toward the single cap. On an {formatAUD(EX_SALARY)} salary, the employer SG of {formatAUD(EX_SG)} leaves <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap - EX_SG)}</strong> of unused cap space for voluntary concessional contributions. Our <Link href="/concessional-contributions-cap/">concessional contributions cap</Link> guide has a calculator for your own salary, including carry-forward.
              </p>
              <p>
                Concessional contributions are taxed at <strong>{CTAX}</strong> within the super fund rather than your marginal tax rate. Unused concessional cap amounts carry forward for up to {CARRY_FORWARD.years} years, provided your total super balance is below {formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)} at 30 June of the previous financial year. This &quot;carry-forward&quot; rule lets you contribute large lump sums in a single year, for example after receiving a bonus or inheritance.
              </p>

              <h3>Non-Concessional Contributions Cap ({formatAUD(SUPER_GUARANTEE.nonConcessionalCap)})</h3>
              <p>
                Non-concessional contributions are amounts you deposit from after-tax income. These contributions attract <strong>no additional tax</strong> when entering the fund because income tax has already been paid. The annual cap is <strong>{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</strong>.
              </p>
              <p>
                The &quot;bring-forward&quot; rule allows contributors under 75 to use up to 3 years of non-concessional cap in a single year (up to <strong>{formatAUD(SUPER_GUARANTEE.bringForwardCap)}</strong>), provided total super balance is below {millions(BRING_FORWARD.threeYear)} at 30 June of the prior year. A balance from {millions(BRING_FORWARD.threeYear)} to below {millions(BRING_FORWARD.twoYear)} allows 2 years ({formatAUD(SUPER_GUARANTEE.nonConcessionalCap * 2)}); from {millions(BRING_FORWARD.twoYear)} there is no bring-forward, and at {millions(BRING_FORWARD.nilCap)} or more the non-concessional cap is nil. Exceeding the non-concessional cap results in the excess being taxed at <strong>{formatPercent(TOP_RATE_WITH_LEVY, 0)}</strong> (top marginal rate plus Medicare Levy), or you can elect to withdraw the excess and pay tax at your marginal rate plus an earnings component.
              </p>

              <h3>Division 293 Tax for High-Income Earners</h3>
              <p>
                &quot;Division 293&quot; imposes an additional <strong>{formatPercent(DIVISION_293.rate, 0)} tax</strong> on concessional super contributions for individuals with income plus concessional contributions exceeding <strong>{formatAUD(DIVISION_293.threshold)}</strong>. This brings the tax on those concessional contributions to <strong>{formatPercent(CONTRIBUTIONS_TAX_RATE + DIVISION_293.rate, 0)}</strong> for people above the threshold, so super gives them a smaller tax advantage. The ATO issues Division 293 assessments automatically after tax returns are lodged. You can pay the assessment from your super fund or from personal funds.
              </p>

              <h3>Division 296 Tax on Large Super Balances</h3>
              <p>
                From <strong>{DIVISION_296.start}</strong>, Division 296 tax applies at {formatPercent(DIVISION_296.rate, 0)} to the share of super earnings attributable to a total super balance above <strong>{millions(DIVISION_296.largeBalanceThreshold)}</strong>, with an additional {formatPercent(DIVISION_296.additionalRate, 0)} on the share above <strong>{millions(DIVISION_296.veryLargeBalanceThreshold)}</strong> (thresholds for {DIVISION_296.incomeYear}). It affects only very large balances; the ATO will issue the first assessments in the later half of 2027-28.
              </p>
            </section>

            <section id="how-super-taxed">
              <h2>How Is Super Taxed?</h2>
              <p>
                Super is taxed at 3 distinct stages: contributions, investment earnings, and withdrawals. The combined tax treatment makes super a lower-tax way to save for retirement than saving outside it, with <strong>{CTAX}</strong> tax on concessional contributions and fund earnings in accumulation, compared to marginal rates up to {formatPercent(TOP_RATE_WITH_LEVY, 0)} including the Medicare levy.
              </p>

              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Stage</th>
                        <th className="px-6 py-4">Tax Rate</th>
                        <th className="px-6 py-4">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">Concessional contributions</td>
                        <td className="px-6 py-4 font-bold">{CTAX}</td>
                        <td className="px-6 py-4">Employer SG, salary sacrifice, and deductible personal contributions. Division 293 adds {formatPercent(DIVISION_293.rate, 0)} above {formatAUD(DIVISION_293.threshold)} income.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Non-concessional contributions</td>
                        <td className="px-6 py-4 font-bold">0%</td>
                        <td className="px-6 py-4">After-tax money entering super. Already taxed at your marginal rate.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Investment earnings (accumulation)</td>
                        <td className="px-6 py-4 font-bold">15%</td>
                        <td className="px-6 py-4">Fund earnings taxed at 15%. Capital gains on assets held 12+ months taxed at 10% (one-third CGT discount).</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Investment earnings (pension phase)</td>
                        <td className="px-6 py-4 font-bold">0%</td>
                        <td className="px-6 py-4">Earnings on assets supporting income streams up to the {millions(SUPER_GUARANTEE.transferBalanceCap)} transfer balance cap are tax-free.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Withdrawals (age 60+)</td>
                        <td className="px-6 py-4 font-bold">0%</td>
                        <td className="px-6 py-4">Lump sums and income streams from a taxed fund are entirely tax-free from age 60.</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Withdrawals (preservation age to 59)</td>
                        <td className="px-6 py-4 font-bold">0% up to low-rate cap</td>
                        <td className="px-6 py-4">First {formatAUD(LOW_RATE_CAP.amount)} (low rate cap, {LOW_RATE_CAP.incomeYear}) of the taxed element is tax-free. Excess taxed at 15% plus Medicare Levy.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The &quot;Transfer Balance Cap&quot; limits how much super you can move into the tax-free pension phase. The general cap is <strong>{millions(SUPER_GUARANTEE.transferBalanceCap)}</strong> for FY{SITE_CONFIG.financialYear}, up from {millions(TRANSFER_BALANCE_CAP_PREVIOUS)} in FY{SITE_CONFIG.previousFinancialYear}, and is indexed in $100,000 increments in line with CPI. Amounts above this cap remain in the accumulation phase where earnings are taxed at 15%. Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to model your total after-tax position.
              </p>
            </section>

            <section id="max-contribution-base">
              <h2>Is There a Maximum Super Contribution Base?</h2>
              <p>
                With Payday Super from {SUPER_GUARANTEE.paydaySuperStart}, the maximum super contribution base is an annual figure: <strong>{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} for FY{SITE_CONFIG.financialYear}</strong> (previously {formatAUD(SUPER_GUARANTEE.maxContributionBasePerQuarterUntil2026)} per quarter). Employers are not legally required to pay the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG on earnings above this threshold.
              </p>
              <p>
                The maximum SG your employer must pay for the year is <strong>{formatAUD(SUPER_GUARANTEE.maxSGAnnual)}</strong> ({formatPercent(SUPER_GUARANTEE.rate, 0)} &times; {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}). This cap affects employees earning above {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} per year. Some employers voluntarily pay super on total salary including amounts above the maximum contribution base as part of an executive remuneration package.
              </p>
              <p>
                Until 30 June 2026 it was a quarterly figure indexed to Average Weekly Ordinary Time Earnings (AWOTE) ({formatAUD(SUPER_GUARANTEE.maxContributionBasePerQuarterUntil2026)} per quarter in FY{SITE_CONFIG.previousFinancialYear}). From {SUPER_GUARANTEE.paydaySuperStart} the ATO works it out from the concessional contributions cap divided by the SG rate ({formatAUD(SUPER_GUARANTEE.concessionalCap)} &divide; {formatPercent(SUPER_GUARANTEE.rate, 0)}), so it moves when the cap or the SG rate moves. Use our <Link href="/superannuation-calculator/">Superannuation Calculator</Link> to determine whether the cap applies to your salary.
              </p>
            </section>

            <section id="check-super-balance">
              <h2>Step-by-Step: How to Check Your Super Balance</h2>
              <p>
                Every Australian with a super account can check their balance through <strong>myGov linked to the ATO</strong>, through their super fund&apos;s app or website, or by calling the fund directly. The ATO receives account information from every fund, so myGov lists all your super accounts together, including lost super.
              </p>
              <ol>
                <li><strong>Log in to myGov</strong> at <a href="https://my.gov.au" target="_blank" rel="noreferrer noopener" className="text-eucalyptus-dark hover:underline">my.gov.au</a> using your credentials and link the ATO service if you have not already done so.</li>
                <li><strong>Navigate to &quot;Super&quot;</strong> in the ATO section. The dashboard displays all super accounts the ATO knows about, including active accounts, lost super, and unclaimed money.</li>
                <li><strong>Review your balances.</strong> Each account shows the fund name, ABN, account number, last reported balance, and date last updated. Under Payday Super, each contribution must reach your fund within {SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days of payday, so gaps show up quickly.</li>
                <li><strong>Consolidate accounts.</strong> If you have multiple accounts, select the accounts you want to roll over and transfer them into a single fund. Consolidation avoids paying duplicate insurance premiums and administration fees on each account.</li>
                <li><strong>Check for unpaid super.</strong> Compare your payslips against the &quot;Contributions&quot; section. If employer SG payments are missing or short, report it with the ATO&apos;s &quot;Report unpaid super contributions from my employer&quot; online tool.</li>
              </ol>
              <p>
                Employers must report super contributions through Single Touch Payroll (STP), which feeds directly into the ATO&apos;s system. Compare each payslip with your fund&apos;s contribution history to confirm the SG arrives on time and at the correct rate of {formatPercent(SUPER_GUARANTEE.rate, 0)}.
              </p>
            </section>

            <section id="worked-example">
              <h2>Worked Example: Super on an {formatAUD(EX_SALARY)} Salary</h2>
              <p>
                An employee earning <strong>{formatAUD(EX_SALARY)} per year</strong> in base salary (base + super structure) receives SG contributions of <strong>{formatAUD(EX_SG)}</strong> for FY{SITE_CONFIG.financialYear}, bringing the total package to <strong>{formatAUD(EX_SALARY + EX_SG)}</strong>. The table below breaks down the SG, the contributions tax, the remaining concessional cap, income tax, the Medicare Levy and take-home pay on this salary.
              </p>

              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Component</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Calculation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4">Gross salary</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(EX_SALARY)}</td>
                        <td className="px-6 py-4">Base annual salary</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Employer SG ({formatPercent(SUPER_GUARANTEE.rate, 0)})</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(EX_SG)}</td>
                        <td className="px-6 py-4">{formatAUD(EX_SALARY)} &times; {formatPercent(SUPER_GUARANTEE.rate, 0)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Total package</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(EX_SALARY + EX_SG)}</td>
                        <td className="px-6 py-4">{formatAUD(EX_SALARY)} + {formatAUD(EX_SG)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Tax on SG inside super ({CTAX})</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(EX_CONTRIB_TAX)}</td>
                        <td className="px-6 py-4">{formatAUD(EX_SG)} &times; {CTAX}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Net SG added to super balance</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(EX_SG - EX_CONTRIB_TAX)}</td>
                        <td className="px-6 py-4">{formatAUD(EX_SG)} &minus; {formatAUD(EX_CONTRIB_TAX)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Remaining concessional cap space</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(SUPER_GUARANTEE.concessionalCap - EX_SG)}</td>
                        <td className="px-6 py-4">{formatAUD(SUPER_GUARANTEE.concessionalCap)} &minus; {formatAUD(EX_SG)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Income tax on {formatAUD(EX_SALARY)} salary (FY{SITE_CONFIG.financialYear} rates)</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(EX_INCOME_TAX)}</td>
                        <td className="px-6 py-4">{formatAUD(calculateIncomeTax(SECOND_BRACKET))} + ({formatAUD(EX_SALARY)} &minus; {formatAUD(SECOND_BRACKET)}) &times; {formatPercent(bracketRate(EX_SALARY), 0)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Medicare Levy ({formatPercent(MEDICARE_LEVY.rate, 0)})</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(EX_LEVY)}</td>
                        <td className="px-6 py-4">{formatAUD(EX_SALARY)} &times; {formatPercent(MEDICARE_LEVY.rate, 0)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">Take-home pay (approx.)</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(EX_TAKE_HOME)}</td>
                        <td className="px-6 py-4">{formatAUD(EX_SALARY)} &minus; {formatAUD(EX_INCOME_TAX)} &minus; {formatAUD(EX_LEVY)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                If this employee salary sacrifices {formatAUD(EX_SAC)} into super, taxable income drops to {formatAUD(EX_SALARY - EX_SAC)}. Income tax falls by <strong>{formatAUD(EX_SAC_TAX)}</strong> (the {formatAUD(EX_SAC)} at the {formatPercent(bracketRate(EX_SALARY), 0)} marginal rate) and the Medicare levy falls by {formatAUD(EX_SAC_LEVY)} ({LEVY}). The {formatAUD(EX_SAC)} is taxed at {CTAX} inside super ({formatAUD(EX_SAC_CTAX)}), so the net tax saving is <strong>{formatAUD(EX_SAC_TAX + EX_SAC_LEVY - EX_SAC_CTAX)}</strong>. Read the full mechanics in our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Guide</Link>.
              </p>
            </section>

            <section id="salary-sacrifice">
              <h2>How Does Salary Sacrifice Into Super Work?</h2>
              <p>
                Salary sacrifice redirects a portion of your pre-tax salary into your super fund, where it is taxed at <strong>{CTAX}</strong> instead of your marginal rate. Counting income tax and the {LEVY} Medicare levy, each {formatAUD(1_000)} you sacrifice saves <strong>{formatAUD(savingPer1000(RATES_ABOVE_CTAX[0].rate))}</strong> in the {formatPercent(RATES_ABOVE_CTAX[0].rate, 0)} bracket, rising to <strong>{formatAUD(savingPer1000(RATES_ABOVE_CTAX[RATES_ABOVE_CTAX.length - 1].rate))}</strong> in the {formatPercent(RATES_ABOVE_CTAX[RATES_ABOVE_CTAX.length - 1].rate, 0)} bracket, so the saving grows with your marginal rate. In the {formatPercent(SECOND_RATE, 0)} bracket the income tax rate is the same as the {CTAX} contributions tax, so salary sacrifice gives no income tax rate saving there. Above the {formatAUD(DIVISION_293.threshold)} Division 293 threshold, the contributions tax rises to {formatPercent(CONTRIBUTIONS_TAX_RATE + DIVISION_293.rate, 0)} and the saving shrinks.
              </p>
              <p>
                Salary sacrifice contributions count toward the {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap alongside employer SG payments. Exceeding the cap triggers additional tax at your marginal rate on the excess amount. Before arranging salary sacrifice with your employer, calculate your available cap space by subtracting your annual SG from {formatAUD(SUPER_GUARANTEE.concessionalCap)}, or use the <Link href="/concessional-contributions-cap/">concessional cap calculator</Link>.
              </p>

              <h3>Worked Example: Salary Sacrifice on $100,000</h3>
              <p>
                An employee earning {formatAUD(SS_SALARY)} receives {formatPercent(SUPER_GUARANTEE.rate, 0)} SG ({formatAUD(SS_SG)}), leaving {formatAUD(SUPER_GUARANTEE.concessionalCap - SS_SG)} of concessional cap space ({formatAUD(SUPER_GUARANTEE.concessionalCap)} &minus; {formatAUD(SS_SG)}). If they salary sacrifice {formatAUD(SS_SAC)}:
              </p>
              <ul>
                <li>Taxable income drops from {formatAUD(SS_SALARY)} to <strong>{formatAUD(SS_SALARY - SS_SAC)}</strong></li>
                <li>Income tax saving at the {formatPercent(bracketRate(SS_SALARY), 0)} marginal rate: <strong>{formatAUD(SS_TAX)}</strong>, plus <strong>{formatAUD(SS_LEVY)}</strong> less Medicare levy ({LEVY})</li>
                <li>The {formatAUD(SS_SAC)} is taxed at {CTAX} inside super: <strong>{formatAUD(SS_CTAX)} contributions tax</strong></li>
                <li><strong>Net benefit:</strong> {formatAUD(SS_TAX + SS_LEVY - SS_CTAX)} more in super than you would keep by taking the income as salary</li>
                <li>Take-home pay falls by <strong>{formatAUD(SS_SAC - SS_TAX - SS_LEVY)}</strong> ({formatAUD(SS_SAC)} minus the {formatAUD(SS_TAX + SS_LEVY)} tax and levy saving)</li>
              </ul>
              <p>
                Use the <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model your own scenario with exact dollar amounts.
              </p>
            </section>

            <section id="fy2026-27-changes">
              <h2>What Changed for Super in FY{SITE_CONFIG.financialYear}?</h2>
              <p>
                The SG rate stayed at <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)}</strong>, but how and when it is paid changed. <Link href="/payday-super/">Payday Super</Link> commenced on <strong>{SUPER_GUARANTEE.paydaySuperStart}</strong>: employers now pay SG with each pay run, calculated on qualifying earnings, and the contribution must be received by your fund within {SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days of payday. The contribution caps and the transfer balance cap were also indexed.
              </p>

              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Change</th>
                        <th className="px-6 py-4">FY{SITE_CONFIG.previousFinancialYear} (Previous)</th>
                        <th className="px-6 py-4">FY{SITE_CONFIG.financialYear} (Current)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">SG rate</td>
                        <td className="px-6 py-4">{formatPercent(SUPER_GUARANTEE.rate, 0)}</td>
                        <td className="px-6 py-4 font-bold">{formatPercent(SUPER_GUARANTEE.rate, 0)} (unchanged)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">When SG is paid</td>
                        <td className="px-6 py-4">Quarterly, 28 days after quarter end</td>
                        <td className="px-6 py-4 font-bold text-eucalyptus-dark">Every payday; received within {SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days ({SUPER_GUARANTEE_CHARGE.current.businessDaysNewEmployee} for a new employee or new fund)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">SG calculated on</td>
                        <td className="px-6 py-4">Ordinary time earnings</td>
                        <td className="px-6 py-4 font-bold text-eucalyptus-dark">Qualifying earnings</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Maximum contribution base</td>
                        <td className="px-6 py-4">{formatAUD(SUPER_GUARANTEE.maxContributionBasePerQuarterUntil2026)} per quarter</td>
                        <td className="px-6 py-4 font-bold text-eucalyptus-dark">{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} per year</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Concessional cap</td>
                        <td className="px-6 py-4">{formatAUD(SUPER_GUARANTEE.concessionalCapPrevious)}</td>
                        <td className="px-6 py-4 font-bold text-eucalyptus-dark"><Link href="/concessional-contributions-cap/" className="underline">{formatAUD(SUPER_GUARANTEE.concessionalCap)}</Link></td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Non-concessional cap</td>
                        <td className="px-6 py-4">{formatAUD(SUPER_GUARANTEE.nonConcessionalCapPrevious)}</td>
                        <td className="px-6 py-4 font-bold text-eucalyptus-dark">{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Bring-forward (3 years)</td>
                        <td className="px-6 py-4">{formatAUD(SUPER_GUARANTEE.nonConcessionalCapPrevious * 3)}</td>
                        <td className="px-6 py-4 font-bold text-eucalyptus-dark">{formatAUD(SUPER_GUARANTEE.bringForwardCap)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Transfer balance cap</td>
                        <td className="px-6 py-4">{millions(TRANSFER_BALANCE_CAP_PREVIOUS)}</td>
                        <td className="px-6 py-4 font-bold text-eucalyptus-dark">{millions(SUPER_GUARANTEE.transferBalanceCap)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Low rate cap</td>
                        <td className="px-6 py-4">{formatAUD(LOW_RATE_CAP.previousAmount)}</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(LOW_RATE_CAP.amount)} (unchanged)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Division 293 threshold</td>
                        <td className="px-6 py-4">{formatAUD(DIVISION_293.threshold)}</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(DIVISION_293.threshold)} (unchanged)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Division 296 (balances over {millions(DIVISION_296.largeBalanceThreshold)})</td>
                        <td className="px-6 py-4">Did not apply</td>
                        <td className="px-6 py-4 font-bold text-eucalyptus-dark">Applies from {DIVISION_296.start}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Super guarantee charge</td>
                        <td className="px-6 py-4">Not tax-deductible</td>
                        <td className="px-6 py-4 font-bold text-eucalyptus-dark">Tax-deductible</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                For employees on a &quot;base + super&quot; structure, Payday Super changes when super arrives, not how much. On a {formatAUD(EX_SALARY)} salary the employer still pays {formatAUD(EX_SG)} for the year, but a fortnightly-paid employee should now see a contribution after every pay rather than four times a year. The higher {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap gives {formatAUD(SUPER_GUARANTEE.concessionalCap - SUPER_GUARANTEE.concessionalCapPrevious)} more room for <Link href="/salary-sacrifice-calculator/">salary sacrifice</Link>. Separately, the second income tax rate fell from {formatPercent(PREV_SECOND_RATE, 0)} to {formatPercent(SECOND_RATE, 0)} on {SITE_CONFIG.financialYearStart}. Taxable income from {formatAUD(TAX_BRACKETS[1].min)} to {formatAUD(TAX_BRACKETS[1].max)} is now taxed at the lower rate, a saving of up to {formatAUD(SECOND_RATE_CUT_MAX)} a year (see <Link href="/tax-brackets/">tax brackets</Link>).
              </p>
            </section>

            <section id="super-fund-types">
              <h2>What Are the Different Types of Super Funds?</h2>
              <p>
                Australian super funds fall into 5 main categories: industry funds, retail funds, corporate funds, public sector funds, and self-managed super funds (SMSFs). Each type differs in fee structures, investment options, insurance offerings, and governance.
              </p>

              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Fund Type</th>
                        <th className="px-6 py-4">Typical Fees (p.a.)</th>
                        <th className="px-6 py-4">Investment Options</th>
                        <th className="px-6 py-4">Best Suited For</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-medium">Industry fund</td>
                        <td className="px-6 py-4">0.5% to 1.0%</td>
                        <td className="px-6 py-4">Pre-mixed and single-sector options</td>
                        <td className="px-6 py-4">Most employees; lower fees, profit-to-member</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Retail fund</td>
                        <td className="px-6 py-4">0.8% to 1.5%</td>
                        <td className="px-6 py-4">Wide range including managed funds and shares</td>
                        <td className="px-6 py-4">Active investors wanting specific fund managers</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Corporate fund</td>
                        <td className="px-6 py-4">0.3% to 0.7%</td>
                        <td className="px-6 py-4">Tailored options negotiated by employer</td>
                        <td className="px-6 py-4">Employees of large corporations with in-house funds</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Public sector fund</td>
                        <td className="px-6 py-4">0.3% to 0.6%</td>
                        <td className="px-6 py-4">Pre-mixed options, some defined benefit schemes</td>
                        <td className="px-6 py-4">Federal, state, and local government employees</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">SMSF</td>
                        <td className="px-6 py-4">$2,000 to $5,000 fixed</td>
                        <td className="px-6 py-4">Direct shares, property, crypto, collectibles</td>
                        <td className="px-6 py-4">Balances above $500K; experienced investors</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3>Stapled Super Funds</h3>
              <p>
                Since 1 November 2021, when you start a new job without nominating a fund, your employer must request your &quot;stapled fund&quot; details from the ATO. Your stapled fund is your existing super account, which follows you from job to job so you do not open a duplicate account that charges its own fees.
              </p>
              <h3>Default Funds (MySuper)</h3>
              <p>
                If you have no existing fund and do not nominate one, your employer opens an account in their default fund. All default funds must offer a &quot;MySuper&quot; product, a simple, low-cost option designed for members who do not make active investment choices. MySuper products are subject to annual performance testing by APRA; funds that fail 2 consecutive years are closed to new members.
              </p>
              <h3>Comparing Funds</h3>
              <p>
                When choosing a fund, compare investment fees, insurance premiums, investment performance over 5 to 10 year periods, and available tools such as salary sacrifice tracking and retirement projections. The ATO&apos;s YourSuper comparison tool at <a href="https://www.ato.gov.au/calculators-and-tools/super-yoursuper-comparison-tool" target="_blank" rel="noreferrer noopener" className="text-eucalyptus-dark hover:underline">ato.gov.au/yoursuper</a> compares MySuper products on fees and net returns.
              </p>
            </section>

            <section id="key-dates">
              <h2>What Are the Key Super Dates and Deadlines?</h2>
              <p>
                Employers must pay SG contributions <strong>every payday</strong>, with the money received by the fund within <strong>{SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days</strong>. Missing that deadline triggers the Superannuation Guarantee Charge (SGC), which has {SUPER_GUARANTEE_CHARGE.current.components.length} parts: the shortfall, notional earnings at the general interest charge rate compounded daily, an administrative uplift of up to {formatPercent(SUPER_GUARANTEE_CHARGE.current.administrativeUpliftMax, 0)}, and a choice loading if you did not follow the choice of fund rules. A voluntary disclosure within 30 days of payday cuts the uplift to {SUPER_GUARANTEE_CHARGE.current.upliftSchedule[0].noPriorAssessment}% if the ATO has not made its own SGC assessment against you in the 2 years before that payday, and to {SUPER_GUARANTEE_CHARGE.current.upliftSchedule[0].priorAssessment}% if it has. Unlike the old quarterly charge, the SGC is now <strong>tax-deductible</strong>.
              </p>

              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Earnings paid</th>
                        <th className="px-6 py-4">Rule</th>
                        <th className="px-6 py-4">SG Payment Due</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4">From {SUPER_GUARANTEE.paydaySuperStart}</td>
                        <td className="px-6 py-4">Payday Super</td>
                        <td className="px-6 py-4 font-bold">Received by the fund within {SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days of each payday</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">New employee, or first contribution to a new fund</td>
                        <td className="px-6 py-4">Payday Super</td>
                        <td className="px-6 py-4 font-bold">Within {SUPER_GUARANTEE_CHARGE.current.businessDaysNewEmployee} business days of payday</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4">1 April to 30 June 2026 (last quarter)</td>
                        <td className="px-6 py-4">Old quarterly system</td>
                        <td className="px-6 py-4 font-bold">{SUPER_GUARANTEE_CHARGE.legacy.finalQuarterSGDue} (SGC statement for a late payment due {SUPER_GUARANTEE_CHARGE.legacy.finalQuarterStatementDue})</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>
                Other super dates for FY{SITE_CONFIG.financialYear}: <strong>{SITE_CONFIG.financialYearEnd}</strong> is the last day for a personal deductible contribution to be received by your fund for the year. Your total super balance at <strong>30 June {FY_START_YEAR}</strong> decides whether you can use carry-forward concessional cap amounts and the bring-forward rule this year. <strong>31 October {FY_END_YEAR}</strong> is the lodgement due date for your {SITE_CONFIG.financialYear} tax return if you lodge yourself (later if you use a registered tax agent). The <Link href="/tax-calendar/">Australian Tax Calendar</Link> lists all key dates across the financial year, and our <Link href="/payday-super/">Payday Super guide</Link> explains the per-pay deadlines in detail.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <p>
                These calculators and guides cover the SG amount, salary sacrifice, the concessional cap, Payday Super timing, take-home pay, income tax brackets and HECS-HELP.
              </p>
              <ul>
                <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link>: Calculate the exact SG amount your employer must pay based on your salary, including the maximum contribution base cap.</li>
                <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link>: Model the tax savings of redirecting pre-tax salary into super, with side-by-side before/after comparison.</li>
                <li><Link href="/concessional-contributions-cap/">Concessional Contributions Cap</Link>: The {formatAUD(SUPER_GUARANTEE.concessionalCap)} cap, carry-forward, and a calculator for your remaining room.</li>
                <li><Link href="/payday-super/">Payday Super Guide</Link>: How SG is paid each payday from {SUPER_GUARANTEE.paydaySuperStart}, with per-pay figures and due dates.</li>
                <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>: Calculate your after-tax income including super, Medicare Levy, HECS-HELP, and all deductions.</li>
                <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link>: See exactly how the FY{SITE_CONFIG.financialYear} tax brackets apply to your assessable income.</li>
                <li><Link href="/hecs-help-calculator/">HECS-HELP Guide</Link>: Understand the new marginal repayment system and how HECS interacts with super salary sacrifice strategies.</li>
              </ul>
            </section>

            {/* --- CONTEXT BORDER --- */}

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <FaqAccordion faqs={SUPERANNUATION_GUIDE_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-sandstone bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-navy" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>Information on this page is based on current ATO legislation and Superannuation Guarantee Administration Act parameters for the {SITE_CONFIG.financialYear} Australian financial year, including Payday Super from {SUPER_GUARANTEE.paydaySuperStart}. Caps and thresholds were checked against the ATO&apos;s key superannuation rates and thresholds pages on 23 September 2026. Federal super rules change often, so check each figure against the ATO sources listed below.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("superannuation-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="mv-sidebar space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Calculators</h3>
                  <div className="space-y-3">
                    <Link href="/superannuation-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Super Calculator</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/take-home-pay-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Take-Home Pay Calculator</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/salary-sacrifice-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Salary Sacrifice Calc</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Need a tailored breakdown?</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Enter your annual salary to see your employer super and total package.</p>
                  <Link href="/superannuation-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Go to Calculator
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

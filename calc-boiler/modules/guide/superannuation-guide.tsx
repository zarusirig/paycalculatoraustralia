"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { SUPERANNUATION_GUIDE_FAQS } from "./superannuation-guide-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, SUPER_GUARANTEE, SUPER_GUARANTEE_CHARGE, SG_RATE_HISTORY, QUALIFYING_EARNINGS, MEDICARE_LEVY, calculateIncomeTax, formatAUD, formatPercent } from "@/lib/constants";
import { CARRY_FORWARD, DIVISION_293, DIVISION_296, LOW_RATE_CAP, TRANSFER_BALANCE_CAP_PREVIOUS, bringForwardThresholds } from "@/lib/constants/super-contributions";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

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
const EX_CONTRIB_TAX = EX_SG * 0.15;
const EX_INCOME_TAX = calculateIncomeTax(EX_SALARY);
const EX_LEVY = EX_SALARY * MEDICARE_LEVY.rate;
const EX_TAKE_HOME = EX_SALARY - EX_INCOME_TAX - EX_LEVY;
const SECOND_BRACKET = 45_000;
const BRING_FORWARD = bringForwardThresholds();
const FY_END_YEAR = SITE_CONFIG.financialYearEnd.slice(-4);
const FY_START_YEAR = SITE_CONFIG.financialYearStart.slice(-4);

/** 2_100_000 -> "$2.1 million"; 1_840_000 -> "$1.84 million". */
function millions(n: number): string {
  return `$${(n / 1_000_000).toLocaleString("en-AU", { maximumFractionDigits: 2 })} million`;
}

/** "FY2024-25" -> "1 July 2024 – 30 June 2025". */
function fyRange(label: string): string {
  const start = Number(label.slice(2, 6));
  return `1 July ${start} \u2013 30 June ${start + 1}`;
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
            Superannuation Guide — How Super Works in Australia ({SITE_CONFIG.financialYear})
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Everything you need to know about the mandatory {formatPercent(SUPER_GUARANTEE.rate, 0)} retirement system, Payday Super, contribution caps, and how super affects your take-home pay.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="what-is-super">
              <h2>What Is Superannuation?</h2>
              <p>
                Superannuation is Australia&apos;s compulsory retirement savings system, requiring every employer to pay <strong>{formatPercent(SUPER_GUARANTEE.rate, 0)} of an employee&apos;s qualifying earnings</strong> into a complying super fund for the {SITE_CONFIG.financialYear} financial year. Since {SUPER_GUARANTEE.paydaySuperStart}, that money must be paid every payday rather than quarterly.
              </p>
              <p>
                Commonly called &quot;super,&quot; the system was introduced under the Superannuation Guarantee (Administration) Act 1992 by the Keating Government. Employers pay contributions on top of gross salary, and the money is invested by the fund across asset classes including Australian equities, international shares, fixed interest, and property. The balance grows through a combination of employer contributions, voluntary contributions, and investment returns until the member reaches preservation age and retires.
              </p>
              <p>
                Super contributions directly reduce the income tax you pay today through concessional tax treatment. Employer super guarantee payments and salary sacrifice contributions are taxed at a flat <strong>15%</strong> inside the fund, compared to marginal rates of 30%, 37%, or 45% outside super. Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to see how your marginal rate compares to the 15% super rate.
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

            <section id="sg-rate">
              <h2>How Much Super Does Your Employer Pay?</h2>
              <p>
                The <Link href="/super-guarantee-rate-history/">superannuation guarantee rate</Link> is <strong>12%</strong>, paid on top of your earnings. Since <strong>Payday Super commenced on 1 July 2026</strong>, employers must pay it <strong>every payday</strong> rather than quarterly, and the contribution must be <em>received</em> by your fund within <strong>7 business days</strong> of each payday (20 business days for a new employee or a first contribution to a new fund).
              </p>
              <p>
                The SG rate increased by 0.5 percentage points each year from 2021 to reach the legislated ceiling of 12% on {SUPER_GUARANTEE.effectiveDate}, and it stays at 12% for FY{SITE_CONFIG.financialYear}. No further increases are legislated. On a salary of {formatAUD(EX_SALARY)}, the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG adds <strong>{formatAUD(EX_SG)} per year</strong> to your super balance. The previous rate of {formatPercent(SUPER_GUARANTEE.previousRate, 1)} applied during FY2024-25.
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
                Since {SUPER_GUARANTEE.paydaySuperStart} the SG is calculated on &quot;qualifying earnings&quot;, not total earnings. Qualifying earnings are essentially the old ordinary time earnings (OTE) base; the ATO says the only additional payment type is {QUALIFYING_EARNINGS.onlyChangeFromOTE}. Overtime, expense reimbursements, and termination payouts remain excluded. The distinction matters most for workers with significant overtime hours &mdash; use the <Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> to separate ordinary and overtime components, and see our <Link href="/payday-super/">Payday Super guide</Link> for how the per-pay rules work.
              </p>
            </section>

            <section id="who-pays">
              <h2>Who Has to Pay Super?</h2>
              <p>
                Every Australian employer must pay the 12% SG for <strong>all employees regardless of earnings level</strong>, employment type, or hours worked. The previous $450-per-month minimum threshold was abolished on 1 July 2022, extending super coverage to low-income and part-time workers.
              </p>
              <ul>
                <li><strong>Full-time, part-time, and casual workers:</strong> Entitled to super on every dollar of qualifying earnings, with no minimum monthly income requirement.</li>
                <li><strong>Under 18s:</strong> Entitled to super if they work more than <strong>30 hours in a week</strong> for that employer.</li>
                <li><strong>Contractors:</strong> If you are hired wholly or principally for your labour (even with an ABN), you are an employee for superannuation purposes and entitled to the SG. Use our <Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Calculator</Link> to compare the financial difference.</li>
                <li><strong>Temporary residents and working holiday makers:</strong> Entitled to SG on the same basis as permanent residents. Super is payable from the first dollar earned. See our <Link href="/working-holiday-tax/">Working Holiday Tax Guide</Link> for the tax treatment of departing temporary residents.</li>
                <li><strong>Company directors:</strong> Entitled to SG if they are also an employee of the company. Directors paid solely as officeholders (director&apos;s fees) are not covered unless an employment relationship exists.</li>
              </ul>
              <p>
                Self-employed sole traders and partners in a partnership have no obligation to pay themselves super, though they can make voluntary contributions and claim a tax deduction. Domestic workers employed for fewer than 30 hours per week are also exempt.
              </p>
            </section>

            <section id="ote-rules">
              <h2>What Counts as Qualifying Earnings for Super?</h2>
              <p>
                Employers calculate the {formatPercent(SUPER_GUARANTEE.rate, 0)} SG on <strong>qualifying earnings (QE)</strong>. QE is built on ordinary time earnings (OTE) &mdash; the amount an employee earns for their ordinary hours of work &mdash; and the ATO confirms there are no changes to what counts as OTE under Payday Super. It includes base salary, most allowances, shift loadings, and leave taken, but excludes overtime and termination payments.
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
                The distinction between OTE and non-OTE payments is governed by Superannuation Guarantee Ruling SGR 2009/2 from the ATO. A common mistake is assuming Payday Super extended super to overtime and bonuses generally &mdash; it did not. Performance, Christmas, sign-on and referral bonuses already attracted super and still do; a bonus paid solely for work performed entirely outside ordinary hours still does not. Use the <Link href="/bonus-tax-calculator/">Bonus Tax Calculator</Link> to calculate how a bonus is taxed and whether it attracts super.
              </p>
            </section>

            <section id="contribution-caps">
              <h2>What Are the Super Contribution Caps?</h2>
              <p>
                The ATO limits how much you can contribute to super at concessional tax rates each financial year. The concessional cap is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)}</strong> and the non-concessional cap is <strong>{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</strong> for FY{SITE_CONFIG.financialYear}. Exceeding either cap triggers additional tax on the excess amount.
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
                        <td className="px-6 py-4">15%</td>
                        <td className="px-6 py-4">Excess added to assessable income, taxed at marginal rate</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Non-concessional</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</td>
                        <td className="px-6 py-4">0% (already taxed)</td>
                        <td className="px-6 py-4">47% tax on excess, or withdraw and pay marginal rate</td>
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
                These contributions are taxed at <strong>15%</strong> within the super fund rather than your marginal tax rate. Unused concessional cap amounts carry forward for up to {CARRY_FORWARD.years} years, provided your total super balance is below {formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)} at 30 June of the previous financial year. This &quot;carry-forward&quot; rule lets you contribute large lump sums in a single year &mdash; for example, after receiving a bonus or inheritance.
              </p>

              <h3>Non-Concessional Contributions Cap ({formatAUD(SUPER_GUARANTEE.nonConcessionalCap)})</h3>
              <p>
                Non-concessional contributions are amounts you deposit from after-tax income. These contributions attract <strong>no additional tax</strong> when entering the fund because income tax has already been paid. The annual cap is <strong>{formatAUD(SUPER_GUARANTEE.nonConcessionalCap)}</strong>.
              </p>
              <p>
                The &quot;bring-forward&quot; rule allows contributors under 75 to use up to 3 years of non-concessional cap in a single year (up to <strong>{formatAUD(SUPER_GUARANTEE.bringForwardCap)}</strong>), provided total super balance is below {millions(BRING_FORWARD.threeYear)} at 30 June of the prior year. A balance from {millions(BRING_FORWARD.threeYear)} to below {millions(BRING_FORWARD.twoYear)} allows 2 years ({formatAUD(SUPER_GUARANTEE.nonConcessionalCap * 2)}); from {millions(BRING_FORWARD.twoYear)} there is no bring-forward, and at {millions(BRING_FORWARD.nilCap)} or more the non-concessional cap is nil. Exceeding the non-concessional cap results in the excess being taxed at <strong>47%</strong> (top marginal rate plus Medicare Levy), or you can elect to withdraw the excess and pay tax at your marginal rate plus an earnings component.
              </p>

              <h3>Division 293 Tax for High-Income Earners</h3>
              <p>
                &quot;Division 293&quot; imposes an additional <strong>{formatPercent(DIVISION_293.rate, 0)} tax</strong> on concessional super contributions for individuals with income plus concessional contributions exceeding <strong>{formatAUD(DIVISION_293.threshold)}</strong>. This brings the total tax on super contributions to <strong>30%</strong> for high earners, reducing the tax advantage of superannuation. The ATO issues Division 293 assessments automatically after tax returns are lodged &mdash; you can pay the assessment from your super fund or from personal funds.
              </p>

              <h3>Division 296 Tax on Large Super Balances</h3>
              <p>
                From <strong>{DIVISION_296.start}</strong>, Division 296 tax applies at {formatPercent(DIVISION_296.rate, 0)} to the share of super earnings attributable to a total super balance above <strong>{millions(DIVISION_296.largeBalanceThreshold)}</strong>, with an additional {formatPercent(DIVISION_296.additionalRate, 0)} on the share above <strong>{millions(DIVISION_296.veryLargeBalanceThreshold)}</strong> (thresholds for {DIVISION_296.incomeYear}). It affects only very large balances; the ATO will issue the first assessments in the later half of 2027-28.
              </p>
            </section>

            <section id="how-super-taxed">
              <h2>How Is Super Taxed?</h2>
              <p>
                Super is taxed at 3 distinct stages: contributions, investment earnings, and withdrawals. The combined tax treatment makes super the most tax-effective savings vehicle in Australia for retirement purposes, with rates of <strong>15% or less</strong> at each stage compared to marginal rates up to 47%.
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
                        <td className="px-6 py-4 font-bold">15%</td>
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
                The &quot;Transfer Balance Cap&quot; limits how much super you can move into the tax-free pension phase. The general cap is <strong>{millions(SUPER_GUARANTEE.transferBalanceCap)}</strong> for FY{SITE_CONFIG.financialYear}, up from {millions(TRANSFER_BALANCE_CAP_PREVIOUS)} in FY{SITE_CONFIG.previousFinancialYear}, and is indexed in $100,000 increments in line with CPI. Amounts above this cap remain in the accumulation phase where earnings are taxed at 15%. Understanding how super taxation interacts with your income tax brackets is critical &mdash; use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to model your total after-tax position.
              </p>
            </section>

            <section id="max-contribution-base">
              <h2>Is There a Maximum Super Contribution Base?</h2>
              <p>
                With Payday Super from 1 July 2026, the maximum super contribution base is an annual figure: <strong>{formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} for FY{SITE_CONFIG.financialYear}</strong> (previously {formatAUD(SUPER_GUARANTEE.maxContributionBasePerQuarterUntil2026)} per quarter). Employers are not legally required to pay the 12% SG on earnings above this threshold.
              </p>
              <p>
                The maximum SG your employer must pay for the year is <strong>{formatAUD(SUPER_GUARANTEE.maxSGAnnual)}</strong> ({formatPercent(SUPER_GUARANTEE.rate, 0)} &times; {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)}). This cap affects employees earning above {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} per year. Some employers voluntarily pay super on total salary including amounts above the maximum contribution base as part of an executive remuneration package.
              </p>
              <p>
                The maximum contribution base is indexed annually in line with Average Weekly Ordinary Time Earnings (AWOTE). Until 30 June 2026 it was a quarterly figure ({formatAUD(SUPER_GUARANTEE.maxContributionBasePerQuarterUntil2026)} per quarter in FY{SITE_CONFIG.previousFinancialYear}). Use our <Link href="/superannuation-calculator/">Superannuation Calculator</Link> to determine whether the cap applies to your salary.
              </p>
            </section>

            <section id="check-super-balance">
              <h2>Step-by-Step: How to Check Your Super Balance</h2>
              <p>
                Every Australian with a super account can check their balance through <strong>myGov linked to the ATO</strong>, through their super fund&apos;s app or website, or by calling the fund directly. The ATO consolidates information from all funds, making myGov the single best tool for finding lost super across multiple accounts.
              </p>
              <ol>
                <li><strong>Log in to myGov</strong> at <a href="https://my.gov.au" target="_blank" rel="noreferrer noopener" className="text-eucalyptus-dark hover:underline">my.gov.au</a> using your credentials and link the ATO service if you have not already done so.</li>
                <li><strong>Navigate to &quot;Super&quot;</strong> in the ATO section. The dashboard displays all super accounts the ATO knows about, including active accounts, lost super, and unclaimed money.</li>
                <li><strong>Review your balances.</strong> Each account shows the fund name, ABN, account number, last reported balance, and date last updated. Under Payday Super, each contribution should reach your fund within {SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days of payday, so gaps show up quickly.</li>
                <li><strong>Consolidate accounts.</strong> If you have multiple accounts, select the accounts you want to roll over and transfer them into a single fund. Consolidation avoids paying duplicate insurance premiums and administration fees on each account.</li>
                <li><strong>Check for unpaid super.</strong> Compare your payslips against the &quot;Contributions&quot; section. If employer SG payments are missing or short, lodge an &quot;Unpaid super enquiry&quot; through the ATO.</li>
              </ol>
              <p>
                Employers must report super contributions through Single Touch Payroll (STP), which feeds directly into the ATO&apos;s system. Checking your payslips against your fund&apos;s contribution history regularly confirms contributions are being paid on time and at the correct rate of {formatPercent(SUPER_GUARANTEE.rate, 0)}.
              </p>
            </section>

            <section id="worked-example">
              <h2>Worked Example: Super on an {formatAUD(EX_SALARY)} Salary</h2>
              <p>
                An employee earning <strong>{formatAUD(EX_SALARY)} per year</strong> in base salary (base + super structure) receives SG contributions of <strong>{formatAUD(EX_SG)}</strong> for FY{SITE_CONFIG.financialYear}, bringing the total package to <strong>{formatAUD(EX_SALARY + EX_SG)}</strong>. Here is the complete breakdown of how super interacts with tax, take-home pay, and contribution caps.
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
                        <td className="px-6 py-4">Tax on SG inside super (15%)</td>
                        <td className="px-6 py-4 font-bold">{formatAUD(EX_CONTRIB_TAX)}</td>
                        <td className="px-6 py-4">{formatAUD(EX_SG)} &times; 15%</td>
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
                        <td className="px-6 py-4">{formatAUD(calculateIncomeTax(SECOND_BRACKET))} + ({formatAUD(EX_SALARY)} &minus; {formatAUD(SECOND_BRACKET)}) &times; 30%</td>
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
                If this employee salary sacrifices $5,000 into super, taxable income drops to {formatAUD(EX_SALARY - 5_000)}, reducing income tax by approximately <strong>$1,500</strong> (the $5,000 at the 30% marginal rate). The $5,000 is taxed at 15% inside super ($750), producing a net tax saving of <strong>$750</strong>. Read the full mechanics in our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Guide</Link>.
              </p>
            </section>

            <section id="salary-sacrifice">
              <h2>How Does Salary Sacrifice Into Super Work?</h2>
              <p>
                Salary sacrifice redirects a portion of your pre-tax salary into your super fund, where it is taxed at <strong>15%</strong> instead of your marginal rate. The tax saving ranges from <strong>$150 per $1,000 sacrificed</strong> (at the 30% bracket) to <strong>$300 per $1,000</strong> (at the 45% bracket), making it one of the most effective legal tax-reduction strategies in Australia.
              </p>
              <p>
                Salary sacrifice contributions count toward the {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap alongside employer SG payments. Exceeding the cap triggers additional tax at your marginal rate on the excess amount. Before arranging salary sacrifice with your employer, calculate your available cap space by subtracting your annual SG from {formatAUD(SUPER_GUARANTEE.concessionalCap)}, or use the <Link href="/concessional-contributions-cap/">concessional cap calculator</Link>.
              </p>

              <h3>Worked Example: Salary Sacrifice on $100,000</h3>
              <p>
                An employee earning $100,000 receives 12% SG ($12,000), leaving {formatAUD(SUPER_GUARANTEE.concessionalCap - 12_000)} of concessional cap space ({formatAUD(SUPER_GUARANTEE.concessionalCap)} &minus; $12,000). If they salary sacrifice $10,000:
              </p>
              <ul>
                <li>Taxable income drops from $100,000 to <strong>$90,000</strong></li>
                <li>Income tax saving at the 30% marginal rate: <strong>$3,000</strong></li>
                <li>The $10,000 is taxed at 15% inside super: <strong>$1,500 contributions tax</strong></li>
                <li><strong>Net benefit:</strong> $1,500 more in super than taking the income as salary</li>
                <li>Take-home pay reduces by approximately <strong>$7,000</strong> ($10,000 minus the $3,000 tax saving)</li>
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
                For employees on a &quot;base + super&quot; structure, Payday Super changes when super arrives, not how much. On a {formatAUD(EX_SALARY)} salary the employer still pays {formatAUD(EX_SG)} for the year, but a fortnightly-paid employee should now see a contribution after every pay rather than four times a year. The higher {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap gives {formatAUD(SUPER_GUARANTEE.concessionalCap - SUPER_GUARANTEE.concessionalCapPrevious)} more room for <Link href="/salary-sacrifice-calculator/">salary sacrifice</Link>. Separately, the second income tax rate fell from 16% to 15% on 1 July 2026, so most taxpayers pay slightly less tax &mdash; see <Link href="/tax-brackets/">tax brackets</Link>.
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
                        <td className="px-6 py-4">0.5%&ndash;1.0%</td>
                        <td className="px-6 py-4">Pre-mixed and single-sector options</td>
                        <td className="px-6 py-4">Most employees; lower fees, profit-to-member</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Retail fund</td>
                        <td className="px-6 py-4">0.8%&ndash;1.5%</td>
                        <td className="px-6 py-4">Wide range including managed funds and shares</td>
                        <td className="px-6 py-4">Active investors wanting specific fund managers</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Corporate fund</td>
                        <td className="px-6 py-4">0.3%&ndash;0.7%</td>
                        <td className="px-6 py-4">Tailored options negotiated by employer</td>
                        <td className="px-6 py-4">Employees of large corporations with in-house funds</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Public sector fund</td>
                        <td className="px-6 py-4">0.3%&ndash;0.6%</td>
                        <td className="px-6 py-4">Pre-mixed options, some defined benefit schemes</td>
                        <td className="px-6 py-4">Federal, state, and local government employees</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">SMSF</td>
                        <td className="px-6 py-4">$2,000&ndash;$5,000 fixed</td>
                        <td className="px-6 py-4">Direct shares, property, crypto, collectibles</td>
                        <td className="px-6 py-4">Balances above $500K; experienced investors</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3>Stapled Super Funds</h3>
              <p>
                Since 1 November 2021, when you start a new job without nominating a fund, your employer must request your &quot;stapled fund&quot; details from the ATO. This is your existing super fund that follows you from job to job, preventing the creation of duplicate accounts with unnecessary fees.
              </p>
              <h3>Default Funds (MySuper)</h3>
              <p>
                If you have no existing fund and do not nominate one, your employer opens an account in their default fund. All default funds must offer a &quot;MySuper&quot; product &mdash; a simple, low-cost option designed for members who do not make active investment choices. MySuper products are subject to annual performance testing by APRA; funds that fail 2 consecutive years are closed to new members.
              </p>
              <h3>Comparing Funds</h3>
              <p>
                When choosing a fund, compare investment fees (target under 1% p.a.), insurance premiums, investment performance over 5&ndash;10 year periods, and available tools such as salary sacrifice tracking and retirement projections. The ATO&apos;s YourSuper comparison tool at <a href="https://www.ato.gov.au/calculators-and-tools/super-yoursuper-comparison-tool" target="_blank" rel="noreferrer noopener" className="text-eucalyptus-dark hover:underline">ato.gov.au/yoursuper</a> compares MySuper products on fees and net returns.
              </p>
            </section>

            <section id="key-dates">
              <h2>What Are the Key Super Dates and Deadlines?</h2>
              <p>
                Employers must pay SG contributions <strong>every payday</strong>, with the money received by the fund within <strong>{SUPER_GUARANTEE_CHARGE.current.businessDaysToPay} business days</strong>. Missing that deadline triggers the Superannuation Guarantee Charge (SGC): the shortfall, notional earnings at the general interest charge rate compounded daily, and an administrative uplift of up to 60% that falls to nil on voluntary disclosure within 30 days. Unlike the old quarterly charge, the SGC is now <strong>tax-deductible</strong>.
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
                        <td className="px-6 py-4">1 April &ndash; 30 June 2026 (last quarter)</td>
                        <td className="px-6 py-4">Old quarterly system</td>
                        <td className="px-6 py-4 font-bold">{SUPER_GUARANTEE_CHARGE.legacy.finalQuarterSGDue} (SGC statement for a late payment due {SUPER_GUARANTEE_CHARGE.legacy.finalQuarterStatementDue})</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>
                Other super dates for FY{SITE_CONFIG.financialYear}: <strong>{SITE_CONFIG.financialYearEnd}</strong> is the last day for a personal deductible contribution to be received by your fund for the year; your total super balance at <strong>30 June {FY_START_YEAR}</strong> decides whether you can use carry-forward concessional cap amounts and the bring-forward rule this year; and <strong>31 October {FY_END_YEAR}</strong> is the lodgement due date for your {SITE_CONFIG.financialYear} tax return if you lodge yourself (later if you use a registered tax agent). The <Link href="/tax-calendar/">Australian Tax Calendar</Link> lists all key dates across the financial year, and our <Link href="/payday-super/">Payday Super guide</Link> explains the per-pay deadlines in detail.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <p>
                The superannuation system intersects with income tax brackets, salary packaging, and overall take-home pay calculations. These related tools and guides provide deeper analysis on specific aspects of Australian tax and payroll.
              </p>
              <ul>
                <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link> &mdash; Calculate the exact SG amount your employer must pay based on your salary, including the maximum contribution base cap.</li>
                <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> &mdash; Model the tax savings of redirecting pre-tax salary into super, with side-by-side before/after comparison.</li>
                <li><Link href="/concessional-contributions-cap/">Concessional Contributions Cap</Link> &mdash; The {formatAUD(SUPER_GUARANTEE.concessionalCap)} cap, carry-forward, and a calculator for your remaining room.</li>
                <li><Link href="/payday-super/">Payday Super Guide</Link> &mdash; How SG is paid each payday from {SUPER_GUARANTEE.paydaySuperStart}, with per-pay figures and due dates.</li>
                <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> &mdash; Calculate your after-tax income including super, Medicare Levy, HECS-HELP, and all deductions.</li>
                <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> &mdash; See exactly how the FY{SITE_CONFIG.financialYear} tax brackets apply to your assessable income.</li>
                <li><Link href="/hecs-help-calculator/">HECS-HELP Guide</Link> &mdash; Understand the new marginal repayment system and how HECS interacts with super salary sacrifice strategies.</li>
              </ul>
            </section>

            {/* --- CONTEXT BORDER --- */}

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <FaqAccordion faqs={SUPERANNUATION_GUIDE_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-sandstone bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-navy" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>Information on this page is based on current ATO legislation and Superannuation Guarantee Administration Act parameters for the {SITE_CONFIG.financialYear} Australian financial year, including Payday Super from {SUPER_GUARANTEE.paydaySuperStart}. Caps and thresholds were checked against the ATO&apos;s key superannuation rates and thresholds pages on 23 September 2026. Rules surrounding superannuation are subject to frequent federal updates.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("superannuation-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
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
                  <p className="text-eucalyptus-light text-sm mb-4">Calculate how your super impacts your total package instantly.</p>
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

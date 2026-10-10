import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { EMPLOYMENT, MEDICARE_LEVY, SITE_CONFIG, SOURCES, SUPER_GUARANTEE, TAX_BRACKETS, calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { DEFAULT_CONTRACTOR_ASSUMPTIONS as CA, WORKING_DAYS_PER_YEAR } from "@/lib/constants/contractor-rate";
import { CGT_DISCOUNT_RATES, CGT_MINIMUM_OWNERSHIP_MONTHS } from "@/lib/constants/capital-gains-tax";
import { CONTRIBUTIONS_TAX_RATE, DIVISION_293 } from "@/lib/constants/super-contributions";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import FaqAccordion from "@/components/common/faq-accordion";
import { BASE_RATE_ENTITY_TAX, TECH_SALARY_FAQS } from "./tech-salary-guide-australia-faqs";
import { DAYS_230, DAY_RATE_EXAMPLES, DAY_RATE_EXAMPLES_DEFAULT_DAYS, TECH_INCOME_YEAR, TECH_ROLE_ROWS } from "./tech-salary-guide-australia-data";
import { ATO_TABLE_15 } from "@/lib/data/job-pay-rates/common";
import FeaturedImage from "@/components/common/featured-image";

// Worked examples from the FY2026-27 engine (resident, no HECS). The old copy
// quoted $38,717 tax on $150,000, which matched neither 2025-26 nor 2026-27.
const EX150 = calculatePayBreakdown({ grossSalary: 150_000 });
const EX110 = calculatePayBreakdown({ grossSalary: 110_000 });
const EX110_SACRIFICE = calculatePayBreakdown({ grossSalary: 110_000, salarySacrifice: 10_000 });
// Tax and Medicare saved, less the 15% contributions tax the fund pays.
const SACRIFICE_SAVING = (EX110.totalDeductions - EX110_SACRIFICE.totalDeductions) - 10_000 * CONTRIBUTIONS_TAX_RATE;

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const SG = pct(SUPER_GUARANTEE.rate);
const [BRACKET_30, BRACKET_37] = [TAX_BRACKETS[2], TAX_BRACKETS[3]];
const [DR110] = DAY_RATE_EXAMPLES;
const [DD110, DD150] = DAY_RATE_EXAMPLES_DEFAULT_DAYS;
const DAYS_OFF_230 = CA.annualLeaveDays + CA.publicHolidayDays + (DAYS_230.personalLeaveDays ?? CA.personalLeaveDays);

const ATO_ESS_DEFERRED_URL =
  "https://www.ato.gov.au/businesses-and-organisations/corporate-tax-measures-and-assurance/employee-share-schemes/employers/types-of-ess/concessional-ess/tax-deferred-schemes";

const SOURCES_LIST: SourceLink[] = [
  { title: ATO_TABLE_15.title, url: ATO_TABLE_15.url, publisher: ATO_TABLE_15.publisher },
  { title: "Tax rates – Australian residents", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Super guarantee rates and thresholds", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee", publisher: SOURCES.ato.name },
  { title: "Annual leave (National Employment Standards)", url: "https://www.fairwork.gov.au/leave/annual-leave", publisher: SOURCES.fwo.name },
  { title: "Employee share schemes: employees", url: "https://www.ato.gov.au/businesses-and-organisations/corporate-tax-measures-and-assurance/employee-share-schemes/employees", publisher: SOURCES.ato.name },
  { title: "Employee share schemes: tax-deferred schemes and the deferred taxing point", url: ATO_ESS_DEFERRED_URL, publisher: SOURCES.ato.name },
  { title: "ESS and capital gains tax", url: "https://www.ato.gov.au/businesses-and-organisations/corporate-tax-measures-and-assurance/employee-share-schemes/employees/ess-and-your-tax/ess-and-capital-gains-tax", publisher: SOURCES.ato.name },
  { title: "Company tax rates 2025–26", url: "https://www.ato.gov.au/tax-rates-and-codes/company-tax-rates/tax-rates-2025-26", publisher: SOURCES.ato.name },
  { title: "Personal services income: how to attribute PSI", url: "https://www.ato.gov.au/businesses-and-organisations/income-deductions-and-concessions/personal-services-income/what-to-do-when-the-psi-rules-apply/how-to-attribute-psi", publisher: SOURCES.ato.name },
];

export default function TechSalaryGuideAustraliaPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">IT &amp; Tech Salary Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            IT &amp; Tech Salary Guide — What Tech Workers Earn in Australia
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Tech pay in Australia is set by the employment contract or an enterprise agreement unless an award applies, and the Professional Employees Award covers IT professionals only where the employer is principally in the IT or telecommunications industry. Net pay follows the ATO {SITE_CONFIG.financialYear} brackets: on a {formatAUD(110_000)} base, take-home is {formatAUD(EX110.takeHomePay)} a year after income tax and the Medicare levy, and employees receive {SG} super on top. This guide covers ATO median salaries for {TECH_ROLE_ROWS.length} tech occupations, the day rate a contractor needs to match a salary, how RSUs are taxed, and salary sacrifice.
          </p>
          <TrustBar className="!max-w-none" />
          <FeaturedImage lazy className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ── Section 1: Tech salaries by role (ATO Table 15A via the role spokes) ── */}
            <section id="pay-by-role">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tech Salaries by Role: What Tax Returns Show</h2>
              <p>
                The ATO&rsquo;s Taxation statistics {TECH_INCOME_YEAR} report the median salary or wages of everyone who gave each occupation on their tax return. The table lists all {TECH_ROLE_ROWS.length} tech occupations our role pages carry, highest median first. Each role page adds any award minimum that can apply and take-home pay on each figure.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <caption className="sr-only">Median salary or wages by tech occupation, {TECH_INCOME_YEAR} income year (ATO)</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Occupation (ATO)</th>
                        <th className="px-5 py-3 text-right">Median Salary or Wages, {TECH_INCOME_YEAR}</th>
                        <th className="px-5 py-3">Role Page</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {TECH_ROLE_ROWS.map((r) => (
                        <tr key={r.code}>
                          <td className="px-5 py-3">{r.title}</td>
                          <td className="px-5 py-3 text-right font-medium">{formatAUD(r.medianSalary)}</td>
                          <td className="px-5 py-3"><Link href={r.href} className="font-medium text-eucalyptus-dark hover:underline">{r.label}</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3 text-sm text-warmgray-light">
                  Source: {ATO_TABLE_15.publisher}, Individuals Table 15A. Medians cover everyone who gave the occupation on their {TECH_INCOME_YEAR} return and reported some salary or wages, including part-time and part-year workers, so they are not full-time rates or legal minimums. The ATO does not split occupations by seniority, so there is no official junior or senior figure. The table covers the ICT occupations on those pages plus data analysts and data scientists; statisticians, construction project managers and program administrators, which share the data analyst and project manager pages, are left out.
                </p>
              </div>
              <p>
                These figures are national. For earnings by state and territory across all industries, from ABS data, see <Link href="/average-salary-australia/">Average Salary Australia</Link>. Base salary is not the whole package at some employers: <a href="#salary-packaging">RSUs and share options</a> have their own tax rules, covered below.
              </p>
            </section>

            {/* ── Section 2: Contractor vs Permanent ── */}
            <section id="contractor-vs-permanent">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Contractor vs Permanent</h2>
              <p>
                Tech roles are offered both as permanent jobs and as contracts, billed through an ABN (sole trader) or a Pty Ltd company. A contractor&rsquo;s day rate has to cover what an employer would otherwise pay on top of salary: the Super Guarantee, the leave and public holidays an employee is paid for without working, and costs such as insurance and accounting.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Day Rate Matches a Salary? Our Calculation</h3>
              <p>
                The table works back from an employee package (salary plus {SG} super, with paid leave inside the salary) to the day rate a contractor must charge over {DR110.billableDays} billable days to earn the same. It uses the same method as our <Link href="/contractor-pay-calculator/">Contractor Pay Calculator</Link>.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <caption className="sr-only">Contractor day rate needed to match an employee package over {DR110.billableDays} billable days (our calculation)</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Employee Salary</th>
                        <th className="px-5 py-3 text-right">Super Guarantee ({SG})</th>
                        <th className="px-5 py-3 text-right">Insurance &amp; Admin</th>
                        <th className="px-5 py-3 text-right">Contractor Must Bill</th>
                        <th className="px-5 py-3 text-right">Day Rate ({DR110.billableDays} days)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {DAY_RATE_EXAMPLES.map((r) => (
                        <tr key={r.salary}>
                          <td className="px-5 py-3 font-medium text-navy">{formatAUD(r.salary)}</td>
                          <td className="px-5 py-3 text-right">{formatAUD(r.superGuarantee)}</td>
                          <td className="px-5 py-3 text-right">{formatAUD(r.insurance + r.admin)}</td>
                          <td className="px-5 py-3 text-right">{formatAUD(r.billedIncomeNeeded)}</td>
                          <td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(r.dayRate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-3 text-sm text-warmgray-light">
                  <p className="mb-1 font-medium">Our calculation. Assumptions behind every figure in this table:</p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>{WORKING_DAYS_PER_YEAR} weekdays a year ({EMPLOYMENT.weeksPerYear} weeks &times; 5). Not billed: {CA.annualLeaveDays} days&apos; annual leave ({EMPLOYMENT.annualLeaveWeeks} weeks, the NES minimum) and {CA.publicHolidayDays} weekday public holidays, leaving {DR110.billableDays} billable days. No sick days and no gap between contracts.</li>
                    <li>Super at the {SG} Super Guarantee rate on the salary, capped at the {formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} maximum contribution base for FY{SITE_CONFIG.financialYear}.</li>
                    <li>Insurance of {formatAUD(CA.insurancePerYear)} a year and accounting and admin of {formatAUD(CA.adminPerYear)} a year. These are round planning figures, not quotes: replace them with your own.</li>
                    <li>Day rates exclude GST and are rounded up to the dollar.</li>
                    <li>Not included: leave loading, workers&apos; compensation, income protection, long service leave and income tax.</li>
                  </ul>
                </div>
              </div>
              <p>
                Of the {formatAUD(DR110.salary)} salary, <strong>{formatAUD(DR110.leaveValue)}</strong> is pay for the {DAYS_OFF_230} days of annual leave and public holidays an employee is paid for without working; the contractor funds those days out of the {DR110.billableDays} they bill. Allow for {CA.personalLeaveDays} sick days and {CA.downtimeDays} days between contracts as well, the defaults in the Contractor Pay Calculator, and billable days fall to {DD110.billableDays}: the day rates rise to <strong>{formatAUD(DD110.dayRate)}</strong> and <strong>{formatAUD(DD150.dayRate)}</strong>.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>ABN vs Pty Ltd Considerations</h3>
              <p>
                Sole traders (ABN) are simpler to set up and pay tax at personal marginal rates on all business income. A <strong>Pty Ltd company</strong> has its own tax rate, <strong>{BASE_RATE_ENTITY_TAX}</strong> for a base rate entity in 2025&ndash;26 (ATO), but income produced mainly from your own skills or effort is personal services income (PSI). If the PSI rules apply, the company must attribute that income to you and it is taxed at your marginal rates. A company also carries its own accounting and reporting costs. Use the <Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Calculator</Link> and the <Link href="/employee-vs-sole-trader-vs-company/">Entity Structure Comparison</Link> to model the best structure for your situation.
              </p>
            </section>

            {/* ── Section 3: Salary Packaging & Perks ── */}
            <section id="salary-packaging">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Salary Packaging &amp; Perks</h2>
              <p>
                Pay in tech can include more than base salary. Two parts with their own tax rules are employee share scheme interests, such as RSUs and share options, and salary sacrifice into super.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Stock Options &amp; RSUs</h3>
              <p>
                RSUs and employee share options are employee share scheme (ESS) interests: rights to acquire shares in your employer. The ATO treats the <strong>discount</strong>, the market value of the interests less anything you paid for them, as assessable income taxed at your marginal rate. Your employer must give you an ESS statement showing the amount by 14 July after the end of each financial year.
              </p>
              <p>
                When it is taxed depends on the scheme. Under a <strong>taxed-upfront scheme</strong>, the discount is income in the year you acquire the interests. Under a <strong>tax-deferred scheme</strong>, such as one where unvested units are forfeited if you leave, it is income in the year of the <strong>deferred taxing point</strong>, valued at that time. For a right acquired after 30 June 2015, that is the earliest of:
              </p>
              <ul>
                <li>when there is no real risk of forfeiting the right and the scheme no longer genuinely restricts disposing of it;</li>
                <li>when you exercise the right, there is no real risk of forfeiting the resulting share and the scheme no longer genuinely restricts disposing of that share;</li>
                <li>15 years after you acquired the right.</li>
              </ul>
              <p>
                For RSUs that convert on vesting into shares you are free to sell, that is the vesting date. Leaving your job is no longer a taxing point where employment ends on or after 1 July 2022. If you sell within 30 days of the deferred taxing point, the sale date becomes the taxing point. Otherwise the shares are treated as acquired at their market value at the taxing point, so a later sale falls under capital gains tax, with the {CGT_DISCOUNT_RATES.individual * 100}% CGT discount if you own them for at least {CGT_MINIMUM_OWNERSHIP_MONTHS} months from that point. Source: <a href={ATO_ESS_DEFERRED_URL} target="_blank" rel="noopener noreferrer">ATO, tax-deferred employee share schemes</a>.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Salary Sacrifice for Super</h3>
              <p>
                Salary sacrificed into super is a concessional contribution, taxed at <strong>{pct(CONTRIBUTIONS_TAX_RATE)}</strong> inside the fund instead of at your marginal rate. In FY{SITE_CONFIG.financialYear} the marginal rate is <strong>{pct(BRACKET_30.rate)}</strong> on income from {formatAUD(BRACKET_30.min)} to {formatAUD(BRACKET_30.max)} and <strong>{pct(BRACKET_37.rate)}</strong> from {formatAUD(BRACKET_37.min)} to {formatAUD(BRACKET_37.max)}, plus the {pct(MEDICARE_LEVY.rate)} Medicare levy. If your income plus concessional contributions exceeds {formatAUD(DIVISION_293.threshold)}, Division 293 tax adds a further {pct(DIVISION_293.rate)} on the lesser of those contributions and the amount over the threshold. The concessional contribution cap is <strong>{formatAUD(SUPER_GUARANTEE.concessionalCap)} per year</strong> in FY{SITE_CONFIG.financialYear} (including employer SG). Use the <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model the tax savings for your salary level.
              </p>
            </section>

            {/* ── Section 4: Take-Home Pay on a Tech Salary ── */}
            <section id="take-home-pay">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Take-Home Pay on a Tech Salary</h2>
              <p>
                On a salary of <strong>$150,000</strong> a year, income tax and the Medicare levy come to approximately <strong>{formatAUD(EX150.totalDeductions)}</strong> for FY{SITE_CONFIG.financialYear}, leaving a take-home pay of approximately <strong>{formatAUD(EX150.takeHomePay)}</strong> per year (<strong>{formatAUD(EX150.takeHomePay / 26)} per fortnight</strong>). Superannuation at {SG} adds <strong>{formatAUD(EX150.superContribution)}</strong>, bringing the total package to <strong>{formatAUD(150_000 + EX150.superContribution)}</strong>.
              </p>
              <p>
                On <strong>$110,000</strong>, take-home pay is approximately <strong>{formatAUD(EX110.takeHomePay)}</strong> per year (<strong>{formatAUD(EX110.takeHomePay / 26)} per fortnight</strong>) after tax and Medicare. At this income level, salary sacrificing <strong>$10,000</strong> into super saves approximately <strong>{formatAUD(SACRIFICE_SAVING)}</strong> a year after the {pct(CONTRIBUTIONS_TAX_RATE)} contributions tax.
              </p>
              <div className="not-prose my-8">
                <Link href="/take-home-pay-calculator/" className="inline-flex items-center gap-2 px-6 py-3 bg-eucalyptus-dark text-white font-semibold rounded-lg hover:bg-navy transition-colors">
                  <Calculator className="h-5 w-5" />
                  Calculate Your Tech Take-Home Pay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* ── Section 5: FAQs ── */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={TECH_SALARY_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Occupation medians are from the ATO&rsquo;s Taxation statistics {TECH_INCOME_YEAR}, Individuals Table 15A: the median salary or wages of everyone who gave that occupation on their {TECH_INCOME_YEAR} tax return, read from the same data as our role pages. The contractor day rates are our calculation: salary plus the {SG} Super Guarantee plus {formatAUD(CA.insurancePerYear + CA.adminPerYear)} a year of insurance and admin, divided by {DR110.billableDays} billable days ({WORKING_DAYS_PER_YEAR} weekdays less {EMPLOYMENT.annualLeaveWeeks} weeks&apos; annual leave and {CA.publicHolidayDays} public holidays). Take-home figures use ATO resident tax rates and the Medicare levy for FY{SITE_CONFIG.financialYear}, with no HELP debt, no deductions, and private hospital cover so no Medicare levy surcharge. The RSU and ESS explanation follows ATO employee share scheme guidance, and the company tax rate is the ATO&rsquo;s 2025&ndash;26 rate. This guide quotes no recruiter or job-board salary data.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("tech-salary-guide-australia"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/contractor-vs-employee-calculator/" label="Contractor vs Employee" />
                    <SidebarLink href="/employee-vs-sole-trader-vs-company/" label="Entity Structure Comparison" />
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/average-salary-australia/" label="Average Salary Australia" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Contractor vs Employee?</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Compare your take-home pay as a permanent employee vs contractor at any day rate.</p>
                  <Link href="/contractor-vs-employee-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Compare Now
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
function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

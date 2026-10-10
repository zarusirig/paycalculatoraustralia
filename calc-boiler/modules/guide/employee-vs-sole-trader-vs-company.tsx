import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { SOLE_TRADER_COMPANY_FAQS } from "@/modules/guide/employee-vs-sole-trader-vs-company-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { EMPLOYMENT, MEDICARE_LEVY, SITE_CONFIG, SOURCES, SUPER_GUARANTEE, LITO, TAX_BRACKETS, TAX_FREE_THRESHOLD, calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { ABR_SOURCES, COMPANY_TAX, GST_RATE_SOURCE, GST_REGISTRATION, PSI_SOURCES } from "@/lib/constants/company-tax";
import { CONTRIBUTIONS_TAX_RATE } from "@/lib/constants/super-contributions";

const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const SG = pct(SUPER_GUARANTEE.rate);
const TOP_RATE = TAX_BRACKETS[TAX_BRACKETS.length - 1].rate;
const TOP = pct(TOP_RATE);
const ML = pct(MEDICARE_LEVY.rate);
const COMPANY_RATE = pct(COMPANY_TAX.baseRateEntityRate);
/** First individual bracket taxed above the company rate (30% from $45,001). */
const ABOVE_COMPANY = TAX_BRACKETS.find((b) => b.rate > COMPANY_TAX.baseRateEntityRate)!;

// Structure comparison, derived from the FY2026-27 engine. The old tables
// mixed 2025-26 rates with arithmetic errors (e.g. $38,838 tax on $150,000).
// The $70,000 director salary is an assumption of the worked example.
const DIRECTOR_SALARY = 70_000;
const COMPANY_TAX_RATE = COMPANY_TAX.baseRateEntityRate;
const COMPARISONS = [100_000, 150_000, 200_000].map((income) => {
  const employeeTax = calculatePayBreakdown({ grossSalary: income }).totalDeductions;
  const soleTraderSuper = Math.round(income * SUPER_GUARANTEE.rate);
  const soleTraderTax = calculatePayBreakdown({ grossSalary: income - soleTraderSuper }).totalDeductions;
  const companySuper = Math.round(DIRECTOR_SALARY * SUPER_GUARANTEE.rate);
  const companyTax =
    calculatePayBreakdown({ grossSalary: DIRECTOR_SALARY }).totalDeductions +
    Math.round((income - DIRECTOR_SALARY - companySuper) * COMPANY_TAX_RATE);
  return { income, employeeTax, soleTraderSuper, soleTraderTax, companySuper, companyTax };
});
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import FeaturedImage from "@/components/common/featured-image";

const SOURCES_LIST: SourceLink[] = [
  { title: "Business structures", url: "https://www.ato.gov.au/businesses-and-organisations/starting-registering-or-closing-a-business", publisher: SOURCES.ato.name },
  { title: "Changes to company tax rates (base rate entities)", url: COMPANY_TAX.sources.rateChanges, publisher: SOURCES.ato.name },
  { title: "Company tax rates 2025–26", url: COMPANY_TAX.sources.rates2025_26, publisher: SOURCES.ato.name },
  { title: "Tax rates – Australian residents", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Super guarantee rates and thresholds", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/super-guarantee", publisher: SOURCES.ato.name },
  { title: "Registering for GST", url: GST_REGISTRATION.source, publisher: SOURCES.ato.name },
  { title: "How GST works", url: GST_RATE_SOURCE, publisher: SOURCES.ato.name },
  { title: "Personal services income: how to attribute PSI", url: PSI_SOURCES.attribute, publisher: SOURCES.ato.name },
  { title: "Contractor vs employee", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/employee-or-independent-contractor", publisher: SOURCES.ato.name },
  { title: "National Employment Standards", url: "https://www.fairwork.gov.au/employment-conditions/national-employment-standards", publisher: SOURCES.fwo.name },
  { title: "Sole trader", url: ABR_SOURCES.soleTrader, publisher: "Australian Business Register" },
  { title: "Applying for an ABN", url: ABR_SOURCES.applying, publisher: "Australian Business Register" },
];

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}

export default function EmployeeVsSoleTraderVsCompanyPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Employee vs Sole Trader vs Company</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Employee vs Sole Trader vs Company — Which Structure Pays More?
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Your business structure determines how much tax you pay, whether you need to manage GST, how super works, and the level of personal liability you carry. Here is a real-numbers comparison at different income levels to help you choose the right structure.
          </p>
          <TrustBar className="!max-w-none" />
          <FeaturedImage className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <div className="bg-sandstone border-l-4 border-ochre p-5 rounded-r-xl not-prose my-8">
              <p className="text-navy text-sm"><strong>Disclaimer:</strong> This is general information only, not business structuring advice. Business structure decisions involve legal, tax, and commercial considerations unique to your situation. Consult a qualified accountant or business adviser before making changes to your structure.</p>
            </div>

            <section id="quick-comparison">
              <h2>Quick Comparison Table</h2>
              <p>
                The three most common structures in Australia each have distinct characteristics across tax, super, liability, and administration:
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-sandstone">
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Factor</th>
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Employee</th>
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Sole Trader (ABN)</th>
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Company (Pty Ltd)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Tax rates</td>
                        <td className="p-3 text-navy">Individual marginal (0&ndash;{TOP})</td>
                        <td className="p-3 text-navy">Individual marginal (0&ndash;{TOP})</td>
                        <td className="p-3 text-navy">Flat {COMPANY_RATE} (base rate entity), otherwise {pct(COMPANY_TAX.fullRate)}</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Superannuation</td>
                        <td className="p-3 text-navy">Employer pays {SG} SG</td>
                        <td className="p-3 text-navy">Self-funded (optional)</td>
                        <td className="p-3 text-navy">Company pays SG on director salary</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Personal liability</td>
                        <td className="p-3 text-navy">None (employer liable)</td>
                        <td className="p-3 text-navy">Unlimited personal liability</td>
                        <td className="p-3 text-navy">Limited to company assets</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Admin burden</td>
                        <td className="p-3 text-navy">Minimal — employer handles tax</td>
                        <td className="p-3 text-navy">Moderate — BAS, tax return, records</td>
                        <td className="p-3 text-navy">High — ASIC fees, separate return, accounts</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">GST</td>
                        <td className="p-3 text-navy">Not applicable</td>
                        <td className="p-3 text-navy">Required once GST turnover reaches {formatAUD(GST_REGISTRATION.threshold)}</td>
                        <td className="p-3 text-navy">Required once GST turnover reaches {formatAUD(GST_REGISTRATION.threshold)}</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Insurance</td>
                        <td className="p-3 text-navy">Workers comp via employer</td>
                        <td className="p-3 text-navy">Own public liability, PI, income protection</td>
                        <td className="p-3 text-navy">Company holds policies; directors may need D&O</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-navy font-medium">Asset protection</td>
                        <td className="p-3 text-navy">N/A</td>
                        <td className="p-3 text-navy">None — personal assets at risk</td>
                        <td className="p-3 text-navy">Strong — personal assets separated</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section id="employee">
              <h2>Employee</h2>
              <p>
                As an employee, your employer handles PAYG withholding, superannuation contributions ({SG} SG), workers&apos; compensation insurance, and payroll tax. You receive the National Employment Standards protections: {EMPLOYMENT.annualLeaveWeeks} weeks annual leave, {EMPLOYMENT.personalLeaveDays} days personal/carer&apos;s leave, notice of termination, and redundancy pay.
              </p>
              <p>
                Employees pay individual income tax at marginal rates from 0% to {TOP}, plus the {ML} Medicare levy. The tax-free threshold of {formatAUD(TAX_FREE_THRESHOLD)} applies, and the Low Income Tax Offset (LITO) provides up to {formatAUD(LITO.maxOffset)} in additional relief, phasing out completely at {formatAUD(LITO.nilOffsetIncome)}.
              </p>
              <p>
                <strong>Best for:</strong> Workers who value stability, paid leave, employer-funded super, and minimal administrative burden.
              </p>
            </section>

            <section id="sole-trader">
              <h2>Sole Trader (ABN)</h2>
              <p>
                A sole trader operates under their own name or a registered business name using an Australian Business Number (ABN). The sole trader and the business are legally the same entity — there is no separation between personal and business assets or liabilities.
              </p>
              <p>
                Sole traders pay individual income tax at the same marginal rates as employees. Business income is reported on the individual tax return, and deductions for business expenses reduce taxable income. The key differences from employment are:
              </p>
              <ul>
                <li><strong>No employer super</strong> — Super contributions are optional but highly recommended. You can claim a tax deduction for personal super contributions up to the {formatAUD(SUPER_GUARANTEE.concessionalCap)} concessional cap (FY{SITE_CONFIG.financialYear})</li>
                <li><strong>GST registration</strong> — Required within {GST_REGISTRATION.daysToRegister} days once GST turnover reaches <strong>{formatAUD(GST_REGISTRATION.threshold)}</strong>. Below this threshold, registration is optional but may be beneficial for claiming GST credits on business purchases</li>
                <li><strong>BAS lodgment</strong> — Quarterly (or monthly) Business Activity Statements reporting GST collected and paid, plus PAYG instalments on expected income tax</li>
                <li><strong>No leave entitlements</strong> — Time off means no income. An employee is paid for {EMPLOYMENT.annualLeaveWeeks} weeks&apos; annual leave, {EMPLOYMENT.personalLeaveDays} days&apos; personal leave and public holidays; a sole trader has to fund those days from the days they bill. The <Link href="/contractor-pay-calculator/">Contractor Pay Calculator</Link> prices them in</li>
                <li><strong>Business deductions</strong> — Home office, vehicle, tools, equipment, professional development, and other business-related expenses reduce taxable income</li>
              </ul>
              <p>
                <strong>Best for:</strong> Freelancers, contractors, and small operators who want simplicity and full control over their work. The Australian Business Register describes it as the simplest and cheapest business structure, and a successful online ABN application gives you your ABN immediately.
              </p>
            </section>

            <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
              <div className="flex items-start gap-4">
                <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-navy mb-1">Contractor or Employee?</h3>
                  <p className="text-navy text-sm mb-3">Not sure if your working arrangement is genuinely contracting or actually employment? Check the key indicators.</p>
                  <Link href="/contractor-vs-employee-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                    Use the Contractor vs Employee Calculator <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <section id="company">
              <h2>Company (Pty Ltd)</h2>
              <p>
                A proprietary limited company (Pty Ltd) is a separate legal entity from its directors and shareholders. The company earns income, pays tax, and can hold assets independently. This separation provides <strong>asset protection</strong> — creditors of the company generally cannot access the personal assets of directors.
              </p>
              <p>
                The base rate entity company tax rate is <strong>{COMPANY_RATE}</strong> for companies with aggregated turnover under ${COMPANY_TAX.aggregatedTurnoverThreshold / 1_000_000} million and no more than {pct(COMPANY_TAX.maxPassiveIncomeShare)} of assessable income from passive sources such as interest, rent and dividends; other companies pay {pct(COMPANY_TAX.fullRate)} (ATO, {COMPANY_TAX.firstYear} onwards). This flat rate is lower than the top individual marginal rate of {TOP} + {ML} Medicare levy = {pct(TOP_RATE + MEDICARE_LEVY.rate)}.
              </p>
              <p>
                A company may not lower the tax on <strong>personal services income</strong> (PSI): income produced mainly (more than 50%) from your own skills or effort. If the PSI rules apply, the company must attribute that income to you and it is taxed at your marginal rates (<a href={PSI_SOURCES.attribute} target="_blank" rel="noopener noreferrer">ATO</a>). Check the PSI rules before setting up a company to contract.
              </p>
              <h3>Paying Yourself from a Company</h3>
              <p>
                Company directors typically pay themselves through a combination of:
              </p>
              <ul>
                <li><strong>Salary/wages</strong> — Taxed at individual marginal rates. The company claims a deduction and must pay {SG} SG on the director&apos;s salary</li>
                <li><strong>Dividends</strong> — Distributed from after-tax profits. Franked dividends carry franking credits that offset the individual&apos;s tax liability</li>
                <li><strong>Retained earnings</strong> — Profits left in the company are taxed at {COMPANY_RATE} and can be reinvested or distributed later</li>
              </ul>
              <h3>Setup and Ongoing Costs</h3>
              <ul>
                <li>ASIC company registration and annual review fees (indexed each 1 July; check the current amounts at asic.gov.au)</li>
                <li>Accountant fees for the company tax return, BAS and bookkeeping, which vary with the work involved: get a quote before you set up</li>
                <li>Initial setup: ASIC registration plus initial accounting and bank setup</li>
              </ul>
              <p>
                <strong>Best for:</strong> Businesses that want asset protection, the ability to retain profits at {COMPANY_RATE}, and a separate legal entity for clients and contracts, where the income is not personal services income caught by the PSI rules.
              </p>
            </section>

            <section id="take-home-comparison">
              <h2>Take-Home Pay Comparison</h2>
              <p>
                The following tables are our calculation of approximate take-home outcomes at three income levels. The employee column assumes the employer pays SG on top. The sole trader column includes self-funded super at {SG}, claimed as a tax deduction. The company column assumes paying a {formatAUD(DIRECTOR_SALARY)} salary (our assumption) plus {SG} super and retaining the rest in the company.
              </p>

              {COMPARISONS.map((c) => (
              <div key={c.income} className="overflow-x-auto not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-sandstone">
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">At {formatAUD(c.income)} Income</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Employee</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Sole Trader</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Company</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Gross income</td>
                        <td className="p-3 text-navy text-right">{formatAUD(c.income)}</td>
                        <td className="p-3 text-navy text-right">{formatAUD(c.income)}</td>
                        <td className="p-3 text-navy text-right">{formatAUD(c.income)}</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Income tax + Medicare</td>
                        <td className="p-3 text-navy text-right">{formatAUD(c.employeeTax)}</td>
                        <td className="p-3 text-navy text-right">{formatAUD(c.soleTraderTax)}</td>
                        <td className="p-3 text-navy text-right">~{formatAUD(c.companyTax)}*</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Super cost</td>
                        <td className="p-3 text-navy text-right">$0 (employer pays)</td>
                        <td className="p-3 text-navy text-right">{formatAUD(c.soleTraderSuper)} (self-funded, deducted)</td>
                        <td className="p-3 text-navy text-right">{formatAUD(c.companySuper)} (on {formatAUD(DIRECTOR_SALARY)} salary)</td>
                      </tr>
                      <tr className="bg-eucalyptus-light/30">
                        <td className="p-3 text-navy font-bold">Cash in hand</td>
                        <td className="p-3 text-navy text-right font-bold">{formatAUD(c.income - c.employeeTax)}</td>
                        <td className="p-3 text-navy text-right font-bold">{formatAUD(c.income - c.soleTraderSuper - c.soleTraderTax)}</td>
                        <td className="p-3 text-navy text-right font-bold">~{formatAUD(c.income - c.companySuper - c.companyTax)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              ))}
              <p className="text-sm text-warmgray">
                *Company figures combine personal tax on the {formatAUD(DIRECTOR_SALARY)} director salary with {COMPANY_RATE} company tax on the remaining profit, which stays in the company (so the company &ldquo;cash in hand&rdquo; includes after-tax profit you have not yet drawn). Paying it out later as franked dividends tops the tax up to your personal marginal rate. They assume the PSI rules do not apply. The sole trader column deducts the self-funded super as a personal concessional contribution; the fund then pays {pct(CONTRIBUTIONS_TAX_RATE)} contributions tax on it. All figures use FY{SITE_CONFIG.financialYear} individual rates, leave out accounting and ASIC costs, and are simplified illustrations — consult an accountant for precise modelling.
              </p>
            </section>

            <section id="when-to-switch">
              <h2>When to Switch Structures</h2>
              <p>
                Switching from sole trader to company makes sense when several conditions align:
              </p>
              <ul>
                <li><strong>Profit you do not need to draw</strong> — A base rate entity pays {COMPANY_RATE} on its profit, against individual marginal rates of {pct(ABOVE_COMPANY.rate)} to {TOP} (plus the {ML} Medicare levy) on income above {formatAUD(ABOVE_COMPANY.min - 1)}. Profit paid out later as a franked dividend is topped up to your marginal rate, so the saving is on profit left in the company for reinvestment</li>
                <li><strong>Asset protection needs</strong> — If your business carries liability risk (client work, physical services, product supply), a company shields personal assets</li>
                <li><strong>Multiple income streams</strong> — A company can split income through dividends to shareholders (within tax laws) and employ family members; where the PSI rules apply, personal services income is attributed to the person who earned it instead</li>
                <li><strong>Professional credibility</strong> — Some clients and government contracts require engaging with a company rather than a sole trader</li>
              </ul>
              <p>
                Do <strong>not</strong> switch solely for tax reasons. A company adds accounting fees, ASIC registration and annual review fees, and compliance work (separate bank accounts, company tax returns, director obligations). Get those costs from your accountant and ASIC, and set them against the tax difference the tables above show at your income.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <ul>
                <li><Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Guide</Link> — Understand the legal distinction and ATO tests</li>
                <li><Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Calculator</Link> — Compare take-home pay for both arrangements</li>
                <li><Link href="/gig-economy-pay-guide/">Gig Economy Pay Guide</Link> — Tax and super for platform-based workers</li>
                <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> — Calculate individual tax at any income level</li>
                <li><Link href="/superannuation-guide/">Superannuation Guide</Link> — SG obligations and voluntary contribution strategies</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <FaqAccordion faqs={SOLE_TRADER_COMPANY_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-sandstone bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-navy" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>Tax comparisons use FY{SITE_CONFIG.financialYear} individual marginal rates and the Medicare levy from our tax engine (ATO resident rates), and the {COMPANY_RATE} base rate entity company tax rate the ATO applies from {COMPANY_TAX.firstYear} onwards. The take-home tables are our calculation and simplified illustrations: no deductions other than the sole trader&apos;s self-funded super, private hospital cover (no Medicare levy surcharge), no accounting or ASIC costs, and, for the company, an assumed {formatAUD(DIRECTOR_SALARY)} director salary with {SG} SG and the rest retained and taxed at {COMPANY_RATE}, with the PSI rules not applying. GST and company facts are from the ATO and the sole trader description from the Australian Business Register. This page quotes no accounting-fee estimates or income thresholds for switching structure. Actual outcomes depend on deductions, dividend timing, and individual circumstances. This is general information, not business structuring advice.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("employee-vs-sole-trader-vs-company"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/contractor-vs-employee-calculator/" label="Contractor vs Employee Calc" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                    <SidebarLink href="/contractor-pay-calculator/" label="Contractor Pay Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/contractor-vs-employee-calculator/" label="Contractor vs Employee Guide" />
                    <SidebarLink href="/gig-economy-pay-guide/" label="Gig Economy Pay Guide" />
                    <SidebarLink href="/superannuation-guide/" label="Superannuation Guide" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Compare your options</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Calculate the real take-home difference between contracting and employment at your income level.</p>
                  <Link href="/contractor-vs-employee-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Open Calculator
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

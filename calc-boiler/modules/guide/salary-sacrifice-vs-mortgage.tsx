import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { SALARY_SACRIFICE_VS_MORTGAGE_FAQS } from "./salary-sacrifice-vs-mortgage-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, SUPER_GUARANTEE, MEDICARE_LEVY, TAX_BRACKETS, formatAUD } from "@/lib/constants";
import { PRESERVATION_AGE_TABLE } from "@/lib/constants/pension-age";
import { CONTRIBUTIONS_TAX_RATE, DIVISION_293 } from "@/lib/constants/super-contributions";

// Scenario table, computed rather than typed. The old figures ($98K after 10
// years from $6,000 a year) exceeded even the pre-tax contributions grown at
// the gross return, and the mortgage row did not match any repayment model.
// Model: $6,000 a year of pre-tax salary.
//  - Super: 15% contributions tax, then growth at 7.5% less 15% earnings tax.
//  - Mortgage: the same $6,000 taxed at 30% + 2% Medicare, paid off the loan;
//    the value is the equity built (repayments plus interest avoided).
// Rates and ages in the prose below are rendered from lib/constants.
const pct = (r: number) => `${Math.round(r * 1000) / 10}%`;
const centsNum = (r: number) => Math.round(r * 100);
const MID_BRACKET = TAX_BRACKETS[2];
const [, LOW, MID, HIGH, TOP] = TAX_BRACKETS.map((b) => b.rate);
const PRESERVATION_AGE = PRESERVATION_AGE_TABLE[PRESERVATION_AGE_TABLE.length - 1].years;
const HIGH_SAVING = `${centsNum(HIGH - CONTRIBUTIONS_TAX_RATE)} to ${centsNum(TOP - CONTRIBUTIONS_TAX_RATE)} cents`;
const EX_SALARY = 100_000;
const EX_SG = EX_SALARY * SUPER_GUARANTEE.rate;
const PRE_TAX = 6_000;
const GROSS_RETURN = 0.075;
const SUPER_NET_RETURN = GROSS_RETURN * (1 - 0.15);
const MARGINAL = MID + MEDICARE_LEVY.rate;
const fv = (annual: number, rate: number, years: number) => (annual * ((1 + rate) ** years - 1)) / rate;
const SCENARIOS = [0.05, 0.06, 0.07].flatMap((rate) =>
  [10, 20].map((years) => ({
    key: `${rate}-${years}`,
    superValue: fv(PRE_TAX * 0.85, SUPER_NET_RETURN, years),
    mortgageValue: fv(PRE_TAX * (1 - MARGINAL), rate, years),
  })),
);
const k = (v: number) => `$${Math.round(v / 1000)}K`;
const CAP = SUPER_GUARANTEE.concessionalCap;
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import FeaturedImage from "@/components/common/featured-image";

const SOURCES_LIST: SourceLink[] = [
  { title: "Salary sacrificing for employees", url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/salary-sacrificing-for-employees", publisher: SOURCES.ato.name },
  { title: "Cash Rate Target", url: "https://www.rba.gov.au/statistics/cash-rate/", publisher: "Reserve Bank of Australia" },
  { title: "Concessional contributions cap", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/concessional-contributions-cap", publisher: SOURCES.ato.name },
];

export default function SalarySacrificeVsMortgagePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Salary Sacrifice vs Mortgage</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Salary Sacrifice vs Extra Mortgage Payments &mdash; Which Is Better?
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Salary sacrifice into super cuts your income tax now (contributions are taxed at {pct(CONTRIBUTIONS_TAX_RATE)} instead of your marginal rate), but the money stays in super until preservation age. Extra mortgage repayments earn a guaranteed, tax-free return equal to your mortgage interest rate, and you can reach that money through redraw or an offset account. Salary sacrifice comes out ahead when your marginal tax rate is high and your mortgage rate is low. Extra repayments win when retirement is close, you need access to the money or you want a guaranteed return. The scenario table below starts both options from the same monthly amount of pre-tax salary and compares the results at different mortgage rates. The rest of this guide covers when each option wins, how to split your spare cash between them and the FY{SITE_CONFIG.financialYear} concessional cap of {formatAUD(CAP)} that limits salary sacrifice.
          </p>
          <TrustBar className="!max-w-none" />
          <FeaturedImage className="mb-0 mt-6" />
        </header>

        {/* DISCLAIMER */}
        <div className="mb-10 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
          <strong>Disclaimer:</strong> This is general information, not financial advice. Your personal circumstances are unique. Consult a qualified financial adviser before making decisions about super contributions or mortgage strategies.
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="mv-content lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: Scenario Comparison (moved first: the comparison is the answer) */}
            <section id="scenario-comparison">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Scenario Comparison &mdash; $500/Month Extra</h2>
              <p>
                The table below compares directing an extra <strong>$500 per month</strong> ($6,000/year) into salary sacrifice versus extra mortgage payments, for a worker in the <strong>{pct(MID)} tax bracket</strong> ({formatAUD(MID_BRACKET.min)} to {formatAUD(MID_BRACKET.max)} taxable income). The table shows 10-year and 20-year outcomes at three mortgage interest rates.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-x-auto overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-4 py-4">Scenario</th>
                        <th className="px-4 py-4 border-l text-center" colSpan={2}>5% Mortgage</th>
                        <th className="px-4 py-4 border-l text-center" colSpan={2}>6% Mortgage</th>
                        <th className="px-4 py-4 border-l text-center" colSpan={2}>7% Mortgage</th>
                      </tr>
                      <tr className="bg-sandstone/70 text-xs">
                        <th className="px-4 py-2"></th>
                        <th className="px-4 py-2 border-l text-center">10 yr</th>
                        <th className="px-4 py-2 border-l text-center">20 yr</th>
                        <th className="px-4 py-2 border-l text-center">10 yr</th>
                        <th className="px-4 py-2 border-l text-center">20 yr</th>
                        <th className="px-4 py-2 border-l text-center">10 yr</th>
                        <th className="px-4 py-2 border-l text-center">20 yr</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-navy bg-sandstone">Salary sacrifice into super*</td>
                        {SCENARIOS.map((c) => (<td key={c.key} className="px-4 py-3 border-l text-center">{k(c.superValue)}</td>))}
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-navy bg-sandstone">Extra mortgage repayment**</td>
                        {SCENARIOS.map((c) => (<td key={c.key} className="px-4 py-3 border-l text-center">{k(c.mortgageValue)}</td>))}
                      </tr>
                      <tr className="bg-eucalyptus/5 font-semibold">
                        <td className="px-4 py-3 font-semibold text-navy bg-sandstone">Super advantage</td>
                        {SCENARIOS.map((c) => (<td key={c.key} className="px-4 py-3 border-l text-center text-eucalyptus-dark">+{k(c.superValue - c.mortgageValue)}</td>))}
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">*Super: {formatAUD(PRE_TAX)} a year of pre-tax salary, less {pct(CONTRIBUTIONS_TAX_RATE)} contributions tax ({formatAUD(PRE_TAX * (1 - CONTRIBUTIONS_TAX_RATE))} invested), growing at {pct(GROSS_RETURN)} less 15% earnings tax (about {pct(SUPER_NET_RETURN)} a year). **Mortgage: the same {formatAUD(PRE_TAX)} taxed at {pct(MID)} plus the {pct(MEDICARE_LEVY.rate)} Medicare levy ({formatAUD(PRE_TAX * (1 - MARGINAL))} a year) paid off the loan; the figure is the equity built, i.e. extra repayments plus the interest they avoid (guaranteed, tax-free). Figures are approximate and rounded, ignore fees, and assume constant returns.</p>
              </div>
              <p>
                At a <strong>5% mortgage rate</strong>, salary sacrifice wins over both timeframes. At <strong>7%</strong>, the super advantage narrows. If you value access to the money, the mortgage option becomes more attractive despite its lower figure in the table.
              </p>
            </section>

            {/* SECTION 2: The Core Trade-Off */}
            <section id="core-trade-off">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Core Trade-Off</h2>
              <p>
                Salary sacrifice builds your super balance and extra repayments cut your home loan. They differ on tax, return and access to the money:
              </p>
              <ul>
                <li><strong>Salary sacrifice into super:</strong> Contributions are taxed at <strong>{pct(CONTRIBUTIONS_TAX_RATE)}</strong> inside super instead of at your marginal tax rate of up to {pct(TOP)}, so you save tax straight away. Earnings inside super are then taxed at 15%. However, the money is <strong>locked until preservation age</strong> ({PRESERVATION_AGE} for anyone born on or after 1 July 1964) and a condition of release is met.</li>
                <li><strong>Extra mortgage payments:</strong> Every extra dollar paid off the mortgage provides a <strong>guaranteed &ldquo;return&rdquo;</strong> equal to your mortgage interest rate (a 6% rate gives a 6% guaranteed, tax-free return). You can reach that equity through redraw or refinancing.</li>
              </ul>
              <p>
                The decision comes down to this question: is the <strong>tax benefit of super</strong> ({HIGH_SAVING} per dollar in income tax for those in the {pct(HIGH)} or {pct(TOP)} brackets, plus the {pct(MEDICARE_LEVY.rate)} Medicare levy) worth more than the <strong>guaranteed, accessible return</strong> of paying down your mortgage?
              </p>
            </section>

            {/* SECTION 3: When Salary Sacrifice Wins */}
            <section id="when-super-wins">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When Salary Sacrifice Wins</h2>
              <ul>
                <li><strong>High marginal tax rate ({pct(HIGH)} or {pct(TOP)}):</strong> The income tax saving on contributions is {HIGH_SAVING} per dollar, plus the {pct(MEDICARE_LEVY.rate)} Medicare levy, and compound growth adds to that head start over time. If your income plus concessional contributions is over {formatAUD(DIVISION_293.threshold)}, Division 293 tax adds another {pct(DIVISION_293.rate)} on some or all of your contributions, which cuts the saving.</li>
                <li><strong>Low mortgage interest rate (under 5%):</strong> When your mortgage rate is low, the guaranteed return from extra repayments is modest, so super&apos;s higher expected return counts for more.</li>
                <li><strong>Long time to retirement (15+ years):</strong> More time means more compounding. The locked nature of super is less of a concern when preservation age is distant.</li>
                <li><strong>Unused concessional cap space:</strong> If you haven&apos;t been maximising your {formatAUD(CAP)} concessional cap (and have unused carry-forward amounts from previous years), the tax benefit is especially valuable.</li>
              </ul>
            </section>

            {/* SECTION 4: When Mortgage Wins */}
            <section id="when-mortgage-wins">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When Extra Mortgage Payments Win</h2>
              <ul>
                <li><strong>High mortgage interest rate, or a low appetite for risk:</strong> Every extra dollar on the loan earns a guaranteed, tax-free return equal to your mortgage rate. In the table above super still finishes ahead at 7%, but the table assumes a steady {pct(GROSS_RETURN)} gross return every year. Super returns are not guaranteed and can be negative in any given year.</li>
                <li><strong>Close to retirement (under 10 years):</strong> Less time for compounding reduces super&apos;s advantage, and you may need accessible equity for retirement planning.</li>
                <li><strong>Need for financial flexibility:</strong> Extra mortgage payments build accessible equity (via redraw or offset). Super is locked until preservation age. If you might need the money for renovations, emergencies, or career changes, mortgage equity is more useful.</li>
                <li><strong>Low marginal tax rate ({pct(LOW)} bracket):</strong> The {pct(CONTRIBUTIONS_TAX_RATE)} contributions tax matches the {pct(LOW)} income tax rate, so the saving from salary sacrifice is at most the {centsNum(MEDICARE_LEVY.rate)}c Medicare levy per dollar, which barely justifies locking money away for decades.</li>
                <li><strong>Large existing mortgage:</strong> If your mortgage is large relative to income, reducing the principal faster saves substantial interest over the remaining loan term.</li>
              </ul>
            </section>

            {/* SECTION 5: The Hybrid Approach */}
            <section id="hybrid-approach">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Hybrid Approach</h2>
              <p>
                You can also split your spare cash between both options:
              </p>
              <ol>
                <li><strong>Salary sacrifice to the cap:</strong> Contribute enough to maximise the tax benefit, particularly if you are in the {pct(HIGH)} or {pct(TOP)} bracket. For FY{SITE_CONFIG.financialYear}, the concessional cap is <strong>{formatAUD(CAP)}</strong> (including employer SG). If you earn {formatAUD(EX_SALARY)} and your employer pays {pct(SUPER_GUARANTEE.rate)} SG ({formatAUD(EX_SG)}), you can salary sacrifice up to {formatAUD(CAP - EX_SG)} before hitting the cap.</li>
                <li><strong>Direct remaining surplus to the mortgage:</strong> Any additional savings beyond the super cap (or beyond what you are comfortable locking away) go to extra mortgage payments for the guaranteed, accessible return.</li>
                <li><strong>Use an offset account:</strong> Rather than making direct extra repayments, park surplus cash in a mortgage offset account. This provides the same interest saving while keeping the money instantly accessible.</li>
              </ol>
              <p>
                The right split depends on your own tax bracket, mortgage rate and years to retirement. Use the <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model the tax impact and the <Link href="/">Pay Calculator</Link> to see your overall take-home pay position.
              </p>
            </section>

            {/* SECTION 6: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={SALARY_SACRIFICE_VS_MORTGAGE_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-sandstone bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-navy" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Both options start from the same {formatAUD(PRE_TAX)} a year ({formatAUD(PRE_TAX / 12)} a month) of pre-tax salary. Super: {pct(CONTRIBUTIONS_TAX_RATE)} contributions tax, then an assumed constant {pct(GROSS_RETURN)} gross return (an illustration, not a forecast) less 15% earnings tax. Mortgage: the same amount taxed at {pct(MID)} plus the {pct(MEDICARE_LEVY.rate)} Medicare levy, paid off the loan each year; the figure is the extra repayments plus the interest they avoid at the stated mortgage rate, compounded yearly. All figures are approximate illustrations, ignore fees, and do not constitute financial advice.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("salary-sacrifice-vs-mortgage"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="mv-sidebar space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Guide" />
                    <SidebarLink href="/superannuation-guide/" label="Superannuation Guide" />
                    <SidebarLink href="/tax-brackets/" label="Current Tax Brackets" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Model Your Salary Sacrifice</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">See exactly how much tax you save and how salary sacrifice impacts your take-home pay.</p>
                  <Link href="/salary-sacrifice-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Calculate Now <ArrowRight className="inline h-4 w-4 ml-1" />
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

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}

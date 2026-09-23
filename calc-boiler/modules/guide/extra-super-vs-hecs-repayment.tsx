"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { EXTRA_SUPER_VS_HECS_FAQS } from "./extra-super-vs-hecs-repayment-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, SUPER_GUARANTEE, HECS_HELP, MEDICARE_LEVY, calculateHECS, formatAUD } from "@/lib/constants";

// $200/month model. Both options use the same $200 of PRE-TAX salary: the old
// table compared $200 pre-tax into super with $200 AFTER tax off HECS, which
// overstated the HECS side by the tax on that $200.
const MONTHLY = 200;
const MARGINAL = 0.3 + MEDICARE_LEVY.rate;
// 7.5% gross less 0.7% fees, then 15% earnings tax (the assumptions stated below).
const SUPER_NET = (0.075 - 0.007) * 0.85;
const fv = (annual: number, rate: number, years: number) => (annual * ((1 + rate) ** years - 1)) / rate;
const SUPER_10Y = fv(MONTHLY * 12 * 0.85, SUPER_NET, 10);
const HECS_10Y = fv(MONTHLY * 12 * (1 - MARGINAL), HECS_HELP.indexationRate, 10);
const CAP = SUPER_GUARANTEE.concessionalCap;
const HECS_AT_90K = calculateHECS(90_000);
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Study and training loan indexation rates", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: SOURCES.ato.name },
  { title: "APRA Annual Fund-level Superannuation Statistics", url: "https://www.apra.gov.au/annual-fund-level-superannuation-statistics", publisher: "APRA" },
  { title: "Concessional contributions cap", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/concessional-contributions-cap", publisher: SOURCES.ato.name },
  { title: "Voluntary repayments of study and training loans", url: "https://www.ato.gov.au/individuals-and-families/study-and-training-support-loans/voluntary-repayments", publisher: SOURCES.ato.name },
];

export default function ExtraSuperVsHecsRepaymentPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Extra Super vs HECS Repayment</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Extra Super vs Paying Off HECS Faster &mdash; Which Should You Prioritise?
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            With spare cash, should you boost your super balance through voluntary contributions or make voluntary HECS-HELP repayments to eliminate your student debt? This guide compares the tax benefits, growth potential, and practical trade-offs to help you decide.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        {/* DISCLAIMER */}
        <div className="mb-10 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
          <strong>Disclaimer:</strong> This is general information, not financial advice. Your personal circumstances are unique. Consult a qualified financial adviser before making decisions about super contributions or debt repayment strategies.
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: The Core Question */}
            <section id="core-question">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Core Question</h2>
              <p>
                Both options use your surplus income productively, but they serve different financial goals:
              </p>
              <ul>
                <li><strong>Voluntary super contributions:</strong> Salary sacrifice or personal deductible contributions are taxed at just <strong>15%</strong> inside super (vs your marginal rate of up to 45%). Super then grows with compound returns over decades. The trade-off: the money is <strong>locked until preservation age</strong> (currently 60).</li>
                <li><strong>Voluntary HECS repayments:</strong> Extra payments reduce your outstanding HECS-HELP balance, eliminating future indexation on that portion and bringing you closer to a $0 balance. Once the debt is cleared, your compulsory repayments stop, increasing your take-home pay. The &ldquo;return&rdquo; on voluntary HECS repayments equals the <strong>indexation rate avoided</strong> (typically 3&ndash;4% under the CPI/WPI cap).</li>
              </ul>
              <p>
                The fundamental comparison: super offers a <strong>larger tax benefit and higher expected returns</strong> but locks your money away. HECS repayment offers a <strong>modest guaranteed return</strong> (avoiding indexation) and frees up future cash flow once the debt is cleared.
              </p>
            </section>

            {/* SECTION 2: HECS Indexation vs Super Returns */}
            <section id="indexation-vs-returns">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>HECS Indexation vs Super Returns</h2>
              <p>
                Understanding the &ldquo;cost&rdquo; of HECS and the &ldquo;return&rdquo; of super is essential to this comparison.
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>HECS-HELP Indexation</h3>
              <p>
                HECS-HELP debt is indexed on <strong>1 June each year</strong> to the lower of the Consumer Price Index (CPI) or the Wage Price Index (WPI). This cap was legislated in 2024 after the 7.1% indexation of June 2023, and applied retrospectively from 1 June 2023. The rate applied on 1 June 2026 was {(HECS_HELP.indexationRate * 100).toFixed(1)}%.
              </p>
              <p>
                Recent rates have been around <strong>3% to 4%</strong> or lower ({(HECS_HELP.indexationRate * 100).toFixed(1)}% in 2026). Your HECS debt grows by that rate on the balance as at 1 June &mdash; but it does not compound monthly like a mortgage. It is applied as a single annual adjustment.
              </p>
              <p>
                Crucially, HECS is an <strong>interest-free loan</strong> &mdash; indexation maintains the real value of the debt but does not add a profit margin. There is no benefit to paying it off early beyond avoiding the indexation amount.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Super Fund Returns</h3>
              <p>
                Balanced and growth super options have historically returned around <strong>7&ndash;8% per year</strong> before fees over long periods, though past returns are not guaranteed. After fees (typically 0.5&ndash;1.0%) and the 15% earnings tax inside super, the net return is closer to <strong>5.5&ndash;6.5%</strong> for a growth or balanced option.
              </p>
              <p>
                This comfortably exceeds the 3&ndash;4% HECS indexation rate in most years. However, super returns are <strong>not guaranteed</strong> &mdash; in any given year, returns could be negative. HECS indexation, by contrast, is a known cost that you can eliminate with certainty by making voluntary repayments.
              </p>
            </section>

            {/* SECTION 3: When Extra Super Wins */}
            <section id="when-super-wins">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When Extra Super Wins</h2>
              <ul>
                <li><strong>Young with a long time to retirement (25+ years):</strong> More time means more compounding. A $200/month contribution starting at age 25 could grow to over <strong>$200,000</strong> by age 60 at 7% gross returns, while indexation avoided on a HECS balance stops as soon as the debt is cleared.</li>
                <li><strong>Higher marginal tax rate (30%+):</strong> The tax saving of 15&ndash;30 cents per dollar (17&ndash;32 cents with the Medicare levy) contributed to super significantly outweighs the indexation saving on HECS.</li>
                <li><strong>Small HECS balance relative to income:</strong> If your HECS is under $20,000 and your compulsory repayments will clear it within 3&ndash;5 years anyway, the indexation cost is minimal and super contributions provide far more long-term value.</li>
                <li><strong>Unused concessional cap space:</strong> If you have carry-forward cap amounts from previous years (available when total super is under $500,000), the tax benefit is especially compelling.</li>
              </ul>
            </section>

            {/* SECTION 4: When Paying HECS Wins */}
            <section id="when-hecs-wins">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When Paying HECS Faster Wins</h2>
              <ul>
                <li><strong>Large HECS balance ($50,000+):</strong> A $60,000 HECS debt indexed at 4% costs $2,400 per year in indexation alone. Reducing the balance by $10,000 saves $400/year in indexation &mdash; a guaranteed, risk-free return.</li>
                <li><strong>High indexation environment:</strong> If CPI or WPI is running above 4%, the guaranteed return from avoiding indexation becomes more attractive relative to the uncertainty of super returns.</li>
                <li><strong>Close to paying off HECS:</strong> If you owe $5,000&ndash;$15,000 and a lump-sum payment would clear the debt entirely, eliminating the compulsory repayment from your payslip immediately boosts your take-home pay. Under the marginal system that is {formatAUD(HECS_AT_90K)} a year at a $90,000 income in FY{SITE_CONFIG.financialYear}, and up to 10% of repayment income at the top band.</li>
                <li><strong>About to cross a repayment threshold:</strong> If your income is close to a higher HECS repayment band, paying down the debt before 1 June can reduce the indexation amount applied that year.</li>
                <li><strong>Low marginal tax rate (15% bracket):</strong> The 15% contributions tax matches your 15% rate, so the super tax saving is at most the 2c Medicare levy per dollar, which barely justifies locking money away when you could eliminate a debt that grows with indexation each year.</li>
              </ul>
            </section>

            {/* SECTION 5: The Maths */}
            <section id="the-maths">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Maths &mdash; $200/Month Over 10 Years</h2>
              <p>
                The table below models directing <strong>$200 per month</strong> ($2,400/year) to either extra super contributions (via salary sacrifice) or voluntary HECS repayments, for a worker in the <strong>30% tax bracket</strong>.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Metric</th>
                        <th className="px-6 py-4 border-l text-right">Extra Super</th>
                        <th className="px-6 py-4 border-l text-right">Voluntary HECS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Monthly pre-tax salary used</td>
                        <td className="px-6 py-4 border-l text-right">$200</td>
                        <td className="px-6 py-4 border-l text-right">$200</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Tax on contribution</td>
                        <td className="px-6 py-4 border-l text-right">15% contributions tax ($30/mo)</td>
                        <td className="px-6 py-4 border-l text-right">30% + 2% Medicare levy ({formatAUD(MONTHLY * MARGINAL)}/mo)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Net amount working for you</td>
                        <td className="px-6 py-4 border-l text-right">{formatAUD(MONTHLY * 0.85)}/mo into super</td>
                        <td className="px-6 py-4 border-l text-right">{formatAUD(MONTHLY * (1 - MARGINAL))}/mo off HECS</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Growth rate assumption</td>
                        <td className="px-6 py-4 border-l text-right">~{(SUPER_NET * 100).toFixed(1)}% net after tax/fees</td>
                        <td className="px-6 py-4 border-l text-right">{(HECS_HELP.indexationRate * 100).toFixed(1)}% (indexation avoided, 1 June 2026 rate)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">10-year value created</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">~{formatAUD(Math.round(SUPER_10Y / 100) * 100)}</td>
                        <td className="px-6 py-4 border-l text-right">~{formatAUD(Math.round(HECS_10Y / 100) * 100)} (debt reduced + indexation saved)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Accessible before 60?</td>
                        <td className="px-6 py-4 border-l text-right">No</td>
                        <td className="px-6 py-4 border-l text-right">Yes (higher take-home pay)</td>
                      </tr>
                      <tr className="bg-eucalyptus/5">
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Tax saving (annual)</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">{formatAUD(MONTHLY * 12 * (MARGINAL - 0.15))}/yr</td>
                        <td className="px-6 py-4 border-l text-right">$0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Super assumes $200/mo salary sacrifice, 15% contributions tax, 7.5% gross return less 0.7% fees and 15% earnings tax. HECS assumes the same $200/mo of salary, taxed at 30% plus the 2% Medicare levy, paid off a large enough balance, with indexation at the {(HECS_HELP.indexationRate * 100).toFixed(1)}% applied on 1 June 2026. Figures are approximate illustrations.</p>
              </div>
              <p>
                At the 30% tax bracket, super comes out ahead over 10 years, mainly because the same pre-tax $200 puts {formatAUD(MONTHLY * 0.85)} into super but only {formatAUD(MONTHLY * (1 - MARGINAL))} off your HECS debt once income tax and the Medicare levy are taken out. The key differentiator is <strong>accessibility</strong>: the HECS reduction immediately benefits your cash flow once the debt is cleared, while the super balance remains locked. At higher tax brackets (37% or 45%), the super option pulls ahead more decisively due to the larger tax saving.
              </p>
            </section>

            {/* SECTION 6: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={EXTRA_SUPER_VS_HECS_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-sandstone bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-navy" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Comparisons on this page use illustrative assumptions: 7.5% gross super return (long-term median from APRA data), 15% contributions tax, 15% earnings tax, and 0.7% fees inside super. HECS indexation is modelled at the 1 June 2026 rate. All figures are approximate and do not constitute financial advice.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("extra-super-vs-hecs-repayment"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/hecs-help-calculator/" label="HECS-HELP Calculator" />
                    <SidebarLink href="/hecs-help-calculator/" label="HECS-HELP Guide" />
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                    <SidebarLink href="/superannuation-guide/" label="Superannuation Guide" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Check Your HECS Repayment</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">See how much your compulsory HECS repayment is and how it affects your take-home pay.</p>
                  <Link href="/hecs-help-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
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

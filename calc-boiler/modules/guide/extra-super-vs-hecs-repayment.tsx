"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Study and training loan indexation rates", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: SOURCES.ato.name },
  { title: "APRA Annual Fund-level Superannuation Statistics", url: "https://www.apra.gov.au/annual-fund-level-superannuation-statistics", publisher: "APRA" },
  { title: "Concessional contributions cap", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals/growing-and-keeping-track-of-your-super/caps-on-super-contributions/concessional-contributions-cap", publisher: SOURCES.ato.name },
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
                HECS-HELP debt is indexed on <strong>1 June each year</strong> to the lower of the Consumer Price Index (CPI) or the Wage Price Index (WPI). This cap was introduced by the government in 2023 following the indexation shock of 7.1% in June 2023 (when the cap was applied retrospectively).
              </p>
              <p>
                Under normal conditions, the indexation rate typically falls between <strong>3% and 4%</strong> per year. This means your HECS debt grows by 3&ndash;4% annually on the balance as at 1 June &mdash; but it does not compound monthly like a mortgage. It is applied as a single annual adjustment.
              </p>
              <p>
                Crucially, HECS is an <strong>interest-free loan</strong> &mdash; indexation maintains the real value of the debt but does not add a profit margin. There is no benefit to paying it off early beyond avoiding the indexation amount.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Super Fund Returns</h3>
              <p>
                According to APRA data, the median Australian super fund has returned approximately <strong>7&ndash;8% per year</strong> (before fees) over rolling 10-year periods. After fees (typically 0.5&ndash;1.0%) and the 15% earnings tax inside super, the net return is closer to <strong>5.5&ndash;6.5%</strong> for a growth or balanced option.
              </p>
              <p>
                This comfortably exceeds the 3&ndash;4% HECS indexation rate in most years. However, super returns are <strong>not guaranteed</strong> &mdash; in any given year, returns could be negative. HECS indexation, by contrast, is a known cost that you can eliminate with certainty by making voluntary repayments.
              </p>
            </section>

            {/* SECTION 3: When Extra Super Wins */}
            <section id="when-super-wins">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When Extra Super Wins</h2>
              <ul>
                <li><strong>Young with a long time to retirement (25+ years):</strong> More time means more compounding. A $200/month contribution starting at age 25 could grow to over <strong>$200,000</strong> by age 60 at 7% gross returns, compared to saving roughly <strong>$30,000&ndash;$40,000</strong> in avoided HECS indexation.</li>
                <li><strong>Higher marginal tax rate (30%+):</strong> The tax saving of 15&ndash;30 cents per dollar contributed to super significantly outweighs the 3&ndash;4% indexation saving on HECS.</li>
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
                <li><strong>Close to paying off HECS:</strong> If you owe $5,000&ndash;$15,000 and a lump-sum payment would clear the debt entirely, eliminating the compulsory repayment from your payslip immediately boosts your take-home pay by <strong>1&ndash;4%</strong> of gross income (depending on the repayment rate at your income level).</li>
                <li><strong>About to cross a repayment threshold:</strong> If your income is close to a higher HECS repayment band, paying down the debt before 1 June can reduce the indexation amount applied that year.</li>
                <li><strong>Low marginal tax rate (16&ndash;19% bracket):</strong> The super tax saving is only 1&ndash;4 cents per dollar, which barely justifies locking money away when you could eliminate a debt that costs 3&ndash;4% per year.</li>
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
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Monthly pre-tax cost</td>
                        <td className="px-6 py-4 border-l text-right">$200</td>
                        <td className="px-6 py-4 border-l text-right">$200 (after-tax)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Tax on contribution</td>
                        <td className="px-6 py-4 border-l text-right">15% ($30/mo)</td>
                        <td className="px-6 py-4 border-l text-right">Already taxed at 30%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Net amount working for you</td>
                        <td className="px-6 py-4 border-l text-right">$170/mo into super</td>
                        <td className="px-6 py-4 border-l text-right">$200/mo off HECS</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Growth rate assumption</td>
                        <td className="px-6 py-4 border-l text-right">~6.1% net after tax/fees</td>
                        <td className="px-6 py-4 border-l text-right">3.5% (indexation avoided)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">10-year value created</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">~$28,500</td>
                        <td className="px-6 py-4 border-l text-right">~$27,800 (debt reduced + indexation saved)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Accessible before 60?</td>
                        <td className="px-6 py-4 border-l text-right">No</td>
                        <td className="px-6 py-4 border-l text-right">Yes (higher take-home pay)</td>
                      </tr>
                      <tr className="bg-eucalyptus/5">
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Tax saving (annual)</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">$360/yr</td>
                        <td className="px-6 py-4 border-l text-right">$0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Super assumes $200/mo salary sacrifice, 15% contributions tax, 6.1% net return. HECS assumes $200/mo voluntary repayment reducing a $40,000 balance with 3.5% annual indexation avoided. Figures are approximate illustrations.</p>
              </div>
              <p>
                At the 30% tax bracket, the outcomes are remarkably close over 10 years. The key differentiator is <strong>accessibility</strong>: the HECS reduction immediately benefits your cash flow once the debt is cleared, while the super balance remains locked. At higher tax brackets (37% or 45%), the super option pulls ahead more decisively due to the larger tax saving.
              </p>
            </section>

            {/* SECTION 6: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="which-better" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is it better to pay off HECS or put extra into super?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    For most young workers with 20+ years to retirement, extra super contributions provide better long-term value due to the tax benefit (15% vs your marginal rate) and compound growth. However, if your HECS balance is large (&gt;$50,000) and indexation is high, paying it down faster can be worthwhile for the guaranteed return and improved cash flow.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="indexation" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How is HECS-HELP debt indexed?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    HECS-HELP debt is indexed annually on 1 June to the lower of the Consumer Price Index (CPI) or the Wage Price Index (WPI). This cap was introduced in 2023 to prevent debt growing faster than wages. Under normal conditions, indexation runs between 3% and 4% per year. Read the full breakdown in our <Link href="/hecs-help-guide/" className="text-eucalyptus-dark hover:underline">HECS-HELP Guide</Link>.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="compulsory-reduce" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do voluntary HECS repayments reduce my compulsory repayments?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Voluntary repayments reduce your outstanding balance but do <strong>not</strong> change the compulsory repayment percentage applied to your income. However, if your voluntary payments bring the balance to zero, compulsory repayments cease entirely &mdash; immediately boosting your take-home pay.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="super-tax" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What tax benefit do I get from extra super contributions?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Salary sacrifice or personal deductible contributions are taxed at 15% inside super instead of your marginal rate. The saving per dollar: 1c at the 16% bracket, 4c at 19%, 15c at 30%, 22c at 37%, or 30c at 45% (plus 2% Medicare Levy). For a worker in the 37% bracket contributing $500/month, the annual tax saving is approximately <strong>$1,320</strong>.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="both" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I do both extra super and voluntary HECS payments?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. If you have sufficient surplus cash flow, you can split between both. A common approach is to salary sacrifice up to the concessional cap ($30,000 including employer SG) for the tax benefit, then direct remaining surplus to voluntary HECS repayments. Use the <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> and <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS Calculator</Link> to model your options.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Comparisons on this page use illustrative assumptions: 7.5% gross super return (long-term median from APRA data), 15% contributions tax, 15% earnings tax, and 0.7% fees inside super. HECS indexation is modelled at 3.5% (mid-range of recent CPI/WPI-capped outcomes). All figures are approximate and do not constitute financial advice.</p>
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
                    <SidebarLink href="/hecs-help-guide/" label="HECS-HELP Guide" />
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

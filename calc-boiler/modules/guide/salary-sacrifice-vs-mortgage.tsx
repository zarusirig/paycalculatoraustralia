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
  { title: "Salary sacrificing for employees", url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/salary-sacrificing-for-employees", publisher: SOURCES.ato.name },
  { title: "Cash Rate Target", url: "https://www.rba.gov.au/statistics/cash-rate/", publisher: "Reserve Bank of Australia" },
  { title: "Concessional contributions cap", url: "https://www.ato.gov.au/individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-on-super-contributions/concessional-contributions-cap", publisher: SOURCES.ato.name },
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
            If you have spare cash flow, should you salary sacrifice into super for the tax benefit or make extra mortgage repayments for the guaranteed interest saving? The answer depends on your tax bracket, mortgage rate, and how far you are from retirement.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        {/* DISCLAIMER */}
        <div className="mb-10 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900">
          <strong>Disclaimer:</strong> This is general information, not financial advice. Your personal circumstances are unique. Consult a qualified financial adviser before making decisions about super contributions or mortgage strategies.
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: The Core Trade-Off */}
            <section id="core-trade-off">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Core Trade-Off</h2>
              <p>
                Both options reduce your effective debt or build wealth, but they work in fundamentally different ways:
              </p>
              <ul>
                <li><strong>Salary sacrifice into super:</strong> Contributions are taxed at just <strong>15%</strong> inside super (compared to your marginal tax rate of up to 45%), giving an immediate tax saving. Super then grows tax-efficiently at 15% on earnings. However, the money is <strong>locked until preservation age</strong> (currently 60) and a condition of release is met.</li>
                <li><strong>Extra mortgage payments:</strong> Every extra dollar paid off the mortgage provides a <strong>guaranteed &ldquo;return&rdquo;</strong> equal to your mortgage interest rate (e.g., 6% rate = 6% guaranteed, tax-free return). The equity is accessible via redraw or refinancing, giving you financial flexibility.</li>
              </ul>
              <p>
                The decision essentially comes down to: is the <strong>tax benefit of super</strong> (which could be 22% to 32% per dollar for those in the 37% or 45% brackets) worth more than the <strong>guaranteed, accessible return</strong> of paying down your mortgage?
              </p>
            </section>

            {/* SECTION 2: Scenario Comparison */}
            <section id="scenario-comparison">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Scenario Comparison &mdash; $500/Month Extra</h2>
              <p>
                The table below compares directing an extra <strong>$500 per month</strong> ($6,000/year) into salary sacrifice versus extra mortgage payments, for a worker in the <strong>30% tax bracket</strong> ($45,001&ndash;$135,000 income). We model 10-year and 20-year outcomes at three mortgage interest rates.
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
                        <td className="px-4 py-3 border-l text-center">$98K</td>
                        <td className="px-4 py-3 border-l text-center">$262K</td>
                        <td className="px-4 py-3 border-l text-center">$98K</td>
                        <td className="px-4 py-3 border-l text-center">$262K</td>
                        <td className="px-4 py-3 border-l text-center">$98K</td>
                        <td className="px-4 py-3 border-l text-center">$262K</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-navy bg-sandstone">Extra mortgage repayment**</td>
                        <td className="px-4 py-3 border-l text-center">$77K</td>
                        <td className="px-4 py-3 border-l text-center">$198K</td>
                        <td className="px-4 py-3 border-l text-center">$82K</td>
                        <td className="px-4 py-3 border-l text-center">$219K</td>
                        <td className="px-4 py-3 border-l text-center">$87K</td>
                        <td className="px-4 py-3 border-l text-center">$243K</td>
                      </tr>
                      <tr className="bg-eucalyptus/5 font-semibold">
                        <td className="px-4 py-3 font-semibold text-navy bg-sandstone">Super advantage</td>
                        <td className="px-4 py-3 border-l text-center text-eucalyptus-dark">+$21K</td>
                        <td className="px-4 py-3 border-l text-center text-eucalyptus-dark">+$64K</td>
                        <td className="px-4 py-3 border-l text-center text-eucalyptus-dark">+$16K</td>
                        <td className="px-4 py-3 border-l text-center text-eucalyptus-dark">+$43K</td>
                        <td className="px-4 py-3 border-l text-center text-eucalyptus-dark">+$11K</td>
                        <td className="px-4 py-3 border-l text-center text-eucalyptus-dark">+$19K</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">*Super assumes 7.5% gross return, 15% contributions tax, 15% earnings tax, net ~6.1% after-tax return. **Mortgage saving represents total interest avoided (guaranteed, tax-free). Both assume 30% marginal tax rate. Figures are approximate and rounded.</p>
              </div>
              <p>
                At a <strong>5% mortgage rate</strong>, salary sacrifice clearly wins over both timeframes. At <strong>7%</strong>, the super advantage narrows significantly &mdash; and for someone who values accessibility, the mortgage option becomes more compelling despite the lower headline number.
              </p>
            </section>

            {/* SECTION 3: When Salary Sacrifice Wins */}
            <section id="when-super-wins">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When Salary Sacrifice Wins</h2>
              <ul>
                <li><strong>High marginal tax rate (37% or 45%):</strong> The tax saving on contributions is 22&ndash;32 cents per dollar, creating a significant head start that compound growth amplifies over time.</li>
                <li><strong>Low mortgage interest rate (under 5%):</strong> When your mortgage rate is low, the guaranteed return from extra repayments is modest, making super&apos;s higher expected return more attractive.</li>
                <li><strong>Long time to retirement (15+ years):</strong> More time means more compounding. The locked nature of super is less of a concern when preservation age is distant.</li>
                <li><strong>Unused concessional cap space:</strong> If you haven&apos;t been maximising your $30,000 concessional cap (and have unused carry-forward amounts from previous years), the tax benefit is especially valuable.</li>
              </ul>
            </section>

            {/* SECTION 4: When Mortgage Wins */}
            <section id="when-mortgage-wins">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When Extra Mortgage Payments Win</h2>
              <ul>
                <li><strong>High mortgage interest rate (6%+):</strong> A guaranteed 6&ndash;7% tax-free return is hard to beat, especially on a risk-adjusted basis. Super returns are not guaranteed and can be negative in any given year.</li>
                <li><strong>Close to retirement (under 10 years):</strong> Less time for compounding reduces super&apos;s advantage, and you may need accessible equity for retirement planning.</li>
                <li><strong>Need for financial flexibility:</strong> Extra mortgage payments build accessible equity (via redraw or offset). Super is locked until preservation age. If you might need the money for renovations, emergencies, or career changes, mortgage equity is more useful.</li>
                <li><strong>Low marginal tax rate (16% or 19% bracket):</strong> The tax saving from salary sacrifice (just 1&ndash;4 cents per dollar) barely justifies locking money away for decades.</li>
                <li><strong>Large existing mortgage:</strong> If your mortgage is large relative to income, reducing the principal faster saves substantial interest over the remaining loan term.</li>
              </ul>
            </section>

            {/* SECTION 5: The Hybrid Approach */}
            <section id="hybrid-approach">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Hybrid Approach</h2>
              <p>
                For many Australians, the optimal strategy is a combination of both:
              </p>
              <ol>
                <li><strong>Salary sacrifice to the cap:</strong> Contribute enough to maximise the tax benefit, particularly if you are in the 37% or 45% bracket. For FY2025-26, the concessional cap is <strong>$30,000</strong> (including employer SG). If your employer contributes $12,000 in SG, you can salary sacrifice up to $18,000 before hitting the cap.</li>
                <li><strong>Direct remaining surplus to the mortgage:</strong> Any additional savings beyond the super cap (or beyond what you are comfortable locking away) goes to extra mortgage payments for the guaranteed, accessible return.</li>
                <li><strong>Use an offset account:</strong> Rather than making direct extra repayments, park surplus cash in a mortgage offset account. This provides the same interest saving while keeping the money instantly accessible.</li>
              </ol>
              <p>
                The right split depends on your specific numbers. Use the <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model the tax impact and the <Link href="/">Pay Calculator</Link> to see your overall take-home pay position.
              </p>
            </section>

            {/* SECTION 6: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="which-better" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is salary sacrifice into super better than paying off a mortgage?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    It depends on your marginal tax rate, mortgage rate, and time to retirement. Generally, salary sacrifice provides a better long-term outcome when your tax rate is high (37%+) and your mortgage rate is below 5&ndash;6%. Extra mortgage payments win when rates are high and you need financial flexibility.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tax-benefit" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much tax do I save by salary sacrificing into super?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Salary sacrifice contributions are taxed at 15% inside super. If your marginal rate is 30%, you save 15 cents per dollar. At 37%, you save 22 cents. At 45%, you save 30 cents (plus the 2% Medicare Levy saving). For someone in the 37% bracket salary sacrificing $500/month, that is <strong>$1,320 per year</strong> in tax savings.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="access-super" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I access salary sacrificed super to pay off my mortgage?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Not until you reach preservation age (currently 60) and meet a condition of release such as retirement. There is no provision to withdraw super for mortgage payments under normal circumstances. Early access is only available in cases of severe financial hardship, terminal illness, or compassionate grounds as determined by the ATO.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="cap" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the maximum I can salary sacrifice into super?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The concessional contributions cap is <strong>$30,000 per year</strong> for FY2025-26. This includes employer SG contributions and salary sacrifice. Unused cap amounts from the previous 5 financial years can be carried forward if your total super balance is under $500,000. Use the <Link href="/salary-sacrifice-calculator/" className="text-eucalyptus-dark hover:underline">Salary Sacrifice Calculator</Link> to model your specific situation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="hybrid" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Should I do both salary sacrifice and extra mortgage payments?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    A hybrid approach often works best. Salary sacrifice enough to capture the tax benefit (especially if in the 37% or 45% bracket), then direct surplus cash to mortgage repayments or an offset account. This balances the tax advantage with financial accessibility.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Scenario comparisons assume a constant contribution of $500/month, 7.5% gross super return (long-term average for a balanced/growth fund), 15% contributions tax and 15% earnings tax inside super. Mortgage comparisons assume interest savings on a standard variable rate loan. All figures are approximate illustrations and do not constitute financial advice.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("salary-sacrifice-vs-mortgage"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                    <SidebarLink href="/salary-sacrifice-guide/" label="Salary Sacrifice Guide" />
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

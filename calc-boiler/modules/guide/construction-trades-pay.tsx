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
  { title: "Building and Construction General On-site Award", url: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000020-building-and-construction-general-on-site-award", publisher: SOURCES.fwo.name },
  { title: "Construction industry earnings", url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia", publisher: SOURCES.abs.name },
];

export default function ConstructionTradesPayPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Construction &amp; Trades Pay Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Construction &amp; Trades Pay Guide — Rates, Overtime &amp; Apprentice Wages
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Construction and trades workers are among Australia&apos;s highest-paid blue-collar employees, with qualified tradies earning $65,000 to $120,000+ depending on trade, experience, and overtime. This guide covers qualified trade rates, apprentice pay scales, site allowances, overtime provisions, and how to calculate your real take-home pay.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ── Section 1: Qualified Trade Rates ── */}
            <section id="trade-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Qualified Trade Rates</h2>
              <p>
                Qualified tradespeople in Australia earn well above the national average, driven by strong demand in residential construction, infrastructure projects, and commercial building. The table below shows typical annual salary ranges for qualified tradies, including base salary and common overtime. Actual earnings vary by state, employer, and whether the worker is employed under an enterprise agreement or the Building and Construction General On-site Award.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Trade</th>
                        <th className="px-5 py-3 text-right">Salary Range (Annual)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Electrician</td><td className="px-5 py-3 text-right font-medium">$80,000 – $110,000</td></tr>
                      <tr><td className="px-5 py-3">Plumber</td><td className="px-5 py-3 text-right font-medium">$75,000 – $105,000</td></tr>
                      <tr><td className="px-5 py-3">Carpenter</td><td className="px-5 py-3 text-right font-medium">$70,000 – $95,000</td></tr>
                      <tr><td className="px-5 py-3">Bricklayer</td><td className="px-5 py-3 text-right font-medium">$70,000 – $90,000</td></tr>
                      <tr><td className="px-5 py-3">Painter</td><td className="px-5 py-3 text-right font-medium">$65,000 – $85,000</td></tr>
                      <tr><td className="px-5 py-3">Concreter</td><td className="px-5 py-3 text-right font-medium">$70,000 – $95,000</td></tr>
                      <tr><td className="px-5 py-3">Boilermaker</td><td className="px-5 py-3 text-right font-medium">$85,000 – $120,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Boilermakers and electricians command the highest rates due to specialised skills and demand from the mining and heavy industry sectors. Self-employed tradies running their own business can earn significantly more — an experienced plumber or electrician with their own client base may gross <strong>$150,000–$250,000</strong> per year, though business costs reduce the net figure. See the <Link href="/average-salary-australia/">Average Salary Australia</Link> page for broader comparisons.
              </p>
            </section>

            {/* ── Section 2: Apprentice Pay Rates ── */}
            <section id="apprentice-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Apprentice Pay Rates</h2>
              <p>
                Apprentice wages in Australia are set as a percentage of the qualified trade rate, increasing each year as the apprentice gains skills and experience. The Building and Construction General On-site Award specifies minimum apprentice rates, though many employers and enterprise agreements pay above these minimums.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Year</th>
                        <th className="px-5 py-3 text-right">% of Trade Rate</th>
                        <th className="px-5 py-3 text-right">Approx. Annual (Electrician)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">Year 1</td><td className="px-5 py-3 text-right">~55%</td><td className="px-5 py-3 text-right">$44,000 – $49,000</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Year 2</td><td className="px-5 py-3 text-right">~65%</td><td className="px-5 py-3 text-right">$52,000 – $58,000</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Year 3</td><td className="px-5 py-3 text-right">~80%</td><td className="px-5 py-3 text-right">$64,000 – $72,000</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Year 4</td><td className="px-5 py-3 text-right">~95%</td><td className="px-5 py-3 text-right">$76,000 – $86,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Adult Apprentice Rates</h3>
              <p>
                Adult apprentices (aged 21 and over) receive higher minimum rates than school-leaver apprentices. Under most awards and enterprise agreements, adult apprentices earn at least the <strong>national minimum wage</strong> ($24.10/hr) from Year 1, rather than the reduced junior apprentice rate. This recognises that adult apprentices have higher living costs and may have family responsibilities.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Government Incentives</h3>
              <p>
                The Australian Government offers incentives to support apprenticeships. The <strong>Australian Apprenticeships Incentive System</strong> provides payments to eligible employers and apprentices, including priority payments for trades experiencing skills shortages. Apprentices in priority trades may receive <strong>$5,000–$10,000</strong> in direct payments over the course of their apprenticeship. Additionally, tools and equipment purchased for an apprenticeship are <strong>tax-deductible</strong> for the apprentice.
              </p>
            </section>

            {/* ── Section 3: Site Allowances ── */}
            <section id="site-allowances">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Site Allowances</h2>
              <p>
                Construction workers receive various allowances on top of their base rate to compensate for the specific conditions of construction work. These allowances are set out in the Building and Construction General On-site Award and enterprise agreements.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Allowance</th>
                        <th className="px-5 py-3 text-right">Typical Amount</th>
                        <th className="px-5 py-3">Paid When</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Industry Allowance</td><td className="px-5 py-3 text-right font-medium">$32–$45/day</td><td className="px-5 py-3">All on-site construction work</td></tr>
                      <tr><td className="px-5 py-3">Tool Allowance</td><td className="px-5 py-3 text-right font-medium">$20–$35/day</td><td className="px-5 py-3">Tradies who supply own tools</td></tr>
                      <tr><td className="px-5 py-3">Height Allowance</td><td className="px-5 py-3 text-right font-medium">$0.60–$1.50/hr</td><td className="px-5 py-3">Working above certain heights</td></tr>
                      <tr><td className="px-5 py-3">Confined Space</td><td className="px-5 py-3 text-right font-medium">$0.80–$1.50/hr</td><td className="px-5 py-3">Working in confined spaces</td></tr>
                      <tr><td className="px-5 py-3">Travel / Fares</td><td className="px-5 py-3 text-right font-medium">$20–$30/day</td><td className="px-5 py-3">Travelling to site beyond set distance</td></tr>
                      <tr><td className="px-5 py-3">First Aid</td><td className="px-5 py-3 text-right font-medium">$3.50–$4.50/day</td><td className="px-5 py-3">Designated first aid officer</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                On major commercial and infrastructure projects, enterprise agreement site allowances can be <strong>significantly higher</strong> — $50–$80+ per day on large CBD projects. These allowances can add <strong>$8,000–$15,000</strong> per year to a construction worker&apos;s income. All allowances are treated as ordinary income for tax purposes. Check the <Link href="/award-rates/">Award Rates Guide</Link> for more details on construction award provisions.
              </p>
            </section>

            {/* ── Section 4: Overtime in Construction ── */}
            <section id="overtime">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Overtime in Construction</h2>
              <p>
                Overtime is a significant component of construction worker earnings. The Building and Construction General On-site Award sets the following overtime provisions:
              </p>
              <ul>
                <li><strong>Monday to Friday:</strong> Time-and-a-half for the first 2 hours beyond ordinary hours (7.6 hours/day or 38 hours/week), then double time thereafter.</li>
                <li><strong>Saturday:</strong> Time-and-a-half for the first 2 hours, then double time for all subsequent hours. A minimum 3-hour engagement applies.</li>
                <li><strong>Sunday:</strong> Double time for all hours worked. A minimum 3-hour engagement applies.</li>
                <li><strong>Public Holidays:</strong> Double time and a half (2.5x) for all hours worked, with a minimum 4-hour engagement.</li>
              </ul>
              <p>
                A qualified carpenter earning <strong>$40/hr</strong> base rate who works 5 hours of overtime on a Saturday earns: 2 hours at $60/hr + 3 hours at $80/hr = <strong>$360</strong> for the Saturday shift alone. Over a year, regular Saturday work can add <strong>$15,000–$25,000</strong> to annual income. Use the <Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> to model your exact overtime earnings.
              </p>
            </section>

            {/* ── Section 5: Take-Home Pay Examples ── */}
            <section id="take-home-examples">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Take-Home Pay Examples</h2>
              <p>
                Below are take-home pay estimates for common construction and trades roles in FY2025-26, including typical allowances but excluding overtime:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Role</th>
                        <th className="px-5 py-3 text-right">Gross Annual</th>
                        <th className="px-5 py-3 text-right">Tax + Medicare</th>
                        <th className="px-5 py-3 text-right">Take-Home</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Painter</td><td className="px-5 py-3 text-right">$75,000</td><td className="px-5 py-3 text-right">$15,467</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">$59,533</td></tr>
                      <tr><td className="px-5 py-3">Carpenter</td><td className="px-5 py-3 text-right">$85,000</td><td className="px-5 py-3 text-right">$18,467</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">$66,533</td></tr>
                      <tr><td className="px-5 py-3">Electrician</td><td className="px-5 py-3 text-right">$95,000</td><td className="px-5 py-3 text-right">$21,717</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">$73,283</td></tr>
                      <tr><td className="px-5 py-3">Boilermaker</td><td className="px-5 py-3 text-right">$105,000</td><td className="px-5 py-3 text-right">$24,717</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">$80,283</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="not-prose my-8">
                <Link href="/take-home-pay-calculator/" className="inline-flex items-center gap-2 px-6 py-3 bg-eucalyptus-dark text-white font-semibold rounded-lg hover:bg-navy transition-colors">
                  <Calculator className="h-5 w-5" />
                  Calculate Your Tradie Take-Home Pay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* ── Section 6: FAQs ── */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="tradie-salary" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much do tradies earn in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Qualified tradies earn between $65,000 and $120,000 depending on trade, experience, and overtime. Electricians ($80K–$110K) and boilermakers ($85K–$120K) are among the highest-paid trades. Self-employed tradies with their own business can gross $150K–$250K+ but have higher business costs.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="apprentice-pay" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much do apprentices get paid?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Apprentice wages start at approximately 55% of the qualified trade rate in Year 1, increasing to 65% in Year 2, 80% in Year 3, and 95% in Year 4. For an electrician apprentice, this means approximately $44K–$49K in Year 1, rising to $76K–$86K in Year 4. Adult apprentices (21+) receive higher minimum rates.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="overtime-rates" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What are the overtime rates in construction?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Under the Building and Construction General On-site Award, overtime is time-and-a-half for the first 2 hours and double time thereafter on weekdays. Saturday is time-and-a-half for the first 2 hours then double time. Sunday is double time for all hours. Public holidays are double time and a half (2.5x).</AccordionContent>
                </AccordionItem>
                <AccordionItem value="site-allowance" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is a site allowance?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">A site allowance is a daily payment made to construction workers to compensate for the conditions of working on a construction site, including noise, dust, and lack of permanent amenities. The industry allowance ranges from $32–$45/day under the award, but enterprise agreement site allowances on major projects can be $50–$80+ per day.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="tool-allowance" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is the tool allowance taxable?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes, the tool allowance is assessable income and included in your gross earnings for tax purposes. However, you can claim a deduction for the cost of tools you purchase for work. If individual tools cost less than $300, you can claim an immediate deduction. Tools costing more than $300 must be depreciated over their effective life.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="highest-paid" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the highest-paid trade in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Boilermakers and electricians are typically the highest-paid trades, with qualified workers earning $85K–$120K. Electricians working in mining or oil and gas can earn $130K–$170K+. Crane operators, while not a traditional trade, can earn $100K–$150K+ on major construction projects due to their specialised skills and the high demand for certified operators.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Construction and trades salary data is compiled from ABS average weekly earnings for the construction industry, Fair Work Commission pay guides for the Building and Construction General On-site Award, and published enterprise agreement rates. Salary ranges represent total annual earnings including base rate and typical allowances, but excluding overtime. Tax calculations use ATO marginal rates for FY2025-26 including the 2% Medicare levy.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("construction-trades-pay"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/award-rates/" label="Award Rates Guide" />
                    <SidebarLink href="/overtime-pay-calculator/" label="Overtime Calculator" />
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/average-salary-australia/" label="Average Salary Australia" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Calculate Overtime Pay</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Enter your base rate and overtime hours to see exactly how much extra you earn each week.</p>
                  <Link href="/overtime-pay-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Overtime Calculator
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

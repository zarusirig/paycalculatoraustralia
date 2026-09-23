"use client";
import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { APPRENTICE_ELECTRICIAN, CONSTRUCTION_TRADES_FAQS } from "@/modules/guide/construction-trades-pay-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { INDUSTRY_ALLOWANCE, CARPENTER_TOOL_ALLOWANCE, MULTISTOREY_ALLOWANCE } from "@/lib/data/job-pay-rates/building-construction-common";

const TRADE_TAKE_HOME = [
  { role: "Painter", gross: 75_000 },
  { role: "Carpenter", gross: 85_000 },
  { role: "Electrician", gross: 95_000 },
  { role: "Boilermaker", gross: 105_000 },
] as const;
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Building and Construction General On-site Award", url: "https://services.fairwork.gov.au/find-my-award", publisher: SOURCES.fwo.name },
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
                Apprentice wages in Australia are set as a percentage of the qualified trade rate, increasing each year as the apprentice gains skills and experience. Each award sets its own percentages: the table shows the Electrical award minimums for an apprentice electrician who completed Year 12 (50%, 60%, 70% and 82% if they did not). The Building and Construction General On-site Award sets separate percentages for carpentry and other building apprentices, and many employers and enterprise agreements pay above these minimums.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Year</th>
                        <th className="px-5 py-3 text-right">% of Trade Rate</th>
                        <th className="px-5 py-3 text-right">Award minimum, apprentice electrician (38 hrs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {APPRENTICE_ELECTRICIAN.map((r) => (
                        <tr key={r.year}><td className="px-5 py-3 font-medium">{r.year}</td><td className="px-5 py-3 text-right">{Math.round(r.pct * 100)}%</td><td className="px-5 py-3 text-right">{formatAUD(r.hourly * 38 * 52)} ({formatAUD(r.hourly, 2)}/hr)</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Adult Apprentice Rates</h3>
              <p>
                Adult apprentices (aged 21 and over) receive higher minimum rates than school-leaver apprentices. Under the Electrical award, for example, an adult apprentice gets 80% of the qualified electrician rate in first year ($25.87/hr) and at least the grade 1 rate from second year ($28.90/hr), instead of the junior apprentice percentages. This recognises that adult apprentices have higher living costs and may have family responsibilities.
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
                      <tr><td className="px-5 py-3">Industry Allowance</td><td className="px-5 py-3 text-right font-medium">{formatAUD(INDUSTRY_ALLOWANCE.general, 2)}/week ({formatAUD(INDUSTRY_ALLOWANCE.residential, 2)} residential)</td><td className="px-5 py-3">All on-site construction work (cl 22.1, all purposes)</td></tr>
                      <tr><td className="px-5 py-3">Tool Allowance</td><td className="px-5 py-3 text-right font-medium">{formatAUD(CARPENTER_TOOL_ALLOWANCE, 2)}/week (carpenter)</td><td className="px-5 py-3">Set per trade in cl 21.1; carpenters and joiners shown</td></tr>
                      <tr><td className="px-5 py-3">{MULTISTOREY_ALLOWANCE.name}</td><td className="px-5 py-3 text-right font-medium">{MULTISTOREY_ALLOWANCE.amount}</td><td className="px-5 py-3">Buildings of 5 or more storeys, rising with floor level (cl 23.3(e))</td></tr>
                      <tr><td className="px-5 py-3">Confined Space</td><td className="px-5 py-3 text-right font-medium">Per hour, set by the award</td><td className="px-5 py-3">Working in confined spaces</td></tr>
                      <tr><td className="px-5 py-3">Travel / Fares</td><td className="px-5 py-3 text-right font-medium">Per day, set by the award</td><td className="px-5 py-3">Travelling to site beyond set distance</td></tr>
                      <tr><td className="px-5 py-3">First Aid</td><td className="px-5 py-3 text-right font-medium">Per day, set by the award</td><td className="px-5 py-3">Designated first aid officer</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                On major commercial and infrastructure projects, enterprise agreement site allowances can be <strong>significantly higher</strong> than the award amounts. All allowances are treated as ordinary income for tax purposes. Check the <Link href="/award-rates/">Award Rates Guide</Link> for more details on construction award provisions.
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
                A qualified carpenter earning <strong>$40/hr</strong> base rate who works 5 hours of overtime on a Saturday earns: 2 hours at $60/hr + 3 hours at $80/hr = <strong>$360</strong> for the Saturday shift alone. Regular Saturday work adds up quickly over a year. Use the <Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> to model your exact overtime earnings.
              </p>
            </section>

            {/* ── Section 5: Take-Home Pay Examples ── */}
            <section id="take-home-examples">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Take-Home Pay Examples</h2>
              <p>
                Below are take-home pay estimates for common construction and trades roles in FY{SITE_CONFIG.financialYear}, including typical allowances but excluding overtime (LITO and Medicare levy applied, no HECS):
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
                      {TRADE_TAKE_HOME.map((r) => {
                        const b = calculatePayBreakdown({ grossSalary: r.gross });
                        return (<tr key={r.role}><td className="px-5 py-3">{r.role}</td><td className="px-5 py-3 text-right">{formatAUD(r.gross)}</td><td className="px-5 py-3 text-right">{formatAUD(b.totalDeductions)}</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(b.takeHomePay)}</td></tr>);
                      })}
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
              <FaqAccordion faqs={CONSTRUCTION_TRADES_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Construction and trades salary data is compiled from ABS average weekly earnings for the construction industry, Fair Work Commission pay guides for the Building and Construction General On-site Award, and published enterprise agreement rates. Salary ranges represent total annual earnings including base rate and typical allowances, but excluding overtime. Tax calculations use ATO marginal rates for FY{SITE_CONFIG.financialYear} including the 2% Medicare levy.</p>
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

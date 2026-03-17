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
  { title: "ICT industry earnings", url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia", publisher: SOURCES.abs.name },
  { title: "Seek salary data", url: "https://www.seek.com.au/career-advice/role/software-developer/salary", publisher: "Seek" },
  { title: "Hays salary guide", url: "https://www.hays.com.au/salary-guide", publisher: "Hays" },
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
            Australia&apos;s tech sector offers some of the highest salaries in the economy, with senior developers and engineers earning $130,000–$200,000+. This guide covers average tech salaries by role, contractor vs permanent comparisons, city-by-city variations, and how to maximise your take-home pay through salary packaging and structure.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ── Section 1: Average Tech Salaries by Role ── */}
            <section id="tech-salaries">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Average Tech Salaries by Role</h2>
              <p>
                Tech salaries in Australia have grown steadily due to persistent talent shortages across software development, data engineering, cybersecurity, and cloud infrastructure. The table below shows typical salary ranges for permanent (full-time) positions in 2025, excluding equity compensation and bonuses.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Role</th>
                        <th className="px-5 py-3 text-right">Salary Range (Annual)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Junior Developer</td><td className="px-5 py-3 text-right font-medium">$65,000 – $80,000</td></tr>
                      <tr><td className="px-5 py-3">Mid-Level Developer</td><td className="px-5 py-3 text-right font-medium">$90,000 – $120,000</td></tr>
                      <tr><td className="px-5 py-3">Senior Developer</td><td className="px-5 py-3 text-right font-medium">$130,000 – $170,000</td></tr>
                      <tr><td className="px-5 py-3">Lead / Principal Engineer</td><td className="px-5 py-3 text-right font-medium">$160,000 – $200,000</td></tr>
                      <tr><td className="px-5 py-3">Data Engineer</td><td className="px-5 py-3 text-right font-medium">$110,000 – $150,000</td></tr>
                      <tr><td className="px-5 py-3">DevOps / SRE</td><td className="px-5 py-3 text-right font-medium">$120,000 – $160,000</td></tr>
                      <tr><td className="px-5 py-3">Product Manager</td><td className="px-5 py-3 text-right font-medium">$110,000 – $140,000</td></tr>
                      <tr><td className="px-5 py-3">Cybersecurity Analyst</td><td className="px-5 py-3 text-right font-medium">$100,000 – $150,000</td></tr>
                      <tr><td className="px-5 py-3">QA Engineer</td><td className="px-5 py-3 text-right font-medium">$80,000 – $110,000</td></tr>
                      <tr><td className="px-5 py-3">UX Designer</td><td className="px-5 py-3 text-right font-medium">$85,000 – $120,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                These ranges represent base salary only. Total compensation at larger tech companies may include equity (RSUs or stock options) worth <strong>$10,000–$80,000+</strong> per year, annual bonuses of <strong>10–20%</strong>, and additional benefits like learning budgets, home office allowances, and extra leave. Visit <Link href="/average-salary-australia/">Average Salary Australia</Link> for cross-industry comparisons.
              </p>
            </section>

            {/* ── Section 2: Contractor vs Permanent ── */}
            <section id="contractor-vs-permanent">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Contractor vs Permanent</h2>
              <p>
                A significant proportion of Australian tech workers operate as contractors, either through an ABN (sole trader) or a Pty Ltd company. Contractor day rates are typically <strong>30–50% higher</strong> than the equivalent permanent salary to compensate for the absence of paid leave, superannuation, and job security.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Day Rate vs Salary Comparison</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Role Level</th>
                        <th className="px-5 py-3 text-right">Permanent Salary</th>
                        <th className="px-5 py-3 text-right">Contractor Day Rate</th>
                        <th className="px-5 py-3 text-right">Contractor Annual (230 days)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Mid-Level</td><td className="px-5 py-3 text-right">$110,000</td><td className="px-5 py-3 text-right">$650–$800</td><td className="px-5 py-3 text-right font-medium">$149,500–$184,000</td></tr>
                      <tr><td className="px-5 py-3">Senior</td><td className="px-5 py-3 text-right">$150,000</td><td className="px-5 py-3 text-right">$900–$1,100</td><td className="px-5 py-3 text-right font-medium">$207,000–$253,000</td></tr>
                      <tr><td className="px-5 py-3">Lead / Principal</td><td className="px-5 py-3 text-right">$180,000</td><td className="px-5 py-3 text-right">$1,100–$1,400</td><td className="px-5 py-3 text-right font-medium">$253,000–$322,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>ABN vs Pty Ltd Considerations</h3>
              <p>
                Sole traders (ABN) are simpler to set up but pay tax at personal marginal rates on all income. Operating through a <strong>Pty Ltd company</strong> allows you to retain profits at the company tax rate of <strong>25%</strong> (for base rate entities) and distribute income strategically. However, Pty Ltd structures involve higher compliance costs ($2,000–$5,000/year in accounting fees) and are only worthwhile above a certain income level. Use the <Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Calculator</Link> and the <Link href="/employee-vs-sole-trader-vs-company/">Entity Structure Comparison</Link> to model the best structure for your situation.
              </p>
            </section>

            {/* ── Section 3: Tech Salary by City ── */}
            <section id="salary-by-city">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tech Salary by City</h2>
              <p>
                Location has a meaningful impact on tech salaries in Australia, though the growth of remote work has compressed some of the historical premium that Sydney commanded.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">City</th>
                        <th className="px-5 py-3 text-right">Relative to National Average</th>
                        <th className="px-5 py-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">Sydney</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">+10–15%</td><td className="px-5 py-3">Highest demand, highest cost of living</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Melbourne</td><td className="px-5 py-3 text-right">Baseline</td><td className="px-5 py-3">Strong startup and fintech ecosystem</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Brisbane</td><td className="px-5 py-3 text-right text-red-500">-5–10%</td><td className="px-5 py-3">Growing tech hub, lower living costs</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Perth</td><td className="px-5 py-3 text-right">Variable</td><td className="px-5 py-3">Mining-tech roles pay premium, general tech lower</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Remote</td><td className="px-5 py-3 text-right">Growing parity</td><td className="px-5 py-3">Many companies now pay location-agnostic salaries</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The salary gap between Sydney and other cities has narrowed since 2020, particularly for senior roles where companies compete nationally for talent. Some international tech companies (Google, Atlassian, Canva) pay globally-benchmarked salaries that exceed Australian market rates regardless of city.
              </p>
            </section>

            {/* ── Section 4: Salary Packaging & Perks ── */}
            <section id="salary-packaging">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Salary Packaging &amp; Perks</h2>
              <p>
                Tech companies in Australia offer various forms of compensation beyond base salary that can significantly increase total remuneration.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Stock Options &amp; RSUs</h3>
              <p>
                Large tech companies (Atlassian, Canva, Block, Google, Amazon) offer equity compensation in the form of Restricted Stock Units (RSUs) or Employee Stock Options (ESOs). RSUs are taxed as ordinary income when they vest, at your marginal tax rate. A senior developer at a major tech company might receive <strong>$30,000–$80,000</strong> per year in RSUs on top of their base salary. The tax treatment depends on whether the shares are in an Employee Share Scheme (ESS) and whether you have a deferred taxing point.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Salary Sacrifice for Super</h3>
              <p>
                Tech workers on high salaries can benefit from salary sacrificing additional super contributions. Pre-tax contributions are taxed at <strong>15%</strong> inside the super fund, compared to marginal rates of <strong>30–37%</strong> for a tech worker earning $130,000–$180,000. The concessional contribution cap is <strong>$30,000 per year</strong> (including employer SG). Use the <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model the tax savings for your salary level.
              </p>
            </section>

            {/* ── Section 5: Take-Home Pay on a Tech Salary ── */}
            <section id="take-home-pay">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Take-Home Pay on a Tech Salary</h2>
              <p>
                A senior developer earning <strong>$150,000</strong> per year pays approximately <strong>$38,717</strong> in income tax and Medicare levy for FY2025-26, leaving a take-home pay of approximately <strong>$111,283</strong> per year (<strong>$4,280 per fortnight</strong>). Superannuation at 12% adds <strong>$18,000</strong>, bringing the total package to <strong>$168,000</strong>.
              </p>
              <p>
                A mid-level developer earning <strong>$110,000</strong> takes home approximately <strong>$83,283</strong> per year (<strong>$3,203 per fortnight</strong>) after tax and Medicare. At this income level, salary sacrificing <strong>$10,000</strong> into super saves approximately <strong>$2,000</strong> in tax annually.
              </p>
              <div className="not-prose my-8">
                <Link href="/take-home-pay-calculator/" className="inline-flex items-center gap-2 px-6 py-3 bg-eucalyptus-dark text-white font-semibold rounded-lg hover:bg-navy transition-colors">
                  <Calculator className="h-5 w-5" />
                  Calculate Your Tech Take-Home Pay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* ── Section 6: FAQs ── */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="dev-salary" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much do software developers earn in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Junior developers earn $65K–$80K, mid-level developers $90K–$120K, senior developers $130K–$170K, and lead/principal engineers $160K–$200K. These are base salaries — total compensation at larger companies includes equity (RSUs), bonuses, and benefits that can add $10K–$80K+ per year.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="contractor-rate" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What day rate equals a $150K permanent salary?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">To match a $150K permanent salary (including 4 weeks leave, 10 sick days, super, and other benefits), you need a contractor day rate of approximately $900–$1,000 per day. This accounts for the ~230 billable days per year, self-funded super, insurance, and no paid leave. Use the Contractor vs Employee Calculator for an exact comparison.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="rsus" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How are RSUs taxed in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">RSUs are taxed as ordinary income at your marginal tax rate when they vest. The taxable amount is the market value of the shares at the vesting date. If you sell immediately, there is no further capital gains tax. If you hold the shares after vesting and they increase in value, you pay CGT on the gain when you sell, with the 50% CGT discount available if held for more than 12 months.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="abn-vs-pty" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Should I contract through ABN or Pty Ltd?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">For contractors earning under $120K–$130K, an ABN (sole trader) is usually simpler and cheaper. Above that level, a Pty Ltd company allows you to retain profits at the 25% company tax rate and distribute income more strategically. However, Pty Ltd involves $2,000–$5,000/year in accounting costs. The break-even point depends on your specific circumstances — use the entity structure comparison tool on this site.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="cyber-pay" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much do cybersecurity professionals earn?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Cybersecurity analysts earn $100K–$150K, security engineers $120K–$170K, and CISOs/security directors $180K–$280K. The sector has acute talent shortages, driving salaries higher than equivalent seniority levels in general software development. Government and defence sector cybersecurity roles may also include security clearance bonuses.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="remote-pay" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do remote tech workers earn less?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Increasingly no. Many Australian tech companies now pay location-agnostic salaries, meaning a developer in Brisbane or regional Australia earns the same as one in Sydney. Some companies still apply city-based pay bands, but the trend is towards parity. International remote roles may offer different rates depending on the company&apos;s compensation philosophy.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Tech salary data is compiled from ABS ICT industry earnings, major job board salary data (Seek, LinkedIn), recruiter salary guides (Hays, Robert Half, Michael Page), and published company compensation data. Salary ranges represent the middle 50% of the market for each role. Contractor day rates assume 230 billable days per year. Tax calculations use ATO marginal rates for FY2025-26.</p>
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

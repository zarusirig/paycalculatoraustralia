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
  { title: "Average Weekly Earnings, Australia", url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia", publisher: SOURCES.abs.name },
  { title: "Employee Earnings and Hours", url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/employee-earnings-and-hours-australia", publisher: SOURCES.abs.name },
  { title: "Labour Force, Australia", url: "https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia", publisher: SOURCES.abs.name },
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
];

export default function AverageSalaryAustraliaPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Average Salary Australia</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Average Salary in Australia — By Industry, State &amp; Experience Level
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            How does your salary compare? We break down average and median salaries across industries, states, and experience levels using the latest ABS data, so you can see where you stand and what your take-home pay looks like.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: Overview */}
            <section id="overview">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>National Average Salary Overview</h2>
              <p>
                The average full-time ordinary earnings in Australia are approximately <strong>$98,000 per year</strong> (before tax) as of the latest ABS data. However, the <strong>median salary</strong> &mdash; the midpoint where half of workers earn more and half earn less &mdash; is around <strong>$72,000</strong>.
              </p>
              <p>
                The gap between the mean ($98K) and median ($72K) exists because high earners in mining, finance, and technology pull the average upward. The median is a better indicator of what a &ldquo;typical&rdquo; Australian worker earns.
              </p>
              <p>
                These figures cover full-time adult ordinary time earnings and exclude overtime, bonuses, and casual loadings. Part-time and casual workers earn proportionally less based on hours worked.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>See Where You Rank</strong>
                  <br />
                  Enter your salary into our <Link href="/" className="text-eucalyptus-dark underline hover:text-navy">Pay Calculator</Link> to see your exact take-home pay, or use the <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark underline hover:text-navy">Take-Home Pay Calculator</Link> for a detailed breakdown including tax, super, and Medicare.
                </p>
              </div>
            </section>

            {/* SECTION 2: By Industry */}
            <section id="by-industry">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Average Salary by Industry</h2>
              <p>
                Industry is the single biggest determinant of salary in Australia. Mining pays more than double the hospitality sector. The table below shows average full-time salaries by industry, sourced from the ABS Employee Earnings and Hours survey.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Industry</th>
                        <th className="px-6 py-4">Average Salary</th>
                        <th className="px-6 py-4">Est. Take-Home</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-4 font-medium">Mining</td><td className="px-6 py-4">$130,000</td><td className="px-6 py-4">$97,183</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Information Technology</td><td className="px-6 py-4">$110,000</td><td className="px-6 py-4">$84,883</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Financial Services</td><td className="px-6 py-4">$105,000</td><td className="px-6 py-4">$81,783</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Construction</td><td className="px-6 py-4">$95,000</td><td className="px-6 py-4">$75,583</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Healthcare</td><td className="px-6 py-4">$90,000</td><td className="px-6 py-4">$72,483</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Education &amp; Training</td><td className="px-6 py-4">$85,000</td><td className="px-6 py-4">$69,383</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Manufacturing</td><td className="px-6 py-4">$80,000</td><td className="px-6 py-4">$64,283</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Transport &amp; Logistics</td><td className="px-6 py-4">$78,000</td><td className="px-6 py-4">$63,043</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Agriculture</td><td className="px-6 py-4">$60,000</td><td className="px-6 py-4">$50,483</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Administrative Services</td><td className="px-6 py-4">$65,000</td><td className="px-6 py-4">$53,583</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Retail Trade</td><td className="px-6 py-4">$58,000</td><td className="px-6 py-4">$49,243</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Hospitality</td><td className="px-6 py-4">$55,000</td><td className="px-6 py-4">$47,383</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Take-home estimates assume resident, no HECS, no PHI, and include tax + Medicare levy. Use our calculator for exact figures.</p>
              </div>
              <p>
                Mining&apos;s dominance reflects the remote location premiums, FIFO allowances, and the capital-intensive nature of the sector. The IT sector has seen strong salary growth driven by the global tech skills shortage. For detailed industry breakdowns, see our guides on <Link href="/mining-fifo-pay-guide/">Mining &amp; FIFO Pay</Link>, <Link href="/tech-salary-guide-australia/">Tech Salaries</Link>, <Link href="/healthcare-worker-pay/">Healthcare Worker Pay</Link>, and <Link href="/retail-hospitality-pay-guide/">Retail &amp; Hospitality Pay</Link>.
              </p>
            </section>

            {/* SECTION 3: By State */}
            <section id="by-state">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Average Salary by State &amp; Territory</h2>
              <p>
                Location significantly impacts salary, with Western Australia leading due to its mining-driven economy and the ACT reflecting its concentration of public service and policy roles.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">State / Territory</th>
                        <th className="px-6 py-4">Average Salary</th>
                        <th className="px-6 py-4">Key Industries</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-4 font-medium">Western Australia</td><td className="px-6 py-4">$110,000</td><td className="px-6 py-4">Mining, Oil &amp; Gas, Construction</td></tr>
                      <tr><td className="px-6 py-4 font-medium">New South Wales</td><td className="px-6 py-4">$102,000</td><td className="px-6 py-4">Finance, Tech, Professional Services</td></tr>
                      <tr><td className="px-6 py-4 font-medium">ACT</td><td className="px-6 py-4">$100,000</td><td className="px-6 py-4">Public Service, Defence, Education</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Victoria</td><td className="px-6 py-4">$95,000</td><td className="px-6 py-4">Finance, Healthcare, Manufacturing</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Northern Territory</td><td className="px-6 py-4">$95,000</td><td className="px-6 py-4">Mining, Government, Defence</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Queensland</td><td className="px-6 py-4">$90,000</td><td className="px-6 py-4">Mining, Tourism, Agriculture</td></tr>
                      <tr><td className="px-6 py-4 font-medium">South Australia</td><td className="px-6 py-4">$85,000</td><td className="px-6 py-4">Defence, Manufacturing, Healthcare</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Tasmania</td><td className="px-6 py-4">$80,000</td><td className="px-6 py-4">Healthcare, Tourism, Agriculture</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                For state-specific pay calculations including any regional considerations, use our state calculators: <Link href="/pay-calculator-nsw/">NSW</Link>, <Link href="/pay-calculator-vic/">VIC</Link>, <Link href="/pay-calculator-qld/">QLD</Link>, <Link href="/pay-calculator-wa/">WA</Link>, <Link href="/pay-calculator-sa/">SA</Link>, <Link href="/pay-calculator-tas/">TAS</Link>, <Link href="/pay-calculator-act/">ACT</Link>, or <Link href="/pay-calculator-nt/">NT</Link>.
              </p>
            </section>

            {/* SECTION 4: By Experience */}
            <section id="by-experience">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Average Salary by Experience Level</h2>
              <p>
                Experience and seniority are the second largest salary drivers after industry. The table below shows typical salary ranges across career stages.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Experience Level</th>
                        <th className="px-6 py-4">Typical Range</th>
                        <th className="px-6 py-4">Midpoint</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-4 font-medium">Graduate (0&ndash;2 years)</td><td className="px-6 py-4">$55,000 &ndash; $65,000</td><td className="px-6 py-4">$60,000</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Early Career (2&ndash;5 years)</td><td className="px-6 py-4">$65,000 &ndash; $85,000</td><td className="px-6 py-4">$75,000</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Mid-Career (5&ndash;10 years)</td><td className="px-6 py-4">$80,000 &ndash; $100,000</td><td className="px-6 py-4">$90,000</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Senior (10&ndash;15 years)</td><td className="px-6 py-4">$110,000 &ndash; $140,000</td><td className="px-6 py-4">$125,000</td></tr>
                      <tr><td className="px-6 py-4 font-medium">Executive (15+ years)</td><td className="px-6 py-4">$150,000 &ndash; $250,000+</td><td className="px-6 py-4">$180,000</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Ranges are indicative and vary significantly by industry. Mining graduates may start at $75K+, while hospitality managers with 15 years may earn $70K.</p>
              </div>
              <p>
                For those starting their career, our <Link href="/first-job-pay-guide/">First Job Pay Guide</Link> covers what to expect from your first payslip. If you are negotiating a salary increase, see how a raise impacts your take-home with the <Link href="/pay-rise-calculator/">Pay Rise Calculator</Link>.
              </p>
            </section>

            {/* SECTION 5: Salary Trends */}
            <section id="salary-trends">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Salary Trends in Australia</h2>
              <p>
                Australian wages have grown moderately over recent years, with the Wage Price Index (WPI) tracking at approximately <strong>3.5&ndash;4.0%</strong> annually. However, real wage growth (adjusted for inflation) has been more subdued, with CPI at times outpacing wage increases.
              </p>
              <p>
                Key trends affecting salaries in 2025-26 include:
              </p>
              <ul>
                <li><strong>Skills shortages</strong> &mdash; Healthcare, IT, engineering, and trades continue to see above-average wage growth due to persistent worker shortages.</li>
                <li><strong>Remote work premium erosion</strong> &mdash; Salaries for remote-eligible roles are normalising as employers adjust to hybrid models.</li>
                <li><strong>Minimum wage increases</strong> &mdash; FWC annual reviews have delivered above-inflation minimum wage rises in recent years, compressing the gap with median wages.</li>
                <li><strong>Public sector catch-up</strong> &mdash; Government wages are rising as enterprise agreements are renegotiated after years of wage caps.</li>
              </ul>
              <p>
                The gender pay gap in Australia remains at approximately <strong>21.7%</strong> in total remuneration terms according to the Workplace Gender Equality Agency, though this varies significantly by industry. Mining has one of the largest gaps, while healthcare and education have narrower differences.
              </p>
            </section>

            {/* SECTION 6: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="avg-vs-median" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the difference between average and median salary?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The <strong>average</strong> (mean) salary adds up all salaries and divides by the number of workers. The <strong>median</strong> is the middle value when all salaries are ranked. In Australia, the average ($98K) is higher than the median ($72K) because very high earners pull the mean upward. The median better represents what a typical full-time worker earns.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="good-salary" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is considered a good salary in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">A salary above the median of $72,000 puts you in the top half of full-time earners. Earning above $100,000 places you well above average. However, &ldquo;good&rdquo; depends on your location (Sydney and Melbourne have higher costs of living), family situation, and career stage. A $75K salary in Adelaide may provide more disposable income than $100K in Sydney.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="salary-super" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do these salary figures include superannuation?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">No. The figures quoted are <strong>base salary before super</strong>. Your employer pays an additional 12% superannuation on top of these amounts. A $100,000 salary means your total remuneration package is $112,000. Some job ads quote &ldquo;total package including super&rdquo; &mdash; always clarify whether super is included when comparing offers.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="take-home" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much take-home pay do I get from a $100K salary?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">On a $100,000 salary (resident, no HECS, no private health insurance), your estimated annual take-home pay is approximately <strong>$78,083</strong> after income tax ($22,967) and Medicare levy ($2,000), excluding superannuation. Use our <Link href="/take-home-pay-calculator/" className="text-eucalyptus-dark underline">Take-Home Pay Calculator</Link> for your exact breakdown.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="highest-industry" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the highest paying industry in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray"><strong>Mining</strong> is the highest paying industry with an average salary of approximately $130,000. This includes FIFO (fly-in, fly-out) roles that offer location premiums, shift allowances, and overtime. IT and Financial Services follow at $110,000 and $105,000 respectively.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="highest-state" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Which state pays the highest salaries?</AccordionTrigger>
                  <AccordionContent className="text-warmgray"><strong>Western Australia</strong> has the highest average salary at approximately $110,000, driven by the mining and resources sector. New South Wales follows at $102,000, reflecting Sydney&apos;s concentration of financial services and professional services firms. The ACT sits at $100,000 due to its high proportion of public service roles.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="Data sources and methodology">
                <p>Salary data is sourced from the Australian Bureau of Statistics (ABS) Average Weekly Earnings survey and Employee Earnings and Hours survey. Figures represent full-time adult ordinary time earnings. Take-home pay estimates use FY2025-26 resident tax brackets, 2% Medicare levy, and LITO. Individual results vary based on deductions, HECS-HELP debt, salary sacrifice, and other factors. Use our calculators for personalised figures.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("average-salary-australia"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Industry Pay Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/mining-fifo-pay-guide/" label="Mining & FIFO Pay" />
                    <SidebarLink href="/tech-salary-guide-australia/" label="Tech Salaries" />
                    <SidebarLink href="/healthcare-worker-pay/" label="Healthcare Worker Pay" />
                    <SidebarLink href="/teacher-pay-australia/" label="Teacher Pay" />
                    <SidebarLink href="/construction-trades-pay/" label="Construction & Trades" />
                    <SidebarLink href="/retail-hospitality-pay-guide/" label="Retail & Hospitality" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/" label="Pay Calculator" />
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/pay-rise-calculator/" label="Pay Rise Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Calculate your take-home pay</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Enter your salary to see your exact take-home pay after tax, super, and Medicare.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Take-Home Pay Calculator <ArrowRight className="inline h-4 w-4 ml-1" />
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

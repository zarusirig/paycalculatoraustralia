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
  { title: "Annual Wage Reviews", url: "https://www.fwc.gov.au/agreements-awards/minimum-wages-conditions/annual-wage-reviews", publisher: SOURCES.fwo.name },
  { title: "National minimum wage orders", url: "https://www.fwc.gov.au/agreements-awards/minimum-wages-conditions/national-minimum-wage-orders", publisher: "Fair Work Commission" },
  { title: "Consumer Price Index, Australia", url: "https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/consumer-price-index-australia", publisher: "Australian Bureau of Statistics" },
];

const WAGE_HISTORY = [
  { year: "2010-11", hourly: "$15.00", weekly: "$569.90", increase: "\u2014", fwcDate: "1 Jul 2010" },
  { year: "2011-12", hourly: "$15.51", weekly: "$589.30", increase: "3.4%", fwcDate: "1 Jul 2011" },
  { year: "2012-13", hourly: "$15.96", weekly: "$606.40", increase: "2.9%", fwcDate: "1 Jul 2012" },
  { year: "2013-14", hourly: "$16.37", weekly: "$622.20", increase: "2.6%", fwcDate: "1 Jul 2013" },
  { year: "2014-15", hourly: "$16.87", weekly: "$640.90", increase: "3.0%", fwcDate: "1 Jul 2014" },
  { year: "2015-16", hourly: "$17.29", weekly: "$656.90", increase: "2.5%", fwcDate: "1 Jul 2015" },
  { year: "2016-17", hourly: "$17.70", weekly: "$672.70", increase: "2.4%", fwcDate: "1 Jul 2016" },
  { year: "2017-18", hourly: "$18.29", weekly: "$694.90", increase: "3.3%", fwcDate: "1 Jul 2017" },
  { year: "2018-19", hourly: "$18.93", weekly: "$719.20", increase: "3.5%", fwcDate: "1 Jul 2018" },
  { year: "2019-20", hourly: "$19.49", weekly: "$740.80", increase: "3.0%", fwcDate: "1 Jul 2019" },
  { year: "2020-21", hourly: "$19.84", weekly: "$753.80", increase: "1.75%", fwcDate: "1 Jul 2020" },
  { year: "2021-22", hourly: "$20.33", weekly: "$772.60", increase: "2.5%", fwcDate: "1 Jul 2021" },
  { year: "2022-23", hourly: "$21.38", weekly: "$812.60", increase: "5.2%", fwcDate: "1 Jul 2022" },
  { year: "2023-24", hourly: "$23.23", weekly: "$882.80", increase: "8.65%", fwcDate: "1 Jul 2023" },
  { year: "2024-25", hourly: "$24.10", weekly: "$915.90", increase: "3.75%", fwcDate: "1 Jul 2024" },
  { year: "2025-26", hourly: "TBD", weekly: "TBD", increase: "TBD", fwcDate: "Jun 2025 (expected)" },
];

export default function MinimumWageHistoryPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Minimum Wage History</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Minimum Wage History Australia &mdash; Annual Rate Changes
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Every year the Fair Work Commission reviews and adjusts Australia&apos;s national minimum wage. This page tracks every rate since 2010, how increases compare to inflation, and how the FWC makes its annual decision.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: Minimum Wage by Year */}
            <section id="wage-by-year">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Minimum Wage by Year</h2>
              <p>
                The national minimum wage applies to award-free and agreement-free employees over 21 years of age. Junior employees, apprentices, and those covered by Modern Awards may receive different rates. The table below shows the hourly and weekly rate for each financial year since 2010.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-x-auto overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-4 py-4">Year</th>
                        <th className="px-4 py-4 border-l text-right">Hourly</th>
                        <th className="px-4 py-4 border-l text-right">Weekly (38 hrs)</th>
                        <th className="px-4 py-4 border-l text-right">Increase</th>
                        <th className="px-4 py-4 border-l text-right">Effective Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {WAGE_HISTORY.map((row, i) => (
                        <tr key={row.year} className={i === WAGE_HISTORY.length - 2 ? "bg-eucalyptus/5" : ""}>
                          <td className="px-4 py-3 font-semibold text-navy bg-sandstone">{row.year}</td>
                          <td className="px-4 py-3 border-l text-right">{row.hourly}</td>
                          <td className="px-4 py-3 border-l text-right">{row.weekly}</td>
                          <td className="px-4 py-3 border-l text-right">{row.increase}</td>
                          <td className="px-4 py-3 border-l text-right">{row.fwcDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Weekly rate based on 38 ordinary hours. Source: Fair Work Commission National Minimum Wage Orders. FY2025-26 rate will be announced in the FWC Annual Wage Review (expected June 2025).</p>
              </div>
            </section>

            {/* SECTION 2: Minimum Wage vs Inflation */}
            <section id="wage-vs-inflation">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Minimum Wage vs Inflation</h2>
              <p>
                In most years, the FWC has increased the minimum wage at or above the rate of CPI inflation, preserving real purchasing power for minimum wage workers. However, there are notable exceptions:
              </p>
              <ul>
                <li><strong>FY2020-21 (1.75% increase):</strong> The smallest increase in over a decade, reflecting the economic uncertainty of COVID-19. Annual CPI at the time was running at approximately 1.1%, so the real increase was modest but positive.</li>
                <li><strong>FY2022-23 (5.2% increase):</strong> A significant jump as the FWC responded to rising cost-of-living pressures. Annual CPI was running at 6.1%, meaning the real wage fell slightly despite the large nominal increase.</li>
                <li><strong>FY2023-24 (8.65% increase):</strong> The largest increase in the dataset. The FWC explicitly aimed to restore real wages after the inflation shock, citing CPI of 7.0% at the time of the decision. This was the first time the increase significantly exceeded CPI since 2010.</li>
                <li><strong>FY2024-25 (3.75% increase):</strong> A return to more moderate increases as inflation eased to approximately 3.6%. The real wage gain was modest at roughly 0.1&ndash;0.2 percentage points.</li>
              </ul>
              <p>
                Over the full 15-year period from 2010 to 2024, the minimum wage rose from <strong>$15.00 to $24.10 per hour</strong> &mdash; an increase of <strong>60.7%</strong>. Over the same period, cumulative CPI inflation was approximately <strong>40&ndash;45%</strong>, meaning minimum wage workers have maintained and slightly improved their real purchasing power.
              </p>
            </section>

            {/* SECTION 3: How FWC Sets Minimum Wage */}
            <section id="fwc-process">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How the Fair Work Commission Sets the Minimum Wage</h2>
              <p>
                The FWC conducts an Annual Wage Review every year, as required by the <em>Fair Work Act 2009</em>. The review process runs from approximately January to June, with the new rate taking effect on <strong>1 July</strong>. Key features of the process:
              </p>
              <ol>
                <li><strong>Submissions:</strong> The Australian Government, employer groups (e.g., Ai Group, ACCI), unions (ACTU), and community organisations submit evidence and arguments for or against a particular increase.</li>
                <li><strong>Economic analysis:</strong> The FWC considers CPI, Wage Price Index (WPI), labour market data (unemployment, underemployment), business profitability, and productivity trends.</li>
                <li><strong>Legislative criteria:</strong> The Fair Work Act requires the FWC to consider the needs of low-paid workers, the principle of equal remuneration, economic conditions, and competitiveness of the national economy.</li>
                <li><strong>Decision:</strong> A Full Bench of the FWC publishes a detailed decision (typically 100&ndash;200 pages) explaining the reasoning behind the chosen increase. The decision applies to both the national minimum wage and all Modern Award minimum rates.</li>
              </ol>
              <p>
                The FWC cannot reduce the minimum wage &mdash; it can only maintain or increase it. In practice, even during the 2020 COVID recession, the Commission awarded a small increase rather than a freeze.
              </p>
            </section>

            {/* SECTION 4: Minimum Wage Take-Home Pay */}
            <section id="take-home-pay">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Minimum Wage Take-Home Pay</h2>
              <p>
                At the current minimum wage of <strong>$24.10/hour</strong> (38 hours per week), the gross annual salary is approximately <strong>$47,628</strong>. After income tax, Medicare Levy, and the Low Income Tax Offset, the approximate take-home pay for a resident with no HECS debt is around <strong>$40,300 per year</strong> or <strong>$775 per week</strong>.
              </p>
              <p>
                Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to get the exact figure for your circumstances, including any HECS-HELP debt, private health insurance, or salary sacrifice arrangements.
              </p>
              <p>
                Want to convert between hourly and annual salary? The <Link href="/hourly-to-annual-salary-calculator/">Hourly to Annual Salary Calculator</Link> handles the conversion instantly.
              </p>
            </section>

            {/* SECTION 5: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="current-rate" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the current minimum wage in Australia?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    As of 1 July 2024, the national minimum wage is <strong>$24.10 per hour</strong> or <strong>$915.90 per 38-hour week</strong> (before tax). The FY2025-26 rate will be announced by the Fair Work Commission in its Annual Wage Review, expected in June 2025.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="how-often" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How often does the minimum wage increase?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The Fair Work Commission reviews the minimum wage annually. The review typically runs from January to June, with the decision announced in June and the new rate taking effect on 1 July. Every year since the FWC was established, the minimum wage has been increased.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="largest-increase" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What was the largest minimum wage increase?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The largest recent increase was <strong>8.65%</strong> in FY2023-24, raising the hourly rate from $21.38 to $23.23. The FWC cited high inflation and the need to restore real wages as the primary reasons for this historically large increase.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="vs-inflation" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does the minimum wage keep up with inflation?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Over the long term, yes. From 2010 to 2024, the minimum wage increased by approximately 60.7% while cumulative CPI inflation was around 40&ndash;45%. In individual years, the wage increase occasionally falls slightly below CPI (as in FY2022-23), but the FWC generally aims to at least maintain real purchasing power.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Minimum wage rates on this page are sourced from the Fair Work Commission&apos;s National Minimum Wage Orders. Weekly rates are based on 38 ordinary hours. CPI comparisons use ABS Consumer Price Index data. Annual salary estimates assume 52.143 weeks per year.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("minimum-wage-history-australia"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/award-rates/" label="Modern Award Rates" />
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/hourly-to-annual-salary-calculator/" label="Hourly to Annual Converter" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">What Do You Actually Take Home?</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Enter your hourly rate or salary to see your exact take-home pay after tax, super, and any deductions.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
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

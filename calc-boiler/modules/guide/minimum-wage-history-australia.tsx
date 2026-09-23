import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { NMW_ORDER } from "@/lib/constants/junior-rates";
import { NMW_DECISION, NMW_HISTORY } from "@/lib/constants/minimum-wage";
import {
  HISTORY_FAQS,
  HISTORY_FIRST,
  HISTORY_LARGEST,
  HISTORY_LAST,
  HISTORY_SMALLEST,
  TOTAL_GROWTH,
} from "@/modules/guide/minimum-wage-history-faqs";

// Rebuilt 23 Sep 2026 on NMW_HISTORY (lib/constants/minimum-wage.ts). The old
// hand-typed table showed $26.44 from 1 July 2024 and 2025-26 as "TBD".

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const money = (v: number) => formatAUD(v, 2);

const SOURCES_LIST: SourceLink[] = [
  { title: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`, url: NMW_ORDER.url, publisher: SOURCES.fwc.name },
  { title: "National minimum wage orders and Annual Wage Reviews", url: "https://www.fwc.gov.au/agreements-awards/minimum-wages-conditions", publisher: SOURCES.fwc.name },
  { title: "Minimum wages", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages", publisher: SOURCES.fwo.name },
  { title: "Consumer Price Index, Australia", url: "https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/consumer-price-index-australia", publisher: "Australian Bureau of Statistics" },
];

const ROWS = [...NMW_HISTORY].reverse();

export default function MinimumWageHistoryPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/minimum-wage-australia/" className="hover:text-eucalyptus-dark hover:underline">Minimum Wage Australia</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">History</span></li>
          </ol>
        </nav>

        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={H2}>
            Australian Minimum Wage History: Every Increase Since 2010
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            The National Minimum Wage for each financial year since {HISTORY_FIRST.fy}, the size of every Annual Wage Review increase, and what drove the big years.
          </p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>In short:</strong> the adult minimum wage has risen from {money(HISTORY_FIRST.hourly)} an hour in {HISTORY_FIRST.fy.slice(0, 4)} to {money(HISTORY_LAST.hourly)} from {HISTORY_LAST.operativeFrom}, up {(TOTAL_GROWTH * 100).toFixed(1)}%. The biggest single rise was {HISTORY_LARGEST.published} in {HISTORY_LARGEST.operativeFrom.slice(-4)}. For today&rsquo;s rate in full, with after-tax pay, see <Link href="/minimum-wage-australia/" className="font-medium text-eucalyptus-dark underline">minimum wage Australia</Link>.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="wage-by-year">
              <h2 style={H2}>National Minimum Wage by Year</h2>
              <p>
                The National Minimum Wage is the floor for adults aged 21 and over who are not covered by an award or agreement. Each rate below applied from the first full pay period on or after 1 July of that year.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[32rem] text-sm text-left text-navy">
                    <caption className="sr-only">Australian National Minimum Wage history since 2010</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-4 py-4">Financial year</th>
                        <th scope="col" className="px-4 py-4 border-l text-right">Hourly</th>
                        <th scope="col" className="px-4 py-4 border-l text-right">Weekly (38 hrs)</th>
                        <th scope="col" className="px-4 py-4 border-l text-right">Increase</th>
                        <th scope="col" className="px-4 py-4 border-l text-right">From</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {ROWS.map((row, i) => (
                        <tr key={row.fy} className={i === 0 ? "bg-eucalyptus/5 font-medium" : ""}>
                          <th scope="row" className="px-4 py-3 font-semibold text-navy bg-sandstone text-left">{row.fy}</th>
                          <td className="px-4 py-3 border-l text-right">{money(row.hourly)}</td>
                          <td className="px-4 py-3 border-l text-right">{money(row.weekly)}</td>
                          <td className="px-4 py-3 border-l text-right">{row.published ?? "—"}</td>
                          <td className="px-4 py-3 border-l text-right">{row.operativeFrom}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">
                  Weekly rate for 38 ordinary hours. Increases are as announced by the Commission, on the weekly rate. Source: Fair Work Commission National Minimum Wage Orders; the {HISTORY_LAST.fy} rate is from {NMW_DECISION.citation}.
                </p>
              </div>
            </section>

            <section id="notable-years">
              <h2 style={H2}>The Years That Stand Out</h2>
              <ul>
                <li><strong>{HISTORY_SMALLEST.fy} ({HISTORY_SMALLEST.published}):</strong> the smallest increase in the series, decided during the COVID-19 downturn.</li>
                <li><strong>{HISTORY_LARGEST.fy} ({HISTORY_LARGEST.published}):</strong> the largest, as the Commission responded to inflation of 7.0% in the year to the March quarter 2023.</li>
                <li><strong>{HISTORY_LAST.fy} ({HISTORY_LAST.published}):</strong> the National Minimum Wage rose faster than award rates ({(NMW_DECISION.awardIncrease * 100).toFixed(2)}%) because the Commission began lifting the lowest award classification, which the minimum wage is aligned to, in the first of three stages. It used the Reserve Bank&rsquo;s forecast of 4.8% inflation for the year to June 2026 as its benchmark.</li>
              </ul>
              <p>
                Whether the minimum wage kept pace with prices in a given year depends on which inflation figure you compare against and when. For the official series, see the ABS <a href="https://www.abs.gov.au/statistics/economy/price-indexes-and-inflation/consumer-price-index-australia" target="_blank" rel="noopener noreferrer">Consumer Price Index</a>.
              </p>
            </section>

            <section id="fwc-process">
              <h2 style={H2}>How the Fair Work Commission Sets the Minimum Wage</h2>
              <p>
                The Commission conducts an Annual Wage Review every year under the <em>Fair Work Act 2009</em>, with the result applying from 1 July. Key features of the process:
              </p>
              <ol>
                <li><strong>Submissions:</strong> the Australian Government, employer groups, unions and community organisations file evidence and argue for a particular increase.</li>
                <li><strong>Economic evidence:</strong> the Commission considers inflation, wages growth, employment, business conditions and productivity, drawing on its own statistical report.</li>
                <li><strong>Legislative criteria:</strong> the Act requires it to weigh the needs of the low paid, equal remuneration, the performance of the economy and relative living standards.</li>
                <li><strong>Decision:</strong> an expert panel publishes a reasoned decision setting both the National Minimum Wage and the increase to modern award rates.</li>
              </ol>
            </section>

            <section id="current">
              <h2 style={H2}>The Minimum Wage Now</h2>
              <p>
                The current rate is {money(HISTORY_LAST.hourly)} an hour or {money(HISTORY_LAST.weekly)} a week. The <Link href="/minimum-wage-australia/">minimum wage Australia</Link> page has it hourly, weekly, fortnightly and annually, after tax, with award comparisons and the date of the next review. Under-21s are paid a percentage of it; see <Link href="/junior-pay-rates/">minimum wage by age</Link>.
              </p>
            </section>

            <section id="faq">
              <h2 style={H2}>Frequently Asked Questions</h2>
              {HISTORY_FAQS.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this history was compiled">
                <p>Rates are taken from the Fair Work Commission&apos;s National Minimum Wage Orders, for 38 ordinary hours a week. The table is generated from a single tested constant; an automated test checks that each hourly rate is the weekly rate divided by 38 and that each computed increase agrees with the Commission&rsquo;s announced percentage.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {(() => { const a = getGuideAuthorship("minimum-wage-history-australia"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h2 className="font-bold text-navy mb-3 block">Related Guides</h2>
                  <div className="space-y-3">
                    <SidebarLink href="/minimum-wage-australia/" label="Minimum Wage Australia" />
                    <SidebarLink href="/junior-pay-rates/" label="Minimum Wage by Age" />
                    <SidebarLink href="/award-rates/" label="Modern Award Rates" />
                    <SidebarLink href="/hourly-to-annual-salary-calculator/" label="Hourly to Annual Converter" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold mb-2">What Do You Actually Take Home?</h2>
                  <p className="text-eucalyptus-light text-sm mb-4">Enter your hourly rate or salary to see your take-home pay after tax for {SITE_CONFIG.financialYear}.</p>
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

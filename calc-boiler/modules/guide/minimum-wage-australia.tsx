import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, SOURCES, EMPLOYMENT, formatAUD } from "@/lib/constants";
import { ADULT_AGE, JUNIOR_RATES, NMW_ORDER } from "@/lib/constants/junior-rates";
import { HOSPITALITY_RATES, RETAIL_RATES } from "@/lib/constants/hospitality-award";
import { FAST_FOOD_LEVEL_1, NMW, NMW_DECISION, NMW_HISTORY, WA_STATE_MINIMUM_WAGE } from "@/lib/constants/minimum-wage";
import {
  MW_FAQS,
  NMW_AFTER_TAX,
  NMW_PERIODS,
  currentRow,
} from "@/modules/guide/minimum-wage-australia-data";

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const money = (v: number) => formatAUD(v, 2);

const SOURCES_LIST: SourceLink[] = [
  { title: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`, url: NMW_ORDER.url, publisher: SOURCES.fwc.name },
  { title: "Annual Wage Review 2026", url: "https://www.fairwork.gov.au/about-us/workplace-laws/annual-wage-review/annual-wage-review-2026", publisher: SOURCES.fwo.name },
  { title: "Minimum wages", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages", publisher: SOURCES.fwo.name },
  { title: "Award and agreement free wages and conditions", url: "https://www.fairwork.gov.au/employment-conditions/awards/award-and-agreement-free-wages-and-conditions", publisher: SOURCES.fwo.name },
  { title: "WA award and minimum rates of pay to increase from 1 July 2026", url: WA_STATE_MINIMUM_WAGE.url, publisher: "Government of Western Australia" },
];

const HOSP_INTRO = HOSPITALITY_RATES.find((r) => r.level === "Introductory")!;
const HOSP_L1 = HOSPITALITY_RATES.find((r) => r.level === "Level 1")!;
const RETAIL_L1 = RETAIL_RATES.find((r) => r.level === "Level 1")!;
const AWARD_COMPARISON = [
  { label: "National Minimum Wage (no award)", href: null, hourly: NMW.hourly, weekly: NMW.weekly },
  { label: "Hospitality award: Introductory level", href: "/hospitality-award-rates/", hourly: HOSP_INTRO.hourly, weekly: HOSP_INTRO.weekly },
  { label: "Hospitality award: Level 1", href: "/hospitality-award-rates/", hourly: HOSP_L1.hourly, weekly: HOSP_L1.weekly },
  { label: "Retail award: Level 1", href: "/retail-award-rates/", hourly: RETAIL_L1.hourly, weekly: RETAIL_L1.weekly },
  { label: "Fast food award: Level 1", href: null, hourly: FAST_FOOD_LEVEL_1.hourly, weekly: FAST_FOOD_LEVEL_1.weekly },
];

const RECENT_HISTORY = NMW_HISTORY.slice(-6).reverse();

export default function MinimumWageAustraliaPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/award-rates/" className="hover:text-eucalyptus-dark hover:underline">Award Rates</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Minimum Wage Australia</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={H2}>
            Minimum Wage in Australia {currentRow.fy}
          </h1>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> The National Minimum Wage is <strong>{money(NMW.hourly)} an hour</strong>, or <strong>{money(NMW.weekly)} a week</strong> for {EMPLOYMENT.standardWeeklyHours} hours, from {NMW_DECISION.operativeFrom}. That is <strong>{money(NMW.annual)} a year</strong> full time, about <strong>{formatAUD(NMW_AFTER_TAX.annual)} after tax</strong>. Casuals get at least <strong>{money(NMW.casualHourly)}</strong> an hour. It is the same in every state and territory, and it rose {currentRow.published} from {money(NMW.previousHourly)}.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="current-rate">
              <h2 style={H2}>Current Minimum Wage: Hourly, Weekly and Annual</h2>
              <p>
                The Fair Work Commission set these rates in the {NMW_DECISION.name} ({NMW_DECISION.citation}, {NMW_DECISION.decidedOn}). {NMW_DECISION.operativeNote}
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[30rem] text-left text-sm text-navy">
                    <caption className="sr-only">National Minimum Wage from {NMW_DECISION.operativeFrom}</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Period</th>
                        <th scope="col" className="px-5 py-4">Before tax</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {NMW_PERIODS.map((p) => (
                        <tr key={p.label}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{p.label}</th>
                          <td className="px-5 py-3 font-medium">{money(p.value)}</td>
                        </tr>
                      ))}
                      <tr className="bg-eucalyptus/5">
                        <th scope="row" className="px-5 py-3 text-left font-medium">Casual hourly (+25% loading)</th>
                        <td className="px-5 py-3 font-medium">{money(NMW.casualHourly)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray-light">
                  Hourly and weekly rates are set by the order. Daily, fortnightly, monthly and annual figures are our arithmetic on the weekly rate, using 52 weeks a year.
                </p>
              </div>
            </section>

            <section id="after-tax">
              <h2 style={H2}>Minimum Wage After Tax</h2>
              <p>
                A full-time adult on {money(NMW.annual)} a year pays about {formatAUD(NMW_AFTER_TAX.tax)} in income tax and Medicare levy in {SITE_CONFIG.financialYear}, leaving:
              </p>
              <ul>
                <li><strong>{formatAUD(NMW_AFTER_TAX.annual)}</strong> a year</li>
                <li><strong>{money(NMW_AFTER_TAX.fortnightly)}</strong> a fortnight</li>
                <li><strong>{money(NMW_AFTER_TAX.weekly)}</strong> a week</li>
              </ul>
              <p>
                That assumes an Australian resident who claims the tax-free threshold and has no HECS-HELP debt. The employer also pays about {formatAUD(NMW_AFTER_TAX.super)} a year in super, on top of the wage. Check your own figure with the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>, or the <Link href="/weekly-pay-calculator/">weekly</Link> and <Link href="/fortnightly-pay-calculator/">fortnightly</Link> pay calculators.
              </p>
            </section>

            <section id="by-state">
              <h2 style={H2}>Minimum Wage in Victoria, NSW, Queensland and Other States</h2>
              <p>
                <strong>There is one national minimum wage.</strong> The Fair Work Commission sets the National Minimum Wage and every modern award rate for the whole national system, so a minimum-wage worker in Melbourne, Sydney, Brisbane, Adelaide, Hobart, Canberra or Darwin is entitled to the same {money(NMW.hourly)} an hour.
              </p>
              <p>
                <strong>Western Australia is the exception.</strong> WA did not refer its private-sector industrial relations powers to the Commonwealth, so employees of sole traders, partnerships, some trusts and other non-corporate employers in WA are in the WA state system. The {WA_STATE_MINIMUM_WAGE.setBy} sets their minimum: <strong>{money(WA_STATE_MINIMUM_WAGE.weekly)} a week, or {money(WA_STATE_MINIMUM_WAGE.hourly)} an hour</strong>, for adults from {WA_STATE_MINIMUM_WAGE.operativeFrom}. Employees of companies in WA are in the national system and get the National Minimum Wage of {money(NMW.hourly)}.
              </p>
              <p>
                State and local government employees in some states are also covered by their state&rsquo;s own industrial system rather than the national one.
              </p>
            </section>

            <section id="award-minimums">
              <h2 style={H2}>Award Minimums vs the National Minimum Wage</h2>
              <p>
                Most employees are not paid under the National Minimum Wage at all but under a modern award, which sets a minimum for each classification. Award rates rose {(NMW_DECISION.awardIncrease * 100).toFixed(2)}% from {NMW_DECISION.operativeFrom}, with two floors: the lowest adult award rate for ongoing employment is {money(NMW.hourly)} (the same as the National Minimum Wage), and an entry-level rate for no more than the first six months must be at least {money(NMW_DECISION.entryLevelHourly)}. The Fair Work Ombudsman&rsquo;s Pay and Conditions Tool applies these award rates by classification, day and employment type; our <Link href="/fair-work-pay-calculator/">Fair Work pay calculator</Link> guide explains how it works.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[30rem] text-left text-sm text-navy">
                    <caption className="sr-only">Common adult award minimums compared with the National Minimum Wage</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Rate</th>
                        <th scope="col" className="px-5 py-4">Hourly</th>
                        <th scope="col" className="px-5 py-4">Weekly</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {AWARD_COMPARISON.map((r) => (
                        <tr key={r.label}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">
                            {r.href ? <Link href={r.href} className="text-eucalyptus-dark hover:underline">{r.label}</Link> : r.label}
                          </th>
                          <td className="px-5 py-3 font-medium">{money(r.hourly)}</td>
                          <td className="px-5 py-3">{money(r.weekly)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray-light">
                  Adult full-time and part-time rates from the first full pay period on or after {NMW_DECISION.operativeFrom}, from each award&rsquo;s minimum rates clause. Other awards: see <Link href="/award-rates/" className="text-eucalyptus-dark hover:underline">award rates</Link>.
                </p>
              </div>
            </section>

            <section id="casual-part-time">
              <h2 style={H2}>Casual and Part-Time Minimum Wage</h2>
              <p>
                An adult casual with no award must get at least <strong>{money(NMW.casualHourly)}</strong> an hour: the minimum plus a 25% casual loading, which the Commission kept at 25% in the 2026 review. The loading replaces paid leave, so it is not a pay rise as such; the <Link href="/casual-loading-calculator/">casual loading calculator</Link> shows what it is worth against a permanent job.
              </p>
              <p>
                Part-time employees get the same {money(NMW.hourly)} hourly rate for fewer hours. For a salary quoted as full-time equivalent, the <Link href="/pro-rata-salary-calculator/">pro-rata salary calculator</Link> works out what you are paid for your actual days or hours.
              </p>
            </section>

            <section id="juniors">
              <h2 style={H2}>Minimum Wage for Under-21s</h2>
              <p>
                The full rate applies from {ADULT_AGE}. Younger employees get a percentage of it, from {money(JUNIOR_RATES[0].hourly)} an hour under 16 to {money(JUNIOR_RATES[5].hourly)} at 20. See <Link href="/junior-pay-rates/">minimum wage by age</Link>, or go straight to a{" "}
                <Link href="/minimum-wage-by-age/15/">15</Link>, <Link href="/minimum-wage-by-age/16/">16</Link>, <Link href="/minimum-wage-by-age/17/">17</Link> or <Link href="/minimum-wage-by-age/18/">18</Link> year old.
              </p>
            </section>

            <section id="next-review">
              <h2 style={H2}>When Does the Minimum Wage Go Up Next?</h2>
              <p>
                The Fair Work Commission reviews minimum wages every year. The next review is the <strong>{NMW_DECISION.nextReview}</strong>, and its outcome is expected to apply from the first full pay period on or after <strong>{NMW_DECISION.nextReviewOperativeFrom}</strong>. The decision is usually announced in late May or June; the 2026 decision came on {NMW_DECISION.decidedOn}. In that decision the Commission noted that the remaining real wage gap for award-reliant employees could be closed in the 2027 Review if inflation forecasts are borne out.
              </p>
              <h3>Recent increases</h3>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[28rem] text-left text-sm text-navy">
                    <caption className="sr-only">Recent National Minimum Wage increases</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">From</th>
                        <th scope="col" className="px-5 py-4">Hourly</th>
                        <th scope="col" className="px-5 py-4">Weekly</th>
                        <th scope="col" className="px-5 py-4">Increase</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {RECENT_HISTORY.map((r) => (
                        <tr key={r.fy}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{r.operativeFrom}</th>
                          <td className="px-5 py-3 font-medium">{money(r.hourly)}</td>
                          <td className="px-5 py-3">{money(r.weekly)}</td>
                          <td className="px-5 py-3">{r.published ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Every rate back to 2010 is on the <Link href="/minimum-wage-history-australia/">minimum wage history</Link> page.
              </p>
            </section>

            <section id="faq">
              <h2 style={H2}>Frequently Asked Questions</h2>
              {MW_FAQS.map((f) => (
                <div key={f.q}>
                  <h3>{f.q}</h3>
                  <p>{f.a}</p>
                </div>
              ))}
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How these figures were worked out">
                <p>
                  The hourly and weekly rates, the 25% casual loading and the operative date are taken from the {NMW_DECISION.name} decision ({NMW_DECISION.citation}) and the {NMW_ORDER.citation} ({NMW_ORDER.reference}), and are held by automated tests. Award rates come from each award&rsquo;s consolidated text. After-tax figures use this site&rsquo;s {SITE_CONFIG.financialYear} tax engine for a resident claiming the tax-free threshold with no HECS debt.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {(() => { const a = getGuideAuthorship("minimum-wage-australia"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">Minimum Wage Guides</h2>
                  <div className="space-y-3">
                    {[
                      { href: "/junior-pay-rates/", label: "Minimum Wage by Age" },
                      { href: "/minimum-wage-history-australia/", label: "Minimum Wage History" },
                      { href: "/casual-loading-calculator/", label: "Casual Loading Calculator" },
                      { href: "/pro-rata-salary-calculator/", label: "Pro-Rata Salary Calculator" },
                      { href: "/award-rates/", label: "Award Rates" },
                    ].map((l) => (
                      <Link key={l.href} href={l.href} className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-3 transition-all hover:border-eucalyptus/40 hover:shadow-sm">
                        <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{l.label}</span>
                        <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none bg-eucalyptus-dark text-white shadow-md">
                <CardContent className="p-6">
                  <h2 className="mb-2 text-lg font-bold">{money(NMW.hourly)} an hour: what do you keep?</h2>
                  <p className="mb-4 text-sm text-eucalyptus-light">
                    About {money(NMW_AFTER_TAX.weekly)} a week after tax full time. Enter your own hours.
                  </p>
                  <Link href="/take-home-pay-calculator/" className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50">
                    Calculate Take-Home Pay
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

"use client";

import Link from "next/link";
import { ChevronRight, AlertTriangle, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, SOURCES, EMPLOYMENT, formatAUD } from "@/lib/constants";
import {
  AWARD_DETERMINATIONS,
  AWARD_UNVERIFIED,
  HOSPITALITY_PENALTIES,
  RETAIL_AWARD,
  RETAIL_JUNIOR_LEVEL_RESTRICTION,
  RETAIL_JUNIOR_SCALE,
  RETAIL_OVERTIME,
  RETAIL_PENALTIES,
  RETAIL_RATES,
} from "@/lib/constants/hospitality-award";
import { AwardRateTable, JuniorScaleTable } from "@/modules/guide/award-rate-table";
import { casualHourly, findRate } from "@/modules/guide/hospitality-award-faqs";
import { RETAIL_FAQS } from "@/modules/guide/retail-award-faqs";

const SOURCES_LIST: SourceLink[] = [
  { title: `Pay guide — ${RETAIL_AWARD.name} (${RETAIL_AWARD.code})`, url: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000004-summary", publisher: SOURCES.fwo.name },
  { title: `Consolidated award text ${RETAIL_AWARD.code}`, url: RETAIL_AWARD.awardTextUrl, publisher: SOURCES.fwo.name },
  { title: "Annual Wage Review 2026", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews", publisher: SOURCES.fwc.name },
];

const L1 = findRate(RETAIL_RATES, "Level 1");
const L8 = findRate(RETAIL_RATES, "Level 8");
const LOADING = RETAIL_AWARD.casualLoading;
const pct = (v: number) => `${(v * 100).toFixed((v * 100) % 1 === 0 ? 0 : 1)}%`;

/** Gaps on this page are the retail entries in the shared unverified list. */
const RETAIL_GAPS = AWARD_UNVERIFIED.filter((g) => g.startsWith("Retail"));

export default function RetailAwardRatesPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/award-rates/" className="hover:text-eucalyptus-dark hover:underline">Award Rates</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Retail Award Rates</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Retail Award Rates {SITE_CONFIG.financialYear}
          </h1>
          <p className="mb-5 text-xl leading-relaxed text-warmgray">
            Every classification rate under the {RETAIL_AWARD.name} ({RETAIL_AWARD.code}) &mdash; shops, supermarkets and retail chains &mdash; operative from {RETAIL_AWARD.operativeFrom}.
          </p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> Adult retail rates run from <strong>{formatAUD(L1.hourly, 2)}</strong> an hour ({formatAUD(L1.weekly, 2)} a week) at retail employee level 1, where most shop assistants sit, up to <strong>{formatAUD(L8.hourly, 2)}</strong> at level 8. A level 1 casual earns <strong>{formatAUD(casualHourly(L1.hourly, LOADING), 2)}</strong> an hour, rising to {formatAUD(L1.hourly * RETAIL_PENALTIES.casualSunday, 2)} on a Sunday.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">

            <section id="rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Retail Award Pay Rates</h2>
              <p>
                These are the adult rates for full-time and part-time employees. Part-time employees receive the same hourly rate as full-time employees at the same level &mdash; the difference is hours, not rate.
              </p>
              <AwardRateTable
                rows={RETAIL_RATES}
                casualLoading={LOADING}
                caption={`Retail award adult pay rates from ${RETAIL_AWARD.operativeFrom}`}
                levelHeading="Retail employee level"
              />
              <p className="text-sm text-warmgray">
                Weekly rates are as published by the Fair Work Ombudsman. Hourly is the weekly rate divided by {EMPLOYMENT.standardWeeklyHours} ordinary hours. The casual column adds the {pct(LOADING)} loading.
              </p>
            </section>

            <section id="penalty-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Retail Penalty Rates</h2>
              <p>
                These apply to <strong>non-shiftworkers</strong> &mdash; employees specifically engaged to work shifts are covered by a separate part of the award. Dollar columns use level 1 ({formatAUD(L1.hourly, 2)}/hr).
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[36rem] text-left text-sm text-navy">
                    <caption className="sr-only">Retail penalty rates for permanent and casual employees</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">When worked</th>
                        <th scope="col" className="px-5 py-4">Permanent</th>
                        <th scope="col" className="px-5 py-4">$ on level 1</th>
                        <th scope="col" className="px-5 py-4">Casual</th>
                        <th scope="col" className="px-5 py-4">$ casual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {[
                        { label: "Monday to Friday — ordinary hours", perm: 1, cas: 1 + LOADING },
                        { label: "Monday to Friday — after 6pm", perm: RETAIL_PENALTIES.eveningAfter6pm, cas: RETAIL_PENALTIES.casualEveningAfter6pm },
                        { label: "Saturday", perm: RETAIL_PENALTIES.saturday, cas: RETAIL_PENALTIES.casualSaturday },
                        { label: "Sunday", perm: RETAIL_PENALTIES.sunday, cas: RETAIL_PENALTIES.casualSunday },
                        { label: "Public holiday", perm: RETAIL_PENALTIES.publicHoliday, cas: RETAIL_PENALTIES.casualPublicHoliday },
                      ].map((row) => (
                        <tr key={row.label}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{row.label}</th>
                          <td className="px-5 py-3 font-medium">{pct(row.perm)}</td>
                          <td className="px-5 py-3">{formatAUD(L1.hourly * row.perm, 2)}</td>
                          <td className="px-5 py-3 font-medium">{pct(row.cas)}</td>
                          <td className="px-5 py-3">{formatAUD(L1.hourly * row.cas, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                <strong>Retail evening work is a percentage.</strong> Ordinary hours after 6pm Monday to Friday attract {pct(RETAIL_PENALTIES.eveningAfter6pm)}. That is worth flagging because the <Link href="/hospitality-award-rates/">Hospitality Industry (General) Award</Link> handles the same situation with a <em>flat cash</em> addition of {formatAUD(HOSPITALITY_PENALTIES.eveningPerHour, 2)} an hour instead. Venues running both a shop and a food business under two awards routinely apply the wrong method to one of them.
              </p>
              <p>
                Casual penalties are <strong>additive, not compounded</strong>. Casual Sunday is {pct(RETAIL_PENALTIES.casualSunday)} &mdash; the {pct(RETAIL_PENALTIES.sunday)} Sunday rate plus the {pct(LOADING)} loading &mdash; not {pct(RETAIL_PENALTIES.sunday)} multiplied by {(1 + LOADING).toFixed(2)}, which would give {pct(RETAIL_PENALTIES.sunday * (1 + LOADING))}.
              </p>
            </section>

            <section id="overtime">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Retail Overtime Rates</h2>
              <p>
                Note the banding: the first-three-hours rate runs <strong>Monday to Saturday</strong>, not Monday to Friday. Saturday overtime is not separately defined because it sits inside that band.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[34rem] text-left text-sm text-navy">
                    <caption className="sr-only">Retail overtime rates for permanent and casual employees</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Overtime worked</th>
                        <th scope="col" className="px-5 py-4">Permanent</th>
                        <th scope="col" className="px-5 py-4">Casual</th>
                        <th scope="col" className="px-5 py-4">$ casual on level 1</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {[
                        { l: "Monday to Saturday — first 3 hours", p: RETAIL_OVERTIME.weekdayFirst3Hours, c: RETAIL_OVERTIME.casualWeekdayFirst3Hours },
                        { l: "Monday to Saturday — after 3 hours", p: RETAIL_OVERTIME.weekdayAfter3Hours, c: RETAIL_OVERTIME.casualWeekdayAfter3Hours },
                        { l: "Sunday", p: RETAIL_OVERTIME.sunday, c: RETAIL_OVERTIME.casualSunday },
                        { l: "Public holiday", p: RETAIL_OVERTIME.publicHoliday, c: RETAIL_OVERTIME.casualPublicHoliday },
                      ].map((row) => (
                        <tr key={row.l}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{row.l}</th>
                          <td className="px-5 py-3 font-medium">{pct(row.p)}</td>
                          <td className="px-5 py-3 font-medium">{pct(row.c)}</td>
                          <td className="px-5 py-3">{formatAUD(L1.hourly * row.c, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <h3>Retail casuals do get the loading on overtime</h3>
              <p>
                The award&rsquo;s own note to the overtime table states that casual overtime rates were calculated by <strong>adding the casual loading</strong> to the full-time rates. So a casual working the first three hours of overtime is on {pct(RETAIL_OVERTIME.casualWeekdayFirst3Hours)} where a permanent employee is on {pct(RETAIL_OVERTIME.weekdayFirst3Hours)} &mdash; {formatAUD(L1.hourly * RETAIL_OVERTIME.casualWeekdayFirst3Hours, 2)} against {formatAUD(L1.hourly * RETAIL_OVERTIME.weekdayFirst3Hours, 2)} at level 1.
              </p>
              <p>
                <strong>Hospitality does the opposite.</strong> There the loading is excluded from overtime altogether, so casual and full-time overtime dollars are the same. If you work across both awards, this is the difference most likely to show up as an underpayment.
              </p>
            </section>

            <section id="junior-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Retail Junior Rates</h2>
              <p>
                Junior rates are a percentage of the adult rate. The dollar columns apply each percentage to the level 1 weekly rate of {formatAUD(L1.weekly, 2)}.
              </p>
              <JuniorScaleTable
                scale={RETAIL_JUNIOR_SCALE}
                adultWeekly={L1.weekly}
                standardWeeklyHours={EMPLOYMENT.standardWeeklyHours}
                caption="Retail award junior rates as a percentage of the adult rate"
                adultLabel="level 1"
              />
              <div className="not-prose my-6 rounded-xl border-l-4 border-ochre bg-sandstone p-5">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-ochre" aria-hidden="true" />
                  <div>
                    <h3 className="mb-2 text-base font-bold text-navy">Junior rates stop at level 3</h3>
                    <p className="text-sm leading-relaxed text-navy">
                      {RETAIL_JUNIOR_LEVEL_RESTRICTION} This is the award&rsquo;s own rule, not a gap in what Fair Work publishes &mdash; so a 17-year-old doing level 4 work is entitled to the full level 4 rate, not 60% of it.
                    </p>
                  </div>
                </div>
              </div>
              <p>
                Two other features are unusual. The <strong>20-year-old band splits on length of service</strong>, so a 20-year-old moves to the full adult rate after more than six months with the same employer. And 19-year-olds receive {pct(RETAIL_JUNIOR_SCALE.find((b) => b.age === "19")!.percentage)} here where the hospitality award pays 85%.
              </p>
              <p>
                For how these compare with the Fast Food and Hair &amp; Beauty awards and with the National Minimum Wage, and for the pending change that would raise 18 to 20-year-old rates, see our <Link href="/junior-pay-rates/">junior pay rates guide</Link>.
              </p>
            </section>

            <section id="not-covered">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What This Page Does Not Cover</h2>
              <p>
                These parts of the award carry rates we have not verified against a primary source, so we publish no figures for them:
              </p>
              <ul>
                {RETAIL_GAPS.map((g) => (<li key={g}>{g}</li>))}
              </ul>
              <p>
                If you are engaged specifically as a shiftworker, or you work in in-store baking production on early-morning or night shifts, the penalty structure above is not the one that applies to you. Check the award directly.
              </p>
              <div className="not-prose mt-6">
                <a href={RETAIL_AWARD.awardTextUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md border border-transparent bg-eucalyptus-dark px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-navy">
                  Read the full {RETAIL_AWARD.code} award text
                  <ExternalLink className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </section>

            <section id="when-rates-changed">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When These Rates Took Effect</h2>
              <p>
                Rates apply <strong>from the first full pay period starting on or after {RETAIL_AWARD.operativeFrom}</strong> &mdash; not universally 1 July. If your pay period began before that date, the previous rate lawfully covers the whole of it. The Annual Wage Review 2026 was given effect for this award by determination {AWARD_DETERMINATIONS.retail}.
              </p>
              <p>
                If you have been paid below these rates, our <Link href="/backpay-calculator/">backpay calculator</Link> works out what is owed, and underpayment can be recovered for up to six years.
              </p>
            </section>

            <section id="related">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Guides</h2>
              <ul>
                <li><Link href="/hospitality-award-rates/">Hospitality Award Rates</Link> &mdash; the award with the opposite casual overtime rule</li>
                <li><Link href="/junior-pay-rates/">Junior Pay Rates</Link> &mdash; minimum wage by age across awards</li>
                <li><Link href="/overtime-penalty-rates-guide/">Penalty Rates</Link> &mdash; weekend and public holiday loadings across awards</li>
                <li><Link href="/schads-award-pay-rates/">SCHADS Award Pay Rates</Link> &mdash; social, community and home care</li>
                <li><Link href="/retail-hospitality-pay-guide/">Working in Retail &amp; Hospitality</Link> &mdash; rights, rosters and take-home pay</li>
                <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> &mdash; your award rate after tax</li>
              </ul>
            </section>

            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              {/* Crawlable mirror — the Radix accordion unmounts closed content. */}
              <div className="sr-only">
                <h3>Retail award rate questions and answers</h3>
                {RETAIL_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {RETAIL_FAQS.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="rounded-lg border bg-white px-4">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How these rates were verified">
                <p>
                  Every rate comes from a single constants file checked against the Fair Work Ombudsman pay guide for {RETAIL_AWARD.code} effective {RETAIL_AWARD.operativeFrom} and the consolidated award text. Hourly is the published weekly rate divided by {EMPLOYMENT.standardWeeklyHours}; casual rates add the {pct(LOADING)} loading.
                </p>
                <p>
                  Automated tests assert that casual overtime here <em>includes</em> the loading while hospitality excludes it, that overtime is banded Monday to Saturday rather than Monday to Friday, and that junior rates are confined to levels 1 to 3 by the award itself. Junior figures apply the award percentage to the weekly classification rate and then divide by {EMPLOYMENT.standardWeeklyHours}. Anything unverified is listed above as a gap rather than estimated.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("retail-award-rates"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">Award Pay Rates</h2>
                  <div className="space-y-3">
                    {[
                      { href: "/hospitality-award-rates/", label: "Hospitality Award Rates" },
                      { href: "/schads-award-pay-rates/", label: "SCHADS Award Pay Rates" },
                      { href: "/junior-pay-rates/", label: "Junior Pay Rates" },
                      { href: "/overtime-penalty-rates-guide/", label: "Penalty Rates" },
                      { href: "/award-rates/", label: "All Award Rates" },
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
                  <h2 className="mb-2 text-lg font-bold">Check your take-home pay</h2>
                  <p className="mb-4 text-sm text-eucalyptus-light">
                    Level 1 casual is {formatAUD(casualHourly(L1.hourly, LOADING), 2)} an hour before tax. See what actually lands in your account.
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

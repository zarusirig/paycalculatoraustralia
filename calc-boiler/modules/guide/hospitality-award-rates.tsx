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
  AWARD_UNVERIFIED,
  AWR_2026_FLOORS,
  HOSPITALITY_AWARD,
  HOSPITALITY_CLASSIFICATIONS,
  HOSPITALITY_JUNIOR_ADULT_RATE_EXCEPTIONS,
  HOSPITALITY_JUNIOR_OFFICE_SCALE,
  HOSPITALITY_JUNIOR_SCALE,
  HOSPITALITY_OVERTIME,
  HOSPITALITY_PENALTIES,
  HOSPITALITY_PUBLIC_HOLIDAY_OVERTIME,
  HOSPITALITY_MANAGERIAL_SOURCE,
  HOSPITALITY_JUNIOR_ADULT_RATE_SOURCE,
  HOSPITALITY_RATES,
} from "@/lib/constants/hospitality-award";
import { AwardRateTable, JuniorScaleTable } from "@/modules/guide/award-rate-table";
import { HOSPITALITY_FAQS, casualHourly, findRate } from "@/modules/guide/hospitality-award-faqs";

const SOURCES_LIST: SourceLink[] = [
  { title: `Pay guide — ${HOSPITALITY_AWARD.name} (${HOSPITALITY_AWARD.code})`, url: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000009-summary", publisher: SOURCES.fwo.name },
  { title: `Consolidated award text ${HOSPITALITY_AWARD.code}`, url: HOSPITALITY_AWARD.awardTextUrl, publisher: SOURCES.fwo.name },
  { title: "Annual Wage Review 2026", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews", publisher: SOURCES.fwc.name },
];

const INTRO = findRate(HOSPITALITY_RATES, "Introductory");
const L1 = findRate(HOSPITALITY_RATES, "Level 1");
const L6 = findRate(HOSPITALITY_RATES, "Level 6");

const LOADING = HOSPITALITY_AWARD.casualLoading;
const pct = (v: number) => `${(v * 100).toFixed((v * 100) % 1 === 0 ? 0 : 1)}%`;

/** Gaps on this page are the non-retail entries in the shared unverified list. */
const HOSPITALITY_GAPS = AWARD_UNVERIFIED.filter((g) => !g.startsWith("Retail"));

export default function HospitalityAwardRatesPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/award-rates/" className="hover:text-eucalyptus-dark hover:underline">Award Rates</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Hospitality Award Rates</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Hospitality Award Rates {SITE_CONFIG.financialYear}
          </h1>
          <p className="mb-5 text-xl leading-relaxed text-warmgray">
            Every classification rate under the {HOSPITALITY_AWARD.name} ({HOSPITALITY_AWARD.code}) &mdash; cafes, restaurants, pubs, clubs and hotels &mdash; operative from {HOSPITALITY_AWARD.operativeFrom}.
          </p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> Adult hospitality rates run from <strong>{formatAUD(INTRO.hourly, 2)}</strong> an hour at the introductory level to <strong>{formatAUD(L6.hourly, 2)}</strong> at Level 6. Level 1 &mdash; the standard entry classification for a food and beverage attendant or kitchen hand &mdash; is <strong>{formatAUD(L1.hourly, 2)}</strong> an hour, or <strong>{formatAUD(casualHourly(L1.hourly, LOADING), 2)}</strong> as a casual. Evening and night work add a <strong>flat cash amount</strong> per hour, not a percentage.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">

            <section id="rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Hospitality Award Pay Rates</h2>
              <p>
                These are the adult rates for full-time and part-time employees. Part-time employees are paid the same hourly rate as full-time employees for their classification &mdash; the difference is hours, not rate.
              </p>
              <AwardRateTable
                rows={HOSPITALITY_RATES}
                casualLoading={LOADING}
                caption={`Hospitality award adult pay rates from ${HOSPITALITY_AWARD.operativeFrom}`}
              />
              <p className="text-sm text-warmgray">
                Weekly rates are as published by the Fair Work Ombudsman. Hourly is the weekly rate divided by {EMPLOYMENT.standardWeeklyHours} ordinary hours. The casual column adds the {pct(LOADING)} loading. The managerial (hotels) weekly figure comes from the Fair Work pay guide &mdash; the award itself sets a minimum <strong>annual</strong> salary of {formatAUD(HOSPITALITY_MANAGERIAL_SOURCE.awardAnnualSalary)} at {HOSPITALITY_MANAGERIAL_SOURCE.awardClause} and never states a weekly rate for that classification.
              </p>
            </section>

            {/* THE AWR FLOOR TRAP */}
            <section id="not-a-uniform-increase">
              <div className="not-prose my-6 rounded-xl border-l-4 border-ochre bg-sandstone p-5">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-ochre" aria-hidden="true" />
                  <div>
                    <h2 className="mb-2 text-base font-bold text-navy">The {(AWR_2026_FLOORS.increase * 100).toFixed(2)}% increase was not applied to every rate</h2>
                    <p className="mb-2 text-sm leading-relaxed text-navy">
                      The {SITE_CONFIG.financialYear} Annual Wage Review increase was subject to two floors: <strong>{formatAUD(AWR_2026_FLOORS.ongoingWeekly, 2)}</strong> a week for ongoing employment, and <strong>{formatAUD(AWR_2026_FLOORS.entryLevelWeekly, 2)}</strong> for an entry-level rate applying during the first six months.
                    </p>
                    <p className="text-sm leading-relaxed text-navy">
                      Hospitality <strong>Introductory ({formatAUD(INTRO.weekly, 2)})</strong> and <strong>Level 1 ({formatAUD(L1.weekly, 2)})</strong> sit exactly on those floors. They were lifted <em>to</em> the floor, not escalated by {(AWR_2026_FLOORS.increase * 100).toFixed(2)}%. If you work out this year&rsquo;s rates by adding {(AWR_2026_FLOORS.increase * 100).toFixed(2)}% to last year&rsquo;s figures, you will get the wrong number for both.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="classifications">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Level Am I? Hospitality Classifications</h2>
              <p>
                The award classifies by the work performed, not by job title. These are the classifications that map to each pay level for food and beverage, kitchen and cooking roles.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[30rem] text-left text-sm text-navy">
                    <caption className="sr-only">Hospitality award classifications mapped to pay levels</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Classification</th>
                        <th scope="col" className="px-5 py-4">Level</th>
                        <th scope="col" className="px-5 py-4">Hourly</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {HOSPITALITY_CLASSIFICATIONS.map((c) => (
                        <tr key={c.title}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{c.title}</th>
                          <td className="px-5 py-3">{c.level}</td>
                          <td className="px-5 py-3 font-medium">{formatAUD(findRate(HOSPITALITY_RATES, c.level).hourly, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                <strong>There is no food and beverage attendant grade 5.</strong> That stream runs grades 1 to 4 only; Level 5 is &ldquo;food and beverage supervisor&rdquo;, a different classification rather than a fifth grade. A rate table showing an F&amp;B grade 5 has invented a classification the award does not contain.
              </p>
            </section>

            <section id="penalty-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Hospitality Penalty Rates</h2>
              <p>
                Weekend and public holiday penalties are percentages of the ordinary rate. The dollar columns use Level 1 ({formatAUD(L1.hourly, 2)}/hr) as the worked example.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[36rem] text-left text-sm text-navy">
                    <caption className="sr-only">Hospitality penalty rates for permanent and casual employees</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">When worked</th>
                        <th scope="col" className="px-5 py-4">Permanent</th>
                        <th scope="col" className="px-5 py-4">$ on Level 1</th>
                        <th scope="col" className="px-5 py-4">Casual</th>
                        <th scope="col" className="px-5 py-4">$ casual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {[
                        { label: "Monday to Friday", perm: 1, cas: 1 + LOADING },
                        { label: "Saturday", perm: HOSPITALITY_PENALTIES.saturday, cas: HOSPITALITY_PENALTIES.casualSaturday },
                        { label: "Sunday", perm: HOSPITALITY_PENALTIES.sunday, cas: HOSPITALITY_PENALTIES.casualSunday },
                        { label: "Public holiday", perm: HOSPITALITY_PENALTIES.publicHoliday, cas: HOSPITALITY_PENALTIES.casualPublicHoliday },
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

              <h3>Evening and night work is a flat cash amount</h3>
              <p>
                This is the part most hospitality pay calculators get wrong. Evening and night loadings in this award are <strong>not multipliers</strong>. You are paid your ordinary rate <em>plus a fixed number of dollars per hour</em>:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[30rem] text-left text-sm text-navy">
                    <caption className="sr-only">Hospitality evening and night flat cash loadings</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Loading</th>
                        <th scope="col" className="px-5 py-4">Added per hour</th>
                        <th scope="col" className="px-5 py-4">Level 1 becomes</th>
                        <th scope="col" className="px-5 py-4">Level 6 becomes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <th scope="row" className="px-5 py-3 text-left font-medium">Evening</th>
                        <td className="px-5 py-3 font-medium">+{formatAUD(HOSPITALITY_PENALTIES.eveningPerHour, 2)}</td>
                        <td className="px-5 py-3">{formatAUD(L1.hourly + HOSPITALITY_PENALTIES.eveningPerHour, 2)}</td>
                        <td className="px-5 py-3">{formatAUD(L6.hourly + HOSPITALITY_PENALTIES.eveningPerHour, 2)}</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-5 py-3 text-left font-medium">Night</th>
                        <td className="px-5 py-3 font-medium">+{formatAUD(HOSPITALITY_PENALTIES.nightPerHour, 2)}</td>
                        <td className="px-5 py-3">{formatAUD(L1.hourly + HOSPITALITY_PENALTIES.nightPerHour, 2)}</td>
                        <td className="px-5 py-3">{formatAUD(L6.hourly + HOSPITALITY_PENALTIES.nightPerHour, 2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Because the amount is fixed, it is worth proportionally more at lower classifications &mdash; {formatAUD(HOSPITALITY_PENALTIES.nightPerHour, 2)} is {((HOSPITALITY_PENALTIES.nightPerHour / L1.hourly) * 100).toFixed(1)}% on Level 1 but only {((HOSPITALITY_PENALTIES.nightPerHour / L6.hourly) * 100).toFixed(1)}% on Level 6. The <Link href="/retail-award-rates/">retail award</Link> does the opposite, using a percentage for evening work.
              </p>
              <p>
                <strong>Penalties do not stack.</strong> Where more than one penalty could apply to the same hours, only the highest is paid &mdash; with one exception: {HOSPITALITY_PENALTIES.highestOnlyException.charAt(0).toLowerCase() + HOSPITALITY_PENALTIES.highestOnlyException.slice(1)}
              </p>
              <p>
                And casual penalties are <strong>additive, not compounded</strong> &mdash; casual Sunday is {pct(HOSPITALITY_PENALTIES.casualSunday)}, being {pct(HOSPITALITY_PENALTIES.sunday)} plus the {pct(LOADING)} loading, not {pct(HOSPITALITY_PENALTIES.sunday)} multiplied by {(1 + LOADING).toFixed(2)} which would give {pct(HOSPITALITY_PENALTIES.sunday * (1 + LOADING))}.
              </p>
            </section>

            <section id="overtime">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Hospitality Overtime Rates</h2>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[30rem] text-left text-sm text-navy">
                    <caption className="sr-only">Hospitality overtime rates</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Overtime worked</th>
                        <th scope="col" className="px-5 py-4">Rate</th>
                        <th scope="col" className="px-5 py-4">$ on Level 1</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {[
                        { l: "Monday to Friday — first 2 hours", v: HOSPITALITY_OVERTIME.weekdayFirst2Hours },
                        { l: "Monday to Friday — after 2 hours", v: HOSPITALITY_OVERTIME.weekdayAfter2Hours },
                        { l: "Saturday or Sunday", v: HOSPITALITY_OVERTIME.weekend },
                        { l: "On a rostered day off", v: HOSPITALITY_OVERTIME.rosteredDayOff },
                      ].map((row) => (
                        <tr key={row.l}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{row.l}</th>
                          <td className="px-5 py-3 font-medium">{pct(row.v)}</td>
                          <td className="px-5 py-3">{formatAUD(L1.hourly * row.v, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <h3>Casuals do not get the loading on overtime &mdash; and retail casuals do</h3>
              <p>
                In hospitality the overtime clause operates on the <strong>ordinary hourly rate</strong>, and the award&rsquo;s definitions clause excludes the casual loading from that term. The consequence is concrete: for Monday to Friday, weekend and rostered-day-off overtime, <strong>a casual and a full-time employee on the same classification are paid identical overtime dollars.</strong> On Level 1 that is {formatAUD(L1.hourly * HOSPITALITY_OVERTIME.weekdayFirst2Hours, 2)} an hour for both.
              </p>
              <p>
                <strong>Public holidays are the exception.</strong> There the two do diverge &mdash; full-time overtime is {pct(HOSPITALITY_PUBLIC_HOLIDAY_OVERTIME.fullTime)} and casual overtime is {pct(HOSPITALITY_PUBLIC_HOLIDAY_OVERTIME.casual)}, or {formatAUD(L1.hourly * HOSPITALITY_PUBLIC_HOLIDAY_OVERTIME.fullTime, 2)} against {formatAUD(L1.hourly * HOSPITALITY_PUBLIC_HOLIDAY_OVERTIME.casual, 2)} on Level 1. Stating the rule without that carve-out understates casual public holiday pay.
              </p>
              <p>
                The <Link href="/retail-award-rates/">General Retail Industry Award</Link> does the opposite &mdash; the loading <em>is</em> included, so retail casual overtime is 175% against 150% for permanents. Two awards, two rules, and one payroll configuration cannot serve both. This is a common source of underpayment when a venue runs a bistro under one award and a shop under the other.
              </p>
            </section>

            <section id="junior-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Hospitality Junior Rates</h2>
              <p>
                Junior rates are a percentage of the adult rate for the employee&rsquo;s classification. The dollar columns below apply the percentage to Level 1 ({formatAUD(L1.weekly, 2)} a week).
              </p>
              <JuniorScaleTable
                scale={HOSPITALITY_JUNIOR_SCALE}
                adultWeekly={L1.weekly}
                standardWeeklyHours={EMPLOYMENT.standardWeeklyHours}
                caption="Hospitality junior rates as a percentage of the adult rate"
                adultLabel="Level 1"
              />
              <p>
                Two things set hospitality apart. <strong>19-year-olds receive {pct(HOSPITALITY_JUNIOR_SCALE.find((b) => b.age === "19")!.percentage)}</strong> where the retail award pays 80%. And the <strong>full adult rate starts at 20</strong>, not 21.
              </p>
              <p>
                {HOSPITALITY_JUNIOR_ADULT_RATE_EXCEPTIONS} {HOSPITALITY_JUNIOR_ADULT_RATE_SOURCE}
              </p>

              <h3>Junior office employees are on a different scale</h3>
              <p>
                Office employees under this award have their own junior table, which starts lower and runs a year longer.
              </p>
              <JuniorScaleTable
                scale={HOSPITALITY_JUNIOR_OFFICE_SCALE}
                adultWeekly={L1.weekly}
                standardWeeklyHours={EMPLOYMENT.standardWeeklyHours}
                caption="Hospitality junior office employee rates"
                adultLabel="Level 1"
              />
              <p>
                For how junior rates compare across awards and against the National Minimum Wage, see our <Link href="/junior-pay-rates/">junior pay rates guide</Link>.
              </p>
            </section>

            <section id="not-covered">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What This Page Does Not Cover</h2>
              <p>
                These parts of the award carry rates we have not verified against a primary source, so we publish no figures for them:
              </p>
              <ul>
                {HOSPITALITY_GAPS.map((g) => (<li key={g}>{g}</li>))}
              </ul>
              <p>
                <strong>Loaded rate arrangements deserve particular care.</strong> A venue may pay a single higher hourly rate that absorbs penalties and overtime instead of applying them separately. Those arrangements produce different results from the tables above, and whether one leaves you better off depends entirely on the shifts you actually work.
              </p>
              <div className="not-prose mt-6">
                <a href={HOSPITALITY_AWARD.awardTextUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md border border-transparent bg-eucalyptus-dark px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-navy">
                  Read the full {HOSPITALITY_AWARD.code} award text
                  <ExternalLink className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </section>

            <section id="when-rates-changed">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When These Rates Took Effect</h2>
              <p>
                <strong>{HOSPITALITY_AWARD.effectiveNote}</strong> That is not universally 1 July. If your pay period began before {HOSPITALITY_AWARD.operativeFrom}, the previous rate lawfully applies to that whole period and the rise starts with the next one &mdash; the most common reason a July payslip looks wrong when it is not.
              </p>
              <p>
                The award was varied by determination {HOSPITALITY_AWARD.determination}, and the Fair Work Ombudsman published the updated pay guide on {HOSPITALITY_AWARD.payGuidePublished}. If you have been paid below these rates, our <Link href="/backpay-calculator/">backpay calculator</Link> works out what is owed.
              </p>
            </section>

            <section id="related">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Guides</h2>
              <ul>
                <li><Link href="/retail-award-rates/">Retail Award Rates</Link> &mdash; the other big casual-employing award, with different overtime rules</li>
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
                <h3>Hospitality award rate questions and answers</h3>
                {HOSPITALITY_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {HOSPITALITY_FAQS.map((f) => (
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
                  Every rate comes from a single constants file checked against the Fair Work Ombudsman pay guide for {HOSPITALITY_AWARD.code} effective {HOSPITALITY_AWARD.operativeFrom} (published {HOSPITALITY_AWARD.payGuidePublished}) and the consolidated award text. Hourly is the published weekly rate divided by {EMPLOYMENT.standardWeeklyHours}; casual rates add the {pct(LOADING)} loading.
                </p>
                <p>
                  Automated tests assert the three rules this award is most often modelled wrongly on: that evening and night loadings are flat cash rather than multipliers, that casual penalties are additive rather than compounded, and that the casual loading is excluded from overtime. Junior figures are the award percentage applied to the weekly classification rate and then divided by {EMPLOYMENT.standardWeeklyHours} &mdash; the order Fair Work uses. Classifications we could not verify are listed as gaps rather than estimated.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("hospitality-award-rates"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">Award Pay Rates</h2>
                  <div className="space-y-3">
                    {[
                      { href: "/retail-award-rates/", label: "Retail Award Rates" },
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

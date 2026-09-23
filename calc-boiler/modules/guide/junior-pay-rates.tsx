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
  ADULT_AGE,
  AWARD_JUNIOR_SCALES,
  CASUAL_LOADING,
  JUNIOR_BANDS_SOURCE,
  JUNIOR_RATES,
  MINIMUM_WORKING_AGE,
  JUNIOR_TRANSITION_SCHEDULES,
  NMW_ORDER,
  PENDING_JUNIOR_CHANGE,
} from "@/lib/constants/junior-rates";
import { JUNIOR_FAQS } from "@/modules/guide/junior-pay-rates-faqs";
import { MIN_WAGE_AGES, ageSummary, money } from "@/modules/guide/minimum-wage-by-age-data";

const SOURCES_LIST: SourceLink[] = [
  { title: `${NMW_ORDER.citation} (${NMW_ORDER.reference})`, url: NMW_ORDER.url, publisher: SOURCES.fwc.name },
  { title: "Award and agreement free wages and conditions", url: "https://www.fairwork.gov.au/employment-conditions/awards/award-and-agreement-free-wages-and-conditions", publisher: SOURCES.fwo.name },
  { title: "Junior pay rates", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/junior-pay-rates", publisher: SOURCES.fwo.name },
  { title: "Minimum working age", url: "https://www.fairwork.gov.au/find-help-for/young-workers-and-students/minimum-working-age", publisher: SOURCES.fwo.name },
];

const byAge = (age: string) => JUNIOR_RATES.find((r) => r.age === age)!;
const A16 = byAge("16");
const U16 = byAge("Under 16");
const JUNIOR_ONLY = JUNIOR_RATES.filter((r) => r.percentage < 1);

const pct1 = (v: number) => `${(v * 100).toFixed(1)}%`;

export default function JuniorPayRatesPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/award-rates/" className="hover:text-eucalyptus-dark hover:underline">Award Rates</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Minimum Wage by Age</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Minimum Wage by Age {SITE_CONFIG.financialYear}: Junior Pay Rates for 14 to 20 Year Olds
          </h1>
          <p className="mb-5 text-xl leading-relaxed text-warmgray">
            What under-{ADULT_AGE}s must legally be paid in Australia, for the National Minimum Wage and for the awards that cover most young workers.
          </p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> If no award covers you, junior rates run from <strong>{formatAUD(U16.hourly, 2)}</strong> an hour under 16 to <strong>{formatAUD(byAge("20").hourly, 2)}</strong> at 20, reaching the full {formatAUD(EMPLOYMENT.minimumWageHourly, 2)} National Minimum Wage at {ADULT_AGE}. A 16-year-old gets <strong>{formatAUD(A16.hourly, 2)}</strong> an hour, or {formatAUD(A16.casualHourly, 2)} as a casual. <strong>If an award covers you &mdash; and in retail or fast food it almost certainly does &mdash; a different percentage applies</strong> to a different base rate.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        {/* Age-led summary: the queries are "minimum wage for a 15 year old" etc. */}
        <section id="by-age" className="mb-12" aria-labelledby="by-age-heading">
          <h2 id="by-age-heading" className="mb-3 text-2xl font-bold text-navy" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Minimum Wage by Age at a Glance
          </h2>
          <p className="mb-4 max-w-4xl text-warmgray">
            Hourly rates from {NMW_ORDER.operativeFrom}, with casual rates in brackets. Pick an age for weekly pay at 10, 15 and 20 hours, tax, and the rules for that age.
          </p>
          <nav aria-label="Jump to an age" className="mb-5 flex flex-wrap gap-2">
            {MIN_WAGE_AGES.map((a) => (
              <Link key={a} href={`/minimum-wage-by-age/${a}/`} className="rounded-full border border-eucalyptus/40 bg-white px-4 py-1.5 text-sm font-medium text-eucalyptus-dark hover:bg-eucalyptus/10">
                {a} year olds
              </Link>
            ))}
            <Link href="/minimum-wage-australia/" className="rounded-full border border-eucalyptus/40 bg-white px-4 py-1.5 text-sm font-medium text-eucalyptus-dark hover:bg-eucalyptus/10">
              {ADULT_AGE} and over
            </Link>
            <a href="#award-junior-scales" className="rounded-full border border-sandstone-dark/30 bg-sandstone px-4 py-1.5 text-sm font-medium text-navy hover:bg-sandstone-dark/10">By award</a>
            <a href="#pending-change" className="rounded-full border border-sandstone-dark/30 bg-sandstone px-4 py-1.5 text-sm font-medium text-navy hover:bg-sandstone-dark/10">Are rates changing?</a>
            <a href="#minimum-working-age" className="rounded-full border border-sandstone-dark/30 bg-sandstone px-4 py-1.5 text-sm font-medium text-navy hover:bg-sandstone-dark/10">Working age by state</a>
          </nav>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
            <table className="w-full min-w-[40rem] text-left text-sm text-navy">
              <caption className="sr-only">Minimum wage by age in Australia from {NMW_ORDER.operativeFrom}</caption>
              <thead className="bg-sandstone font-semibold text-navy">
                <tr>
                  <th scope="col" className="px-4 py-3">Age</th>
                  <th scope="col" className="px-4 py-3">No award (NMW)</th>
                  <th scope="col" className="px-4 py-3">Retail award L1</th>
                  <th scope="col" className="px-4 py-3">Fast food award L1</th>
                  <th scope="col" className="px-4 py-3">Hospitality award L1</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                {MIN_WAGE_AGES.map((a) => {
                  const s = ageSummary(a);
                  return (
                    <tr key={a}>
                      <th scope="row" className="px-4 py-3 text-left font-medium">
                        <Link href={`/minimum-wage-by-age/${a}/`} className="text-eucalyptus-dark hover:underline">{a} year old</Link>
                      </th>
                      <td className="px-4 py-3 font-medium">{money(s.nmw.hourly)} <span className="text-warmgray">({money(s.nmw.casualHourly)})</span></td>
                      <td className="px-4 py-3">
                        {money(s.retail.hourly)} <span className="text-warmgray">({money(s.retail.casualHourly)})</span>
                        {a === 20 ? <span className="block text-xs text-warmgray">first 6 months; adult rate after</span> : null}
                      </td>
                      <td className="px-4 py-3">{money(s.fastFood.hourly)} <span className="text-warmgray">({money(s.fastFood.casualHourly)})</span></td>
                      <td className="px-4 py-3">{money(s.hospitality.hourly)} <span className="text-warmgray">({money(s.hospitality.casualHourly)})</span></td>
                    </tr>
                  );
                })}
                <tr className="bg-eucalyptus/5">
                  <th scope="row" className="px-4 py-3 text-left font-medium">
                    <Link href="/minimum-wage-australia/" className="text-eucalyptus-dark hover:underline">{ADULT_AGE} and over</Link>
                  </th>
                  <td className="px-4 py-3 font-medium">{formatAUD(EMPLOYMENT.minimumWageHourly, 2)} <span className="text-warmgray">({formatAUD(byAge("21 and over").casualHourly, 2)})</span></td>
                  <td className="px-4 py-3" colSpan={3}>Full adult rate for the classification</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-warmgray-light">
            No-award figures match the Fair Work Ombudsman&rsquo;s published rates. Award figures are the junior percentage of each award&rsquo;s Level 1 weekly rate divided by {EMPLOYMENT.standardWeeklyHours}; the fast food figures match the award&rsquo;s own Schedule A. 14 and 15 year olds share the under-16 band, and hospitality applies one under-17 rate to 14, 15 and 16 year olds.
          </p>
        </section>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">

            <section id="nmw-junior-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Junior Minimum Wage by Age</h2>
              <p>
                These are the rates for <strong>award and agreement free</strong> employees, set by the {NMW_ORDER.citation} ({NMW_ORDER.reference}). They apply from the first full pay period starting on or after {NMW_ORDER.operativeFrom}.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[34rem] text-left text-sm text-navy">
                    <caption className="sr-only">Junior minimum wage by age from {NMW_ORDER.operativeFrom}</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Age</th>
                        <th scope="col" className="px-5 py-4">% of adult rate</th>
                        <th scope="col" className="px-5 py-4">Hourly</th>
                        <th scope="col" className="px-5 py-4">Casual hourly</th>
                        <th scope="col" className="px-5 py-4">Weekly (38 hrs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {JUNIOR_RATES.map((r) => (
                        <tr key={r.age} className={r.percentage === 1 ? "bg-eucalyptus/5 font-medium" : undefined}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{r.age}</th>
                          <td className="px-5 py-3">{pct1(r.percentage)}</td>
                          <td className="px-5 py-3 font-medium">{formatAUD(r.hourly, 2)}</td>
                          <td className="px-5 py-3">{formatAUD(r.casualHourly, 2)}</td>
                          <td className="px-5 py-3">{formatAUD(r.weekly, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-sm text-warmgray">
                Hourly and casual hourly figures match those published by the Fair Work Ombudsman. <strong>Fair Work publishes no weekly junior column</strong> &mdash; the weekly amounts above are our calculation, being the percentage applied to the {formatAUD(EMPLOYMENT.minimumWageWeekly, 2)} weekly National Minimum Wage.
              </p>
              <p>
                The percentages come from {JUNIOR_BANDS_SOURCE.juniorClause}. The final row is not part of that table: at {ADULT_AGE} an employee simply stops being a junior and moves onto {JUNIOR_BANDS_SOURCE.adultClause}.
              </p>
            </section>

            <section id="which-rate-applies">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Which Junior Rate Actually Applies to You?</h2>
              <p>
                This is the question that matters, and the table above answers it for only a minority of young workers. Most people under {ADULT_AGE} in paid work are in retail, fast food or hospitality &mdash; all award-covered. <strong>An award sets its own junior percentage, and applies it to the award classification rate, not to the National Minimum Wage.</strong> Both numbers change.
              </p>
              <p>
                So there are three questions, in order: does an award cover your job; what classification level are you; and what percentage does that award set for your age. Getting the first one wrong is the expensive mistake.
              </p>
            </section>

            <section id="award-junior-scales">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Junior Rates by Award</h2>
              <p>
                There is no single national junior scale. These three awards cover a large share of young workers and they disagree with each other at almost every age.
              </p>
              {AWARD_JUNIOR_SCALES.map((award) => (
                <div key={award.code}>
                  <h3>{award.award} ({award.code})</h3>
                  <p className="text-sm text-warmgray">{award.clause} &mdash; {award.note}</p>
                  <div className="not-prose my-6">
                    <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                      <table className="w-full min-w-[24rem] text-left text-sm text-navy">
                        <caption className="sr-only">{award.award} junior rates</caption>
                        <thead className="bg-sandstone font-semibold text-navy">
                          <tr>
                            <th scope="col" className="px-5 py-4">Age</th>
                            <th scope="col" className="px-5 py-4">% of adult rate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                          {award.scale.map((band) => (
                            <tr key={band.age}>
                              <th scope="row" className="px-5 py-3 text-left font-medium">{band.age}</th>
                              <td className="px-5 py-3 font-medium">{(band.percentage * 100).toFixed(0)}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}
              <p>
                <strong>Three differences worth knowing.</strong> Retail and fast food pay differently at under-16 &mdash; 45% against 40% &mdash; while matching exactly at 16 through 19. Retail&rsquo;s 20-year-old band splits on service, reaching the adult rate only after more than six months with the same employer, where fast food currently holds 20-year-olds at 90% until they turn 21 (that changes from 1 December 2026 for those with more than six months&rsquo; service; <a href="#pending-change">see below</a>). And Hair and Beauty reaches the full adult rate at 18, the earliest of any common award.
              </p>
              <p>
                Full classification tables are on our <Link href="/retail-award-rates/">retail award rates</Link> and <Link href="/hospitality-award-rates/">hospitality award rates</Link> pages. Hospitality is a fourth scale again, paying 85% at 19 where retail pays 80%, and it has a separate table for office employees.
              </p>
            </section>

            <section id="awards-without-junior-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Some Awards Have No Junior Rates At All</h2>
              <p>
                A junior rate only exists where the instrument covering you actually contains one, and several major awards do not. The <Link href="/schads-award-pay-rates/">SCHADS award</Link> &mdash; social, community, home care and disability services &mdash; has <strong>no junior rates clause</strong>. An 18-year-old disability support worker is entitled to the full adult rate for their classification.
              </p>
              <p>
                Two further limits are easy to miss. Under the retail award, junior percentages apply <strong>only to employee levels 1 to 3</strong>; a junior doing level 4 work is entitled to the full level 4 rate. And in hospitality, juniors with a trade qualification, and any junior working as a liquor service employee, must be paid the adult rate whatever their age.
              </p>
            </section>

            {/* THE 18–20 TRANSITION — determined 26 Aug 2026, operative 1 Dec 2026, and widely misreported */}
            <section id="pending-change">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Are Junior Rates Changing? Yes, for 18 to 20 Year Olds from 1 December 2026</h2>
              <div className="not-prose my-6 rounded-xl border-l-4 border-ochre bg-sandstone p-5">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-ochre" aria-hidden="true" />
                  <div>
                    <h3 className="mb-2 text-base font-bold text-navy">Decided, starting {PENDING_JUNIOR_CHANGE.earliestStart}, and phased in over years</h3>
                    <p className="mb-2 text-sm leading-relaxed text-navy">
                      On {PENDING_JUNIOR_CHANGE.implementationDecidedOn} the Fair Work Commission ({PENDING_JUNIOR_CHANGE.implementationDecision}, following {PENDING_JUNIOR_CHANGE.decision}) varied the {PENDING_JUNIOR_CHANGE.awards.join(", ")} so that 18 to 20-year-olds who have worked for their employer for <strong>more than 6 months</strong> move to the adult rate in stages. The first stage applies from the first full pay period starting on or after <strong>{PENDING_JUNIOR_CHANGE.earliestStart}</strong>. Until then, the current rates on this page apply.
                    </p>
                    <p className="text-sm leading-relaxed text-navy">
                      It is <strong>not a jump to the adult rate</strong>. On {PENDING_JUNIOR_CHANGE.earliestStart} an eligible 19-year-old moves from 80% to 85%, not to 100%. Employees with 6 months or less stay on 70%, 80% and 90%, and rates for under-18s do not change.
                    </p>
                  </div>
                </div>
              </div>
              {(["retail", "fastFood", "pharmacy"] as const).map((k) => {
                const sch = JUNIOR_TRANSITION_SCHEDULES[k];
                return (
                  <div key={k} className="not-prose my-6">
                    <h3 className="mb-2 text-lg font-bold text-navy">{sch.award} ({sch.determination})</h3>
                    <p className="mb-3 text-sm text-warmgray">{sch.appliesTo}. Employees with more than 6 months&rsquo; service, % of the adult rate.</p>
                    <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                      <table className="w-full min-w-[30rem] text-left text-sm text-navy">
                        <caption className="sr-only">{sch.award} junior rate transition, {sch.determination}</caption>
                        <thead className="bg-sandstone font-semibold text-navy">
                          <tr>
                            <th scope="col" className="px-5 py-4">From first full pay period on or after</th>
                            <th scope="col" className="px-5 py-4">Age 18</th>
                            <th scope="col" className="px-5 py-4">Age 19</th>
                            <th scope="col" className="px-5 py-4">Age 20</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                          <tr className="bg-sandstone/40">
                            <th scope="row" className="px-5 py-3 text-left font-medium">Now (to 30 November 2026)</th>
                            <td className="px-5 py-3">{sch.present.age18}%</td>
                            <td className="px-5 py-3">{sch.present.age19}%</td>
                            <td className="px-5 py-3">{sch.present.age20}%</td>
                          </tr>
                          {sch.rows.map((row) => (
                            <tr key={row.effective}>
                              <th scope="row" className="px-5 py-3 text-left font-medium">{row.effective}</th>
                              <td className="px-5 py-3">{row.age18}%</td>
                              <td className="px-5 py-3">{row.age19}%</td>
                              <td className="px-5 py-3">{row.age20}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
              <p className="text-sm text-warmgray">
                Retail 20-year-olds with more than 6 months&rsquo; service already receive the adult rate, so the retail change affects 18 and 19-year-olds only. Pharmacy follows a different, annual schedule agreed by the union and the Pharmacy Guild. {PENDING_JUNIOR_CHANGE.transferOfBusinessNote}
              </p>
              <p>
                In the determinations&rsquo; own words: &ldquo;{PENDING_JUNIOR_CHANGE.operativeWording}&rdquo;
              </p>
              <p>
                The change does not touch the National Minimum Wage junior scale or the hospitality award.
              </p>
            </section>

            <section id="minimum-working-age">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Minimum Working Age by State</h2>
              <p>
                <strong>There is no national minimum working age.</strong> It is set by each state and territory, and the differences are large. Separately from any of this, every jurisdiction prohibits work during school hours for children of compulsory school age.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[34rem] text-left text-sm text-navy">
                    <caption className="sr-only">Minimum working age by state and territory</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">State or territory</th>
                        <th scope="col" className="px-5 py-4">Minimum age</th>
                        <th scope="col" className="px-5 py-4">Detail</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {MINIMUM_WORKING_AGE.map((j) => (
                        <tr key={j.jurisdiction}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">
                            <a href={j.url} target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">{j.jurisdiction}</a>
                          </th>
                          <td className="px-5 py-3 font-medium">{j.summary}</td>
                          <td className="px-5 py-3 text-warmgray">{j.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray-light">Each state name links to that jurisdiction&rsquo;s own government page.</p>
              </div>
              <p>
                You will often see it said that the standard minimum working age in Australia is 15. <strong>No government page states that.</strong> It appears only in media and secondary sources, and it is wrong for at least six of the eight jurisdictions above.
              </p>
              <div className="not-prose mt-6">
                <a href="https://www.fairwork.gov.au/find-help-for/young-workers-and-students/minimum-working-age" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md border border-transparent bg-eucalyptus-dark px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-navy">
                  Fair Work &mdash; minimum working age
                  <ExternalLink className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </section>

            <section id="how-calculated">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Junior Rates Are Calculated</h2>
              <p>
                The percentage is applied to the <strong>weekly</strong> rate, and the hourly figure is that weekly amount divided by {EMPLOYMENT.standardWeeklyHours} ordinary hours. The order is not cosmetic. Applying the percentage to the hourly minimum instead gives a figure one cent lower at ages 17, 19 and 20 &mdash; for a 19-year-old working 20 hours a week that is about {formatAUD(0.01 * 20 * 52, 0)} a year, and it is the difference between matching Fair Work&rsquo;s published figure and not.
              </p>
              <p>
                The casual rate is then the <strong>rounded</strong> junior hourly rate plus the {(CASUAL_LOADING * 100).toFixed(0)}% loading. At 19 that gives {formatAUD(byAge("19").casualHourly, 2)}; deriving it from the unrounded figure would give a cent less. Every hourly and casual figure in the first table matches Fair Work&rsquo;s published dollars exactly, and automated tests hold them there.
              </p>
              <p>
                To see what a junior rate leaves after tax, use our <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> &mdash; most junior earnings fall under the {formatAUD(18_200)} tax-free threshold, so the answer is often that no income tax is withheld at all. Our <Link href="/first-job-pay-guide/">first job guide</Link> covers tax file numbers, super and reading your first payslip.
              </p>
            </section>

            <section id="related">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Guides</h2>
              <ul>
                <li><Link href="/retail-award-rates/">Retail Award Rates</Link> &mdash; full classification table and junior percentages</li>
                <li><Link href="/hospitality-award-rates/">Hospitality Award Rates</Link> &mdash; a fourth junior scale, plus office employees</li>
                <li><Link href="/schads-award-pay-rates/">SCHADS Award Pay Rates</Link> &mdash; the award with no junior rates</li>
                <li><Link href="/first-job-pay-guide/">First Job Pay Guide</Link> &mdash; TFN, super and your first payslip</li>
                <li><Link href="/award-rates/">Award Rates Australia</Link> &mdash; how modern awards work</li>
                <li><Link href="/minimum-wage-australia/">Minimum Wage Australia</Link> &mdash; the adult rate from {ADULT_AGE}, weekly, annual and after tax</li>
                <li><Link href="/casual-loading-calculator/">Casual Loading Calculator</Link> &mdash; what the 25% loading is worth against paid leave</li>
                <li><Link href="/minimum-wage-history-australia/">Minimum Wage History</Link> &mdash; how the National Minimum Wage has moved</li>
              </ul>
            </section>

            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              {/* Crawlable mirror — the Radix accordion unmounts closed content. */}
              <div className="sr-only">
                <h3>Junior pay rate questions and answers</h3>
                {JUNIOR_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {JUNIOR_FAQS.map((f) => (
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
                  Junior percentages come from the {NMW_ORDER.citation} ({NMW_ORDER.reference}, made {NMW_ORDER.madeOn}), read from the order itself. The {JUNIOR_ONLY.length} junior bands are set by {JUNIOR_BANDS_SOURCE.juniorClause}; the adult row comes from {JUNIOR_BANDS_SOURCE.adultClause}. Award scales are quoted from the consolidated award texts.
                </p>
                <p>
                  Hourly and casual figures are regression-tested against the twelve dollar amounts the Fair Work Ombudsman publishes, so a rounding change cannot pass silently. Weekly junior amounts are our own derivation and labelled as such, because Fair Work publishes no weekly junior column. The 18 to 20-year-old transition schedules are transcribed from the three determinations themselves ({JUNIOR_TRANSITION_SCHEDULES.retail.determination}, {JUNIOR_TRANSITION_SCHEDULES.fastFood.determination} and {JUNIOR_TRANSITION_SCHEDULES.pharmacy.determination}, made {PENDING_JUNIOR_CHANGE.implementationDecidedOn}) and shown as future rates until they take effect. Minimum working ages are taken from each jurisdiction&rsquo;s own government page.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("junior-pay-rates"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
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
                      { href: "/hospitality-award-rates/", label: "Hospitality Award Rates" },
                      { href: "/schads-award-pay-rates/", label: "SCHADS Award Pay Rates" },
                      { href: "/overtime-penalty-rates-guide/", label: "Penalty Rates" },
                      { href: "/first-job-pay-guide/", label: "First Job Pay Guide" },
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
                  <h2 className="mb-2 text-lg font-bold">First job?</h2>
                  <p className="mb-4 text-sm text-eucalyptus-light">
                    Most junior earnings sit under the {formatAUD(18_200)} tax-free threshold, so no income tax is withheld. Check yours.
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

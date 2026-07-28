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
import { SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import {
  SCHADS_AWARD,
  SCHADS_ALLOWANCES,
  SCHADS_HOME_CARE_AGED,
  SCHADS_HOME_CARE_DISABILITY,
  SCHADS_PENALTIES,
  SCHADS_SACS,
  SCHADS_UNVERIFIED,
  type SchadsRate,
} from "@/lib/constants/schads-award";
import { SCHADS_FAQS, schadsCasualHourly } from "@/modules/guide/schads-award-faqs";

const SOURCES_LIST: SourceLink[] = [
  { title: `Pay guide — ${SCHADS_AWARD.name} (${SCHADS_AWARD.code})`, url: "https://www.fairwork.gov.au/employment-conditions/awards/awards-summary/ma000100-summary", publisher: SOURCES.fwo.name },
  { title: `Consolidated award text ${SCHADS_AWARD.code}`, url: SCHADS_AWARD.awardTextUrl, publisher: SOURCES.fwo.name },
  { title: `Equal Remuneration Order ${SCHADS_AWARD.eroReference}`, url: "https://www.fwc.gov.au/equal-remuneration-case", publisher: SOURCES.fwc.name },
  { title: `Annual Wage Review 2026 — ${SCHADS_AWARD.decision}`, url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews", publisher: SOURCES.fwc.name },
];

function find(rows: readonly SchadsRate[], classification: string): SchadsRate {
  const found = rows.find((r) => r.classification === classification);
  if (!found) throw new Error(`unknown SCHADS classification: ${classification}`);
  return found;
}

const L1 = find(SCHADS_SACS, "Level 1 pay point 1");
const L1_TOP = find(SCHADS_SACS, "Level 1 pay point 3");
const L2 = find(SCHADS_SACS, "Level 2 pay point 1");
const L4 = find(SCHADS_SACS, "Level 4 pay point 1");
const L8 = find(SCHADS_SACS, "Level 8 pay point 3");

/** The pre-ERO clause 15 figure, shown only so it can be corrected. */
const CLAUSE_15_LEVEL_4 = 1_344.5;
const ERO_UPLIFT_PCT = ((L4.weekly / CLAUSE_15_LEVEL_4 - 1) * 100).toFixed(0);

const PCT = (v: number) => `${(v * 100).toFixed(v * 100 % 1 === 0 ? 0 : 1)}%`;

/** Rate table shared by all three schedules. */
function RateTable({ rows, caption }: { rows: readonly SchadsRate[]; caption: string }) {
  return (
    <div className="not-prose my-6">
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full min-w-[34rem] text-left text-sm text-navy">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-5 py-4">Classification</th>
              <th scope="col" className="px-5 py-4">Weekly (38 hrs)</th>
              <th scope="col" className="px-5 py-4">Hourly</th>
              <th scope="col" className="px-5 py-4">Casual hourly (+{PCT(SCHADS_AWARD.casualLoading)})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {rows.map((r) => (
              <tr key={r.classification}>
                <th scope="row" className="px-5 py-3 text-left font-medium">{r.classification}</th>
                <td className="px-5 py-3">{formatAUD(r.weekly, 2)}</td>
                <td className="px-5 py-3 font-medium">{formatAUD(r.hourly, 2)}</td>
                <td className="px-5 py-3">{formatAUD(schadsCasualHourly(r.hourly), 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function SchadsAwardPayRatesPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/award-rates/" className="hover:text-eucalyptus-dark hover:underline">Award Rates</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">SCHADS Award Pay Rates</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            SCHADS Award Pay Rates {SITE_CONFIG.financialYear}
          </h1>
          <p className="mb-5 text-xl leading-relaxed text-warmgray">
            Every current classification rate under the {SCHADS_AWARD.name} ({SCHADS_AWARD.code}) &mdash; social and community services, home care and disability support &mdash; operative from {SCHADS_AWARD.operativeFrom}.
          </p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> Social and community services rates run from <strong>{formatAUD(L1.weekly, 2)}</strong> a week ({formatAUD(L1.hourly, 2)}/hr) at Level 1 pay point 1 to <strong>{formatAUD(L8.weekly, 2)}</strong> a week ({formatAUD(L8.hourly, 2)}/hr) at Level 8 pay point 3. The widely quoted Level 4 rate is <strong>{formatAUD(L4.weekly, 2)}</strong> a week, or {formatAUD(L4.hourly, 2)} an hour &mdash; not the {formatAUD(CLAUSE_15_LEVEL_4, 2)} printed in clause 15, which omits the Equal Remuneration Order.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">

            {/* THE ERO — the single most consequential thing on this page */}
            <section id="equal-remuneration-order">
              <div className="not-prose my-6 rounded-xl border-l-4 border-ochre bg-sandstone p-5">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-ochre" aria-hidden="true" />
                  <div>
                    <h2 className="mb-2 text-base font-bold text-navy">Read this before you compare your payslip</h2>
                    <p className="mb-2 text-sm leading-relaxed text-navy">
                      If you open the SCHADS award text and read clause 15, Level 4 pay point 1 says <strong>{formatAUD(CLAUSE_15_LEVEL_4, 2)}</strong> a week. That is not the rate you are owed. Equal Remuneration Order <strong>{SCHADS_AWARD.eroReference}</strong> applies on top for social and community services and crisis accommodation classifications, and the award&rsquo;s own note confirms the ERO rates &ldquo;form employees&rsquo; ordinary rates of pay for all purposes&rdquo;.
                    </p>
                    <p className="mb-2 text-sm leading-relaxed text-navy">
                      The operative rate is <strong>{formatAUD(L4.weekly, 2)}</strong> &mdash; <strong>{ERO_UPLIFT_PCT}% higher</strong>, a difference of {formatAUD(L4.weekly - CLAUSE_15_LEVEL_4, 2)} a week or about {formatAUD((L4.weekly - CLAUSE_15_LEVEL_4) * 52, 0)} a year.
                    </p>
                    <p className="text-sm leading-relaxed text-navy">
                      <strong>The ERO tables begin at Level {SCHADS_AWARD.eroLowestLevel}.</strong> Level 1 has no ERO row and receives no uplift, so its rates below are the plain clause 15 minimums &mdash; which are also the operative rates. Levels {SCHADS_AWARD.eroLowestLevel} to 8 are ERO-inclusive.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section id="sacs-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Social and Community Services Pay Rates (Schedule B)</h2>
              <p>
                This is the stream most people mean by &ldquo;SCHADS rates&rdquo;. It covers social workers, case managers, community development workers, youth workers and most disability support work delivered outside the home. Levels {SCHADS_AWARD.eroLowestLevel} to 8 carry the Equal Remuneration Order; Level 1 does not.
              </p>
              <RateTable rows={SCHADS_SACS} caption={`SCHADS social and community services pay rates from ${SCHADS_AWARD.operativeFrom}`} />
              <p className="text-sm text-warmgray">
                Weekly rates are as published by the Fair Work Ombudsman. Hourly is the weekly rate divided by {SCHADS_AWARD.standardWeeklyHours} ordinary hours. The casual column is the ordinary hourly rate plus the {PCT(SCHADS_AWARD.casualLoading)} casual loading.
              </p>

              <h3>Why Level 1 to Level 2 jumps so far</h3>
              <p>
                Level 1 pay point 3 is {formatAUD(L1_TOP.weekly, 2)} a week. Level 2 pay point 1 is {formatAUD(L2.weekly, 2)} &mdash; a step of {formatAUD(L2.weekly - L1_TOP.weekly, 2)} between adjacent classifications, far larger than any other gap in the table. It is not a typo. <strong>Level 1 receives no ERO uplift and Level 2 does.</strong> That single fact is why arguing your classification is worth more here than in most awards.
              </p>

              <h3>Watch out: {formatAUD(L1_TOP.weekly, 2)} means two different things</h3>
              <p>
                The same figure appears twice in this award with a {formatAUD(L2.weekly - L1_TOP.weekly, 0)}-a-week difference in meaning. {formatAUD(L1_TOP.weekly, 2)} is the <strong>operative rate</strong> for Level 1 pay point 3. It is also the <strong>pre-ERO clause 15 figure</strong> for Level 2 pay point 1 &mdash; which becomes {formatAUD(L2.weekly, 2)} once the Equal Remuneration Order is applied.
              </p>
              <p>
                So if you are a Level 2 and your payslip shows {formatAUD(L1_TOP.weekly, 2)}, you are being paid a Level 1 rate under a Level 2 classification. This is the single likeliest way a SCHADS pay table goes wrong, and it is worth {formatAUD((L2.weekly - L1_TOP.weekly) * 52, 0)} a year.
              </p>
            </section>

            <section id="home-care-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Home Care Pay Rates (Schedules E and F)</h2>
              <p>
                Home care is paid under different schedules with <strong>no ERO uplift</strong>, so the rates are materially lower than the social and community services table above. Being classified into the wrong schedule is one of the more expensive errors in this award.
              </p>

              <h3>Home care &mdash; disability care (Schedule E)</h3>
              <RateTable rows={SCHADS_HOME_CARE_DISABILITY} caption="SCHADS home care disability care pay rates" />

              <h3>Home care &mdash; aged care (Schedule F)</h3>
              <p>This schedule has no pay points; each level is a single rate.</p>
              <RateTable rows={SCHADS_HOME_CARE_AGED} caption="SCHADS home care aged care pay rates" />
            </section>

            <section id="penalty-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>SCHADS Penalty Rates</h2>
              <p>
                Penalty rates are expressed as a percentage of the ordinary rate for your classification. The dollar column below uses Level 4 pay point 1 ({formatAUD(L4.hourly, 2)}/hr) as the worked example.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[34rem] text-left text-sm text-navy">
                    <caption className="sr-only">SCHADS penalty rates for permanent and casual employees</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">When worked</th>
                        <th scope="col" className="px-5 py-4">Permanent</th>
                        <th scope="col" className="px-5 py-4">Casual</th>
                        <th scope="col" className="px-5 py-4">Permanent $ on {formatAUD(L4.hourly, 2)}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {[
                        { label: "Saturday", perm: SCHADS_PENALTIES.saturday, cas: SCHADS_PENALTIES.casualSaturday },
                        { label: "Sunday", perm: SCHADS_PENALTIES.sunday, cas: SCHADS_PENALTIES.casualSunday },
                        { label: "Public holiday", perm: SCHADS_PENALTIES.publicHoliday, cas: SCHADS_PENALTIES.casualPublicHoliday },
                      ].map((row) => (
                        <tr key={row.label}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{row.label}</th>
                          <td className="px-5 py-3 font-medium">{PCT(row.perm)}</td>
                          <td className="px-5 py-3 font-medium">{PCT(row.cas)}</td>
                          <td className="px-5 py-3">{formatAUD(L4.hourly * row.perm, 2)}</td>
                        </tr>
                      ))}
                      <tr>
                        <th scope="row" className="px-5 py-3 text-left font-medium">Afternoon shift loading</th>
                        <td className="px-5 py-3 font-medium">+{PCT(SCHADS_PENALTIES.afternoonShiftLoading)}</td>
                        <td className="px-5 py-3 text-warmgray">&mdash;</td>
                        <td className="px-5 py-3">{formatAUD(L4.hourly * (1 + SCHADS_PENALTIES.afternoonShiftLoading), 2)}</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-5 py-3 text-left font-medium">Night shift loading</th>
                        <td className="px-5 py-3 font-medium">+{PCT(SCHADS_PENALTIES.nightShiftLoading)}</td>
                        <td className="px-5 py-3 text-warmgray">&mdash;</td>
                        <td className="px-5 py-3">{formatAUD(L4.hourly * (1 + SCHADS_PENALTIES.nightShiftLoading), 2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                <strong>Two rules that change the arithmetic.</strong> First, {SCHADS_PENALTIES.substitutionNote.charAt(0).toLowerCase() + SCHADS_PENALTIES.substitutionNote.slice(1)} You do not add a night loading to a Sunday rate. Second, public holiday payment replaces both the weekend rate and any shift loading.
              </p>
              <p>
                A note on wording: the award does not say &ldquo;{PCT(SCHADS_PENALTIES.publicHoliday)}&rdquo; for public holidays. Clause 34.2(a) says <strong>&ldquo;{SCHADS_AWARD.publicHolidayAwardWording}&rdquo;</strong>. The percentage is the arithmetic, and the two agree &mdash; but if you are quoting the award in a pay dispute, quote the phrase.
              </p>
              <p>
                <strong>Casual penalties are additive, not compounded.</strong> Casual Sunday is {PCT(SCHADS_PENALTIES.casualSunday)} of the base rate &mdash; the {PCT(SCHADS_PENALTIES.sunday)} Sunday rate plus the {PCT(SCHADS_AWARD.casualLoading)} loading. It is not {PCT(SCHADS_PENALTIES.sunday)} multiplied by {(1 + SCHADS_AWARD.casualLoading).toFixed(2)}, which would give {PCT(SCHADS_PENALTIES.sunday * (1 + SCHADS_AWARD.casualLoading))}. Compounding is the most common overpayment error in SCHADS payroll, and the most common basis for a disputed underpayment claim in the other direction.
              </p>
              <p>
                For how penalty rates work across other awards, see our <Link href="/overtime-penalty-rates-guide/">penalty rates guide</Link>.
              </p>
            </section>

            <section id="allowances">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>SCHADS Allowances</h2>
              <p>
                SCHADS carries more allowances than most awards, and they are where underpayment usually hides. These apply from {SCHADS_AWARD.operativeFrom}.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[30rem] text-left text-sm text-navy">
                    <caption className="sr-only">SCHADS allowances from {SCHADS_AWARD.operativeFrom}</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Allowance</th>
                        <th scope="col" className="px-5 py-4">Amount</th>
                        <th scope="col" className="px-5 py-4">Basis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {[
                        { l: "Sleepover", v: SCHADS_ALLOWANCES.sleepover, b: "per sleepover (cl 25.7(d))" },
                        { l: "Broken shift — one unpaid break", v: SCHADS_ALLOWANCES.brokenShiftOneBreak, b: "per shift" },
                        { l: "Broken shift — two unpaid breaks", v: SCHADS_ALLOWANCES.brokenShiftTwoBreaks, b: "per shift" },
                        { l: "On call — weekday", v: SCHADS_ALLOWANCES.onCallWeekday, b: "per 24-hour period" },
                        { l: "On call — weekend or public holiday", v: SCHADS_ALLOWANCES.onCallOtherOrPublicHoliday, b: "per 24-hour period" },
                        { l: "First aid", v: SCHADS_ALLOWANCES.firstAidWeekly, b: `per week (${formatAUD(SCHADS_ALLOWANCES.firstAidHourly, 2)}/hr for casuals)` },
                        { l: "Meal — when working overtime", v: SCHADS_ALLOWANCES.mealOvertime, b: "per occasion" },
                        { l: "Uniform", v: SCHADS_ALLOWANCES.uniformPerShift, b: `per shift, capped at ${formatAUD(SCHADS_ALLOWANCES.uniformWeeklyMax, 2)}/week` },
                        { l: "Laundry", v: SCHADS_ALLOWANCES.laundryPerShift, b: `per shift, capped at ${formatAUD(SCHADS_ALLOWANCES.laundryWeeklyMax, 2)}/week` },
                        { l: "Vehicle — own car on duty", v: SCHADS_ALLOWANCES.vehiclePerKm, b: "per kilometre" },
                      ].map((row) => (
                        <tr key={row.l}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{row.l}</th>
                          <td className="px-5 py-3 font-medium">{formatAUD(row.v, 2)}</td>
                          <td className="px-5 py-3 text-warmgray">{row.b}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The sleepover allowance pays for the sleepover itself. <strong>If you are woken and required to work, those hours are paid separately</strong> at the rate applying at that time &mdash; the allowance does not buy the employer any working time.
              </p>
            </section>

            <section id="no-junior-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Does SCHADS Have Junior Rates?</h2>
              <p>
                <strong>No.</strong> The SCHADS award contains no junior rates clause and no age-based percentage scale. An employee under 21 covered by this award is paid the <strong>full adult rate</strong> for their classification.
              </p>
              <p>
                This is worth stating plainly because age-percentage tables are routinely attributed to SCHADS in circulation, and they are not in the award. If you have been shown one, the question to ask is which award actually covers the role &mdash; not what percentage applies. Awards that genuinely do set junior rates, and the percentages they use, are set out in our <Link href="/junior-pay-rates/">junior pay rates guide</Link>.
              </p>
              <p>
                The one age-linked route into SCHADS pay is the National Training Wage: clause 19.2 does not set trainee rates itself but incorporates {SCHADS_AWARD.traineeRatesSource}. Those rates vary with age and schooling completed. We have not verified them, so they are listed as a gap below rather than reproduced.
              </p>

              <h3>And there is no separate disability services rate</h3>
              <p>
                There is no standalone disability services pay stream in SCHADS. The old clause 17 was deleted in 2010. Disability support work sits in either the social and community services stream (Schedule B) or the home care stream (Schedule E) where it is delivered in the home. Which applies turns on the work performed, not on the employer&rsquo;s name or funding source.
              </p>
            </section>

            <section id="not-covered">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What This Page Does Not Cover</h2>
              <p>
                These parts of SCHADS carry rates we have not verified against a primary source, so we do not publish figures for them. Check them directly with Fair Work rather than inferring from the tables above:
              </p>
              <ul>
                {SCHADS_UNVERIFIED.map((item) => (<li key={item}>{item}</li>))}
              </ul>
              <p>
                Two of these matter more than they look. <strong>Queensland non-constitutional corporations</strong> are explicitly excluded from the Fair Work pay guide and may sit under separate transitional pay equity orders. And <strong>Schedule G translation rates</strong> affect home care aged-care employees covered on or before 31 December 2024, so long-serving staff may be on a different rate to a new starter doing identical work.
              </p>
              <div className="not-prose mt-6">
                <a href={SCHADS_AWARD.awardTextUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md border border-transparent bg-eucalyptus-dark px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-navy">
                  Read the full {SCHADS_AWARD.code} award text
                  <ExternalLink className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </section>

            <section id="when-rates-changed">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When These Rates Took Effect</h2>
              <p>
                The Annual Wage Review {SCHADS_AWARD.decision} lifted modern award minimum rates by {(SCHADS_AWARD.increase * 100).toFixed(2)}%, given effect for SCHADS by determination {SCHADS_AWARD.determination}. The Fair Work Ombudsman published the updated pay guide on {SCHADS_AWARD.payGuidePublished}.
              </p>
              <p>
                <strong>{SCHADS_AWARD.effectiveNote}</strong> If your pay period began before {SCHADS_AWARD.operativeFrom}, the previous rate lawfully applies to that entire period and the increase starts with the next one. This is the most common reason a July payslip looks wrong when it is not. If you think you have been underpaid across a longer stretch, our <Link href="/backpay-calculator/">backpay calculator</Link> works out what is owed.
              </p>
            </section>

            <section id="related">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Guides</h2>
              <ul>
                <li><Link href="/award-rates/">Award Rates Australia</Link> &mdash; how modern awards work and which one covers you</li>
                <li><Link href="/junior-pay-rates/">Junior Pay Rates</Link> &mdash; the awards that do set age-based rates, and the percentages</li>
                <li><Link href="/overtime-penalty-rates-guide/">Penalty Rates</Link> &mdash; weekend, evening and public holiday loadings across awards</li>
                <li><Link href="/healthcare-worker-pay/">Healthcare Worker Pay</Link> &mdash; nurses, doctors and allied health</li>
                <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> &mdash; convert your award rate to net pay after tax</li>
                <li><Link href="/backpay-calculator/">Backpay Calculator</Link> &mdash; what you are owed if you have been underpaid</li>
              </ul>
            </section>

            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              {/*
                The Radix accordion unmounts closed content, so answers never
                reach the rendered HTML. This mirror makes them crawlable and
                AI-Overview eligible. Gap analysis §A4.
              */}
              <div className="sr-only">
                <h3>SCHADS award pay rate questions and answers</h3>
                {SCHADS_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {SCHADS_FAQS.map((f) => (
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
                  Every rate on this page comes from a single constants file checked against two independent Fair Work artefacts that agree to the cent: the Fair Work Ombudsman pay guide for {SCHADS_AWARD.code} effective {SCHADS_AWARD.operativeFrom}, published {SCHADS_AWARD.payGuidePublished}, and the consolidated award text. Hourly rates are the published weekly rate divided by {SCHADS_AWARD.standardWeeklyHours}; casual rates add the {PCT(SCHADS_AWARD.casualLoading)} loading to the ordinary hourly rate.
                </p>
                <p>
                  Social and community services rates at Level {SCHADS_AWARD.eroLowestLevel} and above are <strong>Equal Remuneration Order inclusive</strong>, matching the pay guide rather than the bare clause 15 table; Level 1 has no ERO row in the award and is shown at its clause 15 rate. Automated tests assert where the ERO begins, that hourly reconciles to weekly across all {SCHADS_SACS.length} classifications, and that the award contains no junior rates clause. Classifications we could not verify are listed above as gaps rather than estimated.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("schads-award-pay-rates"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
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
                      { href: "/retail-award-rates/", label: "Retail Award Rates" },
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
                  <h2 className="mb-2 text-lg font-bold">What you actually take home</h2>
                  <p className="mb-4 text-sm text-eucalyptus-light">
                    Level 4 pay point 1 is {formatAUD(L4.weekly, 2)} a week before tax. See what lands in your account after income tax, Medicare and super.
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

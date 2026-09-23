"use client";

// One template for the data-driven award pages. The page is the award's
// constants rendered in the order a worker checking their pay needs them:
// rate by level → the pay-guide matrix for their employment type → penalties
// → overtime → juniors → allowances → what is not covered.
//
// Adding an award = constants in lib/constants/modern-awards.ts + copy in
// modern-award-content.ts + a thin app/ route. No per-award JSX.

import Link from "next/link";
import { AlertTriangle, ChevronRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import {
  JUNIOR_PHASE_IN,
  MODERN_AWARDS,
  findAwardRate,
  roundCents,
  type ModernAwardKey,
  type PenaltyRow,
} from "@/lib/constants/modern-awards";
import { AwardRateTable, JuniorScaleTable } from "@/modules/guide/award-rate-table";
import {
  AllowanceTable,
  AwardDirectorySidebar,
  JuniorPhaseInTable,
  PayGuideMatrix,
  PrintButton,
  TakeHomeLinks,
} from "@/modules/guide/award-page-parts";
import { getAwardPageCopy } from "@/modules/guide/modern-award-content";
import { PublicHolidayRowLink } from "./public-holiday-shared"; // G4

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

const pct = (v: number) => {
  const p = Math.round(v * 1000) / 10;
  return `${p % 1 === 0 ? p.toFixed(0) : p.toFixed(1)}%`;
};

export default function ModernAwardRatesPage({ awardKey }: { awardKey: ModernAwardKey }) {
  const award = MODERN_AWARDS[awardKey];
  const copy = getAwardPageCopy(awardKey);
  const { meta } = award;
  const entry = findAwardRate(award, award.entryLevel);
  const loading = meta.casualLoading;
  const compounded = award.casualPenaltyBasis === "compounded";
  const casualEntry = roundCents(entry.hourly * (1 + loading));
  const phaseIn =
    award.juniorPhaseIn === "pharmacy" ? JUNIOR_PHASE_IN.pharmacy : award.juniorPhaseIn === "fast-food-retail" ? JUNIOR_PHASE_IN.fastFood : null;
  const juniorBase = award.junior?.baseLevel ? findAwardRate(award, award.junior.baseLevel) : entry;

  const penaltyDollar = (mult: number, casual: boolean) =>
    casual && compounded ? roundCents(casualEntry * mult) : roundCents(entry.hourly * mult);
  const partTimeLoading = meta.partTimeLoading;
  const hasPartTime = award.penalties.some((p) => p.partTime !== undefined);
  // A penalty row limited to some classifications is priced on the entry
  // level if it is one of them, otherwise on the first classification it covers.
  const rowBase = (p: PenaltyRow) =>
    p.appliesTo && !p.appliesTo.includes(entry.level) ? findAwardRate(award, p.appliesTo[0]) : entry;
  const rowDollar = (p: PenaltyRow, col: "fullTime" | "partTime" | "casual") => {
    const base = rowBase(p);
    const flat = p.flatPerHour ?? 0;
    if (col === "casual") {
      const basis = p.casualBasis ?? award.casualPenaltyBasis;
      const v = basis === "compounded" ? roundCents(base.hourly * (1 + loading)) * p.casual : base.hourly * p.casual;
      return roundCents(v + flat);
    }
    const mult = col === "partTime" ? (p.partTime ?? p.fullTime) : p.fullTime;
    return roundCents(base.hourly * mult + flat);
  };
  const rowPct = (v: number, p: PenaltyRow) => `${pct(v)}${p.flatPerHour ? ` + ${formatAUD(p.flatPerHour, 2)}/hr` : ""}`;
  const juniorHourlyBasis = award.junior?.basis === "hourly";

  const sources: SourceLink[] = [
    { title: `Consolidated award text — ${meta.name} (${meta.code})`, url: meta.awardTextUrl, publisher: SOURCES.fwc.name },
    { title: `Award summary and pay guide — ${meta.code}`, url: meta.summaryUrl, publisher: SOURCES.fwo.name },
    { title: "Annual Wage Review 2026", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews", publisher: SOURCES.fwc.name },
    ...(phaseIn
      ? [{ title: `Junior rates determination ${phaseIn.determination} ([2026] FWCFB 222)`, url: `https://www.fwc.gov.au/documents/awardsandorders/pdf/${phaseIn.determination.toLowerCase()}.pdf`, publisher: SOURCES.fwc.name }]
      : []),
  ];

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/award-rates/" className="hover:text-eucalyptus-dark hover:underline">Award Rates</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">{copy.crumb}</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={H2}>
            {copy.h1}
          </h1>
          <p className="mb-5 text-xl leading-relaxed text-warmgray">{copy.standfirst}</p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> {copy.directAnswer}
            </p>
          </div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <PrintButton label="Print this pay guide / save as PDF" />
            <span className="text-sm text-warmgray">Award code {meta.code} &middot; rates from {meta.operativeFrom}</span>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="rates">
              <h2 style={H2}>{meta.shortName} Pay Rates by Level</h2>
              {partTimeLoading !== undefined ? (
                <p>
                  Adult minimum rates under the {meta.name}. Unusually, this award pays part-time employees more per hour than full-timers: a {pct(partTimeLoading)} part-time allowance on every ordinary hour ({meta.partTimeLoadingClause}). The casual column adds the {pct(loading)} loading ({meta.casualLoadingClause}).
                </p>
              ) : (
                <p>
                  Adult minimum rates for full-time and part-time employees under the {meta.name}. Part-time employees are paid the same hourly rate as full-time employees at their classification &mdash; the difference is hours, not rate. The casual column adds the {pct(loading)} loading ({meta.casualLoadingClause}).
                </p>
              )}
              <AwardRateTable
                rows={award.rates}
                casualLoading={loading}
                partTimeLoading={partTimeLoading}
                caption={`${meta.shortName} adult pay rates from ${meta.operativeFrom}`}
              />
              <p className="text-sm text-warmgray">
                {meta.hourlyDerivation ??
                  `Weekly rates are the award’s minimum weekly rate for a full-time employee (${award.ratesClause}); hourly is the weekly rate divided by ${meta.standardWeeklyHours}.`}
              </p>
              {award.classificationNotes.length > 0 && (
                <>
                  <h3>Which level am I?</h3>
                  <ul>
                    {award.classificationNotes.map((c) => (
                      <li key={c.level}><strong>{c.level}:</strong> {c.description}</li>
                    ))}
                  </ul>
                </>
              )}
            </section>

            {copy.trap && (
              <section id="read-first">
                <div className="not-prose my-6 rounded-xl border-l-4 border-ochre bg-sandstone p-5">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="mt-0.5 h-6 w-6 flex-shrink-0 text-ochre" aria-hidden="true" />
                    <div>
                      <h2 className="mb-2 text-base font-bold text-navy">{copy.trap.heading}</h2>
                      <p className="text-sm leading-relaxed text-navy">{copy.trap.body}</p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {copy.related && (
              <section id="related-pay">
                <h2 style={H2}>{copy.related.heading}</h2>
                {copy.related.body.map((para) => (<p key={para}>{para}</p>))}
                <ul>
                  {copy.related.links.map((l) => (
                    <li key={l.href}><Link href={l.href}>{l.label}</Link>{l.note ? <> &mdash; {l.note}</> : null}</li>
                  ))}
                </ul>
              </section>
            )}

            <section id="pay-guide">
              <h2 style={H2}>{meta.shortName} Pay Guide {SITE_CONFIG.financialYear}: Every Level, Every Day</h2>
              <p>
                The hourly rate for each classification at each penalty band, in the layout of the Fair Work pay guide. Find your level, then the day you worked.
              </p>
              <h3>{partTimeLoading !== undefined ? "Full-time" : "Full-time and part-time"}</h3>
              <PayGuideMatrix
                rows={award.rates}
                columns={award.matrix}
                employment="permanent"
                casualLoading={loading}
                basis={award.casualPenaltyBasis}
                caption={`${meta.shortName} ${partTimeLoading !== undefined ? "full-time" : "full-time and part-time"} hourly rates by day`}
              />
              {partTimeLoading !== undefined && (
                <>
                  <h3>Part-time</h3>
                  <PayGuideMatrix
                    rows={award.rates}
                    columns={award.matrix}
                    employment="part-time"
                    casualLoading={loading}
                    basis={award.casualPenaltyBasis}
                    caption={`${meta.shortName} part-time hourly rates by day`}
                  />
                </>
              )}
              <h3>Casual</h3>
              <PayGuideMatrix
                rows={award.rates}
                columns={award.matrix}
                employment="casual"
                casualLoading={loading}
                basis={award.casualPenaltyBasis}
                caption={`${meta.shortName} casual hourly rates by day`}
              />
              <p className="text-sm text-warmgray">
                {award.casualRuleSummary
                  ? "Casual columns marked “of casual rate” apply the percentage to the casual hourly rate; the others are a percentage of the minimum rate that already includes the loading."
                  : compounded
                    ? `Casual figures apply each percentage to the casual ordinary hourly rate (the minimum rate plus ${pct(loading)}), as this award requires.`
                    : `Casual figures are the award's casual percentages, which already include the ${pct(loading)} loading where it applies.`}{" "}
                Figures are rounded to the cent. A dash means the column does not apply to that classification.
              </p>
            </section>

            <section id="penalty-rates">
              <h2 style={H2}>{meta.shortName} Penalty Rates</h2>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[36rem] text-left text-sm text-navy">
                    <caption className="sr-only">{meta.shortName} penalty rates</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">When worked</th>
                        <th scope="col" className="px-5 py-4">{hasPartTime ? "Full-time" : "Full-time / part-time"}</th>
                        <th scope="col" className="px-5 py-4">$ on {award.entryLevel}</th>
                        {hasPartTime && <th scope="col" className="px-5 py-4">Part-time</th>}
                        {hasPartTime && <th scope="col" className="px-5 py-4">$ part-time</th>}
                        <th scope="col" className="px-5 py-4">Casual</th>
                        <th scope="col" className="px-5 py-4">$ casual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {award.penalties.map((p) => {
                        const permanent = p.employment !== "casual";
                        const casualCol = p.employment !== "permanent";
                        const other = rowBase(p) !== entry ? <span className="block text-xs font-normal text-warmgray">on {rowBase(p).level}</span> : null;
                        const dash = <span className="text-warmgray-light" aria-label="not applicable">&ndash;</span>;
                        return (
                          <tr key={p.label}>
                            <th scope="row" className="px-5 py-3 text-left font-medium">
                              {p.label}
                              {p.note && <span className="mt-1 block text-xs font-normal text-warmgray">{p.note}</span>}
                              {/* G4: link from the award's first public holiday row */}
                              {p === award.penalties.find((x) => /public holiday/i.test(x.label)) && <PublicHolidayRowLink />}
                            </th>
                            <td className="px-5 py-3 font-medium">{permanent ? rowPct(p.fullTime, p) : dash}</td>
                            <td className="px-5 py-3">{permanent ? <>{formatAUD(rowDollar(p, "fullTime"), 2)}{other}</> : dash}</td>
                            {hasPartTime && <td className="px-5 py-3 font-medium">{permanent ? rowPct(p.partTime ?? p.fullTime, p) : dash}</td>}
                            {hasPartTime && <td className="px-5 py-3">{permanent ? formatAUD(rowDollar(p, "partTime"), 2) : dash}</td>}
                            <td className="px-5 py-3 font-medium">
                              {casualCol ? (
                                <>
                                  {rowPct(p.casual, p)}
                                  {(p.casualBasis ?? award.casualPenaltyBasis) === "compounded" && <span className="block text-xs font-normal text-warmgray">of casual rate</span>}
                                </>
                              ) : dash}
                            </td>
                            <td className="px-5 py-3">{casualCol ? <>{formatAUD(rowDollar(p, "casual"), 2)}{other}</> : dash}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray">Source: {award.penaltiesClause}.</p>
              </div>
              {award.penaltyNotes.map((n) => (<p key={n}>{n}</p>))}
            </section>

            <section id="overtime">
              <h2 style={H2}>{meta.shortName} Overtime Rates</h2>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[32rem] text-left text-sm text-navy">
                    <caption className="sr-only">{meta.shortName} overtime rates</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Overtime worked</th>
                        <th scope="col" className="px-5 py-4">Full-time / part-time</th>
                        <th scope="col" className="px-5 py-4">$ on {award.entryLevel}</th>
                        {award.overtime.some((o) => o.casual !== null) && <th scope="col" className="px-5 py-4">Casual</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {award.overtime.map((o) => (
                        <tr key={o.label}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{o.label}</th>
                          <td className="px-5 py-3 font-medium">{pct(o.fullTime)}</td>
                          <td className="px-5 py-3">{formatAUD(roundCents(entry.hourly * o.fullTime), 2)}</td>
                          {award.overtime.some((x) => x.casual !== null) && (
                            <td className="px-5 py-3">
                              {o.casual !== null ? (
                                <>{pct(o.casual)}{compounded ? " of casual rate" : ""} &middot; {formatAUD(penaltyDollar(o.casual, true), 2)}</>
                              ) : (
                                <span className="text-warmgray-light" aria-label="not applicable">&ndash;</span>
                              )}
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray">Source: {award.overtimeClause}.</p>
              </div>
              {award.overtimeNotes.map((n) => (<p key={n}>{n}</p>))}
            </section>

            <section id="junior-rates">
              <h2 style={H2}>{meta.shortName} Junior Rates</h2>
              {award.junior ? (
                <>
                  <p>
                    Junior rates are a percentage of {award.junior.baseLevel ? <>the <strong>{award.junior.baseLevel}</strong> rate</> : <>the adult rate for the classification</>} ({award.junior.clause}), and apply to {award.junior.appliesTo}.{" "}
                    {juniorHourlyBasis ? (
                      <>This award applies the percentage to the adult <strong>hourly</strong> rate, so the dollar columns are the percentage of {juniorBase.level} ({formatAUD(juniorBase.hourly, 2)} an hour).</>
                    ) : (
                      <>
                        The dollar columns apply the percentage to {juniorBase.level} ({formatAUD(juniorBase.weekly, 2)} a week)
                        {award.junior.weeklyRoundTo ? <>, round the weekly figure to the nearest {formatAUD(award.junior.weeklyRoundTo, 2)} as the award requires,</> : null}{" "}
                        and divide by {meta.standardWeeklyHours}.
                      </>
                    )}{" "}
                    The full adult rate applies from age {award.junior.adultAge}.
                  </p>
                  <JuniorScaleTable
                    scale={award.junior.scale}
                    adultWeekly={juniorBase.weekly}
                    adultHourly={juniorHourlyBasis ? juniorBase.hourly : undefined}
                    weeklyRoundTo={award.junior.weeklyRoundTo}
                    standardWeeklyHours={meta.standardWeeklyHours}
                    caption={`${meta.shortName} junior rates`}
                    adultLabel={juniorBase.level}
                    casualLoading={loading}
                  />
                  {phaseIn && (
                    <>
                      <h3>Junior rates from 1 December 2026: a phase-in, not the adult rate</h3>
                      <p>
                        Determination {phaseIn.determination}, made on {JUNIOR_PHASE_IN.decidedOn} under {JUNIOR_PHASE_IN.decision} (implementing {JUNIOR_PHASE_IN.principalDecision}), replaces the junior table for employees aged 18, 19 and 20 <strong>who have been employed by their employer for more than 6 months</strong>. Each step takes effect from the first full pay period starting on or after the date shown. Under-18 rates and the rates for the first 6 months with an employer do not change.
                      </p>
                      <JuniorPhaseInTable
                        schedule={phaseIn}
                        adultWeekly={entry.weekly}
                        baseLabel={award.entryLevel}
                        caption={`${meta.shortName} junior rate phase-in from 1 December 2026`}
                      />
                    </>
                  )}
                  <p>
                    For how junior scales compare across awards and against the National Minimum Wage, see our <Link href="/junior-pay-rates/">junior pay rates guide</Link>.
                  </p>
                </>
              ) : (
                <p><strong>{award.noJuniorNote}</strong> Any age-percentage table attributed to the {meta.shortName} is not from the award.</p>
              )}
            </section>

            <section id="allowances">
              <h2 style={H2}>{meta.shortName} Allowances</h2>
              <p>
                Fixed-dollar allowances in {award.allowancesClause}, operative from {meta.operativeFrom}. Each is paid only where the clause&rsquo;s conditions are met.
              </p>
              <AllowanceTable allowances={award.allowances} caption={`${meta.shortName} allowances`} />
            </section>

            <section id="hours">
              <h2 style={H2}>Minimum Shifts and Hours</h2>
              <ul>
                {award.hoursNotes.map((n) => (<li key={n}>{n}</li>))}
              </ul>
              <TakeHomeLinks rows={award.rates} heading={`What does a ${meta.shortName.toLowerCase()} rate take home?`} />
            </section>

            <section id="not-covered">
              <h2 style={H2}>What This Page Does Not Cover</h2>
              <p>These parts of the award carry rules or rates we have not verified line by line, so we publish no figures for them:</p>
              <ul>
                {award.unverified.map((g) => (<li key={g}>{g}</li>))}
              </ul>
              <p>
                An enterprise agreement, if one covers your workplace, replaces these award rates &mdash; though it must leave you better off overall.
              </p>
              <div className="not-prose mt-6">
                <a href={meta.awardTextUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md border border-transparent bg-eucalyptus-dark px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-navy">
                  Read the full {meta.code} award text
                  <ExternalLink className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </section>

            <section id="when-rates-changed">
              <h2 style={H2}>When These Rates Took Effect</h2>
              <p>
                <strong>{meta.effectiveNote}</strong> If your pay period began before {meta.operativeFrom}, the previous rate lawfully applies to that whole period and the rise starts with the next one. The award was varied by determination {meta.determination} following the Annual Wage Review 2026. If you have been paid below these rates, our <Link href="/backpay-calculator/">backpay calculator</Link> works out what is owed.
              </p>
            </section>

            <section id="faq">
              <h2 style={H2}>Frequently Asked Questions</h2>
              {/* Crawlable mirror — the Radix accordion unmounts closed content. */}
              <div className="sr-only">
                <h3>{meta.shortName} questions and answers</h3>
                {copy.faqs.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {copy.faqs.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="rounded-lg border bg-white px-4">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How these rates were verified">
                <p>
                  Every figure comes from one constants file transcribed on {meta.verifiedOn} from the Fair Work Commission&rsquo;s consolidated {meta.code} award text, which incorporates all amendments up to and including {meta.consolidatedTo}. Clause numbers are cited against each table. Hourly is the published weekly rate divided by {meta.standardWeeklyHours}; derived dollar figures are rounded half up to the cent.
                </p>
                <p>
                  Automated tests pin the published rates, check every hourly rate against its weekly rate, and assert the rules this award is most often modelled wrongly on{award.casualRuleSummary ? " — including which casual penalties add the loading and which compound on the casual rate" : compounded ? " — including that casual penalties compound on the casual rate" : " — including that casual penalties add the loading rather than multiplying by it"}. Parts of the award we have not verified are listed as gaps rather than estimated.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sources} lastVerified={meta.verifiedOn} />
              {(() => { const a = getGuideAuthorship(copy.slug); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">Award Pay Rates A–Z</h2>
                  <AwardDirectorySidebar currentHref={meta.href} />
                </CardContent>
              </Card>
              <Card className="border-none bg-eucalyptus-dark text-white shadow-md">
                <CardContent className="p-6">
                  <h2 className="mb-2 text-lg font-bold">Check your take-home pay</h2>
                  <p className="mb-4 text-sm text-eucalyptus-light">
                    {award.entryLevel} casual is {formatAUD(casualEntry, 2)} an hour before tax. See what lands in your account.
                  </p>
                  <Link href="/weekly-pay-calculator/" className="mb-2 block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50">
                    Weekly Pay Calculator
                  </Link>
                  <Link href="/take-home-pay-calculator/" className="block w-full rounded-md border border-white/40 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10">
                    Take-Home Pay Calculator
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

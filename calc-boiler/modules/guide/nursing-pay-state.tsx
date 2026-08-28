"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator, ExternalLink, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { formatAUD } from "@/lib/constants";
import {
  NURSING_PAY_BY_STATE,
  NURSING_PAY_STATES,
  NURSING_PAY_STATES_NOT_BUILT,
  SCALE_FAMILY_LABELS,
  SCALE_FAMILY_ORDER,
  annualFor,
  annualIsPublished,
  familiesPresent,
  hourlyFor,
  instrumentFor,
  nearestTakeHomeSalary,
  registeredNurseRange,
  scalesInFamily,
  takeHomeHref,
} from "@/lib/data/nursing-pay";
import {
  NURSES_AWARD,
  NURSES_AWARD_GENERAL,
  NURSES_AWARD_PENALTIES,
} from "@/lib/data/nursing-pay/nurses-award-2020";
import { nursingStateFaqs } from "@/lib/data/nursing-pay/faqs";
import type { NursingStateData, PayPoint, PayScale } from "@/lib/data/nursing-pay/types";

const AWARD_RN1 = NURSES_AWARD_GENERAL.find((s) => s.classification === "Registered nurse — level 1")!;

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

export default function NursingPayStatePage({ state }: { state: NursingStateData }) {
  const primary = state.instruments[0];
  const range = registeredNurseRange(state);
  const families = familiesPresent(state, SCALE_FAMILY_ORDER);
  const faqs = nursingStateFaqs(state);

  const sources: SourceLink[] = [
    ...state.instruments.map((i) => ({
      title: `${i.name} — rates effective ${i.effectiveFrom}`,
      url: i.source.url,
      publisher: i.source.publisher,
    })),
    ...(state.extraSources ?? []).map((s) => ({ title: s.title, url: s.url, publisher: s.publisher })),
    {
      title: "Nurses Award 2020 [MA000034] — consolidated award text",
      url: "https://awards.fairwork.gov.au/MA000034.html",
      publisher: "Fair Work Ombudsman",
    },
  ];

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center space-x-1 text-sm text-warmgray">
            <li>
              <Link href="/" className="hover:text-eucalyptus-dark hover:underline">
                Pay Calculator
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-3 w-3 text-warmgray-light" />
            </li>
            <li>
              <Link href="/healthcare-worker-pay/" className="hover:text-eucalyptus-dark hover:underline">
                Healthcare Worker Pay
              </Link>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-3 w-3 text-warmgray-light" />
            </li>
            <li>
              <span className="font-medium text-navy" aria-current="page">
                {state.name}
              </span>
            </li>
          </ol>
        </nav>

        {/* HERO */}
        <header className="mb-10 max-w-4xl lg:mb-14">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            Nurse &amp; Midwife Pay Rates {state.shortName} — {state.employer.split(" (")[0]} Pay Scales
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">{state.intro}</p>
          <p className="mb-6 rounded-lg border border-eucalyptus/30 bg-eucalyptus-light/20 p-4 text-sm text-navy">
            <strong>Rates on this page:</strong> {primary.name}, effective {primary.effectiveFrom}
            {primary.nextIncrease ? `. Next scheduled change: ${primary.nextIncrease}` : ""}. Every figure was read
            from the source linked at the bottom of this page on {state.verifiedOn}.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            {/* ── What a registered nurse earns ── */}
            {range ? (
              <section id="what-an-rn-earns">
                <h2 style={HEADING_FONT}>What a registered nurse earns in {state.name}</h2>
                <p>
                  On the {state.scales.find((s) => s.family === "registered")?.classification} scale, the bottom step (
                  {range.entryLabel}) pays <strong>{formatAUD(range.entry)}</strong> a year and the top step (
                  {range.topLabel}) pays <strong>{formatAUD(range.top)}</strong>.{" "}
                  {state.derivation.annual
                    ? `Those annual figures are ${state.derivation.annual}.`
                    : `${state.employer.split(" (")[0]} publishes those annual figures directly.`}{" "}
                  Base pay is only part of the picture: nursing is a rostered, round-the-clock job, and shift and
                  weekend loadings routinely add a double-digit percentage on top.
                </p>
                <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
                  <TakeHomeCard
                    heading={`Entry step — ${range.entryLabel}`}
                    annual={range.entry}
                    note="Before shift penalties and allowances."
                  />
                  <TakeHomeCard
                    heading={`Top step — ${range.topLabel}`}
                    annual={range.top}
                    note="Same classification, top increment."
                  />
                </div>
                <p>
                  Those buttons go to the nearest published take-home page, which is rounded to the closest $5,000. For
                  your exact figure — including HECS-HELP, salary packaging and extra super — use the{" "}
                  <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.
                </p>
              </section>
            ) : null}

            {/* ── Highlights ── */}
            {state.highlights.length > 0 ? (
              <section id="what-makes-this-state-different">
                <h2 style={HEADING_FONT}>What makes {state.shortName} different</h2>
                <ul>
                  {state.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </section>
            ) : null}

            {/* ── Pay scales ── */}
            <section id="pay-scales">
              <h2 style={HEADING_FONT}>
                {state.employer.split(" (")[0]} nursing and midwifery pay scales
              </h2>
              <p>
                Each table below uses the classification names the instrument itself prints. Classifications are not
                the same between states and this page does not translate them: a Queensland Nurse Grade 5 and a
                Tasmanian Registered Nurse Grade 3 are both entry registered nurse roles, but they are not the same
                classification and they are not on the same money.
              </p>

              {families.map((family) => (
                <div key={family}>
                  <h3 style={HEADING_FONT}>{SCALE_FAMILY_LABELS[family]}</h3>
                  {scalesInFamily(state, family).map((scale) => (
                    <ScaleTable key={scale.classification} scale={scale} state={state} />
                  ))}
                </div>
              ))}
            </section>

            {/* ── Instrument ── */}
            <section id="which-agreement">
              <h2 style={HEADING_FONT}>Which agreement covers you</h2>
              {state.instruments.map((inst) => (
                <div key={inst.id} className="not-prose my-5 rounded-xl border border-sandstone-dark/20 bg-sandstone/30 p-5">
                  <p className="font-semibold text-navy">{inst.name}</p>
                  <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm text-warmgray sm:grid-cols-2">
                    <div>
                      <dt className="font-medium text-navy">Rates effective</dt>
                      <dd>{inst.effectiveFrom}</dd>
                    </div>
                    {inst.nextIncrease ? (
                      <div>
                        <dt className="font-medium text-navy">Next change</dt>
                        <dd>{inst.nextIncrease}</dd>
                      </div>
                    ) : null}
                    <div>
                      <dt className="font-medium text-navy">Made or approved by</dt>
                      <dd>{inst.tribunal}</dd>
                    </div>
                    {inst.reference ? (
                      <div>
                        <dt className="font-medium text-navy">Reference</dt>
                        <dd>{inst.reference}</dd>
                      </div>
                    ) : null}
                  </dl>
                  {inst.note ? <p className="mt-3 text-sm text-warmgray">{inst.note}</p> : null}
                  <a
                    href={inst.source.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-eucalyptus-dark hover:text-navy hover:underline"
                  >
                    {inst.source.title}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </div>
              ))}
            </section>

            {/* ── Nurses Award 2020 ── */}
            <section id="nurses-award-2020">
              <h2 style={HEADING_FONT}>Nurses Award 2020 vs the {state.shortName} agreement</h2>
              <p>
                The <strong>Nurses Award 2020</strong> (MA000034) is a federal minimum wage instrument, not a pay
                scale for public hospital staff. It sets the floor below which no nurse in Australia may lawfully be
                paid. Almost nobody in {state.name}&apos;s public health system is actually paid on it, because the
                instrument above pays well over the floor. The award is what governs pay in private hospitals, GP and
                specialist clinics, aged care and agency work where no enterprise agreement applies.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[36rem] text-left text-sm text-warmgray">
                    <caption className="sr-only">
                      Nurses Award 2020 registered nurse level 1 minimum rates against the {state.shortName} entry rate
                    </caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-3">
                          Rate
                        </th>
                        <th scope="col" className="px-5 py-3 text-right">
                          Weekly
                        </th>
                        <th scope="col" className="px-5 py-3 text-right">
                          Hourly
                        </th>
                        <th scope="col" className="px-5 py-3 text-right">
                          A full year
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-5 py-3">Nurses Award 2020 — RN level 1 pay point 1 (the floor)</td>
                        <td className="px-5 py-3 text-right">{formatAUD(AWARD_RN1.points[0].weekly, 2)}</td>
                        <td className="px-5 py-3 text-right">{formatAUD(AWARD_RN1.points[0].hourly, 2)}</td>
                        <td className="px-5 py-3 text-right">{formatAUD(AWARD_RN1.points[0].weekly * 52)}</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3">Nurses Award 2020 — RN level 1 pay point 8</td>
                        <td className="px-5 py-3 text-right">
                          {formatAUD(AWARD_RN1.points[AWARD_RN1.points.length - 1].weekly, 2)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          {formatAUD(AWARD_RN1.points[AWARD_RN1.points.length - 1].hourly, 2)}
                        </td>
                        <td className="px-5 py-3 text-right">
                          {formatAUD(AWARD_RN1.points[AWARD_RN1.points.length - 1].weekly * 52)}
                        </td>
                      </tr>
                      {range ? (
                        <tr className="bg-eucalyptus-light/20 font-semibold text-navy">
                          <td className="px-5 py-3">
                            {state.shortName} public health — entry registered nurse ({range.entryLabel})
                          </td>
                          <td className="px-5 py-3 text-right">—</td>
                          <td className="px-5 py-3 text-right">—</td>
                          <td className="px-5 py-3 text-right">{formatAUD(range.entry)}</td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Award rates above are the minimum rates operative from {NURSES_AWARD.generalRatesFrom} (
                {NURSES_AWARD.generalDetermination}) for employees other than aged care employees. The award now
                carries a second, higher set of minimum rates for <strong>aged care</strong> nurses, operative from{" "}
                {NURSES_AWARD.agedCareRatesFrom} ({NURSES_AWARD.agedCareDetermination}) — an aged care registered
                nurse level 1 in their first year is on $1,571.60 a week, well above the $1,219.50 general rate. If
                someone quotes &ldquo;the Nurses Award rate&rdquo; without saying which of the two streams they mean,
                the number is unusable.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[32rem] text-left text-sm text-warmgray">
                    <caption className="sr-only">Nurses Award 2020 shift and weekend penalty rates</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-3">
                          Nurses Award 2020 penalty
                        </th>
                        <th scope="col" className="px-5 py-3 text-right">
                          Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {NURSES_AWARD_PENALTIES.map((p) => (
                        <tr key={p.label}>
                          <td className="px-5 py-3">
                            {p.label}
                            {p.note ? <span className="block text-xs text-warmgray-light">{p.note}</span> : null}
                          </td>
                          <td className="px-5 py-3 text-right font-medium">{p.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Full award pay-guide style tables for other awards are on the{" "}
                <Link href="/award-rates/">award pay rates</Link> page.
              </p>
            </section>

            {/* ── Penalties ── */}
            <section id="shift-penalties">
              <h2 style={HEADING_FONT}>Shift penalties and weekend loadings in {state.name}</h2>
              <p>
                Nursing pay is penalty-driven. A nurse on a rotating roster with regular nights and weekends can be
                paid materially more than the base rate on this page, and the difference does not show up in any
                &ldquo;average nurse salary&rdquo; figure. Check these against your payslip line by line.
              </p>
              {state.penalties.length === 0 ? (
                <div className="not-prose my-6 rounded-xl border border-sandstone-dark/30 bg-sandstone/40 p-5 text-sm text-navy">
                  <p className="flex items-start gap-2">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      {state.employer.split(" (")[0]} publishes base salaries but not the penalty schedule alongside
                      them, and the agreement text has not been read for this page. Rather than quote percentages we
                      cannot cite, this page publishes none for {state.name}. The{" "}
                      <Link href="/overtime-penalty-rates-guide/" className="font-medium text-eucalyptus-dark underline">
                        overtime and penalty rates guide
                      </Link>{" "}
                      explains how shift loadings are normally structured, and the instrument is linked in the sources
                      below.
                    </span>
                  </p>
                </div>
              ) : (
                state.penalties.map((set) => {
                  const inst = instrumentFor(state, set.instrumentId);
                  return (
                    <div key={set.clause} className="not-prose my-6">
                      <p className="mb-2 text-sm text-warmgray">
                        From {set.clause}
                        {inst ? ` of the ${inst.name}` : ""}.
                      </p>
                      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                        <table className="w-full min-w-[32rem] text-left text-sm text-warmgray">
                          <caption className="sr-only">
                            {state.name} nursing shift and weekend penalty rates
                          </caption>
                          <thead className="bg-sandstone font-semibold text-navy">
                            <tr>
                              <th scope="col" className="px-5 py-3">
                                When you work
                              </th>
                              <th scope="col" className="px-5 py-3 text-right">
                                What it pays
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                            {set.rows.map((row) => (
                              <tr key={row.label}>
                                <td className="px-5 py-3">
                                  {row.label}
                                  {row.note ? (
                                    <span className="block text-xs text-warmgray-light">{row.note}</span>
                                  ) : null}
                                </td>
                                <td className="px-5 py-3 text-right font-medium text-navy">{row.value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {set.incomplete ? (
                        <p className="mt-3 text-sm text-warmgray-light">{set.incomplete}</p>
                      ) : null}
                    </div>
                  );
                })
              )}
              <p>
                To model a specific roster — a fortnight of nights, a weekend block, an overtime call-back — use the{" "}
                <Link href="/overtime-pay-calculator/">overtime pay calculator</Link>, and read the{" "}
                <Link href="/overtime-penalty-rates-guide/">overtime and penalty rates guide</Link> for how loadings
                interact with ordinary hours.
              </p>
            </section>

            {/* ── Progression ── */}
            <section id="progression">
              <h2 style={HEADING_FONT}>Moving up a step, and what each step is worth</h2>
              <p>
                Two different things move nursing pay. Within one classification you move through increments — usually
                annually for full-time staff, and by accumulated hours for part-time and casual staff. Between
                classifications you move by being appointed to a position, not by time served: nobody becomes a
                clinical nurse consultant or a unit manager by waiting.
              </p>
              <p>
                The increments are worth checking. On the {state.shortName} registered nurse scale, the gap between
                consecutive steps is a real pay rise every year that you should be able to see land on a specific pay
                period. If your increment date has passed and the rate has not moved, that is a payroll question worth
                asking. Use the <Link href="/pay-rise-calculator/">pay rise calculator</Link> to see what a step is
                worth after tax, and <Link href="/backpay-calculator/">the back pay calculator</Link> if the increment
                was applied late.
              </p>
            </section>

            {/* ── Salary packaging ── */}
            <section id="salary-packaging">
              <h2 style={HEADING_FONT}>Salary packaging, and why it changes your take-home but not your grade</h2>
              <p>
                Public hospital employees can salary package living expenses out of pre-tax income under the public
                hospital fringe benefits tax exemption. On a nursing salary that is worth several thousand dollars a
                year in extra take-home pay, and it is one of the largest single differences between public and
                private sector nursing pay once you look past the base rate.
              </p>
              <p>
                What it does <em>not</em> do is change your classification, your increment or your gross pay. It
                changes how much of your gross pay is taxed. That distinction matters when you are comparing a public
                hospital offer against a private one, and when you are checking whether your payslip has the packaging
                deduction applied correctly. The mechanics, caps and eligibility are in the{" "}
                <Link href="/salary-packaging-guide/">salary packaging guide</Link>; the{" "}
                <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link> shows the effect on a
                specific salary.
              </p>
            </section>

            {/* ── Gaps ── */}
            <section id="what-is-not-here">
              <h2 style={HEADING_FONT}>What this page does not show</h2>
              <p>
                This is a money page, so it says what it left out rather than filling gaps with estimates.
              </p>
              {state.notReproduced.length > 0 ? (
                <>
                  <h3 style={HEADING_FONT}>Published, but not reproduced here</h3>
                  <p>These rows exist in the source and can be read at the link in the sources below:</p>
                  <ul>
                    {state.notReproduced.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              {state.unverified.length > 0 ? (
                <>
                  <h3 style={HEADING_FONT}>Not published anywhere we could verify</h3>
                  <p>
                    Nothing below appears on this page in any form. No figure here has been estimated, interpolated or
                    carried across from another state:
                  </p>
                  <ul>
                    {state.unverified.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>

            {/* ── Other states ── */}
            <section id="other-states">
              <h2 style={HEADING_FONT}>Nurse pay in the other states</h2>
              <p>
                Every state runs its own classification structure and its own agreement. Comparing the raw numbers
                across states is misleading unless you also compare the classifications and the penalty structures.
              </p>
              <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
                {NURSING_PAY_STATES.filter((s) => s !== state.slug).map((slug) => {
                  const other = NURSING_PAY_BY_STATE[slug];
                  if (!other) return null;
                  const otherRange = registeredNurseRange(other);
                  return (
                    <Link
                      key={slug}
                      href={`/healthcare-worker-pay/${slug}/`}
                      className="group flex items-start justify-between gap-3 rounded-lg border border-sandstone-dark/20 bg-white p-4 transition hover:border-eucalyptus/50 hover:shadow-sm"
                    >
                      <span>
                        <span className="block font-semibold text-navy group-hover:text-eucalyptus-dark">
                          Nurse pay in {other.name}
                        </span>
                        {otherRange ? (
                          <span className="mt-0.5 block text-sm text-warmgray">
                            {other.scales.find((s) => s.family === "registered")?.gradeCode ?? "Registered nurse"} from{" "}
                            {formatAUD(otherRange.entry)}
                          </span>
                        ) : null}
                      </span>
                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  );
                })}
              </div>
              <p className="text-sm text-warmgray-light">
                Not yet published: {NURSING_PAY_STATES_NOT_BUILT.join(" and ")}. Their instruments have not been read,
                and we would rather publish nothing than a guess.
              </p>
            </section>

            {/* ── FAQs ── */}
            <section id="faq">
              <h2 style={HEADING_FONT}>Frequently asked questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem key={faq.q} value={`faq-${i}`} className="rounded-lg border bg-white px-4">
                    <AccordionTrigger className="text-left font-semibold text-navy">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-warmgray">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How these figures were checked">
                <p>
                  Every rate on this page was read on {state.verifiedOn} from the instrument or employer wage schedule
                  linked below, and nothing was estimated, averaged or interpolated. Where a source publishes a rate
                  for a classification we publish it; where it does not, the row is omitted and listed under
                  &ldquo;what this page does not show&rdquo;.
                </p>
                <p>
                  {state.derivation.annual
                    ? `${state.employer.split(" (")[0]} publishes no annual salary in this instrument. Annual figures here are ${state.derivation.annual}, and the arithmetic is stated wherever a converted figure appears.`
                    : `${state.employer.split(" (")[0]} publishes annual salaries directly, so no conversion is applied.`}{" "}
                  {state.derivation.hourly
                    ? `Hourly: ${state.derivation.hourly}.`
                    : "Hourly rates are published by the source and are reproduced as printed."}
                </p>
                <p>
                  Take-home links round to the nearest published $5,000 salary page and do not account for HECS-HELP,
                  salary packaging, extra super or the Medicare levy surcharge. Use the take-home pay calculator for a
                  figure specific to your circumstances. Nothing here is financial or industrial advice — check your
                  own payslip and your own agreement.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sources} lastVerified={state.verifiedOn} />
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">Nurse pay by state</h2>
                  <div className="space-y-2">
                    {NURSING_PAY_STATES.map((slug) => {
                      const other = NURSING_PAY_BY_STATE[slug];
                      if (!other) return null;
                      const active = slug === state.slug;
                      return (
                        <Link
                          key={slug}
                          href={`/healthcare-worker-pay/${slug}/`}
                          aria-current={active ? "page" : undefined}
                          className={`group flex items-center justify-between rounded-lg border p-3 transition-all ${
                            active
                              ? "border-eucalyptus/60 bg-eucalyptus-light/30"
                              : "border-sandstone-dark/20 bg-white hover:border-eucalyptus/40 hover:shadow-sm"
                          }`}
                        >
                          <span className="text-sm font-medium text-navy">{other.name}</span>
                          <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                        </Link>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-xs text-warmgray-light">
                    ACT and NT are not published yet.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 font-bold text-navy">Check your pay</h2>
                  <div className="space-y-3">
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/overtime-pay-calculator/" label="Overtime &amp; Penalty Calculator" />
                    <SidebarLink href="/salary-packaging-guide/" label="Salary Packaging Guide" />
                    <SidebarLink href="/understanding-your-payslip/" label="Understanding Your Payslip" />
                    <SidebarLink href="/healthcare-worker-pay/" label="Healthcare Worker Pay Hub" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none bg-eucalyptus-dark text-white shadow-md">
                <CardContent className="p-6">
                  <h2 className="mb-2 text-lg font-bold">Is your payslip right?</h2>
                  <p className="mb-4 text-sm text-eucalyptus-light">
                    Find your classification and increment in the tables, then check the rate on your payslip matches
                    it — and that your shift loadings are on the ordinary rate, not the base.
                  </p>
                  <Link
                    href="/take-home-pay-calculator/"
                    className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50"
                  >
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

function TakeHomeCard({ heading, annual, note }: { heading: string; annual: number; note: string }) {
  return (
    <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone/40 p-5">
      <p className="text-sm font-medium text-warmgray">{heading}</p>
      <p className="mt-1 text-3xl font-extrabold text-navy">{formatAUD(annual)}</p>
      <p className="mt-1 text-xs text-warmgray-light">{note}</p>
      <Link
        href={takeHomeHref(annual)}
        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline"
      >
        <Calculator className="h-4 w-4" aria-hidden="true" />
        See this after tax
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    </div>
  );
}

function ScaleTable({ scale, state }: { scale: PayScale; state: NursingStateData }) {
  const inst = instrumentFor(state, scale.instrumentId);
  const anyHourly = scale.points.some((p) => hourlyFor(p, state) !== null);
  const anyCasual = scale.points.some((p) => typeof p.casualHourly === "number");
  const anyWeekly = scale.points.some((p) => typeof p.weekly === "number");

  return (
    <div className="not-prose my-6">
      <p className="mb-1 text-base font-semibold text-navy">
        {scale.classification}
        {scale.gradeCode ? <span className="ml-2 text-sm font-normal text-warmgray">({scale.gradeCode})</span> : null}
      </p>
      {inst ? (
        <p className="mb-2 text-xs text-warmgray-light">
          {inst.name} — rates effective {inst.effectiveFrom}
        </p>
      ) : null}
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full min-w-[34rem] text-left text-sm text-warmgray">
          <caption className="sr-only">
            {scale.classification} pay rates, {state.name}
          </caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-4 py-3">
                Step
              </th>
              {anyWeekly ? (
                <th scope="col" className="px-4 py-3 text-right">
                  Weekly
                </th>
              ) : null}
              {anyHourly ? (
                <th scope="col" className="px-4 py-3 text-right">
                  Hourly
                </th>
              ) : null}
              {anyCasual ? (
                <th scope="col" className="px-4 py-3 text-right">
                  Casual hourly
                </th>
              ) : null}
              <th scope="col" className="px-4 py-3 text-right">
                A year (tap for after tax)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {scale.points.map((point) => (
              <ScaleRow
                key={point.label}
                point={point}
                state={state}
                showWeekly={anyWeekly}
                showHourly={anyHourly}
                showCasual={anyCasual}
              />
            ))}
          </tbody>
        </table>
      </div>
      {scale.note ? <p className="mt-2 text-sm text-warmgray">{scale.note}</p> : null}
    </div>
  );
}

function ScaleRow({
  point,
  state,
  showWeekly,
  showHourly,
  showCasual,
}: {
  point: PayPoint;
  state: NursingStateData;
  showWeekly: boolean;
  showHourly: boolean;
  showCasual: boolean;
}) {
  const annual = annualFor(point);
  const hourly = hourlyFor(point, state);
  const cols = 1 + (showWeekly ? 1 : 0) + (showHourly ? 1 : 0) + (showCasual ? 1 : 0) + 1;

  if (annual === null) {
    return (
      <tr className="bg-sandstone/30">
        <td className="px-4 py-3 font-medium text-navy">{point.label}</td>
        <td className="px-4 py-3 text-warmgray-light" colSpan={cols - 1}>
          No published rate. {point.note}
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td className="px-4 py-3 font-medium text-navy">
        {point.label}
        {point.note ? <span className="block text-xs font-normal text-warmgray-light">{point.note}</span> : null}
      </td>
      {showWeekly ? (
        <td className="px-4 py-3 text-right">
          {typeof point.weekly === "number" ? formatAUD(point.weekly, 2) : "—"}
        </td>
      ) : null}
      {showHourly ? (
        <td className="px-4 py-3 text-right">{hourly !== null ? formatAUD(hourly, 2) : "—"}</td>
      ) : null}
      {showCasual ? (
        <td className="px-4 py-3 text-right">
          {typeof point.casualHourly === "number" ? formatAUD(point.casualHourly, 2) : "—"}
        </td>
      ) : null}
      <td className="px-4 py-3 text-right font-medium">
        <Link
          href={takeHomeHref(annual)}
          className="font-semibold text-eucalyptus-dark hover:text-navy hover:underline"
        >
          {formatAUD(annual)}
          <span className="sr-only">
            {" "}
            — see take-home pay on {formatAUD(nearestTakeHomeSalary(annual))}
          </span>
        </Link>
        {annualIsPublished(point) ? null : (
          <span className="ml-1 text-xs font-normal text-warmgray-light">(weekly x 52)</span>
        )}
      </td>
    </tr>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-3 transition-all hover:border-eucalyptus/40 hover:shadow-sm"
    >
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}

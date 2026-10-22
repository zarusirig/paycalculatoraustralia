import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { formatAUD } from "@/lib/constants";
import {
  NURSING_PAY_BY_STATE,
  NURSING_PAY_STATES,
  SCALE_FAMILY_LABELS,
  SCALE_FAMILY_ORDER,
  annualFor,
  annualIsPublished,
  familiesPresent,
  fortnightlyFor,
  hourlyFor,
  instrumentFor,
  keyGradeRows,
  nearestTakeHomeSalary,
  nursingPageH1,
  ratesYear,
  registeredNurseLadder as registeredNurseRange,
  scaleAnchor,
  scaleSummaries,
  scalesInFamily,
  takeHomeHref,
  WEEKS_PER_YEAR,
} from "@/lib/data/nursing-pay";
import { nursingStateFaqs } from "@/lib/data/nursing-pay/faqs";
import type { NursingStateData, NursingStateSlug, PayPoint, PayScale } from "@/lib/data/nursing-pay/types";
import FeaturedImage from "@/components/common/featured-image";

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

/** Lowest and highest annual on a scale, or null if nothing is priced. */
function scaleRange(scale: PayScale | undefined): { entry: number; top: number } | null {
  if (!scale) return null;
  const priced = scale.points.map(annualFor).filter((a): a is number => a !== null);
  if (priced.length === 0) return null;
  return { entry: Math.min(...priced), top: Math.max(...priced) };
}

/**
 * Quotable opening paragraphs (seo-brain 2026-09-25, citation_lead). Only the
 * states listed here change; every other state keeps its data-file intro.
 * Every figure is rendered from the state's own scale data.
 */
const STATE_LEADS: Partial<Record<NursingStateSlug, (state: NursingStateData) => React.ReactNode>> = {
  nsw: (state) => {
    const rn = registeredNurseRange(state);
    const en = scaleRange(scalesInFamily(state, "enrolled")[0]);
    const primary = state.instruments[0];
    const next = state.upcoming?.[0];
    return (
      <>
        A registered nurse or midwife with NSW Health earns{" "}
        {rn ? `${formatAUD(rn.entry)} a year in the ${rn.entryLabel} and ${formatAUD(rn.top)} from the ${rn.topLabel}` : "the base scale"}
        . {en ? `An enrolled nurse earns ${formatAUD(en.entry)} to ${formatAUD(en.top)}. ` : ""}These are the award rates
        from {primary.effectiveFrom}. The award sets weekly pay, so each yearly figure is the weekly rate x{" "}
        {WEEKS_PER_YEAR}.{next ? ` The next rise is on ${next.effectiveFrom}.` : ""}
      </>
    );
  },
  qld: (state) => {
    const rn = registeredNurseRange(state);
    const base = state.scales.find((s) => s.family === "registered");
    const first = base?.points.find((p) => p.label === rn?.entryLabel);
    const hourly = first ? hourlyFor(first, state) : null;
    const primary = state.instruments[0];
    const next = state.upcoming?.[0];
    return (
      <>
        A registered nurse or midwife with Queensland Health earns{" "}
        {rn ? `${formatAUD(rn.entry)} to ${formatAUD(rn.top)} a year` : "the published scale"}
        {hourly ? `, or ${formatAUD(hourly, 2)} an hour at the first pay point` : ""}. That is{" "}
        {base?.gradeCode ?? "the RN grade"}, on the EB12 rates from {primary.effectiveFrom}, before shift penalties.
        {next ? ` The next rise is on ${next.effectiveFrom}.` : ""}
      </>
    );
  },
  sa: (state) => {
    const rn = registeredNurseRange(state);
    const primary = state.instruments[0];
    return (
      <>
        A registered nurse&apos;s salary in South Australia on SA Health&apos;s public sector scale runs from{" "}
        {rn ? `${formatAUD(rn.entry)} a year at the ${rn.entryLabel} to ${formatAUD(rn.top)} at the ${rn.topLabel}` : "the published scale"}
        , as printed in the {primary.name} from the {primary.effectiveFrom}. Those base figures exclude shift and weekend
        loadings, and the SA Government has since paid an administrative increase that SA Health has not yet published as
        dollar rates.
      </>
    );
  },
  vic: (state) => {
    const rn = registeredNurseRange(state);
    const base = state.scales.find((s) => s.family === "registered");
    const first = base?.points.find((p) => p.label === rn?.entryLabel);
    const hourly = first ? hourlyFor(first, state) : null;
    const primary = state.instruments[0];
    const next = state.upcoming?.[0];
    return (
      <>
        A registered nurse in a Victorian public hospital earns{" "}
        {rn ? `${formatAUD(rn.entry)} a year in ${rn.entryLabel} and ${formatAUD(rn.top)} in ${rn.topLabel}` : "the published scale"}
        {hourly ? `, from ${formatAUD(hourly, 2)} an hour` : ""}. Midwives get the same pay. These rates apply from the{" "}
        {primary.effectiveFrom}, under the 2024-2028 public sector agreement.
        {next ? ` The next rise is on ${next.effectiveFrom}.` : ""}
      </>
    );
  },
};

export default function NursingPayStatePage({ state }: { state: NursingStateData }) {
  const primary = state.instruments[0];
  const range = registeredNurseRange(state);
  const families = familiesPresent(state, SCALE_FAMILY_ORDER);
  const faqs = nursingStateFaqs(state);
  const employer = state.employer.split(" (")[0];

  const sources: SourceLink[] = [
    ...state.instruments.map((i) => ({
      title: `${i.name}, rates effective ${i.effectiveFrom}`,
      url: i.source.url,
      publisher: i.source.publisher,
    })),
    ...(state.extraSources ?? []).map((s) => ({ title: s.title, url: s.url, publisher: s.publisher })),
    ...(state.payDeal ? [state.payDeal.source] : []),
    ...(state.upcoming ?? []).map((u) => u.source),
  ].filter((s, i, all) => all.findIndex((o) => o.url === s.url) === i);

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
            {nursingPageH1(state)}
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">{STATE_LEADS[state.slug]?.(state) ?? state.intro}</p>
          <SalaryAnswerBox state={state} />
          <p className="mb-6 rounded-lg border border-eucalyptus/30 bg-eucalyptus-light/20 p-4 text-sm text-navy">
            <strong>Rates on this page:</strong> {primary.name}, effective {primary.effectiveFrom}
            {primary.nextIncrease ? `. Next scheduled change: ${primary.nextIncrease}` : ""}. Read from the source on{" "}
            {state.verifiedOn}.
          </p>
          <TrustBar className="!max-w-none" />
          <FeaturedImage lazy className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="mv-content prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            {/* ── At a glance: one row per classification, linking to its full table ── */}
            <AtAGlance state={state} />

            {/* ── State facts ── */}
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

            {/* ── What a registered nurse earns ── */}
            {range ? (
              <section id="what-an-rn-earns">
                <h2 style={HEADING_FONT}>What a registered nurse earns in {state.name}</h2>
                <p>
                  On the {state.scales.find((s) => s.family === "registered")?.classification} scale, {range.entryLabel}{" "}
                  pays <strong>{formatAUD(range.entry)}</strong> a year and {range.topLabel} pays{" "}
                  <strong>{formatAUD(range.top)}</strong>.{" "}
                  {state.derivation.annual
                    ? `Those annual figures are ${state.derivation.annual}.`
                    : `${employer} publishes those annual figures directly.`}
                </p>
                <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
                  <TakeHomeCard heading={`Entry step: ${range.entryLabel}`} annual={range.entry} />
                  <TakeHomeCard heading={`Top step: ${range.topLabel}`} annual={range.top} />
                </div>
              </section>
            ) : null}

            <NextPayRise state={state} />

            {/* ── Pay scales ── */}
            <section id="pay-scales">
              <h2 style={HEADING_FONT}>
                {employer} nursing and midwifery pay scales
              </h2>
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

            {/* ── Penalties: only where the state's instrument was transcribed ── */}
            {state.penalties.length > 0 ? (
              <section id="shift-penalties">
                <h2 style={HEADING_FONT}>Shift penalties and weekend loadings in {state.name}</h2>
                {state.penalties.map((set) => {
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
                })}
              </section>
            ) : null}

            {/* ── Gaps ── */}
            {state.notReproduced.length > 0 || state.unverified.length > 0 ? (
              <section id="what-is-not-here">
                <h2 style={HEADING_FONT}>What this page does not show</h2>
                {state.notReproduced.length > 0 ? (
                  <>
                    <h3 style={HEADING_FONT}>In the source, not reproduced here</h3>
                    <ul>
                      {state.notReproduced.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {state.unverified.length > 0 ? (
                  <>
                    <h3 style={HEADING_FONT}>Not verified, so not published</h3>
                    <ul>
                      {state.unverified.map((n) => (
                        <li key={n}>{n}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </section>
            ) : null}

            {/* ── FAQs: only questions answered from this state's data ── */}
            {faqs.length > 0 ? (
              <section id="faq">
                <h2 style={HEADING_FONT}>
                  {state.shortName} nurse pay questions
                </h2>
                <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={faq.q} value={`faq-${i}`} className="rounded-lg border bg-white px-4">
                      <AccordionTrigger className="text-left font-semibold text-navy">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-warmgray">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ) : null}

            {/* ── Rules that are the same in every state: one line, on the hub ── */}
            <section id="same-everywhere">
              <p>
                General rules that are not set by the {state.shortName} instrument are covered elsewhere: the{" "}
                <Link href="/nurses-award-rates/">Nurses Award 2020</Link> floor for private and aged care work,{" "}
                <Link href="/overtime-penalty-rates-guide/">penalty rates</Link> and{" "}
                <Link href="/salary-packaging-guide/">salary packaging</Link>.
              </p>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How these figures were checked">
                <p>
                  Read on {state.verifiedOn} from the sources below.{" "}
                  {state.derivation.annual
                    ? `Annual figures are ${state.derivation.annual}.`
                    : `${employer} publishes annual salaries directly.`}{" "}
                  {state.derivation.hourly ? `Hourly: ${state.derivation.hourly}.` : ""}
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sources} lastVerified={state.verifiedOn} />
            </div>
          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="mv-sidebar space-y-6">
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
                </CardContent>
              </Card>

              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/overtime-pay-calculator/" label="Overtime &amp; Penalty Calculator" />
                    <SidebarLink href={`/pay-calculator-${state.slug}/`} label={`${state.shortName} Pay Calculator`} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}


/**
 * The answer-first table: every classification on one screen, bottom and top
 * step, each salary linking to its take-home page and each name to its full
 * table further down. Built from the same scales the full tables render.
 */
function AtAGlance({ state }: { state: NursingStateData }) {
  const rows = scaleSummaries(state);
  const anyHourly = rows.some((r) => r.lowHourly !== null);
  return (
    <section id="at-a-glance">
      <h2 style={HEADING_FONT}>
        {state.shortName} nurse pay rates {ratesYear(state)} at a glance
      </h2>
      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full min-w-[34rem] text-left text-sm text-warmgray">
          <caption className="sr-only">
            {state.name} nursing and midwifery pay rates by classification, lowest and highest step
          </caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-4 py-3">
                Classification
              </th>
              {anyHourly ? (
                <th scope="col" className="px-4 py-3 text-right">
                  Hourly from
                </th>
              ) : null}
              <th scope="col" className="px-4 py-3 text-right">
                Lowest step a year
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Highest step a year
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {rows.map((row) => (
              <tr key={row.anchor}>
                <th scope="row" className="px-4 py-3 text-left font-medium">
                  <a href={`#${row.anchor}`} className="text-navy hover:text-eucalyptus-dark hover:underline">
                    {row.scale.gradeCode ?? row.scale.classification}
                  </a>
                  {row.scale.gradeCode ? (
                    <span className="block text-xs font-normal text-warmgray">{row.scale.classification}</span>
                  ) : null}
                </th>
                {anyHourly ? (
                  <td className="px-4 py-3 text-right">
                    {row.lowHourly !== null ? formatAUD(row.lowHourly, 2) : "—"}
                  </td>
                ) : null}
                <td className="px-4 py-3 text-right">
                  {row.low !== null ? <GlanceSalary annual={row.low} /> : "No published rate"}
                </td>
                <td className="px-4 py-3 text-right">
                  {row.high !== null && row.high !== row.low ? <GlanceSalary annual={row.high} /> : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {state.derivation.annual ? (
        <p className="text-sm text-warmgray">
          {state.employer.split(" (")[0]} does not publish annual salaries; annual figures here are{" "}
          {state.derivation.annual}.
        </p>
      ) : null}
    </section>
  );
}

/** Accessible name for a salary that links to its nearest take-home page. */
function takeHomeLabel(annual: number): string {
  return `${formatAUD(annual)}, see take-home pay on ${formatAUD(nearestTakeHomeSalary(annual))}`;
}

function GlanceSalary({ annual }: { annual: number }) {
  const label = takeHomeLabel(annual);
  return (
    <Link
      href={takeHomeHref(annual)}
      aria-label={label}
      title={label}
      className="font-semibold text-eucalyptus-dark hover:text-navy hover:underline"
    >
      {formatAUD(annual)}
    </Link>
  );
}

function TakeHomeCard({ heading, annual }: { heading: string; annual: number }) {
  return (
    <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone/40 p-5">
      <p className="text-sm font-medium text-warmgray">{heading}</p>
      <p className="mt-1 text-3xl font-extrabold text-navy">{formatAUD(annual)}</p>
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
  const anyFortnightly = scale.points.some((p) => fortnightlyFor(p) !== null);

  return (
    <div className="not-prose my-6 scroll-mt-24" id={scaleAnchor(state, scale)}>
      <h4 className="mb-1 text-base font-semibold text-navy">
        {scale.classification}
        {scale.gradeCode ? <span className="ml-2 text-sm font-normal text-warmgray">({scale.gradeCode})</span> : null}
        {" "}pay rates
      </h4>
      {inst ? (
        <p className="mb-2 text-xs text-warmgray-light">
          {inst.name}, rates effective {inst.effectiveFrom}
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
              {anyFortnightly ? (
                <th scope="col" className="px-4 py-3 text-right">
                  Fortnightly
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
                A year
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                After tax
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
                showFortnightly={anyFortnightly}
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
  showFortnightly,
  showHourly,
  showCasual,
}: {
  point: PayPoint;
  state: NursingStateData;
  showWeekly: boolean;
  showFortnightly: boolean;
  showHourly: boolean;
  showCasual: boolean;
}) {
  const annual = annualFor(point);
  const hourly = hourlyFor(point, state);
  const fortnightly = fortnightlyFor(point);
  const cols =
    1 + (showWeekly ? 1 : 0) + (showFortnightly ? 1 : 0) + (showHourly ? 1 : 0) + (showCasual ? 1 : 0) + 2;

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
      {showFortnightly ? (
        <td className="px-4 py-3 text-right">
          {fortnightly !== null ? formatAUD(fortnightly, 2) : "—"}
          {fortnightly !== null && typeof point.fortnightly !== "number" ? (
            <span className="block text-xs font-normal text-warmgray-light">weekly x 2</span>
          ) : null}
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
        <GlanceSalary annual={annual} />
        {annualIsPublished(point) ? null : (
          <span className="ml-1 text-xs font-normal text-warmgray-light">(weekly x 52)</span>
        )}
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          href={takeHomeHref(annual)}
          aria-label={`Take-home pay on ${formatAUD(nearestTakeHomeSalary(annual))}`}
          className="text-xs font-semibold text-eucalyptus-dark hover:text-navy hover:underline"
        >
          Take-home on {formatAUD(nearestTakeHomeSalary(annual))}
        </Link>
      </td>
    </tr>
  );
}

/**
 * The answer box (23 Oct 2026): the salary for each main grade on one card,
 * read from the state's `keyGrades`, each linking to its full table. Renders
 * nothing for states without `keyGrades`.
 */
function SalaryAnswerBox({ state }: { state: NursingStateData }) {
  const rows = keyGradeRows(state);
  if (rows.length === 0) return null;
  const primary = state.instruments[0];
  const next = state.upcoming?.[0];
  return (
    <section
      id="nurse-salary-answer"
      aria-labelledby="nurse-salary-answer-heading"
      className="mb-6 rounded-xl border border-eucalyptus/40 bg-white p-5 shadow-sm"
    >
      <h2 id="nurse-salary-answer-heading" className="mb-1 text-lg font-bold text-navy" style={HEADING_FONT}>
        Nurse salary in {state.shortName}, {ratesYear(state)}
      </h2>
      <p className="mb-4 text-sm text-warmgray">
        Base pay before tax and shift penalties, from {primary.effectiveFrom}.
        {state.derivation.annual ? " Annual figures are the weekly rate x 52." : ""}
      </p>
      <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map((row) => {
          const single = row.low === row.high;
          const hourly = hourlyFor(row.low, state);
          return (
            <div key={row.grade.label} className="border-b border-sandstone-dark/20 pb-2">
              <dt className="text-sm text-warmgray">
                <a href={`#${row.anchor}`} className="hover:text-eucalyptus-dark hover:underline">
                  {row.grade.label}
                </a>
              </dt>
              <dd className="text-base font-semibold text-navy">
                {single ? formatAUD(row.lowAnnual) : `${formatAUD(row.lowAnnual)} to ${formatAUD(row.highAnnual)}`}{" "}
                <span className="text-sm font-normal text-warmgray">
                  a year{hourly !== null ? `, ${single ? "" : "from "}${formatAUD(hourly, 2)} an hour` : ""}
                </span>
              </dd>
            </div>
          );
        })}
      </dl>
      {next ? (
        <p className="mt-4 text-sm text-navy">
          <strong>Next pay rise:</strong> {next.effectiveFrom}.{" "}
          <a href="#next-pay-rise" className="font-medium text-eucalyptus-dark hover:underline">
            See the new rates
          </a>
        </p>
      ) : null}
    </section>
  );
}

/** Future pay tables the source already prints, plus the pay deal behind them. */
function NextPayRise({ state }: { state: NursingStateData }) {
  const upcoming = state.upcoming ?? [];
  if (upcoming.length === 0 && !state.payDeal) return null;
  return (
    <section id="next-pay-rise">
      <h2 style={HEADING_FONT}>
        Next {state.shortName} nurse pay rise
        {upcoming[0] ? `: ${upcoming[0].effectiveFrom}` : ""}
      </h2>
      {state.payDeal ? (
        <>
          <ul>
            {state.payDeal.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="text-sm text-warmgray">
            Source:{" "}
            <a href={state.payDeal.source.url} target="_blank" rel="noreferrer noopener">
              {state.payDeal.source.title}
            </a>{" "}
            ({state.payDeal.source.publisher}).
          </p>
        </>
      ) : null}
      {upcoming.map((u) => {
        const anyWeekly = u.rows.some((r) => typeof r.weekly === "number");
        const anyFortnightly = u.rows.some((r) => typeof r.fortnightly === "number");
        const anyHourly = u.rows.some((r) => typeof r.hourly === "number");
        return (
          <div key={u.effectiveFrom} className="not-prose my-6">
            <h3 className="mb-2 text-base font-semibold text-navy">Rates from {u.effectiveFrom}</h3>
            <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
              <table className="w-full min-w-[32rem] text-left text-sm text-warmgray">
                <caption className="sr-only">
                  {state.name} nursing pay rates from {u.effectiveFrom}
                </caption>
                <thead className="bg-sandstone font-semibold text-navy">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Role and step
                    </th>
                    {anyWeekly ? (
                      <th scope="col" className="px-4 py-3 text-right">
                        Weekly
                      </th>
                    ) : null}
                    {anyFortnightly ? (
                      <th scope="col" className="px-4 py-3 text-right">
                        Fortnightly
                      </th>
                    ) : null}
                    {anyHourly ? (
                      <th scope="col" className="px-4 py-3 text-right">
                        Hourly
                      </th>
                    ) : null}
                    <th scope="col" className="px-4 py-3 text-right">
                      A year
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                  {u.rows.map((r) => {
                    const annual =
                      typeof r.annual === "number"
                        ? r.annual
                        : typeof r.weekly === "number"
                          ? Math.round(r.weekly * WEEKS_PER_YEAR)
                          : null;
                    return (
                      <tr key={r.label}>
                        <td className="px-4 py-3 font-medium text-navy">{r.label}</td>
                        {anyWeekly ? (
                          <td className="px-4 py-3 text-right">
                            {typeof r.weekly === "number" ? formatAUD(r.weekly, 2) : "—"}
                          </td>
                        ) : null}
                        {anyFortnightly ? (
                          <td className="px-4 py-3 text-right">
                            {typeof r.fortnightly === "number" ? formatAUD(r.fortnightly, 2) : "—"}
                          </td>
                        ) : null}
                        {anyHourly ? (
                          <td className="px-4 py-3 text-right">
                            {typeof r.hourly === "number" ? formatAUD(r.hourly, 2) : "—"}
                          </td>
                        ) : null}
                        <td className="px-4 py-3 text-right font-medium">
                          {annual !== null ? formatAUD(annual) : "—"}
                          {annual !== null && typeof r.annual !== "number" ? (
                            <span className="ml-1 text-xs font-normal text-warmgray-light">(weekly x 52)</span>
                          ) : null}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">
              From{" "}
              <a href={u.source.url} target="_blank" rel="noreferrer noopener" className="underline">
                {u.source.title}
              </a>
              , read {state.verifiedOn}. These rates are already printed by the source, not projected.
            </p>
          </div>
        );
      })}
    </section>
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

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Calculator, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD } from "@/lib/constants";
import {
  EMPLOYER_SECTOR,
  SECTOR_LABEL,
  annualFor,
  entryRate,
  formatPct,
  fullTimeHours,
  juniorRates,
  relatedEmployers,
  takeHomeHrefForAnnual,
  type EmployerPay,
  type PenaltyRow,
} from "@/lib/data/employer-pay";
import FeaturedImage from "@/components/common/featured-image";

// Everything below the header is built from the employer's own data file.
// Generic explanations (casual loading, penalty rates, enterprise agreements,
// junior rates, tax) are one line each with a link to the page that covers
// them, and a section or table row appears only when the employer's data has
// it (10 Oct 2026).

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

const TABLE_WRAP = "not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const THEAD = "bg-sandstone font-semibold text-navy";
const TBODY = "divide-y divide-sandstone-dark/20 bg-white";

const money = (v: number) => formatAUD(v, 2);

function PenaltyTable({ rows, caption }: { rows: PenaltyRow[]; caption: string }) {
  return (
    <div className={TABLE_WRAP}>
      <table className="w-full min-w-[34rem] text-left text-sm text-warmgray">
        <caption className="sr-only">{caption}</caption>
        <thead className={THEAD}>
          <tr>
            <th scope="col" className="px-5 py-3">When</th>
            <th scope="col" className="px-5 py-3">Full-time &amp; part-time</th>
            <th scope="col" className="px-5 py-3">Casual</th>
          </tr>
        </thead>
        <tbody className={TBODY}>
          {rows.map((row) => (
            <tr key={row.when}>
              <th scope="row" className="px-5 py-3 text-left font-medium text-navy">
                {row.when}
                {row.note && <span className="mt-1 block text-xs font-normal text-warmgray">{row.note}</span>}
              </th>
              <td className="px-5 py-3">{row.permanent}</td>
              <td className="px-5 py-3">{row.casual}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function EmployerPayRatesPage({ employer }: { employer: EmployerPay }) {
  const e = employer;
  const entry = entryRate(e);
  const juniors = juniorRates(e);
  const anyDerivedJunior = juniors.some((j) => !j.published);
  // J7: salaried instruments (cabin crew, Australia Post) carry their own annual salary.
  const entryAnnual = annualFor(e, entry);
  const takeHome = takeHomeHrefForAnnual(entryAnnual);
  const loading = formatPct(e.casualLoading);
  const isAward = e.instrument.kind === "modern-award";
  const instrumentWord = isAward ? "award" : "agreement";
  const authorship = getGuideAuthorship("pay-rates");
  const related = relatedEmployers(e);
  const allowances = e.allowances ?? [];

  // A description repeated down the table (award levels 2–8 share one) is
  // printed once, on its first row.
  const shownDescriptions = new Set<string>();
  const rateRows = e.rates.map((row) => {
    const show = !shownDescriptions.has(row.description);
    shownDescriptions.add(row.description);
    return { row, description: show ? row.description : null };
  });

  const facts: { label: string; value: ReactNode }[] = [
    {
      label: isAward ? "Award" : "Agreement",
      value: (
        <a href={e.instrument.url} target="_blank" rel="noreferrer noopener">
          {e.instrument.title}
        </a>
      ),
    },
    { label: isAward ? "Award code" : "Fair Work Commission IDs", value: e.instrument.reference },
    ...(e.instrument.approvedOn ? [{ label: "Approved", value: e.instrument.approvedOn }] : []),
    ...(e.instrument.nominalExpiry ? [{ label: "Nominal expiry", value: e.instrument.nominalExpiry }] : []),
    { label: "Employer", value: e.employerEntity },
    { label: "Rates on this page from", value: e.ratesEffectiveFrom },
    { label: "Casual loading", value: loading },
    ...(e.fullTimeWeeklyHours !== undefined
      ? [{ label: "Full-time week", value: `${e.fullTimeWeeklyHours} hours` }]
      : []),
    { label: "Checked against the source", value: e.verifiedOn },
  ];

  const sourceLinks: SourceLink[] = e.sources.map((s) => ({
    title: s.title,
    url: s.url,
    publisher: s.publisher,
  }));

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/pay-rates/" className="hover:text-eucalyptus-dark hover:underline">Pay Rates by Employer</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">{e.name} Pay Rates</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl lg:mb-16">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            {e.name} Pay Rates 2026 — Hourly Wage by Age &amp; Level
          </h1>
          <p className="mb-4 text-xl leading-relaxed text-warmgray">
            {e.name} {e.industry} staff are paid under the {e.instrument.title} ({e.instrument.reference}).
            From {e.ratesEffectiveFrom}, an adult at {entry.level} {isAward ? "must get at least" : "gets"}{" "}
            <strong className="text-navy">{money(entry.hourly)} an hour</strong>, or{" "}
            <strong className="text-navy">{money(entry.casualHourly)}</strong> as a casual.
          </p>
          <p className="text-sm text-warmgray">
            Pay Calculator Australia is independent and not affiliated with, endorsed by or sponsored
            by {e.name}.
          </p>
          <FeaturedImage className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="agreement">
              <h2 style={HEADING_FONT}>
                Which {instrumentWord} sets {e.name} pay
              </h2>
              <dl className="not-prose my-6 grid grid-cols-1 gap-x-6 gap-y-3 rounded-xl border border-sandstone-dark/20 bg-sandstone/40 p-5 text-sm sm:grid-cols-[minmax(0,12rem)_1fr]">
                {facts.map((f) => (
                  <div key={f.label} className="contents">
                    <dt className="font-semibold text-navy">{f.label}</dt>
                    <dd className="text-warmgray [&_a]:font-medium [&_a]:text-eucalyptus-dark [&_a]:underline">{f.value}</dd>
                  </div>
                ))}
              </dl>
              <p>{e.instrument.coverage}</p>
              {e.nextIncrease && (
                <p>
                  <strong>Next scheduled increase:</strong> {e.nextIncrease.date}. {e.nextIncrease.detail}
                </p>
              )}
              {e.awardHref && e.awardLabel && (
                <p className="text-base">
                  {isAward ? "Every level: " : "Award floor: "}
                  <Link href={e.awardHref}>{e.awardLabel}</Link>
                  {isAward ? "." : <> (<Link href="/enterprise-agreement/">how agreements work</Link>).</>}
                </p>
              )}
            </section>

            {e.notices.length > 0 && (
              <div className="not-prose mb-8 space-y-3">
                {e.notices.map((notice) => (
                  <div key={notice} className="flex gap-3 rounded-lg border border-sandstone-dark/30 bg-sandstone/50 p-4">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-eucalyptus-dark" />
                    <p className="text-sm text-navy">{notice}</p>
                  </div>
                ))}
              </div>
            )}

            <section id="hourly-rates">
              <h2 style={HEADING_FONT}>{e.name} hourly pay rates by level (adults)</h2>
              {e.payBasisNote ? (
                <p className="text-base">{e.payBasisNote}</p>
              ) : (
                // H1: where the casual rate is not base + loading, the note under the table explains it.
                !e.casualRateNote && (
                  <p className="text-base">
                    Casual = base + {loading} (<Link href="/casual-loading-calculator/">casual loading</Link>).
                  </p>
                )
              )}
              <div className={TABLE_WRAP}>
                <table className="w-full min-w-[36rem] text-left text-sm text-warmgray">
                  <caption className="sr-only">{e.name} adult hourly rates by classification</caption>
                  <thead className={THEAD}>
                    <tr>
                      <th scope="col" className="px-5 py-3">Level</th>
                      <th scope="col" className="px-5 py-3 text-right">Full-time &amp; part-time</th>
                      <th scope="col" className="px-5 py-3 text-right">Casual</th>
                    </tr>
                  </thead>
                  <tbody className={TBODY}>
                    {rateRows.map(({ row, description }) => (
                      <tr key={row.level}>
                        <th scope="row" className="px-5 py-3 text-left font-medium text-navy">
                          {row.level}
                          {description && <span className="mt-1 block text-xs font-normal text-warmgray">{description}</span>}
                        </th>
                        <td className="px-5 py-3 text-right font-medium text-navy">{money(row.hourly)}</td>
                        {/* J7: some airline classifications have no casual rate */}
                        <td className="px-5 py-3 text-right">{row.noCasual ? "—" : money(row.casualHourly)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* H1: instruments whose casual rate is not base + loading */}
              {e.casualRateNote && <p className="text-sm">{e.casualRateNote}</p>}
              <p className="text-base">
                Full-time at {entry.level}: <strong>{formatAUD(entryAnnual)}</strong> a year before tax
                {entry.annualSalary !== undefined ? " (the printed salary)" : ` (${fullTimeHours(e)} hours × 52 weeks)`}.
                See <Link href={takeHome.href}>take-home pay on {formatAUD(takeHome.amount)}</Link>
                {takeHome.amount === Math.round(entryAnnual) ? "" : " (nearest we publish)"}.
              </p>
            </section>

            {juniors.length > 0 ? (
              <section id="junior-rates">
                <h2 style={HEADING_FONT}>{e.name} pay rates by age (junior rates)</h2>
                {e.juniorNote && <p>{e.juniorNote}</p>}
                <div className={TABLE_WRAP}>
                  <table className="w-full min-w-[32rem] text-left text-sm text-warmgray">
                    <caption className="sr-only">{e.name} junior hourly rates by age</caption>
                    <thead className={THEAD}>
                      <tr>
                        <th scope="col" className="px-5 py-3">Age</th>
                        <th scope="col" className="px-5 py-3 text-right">% of adult</th>
                        <th scope="col" className="px-5 py-3 text-right">Full-time &amp; part-time</th>
                        <th scope="col" className="px-5 py-3 text-right">Casual</th>
                      </tr>
                    </thead>
                    <tbody className={TBODY}>
                      {juniors.map((j) => (
                        <tr key={j.age}>
                          <th scope="row" className="px-5 py-3 text-left font-medium text-navy">{j.age}</th>
                          <td className="px-5 py-3 text-right">{formatPct(j.percentage)}</td>
                          <td className="px-5 py-3 text-right font-medium text-navy">{money(j.hourly)}</td>
                          <td className="px-5 py-3 text-right">{money(j.casualHourly)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm">
                  Percentages are of the adult {e.juniorBaseLabel ?? entry.level} rate
                  {anyDerivedJunior ? "; the dollars are our arithmetic, rounded to the cent" : ""}.{" "}
                  <Link href="/junior-pay-rates/">Junior rates under other awards</Link>.
                </p>
              </section>
            ) : (
              e.juniorNote && (
                <section id="junior-rates">
                  <h2 style={HEADING_FONT}>Does {e.name} pay junior rates?</h2>
                  <p>{e.juniorNote}</p>
                </section>
              )
            )}

            <section id="penalty-rates">
              <h2 style={HEADING_FONT}>{e.name} penalty rates: evenings, weekends and public holidays</h2>
              <PenaltyTable rows={e.penalties} caption={`${e.name} penalty rates`} />
              {e.penaltyNotes.length > 0 && (
                <ul>
                  {e.penaltyNotes.map((n) => <li key={n}>{n}</li>)}
                </ul>
              )}
              {e.overtime.length > 0 && (
                <>
                  <h3 style={HEADING_FONT}>Overtime</h3>
                  <PenaltyTable rows={e.overtime} caption={`${e.name} overtime rates`} />
                </>
              )}
              <p className="text-base">
                <Link href="/overtime-penalty-rates-guide/">How penalty rates work</Link> ·{" "}
                <Link href="/overtime-pay-calculator/">overtime calculator</Link>
              </p>
            </section>

            {allowances.length > 0 && (
              <section id="allowances">
                <h2 style={HEADING_FONT}>{e.name} allowances</h2>
                <div className={TABLE_WRAP}>
                  <table className="w-full min-w-[34rem] text-left text-sm text-warmgray">
                    <caption className="sr-only">{e.name} allowances</caption>
                    <thead className={THEAD}>
                      <tr>
                        <th scope="col" className="px-5 py-3">Allowance</th>
                        <th scope="col" className="px-5 py-3">Amount</th>
                        <th scope="col" className="px-5 py-3">Who gets it</th>
                      </tr>
                    </thead>
                    <tbody className={TBODY}>
                      {allowances.map((a) => (
                        <tr key={a.name}>
                          <th scope="row" className="px-5 py-3 text-left font-medium text-navy">{a.name}</th>
                          <td className="px-5 py-3">{a.amount}</td>
                          <td className="px-5 py-3">{a.when}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {e.allowancesNote && <p className="text-sm">{e.allowancesNote}</p>}
              </section>
            )}

            {e.unverified.length > 0 && (
              <section id="not-shown">
                <h2 style={HEADING_FONT}>What this page does not show</h2>
                <ul>
                  {e.unverified.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            )}

            {e.faqs.length > 0 && (
              <section id="faq">
                <h2 style={HEADING_FONT}>{e.name} pay questions</h2>
                <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                  {e.faqs.map((faq, index) => (
                    <AccordionItem key={faq.q} value={`faq-${index}`} className="rounded-lg border bg-white px-4">
                      <AccordionTrigger className="text-left font-semibold text-navy">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-warmgray">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}

            {related.sameInstrument.length + related.sameSector.length > 0 ? (
              <section id="other-employers">
                <h2 style={HEADING_FONT}>Related employers</h2>
                {related.sameInstrument.length > 0 && (
                  <>
                    <h3 style={HEADING_FONT}>Also paid under the {e.instrument.title}</h3>
                    <EmployerLinks employers={related.sameInstrument} />
                  </>
                )}
                {related.sameSector.length > 0 && (
                  <>
                    <h3 style={HEADING_FONT}>Other {SECTOR_LABEL[EMPLOYER_SECTOR[e.slug]]} employers</h3>
                    <EmployerLinks employers={related.sameSector} showInstrument />
                  </>
                )}
                <p className="text-base">
                  <Link href="/pay-rates/">All employers</Link>
                </p>
              </section>
            ) : (
              <p className="text-base">
                <Link href="/pay-rates/">Pay rates at other employers</Link>
              </p>
            )}

            <div className="not-prose mt-12">
              <SourceAttribution sources={sourceLinks} lastVerified={e.verifiedOn} />
              {authorship ? (
                <AuthorBox
                  author={authorship.author}
                  reviewer={authorship.reviewer}
                  lastReviewed={authorship.lastReviewed}
                  compact
                />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <Link
                    href="/weekly-pay-calculator/"
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-eucalyptus-dark px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy"
                  >
                    <Calculator className="h-4 w-4" />
                    Check your take-home pay
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

function EmployerLinks({ employers, showInstrument = false }: { employers: EmployerPay[]; showInstrument?: boolean }) {
  return (
    <div className="not-prose mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {employers.map((o) => (
        <Link
          key={o.slug}
          href={`/pay-rates/${o.slug}/`}
          className="group flex items-center justify-between gap-3 rounded-lg border border-sandstone-dark/20 bg-white p-4 transition-all hover:border-eucalyptus/40 hover:shadow-sm"
        >
          <span>
            <span className="block text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{o.name} pay rates</span>
            {showInstrument && <span className="mt-0.5 block text-xs text-warmgray">{o.instrument.title}</span>}
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-warmgray-light group-hover:text-eucalyptus" />
        </Link>
      ))}
    </div>
  );
}

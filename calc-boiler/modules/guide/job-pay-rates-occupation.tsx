import Link from "next/link";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { MEDICARE_LEVY, formatAUD, formatNegAUD } from "@/lib/constants";
import { ATO_DEFINITION, JOB_PAY_RATES_FROM, MEDIAN_NOTE } from "@/lib/data/job-pay-rates/common";
import { GENERIC_PAYSLIP_NOTES } from "@/lib/data/job-pay-rates/professional-common";
import { JOB_SECTORS, OCCUPATION_SECTOR } from "@/lib/data/job-pay-rates/sectors";
import {
  afterTax,
  annualFromWeekly,
  headlineRow,
  rowAnnual,
  isExactTakeHomeAmount,
  nearestTakeHomeAmount,
  relatedOccupations,
  takeHomeHref,
  type Occupation,
  type RateRow,
  type RateTable,
} from "@/lib/data/job-pay-rates";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink, TableShell } from "./job-pay-shared";
import FeaturedImage from "@/components/common/featured-image";

// One template for every /job-pay-rates/<occupation>/ page. Each section is
// built from the occupation's own data and renders only when that data
// exists. Explanations that would read the same on every page (how medians
// work, what part-timers and casuals get, tax assumptions, payslip rules) are
// one line with a link to the guide that covers them.

/** H1 and title stem. Award-free jobs do not get "Award" in the heading. */
export function occupationHeading(occ: Occupation): string {
  if (occ.heading) return occ.heading;
  return occ.award
    ? `${occ.name} Pay Rates Australia 2026 — Award & Hourly Wage`
    : `${occ.name} Pay Rates Australia 2026 — Minimum Wage & Median Salary`;
}

/** One figure a salary page compares, with where it comes from. */
interface SalaryFigure {
  label: string;
  source: string;
  gross: number;
}

/** Award minimum, JSA median and ATO median/average salary, in that order, where each exists. */
export function salaryFigures(occ: Occupation): SalaryFigure[] {
  const out: SalaryFigure[] = [];
  const headline = headlineRow(occ);
  if (headline && occ.award) {
    out.push({ label: `Award minimum — ${headline.label}`, source: `${occ.award.code}, 2026–27`, gross: rowAnnual(headline) });
  }
  if (occ.median) {
    out.push({
      label: `Median full-time pay — ${occ.median.anzscoTitle}`,
      source: "Jobs and Skills Australia, May 2025 (weekly × 52)",
      gross: annualFromWeekly(occ.median.medianWeekly),
    });
  }
  const lead = occ.ato?.rows[0];
  if (occ.ato && lead) {
    const source = `ATO tax returns, ${occ.ato.incomeYear}`;
    for (const r of occ.ato.rows.slice(0, occ.ato.takeHomeRows ?? 1)) {
      out.push({ label: `Median salary or wages — ${r.title}`, source, gross: r.medianSalary });
    }
    out.push({ label: `Average salary or wages — ${lead.title}`, source, gross: lead.avgSalary });
  }
  return out;
}

/** The figure a link to another occupation page shows: its award minimum, else its median. */
function glanceFigure(occ: Occupation): string | null {
  const h = headlineRow(occ);
  if (h && occ.award) return `${money(h.hourly)}/hr minimum`;
  const ato = occ.ato?.rows[0];
  if (ato) return `${formatAUD(ato.medianSalary)} median salary`;
  if (occ.median) return `${formatAUD(occ.median.medianWeekly)}/wk median`;
  return null;
}

function money(n: number): string {
  return formatAUD(n, 2);
}

function TakeHomeLink({ annual }: { annual: number }) {
  const nearest = nearestTakeHomeAmount(annual);
  const exact = isExactTakeHomeAmount(annual);
  return (
    <Link href={takeHomeHref(annual)}>
      take-home pay on {formatAUD(nearest)}
      {exact ? "" : ` (the nearest step to ${formatAUD(annual)})`}
    </Link>
  );
}

function TakeHomeButton() {
  return (
    <div className="not-prose my-6">
      <Link
        href="/take-home-pay-calculator/"
        className="inline-flex items-center gap-2 rounded-lg bg-eucalyptus-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-navy"
      >
        <Calculator className="h-5 w-5" aria-hidden="true" />
        Calculate your take-home pay
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

function AtoTable({ occ }: { occ: Occupation }) {
  if (!occ.ato) return null;
  return (
    <TableShell minWidth="46rem" caption={`${occ.name} income from ${occ.ato.incomeYear} tax returns`}>
      <thead className="bg-sandstone font-semibold text-navy">
        <tr>
          <th scope="col" className="px-4 py-3">Occupation on the tax return</th>
          <th scope="col" className="px-4 py-3 text-right">People</th>
          <th scope="col" className="px-4 py-3 text-right">Median salary or wages</th>
          <th scope="col" className="px-4 py-3 text-right">Average salary or wages</th>
          <th scope="col" className="px-4 py-3 text-right">Median taxable income</th>
          <th scope="col" className="px-4 py-3 text-right">Average taxable income</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-sandstone-dark/20 bg-white">
        {occ.ato.rows.map((r, i) => (
          <tr key={r.code} className={i === 0 ? "bg-eucalyptus-light/30" : undefined}>
            <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
              {r.title}
              <span className="block text-xs font-normal text-warmgray">ATO occupation code {r.code}</span>
            </th>
            <td className="px-4 py-3 text-right">{r.individuals.toLocaleString("en-AU")}</td>
            <td className="px-4 py-3 text-right font-semibold text-navy">{formatAUD(r.medianSalary)}</td>
            <td className="px-4 py-3 text-right">{formatAUD(r.avgSalary)}</td>
            <td className="px-4 py-3 text-right">{formatAUD(r.medianTaxableIncome)}</td>
            <td className="px-4 py-3 text-right">{formatAUD(r.avgTaxableIncome)}</td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  );
}

/** The Jobs and Skills Australia median, set against this job's own award minimum where it has one. */
function MedianSection({ occ, heading }: { occ: Occupation; heading: string }) {
  if (!occ.median) return null;
  const m = occ.median;
  const headline = occ.award ? headlineRow(occ) : null;
  const gap = headline ? Math.round(m.medianWeekly - headline.weekly) : 0;
  return (
    <section id="actual-earnings">
      <h2 style={HEADING_FONT}>{heading}</h2>
      <p>
        Jobs and Skills Australia puts median full-time earnings for{" "}
        <a href={m.url} target="_blank" rel="noreferrer noopener">
          {m.anzscoTitle} (ANZSCO {m.anzscoCode})
        </a>{" "}
        at <strong>{formatAUD(m.medianWeekly)} a week</strong> ({formatAUD(m.medianHourly)} an hour), against{" "}
        {formatAUD(m.allOccupationsWeekly)} a week for all occupations.
        {headline && gap !== 0 ? (
          <>
            {" "}That is {formatAUD(Math.abs(gap))} a week {gap > 0 ? "above" : "below"} the {headline.label} minimum of{" "}
            {money(headline.weekly)}.
          </>
        ) : null}
      </p>
      <p className="text-base">
        {MEDIAN_NOTE} <Link href="/average-salary-australia/#average-vs-median">Average and median pay explained</Link>.
      </p>
    </section>
  );
}

/** ATO and JSA figures, then take-home pay on each. Salary pages lead with this. */
function SalaryFiguresSection({ occ, payslipLink }: { occ: Occupation; payslipLink: boolean }) {
  const lead = occ.ato?.rows[0];
  const figures = salaryFigures(occ);
  const surcharge = figures.some((f) => f.gross >= MEDICARE_LEVY.surcharge.tier1.min);
  return (
    <>
      {occ.ato && lead ? (
        <section id="ato-income">
          <h2 style={HEADING_FONT}>
            What {occ.plural} earn: {occ.ato.incomeYear} tax returns
          </h2>
          <p>
            In the ATO&rsquo;s Taxation statistics for {occ.ato.incomeYear}, {lead.individuals.toLocaleString("en-AU")}{" "}
            people gave their occupation as &ldquo;{lead.title}&rdquo;. Among those who reported wages, the median salary
            or wage income was <strong>{formatAUD(lead.medianSalary)}</strong> and the average{" "}
            {formatAUD(lead.avgSalary)}. Their average taxable income was {formatAUD(lead.avgTaxableIncome)}.
          </p>
          <p>{occ.ato.intro}</p>
          <AtoTable occ={occ} />
          <p className="text-base">
            {ATO_DEFINITION} <Link href="/average-salary-australia/#average-vs-median">Average and median pay explained</Link>.
          </p>
        </section>
      ) : null}

      <MedianSection occ={occ} heading="Median full-time pay" />

      {figures.length > 0 ? (
        <section id="after-tax">
          <h2 style={HEADING_FONT}>{occ.name} pay after tax</h2>
          <TableShell minWidth="40rem" caption={`${occ.name} take-home pay on each figure`}>
            <thead className="bg-sandstone font-semibold text-navy">
              <tr>
                <th scope="col" className="px-4 py-3">Figure</th>
                <th scope="col" className="px-4 py-3 text-right">Gross a year</th>
                <th scope="col" className="px-4 py-3 text-right">Tax and Medicare</th>
                <th scope="col" className="px-4 py-3 text-right">Take-home a year</th>
                <th scope="col" className="px-4 py-3 text-right">A fortnight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {figures.map((f) => {
                const net = afterTax(f.gross);
                return (
                  <tr key={f.label}>
                    <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
                      {f.label}
                      <span className="block text-xs font-normal text-warmgray">{f.source}</span>
                    </th>
                    <td className="px-4 py-3 text-right">{formatAUD(f.gross)}</td>
                    <td className="px-4 py-3 text-right">{formatNegAUD(net.tax + net.medicare, 0, "−")}</td>
                    <td className="px-4 py-3 text-right font-semibold text-navy">{formatAUD(net.netAnnual)}</td>
                    <td className="px-4 py-3 text-right">{formatAUD(net.netFortnightly, 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </TableShell>
          <p>
            2026–27 resident rates with the Medicare levy and no HECS-HELP
            {surcharge ? (
              <>
, assuming private hospital cover (without it a single person pays the{" "}
                <Link href="/medicare-levy-surcharge-calculator/">Medicare levy surcharge</Link> above{" "}
                {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)})
              </>
            ) : null}
            . Full breakdown: <TakeHomeLink annual={figures[figures.length - 1].gross} />
            {payslipLink ? (
              <>
                ; what a payslip must show: <Link href="/understanding-your-payslip/">understanding your payslip</Link>
              </>
            ) : null}
            .
          </p>
          <TakeHomeButton />
        </section>
      ) : null}
    </>
  );
}

/** A casual rate, or a dash where the award sets none for the classification. */
function casualCell(n: number | null): string {
  return n === null ? "—" : money(n);
}

function RatesTable({ table, headlineLabel }: { table: RateTable; headlineLabel?: string }) {
  const casual = table.rows.some((r) => r.casualHourly !== null);
  const someCasualMissing = casual && table.rows.some((r) => r.casualHourly === null);
  const awardSalary = table.rows.some((r) => r.annual !== undefined);
  return (
    <div className="not-prose my-8">
      <h3 className="mb-2 text-xl font-bold text-navy" style={HEADING_FONT} id={table.id}>
        {table.title}
      </h3>
      <p className="mb-4 text-warmgray">{table.intro}</p>
      <TableShell minWidth="40rem" caption={table.title}>
        <thead className="bg-sandstone font-semibold text-navy">
          <tr>
            <th scope="col" className="px-4 py-3">Classification</th>
            <th scope="col" className="px-4 py-3 text-right">Hourly</th>
            <th scope="col" className="px-4 py-3 text-right">Weekly (38 hrs)</th>
            <th scope="col" className="px-4 py-3 text-right">{awardSalary ? "Annual (award salary)" : "Annual (weekly × 52)"}</th>
            {casual ? <th scope="col" className="px-4 py-3 text-right">Casual hourly</th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
          {table.rows.map((row: RateRow) => {
            const isHeadline = row.label === headlineLabel;
            return (
              <tr key={row.label} className={isHeadline ? "bg-eucalyptus-light/30" : undefined}>
                <th scope="row" className="px-4 py-3 text-left font-medium text-navy">
                  {row.label}
                  {row.note ? <span className="block text-xs font-normal text-warmgray">{row.note}</span> : null}
                </th>
                <td className="px-4 py-3 text-right font-semibold text-navy">{money(row.hourly)}</td>
                <td className="px-4 py-3 text-right">{money(row.weekly)}</td>
                <td className="px-4 py-3 text-right">{formatAUD(rowAnnual(row))}</td>
                {casual ? <td className="px-4 py-3 text-right">{casualCell(row.casualHourly)}</td> : null}
              </tr>
            );
          })}
        </tbody>
      </TableShell>
      {someCasualMissing ? (
        <p className="mt-2 text-xs text-warmgray">A dash means the award sets no casual rate for that classification.</p>
      ) : null}
    </div>
  );
}

export default function JobPayRatesOccupationPage({ occ }: { occ: Occupation }) {
  const headline = headlineRow(occ);
  const headlineAnnual = headline ? rowAnnual(headline) : null;
  const headlineTable = occ.headline ? occ.tables.find((t) => t.id === occ.headline!.tableId) : undefined;
  const medianAnnual = occ.median ? annualFromWeekly(occ.median.medianWeekly) : null;
  const afterTaxBase = headlineAnnual ?? medianAnnual;
  const net = afterTaxBase !== null ? afterTax(afterTaxBase) : null;
  const authorship = getGuideAuthorship("job-pay-rates");
  // Pages with ATO figures lead with what people earn and the take-home on
  // each figure; the award tables follow.
  const salaryPage = occ.ato !== undefined;
  // An award-free page without ATO figures leads with the market median.
  const leadWithMedian = !salaryPage && !occ.award && occ.median !== null;
  // Award-free pages carry only the National Minimum Wage row, which the
  // coverage section states in one line instead of a table.
  const nmw = occ.award ? undefined : occ.tables.flatMap((t) => t.rows).find((r) => r.label.startsWith("National Minimum Wage"));
  const hasPenaltyRules = occ.award !== null && (occ.penalties.length > 0 || occ.overtime.length > 0);
  const anyCasual = occ.tables.some((t) => t.rows.some((r) => r.casualHourly !== null));
  const showPenaltyCasual = occ.penalties.some((p) => p.casual !== "—");
  const ownPayslipNotes = (occ.payslipNotes ?? []).filter((n) => !GENERIC_PAYSLIP_NOTES.has(n));
  const related = relatedOccupations(occ);
  const sector = JOB_SECTORS.find((s) => s.id === OCCUPATION_SECTOR[occ.slug]);
  const sourceLinks: SourceLink[] = occ.sources.map((s) => ({ title: s.title, url: s.url, publisher: s.publisher }));

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          trail={[
            { href: "/", label: "Pay Calculator" },
            { href: "/job-pay-rates/", label: "Job Pay Rates" },
            ...(occ.parent ? [{ href: occ.parent.href, label: occ.parent.label }] : []),
            { label: `${occ.name} Pay Rates` },
          ]}
        />

        <header className="mb-10 max-w-4xl lg:mb-16">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            {occupationHeading(occ)}
          </h1>
          {occ.lede ? (
            <p className="mb-6 text-xl leading-relaxed text-warmgray">{occ.lede}</p>
          ) : headline && occ.award && occ.headline && headlineAnnual !== null ? (
            <p className="mb-6 text-xl leading-relaxed text-warmgray">
              The award minimum for {occ.headline.why} is{" "}
              <strong className="text-navy">{money(headline.hourly)} an hour</strong> —{" "}
              {money(headline.weekly)} a week or {formatAUD(headlineAnnual)} a year full-time — under the{" "}
              {occ.award.name} [{occ.award.code}], from {occ.ratesFrom ?? JOB_PAY_RATES_FROM}.
              {headline.casualHourly !== null ? (
                <> A casual on the same classification earns at least {money(headline.casualHourly)} an hour</>
              ) : null}
              {net ? (
                <>
                  {headline.casualHourly !== null ? ", and a" : " A"} full-timer takes home about{" "}
                  {formatAUD(net.netWeekly, 0)} a week after tax
                </>
              ) : null}
              .
            </p>
          ) : occ.median && medianAnnual !== null ? (
            <p className="mb-6 text-xl leading-relaxed text-warmgray">
              {occ.plural[0].toUpperCase() + occ.plural.slice(1)} are not covered by a modern award, so the legal floor
              is the National Minimum Wage. In practice, full-time {occ.plural} earn a median of{" "}
              <strong className="text-navy">{formatAUD(occ.median.medianWeekly)} a week</strong> (about{" "}
              {formatAUD(medianAnnual)} a year) before tax, according to Jobs and Skills Australia
              {net ? <> — about {formatAUD(net.netWeekly, 0)} a week after tax</> : null}.
            </p>
          ) : null}
          <TrustBar className="!max-w-none" />
          <FeaturedImage lazy className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            {occ.notices.length > 0 && (
              <div className="not-prose mb-8 space-y-3">
                {occ.notices.map((notice) => (
                  <div key={notice} className="flex gap-3 rounded-lg border border-sandstone-dark/30 bg-sandstone/50 p-4">
                    <Info className="mt-0.5 h-5 w-5 shrink-0 text-eucalyptus-dark" aria-hidden="true" />
                    <p className="text-sm text-navy">{notice}</p>
                  </div>
                ))}
              </div>
            )}

            {salaryPage ? (
              <SalaryFiguresSection occ={occ} payslipLink={ownPayslipNotes.length === 0 && (occ.payslipNotes ?? []).length > 0} />
            ) : null}

            {leadWithMedian ? <MedianSection occ={occ} heading={`What ${occ.plural} actually earn`} /> : null}

            {occ.award ? (
              <section id="pay-rates">
                <h2 style={HEADING_FONT}>{occ.name} award pay rates 2026–27</h2>
                {occ.lede ? <p>These rates apply from {occ.ratesFrom ?? JOB_PAY_RATES_FROM}.</p> : null}
                {occ.tables.map((t) => (
                  <RatesTable key={t.id} table={t} headlineLabel={occ.headline?.tableId === t.id ? occ.headline.label : undefined} />
                ))}
                {anyCasual ? (
                  <p className="text-base">
                    Casual hourly rates include the 25% casual loading (
                    <Link href="/casual-loading-calculator/">casual loading calculator</Link>).
                  </p>
                ) : null}
              </section>
            ) : null}

            <section id="award">
              <h2 style={HEADING_FONT}>
                {occ.award ? `Which award covers ${occ.plural}` : `Is there an award for ${occ.plural}?`}
              </h2>
              {occ.parent ? (
                <p>
                  Part of <Link href={occ.parent.href}>{occ.parent.label}</Link>, {occ.parent.blurb}.
                </p>
              ) : null}
              {occ.coverage.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {occ.award ? (
                <p>
                  Read the{" "}
                  <a href={occ.award.url} target="_blank" rel="noreferrer noopener">
                    {occ.award.name} [{occ.award.code}]
                  </a>{" "}
                  on the Fair Work Commission&rsquo;s site (consolidated to {occ.award.consolidatedTo})
                  {occ.award.awardPageHref ? (
                    <>
                      , or see every classification on our{" "}
                      <Link href={occ.award.awardPageHref}>{occ.award.code} award rates page</Link>
                    </>
                  ) : null}
                  .
                </p>
              ) : nmw ? (
                <p>
                  {occ.coverageMode === "depends" ? "If no award covers you, the" : "The"} legal floor is the National
                  Minimum Wage: <strong>{money(nmw.hourly)} an hour</strong>, {money(nmw.weekly)} a week, for adults from{" "}
                  {JOB_PAY_RATES_FROM} (<Link href="/minimum-wage-australia/">minimum wage guide</Link>). Penalty rates and
                  overtime then come from your contract or enterprise agreement (
                  <Link href="/overtime-penalty-rates-guide/">overtime and penalty rates guide</Link>).
                </p>
              ) : null}
            </section>

            {(occ.sections ?? []).map((s) => (
              <section key={s.id} id={s.id}>
                <h2 style={HEADING_FONT}>{s.heading}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                {s.table ? (
                  <div className="not-prose mb-6">
                    <TableShell minWidth="34rem" caption={s.table.caption}>
                      <thead className="bg-sandstone font-semibold text-navy">
                        <tr>
                          {s.table.head.map((h, i) => (
                            <th key={h} scope="col" className={`px-4 py-3${i > 0 ? " text-right" : ""}`}>
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                        {s.table.rows.map((row) => (
                          <tr key={row[0]}>
                            {row.map((cell, i) =>
                              i === 0 ? (
                                <th key={`${row[0]}-h`} scope="row" className="px-4 py-3 text-left font-medium text-navy">
                                  {cell}
                                </th>
                              ) : (
                                <td key={`${row[0]}-${s.table!.head[i]}`} className="px-4 py-3 text-right">
                                  {cell}
                                </td>
                              ),
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </TableShell>
                    {s.table.note ? <p className="mt-2 text-xs text-warmgray">{s.table.note}</p> : null}
                  </div>
                ) : null}
              </section>
            ))}

            {hasPenaltyRules && (
              <section id="penalty-rates">
                <h2 style={HEADING_FONT}>
                  {occ.name} penalty rates{occ.overtime.length > 0 ? " and overtime" : ""}
                </h2>
                {occ.penalties.length > 0 && (
                  <TableShell minWidth="30rem" caption={`${occ.name} penalty rates`}>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-4 py-3">When you work</th>
                        <th scope="col" className="px-4 py-3 text-right">Full-time / part-time</th>
                        {showPenaltyCasual ? <th scope="col" className="px-4 py-3 text-right">Casual</th> : null}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {occ.penalties.map((p) => (
                        <tr key={p.when}>
                          <th scope="row" className="px-4 py-3 text-left font-medium text-navy">{p.when}</th>
                          <td className="px-4 py-3 text-right">{p.permanent}</td>
                          {showPenaltyCasual ? <td className="px-4 py-3 text-right">{p.casual}</td> : null}
                        </tr>
                      ))}
                    </tbody>
                  </TableShell>
                )}
                <p>{occ.penaltiesNote}</p>
                {occ.overtime.length > 0 && (
                  <>
                    <h3 style={HEADING_FONT}>Overtime</h3>
                    <ul>
                      {occ.overtime.map((o) => (
                        <li key={o}>{o}</li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            )}

            {occ.allowances.length > 0 && (
              <section id="allowances">
                <h2 style={HEADING_FONT}>Allowances</h2>
                <TableShell minWidth="30rem" caption={`${occ.name} allowances`}>
                  <thead className="bg-sandstone font-semibold text-navy">
                    <tr>
                      <th scope="col" className="px-4 py-3">Allowance</th>
                      <th scope="col" className="px-4 py-3">Amount</th>
                      <th scope="col" className="px-4 py-3">When it applies</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {occ.allowances.map((a) => (
                      <tr key={a.name}>
                        <th scope="row" className="px-4 py-3 text-left font-medium text-navy">{a.name}</th>
                        <td className="px-4 py-3 whitespace-nowrap">{a.amount}</td>
                        <td className="px-4 py-3">{a.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </TableShell>
              </section>
            )}

            {!salaryPage && afterTaxBase !== null && (
              <section id="after-tax">
                <h2 style={HEADING_FONT}>{occ.name} pay after tax</h2>
                <TableShell
                  minWidth="36rem"
                  caption={headlineTable ? `${occ.name} take-home pay by classification` : `${occ.name} take-home pay`}
                >
                  <thead className="bg-sandstone font-semibold text-navy">
                    <tr>
                      <th scope="col" className="px-4 py-3">{headlineTable ? "Classification" : "Figure"}</th>
                      <th scope="col" className="px-4 py-3 text-right">Gross a year</th>
                      <th scope="col" className="px-4 py-3 text-right">Tax and Medicare</th>
                      <th scope="col" className="px-4 py-3 text-right">Take-home a year</th>
                      <th scope="col" className="px-4 py-3 text-right">A week</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {(headlineTable
                      ? headlineTable.rows.map((r) => ({ label: r.label, gross: rowAnnual(r) }))
                      : [{ label: `Median full-time pay — ${occ.median!.anzscoTitle}`, gross: afterTaxBase }]
                    ).map((f) => {
                      const t = afterTax(f.gross);
                      return (
                        <tr key={f.label} className={f.label === occ.headline?.label ? "bg-eucalyptus-light/30" : undefined}>
                          <th scope="row" className="px-4 py-3 text-left font-medium text-navy">{f.label}</th>
                          <td className="px-4 py-3 text-right">{formatAUD(f.gross)}</td>
                          <td className="px-4 py-3 text-right">{formatNegAUD(t.tax + t.medicare, 0, "−")}</td>
                          <td className="px-4 py-3 text-right font-semibold text-navy">{formatAUD(t.netAnnual)}</td>
                          <td className="px-4 py-3 text-right">{formatAUD(t.netWeekly, 0)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </TableShell>
                <p>
                  2026–27 resident rates with the Medicare levy and no HECS-HELP; super is paid on top. Full breakdown:{" "}
                  <TakeHomeLink annual={afterTaxBase} />, or put in your own hours with the{" "}
                  <Link href="/weekly-pay-calculator/">weekly pay calculator</Link>.
                </p>
                <TakeHomeButton />
              </section>
            )}

            {!salaryPage && !leadWithMedian ? <MedianSection occ={occ} heading={`What ${occ.plural} actually earn`} /> : null}

            {occ.spokes && occ.spokes.length > 0 && (
              <section id="disciplines">
                <h2 style={HEADING_FONT}>{occ.name} pay by discipline</h2>
                <p>
                  The award minimums above apply to every discipline. These pages add what each discipline earns on ATO
                  tax returns and in Jobs and Skills Australia data, and the take-home pay on those figures.
                </p>
                <ul>
                  {occ.spokes.map((sp) => (
                    <li key={sp.href}>
                      <Link href={sp.href}>{sp.label}</Link> — {sp.blurb}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {ownPayslipNotes.length > 0 && (
              <section id="payslip">
                <h2 style={HEADING_FONT}>Checking a {occ.name.toLowerCase()} payslip</h2>
                <ul>
                  {ownPayslipNotes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
                <p>
                  The lines every payslip must show are in{" "}
                  <Link href="/understanding-your-payslip/">understanding your payslip</Link>.
                </p>
              </section>
            )}

            {occ.notShown.length > 0 && (
              <section id="not-shown">
                <h2 style={HEADING_FONT}>What this page does not show</h2>
                <ul>
                  {occ.notShown.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </section>
            )}

            {occ.faqs.length > 0 && (
              <section id="faq">
                <h2 style={HEADING_FONT}>{occ.name} pay questions</h2>
                <FaqList faqs={occ.faqs} />
              </section>
            )}

            {related.length > 0 && (
              <section id="other-jobs">
                <h2 style={HEADING_FONT}>Pay rates for related jobs</h2>
                <div className="not-prose mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {related.map((o) => {
                    const figure = glanceFigure(o);
                    return (
                      <SidebarLink
                        key={o.slug}
                        href={`/job-pay-rates/${o.slug}/`}
                        label={figure ? `${o.name}: ${figure}` : `${o.name} pay rates`}
                      />
                    );
                  })}
                </div>
                {sector ? (
                  <p>
                    Every {sector.title.toLowerCase()} job is on the{" "}
                    <Link href={`/job-pay-rates/#${sector.id}`}>job pay rates hub</Link>.
                  </p>
                ) : null}
              </section>
            )}

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this page is sourced">
                <p>
                  {occ.award
                    ? `Minimum rates: the ${occ.award.name}, consolidated to ${occ.award.consolidatedTo}, read on ${occ.verifiedOn}.`
                    : occ.coverageMode === "depends"
                      ? `No modern award names this job, so award coverage turns on your employer's industry and duties. Legal floor: the National Minimum Wage Order 2026, read on ${occ.verifiedOn}.`
                      : `Award coverage: the Fair Work Ombudsman's guidance. Legal floor: the National Minimum Wage Order 2026, read on ${occ.verifiedOn}.`}
                  {occ.ato ? ` Income: ATO Taxation statistics ${occ.ato.incomeYear}, Individuals Table 15A, as published.` : ""}
                  {occ.median
                    ? ` Median: Jobs and Skills Australia, ${occ.median.anzscoTitle} (ANZSCO ${occ.median.anzscoCode}).`
                    : ""}
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={sourceLinks} lastVerified={occ.verifiedOn} />
              {authorship ? (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />
              ) : null}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 text-base font-bold text-navy">{occ.name} pay at a glance</h2>
                  <dl className="space-y-3 text-sm">
                    {headline && (
                      <>
                        <div className="flex items-baseline justify-between gap-3">
                          <dt className="text-warmgray">Award minimum</dt>
                          <dd className="font-semibold text-navy">{money(headline.hourly)}/hr</dd>
                        </div>
                        {headline.casualHourly !== null && (
                          <div className="flex items-baseline justify-between gap-3">
                            <dt className="text-warmgray">Casual minimum</dt>
                            <dd className="font-semibold text-navy">{money(headline.casualHourly)}/hr</dd>
                          </div>
                        )}
                      </>
                    )}
                    {occ.ato && occ.ato.rows[0] && (
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-warmgray">ATO median salary ({occ.ato.incomeYear})</dt>
                        <dd className="font-semibold text-navy">{formatAUD(occ.ato.rows[0].medianSalary)}</dd>
                      </div>
                    )}
                    {occ.median && (
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-warmgray">Median (full-time)</dt>
                        <dd className="font-semibold text-navy">{formatAUD(occ.median.medianWeekly)}/wk</dd>
                      </div>
                    )}
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Award</dt>
                      <dd className="text-right font-semibold text-navy">
                        {occ.award ? occ.award.code : occ.coverageMode === "depends" ? "Depends on employer" : "Award-free"}
                      </dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-warmgray">Verified</dt>
                      <dd className="font-semibold text-navy">{occ.verifiedOn}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 text-base font-bold text-navy">Related pages</h2>
                  <div className="space-y-3">
                    <SidebarLink href="/weekly-pay-calculator/" label="Weekly Pay Calculator" />
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    {hasPenaltyRules && !occ.related.some((r) => r.href === "/overtime-pay-calculator/") ? (
                      <SidebarLink href="/overtime-pay-calculator/" label="Overtime Pay Calculator" />
                    ) : null}
                    {occ.parent ? <SidebarLink href={occ.parent.href} label={occ.parent.label} /> : null}
                    {occ.related.map((r) => (
                      <SidebarLink key={r.href} href={r.href} label={r.label} />
                    ))}
                    <SidebarLink href="/job-pay-rates/" label="All job pay rates" />
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

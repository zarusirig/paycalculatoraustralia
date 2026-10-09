import Link from "next/link";
import { ArrowRight, Calculator, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { MEDICARE_LEVY, formatAUD, formatNegAUD } from "@/lib/constants";
import { ATO_DEFINITION, JOB_PAY_RATES_FROM, MEDIAN_DEFINITION } from "@/lib/data/job-pay-rates/common";
import {
  OCCUPATIONS,
  afterTax,
  annualFromWeekly,
  headlineRow,
  rowAnnual,
  isExactTakeHomeAmount,
  nearestTakeHomeAmount,
  takeHomeHref,
  type Occupation,
  type RateRow,
  type RateTable,
} from "@/lib/data/job-pay-rates";
import { Breadcrumbs, FaqList, HEADING_FONT, SidebarLink, TableShell } from "./job-pay-shared";

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

/** ATO and JSA figures, then take-home pay on each. Salary pages lead with this. */
function SalaryFiguresSection({ occ }: { occ: Occupation }) {
  const lead = occ.ato?.rows[0];
  const figures = salaryFigures(occ);
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
          <p className="text-base">{ATO_DEFINITION}</p>
        </section>
      ) : null}

      {occ.median ? (
        <section id="actual-earnings">
          <h2 style={HEADING_FONT}>Median full-time pay</h2>
          <p>
            Jobs and Skills Australia puts median full-time earnings for{" "}
            <a href={occ.median.url} target="_blank" rel="noreferrer noopener">
              {occ.median.anzscoTitle} (ANZSCO {occ.median.anzscoCode})
            </a>{" "}
            at <strong>{formatAUD(occ.median.medianWeekly)} a week</strong> ({formatAUD(occ.median.medianHourly)} an
            hour), against {formatAUD(occ.median.allOccupationsWeekly)} a week for all occupations.
          </p>
          <p className="text-base">{MEDIAN_DEFINITION}</p>
        </section>
      ) : null}

      {figures.length > 0 ? (
        <section id="after-tax">
          <h2 style={HEADING_FONT}>{occ.name} pay after tax</h2>
          <p>
            What each figure on this page leaves after income tax and the Medicare levy, worked out with the same tax
            engine as the rest of this site. Use the row nearest your own salary to sense-check the net pay on your
            payslip.
          </p>
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
            2026–27 resident tax rates with the low income tax offset and the 2% Medicare levy; no HECS-HELP repayment
            and no Medicare levy surcharge. Superannuation is paid on top by your employer. Your employer withholds tax
            each pay from the ATO&rsquo;s withholding schedules, so the tax on a payslip will not match these annual
            figures to the dollar. For the full breakdown see <TakeHomeLink annual={figures[figures.length - 1].gross} />, or
            enter your own salary below.
          </p>
          {figures.some((f) => f.gross >= MEDICARE_LEVY.surcharge.tier1.min) ? (
            <p>
              The table assumes private hospital cover. A single person without it pays the{" "}
              <Link href="/medicare-levy-surcharge-calculator/">Medicare levy surcharge</Link> of 1% to 1.5% once
              their income for surcharge purposes passes {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)} (2026–27),
              which would lower the take-home on the higher rows.
            </p>
          ) : null}
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
        </section>
      ) : null}
    </>
  );
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

/** A casual rate, or a dash where the award sets none for the classification. */
function casualCell(n: number | null): string {
  return n === null ? "—" : money(n);
}

function RatesTable({ table, headlineLabel }: { table: RateTable; headlineLabel?: string }) {
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
            <th scope="col" className="px-4 py-3 text-right">Annual</th>
            <th scope="col" className="px-4 py-3 text-right">Casual hourly</th>
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
                <td className="px-4 py-3 text-right">{casualCell(row.casualHourly)}</td>
              </tr>
            );
          })}
        </tbody>
      </TableShell>
      <p className="mt-2 text-xs text-warmgray">
        {table.rows.some((r) => r.annual !== undefined)
          ? "Annual is the award's own full-time annual salary"
          : "Annual is the weekly rate × 52"}
        , before tax and before superannuation.{" "}
        {table.rows.some((r) => r.casualHourly === null)
          ? "A dash means the award sets no casual rate for that classification."
          : "Casual hourly includes the 25% casual loading."}
      </p>
    </div>
  );
}

export default function JobPayRatesOccupationPage({ occ }: { occ: Occupation }) {
  const headline = headlineRow(occ);
  const headlineAnnual = headline ? rowAnnual(headline) : null;
  const medianAnnual = occ.median ? annualFromWeekly(occ.median.medianWeekly) : null;
  const afterTaxBase = headlineAnnual ?? medianAnnual;
  const net = afterTaxBase !== null ? afterTax(afterTaxBase) : null;
  const authorship = getGuideAuthorship("job-pay-rates");
  const others = OCCUPATIONS.filter((o) => o.slug !== occ.slug);
  // Pages with ATO figures lead with what people earn and the take-home on
  // each figure; the award section follows.
  const salaryPage = occ.ato !== undefined;
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

            {salaryPage ? <SalaryFiguresSection occ={occ} /> : null}

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
              ) : null}
            </section>

            <section id="pay-rates">
              <h2 style={HEADING_FONT}>
                {occ.name} {occ.award ? "award pay rates" : "minimum pay"} 2026–27
              </h2>
              <p>
                These rates apply from {occ.ratesFrom ?? JOB_PAY_RATES_FROM}. Part-time employees are paid the same hourly rates for the
                hours they work.
              </p>
              {occ.tables.map((t) => (
                <RatesTable key={t.id} table={t} headlineLabel={occ.headline?.tableId === t.id ? occ.headline.label : undefined} />
              ))}
            </section>

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
                      <th scope="col" className="px-4 py-3 text-right">Casual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {occ.penalties.map((p) => (
                      <tr key={p.when}>
                        <th scope="row" className="px-4 py-3 text-left font-medium text-navy">{p.when}</th>
                        <td className="px-4 py-3 text-right">{p.permanent}</td>
                        <td className="px-4 py-3 text-right">{p.casual}</td>
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
                  <p>
                    Work out a shift with penalties or overtime using the{" "}
                    <Link href="/overtime-pay-calculator/">overtime pay calculator</Link>.
                  </p>
                </>
              )}
            </section>

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

            {!salaryPage && net && afterTaxBase !== null && (
              <section id="after-tax">
                <h2 style={HEADING_FONT}>{occ.name} pay after tax</h2>
                <p>
                  {headline
                    ? `On the ${headline.label} rate of ${money(headline.weekly)} a week, a full-time ${occ.name.toLowerCase()} earns ${formatAUD(afterTaxBase)} a year before tax.`
                    : `On the median of ${formatAUD(occ.median!.medianWeekly)} a week, a full-time ${occ.name.toLowerCase()} earns about ${formatAUD(afterTaxBase)} a year before tax.`}
                </p>
                <TableShell minWidth="26rem" caption={`${occ.name} take-home pay`}>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    <tr>
                      <th scope="row" className="px-4 py-3 text-left font-medium text-navy">Gross annual pay</th>
                      <td className="px-4 py-3 text-right">{formatAUD(afterTaxBase)}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 text-left font-medium text-navy">Income tax (after LITO)</th>
                      <td className="px-4 py-3 text-right">{formatNegAUD(net.tax, 0, "−")}</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 text-left font-medium text-navy">Medicare levy</th>
                      <td className="px-4 py-3 text-right">{formatNegAUD(net.medicare, 0, "−")}</td>
                    </tr>
                    <tr className="bg-sandstone/40">
                      <th scope="row" className="px-4 py-3 text-left font-semibold text-navy">Take-home per year</th>
                      <td className="px-4 py-3 text-right font-semibold text-navy">{formatAUD(net.netAnnual)}</td>
                    </tr>
                    <tr className="bg-sandstone/40">
                      <th scope="row" className="px-4 py-3 text-left font-semibold text-navy">Take-home per week</th>
                      <td className="px-4 py-3 text-right font-semibold text-navy">{formatAUD(net.netWeekly, 0)}</td>
                    </tr>
                  </tbody>
                </TableShell>
                <p>
                  2026–27 resident tax rates with the low income tax offset and the 2% Medicare levy; no HECS-HELP
                  repayment and no Medicare levy surcharge. Superannuation is paid on top by your employer. For the full
                  breakdown see <TakeHomeLink annual={afterTaxBase} />, or put in your own hours with the{" "}
                  <Link href="/weekly-pay-calculator/">weekly pay calculator</Link>.
                </p>
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
              </section>
            )}

            {!salaryPage && occ.median && (
              <section id="actual-earnings">
                <h2 style={HEADING_FONT}>What {occ.plural} actually earn</h2>
                <p>
                  Jobs and Skills Australia puts median full-time earnings for{" "}
                  <a href={occ.median.url} target="_blank" rel="noreferrer noopener">
                    {occ.median.anzscoTitle} (ANZSCO {occ.median.anzscoCode})
                  </a>{" "}
                  at <strong>{formatAUD(occ.median.medianWeekly)} a week</strong> ({formatAUD(occ.median.medianHourly)} an
                  hour), against {formatAUD(occ.median.allOccupationsWeekly)} a week for all occupations.
                </p>
                <p className="text-base">{MEDIAN_DEFINITION}</p>
              </section>
            )}

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

            {occ.payslipNotes && occ.payslipNotes.length > 0 && (
              <section id="payslip">
                <h2 style={HEADING_FONT}>Checking a {occ.name.toLowerCase()} payslip</h2>
                <ul>
                  {occ.payslipNotes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
                <p>
                  For what every line on a payslip should show, see{" "}
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

            <section id="faq">
              <h2 style={HEADING_FONT}>{occ.name} pay questions</h2>
              <FaqList faqs={occ.faqs} />
            </section>

            <section id="other-jobs">
              <h2 style={HEADING_FONT}>Pay rates for other jobs</h2>
              <div className="not-prose mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {others.map((o) => (
                  <SidebarLink key={o.slug} href={`/job-pay-rates/${o.slug}/`} label={`${o.name} pay rates`} />
                ))}
              </div>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this page is sourced">
                <p>
                  {occ.award
                    ? `Every minimum rate was read from the Fair Work Commission's consolidated text of the ${occ.award.name}, consolidated to ${occ.award.consolidatedTo}, on ${occ.verifiedOn}. Casual rates are the award's own published figures wherever it publishes them. Nothing is estimated.`
                    : occ.coverageMode === "depends"
                      ? `No modern award names this job, so this page does not say which award, if any, covers you: that turns on your employer's industry and your duties. The minimum shown is the National Minimum Wage Order 2026, read on ${occ.verifiedOn}.`
                      : `Award coverage is taken from the Fair Work Ombudsman's published guidance and the minimum from the National Minimum Wage Order 2026, read on ${occ.verifiedOn}.`}
                </p>
                {occ.ato ? (
                  <p>
                    Income figures are the ATO&rsquo;s Taxation statistics {occ.ato.incomeYear}, Individuals Table 15A,
                    exactly as published: the occupation is what each person wrote on their tax return.
                  </p>
                ) : null}
                <p>
                  The median comes from Jobs and Skills Australia&rsquo;s occupation profile and is a market figure, not an
                  entitlement. Take-home figures use the same tax engine as the rest of this site. Award rates change every
                  1 July, so re-check after the next Annual Wage Review.
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

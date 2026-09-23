// =============================================================================
// /australian-pay-report-2026/ — F8 (Lever D) linkable data study.
//
// Every number is computed in lib/data/pay-report from the site's verified
// constants; this file only lays it out. The same functions produce the CSV
// downloads and the Dataset JSON-LD, so the three can never disagree.
// =============================================================================

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG } from "@/lib/constants/australian-tax";
import { AWE_RELEASE, EE_RELEASE, EEH_RELEASE } from "@/lib/data/average-salary";
import { NMW_DECISION } from "@/lib/constants/minimum-wage";
import {
  PUBLIC_SECTOR_NOT_COVERED,
  REPORT,
  REPORT_CSV_FILES,
  awardRanking,
  citationHtml,
  hoursToEarn,
  keyFindings,
  maxTaxCutGain,
  publicSectorRows,
  reportCsvHref,
  suggestedCitation,
  takeHomeRows,
  wageBenchmarks,
  type PublicSectorGroup,
  type ReportCsvFile,
} from "@/lib/data/pay-report";
import CopySnippet from "@/modules/guide/copy-snippet";

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const td = "px-3 py-2";

const aud = (n: number, dp = 0) =>
  `$${n.toLocaleString("en-AU", { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;
const pct = (n: number, dp = 1) => `${(n * 100).toFixed(dp)}%`;
const signed = (n: number, dp = 0) => (n > 0 ? `+${aud(n, dp)}` : aud(n, dp));

export const REPORT_SOURCES: SourceLink[] = [
  { title: "Tax rates – Australian residents (2025-26 and 2026-27)", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: "Australian Taxation Office" },
  { title: "Personal income tax – new tax cuts for every Australian taxpayer", url: "https://www.ato.gov.au/about-ato/new-legislation/in-detail/individuals/personal-income-tax-new-tax-cuts-for-every-australian-taxpayer", publisher: "Australian Taxation Office" },
  { title: "Low income tax offset", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset", publisher: "Australian Taxation Office" },
  { title: `${NMW_DECISION.name} decision ${NMW_DECISION.citation}`, url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews", publisher: "Fair Work Commission" },
  { title: "Pay guides for modern awards", url: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/pay-guides", publisher: "Fair Work Ombudsman" },
  { title: `${AWE_RELEASE.title}, ${AWE_RELEASE.referencePeriod}`, url: AWE_RELEASE.url, publisher: "Australian Bureau of Statistics" },
  { title: `${EE_RELEASE.title}, ${EE_RELEASE.referencePeriod}`, url: EE_RELEASE.url, publisher: "Australian Bureau of Statistics" },
  { title: `${EEH_RELEASE.title}, ${EEH_RELEASE.referencePeriod}`, url: EEH_RELEASE.url, publisher: "Australian Bureau of Statistics" },
];

function Table({ caption, head, children, minWidth = 560 }: { caption: string; head: string[]; children: ReactNode; minWidth?: number }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
      <table className="w-full text-left text-sm text-navy" style={{ minWidth }}>
        <caption className="caption-top bg-white px-3 pt-3 pb-1 text-left text-xs font-semibold uppercase tracking-wide text-warmgray">{caption}</caption>
        <thead className="bg-sandstone font-semibold">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-3 py-2.5">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white tabular-nums">{children}</tbody>
      </table>
    </div>
  );
}

/**
 * Single-series horizontal bars. HTML rather than SVG so long labels wrap on a
 * phone; the table beside it is the accessible view, so the bars are hidden
 * from assistive tech. One hue (eucalyptus), 4px rounded data end, 2px gap.
 */
function Bars({ rows, format, highlight }: { rows: { label: string; value: number; note?: string }[]; format: (n: number) => string; highlight?: (label: string) => boolean }) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <figure className="not-prose my-6 rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm" aria-hidden="true">
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[minmax(0,11rem)_1fr] items-center gap-3 sm:grid-cols-[minmax(0,16rem)_1fr]" title={`${r.label}: ${format(r.value)}`}>
            <span className="truncate text-xs text-warmgray sm:text-sm">{r.label}</span>
            <div className="flex items-center gap-2">
              <div
                className={`h-4 rounded-r ${highlight?.(r.label) ? "bg-navy" : "bg-eucalyptus"}`}
                style={{ width: `${Math.max(2, (r.value / max) * 100) * 0.8}%` }}
              />
              <span className="whitespace-nowrap text-xs font-semibold text-navy tabular-nums">{format(r.value)}</span>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}

function CsvLink({ file }: { file: ReportCsvFile }) {
  const meta = REPORT_CSV_FILES.find((f) => f.file === file)!;
  return (
    <p className="not-prose text-sm">
      <a href={reportCsvHref(file)} download className="inline-flex items-center gap-1.5 font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
        <Download className="h-4 w-4" aria-hidden="true" /> Download this table (CSV)
      </a>
      <span className="sr-only">: {meta.title}</span>
    </p>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-warmgray">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-navy" style={HEADING_FONT}>{value}</p>
      <p className="mt-1 text-xs text-warmgray">{sub}</p>
    </div>
  );
}

const GROUPS: PublicSectorGroup[] = ["Teachers", "Registered nurses", "Public service"];

export default function AustralianPayReport() {
  const authorship = getGuideAuthorship(REPORT.slug);
  const cut = maxTaxCutGain();
  const takeHome = takeHomeRows();
  const bench = wageBenchmarks();
  const awards = awardRanking();
  const sector = publicSectorRows();
  const hours = hoursToEarn();
  const findings = keyFindings();
  const nmw = bench.find((b) => b.id === "nmw")!;
  const avg = bench.find((b) => b.id === "average-ft")!;
  const fy = SITE_CONFIG.financialYear;
  const prev = SITE_CONFIG.previousFinancialYear;

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">{REPORT.title}</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl lg:mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-eucalyptus-dark">Data study · version {REPORT.version}</p>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={HEADING_FONT}>
            {REPORT.title}: Take-Home Pay, Minimum Wage and Award Rates
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">
            What Australians actually take home in {fy}, what the 1 July 2026 tax cut changed, how the minimum wage compares with
            the median and the average, how {awards.length} award minimums rank, and what teachers, nurses and public servants earn
            in each state. Every figure is computed from ATO rates, Fair Work Commission decisions, ABS earnings releases and
            published state pay scales, and every table can be downloaded as CSV.
          </p>
          <div className="not-prose mb-6 grid gap-3 sm:grid-cols-3">
            <Stat label="Most the 2026 tax cut is worth" value={aud(cut.perYear)} sub={`a year (${aud(cut.perWeek, 2)} a week), from ${aud(cut.fromIncome)}`} />
            <Stat label="Minimum wage take-home" value={aud(nmw.takeHome)} sub={`a year on ${aud(nmw.annual)} full-time, ${fy}`} />
            <Stat label="Average full-time take-home" value={aud(avg.takeHome)} sub={`a year on ${aud(avg.annual)} (ABS ${AWE_RELEASE.referencePeriod})`} />
          </div>
          <p className="mb-6 text-sm text-warmgray">
            Published <time dateTime={REPORT.publishedIso}>{REPORT.publishedOn}</time> · updated{" "}
            <time dateTime={REPORT.updatedIso}>{REPORT.updatedOn}</time> · free to reuse under {REPORT.licenseName} with a link.{" "}
            <a href="#cite" className="font-semibold text-eucalyptus-dark underline">Cite this report</a>
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">

            <section id="key-findings">
              <h2 style={HEADING_FONT}>Key findings</h2>
              <ol>
                {findings.map((f) => <li key={f}>{f}</li>)}
              </ol>
            </section>

            <section id="take-home">
              <h2 style={HEADING_FONT}>Take-home pay at every salary: {prev} vs {fy}</h2>
              <p>
                From 1 July 2026 the tax rate on income between $18,201 and $45,000 fell from 16% to 15%. Nothing else in the resident
                scale moved, so the cut is a flat {aud(cut.perYear)} a year for everyone earning {aud(cut.fromIncome)} or more, and
                less below that. A second legislated cut, to 14% from 1 July 2027, adds the same again. The table shows income tax
                (after the low income tax offset) plus the Medicare levy, and what is left.
              </p>
              <Table caption={`Take-home pay by salary, ${prev} vs ${fy} (resident, full year)`} head={["Salary", `Tax + Medicare ${prev}`, `Take-home ${prev}`, `Tax + Medicare ${fy}`, `Take-home ${fy}`, "Gain / year", "Gain / week", "Take-home 2027-28*", `Avg rate ${fy}`]} minWidth={900}>
                {takeHome.map((r) => (
                  <tr key={r.salary}>
                    <th scope="row" className={`${td} font-medium`}>{aud(r.salary)}</th>
                    <td className={td}>{aud(r.tax2025)}</td>
                    <td className={td}>{aud(r.takeHome2025)}</td>
                    <td className={td}>{aud(r.tax2026)}</td>
                    <td className={`${td} font-semibold`}>{aud(r.takeHome2026)}</td>
                    <td className={td}>{signed(r.gainYear)}</td>
                    <td className={td}>{signed(r.gainWeek, 2)}</td>
                    <td className={td}>{aud(r.takeHome2027)}</td>
                    <td className={td}>{pct(r.averageRate2026)}</td>
                  </tr>
                ))}
              </Table>
              <p className="text-sm">
                * 2027-28 uses the legislated 14% rate on the same thresholds; it is law but not yet in force. Australian resident for
                the full year, no HECS/HELP, no Medicare levy surcharge, no deductions. Medicare levy low-income thresholds are the
                latest the ATO has published ({prev}) for all three years, so the gain column isolates the rate cut. See any salary in
                full on <Link href="/take-home-pay-on/">take-home pay by salary</Link> or use the{" "}
                <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.
              </p>
              <CsvLink file="take-home-pay-by-salary-2025-26-vs-2026-27.csv" />
            </section>

            <section id="minimum-median-average">
              <h2 style={HEADING_FONT}>Minimum wage vs median vs average earnings</h2>
              <p>
                The National Minimum Wage rose 4.75% on 1 July 2026 to {aud(nmw.weekly, 2)} a week. The average full-time wage is{" "}
                {avg.timesMinimum.toFixed(2)} times that. The median sits between the two because the average is lifted by a small
                number of very high earners, and the all-employee figures include part-time workers.
              </p>
              <Bars rows={bench.map((b) => ({ label: b.label, value: b.annual }))} format={(n) => aud(n)} highlight={(l) => l.startsWith("National")} />
              <Table caption="Minimum, median and average earnings, with take-home pay" head={["Measure", "Weekly", "Yearly", "Hourly", `Take-home ${fy}`, "× minimum wage", "Source"]} minWidth={860}>
                {bench.map((b) => (
                  <tr key={b.id}>
                    <th scope="row" className={`${td} font-medium`}>{b.label}</th>
                    <td className={td}>{aud(b.weekly, 2)}</td>
                    <td className={`${td} font-semibold`}>{aud(b.annual)}</td>
                    <td className={td}>{b.hourly === null ? "—" : aud(b.hourly, 2)}</td>
                    <td className={td}>{aud(b.takeHome)}</td>
                    <td className={td}>{b.timesMinimum.toFixed(2)}</td>
                    <td className={`${td} text-xs text-warmgray`}>{b.source}</td>
                  </tr>
                ))}
              </Table>
              <p className="text-sm">
                Yearly = weekly × 52. Hourly for full-time measures = yearly ÷ 1,976 (38 × 52); the all-employee median hourly figure is
                the ABS&apos;s own. Take-home applies the {fy} resident engine to the yearly figure. More on{" "}
                <Link href="/minimum-wage-australia/">the minimum wage</Link> and{" "}
                <Link href="/average-salary-australia/">average salary by state, industry and age</Link>.
              </p>
              <CsvLink file="minimum-vs-median-vs-average-wage.csv" />
            </section>

            <section id="award-minimums">
              <h2 style={HEADING_FONT}>{awards.length} award minimums, ranked</h2>
              <p>
                The entry-level adult rate in each modern award we publish verified tables for, from 1 July 2026 — the rate a new adult
                starter is most likely to be on. Most sit a little above the minimum wage; aged care and nursing sit well above it after
                the Fair Work Commission&apos;s work value decisions.
              </p>
              <Bars rows={awards.map((a) => ({ label: a.name.replace(/ Award \d{4}$/, ""), value: a.hourly }))} format={(n) => aud(n, 2)} />
              <Table caption="Entry-level award minimum rates from 1 July 2026, highest first" head={["#", "Award", "Classification", "Hourly", "Weekly", "Yearly", "vs minimum wage", `Take-home ${fy}`]} minWidth={900}>
                {awards.map((a) => (
                  <tr key={a.code}>
                    <td className={td}>{a.rank}</td>
                    <th scope="row" className={`${td} font-medium`}><Link href={a.href} className="text-eucalyptus-dark hover:underline">{a.name}</Link> <span className="text-xs text-warmgray">{a.code}</span></th>
                    <td className={td}>{a.classification}</td>
                    <td className={`${td} font-semibold`}>{aud(a.hourly, 2)}</td>
                    <td className={td}>{aud(a.weekly, 2)}</td>
                    <td className={td}>{aud(a.annual)}</td>
                    <td className={td}>{a.premiumOverNmw >= 0 ? "+" : ""}{pct(a.premiumOverNmw)}</td>
                    <td className={td}>{aud(a.takeHome)}</td>
                  </tr>
                ))}
              </Table>
              <p className="text-sm">
                Full-time adult rates before penalty rates, loadings and allowances. The Manufacturing C14 rate applies only to the first
                38 hours of induction training, which is why it can sit below the National Minimum Wage. Full classification tables are on
                each award page and on the <Link href="/award-rates/">award rates hub</Link>.
              </p>
              <CsvLink file="award-minimum-rates-ranked.csv" />
            </section>

            <section id="public-sector">
              <h2 style={HEADING_FONT}>Public-sector pay by state</h2>
              <p>
                Entry and top-of-scale salaries for classroom teachers, registered nurses and general public servants, read from each
                state&apos;s current enterprise agreement or award. Public servants run from the bottom of the entry grade to the top of the
                highest non-executive grade.
              </p>
              {GROUPS.map((g) => {
                const rows = sector.filter((r) => r.group === g);
                if (rows.length === 0) return null;
                return (
                  <Table key={g} caption={`${g}: entry and top salary by state`} head={["State / service", "Entry", "Entry salary", "Top", "Top salary", "Rates"]} minWidth={780}>
                    {rows.map((r) => (
                      <tr key={`${g}-${r.code}`}>
                        <th scope="row" className={`${td} font-medium`}><Link href={r.href} className="text-eucalyptus-dark hover:underline">{r.jurisdiction}</Link></th>
                        <td className={`${td} text-xs`}>{r.entryLabel}</td>
                        <td className={`${td} font-semibold`}>{aud(r.entry)}</td>
                        <td className={`${td} text-xs`}>{r.topLabel}</td>
                        <td className={`${td} font-semibold`}>{aud(r.top)}</td>
                        <td className={`${td} text-xs text-warmgray`}>{r.asAt}</td>
                      </tr>
                    ))}
                  </Table>
                );
              })}
              <p className="text-sm">
                Not included yet, and not estimated: {PUBLIC_SECTOR_NOT_COVERED.join("; ")}. Full scales:{" "}
                <Link href="/teacher-pay-australia/">teacher pay</Link>, <Link href="/healthcare-worker-pay/">nurse pay</Link>,{" "}
                <Link href="/public-service-pay-scales/">public service pay scales</Link>.
              </p>
              <CsvLink file="public-sector-pay-by-state.csv" />
            </section>

            <section id="hours-to-earn">
              <h2 style={HEADING_FONT}>Hours of work to earn $1,000</h2>
              <p>
                How long it takes to earn $1,000 before and after tax at four common rates, assuming the rate is worked 38 hours a week
                all year. The last columns put the {aud(cut.perYear)} tax cut into hours of work.
              </p>
              <Table caption="Hours of work to earn $1,000" head={["Rate", "Gross / hour", "Take-home / hour", "Hours for $1,000 gross", "Hours for $1,000 take-home", `Hours to take home ${aud(cut.perYear)}`, "Weeks to take home $10,000"]} minWidth={880}>
                {hours.map((h) => (
                  <tr key={h.id}>
                    <th scope="row" className={`${td} font-medium`}>{h.label}</th>
                    <td className={td}>{aud(h.grossHourly, 2)}</td>
                    <td className={td}>{aud(h.netHourly, 2)}</td>
                    <td className={td}>{h.hoursFor1000Gross}</td>
                    <td className={`${td} font-semibold`}>{h.hoursFor1000Net}</td>
                    <td className={td}>{h.hoursForTaxCut}</td>
                    <td className={td}>{h.weeksFor10000Net}</td>
                  </tr>
                ))}
              </Table>
              <p className="text-sm">
                Take-home per hour = {fy} take-home on (hourly × 1,976) ÷ 1,976. The casual row assumes the casual rate for a full
                38-hour year, which overstates a typical casual&apos;s annual income. Convert any rate with the{" "}
                <Link href="/hourly-to-annual-salary-calculator/">hourly to annual salary calculator</Link>.
              </p>
              <CsvLink file="hours-of-work-to-earn.csv" />
            </section>

            <section id="methodology">
              <h2 style={HEADING_FONT}>Methodology</h2>
              <ul>
                <li><strong>Tax.</strong> ATO resident scales for {prev} (16% second rate) and {fy} (15%), and the legislated 2027-28 scale (14%, Act No. 28 of 2025). Low income tax offset applied and non-refundable. Medicare levy 2% with low-income shading. No HECS/HELP, Medicare levy surcharge, deductions or other offsets. Rounded to the dollar, the same engine as the site&apos;s calculators.</li>
                <li><strong>Minimum wage and awards.</strong> {NMW_DECISION.name} ({NMW_DECISION.citation}), operative {NMW_DECISION.operativeFrom}. Award rates from the Fair Work Ombudsman pay guides and the consolidated award text, full-time adult entry classification.</li>
                <li><strong>Earnings.</strong> ABS Average Weekly Earnings ({AWE_RELEASE.referencePeriod}) for averages; ABS Employee Earnings ({EE_RELEASE.referencePeriod}) for medians. Weekly × 52.</li>
                <li><strong>Public sector.</strong> Each state&apos;s published enterprise agreement, award or salary schedule, as recorded (with the date verified) on the linked state page.</li>
                <li><strong>What this is not.</strong> A survey of actual pay. Award and agreement rates are legal minimums or scale points; many people are paid above them.</li>
              </ul>
            </section>

            <section id="cite">
              <h2 style={HEADING_FONT}>Cite this report</h2>
              <p>
                Journalists, researchers, unions, schools and bloggers are welcome to quote or republish any figure or table under{" "}
                <a href={REPORT.license} target="_blank" rel="noreferrer noopener">{REPORT.licenseName}</a> — the only condition is a link
                back to this page. Permalink: <a href={REPORT.url}>{REPORT.url}</a>
              </p>
              <CopySnippet id="cite-text" label="Suggested citation" text={suggestedCitation()} />
              <CopySnippet id="cite-html" label="Link (HTML)" text={citationHtml()} />
              <h3 style={HEADING_FONT}>Download the data</h3>
              <ul>
                {REPORT_CSV_FILES.map((f) => (
                  <li key={f.file}><a href={reportCsvHref(f.file)} download>{f.title}</a> (CSV)</li>
                ))}
              </ul>
              <p className="text-sm">
                Want the calculator on your own site? <Link href="/embed/">Embed the free take-home pay widget</Link>.
              </p>
            </section>

            <div className="not-prose mt-12">
              <SourceAttribution sources={REPORT_SOURCES} lastVerified={REPORT.updatedOn} />
              {authorship && (
                <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={REPORT.updatedIso} />
              )}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h3 className="mb-3 font-bold text-navy">In this report</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      ["#key-findings", "Key findings"],
                      ["#take-home", `Take-home pay ${prev} vs ${fy}`],
                      ["#minimum-median-average", "Minimum vs median vs average"],
                      ["#award-minimums", "Award minimums ranked"],
                      ["#public-sector", "Public-sector pay by state"],
                      ["#hours-to-earn", "Hours to earn $1,000"],
                      ["#methodology", "Methodology"],
                      ["#cite", "Cite & download"],
                    ].map(([href, label]) => (
                      <a key={href} href={href} className="block text-navy hover:text-eucalyptus-dark hover:underline">{label}</a>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none bg-eucalyptus-dark text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="mb-2 text-lg font-bold">Work out your own take-home pay</h3>
                  <p className="mb-4 text-sm text-eucalyptus-light">The same engine as this report, for your salary, HECS and super.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50">
                    Take-Home Pay Calculator
                  </Link>
                  <Link href="/embed/" className="mt-3 block text-center text-sm text-eucalyptus-light underline hover:text-white">
                    Embed it on your site
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

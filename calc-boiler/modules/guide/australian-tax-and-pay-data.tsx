// =============================================================================
// /australian-tax-and-pay-data/: open tax and pay tables with downloads.
// Every number is read from lib/data/open-data, which reads the site's single
// sources of truth; the same functions produce the CSV/JSON files and the
// Dataset JSON-LD, so page, files and markup cannot disagree.
// =============================================================================

import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight, Download } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import FaqAccordion from "@/components/common/faq-accordion";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG } from "@/lib/constants/australian-tax";
import {
  DATA_FILES,
  JSON_FILE,
  OPEN_DATA,
  allSources,
  citationHtml,
  dataHref,
  dataTable,
  suggestedCitation,
  type DataFile,
} from "@/lib/data/open-data";
import CopySnippet from "@/modules/guide/copy-snippet";
import { OPEN_DATA_FAQS } from "./australian-tax-and-pay-data-faqs";

const H = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const td = "px-3 py-2";

const aud = (n: number | string | null, dp = 0) =>
  typeof n === "number" ? `$${n.toLocaleString("en-AU", { minimumFractionDigits: dp, maximumFractionDigits: dp })}` : n === null ? "no limit" : n;
const pct = (n: number | string | null) => (typeof n === "number" ? `${Math.round(n * 10_000) / 100}%` : "");

function Table({ caption, head, children, minWidth = 520 }: { caption: string; head: string[]; children: ReactNode; minWidth?: number }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
      <table className="w-full text-left text-sm text-navy" style={{ minWidth }}>
        <caption className="caption-top bg-white px-3 pt-3 pb-1 text-left text-xs font-semibold uppercase tracking-wide text-warmgray">{caption}</caption>
        <thead className="bg-sandstone font-semibold">
          <tr>{head.map((h) => <th key={h} scope="col" className="px-3 py-2.5">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white tabular-nums">{children}</tbody>
      </table>
    </div>
  );
}

function Download_({ file }: { file: DataFile }) {
  const meta = DATA_FILES.find((f) => f.file === file)!;
  return (
    <p className="not-prose text-sm">
      <a href={dataHref(file)} download className="inline-flex items-center gap-1.5 font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
        <Download className="h-4 w-4" aria-hidden="true" /> Download this table (CSV)
      </a>
      <span className="sr-only">: {meta.title}</span>
    </p>
  );
}

export const OPEN_DATA_SOURCES: SourceLink[] = allSources();

export default function AustralianTaxAndPayData() {
  const authorship = getGuideAuthorship("australian-tax-and-pay-data");
  const tax = dataTable("resident-tax-rates.csv").rows.filter((r) => r[0] !== "2025-26");
  const hecs = dataTable("hecs-help-repayment-thresholds.csv").rows.filter((r) => r[0] === "2026-27");
  const nmw = dataTable("national-minimum-wage-history.csv").rows;
  const sg = dataTable("super-guarantee-rates.csv").rows;
  const fy = SITE_CONFIG.financialYear;

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">{OPEN_DATA.title}</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl lg:mb-14">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-eucalyptus-dark">Open data · version {OPEN_DATA.version}</p>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={H}>
            Australian Tax and Pay Data: Free CSV and JSON Downloads
          </h1>
          <p className="mb-6 text-xl leading-relaxed text-warmgray">
            The tax rates, Medicare levy, super guarantee, HECS-HELP thresholds and National Minimum Wage figures that run this
            site&apos;s calculators, as clean tables you can download, open in Excel or Google Sheets, or load into code. Every figure
            is traced to the ATO or the Fair Work Commission, labelled with the year it belongs to, and free to reuse with a link.
          </p>
          <p className="mb-6 text-sm text-warmgray">
            Published <time dateTime={OPEN_DATA.publishedIso}>{OPEN_DATA.publishedOn}</time> · checked{" "}
            <time dateTime={OPEN_DATA.updatedIso}>{OPEN_DATA.updatedOn}</time> · licence {OPEN_DATA.licenseName}.{" "}
            <a href="#cite" className="font-semibold text-eucalyptus-dark underline">Cite this page</a>
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">
            <section id="downloads">
              <h2 style={H}>Download the data</h2>
              <p>
                Six CSV files and one combined JSON file. The files are plain: a header row, one row per line of the table, dollar
                amounts as numbers without symbols, and rates as decimals (0.15 means 15%). A blank cell means &ldquo;no upper
                limit&rdquo; or &ldquo;not applicable&rdquo;.
              </p>
              <ul className="not-prose my-4 space-y-3">
                {DATA_FILES.map((f) => (
                  <li key={f.file} className="rounded-xl border border-sandstone-dark/20 bg-white p-4 shadow-sm">
                    <p className="font-semibold text-navy">{f.title}</p>
                    <p className="mt-1 text-sm text-warmgray">{f.description}</p>
                    <p className="mt-2 text-sm">
                      <a href={dataHref(f.file)} download className="inline-flex items-center gap-1.5 font-semibold text-eucalyptus-dark hover:underline">
                        <Download className="h-4 w-4" aria-hidden="true" /> {f.file}
                      </a>
                    </p>
                  </li>
                ))}
                <li className="rounded-xl border border-eucalyptus/40 bg-eucalyptus-light/40 p-4 shadow-sm">
                  <p className="font-semibold text-navy">Everything in one JSON file</p>
                  <p className="mt-1 text-sm text-warmgray">All tables with titles, descriptions, source links, licence and a suggested citation. Best for developers.</p>
                  <p className="mt-2 text-sm">
                    <a href={dataHref(JSON_FILE)} download className="inline-flex items-center gap-1.5 font-semibold text-eucalyptus-dark hover:underline">
                      <Download className="h-4 w-4" aria-hidden="true" /> {JSON_FILE}
                    </a>
                  </p>
                </li>
              </ul>
              <p>
                The file addresses are permanent (<code>{OPEN_DATA.path}data/&lt;file&gt;</code>) and the files are served with open
                CORS headers, so a spreadsheet function or a script can read them straight from the URL. When a rate changes the file
                at the same address is replaced and the version and date on this page move.
              </p>
            </section>

            <section id="tax-rates">
              <h2 style={H}>Resident income tax rates</h2>
              <p>
                From 1 July 2026 the rate on income between $18,201 and $45,000 fell from 16% to 15%, and a further cut to 14% is
                legislated from 1 July 2027. The thresholds did not move. The file carries all three years with a status column
                (<code>historical</code>, <code>current</code>, <code>legislated_not_in_force</code>); the table below shows the current
                and legislated scales. For worked take-home figures at every salary, see the{" "}
                <Link href="/australian-pay-report-2026/">Australian Pay Report 2026</Link> and the{" "}
                <Link href="/tax-bracket-history/">tax bracket history</Link>.
              </p>
              <Table caption="Resident marginal tax rates (taxable income, before offsets and Medicare levy)" head={["Income year", "Status", "Income over", "Up to", "Rate", "Tax on income at the lower limit"]} minWidth={600}>
                {tax.map((r, i) => (
                  <tr key={i}>
                    <th scope="row" className={`${td} font-medium`}>{r[0]}</th>
                    <td className={td}>{String(r[1]).replace(/_/g, " ")}</td>
                    <td className={td}>{aud(r[2])}</td>
                    <td className={td}>{aud(r[3])}</td>
                    <td className={td}>{pct(r[4])}</td>
                    <td className={td}>{aud(r[5])}</td>
                  </tr>
                ))}
              </Table>
              <Download_ file="resident-tax-rates.csv" />
            </section>

            <section id="minimum-wage">
              <h2 style={H}>National Minimum Wage, 2010-11 to {fy}</h2>
              <p>
                The adult National Minimum Wage by financial year, per hour and for a 38-hour week, as set by each Annual Wage Review.
                The &ldquo;as announced&rdquo; column is the increase the Fair Work Commission published, which it rounds (2022-23 was
                announced as 5.2%, a flat $40 a week); the file also carries the increase calculated from the weekly rates. The
                junior percentages are in their own file. Read the context on{" "}
                <Link href="/minimum-wage-history-australia/">minimum wage history</Link>, the{" "}
                <Link href="/minimum-wage-by-age/17/">minimum wage by age</Link> pages and{" "}
                <Link href="/junior-pay-rates/">junior pay rates</Link>.
              </p>
              <Table caption="National Minimum Wage, adult rate" head={["Financial year", "From", "Per hour", "Per 38-hour week", "Increase as announced"]} minWidth={520}>
                {nmw.map((r) => (
                  <tr key={String(r[0])}>
                    <th scope="row" className={`${td} font-medium`}>{r[0]}</th>
                    <td className={td}>{r[1]}</td>
                    <td className={td}>{aud(r[2], 2)}</td>
                    <td className={td}>{aud(r[3], 2)}</td>
                    <td className={td}>{r[4] ?? "n/a"}</td>
                  </tr>
                ))}
              </Table>
              <Download_ file="national-minimum-wage-history.csv" />
              <Download_ file="junior-minimum-wage-rates.csv" />
            </section>

            <section id="hecs">
              <h2 style={H}>HECS-HELP repayment thresholds</h2>
              <p>
                Compulsory repayments use a marginal system: the rate applies only to income above each threshold, except in the top
                band where the percentage applies to the whole repayment income. The file also holds 2025-26 for comparison. Try your
                own income in the <Link href="/hecs-help-calculator/">HECS-HELP calculator</Link>.
              </p>
              <Table caption={`Repayment thresholds, ${fy}`} head={["Repayment income over", "Up to", "Rate", "Base repayment", "Method"]} minWidth={560}>
                {hecs.map((r, i) => (
                  <tr key={i}>
                    <th scope="row" className={`${td} font-medium`}>{aud(r[1])}</th>
                    <td className={td}>{aud(r[2])}</td>
                    <td className={td}>{pct(r[3])}</td>
                    <td className={td}>{aud(r[4])}</td>
                    <td className={td}>{String(r[5]).replace(/_/g, " ")}</td>
                  </tr>
                ))}
              </Table>
              <Download_ file="hecs-help-repayment-thresholds.csv" />
            </section>

            <section id="super-medicare">
              <h2 style={H}>Super guarantee and Medicare levy</h2>
              <p>
                The employer super guarantee rate reached 12% on 1 July 2025 and is the legislated ceiling; see{" "}
                <Link href="/super-guarantee-rate-history/">super guarantee rate history</Link> for the dates. The Medicare levy file
                holds the 2% rate, the low-income thresholds and the surcharge tiers, each labelled with its own income year because
                the ATO publishes them at different times; the <Link href="/medicare-levy/">Medicare levy calculator</Link> explains
                how they work.
              </p>
              <Table caption="Super guarantee rate by financial year" head={["Financial year", "Rate"]} minWidth={260}>
                {sg.map((r) => (
                  <tr key={String(r[0])}>
                    <th scope="row" className={`${td} font-medium`}>{r[0]}</th>
                    <td className={td}>{pct(r[1])}</td>
                  </tr>
                ))}
              </Table>
              <Download_ file="super-guarantee-rates.csv" />
              <Download_ file="medicare-levy.csv" />
            </section>

            <section id="use">
              <h2 style={H}>Using the data</h2>
              <p>The files can be read directly from their addresses. In Google Sheets a single formula loads a table, and pandas reads the same address:</p>
              <CopySnippet id="use-sheets" label="Google Sheets" text={`=IMPORTDATA("${SITE_CONFIG.baseUrl}${dataHref("national-minimum-wage-history.csv")}")`} />
              <CopySnippet
                id="use-python"
                label="Python (pandas)"
                text={`import pandas as pd\nnmw = pd.read_csv("${SITE_CONFIG.baseUrl}${dataHref("national-minimum-wage-history.csv")}")\nprint(nmw.tail(3))`}
              />
              <p>
                Want the live current figures on a web page instead? The <Link href="/embed/">embeddable badges</Link> show the
                National Minimum Wage, super guarantee rate, tax-free threshold and HELP threshold and update themselves when a rate
                changes. For what moves and when, see the <Link href="/pay-and-tax-changes-calendar/">pay and tax changes calendar</Link>.
              </p>
            </section>

            <section id="method">
              <h2 style={H}>Method and limits</h2>
              <ul>
                <li><strong>One source of truth.</strong> The files are generated from the same constants that drive the calculators on this site, so a number cannot differ between a calculator and a download.</li>
                <li><strong>Residents.</strong> Rates are for Australian residents unless the file says otherwise. Non-resident and working holiday rates are on <Link href="/non-resident-tax/">non-resident tax</Link> and <Link href="/working-holiday-tax/">working holiday tax</Link>.</li>
                <li><strong>Years are labelled, never assumed.</strong> Where a source has not published a newer year (Medicare levy low-income thresholds), the file carries the latest published year and says so.</li>
                <li><strong>Not advice.</strong> General information. Check the linked ATO and Fair Work pages for your situation.</li>
              </ul>
            </section>

            <section id="cite">
              <h2 style={H}>Cite this page</h2>
              <p>
                Journalists, researchers, teachers, developers and writers are welcome to quote or republish any figure or file under{" "}
                <a href={OPEN_DATA.license} target="_blank" rel="noreferrer noopener">{OPEN_DATA.licenseName}</a>. The only condition is
                a link back. Permanent address: <a href={OPEN_DATA.url}>{OPEN_DATA.url}</a>
              </p>
              <CopySnippet id="cite-text" label="Suggested citation" text={suggestedCitation()} />
              <CopySnippet id="cite-html" label="Link (HTML)" text={citationHtml()} />
            </section>

            <section id="faq">
              <h2 style={H}>Questions about the data</h2>
              <div className="not-prose"><FaqAccordion faqs={OPEN_DATA_FAQS} /></div>
            </section>

            <div className="not-prose mt-12">
              <SourceAttribution sources={OPEN_DATA_SOURCES} lastVerified={OPEN_DATA.updatedOn} />
              {authorship && <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone p-6">
                <h3 className="mb-3 font-bold text-navy">On this page</h3>
                <div className="space-y-2 text-sm">
                  {[
                    ["#downloads", "Download the data"],
                    ["#tax-rates", "Resident tax rates"],
                    ["#minimum-wage", "National Minimum Wage"],
                    ["#hecs", "HECS-HELP thresholds"],
                    ["#super-medicare", "Super and Medicare"],
                    ["#use", "Using the data"],
                    ["#cite", "Cite this page"],
                  ].map(([href, label]) => (
                    <a key={href} href={href} className="block text-navy hover:text-eucalyptus-dark hover:underline">{label}</a>
                  ))}
                </div>
              </div>
              <div className="rounded-xl bg-eucalyptus-dark p-6 text-white shadow-md">
                <h3 className="mb-2 text-lg font-bold">Work out your own pay</h3>
                <p className="mb-4 text-sm text-eucalyptus-light">The same figures, applied to your salary.</p>
                <Link href="/take-home-pay-calculator/" className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50">
                  Take-Home Pay Calculator
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

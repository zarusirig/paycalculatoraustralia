import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import {
  PAYG_TABLE_YEARS,
  PAYG_YEAR_INFO,
  calculatePAYGWithholding,
  explainWithholding,
  withholdingForPeriod,
  type PaygFinancialYear,
  type PayFrequency,
} from "@/lib/constants/payg-withholding";
import TaxTableLookupWidget from "./lookup-widget";
import FullTaxTable from "./full-tax-table";
import CoefficientTables from "./coefficient-tables";
import TaxTableFaqSection from "./faq-section";
import TaxTablesSidebar from "./sidebar";
import PayDateFinder from "./pay-date-finder";
import { ATO_SCHEDULE_1, ATO_SCHEDULE_8 } from "./ato-schedules";
import { fyTaxTableFaqs } from "./fy-tax-table-faqs";
import {
  FY_CYCLES,
  FY_CYCLE_ORDER,
  adjacentFys,
  fyPath,
  fyWindow,
  longDate,
} from "./fy-tax-table-data";

const COMPARE_ROWS: Record<PayFrequency, readonly number[]> = {
  weekly: [700, 1_000, 1_500, 2_000, 3_000],
  fortnightly: [1_400, 2_000, 3_000, 4_000, 6_000],
  monthly: [3_000, 4_500, 6_500, 9_000, 13_000],
};

function money(n: number): string {
  return formatAUD(n, n % 1 ? 2 : 0);
}

function workings(gross: number, frequency: PayFrequency, scale: "tft" | "noTft", fy: PaygFinancialYear) {
  const w = explainWithholding(gross, frequency, scale, fy);
  const cycle = FY_CYCLES[frequency];
  const conv =
    frequency === "weekly"
      ? `${formatAUD(gross)} with the cents ignored, plus 99c`
      : frequency === "fortnightly"
        ? `${formatAUD(gross)} halved to ${formatAUD(gross / 2)}, cents ignored, plus 99c`
        : `${formatAUD(gross)} × 3 ÷ 13 = ${(gross * 3 / 13).toFixed(2)}, cents ignored, plus 99c`;
  return { w, conv, cycle };
}

export default function FyTaxTablePage({ frequency, fy }: { frequency: PayFrequency; fy: PaygFinancialYear }) {
  const cycle = FY_CYCLES[frequency];
  const info = PAYG_YEAR_INFO[fy];
  const { newer, older } = adjacentFys(fy);
  const isCurrent = fy === PAYG_TABLE_YEARS[0];
  const sharedEdition = fy !== "2026-27";
  const g = cycle.exampleGross;
  const tft = workings(g, frequency, "tft", fy);
  const noTft = workings(g, frequency, "noTft", fy);
  const result = calculatePAYGWithholding(g, frequency, { financialYear: fy });
  const compareFy: PaygFinancialYear = isCurrent ? "2025-26" : "2026-27";
  const faqs = fyTaxTableFaqs(cycle, fy);
  const authorship = getGuideAuthorship(cycle.slug);
  const ranges = [...PAYG_TABLE_YEARS].reverse();

  const SOURCES_LIST: SourceLink[] = [
    {
      title: `ATO Schedule 1 – Statement of formulas (${ATO_SCHEDULE_1.nat}), ${isCurrent ? "from 1 July 2026" : "edition for 1 July 2024 to 30 June 2026"}`,
      url: info.schedule1Url,
      publisher: SOURCES.ato.name,
    },
    { title: `ATO ${cycle.label.toLowerCase()} tax table (${cycle.ato.nat})`, url: cycle.ato.pageUrl, publisher: SOURCES.ato.name },
    { title: `ATO Schedule 1 sample data (${fy} edition)`, url: info.sampleDataUrl, publisher: SOURCES.ato.name },
  ];

  const sameCycleLinks = PAYG_TABLE_YEARS.filter((y) => y !== fy).map((y) => ({
    href: fyPath(frequency, y),
    label: `${cycle.label} tax table ${y}`,
  }));
  const sameYearLinks = FY_CYCLE_ORDER.filter((c) => c !== frequency).map((c) => ({
    href: fyPath(c, fy),
    label: `${FY_CYCLES[c].label} tax table ${fy} (${FY_CYCLES[c].ato.nat})`,
  }));

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/payg-withholding-tables/" className="hover:text-eucalyptus-dark hover:underline">PAYG Withholding Tables</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href={`/${cycle.slug}/`} className="hover:text-eucalyptus-dark hover:underline">{cycle.label} Tax Table</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">{fy}</span></li>
          </ol>
        </nav>

        <header className="mb-8 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {cycle.label} Tax Table {fy}: Pay Dates {longDate(info.payDatesFrom)} to {longDate(info.payDatesTo)}
          </h1>
          <p className="text-lg md:text-xl text-warmgray leading-relaxed mb-5">
            The {fy} {cycle.period}ly tax table ({cycle.ato.nat}) is the ATO&apos;s PAYG withholding schedule for {cycle.period}ly payments made
            between {fyWindow(fy)}. On {formatAUD(g)} a {cycle.period} with the tax-free threshold claimed,{" "}
            <strong>{formatAUD(result.totalWithheld)}</strong> is withheld, leaving {formatAUD(result.netPerPeriod)}. The table sits just below.
          </p>

          <section id="which-table" aria-labelledby="which-table-h" className="rounded-xl border-2 border-eucalyptus/30 bg-sandstone p-5">
            <h2 id="which-table-h" className="text-lg font-bold text-navy mb-2">Which table applies to my pay date?</h2>
            <p className="text-sm text-navy mb-3">
              The ATO goes by the date the payment is <strong>made</strong>, not the period the work covers. A pay run dated in July for work
              done in June uses the new financial year&apos;s table.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[20rem] text-sm text-left text-navy">
                <caption className="sr-only">Which {cycle.period}ly tax table applies to which pay dates</caption>
                <thead>
                  <tr className="border-b border-sandstone-dark/30">
                    <th scope="col" className="py-1.5 pr-3 font-semibold">Payment made</th>
                    <th scope="col" className="py-1.5 pr-3 font-semibold">Table</th>
                  </tr>
                </thead>
                <tbody>
                  {ranges.map((y) => (
                    <tr key={y} className={`border-b border-sandstone-dark/10 ${y === fy ? "font-bold" : ""}`}>
                      <td className="py-1.5 pr-3">{fyWindow(y)}</td>
                      <td className="py-1.5 pr-3">
                        {y === fy ? `${cycle.label} ${y} (this page)` : <Link href={fyPath(frequency, y)} className="text-eucalyptus-dark underline">{cycle.label} {y}</Link>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-warmgray mt-2">
              The ATO&apos;s Schedule 1 edition for 1 July 2024 to 30 June 2026 covers both 2024-25 and 2025-26, so those two years have identical amounts. The 1 July 2026 edition is the one that changed.
            </p>
            <PayDateFinder frequency={frequency} currentFy={fy} />
          </section>
          <TrustBar className="!max-w-none mt-5" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="table">
              <h2>{cycle.label} Tax Table {fy}: Amount to Withhold by Earnings</h2>
              <p>
                Amounts to withhold from {cycle.period}ly earnings for a payment made {fyWindow(fy)}, with the tax-free threshold claimed (ATO
                column 2) and not claimed (column 3, typical for a <Link href="/second-job-tax-calculator/">second job</Link>). The 2% Medicare
                levy is included. Download the full table as a CSV, or use the lookup further down for an exact amount.
              </p>
              <FullTaxTable
                frequency={frequency}
                fixedFy={fy}
                caption={`${cycle.label} tax table ${fy}: PAYG withholding by ${cycle.period}ly earnings, ATO ${cycle.ato.nat}`}
              />
              {!info.stslSupported && (
                <p className="text-sm text-warmgray-light">
                  This {fy} table shows income tax only. Study and training support loan amounts come from a separate ATO schedule
                  ({ATO_SCHEDULE_8.nat}) whose {fy} edition this page does not carry.
                </p>
              )}
            </section>

            <section id="worked-example">
              <h2>Worked Example: {money(g)} a {cycle.period.charAt(0).toUpperCase() + cycle.period.slice(1)} in {fy}</h2>
              <p>
                The ATO tables are produced by one formula. Here it is applied to {money(g)} a {cycle.period} for a payment made in {fy}:
              </p>
              <ol>
                <li>
                  <strong>Weekly equivalent (x):</strong> {tft.conv}. That gives x = {tft.w.x.toFixed(2)}.
                </li>
                <li>
                  <strong>Tax-free threshold claimed (Scale 2):</strong> x falls in the band with a = {tft.w.a === null ? "nil" : tft.w.a.toFixed(4)}
                  {tft.w.a !== null && <> and b = {tft.w.b.toFixed(4)}</>}. y = a × x − b = {tft.w.raw.toFixed(2)}, rounded to the nearest dollar
                  = {formatAUD(tft.w.weekly)} a week.
                </li>
                <li>
                  <strong>Back to the {cycle.period}:</strong>{" "}
                  {frequency === "weekly" ? "no conversion needed" : frequency === "fortnightly" ? `${formatAUD(tft.w.weekly)} × 2` : `${formatAUD(tft.w.weekly)} × 13 ÷ 3, rounded`}
                  {" "}= <strong>{formatAUD(tft.w.perPeriod)}</strong> withheld, so take-home is {formatAUD(g - tft.w.perPeriod)}.
                </li>
                <li>
                  <strong>No tax-free threshold (Scale 1):</strong> a = {noTft.w.a === null ? "nil" : noTft.w.a.toFixed(4)}, b = {noTft.w.b.toFixed(4)}, so y ={" "}
                  {noTft.w.raw.toFixed(2)} → {formatAUD(noTft.w.weekly)} a week → <strong>{formatAUD(noTft.w.perPeriod)}</strong> for the {cycle.period}.
                </li>
              </ol>
              <p>
                The gap of {formatAUD(noTft.w.perPeriod - tft.w.perPeriod)} a {cycle.period} is what claiming the tax-free threshold is worth
                in each pay. Claim it at one job only.
                {frequency === "fortnightly" && " Every fortnightly amount is an even number of dollars because the ATO doubles a rounded weekly figure."}
              </p>
            </section>

            <section id="lookup">
              <h2>Check Your Own {cycle.label} Pay in {fy}</h2>
              <p>
                Enter your {cycle.period}ly earnings to get the amount the {fy} table says to withhold. Cents are ignored, as in the ATO table.
              </p>
              <TaxTableLookupWidget frequency={frequency} defaultGross={g} fixedFy={fy} />
              <p className="text-sm text-warmgray-light">
                For take-home pay including super and a full annual picture, use the{" "}
                <Link href={cycle.calculatorHref}>{cycle.calculatorLabel.toLowerCase()}</Link> or the{" "}
                <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.
              </p>
            </section>

            <section id="year-notes">
              <h2>What to Know About the {fy} Table</h2>
              {fy === "2024-25" && (
                <>
                  <p>
                    2024-25 was the first year of the Stage 3 tax cuts, which took effect on 1 July 2024: the first bracket&apos;s rate fell from 19%
                    to 16% and the 30% bracket was widened to $135,000. The ATO reflected that in a new Schedule 1 edition published on
                    17 June 2024, and that edition applied to payments made from 1 July 2024 to 30 June 2026. It was not reissued on
                    1 July 2025.
                  </p>
                  <p>
                    That is why the {cycle.label.toLowerCase()} table for 2024-25 and 2025-26 gives the same amounts. If you are correcting a 2024-25 pay run or
                    checking an old payslip, the table on this page is the one in force on the pay date. It sets what an employer withholds, not your final tax, which is
                    worked out on your tax return. See the <Link href="/tax-bracket-history/">tax bracket history</Link> for the rates by year.
                  </p>
                </>
              )}
              {fy === "2025-26" && (
                <>
                  <p>
                    The ATO did not reissue Schedule 1 on 1 July 2025: the edition published on 17 June 2024 applied to payments made from
                    1 July 2024 to 30 June 2026. Withholding for 2025-26 therefore uses the same coefficients as 2024-25, and the 16% rate on
                    $18,201 to $45,000 was still in the table until 30 June 2026.
                  </p>
                  <p>
                    From 1 July 2026 a new edition applies and that rate is 15%. A pay dated on or after that day belongs on the{" "}
                    <Link href={fyPath(frequency, "2026-27")}>{cycle.label.toLowerCase()} tax table for 2026-27</Link>, even if it covers work done in June.
                    Study loan repayments also changed during 2025-26 (the ATO issued a different Schedule 8 from 24 September 2025), which is
                    why this page shows income tax only.
                  </p>
                </>
              )}
              {fy === "2026-27" && (
                <>
                  <p>
                    The 2026-27 edition was published on 17 June 2026 and applies to payments made from 1 July 2026. Its headline change is
                    the cut in the rate on $18,201 to $45,000 from 16% to 15%, so withholding is lower than under the 2025-26 table at
                    almost every level of earnings. A further cut to 14% is legislated for 1 July 2027: see the{" "}
                    <Link href="/tax-changes-2026-27/">2026-27 tax changes guide</Link>.
                  </p>
                  <p>
                    This page is year-locked. For the {cycle.label.toLowerCase()} table with the year toggle, study loan column and ATO downloads, use the{" "}
                    <Link href={`/${cycle.slug}/`}>{cycle.label.toLowerCase()} tax table</Link>.
                  </p>
                </>
              )}
              <div className="not-prose overflow-x-auto rounded-xl border border-sandstone-dark/20 my-4">
                <table className="w-full text-sm text-left text-navy">
                  <caption className="px-3 pt-3 pb-1 text-left text-sm font-semibold text-navy">
                    The same {cycle.period}ly earnings under the {fy} and {compareFy} tables (tax-free threshold claimed)
                  </caption>
                  <thead className="bg-sandstone">
                    <tr>
                      <th scope="col" className="px-3 py-2">{cycle.label} earnings</th>
                      <th scope="col" className="px-3 py-2">{fy}</th>
                      <th scope="col" className="px-3 py-2">{compareFy}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {COMPARE_ROWS[frequency].map((e) => (
                      <tr key={e}>
                        <th scope="row" className="px-3 py-2 font-medium">{formatAUD(e)}</th>
                        <td className="px-3 py-2">{formatAUD(withholdingForPeriod(e, frequency, "tft", fy))}</td>
                        <td className="px-3 py-2">{formatAUD(withholdingForPeriod(e, frequency, "tft", compareFy))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {sharedEdition && (
                <p className="text-sm text-warmgray-light">
                  Comparing 2024-25 or 2025-26 with 2026-27 shows the effect of the 15% rate; comparing the two older years with each other shows no difference, because they share one ATO edition.
                </p>
              )}
            </section>

            <section id="coefficients">
              <h2>{cycle.label} {fy} Coefficients (ATO Schedule 1)</h2>
              <p>
                The table above is built from these coefficients. Payroll teams can use them to check a system: work out the weekly equivalent
                x, find the band, and apply y = a × x − b.
              </p>
              <CoefficientTables frequency={frequency} fy={fy} />
            </section>

            <section id="other-tables">
              <h2>Other {cycle.label} Tax Tables and Pay Cycles</h2>
              <ul>
                <li><Link href={`/${cycle.slug}/`}>{cycle.label} tax table ({cycle.ato.nat})</Link>: the main page for this pay cycle, with the year toggle and ATO downloads.</li>
                {sameCycleLinks.map((l) => (<li key={l.href}><Link href={l.href}>{l.label}</Link></li>))}
                {sameYearLinks.map((l) => (<li key={l.href}><Link href={l.href}>{l.label}</Link></li>))}
                <li><Link href="/payg-withholding-tables/">PAYG withholding tables</Link>: every ATO schedule explained.</li>
                <li><Link href="/schedule-5-tax-table/">Schedule 5 tax table</Link>: bonuses, commissions and back pay.</li>
                <li><Link href="/tax-withheld-calculator/">Tax withheld calculator</Link>: your own pay run, any frequency.</li>
              </ul>
              {(newer || older) && (
                <p>
                  {newer && <>Pay dated later than {longDate(info.payDatesTo)}: <Link href={fyPath(frequency, newer)}>{newer} table</Link>. </>}
                  {older && <>Pay dated before {longDate(info.payDatesFrom)}: <Link href={fyPath(frequency, older)}>{older} table</Link>.</>}
                </p>
              )}
            </section>

            <TaxTableFaqSection
              heading={`${cycle.label} Tax Table ${fy}: Frequently Asked Questions`}
              mirrorHeading={`${cycle.label} tax table ${fy} questions and answers`}
              faqs={faqs}
            />

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>
                  Every amount is computed at render time from the ATO Schedule 1 ({ATO_SCHEDULE_1.nat}) coefficient method for the{" "}
                  {isCurrent ? "edition that applies from 1 July 2026" : "edition that applied to payments made from 1 July 2024 to 30 June 2026"}:
                  earnings become a weekly equivalent, y = a × x − b is applied, the weekly result is rounded to the nearest dollar, and it is
                  converted back to the pay period. The engine reproduces all 144 rows of the ATO&apos;s published sample data for this edition
                  (48 each for weekly, fortnightly and monthly, Scales 1, 2 and 3) in automated tests. Figures assume no tax offset claimed on a
                  withholding declaration and no Medicare levy adjustment. Coefficients last checked {SITE_CONFIG.lastVerified}.
                </p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
            </div>
          </article>

          <TaxTablesSidebar
            links={[
              { href: `/${cycle.slug}/`, label: `${cycle.label} Tax Table (${cycle.ato.nat})` },
              ...sameCycleLinks,
              ...sameYearLinks,
              { href: "/payg-withholding-tables/", label: "PAYG Tables Hub" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

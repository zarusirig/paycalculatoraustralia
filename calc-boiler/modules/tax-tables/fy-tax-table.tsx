import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import {
  SITE_CONFIG,
  SOURCES,
  TAX_BRACKETS_2023_24,
  TAX_BRACKETS_2025_26,
  TAX_BRACKETS_2026_27,
  formatAUD,
  type TaxBracket,
} from "@/lib/constants";
import {
  PAYG_TABLE_YEARS,
  PAYG_YEAR_INFO,
  SCALE_2_MEDICARE,
  SCALE_2_MEDICARE_2025_26,
  SCALE_2_TFT,
  SCALE_2_TFT_2025_26,
  calculatePAYGWithholding,
  explainWithholding,
  firstWholeDollarWithheld,
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
import { ATO_SCHEDULE_1, ATO_SCHEDULE_8, ATO_TAX_TABLES_INDEX } from "./ato-schedules";
import { fyTaxTableFaqs } from "./fy-tax-table-faqs";
import {
  FY_CYCLES,
  FY_CYCLE_ORDER,
  adjacentFys,
  fyLabel,
  fyLabelOr,
  fyPath,
  fyWindow,
  longDate,
} from "./fy-tax-table-data";
import FeaturedImage from "@/components/common/featured-image";

const COMPARE_ROWS: Record<PayFrequency, readonly number[]> = {
  weekly: [700, 1_000, 1_500, 2_000, 3_000],
  fortnightly: [1_400, 2_000, 3_000, 4_000, 6_000],
  monthly: [3_000, 4_500, 6_500, 9_000, 13_000],
};

// ATO pages behind the "what changed" sections, all read 9 October 2026.
// Resident rates by year (the bracket arrays in lib/constants/australian-tax.ts):
const ATO_RESIDENT_RATES = "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents";
// "Tax tables for 2023–24": the weekly, fortnightly and monthly tables and
// Schedule 1 used for 2023-24 are the "…13-october-2020-to-30-june-2024"
// editions; the weekly one reads "This tax table applied to payments made from
// 13 October 2020 to 30 June 2024" (ato.gov.au/tax-rates-and-codes/tax-table-weekly-13-oct-2020-to-30-june-2024).
const ATO_TABLES_2023_24 = "https://www.ato.gov.au/tax-rates-and-codes/previous-years-tax-tables/tax-tables-for-2023-24";
// "Tax tables for 2025–26": regular tables and Schedule 1 are the
// "…-01-july-2024-to-30-june-2026" editions; Schedule 8 has one edition for
// 1 July to 23 September 2025 and another from 24 September 2025.
const ATO_TABLES_2025_26 = "https://www.ato.gov.au/tax-rates-and-codes/previous-years-tax-tables/tax-tables-for-2025-26";

function money(n: number): string {
  return formatAUD(n, n % 1 ? 2 : 0);
}

function bracketRange(b: TaxBracket): string {
  return b.max === Infinity ? `${formatAUD(b.min)} and over` : `${formatAUD(b.min)} – ${formatAUD(b.max)}`;
}

function bracketRate(b: TaxBracket): string {
  return b.rate === 0 ? "Nil" : `${Math.round(b.rate * 1000) / 10}%`;
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

function BracketChangeTable({
  before,
  after,
  beforeLabel,
  afterLabel,
}: {
  before: readonly TaxBracket[];
  after: readonly TaxBracket[];
  beforeLabel: string;
  afterLabel: string;
}) {
  return (
    <div className="not-prose overflow-x-auto rounded-xl border border-sandstone-dark/20 my-4">
      <table className="w-full text-sm text-left text-navy">
        <caption className="px-3 pt-3 pb-1 text-left text-sm font-semibold text-navy">
          Resident tax rates built into the table: {beforeLabel} compared with {afterLabel} (Medicare levy excluded)
        </caption>
        <thead className="bg-sandstone">
          <tr>
            <th scope="col" className="px-3 py-2">{beforeLabel}</th>
            <th scope="col" className="px-3 py-2">{afterLabel}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
          {after.map((b, i) => {
            const p = before[i];
            const same = p && p.min === b.min && p.max === b.max && p.rate === b.rate;
            return (
              <tr key={b.min}>
                <td className="px-3 py-2">{p ? `${bracketRange(p)}: ${bracketRate(p)}` : "–"}</td>
                <td className={`px-3 py-2 ${same ? "" : "font-semibold"}`}>
                  {bracketRange(b)}: {bracketRate(b)}
                  {same ? " (unchanged)" : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function FyTaxTablePage({ frequency, fy }: { frequency: PayFrequency; fy: PaygFinancialYear }) {
  const cycle = FY_CYCLES[frequency];
  const info = PAYG_YEAR_INFO[fy];
  const label = fyLabel(fy);
  const labelOr = fyLabelOr(fy);
  const sharedEdition = info.coversYears.length > 1;
  const { newer, older } = adjacentFys(fy);
  const isCurrent = fy === PAYG_TABLE_YEARS[0];
  const g = cycle.exampleGross;
  const tft = workings(g, frequency, "tft", fy);
  const noTft = workings(g, frequency, "noTft", fy);
  const result = calculatePAYGWithholding(g, frequency, { financialYear: fy });
  const compareFy: PaygFinancialYear = isCurrent ? "2025-26" : "2026-27";
  const faqs = fyTaxTableFaqs(cycle, fy);
  const authorship = getGuideAuthorship(cycle.slug);
  const ranges = [...PAYG_TABLE_YEARS].reverse();
  const cyclePeriodTitle = cycle.period.charAt(0).toUpperCase() + cycle.period.slice(1);

  const SOURCES_LIST: SourceLink[] = [
    {
      title: `ATO Schedule 1 – Statement of formulas (${ATO_SCHEDULE_1.nat}), ${isCurrent ? "from 1 July 2026" : "edition for 1 July 2024 to 30 June 2026"}`,
      url: info.schedule1Url,
      publisher: SOURCES.ato.name,
    },
    { title: `ATO ${cycle.label.toLowerCase()} tax table (${cycle.ato.nat})`, url: cycle.ato.pageUrl, publisher: SOURCES.ato.name },
    { title: `ATO Schedule 1 sample data (${label} edition)`, url: info.sampleDataUrl, publisher: SOURCES.ato.name },
    isCurrent
      ? { title: "ATO tax tables: Important Information – July 2026 updates", url: ATO_TAX_TABLES_INDEX, publisher: SOURCES.ato.name }
      : { title: "ATO tax tables for 2025–26 (same regular tables as 2024–25)", url: ATO_TABLES_2025_26, publisher: SOURCES.ato.name },
    { title: "ATO tax rates – Australian residents", url: ATO_RESIDENT_RATES, publisher: SOURCES.ato.name },
  ];

  const sameCycleLinks = PAYG_TABLE_YEARS.filter((y) => y !== fy).map((y) => ({
    href: fyPath(frequency, y),
    label: `${cycle.label} tax table ${fyLabel(y)}`,
  }));
  const sameYearLinks = FY_CYCLE_ORDER.filter((c) => c !== frequency).map((c) => ({
    href: fyPath(c, fy),
    label: `${FY_CYCLES[c].label} tax table ${label} (${FY_CYCLES[c].ato.nat})`,
  }));

  // Scale 2 settings of this edition and the one it replaced (sources on the constants).
  const medicare = isCurrent ? SCALE_2_MEDICARE : SCALE_2_MEDICARE_2025_26;
  const nilBelow = (isCurrent ? SCALE_2_TFT : SCALE_2_TFT_2025_26)[0].lessThan;
  const prevNilBelow = SCALE_2_TFT_2025_26[0].lessThan;

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
            <li><span className="font-medium text-navy" aria-current="page">{label}</span></li>
          </ol>
        </nav>

        <header className="mb-8 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-4" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            {cycle.label} Tax Table {label}: Pay Dates {longDate(info.payDatesFrom)} to {longDate(info.payDatesTo)}
          </h1>
          <p className="text-lg md:text-xl text-warmgray leading-relaxed mb-5">
            The {label} {cycle.period}ly tax table ({cycle.ato.nat}) is the ATO&apos;s PAYG withholding schedule for {cycle.period}ly payments made
            from {fyWindow(fy)}.
            {sharedEdition && (
              <>
                {" "}The ATO issued one edition for both financial years and did not reissue it on 1 July 2025, so a 2024-25 pay and a
                2025-26 pay on the same earnings have the same amount withheld.
              </>
            )}{" "}
            On {formatAUD(g)} a {cycle.period} with the tax-free threshold claimed, <strong>{formatAUD(result.totalWithheld)}</strong> is
            withheld, leaving {formatAUD(result.netPerPeriod)}. The table sits just below.
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
                        {y === fy ? `${cycle.label} ${fyLabel(y)} (this page)` : <Link href={fyPath(frequency, y)} className="text-eucalyptus-dark underline">{cycle.label} {fyLabel(y)}</Link>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-warmgray mt-2">
              One ATO edition covered every pay date from 1 July 2024 to 30 June 2026, so 2024-25 and 2025-26 share one table. The 1 July 2026
              edition is the one that changed.
            </p>
            <PayDateFinder frequency={frequency} currentFy={fy} />
          </section>
          <TrustBar className="!max-w-none mt-5" />
          <FeaturedImage placement="content" className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="table">
              <h2>{cycle.label} Tax Table {label}: Amount to Withhold by Earnings</h2>
              <p>
                Amounts to withhold from {cycle.period}ly earnings for a payment made from {fyWindow(fy)}, with the tax-free threshold claimed
                (ATO column 2) and not claimed (column 3, typical for a <Link href="/second-job-tax-calculator/">second job</Link>). The 2% Medicare
                levy is included. Download the full table as a CSV, or use the lookup further down for an exact amount.
              </p>
              <FullTaxTable
                frequency={frequency}
                fixedFy={fy}
                caption={`${cycle.label} tax table ${label}: PAYG withholding by ${cycle.period}ly earnings, ATO ${cycle.ato.nat}`}
              />
              {!info.stslSupported && (
                <p className="text-sm text-warmgray-light">
                  This table shows income tax only. Study and training support loan amounts come from a separate ATO schedule
                  ({ATO_SCHEDULE_8.nat}), which had three editions across 2024-25 and 2025-26 (from 1 July 2024, 1 July 2025 and
                  24 September 2025), so a single study-loan column would be wrong for most pay dates.
                </p>
              )}
            </section>

            <section id="worked-example">
              <h2>Worked Example: {money(g)} a {cyclePeriodTitle} in {labelOr}</h2>
              <p>
                The ATO tables are produced by one formula. Here it is applied to {money(g)} a {cycle.period} for a payment made in {labelOr}:
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
              <h2>Check Your Own {cycle.label} Pay in {labelOr}</h2>
              <p>
                Enter your {cycle.period}ly earnings to get the amount the {label} table says to withhold. Cents are ignored, as in the ATO table.
              </p>
              <TaxTableLookupWidget frequency={frequency} defaultGross={g} fixedFy={fy} />
              <p className="text-sm text-warmgray-light">
                For take-home pay including super and a full annual picture, use the{" "}
                <Link href={cycle.calculatorHref}>{cycle.calculatorLabel.toLowerCase()}</Link> or the{" "}
                <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.
              </p>
            </section>

            <section id="what-changed">
              {sharedEdition ? (
                <>
                  <h2>What Changed From 2023-24, and Why 1 July 2025 Changed Nothing</h2>
                  <p>
                    This edition took effect on 1 July 2024. It replaced the {cycle.period}ly table the ATO had used since 13 October 2020
                    (<a href={ATO_TABLES_2023_24} target="_blank" rel="noopener noreferrer">ATO tax tables for 2023-24</a>), and it carries the
                    Stage 3 resident rates. The main changes were the first rate falling from 19% to 16% and the 32.5% rate becoming 30%,
                    with that band stretched from $120,000 to $135,000:
                  </p>
                  <BracketChangeTable before={TAX_BRACKETS_2023_24} after={TAX_BRACKETS_2025_26} beforeLabel="2023-24" afterLabel={label} />
                  <p>
                    On 1 July 2025 the table did not change. The ATO&apos;s list of{" "}
                    <a href={ATO_TABLES_2025_26} target="_blank" rel="noopener noreferrer">tax tables for 2025-26</a> links the same 1 July 2024
                    to 30 June 2026 {cycle.period}ly table and Schedule 1 as its 2024-25 list, which is why this single page covers both years.
                    Its Medicare levy settings stayed put for the whole period: Scale 2 withholds no levy on weekly earnings up to{" "}
                    {formatAUD(medicare.weeklyThreshold)} (a {formatAUD(medicare.annualThreshold)} taxable income), shades it in at 10c in
                    the dollar above that, and withholds the full 2% from {formatAUD(medicare.weeklyShadeInThreshold)} a week (
                    {formatAUD(medicare.annualShadeInThreshold)} a year). The one withholding change during 2025-26 was outside this table:
                    the study and training support loan schedule was replaced on 1 July 2025 and again from 24 September 2025.
                  </p>
                  <p>
                    A pay dated on or after 1 July 2026 belongs on the{" "}
                    <Link href={fyPath(frequency, "2026-27")}>{cycle.label.toLowerCase()} tax table for 2026-27</Link>, even if it covers work
                    done in June. This table sets what an employer withholds, not your final tax, which is worked out on your tax return; see
                    the <Link href="/tax-bracket-history/">tax bracket history</Link> for the rates by year.
                  </p>
                </>
              ) : (
                <>
                  <h2>What Changed From the 2025-26 Table</h2>
                  <p>
                    The ATO published this edition on 17 June 2026 for payments made from 1 July 2026. It reflects the{" "}
                    <em>Treasury Laws Amendment (More Cost of Living Relief) Act 2025</em>, which led the ATO to update all 15 withholding
                    schedules and 12 tax tables (
                    <a href={ATO_TAX_TABLES_INDEX} target="_blank" rel="noopener noreferrer">ATO July 2026 updates</a>). Against the 2024-25
                    and 2025-26 table, three things moved for a {cycle.period}ly pay:
                  </p>
                  <ul>
                    <li>
                      <strong>Rate cut:</strong> the rate on taxable income from $18,201 to $45,000 fell from 16% to 15%. The higher brackets
                      kept their rates and thresholds, but the tax on the first $45,000 is{" "}
                      {formatAUD(TAX_BRACKETS_2025_26[2].base - TAX_BRACKETS_2026_27[2].base)} lower ({formatAUD(TAX_BRACKETS_2025_26[2].base)}{" "}
                      down to {formatAUD(TAX_BRACKETS_2026_27[2].base)}).
                    </li>
                    <li>
                      <strong>Medicare levy thresholds:</strong> the same Act raised the low-income thresholds, so Scale 2 now starts
                      withholding the levy above {formatAUD(SCALE_2_MEDICARE.weeklyThreshold)} a week (was{" "}
                      {formatAUD(SCALE_2_MEDICARE_2025_26.weeklyThreshold)}) and withholds the full 2% from{" "}
                      {formatAUD(SCALE_2_MEDICARE.weeklyShadeInThreshold)} a week (was {formatAUD(SCALE_2_MEDICARE_2025_26.weeklyShadeInThreshold)}).
                      The family threshold used for a Medicare levy adjustment rose from {formatAUD(SCALE_2_MEDICARE_2025_26.familyThreshold)} to{" "}
                      {formatAUD(SCALE_2_MEDICARE.familyThreshold)}, plus {formatAUD(SCALE_2_MEDICARE.additionalChild)} a child (was{" "}
                      {formatAUD(SCALE_2_MEDICARE_2025_26.additionalChild)}).
                    </li>
                    <li>
                      <strong>Nil-withholding point:</strong> with the threshold claimed, the ATO&apos;s nil band now covers a weekly
                      equivalent under {formatAUD(nilBelow)} (was {formatAUD(prevNilBelow)}). After rounding, withholding starts at{" "}
                      {formatAUD(firstWholeDollarWithheld(frequency, "tft", "2026-27"))} a {cycle.period} (was{" "}
                      {formatAUD(firstWholeDollarWithheld(frequency, "tft", "2025-26"))}).
                    </li>
                  </ul>
                  <p>
                    Study loan withholding (Schedule 8) was also reissued with indexed repayment thresholds. This page carries that one
                    2026-27 edition, so its lookup can add a study-loan amount; the 2024-25 and 2025-26 page cannot, because those two years
                    spanned three Schedule 8 editions. A further cut to 14% is legislated for 1 July 2027: see the{" "}
                    <Link href="/tax-changes-2026-27/">2026-27 tax changes guide</Link>. For the {cycle.label.toLowerCase()} table with the year
                    toggle and ATO downloads, use the <Link href={`/${cycle.slug}/`}>{cycle.label.toLowerCase()} tax table</Link>.
                  </p>
                </>
              )}
              <div className="not-prose overflow-x-auto rounded-xl border border-sandstone-dark/20 my-4">
                <table className="w-full text-sm text-left text-navy">
                  <caption className="px-3 pt-3 pb-1 text-left text-sm font-semibold text-navy">
                    The same {cycle.period}ly earnings under the {label} table and the {fyLabel(compareFy)} table (tax-free threshold claimed)
                  </caption>
                  <thead className="bg-sandstone">
                    <tr>
                      <th scope="col" className="px-3 py-2">{cycle.label} earnings</th>
                      <th scope="col" className="px-3 py-2">{label}</th>
                      <th scope="col" className="px-3 py-2">{fyLabel(compareFy)}</th>
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
            </section>

            <section id="coefficients">
              <h2>{cycle.label} {label} Coefficients (ATO Schedule 1)</h2>
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
                  {newer && <>Pay dated later than {longDate(info.payDatesTo)}: <Link href={fyPath(frequency, newer)}>{fyLabel(newer)} table</Link>. </>}
                  {older && <>Pay dated before {longDate(info.payDatesFrom)}: <Link href={fyPath(frequency, older)}>{fyLabel(older)} table</Link>.</>}
                </p>
              )}
            </section>

            <TaxTableFaqSection
              heading={`${cycle.label} Tax Table ${label}: Frequently Asked Questions`}
              mirrorHeading={`${cycle.label} tax table ${label} questions and answers`}
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

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import {
  LITO,
  MEDICARE_LEVY,
  NON_RESIDENT_TAX_BRACKETS,
  SITE_CONFIG,
  SOURCES,
  TAX_BRACKETS_2025_26,
  TAX_BRACKETS_2026_27,
  TAX_FREE_THRESHOLD,
  formatAUD,
  formatPercent,
  type TaxBracket,
} from "@/lib/constants";
import { MLS_INCOME_YEAR } from "@/lib/constants/medicare-levy-extra";
import {
  FOREIGN_TABLE_YEAR,
  LEGISLATED_CUT_2027_28,
  TAX_BRACKETS_2027_28,
  WHM_TABLE_YEAR,
  WHM_TAX_BRACKETS_2025_26,
  analyseIncome,
  incomeTaxAfterLitoOnScale,
  nilTaxIncomeOnScale,
  taxOnScale,
  thresholdTax,
} from "@/lib/constants/tax-rates-reference";
import { TAX_ON_SALARIES } from "@/lib/data/salary-pages";
import TaxBracketsLookup from "@/modules/calculator/tax-brackets-lookup";
import { MAX_SAVING_2026_27, MAX_SAVING_2027_28, TAX_BRACKETS_FAQS } from "@/modules/guides/tax-brackets-faqs";

// =============================================================================
// /tax-brackets/ — rebuilt 23 Sep 2026 (Wave 3, T1).
//
// Why it had been sitting at #47–#56 for "tax brackets australia" (60.5k):
//  - H1 and hero said "2025-26" and "Applies 1 July 2025 to 30 June 2026" two
//    months into 2026-27; the <title> carried no year at all.
//  - Hardcoded 16% rows and a $17,788 worked example contradicted the 15%
//    table rendered from constants on the same page.
//  - "Unchanged from FY2024-25" and "16% drops to 15% in FY2026-27" were
//    written in the future tense about a change already in force.
//  - Wrong Medicare levy surcharge threshold ($93,000) and a SAPTO effective
//    threshold that no longer holds after the 2026-27 SAPTO changes.
//  - No 2025-26 table side by side, no marginal-rate section with its own
//    anchor, no quick lookup — the SERP (ATO, MLC, Canstar) all lead with the
//    year and the table.
// Every figure below now comes from lib/constants (sources cited there).
// =============================================================================

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const FY = SITE_CONFIG.financialYear;
const PREV = SITE_CONFIG.previousFinancialYear;
const B = TAX_BRACKETS_2026_27;
const P = TAX_BRACKETS_2025_26;
const N = TAX_BRACKETS_2027_28;
const TOP = B[B.length - 1];
const NIL = nilTaxIncomeOnScale(B);
const NIL_PREV = nilTaxIncomeOnScale(P);
const NIL_NEXT = nilTaxIncomeOnScale(N);
const pct = (r: number) => formatPercent(r, 0);

const ATO_RES = "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents";
const ATO_FOREIGN = "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-foreign-residents";
const ATO_WHM = "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-working-holiday-makers";
const ATO_LITO =
  "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset";
const ATO_MLS =
  "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/medicare-levy-surcharge-income-thresholds-and-rates";

const SOURCES_LIST: SourceLink[] = [
  { title: "Tax rates – Australian resident", url: ATO_RES, publisher: SOURCES.ato.name },
  { title: "Personal income tax – new tax cuts for every Australian taxpayer (QC104015)", url: LEGISLATED_CUT_2027_28.atoUrl, publisher: SOURCES.ato.name },
  { title: "Treasury Laws Amendment (More Cost of Living Relief) Bill 2025", url: LEGISLATED_CUT_2027_28.aphUrl, publisher: "Parliament of Australia" },
  { title: "Tax rates – foreign resident", url: ATO_FOREIGN, publisher: SOURCES.ato.name },
  { title: "Tax rates – working holiday maker (QC73322)", url: ATO_WHM, publisher: SOURCES.ato.name },
  { title: "Low income tax offset (QC105020)", url: ATO_LITO, publisher: SOURCES.ato.name },
  { title: "Medicare levy surcharge income, thresholds and rates", url: ATO_MLS, publisher: SOURCES.ato.name },
];

/** ATO wording: "$4,020 plus 30c for each $1 over $45,000". */
function atoWording(b: TaxBracket, i: number, all: readonly TaxBracket[]): string {
  if (b.rate === 0) return "Nil";
  const cents = `${Math.round(b.rate * 1000) / 10}c for each $1`;
  if (i === 0) return cents;
  const over = ` over ${formatAUD(all[i - 1].max)}`;
  return b.base > 0 ? `${formatAUD(b.base)} plus ${cents}${over}` : `${cents}${over}`;
}

function range(b: TaxBracket): string {
  return Number.isFinite(b.max) ? `${formatAUD(b.min)} – ${formatAUD(b.max)}` : `${formatAUD(b.min)} and over`;
}

const TH = "px-4 py-3 font-semibold text-navy";
const TD = "px-4 py-3";

function BracketTable({ brackets, caption, medicare = true }: { brackets: readonly TaxBracket[]; caption: string; medicare?: boolean }) {
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
      <table className="w-full text-sm text-left text-warmgray">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-sandstone">
          <tr>
            <th className={TH}>Taxable income</th>
            <th className={TH}>Tax on this income</th>
            <th className={`${TH} text-right`}>Marginal rate</th>
            {medicare && <th className={`${TH} text-right`}>Incl. 2% Medicare</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
          {brackets.map((b, i) => (
            <tr key={b.min}>
              <td className={`${TD} font-medium text-navy tabular-nums whitespace-nowrap`}>{range(b)}</td>
              <td className={TD}>{atoWording(b, i, brackets)}</td>
              <td className={`${TD} text-right tabular-nums`}>{pct(b.rate)}</td>
              {medicare && <td className={`${TD} text-right tabular-nums`}>{b.rate > 0 ? pct(b.rate + MEDICARE_LEVY.rate) : "0%"}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const COMPARE_INCOMES = [30_000, 45_000, 60_000, 80_000, 100_000, 120_000, 150_000, 200_000];
const MARGINAL_INCOMES = [20_000, 25_000, 30_000, 40_000, 50_000, 60_000, 70_000, 90_000, 120_000, 150_000, 200_000, 250_000];
const TAX_ON_LINKS = [40_000, 50_000, 60_000, 70_000, 80_000, 90_000, 100_000, 110_000, 120_000, 130_000, 140_000, 150_000, 160_000, 180_000, 200_000];
const FOREIGN_INCOMES = [30_000, 50_000, 80_000, 120_000, 200_000];

export default function TaxBracketsGuidePage() {
  const authorship = getGuideAuthorship("tax-brackets");
  const prevThresholds = thresholdTax(P);
  const nextThresholds = thresholdTax(N);
  const a90 = analyseIncome(90_000);
  const a50 = analyseIncome(50_000);

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Tax Brackets</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={FONT}>
            Tax Brackets Australia {FY}: Income Tax Rates &amp; Thresholds
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Australia has five resident income tax brackets for {FY}: <strong>nil</strong> up to {formatAUD(B[0].max)}, <strong>{pct(B[1].rate)}</strong> to {formatAUD(B[1].max)}, <strong>{pct(B[2].rate)}</strong> to {formatAUD(B[2].max)}, <strong>{pct(B[3].rate)}</strong> to {formatAUD(B[3].max)} and <strong>{pct(TOP.rate)}</strong> above that. The second rate fell from {pct(P[1].rate)} to {pct(B[1].rate)} on 1 July 2026, worth up to {formatAUD(MAX_SAVING_2026_27)} a year, and falls again to {pct(N[1].rate)} on {LEGISLATED_CUT_2027_28.effectiveDate}. The 2% Medicare levy is charged on top.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 not-prose">
          {[
            { k: "Tax-free threshold", v: formatAUD(TAX_FREE_THRESHOLD), s: `No income tax up to ${formatAUD(NIL)} with LITO` },
            { k: `Second rate ${FY}`, v: pct(B[1].rate), s: `Was ${pct(P[1].rate)} in ${PREV}` },
            { k: "Top marginal rate", v: pct(TOP.rate), s: `Over ${formatAUD(TOP.min - 1)}; ${pct(TOP.rate + MEDICARE_LEVY.rate)} with Medicare` },
            { k: "Tax at $100,000", v: formatAUD(analyseIncome(100_000).incomeTax), s: `Plus ${formatAUD(analyseIncome(100_000).medicareLevy)} Medicare levy` },
          ].map((c) => (
            <div key={c.k} className="rounded-xl border border-sandstone-dark/20 bg-sandstone/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-warmgray">{c.k}</p>
              <p className="text-2xl font-extrabold text-navy tabular-nums" style={FONT}>{c.v}</p>
              <p className="text-xs text-warmgray-light">{c.s}</p>
            </div>
          ))}
        </div>

        <nav aria-label="On this page" className="mb-10 not-prose rounded-xl border border-sandstone-dark/20 p-4 text-sm">
          <p className="font-semibold text-navy mb-2">On this page</p>
          <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3 text-eucalyptus-dark">
            <li><a href="#brackets-2026-27" className="hover:underline">Tax brackets {FY}</a></li>
            <li><a href="#tax-on-income" className="hover:underline">How much tax on your income</a></li>
            <li><a href="#brackets-2025-26" className="hover:underline">{FY} vs {PREV} side by side</a></li>
            <li><a href="#tax-at-thresholds" className="hover:underline">Tax at each threshold</a></li>
            <li><a href="#marginal-tax-rate" className="hover:underline">Marginal tax rate vs average rate</a></li>
            <li><a href="#non-resident-whm" className="hover:underline">Non-resident &amp; working holiday rates</a></li>
            <li><a href="#medicare-levy" className="hover:underline">Medicare levy and what&rsquo;s not in the table</a></li>
            <li><a href="#what-changed" className="hover:underline">What changed from {PREV}</a></li>
            <li><a href="#brackets-2027-28" className="hover:underline">Tax brackets 2027-28</a></li>
          </ul>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 min-w-0 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

            <section id="brackets-2026-27">
              <h2 style={FONT}>Australian Tax Brackets {FY} (Residents)</h2>
              <p>These are the ATO&rsquo;s resident income tax rates for the {FY} income year, 1 July 2026 to 30 June 2027. They apply to your <em>taxable income</em> (assessable income minus deductions) if you were an Australian resident for tax purposes all year and are entitled to the full tax-free threshold.</p>
              <BracketTable brackets={B} caption={`Australian resident tax brackets ${FY}`} />
              <p>Each rate applies only to the slice of income inside its band. The dollar amount in each row (for example {formatAUD(B[2].base)}) is simply the total tax on every band below it, so you can work out tax on any income as <strong>that amount plus the rate times the income over the threshold</strong>. The <Link href="/tax-free-threshold/">tax-free threshold</Link> is the nil band at the top of the table; it has been {formatAUD(TAX_FREE_THRESHOLD)} since 2012.</p>
            </section>

            <div className="not-prose my-10"><TaxBracketsLookup /></div>

            <section id="brackets-2025-26">
              <h2 style={FONT}>Tax Brackets {FY} vs {PREV}: Side by Side</h2>
              <p>The thresholds are identical in both years. Only the second rate moved, from {pct(P[1].rate)} to {pct(B[1].rate)}, which lowers the base amount in every row above it by {formatAUD(MAX_SAVING_2026_27)}. Use the {PREV} column for the tax return you lodge in 2026 (the <Link href="/tax-return-calculator/">tax return calculator</Link> does this for you) and the {FY} column for this year&rsquo;s pay.</p>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full text-sm text-left text-warmgray">
                  <caption className="sr-only">Resident tax brackets {PREV} and {FY}</caption>
                  <thead className="bg-sandstone">
                    <tr>
                      <th className={TH}>Taxable income</th>
                      <th className={TH}>{PREV}</th>
                      <th className={TH}>{FY}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {B.map((b, i) => (
                      <tr key={b.min}>
                        <td className={`${TD} font-medium text-navy tabular-nums whitespace-nowrap`}>{range(b)}</td>
                        <td className={TD}>{atoWording(P[i], i, P)}</td>
                        <td className={`${TD} text-navy`}>{atoWording(b, i, B)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3>Tax on common incomes: {PREV} vs {FY}</h3>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full text-sm text-left text-warmgray">
                  <thead className="bg-sandstone">
                    <tr>
                      <th className={TH}>Taxable income</th>
                      <th className={`${TH} text-right`}>{PREV} tax</th>
                      <th className={`${TH} text-right`}>{FY} tax</th>
                      <th className={`${TH} text-right`}>Saving</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {COMPARE_INCOMES.map((inc) => {
                      const before = Math.round(incomeTaxAfterLitoOnScale(inc, P));
                      const after = Math.round(incomeTaxAfterLitoOnScale(inc, B));
                      return (
                        <tr key={inc}>
                          <td className={`${TD} font-medium text-navy tabular-nums`}>{formatAUD(inc)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{formatAUD(before)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{formatAUD(after)}</td>
                          <td className={`${TD} text-right tabular-nums font-semibold text-eucalyptus-dark`}>{formatAUD(before - after)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-warmgray-light">Income tax after the low income tax offset, before the Medicare levy. For earlier years back to 2019-20 see <Link href="/tax-bracket-history/">tax bracket history</Link>.</p>
            </section>

            <section id="tax-at-thresholds">
              <h2 style={FONT}>How Much Tax at Each Threshold</h2>
              <p>The most you can pay inside each bracket, and the running total at the top of it. Income tax only, before offsets and the Medicare levy.</p>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full text-sm text-left text-warmgray">
                  <thead className="bg-sandstone">
                    <tr>
                      <th className={TH}>Bracket</th>
                      <th className={`${TH} text-right`}>Income in band</th>
                      <th className={`${TH} text-right`}>Max tax in band</th>
                      <th className={`${TH} text-right`}>Total tax at top ({FY})</th>
                      <th className={`${TH} text-right`}>Total at top ({PREV})</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {B.filter((b) => Number.isFinite(b.max)).map((b, i) => {
                      const width = b.max - Math.max(0, b.min - 1);
                      return (
                        <tr key={b.min}>
                          <td className={`${TD} font-medium text-navy tabular-nums whitespace-nowrap`}>{range(b)} ({pct(b.rate)})</td>
                          <td className={`${TD} text-right tabular-nums`}>{formatAUD(width)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{formatAUD(Math.round(width * b.rate))}</td>
                          <td className={`${TD} text-right tabular-nums font-semibold text-navy`}>{formatAUD(Math.round(taxOnScale(b.max, B)))}</td>
                          <td className={`${TD} text-right tabular-nums`}>{formatAUD(prevThresholds[i].tax)}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td className={`${TD} font-medium text-navy whitespace-nowrap`}>{range(TOP)} ({pct(TOP.rate)})</td>
                      <td className={`${TD} text-right`} colSpan={4}>{pct(TOP.rate)} of every dollar over {formatAUD(TOP.min - 1)}, no cap</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="marginal-tax-rate">
              <h2 style={FONT}>Marginal Tax Rate vs Average Tax Rate</h2>
              <p>Your <strong>marginal tax rate</strong> is the rate on your next dollar of income: the rate of the bracket your taxable income finishes in. Your <strong>average tax rate</strong> (often called the effective tax rate) is your total tax divided by your total income. Because the lower bands are taxed at lower rates, the average is always below the marginal rate. On {formatAUD(a90.income)} the marginal rate is {pct(a90.bracketRate)}, but the average income tax rate is only {formatPercent(a90.averageIncomeTaxRate)}.</p>
              <p>The marginal rate is the one that matters for decisions at the edge: what you keep from overtime, a <Link href="/pay-rise-calculator/">pay rise</Link> or a <Link href="/bonus-tax-calculator/">bonus</Link>, and what a deduction or <Link href="/salary-sacrifice-calculator/">salary sacrifice</Link> saves you. Moving into a higher bracket never reduces your take-home pay, because only the dollars above the threshold are taxed at the higher rate.</p>

              <h3>The real marginal rate: LITO withdrawal and Medicare shading</h3>
              <p>The bracket rate is not always what the next dollar costs. Two things push the true (effective) marginal rate above it for lower incomes:</p>
              <ul>
                <li><strong>LITO withdrawal.</strong> The <Link href="/low-income-tax-offset/">low income tax offset</Link> shrinks by 5c per dollar between {formatAUD(LITO.fullOffsetCeiling)} and {formatAUD(LITO.phaseOut1.end)}, and by 1.5c per dollar up to {formatAUD(LITO.nilOffsetIncome)}. So a dollar earned at {formatAUD(40_000)} costs {pct(B[1].rate)} + 5c + 2c Medicare = {formatPercent(analyseIncome(40_000).effectiveMarginalRate, 0)}, and at {formatAUD(a50.income)} it costs {formatPercent(a50.effectiveMarginalRate)}.</li>
                <li><strong>Medicare levy shade-in.</strong> Between {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} and {formatAUD(MEDICARE_LEVY.shadeInThreshold)} the levy phases in at 10c per dollar instead of 2c (singles, {PREV} thresholds, the latest the ATO has published).</li>
              </ul>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full text-sm text-left text-warmgray">
                  <caption className="sr-only">Marginal and average tax rates by income, {FY}</caption>
                  <thead className="bg-sandstone">
                    <tr>
                      <th className={TH}>Taxable income</th>
                      <th className={`${TH} text-right`}>Bracket rate</th>
                      <th className={`${TH} text-right`}>With Medicare</th>
                      <th className={`${TH} text-right`}>Tax on next $1,000</th>
                      <th className={`${TH} text-right`}>Average rate</th>
                      <th className={`${TH} text-right`}>Avg. incl. Medicare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {MARGINAL_INCOMES.map((inc) => {
                      const a = analyseIncome(inc);
                      const higher = a.effectiveMarginalRate > a.marginalWithMedicare + 0.0005;
                      return (
                        <tr key={inc}>
                          <td className={`${TD} font-medium text-navy tabular-nums`}>{formatAUD(inc)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{pct(a.bracketRate)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{pct(a.marginalWithMedicare)}</td>
                          <td className={`${TD} text-right tabular-nums ${higher ? "font-semibold text-ochre" : ""}`}>{formatAUD(a.taxOnNext1000)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{formatPercent(a.averageIncomeTaxRate)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{formatPercent(a.averageTotalRate)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-warmgray-light">Resident, {FY} rates, single, no HELP debt, no Medicare levy surcharge. Highlighted: the next $1,000 costs more than the bracket rate plus Medicare. Below {formatAUD(NIL)} the next $1,000 can cost nothing because LITO absorbs the tax.</p>
            </section>

            <section id="tax-on-salary">
              <h2 style={FONT}>Tax on Common Salaries</h2>
              <p>Income tax plus Medicare levy for {FY}. Each link opens the full breakdown for that salary, with weekly, fortnightly and monthly figures.</p>
              <ul className="not-prose grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
                {TAX_ON_LINKS.map((inc) => {
                  const a = analyseIncome(inc);
                  return (
                    <li key={inc}>
                      <Link href={`/tax-on/${inc}/`} className="flex justify-between rounded-lg border border-sandstone-dark/20 px-3 py-2 hover:border-eucalyptus hover:bg-eucalyptus-light/20">
                        <span className="font-medium text-navy">Tax on {formatAUD(inc)}</span>
                        <span className="tabular-nums text-warmgray">{formatAUD(a.totalTax)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <p className="text-sm"><Link href="/tax-on/">Tax on every salary from {formatAUD(TAX_ON_SALARIES[0])} to {formatAUD(TAX_ON_SALARIES[TAX_ON_SALARIES.length - 1])} &rarr;</Link></p>
            </section>

            <section id="non-resident-whm">
              <h2 style={FONT}>Non-Resident and Working Holiday Maker Tax Rates</h2>
              <p>Foreign residents and working holiday makers use different scales: no tax-free threshold, no low income tax offset and no Medicare levy. Residency for tax purposes is not the same as visa status, so check the <Link href="/non-resident-tax/">non-resident tax guide</Link> if you&rsquo;re unsure which applies.</p>
              <h3>Foreign resident tax rates</h3>
              <BracketTable brackets={NON_RESIDENT_TAX_BRACKETS} caption="Foreign resident tax rates" medicare={false} />
              <p className="text-sm text-warmgray-light">The ATO&rsquo;s foreign-resident page currently shows these rates for {FOREIGN_TABLE_YEAR}. The 1 July 2026 cut applied only to the resident second band, which foreign residents don&rsquo;t have, and the ATO&rsquo;s foreign-resident withholding scale for {FY} is unchanged.</p>
              <h3>Working holiday maker tax rates (visa 417 and 462)</h3>
              <BracketTable brackets={WHM_TAX_BRACKETS_2025_26} caption="Working holiday maker tax rates" medicare={false} />
              <p className="text-sm text-warmgray-light">Latest table published by the ATO, for {WHM_TABLE_YEAR}. See <Link href="/working-holiday-tax/">working holiday tax</Link> for how employers register to withhold at these rates.</p>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full text-sm text-left text-warmgray">
                  <thead className="bg-sandstone">
                    <tr>
                      <th className={TH}>Taxable income</th>
                      <th className={`${TH} text-right`}>Resident ({FY}, incl. Medicare)</th>
                      <th className={`${TH} text-right`}>Foreign resident</th>
                      <th className={`${TH} text-right`}>Working holiday maker</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {FOREIGN_INCOMES.map((inc) => (
                      <tr key={inc}>
                        <td className={`${TD} font-medium text-navy tabular-nums`}>{formatAUD(inc)}</td>
                        <td className={`${TD} text-right tabular-nums`}>{formatAUD(analyseIncome(inc).totalTax)}</td>
                        <td className={`${TD} text-right tabular-nums`}>{formatAUD(Math.round(taxOnScale(inc, NON_RESIDENT_TAX_BRACKETS)))}</td>
                        <td className={`${TD} text-right tabular-nums`}>{formatAUD(Math.round(taxOnScale(inc, WHM_TAX_BRACKETS_2025_26)))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="medicare-levy">
              <h2 style={FONT}>Medicare Levy and What the Brackets Don&rsquo;t Include</h2>
              <p>The ATO&rsquo;s rates do not include the Medicare levy. Most residents pay an extra <strong>2% of their whole taxable income</strong>, which is why the table above shows each rate with 2 points added. Other amounts that sit outside the brackets:</p>
              <ul>
                <li><strong><Link href="/medicare-levy/">Medicare levy</Link></strong>: nil for a single person up to {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}, shading in to the full 2% at {formatAUD(MEDICARE_LEVY.shadeInThreshold)} ({PREV} thresholds, the latest the ATO has published).</li>
                <li><strong><Link href="/medicare-levy-surcharge-calculator/">Medicare levy surcharge</Link></strong>: 1% to 1.5% more for singles whose income for surcharge purposes is over {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)} and who have no private hospital cover ({MLS_INCOME_YEAR} tiers). That makes the top rate {formatPercent(TOP.rate + MEDICARE_LEVY.rate + MEDICARE_LEVY.surcharge.tier3.rate)} for someone uninsured.</li>
                <li><strong><Link href="/hecs-help-calculator/">HELP and other study loans</Link></strong>: compulsory repayments are collected with your tax but are a separate calculation on repayment income.</li>
                <li><strong>Tax offsets</strong> such as the <Link href="/low-income-tax-offset/">low income tax offset</Link> and <Link href="/sapto-calculator/">SAPTO</Link> reduce the tax the brackets produce, dollar for dollar.</li>
              </ul>
            </section>

            <section id="what-changed">
              <h2 style={FONT}>What Changed From {PREV} to {FY}</h2>
              <ul>
                <li><strong>Second rate cut from {pct(P[1].rate)} to {pct(B[1].rate)}</strong> on income from {formatAUD(B[1].min)} to {formatAUD(B[1].max)}, from 1 July 2026. Anyone earning over {formatAUD(B[1].max)} saves {formatAUD(MAX_SAVING_2026_27)} a year; below that the saving is 1c per dollar over {formatAUD(TAX_FREE_THRESHOLD)}.</li>
                <li><strong>Thresholds unchanged</strong>: {formatAUD(B[0].max)}, {formatAUD(B[1].max)}, {formatAUD(B[2].max)} and {formatAUD(B[3].max)}, as they have been since 1 July 2024.</li>
                <li><strong>Base amounts fell</strong> to {formatAUD(B[2].base)}, {formatAUD(B[3].base)} and {formatAUD(B[4].base)} (from {formatAUD(P[2].base)}, {formatAUD(P[3].base)} and {formatAUD(P[4].base)}).</li>
                <li><strong>No-tax point with LITO rose</strong> from {formatAUD(NIL_PREV)} to {formatAUD(NIL)}, because {formatAUD(LITO.maxOffset)} of offset now covers more income at {pct(B[1].rate)}.</li>
                <li><strong>PAYG withholding</strong>: new ATO tax tables apply to pay from 1 July 2026, so the cut shows up in each pay rather than waiting for your return. Check yours with the <Link href="/tax-withheld-calculator/">tax withheld calculator</Link> or the <Link href="/payg-withholding-tables/">PAYG withholding tables</Link>.</li>
              </ul>
              <p>More detail, including super and HELP changes, is in <Link href="/tax-changes-2026-27/">tax changes 2026-27</Link>.</p>
            </section>

            <section id="brackets-2027-28">
              <h2 style={FONT}>Tax Brackets 2027-28: The Legislated Cut to {pct(N[1].rate)}</h2>
              <p>The second cut is already law. The {LEGISLATED_CUT_2027_28.act} ({LEGISLATED_CUT_2027_28.actNumber}, assented {LEGISLATED_CUT_2027_28.assent}) reduces the {pct(B[1].rate)} rate to <strong>{pct(N[1].rate)}</strong> from {LEGISLATED_CUT_2027_28.effectiveDate}. The thresholds stay where they are. The ATO&rsquo;s rate table doesn&rsquo;t show 2027-28 yet, so the base amounts below are worked out from the legislated rate.</p>
              <BracketTable brackets={N} caption="Resident tax brackets 2027-28 (legislated)" />
              <p>Compared with {FY}, anyone earning over {formatAUD(N[1].max)} saves another {formatAUD(MAX_SAVING_2027_28)} a year, and the no-tax point with LITO rises to {formatAUD(NIL_NEXT)}. Tax at the top of each band will be {nextThresholds.slice(1).map((t) => formatAUD(t.tax)).join(", ")}.</p>
            </section>

            <section id="faq">
              <h2 style={FONT}>Tax Brackets FAQ</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {TAX_BRACKETS_FAQS.map((f, i) => (
                  <AccordionItem key={f.q} value={`faq-${i}`} className="rounded-xl border border-sandstone-dark/20 px-5">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent><p className="text-warmgray">{f.a}</p></AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="mt-12 not-prose space-y-6">
              <MethodologyDisclosure>
                <p>Resident rates for {PREV} and {FY} are the ATO&rsquo;s published tables. The 2027-28 table applies the legislated {pct(N[1].rate)} rate to the unchanged thresholds; the same method reproduces the ATO&rsquo;s {PREV} and {FY} tables exactly. Tax after LITO uses the ATO&rsquo;s LITO formula. Medicare levy uses the single low-income thresholds; family thresholds, the surcharge and HELP are excluded unless stated. Figures are rounded to the dollar.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {authorship && <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-4 not-prose">
              <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone p-5">
                <p className="font-bold text-navy mb-3">Tax calculators</p>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: "/income-tax-calculator/", label: "Income tax calculator" },
                    { href: "/take-home-pay-calculator/", label: "Take-home pay calculator" },
                    { href: "/tax-withheld-calculator/", label: "Tax withheld calculator" },
                    { href: "/low-income-tax-offset/", label: "LITO calculator" },
                    { href: "/pay-rise-calculator/", label: "Pay rise calculator" },
                    { href: "/second-job-tax-calculator/", label: "Second job tax calculator" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex items-center justify-between rounded-lg bg-white border border-sandstone-dark/20 px-3 py-2 text-navy hover:border-eucalyptus">
                        {l.label}<ChevronRight className="h-4 w-4 text-warmgray-light" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-sandstone-dark/20 p-5">
                <p className="font-bold text-navy mb-3">Related guides</p>
                <ul className="space-y-2 text-sm text-eucalyptus-dark">
                  <li><Link href="/tax-free-threshold/" className="hover:underline">Tax-free threshold</Link></li>
                  <li><Link href="/tax-bracket-history/" className="hover:underline">Tax bracket history</Link></li>
                  <li><Link href="/stage-3-tax-cuts/" className="hover:underline">Stage 3 tax cuts</Link></li>
                  <li><Link href="/medicare-levy/" className="hover:underline">Medicare levy</Link></li>
                  <li><Link href="/non-resident-tax/" className="hover:underline">Non-resident tax</Link></li>
                  <li><Link href="/weekly-tax-table/" className="hover:underline">Weekly tax table</Link></li>
                  <li><Link href="/fortnightly-tax-table/" className="hover:underline">Fortnightly tax table</Link></li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

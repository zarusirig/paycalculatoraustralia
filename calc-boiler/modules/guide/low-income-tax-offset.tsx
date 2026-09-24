import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import {
  LITO,
  SITE_CONFIG,
  SOURCES,
  TAX_BRACKETS_2025_26,
  TAX_BRACKETS_2026_27,
  TAX_FREE_THRESHOLD,
  formatAUD,
  formatPercent,
} from "@/lib/constants";
import { SAPTO_BANDS } from "@/lib/constants/sapto";
import { TFT_WITHHOLDING_STARTS_ABOVE } from "@/lib/constants/tax-free-threshold";
import {
  TAX_BRACKETS_2027_28,
  analyseIncome,
  litoBreakdown,
  nilTaxIncomeOnScale,
} from "@/lib/constants/tax-rates-reference";
import LitoCalculator from "@/modules/calculator/lito-calculator";
import { LITO_FAQS, LITO_MID, NIL_NOW, NIL_PREV } from "@/modules/guide/low-income-tax-offset-faqs";

// =============================================================================
// /low-income-tax-offset/ — rebuilt 23 Sep 2026 (Wave 3, T1).
// The previous version was labelled FY2025-26 throughout, hardcoded 16% tax
// rows, quoted a $22,575 effective threshold that stopped being true on
// 1 July 2026, and claimed PAYG withholding passes on the whole $700 ("$26.92
// less tax per fortnight"), which the ATO scales do not do. Every figure now
// comes from lib/constants; the LITO formula is ATO QC105020 (quoted in
// lib/constants/tax-rates-reference.ts).
// =============================================================================

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const FY = SITE_CONFIG.financialYear;
const PREV = SITE_CONFIG.previousFinancialYear;
const B = TAX_BRACKETS_2026_27;
const m = (n: number) => formatAUD(n, n % 1 === 0 ? 0 : 2);
const pct = (r: number) => formatPercent(r, 0);

const ATO_LITO =
  "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset";
const ATO_RES = "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents";

const SOURCES_LIST: SourceLink[] = [
  { title: "Low income tax offset (QC105020)", url: ATO_LITO, publisher: SOURCES.ato.name },
  { title: "Tax rates – Australian resident", url: ATO_RES, publisher: SOURCES.ato.name },
  {
    title: "How to claim the tax-free threshold (QC103970) and multiple jobs (QC50527)",
    url: "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/tax-free-threshold",
    publisher: SOURCES.ato.name,
  },
];

const TABLE_INCOMES = [20_000, NIL_NOW, 25_000, 30_000, LITO.fullOffsetCeiling, 40_000, LITO.phaseOut1.end, 50_000, 55_000, 60_000, 65_000, LITO.nilOffsetIncome];
const TH = "px-4 py-3 font-semibold text-navy";
const TD = "px-4 py-3";

export default function LowIncomeTaxOffsetPage() {
  const authorship = getGuideAuthorship("low-income-tax-offset");
  const perDollar1 = LITO.phaseOut1.rate * 100;
  const perDollar2 = LITO.phaseOut2.rate * 100;
  const rate = B[1].rate;
  const nilNext = nilTaxIncomeOnScale(TAX_BRACKETS_2027_28);
  const withholdStartsAnnual = TFT_WITHHOLDING_STARTS_ABOVE.weekly * 52;
  const a40 = analyseIncome(40_000);

  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><Link href="/tax-brackets/" className="hover:text-eucalyptus-dark hover:underline">Tax Brackets</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Low Income Tax Offset (LITO)</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={FONT}>
            Low Income Tax Offset (LITO) {FY}: $700 Calculator &amp; Thresholds
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6 border-l-4 border-eucalyptus pl-4">
            The low income tax offset (LITO) cuts your income tax by up to <strong>{m(LITO.maxOffset)}</strong>. You get the full {m(LITO.maxOffset)} on a taxable income of <strong>{m(LITO.fullOffsetCeiling)}</strong> or less. It then phases out: by {perDollar1}c per dollar to {m(LITO_MID)} at {m(LITO.phaseOut1.end)}, then by {perDollar2}c per dollar to <strong>nil at {m(LITO.nilOffsetIncome)}</strong>. It&rsquo;s applied automatically when you lodge, it can&rsquo;t take your tax below $0, and in {FY} it means a resident pays no income tax up to <strong>{m(NIL_NOW)}</strong>.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 not-prose">
          {[
            { k: "Maximum LITO", v: m(LITO.maxOffset), s: `Taxable income up to ${m(LITO.fullOffsetCeiling)}` },
            { k: `LITO at ${m(LITO.phaseOut1.end)}`, v: m(LITO_MID), s: `After ${perDollar1}c/$ phase-out` },
            { k: "LITO cuts out at", v: m(LITO.nilOffsetIncome), s: `After ${perDollar2}c/$ phase-out` },
            { k: "No income tax up to", v: m(NIL_NOW), s: `${FY}, with the tax-free threshold` },
          ].map((c) => (
            <div key={c.k} className="rounded-xl border border-sandstone-dark/20 bg-sandstone/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-warmgray">{c.k}</p>
              <p className="text-2xl font-extrabold text-navy tabular-nums" style={FONT}>{c.v}</p>
              <p className="text-xs text-warmgray-light">{c.s}</p>
            </div>
          ))}
        </div>

        <div className="mb-12"><LitoCalculator /></div>

        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 min-w-0 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

            <section id="thresholds">
              <h2 style={FONT}>LITO Thresholds and Formula</h2>
              <p>LITO depends only on your taxable income for the year. These are the ATO&rsquo;s thresholds, unchanged for {FY}:</p>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full text-sm text-left text-warmgray">
                  <thead className="bg-sandstone">
                    <tr><th className={TH}>Taxable income</th><th className={TH}>LITO</th></tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    <tr><td className={`${TD} font-medium text-navy whitespace-nowrap`}>{m(LITO.fullOffsetCeiling)} or less</td><td className={TD}>{m(LITO.maxOffset)}</td></tr>
                    <tr><td className={`${TD} font-medium text-navy whitespace-nowrap`}>{m(LITO.phaseOut1.start)} – {m(LITO.phaseOut1.end)}</td><td className={TD}>{m(LITO.maxOffset)} minus {perDollar1} cents for every $1 above {m(LITO.fullOffsetCeiling)}</td></tr>
                    <tr><td className={`${TD} font-medium text-navy whitespace-nowrap`}>{m(LITO.phaseOut2.start)} – {m(LITO.nilOffsetIncome)}</td><td className={TD}>{m(LITO_MID)} minus {perDollar2} cents for every $1 above {m(LITO.phaseOut1.end)}</td></tr>
                    <tr><td className={`${TD} font-medium text-navy whitespace-nowrap`}>Over {m(LITO.nilOffsetIncome)}</td><td className={TD}>Nil</td></tr>
                  </tbody>
                </table>
              </div>
              <p>The offset comes off the tax worked out from the <Link href="/tax-brackets/">tax brackets</Link>, dollar for dollar. That makes it worth more than a deduction of the same size: a {m(LITO.maxOffset)} deduction at the {pct(rate)} rate would save {m(LITO.maxOffset * rate)}, while the offset saves the full {m(LITO.maxOffset)} (as long as you have that much tax to offset).</p>
            </section>

            <section id="lito-by-income">
              <h2 style={FONT}>LITO by Income: How Much Tax It Saves</h2>
              <p>Resident, {FY} rates. &ldquo;Tax after LITO&rdquo; is income tax only; the 2% <Link href="/medicare-levy/">Medicare levy</Link> is separate and isn&rsquo;t reduced by LITO.</p>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full text-sm text-left text-warmgray">
                  <thead className="bg-sandstone">
                    <tr>
                      <th className={TH}>Taxable income</th>
                      <th className={`${TH} text-right`}>Tax before LITO</th>
                      <th className={`${TH} text-right`}>LITO</th>
                      <th className={`${TH} text-right`}>LITO used</th>
                      <th className={`${TH} text-right`}>Tax after LITO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    {TABLE_INCOMES.map((inc) => {
                      const r = litoBreakdown(inc);
                      return (
                        <tr key={inc}>
                          <td className={`${TD} font-medium text-navy tabular-nums`}>{m(inc)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{m(r.taxBeforeLito)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{m(r.offset)}</td>
                          <td className={`${TD} text-right tabular-nums`}>{m(r.offsetUsed)}</td>
                          <td className={`${TD} text-right tabular-nums font-semibold text-navy`}>{m(r.taxAfterLito)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-warmgray-light">Where &ldquo;LITO used&rdquo; is below the offset, the tax before LITO is smaller than the offset and the rest is lost: LITO can&rsquo;t be refunded.</p>
              <p>For the full picture at a single salary, including the Medicare levy, see <Link href="/tax-on/50000/">Tax on $50,000 in Australia</Link>, where LITO is still partly in play, and <Link href="/tax-on/75000/">Tax on $75,000 in Australia</Link>, above the point where it has fully phased out.</p>
            </section>

            <section id="effective-threshold">
              <h2 style={FONT}>LITO and the Tax-Free Threshold: No Tax Up to {m(NIL_NOW)}</h2>
              <p>The <Link href="/tax-free-threshold/">tax-free threshold</Link> is {m(TAX_FREE_THRESHOLD)}. Above it, tax starts at {pct(rate)}, and the full {m(LITO.maxOffset)} offset cancels that tax until it reaches {m(LITO.maxOffset)}:</p>
              <ol>
                <li>{m(LITO.maxOffset)} ÷ {pct(rate)} = {m(Math.round((LITO.maxOffset / rate) * 100) / 100)} of income above {m(TAX_FREE_THRESHOLD)}.</li>
                <li>{m(TAX_FREE_THRESHOLD)} + that amount = {m(Math.round((TAX_FREE_THRESHOLD + LITO.maxOffset / rate) * 100) / 100)}.</li>
                <li>At {m(NIL_NOW)} the tax is {m(litoBreakdown(NIL_NOW).taxBeforeLito)}, fully covered by LITO. At {m(NIL_NOW + 1)} it is {m(litoBreakdown(NIL_NOW + 1).taxBeforeLito)}, a few cents more than the offset.</li>
              </ol>
              <p>So the effective tax-free threshold is <strong>{m(NIL_NOW)}</strong> in {FY}. You&rsquo;ll still see <strong>{m(NIL_PREV)}</strong> quoted: that was the {PREV} figure, when the rate was {pct(TAX_BRACKETS_2025_26[1].rate)}. When the rate drops to {pct(TAX_BRACKETS_2027_28[1].rate)} on 1 July 2027 it rises to {m(nilNext)}.</p>
              <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                <table className="w-full text-sm text-left text-warmgray">
                  <thead className="bg-sandstone"><tr><th className={TH}>Income year</th><th className={`${TH} text-right`}>Rate above {m(TAX_FREE_THRESHOLD)}</th><th className={`${TH} text-right`}>No income tax up to</th></tr></thead>
                  <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                    <tr><td className={TD}>{PREV}</td><td className={`${TD} text-right`}>{pct(TAX_BRACKETS_2025_26[1].rate)}</td><td className={`${TD} text-right tabular-nums`}>{m(NIL_PREV)}</td></tr>
                    <tr><td className={`${TD} font-semibold text-navy`}>{FY}</td><td className={`${TD} text-right`}>{pct(rate)}</td><td className={`${TD} text-right tabular-nums font-semibold text-navy`}>{m(NIL_NOW)}</td></tr>
                    <tr><td className={TD}>2027-28 (legislated)</td><td className={`${TD} text-right`}>{pct(TAX_BRACKETS_2027_28[1].rate)}</td><td className={`${TD} text-right tabular-nums`}>{m(nilNext)}</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="lito-in-your-pay">
              <h2 style={FONT}>Is LITO in Your Pay? Only Partly</h2>
              <p>Your employer doesn&rsquo;t show LITO on your payslip. The ATO&rsquo;s withholding formulas build in part of it, which is why, with the tax-free threshold claimed, no tax is withheld until you earn more than {m(TFT_WITHHOLDING_STARTS_ABOVE.weekly)} a week ({m(TFT_WITHHOLDING_STARTS_ABOVE.fortnightly)} a fortnight), about {m(withholdStartsAnnual)} a year. That is above {m(TAX_FREE_THRESHOLD)} but well below {m(NIL_NOW)}, so the rest of the offset reaches you when you lodge: as part of your refund, or as a smaller bill.</p>
              <p>To see how your withholding compares with the tax you&rsquo;ll actually owe, including LITO, use the <Link href="/tax-withheld-calculator/">tax withheld calculator</Link>.</p>
            </section>

            <section id="marginal-rate">
              <h2 style={FONT}>How the Phase-Out Raises Your Marginal Rate</h2>
              <p>Because LITO shrinks as you earn more, each extra dollar between {m(LITO.fullOffsetCeiling)} and {m(LITO.nilOffsetIncome)} costs more tax than the bracket rate alone. Between {m(LITO.fullOffsetCeiling)} and {m(LITO.phaseOut1.end)} you pay {pct(rate)} tax plus {perDollar1}c of lost offset, so on {m(a40.income)} the next $1,000 costs {m(a40.taxOnNext1000)} including the Medicare levy. Above {m(LITO.phaseOut1.end)} it is {pct(B[2].rate)} plus {perDollar2}c. It&rsquo;s still always worth earning more: you keep most of every extra dollar. More in <Link href="/tax-brackets/#marginal-tax-rate">marginal tax rate vs average rate</Link>.</p>
            </section>

            <section id="eligibility">
              <h2 style={FONT}>Who Gets LITO</h2>
              <p>The ATO says you may be eligible if you earn up to {m(LITO.nilOffsetIncome)} and you:</p>
              <ul>
                <li>are an Australian resident for tax purposes;</li>
                <li>pay tax on your taxable income; and</li>
                <li>have taxable income below the thresholds above.</li>
              </ul>
              <p>There is no age, job-type or asset test. Employees, sole traders and retirees with taxable income all qualify on the same basis. Foreign residents don&rsquo;t get LITO or the tax-free threshold (see <Link href="/non-resident-tax/">non-resident tax</Link>), and working holiday makers are taxed under their own rates (see <Link href="/working-holiday-tax/">working holiday tax</Link>).</p>
              <p>Seniors and pensioners can get the separate <Link href="/sapto-calculator/">seniors and pensioners tax offset (SAPTO)</Link>, up to {m(SAPTO_BANDS.single.maxOffset)} for a single person, on top of LITO.</p>
            </section>

            <section id="what-changed">
              <h2 style={FONT}>What Changed for LITO in {FY}</h2>
              <p>The offset itself did not change: still {m(LITO.maxOffset)}, still the same {m(LITO.fullOffsetCeiling)}, {m(LITO.phaseOut1.end)} and {m(LITO.nilOffsetIncome)} thresholds. What changed is the tax it offsets. The second tax rate fell from {pct(TAX_BRACKETS_2025_26[1].rate)} to {pct(rate)} on 1 July 2026, so everyone below {m(LITO.nilOffsetIncome)} pays less tax before LITO is applied, and the no-tax point moved from {m(NIL_PREV)} to {m(NIL_NOW)}. The old low and middle income tax offset (LMITO) ended after 2021-22.</p>
            </section>

            <section id="faq">
              <h2 style={FONT}>LITO FAQ</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {LITO_FAQS.map((f, i) => (
                  <AccordionItem key={f.q} value={`faq-${i}`} className="rounded-xl border border-sandstone-dark/20 px-5">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent><p className="text-warmgray">{f.a}</p></AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="mt-12 not-prose space-y-6">
              <MethodologyDisclosure>
                <p>LITO follows the ATO&rsquo;s published formula (QC105020). Tax before LITO uses the ATO&rsquo;s {FY} resident rates; the {PREV} and 2027-28 comparisons use the {PREV} table and the legislated 2027-28 rate. Figures are for a full-year resident with no other offsets.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {authorship && <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} />}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-4 not-prose">
              <div className="rounded-xl border border-sandstone-dark/20 bg-sandstone p-5">
                <p className="font-bold text-navy mb-3">Related</p>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: "/tax-brackets/", label: `Tax brackets ${FY}` },
                    { href: "/tax-free-threshold/", label: "Tax-free threshold" },
                    { href: "/tax-withheld-calculator/", label: "Tax withheld calculator" },
                    { href: "/income-tax-calculator/", label: "Income tax calculator" },
                    { href: "/take-home-pay-calculator/", label: "Take-home pay calculator" },
                    { href: "/tax-return-calculator/", label: "Tax return calculator" },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex items-center justify-between rounded-lg bg-white border border-sandstone-dark/20 px-3 py-2 text-navy hover:border-eucalyptus">
                        {l.label}<ChevronRight className="h-4 w-4 text-warmgray-light" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

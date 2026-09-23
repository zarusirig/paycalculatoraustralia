"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import {
  LITO,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SOURCES,
  TAX_FREE_THRESHOLD,
  calculateIncomeTax,
  calculateLITO,
  calculateMedicareLevy,
  formatAUD,
} from "@/lib/constants";
import { MEDICARE_LEVY_INCOME_YEAR } from "@/lib/constants/medicare-levy-extra";
import {
  PART_YEAR_TFT,
  TFT_PER_PERIOD,
  TFT_WITHHOLDING_STARTS_ABOVE,
  effectiveNilTaxIncome,
  incomeTaxAfterLito,
  partYearTaxFreeThreshold,
  tftWithholdingRow,
} from "@/lib/constants/tax-free-threshold";
import TaxFreeThresholdHelper from "@/modules/calculator/tax-free-threshold-helper";
import { TAX_FREE_THRESHOLD_FAQS } from "@/modules/guide/tax-free-threshold-faqs";

const ATO_CLAIM =
  "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/tax-free-threshold/how-to-claim-the-tax-free-threshold";
const ATO_MULTI =
  "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/tax-free-threshold/multiple-jobs-or-change-of-job";
const ATO_RATES = "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents";
const ATO_LITO =
  "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/low-income-tax-offset";
const ATO_WHM = "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-working-holiday-makers";

const SOURCES_LIST: SourceLink[] = [
  { title: "How to claim the tax-free threshold (QC103970)", url: ATO_CLAIM, publisher: SOURCES.ato.name },
  { title: "Multiple jobs or change of job (QC50527)", url: ATO_MULTI, publisher: SOURCES.ato.name },
  { title: "Tax rates – Australian resident", url: ATO_RATES, publisher: SOURCES.ato.name },
  { title: "Low income tax offset (QC105020)", url: ATO_LITO, publisher: SOURCES.ato.name },
  { title: "Tax rates – working holiday maker (QC73322)", url: ATO_WHM, publisher: SOURCES.ato.name },
];

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const FY = SITE_CONFIG.financialYear;
const T = formatAUD(TAX_FREE_THRESHOLD);
const NIL = effectiveNilTaxIncome();

const LITO_ROWS = [TAX_FREE_THRESHOLD, 20_000, NIL, 25_000, MEDICARE_LEVY.lowIncomeThreshold, 30_000, 37_500];
const WEEKLY = [300, 400, 500, 700, 900, 1_200, 1_500, 2_000];
const FORTNIGHTLY = WEEKLY.map((w) => w * 2);
const PART_YEAR_MONTHS = [1, 3, 6, 9, 12];

const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} style={FONT}>{children}</h2>;

function WithholdingTable({ amounts, frequency }: { amounts: number[]; frequency: "weekly" | "fortnightly" }) {
  const unit = frequency === "weekly" ? "week" : "fortnight";
  return (
    <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
      <table className="w-full text-sm text-left text-warmgray">
        <thead className="bg-sandstone font-semibold text-navy">
          <tr>
            <th className="px-4 py-3">Gross per {unit}</th>
            <th className="px-4 py-3 text-right">Threshold claimed</th>
            <th className="px-4 py-3 text-right">Not claimed</th>
            <th className="px-4 py-3 text-right">Extra withheld</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-sandstone-dark/20 bg-white">
          {amounts.map((g, i) => {
            const r = tftWithholdingRow(g, frequency);
            return (
              <tr key={g} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}>
                <td className="px-4 py-3 font-medium text-navy tabular-nums">{formatAUD(g)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatAUD(r.claimed)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatAUD(r.notClaimed)}</td>
                <td className="px-4 py-3 text-right font-medium text-navy tabular-nums">{formatAUD(r.difference)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function TaxFreeThresholdPage() {
  const w900 = tftWithholdingRow(900, "weekly");
  const authorship = getGuideAuthorship("tax-free-threshold");
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><Link href="/tax-brackets/" className="hover:text-eucalyptus-dark hover:underline">Tax Brackets</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Tax-Free Threshold</span></li></ol></nav>

      <header className="mb-10 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={FONT}>Tax-Free Threshold {FY}: {T} Explained</h1>
        <p className="text-xl text-warmgray leading-relaxed mb-6">
          The tax-free threshold is <strong>{T}</strong> for {FY}: an Australian resident pays no income tax on the first {T} of taxable income, about <strong>{formatAUD(TFT_PER_PERIOD.weekly)} a week</strong> or {formatAUD(TFT_PER_PERIOD.fortnightly)} a fortnight. With the low income tax offset, you pay no income tax at all up to <strong>{formatAUD(NIL)}</strong>. You claim it once, on one payer&rsquo;s TFN declaration.
        </p>
        <TrustBar className="!max-w-none" />
      </header>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 not-prose">
        {[
          { k: "Tax-free threshold", v: T, s: `Unchanged since 1 July 2012` },
          { k: "Per week / fortnight", v: `${formatAUD(TFT_PER_PERIOD.weekly)} / ${formatAUD(TFT_PER_PERIOD.fortnightly)}`, s: `About ${formatAUD(TFT_PER_PERIOD.monthly)} a month` },
          { k: "No income tax up to", v: formatAUD(NIL), s: `With the ${formatAUD(LITO.maxOffset)} LITO, ${FY} rates` },
          { k: "No Medicare levy up to", v: formatAUD(MEDICARE_LEVY.lowIncomeThreshold), s: `Singles, ${MEDICARE_LEVY_INCOME_YEAR} threshold (latest)` },
        ].map((c) => (
          <div key={c.k} className="rounded-xl border border-sandstone-dark/20 bg-sandstone/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-warmgray">{c.k}</p>
            <p className="text-2xl font-extrabold text-navy tabular-nums" style={FONT}>{c.v}</p>
            <p className="text-xs text-warmgray-light">{c.s}</p>
          </div>
        ))}
      </div>

      <div className="mb-12"><TaxFreeThresholdHelper /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          <section>
            <H2>What the Tax-Free Threshold Is</H2>
            <p>The tax-free threshold is the first bracket of the resident tax scale: taxable income from $0 to {T} is taxed at nil. Above it you pay 15c for each dollar up to $45,000, then the higher rates set out in our <Link href="/tax-brackets/">Australian tax brackets</Link> guide. It is not a deduction and not a refund. It&rsquo;s a zero-rate band that every resident gets once per income year, however many jobs they have.</p>
            <p>The figure has been {T} since 1 July 2012, when it rose from $6,000.</p>
          </section>

          <section>
            <H2 id="effective-threshold">The Effective Tax-Free Threshold with LITO</H2>
            <p>The <Link href="/low-income-tax-offset/">low income tax offset</Link> gives up to {formatAUD(LITO.maxOffset)} off your tax, and it can reduce tax to nil but not below. At the {FY} rate of 15% above {T}, {formatAUD(LITO.maxOffset)} of offset cancels the tax on the next {formatAUD(LITO.maxOffset / 0.15)} of income. So a resident with no other income or offsets pays <strong>no income tax up to {formatAUD(NIL)}</strong>. You don&rsquo;t claim LITO; the ATO applies it when you lodge.</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-4 py-3">Taxable income</th><th className="px-4 py-3 text-right">Tax before LITO</th><th className="px-4 py-3 text-right">LITO</th><th className="px-4 py-3 text-right">Income tax</th><th className="px-4 py-3 text-right">Medicare levy</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {LITO_ROWS.map((inc, i) => (
                <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}>
                  <td className="px-4 py-3 font-medium text-navy tabular-nums">{formatAUD(inc)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatAUD(calculateIncomeTax(inc), 2)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">−{formatAUD(Math.min(calculateLITO(inc), calculateIncomeTax(inc)), 2)}</td>
                  <td className="px-4 py-3 text-right font-medium text-navy tabular-nums">{formatAUD(incomeTaxAfterLito(inc), 2)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatAUD(calculateMedicareLevy(inc))}</td>
                </tr>
              ))}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">Resident, full year, {FY} tax rates, no other offsets. LITO shown only up to the tax it can cancel. Medicare levy uses the ATO&rsquo;s {MEDICARE_LEVY_INCOME_YEAR} single threshold of {formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}, the latest published; see the <Link href="/medicare-levy/" className="underline">Medicare levy calculator</Link>.</p></div>
          </section>

          <section>
            <H2 id="how-to-claim">How to Claim It on Your TFN Declaration</H2>
            <p>You claim the threshold through the <Link href="/tax-file-number-declaration/">tax file number declaration</Link> you give each new payer, including Centrelink if it pays you a taxable benefit. Question 9 asks: &ldquo;Do you want to claim the tax-free threshold from this payer?&rdquo; Answer &ldquo;Yes&rdquo; if you&rsquo;re an Australian resident for tax purposes and either aren&rsquo;t claiming it from another payer, or are but your total income from all sources will be less than the threshold. Working holiday makers must answer &ldquo;No&rdquo;. Answering &ldquo;Yes&rdquo; tells the payer to use the ATO withholding scale that builds in the {T} band; &ldquo;No&rdquo; switches to the higher scale.</p>
            <p>Your choice only affects <em>withholding</em> during the year. Your actual tax is worked out when you lodge, and the ATO applies the threshold once to your total income then. Claim it in the wrong place and the difference shows up as a refund or a bill.</p>
          </section>

          <section>
            <H2 id="claimed-vs-not">Tax Withheld: Claimed vs Not Claimed</H2>
            <p>With the threshold claimed, nothing is withheld until you earn more than about {formatAUD(TFT_WITHHOLDING_STARTS_ABOVE.weekly)} a week ({formatAUD(TFT_WITHHOLDING_STARTS_ABOVE.fortnightly)} a fortnight, {formatAUD(TFT_WITHHOLDING_STARTS_ABOVE.monthly)} a month). That is a little above {formatAUD(TFT_PER_PERIOD.weekly)} a week because the withholding scale builds in part of LITO. Without it, tax is withheld from the first dollar. On {formatAUD(900)} a week the gap is <strong>{formatAUD(w900.difference)} a week</strong>.</p>
            <h3 style={FONT}>Weekly</h3>
            <div className="not-prose my-4"><WithholdingTable amounts={WEEKLY} frequency="weekly" /></div>
            <h3 style={FONT}>Fortnightly</h3>
            <div className="not-prose my-4"><WithholdingTable amounts={FORTNIGHTLY} frequency="fortnightly" /><p className="mt-2 text-xs text-warmgray-light">ATO Schedule 1 (NAT 1004) formulas for payments from 1 July 2026, Australian resident, no study loan. Full tables: <Link href="/weekly-tax-table/" className="underline">weekly</Link>, <Link href="/fortnightly-tax-table/" className="underline">fortnightly</Link>, <Link href="/monthly-tax-table/" className="underline">monthly</Link>.</p></div>
          </section>

          <section>
            <H2 id="two-jobs">Two Jobs: Claim the Threshold Only Once</H2>
            <p>If two payers are paying you at the same time, claim the threshold from <strong>one</strong> of them, usually the one that pays more, and answer &ldquo;No&rdquo; on the other. The same applies to a job plus a taxable pension or government allowance. Claim it on both and each payer withholds as if it were your only income. The ATO then taxes the combined total at lodgment and the shortfall arrives as a bill.</p>
            <p>If your second job still leaves you under-withheld, you can ask a payer to withhold more with a PAYG withholding variation. The <Link href="/second-job-tax-calculator/">second job tax calculator</Link> shows what each job withholds and whether you&rsquo;re heading for a bill.</p>
            <ul>
              <li><strong>Changed jobs?</strong> Once your old employer stops paying you, you can claim the threshold from the new one, even though you claimed it earlier in the year.</li>
              <li><strong>Total income {T} or less?</strong> If you&rsquo;re certain your income from every payer combined will stay at or under {T}, the ATO lets you claim the threshold from each of them. If that changes, stop claiming it at one payer with a withholding declaration.</li>
            </ul>
          </section>

          <section>
            <H2 id="part-year">Part-Year Residents</H2>
            <p>If you became or stopped being an Australian resident during the year, you get a <strong>part-year threshold</strong>: a flat {formatAUD(PART_YEAR_TFT.flat)} plus up to {formatAUD(PART_YEAR_TFT.proRata)} pro-rated by the months you were resident, counting the month you arrived.</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-4 py-3">Months resident</th><th className="px-4 py-3 text-right">Tax-free threshold</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {PART_YEAR_MONTHS.map((m, i) => (
                <tr key={m} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}><td className="px-4 py-3 font-medium text-navy">{m}</td><td className="px-4 py-3 text-right tabular-nums">{formatAUD(partYearTaxFreeThreshold(m))}</td></tr>
              ))}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">ATO, <a href={ATO_CLAIM} target="_blank" rel="noopener noreferrer" className="hover:underline">How to claim the tax-free threshold</a>. Rounded to the dollar.</p></div>
          </section>

          <section>
            <H2 id="non-residents">Non-Residents and Working Holiday Makers</H2>
            <p>A <strong>foreign resident</strong> for the whole year can&rsquo;t claim the tax-free threshold and pays tax from the first dollar, at the rates in our <Link href="/non-resident-tax/">non-resident tax guide</Link>. <strong>Working holiday makers</strong> on visa subclass 417 or 462 pay 15% from the first dollar on their working holiday income, and the TFN declaration tells them to answer &ldquo;No&rdquo;. The one foreign-resident exception on the form is an Australian Government pension or allowance, where a foreign resident can claim it from that payer. See <Link href="/working-holiday-tax/">working holiday tax</Link> for the full scale.</p>
            <p>Residency for tax purposes isn&rsquo;t the same as visa status. Someone on a temporary visa can still be a resident for tax purposes, and so can claim the threshold.</p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/tax-brackets/">Australian Tax Brackets</Link>: every resident rate and threshold for {FY}</li>
              <li><Link href="/second-job-tax-calculator/">Second Job Tax Calculator</Link>: tax on two jobs with the threshold claimed once</li>
              <li><Link href="/tax-file-number-declaration/">TFN Declaration Guide</Link>: every question on the form</li>
              <li><Link href="/low-income-tax-offset/">Low Income Tax Offset</Link>: the offset behind the {formatAUD(NIL)} figure</li>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>: your pay after tax, Medicare and super</li>
            </ul>
          </section>

          <section>
            <H2>Frequently Asked Questions</H2>
            <div className="sr-only">
              <h3>Tax-free threshold questions and answers</h3>
              {TAX_FREE_THRESHOLD_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
            </div>
            <Accordion type="multiple" className="not-prose mt-6 space-y-3">
              {TAX_FREE_THRESHOLD_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <div className="mt-12 not-prose">
            <MethodologyDisclosure title="How these figures are worked out">
              <p>Tax is the ATO&rsquo;s {FY} resident scale; LITO is {formatAUD(LITO.maxOffset)} up to $37,500 and tapers after that, and can only reduce tax to nil. The {formatAUD(NIL)} figure is the highest whole-dollar income where tax after LITO is nil, found by testing the calculation, not typed in. Withholding figures use the ATO&rsquo;s Schedule 1 coefficient formulas for payments from 1 July 2026, which reproduce the published tax tables. The claim helper follows the ATO&rsquo;s rules for one payer, multiple payers, changing jobs and total income of {T} or less.</p>
              <p>General information, not tax advice. It assumes a full year of residency unless stated, and no other income, deductions or offsets.</p>
            </MethodologyDisclosure>
            <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
            {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
          </div>
        </article>

        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/tax-brackets/" label="Tax Brackets" /><SidebarLink href="/second-job-tax-calculator/" label="Second Job Tax Calculator" /><SidebarLink href="/tax-file-number-declaration/" label="TFN Declaration" /><SidebarLink href="/low-income-tax-offset/" label="Low Income Tax Offset" /><SidebarLink href="/weekly-tax-table/" label="Weekly Tax Table" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

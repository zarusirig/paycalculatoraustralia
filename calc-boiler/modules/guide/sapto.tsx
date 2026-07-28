"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import {
  SAPTO_BANDS,
  SAPTO_INCOME_YEAR,
  SAPTO_REDUCTION_RATE,
  SAPTO_TRANSFER,
  calculateSAPTO,
} from "@/lib/constants/sapto";
import SaptoCalculator from "@/modules/calculator/sapto-calculator";
import { SAPTO_FAQS } from "@/modules/guide/sapto-faqs";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const ATO_URL =
  "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets/seniors-and-pensioners-tax-offset";

const SOURCES_LIST: SourceLink[] = [
  { title: "Seniors and pensioners tax offset", url: ATO_URL, publisher: SOURCES.ato.name },
  {
    title: "Rebate income",
    url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/income-tests",
    publisher: SOURCES.ato.name,
  },
];

const S = SAPTO_BANDS.single;
const C = SAPTO_BANDS.couple;
const I = SAPTO_BANDS.illnessSeparated;

// Worked example derived from the engine so it cannot drift.
const JOSE = calculateSAPTO({ status: "single", rebateIncome: 39_000 });

export default function SaptoPage() {
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">SAPTO Calculator</span></li></ol></nav>

      <header className="mb-10 max-w-4xl"><h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>SAPTO Calculator — Seniors and Pensioners Tax Offset</h1><p className="text-xl text-warmgray leading-relaxed mb-6">The seniors and pensioners tax offset (SAPTO) is worth up to <strong>{formatAUD(S.maxOffset)}</strong> if you are single and <strong>{formatAUD(C.maxOffset)}</strong> for each partner of a couple. Work out your exact entitlement below, including the half-of-combined-income test that catches most couples out.</p><TrustBar className="!max-w-none" /></header>

      <div className="mb-12"><SaptoCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is SAPTO?</h2>
            <p>SAPTO is a non-refundable tax offset for Australians who receive an Australian Government pension or allowance, or who qualify for the age pension without claiming it. It reduces the income tax you pay, and the ATO applies it automatically when it assesses your return.</p>
            <p>Because it is non-refundable it can reduce your tax to zero but cannot produce a refund by itself. It stacks with the <Link href="/low-income-tax-offset/">Low Income Tax Offset</Link> and the <Link href="/zone-tax-offset/">zone tax offset</Link>.</p>
            <p>One extra benefit is easy to miss: if you are entitled to <strong>at least $1</strong> of SAPTO, you also qualify for a higher <Link href="/medicare-levy/">Medicare levy</Link> low-income threshold. If your income reduces your SAPTO to zero, you lose that too.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>SAPTO Rates and Thresholds</h2>
            <p>Three figures matter for each situation: the maximum offset, the <strong>shading-out threshold</strong> below which you get the full amount, and the <strong>cut-out threshold</strong> at which the offset disappears.</p>

            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Status</th><th className="px-5 py-3">Maximum offset</th><th className="px-5 py-3">Shading-out threshold</th><th className="px-5 py-3">Cut-out threshold</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Single</td><td className="px-5 py-3 font-medium">{formatAUD(S.maxOffset)}</td><td className="px-5 py-3">{formatAUD(S.shadingOutThreshold)}</td><td className="px-5 py-3">{formatAUD(S.cutOutThreshold)}</td></tr>
              <tr><td className="px-5 py-3 font-medium">Each partner of a couple</td><td className="px-5 py-3 font-medium">{formatAUD(C.maxOffset)}</td><td className="px-5 py-3">{formatAUD(C.shadingOutThreshold)}</td><td className="px-5 py-3">{formatAUD(C.cutOutThreshold)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3 font-medium">Each partner of an illness-separated couple</td><td className="px-5 py-3 font-medium">{formatAUD(I.maxOffset)}</td><td className="px-5 py-3">{formatAUD(I.shadingOutThreshold)}</td><td className="px-5 py-3">{formatAUD(I.cutOutThreshold)}</td></tr>
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">ATO, <a href={ATO_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">Seniors and pensioners tax offset</a>. {SAPTO_INCOME_YEAR} income year.</p></div>

            <p>Above the shading-out threshold the offset reduces by <strong>{SAPTO_REDUCTION_RATE * 100} cents for every dollar</strong>, and the ATO rounds the result <em>up</em> to the nearest whole dollar.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: {formatAUD(39_000)} Rebate Income, Single</h2>
            <p>The ATO&rsquo;s own example. A single age pensioner with rebate income of {formatAUD(39_000)} is above the {formatAUD(S.shadingOutThreshold)} shading-out threshold but below the {formatAUD(S.cutOutThreshold)} cut-out, so the offset tapers:</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Rebate income above the threshold</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(39_000)} − {formatAUD(S.shadingOutThreshold)} = {formatAUD(39_000 - S.shadingOutThreshold)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Reduction at {SAPTO_REDUCTION_RATE * 100}c per $1</td><td className="px-5 py-3 text-right tabular-nums">−{formatAUD(JOSE.reduction, 2)}</td></tr>
              <tr><td className="px-5 py-3 font-medium">SAPTO (rounded up)</td><td className="px-5 py-3 text-right font-bold tabular-nums">{formatAUD(JOSE.offset)}</td></tr>
            </tbody></table></div></div>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How SAPTO Works for Couples</h2>
            <p className="not-prose rounded-lg border-l-4 border-ochre bg-sandstone/60 p-4 text-base text-navy"><strong>Two different incomes drive the calculation, and mixing them up is the most common error.</strong> Your <em>eligibility</em> is tested on <strong>half your combined</strong> rebate income. Your <em>offset amount</em> is then worked out on <strong>your own</strong> rebate income.</p>
            <p>The practical consequence is that a couple can pass the eligibility test while one partner still receives nothing. In the ATO&rsquo;s example, a couple with rebate incomes of {formatAUD(54_020)} and {formatAUD(25_677)} have a combined {formatAUD(79_697)}. Half of that is {formatAUD(39_848.5, 2)}, comfortably under the {formatAUD(C.cutOutThreshold)} cut-out, so the couple qualifies. But the higher earner&rsquo;s own {formatAUD(54_020)} is well past the cut-out, so their offset is nil — while their partner receives the full {formatAUD(C.maxOffset)}.</p>
            <p>It also works in your favour. A single-income couple where one partner earns {formatAUD(33_650)} and the other nothing is assessed at {formatAUD(16_825)} each, so the earner stays eligible and receives {formatAUD(calculateSAPTO({ status: "couple", rebateIncome: 33_650, spouseRebateIncome: 0 }).offset)}.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Counts as Rebate Income?</h2>
            <p>Rebate income is <strong>wider than taxable income</strong>, which is why estimating SAPTO from your salary alone overstates it. It is the total of:</p>
            <ul>
              <li>your taxable income</li>
              <li>reportable superannuation contributions</li>
              <li>total net investment loss</li>
              <li>adjusted fringe benefits</li>
            </ul>
            <p>If you salary-sacrifice into super, those contributions count toward rebate income even though they are not taxable income. See our <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link> for how that interacts with your take-home pay.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Qualifies for SAPTO?</h2>
            <p>You must satisfy <strong>both</strong> a pension condition and an income condition.</p>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The pension condition</h3>
            <p>You received one of these in the income year: Age Pension, Carer Payment, Disability Support Pension (if you are age-pension age), Education Entry Payment, Parenting Payment (single), age service pension, income support supplement, Veteran Payment, invalidity service pension (if age-pension age), or partner service pension.</p>
            <p>You also qualify if you were age-pension age and <em>eligible</em> for the age pension but did not receive it — because you did not claim, or failed the income or assets test — provided you meet an Australian residence condition. Age-pension age has been <strong>67</strong> since 1 July 2023.</p>
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The income condition</h3>
            <ul>
              <li><strong>No spouse:</strong> rebate income under {formatAUD(S.cutOutThreshold)}</li>
              <li><strong>Couple:</strong> combined rebate income under {formatAUD(C.combinedCutOut)}</li>
              <li><strong>Illness-separated:</strong> combined rebate income under {formatAUD(I.combinedCutOut)}</li>
            </ul>
            <p>You cannot claim SAPTO if you were in jail for the whole income year.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Transferring Unused SAPTO to a Spouse</h2>
            <p>If you and your spouse are both eligible and one of you does not use the full offset, the unused part can transfer. The ATO calculates and applies this when you both lodge — you do not claim it manually.</p>
            <p>Where your spouse&rsquo;s taxable income is <strong>{formatAUD(SAPTO_TRANSFER.taxableIncomeFloor)} or less</strong>, the whole offset is available to transfer. Above that it reduces by {SAPTO_TRANSFER.reductionRate * 100} cents in the dollar: <code>A − ((B − {formatAUD(SAPTO_TRANSFER.taxableIncomeFloor)}) × {SAPTO_TRANSFER.reductionRate})</code>, where A is your spouse&rsquo;s offset and B is their taxable income plus exempt pension income.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
            <ul>
              <li><Link href="/low-income-tax-offset/">Low Income Tax Offset Guide</Link> — the offset most SAPTO recipients also claim</li>
              <li><Link href="/zone-tax-offset/">Zone Tax Offset Calculator</Link> — for remote-area residents, and it stacks with SAPTO</li>
              <li><Link href="/medicare-levy/">Medicare Levy Guide</Link> — including the higher SAPTO low-income threshold</li>
              <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> — your liability before offsets</li>
              <li><Link href="/tax-brackets/">Australian Tax Brackets</Link></li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <div className="sr-only">
              <h3>SAPTO questions and answers</h3>
              {SAPTO_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
            </div>
            <Accordion type="multiple" className="not-prose mt-6 space-y-3">
              {SAPTO_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <div className="mt-12 not-prose"><MethodologyDisclosure title="How this calculator works"><p>Rates, thresholds and the calculation method come from the ATO&rsquo;s <a href={ATO_URL} target="_blank" rel="noopener noreferrer">Seniors and pensioners tax offset</a> page (QC72197). They apply to the {SAPTO_INCOME_YEAR} income year — the return being lodged now. The ATO had not published {SITE_CONFIG.financialYear} SAPTO thresholds when this page was last verified, so it is not labelled with that year. Every figure on this page is derived from a single constants file and checked against the ATO&rsquo;s nine published worked examples in automated tests.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
            {(() => { const a = getGuideAuthorship("sapto-calculator"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
        </article>

        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/low-income-tax-offset/" label="LITO Guide" /><SidebarLink href="/zone-tax-offset/" label="Zone Tax Offset Calculator" /><SidebarLink href="/medicare-levy/" label="Medicare Levy Guide" /><SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" /><SidebarLink href="/tax-brackets/" label="Australian Tax Brackets" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

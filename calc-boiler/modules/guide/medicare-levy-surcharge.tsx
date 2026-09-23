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
import { MEDICARE_LEVY, SOURCES, formatAUD, formatPercent } from "@/lib/constants";
import { MLS_CHILD_INCREMENT } from "@/lib/constants/medicare-levy-extra";
import {
  MLS_APPROPRIATE_COVER_MAX_EXCESS,
  MLS_INCOME_YEAR,
  MLS_SPOUSE_LOW_INCOME,
  PHI_REBATE,
  estimateMls,
  familyBaseThreshold,
  formatMlsRate,
  phiRebateRate,
  type PhiAgeBracket,
} from "@/lib/constants/medicare-levy-surcharge";
import type { MlsTier } from "@/lib/constants/medicare-levy-extra";
import MedicareLevySurchargeCalculator from "@/modules/calculator/medicare-levy-surcharge-calculator";
import { MLS_FAQS } from "@/modules/guide/medicare-levy-surcharge-faqs";

const ATO_RATES =
  "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/medicare-levy-surcharge-income-thresholds-and-rates";
const ATO_PAYING =
  "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/paying-the-medicare-levy-surcharge";
const ATO_COVER =
  "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/paying-the-medicare-levy-surcharge/appropriate-level-of-private-patient-hospital-cover";
const ATO_FAMILY =
  "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/family-and-dependants-for-medicare-levy-surcharge-purposes";
const ATO_REBATE =
  "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/private-health-insurance-rebate/income-thresholds-and-rates-for-the-private-health-insurance-rebate";

const SOURCES_LIST: SourceLink[] = [
  { title: "Medicare levy surcharge income, thresholds and rates (QC49961)", url: ATO_RATES, publisher: SOURCES.ato.name },
  { title: "Paying the Medicare levy surcharge (QC71227)", url: ATO_PAYING, publisher: SOURCES.ato.name },
  { title: "Appropriate level of private patient hospital cover (QC71224)", url: ATO_COVER, publisher: SOURCES.ato.name },
  { title: "Family and dependants for MLS purposes (QC27044)", url: ATO_FAMILY, publisher: SOURCES.ato.name },
  { title: "Income thresholds and rates for the private health insurance rebate", url: ATO_REBATE, publisher: SOURCES.ato.name },
];

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const S = MEDICARE_LEVY.surcharge;
const SINGLE_BASE = S.tier1.min - 1;
const FAMILY_BASE = familyBaseThreshold(0);
const RATE = formatPercent(MEDICARE_LEVY.rate, 0);
const mlsPct = formatMlsRate;

const H2 = ({ children, id }: { children: React.ReactNode; id?: string }) => <h2 id={id} style={FONT}>{children}</h2>;

const TIERS: { name: string; single: string; family: string; rate: number; tier: MlsTier }[] = [
  { name: "Base tier", single: `${formatAUD(SINGLE_BASE)} or less`, family: `${formatAUD(FAMILY_BASE)} or less`, rate: 0, tier: 0 },
  { name: "Tier 1", single: `${formatAUD(S.tier1.min)} – ${formatAUD(S.tier1.max)}`, family: `${formatAUD(S.familyTier1.min)} – ${formatAUD(S.familyTier1.max)}`, rate: S.tier1.rate, tier: 1 },
  { name: "Tier 2", single: `${formatAUD(S.tier2.min)} – ${formatAUD(S.tier2.max)}`, family: `${formatAUD(S.familyTier2.min)} – ${formatAUD(S.familyTier2.max)}`, rate: S.tier2.rate, tier: 2 },
  { name: "Tier 3", single: `${formatAUD(S.tier3.min)} or more`, family: `${formatAUD(S.familyTier3.min)} or more`, rate: S.tier3.rate, tier: 3 },
];

const singleAt = (taxableIncome: number, extra: { rfb?: number; resc?: number } = {}) =>
  estimateMls({
    own: { taxableIncome, reportableFringeBenefits: extra.rfb ?? 0, netInvestmentLosses: 0, reportableSuperContributions: extra.resc ?? 0 },
    hasSpouse: false,
    spouseMlsIncome: 0,
    dependentChildren: 0,
    daysWithoutCover: 365,
  });

const TOM = singleAt(90_000, { rfb: 27_000 });
const SACRIFICE = singleAt(102_000, { resc: 8_000 });
const TABLE_INCOMES = [100_000, 105_000, 110_000, 123_000, 130_000, 150_000, 164_000, 180_000, 200_000];
const BREAK_EVEN_INCOMES = [110_000, 130_000, 170_000];
const AGES: { key: PhiAgeBracket; label: string }[] = [
  { key: "under65", label: "Under 65" },
  { key: "age65to69", label: "65 – 69" },
  { key: "age70plus", label: "70 and over" },
];

export default function MedicareLevySurchargePage() {
  const authorship = getGuideAuthorship("medicare-levy-surcharge-calculator");
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><Link href="/medicare-levy/" className="hover:text-eucalyptus-dark hover:underline">Medicare Levy</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Medicare Levy Surcharge Calculator</span></li></ol></nav>

      <header className="mb-10 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={FONT}>Medicare Levy Surcharge Calculator {MLS_INCOME_YEAR}</h1>
        <p className="text-xl text-warmgray leading-relaxed mb-6">
          The Medicare levy surcharge (MLS) is an extra <strong>1% to 1.5%</strong> charged on top of the {RATE} Medicare levy if your income for MLS purposes is over <strong>{formatAUD(SINGLE_BASE)}</strong> (singles) or <strong>{formatAUD(FAMILY_BASE)}</strong> (families) in {MLS_INCOME_YEAR} and you don&rsquo;t hold private patient hospital cover. Work out your tier, your surcharge, and whether a hospital policy would cost less.
        </p>
        <TrustBar className="!max-w-none" />
      </header>

      <div className="mb-12"><MedicareLevySurchargeCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          <section>
            <H2 id="thresholds">Medicare Levy Surcharge Thresholds and Rates {MLS_INCOME_YEAR}</H2>
            <p>Your tier is set by your income for MLS purposes: your own if you&rsquo;re single, or you and your spouse&rsquo;s combined if you have a family. These are the ATO&rsquo;s {MLS_INCOME_YEAR} figures.</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-4 py-3">Tier</th><th className="px-4 py-3">Singles</th><th className="px-4 py-3">Families</th><th className="px-4 py-3 text-right">MLS rate</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {TIERS.map((t, i) => (
                <tr key={t.name} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}><td className="px-4 py-3 font-medium text-navy">{t.name}</td><td className="px-4 py-3 tabular-nums">{t.single}</td><td className="px-4 py-3 tabular-nums">{t.family}</td><td className="px-4 py-3 text-right font-medium text-navy">{mlsPct(t.rate)}</td></tr>
              ))}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">ATO, <a href={ATO_RATES} target="_blank" rel="noopener noreferrer" className="hover:underline">Medicare levy surcharge income, thresholds and rates</a>, last updated 22 June 2026.</p></div>
            <p>Families get <strong>{formatAUD(MLS_CHILD_INCREMENT)} more for each dependent child after the first</strong>, and every family boundary moves by the same amount. The surcharge-free family threshold is {formatAUD(familyBaseThreshold(1))} with one child, {formatAUD(familyBaseThreshold(2))} with two, {formatAUD(familyBaseThreshold(3))} with three and {formatAUD(familyBaseThreshold(4))} with four. Single parents use the family thresholds.</p>
          </section>

          <section>
            <H2 id="mls-income">Income for MLS Purposes, and What the Rate Is Charged On</H2>
            <p>Income for MLS purposes is wider than taxable income. It&rsquo;s the total of:</p>
            <ul>
              <li><strong>Taxable income</strong> (including any amount on which family trust distribution tax was paid)</li>
              <li><strong>Reportable fringe benefits</strong>, e.g. from a <Link href="/novated-lease-calculator/">novated lease</Link></li>
              <li><strong>Total net investment losses</strong>: net rental property losses plus net financial investment losses</li>
              <li><strong>Reportable super contributions</strong>: salary sacrifice plus personal contributions you claim a deduction for</li>
            </ul>
            <p className="not-prose rounded-lg border-l-4 border-ochre bg-sandstone/60 p-4 text-base text-navy"><strong>Two different amounts.</strong> The four items above decide your <em>tier</em>. The ATO then charges the rate only on your <strong>taxable income plus reportable fringe benefits</strong> (and any family trust distribution tax amount). Investment losses and super contributions can push you into a tier, but they aren&rsquo;t charged.</p>
            <p>That&rsquo;s why negative gearing and salary sacrifice don&rsquo;t get you under the threshold. Someone who sacrifices {formatAUD(8_000)} from a {formatAUD(110_000)} salary has taxable income of {formatAUD(102_000)} but income for MLS purposes of {formatAUD(SACRIFICE.ownMlsIncome)}. That&rsquo;s Tier {SACRIFICE.tier}, and the surcharge is {mlsPct(SACRIFICE.rate)} of {formatAUD(SACRIFICE.chargeBase)}: <strong>{formatAUD(SACRIFICE.fullYearSurcharge)}</strong>. Model the sacrifice itself with the <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link>.</p>
          </section>

          <section>
            <H2 id="example">Worked Example: the ATO&rsquo;s &ldquo;Tom&rdquo;</H2>
            <p>Tom is 35, single, has no private patient hospital cover, taxable income of {formatAUD(90_000)} and reportable fringe benefits of {formatAUD(27_000)}.</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Income for MLS purposes ({formatAUD(90_000)} + {formatAUD(27_000)})</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(TOM.ownMlsIncome)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Tier (single)</td><td className="px-5 py-3 text-right">Tier {TOM.tier}, {mlsPct(TOM.rate)}</td></tr>
              <tr><td className="px-5 py-3 font-medium">Medicare levy surcharge ({formatAUD(TOM.chargeBase)} × {mlsPct(TOM.rate)})</td><td className="px-5 py-3 text-right font-bold tabular-nums">{formatAUD(TOM.fullYearSurcharge)}</td></tr>
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">ATO QC49961 example, {MLS_INCOME_YEAR}. Our calculator reproduces it exactly.</p></div>
            <p>That&rsquo;s on top of his {RATE} Medicare levy. With taxable income of {formatAUD(90_000)} alone, Tom would have been under the {formatAUD(SINGLE_BASE)} threshold. The fringe benefits are what put him in Tier 1.</p>
          </section>

          <section>
            <H2 id="table">Medicare Levy Surcharge by Income (Singles)</H2>
            <p>Full year, no hospital cover, no fringe benefits, investment losses or reportable super. Note the cliff at each boundary: crossing into a tier applies the rate to the whole income, not just the excess.</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-4 py-3">Taxable income</th><th className="px-4 py-3 text-right">MLS rate</th><th className="px-4 py-3 text-right">Surcharge</th><th className="px-4 py-3 text-right">Per fortnight</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {TABLE_INCOMES.map((inc, i) => {
                const r = singleAt(inc);
                return (
                  <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}>
                    <td className="px-4 py-3 font-medium text-navy tabular-nums">{formatAUD(inc)}</td>
                    <td className="px-4 py-3 text-right">{mlsPct(r.rate)}</td>
                    <td className="px-4 py-3 text-right font-medium text-navy tabular-nums">{formatAUD(r.fullYearSurcharge)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatAUD(r.fullYearSurcharge / 26, 2)}</td>
                  </tr>
                );
              })}
            </tbody></table></div></div>
          </section>

          <section>
            <H2 id="cover-vs-surcharge">Is Private Hospital Cover Cheaper Than the Surcharge?</H2>
            <p>It depends on the premium you&rsquo;re quoted, and the government <strong>private health insurance rebate</strong> works against you as income rises: it runs on the same tiers, and shrinks as the surcharge grows. From {PHI_REBATE.period}:</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-4 py-3">Oldest on policy</th>{TIERS.map((t) => <th key={t.name} className="px-4 py-3 text-right">{t.name}</th>)}</tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {AGES.map((a, i) => (
                <tr key={a.key} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}><td className="px-4 py-3 font-medium text-navy">{a.label}</td>{TIERS.map((t) => <td key={t.name} className="px-4 py-3 text-right tabular-nums">{formatPercent(phiRebateRate(t.tier, a.key), 3)}</td>)}</tr>
              ))}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">ATO, <a href={ATO_REBATE} target="_blank" rel="noopener noreferrer" className="hover:underline">Income thresholds and rates for the private health insurance rebate</a>. Rates from 1 April 2027 are due in March 2027.</p></div>
            <p>A simple way to decide: the <strong>break-even premium</strong> is the surcharge divided by the share of the premium you pay after the rebate. If your quote, before the rebate, is under that figure, the cover costs less than the surcharge.</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-4 py-3">Single, taxable income</th><th className="px-4 py-3 text-right">Surcharge</th><th className="px-4 py-3 text-right">Rebate (under 65)</th><th className="px-4 py-3 text-right">Cover is cheaper if the premium is under</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {BREAK_EVEN_INCOMES.map((inc, i) => {
                const r = singleAt(inc);
                const rebate = phiRebateRate(r.tier, "under65");
                return (
                  <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}>
                    <td className="px-4 py-3 font-medium text-navy tabular-nums">{formatAUD(inc)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatAUD(r.fullYearSurcharge)}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatPercent(rebate, 3)}</td>
                    <td className="px-4 py-3 text-right font-medium text-navy tabular-nums">{formatAUD(r.fullYearSurcharge / (1 - rebate))} a year</td>
                  </tr>
                );
              })}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">Cost only. It ignores what the policy actually covers, any lifetime health cover loading, and the rebate change on 1 April 2027. Use the calculator above with your own quote.</p></div>
            <p>For the wider decision, including extras and when cover is worth it below the threshold, see <Link href="/private-health-insurance-medicare/">private health insurance and Medicare</Link>.</p>
          </section>

          <section>
            <H2 id="appropriate-cover">What Cover Avoids the Surcharge</H2>
            <ul>
              <li><strong>Private patient hospital cover</strong> from a registered Australian health insurer, for hospital treatment in an Australian hospital or day hospital.</li>
              <li><strong>An excess no higher than {formatAUD(MLS_APPROPRIATE_COVER_MAX_EXCESS.single)}</strong> for singles, or {formatAUD(MLS_APPROPRIATE_COVER_MAX_EXCESS.family)} for couples and families.</li>
              <li><strong>Everyone covered.</strong> A family avoids the surcharge only if you, your spouse and your dependent children all have appropriate cover.</li>
              <li><strong>Doesn&rsquo;t count:</strong> extras-only (general) cover, travel insurance, and cover from an overseas fund.</li>
            </ul>
            <p>The surcharge applies day by day. Cover that starts part-way through the year leaves you liable for the uncovered days, and cancelling cover while you travel overseas can make you liable too.</p>
          </section>

          <section>
            <H2 id="families">Families, Spouses and Dependants</H2>
            <p>For the surcharge you&rsquo;re in a family if, for any part of the year, you had a spouse or a dependent child who was an Australian resident and you contributed to their maintenance. A spouse includes a de facto partner of any sex. A child is a dependant if they&rsquo;re under 21, or 21 to 24 and studying full time. Foster children don&rsquo;t count.</p>
            <p>Family income decides the tier, but each of you pays the surcharge on your own taxable income and fringe benefits. A spouse with a very low income may not pay it at all: in {MLS_SPOUSE_LOW_INCOME.incomeYear} the ATO&rsquo;s figure was {formatAUD(MLS_SPOUSE_LOW_INCOME.amount)} or less of their own income for MLS purposes. The {MLS_INCOME_YEAR} figure isn&rsquo;t published yet.</p>
            <p>If you partnered up or separated during the year, the single threshold applies to the days you were single and the family threshold to the days you had a spouse or dependants.</p>
          </section>

          <section>
            <H2 id="vs-levy">The Surcharge vs the Medicare Levy</H2>
            <p>They&rsquo;re separate charges. The {RATE} <Link href="/medicare-levy/">Medicare levy</Link> is paid by almost every resident, has low-income and family reductions, and is included in the tax your employer withholds. The surcharge is extra, applies only above the thresholds on this page, can be removed entirely by hospital cover, and isn&rsquo;t withheld from your pay. The ATO adds it when you lodge, and your notice of assessment shows the two together as &ldquo;Medicare levy and surcharge&rdquo;.</p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/medicare-levy/">Medicare Levy Calculator</Link>: the {RATE} levy with the low-income, family and seniors thresholds</li>
              <li><Link href="/private-health-insurance-medicare/">Private Health Insurance and Medicare</Link>: the bigger cover decision</li>
              <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link>: why sacrificing doesn&rsquo;t move your MLS tier</li>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>: your pay after tax and the levy</li>
            </ul>
          </section>

          <section>
            <H2>Frequently Asked Questions</H2>
            <div className="sr-only">
              <h3>Medicare levy surcharge questions and answers</h3>
              {MLS_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
            </div>
            <Accordion type="multiple" className="not-prose mt-6 space-y-3">
              {MLS_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <div className="mt-12 not-prose">
            <MethodologyDisclosure title="How this calculator works">
              <p>The tier is set by income for MLS purposes (taxable income, reportable fringe benefits, total net investment losses and reportable super contributions), combined with your spouse&rsquo;s where you have one, against the ATO&rsquo;s {MLS_INCOME_YEAR} thresholds, with {formatAUD(MLS_CHILD_INCREMENT)} added for each dependent child after the first. The tier rate is charged on your own taxable income plus reportable fringe benefits, then multiplied by the share of the 365-day year you had no appropriate cover. The ATO&rsquo;s worked example (Tom, {formatAUD(TOM.fullYearSurcharge)}) is pinned in automated tests.</p>
              <p>It doesn&rsquo;t model family trust distribution tax amounts, exempt foreign employment income, a change of family status part-way through the year, or the low-income spouse exception, because its {MLS_INCOME_YEAR} figure is unpublished. General information, not tax advice.</p>
            </MethodologyDisclosure>
            <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
            {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
          </div>
        </article>

        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/medicare-levy/" label="Medicare Levy Calculator" /><SidebarLink href="/private-health-insurance-medicare/" label="Private Health Insurance & Medicare" /><SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" /><SidebarLink href="/novated-lease-calculator/" label="Novated Lease Calculator" /><SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

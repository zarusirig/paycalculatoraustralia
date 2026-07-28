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
import { MEDICARE_LEVY, SITE_CONFIG, SOURCES, formatAUD, formatPercent } from "@/lib/constants";
import {
  LEVY_EXEMPTION_CATEGORIES,
  MEDICARE_LEVY_INCOME_YEAR,
  MEDICARE_LEVY_SENIORS,
  MLS_CHILD_INCREMENT,
  MLS_INCOME_YEAR,
  calculateMLS,
  calculateMedicareLevyDetailed,
  familyLowerThreshold,
  upperThreshold,
} from "@/lib/constants/medicare-levy-extra";
import MedicareLevyCalculator from "@/modules/calculator/medicare-levy-calculator";
import { MEDICARE_LEVY_FAQS } from "@/modules/guide/medicare-levy-faqs";

const ATO_LEVY =
  "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy";
const ATO_REDUCTION =
  "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-reduction/medicare-levy-reduction-for-low-income-earners";
const ATO_FAMILY =
  "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-reduction/medicare-levy-reduction-family-income";
const ATO_MLS =
  "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge/medicare-levy-surcharge-income-thresholds-and-rates";
const ATO_EXEMPTION =
  "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy/medicare-levy-exemption";

const SOURCES_LIST: SourceLink[] = [
  { title: "Medicare levy", url: ATO_LEVY, publisher: SOURCES.ato.name },
  { title: "Medicare levy reduction for low-income earners (QC27031)", url: ATO_REDUCTION, publisher: SOURCES.ato.name },
  { title: "Medicare levy reduction – family income (QC27032)", url: ATO_FAMILY, publisher: SOURCES.ato.name },
  { title: "Medicare levy surcharge income, thresholds and rates (QC49961)", url: ATO_MLS, publisher: SOURCES.ato.name },
  { title: "Medicare levy exemption (QC27035)", url: ATO_EXEMPTION, publisher: SOURCES.ato.name },
];

const RATE = formatPercent(MEDICARE_LEVY.rate, 0);
const SHADE = formatPercent(MEDICARE_LEVY.shadeInRate, 0);
const LOWER = MEDICARE_LEVY.lowIncomeThreshold;
const UPPER = MEDICARE_LEVY.shadeInThreshold;
const FAMILY_UPPER = upperThreshold(MEDICARE_LEVY.familyThreshold);
const SENIOR_UPPER = upperThreshold(MEDICARE_LEVY_SENIORS.singleThreshold);
const SENIOR_FAMILY_UPPER = upperThreshold(MEDICARE_LEVY_SENIORS.familyThreshold);

const single = (taxableIncome: number, seniorPensioner = false) =>
  calculateMedicareLevyDetailed({
    taxableIncome,
    hasSpouse: false,
    spouseTaxableIncome: 0,
    dependentChildren: 0,
    seniorPensioner,
  });

/** The ATO's own example: QC27031, Angie, taxable income $29,000. */
const ANGIE = single(29_000);

/** ATO QC27032: Ashton, $49,700, spouse $21,700, entitled to SAPTO. */
const ASHTON = calculateMedicareLevyDetailed({
  taxableIncome: 49_700,
  hasSpouse: true,
  spouseTaxableIncome: 21_700,
  dependentChildren: 0,
  seniorPensioner: true,
});

/** ATO QC49961: Tom, $117,000 income for MLS purposes, no hospital cover. */
const TOM = calculateMLS({
  mlsIncome: 117_000,
  spouseMlsIncome: 0,
  hasSpouse: false,
  dependentChildren: 0,
  hasPrivateHospitalCover: false,
});

const LEVY_ROWS = [25_000, 29_000, 32_000, LOWER, UPPER, 45_000, 75_000, 100_000, 150_000]
  .filter((v, i, a) => a.indexOf(v) === i)
  .sort((a, b) => a - b);

const MLS_TIERS = [
  { name: "Base tier", tier: MEDICARE_LEVY.surcharge.tier1, family: MEDICARE_LEVY.surcharge.familyTier1, base: true },
  { name: "Tier 1", tier: MEDICARE_LEVY.surcharge.tier1, family: MEDICARE_LEVY.surcharge.familyTier1, base: false },
  { name: "Tier 2", tier: MEDICARE_LEVY.surcharge.tier2, family: MEDICARE_LEVY.surcharge.familyTier2, base: false },
  { name: "Tier 3", tier: MEDICARE_LEVY.surcharge.tier3, family: MEDICARE_LEVY.surcharge.familyTier3, base: false },
];

export default function MedicareLevyPage() {
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Medicare Levy Calculator</span></li></ol></nav>

      <header className="mb-10 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Medicare Levy Calculator</h1>
        <p className="text-xl text-warmgray leading-relaxed mb-6">
          The Medicare levy is <strong>{RATE} of your taxable income</strong> — but not from the first dollar. Below {formatAUD(LOWER)} you pay nothing, and between {formatAUD(LOWER)} and {formatAUD(UPPER)} you pay {SHADE} of the excess instead. Work out your exact levy below, including the family and seniors thresholds and the separate Medicare levy surcharge.
        </p>
        <TrustBar className="!max-w-none" />
      </header>

      <div className="mb-12"><MedicareLevyCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How the Medicare Levy Is Calculated</h2>
            <p>The Medicare levy funds Medicare — bulk-billed doctor visits, public hospital treatment and PBS medicines. It is charged on your <strong>taxable income</strong>, which is gross income less allowable deductions, and it sits on top of income tax rather than replacing any part of it.</p>
            <p className="not-prose rounded-lg border-l-4 border-ochre bg-sandstone/60 p-4 text-base text-navy"><strong>The part most calculators get wrong:</strong> the levy is not a flat {RATE} from the first dollar. There are three bands, and the middle one — the shade-in — catches roughly every part-time and low-income earner in the country.</p>
            <ul>
              <li><strong>At or under {formatAUD(LOWER)}</strong> — no levy at all.</li>
              <li><strong>Between {formatAUD(LOWER)} and {formatAUD(UPPER)}</strong> — you pay {SHADE} of the amount over {formatAUD(LOWER)}, which is always less than {RATE} of your income.</li>
              <li><strong>Above {formatAUD(UPPER)}</strong> — the full {RATE}.</li>
            </ul>
            <p>The upper threshold is not an arbitrary number. {SHADE} of the excess and {RATE} of total income meet at exactly 1.25 times the lower threshold, which is where the shade-in stops mattering. Every threshold pair the ATO publishes follows that ratio.</p>

            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Taxable income</th><th className="px-5 py-3 text-right">Medicare levy</th><th className="px-5 py-3 text-right">Flat {RATE} would be</th><th className="px-5 py-3">Band</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {LEVY_ROWS.map((income, i) => {
                const r = single(income);
                return (
                  <tr key={income} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}>
                    <td className="px-5 py-3 font-medium text-navy">{formatAUD(income)}</td>
                    <td className="px-5 py-3 text-right font-medium text-navy tabular-nums">{formatAUD(r.levy, 2)}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-warmgray-light">{formatAUD(income * MEDICARE_LEVY.rate, 2)}</td>
                    <td className="px-5 py-3">{r.band === "belowSingleThreshold" ? "Nil" : r.band === "singleShadeIn" ? "Shade-in" : `Full ${RATE}`}</td>
                  </tr>
                );
              })}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">Single taxpayer, no dependants, not entitled to SAPTO. {MEDICARE_LEVY_INCOME_YEAR} thresholds per ATO <a href={ATO_REDUCTION} target="_blank" rel="noopener noreferrer" className="hover:underline">Medicare levy reduction for low-income earners</a>.</p></div>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: {formatAUD(29_000)} Taxable Income</h2>
            <p>This is the ATO&rsquo;s own example. Angie earns {formatAUD(29_000)}, is single with no dependants and is not entitled to SAPTO. Her income is above the {formatAUD(LOWER)} threshold but below {formatAUD(UPPER)}, so the shade-in applies:</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Taxable income above the threshold</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(29_000)} − {formatAUD(LOWER)} = {formatAUD(29_000 - LOWER)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Levy at {SHADE} of the excess</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(ANGIE.levy, 2)}</td></tr>
              <tr><td className="px-5 py-3 text-warmgray-light">What a flat {RATE} would have charged</td><td className="px-5 py-3 text-right tabular-nums text-warmgray-light">{formatAUD(ANGIE.fullRateLevy, 2)}</td></tr>
              <tr><td className="px-5 py-3 font-medium">Medicare levy payable</td><td className="px-5 py-3 text-right font-bold tabular-nums">{formatAUD(ANGIE.levy, 2)}</td></tr>
            </tbody></table></div></div>
            <p>The difference is {formatAUD(ANGIE.fullRateLevy - ANGIE.levy, 2)} — on an income of {formatAUD(29_000)}. Getting the shade-in wrong is not a rounding error.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Family Thresholds</h2>
            <p>If you had a spouse on 30 June, or you maintained a dependent child, a second and more generous test applies. It runs on <strong>family taxable income</strong> — your income plus your spouse&rsquo;s, or your own income alone if you are a sole parent — against a family threshold of {formatAUD(MEDICARE_LEVY.familyThreshold)}, which rises by <strong>{formatAUD(MEDICARE_LEVY.additionalChild)} for each dependent child</strong>.</p>
            <p>Below that threshold no levy is payable at all. Above it the levy is reduced until family income reaches {formatAUD(FAMILY_UPPER)} (again 1.25 times the threshold), after which the full {RATE} applies.</p>

            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Dependent children</th><th className="px-5 py-3 text-right">No levy at or under</th><th className="px-5 py-3 text-right">Full {RATE} above</th><th className="px-5 py-3 text-right">SAPTO threshold</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {[0, 1, 2, 3].map((n, i) => (
                <tr key={n} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}>
                  <td className="px-5 py-3 font-medium text-navy">{n === 0 ? "None" : n}</td>
                  <td className="px-5 py-3 text-right font-medium text-navy tabular-nums">{formatAUD(familyLowerThreshold(n, false))}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{formatAUD(upperThreshold(familyLowerThreshold(n, false)))}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{formatAUD(familyLowerThreshold(n, true))}</td>
                </tr>
              ))}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">ATO, <a href={ATO_FAMILY} target="_blank" rel="noopener noreferrer" className="hover:underline">Medicare levy reduction – family income</a>. {MEDICARE_LEVY_INCOME_YEAR} income year.</p></div>

            <p className="not-prose rounded-lg border-l-4 border-ochre bg-sandstone/60 p-4 text-base text-navy"><strong>The family reduction is applied on top of the low-income reduction, not instead of it.</strong> Medicare Levy Act 1986 s 8(2) reduces the levy that would be payable <em>after</em> the individual shade-in. Software that applies only one of the two overstates the levy for most families in the band.</p>

            <p>Where both partners would be liable for the levy, the reduction is split between them in proportion to their taxable incomes. Where only one partner is liable — because the other is under the individual threshold — that partner takes the whole reduction.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Seniors and Pensioners</h2>
            <p>Seniors and pensioners get materially higher thresholds: <strong>{formatAUD(MEDICARE_LEVY_SENIORS.singleThreshold)}</strong> single (full levy above {formatAUD(SENIOR_UPPER)}) and <strong>{formatAUD(MEDICARE_LEVY_SENIORS.familyThreshold)}</strong> for a family (full levy above {formatAUD(SENIOR_FAMILY_UPPER)}). A single senior on {formatAUD(40_000)} pays <strong>nothing</strong>, where anyone else on the same income pays {formatAUD(single(40_000).levy)}.</p>
            <p>The qualifying test is the one people get wrong. It is not age — it is <strong>entitlement to at least $1 of the seniors and pensioners tax offset</strong>. Someone who reaches age-pension age but whose rebate income is too high for any SAPTO cannot use these thresholds. SAPTO for singles cuts out at {formatAUD(MEDICARE_LEVY_SENIORS.saptoSingleCutOut)} of rebate income, which is <em>below</em> the {formatAUD(SENIOR_UPPER)} upper Medicare threshold — so the top of the seniors band is reached through the ordinary thresholds instead. Check your entitlement with the <Link href="/sapto-calculator/">SAPTO calculator</Link> first.</p>
            <p>The ATO&rsquo;s worked example shows both reductions stacking. Ashton is 68, has taxable income of {formatAUD(49_700)}, an illness-separated spouse on {formatAUD(21_700)}, no children, and is entitled to SAPTO:</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Levy at {RATE} of {formatAUD(49_700)}</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(ASHTON.fullRateLevy, 2)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">After the seniors low-income reduction ({SHADE} of the amount over {formatAUD(MEDICARE_LEVY_SENIORS.singleThreshold)})</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(ASHTON.levyAfterIndividualReduction, 2)}</td></tr>
              <tr><td className="px-5 py-3">Less the family reduction on family income of {formatAUD(ASHTON.familyIncome)}</td><td className="px-5 py-3 text-right tabular-nums">−{formatAUD(ASHTON.familyReduction, 2)}</td></tr>
              <tr><td className="px-5 py-3 font-medium">Medicare levy payable</td><td className="px-5 py-3 text-right font-bold tabular-nums">{formatAUD(ASHTON.levy, 2)}</td></tr>
            </tbody></table></div></div>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Medicare Levy Surcharge Is a Different Charge</h2>
            <p className="not-prose rounded-lg border-l-4 border-ochre bg-sandstone/60 p-4 text-base text-navy"><strong>The surcharge is not the levy.</strong> The {RATE} levy is paid by almost every resident and cannot be avoided by buying insurance. The surcharge is an extra 1% to 1.5% charged only to higher earners <em>who do not hold private patient hospital cover</em> — and it disappears completely the moment you do.</p>
            <p>The tiers below are the ATO&rsquo;s {MLS_INCOME_YEAR} figures. Note the income they test is <strong>income for surcharge purposes</strong>, which is wider than taxable income: it adds reportable fringe benefits, total net investment losses and reportable super contributions.</p>

            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Tier</th><th className="px-5 py-3">Singles</th><th className="px-5 py-3">Families</th><th className="px-5 py-3 text-right">Surcharge</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {MLS_TIERS.map((t, i) => (
                <tr key={t.name} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}>
                  <td className="px-5 py-3 font-medium text-navy">{t.name}</td>
                  <td className="px-5 py-3">{t.base ? `${formatAUD(t.tier.min - 1)} or less` : t.tier.max === Infinity ? `${formatAUD(t.tier.min)} or more` : `${formatAUD(t.tier.min)} – ${formatAUD(t.tier.max)}`}</td>
                  <td className="px-5 py-3">{t.base ? `${formatAUD(t.family.min - 1)} or less` : t.family.max === Infinity ? `${formatAUD(t.family.min)} or more` : `${formatAUD(t.family.min)} – ${formatAUD(t.family.max)}`}</td>
                  <td className="px-5 py-3 text-right font-medium text-navy">{t.base ? "0%" : formatPercent(t.tier.rate, 2)}</td>
                </tr>
              ))}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">ATO, <a href={ATO_MLS} target="_blank" rel="noopener noreferrer" className="hover:underline">Medicare levy surcharge income, thresholds and rates</a>. {MLS_INCOME_YEAR} income year. Family thresholds rise {formatAUD(MLS_CHILD_INCREMENT)} for each dependent child after the first.</p></div>

            <p>The ATO&rsquo;s example: Tom is 35, single, has no hospital cover, taxable income of {formatAUD(90_000)} and reportable fringe benefits of {formatAUD(27_000)}. His income for surcharge purposes is {formatAUD(117_000)}, which puts him in Tier {TOM.tier} at {formatPercent(TOM.rate, 0)} — a surcharge of <strong>{formatAUD(TOM.surcharge)}</strong>, charged on the whole {formatAUD(117_000)} rather than on the excess over the threshold. That cliff edge is why the surcharge is usually more expensive than a basic hospital policy once you are past the {formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)} threshold.</p>

            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Avoid It</h3>
            <ol>
              <li><strong>Hospital cover, not extras.</strong> An extras-only policy does not satisfy the requirement — the policy must include hospital treatment from a registered health insurer.</li>
              <li><strong>The whole year.</strong> The surcharge is calculated day by day. A policy that starts in October still leaves you liable for 1 July to 30 September.</li>
              <li><strong>Salary sacrifice will not do it.</strong> Reportable super contributions are added back into income for surcharge purposes, so sacrificing reduces your levy but not your surcharge tier.</li>
            </ol>
            <p>Our <Link href="/private-health-insurance-medicare/">private health insurance and Medicare guide</Link> covers the cost comparison in detail.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Who Is Exempt from the Medicare Levy?</h2>
            <p>Exemptions are separate from reductions. A reduction lowers the levy because your income is low; an exemption removes it because you were not entitled to Medicare, or were entitled to free treatment elsewhere. Some exemptions are <strong>half</strong> rather than full, which is the detail most summaries skip.</p>
            <div className="not-prose my-6 space-y-4">
              {LEVY_EXEMPTION_CATEGORIES.map((c) => (
                <div key={c.category} className="rounded-xl border border-sandstone-dark/20 bg-white p-5">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-navy">{c.category}</h3>
                    <span className="text-xs font-semibold uppercase tracking-wider text-ochre whitespace-nowrap">{c.relief}</span>
                  </div>
                  <p className="text-sm text-warmgray">{c.detail}</p>
                </div>
              ))}
            </div>
            <p>You claim an exemption in the Medicare levy section of your tax return, and the ATO works the amount out for you. If your employer withheld the levy through the year but you were entitled to a reduction or exemption, the excess comes back as part of your refund — see the <Link href="/tax-return-calculator/">tax return calculator</Link>. Residency itself is covered in our <Link href="/non-resident-tax/">non-resident tax guide</Link>.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How the Levy Reaches Your Pay</h2>
            <p>The levy is bundled into PAYG withholding, so it does not appear as its own line on a payslip. The figure shown as &ldquo;tax&rdquo; already includes it — on {formatAUD(75_000)} of taxable income, {formatAUD(single(75_000).levy)} of the year&rsquo;s withholding is Medicare levy. Our <Link href="/understanding-your-payslip/">payslip guide</Link> breaks down the rest of the line items.</p>
            <p>The surcharge behaves differently. It is not withheld during the year unless you request an upward variation, so people who cross the threshold without cover usually meet it as a bill at lodgment rather than a smaller fortnightly pay. Salary sacrifice reduces taxable income and therefore the levy — see the <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link> — but not the surcharge.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
            <ul>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> — income tax, Medicare levy, HECS and super in one breakdown</li>
              <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> — your tax before the levy is added</li>
              <li><Link href="/sapto-calculator/">SAPTO Calculator</Link> — check the entitlement that unlocks the seniors Medicare threshold</li>
              <li><Link href="/private-health-insurance-medicare/">Private Health Insurance and Medicare</Link> — whether cover beats the surcharge at your income</li>
              <li><Link href="/low-income-tax-offset/">Low Income Tax Offset</Link> — the other concession low-income earners claim</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <div className="sr-only">
              <h3>Medicare levy questions and answers</h3>
              {MEDICARE_LEVY_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
            </div>
            <Accordion type="multiple" className="not-prose mt-6 space-y-3">
              {MEDICARE_LEVY_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <div className="mt-12 not-prose">
            <MethodologyDisclosure title="How this calculator works">
              <p>The levy is worked out in two stages, in the order the legislation sets. First the individual low-income reduction under Medicare Levy Act 1986 s 7: nil at or under the lower threshold, then {SHADE} of the excess until it meets {RATE} of income. Then, if you have a spouse or dependants, the family reduction under s 8(2) — <code>{RATE} × family threshold − 0.08 × (family income − family threshold)</code> — is subtracted from that result, split between spouses in proportion to their taxable incomes where both are liable. Both of the ATO&rsquo;s published worked examples reproduce to the cent under this method and are pinned in automated tests.</p>
              <p><strong>Two income years are in play, deliberately.</strong> The low-income, family and seniors thresholds are the ATO&rsquo;s {MEDICARE_LEVY_INCOME_YEAR} figures — the latest published, and the year currently being lodged. The ATO had not released {MLS_INCOME_YEAR} Medicare levy thresholds when this page was last verified on {SITE_CONFIG.lastVerified}, so it is not labelled with that year. The surcharge tiers <em>are</em> published for {MLS_INCOME_YEAR} and are shown on that basis. The {RATE} rate has not changed since 1 July 2014.</p>
              <p>This is general information, not tax advice, and it assumes a full year of Australian residency with no exemption claimed. Every figure is derived from a single constants file so the calculator, tables and FAQ cannot disagree.</p>
            </MethodologyDisclosure>
            <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
            {(() => { const a = getGuideAuthorship("medicare-levy"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
          </div>
        </article>

        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" /><SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" /><SidebarLink href="/sapto-calculator/" label="SAPTO Calculator" /><SidebarLink href="/private-health-insurance-medicare/" label="Private Health Insurance & Medicare" /><SidebarLink href="/low-income-tax-offset/" label="Low Income Tax Offset" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

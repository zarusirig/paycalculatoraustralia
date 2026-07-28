"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, formatAUD, formatPercent } from "@/lib/constants";
import {
  ABSENCE_RULE,
  CGT_AFFORDABLE_HOUSING,
  CGT_DISCOUNT_RATES,
  CGT_ENTITY_LABELS,
  CGT_EXEMPT_ASSETS,
  CGT_INCOME_YEAR,
  CGT_INDEXATION_CUTOFF,
  CGT_MINIMUM_OWNERSHIP_MONTHS,
  CGT_REFORM_2027,
  CGT_START_DATE,
  COST_BASE_ELEMENTS,
  COST_BASE_EXCLUSIONS,
  MAIN_RESIDENCE_CONDITIONS,
  apportionMainResidenceGain,
  calculateCGT,
  type CgtEntity,
} from "@/lib/constants/capital-gains-tax";
import CgtCalculator from "@/modules/calculator/cgt-calculator";
import { CGT_FAQS } from "@/modules/guide/capital-gains-tax-faqs";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const ATO_CGT = "https://www.ato.gov.au/individuals-and-families/investments-and-assets/capital-gains-tax";
const ATO_DISCOUNT = `${ATO_CGT}/cgt-discount`;
const ATO_CALC = `${ATO_CGT}/calculating-your-cgt/how-to-calculate-your-cgt`;
const ATO_COST_BASE = `${ATO_CGT}/calculating-your-cgt/cost-base-of-asset`;
const ATO_LOSSES = `${ATO_CGT}/calculating-your-cgt/using-capital-losses-to-reduce-capital-gains`;
const ATO_MAIN_RESIDENCE = `${ATO_CGT}/property-and-capital-gains-tax/your-main-residence-home/eligibility-for-main-residence-exemption`;
const ATO_SIX_YEAR = `${ATO_CGT}/property-and-capital-gains-tax/your-main-residence-home/treating-former-home-as-main-residence`;
const ATO_WHAT_IS = `${ATO_CGT}/what-is-capital-gains-tax`;
const ATO_EXEMPTIONS = `${ATO_CGT}/list-of-cgt-assets-and-exemptions`;

const SOURCES_LIST: SourceLink[] = [
  { title: "What is capital gains tax? (QC69844)", url: ATO_WHAT_IS, publisher: SOURCES.ato.name },
  { title: "CGT discount (QC66019)", url: ATO_DISCOUNT, publisher: SOURCES.ato.name },
  { title: "How to calculate your CGT (QC104071)", url: ATO_CALC, publisher: SOURCES.ato.name },
  { title: "Cost base of assets (QC66022)", url: ATO_COST_BASE, publisher: SOURCES.ato.name },
  {
    title: "Using capital losses to reduce capital gains (QC66025)",
    url: ATO_LOSSES,
    publisher: SOURCES.ato.name,
  },
  {
    title: "Treating former home as main residence (QC66030)",
    url: ATO_SIX_YEAR,
    publisher: SOURCES.ato.name,
  },
  {
    title: `${CGT_REFORM_2027.actName} (${CGT_REFORM_2027.actNumber})`,
    url: CGT_REFORM_2027.actUrl,
    publisher: "Parliament of Australia",
  },
  { title: "Budget 2026-27 — Tax reform", url: CGT_REFORM_2027.budgetUrl, publisher: "Australian Government" },
];

// Every worked figure below comes out of the engine, so the prose cannot drift
// from the calculator sitting at the top of the page.
const RHI = calculateCGT({
  purchasePrice: 500_000,
  buyingCosts: 15_000 + 1_200,
  sellingCosts: 1_300 + 12_500,
  salePrice: 600_000,
  ownedAtLeast12Months: true,
  otherIncome: 0,
});

const RHI_WITH_LOSS = calculateCGT({
  purchasePrice: 500_000,
  buyingCosts: 15_000 + 1_200,
  sellingCosts: 1_300 + 12_500,
  salePrice: 600_000,
  ownedAtLeast12Months: true,
  otherIncome: 0,
  currentYearLosses: 4_500,
});

// The same gain at three incomes — the evidence that there is no single rate.
const RATE_ROWS = [60_000, 100_000, 160_000, 250_000].map((income) => ({
  income,
  result: calculateCGT({
    purchasePrice: 300_000,
    salePrice: 400_000,
    ownedAtLeast12Months: true,
    otherIncome: income,
  }),
}));

const ROYA_ASSESSABLE = apportionMainResidenceGain(320_000, 6_940, 9_133);
const ROYA_NET = calculateCGT({
  purchasePrice: 0,
  salePrice: ROYA_ASSESSABLE,
  ownedAtLeast12Months: true,
  otherIncome: 0,
}).netCapitalGain;

const ENTITY_ORDER: CgtEntity[] = ["individual", "trust", "superFund", "company"];

/**
 * Percentages without trailing zeros, so the super fund rate renders as the
 * ATO's own "33.33%" rather than being rounded to 33.3%.
 */
const PCT = (n: number) => `${Number((n * 100).toFixed(2))}%`;

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

export default function CapitalGainsTaxPage() {
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Capital Gains Tax Calculator</span></li></ol></nav>

      <header className="mb-10 max-w-4xl"><h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={H2}>Capital Gains Tax Calculator</h1><p className="text-xl text-warmgray leading-relaxed mb-6">There is no capital gains tax rate in Australia. CGT is <strong>part of your income tax</strong>, so your gain is added to your taxable income and taxed at your marginal rate. Hold an asset for at least {CGT_MINIMUM_OWNERSHIP_MONTHS} months and you are taxed on only <strong>{formatPercent(1 - CGT_DISCOUNT_RATES.individual, 0)}</strong> of the gain. Work out your exact bill below.</p><TrustBar className="!max-w-none" /></header>

      <div className="mb-12"><CgtCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          <section>
            <h2 style={H2}>There Is No &ldquo;Capital Gains Tax Rate&rdquo;</h2>
            <p>This is the single most common misconception about CGT, and it is worth stating plainly. The ATO&rsquo;s own words: <em>&ldquo;Although it is referred to as &lsquo;capital gains tax&rsquo;, it&rsquo;s part of your income tax. It&rsquo;s not a separate tax.&rdquo;</em></p>
            <p>There is no separate rate, no separate return and no separate bill. Your <strong>net capital gain</strong> is added to your taxable income for the year, and the whole lot is taxed on the ordinary <Link href="/tax-brackets/">marginal rate scale</Link>. That means the same gain costs different people wildly different amounts.</p>
            <p>Here is the same {formatAUD(100_000)} gain on an asset held more than {CGT_MINIMUM_OWNERSHIP_MONTHS} months, for four people who differ only in their salary:</p>

            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Other income</th><th className="px-5 py-3">Net capital gain</th><th className="px-5 py-3">Marginal rate</th><th className="px-5 py-3">Tax on the gain</th><th className="px-5 py-3">Effective rate</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {RATE_ROWS.map(({ income, result }, i) => (
                <tr key={income} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className="px-5 py-3 font-medium">{formatAUD(income)}</td>
                  <td className="px-5 py-3 tabular-nums">{formatAUD(result.netCapitalGain)}</td>
                  <td className="px-5 py-3 tabular-nums">{formatPercent(result.marginalRate, 0)}</td>
                  <td className="px-5 py-3 font-medium tabular-nums">{formatAUD(result.totalTaxOnGain)}</td>
                  <td className="px-5 py-3 tabular-nums">{formatPercent(result.effectiveRateOnGain)}</td>
                </tr>
              ))}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">Identical {formatAUD(100_000)} gain, {CGT_INCOME_YEAR} rates, including the 2% Medicare levy. Effective rate is tax as a share of the full gain before the discount.</p></div>

            <p>The &ldquo;effective rate&rdquo; column is the closest thing to a CGT rate that exists — and as you can see, it is an <em>outcome</em>, not a published figure. It moves with your income, and a gain large enough to push you into a higher bracket is partly taxed at that higher rate.</p>
          </section>

          <section>
            <h2 style={H2}>How CGT Is Actually Calculated</h2>
            <p>The ATO sets out eight steps. The calculator above follows them exactly, and the order matters more than people expect:</p>
            <ol>
              <li>Work out your <strong>capital proceeds</strong> — what you received.</li>
              <li>Work out your <strong>cost base</strong> — what the asset cost you to buy, hold and sell.</li>
              <li>Subtract the cost base from the proceeds. Above zero is a gain, below zero is a loss.</li>
              <li>Repeat for every CGT event in the year.</li>
              <li><strong>Subtract your capital losses</strong> — carried-forward losses first.</li>
              <li>Check whether you are left with a net gain or a net loss.</li>
              <li><strong>Apply the {formatPercent(CGT_DISCOUNT_RATES.individual, 0)} discount</strong> to whatever remains that is eligible.</li>
              <li>Report the net capital gain and pay tax on it at your marginal rate.</li>
            </ol>
            <p className="not-prose rounded-lg border-l-4 border-ochre bg-sandstone/60 p-4 text-base text-navy"><strong>Losses come off before the discount, not after.</strong> This is step 5 before step 7, and reversing them is the most common error in third-party CGT calculators. It always understates the tax — see the worked example below, where getting the order wrong hides {formatAUD(RHI_WITH_LOSS.netCapitalGain - (RHI.netCapitalGain - 4_500))} of gain.</p>
          </section>

          <section>
            <h2 style={H2}>Worked Example: The ATO&rsquo;s Investment Property</h2>
            <p>The ATO&rsquo;s own example. Rhi buys an investment property for {formatAUD(500_000)} and sells it five years later for {formatAUD(600_000)}:</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Capital proceeds</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(RHI.capitalProceeds)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Cost base — {formatAUD(500_000)} purchase, {formatAUD(15_000)} stamp duty, {formatAUD(1_200)} conveyancing, {formatAUD(1_300)} conveyancing on sale, {formatAUD(12_500)} agent&rsquo;s commission</td><td className="px-5 py-3 text-right tabular-nums">−{formatAUD(RHI.costBase)}</td></tr>
              <tr><td className="px-5 py-3 font-medium">Capital gain</td><td className="px-5 py-3 text-right font-medium tabular-nums">{formatAUD(RHI.grossGain)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">{formatPercent(CGT_DISCOUNT_RATES.individual, 0)} CGT discount</td><td className="px-5 py-3 text-right tabular-nums">−{formatAUD(RHI.discountAmount)}</td></tr>
              <tr><td className="px-5 py-3 font-bold">Net capital gain reported</td><td className="px-5 py-3 text-right font-bold tabular-nums">{formatAUD(RHI.netCapitalGain)}</td></tr>
            </tbody></table></div></div>

            <p>Now add a second asset. In the same year Rhi also sells shares that cost {formatAUD(10_000)} for {formatAUD(5_500)}, a capital loss of {formatAUD(4_500)}:</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Capital gain on the property</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(RHI_WITH_LOSS.grossGain)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Capital loss on the shares — applied <em>first</em></td><td className="px-5 py-3 text-right tabular-nums">−{formatAUD(RHI_WITH_LOSS.lossesApplied)}</td></tr>
              <tr><td className="px-5 py-3">Gain after losses</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(RHI_WITH_LOSS.gainAfterLosses)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">{formatPercent(CGT_DISCOUNT_RATES.individual, 0)} CGT discount</td><td className="px-5 py-3 text-right tabular-nums">−{formatAUD(RHI_WITH_LOSS.discountAmount)}</td></tr>
              <tr><td className="px-5 py-3 font-bold">Net capital gain reported</td><td className="px-5 py-3 text-right font-bold tabular-nums">{formatAUD(RHI_WITH_LOSS.netCapitalGain)}</td></tr>
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">Discount first, then losses, would give {formatAUD(RHI.netCapitalGain - 4_500)} — understating the gain by {formatAUD(RHI_WITH_LOSS.netCapitalGain - (RHI.netCapitalGain - 4_500))}.</p></div>
          </section>

          <section>
            <h2 style={H2}>The {CGT_MINIMUM_OWNERSHIP_MONTHS}-Month {formatPercent(CGT_DISCOUNT_RATES.individual, 0)} CGT Discount</h2>
            <p>If you are an Australian resident for tax purposes and you owned the asset for at least {CGT_MINIMUM_OWNERSHIP_MONTHS} months before the CGT event, you halve the remaining gain. Two details decide whether you actually qualify:</p>
            <ul>
              <li><strong>You exclude both end days.</strong> The day you acquired the asset and the day of the CGT event do not count toward the {CGT_MINIMUM_OWNERSHIP_MONTHS} months.</li>
              <li><strong>For a contract sale, the CGT event is the contract date</strong> — not settlement. Property sales usually work this way, and it also decides which financial year the gain falls in.</li>
            </ul>
            <p>There is no partial discount. Eleven months and 29 days gets you nothing; the discount is all or nothing.</p>

            <h3 style={H2}>The discount is not the same for everyone</h3>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Who owns the asset</th><th className="px-5 py-3">CGT discount</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {ENTITY_ORDER.map((e, i) => (
                <tr key={e} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className="px-5 py-3 font-medium">{CGT_ENTITY_LABELS[e]}</td>
                  <td className="px-5 py-3 tabular-nums">{CGT_DISCOUNT_RATES[e] === 0 ? "No discount" : PCT(CGT_DISCOUNT_RATES[e])}</td>
                </tr>
              ))}
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">ATO, <a href={ATO_DISCOUNT} target="_blank" rel="noopener noreferrer" className="hover:underline">CGT discount</a> (QC66019).</p></div>

            <p><strong>Companies cannot use the CGT discount at all</strong>, no matter how long they held the asset. That is one reason holding an appreciating asset inside a company is often less tax-effective than holding it personally.</p>
            <p>Two other cases change the answer. Providing <strong>affordable rental housing</strong> can add up to {formatPercent(CGT_AFFORDABLE_HOUSING.extraDiscount, 0)}, lifting the discount to as much as {formatPercent(CGT_AFFORDABLE_HOUSING.maxDiscount, 0)}. And for assets acquired before {CGT_INDEXATION_CUTOFF} you may instead index the cost base for inflation — but you cannot use both indexation and the discount.</p>
          </section>

          <section>
            <h2 style={H2}>What Goes in the Cost Base</h2>
            <p>Your cost base is not just the purchase price. Getting it right is the single biggest lever you have over the gain, because every legitimate dollar you add is a dollar you are not taxed on. The ATO builds it from five elements:</p>

            <div className="not-prose my-6 space-y-3">
              {COST_BASE_ELEMENTS.map((el) => (
                <div key={el.element} className="rounded-xl border border-sandstone-dark/20 bg-white p-5 shadow-sm">
                  <h4 className="font-semibold text-navy mb-1">{el.element}. {el.name}</h4>
                  <p className="text-sm text-warmgray mb-2">{el.description}</p>
                  <p className="text-xs text-warmgray-light">{el.examples.join(" · ")}</p>
                </div>
              ))}
            </div>

            <h3 style={H2}>What you must leave out</h3>
            <p>The governing rule is simple: <strong>you cannot include anything you have claimed, or could claim, as a tax deduction.</strong> Double-dipping is the mistake the ATO looks for.</p>
            <ul>{COST_BASE_EXCLUSIONS.map((x) => (<li key={x}>{x}</li>))}</ul>
            <p>Capital works deductions deserve special attention. If you claimed depreciation on the building, those deductions <em>reduce</em> your cost base rather than adding to it — which increases your gain. In the ATO&rsquo;s example, a {formatAUD(100_000)} cost base less {formatAUD(7_500)} of capital works deductions leaves a reduced cost base of {formatAUD(92_500)}, turning a {formatAUD(10_000)} apparent loss into a {formatAUD(2_500)} one. See our <Link href="/tax-deductions-guide/">tax deductions guide</Link> for what you can claim along the way.</p>
            <p>One trap on the third element: holding costs like rates, land tax, insurance and interest only go in the cost base <strong>where they were not deductible</strong>. For a normal rental property you have already deducted them, so they cannot be counted again. They also cannot be used to create or increase a capital loss.</p>
          </section>

          <section>
            <h2 style={H2}>Is Your Home Exempt? Not Automatically</h2>
            <p>The main residence exemption is the most valuable concession in the CGT system, and the most widely misunderstood. It is <strong>not automatic</strong>. To get the full exemption, all three of these must hold:</p>
            <ul>{MAIN_RESIDENCE_CONDITIONS.map((c) => (<li key={c}>{c}</li>))}</ul>
            <p>Fail any one of them and you fall back to a <strong>partial exemption</strong>, where part of the gain becomes assessable. The usual causes are renting out a room, running a business from home, or buying a place to renovate and flip. Being a foreign resident when the CGT event happens can remove the exemption entirely.</p>
            <p>A dwelling is generally your main residence if you and your family live in it, your belongings are there, it is your mailing and electoral-roll address, and services are connected. Vacant land never qualifies — the property must have a dwelling on it and you must have lived in it.</p>

            <h3 style={H2}>The {ABSENCE_RULE.incomeProducingYears}-year rule</h3>
            <p>When you move out, you can keep treating the property as your main residence:</p>
            <ul>
              <li><strong>Indefinitely</strong>, if you do not use it to produce income — for example you leave it vacant or use it as a holiday house.</li>
              <li><strong>For up to {ABSENCE_RULE.incomeProducingYears} years</strong>, if you do use it to produce income. This is the &ldquo;{ABSENCE_RULE.incomeProducingYears}-year rule&rdquo;.</li>
            </ul>
            <p>While the choice applies you cannot treat any other property as your main residence, except for up to {ABSENCE_RULE.overlapMonths} months while you are moving house. Importantly, the {ABSENCE_RULE.incomeProducingYears} years applies <strong>to each separate period of absence</strong> — move back in, then leave again, and the clock restarts.</p>

            <h3 style={H2}>What happens if you exceed {ABSENCE_RULE.incomeProducingYears} years</h3>
            <p>You are taxed on the portion of the ownership period after the limit, and your cost base resets to the market value when you first used the home to produce income. The ATO&rsquo;s worked example: an apartment sold for {formatAUD(555_000)} with a deemed cost base of {formatAUD(220_000)} plus {formatAUD(15_000)} of selling fees gives a {formatAUD(320_000)} gain. With 6,940 non-main-residence days out of 9,133 ownership days:</p>
            <div className="not-prose my-6"><div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Capital gain</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(320_000)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">× (6,940 non-main-residence days ÷ 9,133 ownership days)</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(ROYA_ASSESSABLE)}</td></tr>
              <tr><td className="px-5 py-3 font-bold">After the {formatPercent(CGT_DISCOUNT_RATES.individual, 0)} discount</td><td className="px-5 py-3 text-right font-bold tabular-nums">{formatAUD(ROYA_NET)}</td></tr>
            </tbody></table></div></div>
            <p>Note also that if you used part of your home to produce income <em>before</em> you moved out — say 25% as a consulting room — that same proportion of the gain stays assessable, both before and after you leave.</p>
          </section>

          <section>
            <h2 style={H2}>Capital Losses: What They Can and Cannot Do</h2>
            <p className="not-prose rounded-lg border-l-4 border-ochre bg-sandstone/60 p-4 text-base text-navy"><strong>A capital loss cannot reduce the tax on your salary.</strong> Losses offset capital gains only. If you are hoping a bad share year will cut your PAYG bill, it will not.</p>
            <p>What losses can do:</p>
            <ul>
              <li>Offset capital gains in the same year.</li>
              <li>Carry forward <strong>indefinitely</strong> — there is no time limit — to offset future capital gains.</li>
              <li>Be applied selectively. You choose which gains to apply them to, and applying them to gains that are <em>not</em> discount-eligible first gives you the lowest tax.</li>
            </ul>
            <p>Some losses are not usable at all. You cannot deduct losses on personal use assets such as boats and furniture, on CGT-exempt assets such as cars and motorcycles, or on low-value collectables. Losses on collectables can only ever offset gains on other collectables.</p>
          </section>

          <section>
            <h2 style={H2}>Which Assets Are Exempt</h2>
            <ul>{CGT_EXEMPT_ASSETS.map((a) => (<li key={a}>{a}</li>))}</ul>
            <p>Exemption cuts both ways: if an asset is exempt from CGT, you also cannot claim a capital loss on it. Assets acquired before {CGT_START_DATE} are pre-CGT and exempt, though improvements made after that date can still be caught. Full list at the <a href={ATO_EXEMPTIONS} target="_blank" rel="noopener noreferrer">ATO</a>.</p>
          </section>

          <section>
            <h2 style={H2}>Coming {CGT_REFORM_2027.startDate}: The Discount Changes</h2>
            <p className="not-prose rounded-lg border-l-4 border-eucalyptus bg-eucalyptus-light/30 p-4 text-base text-navy"><strong>{CGT_INCOME_YEAR} is the last full income year of the {formatPercent(CGT_DISCOUNT_RATES.individual, 0)} discount in its current form — but nothing on this page changes yet.</strong> The reform applies only to gains accruing on and after {CGT_REFORM_2027.startDate}.</p>
            <p>The <strong>{CGT_REFORM_2027.actName}</strong> received assent on {CGT_REFORM_2027.assentDate} ({CGT_REFORM_2027.actNumber}). For capital gains accruing on and after {CGT_REFORM_2027.startDate} it replaces the {formatPercent(CGT_DISCOUNT_RATES.individual, 0)} discount for individuals, trusts and partnerships with:</p>
            <ul>
              <li><strong>Cost base indexation</strong> for assets held more than {CGT_MINIMUM_OWNERSHIP_MONTHS} months, so you are taxed on the real gain after inflation rather than the nominal one; and</li>
              <li>a <strong>minimum tax rate of {formatPercent(CGT_REFORM_2027.minimumTaxRate, 0)}</strong> on net capital gains.</li>
            </ul>
            <p>It is not a clean switch-off. Assets are treated as <strong>deemed-disposed on {CGT_REFORM_2027.deemedDisposalDate} and reacquired the next day</strong>, so a gain on an asset you already hold gets split across the two regimes and apportioned between them. That mechanic, rather than the headline rate, is what will make {CGT_REFORM_2027.firstAffectedYear} returns harder.</p>
            <p>The {formatPercent(CGT_DISCOUNT_RATES.individual, 0)} discount survives for:</p>
            <ul>
              {CGT_REFORM_2027.discountSurvivesFor.map((item) => (<li key={item}>{item}</li>))}
            </ul>
            <p>And these are outside the new indexation regime entirely: {CGT_REFORM_2027.indexationExcludes.join(", ")}.</p>
            <p><strong>We have not built the post-{CGT_REFORM_2027.startDate} regime into this calculator.</strong> The indexation factors and the apportionment method for gains straddling {CGT_REFORM_2027.startDate} have not been published by the ATO yet, and we do not publish figures we cannot verify at source. Until they are, use this calculator for {CGT_INCOME_YEAR} disposals and read the <a href={CGT_REFORM_2027.actUrl} target="_blank" rel="noopener noreferrer">Act itself</a> or the <a href={CGT_REFORM_2027.billsDigestUrl} target="_blank" rel="noopener noreferrer">Parliamentary Library bills digest</a>. Note the ATO&rsquo;s own CGT pages still describe this as &ldquo;announced in the 2026&ndash;27 Federal Budget&rdquo;, which reads like a proposal — it is law, with a deferred start.</p>
          </section>

          <section>
            <h2 style={H2}>Related Calculators</h2>
            <ul>
              <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> — your full liability once the gain is included</li>
              <li><Link href="/tax-brackets/">Australian Tax Brackets</Link> — the marginal rates the gain is taxed at</li>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> — what lands in your account each pay</li>
              <li><Link href="/tax-deductions-guide/">Tax Deductions Guide</Link> — what you can claim along the way, and why it changes your cost base</li>
              <li><Link href="/tax-return-calculator/">Tax Return Calculator</Link> — estimate your refund or bill</li>
            </ul>
          </section>

          <section>
            <h2 style={H2}>Frequently Asked Questions</h2>
            <div className="sr-only">
              <h3>Capital gains tax questions and answers</h3>
              {CGT_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
            </div>
            <Accordion type="multiple" className="not-prose mt-6 space-y-3">
              {CGT_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <div className="mt-12 not-prose"><MethodologyDisclosure title="How this calculator works"><p>The method, the {formatPercent(CGT_DISCOUNT_RATES.individual, 0)} discount, the five cost base elements and the loss rules come from the ATO&rsquo;s <a href={ATO_CALC} target="_blank" rel="noopener noreferrer">How to calculate your CGT</a> (QC104071), <a href={ATO_DISCOUNT} target="_blank" rel="noopener noreferrer">CGT discount</a> (QC66019), <a href={ATO_COST_BASE} target="_blank" rel="noopener noreferrer">Cost base of assets</a> (QC66022) and <a href={ATO_LOSSES} target="_blank" rel="noopener noreferrer">Using capital losses</a> (QC66025), all verified {SITE_CONFIG.lastVerified}. The main residence rules come from QC69710 and <a href={ATO_MAIN_RESIDENCE} target="_blank" rel="noopener noreferrer">QC66030</a>.</p><p>Tax on the gain is computed by adding the net capital gain to your other income and taking the difference in income tax and Medicare levy — it never applies a standalone CGT rate, because no such rate exists. It uses the {CGT_INCOME_YEAR} resident brackets and the 2% Medicare levy. It does not model the Medicare levy surcharge, HECS-HELP repayments, other offsets, the indexation method for pre-{CGT_INDEXATION_CUTOFF} assets, small business CGT concessions, or the post-{CGT_REFORM_2027.startDate} regime. Every figure on this page is derived from a single constants file and checked against the ATO&rsquo;s published worked examples — Rhi, Justin, Maree, Danuta, Roya and Helen — in automated tests.</p><p>This is general information, not personal tax advice. CGT on property and inherited assets gets complicated quickly; see a registered tax agent for your own position.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
            {(() => { const a = getGuideAuthorship("capital-gains-tax-calculator"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
        </article>

        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6"><Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3"><SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" /><SidebarLink href="/tax-brackets/" label="Australian Tax Brackets" /><SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" /><SidebarLink href="/tax-deductions-guide/" label="Tax Deductions Guide" /><SidebarLink href="/tax-return-calculator/" label="Tax Return Calculator" /></div></CardContent></Card></div></aside>
      </div>
    </div></div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

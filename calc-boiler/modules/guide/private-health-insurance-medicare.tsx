import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import FaqAccordion from "@/components/common/faq-accordion";
import { PHI_MEDICARE_FAQS } from "./private-health-insurance-medicare-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, MEDICARE_LEVY, formatAUD } from "@/lib/constants";
import {
  MLS_APPROPRIATE_COVER_MAX_EXCESS,
  MLS_INCOME_YEAR,
  PHI_REBATE,
  estimateMls,
  familyBaseThreshold,
  formatMlsRate,
  phiRebateRate,
} from "@/lib/constants/medicare-levy-surcharge";
import type { MlsTier } from "@/lib/constants/medicare-levy-extra";

// Corrected 23 Sep 2026 (W2): this page carried 2023-24 surcharge thresholds
// ($93,000 / $186,000) and rebate rates next to 2026-27 tier bounds, plus
// estimated premiums with no source. Every figure now derives from
// lib/constants/medicare-levy-surcharge.ts (ATO, verified 23 Sep 2026), and
// the surcharge itself is calculated on /medicare-levy-surcharge-calculator/.
const S = MEDICARE_LEVY.surcharge;
const SINGLE_BASE = S.tier1.min - 1;
const FAMILY_BASE = familyBaseThreshold(0);
const TIER_ROWS: { name: string; tier: MlsTier; single: string; family: string; rate: number }[] = [
  { name: "Base tier (no MLS)", tier: 0, single: `${formatAUD(SINGLE_BASE)} or less`, family: `${formatAUD(FAMILY_BASE)} or less`, rate: 0 },
  { name: "Tier 1", tier: 1, single: `${formatAUD(S.tier1.min)} – ${formatAUD(S.tier1.max)}`, family: `${formatAUD(S.familyTier1.min)} – ${formatAUD(S.familyTier1.max)}`, rate: S.tier1.rate },
  { name: "Tier 2", tier: 2, single: `${formatAUD(S.tier2.min)} – ${formatAUD(S.tier2.max)}`, family: `${formatAUD(S.familyTier2.min)} – ${formatAUD(S.familyTier2.max)}`, rate: S.tier2.rate },
  { name: "Tier 3", tier: 3, single: `${formatAUD(S.tier3.min)} or more`, family: `${formatAUD(S.familyTier3.min)} or more`, rate: S.tier3.rate },
];
const pct3 = (r: number) => `${(r * 100).toFixed(3)}%`;
const BREAK_EVEN_INCOMES = [110_000, 130_000, 150_000, 200_000];
const singleMls = (income: number) =>
  estimateMls({ own: { taxableIncome: income, reportableFringeBenefits: 0, netInvestmentLosses: 0, reportableSuperContributions: 0 }, hasSpouse: false, spouseMlsIncome: 0, dependentChildren: 0, daysWithoutCover: 365 });
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Medicare levy surcharge", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge", publisher: SOURCES.ato.name },
  { title: "Private health insurance rebate", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/private-health-insurance-rebate", publisher: SOURCES.ato.name },
  { title: "Medicare levy", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: SOURCES.ato.name },
  { title: "Lifetime Health Cover", url: "https://www.health.gov.au/topics/private-health-insurance", publisher: "Department of Health" },
];

export default function PrivateHealthInsuranceMedicarePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Private Health Insurance &amp; Medicare</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Private Health Insurance &amp; Medicare — When PHI Saves You Money
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Should you get private hospital cover to avoid the Medicare levy surcharge? How the surcharge and the private health insurance rebate interact, how to find the premium at which cover pays for itself, and lifetime health cover loading. To work out your own surcharge, use the <Link href="/medicare-levy-surcharge-calculator/" className="text-eucalyptus-dark hover:underline">Medicare levy surcharge calculator</Link>.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-xl not-prose mb-8">
              <p className="text-navy text-sm font-medium">
                <strong>Disclaimer</strong>
                <br />
                This guide provides general information only and is not financial advice. Your individual circumstances may differ. Consult a financial adviser or health insurance broker for personal recommendations.
              </p>
            </div>

            {/* SECTION 1: MLS Who Pays It */}
            <section id="mls-who-pays">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Medicare Levy Surcharge — Who Pays It?</h2>
              <p>
                The Medicare Levy Surcharge (MLS) is an <strong>additional</strong> tax on top of the standard 2% Medicare levy. It applies to Australian taxpayers who earn above the income threshold and do <strong>not</strong> hold an eligible private hospital cover policy.
              </p>
              <p>
                Your tier is set by your income for MLS purposes: taxable income plus reportable fringe benefits, total net investment losses and reportable super contributions. The rate is then charged on your taxable income plus reportable fringe benefits. The {MLS_INCOME_YEAR} tiers:
              </p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Tier</th>
                        <th className="px-6 py-4">Singles</th>
                        <th className="px-6 py-4">Families</th>
                        <th className="px-6 py-4">MLS Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {TIER_ROWS.map((t) => (
                        <tr key={t.name}>
                          <td className="px-6 py-4 font-medium">{t.name}</td>
                          <td className="px-6 py-4">{t.single}</td>
                          <td className="px-6 py-4">{t.family}</td>
                          <td className="px-6 py-4 font-semibold">{formatMlsRate(t.rate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The thresholds have risen every year since 2022-23, when the singles threshold was $90,000. Family thresholds rise $1,500 for each dependent child after the first. Work out your own tier and surcharge with the <Link href="/medicare-levy-surcharge-calculator/">Medicare levy surcharge calculator</Link>; the standard 2% levy is covered by our <Link href="/medicare-levy/">Medicare levy calculator</Link>.
              </p>
            </section>

            {/* SECTION 2: PHI Rebate Tiers */}
            <section id="phi-rebate">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Private Health Insurance Rebate Tiers</h2>
              <p>
                The government provides a rebate on private health insurance premiums, with the amount varying by age and income. Lower income earners receive a higher rebate, while higher income earners receive a reduced rebate or none at all.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Singles Income</th>
                        <th className="px-6 py-4">Under 65</th>
                        <th className="px-6 py-4">65&ndash;69</th>
                        <th className="px-6 py-4">70+</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {TIER_ROWS.map((t) => (
                        <tr key={t.name}><td className="px-6 py-4 font-medium">{t.single}</td><td className="px-6 py-4">{pct3(phiRebateRate(t.tier, "under65"))}</td><td className="px-6 py-4">{pct3(phiRebateRate(t.tier, "age65to69"))}</td><td className="px-6 py-4">{pct3(phiRebateRate(t.tier, "age70plus"))}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Rates from {PHI_REBATE.period}, by the age of the oldest person on the policy. Families use the family column in the surcharge table above. Source: ATO, income thresholds and rates for the private health insurance rebate.</p>
              </div>
              <p>
                You can receive the rebate as either a premium reduction (paid directly to your insurer) or as a refundable tax offset when you lodge your tax return. Most people opt for the premium reduction to lower their monthly costs immediately.
              </p>
            </section>

            {/* SECTION 3: The Financial Decision */}
            <section id="financial-decision">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>PHI vs Surcharge — The Financial Decision</h2>
              <p>
                The key question is: <strong>is it cheaper to pay the MLS or buy private hospital cover?</strong> Premiums vary too much by insurer, state and excess for a single answer, so work out your <strong>break-even premium</strong>: the surcharge divided by the share of the premium you pay after your rebate. A quote below that, before the rebate, costs less than the surcharge.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Single, taxable income</th>
                        <th className="px-6 py-4">Annual MLS</th>
                        <th className="px-6 py-4">Rebate (under 65)</th>
                        <th className="px-6 py-4">Cover is cheaper below</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {BREAK_EVEN_INCOMES.map((inc) => {
                        const m = singleMls(inc);
                        const r = phiRebateRate(m.tier, "under65");
                        return (
                          <tr key={inc}><td className="px-6 py-4 font-medium">{formatAUD(inc)}</td><td className="px-6 py-4">{formatAUD(m.fullYearSurcharge)}</td><td className="px-6 py-4">{pct3(r)}</td><td className="px-6 py-4 font-semibold">{formatAUD(m.fullYearSurcharge / (1 - r))} a year</td></tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">{MLS_INCOME_YEAR} tiers, no fringe benefits, a full year without cover. Premium before rebate, ignoring lifetime health cover loading. Enter your own quote in the <Link href="/medicare-levy-surcharge-calculator/" className="underline">Medicare levy surcharge calculator</Link>.</p>
              </div>
              <p>
                At or under {formatAUD(SINGLE_BASE)} (singles) there is no surcharge to avoid, so cover is a health decision rather than a tax one.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>Important</strong>
                  <br />
                  Only <em>hospital</em> cover counts for MLS exemption. Extras-only policies (dental, optical, physio) do <strong>not</strong> exempt you from the surcharge. Your policy must be private patient hospital cover with an excess of {formatAUD(MLS_APPROPRIATE_COVER_MAX_EXCESS.single)} or less for singles ({formatAUD(MLS_APPROPRIATE_COVER_MAX_EXCESS.family)} for couples and families).
                </p>
              </div>
            </section>

            {/* SECTION 4: Lifetime Health Cover Loading */}
            <section id="lifetime-health-cover">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Lifetime Health Cover Loading</h2>
              <p>
                Lifetime Health Cover (LHC) loading is a government initiative that encourages Australians to take out private hospital cover earlier in life. If you don&apos;t hold hospital cover by <strong>1 July after your 31st birthday</strong>, you pay a 2% loading on your premium for every year you are aged over 30 without cover.
              </p>
              <p>
                For example, if you first take out hospital cover at age 40, you pay a <strong>20% loading</strong> (10 years x 2%) on top of the base premium. The maximum loading is <strong>70%</strong>. This can add significant cost to your premiums if you delay taking out cover.
              </p>
              <p>
                The good news: LHC loading is removed after <strong>10 continuous years</strong> of holding hospital cover. So even if you start late, the penalty eventually disappears. The loading also applies only to the hospital component of your premium, not to extras cover.
              </p>
              <p>
                If you turn 31 soon and are above the MLS threshold, getting basic hospital cover now avoids both the surcharge and any future LHC loading.
              </p>
            </section>

            {/* SECTION 5: How PHI Affects Take-Home Pay */}
            <section id="phi-take-home-pay">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How PHI Affects Your Take-Home Pay</h2>
              <p>
                Private health insurance impacts your take-home pay in two ways. First, the premium itself is an ongoing expense. Second, holding compliant cover removes the MLS from your tax calculation, which reduces your total tax bill.
              </p>
              <p>
                If you are salary packaging your PHI premium through your employer (common in the not-for-profit and public hospital sectors), the premium is paid from pre-tax income, providing an additional tax benefit. See our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model this scenario.
              </p>
              <p>
                When using our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> or <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link>, make sure to indicate whether you hold private health insurance. This determines whether the MLS is included in your tax calculation.
              </p>
            </section>

            {/* SECTION 6: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={PHI_MEDICARE_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="About this guide">
                <p>Medicare levy surcharge thresholds and rates, and private health insurance rebate rates, are the ATO&apos;s {MLS_INCOME_YEAR} figures, verified 23 September 2026. Break-even premiums are calculated from those figures; this guide does not estimate premiums, which vary by insurer, state, age and excess. General information only, not financial advice.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("private-health-insurance-medicare"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Guides &amp; Tools</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/medicare-levy-surcharge-calculator/" label="Medicare Levy Surcharge Calculator" />
                    <SidebarLink href="/medicare-levy/" label="Medicare Levy Calculator" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">See your MLS impact</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Calculate whether the Medicare levy surcharge applies to you and how much it costs.</p>
                  <Link href="/medicare-levy-surcharge-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    MLS Calculator <ArrowRight className="inline h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

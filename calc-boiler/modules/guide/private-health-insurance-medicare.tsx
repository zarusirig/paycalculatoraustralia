"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, MEDICARE_LEVY } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Medicare levy surcharge", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge", publisher: SOURCES.ato.name },
  { title: "Private health insurance rebate", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/private-health-insurance-rebate", publisher: SOURCES.ato.name },
  { title: "Medicare levy", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: SOURCES.ato.name },
  { title: "Lifetime Health Cover", url: "https://www.health.gov.au/topics/private-health-insurance/lifetime-health-cover", publisher: "Department of Health" },
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
            Should you get private health insurance to avoid the Medicare Levy Surcharge? We break down the income thresholds, surcharge rates, PHI rebate tiers, and the financial tipping points where getting cover actually saves you money.
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
                The MLS is designed to encourage higher income earners to take out private health insurance, reducing pressure on the public health system. The surcharge is calculated on your taxable income, reportable fringe benefits, and total net investment losses.
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
                      <tr>
                        <td className="px-6 py-4 font-medium">Base Tier (No MLS)</td>
                        <td className="px-6 py-4">$0 &ndash; $93,000</td>
                        <td className="px-6 py-4">$0 &ndash; $186,000</td>
                        <td className="px-6 py-4 font-semibold">0%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Tier 1</td>
                        <td className="px-6 py-4">${MEDICARE_LEVY.surcharge.tier1.min.toLocaleString()} &ndash; ${MEDICARE_LEVY.surcharge.tier1.max.toLocaleString()}</td>
                        <td className="px-6 py-4">$186,001 &ndash; $216,000</td>
                        <td className="px-6 py-4 font-semibold">{(MEDICARE_LEVY.surcharge.tier1.rate * 100).toFixed(0)}%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Tier 2</td>
                        <td className="px-6 py-4">${MEDICARE_LEVY.surcharge.tier2.min.toLocaleString()} &ndash; ${MEDICARE_LEVY.surcharge.tier2.max.toLocaleString()}</td>
                        <td className="px-6 py-4">$216,001 &ndash; $288,000</td>
                        <td className="px-6 py-4 font-semibold">{(MEDICARE_LEVY.surcharge.tier2.rate * 100).toFixed(2)}%</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium">Tier 3</td>
                        <td className="px-6 py-4">${MEDICARE_LEVY.surcharge.tier3.min.toLocaleString()}+</td>
                        <td className="px-6 py-4">$288,001+</td>
                        <td className="px-6 py-4 font-semibold">{(MEDICARE_LEVY.surcharge.tier3.rate * 100).toFixed(1)}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The MLS thresholds have <strong>not been indexed since 2014-15</strong>. As wages grow, more Australians are crossing the $93,001 threshold each year through bracket creep. See our <Link href="/medicare-levy/">Medicare Levy Guide</Link> for the full breakdown of the standard 2% levy.
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
                      <tr><td className="px-6 py-4 font-medium">$93,000 or less</td><td className="px-6 py-4">24.608%</td><td className="px-6 py-4">28.710%</td><td className="px-6 py-4">32.812%</td></tr>
                      <tr><td className="px-6 py-4 font-medium">$93,001 &ndash; $108,000</td><td className="px-6 py-4">16.405%</td><td className="px-6 py-4">20.507%</td><td className="px-6 py-4">24.608%</td></tr>
                      <tr><td className="px-6 py-4 font-medium">$108,001 &ndash; $144,000</td><td className="px-6 py-4">8.202%</td><td className="px-6 py-4">12.303%</td><td className="px-6 py-4">16.405%</td></tr>
                      <tr><td className="px-6 py-4 font-medium">$144,001+</td><td className="px-6 py-4">0%</td><td className="px-6 py-4">0%</td><td className="px-6 py-4">0%</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Family thresholds are double the singles thresholds. Add $1,500 for each dependent child after the first.</p>
              </div>
              <p>
                You can receive the rebate as either a premium reduction (paid directly to your insurer) or as a refundable tax offset when you lodge your tax return. Most people opt for the premium reduction to lower their monthly costs immediately.
              </p>
            </section>

            {/* SECTION 3: The Financial Decision */}
            <section id="financial-decision">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>PHI vs Surcharge — The Financial Decision</h2>
              <p>
                The key question is: <strong>is it cheaper to pay the MLS or buy private hospital cover?</strong> The answer depends on your income level. At lower MLS tiers, basic hospital cover is often cheaper than the surcharge. At higher incomes, the difference becomes even more pronounced.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Income</th>
                        <th className="px-6 py-4">Annual MLS Cost</th>
                        <th className="px-6 py-4">Basic PHI (Est.)</th>
                        <th className="px-6 py-4">Cheaper Option</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-4 font-medium">$95,000</td><td className="px-6 py-4">$950</td><td className="px-6 py-4">~$1,200</td><td className="px-6 py-4 text-red-600 font-semibold">MLS cheaper</td></tr>
                      <tr><td className="px-6 py-4 font-medium">$100,000</td><td className="px-6 py-4">$1,000</td><td className="px-6 py-4">~$1,200</td><td className="px-6 py-4 text-red-600 font-semibold">MLS cheaper</td></tr>
                      <tr><td className="px-6 py-4 font-medium">$110,000</td><td className="px-6 py-4">$1,375</td><td className="px-6 py-4">~$1,200</td><td className="px-6 py-4 text-green-600 font-semibold">PHI cheaper</td></tr>
                      <tr><td className="px-6 py-4 font-medium">$130,000</td><td className="px-6 py-4">$1,625</td><td className="px-6 py-4">~$1,300</td><td className="px-6 py-4 text-green-600 font-semibold">PHI cheaper</td></tr>
                      <tr><td className="px-6 py-4 font-medium">$150,000</td><td className="px-6 py-4">$2,250</td><td className="px-6 py-4">~$1,500</td><td className="px-6 py-4 text-green-600 font-semibold">PHI cheaper</td></tr>
                      <tr><td className="px-6 py-4 font-medium">$200,000</td><td className="px-6 py-4">$3,000</td><td className="px-6 py-4">~$1,500</td><td className="px-6 py-4 text-green-600 font-semibold">PHI cheaper</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">PHI estimates are for basic hospital cover (singles, under 65, no LHC loading). Rebate applied where eligible. Actual premiums vary by insurer and state.</p>
              </div>
              <p>
                The crossover point is typically around <strong>$105,000&ndash;$110,000</strong> for singles. Below this, the surcharge may be cheaper than even basic cover. Above it, PHI becomes the better financial option &mdash; and you get hospital coverage as a bonus.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>Important</strong>
                  <br />
                  Only <em>hospital</em> cover counts for MLS exemption. Extras-only policies (dental, optical, physio) do <strong>not</strong> exempt you from the surcharge. Your policy must be a compliant private hospital insurance product.
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
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="what-triggers-mls" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What income triggers the Medicare Levy Surcharge?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The MLS applies to singles with income above <strong>$93,000</strong> or families above <strong>$186,000</strong> who do not hold an eligible private hospital cover policy. Income for MLS purposes includes taxable income, reportable fringe benefits, and total net investment losses.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="phi-vs-mls" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is it cheaper to get PHI or pay the surcharge?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">It depends on your income. Below approximately $105,000, the 1% surcharge may be cheaper than basic hospital cover. Above $110,000, basic PHI (around $1,200&ndash;$1,500 per year) is typically cheaper than the surcharge. At $150,000+, the surcharge costs $2,250+ while basic cover remains around $1,500. PHI also provides actual hospital coverage.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="extras-count" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does extras-only cover exempt me from the MLS?</AccordionTrigger>
                  <AccordionContent className="text-warmgray"><strong>No.</strong> Only private <em>hospital</em> cover (or combined hospital and extras) counts for MLS exemption. An extras-only policy covering dental, optical, or physiotherapy does not satisfy the requirement. You need a compliant hospital insurance policy with an excess of $750 or less for singles ($1,500 for families).</AccordionContent>
                </AccordionItem>
                <AccordionItem value="lhc-loading" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is Lifetime Health Cover loading?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">LHC loading adds <strong>2% per year</strong> to your hospital cover premium for every year you are aged over 30 without hospital cover. It maxes out at 70%. A person who first takes out cover at age 45 pays a 30% loading. The loading is removed after 10 continuous years of holding hospital cover.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="part-year" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I pay MLS for the full year if I get PHI part-way through?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The MLS is calculated on a <strong>daily basis</strong>. If you hold eligible hospital cover for part of the financial year, the surcharge only applies for the days you were not covered. Taking out cover on 1 January means you pay MLS for the first 184 days and are exempt for the remaining 181 days.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="family-threshold" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How does the family threshold work?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The family MLS threshold is <strong>$186,000</strong> combined income. This increases by $1,500 for each dependent child after the first. The family&apos;s income is based on the combined income of you and your spouse (including de facto partners). Both adults need to be covered by eligible hospital insurance for the family to be exempt.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="About this guide">
                <p>Medicare Levy Surcharge thresholds and rates are sourced from the ATO. PHI rebate tiers are based on current government rebate percentages. Premium estimates are approximate and based on average basic hospital cover costs for singles in major metropolitan areas. Actual premiums vary by insurer, state, age, and excess level. This guide is for general information only and does not constitute financial advice.</p>
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
                    <SidebarLink href="/medicare-levy/" label="Medicare Levy Guide" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">See your MLS impact</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Calculate whether the Medicare Levy Surcharge applies to you and how much it costs.</p>
                  <Link href="/income-tax-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Income Tax Calculator <ArrowRight className="inline h-4 w-4 ml-1" />
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

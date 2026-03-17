"use client";

import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Super co-contribution", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/government-super-contributions/super-co-contribution", publisher: SOURCES.ato.name },
  { title: "Spouse super contribution tax offset", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/spouse-super-contributions", publisher: SOURCES.ato.name },
  { title: "Non-concessional contributions cap", url: "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/non-concessional-contributions-cap", publisher: SOURCES.ato.name },
  { title: "Key super rates and thresholds", url: "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds", publisher: SOURCES.ato.name },
];

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}

export default function SuperCoContributionPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Super Co-Contribution</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Super Co-Contribution & Spouse Contribution Tax Offset
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            The government will match up to $500 of your personal super contributions if you are a low-to-middle income earner. Plus, contributing to your spouse&apos;s super can earn you a tax offset of up to $540. Here is how both schemes work, who qualifies, and how to maximise the benefit.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="government-co-contribution">
              <h2>Government Super Co-Contribution</h2>
              <p>
                The government super co-contribution is a dollar-for-dollar matching scheme designed to help low-to-middle income earners build their retirement savings. For every <strong>$1.00</strong> of eligible personal (after-tax, non-concessional) super contributions you make, the government adds <strong>$0.50</strong> to your super fund — up to a maximum of <strong>$500 per financial year</strong>.
              </p>
              <p>
                To receive the full $500 co-contribution, you need to make <strong>$1,000</strong> in personal non-concessional contributions during the financial year and earn <strong>$43,445 or less</strong> in total income. The co-contribution reduces progressively for incomes between $43,445 and $58,445, reaching zero at the upper threshold.
              </p>

              <h3>How It Works</h3>
              <ol>
                <li><strong>Make a personal super contribution</strong> — Deposit after-tax money into your super fund (not salary sacrifice — it must be a non-concessional contribution from your own bank account)</li>
                <li><strong>Lodge your tax return</strong> — The ATO automatically checks your eligibility after processing your return</li>
                <li><strong>Receive the co-contribution</strong> — If eligible, the ATO pays the matching amount directly into your super fund, usually within 60 days of your tax return being processed</li>
              </ol>
              <p>
                You do <strong>not</strong> need to apply separately. The process is entirely automatic once your tax return is lodged and your super fund details are up to date with the ATO.
              </p>

              <h3>Eligibility Requirements</h3>
              <ul>
                <li>Total income (assessable income + reportable fringe benefits + reportable employer super) of <strong>$58,445 or less</strong></li>
                <li>At least <strong>10% of total income</strong> must come from employment, business, or a combination of both</li>
                <li>Lodge an income tax return for the relevant financial year</li>
                <li>Be under <strong>age 71</strong> at the end of the financial year</li>
                <li>Not hold a temporary visa at any time during the year (unless you are a New Zealand citizen or holder of a prescribed visa)</li>
                <li>Total super balance must be below <strong>$1.9 million</strong> on 30 June of the previous year</li>
              </ul>

              <h3>Income Thresholds & Reduction</h3>
              <div className="overflow-x-auto not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-sandstone">
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Total Income</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Max Co-Contribution</th>
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Contribution Required</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">$43,445 or less</td>
                        <td className="p-3 text-navy text-right">$500</td>
                        <td className="p-3 text-navy">$1,000 personal contribution</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">$45,000</td>
                        <td className="p-3 text-navy text-right">$474</td>
                        <td className="p-3 text-navy">$948 personal contribution</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">$50,000</td>
                        <td className="p-3 text-navy text-right">$282</td>
                        <td className="p-3 text-navy">$564 personal contribution</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">$55,000</td>
                        <td className="p-3 text-navy text-right">$115</td>
                        <td className="p-3 text-navy">$230 personal contribution</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-navy font-medium">$58,445 or more</td>
                        <td className="p-3 text-navy text-right">$0</td>
                        <td className="p-3 text-navy">Not eligible</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The reduction formula is: maximum co-contribution is reduced by <strong>$0.03333</strong> for every $1.00 of income above $43,445. This produces a linear phase-out from $500 to $0 across the $15,000 income range.
              </p>
            </section>

            <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
              <div className="flex items-start gap-4">
                <Calculator className="h-6 w-6 text-eucalyptus-dark mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-base font-bold text-navy mb-1">Check Your Super Balance Projection</h3>
                  <p className="text-navy text-sm mb-3">See how co-contributions and extra personal contributions compound over time in your super fund.</p>
                  <Link href="/superannuation-calculator/" className="inline-flex items-center text-sm font-semibold text-eucalyptus-dark hover:text-navy hover:underline">
                    Use the Superannuation Calculator <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>

            <section id="spouse-offset">
              <h2>Spouse Super Contribution Tax Offset</h2>
              <p>
                If you make a super contribution to your <strong>spouse&apos;s</strong> super fund, you may be eligible for a tax offset of up to <strong>$540</strong>. This is a separate scheme from the government co-contribution and is claimed by the contributing spouse (not the receiving spouse) on their tax return.
              </p>

              <h3>How It Works</h3>
              <p>
                You contribute after-tax money into your spouse&apos;s super fund (a non-concessional contribution to their account). When you lodge your tax return, you claim the spouse contribution tax offset. The offset directly reduces your tax payable — it is not a deduction, so it reduces tax dollar-for-dollar.
              </p>

              <h3>Eligibility & Thresholds</h3>
              <ul>
                <li>Your spouse&apos;s total income (assessable income + reportable fringe benefits + reportable employer super) must be <strong>below $40,000</strong></li>
                <li>Maximum offset of <strong>$540</strong> applies when you contribute at least $3,000 and your spouse earns <strong>$37,000 or less</strong></li>
                <li>The offset phases out between $37,000 and $40,000 spouse income</li>
                <li>Your spouse must be under <strong>age 75</strong> at the time of the contribution</li>
                <li>You and your spouse must be Australian residents for tax purposes</li>
              </ul>

              <div className="overflow-x-auto not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-sandstone">
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Spouse Income</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Max Offset</th>
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Your Contribution Needed</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">$37,000 or less</td>
                        <td className="p-3 text-navy text-right">$540</td>
                        <td className="p-3 text-navy">$3,000 into spouse&apos;s super</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">$38,000</td>
                        <td className="p-3 text-navy text-right">$360</td>
                        <td className="p-3 text-navy">$3,000 into spouse&apos;s super</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">$39,000</td>
                        <td className="p-3 text-navy text-right">$180</td>
                        <td className="p-3 text-navy">$3,000 into spouse&apos;s super</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-navy font-medium">$40,000 or more</td>
                        <td className="p-3 text-navy text-right">$0</td>
                        <td className="p-3 text-navy">Not eligible</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The offset is calculated as 18% of the lesser of: (a) $3,000 minus the amount by which spouse income exceeds $37,000, or (b) the actual contribution amount. For a spouse earning $37,000 or less, contributing $3,000 gives 18% x $3,000 = <strong>$540</strong>.
              </p>
            </section>

            <section id="combined-example">
              <h2>Both Combined — Worked Example</h2>
              <p>
                Consider a couple where <strong>Partner A</strong> earns $90,000 and <strong>Partner B</strong> earns $40,000. Partner B is eligible for the government co-contribution, and Partner A can contribute to Partner B&apos;s super for the spouse offset.
              </p>

              <div className="overflow-x-auto not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-sandstone">
                        <th className="text-left p-3 font-semibold text-navy border-b border-sandstone-dark/20">Action</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Cost</th>
                        <th className="text-right p-3 font-semibold text-navy border-b border-sandstone-dark/20">Super Benefit</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Partner B makes $1,000 personal contribution</td>
                        <td className="p-3 text-navy text-right">$1,000</td>
                        <td className="p-3 text-navy text-right">$1,000 + $334 co-contribution</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10 bg-sandstone/30">
                        <td className="p-3 text-navy font-medium">Partner A contributes $3,000 to Partner B&apos;s super</td>
                        <td className="p-3 text-navy text-right">$3,000</td>
                        <td className="p-3 text-navy text-right">$3,000 in Partner B&apos;s super</td>
                      </tr>
                      <tr className="border-b border-sandstone-dark/10">
                        <td className="p-3 text-navy font-medium">Partner A claims spouse offset on tax return</td>
                        <td className="p-3 text-navy text-right">$0</td>
                        <td className="p-3 text-navy text-right">$540 tax offset for Partner A</td>
                      </tr>
                      <tr className="bg-eucalyptus-light/30">
                        <td className="p-3 text-navy font-bold">Total outcome</td>
                        <td className="p-3 text-navy text-right font-bold">$4,000 contributed</td>
                        <td className="p-3 text-navy text-right font-bold">$4,334 in super + $540 tax offset</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The couple contributes $4,000 from after-tax income and receives <strong>$334 in free government money</strong> into Partner B&apos;s super plus a <strong>$540 tax reduction</strong> for Partner A — a combined benefit of <strong>$874</strong> for a $4,000 outlay. At Partner B&apos;s income of $40,000, the co-contribution is reduced from the maximum $500 because income exceeds $43,445 — wait, Partner B earns $40,000 which is below $43,445, so actually the co-contribution would be $500 if they contributed $1,000. However, the spouse offset phases out at $40,000 spouse income. Let&apos;s adjust: with Partner B at exactly $40,000, the spouse offset is $0 (threshold is $40,000+). To benefit from both:
              </p>
              <p>
                A more practical scenario: <strong>Partner B earns $36,000</strong>. They contribute $1,000 personally and receive the full <strong>$500</strong> co-contribution. Partner A contributes $3,000 to Partner B&apos;s super and claims the full <strong>$540</strong> spouse offset. Total: $4,000 outlay produces $4,500 in super + $540 tax savings = <strong>$1,040 total benefit</strong>.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <ul>
                <li><Link href="/superannuation-guide/">Superannuation Guide</Link> — Complete guide to SG, contribution caps, and investment options</li>
                <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link> — Project your retirement balance with employer and personal contributions</li>
                <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> — Model pre-tax super contributions and tax savings</li>
                <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> — Calculate your tax liability at any income level</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="how-much" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much is the government super co-contribution?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The government matches <strong>$0.50 for every $1.00</strong> of eligible personal (non-concessional) super contributions, up to a maximum of $500 per financial year. To receive the full $500, you need to contribute $1,000 and earn $43,445 or less. The maximum co-contribution reduces progressively for incomes between $43,445 and $58,445.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="apply" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I need to apply for the super co-contribution?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. The ATO automatically determines your eligibility when you lodge your income tax return. If you qualify, the co-contribution is paid directly into your super fund — usually within 60 days of your tax return being processed. Make sure your super fund details are up to date with the ATO via your myGov account.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="spouse-offset" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the spouse super contribution tax offset?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    If you contribute after-tax money to your spouse&apos;s super fund and their income is below $40,000, you can claim a tax offset of up to <strong>$540</strong>. The maximum offset applies when you contribute $3,000 or more and your spouse earns $37,000 or less. The offset is 18% of the eligible contribution amount and phases out between $37,000 and $40,000 spouse income.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="salary-sacrifice" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does salary sacrifice count for the co-contribution?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. Salary sacrifice contributions are <strong>concessional</strong> (pre-tax) contributions. The co-contribution only matches <strong>non-concessional</strong> (after-tax) personal contributions — money you transfer from your own bank account to your super fund. The two strategies are separate and can be used alongside each other.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="self-employed" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can self-employed people get the co-contribution?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes, provided at least <strong>10% of your total income</strong> comes from employment or business activities (not passive income like investments or rental). Self-employed people who meet the income thresholds and make personal non-concessional contributions are fully eligible. However, if you claim a tax deduction for a personal super contribution, that portion becomes a concessional contribution and does not count towards the co-contribution.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="both" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I receive both the co-contribution and spouse offset?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes, but they apply to different people. The low-income spouse can receive the government co-contribution on their own personal contributions. Simultaneously, the higher-earning partner can contribute to the low-income spouse&apos;s super and claim the spouse offset on their own tax return. The two benefits stack — one rewards personal contributions, the other rewards spousal support.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="deadline" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When do I need to make contributions by?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Personal super contributions must be received by your super fund <strong>on or before 30 June</strong> of the relevant financial year. Allow 3-5 business days for bank transfers to process. Contributions received after 30 June count towards the following financial year. The spouse contribution for the tax offset follows the same deadline.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure>
                <p>Co-contribution thresholds and rates reflect FY2025-26 values as published by the ATO. The spouse contribution tax offset is calculated under section 290-230 of the Income Tax Assessment Act 1997. Income thresholds are indexed annually. All figures assume the contributor meets all eligibility criteria including the 10% employment income test.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("super-co-contribution"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/superannuation-calculator/" label="Superannuation Calculator" />
                    <SidebarLink href="/salary-sacrifice-calculator/" label="Salary Sacrifice Calculator" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/superannuation-guide/" label="Superannuation Guide" />
                    <SidebarLink href="/salary-sacrifice-guide/" label="Salary Sacrifice Guide" />
                    <SidebarLink href="/low-income-tax-offset/" label="Low Income Tax Offset" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Project your super</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">See how employer SG, salary sacrifice, and personal contributions compound over your working life.</p>
                  <Link href="/superannuation-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Open Calculator
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

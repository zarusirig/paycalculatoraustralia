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
  { title: "Individual income tax rates", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Super guarantee rate", url: "https://www.ato.gov.au/businesses-and-organisations/super-for-employers/how-much-to-pay", publisher: SOURCES.ato.name },
  { title: "HELP repayment thresholds", url: "https://www.ato.gov.au/tax-rates-and-codes/study-and-training-support-loans-rates-and-repayment-thresholds", publisher: SOURCES.ato.name },
  { title: "Medicare levy thresholds", url: "https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy", publisher: SOURCES.ato.name },
];

export default function TaxChanges202627Page() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Tax Changes 2026-27</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Tax Changes 2026-27 — What&apos;s Changing From 1 July 2026
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            A forward-looking guide to confirmed and expected Australian tax changes for the 2026-27 financial year. From super guarantee to HECS thresholds, here&apos;s what you need to know to plan your take-home pay.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-5 rounded-r-xl not-prose mb-8">
              <p className="text-navy text-sm font-medium">
                <strong>Living Document</strong>
                <br />
                This page will be updated as changes are confirmed in the May 2026 federal budget. Last updated: March 2026.
              </p>
            </div>

            {/* SECTION 1: Overview */}
            <section id="overview">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>FY2026-27 Tax Year Overview</h2>
              <p>
                The 2026-27 financial year runs from <strong>1 July 2026 to 30 June 2027</strong>. While the May 2026 federal budget may introduce additional measures, several changes are already confirmed or highly expected based on existing legislation and indexation formulas.
              </p>
              <p>
                The Stage 3 tax cuts that took effect on 1 July 2024 remain the current bracket structure. No further bracket changes have been legislated, so FY2026-27 uses the same rates and thresholds as FY2025-26 unless new legislation is passed.
              </p>
            </section>

            {/* SECTION 2: Confirmed Changes */}
            <section id="confirmed-changes">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Confirmed Changes for FY2026-27</h2>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Super Guarantee Stays at 12%</h3>
              <p>
                The Superannuation Guarantee (SG) rate reached its legislated ceiling of <strong>12%</strong> on 1 July 2025 after a decade-long incremental increase from 9.5%. No further increases are legislated for FY2026-27 or beyond. Employers must continue paying SG on ordinary time earnings up to the maximum super contribution base.
              </p>
              <p>
                The concessional contributions cap is expected to remain at <strong>$30,000</strong> per year, while the non-concessional cap stays at <strong>$120,000</strong>. These caps are indexed to Average Weekly Ordinary Time Earnings (AWOTE) and are rounded down to the nearest $2,500.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>HECS-HELP Threshold Update</h3>
              <p>
                The minimum HECS-HELP repayment threshold is indexed annually. For FY2025-26, the threshold is <strong>$67,000</strong> under the new marginal repayment system. The FY2026-27 threshold will be adjusted based on average weekly earnings data, with the updated figure expected to be announced in early 2026.
              </p>
              <p>
                The marginal repayment system introduced in FY2025-26 will continue. You only pay the repayment percentage on income <em>above</em> the threshold, not on your entire income. See our <Link href="/hecs-help-guide/">HECS-HELP Guide</Link> for the full breakdown.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Medicare Levy Thresholds</h3>
              <p>
                The Medicare levy low-income threshold is adjusted annually. The FY2025-26 threshold is <strong>$27,222</strong> for singles. The FY2026-27 figure will be indexed based on CPI movements and announced by the ATO before 1 July 2026.
              </p>
              <p>
                The Medicare Levy Surcharge thresholds ($93,001 for singles, $186,001 for families) have not been indexed since 2014-15. There is no indication these will change for FY2026-27, meaning more earners are captured by the surcharge each year through bracket creep.
              </p>
            </section>

            {/* SECTION 3: Expected Changes */}
            <section id="expected-changes">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Expected Changes (Pending Budget Confirmation)</h2>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax Bracket Indexation</h3>
              <p>
                Australia does not automatically index income tax brackets to inflation. Any bracket changes require legislation. No bracket indexation bill has been introduced for FY2026-27, so the <Link href="/tax-brackets/">current tax brackets</Link> are expected to remain unchanged.
              </p>
              <p>
                The current brackets are:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Taxable Income</th>
                        <th className="px-6 py-4">Tax Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-4">$0 &ndash; $18,200</td><td className="px-6 py-4">0%</td></tr>
                      <tr><td className="px-6 py-4">$18,201 &ndash; $45,000</td><td className="px-6 py-4">16%</td></tr>
                      <tr><td className="px-6 py-4">$45,001 &ndash; $135,000</td><td className="px-6 py-4">30%</td></tr>
                      <tr><td className="px-6 py-4">$135,001 &ndash; $190,000</td><td className="px-6 py-4">37%</td></tr>
                      <tr><td className="px-6 py-4">$190,001+</td><td className="px-6 py-4">45%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Low Income Tax Offset (LITO)</h3>
              <p>
                LITO provides up to <strong>$700</strong> in tax offset for low-to-middle income earners. The offset phases out between $37,500 and $66,667. These thresholds are not automatically indexed, so any changes would require budget legislation. No changes have been flagged.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Minimum Wage &mdash; FWC Annual Review</h3>
              <p>
                The Fair Work Commission conducts its Annual Wage Review each financial year, typically announcing the new national minimum wage in June for effect from 1 July. The FY2025-26 minimum wage is <strong>$24.10 per hour</strong> ($915.90 per week). The FY2026-27 rate will be determined by the FWC&apos;s mid-2026 decision.
              </p>
            </section>

            {/* SECTION 4: Impact on Take-Home Pay */}
            <section id="impact-take-home-pay">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Impact on Take-Home Pay</h2>
              <p>
                Without bracket changes, take-home pay in FY2026-27 will be largely similar to FY2025-26 for employees at the same nominal salary. The main variables are the indexed HECS threshold, Medicare low-income threshold, and any minimum wage increase.
              </p>
              <p>
                The table below shows estimated annual take-home pay at key salary levels, assuming no HECS debt, no MLS, and resident status. These figures will be updated once FY2026-27 thresholds are confirmed.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Gross Salary</th>
                        <th className="px-6 py-4">FY2025-26 Take-Home</th>
                        <th className="px-6 py-4">FY2026-27 Take-Home (Est.)</th>
                        <th className="px-6 py-4">Difference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-6 py-4 font-medium">$60,000</td><td className="px-6 py-4">$50,483</td><td className="px-6 py-4">~$50,483</td><td className="px-6 py-4 text-warmgray">$0*</td></tr>
                      <tr><td className="px-6 py-4 font-medium">$80,000</td><td className="px-6 py-4">$64,283</td><td className="px-6 py-4">~$64,283</td><td className="px-6 py-4 text-warmgray">$0*</td></tr>
                      <tr><td className="px-6 py-4 font-medium">$100,000</td><td className="px-6 py-4">$78,083</td><td className="px-6 py-4">~$78,083</td><td className="px-6 py-4 text-warmgray">$0*</td></tr>
                      <tr><td className="px-6 py-4 font-medium">$120,000</td><td className="px-6 py-4">$91,883</td><td className="px-6 py-4">~$91,883</td><td className="px-6 py-4 text-warmgray">$0*</td></tr>
                      <tr><td className="px-6 py-4 font-medium">$150,000</td><td className="px-6 py-4">$109,433</td><td className="px-6 py-4">~$109,433</td><td className="px-6 py-4 text-warmgray">$0*</td></tr>
                      <tr><td className="px-6 py-4 font-medium">$200,000</td><td className="px-6 py-4">$137,583</td><td className="px-6 py-4">~$137,583</td><td className="px-6 py-4 text-warmgray">$0*</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">*Estimated. Assumes no bracket changes in FY2026-27. Actual figures will depend on any budget announcements. Excludes HECS, MLS, and salary sacrifice.</p>
              </div>
            </section>

            {/* SECTION 5: How to Prepare */}
            <section id="how-to-prepare">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Prepare for FY2026-27</h2>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Salary Sacrifice Timing</h3>
              <p>
                If you are considering increasing salary sacrifice into superannuation, review your arrangements before 1 July 2026. The concessional contributions cap applies per financial year, so timing contributions strategically across the transition can maximise your tax benefit. Use our <Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link> to model different scenarios.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Super Contribution Planning</h3>
              <p>
                With the SG rate locked at 12%, any additional super contributions must come from salary sacrifice or personal after-tax contributions. The carry-forward rule allows you to use unused concessional cap amounts from the previous 5 years if your total super balance is under <strong>$500,000</strong>. This can be particularly valuable for one-off bonus years.
              </p>

              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-6">
                <p className="text-navy text-sm font-medium">
                  <strong>Action Item</strong>
                  <br />
                  Review your current salary sacrifice arrangements, HECS balance, and private health insurance status before 30 June 2026. Use our <Link href="/income-tax-calculator/" className="text-eucalyptus-dark underline hover:text-navy">Income Tax Calculator</Link> to model your FY2026-27 take-home pay.
                </p>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>HECS Voluntary Repayments</h3>
              <p>
                If you hold a HECS-HELP debt, consider making a voluntary repayment before <strong>1 June 2026</strong> to reduce the balance before annual indexation is applied. With the indexation cap set at the lower of CPI or WPI, the rate is moderate but still adds to your debt each year.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Private Health Insurance Review</h3>
              <p>
                With the Medicare Levy Surcharge thresholds frozen since 2014-15, more earners cross the $93,001 threshold each year. If your income is approaching this level, compare the cost of basic hospital cover against the 1% surcharge. See our <Link href="/private-health-insurance-medicare/">Private Health Insurance &amp; Medicare guide</Link> for a detailed comparison.
              </p>
            </section>

            {/* SECTION 6: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="bracket-change" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Will tax brackets change in 2026-27?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">No bracket changes have been legislated for FY2026-27. The Stage 3 tax cut brackets from 1 July 2024 remain in effect. Any changes would need to be announced in the May 2026 budget and passed by Parliament before 1 July 2026. See our <Link href="/stage-3-tax-cuts/" className="text-eucalyptus-dark underline">Stage 3 Tax Cuts guide</Link> for the current bracket structure.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="sg-rate" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is the super guarantee going up again?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">No. The SG rate reached its legislated ceiling of <strong>12%</strong> on 1 July 2025. There are no legislated increases beyond 12%. Any further increase would require new legislation. The 12% rate applies for FY2026-27 and indefinitely until Parliament legislates otherwise.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="hecs-threshold" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What will the HECS threshold be in 2026-27?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The exact FY2026-27 HECS-HELP threshold has not yet been announced. It will be indexed based on average weekly earnings data. The FY2025-26 threshold is <strong>$67,000</strong>. Historically, annual indexation adds approximately $1,000&ndash;$2,000 to the threshold. See our <Link href="/hecs-help-guide/" className="text-eucalyptus-dark underline">HECS-HELP Guide</Link> for the current repayment rates.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="budget" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When is the 2026 federal budget?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The federal budget is typically delivered in May. The 2026-27 budget is expected in <strong>May 2026</strong>. Any tax changes announced in the budget would need to pass both houses of Parliament to take effect from 1 July 2026. We will update this page as soon as budget details are confirmed.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="lito" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Will LITO change in 2026-27?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The Low Income Tax Offset is not automatically indexed. It currently provides up to $700 for incomes up to $37,500, phasing out completely at $66,667. No changes have been announced for FY2026-27. Any adjustment would need to be included in the May 2026 budget.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="minimum-wage" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When will the new minimum wage be announced?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The Fair Work Commission typically announces the new minimum wage in <strong>June</strong> each year, effective from the first full pay period on or after 1 July. The current minimum wage is $24.10 per hour ($915.90 per week for a 38-hour week). The FY2026-27 rate will be determined by the FWC&apos;s Annual Wage Review.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="About this guide">
                <p>Information is based on current legislation, ATO publications, and scheduled indexation formulas. Expected changes are clearly marked as estimates pending official confirmation. Take-home pay figures use FY2025-26 tax brackets and rates as a baseline. This page is updated as new information becomes available from the ATO, Treasury, and federal budget announcements.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("tax-changes-2026-27"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/tax-brackets/" label="Tax Brackets 2025-26" />
                    <SidebarLink href="/stage-3-tax-cuts/" label="Stage 3 Tax Cuts Explained" />
                    <SidebarLink href="/hecs-help-guide/" label="HECS-HELP Guide" />
                    <SidebarLink href="/tax-bracket-history/" label="Tax Bracket History" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Model your FY2026-27 pay</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Use our calculator to estimate your take-home pay under current rates and plan for the year ahead.</p>
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

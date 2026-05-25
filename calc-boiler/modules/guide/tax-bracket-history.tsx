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
  { title: "Individual income tax rates for Australian residents", url: "https://www.ato.gov.au/tax-rates-and-codes/tax-rates-australian-residents", publisher: SOURCES.ato.name },
  { title: "Stage 3 Personal Income Tax Plan", url: "https://treasury.gov.au/tax-cuts", publisher: "Australian Treasury" },
  { title: "Low and Middle Income Tax Offset (LMITO)", url: "https://www.ato.gov.au/individuals-and-families/income-deductions-offsets-and-records/tax-offsets", publisher: SOURCES.ato.name },
];

const PRE_STAGE3 = [
  { bracket: "$0 \u2013 $18,200", rate: "0%" },
  { bracket: "$18,201 \u2013 $45,000", rate: "19%" },
  { bracket: "$45,001 \u2013 $120,000", rate: "32.5%" },
  { bracket: "$120,001 \u2013 $180,000", rate: "37%" },
  { bracket: "$180,001+", rate: "45%" },
];

const POST_STAGE3 = [
  { bracket: "$0 \u2013 $18,200", rate: "0%" },
  { bracket: "$18,201 \u2013 $45,000", rate: "16%" },
  { bracket: "$45,001 \u2013 $135,000", rate: "30%" },
  { bracket: "$135,001 \u2013 $190,000", rate: "37%" },
  { bracket: "$190,001+", rate: "45%" },
];

export default function TaxBracketHistoryPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Tax Bracket History</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Tax Bracket History &mdash; Australian Income Tax Rates 2020 to 2026
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            How have Australian tax brackets evolved over the past six financial years? This page tracks every rate and threshold change from FY2020-21 through FY2025-26, including the landmark Stage 3 tax cuts that reshaped the system from 1 July 2024.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: Tax Brackets by Financial Year */}
            <section id="brackets-by-year">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax Brackets by Financial Year</h2>
              <p>
                Australia&apos;s individual income tax brackets remained stable from FY2020-21 through FY2023-24, with five brackets and a top marginal rate of <strong>45%</strong>. The revised Stage 3 tax cuts then restructured the system from 1 July 2024, delivering lower rates and wider brackets for every taxpayer.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>FY2020-21 to FY2023-24</h3>
              <p>
                These four years shared identical tax brackets. The only significant change during this period was the removal of the Low and Middle Income Tax Offset (LMITO) from FY2022-23 onwards, which effectively increased the tax burden for earners between $37,000 and $126,000.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Taxable Income</th>
                        <th className="px-6 py-4 border-l text-right">Tax Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {PRE_STAGE3.map((row) => (
                        <tr key={row.bracket}>
                          <td className="px-6 py-4 font-semibold text-navy bg-sandstone">{row.bracket}</td>
                          <td className="px-6 py-4 border-l text-right">{row.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Excludes Medicare Levy (2%) and LMITO (available FY2020-21 &amp; FY2021-22 only). Brackets identical for FY2020-21, FY2021-22, FY2022-23, and FY2023-24.</p>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>FY2024-25 &amp; FY2025-26 (Revised Stage 3)</h3>
              <p>
                The revised Stage 3 tax cuts lowered the 19% rate to <strong>16%</strong>, replaced the 32.5% rate with <strong>30%</strong>, extended the middle bracket to $135,000, and raised the top threshold to $190,001. These brackets apply for both FY2024-25 and FY2025-26.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Taxable Income</th>
                        <th className="px-6 py-4 border-l text-right">Tax Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {POST_STAGE3.map((row) => (
                        <tr key={row.bracket}>
                          <td className="px-6 py-4 font-semibold text-navy bg-sandstone">{row.bracket}</td>
                          <td className="px-6 py-4 border-l text-right">{row.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Excludes Medicare Levy (2%). Applies from 1 July 2024 onwards.</p>
              </div>
            </section>

            {/* SECTION 2: Year-Over-Year Master Comparison */}
            <section id="master-comparison">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Year-Over-Year Master Comparison</h2>
              <p>
                The table below places all six financial years side by side so you can see exactly when each rate and threshold changed. The shaded columns highlight the FY2024-25 shift.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-x-auto overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-4 py-4">Bracket</th>
                        <th className="px-4 py-4 border-l text-center">20-21</th>
                        <th className="px-4 py-4 border-l text-center">21-22</th>
                        <th className="px-4 py-4 border-l text-center">22-23</th>
                        <th className="px-4 py-4 border-l text-center">23-24</th>
                        <th className="px-4 py-4 border-l text-center bg-eucalyptus/10">24-25</th>
                        <th className="px-4 py-4 border-l text-center bg-eucalyptus/10">25-26</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$0 &ndash; $18,200</td>
                        <td className="px-4 py-3 border-l text-center">0%</td>
                        <td className="px-4 py-3 border-l text-center">0%</td>
                        <td className="px-4 py-3 border-l text-center">0%</td>
                        <td className="px-4 py-3 border-l text-center">0%</td>
                        <td className="px-4 py-3 border-l text-center bg-eucalyptus/10">0%</td>
                        <td className="px-4 py-3 border-l text-center bg-eucalyptus/10">0%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$18,201 &ndash; $45,000</td>
                        <td className="px-4 py-3 border-l text-center">19%</td>
                        <td className="px-4 py-3 border-l text-center">19%</td>
                        <td className="px-4 py-3 border-l text-center">19%</td>
                        <td className="px-4 py-3 border-l text-center">19%</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10">16%</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10">16%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$45,001 &ndash; $120,000</td>
                        <td className="px-4 py-3 border-l text-center">32.5%</td>
                        <td className="px-4 py-3 border-l text-center">32.5%</td>
                        <td className="px-4 py-3 border-l text-center">32.5%</td>
                        <td className="px-4 py-3 border-l text-center">32.5%</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10" colSpan={2}>See below</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$45,001 &ndash; $135,000</td>
                        <td className="px-4 py-3 border-l text-center text-warmgray-light" colSpan={4}>&mdash;</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10">30%</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10">30%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$120,001 &ndash; $180,000</td>
                        <td className="px-4 py-3 border-l text-center">37%</td>
                        <td className="px-4 py-3 border-l text-center">37%</td>
                        <td className="px-4 py-3 border-l text-center">37%</td>
                        <td className="px-4 py-3 border-l text-center">37%</td>
                        <td className="px-4 py-3 border-l text-center text-warmgray-light bg-eucalyptus/10" colSpan={2}>Replaced</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$135,001 &ndash; $190,000</td>
                        <td className="px-4 py-3 border-l text-center text-warmgray-light" colSpan={4}>&mdash;</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10">37%</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark bg-eucalyptus/10">37%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">$180,001+ / $190,001+</td>
                        <td className="px-4 py-3 border-l text-center">45%</td>
                        <td className="px-4 py-3 border-l text-center">45%</td>
                        <td className="px-4 py-3 border-l text-center">45%</td>
                        <td className="px-4 py-3 border-l text-center">45%</td>
                        <td className="px-4 py-3 border-l text-center bg-eucalyptus/10">45%</td>
                        <td className="px-4 py-3 border-l text-center bg-eucalyptus/10">45%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SECTION 3: Key Changes Timeline */}
            <section id="key-changes">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Key Changes Timeline</h2>
              <p>
                Australia&apos;s Personal Income Tax Plan was legislated in 2018 as a three-stage reform spanning seven years. The timeline below captures the major milestones.
              </p>
              <ul>
                <li><strong>FY2018-19 &mdash; Stage 1:</strong> Increased the Low Income Tax Offset (LITO) from $445 to $700 and introduced the temporary Low and Middle Income Tax Offset (LMITO) worth up to $530 (later increased to $1,500).</li>
                <li><strong>FY2020-21 &mdash; Stage 2:</strong> Raised the upper limit of the 19% bracket from $37,000 to $45,000 and the 32.5% bracket from $90,000 to $120,000. These changes were brought forward from the originally planned FY2022-23.</li>
                <li><strong>FY2022-23 &mdash; LMITO Removed:</strong> The temporary Low and Middle Income Tax Offset was not extended beyond FY2021-22, resulting in an effective tax increase of up to $1,500 for earners between $37,000 and $126,000.</li>
                <li><strong>FY2024-25 &mdash; Revised Stage 3:</strong> The original Stage 3 plan (a flat 30% rate from $45,001 to $200,000) was replaced with the revised version: 16% for $18,201&ndash;$45,000, 30% for $45,001&ndash;$135,000, 37% for $135,001&ndash;$190,000, and 45% above $190,001. Every taxpayer earning above $18,200 received a cut.</li>
              </ul>
              <p>
                Read the full breakdown of Stage 3 savings at every income level in our <Link href="/stage-3-tax-cuts/">Stage 3 Tax Cuts</Link> guide.
              </p>
            </section>

            {/* SECTION 4: Tax on $80,000 Historical */}
            <section id="tax-on-80k">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Tax on $80,000 &mdash; Historical Comparison</h2>
              <p>
                To illustrate the real impact of bracket changes, the table below shows the total income tax payable on a <strong>$80,000</strong> taxable income across each financial year. This excludes the Medicare Levy and any offsets.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Financial Year</th>
                        <th className="px-6 py-4 border-l text-right">Tax on $80,000</th>
                        <th className="px-6 py-4 border-l text-right">Change</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2020-21</td>
                        <td className="px-6 py-4 border-l text-right">$17,547</td>
                        <td className="px-6 py-4 border-l text-right text-warmgray">&mdash;</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2021-22</td>
                        <td className="px-6 py-4 border-l text-right">$17,547</td>
                        <td className="px-6 py-4 border-l text-right text-warmgray">$0</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2022-23</td>
                        <td className="px-6 py-4 border-l text-right">$17,547</td>
                        <td className="px-6 py-4 border-l text-right text-warmgray">$0</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2023-24</td>
                        <td className="px-6 py-4 border-l text-right">$17,547</td>
                        <td className="px-6 py-4 border-l text-right text-warmgray">$0</td>
                      </tr>
                      <tr className="bg-eucalyptus/5">
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2024-25</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">$14,788</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">&minus;$2,759</td>
                      </tr>
                      <tr className="bg-eucalyptus/5">
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2025-26</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">$14,788</td>
                        <td className="px-6 py-4 border-l text-right text-warmgray">$0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Excludes Medicare Levy and all offsets (LITO, LMITO). LMITO would have reduced the FY2020-21 and FY2021-22 figures by up to $1,080 at lodgement.</p>
              </div>
              <p>
                The Stage 3 tax cuts delivered a <strong>$2,759 annual saving</strong> at $80,000 income. Run your own calculation using the <Link href="/income-tax-calculator/">Income Tax Calculator</Link>.
              </p>
            </section>

            {/* SECTION 5: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="stage3-when" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When did the Stage 3 tax cuts take effect?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The revised Stage 3 tax cuts took effect on 1 July 2024, applying from FY2024-25 onwards. The original plan was significantly amended in January 2024, with the revised version passing Parliament in March 2024.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="lmito" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What was the LMITO and when was it removed?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The Low and Middle Income Tax Offset was a temporary offset worth up to $1,500 (in its final year). It applied from FY2018-19 to FY2021-22 and was claimed at lodgement. It was not extended beyond FY2021-22, so from FY2022-23 onwards taxpayers no longer received this reduction.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="80k-saving" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much do I save at $80,000 under Stage 3?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    At $80,000 taxable income, your tax bill dropped from $17,547 to $14,788 &mdash; a saving of <strong>$2,759 per year</strong> or approximately <strong>$53 per week</strong>. This comes from the lower 16% rate (previously 19%) on income from $18,201 to $45,000 and the lower 30% rate (previously 32.5%) on income from $45,001 to $80,000.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="same-2526" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Have tax brackets changed for FY2025-26?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. The FY2025-26 tax brackets are identical to FY2024-25. The next scheduled changes are outlined in the <Link href="/tax-changes-2026-27/" className="text-eucalyptus-dark hover:underline">FY2026-27 Tax Changes</Link> guide.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="original-stage3" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What was the original Stage 3 plan?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The original Stage 3 plan would have created a flat 30% rate for all income between $45,001 and $200,000, eliminating the 32.5% and 37% brackets entirely. This would have disproportionately benefited higher earners. The revised version retained progressive brackets while still delivering cuts across all income levels.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Tax brackets and rates on this page are sourced directly from the ATO&apos;s published individual income tax rate schedules for each financial year. Tax calculations exclude the Medicare Levy (2%) and any offsets unless explicitly noted. Stage 3 figures reflect the revised legislation passed in March 2024.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("tax-bracket-history"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/tax-brackets/" label="Current Tax Brackets" />
                    <SidebarLink href="/stage-3-tax-cuts/" label="Stage 3 Tax Cuts Explained" />
                    <SidebarLink href="/tax-changes-2026-27/" label="Tax Changes 2026-27" />
                    <SidebarLink href="/income-tax-calculator/" label="Income Tax Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Calculate Your Tax</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">See exactly how much tax you owe under the current FY2025-26 brackets and how much you save compared to previous years.</p>
                  <Link href="/income-tax-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Calculate Now <ArrowRight className="inline h-4 w-4 ml-1" />
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

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span>
      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
    </Link>
  );
}

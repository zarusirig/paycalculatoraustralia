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
  { title: "Super guarantee percentage", url: "https://www.ato.gov.au/tax-rates-and-codes", publisher: SOURCES.ato.name },
  { title: "Superannuation Guarantee history", url: "https://treasury.gov.au/policy-topics/superannuation", publisher: "Australian Treasury" },
  { title: "Superannuation Guarantee (Administration) Act 1992", url: "https://www.legislation.gov.au/Details/C2024C00240", publisher: "Federal Register of Legislation" },
];

const SG_RATES = [
  { period: "1992-93", rate: "3%" },
  { period: "1993-94 to 1994-95", rate: "4%" },
  { period: "1995-96", rate: "5%" },
  { period: "1996-97 to 1997-98", rate: "6%" },
  { period: "1998-99 to 1999-00", rate: "7%" },
  { period: "2000-01 to 2001-02", rate: "8%" },
  { period: "2002-03 to 2012-13", rate: "9%" },
  { period: "2013-14", rate: "9.25%" },
  { period: "2014-15 to 2020-21", rate: "9.5%" },
  { period: "2021-22", rate: "10%" },
  { period: "2022-23", rate: "10.5%" },
  { period: "2023-24", rate: "11%" },
  { period: "2024-25", rate: "11.5%" },
  { period: "2025-26", rate: "12%" },
];

export default function SuperGuaranteeRateHistoryPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Super Guarantee Rate History</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Super Guarantee Rate History &mdash; From 3% to 12%
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            The Super Guarantee has grown from just 3% in 1992 to the legislated ceiling of 12% in FY2025-26. This page documents every rate change, the political freeze that delayed the path to 12%, and what it means for your retirement savings.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: SG Rate Timeline */}
            <section id="sg-rate-timeline">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>SG Rate Timeline &mdash; Every Rate Since 1992</h2>
              <p>
                The Superannuation Guarantee was introduced by the Keating Government in 1992 at <strong>3%</strong> of ordinary time earnings. It was designed to progressively increase to ensure Australians built adequate retirement savings. The table below shows every rate from inception to the current <strong>12%</strong> ceiling.
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Financial Year(s)</th>
                        <th className="px-6 py-4 border-l text-right">SG Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {SG_RATES.map((row, i) => (
                        <tr key={row.period} className={i >= SG_RATES.length - 1 ? "bg-eucalyptus/5" : ""}>
                          <td className="px-6 py-4 font-semibold text-navy bg-sandstone">{row.period}</td>
                          <td className={`px-6 py-4 border-l text-right ${i >= SG_RATES.length - 1 ? "font-bold text-eucalyptus-dark" : ""}`}>{row.rate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Source: ATO Super Guarantee percentage table. Rate applies to ordinary time earnings (OTE).</p>
              </div>
            </section>

            {/* SECTION 2: The Path to 12% */}
            <section id="path-to-12">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Path to 12% &mdash; Freezes and Delays</h2>
              <p>
                The original plan was for the SG to reach 12% by 2019-20, but the Abbott Government froze the rate at <strong>9.5%</strong> in the 2014 Budget. The freeze lasted <strong>seven years</strong>, from FY2014-15 to FY2020-21.
              </p>
              <p>
                The stated rationale was that super increases would reduce take-home pay and suppress wage growth. Critics argued the freeze short-changed retirement savings, particularly for lower-income workers who depend most on compulsory super.
              </p>
              <p>
                Annual 0.5 percentage point increases resumed from 1 July 2021, following the passage of the <em>Treasury Laws Amendment (Your Future, Your Super) Act 2021</em>. The legislated schedule was:
              </p>
              <ul>
                <li><strong>1 July 2021:</strong> 9.5% &rarr; 10%</li>
                <li><strong>1 July 2022:</strong> 10% &rarr; 10.5%</li>
                <li><strong>1 July 2023:</strong> 10.5% &rarr; 11%</li>
                <li><strong>1 July 2024:</strong> 11% &rarr; 11.5%</li>
                <li><strong>1 July 2025:</strong> 11.5% &rarr; 12% (legislated ceiling)</li>
              </ul>
              <p>
                The seven-year freeze cost a worker on the average full-time salary (approximately $95,000) an estimated <strong>$20,000 to $30,000</strong> in lost super contributions over the freeze period, before accounting for investment returns.
              </p>
            </section>

            {/* SECTION 3: Impact on Take-Home Pay */}
            <section id="impact-take-home">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Impact on Take-Home Pay Over Time</h2>
              <p>
                Each SG rate increase adds to the employer&apos;s total cost of employment. Whether the increase reduces employee take-home pay depends on how the cost is absorbed.
              </p>
              <p>
                In theory, SG increases are paid <em>on top of</em> salary, meaning take-home pay should remain unchanged. In practice, economic research from the Grattan Institute and Treasury suggests that over the medium to long term, roughly <strong>80%</strong> of SG increases come at the expense of slower wage growth rather than as a pure additional cost to employers.
              </p>
              <p>
                The table below illustrates the employer cost impact of SG changes on a <strong>$100,000</strong> salary:
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Financial Year</th>
                        <th className="px-6 py-4 border-l text-right">SG Rate</th>
                        <th className="px-6 py-4 border-l text-right">Annual Super on $100K</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2014-15 to FY2020-21</td>
                        <td className="px-6 py-4 border-l text-right">9.5%</td>
                        <td className="px-6 py-4 border-l text-right">$9,500</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2021-22</td>
                        <td className="px-6 py-4 border-l text-right">10%</td>
                        <td className="px-6 py-4 border-l text-right">$10,000</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2022-23</td>
                        <td className="px-6 py-4 border-l text-right">10.5%</td>
                        <td className="px-6 py-4 border-l text-right">$10,500</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2023-24</td>
                        <td className="px-6 py-4 border-l text-right">11%</td>
                        <td className="px-6 py-4 border-l text-right">$11,000</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2024-25</td>
                        <td className="px-6 py-4 border-l text-right">11.5%</td>
                        <td className="px-6 py-4 border-l text-right">$11,500</td>
                      </tr>
                      <tr className="bg-eucalyptus/5">
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">FY2025-26</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">12%</td>
                        <td className="px-6 py-4 border-l text-right font-bold text-eucalyptus-dark">$12,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                From FY2014-15 to FY2025-26, the annual super contribution on a $100,000 salary increased by <strong>$2,500</strong> &mdash; from $9,500 to $12,000. Use the <Link href="/superannuation-calculator/">Superannuation Calculator</Link> to model how this impacts your projected retirement balance.
              </p>
            </section>

            {/* SECTION 4: What Comes After 12% */}
            <section id="after-12">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Comes After 12%?</h2>
              <p>
                There are currently <strong>no legislated plans</strong> to increase the SG rate beyond 12%. The 12% ceiling was set by the <em>Superannuation Guarantee (Administration) Act 1992</em> as amended, and no further increases have been introduced to Parliament.
              </p>
              <p>
                Some industry bodies, including the Australian Institute of Superannuation Trustees (AIST) and Industry Super Australia, have advocated for a long-term target of <strong>15%</strong>. Their argument centres on ensuring adequate retirement income, particularly for women and lower-income workers with broken career patterns.
              </p>
              <p>
                Opponents, including some economists and employer groups, argue that further increases would suppress wages and disproportionately affect younger workers who face housing affordability challenges. The current political consensus is that 12% represents the final rate for the foreseeable future.
              </p>
              <p>
                Workers seeking to build super beyond the 12% SG can make <strong>voluntary concessional contributions</strong> up to the $30,000 annual cap (including employer SG) or after-tax non-concessional contributions up to $120,000 per year. Read more in our <Link href="/superannuation-guide/">Superannuation Guide</Link>.
              </p>
            </section>

            {/* SECTION 5: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="current-rate" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the super guarantee rate for 2025-26?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The super guarantee rate for FY2025-26 is <strong>12%</strong> of ordinary time earnings. This is the legislated ceiling and represents the final increase in the gradual path from 9.5% that resumed in July 2021.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="why-frozen" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Why was the super guarantee frozen at 9.5% for seven years?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The Abbott Government froze the SG rate at 9.5% in the 2014 Federal Budget, arguing that increases would come at the expense of wage growth and reduce take-home pay. The freeze remained in place until 30 June 2021, when the legislated 0.5% annual increases resumed.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="beyond-12" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Will the SG rate increase beyond 12%?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    There are currently no legislated plans to increase the SG beyond 12%. Some industry groups advocate for 15%, but no legislation has been introduced. Workers can make voluntary contributions above the SG to build additional retirement savings.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="take-home" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do SG increases reduce my take-home pay?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Legally, SG is paid on top of salary, so your gross pay should not change. However, economic research suggests that over time, roughly 80% of SG increases are absorbed through slower wage growth rather than as a pure additional employer cost. Use the <Link href="/employer-cost-calculator/" className="text-eucalyptus-dark hover:underline">Employer Cost Calculator</Link> to see the full cost breakdown.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>SG rates on this page are sourced from the ATO&apos;s published super guarantee percentage table and the Superannuation Guarantee (Administration) Act 1992. Employer cost examples assume ordinary time earnings of $100,000 with no salary sacrifice arrangements.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("super-guarantee-rate-history"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/superannuation-guide/" label="Superannuation Guide" />
                    <SidebarLink href="/superannuation-calculator/" label="Super Calculator" />
                    <SidebarLink href="/employer-cost-calculator/" label="Employer Cost Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Project Your Super Balance</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">See how the 12% SG rate and voluntary contributions grow your retirement balance over time.</p>
                  <Link href="/superannuation-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
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

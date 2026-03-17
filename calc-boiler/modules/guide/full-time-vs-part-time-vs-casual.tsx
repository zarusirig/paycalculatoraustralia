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
  { title: "Types of employees", url: "https://www.fairwork.gov.au/starting-employment/types-of-employees", publisher: SOURCES.fwo.name },
  { title: "Casual employees", url: "https://www.fairwork.gov.au/starting-employment/types-of-employees/casual-employees", publisher: SOURCES.fwo.name },
  { title: "National Employment Standards", url: "https://www.fairwork.gov.au/employment-conditions/national-employment-standards", publisher: SOURCES.fwo.name },
  { title: "Fair Work Act 2009", url: "https://www.legislation.gov.au/Details/C2024C00311", publisher: "Federal Register of Legislation" },
];

export default function FullTimeVsPartTimeVsCasualPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Full-Time vs Part-Time vs Casual</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Full-Time vs Part-Time vs Casual &mdash; The Complete Comparison
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Choosing the right employment type affects your pay, leave, job security, and flexibility. This guide breaks down the key differences between full-time, part-time, and casual employment under Australian law so you can make an informed decision.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: Quick Comparison Table */}
            <section id="comparison-table">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Quick Comparison Table</h2>
              <p>
                The table below summarises the key differences between the three main employment types under the <em>Fair Work Act 2009</em> and the National Employment Standards (NES).
              </p>
              <div className="not-prose my-8">
                <div className="overflow-x-auto overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-4 py-4">Factor</th>
                        <th className="px-4 py-4 border-l text-center">Full-Time</th>
                        <th className="px-4 py-4 border-l text-center">Part-Time</th>
                        <th className="px-4 py-4 border-l text-center">Casual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">Standard hours</td>
                        <td className="px-4 py-3 border-l text-center">38 hrs/week</td>
                        <td className="px-4 py-3 border-l text-center">Less than 38 hrs (guaranteed)</td>
                        <td className="px-4 py-3 border-l text-center">No guarantee</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">Annual leave</td>
                        <td className="px-4 py-3 border-l text-center">4 weeks paid</td>
                        <td className="px-4 py-3 border-l text-center">4 weeks pro-rata</td>
                        <td className="px-4 py-3 border-l text-center">None</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">Personal/carer&apos;s leave</td>
                        <td className="px-4 py-3 border-l text-center">10 days paid</td>
                        <td className="px-4 py-3 border-l text-center">10 days pro-rata</td>
                        <td className="px-4 py-3 border-l text-center">2 days unpaid</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">Notice of termination</td>
                        <td className="px-4 py-3 border-l text-center">1&ndash;5 weeks</td>
                        <td className="px-4 py-3 border-l text-center">1&ndash;5 weeks</td>
                        <td className="px-4 py-3 border-l text-center">None (either party)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">Redundancy pay</td>
                        <td className="px-4 py-3 border-l text-center">4&ndash;16 weeks</td>
                        <td className="px-4 py-3 border-l text-center">4&ndash;16 weeks</td>
                        <td className="px-4 py-3 border-l text-center">None</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">Casual loading</td>
                        <td className="px-4 py-3 border-l text-center">N/A</td>
                        <td className="px-4 py-3 border-l text-center">N/A</td>
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark">25%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">Superannuation (SG)</td>
                        <td className="px-4 py-3 border-l text-center">12%</td>
                        <td className="px-4 py-3 border-l text-center">12%</td>
                        <td className="px-4 py-3 border-l text-center">12%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">Overtime access</td>
                        <td className="px-4 py-3 border-l text-center">After 38 hrs</td>
                        <td className="px-4 py-3 border-l text-center">After agreed hrs</td>
                        <td className="px-4 py-3 border-l text-center">After 38 hrs (most awards)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">Minimum engagement</td>
                        <td className="px-4 py-3 border-l text-center">Full day/shift</td>
                        <td className="px-4 py-3 border-l text-center">Varies by award</td>
                        <td className="px-4 py-3 border-l text-center">2&ndash;4 hours (award dependent)</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">Job security</td>
                        <td className="px-4 py-3 border-l text-center">Highest</td>
                        <td className="px-4 py-3 border-l text-center">High</td>
                        <td className="px-4 py-3 border-l text-center">Lowest</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">Flexibility</td>
                        <td className="px-4 py-3 border-l text-center">Lowest</td>
                        <td className="px-4 py-3 border-l text-center">Moderate</td>
                        <td className="px-4 py-3 border-l text-center">Highest</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Based on the National Employment Standards (NES) and Fair Work Act 2009. Specific entitlements may vary under applicable Modern Awards or Enterprise Agreements.</p>
              </div>
            </section>

            {/* SECTION 2: Full-Time */}
            <section id="full-time">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Full-Time Employment</h2>
              <p>
                Full-time employees work <strong>38 ordinary hours per week</strong> (or an average of 38 hours over a roster cycle) and receive the complete suite of National Employment Standards entitlements.
              </p>
              <ul>
                <li><strong>4 weeks</strong> paid annual leave per year (5 weeks for some shift workers)</li>
                <li><strong>10 days</strong> paid personal/carer&apos;s leave per year (accumulates)</li>
                <li><strong>2 days</strong> compassionate leave per occasion</li>
                <li><strong>12 months</strong> unpaid parental leave (plus the right to request an additional 12 months)</li>
                <li>Notice of termination of <strong>1 to 5 weeks</strong> depending on length of service (plus 1 extra week if over 45 and employed 2+ years)</li>
                <li>Redundancy pay of <strong>4 to 16 weeks</strong> pay depending on years of service</li>
                <li><strong>12%</strong> Super Guarantee on ordinary time earnings</li>
              </ul>
              <p>
                <strong>Best for:</strong> Workers seeking maximum job security, full leave entitlements, and predictable income. Ideal for those with fixed financial commitments like a mortgage.
              </p>
            </section>

            {/* SECTION 3: Part-Time */}
            <section id="part-time">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Part-Time Employment</h2>
              <p>
                Part-time employees work <strong>fewer than 38 hours per week</strong> on a regular, guaranteed schedule agreed in writing. They receive the same entitlements as full-time employees, calculated on a <strong>pro-rata basis</strong>.
              </p>
              <ul>
                <li>Guaranteed minimum hours agreed in the employment contract</li>
                <li>All NES leave entitlements calculated pro-rata (e.g., a 20-hour/week employee receives 2 weeks equivalent paid annual leave)</li>
                <li>Same notice of termination and redundancy pay rights as full-time</li>
                <li>Overtime rates apply when working <strong>beyond agreed hours</strong> (not just beyond 38 hours), depending on the applicable award</li>
                <li><strong>12%</strong> Super Guarantee on all ordinary time earnings</li>
              </ul>
              <p>
                <strong>Best for:</strong> Workers who want stability and leave entitlements but need a schedule that accommodates study, caring responsibilities, or a second job. Parents returning from parental leave often transition to part-time.
              </p>
            </section>

            {/* SECTION 4: Casual */}
            <section id="casual">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Casual Employment</h2>
              <p>
                Casual employees have <strong>no firm advance commitment</strong> to continuing and indefinite work according to an agreed pattern. In return, they receive a <strong>25% casual loading</strong> on top of the base hourly rate to compensate for the absence of paid leave and other entitlements.
              </p>
              <ul>
                <li><strong>25% loading</strong> on the applicable base rate (this compensates for no annual leave, personal leave, notice period, or redundancy pay)</li>
                <li><strong>2 days unpaid</strong> carer&apos;s leave per occasion and 2 days unpaid compassionate leave</li>
                <li>No notice period required from either party to end the engagement</li>
                <li>Minimum engagement per shift of <strong>2 to 4 hours</strong> depending on the award</li>
                <li><strong>12%</strong> Super Guarantee on all ordinary time earnings (no minimum earnings threshold since 1 July 2022)</li>
                <li><strong>Casual conversion right:</strong> After 12 months of regular and systematic employment, the employer must offer conversion to permanent (full-time or part-time). Employees can also request conversion after 6 months.</li>
              </ul>
              <p>
                <strong>Best for:</strong> Workers who prioritise flexibility over stability &mdash; students, those between jobs, or anyone who wants the freedom to accept or decline shifts without obligation.
              </p>
            </section>

            {/* SECTION 5: The Real Cost Comparison */}
            <section id="cost-comparison">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Real Cost Comparison</h2>
              <p>
                The 25% casual loading sounds generous, but when you factor in the value of lost entitlements, the financial picture is more nuanced. For a worker earning <strong>$30/hour base rate</strong> working 38 hours per week:
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Component</th>
                        <th className="px-6 py-4 border-l text-right">Full-Time/Part-Time</th>
                        <th className="px-6 py-4 border-l text-right">Casual (25% loading)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Hourly rate</td>
                        <td className="px-6 py-4 border-l text-right">$30.00</td>
                        <td className="px-6 py-4 border-l text-right">$37.50</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Gross annual pay (38 hrs x 52 wks)</td>
                        <td className="px-6 py-4 border-l text-right">$59,280</td>
                        <td className="px-6 py-4 border-l text-right">$74,100</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Paid annual leave value (4 wks)</td>
                        <td className="px-6 py-4 border-l text-right">$4,560 (included)</td>
                        <td className="px-6 py-4 border-l text-right">$0 (unpaid)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Paid personal leave value (10 days)</td>
                        <td className="px-6 py-4 border-l text-right">$2,280 (included)</td>
                        <td className="px-6 py-4 border-l text-right">$0 (unpaid)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Casual takes 4 wks off (lost income)</td>
                        <td className="px-6 py-4 border-l text-right">&mdash;</td>
                        <td className="px-6 py-4 border-l text-right">&minus;$5,700</td>
                      </tr>
                      <tr className="bg-sandstone/50 font-semibold">
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Effective annual value (if casual takes leave)</td>
                        <td className="px-6 py-4 border-l text-right">$59,280</td>
                        <td className="px-6 py-4 border-l text-right">$68,400</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Assumes casual works all 52 weeks at 38 hours before deducting leave. Actual casual advantage narrows further when sick leave usage, redundancy pay value, and notice period are included.</p>
              </div>
              <p>
                The casual worker earns more gross pay, but the gap narrows significantly once leave usage is factored in. Use the <Link href="/employment-type-calculator/">Employment Type Calculator</Link> to model the exact comparison for your rate and hours.
              </p>
            </section>

            {/* SECTION 6: Changing Employment Type */}
            <section id="changing-type">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Changing Employment Type</h2>
              <p>
                Australian law provides several pathways for changing employment type:
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Casual to Permanent Conversion</h3>
              <p>
                Under the Fair Work Act (as amended by the <em>Fair Work Legislation Amendment (Closing Loopholes No. 2) Act 2024</em>), employers of 15 or more employees must offer casual conversion after <strong>12 months</strong> if the employee has worked a regular pattern of hours for at least the last 6 months. Employees can also initiate a request after 6 months.
              </p>
              <p>
                The employer can refuse conversion only on &ldquo;reasonable business grounds&rdquo; &mdash; for example, if the position is genuinely temporary, seasonal, or the hours will change significantly. The refusal must be in writing with reasons.
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Requesting Part-Time After Parental Leave</h3>
              <p>
                Under the NES, an employee returning from parental leave can request a change to part-time hours. The employer can only refuse on &ldquo;reasonable business grounds&rdquo; and must discuss the request in good faith. This right extends until the child reaches school age (or 18 for a child with a disability).
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Full-Time to Part-Time</h3>
              <p>
                There is no automatic right to reduce hours, but many Modern Awards and Enterprise Agreements include provisions for flexible working arrangements. Employees with 12 months&apos; service can request flexible arrangements under the NES if they are a parent, carer, over 55, experiencing domestic violence, or have a disability.
              </p>
            </section>

            {/* SECTION 7: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="casual-loading" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What exactly does the 25% casual loading cover?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    The 25% casual loading compensates for the absence of paid annual leave (4 weeks), paid personal leave (10 days), notice of termination, and redundancy pay. It is calculated on the base rate of pay under the applicable Award or agreement. Some awards specify a different loading percentage.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="conversion" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When can a casual employee become permanent?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Employers with 15 or more staff must offer casual conversion after 12 months of regular employment. Casual employees can also request conversion after 6 months. Small business employers (fewer than 15 employees) are not required to offer conversion but must respond to employee requests.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="pt-leave" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do part-time employees get the same leave as full-time?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Part-time employees receive the same <em>types</em> of leave but calculated on a pro-rata basis. For example, a part-time employee working 20 hours per week accrues annual leave at 20/38 of the full-time rate. The same principle applies to personal/carer&apos;s leave, compassionate leave, and long-service leave.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="casual-super" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do casual employees get superannuation?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Since 1 July 2022, all employees &mdash; including casuals &mdash; receive the <strong>12% Super Guarantee</strong> regardless of how much they earn per month. The previous $450/month minimum earnings threshold was removed.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="financially-better" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is casual or part-time better financially?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Casuals earn 25% loading but miss paid leave worth roughly 10&ndash;15% of salary when actually used. For ongoing regular work, part-time typically provides better overall value once leave, notice period, and redundancy protections are factored in. For short-term or irregular work, casual loading can make it more lucrative. Use the <Link href="/employment-type-calculator/" className="text-eucalyptus-dark hover:underline">Employment Type Calculator</Link> to model your specific scenario.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="fired-casual" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can a casual employee be fired without notice?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Technically, casual employment can end without notice from either party since there is no firm advance commitment. However, a casual employed for 12 months or more on a regular and systematic basis may be protected by unfair dismissal laws. The employer cannot simply stop offering shifts to avoid providing notice or redundancy pay if the worker has conversion rights.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Employment type comparisons on this page are based on the Fair Work Act 2009 (as amended), the National Employment Standards, and general Modern Award conditions. Specific entitlements may vary under individual Awards or Enterprise Agreements. Financial comparisons assume a 38-hour week and standard casual loading of 25%.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("full-time-vs-part-time-vs-casual"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Related Guides</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/employment-type-calculator/" label="Employment Type Calculator" />
                    <SidebarLink href="/leave-calculator/" label="Leave Calculator" />
                    <SidebarLink href="/award-rates/" label="Modern Award Rates" />
                    <SidebarLink href="/salary-vs-hourly/" label="Salary vs Hourly" />
                    <SidebarLink href="/overtime-pay-calculator/" label="Overtime Pay Calculator" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Compare Employment Types</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Enter your hourly rate and hours to see the real difference between full-time, part-time, and casual pay.</p>
                  <Link href="/employment-type-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Compare Now <ArrowRight className="inline h-4 w-4 ml-1" />
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

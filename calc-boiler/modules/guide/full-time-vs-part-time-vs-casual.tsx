import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { EMPLOYMENT_TYPE_GUIDE_FAQS } from "./full-time-vs-part-time-vs-casual-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";
import { EMPLOYMENT } from "@/lib/constants/australian-tax";
import { COMPASSIONATE_LEAVE } from "@/lib/constants/compassionate-leave";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import FeaturedImage from "@/components/common/featured-image";

const LOADING = formatPercent(EMPLOYMENT.casualLoading, 0);
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);

// Cost example: $30/hour base rate at full-time hours. Every figure comes from
// EMPLOYMENT, so the table follows the casual loading and leave constants.
const EX_BASE = 30;
const EX_HOURS = EMPLOYMENT.standardWeeklyHours;
const EX_CASUAL = EX_BASE * (1 + EMPLOYMENT.casualLoading);
const EX_FT_ANNUAL = EX_BASE * EX_HOURS * EMPLOYMENT.weeksPerYear;
const EX_CASUAL_ANNUAL = EX_CASUAL * EX_HOURS * EMPLOYMENT.weeksPerYear;
const EX_ANNUAL_LEAVE = EX_BASE * EX_HOURS * EMPLOYMENT.annualLeaveWeeks;
const EX_PERSONAL_LEAVE = EX_BASE * (EX_HOURS / 5) * EMPLOYMENT.personalLeaveDays;
const EX_CASUAL_LOST = EX_CASUAL * EX_HOURS * EMPLOYMENT.annualLeaveWeeks;

const SOURCES_LIST: SourceLink[] = [
  { title: "Types of employees", url: "https://www.fairwork.gov.au/starting-employment/types-of-employees", publisher: SOURCES.fwo.name },
  { title: "Casual employees", url: "https://www.fairwork.gov.au/starting-employment/types-of-employees/casual-employees", publisher: SOURCES.fwo.name },
  { title: "National Employment Standards", url: "https://www.fairwork.gov.au/employment-conditions/national-employment-standards", publisher: SOURCES.fwo.name },
  { title: "Fair Work Act 2009", url: "https://www.legislation.gov.au/C2009A00028/latest/text", publisher: "Federal Register of Legislation" },
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
            Full-Time vs Part-Time vs Casual: Entitlements Compared
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Full-time, part-time and casual employment in Australia carry different entitlements under the Fair Work Act and the modern awards. This guide compares paid leave, the {Math.round(EMPLOYMENT.casualLoading * 100)}% casual loading, notice periods, redundancy pay, super and casual conversion rights, and what each employment type gives up and gets in return. To put dollar figures on the comparison for your own rate and hours, use the <Link href="/employment-type-calculator/" className="text-eucalyptus-dark hover:underline">part-time vs full-time vs casual pay calculator</Link>.
          </p>
          <TrustBar className="!max-w-none" />
          <FeaturedImage lazy className="mb-0 mt-6" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="mv-content lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* SECTION 1: Quick Comparison Table */}
            <section id="comparison-table">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Quick Comparison Table</h2>
              <p>
                The table below compares the three main employment types (full-time, part-time and casual) under the <em>Fair Work Act 2009</em> and the National Employment Standards (NES).
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
                        <td className="px-4 py-3 border-l text-center font-bold text-eucalyptus-dark">{LOADING}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold bg-sandstone">Superannuation (SG)</td>
                        <td className="px-4 py-3 border-l text-center">{SG}</td>
                        <td className="px-4 py-3 border-l text-center">{SG}</td>
                        <td className="px-4 py-3 border-l text-center">{SG}</td>
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
                <li><strong>{SG}</strong> Super Guarantee on qualifying earnings (ordinary time earnings for most employees)</li>
              </ul>
              <p>
                <strong>Best for:</strong> Workers seeking maximum job security, full leave entitlements and predictable income. Full-time work suits anyone with a fixed financial commitment such as a mortgage.
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
                <li>Paid annual leave and paid personal/carer&apos;s leave calculated pro-rata on ordinary hours (a 20-hour/week employee gets {EMPLOYMENT.annualLeaveWeeks} weeks of paid annual leave at 20 hours a week, which is {EMPLOYMENT.annualLeaveWeeks * 20} hours a year). Compassionate leave is not pro-rata: it is the full {COMPASSIONATE_LEAVE.daysPerOccasion} days paid per occasion.</li>
                <li>Same notice of termination and redundancy pay rights as full-time</li>
                <li>Overtime rates apply when working <strong>beyond agreed hours</strong> (not just beyond 38 hours), depending on the applicable award</li>
                <li><strong>{SG}</strong> Super Guarantee on qualifying earnings (ordinary time earnings for most employees)</li>
              </ul>
              <p>
                <strong>Best for:</strong> Workers who want stability and leave entitlements but need a schedule that accommodates study, caring responsibilities, or a second job. A parent returning from parental leave can request part-time hours (see Changing Employment Type below).
              </p>
            </section>

            {/* SECTION 4: Casual */}
            <section id="casual">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Casual Employment</h2>
              <p>
                Casual employees have <strong>no firm advance commitment</strong> to continuing and indefinite work according to an agreed pattern. In return, they receive a <strong>{LOADING} casual loading</strong> on top of the base hourly rate to compensate for the absence of paid leave and other entitlements.
              </p>
              <ul>
                <li><strong>{LOADING} loading</strong> on the applicable base rate (this compensates for no annual leave, personal leave, notice period, or redundancy pay)</li>
                <li><strong>2 days unpaid</strong> carer&apos;s leave per occasion and 2 days unpaid compassionate leave</li>
                <li>No notice period required from either party to end the engagement</li>
                <li>Minimum engagement per shift of <strong>2 to 4 hours</strong> depending on the award</li>
                <li><strong>{SG}</strong> Super Guarantee on qualifying earnings (no minimum earnings threshold since 1 July 2022). A casual under 18 gets it only for a week in which they work more than 30 hours.</li>
                <li><strong>Casual conversion right:</strong> After 6 months of employment (12 months with a small business employer), a casual who believes they no longer fit the casual definition can notify their employer in writing that they want to become full-time or part-time. Since 26 August 2024 employers are no longer required to offer conversion.</li>
              </ul>
              <p>
                <strong>Best for:</strong> Workers who prioritise flexibility over stability, such as students, those between jobs, or anyone who wants the freedom to accept or decline shifts without obligation. For what the loading is worth in dollars for retail workers, see the <Link href="/retail-award-rates/">Retail Award Pay Rates {SITE_CONFIG.financialYear}</Link>.
              </p>
            </section>

            {/* SECTION 5: The Real Cost Comparison */}
            <section id="cost-comparison">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Real Cost Comparison</h2>
              <p>
                The {LOADING} casual loading lifts the hourly rate, but casuals get no paid annual leave or personal leave, so part of that extra pay covers their time off. For a worker earning <strong>{formatAUD(EX_BASE)}/hour base rate</strong> working {EX_HOURS} hours per week:
              </p>
              <div className="not-prose my-8">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-6 py-4">Component</th>
                        <th className="px-6 py-4 border-l text-right">Full-Time/Part-Time</th>
                        <th className="px-6 py-4 border-l text-right">Casual ({LOADING} loading)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Hourly rate</td>
                        <td className="px-6 py-4 border-l text-right">{formatAUD(EX_BASE, 2)}</td>
                        <td className="px-6 py-4 border-l text-right">{formatAUD(EX_CASUAL, 2)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Gross annual pay (38 hrs x 52 wks)</td>
                        <td className="px-6 py-4 border-l text-right">{formatAUD(EX_FT_ANNUAL)}</td>
                        <td className="px-6 py-4 border-l text-right">{formatAUD(EX_CASUAL_ANNUAL)}</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Paid annual leave value (4 wks)</td>
                        <td className="px-6 py-4 border-l text-right">{formatAUD(EX_ANNUAL_LEAVE)} (included)</td>
                        <td className="px-6 py-4 border-l text-right">$0 (unpaid)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Paid personal leave value (10 days)</td>
                        <td className="px-6 py-4 border-l text-right">{formatAUD(EX_PERSONAL_LEAVE)} (included)</td>
                        <td className="px-6 py-4 border-l text-right">$0 (unpaid)</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Casual takes 4 wks off (lost income)</td>
                        <td className="px-6 py-4 border-l text-right">&mdash;</td>
                        <td className="px-6 py-4 border-l text-right">&minus;{formatAUD(EX_CASUAL_LOST)}</td>
                      </tr>
                      <tr className="bg-sandstone/50 font-semibold">
                        <td className="px-6 py-4 font-semibold text-navy bg-sandstone">Effective annual value (if casual takes leave)</td>
                        <td className="px-6 py-4 border-l text-right">{formatAUD(EX_FT_ANNUAL)}</td>
                        <td className="px-6 py-4 border-l text-right">{formatAUD(EX_CASUAL_ANNUAL - EX_CASUAL_LOST)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray mt-2">Assumes casual works all 52 weeks at 38 hours before deducting leave. Actual casual advantage narrows further when sick leave usage, redundancy pay value, and notice period are included.</p>
              </div>
              <p>
                In this example the casual worker earns more gross pay. The gap narrows once the casual&apos;s unpaid leave is counted, but the casual is still ahead. Use the <Link href="/employment-type-calculator/">Employment Type Calculator</Link> to model the exact comparison for your rate and hours.
              </p>
            </section>

            {/* SECTION 6: Changing Employment Type */}
            <section id="changing-type">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Changing Employment Type</h2>
              <p>
                The Fair Work Act, the NES and the modern awards set out these pathways for changing employment type:
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Casual to Permanent Conversion</h3>
              <p>
                {/* FWO "Your guide to casual employment" (2025-03), checked 24 Sep 2026: employee choice pathway from 26 Aug 2024; 6 months (12 for small business); response within 21 days; employer "can offer or not offer". */}
                Under the Fair Work Act (as amended by the <em>Fair Work Legislation Amendment (Closing Loopholes No. 2) Act 2024</em>), the &ldquo;employee choice&rdquo; pathway replaced the old employer-offer system on <strong>26 August 2024</strong>. A casual can use this pathway after at least <strong>6 months</strong> of employment (12 months with a small business employer of fewer than 15 staff). If they believe they no longer meet the definition of a casual employee, they can notify their employer in writing that they want to change to full-time or part-time employment. Employers are no longer required to offer conversion.
              </p>
              <p>
                The employer must consult the employee and respond in writing within <strong>21 days</strong>. The employer can refuse only if the employee still meets the casual definition, or on fair and reasonable operational grounds such as the change requiring a substantial restructure of the role. A refusal must give reasons.
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Requesting Part-Time After Parental Leave</h3>
              <p>
                Under the NES, an employee returning from parental leave can request a change to part-time hours. The employer can only refuse on &ldquo;reasonable business grounds&rdquo; and must discuss the request in good faith. The employee needs at least 12 months of service with the employer, and the employer must reply in writing within 21 days. The parent category covers a child who is school age or younger. A carer under the <em>Carer Recognition Act 2010</em> is a separate category.
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Full-Time to Part-Time</h3>
              <p>
                There is no automatic right to reduce hours. Under the NES, full-time and part-time employees with at least 12 months&apos; service can request flexible working arrangements, such as fewer hours, if they: are the parent of, or care for, a child who is school age or younger; are a carer under the <em>Carer Recognition Act 2010</em>; have a disability; are 55 or older; are pregnant; are experiencing family and domestic violence; or care for or support an immediate family or household member who is experiencing family and domestic violence. A casual who meets one of these criteria can also request, after at least 12 months of regular and systematic work with a reasonable expectation that it will continue.
              </p>
            </section>

            {/* SECTION 7: FAQ */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={EMPLOYMENT_TYPE_GUIDE_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-sandstone bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-navy" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Employment type comparisons on this page are based on the Fair Work Act 2009 (as amended), the National Employment Standards, and general Modern Award conditions. Specific entitlements may vary under individual Awards or Enterprise Agreements. Financial comparisons assume a {EX_HOURS}-hour week and standard casual loading of {LOADING}.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("full-time-vs-part-time-vs-casual"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="mv-sidebar space-y-6">
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

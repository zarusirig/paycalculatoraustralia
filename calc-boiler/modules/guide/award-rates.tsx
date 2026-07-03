"use client";

import Link from "next/link";
import { ChevronRight, ExternalLink, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Awards", url: "https://www.fairwork.gov.au/employment-conditions/awards", publisher: SOURCES.fwo.name },
  { title: "Find my award", url: "https://services.fairwork.gov.au/find-my-award", publisher: SOURCES.fwo.name },
  { title: "Annual Wage Review 2024-25", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews", publisher: "Fair Work Commission" },
  { title: "National Minimum Wage Order 2025", url: "https://www.fwc.gov.au/work-conditions/minimum-wages-and-conditions/national-minimum-wage/national-minimum-wage-orders", publisher: "Fair Work Commission" },
];

export default function AwardRatesGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Award Rates Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Award Rates Australia 2025-26 — Minimum Pay by Industry &amp; Classification
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-5">
            Find current minimum award pay rates in Australia for FY2025-26. Hospitality, retail, building &amp; construction, nurses, teachers — covered by industry, with overtime, penalty rate &amp; allowance calculations.
          </p>
          <div className="rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5 mb-6">
            <p className="text-base text-navy leading-relaxed">
              <strong>Direct answer:</strong> Modern award rates set the legal minimum pay for most Australian employees. Each award has classification levels (e.g., Level 1&ndash;6) with different hourly rates. The Fair Work Commission updates rates annually on 1 July. Overtime, weekend, public holiday and shift loadings apply on top of the base rate.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            <section id="what-are-award-rates">
              <h2>What Are Award Rates in Australia?</h2>
              <p>
                Award rates are the legally enforceable minimum pay rates set out in "Modern Awards" — binding documents that cover <strong>over 2.9 million employees</strong> across more than 120 industry and occupation categories in Australia. The Fair Work Commission creates and maintains every Modern Award under the Fair Work Act 2009.
              </p>
              <p>
                A Modern Award specifies the minimum hourly rate, overtime loadings, penalty rates, allowances, and leave entitlements for each classification level within a covered industry. Retail workers, hospitality staff, nurses, construction labourers, and clerical employees all fall under different awards with different base rates. An employer who pays below the applicable award rate commits wage theft — a criminal offence in Victoria, Queensland, and South Australia carrying fines of up to <strong>$1.1 million for corporations</strong> and <strong>$220,000 for individuals</strong>.
              </p>
              <p>
                Award rates function as the middle tier of Australia&apos;s 3-layer safety net. The National Minimum Wage sits at the bottom, Modern Awards sit in the middle, and Enterprise Agreements sit at the top. If no award or agreement applies, the "National Employment Standards" (NES) and the national minimum wage protect the worker. Use our <Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> to convert your award rate into an after-tax hourly figure for FY2025-26.
              </p>
            </section>

            <section id="how-are-award-rates-determined">
              <h2>How Are Award Rates Determined?</h2>
              <p>
                The Fair Work Commission (FWC) determines all award rates through the "Annual Wage Review" — a formal process completed every June, with new rates taking effect from the first full pay period on or after <strong>1 July</strong> each year. The FWC is an independent statutory body, separate from the government, that assesses economic data, employer submissions, and union proposals before issuing its decision.
              </p>
              <p>
                The Annual Wage Review considers 5 key factors: the performance of the national economy, the consumer price index (CPI), labour productivity growth, the needs of low-paid workers, and the competitiveness of Australian businesses. In its 2024-25 review, the FWC considered submissions from the Australian Council of Trade Unions (ACTU), the Australian Industry Group (Ai Group), and the Australian Chamber of Commerce and Industry (ACCI) before announcing a <strong>3.75% increase</strong> to all modern award minimum wages.
              </p>
              <p>
                This percentage increase applies uniformly to every classification level within every award. A Level 1 retail worker and a Level 5 hospitality supervisor both receive the same 3.75% uplift on their respective base rates. The FWC publishes updated pay guides for each of the 120+ awards within 2 weeks of its decision. Employers must implement the new rates from 1 July or face back-pay obligations and potential penalties from the Fair Work Ombudsman.
              </p>
            </section>

            <section id="national-minimum-wage">
              <h2>What Is the National Minimum Wage for FY2025-26?</h2>
              <p>
                The national minimum wage for FY2025-26 is <strong>$24.10 per hour</strong>, or <strong>$915.91 per week</strong> for a standard 38-hour week. This rate applies only to employees who are not covered by any Modern Award or enterprise agreement — typically senior managers, highly specialised professionals, or niche roles outside standard industry classifications.
              </p>
              <p>
                The national minimum wage translates to an annual salary of approximately <strong>$47,627</strong> before tax. After income tax, the Medicare levy, and superannuation at the employer SG rate of <strong>12%</strong>, a worker on the national minimum wage takes home roughly <strong>$41,100 per year</strong> (about <strong>$790 per week</strong>). Use our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to model the exact take-home pay at any salary level for FY2025-26.
              </p>

              <div className="bg-sandstone border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div className="flex items-start gap-4">
                  <ShieldAlert className="h-6 w-6 text-ochre mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-base font-bold text-navy mb-1">Wage Theft Alert</h3>
                    <p className="text-navy text-sm mb-3">If you work in a cafe and your boss tries to pay you the National Minimum Wage instead of the higher Hospitality Industry (General) Award wage, they are breaking the law. Award rules always override the base NMW. Report underpayment to the Fair Work Ombudsman on 13 13 94.</p>
                  </div>
                </div>
              </div>

              <h3>National Minimum Wage vs Award Rates</h3>
              <p>
                The national minimum wage is the absolute floor — no adult employee in Australia earns less than <strong>$24.10/hr</strong>. Award wages for specific industries sit above this floor because they recognise industry-specific skills, qualifications, and working conditions. A Level 1 retail worker under the General Retail Industry Award earns <strong>$25.44/hr</strong>, while a qualified chef under the Hospitality Industry Award earns <strong>$27.72/hr</strong> — both higher than the national minimum.
              </p>
              <p>
                Casual employees receive an additional <strong>25% casual loading</strong> on top of the applicable base rate (award or NMW). This loading compensates for the absence of paid annual leave, personal leave, and notice of termination. A casual worker on the national minimum wage earns <strong>$30.13/hr</strong> ($24.10 x 1.25). Check how casual loading affects your overall pay using our <Link href="/hourly-to-annual-salary-calculator/">Hourly to Annual Salary Calculator</Link>.
              </p>
            </section>

            <section id="common-award-rates-table">
              <h2>What Are the Most Common Award Rates?</h2>
              <p>
                Australia has <strong>122 Modern Awards</strong> in operation. The 10 awards listed below cover the largest number of employees and represent the most frequently searched award rates for FY2025-26. All rates shown are base hourly rates for a full-time adult employee at the entry-level classification (Level 1).
              </p>

              <h3>Common Awards Quick-Reference (by Industry &amp; Code)</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-4">Modern Award</th>
                        <th className="px-5 py-4">Code</th>
                        <th className="px-5 py-4">Typical Industry</th>
                        <th className="px-5 py-4">Find My Award</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">General Retail Industry Award</td><td className="px-5 py-3 font-mono text-xs">MA000004</td><td className="px-5 py-3">Retail &amp; shop assistants</td><td className="px-5 py-3"><a href="https://calculate.fairwork.gov.au/FindYourAward" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark">Look up &rarr;</a></td></tr>
                      <tr><td className="px-5 py-3">Hospitality Industry (General) Award</td><td className="px-5 py-3 font-mono text-xs">MA000009</td><td className="px-5 py-3">Cafes, restaurants, pubs, hotels</td><td className="px-5 py-3"><a href="https://calculate.fairwork.gov.au/FindYourAward" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark">Look up &rarr;</a></td></tr>
                      <tr><td className="px-5 py-3">Building and Construction General On-site Award</td><td className="px-5 py-3 font-mono text-xs">MA000020</td><td className="px-5 py-3">Building &amp; construction</td><td className="px-5 py-3"><a href="https://calculate.fairwork.gov.au/FindYourAward" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark">Look up &rarr;</a></td></tr>
                      <tr><td className="px-5 py-3">Nurses Award</td><td className="px-5 py-3 font-mono text-xs">MA000034</td><td className="px-5 py-3">Nurses &amp; midwives</td><td className="px-5 py-3"><a href="https://calculate.fairwork.gov.au/FindYourAward" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark">Look up &rarr;</a></td></tr>
                      <tr><td className="px-5 py-3">Educational Services (Teachers) Award</td><td className="px-5 py-3 font-mono text-xs">MA000077</td><td className="px-5 py-3">Teachers (non-government schools)</td><td className="px-5 py-3"><a href="https://calculate.fairwork.gov.au/FindYourAward" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark">Look up &rarr;</a></td></tr>
                      <tr><td className="px-5 py-3">Manufacturing and Associated Industries Award</td><td className="px-5 py-3 font-mono text-xs">MA000010</td><td className="px-5 py-3">Manufacturing &amp; metals</td><td className="px-5 py-3"><a href="https://calculate.fairwork.gov.au/FindYourAward" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark">Look up &rarr;</a></td></tr>
                      <tr><td className="px-5 py-3">Mining Industry Award</td><td className="px-5 py-3 font-mono text-xs">MA000011</td><td className="px-5 py-3">Mining &amp; resources</td><td className="px-5 py-3"><a href="https://calculate.fairwork.gov.au/FindYourAward" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark">Look up &rarr;</a></td></tr>
                      <tr><td className="px-5 py-3">Clerks &mdash; Private Sector Award</td><td className="px-5 py-3 font-mono text-xs">MA000002</td><td className="px-5 py-3">Office &amp; administration</td><td className="px-5 py-3"><a href="https://calculate.fairwork.gov.au/FindYourAward" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark">Look up &rarr;</a></td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray-light mt-2">Codes are issued by the Fair Work Commission. Verify your exact award and classification at fairwork.gov.au.</p>
              </div>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-4">Modern Award</th>
                        <th className="px-5 py-4">Level 1 Base Rate</th>
                        <th className="px-5 py-4">Casual Rate (incl. 25%)</th>
                        <th className="px-5 py-4">Workers Covered</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">General Retail Industry Award</td><td className="px-5 py-3 font-medium">$25.44/hr</td><td className="px-5 py-3">$31.80/hr</td><td className="px-5 py-3">~520,000</td></tr>
                      <tr><td className="px-5 py-3">Hospitality Industry (General) Award</td><td className="px-5 py-3 font-medium">$25.44/hr</td><td className="px-5 py-3">$31.80/hr</td><td className="px-5 py-3">~390,000</td></tr>
                      <tr><td className="px-5 py-3">Fast Food Industry Award</td><td className="px-5 py-3 font-medium">$25.44/hr</td><td className="px-5 py-3">$31.80/hr</td><td className="px-5 py-3">~280,000</td></tr>
                      <tr><td className="px-5 py-3">Clerks &mdash; Private Sector Award</td><td className="px-5 py-3 font-medium">$25.44/hr</td><td className="px-5 py-3">$31.80/hr</td><td className="px-5 py-3">~260,000</td></tr>
                      <tr><td className="px-5 py-3">Social, Community, Home Care and Disability Services Award (SCHADS)</td><td className="px-5 py-3 font-medium">$26.68/hr</td><td className="px-5 py-3">$33.35/hr</td><td className="px-5 py-3">~240,000</td></tr>
                      <tr><td className="px-5 py-3">Building and Construction General On-site Award</td><td className="px-5 py-3 font-medium">$26.15/hr</td><td className="px-5 py-3">$32.69/hr</td><td className="px-5 py-3">~200,000</td></tr>
                      <tr><td className="px-5 py-3">Health Professionals and Support Services Award</td><td className="px-5 py-3 font-medium">$25.44/hr</td><td className="px-5 py-3">$31.80/hr</td><td className="px-5 py-3">~190,000</td></tr>
                      <tr><td className="px-5 py-3">Cleaning Services Award</td><td className="px-5 py-3 font-medium">$25.44/hr</td><td className="px-5 py-3">$31.80/hr</td><td className="px-5 py-3">~170,000</td></tr>
                      <tr><td className="px-5 py-3">Children&apos;s Services Award</td><td className="px-5 py-3 font-medium">$25.86/hr</td><td className="px-5 py-3">$32.33/hr</td><td className="px-5 py-3">~150,000</td></tr>
                      <tr><td className="px-5 py-3">Manufacturing and Associated Industries Award</td><td className="px-5 py-3 font-medium">$25.44/hr</td><td className="px-5 py-3">$31.80/hr</td><td className="px-5 py-3">~140,000</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray-light mt-2">Rates reflect the FY2025-26 Annual Wage Review increase. Higher classification levels within each award attract higher rates. Verify your exact classification at fairwork.gov.au.</p>
              </div>
              <p>
                Many of the Level 1 entry rates align at <strong>$25.44/hr</strong> because the FWC applies the Annual Wage Review percentage uniformly. Higher classification levels — reflecting qualifications, supervisory duties, or years of experience — attract progressively higher rates. A Level 4 retail worker, for example, earns approximately <strong>$28.18/hr</strong>, while a Level 6 hospitality employee earns approximately <strong>$29.54/hr</strong>.
              </p>
            </section>

            <section id="what-does-an-award-cover">
              <h2>What Does a Modern Award Cover?</h2>
              <p>
                A Modern Award covers <strong>13 categories</strong> of employment conditions beyond the base hourly rate. These are legally binding minimum standards that employers cannot contract out of, reduce, or trade away without a formal enterprise agreement that passes the "Better Off Overall Test."
              </p>
              <ul>
                <li><strong>Penalty Rates:</strong> Multipliers of 1.25x to 2.5x the base rate for work on Saturdays, Sundays, public holidays, and evening or night shifts.</li>
                <li><strong>Overtime Rates:</strong> Typically 1.5x for the first 2 hours and 2.0x thereafter for hours worked beyond the standard 38-hour week. Use our <Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> to compute exact figures.</li>
                <li><strong>Allowances:</strong> Industry-specific payments for uniforms, tools, travel, first aid duties, meal breaks, and hazardous conditions — ranging from <strong>$1.20 to $45+</strong> per shift depending on the award.</li>
                <li><strong>Classifications:</strong> Structured tiers (Level 1 through Level 6 or higher) that set minimum rates based on experience, qualifications, and supervisory responsibility.</li>
                <li><strong>Hours of Work:</strong> Maximum ordinary hours per week (38 hours), spread of hours provisions, and roster change notice periods.</li>
                <li><strong>Leave Entitlements:</strong> Annual leave (4 weeks), personal/carer&apos;s leave (10 days), compassionate leave (2 days), and long service leave (as per state legislation).</li>
                <li><strong>Superannuation:</strong> Confirmation that the employer SG rate of <strong>12%</strong> for FY2025-26 applies on top of ordinary time earnings.</li>
                <li><strong>Termination and Redundancy:</strong> Notice periods of 1 to 5 weeks based on tenure, plus redundancy pay of 4 to 16 weeks for eligible employees.</li>
              </ul>
            </section>

            <section id="penalty-rates-explained">
              <h2>How Do Penalty Rates Work?</h2>
              <p>
                Penalty rates are mandatory pay multipliers that increase your base hourly rate when you work outside standard Monday-to-Friday daytime hours. The FWC sets these multipliers within each Modern Award to compensate employees for working at unsociable times — weekends, public holidays, early mornings, and late nights.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-4">When You Work</th>
                        <th className="px-5 py-4">Full-Time / Part-Time</th>
                        <th className="px-5 py-4">Casual</th>
                        <th className="px-5 py-4">Example on $25.44/hr</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Monday &ndash; Friday (standard)</td><td className="px-5 py-3 font-medium">1.0x</td><td className="px-5 py-3 font-medium">1.25x</td><td className="px-5 py-3">$25.44 / $31.80</td></tr>
                      <tr><td className="px-5 py-3">Saturday</td><td className="px-5 py-3 font-medium">1.25x</td><td className="px-5 py-3 font-medium">1.5x</td><td className="px-5 py-3">$31.80 / $38.16</td></tr>
                      <tr><td className="px-5 py-3">Sunday</td><td className="px-5 py-3 font-medium">1.5x</td><td className="px-5 py-3 font-medium">1.75x</td><td className="px-5 py-3">$38.16 / $44.52</td></tr>
                      <tr><td className="px-5 py-3">Public Holiday</td><td className="px-5 py-3 font-medium">2.25x</td><td className="px-5 py-3 font-medium">2.5x</td><td className="px-5 py-3">$57.24 / $63.60</td></tr>
                      <tr><td className="px-5 py-3">Evening Shift (after 6pm)</td><td className="px-5 py-3 font-medium">1.15x &ndash; 1.25x</td><td className="px-5 py-3 font-medium">1.4x &ndash; 1.5x</td><td className="px-5 py-3">$29.26 &ndash; $31.80</td></tr>
                      <tr><td className="px-5 py-3">Overtime (first 2 hrs)</td><td className="px-5 py-3 font-medium">1.5x</td><td className="px-5 py-3 font-medium">1.5x</td><td className="px-5 py-3">$38.16</td></tr>
                      <tr><td className="px-5 py-3">Overtime (after 2 hrs)</td><td className="px-5 py-3 font-medium">2.0x</td><td className="px-5 py-3 font-medium">2.0x</td><td className="px-5 py-3">$50.88</td></tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray-light mt-2">Rates shown are indicative for the General Retail Industry Award. Exact multipliers vary between awards. Casual rates include the 25% casual loading.</p>
              </div>
              <p>
                Penalty rate multipliers differ between awards. The Hospitality Industry Award applies a Sunday rate of <strong>1.5x</strong> for permanent staff, while the Nurses Award applies <strong>1.75x</strong>. The Fast Food Industry Award sets Saturday penalties at <strong>1.25x</strong>, while the Pharmacy Industry Award applies <strong>1.5x</strong> for Saturdays. Always check the specific award covering your role. For a detailed breakdown of overtime calculations, see our <Link href="/overtime-penalty-rates-guide/">Overtime and Penalty Rates Guide</Link>.
              </p>

              <h3>How Are Penalty Rates Calculated?</h3>
              <p>
                The calculation is straightforward: multiply your base hourly rate by the applicable penalty multiplier. A Level 1 retail worker earning <strong>$25.44/hr</strong> who works an 8-hour shift on a public holiday earns $25.44 x 2.25 = <strong>$57.24/hr</strong>, totalling <strong>$457.92</strong> for the shift. Casual employees on the same shift earn $25.44 x 2.5 = <strong>$63.60/hr</strong>, totalling <strong>$508.80</strong> for 8 hours.
              </p>
            </section>

            <section id="award-vs-enterprise-agreement">
              <h2>What Is the Difference Between an Award Rate and an Enterprise Agreement?</h2>
              <p>
                An award rate is a minimum standard set by the Fair Work Commission that applies across an entire industry, while an enterprise agreement (EA) is a private deal negotiated between a single employer and its workforce. Enterprise agreements replace the underlying Modern Award but must pass the <strong>"Better Off Overall Test" (BOOT)</strong> — every employee must be demonstrably better off under the EA than they would be under the award.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-4">Feature</th>
                        <th className="px-5 py-4">Modern Award</th>
                        <th className="px-5 py-4">Enterprise Agreement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">Coverage</td><td className="px-5 py-3">Entire industry (e.g., all retail workers)</td><td className="px-5 py-3">Single employer or group of employers</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Set By</td><td className="px-5 py-3">Fair Work Commission</td><td className="px-5 py-3">Employer + employees (often via union)</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Base Rates</td><td className="px-5 py-3">Minimum floor rates</td><td className="px-5 py-3">Typically higher than award</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Penalty Rates</td><td className="px-5 py-3">Fixed multipliers per award</td><td className="px-5 py-3">Can differ (must pass BOOT)</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Duration</td><td className="px-5 py-3">Ongoing (updated annually)</td><td className="px-5 py-3">Maximum 4 years, then renegotiated</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Flexibility</td><td className="px-5 py-3">Standardised across industry</td><td className="px-5 py-3">Tailored to specific workplace</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Examples</td><td className="px-5 py-3">General Retail Industry Award</td><td className="px-5 py-3">Woolworths EA, BHP EA, Qantas EA</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Large employers including Coles, Woolworths, BHP, and Qantas operate under enterprise agreements. These agreements often provide higher base rates, additional leave, or bonus structures in exchange for modified penalty rates or shift arrangements. The FWC must approve every EA before it takes effect. If an EA expires and is not replaced, the underlying Modern Award revives automatically. Understanding your employment arrangement affects your take-home pay — use our <Link href="/contractor-vs-employee-calculator/">Contractor vs Employee Calculator</Link> to compare different work structures.
              </p>
            </section>

            <section id="how-to-find-your-award">
              <h2>How Do You Find Your Award?</h2>
              <p>
                The Fair Work Ombudsman&apos;s "Find My Award" tool identifies your applicable Modern Award in <strong>under 2 minutes</strong> by asking 4 questions about your industry, occupation, employer type, and job duties. This is the only legally authoritative source for determining your award coverage.
              </p>
              <p>
                Follow these 5 steps to identify your exact award and classification level:
              </p>
              <ol>
                <li>Visit the Fair Work &quot;Find My Award&quot; tool at <strong>calculate.fairwork.gov.au/FindYourAward</strong></li>
                <li>Select your industry from the dropdown list (e.g., Retail, Hospitality, Construction, Healthcare)</li>
                <li>Answer the follow-up questions about your specific role, duties, and employer type</li>
                <li>Review the award name and classification level the tool assigns to your role</li>
                <li>Download the full pay guide PDF for your award — it lists every classification rate, penalty rate, and allowance</li>
              </ol>
              <p>
                If the tool cannot determine your award, you are likely &quot;award-free&quot; — covered only by the National Employment Standards and the national minimum wage. Approximately <strong>21% of Australian employees</strong> fall outside award coverage, either because they work under enterprise agreements or because their role sits above award classification levels. To understand what appears on your pay statement, read our <Link href="/understanding-your-payslip/">Understanding Your Payslip</Link> guide.
              </p>

              <div className="not-prose mt-6">
                <a
                  href="https://calculate.fairwork.gov.au/FindYourAward"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-eucalyptus-dark hover:bg-navy"
                >
                  Use Fair Work &apos;Find My Award&apos; Tool
                  <ExternalLink className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </section>

            {/* --- CONTEXT BORDER --- */}

            <section id="what-changed-fy2025-26">
              <h2>What Changed in FY2025-26?</h2>
              <p>
                The FY2025-26 Annual Wage Review delivered a <strong>3.75% increase</strong> to all Modern Award minimum wages and the national minimum wage, effective from the first full pay period on or after 1 July 2025. This is the third consecutive year of above-inflation award increases following the 5.75% increase in 2023-24 and the 3.75% increase in 2024-25.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-4">Financial Year</th>
                        <th className="px-5 py-4">Award Increase</th>
                        <th className="px-5 py-4">NMW (Hourly)</th>
                        <th className="px-5 py-4">NMW (Weekly)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">FY2022-23</td><td className="px-5 py-3">5.2%</td><td className="px-5 py-3">$21.38</td><td className="px-5 py-3">$812.60</td></tr>
                      <tr><td className="px-5 py-3">FY2023-24</td><td className="px-5 py-3">5.75%</td><td className="px-5 py-3">$23.23</td><td className="px-5 py-3">$882.80</td></tr>
                      <tr><td className="px-5 py-3">FY2024-25</td><td className="px-5 py-3">3.75%</td><td className="px-5 py-3">$24.10</td><td className="px-5 py-3">$915.91</td></tr>
                      <tr><td className="px-5 py-3">FY2025-26</td><td className="px-5 py-3">3.5%</td><td className="px-5 py-3">$24.95</td><td className="px-5 py-3">$948.00</td></tr>
                      <tr className="bg-eucalyptus/5 font-medium"><td className="px-5 py-3">FY2026-27</td><td className="px-5 py-3">6%</td><td className="px-5 py-3">$26.44</td><td className="px-5 py-3">$1,004.90</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3>Key Changes Beyond the Rate Increase</h3>
              <ul>
                <li><strong>FY2026-27 update:</strong> Rates have since risen again — see our news coverage of the <Link href="/news/minimum-wage-increase-july-2026/">minimum wage increase from 1 July 2026</Link> and the <Link href="/news/award-wage-increase-2026-industries/">4.75% award wage increase</Link> applied to modern awards this financial year.</li>
                <li><strong>Superannuation Guarantee:</strong> The SG rate rose from 11.5% to <strong>12%</strong> on 1 July 2025, increasing the total cost of employing award-covered workers. See our <Link href="/superannuation-calculator/">Superannuation Calculator</Link> for exact figures.</li>
                <li><strong>Casual Conversion:</strong> The right for casuals to request conversion to permanent employment after 12 months continues to apply across all Modern Awards.</li>
                <li><strong>Right to Disconnect:</strong> Employees covered by Modern Awards gained the right to refuse contact outside working hours from 26 August 2024, with small business exemptions ending 26 August 2025.</li>
                <li><strong>Wage Theft Criminalisation:</strong> Federal wage theft laws commenced 1 January 2025, making intentional underpayment of award rates a criminal offence carrying penalties of up to <strong>10 years imprisonment</strong>.</li>
              </ul>
            </section>

            <section id="worked-example">
              <h2>How Is Award Pay Calculated? (Worked Example)</h2>
              <p>
                Award pay is calculated by multiplying the base classification rate by hours worked, then adding applicable penalty rates, overtime, and allowances. Below is a worked example for a Level 1 casual retail worker earning <strong>$31.80/hr</strong> (base $25.44 + 25% casual loading) who works a mixed weekly roster.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-navy">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-4">Day</th>
                        <th className="px-5 py-4">Hours</th>
                        <th className="px-5 py-4">Rate Applied</th>
                        <th className="px-5 py-4">Gross Pay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Monday</td><td className="px-5 py-3">8 hrs</td><td className="px-5 py-3">$31.80 (casual base)</td><td className="px-5 py-3">$254.40</td></tr>
                      <tr><td className="px-5 py-3">Wednesday</td><td className="px-5 py-3">8 hrs</td><td className="px-5 py-3">$31.80 (casual base)</td><td className="px-5 py-3">$254.40</td></tr>
                      <tr><td className="px-5 py-3">Saturday</td><td className="px-5 py-3">6 hrs</td><td className="px-5 py-3">$38.16 (casual Sat 1.5x)</td><td className="px-5 py-3">$228.96</td></tr>
                      <tr><td className="px-5 py-3">Sunday</td><td className="px-5 py-3">5 hrs</td><td className="px-5 py-3">$44.52 (casual Sun 1.75x)</td><td className="px-5 py-3">$222.60</td></tr>
                      <tr className="bg-eucalyptus/5 font-bold"><td className="px-5 py-3">Weekly Total</td><td className="px-5 py-3">27 hrs</td><td className="px-5 py-3">&mdash;</td><td className="px-5 py-3">$960.36</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                This casual retail worker earns <strong>$960.36 gross</strong> for 27 hours of work — an effective average rate of <strong>$35.57/hr</strong>. After PAYG withholding tax and the Medicare levy, the worker&apos;s take-home pay is approximately <strong>$870 per week</strong>. The employer also pays <strong>$115.24</strong> in superannuation contributions on top (12% of $960.36). Use our <Link href="/weekly-pay-calculator/">Weekly Pay Calculator</Link> to model different shift combinations.
              </p>
            </section>

            <section id="related-resources">
              <h2>Related Resources</h2>
              <p>
                Explore these Australian tax calculators and payroll guides to understand how your award rate translates into take-home pay, superannuation, and tax obligations for the 2025-26 financial year.
              </p>
              <ul>
                <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> — Convert your gross award rate into net pay after income tax, Medicare levy, and HECS-HELP deductions.</li>
                <li><Link href="/superannuation-guide/">Superannuation Guide</Link> — Understand how the 12% SG rate applies on top of your award earnings and how to maximise your super.</li>
                <li><Link href="/overtime-penalty-rates-guide/">Overtime and Penalty Rates Guide</Link> — Detailed breakdown of overtime calculations, shift loadings, and penalty rate entitlements by award.</li>
                <li><Link href="/annual-leave-guide/">Annual Leave Guide</Link> — Leave loading, leave accrual rates, and how annual leave interacts with your award classification.</li>
                <li><Link href="/redundancy-pay-calculator/">Redundancy Pay Calculator</Link> — Calculate your NES redundancy entitlements based on years of continuous service.</li>
                <li><Link href="/payg-withholding-tables/">PAYG Withholding Tables</Link> — Check the exact amount of income tax your employer withholds from your award wages each pay cycle.</li>
              </ul>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="what-is" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is an Award in Australia?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    A Modern Award is a legally binding document issued by the Fair Work Commission that sets the minimum pay rates, penalty rates, allowances, overtime, and leave entitlements for employees in a specific industry or occupation. Over <strong>120 Modern Awards</strong> cover approximately <strong>2.9 million workers</strong> across industries including retail, hospitality, construction, healthcare, and manufacturing.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="nmw" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Are Award rates higher than the National Minimum Wage?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. The national minimum wage of <strong>$24.10/hr</strong> is the absolute floor for award-free employees. Award classification rates for specific industries are almost always higher because they recognise qualifications, experience levels, and industry-specific skills. Entry-level rates under most major awards start at <strong>$25.44/hr</strong> or above, and higher classification levels reach <strong>$30+/hr</strong>.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="casual" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is casual loading and how much is it?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Casual loading is an additional <strong>25%</strong> applied on top of the base award rate for casual employees. This loading compensates for not receiving paid annual leave, personal leave, notice of termination, or redundancy pay. A casual worker on a base rate of $25.44/hr receives <strong>$31.80/hr</strong> inclusive of the casual loading. The 25% rate is standardised across all Modern Awards.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="annual-review" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">When do Award rates increase each year?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Award rates increase annually following the Fair Work Commission&apos;s Annual Wage Review. The FWC announces its decision in June, and new rates take effect from the first full pay period on or after <strong>1 July</strong>. The FY2025-26 increase was <strong>3.75%</strong>. Employers must update their payroll systems to reflect new rates immediately upon commencement.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="how-find" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I find which Award covers my job?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Use the Fair Work Ombudsman&apos;s &quot;Find My Award&quot; tool at <strong>calculate.fairwork.gov.au/FindYourAward</strong>. Enter your industry, occupation, and employer type, and the tool identifies your applicable Modern Award and classification level within 2 minutes. You can also call the Fair Work Infoline on <strong>13 13 94</strong> for personalised assistance.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="underpaid" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What happens if my employer pays below the Award rate?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Paying below the applicable award rate constitutes wage theft, which became a federal criminal offence on <strong>1 January 2025</strong>. Intentional underpayment carries penalties of up to <strong>$1.1 million for corporations</strong>, <strong>$220,000 for individuals</strong>, and up to <strong>10 years imprisonment</strong> for the most serious cases. Report suspected underpayment to the Fair Work Ombudsman. Employees can also recover unpaid wages for up to <strong>6 years</strong> through the Federal Circuit Court.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="eba-vs-award" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can an Enterprise Agreement pay less than an Award?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. Every enterprise agreement must pass the Fair Work Commission&apos;s <strong>&quot;Better Off Overall Test&quot; (BOOT)</strong> before it takes effect. The BOOT requires that each employee covered by the agreement is better off overall compared to the applicable Modern Award. An EA can modify individual conditions (e.g., different penalty rate structures) only if the total package leaves workers no worse off.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="penalty-weekends" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do penalty rates still apply on weekends?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Weekend penalty rates remain a legally enforceable part of all Modern Awards. Saturday rates typically range from <strong>1.25x to 1.5x</strong> the base rate, and Sunday rates range from <strong>1.5x to 2.0x</strong> depending on the specific award and employment type (casual, part-time, or full-time). Public holiday rates reach up to <strong>2.5x</strong> for casual employees.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="super-on-award" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is superannuation included in Award rates?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    No. The superannuation guarantee of <strong>12%</strong> for FY2025-26 is paid by the employer on top of award wages — it is not deducted from the employee&apos;s gross pay. The SG applies to &quot;ordinary time earnings,&quot; which includes the base rate and any shift loadings but typically excludes overtime payments. Employers pay super quarterly, within 28 days of each quarter&apos;s end.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="junior-rates" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do junior employees receive lower Award rates?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Yes. Most Modern Awards specify junior rates as a percentage of the adult base rate. Employees under 21 receive reduced rates: typically <strong>50% at age 16</strong>, <strong>60% at age 17</strong>, <strong>70% at age 18</strong>, <strong>80% at age 19</strong>, and <strong>90% at age 20</strong>. Full adult rates apply from age 21. Some awards, particularly in hospitality and retail, do not differentiate by age for all classification levels.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="award-free" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What if no Award covers my job?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Approximately <strong>21% of Australian employees</strong> are &quot;award-free&quot; — not covered by any Modern Award or enterprise agreement. These workers are still protected by the <strong>National Employment Standards</strong> (10 minimum entitlements) and cannot be paid below the national minimum wage of <strong>$24.10/hr</strong>. Common award-free roles include senior managers, specialised professionals, and some agricultural workers.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="tax-on-award" className="border rounded-lg px-4 bg-sandstone bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much tax do I pay on Award wages?</AccordionTrigger>
                  <AccordionContent className="text-navy">
                    Income tax on award wages follows the same marginal tax brackets as all other employment income. A full-time worker on the Level 1 retail award rate of $25.44/hr earns approximately <strong>$50,271 annually</strong>, placing them in the <strong>30% marginal tax bracket</strong> for FY2025-26. After income tax and the 2% Medicare levy, the take-home pay is approximately <strong>$42,200 per year</strong>. Use the Australian tax calculator on this site to model your exact after-tax position.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Award rate information on this page is sourced from Fair Work Commission data and reflects the most recent Annual Wage Review. Modern Award minimum rates are updated annually, typically effective from the first full pay period on or after 1 July each year. All rates, penalty multipliers, and entitlements shown are for FY2025-26 and apply to national system employees. State public sector employees may be covered by separate state industrial instruments.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("award-rates"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3 block">Calculator Suite</h3>
                  <div className="space-y-3">
                    <Link href="/hourly-to-annual-salary-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Hourly to Salary Calc</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/understanding-your-payslip/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Payslip Checker</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/weekly-pay-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Weekly Pay Calculator</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                    <Link href="/contractor-vs-employee-calculator/" className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Contractor vs Employee</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Check your hourly NET</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Once you find your legal base rate from Fair Work, calculate how much you actually take home after tax.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Check Base Rate
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

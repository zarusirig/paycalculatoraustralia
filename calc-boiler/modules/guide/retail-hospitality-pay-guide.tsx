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
  { title: "General Retail Industry Award", url: "https://services.fairwork.gov.au/find-my-award", publisher: SOURCES.fwo.name },
  { title: "Hospitality Industry Award", url: "https://services.fairwork.gov.au/find-my-award", publisher: SOURCES.fwo.name },
];

export default function RetailHospitalityPayGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Retail &amp; Hospitality Pay Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Retail &amp; Hospitality Pay Guide — Award Rates, Penalties &amp; Your Rights
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Retail and hospitality are two of Australia&apos;s largest employers, covering over 2 million workers. Both industries are governed by Modern Awards that set minimum pay rates, casual loading, penalty rates, and working conditions. This guide covers the General Retail Industry Award (MA000004) and the Hospitality Industry Award (MA000009) in detail.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ── Section 1: General Retail Industry Award ── */}
            <section id="retail-award">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>General Retail Industry Award (MA000004)</h2>
              <p>
                The General Retail Industry Award covers employees working in retail stores, including supermarkets, clothing stores, electronics retailers, and specialty shops. It sets minimum pay rates based on classification level, employment type, and age. The award applies to approximately <strong>1.2 million workers</strong> across Australia.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Full-Time &amp; Part-Time Base Rates</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Level</th>
                        <th className="px-5 py-3">Description</th>
                        <th className="px-5 py-3 text-right">Hourly Rate</th>
                        <th className="px-5 py-3 text-right">Annual (38 hrs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">Level 1</td><td className="px-5 py-3">Retail worker (general duties)</td><td className="px-5 py-3 text-right">$25.44</td><td className="px-5 py-3 text-right">$50,271</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Level 2</td><td className="px-5 py-3">Experienced retail worker</td><td className="px-5 py-3 text-right">$26.01</td><td className="px-5 py-3 text-right">$51,396</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Level 3</td><td className="px-5 py-3">Supervisor / team leader</td><td className="px-5 py-3 text-right">$26.84</td><td className="px-5 py-3 text-right">$53,035</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Casual Rates (+25% Loading)</h3>
              <p>
                Casual employees receive a <strong>25% loading</strong> on top of the base hourly rate to compensate for the absence of paid leave and job security. A Level 1 casual retail worker earns <strong>$31.80 per hour</strong> ($25.44 + 25%). See our <Link href="/employment-type-calculator/">Employment Type Calculator</Link> to compare casual vs full-time total remuneration.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Junior Rates by Age</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Age</th>
                        <th className="px-5 py-3 text-right">% of Adult Rate</th>
                        <th className="px-5 py-3 text-right">Hourly Rate (Level 1)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Under 16</td><td className="px-5 py-3 text-right">45%</td><td className="px-5 py-3 text-right">$11.45</td></tr>
                      <tr><td className="px-5 py-3">16 years</td><td className="px-5 py-3 text-right">50%</td><td className="px-5 py-3 text-right">$12.72</td></tr>
                      <tr><td className="px-5 py-3">17 years</td><td className="px-5 py-3 text-right">60%</td><td className="px-5 py-3 text-right">$15.26</td></tr>
                      <tr><td className="px-5 py-3">18 years</td><td className="px-5 py-3 text-right">70%</td><td className="px-5 py-3 text-right">$17.81</td></tr>
                      <tr><td className="px-5 py-3">19 years</td><td className="px-5 py-3 text-right">80%</td><td className="px-5 py-3 text-right">$20.35</td></tr>
                      <tr><td className="px-5 py-3">20 years</td><td className="px-5 py-3 text-right">90%</td><td className="px-5 py-3 text-right">$22.90</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* ── Section 2: Hospitality Industry Award ── */}
            <section id="hospitality-award">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Hospitality Industry Award (MA000009)</h2>
              <p>
                The Hospitality Industry (General) Award covers employees in restaurants, cafes, hotels, motels, catering operations, and bars. It has 6 classification levels ranging from introductory (kitchen hand, food runner) to advanced (head chef, restaurant manager).
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Full-Time &amp; Part-Time Base Rates</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Level</th>
                        <th className="px-5 py-3">Example Roles</th>
                        <th className="px-5 py-3 text-right">Hourly Rate</th>
                        <th className="px-5 py-3 text-right">Annual (38 hrs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3 font-medium">Level 1</td><td className="px-5 py-3">Kitchen hand, food runner</td><td className="px-5 py-3 text-right">$24.10</td><td className="px-5 py-3 text-right">$47,622</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Level 2</td><td className="px-5 py-3">Waiter, bar attendant</td><td className="px-5 py-3 text-right">$25.09</td><td className="px-5 py-3 text-right">$49,578</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Level 3</td><td className="px-5 py-3">Cook (qualified), senior waiter</td><td className="px-5 py-3 text-right">$25.99</td><td className="px-5 py-3 text-right">$51,356</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Level 4</td><td className="px-5 py-3">Cook (trade qualified)</td><td className="px-5 py-3 text-right">$27.27</td><td className="px-5 py-3 text-right">$53,885</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Level 5</td><td className="px-5 py-3">Chef, sous chef</td><td className="px-5 py-3 text-right">$28.46</td><td className="px-5 py-3 text-right">$56,237</td></tr>
                      <tr><td className="px-5 py-3 font-medium">Level 6</td><td className="px-5 py-3">Head chef, restaurant manager</td><td className="px-5 py-3 text-right">$29.32</td><td className="px-5 py-3 text-right">$57,937</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Casual hospitality employees receive the same <strong>25% loading</strong> on top of these base rates. A Level 2 casual waiter earns <strong>$31.36 per hour</strong>. Apprentice and junior rates apply at reduced percentages similar to the retail award structure. Check the <Link href="/hourly-to-annual-salary-calculator/">Hourly to Annual Salary Calculator</Link> to convert your hourly rate.
              </p>
            </section>

            {/* ── Section 3: Penalty Rates ── */}
            <section id="penalty-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Penalty Rates</h2>
              <p>
                Both retail and hospitality awards include penalty rate provisions for work performed outside standard weekday hours. The following table shows the penalty loadings that apply on top of the base hourly rate for full-time and part-time employees.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">When</th>
                        <th className="px-5 py-3 text-right">FT/PT Loading</th>
                        <th className="px-5 py-3 text-right">Casual Loading</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Saturday</td><td className="px-5 py-3 text-right font-medium">+25%</td><td className="px-5 py-3 text-right">+25% (on casual rate)</td></tr>
                      <tr><td className="px-5 py-3">Sunday (FT/PT)</td><td className="px-5 py-3 text-right font-medium">+50%</td><td className="px-5 py-3 text-right">+50% (on casual rate)</td></tr>
                      <tr><td className="px-5 py-3">Public Holiday</td><td className="px-5 py-3 text-right font-medium">+150%</td><td className="px-5 py-3 text-right">+175% (on base rate)</td></tr>
                      <tr><td className="px-5 py-3">Late Night (after 10pm)</td><td className="px-5 py-3 text-right font-medium">+15%</td><td className="px-5 py-3 text-right">+15% (on casual rate)</td></tr>
                      <tr><td className="px-5 py-3">Early Morning (before 7am)</td><td className="px-5 py-3 text-right font-medium">+15%</td><td className="px-5 py-3 text-right">+15% (on casual rate)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Penalty rates make weekend and holiday shifts significantly more valuable. A Level 1 retail worker earning $25.44/hr base receives <strong>$38.16/hr</strong> on a Sunday shift (+50%), and <strong>$63.60/hr</strong> on a public holiday (+150%). Use the <Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> to model your penalty rate earnings.
              </p>
            </section>

            {/* ── Section 4: Your Rights ── */}
            <section id="your-rights">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your Rights</h2>
              <p>
                Retail and hospitality workers have specific rights under the Fair Work Act and their respective Modern Awards that employers must comply with:
              </p>
              <ul>
                <li><strong>Minimum engagement:</strong> Casual employees must be engaged for a minimum of <strong>3 hours</strong> per shift under both the retail and hospitality awards. An employer cannot roster a casual for less than 3 hours, even if there is insufficient work.</li>
                <li><strong>Roster change notice:</strong> Employers must provide at least <strong>7 days&apos; notice</strong> of any roster change under the retail award. The hospitality award also requires 7 days&apos; notice, but allows changes with shorter notice by mutual agreement or in genuine emergencies.</li>
                <li><strong>Casual conversion:</strong> Casual employees who have been employed for <strong>12 months</strong> and have worked a regular pattern of hours for at least the last 6 months have the right to request conversion to permanent (full-time or part-time) employment. Since March 2021, employers must offer conversion unless there are reasonable business grounds to refuse.</li>
                <li><strong>Breaks:</strong> Employees working more than 5 hours must receive an unpaid meal break of at least 30 minutes. Employees working more than 4 hours are entitled to a 10-minute paid rest break.</li>
              </ul>
              <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-5 rounded-r-xl not-prose my-8">
                <div>
                  <h3 className="text-base font-bold text-navy mb-1">Know Your Award</h3>
                  <p className="text-navy text-sm mb-0">
                    If you suspect you are being underpaid, check your pay against the <Link href="/award-rates/" className="text-eucalyptus-dark underline hover:text-navy">Award Rates Guide</Link> on this site or use the Fair Work Pay Calculator at fairwork.gov.au. You can report underpayment anonymously to the Fair Work Ombudsman on <strong>13 13 94</strong>.
                  </p>
                </div>
              </div>
            </section>

            {/* ── Section 5: Take-Home Pay Examples ── */}
            <section id="take-home-examples">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Take-Home Pay Examples</h2>
              <p>
                Below are take-home pay estimates for common retail and hospitality scenarios in FY2025-26:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Scenario</th>
                        <th className="px-5 py-3 text-right">Gross Annual</th>
                        <th className="px-5 py-3 text-right">Take-Home</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Retail Level 1, FT 38 hrs</td><td className="px-5 py-3 text-right">$50,271</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">$42,613</td></tr>
                      <tr><td className="px-5 py-3">Retail Level 1, Casual 30 hrs/wk</td><td className="px-5 py-3 text-right">$49,608</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">$42,082</td></tr>
                      <tr><td className="px-5 py-3">Hospitality Level 3, FT</td><td className="px-5 py-3 text-right">$51,356</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">$43,481</td></tr>
                      <tr><td className="px-5 py-3">Hospitality Level 6, FT</td><td className="px-5 py-3 text-right">$57,937</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">$48,752</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="not-prose my-8">
                <Link href="/take-home-pay-calculator/" className="inline-flex items-center gap-2 px-6 py-3 bg-eucalyptus-dark text-white font-semibold rounded-lg hover:bg-navy transition-colors">
                  <Calculator className="h-5 w-5" />
                  Calculate Your Retail/Hospitality Take-Home
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* ── Section 6: FAQs ── */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="casual-loading" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the casual loading rate?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Casual employees in both retail and hospitality receive a 25% loading on top of the base hourly rate. This loading compensates for the lack of paid annual leave, personal leave, notice of termination, and redundancy pay. A Level 1 retail casual earns $31.80/hr compared to $25.44/hr for a full-time employee.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="sunday-penalty" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the Sunday penalty rate in retail?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Full-time and part-time retail workers receive a 50% loading for Sunday work. For example, a Level 1 worker earning $25.44/hr base receives $38.16/hr on Sundays. Casual workers receive Sunday penalties calculated on their casual rate (base + 25% loading), effectively earning around $47.70/hr for Sunday work.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="minimum-shift" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the minimum shift length?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Under both the General Retail Industry Award and the Hospitality Industry Award, casual employees must be engaged for a minimum of 3 hours per shift. Part-time employees also have minimum engagement provisions. An employer cannot send you home after 1 or 2 hours without paying for the full 3-hour minimum.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="casual-conversion" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I convert from casual to permanent?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. If you have been employed as a casual for 12 months and have worked a regular pattern of hours for at least the last 6 months, you can request conversion to full-time or part-time employment. Your employer must offer conversion unless they have reasonable business grounds to refuse, such as significant changes to your hours being foreseeable.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="junior-rates" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do workers under 21 get paid less?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. Both the retail and hospitality awards specify junior rates as a percentage of the adult base rate. Workers under 16 receive 45% of the adult rate, increasing to 50% at 16, 60% at 17, 70% at 18, 80% at 19, and 90% at 20. Full adult rates apply from age 21.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="public-holiday" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the public holiday pay rate?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Full-time and part-time employees working on a public holiday receive a 150% loading (2.5 times the base rate). A Level 1 retail worker earning $25.44/hr receives $63.60/hr on a public holiday. Casual employees receive 175% loading on the base rate. Full-time employees who don&apos;t work on the public holiday are entitled to their ordinary pay for the day.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Award rates are sourced from the Fair Work Commission pay guides for the General Retail Industry Award (MA000004) and the Hospitality Industry (General) Award (MA000009) for FY2025-26. Rates reflect the most recent Annual Wage Review increase. Tax calculations use ATO marginal rates for FY2025-26 including the 2% Medicare levy. Take-home pay examples assume no HECS-HELP debt, no private health insurance, and standard tax offsets.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("retail-hospitality-pay-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/award-rates/" label="Award Rates Guide" />
                    <SidebarLink href="/overtime-pay-calculator/" label="Overtime Calculator" />
                    <SidebarLink href="/employment-type-calculator/" label="Employment Type Calculator" />
                    <SidebarLink href="/hourly-to-annual-salary-calculator/" label="Hourly to Annual Salary" />
                    <SidebarLink href="/average-salary-australia/" label="Average Salary Australia" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Check Your Award Rate</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Convert your hourly award rate to annual salary and calculate your after-tax take-home pay.</p>
                  <Link href="/hourly-to-annual-salary-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Hourly to Annual Calculator
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

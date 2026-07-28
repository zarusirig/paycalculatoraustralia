"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, EMPLOYMENT, formatAUD } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Overtime and penalty rates", url: "https://www.fairwork.gov.au/pay-and-wages/penalty-rates-allowances-and-other-payments/penalty-rates", publisher: SOURCES.fwo.name },
  { title: "Maximum weekly hours", url: "https://www.fairwork.gov.au/employment-conditions/hours-of-work-breaks-and-rosters/hours-of-work", publisher: SOURCES.fwo.name },
];

export default function OvertimePenaltyRatesGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Overtime &amp; Penalty Rates Guide</span></li>
          </ol>
        </nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Overtime &amp; Penalty Rates Guide 2025-26</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">Everything you need to know about overtime pay, penalty rates, and the NES provisions that protect your right to fair compensation for working outside standard hours. This Australian tax calculator guide covers penalty rate multipliers, overtime calculations, and take-home pay impacts for the 2025-26 financial year.</p>
          <TrustBar className="!max-w-none" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ───────── SECTION 1: What Are Penalty Rates ───────── */}
            <section id="what-are-penalty-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are Penalty Rates in Australia?</h2>
              <p>Penalty rates are higher pay rates that Australian employees receive for working outside standard weekday hours, including weekends, public holidays, late nights, and early mornings. The Fair Work Commission sets these rates through modern awards, and they apply to over <strong>2.7 million</strong> award-covered workers across Australia.</p>
              <p>The penalty rate system compensates employees for the social and personal cost of working unsociable hours. A retail worker earning a base rate of <strong>$25.44 per hour</strong> under the General Retail Industry Award receives <strong>$31.80 per hour</strong> (1.25x) on Saturdays and <strong>$38.16 per hour</strong> (1.5x) on Sundays. These loadings directly increase your assessable income for the financial year.</p>
              <p>Penalty rates operate separately from overtime rates in most awards. Overtime compensates for hours worked beyond the standard <strong>38-hour week</strong>, while penalty rates compensate for <em>when</em> the work occurs. Some shifts attract both penalties simultaneously -- for example, overtime worked on a public holiday triggers the higher of the two applicable rates under most modern awards.</p>
              <p>To see how penalty rates affect your take-home pay and income tax brackets, use our <Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> with your specific base rate and penalty multiplier.</p>
            </section>

            {/* ───────── SECTION 2: How Are Overtime Rates Calculated ───────── */}
            <section id="how-overtime-calculated">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Are Overtime Rates Calculated?</h2>
              <p>Overtime rates are calculated by multiplying your ordinary base hourly rate by a penalty multiplier, typically <strong>1.5x (time-and-a-half)</strong> for the first 2-3 hours and <strong>2.0x (double time)</strong> for subsequent hours. The exact multiplier depends on your modern award or enterprise agreement.</p>
              <p>The formula is: <strong>Overtime Pay = Base Hourly Rate x Penalty Multiplier x Hours Worked</strong>. For a full-time employee earning $30.00 per hour, 3 hours of time-and-a-half overtime equals <strong>$135.00</strong> ($30 x 1.5 x 3). An additional 2 hours at double time adds <strong>$120.00</strong> ($30 x 2.0 x 2), bringing total overtime earnings for that shift to <strong>$255.00</strong> before tax.</p>

              <h3>Standard Overtime Multiplier Table</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Overtime Type</th>
                        <th className="px-5 py-3">Multiplier</th>
                        <th className="px-5 py-3">Example ($30/hr base)</th>
                        <th className="px-5 py-3">When It Applies</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Time-and-a-half</td><td className="px-5 py-3 font-semibold">1.5x</td><td className="px-5 py-3">$45.00/hr</td><td className="px-5 py-3">First 2-3 hours of overtime (weekdays)</td></tr>
                      <tr><td className="px-5 py-3">Double time</td><td className="px-5 py-3 font-semibold">2.0x</td><td className="px-5 py-3">$60.00/hr</td><td className="px-5 py-3">After first 2-3 hours; all Sunday overtime in some awards</td></tr>
                      <tr><td className="px-5 py-3">Double-time-and-a-half</td><td className="px-5 py-3 font-semibold">2.5x</td><td className="px-5 py-3">$75.00/hr</td><td className="px-5 py-3">Public holiday overtime (most awards)</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>Overtime is triggered when a full-time employee exceeds <strong>38 ordinary hours per week</strong> or <strong>7.6 hours per day</strong> (for a 5-day week). Part-time employees earn overtime when they exceed their agreed contracted hours. Use the <Link href="/hourly-to-annual-salary-calculator/">Hourly to Annual Salary Calculator</Link> to convert your base hourly rate for comparison purposes.</p>
            </section>

            {/* ───────── SECTION 3: Penalty Rates Table by Award Type ───────── */}
            <section id="penalty-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are the Penalty Rates by Award Type?</h2>
              <p>Penalty rate multipliers vary across Australia&apos;s <strong>122 modern awards</strong>, with the highest rates applying to healthcare and emergency services workers. The tables below cover the 5 most common award categories affecting retail, hospitality, healthcare, clerical, and manufacturing workers.</p>

              <h3>Retail Industry (General Retail Industry Award 2020)</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">When</th><th className="px-5 py-3">Full/Part-Time</th><th className="px-5 py-3">Casual</th></tr></thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Saturday</td><td className="px-5 py-3">1.25x</td><td className="px-5 py-3">1.5x</td></tr>
                      <tr><td className="px-5 py-3">Sunday</td><td className="px-5 py-3">1.5x</td><td className="px-5 py-3">1.75x</td></tr>
                      <tr><td className="px-5 py-3">Public Holiday</td><td className="px-5 py-3">2.25x</td><td className="px-5 py-3">2.5x</td></tr>
                      <tr><td className="px-5 py-3">Evening (after 6pm)</td><td className="px-5 py-3">1.25x</td><td className="px-5 py-3">1.25x</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3>Hospitality (Hospitality Industry General Award 2020)</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">When</th><th className="px-5 py-3">Full/Part-Time</th><th className="px-5 py-3">Casual</th></tr></thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Saturday</td><td className="px-5 py-3">1.25x</td><td className="px-5 py-3">1.5x</td></tr>
                      <tr><td className="px-5 py-3">Sunday</td><td className="px-5 py-3">1.5x</td><td className="px-5 py-3">1.75x</td></tr>
                      <tr><td className="px-5 py-3">Public Holiday</td><td className="px-5 py-3">2.25x</td><td className="px-5 py-3">2.5x</td></tr>
                      <tr><td className="px-5 py-3">Late Night (midnight-7am)</td><td className="px-5 py-3">1.15x</td><td className="px-5 py-3">1.15x</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3>Healthcare (Nurses Award 2020)</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">When</th><th className="px-5 py-3">Full/Part-Time</th><th className="px-5 py-3">Casual</th></tr></thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Saturday</td><td className="px-5 py-3">1.5x</td><td className="px-5 py-3">1.75x</td></tr>
                      <tr><td className="px-5 py-3">Sunday</td><td className="px-5 py-3">1.75x</td><td className="px-5 py-3">2.0x</td></tr>
                      <tr><td className="px-5 py-3">Public Holiday</td><td className="px-5 py-3">2.5x</td><td className="px-5 py-3">2.75x</td></tr>
                      <tr><td className="px-5 py-3">Evening (after 6pm)</td><td className="px-5 py-3">1.15x</td><td className="px-5 py-3">1.15x</td></tr>
                      <tr><td className="px-5 py-3">Night (after 9pm)</td><td className="px-5 py-3">1.15x</td><td className="px-5 py-3">1.15x</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3>Clerical / Office (Clerks Private Sector Award 2020)</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">When</th><th className="px-5 py-3">Full/Part-Time</th><th className="px-5 py-3">Casual</th></tr></thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Overtime (first 3 hrs)</td><td className="px-5 py-3">1.5x</td><td className="px-5 py-3">1.5x</td></tr>
                      <tr><td className="px-5 py-3">Overtime (after 3 hrs)</td><td className="px-5 py-3">2.0x</td><td className="px-5 py-3">2.0x</td></tr>
                      <tr><td className="px-5 py-3">Saturday</td><td className="px-5 py-3">1.5x</td><td className="px-5 py-3">1.75x</td></tr>
                      <tr><td className="px-5 py-3">Sunday</td><td className="px-5 py-3">2.0x</td><td className="px-5 py-3">2.25x</td></tr>
                      <tr><td className="px-5 py-3">Public Holiday</td><td className="px-5 py-3">2.5x</td><td className="px-5 py-3">2.75x</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <h3>Manufacturing (Manufacturing Award 2020)</h3>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">When</th><th className="px-5 py-3">Full/Part-Time</th><th className="px-5 py-3">Casual</th></tr></thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Overtime (first 2 hrs)</td><td className="px-5 py-3">1.5x</td><td className="px-5 py-3">1.5x</td></tr>
                      <tr><td className="px-5 py-3">Overtime (after 2 hrs)</td><td className="px-5 py-3">2.0x</td><td className="px-5 py-3">2.0x</td></tr>
                      <tr><td className="px-5 py-3">Saturday</td><td className="px-5 py-3">1.5x</td><td className="px-5 py-3">1.75x</td></tr>
                      <tr><td className="px-5 py-3">Sunday</td><td className="px-5 py-3">2.0x</td><td className="px-5 py-3">2.25x</td></tr>
                      <tr><td className="px-5 py-3">Public Holiday</td><td className="px-5 py-3">2.5x</td><td className="px-5 py-3">2.75x</td></tr>
                      <tr><td className="px-5 py-3">Afternoon Shift</td><td className="px-5 py-3">1.15x</td><td className="px-5 py-3">1.15x</td></tr>
                      <tr><td className="px-5 py-3">Night Shift</td><td className="px-5 py-3">1.3x</td><td className="px-5 py-3">1.3x</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>For a complete list of award rates and minimum pay levels, see our <Link href="/award-rates/">Award Rates Guide</Link>. To find your specific modern award, use the Fair Work Ombudsman&apos;s <a href="https://calculate.fairwork.gov.au/FindYourAward" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">Find My Award</a> tool.</p>
            </section>

            {/* ───────── SECTION 4: When Do Penalty Rates Apply ───────── */}
            <section id="when-penalty-rates-apply">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>When Do Penalty Rates Apply?</h2>
              <p>Penalty rates apply during weekends, public holidays, evening shifts, night shifts, and early morning hours as defined by each modern award. The specific trigger times and multipliers differ between industries, but most awards recognise <strong>5 distinct penalty periods</strong>.</p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Penalty Period</th>
                        <th className="px-5 py-3">Typical Hours</th>
                        <th className="px-5 py-3">Common Multiplier Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Saturday</td><td className="px-5 py-3">All day</td><td className="px-5 py-3 font-semibold">1.25x - 1.5x</td></tr>
                      <tr><td className="px-5 py-3">Sunday</td><td className="px-5 py-3">All day</td><td className="px-5 py-3 font-semibold">1.5x - 2.0x</td></tr>
                      <tr><td className="px-5 py-3">Public Holiday</td><td className="px-5 py-3">All day</td><td className="px-5 py-3 font-semibold">2.0x - 2.75x</td></tr>
                      <tr><td className="px-5 py-3">Evening / Afternoon Shift</td><td className="px-5 py-3">6pm - midnight</td><td className="px-5 py-3 font-semibold">1.15x - 1.25x</td></tr>
                      <tr><td className="px-5 py-3">Night / Early Morning</td><td className="px-5 py-3">Midnight - 7am</td><td className="px-5 py-3 font-semibold">1.15x - 1.3x</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>Australia has <strong>8 national public holidays</strong> per year: New Year&apos;s Day, Australia Day, Good Friday, Easter Saturday, Easter Monday, Anzac Day, Queen&apos;s Birthday (King&apos;s Birthday from 2023), and Christmas Day plus Boxing Day. Each state and territory adds <strong>1-3 additional public holidays</strong>, bringing the total to 10-13 days depending on location.</p>
              <p>Weekend penalty rates are the most significant driver of higher pay for shift workers. A full-time hospitality worker earning $26.44 per hour base rate who works every Sunday receives <strong>$36.15 per hour</strong> (1.5x) for those shifts. Over a full year of Sunday work (52 Sundays x 8 hours), that produces an additional <strong>$5,017.60</strong> in penalty-loaded pay compared to weekday rates.</p>
            </section>

            {/* ───────── SECTION 5: How Are Penalty Rates Taxed ───────── */}
            <section id="how-penalty-rates-taxed">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Are Penalty Rates Taxed?</h2>
              <p>Penalty rate earnings are taxed as ordinary income at your marginal tax rate, with no special concessions or separate tax treatment. The ATO treats overtime pay, weekend penalties, and public holiday loadings identically to your standard hourly earnings for PAYG withholding purposes.</p>
              <p>Higher penalty rate earnings increase your total assessable income, which can push you into a higher income tax bracket. An employee earning <strong>$85,000</strong> in base salary who receives an additional <strong>$12,000</strong> in annual penalty rate payments has a total taxable income of <strong>$97,000</strong>. The penalty rate portion is taxed at the <strong>32.5% marginal rate</strong> (for FY2025-26 income between $45,001 and $135,000), meaning approximately <strong>$3,900</strong> of the $12,000 in penalties goes to income tax.</p>
              <p>Your employer withholds PAYG tax from penalty rate earnings each pay cycle. The withholding amount is calculated using ATO tax tables based on your projected annual income. This means penalty payments in a single pay period can appear to attract a higher tax rate because the withholding system projects that higher earnings level across the entire year. Any over-withholding is refunded when you lodge your tax return. Check the <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to estimate your total tax liability including penalty rate income.</p>
              <p>The <strong>Medicare levy</strong> of 2% also applies to penalty rate income. The &quot;Medicare Levy Surcharge&quot; (an additional 1-1.5%) applies if your total income including penalties exceeds <strong>$93,000</strong> for singles and you do not hold private hospital cover. Read more about Medicare levy thresholds in our <Link href="/medicare-levy/">Medicare Levy Calculator</Link> guide.</p>
            </section>

            {/* ───────── SECTION 6: Award Rate vs Enterprise Agreement ───────── */}
            <section id="award-vs-enterprise-agreement">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Difference Between Award Rate and Enterprise Agreement Penalties?</h2>
              <p>Modern award penalty rates are minimum rates set by the Fair Work Commission, while enterprise agreement penalties are negotiated rates that must meet or exceed the award &quot;Better Off Overall Test&quot; (BOOT). Enterprise agreements cover approximately <strong>38%</strong> of Australian employees, with the remainder covered by awards or individual contracts.</p>
              <p>An enterprise agreement can structure penalties differently from the applicable award. A large supermarket chain&apos;s enterprise agreement, for example, might offer a flat <strong>1.35x</strong> loading for all weekend hours instead of the award&apos;s split between 1.25x Saturday and 1.5x Sunday. The BOOT requires that employees are better off overall -- not necessarily on every single penalty rate -- compared to the underlying modern award.</p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Feature</th>
                        <th className="px-5 py-3">Modern Award</th>
                        <th className="px-5 py-3">Enterprise Agreement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Set by</td><td className="px-5 py-3">Fair Work Commission</td><td className="px-5 py-3">Employer + employees (majority vote)</td></tr>
                      <tr><td className="px-5 py-3">Penalty flexibility</td><td className="px-5 py-3">Fixed per award schedule</td><td className="px-5 py-3">Negotiable (must pass BOOT)</td></tr>
                      <tr><td className="px-5 py-3">Duration</td><td className="px-5 py-3">Ongoing (reviewed every 4 years)</td><td className="px-5 py-3">Maximum 4 years, then renegotiated</td></tr>
                      <tr><td className="px-5 py-3">Coverage</td><td className="px-5 py-3">Industry-wide</td><td className="px-5 py-3">Single employer or group</td></tr>
                      <tr><td className="px-5 py-3">Minimum standard</td><td className="px-5 py-3">National Employment Standards (NES)</td><td className="px-5 py-3">NES + BOOT against relevant award</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>Employees covered by enterprise agreements should check their agreement&apos;s penalty schedule directly, as it overrides the modern award rates. Expired enterprise agreements continue to apply until replaced or terminated by the Fair Work Commission.</p>
            </section>

            {/* ───────── SECTION 7: Casual vs Full-Time Penalty Rates ───────── */}
            <section id="casual-vs-permanent">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Do Casual Penalty Rates Differ From Full-Time Rates?</h2>
              <p>Casual employees receive higher weekend and public holiday penalty multipliers than full-time and part-time workers because casual loadings compensate for the absence of paid leave entitlements. The standard casual loading is <strong>25%</strong>, bringing the base casual rate to <strong>1.25x</strong> before any penalty rates apply.</p>
              <p>For <strong>casual employees</strong>, the overtime and penalty multiplier applies to the <em>base rate</em> (not the casual-loaded rate). A casual retail worker with a $25.44 base rate receives a casual-loaded ordinary rate of <strong>$31.80</strong> (base + 25%). Weekend and public holiday penalty rates for casuals are typically higher than for permanent staff because they include compensation for lack of leave entitlements.</p>
              <p>For <strong>permanent employees</strong>, weekend and public holiday penalties are generally lower because they already receive paid annual leave, sick leave, and other NES entitlements.</p>

              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Penalty Period</th>
                        <th className="px-5 py-3">Full-Time/Part-Time (Retail)</th>
                        <th className="px-5 py-3">Casual (Retail)</th>
                        <th className="px-5 py-3">Casual Advantage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Saturday</td><td className="px-5 py-3">1.25x ($31.80)</td><td className="px-5 py-3">1.5x ($38.16)</td><td className="px-5 py-3 font-semibold">+$6.36/hr</td></tr>
                      <tr><td className="px-5 py-3">Sunday</td><td className="px-5 py-3">1.5x ($38.16)</td><td className="px-5 py-3">1.75x ($44.52)</td><td className="px-5 py-3 font-semibold">+$6.36/hr</td></tr>
                      <tr><td className="px-5 py-3">Public Holiday</td><td className="px-5 py-3">2.25x ($57.24)</td><td className="px-5 py-3">2.5x ($63.60)</td><td className="px-5 py-3 font-semibold">+$6.36/hr</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <p>Since July 2024, casual employees who have worked regular patterns for <strong>12 months or more</strong> can request conversion to permanent (full-time or part-time) employment under the &quot;Casual Conversion&quot; provisions in the Fair Work Act. Converting to permanent status trades the 25% casual loading for access to paid leave, redundancy pay, and notice of termination. To understand how this change affects your overall salary package, compare scenarios using our <Link href="/take-home-pay-calculator/">Take Home Pay Calculator</Link>.</p>
            </section>

            {/* ───────── SECTION 8: Can You Refuse Overtime ───────── */}
            <section id="reasonable">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Can You Refuse Overtime in Australia?</h2>
              <p>An employee can refuse overtime that is unreasonable under the National Employment Standards, which cap maximum weekly hours at <strong>38 ordinary hours</strong> plus &quot;reasonable&quot; additional hours. The Fair Work Act does not define a specific maximum overtime limit, but requires consideration of <strong>5 key factors</strong> to determine reasonableness.</p>
              <p>Under the NES, an employer can only require &quot;reasonable&quot; overtime. Factors considered include:</p>
              <ul>
                <li>Risk to your health and safety</li>
                <li>Your personal circumstances (family, caring responsibilities)</li>
                <li>Notice given by the employer</li>
                <li>How much overtime you&apos;ve already worked</li>
                <li>Your role and responsibilities</li>
              </ul>
              <p>An employee who regularly works 50+ hours per week has stronger grounds to refuse additional overtime than an employee who rarely exceeds 40 hours. Emergency service workers, healthcare professionals, and essential infrastructure employees face different reasonableness thresholds due to the nature of their roles.</p>
              <p>Refusing unreasonable overtime is a workplace right protected under the general protections provisions of the Fair Work Act. An employer cannot take adverse action (dismissal, demotion, or reduced hours) against an employee for exercising this right.</p>
            </section>

            {/* ───────── SECTION 9: What Changed in FY2025-26 ───────── */}
            <section id="fy2025-26-changes">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Penalty Rates in FY2025-26?</h2>
              <p>The Fair Work Commission&apos;s Annual Wage Review 2025 increased all modern award minimum wages by <strong>3.75%</strong> from 1 July 2025, raising the national minimum wage to <strong>$26.44 per hour</strong> ($1,004.90 per week). All penalty rate calculations that reference the base award rate automatically reflect this increase.</p>
              <p>Key changes affecting penalty rates and overtime in the 2025-26 financial year include:</p>
              <ul>
                <li>The superannuation guarantee (SG) rate increased to <strong>12%</strong> from 1 July 2025, though overtime hours generally do not attract superannuation (see FAQ below)</li>
                <li>Income tax bracket thresholds remain unchanged from the Stage 3 tax cuts implemented in FY2024-25, with the <strong>$18,201-$45,000</strong> bracket taxed at 16% and the <strong>$45,001-$135,000</strong> bracket taxed at 30%</li>
                <li>The &quot;Right to Disconnect&quot; provisions (effective August 2024 for large employers, August 2025 for small employers) give employees the right to refuse contact outside working hours unless the refusal is unreasonable</li>
                <li>Casual conversion pathway changes streamline the process for casual workers to convert to permanent employment after 12 months</li>
              </ul>
              <p>The updated income tax brackets for FY2025-26 mean that penalty rate earnings between $45,001 and $135,000 are taxed at <strong>30%</strong> (reduced from 32.5% in previous years). This effectively increases the after-tax value of overtime and penalty rate income for workers in this bracket. Use the <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to model the impact of the updated brackets on your total earnings including penalties.</p>
            </section>

            {/* ── CONTEXT BORDER ── */}

            {/* ───────── SECTION 10: Related Resources ───────── */}
            <section id="related-resources">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
              <p>Explore these tools and guides to calculate your total take-home pay including overtime, penalty rates, superannuation, and income tax for the 2025-26 financial year.</p>
              <ul>
                <li><Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> -- Enter your base rate, penalty multiplier, and hours to calculate after-tax overtime earnings</li>
                <li><Link href="/award-rates/">Award Rates Guide</Link> -- Complete list of minimum pay rates across all modern awards for FY2025-26</li>
                <li><Link href="/take-home-pay-calculator/">Take Home Pay Calculator</Link> -- Calculate your net pay after tax, Medicare levy, and superannuation deductions</li>
                <li><Link href="/hourly-to-annual-salary-calculator/">Hourly to Annual Salary Calculator</Link> -- Convert hourly rates to annual salary equivalents for comparison</li>
                <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> -- Model your total income tax including penalty rate earnings across FY2025-26 brackets</li>
                <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link> -- Estimate your employer SG contributions and projected super balance at retirement</li>
              </ul>
            </section>

            {/* ───────── SECTION 11: FAQs ───────── */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="tax" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How is overtime taxed in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Overtime is added to your regular income and taxed at your marginal rate. There is no separate tax rate for overtime or penalty rate income. The ATO treats all employment earnings identically for PAYG withholding. Use our <Link href="/overtime-pay-calculator/" className="text-eucalyptus-dark hover:underline">Overtime Pay Calculator</Link> to see the after-tax amount.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="super" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do I get super on overtime pay?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Generally no. Overtime is not considered &quot;Ordinary Time Earnings&quot; (OTE) and does not attract the <strong>12%</strong> superannuation guarantee. Some enterprise agreements specifically include overtime in the super calculation base. Check your agreement or ask your employer&apos;s payroll department.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="find-award" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I find my exact penalty rates?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Use the Fair Work Ombudsman&apos;s <a href="https://calculate.fairwork.gov.au/FindYourAward" target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">Find My Award</a> tool. It will identify your specific award and show the exact penalty rate multipliers that apply to your role. You can also check your employment contract or payslip for the applicable award name.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="casual-loading-on-top" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is casual loading paid on top of penalty rates?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">No. Casual penalty rate multipliers already incorporate compensation for the lack of leave entitlements. The casual rate column in modern award penalty tables reflects a higher multiplier than the permanent employee column. The <strong>25%</strong> casual loading applies only to ordinary (non-penalty) hours.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="penalty-vs-overtime" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the difference between penalty rates and overtime?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Penalty rates compensate for <em>when</em> you work (weekends, public holidays, evenings). Overtime compensates for working <em>more than</em> your standard hours (beyond 38 hours per week for full-time employees). A shift can attract both penalties -- for example, overtime worked on a Sunday receives the higher applicable rate under most modern awards.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="public-holiday-refuse" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can I refuse to work on a public holiday?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. Under section 114 of the Fair Work Act, an employee can refuse a request to work on a public holiday if the refusal is reasonable. Factors include whether the workplace is normally open on public holidays, the employee&apos;s personal circumstances, and the notice provided. Employees who do work public holidays receive penalty rates of <strong>2.0x to 2.75x</strong> depending on their award.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="salary-vs-award" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do salaried employees get penalty rates?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">It depends on the employment arrangement. Award-covered salaried employees must receive penalty rates unless their salary is high enough to &quot;absorb&quot; all applicable penalties and overtime (an &quot;annualised salary&quot; arrangement). The annualised salary must exceed the total of base pay plus all penalties the employee would otherwise receive. Employers must conduct annual reconciliations to verify this.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="underpayment" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What should I do if my employer is not paying penalty rates?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Contact the Fair Work Ombudsman on <strong>13 13 94</strong> or lodge a complaint online at fairwork.gov.au. The FWO investigates underpayment claims and can recover up to <strong>6 years</strong> of unpaid wages and penalties. Employers face penalties of up to <strong>$93,900</strong> per contravention for individuals and <strong>$469,500</strong> for companies under the Fair Work Act.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="time-in-lieu" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Can my employer offer time off instead of penalty rates?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">&quot;Time Off in Lieu&quot; (TOIL) is permitted under most modern awards if both the employer and employee agree in writing. TOIL for overtime must be taken at the equivalent penalty rate -- 1 hour of overtime at 1.5x equals <strong>1.5 hours</strong> of time off. Unused TOIL must be paid out at the overtime rate if not taken within an agreed period.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="hecs-impact" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Do penalty rates affect my HECS-HELP repayment?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Yes. Penalty rate income increases your &quot;Repayment Income&quot; for HECS-HELP purposes, which includes taxable income, reportable fringe benefits, and net investment losses. Repayments start at <strong>1%</strong> when repayment income exceeds <strong>$69,528</strong> for FY2025-26. Higher penalty rate earnings can push you into a higher repayment bracket. See our <Link href="/hecs-help-calculator/" className="text-eucalyptus-dark hover:underline">HECS-HELP Repayment Calculator</Link> for details.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="right-to-disconnect" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Does the Right to Disconnect affect overtime and penalties?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The &quot;Right to Disconnect&quot; provisions (effective August 2024 for employers with 15+ employees, August 2025 for small employers) allow employees to refuse out-of-hours contact unless the refusal is unreasonable. This does not eliminate overtime or penalty rates but reinforces that work performed outside rostered hours must be compensated. Employees who are contacted and required to perform work outside their scheduled shift are entitled to applicable overtime or penalty rates.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="payslip-check" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How do I check penalty rates on my payslip?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Your payslip must itemise each pay rate separately under the Fair Work Regulations. Look for line items labelled &quot;Saturday loading,&quot; &quot;Sunday penalty,&quot; &quot;Public holiday,&quot; or &quot;Overtime&quot; with the applicable multiplier. If your payslip bundles all hours at a single rate, request a breakdown from your employer. Learn more about payslip requirements in our <Link href="/understanding-your-payslip/" className="text-eucalyptus-dark hover:underline">Understanding Your Payslip</Link> guide.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works"><p>Penalty rate data is sourced from current Fair Work Commission modern awards. Rates are updated annually following the FWC Annual Wage Review, typically effective from 1 July. All tax calculations reference ATO PAYG withholding schedules and income tax brackets for the 2025-26 financial year.</p></MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("overtime-penalty-rates-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>
          </article>
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Tools</h3><div className="space-y-3"><SidebarLink href="/overtime-pay-calculator/" label="Overtime Calculator" /><SidebarLink href="/award-rates/" label="Award Rates Guide" /><SidebarLink href="/hourly-to-annual-salary-calculator/" label="Hourly to Annual Calc" /><SidebarLink href="/weekly-pay-calculator/" label="Weekly Pay Calculator" /></div></CardContent></Card>
              <Card className="bg-emerald-600 border-none text-white shadow-md"><CardContent className="p-6"><h3 className="text-lg font-bold mb-2">Calculate your overtime pay</h3><p className="text-emerald-100 text-sm mb-4">Enter your base rate and penalty type to see your after-tax overtime earnings.</p><Link href="/overtime-pay-calculator/" className="block w-full py-2.5 px-4 bg-white text-emerald-700 font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">Overtime Calculator →</Link></CardContent></Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus/40 hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>);
}

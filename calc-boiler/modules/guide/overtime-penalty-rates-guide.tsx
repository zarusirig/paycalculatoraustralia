import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FaqAccordion from "@/components/common/faq-accordion";
import { PENALTY_RATES_FAQS } from "./overtime-penalty-rates-guide-faqs";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, EMPLOYMENT, MEDICARE_LEVY, formatAUD } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import {
  AWR_2026_FLOORS,
  HOSPITALITY_AWARD,
  HOSPITALITY_PENALTIES,
  HOSPITALITY_RATES,
  RETAIL_AWARD,
  RETAIL_PENALTIES,
  RETAIL_RATES,
} from "@/lib/constants/hospitality-award";
import { SCHADS_AWARD, SCHADS_PENALTIES, SCHADS_SACS } from "@/lib/constants/schads-award";
// --- G4 public holiday pay cluster ---
import { STATE_PUBLIC_HOLIDAYS, statePath, statewideDays, yearOf } from "@/lib/data/public-holidays";
const PH_COUNTS = STATE_PUBLIC_HOLIDAYS.map((st) => statewideDays(yearOf(st, 2026)!).length);
const PH_COUNT_MIN = Math.min(...PH_COUNTS);
const PH_COUNT_MAX = Math.max(...PH_COUNTS);
// --- end G4 ---

const SOURCES_LIST: SourceLink[] = [
  { title: "Overtime and penalty rates", url: "https://www.fairwork.gov.au/pay-and-wages/penalty-rates-allowances-and-other-payments/penalty-rates", publisher: SOURCES.fwo.name },
  { title: "Maximum weekly hours", url: "https://www.fairwork.gov.au/employment-conditions/hours-of-work-breaks-and-rosters/hours-of-work", publisher: SOURCES.fwo.name },
  { title: `Pay guide — General Retail Industry Award (${RETAIL_AWARD.code})`, url: RETAIL_AWARD.awardTextUrl, publisher: SOURCES.fwo.name },
  { title: `Pay guide — Hospitality Industry (General) Award (${HOSPITALITY_AWARD.code})`, url: HOSPITALITY_AWARD.awardTextUrl, publisher: SOURCES.fwo.name },
];

// Base rates for the worked examples, derived so they cannot drift from the
// award pages. An earlier version of this page used $25.44, which was never a
// FY2026-27 retail rate.
const RETAIL_L1 = RETAIL_RATES.find((r) => r.level === "Level 1")!;
const HOSP_L1 = HOSPITALITY_RATES.find((r) => r.level === "Level 1")!;
const SCHADS_L4 = SCHADS_SACS.find((r) => r.classification === "Level 4 pay point 1")!;
const AWR_EFFECTIVE = HOSPITALITY_AWARD.operativeFrom;

const pctLabel = (v: number) => `${(v * 100).toFixed((v * 100) % 1 === 0 ? 0 : 1)}%`;

/** Penalty table shared by the three verified awards on this page. */
function PenaltyTable({
  rows,
  base,
  caption,
}: {
  rows: { label: string; perm: number; cas: number }[];
  base: number;
  caption: string;
}) {
  return (
    <div className="not-prose my-6">
      <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full min-w-[32rem] text-left text-sm text-navy">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-sandstone font-semibold text-navy">
            <tr>
              <th scope="col" className="px-5 py-3">When worked</th>
              <th scope="col" className="px-5 py-3">Permanent</th>
              <th scope="col" className="px-5 py-3">Casual</th>
              <th scope="col" className="px-5 py-3">$ perm on {formatAUD(base, 2)}</th>
              <th scope="col" className="px-5 py-3">$ casual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {rows.map((r) => (
              <tr key={r.label}>
                <th scope="row" className="px-5 py-3 text-left font-medium">{r.label}</th>
                <td className="px-5 py-3 font-medium">{pctLabel(r.perm)}</td>
                <td className="px-5 py-3 font-medium">{pctLabel(r.cas)}</td>
                <td className="px-5 py-3">{formatAUD(base * r.perm, 2)}</td>
                <td className="px-5 py-3">{formatAUD(base * r.cas, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function OvertimePenaltyRatesGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Penalty Rates</span></li>
          </ol>
        </nav>
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Penalty Rates Australia &mdash; Weekend, Public Holiday &amp; Overtime Loadings</h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">What you must be paid for working weekends, public holidays, evenings and overtime &mdash; the multipliers by award, how casual penalties differ, and how the loadings are taxed. Rates current from {AWR_EFFECTIVE}.</p>
          <TrustBar className="!max-w-none" />
        </header>
        <div className="flex flex-col lg:flex-row gap-12">
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ───────── SECTION 1: What Are Penalty Rates ───────── */}
            <section id="what-are-penalty-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Are Penalty Rates in Australia?</h2>
              <p>Penalty rates are higher pay rates that Australian employees receive for working outside standard weekday hours, including weekends, public holidays, late nights, and early mornings. The Fair Work Commission sets these rates through modern awards, which set the minimum for most Australian employees.</p>
              <p>The penalty rate system compensates employees for the social and personal cost of working unsociable hours. A retail worker on the level 1 rate of <strong>{formatAUD(RETAIL_L1.hourly, 2)} per hour</strong> under the General Retail Industry Award receives <strong>{formatAUD(RETAIL_L1.hourly * RETAIL_PENALTIES.saturday, 2)} per hour</strong> ({RETAIL_PENALTIES.saturday}x) on Saturdays and <strong>{formatAUD(RETAIL_L1.hourly * RETAIL_PENALTIES.sunday, 2)} per hour</strong> ({RETAIL_PENALTIES.sunday}x) on Sundays. These loadings directly increase your assessable income for the financial year.</p>
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
              <p>Penalty rates vary across Australia&apos;s modern awards. The three tables below are derived from verified award data and are regression-tested against the Fair Work pay guides. Each links to a full classification-by-classification breakdown.</p>

              <h3>Retail &mdash; General Retail Industry Award ({RETAIL_AWARD.code})</h3>
              <PenaltyTable
                rows={[
                  { label: "Monday to Friday after 6pm", perm: RETAIL_PENALTIES.eveningAfter6pm, cas: RETAIL_PENALTIES.casualEveningAfter6pm },
                  { label: "Saturday", perm: RETAIL_PENALTIES.saturday, cas: RETAIL_PENALTIES.casualSaturday },
                  { label: "Sunday", perm: RETAIL_PENALTIES.sunday, cas: RETAIL_PENALTIES.casualSunday },
                  { label: "Public holiday", perm: RETAIL_PENALTIES.publicHoliday, cas: RETAIL_PENALTIES.casualPublicHoliday },
                ]}
                base={RETAIL_L1.hourly}
                caption="Retail award penalty rates"
              />
              <p className="text-sm text-warmgray">Applies to non-shiftworkers. Full table: <Link href="/retail-award-rates/">retail award rates</Link>.</p>

              <h3>Hospitality &mdash; Hospitality Industry (General) Award ({HOSPITALITY_AWARD.code})</h3>
              <PenaltyTable
                rows={[
                  { label: "Saturday", perm: HOSPITALITY_PENALTIES.saturday, cas: HOSPITALITY_PENALTIES.casualSaturday },
                  { label: "Sunday", perm: HOSPITALITY_PENALTIES.sunday, cas: HOSPITALITY_PENALTIES.casualSunday },
                  { label: "Public holiday", perm: HOSPITALITY_PENALTIES.publicHoliday, cas: HOSPITALITY_PENALTIES.casualPublicHoliday },
                ]}
                base={HOSP_L1.hourly}
                caption="Hospitality award penalty rates"
              />
              <div className="not-prose my-6 rounded-xl border-l-4 border-ochre bg-sandstone p-5">
                <p className="text-sm leading-relaxed text-navy">
                  <strong>Hospitality evening and night work is not a multiplier.</strong> The award adds a flat <strong>{formatAUD(HOSPITALITY_PENALTIES.eveningPerHour, 2)} per hour</strong> for evening work and <strong>{formatAUD(HOSPITALITY_PENALTIES.nightPerHour, 2)} per hour</strong> at night, on top of the ordinary rate. Guides that print &ldquo;1.15x&rdquo; for hospitality late-night work &mdash; including an earlier version of this page &mdash; are wrong. Retail, by contrast, genuinely does use a percentage for evening work.
                </p>
              </div>
              <p className="text-sm text-warmgray">Full table: <Link href="/hospitality-award-rates/">hospitality award rates</Link>.</p>

              <h3>Social &amp; community services &mdash; SCHADS ({SCHADS_AWARD.code})</h3>
              <PenaltyTable
                rows={[
                  { label: "Saturday", perm: SCHADS_PENALTIES.saturday, cas: SCHADS_PENALTIES.casualSaturday },
                  { label: "Sunday", perm: SCHADS_PENALTIES.sunday, cas: SCHADS_PENALTIES.casualSunday },
                  { label: "Public holiday", perm: SCHADS_PENALTIES.publicHoliday, cas: SCHADS_PENALTIES.casualPublicHoliday },
                ]}
                base={SCHADS_L4.hourly}
                caption="SCHADS award penalty rates"
              />
              <p className="text-sm text-warmgray">
                SCHADS pays the highest weekend penalties of the three. Shift loadings of {(SCHADS_PENALTIES.afternoonShiftLoading * 100).toFixed(1)}% (afternoon) and {(SCHADS_PENALTIES.nightShiftLoading * 100).toFixed(0)}% (night) apply separately, but weekend rates <em>substitute</em> for them rather than stacking. Full table: <Link href="/schads-award-pay-rates/">SCHADS award pay rates</Link>.
              </p>

              <h3>Other awards</h3>
              <p>
                We publish penalty figures only for awards we have verified against the award text and the Fair Work pay guide. The Nurses, Clerks &mdash; Private Sector, Manufacturing and other awards each set their own multipliers, and several differ materially from the three above &mdash; nursing weekend penalties in particular are higher. Rather than reproduce unverified numbers on a page people use to check their pay, we link you to the source: use the Fair Work Ombudsman&apos;s <a href="https://calculate.fairwork.gov.au/FindYourAward" target="_blank" rel="noopener noreferrer">Find My Award</a> tool, then open the pay guide for your award.
              </p>

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

              <p>The National Employment Standards list <strong>8 national public holidays</strong>: New Year&apos;s Day, Australia Day, Good Friday, Easter Monday, Anzac Day, the King&apos;s Birthday (held on different dates in different states), Christmas Day and Boxing Day. States and territories declare additional days, such as Easter Saturday, Labour Day and local show days, so the total depends on where you work.</p>
              {/* --- G4 public holiday pay cluster (24 Sep 2026): counts read from the state data --- */}
              <p>In 2026 the number of whole-day state-wide holidays ranges from <strong>{PH_COUNT_MIN}</strong> to <strong>{PH_COUNT_MAX}</strong>, before regional show days and the part-day Christmas Eve and New Year&apos;s Eve holidays in some states. <Link href="/public-holiday-pay/">Public holiday pay rates, your rights and a calculator</Link> &middot; dates by state: {STATE_PUBLIC_HOLIDAYS.map((st, i) => (<span key={st.slug}>{i > 0 ? ", " : ""}<Link href={statePath(st.slug)}>{st.code}</Link></span>))}.</p>
              {/* --- end G4 --- */}
              <p>Weekend penalty rates are the most significant driver of higher pay for shift workers. A full-time hospitality worker on the level 1 rate of {formatAUD(HOSP_L1.hourly, 2)} per hour who works every Sunday receives <strong>{formatAUD(HOSP_L1.hourly * HOSPITALITY_PENALTIES.sunday, 2)} per hour</strong> ({HOSPITALITY_PENALTIES.sunday}x) for those shifts. Over 52 Sundays at 8 hours that is an extra <strong>{formatAUD(HOSP_L1.hourly * (HOSPITALITY_PENALTIES.sunday - 1) * 8 * 52, 0)}</strong> compared with weekday rates.</p>
            </section>

            {/* ───────── SECTION 5: How Are Penalty Rates Taxed ───────── */}
            <section id="how-penalty-rates-taxed">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How Are Penalty Rates Taxed?</h2>
              <p>Penalty rate earnings are taxed as ordinary income at your marginal tax rate, with no special concessions or separate tax treatment. The ATO treats overtime pay, weekend penalties, and public holiday loadings identically to your standard hourly earnings for PAYG withholding purposes.</p>
              <p>Higher penalty rate earnings increase your total assessable income, which can push you into a higher income tax bracket. An employee earning <strong>$85,000</strong> in base salary who receives an additional <strong>$12,000</strong> in annual penalty rate payments has a total taxable income of <strong>$97,000</strong>. The penalty rate portion is taxed at the <strong>30% marginal rate</strong> that applies to income between $45,001 and $135,000, meaning <strong>$3,600</strong> of the $12,000 in penalties goes to income tax, plus the 2% Medicare levy.</p>
              <p>Your employer withholds PAYG tax from penalty rate earnings each pay cycle. The withholding amount is calculated using ATO tax tables based on your projected annual income. This means penalty payments in a single pay period can appear to attract a higher tax rate because the withholding system projects that higher earnings level across the entire year. Any over-withholding is refunded when you lodge your tax return. Check the <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to estimate your total tax liability including penalty rate income.</p>
              <p>The <strong>Medicare levy</strong> of 2% also applies to penalty rate income. The &quot;Medicare Levy Surcharge&quot; (an additional 1-1.5%) applies if your total income including penalties exceeds <strong>{formatAUD(MEDICARE_LEVY.surcharge.tier1.min - 1)}</strong> for singles in FY{SITE_CONFIG.financialYear} and you do not hold private hospital cover. Read more about Medicare levy thresholds in our <Link href="/medicare-levy/">Medicare Levy Calculator</Link> guide.</p>
            </section>

            {/* ───────── SECTION 6: Award Rate vs Enterprise Agreement ───────── */}
            <section id="award-vs-enterprise-agreement">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Is the Difference Between Award Rate and Enterprise Agreement Penalties?</h2>
              <p>Modern award penalty rates are minimum rates set by the Fair Work Commission, while enterprise agreement penalties are negotiated rates that must meet or exceed the award &quot;Better Off Overall Test&quot; (BOOT). Many employees are paid under an enterprise agreement; the rest are paid award rates or under individual arrangements that cannot go below the award.</p>
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
              <p>For <strong>casual employees</strong>, the overtime and penalty multiplier applies to the <em>base rate</em> (not the casual-loaded rate). A casual retail worker on the {formatAUD(RETAIL_L1.hourly, 2)} base rate receives a casual-loaded ordinary rate of <strong>{formatAUD(Math.round(RETAIL_L1.hourly * 1.25 * 100) / 100, 2)}</strong> (base + 25%). Weekend and public holiday penalty rates for casuals are typically higher than for permanent staff because they include compensation for lack of leave entitlements.</p>
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
                      {([
                        ["Saturday", RETAIL_PENALTIES.saturday, RETAIL_PENALTIES.casualSaturday],
                        ["Sunday", RETAIL_PENALTIES.sunday, RETAIL_PENALTIES.casualSunday],
                        ["Public Holiday", RETAIL_PENALTIES.publicHoliday, RETAIL_PENALTIES.casualPublicHoliday],
                      ] as const).map(([day, ft, cas]) => (
                        <tr key={day}><td className="px-5 py-3">{day}</td><td className="px-5 py-3">{ft}x ({formatAUD(RETAIL_L1.hourly * ft, 2)})</td><td className="px-5 py-3">{cas}x ({formatAUD(RETAIL_L1.hourly * cas, 2)})</td><td className="px-5 py-3 font-semibold">+{formatAUD(RETAIL_L1.hourly * (cas - ft), 2)}/hr</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p>Since 26 August 2024, a casual employee who has been employed for at least <strong>6 months</strong> (12 months for a small business employer) and believes they no longer fit the casual definition can notify their employer in writing that they want to become full-time or part-time, under the &quot;employee choice&quot; provisions in the Fair Work Act. Converting to permanent status trades the 25% casual loading for access to paid leave, redundancy pay, and notice of termination. To understand how this change affects your overall salary package, compare scenarios using our <Link href="/take-home-pay-calculator/">Take Home Pay Calculator</Link>.</p>
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

            {/* ───────── SECTION 9: What Changed in FY2026-27 ───────── */}
            <section id="fy2026-27-changes">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Changed for Penalty Rates in FY{SITE_CONFIG.financialYear}?</h2>
              <p>The Fair Work Commission&apos;s Annual Wage Review 2026 increased modern award minimum wages by <strong>{(AWR_2026_FLOORS.increase * 100).toFixed(2)}%</strong> from {AWR_EFFECTIVE}, taking the national minimum wage to <strong>{formatAUD(EMPLOYMENT.minimumWageHourly, 2)} per hour</strong> ({formatAUD(EMPLOYMENT.minimumWageWeekly, 2)} per week). Because penalty rates are a multiple of the base award rate, every penalty figure rose with it. Note the increase was <em>not</em> uniform: it was subject to a floor, so the lowest classifications in some awards were lifted to that floor rather than escalated by {(AWR_2026_FLOORS.increase * 100).toFixed(2)}%.</p>
              <p>Key changes affecting penalty rates and overtime in the {SITE_CONFIG.financialYear} financial year include:</p>
              <ul>
                <li>The superannuation guarantee rate is <strong>12%</strong>, and from 1 July 2026 super must be paid on each payday rather than quarterly. Overtime hours generally still do not attract superannuation (see FAQ below)</li>
                <li>The <strong>$18,201&ndash;$45,000</strong> bracket is now taxed at <strong>15%</strong>, down from 16%, and the <strong>$45,001&ndash;$135,000</strong> bracket at 30% &mdash; so penalty rate income is taxed slightly more lightly this year</li>
                <li>The &quot;Right to Disconnect&quot; provisions (effective August 2024 for large employers, August 2025 for small employers) give employees the right to refuse contact outside working hours unless the refusal is unreasonable</li>
                <li>Casual conversion pathway changes streamline the process for casual workers to convert to permanent employment after 12 months</li>
              </ul>
              <p>Penalty rate earnings between $45,001 and $135,000 are taxed at <strong>30%</strong>. The 32.5% bracket that many older guides still quote has not existed since the Stage 3 changes. Use the <Link href="/income-tax-calculator/">Income Tax Calculator</Link> to model your total earnings including penalties.</p>
            </section>

            {/* ── CONTEXT BORDER ── */}

            {/* ───────── SECTION 10: Related Resources ───────── */}
            <section id="related-resources">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Resources</h2>
              <p>Explore these tools and guides to calculate your total take-home pay including overtime, penalty rates, superannuation, and income tax for the {SITE_CONFIG.financialYear} financial year.</p>
              <ul>
                <li><Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> -- Enter your base rate, penalty multiplier, and hours to calculate after-tax overtime earnings</li>
                <li><Link href="/award-rates/">Award Rates Guide</Link> -- How modern awards set minimum pay, and which one covers you</li>
                <li><Link href="/retail-award-rates/">Retail Award Rates</Link> -- Full classification table and penalty rates for {RETAIL_AWARD.code}</li>
                <li><Link href="/hospitality-award-rates/">Hospitality Award Rates</Link> -- Classification rates, flat-cash evening loadings and junior scales</li>
                <li><Link href="/schads-award-pay-rates/">SCHADS Award Pay Rates</Link> -- Social, community, home care and disability, with the Equal Remuneration Order applied</li>
                <li><Link href="/junior-pay-rates/">Junior Pay Rates</Link> -- Minimum wage by age across awards</li>
                <li><Link href="/take-home-pay-calculator/">Take Home Pay Calculator</Link> -- Calculate your net pay after tax, Medicare levy, and superannuation deductions</li>
                <li><Link href="/hourly-to-annual-salary-calculator/">Hourly to Annual Salary Calculator</Link> -- Convert hourly rates to annual salary equivalents for comparison</li>
                <li><Link href="/income-tax-calculator/">Income Tax Calculator</Link> -- Model your total income tax including penalty rate earnings across FY{SITE_CONFIG.financialYear} brackets</li>
                <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link> -- Estimate your employer SG contributions and projected super balance at retirement</li>
              </ul>
            </section>

            {/* ───────── SECTION 11: FAQs ───────── */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <FaqAccordion faqs={PENALTY_RATES_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works"><p>The retail, hospitality and SCHADS penalty tables on this page derive from constants verified against the Fair Work Ombudsman pay guides and consolidated award texts, and are regression-tested &mdash; including the two rules most often modelled wrongly, that hospitality evening and night loadings are flat cash rather than multipliers, and that casual penalties are additive rather than compounded. Rates are current from {AWR_EFFECTIVE}. We do not publish penalty figures for awards we have not verified; those link to Fair Work instead. Tax calculations use ATO brackets for FY{SITE_CONFIG.financialYear}.</p></MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("overtime-penalty-rates-guide"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>
          </article>
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related Tools</h3><div className="space-y-3"><SidebarLink href="/overtime-pay-calculator/" label="Overtime Calculator" /><SidebarLink href="/retail-award-rates/" label="Retail Award Rates" /><SidebarLink href="/hospitality-award-rates/" label="Hospitality Award Rates" /><SidebarLink href="/schads-award-pay-rates/" label="SCHADS Award Rates" /><SidebarLink href="/junior-pay-rates/" label="Junior Pay Rates" /><SidebarLink href="/award-rates/" label="Award Rates Guide" /></div></CardContent></Card>
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

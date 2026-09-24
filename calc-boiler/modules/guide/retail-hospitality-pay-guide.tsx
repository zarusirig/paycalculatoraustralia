import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import FaqAccordion from "@/components/common/faq-accordion";
import { RETAIL_HOSPITALITY_FAQS } from "./retail-hospitality-pay-guide-faqs";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, formatAUD, calculatePayBreakdown } from "@/lib/constants";
import { EMPLOYMENT } from "@/lib/constants/australian-tax";
import { HOSPITALITY_AWARD, HOSPITALITY_RATES, HOSPITALITY_PENALTIES, RETAIL_AWARD, RETAIL_RATES, RETAIL_PENALTIES } from "@/lib/constants/hospitality-award";

// Every rate below comes from the award constants (1 July 2026 pay guides).
// The old copy used a $25.44 Level 1 rate, public holiday +150%/+175% and
// +15% late-night/early-morning loadings, none of which match either award.
const pct = (m: number) => `${Math.round(m * 100)}%`;
const L1 = RETAIL_RATES[0].hourly;
const L1_CASUAL = L1 * (1 + RETAIL_AWARD.casualLoading);
const hosp = (level: string) => HOSPITALITY_RATES.find((r) => r.level === level)?.weekly ?? 0;
const TAKE_HOME_ROWS = [
  { label: "Retail Level 1, FT 38 hrs", gross: RETAIL_RATES[0].weekly * 52 },
  { label: "Retail Level 1, Casual 30 hrs/wk", gross: L1_CASUAL * 30 * 52 },
  { label: "Hospitality Level 3, FT", gross: hosp("Level 3") * 52 },
  { label: "Hospitality Level 6, FT", gross: hosp("Level 6") * 52 },
];
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const HOSP_L1 = HOSPITALITY_RATES.find((r) => r.level === "Level 1")!;
const RETAIL_L1 = RETAIL_RATES.find((r) => r.level === "Level 1")!;

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
            The hospitality award rate is the same in Queensland as in every other state, because the <a href={HOSPITALITY_AWARD.awardTextUrl} target="_blank" rel="noopener noreferrer" className="text-eucalyptus-dark hover:underline">{HOSPITALITY_AWARD.name} ({HOSPITALITY_AWARD.code})</a> is federal: its adult level 1 rate is {formatAUD(HOSP_L1.hourly, 2)} an hour from {HOSPITALITY_AWARD.operativeFrom}, or {formatAUD(HOSP_L1.hourly * (1 + HOSPITALITY_AWARD.casualLoading), 2)} for a casual. Retail workers are covered by the {RETAIL_AWARD.name} ({RETAIL_AWARD.code}), where level 1 is {formatAUD(RETAIL_L1.hourly, 2)} an hour. Both add weekend penalties, and this guide covers the two awards in detail.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/*
              The full rate tables that used to sit here have moved to
              /retail-award-rates/ and /hospitality-award-rates/, which own
              those terms. The tables here had drifted badly — the hospitality
              one listed Level 1 above Level 2 and disagreed with the Fair Work
              pay guide at every level. This page now covers what it is
              actually good at: what the job is like and what your rights are.
            */}
            <section id="award-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>What Retail and Hospitality Workers Are Paid</h2>
              <p>
                Almost everyone in these two industries is covered by one of two modern awards: the <strong>General Retail Industry Award ({RETAIL_AWARD.code})</strong> for shops and supermarkets, and the <strong>Hospitality Industry (General) Award ({HOSPITALITY_AWARD.code})</strong> for cafes, restaurants, pubs and hotels. Each sets a minimum rate for every classification level, and each has its own penalty rates, overtime rules and junior scales.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[32rem] text-sm text-left text-navy">
                    <caption className="sr-only">Entry and top adult rates for the retail and hospitality awards</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-3">Award</th>
                        <th scope="col" className="px-5 py-3">Entry rate</th>
                        <th scope="col" className="px-5 py-3">Top classification</th>
                        <th scope="col" className="px-5 py-3">Full table</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <th scope="row" className="px-5 py-3 text-left font-medium">Retail <span className="font-mono text-xs text-warmgray">{RETAIL_AWARD.code}</span></th>
                        <td className="px-5 py-3 font-medium">{formatAUD(RETAIL_RATES[0].hourly, 2)}/hr</td>
                        <td className="px-5 py-3">{formatAUD(RETAIL_RATES[RETAIL_RATES.length - 1].hourly, 2)}/hr</td>
                        <td className="px-5 py-3"><Link href="/retail-award-rates/" className="text-eucalyptus-dark hover:underline">Retail award rates &rarr;</Link></td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-5 py-3 text-left font-medium">Hospitality <span className="font-mono text-xs text-warmgray">{HOSPITALITY_AWARD.code}</span></th>
                        <td className="px-5 py-3 font-medium">{formatAUD(HOSPITALITY_RATES[0].hourly, 2)}/hr</td>
                        <td className="px-5 py-3">{formatAUD(HOSPITALITY_RATES[6].hourly, 2)}/hr</td>
                        <td className="px-5 py-3"><Link href="/hospitality-award-rates/" className="text-eucalyptus-dark hover:underline">Hospitality award rates &rarr;</Link></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-warmgray-light mt-2">Adult rates from {HOSPITALITY_AWARD.operativeFrom}. Casual employees add a {(HOSPITALITY_AWARD.casualLoading * 100).toFixed(0)}% loading.</p>
              </div>
              <p>
                <strong>The two awards are not interchangeable</strong>, and if you work across both — a bistro attached to a bottle shop, say — the differences matter. Hospitality pays evening and night work as a flat cash amount per hour; retail uses a percentage. Retail casuals receive the casual loading on overtime; hospitality casuals do not. And juniors aged 19 get 85% in hospitality against 80% in retail.
              </p>
              <p>
                Full classification tables, penalty rates, overtime and junior scales for each are on the dedicated pages: <Link href="/retail-award-rates/">retail award rates</Link> and <Link href="/hospitality-award-rates/">hospitality award rates</Link>. For junior rates across all awards, see <Link href="/junior-pay-rates/">junior pay rates</Link>.
              </p>
            </section>

            {/* ── Section 3: Penalty Rates ── */}
            <section id="penalty-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Penalty Rates</h2>
              <p>
                Both retail and hospitality awards include penalty rate provisions for work performed outside standard weekday hours. The following table shows the rate paid as a percentage of the ordinary (base) hourly rate. Casual percentages already include the 25% casual loading. Hospitality pays weekday evening and night work as a flat amount per hour instead.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">When</th>
                        <th className="px-5 py-3 text-right">FT/PT rate</th>
                        <th className="px-5 py-3 text-right">Casual rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Saturday (both awards)</td><td className="px-5 py-3 text-right font-medium">{pct(RETAIL_PENALTIES.saturday)}</td><td className="px-5 py-3 text-right">{pct(RETAIL_PENALTIES.casualSaturday)}</td></tr>
                      <tr><td className="px-5 py-3">Sunday (both awards)</td><td className="px-5 py-3 text-right font-medium">{pct(RETAIL_PENALTIES.sunday)}</td><td className="px-5 py-3 text-right">{pct(RETAIL_PENALTIES.casualSunday)}</td></tr>
                      <tr><td className="px-5 py-3">Public holiday (both awards)</td><td className="px-5 py-3 text-right font-medium">{pct(RETAIL_PENALTIES.publicHoliday)}</td><td className="px-5 py-3 text-right">{pct(RETAIL_PENALTIES.casualPublicHoliday)}</td></tr>
                      <tr><td className="px-5 py-3">Retail: weekday evening (after 6pm)</td><td className="px-5 py-3 text-right font-medium">{pct(RETAIL_PENALTIES.eveningAfter6pm)}</td><td className="px-5 py-3 text-right">{pct(RETAIL_PENALTIES.casualEveningAfter6pm)}</td></tr>
                      <tr><td className="px-5 py-3">Hospitality: weekday evening (7pm&ndash;midnight)</td><td className="px-5 py-3 text-right font-medium">+{formatAUD(HOSPITALITY_PENALTIES.eveningPerHour, 2)}/hr</td><td className="px-5 py-3 text-right">+{formatAUD(HOSPITALITY_PENALTIES.eveningPerHour, 2)}/hr</td></tr>
                      <tr><td className="px-5 py-3">Hospitality: weekday night (midnight&ndash;7am)</td><td className="px-5 py-3 text-right font-medium">+{formatAUD(HOSPITALITY_PENALTIES.nightPerHour, 2)}/hr</td><td className="px-5 py-3 text-right">+{formatAUD(HOSPITALITY_PENALTIES.nightPerHour, 2)}/hr</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Penalty rates make weekend and holiday shifts significantly more valuable. A Level 1 retail worker earning {formatAUD(L1, 2)}/hr base receives <strong>{formatAUD(L1 * RETAIL_PENALTIES.sunday, 2)}/hr</strong> on a Sunday shift ({pct(RETAIL_PENALTIES.sunday)}), and <strong>{formatAUD(L1 * RETAIL_PENALTIES.publicHoliday, 2)}/hr</strong> on a public holiday ({pct(RETAIL_PENALTIES.publicHoliday)}). Use the <Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> to model your penalty rate earnings.
              </p>
            </section>

            {/* ── Section 4: Your Rights ── */}
            <section id="your-rights">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Your Rights</h2>
              <p>
                Retail and hospitality workers have specific rights under the Fair Work Act and their respective Modern Awards that employers must comply with:
              </p>
              <ul>
                <li><strong>Minimum engagement:</strong> Casual employees must be engaged and paid for at least <strong>3 hours</strong> per shift under the retail award and <strong>2 consecutive hours</strong> under the hospitality award (cl 11.3), even if there is insufficient work.</li>
                <li><strong>Roster change notice:</strong> Employers must provide at least <strong>7 days&apos; notice</strong> of any roster change under the retail award. The hospitality award also requires 7 days&apos; notice, but allows changes with shorter notice by mutual agreement or in genuine emergencies.</li>
                <li><strong>Casual conversion:</strong> Since 26 August 2024, a casual employee who has worked for their employer for at least <strong>6 months</strong> (12 months for a small business employer) and believes they no longer fit the casual definition can notify their employer in writing that they want to change to full-time or part-time employment. The employer must respond in writing within 21 days and can refuse only on the grounds set out in the Fair Work Act.</li>
                <li><strong>Breaks:</strong> Under the retail award, a shift of more than 4 hours earns a 10-minute paid rest break, and more than 5 hours adds an unpaid meal break of at least 30 minutes. The hospitality award uses a different table: an elective unpaid meal break for shifts over 5 hours, a compulsory 30-minute unpaid meal break over 6 hours, and a 20-minute paid rest break over 8 hours.</li>
                <li><strong>Paid leave:</strong> Full-time and part-time staff accrue {EMPLOYMENT.annualLeaveWeeks} weeks of annual leave a year (pro rata for part-time) plus {EMPLOYMENT.personalLeaveDays} days of personal leave; casuals get the loading instead. Check what you have built up with the <Link href="/leave-calculator/">annual leave calculator</Link>.</li>
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
                Below are take-home pay estimates for common retail and hospitality scenarios at the 1 July 2026 award rates, using FY{SITE_CONFIG.financialYear} tax rates (LITO and Medicare levy applied):
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
                      {TAKE_HOME_ROWS.map((r) => (
                        <tr key={r.label}><td className="px-5 py-3">{r.label}</td><td className="px-5 py-3 text-right">{formatAUD(r.gross)}</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(calculatePayBreakdown({ grossSalary: r.gross }).takeHomePay)}</td></tr>
                      ))}
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
              <FaqAccordion faqs={RETAIL_HOSPITALITY_FAQS} className="not-prose mt-6 space-y-3" itemClassName="border rounded-lg px-4 bg-white" triggerClassName="text-left font-semibold text-navy" contentClassName="text-warmgray" />
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Award rates are sourced from the Fair Work Commission pay guides for the General Retail Industry Award (MA000004) and the Hospitality Industry (General) Award (MA000009) operative from 1 July 2026. Rates reflect the most recent Annual Wage Review increase. Tax calculations use ATO marginal rates for FY{SITE_CONFIG.financialYear} including the 2% Medicare levy. Take-home pay examples assume no HECS-HELP debt, no private health insurance, and standard tax offsets.</p>
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

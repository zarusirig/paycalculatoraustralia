import Link from "next/link";
import { ChevronRight, ExternalLink, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, EMPLOYMENT, formatAUD } from "@/lib/constants";
import {
  AWR_2026_FLOORS,
  HOSPITALITY_AWARD,
  HOSPITALITY_PENALTIES,
  RETAIL_AWARD,
  RETAIL_OVERTIME,
  RETAIL_PENALTIES,
  RETAIL_RATES,
} from "@/lib/constants/hospitality-award";
import { SCHADS_SACS } from "@/lib/constants/schads-award";
import { AWARD_DIRECTORY } from "@/lib/constants/award-directory";
import { NMW, QLD_STATE_WAGE_CASE_2026, WA_STATE_MINIMUM_WAGE } from "@/lib/constants/minimum-wage";
import { FAST_FOOD_AWARD, MANUFACTURING_AWARD, PHARMACY_AWARD, SECURITY_AWARD, roundCents } from "@/lib/constants/modern-awards";
import { AWARD_HUB_FAQS } from "@/modules/guide/award-rates-faqs";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";

const SOURCES_LIST: SourceLink[] = [
  { title: "Awards", url: "https://www.fairwork.gov.au/employment-conditions/awards", publisher: SOURCES.fwo.name },
  { title: "Find my award", url: "https://calculate.fairwork.gov.au/FindYourAward", publisher: SOURCES.fwo.name },
  { title: "Annual Wage Review 2025–26 decision [2026] FWCFB 3500", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews", publisher: SOURCES.fwc.name },
  { title: "National Minimum Wage Order 2026 (PR799279)", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr799279.pdf", publisher: SOURCES.fwc.name },
  { title: "Consolidated modern award texts", url: "https://awards.fairwork.gov.au/", publisher: SOURCES.fwc.name },
];

const SCHADS_TOP = SCHADS_SACS[SCHADS_SACS.length - 1];
const R1 = RETAIL_RATES[0];
const cents = (v: number) => formatAUD(roundCents(v), 2);
const pct = (v: number) => `${Math.round(v * 100)}%`;

// A worked week for a Level 1 retail casual, computed from the constants.
const CASUAL_BASE = roundCents(R1.hourly * 1.25);
const WEEK = [
  { day: "Monday", hours: 8, mult: 1.25, label: "casual base" },
  { day: "Wednesday", hours: 8, mult: 1.25, label: "casual base" },
  { day: "Saturday", hours: 6, mult: RETAIL_PENALTIES.casualSaturday, label: `casual Saturday ${pct(RETAIL_PENALTIES.casualSaturday)}` },
  { day: "Sunday", hours: 5, mult: RETAIL_PENALTIES.casualSunday, label: `casual Sunday ${pct(RETAIL_PENALTIES.casualSunday)}` },
].map((d) => {
  const rate = roundCents(R1.hourly * d.mult);
  return { ...d, rate, gross: roundCents(rate * d.hours) };
});
const WEEK_HOURS = WEEK.reduce((s, d) => s + d.hours, 0);
const WEEK_GROSS = roundCents(WEEK.reduce((s, d) => s + d.gross, 0));

export default function AwardRatesGuidePage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Award Rates</span></li>
          </ol>
        </nav>

        <header className="mb-10 max-w-4xl lg:mb-16">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-navy md:text-5xl" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Award Rates {SITE_CONFIG.financialYear}: Pay Rates for Every Major Modern Award, A–Z
          </h1>
          <p className="mb-5 text-xl leading-relaxed text-warmgray">
            Current minimum award pay rates in Australia from {HOSPITALITY_AWARD.operativeFrom}. {AWARD_DIRECTORY.length} awards with full verified rate tables &mdash; casual, penalty, junior and overtime rates &mdash; plus how to work out which award covers you.
          </p>
          <div className="mb-6 rounded-xl border-l-4 border-eucalyptus-dark bg-sandstone p-5">
            <p className="text-base leading-relaxed text-navy">
              <strong>Direct answer:</strong> Modern award rates are the legal minimum pay for most Australian employees. Each award sets a rate for every classification level, then penalty rates, overtime and allowances on top. From the first full pay period on or after {HOSPITALITY_AWARD.operativeFrom}, adult Level 1 rates in the major awards run from {formatAUD(Math.min(...AWARD_DIRECTORY.map((a) => a.headlineHourly)), 2)} to {formatAUD(Math.max(...AWARD_DIRECTORY.map((a) => a.headlineHourly)), 2)} an hour, and the national minimum wage is {formatAUD(EMPLOYMENT.minimumWageHourly, 2)}.
            </p>
          </div>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col gap-12 lg:flex-row">
          <article className="prose prose-lg prose-blue max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy lg:w-2/3">

            <section id="award-rates-a-z">
              <h2>Award Rates A–Z</h2>
              <p>
                Every award we publish a full, clause-cited rate table for. The headline figure is the adult Level 1 (or first adult) classification &mdash; the rate a new adult starter is most likely to be on. Casual adds the 25% loading.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[40rem] text-left text-sm text-navy">
                    <caption className="sr-only">Modern award pay rates A to Z from {HOSPITALITY_AWARD.operativeFrom}</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Award</th>
                        <th scope="col" className="px-5 py-4">Level 1 hourly</th>
                        <th scope="col" className="px-5 py-4">Casual</th>
                        <th scope="col" className="px-5 py-4">Weekly (38 hrs)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {AWARD_DIRECTORY.map((a) => (
                        <tr key={a.href}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">
                            <Link href={a.href} className="text-eucalyptus-dark hover:underline">{a.name}</Link>
                            <span className="ml-2 font-mono text-xs text-warmgray">{a.code}</span>
                            <span className="mt-0.5 block text-xs font-normal text-warmgray">{a.covers} &middot; {a.headlineLevel}</span>
                          </th>
                          <td className="px-5 py-3 font-medium">{formatAUD(a.headlineHourly, 2)}</td>
                          <td className="px-5 py-3">{cents(a.headlineHourly * 1.25)}</td>
                          <td className="px-5 py-3">{formatAUD(a.headlineWeekly, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray-light">
                  Every figure is read from constants transcribed from the Fair Work Commission&rsquo;s consolidated award texts and regression-tested. Rates apply from the first full pay period on or after {HOSPITALITY_AWARD.operativeFrom}.
                </p>
              </div>
              <p>
                Level 1 rates sit close together because the Annual Wage Review floor lifts the lowest classifications to a common minimum. They diverge higher up: the SCHADS social and community services stream reaches {formatAUD(SCHADS_TOP.hourly, 2)} an hour at its top classification because of the Equal Remuneration Order, and a pharmacist manager earns {formatAUD(PHARMACY_AWARD.rates[PHARMACY_AWARD.rates.length - 1].hourly, 2)}.
              </p>
              <p>
                Not listed? Australia has more than 120 modern awards. For any other award, use the Fair Work Ombudsman&apos;s <a href="https://calculate.fairwork.gov.au/FindYourAward" target="_blank" rel="noopener noreferrer">Find My Award</a> tool and open its pay guide &mdash; we would rather send you to the source than print a number we have not verified.
              </p>
            </section>

            <section id="what-are-award-rates">
              <h2>What Are Award Rates in Australia?</h2>
              <p>
                Award rates are the legally enforceable minimum pay rates set out in modern awards &mdash; instruments made by the Fair Work Commission under the Fair Work Act 2009 for an industry or occupation. An award sets the minimum hourly rate for each classification, plus overtime, penalty rates, allowances and some leave rules.
              </p>
              <p>
                Awards are the middle tier of Australia&apos;s safety net. The National Minimum Wage sits beneath them for award-free employees; an enterprise agreement, where one applies, replaces the award but must leave employees better off overall. Use our <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> to turn an award rate into after-tax pay.
              </p>
            </section>

            <section id="how-are-award-rates-determined">
              <h2>How Are Award Rates Set Each Year?</h2>
              <p>
                The Fair Work Commission reviews every award rate in the Annual Wage Review, decided each June. New rates apply from the first full pay period starting on or after <strong>1 July</strong> &mdash; not universally on 1 July. For {SITE_CONFIG.financialYear} the increase was <strong>{(AWR_2026_FLOORS.increase * 100).toFixed(2)}%</strong>.
              </p>
              <p>
                That percentage was not applied uniformly. It was subject to two floors &mdash; {formatAUD(AWR_2026_FLOORS.ongoingWeekly, 2)} a week for ongoing employment and {formatAUD(AWR_2026_FLOORS.entryLevelWeekly, 2)} for an entry-level rate in the first six months &mdash; so the lowest classifications in some awards were lifted <em>to</em> the floor. Hospitality Introductory and Manufacturing C14 sit on the {formatAUD(AWR_2026_FLOORS.entryLevelWeekly, 2)} floor; hospitality Level 1 and Manufacturing C13 on the {formatAUD(AWR_2026_FLOORS.ongoingWeekly, 2)} floor. Adding {(AWR_2026_FLOORS.increase * 100).toFixed(2)}% to last year&rsquo;s rate gives the wrong answer for them.
              </p>
            </section>

            <section id="national-minimum-wage">
              <h2>National Minimum Wage vs Award Rates</h2>
              <p>
                The national minimum wage for {SITE_CONFIG.financialYear} is <strong>{formatAUD(EMPLOYMENT.minimumWageHourly, 2)} an hour</strong>, or <strong>{formatAUD(EMPLOYMENT.minimumWageWeekly, 2)} a week</strong> for {EMPLOYMENT.standardWeeklyHours} hours &mdash; about {formatAUD(EMPLOYMENT.minimumWageWeekly * 52)} a year before tax. It applies directly only to employees no award or agreement covers. A casual on the national minimum wage receives {cents(EMPLOYMENT.minimumWageHourly * 1.25)} an hour. See <Link href="/minimum-wage-australia/">the minimum wage in Australia</Link> for the full rules.
              </p>
              <div className="not-prose my-8 rounded-r-xl border-l-4 border-eucalyptus bg-sandstone p-5">
                <div className="flex items-start gap-4">
                  <ShieldAlert className="mt-0.5 h-6 w-6 flex-shrink-0 text-ochre" />
                  <div>
                    <h3 className="mb-1 text-base font-bold text-navy">An award rate is a floor, not a suggestion</h3>
                    <p className="text-sm text-navy">If an award covers your job, your employer must pay at least its rate for your classification &mdash; paying only the national minimum wage instead is an underpayment. Report underpayment to the Fair Work Ombudsman on 13 13 94.</p>
                  </div>
                </div>
              </div>
            </section>

            <section id="penalty-rates-explained">
              <h2>How Do Penalty Rates Work?</h2>
              <p>
                Penalty rates are percentages of the base hourly rate paid for work at unsociable times. They differ between awards far more than most tables suggest. Using the General Retail Industry Award Level 1 ({formatAUD(R1.hourly, 2)}/hr) as the worked example:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[34rem] text-left text-sm text-navy">
                    <caption className="sr-only">General Retail Industry Award penalty and overtime rates, Level 1</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">When you work</th>
                        <th scope="col" className="px-5 py-4">Full-time / part-time</th>
                        <th scope="col" className="px-5 py-4">Casual</th>
                        <th scope="col" className="px-5 py-4">Level 1 $ (perm / casual)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {[
                        { l: "Monday to Friday", p: 1, c: 1.25 },
                        { l: "Monday to Friday after 6pm", p: RETAIL_PENALTIES.eveningAfter6pm, c: RETAIL_PENALTIES.casualEveningAfter6pm },
                        { l: "Saturday", p: RETAIL_PENALTIES.saturday, c: RETAIL_PENALTIES.casualSaturday },
                        { l: "Sunday", p: RETAIL_PENALTIES.sunday, c: RETAIL_PENALTIES.casualSunday },
                        { l: "Public holiday", p: RETAIL_PENALTIES.publicHoliday, c: RETAIL_PENALTIES.casualPublicHoliday },
                        { l: "Overtime Mon–Sat, first 3 hours", p: RETAIL_OVERTIME.weekdayFirst3Hours, c: RETAIL_OVERTIME.casualWeekdayFirst3Hours },
                        { l: "Overtime Mon–Sat, after 3 hours", p: RETAIL_OVERTIME.weekdayAfter3Hours, c: RETAIL_OVERTIME.casualWeekdayAfter3Hours },
                      ].map((r) => (
                        <tr key={r.l}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{r.l}</th>
                          <td className="px-5 py-3 font-medium">{pct(r.p)}</td>
                          <td className="px-5 py-3 font-medium">{pct(r.c)}</td>
                          <td className="px-5 py-3">{cents(R1.hourly * r.p)} / {cents(R1.hourly * r.c)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-2 text-xs text-warmgray-light">General Retail Industry Award (MA000004). Casual penalties add the 25% loading rather than multiplying by it. See <Link href="/retail-award-rates/" className="text-eucalyptus-dark hover:underline">retail award rates</Link> for every level.</p>
              </div>
              <h3>The same day pays differently under different awards</h3>
              <ul>
                <li><strong>Sunday:</strong> {pct(RETAIL_PENALTIES.sunday)} in retail and {pct(HOSPITALITY_PENALTIES.sunday)} in hospitality, but {pct(FAST_FOOD_AWARD.penalties.find((p) => p.label.startsWith("Sunday (Level 1"))!.fullTime)} for a fast food Level 1 employee and 200% for a security officer or clerk.</li>
                <li><strong>Evenings:</strong> hospitality adds a flat {formatAUD(HOSPITALITY_PENALTIES.eveningPerHour, 2)} an hour rather than a percentage; security weeknights between 6pm and 6am are {(SECURITY_AWARD.penalties[0].fullTime * 100).toFixed(1)}%.</li>
                <li><strong>Pharmacy</strong> penalties change with the time of day &mdash; Saturday is 125% between 8am and 6pm but 200% before 8am.</li>
                <li><strong>Manufacturing</strong> compounds casual penalties: a casual&rsquo;s 150% is 150% of the casual rate, which is {cents(roundCents(MANUFACTURING_AWARD.rates[0].hourly * 1.25) * 1.5)} at C14.</li>
              </ul>
              <p>
                For how overtime and shift loadings work in general, see our <Link href="/overtime-penalty-rates-guide/">overtime and penalty rates guide</Link>.
              </p>
            </section>

            <section id="worked-example">
              <h2>How Is Award Pay Calculated? A Worked Week</h2>
              <p>
                Award pay is the classification rate multiplied by hours, with the penalty for each day applied. A Level 1 casual retail worker ({formatAUD(CASUAL_BASE, 2)}/hr ordinary) working this roster earns:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[30rem] text-left text-sm text-navy">
                    <caption className="sr-only">Worked week for a Level 1 casual retail employee</caption>
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th scope="col" className="px-5 py-4">Day</th>
                        <th scope="col" className="px-5 py-4">Hours</th>
                        <th scope="col" className="px-5 py-4">Rate</th>
                        <th scope="col" className="px-5 py-4">Gross</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      {WEEK.map((d) => (
                        <tr key={d.day}>
                          <th scope="row" className="px-5 py-3 text-left font-medium">{d.day}</th>
                          <td className="px-5 py-3">{d.hours}</td>
                          <td className="px-5 py-3">{formatAUD(d.rate, 2)} ({d.label})</td>
                          <td className="px-5 py-3">{formatAUD(d.gross, 2)}</td>
                        </tr>
                      ))}
                      <tr className="bg-eucalyptus/5 font-bold">
                        <th scope="row" className="px-5 py-3 text-left">Week</th>
                        <td className="px-5 py-3">{WEEK_HOURS}</td>
                        <td className="px-5 py-3">&mdash;</td>
                        <td className="px-5 py-3">{formatAUD(WEEK_GROSS, 2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                That is {formatAUD(WEEK_GROSS, 2)} gross for {WEEK_HOURS} hours, an average of {cents(WEEK_GROSS / WEEK_HOURS)} an hour. The employer pays superannuation on top. Enter your own roster in the <Link href="/weekly-pay-calculator/">weekly pay calculator</Link> to see the after-tax figure.
              </p>
            </section>

            <section id="award-vs-enterprise-agreement">
              <h2>Award Rate or Enterprise Agreement?</h2>
              <p>
                An enterprise agreement is negotiated for a single employer and, once approved, replaces the award for the employees it covers. It must pass the Better Off Overall Test against the award, so an agreement can restructure penalty rates but cannot leave employees worse off overall. Large retailers and fast food chains commonly operate under agreements &mdash; see <Link href="/pay-rates/">pay rates by employer</Link>. If an agreement is terminated, the award applies again.
              </p>
            </section>

            <section id="how-to-find-your-award">
              <h2>How Do You Find Your Award?</h2>
              <ol>
                <li>Open the Fair Work Ombudsman&apos;s Find My Award tool.</li>
                <li>Choose your industry and answer the questions about your role.</li>
                <li>Note the award name, code (for example MA000004) and your classification level.</li>
                <li>Check your classification rate in the A–Z table above, or in the award&apos;s pay guide.</li>
              </ol>
              <p>
                To price a particular day, shift or employment type, run the award, level and hours through the Fair Work Ombudsman&apos;s Pay and Conditions Tool; our <Link href="/fair-work-pay-calculator/">Fair Work pay calculator</Link> guide explains what it asks and the rates behind it.
              </p>
              <p>
                If no award covers you, you are award-free: the National Employment Standards and the national minimum wage still apply. To check what is on your payslip, read <Link href="/understanding-your-payslip/">understanding your payslip</Link>.
              </p>
              <div className="not-prose mt-6">
                <a href="https://calculate.fairwork.gov.au/FindYourAward" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md border border-transparent bg-eucalyptus-dark px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-navy">
                  Use Fair Work&apos;s Find My Award tool
                  <ExternalLink className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </section>

            <section id="what-changed">
              <h2>What Changed for {SITE_CONFIG.financialYear}?</h2>
              <ul>
                <li><strong>A {(AWR_2026_FLOORS.increase * 100).toFixed(2)}% increase with floors</strong> from the first full pay period on or after 1 July 2026. The national minimum wage rose from {formatAUD(EMPLOYMENT.minimumWageHourlyPrevious, 2)} to {formatAUD(EMPLOYMENT.minimumWageHourly, 2)} an hour. See the <Link href="/minimum-wage-history-australia/">minimum wage history</Link>.</li>
                <li><strong>Junior rates are rising from 1 December 2026</strong> in the retail, fast food and pharmacy awards, for 18–20 year olds with more than 6 months&apos; service &mdash; a phase-in to the adult rate by 2029, not an immediate jump. See the <Link href="/fast-food-award-rates/#junior-rates">fast food</Link>, <Link href="/retail-award-rates/#junior-rates">retail</Link> and <Link href="/pharmacy-award-rates/#junior-rates">pharmacy</Link> schedules.</li>
                <li><strong>Payday Super:</strong> from 1 July 2026 the 12% superannuation guarantee must be paid with each pay rather than quarterly.</li>
              </ul>
            </section>

            <section id="related-resources">
              <h2>Related Guides</h2>
              <ul>
                <li><Link href="/junior-pay-rates/">Junior pay rates</Link> &mdash; minimum wage by age and every award&apos;s junior scale.</li>
                <li><Link href="/overtime-penalty-rates-guide/">Overtime and penalty rates</Link> &mdash; how loadings and overtime are calculated.</li>
                <li><Link href="/take-home-pay-calculator/">Take-home pay calculator</Link> &mdash; your award rate after tax.</li>
                <li><Link href="/weekly-pay-calculator/">Weekly pay calculator</Link> &mdash; a mixed roster of shifts.</li>
                <li><Link href="/backpay-calculator/">Backpay calculator</Link> &mdash; what is owed if you were underpaid.</li>
              </ul>
            </section>

            <section id="award-rates-by-state">
              <h2>Award Rates in NSW, QLD, Victoria and Other States: Is There a Difference?</h2>
              <p>
                No. Modern award rates are set nationally by the Fair Work Commission, so the {RETAIL_AWARD.name} level 1 rate of {formatAUD(R1.hourly, 2)} an hour is the same in NSW, Queensland, Victoria, South Australia, Tasmania, the ACT and the Northern Territory, and the same holds for all {AWARD_DIRECTORY.length} awards in the <a href="#award-rates-a-z">A&ndash;Z above</a> (<a href="https://www.fairwork.gov.au/pay-and-wages/minimum-wages" target="_blank" rel="noopener noreferrer">Fair Work Ombudsman, minimum wages</a>). Two groups of employees sit outside the national system.
              </p>
              <p>
                <strong>Western Australia.</strong> Sole traders, partnerships and other unincorporated WA employers are in the WA state system, which has its own minimum wage of {formatAUD(WA_STATE_MINIMUM_WAGE.weekly, 2)} a week ({formatAUD(WA_STATE_MINIMUM_WAGE.hourly, 2)} an hour) from {WA_STATE_MINIMUM_WAGE.operativeFrom} (<a href={WA_STATE_MINIMUM_WAGE.url} target="_blank" rel="noopener noreferrer">wa.gov.au</a>). Incorporated WA employers are in the national system and pay the modern award rates.
              </p>
              <p>
                <strong>Queensland.</strong> State and local government employees are covered by the Queensland state system. Its minimum wage is {formatAUD(QLD_STATE_WAGE_CASE_2026.qmwWeekly, 2)} a week from {QLD_STATE_WAGE_CASE_2026.operativeFrom}, after the {(QLD_STATE_WAGE_CASE_2026.increase * 100).toFixed(2)}% increase in the {QLD_STATE_WAGE_CASE_2026.citation} decision (<a href={QLD_STATE_WAGE_CASE_2026.url} target="_blank" rel="noopener noreferrer">QIRC</a>). Queensland private-sector employees are on the national awards.
              </p>
              <p>
                What does differ by state is the calendar around the rate. Each state declares its own public holidays, so which days attract public-holiday penalty rates depends on where you work: see the <Link href="/pay-calculator-nsw/">NSW</Link>, <Link href="/pay-calculator-qld/">Queensland</Link> and <Link href="/pay-calculator-vic/">Victoria</Link> pay pages. Long service leave is state law, with a different accrual in each jurisdiction (<Link href="/long-service-leave-calculator/">long service leave calculator</Link>).
              </p>
              <p>
                Under every award sits the national minimum wage of {formatAUD(NMW.hourly, 2)} an hour, the floor for employees no award covers; see <Link href="/minimum-wage-australia/">minimum wage Australia</Link>.
              </p>
            </section>

            <section id="faq">
              <h2>Frequently Asked Questions</h2>
              <div className="sr-only">
                <h3>Award rate questions and answers</h3>
                {AWARD_HUB_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
              </div>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                {AWARD_HUB_FAQS.map((f) => (
                  <AccordionItem key={f.q} value={f.q} className="rounded-lg border bg-white px-4">
                    <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-navy">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            <div className="not-prose mt-12">
              <MethodologyDisclosure title="How this guide works">
                <p>Every rate on this page is read from constants transcribed from the Fair Work Commission&rsquo;s consolidated award texts (consolidated to 1 July 2026) and the Fair Work Ombudsman pay guides, with the clause cited on each award page, and pinned by automated tests. Rates apply to national system employees from the first full pay period on or after 1 July 2026. We list only awards we have verified line by line; for any other award we link to Fair Work rather than publish an unverified figure.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
              {(() => { const a = getGuideAuthorship("award-rates"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>
          </article>

          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="border-sandstone-dark/20 bg-sandstone">
                <CardContent className="p-6">
                  <h2 className="mb-3 block font-bold text-navy">Award Rate Tables</h2>
                  <div className="space-y-2">
                    {AWARD_DIRECTORY.map((a) => (
                      <Link key={a.href} href={a.href} className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-3 transition-all hover:border-eucalyptus/40 hover:shadow-sm">
                        <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{a.name.replace(/ Award 20\d\d$/, "")}</span>
                        <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                      </Link>
                    ))}
                    <Link href="/junior-pay-rates/" className="group flex items-center justify-between rounded-lg border border-sandstone-dark/20 bg-white p-3 transition-all hover:border-eucalyptus/40 hover:shadow-sm">
                      <span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">Junior Pay Rates</span>
                      <ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-none bg-eucalyptus-dark text-white shadow-md">
                <CardContent className="p-6">
                  <h2 className="mb-2 text-lg font-bold">Check your take-home pay</h2>
                  <p className="mb-4 text-sm text-eucalyptus-light">Found your award rate? See what it leaves you after tax.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full rounded-md bg-white px-4 py-2.5 text-center text-sm font-semibold text-eucalyptus-dark transition-colors hover:bg-sandstone/50">
                    Take-Home Pay Calculator
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

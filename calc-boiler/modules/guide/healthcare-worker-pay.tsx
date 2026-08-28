"use client";
import Link from "next/link";
import { ChevronRight, ArrowRight, Calculator } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { SITE_CONFIG, SOURCES, calculatePayBreakdown, formatAUD } from "@/lib/constants";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import {
  NURSING_PAY_BY_STATE,
  NURSING_PAY_STATES,
  NURSING_PAY_STATES_NOT_BUILT,
  annualFor,
  registeredNurseRange,
  takeHomeHref,
} from "@/lib/data/nursing-pay";
import {
  NURSES_AWARD,
  NURSES_AWARD_GENERAL,
  NURSES_AWARD_AGED_CARE,
} from "@/lib/data/nursing-pay/nurses-award-2020";
import type { ScaleFamily } from "@/lib/data/nursing-pay/types";

const STATES = NURSING_PAY_STATES.map((slug) => NURSING_PAY_BY_STATE[slug]).filter(
  (s): s is NonNullable<typeof s> => Boolean(s),
);

const SOURCES_LIST: SourceLink[] = [
  { title: "Nurses Award 2020 [MA000034] — consolidated award text", url: "https://awards.fairwork.gov.au/MA000034.html", publisher: SOURCES.fwo.name },
  // The primary wage instrument behind each state figure quoted on this page.
  ...STATES.map((s) => ({
    title: `${s.instruments[0].name} — rates effective ${s.instruments[0].effectiveFrom}`,
    url: s.instruments[0].source.url,
    publisher: s.instruments[0].source.publisher,
  })),
  { title: "Salary packaging", url: "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/fringe-benefits-tax", publisher: SOURCES.ato.name },
  { title: "Healthcare earnings", url: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia", publisher: SOURCES.abs.name },
];

/**
 * Nurse figures on this hub are derived from the six verified state pay scales
 * in lib/data/nursing-pay, not from survey averages. `spread` returns the
 * lowest and highest published entry (or top) rate across those states, so the
 * hub can never disagree with a spoke.
 */
function spread(pick: "entry" | "top"): { low: number; high: number; lowState: string; highState: string } {
  const rows = STATES.map((s) => ({ state: s.shortName, value: registeredNurseRange(s)![pick] }));
  const sorted = [...rows].sort((a, b) => a.value - b.value);
  return {
    low: sorted[0].value,
    high: sorted[sorted.length - 1].value,
    lowState: sorted[0].state,
    highState: sorted[sorted.length - 1].state,
  };
}

/** Lowest and highest published entry rate for a family, across the six states. */
function familySpread(family: ScaleFamily): { low: number; high: number } | null {
  const values: number[] = [];
  for (const state of STATES) {
    for (const scale of state.scales.filter((s) => s.family === family)) {
      for (const point of scale.points) {
        const annual = annualFor(point);
        if (annual !== null) values.push(annual);
      }
    }
  }
  if (values.length === 0) return null;
  return { low: Math.min(...values), high: Math.max(...values) };
}

const RN_ENTRY = spread("entry");
const RN_TOP = spread("top");
const NP_SPREAD = familySpread("practitioner");
const EN_SPREAD = familySpread("enrolled");

const AWARD_RN1 = NURSES_AWARD_GENERAL.find((s) => s.classification === "Registered nurse — level 1")!;
const AWARD_AGED_RN1 = NURSES_AWARD_AGED_CARE.find((s) => s.classification === "Registered nurse — aged care level 1")!;

function afterTax(gross: number): number {
  return calculatePayBreakdown({ grossSalary: gross }).takeHomePay;
}

export default function HealthcareWorkerPayPage() {
  return (
    <div className="min-h-screen flex-grow bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

        {/* BREADCRUMBS */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol className="flex items-center space-x-1 text-sm text-warmgray">
            <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
            <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
            <li><span className="font-medium text-navy" aria-current="page">Healthcare Worker Pay Guide</span></li>
          </ol>
        </nav>

        {/* HERO HEADER */}
        <header className="mb-10 lg:mb-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Healthcare Worker Pay Guide — Salaries, Penalties &amp; Salary Packaging
          </h1>
          <p className="text-xl text-warmgray leading-relaxed mb-6">
            Healthcare is one of Australia&apos;s largest employers, with over 1.9 million workers. From registered nurses to specialists, pay varies widely based on classification, experience, shift patterns, and whether you work in the public or private sector. This guide covers salaries, penalty rates, and the powerful salary packaging benefits available to public hospital employees.
          </p>
          <TrustBar className="!max-w-none" />
        </header>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* MAIN ARTICLE CONTENT */}
          <article className="lg:w-2/3 prose prose-blue prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark hover:prose-a:text-navy">

            {/* ── Section 1: Average Healthcare Salaries ── */}
            <section id="healthcare-salaries">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Average Healthcare Salaries</h2>
              <p>
                Healthcare salaries in Australia vary enormously depending on profession, classification level, and years of experience. Nurses and midwives are covered by state-based enterprise agreements that specify salary bands, while doctors progress through a separate classification system. Allied health professionals (physiotherapists, pharmacists, occupational therapists) fall under their own award or enterprise agreement structures.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Role</th>
                        <th className="px-5 py-3 text-right">Salary Range (Annual)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Registered Nurse — entry step, public health system<span className="block text-xs text-warmgray-light">Lowest in {RN_ENTRY.lowState}, highest in {RN_ENTRY.highState}</span></td><td className="px-5 py-3 text-right font-medium">{formatAUD(RN_ENTRY.low)} – {formatAUD(RN_ENTRY.high)}</td></tr>
                      <tr><td className="px-5 py-3">Registered Nurse — top of the base scale<span className="block text-xs text-warmgray-light">Lowest in {RN_TOP.lowState}, highest in {RN_TOP.highState}</span></td><td className="px-5 py-3 text-right font-medium">{formatAUD(RN_TOP.low)} – {formatAUD(RN_TOP.high)}</td></tr>
                      {EN_SPREAD ? (<tr><td className="px-5 py-3">Enrolled Nurse — across the six state scales</td><td className="px-5 py-3 text-right font-medium">{formatAUD(EN_SPREAD.low)} – {formatAUD(EN_SPREAD.high)}</td></tr>) : null}
                      {NP_SPREAD ? (<tr><td className="px-5 py-3">Nurse Practitioner — across the six state scales</td><td className="px-5 py-3 text-right font-medium">{formatAUD(NP_SPREAD.low)} – {formatAUD(NP_SPREAD.high)}</td></tr>) : null}
                      <tr><td className="px-5 py-3">Junior Doctor (Intern / HMO)</td><td className="px-5 py-3 text-right font-medium">$85,000 – $100,000</td></tr>
                      <tr><td className="px-5 py-3">Registrar</td><td className="px-5 py-3 text-right font-medium">$120,000 – $160,000</td></tr>
                      <tr><td className="px-5 py-3">Specialist (Consultant)</td><td className="px-5 py-3 text-right font-medium">$250,000 – $500,000+</td></tr>
                      <tr><td className="px-5 py-3">Physiotherapist</td><td className="px-5 py-3 text-right font-medium">$70,000 – $90,000</td></tr>
                      <tr><td className="px-5 py-3">Pharmacist</td><td className="px-5 py-3 text-right font-medium">$75,000 – $100,000</td></tr>
                      <tr><td className="px-5 py-3">Aged Care Worker</td><td className="px-5 py-3 text-right font-medium">$55,000 – $65,000</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                The nursing rows are not survey averages. They are the lowest and highest figures actually published in the six state pay scales below, and each one is traceable to a named enterprise agreement, certified agreement or state award. The doctor and allied health rows are indicative market bands and should be treated as such. Use the <Link href="/average-salary-australia/">Average Salary Australia</Link> page to compare healthcare pay against other industries.
              </p>
              <p>
                These figures are base salaries before penalty rates and allowances. Nurses and doctors who work regular evening, night and weekend shifts can earn <strong>15–30% more</strong> than the base salary through penalty rate loadings.
              </p>
            </section>

            {/* ── Nurse and midwife pay by state (spoke selector) ── */}
            <section id="nurse-pay-by-state">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Nurse &amp; Midwife Pay by State</h2>
              <p>
                Most Australian nurses and midwives are paid under their state public health system&apos;s own agreement, not under the federal award — and the classification structures are genuinely different in each state. NSW pays a &ldquo;Registered Nurse/Midwife 1st Year&rdquo;, Queensland a &ldquo;Nurse Grade 5 pay point 1&rdquo;, Victoria an &ldquo;RN Grade 2 Year 1&rdquo;, Western Australia a &ldquo;Registered Nurse/Midwife Level 1.1&rdquo;, South Australia a &ldquo;Registered Nurse/Midwife (Level 1) 1st increment&rdquo; and Tasmania a &ldquo;Registered Nurse Grade 3 Year 1&rdquo;. They are all entry registered nurse roles and they are all on different money.
              </p>
              <p>
                Pick your state for the full published scale — every grade, every increment, the instrument the figures come from, the effective date and the shift penalties.
              </p>
              <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
                {STATES.map((state) => {
                  const range = registeredNurseRange(state)!;
                  return (
                    <Link
                      key={state.slug}
                      href={`/healthcare-worker-pay/${state.slug}/`}
                      className="group flex items-start justify-between gap-3 rounded-lg border border-sandstone-dark/20 bg-white p-4 transition hover:border-eucalyptus/50 hover:shadow-sm"
                    >
                      <span>
                        <span className="block font-semibold text-navy group-hover:text-eucalyptus-dark">
                          Nurse pay in {state.name}
                        </span>
                        <span className="mt-0.5 block text-sm text-warmgray">
                          {state.scales.find((s) => s.family === "registered")?.gradeCode ?? "Registered nurse"}:{" "}
                          {formatAUD(range.entry)} – {formatAUD(range.top)}
                        </span>
                        <span className="mt-0.5 block text-xs text-warmgray-light">
                          {state.instruments[0].name.split(" (")[0]}, from {state.instruments[0].effectiveFrom}
                        </span>
                      </span>
                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-warmgray-light group-hover:text-eucalyptus" />
                    </Link>
                  );
                })}
              </div>
              <p className="text-sm text-warmgray-light">
                Not published yet: {NURSING_PAY_STATES_NOT_BUILT.join(" and ")}. Their instruments have not been read, and we would rather publish nothing than a guess.
              </p>
            </section>

            {/* ── The Nurses Award 2020 ── */}
            <section id="nurses-award-2020">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The Nurses Award 2020 — What It Is and Who It Actually Covers</h2>
              <p>
                The <strong>Nurses Award 2020</strong> (award code MA000034) is the federal modern award for nurses. It is the single most searched-for nursing pay document in Australia, and it is also the most misread: it is a <strong>safety net</strong>, not a pay scale. It sets the minimum below which no nurse in the country may lawfully be paid. It does not describe what most nurses are paid.
              </p>
              <p>
                If you work in a state public hospital, the award is almost certainly not your rate. Every state public health system has an enterprise agreement, certified agreement or state award that pays well above the floor — in some cases by more than $25,000 a year at the entry step. The award matters where no agreement applies: private hospitals, GP and specialist clinics, aged care, and some agency work.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[34rem] text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Registered nurse — entry rate</th>
                        <th className="px-5 py-3 text-right">Weekly</th>
                        <th className="px-5 py-3 text-right">Hourly</th>
                        <th className="px-5 py-3 text-right">A full year</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr>
                        <td className="px-5 py-3">Nurses Award 2020 — level 1 pay point 1<span className="block text-xs text-warmgray-light">Other than aged care, from {NURSES_AWARD.generalRatesFrom}</span></td>
                        <td className="px-5 py-3 text-right">{formatAUD(AWARD_RN1.points[0].weekly, 2)}</td>
                        <td className="px-5 py-3 text-right">{formatAUD(AWARD_RN1.points[0].hourly, 2)}</td>
                        <td className="px-5 py-3 text-right font-medium">{formatAUD(AWARD_RN1.points[0].weekly * 52)}</td>
                      </tr>
                      <tr>
                        <td className="px-5 py-3">Nurses Award 2020 — aged care level 1, first year<span className="block text-xs text-warmgray-light">Aged care stream, from {NURSES_AWARD.agedCareRatesFrom}</span></td>
                        <td className="px-5 py-3 text-right">{formatAUD(AWARD_AGED_RN1.points[0].weekly, 2)}</td>
                        <td className="px-5 py-3 text-right">{formatAUD(AWARD_AGED_RN1.points[0].hourly, 2)}</td>
                        <td className="px-5 py-3 text-right font-medium">{formatAUD(AWARD_AGED_RN1.points[0].weekly * 52)}</td>
                      </tr>
                      <tr className="bg-eucalyptus-light/20 font-semibold text-navy">
                        <td className="px-5 py-3">Public health system entry step, six states<span className="block text-xs font-normal text-warmgray-light">Lowest {RN_ENTRY.lowState}, highest {RN_ENTRY.highState}</span></td>
                        <td className="px-5 py-3 text-right">—</td>
                        <td className="px-5 py-3 text-right">—</td>
                        <td className="px-5 py-3 text-right">{formatAUD(RN_ENTRY.low)} – {formatAUD(RN_ENTRY.high)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>The award has two rate streams, and the difference is large</h3>
              <p>
                Following the aged care work value case, the Nurses Award now carries two separate sets of minimum rates: one for employees <em>other than</em> aged care employees (clause 15.1) and a materially higher one for <strong>aged care employees</strong> (clause 15.3). An aged care registered nurse level 1 in their first year is on {formatAUD(AWARD_AGED_RN1.points[0].weekly, 2)} a week against {formatAUD(AWARD_RN1.points[0].weekly, 2)} for the general stream. Anyone quoting &ldquo;the Nurses Award rate&rdquo; without saying which stream they mean is quoting a number you cannot use.
              </p>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Is the &ldquo;Nurses Award 2020&rdquo; the same thing as the &ldquo;Nurses Award&rdquo;?</h3>
              <p>
                Yes. &ldquo;Nurses Award 2020&rdquo; is the award&apos;s formal name, made in 2020 as part of the modern award review; it is the same instrument people mean when they search for the &ldquo;nurses award&rdquo;. Its rates change most years — the general stream was last varied for 1 July 2026 and the aged care stream for 1 August 2026 — so any figure you find without an operative date attached is worthless.
              </p>
              <p>
                Under the award, ordinary hours on a Saturday pay 150% and on a Sunday 175%; a weekday afternoon shift attracts 12.5% and a weekday night shift 15%. State agreements generally pay more than that, which is a second reason not to use award penalties to check a public hospital payslip. See the state pages above for the loadings that actually apply to you, and the <Link href="/overtime-penalty-rates-guide/">overtime and penalty rates guide</Link> for how loadings stack.
              </p>
            </section>

            {/* ── Section 2: Penalty Rates & Shift Allowances ── */}
            <section id="penalty-rates">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Penalty Rates &amp; Shift Allowances</h2>
              <p>
                Healthcare workers, particularly nurses and midwives, are paid significant loadings for working outside standard business hours. These are set in each state&apos;s own instrument, and they do <strong>not</strong> follow a common structure — a claim you will see made often and which the table below disproves. Night shift is worth 20% in NSW, 20% in Queensland, 20.5% in South Australia, a flat dollar allowance per shift in Victoria and 35% in Western Australia. Anyone quoting one national set of nursing penalty rates is quoting a number that is wrong in at least four states.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full min-w-[38rem] text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">State</th>
                        <th className="px-5 py-3">Weekday night shift</th>
                        <th className="px-5 py-3">Saturday</th>
                        <th className="px-5 py-3">Sunday</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3"><Link href="/healthcare-worker-pay/nsw/" className="font-medium text-eucalyptus-dark hover:underline">NSW</Link></td><td className="px-5 py-3">+20% (shift starting 4pm–4am)</td><td className="px-5 py-3">Time and a half</td><td className="px-5 py-3">Time and three quarters</td></tr>
                      <tr><td className="px-5 py-3"><Link href="/healthcare-worker-pay/vic/" className="font-medium text-eucalyptus-dark hover:underline">VIC</Link></td><td className="px-5 py-3">$114.00 a shift (Mon–Thu)</td><td className="px-5 py-3">Time and a half</td><td className="px-5 py-3">Time and a half</td></tr>
                      <tr><td className="px-5 py-3"><Link href="/healthcare-worker-pay/qld/" className="font-medium text-eucalyptus-dark hover:underline">QLD</Link></td><td className="px-5 py-3">+20% (Grade 1: 17.5%)</td><td className="px-5 py-3">Time and a half</td><td className="px-5 py-3">Time and three quarters</td></tr>
                      <tr><td className="px-5 py-3"><Link href="/healthcare-worker-pay/wa/" className="font-medium text-eucalyptus-dark hover:underline">WA</Link></td><td className="px-5 py-3">+35%</td><td className="px-5 py-3">+50%</td><td className="px-5 py-3">+75%</td></tr>
                      <tr><td className="px-5 py-3"><Link href="/healthcare-worker-pay/sa/" className="font-medium text-eucalyptus-dark hover:underline">SA</Link></td><td className="px-5 py-3">+20.5%</td><td className="px-5 py-3">Set by the parent award — not published here</td><td className="px-5 py-3">Set by the parent award — not published here</td></tr>
                      <tr><td className="px-5 py-3"><Link href="/healthcare-worker-pay/tas/" className="font-medium text-eucalyptus-dark hover:underline">TAS</Link></td><td className="px-5 py-3">Not published by the Department</td><td className="px-5 py-3">Not published by the Department</td><td className="px-5 py-3">Not published by the Department</td></tr>
                      <tr className="bg-sandstone/40"><td className="px-5 py-3 font-medium text-navy">Nurses Award 2020 (the floor)</td><td className="px-5 py-3">+15%</td><td className="px-5 py-3">150%</td><td className="px-5 py-3">175%</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                Every cell above is quoted from a named clause of the instrument that sets it — the clause numbers are on the state pages. Blank cells are gaps in what the employer publishes, not zeroes. Weekend rates generally <em>replace</em> the shift loading rather than stacking on top of it, which is the single most common payslip misunderstanding in nursing. See the <Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> to model a specific roster and the <Link href="/overtime-penalty-rates-guide/">overtime and penalty rates guide</Link> for how loadings interact.
              </p>
            </section>

            {/* ── Section 3: Salary Packaging for Health Workers ── */}
            <section id="salary-packaging">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Salary Packaging for Health Workers</h2>
              <p>
                Salary packaging (also called salary sacrifice) is one of the most valuable financial benefits available to healthcare workers employed in public hospitals and not-for-profit health organisations. It allows you to pay for certain expenses with <strong>pre-tax dollars</strong>, reducing your taxable income and increasing your take-home pay.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Public Hospital FBT Exemption</h3>
              <p>
                Public hospital employees can salary package up to <strong>$15,900 per FBT year</strong> for general living expenses (rent, mortgage repayments, credit card payments, school fees) without incurring fringe benefits tax. This is a significant advantage over private sector workers, who cannot access this exemption. On top of the $15,900, an additional <strong>$2,650 per year</strong> can be salary packaged for meal entertainment and holiday accommodation expenses.
              </p>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: Salary Packaging Impact</h3>
              <p>
                Consider a registered nurse earning <strong>$85,000</strong> per year who salary packages the full $15,900 plus $2,650 meal entertainment:
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Component</th>
                        <th className="px-5 py-3 text-right">Without Packaging</th>
                        <th className="px-5 py-3 text-right">With Packaging</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Gross Salary</td><td className="px-5 py-3 text-right">$85,000</td><td className="px-5 py-3 text-right">$85,000</td></tr>
                      <tr><td className="px-5 py-3">Salary Packaged Amount</td><td className="px-5 py-3 text-right">$0</td><td className="px-5 py-3 text-right">$18,550</td></tr>
                      <tr><td className="px-5 py-3">Taxable Income</td><td className="px-5 py-3 text-right">$85,000</td><td className="px-5 py-3 text-right">$66,450</td></tr>
                      <tr><td className="px-5 py-3">Income Tax + Medicare</td><td className="px-5 py-3 text-right">$19,717</td><td className="px-5 py-3 text-right">$14,150</td></tr>
                      <tr className="font-bold bg-sandstone/50"><td className="px-5 py-3">Annual Benefit</td><td className="px-5 py-3 text-right">—</td><td className="px-5 py-3 text-right text-eucalyptus-dark">+$5,567 per year</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <p>
                That is an extra <strong>$214 per fortnight</strong> in take-home pay simply by structuring existing expenses through salary packaging. Read the full <Link href="/salary-packaging-guide/">Salary Packaging Guide</Link> for eligibility criteria and step-by-step setup instructions.
              </p>
            </section>

            {/* ── Section 4: Take-Home Pay Examples ── */}
            <section id="take-home-examples">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Take-Home Pay Examples</h2>
              <p>
                Take-home pay for FY{SITE_CONFIG.financialYear} on base salary before penalty rates, worked out with the same engine that drives the site&apos;s calculators. Actual take-home is higher for anyone doing shift work. The nursing rows use verified published pay scales; tap a gross figure for the full breakdown.
              </p>
              <div className="not-prose my-6">
                <div className="overflow-hidden rounded-xl border border-sandstone-dark/20 shadow-sm">
                  <table className="w-full text-sm text-left text-warmgray">
                    <thead className="bg-sandstone font-semibold text-navy">
                      <tr>
                        <th className="px-5 py-3">Role</th>
                        <th className="px-5 py-3 text-right">Gross Salary</th>
                        <th className="px-5 py-3 text-right">Tax + Medicare</th>
                        <th className="px-5 py-3 text-right">Take-Home</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                      <tr><td className="px-5 py-3">Aged Care Worker</td><td className="px-5 py-3 text-right"><Link href={takeHomeHref(60000)} className="text-eucalyptus-dark hover:underline">{formatAUD(60000)}</Link></td><td className="px-5 py-3 text-right">{formatAUD(60000 - afterTax(60000))}</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(afterTax(60000))}</td></tr>
                      <tr><td className="px-5 py-3">Registered nurse — lowest state entry step ({RN_ENTRY.lowState})</td><td className="px-5 py-3 text-right"><Link href={takeHomeHref(RN_ENTRY.low)} className="text-eucalyptus-dark hover:underline">{formatAUD(RN_ENTRY.low)}</Link></td><td className="px-5 py-3 text-right">{formatAUD(RN_ENTRY.low - afterTax(RN_ENTRY.low))}</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(afterTax(RN_ENTRY.low))}</td></tr>
                      <tr><td className="px-5 py-3">Registered nurse — highest state entry step ({RN_ENTRY.highState})</td><td className="px-5 py-3 text-right"><Link href={takeHomeHref(RN_ENTRY.high)} className="text-eucalyptus-dark hover:underline">{formatAUD(RN_ENTRY.high)}</Link></td><td className="px-5 py-3 text-right">{formatAUD(RN_ENTRY.high - afterTax(RN_ENTRY.high))}</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(afterTax(RN_ENTRY.high))}</td></tr>
                      <tr><td className="px-5 py-3">Registered nurse — highest top-of-scale ({RN_TOP.highState})</td><td className="px-5 py-3 text-right"><Link href={takeHomeHref(RN_TOP.high)} className="text-eucalyptus-dark hover:underline">{formatAUD(RN_TOP.high)}</Link></td><td className="px-5 py-3 text-right">{formatAUD(RN_TOP.high - afterTax(RN_TOP.high))}</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(afterTax(RN_TOP.high))}</td></tr>
                      <tr><td className="px-5 py-3">Registrar (indicative)</td><td className="px-5 py-3 text-right"><Link href={takeHomeHref(140000)} className="text-eucalyptus-dark hover:underline">{formatAUD(140000)}</Link></td><td className="px-5 py-3 text-right">{formatAUD(140000 - afterTax(140000))}</td><td className="px-5 py-3 text-right font-medium text-eucalyptus-dark">{formatAUD(afterTax(140000))}</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="not-prose my-8">
                <Link href="/take-home-pay-calculator/" className="inline-flex items-center gap-2 px-6 py-3 bg-eucalyptus-dark text-white font-semibold rounded-lg hover:bg-navy transition-colors">
                  <Calculator className="h-5 w-5" />
                  Calculate Your Healthcare Take-Home Pay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {/* ── Section 5: FAQs ── */}
            <section id="faq">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
              <Accordion type="multiple" className="not-prose mt-6 space-y-3">
                <AccordionItem value="nurse-salary" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much do registered nurses earn in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">It depends on the state, because each state public health system has its own agreement and its own classification ladder. Across the six state scales published on this site, the entry step for a registered nurse or midwife runs from {formatAUD(RN_ENTRY.low)} in {RN_ENTRY.lowState} to {formatAUD(RN_ENTRY.high)} in {RN_ENTRY.highState}, and the top of the base registered nurse scale runs from {formatAUD(RN_TOP.low)} to {formatAUD(RN_TOP.high)}. Those are base rates before shift penalties, which for a nurse on a rotating roster add a substantial amount on top. Pick your state above for the full published scale.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="nurses-award" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What is the Nurses Award 2020 and does it apply to me?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">The Nurses Award 2020 (MA000034) is the federal modern award for nurses — a legal minimum, not a pay scale. Its registered nurse level 1 pay point 1 rate is {formatAUD(AWARD_RN1.points[0].weekly, 2)} a week, or {formatAUD(AWARD_RN1.points[0].hourly, 2)} an hour, from {NURSES_AWARD.generalRatesFrom}. If you work in a state public hospital you are almost certainly paid under an enterprise or state agreement that pays well above that. The award is what governs private hospital, GP clinic, aged care and some agency work. Note it now has two rate streams: aged care employees are on materially higher minimums than the general stream.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="sal-packaging" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Who is eligible for salary packaging in healthcare?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Employees of public hospitals and not-for-profit health organisations are eligible for salary packaging of up to $15,900 for general living expenses plus $2,650 for meal entertainment per FBT year. Private hospital employees may have different or limited salary packaging options depending on their employer.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="penalty-rates" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">What penalty rates do nurses receive?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">There is no single national answer, and treating one state&apos;s numbers as typical is how payslip checks go wrong. Weekday night shift is +20% in NSW and Queensland, +20.5% in South Australia, +35% in Western Australia, and a flat dollar allowance per shift in Victoria. Weekend ordinary hours are time and a half on Saturday in NSW, Victoria and Queensland, +50% in WA; Sunday is time and three quarters in NSW and Queensland, +75% in WA and time and a half in Victoria. Weekend rates normally replace the shift loading rather than adding to it. The state pages carry the clause references.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="aged-care" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much do aged care workers earn?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Aged care workers (personal care assistants / AINs) earn between $55,000 and $65,000 per year. Following the Fair Work Commission&apos;s aged care work value case in 2023, wages increased by 15% for direct care workers. Further increases are being phased in through to 2025.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="doctor-pay" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">How much do doctors earn in Australia?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Junior doctors (interns/HMOs) earn $85,000–$100,000, registrars earn $120,000–$160,000, and specialists earn $250,000–$500,000+. GP earnings vary widely based on billing structure — bulk-billing GPs may earn $150,000–$250,000, while those in private practice with mixed billing can earn significantly more.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="public-private" className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">Is public or private healthcare better paid?</AccordionTrigger>
                  <AccordionContent className="text-warmgray">Base salaries are often similar, but public hospital employees benefit from salary packaging ($15,900 FBT-free) which can increase take-home pay by $4,000–$6,000 per year. Private hospitals may offer higher base rates for experienced nurses but typically cannot match the salary packaging benefit. Overall, public sector total remuneration is often higher for nurses and allied health when salary packaging is included.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            <div className="mt-12 not-prose">
              <MethodologyDisclosure title="How this guide works">
                <p>Every nursing figure on this page is generated from the six verified state pay scales in the state pages linked above, so the hub and the spokes cannot disagree. Each of those scales was read directly from a named enterprise agreement, certified agreement, state award or employer wage schedule, with the effective date recorded — nothing is estimated, averaged or interpolated, and rows a source does not publish are left out and listed as gaps.</p>
                <p>Nurses Award 2020 rates are read from the Fair Work Ombudsman&apos;s consolidated award text: the general stream operative from {NURSES_AWARD.generalRatesFrom} ({NURSES_AWARD.generalDetermination}) and the aged care stream from {NURSES_AWARD.agedCareRatesFrom} ({NURSES_AWARD.agedCareDetermination}).</p>
                <p>Doctor and allied health bands are indicative market ranges, not published pay scales, and are labelled as such. Salary packaging figures use ATO FBT exemption thresholds for public hospitals. Take-home figures use FY{SITE_CONFIG.financialYear} marginal rates including the Medicare levy, calculated with the same engine as the site&apos;s calculators.</p>
              </MethodologyDisclosure>
              <SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
              {(() => { const a = getGuideAuthorship("healthcare-worker-pay"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}
            </div>

          </article>

          {/* SIDEBAR */}
          <aside className="lg:w-1/3">
            <div className="sticky top-8 space-y-6">
              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Nurse pay by state</h3>
                  <div className="space-y-2">
                    {STATES.map((state) => (
                      <SidebarLink
                        key={state.slug}
                        href={`/healthcare-worker-pay/${state.slug}/`}
                        label={`Nurse pay in ${state.name}`}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-warmgray-light">
                    {NURSING_PAY_STATES_NOT_BUILT.join(" and ")} are not published yet.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-sandstone border-sandstone-dark/20">
                <CardContent className="p-6">
                  <h3 className="font-bold text-navy mb-3">Related Calculators</h3>
                  <div className="space-y-3">
                    <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
                    <SidebarLink href="/salary-packaging-guide/" label="Salary Packaging Guide" />
                    <SidebarLink href="/overtime-pay-calculator/" label="Overtime Calculator" />
                    <SidebarLink href="/average-salary-australia/" label="Average Salary Australia" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-eucalyptus-dark border-none text-white shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Salary Packaging Impact</h3>
                  <p className="text-eucalyptus-light text-sm mb-4">Public hospital workers can save $4,000–$6,000 per year through salary packaging. Calculate your benefit.</p>
                  <Link href="/take-home-pay-calculator/" className="block w-full py-2.5 px-4 bg-white text-eucalyptus-dark font-semibold text-sm text-center rounded-md hover:bg-sandstone/50 transition-colors">
                    Calculate Take-Home Pay
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

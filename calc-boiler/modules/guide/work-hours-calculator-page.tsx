"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { EMPLOYMENT, SITE_CONFIG, SOURCES, formatAUD } from "@/lib/constants";
import {
  CASUAL_LOADING,
  OVERTIME_DEFAULTS,
  STANDARD_WEEKLY_HOURS,
  calculateShift,
  calculateTimesheet,
  calculateTimesheetPay,
  formatDecimalHours,
  minutesToHm,
} from "@/lib/constants/work-hours";
import WorkHoursCalculator from "@/modules/calculator/work-hours-calculator";
import { WORK_HOURS_FAQS } from "@/modules/guide/work-hours-faqs";

const FWO_HOURS_URL = "https://www.fairwork.gov.au/employment-conditions/hours-of-work-breaks-and-rosters";
const FWO_RECORDS_URL = "https://www.fairwork.gov.au/pay-and-wages/pay-records-and-payslips";
const FWO_OVERTIME_URL = "https://www.fairwork.gov.au/pay-and-wages/penalty-rates-and-allowances/overtime-pay";

const SOURCES_LIST: SourceLink[] = [
  { title: "Hours of work, breaks and rosters", url: FWO_HOURS_URL, publisher: SOURCES.fwo.name },
  { title: "Overtime pay", url: FWO_OVERTIME_URL, publisher: SOURCES.fwo.name },
  { title: "Record-keeping and pay slips", url: FWO_RECORDS_URL, publisher: SOURCES.fwo.name },
];

// Every figure below is computed by the same engine the calculator uses, so the
// prose and the tool can never disagree.
const NINE_TO_FIVE = calculateShift({ start: "09:00", end: "17:00", breakMinutes: 30 });
const NIGHT_SHIFT = calculateShift({ start: "22:00", end: "06:00", breakMinutes: 30 });

const EXAMPLE_WEEK = [
  { day: "Monday", start: "07:00", end: "15:30", breakMinutes: 30 },
  { day: "Tuesday", start: "07:00", end: "15:30", breakMinutes: 30 },
  { day: "Wednesday", start: "12:00", end: "21:00", breakMinutes: 45 },
  { day: "Thursday", start: "22:00", end: "06:30", breakMinutes: 30 },
  { day: "Friday", start: "22:00", end: "06:30", breakMinutes: 30 },
  { day: "Saturday", start: "10:00", end: "16:00", breakMinutes: 0 },
  { day: "Sunday", start: "", end: "", breakMinutes: 0 },
];

const EXAMPLE_TOTALS = calculateTimesheet(EXAMPLE_WEEK);
const EXAMPLE_RATE = 32;
const EXAMPLE_PAY = calculateTimesheetPay({
  totalHours: EXAMPLE_TOTALS.totalHours,
  hourlyRate: EXAMPLE_RATE,
});

// Minutes → decimal conversion reference. The decimal column is computed, not
// typed, so it cannot drift from the engine.
const CONVERSION_NOTES: Record<number, string> = {
  6: "The smallest increment many payroll systems record",
  10: "",
  15: "A quarter of an hour",
  20: "",
  30: "The usual unpaid meal break",
  40: "",
  45: "Three quarters of an hour",
  50: "",
};

const CONVERSION_ROWS = [6, 10, 15, 20, 30, 40, 45, 50].map((m) => ({
  minutes: m,
  decimal: Number((m / 60).toFixed(3)),
  hm: minutesToHm(m),
  note: CONVERSION_NOTES[m] ?? "",
}));

export default function WorkHoursCalculatorPage() {
  return (
    <div className="min-h-screen flex-grow bg-white"><div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <nav aria-label="breadcrumb" className="mb-6"><ol className="flex items-center space-x-1 text-sm text-warmgray"><li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li><li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li><li><span className="font-medium text-navy" aria-current="page">Work Hours Calculator</span></li></ol></nav>

      <header className="mb-10 max-w-4xl"><h1 className="text-4xl md:text-5xl font-extrabold text-navy leading-tight mb-6" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Work Hours Calculator — Timesheet, Breaks and Overtime</h1><p className="text-xl text-warmgray leading-relaxed mb-6">Add up a week of shifts from start and finish times, take out unpaid breaks, and get the total in <strong>both decimal hours and h:mm</strong>. Overnight shifts, the {CASUAL_LOADING * 100}% casual loading and overtime past {STANDARD_WEEKLY_HOURS} hours are all handled. Nothing is uploaded — your timesheet stays in your browser.</p><TrustBar className="!max-w-none" /></header>

      <div className="mb-12"><WorkHoursCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className="lg:w-2/3 prose prose-lg max-w-none prose-headings:text-navy prose-a:text-eucalyptus-dark">

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>How to Use the Timesheet Calculator</h2>
            <ol>
              <li><strong>Pick your pay period.</strong> A week gives you seven rows; a fortnight gives fourteen and moves the overtime threshold to {STANDARD_WEEKLY_HOURS * 2} hours. Add or remove rows for a roster that does not fit either.</li>
              <li><strong>Enter start and finish times.</strong> Use the 24-hour clock. Leave a day blank if you did not work it — blank rows are ignored rather than counted as zero-hour days.</li>
              <li><strong>Put unpaid breaks in minutes.</strong> A 30-minute lunch is <code>30</code>. Paid rest breaks stay in your hours, so leave them out.</li>
              <li><strong>Add your hourly rate</strong> and tick casual loading if you are engaged as a casual.</li>
              <li><strong>Set the overtime rules to match your award</strong> — the threshold, the width of the first overtime band, and the two multipliers are all editable.</li>
            </ol>
            <p>Each row shows its own daily total, and the running weekly total updates as you type. Refreshing the page will not lose your work.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Decimal Hours vs Hours and Minutes</h2>
            <p>Payroll systems store time as <strong>decimal hours</strong>, not hours and minutes. That is why a payslip can say <code>7.5</code> for a shift you think of as seven and a half hours, and <code>7.25</code> for one you think of as seven fifteen. The conversion is simply minutes divided by 60.</p>
            <p className="not-prose rounded-lg border-l-4 border-ochre bg-sandstone/60 p-4 text-base text-navy"><strong>The trap:</strong> {formatDecimalHours(7.5)} hours is 7 hours 30 minutes, not 7 hours 50 minutes. Reading decimal hours as h:mm overstates every shift that has a part-hour in it.</p>

            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Minutes</th><th className="px-5 py-3">h:mm</th><th className="px-5 py-3">Decimal hours</th><th className="px-5 py-3">Notes</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {CONVERSION_ROWS.map((row, i) => (
                <tr key={row.minutes} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}>
                  <td className="px-5 py-3 font-medium">{row.minutes} min</td>
                  <td className="px-5 py-3 tabular-nums">{row.hm}</td>
                  <td className="px-5 py-3 tabular-nums">{row.decimal} h</td>
                  <td className="px-5 py-3">{row.note || "—"}</td>
                </tr>
              ))}
              <tr className="bg-sandstone font-semibold text-navy"><td className="px-5 py-3">60 min</td><td className="px-5 py-3 tabular-nums">{minutesToHm(60)}</td><td className="px-5 py-3 tabular-nums">1 h</td><td className="px-5 py-3 font-normal text-warmgray">One full hour</td></tr>
            </tbody></table></div></div>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Shifts That Finish After Midnight</h2>
            <p>This is where most timesheet tools quietly break. If you subtract a 6:00 am finish from a 10:00 pm start you get <strong>minus sixteen hours</strong>. A calculator that does not detect the day boundary either drops the shift or, worse, subtracts it from your week.</p>
            <p>The rule this calculator follows: <strong>if the finish time is earlier than the start time, the shift crosses midnight</strong> and a full day is added before the subtraction. So 10:00 pm to 6:00 am is {formatDecimalHours(calculateShift({ start: "22:00", end: "06:00" }).paidHours)} hours, and with a 30-minute unpaid break it is {formatDecimalHours(NIGHT_SHIFT.paidHours)} hours ({minutesToHm(NIGHT_SHIFT.paidMinutes)}). Rows that cross midnight are marked <strong>+1 day</strong> so you can see the calculator read it the way you meant.</p>
            <p>The mirror-image mistake matters too. A finish time <em>equal</em> to the start time is a zero-length shift, not a 24-hour one — 9:00 am to 9:00 am is treated as nothing worked, because nobody types that meaning a full day.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Unpaid Breaks</h2>
            <p>Unpaid meal breaks come off your paid hours. A 9:00 am to 5:00 pm shift spans {formatDecimalHours(calculateShift({ start: "09:00", end: "17:00" }).paidHours)} hours, but with a 30-minute unpaid lunch you are paid {formatDecimalHours(NINE_TO_FIVE.paidHours)} hours ({minutesToHm(NINE_TO_FIVE.paidMinutes)}). That single half hour is {formatDecimalHours(2.5)} hours a week, or roughly {formatDecimalHours(130)} hours a year.</p>
            <p>Shorter rest or tea breaks are usually paid under an award and stay inside your hours — do not enter those. If you were required to stay on site, keep a radio on, or remain available during a break, it may still count as time worked; the treatment varies by award, so check yours.</p>
            <p>A break can never be longer than the shift it sits in. Enter one that is and the calculator caps it at the length of the shift and flags the row, rather than producing negative hours.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Overtime — Your Award Sets the Threshold</h2>
            <p className="not-prose rounded-lg border-l-4 border-ochre bg-sandstone/60 p-4 text-base text-navy"><strong>There is no single national overtime rule.</strong> The National Employment Standards set {STANDARD_WEEKLY_HOURS} ordinary hours a week for a full-time employee, but <em>when</em> overtime starts and <em>what</em> it pays comes from the modern award or enterprise agreement that covers you.</p>
            <p>Three common patterns, none of which is universal:</p>
            <ul>
              <li><strong>Weekly threshold.</strong> Hours past {STANDARD_WEEKLY_HOURS} in a week attract overtime. This is the calculator&rsquo;s default and the easiest to reason about.</li>
              <li><strong>Banded multipliers.</strong> The <Link href="/hospitality-award-rates/">Hospitality Award</Link> pays the first two hours of overtime at time and a half and everything after at double time. Set the first band to 2 hours, {OVERTIME_DEFAULTS.firstTierMultiplier}× and {OVERTIME_DEFAULTS.secondTierMultiplier}× to model it.</li>
              <li><strong>Day-dependent bands.</strong> The <Link href="/retail-award-rates/">Retail Award</Link> bands overtime differently from Monday to Saturday than on a Sunday, so a single weekly threshold will not capture it exactly.</li>
            </ul>
            <p>Many awards also trigger overtime on a <strong>daily</strong> limit, on work outside the rostered span of hours, or on a day you were not rostered — none of which a weekly total can see. Read the <Link href="/overtime-penalty-rates-guide/">overtime and penalty rates guide</Link> before you rely on a figure, and use the dedicated <Link href="/overtime-pay-calculator/">overtime pay calculator</Link> if you only need to price the overtime portion.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Worked Example: A {formatDecimalHours(EXAMPLE_TOTALS.totalHours)}-Hour Week</h2>
            <p>Two early shifts, an evening, two nights that run past midnight and a short Saturday, on a base rate of {formatAUD(EXAMPLE_RATE, 2)} an hour:</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><thead className="bg-sandstone font-semibold text-navy"><tr><th className="px-5 py-3">Day</th><th className="px-5 py-3">Start</th><th className="px-5 py-3">Finish</th><th className="px-5 py-3">Break</th><th className="px-5 py-3 text-right">Paid hours</th></tr></thead><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              {EXAMPLE_WEEK.map((row, i) => {
                const r = EXAMPLE_TOTALS.rows[i];
                return (
                  <tr key={row.day} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : ""}>
                    <td className="px-5 py-3 font-medium">{row.day}</td>
                    <td className="px-5 py-3 tabular-nums">{row.start || "—"}</td>
                    <td className="px-5 py-3 tabular-nums">{row.end || "—"}{r.overnight ? " (+1 day)" : ""}</td>
                    <td className="px-5 py-3 tabular-nums">{row.breakMinutes ? `${row.breakMinutes} min` : "—"}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{r.valid ? `${formatDecimalHours(r.paidHours)} h` : "—"}</td>
                  </tr>
                );
              })}
              <tr className="bg-sandstone font-semibold text-navy"><td className="px-5 py-3" colSpan={4}>Weekly total</td><td className="px-5 py-3 text-right tabular-nums">{formatDecimalHours(EXAMPLE_TOTALS.totalHours)} h · {minutesToHm(EXAMPLE_TOTALS.paidMinutes)}</td></tr>
            </tbody></table></div></div>

            <p>At {formatAUD(EXAMPLE_RATE, 2)} an hour with the default overtime rules — {STANDARD_WEEKLY_HOURS} ordinary hours, then {OVERTIME_DEFAULTS.firstTierHours} hours at {OVERTIME_DEFAULTS.firstTierMultiplier}× and the rest at {OVERTIME_DEFAULTS.secondTierMultiplier}× — that week prices out as:</p>
            <div className="not-prose my-6"><div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm"><table className="w-full text-sm text-left text-warmgray"><tbody className="divide-y divide-sandstone-dark/20 bg-white">
              <tr><td className="px-5 py-3">Ordinary — {formatDecimalHours(EXAMPLE_PAY.split.ordinaryHours)} h at {formatAUD(EXAMPLE_RATE, 2)}</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(EXAMPLE_PAY.ordinaryPay, 2)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className="px-5 py-3">Overtime — {formatDecimalHours(EXAMPLE_PAY.split.firstTierHours)} h at {OVERTIME_DEFAULTS.firstTierMultiplier}×</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(EXAMPLE_PAY.firstTierPay, 2)}</td></tr>
              <tr><td className="px-5 py-3">Overtime — {formatDecimalHours(EXAMPLE_PAY.split.secondTierHours)} h at {OVERTIME_DEFAULTS.secondTierMultiplier}×</td><td className="px-5 py-3 text-right tabular-nums">{formatAUD(EXAMPLE_PAY.secondTierPay, 2)}</td></tr>
              <tr className="bg-sandstone"><td className="px-5 py-3 font-semibold text-navy">Gross for the week</td><td className="px-5 py-3 text-right font-bold tabular-nums text-navy">{formatAUD(EXAMPLE_PAY.gross, 2)}</td></tr>
            </tbody></table></div><p className="mt-2 text-xs text-warmgray-light">Gross, before PAYG tax and superannuation. Overtime thresholds shown are the calculator defaults, not a statement of award entitlements.</p></div>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Casual Loading on Top of Your Hours</h2>
            <p>Casual employees receive a <strong>{CASUAL_LOADING * 100}% loading</strong> on their ordinary hourly rate in place of paid annual leave, paid personal leave and notice of termination. Tick the casual box and the calculator lifts the rate before applying any overtime multiplier — {formatAUD(EXAMPLE_RATE, 2)} becomes {formatAUD(EXAMPLE_RATE * (1 + CASUAL_LOADING), 2)}.</p>
            <p>How loading and overtime combine is award-specific, and the two biggest casual-employing awards do it in opposite directions. Under the <Link href="/retail-award-rates/">General Retail Industry Award</Link> the casual loading <strong>is</strong> included in overtime, so casual overtime is 175% against 150% for a permanent employee. Under the <Link href="/hospitality-award-rates/">Hospitality Industry (General) Award</Link> it is <strong>not</strong> — overtime is computed on the ordinary hourly rate, which excludes the loading, so a casual and a full-time employee on the same classification are paid identical overtime. If your award works the hospitality way, leave the casual box unticked and enter the loaded rate manually for the ordinary hours. Our <Link href="/full-time-vs-part-time-vs-casual/">full-time vs part-time vs casual guide</Link> covers what you trade away for the loading.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Keeping Your Own Timesheet</h2>
            <p>Employers must keep time and wages records for <strong>seven years</strong> under the Fair Work Act, including hours worked by casual and irregular part-time employees, overtime hours, and the start and finish times of any period attracting a penalty rate or loading. You are entitled to ask for a copy of your own records.</p>
            <p>Keeping your own parallel record is still the fastest way to catch an underpayment. Note the date, start and finish times, and every unpaid break as you go — reconstructing a roster from memory three months later rarely survives a dispute. Use the <strong>Copy summary</strong> button to paste a week into an email or a note, or <strong>Print timesheet</strong> for a paper copy.</p>
            <p>If the totals do not match your payslip, our <Link href="/understanding-your-payslip/">payslip guide</Link> explains what each line should show.</p>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Related Calculators</h2>
            <ul>
              <li><Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link> — price time and a half, double time and public holiday rates</li>
              <li><Link href="/overtime-penalty-rates-guide/">Overtime &amp; Penalty Rates Guide</Link> — how the thresholds actually work award by award</li>
              <li><Link href="/hourly-to-annual-salary-calculator/">Hourly to Annual Salary Calculator</Link> — turn an hourly rate into a yearly figure</li>
              <li><Link href="/take-home-pay-calculator/">Take-Home Pay Calculator</Link> — gross to net after tax, Medicare and super</li>
              <li><Link href="/retail-award-rates/">Retail Award Rates</Link> — General Retail Industry Award minimums</li>
              <li><Link href="/hospitality-award-rates/">Hospitality Award Rates</Link> — Hospitality Industry (General) Award minimums</li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>Frequently Asked Questions</h2>
            <div className="sr-only">
              <h3>Work hours calculator questions and answers</h3>
              {WORK_HOURS_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
            </div>
            <Accordion type="multiple" className="not-prose mt-6 space-y-3">
              {WORK_HOURS_FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border rounded-lg px-4 bg-white">
                  <AccordionTrigger className="text-left font-semibold text-navy">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-warmgray">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <div className="mt-12 not-prose"><MethodologyDisclosure title="How this calculator works"><p>Each row is converted to minutes past midnight and subtracted. When the finish time is earlier than the start time a full day (1,440 minutes) is added first, which is what makes overnight shifts work; an identical start and finish is treated as a zero-length shift rather than 24 hours. The unpaid break is then deducted, capped at the length of the shift so a break longer than the shift produces zero paid time rather than a negative. Totals are reported in decimal hours rounded to two places and in h:mm.</p><p>The {STANDARD_WEEKLY_HOURS}-hour ordinary week and the {CASUAL_LOADING * 100}% casual loading are read from the site&rsquo;s single employment constants file, so they cannot drift from the rest of the site. Overtime thresholds and multipliers are <strong>user inputs with common defaults</strong>, not statements of award entitlement — the applicable modern award or enterprise agreement governs when overtime starts and what it pays. The time arithmetic is covered by automated tests including the overnight, zero-length, over-long-break, exactly-{STANDARD_WEEKLY_HOURS}-hour and decimal-to-h:mm cases.</p><p>Results are gross, before PAYG withholding, study loan repayments and superannuation. Nothing you enter leaves your browser; the timesheet is held in local storage on this device only.</p></MethodologyDisclosure><SourceAttribution sources={SOURCES_LIST} lastVerified={SITE_CONFIG.lastVerified} />
            {(() => { const a = getGuideAuthorship("work-hours-calculator"); return a ? <AuthorBox author={a.author} reviewer={a.reviewer} lastReviewed={a.lastReviewed} /> : null; })()}</div>
        </article>

        <aside className="lg:w-1/3"><div className="sticky top-8 space-y-6">
          <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Quick facts</h3><dl className="space-y-3 text-sm">
            <div className="flex items-baseline justify-between gap-4"><dt className="text-warmgray">Standard full-time week</dt><dd className="font-semibold tabular-nums text-navy">{STANDARD_WEEKLY_HOURS} h</dd></div>
            <div className="flex items-baseline justify-between gap-4"><dt className="text-warmgray">Casual loading</dt><dd className="font-semibold tabular-nums text-navy">{CASUAL_LOADING * 100}%</dd></div>
            <div className="flex items-baseline justify-between gap-4"><dt className="text-warmgray">National minimum wage</dt><dd className="font-semibold tabular-nums text-navy">{formatAUD(EMPLOYMENT.minimumWageHourly, 2)}/h</dd></div>
            <div className="flex items-baseline justify-between gap-4"><dt className="text-warmgray">Minimum weekly wage</dt><dd className="font-semibold tabular-nums text-navy">{formatAUD(EMPLOYMENT.minimumWageWeekly, 2)}</dd></div>
            <div className="flex items-baseline justify-between gap-4"><dt className="text-warmgray">Record-keeping period</dt><dd className="font-semibold tabular-nums text-navy">7 years</dd></div>
          </dl></CardContent></Card>
          <Card className="bg-sandstone border-sandstone-dark/20"><CardContent className="p-6"><h3 className="font-bold text-navy mb-3">Related</h3><div className="space-y-3">
            <SidebarLink href="/overtime-pay-calculator/" label="Overtime Pay Calculator" />
            <SidebarLink href="/overtime-penalty-rates-guide/" label="Overtime & Penalty Rates Guide" />
            <SidebarLink href="/hourly-to-annual-salary-calculator/" label="Hourly to Annual Salary" />
            <SidebarLink href="/take-home-pay-calculator/" label="Take-Home Pay Calculator" />
            <SidebarLink href="/retail-award-rates/" label="Retail Award Rates" />
            <SidebarLink href="/hospitality-award-rates/" label="Hospitality Award Rates" />
          </div></CardContent></Card>
        </div></aside>
      </div>
    </div></div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) { return (<Link href={href} className="group flex items-center justify-between p-3 rounded-lg bg-white border border-sandstone-dark/20 hover:border-eucalyptus hover:shadow-sm transition-all"><span className="text-sm font-medium text-navy group-hover:text-eucalyptus-dark">{label}</span><ChevronRight className="h-4 w-4 text-warmgray-light group-hover:text-eucalyptus" /></Link>); }

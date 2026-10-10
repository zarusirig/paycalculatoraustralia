/**
 * Conditional, rate-specific sections for /hourly-to-salary/[rate]/ and
 * /salary-to-hourly/[amount]/ (second pass, 10 Oct 2026).
 *
 * Each section renders only where its fact applies, so the page structure
 * changes along the range instead of repeating one template:
 *
 *   BelowMinimumWageSection   rate under the adult minimum: warning, junior and apprentice minimums
 *   RatePositionSection       no award minimum in the window: the nearest either side, or above every award
 *   PayScaleSection           public sector, defence, teaching, nursing and specialist pay points near the salary
 *   CasualEquivalentSection   award classifications whose casual minimum is this rate
 *   PenaltyRatesSection       typical award rates ($26–$42): weekend and overtime dollars on the nearest classification
 *   ContractorRateSection     $60 an hour and up: the rate as a contract rate
 *   PartTimeHoursSection      salaries under a full-time casual minimum: hours a week at the minimum wage
 *   PackageHourlySection      higher salaries: the hourly rate including super (cap, Division 293, day rate where they apply)
 *
 * Every figure comes from lib/data/hourly-rate-context.ts, lib/data/pay-scale-index.ts,
 * the award rate index, the minimum wage, junior, contractor and super
 * constants and the tax engine.
 */
import React from "react";
import Link from "next/link";
import {
  EMPLOYMENT,
  formatAUD,
  formatPercent,
  SITE_CONFIG,
  SUPER_GUARANTEE,
} from "@/lib/constants/australian-tax";
import { NMW, NMW_DECISION, MIN_WAGE_AGES } from "@/lib/constants/minimum-wage";
import { CASUAL_LOADING } from "@/lib/constants/junior-rates";
import { AWR_2026_FLOORS } from "@/lib/constants/hospitality-award";
import {
  DEFAULT_CONTRACTOR_ASSUMPTIONS,
  contractorRateToEquivalentSalary,
  salaryToContractorDayRate,
} from "@/lib/constants/contractor-rate";
import { DIVISION_293 } from "@/lib/constants/super-contributions";
import { AWARD_RATE_MAX, AWARD_RATE_MIN, awardLabel } from "@/lib/data/award-rate-index";
import {
  CASUAL_MINIMUM_FULL_TIME,
  CONTRACTOR_CONTEXT_FROM,
  apprenticeRatesNear,
  hourlyPageCasualEquivalents,
  juniorFloors,
  nearestAwardRates,
  penaltyContext,
  type ApprenticeRateNear,
} from "@/lib/data/hourly-rate-context";
import type { PayScaleKind, PayScaleMatch } from "@/lib/data/pay-scale-index";
import { salaryFacts } from "@/lib/data/salary-pages";
import { AWE_HEADLINE, AWE_RELEASE, EE_RELEASE, annualise, salaryPercentile } from "@/lib/data/average-salary";

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus-dark hover:underline";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TABLE = "w-full text-sm text-left text-warmgray";
const THEAD = "bg-sandstone font-semibold text-navy";

const money = (n: number) => formatAUD(n, 2);
const cents = (n: number) => Math.round(n * 100) / 100;
const pct = (m: number) => `${Number((m * 100).toFixed(1))}%`;
const HOURS_PER_YEAR = EMPLOYMENT.hoursPerYear;
const HOURS_PER_DAY = EMPLOYMENT.standardWeeklyHours / 5;

function signed(diff: number): string {
  if (Math.abs(diff) < 0.005) return "same";
  return `${diff > 0 ? "+" : "−"}${money(Math.abs(diff))}`;
}

// ---------------------------------------------------------------------------
// One-line facts used inside sections
// ---------------------------------------------------------------------------

/** "$30 is $3.56 (13%) above the $26.44 adult minimum wage …" — for rates at or above it. */
export function MinimumWageLine({ rate, label }: { rate: number; label: string }) {
  const gap = cents(rate - NMW.hourly);
  const ratio = rate / NMW.hourly;
  return (
    <p>
      {label} an hour is {ratio >= 1.5 ? `${ratio.toFixed(1)} times` : `${money(gap)} (${Math.round((gap / NMW.hourly) * 100)}%) above`} the{" "}
      <Link href="/minimum-wage-australia/" className={LINK}>
        national minimum wage
      </Link>{" "}
      of {money(NMW.hourly)} an hour for adults from {NMW_DECISION.operativeFrom}.
    </p>
  );
}

/** Where a salary sits in the ABS distribution, in one sentence. */
export function EarningsLine({ salary }: { salary: number }) {
  const population = salary < 40_000 ? "all" : "fullTime";
  const p = salaryPercentile(salary, population);
  const low = Math.round(p.shareBelowFloor * 100);
  const high = Math.round(p.shareBelowCeiling * 100);
  const avg = annualise(AWE_HEADLINE.fullTimeOrdinaryWeekly);
  const who = population === "all" ? "all employees" : "full-time employees";
  const share = p.bandCeiling === null || low === high ? `about ${low}%` : `${low}–${high}%`;
  return (
    <p>
      {formatAUD(salary)} a year is ahead of {share} of {who} (ABS{" "}
      <a href={EE_RELEASE.url} className={LINK} rel="noopener noreferrer" target="_blank">
        {EE_RELEASE.title}, {EE_RELEASE.referencePeriod}
      </a>
      ) and {formatAUD(Math.abs(salary - avg))} {salary >= avg ? "above" : "below"} the{" "}
      <Link href="/average-salary-australia/" className={LINK}>
        average full-time salary
      </Link>{" "}
      of {formatAUD(avg)} ({AWE_RELEASE.referencePeriod}).
    </p>
  );
}

// ---------------------------------------------------------------------------
// Below the adult minimum wage
// ---------------------------------------------------------------------------

const STAGE = ["", "1st", "2nd", "3rd", "4th"] as const;

function apprenticeLabel(a: ApprenticeRateNear): string {
  const y12 = a.year12 === "completed" ? ", Year 12 completed" : a.year12 === "not-completed" ? ", Year 12 not completed" : "";
  return `${STAGE[a.stage]}-year ${a.track} apprentice${y12}`;
}

/** "18 and under" / "under 16". */
function ageText(age: string): string {
  return age === "Under 16" ? "under 16" : `${age} and under`;
}

export function BelowMinimumWageSection({
  rate,
  label,
  salary,
  variant = "hourly",
}: {
  rate: number;
  label: string;
  salary: number;
  /** "salary": on /salary-to-hourly/, where the part-time section already gives the warning and the ABS line. */
  variant?: "hourly" | "salary";
}) {
  if (rate >= NMW.hourly) return null;
  const gap = cents(NMW.hourly - rate);
  const { met, nextUp } = juniorFloors(rate);
  const oldest = met[met.length - 1];
  const ageNum = oldest ? Number(oldest.age) : NaN;
  const ageHref = (MIN_WAGE_AGES as readonly number[]).includes(ageNum) ? `/minimum-wage-by-age/${ageNum}/` : null;
  const apprentices = apprenticeRatesNear(rate);
  const entry = AWR_2026_FLOORS.entryLevelHourly;
  const onSalaryPage = variant === "salary";
  return (
    <section aria-labelledby="below-minimum-heading">
      <h2 id="below-minimum-heading" style={H2} className="text-2xl font-bold text-navy mb-4">
        {onSalaryPage
          ? `Junior and Apprentice Minimums Near ${label} an Hour`
          : `${label} an Hour Is Below the Adult Minimum Wage`}
      </h2>
      <div className="text-warmgray space-y-3">
        {onSalaryPage ? (
          <p>
            As a full-time rate, {label} an hour is {money(gap)} under the {money(NMW.hourly)} adult minimum, so it
            can be a lawful full-time wage only as one of these:
          </p>
        ) : (
          <p>
            <strong className="text-navy">
              {label} an hour is {money(gap)} under the {money(NMW.hourly)} national minimum wage
            </strong>{" "}
            that an adult (21 or older) in the national system must be paid from {NMW_DECISION.operativeFrom} (
            {NMW_DECISION.name}). For an adult it is an underpayment unless it is one of these:
          </p>
        )}
        <ul className="list-disc pl-5 space-y-2">
          {oldest && (
            <li>
              <strong className="text-navy">A junior rate.</strong> The national junior scale sets{" "}
              {money(oldest.hourly)} at {oldest.age === "Under 16" ? "under 16" : `age ${oldest.age}`}
              {nextUp ? ` and ${money(nextUp.hourly)} at ${nextUp.age === "21 and over" ? "21" : nextUp.age}` : ""}, so{" "}
              {label} meets the minimum for employees aged {ageText(oldest.age)}
              {ageHref ? (
                <>
                  {" "}
                  (
                  <Link href={ageHref} className={LINK}>
                    minimum wage at {ageNum}
                  </Link>
                  )
                </>
              ) : null}
              . Awards set their own{" "}
              <Link href="/junior-pay-rates/" className={LINK}>
                junior percentages
              </Link>
              .
            </li>
          )}
          {apprentices.length > 0 && (
            <li>
              <strong className="text-navy">An apprentice rate.</strong> Apprentice award minimums within 50c of{" "}
              {label}:
              <ul className="list-[circle] pl-5 mt-1 space-y-1">
                {apprentices.map((a) => (
                  <li key={`${a.hourly}-${a.track}-${a.stage}-${a.year12}`}>
                    {money(a.hourly)}: {apprenticeLabel(a)} ({a.trades.map((t) => t.name).join("; ")})
                  </li>
                ))}
              </ul>
              <Link href="/apprentice-pay-rates/" className={LINK}>
                Apprentice pay rates by trade
              </Link>
              .
            </li>
          )}
          <li>
            {rate >= entry ? (
              <>
                <strong className="text-navy">An award entry-level rate.</strong> The 2026 review set a{" "}
                {money(entry)} floor for entry-level rates in an employee&apos;s first 6 months (the Hospitality
                Award&apos;s Introductory level, for one), which {label} clears.
              </>
            ) : (
              <>
                <strong className="text-navy">Not an adult award rate.</strong> It is under every adult award
                minimum we track; the lowest is {money(AWARD_RATE_MIN.hourly)} ({awardLabel(AWARD_RATE_MIN)},{" "}
                {AWARD_RATE_MIN.classification}).
              </>
            )}
          </li>
        </ul>
        {onSalaryPage ? null : <EarningsLine salary={salary} />}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// No award minimum within the window
// ---------------------------------------------------------------------------

/** "50c" / "$1.26". */
const windowText = (w: number) => (w < 1 ? `${Math.round(w * 100)}c` : money(w));

export function RatePositionSection({
  rate,
  label,
  salary,
  window = 0.5,
}: {
  rate: number;
  label: string;
  salary: number;
  /** The award window the page uses (50c on /hourly-to-salary/). */
  window?: number;
}) {
  const { below, above } = nearestAwardRates(rate);
  const aboveAll = rate > AWARD_RATE_MAX.hourly;
  return (
    <section aria-labelledby="award-position-heading">
      <h2 id="award-position-heading" style={H2} className="text-2xl font-bold text-navy mb-4">
        {aboveAll ? `${label} an Hour Is Above Every Award Minimum` : `Award Minimums Either Side of ${label} an Hour`}
      </h2>
      <div className="text-warmgray space-y-3">
        {aboveAll ? (
          <p>
            The highest adult award minimum we track is {money(AWARD_RATE_MAX.hourly)} an hour (
            {awardLabel(AWARD_RATE_MAX)}, {AWARD_RATE_MAX.classification}, from {AWARD_RATE_MAX.effectiveLabel}),{" "}
            {money(rate - AWARD_RATE_MAX.hourly)} under {label}. Pay at this level is set by an enterprise
            agreement, a contract or an individual salary, so penalty rates and overtime depend on that
            agreement, not an award table.
          </p>
        ) : (
          <p>
            No adult award minimum we track is within {windowText(window)} of {label}.
            {below && (
              <>
                {" "}
                The nearest below is {money(below.hourly)} ({awardLabel(below)}, {below.classifications.join("; ")}),{" "}
                {money(-below.diff)} less
              </>
            )}
            {above && (
              <>
                {below ? "; " : " "}the nearest above is {money(above.hourly)} ({awardLabel(above)},{" "}
                {above.classifications.join("; ")}), {money(above.diff)} more
              </>
            )}
            . Award minimums are legal floors, not typical pay.
          </p>
        )}
        {aboveAll ? null : <MinimumWageLine rate={rate} label={label} />}
        <EarningsLine salary={salary} />
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Casual equivalents
// ---------------------------------------------------------------------------

export function CasualEquivalentSection({ rate, label }: { rate: number; label: string }) {
  const rows = hourlyPageCasualEquivalents(rate);
  if (rows.length === 0) return null;
  const base = cents(rate / (1 + CASUAL_LOADING));
  const nmwCasual = Math.abs(NMW.casualHourly - rate) < 0.5;
  return (
    <section aria-labelledby="casual-equivalent-heading">
      <h2 id="casual-equivalent-heading" style={H2} className="text-2xl font-bold text-navy mb-4">
        Is {label} an Hour a Casual Award Rate?
      </h2>
      <p className="text-warmgray mb-4">
        As a casual rate, {label} is a base of {money(base)} plus the {Math.round(CASUAL_LOADING * 100)}% loading
        paid instead of leave.
        {nmwCasual
          ? ` It sits next to the casual national minimum wage of ${money(NMW.casualHourly)} (${money(NMW.hourly)} plus 25%).`
          : ""}{" "}
        These award classifications have a casual minimum within 50c of {label}:
      </p>
      <div className={TABLE_WRAP}>
        <table className={TABLE}>
          <caption className="sr-only">{`Award casual minimum rates near ${label} an hour`}</caption>
          <thead className={THEAD}>
            <tr>
              <th className="px-4 py-3" scope="col">Award and classification</th>
              <th className="px-4 py-3 text-right" scope="col">Permanent minimum</th>
              <th className="px-4 py-3 text-right" scope="col">Casual minimum</th>
              <th className="px-4 py-3 text-right" scope="col">vs {label}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {rows.map(({ match: m, casual, diff }) => (
              <tr key={`${m.code}-${m.stream ?? ""}-${m.hourly}`}>
                <th scope="row" className="px-4 py-3 font-normal">
                  {m.href ? (
                    <Link href={m.href} className={`${LINK} font-medium`}>
                      {awardLabel(m)}
                    </Link>
                  ) : (
                    <span className="font-medium text-navy">{awardLabel(m)}</span>
                  )}
                  <span className="block text-xs text-warmgray">{m.classifications.join("; ")}</span>
                </th>
                <td className="px-4 py-3 text-right tabular-nums">{money(m.hourly)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-navy">{money(casual)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{signed(diff)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-warmgray-light mt-2">
        Adult minimums for ordinary hours; casual = permanent minimum plus each award&apos;s{" "}
        {Math.round(CASUAL_LOADING * 100)}% loading. What the loading replaces:{" "}
        <Link href="/casual-loading-calculator/" className={LINK}>
          casual loading calculator
        </Link>
        .
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Penalty and overtime rates on the nearest award classification
// ---------------------------------------------------------------------------

export function PenaltyRatesSection({ rate, label }: { rate: number; label: string }) {
  const ctx = penaltyContext(rate);
  if (!ctx) return null;
  const { match: m, award, classification, lines } = ctx;
  const multiple = (l: (typeof lines)[number]) =>
    l.flatPerHour > 0 ? `${pct(l.multiplier)} + ${money(l.flatPerHour)}` : pct(l.multiplier);
  return (
    <section aria-labelledby="penalty-rates-heading">
      <h2 id="penalty-rates-heading" style={H2} className="text-2xl font-bold text-navy mb-4">
        Weekend and Overtime Rates Near {label} an Hour
      </h2>
      <p className="text-warmgray mb-4">
        The closest award minimum to {label} with published penalty tables is {award.meta.shortName}{" "}
        {classification} at {money(m.hourly)} an hour from {m.effectiveLabel}. For a full-time or part-time
        employee on that minimum, the award&apos;s own tables give:
      </p>
      <div className={TABLE_WRAP}>
        <table className={TABLE}>
          <caption className="sr-only">{`${award.meta.shortName} ${classification} penalty and overtime rates`}</caption>
          <thead className={THEAD}>
            <tr>
              <th className="px-4 py-3" scope="col">When worked</th>
              <th className="px-4 py-3 text-right" scope="col">Rate</th>
              <th className="px-4 py-3 text-right" scope="col">Per hour</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {lines.map((l) => (
              <tr key={`${l.kind}-${l.label}`}>
                <th scope="row" className="px-4 py-3 font-normal">
                  {l.kind === "overtime" ? `Overtime: ${l.label}` : l.label}
                </th>
                <td className="px-4 py-3 text-right tabular-nums">{multiple(l)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-navy">{money(l.hourly)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-warmgray-light mt-2">
        {award.meta.shortName} ({award.meta.code}) {award.penaltiesClause} and {award.overtimeClause}, applied to the{" "}
        {money(m.hourly)} minimum; casual rates differ.{" "}
        <Link href={award.meta.href} className={LINK}>
          Full {award.meta.shortName} rates
        </Link>
        .
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Published pay scale points near the annual figure
// ---------------------------------------------------------------------------

/**
 * The sentence that replaces the "above every award minimum" section where a
 * pay scale table follows: the award ceiling, then why the table matters.
 */
export function aboveAwardsLead(rate: number, label: string, annual?: number): string {
  const subject = annual === undefined ? `${label} an hour is` : `${label} an hour full time is ${formatAUD(annual)} a year,`;
  return `${subject} above every adult award minimum we track (the highest is ${money(AWARD_RATE_MAX.hourly)}, ${awardLabel(AWARD_RATE_MAX)}, ${AWARD_RATE_MAX.classification}), so pay at this level is set by agreements, contracts and salaries like these.`;
}

const KIND_WORDS: Record<PayScaleKind, string> = {
  "public-service": "public service",
  defence: "defence",
  teaching: "school",
  nursing: "nursing",
  service: "emergency services",
  aviation: "aviation",
  medical: "hospital specialist",
};

/**
 * A source's effective-date wording, ready to follow "From": a leading phrase
 * ending in "from" is dropped ("Wage rates payable from 1 July 2026" -> "1 July
 * 2026"), but not a "from" inside a note after the date ("1 August 2026
 * (award-floor rows from 1 September 2026)" stays whole).
 */
function fromText(text: string): string {
  const m = /^(.*?)\bfrom\s+/i.exec(text);
  return m && !/\d/.test(m[1]) ? text.slice(m[0].length) : text;
}

/** "public service, defence and nursing": the kinds of scale the rows come from, in index order. */
function scaleKinds(points: readonly PayScaleMatch[]): string {
  const words = (Object.keys(KIND_WORDS) as PayScaleKind[]).filter((k) => points.some((p) => p.kind === k)).map((k) => KIND_WORDS[k]);
  return words.length <= 1 ? (words[0] ?? "") : `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}`;
}

export function PayScaleSection({
  points,
  annual,
  halfWindow,
  lead,
  children,
}: {
  /** The page's rows (hourlyPagePayScalePoints / salaryPagePayScalePoints). */
  points: readonly PayScaleMatch[];
  annual: number;
  halfWindow: number;
  lead?: string;
  /** Rendered under the table (the ABS position line where this section replaces the award section). */
  children?: React.ReactNode;
}) {
  if (points.length === 0) return null;
  const a = formatAUD(annual);
  return (
    <section aria-labelledby="pay-scales-heading">
      <h2 id="pay-scales-heading" style={H2} className="text-2xl font-bold text-navy mb-4">
        Pay Scale Points Near {a} a Year
      </h2>
      <p className="text-warmgray mb-4">
        {lead ? `${lead} ` : ""}Points within {formatAUD(halfWindow)} of {a} on published {scaleKinds(points)} pay
        scales, one per employer (full-time hours vary, so compare salaries):
      </p>
      <div className={TABLE_WRAP}>
        <table className={TABLE}>
          <caption className="sr-only">{`Published pay scale points near ${a} a year`}</caption>
          <thead className={THEAD}>
            <tr>
              <th className="px-4 py-3" scope="col">Employer and point</th>
              <th className="px-4 py-3 text-right" scope="col">Salary</th>
              <th className="px-4 py-3 text-right" scope="col">vs {a}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {points.map((p) => (
              <tr key={`${p.group}-${p.label}`}>
                <th scope="row" className="px-4 py-3 font-normal">
                  {p.href ? (
                    <Link href={p.href} className={`${LINK} font-medium`}>
                      {p.group}
                    </Link>
                  ) : p.sourceUrl ? (
                    <a href={p.sourceUrl} className={`${LINK} font-medium`} rel="noopener noreferrer" target="_blank">
                      {p.group}
                    </a>
                  ) : (
                    <span className="font-medium text-navy">{p.group}</span>
                  )}
                  <span className="block text-xs text-warmgray">{p.label}</span>
                  <span className="block text-xs text-warmgray-light">From {fromText(p.effectiveFrom)}</span>
                </th>
                <td className="px-4 py-3 text-right tabular-nums text-navy">{formatAUD(p.annual)}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {p.diff === 0 ? "same" : `${p.diff > 0 ? "+" : "−"}${formatAUD(Math.abs(p.diff))}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-warmgray-light mt-2">
        Base salaries as published; allowances, loadings and super are extra.
      </p>
      {children ? <div className="text-warmgray mt-4 space-y-3">{children}</div> : null}
    </section>
  );
}


// ---------------------------------------------------------------------------
// Contractor context
// ---------------------------------------------------------------------------

export function ContractorRateSection({ rate, label }: { rate: number; label: string }) {
  if (rate < CONTRACTOR_CONTEXT_FROM) return null;
  const c = contractorRateToEquivalentSalary(rate, "hour");
  const a = DEFAULT_CONTRACTOR_ASSUMPTIONS;
  const reverse = salaryToContractorDayRate(rate * HOURS_PER_YEAR);
  const unbilled = a.annualLeaveDays + a.personalLeaveDays + a.publicHolidayDays + a.downtimeDays;
  return (
    <section aria-labelledby="contract-rate-heading">
      <h2 id="contract-rate-heading" style={H2} className="text-2xl font-bold text-navy mb-4">
        {label} an Hour as a Contract Rate
      </h2>
      <p className="text-warmgray">
        As a contract rate excluding GST, {label} an hour over {c.billableDays} billable days ({unbilled} weekdays go
        unpaid on leave, public holidays and gaps between contracts) is {formatAUD(c.billedIncome)} a year. Less{" "}
        {formatAUD(c.insurance + c.admin)} of insurance and admin and your own super, it matches an{" "}
        <strong className="text-navy">employee salary of about {formatAUD(c.equivalentSalary)}</strong> (
        {money(c.employeeHourly)} an hour); matching {label} an hour as an employee takes about{" "}
        {formatAUD(reverse.dayRate)} a day. Other assumptions:{" "}
        <Link href="/contractor-pay-calculator/" className={LINK}>
          contractor pay calculator
        </Link>
        .
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Salary-to-hourly only
// ---------------------------------------------------------------------------

export function PartTimeHoursSection({ salary }: { salary: number }) {
  if (salary >= CASUAL_MINIMUM_FULL_TIME) return null;
  const s = formatAUD(salary);
  const weekly = salary / EMPLOYMENT.weeksPerYear;
  const rows = [
    { label: `Adult minimum wage (${money(NMW.hourly)})`, hourly: NMW.hourly },
    { label: `Casual minimum wage (${money(NMW.casualHourly)}, adult rate plus 25%)`, hourly: NMW.casualHourly },
  ].map((r) => ({ ...r, hours: weekly / r.hourly }));
  const belowFullTime = salary < NMW.annual;
  const fte = (h: number) => `${Math.round((h / EMPLOYMENT.standardWeeklyHours) * 100)}%`;
  return (
    <section aria-labelledby="part-time-hours-heading">
      <h2 id="part-time-hours-heading" style={H2} className="text-2xl font-bold text-navy mb-4">
        How Many Hours a Week Is {s} at the Minimum Wage?
      </h2>
      <p className="text-warmgray mb-4">
        {belowFullTime ? (
          <>
            <strong className="text-navy">{s} is below the full-time minimum wage.</strong> An adult on the{" "}
            {money(NMW.hourly)} minimum for {EMPLOYMENT.standardWeeklyHours} hours a week earns{" "}
            {formatAUD(NMW.annual)} a year, so as a full-time salary {s} is less than the law requires (junior,
            apprentice and supported wage rates aside). It is a part-time figure:
          </>
        ) : (
          <>
            {s} is {formatAUD(salary - NMW.annual)} above the {formatAUD(NMW.annual)} full-time minimum wage, but
            under the {formatAUD(CASUAL_MINIMUM_FULL_TIME)} a full-time casual on the minimum earns:
          </>
        )}
      </p>
      <div className={TABLE_WRAP}>
        <table className={TABLE}>
          <thead className={THEAD}>
            <tr>
              <th className="px-4 py-3" scope="col">At this hourly rate</th>
              <th className="px-4 py-3 text-right" scope="col">Hours a week for {s}</th>
              <th className="px-4 py-3 text-right" scope="col">Share of 38 hours</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {rows.map((r) => (
              <tr key={r.label}>
                <th scope="row" className="px-4 py-3 font-normal">{r.label}</th>
                <td className="px-4 py-3 text-right tabular-nums text-navy">{r.hours.toFixed(1)}</td>
                <td className="px-4 py-3 text-right tabular-nums">{fte(r.hours)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-warmgray-light mt-2">
        {s} ÷ {EMPLOYMENT.weeksPerYear} weeks ÷ the hourly rate. Other part-time loads:{" "}
        <Link href="/pro-rata-salary-calculator/" className={LINK}>
          pro-rata salary calculator
        </Link>
        .
      </p>
    </section>
  );
}

/**
 * Above a full-time casual minimum: the hourly rate including the Super
 * Guarantee, with the cap and Division 293 where they apply and, from $60 an
 * hour, the contract day rate that matches the package.
 */
export function PackageHourlySection({ salary }: { salary: number }) {
  if (salary < CASUAL_MINIMUM_FULL_TIME) return null;
  const s = formatAUD(salary);
  const f = salaryFacts(salary);
  const sg = f.employerSuper;
  const pkg = salary + sg;
  const contract = salary / HOURS_PER_YEAR >= CONTRACTOR_CONTEXT_FROM ? salaryToContractorDayRate(salary) : null;
  const excess = pkg - DIVISION_293.threshold;
  return (
    <section aria-labelledby="package-heading">
      <h2 id="package-heading" style={H2} className="text-2xl font-bold text-navy mb-4">
        {s} as an Hourly Rate Including Super
      </h2>
      <p className="text-warmgray">
        With {formatAUD(sg)} of Super Guarantee on top (
        {f.superCapped
          ? `capped, because it is only owed on earnings up to the ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} maximum contribution base`
          : `${formatPercent(SUPER_GUARANTEE.rate, 0)} of salary in ${SITE_CONFIG.financialYear}`}
        ), the package is {formatAUD(pkg)}, or <strong className="text-navy">{money(pkg / HOURS_PER_YEAR)} an hour</strong>.
        {f.division293 > 0
          ? ` Income plus super is over ${formatAUD(DIVISION_293.threshold)}, so Division 293 adds ${formatPercent(DIVISION_293.rate, 0)} tax on ${excess < sg ? `the ${formatAUD(excess)} above the threshold` : "all of the contributions"}: about ${formatAUD(f.division293)}, billed after your return.`
          : ""}
        {contract
          ? ` Matching that as a contractor takes about ${formatAUD(contract.dayRate)} a day excluding GST (${money(contract.dayRate / HOURS_PER_DAY)} an hour) over ${contract.billableDays} billable days, after ${formatAUD(contract.insurance + contract.admin)} of insurance and admin.`
          : ""}{" "}
        <Link href="/superannuation-guide/" className={LINK}>
          How super works
        </Link>
        {contract ? (
          <>
            {" · "}
            <Link href="/contractor-pay-calculator/" className={LINK}>
              contractor pay calculator
            </Link>
          </>
        ) : null}
        .
      </p>
    </section>
  );
}

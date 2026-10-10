/**
 * Conditional sections for /take-home-pay-on/[salary]/ (10 Oct 2026).
 *
 * Each item renders only where its subject applies to the salary (see
 * lib/data/salary-pages/take-home-sections.ts for the rules and the figures),
 * so the page changes shape along the range instead of repeating one
 * template. Anything whose wording would be the same on every page in a band
 * (salary sacrifice, the surcharge, Division 293, the change since last year)
 * is one line with its figures and a link to the guide that explains it.
 * Every number comes from the engines.
 */
import React from "react";
import Link from "next/link";
import {
  formatAUD,
  HECS_HELP,
  LITO,
  MEDICARE_LEVY,
  SITE_CONFIG,
  TAX_BRACKETS,
  TAX_BRACKETS_2025_26,
  TAX_FREE_THRESHOLD,
} from "@/lib/constants/australian-tax";
import { NMW } from "@/lib/constants/minimum-wage";
import { salaryFacts } from "@/lib/data/salary-pages";
import {
  CO_CONTRIBUTION_RULES,
  HECS_THRESHOLDS,
  LISTO_RULES,
  SACRIFICE_AMOUNT,
  div293Effect,
  hecsShift,
  hoursRows,
  lowIncomeHelp,
  mlsAhead,
  mlsEffect,
  sacrificeEffect,
  sgCap,
  takeHomeBand,
  yearChange,
  type ApprenticeOnPage,
} from "@/lib/data/salary-pages/take-home-sections";
import { Card } from "@/components/ui/card";

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus hover:text-navy transition-colors font-medium";
const P = "text-navy leading-relaxed";

const pct = (r: number, d = 1) => `${Number((r * 100).toFixed(d))}%`;
const money2 = (v: number) => formatAUD(v, 2);

// ---------------------------------------------------------------------------
// Change since last year: one or two sentences in the intro, every page
// ---------------------------------------------------------------------------

export function YearChangeLine({ salary }: { salary: number }) {
  const y = yearChange(salary);
  const oldRate = pct(TAX_BRACKETS_2025_26[1].rate, 0);
  const newRate = pct(TAX_BRACKETS[1].rate, 0);
  const top = TAX_BRACKETS[1].max;
  const slice = Math.min(salary, top) - TAX_FREE_THRESHOLD;
  const fullCut = y.change === Math.round(slice * (TAX_BRACKETS_2025_26[1].rate - TAX_BRACKETS[1].rate));
  const link = <Link href="/tax-changes-2026-27/" className={LINK}>what changed</Link>;

  if (y.change === 0) {
    return (
      <>
        {" "}It is the same as in {y.lastYear}: no income tax is payable on it either year, and the {y.nextYear} cuts change nothing ({link}).
      </>
    );
  }
  const why =
    salary >= top
      ? `the ${oldRate} rate is now ${newRate}`
      : fullCut
        ? `1c less on the ${formatAUD(slice)} above the tax-free threshold`
        : `the ${oldRate} rate is now ${newRate}, partly absorbed by the Low Income Tax Offset`;
  const hecs = y.hecsChange > 0 ? `, or ${formatAUD(y.change + y.hecsChange)} a year with HECS-HELP (indexed threshold ${formatAUD(HECS_THRESHOLDS.this)})` : "";
  return (
    <>
      {" "}It is <strong>{money2(y.changeFortnight)} a fortnight more</strong> than in {y.lastYear} ({why}){hecs}; another {formatAUD(y.next.gain)} a year is legislated for{" "}
      {y.nextYear} ({link}).
    </>
  );
}

// ---------------------------------------------------------------------------
// Low salaries: hours a week
// ---------------------------------------------------------------------------

function shareOfWeek(hours: number): string {
  const share = hours / NMW.hoursPerWeek;
  if (share < 0.5) return "under half";
  if (share < 0.75) return "over half";
  return "over three-quarters";
}

export function PartTimeHours({ salary }: { salary: number }) {
  const s = formatAUD(salary);
  const rows = hoursRows(salary);
  const nmw = rows[0];

  return (
    <section>
      <h2 style={H2} className="text-2xl font-bold text-navy mb-4">How Many Hours a Week Earn {s}?</h2>
      <p className={`${P} mb-4`}>
        {salary < NMW.annual ? `Below the ${formatAUD(NMW.annual)} full-time adult minimum, so for an adult this is part-time or casual pay: ` : ""}
        <strong>{nmw.hours} hours a week</strong> at the minimum wage, {shareOfWeek(nmw.hours)} of full time.
      </p>
      <Card className="overflow-hidden border-sandstone-dark/20 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <caption className="sr-only">Hours a week to earn {s}</caption>
            <thead className="bg-sandstone/30 text-navy font-semibold border-b border-sandstone-dark/20">
              <tr>
                <th className="px-4 py-3">Rate from {nmw.effectiveLabel}</th>
                <th className="px-4 py-3 text-right">Hourly</th>
                <th className="px-4 py-3 text-right">Hours</th>
                <th className="px-4 py-3 text-right">Casual</th>
                <th className="px-4 py-3 text-right">Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {rows.map((r) => (
                <tr key={r.label}>
                  <td className="px-4 py-3">
                    <Link href={r.href} className={LINK}>{r.label}</Link>
                    {r.classification ? <span className="text-warmgray"> {r.classification}</span> : null}
                  </td>
                  <td className="px-4 py-3 text-right">{money2(r.hourly)}</td>
                  <td className="px-4 py-3 text-right font-medium">{r.hours}</td>
                  <td className="px-4 py-3 text-right">{money2(r.casualHourly)}</td>
                  <td className="px-4 py-3 text-right">{r.casualHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Apprentice minimums (in the jobs section where they land)
// ---------------------------------------------------------------------------

const YEAR12: Record<ApprenticeOnPage["year12"], string> = {
  completed: ", finished Year 12",
  "not-completed": ", left school before Year 12",
  either: "",
};

export function ApprenticeTable({ salary, rows }: { salary: number; rows: ApprenticeOnPage[] }) {
  if (rows.length === 0) return null;
  const s = formatAUD(salary);
  return (
    <Card className="overflow-hidden border-sandstone-dark/20 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <caption className="sr-only">Apprentice full-time minimums near {s}</caption>
          <thead className="bg-sandstone/30 text-navy font-semibold border-b border-sandstone-dark/20">
            <tr>
              <th className="px-4 py-3">Apprentice minimum</th>
              <th className="px-4 py-3 text-right">A year</th>
              <th className="px-4 py-3 text-right">Take-home a fortnight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/10">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-3 align-top">
                  <span className="block font-medium text-navy">
                    {r.stageLabel}, {r.track}{YEAR12[r.year12]}
                  </span>
                  <span className="block text-xs">
                    {r.trades.map((t, i) => (
                      <React.Fragment key={t.slug}>
                        {i > 0 && " · "}
                        <Link href={t.href} className={LINK}>{t.name}</Link>
                      </React.Fragment>
                    ))}
                  </span>
                </td>
                <td className="px-4 py-3 text-right align-top font-medium text-navy">{formatAUD(r.annual)}</td>
                <td className="px-4 py-3 text-right align-top font-medium text-navy">{formatAUD(r.fortnightlyTakeHome)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// What changes take-home at this salary: one line per item that applies
// ---------------------------------------------------------------------------

/** Low salaries: the offsets that lift take-home (and super). */
function lowItems(salary: number): React.ReactNode[] {
  const s = formatAUD(salary);
  const h = lowIncomeHelp(salary);
  const sg = salaryFacts(salary).employerSuper;
  const now = LISTO_RULES.now;
  const next = LISTO_RULES.next;
  const items: React.ReactNode[] = [];

  items.push(
    <>
      <Link href="/low-income-tax-offset/" className={LINK}>Low Income Tax Offset</Link>:{" "}
      {h.litoStage === "full" && h.incomeTax === 0
        ? `cancels all ${formatAUD(h.bracketTax)} of bracket tax (no income tax up to ${formatAUD(LITO.effectiveTaxFreeThreshold)}).`
        : h.litoStage === "full"
          ? `the full ${formatAUD(LITO.maxOffset)} takes ${formatAUD(h.bracketTax)} of bracket tax to ${formatAUD(h.incomeTax)}.`
          : `${formatAUD(h.lito)}, shrinking 5c a dollar over ${formatAUD(LITO.fullOffsetCeiling)}: ${formatAUD(h.bracketTax)} of bracket tax becomes ${formatAUD(h.incomeTax)}.`}
    </>,
  );
  items.push(
    <>
      <Link href="/medicare-levy/" className={LINK}>Medicare levy</Link> ({SITE_CONFIG.previousFinancialYear} thresholds):{" "}
      {h.medicareStage === "exempt"
        ? `none under ${formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}, saving ${formatAUD(h.medicareFull)}.`
        : h.medicareStage === "shade-in"
          ? `${formatAUD(h.medicare)} instead of ${formatAUD(h.medicareFull)}, shaded in until ${formatAUD(MEDICARE_LEVY.shadeInThreshold)}.`
          : `the full 2%: the reduction ends at ${formatAUD(MEDICARE_LEVY.shadeInThreshold)}.`}
    </>,
  );
  items.push(
    <>
      <Link href="/listo-calculator/" className={LINK}>LISTO</Link> ({now.incomeYear}):{" "}
      {h.listoNow > 0
        ? `${formatAUD(h.listoNow)} into super, refunding the tax on your employer's ${formatAUD(sg)}${h.listoNowCapped ? ` (capped)` : ""}${
            h.listoNext !== h.listoNow ? `; ${formatAUD(h.listoNext)} from ${next.incomeYear}` : ""
          }.`
        : `none over ${formatAUD(now.incomeThreshold)}; ${formatAUD(h.listoNext)} at ${s} from ${next.incomeYear}, when the limit rises to ${formatAUD(next.incomeThreshold)}.`}
    </>,
  );
  if (h.coContribution > 0) {
    items.push(
      <>
        <Link href="/super-co-contribution/" className={LINK}>Co-contribution</Link>: up to {formatAUD(h.coContribution)} for{" "}
        {formatAUD(CO_CONTRIBUTION_RULES.contributionForMax)} of after-tax super, if eligible.
      </>,
    );
  }
  return items;
}

function sacrificeItem(salary: number): React.ReactNode | null {
  const f = salaryFacts(salary);
  const e = sacrificeEffect(salary);
  if (e.amount <= 0) return null;
  const notCut = [salary > HECS_HELP.minimumThreshold ? "HECS-HELP" : null, f.mls.tier > 0 ? "the surcharge" : null].filter(Boolean);
  return (
    <>
      <Link href="/salary-sacrifice-calculator/" className={LINK}>Salary sacrifice</Link>:{" "}
      {e.fits ? (
        <>
          {formatAUD(SACRIFICE_AMOUNT)} into super costs <strong>{money2(e.costFortnight)} a fortnight</strong> and lands {formatAUD(e.intoSuper)} there; {pct(e.rateSaved)} of it
          is tax saved{e.litoGain > 0 ? `, ${formatAUD(e.litoGain)} as extra LITO` : ""}.
        </>
      ) : (
        <>
          only {formatAUD(e.room)} of cap room is left; sacrificing it costs {money2(e.costFortnight)} a fortnight and adds {formatAUD(e.intoSuper)} to super.
        </>
      )}
      {notCut.length > 0 ? ` It does not lower ${notCut.join(" or ")}.` : ""}
    </>
  );
}

function hecsItem(salary: number): React.ReactNode | null {
  const h = hecsShift(salary);
  if (!h) return null;
  const s = formatAUD(salary);
  const parts: string[] = [];
  if (h.rate === 0) parts.push(`nothing to repay; repayments start above ${formatAUD(h.threshold)}`);
  else if (h.topBand) parts.push(`a flat 10% of income from ${formatAUD(h.bandStart)}: ${formatAUD(h.repayment)} (${money2(h.repaymentFortnight)} a fortnight)`);
  else parts.push(`${formatAUD(h.repayment)} a year (${money2(h.repaymentFortnight)} a fortnight) at ${pct(h.rate, 0)} on the next dollar`);
  if (h.prev) parts.push(h.prev.rate === 0 ? `${s} is our first page over the threshold` : `${formatAUD(h.prev.salary)} repays ${formatAUD(h.prev.repayment)} at ${pct(h.prev.rate, 0)}`);
  if (h.next) parts.push(`${formatAUD(h.next.salary)} repays ${formatAUD(h.next.repayment)}${h.next.topBand ? " as 10% of all income" : ` at ${pct(h.next.rate, 0)}`}`);
  return (
    <>
      <Link href="/hecs-help-calculator/" className={LINK}>HECS-HELP</Link>: {parts.join("; ")}.
    </>
  );
}

function mlsItem(salary: number): React.ReactNode | null {
  const m = mlsEffect(salary);
  if (!m) {
    const a = mlsAhead(salary);
    if (!a) return null;
    return (
      <>
        <Link href="/medicare-levy-surcharge-calculator/" className={LINK}>Medicare levy surcharge</Link>: starts {formatAUD(a.distance)} higher, at {formatAUD(a.min)} (
        {pct(a.tier1Rate)} of all income without hospital cover).
      </>
    );
  }
  return (
    <>
      <Link href="/medicare-levy-surcharge-calculator/" className={LINK}>Medicare levy surcharge</Link> without hospital cover: tier {m.tier}, {pct(m.rate, 2)}, so{" "}
      <strong>{money2(m.amountFortnight)} a fortnight</strong> ({formatAUD(m.amount)} a year).
      {m.prevPage ? ` First page in tier ${m.tier}: ${formatAUD(m.prevPage.salary)} ${m.prevPage.tier === 0 ? "pays none" : `pays ${formatAUD(m.prevPage.amount)}`}.` : ""}
      {m.nextPage && m.next ? ` ${formatAUD(m.nextPage.salary)} pays ${formatAUD(m.nextPage.amount)}: past ${formatAUD(m.next.min - 1)} the higher rate covers all income.` : ""}
    </>
  );
}

function div293Item(salary: number): React.ReactNode | null {
  const d = div293Effect(salary);
  if (!d) return null;
  return (
    <>
      <Link href="/division-293-tax/" className={LINK}>Division 293</Link>: income plus super is {formatAUD(d.over)} over {formatAUD(d.threshold)}, so {pct(d.rate, 0)} more on{" "}
      {formatAUD(d.base)} of contributions: <strong>{formatAUD(d.amount)} a year</strong>, billed after your return.
    </>
  );
}

function sgCapItem(salary: number): React.ReactNode | null {
  const c = sgCap(salary);
  if (!c) return null;
  return (
    <>
      <Link href="/superannuation-guide/" className={LINK}>Super guarantee</Link>: stops at {formatAUD(c.maxSG)}, not {formatAUD(c.uncapped)}, as only the first{" "}
      {formatAUD(c.maxBase)} counts; that fills the concessional cap.
    </>
  );
}

export function TakeHomeFactors({ salary }: { salary: number }) {
  const s = formatAUD(salary);
  const band = takeHomeBand(salary);
  const items = (
    band === "low"
      ? [...lowItems(salary), hecsItem(salary)]
      : [mlsItem(salary), div293Item(salary), sgCapItem(salary), sacrificeItem(salary), coItem(salary), hecsItem(salary)]
  ).filter((x): x is React.ReactNode => x !== null);
  if (items.length === 0) return null;
  return (
    <section>
      <h2 style={H2} className="text-2xl font-bold text-navy mb-4">What Changes Take-Home on {s}?</h2>
      <ul className="list-disc pl-5 space-y-2 text-navy leading-relaxed">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

function coItem(salary: number): React.ReactNode | null {
  const co = lowIncomeHelp(salary).coContribution;
  if (co <= 0) return null;
  return (
    <>
      <Link href="/super-co-contribution/" className={LINK}>Co-contribution</Link>: up to {formatAUD(co)} for {formatAUD(CO_CONTRIBUTION_RULES.contributionForMax)} of
      after-tax super ({CO_CONTRIBUTION_RULES.incomeYear}), if eligible.
    </>
  );
}

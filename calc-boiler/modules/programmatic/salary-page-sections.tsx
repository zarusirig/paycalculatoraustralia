/**
 * Shared sections for the programmatic salary pages (/take-home-pay-on/,
 * /tax-on/, /salary-to-hourly/). Wave 3 / T6.
 *
 * With the grid at $1,000 steps, two neighbouring pages differ by very little,
 * so every section here is built from facts that change with the salary — the
 * bracket reached and the distance to the next one, the LITO and Medicare
 * shade-in stage, the MLS tier, the HECS band, whether SG hits the maximum
 * contribution base, Division 293, what the next $1,000 is worth and where
 * the salary sits in the ABS earnings distribution. Copy branches on those
 * facts instead of repeating one paragraph with the number swapped.
 *
 * Every figure comes from lib/data/salary-pages (itself built on the tax
 * engine) or lib/data/average-salary. Nothing is typed in.
 */
import React from "react";
import {
  calculatePayBreakdown,
  EMPLOYMENT,
  formatAUD,
  HECS_HELP,
  LITO,
  MEDICARE_LEVY,
  SITE_CONFIG,
  SUPER_GUARANTEE,
  TAX_BRACKETS,
  TAX_FREE_THRESHOLD,
} from "@/lib/constants/australian-tax";
import { DIVISION_293 } from "@/lib/constants/super-contributions";
import {
  hasPage,
  hubHref,
  nearbySalaries,
  neighbourRows,
  prevNext,
  salaryFacts,
  salaryHref,
  type SalaryFamily,
} from "@/lib/data/salary-pages";
import {
  AWE_HEADLINE,
  AWE_RELEASE,
  EE_RELEASE,
  annualise,
  salaryPercentile,
} from "@/lib/data/average-salary";
import { Card } from "@/components/ui/card";

const H2 = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;
const LINK = "text-eucalyptus hover:text-navy transition-colors font-medium";

const pct = (v: number, d = 1) => `${(v * 100).toFixed(d)}%`;
const rate = (v: number) => `${Number((v * 100).toFixed(2))}%`;

export function familyLabel(family: SalaryFamily, salary: number): string {
  const s = formatAUD(salary);
  if (family === "tax-on") return `Tax on ${s}`;
  if (family === "salary-to-hourly") return `${s} a year to hourly`;
  return `${s} after tax`;
}

const HUB_LABEL: Record<SalaryFamily, string> = {
  "take-home": "Take-home pay on every salary",
  "tax-on": "Tax on every salary",
  "salary-to-hourly": "Every salary as an hourly rate",
};

// ---------------------------------------------------------------------------
// What applies at this salary — band-dependent notes
// ---------------------------------------------------------------------------

function bracketNote(salary: number): string {
  const f = salaryFacts(salary);
  const b = TAX_BRACKETS[f.bracketIndex];
  const floor = b.min - 1; // the published threshold, e.g. $45,000
  const s = formatAUD(salary);
  const aboveFloor = formatAUD(salary - floor);
  const toNext =
    f.nextBracketStart !== null && f.nextBracketRate !== null
      ? f.nextBracketStart - 1 === salary
        ? ` ${s} is the top of this bracket: the very next dollar is taxed at ${rate(f.nextBracketRate)}.`
        : ` The ${rate(f.nextBracketRate)} rate starts above ${formatAUD(f.nextBracketStart - 1)}, ${formatAUD(f.nextBracketStart - 1 - salary)} further up; income tax on a rise up to that size stays at ${rate(b.rate)} in the dollar before offsets and Medicare.`
      : "";

  switch (f.bracketIndex) {
    case 0:
      return `${s} is inside the ${formatAUD(TAX_FREE_THRESHOLD)} tax-free threshold, so no income tax is payable.${toNext}`;
    case 1:
      return `${s} reaches only the first taxed bracket: the ${aboveFloor} above the ${formatAUD(floor)} tax-free threshold is taxed at ${rate(b.rate)}, and nothing is taxed at 30c or more.${toNext}`;
    case 2:
      return `${s} is in the ${rate(b.rate)} bracket, ${aboveFloor} above its ${formatAUD(floor)} floor. The first ${formatAUD(floor)} is taxed at the lower rates regardless.${toNext}`;
    case 3:
      return `${s} has crossed into the ${rate(b.rate)} bracket: ${aboveFloor} of it sits above ${formatAUD(floor)} and is taxed at ${rate(b.rate)}, the rest at the lower rates.${toNext}`;
    default:
      return `${s} reaches the top ${rate(b.rate)} rate. The ${aboveFloor} above ${formatAUD(floor)} is taxed at ${rate(b.rate)} — ${formatAUD((salary - floor) * b.rate)} of the income tax bill comes from that slice alone.`;
  }
}

function litoNote(salary: number): string {
  const f = salaryFacts(salary);
  const lito = f.breakdown.litoOffset;
  switch (f.litoStage) {
    case "full":
      return `The full ${formatAUD(LITO.maxOffset)} Low Income Tax Offset applies${f.breakdown.netIncomeTax === 0 ? ", which wipes out the income tax entirely — LITO means no tax is payable on income up to " + formatAUD(LITO.effectiveTaxFreeThreshold) : ""}.`;
    case "phase-out-5c":
      return `LITO is phasing out here: it is ${formatAUD(lito)} (down from ${formatAUD(LITO.maxOffset)}), falling 5c for every dollar over ${formatAUD(LITO.fullOffsetCeiling)}. That clawback is why the rate on the next dollar is higher than the bracket rate alone.`;
    case "phase-out-1.5c":
      return `A reduced LITO of ${formatAUD(lito)} still applies. It shrinks by 1.5c per dollar over ${formatAUD(LITO.phaseOut1.end)} and runs out at ${formatAUD(LITO.nilOffsetIncome)}, ${formatAUD(LITO.nilOffsetIncome - salary)} above this salary.`;
    default:
      return salary < 100_000
        ? `No Low Income Tax Offset: it cut out at ${formatAUD(LITO.nilOffsetIncome)}, so the full bracket tax is payable.`
        : "";
  }
}

function medicareNote(salary: number): string {
  const f = salaryFacts(salary);
  const yr = SITE_CONFIG.previousFinancialYear;
  switch (f.medicareStage) {
    case "exempt":
      return `No Medicare levy: taxable income is at or under the ${formatAUD(MEDICARE_LEVY.lowIncomeThreshold)} low-income threshold (${yr} figure, the latest the ATO has published).`;
    case "shade-in":
      return `The Medicare levy is shaded in at 10c per dollar over ${formatAUD(MEDICARE_LEVY.lowIncomeThreshold)}, so it is ${formatAUD(f.breakdown.medicareLevy)} rather than the full 2% (${formatAUD(salary * MEDICARE_LEVY.rate)}). Low-income thresholds are the ${yr} figures, the latest the ATO has published.`;
    default:
      return "";
  }
}

function mlsNote(salary: number): string {
  const f = salaryFacts(salary);
  const t1 = MEDICARE_LEVY.surcharge.tier1.min;
  if (f.mls.tier === 0) {
    return salary >= 80_000
      ? `The Medicare Levy Surcharge does not apply yet: singles pay it from ${formatAUD(t1)} (${SITE_CONFIG.financialYear}) without private hospital cover, ${formatAUD(t1 - salary)} above this salary.`
      : "";
  }
  return `Without private hospital cover, a single person on ${formatAUD(salary)} also pays the Medicare Levy Surcharge at ${rate(f.mls.rate)} (tier ${f.mls.tier}, ${SITE_CONFIG.financialYear}): ${formatAUD(f.mls.amount)} a year, which would cut take-home to ${formatAUD(f.breakdown.takeHomePay - f.mls.amount)}. The figures on this page assume you hold cover.`;
}

function hecsNote(salary: number): string {
  const f = salaryFacts(salary);
  const band = HECS_HELP.bands[f.hecsBandIndex];
  const s = formatAUD(salary);
  if (f.hecsBandIndex === 0) {
    return `With a HECS-HELP debt, nothing extra is withheld: ${s} is ${formatAUD(HECS_HELP.minimumThreshold - salary)} under the ${formatAUD(HECS_HELP.minimumThreshold)} repayment threshold for ${SITE_CONFIG.financialYear}.`;
  }
  const rep = formatAUD(f.withHecs.hecsRepayment);
  if (f.hecsBandIndex === HECS_HELP.bands.length - 1) {
    return `With a HECS-HELP debt, repayments at ${s} are a flat ${rate(band.marginalRate)} of total repayment income: ${rep} a year, leaving ${formatAUD(f.withHecs.takeHomePay)} take-home.`;
  }
  return `With a HECS-HELP debt, ${s} falls in the "${band.label}" band, so the compulsory repayment is ${rep} a year and take-home drops to ${formatAUD(f.withHecs.takeHomePay)}. Each extra dollar here costs ${rate(band.marginalRate)} in repayments on top of tax.`;
}

function superNote(salary: number): string {
  const f = salaryFacts(salary);
  const cap = formatAUD(SUPER_GUARANTEE.concessionalCap);
  if (f.superCapped) {
    return `Employer super is capped: SG is only owed on the first ${formatAUD(SUPER_GUARANTEE.maxContributionBaseAnnual)} of earnings (the ${SITE_CONFIG.financialYear} maximum contribution base), so the minimum is ${formatAUD(f.employerSuper)} a year, not 12% of ${formatAUD(salary)} (${formatAUD(salary * SUPER_GUARANTEE.rate)}). That leaves almost none of the ${cap} concessional cap for salary sacrifice.`;
  }
  return `Your employer pays ${formatAUD(f.employerSuper)} in super on top (12%), which uses that much of the ${cap} concessional cap and leaves ${formatAUD(f.concessionalRoom)} of room for salary sacrifice this year.`;
}

function div293Note(salary: number): string {
  const f = salaryFacts(salary);
  if (f.division293 > 0) {
    return `Division 293 applies: income plus employer super (${formatAUD(salary + f.employerSuper)}) is over ${formatAUD(DIVISION_293.threshold)}, so an extra ${rate(DIVISION_293.rate)} tax falls on contributions — about ${formatAUD(f.division293)} on the SG alone. The ATO bills it separately after your return; it is not withheld from pay and is not in the take-home figure.`;
  }
  if (salary >= 200_000) {
    return `Division 293 does not apply yet: income plus employer super is ${formatAUD(salary + f.employerSuper)}, ${formatAUD(DIVISION_293.threshold - salary - f.employerSuper)} under the ${formatAUD(DIVISION_293.threshold)} threshold.`;
  }
  return "";
}

export function SalaryBandNotes({ salary }: { salary: number }) {
  const notes = [
    bracketNote(salary),
    litoNote(salary),
    medicareNote(salary),
    mlsNote(salary),
    hecsNote(salary),
    superNote(salary),
    div293Note(salary),
  ].filter(Boolean);
  return (
    <section>
      <h2 style={H2} className="text-2xl font-bold text-navy mb-4">What Applies at {formatAUD(salary)}?</h2>
      <ul className="list-disc pl-5 space-y-3 text-navy leading-relaxed">
        {notes.map((n, i) => (
          <li key={i}>{n}</li>
        ))}
      </ul>
    </section>
  );
}

// ---------------------------------------------------------------------------
// What the next $1,000 adds
// ---------------------------------------------------------------------------

export function NextThousand({ salary }: { salary: number }) {
  const f = salaryFacts(salary);
  const n = f.nextThousand;
  const sac = f.sacrificeThousand;
  const s = formatAUD(salary);
  const up = formatAUD(salary + 1_000);
  const statutory = f.breakdown.marginalTaxRate;
  const plus = calculatePayBreakdown({ grossSalary: salary + 1_000 });

  // Why the rate on the next $1,000 differs from the headline bracket rate —
  // named from the facts, not guessed.
  const reasons: string[] = [];
  if (f.nextBracketStart !== null && f.nextBracketRate !== null && salary + 1_000 >= f.nextBracketStart) {
    reasons.push(`part of it crosses into the ${rate(f.nextBracketRate)} bracket at ${formatAUD(f.nextBracketStart)}`);
  }
  if (f.breakdown.netIncomeTax === 0 && plus.netIncomeTax === 0) {
    reasons.push("the Low Income Tax Offset still cancels all the income tax");
  } else if (f.litoStage === "phase-out-5c" || f.litoStage === "phase-out-1.5c") {
    reasons.push(`the Low Income Tax Offset shrinks as income rises (${f.litoStage === "phase-out-5c" ? "5c" : "1.5c"} per dollar)`);
  }
  if (f.breakdown.medicareLevy === 0 && plus.medicareLevy === 0) {
    reasons.push("income is still under the Medicare levy threshold");
  } else if (f.medicareStage !== "full" || plus.medicareLevy < (salary + 1_000) * MEDICARE_LEVY.rate) {
    reasons.push("the Medicare levy is still shading in at 10c per dollar");
  }
  const differs = Math.abs(n.effectiveMarginal - statutory) > 0.001;
  const why = differs && reasons.length > 0
    ? ` — ${n.effectiveMarginal > statutory ? "more" : "less"} than the ${pct(statutory)} headline marginal rate because ${reasons.join(" and ")}`
    : "";

  let sacrificeCopy: string;
  if (sac.netGain > 150) {
    sacrificeCopy = `Salary sacrificing $1,000 into super instead costs ${formatAUD(sac.takeHomeCost)} of take-home pay and puts ${formatAUD(sac.intoSuper)} into super after contributions tax, ${formatAUD(sac.netGain)} ahead overall.`;
  } else if (sac.netGain > 0) {
    sacrificeCopy = `Salary sacrificing $1,000 into super costs ${formatAUD(sac.takeHomeCost)} of take-home and adds ${formatAUD(sac.intoSuper)} to super — only ${formatAUD(sac.netGain)} ahead, because the tax rate here is close to the ${rate(0.15)} contributions tax.`;
  } else {
    sacrificeCopy = `Salary sacrificing $1,000 into super does not save tax at this income: it costs ${formatAUD(sac.takeHomeCost)} of take-home and adds ${formatAUD(sac.intoSuper)} after contributions tax.`;
  }

  return (
    <section>
      <h2 style={H2} className="text-2xl font-bold text-navy mb-4">What Does an Extra $1,000 Add on {s}?</h2>
      <p className="text-navy leading-relaxed mb-4">
        A rise from {s} to {up} adds <strong>{formatAUD(n.takeHome)}</strong> to take-home pay, so {pct(n.effectiveMarginal)} of the extra $1,000 goes in tax and Medicare{why}.{" "}
        {n.takeHomeWithHecs !== n.takeHome
          ? `With a HECS-HELP debt you keep ${formatAUD(n.takeHomeWithHecs)} (${pct(n.effectiveMarginalWithHecs)} lost).`
          : "A HECS-HELP debt does not change that."}
      </p>
      <p className="text-navy leading-relaxed">
        {sacrificeCopy} Model other amounts with the <a href="/salary-sacrifice-calculator/" className={LINK}>Salary Sacrifice Calculator</a>.
      </p>
    </section>
  );
}

/**
 * The tax-owed view of the next $1,000 (for /tax-on/): where each dollar of a
 * $1,000 rise goes, line by line. /take-home-pay-on/ carries the prose version,
 * so the paired pages do not repeat each other.
 */
export function NextThousandTaxTable({ salary }: { salary: number }) {
  const s = formatAUD(salary);
  const now = salaryFacts(salary);
  const up = calculatePayBreakdown({ grossSalary: salary + 1_000, includeHECS: true });
  const cur = now.withHecs;
  const rows = [
    { label: "Income tax (after LITO)", v: up.netIncomeTax - cur.netIncomeTax },
    { label: "Medicare levy", v: up.medicareLevy - cur.medicareLevy },
    { label: "HECS-HELP repayment (only with a study loan)", v: up.hecsRepayment - cur.hecsRepayment },
  ];
  const keptNoLoan = now.nextThousand.takeHome;
  return (
    <section>
      <h2 style={H2} className="text-2xl font-bold text-navy mb-4">Tax on the Next $1,000 Above {s}</h2>
      <p className="text-navy leading-relaxed mb-4">
        Moving from {s} to {formatAUD(salary + 1_000)} adds {formatAUD(1_000 - keptNoLoan)} of tax and Medicare, an effective marginal rate of{" "}
        <strong>{pct(now.nextThousand.effectiveMarginal)}</strong> against the {pct(now.breakdown.marginalTaxRate)} headline rate.
      </p>
      <Card className="overflow-hidden border-sandstone-dark/20 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-sandstone/30 text-navy font-semibold border-b border-sandstone-dark/20">
            <tr>
              <th className="px-4 py-3">Of the extra $1,000</th>
              <th className="px-4 py-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/10">
            {rows.map((r) => (
              <tr key={r.label}>
                <td className="px-4 py-3">{r.label}</td>
                <td className="px-4 py-3 text-right">{formatAUD(r.v)}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td className="px-4 py-3">You keep (no study loan)</td>
              <td className="px-4 py-3 text-right">{formatAUD(keptNoLoan)}</td>
            </tr>
            <tr className="font-semibold">
              <td className="px-4 py-3">You keep (with a study loan)</td>
              <td className="px-4 py-3 text-right">{formatAUD(now.nextThousand.takeHomeWithHecs)}</td>
            </tr>
          </tbody>
        </table>
      </Card>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Neighbouring salaries ±$1k / ±$5k
// ---------------------------------------------------------------------------

export function NeighbourTable({
  salary,
  family,
  offsets = [-5_000, -1_000, 0, 1_000, 5_000],
}: {
  salary: number;
  family: SalaryFamily;
  offsets?: readonly number[];
}) {
  const rows = neighbourRows(salary, offsets);
  const hourly = family === "salary-to-hourly";
  return (
    <section>
      <h2 style={H2} className="text-2xl font-bold text-navy mb-4">{formatAUD(salary)} Next to Nearby Salaries</h2>
      <Card className="overflow-hidden border-sandstone-dark/20 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-sandstone/30 text-navy font-semibold border-b border-sandstone-dark/20">
              <tr>
                <th className="px-4 py-3">Salary</th>
                <th className="px-4 py-3 text-right">{hourly ? "Gross hourly" : "Income tax"}</th>
                <th className="px-4 py-3 text-right">Take-home / year</th>
                <th className="px-4 py-3 text-right">{hourly ? "Net hourly" : "Per fortnight"}</th>
                <th className="px-4 py-3 text-right">vs {formatAUD(salary)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {rows.map((r) => {
                const here = r.offset === 0;
                const linked = !here && hasPage(family, r.salary);
                return (
                  <tr key={r.salary} className={here ? "bg-eucalyptus-light/40 font-medium" : ""}>
                    <td className="px-4 py-3">
                      {linked ? (
                        <a href={salaryHref(family, r.salary)} className={LINK}>{formatAUD(r.salary)}</a>
                      ) : (
                        formatAUD(r.salary)
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {hourly ? formatAUD(r.salary / EMPLOYMENT.hoursPerYear, 2) : formatAUD(r.breakdown.netIncomeTax)}
                    </td>
                    <td className="px-4 py-3 text-right">{formatAUD(r.breakdown.takeHomePay)}</td>
                    <td className="px-4 py-3 text-right">
                      {hourly ? formatAUD(r.breakdown.takeHomePay / EMPLOYMENT.hoursPerYear, 2) : formatAUD(r.breakdown.fortnightly)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {here ? "—" : `${r.diff > 0 ? "+" : "−"}${formatAUD(Math.abs(r.diff))}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <p className="mt-3 text-sm text-warmgray">
        Take-home after income tax and Medicare levy, {SITE_CONFIG.financialYear} resident rates, no HECS-HELP.
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Where the salary sits (ABS)
// ---------------------------------------------------------------------------

export function EarningsPosition({ salary }: { salary: number }) {
  // Below $40k a salary is usually part-time, so compare with all employees.
  const population = salary < 40_000 ? "all" : "fullTime";
  const who = population === "all" ? "all employees (full- and part-time)" : "full-time employees";
  const p = salaryPercentile(salary, population);
  const avg = annualise(AWE_HEADLINE.fullTimeOrdinaryWeekly);
  const low = Math.round(p.shareBelowFloor * 100);
  const high = Math.round(p.shareBelowCeiling * 100);
  const vsAvg = salary - avg;
  const position =
    p.bandCeiling === null
      ? `above the ABS's top weekly band (${formatAUD(p.bandFloor)}+), which puts it ahead of about ${low}% of ${who}`
      : low === high
        ? `ahead of about ${low}% of ${who}`
        : `ahead of between ${low}% and ${high}% of ${who} (the ABS publishes $100-a-week bands, so this is a range)`;
  return (
    <p className="text-navy leading-relaxed">
      {formatAUD(salary)} is {formatAUD(p.weekly)} a week before tax, {position} in the ABS{" "}
      <a href={EE_RELEASE.url} className={LINK} rel="noopener noreferrer" target="_blank">{EE_RELEASE.title}, {EE_RELEASE.referencePeriod}</a>.
      It is {formatAUD(Math.abs(vsAvg))} {vsAvg >= 0 ? "above" : "below"} the average full-time salary of {formatAUD(avg)} ({AWE_RELEASE.title}, {AWE_RELEASE.referencePeriod}). See the{" "}
      <a href="/average-salary-australia/" className={LINK}>average salary in Australia</a> for the full distribution.
    </p>
  );
}

// ---------------------------------------------------------------------------
// Prev / next and nearby links
// ---------------------------------------------------------------------------

export function SalaryNav({ salary, family }: { salary: number; family: SalaryFamily }) {
  const { prev, next } = prevNext(family, salary);
  const near = nearbySalaries(family, salary);
  const chip =
    "inline-block rounded-md border border-sandstone-dark/20 px-3 py-1.5 text-sm text-navy transition-colors hover:border-eucalyptus hover:text-eucalyptus";
  return (
    <nav aria-label="Nearby salaries" className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {prev !== null ? (
          <a href={salaryHref(family, prev)} rel="prev" className="block rounded-xl border border-sandstone-dark/20 p-4 hover:bg-sandstone transition-colors">
            <span className="block text-xs text-warmgray">← Previous</span>
            <span className="font-semibold text-navy">{familyLabel(family, prev)}</span>
          </a>
        ) : (
          <span />
        )}
        {next !== null ? (
          <a href={salaryHref(family, next)} rel="next" className="block rounded-xl border border-sandstone-dark/20 p-4 text-right hover:bg-sandstone transition-colors">
            <span className="block text-xs text-warmgray">Next →</span>
            <span className="font-semibold text-navy">{familyLabel(family, next)}</span>
          </a>
        ) : (
          <span />
        )}
      </div>
      <ul className="flex flex-wrap gap-2">
        {near.map((s) => (
          <li key={s}>
            <a href={salaryHref(family, s)} className={chip}>{familyLabel(family, s)}</a>
          </li>
        ))}
        <li>
          <a href={hubHref(family)} className={`${chip} font-semibold`}>{HUB_LABEL[family]}</a>
        </li>
      </ul>
      <p className="text-sm text-warmgray">
        Same salary elsewhere:{" "}
        {(["take-home", "tax-on", "salary-to-hourly"] as const)
          .filter((fam) => fam !== family && hasPage(fam, salary))
          .map((fam, i) => (
            <React.Fragment key={fam}>
              {i > 0 && " · "}
              <a href={salaryHref(fam, salary)} className={LINK}>{familyLabel(fam, salary)}</a>
            </React.Fragment>
          ))}
      </p>
    </nav>
  );
}

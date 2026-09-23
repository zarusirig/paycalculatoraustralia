import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { formatAUD } from "@/lib/constants";
import { calculatePAYGWithholding } from "@/lib/constants/payg-withholding";
import {
  HPSS_AWARD,
  HPSS_OCT_2026,
  HPSS_OCT_2026_LEVEL_1,
  HPSS_OCT_2026_SENIOR,
  HPSS_PROFESSION_AQF,
  HPSS_TABLES,
} from "@/lib/data/job-pay-rates/health-professionals-common";

const money = (n: number) => formatAUD(n, 2);
const r2 = (n: number) => Math.round(n * 100) / 100;

function oldWeekly(label: string): number {
  for (const t of HPSS_TABLES) {
    const r = t.rows.find((x) => x.label === label);
    if (r) return r.weekly;
  }
  throw new Error(`No current HPSS rate for ${label}`);
}

export default function HealthProfessionalsAwardChangesOctober2026() {
  const H = HPSS_OCT_2026;
  const aqf7 = HPSS_OCT_2026_LEVEL_1[7];
  const moves = H.translationAqf7ThreeYear.map((t) => {
    const before = oldWeekly(t.from);
    const after = aqf7[t.to].weekly;
    return { from: t.from, to: aqf7[t.to].label.replace("Level 1 — AQF 7 — ", "AQF 7, "), before, after: Math.max(before, after) };
  });
  const grad = moves[0];
  const senior = moves.find((m) => m.from === "Level 2 pay point 2") ?? moves[moves.length - 1];
  const gradTakeBefore = calculatePAYGWithholding(grad.before, "weekly").netPerPeriod;
  const gradTakeAfter = calculatePAYGWithholding(grad.after, "weekly").netPerPeriod;
  const aqf7Professions = Object.entries(HPSS_PROFESSION_AQF)
    .filter(([, levels]) => levels.length === 1 && levels[0] === 7)
    .map(([name]) => name.toLowerCase() + "s");
  const oldL4Top = oldWeekly("Level 4 pay point 4");
  const newL4 = HPSS_OCT_2026_SENIOR[HPSS_OCT_2026_SENIOR.length - 1].weekly;

  return (
    <>
      <p className="lead">
        Allied health professionals paid under the {HPSS_AWARD.name} move to a new pay structure from the first
        full pay period starting on or after <strong>{H.operativeFrom}</strong>. Pay now depends on the
        qualification level of your profession and your years of experience, and most health professionals get a
        rise: a new graduate in an AQF Level 7 profession who started on the 3-year-degree pay point goes from{" "}
        {money(grad.before)} to <strong>{money(grad.after)} a week</strong>.
      </p>

      <NewsKeyFacts
        title={`New minimum weekly rates from ${H.operativeFrom} (first stage)`}
        rows={[
          ...([5, 7, 9] as const).map((q) => ({
            label: `Level 1, AQF ${q}: 1st year → 7th year+`,
            after: `${money(HPSS_OCT_2026_LEVEL_1[q][0].weekly)} → ${money(HPSS_OCT_2026_LEVEL_1[q][3].weekly)}`,
          })),
          ...HPSS_OCT_2026_SENIOR.map((s) => ({ label: s.label.split(" — ")[0], after: money(s.weekly) })),
        ]}
      />

      <h2>What changes on 1 October</h2>
      <p>
        The Fair Work Commission&apos;s Expert Panel set the new structure in {H.structureDecision} on{" "}
        {H.structureDecidedOn}, as part of its review of gender-based undervaluation in modern awards. On {H.decidedOn} it issued the final first-stage determination ({H.determination}),
        updated for the 2026 Annual Wage Review. Three things change:
      </p>
      <ul>
        <li>
          <strong>Level 1 is split by qualification.</strong> Each profession is assigned the AQF level of its
          standard minimum qualification in Schedule B — for example {aqf7Professions.slice(0, -1).join(", ")} and {aqf7Professions[aqf7Professions.length - 1]} are AQF Level 7,
          and psychologists AQF Level 9. Pay then steps up in the 1st, 2nd–3rd, 4th–6th and 7th-plus years.
        </li>
        <li>
          <strong>New senior levels.</strong> Level 2 (senior clinician, specialist, supervisor or educator) has
          two rates depending on whether you have five years in that role, then Level 3 (advanced clinician or
          section manager) and Level 4 (manager).
        </li>
        <li>
          <strong>Nobody goes backwards.</strong> Clause J.4.3 keeps anyone on their 30 September 2026 rate if it
          is higher than their new one. That matters at the top: the old Level 4 pay point 4 paid{" "}
          {money(oldL4Top)}, against {money(newL4)} for the new Level 4.
        </li>
      </ul>
      <p>
        This is only the first of five stages. Further increases apply from {H.laterStages.join(", ").replace(/, ([^,]*)$/, " and $1")},
        so these rates rise again each year until 2030 on top of any Annual Wage Review increase.
      </p>

      <h2>Worked example: an AQF Level 7 health professional</h2>
      <p>
        Clause J.4.1(e) translates health professionals in an AQF Level 7 profession who entered on the old
        3-year-degree pay point. Using the current rates and the new ones:
      </p>
      <div className="overflow-x-auto not-prose my-6 rounded-xl border border-sandstone-dark/20">
        <table className="min-w-full text-sm text-navy">
          <thead className="bg-sandstone text-left">
            <tr>
              <th className="px-4 py-2 font-semibold">On 30 September 2026</th>
              <th className="px-4 py-2 font-semibold">From 1 October 2026</th>
              <th className="px-4 py-2 font-semibold">Weekly before</th>
              <th className="px-4 py-2 font-semibold">Weekly after</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {moves.map((m) => (
              <tr key={m.from}>
                <td className="px-4 py-2">{m.from}</td>
                <td className="px-4 py-2">{m.to}</td>
                <td className="px-4 py-2">{money(m.before)}</td>
                <td className="px-4 py-2">{money(m.after)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        The graduate&apos;s {money(r2(grad.after - grad.before))} weekly rise is worth about{" "}
        {money(r2(gradTakeAfter - gradTakeBefore))} after tax on the FY2026-27 withholding tables (tax-free
        threshold claimed, no study loan). An experienced clinician on the old Level 2 pay point 2 moves from{" "}
        {money(senior.before)} to {money(senior.after)}, about{" "}
        {formatAUD(Math.round((senior.after - senior.before) * 52))} a year before tax. Your own translation
        depends on your profession&apos;s AQF level and your entry pay point, so check the clause J.4 tables in the
        determination.
      </p>

      <h2>Who is covered</h2>
      <p>
        The award covers national-system employers in the health industry — private practices, private hospitals,
        NDIS and community health providers. State public hospital allied health staff are paid under state
        awards and agreements, and anyone on an enterprise agreement is paid under that agreement rather than
        the award.
      </p>
      <p>
        Current award rates by occupation are on our{" "}
        <Link href="/job-pay-rates/physiotherapist/">physiotherapist</Link>,{" "}
        <Link href="/job-pay-rates/occupational-therapist/">occupational therapist</Link> and{" "}
        <Link href="/job-pay-rates/psychologist/">psychologist</Link> pay pages, and the{" "}
        <Link href="/healthcare-worker-pay/">healthcare worker pay</Link> hub covers nurses and other health roles.
        Use the <Link href="/pay-rise-calculator/">pay rise calculator</Link> to see your increase after tax.
      </p>
    </>
  );
}

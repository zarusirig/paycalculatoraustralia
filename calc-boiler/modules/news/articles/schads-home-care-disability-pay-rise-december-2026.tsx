import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { formatAUD } from "@/lib/constants";
import { calculatePAYGWithholding } from "@/lib/constants/payg-withholding";
import {
  SCHADS_AWARD,
  SCHADS_HOME_CARE_DISABILITY,
  SCHADS_HOME_CARE_DISABILITY_DEC_2026,
  SCHADS_SCHEDULE_E_INCREASE,
  SCHADS_VEHICLE_ALLOWANCE,
} from "@/lib/constants/schads-award";

const money = (n: number) => formatAUD(n, 2);
const r2 = (n: number) => Math.round(n * 100) / 100;
const CASUAL_HOURS = 20;

function row(classification: string) {
  const now = SCHADS_HOME_CARE_DISABILITY.find((r) => r.classification === classification);
  const dec = SCHADS_HOME_CARE_DISABILITY_DEC_2026.find((r) => r.classification === classification);
  if (!now || !dec) throw new Error(`No Schedule E rate for ${classification}`);
  return { now: now.weekly, dec: dec.weekly, nowHourly: now.hourly, decHourly: r2(dec.weekly / SCHADS_AWARD.standardWeeklyHours) };
}

export default function SchadsHomeCareDisabilityPayRiseDecember2026() {
  const S = SCHADS_SCHEDULE_E_INCREASE;
  const l3 = row("Level 3 pay point 1");
  const takeNow = calculatePAYGWithholding(l3.now, "weekly").netPerPeriod;
  const takeDec = calculatePAYGWithholding(l3.dec, "weekly").netPerPeriod;
  const casualNow = r2(l3.nowHourly * (1 + SCHADS_AWARD.casualLoading));
  const casualDec = r2(l3.decHourly * (1 + SCHADS_AWARD.casualLoading));
  const pctLabel = `${Math.round(S.interimIncrease * 100)}%`;

  return (
    <>
      <p className="lead">
        Home care workers who look after people with disability will get a pay rise of up to{" "}
        <strong>{pctLabel}</strong> from the first full pay period starting on or after{" "}
        <strong>{S.operativeFrom}</strong>. The Fair Work Commission&apos;s Expert Panel confirmed the increase on{" "}
        {S.decidedOn} ({S.decision}), but pushed it back two months from the {S.deferredFrom} start it had
        proposed. A full-time Level 3 worker with a Certificate III goes from {formatAUD(l3.now, 2)} to{" "}
        <strong>{formatAUD(l3.dec, 2)} a week</strong>.
      </p>

      <NewsKeyFacts
        title="Schedule E minimum weekly rates (full-time)"
        rows={SCHADS_HOME_CARE_DISABILITY_DEC_2026.map((r) => {
          const now = SCHADS_HOME_CARE_DISABILITY.find((x) => x.classification === r.classification);
          return { label: r.classification, before: now ? money(now.weekly) : "—", after: money(r.weekly) };
        })}
      />

      <h2>Who gets the {pctLabel}</h2>
      <p>
        The rise covers employees under Schedule E of the {SCHADS_AWARD.name} — &ldquo;home care employee —
        disability care&rdquo;. The award defines home care disability work as domestic assistance or home
        maintenance for a person with disability in the home care sector, and it does not include disability
        support work, which sits in the social and community services stream (Schedule B) and is not part of
        this increase.
      </p>
      <p>
        Every Schedule E rate rises {pctLabel} except Level 4 pay point 2 and Level 5 pay point 2, which rise{" "}
        {(S.exceptions["Level 4 pay point 2"] * 100).toFixed(2)}% and{" "}
        {(S.exceptions["Level 5 pay point 2"] * 100).toFixed(2)}% — for those two, that is the whole increase
        the Commission found they were owed. Casuals keep the {Math.round(SCHADS_AWARD.casualLoading * 100)}%
        loading on top of the new base rate.
      </p>

      <h2>Why it was delayed to December</h2>
      <p>
        In June the Commission proposed a 1 October 2026 start. Employer groups argued for 2027, saying the
        Commonwealth had not committed to funding the increase and that most of this work is paid for by the
        NDIS at prices providers cannot change quickly. The Panel held that these workers should not wait until
        October 2027, but moved the start to 1 December &ldquo;given the absence of any commitment by the
        Commonwealth Government regarding funding&rdquo;.
      </p>
      <p>
        The rest of the increase — a further {S.remainderRange}, on top of the {pctLabel} — arrives on{" "}
        {S.remainderFrom}, when a new classification structure replaces Schedules B, C, E and F of the award.
        Those rates will be adjusted for the 2027 Annual Wage Review first.
      </p>

      <h2>What it means for take-home pay</h2>
      <p>
        On the FY2026-27 withholding tables, with the tax-free threshold claimed and no study loan, the Level 3
        pay point 1 worker takes home about {money(takeNow)} a week now and <strong>{money(takeDec)}</strong>{" "}
        from December — {money(r2(takeDec - takeNow))} more, from a gross rise of {money(r2(l3.dec - l3.now))}.
        A casual at the same level goes from {money(casualNow)} to about {money(casualDec)} an hour (the new
        weekly rate divided by 38, plus the casual loading), or {money(r2((casualDec - casualNow) * CASUAL_HOURS))}{" "}
        more for a {CASUAL_HOURS}-hour week before tax.
      </p>
      <p>
        Separately, the SCHADS vehicle allowance is temporarily ${SCHADS_VEHICLE_ALLOWANCE.temporaryPerKm.toFixed(2)}{" "}
        a kilometre from {SCHADS_VEHICLE_ALLOWANCE.temporaryFromLabel} to{" "}
        {SCHADS_VEHICLE_ALLOWANCE.temporaryToLabel} ({SCHADS_VEHICLE_ALLOWANCE.determination}), up from $
        {SCHADS_VEHICLE_ALLOWANCE.ordinaryPerKm.toFixed(2)}.
      </p>
      <p>
        Full rate tables, penalty rates and allowances are on our{" "}
        <Link href="/schads-award-pay-rates/">SCHADS Award pay rates</Link> page. To see what your own rise is
        worth after tax, use the <Link href="/pay-rise-calculator/">pay rise calculator</Link> or the{" "}
        <Link href="/weekly-pay-calculator/">weekly pay calculator</Link>.
      </p>
    </>
  );
}

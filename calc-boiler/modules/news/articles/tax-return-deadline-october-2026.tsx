import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { GENERAL_INTEREST_CHARGE, formatAUD } from "@/lib/constants";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";
import {
  FTL_MAX_INDIVIDUAL,
  PENALTY_UNIT,
  RETURN_DATES_2026,
  formatIso,
  weekdayOf,
} from "@/lib/constants/tax-calendar-2026-27";

const DEBT = 2_000; // an example tax bill left unpaid
const DAYS = 30;

export default function TaxReturnDeadlineOctober2026() {
  const self = RETURN_DATES_2026.selfLodge;
  const moved = self.effectiveIso !== self.iso;
  const G = GENERAL_INTEREST_CHARGE;
  const n = G.nextQuarter;
  const gic = Math.round(DEBT * ((1 + n.dailyRatePercent / 100) ** DAYS - 1) * 100) / 100;
  const ftl = (days: number) => Math.min(Math.ceil(days / PENALTY_UNIT.ftlDaysPerUnit), PENALTY_UNIT.ftlMaxUnits) * PENALTY_UNIT.amount;
  const pct = (r: number) => `${(r * 100).toFixed(2)}%`;

  return (
    <>
      <p className="lead">
        If you lodge your own {RETURN_2026.incomeYear} tax return, it is due by <strong>{RETURN_2026.selfLodgeDueDate}</strong>.
        {moved ? (
          <>
            {" "}That is a {weekdayOf(self.iso)} this year, and under the ATO&apos;s weekend rule a due date that falls
            on a non-business day moves to the next business day — <strong>{weekdayOf(self.effectiveIso)}{" "}
            {formatIso(self.effectiveIso, "long")}</strong>.
          </>
        ) : null}{" "}
        Miss it and you risk a failure-to-lodge penalty of {formatAUD(PENALTY_UNIT.amount)} for every 28 days, and
        interest on any tax you owe at {pct(n.annualRate)} a year from {n.startsOn}.
      </p>

      <NewsKeyFacts
        title={`${RETURN_2026.incomeYear} tax return: the dates and the cost of missing them`}
        rows={[
          { label: "Self-lodgment due date", after: moved ? `${RETURN_2026.selfLodgeDueDate} (lodge by ${formatIso(self.effectiveIso, "long")})` : RETURN_2026.selfLodgeDueDate },
          { label: "Via a registered tax agent (most people)", after: `${RETURN_2026.agentDueDateMostPeople}, if on the agent's list by ${RETURN_2026.selfLodgeDueDate}` },
          { label: "Failure-to-lodge penalty", after: `${formatAUD(PENALTY_UNIT.amount)} per 28 days late, max ${formatAUD(FTL_MAX_INDIVIDUAL)}` },
          { label: `General interest charge, ${n.label}`, before: pct(G.annualRate), after: pct(n.annualRate) },
          { label: "Typical online refund", after: `within ${RETURN_2026.onlineRefundTypical}` },
        ]}
      />

      <h2>Two ways to get more time</h2>
      <p>
        The simplest is a registered tax agent. If you are on an agent&apos;s client list before{" "}
        {RETURN_2026.selfLodgeDueDate}, most people&apos;s {RETURN_2026.incomeYear} return is not due until{" "}
        {RETURN_2026.agentDueDateMostPeople}. The ATO warns that first-time clients, or anyone changing agent, should
        contact the agent before 31 October. Some clients get an earlier date — for example{" "}
        {RETURN_2026.agentDueDateLargeLiability} if their latest return had a tax liability of $20,000 or more.
      </p>
      <p>
        The other is the weekend rule. The ATO says that when a lodgment or payment due date falls on a day that is
        not a business day, you can lodge or pay on the next business day
        {moved ? `, which this year gives self-lodgers until ${weekdayOf(self.effectiveIso)} ${formatIso(self.effectiveIso, "long")}` : ""}.
        Don&apos;t plan around the last day: myTax pre-fill has been ready since {RETURN_2026.prefillReady}, and most
        online returns are processed in about {RETURN_2026.onlineProcessingBusinessDays} business days.
      </p>

      <h2>What lodging late costs</h2>
      <p>
        The failure-to-lodge penalty is one penalty unit — {formatAUD(PENALTY_UNIT.amount)} for failures on or after{" "}
        {PENALTY_UNIT.from} — for every 28 days or part of 28 days the return is overdue, up to five units (
        {formatAUD(FTL_MAX_INDIVIDUAL)}) for an individual. A return 10 days late would attract{" "}
        {formatAUD(ftl(10))}; 60 days late, {formatAUD(ftl(60))}. The ATO says it generally does not apply the
        penalty for an isolated late lodgment, and warns you and issues a notice to lodge before it does.
      </p>
      <p>
        Interest is the bigger risk if you owe tax. The general interest charge compounds daily and resets each
        quarter; the ATO has set it at <strong>{pct(n.annualRate)}</strong> for {n.label}, up from{" "}
        {pct(G.annualRate)}, with a daily rate of {n.dailyRatePercent}%. On a {formatAUD(DEBT)} bill left unpaid
        for {DAYS} days, that is about {formatAUD(gic, 2)} — and GIC incurred from 1 July 2025 can&apos;t be claimed as a tax deduction.
      </p>

      <h2>Check your refund before you lodge</h2>
      <p>
        The {RETURN_2026.incomeYear} return uses last year&apos;s tax rates, not the 2026-27 ones now in your pay. Our{" "}
        <Link href="/tax-return-calculator/">tax return calculator</Link> estimates your refund or bill on{" "}
        {RETURN_2026.incomeYear} rates, and the <Link href="/tax-return-2026/">2026 tax return guide</Link> covers
        what&apos;s new, including the {RETURN_2026.wfhFixedRateCents}c work-from-home rate and{" "}
        {RETURN_2026.carCentsPerKm}c per kilometre for car expenses. Every other date for the year is on our{" "}
        <Link href="/tax-calendar/">tax calendar</Link>.
      </p>
    </>
  );
}

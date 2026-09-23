import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { NMW_DECISION, QLD_STATE_WAGE_CASE_2026 } from "@/lib/constants/minimum-wage";
import { QLD } from "@/lib/data/public-service-pay/qld";
import { nearestSalary, salaryHref } from "@/lib/data/salary-pages";

function payPoint(scheduleId: string, label: string): number {
  const schedule = QLD.schedules.find((s) => s.id === scheduleId);
  for (const stream of schedule?.streams ?? []) {
    for (const band of stream.bands) {
      const p = band.payPoints?.find((x) => x.label === label);
      if (p) return p.annual;
    }
  }
  throw new Error(`No QLD pay point ${label} in ${scheduleId}`);
}

export default function QueenslandStateWageCase2026() {
  const Q = QLD_STATE_WAGE_CASE_2026;
  const pct = `${(Q.increase * 100).toFixed(2)}%`;
  const ao2 = payPoint("award-2026", "AO2/1");
  const ao3 = payPoint("award-2026", "AO3/1");
  const ao3Doe = payPoint("doe-2026", "AO3/1");
  const ao5 = payPoint("award-2026", "AO5/1");
  const po4 = payPoint("award-2026", "PO4/1");
  const ao3Pay = calculatePayBreakdown({ grossSalary: ao3 });
  const ao3Link = salaryHref("take-home", nearestSalary("take-home", ao3));

  return (
    <>
      <p className="lead">
        Queensland state award wages rose <strong>{pct}</strong> from <strong>{Q.operativeFrom}</strong>. The
        Queensland Industrial Relations Commission&apos;s State Wage Case decision ({Q.citation}), delivered on{" "}
        {Q.deliveredOn}, matched the federal Annual Wage Review and set the Queensland minimum wage at{" "}
        <strong>{formatAUD(Q.qmwWeekly, 2)} a week</strong>, the same as the national minimum wage.
      </p>

      <NewsKeyFacts
        title={`2026 State Wage Case — operative ${Q.operativeFrom}`}
        rows={[
          { label: "State award wages and salaries (full-time adults)", after: `+${pct}` },
          { label: "Work-related allowances and service increments", after: `+${pct}` },
          { label: "Queensland minimum wage", after: `${formatAUD(Q.qmwWeekly, 2)} a week` },
          { label: "Award floor: AO3 pay point 1", after: `${formatAUD(ao3)} a year` },
          { label: "Award floor: AO5 / PO4 pay point 1", after: `${formatAUD(ao5)} / ${formatAUD(po4)}` },
        ]}
      />

      <h2>Who it covers</h2>
      <p>
        Award rates in the national Fair Work system rose {(NMW_DECISION.awardIncrease * 100).toFixed(2)}% from{" "}
        {NMW_DECISION.operativeFrom}. The State Wage Case covers
        Queensland employers outside that system — chiefly the state public sector and local government. The parties&apos; agreed statistics in the decision put that group at an estimated{" "}
        {Q.qldSystemWorkers.toLocaleString("en-AU")} workers, including {Q.qldPublicSector.toLocaleString("en-AU")} in
        the Queensland public sector, where {Math.round(Q.qldPublicSectorAgreementCoverage * 100)}% are covered by an
        agreement and {Q.qldPublicSectorAwardReliant.toLocaleString("en-AU")} rely on the award alone.
      </p>
      <p>
        The Commission made four orders: a {pct} increase to wages and salaries for full-time adult employees in all
        state awards; the same increase to work-related monetary allowances and service increments (expense-related
        allowances are adjusted separately); the {formatAUD(Q.qmwWeekly, 2)} minimum; and an operative date of{" "}
        {Q.operativeFrom}. It also clarified that employees under 21 covered by a Queensland modern award are paid
        that award&apos;s junior rates rather than the minimum wage.
      </p>

      <h2>Why it matters even if you are on an agreement</h2>
      <p>
        An award is the floor, so a certified agreement rate cannot fall below it. The State Government Entities
        Certified Agreement 2023, which covers most departments, passed its nominal expiry on 30 June 2026 and still
        applies while a replacement is negotiated. Where agreement rates have not moved, the {pct} award rise can
        overtake them. Take the administrative stream: under the Queensland Public Service Officers and Other Employees
        Award, AO3 pay point 1 is now {formatAUD(ao3)} a year, while the Department of Education&apos;s agreement
        schedule from the same date pays {formatAUD(ao3Doe)}. The award rate is what an AO3 there must be paid.
      </p>

      <h2>What it means for take-home pay</h2>
      <p>
        On {formatAUD(ao3)}, a full-year AO3 takes home about{" "}
        <strong>{formatAUD(Math.round(ao3Pay.takeHomePay))}</strong> after income tax and the Medicare levy on
        2026-27 rates, or {formatAUD(Math.round(ao3Pay.fortnightly))} a fortnight. The entry adult rate for the
        stream, AO2 pay point 1, is {formatAUD(ao2)}. For a closer figure see{" "}
        <Link href={ao3Link}>take-home pay on {formatAUD(nearestSalary("take-home", ao3))}</Link>.
      </p>
      <p>
        Every AO, PO, TO and OO pay point is on our{" "}
        <Link href="/public-service-pay-scales/qld/">Queensland public service pay scales</Link> page. Check your own
        rise with the <Link href="/pay-rise-calculator/">pay rise calculator</Link>, or run a full breakdown on the{" "}
        <Link href="/pay-calculator-qld/">Queensland pay calculator</Link>.
      </p>
    </>
  );
}

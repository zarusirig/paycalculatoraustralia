import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { calculatePayBreakdown, formatAUD } from "@/lib/constants";
import { ATC_24_MONTH_COLUMN, ATC_PAY } from "@/lib/data/aviation-pay/air-traffic-controller";

const SHOWN = ["Ab Initio Trainee", "Field Trainee", "Level 1", "Level 5", "Level 10", "UTS"];

export default function AirTrafficControllerPayRiseOctober2026() {
  const A = ATC_24_MONTH_COLUMN;
  const steps = ATC_PAY.scales.find((s) => s.id === "atc-classification")?.steps ?? [];
  const rows = steps.map((s) => ({ label: s.label, now: s.salary, next: A.salaries[s.label] ?? s.salary }));
  const pick = (label: string) => {
    const r = rows.find((x) => x.label === label);
    if (!r) throw new Error(`No ATC step ${label}`);
    return r;
  };
  const l1 = pick("Level 1");
  const l10 = pick("Level 10");
  const l1Pay = { now: calculatePayBreakdown({ grossSalary: l1.now }), next: calculatePayBreakdown({ grossSalary: l1.next }) };
  const pct = `${(A.increase * 100).toFixed(1)}%`;

  return (
    <>
      <p className="lead">
        Airservices Australia&apos;s air traffic controllers are due a <strong>{pct}</strong> base pay rise on{" "}
        <strong>{A.dueOn}</strong>, the last scheduled increase under their 2024-2027 enterprise agreement. A newly
        licensed Level 1 controller goes from {formatAUD(l1.now)} to <strong>{formatAUD(l1.next)}</strong>, and the top
        of the scale, Level 10, from {formatAUD(l10.now)} to <strong>{formatAUD(l10.next)}</strong>.
      </p>

      <NewsKeyFacts
        title={`Controller base salaries, before and after the ${pct} rise`}
        rows={SHOWN.map((label) => {
          const r = pick(label);
          return { label, before: formatAUD(r.now), after: formatAUD(r.next) };
        })}
      />

      <h2>Where the {pct} comes from</h2>
      <p>
        The {ATC_PAY.instrument.name} was approved by the Fair Work Commission on 30 September 2024 and operates from
        7 October 2024. Its salary table (Attachment 1) has three columns: a 4% rise on commencement, 3.8% after 12
        months and {pct} after 24 months. The &ldquo;24 months&rdquo; column falls due on {A.dueOn}. The table does not
        name the pay period in which it is first paid, so check your payslip for the first full period after that
        date.
      </p>
      <p>
        The rise applies to every controller classification in the table, from ab initio trainees to the supervisor
        grades. On top of the pay rise, controllers from Level 1 still move up one level a year to Level 10 if they meet the licence,
        medical and training conditions in clause 27.3 — so a controller who also progresses a level gets both.
      </p>

      <h2>What it means after tax</h2>
      <p>
        For a Level 1 controller the rise is worth {formatAUD(l1.next - l1.now)} a year before tax. On 2026-27 rates,
        take-home pay goes from about {formatAUD(Math.round(l1Pay.now.takeHomePay))} to{" "}
        <strong>{formatAUD(Math.round(l1Pay.next.takeHomePay))}</strong> a year — about{" "}
        {formatAUD(Math.round(l1Pay.next.fortnightly - l1Pay.now.fortnightly))} more a fortnight — before penalty rates,
        overtime and allowances, which depend on roster and location. Under the agreement, overtime is paid at 1.90
        times the hourly rate.
      </p>

      <h2>Staffing pressure and the next agreement</h2>
      <p>
        The rise comes as Airservices is under pressure over controller staffing. On 23 September 2026 The Australian
        and Australian Aviation reported that it would offer controllers an enhanced overtime incentive for
        short-notice shifts over the school holidays, to reduce delays. The current agreement reaches its nominal
        expiry date on 7 October 2027; salaries after that depend on a replacement agreement.
      </p>
      <p>
        The full classification table, trainee pay and allowances are on our{" "}
        <Link href="/air-traffic-controller-salary/">air traffic controller salary</Link> page, and the{" "}
        <Link href="/pilot-salary/">pilot salary</Link> page covers airline pilots. Work out your own
        figure with the <Link href="/pay-rise-calculator/">pay rise calculator</Link> or the{" "}
        <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.
      </p>
    </>
  );
}

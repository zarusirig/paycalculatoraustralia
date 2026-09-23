import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { formatAUD } from "@/lib/constants";
import { VIC_TEACHER_PAY } from "@/lib/data/teacher-pay/vic";
import {
  VIC_2026_AGREEMENT,
  VIC_2026_EFFECTIVE_DATES,
  VIC_2026_INCREASES,
  proposedRate,
} from "@/lib/data/teacher-pay/vic-2026-agreement";

const CLASSROOM = "classroom-teachers-2026";
const RANGE_3 = "leading-teacher-learning-specialist-2026";

function now(scaleId: string, label: string): number {
  const scale = VIC_TEACHER_PAY.scales.find((s) => s.id === scaleId.replace(/-2026$/, ""));
  const step = scale?.steps.find((s) => s.label === label);
  if (!step) throw new Error(`No VGSA 2022 rate for ${scaleId} ${label}`);
  return step.salary;
}

function proposed(scaleId: string, label: string, column: number): number {
  const r = proposedRate(scaleId, label, column);
  if (r === null) throw new Error(`No VGSA 2026 rate for ${scaleId} ${label} col ${column}`);
  return r;
}

export default function VictorianTeachersPayRise2026() {
  const gradNow = now(CLASSROOM, "1-1");
  const gradOct = proposed(CLASSROOM, "1-1", 1);
  const gradEnd = proposed(CLASSROOM, "1-1", 4);
  const topNow = now(CLASSROOM, "2-6");
  const topOct = proposed(CLASSROOM, "2-6", 1);
  const topEnd = proposed(CLASSROOM, "2-6", 4);
  const ltNow = now(RANGE_3, "3-2");
  const ltOct = proposed(RANGE_3, "3-2", 1);

  return (
    <>
      <p className="lead">
        Victorian government school staff have approved their new enterprise agreement:{" "}
        <strong>{VIC_2026_AGREEMENT.ballotYesPct}%</strong> of the{" "}
        {VIC_2026_AGREEMENT.ballotParticipants.toLocaleString("en-AU")} employees who voted said yes,
        the Department of Education announced on {VIC_2026_AGREEMENT.ballotAnnounced}. Once the Fair Work
        Commission approves it, a teacher at the top of the classroom scale goes from{" "}
        <strong>{formatAUD(topNow)}</strong> to <strong>{formatAUD(topOct)}</strong> from October 2026, and
        to {formatAUD(topEnd)} by November 2029.
      </p>

      <NewsKeyFacts
        title="Key figures (proposed VGSA 2026)"
        rows={[
          { label: "Graduate teacher (1-1), from Oct 2026", after: `${formatAUD(gradNow)} → ${formatAUD(gradOct)}` },
          { label: "Top classroom teacher (2-6), from Oct 2026", after: `${formatAUD(topNow)} → ${formatAUD(topOct)}` },
          { label: "Leading teacher / learning specialist (3-2), from Oct 2026", after: `${formatAUD(ltNow)} → ${formatAUD(ltOct)}` },
          { label: "Top classroom teacher (2-6), from Nov 2029", after: `${formatAUD(topNow)} → ${formatAUD(topEnd)}` },
          { label: "Lump sum on commencement (full-time)", after: formatAUD(VIC_2026_AGREEMENT.lumpSum) },
          { label: "Staff ballot", after: `${VIC_2026_AGREEMENT.ballotYesPct}% yes, ${VIC_2026_AGREEMENT.ballotParticipationPct}% turnout` },
        ]}
      />

      <h2>What happens next</h2>
      <p>
        The ballot was the Fair Work Act&apos;s employee vote. The department must lodge the agreement with
        the Fair Work Commission within 14 days of the ballots closing, and the government says approval
        can take up to six weeks. The agreement starts operating on the seventh day after the Commission
        approves it, and runs to a nominal expiry date of {VIC_2026_AGREEMENT.nominalExpiry}.
      </p>
      <p>
        Until then the Victorian Government Schools Agreement 2022 still applies, and its 1 July 2025 rates
        are what teachers are paid. The{" "}
        <Link href="/teacher-pay-australia/vic/">Victorian teacher pay scale</Link> shows both: the rates
        in force now, and the new agreement&apos;s full schedule.
      </p>

      <h2>When each pay rise applies</h2>
      <p>
        Schedule 1 of the proposed agreement sets five increases, each from the first pay period on or
        after the date shown. The first two dates fall before the agreement can start; clause 8 still
        makes each increase payable from its own date.
      </p>
      <div className="overflow-x-auto not-prose my-6 rounded-xl border border-sandstone-dark/20">
        <table className="min-w-full text-sm text-navy">
          <thead className="bg-sandstone text-left">
            <tr>
              <th className="px-4 py-2 font-semibold">From the first pay period on or after</th>
              <th className="px-4 py-2 font-semibold">Increase</th>
              <th className="px-4 py-2 font-semibold">Graduate (1-1)</th>
              <th className="px-4 py-2 font-semibold">Top step (2-6)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {VIC_2026_EFFECTIVE_DATES.map((date, i) => (
              <tr key={date}>
                <td className="px-4 py-2">{date}</td>
                <td className="px-4 py-2">{VIC_2026_INCREASES[i]}</td>
                <td className="px-4 py-2">{formatAUD(proposed(CLASSROOM, "1-1", i))}</td>
                <td className="px-4 py-2">{formatAUD(proposed(CLASSROOM, "2-6", i))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Percentages are from the department&apos;s Agreement Explanation. The August 2026 step is bigger at
        the bottom of the scale — 6.33% for a graduate against 3% at the top — so over the whole agreement
        a graduate&apos;s salary rises from {formatAUD(gradNow)} to {formatAUD(gradEnd)}, about{" "}
        {Math.round((gradEnd / gradNow - 1) * 1000) / 10}%, while the top classroom step rises about{" "}
        {Math.round((topEnd / topNow - 1) * 1000) / 10}%.
      </p>

      <h2>What else is in the deal</h2>
      <ul>
        <li>
          <strong>{formatAUD(VIC_2026_AGREEMENT.lumpSum)} lump sum</strong> for full-time employees when the
          agreement starts, pro rata for part-time staff.
        </li>
        <li>
          <strong>Meetings halved</strong> from 80 to 40 hours a year from the 2027 school year, with another
          40 hours set by teachers for planning, preparation and assessment.
        </li>
        <li>
          <strong>Professional practice days:</strong> one in 2026 and four a year from 2027, extended to
          education support staff for the first time.
        </li>
        <li>
          <strong>Face-to-face teaching maximums</strong> — 21 hours a week in primary and special schools,
          18.5 in secondary — written into the agreement.
        </li>
        <li>
          <strong>An overnight school camp allowance</strong> from 2027, replacing time in lieu.
        </li>
      </ul>
      <p>
        The agreement covers the principal, teacher, paraprofessional, education support and executive
        classes. The government says salaries across teachers, education support staff and principals rise
        by at least 28.3% over four years and at least 13% by October 2026.
      </p>

      <h2>How the deal was reached: two strikes and a rejected offer</h2>
      <ul>
        <li>
          <strong>March 2026:</strong> teachers rejected a 17% offer; the AEU was seeking 35%. On 24 March
          teachers, principals and support staff held a 24-hour statewide strike — the first in 13 years —
          and police estimated 35,000 marched to Parliament House (ABC).
        </li>
        <li>
          <strong>May–June 2026:</strong> the AEU reached an in-principle deal worth 28% to 32% over four
          years, but members voted it down against the union&apos;s advice, about 58% to 42% (ABC).
        </li>
        <li>
          <strong>23 July 2026:</strong> a second statewide strike; police estimated 20,000 at the Melbourne
          rally (ABC).
        </li>
        <li>
          <strong>10–17 August 2026:</strong> the government revised its offer, adding the $2,000 lump sum.
          AEU members voted 79% to accept, the government announced the in-principle agreement on{" "}
          {VIC_2026_AGREEMENT.inPrincipleAnnounced}, and a third strike set for 19 August was called off.
        </li>
        <li>
          <strong>{VIC_2026_AGREEMENT.ballotAnnounced}:</strong> the all-staff ballot result —{" "}
          {VIC_2026_AGREEMENT.ballotYesPct}% yes from {VIC_2026_AGREEMENT.ballotParticipants.toLocaleString("en-AU")}{" "}
          voters.
        </li>
      </ul>

      <h2>What it means for your pay</h2>
      <p>
        On {formatAUD(topOct)} a year, a top-step classroom teacher&apos;s take-home pay is close to the{" "}
        <Link href="/take-home-pay-on/135000/">take-home pay on $135,000</Link>; a graduate on{" "}
        {formatAUD(gradOct)} is close to <Link href="/take-home-pay-on/95000/">$95,000</Link>. Use the{" "}
        <Link href="/pay-rise-calculator/">pay rise calculator</Link> to see what your own step&apos;s
        increase is worth after tax, and the{" "}
        <Link href="/teacher-pay-australia/">teacher pay by state</Link> guide to compare Victoria with other
        states.
      </p>
    </>
  );
}

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { formatAUD } from "@/lib/constants";
import { takeHomeHref } from "@/lib/data/teacher-pay";
import { VIC_TEACHER_PAY } from "@/lib/data/teacher-pay/vic";
import {
  VIC_2026_AGREEMENT,
  VIC_2026_COLUMN_LABELS,
  VIC_2026_EFFECTIVE_DATES,
  VIC_2026_INCREASES,
  VIC_2026_SCALES,
  proposedRate,
} from "@/lib/data/teacher-pay/vic-2026-agreement";

const HEADING_FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" } as const;

/** The VGSA 2022 rate for the same step, looked up from the live VIC scales. */
function currentRate(scaleId: string, label: string): number | null {
  const scale = VIC_TEACHER_PAY.scales.find((s) => s.id === scaleId.replace(/-2026$/, ""));
  return scale?.steps.find((s) => s.label === label)?.salary ?? null;
}

const HIGHLIGHTS: { label: string; scaleId: string; step: string }[] = [
  { label: "Graduate (1-1)", scaleId: "classroom-teachers-2026", step: "1-1" },
  { label: "Top of Range 1 (1-5)", scaleId: "classroom-teachers-2026", step: "1-5" },
  { label: "Top classroom teacher (2-6)", scaleId: "classroom-teachers-2026", step: "2-6" },
  { label: "Leading teacher / learning specialist (3-2)", scaleId: "leading-teacher-learning-specialist-2026", step: "3-2" },
];

/**
 * "2026 pay rise" section for /teacher-pay-australia/vic/ — the proposed
 * VGSA 2026 salary schedule, clearly separated from the VGSA 2022 rates that
 * remain payable until the Fair Work Commission approves the new agreement.
 */
export default function VicPayRise2026() {
  const pending = VIC_2026_AGREEMENT.status === "pending-fwc";

  return (
    <section id="pay-rise-2026">
      <h2 style={HEADING_FONT}>Victorian teachers pay rise 2026: the new agreement&apos;s rates</h2>

      {pending && (
        <div className="not-prose my-6 flex gap-3 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm text-navy">
            <strong>Voted up, not yet in force.</strong> Staff approved the proposed{" "}
            {VIC_2026_AGREEMENT.name} in a ballot announced on {VIC_2026_AGREEMENT.ballotAnnounced}:{" "}
            {VIC_2026_AGREEMENT.ballotParticipants.toLocaleString("en-AU")} employees voted (
            {VIC_2026_AGREEMENT.ballotParticipationPct}% of those eligible) and{" "}
            {VIC_2026_AGREEMENT.ballotYesPct}% voted yes. It now needs Fair Work Commission approval
            and starts operating seven days after that. Until then the VGSA 2022 rates further down
            this page are what is paid.
          </p>
        </div>
      )}

      <p>
        The rates below are Schedule 1 of the{" "}
        <a href={VIC_2026_AGREEMENT.agreementUrl} target="_blank" rel="noreferrer noopener">
          proposed agreement
        </a>{" "}
        the Department of Education published for the ballot, read on {VIC_2026_AGREEMENT.verifiedOn}.
        Salaries rise at five dates — each from the first pay period on or after the date — for a
        total of {VIC_2026_AGREEMENT.headlineRiseOverFourYears} over the agreement, depending on
        classification. Every full-time employee also gets a{" "}
        {formatAUD(VIC_2026_AGREEMENT.lumpSum)} lump sum when the agreement starts (pro rata for
        part-time staff).
      </p>

      {/* Headline steps: now vs October 2026 vs November 2029 */}
      <div className="not-prose my-6 overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
        <table className="w-full min-w-[520px] text-left text-sm text-navy">
          <caption className="sr-only">Victorian teacher salary now and under the proposed 2026 agreement</caption>
          <thead className="bg-sandstone font-semibold">
            <tr>
              <th scope="col" className="px-4 py-3">Step</th>
              <th scope="col" className="px-4 py-3">Now (VGSA 2022)</th>
              <th scope="col" className="px-4 py-3">From Oct 2026</th>
              <th scope="col" className="px-4 py-3">From Nov 2029</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {HIGHLIGHTS.map((h) => {
              const now = currentRate(h.scaleId, h.step);
              const oct = proposedRate(h.scaleId, h.step, 1);
              const nov29 = proposedRate(h.scaleId, h.step, 4);
              if (now === null || oct === null || nov29 === null) return null;
              return (
                <tr key={h.label}>
                  <th scope="row" className="px-4 py-3 font-medium">{h.label}</th>
                  <td className="px-4 py-3">{formatAUD(now)}</td>
                  <td className="px-4 py-3">
                    <Link href={takeHomeHref(oct)} className="font-semibold underline decoration-eucalyptus/40 decoration-dotted underline-offset-4 hover:text-eucalyptus-dark">
                      {formatAUD(oct)}
                    </Link>{" "}
                    <span className="text-xs text-warmgray">(+{formatAUD(oct - now)})</span>
                  </td>
                  <td className="px-4 py-3">{formatAUD(nov29)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h3 style={HEADING_FONT}>When each increase applies</h3>
      <div className="not-prose my-4 overflow-x-auto rounded-xl border border-sandstone-dark/20">
        <table className="w-full min-w-[420px] text-left text-sm text-navy">
          <thead className="bg-sandstone font-semibold">
            <tr>
              <th scope="col" className="px-4 py-3">From the first pay period on or after</th>
              <th scope="col" className="px-4 py-3">Salary increase</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sandstone-dark/20 bg-white">
            {VIC_2026_EFFECTIVE_DATES.map((date, i) => (
              <tr key={date}>
                <td className="px-4 py-3">{date}</td>
                <td className="px-4 py-3">{VIC_2026_INCREASES[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm">
        Percentages are the department&apos;s own summary in its{" "}
        <a href={VIC_2026_AGREEMENT.resourcesUrl} target="_blank" rel="noreferrer noopener">
          Agreement Explanation
        </a>
        . The first increase is larger for lower steps (6.33% at graduate 1-1, 3% at 2-6), which is
        why a graduate&apos;s rise over the agreement is bigger in percentage terms than a top-step
        teacher&apos;s. Clause 8 makes each increase payable from the first pay period on or after its
        date — including the two dates that fall before the agreement can start operating.
      </p>

      {/* Full proposed schedule */}
      {VIC_2026_SCALES.map((scale) => (
        <div key={scale.id} className="not-prose my-8">
          <h3 className="mb-3 text-lg font-bold text-navy" style={HEADING_FONT}>
            Proposed: {scale.title}
          </h3>
          <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm text-navy">
              <thead className="bg-sandstone font-semibold">
                <tr>
                  <th scope="col" className="px-3 py-3">Subdivision</th>
                  <th scope="col" className="px-3 py-3">Now</th>
                  {VIC_2026_COLUMN_LABELS.map((c) => (
                    <th key={c} scope="col" className="px-3 py-3">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/20 bg-white">
                {scale.steps.map((step) => {
                  const now = currentRate(scale.id, step.label);
                  return (
                    <tr key={step.label}>
                      <th scope="row" className="px-3 py-2.5 font-medium">
                        {step.label}
                        {step.note && <span className="block text-xs font-normal text-warmgray">{step.note}</span>}
                      </th>
                      <td className="px-3 py-2.5 text-warmgray">{now !== null ? formatAUD(now) : "—"}</td>
                      {step.rates.map((r, i) => (
                        <td key={i} className={`px-3 py-2.5 ${i === 1 ? "font-semibold" : ""}`}>{formatAUD(r)}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <h3 style={HEADING_FONT}>What else changes for teachers</h3>
      <ul>
        <li>
          <strong>Meetings halved.</strong> From the 2027 school year, no more than 40 hours a year
          (and no more than two hours in any week) can go to meetings outside the seven-hour day,
          down from 80. Another 40 hours a year is set by the teacher for planning, preparation,
          assessment and collaboration.
        </li>
        <li>
          <strong>Professional practice days.</strong> One in 2026, then four a year from 2027 (pro rata
          for part-time), taken on student-free days. Education support staff get four a year from
          2027 for the first time.
        </li>
        <li>
          <strong>Face-to-face limits written in.</strong> The existing maximums — 21 hours a week in
          primary and special schools, 18.5 hours in secondary — move into the agreement itself.
        </li>
        <li>
          <strong>School camps.</strong> From 2027 an overnight school camp allowance replaces time in
          lieu for overnight camps.
        </li>
      </ul>
      <p>
        The agreement&apos;s nominal expiry date is {VIC_2026_AGREEMENT.nominalExpiry}. For how the deal
        was reached — two statewide strikes, a rejected in-principle offer and the final ballot — see{" "}
        <Link href="/news/victorian-teachers-pay-rise-2026/">
          Victorian teachers pay rise 2026: what the new agreement pays and when
        </Link>
        .
      </p>
    </section>
  );
}

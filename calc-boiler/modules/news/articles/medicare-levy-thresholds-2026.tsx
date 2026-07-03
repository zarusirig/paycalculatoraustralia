import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function MedicareLevyThresholds2026() {
  return (
    <>
      <p className="lead">
        Medicare levy low-income thresholds rose <strong>2.9%</strong> for the 2025-26 income
        year, backdated to 1 July 2025. Singles now pay no Medicare levy at all below{" "}
        <strong>$28,011</strong>, up from $27,222 — sparing more than a million low-income
        earners some or all of the 2% levy.
      </p>

      <p className="text-sm text-navy/60">
        Part of the{" "}
        <Link href="/news/federal-budget-2026-27-your-pay/">Federal Budget 2026-27</Link> package.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Singles threshold", before: "$27,222", after: "$28,011" },
          { label: "Family threshold", before: "$45,907", after: "$47,238" },
          { label: "Single seniors & pensioners threshold", before: "$43,020", after: "$44,268" },
          { label: "Senior & pensioner family threshold", before: "$59,886", after: "$61,623" },
          { label: "Per dependent child/student addition", before: "$4,216", after: "$4,338" },
        ]}
      />

      <h2>Why the thresholds moved</h2>
      <p>
        Medicare levy low-income thresholds are indexed each year so that the levy doesn&apos;t
        start biting into wages that have simply kept pace with inflation. The 2.9% lift for
        2025-26 was confirmed as part of the government&apos;s cost-of-living measures, and
        applies retrospectively to the whole income year — the return most people lodge between
        July and October 2026.
      </p>
      <p>
        The thresholds aren&apos;t a headline Budget centrepiece — they move most years by a
        similar percentage — but a 2.9% lift is larger than some recent years&apos; indexation and
        was specifically called out because it delivers tax relief to more than a million people
        who sit near the boundary. Treasury estimated the change reduces receipts by around $450
        million over five years from 2025-26, reflecting how many taxpayers fall into the
        affected income range.
      </p>

      <h2>Who pays less</h2>
      <p>
        Below the singles threshold of $28,011, you pay no Medicare levy at all. Between $28,011
        and $35,013, a reduced rate applies — 10 cents for every dollar over the threshold,
        instead of the full 2%. Families, seniors and pensioners have their own higher
        thresholds, all lifted by the same 2.9%, so a part-time worker or part-year retiree who
        was previously just over the old threshold may now pay nothing.
      </p>
      <p>
        The family threshold works the same way but is assessed on combined family income, with
        each dependent child or student adding a further $4,338 rather than the previous $4,216.
        A single-income family with two dependent children now has a combined threshold of
        $47,238 plus 2 × $4,338, before any Medicare levy applies to their household income.
        Senior and pensioner thresholds are higher again, in recognition of the Seniors and
        Pensioners Tax Offset that many in that group also receive.
      </p>

      <h2>Do you need to do anything?</h2>
      <p>
        No. The ATO applies the updated thresholds automatically when it processes your 2025-26
        tax return — there&apos;s no separate claim or form. If you had Medicare levy withheld through
        the year based on the old thresholds, the difference is reconciled as part of your notice
        of assessment.
      </p>
      <p>
        Because the increase is backdated to 1 July 2025, it applies to the entire income year
        even though it was only confirmed around Budget time in May 2026. If your employer
        withheld PAYG based on the old, lower thresholds throughout the year, you&apos;ll typically see
        the correction as a slightly larger refund once your 2025-26 return is assessed, rather
        than as any change to your take-home pay during the year itself.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If your income sits near the old thresholds, it&apos;s worth checking whether you now fall
        into the reduced-rate band or below it entirely. Run your numbers through our{" "}
        <Link href="/medicare-levy/">Medicare levy guide</Link> to see exactly what you owe under
        the new thresholds, or use the{" "}
        <Link href="/income-tax-calculator/">income tax calculator</Link> for your full FY2025-26
        tax position including the levy.
      </p>
    </>
  );
}

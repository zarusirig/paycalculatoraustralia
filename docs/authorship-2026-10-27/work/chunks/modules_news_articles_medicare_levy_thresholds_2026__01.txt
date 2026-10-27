import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function MedicareLevyThresholds2026() {
  return (
    <>
      <p className="lead">
        The Medicare levy low-income thresholds rose <strong>2.9%</strong> for the 2025-26 income
        year, backdated to 1 July 2025. A single taxpayer now pays no Medicare levy at all below{" "}
        <strong>$28,011</strong>, up from $27,222, sparing more than a million low-income
        earners some or all of the 2% levy. The ATO applies the new thresholds when it assesses
        your tax return. The table below compares the old and new thresholds
        for singles, families, seniors and pensioners, and each dependent child or student. The
        rest of this article explains why the thresholds moved, how the reduced-rate band works
        and what changes on your tax return.
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
        2025-26 was confirmed as part of the Federal Budget&apos;s cost-of-living measures, and
        applies retrospectively to the whole income year, so it flows into the return most people
        lodge between July and October 2026.
      </p>
      <p>
        The Medicare levy thresholds aren&apos;t a headline Budget measure, because they move most
        years by a similar percentage. The 2.9% lift is larger than some recent years&apos;
        indexation, and the Budget called it out because it delivers tax relief to more than a
        million people who sit near the boundary. Treasury estimated the change reduces receipts by around $450
        million over five years from 2025-26, reflecting how many taxpayers fall into the
        affected income range.
      </p>

      <h2>Who pays less</h2>
      <p>
        Below the singles threshold of $28,011, you pay no Medicare levy at all. Between $28,011
        and $35,013, a reduced rate applies: 10 cents for every dollar over the threshold,
        instead of the full 2%. Families, seniors and pensioners have their own higher
        thresholds, all lifted by the same 2.9%. A part-time worker or part-year retiree whose
        income sits between the old and new threshold now pays no Medicare levy.
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
        tax return, and there&apos;s no separate claim or form. If you had Medicare levy withheld through
        the year based on the old thresholds, the difference is reconciled as part of your notice
        of assessment.
      </p>
      <p>
        Because the increase is backdated to 1 July 2025, it applies to the entire income year
        even though it was only confirmed around Budget time in May 2026. If your employer
        withheld PAYG based on the old, lower thresholds throughout the year, the correction shows
        up when your 2025-26 return is assessed, as a slightly larger refund or a smaller tax bill,
        not as a change to your take-home pay during the year itself.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If your taxable income sits near the old thresholds, check whether you now fall below the
        new threshold or into the reduced-rate band above it. Run your numbers through our{" "}
        <Link href="/medicare-levy/">Medicare levy guide</Link> to see exactly what you owe under
        the new thresholds, or use the{" "}
        <Link href="/income-tax-calculator/">income tax calculator</Link> for your full FY2025-26
        tax position including the levy.
      </p>
    </>
  );
}

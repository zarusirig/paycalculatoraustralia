import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function C13ClassificationPhaseOut() {
  return (
    <>
      <p className="lead">
        The Fair Work Commission is phasing out C13 — the lowest ongoing pay classification in
        most modern awards — over three stages, making C12 the new floor. Stage one starts from
        1 July 2026, and C13 rates rise by 5.95% rather than the standard 4.75%, closing a third
        of the gap to C12.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "C13 increase, stage one", after: "5.95% (4.75% general + 1.2% extra)" },
          { label: "Other award classifications", after: "+4.75%" },
          { label: "New lowest ongoing rate", after: "C12 (once phase-out completes)" },
          { label: "Stage one takes effect", after: "First full pay period on or after 1 July 2026" },
          { label: "Total phase-out stages", after: "3, across successive Annual Wage Reviews" },
        ]}
      />

      <h2>Why the Commission is phasing out C13</h2>
      <p>
        C13 is the lowest ongoing (non-casual) classification in most modern awards, sitting one
        rung below C12. The Fair Work Commission found the gap between the two too narrow to
        justify keeping C13 as a distinct entry point, and decided to fold it into C12 over
        several Annual Wage Reviews rather than in one step — smoothing the transition for
        employers who currently classify staff at C13.
      </p>

      <h2>How stage one works</h2>
      <p>
        From the first full pay period on or after 1 July 2026, C13 rates rise by 5.95% in total —
        the general 4.75% award increase plus an extra 1.2%, which represents exactly one-third of
        the dollar difference between the C13 and C12 rates. The C14 rate, which sits below C13,
        increases by the same percentage so its relativity to C13 is preserved. Every other
        classification in the award moves by the standard 4.75%. Check your classification against
        the current schedule on our <Link href="/award-rates/">award rates guide</Link>, and use
        our <Link href="/fortnightly-tax-table/">fortnightly tax table</Link> to see how the
        higher gross rate flows through to your after-tax pay.
      </p>

      <h2>What happens in later stages</h2>
      <p>
        The Commission hasn&apos;t set a fixed date for full completion. The remaining two stages
        are expected to land in future Annual Wage Reviews, each closing another third of the gap
        between C13 and C12, until C13 disappears entirely and C12 becomes the permanent lowest
        ongoing rate in affected awards. Casual rates and junior, apprentice and trainee loadings
        continue to be calculated off the adjusted base rate at each stage, so those don&apos;t
        need separate tracking.
      </p>
      <p>
        Because each stage is timed to a future Annual Wage Review rather than a fixed calendar
        date, the pace of the phase-out depends on what the Expert Panel decides each year — the
        Commission could complete it over two more reviews or spread it further if it judges
        employers or affected workers need more time to adjust. Either way, C13 workers should see
        their rate close in on C12 a little more with each annual decision until the two
        classifications converge.
      </p>

      <h2>Who this affects</h2>
      <p>
        The C13 classification appears across a range of modern awards as the entry point for
        ongoing employment, typically covering roles with minimal experience or qualification
        requirements. Anyone currently classified at C13 in an affected award is directly in scope
        for the phase-out; workers already classified at C12 or above are unaffected by this
        specific change, though they still receive the standard 4.75% award increase. If you&apos;re
        unsure which classification applies to your role, your award&apos;s classification
        definitions — usually set out by skill level, qualification or years of experience — will
        confirm it.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If you&apos;re classified at C13, your pay rises by more than colleagues on other
        classifications this year — 5.95% instead of 4.75% — and will keep closing the gap to C12
        in future reviews until the two rates merge. Compare your current and projected rate
        against the award schedule and our{" "}
        <Link href="/minimum-wage-history-australia/">minimum wage history</Link> page to see how
        this year&apos;s changes fit the broader trend, then confirm your payslip reflects the new
        rate from your first full July pay period.
      </p>
    </>
  );
}

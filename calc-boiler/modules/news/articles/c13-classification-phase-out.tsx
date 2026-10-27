import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { EMPLOYMENT, formatAUD, formatPercent } from "@/lib/constants/australian-tax";
import { AWR_2026_FLOORS } from "@/lib/constants/hospitality-award";

// [2026] FWCFB 3500 [5], [112]-[113], [145]. C13 rises by the general award
// increase compounded with an extra 1.2%. The C13 rate as at 2 June 2026 was
// $948.00 a week, the same as the old NMW (aligned since the 2023 Review), and
// the new C13 rate is the ongoing floor, so the total rise is derived from those.
const award = formatPercent(AWR_2026_FLOORS.increase, 2);
const c13 = formatPercent(AWR_2026_FLOORS.ongoingWeekly / EMPLOYMENT.minimumWageWeeklyPrevious - 1, 1);
const c13WeeklyOld = formatAUD(EMPLOYMENT.minimumWageWeeklyPrevious, 2);
const c13WeeklyNew = formatAUD(AWR_2026_FLOORS.ongoingWeekly, 2);

export default function C13ClassificationPhaseOut() {
  return (
    <>
      <p className="lead">
        The Fair Work Commission is phasing out C13, the lowest pay rate for ongoing work in the
        modern award system, over three stages, making C12 the new floor. Stage one starts from
        1 July 2026, and C13 rates rise by {c13} rather than the standard {award}, closing a third
        of the gap to C12.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "C13 increase, stage one", after: `${c13} (${award} general increase compounded with an extra 1.2%)` },
          { label: "Other award classifications", after: `+${award}` },
          { label: "New lowest ongoing rate", after: "C12 (once phase-out completes)" },
          { label: "Stage one takes effect", after: "First full pay period on or after 1 July 2026" },
          { label: "Total phase-out stages", after: "3, across successive Annual Wage Reviews" },
        ]}
      />

      <h2>Why the Commission is phasing out C13</h2>
      <p>
        C13 is the lowest pay rate for ongoing (non-casual) work in the modern award system,
        sitting one rung below C12. The Fair Work Commission found the gap between the two too
        narrow to justify keeping C13 as a distinct entry point. A Commission background paper
        counted 48 classifications at the C13 level across 43 modern awards. The Commission decided to fold the classification into C12 over
        several Annual Wage Reviews rather than in one step, to smooth the transition for
        employers who currently classify staff at C13.
      </p>

      <h2>How stage one works</h2>
      <p>
        From the first full pay period on or after 1 July 2026, C13 rates rise by {c13} in total,
        from {c13WeeklyOld} to {c13WeeklyNew} a week: the general {award} award increase
        compounded with an extra 1.2%. The C12 rate was about 3.6% above C13, so the Commission set
        1.2% as one-third of that gap. The C14 rate, which sits below C13, increases by the same
        percentage so its relativity to C13 is preserved. Any classification paid 1.2% or less above
        the old C13 rate moves up to the new C13 rate. Every other classification in the award moves
        by the standard {award}. Check your classification against
        the current schedule on our <Link href="/award-rates/">award rates guide</Link>, and use
        our <Link href="/fortnightly-tax-table/">fortnightly tax table</Link> to see how the
        higher gross rate flows through to your after-tax pay.
      </p>

      <h2>What happens in later stages</h2>
      <p>
        The Commission hasn&apos;t set a fixed date for full completion. The remaining two stages
        are expected to land in future Annual Wage Reviews, each closing another third of the gap
        between C13 and C12, until C13 disappears entirely and C12 becomes the permanent lowest
        ongoing rate in affected awards. Casual loadings and junior rates are percentages of an
        adult rate, so they move with that adult rate at each stage.
        Apprentice and trainee rates are set separately: those set as dollar amounts rose by the
        general {award} this year, and those set as a percentage of another classification move
        with that classification.
      </p>
      <p>
        Because each stage is timed to a future Annual Wage Review rather than a fixed calendar
        date, the pace of the phase-out depends on what the Expert Panel decides each year. The
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
        for the phase-out. Workers already classified at C12 or above are unaffected by this
        specific change, though they still receive the standard {award} award increase. If you&apos;re
        unsure which classification applies to your role, your award&apos;s classification
        definitions (usually set out by skill level, qualification or years of experience) will
        confirm it.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If you&apos;re classified at C13, your pay rises by more than colleagues on other
        classifications this year ({c13} instead of {award}). Your rate will keep closing the gap to C12
        in future reviews until the two rates merge. Compare your current and projected rate
        against the award schedule and our{" "}
        <Link href="/minimum-wage-history-australia/">minimum wage history</Link> page to see how
        this year&apos;s changes fit the broader trend. Then confirm your payslip shows the new
        rate from your first full July pay period.
      </p>
    </>
  );
}

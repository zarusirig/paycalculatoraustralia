import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { EMPLOYMENT, formatAUD, formatPercent } from "@/lib/constants/australian-tax";
import { AWR_2026_FLOORS } from "@/lib/constants/hospitality-award";

// [2026] FWCFB 3500 [4]-[5], [112]-[113], [143]-[146]. The general award rise is
// AWR_2026_FLOORS.increase. C13 and C14 got an extra compounded 1.2%, so the C13
// rate went from the old NMW ($948.00, aligned with C13 since the 2023 Review) to
// the new floor. The NMW percentage is the hourly rise.
const award = formatPercent(AWR_2026_FLOORS.increase, 2);
const multiplier = (1 + AWR_2026_FLOORS.increase).toFixed(4);
const c13 = formatPercent(AWR_2026_FLOORS.ongoingWeekly / EMPLOYMENT.minimumWageWeeklyPrevious - 1, 1);
const c13Hourly = formatAUD(AWR_2026_FLOORS.ongoingHourly, 2);
const nmw = formatPercent(EMPLOYMENT.minimumWageHourly / EMPLOYMENT.minimumWageHourlyPrevious - 1, 2);
const nmwHourly = formatAUD(EMPLOYMENT.minimumWageHourly, 2);
const nmwHourlyPrevious = formatAUD(EMPLOYMENT.minimumWageHourlyPrevious, 2);

export default function AwardWageIncrease2026Industries() {
  return (
    <>
      <p className="lead">
        Modern award minimum rates rise <strong>{award}</strong> from the first full pay period
        on or after 1 July 2026, and the lowest C13 and C14 rates rise {c13}. This is separate
        from the {nmw} national minimum wage increase.
        Award-reliant workers, about 23% of employees according to the ABS (May 2025), get the rise
        automatically in retail, hospitality, aged care and every other award-covered industry.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Modern award minimum rates", before: "—", after: `+${award}` },
          { label: "C13 and C14 rates (lowest award rates)", after: `+${c13}` },
          { label: "Award-reliant employees affected", after: "~23% of employees (ABS, May 2025)" },
          { label: "Takes effect", after: "First full pay period on or after 1 July 2026" },
          { label: "Awards covered", after: "Hospitality, Retail, Fast Food, Restaurant, Aged Care and all other modern awards" },
        ]}
      />

      <h2>Which awards are covered</h2>
      <p>
        The general {award} increase applies across every modern award, so it reaches the
        industries with the highest share of award-reliant workers: the Hospitality Award, Retail
        Award, Fast Food Industry Award, Restaurant Industry Award, Aged Care Award and the awards
        covering cleaning, security and support services. The lowest rates rise more. C13 (the
        lowest rate for ongoing work) and C14 (an entry-level rate for up to six months) rise{" "}
        {c13} in the first stage of the{" "}
        <Link href="/news/c13-classification-phase-out/">C13 phase-out</Link>, and any
        classification paid 1.2% or less above the old C13 rate moves up to the new C13 rate of{" "}
        {c13Hourly} an hour. If your pay is set by an award rather than an enterprise agreement or
        an individual arrangement above the award, the rise applies to you automatically, with no
        request needed.
      </p>

      <h2>How it differs from the minimum wage rise</h2>
      <p>
        This year&apos;s Annual Wage Review set two separate figures, and they apply to
        different groups. The national minimum wage (the fallback rate for
        employees not covered by an award or agreement) rose {nmw}, from {nmwHourlyPrevious} to{" "}
        {nmwHourly} an hour. Modern award minimum rates, which set pay for classified roles across
        specific industries, rose a separate {award}. Most award base rates already sit above the national minimum wage, so the
        percentage increases don&apos;t translate to the same dollar amounts. Check our{" "}
        <Link href="/award-rates/">award rates guide</Link> to see current rates by
        classification.
      </p>
      <p>
        The Fair Work Commission handed down both figures in the same Annual Wage Review 2026
        decision, announced on 2 June 2026, but treated them as two separate questions: what the
        safety-net minimum wage should be for workers with no award coverage, and what modern
        award rates should be for the employees whose pay is set by a
        classification structure. In this review the Commission moved these figures by
        different percentages.
      </p>

      <h2>Working out your new rate</h2>
      <p>
        Take your current award base rate for your classification and multiply by {multiplier} to
        get the new rate from 1 July 2026. This does not work for C13 and C14 rates, or for a rate
        within 1.2% of the old C13 rate, which rose more. Junior rates are a percentage of an adult
        rate, so they move with that adult rate. In some awards that is the C13 rate (the
        Manufacturing Award sets junior rates as a percentage of C13), so those junior rates rose{" "}
        {c13}. Apprentice and trainee rates set as dollar amounts rose {award}; those set as a
        percentage of another classification move with that classification. Separately, the
        junior percentages for staff with more than 6 months&apos; service aged 18 to 20 under the
        Fast Food and Pharmacy awards, and aged 18 and 19 under the Retail Award,{" "}
        <Link href="/news/junior-pay-rates-december-2026/">step up from the first full pay period on or after 1 December 2026</Link>.
        Casual loadings and penalty rates then apply on top of the increased base rate,
        so overtime and weekend shifts also pay more in dollar terms even though the percentage
        loading itself hasn&apos;t changed.
      </p>
      <p>
        Employers must apply the new rates from the start of your first full pay period on or after
        1 July 2026, which is 1 July itself only if a pay period starts that day. Check your payslip against your award&apos;s updated pay
        guide rather than assuming the increase lands automatically on the calendar date. Our{" "}
        <Link href="/understanding-your-payslip/">guide to understanding your payslip</Link>{" "}
        explains what each line should show. The Fair Work Ombudsman publishes an updated pay guide
        for each award once the new rates are set, listing base, casual, and penalty rates by
        classification level.
      </p>

      <h2>Aged care and other high award-reliance sectors</h2>
      <p>
        Aged care, along with cleaning, security and other support-service awards, has a higher
        than average share of award-reliant staff. In those sectors the {award} increase reaches a
        large proportion of the workforce directly rather than through enterprise bargaining.
        Confirm your classification level hasn&apos;t changed since your last pay review.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If your award classification pays, say, $28 an hour today, expect roughly{" "}
        {formatAUD(28 * (1 + AWR_2026_FLOORS.increase), 2)} an hour
        from your first full July pay period, before any penalty rates or loadings. Overtime,
        weekend and public holiday loadings then apply to the higher base, so shift workers see
        a bigger dollar increase than their base rate alone suggests. Enter your new hourly rate
        in our <Link href="/overtime-pay-calculator/">overtime pay calculator</Link> to see
        what a week with penalty shifts pays under the new rates.
      </p>
    </>
  );
}

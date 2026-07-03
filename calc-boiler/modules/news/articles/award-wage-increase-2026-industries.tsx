import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function AwardWageIncrease2026Industries() {
  return (
    <>
      <p className="lead">
        Every modern award minimum rate rises <strong>4.75%</strong> from the first full pay
        period on or after 1 July 2026 — separate from the 6% national minimum wage increase.
        Around 2.8 million award-reliant workers, roughly 21% of the workforce, get the rise
        automatically, spanning retail, hospitality, aged care and beyond.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Modern award minimum rates", before: "—", after: "+4.75%" },
          { label: "Award-reliant employees affected", after: "~2.8 million (~21% of workforce)" },
          { label: "Takes effect", after: "First full pay period on or after 1 July 2026" },
          { label: "Awards covered", after: "Hospitality, Retail, Fast Food, Restaurant, Aged Care and all other modern awards" },
        ]}
      />

      <h2>Which awards are covered</h2>
      <p>
        The 4.75% increase applies uniformly across every modern award, so it reaches the
        industries with the highest share of award-reliant workers: the Hospitality Award, Retail
        Award, Fast Food Industry Award and Restaurant Industry Award all lift by the same
        percentage, as does the Aged Care Award and the awards covering cleaning, security and
        support services. If your pay is set by an award rather than an enterprise agreement or
        an individual arrangement above the award, the rise applies to you automatically — no
        request needed.
      </p>

      <h2>How it differs from the minimum wage rise</h2>
      <p>
        It&apos;s easy to conflate the two figures from this year&apos;s Annual Wage Review, but
        they apply to different groups. The national minimum wage — the fallback rate for
        employees not covered by an award or agreement — rose 6% to $26.44 an hour. Modern award
        minimum rates, which set pay for classified roles across specific industries, rose a
        separate 4.75%. Most award base rates already sit above the national minimum wage, so the
        percentage increases don&apos;t translate to the same dollar amounts. Check our{" "}
        <Link href="/award-rates/">award rates guide</Link> to see current rates by
        classification.
      </p>
      <p>
        The Fair Work Commission handed down both figures in the same Annual Wage Review 2026
        decision, announced on 2 June 2026, but treated them as two separate questions: what the
        safety-net minimum wage should be for workers with no award coverage, and what modern
        award rates should be for the roughly 2.8 million employees whose pay is set by a
        classification structure. The Commission can and does move these figures by different
        percentages in the same review, as it has this year.
      </p>

      <h2>Working out your new rate</h2>
      <p>
        Take your current award base rate for your classification and multiply by 1.0475 to get
        the new rate from 1 July 2026. Junior, apprentice and trainee rates, which are set as a
        percentage of the adult rate, move by the same 4.75% since they&apos;re calculated off the
        new base. Casual loadings and penalty rates then apply on top of the increased base rate,
        so overtime and weekend shifts also pay more in dollar terms even though the percentage
        loading itself hasn&apos;t changed.
      </p>
      <p>
        Employers are required to apply the new rates from the first full pay period after 1 July
        2026, not from 1 July itself, so check your payslip against your award&apos;s updated pay
        guide rather than assuming the increase lands automatically on the calendar date — our{" "}
        <Link href="/understanding-your-payslip/">guide to understanding your payslip</Link>{" "}
        explains what each line should show. Fair Work Ombudsman publishes an updated pay guide
        for each award once the new rates are set, listing base, casual, and penalty rates by
        classification level.
      </p>

      <h2>Aged care and other high award-reliance sectors</h2>
      <p>
        Aged care, along with cleaning, security and other support-service awards, has a higher
        than average share of award-reliant staff, so the 4.75% increase reaches a large
        proportion of the workforce in those sectors directly rather than through enterprise
        bargaining. Employers in these industries typically see the wage increase flow through
        payroll systems automatically once the updated award schedules are published, but it&apos;s
        still worth confirming your classification level hasn&apos;t changed since your last pay
        review.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If your award classification pays, say, $28 an hour today, expect roughly $29.33 an hour
        from your first full July pay period — before any penalty rates or loadings. Overtime,
        weekend and public holiday loadings then compound on the higher base, so shift workers see
        a bigger dollar increase than their base rate alone suggests. Run your new hourly rate
        through our <Link href="/overtime-pay-calculator/">overtime pay calculator</Link> to see
        what a typical week with penalty shifts adds up to under the new rates.
      </p>
    </>
  );
}

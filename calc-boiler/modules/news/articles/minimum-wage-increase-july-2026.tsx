import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function MinimumWageIncreaseJuly2026() {
  return (
    <>
      <p className="lead">
        The Fair Work Commission has lifted the national minimum wage by <strong>6%</strong> from
        1 July 2026, taking it from $24.95 to <strong>$26.44 an hour</strong> — $1,004.90 for a
        38-hour week. Modern award minimum rates rise a separate <strong>4.75%</strong>, a change
        that flows to about 2.8 million award-reliant workers.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "National minimum wage (hourly)", before: "$24.95", after: "$26.44" },
          { label: "National minimum wage (weekly, 38 hrs)", before: "$948.00", after: "$1,004.90" },
          { label: "National minimum wage increase", after: "+6%" },
          { label: "Modern award minimum rates", before: "—", after: "+4.75%" },
          { label: "Takes effect", after: "First full pay period on or after 1 July 2026" },
        ]}
      />

      <h2>What the Commission decided</h2>
      <p>
        The Expert Panel handed down the Annual Wage Review 2026 decision on 2 June 2026, lifting
        the national minimum wage by 6% and modern award minimum rates by 4.75%. The Panel said a
        real wage increase large enough to fully close the gap left by the inflation spike of
        recent years would not be practicable in the current circumstances, pointing to inflation
        sitting above the Reserve Bank&apos;s target band and global fuel supply disruption.
      </p>
      <p>
        The decision also starts a three-stage phase-out of the C13 classification — the lowest
        ongoing rate in the award system — with the first stage taking effect from 1 July 2026.
      </p>

      <h2>Who gets the increase</h2>
      <p>
        The rise applies to employees on the national minimum wage and the roughly 2.8 million
        workers — about 21% of the workforce — whose pay is set by a modern award. If you&apos;re on
        an enterprise agreement or an over-award salary, nothing changes automatically, though many
        agreements index their rates to the review. Check your award classification on our{" "}
        <Link href="/award-rates/">award rates guide</Link> if you&apos;re not sure which rate
        applies to you.
      </p>

      <h2>When it starts</h2>
      <p>
        The new rates apply from the first full pay period starting on or after 1 July 2026. If your
        pay cycle runs Wednesday to Tuesday, the new rate begins on the first Wednesday in July —
        your first full July payslip may still show a few days at the old rate.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        A full-time minimum-wage worker picks up about $56.90 a week before tax — roughly $2,959 a
        year. Because the increase is taxed at your marginal rate, your take-home rise will be
        smaller: run your new rate through our{" "}
        <Link href="/hourly-to-annual-salary-calculator/">hourly to annual salary calculator</Link>{" "}
        to see the annual figure, then our{" "}
        <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> for the after-tax
        result. Casual? Remember the 25% loading stacks on top of the new base rate.
      </p>
    </>
  );
}

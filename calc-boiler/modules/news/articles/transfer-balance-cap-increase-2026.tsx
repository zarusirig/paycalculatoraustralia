import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function TransferBalanceCapIncrease2026() {
  return (
    <>
      <p className="lead">
        The general transfer balance cap — the limit on how much super can be moved into a
        tax-free retirement pension — rose from $2.0 million to <strong>$2.1 million</strong> on 1
        July 2026. The increase also lifts several related contribution and eligibility thresholds.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "General transfer balance cap", before: "$2.0m", after: "$2.1m" },
          { label: "New pension starters from 1 July 2026", after: "Personal cap of $2.1m" },
          { label: "Existing pension members", after: "Proportional increase based on unused cap space" },
          { label: "Updated caps visible on ATO online services", after: "From 13 July 2026" },
        ]}
      />

      <h2>Who gets the full $2.1 million cap</h2>
      <p>
        Anyone starting a retirement phase pension for the first time on or after 1 July 2026 gets
        the full new personal transfer balance cap of $2.1 million. This is the maximum amount that
        can be moved from accumulation into a tax-free pension account over your lifetime, though
        your own balance may be well below that figure.
      </p>

      <h2>How existing pension members are affected</h2>
      <p>
        If you already started a pension before 1 July 2026 and have unused cap space, you get a
        proportional increase to your personal cap, based on the highest balance your transfer
        account has ever reached. Members who have already used their full $2.0 million cap don&apos;t
        get any extra room — the indexation only benefits those with unused capacity.
      </p>

      <h2>Flow-on effects to contribution caps</h2>
      <p>
        The transfer balance cap increase also lifts the total super balance (TSB) threshold used to
        determine eligibility for non-concessional contributions, which rises in step to $2.1
        million. This links directly to the wider 2026-27 super changes, including higher
        concessional and non-concessional contribution caps.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        The transfer balance cap mostly matters as you approach retirement rather than during your
        working years, but it&apos;s a useful marker of how super thresholds are moving overall.
        Track your projected balance against the new cap with our{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link>, and if
        you&apos;re a high-income earner, see how it interacts with other thresholds on our{" "}
        <Link href="/division-293-tax/">Division 293 tax guide</Link>.
      </p>
    </>
  );
}

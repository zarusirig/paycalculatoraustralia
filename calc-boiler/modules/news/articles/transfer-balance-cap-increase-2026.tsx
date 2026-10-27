import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function TransferBalanceCapIncrease2026() {
  return (
    <>
      <p className="lead">
        The general transfer balance cap (the limit on how much super can be moved into a
        tax-free retirement pension) rose from $2.0 million to <strong>$2.1 million</strong> on 1
        July 2026. The increase also lifts the contribution and eligibility thresholds tied to the
        general cap, including the total super balance threshold for non-concessional contributions.
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
        the full new personal transfer balance cap of $2.1 million. The personal cap is the maximum
        amount you can move from accumulation into a tax-free pension account over your lifetime.
        Amounts above your personal cap can stay in accumulation phase, where earnings are taxed at
        up to 15%, or be withdrawn as a lump sum. They cannot move into the tax-free retirement phase
        once your cap is reached.
      </p>

      <h2>How existing pension members are affected</h2>
      <p>
        If you already started a pension before 1 July 2026 and have unused cap space, you get a
        proportional increase to your personal cap, based on the highest balance your transfer
        account has ever reached. Members who have already used their full $2.0 million cap don&apos;t
        get any extra room, as the indexation only benefits those with unused capacity. The ATO
        calculates each member&apos;s proportional indexation from their transfer balance account
        history. The ATO said updated personal caps would display in ATO online services from 13
        July 2026. You can view your personal cap in ATO online services through myGov (Super, then
        Information, then Transfer balance cap).
      </p>

      <h2>Flow-on effects to contribution caps</h2>
      <p>
        The transfer balance cap increase also lifts the total super balance (TSB) threshold used to
        determine eligibility for non-concessional contributions, which rises in step to $2.1
        million, and it sets the total super balance thresholds for the non-concessional
        bring-forward arrangement. The concessional and non-concessional caps are separate limits
        that also rose for 2026-27 (see the{" "}
        <Link href="/news/super-contribution-caps-2026-27/">2026-27 contribution cap increases</Link>
        ). The transfer balance
        cap limits how much of your super can ever move into a tax-free retirement income stream, so
        its increase matters most for members already close to or above the previous $2.0 million
        limit.
      </p>

      <h2>Why the cap is indexed at all</h2>
      <p>
        The general transfer balance cap is indexed in line with the consumer price index (CPI) in
        $100,000 increments, so it does not rise every year (it stayed at $1.6 million from 2017-18
        to 2020-21). The rise from $2.0 million to $2.1 million on 1 July 2026 is the latest
        of these increases. Indexation applies only to the general cap, and each member&apos;s personal
        cap is calculated proportionally. As a result, two people who started a pension in different
        years can have different personal transfer balance caps, even though the general cap is the
        same figure for everyone from that point forward.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        The transfer balance cap mostly matters as you approach retirement rather than during your
        working years. Track your projected balance against the new cap with our{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link>, and if
        you&apos;re a high-income earner, check the extra tax on concessional contributions in our{" "}
        <Link href="/division-293-tax/">Division 293 tax guide</Link>.
      </p>
    </>
  );
}

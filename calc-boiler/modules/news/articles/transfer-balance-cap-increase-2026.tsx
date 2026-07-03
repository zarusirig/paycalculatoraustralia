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
        your own balance may be well below that figure. Amounts above your personal cap can stay in
        accumulation phase, where earnings are taxed at up to 15%, or be withdrawn as a lump sum —
        they simply can&apos;t be converted into the tax-free retirement phase environment once your
        cap is reached.
      </p>

      <h2>How existing pension members are affected</h2>
      <p>
        If you already started a pension before 1 July 2026 and have unused cap space, you get a
        proportional increase to your personal cap, based on the highest balance your transfer
        account has ever reached. Members who have already used their full $2.0 million cap don&apos;t
        get any extra room — the indexation only benefits those with unused capacity. The ATO
        calculates each member&apos;s proportional indexation individually using their transfer
        balance account history, and updated personal caps aren&apos;t expected to display in ATO
        online services until 13 July 2026, so there can be a short lag before your exact figure is
        confirmed.
      </p>

      <h2>Flow-on effects to contribution caps</h2>
      <p>
        The transfer balance cap increase also lifts the total super balance (TSB) threshold used to
        determine eligibility for non-concessional contributions, which rises in step to $2.1
        million. This links directly to the wider{" "}
        <Link href="/news/super-contribution-caps-2026-27/">2026-27 contribution cap increases</Link>,
        including higher concessional and non-concessional contribution limits. In practice, the
        transfer balance cap is the ceiling that ultimately limits how much of a growing super
        balance can ever be converted into a tax-free income stream, so its increase matters most for
        members already close to or above the previous $2.0 million limit.
      </p>

      <h2>Why the cap is indexed at all</h2>
      <p>
        The transfer balance cap is indexed periodically in $100,000 increments to keep pace with
        broader movements in average balances and cost of living, rather than being reviewed and
        adjusted every year. The jump from $2.0 million to $2.1 million on 1 July 2026 is the latest
        of these periodic increases, following a similar pattern to earlier indexation events since
        the cap was first introduced. Because indexation only applies to the general cap and each
        member&apos;s personal cap is calculated proportionally, two people who started a pension in
        different years can end up with different personal transfer balance caps even though the
        general cap is the same figure for everyone from that point forward.
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

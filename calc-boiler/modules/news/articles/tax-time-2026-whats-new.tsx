import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";
import { HECS_HELP, HECS_HELP_2025_26, formatAUD, formatPercent } from "@/lib/constants";
import { RETURN_2026 } from "@/lib/constants/tax-return-2025-26";

export default function TaxTime2026WhatsNew() {
  return (
    <>
      <p className="lead">
        On the 2025-26 tax return you lodge this tax time, the Medicare levy low-income thresholds
        are higher, the <strong>$2 minimum</strong> for gift deductions has been removed, and the
        work-from-home fixed rate stays at <strong>70 cents an hour</strong>. If you lodge your own
        return, it is due by <strong>{RETURN_2026.selfLodgeDueDate}</strong>; with a registered tax agent
        engaged before then, it can be as late as {RETURN_2026.agentDueDateMostPeople}. This page covers the
        lodgment deadlines, each change in detail, and how the changes reach your refund or tax bill.
        The <Link href="/tax-return-calculator/">tax return calculator</Link> estimates that refund.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Self-lodge deadline", after: "31 October 2026" },
          { label: "Via registered tax agent", after: "Up to 15 May 2027" },
          { label: "Work-from-home fixed rate", after: "70 cents/hour (unchanged)" },
          { label: "Gift deduction minimum", before: "$2", after: "Removed" },
          { label: "Medicare levy singles threshold", before: "$27,222", after: "$28,011" },
        ]}
      />

      <h2>Deadlines haven&apos;t moved</h2>
      <p>
        If you lodge your own 2025-26 return, it&apos;s due by 31 October 2026. Engage a registered
        tax agent before that date and your deadline can extend out to 15 May 2027, provided
        you&apos;re on their client list by 31 October. Missing the self-lodge deadline without an
        agent can trigger a failure-to-lodge penalty, so it&apos;s worth registering with an agent
        early if you think you&apos;ll run late.
      </p>
      <p>
        The ATO prefills part of your return in myTax with data from employers, banks, health funds
        and government agencies. Prefill data is available from 1 July, with most of it finalised by
        the end of July; some data, such as partnership and trust distributions, arrives later.
        Waiting until the end of July before lodging means less manual entry and fewer amendments
        later, particularly if you have income from multiple sources.
      </p>

      <h2>Medicare levy thresholds are higher</h2>
      <p>
        Low-income Medicare levy thresholds rose 2.9% for 2025-26, backdated to 1 July 2025. The
        singles threshold lifted from $27,222 to $28,011, and the family threshold from $45,907 to
        $47,238 (see our{" "}
        <Link href="/news/medicare-levy-thresholds-2026/">Medicare levy thresholds explainer</Link>{" "}
        for the full table). The ATO applies the higher thresholds automatically, so you have nothing
        extra to claim.
      </p>

      <h2>Work-from-home claims stay the same</h2>
      <p>
        The fixed rate method for working-from-home expenses stays at 70 cents per hour for
        2025-26, unchanged from 2024-25. You can still separately claim depreciation on assets
        costing more than $300, work-related purchases up to $300, and home office cleaning and
        repair costs on top of the fixed rate. The fixed rate method needs a record of the hours
        you worked from home across the year.
      </p>
      <p>
        If you&apos;d rather itemise, you can still use the actual cost method instead of the fixed
        rate, claiming the work-related portion of your actual electricity, internet, phone and
        depreciation costs with supporting records. The fixed rate is simpler to claim unless your
        actual running costs are unusually high, so compare both methods before you decide which to
        use on this year&apos;s return.
      </p>

      <h2>Smaller changes worth knowing</h2>
      <p>
        The $2 minimum donation threshold for deductible gift recipients has been removed, backdated
        to gifts made from 1 July 2024, so any eligible gift, no matter how small, is now
        deductible with a receipt (political donations still need to be $2 or more). And if you incur
        general interest charge or shortfall interest charge from 1 July 2025 onward, you can no
        longer claim that interest as a tax deduction on your 2025-26 or later returns.
      </p>
      <p>
        HECS and HELP debtors also face a new element this tax time: your 2025-26 return is the
        first one assessed under the marginal repayment system, which started with the 2025-26
        income year. Your compulsory repayment is worked out only on the part of your repayment
        income above {formatAUD(HECS_HELP_2025_26.minimumThreshold)}, unless your repayment income is{" "}
        {formatAUD(HECS_HELP_2025_26.bands[3].min)} or more, when it is{" "}
        {formatPercent(HECS_HELP_2025_26.bands[3].marginalRate, 0)} of your total repayment income.
        Separately, indexation of{" "}
        {formatPercent(HECS_HELP.indexationRate)} was applied on {HECS_HELP.indexationDate} to the
        part of your loan unpaid for more than 11 months. See our{" "}
        <Link href="/news/hecs-marginal-repayment-first-tax-time/">
          first tax return under the new HECS system
        </Link>{" "}
        for what that means for your notice of assessment.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        None of this year&apos;s changes affect your fortnightly pay packet. They show up in your
        refund or tax bill once you lodge. The $1,000 instant deduction does{" "}
        <em>not</em> apply to this year&apos;s return; see our{" "}
        <Link href="/news/1000-dollar-instant-tax-deduction/">
          $1,000 instant deduction explainer
        </Link>{" "}
        for when it kicks in. Estimate your refund now with the{" "}
        <Link href="/tax-return-calculator/">tax return calculator</Link>.
      </p>
    </>
  );
}

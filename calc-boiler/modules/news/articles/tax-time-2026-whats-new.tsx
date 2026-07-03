import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function TaxTime2026WhatsNew() {
  return (
    <>
      <p className="lead">
        Lodging your 2025-26 tax return this year? The Medicare levy low-income thresholds rose,
        the <strong>$2 minimum</strong> for gift deductions was scrapped, and the work-from-home
        fixed rate holds at <strong>70 cents an hour</strong> — here&apos;s everything that&apos;s
        actually different this tax time.
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
        Most people can prefill a large chunk of their return through myGov, since employer,
        bank and health insurer data typically flows through automatically by late July. Waiting
        a couple of weeks after 1 July before lodging often means less manual entry and fewer
        amendments later, particularly if you have income from multiple sources.
      </p>

      <h2>Medicare levy thresholds are higher</h2>
      <p>
        Low-income Medicare levy thresholds rose 2.9% for 2025-26, backdated to 1 July 2025. The
        singles threshold lifted from $27,222 to $28,011, and the family threshold from $45,907 to
        $47,238 — see our{" "}
        <Link href="/news/medicare-levy-thresholds-2026/">Medicare levy thresholds explainer</Link>{" "}
        for the full table. The ATO applies this automatically; there&apos;s nothing extra to claim.
      </p>

      <h2>Work-from-home claims stay the same</h2>
      <p>
        The fixed rate method for working-from-home expenses stays at 70 cents per hour for
        2025-26, unchanged from 2024-25. You can still separately claim depreciation on assets
        costing more than $300, work-related purchases up to $300, and home office cleaning and
        repair costs on top of the fixed rate — just keep a record of the hours you worked from
        home across the year.
      </p>
      <p>
        If you&apos;d rather itemise, you can still use the actual cost method instead of the fixed
        rate, claiming the work-related portion of your actual electricity, internet, phone and
        depreciation costs with supporting records. Most people find the fixed rate simpler unless
        their actual running costs are unusually high — compare both before you decide which to
        use on this year&apos;s return.
      </p>

      <h2>Smaller changes worth knowing</h2>
      <p>
        The $2 minimum donation threshold for deductible gift recipients has been removed, so any
        eligible gift — no matter how small — is now deductible with a receipt. And if you incur
        general interest charge or shortfall interest charge from 1 July 2025 onward, you can no
        longer claim that interest as a tax deduction on your 2025-26 or later returns.
      </p>
      <p>
        HECS and HELP debtors also face a genuinely new element this tax time: this is the first
        full year the marginal repayment system and the FY2026-27 threshold settings interact with
        an assessment, after 2.8% indexation was applied on 1 June 2026. See our{" "}
        <Link href="/news/hecs-marginal-repayment-first-tax-time/">
          first tax return under the new HECS system
        </Link>{" "}
        for what that means for your notice of assessment.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        None of this year&apos;s changes affect your fortnightly pay packet — they show up in your
        refund or tax bill once you lodge. Note that the $1,000 instant deduction does{" "}
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

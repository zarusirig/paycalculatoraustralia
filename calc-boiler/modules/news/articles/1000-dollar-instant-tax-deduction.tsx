import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function ThousandDollarInstantTaxDeduction() {
  return (
    <>
      <p className="lead">
        The <strong>$1,000 instant work-related deduction</strong> is now law, receiving royal
        assent on 26 June 2026. It applies to the <strong>2026-27 income year</strong> — the
        return you lodge from July 2027, not the one due this October — letting 6.2 million
        workers deduct up to $1,000 with no receipts at all.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Deduction amount", after: "Up to $1,000, no receipts" },
          { label: "Applies to income year", after: "2026-27 (1 July 2026 – 30 June 2027)" },
          { label: "First claimable on return lodged", after: "From 1 July 2027" },
          { label: "Legal status", after: "Law — royal assent 26 June 2026" },
          { label: "Workers benefiting", after: "6.2 million, average saving $205" },
        ]}
      />

      <h2>What the deduction actually is</h2>
      <p>
        Instead of keeping receipts and itemising every uniform, tool, subscription or
        work-related purchase, eligible employees can simply claim a flat $1,000 deduction
        against their taxable income for the 2026-27 income year — no substantiation required. It
        became law under the Treasury Laws Amendment (Tax Reform No. 1) Act 2026, which passed
        Parliament and received royal assent on 26 June 2026.
      </p>

      <h2>When you can claim it — and when you can't</h2>
      <p>
        This is the detail that trips people up: the $1,000 deduction applies to the 2026-27
        income year, which started on 1 July 2026. You claim it on the tax return you lodge from
        1 July 2027 — it does not apply to the 2025-26 return most people are lodging right now,
        between July and October 2026. That return still uses the normal substantiation rules;
        see our <Link href="/news/tax-time-2026-whats-new/">tax time 2026 roundup</Link> for
        what's actually new this year.
      </p>

      <h2>Choosing between the flat rate and itemising</h2>
      <p>
        The $1,000 deduction isn't compulsory. If your genuine work-related expenses for 2026-27
        add up to more than $1,000, you can still substantiate and claim the higher, itemised
        amount the usual way with receipts and records. You choose whichever option gives the
        better outcome when you prepare that return — you can't do both for the same expenses.
      </p>
      <p>
        For most workers, the flat $1,000 deduction will be the simpler and better option. Treasury
        estimates it will benefit 6.2 million workers with an average tax saving of $205, and cut
        overall compliance costs by around $380 million a year by removing the need to keep
        receipts for smaller work-related purchases like uniforms, small tools, phone and internet
        use, or professional subscriptions. If you're a tradesperson, frequent traveller for work,
        or someone with genuinely large annual work expenses, itemising is still likely to leave
        you better off — run both numbers before you lodge.
      </p>

      <h2>What else you can still claim</h2>
      <p>
        The instant deduction only replaces work-related expense substantiation. Non-work
        deductions — donations to deductible gift recipients, union and professional association
        fees, income protection insurance premiums and investment-related expenses — aren&apos;t
        capped by the $1,000 figure and remain fully claimable on top, using your normal records.
      </p>
      <p>
        Sole traders with labour income are also eligible, alongside employees, provided the
        income qualifies as work-related. The deduction sits alongside — not instead of — the
        broader tax cuts also landing in the 2026-27 income year, including the 16% to 15% rate
        cut on income between $18,201 and $45,000; see our{" "}
        <Link href="/news/tax-cut-july-2026/">tax cut from 1 July 2026</Link> explainer for how
        the two measures interact on the same return.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        The deduction won't change your pay packet or PAYG withholding during 2026-27 — its
        benefit shows up as a smaller tax bill or bigger refund when you lodge in 2027. For now,
        estimate your 2026-27 position with our{" "}
        <Link href="/income-tax-calculator/">income tax calculator</Link>, and use the{" "}
        <Link href="/tax-return-calculator/">tax return calculator</Link> closer to lodgement
        time to compare the flat $1,000 claim against your actual work expenses.
      </p>
    </>
  );
}

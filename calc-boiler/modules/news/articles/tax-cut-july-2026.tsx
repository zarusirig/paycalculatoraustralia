import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function TaxCutJuly2026() {
  return (
    <>
      <p className="lead">
        From 1 July 2026, the tax rate on income between $18,201 and $45,000 dropped from{" "}
        <strong>16% to 15%</strong> — the second stage of tax cuts legislated in the 2025 Budget.
        Every taxpayer earning above $45,000 saves the full <strong>$268 a year</strong>, applied
        automatically through lower PAYG withholding.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Bracket affected", after: "$18,201–$45,000" },
          { label: "Rate", before: "16%", after: "15%" },
          { label: "Maximum annual saving", after: "$268" },
          { label: "Next scheduled cut", after: "15% → 14% from 1 July 2027" },
          { label: "Legislation", after: "Treasury Laws Amendment (More Cost of Living Relief) Act 2025" },
        ]}
      />

      <h2>What actually changed</h2>
      <p>
        The second marginal tax rate — the rate applied to every dollar earned between $18,201
        and $45,000 — fell by one percentage point, from 16% to 15%, from 1 July 2026. It&apos;s the
        second instalment of the Stage 3+ tax cuts first announced in the 2025 Federal Budget,
        following the initial cuts that took effect from 1 July 2024.
      </p>
      <p>
        Because the change only affects that middle bracket, the dollar saving is capped: once
        your income exceeds $45,000, you&apos;ve captured the full $26,799 of income taxed at the
        lower rate, and the saving stops growing.
      </p>

      <h2>How much you actually save</h2>
      <p>
        Someone earning $45,000 or more saves the maximum $268 a year — about $5.15 a week.
        Someone earning $30,000 has only $11,799 of their income in the affected bracket, so
        their saving is proportionally smaller, at roughly $118 a year. Anyone earning under
        $18,201 sees no change, since that income already sits below the tax-free threshold.
      </p>
      <p>
        The saving scales linearly between $18,201 and $45,000: every extra dollar of taxable
        income in that band now costs one cent less in tax than it did in 2025-26. On a $60,000
        salary, the full $268 saving applies because all of the affected bracket is captured. On
        a $22,000 part-time wage, only $3,799 of income sits in the bracket, so the saving is
        closer to $38 a year — small, but automatic and stacked on top of any award or minimum
        wage increase you also received on 1 July.
      </p>

      <h2>Where the tax cuts go next</h2>
      <p>
        This isn&apos;t the end of the schedule. The same legislation cuts the rate again, from 15% to
        14%, from 1 July 2027 — on the same $18,201 to $45,000 bracket — taking the maximum
        annual saving to $536 a year compared with 2024-25 settings. The May 2026 Budget layered
        a further $250 Working Australians Tax Offset on top from 2027-28; see our{" "}
        <Link href="/news/federal-budget-2026-27-your-pay/">Budget 2026-27 wrap</Link> for the
        combined picture.
      </p>
      <p>
        Combined with the $1,000 instant work-related deduction that also applies from the
        2026-27 income year, Treasury estimates a worker on average earnings receiving the
        average $205 deduction benefit would be about $2,701 better off in 2027-28 compared with
        2023-24 settings — or up to $2,816 with the maximum deduction benefit. See our{" "}
        <Link href="/news/1000-dollar-instant-tax-deduction/">
          $1,000 instant deduction explainer
        </Link>{" "}
        for how that measure works alongside this rate cut.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        You don&apos;t need to apply for the tax cut — it&apos;s built into the PAYG withholding schedule
        your payroll software already uses, so it should simply appear as slightly higher
        take-home pay from your first pay run after 1 July 2026. Check the exact effect on your
        salary with our <Link href="/income-tax-calculator/">income tax calculator</Link>, or see
        how it stacks with a pay rise using the{" "}
        <Link href="/pay-rise-calculator/">pay rise calculator</Link>.
      </p>
    </>
  );
}

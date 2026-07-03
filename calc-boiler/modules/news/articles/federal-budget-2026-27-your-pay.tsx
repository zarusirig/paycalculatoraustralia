import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function FederalBudget202627YourPay() {
  return (
    <>
      <p className="lead">
        Treasurer Jim Chalmers handed down the <strong>2026-27 Federal Budget</strong> on
        12 May 2026. It didn&apos;t cut tax rates again — that was already locked in — but it
        added a new <strong>$250 Working Australians Tax Offset</strong> from 2027-28, stacking
        on top of the 1 July tax cut and the $1,000 instant deduction.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Budget handed down", after: "12 May 2026" },
          { label: "New measure: Working Australians Tax Offset", after: "Up to $250/year from 2027-28" },
          { label: "Already-legislated 1 July 2026 tax cut", after: "16% → 15% ($18,201–$45,000)" },
          { label: "$1,000 instant deduction", after: "Confirmed, applies from 2026-27 income year" },
          { label: "Combined benefit, average earner ($81,245)", after: "Up to $2,816/year (max deduction benefit)" },
        ]}
      />

      <h2>What the Budget actually changed</h2>
      <p>
        Most of the headline tax relief in this Budget wasn&apos;t new. The 16% to 15% rate cut
        on income between $18,201 and $45,000 had already been legislated in the 2025 Budget and
        simply took effect as planned on 1 July 2026 — see our{" "}
        <Link href="/news/tax-cut-july-2026/">tax cut explainer</Link> for the detail. The
        genuinely new measure was the Working Australians Tax Offset (WATO): a permanent, annual
        offset of up to $250, starting from the 2027-28 income year and reaching over 13 million
        workers.
      </p>
      <p>
        The Budget also confirmed the $1,000 instant work-related deduction is locked in for the
        2026-27 income year, and reiterated the Medicare levy low-income threshold increases that
        flow through to the 2025-26 return most people are lodging this tax time.
      </p>

      <h2>What it&apos;s worth, combined</h2>
      <p>
        Treasury&apos;s modelling puts the combined value of every measure — the 2024, 2026 and
        2027 rate cuts, the new $250 offset and the $1,000 deduction — at up to $2,816 a year for
        a worker on average earnings of $81,245 from 2027-28, if they receive the maximum benefit
        from the instant deduction. A worker receiving the average $205 deduction benefit instead
        would be about $2,701 better off. For most people the actual saving this year is smaller:
        the immediate 1 July 2026 benefit is capped at $268, with the rest arriving in later
        years.
      </p>
      <p>
        The Working Australians Tax Offset works differently to a rate cut. Instead of changing a
        bracket, it&apos;s applied as a direct reduction to the tax you&apos;d otherwise owe, up to $250,
        once you&apos;ve calculated your liability under the ordinary rates and thresholds. Treasury
        says it effectively lifts the point at which a typical worker starts paying net tax to
        almost $19,985, or up to $24,985 for workers who also qualify for the low income tax
        offset. Because it doesn&apos;t start until the 2027-28 income year, it won&apos;t appear on a
        2026-27 notice of assessment — the first year it shows up is the return lodged from July
        2028.
      </p>

      <h2>What the Budget didn&apos;t change</h2>
      <p>
        There was no new personal tax bracket restructure, no change to the Medicare levy rate
        itself, and no fresh HECS or superannuation announcement in this Budget beyond measures
        already legislated and covered separately in our HECS and super coverage. Anyone expecting
        a bigger, immediate rate cut in this Budget will find the real story is the staged
        rollout that started in 2024 and continues through 2027-28.
      </p>
      <p>
        Superannuation guarantee, Division 296 tax and the HECS repayment thresholds were all
        confirmed at the settings already legislated earlier in the year — none of them were
        revisited or expanded in this Budget. Similarly, the Medicare levy rate stayed at 2%; only
        the low-income thresholds that determine who&apos;s exempt or shaded-in moved, and that
        increase had already been flagged before Budget night. In other words, this was a Budget
        of confirmation and one new offset, rather than a fresh round of rate cuts.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If you&apos;re on an average salary, the practical change in your pay packet this year is the
        1 July 2026 tax cut already built into your employer&apos;s withholding — check the exact
        figure with our <Link href="/income-tax-calculator/">income tax calculator</Link>. The
        $250 offset and further savings don&apos;t land until the 2027-28 income year, so budget
        for the smaller, immediate change now and use our{" "}
        <Link href="/take-home-pay-calculator/">take-home pay calculator</Link> to see your
        current after-tax pay under FY2026-27 settings.
      </p>
    </>
  );
}

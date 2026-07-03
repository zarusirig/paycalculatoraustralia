import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function Division296SuperTaxStarts() {
  return (
    <>
      <p className="lead">
        Division 296 tax began on <strong>1 July 2026</strong>, adding an extra <strong>15%</strong>{" "}
        tax on the share of superannuation earnings attributed to total super balances above{" "}
        <strong>$3 million</strong>, plus a further <strong>10%</strong> above $10 million. It
        applies to a small share of super members, with the first assessments issued after 30 June
        2027.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Large super balance threshold (LSBT)", after: "$3,000,000" },
          { label: "Very large super balance threshold (VLSBT)", after: "$10,000,000" },
          { label: "Extra tax above $3m", after: "15% on attributed earnings" },
          { label: "Extra tax above $10m", after: "Further 10% on attributed earnings" },
          { label: "Takes effect", after: "1 July 2026 (2026-27 earnings)" },
        ]}
      />

      <h2>How Division 296 tax works</h2>
      <p>
        Division 296 is charged at the individual level, not the fund level. If your total super
        balance (TSB) at 30 June exceeds $3 million, the ATO calculates the proportion of your
        earnings for the year attributable to the balance above that threshold and taxes it at an
        extra 15%, on top of the 15% funds already pay. If your TSB exceeds $10 million, a further
        10% applies to earnings attributable to the portion above that higher threshold — a combined
        extra 25% on that top slice. The tax is levied on the individual, so it&apos;s calculated
        across all of a person&apos;s super interests combined, not fund by fund — if you hold
        balances across several funds, the ATO aggregates your total super balance to work out
        whether you&apos;re over either threshold before apportioning the earnings.
      </p>

      <h2>Why unrealised gains are part of the calculation</h2>
      <p>
        Division 296 earnings are worked out from the growth in your total super balance over the
        financial year, adjusted for contributions and withdrawals — which can include unrealised
        capital gains on assets such as property or unlisted shares that haven&apos;t been sold.
        This design, taxing paper gains rather than only realised income, has been the most debated
        feature of the measure since it was first proposed. Critics, including some self-managed
        super fund trustees and industry bodies, have argued it could force asset sales to fund a tax
        bill on gains that haven&apos;t actually been received in cash, particularly for funds
        holding illiquid assets like direct property. The government has maintained the design keeps
        the measure simple to administer compared with tracking realised gains fund by fund.
      </p>

      <h2>Who is actually affected</h2>
      <p>
        Only individuals with a total super balance above $3 million at the end of a financial year
        are in scope — a small fraction of super members, concentrated in self-managed super funds
        with large property or business holdings. If your balance is well under $3 million, Division
        296 has no direct effect on you, though you may want to keep an eye on your growth if
        you&apos;re a high income earner already paying{" "}
        <Link href="/division-293-tax/">Division 293 tax</Link> on contributions. It&apos;s worth
        noting Division 296 and Division 293 are separate measures: Division 293 is an extra 15% tax
        on concessional contributions for high income earners, while Division 296 taxes a share of
        investment earnings once your total balance passes $3 million, regardless of your income.
      </p>

      <h2>How the thresholds change over time</h2>
      <p>
        Both the $3 million and $10 million thresholds are indexed to CPI, in increments of $150,000
        and $500,000 respectively, so they will rise gradually rather than staying fixed. That
        indexation is designed to stop the tax capturing more members purely through inflation and
        investment growth over time.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        Division 296 tax is assessed separately from your income tax return and doesn&apos;t change
        your regular pay or super guarantee contributions. If your balance is nowhere near $3
        million, focus instead on the changes that do affect most people this year, like the higher
        contribution caps. Check your position with our{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link> and see how it
        compares with existing high-income super tax settings on our{" "}
        <Link href="/division-293-tax/">Division 293 tax guide</Link>.
      </p>
    </>
  );
}

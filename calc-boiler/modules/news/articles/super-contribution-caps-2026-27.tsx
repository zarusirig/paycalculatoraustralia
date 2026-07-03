import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function SuperContributionCaps202627() {
  return (
    <>
      <p className="lead">
        From 1 July 2026, the concessional super contributions cap rises from $30,000 to{" "}
        <strong>$32,500</strong>, and the non-concessional cap rises from $120,000 to{" "}
        <strong>$130,000</strong>. The change flows through to bring-forward limits and the total
        super balance thresholds that gate eligibility for making extra contributions.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Concessional contributions cap", before: "$30,000", after: "$32,500" },
          { label: "Non-concessional contributions cap", before: "$120,000", after: "$130,000" },
          { label: "TSB limit for non-concessional eligibility", before: "$2.0m", after: "$2.1m" },
          { label: "Takes effect", after: "1 July 2026 (2026-27 financial year)" },
        ]}
      />

      <h2>What counts toward each cap</h2>
      <p>
        The concessional cap covers all before-tax contributions combined — employer super
        guarantee, salary sacrifice, and personal contributions you claim as a tax deduction. The
        non-concessional cap covers after-tax contributions you make from your own savings, which
        aren&apos;t taxed going into your fund but don&apos;t get a tax deduction either. Exceeding
        either cap can trigger extra tax, so it&apos;s worth checking your total contributions
        before the end of the financial year. Contributions made before 30 June 2026 are still
        assessed against the old caps of $30,000 concessional and $120,000 non-concessional, so the
        higher 2026-27 limits only apply to contributions made on or after 1 July 2026 — timing
        matters if you&apos;re planning a large one-off contribution near the cut-over.
      </p>

      <h2>How the bring-forward rule changes</h2>
      <p>
        Non-concessional contributions come with a bring-forward option that lets eligible members
        under 75 bring forward up to three years of the cap into a single year. With the cap rising
        to $130,000, the maximum three-year bring-forward amount lifts to $390,000, subject to your
        total super balance sitting under the relevant threshold at the start of the financial year.
        The bring-forward rule is most useful after a large windfall, such as an inheritance or the
        sale of an investment property, letting you get more money into the concessionally taxed
        super environment in one year rather than spreading it over three separate contribution
        caps.
      </p>

      <h2>Why the caps went up</h2>
      <p>
        Concessional and non-concessional caps are indexed periodically in line with wage growth,
        via increments to the general transfer balance cap. The 2026-27 increase follows the{" "}
        <Link href="/news/transfer-balance-cap-increase-2026/">general transfer balance cap moving from $2.0 million to $2.1 million</Link>,
        which flows through to lift both contribution caps and the total super balance thresholds
        used to determine eligibility for non-concessional contributions.
      </p>

      <h2>How this compares with employer super guarantee</h2>
      <p>
        Remember that compulsory super guarantee contributions from your employer count toward the
        concessional cap alongside any salary sacrifice you arrange. On a $32,500 cap, someone
        earning around $150,000 already has roughly $18,000 of employer super guarantee using up
        cap space at the 12% rate, leaving room for further salary sacrifice or personal deductible
        contributions before the higher cap is reached — a useful check to run before committing to
        a large voluntary contribution. Exceeding the concessional cap means the excess is added to
        your assessable income and taxed at your marginal rate, less a 15% offset for the tax already
        paid inside the fund, so it pays to tally employer contributions and any planned salary
        sacrifice together before the end of the financial year.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        If you salary sacrifice, the higher concessional cap gives you more room to direct pre-tax
        income into super before hitting the limit — useful if you got a pay rise or bonus this
        year. Model different salary sacrifice amounts against the new $32,500 cap with our{" "}
        <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link>, and check
        your overall super trajectory with the{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link>.
      </p>
    </>
  );
}

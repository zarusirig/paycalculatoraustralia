import Link from "next/link";
import { NewsKeyFacts } from "@/modules/news/layout";

export default function SuperTaxChangesExplained() {
  return (
    <>
      <p className="lead">
        Several superannuation changes landed together in 2026-27: payday super, Division 296 tax,
        and higher contribution and transfer balance caps. Most Australians are affected by the
        first and third — Division 296 tax only hits people with a total super balance above{" "}
        <strong>$3 million</strong>.
      </p>

      <NewsKeyFacts
        rows={[
          { label: "Payday super", after: "Employers pay SG every payday from 1 July 2026" },
          { label: "Division 296 tax", after: "Extra 15% above $3m TSB, +10% above $10m" },
          { label: "Concessional contributions cap", before: "$30,000", after: "$32,500" },
          { label: "Non-concessional contributions cap", before: "$120,000", after: "$130,000" },
          { label: "General transfer balance cap", before: "$2.0m", after: "$2.1m" },
        ]}
      />

      <h2>Payday super: affects almost every employee</h2>
      <p>
        <Link href="/news/payday-super-starts-july-2026/">Payday super</Link> requires employers to
        pay super guarantee with every pay run and get it into your fund within 7 business days,
        replacing the old quarterly payment cycle. It doesn&apos;t change your super rate, but it
        does mean your contributions start earning returns sooner — and it gives the ATO much faster
        visibility into employers who fall behind. For most workers, this is the single biggest
        practical change of the 2026-27 super reforms, since it affects every payday rather than a
        small subset of very large balances.
      </p>

      <h2>Division 296 tax: a small group, a big change</h2>
      <p>
        Division 296 tax adds an extra 15% on the share of earnings attributed to super balances
        above $3 million, and a further 10% above $10 million. It&apos;s controversial because it
        taxes unrealised gains in growth in your total super balance, not just realised income. But
        it only applies if your balance exceeds $3 million — a small share of super members,
        concentrated in large self-managed super funds. See our full{" "}
        <Link href="/division-293-tax/">Division 293 tax guide</Link> for how it interacts with
        existing high-income super settings. Both the $3 million and $10 million thresholds are
        indexed to CPI over time, so the number of people affected should grow only gradually rather
        than jumping sharply as balances rise with contributions and investment growth.
      </p>

      <h2>Why the government made these changes</h2>
      <p>
        Treasurer Jim Chalmers has framed the Better Targeted Superannuation Concessions reforms,
        including Division 296, as making the tax system fairer by targeting concessions that
        disproportionately benefited a small number of very large balances, while payday super was
        pitched primarily as a compliance and retirement-adequacy measure to stop unpaid or late
        super guarantee eroding workers&apos; balances over time. Together, the government has
        described the package as balancing fairness at the top end of the super system with stronger
        protections and faster contributions for everyday workers further down the balance scale.
      </p>

      <h2>Higher caps: more room for most savers</h2>
      <p>
        Separately from Division 296, the concessional contributions cap rose to $32,500 and the
        non-concessional cap to $130,000, alongside the general transfer balance cap moving to $2.1
        million. These increases give most super members more room to grow their balance through
        salary sacrifice or after-tax contributions before hitting a cap. The concessional cap
        increase in particular benefits anyone using salary sacrifice to reduce taxable income, since
        it creates extra headroom before the additional-tax rules for excess contributions kick in.
      </p>

      <h2>What this means for your pay</h2>
      <p>
        For most people, the practical impact of the 2026-27 super changes is payday super arriving
        sooner and more reliably, plus more headroom in the contribution caps if you&apos;re topping
        up your balance. Model your position with our{" "}
        <Link href="/superannuation-calculator/">superannuation calculator</Link>, and only worry
        about Division 296 tax if your total super balance is approaching $3 million.
      </p>
    </>
  );
}

import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES, SUPER_GUARANTEE, formatAUD } from "@/lib/constants";
import { carryForwardPlan, usableUntil } from "@/lib/constants/carry-forward";
import { CARRY_FORWARD, CONCESSIONAL_CAP_BY_YEAR, CONTRIBUTIONS_TAX_RATE } from "@/lib/constants/super-contributions";
import CarryForwardConcessionalCalculator from "@/modules/calculator/carry-forward-concessional-calculator";
import { CARRY_FORWARD_FAQS } from "./carry-forward-concessional-faqs";
import {
  ARTICLE_CLASS,
  Breadcrumbs,
  DataTable,
  FaqSection,
  H2,
  KeyFigures,
  PAGE_INNER,
  PAGE_WRAP,
  PageFooter,
  PageHeader,
  RelatedSidebar,
} from "./t3-shared";

// /carry-forward-concessional-contributions-calculator/ (Oct 2026). Rules and
// sources: lib/constants/carry-forward.ts and super-contributions.ts.

export const CARRY_FORWARD_VERIFIED_ON = "5 October 2026";

const ATO_CAP = "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/caps-limits-and-tax-on-super-contributions/concessional-contributions-cap";
const ATO_CAPS_TABLE = "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/contributions-caps";
const ATO_PERSONAL = "https://www.ato.gov.au/individuals-and-families/super-for-individuals-and-families/super/growing-and-keeping-track-of-your-super/how-to-save-more-in-your-super/personal-super-contributions";

const SOURCES_LIST: SourceLink[] = [
  { title: "Concessional contributions cap", url: ATO_CAP, publisher: SOURCES.ato.name },
  { title: "Key superannuation rates and thresholds: contributions caps", url: ATO_CAPS_TABLE, publisher: SOURCES.ato.name },
  { title: "Personal super contributions", url: ATO_PERSONAL, publisher: SOURCES.ato.name },
];

const CAP = SUPER_GUARANTEE.concessionalCap;
const LIMIT = CARRY_FORWARD.totalSuperBalanceLimit;
const CAP_YEARS = Object.keys(CONCESSIONAL_CAP_BY_YEAR).filter((y) => y >= CARRY_FORWARD.firstYear);

// Worked example: employer super only in each prior year; a $60,000 total for 2026-27.
const EX_CONTRIB = { "2021-22": 8_000, "2022-23": 9_000, "2023-24": 10_000, "2024-25": 11_500, "2025-26": 12_500 };
const EX_THIS_YEAR = 60_000;
const EX = carryForwardPlan({ contributedByYear: EX_CONTRIB, totalSuperBalance: 150_000, contributionsThisYear: EX_THIS_YEAR });

export default function CarryForwardConcessionalPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/superannuation-guide/", label: "Superannuation" }, { label: "Carry-Forward Contributions" }]} />

      <PageHeader title="Carry-Forward Concessional Contributions Calculator (2026-27)">
        <p>
          <strong>If your total super balance was under {formatAUD(LIMIT)} on 30 June 2026, you can contribute more than the {formatAUD(CAP)} concessional cap this year by using unused cap from the last five years.</strong> Unused amounts expire after five years, and the oldest are used first, so the 2021-22 amount is lost after 30 June 2027. Enter what was contributed for you each year and the calculator shows your cap for 2026-27, how much room is left, and what you would save on tax by claiming a deduction.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "General cap 2026-27", v: formatAUD(CAP), s: "Up from $30,000" },
          { k: "Balance test", v: `Under ${formatAUD(LIMIT)}`, s: "Total super balance at 30 June 2026" },
          { k: "Look-back", v: `${CARRY_FORWARD.years} years`, s: "2021-22 to 2025-26, oldest used first" },
          { k: "Unused cap that expires", v: "30 Jun 2027", s: "The 2021-22 amount, if unused" },
        ]}
      />

      <div className="mb-12"><CarryForwardConcessionalCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="how-it-works">How Carry-Forward Contributions Work</H2>
            <p>
              Each year you can have a limited amount of before-tax (concessional) money paid into super: the concessional contributions cap. It is {formatAUD(CAP)} from 1 July 2026. Most employees stay well below it, because their only concessional contributions are the employer&rsquo;s 12% super guarantee. The gap between what was contributed and the cap is the unused amount for that year. The ATO lets you carry those unused amounts forward and add them to your cap in later years, so you can make a larger contribution in one year, for example after a bonus or a house sale.
            </p>
            <p>
              Three rules decide whether it works for you. First, <strong>your total super balance must be under {formatAUD(LIMIT)} at 30 June of the previous financial year</strong>, which is 30 June 2026 for 2026-27. Second, you can carry forward unused amounts from up to <strong>{CARRY_FORWARD.years} previous financial years</strong>, starting from {CARRY_FORWARD.firstYear}, including years when you had no super fund. Third, amounts are available for {CARRY_FORWARD.years} years and <strong>then expire</strong>.
            </p>
          </section>

          <section>
            <H2 id="caps-by-year">Concessional Cap by Year and When Each Amount Expires</H2>
            <p>
              Each year&rsquo;s unused amount is measured against <em>that year&rsquo;s</em> cap, not today&rsquo;s. The caps rose from $25,000 to $27,500 in 2021-22, to $30,000 in 2024-25 and to {formatAUD(CAP)} in 2026-27.
            </p>
            <DataTable
              head={["Income year", "Concessional cap", "Last year you can use any unused amount"]}
              align={["l", "r", "r"]}
              rows={CAP_YEARS.map((y) => [y, formatAUD(CONCESSIONAL_CAP_BY_YEAR[y]), usableUntil(y)])}
              caption={<>ATO, <a href={ATO_CAPS_TABLE} target="_blank" rel="noopener noreferrer">contributions caps</a> and <a href={ATO_CAP} target="_blank" rel="noopener noreferrer">concessional contributions cap</a>. The ATO&rsquo;s example: a 2020-21 unused amount not used by the end of 2025-26 expires.</>}
            />
          </section>

          <section>
            <H2 id="worked-example">Worked Example</H2>
            <p>
              An employee whose only contributions have been employer super had {formatAUD(EX_CONTRIB["2021-22"])}, {formatAUD(EX_CONTRIB["2022-23"])}, {formatAUD(EX_CONTRIB["2023-24"])}, {formatAUD(EX_CONTRIB["2024-25"])} and {formatAUD(EX_CONTRIB["2025-26"])} paid in 2021-22 to 2025-26, and a total super balance of $150,000 at 30 June 2026. The unused amounts are:
            </p>
            <DataTable
              head={["Year", "Cap", "Contributed", "Unused", "Used in 2026-27"]}
              align={["l", "r", "r", "r", "r"]}
              rows={EX.rows.map((r) => [r.year, formatAUD(r.cap), formatAUD(r.contributed), formatAUD(r.unused), formatAUD(r.used)])}
              caption={<>Example only. Total unused: {formatAUD(EX.totalUnused)}.</>}
            />
            <p>
              The total unused is {formatAUD(EX.totalUnused)}, so the cap for 2026-27 is {formatAUD(CAP)} + {formatAUD(EX.totalUnused)} = <strong>{formatAUD(EX.availableCap)}</strong>. Suppose the employee contributes {formatAUD(EX_THIS_YEAR)} in total this year. That is {formatAUD(EX_THIS_YEAR - CAP)} over the general cap, so the ATO draws {formatAUD(EX.usedFromCarryForward)} from the carried-forward amounts, oldest first (2021-22 first), and no excess arises. {formatAUD(EX.headroom)} of room is left, and the 2021-22 amount is fully used so none of it expires.
            </p>
          </section>

          <section>
            <H2 id="how-to-use">How to Use Your Carry-Forward Cap</H2>
            <ul>
              <li><strong>Check your numbers first.</strong> Your carry-forward amounts and total super balance are in ATO online services (myGov: Super, Information, Carry forward concessional contributions). Contributions count in the year your fund <em>receives</em> them, so a late payment can land in the next year.</li>
              <li><strong>Salary sacrifice.</strong> Ask your employer to redirect pay into super before tax. Use the <Link href="/salary-sacrifice-calculator/">salary sacrifice calculator</Link> to see the take-home effect.</li>
              <li><strong>Personal contribution with a deduction.</strong> Pay it into your fund from your bank account, then give the fund a notice of intent to claim a deduction in the approved form and get its acknowledgment. Time limits apply.</li>
              <li><strong>Pay before 30 June.</strong> The year ends on 30 June 2027 and the fund must have the money by then for it to count in 2026-27.</li>
            </ul>
            <p>
              The tax benefit is the gap between your marginal rate (plus 2% Medicare levy) and the {Math.round(CONTRIBUTIONS_TAX_RATE * 100)}% tax your fund pays on the contribution. At a 30% marginal rate that is about 17 cents saved per dollar contributed; at 45%, about 32 cents. The money stays in super until you meet a condition of release.
            </p>
          </section>

          <section>
            <H2 id="watch-outs">Things to Watch</H2>
            <ul>
              <li><strong>The balance test uses 30 June of the previous year.</strong> If you were at {formatAUD(LIMIT)} or more on 30 June 2026, you cannot use carried-forward amounts in 2026-27, even if you have plenty unused.</li>
              <li><strong>Contributions you did not expect.</strong> Costs your employer pays for you, such as administration fees and insurance premiums, are concessional contributions too.</li>
              <li><strong>Going over.</strong> The excess is included in your assessable income and taxed at your marginal rate with a 15% offset. Above $250,000 of income plus concessional contributions, <Link href="/division-293-tax/">Division 293</Link> applies.</li>
            </ul>
            <p>
              For the cap itself, the SG check and a one-year salary sacrifice test, see the <Link href="/concessional-contributions-cap/">concessional contributions cap page</Link>. This page is for the multi-year catch-up.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/concessional-contributions-cap/">Concessional Contributions Cap</Link>: the {formatAUD(CAP)} cap and the one-year check</li>
              <li><Link href="/salary-sacrifice-calculator/">Salary Sacrifice Calculator</Link>: take-home pay after sacrificing</li>
              <li><Link href="/superannuation-calculator/">Superannuation Calculator</Link>: what your employer should pay</li>
              <li><Link href="/division-293-tax/">Division 293 Tax</Link>: the extra tax on high incomes</li>
              <li><Link href="/superannuation-guide/">Superannuation Guide</Link>: how super works</li>
            </ul>
          </section>

          <FaqSection faqs={CARRY_FORWARD_FAQS} label="Carry-forward concessional contributions" />

          <PageFooter
            slug="carry-forward-concessional-contributions-calculator"
            lastVerified={CARRY_FORWARD_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>For each of the five years before 2026-27, unused = that year&rsquo;s cap minus the concessional contributions you enter, never below nil. If your total super balance at 30 June 2026 is under {formatAUD(LIMIT)}, the unused amounts are added to the {formatAUD(CAP)} general cap. Contributions above the general cap draw on the unused amounts oldest first. The tax saving is headroom × (your marginal rate + 2% Medicare levy − {Math.round(CONTRIBUTIONS_TAX_RATE * 100)}%).</p>
              <p>Caps by year come from the ATO table. Your ATO online services record is the authority on your own amounts. The calculator ignores Division 293, non-concessional contributions and defined benefit interests. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/concessional-contributions-cap/", label: "Concessional Contributions Cap" },
          { href: "/salary-sacrifice-calculator/", label: "Salary Sacrifice Calculator" },
          { href: "/superannuation-calculator/", label: "Superannuation Calculator" },
          { href: "/division-293-tax/", label: "Division 293 Tax" },
          { href: "/income-tax-calculator/", label: "Income Tax Calculator" },
        ]} />
      </div>
    </div></div>
  );
}

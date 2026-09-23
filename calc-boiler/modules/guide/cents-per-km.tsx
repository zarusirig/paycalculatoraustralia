import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES, formatAUD } from "@/lib/constants";
import {
  AWARD_TRANSPORT_CHANGE_DATE,
  CENTS_PER_KM_RATES,
  CENTS_PER_KM_SOURCES,
  CENTS_PER_KM_VERIFIED_ON,
  CPK_KM_CAP,
  CURRENT_CPK_RATE,
  CURRENT_CPK_YEAR,
  PREVIOUS_CPK_RATE,
  carAllowanceWithholding,
  centsPerKmDeduction,
} from "@/lib/constants/cents-per-km";
import { MODERN_AWARDS } from "@/lib/constants/modern-awards";
import CentsPerKmCalculator from "@/modules/calculator/cents-per-km-calculator";
import { CENTS_PER_KM_FAQS } from "./cents-per-km-faqs";
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

const SOURCES_LIST: SourceLink[] = [
  { title: "Cents per kilometre method (QC107246)", url: CENTS_PER_KM_SOURCES.atoMethod, publisher: SOURCES.ato.name },
  { title: "Withholding for allowances (QC51680), Tables 1 and 2", url: CENTS_PER_KM_SOURCES.atoWithholdingForAllowances, publisher: SOURCES.ato.name },
  { title: "Changes to award transport payments (QC66099)", url: CENTS_PER_KM_SOURCES.atoAwardTransportChanges, publisher: SOURCES.ato.name },
  ...Object.values(MODERN_AWARDS)
    .filter((a) => a.allowances.some((x) => x.unit === "per km"))
    .map((a) => ({ title: `${a.meta.name} (${a.meta.code}), ${a.allowancesClause}`, url: a.meta.awardTextUrl, publisher: SOURCES.fwc.name })),
];

const c = (d: number) => `${Math.round(d * 100)}c`;
const MAX = centsPerKmDeduction(CPK_KM_CAP);
const YEARS = Object.entries(CENTS_PER_KM_RATES);
const AWARD_KM = Object.values(MODERN_AWARDS).flatMap((a) =>
  a.allowances.filter((x) => x.unit === "per km").map((x) => ({ award: a.meta.shortName, href: a.meta.href, ...x })),
);
const example = carAllowanceWithholding({ km: 2_000, ratePerKm: 1.0 });

export default function CentsPerKmPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/tax-deductions-guide/", label: "Tax Deductions" }, { label: "Cents per km" }]} />

      <PageHeader title={`Cents per km ${CURRENT_CPK_YEAR}: ${c(CURRENT_CPK_RATE)} ATO Rate and Calculator`}>
        <p>
          <strong>The ATO cents per kilometre rate is {c(CURRENT_CPK_RATE)} for {CURRENT_CPK_YEAR}</strong>, up from {c(PREVIOUS_CPK_RATE)} in 2024-25 and 2025-26. You can claim up to {CPK_KM_CAP.toLocaleString("en-AU")} work-related kilometres per car, so the most you can deduct is {formatAUD(MAX)}. The rate covers every car cost, and you need a record of your kilometres but no receipts. A car allowance your employer pays at or below the rate, for up to {CPK_KM_CAP.toLocaleString("en-AU")} km, has no tax withheld.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: `Rate ${CURRENT_CPK_YEAR}`, v: c(CURRENT_CPK_RATE), s: `${c(PREVIOUS_CPK_RATE)} in 2024-25 and 2025-26` },
          { k: "Kilometre cap", v: CPK_KM_CAP.toLocaleString("en-AU"), s: "Work km per car, per year" },
          { k: "Maximum claim", v: formatAUD(MAX), s: `${CPK_KM_CAP.toLocaleString("en-AU")} km × ${c(CURRENT_CPK_RATE)}` },
          { k: "Receipts", v: "None", s: "Keep a record of your km" },
        ]}
      />

      <div className="mb-12"><CentsPerKmCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="rates">ATO Cents per km Rates by Year</H2>
            <DataTable
              head={["Income year", "Rate per km", `Maximum (${CPK_KM_CAP.toLocaleString("en-AU")} km)`]}
              align={["l", "r", "r"]}
              rows={YEARS.map(([y, r]) => [y === CURRENT_CPK_YEAR ? `${y} (current)` : y, c(r), formatAUD(centsPerKmDeduction(CPK_KM_CAP, y))])}
              caption={<>ATO, <a href={CENTS_PER_KM_SOURCES.atoMethod} target="_blank" rel="noopener noreferrer">cents per kilometre method</a>, last updated 12 August 2026, read {CENTS_PER_KM_VERIFIED_ON}. Use the rate for the year you travelled.</>}
            />
          </section>

          <section>
            <H2 id="how">How to Work Out Your Claim</H2>
            <ol>
              <li><strong>Count your work-related kilometres</strong>: trips in the course of your job, such as between workplaces or to clients. Ordinary home-to-work trips don&rsquo;t count.</li>
              <li><strong>Make a reasonable estimate</strong> if you haven&rsquo;t logged every trip. The ATO&rsquo;s example: a 20 km round trip once a week for 48 weeks is 960 km.</li>
              <li><strong>Cap it at {CPK_KM_CAP.toLocaleString("en-AU")} km per car.</strong> Joint owners using the car for separate work can each claim up to {CPK_KM_CAP.toLocaleString("en-AU")} km.</li>
              <li><strong>Multiply by the rate</strong>: 960 km × {c(CURRENT_CPK_RATE)} = {formatAUD(centsPerKmDeduction(960), 2)}.</li>
            </ol>
            <p>You must own or lease the car, and you can&rsquo;t add fuel, rego, insurance or repairs on top: the rate already covers them. Driving more than {CPK_KM_CAP.toLocaleString("en-AU")} km for work? The logbook method isn&rsquo;t capped at that, but needs a logbook and records of your car expenses. See the <Link href="/tax-deductions-guide/">tax deductions guide</Link> or estimate your refund with the <Link href="/tax-return-calculator/">tax return calculator</Link>.</p>
          </section>

          <section>
            <H2 id="car-allowance">Car Allowance on Your Payslip: Is It Taxed?</H2>
            <p>Many employers pay a per-km car allowance. How much tax is withheld depends on the rate and the kilometres (ATO <a href={CENTS_PER_KM_SOURCES.atoWithholdingForAllowances} target="_blank" rel="noopener noreferrer">withholding for allowances</a>, Table 2):</p>
            <DataTable
              head={["Car allowance paid for work travel", "Tax withheld?"]}
              rows={[
                [`At or below the ATO rate, up to ${CPK_KM_CAP.toLocaleString("en-AU")} km`, "No"],
                [`At the ATO rate, for km beyond ${CPK_KM_CAP.toLocaleString("en-AU")}`, `Yes, from the payment for the km over ${CPK_KM_CAP.toLocaleString("en-AU")}`],
                [`Above the ATO rate, up to ${CPK_KM_CAP.toLocaleString("en-AU")} km`, "Yes, from the part above the ATO rate"],
                ["For home-to-work travel (any rate)", "Yes, it's added to gross pay like wages"],
              ]}
              caption="In each work-travel case the whole allowance is shown separately in the allowance box of your income statement. It is income either way."
            />
            <p>Example: 2,000 km at $1.00 a km is a {formatAUD(example.allowance)} allowance. {formatAUD(example.notWithheld)} (2,000 × {c(CURRENT_CPK_RATE)}) is paid without withholding and tax is withheld from the other {formatAUD(example.subjectToWithholding)}.</p>
          </section>

          <section>
            <H2 id="award-rates">Award Vehicle Allowances per km</H2>
            <p>Some awards set a per-km vehicle allowance. Where it&rsquo;s above {c(CURRENT_CPK_RATE)}, the part above the ATO rate has tax withheld (for work travel, up to {CPK_KM_CAP.toLocaleString("en-AU")} km).</p>
            <DataTable
              head={["Award", "Allowance", "Rate", "Clause"]}
              rows={AWARD_KM.map((a) => [
                <Link key={`${a.award}-${a.name}`} href={a.href}>{a.award}</Link>,
                a.name + (a.note ? ` (${a.note})` : ""),
                `${formatAUD(a.amount, 2)}/km`,
                a.clause,
              ])}
              caption="Current award rates as published on our award pages, transcribed from each award's text; any note in brackets says when a rate changes."
            />
            <p>
              <strong>Award transport payments change on {AWARD_TRANSPORT_CHANGE_DATE}.</strong> Transport allowances paid under an industrial instrument that was in force on 29 October 1986 used to have withholding varied to nil. A 2026 law change repealed those rules, so from {AWARD_TRANSPORT_CHANGE_DATE} employers must withhold from them (<a href={CENTS_PER_KM_SOURCES.atoAwardTransportChanges} target="_blank" rel="noopener noreferrer">ATO</a>). The cents per km rules in the table above are unchanged.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/travel-allowance/">Travel Allowance</Link>: ATO reasonable amounts for overnight trips</li>
              <li><Link href="/novated-lease-calculator/">Novated Lease Calculator</Link>: packaging a car instead</li>
              <li><Link href="/work-from-home-deductions/">Work From Home Deductions</Link></li>
              <li><Link href="/gross-vs-net-pay/">Gross vs Net Pay</Link>: where allowances sit on a payslip</li>
            </ul>
          </section>

          <FaqSection faqs={CENTS_PER_KM_FAQS} label="Cents per kilometre" />

          <PageFooter
            slug="cents-per-km"
            lastVerified={CENTS_PER_KM_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Deduction = min(work km, {CPK_KM_CAP.toLocaleString("en-AU")}) × the ATO rate for the income year. For a car allowance, the part paid at or below the ATO rate for up to {CPK_KM_CAP.toLocaleString("en-AU")} km is free of withholding; the part above the rate, and payments for km beyond {CPK_KM_CAP.toLocaleString("en-AU")}, are withheld from; a home-to-work allowance is withheld from in full. This follows the ATO&rsquo;s Table 1 and Table 2 for allowances.</p>
              <p>General information, not tax advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/travel-allowance/", label: "Travel Allowance 2026-27" },
          { href: "/tax-deductions-guide/", label: "Tax Deductions Guide" },
          { href: "/novated-lease-calculator/", label: "Novated Lease Calculator" },
          { href: "/tax-return-calculator/", label: "Tax Return Calculator" },
          { href: "/gross-vs-net-pay/", label: "Gross vs Net Pay" },
        ]} />
      </div>
    </div></div>
  );
}

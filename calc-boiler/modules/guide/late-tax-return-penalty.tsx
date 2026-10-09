import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES, TAX_FREE_THRESHOLD, formatAUD } from "@/lib/constants";
import { FTL_RULES, ftlPenalty } from "@/lib/constants/late-lodgement";
import {
  FTL_MAX_INDIVIDUAL,
  PENALTY_UNIT,
  RETURN_DATES_2026,
  TAX_CALENDAR_SOURCES,
  formatIso,
  weekdayOf,
} from "@/lib/constants/tax-calendar-2026-27";
import { RETURN_2026, RETURN_2026_SOURCES } from "@/lib/constants/tax-return-2025-26";
import LateTaxReturnPenaltyCalculator from "@/modules/calculator/late-tax-return-penalty-calculator";
import { LATE_TAX_RETURN_FAQS } from "./late-tax-return-penalty-faqs";
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
import FeaturedImage from "@/components/common/featured-image";

// /late-tax-return-penalty/ (Oct 2026): failure-to-lodge penalty for an
// individual's tax return. Rules and sources: lib/constants/late-lodgement.ts.

export const LATE_PENALTY_VERIFIED_ON = "5 October 2026";

const ATO_REMISSION =
  "https://www.ato.gov.au/individuals-and-families/your-tax-return/if-you-disagree-with-an-ato-decision/dispute-interest-or-penalties/remission-of-penalties";

const SOURCES_LIST: SourceLink[] = [
  { title: "Failure to lodge on time penalty", url: TAX_CALENDAR_SOURCES.failureToLodge, publisher: SOURCES.ato.name },
  { title: "Penalty units", url: TAX_CALENDAR_SOURCES.penaltyUnits, publisher: SOURCES.ato.name },
  { title: "Remission of penalties", url: ATO_REMISSION, publisher: SOURCES.ato.name },
  { title: "Lodge your tax return online with myTax", url: RETURN_2026_SOURCES.myTax, publisher: SOURCES.ato.name },
  { title: "Lodge your tax return with a registered tax agent", url: RETURN_2026_SOURCES.taxAgent, publisher: SOURCES.ato.name },
  { title: "Lodgment and payment dates on weekends or public holidays", url: TAX_CALENDAR_SOURCES.weekends, publisher: SOURCES.ato.name },
];

const DUE = RETURN_DATES_2026.selfLodge;
const EFFECTIVE = DUE.effectiveIso;
const UNITS = [1, 2, 3, 4, 5] as const;

/** Worked examples, all computed from the same function the calculator uses. */
const EXAMPLES = [
  { lodged: "2026-11-20", note: "18 days late" },
  { lodged: "2026-12-14", note: "six weeks late" },
  { lodged: "2027-03-15", note: "about four months late" },
].map((e) => ({ ...e, r: ftlPenalty({ dueIso: DUE.iso, lodgedIso: e.lodged }) }));

export default function LateTaxReturnPenaltyPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/tax-return-2026/", label: "Tax Return 2026" }, { label: "Late Tax Return Penalty" }]} />

      <PageHeader title="Late Tax Return Penalty: Failure to Lodge Calculator (2026)">
        <p>
          <strong>If you lodge your {RETURN_2026.incomeYear} tax return late, the ATO can charge one penalty unit ({formatAUD(PENALTY_UNIT.amount)}) for every {FTL_RULES.daysPerUnit} days or part of that it is overdue, up to {FTL_RULES.maxUnits} units ({formatAUD(FTL_MAX_INDIVIDUAL)}).</strong> The due date is {RETURN_2026.selfLodgeDueDate}, a {weekdayOf(DUE.iso)}, which the ATO moves to {weekdayOf(EFFECTIVE)} {formatIso(EFFECTIVE, "long")}. If you are owed a refund, the ATO generally does not issue the penalty at all. The calculator below works out the most you could be charged.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Penalty unit", v: formatAUD(PENALTY_UNIT.amount), s: `From ${PENALTY_UNIT.from} (was ${formatAUD(PENALTY_UNIT.previousAmount)})` },
          { k: "Rate", v: `1 per ${FTL_RULES.daysPerUnit} days`, s: "Or part of 28 days overdue" },
          { k: "Maximum", v: formatAUD(FTL_MAX_INDIVIDUAL), s: `${FTL_RULES.maxUnits} units, for an individual` },
          { k: "Self-lodge deadline", v: `${DUE.iso.slice(8)} Oct`, s: `Effective ${formatIso(EFFECTIVE)} (weekend rule)` },
        ]}
      />

      <div className="mb-12"><LateTaxReturnPenaltyCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <FeaturedImage placement="content" className="mt-0" />
          <section>
            <H2 id="how-much">How Much Is the Late Tax Return Penalty?</H2>
            <p>
              The failure-to-lodge (FTL) penalty is based on how long a return is overdue. The ATO charges one penalty unit for every {FTL_RULES.daysPerUnit} days, or part of {FTL_RULES.daysPerUnit} days, after the due date, to a maximum of {FTL_RULES.maxUnits} units. One day late counts as a full {FTL_RULES.daysPerUnit}-day block. A penalty unit is {formatAUD(PENALTY_UNIT.amount)} for failures on or after {PENALTY_UNIT.from}, which includes a {RETURN_2026.incomeYear} return lodged after the due date. For individuals the base amount applies with no multiplier. The ATO multiplies it by {PENALTY_UNIT.mediumWithholderMultiplier} for medium and {PENALTY_UNIT.largeWithholderMultiplier} for large withholders, which concerns businesses, not employees.
            </p>
            <DataTable
              head={["Days after the due date", "Penalty units", "Maximum penalty"]}
              align={["l", "r", "r"]}
              rows={UNITS.map((n) => [
                n === FTL_RULES.maxUnits ? `${(n - 1) * FTL_RULES.daysPerUnit + 1}+ days` : `${(n - 1) * FTL_RULES.daysPerUnit + 1} to ${n * FTL_RULES.daysPerUnit} days`,
                String(n),
                formatAUD(n * PENALTY_UNIT.amount),
              ])}
              caption={<>For an individual. Source: ATO, <a href={TAX_CALENDAR_SOURCES.failureToLodge} target="_blank" rel="noopener noreferrer">failure to lodge on time penalty</a>, and <a href={TAX_CALENDAR_SOURCES.penaltyUnits} target="_blank" rel="noopener noreferrer">penalty units</a>, read {LATE_PENALTY_VERIFIED_ON}.</>}
            />
          </section>

          <section>
            <H2 id="deadline">The {RETURN_2026.selfLodgeDueDate.replace(" 2026", "")} Deadline, and What Counts as Late</H2>
            <p>
              The due date for the {RETURN_2026.incomeYear} return is <strong>{RETURN_2026.selfLodgeDueDate}</strong> if you lodge it yourself. That date falls on a {weekdayOf(DUE.iso)}, and when a due date is on a weekend or public holiday the ATO treats the next business day as the due date. Here that is <strong>{weekdayOf(EFFECTIVE)} {formatIso(EFFECTIVE, "long")}</strong>, and the penalty clock starts the day after. The calculator applies this rule for you. Do not count on the extra day if you can lodge earlier.
            </p>
            <p>
              A registered tax agent changes the deadline. If you are a new client, or switching agents, contact them before 31 October so you are included in their lodgment program. Most agent clients then have until <strong>{RETURN_2026.agentDueDateMostPeople}</strong>, with earlier dates in a few cases: <strong>{RETURN_2026.agentDueDateLargeLiability}</strong> where your latest return had a liability of $20,000 or more, and 31 October 2026 if you had a return outstanding at 30 June 2026. See the <Link href="/tax-calendar/">tax calendar</Link> for every date.
            </p>
          </section>

          <section>
            <H2 id="worked-examples">Worked Examples</H2>
            <p>Each example uses the {RETURN_2026.incomeYear} return, due {formatIso(EFFECTIVE, "long")} after the weekend rule, and the same calculation as the tool above.</p>
            <DataTable
              head={["Lodged on", "Days overdue", "Units", "Maximum penalty"]}
              align={["l", "r", "r", "r"]}
              rows={EXAMPLES.map((e) => [`${formatIso(e.lodged, "long")} (${e.note})`, String(e.r.daysOverdue), String(e.r.units), formatAUD(e.r.penalty ?? 0)])}
              caption={<>Maximum amounts if the ATO applies the penalty. Many late returns that end in a refund attract nothing.</>}
            />
            <p>
              Lodging 3 days late or 28 days late costs the same, because both fall inside the first block. Day 29 adds a full extra unit ({formatAUD(PENALTY_UNIT.amount)}). That is why a few days can matter when you are close to a block boundary.
            </p>
          </section>

          <section>
            <H2 id="when-charged">When Does the ATO Actually Charge It?</H2>
            <p>
              The penalty is a maximum, not an automatic bill. The ATO says it generally does not apply penalties in isolated cases of late lodgement, and it looks at your circumstances first. If you miss a due date it will warn you by phone or in writing and issue a notice to lodge before applying a penalty, so you have a chance to lodge or talk to it.
            </p>
            <p>
              The most useful rule for employees: the ATO generally will not issue a failure-to-lodge penalty notice for a late return that results in <strong>a refund or a nil result</strong>. The exceptions are where the penalty was applied before you lodged, where the document is a third-party data report, and where you are classified as a large withholder. Most PAYG employees owed a refund can lodge late without a penalty, but they wait longer for the money. If you owe tax, or the ATO has already sent a notice to lodge, treat the penalty as real. Estimate which side you are on with the <Link href="/tax-return-calculator/">tax return calculator</Link>.
            </p>
            <p>
              A late penalty is separate from interest. If you owe tax, the general interest charge runs on the unpaid amount until you pay, and the rate resets every quarter. See the <Link href="/tax-refund-guide/">tax refund guide</Link> for how a refund or bill is worked out.
            </p>
          </section>

          <section>
            <H2 id="remission">How to Get a Late Lodgement Penalty Removed</H2>
            <p>
              You can ask the ATO to remit (cancel) all or part of the penalty. You are expected to lodge the outstanding return first. Each request is decided on its merits. The ATO gives these examples of what it would likely accept: a registered agent or a person you care for with a severe illness, not receiving information such as an income statement from an employer despite a genuine attempt to get it, a disaster such as a fire or flood, or financial abuse, coercive control or family violence. It would likely decline if you were on holiday, busy with work, had a short-term illness such as a cold, or did not get a reminder.
            </p>
            <p>
              If a registered tax or BAS agent was meant to lodge for you, ask about <strong>safe harbour</strong>. You are not liable for the penalty if you gave the agent everything they needed to lodge on time and their failure was not reckless or an intentional disregard of the law. You will need evidence that you supplied the information.
            </p>
          </section>

          <section>
            <H2 id="what-to-do">If You Have Not Lodged Yet</H2>
            <ol>
              <li><strong>Lodge now.</strong> Every day counts towards the next {FTL_RULES.daysPerUnit}-day block. Online with myTax is fastest, because the ATO pre-fills most details. Read the steps in the <Link href="/tax-return-2026/">2026 tax return guide</Link>.</li>
              <li><strong>Check your numbers.</strong> Use the <Link href="/tax-return-calculator/">tax return calculator</Link> to estimate a refund or bill from your income statement and deductions.</li>
              <li><strong>If you owe tax, pay what you can.</strong> The penalty and the interest are separate, and paying earlier reduces the interest.</li>
              <li><strong>Ask for remission</strong> afterwards if you had a good reason, with evidence.</li>
            </ol>
            <p>
              Not sure whether you must lodge? Earning above the {formatAUD(TAX_FREE_THRESHOLD)} tax-free threshold generally means you do, and the <Link href="/tax-free-threshold/">tax-free threshold guide</Link> explains how it works.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/tax-return-2026/">Tax Return 2026</Link>: dates, rates and the refund estimator</li>
              <li><Link href="/tax-return-calculator/">Tax Return Calculator</Link>: estimate your refund or bill</li>
              <li><Link href="/tax-calendar/">Tax Calendar</Link>: every ATO deadline for 2026-27</li>
              <li><Link href="/tax-refund-guide/">Tax Refund Guide</Link>: why refunds are what they are</li>
              <li><Link href="/work-from-home-deductions/">Work From Home Deductions</Link>: what to claim before you lodge</li>
            </ul>
          </section>

          <FaqSection faqs={LATE_TAX_RETURN_FAQS} label="Late tax return penalty" />

          <PageFooter
            slug="late-tax-return-penalty"
            lastVerified={LATE_PENALTY_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Days overdue = days from the effective due date to your lodgment date. The effective due date is the published date, moved to the next business day if it falls on a weekend or a public holiday that applies to the whole of any state or territory (ATO QC34577). Penalty units = the days overdue divided by {FTL_RULES.daysPerUnit}, rounded up, to a maximum of {FTL_RULES.maxUnits}. Penalty = units × the penalty unit value that applied on the due date ({formatAUD(PENALTY_UNIT.amount)} from {PENALTY_UNIT.from}; {formatAUD(PENALTY_UNIT.previousAmount)} from {PENALTY_UNIT.previousPeriod}).</p>
              <p>This is the base amount for an individual. The ATO decides each case, usually warns first, generally does not charge it where the return results in a refund or nil, and can remit it. It also applies to other lodgments such as activity statements. General information, not tax advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/tax-return-2026/", label: "Tax Return 2026" },
          { href: "/tax-return-calculator/", label: "Tax Return Calculator" },
          { href: "/tax-calendar/", label: "Tax Calendar 2026-27" },
          { href: "/tax-refund-guide/", label: "Tax Refund Guide" },
          { href: "/income-tax-calculator/", label: "Income Tax Calculator" },
        ]} />
      </div>
    </div></div>
  );
}

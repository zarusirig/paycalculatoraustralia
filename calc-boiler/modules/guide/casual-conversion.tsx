import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { EMPLOYMENT, SOURCES, formatAUD, formatPercent } from "@/lib/constants";
import {
  CASUAL_CONVERSION_SOURCES as SRC,
  CASUAL_CONVERSION_VERIFIED_ON,
  EMPLOYEE_CHOICE,
  compareCasualToPermanent,
} from "@/lib/constants/casual-conversion";
import { CASUAL_CONVERSION_FAQS } from "./casual-conversion-faqs";
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

// /casual-conversion/ — the employee choice pathway, in pay terms. The
// 25% loading comparison links to /casual-loading-calculator/ rather than
// rebuilding it. Rules and sources: lib/constants/casual-conversion.ts.

const SOURCES_LIST: SourceLink[] = [
  { title: "Becoming a permanent employee", url: SRC.becoming, publisher: SOURCES.fwo.name },
  { title: "Casual employees", url: SRC.casual, publisher: SOURCES.fwo.name },
  { title: "Fair Work Act 2009, sections 66A–66M", url: SRC.fwAct, publisher: "Federal Register of Legislation" },
];

const WEEKS = [52, 48, 44, 40, 36] as const;

export default function CasualConversionPage() {
  const base = 30;
  const c = compareCasualToPermanent(base, 38, 52);
  const loading = formatPercent(EMPLOYMENT.casualLoading, 0);

  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/full-time-vs-part-time-vs-casual/", label: "Employment Types" }, { label: "Casual Conversion" }]} />

      <PageHeader title="Casual Conversion in Australia: How to Become Permanent and What It Does to Your Pay">
        <p>
          <strong>If you have been a casual for 6 months (12 months in a small business) and no longer fit the definition of casual employment, you can give your employer written notice that you want to become permanent.</strong> The employer must consult you and answer in writing within {EMPLOYEE_CHOICE.responseDays} days, and can refuse only for set reasons. Becoming permanent ends your {loading} casual loading and starts paid leave, so the pay trade-off is worth checking before you decide.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Eligible after", v: `${EMPLOYEE_CHOICE.minMonths} months`, s: `${EMPLOYEE_CHOICE.minMonthsSmallBusiness} months in a small business` },
          { k: "Employer replies in", v: `${EMPLOYEE_CHOICE.responseDays} days`, s: "In writing, after consulting you" },
          { k: "Casual loading", v: loading, s: "Stops when you become permanent" },
          { k: "Break-even", v: `${c.breakEvenWeeks} weeks`, s: "A full-time casual's paid weeks to match permanent pay" },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="what-is-casual">What Makes You a Casual Employee</H2>
            <p>
              A person is a casual employee if, when they start, there is no firm advance commitment to ongoing work, and they are entitled to a casual loading or a specific casual pay rate under an award, agreement or contract. Whether there is a firm advance commitment depends on the real substance of the arrangement: whether the employer can offer or not offer work and you can accept or reject it, whether there is likely to be future work of the kind you do, whether permanent staff do the same work, and whether you have a regular pattern of work. A regular pattern on its own does not make you permanent, and not every factor has to be met.
            </p>
            <p>
              Under the National Employment Standards, casuals get a pathway to permanent employment, 2 days of unpaid carer&rsquo;s leave and 2 days of unpaid compassionate leave each occasion, 10 days of paid family and domestic violence leave a year, and unpaid community service leave. Full-time and part-time employees also get paid leave and notice (<a href={SRC.casual} target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a>).
            </p>
          </section>

          <section>
            <H2 id="how-to-convert">How to Change to Permanent: the Employee Choice Pathway</H2>
            <ol>
              <li><strong>Check you are eligible.</strong> You have been employed at least {EMPLOYEE_CHOICE.minMonths} months ({EMPLOYEE_CHOICE.minMonthsSmallBusiness} months if your employer is a small business) and you believe you no longer meet the casual definition. You cannot give notice during an ongoing dispute about it, or if in the last 6 months your employer refused a previous notice or you resolved a dispute about it.</li>
              <li><strong>Give written notice.</strong> The Fair Work Ombudsman provides a checklist and notification template.</li>
              <li><strong>Your employer consults you,</strong> then responds in writing within {EMPLOYEE_CHOICE.responseDays} days, either accepting or not accepting.</li>
              <li><strong>If accepted,</strong> the response states whether you will be full-time or part-time, your new hours, and when the change starts. It takes effect from the first day of your first full pay period starting after the response, unless you agree another day.</li>
              <li><strong>If refused,</strong> the employer must give reasons in writing, and the reasons can only be those below.</li>
            </ol>
            <DataTable
              head={["Permitted reasons to refuse"]}
              rows={[
                ["You still meet the definition of a casual employee"],
                ["Fair and reasonable operational grounds: substantial changes to how work is organised, significant impact on the business, or substantial changes to your conditions needed to comply with an award or agreement"],
                ["Accepting would mean not complying with a recruitment or selection process required by law"],
              ]}
              caption={<>Fair Work Ombudsman, <a href={SRC.becoming} target="_blank" rel="noopener noreferrer">Becoming a permanent employee</a> (content last updated 7 August 2026), read {CASUAL_CONVERSION_VERIFIED_ON}.</>}
            />
            <p>
              The employee choice pathway replaced the old &ldquo;casual conversion&rdquo; rules on {EMPLOYEE_CHOICE.startDate}. Employment before that date is not counted towards the {EMPLOYEE_CHOICE.minMonths} or {EMPLOYEE_CHOICE.minMonthsSmallBusiness} months. You can also become permanent at any time if you and your employer simply agree. Your employer cannot reduce your hours, change your pattern of work or end your employment to avoid your right, and you are protected from adverse action for exercising it.
            </p>
          </section>

          <section>
            <H2 id="pay-comparison">What Happens to Your Pay</H2>
            <p>
              A casual&rsquo;s hourly rate is the base rate plus the {loading} casual loading. Becoming permanent removes the loading and adds paid annual leave, paid sick and carer&rsquo;s leave, paid public holidays you would have worked, and notice and redundancy entitlements. So the same base rate pays a permanent employee for all 52 weeks, with leave inside it, while a casual is paid only for the weeks worked.
            </p>
            <p>
              Take a {formatAUD(base)} an hour base rate, 38 hours a week. A casual is paid {formatAUD(c.casualRate, 2)} an hour. A permanent employee is paid {formatAUD(c.permanentAnnual)} a year for 52 weeks. The casual would need to be paid for <strong>{c.breakEvenWeeks} weeks</strong> (52 ÷ {(1 + EMPLOYMENT.casualLoading).toFixed(2)}) to earn the same.
            </p>
            <DataTable
              head={["Paid weeks in the year", "Casual gross", "Permanent gross", "Casual ahead or behind"]}
              align={["l", "r", "r", "r"]}
              rows={WEEKS.map((w) => {
                const r = compareCasualToPermanent(base, 38, w);
                return [`${w} weeks`, formatAUD(r.casualAnnualAtWeeks), formatAUD(r.permanentAnnual), `${r.difference >= 0 ? "+" : "−"}${formatAUD(Math.abs(r.difference))}`];
              })}
              caption={`${formatAUD(base)} an hour base, 38 hours a week, ${loading} casual loading. Gross pay only: both receive super and are taxed on the same scale. The permanent figure includes paid leave and public holidays.`}
            />
            <p>
              The comparison counts only pay. It ignores paid sick leave, which a casual does not get, notice, redundancy pay, and the security of regular hours, which have value but are hard to price. To see the loading and what it would be worth against permanent pay for your own rate, use the <Link href="/casual-loading-calculator/">casual loading calculator</Link>, and see <Link href="/full-time-vs-part-time-vs-casual/">full-time vs part-time vs casual</Link> for the entitlements side by side.
            </p>
          </section>

          <section>
            <H2 id="on-your-payslip">What Changes on Your Payslip</H2>
            <ul>
              <li><strong>The casual loading line disappears</strong> and your hourly rate drops to the base rate, unless your award or agreement sets otherwise.</li>
              <li><strong>Leave balances start.</strong> Annual leave builds at 1 hour for every 13 hours worked (<Link href="/annual-leave-calculator/">annual leave calculator</Link>) and sick leave at 1 hour for every 26 (<Link href="/sick-leave-calculator/">sick leave calculator</Link>).</li>
              <li><strong>Your hours are fixed in writing</strong> in the employer&rsquo;s response, so you can check them against your award&rsquo;s minimum engagement and your <Link href="/understanding-your-payslip/">payslip</Link>.</li>
              <li><strong>Net pay per period becomes steadier.</strong> See the <Link href="/net-pay-calculator/">net pay calculator</Link> to compare your take-home on each footing.</li>
            </ul>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/casual-loading-calculator/">Casual Loading Calculator</Link>: the {loading} loading against permanent pay</li>
              <li><Link href="/full-time-vs-part-time-vs-casual/">Full-Time vs Part-Time vs Casual</Link>: entitlements compared</li>
              <li><Link href="/employment-type-calculator/">Employment Type Calculator</Link>: employee or contractor</li>
              <li><Link href="/annual-leave-calculator/">Annual Leave Calculator</Link>: how permanent leave builds</li>
              <li><Link href="/junior-pay-rates/">Junior Pay Rates</Link>: base rates by age</li>
            </ul>
          </section>

          <FaqSection faqs={CASUAL_CONVERSION_FAQS} label="Casual conversion" />

          <PageFooter
            slug="casual-conversion"
            lastVerified={CASUAL_CONVERSION_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>The eligibility, notice and response rules are those the Fair Work Ombudsman publishes for the employee choice pathway (Fair Work Act ss 66A–66M). The pay comparison uses the same base rate and weekly hours for both: casual pay = base × (1 + {loading}) × hours × weeks paid; permanent pay = base × hours × 52, which includes paid leave. Break-even weeks = 52 ÷ (1 + loading), {c.breakEvenWeeks} at {loading}.</p>
              <p>The 25% loading is the most common rate under modern awards; yours may differ. The comparison excludes super (paid to both), tax, and entitlements such as sick leave, notice and redundancy pay. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/casual-loading-calculator/", label: "Casual Loading Calculator" },
          { href: "/full-time-vs-part-time-vs-casual/", label: "Full-Time vs Part-Time vs Casual" },
          { href: "/annual-leave-calculator/", label: "Annual Leave Calculator" },
          { href: "/sick-leave-calculator/", label: "Sick Leave Calculator" },
          { href: "/understanding-your-payslip/", label: "Understanding Your Payslip" },
        ]} />
      </div>
    </div></div>
  );
}

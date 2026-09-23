import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES } from "@/lib/constants";
import { MODERN_AWARDS } from "@/lib/constants/modern-awards";
import {
  FWC_TOIL_TEMPLATE_URL,
  FWO_OVERTIME_URL,
  TOIL_AWARD_RULES,
  TOIL_VERIFIED_ON,
} from "@/lib/constants/time-in-lieu";
import TimeInLieuCalculator from "@/modules/calculator/time-in-lieu-calculator";
import { TIME_IN_LIEU_FAQS } from "./time-in-lieu-faqs";
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

const FWO_MAX_HOURS =
  "https://www.fairwork.gov.au/tools-and-resources/fact-sheets/minimum-workplace-entitlements/maximum-weekly-hours";

const SOURCES_LIST: SourceLink[] = [
  { title: "Overtime pay – time off instead of overtime pay", url: FWO_OVERTIME_URL, publisher: SOURCES.fwo.name },
  { title: "Maximum weekly hours fact sheet", url: FWO_MAX_HOURS, publisher: SOURCES.fwo.name },
  ...TOIL_AWARD_RULES.map((r) => ({ title: `${r.name} (${r.code}), ${r.clause}`, url: r.awardTextUrl, publisher: SOURCES.fwc.name })),
  { title: "Agreement for time off instead of payment for overtime (template)", url: FWC_TOIL_TEMPLATE_URL, publisher: SOURCES.fwc.name },
];

const equivalent = TOIL_AWARD_RULES.filter((r) => r.basis === "overtime-equivalent");
const hourForHour = TOIL_AWARD_RULES.filter((r) => r.basis === "hour-for-hour");
const names = (rs: typeof TOIL_AWARD_RULES) => rs.map((r) => r.shortName.replace(" Award", "")).join(", ");
const CLERKS_OT = MODERN_AWARDS.clerks.overtime;

export default function TimeInLieuPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/overtime-penalty-rates-guide/", label: "Overtime & Penalty Rates" }, { label: "Time in Lieu" }]} />

      <PageHeader title="Time in Lieu (TOIL): Rules, Rates and Calculator">
        <p>
          <strong>Time in lieu is paid time off you take instead of overtime pay.</strong> It isn&rsquo;t a National Employment Standards entitlement: you get it only if your award, enterprise agreement or contract allows it, and you agree to it. Under most awards it must be in writing, taken within 6 months, and paid out at the overtime rate if it isn&rsquo;t. The ratio differs: {names(hourForHour)} give an hour off per overtime hour, while {names(equivalent)} give time equal to the overtime payment (2 hours at 150% = 3 hours off).
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "NES entitlement", v: "None", s: "Comes from your award, agreement or contract" },
          { k: "Hour for hour", v: `${hourForHour.length} awards`, s: names(hourForHour) },
          { k: "At the overtime rate", v: `${equivalent.length} awards`, s: `${names(equivalent)}: 2 h at 150% = 3 h off` },
          { k: "Use it within", v: "6 months", s: "3 months under SCHADS, then paid at overtime rates" },
        ]}
      />

      <div className="mb-12"><TimeInLieuCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="ratio">Is Time in Lieu Hour for Hour or Time and a Half?</H2>
            <p>Each award&rsquo;s &ldquo;time off instead of payment for overtime&rdquo; clause answers this differently. We read the clause in each of the awards below:</p>
            <DataTable
              head={["Award", "Clause", "Time off for 2 h at 150%", "Take it within", "In writing?"]}
              rows={TOIL_AWARD_RULES.map((r) => [
                <Link key={r.code} href={r.href}>{r.shortName}</Link>,
                r.clause,
                r.basis === "hour-for-hour" ? "2 hours (hour for hour)" : "3 hours (overtime rate)",
                `${r.windowMonths} months`,
                r.inWriting ? (r.separateAgreementPerPeriod ? "Yes, each pay period" : "Yes") : "Not stated",
              ])}
              caption={<>Award text at awards.fairwork.gov.au, read {TOIL_VERIFIED_ON}. The Fair Work Ombudsman&rsquo;s <a href={FWO_OVERTIME_URL} target="_blank" rel="noopener noreferrer">overtime pay page</a> has the clause for other awards.</>}
            />
            <p>
              The difference is real money. On an hour-for-hour clause, 2 hours of overtime at time and a half buys 2 hours off, worth a third less than the overtime pay. On an overtime-rate clause it buys 3 hours, the same value as the overtime pay.
            </p>
          </section>

          <section>
            <H2 id="rules">The Rules Every TOIL Clause Shares</H2>
            <ul>
              <li><strong>It must be agreed.</strong> Your employer can&rsquo;t impose it and &ldquo;must not exert undue influence or undue pressure&rdquo; on your decision. You can also ask for it as a flexible working arrangement request (section 65 of the Fair Work Act).</li>
              <li><strong>It covers overtime already worked.</strong> The hour-for-hour clauses need a separate agreement for each pay period&rsquo;s overtime, stating the hours and when you worked them.</li>
              <li><strong>It has a deadline.</strong> Time off must be taken at an agreed time within 6 months of the overtime (3 months under the SCHADS award).</li>
              <li><strong>Untaken TOIL is paid at overtime rates:</strong> in the next pay period after the deadline, in the next pay period after you ask, or in your final pay if you leave.</li>
              <li><strong>Your employer keeps a copy</strong> of the agreement as an employee record.</li>
            </ul>
          </section>

          <section>
            <H2 id="agreement">What the Written Agreement Must Say</H2>
            <p>The Clerks Award (cl 23.3) is typical. The agreement must state:</p>
            <ol>
              <li>the number of overtime hours it covers and when they were worked;</li>
              <li>that you and your employer agree you may take time off instead of being paid for them;</li>
              <li>that if you ask at any time, you must be paid for any of those hours not yet taken, at the overtime rate that applied when you worked them; and</li>
              <li>that the payment will be made in the next pay period after you ask.</li>
            </ol>
            <p>Awards include a sample agreement (Schedule E of the Clerks Award; Schedule D of the Security Award, which links to the Fair Work Commission&rsquo;s <a href={FWC_TOIL_TEMPLATE_URL} target="_blank" rel="noopener noreferrer">template TOIL agreement</a>). You don&rsquo;t have to use it, and an exchange of emails counts.</p>
          </section>

          <section>
            <H2 id="overtime-rates">What &ldquo;the Overtime Rate&rdquo; Means</H2>
            <p>Payouts use the overtime rate for when the hours were worked. Under the Clerks Award, for full-time and part-time staff, that is:</p>
            <DataTable
              head={["When", "Overtime rate"]}
              align={["l", "r"]}
              rows={CLERKS_OT.map((o) => [o.label, `${Math.round(o.fullTime * 100)}%`])}
              caption={<>Clerks Award {MODERN_AWARDS.clerks.overtimeClause}. Other awards: see our <Link href="/overtime-penalty-rates-guide/">overtime and penalty rates guide</Link> or work out a shift in the <Link href="/overtime-pay-calculator/">overtime pay calculator</Link>.</>}
            />
          </section>

          <section>
            <H2 id="agreements-contracts">Enterprise Agreements and Award-Free Jobs</H2>
            <p>
              If an <Link href="/enterprise-agreement/">enterprise agreement</Link> covers you, its own TOIL clause applies instead of the award&rsquo;s, and it can set a different ratio or deadline. Search the agreement for &ldquo;time off instead of&rdquo; or &ldquo;TOIL&rdquo;.
            </p>
            <p>
              If you&rsquo;re award and agreement free, the Fair Work Act doesn&rsquo;t give you a higher rate for overtime (<a href={FWO_MAX_HOURS} target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a>), so TOIL depends entirely on your contract. The hours you&rsquo;re asked to work still have to be reasonable.
            </p>
          </section>

          <section>
            <H2 id="payslip">Time in Lieu on Your Payslip</H2>
            <p>
              Hours taken as TOIL are paid at your ordinary rate, so a TOIL day looks like a normal day on your payslip, often shown as its own line with a running balance. When untaken TOIL is paid out, it should be paid at the overtime rate that applied when you worked it, not your ordinary rate. Check the balance against your own record of hours. The <Link href="/work-hours-calculator/">work hours calculator</Link> can total a timesheet.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/overtime-pay-calculator/">Overtime Pay Calculator</Link>: overtime and penalty pay for a shift</li>
              <li><Link href="/overtime-penalty-rates-guide/">Overtime and Penalty Rates Guide</Link>: rates by award</li>
              <li><Link href="/leave-loading-calculator/">Leave Loading Calculator</Link>: 17.5% loading on annual leave</li>
              <li><Link href="/final-pay-calculator/">Final Pay Calculator</Link>: what you&rsquo;re owed when you leave</li>
              <li><Link href="/award-rates/">Award Rates</Link>: find your award</li>
            </ul>
          </section>

          <FaqSection faqs={TIME_IN_LIEU_FAQS} label="Time in lieu" />

          <PageFooter
            slug="time-in-lieu"
            lastVerified={TOIL_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Overtime pay is hours × multiplier × your ordinary hourly rate. Time off is the overtime hours (hour-for-hour clauses) or hours × multiplier (overtime-rate clauses), as each award&rsquo;s clause states. We value time off at your ordinary rate, because that is what you are paid for a TOIL hour.</p>
              <p>Each award&rsquo;s basis, deadline and writing requirement was read from the consolidated award text on {TOIL_VERIFIED_ON}. General information, not advice: your enterprise agreement or contract may differ.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
          { href: "/overtime-penalty-rates-guide/", label: "Penalty Rates Guide" },
          { href: "/leave-loading-calculator/", label: "Leave Loading Calculator" },
          { href: "/enterprise-agreement/", label: "Find Your Enterprise Agreement" },
          { href: "/final-pay-calculator/", label: "Final Pay Calculator" },
        ]} />
      </div>
    </div></div>
  );
}

import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES, SUPER_GUARANTEE, formatAUD, formatPercent } from "@/lib/constants";
import {
  COMMON_LEAVE_LOADING,
  LEAVE_LOADING_RULES,
  LEAVE_LOADING_SOURCES,
  LEAVE_LOADING_VERIFIED_ON,
  TERMINATION_LOADING_WITHHOLDING,
  leaveLoading,
  type LoadingMethod,
} from "@/lib/constants/leave-loading";
import { RETAIL_RATES, RETAIL_PENALTIES } from "@/lib/constants/hospitality-award";
import { MODERN_AWARDS, findAwardRate } from "@/lib/constants/modern-awards";
import LeaveLoadingCalculator from "@/modules/calculator/leave-loading-calculator";
import { LEAVE_LOADING_FAQS } from "./leave-loading-faqs";
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
  { title: "Annual leave loading in awards and agreements (K600323)", url: LEAVE_LOADING_SOURCES.fwoLibrary, publisher: SOURCES.fwo.name },
  { title: "Payment for annual leave", url: LEAVE_LOADING_SOURCES.fwoPayment, publisher: SOURCES.fwo.name },
  { title: "Schedule 1 – Allowances, leave and other payments (QC107116)", url: LEAVE_LOADING_SOURCES.atoSchedule1Leave, publisher: SOURCES.ato.name },
  { title: "Schedule 7 – Tax table for unused leave payments on termination", url: LEAVE_LOADING_SOURCES.atoSchedule7, publisher: SOURCES.ato.name },
  { title: "What payments are qualifying earnings (QC105843)", url: LEAVE_LOADING_SOURCES.atoQualifyingEarnings, publisher: SOURCES.ato.name },
  ...LEAVE_LOADING_RULES.map((r) => ({ title: `${r.shortName} (${r.code}), ${r.clause}`, url: r.awardTextUrl, publisher: SOURCES.fwc.name })),
];

const METHOD_LABEL: Record<LoadingMethod, string> = {
  flat: "Flat 17.5%",
  "greater-of-penalties": "17.5% or penalties, whichever is higher",
  "greater-of-earnings": "Higher of normal earnings or base + 17.5%",
};

const LOADING = formatPercent(COMMON_LEAVE_LOADING, 1);
const SG = formatPercent(SUPER_GUARANTEE.rate, 0);

// Worked examples, computed from the award constants.
const RETAIL_L1 = RETAIL_RATES.find((r) => r.level === "Level 1")!;
const retailPremium = 8 * RETAIL_L1.hourly * (RETAIL_PENALTIES.saturday - 1) + 8 * RETAIL_L1.hourly * (RETAIL_PENALTIES.sunday - 1);
const retailEx = leaveLoading({ hourlyRate: RETAIL_L1.hourly, weeklyHours: 38, weeks: 1, method: "greater-of-penalties", weeklyPenaltyPremium: retailPremium });
const CLERKS = MODERN_AWARDS.clerks;
const CLERKS_L3 = findAwardRate(CLERKS, "Level 3");
const clerksSun = CLERKS.matrix.find((m) => m.label === "Sunday")!.fullTime;
const clerksSat = CLERKS.matrix.find((m) => m.label === "Saturday")!.fullTime;
const clerksPremium = 8 * CLERKS_L3.hourly * (clerksSat - 1) + 8 * CLERKS_L3.hourly * (clerksSun - 1);
const clerksEx = leaveLoading({ hourlyRate: CLERKS_L3.hourly, weeklyHours: 38, weeks: 1, method: "greater-of-penalties", weeklyPenaltyPremium: clerksPremium });
const fourWeeks = leaveLoading({ hourlyRate: 30, weeklyHours: 38, weeks: 4, method: "flat" });

export default function LeaveLoadingPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/annual-leave-guide/", label: "Annual Leave" }, { label: "Leave Loading Calculator" }]} />

      <PageHeader title="Leave Loading Calculator: 17.5% Explained">
        <p>
          <strong>Leave loading is an extra {LOADING} of your base pay, paid on top of your annual leave.</strong> It comes from your award or enterprise agreement, not the National Employment Standards. Many awards pay the higher of {LOADING} or the weekend and shift penalties you would have earned. It&rsquo;s taxed like wages, attracts super, and is paid out with unused leave when you leave. Four weeks at $30 an hour, 38 hours a week, carries {formatAUD(fourWeeks.flatLoading)} of loading.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Standard loading", v: LOADING, s: "Of base pay for the leave period" },
          { k: "NES entitlement", v: "No", s: "Award, agreement or contract only" },
          { k: "Tax", v: "As wages", s: "Schedule 5 if paid as a lump sum" },
          { k: "Super", v: SG, s: "Unless it replaces lost overtime" },
        ]}
      />

      <div className="mb-12"><LeaveLoadingCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="how">How to Calculate Leave Loading</H2>
            <p>Take your base pay for the leave and multiply by {LOADING}:</p>
            <ol>
              <li>Leave pay: $30 × 38 hours × 4 weeks = {formatAUD(fourWeeks.basePay)}</li>
              <li>Leave loading: {formatAUD(fourWeeks.basePay)} × {LOADING} = <strong>{formatAUD(fourWeeks.flatLoading)}</strong></li>
              <li>Total before tax: <strong>{formatAUD(fourWeeks.totalLeavePay)}</strong></li>
            </ol>
            <p>Base pay means your ordinary rate for your ordinary hours. Whether an above-award rate counts depends on the clause: the Hospitality Award calculates the loading on the amount payable under the NES, which includes an above-award base rate, while awards that calculate it on &ldquo;the minimum hourly rate&rdquo; use the award rate.</p>
          </section>

          <section>
            <H2 id="awards">Which Awards Pay Leave Loading, and How</H2>
            <DataTable
              head={["Award", "Clause", "Day workers", "Shiftworkers"]}
              rows={LEAVE_LOADING_RULES.map((r) => [
                <Link key={r.code} href={r.href}>{r.shortName}</Link>,
                r.clause,
                METHOD_LABEL[r.dayWork],
                METHOD_LABEL[r.shiftwork],
              ])}
              caption={<>Read from each award at awards.fairwork.gov.au on {LEAVE_LOADING_VERIFIED_ON}. Enterprise agreements set their own rule: check yours with our <Link href="/enterprise-agreement/">guide to finding your enterprise agreement</Link>.</>}
            />
            <ul>
              {LEAVE_LOADING_RULES.map((r) => (
                <li key={r.code}><strong>{r.shortName}:</strong> {r.summary}</li>
              ))}
            </ul>
          </section>

          <section>
            <H2 id="higher">17.5% or Penalty Rates: Whichever Is Higher</H2>
            <p>The loading exists so people who usually earn weekend or shift penalties don&rsquo;t take a pay cut on holidays. Where the award compares the two, the employer works out both amounts and pays the larger, never both.</p>
            <DataTable
              head={["Example (one week of leave)", "17.5% loading", "Weekend penalties", "Paid"]}
              align={["l", "r", "r", "r"]}
              rows={[
                [`Retail Level 1 (${formatAUD(RETAIL_L1.hourly, 2)}/h), 8 h Saturday at ${Math.round(RETAIL_PENALTIES.saturday * 100)}% + 8 h Sunday at ${Math.round(RETAIL_PENALTIES.sunday * 100)}%`, formatAUD(retailEx.flatLoading, 2), formatAUD(retailEx.penaltyAlternative, 2), `${formatAUD(retailEx.loadingPaid, 2)} (${retailEx.paidAs})`],
                [`Clerks Level 3 (${formatAUD(CLERKS_L3.hourly, 2)}/h), 8 h Saturday at ${Math.round(clerksSat * 100)}% + 8 h Sunday at ${Math.round(clerksSun * 100)}%`, formatAUD(clerksEx.flatLoading, 2), formatAUD(clerksEx.penaltyAlternative, 2), `${formatAUD(clerksEx.loadingPaid, 2)} (${clerksEx.paidAs})`],
              ]}
              caption="38 ordinary hours a week, 16 of them on the weekend. Penalties are the dollars above the base rate. Clerks Sunday ordinary hours arise only where cl 13.5 applies."
            />
          </section>

          <section>
            <H2 id="tax">Is Leave Loading Taxed?</H2>
            <p>Yes, as ordinary income. How much is withheld depends on how it&rsquo;s paid (ATO Schedule 1, <a href={LEAVE_LOADING_SOURCES.atoSchedule1Leave} target="_blank" rel="noopener noreferrer">allowances, leave and other payments</a>):</p>
            <ul>
              <li><strong>With your leave:</strong> the loading is added to that period&rsquo;s earnings and withheld from using the normal <Link href="/payg-withholding-tables/">tax tables</Link>. A bigger pay in one period means more withheld that period.</li>
              <li><strong>As a lump sum</strong> (for example once a year): the employer uses <Link href="/schedule-5-tax-table/">Schedule 5</Link>, the method for back pay and bonuses. The calculator above shows the result.</li>
              <li><strong>Paid out when you leave</strong> (ATO <a href={LEAVE_LOADING_SOURCES.atoSchedule7} target="_blank" rel="noopener noreferrer">Schedule 7</a>): on a normal resignation, loading on leave accrued after 17 August 1993 is withheld at {TERMINATION_LOADING_WITHHOLDING.normalPost1993.toLowerCase()}; before that date, {TERMINATION_LOADING_WITHHOLDING.normalPre1993}. On a genuine redundancy, invalidity or early retirement scheme it is {TERMINATION_LOADING_WITHHOLDING.redundancyInvalidityEarlyRetirement}.</li>
            </ul>
            <p>None of this changes the tax you finally pay: the loading is part of your income for the year and your tax return squares it up. See the <Link href="/income-tax-calculator/">income tax calculator</Link>.</p>
          </section>

          <section>
            <H2 id="super">Super on Leave Loading</H2>
            <p>The ATO counts annual leave loading as ordinary time earnings, so your employer pays the {SG} super guarantee on it, unless the loading is demonstrably linked to a lost opportunity to work overtime. Payday Super (from 1 July 2026) didn&rsquo;t change that: see <Link href="/payday-super/">Payday Super</Link>.</p>
          </section>

          <section>
            <H2 id="termination">Leave Loading When You Leave a Job</H2>
            <p>Unused annual leave must be paid out as if you had taken it, including any loading, penalty rates or shift loading that would have applied, even if a contract says otherwise (<a href={LEAVE_LOADING_SOURCES.fwoPayment} target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a>). The Hospitality Award says in terms that its 17.5% applies to untaken leave paid on termination. One exception: under the Security Award (cl 21.3(c)) the 17.5% is not paid on termination if you were dismissed for misconduct.</p>
            <p>Add it all up with the <Link href="/final-pay-calculator/">final pay calculator</Link>, or the <Link href="/redundancy-pay-calculator/">redundancy pay calculator</Link> if your job was made redundant.</p>
          </section>

          <section>
            <H2 id="exceptions">When Leave Loading Doesn&rsquo;t Apply</H2>
            <ul>
              <li><strong>Casuals</strong> don&rsquo;t get paid annual leave, so there&rsquo;s no loading. The 25% casual loading is paid instead: compare them with the <Link href="/casual-loading-calculator/">casual loading calculator</Link>.</li>
              <li><strong>Award-free employees</strong> get it only if their contract provides it.</li>
              <li><strong>Annualised salaries</strong> permitted by the award or agreement can absorb the loading, as can an individual flexibility arrangement or a contractual offsetting arrangement (<a href={LEAVE_LOADING_SOURCES.fwoLibrary} target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a>).</li>
              <li><strong>Enterprise agreements</strong> may roll the loading into higher base rates. The agreement had to pass the better off overall test against the award when it was approved.</li>
            </ul>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/leave-calculator/">Annual Leave Calculator</Link>: accrual and payout value</li>
              <li><Link href="/annual-leave-guide/">Annual Leave Guide</Link>: the NES rules</li>
              <li><Link href="/final-pay-calculator/">Final Pay Calculator</Link>: leave paid out when you finish</li>
              <li><Link href="/time-in-lieu/">Time in Lieu</Link>: TOIL instead of overtime pay</li>
              <li><Link href="/overtime-penalty-rates-guide/">Penalty Rates Guide</Link>: the weekend rates the loading is compared with</li>
            </ul>
          </section>

          <FaqSection faqs={LEAVE_LOADING_FAQS} label="Leave loading" />

          <PageFooter
            slug="leave-loading-calculator"
            lastVerified={LEAVE_LOADING_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Leave pay = base hourly rate × ordinary weekly hours × weeks of leave. The loading is {LOADING} of that. Where your award compares it with penalties, we compare it with the weekend (and weekday shift) penalty dollars above base that you would have earned in the same weeks and pay the larger. Lump-sum withholding uses ATO Schedule 5 Method B(ii) with the tax-free threshold claimed, from the same engine as our Schedule 5 tax table.</p>
              <p>Each award rule was read from the award text on {LEAVE_LOADING_VERIFIED_ON}. Award wording differs in detail (for example what counts as a &ldquo;relevant&rdquo; weekend penalty), so check your own clause. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/leave-calculator/", label: "Annual Leave Calculator" },
          { href: "/final-pay-calculator/", label: "Final Pay Calculator" },
          { href: "/annual-leave-guide/", label: "Annual Leave Guide" },
          { href: "/schedule-5-tax-table/", label: "Schedule 5 Tax Table" },
          { href: "/time-in-lieu/", label: "Time in Lieu (TOIL)" },
        ]} />
      </div>
    </div></div>
  );
}

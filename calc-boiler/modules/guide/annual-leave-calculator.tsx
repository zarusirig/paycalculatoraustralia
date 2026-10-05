import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES, formatAUD } from "@/lib/constants";
import {
  ANNUAL_LEAVE,
  ANNUAL_LEAVE_SOURCES as SRC,
  ANNUAL_LEAVE_VERIFIED_ON,
  annualLeave,
  annualLeaveHoursPerYear,
  leaveHoursPerPayPeriod,
  leavePayoutTax,
} from "@/lib/constants/annual-leave";
import AnnualLeaveCalculator from "@/modules/calculator/annual-leave-calculator";
import { ANNUAL_LEAVE_CALCULATOR_FAQS } from "./annual-leave-calculator-faqs";
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

// /annual-leave-calculator/ — accrual, balance, value and payout tax. This is
// the "while you work here" page; /leave-calculator/ owns the payout-on-leaving
// intent and /annual-leave-guide/ the long-form entitlement guide. Arithmetic
// and sources: lib/constants/annual-leave.ts.

const SOURCES_LIST: SourceLink[] = [
  { title: "Annual leave", url: SRC.overview, publisher: SOURCES.fwo.name },
  { title: "Payment for annual leave", url: SRC.payment, publisher: SOURCES.fwo.name },
  { title: "PAYG withholding Schedule 7: unused leave payments on termination", url: SRC.atoSchedule7, publisher: "Australian Taxation Office" },
  { title: "Fair Work Act 2009, sections 86–90", url: SRC.fwAct, publisher: "Federal Register of Legislation" },
];

const WEEKLY_HOURS = [38, 30.4, 24, 20, 15.2, 11.4] as const;
const fmtH = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2).replace(/0$/, "")}`;

export default function AnnualLeavePage() {
  const FT = annualLeaveHoursPerYear(ANNUAL_LEAVE.standardWeeklyHours);
  const priya = annualLeave({ employment: "full-time", hoursPerWeek: 38, daysPerWeek: 5, weeksWorked: 78, takenHours: 38, baseHourlyRate: 40, includeLoading: true });
  const priyaSalary = Math.round(40 * 38 * 52);
  const normal = leavePayoutTax(priyaSalary, priya.totalValue, "normal-termination");
  const redundancy = leavePayoutTax(priyaSalary, priya.totalValue, "genuine-redundancy");

  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/annual-leave-guide/", label: "Leave" }, { label: "Annual Leave Calculator" }]} />

      <PageHeader title="Annual Leave Calculator Australia: Hours, Balance and Payout">
        <p>
          <strong>Full-time and part-time employees earn 4 weeks of paid annual leave a year, worked out on ordinary hours.</strong> On a 38-hour week that is {FT} hours (20 days), which builds at 1 hour for every 13 hours you work. Enter your hours and service below to see your accrued leave, your balance after leave taken, what it is worth, and the tax if it is paid out when you leave. Casuals do not accrue annual leave but are paid a casual loading instead.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Full-time", v: "4 weeks", s: `${FT} hours a year on a 38-hour week` },
          { k: "Accrual rate", v: "1/13", s: "Of ordinary hours worked, from day one" },
          { k: "Per fortnight", v: `${fmtH(leaveHoursPerPayPeriod(38, 2))} h`, s: "On a 38-hour week" },
          { k: "Casuals", v: "None", s: "Paid a casual loading instead" },
        ]}
      />

      <div className="mb-12"><AnnualLeaveCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="how-much">How Much Annual Leave Do You Get?</H2>
            <p>
              The National Employment Standards give every full-time and part-time employee 4 weeks of paid annual leave for each year of service, based on their ordinary hours of work. You earn it in hours, not days, so the same share of 4 weeks applies however your hours are spread across the week. A 38-hour week earns {FT} hours; the Fair Work Ombudsman&rsquo;s own example is a part-timer on 20 hours a week, who earns 80 hours a year.
            </p>
            <DataTable
              head={["Ordinary hours a week", "Leave a year", "Each week", "Each fortnight"]}
              align={["l", "r", "r", "r"]}
              rows={WEEKLY_HOURS.map((w) => [
                `${w} hours`,
                `${fmtH(annualLeaveHoursPerYear(w))} hours`,
                `${fmtH(leaveHoursPerPayPeriod(w, 1))} hours`,
                `${fmtH(leaveHoursPerPayPeriod(w, 2))} hours`,
              ])}
              caption={<>4 weeks a year ÷ 52 = 1/13 of ordinary hours. Shiftworkers covered by the extra week under their award or agreement earn 5 weeks (190 hours on a 38-hour week). Your award or agreement can give more than the NES, never less.</>}
            />
          </section>

          <section>
            <H2 id="accrual">How Annual Leave Accrues</H2>
            <p>
              Annual leave starts building from your first day, including during a probation period, and builds gradually through the year rather than arriving all at once. It rolls over from year to year if you do not use it. So after six months of full-time work on 38 hours a week you have about 76 hours, and after 18 months about 228 hours before any leave is taken.
            </p>
            <DataTable
              head={["You are on", "Annual leave keeps accruing?"]}
              rows={[
                ["Paid annual, sick and carer's, or family and domestic violence leave", "Yes"],
                ["Community service leave, including jury duty", "Yes"],
                ["Long service leave", "Yes"],
                ["Unpaid annual leave, unpaid sick or carer's leave", "No"],
                ["Unpaid parental leave", "No"],
                ["Annual leave that has been cashed out", "No (for the cashed-out leave)"],
              ]}
              caption={<>Fair Work Ombudsman, <a href={SRC.overview} target="_blank" rel="noopener noreferrer">annual leave</a>, read {ANNUAL_LEAVE_VERIFIED_ON}. Government Parental Leave Pay is not treated as paid leave: you do not accrue annual leave while receiving it and taking unpaid leave from your employer.</>}
            />
          </section>

          <section>
            <H2 id="worked-example">Worked Example: 18 Months on $40 an Hour</H2>
            <p>
              Priya works 38 hours a week at a base rate of $40 an hour (that is {formatAUD(priyaSalary)} a year) and has been there 18 months. She has taken 38 hours of leave. Her award pays 17.5% leave loading.
            </p>
            <ul>
              <li>Leave earned: 38 hours × 78 weeks ÷ 13 = <strong>{fmtH(priya.accruedHours)} hours</strong>.</li>
              <li>Leave taken: {fmtH(priya.takenHours)} hours. Balance: <strong>{fmtH(priya.balanceHours)} hours</strong>, or {fmtH(priya.balanceDays)} days of 7.6 hours.</li>
              <li>Balance at her base rate: {fmtH(priya.balanceHours)} × $40 = {formatAUD(priya.baseValue, 2)}.</li>
              <li>Leave loading: 17.5% × {formatAUD(priya.baseValue, 2)} = {formatAUD(priya.loadingValue, 2)}.</li>
              <li>Value before tax: <strong>{formatAUD(priya.totalValue, 2)}</strong>.</li>
            </ul>
            <p>
              If Priya resigned and was paid this out, it is taxed at her marginal rates: about {formatAUD(normal.tax)} of tax, leaving {formatAUD(normal.net)}. If she were made genuinely redundant, the ATO withholds a flat 32%: {formatAUD(redundancy.tax)}, leaving {formatAUD(redundancy.net)}.
            </p>
          </section>

          <section>
            <H2 id="how-it-is-paid">How Annual Leave Is Paid</H2>
            <p>
              When you take annual leave you are paid your <strong>current base pay rate</strong> for the hours of leave. The base rate leaves out overtime, penalty rates, allowances and bonuses, unless your award or enterprise agreement says otherwise. Many awards add an <strong>annual leave loading</strong>, usually 17.5%, which is not an NES entitlement: some awards pay a flat 17.5%, others pay the higher of 17.5% or the penalty rates you would have earned. Our <Link href="/leave-loading-calculator/">leave loading calculator</Link> works through the rule for each major award.
            </p>
            <p>
              On your <Link href="/understanding-your-payslip/">payslip</Link>, annual leave appears as its own line with a running balance in hours. Check that the balance rises each pay by about {fmtH(leaveHoursPerPayPeriod(38, 2))} hours a fortnight on a 38-hour week. To see what a pay period nets after tax, use the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="tax">Tax on Annual Leave</H2>
            <p>
              Annual leave you take while employed is paid and taxed like your normal pay. The tax question arises when leave is paid out as a lump sum. The ATO&rsquo;s withholding schedule for unused leave on termination (applies to payments from 1 July 2026) sets the treatment:
            </p>
            <DataTable
              head={["Situation", "Annual leave and loading withheld at"]}
              rows={[
                ["Normal termination (resigning, retiring), leave accrued after 17 August 1993", "Marginal rates, as part of salary and wages"],
                ["Normal termination, leave accrued before 18 August 1993", "32%"],
                ["Genuine redundancy, invalidity or early retirement scheme", "32%, whatever the accrual date"],
              ]}
              caption={<>ATO, <a href={SRC.atoSchedule7} target="_blank" rel="noopener noreferrer">PAYG withholding Schedule 7</a>, read {ANNUAL_LEAVE_VERIFIED_ON}. Withholding is an estimate; the final tax is settled when you lodge your return.</>}
            />
            <p>
              Unused leave paid on termination is not ordinary time earnings, so no super guarantee is payable on it. For the whole picture of a final pay, including notice and redundancy, see the <Link href="/final-pay-calculator/">final pay calculator</Link>; to see what leave you have left to be paid out and the loading on it, use the <Link href="/leave-calculator/">leave payout calculator</Link>.
            </p>
          </section>

          <section>
            <H2 id="casuals">Casuals and Annual Leave</H2>
            <p>
              Casual employees do not get paid annual leave. They are paid a casual loading on their hourly rate instead, usually 25%, and can take unpaid time off by agreement. If you work regular hours and no longer fit the definition of a casual, you may be able to move to permanent employment, where annual leave applies. See <Link href="/casual-conversion/">casual conversion</Link> and the <Link href="/casual-loading-calculator/">casual loading calculator</Link>.
            </p>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/annual-leave-guide/">Annual Leave Guide</Link>: cashing out, directions to take leave, shutdowns</li>
              <li><Link href="/leave-calculator/">Leave Payout Calculator</Link>: unused leave paid out when you leave</li>
              <li><Link href="/leave-loading-calculator/">Leave Loading Calculator</Link>: the 17.5% by award</li>
              <li><Link href="/sick-leave-calculator/">Sick Leave Calculator</Link>: personal/carer&rsquo;s leave, 10 days a year</li>
              <li><Link href="/long-service-leave-calculator/">Long Service Leave Calculator</Link>: by state</li>
            </ul>
          </section>

          <FaqSection faqs={ANNUAL_LEAVE_CALCULATOR_FAQS} label="Annual leave" />

          <PageFooter
            slug="annual-leave-calculator"
            lastVerified={ANNUAL_LEAVE_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Annual leave earned = ordinary hours a week × weeks of service × (4 ÷ 52), which is the National Employment Standards entitlement of 4 weeks a year based on ordinary hours (5 weeks for qualifying shiftworkers). The Fair Work Ombudsman&rsquo;s example, 20 hours a week earning 80 hours a year, comes out exactly. Weeks of service = years × 52 + months × 52/12; leave out time on unpaid leave. Balance = earned minus taken, valued at the base hourly rate, with leave loading added at 17.5% if selected.</p>
              <p>Payout tax follows the ATO&rsquo;s Schedule 7: on a normal termination the payout is added to the year&rsquo;s income and taxed at marginal rates with the Medicare levy (the difference between two runs of the site&rsquo;s tax engine); on genuine redundancy a flat 32% is withheld. Your salary for the tax estimate is your hourly rate × weekly hours × 52. National Employment Standards minimum; your award, agreement or contract can give more. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/leave-calculator/", label: "Leave Payout Calculator" },
          { href: "/annual-leave-guide/", label: "Annual Leave Guide" },
          { href: "/leave-loading-calculator/", label: "Leave Loading Calculator" },
          { href: "/final-pay-calculator/", label: "Final Pay Calculator" },
          { href: "/understanding-your-payslip/", label: "Understanding Your Payslip" },
        ]} />
      </div>
    </div></div>
  );
}

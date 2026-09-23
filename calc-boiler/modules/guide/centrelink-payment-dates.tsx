import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES } from "@/lib/constants";
import {
  ALLOWANCE_PAYMENTS,
  CENTRELINK_DATES_SOURCES,
  CENTRELINK_DATES_VERIFIED_ON,
  CHRISTMAS_2025_26,
  CHRISTMAS_2026_27_PUBLISHED,
  HOLIDAYS_2026_27,
  PENSION_PAYMENTS,
  SA_CLOSED_HOLIDAYS,
  daysEarly,
  type PaymentChangeRow,
  type ReportingChangeRow,
} from "@/lib/constants/centrelink-payment-dates";
import { weekdayName } from "@/lib/constants/pay-periods";
import CentrelinkDatesCalculator from "@/modules/calculator/centrelink-dates-calculator";
import { CENTRELINK_DATES_FAQS } from "./centrelink-payment-dates-faqs";
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

// ⚠️ REFRESH: when Services Australia publishes the Christmas 2026 tables, add
// them to lib/constants/centrelink-payment-dates.ts (CHRISTMAS_2026_27), flip
// CHRISTMAS_2026_27_PUBLISHED, and render them above last year's tables.

const SA = SOURCES.servicesAustralia.name;
const SOURCES_LIST: SourceLink[] = [
  { title: "Public holiday reporting and payment dates (QC 26071)", url: CENTRELINK_DATES_SOURCES.holidayPage, publisher: SA },
  { title: "Public holiday reporting and payment dates, Christmas 2025 version (Internet Archive capture, 12 December 2025)", url: CENTRELINK_DATES_SOURCES.holidayPage2025Archive, publisher: SA },
  { title: "Holiday changes to Centrelink, Medicare and Child Support services (media release, 8 December 2025)", url: CENTRELINK_DATES_SOURCES.mediaRelease2025, publisher: SA },
  { title: "When to report (QC 53206)", url: CENTRELINK_DATES_SOURCES.whenToReport, publisher: SA },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const d = (iso: string) => {
  const [y, m, day] = iso.split("-").map(Number);
  return `${weekdayName(iso)} ${day} ${MONTHS[m - 1]} ${y}`;
};

const S = CHRISTMAS_2025_26;
const maxEarly = Math.max(...[...S.allowances.noReport, ...S.pensions.noReport].map(daysEarly));

function ReportTable({ rows, caption }: { rows: readonly ReportingChangeRow[]; caption: string }) {
  return (
    <DataTable
      head={["Normal reporting date", "New reporting date", "Revised payment date", "Next payment date"]}
      rows={rows.map((r) => [d(r.normalReporting), d(r.newReporting), d(r.revisedPayment), d(r.nextPayment)])}
      caption={caption}
    />
  );
}

function PayTable({ rows, caption }: { rows: readonly PaymentChangeRow[]; caption: string }) {
  return (
    <DataTable
      head={["Normal payment date", "Revised payment date", "Next payment date"]}
      rows={rows.map((r) => [d(r.normalPayment), d(r.revisedPayment), d(r.nextPayment)])}
      caption={caption}
    />
  );
}

const LAST_YEAR = `Christmas 2025 – New Year 2026, as published by Services Australia (page version dated ${S.pageLastUpdated}). Last year's dates, shown for reference: they are not the 2026 dates.`;

export default function CentrelinkPaymentDatesPage() {
  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/centrelink-income-test/", label: "Centrelink Income Test" }, { label: "Centrelink Payment Dates" }]} />

      <PageHeader title="Centrelink Payment Dates and Christmas 2026 Changes">
        <p>
          <strong>Centrelink pays most payments every 2 weeks on your own fortnightly cycle, so there is no single payment date for everyone.</strong> Your payment and reporting dates are in your Centrelink online account. Services Australia doesn&rsquo;t delay payments for public holidays; it may pay you <em>early</em> instead.{" "}
          {CHRISTMAS_2026_27_PUBLISHED
            ? "The Christmas 2026 dates are below."
            : `The Christmas 2026 dates haven't been published yet (checked ${CENTRELINK_DATES_VERIFIED_ON}); below are last year's official tables so you can see how the changes work.`}
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Payment cycle", v: "2 weeks", s: "Weekly option for some" },
          { k: "Report by", v: "5 pm", s: "On your reporting date" },
          { k: "Christmas 2026 dates", v: CHRISTMAS_2026_27_PUBLISHED ? "Published" : "Not yet", s: `Checked ${CENTRELINK_DATES_VERIFIED_ON}` },
          { k: "Christmas 2025", v: `Up to ${maxEarly} days early`, s: "No-report payments: earlier, never later" },
        ]}
      />

      <div className="mb-12"><CentrelinkDatesCalculator /></div>

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="how">How Centrelink Payment Dates Work</H2>
            <p>Most Centrelink payments, including JobSeeker Payment, Youth Allowance, Parenting Payment and Age Pension, are paid every 2 weeks. Each person is on their own fortnightly cycle, so your payment day is the same weekday every fortnight but can differ from someone else&rsquo;s. That is why there is no national &ldquo;Centrelink payday&rdquo;. Some people can ask to be paid <a href={CENTRELINK_DATES_SOURCES.weeklyPaymentOption} target="_blank" rel="noopener noreferrer">weekly</a> instead.</p>
            <p>You can see your future payments and reporting dates in your <a href={CENTRELINK_DATES_SOURCES.onlineAccount} target="_blank" rel="noopener noreferrer">Centrelink online account</a> through myGov or the Express Plus Centrelink app, including your reporting dates for the next 12 weeks.</p>
          </section>

          <section>
            <H2 id="reporting">Centrelink Reporting Dates</H2>
            <p>If you get an income support payment and earn wages, you have <strong>scheduled reporting</strong>: you tell Centrelink your gross employment income for a reporting period, usually 14 days, on your reporting date (<a href={CENTRELINK_DATES_SOURCES.whenToReport} target="_blank" rel="noopener noreferrer">Services Australia</a>).</p>
            <ul>
              <li>Report by <strong>5 pm on your reporting date</strong> so you&rsquo;re paid on time. Each time you report, you&rsquo;re told your next date, and you get an SMS reminder on the day.</li>
              <li>You can&rsquo;t report before your reporting date unless a public holiday moves it.</li>
              <li>If you report late, your payment is late. You can still report online for up to 14 days after your reporting date; after that you have to call.</li>
              <li>If you get a pension or a student payment and aren&rsquo;t working, you generally don&rsquo;t have scheduled reporting. If you start or stop work, tell Centrelink so it can start or stop.</li>
            </ul>
            <p>Report your <strong>gross</strong> pay (before tax), not what lands in your bank. <Link href="/gross-vs-net-pay/">Gross vs net pay</Link> explains the difference, and the <Link href="/centrelink-income-test/">Centrelink income test</Link> shows how that income changes your payment.</p>
          </section>

          <section>
            <H2 id="christmas-2026">Centrelink Christmas Payment Dates 2026</H2>
            {CHRISTMAS_2026_27_PUBLISHED ? (
              <p>Services Australia has published the Christmas 2026 dates. Check the tables below.</p>
            ) : (
              <>
                <p><strong>Not published yet.</strong> As of {CENTRELINK_DATES_VERIFIED_ON}, Services Australia&rsquo;s <a href={CENTRELINK_DATES_SOURCES.holidayPage} target="_blank" rel="noopener noreferrer">public holiday reporting and payment dates</a> page doesn&rsquo;t list any Christmas 2026 changes. Last year&rsquo;s tables were on a version of that page dated 27 October 2025. We&rsquo;ll add the 2026 dates here when they&rsquo;re released. Until then, your online account is the only reliable source for your own dates.</p>
                <p>What we do know is where the public holidays fall:</p>
                <DataTable
                  head={["Holiday", "Date"]}
                  rows={HOLIDAYS_2026_27.slice(0, 4).map((h) => [h.name, d(h.iso)])}
                  caption="Christmas Day is a Friday and Boxing Day a Saturday in 2026, so the Boxing Day public holiday moves to Monday 28 December in most states. Which days Services Australia closes is up to it: in 2025 it also closed on Monday 29 December."
                />
                <p>With Christmas Day and New Year&rsquo;s Day both on a Friday, anyone normally paid or due to report on those days should expect an earlier date. In 2025, every payment and reporting date that fell on Christmas Day, Boxing Day or New Year&rsquo;s Day moved earlier.</p>
              </>
            )}
          </section>

          <section>
            <H2 id="how-changes-work">How the Christmas Changes Work</H2>
            <ul>
              <li><strong>If you have to report:</strong> you&rsquo;ll usually report early. Include what you expect to earn for the rest of the period. If you get it wrong, correct it within 14 days or at your next report. You can also choose to report after the period if you&rsquo;re unsure of your income, and be paid after you report.</li>
              <li><strong>If you don&rsquo;t have to report:</strong> your payment may come early. Services Australia pays before your normal day and as close to it as possible, and it doesn&rsquo;t delay payments because of a public holiday.</li>
              <li><strong>It isn&rsquo;t extra money.</strong> An early payment is your regular payment paid early. Your next payment is on your normal date, so the early one has to stretch further. If you&rsquo;re short, you may be able to get an <Link href="/centrelink-advance-payment/">advance payment</Link>.</li>
              <li><strong>Reporting on a holiday:</strong> you can still report when offices are closed, but if you report on a public holiday you&rsquo;re paid after it.</li>
            </ul>
          </section>

          <section>
            <H2 id="last-year-allowances">Last Year&rsquo;s Dates: JobSeeker, Youth Allowance and Other Allowances</H2>
            <p>These tables applied to {ALLOWANCE_PAYMENTS.join(", ")} over Christmas 2025.</p>
            <h3>If you had to report</h3>
            <ReportTable rows={S.allowances.report} caption={LAST_YEAR} />
            <h3>If you didn&rsquo;t have to report</h3>
            <PayTable rows={S.allowances.noReport} caption={LAST_YEAR} />
          </section>

          <section>
            <H2 id="last-year-pensions">Last Year&rsquo;s Dates for Pensioners and Families</H2>
            <p>These tables applied to {PENSION_PAYMENTS.join(", ")} over Christmas 2025. In the reporting tables, pension payments came later than allowance payments for the same reporting date.</p>
            <h3>If you had to report</h3>
            <ReportTable rows={S.pensions.report} caption={LAST_YEAR} />
            <h3>If you didn&rsquo;t have to report (for example, Age Pension with no work income)</h3>
            <PayTable rows={S.pensions.noReport} caption={LAST_YEAR} />
          </section>

          <section>
            <H2 id="holidays">Other Public Holidays That Change Dates</H2>
            <p>Services Australia closes for {SA_CLOSED_HOLIDAYS.join(", ")}, and publishes changed dates before each one. The rest of 2026-27:</p>
            <DataTable
              head={["Holiday", "Date"]}
              rows={HOLIDAYS_2026_27.slice(4).map((h) => [h.name, d(h.iso)])}
              caption="Anzac Day 2027 falls on a Sunday. Check Services Australia's public holiday page before each holiday."
            />
          </section>

          <section>
            <H2>Centrelink Calculators</H2>
            <ul>
              <li><Link href="/jobseeker-payment-calculator/">JobSeeker Payment Calculator</Link>: your fortnightly rate after the income test</li>
              <li><Link href="/age-pension-income-test-calculator/">Age Pension Income Test Calculator</Link>: including the Work Bonus</li>
              <li><Link href="/parenting-payment-calculator/">Parenting Payment Calculator</Link></li>
              <li><Link href="/austudy-youth-allowance-calculator/">Youth Allowance and Austudy Calculator</Link></li>
              <li><Link href="/carer-payment-calculator/">Carer Payment Calculator</Link></li>
              <li><Link href="/family-tax-benefit-calculator/">Family Tax Benefit Calculator</Link></li>
              <li><Link href="/centrelink-working-credit-calculator/">Working Credit Calculator</Link>: keep more of your payment when you start work</li>
              <li><Link href="/fortnights-in-a-year/">Fortnights in a year</Link>: 26 or 27 pays in 2026-27</li>
            </ul>
          </section>

          <FaqSection faqs={CENTRELINK_DATES_FAQS} label="Centrelink payment dates" />

          <PageFooter
            slug="centrelink-payment-dates"
            lastVerified={CENTRELINK_DATES_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Last year&rsquo;s four tables are transcribed exactly from Services Australia&rsquo;s public holiday reporting and payment dates page as it stood for Christmas 2025 (page version dated {S.pageLastUpdated}, read from the Internet Archive capture of 12 December 2025, because the live page has since moved on). The live page was checked on {CENTRELINK_DATES_VERIFIED_ON} and had no Christmas 2026 dates.</p>
              <p>The date tool steps 14 days from the date you enter and flags dates on 2026-27 national public holidays or between 17 December 2026 and 8 January 2027 (the span last year&rsquo;s changes covered). It can&rsquo;t predict the revised dates. We are not affiliated with Services Australia; general information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/jobseeker-payment-calculator/", label: "JobSeeker Payment Calculator" },
          { href: "/age-pension-income-test-calculator/", label: "Age Pension Calculator" },
          { href: "/centrelink-income-test/", label: "Centrelink Income Test" },
          { href: "/centrelink-advance-payment/", label: "Centrelink Advance Payment" },
          { href: "/cost-of-living-payment-2026/", label: "Cost of Living Payment 2026" },
        ]} />
      </div>
    </div></div>
  );
}

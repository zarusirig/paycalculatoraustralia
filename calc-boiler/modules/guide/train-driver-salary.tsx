import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { afterTax } from "@/lib/data/job-pay-rates";
import { formatSalary, nearestTakeHomeSalary, takeHomeHref } from "@/lib/data/public-service-pay/types";
import {
  DRIVER_TABLES,
  METRO_TRAINS,
  NOT_COVERED,
  SYDNEY_TRAINS,
  TRAIN_DRIVER_FAQS,
  TRAIN_DRIVER_VERIFIED_ON,
  type DriverTable,
} from "@/lib/data/train-driver-pay";
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

// /train-driver-salary/ (J6, wave 4). Figures and sources:
// lib/data/train-driver-pay. After tax: afterTax (the /take-home-pay-on/ engine).

const LINK = "text-eucalyptus-dark hover:underline";
const money = (n: number) => `$${n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;

function OperatorTable({ table }: { table: DriverTable }) {
  const weekly = table.rows.some((r) => r.weekly !== undefined);
  const head = weekly
    ? ["Classification", "Weekly", "Weekly with industry allowance", "A year (derived)", "Take-home a year", "Full breakdown"]
    : ["Classification", "Hourly", "A year", "Take-home a year", "Full breakdown"];
  const align: ("l" | "r")[] = weekly ? ["l", "r", "r", "r", "r", "l"] : ["l", "r", "r", "r", "l"];
  const rows = table.rows.map((r) => [
    <span key="l">{r.label}{r.note ? <span className="block text-xs text-warmgray-light">{r.note}</span> : null}</span>,
    ...(weekly ? [money(r.weekly!), money(r.weeklyWithAllowance!)] : [money(r.hourly!)]),
    formatSalary(r.annual),
    formatSalary(afterTax(r.annual).netAnnual),
    <Link key="t" href={takeHomeHref(r.annual)} className={`${LINK} whitespace-nowrap`}>{formatSalary(nearestTakeHomeSalary(r.annual))} page</Link>,
  ]);
  return <DataTable head={head} align={align} rows={rows} caption={table.caption} />;
}

export default function TrainDriverSalaryPage() {
  const syd = SYDNEY_TRAINS.rows[3];
  const mel = METRO_TRAINS.rows[1];
  const faqs = [...TRAIN_DRIVER_FAQS];
  const sources: SourceLink[] = DRIVER_TABLES.map((t) => ({ title: t.source.title, url: t.source.url, publisher: t.source.publisher }));

  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/job-pay-rates/", label: "Pay Rates by Job" }, { label: "Train Driver Salary" }]} />

      <PageHeader title="Train Driver Salary Australia 2026: Sydney Trains and Metro Melbourne Pay">
        <p>
          <strong>A Sydney Trains driver is paid {money(syd.weekly!)} a week from 1 July 2026, about {formatSalary(syd.annual)} a year, or {money(syd.weeklyWithAllowance!)} a week with the industry allowance. At Metro Trains Melbourne a Qualified Driver Level 1 is paid {formatSalary(mel.annual)} a year, rising to {formatSalary(METRO_TRAINS.rows[2].annual)} at the Qualified Driver (SPOT) rate after 6 months, subject to assessment.</strong> Passenger train drivers are paid under each operator&rsquo;s own enterprise agreement, so the figures below are read from those agreements rather than from an award.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "Sydney Trains driver", v: `${money(syd.weekly!)}/wk`, s: "Driver (thereafter), from 1 Jul 2026" },
          { k: "Metro Melbourne driver", v: formatSalary(mel.annual), s: "Qualified Driver Level 1, Jul 2026" },
          { k: "Sydney trainee", v: `${money(SYDNEY_TRAINS.rows[0].weekly!)}/wk`, s: "1st year trainee" },
          { k: "Melbourne trainee", v: formatSalary(METRO_TRAINS.rows[0].annual), s: "Trainee Driver, Jul 2026" },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          {DRIVER_TABLES.map((t) => (
            <section key={t.id}>
              <H2 id={t.id}>{t.operator} Driver Pay ({t.state})</H2>
              <p>Under the {t.agreement}, from {t.effectiveFrom}. {t.expiry}</p>
              <OperatorTable table={t} />
              <p>{t.payRises}</p>
            </section>
          ))}

          <section>
            <H2 id="after-tax">Train Driver Pay After Tax</H2>
            <p>
              Take-home figures use 2026–27 resident tax rates with the low income tax offset and the Medicare levy, no HECS, on the base rate alone. Actual pay can be higher once shift, weekend and overtime payments under the agreement are added. Enter your own gross in the <Link href="/take-home-pay-calculator/">take-home pay calculator</Link>, or see the <Link href="/overtime-pay-calculator/">overtime pay calculator</Link> for extra shifts.
            </p>
          </section>

          <section>
            <H2 id="not-covered">Operators Not Shown</H2>
            <ul>{NOT_COVERED.map((n) => <li key={n}>{n}</li>)}</ul>
            <p>
              If your operator isn&rsquo;t listed, find its agreement with our <Link href="/enterprise-agreement/">enterprise agreement guide</Link>. Other transport pay is on the <Link href="/job-pay-rates/truck-driver/">truck driver</Link> page and the <Link href="/road-transport-award-rates/">road transport award rates</Link>.
            </p>
          </section>

          <FaqSection faqs={faqs} label="Train driver pay" />

          <PageFooter
            slug="train-driver-salary"
            lastVerified={TRAIN_DRIVER_VERIFIED_ON}
            sources={sources}
            methodology={<>
              <p>Rates are copied from each enterprise agreement&rsquo;s own table for the date shown. Sydney Trains publishes weekly rates, so its annual figure is weekly × 52 and is labelled as derived; Metro Trains publishes annual rates, used as printed.</p>
              <p>General information, not advice: rosters, allowances and penalty rates change what an individual driver earns.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/job-pay-rates/", label: "Pay Rates by Job" },
          { href: "/enterprise-agreement/", label: "Enterprise Agreements" },
          { href: "/pay-calculator-nsw/", label: "NSW Pay Calculator" },
          { href: "/pay-calculator-vic/", label: "VIC Pay Calculator" },
          { href: "/overtime-pay-calculator/", label: "Overtime Pay Calculator" },
        ]} />
      </div>
    </div></div>
  );
}

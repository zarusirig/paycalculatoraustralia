import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import { SOURCES, formatAUD } from "@/lib/constants";
import {
  ALLOWANCES_VERIFIED_ON,
  ALLOWANCE_KINDS,
  ALLOWANCE_SOURCES as SRC,
  JOB_PAY_VERIFIED_ON,
  allowanceRows,
  type AllowanceKind,
  type AllowanceRow,
} from "@/lib/constants/allowances-guide";
import { raiseOutcome } from "@/lib/constants/marginal-rates";
import { ALLOWANCES_GUIDE_FAQS } from "./allowances-guide-faqs";
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

// /allowances-guide/ — first aid, laundry and uniform, tool, split shift and
// on-call allowances. Every amount comes from the award transcriptions in
// lib/data/job-pay-rates/ (see lib/constants/allowances-guide.ts); nothing is
// typed here. Awards we have not transcribed are not listed.

const SOURCES_LIST: SourceLink[] = [
  { title: "Allowances", url: SRC.fwoAllowances, publisher: SOURCES.fwo.name },
  { title: "Pay guides", url: SRC.fwoPayGuides, publisher: SOURCES.fwo.name },
  { title: "Modern awards (consolidated award text)", url: SRC.awards, publisher: "Fair Work Commission" },
];

function awardCell(r: AllowanceRow) {
  return (
    <>
      {r.awardName}
      <span className="block text-xs font-normal text-warmgray-light">{r.awardCode}</span>
    </>
  );
}

function seeRates(r: AllowanceRow) {
  const shown = r.occupations.slice(0, 2);
  const more = r.occupations.length - shown.length;
  return (
    <>
      {shown.map((o, i) => (
        <span key={o.slug}>
          {i > 0 && ", "}
          <Link href={`/job-pay-rates/${o.slug}/`}>{o.name}</Link>
        </span>
      ))}
      {more > 0 && <span className="text-warmgray-light"> and {more} more</span>}
    </>
  );
}

function kindTable(kind: AllowanceKind) {
  const rows = allowanceRows(kind);
  return (
    <DataTable
      head={["Award", "Allowance", "Amount", "When it applies", "Pay rates"]}
      align={["l", "l", "r", "l", "l"]}
      rows={rows.map((r) => [awardCell(r), r.allowance, r.amount, r.note, seeRates(r)])}
      caption={<>Amounts as printed in each award, consolidated to {rows[0]?.consolidatedTo ?? "1 July 2026"} and read on {JOB_PAY_VERIFIED_ON}. Clause numbers are in the &ldquo;when it applies&rdquo; column. Awards are reviewed each year; check the current amount in your award or pay guide.</>}
    />
  );
}

/** The first dollar figure in a row's amount, e.g. "$16.79 per week" gives 16.79. */
function firstDollar(r: AllowanceRow | undefined): number {
  const m = r?.amount.match(/\$([\d,]+(?:\.\d+)?)/);
  return m ? Number(m[1].replace(/,/g, "")) : 0;
}

/** Lowest and highest headline (first) dollar figure across a set of rows. */
function dollarRange(rows: AllowanceRow[]): string {
  const values = rows.map((r) => firstDollar(r)).filter((v) => v > 0);
  if (values.length === 0) return "";
  return `$${Math.min(...values).toFixed(2)}–$${Math.max(...values).toFixed(2)}`;
}

export default function AllowancesGuidePage() {
  const kinds = ALLOWANCE_KINDS.map((k) => ({ ...k, rows: allowanceRows(k.id) }));
  const awardCount = new Set(kinds.flatMap((k) => k.rows.map((r) => r.awardCode))).size;
  const firstAid = kinds.find((k) => k.id === "first-aid")!.rows;
  const splitShift = kinds.find((k) => k.id === "split-shift")!.rows;
  const onCall = kinds.find((k) => k.id === "on-call")!.rows;
  const clerksFirstAid = firstDollar(firstAid.find((r) => r.awardCode === "MA000002"));
  const weeklyOnCall = onCall.find((r) => r.awardCode === "MA000027" && /Monday/.test(r.allowance));
  const example = raiseOutcome({ salary: 70_000, raise: Math.round(clerksFirstAid * 52) });

  return (
    <div className={PAGE_WRAP}><div className={PAGE_INNER}>
      <Breadcrumbs items={[{ href: "/", label: "Pay Calculator" }, { href: "/understanding-your-payslip/", label: "Payslip" }, { label: "Allowances Guide" }]} />

      <PageHeader title="Award Allowances Guide: First Aid, Laundry, Tool, Split Shift and On-Call Rates">
        <p>
          <strong>An allowance is extra pay on top of your base rate for a particular task, condition or expense, and the amount comes from your award or agreement.</strong> This guide lists the current amounts for five common allowances (first aid, laundry and uniform, tools, split or broken shifts, and on-call) across {awardCount} modern awards. Every figure is the amount printed in the award, with the clause, and nothing is estimated. Find your award, check the line on your payslip, and see how allowances are taxed.
        </p>
      </PageHeader>

      <KeyFigures
        items={[
          { k: "First aid", v: dollarRange(firstAid), s: `${firstAid.length} awards, per week, day or shift` },
          { k: "Split shift", v: dollarRange(splitShift), s: "Per day, by award and length of break" },
          { k: "On-call", v: `${formatAUD(firstDollar(weeklyOnCall), 2)}`, s: "Per 24 hours, health professionals (Mon–Sat)" },
          { k: "Awards listed", v: `${awardCount}`, s: `Amounts read ${JOB_PAY_VERIFIED_ON}` },
        ]}
      />

      <div className="flex flex-col lg:flex-row gap-12">
        <article className={ARTICLE_CLASS}>
          <section>
            <H2 id="what-is-an-allowance">What Is an Allowance?</H2>
            <p>
              The Fair Work Ombudsman describes allowances as extra payments to employees who do certain tasks, have a particular skill they use at work, use their own tools, work in unpleasant or hazardous conditions, or incur an expense for doing their job. Common allowances are uniforms and special clothing, tools and equipment, travel, car and phone, first aid, leading hand or supervisor, and industry allowances such as those in building and construction.
            </p>
            <p>
              Which allowances you are owed depends on the award that covers you, or on your enterprise agreement if you have one. Arrangements such as annualised wages, employment contracts and individual flexibility arrangements can change how allowances are paid, but the overall pay still has to be at least what your award would pay (<a href={SRC.fwoAllowances} target="_blank" rel="noopener noreferrer">Fair Work Ombudsman</a>). The tables below show the amounts printed in the awards we cover. If your award is not listed, its pay guide has the current figures.
            </p>
          </section>

          {kinds.map((k) => (
            <section key={k.id}>
              <H2 id={k.id}>{k.title}</H2>
              <p>{k.blurb}</p>
              {kindTable(k.id)}
            </section>
          ))}

          <section>
            <H2 id="on-your-payslip">How Allowances Show Up on Your Payslip and in Your Tax</H2>
            <p>
              A payslip should list each allowance as its own line within your gross pay, so you can check it against the table above. Most allowances are part of gross pay and are taxed like wages. Some, such as a <Link href="/travel-allowance/">travel allowance</Link> within the ATO&rsquo;s reasonable amount or a <Link href="/cents-per-km/">cents per kilometre car allowance</Link>, can be shown separately. Annual leave is paid at your base rate, which does not include allowances unless your award says so (<Link href="/annual-leave-calculator/">annual leave calculator</Link>).
            </p>
            <p>
              For example, a weekly first aid allowance of {formatAUD(clerksFirstAid, 2)} (the Clerks Award) adds about {formatAUD(Math.round(clerksFirstAid * 52))} a year to gross pay. For someone on $70,000 that extra income is taxed at the marginal rate: {formatAUD(example.extraTax)} of tax and Medicare, leaving {formatAUD(example.netGain)} (see <Link href="/marginal-tax-rates/">marginal tax rates</Link>). Your <Link href="/net-pay-calculator/">net pay</Link> rises by less than the allowance.
            </p>
          </section>

          <section>
            <H2 id="check-your-award">Checking You Are Paid the Right Amount</H2>
            <ol>
              <li>Find your award or agreement. The <Link href="/award-rates/">award rates</Link> page links each award we cover, and the Fair Work Ombudsman&rsquo;s Pay and Conditions Tool finds yours from your industry.</li>
              <li>Open the pay guide or the award&rsquo;s allowances clause and check the amount and the condition, such as holding a current first aid certificate or providing your own tools.</li>
              <li>Compare it with the allowance line on your <Link href="/understanding-your-payslip/">payslip</Link>, and with the amount in this guide.</li>
              <li>If you have been underpaid, the <Link href="/backpay-calculator/">backpay calculator</Link> shows what is owed and how back pay is taxed.</li>
            </ol>
          </section>

          <section>
            <H2>Related Calculators and Guides</H2>
            <ul>
              <li><Link href="/understanding-your-payslip/">Understanding Your Payslip</Link>: every line explained</li>
              <li><Link href="/overtime-penalty-rates-guide/">Penalty Rates Guide</Link>: weekends, nights and public holidays</li>
              <li><Link href="/travel-allowance/">Travel Allowance</Link>: ATO reasonable amounts</li>
              <li><Link href="/job-pay-rates/">Pay Rates by Job</Link>: award rates and allowances by occupation</li>
              <li><Link href="/award-rates/">Award Pay Rates</Link>: minimum rates by award</li>
            </ul>
          </section>

          <FaqSection faqs={ALLOWANCES_GUIDE_FAQS} label="Allowances" />

          <PageFooter
            slug="allowances-guide"
            lastVerified={ALLOWANCES_VERIFIED_ON}
            sources={SOURCES_LIST}
            methodology={<>
              <p>Every allowance amount is read from the consolidated award text on awards.fairwork.gov.au (incorporating all amendments up to and including 1 July 2026) and transcribed into the occupation pay data, with the clause reference, on {JOB_PAY_VERIFIED_ON}. This guide groups those rows by allowance type and merges identical rows that several occupations share under one award. We spot-checked the General Retail Industry, Clerks and Hospitality awards against the award text again on {ALLOWANCES_VERIFIED_ON}. Allowances whose amount the award does not print (for example &ldquo;agreed in writing&rdquo;) are left out.</p>
              <p>Amounts are minimum award entitlements and change when the Fair Work Commission varies an award, usually from 1 July. An enterprise agreement or contract can pay more. This guide covers the awards listed, not every award. General information, not advice.</p>
            </>}
          />
        </article>

        <RelatedSidebar links={[
          { href: "/understanding-your-payslip/", label: "Understanding Your Payslip" },
          { href: "/overtime-penalty-rates-guide/", label: "Penalty Rates Guide" },
          { href: "/travel-allowance/", label: "Travel Allowance" },
          { href: "/job-pay-rates/", label: "Pay Rates by Job" },
          { href: "/award-rates/", label: "Award Pay Rates" },
        ]} />
      </div>
    </div></div>
  );
}

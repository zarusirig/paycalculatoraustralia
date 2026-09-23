// Everything on /redundancy-pay-calculator/ below the calculator card: the NES
// scale, tax-free limits, worked examples, state table, FAQ and sources. A
// server component, so it ships as HTML; redundancy-pay-calculator.tsx (client)
// renders it via `children`.

import Link from "next/link";
import { RelatedSearches, type RelatedSearch } from "@/modules/seo/related-searches";
import { ShieldAlert } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import { NOTICE_PERIODS, SOURCES, formatAUD, formatNegAUD, formatPercent } from "@/lib/constants";
import {
  ETP_RATES,
  GENUINE_REDUNDANCY_AGE_LIMIT,
  NES_REDUNDANCY_SCALE,
  PRESERVATION_AGE,
  REDUNDANCY_TAX,
  REDUNDANCY_TAX_2025_26,
  SMALL_BUSINESS_HEADCOUNT,
  genuineRedundancyTaxFreeLimit,
  nesRedundancyWeeks,
  redundancyTax,
} from "@/lib/constants/redundancy";
import {
  JURISDICTION_CODES,
  LSL_JURISDICTIONS,
  entitlementOnEnding,
  serviceFromParts,
} from "@/lib/constants/long-service-leave";
import type { RedundancyFaq } from "./redundancy-pay-faqs";

// All tax figures come from lib/constants/redundancy.ts (ATO-sourced, tested).
// Before 23 Sep 2026 this page hardcoded the 2024-25 limit ($12,524 + $6,263)
// and a flat 32% — never reintroduce a local figure here.

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const H2 = "text-2xl font-semibold text-navy mb-4";
const H3 = "text-lg font-semibold text-navy mb-2 mt-6";
const P = "mb-4 text-warmgray";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy";

const Y = REDUNDANCY_TAX.incomeYear;
const pct = (r: number) => formatPercent(r, 0);

const ATO_GENUINE =
  "https://www.ato.gov.au/individuals-and-families/jobs-and-employment-types/working-as-an-employee/leaving-your-job/genuine-redundancy-payments";
const ATO_ETP_RATES =
  "https://www.ato.gov.au/tax-rates-and-codes/key-superannuation-rates-and-thresholds/employment-termination-payments";
const FWO_REDUNDANCY = "https://www.fairwork.gov.au/ending-employment/redundancy/redundancy-pay-and-entitlements";
const SA_IMP = "https://www.servicesaustralia.gov.au/income-maintenance-period";

const SOURCES_LIST: SourceLink[] = [
  { title: "Redundancy pay & entitlements", url: FWO_REDUNDANCY, publisher: SOURCES.fwo.name },
  { title: "Genuine redundancy payments", url: ATO_GENUINE, publisher: SOURCES.ato.name },
  { title: "Employment termination payments — key rates and thresholds", url: ATO_ETP_RATES, publisher: SOURCES.ato.name },
  { title: "Income maintenance period", url: SA_IMP, publisher: "Services Australia" },
];

/** Worked example 1 — NES minimum, fully tax-free. */
const EX1 = { salary: 90_000, years: 5 };
const EX1_WEEKLY = EX1.salary / 52;
const EX1_WEEKS = nesRedundancyWeeks(EX1.years);
const EX1_TAX = redundancyTax({
  grossPayment: EX1_WEEKLY * EX1_WEEKS,
  completedYears: EX1.years,
  genuine: true,
  reachedPreservationAge: false,
});

/** Worked example 2 — an above-NES package (4 weeks a year) that crosses the limit. */
const EX2 = { salary: 150_000, years: 3, weeksPerYear: 4 };
const EX2_WEEKLY = EX2.salary / 52;
const EX2_WEEKS = EX2.years * EX2.weeksPerYear;
const EX2_TAX = redundancyTax({
  grossPayment: EX2_WEEKLY * EX2_WEEKS,
  completedYears: EX2.years,
  genuine: true,
  reachedPreservationAge: false,
});

const LIMIT_YEARS = [1, 2, 3, 5, 8, 10, 15, 20];
const TABLE_SALARY = 80_000;

/** Earliest completed years at which each state's LSL is paid out on a redundancy. */
function lslOnRedundancyFrom(code: (typeof JURISDICTION_CODES)[number]): number {
  const j = LSL_JURISDICTIONS[code];
  const atWindow = entitlementOnEnding(code, serviceFromParts(j.proRataFromYears), "redundancy");
  return atWindow.payableOnEndingWeeks > 0 ? j.proRataFromYears : j.proRataUnconditionalFromYears;
}

function scaleLabel(fromYears: number, toYears: number | null): string {
  if (fromYears === 0) return "Less than 1 year";
  if (toYears === null) return `${fromYears} years and over`;
  return `${fromYears} year${fromYears === 1 ? "" : "s"}, less than ${toYears}`;
}

// Google AU "related searches" for "redundancy pay calculator" and "redundancy
// payment" (Sept 2026), each pointed at the page that answers it.
const RELATED_SEARCHES: readonly RelatedSearch[] = [
  { label: "Final pay calculator", href: "/final-pay-calculator/" },
  { label: "Unused annual leave payout", href: "/leave-calculator/" },
  { label: "Long service leave on redundancy", href: "/long-service-leave-calculator/" },
  { label: "JobSeeker after redundancy", href: "/jobseeker-payment-calculator/" },
  { label: "Tax on a lump sum", href: "/bonus-tax-calculator/" },
  { label: "Annual leave guide", href: "/annual-leave-guide/" },
];

export default function RedundancyPayCalculatorContent({ faqs }: { faqs: readonly RedundancyFaq[] }) {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* NES TABLE + TAX-FREE BOX */}
      <section id="redundancy-pay-table">
        <h2 className={H2} style={FONT}>Redundancy Pay Table: Weeks by Years of Service</h2>
        <p className={P}>
          The National Employment Standards set the minimum redundancy pay for every national system
          employee in Australia. It is worked out on <strong>completed years of continuous service</strong> —
          4 years and 11 months counts as 4 — and paid at your base rate for ordinary hours.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
          <div className={TABLE_WRAP}>
            <table className="w-full text-sm">
              <caption className="sr-only">NES redundancy pay scale, Fair Work Act 2009 section 119</caption>
              <thead className="bg-sandstone">
                <tr>
                  <th scope="col" className={TH}>Continuous service</th>
                  <th scope="col" className={TH + " text-right"}>Redundancy pay</th>
                  <th scope="col" className={TH + " text-right"}>On {formatAUD(TABLE_SALARY)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandstone-dark/10">
                {NES_REDUNDANCY_SCALE.map((b, i) => (
                  <tr key={b.fromYears} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                    <td className={TD}>{scaleLabel(b.fromYears, b.toYears)}</td>
                    <td className={TD + " text-right font-semibold"}>{b.weeks === 0 ? "Nil" : `${b.weeks} weeks`}</td>
                    <td className={TD + " text-right tabular-nums text-warmgray"}>{formatAUD((TABLE_SALARY / 52) * b.weeks)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <aside className="rounded-xl border-2 border-eucalyptus/40 bg-eucalyptus-light/20 p-5 self-start">
            <h3 className="text-base font-semibold text-navy mb-2" style={FONT}>Tax-free redundancy limit {Y}</h3>
            <p className="text-3xl font-extrabold text-navy tabular-nums">{formatAUD(REDUNDANCY_TAX.taxFreeBase)}</p>
            <p className="text-sm text-warmgray mb-3">plus <strong className="text-navy">{formatAUD(REDUNDANCY_TAX.taxFreePerYear)}</strong> for each completed year of service</p>
            <p className="text-xs text-warmgray">
              Applies to genuine redundancy payments made from 1 July 2026. For {REDUNDANCY_TAX_2025_26.incomeYear} it was{" "}
              {formatAUD(REDUNDANCY_TAX_2025_26.taxFreeBase)} + {formatAUD(REDUNDANCY_TAX_2025_26.taxFreePerYear)}. ETP cap {Y}:{" "}
              {formatAUD(REDUNDANCY_TAX.etpCap)}. Source:{" "}
              <a href={ATO_ETP_RATES} target="_blank" rel="noopener noreferrer" className={LINK}>ATO</a>.
            </p>
          </aside>
        </div>
        <p className="mt-3 text-xs text-warmgray-light">
          Fair Work Act 2009 s 119. The {formatAUD(TABLE_SALARY)} column is base salary ÷ 52 × weeks. Awards,
          enterprise agreements and contracts can pay more, never less. Employers with fewer than{" "}
          {SMALL_BUSINESS_HEADCOUNT} employees are exempt, and casuals are not covered.
        </p>

        <h3 className={H3} style={FONT}>Tax-free amount by years of service ({Y})</h3>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th scope="col" className={TH}>Completed years</th>
                <th scope="col" className={TH + " text-right"}>Tax-free limit</th>
                <th scope="col" className={TH + " text-right"}>NES weeks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {LIMIT_YEARS.map((y, i) => (
                <tr key={y} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className={TD}>{y}</td>
                  <td className={TD + " text-right tabular-nums font-semibold"}>{formatAUD(genuineRedundancyTaxFreeLimit(y))}</td>
                  <td className={TD + " text-right"}>{nesRedundancyWeeks(y)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-warmgray">
          The NES minimum alone almost never reaches the limit. The tax-free cap starts to matter when an
          agreement or negotiated package pays several weeks per year of service.
        </p>
      </section>

      {/* WORKED EXAMPLES */}
      <section id="worked-example">
        <h2 className={H2} style={FONT}>How Is Redundancy Pay Calculated? Two Worked Examples</h2>
        <p className={P}>
          The formula is <strong>base annual salary ÷ 52 × NES weeks = gross redundancy pay</strong>. The
          ATO then compares the payment with the tax-free limit for your completed years, and anything
          above it is taxed as an employment termination payment (ETP).
        </p>
        <h3 className={H3} style={FONT}>{formatAUD(EX1.salary)} salary, {EX1.years} years, NES minimum</h3>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>Base weekly pay ({formatAUD(EX1.salary)} ÷ 52)</td><td className={TD + " text-right tabular-nums"}>{formatAUD(EX1_WEEKLY, 2)}</td></tr>
              <tr><td className={TD}>NES weeks at {EX1.years} completed years</td><td className={TD + " text-right"}>{EX1_WEEKS} weeks</td></tr>
              <tr><td className={TD}>Gross redundancy pay</td><td className={TD + " text-right tabular-nums"}>{formatAUD(EX1_WEEKLY * EX1_WEEKS, 2)}</td></tr>
              <tr><td className={TD}>Tax-free limit ({formatAUD(REDUNDANCY_TAX.taxFreeBase)} + {formatAUD(REDUNDANCY_TAX.taxFreePerYear)} × {EX1.years})</td><td className={TD + " text-right tabular-nums"}>{formatAUD(EX1_TAX.taxFreeLimit)}</td></tr>
              <tr className="bg-sandstone/50"><td className={TD + " font-medium"}>Tax / take-home</td><td className={TD + " text-right font-bold tabular-nums"}>{formatAUD(EX1_TAX.tax, 2)} / {formatAUD(EX1_TAX.net, 2)}</td></tr>
            </tbody>
          </table>
        </div>
        <h3 className={H3} style={FONT}>{formatAUD(EX2.salary)} salary, {EX2.years} years, {EX2.weeksPerYear} weeks per year of service</h3>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>Package ({EX2.years} × {EX2.weeksPerYear} = {EX2_WEEKS} weeks × {formatAUD(EX2_WEEKLY, 2)})</td><td className={TD + " text-right tabular-nums"}>{formatAUD(EX2_WEEKLY * EX2_WEEKS, 2)}</td></tr>
              <tr><td className={TD}>Tax-free limit ({formatAUD(REDUNDANCY_TAX.taxFreeBase)} + {formatAUD(REDUNDANCY_TAX.taxFreePerYear)} × {EX2.years})</td><td className={TD + " text-right tabular-nums"}>{formatAUD(EX2_TAX.taxFreeLimit)}</td></tr>
              <tr><td className={TD}>Taxable ETP part</td><td className={TD + " text-right tabular-nums"}>{formatAUD(EX2_TAX.etpTaxable, 2)}</td></tr>
              <tr><td className={TD}>Tax at {pct(EX2_TAX.rateWithinCap)} (under {PRESERVATION_AGE})</td><td className={TD + " text-right tabular-nums"}>{formatNegAUD(EX2_TAX.tax, 2, "−")}</td></tr>
              <tr className="bg-sandstone/50"><td className={TD + " font-medium"}>Take-home</td><td className={TD + " text-right font-bold tabular-nums"}>{formatAUD(EX2_TAX.net, 2)}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-warmgray">
          The base rate excludes overtime, bonuses, incentive payments, allowances, loadings and penalty
          rates. Part-time employees use their own ordinary weekly pay.
        </p>
      </section>

      {/* TAX */}
      <section id="redundancy-tax">
        <h2 className={H2} style={FONT}>How Is Redundancy Pay Taxed in {Y}?</h2>
        <p className={P}>
          A <strong>genuine redundancy payment</strong> is tax-free up to the limit and is not included in
          your assessable income. The part above the limit is an ETP. The whole of a non-genuine payment is
          an ETP, with no tax-free part.
        </p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th scope="col" className={TH}>Age at 30 June</th>
                <th scope="col" className={TH + " text-right"}>ETP up to {formatAUD(REDUNDANCY_TAX.etpCap)}</th>
                <th scope="col" className={TH + " text-right"}>Above the cap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>Under preservation age ({PRESERVATION_AGE})</td><td className={TD + " text-right font-semibold"}>{pct(ETP_RATES.underPreservationAge)}</td><td className={TD + " text-right"}>{pct(ETP_RATES.aboveCap)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>Preservation age or older</td><td className={TD + " text-right font-semibold"}>{pct(ETP_RATES.atOrOverPreservationAge)}</td><td className={TD + " text-right"}>{pct(ETP_RATES.aboveCap)}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-warmgray">
          Rates include the 2% Medicare levy. The excess over the tax-free limit on a genuine redundancy
          is an &ldquo;excluded&rdquo; ETP, so only the {Y} ETP cap applies to it. A non-genuine payment can
          also be limited by the $180,000 whole-of-income cap, which depends on your other income — this
          calculator does not model that, so treat its figure for a non-genuine payment as the lowest the
          tax could be.
        </p>
        <h3 className={H3} style={FONT}>What makes a redundancy genuine?</h3>
        <ul className="list-disc pl-5 space-y-2 text-warmgray">
          <li>You are <strong>dismissed</strong> because your position is genuinely redundant — the employer no longer needs the job done by anyone. Resigning, or dismissal for performance or misconduct, does not count.</li>
          <li>You are dismissed <strong>before pension age ({GENUINE_REDUNDANCY_AGE_LIMIT})</strong>.</li>
          <li>The payment is no more than an <strong>arm&apos;s length</strong> amount, and there is <strong>no arrangement to re-employ</strong> you.</li>
        </ul>
        <p className="mt-3 text-sm text-warmgray">
          Consultation and redeployment duties under the Fair Work Act decide whether a dismissal is a
          genuine redundancy for unfair dismissal purposes. That is a separate test from the ATO&apos;s. See the
          ATO&apos;s <a href={ATO_GENUINE} target="_blank" rel="noopener noreferrer" className={LINK}>genuine redundancy payments</a> page.
        </p>
      </section>

      {/* STATES */}
      <section id="redundancy-by-state">
        <h2 className={H2} style={FONT}>Redundancy Calculator for QLD, NSW, VIC, WA and Every State</h2>
        <p className={P}>
          There is no separate Queensland or NSW redundancy calculator because there is no separate state
          scale: NES redundancy pay comes from the Fair Work Act and is identical across Australia for
          national system employees. Two things do change with your state:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-warmgray mb-4">
          <li><strong>Long service leave</strong> is paid on top of redundancy pay under each state&apos;s own Act, and several states pay it out earlier when the reason is redundancy.</li>
          <li><strong>State system employees</strong> — mainly state public servants, and in WA the employees of sole traders, partnerships and other unincorporated businesses — are covered by their state&apos;s industrial laws and awards rather than the NES scale.</li>
        </ul>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th scope="col" className={TH}>State</th>
                <th scope="col" className={TH + " text-right"}>NES redundancy pay</th>
                <th scope="col" className={TH + " text-right"}>LSL paid on redundancy from</th>
                <th scope="col" className={TH + " text-right"}>Full LSL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {JURISDICTION_CODES.map((code, i) => {
                const j = LSL_JURISDICTIONS[code];
                return (
                  <tr key={code} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                    <td className={TD + " font-medium"}>
                      <Link href={`/long-service-leave-calculator/${code}/`} className={LINK}>{j.abbr}</Link>
                    </td>
                    <td className={TD + " text-right"}>Same scale</td>
                    <td className={TD + " text-right"}>{lslOnRedundancyFrom(code)} years</td>
                    <td className={TD + " text-right"}>{Number(j.weeksAtQualifying.toFixed(2))} weeks at {j.takeAfterYears} yrs</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-warmgray-light">
          Long service leave figures from each state or territory Act — see the state pages linked above
          for the rules and a calculator set to that state.
        </p>
      </section>

      {/* OTHER ENTITLEMENTS */}
      <section id="notice-and-final-pay">
        <h2 className={H2} style={FONT}>Notice and Other Final Pay on Redundancy</h2>
        <p className={P}>
          Redundancy pay is only one part of a final payout. Notice (or pay instead of it), unused annual
          leave and long service leave are separate entitlements, owed even by small businesses.
        </p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr><th scope="col" className={TH}>Continuous service</th><th scope="col" className={TH + " text-right"}>Minimum notice (NES)</th></tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {NOTICE_PERIODS.map((n, i) => (
                <tr key={n.years} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className={TD}>{n.years}</td>
                  <td className={TD + " text-right"}>{n.weeks} week{n.weeks === 1 ? "" : "s"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-sm text-warmgray mb-4">Add 1 week if you are over 45 and have at least 2 years of continuous service.</p>
        <ul className="list-disc pl-5 space-y-2 text-warmgray">
          <li><strong>Unused annual leave</strong> is paid out with leave loading if your award or agreement provides it. When the reason is a genuine redundancy it is taxed at no more than 32%.</li>
          <li><strong>Long service leave</strong> depends on your state — see the table above and the <Link href="/long-service-leave-calculator/" className={LINK}>long service leave calculator</Link>.</li>
          <li><strong>Super</strong> is not payable on the redundancy payment or on leave paid out at termination, only on wages to your last day.</li>
        </ul>
      </section>

      {/* SMALL BUSINESS / CASUALS / CENTRELINK */}
      <section id="exemptions">
        <h2 className={H2} style={FONT}>Small Businesses, Casuals and Centrelink</h2>
        <div className="bg-sandstone border border-sandstone-dark/20 p-5 rounded-xl text-sm mb-4 flex items-start gap-4">
          <ShieldAlert className="h-6 w-6 text-warmgray mt-0.5 flex-shrink-0" />
          <p className="text-navy">
            An employer with fewer than <strong>{SMALL_BUSINESS_HEADCOUNT} employees</strong> when notice is given
            owes no NES redundancy pay. The count covers the whole business and associated entities, and
            includes casuals employed on a regular and systematic basis. An award or agreement can still require
            redundancy pay, and if a small business pays a genuine redundancy the ATO tax-free limit applies.
          </p>
        </div>
        <p className={P}>
          <strong>Casual employees</strong> are excluded from NES redundancy pay however long they have worked.
          Apprentices and employees on fixed-term contracts that simply run out are also excluded.
        </p>
        <p className={P}>
          <strong>Centrelink:</strong> Services Australia can apply an{" "}
          <a href={SA_IMP} target="_blank" rel="noopener noreferrer" className={LINK}>income maintenance period</a>{" "}
          for redundancy and leave payments — a payment worth 10 weeks of wages can mean waiting about 10
          weeks for JobSeeker — and a liquid assets waiting period of up to 13 weeks. See the{" "}
          <Link href="/centrelink-income-test/" className={LINK}>Centrelink income test calculator</Link>.
        </p>
      </section>

      {/* RELATED */}
      <section>
        <h2 className={H2} style={FONT}>Related Calculators</h2>
        <ul className="list-disc pl-5 space-y-2 text-warmgray">
          <li><Link href="/final-pay-calculator/" className={LINK}>Final Pay Calculator</Link> — redundancy, notice and leave together</li>
          <li><Link href="/long-service-leave-calculator/" className={LINK}>Long Service Leave Calculator</Link> — what your state pays on top</li>
          <li><Link href="/leave-calculator/" className={LINK}>Leave Calculator</Link> — the value of unused annual leave</li>
          <li><Link href="/take-home-pay-calculator/" className={LINK}>Take-Home Pay Calculator</Link> — pay in your next job</li>
          <li><Link href="/tax-return-calculator/" className={LINK}>Tax Return Calculator</Link> — the year you were made redundant</li>
        </ul>
      </section>

      <MethodologyDisclosure>
        <ul className="list-disc pl-4 space-y-1">
          <li>Redundancy pay = base annual salary ÷ 52 × the NES weeks for completed years of service (Fair Work Act s 119).</li>
          <li>Tax-free limit, ETP cap and ETP rates are the ATO&apos;s {Y} figures, held in one tested constants file.</li>
          <li>Notice, unused leave and long service leave are excluded. The whole-of-income cap for non-genuine payments is not modelled.</li>
          <li>General information only, not tax or legal advice. The Fair Work Ombudsman (13 13 94) can confirm your entitlement.</li>
        </ul>
      </MethodologyDisclosure>

      <RelatedSearches items={RELATED_SEARCHES} />

      {/* FAQ */}
      <section>
        <h2 className={H2} style={FONT}>Frequently Asked Questions</h2>
        <div className="sr-only">
          <h3>Redundancy pay questions and answers</h3>
          {faqs.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}
        </div>
        <Accordion type="multiple" className="space-y-3">
          {faqs.map((f) => (
            <AccordionItem key={f.q} value={f.q} className="rounded-xl border border-sandstone-dark/20 px-5">
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent><p className="text-warmgray">{f.a}</p></AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <SourceAttribution sources={SOURCES_LIST} lastVerified="23 September 2026" />
    </div>
  );
}

// The static long-form content on /commonwealth-seniors-health-card/. A server
// component, so it ships as HTML; the client module
// (commonwealth-seniors-health-card.tsx) renders it via `children` below the
// calculator card.

import Link from "next/link";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import {
  CSHC,
  DEEMING,
  MEANS_TEST_SOURCES as SRC,
  PCC,
  deemedIncomeAnnual,
} from "@/lib/constants/centrelink-means-test";
import { Note, W3Faqs, W3Footer, W3Related, W3Section } from "./centrelink-w3-shared";
import { CSHC_FAQS } from "./centrelink-h3-faqs";

// Same values as the exports of centrelink-shared.tsx, which is a "use client"
// module and so cannot supply plain values to a server component.
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

const pct = (r: number) => `${(r * 100).toFixed(2)}%`;

const SOURCES_LIST = [
  source("Income test for Commonwealth Seniors Health Card", SRC.cshcIncomeTest),
  source("Who can get the Commonwealth Seniors Health Card", SRC.cshcWho),
  source("Commonwealth Seniors Health Card benefits", SRC.cshcBenefits),
  source("What adjusted taxable income is", SRC.adjustedTaxableIncome),
  source("Deeming", SRC.deeming),
  source("Who can get a Pensioner Concession Card", SRC.pccWho),
  { title: SRC.dssRatesListTitle, url: SRC.dssRatesList, publisher: "Department of Social Services" },
];

export default function CommonwealthSeniorsHealthCardContent() {
  return (
    <>
      <W3Section title="CSHC Income Limits From 20 September 2026">
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your situation</th><th scope="col" className={TH + " text-right"}>Income must be less than</th><th scope="col" className={TH + " text-right"}>To 19 Sep 2026</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>Single</td><td className={TD + " text-right font-bold"}>{formatAUD(CSHC.incomeLimit.single)}</td><td className={TD + " text-right text-warmgray"}>{formatAUD(CSHC.previousIncomeLimit.single)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>Couple, combined</td><td className={TD + " text-right font-bold"}>{formatAUD(CSHC.incomeLimit.couple)}</td><td className={TD + " text-right text-warmgray"}>{formatAUD(CSHC.previousIncomeLimit.couple)}</td></tr>
              <tr><td className={TD}>Couple separated by illness, respite care or prison</td><td className={TD + " text-right font-bold"}>{formatAUD(CSHC.incomeLimit.coupleSeparated)}</td><td className={TD + " text-right text-warmgray"}>—</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>Each child in your care</td><td className={TD + " text-right"}>+{formatAUD(CSHC.perChild, 2)}</td><td className={TD + " text-right text-warmgray"}>+{formatAUD(CSHC.perChild, 2)}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">Indexed each {CSHC.indexedOn} in line with the CPI. There is no assets test.</p>
      </W3Section>

      <W3Section title="What Counts as Income for the CSHC">
        <ul className="list-disc pl-6 space-y-1 text-warmgray">
          <li><strong>Taxable income:</strong> wages and salary, casual and temporary work, bonuses and overtime, business income, interest, dividends, capital gains and taxable payments — gross income less allowable deductions.</li>
          <li><strong>Plus:</strong> target foreign income, total net investment losses (such as a negatively geared property), reportable super contributions, and employer-provided fringe benefits over {formatAUD(CSHC.fringeBenefitsThreshold)}.</li>
          <li><strong>Plus deemed income on account-based income streams</strong> — {pct(DEEMING.lowerRate)} on the first {formatAUD(DEEMING.thresholds.single)} (single) or {formatAUD(DEEMING.thresholds.nonPensionerCouple)} each (couple), {pct(DEEMING.upperRate)} above. {formatAUD(300_000)} in a single person&apos;s account-based pension is deemed to earn {formatAUD(deemedIncomeAnnual(300_000, "single"), 2)} a year. See <Link href="/deeming-rates/" className={LINK}>deeming rates</Link>.</li>
          <li><strong>Not counted:</strong> the value of your home, savings, shares or property — there is no assets test. Only the taxable income they produce counts.</li>
        </ul>
      </W3Section>

      <W3Section title="Working and Keeping the Card">
        <p className={P}>There is no limit on hours, and the card doesn&apos;t reduce as you earn — it is all-or-nothing at the income limit. A single card holder with no account-based pension can earn a taxable income just under {formatAUD(CSHC.incomeLimit.single)} and keep it. Reportable super contributions are added to your taxable income for the test.</p>
        <p className={P}>Work out your taxable income from a wage on the <Link href="/income-tax-calculator/" className={LINK}>income tax calculator</Link>, or your net pay on the <Link href="/take-home-pay-calculator/" className={LINK}>take-home pay calculator</Link>. If your income is low enough for a part pension instead, the <Link href="/age-pension-income-test-calculator/" className={LINK}>Age Pension calculator</Link> and <Link href="/age-pension-assets-test-calculator/" className={LINK}>assets test calculator</Link> show whether you would get one — a pension comes with the Pensioner Concession Card.</p>
        <Note>The test is on your adjusted taxable income for the year, so a year with a large bonus, a lot of overtime or a capital gain from selling shares or property can push you over the limit even if your regular pay doesn&apos;t.</Note>
      </W3Section>

      <W3Section title="CSHC vs Pensioner Concession Card">
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}></th><th scope="col" className={TH}>Commonwealth Seniors Health Card</th><th scope="col" className={TH}>Pensioner Concession Card</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD + " font-medium"}>Who gets it</td><td className={TD}>Age Pension age, not on a pension or income support</td><td className={TD}>Automatically with {PCC.automaticWith.join(", ")}; also some people 55+ or with partial capacity to work on other payments</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD + " font-medium"}>Income test</td><td className={TD}>Its own: under {formatAUD(CSHC.incomeLimit.single)} single, {formatAUD(CSHC.incomeLimit.couple)} couple</td><td className={TD}>None of its own — you qualify through the payment</td></tr>
              <tr><td className={TD + " font-medium"}>Assets test</td><td className={TD}>None</td><td className={TD}>Through the payment&apos;s assets test</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD + " font-medium"}>Main benefits</td><td className={TD}>Cheaper PBS medicines; bulk billing at your doctor&apos;s discretion; Medicare Safety Net; state and local concessions vary</td><td className={TD}>Cheaper medicines, bulk-billed doctor visits, help with hearing services, and some discounts</td></tr>
              <tr><td className={TD + " font-medium"}>How to get it</td><td className={TD}>Claim once you are Age Pension age</td><td className={TD}>No claim — posted to you</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">If your Age Pension or DSP is suspended because you are working, you keep the Pensioner Concession Card for up to {PCC.keepYearsWhileSuspended} years. Parenting Payment Single recipients keep it for {PCC.keepWeeksAfterPpsEnds} weeks after the payment ends.</p>
      </W3Section>

      <W3Section title="Related Calculators and Guides">
        <W3Related current="cshc" />
      </W3Section>

      <MethodologyDisclosure>
        <ul className="list-disc pl-4 space-y-1">
          <li>Assessed income = adjusted taxable income (as you enter it) + deemed income on account-based income streams. Eligible when it is less than the limit for your situation plus {formatAUD(CSHC.perChild, 2)} per child.</li>
          <li>Deeming uses the non-pensioner settings — {formatAUD(DEEMING.thresholds.single)} single, {formatAUD(DEEMING.thresholds.nonPensionerCouple)} per person for a couple — at {pct(DEEMING.lowerRate)} / {pct(DEEMING.upperRate)} from {DEEMING.ratesFrom}.</li>
          <li>Limits read at Services Australia and in the DSS rates list for the 20 September 2026 indexation, on {SRC.verifiedOn}. {SITE_CONFIG.name} is not Services Australia.</li>
        </ul>
      </MethodologyDisclosure>

      <W3Faqs faqs={CSHC_FAQS} topic="Commonwealth Seniors Health Card" />
      <W3Footer sources={SOURCES_LIST} lastVerified={SRC.verifiedOn} authorKey="commonwealth-seniors-health-card" />
    </>
  );
}

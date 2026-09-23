"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import { formatAUD, SITE_CONFIG } from "@/lib/constants";
import { AGE_PENSION_AGE } from "@/lib/constants/pension-age";
import {
  CSHC,
  DEEMING,
  MEANS_TEST_SOURCES as SRC,
  PCC,
  cshcIncomeTest,
  deemedIncomeAnnual,
  type CshcSituation,
} from "@/lib/constants/centrelink-means-test";
import { FONT, INPUT, LABEL, LINK, P, Row, TABLE_WRAP, TD, TH, clamp, source } from "./centrelink-shared";
import { MoneyInput, Note, W3Faqs, W3Footer, W3Hero, W3Related, W3Section } from "./centrelink-w3-shared";
import { CSHC_FAQS } from "./centrelink-h3-faqs";

// DataForSEO 24 Sep 2026 (AU): "commonwealth seniors health card" 12.1k,
// "... eligibility" 1.6k, "... income test" 480; "pensioner concession card"
// 8.1k (navigational — answered in a section here rather than its own page).
// Pay angle: the card has no work test, so working seniors ask how much they
// can earn and keep it.

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

const SITUATION_LABEL: Record<CshcSituation, string> = {
  single: "Single",
  couple: "A couple",
  coupleSeparated: "A couple separated by illness, respite care or prison",
};

export default function CommonwealthSeniorsHealthCardPage() {
  const [situation, setSituation] = useState<CshcSituation>("single");
  const [yourIncome, setYourIncome] = useState(60_000);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [otherAti, setOtherAti] = useState(0);
  const [yourAbp, setYourAbp] = useState(300_000);
  const [partnerAbp, setPartnerAbp] = useState(0);
  const [children, setChildren] = useState(0);

  const couple = situation !== "single";
  const r = useMemo(() => cshcIncomeTest({
    situation,
    adjustedTaxableIncome: yourIncome + (couple ? partnerIncome : 0) + otherAti,
    accountBasedBalances: couple ? [yourAbp, partnerAbp] : [yourAbp],
    children,
  }), [situation, yourIncome, partnerIncome, otherAti, yourAbp, partnerAbp, children, couple]);

  const ati = yourIncome + (couple ? partnerIncome : 0) + otherAti;

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <W3Hero crumb="Commonwealth Seniors Health Card" title="Commonwealth Seniors Health Card 2026 — Income Limit and Eligibility Check">
          <p>
            From {CSHC.limitsFrom} you can get the Commonwealth Seniors Health Card if you are Age Pension age ({AGE_PENSION_AGE}), don&apos;t get a pension or other income support payment, and your adjusted taxable income is <strong>less than {formatAUD(CSHC.incomeLimit.single)} a year</strong> (single) or <strong>{formatAUD(CSHC.incomeLimit.couple)}</strong> (couple, combined). There is <strong>no assets test</strong>, and no work test — your wages count as income, and an account-based pension is deemed to earn income.
          </p>
        </W3Hero>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">Do You Pass the CSHC Income Test?</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="situation" className={LABEL}>You are</label>
                    <select id="situation" value={situation} onChange={(e) => setSituation(e.target.value as CshcSituation)} className={INPUT}>
                      {(Object.keys(SITUATION_LABEL) as CshcSituation[]).map((k) => <option key={k} value={k}>{SITUATION_LABEL[k]}</option>)}
                    </select>
                  </div>
                  <MoneyInput id="yourIncome" label="Your taxable income this financial year" value={yourIncome} onChange={setYourIncome} max={1_000_000} step={1_000} hint="Wages, overtime, bonuses, business income, interest, dividends and capital gains, less deductions." />
                  {couple && <MoneyInput id="partnerIncome" label="Partner's taxable income" value={partnerIncome} onChange={setPartnerIncome} max={1_000_000} step={1_000} />}
                  <MoneyInput id="otherAti" label={`Other adjusted taxable income${couple ? " (combined)" : ""}`} value={otherAti} onChange={setOtherAti} max={1_000_000} step={500} hint={`Reportable super contributions, net investment losses, foreign income, and employer fringe benefits over ${formatAUD(CSHC.fringeBenefitsThreshold)}.`} />
                  <MoneyInput id="yourAbp" label="Your account-based pension balance" value={yourAbp} onChange={setYourAbp} max={5_000_000} step={1_000} hint="Only streams that are deemed (started or changed from 1 January 2015, or card granted after 2014)." />
                  {couple && <MoneyInput id="partnerAbp" label="Partner's account-based pension balance" value={partnerAbp} onChange={setPartnerAbp} max={5_000_000} step={1_000} />}
                  <div>
                    <label htmlFor="children" className={LABEL}>Children in your care</label>
                    <input id="children" type="number" min={0} max={10} value={children} onChange={(e) => setChildren(clamp(Math.floor(Number(e.target.value || 0)), 0, 10))} className={INPUT} />
                  </div>
                </form>

                <div className="space-y-6">
                  <div className={`rounded-xl border p-6 text-center shadow-sm ${r.eligible ? "border-eucalyptus bg-eucalyptus-light/40" : "border-ochre/40 bg-ochre/10"}`}>
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">CSHC income test</div>
                    <div className="text-3xl font-extrabold text-navy mb-1">{r.eligible ? "Under the limit" : "Over the limit"}</div>
                    <div className="text-sm text-warmgray">{formatAUD(r.assessed, 2)} assessed against a limit of {formatAUD(r.limit, 2)}</div>
                    <div className="text-sm text-navy mt-3 pt-3 border-t border-sandstone-dark/20">
                      {r.eligible
                        ? <>You could have about <strong>{formatAUD(Math.max(0, r.headroom - 0.01), 2)}</strong> more taxable income a year and still pass.</>
                        : <>You are <strong>{formatAUD(-r.headroom, 2)}</strong> over. You must be <em>under</em> the limit — reaching it exactly doesn&apos;t pass.</>}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How the income test applied</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Taxable income" value={formatAUD(yourIncome + (couple ? partnerIncome : 0), 2)} />
                      <Row label="Other adjusted taxable income" value={formatAUD(otherAti, 2)} />
                      <Row label="Adjusted taxable income" value={formatAUD(ati, 2)} bold />
                      <Row label={`Deemed income on account-based pensions (${pct(DEEMING.lowerRate)} / ${pct(DEEMING.upperRate)})`} value={formatAUD(r.deemed, 2)} />
                      <Row label="Assessed income" value={formatAUD(r.assessed, 2)} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label={`Limit (${SITUATION_LABEL[situation].toLowerCase()}${children ? `, + ${formatAUD(CSHC.perChild, 2)} × ${children}` : ""})`} value={formatAUD(r.limit, 2)} />
                      <Row label={r.eligible ? "Room under the limit" : "Over the limit by"} value={formatAUD(Math.abs(r.headroom), 2)} bold highlight />
                    </div>
                  </div>
                  <p className="text-xs text-warmgray-light">You also need to be Age Pension age, meet the residence rules, not get an income support payment, and give your tax file number. Grandfathered income streams (held before 1 January 2015 with a card granted before then) are not deemed — leave their balance out.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
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
        </div>
      </div>
    </div>
  );
}

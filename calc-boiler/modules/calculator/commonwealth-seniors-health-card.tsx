"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import { AGE_PENSION_AGE } from "@/lib/constants/pension-age";
import {
  CSHC,
  DEEMING,
  cshcIncomeTest,
  type CshcSituation,
} from "@/lib/constants/centrelink-means-test";
import { FONT, INPUT, LABEL, Row, clamp } from "./centrelink-shared";
import { MoneyInput, W3Hero } from "./centrelink-w3-shared";

// DataForSEO 24 Sep 2026 (AU): "commonwealth seniors health card" 12.1k,
// "... eligibility" 1.6k, "... income test" 480; "pensioner concession card"
// 8.1k (navigational — answered in a section here rather than its own page).
// Pay angle: the card has no work test, so working seniors ask how much they
// can earn and keep it.
//
// The static long-form content is server-rendered
// (commonwealth-seniors-health-card-content.tsx) and passed in as `children`
// (named `content` here, since `children` is the number of children in care).

const pct = (r: number) => `${(r * 100).toFixed(2)}%`;

const SITUATION_LABEL: Record<CshcSituation, string> = {
  single: "Single",
  couple: "A couple",
  coupleSeparated: "A couple separated by illness, respite care or prison",
};

export default function CommonwealthSeniorsHealthCardPage({ children: content }: { children: ReactNode }) {
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
          {content}
        </div>
      </div>
    </div>
  );
}

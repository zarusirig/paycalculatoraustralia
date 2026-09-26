"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatNegAUD } from "@/lib/constants";
import {
  CARE_TYPE_LABELS,
  CCS,
  CCS_SOURCES as SRC,
  ccsForChild,
  ccsStandardPercent,
  ccsSubsidisedHours,
  type CareType,
  type CcsChildResult,
} from "@/lib/constants/child-care-subsidy";
import { FONT, INPUT, LABEL, LINK, Row, clamp } from "./centrelink-shared";
import { MoneyInput, W3Hero } from "./centrelink-w3-shared";

// DataForSEO 24 Sep 2026 (AU): "ccs calculator" 9.9k, "childcare subsidy"
// 8.1k, "childcare subsidy calculator" 5.4k (KD 24). Border: CCS is a family
// income test on combined adjusted taxable income, so a pay rise or extra
// shifts change it — the calculator starts from both parents' pay.
//
// The static long-form content is server-rendered
// (child-care-subsidy-calculator-content.tsx) and passed in as `children` (named `content` here, since `children` is the
// list of children in care).

interface ChildRow {
  age: number;
  careType: CareType;
  dailyFee: number;
  sessionHours: number;
  daysPerWeek: number;
}

const DEFAULT_CHILDREN: ChildRow[] = [
  { age: 3, careType: "cbdc", dailyFee: 150, sessionHours: 10, daysPerWeek: 3 },
  { age: 1, careType: "cbdc", dailyFee: 160, sessionHours: 10, daysPerWeek: 3 },
];

/** Index of each child that gets the higher rate: every child aged 5 or under except the eldest one. */
function higherRateFlags(children: ChildRow[]): boolean[] {
  const young = children.map((c, i) => ({ i, age: c.age })).filter((c) => c.age <= CCS.higher.maxChildAge);
  if (young.length < 2) return children.map(() => false);
  const eldest = young.reduce((a, b) => (b.age > a.age ? b : a));
  return children.map((c, i) => c.age <= CCS.higher.maxChildAge && i !== eldest.i);
}

export default function ChildCareSubsidyCalculatorPage({ children: content, afterCalculator }: { children: ReactNode; afterCalculator?: ReactNode }) {
  const [yourIncome, setYourIncome] = useState(90_000);
  const [partnerIncome, setPartnerIncome] = useState(60_000);
  const [over48, setOver48] = useState(false);
  const [children, setChildren] = useState<ChildRow[]>(DEFAULT_CHILDREN);

  const familyIncome = yourIncome + partnerIncome;
  const hours = ccsSubsidisedHours(over48 ? CCS.hours.participationThreshold + 1 : 0);

  const results = useMemo(() => {
    const flags = higherRateFlags(children);
    return children.map((c, i) => ccsForChild({
      careType: c.careType,
      ageBand: c.age >= 6 ? "schoolAge" : "belowSchool",
      dailyFee: c.dailyFee,
      sessionHours: c.sessionHours,
      daysPerWeek: c.daysPerWeek,
      higherRateChild: flags[i],
    }, familyIncome, hours));
  }, [children, familyIncome, hours]);

  const total = results.reduce((t, r) => ({ fees: t.fees + r.feesFortnight, paid: t.paid + r.paidFortnight, withheld: t.withheld + r.withheldFortnight, gap: t.gap + r.gapFortnight }), { fees: 0, paid: 0, withheld: 0, gap: 0 });

  const update = (i: number, patch: Partial<ChildRow>) => setChildren((cs) => cs.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <W3Hero crumb="Child Care Subsidy Calculator" title="Child Care Subsidy Calculator 2026-27 — Your CCS % and Gap Fee">
          <p>
            In 2026-27 families earning up to <strong>{formatAUD(CCS.standard.lowerThreshold)}</strong> get <strong>{CCS.standard.maxPercent}%</strong> Child Care Subsidy; it falls 1 percentage point for every {formatAUD(CCS.standard.step)} of combined family income and ends at {formatAUD(CCS.standard.cutOut)}. A second or younger child aged 5 or under gets up to <strong>{CCS.higher.maxPercent}%</strong> while family income is under {formatAUD(CCS.higher.incomeLimit)}. Since {CCS.hours.guaranteeFrom} every family gets at least <strong>{CCS.hours.guaranteed} subsidised hours</strong> per child a fortnight.
          </p>
          <p className="text-base">Enter both parents&apos; pay and your centre&apos;s fees to see your CCS percentage, the subsidy paid to your centre and your gap fee.</p>
        </W3Hero>

        <section className="max-w-5xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">Child Care Subsidy Calculator</h2>
              <form onSubmit={(e) => e.preventDefault()} className="grid md:grid-cols-3 gap-5 mb-6">
                <MoneyInput id="you" label="Your income this financial year" value={yourIncome} onChange={setYourIncome} max={2_000_000} step={1_000} hint="Adjusted taxable income: taxable pay, plus reportable fringe benefits and super contributions." />
                <MoneyInput id="partner" label="Partner's income this financial year" value={partnerIncome} onChange={setPartnerIncome} max={2_000_000} step={1_000} hint="Leave at 0 if you are single." />
                <div>
                  <span className={LABEL}>Recognised participation</span>
                  <label className="flex items-start gap-2 text-sm text-navy mt-2">
                    <input type="checkbox" checked={over48} onChange={(e) => setOver48(e.target.checked)} className="mt-1" />
                    <span>You (and your partner) each do more than {CCS.hours.participationThreshold} hours a fortnight of recognised participation (paid work, looking for work, volunteering and the other recognised types)</span>
                  </label>
                  <p className="text-xs text-warmgray-light mt-1">{hours} subsidised hours per child a fortnight.</p>
                </div>
              </form>

              <div className="space-y-4">
                {children.map((c, i) => (
                  <fieldset key={i} className="rounded-xl border border-sandstone-dark/20 p-4">
                    <legend className="px-2 text-sm font-semibold text-navy">Child {i + 1}</legend>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div>
                        <label htmlFor={`age-${i}`} className={LABEL}>Age</label>
                        <input id={`age-${i}`} type="number" min={0} max={13} value={c.age} onChange={(e) => update(i, { age: clamp(Math.floor(Number(e.target.value || 0)), 0, 13) })} className={INPUT} />
                      </div>
                      <div>
                        <label htmlFor={`type-${i}`} className={LABEL}>Care type</label>
                        <select id={`type-${i}`} value={c.careType} onChange={(e) => update(i, { careType: e.target.value as CareType })} className={INPUT}>
                          {(Object.keys(CARE_TYPE_LABELS) as CareType[]).map((k) => <option key={k} value={k}>{CARE_TYPE_LABELS[k]}</option>)}
                        </select>
                      </div>
                      <MoneyInput id={`fee-${i}`} label="Daily fee" value={c.dailyFee} onChange={(n) => update(i, { dailyFee: n })} max={1_000} step={1} />
                      <div>
                        <label htmlFor={`session-${i}`} className={LABEL}>Session hours</label>
                        <input id={`session-${i}`} type="number" min={1} max={24} step={0.5} value={c.sessionHours} onChange={(e) => update(i, { sessionHours: clamp(Number(e.target.value || 0), 0, 24) })} className={INPUT} />
                      </div>
                      <div>
                        <label htmlFor={`days-${i}`} className={LABEL}>Days a week</label>
                        <input id={`days-${i}`} type="number" min={0} max={7} value={c.daysPerWeek} onChange={(e) => update(i, { daysPerWeek: clamp(Math.floor(Number(e.target.value || 0)), 0, 7) })} className={INPUT} />
                      </div>
                    </div>
                    <ChildSummary r={results[i]} />
                    {children.length > 1 && <button type="button" onClick={() => setChildren((cs) => cs.filter((_, j) => j !== i))} className="mt-2 text-xs text-warmgray hover:text-navy underline">Remove child</button>}
                  </fieldset>
                ))}
                {children.length < 4 && (
                  <button type="button" onClick={() => setChildren((cs) => [...cs, { age: 4, careType: "cbdc", dailyFee: 150, sessionHours: 10, daysPerWeek: 2 }])} className="text-sm font-medium text-eucalyptus-dark hover:underline">+ Add a child</button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                  <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Your gap fee, a fortnight</div>
                  <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(total.gap, 2)}</div>
                  <div className="text-sm text-warmgray">about {formatAUD(total.gap / 2, 2)} a week · family income {formatAUD(familyIncome)}</div>
                </div>
                <div className="bg-white rounded-xl border border-sandstone-dark/20 p-5 space-y-3 text-sm">
                  <Row label="Fees charged, a fortnight" value={formatAUD(total.fees, 2)} />
                  <Row label="CCS paid to your centre" value={formatNegAUD(total.paid, 2)} />
                  <Row label="Gap fee you pay" value={formatAUD(total.gap, 2)} bold highlight />
                  <Row label={`Withheld (${CCS.defaultWithholding * 100}%), paid at balancing if not needed`} value={formatAUD(total.withheld, 2)} />
                  <Row label="Standard CCS percentage" value={`${ccsStandardPercent(familyIncome).toFixed(2)}%`} />
                </div>
              </div>
              <p className="text-xs text-warmgray-light mt-4">Estimate on the {CCS.financialYear} rates. The eldest child aged 5 or under is the standard-rate child; younger ones get the higher rate. Children 6 or older use the school-age cap. Not modelled: Additional Child Care Subsidy, absences, shared care, In Home Care per-family rules beyond the cap. The government&apos;s <a href={SRC.startingBlocks} className={LINK} rel="noopener noreferrer" target="_blank">Starting Blocks CCS calculator</a> gives the official estimate.</p>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
          {afterCalculator}
          {content}
        </div>
      </div>
    </div>
  );
}

function ChildSummary({ r }: { r: CcsChildResult }) {
  return (
    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-navy">
      <div><span className="text-warmgray block">CCS rate</span><strong>{r.percent.toFixed(2)}%</strong></div>
      <div><span className="text-warmgray block">Hourly fee / cap</span><strong>{formatAUD(r.hourlyFee, 2)}</strong> / {formatAUD(r.cap, 2)}</div>
      <div><span className="text-warmgray block">Hours subsidised</span><strong>{r.hoursSubsidised}</strong> of {r.hoursCharged}</div>
      <div><span className="text-warmgray block">Gap a fortnight</span><strong>{formatAUD(r.gapFortnight, 2)}</strong></div>
    </div>
  );
}

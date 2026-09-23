"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatNegAUD } from "@/lib/constants";
import { AGE_PENSION_INCOME_TEST, pensionReduction } from "@/lib/constants/centrelink-income-test";
import {
  DSP,
  dspHoursStatus,
  dspMaxRate,
  type DspUnder21Kind,
} from "@/lib/constants/centrelink-means-test";
import { FONT, INPUT, LABEL, LINK, Row } from "./centrelink-shared";
import { MoneyInput, W3Hero } from "./centrelink-w3-shared";

// DataForSEO 24 Sep 2026 (AU): "disability pension" 8.1k (KD 4), "dsp
// payment" 2.4k (KD 1), "disability pension rates" 1.9k, "dsp rates" 1.3k,
// "dsp income test" 210, "dsp calculator" 170. The pay angle: how many hours
// you can work and what your wages do to the pension.

const IT = AGE_PENSION_INCOME_TEST;
const R = DSP.rates21Plus.maxFortnightly;

type AgeGroup = "21plus" | DspUnder21Kind;
const AGE_GROUPS: { key: AgeGroup; label: string }[] = [
  { key: "21plus", label: "21 or older (or under 21 with a child)" },
  { key: "under18Dependent", label: "Under 18, dependent" },
  { key: "under18Independent", label: "Under 18, independent" },
  { key: "age18to20Dependent", label: "18 to 20, dependent" },
  { key: "age18to20Independent", label: "18 to 20, independent" },
];

/**
 * The interactive part of /disability-support-pension-calculator/: hero and
 * calculator card. The static long-form content is server-rendered
 * (disability-support-pension-calculator-content.tsx) and passed in as `children`.
 */
export default function DisabilitySupportPensionCalculatorPage({ children }: { children: React.ReactNode }) {
  const [age, setAge] = useState<AgeGroup>("21plus");
  const [couple, setCouple] = useState(false);
  const [wages, setWages] = useState(600);
  const [hours, setHours] = useState(15);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);

  const r = useMemo(() => {
    const max = age === "21plus" ? dspMaxRate(couple ? "couple21PlusEach" : "single21Plus") : dspMaxRate(couple ? "coupleUnder21" : age);
    const assessable = wages + otherIncome + (couple ? partnerIncome : 0);
    const reduction = pensionReduction(assessable, couple ? "couple" : "single");
    const pay = Math.max(0, Math.round((max - reduction) * 100) / 100);
    return { max, assessable, reduction, pay, hoursStatus: dspHoursStatus(hours) };
  }, [age, couple, wages, hours, partnerIncome, otherIncome]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <W3Hero crumb="Disability Support Pension Calculator" title="Disability Support Pension (DSP) Calculator 2026 — Rates, Income Test and Work Hours">
          <p>
            From {DSP.ratesFrom} the Disability Support Pension is <strong>{formatAUD(R.single.total, 2)} a fortnight</strong> for a single person 21 or older and <strong>{formatAUD(R.coupleEach.total, 2)} each</strong> for a couple. You can work up to <strong>{DSP.maxWorkHoursPerWeek} hours a week</strong> and keep it; your pay reduces it by 50 cents for each dollar over {formatAUD(IT.single.freeArea)} a fortnight (single), and it stops at {formatAUD(DSP.publishedCutOff.single21Plus, 2)}.
          </p>
        </W3Hero>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">How Much DSP Do You Keep When You Work?</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="age" className={LABEL}>Your age</label>
                    <select id="age" value={age} onChange={(e) => setAge(e.target.value as AgeGroup)} className={INPUT}>
                      {AGE_GROUPS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="couple" className={LABEL}>You are</label>
                    <select id="couple" value={couple ? "couple" : "single"} onChange={(e) => setCouple(e.target.value === "couple")} className={INPUT}>
                      <option value="single">Single</option>
                      <option value="couple">Partnered (living together)</option>
                    </select>
                  </div>
                  <MoneyInput id="wages" label="Your gross pay this fortnight" value={wages} onChange={setWages} max={10_000} />
                  <div>
                    <label htmlFor="hours" className={LABEL}>Hours you work a week</label>
                    <input id="hours" type="number" min={0} max={80} step={0.5} value={hours} onChange={(e) => setHours(Math.max(0, Math.min(80, Number(e.target.value || 0))))} className={INPUT} />
                    <p className="text-xs text-warmgray-light mt-1">Paid work in open employment. Volunteering doesn&apos;t count.</p>
                  </div>
                  {couple && <MoneyInput id="partner" label="Partner's gross income this fortnight" value={partnerIncome} onChange={setPartnerIncome} max={20_000} />}
                  <MoneyInput id="other" label={`Other assessable income this fortnight${couple ? " (combined)" : ""}`} value={otherIncome} onChange={setOtherIncome} max={10_000} hint="Deemed income on savings (see deeming rates), rent, other payments." />
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">{couple ? "DSP (yours), this fortnight" : "DSP this fortnight"}</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(r.pay, 2)}</div>
                    <div className="text-sm text-warmgray">of the {formatAUD(r.max, 2)} maximum · plus {formatAUD(wages, 2)} pay = {formatAUD(r.pay + wages, 2)} before tax</div>
                  </div>
                  <div className={`rounded-xl border p-4 text-sm text-navy ${r.hoursStatus === "ok" ? "border-eucalyptus bg-eucalyptus-light/40" : "border-ochre/40 bg-ochre/10"}`}>
                    {r.hoursStatus === "ok" && <><strong>{hours} hours a week — within the {DSP.maxWorkHoursPerWeek}-hour limit.</strong> You keep DSP, subject to the income test.</>}
                    {r.hoursStatus === "over" && <><strong>{hours} hours a week is over {DSP.maxWorkHoursPerWeek} hours.</strong> At {DSP.suspensionHoursPerWeek} or more hours a week on an ongoing basis your DSP is suspended.</>}
                    {r.hoursStatus === "suspend" && <><strong>{hours} hours a week on an ongoing basis means your DSP is suspended</strong> for up to {DSP.suspensionYears} years (not cancelled) — you keep your Pensioner Concession Card and can ask for DSP back if your hours drop. Not if you work in an Australian Disability Enterprise, under the Supported Wage System or with ongoing Inclusive Employment Australia support.</>}
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How the income test applied</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Your pay" value={formatAUD(wages, 2)} />
                      {couple && <Row label="Partner's income" value={formatAUD(partnerIncome, 2)} />}
                      <Row label="Other income" value={formatAUD(otherIncome, 2)} />
                      <Row label={couple ? "Combined assessable income" : "Assessable income"} value={formatAUD(r.assessable, 2)} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label={`Maximum rate (from ${DSP.ratesFrom})`} value={formatAUD(r.max, 2)} />
                      <Row label={`${couple ? "25c" : "50c"} per $1 over ${formatAUD(IT[couple ? "couple" : "single"].freeArea)}${couple ? " (combined)" : ""}`} value={formatNegAUD(r.reduction, 2)} />
                      <Row label="DSP" value={formatAUD(r.pay, 2)} bold highlight />
                    </div>
                  </div>
                  <p className="text-xs text-warmgray-light">Income test only. Not modelled: the assets test (limits below), Working Credit (which can shield some of your pay — see the <Link href="/centrelink-working-credit-calculator/" className={LINK}>Working Credit calculator</Link>), the Work Bonus (only at Age Pension age), transitional rates and Rent Assistance.{age !== "21plus" ? " Under-21 rates exclude Pharmaceutical Allowance and Energy Supplement, so the payment reaches $0 a little below the published cut-off." : ""}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
          {children}
        </div>
      </div>
    </div>
  );
}

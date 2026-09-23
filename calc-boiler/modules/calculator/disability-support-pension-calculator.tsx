"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import { formatAUD, formatNegAUD, SITE_CONFIG } from "@/lib/constants";
import { AGE_PENSION_INCOME_TEST, pensionReduction } from "@/lib/constants/centrelink-income-test";
import {
  DSP,
  MEANS_TEST_SOURCES as SRC,
  PENSION_ASSETS_TEST as AT,
  dspHoursStatus,
  dspMaxRate,
  type DspUnder21Kind,
} from "@/lib/constants/centrelink-means-test";
import { FONT, INPUT, LABEL, LINK, P, Row, TABLE_WRAP, TD, TH, source } from "./centrelink-shared";
import { MoneyInput, Note, W3Faqs, W3Footer, W3Hero, W3Related, W3Section } from "./centrelink-w3-shared";
import { DSP_FAQS } from "./centrelink-h3-faqs";

// DataForSEO 24 Sep 2026 (AU): "disability pension" 8.1k (KD 4), "dsp
// payment" 2.4k (KD 1), "disability pension rates" 1.9k, "dsp rates" 1.3k,
// "dsp income test" 210, "dsp calculator" 170. The pay angle: how many hours
// you can work and what your wages do to the pension.

const IT = AGE_PENSION_INCOME_TEST;
const R = DSP.rates21Plus.maxFortnightly;
const TABLE_INCOMES = [0, 226, 400, 600, 800, 1_000, 1_500, 2_000, 2_400, DSP.publishedCutOff.single21Plus];

type AgeGroup = "21plus" | DspUnder21Kind;
const AGE_GROUPS: { key: AgeGroup; label: string }[] = [
  { key: "21plus", label: "21 or older (or under 21 with a child)" },
  { key: "under18Dependent", label: "Under 18, dependent" },
  { key: "under18Independent", label: "Under 18, independent" },
  { key: "age18to20Dependent", label: "18 to 20, dependent" },
  { key: "age18to20Independent", label: "18 to 20, independent" },
];

const SOURCES_LIST = [
  source("Payment rates for Disability Support Pension", SRC.dspRates),
  source("Income test for Disability Support Pension", SRC.dspIncomeTest),
  source("Assets test for Disability Support Pension", SRC.dspAssetsTest),
  source("Working while you get DSP", SRC.dspWork),
  source("Non-medical rules for DSP", SRC.dspNonMedical),
  source("Disability Support Pension", SRC.dsp),
  { title: SRC.dssRatesListTitle, url: SRC.dssRatesList, publisher: "Department of Social Services" },
];

export default function DisabilitySupportPensionCalculatorPage() {
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
          <W3Section title="DSP Rates From 20 September 2026">
            <p className={P}>If you are 21 or older, or younger than 21 with a child in your care, DSP is paid at the pension rate — the same figures as the Age Pension, adjusted every 20 March and 20 September.</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Per fortnight</th><th scope="col" className={TH + " text-right"}>Single</th><th scope="col" className={TH + " text-right"}>Couple each</th><th scope="col" className={TH + " text-right"}>Couple combined</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {([["Maximum basic rate", "basic"], ["Pension Supplement", "supplement"], ["Energy Supplement", "energy"], ["Total", "total"]] as const).map(([label, f]) => (
                    <tr key={f} className={f === "total" ? "bg-eucalyptus-light/30 font-bold" : undefined}>
                      <td className={TD}>{label}</td>
                      <td className={TD + " text-right"}>{formatAUD(R.single[f], 2)}</td>
                      <td className={TD + " text-right"}>{formatAUD(R.coupleEach[f], 2)}</td>
                      <td className={TD + " text-right"}>{formatAUD(R.coupleCombined[f], 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">A couple separated due to ill health each get the single rate. Services Australia&apos;s DSP page shows the couple Pension Supplement as $65.50 each, but its total ({formatAUD(R.coupleEach.total, 2)}) only adds up with {formatAUD(R.coupleEach.supplement, 2)} — the figure in the DSS rates list and on the Age Pension page, which we use.</p>
            <h3 className="font-semibold text-navy mt-6 mb-2">Under 21 with no children</h3>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your situation</th><th scope="col" className={TH + " text-right"}>Maximum per fortnight</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>Single, under 18, dependent</td><td className={TD + " text-right"}>{formatAUD(DSP.under21.under18Dependent, 2)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Single, under 18, independent</td><td className={TD + " text-right"}>{formatAUD(DSP.under21.under18Independent, 2)}</td></tr>
                  <tr><td className={TD}>Single, 18 to 20, dependent</td><td className={TD + " text-right"}>{formatAUD(DSP.under21.age18to20Dependent, 2)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Single, 18 to 20, independent</td><td className={TD + " text-right"}>{formatAUD(DSP.under21.age18to20Independent, 2)}</td></tr>
                  <tr><td className={TD}>A couple, under 21</td><td className={TD + " text-right"}>{formatAUD(DSP.under21.coupleUnder21, 2)}</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">These include the Youth Disability Supplement but not Pharmaceutical Allowance or Energy Supplement, and index on {DSP.under21IndexedOn}. Your parents&apos; income does not affect the rate.</p>
          </W3Section>

          <W3Section title="DSP Income Test">
            <p className={P}>DSP uses the pension income test. It counts your and your partner&apos;s income from all sources, including <Link href="/deeming-rates/" className={LINK}>deemed income</Link> on savings. If you are permanently blind the income test doesn&apos;t apply unless you get Rent Assistance.</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your situation</th><th scope="col" className={TH + " text-right"}>Payment stops at (a fortnight)</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>21 or older, single</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.single21Plus, 2)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>21 or older, couple living together</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.couple21PlusCombined, 2)} combined</td></tr>
                  <tr><td className={TD}>21 or older, couple apart due to ill health</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.coupleApartIllHealthCombined, 2)} combined</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>18 to 20, single, no children, at home</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.age18to20SingleAtHome, 2)}</td></tr>
                  <tr><td className={TD}>16 to 17, single, no children, at home</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.age16to17SingleAtHome, 2)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>16 to 20, single, no children, independent</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.age16to20SingleIndependent, 2)}</td></tr>
                  <tr><td className={TD}>16 to 20, couple, no children</td><td className={TD + " text-right"}>{formatAUD(DSP.publishedCutOff.age16to20CoupleCombined, 2)} combined</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">Free area {formatAUD(IT.single.freeArea)} a fortnight single ({formatAUD(IT.couple.freeArea)} combined for a couple); 50c per dollar above it (25c each for a couple). Cut-offs as published by Services Australia from {DSP.ratesFrom}.</p>
            <div className={TABLE_WRAP + " mt-6"}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Single, 21+, income a fortnight</th><th scope="col" className={TH + " text-right"}>Reduction</th><th scope="col" className={TH + " text-right"}>DSP</th><th scope="col" className={TH + " text-right"}>Income + DSP</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TABLE_INCOMES.map((inc, i) => {
                    const pay = Math.max(0, Math.round((R.single.total - pensionReduction(inc, "single")) * 100) / 100);
                    return (
                      <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className={TD + " font-medium"}>{formatAUD(inc, 2)}</td>
                        <td className={TD + " text-right"}>{formatNegAUD(pensionReduction(inc, "single"), 2)}</td>
                        <td className={TD + " text-right font-bold"}>{formatAUD(pay, 2)}</td>
                        <td className={TD + " text-right"}>{formatAUD(pay + inc, 2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </W3Section>

          <W3Section title="How Many Hours Can You Work on DSP?">
            <ul className="list-disc pl-6 space-y-1 text-warmgray mb-4">
              <li><strong>Up to {DSP.maxWorkHoursPerWeek} hours a week:</strong> you keep DSP, and your pay goes through the income test.</li>
              <li><strong>{DSP.suspensionHoursPerWeek} or more hours a week on an ongoing basis:</strong> DSP is suspended for up to {DSP.suspensionYears} years. You keep your Pensioner Concession Card, and can ask for DSP to be restored within that time if your hours or income drop — no new claim.</li>
              <li><strong>Exceptions:</strong> work in an Australian Disability Enterprise, under the Supported Wage System, or with ongoing Inclusive Employment Australia support doesn&apos;t trigger the suspension.</li>
              <li><strong>Pay over the cut-off:</strong> DSP is $0 for that fortnight. After more than {DSP.nilRateFortnights} fortnights in a row at $0, DSP is suspended (or cancelled if it&apos;s your partner&apos;s income on a payment like JobSeeker doing it).</li>
              <li><strong>Report every 2 weeks:</strong> your and your partner&apos;s gross pay and the hours you worked. Tell Services Australia within 14 days when you start work.</li>
            </ul>
            <Note>To turn an hourly rate into the fortnightly gross the calculator needs, use the <Link href="/fortnightly-pay-calculator/" className={LINK}>fortnightly pay calculator</Link>. DSP is tax-free under Age Pension age, so tax on your wages is the only tax in the picture — see the <Link href="/take-home-pay-calculator/" className={LINK}>take-home pay calculator</Link>.</Note>
          </W3Section>

          <W3Section title="DSP Assets Test">
            <p className={P}>DSP uses the pension assets test: the lower of the income-test and assets-test results is paid. Above the full-pension limit, DSP reduces by $3 a fortnight per $1,000 ($1.50 each for a couple). Your home is not counted. Figures from {AT.ratesFrom}; couples combined.</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Situation (21+)</th><th scope="col" className={TH + " text-right"}>Full pension up to</th><th scope="col" className={TH + " text-right"}>Part pension stops above</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>Single, homeowner</td><td className={TD + " text-right"}>{formatAUD(AT.fullPensionLimit.single.homeowner)}</td><td className={TD + " text-right"}>{formatAUD(AT.partPensionCutOff.single.homeowner)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Single, non-homeowner</td><td className={TD + " text-right"}>{formatAUD(AT.fullPensionLimit.single.nonHomeowner)}</td><td className={TD + " text-right"}>{formatAUD(AT.partPensionCutOff.single.nonHomeowner)}</td></tr>
                  <tr><td className={TD}>Couple, homeowner</td><td className={TD + " text-right"}>{formatAUD(AT.fullPensionLimit.couple.homeowner)}</td><td className={TD + " text-right"}>{formatAUD(AT.partPensionCutOff.couple.homeowner)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Couple, non-homeowner</td><td className={TD + " text-right"}>{formatAUD(AT.fullPensionLimit.couple.nonHomeowner)}</td><td className={TD + " text-right"}>{formatAUD(AT.partPensionCutOff.couple.nonHomeowner)}</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">Under 21 with no children, DSP stops above {formatAUD(DSP.under21AssetsCutOff.age16to17Dependent.homeowner)} (16–17, dependent, homeowner) to {formatAUD(DSP.under21AssetsCutOff.age16to20Independent.nonHomeowner)} (independent, non-homeowner). Run your own figures on the <Link href="/age-pension-assets-test-calculator/" className={LINK}>assets test calculator</Link> — the 21+ limits are identical.</p>
          </W3Section>

          <W3Section title="Who Can Get DSP">
            <ul className="list-disc pl-6 space-y-1 text-warmgray">
              <li>You have a physical, intellectual or psychiatric condition that is likely to persist for more than {DSP.conditionYears} years and stops you from working, and you meet the medical rules.</li>
              <li>You are at least {DSP.minClaimAge} and under Age Pension age when you claim, and meet the residence rules and the income and assets tests.</li>
              <li>If you are under {DSP.participationUnderAge} you may have participation requirements — a compulsory work-focused activity with an employment services provider.</li>
              <li>DSP is taxable only once you reach Age Pension age; you can then choose to transfer to the Age Pension.</li>
            </ul>
          </W3Section>

          <W3Section title="Related Calculators and Guides">
            <W3Related current="dsp" />
          </W3Section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>DSP = maximum rate − 50c per $1 of assessable income over {formatAUD(IT.single.freeArea)} (single), or − 25c per combined $1 over {formatAUD(IT.couple.freeArea)} for each member of a couple, floored at $0. For 21+ this reproduces Services Australia&apos;s published cut-offs exactly (tests assert it).</li>
              <li>Under-21 maximum rates are as published and exclude Pharmaceutical Allowance and Energy Supplement, which the published cut-offs include — so the calculator reaches $0 slightly earlier than Services Australia&apos;s figure.</li>
              <li>Hours rule: up to {DSP.maxWorkHoursPerWeek} hours a week keeps DSP; {DSP.suspensionHoursPerWeek}+ ongoing suspends it. The calculator flags the hours; it doesn&apos;t decide whether hours are &ldquo;ongoing&rdquo;.</li>
              <li>Rates and rules read at Services Australia on {SRC.verifiedOn}. {SITE_CONFIG.name} is not Services Australia — use their Payment Finder for a claim estimate.</li>
            </ul>
          </MethodologyDisclosure>

          <W3Faqs faqs={DSP_FAQS} topic="Disability Support Pension" />
          <W3Footer sources={SOURCES_LIST} lastVerified={SRC.verifiedOn} authorKey="disability-support-pension-calculator" />
        </div>
      </div>
    </div>
  );
}

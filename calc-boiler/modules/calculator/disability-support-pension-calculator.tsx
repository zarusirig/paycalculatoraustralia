"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import { formatAUD, SITE_CONFIG } from "@/lib/constants";
import { pensionReduction, type PensionSituation } from "@/lib/constants/centrelink-income-test";
import {
  DSP,
  DSP_ASSETS,
  DSP_CUT_OFFS_21_PLUS,
  DSP_INCOME_TEST as IT,
  DSP_RATES_21_PLUS as R,
  DSP_SOURCES as SRC,
  DSP_UNDER_21,
  DSP_VERIFIED_ON,
  dspAfterBothTests,
  dspFortnightly,
} from "@/lib/constants/disability-support-pension";
import { FONT, INPUT, LABEL, LINK, P, Row, TABLE_WRAP, TD, TH, source } from "./centrelink-shared";
import { MoneyInput, Note, W3Faqs, W3Footer, W3Hero, W3Related, W3Section } from "./centrelink-w3-shared";
import { DSP_FAQS } from "./disability-support-pension-faqs";

// /disability-support-pension-calculator/ (G3, wave 4). DSP for people 21+ is
// paid at the pension rate under the pension income test (Services Australia:
// "We use the pension income test to assess Disability Support Pension"), so
// the arithmetic reuses the tested Age Pension code via
// lib/constants/disability-support-pension.ts.

const TABLE_INCOMES = [0, 226, 400, 600, 800, 1_000, 1_500, 2_000, 2_400, DSP_CUT_OFFS_21_PLUS.single];

const SOURCES_LIST = [
  source("Payment rates for Disability Support Pension", SRC.rates),
  source("Income test for Disability Support Pension", SRC.incomeTest),
  source("Assets test for Disability Support Pension", SRC.assetsTest),
  source("Working while you get Disability Support Pension", SRC.working),
  source("Who can get Disability Support Pension", SRC.whoCanGet),
  source("Non-medical rules for Disability Support Pension", SRC.nonMedical),
  source("How much Disability Support Pension you can get", SRC.howMuch),
];

export default function DisabilitySupportPensionCalculatorPage() {
  const [situation, setSituation] = useState<PensionSituation>("single");
  const [employment, setEmployment] = useState(400);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);
  const [hours, setHours] = useState(10);
  const [homeowner, setHomeowner] = useState(true);
  const [assets, setAssets] = useState(20_000);

  const result = useMemo(() => {
    const assessable = employment + otherIncome + (situation === "couple" ? partnerIncome : 0);
    const both = dspAfterBothTests(assessable, assets, situation, homeowner);
    const income = dspFortnightly(assessable, situation, hours);
    return { assessable, ...both, max: income.max, hoursStatus: income.hoursStatus, reduction: pensionReduction(assessable, situation) };
  }, [situation, employment, partnerIncome, otherIncome, hours, homeowner, assets]);

  const limit = situation === "single"
    ? homeowner ? DSP_ASSETS.fullPension.singleHomeowner : DSP_ASSETS.fullPension.singleNonHomeowner
    : homeowner ? DSP_ASSETS.fullPension.coupleHomeowner : DSP_ASSETS.fullPension.coupleNonHomeowner;

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <W3Hero crumb="Disability Support Pension Calculator" title="Disability Support Pension Calculator 2026 — DSP Rates, Income Test and Work Hours">
          <p>
            The Disability Support Pension (DSP) is up to {formatAUD(R.maxFortnightly.single.total, 2)} a fortnight for a single person aged 21 or over, and {formatAUD(R.maxFortnightly.coupleEach.total, 2)} each for a couple, from {DSP.ratesFrom}. Enter your pay to see how much you keep: DSP reduces by 50 cents for each dollar over {formatAUD(IT.single.freeArea)} a fortnight (single), and you can work up to {DSP.maxWeeklyWorkHours} hours a week and stay on it.
          </p>
        </W3Hero>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">How Much DSP Do You Get? (21 and over)</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="dsp-situation" className={LABEL}>You are</label>
                    <select id="dsp-situation" value={situation} onChange={(e) => setSituation(e.target.value as PensionSituation)} className={INPUT}>
                      <option value="single">Single</option>
                      <option value="couple">Partnered (living together)</option>
                    </select>
                  </div>
                  <MoneyInput id="dsp-pay" label="Your gross pay this fortnight" value={employment} onChange={setEmployment} max={10_000} />
                  <div>
                    <label htmlFor="dsp-hours" className={LABEL}>Hours you work a week</label>
                    <input id="dsp-hours" type="number" min={0} max={80} value={hours} onChange={(e) => setHours(Math.max(0, Math.min(80, Number(e.target.value || 0))))} className={INPUT} />
                  </div>
                  {situation === "couple" && (
                    <MoneyInput id="dsp-partner" label="Partner's gross income this fortnight" value={partnerIncome} onChange={setPartnerIncome} max={20_000} />
                  )}
                  <MoneyInput id="dsp-other" label={`Other assessable income this fortnight${situation === "couple" ? " (combined)" : ""}`} value={otherIncome} onChange={setOtherIncome} max={10_000} hint="Deemed income on savings and shares, rent, super income streams." />
                  <div className="flex items-start gap-2">
                    <input id="dsp-home" type="checkbox" checked={homeowner} onChange={(e) => setHomeowner(e.target.checked)} className="mt-1" />
                    <label htmlFor="dsp-home" className="text-sm text-navy">I own my home (it isn&apos;t counted as an asset)</label>
                  </div>
                  <MoneyInput id="dsp-assets" label={`Assessable assets${situation === "couple" ? " (combined)" : ""}`} value={assets} onChange={setAssets} max={3_000_000} step={1_000} hint="Savings, shares, cars, contents, super if you're Age Pension age. Not your home." />
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">{situation === "couple" ? "Your DSP this fortnight" : "DSP this fortnight"}</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(result.pay, 2)}</div>
                    <div className="text-sm text-warmgray">of the {formatAUD(result.max, 2)} maximum · plus {formatAUD(employment, 2)} pay = {formatAUD(result.pay + employment, 2)} before tax</div>
                  </div>
                  <div className={`rounded-xl border p-4 text-sm ${result.hoursStatus === "ok" ? "border-eucalyptus bg-eucalyptus-light/40" : "border-ochre/40 bg-ochre/10"} text-navy`}>
                    {result.hoursStatus === "ok"
                      ? <><strong>{hours} hours a week — within the {DSP.maxWeeklyWorkHours}-hour limit.</strong> Report your pay and hours every fortnight.</>
                      : <><strong>{hours} hours a week is {DSP.suspensionWeeklyHours} or more.</strong> Working {DSP.suspensionWeeklyHours}+ hours a week on an ongoing basis can suspend DSP for up to {DSP.suspensionYears} years (not if you work in an Australian Disability Enterprise, under the Supported Wage System or with ongoing Inclusive Employment Australia support).</>}
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How the tests applied</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Your pay" value={formatAUD(employment, 2)} />
                      {situation === "couple" && <Row label="Partner's income" value={formatAUD(partnerIncome, 2)} />}
                      <Row label="Other income" value={formatAUD(otherIncome, 2)} />
                      <Row label={situation === "couple" ? "Combined assessable income" : "Assessable income"} value={formatAUD(result.assessable, 2)} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label={`Maximum rate (from ${DSP.ratesFrom})`} value={formatAUD(result.max, 2)} />
                      <Row label={`Income test: ${situation === "couple" ? "25c" : "50c"} per $1 over ${formatAUD(IT[situation].freeArea)}`} value={`-${formatAUD(result.reduction, 2)}`} />
                      <Row label="Income test result" value={formatAUD(result.incomeTest, 2)} />
                      <Row label={`Assets test (full pension up to ${formatAUD(limit)})`} value={formatAUD(result.assetsTest, 2)} />
                      <Row label="DSP paid (the lower result)" value={formatAUD(result.pay, 2)} bold highlight />
                    </div>
                  </div>
                  <p className="text-xs text-warmgray-light">For people 21 and over (or under 21 with a child). Not modelled: Working Credit (see the <Link href="/centrelink-working-credit-calculator/" className={LINK}>Working Credit calculator</Link>), Work Bonus at Age Pension age, deeming, transitional rates, Rent Assistance, Pharmaceutical Allowance. Permanently blind DSP recipients have no income or assets test unless they get Rent Assistance.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
          <W3Section title={`DSP Rates From ${DSP.ratesFrom}`}>
            <p className={P}>For people 21 and over, and under-21s with a child in their care, DSP is paid at the pension rate. These are Services Australia&apos;s figures, adjusted every {DSP.indexation.adult}.</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Per fortnight</th><th scope="col" className={TH + " text-right"}>Single</th><th scope="col" className={TH + " text-right"}>Couple each</th><th scope="col" className={TH + " text-right"}>Couple combined</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {([["Maximum basic rate", "basic"], ["Pension Supplement", "supplement"], ["Energy Supplement", "energy"], ["Total", "total"]] as const).map(([label, f]) => (
                    <tr key={f} className={f === "total" ? "bg-eucalyptus-light/30 font-bold" : undefined}>
                      <td className={TD}>{label}</td>
                      <td className={TD + " text-right"}>{formatAUD(R.maxFortnightly.single[f], 2)}</td>
                      <td className={TD + " text-right"}>{formatAUD(R.maxFortnightly.coupleEach[f], 2)}</td>
                      <td className={TD + " text-right"}>{formatAUD(R.maxFortnightly.coupleCombined[f], 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">A couple separated due to ill health each get the single rate. The Services Australia DSP page prints the couple Pension Supplement as $65.50 each, but its own totals ({formatAUD(R.maxFortnightly.coupleEach.total, 2)} / {formatAUD(R.maxFortnightly.coupleCombined.total, 2)}) only add up with {formatAUD(R.maxFortnightly.coupleEach.supplement, 2)}, the Age Pension figure, which is what we show. The totals are what you are paid.</p>
          </W3Section>

          <W3Section title="DSP Rates for Under 21s">
            <p className={P}>If you are under 21 and have no dependent children, DSP is paid at youth rates. They include the Youth Disability Supplement but not the Pharmaceutical Allowance or Energy Supplement, and they are updated on {DSP.indexation.youth}. Your parents&apos; income doesn&apos;t affect them.</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your situation</th><th scope="col" className={TH + " text-right"}>Maximum a fortnight</th><th scope="col" className={TH + " text-right"}>Income cut-off</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {DSP_UNDER_21.map((r, i) => (
                    <tr key={r.situation} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                      <td className={TD}>{r.situation}</td>
                      <td className={TD + " text-right font-bold"}>{formatAUD(r.maxFortnightly, 2)}</td>
                      <td className={TD + " text-right"}>{formatAUD(r.cutOff, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">Cut-offs are Services Australia&apos;s published figures for each age band (16 to 17 at home; 18 to 20 at home; 16 to 20 independent; 16 to 20 couple, combined).</p>
          </W3Section>

          <W3Section title="DSP Income Test">
            <p className={P}>Services Australia uses the pension income test for DSP. It counts your and your partner&apos;s income from all sources, including deemed income on financial assets.</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Single, income a fortnight</th><th scope="col" className={TH + " text-right"}>Reduction</th><th scope="col" className={TH + " text-right"}>DSP</th><th scope="col" className={TH + " text-right"}>Income + DSP</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TABLE_INCOMES.map((inc, i) => {
                    const pay = dspFortnightly(inc, "single").pay;
                    return (
                      <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                        <td className={TD + " font-medium"}>{formatAUD(inc, 2)}</td>
                        <td className={TD + " text-right"}>-{formatAUD(pensionReduction(inc, "single"), 2)}</td>
                        <td className={TD + " text-right font-bold"}>{formatAUD(pay, 2)}</td>
                        <td className={TD + " text-right"}>{formatAUD(pay + inc, 2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">Couples: {formatAUD(IT.couple.freeArea)} combined free area, then 25c per combined dollar off each payment; cut-off {formatAUD(DSP_CUT_OFFS_21_PLUS.coupleCombined, 2)} combined ({formatAUD(DSP_CUT_OFFS_21_PLUS.coupleApartIllHealthCombined, 2)} if living apart due to ill health). Working Credit can shield some of your pay if you are under Age Pension age.</p>
          </W3Section>

          <W3Section title="How Many Hours Can You Work on DSP?">
            <ul className="list-disc pl-6 space-y-1 text-warmgray mb-4">
              <li><strong>Up to {DSP.maxWeeklyWorkHours} hours a week:</strong> you keep DSP, subject to the income test.</li>
              <li><strong>{DSP.suspensionWeeklyHours} or more hours a week on an ongoing basis:</strong> DSP can be suspended for up to {DSP.suspensionYears} years. You can ask for it to be restored within that time if your hours or income drop, and you can keep your Pensioner Concession Card.</li>
              <li><strong>Income over the cut-off:</strong> DSP is $0 for that fortnight. After more than {DSP.nilRateFortnights} fortnights in a row it is suspended.</li>
              <li><strong>Exceptions:</strong> the {DSP.suspensionWeeklyHours}-hour rule doesn&apos;t apply if you work for an Australian Disability Enterprise, under the Supported Wage System, or with ongoing support from Inclusive Employment Australia.</li>
              <li><strong>Report every fortnight:</strong> your and your partner&apos;s gross pay and hours worked. Tell Services Australia within 14 days of starting work.</li>
            </ul>
            <Note>The hours rule and the income test are separate. Well under {DSP.maxWeeklyWorkHours} hours, a well-paid job can still cut DSP to $0 — the calculator shows both.</Note>
          </W3Section>

          <W3Section title="DSP Assets Test">
            <p className={P}>Your DSP is the lower of the income-test and assets-test results. Your home isn&apos;t counted, which is why homeowners have lower limits. Above the full-pension limit, DSP falls by $3 a fortnight per $1,000 (single) or $1.50 each (couples). Limits from {DSP.ratesFrom}, couples combined.</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Situation</th><th scope="col" className={TH + " text-right"}>Full pension up to</th><th scope="col" className={TH + " text-right"}>Part pension stops above</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>Single, homeowner</td><td className={TD + " text-right"}>{formatAUD(DSP_ASSETS.fullPension.singleHomeowner)}</td><td className={TD + " text-right"}>{formatAUD(DSP_ASSETS.cutOff.singleHomeowner)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Single, non-homeowner</td><td className={TD + " text-right"}>{formatAUD(DSP_ASSETS.fullPension.singleNonHomeowner)}</td><td className={TD + " text-right"}>{formatAUD(DSP_ASSETS.cutOff.singleNonHomeowner)}</td></tr>
                  <tr><td className={TD}>Couple, homeowner</td><td className={TD + " text-right"}>{formatAUD(DSP_ASSETS.fullPension.coupleHomeowner)}</td><td className={TD + " text-right"}>{formatAUD(DSP_ASSETS.cutOff.coupleHomeowner)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Couple, non-homeowner</td><td className={TD + " text-right"}>{formatAUD(DSP_ASSETS.fullPension.coupleNonHomeowner)}</td><td className={TD + " text-right"}>{formatAUD(DSP_ASSETS.cutOff.coupleNonHomeowner)}</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">Cut-offs are higher with Rent Assistance. Under-21s without children have separate cut-offs; see Services Australia&apos;s assets test page.</p>
          </W3Section>

          <W3Section title="Who Can Get DSP">
            <ul className="list-disc pl-6 space-y-1 text-warmgray">
              <li>You meet both the <strong>non-medical rules</strong> and the <strong>medical rules</strong>.</li>
              <li>Non-medical: you are at least {DSP.minClaimAge} and under Age Pension age when you claim (paid from 16), you meet the residence rules, and you pass the income and assets tests.</li>
              <li>Medical: Services Australia assesses how your condition affects you. Its pre-claim guide can help you decide whether to claim, but won&apos;t tell you if you&apos;ll get DSP.</li>
              <li>While a claim is assessed you may be able to get <Link href="/jobseeker-payment-calculator/" className={LINK}>JobSeeker Payment</Link> or Youth Allowance instead.</li>
            </ul>
            <p className={P + " mt-4"}>Services Australia says DSP is a taxable payment if you are Age Pension age. Wages from a job are taxed as normal; see your <Link href="/take-home-pay-calculator/" className={LINK}>take-home pay</Link>.</p>
          </W3Section>

          <W3Section title="Related Calculators and Guides">
            <W3Related current="dsp" />
          </W3Section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>DSP (21+) = maximum rate − 50c per $1 of assessable income over {formatAUD(IT.single.freeArea)} (single), or − 25c per combined $1 over {formatAUD(IT.couple.freeArea)} for each member of a couple, floored at $0. This is the pension income test Services Australia applies to DSP, and it reproduces the published cut-offs ({formatAUD(DSP_CUT_OFFS_21_PLUS.single, 2)} single, {formatAUD(DSP_CUT_OFFS_21_PLUS.coupleCombined, 2)} couple) exactly; the tests assert it.</li>
              <li>Assets test: $3 per $1,000 over the limit (single; $1.50 each for couples), applied in $250 steps, which reproduces every published assets cut-off. You are paid the lower of the two results.</li>
              <li>Rates are the {DSP.ratesFrom} figures, read on {DSP_VERIFIED_ON}. {SITE_CONFIG.name} is not Services Australia; use their Payment Finder for a claim estimate.</li>
            </ul>
          </MethodologyDisclosure>

          <W3Faqs faqs={DSP_FAQS} topic="Disability Support Pension" />
          <W3Footer sources={SOURCES_LIST} lastVerified={DSP_VERIFIED_ON} authorKey="disability-support-pension-calculator" />
        </div>
      </div>
    </div>
  );
}

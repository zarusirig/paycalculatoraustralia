"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatNegAUD } from "@/lib/constants";
import {
  AGE_PENSION_INCOME_TEST,
  WORK_BONUS,
  agePensionFortnightly,
  assessableAfterWorkBonus,
  pensionReduction,
  type PensionSituation,
} from "@/lib/constants/centrelink-income-test";
import {
  CARER_ALLOWANCE,
  CARER_PAYMENT,
  CARER_PAYMENT_RATES,
  carerPaymentWithinHoursLimit,
} from "@/lib/constants/centrelink-carer-and-support";
import { FONT, INPUT, LABEL, LINK, Row } from "./centrelink-shared";
import { MoneyInput, W3Hero } from "./centrelink-w3-shared";

// DataForSEO 23 Sep 2026: "carer payment centrelink" 6.6k, "carer payment"
// 5.4k (KD 0). Framed as "how your work and income change the payment" —
// the income test is the pension test (Services Australia: "We use the
// pension income test to assess Carer Payment").

const R = CARER_PAYMENT_RATES;
const IT = AGE_PENSION_INCOME_TEST;
const CP = CARER_PAYMENT;

/**
 * The interactive part of /carer-payment-calculator/: hero and calculator
 * card. The static long-form content is server-rendered
 * (carer-payment-calculator-content.tsx) and passed in as `children`.
 */
export default function CarerPaymentCalculatorPage({ children, afterCalculator }: { children: React.ReactNode; afterCalculator?: React.ReactNode }) {
  const [situation, setSituation] = useState<PensionSituation>("single");
  const [employment, setEmployment] = useState(500);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);
  const [agePensionAge, setAgePensionAge] = useState(false);
  const [balance, setBalance] = useState(0);
  const [hours, setHours] = useState(60);

  const result = useMemo(() => {
    // Work Bonus only for carers of Age Pension age (Services Australia, who-can-get-work-bonus).
    const ownEmployment = agePensionAge ? assessableAfterWorkBonus(employment, balance) : employment;
    const assessable = ownEmployment + otherIncome + (situation === "couple" ? partnerIncome : 0);
    const pay = agePensionFortnightly(assessable, situation, R);
    const max = situation === "single" ? R.maxFortnightly.single.total : R.maxFortnightly.coupleEach.total;
    return {
      assessable,
      workBonusSaved: employment - ownEmployment,
      reduction: pensionReduction(assessable, situation),
      pay,
      max,
      withinHours: carerPaymentWithinHoursLimit(hours),
    };
  }, [situation, employment, partnerIncome, otherIncome, agePensionAge, balance, hours]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <W3Hero crumb="Carer Payment Calculator" title="Carer Payment Calculator 2026 — Rates, Income Test and Work Hours">
          <p>
            Carer Payment is {formatAUD(R.maxFortnightly.single.total, 2)} a fortnight single and {formatAUD(R.maxFortnightly.coupleEach.total, 2)} each for a couple from {CP.ratesFrom}. Enter your pay to see how much you keep: the payment reduces by 50 cents for each dollar over {formatAUD(IT.single.freeArea)} a fortnight (single), and you can work up to {CP.workHoursLimit} hours in 4 weeks and still get it.
          </p>
        </W3Hero>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">How Much Carer Payment Do You Get?</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="situation" className={LABEL}>You are</label>
                    <select id="situation" value={situation} onChange={(e) => setSituation(e.target.value as PensionSituation)} className={INPUT}>
                      <option value="single">Single</option>
                      <option value="couple">Partnered (living together)</option>
                    </select>
                  </div>
                  <MoneyInput id="employment" label="Your gross pay this fortnight" value={employment} onChange={setEmployment} max={10_000} />
                  <div>
                    <label htmlFor="hours" className={LABEL}>Hours worked in the last 4 weeks</label>
                    <input id="hours" type="number" min={0} max={400} value={hours} onChange={(e) => setHours(Math.max(0, Math.min(400, Number(e.target.value || 0))))} className={INPUT} />
                    <p className="text-xs text-warmgray-light mt-1">Paid work and self-employment only. Travel, study, training and volunteering don&apos;t count.</p>
                  </div>
                  {situation === "couple" && (
                    <MoneyInput id="partner" label="Partner's gross income this fortnight" value={partnerIncome} onChange={setPartnerIncome} max={20_000} />
                  )}
                  <MoneyInput id="other" label={`Other assessable income this fortnight${situation === "couple" ? " (combined)" : ""}`} value={otherIncome} onChange={setOtherIncome} max={10_000} hint="Deemed income on savings and shares, rent, super income streams." />
                  <div className="flex items-start gap-2">
                    <input id="apa" type="checkbox" checked={agePensionAge} onChange={(e) => setAgePensionAge(e.target.checked)} className="mt-1" />
                    <label htmlFor="apa" className="text-sm text-navy">I am Age Pension age or older (the Work Bonus applies)</label>
                  </div>
                  {agePensionAge && (
                    <MoneyInput id="balance" label="Your Work Bonus balance" value={balance} onChange={setBalance} max={WORK_BONUS.maxBalance} step={100} hint={`Up to ${formatAUD(WORK_BONUS.maxBalance)}. Shown in your Centrelink online account.`} />
                  )}
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">{situation === "couple" ? "Carer Payment (yours), this fortnight" : "Carer Payment this fortnight"}</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(result.pay, 2)}</div>
                    <div className="text-sm text-warmgray">of the {formatAUD(result.max, 2)} maximum · plus {formatAUD(employment, 2)} pay = {formatAUD(result.pay + employment, 2)} before tax</div>
                  </div>
                  <div className={`rounded-xl border p-4 text-sm ${result.withinHours ? "border-eucalyptus bg-eucalyptus-light/40" : "border-ochre/40 bg-ochre/10"} text-navy`}>
                    {result.withinHours
                      ? <><strong>{hours} hours in 4 weeks — within the {CP.workHoursLimit}-hour limit.</strong> You still need to provide care for a significant period each day.</>
                      : <><strong>{hours} hours in 4 weeks is over the {CP.workHoursLimit}-hour limit.</strong> You can use respite days (up to {CP.respiteDaysPerYear} a calendar year) to cover it, or the payment can be suspended for up to {CP.suspensionMonths} months and restored if your hours drop.</>}
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How the income test applied</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Your pay" value={formatAUD(employment, 2)} />
                      {agePensionAge && <Row label={`Work Bonus (first ${formatAUD(WORK_BONUS.fortnightlyCredit)}, then balance)`} value={formatNegAUD(result.workBonusSaved, 2)} />}
                      {situation === "couple" && <Row label="Partner's income" value={formatAUD(partnerIncome, 2)} />}
                      <Row label="Other income" value={formatAUD(otherIncome, 2)} />
                      <Row label={situation === "couple" ? "Combined assessable income" : "Assessable income"} value={formatAUD(result.assessable, 2)} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label="Maximum rate (from 20 Sep 2026)" value={formatAUD(result.max, 2)} />
                      <Row label={`${situation === "couple" ? "25c" : "50c"} per $1 over ${formatAUD(IT[situation].freeArea)}${situation === "couple" ? " (combined)" : ""}`} value={formatNegAUD(result.reduction, 2)} />
                      <Row label="Carer Payment" value={formatAUD(result.pay, 2)} bold highlight />
                      <Row label="Cut-off" value={situation === "single" ? formatAUD(R.publishedCutOff.single, 2) : `${formatAUD(R.publishedCutOff.coupleCombined, 2)} combined`} />
                    </div>
                  </div>
                  <p className="text-xs text-warmgray-light">Income test only. Not modelled: the assets test (limits below), deeming, transitional rates, Rent Assistance. Services Australia pays the lower of the income-test and assets-test results. Carer Allowance ({formatAUD(CARER_ALLOWANCE.fortnightly, 2)}) is paid on top if you qualify — see <Link href="/carer-allowance/" className={LINK}>Carer Allowance</Link>.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
          {afterCalculator}
          {children}
        </div>
      </div>
    </div>
  );
}

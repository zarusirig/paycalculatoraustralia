"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import {
  WORKING_CREDIT,
  accrueWorkingCredit,
  projectJobseekerWithCredit,
  workingCreditAccrual,
} from "@/lib/constants/working-credit";
import { JOBSEEKER_INCOME_TEST } from "@/lib/constants/centrelink-income-test";
import { useCentrelinkRates } from "./centrelink-shared";
import { CALC_FONT, NOTE_OK, NumberField, RESULT_LIST, ResultRow, SelectField } from "./t3-calc-shared";

// Working Credit: build a balance, then see how it keeps JobSeeker paying when
// you start work. Accrual and depletion follow the DSS guide (3.1.11.20 and
// 3.1.11.30) in lib/constants/working-credit.ts; JobSeeker rates follow the
// dated rate set in force today (useCentrelinkRates).

type Circumstance = "single" | "singleWithChildren" | "principalCarer" | "partnered";
type Payment = "jobseeker" | "youth";

const CIRCUMSTANCES: readonly { value: Circumstance; label: string }[] = [
  { value: "single", label: "Single, no children" },
  { value: "singleWithChildren", label: "Single, with a dependent child" },
  { value: "principalCarer", label: "Single principal carer" },
  { value: "partnered", label: "Partnered (partner's income ignored)" },
];

export default function WorkingCreditCalculator() {
  const rates = useCentrelinkRates();
  const [payment, setPayment] = useState<Payment>("jobseeker");
  const [startBalance, setStartBalance] = useState(0);
  const [idleIncome, setIdleIncome] = useState(0);
  const [fortnightsIdle, setFortnightsIdle] = useState(10);
  const [wages, setWages] = useState(900);
  const [circumstance, setCircumstance] = useState<Circumstance>("single");

  const maxBalance = payment === "youth" ? WORKING_CREDIT.maxBalanceYouthAllowanceJobSeeker : WORKING_CREDIT.maxBalance;
  const perFortnight = workingCreditAccrual(idleIncome);
  const balance = useMemo(
    () => accrueWorkingCredit(Math.min(startBalance, maxBalance), idleIncome, fortnightsIdle, maxBalance),
    [startBalance, idleIncome, fortnightsIdle, maxBalance],
  );

  const maxRate = rates.jobseeker.maxFortnightly[circumstance === "principalCarer" ? "singleWithChildren" : circumstance];
  const projection = useMemo(
    () => (payment === "jobseeker" ? projectJobseekerWithCredit(balance, wages, maxRate, 6, circumstance === "principalCarer") : []),
    [payment, balance, wages, maxRate, circumstance],
  );
  const extra = projection.reduce((a, p) => a + (p.paymentWithCredit - p.paymentWithoutCredit), 0);

  return (
    <Card className="shadow-md not-prose" id="working-credit-calculator">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={CALC_FONT}>Centrelink Working Credit Calculator</h2>
        <p className="text-sm text-warmgray mb-6">Step 1 builds your balance while you earn under ${WORKING_CREDIT.accrualThreshold} a fortnight. Step 2 shows how the credits keep your JobSeeker Payment going when you start work.</p>
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={(e) => e.preventDefault()} className="grid gap-4 sm:grid-cols-2 content-start">
            <div className="sm:col-span-2">
              <SelectField id="wc-payment" label="Payment" value={payment} onChange={setPayment} options={[{ value: "jobseeker", label: "JobSeeker Payment (max 1,000 credits)" }, { value: "youth", label: "Youth Allowance as a job seeker (max 3,500)" }]} />
            </div>
            <p className="sm:col-span-2 text-xs font-semibold uppercase tracking-wider text-warmgray">Step 1 · Build credits</p>
            <NumberField id="wc-start" label="Credits you have now" hint="Shown in your Centrelink online account." value={startBalance} onChange={setStartBalance} step={10} max={maxBalance} />
            <NumberField id="wc-idle" label="Income per fortnight while building" hint="Work and investment income, not Centrelink payments." value={idleIncome} onChange={setIdleIncome} step={5} />
            <NumberField id="wc-fns" label="Fortnights at that income" value={fortnightsIdle} onChange={setFortnightsIdle} step={1} max={200} />
            <p className="sm:col-span-2 text-xs font-semibold uppercase tracking-wider text-warmgray">Step 2 · Start work</p>
            <NumberField id="wc-wages" label="Gross wages per fortnight" value={wages} onChange={setWages} step={50} />
            {payment === "jobseeker" && (
              <SelectField id="wc-circ" label="Your JobSeeker rate" value={circumstance} onChange={setCircumstance} options={CIRCUMSTANCES} />
            )}
          </form>

          <div className="space-y-4">
            <dl className={RESULT_LIST}>
              <ResultRow label="Credits earned per fortnight" value={perFortnight.toLocaleString("en-AU")} />
              <ResultRow label="Working Credit balance" value={`${balance.toLocaleString("en-AU")} of ${maxBalance.toLocaleString("en-AU")}`} bold />
              <ResultRow label="Worth, in employment income ignored" value={formatAUD(balance)} muted />
            </dl>
            {payment === "jobseeker" ? (
              <>
                <div className="overflow-x-auto rounded-xl border border-sandstone-dark/20">
                  <table className="w-full text-sm text-navy">
                    <thead className="bg-sandstone text-left">
                      <tr><th className="px-3 py-2">Fortnight</th><th className="px-3 py-2 text-right">Credits used</th><th className="px-3 py-2 text-right">JobSeeker with credits</th><th className="px-3 py-2 text-right">Without</th><th className="px-3 py-2 text-right">Left</th></tr>
                    </thead>
                    <tbody className="divide-y divide-sandstone-dark/20 tabular-nums">
                      {projection.map((p) => (
                        <tr key={p.fortnight}><td className="px-3 py-2">{p.fortnight}</td><td className="px-3 py-2 text-right">{p.depleted.toLocaleString("en-AU")}</td><td className="px-3 py-2 text-right font-medium">{formatAUD(p.paymentWithCredit, 2)}</td><td className="px-3 py-2 text-right text-warmgray">{formatAUD(p.paymentWithoutCredit, 2)}</td><td className="px-3 py-2 text-right">{p.balanceEnd.toLocaleString("en-AU")}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={NOTE_OK} role="status" aria-live="polite">
                  {extra > 0
                    ? `Your credits are worth an extra ${formatAUD(extra, 2)} of JobSeeker over these 6 fortnights, on top of your ${formatAUD(wages)} wages.`
                    : balance === 0
                      ? `With no credits, every dollar over the ${formatAUD(JOBSEEKER_INCOME_TEST.freeArea)} income free area counts from your first pay.`
                      : `Your wages are at or under the ${formatAUD(JOBSEEKER_INCOME_TEST.freeArea)} income free area, so no credits are needed and your balance is kept.`}
                </p>
                <p className="text-xs text-warmgray-light">
                  JobSeeker rates from {rates.label}. Income test only; assets test, Rent Assistance and partner income aren&rsquo;t modelled. For the rate with no credits, use the <Link href="/jobseeker-payment-calculator/" className="underline">JobSeeker payment calculator</Link>.
                </p>
              </>
            ) : (
              <p className={NOTE_OK}>Each credit offsets $1 of employment income above your income free area until the balance runs out. Youth Allowance job seekers can hold up to 3,500 credits. See the <Link href="/centrelink-income-test/" className="underline">Centrelink income test</Link> for how income reduces the payment after that.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

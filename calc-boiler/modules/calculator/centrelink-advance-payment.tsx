"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatNegAUD } from "@/lib/constants";
import {
  ADVANCE_LIMITS,
  ADVANCE_RULES,
  advanceRepayment,
  clampAdvance,
  paymentWhileRepaying,
  type AdvanceKind,
} from "@/lib/constants/centrelink-carer-and-support";
import { AGE_PENSION_RATES, JOBSEEKER_RATES, SEPTEMBER_2026 } from "@/lib/constants/centrelink-income-test";
import { FONT, INPUT, LABEL, Row } from "./centrelink-shared";
import { MoneyInput, Note, W3Hero } from "./centrelink-w3-shared";

// DataForSEO 23 Sep 2026: "centrelink advance payment" 5.4k. Small calculator:
// advance → repayment per fortnight → what lands in your account.
//
// The static long-form content is server-rendered
// (centrelink-advance-payment-content.tsx) and passed in as `children`.

const KINDS: AdvanceKind[] = ["allowance", "pensionSingle", "pensionCouple", "ftb"];

/** Sensible default fortnightly payment per kind, from figures this site holds. */
const DEFAULT_PAYMENT: Record<AdvanceKind, number> = {
  allowance: JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly.single,
  pensionSingle: AGE_PENSION_RATES[SEPTEMBER_2026].maxFortnightly.single.total,
  pensionCouple: AGE_PENSION_RATES[SEPTEMBER_2026].maxFortnightly.coupleEach.total,
  ftb: 300,
  specialEmployment: JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly.single,
};

export default function CentrelinkAdvancePaymentPage({ children, afterCalculator }: { children: ReactNode; afterCalculator?: ReactNode }) {
  const [kind, setKind] = useState<AdvanceKind>("allowance");
  const [advance, setAdvance] = useState(500);
  const [payment, setPayment] = useState(DEFAULT_PAYMENT.allowance);

  const lim = ADVANCE_LIMITS[kind];
  const r = useMemo(() => {
    const amount = clampAdvance(kind, advance);
    const repay = advanceRepayment(amount);
    return { amount, repay, net: paymentWhileRepaying(payment, amount), totalRepaid: Math.round(repay * ADVANCE_RULES.repaymentFortnights * 100) / 100 };
  }, [kind, advance, payment]);

  function changeKind(k: AdvanceKind) {
    setKind(k);
    setAdvance(ADVANCE_LIMITS[k].max);
    setPayment(DEFAULT_PAYMENT[k]);
  }

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <W3Hero crumb="Centrelink Advance Payment" title="Centrelink Advance Payment Calculator — How Much and What You Repay">
          <p>
            An advance is part of your Centrelink payment paid early as a lump sum. You repay it automatically: the advance divided by {ADVANCE_RULES.repaymentFortnights} comes out of each of your next {ADVANCE_RULES.repaymentFortnights} payments. On JobSeeker, Parenting Payment, Youth Allowance or Austudy it is {formatAUD(250)} to {formatAUD(500)}; on a pension, up to {formatAUD(ADVANCE_LIMITS.pensionSingle.max, 2)} single.
          </p>
        </W3Hero>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">Advance Repayment Calculator</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="kind" className={LABEL}>Your payment</label>
                    <select id="kind" value={kind} onChange={(e) => changeKind(e.target.value as AdvanceKind)} className={INPUT}>
                      {KINDS.map((k) => <option key={k} value={k}>{ADVANCE_LIMITS[k].label}</option>)}
                    </select>
                  </div>
                  <MoneyInput id="advance" label="Advance you want" value={advance} onChange={setAdvance} max={lim.max} step={10}
                    hint={lim.min !== null ? `Between ${formatAUD(lim.min, 2)} and ${formatAUD(lim.max, 2)}.` : `FTB advances can't total more than ${formatAUD(lim.max, 2)}; your own limit depends on your FTB rate.`} />
                  <MoneyInput id="payment" label="Your usual payment a fortnight" value={payment} onChange={setPayment} max={5_000} hint="Before the advance repayment. The starting figure is only an example — enter your own." />
                </form>
                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Repayment each fortnight</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(r.repay, 2)}</div>
                    <div className="text-sm text-warmgray">for {ADVANCE_RULES.repaymentFortnights} fortnights on a {formatAUD(r.amount, 2)} advance</div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 p-5 space-y-3 text-sm">
                    <Row label="Advance paid to you" value={formatAUD(r.amount, 2)} />
                    <Row label={`Repayment (÷ ${ADVANCE_RULES.repaymentFortnights})`} value={formatNegAUD(r.repay, 2)} />
                    <Row label="Your usual payment" value={formatAUD(payment, 2)} />
                    <Row label="Paid to you each fortnight while repaying" value={formatAUD(r.net, 2)} bold highlight />
                    <Row label={`Repaid over ${ADVANCE_RULES.repaymentFortnights} fortnights (about 6 months)`} value={formatAUD(r.totalRepaid, 2)} />
                  </div>
                  {advance !== r.amount && <Note tone="warn">You entered {formatAUD(advance, 2)}; the advance has been limited to the range for this payment.</Note>}
                  <p className="text-xs text-warmgray-light">We round each repayment to the cent, so 13 of them can differ from the advance by a few cents. You can ask to repay faster, or repay early.</p>
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

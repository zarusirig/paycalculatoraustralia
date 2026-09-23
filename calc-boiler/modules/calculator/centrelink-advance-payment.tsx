"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import { formatAUD, SITE_CONFIG } from "@/lib/constants";
import {
  ADVANCE_LIMITS,
  ADVANCE_RULES,
  CARER_SUPPORT_SOURCES as SRC,
  advanceRepayment,
  clampAdvance,
  paymentWhileRepaying,
  type AdvanceKind,
} from "@/lib/constants/centrelink-carer-and-support";
import { AGE_PENSION_RATES, JOBSEEKER_RATES, SEPTEMBER_2026 } from "@/lib/constants/centrelink-income-test";
import { FONT, INPUT, LABEL, LINK, P, Row, TABLE_WRAP, TD, TH, source } from "./centrelink-shared";
import { MoneyInput, Note, W3Faqs, W3Footer, W3Hero, W3Related, W3Section } from "./centrelink-w3-shared";
import { ADVANCE_FAQS } from "./centrelink-w3-faqs";

// DataForSEO 23 Sep 2026: "centrelink advance payment" 5.4k. Small calculator:
// advance → repayment per fortnight → what lands in your account.

const KINDS: AdvanceKind[] = ["allowance", "pensionSingle", "pensionCouple", "ftb"];

/** Sensible default fortnightly payment per kind, from figures this site holds. */
const DEFAULT_PAYMENT: Record<AdvanceKind, number> = {
  allowance: JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly.single,
  pensionSingle: AGE_PENSION_RATES[SEPTEMBER_2026].maxFortnightly.single.total,
  pensionCouple: AGE_PENSION_RATES[SEPTEMBER_2026].maxFortnightly.coupleEach.total,
  ftb: 300,
  specialEmployment: JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly.single,
};

const SOURCES_LIST = [
  source("Advance payment", SRC.advancePayment),
  source("Centrelink online account help — apply for an advance payment", SRC.advancePaymentHowToApply),
];

export default function CentrelinkAdvancePaymentPage() {
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
                    <Row label={`Repayment (÷ ${ADVANCE_RULES.repaymentFortnights})`} value={`-${formatAUD(r.repay, 2)}`} />
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
          <W3Section title="How Much Advance Can You Get?">
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Payment</th><th scope="col" className={TH + " text-right"}>Lowest</th><th scope="col" className={TH + " text-right"}>Highest</th><th scope="col" className={TH + " text-right"}>Repayment on highest</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {(["allowance", "pensionSingle", "pensionCouple", "specialEmployment", "ftb"] as AdvanceKind[]).map((k, i) => (
                    <tr key={k} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                      <td className={TD}>{ADVANCE_LIMITS[k].label}</td>
                      <td className={TD + " text-right"}>{ADVANCE_LIMITS[k].min !== null ? formatAUD(ADVANCE_LIMITS[k].min as number, 2) : "—"}</td>
                      <td className={TD + " text-right"}>{formatAUD(ADVANCE_LIMITS[k].max, 2)}</td>
                      <td className={TD + " text-right"}>{formatAUD(advanceRepayment(ADVANCE_LIMITS[k].max), 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">Pension amounts change with pension rates each March and September; these are the figures published after the 20 September 2026 change. If you get a part-rate pension, or you are under 21 on Disability Support Pension, the advance is worked out from the pension you actually get. Farm Household Allowance: {formatAUD(250)} to {formatAUD(500)}. FTB Part A: a regular advance is {ADVANCE_RULES.ftbRegularAdvancePercent}% of the standard rate for one child under 13, paid every 26 weeks; a one-off advance is up to {ADVANCE_RULES.ftbOneOffPercent}% of your annual rate.</p>
          </W3Section>

          <W3Section title="Who Can Get an Advance Payment?">
            <ul className="list-disc pl-6 space-y-1 text-warmgray">
              <li><strong>After at least {ADVANCE_RULES.monthsOnPaymentBeforeApplying} months on:</strong> Age Pension, Carer Payment, Disability Support Pension, Farm Household Allowance, JobSeeker Payment, Parenting Payment or Youth Allowance (job seeker).</li>
              <li><strong>At any time on:</strong> ABSTUDY Living Allowance, Austudy, Youth Allowance (students), Family Tax Benefit Part A or Mobility Allowance.</li>
              <li><strong>Once in 12 months</strong> on ABSTUDY, Austudy, Farm Household Allowance, Mobility Allowance, JobSeeker, Parenting Payment (unless you became single in the past 28 days) and Youth Allowance.</li>
              <li><strong>Pensions:</strong> in any 6 months or 13 fortnights, one advance at the highest amount, up to two smaller advances, or three at the lowest amount. You can take it all at once or in 2 instalments.</li>
            </ul>
            <p className={P + " mt-4"}>You can&apos;t get one if you&apos;re still repaying an advance from more than 12 months ago, owe a debt to the Australian Government, can&apos;t afford to repay it within 6 months, have less than the lowest advance available, or are outside Australia. When you apply you&apos;ll be asked how much you have left each fortnight after regular expenses.</p>
          </W3Section>

          <W3Section title="Special Employment Advance">
            <p className={P}>A separate advance of {formatAUD(ADVANCE_LIMITS.specialEmployment.min ?? 0)} to {formatAUD(ADVANCE_LIMITS.specialEmployment.max)} for people who have been on Austudy, Carer Payment, Disability Support Pension, JobSeeker, Parenting Payment Single or Youth Allowance for at least 3 months and get a job of at least 6 weeks that will cut their payment by at least 50% — to buy things needed to start, such as work boots, tools or hi-vis — or whose employer hasn&apos;t paid them yet and won&apos;t for another 2 days. It is claimed with a form rather than online. Starting work will reduce your payment through the income test: see the <Link href="/jobseeker-payment-calculator/" className={LINK}>JobSeeker payment calculator</Link>.</p>
          </W3Section>

          <W3Section title="How to Apply">
            <ol className="list-decimal pl-6 space-y-1 text-warmgray">
              <li>Sign in to myGov, go to Centrelink, then Payments and claims → Manage payments → Manage advance payments (or Apply for Advance). You&apos;ll see whether you&apos;re eligible now or when you will be.</li>
              <li>Enter how much you have left each fortnight after rent, food, bills, travel and other regular costs.</li>
              <li>Choose an amount within the range shown, and one payment or two instalments (FTB advances are one instalment).</li>
              <li>Review the fortnightly repayment, agree to the declaration and submit. You get a receipt straight away saying whether it was successful.</li>
            </ol>
            <p className={P + " mt-4"}>You can also apply in the Express Plus Centrelink app, by phone self service, by calling your payment line or at a service centre. If you have a nominee, you can&apos;t apply through your own online account.</p>
          </W3Section>

          <W3Section title="Related Calculators and Guides">
            <W3Related current="advance" />
          </W3Section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>Repayment = advance ÷ {ADVANCE_RULES.repaymentFortnights}, to the cent, as Services Australia states. Paid to you = usual payment − repayment, floored at $0.</li>
              <li>Advance limits are Services Australia&apos;s published figures, read {SRC.verifiedOn}. The calculator does not check eligibility, previous advances or debts.</li>
              <li>{SITE_CONFIG.name} is not Services Australia. Your online account shows your actual range.</li>
            </ul>
          </MethodologyDisclosure>

          <W3Faqs faqs={ADVANCE_FAQS} topic="Centrelink advance payment" />
          <W3Footer sources={SOURCES_LIST} lastVerified={SRC.verifiedOn} authorKey="centrelink-advance-payment" />
        </div>
      </div>
    </div>
  );
}

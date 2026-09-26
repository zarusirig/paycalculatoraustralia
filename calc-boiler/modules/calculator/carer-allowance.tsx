"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD } from "@/lib/constants";
import {
  CARER_ALLOWANCE,
  CARER_PAYMENT,
  CARER_PAYMENT_RATES,
  carerAllowanceFortnightly,
} from "@/lib/constants/centrelink-carer-and-support";
import { agePensionFortnightly } from "@/lib/constants/centrelink-income-test";
import { FONT, INPUT, LABEL, LINK, Row } from "./centrelink-shared";
import { MoneyInput, W3Hero } from "./centrelink-w3-shared";

// DataForSEO 23 Sep 2026: "carer allowance" 5.4k KD4, "centrelink carers
// allowance" 5.4k. Page answers amount + income limit + how it combines with
// Carer Payment and work.

const CA = CARER_ALLOWANCE;
const FORTNIGHTS = 26;

/**
 * The interactive part of /carer-allowance/: hero and calculator card. The
 * static long-form content is server-rendered (carer-allowance-content.tsx)
 * and passed in as `children`.
 */
export default function CarerAllowancePage({ children, afterCalculator }: { children: React.ReactNode; afterCalculator?: React.ReactNode }) {
  const [income, setIncome] = useState(90_000);
  const [share, setShare] = useState(100);
  const [onCarerPayment, setOnCarerPayment] = useState(false);
  const [wages, setWages] = useState(400);

  const r = useMemo(() => {
    const ca = carerAllowanceFortnightly(income, share);
    const cp = onCarerPayment ? agePensionFortnightly(wages, "single", CARER_PAYMENT_RATES) : 0;
    const supplements = (ca > 0 ? CA.carerSupplementAnnual : 0) + (onCarerPayment && cp > 0 ? CARER_PAYMENT.carerSupplementAnnual : 0);
    return { ca, cp, supplements, yearly: (ca + cp) * FORTNIGHTS + supplements };
  }, [income, share, onCarerPayment, wages]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <W3Hero crumb="Carer Allowance" title="Carer Allowance 2026 — How Much, Income Limit and Working">
          <p>
            Carer Allowance is <strong>{formatAUD(CA.fortnightly, 2)} a fortnight</strong>, a set rate that isn&apos;t taxed. Your wages don&apos;t reduce it: the only income test is that you and your partner&apos;s combined adjusted taxable income is under {formatAUD(CA.incomeLimit)} a year. You can get it on top of Carer Payment, and each brings a {formatAUD(CA.carerSupplementAnnual)} Carer Supplement every year.
          </p>
        </W3Hero>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">Carer Allowance Calculator</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <MoneyInput id="ati" label="Your + partner's adjusted taxable income (a year)" value={income} onChange={setIncome} max={1_000_000} step={1_000} hint="Before tax. Use your own income if you're single." />
                  <div>
                    <label htmlFor="share" className={LABEL}>Your share of the care (%)</label>
                    <input id="share" type="number" min={0} max={100} value={share} onChange={(e) => setShare(Math.max(0, Math.min(100, Number(e.target.value || 0))))} className={INPUT} />
                    <p className="text-xs text-warmgray-light mt-1">100% unless you share care with another carer (not your partner) who also claims.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <input id="cp" type="checkbox" checked={onCarerPayment} onChange={(e) => setOnCarerPayment(e.target.checked)} className="mt-1" />
                    <label htmlFor="cp" className="text-sm text-navy">I also get Carer Payment (single)</label>
                  </div>
                  {onCarerPayment && <MoneyInput id="wages" label="Your gross pay this fortnight" value={wages} onChange={setWages} max={10_000} hint="Carer Payment has an income test; Carer Allowance doesn't." />}
                </form>
                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Carer Allowance this fortnight</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(r.ca, 2)}</div>
                    <div className="text-sm text-warmgray">{r.ca === 0 ? `Combined income is ${formatAUD(CA.incomeLimit)} or more — not eligible` : `${formatAUD(r.ca * FORTNIGHTS, 2)} over 26 fortnights, not taxable`}</div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 p-5 space-y-3 text-sm">
                    <Row label="Carer Allowance (fortnight)" value={formatAUD(r.ca, 2)} />
                    {onCarerPayment && <Row label="Carer Payment after income test (fortnight)" value={formatAUD(r.cp, 2)} />}
                    <Row label="Carer Supplement (once a year)" value={formatAUD(r.supplements, 2)} />
                    <Row label="Total over a year (26 fortnights + supplements)" value={formatAUD(r.yearly, 2)} bold highlight />
                  </div>
                  <p className="text-xs text-warmgray-light">Carer Supplement is paid if you get the payment for a period that includes 1 July. Carer Payment is estimated with the single pension income test only — use the <Link href="/carer-payment-calculator/" className={LINK}>Carer Payment calculator</Link> for couples, the Work Bonus and the hours check.</p>
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

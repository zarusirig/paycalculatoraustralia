"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import { formatAUD, formatNegAUD } from "@/lib/constants";
import {
  FAMILY_PAYMENT_SOURCES,
  PARENTING_PAYMENT,
  ppsCutOff,
  ppsFortnightly,
  ppsFreeArea,
  ppsReduction,
  pppCombinedReduction,
  pppFortnightly,
  pppOwnReduction,
  pppPartnerReduction,
  type PartnerPensionStatus,
} from "@/lib/constants/centrelink-family-payments";
import { FONT, INPUT, LABEL, LINK, NotIncluded, Row, clamp } from "./centrelink-shared";

// DataForSEO 23 Sep 2026: "parenting payment single" 8.1k, "parenting payment"
// 6.6k, "single parent payment calculator" 2.4k, "parenting payment partnered"
// 2.4k (KD 0–3), fairworkmate #2–8. Framed as "how your pay changes your
// payment" — the site's border rule 3.

const PP = PARENTING_PAYMENT;
const S = PP.single;
const PT = PP.partnered;
type Status = "single" | "partnered";

/**
 * The interactive part of /parenting-payment-calculator/: hero and calculator
 * card. The static long-form content is server-rendered
 * (parenting-payment-calculator-content.tsx) and passed in as `children`
 * (renamed `content` here: `children` is the number-of-children state).
 */
export default function ParentingPaymentCalculatorPage({ children: content, afterCalculator }: { children: React.ReactNode; afterCalculator?: React.ReactNode }) {
  const [status, setStatus] = useState<Status>("single");
  const [children, setChildren] = useState(1);
  const [income, setIncome] = useState(600);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [partnerType, setPartnerType] = useState<PartnerPensionStatus>("notPension");

  const result = useMemo(() => {
    if (status === "single") {
      const pay = ppsFortnightly(income, children);
      return { max: S.maxFortnightly, pay, ownReduction: ppsReduction(income, children), partnerReduction: 0, total: pay + income, cutOff: ppsCutOff(children) };
    }
    const pay = pppFortnightly(income, partnerIncome, partnerType);
    const own = partnerType === "pension" ? pppCombinedReduction(income + partnerIncome) : pppOwnReduction(income);
    const partner = partnerType === "pension" ? 0 : pppPartnerReduction(partnerIncome);
    return { max: PT.maxFortnightly, pay, ownReduction: own, partnerReduction: partner, total: pay + income, cutOff: partnerType === "pension" ? PT.combined.publishedCutOff : PT.publishedOwnCutOff };
  }, [status, children, income, partnerIncome, partnerType]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><Link href="/centrelink-income-test/" className="hover:text-eucalyptus-dark hover:underline">Centrelink Income Test</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Parenting Payment Calculator</span></li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">Parenting Payment Calculator — Single and Partnered</h1>
          <p className="text-lg text-warmgray">
            Parenting Payment Single is <strong>{formatAUD(S.maxFortnightly, 2)} a fortnight</strong> ({formatAUD(S.basic, 2)} plus a {formatAUD(S.pensionSupplement, 2)} Pension Supplement) and Parenting Payment Partnered is <strong>{formatAUD(PT.maxFortnightly, 2)}</strong>, from {PP.ratesFrom}. Enter what you earn to see how much you keep: single parents lose 40 cents per dollar over {formatAUD(ppsFreeArea(1), 2)} a fortnight.
          </p>
          <p className="mt-3 inline-block rounded-full bg-eucalyptus-light/60 px-3 py-1 text-xs font-semibold text-navy">Rates from {PP.ratesFrom} · verified {FAMILY_PAYMENT_SOURCES.verifiedOn}</p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">How Much Parenting Payment Do You Keep?</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <div>
                    <label htmlFor="status" className={LABEL}>Your situation</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value as Status)} className={INPUT}>
                      <option value="single">Single (Parenting Payment Single)</option>
                      <option value="partnered">Partnered (Parenting Payment Partnered)</option>
                    </select>
                  </div>
                  {status === "single" && (
                    <div>
                      <label htmlFor="children" className={LABEL}>Children in your care</label>
                      <select id="children" value={children} onChange={(e) => setChildren(Number(e.target.value))} className={INPUT}>
                        {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} — free area {formatAUD(ppsFreeArea(n), 2)}</option>)}
                      </select>
                    </div>
                  )}
                  <div>
                    <label htmlFor="income" className={LABEL}>Your gross income this fortnight</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="income" min={0} max={6000} step={10} value={income} onChange={(e) => setIncome(clamp(Number(e.target.value || 0), 0, 6000))} className={INPUT} /></div>
                    <input type="range" min={0} max={3200} step={10} value={clamp(income, 0, 3200)} onChange={(e) => setIncome(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" tabIndex={-1} />
                    <p className="text-xs text-warmgray-light mt-1">Wages before tax, in the fortnight they are paid. Not sure? Use the <Link href="/fortnightly-pay-calculator/" className={LINK}>fortnightly pay calculator</Link>.</p>
                  </div>
                  {status === "partnered" && (
                    <>
                      <div>
                        <label htmlFor="partnerType" className={LABEL}>Your partner</label>
                        <select id="partnerType" value={partnerType} onChange={(e) => setPartnerType(e.target.value as PartnerPensionStatus)} className={INPUT}>
                          <option value="notPension">Works, or gets a non-pension payment (e.g. JobSeeker)</option>
                          <option value="pension">Gets a pension (Age, Disability Support or Carer Payment)</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="partnerIncome" className={LABEL}>Your partner&apos;s gross income this fortnight{partnerType === "pension" ? " (not counting their pension)" : ""}</label>
                        <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                          <input type="number" id="partnerIncome" min={0} max={10000} step={10} value={partnerIncome} onChange={(e) => setPartnerIncome(clamp(Number(e.target.value || 0), 0, 10000))} className={INPUT} /></div>
                      </div>
                    </>
                  )}
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Parenting Payment {status === "single" ? "Single" : "Partnered"} this fortnight</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(result.pay, 2)}</div>
                    <div className="text-sm text-warmgray">of the {formatAUD(result.max, 2)} maximum · {formatAUD(result.total, 2)} with your wages</div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How the income test applied</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label={`Maximum rate (from ${PP.ratesFrom})`} value={formatAUD(result.max, 2)} bold />
                      {status === "single" ? (
                        <Row label={`40c per $1 over ${formatAUD(ppsFreeArea(children), 2)}`} value={formatNegAUD(result.ownReduction, 2)} />
                      ) : partnerType === "pension" ? (
                        <Row label={`Combined income: 25c over ${formatAUD(PT.combined.freeArea)}, 30c over ${formatAUD(PT.combined.band1End)}`} value={formatNegAUD(result.ownReduction, 2)} />
                      ) : (
                        <>
                          <Row label={`Your income: 50c ${formatAUD(PT.freeArea)}–${formatAUD(PT.band1End)}, 60c above`} value={formatNegAUD(result.ownReduction, 2)} />
                          <Row label={`Partner: 60c per $1 over ${formatAUD(PT.partnerIncomeFreeArea, 2)}`} value={formatNegAUD(result.partnerReduction, 2)} />
                        </>
                      )}
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Payment" value={formatAUD(result.pay, 2)} bold highlight />
                      <Row label={status === "partnered" && partnerType === "pension" ? "Published cut-off (combined income)" : status === "partnered" ? "Published cut-off (your income, partner under their limit)" : "Published cut-off for your family"} value={formatAUD(result.cutOff, 2)} />
                    </div>
                  </div>
                  <NotIncluded items={["the assets test", "working credits", "Energy Supplement, Pharmaceutical Allowance and Rent Assistance (the published cut-off includes the first two, which is why it sits a little above where this payment reaches $0)", "the separated-couple and Age-Pension-age rates"]} />
                </div>
              </div>
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

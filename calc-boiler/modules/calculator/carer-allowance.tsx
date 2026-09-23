"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import { formatAUD, SITE_CONFIG } from "@/lib/constants";
import {
  CARER_ALLOWANCE,
  CARER_PAYMENT,
  CARER_PAYMENT_RATES,
  CARER_SUPPORT_SOURCES as SRC,
  carerAllowanceFortnightly,
} from "@/lib/constants/centrelink-carer-and-support";
import { agePensionFortnightly } from "@/lib/constants/centrelink-income-test";
import { FONT, INPUT, LABEL, LINK, P, Row, TABLE_WRAP, TD, TH, source } from "./centrelink-shared";
import { MoneyInput, Note, W3Faqs, W3Footer, W3Hero, W3Related, W3Section } from "./centrelink-w3-shared";
import { CARER_ALLOWANCE_FAQS } from "./centrelink-w3-faqs";

// DataForSEO 23 Sep 2026: "carer allowance" 5.4k KD4, "centrelink carers
// allowance" 5.4k. Page answers amount + income limit + how it combines with
// Carer Payment and work.

const CA = CARER_ALLOWANCE;
const FORTNIGHTS = 26;

const SOURCES_LIST = [
  source("Carer Allowance", SRC.carerAllowance),
  source("How much Carer Allowance you can get", SRC.carerAllowanceRates),
  source("Who can get Carer Allowance", SRC.carerAllowanceWho),
  source("Carer Supplement", SRC.carerSupplement),
  source("How much Carer Payment you can get", SRC.carerPaymentRates),
  source("Working while you get Carer Payment", SRC.carerPaymentWork),
];

export default function CarerAllowancePage() {
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
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
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
          <W3Section title="How Much Is Carer Allowance?">
            <p className={P}>{formatAUD(CA.fortnightly, 2)} a fortnight. It is a set rate — not reduced by your wages or savings — and it is adjusted on {CA.indexedOn} each year, not in March and September like the pensions. It isn&apos;t part of your taxable income. If you share the care of someone with another carer who is not your partner and they also claim, each of you gets a part payment based on the percentage of care you provide.</p>
            <p className={P}>If you get Carer Allowance for a period that includes 1 July, Services Australia also pays the <strong>{formatAUD(CA.carerSupplementAnnual)} Carer Supplement</strong> automatically, and the Child Disability Assistance Payment if you care for a child with disability or a severe medical condition.</p>
          </W3Section>

          <W3Section title="Carer Allowance Income Limit">
            <p className={P}>Your and your partner&apos;s combined <em>adjusted taxable income</em> must be less than <strong>{formatAUD(CA.incomeLimit)}</strong> per financial year. There is no assets test, and no income test for the person you care for. If you care for someone under 16 you also get a Health Care Card for them.</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Combined adjusted taxable income</th><th scope="col" className={TH + " text-right"}>Carer Allowance a fortnight</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {[60_000, 120_000, 200_000, 249_999, 250_000].map((inc, i) => (
                    <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}><td className={TD}>{formatAUD(inc)}</td><td className={TD + " text-right font-medium"}>{formatAUD(carerAllowanceFortnightly(inc), 2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </W3Section>

          <W3Section title="Carer Allowance vs Carer Payment">
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}></th><th scope="col" className={TH}>Carer Allowance</th><th scope="col" className={TH}>Carer Payment</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD + " font-medium"}>What it is</td><td className={TD}>Supplementary payment for daily care</td><td className={TD}>Income support at the pension rate for constant care</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD + " font-medium"}>Amount a fortnight</td><td className={TD}>{formatAUD(CA.fortnightly, 2)} set rate</td><td className={TD}>Up to {formatAUD(CARER_PAYMENT_RATES.maxFortnightly.single.total, 2)} single, {formatAUD(CARER_PAYMENT_RATES.maxFortnightly.coupleEach.total, 2)} each couple</td></tr>
                  <tr><td className={TD + " font-medium"}>Income test</td><td className={TD}>Combined ATI under {formatAUD(CA.incomeLimit)} a year</td><td className={TD}>Pension income test: 50c per $1 over $226 a fortnight (single)</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD + " font-medium"}>Assets test</td><td className={TD}>None</td><td className={TD}>Yes — you and the person you care for</td></tr>
                  <tr><td className={TD + " font-medium"}>Work</td><td className={TD}>Wages don&apos;t reduce it</td><td className={TD}>Up to {CARER_PAYMENT.workHoursLimit} hours in 4 weeks, and pay reduces it</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD + " font-medium"}>Care need</td><td className={TD}>Daily care, for at least 12 months or a terminal condition</td><td className={TD}>Constant care, for at least 6 months or end of life</td></tr>
                  <tr><td className={TD + " font-medium"}>Taxable?</td><td className={TD}>No</td><td className={TD}>Only if you or the person you care for are Age Pension age</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD + " font-medium"}>Carer Supplement</td><td className={TD}>{formatAUD(CA.carerSupplementAnnual)} a year</td><td className={TD}>{formatAUD(CARER_PAYMENT.carerSupplementAnnual)} a year</td></tr>
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>You can claim both at once with a combined claim. If your pay, your hours or your assets rule out Carer Payment, you may still get Carer Allowance.</p>
          </W3Section>

          <W3Section title="Working While Getting Carer Allowance">
            <Note>Carer Allowance has no fortnightly income test — Services Australia says &ldquo;your work income won&apos;t affect how much Carer Allowance you get if you and your partner earn less than {formatAUD(CA.incomeLimit)} a year.&rdquo; What matters is that you keep giving daily care and attention to the person, in their home or yours.</Note>
            <p className={P + " mt-4"}>So a carer earning, say, {formatAUD(1_500)} a fortnight keeps the full {formatAUD(CA.fortnightly, 2)} (if household income is under the limit), while the same wages would take Carer Payment down to {formatAUD(agePensionFortnightly(1_500, "single", CARER_PAYMENT_RATES), 2)} for a single carer. Check your take-home pay on wages plus payments with the <Link href="/take-home-pay-calculator/" className={LINK}>take-home pay calculator</Link> — Carer Allowance itself adds no tax.</p>
          </W3Section>

          <W3Section title="Related Calculators and Guides">
            <W3Related current="carer-allowance" />
          </W3Section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>Carer Allowance = {formatAUD(CA.fortnightly, 2)} × your share of care, or $0 when combined adjusted taxable income is {formatAUD(CA.incomeLimit)} or more (the limit is &ldquo;less than&rdquo; {formatAUD(CA.incomeLimit)}).</li>
              <li>Carer Supplement of {formatAUD(CA.carerSupplementAnnual)} per eligible payment, once a year. Yearly total assumes 26 fortnights.</li>
              <li>Figures read at Services Australia on {SRC.verifiedOn}. {SITE_CONFIG.name} is not Services Australia.</li>
            </ul>
          </MethodologyDisclosure>

          <W3Faqs faqs={CARER_ALLOWANCE_FAQS} topic="Carer Allowance" />
          <W3Footer sources={SOURCES_LIST} lastVerified={SRC.verifiedOn} authorKey="carer-allowance" />
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import TrustBar from "@/components/common/trust-bar";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD, SITE_CONFIG } from "@/lib/constants";
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
import { CentrelinkRelated, FONT, H2, INPUT, LABEL, LINK, NotIncluded, P, Row, TABLE_WRAP, TD, TH, clamp, source } from "./centrelink-shared";
import { PARENTING_FAQS } from "./parenting-payment-faqs";

// DataForSEO 23 Sep 2026: "parenting payment single" 8.1k, "parenting payment"
// 6.6k, "single parent payment calculator" 2.4k, "parenting payment partnered"
// 2.4k (KD 0–3), fairworkmate #2–8. Framed as "how your pay changes your
// payment" — the site's border rule 3.

const PP = PARENTING_PAYMENT;
const S = PP.single;
const PT = PP.partnered;
type Status = "single" | "partnered";

const TABLE_INCOMES = [0, 250, 500, 750, 1_000, 1_250, 1_500, 1_750, 2_000, 2_500, 2_900];
const HOURLY = 30;

const SOURCES_LIST = [
  source("How much Parenting Payment you can get", FAMILY_PAYMENT_SOURCES.parentingPaymentRates),
  source("Income and assets tests for Parenting Payment", FAMILY_PAYMENT_SOURCES.parentingPaymentIncomeTest),
  source("Who can get Parenting Payment", FAMILY_PAYMENT_SOURCES.parentingPaymentEligibility),
];

export default function ParentingPaymentCalculatorPage() {
  const [status, setStatus] = useState<Status>("single");
  const [children, setChildren] = useState(1);
  const [income, setIncome] = useState(600);
  const [partnerIncome, setPartnerIncome] = useState(0);
  const [partnerType, setPartnerType] = useState<PartnerPensionStatus>("notPension");
  const authorship = getGuideAuthorship("parenting-payment-calculator");

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

  const extraHours = [0, 10, 20, 30, 40, 50, 60];

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
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
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
                    <input type="range" min={0} max={3200} step={10} value={clamp(income, 0, 3200)} onChange={(e) => setIncome(Number(e.target.value))} className="mt-2 w-full accent-eucalyptus" aria-hidden="true" />
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
                        <Row label={`40c per $1 over ${formatAUD(ppsFreeArea(children), 2)}`} value={`-${formatAUD(result.ownReduction, 2)}`} />
                      ) : partnerType === "pension" ? (
                        <Row label={`Combined income: 25c over ${formatAUD(PT.combined.freeArea)}, 30c over ${formatAUD(PT.combined.band1End)}`} value={`-${formatAUD(result.ownReduction, 2)}`} />
                      ) : (
                        <>
                          <Row label={`Your income: 50c ${formatAUD(PT.freeArea)}–${formatAUD(PT.band1End)}, 60c above`} value={`-${formatAUD(result.ownReduction, 2)}`} />
                          <Row label={`Partner: 60c per $1 over ${formatAUD(PT.partnerIncomeFreeArea, 2)}`} value={`-${formatAUD(result.partnerReduction, 2)}`} />
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
          <section>
            <h2 style={FONT} className={H2}>Parenting Payment Rates From {PP.ratesFrom}</h2>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your situation</th><th scope="col" className={TH + " text-right"}>Maximum per fortnight</th><th scope="col" className={TH + " text-right"}>Payment reaches $0 at</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>Single — {formatAUD(S.basic, 2)} + {formatAUD(S.pensionSupplement, 2)} Pension Supplement</td><td className={TD + " text-right font-semibold"}>{formatAUD(S.maxFortnightly, 2)}</td><td className={TD + " text-right"}>{formatAUD(S.publishedCutOffOneChild, 2)} (1 child), +{formatAUD(S.freeAreaPerExtraChild, 2)} per extra child</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Partnered — partner doesn&apos;t get a pension</td><td className={TD + " text-right font-semibold"}>{formatAUD(PT.maxFortnightly, 2)}</td><td className={TD + " text-right"}>{formatAUD(PT.publishedOwnCutOff, 2)} of your own income</td></tr>
                  <tr><td className={TD}>Partnered — partner gets a pension</td><td className={TD + " text-right font-semibold"}>{formatAUD(PT.maxFortnightly, 2)}</td><td className={TD + " text-right"}>{formatAUD(PT.combined.publishedCutOff, 2)} combined</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">Maximum rates are indexed on {PP.indexedOn}; the next change is 20 March 2027. Energy Supplement is paid on top. Different rates apply to a partnered parent separated by illness, respite care or prison, and to parents over Age Pension age — check with Services Australia.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>The Parenting Payment Income Test</h2>
            <h3 style={FONT} className="text-xl font-semibold text-navy mb-3">Single: 40 cents per dollar over the free area</h3>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Children</th><th scope="col" className={TH + " text-right"}>Income before the payment reduces</th><th scope="col" className={TH + " text-right"}>Cut-off</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {[1, 2, 3, 4].map((n, i) => (
                    <tr key={n} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}><td className={TD}>{n}</td><td className={TD + " text-right"}>{formatAUD(ppsFreeArea(n), 2)}</td><td className={TD + " text-right"}>{formatAUD(ppsCutOff(n), 2)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>The single free area indexes on 1 July; the 40-cent taper is set in law. Because the taper is gentler than the 50 and 60 cents on JobSeeker, a single parent keeps 60 cents of every extra dollar earned until the payment runs out.</p>
            <h3 style={FONT} className="text-xl font-semibold text-navy mb-3 mt-6">Partnered: your income and your partner&apos;s</h3>
            <p className={P}>Your own income is tested like JobSeeker — nothing up to {formatAUD(PT.freeArea)} a fortnight, 50 cents per dollar to {formatAUD(PT.band1End)}, then {formatAUD(53)} plus 60 cents per dollar above. Your partner&apos;s income is tested separately: 60 cents per dollar over {formatAUD(PT.partnerIncomeFreeArea, 2)} a fortnight. If your partner gets a pension, the two incomes are combined instead — 25 cents per dollar from {formatAUD(PT.combined.freeArea)} to {formatAUD(PT.combined.band1End)}, then {formatAUD(53)} plus 30 cents per dollar.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>How Extra Hours Change Your Payment</h2>
            <p className={P}>A single parent with one child, paid {formatAUD(HOURLY)} an hour. Each row adds 10 hours a fortnight:</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Hours a fortnight</th><th scope="col" className={TH + " text-right"}>Wages</th><th scope="col" className={TH + " text-right"}>Parenting Payment</th><th scope="col" className={TH + " text-right"}>Wages + payment</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {extraHours.map((h, i) => { const w = h * HOURLY; const pay = ppsFortnightly(w, 1); return (
                    <tr key={h} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}><td className={TD}>{h}</td><td className={TD + " text-right"}>{formatAUD(w)}</td><td className={TD + " text-right"}>{formatAUD(pay, 2)}</td><td className={TD + " text-right font-semibold"}>{formatAUD(w + pay, 2)}</td></tr>
                  ); })}
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>Each 10 extra hours adds {formatAUD(10 * HOURLY)} of wages but only {formatAUD(10 * HOURLY * (1 - S.taper))} to your fortnight once you are past the free area — before tax. Parenting Payment is taxable, so run wages and payment together through the <Link href="/take-home-pay-calculator/" className={LINK}>take-home pay calculator</Link>, and use the <Link href="/work-hours-calculator/" className={LINK}>work hours calculator</Link> to turn a roster into fortnightly hours.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Parenting Payment at Different Incomes (Single, One Child)</h2>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Fortnightly wages</th><th scope="col" className={TH + " text-right"}>Reduction</th><th scope="col" className={TH + " text-right"}>Parenting Payment</th><th scope="col" className={TH + " text-right"}>Wages + payment</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TABLE_INCOMES.map((inc, i) => { const pay = ppsFortnightly(inc, 1); return (
                    <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}><td className={TD + " font-medium"}>{formatAUD(inc)}</td><td className={TD + " text-right"}>-{formatAUD(Math.min(S.maxFortnightly, ppsReduction(inc, 1)), 2)}</td><td className={TD + " text-right font-bold"}>{formatAUD(pay, 2)}</td><td className={TD + " text-right"}>{formatAUD(pay + inc, 2)}</td></tr>
                  ); })}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Who Can Get Parenting Payment</h2>
            <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
              <li><strong>Single:</strong> you are the principal carer of a child under {PP.singleYoungestChildUnder}. Mutual obligation requirements start when your youngest child turns {PP.singleMutualObligationFromAge}.</li>
              <li><strong>Partnered:</strong> you are the principal carer of a child under {PP.partneredYoungestChildUnder}.</li>
              <li>You meet the residence rules, and you are under the income limits and the assets test — {formatAUD(PP.assetLimits.singleHomeowner)} for a single homeowner, {formatAUD(PP.assetLimits.singleNonHomeowner)} for a single non-homeowner ({formatAUD(PP.assetLimits.coupleHomeowner)} / {formatAUD(PP.assetLimits.coupleNonHomeowner)} for a couple, combined).</li>
              <li>Only one parent or carer can be paid, and you can&apos;t claim before the child is born.</li>
            </ul>
            <p className={P}>Parenting Payment is separate from <Link href="/family-tax-benefit-calculator/" className={LINK}>Family Tax Benefit</Link>, which is paid for each child on your family&apos;s yearly income, and from <Link href="/parental-leave-pay/" className={LINK}>Parental Leave Pay</Link>. If you rent privately, you may also get <Link href="/rent-assistance-calculator/" className={LINK}>Rent Assistance</Link>. When your youngest turns {PP.singleYoungestChildUnder}, most single parents move to <Link href="/jobseeker-payment-calculator/" className={LINK}>JobSeeker</Link>.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Related Calculators and Guides</h2>
            <CentrelinkRelated current="parenting" />
          </section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>Single: payment = {formatAUD(S.maxFortnightly, 2)} − 40c × (income − free area), where the free area is {formatAUD(S.freeAreaOneChild, 2)} for one child plus {formatAUD(S.freeAreaPerExtraChild, 2)} per extra child. Floored at $0.</li>
              <li>Partnered (partner not on a pension): {formatAUD(PT.maxFortnightly, 2)} − (50c × own income from {formatAUD(PT.freeArea)} to {formatAUD(PT.band1End)} + 60c × own income over {formatAUD(PT.band1End)}) − 60c × partner income over {formatAUD(PT.partnerIncomeFreeArea, 2)}. Partner on a pension: {formatAUD(PT.maxFortnightly, 2)} − (25c × combined income from {formatAUD(PT.combined.freeArea)} to {formatAUD(PT.combined.band1End)} + 30c × combined income over {formatAUD(PT.combined.band1End)}).</li>
              <li>The published cut-offs include Energy Supplement and (for single parents) Pharmaceutical Allowance; our tests rebuild each one from the stored rate and taper to within 2 cents.</li>
              <li>Figures read at Services Australia on {FAMILY_PAYMENT_SOURCES.verifiedOn}. {SITE_CONFIG.name} is not Services Australia — use their Payment Finder for a claim estimate.</li>
            </ul>
          </MethodologyDisclosure>

          <section>
            <h2 style={FONT} className={H2}>Frequently Asked Questions</h2>
            <div className="sr-only"><h3>Parenting Payment questions and answers</h3>{PARENTING_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}</div>
            <Accordion type="multiple">
              {PARENTING_FAQS.map((f) => (<AccordionItem key={f.q} value={f.q}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent><p>{f.a}</p></AccordionContent></AccordionItem>))}
            </Accordion>
          </section>

          <SourceAttribution sources={SOURCES_LIST} lastVerified={FAMILY_PAYMENT_SOURCES.verifiedOn} />
          {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
        </div>
      </div>
    </div>
  );
}

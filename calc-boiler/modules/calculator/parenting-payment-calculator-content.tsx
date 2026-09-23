// The static long-form content on /parenting-payment-calculator/ (rates,
// income test, extra-hours and income tables, eligibility, FAQ, sources).
// A server component, so it ships as HTML; the client module
// (parenting-payment-calculator.tsx) renders it via `children`.

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD, formatNegAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import {
  FAMILY_PAYMENT_SOURCES,
  PARENTING_PAYMENT,
  ppsCutOff,
  ppsFortnightly,
  ppsFreeArea,
  ppsReduction,
} from "@/lib/constants/centrelink-family-payments";
import { CentrelinkRelated } from "./centrelink-shared";
import { PARENTING_FAQS } from "./parenting-payment-faqs";

// Same values as the exports of centrelink-shared.tsx, re-declared here because
// a server file cannot import non-component values from a "use client" module.
const H2 = "text-2xl font-semibold text-navy mb-4";
const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

const PP = PARENTING_PAYMENT;
const S = PP.single;
const PT = PP.partnered;

const TABLE_INCOMES = [0, 250, 500, 750, 1_000, 1_250, 1_500, 1_750, 2_000, 2_500, 2_900];
const HOURLY = 30;
const extraHours = [0, 10, 20, 30, 40, 50, 60];

const SOURCES_LIST = [
  source("How much Parenting Payment you can get", FAMILY_PAYMENT_SOURCES.parentingPaymentRates),
  source("Income and assets tests for Parenting Payment", FAMILY_PAYMENT_SOURCES.parentingPaymentIncomeTest),
  source("Who can get Parenting Payment", FAMILY_PAYMENT_SOURCES.parentingPaymentEligibility),
];
const authorship = getGuideAuthorship("parenting-payment-calculator");

export default function ParentingPaymentCalculatorContent() {
  return (
    <>
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
                <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}><td className={TD + " font-medium"}>{formatAUD(inc)}</td><td className={TD + " text-right"}>{formatNegAUD(Math.min(S.maxFortnightly, ppsReduction(inc, 1)), 2)}</td><td className={TD + " text-right font-bold"}>{formatAUD(pay, 2)}</td><td className={TD + " text-right"}>{formatAUD(pay + inc, 2)}</td></tr>
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
    </>
  );
}

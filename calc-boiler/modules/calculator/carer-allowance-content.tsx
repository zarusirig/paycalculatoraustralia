// The static long-form content on /carer-allowance/ (amount, income limit,
// comparison with Carer Payment, working, FAQ, sources). A server component,
// so it ships as HTML; the client module (carer-allowance.tsx) renders it via
// `children`.

import Link from "next/link";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import {
  CARER_ALLOWANCE,
  CARER_PAYMENT,
  CARER_PAYMENT_RATES,
  CARER_SUPPORT_SOURCES as SRC,
  carerAllowanceFortnightly,
} from "@/lib/constants/centrelink-carer-and-support";
import { agePensionFortnightly } from "@/lib/constants/centrelink-income-test";
import { Note, W3Faqs, W3Footer, W3Related, W3Section } from "./centrelink-w3-shared";
import { CARER_ALLOWANCE_FAQS } from "./centrelink-w3-faqs";

// Same values as the exports of centrelink-shared.tsx, re-declared here because
// a server file cannot import non-component values from a "use client" module.
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

const CA = CARER_ALLOWANCE;

const SOURCES_LIST = [
  source("Carer Allowance", SRC.carerAllowance),
  source("How much Carer Allowance you can get", SRC.carerAllowanceRates),
  source("Who can get Carer Allowance", SRC.carerAllowanceWho),
  source("Carer Supplement", SRC.carerSupplement),
  source("How much Carer Payment you can get", SRC.carerPaymentRates),
  source("Working while you get Carer Payment", SRC.carerPaymentWork),
];

export default function CarerAllowanceContent() {
  return (
    <>
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
    </>
  );
}

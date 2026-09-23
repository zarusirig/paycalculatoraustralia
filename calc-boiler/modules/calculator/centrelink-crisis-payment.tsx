"use client";

import Link from "next/link";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import { formatAUD, SITE_CONFIG } from "@/lib/constants";
import { CARER_SUPPORT_SOURCES as SRC, CRISIS_PAYMENT, crisisPaymentAmount } from "@/lib/constants/centrelink-carer-and-support";
import { AGE_PENSION_RATES, AUSTUDY, JOBSEEKER_RATES, SEPTEMBER_2026, YOUTH_ALLOWANCE_STUDENT } from "@/lib/constants/centrelink-income-test";
import { PARENTING_PAYMENT } from "@/lib/constants/centrelink-family-payments";
import { LINK, P, TABLE_WRAP, TD, TH, source } from "./centrelink-shared";
import { Note, W3Faqs, W3Footer, W3Hero, W3Related, W3Section } from "./centrelink-w3-shared";
import { CRISIS_FAQS } from "./centrelink-w3-faqs";

// DataForSEO 23 Sep 2026: "centrelink crisis payment" 5.4k KD2.
// Services Australia publishes the RULE ("a week's pay at the maximum basic
// rate … doesn't include other allowances or supplements") but no dollar
// table. The table below applies that rule to the basic rates this site
// already holds, and says so.

const JS = JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly;
const AP = AGE_PENSION_RATES[SEPTEMBER_2026].maxFortnightly;

const ROWS: { payment: string; basic: number; from: string }[] = [
  { payment: "JobSeeker — single, no children", basic: JS.single, from: "20 Sep 2026" },
  { payment: "JobSeeker — single with a dependent child, or 55+ after 9 months", basic: JS.singleWithChildren, from: "20 Sep 2026" },
  { payment: "JobSeeker — partnered (each)", basic: JS.partnered, from: "20 Sep 2026" },
  { payment: "Parenting Payment Single", basic: PARENTING_PAYMENT.single.basic, from: "20 Sep 2026" },
  { payment: "Parenting Payment Partnered (each)", basic: PARENTING_PAYMENT.partnered.maxFortnightly, from: "20 Sep 2026" },
  { payment: "Age Pension or Carer Payment — single", basic: AP.single.basic, from: "20 Sep 2026" },
  { payment: "Age Pension or Carer Payment — couple (each)", basic: AP.coupleEach.basic, from: "20 Sep 2026" },
  { payment: "Austudy — single, no children", basic: AUSTUDY.maxFortnightly.singleNoChildren, from: "1 Jan 2026" },
  { payment: "Youth Allowance (student) — 18+, living at home", basic: YOUTH_ALLOWANCE_STUDENT.maxFortnightly.over18AtHome, from: "1 Jan 2026" },
  { payment: "Youth Allowance (student) — away from home", basic: YOUTH_ALLOWANCE_STUDENT.maxFortnightly.awayFromHome, from: "1 Jan 2026" },
];

const SOURCES_LIST = [
  source("Crisis Payment", SRC.crisisPayment),
  source("Who can get Crisis Payment — family and domestic violence", SRC.crisisFdvWho),
  source("How much Crisis Payment — family and domestic violence", SRC.crisisFdvAmount),
  source("How to claim Crisis Payment — family and domestic violence", SRC.crisisFdvClaim),
  source("Who can get Crisis Payment — other extreme circumstances", SRC.crisisOtherWho),
  source("How much Crisis Payment — other extreme circumstances", SRC.crisisOtherAmount),
  source("Who can get Crisis Payment — humanitarian entrants", SRC.crisisHumanitarianWho),
  source("Who can get Crisis Payment — release from prison or psychiatric confinement", SRC.crisisPrisonWho),
];

export default function CentrelinkCrisisPaymentPage() {
  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <W3Hero crumb="Crisis Payment" title="Centrelink Crisis Payment 2026 — Who Can Get It and How Much">
          <p>
            Crisis Payment is a one-off, non-taxable payment for people on (or eligible for) an income support payment who are in severe financial hardship after an extreme circumstance. It equals <strong>one week of the maximum basic rate</strong> of your payment — about {formatAUD(crisisPaymentAmount(JS.single), 2)} for a single person on JobSeeker. You must contact Services Australia within {CRISIS_PAYMENT.contactWithinDays} days.
          </p>
        </W3Hero>

        <div className="max-w-4xl mx-auto space-y-10">
          <Note tone="warn">
            <strong>If you are experiencing family and domestic violence</strong> and are in danger, call 000. 1800RESPECT (1800 737 732) is the national support line. Services Australia can help you claim safely, including changing your contact details or nominee before you start.
          </Note>

          <W3Section title="How Much Is the Crisis Payment?">
            <p className={P}>Services Australia: &ldquo;It&apos;s equal to a week&apos;s pay at the maximum basic rate of your income support payment or ABSTUDY Living Allowance. It doesn&apos;t include other allowances or supplements.&rdquo; A week is half the fortnightly rate, so the payment is half the fortnightly maximum basic rate — whatever your actual payment is after the income test.</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Your payment</th><th scope="col" className={TH + " text-right"}>Maximum basic rate a fortnight</th><th scope="col" className={TH + " text-right"}>Crisis Payment (our calculation)</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {ROWS.map((r, i) => (
                    <tr key={r.payment} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                      <td className={TD}>{r.payment}</td>
                      <td className={TD + " text-right"}>{formatAUD(r.basic, 2)} <span className="text-xs text-warmgray-light">from {r.from}</span></td>
                      <td className={TD + " text-right font-bold"}>{formatAUD(crisisPaymentAmount(r.basic), 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">Services Australia does not publish a dollar table; these amounts apply its rule to the published maximum basic rates (supplements excluded). Parenting Payment Single is shown without its Pension Supplement. The amount changes whenever the basic rate is indexed. Check your own rate in your Centrelink online account.</p>
          </W3Section>

          <W3Section title="Who Can Get a Crisis Payment">
            <p className={P}>For every type you must be getting, or be eligible for, an income support payment or ABSTUDY Living Allowance, be in <strong>severe financial hardship</strong>, and be in Australia when you claim. Then one of these extreme circumstances must apply:</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Type</th><th scope="col" className={TH}>Circumstance</th><th scope="col" className={TH}>Time limit to contact</th><th scope="col" className={TH}>How often</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD + " font-medium"}>Family and domestic violence</td><td className={TD}>You left home because of family and domestic violence, or stayed and the person responsible left or was removed</td><td className={TD}>{CRISIS_PAYMENT.contactWithinDays} days after your living arrangements change</td><td className={TD} rowSpan={2}>Once per incident; up to {CRISIS_PAYMENT.maxExtremeCircumstancesPer12Months} of these two types combined in 12 months</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD + " font-medium"}>Other extreme circumstances</td><td className={TD}>Forced to leave home by fire, flood, community violence or similar, it&apos;s unreasonable to return soon, and you have set up or intend to set up a new home</td><td className={TD}>{CRISIS_PAYMENT.contactWithinDays} days after deciding you can&apos;t return</td></tr>
                  <tr><td className={TD + " font-medium"}>Humanitarian entrants</td><td className={TD}>First arrival in Australia on visa {CRISIS_PAYMENT.humanitarianVisas.join(", ")}</td><td className={TD}>{CRISIS_PAYMENT.contactWithinDays} days after first arrival</td><td className={TD}>Once</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD + " font-medium"}>Release from prison or psychiatric confinement</td><td className={TD}>Charged with an offence and held {CRISIS_PAYMENT.minDaysInCustody}+ days (not immigration detention)</td><td className={TD}>Up to {CRISIS_PAYMENT.prisonContactDaysBeforeRelease} days before release or {CRISIS_PAYMENT.contactWithinDays} days after</td><td className={TD}>Each release</td></tr>
                </tbody>
              </table>
            </div>
            <p className={P + " mt-4"}>You can&apos;t get the &ldquo;other extreme circumstances&rdquo; payment if you were evicted for not paying rent or a mortgage, chose to move without an extreme circumstance, or got (or are eligible for) a disaster relief payment — such as the Australian Government Disaster Recovery Payment or Disaster Recovery Allowance — for the same event. Evidence such as a police or fire report is needed; photos of damage and news articles aren&apos;t accepted.</p>
          </W3Section>

          <W3Section title="How to Claim a Crisis Payment — and the Timing">
            <ol className="list-decimal pl-6 space-y-1 text-warmgray">
              <li><strong>Make contact within {CRISIS_PAYMENT.contactWithinDays} days.</strong> Starting a claim in your Centrelink online account, calling your regular payment line or visiting a service centre all count.</li>
              <li><strong>Lodge the claim within {CRISIS_PAYMENT.claimWithinDaysOfContact} days of that contact.</strong> Online: myGov → Centrelink → Payments and Claims → Claims → Make a claim → Crisis Payments.</li>
              <li><strong>Provide evidence</strong> of the circumstance, and permission for Services Australia to contact someone who can confirm it.</li>
              <li><strong>Family and domestic violence claims</strong> are assessed by a social worker who needs to speak with you — the claim can&apos;t progress if they can&apos;t reach you.</li>
              <li>Track the claim in myGov or the Express Plus Centrelink app. You can ask for a review if you disagree with the decision.</li>
            </ol>
          </W3Section>

          <W3Section title="If You Can't Get a Crisis Payment">
            <p className={P}>An <Link href="/centrelink-advance-payment/" className={LINK}>advance payment</Link> of part of your regular payment may help — it is repaid over 13 fortnights. Services Australia also lists other crisis and special help, including social workers. If you have a Centrelink debt, repayments can be paused after a crisis or disaster — see <Link href="/centrelink-debt/" className={LINK}>Centrelink debt</Link>.</p>
          </W3Section>

          <W3Section title="Related Calculators and Guides">
            <W3Related current="crisis" />
          </W3Section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>Crisis Payment = maximum basic fortnightly rate ÷ 2, to the cent, following Services Australia&apos;s &ldquo;a week&apos;s pay at the maximum basic rate&rdquo; rule. Basic rates from the 20 September 2026 indexation (student payments: 1 January 2026).</li>
              <li>Eligibility and timing read at Services Australia on {SRC.verifiedOn}. {SITE_CONFIG.name} is not Services Australia.</li>
            </ul>
          </MethodologyDisclosure>

          <W3Faqs faqs={CRISIS_FAQS} topic="Crisis Payment" />
          <W3Footer sources={SOURCES_LIST} lastVerified={SRC.verifiedOn} authorKey="centrelink-crisis-payment" />
        </div>
      </div>
    </div>
  );
}

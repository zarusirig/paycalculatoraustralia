// The static long-form content on /rent-assistance-calculator/. A server
// component, so it ships as HTML; the client module
// (rent-assistance-calculator.tsx) renders it via `children` below the
// calculator card.

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import {
  FAMILY_PAYMENT_SOURCES,
  RENT_ASSISTANCE,
  RENT_ASSISTANCE_SITUATIONS,
  rentAssistanceFortnightly,
  type RentAssistanceSituation,
} from "@/lib/constants/centrelink-family-payments";
import { CentrelinkRelated } from "./centrelink-shared";
import { RENT_FAQS } from "./rent-assistance-faqs";

// Same values as the exports of centrelink-shared.tsx, which is a "use client"
// module and so cannot supply plain values to a server component.
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

const RA = RENT_ASSISTANCE;

const SOURCES_LIST = [
  source("How much Rent Assistance you can get", FAMILY_PAYMENT_SOURCES.rentAssistanceRates),
  source("Who can get Rent Assistance", FAMILY_PAYMENT_SOURCES.rentAssistanceEligibility),
];
const EXAMPLE_RENTS = [150, 200, 250, 300, 350, 400, 450, 500, 600, 700];

export default function RentAssistanceCalculatorContent() {
  const authorship = getGuideAuthorship("rent-assistance-calculator");

  return (
    <>
      <section>
        <h2 style={FONT} className={H2}>Rent Assistance Rates From {RA.ratesFrom}</h2>
        <h3 style={FONT} className="text-xl font-semibold text-navy mb-3">Paid with an income support payment (no children)</h3>
        <RatesTable rows={RENT_ASSISTANCE_SITUATIONS.filter((k) => RA.rows[k].paidWith === "incomeSupport")} />
        <h3 style={FONT} className="text-xl font-semibold text-navy mb-3 mt-6">Paid with Family Tax Benefit Part A (families)</h3>
        <RatesTable rows={RENT_ASSISTANCE_SITUATIONS.filter((k) => RA.rows[k].paidWith === "ftb")} />
        <p className="mt-2 text-xs text-warmgray-light">All figures per fortnight, as published by Services Australia. Indexed on {RA.indexedOn} in line with CPI; the next change is 20 March 2027. Couples: combined rent and one combined amount. A couple separated by illness, respite care or prison, or temporarily separated, with children, uses the single family threshold.</p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Rent Assistance at Different Rents (Single, No Children)</h2>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Weekly rent</th><th scope="col" className={TH + " text-right"}>Fortnightly rent</th><th scope="col" className={TH + " text-right"}>Rent Assistance a fortnight</th><th scope="col" className={TH + " text-right"}>Sharer rate</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {EXAMPLE_RENTS.map((w, i) => (
                <tr key={w} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className={TD + " font-medium"}>{formatAUD(w)}</td>
                  <td className={TD + " text-right"}>{formatAUD(w * 2)}</td>
                  <td className={TD + " text-right font-semibold"}>{formatAUD(rentAssistanceFortnightly(w * 2, "single"), 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(rentAssistanceFortnightly(w * 2, "singleSharer"), 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={P + " mt-4"}>From about {formatAUD(Math.ceil(RA.rows.single.publishedMaxRent / 2))} a week in rent, a single person gets the maximum and extra rent adds nothing.</p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Who Can Get Rent Assistance</h2>
        <ul className="list-disc pl-6 space-y-2 text-warmgray mb-4">
          <li>You get an eligible payment: <Link href="/jobseeker-payment-calculator/" className={LINK}>JobSeeker</Link>, <Link href="/austudy-youth-allowance-calculator/" className={LINK}>Youth Allowance, Austudy</Link>, <Link href="/parenting-payment-calculator/" className={LINK}>Parenting Payment</Link> (single or partnered), the <Link href="/age-pension-income-test-calculator/" className={LINK}>Age Pension</Link>, Carer Payment, Disability Support Pension, ABSTUDY Living Allowance, Farm Household Allowance, Special Benefit — or <Link href="/family-tax-benefit-calculator/" className={LINK}>Family Tax Benefit Part A</Link> at more than the base rate. Special rules can apply if you&apos;re 25 or younger.</li>
          <li>You pay an eligible accommodation cost — rent, lodging, board and lodging, retirement village or over-55s village fees, or site or mooring fees — above the threshold for your situation.</li>
          <li>You don&apos;t need to apply: Services Australia checks when you claim your payment or update your address and accommodation details, and pays it with your regular payment.</li>
        </ul>
      </section>

      <section>
        <h2 style={FONT} className={H2}>How Extra Work Hours Affect Rent Assistance</h2>
        <p className={P}>Rent Assistance itself isn&apos;t tested against your wages; the payment it comes with is. Because it forms part of that payment, the same income test can reduce it once your earnings are high enough — and getting Rent Assistance raises the income at which your payment cuts out. For families, more hours can push family income past the point where FTB Part A drops to the base rate, and Rent Assistance stops there. Work through your fortnightly wages with the <Link href="/fortnightly-pay-calculator/" className={LINK}>fortnightly pay calculator</Link>, then check the payment itself in the calculator for it.</p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Related Calculators and Guides</h2>
        <CentrelinkRelated current="rent" />
      </section>

      <MethodologyDisclosure>
        <ul className="list-disc pl-4 space-y-1">
          <li>Rent Assistance = the lesser of the maximum for your situation and 75c × (fortnightly rent − threshold), floored at $0.</li>
          <li>Weekly rent × 2 = fortnightly; monthly rent × 12 ÷ 26 = fortnightly.</li>
          <li>Thresholds and maximums are Services Australia&apos;s figures from {RA.ratesFrom}, read on {FAMILY_PAYMENT_SOURCES.verifiedOn}. Our tests rebuild each published &ldquo;rent for the maximum&rdquo; figure from them to within a cent.</li>
          <li>{SITE_CONFIG.name} is not Services Australia — use their Payment Finder to estimate your full payment including Rent Assistance.</li>
        </ul>
      </MethodologyDisclosure>

      <section>
        <h2 style={FONT} className={H2}>Frequently Asked Questions</h2>
        <div className="sr-only"><h3>Rent Assistance questions and answers</h3>{RENT_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}</div>
        <Accordion type="multiple">
          {RENT_FAQS.map((f) => (<AccordionItem key={f.q} value={f.q}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent><p>{f.a}</p></AccordionContent></AccordionItem>))}
        </Accordion>
      </section>

      <SourceAttribution sources={SOURCES_LIST} lastVerified={FAMILY_PAYMENT_SOURCES.verifiedOn} />
      {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
    </>
  );
}

function RatesTable({ rows }: { rows: RentAssistanceSituation[] }) {
  return (
    <div className={TABLE_WRAP}>
      <table className="w-full text-sm">
        <thead className="bg-sandstone"><tr><th scope="col" className={TH}>If you&apos;re</th><th scope="col" className={TH + " text-right"}>Rent must be more than</th><th scope="col" className={TH + " text-right"}>Maximum reached at rent of</th><th scope="col" className={TH + " text-right"}>Maximum Rent Assistance</th></tr></thead>
        <tbody className="divide-y divide-sandstone-dark/10">
          {rows.map((k, i) => { const r = RENT_ASSISTANCE.rows[k]; return (
            <tr key={k} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
              <td className={TD}>{r.label}</td>
              <td className={TD + " text-right"}>{formatAUD(r.threshold, 2)}</td>
              <td className={TD + " text-right"}>{formatAUD(r.publishedMaxRent, 2)}</td>
              <td className={TD + " text-right font-semibold"}>{formatAUD(r.max, 2)}</td>
            </tr>
          ); })}
        </tbody>
      </table>
    </div>
  );
}

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
import { formatAUD, formatNegAUD, SITE_CONFIG } from "@/lib/constants";
import {
  FAMILY_PAYMENT_SOURCES,
  RENT_ASSISTANCE,
  RENT_ASSISTANCE_SITUATIONS,
  rentAssistanceFortnightly,
  rentToFortnightly,
  type RentAssistanceSituation,
} from "@/lib/constants/centrelink-family-payments";
import { CentrelinkRelated, FONT, H2, INPUT, LABEL, LINK, P, Row, TABLE_WRAP, TD, TH, clamp, source } from "./centrelink-shared";
import { RENT_FAQS } from "./rent-assistance-faqs";

// DataForSEO 23 Sep 2026: "rent assistance calculator" and two Centrelink
// variants, 3.6k each, fairworkmate #9–13.

const RA = RENT_ASSISTANCE;
type Period = "week" | "fortnight" | "month";

const SOURCES_LIST = [
  source("How much Rent Assistance you can get", FAMILY_PAYMENT_SOURCES.rentAssistanceRates),
  source("Who can get Rent Assistance", FAMILY_PAYMENT_SOURCES.rentAssistanceEligibility),
];
const EXAMPLE_RENTS = [150, 200, 250, 300, 350, 400, 450, 500, 600, 700];

export default function RentAssistanceCalculatorPage() {
  const [situation, setSituation] = useState<RentAssistanceSituation>("single");
  const [rent, setRent] = useState(250);
  const [period, setPeriod] = useState<Period>("week");
  const authorship = getGuideAuthorship("rent-assistance-calculator");

  const row = RA.rows[situation];
  const result = useMemo(() => {
    const fortnightlyRent = rentToFortnightly(rent, period);
    const ra = rentAssistanceFortnightly(fortnightlyRent, situation);
    return { fortnightlyRent, ra, weekly: ra / 2, atMax: ra >= RA.rows[situation].max, share: fortnightlyRent > 0 ? ra / fortnightlyRent : 0 };
  }, [rent, period, situation]);

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
              <li><span className="font-medium text-navy" aria-current="page">Rent Assistance Calculator</span></li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">Rent Assistance Calculator — Centrelink Rates From {RA.ratesFrom}</h1>
          <p className="text-lg text-warmgray">
            Commonwealth Rent Assistance pays <strong>75 cents for every dollar of rent</strong> above a threshold, up to a maximum — <strong>{formatAUD(RA.rows.single.max, 2)} a fortnight</strong> for a single person, {formatAUD(RA.rows.singleFamily1or2.max, 2)} for a family with 1 or 2 children. Enter your rent to see what you could get.
          </p>
          <p className="mt-3 inline-block rounded-full bg-eucalyptus-light/60 px-3 py-1 text-xs font-semibold text-navy">Rates from {RA.ratesFrom} · verified {FAMILY_PAYMENT_SOURCES.verifiedOn}</p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">How Much Rent Assistance Can You Get?</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <div>
                    <label htmlFor="situation" className={LABEL}>Your situation</label>
                    <select id="situation" value={situation} onChange={(e) => setSituation(e.target.value as RentAssistanceSituation)} className={INPUT}>
                      <optgroup label="With an income support payment (no children)">
                        {RENT_ASSISTANCE_SITUATIONS.filter((k) => RA.rows[k].paidWith === "incomeSupport").map((k) => <option key={k} value={k}>{RA.rows[k].label}</option>)}
                      </optgroup>
                      <optgroup label="With Family Tax Benefit Part A (children)">
                        {RENT_ASSISTANCE_SITUATIONS.filter((k) => RA.rows[k].paidWith === "ftb").map((k) => <option key={k} value={k}>{RA.rows[k].label}</option>)}
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="rent" className={LABEL}>Rent you pay</label>
                    <div className="flex items-center gap-2"><span className="text-warmgray-light">$</span>
                      <input type="number" id="rent" min={0} max={10000} step={10} value={rent} onChange={(e) => setRent(clamp(Number(e.target.value || 0), 0, 10000))} className={INPUT} />
                      <select aria-label="Rent period" value={period} onChange={(e) => setPeriod(e.target.value as Period)} className={INPUT + " max-w-[9rem]"}>
                        <option value="week">a week</option>
                        <option value="fortnight">a fortnight</option>
                        <option value="month">a month</option>
                      </select>
                    </div>
                    <p className="text-xs text-warmgray-light mt-1">{situation.startsWith("couple") ? "Your combined rent as a couple." : "Your share of the rent."} Board and lodging: enter the lodging part only.</p>
                  </div>
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Rent Assistance a fortnight</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(result.ra, 2)}</div>
                    <div className="text-sm text-warmgray">{formatAUD(result.weekly, 2)} a week · covers {Math.round(result.share * 100)}% of your rent{result.atMax ? " · maximum rate" : ""}</div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How it was worked out</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Your rent a fortnight" value={formatAUD(result.fortnightlyRent, 2)} bold />
                      <Row label="Rent threshold (no assistance below this)" value={formatNegAUD(row.threshold, 2)} />
                      <Row label="Rent above the threshold × 75c" value={formatAUD(Math.max(0, result.fortnightlyRent - row.threshold) * RA.rate, 2)} />
                      <Row label="Maximum for your situation" value={formatAUD(row.max, 2)} />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Rent Assistance" value={formatAUD(result.ra, 2)} bold highlight />
                      <Row label="Rent at which you reach the maximum" value={formatAUD(row.publishedMaxRent, 2)} />
                    </div>
                  </div>
                  <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 text-xs text-navy">
                    <strong>Before the income test.</strong> Rent Assistance is paid on top of an eligible payment — JobSeeker, Youth Allowance, Austudy, Parenting Payment, the Age Pension and others, or Family Tax Benefit Part A above the base rate for families. That payment&apos;s income and assets tests can reduce it. Not modelled: the special rules for people 25 or younger, board and lodging splits, and retirement village or site-fee arrangements. Rates read at Services Australia on {FAMILY_PAYMENT_SOURCES.verifiedOn}.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
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
        </div>
      </div>
    </div>
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

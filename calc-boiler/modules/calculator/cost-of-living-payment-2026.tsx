"use client";

import Link from "next/link";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import { formatAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import { CARER_SUPPORT_SOURCES as SRC, COST_OF_LIVING_FACTS as COL } from "@/lib/constants/centrelink-carer-and-support";
import { AGE_PENSION_RATES, CENTRELINK_SOURCES, JOBSEEKER_RATES, MARCH_2026, SEPTEMBER_2026 } from "@/lib/constants/centrelink-income-test";
import { PARENTING_PAYMENT, RENT_ASSISTANCE } from "@/lib/constants/centrelink-family-payments";
import { LINK, P, TABLE_WRAP, TD, TH, source } from "./centrelink-shared";
import { Note, W3Faqs, W3Footer, W3Hero, W3Related, W3Section } from "./centrelink-w3-shared";
import { COL_FAQS } from "./centrelink-w3-faqs";

// DataForSEO 23 Sep 2026: "cost of living payment 2026" 1k, +53,900% YoY.
// Verified 23 Sep 2026: no Commonwealth cost of living payment exists in 2026.
// Services Australia's own page says it stopped from 30 June 2023; the Energy
// Bill Relief Fund ended 31 Dec 2025 (energy.gov.au). The "$2,200 payment"
// results ranking for the query are unofficial blogs with no government source.

const JS_M = JOBSEEKER_RATES[MARCH_2026].maxFortnightly;
const JS_S = JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly;
const AP_M = AGE_PENSION_RATES[MARCH_2026].maxFortnightly;
const AP_S = AGE_PENSION_RATES[SEPTEMBER_2026].maxFortnightly;

const SOURCES_LIST = [
  source("Cost of Living Payment", SRC.costOfLivingPayment),
  { title: "Energy Bill Relief Fund", url: SRC.energyBillRelief, publisher: "energy.gov.au (DCCEEW)" },
  { title: "Rebates and assistance", url: SRC.energyRebates, publisher: "energy.gov.au (DCCEEW)" },
  { title: "Cost of living concession", url: SRC.saCostOfLivingConcession, publisher: "Government of South Australia" },
  { title: CENTRELINK_SOURCES.dssRatesListTitle, url: CENTRELINK_SOURCES.dssRatesList, publisher: "Department of Social Services" },
  source("How much JobSeeker Payment you can get", CENTRELINK_SOURCES.jobseekerRates),
  source("How much Age Pension you can get", CENTRELINK_SOURCES.agePensionRates),
];

export default function CostOfLivingPayment2026Page() {
  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <W3Hero crumb="Cost of Living Payment 2026" title="Is There a Cost of Living Payment in 2026?">
          <p>
            <strong>No.</strong> There is no Commonwealth cost of living payment in 2026. Services Australia says the Cost of Living Payment <strong>stopped from {COL.cwthCostOfLivingPaymentEnded}</strong>, and the federal Energy Bill Relief Fund <strong>ended on {COL.energyBillReliefEnded}</strong>. What does happen is the regular indexation of existing payments — most recently on 20 September 2026 — plus state and territory concessions.
          </p>
        </W3Hero>

        <div className="max-w-4xl mx-auto space-y-10">
          <Note tone="warn">
            <strong>About the &ldquo;$2,200 cost of living payment&rdquo;.</strong> Articles promising a 2026 Centrelink cost of living payment of $2,200 (or $800 to $2,140) are not backed by any Services Australia or Department of Social Services announcement. Real payments are listed on servicesaustralia.gov.au; you never need to give your myGov password or bank details to a website or caller to receive one.
          </Note>

          <W3Section title="What Stopped">
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Payment</th><th scope="col" className={TH}>Status</th><th scope="col" className={TH}>Source</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD + " font-medium"}>Cost of Living Payment (Commonwealth)</td><td className={TD}>Stopped from {COL.cwthCostOfLivingPaymentEnded}. It was not taxable.</td><td className={TD}>Services Australia</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD + " font-medium"}>Energy Bill Relief Fund — 2025 extension</td><td className={TD}>Up to {formatAUD(COL.energyBillRelief2025Extension)} per household, two $75 instalments, 1 July – 31 December 2025. Ended {COL.energyBillReliefEnded}.</td><td className={TD}>energy.gov.au</td></tr>
                  <tr><td className={TD + " font-medium"}>Energy Bill Relief Fund — 2024-25</td><td className={TD}>Up to {formatAUD(COL.energyBillRelief2024_25)} per household</td><td className={TD}>energy.gov.au</td></tr>
                </tbody>
              </table>
            </div>
          </W3Section>

          <W3Section title="What Does Exist in 2026">
            <h3 className="font-semibold text-navy mb-2">1. Indexation of Centrelink payments</h3>
            <p className={P}>Pensions and most allowances rise on 20 March and 20 September. The 20 September 2026 increase is already being paid:</p>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Maximum per fortnight</th><th scope="col" className={TH + " text-right"}>To 19 Sep 2026</th><th scope="col" className={TH + " text-right"}>From 20 Sep 2026</th><th scope="col" className={TH + " text-right"}>Increase</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>JobSeeker, single no children</td><td className={TD + " text-right"}>{formatAUD(JS_M.single, 2)}</td><td className={TD + " text-right"}>{formatAUD(JS_S.single, 2)}</td><td className={TD + " text-right"}>+{formatAUD(JS_S.single - JS_M.single, 2)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>JobSeeker, partnered (each)</td><td className={TD + " text-right"}>{formatAUD(JS_M.partnered, 2)}</td><td className={TD + " text-right"}>{formatAUD(JS_S.partnered, 2)}</td><td className={TD + " text-right"}>+{formatAUD(JS_S.partnered - JS_M.partnered, 2)}</td></tr>
                  <tr><td className={TD}>Age Pension / Carer Payment, single (total)</td><td className={TD + " text-right"}>{formatAUD(AP_M.single.total, 2)}</td><td className={TD + " text-right"}>{formatAUD(AP_S.single.total, 2)}</td><td className={TD + " text-right"}>+{formatAUD(AP_S.single.total - AP_M.single.total, 2)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Age Pension / Carer Payment, couple each (total)</td><td className={TD + " text-right"}>{formatAUD(AP_M.coupleEach.total, 2)}</td><td className={TD + " text-right"}>{formatAUD(AP_S.coupleEach.total, 2)}</td><td className={TD + " text-right"}>+{formatAUD(AP_S.coupleEach.total - AP_M.coupleEach.total, 2)}</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">From the DSS rates list for the 20 September 2026 indexation and Services Australia&apos;s rate pages. Parenting Payment Single is {formatAUD(PARENTING_PAYMENT.single.maxFortnightly, 2)} from {PARENTING_PAYMENT.ratesFrom}. Austudy and Youth Allowance index on 1 January; Family Tax Benefit on 1 July.</p>

            <h3 className="font-semibold text-navy mt-6 mb-2">2. Rent Assistance</h3>
            <p className={P}>If you pay rent and get an eligible payment, <Link href="/rent-assistance-calculator/" className={LINK}>Rent Assistance</Link> adds up to {formatAUD(RENT_ASSISTANCE.rows.single.max, 2)} a fortnight for a single person with no children (from {RENT_ASSISTANCE.ratesFrom}).</p>

            <h3 className="font-semibold text-navy mt-6 mb-2">3. State and territory concessions</h3>
            <p className={P}>States run their own rebates for concession card holders. One that is paid as cash: South Australia&apos;s <strong>Cost of Living Concession</strong> — {formatAUD(COL.saCostOfLivingConcession2026_27, 2)} for 2026-27, paid between August and December to eligible tenants and homeowners on low or fixed incomes (apply by 31 December). For your state&apos;s energy rebates, use the <a href={SRC.energyRebates} className={LINK} target="_blank" rel="noopener noreferrer">energy.gov.au rebates finder</a>.</p>

            <h3 className="font-semibold text-navy mt-6 mb-2">4. One-off help if something goes wrong</h3>
            <p className={P}>A <Link href="/centrelink-crisis-payment/" className={LINK}>Crisis Payment</Link> (one week of your payment&apos;s basic rate) after an extreme circumstance, or an <Link href="/centrelink-advance-payment/" className={LINK}>advance</Link> of part of your payment, repaid over 13 fortnights.</p>
          </W3Section>

          <W3Section title="Related Calculators and Guides">
            <W3Related current="col" />
          </W3Section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>Checked on {SRC.verifiedOn}: Services Australia&apos;s Cost of Living Payment page, energy.gov.au&apos;s Energy Bill Relief Fund page, and the SA Cost of Living Concession page. We will update this page if a new payment is announced.</li>
              <li>Rates come from lib constants verified against the DSS 20 September 2026 rates list and {SOURCES.servicesAustralia.name}. {SITE_CONFIG.name} is not a government site.</li>
            </ul>
          </MethodologyDisclosure>

          <W3Faqs faqs={COL_FAQS} topic="Cost of living payment 2026" />
          <W3Footer sources={SOURCES_LIST} lastVerified={SRC.verifiedOn} authorKey="cost-of-living-payment-2026" />
        </div>
      </div>
    </div>
  );
}

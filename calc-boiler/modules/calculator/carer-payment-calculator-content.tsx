// The static long-form content on /carer-payment-calculator/ (rates, income
// test, work hours, assets test, eligibility, FAQ, sources). A server
// component, so it ships as HTML; the client module
// (carer-payment-calculator.tsx) renders it via `children`.

import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD, formatNegAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import {
  AGE_PENSION_INCOME_TEST,
  agePensionFortnightly,
  pensionReduction,
} from "@/lib/constants/centrelink-income-test";
import {
  CARER_PAYMENT,
  CARER_PAYMENT_AVERAGE_WEEKLY_HOURS,
  CARER_PAYMENT_RATES,
  CARER_SUPPORT_SOURCES as SRC,
} from "@/lib/constants/centrelink-carer-and-support";
import { Note, W3Faqs, W3Footer, W3Related, W3Section } from "./centrelink-w3-shared";
import { CARER_PAYMENT_FAQS } from "./centrelink-w3-faqs";

// Same values as the exports of centrelink-shared.tsx, re-declared here because
// a server file cannot import non-component values from a "use client" module.
const P = "text-warmgray mb-4";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

const R = CARER_PAYMENT_RATES;
const IT = AGE_PENSION_INCOME_TEST;
const CP = CARER_PAYMENT;
const TABLE_INCOMES = [0, 226, 400, 600, 800, 1_000, 1_500, 2_000, 2_400, R.publishedCutOff.single];

const SOURCES_LIST = [
  source("How much Carer Payment you can get", SRC.carerPaymentRates),
  source("Income test for Carer Payment", SRC.carerPaymentIncomeTest),
  source("Assets test for Carer Payment", SRC.carerPaymentAssetsTest),
  source("Income and assets test (including the person you care for)", SRC.carerPaymentIncomeAndAssets),
  source("Working while you get Carer Payment", SRC.carerPaymentWork),
  source("Who can get Carer Payment", SRC.carerPaymentWho),
  source("Who can get the Work Bonus", SRC.workBonusWho),
  source("Carer Supplement", SRC.carerSupplement),
];

export default function CarerPaymentCalculatorContent() {
  return (
    <>
      <W3Section title="Carer Payment Rates From 20 September 2026">
        <p className={P}>Carer Payment is paid at the pension rate. These are the figures on Services Australia&apos;s Carer Payment rates page, adjusted every 20 March and 20 September.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Per fortnight</th><th scope="col" className={TH + " text-right"}>Single</th><th scope="col" className={TH + " text-right"}>Couple each</th><th scope="col" className={TH + " text-right"}>Couple combined</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {([["Maximum basic rate", "basic"], ["Pension Supplement", "supplement"], ["Energy Supplement", "energy"], ["Total", "total"]] as const).map(([label, f]) => (
                <tr key={f} className={f === "total" ? "bg-eucalyptus-light/30 font-bold" : undefined}>
                  <td className={TD}>{label}</td>
                  <td className={TD + " text-right"}>{formatAUD(R.maxFortnightly.single[f], 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(R.maxFortnightly.coupleEach[f], 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(R.maxFortnightly.coupleCombined[f], 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">A couple separated due to ill health each get the single rate. You also get the {formatAUD(CP.carerSupplementAnnual)} Carer Supplement each year if you are on Carer Payment on 1 July. Carer Payment is taxable only if you or the person you care for are Age Pension age or older.</p>
      </W3Section>

      <W3Section title="Carer Payment Income Test">
        <p className={P}>Services Australia uses the pension income test for Carer Payment. It counts your and your partner&apos;s income from all sources, including deemed income on financial assets.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Situation</th><th scope="col" className={TH}>Income free area</th><th scope="col" className={TH}>Reduction above it</th><th scope="col" className={TH + " text-right"}>Cut-off</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>Single</td><td className={TD}>{formatAUD(IT.single.freeArea)} a fortnight</td><td className={TD}>50c per $1</td><td className={TD + " text-right"}>{formatAUD(R.publishedCutOff.single, 2)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>Couple living together</td><td className={TD}>{formatAUD(IT.couple.freeArea)} combined</td><td className={TD}>25c per combined $1, off each payment</td><td className={TD + " text-right"}>{formatAUD(R.publishedCutOff.coupleCombined, 2)} combined</td></tr>
              <tr><td className={TD}>Couple apart due to ill health</td><td className={TD}>{formatAUD(IT.couple.freeArea)} combined</td><td className={TD}>25c per combined $1, off each payment</td><td className={TD + " text-right"}>{formatAUD(R.publishedCutOff.coupleApartIllHealthCombined, 2)} combined</td></tr>
            </tbody>
          </table>
        </div>
        <div className={TABLE_WRAP + " mt-6"}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Single carer, income a fortnight</th><th scope="col" className={TH + " text-right"}>Reduction</th><th scope="col" className={TH + " text-right"}>Carer Payment</th><th scope="col" className={TH + " text-right"}>Income + payment</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {TABLE_INCOMES.map((inc, i) => {
                const pay = agePensionFortnightly(inc, "single", R);
                return (
                  <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                    <td className={TD + " font-medium"}>{formatAUD(inc, 2)}</td>
                    <td className={TD + " text-right"}>{formatNegAUD(pensionReduction(inc, "single"), 2)}</td>
                    <td className={TD + " text-right font-bold"}>{formatAUD(pay, 2)}</td>
                    <td className={TD + " text-right"}>{formatAUD(pay + inc, 2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </W3Section>

      <W3Section title="How Many Hours Can You Work on Carer Payment?">
        <p className={P}>You can do paid work or self-employment for up to <strong>{CP.workHoursLimit} hours in a {CP.workHoursPeriodWeeks}-week period</strong> — an average of {CARER_PAYMENT_AVERAGE_WEEKLY_HOURS} hours a week — and keep Carer Payment. The count only includes time working when you are not providing care; hours worked from home count if you can&apos;t stop working when the person you care for needs help.</p>
        <ul className="list-disc pl-6 space-y-1 text-warmgray mb-4">
          <li><strong>Not counted:</strong> travel to and from work, study, training and volunteering. You don&apos;t report these.</li>
          <li><strong>Over {CP.workHoursLimit} hours now and then:</strong> use respite days — up to {CP.respiteDaysPerYear} a calendar year.</li>
          <li><strong>Over the limit without respite, or earning too much:</strong> the payment can be suspended for up to {CP.suspensionMonths} months. You keep your Pensioner Concession Card, and can ask for the payment to be restored if your hours or income drop within that time.</li>
          <li><strong>Report every fortnight:</strong> your gross pay and the hours you worked for each employer, even if zero. Tell Services Australia within 14 days if you start or stop work.</li>
        </ul>
        <Note>Hours and income are two separate tests. You can be under {CP.workHoursLimit} hours and still have your payment reduced by the income test — the calculator above shows both.</Note>
      </W3Section>

      <W3Section title="Carer Payment Assets Test">
        <p className={P}>Your payment is the lower of the income-test and assets-test results. Assets above the full-pension limit reduce the payment; above the cut-off it stops. Your home isn&apos;t counted, which is why homeowners have lower limits. Figures from 20 September 2026 (couples are combined).</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Situation</th><th scope="col" className={TH + " text-right"}>Full pension up to</th><th scope="col" className={TH + " text-right"}>Part pension stops above</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              <tr><td className={TD}>Single, homeowner</td><td className={TD + " text-right"}>{formatAUD(CP.assetsFullPension.singleHomeowner)}</td><td className={TD + " text-right"}>{formatAUD(CP.assetsCutOff.singleHomeowner)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>Single, non-homeowner</td><td className={TD + " text-right"}>{formatAUD(CP.assetsFullPension.singleNonHomeowner)}</td><td className={TD + " text-right"}>{formatAUD(CP.assetsCutOff.singleNonHomeowner)}</td></tr>
              <tr><td className={TD}>Couple, homeowner</td><td className={TD + " text-right"}>{formatAUD(CP.assetsFullPension.coupleHomeowner)}</td><td className={TD + " text-right"}>{formatAUD(CP.assetsCutOff.coupleHomeowner)}</td></tr>
              <tr className="bg-eucalyptus-light/30"><td className={TD}>Couple, non-homeowner</td><td className={TD + " text-right"}>{formatAUD(CP.assetsFullPension.coupleNonHomeowner)}</td><td className={TD + " text-right"}>{formatAUD(CP.assetsCutOff.coupleNonHomeowner)}</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">Cut-offs are higher if you get Rent Assistance. The person you care for has separate limits: income under {formatAUD(CP.careReceiverIncomeLimit)} a year and assets under {formatAUD(CP.careReceiverAssetsLimit)} (not counting their home), unless they get an income support payment. Those index on 1 January.</p>
      </W3Section>

      <W3Section title="Who Can Get Carer Payment">
        <ul className="list-disc pl-6 space-y-1 text-warmgray">
          <li>You give <strong>constant care</strong> — roughly a normal working day, every day — to someone with a disability or medical condition likely to last at least {CP.careNeedMonths} months, someone who is frail aged, or someone at the end of their life.</li>
          <li>The care is in their home; it can be physical help, guidance or supervision. You can care for more than one person.</li>
          <li>You and the person you care for are Australian residents and meet the income and assets tests.</li>
          <li>The person&apos;s treating doctor completes a medical form, and you describe the care you give.</li>
        </ul>
        <p className={P + " mt-4"}>You can claim any time, but you&apos;re usually paid only from the date you claim. The first payment usually arrives about 2 weeks after approval, later if a waiting period applies. If you already get JobSeeker or Parenting Payment, that stops when Carer Payment is granted.</p>
      </W3Section>

      <W3Section title="Related Calculators and Guides">
        <W3Related current="carer-payment" />
      </W3Section>

      <MethodologyDisclosure>
        <ul className="list-disc pl-4 space-y-1">
          <li>Payment = maximum rate − 50c per $1 of assessable income over {formatAUD(IT.single.freeArea)} (single), or − 25c per combined $1 over {formatAUD(IT.couple.freeArea)} for each member of a couple, floored at $0. This is the pension income test Services Australia applies to Carer Payment, and it reproduces the published cut-offs ({formatAUD(R.publishedCutOff.single, 2)} single, {formatAUD(R.publishedCutOff.coupleCombined, 2)} couple) exactly — the tests assert it.</li>
          <li>Work Bonus is applied only when you tick Age Pension age, as Services Australia restricts it to carers of that age.</li>
          <li>Rates are the 20 September 2026 figures, read on {SRC.verifiedOn}. {SITE_CONFIG.name} is not Services Australia — use their Payment Finder for a claim estimate.</li>
        </ul>
      </MethodologyDisclosure>

      <W3Faqs faqs={CARER_PAYMENT_FAQS} topic="Carer Payment" />
      <W3Footer sources={SOURCES_LIST} lastVerified={SRC.verifiedOn} authorKey="carer-payment-calculator" />
    </>
  );
}

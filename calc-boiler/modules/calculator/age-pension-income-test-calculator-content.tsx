// The static long-form content on /age-pension-income-test-calculator/, below
// the income test rules table (which reads the in-force rate set and stays in
// age-pension-income-test-calculator.tsx). Server component, so it ships as
// HTML; the client module renders it via `children`.

import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import SourceAttribution, { type SourceLink } from "@/components/common/source-attribution";
import AuthorBox from "@/components/common/author-box";
import { getGuideAuthorship } from "@/lib/authors";
import { formatAUD, formatNegAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import {
  AGE_PENSION,
  AGE_PENSION_INCOME_TEST,
  AGE_PENSION_RATES,
  CENTRELINK_SOURCES,
  MARCH_2026,
  RATE_SET_LABELS,
  SEPTEMBER_2026,
  WORK_BONUS,
  agePensionFortnightly,
  pensionReduction,
} from "@/lib/constants/centrelink-income-test";
import { CentrelinkRelated } from "./centrelink-shared";
import { PENSION_FAQS } from "./age-pension-income-test-faqs";

// Same values as the class-name constants in centrelink-shared.tsx, which is a
// "use client" module (its non-component exports cannot be read here).
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

/** Free areas and tapers — these index on 1 July, not 20 September. */
const IT = AGE_PENSION_INCOME_TEST;
const MAR = AGE_PENSION_RATES[MARCH_2026];
const SEP = AGE_PENSION_RATES[SEPTEMBER_2026];
const TABLE_INCOMES = [0, 226, 400, 600, 800, 1_000, 1_200, 1_500, 1_800, 2_100, 2_400, SEP.publishedCutOff.single];

const SOURCES_LIST = [
  source("Income test for Age Pension", CENTRELINK_SOURCES.agePensionIncomeTest),
  source("How much Age Pension you can get", CENTRELINK_SOURCES.agePensionRates),
  source("How a Work Bonus works", CENTRELINK_SOURCES.workBonus),
  { title: CENTRELINK_SOURCES.dssRatesListTitle, url: CENTRELINK_SOURCES.dssRatesList, publisher: "Department of Social Services" },
];

export default function AgePensionIncomeTestCalculatorContent() {
  const authorship = getGuideAuthorship("age-pension-income-test-calculator");
  return (
    <>
      <section>
        <h2 style={FONT} className={H2}>How the Work Bonus Changes the Result</h2>
        <p className={P}>The Work Bonus is not a payment. It is an offset: {formatAUD(WORK_BONUS.fortnightlyCredit)} of credit is added to your Work Bonus balance every fortnight, whether you work or not, up to {formatAUD(WORK_BONUS.maxBalance)}. When you have employment or self-employment income, the first {formatAUD(WORK_BONUS.fortnightlyCredit)} in the fortnight is disregarded and the balance offsets what remains — all before the income test above is applied. Income under {formatAUD(WORK_BONUS.fortnightlyCredit)} is reduced to zero and the unused credit goes back into the balance. It applies only to income from working, not to deemed or investment income, and you do not have to apply for it. The credit and the maximum balance are set in legislation and are not part of the September indexation.</p>
        <p className={P}>Someone with a full {formatAUD(WORK_BONUS.maxBalance)} balance can earn {formatAUD(WORK_BONUS.maxBalance + WORK_BONUS.fortnightlyCredit)} in a single fortnight before any of it is assessed. That is why the published cut-off &ldquo;may be higher&rdquo; for people who work.</p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Maximum Age Pension Rates: Now and From 20 September 2026</h2>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone">
              <tr>
                <th scope="col" rowSpan={2} className={TH}>Per fortnight</th>
                <th scope="col" colSpan={2} className={TH + " text-right"}>Single</th>
                <th scope="col" colSpan={2} className={TH + " text-right"}>Couple each</th>
                <th scope="col" colSpan={2} className={TH + " text-right"}>Couple combined</th>
              </tr>
              <tr>
                {["single", "coupleEach", "coupleCombined"].flatMap((g) => [
                  <th key={`${g}-mar`} scope="col" className={TH + " text-right text-xs font-medium"}>To 19 Sep</th>,
                  <th key={`${g}-sep`} scope="col" className={TH + " text-right text-xs font-medium"}>From 20 Sep</th>,
                ])}
              </tr>
            </thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {([
                ["Maximum basic rate", "basic"],
                ["Pension Supplement", "supplement"],
                ["Energy Supplement", "energy"],
                ["Total", "total"],
              ] as const).map(([label, field], i) => (
                <tr key={field} className={field === "total" ? "bg-eucalyptus-light/30 font-bold" : i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className={TD}>{label}</td>
                  <td className={TD + " text-right"}>{formatAUD(MAR.maxFortnightly.single[field], 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(SEP.maxFortnightly.single[field], 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(MAR.maxFortnightly.coupleEach[field], 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(SEP.maxFortnightly.coupleEach[field], 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(MAR.maxFortnightly.coupleCombined[field], 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(SEP.maxFortnightly.coupleCombined[field], 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">
          Adjusted on {AGE_PENSION.indexedOn}. A couple living apart due to ill health each get the single rate, and the combined figures are exactly twice the couple-each figures. The Energy Supplement is flat — it does not index — so the whole {formatAUD(SEP.maxFortnightly.single.total - MAR.maxFortnightly.single.total, 2)} a fortnight increase for a single pensioner is basic rate plus Pension Supplement. September figures from the DSS rates list published {CENTRELINK_SOURCES.dssRatesListPublished}. Transitional-rate pensioners: {formatAUD(MAR.transitional.singleTotal, 2)} single now, {formatAUD(SEP.transitional.singleTotal, 2)} from 20 September ({formatAUD(MAR.transitional.partneredEachTotal, 2)} → {formatAUD(SEP.transitional.partneredEachTotal, 2)} each partnered).
        </p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Single Age Pension at Different Assessable Incomes</h2>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Assessable income / fortnight</th><th scope="col" className={TH + " text-right"}>Reduction</th><th scope="col" className={TH + " text-right"}>Pension to 19 Sep 2026</th><th scope="col" className={TH + " text-right"}>Pension from 20 Sep 2026</th><th scope="col" className={TH + " text-right"}>Income + pension (from 20 Sep)</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {TABLE_INCOMES.map((inc, i) => {
                const payMar = agePensionFortnightly(inc, "single", MAR);
                const paySep = agePensionFortnightly(inc, "single", SEP);
                return (
                  <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                    <td className={TD + " font-medium"}>{formatAUD(inc, 2)}</td>
                    <td className={TD + " text-right"}>{formatNegAUD(pensionReduction(inc, "single"), 2)}</td>
                    <td className={TD + " text-right"}>{formatAUD(payMar, 2)}</td>
                    <td className={TD + " text-right font-bold"}>{formatAUD(paySep, 2)}</td>
                    <td className={TD + " text-right"}>{formatAUD(paySep + inc, 2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className={P + " mt-4"}>Assessable income here is after the Work Bonus. Working pensioners: subtract {formatAUD(WORK_BONUS.fortnightlyCredit)} and any balance from your wages first, then read the row. The pension is taxable — the <Link href="/sapto-calculator/" className={LINK}>SAPTO calculator</Link> shows whether any tax is actually payable.</p>
      </section>

      <section>
        <h2 style={FONT} className={H2}>Related Calculators and Guides</h2>
        <CentrelinkRelated current="pension" />
      </section>

      <MethodologyDisclosure>
        <ul className="list-disc pl-4 space-y-1">
          <li>Assessable income = employment income after the Work Bonus (first {formatAUD(WORK_BONUS.fortnightlyCredit)} disregarded, then the balance, per person) + other income. Reduction = {Math.round(IT.single.taper * 100)}c per dollar over {formatAUD(IT.single.freeArea)} (single) or {Math.round(IT.couple.taper * 100)}c per combined dollar over {formatAUD(IT.couple.freeArea)} off each pension (couple). Pension = maximum rate minus reduction, floored at $0. The free areas and tapers index on 1 July and did not change on 20 September 2026.</li>
          <li>Two dated rate sets are held: {RATE_SET_LABELS[MARCH_2026]} (Services Australia, read {CENTRELINK_SOURCES.marchSetReadOn}) and {RATE_SET_LABELS[SEPTEMBER_2026]} (DSS rates list published {CENTRELINK_SOURCES.dssRatesListPublished}). The calculator reads today&apos;s date in your browser and applies whichever set is in force, so it changes over on 20 September by itself; both sets stay on the page because a payment summary dated before 20 September is on the March rates.</li>
          <li>The {RATE_SET_LABELS[MARCH_2026]} cut-offs are Services Australia&apos;s published figures and reconcile to the cent. The {RATE_SET_LABELS[SEPTEMBER_2026]} cut-offs are also Services Australia&apos;s published figures, re-checked on {CENTRELINK_SOURCES.verifiedOn}. Both sets reconcile exactly to cut-off = total rate ÷ taper + free area, and the tests assert it.</li>
          <li>Not modelled here: assets test and deeming (both are in the <Link href="/age-pension-assets-test-calculator/" className={LINK}>assets test calculator</Link>), transitional rates, Rent Assistance, mixed couples. {SITE_CONFIG.name} is not Services Australia — use their Payment Finder for a claim estimate.</li>
        </ul>
      </MethodologyDisclosure>

      <section>
        <h2 style={FONT} className={H2}>Frequently Asked Questions</h2>
        <div className="sr-only"><h3>Age Pension income test questions and answers</h3>{PENSION_FAQS.map((f) => (<div key={f.q}><h4>{f.q}</h4><p>{f.a}</p></div>))}</div>
        <Accordion type="multiple">
          {PENSION_FAQS.map((f) => (<AccordionItem key={f.q} value={f.q}><AccordionTrigger>{f.q}</AccordionTrigger><AccordionContent><p>{f.a}</p></AccordionContent></AccordionItem>))}
        </Accordion>
      </section>

      <SourceAttribution sources={SOURCES_LIST} lastVerified={CENTRELINK_SOURCES.verifiedOn} />
      {authorship ? <AuthorBox author={authorship.author} reviewer={authorship.reviewer} lastReviewed={authorship.lastReviewed} /> : null}
    </>
  );
}

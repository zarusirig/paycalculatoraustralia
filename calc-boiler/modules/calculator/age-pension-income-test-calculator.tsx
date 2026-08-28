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
import { AGE_PENSION, CENTRELINK_SOURCES, WORK_BONUS, agePensionFortnightly, assessableAfterWorkBonus, pensionReduction, type PensionSituation } from "@/lib/constants/centrelink-income-test";
import { CentrelinkRelated, FONT, H2, INPUT, LABEL, LINK, NotIncluded, P, Row, TABLE_WRAP, TD, TH, clamp, source } from "./centrelink-shared";
import { PENSION_FAQS } from "./age-pension-income-test-faqs";

// GSC to 27 Aug 2026: "work bonus calculator", "work bonus tax calculator",
// "how much can a pensioner earn before paying tax" were landing on the
// bonus-tax page — a wrong-node signal. Age Pension income-test queries
// (221 visible impressions) sat at position 32 on the guide.

const A = AGE_PENSION;
const TABLE_INCOMES = [0, 226, 400, 600, 800, 1_000, 1_200, 1_500, 1_800, 2_100, 2_400, 2_627.80];
const SOURCES_LIST = [
  source("Income test for Age Pension", CENTRELINK_SOURCES.agePensionIncomeTest),
  source("How much Age Pension you can get", CENTRELINK_SOURCES.agePensionRates),
  source("How a Work Bonus works", CENTRELINK_SOURCES.workBonus),
];

export default function AgePensionIncomeTestCalculatorPage() {
  const [situation, setSituation] = useState<PensionSituation>("single");
  const [employment, setEmployment] = useState(600);
  const [partnerEmployment, setPartnerEmployment] = useState(0);
  const [otherIncome, setOtherIncome] = useState(200);
  const [balance, setBalance] = useState(0);
  const [partnerBalance, setPartnerBalance] = useState(0);
  const authorship = getGuideAuthorship("age-pension-income-test-calculator");

  const result = useMemo(() => {
    const yours = assessableAfterWorkBonus(employment, balance);
    const partners = situation === "couple" ? assessableAfterWorkBonus(partnerEmployment, partnerBalance) : 0;
    const assessable = yours + partners + otherIncome;
    const each = agePensionFortnightly(assessable, situation);
    const max = situation === "single" ? A.maxFortnightly.single.total : A.maxFortnightly.coupleEach.total;
    const reduction = pensionReduction(assessable, situation);
    const workBonusSaved = employment + (situation === "couple" ? partnerEmployment : 0) - yours - partners;
    return { yours, partners, assessable, each, combined: situation === "couple" ? each * 2 : each, max, reduction, workBonusSaved };
  }, [situation, employment, partnerEmployment, otherIncome, balance, partnerBalance]);

  const free = A.incomeTest[situation].freeArea;
  const taper = A.incomeTest[situation].taper;

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex items-center space-x-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><Link href="/centrelink-income-test/" className="hover:text-eucalyptus-dark hover:underline">Centrelink Income Test</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Age Pension Income Test Calculator</span></li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">Age Pension Income Test Calculator — With the Work Bonus</h1>
          <p className="text-lg text-warmgray">
            See how working or other income changes your Age Pension. The Work Bonus takes the first {formatAUD(WORK_BONUS.fortnightlyCredit)} of wages out of the test each fortnight; above the {formatAUD(A.incomeTest.single.freeArea)} (single) or {formatAUD(A.incomeTest.couple.freeArea)} (couple, combined) free area the pension reduces by 50 cents in the dollar. Rates from {A.ratesFrom}.
          </p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">How Much Age Pension Do You Keep?</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="situation" className={LABEL}>You are</label>
                    <select id="situation" value={situation} onChange={(e) => setSituation(e.target.value as PensionSituation)} className={INPUT}>
                      <option value="single">Single</option>
                      <option value="couple">A couple living together (both on Age Pension)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="employment" className={LABEL}>Your employment income this fortnight</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="employment" min={0} max={10000} step={10} value={employment} onChange={(e) => setEmployment(clamp(Number(e.target.value || 0), 0, 10000))} className={INPUT} /></div>
                  </div>
                  <div>
                    <label htmlFor="balance" className={LABEL}>Your Work Bonus balance</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="balance" min={0} max={WORK_BONUS.maxBalance} step={100} value={balance} onChange={(e) => setBalance(clamp(Number(e.target.value || 0), 0, WORK_BONUS.maxBalance))} className={INPUT} /></div>
                    <p className="text-xs text-warmgray-light mt-1">Shown in your Centrelink online account. Maximum {formatAUD(WORK_BONUS.maxBalance)}.</p>
                  </div>
                  {situation === "couple" && (
                    <>
                      <div>
                        <label htmlFor="partnerEmployment" className={LABEL}>Partner&apos;s employment income this fortnight</label>
                        <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                          <input type="number" id="partnerEmployment" min={0} max={10000} step={10} value={partnerEmployment} onChange={(e) => setPartnerEmployment(clamp(Number(e.target.value || 0), 0, 10000))} className={INPUT} /></div>
                      </div>
                      <div>
                        <label htmlFor="partnerBalance" className={LABEL}>Partner&apos;s Work Bonus balance</label>
                        <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                          <input type="number" id="partnerBalance" min={0} max={WORK_BONUS.maxBalance} step={100} value={partnerBalance} onChange={(e) => setPartnerBalance(clamp(Number(e.target.value || 0), 0, WORK_BONUS.maxBalance))} className={INPUT} /></div>
                      </div>
                    </>
                  )}
                  <div>
                    <label htmlFor="other" className={LABEL}>Other assessable income this fortnight{situation === "couple" ? " (combined)" : ""}</label>
                    <div className="flex items-center"><span className="text-warmgray-light mr-2">$</span>
                      <input type="number" id="other" min={0} max={10000} step={10} value={otherIncome} onChange={(e) => setOtherIncome(clamp(Number(e.target.value || 0), 0, 10000))} className={INPUT} /></div>
                    <p className="text-xs text-warmgray-light mt-1">Deemed income from savings and shares, super income streams, rent, overseas pensions. The Work Bonus does not apply to these.</p>
                  </div>
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">{situation === "couple" ? "Age Pension each, this fortnight" : "Age Pension this fortnight"}</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(result.each, 2)}</div>
                    <div className="text-sm text-warmgray">of the {formatAUD(result.max, 2)} maximum{situation === "couple" ? ` · ${formatAUD(result.combined, 2)} combined` : ""} · about {formatAUD(result.combined * 26)} a year</div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How the income test applied</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Employment income" value={formatAUD(employment + (situation === "couple" ? partnerEmployment : 0), 2)} />
                      <Row label={`Work Bonus (first ${formatAUD(WORK_BONUS.fortnightlyCredit)} each, then balance)`} value={`-${formatAUD(result.workBonusSaved, 2)}`} />
                      <Row label="Other income" value={formatAUD(otherIncome, 2)} />
                      <Row label="Assessable income" value={formatAUD(result.assessable, 2)} bold />
                      <div className="border-t border-sandstone-dark/10 pt-3" />
                      <Row label={`Free area (${situation === "couple" ? "combined" : "single"})`} value={formatAUD(free, 2)} />
                      <Row label={`${Math.round(taper * 100)}c per $1 over the free area${situation === "couple" ? " (each)" : ""}`} value={`-${formatAUD(result.reduction, 2)}`} />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label={situation === "couple" ? "Pension each" : "Pension"} value={formatAUD(result.each, 2)} bold highlight />
                      <Row label="Published cut-off" value={situation === "single" ? formatAUD(A.publishedCutOff.single, 2) : `${formatAUD(A.publishedCutOff.coupleCombined, 2)} combined`} />
                    </div>
                  </div>
                  <NotIncluded items={["the assets test", "deeming (enter deemed income yourself)", "transitional-rate pensioners", "Rent Assistance", "couples where only one partner gets a pension or lives apart due to ill health"]} />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
          <section>
            <h2 style={FONT} className={H2}>Age Pension Income Test Rules</h2>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Situation</th><th scope="col" className={TH}>Income free area (per fortnight)</th><th scope="col" className={TH}>Reduction above it</th><th scope="col" className={TH + " text-right"}>Cut-off</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>Single</td><td className={TD}>{formatAUD(A.incomeTest.single.freeArea)}</td><td className={TD}>50c for each dollar</td><td className={TD + " text-right"}>{formatAUD(A.publishedCutOff.single, 2)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Couple living together</td><td className={TD}>{formatAUD(A.incomeTest.couple.freeArea)} combined</td><td className={TD}>25c for each combined dollar, off each pension</td><td className={TD + " text-right"}>{formatAUD(A.publishedCutOff.coupleCombined, 2)} combined</td></tr>
                  <tr><td className={TD}>Couple apart due to ill health</td><td className={TD}>{formatAUD(A.incomeTest.couple.freeArea)} combined</td><td className={TD}>25c for each combined dollar, off each pension</td><td className={TD + " text-right"}>{formatAUD(A.publishedCutOff.coupleApartIllHealthCombined, 2)} combined</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Transitional rate — single</td><td className={TD}>{formatAUD(A.incomeTest.transitional.single.freeArea)}</td><td className={TD}>40c for each dollar</td><td className={TD + " text-right"}>{formatAUD(A.publishedCutOff.transitionalSingle, 2)}</td></tr>
                  <tr><td className={TD}>Transitional rate — couple</td><td className={TD}>{formatAUD(A.incomeTest.transitional.couple.freeArea)} combined</td><td className={TD}>20c for each combined dollar, off each pension</td><td className={TD + " text-right"}>{formatAUD(A.publishedCutOff.transitionalCoupleCombined, 2)} combined</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">The income test counts income from all sources, including deemed income on financial assets. Services Australia pays the lower of the income-test and assets-test results.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>How the Work Bonus Changes the Result</h2>
            <p className={P}>The Work Bonus is not a payment. It is an offset: {formatAUD(WORK_BONUS.fortnightlyCredit)} of credit is added to your Work Bonus balance every fortnight, whether you work or not, up to {formatAUD(WORK_BONUS.maxBalance)}. When you have employment or self-employment income, the first {formatAUD(WORK_BONUS.fortnightlyCredit)} in the fortnight is disregarded and the balance offsets what remains — all before the income test above is applied. Income under {formatAUD(WORK_BONUS.fortnightlyCredit)} is reduced to zero and the unused credit goes back into the balance. It applies only to income from working, not to deemed or investment income, and you do not have to apply for it.</p>
            <p className={P}>Someone with a full {formatAUD(WORK_BONUS.maxBalance)} balance can earn {formatAUD(WORK_BONUS.maxBalance + WORK_BONUS.fortnightlyCredit)} in a single fortnight before any of it is assessed. That is why the published cut-off &ldquo;may be higher&rdquo; for people who work.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Maximum Age Pension Rates From {A.ratesFrom}</h2>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Per fortnight</th><th scope="col" className={TH + " text-right"}>Single</th><th scope="col" className={TH + " text-right"}>Couple each</th><th scope="col" className={TH + " text-right"}>Couple combined</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD}>Maximum basic rate</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.single.basic, 2)}</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.coupleEach.basic, 2)}</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.coupleCombined.basic, 2)}</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD}>Pension Supplement</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.single.supplement, 2)}</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.coupleEach.supplement, 2)}</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.coupleCombined.supplement, 2)}</td></tr>
                  <tr><td className={TD}>Energy Supplement</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.single.energy, 2)}</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.coupleEach.energy, 2)}</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.coupleCombined.energy, 2)}</td></tr>
                  <tr className="bg-eucalyptus-light/30 font-bold"><td className={TD}>Total</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.single.total, 2)}</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.coupleEach.total, 2)}</td><td className={TD + " text-right"}>{formatAUD(A.maxFortnightly.coupleCombined.total, 2)}</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-warmgray-light">Adjusted on {A.indexedOn}. A couple living apart due to ill health each get the single rate.</p>
          </section>

          <section>
            <h2 style={FONT} className={H2}>Single Age Pension at Different Assessable Incomes</h2>
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Assessable income / fortnight</th><th scope="col" className={TH + " text-right"}>Reduction</th><th scope="col" className={TH + " text-right"}>Pension</th><th scope="col" className={TH + " text-right"}>Income + pension</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  {TABLE_INCOMES.map((inc, i) => { const pay = agePensionFortnightly(inc, "single"); return (
                    <tr key={inc} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}><td className={TD + " font-medium"}>{formatAUD(inc, 2)}</td><td className={TD + " text-right"}>-{formatAUD(pensionReduction(inc, "single"), 2)}</td><td className={TD + " text-right font-bold"}>{formatAUD(pay, 2)}</td><td className={TD + " text-right"}>{formatAUD(pay + inc, 2)}</td></tr>); })}
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
              <li>Assessable income = employment income after the Work Bonus (first {formatAUD(WORK_BONUS.fortnightlyCredit)} disregarded, then the balance, per person) + other income. Reduction = {Math.round(A.incomeTest.single.taper * 100)}c per dollar over {formatAUD(A.incomeTest.single.freeArea)} (single) or {Math.round(A.incomeTest.couple.taper * 100)}c per combined dollar over {formatAUD(A.incomeTest.couple.freeArea)} off each pension (couple). Pension = maximum rate minus reduction, floored at $0.</li>
              <li>Rates, free areas and cut-offs are read from one constants file verified at Services Australia on {CENTRELINK_SOURCES.verifiedOn}; tests reconcile the published single and couple cut-offs to the cent.</li>
              <li>Not modelled: assets test, deeming, transitional rates, Rent Assistance, mixed couples. {SITE_CONFIG.name} is not Services Australia — use their Payment Finder for a claim estimate.</li>
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
        </div>
      </div>
    </div>
  );
}

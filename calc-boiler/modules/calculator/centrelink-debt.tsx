"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import { formatAUD, SITE_CONFIG } from "@/lib/constants";
import { CARER_SUPPORT_SOURCES as SRC, RESOLUTION_SCHEME, jobseekerOverpayment, resolutionSchemePayment } from "@/lib/constants/centrelink-carer-and-support";
import { JOBSEEKER_INCOME_TEST, JOBSEEKER_RATES, SEPTEMBER_2026 } from "@/lib/constants/centrelink-income-test";
import { FONT, LINK, P, Row, TABLE_WRAP, TD, TH, source } from "./centrelink-shared";
import { MoneyInput, Note, W3Faqs, W3Footer, W3Hero, W3Related, W3Section } from "./centrelink-w3-shared";
import { DEBT_FAQS } from "./centrelink-w3-faqs";

// DataForSEO 23 Sep 2026: "centrelink debt" 2.4k (+2,980% YoY), "centrelink
// debt refund overpayment" 4.4k. Why it's trending, from Services Australia's
// own pages (read 23 Sep 2026):
//   - Oct 2025 onward: refunds to people who OVERPAID a debt and weren't
//     refunded (Services Australia error) — "what-happens-if-youve-overpaid".
//   - 30 Jan 2026 – 29 Jan 2027: Income Apportionment Resolution Scheme, and
//     paused income-apportionment debts restarting from June 2026.
//   - 23 Jun 2026: Federal Court approved the new $475m robodebt settlement.
// No news source is used for any fact on the page.

const JS_MAX = JOBSEEKER_RATES[SEPTEMBER_2026].maxFortnightly.single;
const T = JOBSEEKER_INCOME_TEST;

const SOURCES_LIST = [
  source("Centrelink debts and overpayments", SRC.debtsHub),
  source("What happens if you've overpaid a Centrelink debt", SRC.debtRefund),
  source("Information about income apportionment", SRC.incomeApportionment),
  source("Income Apportionment Resolution Scheme", SRC.resolutionScheme),
  source("New robodebt class action settlement", SRC.robodebtSettlement),
  source("What happens when you're overpaid", SRC.debtOverpaid),
  source("How to avoid an overpayment", SRC.debtAvoid),
  source("How to repay money you owe to Centrelink", SRC.debtRepay),
];

export default function CentrelinkDebtPage() {
  const [reported, setReported] = useState(600);
  const [actual, setActual] = useState(800);
  const [fortnights, setFortnights] = useState(6);
  const [debt, setDebt] = useState(2_500);

  const r = useMemo(() => {
    const per = jobseekerOverpayment(JS_MAX, reported, actual);
    return { per, total: Math.round(Math.max(0, per) * fortnights * 100) / 100 };
  }, [reported, actual, fortnights]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <W3Hero crumb="Centrelink Debt" title="Centrelink Debt 2026 — Refunds, the Income Apportionment Scheme and Overpayments">
          <p>
            Three things put Centrelink debts back in the news in 2025–26: refunds to people who paid back <em>more</em> than they owed, the Income Apportionment Resolution Scheme (up to {formatAUD(RESOLUTION_SCHEME.maxPayment)} per debt, applications close {RESOLUTION_SCHEME.closes}), and the new robodebt class action settlement. Here is what each one is — and how a wrong income report creates a debt in the first place.
          </p>
        </W3Hero>

        <div className="max-w-4xl mx-auto space-y-10">
          <W3Section title="Why Centrelink Debts Are in the News in 2026">
            <div className="space-y-4">
              <Note>
                <strong>1. Refunds for overpaid debts (from late October 2025).</strong> Services Australia started contacting people who had overpaid a Centrelink debt and whose refunds weren&apos;t processed properly — &ldquo;due to an error we made.&rdquo; It will call or write with details and may need to confirm your bank details. These refunds aren&apos;t used to repay other Centrelink debts unless you ask, and don&apos;t include interest; if the error caused you financial loss you can claim under the CDDA compensation scheme. The most common ways a debt gets overpaid are automatic repayments not being cancelled, a debt reduced after a formal review, or an FTB non-lodger debt once actual income is confirmed. Debt remediation line: 1800 407 744.
              </Note>
              <Note>
                <strong>2. Income Apportionment Resolution Scheme ({RESOLUTION_SCHEME.opened} – {RESOLUTION_SCHEME.closes}).</strong> Before 7 December 2020 Centrelink often divided (apportioned) your pay evenly across its fortnights when your pay period didn&apos;t line up with them. That practice was found inconsistent with social security law at the time; new legislation has since validated those debts, and the scheme pays up to {formatAUD(RESOLUTION_SCHEME.maxPayment)} per eligible debt as recognition. Debt repayments and reviews that were paused are being restarted — letters started going out from June 2026, with 4 weeks to set up a payment arrangement.
              </Note>
              <Note>
                <strong>3. The new robodebt class action settlement.</strong> The Federal Court approved it on 23 June 2026: the Commonwealth pays an additional $475 million to eligible group members, on top of the 2022 settlement payments and the debts already refunded or zeroed. Registrations closed on 6 March 2026 (late registrations 15 May 2026). Gordon Legal administers it (1300 001 356). Robodebt is a different thing from income apportionment — see below.
              </Note>
            </div>
          </W3Section>

          <W3Section title="Income Apportionment Resolution Scheme: How Much You Could Get">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className={TABLE_WRAP}>
                <table className="w-full text-sm">
                  <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Debt value on {RESOLUTION_SCHEME.valuedAt}</th><th scope="col" className={TH + " text-right"}>Payment</th></tr></thead>
                  <tbody className="divide-y divide-sandstone-dark/10">
                    <tr><td className={TD}>Less than $200</td><td className={TD + " text-right"}>Full debt amount</td></tr>
                    <tr className="bg-eucalyptus-light/30"><td className={TD}>$200 – $1,999</td><td className={TD + " text-right"}>$200</td></tr>
                    <tr><td className={TD}>$2,000 – $4,999</td><td className={TD + " text-right"}>$400</td></tr>
                    <tr className="bg-eucalyptus-light/30"><td className={TD}>$5,000 or more</td><td className={TD + " text-right"}>$600</td></tr>
                  </tbody>
                </table>
              </div>
              <Card className="shadow-sm"><CardContent className="p-5 space-y-4">
                <MoneyInput id="debt" label={`Total value of one eligible debt on ${RESOLUTION_SCHEME.valuedAt}`} value={debt} onChange={setDebt} max={1_000_000} step={50} hint="Services Australia: money you've already repaid won't affect the amount." />
                <Row label="Resolution Scheme payment" value={formatAUD(resolutionSchemePayment(debt), 2)} bold highlight />
              </CardContent></Card>
            </div>
            <ul className="list-disc pl-6 space-y-1 text-warmgray mt-4">
              <li><strong>Eligible:</strong> an employment income debt for a period between {RESOLUTION_SCHEME.debtPeriodFrom} and {RESOLUTION_SCHEME.debtPeriodTo}, likely affected by income apportionment, raised before 5 December 2025; not waived in full or zeroed before 30 January 2026; and you haven&apos;t been found guilty of fraud over it. Each eligible debt gets its own payment.</li>
              <li><strong>Apply:</strong> myGov → Centrelink → Money you owe → Apply for Resolution Scheme (eligible debts are listed), or phone the Income Apportionment line.</li>
              <li><strong>What accepting means:</strong> you release the Commonwealth from claims about the use of income apportionment for that debt. It doesn&apos;t stop you asking for a review of the debt, and it doesn&apos;t affect a robodebt settlement payment.</li>
              <li>The payment isn&apos;t taxable or counted as income, and you don&apos;t report it.</li>
            </ul>
          </W3Section>

          <W3Section title="How Earnings Reporting Creates an Overpayment">
            <p className={P}>An overpayment is simply being paid more than you were eligible for. With an income-tested payment like JobSeeker, the payment is set by the income you <em>report</em> each fortnight. If the true figure was higher, the income test should have taken more off — and that difference becomes a debt. Since 7 December 2020 you report pay <strong>as it appears on your payslip, for the Centrelink fortnight you were paid</strong> (gross, before tax), rather than for the days you worked.</p>
            <Card className="shadow-md">
              <CardContent className="p-6 md:p-8">
                <h3 style={FONT} className="text-lg font-semibold text-navy mb-4">JobSeeker Overpayment Illustration</h3>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <MoneyInput id="reported" label="Income you reported (fortnight)" value={reported} onChange={setReported} max={5_000} />
                    <MoneyInput id="actual" label="Gross pay you actually received" value={actual} onChange={setActual} max={5_000} />
                    <MoneyInput id="fortnights" label="Fortnights this happened" value={fortnights} onChange={setFortnights} max={52} step={1} prefix="" />
                  </form>
                  <div className="space-y-3 text-sm bg-white rounded-xl border border-sandstone-dark/20 p-5">
                    <Row label="Single JobSeeker maximum (from 20 Sep 2026)" value={formatAUD(JS_MAX, 2)} />
                    <Row label="Overpaid each fortnight" value={formatAUD(Math.max(0, r.per), 2)} bold />
                    <Row label={`Debt over ${fortnights} fortnight${fortnights === 1 ? "" : "s"}`} value={formatAUD(r.total, 2)} bold highlight />
                    <p className="text-xs text-warmgray-light pt-2">JobSeeker income test: {formatAUD(T.freeArea)} free area, 50c per $1 to {formatAUD(T.band1End)}, 60c above. In the 60c band every unreported dollar is 60 cents of debt. An illustration only — a real debt letter works from your full record, including Working Credit.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <p className={P + " mt-4"}>The same logic applies to every income-tested payment, with that payment&apos;s free area and taper. See exactly how your pay moves each one in the <Link href="/jobseeker-payment-calculator/" className={LINK}>JobSeeker</Link>, <Link href="/parenting-payment-calculator/" className={LINK}>Parenting Payment</Link>, <Link href="/austudy-youth-allowance-calculator/" className={LINK}>Austudy and Youth Allowance</Link>, <Link href="/age-pension-income-test-calculator/" className={LINK}>Age Pension</Link> and <Link href="/carer-payment-calculator/" className={LINK}>Carer Payment</Link> calculators. The <Link href="/fortnightly-pay-calculator/" className={LINK}>fortnightly pay calculator</Link> gives the gross figure to report.</p>
            <ul className="list-disc pl-6 space-y-1 text-warmgray">
              <li>Report your <strong>gross</strong> income, not the amount paid into your bank.</li>
              <li>Tell Services Australia about changes to your circumstances within <strong>14 days</strong>.</li>
            </ul>
          </W3Section>

          <W3Section title="What Happens If You Have a Centrelink Debt">
            <ol className="list-decimal pl-6 space-y-1 text-warmgray">
              <li>Services Australia identifies the overpayment and checks whether you owe money.</li>
              <li>You get a letter saying how much, why, and a due date — usually 28 days after the letter. You can also see it in myGov under Money you owe.</li>
              <li>If you still get a payment, repayments are deducted from it automatically (you can change the amount). If not, repay in full or set up a payment arrangement by the due date — no interest if you keep to the arrangement.</li>
              <li>If you do nothing and aren&apos;t on a payment, they may charge interest, take your tax refund, ask your employer or bank to recover it, or issue a Departure Prohibition Order. Centrelink debts don&apos;t affect your credit rating.</li>
            </ol>
            <p className={P + " mt-4"}>You can ask for an explanation or a review if you disagree, pause repayments after a crisis, disaster or hardship, and in special circumstances have all or part of a debt waived — even one you have already repaid. Centrelink debt recovery line: 1800 076 072. Be careful with calls or texts about a debt: if unsure, hang up and call the official number back.</p>
          </W3Section>

          <W3Section title="Income Apportionment vs Robodebt">
            <div className={TABLE_WRAP}>
              <table className="w-full text-sm">
                <thead className="bg-sandstone"><tr><th scope="col" className={TH}></th><th scope="col" className={TH}>Income apportionment</th><th scope="col" className={TH}>Robodebt</th></tr></thead>
                <tbody className="divide-y divide-sandstone-dark/10">
                  <tr><td className={TD + " font-medium"}>What it was</td><td className={TD}>Your reported employment income spread evenly over two or more Centrelink fortnights</td><td className={TD}>Debts raised from averaged ATO income data under the Income Compliance Program</td></tr>
                  <tr className="bg-eucalyptus-light/30"><td className={TD + " font-medium"}>When</td><td className={TD}>Debt periods {RESOLUTION_SCHEME.debtPeriodFrom} – {RESOLUTION_SCHEME.debtPeriodTo}</td><td className={TD}>Debts raised July 2015 – November 2019</td></tr>
                  <tr><td className={TD + " font-medium"}>What&apos;s on offer</td><td className={TD}>Resolution Scheme payment up to {formatAUD(RESOLUTION_SCHEME.maxPayment)} per debt; apply by {RESOLUTION_SCHEME.closes}</td><td className={TD}>Class action settlement ($475m approved 23 June 2026); registrations closed</td></tr>
                </tbody>
              </table>
            </div>
          </W3Section>

          <W3Section title="Related Calculators and Guides">
            <W3Related current="debt" />
          </W3Section>

          <MethodologyDisclosure>
            <ul className="list-disc pl-4 space-y-1">
              <li>Overpayment = JobSeeker on the reported income − JobSeeker on the actual income, each floored at $0, using the 20 September 2026 single maximum and the unchanged income test. Resolution Scheme payment follows Services Australia&apos;s band table.</li>
              <li>Every fact on this page comes from Services Australia pages read on {SRC.verifiedOn}; no news reports are relied on. {SITE_CONFIG.name} is not Services Australia and can&apos;t see your debt.</li>
            </ul>
          </MethodologyDisclosure>

          <W3Faqs faqs={DEBT_FAQS} topic="Centrelink debt" />
          <W3Footer sources={SOURCES_LIST} lastVerified={SRC.verifiedOn} authorKey="centrelink-debt" />
        </div>
      </div>
    </div>
  );
}

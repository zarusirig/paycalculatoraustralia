// The static long-form content on /centrelink-debt/, in two slots around the
// two sections that hold the interactive illustrations (which stay in
// centrelink-debt.tsx). Server components, so they ship as HTML; the client
// module renders them via the `intro` and `children` props.

import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import { CARER_SUPPORT_SOURCES as SRC, RESOLUTION_SCHEME } from "@/lib/constants/centrelink-carer-and-support";
import { Note, W3Faqs, W3Footer, W3Related, W3Section } from "./centrelink-w3-shared";
import { DEBT_FAQS } from "./centrelink-w3-faqs";

// Same values as the exports of centrelink-shared.tsx, which is a "use client"
// module and so cannot supply plain values to a server component.
const P = "text-warmgray mb-4";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

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

export default function CentrelinkDebtContent() {
  return (
    <>
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
    </>
  );
}

/** The "why it's in the news" section, before the Resolution Scheme estimator. */
export function CentrelinkDebtIntro() {
  return (
    <>
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
    </>
  );
}

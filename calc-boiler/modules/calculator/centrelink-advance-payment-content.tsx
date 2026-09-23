// The static long-form content on /centrelink-advance-payment/. A server
// component, so it ships as HTML; the client module
// (centrelink-advance-payment.tsx) renders it via `children` below the
// calculator card.

import Link from "next/link";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import {
  ADVANCE_LIMITS,
  ADVANCE_RULES,
  CARER_SUPPORT_SOURCES as SRC,
  advanceRepayment,
  type AdvanceKind,
} from "@/lib/constants/centrelink-carer-and-support";
import { W3Faqs, W3Footer, W3Related, W3Section } from "./centrelink-w3-shared";
import { ADVANCE_FAQS } from "./centrelink-w3-faqs";

// Same values as the exports of centrelink-shared.tsx, which is a "use client"
// module and so cannot supply plain values to a server component.
const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

const SOURCES_LIST = [
  source("Advance payment", SRC.advancePayment),
  source("Centrelink online account help — apply for an advance payment", SRC.advancePaymentHowToApply),
];

export default function CentrelinkAdvancePaymentContent() {
  return (
    <>
      <W3Section title="How Much Advance Can You Get?">
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Payment</th><th scope="col" className={TH + " text-right"}>Lowest</th><th scope="col" className={TH + " text-right"}>Highest</th><th scope="col" className={TH + " text-right"}>Repayment on highest</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {(["allowance", "pensionSingle", "pensionCouple", "specialEmployment", "ftb"] as AdvanceKind[]).map((k, i) => (
                <tr key={k} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className={TD}>{ADVANCE_LIMITS[k].label}</td>
                  <td className={TD + " text-right"}>{ADVANCE_LIMITS[k].min !== null ? formatAUD(ADVANCE_LIMITS[k].min as number, 2) : "—"}</td>
                  <td className={TD + " text-right"}>{formatAUD(ADVANCE_LIMITS[k].max, 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(advanceRepayment(ADVANCE_LIMITS[k].max), 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">Pension amounts change with pension rates each March and September; these are the figures published after the 20 September 2026 change. If you get a part-rate pension, or you are under 21 on Disability Support Pension, the advance is worked out from the pension you actually get. Farm Household Allowance: {formatAUD(250)} to {formatAUD(500)}. FTB Part A: a regular advance is {ADVANCE_RULES.ftbRegularAdvancePercent}% of the standard rate for one child under 13, paid every 26 weeks; a one-off advance is up to {ADVANCE_RULES.ftbOneOffPercent}% of your annual rate.</p>
      </W3Section>

      <W3Section title="Who Can Get an Advance Payment?">
        <ul className="list-disc pl-6 space-y-1 text-warmgray">
          <li><strong>After at least {ADVANCE_RULES.monthsOnPaymentBeforeApplying} months on:</strong> Age Pension, Carer Payment, Disability Support Pension, Farm Household Allowance, JobSeeker Payment, Parenting Payment or Youth Allowance (job seeker).</li>
          <li><strong>At any time on:</strong> ABSTUDY Living Allowance, Austudy, Youth Allowance (students), Family Tax Benefit Part A or Mobility Allowance.</li>
          <li><strong>Once in 12 months</strong> on ABSTUDY, Austudy, Farm Household Allowance, Mobility Allowance, JobSeeker, Parenting Payment (unless you became single in the past 28 days) and Youth Allowance.</li>
          <li><strong>Pensions:</strong> in any 6 months or 13 fortnights, one advance at the highest amount, up to two smaller advances, or three at the lowest amount. You can take it all at once or in 2 instalments.</li>
        </ul>
        <p className={P + " mt-4"}>You can&apos;t get one if you&apos;re still repaying an advance from more than 12 months ago, owe a debt to the Australian Government, can&apos;t afford to repay it within 6 months, have less than the lowest advance available, or are outside Australia. When you apply you&apos;ll be asked how much you have left each fortnight after regular expenses.</p>
      </W3Section>

      <W3Section title="Special Employment Advance">
        <p className={P}>A separate advance of {formatAUD(ADVANCE_LIMITS.specialEmployment.min ?? 0)} to {formatAUD(ADVANCE_LIMITS.specialEmployment.max)} for people who have been on Austudy, Carer Payment, Disability Support Pension, JobSeeker, Parenting Payment Single or Youth Allowance for at least 3 months and get a job of at least 6 weeks that will cut their payment by at least 50% — to buy things needed to start, such as work boots, tools or hi-vis — or whose employer hasn&apos;t paid them yet and won&apos;t for another 2 days. It is claimed with a form rather than online. Starting work will reduce your payment through the income test: see the <Link href="/jobseeker-payment-calculator/" className={LINK}>JobSeeker payment calculator</Link>.</p>
      </W3Section>

      <W3Section title="How to Apply">
        <ol className="list-decimal pl-6 space-y-1 text-warmgray">
          <li>Sign in to myGov, go to Centrelink, then Payments and claims → Manage payments → Manage advance payments (or Apply for Advance). You&apos;ll see whether you&apos;re eligible now or when you will be.</li>
          <li>Enter how much you have left each fortnight after rent, food, bills, travel and other regular costs.</li>
          <li>Choose an amount within the range shown, and one payment or two instalments (FTB advances are one instalment).</li>
          <li>Review the fortnightly repayment, agree to the declaration and submit. You get a receipt straight away saying whether it was successful.</li>
        </ol>
        <p className={P + " mt-4"}>You can also apply in the Express Plus Centrelink app, by phone self service, by calling your payment line or at a service centre. If you have a nominee, you can&apos;t apply through your own online account.</p>
      </W3Section>

      <W3Section title="Related Calculators and Guides">
        <W3Related current="advance" />
      </W3Section>

      <MethodologyDisclosure>
        <ul className="list-disc pl-4 space-y-1">
          <li>Repayment = advance ÷ {ADVANCE_RULES.repaymentFortnights}, to the cent, as Services Australia states. Paid to you = usual payment − repayment, floored at $0.</li>
          <li>Advance limits are Services Australia&apos;s published figures, read {SRC.verifiedOn}. The calculator does not check eligibility, previous advances or debts.</li>
          <li>{SITE_CONFIG.name} is not Services Australia. Your online account shows your actual range.</li>
        </ul>
      </MethodologyDisclosure>

      <W3Faqs faqs={ADVANCE_FAQS} topic="Centrelink advance payment" />
      <W3Footer sources={SOURCES_LIST} lastVerified={SRC.verifiedOn} authorKey="centrelink-advance-payment" />
    </>
  );
}

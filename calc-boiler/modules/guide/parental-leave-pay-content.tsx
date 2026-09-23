// Server-rendered long-form part of /parental-leave-pay/: everything below
// the calculator card. The interactive calculator stays in
// parental-leave-pay.tsx ("use client") and renders this as {children}.
//
// centrelink-shared.tsx is "use client", so its class-name strings and the
// source() helper are re-declared here (identical values) instead of imported.

import Link from "next/link";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import type { SourceLink } from "@/components/common/source-attribution";
import { formatAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import {
  PPL_CURRENT_FY,
  PPL_ENTITLEMENT,
  PPL_INCOME_TEST,
  PPL_RATES,
  PPL_RULES,
  PPL_SOURCES,
  PPL_WORK_TEST,
  pplSuperEstimate,
} from "@/lib/constants/paid-parental-leave";
import { W3Faqs, W3Footer, W3Related, W3Section } from "@/modules/calculator/centrelink-w3-shared";
import { PPL_FAQS } from "@/modules/calculator/centrelink-w3-faqs";

const P = "text-warmgray mb-4";
const LINK = "text-eucalyptus-dark hover:underline font-medium";
const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
const TH = "px-4 py-3 text-left font-semibold text-navy";
const TD = "px-4 py-3 text-navy tabular-nums";

function source(title: string, url: string): SourceLink {
  return { title, url, publisher: SOURCES.servicesAustralia.name };
}

const NOW = PPL_ENTITLEMENT[PPL_ENTITLEMENT.length - 1];
const RATE = PPL_RATES[PPL_CURRENT_FY];

const SOURCES_LIST = [
  source("Parental Leave Pay", PPL_SOURCES.overview),
  source("How much Parental Leave Pay you can get", PPL_SOURCES.howMuch),
  source("Who can get Parental Leave Pay", PPL_SOURCES.whoCanGet),
  source("Meeting the income test", PPL_SOURCES.incomeTest),
  source("Work requirements", PPL_SOURCES.workTest),
  source("Claiming timeframes", PPL_SOURCES.claiming),
  source("Getting your payment", PPL_SOURCES.gettingPaid),
  source("If you work on a Parental Leave Pay day", PPL_SOURCES.workingOnADay),
  source("Paid Parental Leave scheme changes", PPL_SOURCES.schemeChanges),
  { title: "Paid Parental Leave Superannuation Contribution", url: PPL_SOURCES.atoSuper, publisher: SOURCES.ato.name },
  { title: "Parental leave (unpaid entitlement under the NES)", url: "https://www.fairwork.gov.au/leave/parental-leave", publisher: SOURCES.fwo.name },
];

type FyKey = "2024-25" | "2025-26";

export default function ParentalLeavePayContent() {
  return (
    <>
      <W3Section title="How Much Is Paid Parental Leave?">
        <p className={P}>Parental Leave Pay is based on the national minimum wage and usually changes on 1 July. You are paid the rate for the <strong>financial year each day falls in</strong>, not the year your child was born — so leave that runs across 1 July is paid at two rates.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Days taken in</th><th scope="col" className={TH + " text-right"}>Per day</th><th scope="col" className={TH + " text-right"}>Per 5-day week</th><th scope="col" className={TH + " text-right"}>{NOW.days} days</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {(Object.keys(PPL_RATES) as (keyof typeof PPL_RATES)[]).map((fy, i) => (
                <tr key={fy} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className={TD}>{fy}</td>
                  <td className={TD + " text-right"}>{formatAUD(PPL_RATES[fy].daily, 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(PPL_RATES[fy].weekly, 2)}</td>
                  <td className={TD + " text-right"}>{formatAUD(Math.round(NOW.days * PPL_RATES[fy].daily * 100) / 100, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">Before tax. Parental Leave Pay is taxable income. For a multiple birth you get Parental Leave Pay for one child only.</p>
      </W3Section>

      <W3Section title="How Many Weeks: 22, 24 or 26?">
        <p className={P}>It depends on the child&apos;s date of birth or adoption:</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Born or adopted from</th><th scope="col" className={TH + " text-right"}>Family gets up to</th><th scope="col" className={TH + " text-right"}>Reserved for partner</th><th scope="col" className={TH + " text-right"}>Days you can take at the same time</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {PPL_ENTITLEMENT.map((e, i) => (
                <tr key={e.from} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}>
                  <td className={TD}>{e.label}</td>
                  <td className={TD + " text-right"}>{e.days} days ({e.weeks} weeks)</td>
                  <td className={TD + " text-right"}>{e.reservedForPartner} days</td>
                  <td className={TD + " text-right"}>{e.maxConcurrentDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={P + " mt-4"}>A single parent gets all the days (and can choose to share). If you lodged a pre-birth claim before 1 July 2026 and the baby arrives on or after it, Services Australia adds the extra 10 days once it has proof of birth — no new claim needed.</p>
      </W3Section>

      <W3Section title="Paid Parental Leave Income Test">
        <p className={P}>Services Australia looks at your adjusted taxable income for the financial year before the birth or adoption, or before your claim — whichever date is earlier.</p>
        <div className={TABLE_WRAP}>
          <table className="w-full text-sm">
            <thead className="bg-sandstone"><tr><th scope="col" className={TH}>Income year</th><th scope="col" className={TH + " text-right"}>Individual limit</th><th scope="col" className={TH + " text-right"}>Family limit (if you fail the individual test)</th></tr></thead>
            <tbody className="divide-y divide-sandstone-dark/10">
              {(Object.keys(PPL_INCOME_TEST) as FyKey[]).reverse().map((fy, i) => (
                <tr key={fy} className={i % 2 === 1 ? "bg-eucalyptus-light/30" : undefined}><td className={TD}>{fy}</td><td className={TD + " text-right"}>{formatAUD(PPL_INCOME_TEST[fy].individual)}</td><td className={TD + " text-right"}>{formatAUD(PPL_INCOME_TEST[fy].family)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-warmgray-light">Your partner is whoever you&apos;re in a relationship with on the day you claim. If you don&apos;t have a partner, your own income is tested against the family limit.</p>
      </W3Section>

      <W3Section title="Paid Parental Leave Work Test">
        <ul className="list-disc pl-6 space-y-1 text-warmgray">
          <li>Worked <strong>{PPL_WORK_TEST.monthsWorked} of the {PPL_WORK_TEST.monthsWindow} months</strong> before the birth or adoption ({PPL_WORK_TEST.daysWorkedPeriod} of {PPL_WORK_TEST.daysWindow} days), and</li>
          <li>at least <strong>{PPL_WORK_TEST.minHours} hours</strong> in those 10 months — around one day a week, and</li>
          <li>no gap of more than <strong>{PPL_WORK_TEST.maxGapWeeks} weeks</strong> between work days.</li>
        </ul>
        <p className={P + " mt-4"}>Paid leave counts as work, work for several employers can be combined, and self-employed parents can qualify. There are exceptions for pregnancy-related illness, complications and premature birth, and a dangerous jobs provision. If you are the birth mother&apos;s partner (or the biological father or his partner), <em>both</em> you and the birth mother must meet the work test.</p>
      </W3Section>

      <W3Section title="Flexible Days, Sharing and Working">
        <ul className="list-disc pl-6 space-y-1 text-warmgray">
          <li>Take your days as one block, several blocks, single days, or a mix — all within <strong>{PPL_RULES.useWithinYears} years</strong> of the birth or adoption. You can change nominated days after claiming.</li>
          <li>The birth mother (or first adoptive parent) approves how many days are shared with the other parent; each parent claims separately.</li>
          <li>Parental Leave Pay is only for days you don&apos;t work. Working <strong>{PPL_RULES.workingDayHours} hour or more</strong> — including a keeping-in-touch meeting or training — counts as working, so pick another day or return that day to your balance. The birth mother must not work in the first {PPL_RULES.birthMotherNoWorkDays} days after the birth.</li>
          <li>You can take Parental Leave Pay before, during or after employer-paid parental leave, annual leave or long service leave.</li>
        </ul>
      </W3Section>

      <W3Section title="Who Pays You: Employer or Centrelink">
        <p className={P}>Your employer pays your Parental Leave Pay through payroll if you&apos;ve worked for them for at least 12 months before the birth or adoption, they&apos;re Australian based, and you take a continuous block of at least {PPL_RULES.employerMinBlockWeeks} weeks of 5-day weeks within a year of the birth — withholding tax at your usual rate. Otherwise Services Australia pays you every 2 weeks and withholds tax at {Math.round(PPL_RULES.defaultWithholding * 100)}% unless you ask for a different rate. If you have other income that year, 15% may not be enough — the <Link href="/income-tax-calculator/" className={LINK}>income tax calculator</Link> shows your likely bill.</p>
      </W3Section>

      <W3Section title="Super on Paid Parental Leave">
        <p className={P}>For children born or adopted from 1 July 2025, the ATO pays a <strong>Paid Parental Leave Superannuation Contribution</strong> of {Math.round(PPL_RULES.superRate * 100)}% of the Parental Leave Pay you received, plus an interest component, as a lump sum to your super fund after the end of the financial year. The first contributions are paid in 2026-27. There&apos;s nothing to claim — just make sure your fund has your TFN and that your name and address match at the ATO and Services Australia. It counts towards your concessional contributions cap and is taxed at 15% in the fund. On {NOW.days} days at the 2026-27 rate that is about {formatAUD(pplSuperEstimate(NOW.days * RATE.daily), 2)} before interest.</p>
      </W3Section>

      <W3Section title="How and When to Claim">
        <ol className="list-decimal pl-6 space-y-1 text-warmgray">
          <li>Claim through your Centrelink online account up to <strong>{PPL_RULES.claimMonthsBefore} months before</strong> the due date. Claiming early lets your employer register and opt in.</li>
          <li>After the birth, give Services Australia your child&apos;s details and proof of birth within 56 days.</li>
          <li>To be paid from the date of birth, the claim and proof must be in within <strong>{PPL_RULES.backdateDays} days (14 weeks)</strong>. Payments can be backdated up to 100 days.</li>
          <li>At least one parent must claim within {PPL_RULES.firstClaimWeeks} weeks of the birth or adoption; the other parent has 2 years.</li>
        </ol>
        <p className={P + " mt-4"}>Separately from the government payment, employees may be entitled to unpaid parental leave under the National Employment Standards — see the Fair Work Ombudsman. Budget the drop from your salary with the <Link href="/take-home-pay-calculator/" className={LINK}>take-home pay calculator</Link>.</p>
      </W3Section>

      <W3Section title="Related Calculators and Guides">
        <W3Related current="ppl" />
        <ul className="space-y-2 text-warmgray mt-2">
          <li><Link href="/family-tax-benefit-calculator/" className={LINK}>Family Tax Benefit calculator</Link> &mdash; Parental Leave Pay counts in your family income</li>
          <li><Link href="/superannuation-calculator/" className={LINK}>Superannuation calculator</Link> &mdash; the effect of time out of work on your balance</li>
          <li><Link href="/leave-calculator/" className={LINK}>Leave calculator</Link> &mdash; annual and personal leave balances</li>
        </ul>
      </W3Section>

      <MethodologyDisclosure>
        <ul className="list-disc pl-4 space-y-1">
          <li>Days: {PPL_ENTITLEMENT.map((e) => `${e.days} from ${e.label}`).join("; ")}. Your days = family days − the partner&apos;s days, capped at family days − reserved days. Days are laid out Monday to Friday from your first day and each is priced at its financial year&apos;s published daily rate.</li>
          <li>Income test: individual first, then family, with the published limits. Super estimate = {Math.round(PPL_RULES.superRate * 100)}% of your Parental Leave Pay, excluding interest.</li>
          <li>All figures read at Services Australia and the ATO on {PPL_SOURCES.verifiedOn}. {SITE_CONFIG.name} is not Services Australia.</li>
        </ul>
      </MethodologyDisclosure>

      <W3Faqs faqs={PPL_FAQS} topic="Paid Parental Leave" />
      <W3Footer sources={SOURCES_LIST} lastVerified={PPL_SOURCES.verifiedOn} authorKey="parental-leave-pay" />
    </>
  );
}

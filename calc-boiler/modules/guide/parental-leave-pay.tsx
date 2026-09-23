"use client";

// W3 (23 Sep 2026): rebuilt calculator-first to target "paid parental leave"
// (14.8k, KD16), "paid parental leave australia" (6.6k) and "parental leave
// centrelink" (5.4k) — the page was not in the top 100 for any of them, and
// its figures were a year stale (24 weeks, $915/week, 2 reserved weeks,
// $168,865). Every figure now comes from lib/constants/paid-parental-leave.ts,
// read at Services Australia and the ATO on 23 Sep 2026. URL kept as
// /parental-leave-pay/ (15 internal references; no redirect needed).

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import MethodologyDisclosure from "@/components/common/methodology-disclosure";
import { formatAUD, formatNegAUD, SITE_CONFIG, SOURCES } from "@/lib/constants";
import {
  PPL_CURRENT_FY,
  PPL_ENTITLEMENT,
  PPL_INCOME_TEST,
  PPL_RATES,
  PPL_RULES,
  PPL_SOURCES,
  PPL_WORK_TEST,
  pplBlockGross,
  pplEntitlementFor,
  pplMeetsIncomeTest,
  pplSplit,
  pplSuperEstimate,
} from "@/lib/constants/paid-parental-leave";
import { FONT, INPUT, LABEL, LINK, P, Row, TABLE_WRAP, TD, TH, source } from "@/modules/calculator/centrelink-shared";
import { MoneyInput, Note, W3Faqs, W3Footer, W3Related, W3Section } from "@/modules/calculator/centrelink-w3-shared";
import { PPL_FAQS } from "@/modules/calculator/centrelink-w3-faqs";
import { ChevronRight } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";

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

export default function ParentalLeavePayPage() {
  const [birth, setBirth] = useState("2026-10-05");
  const [start, setStart] = useState("2026-10-05");
  const [partnered, setPartnered] = useState(true);
  const [partnerDays, setPartnerDays] = useState<number>(NOW.reservedForPartner);
  const [ownAti, setOwnAti] = useState(85_000);
  const [partnerAti, setPartnerAti] = useState(95_000);
  const [incomeFy, setIncomeFy] = useState<FyKey>("2025-26");

  const r = useMemo(() => {
    const ent = pplEntitlementFor(birth || "2026-10-05");
    const split = pplSplit(ent, partnered, partnerDays);
    const block = pplBlockGross(start || birth, split.claimantDays);
    const income = pplMeetsIncomeTest(incomeFy, ownAti, partnered ? partnerAti : 0);
    return { ent, split, block, income, superEst: pplSuperEstimate(block.gross), withheld: Math.round(block.gross * PPL_RULES.defaultWithholding * 100) / 100 };
  }, [birth, start, partnered, partnerDays, ownAti, partnerAti, incomeFy]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Paid Parental Leave</span></li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">Paid Parental Leave Calculator 2026 — 26 Weeks, Pay and Super</h1>
          <p className="text-lg text-warmgray">
            For a child born or adopted from {NOW.label}, the government&apos;s Paid Parental Leave scheme pays your family up to <strong>{NOW.days} days ({NOW.weeks} weeks)</strong> of Parental Leave Pay at <strong>{formatAUD(RATE.daily, 2)} a day ({formatAUD(RATE.weekly, 2)} a week)</strong> before tax, with {NOW.reservedForPartner} days reserved for a partner and a {Math.round(PPL_RULES.superRate * 100)}% super contribution from the ATO. Work out your days, your pay and whether you meet the income test.
          </p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">Paid Parental Leave Calculator</h2>
              <div className="grid md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div>
                    <label htmlFor="birth" className={LABEL}>Child&apos;s date of birth or adoption (or due date)</label>
                    <input id="birth" type="date" value={birth} onChange={(e) => { setBirth(e.target.value); setStart(e.target.value); }} className={INPUT} />
                  </div>
                  <div>
                    <label htmlFor="start" className={LABEL}>Your first Parental Leave Pay day</label>
                    <input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className={INPUT} />
                    <p className="text-xs text-warmgray-light mt-1">We lay your days out as one continuous weekday block from here.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <input id="partnered" type="checkbox" checked={partnered} onChange={(e) => setPartnered(e.target.checked)} className="mt-1" />
                    <label htmlFor="partnered" className="text-sm text-navy">I have a partner</label>
                  </div>
                  {partnered && (
                    <div>
                      <label htmlFor="pdays" className={LABEL}>Days your partner will take</label>
                      <input id="pdays" type="number" min={0} max={r.ent.days} value={partnerDays} onChange={(e) => setPartnerDays(Math.max(0, Math.min(r.ent.days, Number(e.target.value || 0))))} className={INPUT} />
                      <p className="text-xs text-warmgray-light mt-1">{r.ent.reservedForPartner} days are reserved for them — unused reserved days are lost.</p>
                    </div>
                  )}
                  <div>
                    <label htmlFor="fy" className={LABEL}>Income test year</label>
                    <select id="fy" value={incomeFy} onChange={(e) => setIncomeFy(e.target.value as FyKey)} className={INPUT}>
                      <option value="2025-26">2025-26 — birth or claim (whichever is earlier) from 1 July 2026</option>
                      <option value="2024-25">2024-25 — birth or claim (whichever is earlier) in 2025-26</option>
                    </select>
                  </div>
                  <MoneyInput id="own" label="Your adjusted taxable income that year" value={ownAti} onChange={setOwnAti} max={2_000_000} step={1_000} />
                  {partnered && <MoneyInput id="pati" label="Partner's adjusted taxable income that year" value={partnerAti} onChange={setPartnerAti} max={2_000_000} step={1_000} />}
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Your Parental Leave Pay (before tax)</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(r.block.gross, 2)}</div>
                    <div className="text-sm text-warmgray">{r.split.claimantDays} days ({(r.split.claimantDays / 5).toFixed(1)} weeks) · plus about {formatAUD(r.superEst, 2)} super</div>
                  </div>
                  <div className={`rounded-xl border p-4 text-sm text-navy ${r.income.meets ? "border-eucalyptus bg-eucalyptus-light/40" : "border-ochre/40 bg-ochre/10"}`}>
                    {r.income.meets
                      ? <><strong>Income test: met on the {r.income.via} test</strong> ({r.income.via === "individual" ? `your income ≤ ${formatAUD(PPL_INCOME_TEST[incomeFy].individual)}` : `family income ≤ ${formatAUD(PPL_INCOME_TEST[incomeFy].family)}`}). You also need the work test.</>
                      : <><strong>Income test: not met.</strong> Your income is over {formatAUD(PPL_INCOME_TEST[incomeFy].individual)} and family income over {formatAUD(PPL_INCOME_TEST[incomeFy].family)} for {incomeFy}.</>}
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 p-5 space-y-3 text-sm">
                    <Row label={`Family entitlement (born/adopted from ${r.ent.label})`} value={`${r.ent.days} days`} />
                    <Row label="Your days" value={`${r.split.claimantDays}`} />
                    {partnered && <Row label="Partner's days" value={`${r.split.partnerDays} · ${formatAUD(pplBlockGross(start || birth, r.split.partnerDays).gross, 2)}`} />}
                    {r.split.forfeitedDays > 0 && <Row label="Reserved days not used (lost)" value={`${r.split.forfeitedDays}`} />}
                    <div className="border-t border-sandstone-dark/10 pt-3" />
                    {Object.entries(r.block.byYear).map(([fy, n]) => (
                      <Row key={fy} label={`${n} days in ${fy} at ${(PPL_RATES as Record<string, { daily: number }>)[fy] ? formatAUD((PPL_RATES as Record<string, { daily: number }>)[fy].daily, 2) : `${formatAUD(RATE.daily, 2)}*`}`} value={formatAUD(n * ((PPL_RATES as Record<string, { daily: number }>)[fy]?.daily ?? RATE.daily), 2)} />
                    ))}
                    <Row label="Your Parental Leave Pay" value={formatAUD(r.block.gross, 2)} bold highlight />
                    <Row label={`Tax withheld if Services Australia pays you (${Math.round(PPL_RULES.defaultWithholding * 100)}% default)`} value={formatNegAUD(r.withheld, 2)} />
                    <Row label={`Super from the ATO (${Math.round(PPL_RULES.superRate * 100)}%, paid after 30 June)`} value={formatAUD(r.superEst, 2)} />
                  </div>
                  {r.block.unpublishedDays > 0 && <Note tone="warn">* {r.block.unpublishedDays} of your days fall after 30 June 2027. The rate for those days isn&apos;t published yet — it usually rises on 1 July with the national minimum wage — so they are priced at today&apos;s {formatAUD(RATE.daily, 2)}.</Note>}
                  <p className="text-xs text-warmgray-light">Weekdays only, one continuous block. Doesn&apos;t check the work test or residence rules. The super estimate excludes the ATO&apos;s interest component.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <div className="max-w-4xl mx-auto space-y-10">
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
        </div>
      </div>
    </div>
  );
}

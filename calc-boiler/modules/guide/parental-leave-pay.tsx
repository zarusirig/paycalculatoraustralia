"use client";

// W3 (23 Sep 2026): rebuilt calculator-first to target "paid parental leave"
// (14.8k, KD16), "paid parental leave australia" (6.6k) and "parental leave
// centrelink" (5.4k) — the page was not in the top 100 for any of them, and
// its figures were a year stale (24 weeks, $915/week, 2 reserved weeks,
// $168,865). Every figure now comes from lib/constants/paid-parental-leave.ts,
// read at Services Australia and the ATO on 23 Sep 2026. URL kept as
// /parental-leave-pay/ (15 internal references; no redirect needed).

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatAUD, formatNegAUD } from "@/lib/constants";
import {
  PPL_CURRENT_FY,
  PPL_ENTITLEMENT,
  PPL_INCOME_TEST,
  PPL_RATES,
  PPL_RULES,
  pplBlockGross,
  pplEntitlementFor,
  pplMeetsIncomeTest,
  pplSplit,
  pplSuperEstimate,
} from "@/lib/constants/paid-parental-leave";
import { FONT, INPUT, LABEL, Row } from "@/modules/calculator/centrelink-shared";
import { MoneyInput, Note } from "@/modules/calculator/centrelink-w3-shared";
import { ChevronRight } from "lucide-react";
import TrustBar from "@/components/common/trust-bar";

const NOW = PPL_ENTITLEMENT[PPL_ENTITLEMENT.length - 1];
const RATE = PPL_RATES[PPL_CURRENT_FY];

type FyKey = "2024-25" | "2025-26";

export default function ParentalLeavePayPage({ children }: { children: ReactNode }) {
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
            Paid Parental Leave in Australia is <strong>{formatAUD(RATE.daily, 2)} a day, or {formatAUD(RATE.weekly, 2)} a week</strong>, for {PPL_CURRENT_FY}, paid for up to <strong>{NOW.days} days ({NOW.weeks} weeks)</strong> for a child born or adopted on or after {NOW.label}. The rate is based on the National Minimum Wage and is taxed as income, with {NOW.reservedForPartner} of the days reserved for a partner and a {Math.round(PPL_RULES.superRate * 100)}% superannuation contribution paid by the ATO. Work out your days, your pay and whether you meet the income test.
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
          {children}
        </div>
      </div>
    </div>
  );
}

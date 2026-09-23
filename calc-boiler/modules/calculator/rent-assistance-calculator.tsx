"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import TrustBar from "@/components/common/trust-bar";
import { formatAUD, formatNegAUD } from "@/lib/constants";
import {
  FAMILY_PAYMENT_SOURCES,
  RENT_ASSISTANCE,
  RENT_ASSISTANCE_SITUATIONS,
  rentAssistanceFortnightly,
  rentToFortnightly,
  type RentAssistanceSituation,
} from "@/lib/constants/centrelink-family-payments";
import { FONT, INPUT, LABEL, Row, clamp } from "./centrelink-shared";

// DataForSEO 23 Sep 2026: "rent assistance calculator" and two Centrelink
// variants, 3.6k each, fairworkmate #9–13.
//
// The static long-form content is server-rendered
// (rent-assistance-calculator-content.tsx) and passed in as `children`.

const RA = RENT_ASSISTANCE;
type Period = "week" | "fortnight" | "month";

export default function RentAssistanceCalculatorPage({ children }: { children: ReactNode }) {
  const [situation, setSituation] = useState<RentAssistanceSituation>("single");
  const [rent, setRent] = useState(250);
  const [period, setPeriod] = useState<Period>("week");

  const row = RA.rows[situation];
  const result = useMemo(() => {
    const fortnightlyRent = rentToFortnightly(rent, period);
    const ra = rentAssistanceFortnightly(fortnightlyRent, situation);
    return { fortnightlyRent, ra, weekly: ra / 2, atMax: ra >= RA.rows[situation].max, share: fortnightlyRent > 0 ? ra / fortnightlyRent : 0 };
  }, [rent, period, situation]);

  return (
    <div className="min-h-screen flex-grow">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="bg-sandstone rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-sandstone-dark/10">
          <nav aria-label="breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-warmgray">
              <li><Link href="/" className="hover:text-eucalyptus-dark hover:underline">Pay Calculator</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><Link href="/centrelink-income-test/" className="hover:text-eucalyptus-dark hover:underline">Centrelink Income Test</Link></li>
              <li className="flex items-center"><ChevronRight className="h-3 w-3 text-warmgray-light" /></li>
              <li><span className="font-medium text-navy" aria-current="page">Rent Assistance Calculator</span></li>
            </ol>
          </nav>
          <h1 style={FONT} className="text-3xl md:text-4xl font-bold text-navy mt-4 mb-3">Rent Assistance Calculator — Centrelink Rates From {RA.ratesFrom}</h1>
          <p className="text-lg text-warmgray">
            Commonwealth Rent Assistance pays <strong>75 cents for every dollar of rent</strong> above a threshold, up to a maximum — <strong>{formatAUD(RA.rows.single.max, 2)} a fortnight</strong> for a single person, {formatAUD(RA.rows.singleFamily1or2.max, 2)} for a family with 1 or 2 children. Enter your rent to see what you could get.
          </p>
          <p className="mt-3 inline-block rounded-full bg-eucalyptus-light/60 px-3 py-1 text-xs font-semibold text-navy">Rates from {RA.ratesFrom} · verified {FAMILY_PAYMENT_SOURCES.verifiedOn}</p>
          <TrustBar className="mt-4" />
        </section>

        <section className="max-w-4xl mx-auto">
          <Card className="shadow-md">
            <CardContent className="p-6 md:p-8">
              <h2 style={FONT} className="text-xl font-semibold text-navy mb-6">How Much Rent Assistance Can You Get?</h2>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                  <div>
                    <label htmlFor="situation" className={LABEL}>Your situation</label>
                    <select id="situation" value={situation} onChange={(e) => setSituation(e.target.value as RentAssistanceSituation)} className={INPUT}>
                      <optgroup label="With an income support payment (no children)">
                        {RENT_ASSISTANCE_SITUATIONS.filter((k) => RA.rows[k].paidWith === "incomeSupport").map((k) => <option key={k} value={k}>{RA.rows[k].label}</option>)}
                      </optgroup>
                      <optgroup label="With Family Tax Benefit Part A (children)">
                        {RENT_ASSISTANCE_SITUATIONS.filter((k) => RA.rows[k].paidWith === "ftb").map((k) => <option key={k} value={k}>{RA.rows[k].label}</option>)}
                      </optgroup>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="rent" className={LABEL}>Rent you pay</label>
                    <div className="flex items-center gap-2"><span className="text-warmgray-light">$</span>
                      <input type="number" id="rent" min={0} max={10000} step={10} value={rent} onChange={(e) => setRent(clamp(Number(e.target.value || 0), 0, 10000))} className={INPUT} />
                      <select aria-label="Rent period" value={period} onChange={(e) => setPeriod(e.target.value as Period)} className={INPUT + " max-w-[9rem]"}>
                        <option value="week">a week</option>
                        <option value="fortnight">a fortnight</option>
                        <option value="month">a month</option>
                      </select>
                    </div>
                    <p className="text-xs text-warmgray-light mt-1">{situation.startsWith("couple") ? "Your combined rent as a couple." : "Your share of the rent."} Board and lodging: enter the lodging part only.</p>
                  </div>
                </form>

                <div className="space-y-6">
                  <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-6 text-center shadow-sm">
                    <div className="text-sm font-semibold text-ochre uppercase tracking-wider mb-2">Rent Assistance a fortnight</div>
                    <div className="text-4xl font-extrabold text-navy mb-1">{formatAUD(result.ra, 2)}</div>
                    <div className="text-sm text-warmgray">{formatAUD(result.weekly, 2)} a week · covers {Math.round(result.share * 100)}% of your rent{result.atMax ? " · maximum rate" : ""}</div>
                  </div>
                  <div className="bg-white rounded-xl border border-sandstone-dark/20 overflow-hidden">
                    <div className="bg-sandstone px-5 py-3 border-b border-sandstone-dark/20"><h3 className="font-semibold text-navy text-sm uppercase tracking-wider">How it was worked out</h3></div>
                    <div className="p-5 space-y-3 text-sm">
                      <Row label="Your rent a fortnight" value={formatAUD(result.fortnightlyRent, 2)} bold />
                      <Row label="Rent threshold (no assistance below this)" value={formatNegAUD(row.threshold, 2)} />
                      <Row label="Rent above the threshold × 75c" value={formatAUD(Math.max(0, result.fortnightlyRent - row.threshold) * RA.rate, 2)} />
                      <Row label="Maximum for your situation" value={formatAUD(row.max, 2)} />
                      <div className="border-t border-sandstone-dark/20 pt-3" />
                      <Row label="Rent Assistance" value={formatAUD(result.ra, 2)} bold highlight />
                      <Row label="Rent at which you reach the maximum" value={formatAUD(row.publishedMaxRent, 2)} />
                    </div>
                  </div>
                  <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 text-xs text-navy">
                    <strong>Before the income test.</strong> Rent Assistance is paid on top of an eligible payment — JobSeeker, Youth Allowance, Austudy, Parenting Payment, the Age Pension and others, or Family Tax Benefit Part A above the base rate for families. That payment&apos;s income and assets tests can reduce it. Not modelled: the special rules for people 25 or younger, board and lodging splits, and retirement village or site-fee arrangements. Rates read at Services Australia on {FAMILY_PAYMENT_SOURCES.verifiedOn}.
                  </div>
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

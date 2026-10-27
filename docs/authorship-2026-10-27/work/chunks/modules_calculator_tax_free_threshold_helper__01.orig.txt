"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { TAX_FREE_THRESHOLD, formatAUD } from "@/lib/constants";
import { FREQUENCY_LABELS, type PayFrequency } from "@/lib/constants/payg-withholding";
import {
  adviseTaxFreeThresholdClaim,
  tftWithholdingRow,
  type TftAdviceCode,
  type TftResidency,
} from "@/lib/constants/tax-free-threshold";

// The decision follows ATO QC103970 (how to claim) and QC50527 (multiple jobs)
// via adviseTaxFreeThresholdClaim, and the withholding figures come from the
// Schedule 1 engine — so the helper cannot disagree with the tables on the page.

const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
const INPUT =
  "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20 sm:text-sm";

const T = formatAUD(TAX_FREE_THRESHOLD);

const ADVICE: Record<TftAdviceCode, { headline: string; text: React.ReactNode }> = {
  whm: {
    headline: "Answer “No”",
    text: (
      <>The TFN declaration says working holiday makers must answer &ldquo;No&rdquo;. Working holiday maker income is taxed at 15% from the first dollar, so there is no threshold to claim. See <Link href="/working-holiday-tax/" className="underline">working holiday tax</Link>.</>
    ),
  },
  foreignResident: {
    headline: "Answer “No”",
    text: (
      <>A foreign resident for tax purposes can&rsquo;t claim the tax-free threshold on wages and pays tax from the first dollar. The one exception on the TFN declaration: a foreign resident receiving an Australian Government pension or allowance can answer &ldquo;Yes&rdquo; for that payment. See the <Link href="/non-resident-tax/" className="underline">non-resident tax guide</Link>.</>
    ),
  },
  partYear: {
    headline: "Yes, you can claim it",
    text: (
      <>Your payer withholds as if you had the full {T}, but at tax time the ATO gives you a part-year threshold instead, based on the months you were a resident. That can leave a small bill, so it&rsquo;s worth checking your part-year figure in the guide below.</>
    ),
  },
  onlyPayer: {
    headline: "Yes, claim it on this job",
    text: <>With only one payer at a time, you claim the threshold from that payer. Answer &ldquo;Yes&rdquo; to question 9 on the TFN declaration.</>,
  },
  allUnderThreshold: {
    headline: "Yes, you can claim it on each job",
    text: (
      <>The ATO lets you claim the threshold from every payer if you&rsquo;re certain your total income from all of them will be {T} or less. If your income later goes over, give one payer a withholding declaration to stop claiming it there, or you may get a tax bill.</>
    ),
  },
  alreadyClaimedElsewhere: {
    headline: "Answer “No” on this job",
    text: (
      <>You already claim the threshold from your other payer. Claiming it twice means too little tax is withheld and you&rsquo;ll get a bill when you lodge. Use the <Link href="/second-job-tax-calculator/" className="underline">second job tax calculator</Link> to see the combined result.</>
    ),
  },
  claimHere: {
    headline: "Yes, claim it on this job",
    text: (
      <>Claim it from the payer who pays you the most, which is this one, and answer &ldquo;No&rdquo; at the other job. If you already claimed it there, give that payer a withholding declaration to stop.</>
    ),
  },
  claimOnOtherJob: {
    headline: "Answer “No” on this job",
    text: (
      <>Claim the threshold from your higher-paying job and let this one withhold at the &ldquo;no tax-free threshold&rdquo; rate. The <Link href="/second-job-tax-calculator/" className="underline">second job tax calculator</Link> shows what each job withholds.</>
    ),
  },
};

export default function TaxFreeThresholdHelper() {
  const [residency, setResidency] = useState<TftResidency>("resident");
  const [hasOther, setHasOther] = useState(false);
  const [claimingOther, setClaimingOther] = useState(false);
  const [highest, setHighest] = useState(true);
  const [total, setTotal] = useState(45_000);
  const [pay, setPay] = useState(900);
  const [frequency, setFrequency] = useState<PayFrequency>("weekly");

  const advice = useMemo(
    () =>
      adviseTaxFreeThresholdClaim({
        residency,
        hasOtherCurrentPayer: hasOther,
        claimingFromOtherPayer: claimingOther,
        thisIsHighestPaying: highest,
        expectedTotalIncome: total,
      }),
    [residency, hasOther, claimingOther, highest, total],
  );
  const row = useMemo(() => tftWithholdingRow(pay, frequency), [pay, frequency]);
  const residentLike = residency === "resident" || residency === "partYearResident";
  const period = FREQUENCY_LABELS[frequency];
  const a = ADVICE[advice.code];

  return (
    <Card className="shadow-md not-prose" id="should-i-claim">
      <CardContent className="p-6 md:p-8">
        <h2 className="text-xl font-semibold text-navy mb-1" style={FONT}>
          Should I Claim the Tax-Free Threshold on This Job?
        </h2>
        <p className="text-sm text-warmgray mb-6">
          Answer for the job whose TFN declaration you&rsquo;re filling in. The rules are the ATO&rsquo;s; the pay figures use the ATO&rsquo;s Schedule 1 withholding formulas.
        </p>

        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="tft-res" className="block text-sm font-medium text-navy mb-1">Your tax residency this income year</label>
            <select id="tft-res" value={residency} onChange={(e) => setResidency(e.target.value as TftResidency)} className={INPUT}>
              <option value="resident">Australian resident for tax purposes</option>
              <option value="partYearResident">Resident for part of the year (arrived or left)</option>
              <option value="foreignResident">Foreign resident all year</option>
              <option value="workingHolidayMaker">Working holiday maker (visa 417 or 462)</option>
            </select>
          </div>

          {residentLike && (
            <fieldset className="sm:col-span-2">
              <legend className="text-sm font-medium text-navy mb-2">Does anyone else pay you at the same time? A second job, a taxable pension or a government allowance counts.</legend>
              <div className="flex gap-6 text-sm text-navy">
                <label className="flex items-center gap-2"><input type="radio" name="tft-other" checked={!hasOther} onChange={() => setHasOther(false)} className="accent-eucalyptus" />No, just this job</label>
                <label className="flex items-center gap-2"><input type="radio" name="tft-other" checked={hasOther} onChange={() => setHasOther(true)} className="accent-eucalyptus" />Yes</label>
              </div>
              <p className="mt-1 text-xs text-warmgray">A job you&rsquo;ve left doesn&rsquo;t count. When a payer stops paying you, you can claim the threshold from your new one.</p>
            </fieldset>
          )}

          {residentLike && hasOther && (
            <>
              <div>
                <label htmlFor="tft-total" className="block text-sm font-medium text-navy mb-1">Expected total income from all payers this year</label>
                <input id="tft-total" type="number" min={0} step={500} value={total} onChange={(e) => setTotal(Math.max(0, Number(e.target.value || 0)))} className={INPUT} />
              </div>
              <fieldset>
                <legend className="text-sm font-medium text-navy mb-2">Is this your higher-paying job?</legend>
                <div className="flex gap-6 text-sm text-navy">
                  <label className="flex items-center gap-2"><input type="radio" name="tft-hi" checked={highest} onChange={() => setHighest(true)} className="accent-eucalyptus" />Yes</label>
                  <label className="flex items-center gap-2"><input type="radio" name="tft-hi" checked={!highest} onChange={() => setHighest(false)} className="accent-eucalyptus" />No</label>
                </div>
              </fieldset>
              <label className="sm:col-span-2 flex items-start gap-2 text-sm text-navy">
                <input type="checkbox" checked={claimingOther} onChange={(e) => setClaimingOther(e.target.checked)} className="mt-1 accent-eucalyptus" />
                <span>I already claim the tax-free threshold from the other payer</span>
              </label>
            </>
          )}
        </form>

        <div className="mt-6" role="status" aria-live="polite">
          <div className={`rounded-lg border-l-4 p-4 text-sm text-navy ${advice.claim ? "border-eucalyptus bg-eucalyptus-light/30" : "border-ochre bg-sandstone"}`}>
            <p className="font-bold text-base mb-1">{a.headline}</p>
            <p>{a.text}</p>
          </div>
        </div>

        {residentLike && (
          <div className="mt-8 border-t border-sandstone-dark/20 pt-6">
            <h3 className="text-base font-semibold text-navy mb-3" style={FONT}>What it changes in this job&rsquo;s pay</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
              <div>
                <label htmlFor="tft-pay" className="block text-sm font-medium text-navy mb-1">Gross pay per {period}</label>
                <input id="tft-pay" type="number" min={0} step={10} value={pay} onChange={(e) => setPay(Math.max(0, Number(e.target.value || 0)))} className={INPUT} />
              </div>
              <div>
                <label htmlFor="tft-freq" className="block text-sm font-medium text-navy mb-1">Paid</label>
                <select id="tft-freq" value={frequency} onChange={(e) => setFrequency(e.target.value as PayFrequency)} className={INPUT}>
                  <option value="weekly">Weekly</option>
                  <option value="fortnightly">Fortnightly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-sandstone p-3">
                <dt className="text-xs text-warmgray">Tax withheld, threshold claimed</dt>
                <dd className="text-lg font-bold text-navy tabular-nums">{formatAUD(row.claimed)}</dd>
              </div>
              <div className="rounded-lg bg-sandstone p-3">
                <dt className="text-xs text-warmgray">Tax withheld, not claimed</dt>
                <dd className="text-lg font-bold text-navy tabular-nums">{formatAUD(row.notClaimed)}</dd>
              </div>
              <div className="rounded-lg bg-eucalyptus-light/40 p-3">
                <dt className="text-xs text-warmgray">Difference per {period}</dt>
                <dd className="text-lg font-bold text-navy tabular-nums">{formatAUD(row.difference)}</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-warmgray-light">
              Resident rates from 1 July 2026, no study loan. The difference isn&rsquo;t lost: it&rsquo;s credited against your tax when you lodge, so over-withholding comes back as a refund and under-withholding becomes a bill.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

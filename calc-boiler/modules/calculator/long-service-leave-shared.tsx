"use client";

import Link from "next/link";
import type { SourceLink } from "@/components/common/source-attribution";
import {
  LSL_JURISDICTIONS,
  LSL_SOURCES,
  type JurisdictionCode,
} from "@/lib/constants/long-service-leave";

// Style vocabulary shared by the long service leave hub, the eight spokes and
// the calculator. Same palette and type scale as the rest of the calculators.
export const FONT = { fontFamily: "'Bricolage Grotesque', sans-serif" };
export const H2 = "text-2xl font-semibold text-navy mb-4";
export const H3 = "text-xl font-semibold text-navy mb-3 mt-6";
export const P = "text-warmgray mb-4";
export const LINK = "text-eucalyptus-dark hover:underline font-medium";
export const TABLE_WRAP = "overflow-x-auto rounded-xl border border-sandstone-dark/20 shadow-sm";
export const TH = "px-4 py-3 text-left font-semibold text-navy";
export const TD = "px-4 py-3 text-navy tabular-nums";
export const INPUT =
  "block w-full rounded-md border-sandstone-dark/30 shadow-sm focus:border-eucalyptus focus:ring-eucalyptus/20";
export const LABEL = "block text-sm font-medium text-navy mb-1";

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Round a number of weeks the way the state authorities print them. */
export function weeks(n: number, dp = 2) {
  return n.toFixed(dp);
}

/**
 * The nearest salary that has a /take-home-pay-on/N/ page (30,000 to 200,000
 * in steps of 5,000), so a payout figure can always be sent somewhere real.
 */
export function takeHomeSalaryStep(amount: number): number {
  return clamp(Math.round(amount / 5_000) * 5_000, 30_000, 200_000);
}

export function jurisdictionSource(code: JurisdictionCode): SourceLink {
  const j = LSL_JURISDICTIONS[code];
  return { title: `${j.act} — ${j.agency}`, url: j.sourceUrl, publisher: j.agency };
}

export const ATO_SOURCE: SourceLink = {
  title: "Unused long service leave — withholding from unused leave payments on termination",
  url: LSL_SOURCES.ato,
  publisher: "Australian Taxation Office",
};

export const FWO_SOURCE: SourceLink = {
  title: "Long service leave",
  url: LSL_SOURCES.fwo,
  publisher: "Fair Work Ombudsman",
};

/**
 * The block every long service leave page carries: this is not annual leave,
 * and here is where the annual leave calculator lives.
 */
export function NotAnnualLeave() {
  return (
    <div className="bg-eucalyptus-light/40 border-l-4 border-eucalyptus p-4 text-sm text-navy">
      <strong>This is not annual leave.</strong> Annual leave is federal — four weeks a year for
      everyone under the National Employment Standards — and it is worked out on a different page:
      the{" "}
      <Link href="/leave-calculator/" className={LINK}>
        annual leave calculator
      </Link>
      . Long service leave is a separate entitlement under a separate state or territory Act, and the
      two do not overlap. Both are usually paid out together in your{" "}
      <Link href="/final-pay-calculator/" className={LINK}>
        final pay
      </Link>
      .
    </div>
  );
}

/** The scope statement. Entitlement and payout value; not legal advice. */
export function ScopeNote({ authority, authorityUrl }: { authority: string; authorityUrl: string }) {
  return (
    <div className="bg-sandstone border border-sandstone-dark/20 rounded-xl p-4 text-xs text-warmgray">
      <strong className="text-navy">What this covers.</strong> How many weeks you have accrued, what
      the balance is worth at your ordinary pay, and how the ATO taxes a payout — so you can check the
      figure on your payslip or final pay. It is not legal advice, and it does not cover disputes,
      dismissal or whether an award or agreement displaces the Act. For those, contact{" "}
      <a href={authorityUrl} target="_blank" rel="noreferrer noopener" className={LINK}>
        {authority}
      </a>{" "}
      or the{" "}
      <a href={LSL_SOURCES.fwo} target="_blank" rel="noreferrer noopener" className={LINK}>
        Fair Work Ombudsman
      </a>
      . Figures verified {LSL_SOURCES.verifiedOn}.
    </div>
  );
}

export function RelatedLinks({ current }: { current?: JurisdictionCode | "hub" }) {
  const spokes = (Object.keys(LSL_JURISDICTIONS) as JurisdictionCode[])
    .filter((c) => c !== current)
    .map((c) => LSL_JURISDICTIONS[c]);
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-navy mb-2">Long service leave in your state</h3>
        <ul className="grid sm:grid-cols-2 gap-2 text-warmgray text-sm">
          {current !== "hub" && (
            <li>
              <Link href="/long-service-leave-calculator/" className={LINK}>
                All states compared
              </Link>{" "}
              &mdash; the eight Acts side by side
            </li>
          )}
          {spokes.map((j) => (
            <li key={j.code}>
              <Link href={`/long-service-leave-calculator/${j.code}/`} className={LINK}>
                {j.abbr} long service leave
              </Link>{" "}
              &mdash; {j.weeksAtQualifying} weeks at {j.takeAfterYears} years
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="font-semibold text-navy mb-2">Work out the rest of your pay</h3>
        <ul className="space-y-2 text-warmgray text-sm">
          <li>
            <Link href="/leave-calculator/" className={LINK}>
              Annual leave calculator
            </Link>{" "}
            &mdash; a different entitlement: four weeks a year under the NES, not long service leave
          </li>
          <li>
            <Link href="/final-pay-calculator/" className={LINK}>
              Final pay calculator
            </Link>{" "}
            &mdash; unused annual leave, notice, long service leave and the tax on all of it
          </li>
          <li>
            <Link href="/redundancy-pay-calculator/" className={LINK}>
              Redundancy pay calculator
            </Link>{" "}
            &mdash; the NES redundancy scale, which changes how a payout is taxed
          </li>
          <li>
            <Link href="/take-home-pay-calculator/" className={LINK}>
              Take-home pay calculator
            </Link>{" "}
            &mdash; what a year with a payout in it actually leaves you
          </li>
        </ul>
      </div>
    </div>
  );
}

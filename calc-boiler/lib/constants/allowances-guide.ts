// =============================================================================
// Award allowances guide (/allowances-guide/) — first aid, laundry and uniform,
// tool, split or broken shift, and on-call allowances.
//
// This file publishes NO amount of its own. Every dollar figure is read from
// the occupation data in lib/data/job-pay-rates/, where each allowance was
// transcribed from the consolidated award text on awards.fairwork.gov.au
// ("incorporates all amendments up to and including 1 July 2026"; the clause
// number sits in each row's note) and dated JOB_PAY_VERIFIED_ON. This module
// only groups those rows by kind and merges identical rows that several
// occupations share under one award (for example the Health Professionals
// Award's on-call allowance, listed once, not once per profession).
//
// What it deliberately leaves out: any allowance whose amount is "agreed in
// writing" or otherwise not a figure the award prints (the Real Estate
// Industry Award's stand-by and call-out), and any award we have not
// transcribed. If your award is not listed, the Fair Work Ombudsman pay guide
// for it has the current amounts.
//
// FWO, "Allowances" (fairwork.gov.au/pay-and-wages/penalty-rates-allowances-
// and-other-payments/allowances, read 5 October 2026): allowances are extra
// payments for doing certain tasks, using a particular skill or own tools,
// unpleasant or hazardous conditions, or expenses; common ones include
// uniforms and special clothing, tools and equipment, travel, car and phone,
// first aid, leading hand and industry allowances. What you are owed depends
// on your award or agreement. Annualised wages, contracts, individual
// flexibility arrangements and guarantees of annual earnings must still pay
// at least what the award would.
// =============================================================================

import { OCCUPATIONS } from "../data/job-pay-rates";
import { JOB_PAY_VERIFIED_ON } from "../data/job-pay-rates/common";

export { JOB_PAY_VERIFIED_ON };

export const ALLOWANCES_VERIFIED_ON = "5 October 2026";

export const ALLOWANCE_SOURCES = {
  fwoAllowances: "https://www.fairwork.gov.au/pay-and-wages/penalty-rates-allowances-and-other-payments/allowances",
  fwoPayGuides: "https://www.fairwork.gov.au/pay-and-wages/minimum-wages/pay-guides",
  awards: "https://awards.fairwork.gov.au/",
} as const;

export type AllowanceKind = "first-aid" | "laundry-uniform" | "tool" | "split-shift" | "on-call";

export interface AllowanceKindInfo {
  id: AllowanceKind;
  title: string;
  /** What this allowance is for, in the FWO's terms. */
  blurb: string;
  test: RegExp;
}

export const ALLOWANCE_KINDS: readonly AllowanceKindInfo[] = [
  {
    id: "first-aid",
    title: "First aid allowance",
    blurb: "Paid when you hold a current first aid qualification and are appointed to perform first aid duty.",
    test: /first aid/i,
  },
  {
    id: "laundry-uniform",
    title: "Laundry and uniform allowances",
    blurb: "Paid when you must launder a required uniform or special clothing, or where the employer pays an allowance instead of supplying uniforms.",
    test: /laundry|uniform/i,
  },
  {
    id: "tool",
    title: "Tool allowance",
    blurb: "Paid when the employer requires you to provide and use your own tools or equipment.",
    test: /\btool/i,
  },
  {
    id: "split-shift",
    title: "Split shift and broken shift allowances",
    blurb: "Paid when your shift is split into two or more periods with an unpaid break between them.",
    test: /split shift|broken shift/i,
  },
  {
    id: "on-call",
    title: "On-call and sleepover allowances",
    blurb: "Paid for being available to be called in outside your rostered hours, or for sleeping at the workplace.",
    test: /on-call|sleepover/i,
  },
] as const;

export interface AllowanceRow {
  kind: AllowanceKind;
  allowance: string;
  /** As the award states it, e.g. "$13.43 per week". */
  amount: string;
  note: string;
  awardName: string;
  awardCode: string;
  consolidatedTo: string;
  /** Occupation pages that carry this row, for the "see rates" links. */
  occupations: { slug: string; name: string }[];
}

/** True when the amount is a figure the award prints (a dollar amount or a percentage), not "agreed in writing". */
export function isPrintedAmount(amount: string): boolean {
  return /\$\s?\d|\d\s?%/.test(amount);
}

/** Every allowance of a kind, merged across occupations that share an award and an identical row. */
export function allowanceRows(kind: AllowanceKind): AllowanceRow[] {
  const info = ALLOWANCE_KINDS.find((k) => k.id === kind);
  if (!info) return [];
  const merged = new Map<string, AllowanceRow>();
  for (const occ of OCCUPATIONS) {
    if (!occ.award) continue;
    for (const a of occ.allowances) {
      if (!info.test.test(a.name) || !isPrintedAmount(a.amount)) continue;
      const key = `${occ.award.code}|${a.name}|${a.amount}`;
      const existing = merged.get(key);
      if (existing) {
        existing.occupations.push({ slug: occ.slug, name: occ.name });
      } else {
        merged.set(key, {
          kind,
          allowance: a.name,
          amount: a.amount,
          note: a.note,
          awardName: occ.award.name,
          awardCode: occ.award.code,
          consolidatedTo: occ.award.consolidatedTo,
          occupations: [{ slug: occ.slug, name: occ.name }],
        });
      }
    }
  }
  return [...merged.values()].sort((x, y) => x.awardName.localeCompare(y.awardName) || x.allowance.localeCompare(y.allowance));
}

/** Total rows across every kind, for the page lead and tests. */
export function allowanceRowCount(): number {
  return ALLOWANCE_KINDS.reduce((n, k) => n + allowanceRows(k.id).length, 0);
}

// =============================================================================
// Salary package ↔ base salary.
//
// Job ads quote pay three ways — "$112,000 package", "$100,000 plus super",
// "$100,000 including super" — and the GSC export to 27 Aug 2026 shows 281
// distinct queries asking which is which ("how to calculate base salary from
// package including super", "75k including super", "whats 90 plus super").
// This is the single place that arithmetic lives.
//
// Two rules:
//   1. Rounding matches calculatePayBreakdown's superIncluded path (whole
//      dollars, base = round(total / (1 + rate))), so the calculator and the
//      main engine never disagree on the split.
//   2. SG stops growing at the maximum contribution base
//      (SUPER_GUARANTEE.maxContributionBaseAnnual, annual under Payday Super
//      from 1 July 2026). Above it, a package splits as total − maxSGAnnual.
// =============================================================================

import { SUPER_GUARANTEE } from "./australian-tax";

export interface PackageSplit {
  /** Base salary — the figure tax is worked out on. */
  base: number;
  /** Employer superannuation guarantee on that base. */
  superAmount: number;
  /** Base + super: the "package" or "total remuneration" figure. */
  total: number;
  /** SG rate used. */
  sgRate: number;
  /** True when the maximum contribution base limited the super amount. */
  capApplied: boolean;
}

const RATE = SUPER_GUARANTEE.rate;
const CAP_BASE = SUPER_GUARANTEE.maxContributionBaseAnnual;
const CAP_SG = SUPER_GUARANTEE.maxSGAnnual;
const ZERO: PackageSplit = { base: 0, superAmount: 0, total: 0, sgRate: RATE, capApplied: false };

/** "$X package" / "$X including super" → base salary and the super inside it. */
export function splitPackage(total: number): PackageSplit {
  if (!Number.isFinite(total) || total <= 0) return ZERO;
  // If the base implied by ÷(1+rate) would exceed the contribution base, SG is
  // fixed at the cap and everything else is base.
  const capPackage = CAP_BASE + CAP_SG;
  if (total > capPackage) {
    return { base: total - CAP_SG, superAmount: CAP_SG, total, sgRate: RATE, capApplied: true };
  }
  const base = Math.round(total / (1 + RATE));
  return { base, superAmount: total - base, total, sgRate: RATE, capApplied: false };
}

/** "$X plus super" / base salary → the package it adds up to. */
export function packageFromBase(base: number): PackageSplit {
  if (!Number.isFinite(base) || base <= 0) return ZERO;
  const rawSG = Math.round(base * RATE);
  const capApplied = base > CAP_BASE;
  const superAmount = capApplied ? CAP_SG : rawSG;
  return { base, superAmount, total: base + superAmount, sgRate: RATE, capApplied };
}

// Reverse (net → gross) salary search. Lives outside the "use client" gross-pay
// module so the server page can compute its answer-first title and description
// with the same function the calculator runs (a client module's exports reach
// a server component as client references, not values).

import { calculatePayBreakdown } from "@/lib/constants/australian-tax";

/** Gross annual salary whose take-home pay (no HECS) equals `annualTargetNet`. */
export function findGrossForNet(annualTargetNet: number): number {
  if (annualTargetNet <= 0) return 0;
  let min = annualTargetNet;
  let max = annualTargetNet * 3; // Safe upper bound
  let mid = min;
  // Binary search to find the gross salary that results in the target net
  for (let i = 0; i < 50; i++) {
    mid = (min + max) / 2;
    const breakdown = calculatePayBreakdown({ grossSalary: mid });
    if (breakdown.takeHomePay < annualTargetNet) {
      min = mid;
    } else {
      max = mid;
    }
  }
  return mid;
}

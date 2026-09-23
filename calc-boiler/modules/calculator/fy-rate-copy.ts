// =============================================================================
// Rate sentences for calculator body copy, built from the constants.
//
// The pay-frequency, gross-pay and pay-rise pages hand-typed bracket and
// HECS-HELP rates into prose. After the 1 July 2026 rollover that copy still
// read "FY2025-26 … 16% from $18,201" and mixed the 2026-27 HECS threshold
// with 2025-26 band edges ($125,000 / $179,285). Deriving the sentences here
// means they roll over with lib/constants/australian-tax.ts.
// =============================================================================

import { formatAUD, HECS_HELP, TAX_BRACKETS } from "@/lib/constants/australian-tax";

const pct = (rate: number) => `${Math.round(rate * 1000) / 10}%`;

/**
 * "0% on the first $18,200, 15% from $18,201 to $45,000, … and 45% above
 * $190,000" — resident rates for the current financial year.
 */
export function bracketRatesSentence(): string {
  const parts = TAX_BRACKETS.map((b, i) => {
    if (i === 0) return `${pct(b.rate)} on the first ${formatAUD(b.max)}`;
    if (b.max === Infinity) return `${pct(b.rate)} above ${formatAUD(b.min - 1)}`;
    return `${pct(b.rate)} from ${formatAUD(b.min)} to ${formatAUD(b.max)}`;
  });
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

/** The marginal rates alone, e.g. "0%, 15%, 30%, 37% and 45%". */
export function bracketRateList(): string {
  const rates = TAX_BRACKETS.map((b) => pct(b.rate));
  return `${rates.slice(0, -1).join(", ")} and ${rates[rates.length - 1]}`;
}

/** Second (first taxed) bracket, for "the 15% bracket applies up to $45,000". */
export const FIRST_TAXED_BRACKET = TAX_BRACKETS[1];

/**
 * "15c per $1 over $69,528 up to $129,717; $9,028 + 17c per $1 over $129,717
 * up to $186,050; and 10% of total repayment income above $186,050".
 */
export function hecsBandsSentence(): string {
  const parts = HECS_HELP.bands
    .filter((b) => b.marginalRate > 0)
    .map((b) =>
      b.max === Infinity ? `${b.label} above ${formatAUD(b.min - 1)}` : `${b.label} up to ${formatAUD(b.max)}`,
    );
  return `${parts.slice(0, -1).join("; ")}; and ${parts[parts.length - 1]}`;
}

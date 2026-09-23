// =============================================================================
// Money text-field parser.
//
// Replaces the old `Number(v.replace(/[^0-9.]/g, ""))` pattern, which silently
// turned "1.5e6" into 1.56 and "-500000" into 500,000. This parser accepts what
// people actually paste ("$1,500,000", "1 500 000", "AUD 2,000,000.50") and
// flags everything else so the field can show an inline error instead of
// computing on a number the user did not type.
// =============================================================================

import { formatAUD } from "./constants/australian-tax";

export type MoneyInputError = "negative" | "scientific" | "invalid" | "too-large";

export interface ParsedMoney {
  /** The amount, or 0 when the field is empty or has an error. */
  value: number;
  /** True when the field is blank (not an error). */
  empty: boolean;
  error: MoneyInputError | null;
  /** Inline message for the field, or null. */
  message: string | null;
}

export interface MoneyInputOptions {
  /** Largest accepted amount. Default $100 billion. */
  max?: number;
}

const DEFAULT_MAX = 1e11;

/** Grouped with commas every 3 digits, or plain digits; optional decimals. */
const GROUPED = /^\d{1,3}(,\d{3})+(\.\d*)?$/;
const PLAIN = /^(\d+\.?\d*|\.\d+)$/;

function fail(error: MoneyInputError, message: string): ParsedMoney {
  return { value: 0, empty: false, error, message };
}

export function parseMoneyInput(raw: string, options: MoneyInputOptions = {}): ParsedMoney {
  const max = options.max ?? DEFAULT_MAX;
  // Drop all whitespace (spaces, NBSP, thin spaces used as thousands separators).
  let s = String(raw ?? "").replace(/[\s   ]+/g, "");
  if (s === "") return { value: 0, empty: true, error: null, message: null };

  // Currency markers: "$", "A$", "AU$", "AUD" at either end.
  s = s.replace(/^(aud|au\$|a\$|\$)/i, "").replace(/(aud)$/i, "");
  // A sign may sit before the "$" ("-$500") — strip "$" after a sign too.
  s = s.replace(/^([-−–+])(aud|au\$|a\$|\$)/i, "$1");

  if (/^[-−–]/.test(s) || /^\(.*\)$/.test(s)) {
    return fail("negative", "Enter an amount of $0 or more, without a minus sign.");
  }
  if (/^[+]?(\d[\d,]*\.?\d*|\.\d+)e[+-]?\d+$/i.test(s)) {
    return fail("scientific", "Type the full number (for example 1,500,000), not scientific notation like 1.5e6.");
  }
  if (s.startsWith("+")) s = s.slice(1);

  if (!GROUPED.test(s) && !PLAIN.test(s)) {
    return fail("invalid", "Enter a dollar amount using digits, for example 1,500,000.");
  }

  const value = Number(s.replace(/,/g, ""));
  if (!Number.isFinite(value)) {
    return fail("invalid", "Enter a dollar amount using digits, for example 1,500,000.");
  }
  if (value > max) {
    return fail("too-large", `Enter an amount up to ${formatAUD(max)}.`);
  }
  return { value, empty: false, error: null, message: null };
}

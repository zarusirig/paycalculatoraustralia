// Public holiday pay arithmetic. Pure and tested; the calculator component and
// the worked examples on every page call this, so the numbers cannot differ.

export type PhEmployment = "permanent" | "casual";

export interface PhPayInput {
  /** The permanent (non-casual) minimum or base hourly rate, before any loading. */
  baseHourly: number;
  hours: number;
  employment: PhEmployment;
  /** Public holiday rate as a multiple of baseHourly, permanent employees. */
  permanentMultiple: number;
  /** Public holiday rate as a multiple of baseHourly, casual loading included. */
  casualMultiple: number;
  /** Casual loading, 0.25 under every award on this site. */
  casualLoading?: number;
}

export interface PhPayResult {
  multiple: number;
  holidayHourly: number;
  holidayPay: number;
  /** The same hours on an ordinary weekday (casuals: base + loading). */
  ordinaryHourly: number;
  ordinaryPay: number;
  extra: number;
  /** Pay for NOT working the day: NES base rate for ordinary hours (permanent only). */
  dayOffPay: number;
}

const cents = (n: number) => Math.round(n * 100) / 100;

export function publicHolidayPay(input: PhPayInput): PhPayResult {
  const loading = input.casualLoading ?? 0.25;
  const hourly = Math.max(0, input.baseHourly);
  const hours = Math.max(0, input.hours);
  const casual = input.employment === "casual";
  const multiple = casual ? input.casualMultiple : input.permanentMultiple;
  const holidayHourly = cents(hourly * multiple);
  const ordinaryHourly = cents(casual ? hourly * (1 + loading) : hourly);
  const holidayPay = cents(holidayHourly * hours);
  const ordinaryPay = cents(ordinaryHourly * hours);
  return {
    multiple,
    holidayHourly,
    holidayPay,
    ordinaryHourly,
    ordinaryPay,
    extra: cents(holidayPay - ordinaryPay),
    // Fair Work Act s 116: base pay rate for ordinary hours. Casuals: nothing.
    dayOffPay: casual ? 0 : cents(hourly * hours),
  };
}

/** "225%" / "312.5%". */
export function pctLabel(multiple: number): string {
  const v = Math.round(multiple * 1000) / 10;
  return `${Number.isInteger(v) ? v.toFixed(0) : v}%`;
}

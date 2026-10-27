// =============================================================================
// On-demand delivery worker minimum pay: the Fair Work Commission's Interim
// On-Demand Delivery Employee-like Worker Minimum Standards Order [MS900103]
// (the first Minimum Standards Order), in force from 17 August 2026.
//
// SOURCES (all read 5 October 2026 via Firecrawl):
//   - FWC order, made 11 August 2026 (MS2024/3, decision [2026] FWCFB 211):
//     https://www.fwc.gov.au/documents/sites/ms2024-1/ms2024-3-order-mso-11-08-2026.pdf
//       cl 1.2   commences 17 August 2026
//       cl 2     coverage (employee-like workers on a digital labour platform whose
//                services, across an earnings period, predominantly involve collecting
//                and delivering consumables or grocery items ordered through an app,
//                to be delivered immediately or as soon as practicable; NOT vehicles
//                with a carrying capacity over 1 tonne)
//       cl 3.1(h) engaged time; cl 3.1(n) non-engaged time
//       cl 4     vehicle, running costs, licences are the worker's own expense
//       cl 7.4   the platform must give hours and amounts paid at the end of each period
//       cl 11    right to time away (unpaid)
//       cl 14.1  safety net: "paid no less overall than the earnings floor over any
//                earnings period ... up to 21 days"; floor = hours of engaged time
//                (pro rata for part hours to the nearest minute) x hourly rate; a
//                top-up is paid in the next period or within 7 days after it
//       cl 14.2  rates (below); cl 14.4 non-engaged time notices; cl 14.7 indexation
//                from 1 January 2028 by the NMW annual wage review increase
//   - Fair Work Ombudsman media release, 17 August 2026:
//     https://www.fairwork.gov.au/newsroom/media-releases/2026-media-releases/august-2026/20260817-minimum-standards-for-delivery-drivers-media-release
//   - Fair Work Ombudsman, "New minimum standards for on-demand delivery work":
//     https://www.fairwork.gov.au/about-us/workplace-laws/fair-work-commission-orders/minimum-standards-order-on-demand-delivery-workers
//
// The rate is BEFORE the worker's expenses: cl 4.1-4.4 make registration, repairs,
// fuel, insurance, licences and purchase or lease costs the worker's own expense,
// and cl 8.1 makes fines the worker's (unless the platform directed the action).
// Whether tips count towards "paid" is not stated in the order text we read, so
// the calculator takes "amount the platform paid you" as one figure and the page
// tells readers to check their earnings statement.
// =============================================================================

import { CENTS_PER_KM_RATES, CURRENT_CPK_YEAR } from "./cents-per-km";

export const DELIVERY_MSO_VERIFIED_ON = "5 October 2026";

export const DELIVERY_MSO = {
  name: "Interim On-Demand Delivery Employee-like Worker Minimum Standards Order",
  reference: "MS900103 (application MS2024/3), decision [2026] FWCFB 211",
  made: "11 August 2026",
  commences: "17 August 2026",
  maxEarningsPeriodDays: 21,
  topUpDueDays: 7,
  nonEngagedRepeatNotices: 2,
  nonEngagedNoticeExpiryMonths: 6,
  nextIndexation: "1 January 2028",
  maxCarryingCapacityTonnes: 1,
} as const;

export const DELIVERY_MSO_SOURCES = {
  order: "https://www.fwc.gov.au/documents/sites/ms2024-1/ms2024-3-order-mso-11-08-2026.pdf",
  fwoRelease:
    "https://www.fairwork.gov.au/newsroom/media-releases/2026-media-releases/august-2026/20260817-minimum-standards-for-delivery-drivers-media-release",
  fwoGuidance:
    "https://www.fairwork.gov.au/about-us/workplace-laws/fair-work-commission-orders/minimum-standards-order-on-demand-delivery-workers",
  decision: "https://www.fwc.gov.au/documents/sites/ms2024-1/2026fwcfb211.pdf",
  majorCase: "https://www.fwc.gov.au/hearings-decisions/major-cases/minimum-standards-orders-ms20241-ms20242-ms20243",
} as const;

export type DeliveryVehicle = "bicycle-or-none" | "ebike-or-escooter" | "motorcycle-or-scooter" | "car-or-van";

export interface DeliveryVehicleClass {
  id: DeliveryVehicle;
  /** The order's own class-of-vehicle wording (cl 14.2, column 1). */
  label: string;
  short: string;
}

export const DELIVERY_VEHICLES: readonly DeliveryVehicleClass[] = [
  { id: "bicycle-or-none", label: "No vehicle or bicycle (pedal powered)", short: "Walking or pedal bike" },
  { id: "ebike-or-escooter", label: "Electric bicycle or scooter", short: "E-bike or e-scooter" },
  { id: "motorcycle-or-scooter", label: "Combustion motorcycle or scooter", short: "Motorcycle or petrol scooter" },
  { id: "car-or-van", label: "Motor vehicle (electric or combustion) up to 1 tonne carrying capacity", short: "Car or small van" },
];

export type DeliveryRatePeriodId = "2026" | "2027";

export interface DeliveryRatePeriod {
  id: DeliveryRatePeriodId;
  label: string;
  from: string;
  to: string;
  clause: string;
  /** Minimum hourly rate of engaged time, dollars, by vehicle class. */
  rates: Readonly<Record<DeliveryVehicle, number>>;
}

export const DELIVERY_RATE_PERIODS: readonly DeliveryRatePeriod[] = [
  {
    id: "2026",
    label: "17 August to 31 December 2026",
    from: "17 August 2026",
    to: "31 December 2026",
    clause: "cl 14.2(a)",
    rates: {
      "bicycle-or-none": 31.3,
      "ebike-or-escooter": 31.3,
      "motorcycle-or-scooter": 31.5,
      "car-or-van": 32.0,
    },
  },
  {
    id: "2027",
    label: "1 January to 31 December 2027",
    from: "1 January 2027",
    to: "31 December 2027",
    clause: "cl 14.2(b)",
    rates: {
      "bicycle-or-none": 31.8,
      "ebike-or-escooter": 31.8,
      "motorcycle-or-scooter": 32.0,
      "car-or-van": 32.5,
    },
  },
];

export function deliveryRate(vehicle: DeliveryVehicle, period: DeliveryRatePeriodId = "2026"): number {
  const p = DELIVERY_RATE_PERIODS.find((r) => r.id === period);
  if (!p) throw new Error(`Unknown delivery rate period ${period}`);
  return p.rates[vehicle];
}

const cents = (n: number) => Math.round(n * 100) / 100;

/** Engaged time in whole minutes (the order counts part hours to the nearest minute). */
export function engagedMinutes(hours: number, minutes: number): number {
  return Math.max(0, Math.round(Math.max(0, hours) * 60 + Math.max(0, minutes)));
}

/** Earnings floor for an earnings period: engaged hours (to the nearest minute) x hourly rate (cl 14.1(a)). */
export function earningsFloor(totalEngagedMinutes: number, hourlyRate: number): number {
  return cents((Math.max(0, Math.round(totalEngagedMinutes)) / 60) * hourlyRate);
}

export interface DeliveryFloorInput {
  vehicle: DeliveryVehicle;
  period?: DeliveryRatePeriodId;
  engagedMinutes: number;
  /** Total the platform paid you for the earnings period, dollars. */
  paid: number;
  /** Kilometres ridden or driven while delivering in the period (for the cost estimate). */
  km?: number;
  /** Cost per km for your vehicle; defaults to the ATO cents-per-km rate (a rough placeholder). */
  costPerKm?: number;
  /** Other costs for the period: phone data, insulated bag, parking, etc. */
  otherCosts?: number;
}

export interface DeliveryFloorResult {
  rate: number;
  floor: number;
  /** What the platform owes on top of what it paid, if anything. */
  topUp: number;
  belowFloor: boolean;
  /** Payout divided by engaged hours (before expenses). */
  effectiveHourly: number;
  /** Greater of paid and floor. */
  entitledTotal: number;
  vehicleCost: number;
  otherCosts: number;
  expenses: number;
  /** Entitled total less expenses: your profit for the period before tax. */
  profitBeforeTax: number;
  profitPerEngagedHour: number;
}

/** Default vehicle running cost per km: the ATO's cents-per-km rate for the current income year. */
export const DEFAULT_COST_PER_KM = CENTS_PER_KM_RATES[CURRENT_CPK_YEAR];

export function deliveryFloor(input: DeliveryFloorInput): DeliveryFloorResult {
  const rate = deliveryRate(input.vehicle, input.period ?? "2026");
  const mins = Math.max(0, Math.round(input.engagedMinutes));
  const hours = mins / 60;
  const floor = earningsFloor(mins, rate);
  const paid = Math.max(0, input.paid);
  const topUp = cents(Math.max(0, floor - paid));
  const entitledTotal = cents(Math.max(paid, floor));
  const vehicleCost = cents(Math.max(0, input.km ?? 0) * (input.costPerKm ?? DEFAULT_COST_PER_KM));
  const otherCosts = cents(Math.max(0, input.otherCosts ?? 0));
  const expenses = cents(vehicleCost + otherCosts);
  const profitBeforeTax = cents(entitledTotal - expenses);
  return {
    rate,
    floor,
    topUp,
    belowFloor: topUp > 0,
    effectiveHourly: hours > 0 ? cents(paid / hours) : 0,
    entitledTotal,
    vehicleCost,
    otherCosts,
    expenses,
    profitBeforeTax,
    profitPerEngagedHour: hours > 0 ? cents(profitBeforeTax / hours) : 0,
  };
}

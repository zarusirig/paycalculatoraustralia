// =============================================================================
// Train driver pay (J6, wave 4): /train-driver-salary/.
//
// Train drivers are paid under each operator's enterprise agreement, not an
// award, so this page publishes only agreements whose current table was read
// directly on 24 September 2026:
//
//   - Sydney Trains and NSW TrainLink Enterprise Agreement 2025 (AE529763),
//     Schedule 4A weekly rates, 1 July 2026 column (FWC agreement PDF).
//   - Metro Trains Melbourne Rail Operations Enterprise Agreement 2023,
//     Schedule B, Train Driver, July 2026 column (the RTBU's copy of the
//     approved agreement, which includes the FWC approval decision).
//
// NOT published (not verifiable as current): Queensland Rail (driver agreement
// still being negotiated in July 2026), Yarra Trams (the table could not be
// read unambiguously), NSW TrainLink regional drivers (Schedule 6A not read),
// and freight operators.
//
// Sydney Trains publishes weekly rates; the annual figure is weekly × 52 and is
// labelled as derived. Metro Trains publishes hourly and annual (hourly × 1,976,
// i.e. 38 hours × 52), used as printed.
// =============================================================================

import type { PayFaq, PaySource } from "../public-service-pay/types";
import { formatSalary } from "../public-service-pay/types";

export const TRAIN_DRIVER_VERIFIED_ON = "24 September 2026";

export interface DriverRow {
  label: string;
  weekly?: number;
  /** Weekly including the industry allowance, where the agreement shows it. */
  weeklyWithAllowance?: number;
  hourly?: number;
  annual: number;
  note?: string;
}

export interface DriverTable {
  id: string;
  operator: string;
  state: "NSW" | "VIC";
  agreement: string;
  effectiveFrom: string;
  annualBasis: "published" | "derived";
  caption: string;
  rows: readonly DriverRow[];
  payRises: string;
  expiry: string;
  source: PaySource;
}

const wk = (label: string, weekly: number, withIa: number, note?: string): DriverRow => ({
  label,
  weekly,
  weeklyWithAllowance: withIa,
  annual: Math.round(weekly * 52),
  ...(note ? { note } : {}),
});

export const SYDNEY_TRAINS: DriverTable = {
  id: "sydney-trains",
  operator: "Sydney Trains and NSW TrainLink",
  state: "NSW",
  agreement: "Sydney Trains and NSW TrainLink Enterprise Agreement 2025",
  effectiveFrom: "the first pay period on or after 1 July 2026",
  annualBasis: "derived",
  caption: "Schedule 4A, weekly rates from the first pay period on or after 1 July 2026. Annual = weekly rate without the industry allowance × 52, our figure; the agreement publishes weekly rates.",
  rows: [
    wk("Driver, 1st year trainee", 1_699.05, 1_797.30),
    wk("Driver, 1st year competent", 1_734.80, 1_833.05),
    wk("Driver, 2nd year", 1_818.70, 1_916.95),
    wk("Driver, thereafter", 1_861.35, 1_959.60, "The rate for an experienced driver"),
    wk("Driver Trainer", 2_082.20, 2_180.45),
    wk("Principal Driver (including Intercity)", 2_157.05, 2_255.30),
  ],
  payRises: "Four cumulative 4% increases, from the first pay period on or after 1 May 2024, 1 July 2025, 1 July 2026 and 1 July 2027 (cl 11.1). From 1 July 2027 a driver (thereafter) moves to $1,935.80 a week, or $2,038.00 with the industry allowance.",
  expiry: "Operates from 7 August 2025; nominal expiry 1 July 2028.",
  source: {
    id: "sydney-trains-ea",
    title: "Sydney Trains and NSW TrainLink Enterprise Agreement 2025 (AE529763) — Schedule 4A",
    publisher: "Fair Work Commission",
    url: "https://www.fwc.gov.au/documents/agreements/fwa/ae529763.pdf",
    effectiveFrom: "1 July 2026",
    verifiedOn: TRAIN_DRIVER_VERIFIED_ON,
    note: "Approved 31 July 2025 ([2025] FWCA 2397). Clause 11.1 and Schedule 4A.",
  },
};

export const METRO_TRAINS: DriverTable = {
  id: "metro-trains",
  operator: "Metro Trains Melbourne",
  state: "VIC",
  agreement: "Metro Trains Melbourne Rail Operations Enterprise Agreement 2023",
  effectiveFrom: "the first full pay period on or after 1 July 2026",
  annualBasis: "published",
  caption: "Schedule B, Train Driver, July 2026 column: hourly and annual rates as printed (annual = hourly × 1,976, i.e. 38 hours × 52).",
  rows: [
    { label: "Trainee Driver", hourly: 39.9192, annual: 78_880 },
    { label: "Qualified Driver Level 1", hourly: 46.5975, annual: 92_077 },
    { label: "Qualified Driver (SPOT)", hourly: 68.6521, annual: 135_657, note: "After 6 months as a qualified driver, subject to assessment" },
    { label: "Principal Driver (TSO, reference rate)", hourly: 84.6967, annual: 167_361 },
  ],
  payRises: "Increases of 1.75% from the first full pay period on or after 1 July 2026 and again from 1 January 2027 (cl 1.7.1). From January 2027 a trainee driver is paid $80,261, a Qualified Driver Level 1 $93,688 and a Qualified Driver (SPOT) $138,031.",
  expiry: "Operates from 6 March 2024; nominal expiry 30 June 2027.",
  source: {
    id: "metro-trains-ea",
    title: "Metro Trains Melbourne Rail Operations Enterprise Agreement 2023 — Schedule B",
    publisher: "Rail, Tram and Bus Union (Victorian Locomotive Division), copy of the approved agreement",
    url: "https://www.rtbuvicloco.com.au/wp-content/uploads/2024/03/Metro-Trains-EA-2023.pdf",
    effectiveFrom: "July 2026",
    verifiedOn: TRAIN_DRIVER_VERIFIED_ON,
    note: "Approved by the Fair Work Commission on 28 February 2024. Clause 1.7.1 and Schedule B.",
  },
};

export const DRIVER_TABLES: readonly DriverTable[] = [SYDNEY_TRAINS, METRO_TRAINS];

export const NOT_COVERED: readonly string[] = [
  "Queensland Rail: the agreement that covers train drivers was still being negotiated in July 2026, so there is no current table to publish.",
  "Yarra Trams (Melbourne tram drivers): the agreement runs to 30 June 2027, but we could not read its rate table unambiguously, so we have not published it.",
  "NSW TrainLink regional drivers, Transperth, Adelaide Metro and freight operators: not yet checked.",
];

const syd = SYDNEY_TRAINS.rows[3];
const mel = METRO_TRAINS.rows[1];
const spot = METRO_TRAINS.rows[2];

export const TRAIN_DRIVER_FAQS: readonly PayFaq[] = [
  {
    q: "How much does a train driver earn in Australia?",
    a: `It depends on the operator's enterprise agreement. A Sydney Trains driver (thereafter) is paid $${syd.weekly!.toFixed(2)} a week from 1 July 2026, about ${formatSalary(syd.annual)} a year, or $${syd.weeklyWithAllowance!.toFixed(2)} a week with the industry allowance. A Metro Trains Melbourne Qualified Driver Level 1 is paid ${formatSalary(mel.annual)} a year, and ${formatSalary(spot.annual)} at the Qualified Driver (SPOT) rate after 6 months, subject to assessment.`,
  },
  {
    q: "How much does a Sydney Trains driver earn?",
    a: "From the first pay period on or after 1 July 2026, the Sydney Trains and NSW TrainLink Enterprise Agreement 2025 pays a first-year trainee driver $1,699.05 a week, a driver (thereafter) $1,861.35 and a Principal Driver $2,157.05, before the industry allowance. With the allowance the driver (thereafter) rate is $1,959.60 a week.",
  },
  {
    q: "How much do trainee train drivers get paid?",
    a: "A first-year trainee driver at Sydney Trains is paid $1,699.05 a week from 1 July 2026 ($1,797.30 with the industry allowance). A Metro Trains Melbourne trainee driver is paid $39.9192 an hour, $78,880 a year, from July 2026.",
  },
  {
    q: "When do train drivers get a pay rise?",
    a: "Sydney Trains drivers get 4% from the first pay period on or after 1 July 2027 under the 2025 agreement. Metro Trains Melbourne drivers get 1.75% from July 2026 and another 1.75% from January 2027, the last increase before the agreement's nominal expiry on 30 June 2027.",
  },
];

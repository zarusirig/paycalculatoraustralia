// =============================================================================
// Travel allowance — ATO reasonable amounts for 2026-27 (TD 2026/4) and the
// PAYG withholding treatment of travel and overtime meal allowances.
//
// SOURCE: Taxation Determination TD 2026/4, "Income tax: reasonable travel and
// overtime meal allowance expense amounts for the 2026-27 income year",
// Commissioner of Taxation, 24 June 2026. Applies to the 2026-27 income year
// only (para 52). Read on 23 September 2026 from the ATO legal database
// (HTML) AND the authorised PDF; the high-cost centre and country tables below
// were parsed from both and compared entry by entry (117 centres, 140
// countries, identical). The previous year's figures are TD 2025/4.
//   https://www.ato.gov.au/law/view/document?docid=TXD/TD20264/NAT/ATO/00001
//
// WHAT A "REASONABLE AMOUNT" IS. It is NOT a rate employers must pay, and not
// an automatic deduction. It is the ceiling below which an employee who
// received an allowance and spent the money does not need written evidence
// (substantiation exception, ITAA 1997 ss 900-50, 900-55, 900-60). Claims
// above it must be fully substantiated — "not just the amount over" (para 5).
//
// Salary bands (salary EXCLUDES allowances; part-timers annualise to a
// full-time equivalent, para 18): Table 1 ≤ $153,210; Table 2 $153,211 to
// $272,680; Table 3 ≥ $272,681.
//
// Accommodation amounts apply only to commercial establishments (hotel,
// motel, serviced apartment) — not hostels or caravan parks (para 21). Meal
// amounts apply only to meals within the travel period (para 22). Incidentals
// apply in full to each day, including part days (para 23). Overseas
// accommodation has NO reasonable amount and must always be substantiated
// (para 42). Unlisted countries use cost group 3 (para 44); two countries in
// a day use the higher group (para 45).
//
// WITHHOLDING (ato.gov.au "Travel allowances", QC18645; "Withholding for
// allowances", QC51680, last updated 26 August 2026 — read 23 Sep 2026):
// the employer does not withhold from a travel allowance, and leaves it off the
// income statement allowance box, if ALL FOUR hold: the employee is expected
// to spend all of it on accommodation, food, drink or incidentals; the amount
// and nature are shown separately in the employer's records; it is not for
// overseas accommodation; and it is no more than the reasonable amount. If the
// first two hold but it exceeds the reasonable amount, withhold from the
// EXCESS and report the whole allowance. Overseas accommodation allowances are
// always withheld from. Award overtime meal allowances up to the $40
// reasonable amount are not withheld from or reported.
// =============================================================================

export const TD_2026_4 = {
  id: "TD 2026/4",
  incomeYear: "2026-27",
  issued: "24 June 2026",
  url: "https://www.ato.gov.au/law/view/document?docid=TXD/TD20264/NAT/ATO/00001",
  pdfUrl: "https://www.ato.gov.au/law/view/pdf/pbr/td2026-004.pdf",
  previous: { id: "TD 2025/4", url: "https://www.ato.gov.au/law/view/document?docid=TXD/TD20254/NAT/ATO/00001" },
  verifiedOn: "23 September 2026",
} as const;

export const TRAVEL_SOURCES = {
  atoTravelAllowances:
    "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/payg-withholding/payments-you-need-to-withhold-from/payments-to-employees/allowances-and-reimbursements/travel-allowances",
  atoWithholdingForAllowances:
    "https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/payg-withholding/payments-you-need-to-withhold-from/payments-to-employees/allowances-and-reimbursements/withholding-for-allowances",
} as const;

/** Para 9: reasonable amount for an overtime meal in 2026-27. */
export const OVERTIME_MEAL_REASONABLE = 40;

export type SalaryBand = 1 | 2 | 3;

export const SALARY_BANDS: Readonly<Record<SalaryBand, { label: string; max: number | null }>> = {
  1: { label: "$153,210 or less", max: 153_210 },
  2: { label: "$153,211 to $272,680", max: 272_680 },
  3: { label: "$272,681 or more", max: null },
};

/** Table for a salary (allowances excluded; annualise part-time first). */
export function salaryBand(salary: number): SalaryBand {
  if (salary <= SALARY_BANDS[1].max!) return 1;
  if (salary <= SALARY_BANDS[2].max!) return 2;
  return 3;
}

export interface Meals {
  breakfast: number;
  lunch: number;
  dinner: number;
}

export const CAPITAL_CITIES = ["Adelaide", "Brisbane", "Canberra", "Darwin", "Hobart", "Melbourne", "Perth", "Sydney"] as const;
export type CapitalCity = (typeof CAPITAL_CITIES)[number];

interface DomesticTable {
  accommodation: Readonly<Record<CapitalCity, number>>;
  /** Meals in capital cities and high-cost country centres. */
  meals: Meals;
  incidentals: number;
  /** "Other country centres" (Tables 1-2); null in Table 3, where every country centre shares one row. */
  otherCountry: { accommodation: number; meals: Meals } | null;
  /** Table 3 only: accommodation for any country centre, or the Table 4 figure if higher. */
  allCountryAccommodationFloor: number | null;
}

// Tables 1-3, TD 2026/4 para 24.
export const DOMESTIC_TABLES: Readonly<Record<SalaryBand, DomesticTable>> = {
  1: {
    accommodation: { Adelaide: 158, Brisbane: 188, Canberra: 178, Darwin: 220, Hobart: 176, Melbourne: 175, Perth: 180, Sydney: 230 },
    meals: { breakfast: 36.0, lunch: 40.45, dinner: 69.0 },
    incidentals: 25.4,
    otherCountry: { accommodation: 141, meals: { breakfast: 32.25, lunch: 36.8, dinner: 63.45 } },
    allCountryAccommodationFloor: null,
  },
  2: {
    accommodation: { Adelaide: 211, Brisbane: 257, Canberra: 246, Darwin: 293, Hobart: 235, Melbourne: 233, Perth: 245, Sydney: 307 },
    meals: { breakfast: 39.2, lunch: 55.35, dinner: 77.65 },
    incidentals: 36.3,
    otherCountry: { accommodation: 188, meals: { breakfast: 36.0, lunch: 36.8, dinner: 71.45 } },
    allCountryAccommodationFloor: null,
  },
  3: {
    accommodation: { Adelaide: 211, Brisbane: 257, Canberra: 246, Darwin: 293, Hobart: 235, Melbourne: 265, Perth: 265, Sydney: 307 },
    meals: { breakfast: 43.65, lunch: 61.7, dinner: 86.35 },
    incidentals: 36.3,
    otherCountry: null,
    allCountryAccommodationFloor: 207,
  },
};

/** Published daily totals (Tables 1-3), used by the tests to check the parts add up. */
export const PUBLISHED_DAILY_TOTALS: Readonly<Record<SalaryBand, Readonly<Record<CapitalCity | "Other country centres", number | null>>>> = {
  1: { Adelaide: 328.85, Brisbane: 358.85, Canberra: 348.85, Darwin: 390.85, Hobart: 346.85, Melbourne: 345.85, Perth: 350.85, Sydney: 400.85, "Other country centres": 298.9 },
  2: { Adelaide: 419.5, Brisbane: 465.5, Canberra: 454.5, Darwin: 501.5, Hobart: 443.5, Melbourne: 441.5, Perth: 453.5, Sydney: 515.5, "Other country centres": 368.55 },
  3: { Adelaide: 439.0, Brisbane: 485.0, Canberra: 474.0, Darwin: 521.0, Hobart: 463.0, Melbourne: 493.0, Perth: 493.0, Sydney: 535.0, "Other country centres": null },
};

/** Table 5: employee truck drivers, meals only, any domestic destination. Separate per meal; cannot be aggregated (para 32). */
export const TRUCK_DRIVER_MEALS: Meals = { breakfast: 32.25, lunch: 36.8, dinner: 63.45 };

export type CostGroup = 1 | 2 | 3 | 4 | 5 | 6;

/** Tables 6-8: overseas meals and incidentals per day. Accommodation must be substantiated. */
export const OVERSEAS_TABLES: Readonly<Record<SalaryBand, Readonly<Record<CostGroup, { meals: number; incidentals: number }>>>> = {
  1: { 1: { meals: 75, incidentals: 25 }, 2: { meals: 110, incidentals: 30 }, 3: { meals: 150, incidentals: 35 }, 4: { meals: 195, incidentals: 35 }, 5: { meals: 235, incidentals: 40 }, 6: { meals: 280, incidentals: 45 } },
  2: { 1: { meals: 95, incidentals: 25 }, 2: { meals: 130, incidentals: 35 }, 3: { meals: 175, incidentals: 40 }, 4: { meals: 215, incidentals: 45 }, 5: { meals: 290, incidentals: 50 }, 6: { meals: 360, incidentals: 50 } },
  3: { 1: { meals: 120, incidentals: 30 }, 2: { meals: 180, incidentals: 40 }, 3: { meals: 230, incidentals: 45 }, 4: { meals: 290, incidentals: 50 }, 5: { meals: 365, incidentals: 60 }, 6: { meals: 415, incidentals: 60 } },
};

/** Para 44: countries not in Table 9 use cost group 3. */
export const UNLISTED_COUNTRY_COST_GROUP: CostGroup = 3;

/** Table 4: accommodation in high-cost country centres (Tables 1-2 meals and incidentals apply). */
export const HIGH_COST_CENTRES: Readonly<Record<string, number>> = {
  "Albany (WA)": 193,
  "Albury (NSW)": 207,
  "Alice Springs (NT)": 206,
  "Ararat (Vic)": 159,
  "Armidale (NSW)": 166,
  "Ayr (Qld)": 207,
  "Bairnsdale (Vic)": 182,
  "Ballarat (Vic)": 187,
  "Bathurst (NSW)": 207,
  "Bega (NSW)": 207,
  "Benalla (Vic)": 168,
  "Bendigo (Vic)": 177,
  "Bordertown (SA)": 165,
  "Bourke (NSW)": 189,
  "Bright (Vic)": 180,
  "Broken Hill (NSW)": 168,
  "Broome (WA)": 269,
  "Bunbury (WA)": 184,
  "Bundaberg (Qld)": 184,
  "Burnie (Tas)": 181,
  "Cairns (Qld)": 175,
  "Carnarvon (WA)": 183,
  "Castlemaine (Vic)": 162,
  "Ceduna (SA)": 156,
  "Charters Towers (Qld)": 168,
  "Chinchilla (Qld)": 207,
  "Christmas Island (WA)": 221,
  "Cobar (NSW)": 207,
  "Cocos (Keeling) Islands (WA)": 331,
  "Coffs Harbour (NSW)": 207,
  "Colac (Vic)": 207,
  "Cooma (NSW)": 207,
  "Cowra (NSW)": 207,
  "Dalby (Qld)": 201,
  "Dampier (WA)": 210,
  "Derby (WA)": 192,
  "Devonport (Tas)": 170,
  "Dubbo (NSW)": 173,
  "Echuca (Vic)": 207,
  "Emerald (Qld)": 182,
  "Esperance (WA)": 183,
  "Exmouth (WA)": 247,
  "Geelong (Vic)": 175,
  "Geraldton (WA)": 201,
  "Gladstone (Qld)": 171,
  "Gold Coast (Qld)": 234,
  "Gosford (NSW)": 161,
  "Goulburn (NSW)": 165,
  "Grafton (NSW)": 179,
  "Griffith (NSW)": 165,
  "Gunnedah (NSW)": 186,
  "Halls Creek (WA)": 215,
  "Hamilton (Vic)": 170,
  "Hervey Bay (Qld)": 175,
  "Horn Island (Qld)": 345,
  "Horsham (Vic)": 173,
  "Innisfail (Qld)": 207,
  "Inverell (NSW)": 207,
  "Jabiru (NT)": 216,
  "Kadina (SA)": 207,
  "Kalgoorlie (WA)": 193,
  "Karratha (WA)": 304,
  "Katherine (NT)": 230,
  "Kingaroy (Qld)": 180,
  "Kununurra (WA)": 234,
  "Launceston (Tas)": 174,
  "Lismore (NSW)": 190,
  "Mackay (Qld)": 166,
  "Maitland (NSW)": 187,
  "Maryborough (Qld)": 207,
  "Mildura (Vic)": 177,
  "Mount Gambier (SA)": 164,
  "Mount Isa (Qld)": 188,
  "Mudgee (NSW)": 213,
  "Muswellbrook (NSW)": 166,
  "Nambour (Qld)": 168,
  "Naracoorte (SA)": 207,
  "Narrabri (NSW)": 207,
  "Newcastle (NSW)": 195,
  "Newman (WA)": 277,
  "Nhulunbuy (NT)": 278,
  "Norfolk Island (Qld)": 256,
  "Northam (WA)": 232,
  "Nowra (NSW)": 168,
  "Orange (NSW)": 222,
  "Port Augusta (SA)": 207,
  "Port Hedland (WA)": 281,
  "Port Lincoln (SA)": 170,
  "Port Macquarie (NSW)": 190,
  "Port Pirie (SA)": 207,
  "Portland (Vic)": 170,
  "Queanbeyan (NSW)": 207,
  "Queenstown (Tas)": 207,
  "Renmark (SA)": 207,
  "Rockhampton (Qld)": 174,
  "Roma (Qld)": 188,
  "Sale (Vic)": 207,
  "Seymour (Vic)": 171,
  "Shepparton (Vic)": 172,
  "Swan Hill (Vic)": 181,
  "Tamworth (NSW)": 207,
  "Taree (NSW)": 207,
  "Tennant Creek (NT)": 207,
  "Thursday Island (Qld)": 323,
  "Toowoomba (Qld)": 161,
  "Townsville (Qld)": 174,
  "Tumut (NSW)": 207,
  "Wagga Wagga (NSW)": 178,
  "Wangaratta (Vic)": 186,
  "Warrnambool (Vic)": 182,
  "Weipa (Qld)": 238,
  "Whyalla (SA)": 170,
  "Wilpena-Pound (SA)": 281,
  "Wodonga (Vic)": 207,
  "Wollongong (NSW)": 188,
  "Wonthaggi (Vic)": 188,
  "Yulara (NT)": 570,
};

/** Table 9: overseas cost group by country. */
export const OVERSEAS_COST_GROUP: Readonly<Record<string, CostGroup>> = {
  "Albania": 3,
  "Algeria": 3,
  "Antigua and Barbuda": 6,
  "Argentina": 3,
  "Armenia": 3,
  "Austria": 5,
  "Azerbaijan": 3,
  "Bahamas": 6,
  "Bahrain": 6,
  "Bangladesh": 5,
  "Barbados": 6,
  "Belarus": 2,
  "Belgium": 5,
  "Bermuda": 6,
  "Bolivia": 3,
  "Bosnia": 2,
  "Brazil": 3,
  "Brunei": 3,
  "Bulgaria": 3,
  "Burkina Faso": 3,
  "Cambodia": 4,
  "Cameroon": 4,
  "Canada": 5,
  "Chile": 3,
  "China": 5,
  "Colombia": 3,
  "Cook Islands": 4,
  "Costa Rica": 4,
  "Cote d'Ivoire": 5,
  "Croatia": 3,
  "Cyprus": 4,
  "Czech Republic": 4,
  "Denmark": 6,
  "Dominican Republic": 4,
  "East Timor": 3,
  "Ecuador": 4,
  "Egypt": 2,
  "El Salvador": 4,
  "Eritrea": 3,
  "Estonia": 4,
  "Ethiopia": 2,
  "Fiji": 3,
  "Finland": 6,
  "France": 5,
  "French Polynesia": 6,
  "Gabon": 5,
  "Gambia": 2,
  "Georgia": 3,
  "Germany": 5,
  "Gibraltar": 4,
  "Greece": 4,
  "Guatemala": 4,
  "Guyana": 5,
  "Hong Kong": 6,
  "Hungary": 4,
  "Iceland": 6,
  "India": 3,
  "Indonesia": 3,
  "Iraq": 4,
  "Ireland": 6,
  "Israel": 6,
  "Italy": 5,
  "Jamaica": 4,
  "Japan": 5,
  "Jordan": 6,
  "Kazakhstan": 3,
  "Kenya": 4,
  "Korea Republic": 5,
  "Kosovo": 2,
  "Kuwait": 5,
  "Kyrgyzstan": 2,
  "Laos": 2,
  "Latvia": 4,
  "Lebanon": 4,
  "Lithuania": 4,
  "Luxembourg": 6,
  "Macau": 5,
  "Malaysia": 3,
  "Mali": 3,
  "Malta": 4,
  "Mauritius": 4,
  "Mexico": 4,
  "Monaco": 6,
  "Morocco": 3,
  "Mozambique": 3,
  "Myanmar": 2,
  "Namibia": 2,
  "Nepal": 2,
  "Netherlands": 5,
  "New Caledonia": 5,
  "New Zealand": 4,
  "Nicaragua": 3,
  "Nigeria": 4,
  "North Macedonia": 2,
  "Norway": 6,
  "Oman": 6,
  "Pakistan": 2,
  "Panama": 4,
  "Papua New Guinea": 4,
  "Paraguay": 2,
  "Peru": 3,
  "Philippines": 4,
  "Poland": 4,
  "Portugal": 4,
  "Puerto Rico": 6,
  "Qatar": 6,
  "Romania": 3,
  "Russia": 4,
  "Rwanda": 2,
  "Saint Lucia": 5,
  "Saint Vincent": 3,
  "Samoa": 4,
  "Saudi Arabia": 5,
  "Senegal": 5,
  "Serbia": 3,
  "Sierra Leone": 3,
  "Singapore": 6,
  "Slovakia": 4,
  "Slovenia": 4,
  "Solomon Islands": 4,
  "South Africa": 2,
  "Spain": 4,
  "Sri Lanka": 4,
  "Sweden": 6,
  "Switzerland": 6,
  "Taiwan": 5,
  "Tanzania": 2,
  "Thailand": 4,
  "Tonga": 3,
  "Trinidad and Tobago": 6,
  "Tunisia": 2,
  "Türkiye (Turkey)": 3,
  "Uganda": 3,
  "Ukraine": 2,
  "United Arab Emirates": 6,
  "United Kingdom": 5,
  "United States of America": 6,
  "Uruguay": 3,
  "Vanuatu": 4,
  "Vietnam": 3,
};

export const HIGH_COST_CENTRE_NAMES: readonly string[] = Object.keys(HIGH_COST_CENTRES);
export const OVERSEAS_COUNTRY_NAMES: readonly string[] = Object.keys(OVERSEAS_COST_GROUP);

/** Where the traveller stays overnight. */
export type Destination =
  | { kind: "capital"; city: CapitalCity }
  | { kind: "high-cost"; centre: string }
  | { kind: "other-country" }
  | { kind: "overseas"; country: string };

export interface DailyReasonableAmount {
  /** Null where no reasonable amount exists (overseas accommodation must be substantiated). */
  accommodation: number | null;
  meals: Meals | null;
  /** breakfast + lunch + dinner (overseas: the single meals figure). */
  mealsTotal: number;
  incidentals: number;
  /** accommodation (if any) + mealsTotal + incidentals. */
  total: number;
  table: string;
}

function round2(n: number): number {
  return Math.round(n * 100 + Number.EPSILON) / 100;
}

function mealsTotal(m: Meals): number {
  return round2(m.breakfast + m.lunch + m.dinner);
}

/** The reasonable amount for one full day away, for a salary and destination. */
export function dailyReasonableAmount(salary: number, dest: Destination): DailyReasonableAmount {
  const band = salaryBand(salary);
  if (dest.kind === "overseas") {
    const group = OVERSEAS_COST_GROUP[dest.country] ?? UNLISTED_COUNTRY_COST_GROUP;
    const row = OVERSEAS_TABLES[band][group];
    return {
      accommodation: null,
      meals: null,
      mealsTotal: row.meals,
      incidentals: row.incidentals,
      total: round2(row.meals + row.incidentals),
      table: `Table ${band + 5}, cost group ${group}`,
    };
  }
  const t = DOMESTIC_TABLES[band];
  let accommodation: number;
  let meals: Meals = t.meals;
  if (dest.kind === "capital") {
    accommodation = t.accommodation[dest.city];
  } else if (band === 3) {
    // Table 3: every country centre is $207, or the Table 4 amount if higher.
    const t4 = dest.kind === "high-cost" ? HIGH_COST_CENTRES[dest.centre] ?? 0 : 0;
    accommodation = Math.max(t.allCountryAccommodationFloor!, t4);
  } else if (dest.kind === "high-cost") {
    const t4 = HIGH_COST_CENTRES[dest.centre];
    if (t4 === undefined) throw new Error(`Not a TD 2026/4 Table 4 centre: ${dest.centre}`);
    accommodation = t4;
  } else {
    accommodation = t.otherCountry!.accommodation;
    meals = t.otherCountry!.meals;
  }
  const mt = mealsTotal(meals);
  return {
    accommodation,
    meals,
    mealsTotal: mt,
    incidentals: t.incidentals,
    total: round2(accommodation + mt + t.incidentals),
    table: dest.kind === "high-cost" && band !== 3 ? `Table ${band} + Table 4` : `Table ${band}`,
  };
}

export interface TripInput {
  salary: number;
  destination: Destination;
  /** Nights away (accommodation). */
  nights: number;
  /** Allowance the employer pays for the whole trip, if you want the withholding split. */
  allowancePaid?: number;
  /** Whether the employer pays the accommodation directly (so it is not in the allowance). */
  accommodationProvided?: boolean;
}

export interface TripResult {
  daily: DailyReasonableAmount;
  /** Nights + 1 travel days (incidentals apply in full on part days, para 23). */
  days: number;
  accommodation: number;
  /** Full-day meals × days — an upper bound; first and last days only count meals inside the travel period. */
  mealsMax: number;
  incidentals: number;
  /** Reasonable amount for the trip (upper bound, see mealsMax). */
  total: number;
  /** allowancePaid − total, floored at 0: the part the employer withholds from. */
  excessOverReasonable: number;
  /** True when overseas accommodation is part of the allowance (always withheld). */
  overseasAccommodationWithheld: boolean;
}

/**
 * Reasonable amount for a whole trip. Uses nights for accommodation and
 * nights + 1 days for meals and incidentals, which is the maximum; the
 * determination counts only the meals that fall within the travel period on
 * the first and last days (para 22).
 */
export function tripReasonableAmount(input: TripInput): TripResult {
  const nights = Math.max(0, Math.floor(input.nights));
  const days = nights > 0 ? nights + 1 : 0;
  const daily = dailyReasonableAmount(input.salary, input.destination);
  const accommodation = input.accommodationProvided || daily.accommodation === null ? 0 : round2(daily.accommodation * nights);
  const mealsMax = round2(daily.mealsTotal * days);
  const incidentals = round2(daily.incidentals * days);
  const total = round2(accommodation + mealsMax + incidentals);
  const paid = Math.max(0, input.allowancePaid ?? 0);
  return {
    daily,
    days,
    accommodation,
    mealsMax,
    incidentals,
    total,
    excessOverReasonable: round2(Math.max(0, paid - total)),
    overseasAccommodationWithheld: input.destination.kind === "overseas" && !input.accommodationProvided,
  };
}

// =============================================================================
// State-level EMPLOYEE data for the /pay-calculator-<state>/ pages.
//
// Nothing in this file is a tax, levy or premium figure. Income tax, the
// Medicare levy, HECS-HELP and super all live in lib/constants/australian-tax.ts
// and are federal — identical in every state. State payroll tax lives in
// STATE_PAYROLL_TAX in that same file. This module holds only the three things
// that genuinely differ between states for an EMPLOYEE:
//
//   1. public holidays — they decide when public holiday penalty rates apply
//   2. long service leave — a separate Act in every state and territory
//   3. what people in that state actually earn (ABS, so the worked example on
//      each page uses a salary typical of that state rather than a made-up one)
//
// Every figure below was read from the source named next to it on the date in
// STATE_EMPLOYEE_SOURCES.verifiedOn. Nothing here is estimated.
// =============================================================================

export const STATE_EMPLOYEE_SOURCES = {
  verifiedOn: "28 August 2026",
  /**
   * ABS "Average Weekly Earnings, Australia", reference period May 2026,
   * released 13 August 2026. State figures are read from data cubes
   * Table 13a–13h (average weekly earnings by state, dollars, ORIGINAL series),
   * series "Earnings; Persons; Full Time; Adult; Ordinary time earnings".
   */
  absAwe: "https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/average-weekly-earnings-australia/latest-release",
  absReferencePeriod: "May 2026",
  absReleasedOn: "13 August 2026",
  /** FWO "2026 public holidays", page content last updated 10 August 2026. */
  fwoPublicHolidays: "https://www.fairwork.gov.au/employment-conditions/public-holidays/2026-public-holidays",
  /** FWO "Public holiday penalty rates". */
  fwoPenaltyRates: "https://www.fairwork.gov.au/pay-and-wages/penalty-rates-allowances-and-other-payments/penalty-rates/public-holiday-penalty-rates",
  /** FWO "Long service leave" — the hub that names each state's LSL authority. */
  fwoLongServiceLeave: "https://www.fairwork.gov.au/leave/long-service-leave",
} as const;

/**
 * National benchmark for the same ABS series, so each state page can say how
 * its own number compares. Published in the release's key statistics as
 * "Full-time adult average weekly ordinary time earnings", original series.
 */
export const ABS_NATIONAL_AWOTE_WEEKLY = 2_083.70;

export interface StatePublicHoliday {
  /** As published by the FWO, e.g. "Monday 9 March". */
  date: string;
  name: string;
  /**
   * True when the day is NOT observed nationally — the ones that make this
   * state's penalty-rate calendar different from the state next door.
   */
  stateSpecific: boolean;
  /** Regional / part-day / sector caveats, exactly as the FWO words them. */
  note?: string;
}

export interface StateLongServiceLeave {
  /** The Act the entitlement comes from. */
  act: string;
  /** The agency an employee actually contacts. */
  agency: string;
  agencyUrl: string;
  /** Years of continuous service before leave can be TAKEN. */
  takeAfterYears: number;
  /** Weeks accrued at that point. */
  weeksAtEntitlement: number;
  /** How much accrues after that, in the state's own words. */
  thereafter: string;
  /** Years after which a pro-rata payment is owed if employment ends. */
  proRataOnEndingYears: number | null;
  /** One sentence an employee can act on. */
  summary: string;
}

export interface StateEmployeeProfile {
  code: "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";
  /** Full name as the ABS and the FWO write it. */
  name: string;
  /** How searchers write it — used in H1s and copy. */
  shortName: string;
  /** "in New South Wales" / "in the Northern Territory". */
  inName: string;
  capital: string;
  /** ABS May 2026, original series, dollars per week. */
  awote: {
    personsFullTime: number;
    malesFullTime: number;
    femalesFullTime: number;
    /** Full-time adult TOTAL earnings — includes overtime. */
    personsFullTimeTotal: number;
    /** All employees (includes part-time), total earnings. */
    allEmployees: number;
  };
  publicHolidays2026: readonly StatePublicHoliday[];
  longServiceLeave: StateLongServiceLeave;
  /** Route in the /long-service-leave-calculator/ cluster being built. */
  lslCalculatorPath: string;
}

/** ABS weekly → annual, on the same 52-week basis the rest of the site uses. */
export function weeklyToAnnualSalary(weekly: number, weeksPerYear = 52): number {
  return Math.round(weekly * weeksPerYear);
}

// ---------- Public holidays ----------
// Source: FWO "2026 public holidays" (STATE_EMPLOYEE_SOURCES.fwoPublicHolidays),
// page content last updated 10 August 2026. Dates and wording are the FWO's.
// `stateSpecific: true` marks a day that is NOT observed in every state — those
// are the days that make one state's penalty-rate calendar differ from another's.

const NSW_HOLIDAYS: readonly StatePublicHoliday[] = [
  { date: "Thursday 1 January", name: "New Year's Day", stateSpecific: false },
  { date: "Monday 26 January", name: "Australia Day", stateSpecific: false },
  { date: "Friday 3 April", name: "Good Friday", stateSpecific: false },
  { date: "Saturday 4 April", name: "Easter Saturday", stateSpecific: true },
  { date: "Sunday 5 April", name: "Easter Sunday", stateSpecific: true },
  { date: "Monday 6 April", name: "Easter Monday", stateSpecific: false },
  { date: "Saturday 25 April", name: "Anzac Day", stateSpecific: false },
  { date: "Monday 27 April", name: "Additional public holiday for Anzac Day", stateSpecific: true },
  { date: "Monday 8 June", name: "King's Birthday", stateSpecific: true },
  { date: "Monday 5 October", name: "Labour Day", stateSpecific: true },
  { date: "Friday 25 December", name: "Christmas Day", stateSpecific: false },
  { date: "Saturday 26 December", name: "Boxing Day", stateSpecific: false },
  { date: "Monday 28 December", name: "Additional public holiday for Boxing Day", stateSpecific: true },
];

const VIC_HOLIDAYS: readonly StatePublicHoliday[] = [
  { date: "Thursday 1 January", name: "New Year's Day", stateSpecific: false },
  { date: "Monday 26 January", name: "Australia Day", stateSpecific: false },
  { date: "Monday 9 March", name: "Labour Day", stateSpecific: true },
  { date: "Friday 3 April", name: "Good Friday", stateSpecific: false },
  { date: "Saturday 4 April", name: "Saturday before Easter Sunday", stateSpecific: true },
  { date: "Sunday 5 April", name: "Easter Sunday", stateSpecific: true },
  { date: "Monday 6 April", name: "Easter Monday", stateSpecific: false },
  { date: "Saturday 25 April", name: "Anzac Day", stateSpecific: false },
  { date: "Monday 8 June", name: "King's Birthday", stateSpecific: true },
  { date: "Friday 25 September", name: "Friday before the AFL Grand Final", stateSpecific: true },
  { date: "Tuesday 3 November", name: "Melbourne Cup", stateSpecific: true, note: "Some regional areas in Victoria hold the Melbourne Cup public holiday on a different date." },
  { date: "Friday 25 December", name: "Christmas Day", stateSpecific: false },
  { date: "Saturday 26 December", name: "Boxing Day", stateSpecific: false },
  { date: "Monday 28 December", name: "Additional public holiday for Boxing Day", stateSpecific: true },
];

const QLD_HOLIDAYS: readonly StatePublicHoliday[] = [
  { date: "Thursday 1 January", name: "New Year's Day", stateSpecific: false },
  { date: "Monday 26 January", name: "Australia Day", stateSpecific: false },
  { date: "Friday 3 April", name: "Good Friday", stateSpecific: false },
  { date: "Saturday 4 April", name: "The day after Good Friday", stateSpecific: true },
  { date: "Sunday 5 April", name: "Easter Sunday", stateSpecific: true },
  { date: "Monday 6 April", name: "Easter Monday", stateSpecific: false },
  { date: "Saturday 25 April", name: "Anzac Day", stateSpecific: false },
  { date: "Monday 4 May", name: "Labour Day", stateSpecific: true },
  { date: "Wednesday 12 August", name: "Royal Queensland Show", stateSpecific: true, note: "Brisbane area only." },
  { date: "Monday 5 October", name: "King's Birthday", stateSpecific: true },
  { date: "Thursday 24 December", name: "Christmas Eve", stateSpecific: true, note: "Part-day holiday, from 6 pm to midnight." },
  { date: "Friday 25 December", name: "Christmas Day", stateSpecific: false },
  { date: "Saturday 26 December", name: "Boxing Day", stateSpecific: false },
  { date: "Monday 28 December", name: "Additional public holiday for Boxing Day", stateSpecific: true },
];

const WA_HOLIDAYS: readonly StatePublicHoliday[] = [
  { date: "Thursday 1 January", name: "New Year's Day", stateSpecific: false },
  { date: "Monday 26 January", name: "Australia Day", stateSpecific: false },
  { date: "Monday 2 March", name: "Labour Day", stateSpecific: true },
  { date: "Friday 3 April", name: "Good Friday", stateSpecific: false },
  { date: "Sunday 5 April", name: "Easter Sunday", stateSpecific: true },
  { date: "Monday 6 April", name: "Easter Monday", stateSpecific: false },
  { date: "Saturday 25 April", name: "Anzac Day", stateSpecific: false },
  { date: "Monday 27 April", name: "Additional public holiday for Anzac Day", stateSpecific: true },
  { date: "Monday 1 June", name: "Western Australia Day", stateSpecific: true },
  { date: "Monday 28 September", name: "King's Birthday", stateSpecific: true, note: "Some regional areas in WA hold the King's Birthday public holiday on a different date." },
  { date: "Friday 25 December", name: "Christmas Day", stateSpecific: false },
  { date: "Saturday 26 December", name: "Boxing Day", stateSpecific: false },
  { date: "Monday 28 December", name: "Additional public holiday for Boxing Day", stateSpecific: true },
];

const SA_HOLIDAYS: readonly StatePublicHoliday[] = [
  { date: "Thursday 1 January", name: "New Year's Day", stateSpecific: false },
  { date: "Monday 26 January", name: "Australia Day", stateSpecific: false },
  { date: "Monday 9 March", name: "Adelaide Cup Day", stateSpecific: true },
  { date: "Friday 3 April", name: "Good Friday", stateSpecific: false },
  { date: "Saturday 4 April", name: "Easter Saturday", stateSpecific: true },
  { date: "Sunday 5 April", name: "Easter Sunday", stateSpecific: true },
  { date: "Monday 6 April", name: "Easter Monday", stateSpecific: false },
  { date: "Saturday 25 April", name: "Anzac Day", stateSpecific: false },
  { date: "Monday 8 June", name: "King's Birthday", stateSpecific: true },
  { date: "Monday 5 October", name: "Labour Day", stateSpecific: true },
  { date: "Thursday 24 December", name: "Christmas Eve", stateSpecific: true, note: "Part-day holiday, from 7 pm to midnight." },
  { date: "Friday 25 December", name: "Christmas Day", stateSpecific: false },
  { date: "Saturday 26 December", name: "Proclamation Day holiday", stateSpecific: true },
  { date: "Monday 28 December", name: "Additional public holiday for Proclamation Day holiday", stateSpecific: true },
  { date: "Thursday 31 December", name: "New Year's Eve", stateSpecific: true, note: "Part-day holiday, from 7 pm to midnight." },
];

const TAS_HOLIDAYS: readonly StatePublicHoliday[] = [
  { date: "Thursday 1 January", name: "New Year's Day", stateSpecific: false },
  { date: "Monday 26 January", name: "Australia Day", stateSpecific: false },
  { date: "Monday 9 February", name: "Royal Hobart Regatta", stateSpecific: true, note: "Only observed in certain areas of the state, including Hobart." },
  { date: "Monday 9 March", name: "Eight Hours Day", stateSpecific: true },
  { date: "Friday 3 April", name: "Good Friday", stateSpecific: false },
  { date: "Monday 6 April", name: "Easter Monday", stateSpecific: false },
  { date: "Tuesday 7 April", name: "Easter Tuesday", stateSpecific: true, note: "Generally Tasmanian Public Service only." },
  { date: "Saturday 25 April", name: "Anzac Day", stateSpecific: false },
  { date: "Monday 8 June", name: "King's Birthday", stateSpecific: true },
  { date: "Thursday 22 October", name: "Royal Hobart Show", stateSpecific: true, note: "Only observed in certain areas of the state, including Hobart." },
  { date: "Monday 2 November", name: "Recreation Day", stateSpecific: true, note: "Areas of the state that don't observe Royal Hobart Regatta." },
  { date: "Friday 25 December", name: "Christmas Day", stateSpecific: false },
  { date: "Monday 28 December", name: "Boxing Day", stateSpecific: false },
];

const ACT_HOLIDAYS: readonly StatePublicHoliday[] = [
  { date: "Thursday 1 January", name: "New Year's Day", stateSpecific: false },
  { date: "Monday 26 January", name: "Australia Day", stateSpecific: false },
  { date: "Monday 9 March", name: "Canberra Day", stateSpecific: true },
  { date: "Friday 3 April", name: "Good Friday", stateSpecific: false },
  { date: "Saturday 4 April", name: "Easter Saturday – the day after Good Friday", stateSpecific: true },
  { date: "Sunday 5 April", name: "Easter Sunday", stateSpecific: true },
  { date: "Monday 6 April", name: "Easter Monday", stateSpecific: false },
  { date: "Saturday 25 April", name: "Anzac Day", stateSpecific: false },
  { date: "Monday 27 April", name: "Additional public holiday for Anzac Day", stateSpecific: true },
  { date: "Monday 1 June", name: "Reconciliation Day", stateSpecific: true },
  { date: "Monday 8 June", name: "King's Birthday", stateSpecific: true },
  { date: "Monday 5 October", name: "Labour Day", stateSpecific: true },
  { date: "Friday 25 December", name: "Christmas Day", stateSpecific: false },
  { date: "Saturday 26 December", name: "Boxing Day", stateSpecific: false },
  { date: "Monday 28 December", name: "Additional public holiday for Boxing Day", stateSpecific: true },
];

const NT_HOLIDAYS: readonly StatePublicHoliday[] = [
  { date: "Thursday 1 January", name: "New Year's Day", stateSpecific: false },
  { date: "Monday 26 January", name: "Australia Day", stateSpecific: false },
  { date: "Friday 3 April", name: "Good Friday", stateSpecific: false },
  { date: "Saturday 4 April", name: "Easter Saturday", stateSpecific: true },
  { date: "Sunday 5 April", name: "Easter Sunday", stateSpecific: true },
  { date: "Monday 6 April", name: "Easter Monday", stateSpecific: false },
  { date: "Saturday 25 April", name: "Anzac Day", stateSpecific: false },
  { date: "Monday 4 May", name: "May Day", stateSpecific: true },
  { date: "Monday 8 June", name: "King's Birthday", stateSpecific: true },
  { date: "Monday 3 August", name: "Picnic Day", stateSpecific: true },
  { date: "Thursday 24 December", name: "Christmas Eve", stateSpecific: true, note: "Part-day holiday, from 7 pm to midnight." },
  { date: "Friday 25 December", name: "Christmas Day", stateSpecific: false },
  { date: "Saturday 26 December", name: "Boxing Day", stateSpecific: false },
  { date: "Monday 28 December", name: "Additional public holiday for Boxing Day", stateSpecific: true },
  { date: "Thursday 31 December", name: "New Year's Eve", stateSpecific: true, note: "Part-day holiday, from 7 pm to midnight." },
];

// ---------- Long service leave ----------
// Read from each state's own long service leave authority on
// STATE_EMPLOYEE_SOURCES.verifiedOn. The FWO hub that names these authorities
// is STATE_EMPLOYEE_SOURCES.fwoLongServiceLeave. Portable schemes (building and
// construction, contract cleaning, community services, security, coal mining)
// sit outside these Acts and are not summarised here.

export const STATE_PROFILES: Readonly<Record<string, StateEmployeeProfile>> = {
  NSW: {
    code: "NSW",
    name: "New South Wales",
    shortName: "NSW",
    inName: "in New South Wales",
    capital: "Sydney",
    awote: { personsFullTime: 2_108.80, malesFullTime: 2_204.50, femalesFullTime: 1_970.70, personsFullTimeTotal: 2_177.30, allEmployees: 1_616.00 },
    publicHolidays2026: NSW_HOLIDAYS,
    longServiceLeave: {
      act: "Long Service Leave Act 1955 (NSW)",
      agency: "NSW Industrial Relations",
      agencyUrl: "https://www.nsw.gov.au/employment/rights-responsibilities/leave/long-service-leave",
      takeAfterYears: 10,
      weeksAtEntitlement: 8.67,
      thereafter: "a further 4.33 weeks (one month) for each additional 5 years of service",
      proRataOnEndingYears: 5,
      summary:
        "Ten years of continuous service with the same employer earns 8.67 weeks — two months — of paid long service leave, then 4.33 weeks for every further 5 years. Between 5 and 10 years a pro-rata payment is only owed if the employer ends the employment for a reason other than serious or wilful misconduct, or you resign because of illness, incapacity, or domestic or other pressing necessity. Past 10 years it is paid out however the job ends.",
    },
    lslCalculatorPath: "/long-service-leave-calculator/nsw/",
  },
  VIC: {
    code: "VIC",
    name: "Victoria",
    shortName: "VIC",
    inName: "in Victoria",
    capital: "Melbourne",
    awote: { personsFullTime: 2_041.10, malesFullTime: 2_140.90, femalesFullTime: 1_889.60, personsFullTimeTotal: 2_102.20, allEmployees: 1_507.80 },
    publicHolidays2026: VIC_HOLIDAYS,
    longServiceLeave: {
      act: "Long Service Leave Act 2018 (Vic)",
      agency: "Wage Inspectorate Victoria",
      agencyUrl: "https://www.vic.gov.au/long-service-leave",
      takeAfterYears: 7,
      weeksAtEntitlement: 6.07,
      thereafter: "continued accrual at one week for every 60 weeks of continuous service",
      proRataOnEndingYears: 7,
      summary:
        "Victoria has one of the shortest qualifying periods in the country: 7 years of continuous service with one employer. Leave accrues at one week for every 60 weeks of service — about 0.866 of a week a year, so roughly 6.1 weeks by the 7-year mark. Once you pass 7 years the full accrued balance is paid out however the employment ends, including resignation and redundancy.",
    },
    lslCalculatorPath: "/long-service-leave-calculator/vic/",
  },
  QLD: {
    code: "QLD",
    name: "Queensland",
    shortName: "QLD",
    inName: "in Queensland",
    capital: "Brisbane",
    awote: { personsFullTime: 2_039.70, malesFullTime: 2_122.00, femalesFullTime: 1_908.20, personsFullTimeTotal: 2_130.00, allEmployees: 1_561.40 },
    publicHolidays2026: QLD_HOLIDAYS,
    longServiceLeave: {
      act: "Industrial Relations Act 2016 (Qld)",
      agency: "Queensland Industrial Relations",
      agencyUrl: "https://www.business.qld.gov.au/running-business/employing/employee-rights/long-service-leave",
      takeAfterYears: 10,
      weeksAtEntitlement: 8.6667,
      thereafter: "a further 4.3333 weeks at 15 years, taking the total to 13 weeks; beyond that, accrued leave has no qualifying period",
      proRataOnEndingYears: 7,
      summary:
        "Ten years of continuous service earns 8.6667 weeks of paid long service leave, rising to 13 weeks at 15 years. Between 7 and 10 years a proportionate payment is owed only in defined circumstances — death, illness or injury, domestic necessity, or dismissal for a reason other than conduct, capacity or performance. At 10 years the payment on termination becomes automatic.",
    },
    lslCalculatorPath: "/long-service-leave-calculator/qld/",
  },
  WA: {
    code: "WA",
    name: "Western Australia",
    shortName: "WA",
    inName: "in Western Australia",
    capital: "Perth",
    awote: { personsFullTime: 2_227.40, malesFullTime: 2_378.70, femalesFullTime: 1_945.10, personsFullTimeTotal: 2_317.80, allEmployees: 1_692.40 },
    publicHolidays2026: WA_HOLIDAYS,
    longServiceLeave: {
      act: "Long Service Leave Act 1958 (WA)",
      agency: "Private Sector Labour Relations, Department of Energy, Mines, Industry Regulation and Safety",
      agencyUrl: "https://www.wa.gov.au/organisation/private-sector-labour-relations/overview-of-long-service-leave-wa",
      takeAfterYears: 10,
      weeksAtEntitlement: 8.667,
      thereafter: "a further 4.333 weeks for every 5 years of continuous employment after that",
      proRataOnEndingYears: 7,
      summary:
        "Leave can be taken after 10 years of continuous employment, when 8.667 weeks has accrued, with another 4.333 weeks every 5 years after that. WA is unusually generous at the exit: after 7 years of continuous employment a full-time, part-time, casual or seasonal employee may be owed a payment when the job ends by resignation, dismissal, redundancy or death.",
    },
    lslCalculatorPath: "/long-service-leave-calculator/wa/",
  },
  SA: {
    code: "SA",
    name: "South Australia",
    shortName: "SA",
    inName: "in South Australia",
    capital: "Adelaide",
    awote: { personsFullTime: 1_970.20, malesFullTime: 2_043.20, femalesFullTime: 1_858.00, personsFullTimeTotal: 2_033.90, allEmployees: 1_490.90 },
    publicHolidays2026: SA_HOLIDAYS,
    longServiceLeave: {
      act: "Long Service Leave Act 1987 (SA)",
      agency: "SafeWork SA",
      agencyUrl: "https://www.safework.sa.gov.au/workers/wages-and-conditions/long-service-leave",
      takeAfterYears: 10,
      weeksAtEntitlement: 13,
      thereafter: "1.3 weeks (9.1 days) for each subsequent year of service",
      proRataOnEndingYears: 7,
      summary:
        "South Australia pays the largest entitlement in the country: 13 weeks after 10 years of continuous service, then 1.3 weeks for every year after that. Accrual is 1.3 weeks per completed year regardless of whether you are full-time, part-time or casual. A pro-rata payment becomes available once you complete 7 years, worth 1.3 weeks for each completed year.",
    },
    lslCalculatorPath: "/long-service-leave-calculator/sa/",
  },
  TAS: {
    code: "TAS",
    name: "Tasmania",
    shortName: "TAS",
    inName: "in Tasmania",
    capital: "Hobart",
    awote: { personsFullTime: 1_846.30, malesFullTime: 1_854.90, femalesFullTime: 1_830.20, personsFullTimeTotal: 1_904.20, allEmployees: 1_360.70 },
    publicHolidays2026: TAS_HOLIDAYS,
    longServiceLeave: {
      act: "Long Service Leave Act 1976 (Tas)",
      agency: "WorkSafe Tasmania",
      agencyUrl: "https://worksafe.tas.gov.au/topics/laws-and-compliance/long-service-leave",
      takeAfterYears: 10,
      weeksAtEntitlement: 8.667,
      thereafter: "4⅓ weeks after each additional 5 years of continuous employment",
      proRataOnEndingYears: 7,
      summary:
        "Private sector Tasmanians get 8⅔ weeks of paid leave after 10 years of continuous employment, then 4⅓ weeks every 5 years. A pro-rata payment may be owed on termination once you have completed 7 but fewer than 10 years. Government employees, construction workers under TasBuild, and anyone whose federal award or agreement already contains long service leave terms sit outside the Act.",
    },
    lslCalculatorPath: "/long-service-leave-calculator/tas/",
  },
  ACT: {
    code: "ACT",
    name: "Australian Capital Territory",
    shortName: "ACT",
    inName: "in the ACT",
    capital: "Canberra",
    awote: { personsFullTime: 2_290.20, malesFullTime: 2_331.90, femalesFullTime: 2_244.20, personsFullTimeTotal: 2_332.20, allEmployees: 1_862.10 },
    publicHolidays2026: ACT_HOLIDAYS,
    longServiceLeave: {
      act: "Long Service Leave Act 1976 (ACT)",
      agency: "WorkSafe ACT",
      agencyUrl: "https://www.worksafe.act.gov.au/laws-and-compliance/long-service-leave",
      takeAfterYears: 7,
      weeksAtEntitlement: 6.0667,
      thereafter: "a further 1/5 of a month for each subsequent year of continuous service",
      proRataOnEndingYears: 5,
      summary:
        "The ACT reaches the entitlement fastest of any jurisdiction: 6.0667 weeks of paid leave after just 7 years of continuous service, then a further fifth of a month each year. If a public holiday falls during your long service leave, the leave is extended by a day. A pro-rata payment can be owed from as little as 5 years where the job ends through illness, incapacity, pressing necessity, retirement, death, or dismissal for anything short of serious and wilful misconduct.",
    },
    lslCalculatorPath: "/long-service-leave-calculator/act/",
  },
  NT: {
    code: "NT",
    name: "Northern Territory",
    shortName: "NT",
    inName: "in the Northern Territory",
    capital: "Darwin",
    awote: { personsFullTime: 1_984.10, malesFullTime: 2_095.30, femalesFullTime: 1_853.50, personsFullTimeTotal: 2_092.10, allEmployees: 1_675.30 },
    publicHolidays2026: NT_HOLIDAYS,
    longServiceLeave: {
      act: "Long Service Leave Act 1981 (NT)",
      agency: "NT Office of the Commissioner for Public Employment",
      agencyUrl: "https://nt.gov.au/employ/for-employees-in-nt/holidays-and-leave/long-service-leave",
      takeAfterYears: 10,
      weeksAtEntitlement: 13,
      thereafter: "1.3 weeks of leave for each further year of employment",
      proRataOnEndingYears: 7,
      summary:
        "Thirteen weeks of paid leave after 10 years of continuous service, calculated at 1.3 weeks for each year of employment. Part years do not count, and you cannot cash the leave out instead of taking it. Between 7 and 10 years a pro-rata payment is owed only if you reach retirement age, the employer ends the job for something other than serious misconduct, or you resign because of illness, incapacity or pressing necessity.",
    },
    lslCalculatorPath: "/long-service-leave-calculator/nt/",
  },
};

// =============================================================================
// Public holiday pay cluster (G4, 24 Sep 2026) — shared types.
//
// The pages built from this directory are about getting PAID on a public
// holiday. The date lists are the supporting context: they tell a worker which
// days on their roster attract the public holiday rate.
//
// SOURCING RULE. Every date was read from the state or territory government's
// own public holidays page (see each state's `sources`) on `verifiedOn`. Each
// date carries `source`: the date exactly as that page prints it ("Monday 27
// April", "Friday 1 January 2027", "28 December"). The tests parse `source` and
// assert it agrees with the ISO `date` — day, month, year where printed, and
// weekday where printed — so a typo in either shows up as a failing test.
// A date the official page does not yet publish is NOT guessed: it goes in
// `omitted` with the reason, and the page says so.
// =============================================================================

export const PH_STATE_SLUGS = ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"] as const;
export type PhStateSlug = (typeof PH_STATE_SLUGS)[number];

export const PH_YEARS = [2026, 2027] as const;
export type PhYear = (typeof PH_YEARS)[number];

/**
 * - statewide: a public holiday for the whole state or territory.
 * - additional: an extra or substitute day given because a holiday fell on a
 *   weekend (e.g. Monday 28 December 2026 for Boxing Day).
 * - part-day: a public holiday for part of the day only (Christmas Eve and New
 *   Year's Eve evenings in SA, QLD and the NT). `hours` says which part.
 * - regional: a public holiday in part of the state only (Brisbane show day,
 *   NT show days). `note` names the area.
 * - limited: listed by the government but generally observed only by some
 *   employers (Tasmania's Easter Tuesday — Tasmanian Public Service).
 */
export type HolidayKind = "statewide" | "additional" | "part-day" | "regional" | "limited";

export interface PublicHolidayDate {
  /** ISO date, yyyy-mm-dd. */
  date: string;
  /** The date exactly as the official source prints it. Tested against `date`. */
  source: string;
  name: string;
  kind: HolidayKind;
  /** Part-day holidays only, e.g. "7pm to midnight". */
  hours?: string;
  note?: string;
}

export interface OmittedHoliday {
  name: string;
  /** Why no date is shown — always the official source's own position. */
  reason: string;
}

export interface HolidayYear {
  year: PhYear;
  holidays: readonly PublicHolidayDate[];
  /** Holidays the official source has not dated yet. Never guessed. */
  omitted?: readonly OmittedHoliday[];
}

export interface RegionalHolidayRow {
  name: string;
  /** Area the holiday applies in, in the source's words (shortened where long). */
  area: string;
  dates: readonly { date: string; source: string }[];
  note?: string;
}

export interface RegionalHolidayTable {
  id: string;
  title: string;
  intro: string;
  rows: readonly RegionalHolidayRow[];
  /** Shown under the table, e.g. "2027 show holidays are not yet published". */
  footnote?: string;
  sourceTitle: string;
  sourceUrl: string;
}

export interface PhSource {
  title: string;
  url: string;
  publisher: string;
}

export interface PhSection {
  id: string;
  heading: string;
  paragraphs: readonly string[];
}

export interface PhCalculatorPreset {
  /** The holiday the calculator is prefilled for, e.g. "Melbourne Cup Day". */
  holidayName: string;
  /** Key into PUBLIC_HOLIDAY_AWARD_RATES. */
  awardKey: string;
  employment: "permanent" | "casual";
  hours: number;
}

export interface StatePublicHolidays {
  slug: PhStateSlug;
  code: string;
  name: string;
  /** "in Victoria", "in the Northern Territory". */
  inName: string;
  /** One-paragraph standfirst under the H1. */
  standfirst: string;
  sources: readonly PhSource[];
  verifiedOn: string;
  years: readonly HolidayYear[];
  regional: readonly RegionalHolidayTable[];
  /** Pay rules specific to this state (state system, part-day rules, etc.). */
  specifics: readonly PhSection[];
  calculatorPreset: PhCalculatorPreset;
  faqs: readonly { q: string; a: string }[];
}

// =============================================================================
// Weekend public holidays in 2026 and 2027, state by state, and what a shift on
// the weekend day pays under the General Retail and Hospitality awards.
//
// Five fixed-date holidays land on a Saturday or Sunday in these two years:
// Anzac Day 2026 (Sat) and 2027 (Sun), Boxing Day 2026 (Sat), Christmas Day
// 2027 (Sat) and Boxing Day 2027 (Sun). Each state decides whether the weekend
// day stays a public holiday and which weekday it adds or moves the holiday to.
// That decides which shift is paid the public holiday rate, so it is the most
// state-specific pay fact on a state page.
//
// Every row is READ FROM the verified state data in ./states; nothing is
// re-keyed. On 10 October 2026 each state's official page was re-read
// (Firecrawl) and every stored `source` date string was found on it. The
// substitute-day rules behind the rows, as each official page states them:
//   NSW  https://www.nsw.gov.au/about-nsw/public-holidays — Public Holidays Act
//        2010: an additional day when New Year's Day, Christmas Day or Boxing
//        Day falls on a weekend; Additional Days for Anzac Day 2026 and 2027.
//   VIC  https://business.vic.gov.au/business-information/public-holidays/victorian-public-holidays-2027
//        — Anzac Day "commemorated on the day it falls", no replacement; an
//        additional Monday / Tuesday for a weekend Christmas Day / Boxing Day.
//   QLD  https://www.qld.gov.au/recreation/travel/holidays/public — Holidays Act
//        1983 adds a day for a weekend Christmas, Boxing or New Year's Day;
//        Anzac Day is 25 April or, if that is a Sunday, the following Monday.
//   WA   https://www.wa.gov.au/service/employment/workplace-arrangements/public-holidays-western-australia
//        — New Year's Day, Anzac Day or Christmas Day on a weekend: the next
//        Monday is ALSO a holiday; Boxing Day on a Saturday adds the Monday,
//        on a Sunday the Tuesday.
//   SA   https://www.safework.sa.gov.au/resources/public-holidays — 26 December
//        on a Saturday: that day and the Monday; on a Sunday: that day and the
//        Tuesday.
//   TAS  https://worksafe.tas.gov.au/topics/laws-and-compliance/public-holidays
//        — 25 December on a Saturday: both the Saturday and the Monday; Boxing
//        Day on a Saturday: the Monday; on a Sunday: the Tuesday; no
//        substitute for Anzac Day.
//   ACT  https://www.act.gov.au/living-in-the-act/public-holidays-school-terms-and-daylight-saving
//        — lists "Saturday 25 and Monday 27 April", "Sunday 26 and Tuesday 28
//        December" etc.
//   NT   https://nt.gov.au/nt-public-holidays — Anzac Day 2027 listed for
//        Monday 26 April only; Christmas and Boxing Day 2027 on both the
//        weekend day and the following weekday.
// Retail and Hospitality weekend / public holiday multiples come from
// lib/constants/hospitality-award.ts (verified against the award texts there).
// Relative imports only: this file is compiled by the plain `tsc` test run.
// =============================================================================

import { HOSPITALITY_PENALTIES, RETAIL_PENALTIES } from "../../constants/hospitality-award";
import { weekdayOf } from "./dates";
import type { PhStateSlug, PublicHolidayDate, StatePublicHolidays } from "./types";

interface WeekendEvent {
  name: string;
  /** The fixed date, which falls on a weekend. */
  date: string;
  /** The weekday a state may add or move the holiday to. */
  next: string;
}

export const WEEKEND_EVENTS: readonly WeekendEvent[] = [
  { name: "Anzac Day", date: "2026-04-25", next: "2026-04-27" },
  { name: "Boxing Day", date: "2026-12-26", next: "2026-12-28" },
  { name: "Anzac Day", date: "2027-04-25", next: "2027-04-26" },
  { name: "Christmas Day", date: "2027-12-25", next: "2027-12-27" },
  { name: "Boxing Day", date: "2027-12-26", next: "2027-12-28" },
];

/**
 * Where the official page's rules and its own date table disagree, the rule
 * text wins and the row says so. Tasmania 2027: WorkSafe Tasmania's table lists
 * Monday 27 December for Christmas Day, but its substitute-holiday rules state
 * that when 25 December is a Saturday "both the Saturday and the Monday
 * following are holidays".
 */
const OVERRIDES: Partial<Record<PhStateSlug, Record<string, { holiday: boolean; note: string }>>> = {
  tas: {
    "2027-12-25": {
      holiday: true,
      note: "WorkSafe Tasmania's substitute-holiday rules make both the Saturday and the Monday holidays, although its 2027 table lists only the Monday. Check your award or agreement.",
    },
  },
};

export interface WeekendHolidayRow {
  /** The holiday as the state names it on the weekend date (SA: "Proclamation Day holiday"). */
  name: string;
  /** The weekend date. */
  date: string;
  weekday: "Saturday" | "Sunday";
  /** Is the weekend day itself a public holiday in this state? */
  weekendIsHoliday: boolean;
  /** The weekday holiday added or moved to, if any. */
  extra?: PublicHolidayDate;
  note?: string;
  /** Retail and Hospitality multiples for working the weekend date (permanent, casual incl. loading). */
  permanent: number;
  casual: number;
}

function wholeDays(s: StatePublicHolidays): PublicHolidayDate[] {
  return s.years.flatMap((y) => y.holidays.filter((h) => h.kind === "statewide" || h.kind === "additional"));
}

/** The weekend-day rates are identical in the two awards; the tests hold them together. */
export const WEEKEND_RATES = {
  Saturday: { permanent: RETAIL_PENALTIES.saturday, casual: RETAIL_PENALTIES.casualSaturday },
  Sunday: { permanent: RETAIL_PENALTIES.sunday, casual: RETAIL_PENALTIES.casualSunday },
  publicHoliday: { permanent: RETAIL_PENALTIES.publicHoliday, casual: RETAIL_PENALTIES.casualPublicHoliday },
} as const;

export const WEEKEND_RATES_MATCH_HOSPITALITY =
  HOSPITALITY_PENALTIES.saturday === RETAIL_PENALTIES.saturday &&
  HOSPITALITY_PENALTIES.casualSaturday === RETAIL_PENALTIES.casualSaturday &&
  HOSPITALITY_PENALTIES.sunday === RETAIL_PENALTIES.sunday &&
  HOSPITALITY_PENALTIES.casualSunday === RETAIL_PENALTIES.casualSunday &&
  HOSPITALITY_PENALTIES.publicHoliday === RETAIL_PENALTIES.publicHoliday &&
  HOSPITALITY_PENALTIES.casualPublicHoliday === RETAIL_PENALTIES.casualPublicHoliday;

export function weekendHolidayRows(s: StatePublicHolidays): WeekendHolidayRow[] {
  const days = wholeDays(s);
  const on = (iso: string) => days.find((h) => h.date === iso);
  return WEEKEND_EVENTS.map((e) => {
    const weekday = weekdayOf(e.date);
    if (weekday !== "Saturday" && weekday !== "Sunday") throw new Error(`weekend event ${e.name} ${e.date} is a ${weekday}`);
    const own = on(e.date);
    const extra = on(e.next);
    const override = OVERRIDES[s.slug]?.[e.date];
    const weekendIsHoliday = override ? override.holiday : Boolean(own);
    const rate = weekendIsHoliday ? WEEKEND_RATES.publicHoliday : WEEKEND_RATES[weekday];
    return {
      name: own ? own.name : e.name,
      date: e.date,
      weekday,
      weekendIsHoliday,
      extra,
      note: override?.note,
      permanent: rate.permanent,
      casual: rate.casual,
    };
  });
}

/** Weekend dates that are ordinary weekend days for pay in this state (no public holiday that day). */
export function ordinaryWeekendDays(s: StatePublicHolidays): WeekendHolidayRow[] {
  return weekendHolidayRows(s).filter((r) => !r.weekendIsHoliday);
}

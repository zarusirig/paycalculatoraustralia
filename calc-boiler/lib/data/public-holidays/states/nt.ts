import type { StatePublicHolidays } from "../types";

// Source: NT Government "NT public and regional holidays" (Public Holidays Act
// 1981), read 24 Sep 2026. Dates printed as "Friday 3 July 2026".

const SHOW_NOTE = "Regional holiday — only in that show day region. Check the NT Government's show day regions map.";

export const NT_PUBLIC_HOLIDAYS: StatePublicHolidays = {
  slug: "nt",
  code: "NT",
  name: "Northern Territory",
  inName: "in the Northern Territory",
  standfirst:
    "The Northern Territory has 13 whole-day public holidays in 2026 and 14 in 2027. On top of those are two part-day holidays, Christmas Eve and New Year's Eve from 7pm to midnight, and a regional show day in each of five show day regions. May Day and Picnic Day are Territory-only.",
  sources: [
    { title: "NT public and regional holidays", url: "https://nt.gov.au/nt-public-holidays", publisher: "Northern Territory Government" },
    { title: "Show day regions", url: "https://nt.gov.au/nt-public-holidays/show-day-regions", publisher: "Northern Territory Government" },
  ],
  verifiedOn: "24 September 2026",
  years: [
    {
      year: 2026,
      holidays: [
        { date: "2026-01-01", source: "Thursday 1 January 2026", name: "New Year's Day", kind: "statewide" },
        { date: "2026-01-26", source: "Monday 26 January 2026", name: "Australia Day", kind: "statewide" },
        { date: "2026-04-03", source: "Friday 3 April 2026", name: "Good Friday", kind: "statewide" },
        { date: "2026-04-04", source: "Saturday 4 April 2026", name: "Easter Saturday", kind: "statewide" },
        { date: "2026-04-05", source: "Sunday 5 April 2026", name: "Easter Sunday", kind: "statewide" },
        { date: "2026-04-06", source: "Monday 6 April 2026", name: "Easter Monday", kind: "statewide" },
        { date: "2026-04-25", source: "Saturday 25 April 2026", name: "Anzac Day", kind: "statewide" },
        { date: "2026-05-04", source: "Monday 4 May 2026", name: "May Day", kind: "statewide" },
        { date: "2026-06-08", source: "Monday 8 June 2026", name: "King's Birthday", kind: "statewide" },
        { date: "2026-07-03", source: "Friday 3 July 2026", name: "Alice Springs Show Day", kind: "regional", note: SHOW_NOTE },
        { date: "2026-07-10", source: "Friday 10 July 2026", name: "Tennant Creek Show Day", kind: "regional", note: SHOW_NOTE },
        { date: "2026-07-17", source: "Friday 17 July 2026", name: "Katherine Show Day", kind: "regional", note: SHOW_NOTE },
        { date: "2026-07-24", source: "Friday 24 July 2026", name: "Darwin Show Day", kind: "regional", note: SHOW_NOTE },
        { date: "2026-08-03", source: "Monday 3 August 2026", name: "Picnic Day", kind: "statewide" },
        { date: "2026-08-14", source: "Friday 14 August 2026", name: "Borroloola Show Day", kind: "regional", note: SHOW_NOTE },
        { date: "2026-12-24", source: "Thursday 24 December 2026", name: "Christmas Eve", kind: "part-day", hours: "7pm to midnight" },
        { date: "2026-12-25", source: "Friday 25 December 2026", name: "Christmas Day", kind: "statewide" },
        { date: "2026-12-26", source: "Saturday 26 December 2026", name: "Boxing Day", kind: "statewide" },
        { date: "2026-12-28", source: "Monday 28 December 2026", name: "Boxing Day Monday", kind: "additional", note: "Boxing Day falls on a Saturday." },
        { date: "2026-12-31", source: "Thursday 31 December 2026", name: "New Year's Eve", kind: "part-day", hours: "7pm to midnight" },
      ],
    },
    {
      year: 2027,
      holidays: [
        { date: "2027-01-01", source: "Friday 1 January 2027", name: "New Year's Day", kind: "statewide" },
        { date: "2027-01-26", source: "Tuesday 26 January 2027", name: "Australia Day", kind: "statewide" },
        { date: "2027-03-26", source: "Friday 26 March 2027", name: "Good Friday", kind: "statewide" },
        { date: "2027-03-27", source: "Saturday 27 March 2027", name: "Easter Saturday", kind: "statewide" },
        { date: "2027-03-28", source: "Sunday 28 March 2027", name: "Easter Sunday", kind: "statewide" },
        { date: "2027-03-29", source: "Monday 29 March 2027", name: "Easter Monday", kind: "statewide" },
        { date: "2027-04-26", source: "Monday 26 April 2027", name: "Anzac Day", kind: "statewide", note: "Listed for Monday 26 April; 25 April 2027 is a Sunday." },
        { date: "2027-05-03", source: "Monday 3 May 2027", name: "May Day", kind: "statewide" },
        { date: "2027-06-14", source: "Monday 14 June 2027", name: "King's Birthday", kind: "statewide" },
        { date: "2027-07-02", source: "Friday 2 July 2027", name: "Alice Springs Show Day", kind: "regional", note: SHOW_NOTE },
        { date: "2027-07-09", source: "Friday 9 July 2027", name: "Tennant Creek Show Day", kind: "regional", note: SHOW_NOTE },
        { date: "2027-07-16", source: "Friday 16 July 2027", name: "Katherine Show Day", kind: "regional", note: SHOW_NOTE },
        { date: "2027-07-23", source: "Friday 23 July 2027", name: "Darwin Show Day", kind: "regional", note: SHOW_NOTE },
        { date: "2027-08-02", source: "Monday 2 August 2027", name: "Picnic Day", kind: "statewide" },
        { date: "2027-08-13", source: "Friday 13 August 2027", name: "Borroloola Show Day", kind: "regional", note: SHOW_NOTE },
        { date: "2027-12-24", source: "Friday 24 December 2027", name: "Christmas Eve", kind: "part-day", hours: "7pm to midnight" },
        { date: "2027-12-25", source: "Saturday 25 December 2027 and Monday 27 December 2027", name: "Christmas Day", kind: "statewide" },
        { date: "2027-12-26", source: "Sunday 26 December 2027 and Tuesday 28 December 2027", name: "Boxing Day", kind: "statewide" },
        { date: "2027-12-27", source: "Saturday 25 December 2027 and Monday 27 December 2027", name: "Additional holiday (Christmas Day)", kind: "additional", note: "Christmas Day falls on a Saturday." },
        { date: "2027-12-28", source: "Sunday 26 December 2027 and Tuesday 28 December 2027", name: "Additional holiday (Boxing Day)", kind: "additional", note: "Boxing Day falls on a Sunday." },
        { date: "2027-12-31", source: "Friday 31 December 2027", name: "New Year's Eve", kind: "part-day", hours: "7pm to midnight" },
      ],
    },
  ],
  regional: [],
  specifics: [
    {
      id: "part-day",
      heading: "Christmas Eve and New Year's Eve from 7pm",
      paragraphs: [
        "The NT Government lists Christmas Eve and New Year's Eve as part-day holidays from 7pm to midnight only. Hours worked in that window are paid at your award's public holiday rate, and earlier hours at the usual rate for the day. A 4pm to midnight bar shift on New Year's Eve is 3 hours at the usual rates for that evening and 5 hours at the public holiday rate.",
      ],
    },
    {
      id: "show-days",
      heading: "Show days: which one is yours",
      paragraphs: [
        "The Territory has five regional show day holidays: Alice Springs, Tennant Creek, Katherine, Darwin and Borroloola. Each is a public holiday only in its own show day region, so an employee gets the one for the region their job is based in, not all five. Darwin Show Day is Friday 24 July 2026 and Friday 23 July 2027. The NT Government's show day regions map sets the boundaries.",
      ],
    },
    {
      id: "territory-days",
      heading: "May Day and Picnic Day",
      paragraphs: [
        "May Day (the first Monday in May) and Picnic Day (the first Monday in August) are Northern Territory public holidays found nowhere else. They are full public holidays for pay, so the award rates above apply if you work them, and permanent staff who normally work Mondays are paid for the day off.",
      ],
    },
  ],
  calculatorPreset: { holidayName: "Picnic Day", awardKey: "hospitality", employment: "casual", hours: 6 },
  faqs: [
    {
      q: "Is Picnic Day a public holiday in the NT?",
      a: "Yes. Picnic Day is a Northern Territory public holiday on the first Monday in August: Monday 3 August 2026 and Monday 2 August 2027. It attracts full public holiday entitlements, including award public holiday rates if you work it.",
    },
    {
      q: "Is Darwin Show Day a public holiday for the whole Territory?",
      a: "No. Each show day is a regional holiday that applies only in its show day region. Darwin Show Day is Friday 24 July 2026 and Friday 23 July 2027. Alice Springs, Tennant Creek, Katherine and Borroloola have their own dates.",
    },
    {
      q: "Is there a public holiday on the Monday after Anzac Day 2026 in the NT?",
      a: "No. Anzac Day 2026 is Saturday 25 April and the NT Government lists no Monday holiday for it. In 2027, when 25 April is a Sunday, the listed public holiday is Monday 26 April.",
    },
  ],
};

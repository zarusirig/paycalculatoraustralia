import type { StatePublicHolidays } from "../types";

// Source: SafeWork SA "Public holidays" (Public Holidays Act 2023), read
// 24 Sep 2026. Dates printed as "Thursday 24 December".

export const SA_PUBLIC_HOLIDAYS: StatePublicHolidays = {
  slug: "sa",
  code: "SA",
  name: "South Australia",
  inName: "in South Australia",
  standfirst:
    "South Australia has 13 whole-day public holidays in 2026 and 14 in 2027, set by the Public Holidays Act 2023. It also has two part-day public holidays, Christmas Eve and New Year's Eve from 7pm to midnight, so an evening shift can change rate partway through. On 26 December SA observes the Proclamation Day holiday, which is paid the same way as Boxing Day elsewhere.",
  sources: [
    { title: "Public holidays", url: "https://www.safework.sa.gov.au/resources/public-holidays", publisher: "SafeWork SA" },
    { title: "Public Holidays Act 2023 (SA)", url: "https://www.legislation.sa.gov.au/lz?path=%2FC%2FA%2FPublic%20Holidays%20Act%202023", publisher: "South Australian Legislation" },
  ],
  verifiedOn: "24 September 2026",
  years: [
    {
      year: 2026,
      holidays: [
        { date: "2026-01-01", source: "Thursday 1 January", name: "New Year's Day", kind: "statewide" },
        { date: "2026-01-26", source: "Monday 26 January", name: "Australia Day", kind: "statewide" },
        { date: "2026-03-09", source: "Monday 9 March", name: "Adelaide Cup Day", kind: "statewide" },
        { date: "2026-04-03", source: "Friday 3 April", name: "Good Friday", kind: "statewide" },
        { date: "2026-04-04", source: "Saturday 4 April", name: "Easter Saturday", kind: "statewide" },
        { date: "2026-04-05", source: "Sunday 5 April", name: "Easter Sunday", kind: "statewide" },
        { date: "2026-04-06", source: "Monday 6 April", name: "Easter Monday", kind: "statewide" },
        { date: "2026-04-25", source: "Saturday 25 April", name: "Anzac Day", kind: "statewide", note: "No substitute or additional day when it falls on a weekend." },
        { date: "2026-06-08", source: "Monday 8 June", name: "King's Birthday", kind: "statewide" },
        { date: "2026-10-05", source: "Monday 5 October", name: "Labour Day", kind: "statewide" },
        { date: "2026-12-24", source: "Thursday 24 December", name: "Christmas Eve", kind: "part-day", hours: "7pm to midnight" },
        { date: "2026-12-25", source: "Friday 25 December", name: "Christmas Day", kind: "statewide" },
        { date: "2026-12-26", source: "Saturday 26 December", name: "Proclamation Day holiday", kind: "statewide" },
        { date: "2026-12-28", source: "Monday 28 December", name: "Additional holiday (Proclamation Day)", kind: "additional", note: "26 December falls on a Saturday." },
        { date: "2026-12-31", source: "Thursday 31 December", name: "New Year's Eve", kind: "part-day", hours: "7pm to midnight" },
      ],
    },
    {
      year: 2027,
      holidays: [
        { date: "2027-01-01", source: "Friday 1 January", name: "New Year's Day", kind: "statewide" },
        { date: "2027-01-26", source: "Tuesday 26 January", name: "Australia Day", kind: "statewide" },
        { date: "2027-03-08", source: "Monday 8 March", name: "Adelaide Cup Day", kind: "statewide" },
        { date: "2027-03-26", source: "Friday 26 March", name: "Good Friday", kind: "statewide" },
        { date: "2027-03-27", source: "Saturday 27 March", name: "Easter Saturday", kind: "statewide" },
        { date: "2027-03-28", source: "Sunday 28 March", name: "Easter Sunday", kind: "statewide" },
        { date: "2027-03-29", source: "Monday 29 March", name: "Easter Monday", kind: "statewide" },
        { date: "2027-04-25", source: "Sunday 25 April", name: "Anzac Day", kind: "statewide", note: "No substitute or additional day when it falls on a weekend." },
        { date: "2027-06-14", source: "Monday 14 June", name: "King's Birthday", kind: "statewide" },
        { date: "2027-10-04", source: "Monday 4 October", name: "Labour Day", kind: "statewide" },
        { date: "2027-12-24", source: "Friday 24 December", name: "Christmas Eve", kind: "part-day", hours: "7pm to midnight" },
        { date: "2027-12-25", source: "Saturday 25 December", name: "Christmas Day", kind: "statewide" },
        { date: "2027-12-26", source: "Sunday 26 December", name: "Proclamation Day holiday and Boxing Day", kind: "statewide" },
        { date: "2027-12-27", source: "Monday 27 December", name: "Additional holiday (Christmas Day)", kind: "additional", note: "Christmas Day falls on a Saturday." },
        { date: "2027-12-28", source: "Tuesday 28 December", name: "Additional holiday (Proclamation Day)", kind: "additional", note: "26 December falls on a Sunday." },
        { date: "2027-12-31", source: "Friday 31 December", name: "New Year's Eve", kind: "part-day", hours: "7pm to midnight" },
      ],
    },
  ],
  regional: [],
  specifics: [
    {
      id: "part-day",
      heading: "Christmas Eve and New Year's Eve: public holiday rates from 7pm",
      paragraphs: [
        "SafeWork SA states that anyone who works between 7pm and midnight on Christmas Eve or New Year's Eve is entitled to the public holiday rates in their award or enterprise agreement. That still applies when those days fall on a Saturday or Sunday. Hours before 7pm are paid at the usual rate for that day. A 3pm to 11pm hospitality shift on Thursday 31 December 2026 is 4 hours at the Thursday rate and 4 hours at the public holiday rate.",
        "The National Employment Standards apply during the part-day window, just as on a whole-day public holiday. A full-time or part-time employee who would normally work that evening and is given it off is paid their base rate for those hours. Check your award for any part-day rules of its own.",
      ],
    },
    {
      id: "proclamation-day",
      heading: "Proclamation Day and the extra December days",
      paragraphs: [
        "South Australia's Proclamation Day is 28 December, but the holiday is observed on 26 December. When 26 December is a Saturday, that day and the following Monday are both public holidays. When it falls on a Sunday or Monday, that day and the following Tuesday are. When Christmas Day or New Year's Day falls on a weekend, that day and the following Monday are public holidays.",
        "That is why SA has an extra Monday on 28 December 2026, and extra holidays on both Monday 27 and Tuesday 28 December 2027. Each of those days is paid at the public holiday rate if you work it.",
      ],
    },
    {
      id: "easter-anzac",
      heading: "All four Easter days, and no extra Anzac Day",
      paragraphs: [
        "Since 1 January 2024 Easter Sunday has been a public holiday in SA, so Good Friday, Easter Saturday, Easter Sunday and Easter Monday all attract public holiday rates. Easter Saturday is still a normal Saturday for shop trading in the Greater Adelaide Shopping District. That affects opening hours, not your pay rate. Anzac Day is a public holiday on 25 April whatever the day, with no substitute when it falls on a weekend.",
      ],
    },
    {
      id: "fair-work",
      heading: "Who handles SA public holiday pay questions",
      paragraphs: [
        "SafeWork SA administers the holiday dates, but the Fair Work Ombudsman has jurisdiction over pay for the South Australian private sector. Questions about what you were paid for working a public holiday go to the Fair Work Ombudsman on 13 13 94.",
      ],
    },
  ],
  calculatorPreset: { holidayName: "New Year's Eve (from 7pm)", awardKey: "hospitality", employment: "casual", hours: 4 },
  faqs: [
    {
      q: "Are Christmas Eve and New Year's Eve public holidays in SA?",
      a: "From 7pm to midnight only. Hours worked in that window are paid at your award's public holiday rate, even when the day falls on a weekend. Hours before 7pm are paid at the usual rate for that day.",
    },
    {
      q: "Is Boxing Day a public holiday in South Australia?",
      a: "SA observes the Proclamation Day holiday on 26 December, and it works for pay the same way Boxing Day does in other states. In 2026 it is Saturday 26 December with an additional holiday on Monday 28 December. In 2027 it is Sunday 26 December with an additional holiday on Tuesday 28 December.",
    },
    {
      q: "Is Easter Sunday a public holiday in SA?",
      a: "Yes. Since 1 January 2024, under the Public Holidays Act 2023, Easter Sunday has been a public holiday in South Australia, so all four Easter days attract public holiday rates.",
    },
  ],
};

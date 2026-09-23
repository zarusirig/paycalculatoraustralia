import type { StatePublicHolidays } from "../types";

// Sources: Business Victoria "Victorian public holidays 2026" and "... 2027",
// and "Victorian non-metropolitan public holidays 2026" (last updated 3 Aug
// 2026), read 24 Sep 2026. Dates printed as "Monday 9 March".

export const VIC_PUBLIC_HOLIDAYS: StatePublicHolidays = {
  slug: "vic",
  code: "VIC",
  name: "Victoria",
  inName: "in Victoria",
  standfirst:
    "Victoria has 14 public holidays in 2026, including two found nowhere else: the Friday before the AFL Grand Final and Melbourne Cup Day. Some regional councils swap Melbourne Cup Day for a local holiday, which moves the day your public holiday rate applies. Anzac Day gets no replacement weekday when it falls on a weekend.",
  sources: [
    {
      title: "Victorian public holidays 2026",
      url: "https://business.vic.gov.au/business-information/public-holidays/victorian-public-holidays-2026",
      publisher: "Business Victoria",
    },
    {
      title: "Victorian public holidays 2027",
      url: "https://business.vic.gov.au/business-information/public-holidays/victorian-public-holidays-2027",
      publisher: "Business Victoria",
    },
    {
      title: "Victorian non-metropolitan public holidays 2026",
      url: "https://business.vic.gov.au/business-information/public-holidays/victorian-non-metropolitan-public-holidays-2026",
      publisher: "Business Victoria",
    },
  ],
  verifiedOn: "24 September 2026",
  years: [
    {
      year: 2026,
      holidays: [
        { date: "2026-01-01", source: "Thursday 1 January", name: "New Year's Day", kind: "statewide" },
        { date: "2026-01-26", source: "Monday 26 January", name: "Australia Day", kind: "statewide" },
        { date: "2026-03-09", source: "Monday 9 March", name: "Labour Day", kind: "statewide" },
        { date: "2026-04-03", source: "Friday 3 April", name: "Good Friday", kind: "statewide" },
        { date: "2026-04-04", source: "Saturday 4 April", name: "Saturday before Easter Sunday", kind: "statewide" },
        { date: "2026-04-05", source: "Sunday 5 April", name: "Easter Sunday", kind: "statewide" },
        { date: "2026-04-06", source: "Monday 6 April", name: "Easter Monday", kind: "statewide" },
        { date: "2026-04-25", source: "Saturday 25 April", name: "Anzac Day", kind: "statewide", note: "No replacement holiday when Anzac Day falls on a weekend." },
        { date: "2026-06-08", source: "Monday 8 June", name: "King's Birthday", kind: "statewide" },
        { date: "2026-09-25", source: "Friday 25 September", name: "Friday before the AFL Grand Final", kind: "statewide" },
        { date: "2026-11-03", source: "Tuesday 3 November", name: "Melbourne Cup", kind: "statewide", note: "Statewide unless a non-metropolitan council has arranged a local holiday instead — see below." },
        { date: "2026-12-25", source: "Friday 25 December", name: "Christmas Day", kind: "statewide" },
        { date: "2026-12-26", source: "Saturday 26 December", name: "Boxing Day", kind: "statewide" },
        { date: "2026-12-28", source: "Monday 28 December", name: "Additional holiday (Boxing Day)", kind: "additional", note: "Boxing Day falls on a Saturday." },
      ],
    },
    {
      year: 2027,
      holidays: [
        { date: "2027-01-01", source: "Friday 1 January", name: "New Year's Day", kind: "statewide" },
        { date: "2027-01-26", source: "Tuesday 26 January", name: "Australia Day", kind: "statewide" },
        { date: "2027-03-08", source: "Monday 8 March", name: "Labour Day", kind: "statewide" },
        { date: "2027-03-26", source: "Friday 26 March", name: "Good Friday", kind: "statewide" },
        { date: "2027-03-27", source: "Saturday 27 March", name: "Saturday before Easter Sunday", kind: "statewide" },
        { date: "2027-03-28", source: "Sunday 28 March", name: "Easter Sunday", kind: "statewide" },
        { date: "2027-03-29", source: "Monday 29 March", name: "Easter Monday", kind: "statewide" },
        { date: "2027-04-25", source: "Sunday 25 April", name: "Anzac Day", kind: "statewide", note: "No replacement holiday when Anzac Day falls on a weekend." },
        { date: "2027-06-14", source: "Monday 14 June", name: "King's Birthday", kind: "statewide" },
        { date: "2027-11-02", source: "Tuesday 2 November", name: "Melbourne Cup", kind: "statewide", note: "Statewide unless a non-metropolitan council has arranged a local holiday instead." },
        { date: "2027-12-25", source: "Saturday 25 December", name: "Christmas Day", kind: "statewide" },
        { date: "2027-12-26", source: "Sunday 26 December", name: "Boxing Day", kind: "statewide" },
        { date: "2027-12-27", source: "Monday 27 December", name: "Additional holiday (Christmas Day)", kind: "additional", note: "Christmas Day falls on a Saturday." },
        { date: "2027-12-28", source: "Tuesday 28 December", name: "Additional holiday (Boxing Day)", kind: "additional", note: "Boxing Day falls on a Sunday." },
      ],
      omitted: [
        {
          name: "Friday before the AFL Grand Final 2027",
          reason:
            "Business Victoria lists it as \"subject to AFL schedule\" and will publish the date once the 2027 AFL fixture is released. It is usually the last Friday in September, but we do not print a date until the government does.",
        },
      ],
    },
  ],
  regional: [
    {
      id: "melbourne-cup-replacements",
      title: "Regional Victoria: local holidays that replace Melbourne Cup Day (2026)",
      intro:
        "In these council areas the local holiday below is the public holiday instead of Melbourne Cup Day. If your job is based there, the public holiday rate applies on the local day, and Tuesday 3 November is an ordinary working day. Business Victoria adds councils during the year as they confirm their dates.",
      rows: [
        { name: "Warrnambool", area: "Warrnambool City Council", dates: [{ date: "2026-05-07", source: "Thursday 7 May" }] },
        { name: "Moyne", area: "Moyne Shire Council", dates: [{ date: "2026-05-07", source: "Thursday 7 May" }] },
        { name: "Mildura (part)", area: "Mildura Rural City — westerly from and including Boinka, south of Murray Sunset National Park", dates: [{ date: "2026-10-07", source: "Wednesday 7 October" }] },
        { name: "Warracknabeal (half day)", area: "Yarriambiack Shire — township of Warracknabeal and district", dates: [{ date: "2026-10-08", source: "Thursday 8 October" }], note: "Half-day holiday." },
        { name: "Rainbow district", area: "Hindmarsh Shire — Rainbow, Albacutya and Kenmare", dates: [{ date: "2026-10-13", source: "Tuesday 13 October" }] },
        { name: "Nhill district", area: "Hindmarsh Shire — Broughton, Yanac, Netherby, Lorquon, Nhill, Glenlee, Kiata, Gerang Gerung, Little Desert", dates: [{ date: "2026-10-15", source: "Thursday 15 October" }] },
        { name: "Geelong", area: "City of Greater Geelong", dates: [{ date: "2026-10-21", source: "Wednesday 21 October" }] },
        { name: "Numurkah", area: "Moira Shire — Numurkah District", dates: [{ date: "2026-10-21", source: "Wednesday 21 October" }] },
        { name: "Bendigo (west of the Campaspe)", area: "Greater Bendigo City Council — all areas west of the Campaspe River", dates: [{ date: "2026-10-28", source: "Wednesday 28 October" }] },
        { name: "Macedon Ranges (part)", area: "Macedon Ranges Shire — postcodes 3444, 3446, 3458, Cadello and Carlsruhe", dates: [{ date: "2026-11-04", source: "Wednesday 4 November" }] },
        { name: "Wodonga Gold Cup", area: "Wodonga City Council", dates: [{ date: "2026-11-27", source: "Friday 27 November" }] },
      ],
      footnote:
        "Only councils Business Victoria had listed by its 3 August 2026 update are shown. The 2027 list has not been published yet.",
      sourceTitle: "Victorian non-metropolitan public holidays 2026 (Business Victoria)",
      sourceUrl: "https://business.vic.gov.au/business-information/public-holidays/victorian-non-metropolitan-public-holidays-2026",
    },
  ],
  specifics: [
    {
      id: "grand-final-friday",
      heading: "AFL Grand Final Friday and Melbourne Cup Day pay",
      paragraphs: [
        "Both are full public holidays under Victoria's Public Holidays Act 1993, so award public holiday rates apply to every hour worked, and a full-time or part-time employee who normally works a Friday or Tuesday is paid for the day off. They are Victorian holidays only. A job based in Victoria gets them even if you're working interstate that day, and a job based interstate doesn't get them even if you're working in Melbourne.",
        "Grand Final Friday moves with the AFL fixture, which is why the 2027 date isn't published yet. Rosters for late September 2027 should be checked once Business Victoria lists it.",
      ],
    },
    {
      id: "anzac-weekend",
      heading: "No extra day when Anzac Day falls on a weekend",
      paragraphs: [
        "Business Victoria states that Anzac Day is commemorated on the day it falls, with no replacement holiday. In 2026 it is a Saturday and in 2027 a Sunday, so there is no Monday holiday in Victoria either year. That differs from NSW, WA and the ACT, which add a Monday holiday in both years. If you work the Saturday or Sunday, the public holiday rate applies.",
      ],
    },
    {
      id: "restricted-trading",
      heading: "Restricted trading days",
      paragraphs: [
        "Good Friday, Anzac Day and Christmas Day are restricted trading days in Victoria, when most larger shops must close. If you do work in a business that can open, the public holiday rate applies as normal. The restriction affects whether the shop opens, not what you are paid.",
      ],
    },
  ],
  calculatorPreset: { holidayName: "Melbourne Cup Day", awardKey: "hospitality", employment: "casual", hours: 6 },
  faqs: [
    {
      q: "When is the AFL Grand Final public holiday in 2027?",
      a: "Not yet announced. Business Victoria lists the Friday before the AFL Grand Final 2027 as subject to the AFL schedule and will publish the date once the fixture is released. It is usually the last Friday in September. In 2026 it is Friday 25 September.",
    },
    {
      q: "Is Melbourne Cup Day a public holiday everywhere in Victoria?",
      a: "Yes, unless a non-metropolitan council has arranged a local holiday instead. In 2026 that includes Geelong (Wednesday 21 October), Warrnambool and Moyne (Thursday 7 May) and Wodonga (Friday 27 November). In those areas the local day is the public holiday and Tuesday 3 November is an ordinary working day.",
    },
    {
      q: "Is there a public holiday on the Monday after Anzac Day in Victoria?",
      a: "No. Victoria observes Anzac Day on 25 April even when it falls on a weekend, with no replacement weekday. That applies in both 2026 (Saturday) and 2027 (Sunday).",
    },
  ],
};

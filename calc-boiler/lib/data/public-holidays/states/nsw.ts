import type { StatePublicHolidays } from "../types";

// Source: NSW Government "NSW public holidays" (industrialrelations.nsw.gov.au
// redirects here), table "NSW public holidays 2026 to 2027", read 24 Sep 2026.
// The page prints dates as "Monday 27 April 2026".

export const NSW_PUBLIC_HOLIDAYS: StatePublicHolidays = {
  slug: "nsw",
  code: "NSW",
  name: "New South Wales",
  inName: "in New South Wales",
  standfirst:
    "NSW has 13 state-wide public holidays in 2026 and 14 in 2027, gazetted under the Public Holidays Act 2010. It has no part-day holidays, but it adds a weekday holiday when New Year's Day, Christmas Day or Boxing Day lands on a weekend, and has declared an Additional Day for Anzac Day in both years. Each of those days is a public holiday for pay.",
  sources: [
    { title: "NSW public holidays 2026 to 2027", url: "https://www.nsw.gov.au/about-nsw/public-holidays", publisher: "NSW Government" },
    { title: "Local public holidays in NSW", url: "https://www.nsw.gov.au/about-nsw/public-holidays/local-public-holidays", publisher: "NSW Government" },
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
        { date: "2026-04-27", source: "Monday 27 April 2026", name: "Additional Day (Anzac Day)", kind: "additional", note: "Anzac Day falls on a Saturday." },
        { date: "2026-06-08", source: "Monday 8 June 2026", name: "King's Birthday", kind: "statewide" },
        { date: "2026-10-05", source: "Monday 5 October 2026", name: "Labour Day", kind: "statewide" },
        { date: "2026-12-25", source: "Friday 25 December 2026", name: "Christmas Day", kind: "statewide" },
        { date: "2026-12-26", source: "Saturday 26 December 2026", name: "Boxing Day", kind: "statewide" },
        { date: "2026-12-28", source: "Monday 28 December 2026", name: "Additional Day (Boxing Day)", kind: "additional", note: "Boxing Day falls on a Saturday." },
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
        { date: "2027-04-25", source: "Sunday 25 April 2027", name: "Anzac Day", kind: "statewide" },
        { date: "2027-04-26", source: "Monday 26 April 2027", name: "Additional Day (Anzac Day)", kind: "additional", note: "Anzac Day falls on a Sunday." },
        { date: "2027-06-14", source: "Monday 14 June 2027", name: "King's Birthday", kind: "statewide" },
        { date: "2027-10-04", source: "Monday 4 October 2027", name: "Labour Day", kind: "statewide" },
        { date: "2027-12-25", source: "Saturday 25 December 2027", name: "Christmas Day", kind: "statewide" },
        { date: "2027-12-26", source: "Sunday 26 December 2027", name: "Boxing Day", kind: "statewide" },
        { date: "2027-12-27", source: "Monday 27 December 2027", name: "Additional Day (Christmas Day)", kind: "additional", note: "Christmas Day falls on a Saturday." },
        { date: "2027-12-28", source: "Tuesday 28 December 2027", name: "Additional Day (Boxing Day)", kind: "additional", note: "Boxing Day falls on a Sunday." },
      ],
    },
  ],
  regional: [],
  specifics: [
    {
      id: "bank-holiday",
      heading: "The August Bank Holiday is not a public holiday",
      paragraphs: [
        "The first Monday in August (3 August 2026, 2 August 2027) is a Bank Holiday in NSW, not a declared public holiday. The NSW Government says so in terms: retail bank branches and some financial institutions must close, but for everyone else it is an ordinary working day and no public holiday rate applies.",
      ],
    },
    {
      id: "local-days",
      heading: "Local public holidays and local event days",
      paragraphs: [
        "Councils in regional NSW can apply for a local public holiday or a local event day, usually for an agricultural show or a race day. The difference matters for your pay. A local public holiday is a declared public holiday for work purposes in that area, so award public holiday rates can apply. A local event day is not a public holiday for work purposes, so it is an ordinary day.",
        "The NSW Government publishes the current list of both on its local public holidays page, linked in the sources below.",
      ],
    },
    {
      id: "additional-days",
      heading: "Additional days when a holiday falls on a weekend",
      paragraphs: [
        "When New Year's Day, Christmas Day or Boxing Day falls on a Saturday or Sunday, NSW adds a public holiday on the following Monday or Tuesday. When Australia Day falls on a weekend the holiday moves to the Monday instead. NSW also gazetted an Additional Day for Anzac Day in both 2026 (Monday 27 April) and 2027 (Monday 26 April), while still observing 25 April itself.",
        "If you work both the weekend day and the additional day, check your award: most pay the public holiday rate on each day that is a declared public holiday.",
      ],
    },
    {
      id: "lsl",
      heading: "Public holidays during long service leave",
      paragraphs: [
        "The NSW Government's guidance is that if a gazetted public holiday falls on a normal working day while you are on long service leave, an extra day is added to the leave. The long service leave calculator for NSW shows how much leave you have built up.",
      ],
    },
  ],
  calculatorPreset: { holidayName: "Labour Day", awardKey: "retail", employment: "permanent", hours: 8 },
  faqs: [
    {
      q: "Is the NSW Bank Holiday a public holiday?",
      a: "No. The first Monday in August is a Bank Holiday that closes retail bank branches and some financial institutions. The NSW Government states it is not a declared public holiday, so it is an ordinary working day for pay purposes.",
    },
    {
      q: "Do I get paid public holiday rates on a local event day in NSW?",
      a: "No. A local event day is not a public holiday for work purposes. A local public holiday is, so award public holiday rates can apply on a local public holiday in the area it is declared for.",
    },
  ],
};

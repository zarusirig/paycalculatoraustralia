import type { StatePublicHolidays } from "../types";

// Sources: Queensland Government "Public holidays" (last updated 16 Jan 2026)
// and "Show holiday dates" (2026 table), read 24 Sep 2026. The public
// holidays page prints "Monday 26 April"; the show page prints "27 March 2026".

export const QLD_PUBLIC_HOLIDAYS: StatePublicHolidays = {
  slug: "qld",
  code: "QLD",
  name: "Queensland",
  inName: "in Queensland",
  standfirst:
    "Queensland has 12 state-wide public holidays in 2026 and 13 in 2027. It also has a part-day public holiday on Christmas Eve from 6pm to midnight, and nearly 100 local show holidays, including the Ekka for Brisbane. Labour Day is in May and the King's Birthday in October, later than in most states.",
  sources: [
    { title: "Queensland public holidays", url: "https://www.qld.gov.au/recreation/travel/holidays/public", publisher: "Queensland Government" },
    { title: "Show holiday dates", url: "https://www.qld.gov.au/recreation/travel/holidays/show", publisher: "Queensland Government" },
  ],
  verifiedOn: "24 September 2026",
  years: [
    {
      year: 2026,
      holidays: [
        { date: "2026-01-01", source: "Thursday 1 January", name: "New Year's Day", kind: "statewide" },
        { date: "2026-01-26", source: "Monday 26 January", name: "Australia Day", kind: "statewide" },
        { date: "2026-04-03", source: "Friday 3 April", name: "Good Friday", kind: "statewide" },
        { date: "2026-04-04", source: "Saturday 4 April", name: "The day after Good Friday", kind: "statewide" },
        { date: "2026-04-05", source: "Sunday 5 April", name: "Easter Sunday", kind: "statewide" },
        { date: "2026-04-06", source: "Monday 6 April", name: "Easter Monday", kind: "statewide" },
        { date: "2026-04-25", source: "Saturday 25 April", name: "Anzac Day", kind: "statewide", note: "Moves to Monday only when 25 April is a Sunday." },
        { date: "2026-05-04", source: "Monday 4 May", name: "Labour Day", kind: "statewide" },
        { date: "2026-08-12", source: "Wednesday 12 August", name: "Royal Queensland Show (Ekka)", kind: "regional", note: "Brisbane area only. Other areas hold their own show holiday — see below." },
        { date: "2026-10-05", source: "Monday 5 October", name: "King's Birthday", kind: "statewide" },
        { date: "2026-12-24", source: "Thursday 24 December", name: "Christmas Eve", kind: "part-day", hours: "6pm to midnight" },
        { date: "2026-12-25", source: "Friday 25 December", name: "Christmas Day", kind: "statewide" },
        { date: "2026-12-26", source: "Saturday 26 December and Monday 28 December", name: "Boxing Day", kind: "statewide" },
        { date: "2026-12-28", source: "Saturday 26 December and Monday 28 December", name: "Additional holiday (Boxing Day)", kind: "additional", note: "Boxing Day falls on a Saturday." },
      ],
    },
    {
      year: 2027,
      holidays: [
        { date: "2027-01-01", source: "Friday 1 January", name: "New Year's Day", kind: "statewide" },
        { date: "2027-01-26", source: "Tuesday 26 January", name: "Australia Day", kind: "statewide" },
        { date: "2027-03-26", source: "Friday 26 March", name: "Good Friday", kind: "statewide" },
        { date: "2027-03-27", source: "Saturday 27 March", name: "The day after Good Friday", kind: "statewide" },
        { date: "2027-03-28", source: "Sunday 28 March", name: "Easter Sunday", kind: "statewide" },
        { date: "2027-03-29", source: "Monday 29 March", name: "Easter Monday", kind: "statewide" },
        { date: "2027-04-26", source: "Monday 26 April", name: "Anzac Day (observed)", kind: "statewide", note: "25 April 2027 is a Sunday, so the public holiday is the Monday." },
        { date: "2027-05-03", source: "Monday 3 May", name: "Labour Day", kind: "statewide" },
        { date: "2027-08-11", source: "Wednesday 11 August", name: "Royal Queensland Show (Ekka)", kind: "regional", note: "Brisbane area only." },
        { date: "2027-10-04", source: "Monday 4 October", name: "King's Birthday", kind: "statewide" },
        { date: "2027-12-24", source: "Friday 24 December", name: "Christmas Eve", kind: "part-day", hours: "6pm to midnight" },
        { date: "2027-12-25", source: "Saturday 25 December and Monday 27 December", name: "Christmas Day", kind: "statewide" },
        { date: "2027-12-26", source: "Sunday 26 December and Tuesday 28 December", name: "Boxing Day", kind: "statewide" },
        { date: "2027-12-27", source: "Saturday 25 December and Monday 27 December", name: "Additional holiday (Christmas Day)", kind: "additional", note: "Christmas Day falls on a Saturday." },
        { date: "2027-12-28", source: "Sunday 26 December and Tuesday 28 December", name: "Additional holiday (Boxing Day)", kind: "additional", note: "Boxing Day falls on a Sunday." },
      ],
      omitted: [
        {
          name: "Local show holidays 2027",
          reason:
            "The Queensland Government appoints show holidays each year and had published only the 2026 list when this page was checked. Only the Brisbane Ekka date for 2027 is on the public holidays page.",
        },
      ],
    },
  ],
  regional: [
    {
      id: "show-holidays",
      title: "Queensland show holidays 2026 — main centres",
      intro:
        "A show holiday is a public holiday only in the district it is appointed for. If your job is based in that district, public holiday rates apply that day. Elsewhere it is an ordinary working day. The Queensland Government's 2026 list has 97 entries, and these are the main population centres. Check the official list for smaller districts and exact boundaries.",
      rows: [
        { name: "Toowoomba Royal Show", area: "Toowoomba Regional Council, excluding Yarraman, Upper Yarraman and Cooyar", dates: [{ date: "2026-03-27", source: "27 March 2026" }] },
        { name: "Ipswich Show", area: "City of Ipswich", dates: [{ date: "2026-05-15", source: "15 May 2026" }] },
        { name: "Fraser Coast Show", area: "Fraser Coast region", dates: [{ date: "2026-05-22", source: "22 May 2026" }] },
        { name: "Bundaberg Show", area: "Bundaberg region — postcodes 4660, 4670 and 4673", dates: [{ date: "2026-05-28", source: "28 May 2026" }] },
        { name: "Maleny Show", area: "Sunshine Coast — former Caloundra City Council area", dates: [{ date: "2026-05-29", source: "29 May 2026" }] },
        { name: "Rockhampton Show", area: "Rockhampton region", dates: [{ date: "2026-06-11", source: "11 June 2026" }] },
        { name: "Sunshine Coast Show", area: "Sunshine Coast — former Maroochy Shire area", dates: [{ date: "2026-06-12", source: "12 June 2026" }] },
        { name: "Mackay Show", area: "Mackay region", dates: [{ date: "2026-06-18", source: "18 June 2026" }] },
        { name: "Mount Isa Show", area: "City of Mount Isa", dates: [{ date: "2026-06-19", source: "19 June 2026" }] },
        { name: "Townsville Show", area: "City of Townsville", dates: [{ date: "2026-07-06", source: "6 July 2026" }] },
        { name: "Cairns Show", area: "Cairns region", dates: [{ date: "2026-07-17", source: "17 July 2026" }] },
        {
          name: "Royal Queensland Show (outside Brisbane)",
          area: "Logan, Moreton Bay, Redland, Gladstone, Scenic Rim, Lockyer Valley and Somerset",
          dates: [{ date: "2026-08-10", source: "10 August 2026" }],
          note: "These councils take the Ekka holiday on the Monday, not the Brisbane Wednesday.",
        },
        { name: "Royal Queensland Show (Ekka)", area: "City of Brisbane", dates: [{ date: "2026-08-12", source: "12 August 2026" }] },
        { name: "Gold Coast Show", area: "City of Gold Coast", dates: [{ date: "2026-08-28", source: "28 August 2026" }] },
        { name: "Noosa Show", area: "Shire of Noosa", dates: [{ date: "2026-09-11", source: "11 September 2026" }] },
      ],
      footnote: "The 2027 show holiday list has not been published yet.",
      sourceTitle: "Show holiday dates (Queensland Government)",
      sourceUrl: "https://www.qld.gov.au/recreation/travel/holidays/show",
    },
  ],
  specifics: [
    {
      id: "christmas-eve",
      heading: "Christmas Eve: public holiday rates from 6pm",
      paragraphs: [
        "Since 2019 the Holidays Act 1983 has made Christmas Eve a part-day public holiday from 6pm to midnight. Hours before 6pm are ordinary hours at the usual weekday or weekend rate. Hours from 6pm are paid at the public holiday rate. A 2pm to 10pm retail shift on Thursday 24 December 2026 is 4 hours at the usual Thursday rates and 4 hours at the public holiday rate.",
        "Queensland's window starts at 6pm, an hour earlier than the Christmas Eve part-day holidays in South Australia and the Northern Territory.",
      ],
    },
    {
      id: "ekka",
      heading: "The Ekka and local show holidays",
      paragraphs: [
        "The Royal Queensland Show holiday, the Ekka, is a Brisbane-area public holiday on the Wednesday of show week: 12 August 2026 and 11 August 2027. In 2026 several councils around Brisbane, including Logan, Moreton Bay and Redland, took the same show holiday on Monday 10 August instead. The rest of the state has its own local show day, appointed district by district.",
        "Your entitlement follows where your job is based. A Brisbane-based employee working in Toowoomba on Ekka Wednesday is still on the Brisbane public holiday.",
      ],
    },
    {
      id: "anzac-rule",
      heading: "When Anzac Day moves to Monday",
      paragraphs: [
        "Queensland moves Anzac Day to the following Monday only when 25 April is a Sunday. In 2026 it falls on a Saturday, so Saturday 25 April is the public holiday and there is no Monday holiday. In 2027 it falls on a Sunday, so Monday 26 April is the public holiday.",
      ],
    },
  ],
  calculatorPreset: { holidayName: "Christmas Eve (from 6pm)", awardKey: "retail", employment: "casual", hours: 4 },
  faqs: [
    {
      q: "Is Christmas Eve a public holiday in Queensland?",
      a: "Partly. Christmas Eve is a public holiday from 6pm to midnight. Hours worked before 6pm are paid at the ordinary rate for that day, and hours from 6pm at the public holiday rate.",
    },
    {
      q: "Is the Ekka a public holiday for all of Queensland?",
      a: "No. The Royal Queensland Show holiday on Wednesday 12 August 2026 applies to the City of Brisbane. Logan, Moreton Bay, Redland and several other councils took it on Monday 10 August 2026, and the rest of Queensland has its own local show holidays on other dates.",
    },
    {
      q: "Is there a public holiday on Monday 27 April 2026 in Queensland?",
      a: "No. Queensland only moves Anzac Day to the Monday when 25 April is a Sunday. In 2026 it falls on a Saturday, so the Saturday itself is the public holiday. In 2027 the public holiday is Monday 26 April.",
    },
  ],
};

import type { StatePublicHolidays } from "../types";

// Source: WorkSafe Tasmania "Public holidays" (Statutory Holidays Act 2000;
// last updated 23 Jan 2026), read 24 Sep 2026. Tables 1 and 2 print dates
// without a weekday ("28 December"), so weekdays here are computed and the
// tests check day and month against the source.

export const TAS_PUBLIC_HOLIDAYS: StatePublicHolidays = {
  slug: "tas",
  code: "TAS",
  name: "Tasmania",
  inName: "in Tasmania",
  standfirst:
    "Tasmania has 9 state-wide public holidays in 2026 and 9 in 2027, the fewest of any state, plus a long list of regional holidays. Everyone gets either Royal Hobart Regatta in February or Recreation Day in November, depending on where they work. WorkSafe Tasmania warns that a day being listed does not by itself mean you get it off or get paid more. That comes from your award, agreement and the National Employment Standards.",
  sources: [
    { title: "Public holidays", url: "https://worksafe.tas.gov.au/topics/laws-and-compliance/public-holidays", publisher: "WorkSafe Tasmania" },
  ],
  verifiedOn: "24 September 2026",
  years: [
    {
      year: 2026,
      holidays: [
        { date: "2026-01-01", source: "1 January", name: "New Year's Day", kind: "statewide" },
        { date: "2026-01-26", source: "26 January", name: "Australia Day", kind: "statewide" },
        { date: "2026-03-09", source: "9 March", name: "Eight Hours Day", kind: "statewide" },
        { date: "2026-04-03", source: "3 April", name: "Good Friday", kind: "statewide" },
        { date: "2026-04-06", source: "6 April", name: "Easter Monday", kind: "statewide" },
        { date: "2026-04-07", source: "7 April", name: "Easter Tuesday", kind: "limited", note: "Generally Tasmanian Public Service only." },
        { date: "2026-04-25", source: "25 April", name: "Anzac Day", kind: "statewide", note: "No substitute or additional day when it falls on a weekend." },
        { date: "2026-06-08", source: "8 June", name: "King's Birthday", kind: "statewide" },
        { date: "2026-12-25", source: "25 December", name: "Christmas Day", kind: "statewide" },
        {
          date: "2026-12-28",
          source: "28 December",
          name: "Boxing Day (observed)",
          kind: "statewide",
          note: "26 December is a Saturday, so the Monday is the public holiday. Saturday 26 December is not.",
        },
      ],
    },
    {
      year: 2027,
      holidays: [
        { date: "2027-01-01", source: "1 January", name: "New Year's Day", kind: "statewide" },
        { date: "2027-01-26", source: "26 January", name: "Australia Day", kind: "statewide" },
        { date: "2027-03-08", source: "8 March", name: "Eight Hours Day", kind: "statewide" },
        { date: "2027-03-26", source: "26 March", name: "Good Friday", kind: "statewide" },
        { date: "2027-03-29", source: "29 March", name: "Easter Monday", kind: "statewide" },
        { date: "2027-03-30", source: "30 March", name: "Easter Tuesday", kind: "limited", note: "Generally Tasmanian Public Service only." },
        { date: "2027-04-25", source: "25 April", name: "Anzac Day", kind: "statewide", note: "No substitute or additional day when it falls on a weekend." },
        { date: "2027-06-14", source: "14 June", name: "King's Birthday", kind: "statewide" },
        {
          date: "2027-12-27",
          source: "27 December",
          name: "Christmas Day (observed)",
          kind: "statewide",
          note: "25 December is a Saturday. WorkSafe Tasmania's table lists Monday 27 December; its substitute-holiday rules say that when 25 December is a Saturday, both the Saturday and the following Monday are holidays.",
        },
        { date: "2027-12-28", source: "28 December", name: "Boxing Day (observed)", kind: "statewide", note: "26 December is a Sunday, so the Tuesday is the public holiday." },
      ],
    },
  ],
  regional: [
    {
      id: "regional",
      title: "Tasmanian regional public holidays 2026 and 2027",
      intro:
        "These holidays apply only in the areas listed. If your job is based there, award public holiday rates apply that day. Elsewhere it is an ordinary working day. Two are marked as generally observed by the Tasmanian State Service only, so most private sector employees work them at ordinary rates unless their award or agreement says otherwise.",
      rows: [
        {
          name: "Devonport Cup (half day)",
          area: "Municipal area of Devonport",
          note: "Generally Tasmanian State Service only.",
          dates: [
            { date: "2026-01-07", source: "7 January" },
            { date: "2027-01-06", source: "6 January" },
          ],
        },
        {
          name: "Royal Hobart Regatta",
          area: "South of and including Oatlands and Swansea, excluding Bronte Park, Catagunya, Strathgordon, Tarraleah, Wayatinah and the West Coast",
          dates: [
            { date: "2026-02-09", source: "9 February" },
            { date: "2027-02-08", source: "8 February" },
          ],
        },
        {
          name: "Launceston Cup",
          area: "Northern municipalities including Launceston, Meander Valley, West Tamar and Dorset (from 11am in Launceston city and listed suburbs)",
          note: "Generally Tasmanian Public Service only.",
          dates: [
            { date: "2026-02-25", source: "25 February" },
            { date: "2027-02-24", source: "24 February" },
          ],
        },
        {
          name: "King Island Show",
          area: "King Island only",
          dates: [
            { date: "2026-03-03", source: "3 March" },
            { date: "2027-03-02", source: "2 March" },
          ],
        },
        {
          name: "Agfest",
          area: "Municipal area of Circular Head only",
          dates: [
            { date: "2026-05-08", source: "8 May" },
            { date: "2027-05-07", source: "7 May" },
          ],
        },
        {
          name: "Burnie Show",
          area: "Burnie, Waratah-Wynyard and West Coast",
          dates: [
            { date: "2026-10-02", source: "2 October" },
            { date: "2027-10-01", source: "1 October" },
          ],
        },
        {
          name: "Royal Launceston Show",
          area: "Break O'Day, Dorset, George Town, Launceston, Meander Valley, Northern Midlands, West Tamar",
          dates: [
            { date: "2026-10-08", source: "8 October" },
            { date: "2027-10-07", source: "7 October" },
          ],
        },
        {
          name: "Flinders Island Show",
          area: "Municipal area of Flinders Island",
          dates: [
            { date: "2026-10-16", source: "16 October" },
            { date: "2027-10-15", source: "15 October" },
          ],
        },
        {
          name: "Royal Hobart Show",
          area: "South of and including Oatlands and Swansea, plus Bronte Park, Strathgordon, Tarraleah and Wayatinah; excludes the West Coast",
          dates: [
            { date: "2026-10-22", source: "22 October" },
            { date: "2027-10-21", source: "21 October" },
          ],
        },
        {
          name: "Recreation Day",
          area: "All parts of the state that do not observe Royal Hobart Regatta",
          dates: [
            { date: "2026-11-02", source: "2 November" },
            { date: "2027-11-01", source: "1 November" },
          ],
        },
        {
          name: "Devonport Show",
          area: "Devonport, Kentish and Latrobe",
          dates: [
            { date: "2026-11-27", source: "27 November" },
            { date: "2027-11-26", source: "26 November" },
          ],
        },
      ],
      sourceTitle: "Public holidays — Table 2: Regional holidays (WorkSafe Tasmania)",
      sourceUrl: "https://worksafe.tas.gov.au/topics/laws-and-compliance/public-holidays",
    },
  ],
  specifics: [
    {
      id: "check-award",
      heading: "A listed holiday is not automatically extra pay",
      paragraphs: [
        "WorkSafe Tasmania's own advice is that listing a day as a public holiday does not automatically mean employees can have the day off or get paid more. Your award, agreement and the National Employment Standards decide that. For national system employees, the NES and the award rates on this page apply on every day that is a public holiday where your job is based.",
        "The practical question is usually a regional one. A Hobart-based employee gets Regatta Day and the Royal Hobart Show, and works Recreation Day at ordinary rates. A Launceston-based employee gets Recreation Day and the Royal Launceston Show, and works Regatta Day at ordinary rates.",
      ],
    },
    {
      id: "weekend-rules",
      heading: "Weekend Christmas and Boxing Day in Tasmania",
      paragraphs: [
        "Tasmania handles weekend holidays differently from the mainland. When Boxing Day falls on a Saturday, the Monday is the public holiday, and WorkSafe Tasmania does not list the Saturday. So in 2026 a Saturday 26 December shift is paid at ordinary Saturday rates, and Monday 28 December is the public holiday. When Boxing Day falls on a Sunday, the Tuesday is the holiday.",
        "When Christmas Day falls on a Saturday, as in 2027, WorkSafe Tasmania's rules say both the Saturday and the following Monday are holidays, and when it falls on a Sunday, both the Sunday and the following Tuesday. Anzac Day gets no substitute when it falls on a weekend.",
      ],
    },
    {
      id: "easter",
      heading: "Easter: no Saturday or Sunday holiday",
      paragraphs: [
        "Tasmania's Easter public holidays are Good Friday and Easter Monday. Easter Saturday and Easter Sunday are not public holidays in Tasmania, so they are paid at weekend rates. Easter Tuesday is listed, but WorkSafe Tasmania notes it is generally observed by the Tasmanian Public Service only.",
      ],
    },
  ],
  calculatorPreset: { holidayName: "Boxing Day (Monday 28 December 2026)", awardKey: "aged-care", employment: "permanent", hours: 8 },
  faqs: [
    {
      q: "Is Saturday 26 December 2026 a public holiday in Tasmania?",
      a: "No. When Boxing Day falls on a Saturday, Tasmania moves the public holiday to the Monday, so Monday 28 December 2026 is the public holiday and a Saturday 26 December shift is paid at ordinary Saturday rates.",
    },
    {
      q: "Do I get Regatta Day or Recreation Day?",
      a: "It depends on where your job is based. Royal Hobart Regatta (9 February 2026, 8 February 2027) applies in the south, and Recreation Day (2 November 2026, 1 November 2027) applies in every part of the state that doesn't observe Regatta.",
    },
    {
      q: "Is Easter Tuesday a public holiday in Tasmania?",
      a: "It is listed, but WorkSafe Tasmania says it is generally observed by the Tasmanian Public Service only. Most private sector employees work it at ordinary rates unless their award or agreement treats it as a holiday.",
    },
  ],
};

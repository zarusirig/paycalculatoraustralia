import type { StatePublicHolidays } from "../types";

// Sources: WA Government "Public holidays in Western Australia" (last updated
// 2 Sep 2026) and the Private Sector Labour Relations pages for state system
// employees (last updated 3–4 Sep 2026), read 24 Sep 2026. The WA table prints
// paired days as "Saturday 25 April & Monday 27 April".

export const WA_PUBLIC_HOLIDAYS: StatePublicHolidays = {
  slug: "wa",
  code: "WA",
  name: "Western Australia",
  inName: "in Western Australia",
  standfirst:
    "Western Australia has 13 state-wide public holidays in 2026 and 14 in 2027. Easter Saturday is not one of them, and WA holds Labour Day in March, WA Day in June and the King's Birthday in late September. Karratha and Port Hedland take the King's Birthday in August instead. WA also runs its own state industrial relations system alongside the national one.",
  sources: [
    {
      title: "Public holidays in Western Australia",
      url: "https://www.wa.gov.au/service/employment/workplace-arrangements/public-holidays-western-australia",
      publisher: "Government of Western Australia",
    },
    {
      title: "Public holiday pay and entitlements for state system employees",
      url: "https://www.wa.gov.au/organisation/private-sector-labour-relations/public-holiday-pay-and-entitlements-state-system-employees",
      publisher: "Government of Western Australia (Wageline)",
    },
    {
      title: "Entitlement to be paid when absent on a public holiday",
      url: "https://www.wa.gov.au/organisation/private-sector-labour-relations/entitlement-be-paid-when-absent-public-holiday",
      publisher: "Government of Western Australia (Wageline)",
    },
    {
      title: "WA award provisions for Easter Saturday",
      url: "https://www.wa.gov.au/organisation/private-sector-labour-relations/wa-award-provisions-easter-saturday",
      publisher: "Government of Western Australia (Wageline)",
    },
    {
      title: "Which system of employment law applies",
      url: "https://www.wa.gov.au/organisation/private-sector-labour-relations/which-system-of-employment-law-applies",
      publisher: "Government of Western Australia (Wageline)",
    },
  ],
  verifiedOn: "24 September 2026",
  years: [
    {
      year: 2026,
      holidays: [
        { date: "2026-01-01", source: "Thursday 1 January", name: "New Year's Day", kind: "statewide" },
        { date: "2026-01-26", source: "Monday 26 January", name: "Australia Day", kind: "statewide" },
        { date: "2026-03-02", source: "Monday 2 March", name: "Labour Day", kind: "statewide" },
        { date: "2026-04-03", source: "Friday 3 April", name: "Good Friday", kind: "statewide" },
        { date: "2026-04-05", source: "Sunday 5 April", name: "Easter Sunday", kind: "statewide" },
        { date: "2026-04-06", source: "Monday 6 April", name: "Easter Monday", kind: "statewide" },
        { date: "2026-04-25", source: "Saturday 25 April & Monday 27 April", name: "Anzac Day", kind: "statewide" },
        { date: "2026-04-27", source: "Saturday 25 April & Monday 27 April", name: "Additional holiday (Anzac Day)", kind: "additional", note: "Anzac Day falls on a Saturday." },
        { date: "2026-06-01", source: "Monday 1 June", name: "Western Australia Day", kind: "statewide" },
        { date: "2026-09-28", source: "Monday 28 September", name: "King's Birthday", kind: "statewide", note: "Not in Karratha or Port Hedland, which observe it on Monday 3 August." },
        { date: "2026-12-25", source: "Friday 25 December", name: "Christmas Day", kind: "statewide" },
        { date: "2026-12-26", source: "Saturday 26 December & Monday 28 December", name: "Boxing Day", kind: "statewide" },
        { date: "2026-12-28", source: "Saturday 26 December & Monday 28 December", name: "Additional holiday (Boxing Day)", kind: "additional", note: "Boxing Day falls on a Saturday." },
      ],
    },
    {
      year: 2027,
      holidays: [
        { date: "2027-01-01", source: "Friday 1 January", name: "New Year's Day", kind: "statewide" },
        { date: "2027-01-26", source: "Tuesday 26 January", name: "Australia Day", kind: "statewide" },
        { date: "2027-03-01", source: "Monday 1 March", name: "Labour Day", kind: "statewide" },
        { date: "2027-03-26", source: "Friday 26 March", name: "Good Friday", kind: "statewide" },
        { date: "2027-03-28", source: "Sunday 28 March", name: "Easter Sunday", kind: "statewide" },
        { date: "2027-03-29", source: "Monday 29 March", name: "Easter Monday", kind: "statewide" },
        { date: "2027-04-25", source: "Sunday 25 April & Monday 26 April", name: "Anzac Day", kind: "statewide" },
        { date: "2027-04-26", source: "Sunday 25 April & Monday 26 April", name: "Additional holiday (Anzac Day)", kind: "additional", note: "Anzac Day falls on a Sunday." },
        { date: "2027-06-07", source: "Monday 7 June", name: "Western Australia Day", kind: "statewide" },
        { date: "2027-09-27", source: "Monday 27 September", name: "King's Birthday", kind: "statewide" },
        { date: "2027-12-25", source: "Saturday 25 December & Monday 27 December", name: "Christmas Day", kind: "statewide" },
        { date: "2027-12-26", source: "Sunday 26 December & Tuesday 28 December", name: "Boxing Day", kind: "statewide" },
        { date: "2027-12-27", source: "Saturday 25 December & Monday 27 December", name: "Additional holiday (Christmas Day)", kind: "additional", note: "Christmas Day falls on a Saturday." },
        { date: "2027-12-28", source: "Sunday 26 December & Tuesday 28 December", name: "Additional holiday (Boxing Day)", kind: "additional", note: "Boxing Day falls on a Sunday." },
      ],
      omitted: [
        {
          name: "Regional King's Birthday 2027 (Karratha, Port Hedland)",
          reason:
            "The WA Government lists regional King's Birthday dates for 2026 only. In past years both towns have held it on the first or second Monday in August, but the 2027 dates are not published yet.",
        },
      ],
    },
  ],
  regional: [
    {
      id: "regional-kings-birthday",
      title: "Regional King's Birthday public holiday 2026",
      intro:
        "In these two Pilbara districts the King's Birthday public holiday is held on this date instead of the date used in the rest of WA. Monday 28 September 2026 is not a public holiday there, so it is paid as an ordinary day.",
      rows: [
        { name: "King's Birthday (regional)", area: "City of Karratha", dates: [{ date: "2026-08-03", source: "Monday 3 August" }] },
        { name: "King's Birthday (regional)", area: "Town of Port Hedland", dates: [{ date: "2026-08-03", source: "Monday 3 August" }] },
      ],
      footnote: "The 2027 regional dates have not been published yet.",
      sourceTitle: "Public holidays in Western Australia (WA Government)",
      sourceUrl: "https://www.wa.gov.au/service/employment/workplace-arrangements/public-holidays-western-australia",
    },
  ],
  specifics: [
    {
      id: "state-system",
      heading: "State system or national system: which rules pay you",
      paragraphs: [
        "WA has two employment systems for the private sector. Pty Ltd companies are in the national Fair Work system, and the National Employment Standards and modern awards on this page apply to them. Sole traders, unincorporated partnerships and trusts without a Pty Ltd trustee, some not-for-profit associations, household employers, WA local governments and most state public sector agencies are in the WA state system instead.",
        "In the state system, a full-time or part-time employee who is absent because of a public holiday is paid as if they had worked their ordinary hours, at the higher of the WA award, industrial agreement or contract rate. That does not apply to casuals, to employees who would not ordinarily work that day, or to employees on unpaid leave. The WA Government's example is a part-timer who works 9am to 2pm on Mondays and is paid those 5 hours for a Monday public holiday.",
        "If you work a public holiday in the state system, the rate comes from your WA award or agreement. Award-free state system employees have no minimum entitlement to a higher rate under the Minimum Conditions of Employment Act. They are paid their normal rate unless the contract says otherwise. Wageline (1300 655 266) answers state system pay questions.",
      ],
    },
    {
      id: "easter-saturday",
      heading: "Easter Saturday is not a public holiday in WA",
      paragraphs: [
        "WA does not gazette Easter Saturday, so under the national system it is paid as an ordinary Saturday. Some WA state awards treat it differently. The WA Government lists the Aboriginal Communities and Organisations, Crisis Assistance and Supported Housing, Social and Community Services, Local Government Officers, Municipal Employees and Retail Pharmacists awards as treating Easter Saturday as a public holiday. The Shop and Warehouse, Building Trades (Construction), Clerks (Wholesale and Retail) and Hair and Beauty (WA) awards pay a higher rate that day without making it a public holiday.",
      ],
    },
    {
      id: "weekend-rules",
      heading: "Weekend holidays get an extra Monday, including Anzac Day",
      paragraphs: [
        "When New Year's Day, Anzac Day or Christmas Day falls on a weekend, the following Monday is also a public holiday in WA, and both days count. Boxing Day on a Saturday adds the Monday. Boxing Day on a Sunday or Monday adds the Tuesday. Australia Day on a weekend moves to the Monday instead. In 2026 that gives WA Monday 27 April for Anzac Day and Monday 28 December for Boxing Day.",
        "The WA Government has published proposed changes to the public holiday schedule (its public holiday review) and says the 2028 dates will be published once confirmed.",
      ],
    },
  ],
  calculatorPreset: { holidayName: "WA Day", awardKey: "fast-food", employment: "casual", hours: 5 },
  faqs: [
    {
      q: "Is Easter Saturday a public holiday in WA?",
      a: "No. Western Australia does not gazette Easter Saturday, so national system employees are paid ordinary Saturday rates. A handful of WA state awards treat it as a public holiday or pay a higher rate that day.",
    },
    {
      q: "Do Karratha and Port Hedland get the King's Birthday public holiday?",
      a: "Yes, but on a different date. In 2026 both hold it on Monday 3 August instead of Monday 28 September, and the September date is an ordinary working day there. The 2027 regional dates have not been published.",
    },
    {
      q: "I work for a sole trader in WA. Do the Fair Work public holiday rules apply to me?",
      a: "Probably not. Sole traders, partnerships and trusts without a company trustee are generally in the WA state system. There, a full-time or part-time employee absent on a public holiday is paid for their ordinary hours, and the rate for working it comes from the WA award or agreement. Call Wageline on 1300 655 266 if you're unsure which system covers you.",
    },
  ],
};

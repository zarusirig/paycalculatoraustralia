import type { StatePublicHolidays } from "../types";

// Source: ACT Government "Public holidays, school terms and daylight saving"
// (act.gov.au — the old cmtedd.act.gov.au holidays page now redirects here),
// read 24 Sep 2026. Paired days are printed "Saturday 25 and Monday 27 April".

export const ACT_PUBLIC_HOLIDAYS: StatePublicHolidays = {
  slug: "act",
  code: "ACT",
  name: "Australian Capital Territory",
  inName: "in the ACT",
  standfirst:
    "The ACT has 15 public holidays in 2026 and 16 in 2027, more than NSW around it. Two are Territory-only: Canberra Day in March and Reconciliation Day in late May or early June. When Anzac Day, Christmas Day or Boxing Day lands on a weekend, the ACT keeps the weekend day and adds a weekday, and both are public holidays for pay.",
  sources: [
    {
      title: "Public holidays, school terms and daylight saving",
      url: "https://www.act.gov.au/living-in-the-act/public-holidays-school-terms-and-daylight-saving",
      publisher: "ACT Government",
    },
    { title: "Holidays Act 1958 (ACT)", url: "https://www.legislation.act.gov.au/a/1958-19", publisher: "ACT Legislation Register" },
  ],
  verifiedOn: "24 September 2026",
  years: [
    {
      year: 2026,
      holidays: [
        { date: "2026-01-01", source: "Thursday 1 January", name: "New Year's Day", kind: "statewide" },
        { date: "2026-01-26", source: "Monday 26 January", name: "Australia Day", kind: "statewide" },
        { date: "2026-03-09", source: "Monday 9 March", name: "Canberra Day", kind: "statewide" },
        { date: "2026-04-03", source: "Friday 3 April", name: "Good Friday", kind: "statewide" },
        { date: "2026-04-04", source: "Saturday 4 April", name: "Easter Saturday", kind: "statewide" },
        { date: "2026-04-05", source: "Sunday 5 April", name: "Easter Sunday", kind: "statewide" },
        { date: "2026-04-06", source: "Monday 6 April", name: "Easter Monday", kind: "statewide" },
        { date: "2026-04-25", source: "Saturday 25 and Monday 27 April", name: "Anzac Day", kind: "statewide" },
        { date: "2026-04-27", source: "Saturday 25 and Monday 27 April", name: "Additional holiday (Anzac Day)", kind: "additional", note: "Anzac Day falls on a Saturday." },
        { date: "2026-06-01", source: "Monday 1 June", name: "Reconciliation Day", kind: "statewide" },
        { date: "2026-06-08", source: "Monday 8 June", name: "King's Birthday", kind: "statewide" },
        { date: "2026-10-05", source: "Monday 5 October", name: "Labour Day", kind: "statewide" },
        { date: "2026-12-25", source: "Friday 25 December", name: "Christmas Day", kind: "statewide" },
        { date: "2026-12-26", source: "Saturday 26 and Monday 28 December", name: "Boxing Day", kind: "statewide" },
        { date: "2026-12-28", source: "Saturday 26 and Monday 28 December", name: "Additional holiday (Boxing Day)", kind: "additional", note: "Boxing Day falls on a Saturday." },
      ],
    },
    {
      year: 2027,
      holidays: [
        { date: "2027-01-01", source: "Friday 1 January", name: "New Year's Day", kind: "statewide" },
        { date: "2027-01-26", source: "Tuesday 26 January", name: "Australia Day", kind: "statewide" },
        { date: "2027-03-08", source: "Monday 8 March", name: "Canberra Day", kind: "statewide" },
        { date: "2027-03-26", source: "Friday 26 March", name: "Good Friday", kind: "statewide" },
        { date: "2027-03-27", source: "Saturday 27 March", name: "Easter Saturday", kind: "statewide" },
        { date: "2027-03-28", source: "Sunday 28 March", name: "Easter Sunday", kind: "statewide" },
        { date: "2027-03-29", source: "Monday 29 March", name: "Easter Monday", kind: "statewide" },
        { date: "2027-04-25", source: "Sunday 25 and Monday 26 April", name: "Anzac Day", kind: "statewide" },
        { date: "2027-04-26", source: "Sunday 25 and Monday 26 April", name: "Additional holiday (Anzac Day)", kind: "additional", note: "Anzac Day falls on a Sunday." },
        { date: "2027-05-31", source: "Monday 31 May", name: "Reconciliation Day", kind: "statewide" },
        { date: "2027-06-14", source: "Monday 14 June", name: "King's Birthday", kind: "statewide" },
        { date: "2027-10-04", source: "Monday 4 October", name: "Labour Day", kind: "statewide" },
        { date: "2027-12-25", source: "Saturday 25 and Monday 27 December", name: "Christmas Day", kind: "statewide" },
        { date: "2027-12-26", source: "Sunday 26 and Tuesday 28 December", name: "Boxing Day", kind: "statewide" },
        { date: "2027-12-27", source: "Saturday 25 and Monday 27 December", name: "Additional holiday (Christmas Day)", kind: "additional", note: "Christmas Day falls on a Saturday." },
        { date: "2027-12-28", source: "Sunday 26 and Tuesday 28 December", name: "Additional holiday (Boxing Day)", kind: "additional", note: "Boxing Day falls on a Sunday." },
      ],
    },
  ],
  regional: [],
  specifics: [
    {
      id: "territory-days",
      heading: "Canberra Day and Reconciliation Day",
      paragraphs: [
        "Canberra Day (Monday 9 March 2026, Monday 8 March 2027) and Reconciliation Day (Monday 1 June 2026, Monday 31 May 2027) are ACT public holidays only. If your job is based in the ACT, award public holiday rates apply to every hour you work on them, and a full-time or part-time employee who normally works a Monday is paid for the day off. A job based in NSW doesn't get them, even for work done in Canberra that day.",
      ],
    },
    {
      id: "cross-border",
      heading: "Living in NSW, working in Canberra",
      paragraphs: [
        "Public holiday entitlements follow where your job is based, not where you live. Someone who lives in Queanbeyan and works for a Canberra-based employer gets the ACT holidays, including Canberra Day and Reconciliation Day. Someone who lives in Canberra but works from a NSW base gets the NSW list. It pays to check which calendar your roster was built on, especially around the two ACT-only Mondays.",
      ],
    },
    {
      id: "bank-holiday",
      heading: "The August bank holiday",
      paragraphs: [
        "The Holidays Act 1958 also sets a bank holiday on the first Monday in August. The ACT Government notes that bank holidays do not apply to everyone, so for most employees it is an ordinary working day. Check your award or enterprise agreement if you work in banking or finance.",
      ],
    },
  ],
  calculatorPreset: { holidayName: "Canberra Day", awardKey: "clerks", employment: "permanent", hours: 7.6 },
  faqs: [
    {
      q: "When is Reconciliation Day in the ACT?",
      a: "Monday 1 June 2026 and Monday 31 May 2027. It is an ACT-only public holiday, so ACT-based employees who work it are paid public holiday rates under their award.",
    },
    {
      q: "Is there a public holiday on Monday 27 April 2026 in the ACT?",
      a: "Yes. Anzac Day falls on Saturday 25 April 2026, and the ACT Government lists both Saturday 25 and Monday 27 April as public holidays. In 2027 it is Sunday 25 and Monday 26 April.",
    },
    {
      q: "Is the August bank holiday a public holiday in the ACT?",
      a: "Not for most employees. The Holidays Act 1958 sets a bank holiday on the first Monday in August, but the ACT Government notes bank holidays do not apply to everyone. Check your award or agreement.",
    },
  ],
};

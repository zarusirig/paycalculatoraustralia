// Virgin Australia — cabin crew and cabin managers employed by Virgin
// Australia Airlines Pty Ltd.
//
// Instrument: Virgin Australia Cabin Crew Agreement 2023 (EA6), AG2024/723,
// AE523884, approved 19 March 2024 (Dean DP, PR772515), operative 26 March
// 2024, nominal expiry 31 August 2026 (still operating; FWC approved list to
// 21 Sep 2026 shows no replacement). Covers Virgin Australia employees working
// as Cabin Crew or Cabin Manager, not cabin crew management (cl 1.2, 1.3).
// Virgin Australia Regional Airlines crew have their own agreement (AE525417).
// Read from the FWC PDF on 24 September 2026.
//
// Salaries: Schedule A Part 1, "from first full pay period on or after
// 1 November 2025" — the last step. ⚠️ FORMULA for CC1, CC2 and SC1: the
// "Cabin Crew Award Increase Protection" note makes their Nov 2025 rise "the
// greater of either 3% (as shown in the table) or the percentage amount of the
// minimum increase to the Award as determined by the FWC under the preceding
// Annual Wage Review Decision, to a maximum increase of 4%". The 2025 AWR was
// 3.5%, so those three are Nov 2024 x 1.035 (CC1 54,344 → $56,246.04, not the
// printed $55,974). Other levels: printed Nov 2025 salaries.
//
// Hourly: the agreement's own "Base Hourly Rate" = full-time base salary / 52 /
// 36 (definitions, cl 1) — full-time week 36 hours (fullTimeWeeklyHours). The
// printed hourly table only goes to Nov 2024 (CC1 $29.03 = 54,344 / 1,872), so
// the Nov 2025 hourly rates are our arithmetic. Casuals: CC Base Hourly Rate +
// 25% (cl 2.12.4) = CC1 $30.05 x 1.25 = $37.56; no casual rate at other levels.
//
// AWARD FLOOR: Aircraft Cabin Crew Award cl 14.2 from 1 July 2026: $1,097.40 a
// week full time ($57,064.80 a year), $28.88 an hour. CC1 = $1,081.65 a week —
// below the award's full-time weekly rate (s 206 notice); every hourly rate is
// above $28.88.

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/AE523884.pdf";
const AWARD_URL = "https://awards.fairwork.gov.au/MA000047.html";

const halfUp = (v: number) => Math.round(Number((v * 100).toFixed(6))) / 100;

/** Salary → row with the agreement's Base Hourly Rate (salary / 52 / 36). */
function row(level: string, description: string, annualSalary: number, casual = false) {
  const hourly = halfUp(annualSalary / 1872);
  return casual
    ? { level, description, annualSalary, hourly, casualHourly: halfUp(hourly * 1.25) }
    : { level, description, annualSalary, hourly, casualHourly: 0, noCasual: true };
}

export const VIRGIN_AUSTRALIA_PAY: EmployerPay = {
  slug: "virgin-australia",
  name: "Virgin Australia",
  employerEntity: "Virgin Australia Airlines Pty Ltd",
  industry: "cabin crew",
  instrument: {
    kind: "enterprise-agreement",
    title: "Virgin Australia Cabin Crew Agreement 2023 (EA6)",
    reference: "AG2024/723, AE523884",
    url: EA_URL,
    approvedOn: "19 March 2024 (PR772515), operating from 26 March 2024",
    nominalExpiry: "31 August 2026",
    coverage:
      "It covers Virgin Australia Airlines employees working as Cabin Crew or Cabin Managers, but not cabin crew management. Virgin Australia Regional Airlines cabin crew have a separate agreement. The agreement passed its nominal expiry date on 31 August 2026 and keeps applying until a new one replaces it.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 November 2025",
  nextIncrease: null,
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  fullTimeWeeklyHours: 36,
  payBasisNote:
    "Virgin Australia pays cabin crew an annual base salary for a 36-hour week. The hourly figures are the agreement's Base Hourly Rate — full-time salary ÷ 52 ÷ 36 — calculated by us from the November 2025 salaries, because the agreement's printed hourly table stops at November 2024. Each level's salary is in its description.",
  rates: [
    row("Cabin Crew 1 (CC1)", "New cabin crew start here: $56,246.04 a year ($1,081.65 a week) — the 2024 salary plus the 3.5% award-protected rise", 56246.04, true),
    row("Cabin Crew 2 (CC2)", "$58,409.19 a year — the 2024 salary plus the 3.5% award-protected rise", 58409.19),
    row("Senior Crew 1 (SC1)", "$60,572.34 a year — the 2024 salary plus the 3.5% award-protected rise", 60572.34),
    row("Senior Crew 2 (SC2)", "$65,664 a year", 65664),
    row("Senior Crew 3 (SC3)", "$69,995 a year", 69995),
    row("Senior Crew 4 (SC4)", "$72,162 a year", 72162),
    row("Cabin Manager 1 (CM1)", "Cabin manager without an ad hoc trainer, line check or CCTL qualification: $75,142 a year", 75142),
    row("Cabin Manager 2 (CM2)", "Cabin manager with an ad hoc trainer, line check or CCTL qualification: $84,955 a year", 84955),
  ],
  casualRateNote:
    "Casual cabin crew are paid the Cabin Crew Base Hourly Rate plus a 25% casual loading (cl 2.12.4): about $37.56 an hour at the CC1 rate. The agreement has no casual rate for Senior Crew or Cabin Managers, and the casual rate is reviewed each year to keep it at or above the Aircraft Cabin Crew Award.",
  juniorScale: [],
  juniorNote: "",
  penalties: [
    { when: "Weekends and public holidays (ordinary hours)", permanent: "Included in base salary", casual: "Base Hourly Rate + 25%", note: "The full-time salary already pays for weekend and public holiday work (cl 3.1.1)" },
    { when: "Each of the 10 listed public holidays you complete a duty on", permanent: "+$85 (Cabin Manager +$115)", casual: "Not confirmed", note: "New Year's Day, Australia Day, Good Friday, Easter Sunday and Monday, Anzac Day, Christmas, Boxing Day, Labour Day, King's Birthday (Schedule A Part 4)" },
    { when: "Working a designated day off", permanent: "+$300 (Cabin Manager +$350)", casual: "—" },
    { when: "Rest break not given (cl 3.5)", permanent: "$13.37 (CC1 to SC1), up to $18.39 (CM2)", casual: "—" },
  ],
  penaltyNotes: [
    "Virgin cabin crew have no percentage weekend or evening penalty: the base salary covers weekends and public holidays, and the agreement adds fixed payments instead (Schedule A Parts 3 to 5, from 1 November 2025).",
    "A Daily Travel Allowance is paid for every hour from sign-on to sign-off at home base: $8.49 an hour for a single-day duty and $7.48 for a multi-day trip (from 1 November 2025).",
    "Overtime is paid on top of the Base Hourly Rate; the agreement's overtime clause does not apply to casuals (cl 2.12.4).",
  ],
  overtime: [
    { when: "Domestic or short haul international: over 9 hours, up to 11", permanent: "+50% (time and a half)", casual: "—" },
    { when: "Domestic or short haul international: over 11 hours", permanent: "+100% (double time)", casual: "—" },
    { when: "Long haul international: over 16 hours", permanent: "+100% (double time)", casual: "—" },
    { when: "Roster period: over 140 hours, up to 144", permanent: "+50%", casual: "—" },
    { when: "Roster period: over 144 hours, or over 1,872 hours a calendar year", permanent: "+100%", casual: "—" },
  ],
  notices: [
    "From 1 July 2026 the Aircraft Cabin Crew Award sets a minimum of $1,097.40 a week ($57,064.80 a year) for a full-time cabin crew member. The Cabin Crew 1 salary ($56,246.04, or $1,081.65 a week) is lower. Every level's hourly rate is above the award's $28.88 — the weekly figure is lower because the agreement's full-time week is 36 hours, not 38. An agreement's base rate can't be below the award's base rate for the same work (Fair Work Act s 206); if you think your pay falls short, check with the Fair Work Ombudsman or your union.",
    "The CC1, CC2 and SC1 salaries rose by 3.5% in November 2025, not the 3% printed in the table: the agreement guarantees those levels the Annual Wage Review percentage when it is higher, up to 4%, and the 2025 review gave 3.5%. The figures here apply that rule; your payslip may differ by a cent.",
    "The agreement reached its nominal expiry date on 31 August 2026 and prints no rise after November 2025. Any further increase depends on a new agreement.",
  ],
  unverified: [
    "Virgin Australia's actual payroll figures for CC1, CC2 and SC1 after the award-protection rule — our calculation, not published by Virgin.",
    "Whether casual crew receive the public holiday payment — the agreement's casual clause does not say clearly.",
    "Virgin Australia Regional Airlines cabin crew pay (separate agreement AE525417) and cabin crew management pay.",
  ],
  sources: [
    { title: "Virgin Australia Cabin Crew Agreement 2023 (EA6) (AE523884), with approval decision PR772515", publisher: "Fair Work Commission", url: EA_URL },
    { title: "Aircraft Cabin Crew Award 2020 (MA000047), cl 14.2 minimum rates from 1 July 2026", publisher: "Fair Work Commission", url: AWARD_URL },
    { title: "List of agreements approved from 1 January to 21 September 2026 (no replacement Virgin cabin crew agreement)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/agreements/resources/agreements2026.xlsx" },
  ],
  faqs: [
    {
      q: "How much do Virgin Australia cabin crew earn in 2026?",
      a: "New Virgin Australia cabin crew (Cabin Crew 1) earn $56,246.04 a year from November 2025, about $30.05 an hour. Senior Crew earn $60,572.34 to $72,162, and Cabin Managers $75,142 or $84,955. Allowances such as the Daily Travel Allowance are extra.",
    },
    {
      q: "What is the Virgin Australia cabin crew hourly rate?",
      a: "The agreement's Base Hourly Rate is the full-time salary divided by 52 weeks and 36 hours: about $30.05 for Cabin Crew 1, rising to $45.38 for Cabin Manager 2. Casual cabin crew get the Cabin Crew rate plus 25%, about $37.56 an hour.",
    },
    {
      q: "What agreement covers Virgin Australia cabin crew?",
      a: "The Virgin Australia Cabin Crew Agreement 2023 (EA6), AE523884. It started on 26 March 2024 and reached its nominal expiry date on 31 August 2026, but it keeps applying until a new agreement is approved.",
    },
    {
      q: "Is Virgin cabin crew pay below the award?",
      a: "Hourly rates are above the Aircraft Cabin Crew Award's $28.88, but the Cabin Crew 1 salary of $1,081.65 a week is below the award's full-time minimum of $1,097.40 a week from 1 July 2026. The gap comes from the shorter 36-hour full-time week, not a lower hourly rate. If you think your pay falls short of the award, check with the Fair Work Ombudsman or your union.",
    },
    {
      q: "Do Virgin cabin crew get public holiday pay?",
      a: "The base salary already covers working weekends and public holidays. On top of that, crew who complete a duty on one of 10 listed public holidays get $85 ($115 for Cabin Managers).",
    },
  ],
};

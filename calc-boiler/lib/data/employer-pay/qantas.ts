// Qantas — flight attendants and Customer Service Managers employed by Qantas
// Airways Limited on domestic (short haul) routes.
//
// Instrument: Flight Attendants' Association of Australia – Short Haul Division
// (Qantas Airways Limited) Enterprise Agreement 10, AG2023/978, AE519994,
// approved 11 May 2023 (Ryan C, PR761830), operative 18 May 2023, nominal
// expiry 31 December 2026. Binds flight attendants "employed by Qantas Airways
// Limited and primarily engaged on domestic routes" (cl 4.1.4). Read from the
// FWC PDF on 24 September 2026.
//
// NOT COVERED (separate agreements, different pay — not transcribed):
//   long haul (FAAA, Qantas and QF Cabin Crew Australia EBA11, AE515514,
//   nominal expiry 29 Mar 2026, varied Dec 2024); Qantas Domestic Pty Ltd
//   (AE520009); QantasLink (Eastern AE522246, Sunstate AE519186, National Jet
//   AE523991 / AE521682); Jetstar (AE520498, AE520327, AE523161).
//
// Every salary is PRINTED: Part G cl 1 (flight attendants) and cl 3 (CSMs),
// "$ per week" column from the first full pay period commencing on or after
// 1 January 2026 — the last step in the agreement. Casual: Part G cl 2.2 prints
// $47.29 an hour (First Year rate + 25% loading + 10% + grooming and
// miscellaneous expense reimbursement, cl 18.2); no casual CSM rate.
//
// ⚠️ THE HOURLY FIGURES ARE OUR ARITHMETIC. The agreement's own hourly
// ("Incentive Pay/Single Time") rate is "the annual salary by 129 divided by
// 13" (cl 12.18) = annual / 1,677 hours. We take the annual salary as the
// weekly rate x 52, so hourly = weekly x 52 / 1,677, and the full-time week is
// 1,677 / 52 = 32.25 hours (fullTimeWeeklyHours) so weekly / 32.25 = hourly.
//
// AWARD FLOOR: Aircraft Cabin Crew Award 2020 (MA000047) cl 14.2 from 1 July
// 2026 (PR799327): cabin crew member $1,097.40 a week / $28.88 an hour. The
// printed 2026 salaries for years 1–3 ($1,038.39) and year 4 ($1,072.28) are
// below the award's full-time weekly rate — s 206 notice on the page.

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae519994.pdf";
const AWARD_URL = "https://awards.fairwork.gov.au/MA000047.html";

/** Printed Part G weekly salary → the row, with our hourly (weekly x 52 / 1,677). */
function row(level: string, description: string, weekly: number, casualHourly = 0) {
  const annualSalary = Math.round(weekly * 52 * 100) / 100;
  const hourly = Math.round(Number(((weekly * 52) / 1677 * 100).toFixed(6))) / 100;
  return casualHourly
    ? { level, description, weekly, annualSalary, hourly, casualHourly }
    : { level, description, weekly, annualSalary, hourly, casualHourly: 0, noCasual: true };
}

export const QANTAS_PAY: EmployerPay = {
  slug: "qantas",
  name: "Qantas",
  employerEntity: "Qantas Airways Limited",
  industry: "short haul cabin crew",
  instrument: {
    kind: "enterprise-agreement",
    title: "Flight Attendants' Association of Australia – Short Haul Division (Qantas Airways Limited) Enterprise Agreement 10",
    reference: "AG2023/978, AE519994",
    url: EA_URL,
    approvedOn: "11 May 2023 (PR761830), operating from 18 May 2023",
    nominalExpiry: "31 December 2026",
    coverage:
      "It covers flight attendants and Customer Service Managers employed by Qantas Airways Limited and mainly working domestic routes. Qantas long haul crew, Qantas Domestic Pty Ltd crew, QantasLink and Jetstar cabin crew are on separate agreements with different pay, which this page does not show.",
  },
  ratesEffectiveFrom: "the first full pay period commencing on or after 1 January 2026",
  nextIncrease: null,
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  fullTimeWeeklyHours: 32.25,
  payBasisNote:
    "Qantas pays short haul cabin crew a weekly salary, which rises with each year of service. The hourly figures are the agreement's single-time rate — the annual salary divided by 1,677 hours (cl 12.18) — worked out by us from the printed weekly salary × 52, so treat them as close, not exact. Each level's weekly and annual salary is in its description.",
  rates: [
    row("Flight Attendant — first to third year", "$1,038.39 a week ($53,996.28 a year) — the same salary applies during initial training and in years 1, 2 and 3", 1038.39, 47.29),
    row("Fourth Year Flight Attendant", "$1,072.28 a week ($55,758.56 a year)", 1072.28),
    row("Fifth Year Flight Attendant", "$1,111.89 a week ($57,818.28 a year)", 1111.89),
    row("Sixth Year Flight Attendant", "$1,153.58 a week ($59,986.16 a year)", 1153.58),
    row("Seventh Year Flight Attendant", "$1,193.19 a week ($62,045.88 a year)", 1193.19),
    row("Eighth Year Flight Attendant", "$1,234.51 a week ($64,194.52 a year)", 1234.51),
    row("Ninth Year Flight Attendant", "$1,275.60 a week ($66,331.20 a year)", 1275.6),
    row("Tenth Year Flight Attendant", "$1,397.45 a week ($72,667.40 a year)", 1397.45),
    row("First Year Customer Service Manager", "Cabin manager: $1,653.66 a week ($85,990.32 a year)", 1653.66),
    row("Second Year Customer Service Manager", "$1,725.43 a week ($89,722.36 a year)", 1725.43),
    row("Third Year Customer Service Manager", "$1,905.18 a week ($99,069.36 a year)", 1905.18),
    row("Fourth Year Customer Service Manager", "$1,962.33 a week ($102,041.16 a year)", 1962.33),
  ],
  casualRateNote:
    "Casual flight attendants are paid one printed rate, $47.29 an hour from 1 January 2026 (Part G cl 2.2). It is based on the First Year salary and adds the 25% casual loading plus a further 10% and the grooming and miscellaneous expense reimbursements (cl 18.2), so it is not simply base + 25%. Casuals get the other allowances and penalties but not bands payments. The agreement has no casual Customer Service Manager rate.",
  juniorScale: [],
  juniorNote: "",
  penalties: [
    { when: "Monday to Friday, 5:01am to 3pm", permanent: "Band 1: 1 point ($3.03)", casual: "No bands payments", note: "Bands payments are points × $3.03 for flight attendants, $3.35 for CSMs (Part G, from 1 Jan 2026)" },
    { when: "Monday to Thursday, 3:01pm to 10pm; Friday 3:01pm to 7pm", permanent: "Band 3: 5 points ($15.15)", casual: "No bands payments" },
    { when: "Monday to Friday, midnight to 5am; Monday to Thursday after 10pm", permanent: "Band 4: 6 points ($18.18)", casual: "No bands payments" },
    { when: "Friday 7:01pm to 10pm; Saturday, Sunday and public holidays 5:01am to 7pm", permanent: "Band 5: 7 points ($21.21)", casual: "No bands payments" },
    { when: "Friday after 10pm; Saturday, Sunday and public holidays 7:01pm to 5am", permanent: "Band 6: 9 points ($27.27)", casual: "No bands payments" },
    { when: "Christmas Day, any time", permanent: "Band 7: 18 points ($54.54)", casual: "No bands payments" },
  ],
  penaltyNotes: [
    "Qantas short haul crew have no percentage weekend or evening penalty. Instead the agreement pays \"bands payments\" for unsociable hours, weekends and public holidays: each band has a point value, multiplied by $3.03 for a flight attendant ($3.35 for a CSM) from 1 January 2026 (cl 44, Part G). The agreement lists these amounts \"per instance\"; how instances are counted on a roster is not spelled out in the pages we transcribed.",
    "A flight attendant who is not being paid bands payments while on duty gets a 10% loading on weekly salary instead of a shift penalty (cl 44.7).",
    "The same Part G table sets allowances from 1 January 2026, including a $370.17 monthly miscellaneous expense reimbursement, $25.91 a week cosmetic and hairdressing allowance, $13.89 hose and $17.93 shoe allowance a week, and route pay of $20.45 a day.",
  ],
  overtime: [
    { when: "Daily duty over 8 hours 30 minutes, up to 10 hours", permanent: "Time and a half", casual: "+$20.97 an hour" },
    { when: "Daily duty over 10 hours", permanent: "Double time", casual: "+$41.91 an hour" },
    { when: "Drafted to duty on a designated or substitute day off", permanent: "Double time, at least 8 hours", casual: "—", note: "cl 32.4; flights planned into a day off: double time, at least 4 hours (cl 32.2)" },
  ],
  notices: [
    "This page covers only Qantas Airways Limited's short haul (domestic) cabin crew agreement. If you fly long haul, or are employed by Qantas Domestic Pty Ltd, QantasLink or Jetstar, a different agreement sets your pay — check the agreement named on your payslip.",
    "From 1 July 2026 the Aircraft Cabin Crew Award sets a minimum of $1,097.40 a week ($28.88 an hour) for a full-time cabin crew member. The agreement's printed salaries for years 1 to 3 ($1,038.39) and year 4 ($1,072.28) are lower. The agreement's hourly rates are above the award's $28.88 because its full-time week is shorter than 38 hours. An agreement's base rate can't be below the award's base rate for the same work (Fair Work Act s 206); if you think your pay falls short, check with the Fair Work Ombudsman or your union.",
    "The agreement's last scheduled rise was on 1 January 2026, and it reaches its nominal expiry date on 31 December 2026. Any further rise depends on a new agreement.",
  ],
  unverified: [
    "Pay under Qantas's other cabin crew agreements — long haul (EBA11), Qantas Domestic Pty Ltd, QantasLink and Jetstar — not transcribed.",
    "How Qantas applies the award floor to the lower salary years in practice — not published.",
    "How bands-payment \"instances\" are counted on a roster.",
    "Whether the annual salary Qantas divides by 1,677 hours is exactly 52 weeks of the weekly rate — our hourly figures assume it is.",
  ],
  sources: [
    { title: "FAAA – Short Haul Division (Qantas Airways Limited) Enterprise Agreement 10 (AE519994), with approval decision PR761830", publisher: "Fair Work Commission", url: EA_URL },
    { title: "Aircraft Cabin Crew Award 2020 (MA000047), cl 14.2 minimum rates from 1 July 2026", publisher: "Fair Work Commission", url: AWARD_URL },
    { title: "List of agreements approved in 2023 (Qantas cabin crew agreements AE519994, AE520009)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/agreements/resources/agreements2023.xlsx" },
  ],
  faqs: [
    {
      q: "How much do Qantas cabin crew earn in 2026?",
      a: "Under Qantas's short haul cabin crew agreement, a flight attendant in their first three years is paid $1,038.39 a week ($53,996.28 a year) from 1 January 2026, rising each year to $1,397.45 a week ($72,667.40) in the tenth year. Customer Service Managers get $1,653.66 to $1,962.33 a week. Allowances and bands payments are extra.",
    },
    {
      q: "What is the Qantas cabin crew hourly rate?",
      a: "The agreement's single-time hourly rate is the annual salary divided by 1,677 hours: about $32.20 an hour for a first-to-third-year flight attendant. Casual flight attendants are paid a printed $47.29 an hour, which includes the casual loading and other components.",
    },
    {
      q: "Is Qantas cabin crew pay below the award?",
      a: "The Aircraft Cabin Crew Award's full-time minimum from 1 July 2026 is $1,097.40 a week. The agreement's printed salaries for years 1 to 4 ($1,038.39 and $1,072.28) are lower per week, but the agreement's hourly rates are above the award's $28.88 because its full-time week is shorter. Whether any crew member is underpaid depends on how the comparison is made for their hours — if you think you are, check with the Fair Work Ombudsman or your union.",
    },
    {
      q: "Does this apply to Qantas long haul, QantasLink or Jetstar crew?",
      a: "No. It covers flight attendants employed by Qantas Airways Limited on domestic routes. Long haul crew, Qantas Domestic Pty Ltd, QantasLink and Jetstar crew each have separate agreements with different pay.",
    },
    {
      q: "Do Qantas cabin crew get weekend penalty rates?",
      a: "Not as a percentage. The agreement pays bands payments for unsociable hours, weekends and public holidays: a point value times $3.03 for a flight attendant, from 1 point on a weekday daytime duty to 9 points late at night on weekends and 18 points on Christmas Day.",
    },
  ],
};

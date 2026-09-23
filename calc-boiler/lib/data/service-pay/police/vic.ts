// Victoria — Victoria Police salaries (sworn police officers).
//
// Source of every figure: Victoria Police (Police Officers, Protective Services
// Officers, Police Reservists and Police Recruits) Enterprise Agreement 2025,
// FWC agreement AE528554, approved by the Fair Work Commission on 4 April 2025
// (AG2025/651; operates 7 days after approval; nominal expiry 31 May 2028).
// Schedule A "Ordinary Rate of Pay Recruit to Commander" read in full on
// 24 September 2026.
//
// Schedule A prints four columns: 24-Jan-25, 1-Jun-25, 1-Jun-26 and 1-Jun-27.
// On 24 September 2026 the column IN FORCE is 1-Jun-26, which is what this file
// publishes; the 1-Jun-27 column is the next scheduled increase.
//
// IMPORTANT — what the Schedule A amount is: for Constables, Senior Constables,
// Sergeants and Senior Sergeants the agreement defines "Base Rate of Pay" as the
// Schedule A amount divided by 113%, because Schedule A includes a 13% commuted
// penalty allowance (clause 64.1) for liability to work weekends, public
// holidays and shifts. The agreement does not print the base rate as a dollar
// figure, so this file publishes the Schedule A amounts exactly as printed (the
// same figures Victoria Police quotes as salaries on its recruitment pages) and
// says so on every table. For Recruits, the Schedule A amount is the base rate.
//
// Cross-check: Victoria Police's "Police officer salary" page (updated 1 June
// 2026) quotes $61,187 for recruits, $84,060 for a Probationary Constable and
// $90,399 on progression to First Constable — the 1-Jun-26 Recruit, Constable 1
// and First Constable 3 amounts exactly.

import type { ServicePayJurisdiction } from "../types";

const COMMUTED =
  "Schedule A amounts include the 13% commuted penalty allowance (clause 64.1); the agreement's base rate of pay is the Schedule A amount divided by 113%.";

export const VIC_POLICE_PAY: ServicePayJurisdiction = {
  occupation: "police",
  slug: "vic",
  code: "VIC",
  name: "Victoria",
  nameInSentence: "Victoria",
  employer: "Victoria Police",
  agreementName:
    "Victoria Police (Police Officers, Protective Services Officers, Police Reservists and Police Recruits) Enterprise Agreement 2025",
  agreementUrl: "https://www.fwc.gov.au/documents/agreements/fwa/ae528554.pdf",
  ratesEffectiveFrom: "1 June 2026",
  nextIncrease: {
    date: "1 June 2027",
    detail:
      "The agreement's Schedule A already prints the 1 June 2027 rates. Constable 1 (Probationary Constable) rises to $86,582, Leading Senior Constable 16 to $129,787 and recruits to $63,023.",
  },
  verifiedOn: "24 September 2026",
  hubNote: "Includes a 13% commuted penalty allowance for weekend and shift liability.",

  scales: [
    {
      id: "constable-to-leading-senior-constable",
      title: "Constable to Leading Senior Constable (Schedule A, Levels 1–2)",
      intro: `Sworn police officers from Constable 1 (the Probationary Constable rate) to Leading Senior Constable 16, from 1 June 2026. ${COMMUTED}`,
      stepHeading: "Rank and pay point",
      steps: [
        { label: "Constable 1", salary: 84_060, note: "Probationary Constable rate after swearing-in" },
        { label: "Constable 2", salary: 87_229 },
        { label: "First Constable 3", salary: 90_399, note: "On progression to First Constable" },
        { label: "First Constable 4", salary: 93_568 },
        { label: "Senior Constable 5", salary: 102_648 },
        { label: "Senior Constable 6", salary: 104_681 },
        { label: "Senior Constable 7", salary: 106_261 },
        { label: "Senior Constable 8", salary: 108_638 },
        { label: "Senior Constable 9", salary: 111_018 },
        { label: "Senior Constable 10", salary: 113_326 },
        { label: "Senior Constable 11", salary: 116_136 },
        { label: "Senior Constable 12", salary: 118_945 },
        { label: "Leading Senior Constable 13", salary: 120_135 },
        { label: "Leading Senior Constable 14", salary: 121_337 },
        { label: "Leading Senior Constable 15", salary: 123_763 },
        { label: "Leading Senior Constable 16", salary: 126_007, note: "Top of the non-supervisory ranks" },
      ],
    },
    {
      id: "sergeant",
      title: "Sergeant (Schedule A, Level 3)",
      intro: `Sergeants, from 1 June 2026. ${COMMUTED}`,
      stepHeading: "Rank and pay point",
      steps: [
        { label: "Sergeant 1", salary: 137_812 },
        { label: "Sergeant 2", salary: 139_838 },
        { label: "Sergeant 3", salary: 141_863 },
        { label: "Sergeant 4", salary: 143_890 },
        { label: "Sergeant 5", salary: 145_914 },
        { label: "Sergeant 6", salary: 149_358 },
      ],
    },
    {
      id: "senior-sergeant",
      title: "Senior Sergeant (Schedule A, Level 4)",
      intro: `Senior sergeants, from 1 June 2026. ${COMMUTED}`,
      stepHeading: "Rank and pay point",
      steps: [
        { label: "Senior Sergeant 1", salary: 155_601 },
        { label: "Senior Sergeant 2", salary: 157_551 },
        { label: "Senior Sergeant 3", salary: 159_499 },
        { label: "Senior Sergeant 4", salary: 161_449 },
        { label: "Senior Sergeant 5", salary: 163_399 },
        { label: "Senior Sergeant 6", salary: 164_913 },
      ],
    },
    {
      id: "inspector",
      title: "Inspector (Schedule A, Level 5)",
      intro:
        "Inspectors, from 1 June 2026. For officers the agreement's base rate is the Schedule A amount divided by 116.4%, so these amounts are not base salary either.",
      stepHeading: "Rank and pay point",
      steps: [
        { label: "Inspector 1", salary: 170_644 },
        { label: "Inspector 2", salary: 174_058 },
        { label: "Inspector 3", salary: 177_539 },
        { label: "Inspector 4", salary: 181_093 },
        { label: "Inspector 5", salary: 184_714 },
        { label: "Inspector 6", salary: 189_475 },
      ],
    },
  ],
  entryStep: "Constable 1",
  topStep: "Leading Senior Constable 16",

  traineePay: [
    "Recruits are paid $61,187 a year under Schedule A from 1 June 2026, rising to $63,023 from 1 June 2027. Victoria Police says recruits are paid this from week 1 at the Academy.",
    "Victoria Police says recruits are sworn in as Probationary Constables at the end of week 12, moving to $84,060 (Constable 1), and progress to First Constable ($90,399) once the Diploma of Policing requirements are met.",
  ],
  penalties: [
    "Commuted penalty allowance (clause 64.1): the Schedule A rate for Constables to Senior Sergeants already includes 13% of base pay for liability to work weekends, public holidays and shifts. The shift allowances below are paid on top when that work is actually done.",
    "Shift allowances (clause 79.2), per rostered ordinary hour: 18.5% (unsociable, 6pm–1am Monday to Friday), 23.5% (intrusive, 1am–7am Monday to Friday), 39.36% (weekend, 7am–6pm), 45.22% (unsociable weekend, 6pm–1am) and 57.76% (intrusive weekend, 1am–7am), each on the ordinary hourly rate. Christmas Day, Boxing Day, New Year's Day and Australia Day are treated as weekend days.",
    "Excessive night work (clause 80): night work rostered on more than seven occasions in 28 days is paid at the overtime/recall rate of 1.5 for each hour.",
  ],
  notices: [
    "The agreement runs to a nominal expiry date of 31 May 2028. Its last scheduled rise is 1 June 2027.",
    "Every Schedule A figure for Constable to Senior Sergeant includes the 13% commuted penalty allowance. That makes Victoria's figures a different measure from states that publish a base salary with a separate loading (for example the 11.5% loading in NSW), so compare states with care.",
    "Constables, Senior Constables and Leading Senior Constables also receive an annual capability allowance under Schedule B. It is not included in the salaries above.",
  ],
  unverified: [
    "The agreement defines a base rate (Schedule A divided by 113%, or 116.4% for officers) but does not print it in dollars, so no separate base salary is shown here.",
    "Protective Services Officers, Police Reservists and specialist groups (forensic, legal) have their own Schedule A rows, which are not reproduced here.",
    "Schedule A column headings give dates (24-Jan-25, 1-Jun-25, 1-Jun-26, 1-Jun-27) without saying whether each rise applies from that exact date or from the first full pay period after it.",
  ],
  sources: [
    {
      title:
        "Victoria Police (Police Officers, Protective Services Officers, Police Reservists and Police Recruits) Enterprise Agreement 2025 (AE528554) — Schedule A",
      publisher: "Fair Work Commission",
      url: "https://www.fwc.gov.au/documents/agreements/fwa/ae528554.pdf",
    },
    {
      title: "List of agreements from 1 January 2025 to 31 December 2025 (AE528554 — dated 11 April 2025, nominal expiry 31 May 2028)",
      publisher: "Fair Work Commission",
      url: "https://www.fwc.gov.au/documents/agreements/resources/agreements2025.xlsx",
    },
    {
      title: "Police officer salary, leave, benefits, and hours",
      publisher: "Victoria Police",
      url: "https://www.police.vic.gov.au/salary-and-benefits",
    },
  ],
  faqs: [
    {
      q: "How much does a police officer earn in Victoria?",
      a: "From 1 June 2026 the Victoria Police enterprise agreement pays a Probationary Constable (Constable 1) $84,060 and a Leading Senior Constable at the top pay point (16) $126,007. These Schedule A amounts include a 13% commuted penalty allowance for weekend, public holiday and shift liability.",
    },
    {
      q: "What do police recruits get paid in Victoria?",
      a: "Recruits are paid $61,187 a year from 1 June 2026, from week 1 at the Academy. After being sworn in as a Probationary Constable at the end of week 12, pay moves to $84,060.",
    },
    {
      q: "How much does a senior constable earn in Victoria?",
      a: "A Senior Constable is paid $102,648 at pay point 5 rising to $118,945 at pay point 12 from 1 June 2026. Leading Senior Constables are paid $120,135 to $126,007.",
    },
    {
      q: "When is the next Victoria Police pay rise?",
      a: "The agreement already sets rates from 1 June 2027: $86,582 for Constable 1, $129,787 for Leading Senior Constable 16 and $63,023 for recruits.",
    },
  ],
};

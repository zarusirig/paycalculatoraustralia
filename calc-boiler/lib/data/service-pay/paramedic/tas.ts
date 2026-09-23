// Tasmania — Ambulance Tasmania paramedic salaries.
//
// Source of every figure: Ambulance Tasmania Industrial Agreement 2025, filed
// with the Tasmanian Industrial Commission under s 55 of the Industrial
// Relations Act 1984 (T15376 of 2026, [2026] TASIC 47, Commissioner Abey,
// reasons issued 11 August 2026). The agreement has an effective commencement
// date of 1 July 2025 and remains in force until 30 June 2028. It replaces the
// Ambulance Tasmania Industrial Agreement 2022. Read in full on
// 24 September 2026 from the redacted agreement published by the TIC.
//
// Clause 7.1: salaries rise 3% from the first full pay period commencing on or
// after (ffppcooa) 1 December 2025, 3% from ffppcooa 1 December 2026 and 2.75%
// from ffppcooa 1 September 2027, plus a $700 a year structural adjustment into
// base salary on 1 December 2025 and 1 December 2026. Some classifications
// (including Intensive Care Paramedic) get a relativity-based adjustment in
// place of the 1 December 2025 3% (clause 7.2).
//
// Schedule 1 Table 1 prints ANNUAL salaries, ending in the column "Base salary
// effective ffppcooa date of registration of this Agreement", which is what
// this file publishes. The companion award variation ([2026] TASIC 46) gives
// the registration date as 6 August 2026. Table 2 prints the 1 December 2026
// and 1 September 2027 rates.
//
// Superseded source NOT used: the Tasmanian Department of Health "Ambulance
// salary rates" page still showed 8 December 2024 rates when read.

import type { ServicePayJurisdiction } from "../types";

export const TAS_PARAMEDIC_PAY: ServicePayJurisdiction = {
  occupation: "paramedic",
  slug: "tas",
  code: "TAS",
  name: "Tasmania",
  nameInSentence: "Tasmania",
  employer: "Ambulance Tasmania",
  agreementName: "Ambulance Tasmania Industrial Agreement 2025",
  agreementUrl:
    "https://www.tic.tas.gov.au/__data/assets/pdf_file/0010/929305/Ambulance-Tasmania-Industrial-Agreement-2025-Redacted.pdf",
  ratesEffectiveFrom: "1 December 2025",
  nextIncrease: {
    date: "1 December 2026",
    detail:
      "A $700 structural adjustment plus 3% from the first full pay period commencing on or after 1 December 2026, printed in Schedule 1 Table 2: Paramedic Intern 01 goes to $81,855, Paramedic Level 2 (P2) 01 to $90,225, P2 07 to $105,186 and Intensive Care Paramedic 05 to $118,188. A further 2.75% follows from 1 September 2027.",
  },
  verifiedOn: "24 September 2026",

  entryStep: "Paramedic Intern 01",
  topStep: "Paramedic Level 2 (P2) 07",

  scales: [
    {
      id: "paramedics",
      title: "Paramedic Intern and Paramedic Level 2 (Schedule 1, Table 1)",
      intro:
        "Graduate interns and qualified Paramedics. Under the 2025 agreement, existing Paramedic 01-07 translate to Paramedic Level 2 (P2) 01-07 at the same increment. Annual base salary.",
      stepHeading: "Classification",
      steps: [
        { label: "Paramedic Intern 01", salary: 78_771 },
        { label: "Paramedic Level 2 (P2) 01", salary: 86_897 },
        { label: "Paramedic Level 2 (P2) 02", salary: 89_445 },
        { label: "Paramedic Level 2 (P2) 03", salary: 92_000 },
        { label: "Paramedic Level 2 (P2) 04", salary: 94_550 },
        { label: "Paramedic Level 2 (P2) 05", salary: 97_896 },
        { label: "Paramedic Level 2 (P2) 06", salary: 100_448 },
        { label: "Paramedic Level 2 (P2) 07", salary: 101_422, note: "Top of the Paramedic scale" },
      ],
    },
    {
      id: "specialist",
      title: "Intensive care, extended care and critical care flight paramedics (Schedule 1, Table 1)",
      intro:
        "Former Intensive Care Paramedic 03-07 translate to Intensive Care Paramedic 01-05 (the old ICP 01 and 02 were removed). Flight Paramedics translate to Critical Care Flight Paramedic (Fixed Wing or Rotary Wing).",
      stepHeading: "Classification",
      steps: [
        { label: "Intensive Care Paramedic 01", salary: 104_898 },
        { label: "Intensive Care Paramedic 02", salary: 107_374 },
        { label: "Intensive Care Paramedic 03", salary: 110_623 },
        { label: "Intensive Care Paramedic 04", salary: 113_100 },
        { label: "Intensive Care Paramedic 05", salary: 114_046 },
        { label: "Extended Care Paramedic, 01", salary: 119_240 },
        { label: "Extended Care Paramedic, 02", salary: 120_414 },
        { label: "Critical Care Flight Paramedic - Fixed Wing / Rotary Wing, 01", salary: 119_553 },
        { label: "Critical Care Flight Paramedic - Fixed Wing / Rotary Wing, 02", salary: 120_731 },
      ],
    },
    {
      id: "station-officers",
      title: "Branch Station Officers and Clinical Support Officers (Schedule 1, Table 1)",
      intro:
        "Branch Station Officer Level 1 replaces Branch Station Officer; Level 2 replaces Branch Station Officer - Intensive Care Paramedic.",
      stepHeading: "Classification",
      steps: [
        { label: "Branch Station Officer Level 1 (BSO-1), Year 1", salary: 103_903 },
        { label: "Branch Station Officer Level 1 (BSO-1), Year 2", salary: 108_157 },
        { label: "Branch Station Officer Level 1 (BSO-1), Year 3", salary: 109_221 },
        { label: "Branch Station Officer Level 2 (BSO-2), Year 1", salary: 119_553 },
        { label: "Branch Station Officer Level 2 (BSO-2), Year 2", salary: 122_147 },
        { label: "Branch Station Officer Level 2 (BSO-2), Year 3", salary: 123_352 },
        { label: "Clinical Support Officer, 01", salary: 123_017 },
        { label: "Clinical Support Officer, 02", salary: 123_880 },
        { label: "Clinical Support Officer, 03", salary: 124_747 },
        { label: "Clinical Support Officer, 04", salary: 125_975 },
      ],
    },
  ],

  traineePay: [
    "A Paramedic Intern 01 is paid $78,771 a year under the Ambulance Tasmania Industrial Agreement 2025, rising to $81,855 from the first full pay period commencing on or after 1 December 2026.",
    "Student Paramedics are paid $66,411 (Student Paramedic 01), $70,736 (02) and $76,764 (03) a year.",
    "Qualified paramedics start at Paramedic Level 2 (P2) 01 on $86,897 a year.",
  ],

  penalties: [
    "Remote area allowance: 8% of base salary at Miena, Queenstown, Strahan, Zeehan and King Island (clause 13.2).",
    "Rural area allowance: 4% of base salary at listed rural sites including Beaconsfield, Bicheno, Deloraine, George Town and Oatlands (clause 13.3).",
    "Annual leave loading for day workers is 17.5% (clause 11.1). Shift and weekend penalties are set by the Ambulance Tasmania Award and are not summarised here.",
  ],

  notices: [
    "The Ambulance Tasmania Industrial Agreement 2025 was approved in August 2026 with an effective commencement date of 1 July 2025. Its first increase is backdated to the first full pay period commencing on or after 1 December 2025, so affected staff should receive back pay.",
    "The revised classification structure (Paramedic Level 2, new ICP increments, BSO-1/BSO-2) applies from the first full pay period commencing on or after the agreement's registration date.",
    "The Department of Health's online ambulance salary page still showed rates effective 8 December 2024 when checked; those figures are out of date.",
  ],

  unverified: [
    "Shift, weekend and public holiday penalty rates come from the Ambulance Tasmania Award, which was not read for this page.",
    "New roles (Mental Health Emergency Response Paramedic, Primary Care Paramedic, Secondary Triage Paramedic), educators, managers and communications staff are in Schedule 1 but are not reproduced here.",
  ],

  sources: [
    {
      title: "Ambulance Tasmania Industrial Agreement 2025 (redacted)",
      publisher: "Tasmanian Industrial Commission",
      url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0010/929305/Ambulance-Tasmania-Industrial-Agreement-2025-Redacted.pdf",
    },
    {
      title: "Filing of the Ambulance Tasmania Industrial Agreement 2025 [2026] TASIC 47 (T15376 of 2026)",
      publisher: "Tasmanian Industrial Commission",
      url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0006/929094/2026-TASIC-47-T15376-of-2026-Filing-of-the-Ambulance-Tasmania-Industrial-Agreement-2025.pdf",
    },
    {
      title: "Variation of the Ambulance Tasmania Award [2026] TASIC 46 (T15375 of 2026)",
      publisher: "Tasmanian Industrial Commission",
      url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0003/929091/2025-TASIC-46-T15375-of-2026-Variation-of-Ambulance-Tasmania-Award.pdf",
    },
  ],

  faqs: [
    {
      q: "How much does a paramedic earn in Tasmania?",
      a: "Under the Ambulance Tasmania Industrial Agreement 2025, a qualified paramedic (Paramedic Level 2) earns $86,897 to $101,422 a year in base salary. Shift and weekend penalties are paid on top under the Ambulance Tasmania Award.",
    },
    {
      q: "What does a graduate paramedic earn in Tasmania?",
      a: "A Paramedic Intern 01 with Ambulance Tasmania is paid $78,771 a year, rising to $81,855 from the first full pay period commencing on or after 1 December 2026.",
    },
    {
      q: "How much does an intensive care paramedic earn in Tasmania?",
      a: "An Intensive Care Paramedic is paid $104,898 (ICP 01) to $114,046 (ICP 05) a year. Extended Care Paramedics are paid $119,240 to $120,414, and Critical Care Flight Paramedics $119,553 to $120,731.",
    },
    {
      q: "When is the next Ambulance Tasmania pay rise?",
      a: "A $700 structural adjustment plus 3% applies from the first full pay period commencing on or after 1 December 2026, then 2.75% from 1 September 2027.",
    },
  ],
};

// Australian Capital Territory — ACT Ambulance Service paramedic salaries.
//
// Source of every figure: ACT Public Sector ACT Ambulance Service Enterprise
// Agreement 2023-2026, approved by the Fair Work Commission to operate from
// 6 March 2024, nominal expiry 31 March 2026. Read in full on 24 September 2026
// from the copy published on the ACTPS Employment Portal (CMTEDD).
//
// Clause C2.2 schedules the increases; the last is 1% plus a $1,000 flat
// increase from the first full pay period on or after 1 December 2025. Annex A
// prints ANNUAL base salaries; the "1% + $1,000 from 04/12/2025" column is the
// one in force on 24 September 2026 and is what this file publishes. No later
// increase is written into the agreement.
//
// Annex A lists the increments of each classification as successive unnumbered
// rows (e.g. four "Ambulance Paramedic 1" rows). Labels below add the increment
// number in row order. Annex A also shows a "Total" per row that adds the
// roster's annualised shift penalties and rostered overtime; that total is
// quoted in notes, but `salary` is base salary only. Base salaries are identical
// for the 10/14 and 44-hour shift patterns.
//
// Per clause N16, AP2 and ICP2 positions are Training and Development Officer
// and Team Leader roles filled on merit, so the top of the ordinary paramedic
// scale is Ambulance Paramedic 1, increment 4.

import type { ServicePayJurisdiction } from "../types";

export const ACT_PARAMEDIC_PAY: ServicePayJurisdiction = {
  occupation: "paramedic",
  slug: "act",
  code: "ACT",
  name: "Australian Capital Territory",
  nameInSentence: "the ACT",
  employer: "ACT Ambulance Service",
  agreementName: "ACT Public Sector ACT Ambulance Service Enterprise Agreement 2023-2026",
  agreementUrl:
    "https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0011/2410121/ACT-Public-Sector-Ambulance-Service-Enterprise-Agreement-2023-2026.pdf",
  ratesEffectiveFrom: "4 December 2025",
  nextIncrease: null,
  verifiedOn: "24 September 2026",

  entryStep: "Graduate Paramedic Intern",
  topStep: "Ambulance Paramedic 1 - increment 4",

  scales: [
    {
      id: "paramedics",
      title: "Graduate Paramedic Intern and Ambulance Paramedic 1 (Annex A)",
      intro:
        "Graduate Paramedic Interns (the entry level for graduates) and qualified Ambulance Paramedics. Annual base salary; roster penalties and rostered overtime are extra.",
      stepHeading: "Classification",
      effectiveFrom: "4 December 2025",
      steps: [
        {
          label: "Graduate Paramedic Intern",
          salary: 88_017,
          note: "Entry level for graduates. Total incl. 10/14 roster penalties and overtime: $112,189",
        },
        { label: "Ambulance Paramedic 1 - increment 1", salary: 91_571, note: "10/14 roster total: $122,504" },
        { label: "Ambulance Paramedic 1 - increment 2", salary: 95_698, note: "10/14 roster total: $128,025" },
        { label: "Ambulance Paramedic 1 - increment 3", salary: 98_997, note: "10/14 roster total: $132,438" },
        { label: "Ambulance Paramedic 1 - increment 4", salary: 102_237, note: "10/14 roster total: $136,772" },
      ],
    },
    {
      id: "senior-and-icp",
      title: "Ambulance Paramedic 2 and Intensive Care Paramedics (Annex A)",
      intro:
        "Intensive Care Paramedic Level 1 is the ICP scale. Ambulance Paramedic 2 and ICP Level 2 are Training and Development Officer and Team Leader positions filled on merit (clause N16).",
      stepHeading: "Classification",
      effectiveFrom: "4 December 2025",
      steps: [
        { label: "Intensive Care Paramedic Level 1 - increment 1", salary: 105_361, note: "10/14 roster total: $140,952" },
        { label: "Intensive Care Paramedic Level 1 - increment 2", salary: 109_649, note: "10/14 roster total: $146,688" },
        { label: "Intensive Care Paramedic Level 1 - increment 3", salary: 112_859, note: "10/14 roster total: $150,983" },
        { label: "Intensive Care Paramedic Level 1 - increment 4", salary: 116_074, note: "10/14 roster total: $155,284" },
        { label: "Ambulance Paramedic 2 - increment 1", salary: 108_457, note: "10/14 roster total: $145,094" },
        { label: "Ambulance Paramedic 2 - increment 2", salary: 114_753, note: "10/14 roster total: $153,517" },
        { label: "Ambulance Paramedic 2 - increment 3", salary: 121_052, note: "10/14 roster total: $161,943" },
        { label: "Intensive Care Paramedic Level 2 - increment 1", salary: 122_317, note: "10/14 roster total: $163,635" },
        { label: "Intensive Care Paramedic Level 2 - increment 2", salary: 128_615, note: "10/14 roster total: $172,061" },
        { label: "Intensive Care Paramedic Level 2 - increment 3", salary: 134_914, note: "10/14 roster total: $180,488" },
      ],
    },
  ],

  traineePay: [
    "Graduates with relevant university qualifications are engaged as a Graduate Paramedic Intern at the Intern Paramedic salary level (clause R3.2.10): $88,017 a year base from 4 December 2025.",
    "On the 10/14 roster a Graduate Paramedic Intern's total with 21.675% penalties and 5.788% rostered overtime is $112,189; on the 44-hour shift pattern (29.71% penalties, 1.87% overtime) it is $115,813.",
    "Student Paramedics are paid $79,147 (Student Year 1) and $84,462 (Student Year 2) a year base. After about 18 months and supervised practice, an intern authorised by the Chief Officer becomes an Ambulance Paramedic (clause R3.2.11).",
  ],

  penalties: [
    "Qualified paramedics on the 10/14 roster: annualised shift penalties of 26.65% and rostered overtime of 7.13% of base salary (Annex A).",
    "Qualified paramedics on the 44-hour shift pattern: shift penalty payment of 29.71% and rostered overtime of 1.87% of base salary (Annex A).",
    "Graduate Paramedic Interns and students on the 10/14 roster: 21.675% penalties and 5.788% rostered overtime (Annex A).",
  ],

  notices: [
    "The ACT Ambulance Service Enterprise Agreement 2023-2026 passed its nominal expiry date on 31 March 2026. It continues to apply until a replacement agreement is approved.",
    "In September 2026 the ACTPS Employment Portal said 17 of the 18 ACT public sector enterprise agreements were under negotiation. No pay rise after 4 December 2025 is written into the current agreement.",
  ],

  unverified: [
    "Any interim or back-dated increase under a replacement agreement: none had been published when checked on 24 September 2026.",
    "Ambulance Manager and Ambulance Support Officer rates are in Annex A but are not reproduced here.",
  ],

  sources: [
    {
      title: "ACT Public Sector ACT Ambulance Service Enterprise Agreement 2023-2026",
      publisher: "ACT Government (CMTEDD) - ACTPS Employment Portal",
      url: "https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0011/2410121/ACT-Public-Sector-Ambulance-Service-Enterprise-Agreement-2023-2026.pdf",
    },
    {
      title: "ACTPS Enterprise Agreements (bargaining status)",
      publisher: "ACT Government (CMTEDD)",
      url: "https://www.cmtedd.act.gov.au/employment-framework/for-employees/agreements",
    },
  ],

  faqs: [
    {
      q: "How much does a paramedic earn in the ACT?",
      a: "Under the ACT Ambulance Service Enterprise Agreement 2023-2026, an Ambulance Paramedic 1 earns $91,571 to $102,237 a year base from 4 December 2025. On the 10/14 roster, penalties and rostered overtime take the total to $122,504 to $136,772.",
    },
    {
      q: "What does a graduate paramedic earn in the ACT?",
      a: "A Graduate Paramedic Intern with ACT Ambulance Service is paid $88,017 a year base from 4 December 2025, or $112,189 including 10/14 roster penalties and rostered overtime.",
    },
    {
      q: "How much does an intensive care paramedic earn in the ACT?",
      a: "An Intensive Care Paramedic Level 1 earns $105,361 to $116,074 a year base from 4 December 2025 ($140,952 to $155,284 on the 10/14 roster including penalties and overtime).",
    },
    {
      q: "Is a new ACT Ambulance Service agreement coming?",
      a: "The current agreement reached its nominal expiry on 31 March 2026 and ACT public sector agreements are being renegotiated. Until a new agreement is approved, the 4 December 2025 rates continue to apply.",
    },
  ],
};

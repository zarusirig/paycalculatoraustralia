// Western Australia — St John WA paramedic salaries.
//
// St John Ambulance Western Australia Ltd is a PRIVATE (not-for-profit)
// employer contracted by the WA Government to run the state's road ambulance
// service. Its paramedics are covered by a federal enterprise agreement under
// the Fair Work Act, not a state public-sector agreement.
//
// Source of every figure: St John Ambulance Western Australia Ltd Ambulance
// Officers' / Paramedics Enterprise Agreement 2024, approved by the Fair Work
// Commission on 15 July 2025 ([2025] FWCA 2337, AE529705), operating from
// 22 July 2025, nominal expiry 30 June 2027. Read in full on 24 September 2026
// from the FWC-published agreement PDF.
//
// Appendix 1 prints three tables: effective 1 July 2024, 1 July 2025 and
// 1 July 2026. The 1 July 2026 table is in force on 24 September 2026. Each row
// gives a Base Rate Weekly, Hourly Rate, Shift Allowance Weekly, Shift Penalty
// Weekly, Total Weekly and Total Annually. This file publishes BASE salary only:
// the Base Rate Weekly x 52.143, rounded to the dollar. The agreement's own
// "Total Annually" figure (which adds the shift allowance and shift penalty) is
// quoted in each note so readers can see why advertised St John salaries look
// higher.

import type { ServicePayJurisdiction } from "../types";

export const WA_PARAMEDIC_PAY: ServicePayJurisdiction = {
  occupation: "paramedic",
  slug: "wa",
  code: "WA",
  name: "Western Australia",
  nameInSentence: "Western Australia",
  employer: "St John WA",
  agreementName: "St John Ambulance Western Australia Ltd Ambulance Officers' / Paramedics Enterprise Agreement 2024",
  agreementUrl: "https://www.fwc.gov.au/documents/agreements/fwa/AE529705.pdf",
  ratesEffectiveFrom: "1 July 2026",
  nextIncrease: null,
  verifiedOn: "24 September 2026",

  entryStep: "Paramedic Intern Year 1",
  topStep: "Ambulance Paramedic - AP3",

  scales: [
    {
      id: "paramedics",
      title: "Paramedic interns and Ambulance Paramedics (Appendix 1)",
      intro:
        "Graduate paramedics join St John WA as Paramedic Interns (Year 1 and Year 2 rates), then progress through Ambulance Paramedic levels AP1 to AP3.",
      stepHeading: "Position",
      effectiveFrom: "1 July 2026",
      steps: [
        {
          label: "Paramedic Intern Year 1",
          salary: 73_869,
          note: "Base $1,416.66 a week; agreement's Total Annually incl. shift allowance and penalty: $99,428.01",
        },
        {
          label: "Paramedic Intern Year 2",
          salary: 81_643,
          note: "Base $1,565.75 a week; Total Annually: $109,891.35",
        },
        {
          label: "Ambulance Paramedic - AP1",
          salary: 96_250,
          note: "Base $1,845.88 a week; Total Annually: $129,552.23",
        },
        {
          label: "Ambulance Paramedic - AP2",
          salary: 101_329,
          note: "Base $1,943.30 a week; Total Annually: $136,390.06",
        },
        {
          label: "Ambulance Paramedic - AP3",
          salary: 106_430,
          note: "Base $2,041.12 a week; Total Annually: $143,255.64",
        },
      ],
    },
    {
      id: "specialist",
      title: "Station officers and specialist paramedics (Appendix 1)",
      intro:
        "Station Officer grades and specialist clinical roles, including Critical Care and Extended Care Paramedics and their interns.",
      stepHeading: "Position",
      effectiveFrom: "1 July 2026",
      steps: [
        { label: "Station Officer Gd 1", salary: 108_632, note: "Base $2,083.35 a week; Total Annually: $146,219.26" },
        { label: "Station Officer Gd 2", salary: 110_803, note: "Base $2,124.99 a week; Total Annually: $149,141.77" },
        { label: "Station Officer Gd 3", salary: 112_961, note: "Base $2,166.36 a week; Total Annually: $152,044.95" },
        {
          label: "Paramedic Special Operations",
          salary: 112_969,
          note: "Base $2,166.52 a week; Total Annually: $152,056.47",
        },
        {
          label: "Extended Care Paramedic Intern",
          salary: 121_475,
          note: "Base $2,329.65 a week; Total Annually: $163,505.42",
        },
        {
          label: "Extended Care Paramedic",
          salary: 125_321,
          note: "Base $2,403.41 a week; Total Annually: $168,682.50",
        },
        {
          label: "Critical Care Paramedic Intern",
          salary: 121_475,
          note: "Base $2,329.65 a week; Total Annually: $163,505.42",
        },
        {
          label: "Critical Care Paramedic",
          salary: 130_235,
          note: "Base $2,497.66 a week; Total Annually: $175,297.50",
        },
        {
          label: "Aircrew Clinician Lead",
          salary: 137_364,
          note: "Base $2,634.38 a week; Total Annually: $184,892.74",
        },
      ],
    },
  ],

  traineePay: [
    "From 1 July 2026 a Paramedic Intern Year 1 is paid a base rate of $1,416.66 a week ($37.28 an hour), about $73,869 a year. With the shift allowance and shift penalty the agreement's Total Annually figure is $99,428.01.",
    "A Paramedic Intern Year 2 is paid a base rate of $1,565.75 a week ($41.20 an hour), about $81,643 a year base ($109,891.35 Total Annually).",
    "A Student Ambulance Officer - CPHC is paid $1,351.14 a week and a Student Ambulance Officer - Operations $1,400.29 a week base from 1 July 2026.",
  ],

  penalties: [
    "Appendix 1 shift loadings: night 15%, Saturday 50%, Sunday 75%.",
    "Casual rates incur a 25% loading.",
    "Each rostered paramedic position also carries a weekly shift allowance and shift penalty on top of base (for an AP3 from 1 July 2026: shift allowance $651.27 and shift penalty $53.71 a week), which is why the agreement's Total Annually figure is well above base salary.",
  ],

  notices: [
    "St John WA is a private not-for-profit employer contracted by the WA Government. Its paramedics are paid under a Fair Work Commission enterprise agreement, not a WA public-sector award.",
    "The 1 July 2026 rates are the last increase in this agreement, which reaches its nominal expiry on 30 June 2027. The next rise depends on a replacement agreement.",
    "Salary figures quoted for St John WA paramedics often use the agreement's Total Annually figure (for example $129,552.23 for an AP1 from 1 July 2026), which includes the shift allowance and shift penalty. Base salary is lower.",
  ],

  unverified: [
    "Acting positions (Clinical Support Paramedic, Secondary Triage Paramedic, Community Paramedic) and grandfathered educator rates are in Appendix 1 but are not reproduced here.",
  ],

  sources: [
    {
      title: "St John Ambulance Western Australia Ltd Ambulance Officers' / Paramedics Enterprise Agreement 2024 (AE529705)",
      publisher: "Fair Work Commission",
      url: "https://www.fwc.gov.au/documents/agreements/fwa/AE529705.pdf",
    },
    {
      title: "Decision [2025] FWCA 2337 approving the agreement",
      publisher: "Fair Work Commission",
      url: "https://www.fwc.gov.au/documents/decisionssigned/pdf/2025fwca2337.pdf",
    },
  ],

  faqs: [
    {
      q: "How much does a paramedic earn in WA?",
      a: "St John WA paramedics are paid under the St John Ambulance WA Ambulance Officers' / Paramedics Enterprise Agreement 2024. From 1 July 2026 an Ambulance Paramedic's base rate is $1,845.88 (AP1) to $2,041.12 (AP3) a week - about $96,250 to $106,430 a year. Including the shift allowance and shift penalty, the agreement's total annual figure is $129,552.23 to $143,255.64.",
    },
    {
      q: "What does a graduate paramedic earn at St John WA?",
      a: "A Paramedic Intern Year 1 is paid a base rate of $1,416.66 a week (about $73,869 a year) from 1 July 2026, or $99,428.01 a year including shift allowance and penalty. In Year 2 the base rate is $1,565.75 a week.",
    },
    {
      q: "How much does a critical care paramedic earn in WA?",
      a: "A St John WA Critical Care Paramedic's base rate is $2,497.66 a week (about $130,235 a year) from 1 July 2026, with a Total Annually figure of $175,297.50 including shift allowance and penalty. An Extended Care Paramedic's base rate is $2,403.41 a week.",
    },
    {
      q: "Is St John WA a government employer?",
      a: "No. St John Ambulance Western Australia Ltd is a private not-for-profit organisation contracted to run WA's road ambulance service, and its paramedics are covered by a federal enterprise agreement approved by the Fair Work Commission.",
    },
  ],
};

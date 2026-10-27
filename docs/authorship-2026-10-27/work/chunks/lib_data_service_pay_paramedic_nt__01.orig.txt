// Northern Territory — St John Ambulance NT paramedic salaries.
//
// St John Ambulance Australia (NT) Inc is a private not-for-profit employer
// contracted by the NT Government to run the Territory's ambulance service.
// Its paramedics are covered by a federal enterprise agreement under the Fair
// Work Act.
//
// Source of every figure: St John Ambulance Australia (NT) Inc. Ambulance
// Enterprise Agreement 2022 - 2025, approved by the Fair Work Commission
// (Commissioner Platt, AG2022/1372, 12 May 2022; AE515933), nominal expiry
// 30 June 2025. Read in full on 24 September 2026 from the copy of the approved
// agreement (with FWC decision) hosted by the United Workers Union, because the
// FWC document URL for AE515933 returned a 404 when tried.
//
// Schedule 2 prints three rate tables: 2.5% increases on or after 1 July 2022,
// 1 July 2023 and 1 July 2024. The 1 July 2024 table is the LAST increase in the
// agreement. It publishes an hourly rate, Base Fortnightly, Roster Allowance
// Fortnightly (32.4%), Total Fortnightly and Total Annually. This file
// publishes BASE salary only: Base Fortnightly x 26.0714, rounded to the dollar.
//
// IMPORTANT: the agreement passed its nominal expiry on 30 June 2025. An expired
// agreement keeps applying until replaced, and no replacement agreement could be
// found. These 1 July 2024 rates are therefore the latest rates in the
// instrument, but whether St John NT has paid any increase since (outside or
// ahead of a new agreement) could NOT be verified. Each table is labelled with
// its real effective date.

import type { ServicePayJurisdiction } from "../types";

export const NT_PARAMEDIC_PAY: ServicePayJurisdiction = {
  occupation: "paramedic",
  slug: "nt",
  code: "NT",
  name: "Northern Territory",
  nameInSentence: "the Northern Territory",
  employer: "St John Ambulance NT",
  agreementName: "St John Ambulance Australia (NT) Inc. Ambulance Enterprise Agreement 2022 - 2025",
  agreementUrl: "https://media.unitedworkers.org.au/uploads/2023/06/SJA-EA-2022-2025-002.pdf",
  ratesEffectiveFrom: "1 July 2024",
  nextIncrease: null,
  verifiedOn: "24 September 2026",

  entryStep: "Intern",
  topStep: "Para 5+",

  scales: [
    {
      id: "paramedics",
      title: "Intern and Qualified Paramedic (Schedule 2, 1 July 2024 rates)",
      intro:
        "Intern Paramedics and Qualified Paramedics, who move up by years since qualifying (Para 0-2, 2-3, 3+, 5+). Base salary; a 32.4% roster allowance is paid on top for fixed rosters with regular night shifts.",
      stepHeading: "Classification",
      effectiveFrom: "1 July 2024",
      steps: [
        {
          label: "Intern",
          salary: 82_859,
          note: "Base $3,178.14 a fortnight ($41.8176 an hour); Total Annually with roster allowance: $109,404.32",
        },
        {
          label: "Para 0-2",
          salary: 85_815,
          note: "Base $3,291.55 a fortnight ($43.3098 an hour); Total Annually: $113,308.24",
        },
        {
          label: "Para 2-3",
          salary: 87_393,
          note: "Base $3,352.08 a fortnight ($44.1064 an hour); Total Annually: $115,392.13",
        },
        {
          label: "Para 3+",
          salary: 88_621,
          note: "Base $3,399.18 a fortnight ($44.7261 an hour); Total Annually: $117,013.44",
        },
        {
          label: "Para 5+",
          salary: 90_275,
          note: "Base $3,462.61 a fortnight ($45.5606 an hour); Total Annually: $119,196.83",
        },
      ],
    },
    {
      id: "icp",
      title: "Intensive Care Paramedic (Schedule 2, 1 July 2024 rates)",
      intro: "Intensive Care Paramedics, stepped by years at ICP level. Base salary; roster allowance extra.",
      stepHeading: "Classification",
      effectiveFrom: "1 July 2024",
      steps: [
        {
          label: "ICP 0-2",
          salary: 96_790,
          note: "Base $3,712.48 a fortnight ($48.8484 an hour); Total Annually: $127,798.42",
        },
        {
          label: "ICP 2+",
          salary: 108_916,
          note: "Base $4,177.62 a fortnight ($54.9687 an hour); Total Annually: $143,810.43",
        },
        {
          label: "ICP 5+",
          salary: 122_572,
          note: "Base $4,701.38 a fortnight ($61.8603 an hour); Total Annually: $161,840.37",
        },
      ],
    },
  ],

  traineePay: [
    "An Intern Paramedic holds a Bachelor of Paramedical Science or equivalent and is working towards an Authority to Practice as a Paramedic.",
    "From 1 July 2024 an Intern is paid a base of $3,178.14 a fortnight ($41.8176 an hour), about $82,859 a year. With the 32.4% roster allowance, the agreement's Total Annually figure is $109,404.32.",
    "On qualifying, a paramedic is classified Para 0-2: base $3,291.55 a fortnight (about $85,815 a year).",
  ],

  penalties: [
    "Roster allowance of 32.4% of salary for employees on a fixed roster with regular night shifts, paid instead of separate shift loadings (clause 44.2, Schedule 2).",
    "Remote area allowance: $426.01 a fortnight, or $189.35 where accommodation is provided (2024 rate, clause 44.9).",
    "Northern Territory allowance: $36.92 a fortnight (clause 44.10). Tennant Creek and Nhulunbuy staff receive a locality allowance instead of roster, shift and on-call payments (clauses 44.3-44.4).",
  ],

  notices: [
    "These are the 1 July 2024 rates - the last increase in the St John Ambulance NT agreement, which reached its nominal expiry on 30 June 2025. No replacement agreement could be found, so the expired agreement continues to apply.",
    "St John Ambulance NT is a private not-for-profit employer contracted by the NT Government; its paramedics are paid under a Fair Work Commission enterprise agreement, not the NT Public Sector agreement.",
    "Salary figures quoted for NT paramedics often use the agreement's Total Annually figure, which includes the 32.4% roster allowance. Base salary is lower.",
  ],

  unverified: [
    "Whether St John Ambulance NT has paid any pay rise since 1 July 2024 (for example an interim increase while a new agreement is negotiated) could not be verified from any primary source. Check with St John NT or the Fair Work Commission agreement search.",
    "The agreement was read from a union-hosted copy of the approved agreement; the Fair Work Commission's own document link for AE515933 could not be retrieved on 24 September 2026.",
    "Patient Transport Officer and Emergency Medical Dispatch rates are in Schedule 2 but are not reproduced here.",
  ],

  sources: [
    {
      title: "St John Ambulance Australia (NT) Inc. Ambulance Enterprise Agreement 2022 - 2025, with FWC approval decision (AE515933)",
      publisher: "Fair Work Commission (copy hosted by United Workers Union)",
      url: "https://media.unitedworkers.org.au/uploads/2023/06/SJA-EA-2022-2025-002.pdf",
    },
    {
      title: "Find an enterprise agreement",
      publisher: "Fair Work Commission",
      url: "https://www.fwc.gov.au/work-conditions/enterprise-agreements/find-enterprise-agreement",
    },
  ],

  faqs: [
    {
      q: "How much does a paramedic earn in the NT?",
      a: "Under the St John Ambulance NT agreement's latest rates (1 July 2024), a Qualified Paramedic's base is $3,291.55 to $3,462.61 a fortnight - about $85,815 to $90,275 a year. With the 32.4% roster allowance the agreement's total is $113,308.24 to $119,196.83 a year. Any rise since then could not be verified.",
    },
    {
      q: "What does a graduate paramedic earn in the NT?",
      a: "An Intern Paramedic with St John Ambulance NT is paid a base of $3,178.14 a fortnight (about $82,859 a year) at the 1 July 2024 rate, or $109,404.32 a year including the roster allowance.",
    },
    {
      q: "How much does an intensive care paramedic earn in the NT?",
      a: "At the 1 July 2024 rates, an Intensive Care Paramedic's base is about $96,790 (ICP 0-2) to $122,572 (ICP 5+) a year, or $127,798.42 to $161,840.37 including the roster allowance.",
    },
  ],
};

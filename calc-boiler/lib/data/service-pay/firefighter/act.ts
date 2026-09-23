// Australian Capital Territory — ACT Fire & Rescue career firefighter pay.
//
// Source of every figure: ACT Public Sector ACT Fire & Rescue Enterprise
// Agreement 2024-2026, approved by the Fair Work Commission to operate from
// 18 November 2024, nominal expiry 30 June 2026. The approved agreement (with
// the FWC approval decision on its front pages) is published on the ACTPS
// Employment Portal. Read in full on 24 September 2026.
//
// Annex A, Table 1.1 prints ANNUAL salaries with increases under clause E2.2:
// 1.5% from 6 Jun 2024, 1% + $1,500 from 5 Dec 2024, 1% from 5 Jun 2025 and
// 1% + $1,000 from 4 Dec 2025. On 24 September 2026 the column IN FORCE is
// 4 December 2025 (the agreement's last increase), which is what this file
// publishes.
//
// These are COMPOSITE salaries: Annex A para 2 says the total salary is paid in
// lieu of base wage, shift loading (public holidays, weekends, shiftwork),
// industry allowance, standard overtime and several other allowances.

import type { ServicePayJurisdiction } from "../types";

export const ACT_FIREFIGHTER_PAY: ServicePayJurisdiction = {
  occupation: "firefighter",
  slug: "act",
  code: "ACT",
  name: "Australian Capital Territory",
  nameInSentence: "the ACT",
  employer: "ACT Fire & Rescue",
  agreementName: "ACT Public Sector ACT Fire & Rescue Enterprise Agreement 2024-2026",
  agreementUrl:
    "https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0006/2606460/Fire-and-Rescue-Enterprise-Agreement-2024-2026-Approved.pdf",
  ratesEffectiveFrom: "4 December 2025",
  nextIncrease: null,
  verifiedOn: "24 September 2026",
  hubNote: "Composite salary that already includes shift loading and several allowances.",

  scales: [
    {
      id: "firefighters",
      title: "Firefighters (Annex A, Table 1.1)",
      intro:
        "ACT Fire & Rescue firefighters from recruit (FB1) to Senior Fire Fighter (FB5). Salaries are composite annual amounts that already include shift loading and several allowances.",
      stepHeading: "Classification",
      steps: [
        { label: "FB1 - Fire Fighter Fourth Class In Training", salary: 90_054 },
        { label: "FB2 - Fire Fighter Third Class", salary: 96_475 },
        { label: "FB3 - Fire Fighter Second Class", salary: 101_077 },
        { label: "FB4 - Fire Fighter First Class A", salary: 109_335 },
        { label: "FB5 - Senior Fire Fighter", salary: 114_872 },
      ],
    },
    {
      id: "officers",
      title: "Officers (Annex A, Table 1.1)",
      intro: "Station Officer and the command ranks.",
      stepHeading: "Classification",
      steps: [
        { label: "FB6 - Station Officer", salary: 129_596 },
        { label: "FB7 - Commander", salary: 153_168 },
        { label: "FB8 – Superintendent", salary: 176_222 },
      ],
    },
  ],
  entryStep: "FB1 - Fire Fighter Fourth Class In Training",
  topStep: "FB5 - Senior Fire Fighter",

  traineePay: [
    "Recruit Firefighters are classified FB1 (Fire Fighter Fourth Class In Training) while completing ACT Fire & Rescue recruit training or the lateral recruit induction program, on $90,054 a year from 4 December 2025.",
    "On completing recruit training, firefighters move to FB2 - Fire Fighter Third Class at $96,475 a year.",
  ],
  penalties: [
    "The Annex A salary is a composite wage paid in lieu of base wage, shift loading (including public holidays, weekends and shiftwork), industry allowance, standard overtime, breathing apparatus and vehicle-driving allowances and first aid allowance.",
    "Firefighters on the 10/14 roster work an average of 42 hours a week over an 8-week cycle: 38 ordinary hours plus 2 overtime hours and 2 accumulated recreation leave hours (clause D2.1).",
    "For overtime, the hourly rate is the fortnightly rate divided by 86.3240 (Annex A para 3).",
  ],
  notices: [
    "The agreement reached its nominal expiry date on 30 June 2026 and no increase after 4 December 2025 is written into it. It keeps applying until it is replaced.",
    "The ACT Government's agreements page said on 24 September 2026 that 17 of its 18 ACTPS enterprise agreements are being renegotiated. Any new ACT Fire & Rescue agreement may set new rates and back-pay.",
  ],
  unverified: [
    "No ACT Fire & Rescue pay increase after 4 December 2025 has been published, so none is shown.",
    "Allowances not absorbed into the composite salary (for example specialist and higher-duties allowances) are not included.",
  ],
  sources: [
    {
      title: "ACT Public Sector ACT Fire & Rescue Enterprise Agreement 2024-2026 (approved)",
      publisher: "ACT Government — ACTPS Employment Portal (Fair Work Commission approved)",
      url: "https://www.cmtedd.act.gov.au/__data/assets/pdf_file/0006/2606460/Fire-and-Rescue-Enterprise-Agreement-2024-2026-Approved.pdf",
    },
    {
      title: "Enterprise Agreements — ACTPS Employment Portal",
      publisher: "ACT Government",
      url: "https://www.cmtedd.act.gov.au/employment-framework/for-employees/agreements",
    },
  ],
  faqs: [
    {
      q: "How much does a firefighter earn in the ACT?",
      a: "Under the ACT Fire & Rescue Enterprise Agreement 2024-2026, a Fire Fighter First Class A (FB4) earns $109,335 a year and a Senior Fire Fighter (FB5) $114,872 a year from 4 December 2025. These composite salaries already include shift loading and several allowances.",
    },
    {
      q: "What is a recruit firefighter's salary in the ACT?",
      a: "Recruits are classified FB1 - Fire Fighter Fourth Class In Training and earn $90,054 a year from 4 December 2025. After recruit training they move to FB2 at $96,475.",
    },
    {
      q: "How much does a station officer earn in the ACT?",
      a: "An ACT Fire & Rescue Station Officer (FB6) earns $129,596 a year from 4 December 2025. A Commander (FB7) earns $153,168.",
    },
    {
      q: "Is a new ACT firefighter pay deal coming?",
      a: "The current agreement passed its nominal expiry date on 30 June 2026 and has no further increases written into it. The ACT Government is renegotiating most of its public sector agreements, so a new deal could change these rates.",
    },
  ],
};

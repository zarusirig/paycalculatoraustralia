// Victoria — Ambulance Victoria paramedic salaries.
//
// Source of every figure: Ambulance Victoria Enterprise Agreement 2024,
// approved by the Fair Work Commission on 14 February 2025 ([2025] FWCA 586,
// AE528036), operating from 21 February 2025, nominal expiry 20 October 2028.
// Read in full on 24 September 2026 from the FWC-published agreement PDF.
//
// Appendix 1 prints WEEKLY "aggregated base rates of pay" in four columns:
// FFPPOA 21 October 2024, 21 October 2025, 21 October 2026 and 21 October 2027.
// On 24 September 2026 the column in force is FFPPOA 21 October 2025, which is
// what this file publishes. Annual figures are the weekly rate x 52.143,
// rounded to the dollar, with the weekly rate quoted in each note.
//
// "Aggregated base rate" is the agreement's own base rate: it already folds in
// some allowances (clause 31.1). Shift workers are instead paid the higher
// "rolled-in rate" in Appendix 2, which also absorbs shift and weekend
// penalties. This file publishes the aggregated base rate, not the rolled-in
// rate.
//
// Extraction gap: the Appendix 1 row "Advanced Life Support Ambulance
// Paramedic - Year 12 (introduced in Term 2)" did not survive text extraction
// (it sits on a page break). The row exists (it appears in Appendix 2), but its
// aggregated base rate could not be read, so the ALS table stops at Year 11.

import type { ServicePayJurisdiction } from "../types";

export const VIC_PARAMEDIC_PAY: ServicePayJurisdiction = {
  occupation: "paramedic",
  slug: "vic",
  code: "VIC",
  name: "Victoria",
  nameInSentence: "Victoria",
  employer: "Ambulance Victoria",
  agreementName: "Ambulance Victoria Enterprise Agreement 2024",
  agreementUrl: "https://www.fwc.gov.au/documents/agreements/fwa/AE528036.pdf",
  ratesEffectiveFrom: "21 October 2025",
  nextIncrease: {
    date: "21 October 2026",
    detail:
      "The agreement's next column applies from the first full pay period on or after 21 October 2026. It takes a Graduate Ambulance Paramedic Level 1 to $1,454.17 a week, an ALS Paramedic Year 11 to $2,004.38 a week and a MICA Paramedic Year 12 to $2,563.01 a week (aggregated base rates).",
  },
  verifiedOn: "24 September 2026",

  entryStep: "Graduate Ambulance Paramedic Level 1",
  topStep: "Advanced Life Support Ambulance Paramedic - Year 11",

  scales: [
    {
      id: "als-paramedics",
      title: "Graduate and Advanced Life Support (ALS) paramedics (Appendix 1)",
      intro:
        "Graduate Ambulance Paramedics and ALS Ambulance Paramedics, the main on-road paramedic classification at Ambulance Victoria. Years 10 to 12 were added in Term 2 of the agreement.",
      stepHeading: "Classification",
      effectiveFrom: "21 October 2025",
      steps: [
        {
          label: "Graduate Ambulance Paramedic Level 1",
          salary: 72_908,
          note: "$1,398.24 a week - from commencement, under direct supervision",
        },
        {
          label: "Graduate Ambulance Paramedic Level 2",
          salary: 75_266,
          note: "$1,443.45 a week - from the pay period after indirect supervision starts",
        },
        { label: "Advanced Life Support Ambulance Paramedic - Year 1", salary: 89_329, note: "$1,713.15 a week" },
        { label: "Advanced Life Support Ambulance Paramedic - Year 2", salary: 90_239, note: "$1,730.61 a week" },
        { label: "Advanced Life Support Ambulance Paramedic - Year 3", salary: 91_153, note: "$1,748.14 a week" },
        { label: "Advanced Life Support Ambulance Paramedic - Year 4", salary: 93_248, note: "$1,788.32 a week" },
        { label: "Advanced Life Support Ambulance Paramedic - Year 5", salary: 94_297, note: "$1,808.44 a week" },
        { label: "Advanced Life Support Ambulance Paramedic - Year 6", salary: 95_343, note: "$1,828.50 a week" },
        { label: "Advanced Life Support Ambulance Paramedic - Year 7", salary: 96_393, note: "$1,848.62 a week" },
        { label: "Advanced Life Support Ambulance Paramedic - Year 8", salary: 97_453, note: "$1,868.95 a week" },
        { label: "Advanced Life Support Ambulance Paramedic - Year 9", salary: 98_524, note: "$1,889.50 a week" },
        { label: "Advanced Life Support Ambulance Paramedic - Year 10", salary: 99_017, note: "$1,898.95 a week" },
        {
          label: "Advanced Life Support Ambulance Paramedic - Year 11",
          salary: 99_510,
          note: "$1,908.40 a week (Year 12 exists but could not be read - see unverified)",
        },
      ],
    },
    {
      id: "mica-paramedics",
      title: "Mobile Intensive Care Ambulance (MICA) paramedics (Appendix 1)",
      intro:
        "MICA Paramedics are Victoria's intensive care paramedics. MICA Paramedic Interns are completing the MICA internship program.",
      stepHeading: "Classification",
      effectiveFrom: "21 October 2025",
      steps: [
        { label: "MICA Paramedic Intern", salary: 110_573, note: "$2,120.58 a week" },
        { label: "MICA Paramedic - Year 1", salary: 114_324, note: "$2,192.51 a week" },
        { label: "MICA Paramedic - Year 2", salary: 115_883, note: "$2,222.41 a week" },
        { label: "MICA Paramedic - Year 3", salary: 117_437, note: "$2,252.21 a week" },
        { label: "MICA Paramedic - Year 4", salary: 118_681, note: "$2,276.06 a week" },
        { label: "MICA Paramedic - Year 5", salary: 119_921, note: "$2,299.85 a week" },
        { label: "MICA Paramedic - Year 6", salary: 121_159, note: "$2,323.60 a week" },
        { label: "MICA Paramedic - Year 7", salary: 122_346, note: "$2,346.36 a week" },
        { label: "MICA Paramedic - Year 8", salary: 123_548, note: "$2,369.40 a week" },
        { label: "MICA Paramedic - Year 9", salary: 124_760, note: "$2,392.65 a week" },
        { label: "MICA Paramedic - Year 10", salary: 125_384, note: "$2,404.62 a week" },
        { label: "MICA Paramedic - Year 11", salary: 126_008, note: "$2,416.58 a week" },
        { label: "MICA Paramedic - Year 12", salary: 126_632, note: "$2,428.55 a week" },
      ],
    },
    {
      id: "bls-paramedics",
      title: "Basic Life Support (BLS) paramedics (Appendix 1)",
      intro:
        "BLS Ambulance Paramedics have completed an AHPRA-approved paramedicine program and practise BLS skills; progression is by Year 3, 6, 9 and 12 increments.",
      stepHeading: "Classification",
      effectiveFrom: "21 October 2025",
      steps: [
        { label: "Basic Life Support Ambulance Paramedic - Year 3", salary: 81_740, note: "$1,567.61 a week" },
        { label: "Basic Life Support Ambulance Paramedic - Year 6", salary: 84_949, note: "$1,629.16 a week" },
        { label: "Basic Life Support Ambulance Paramedic - Year 9", salary: 87_752, note: "$1,682.92 a week" },
        { label: "Basic Life Support Ambulance Paramedic - Year 12", salary: 89_069, note: "$1,708.16 a week" },
      ],
    },
  ],

  traineePay: [
    "A Graduate Ambulance Paramedic (GAP) is an employee who has completed, or is undertaking, an AHPRA-approved paramedicine program and is employed in AV's Graduate Ambulance Paramedic program.",
    "From the first full pay period on or after 21 October 2025, a Graduate Ambulance Paramedic Level 1 (from commencement, under direct supervision) is paid an aggregated base rate of $1,398.24 a week (about $72,908 a year), and Level 2 (once under indirect supervision) $1,443.45 a week (about $75,266 a year).",
    "Graduates on shift rosters are paid the Appendix 2 rolled-in rate instead: $1,808.49 a week for Level 1 and $1,860.31 a week for Level 2 from 21 October 2025.",
  ],

  penalties: [
    "Shift workers are paid a weekly rolled-in rate (Appendix 2) that absorbs shift and weekend penalties - for example $2,193.19 a week for an ALS Paramedic Year 1 from 21 October 2025, against an aggregated base rate of $1,713.15.",
    "Unsociable shift incentive: $185 for each qualifying rostered shift of six hours or more (clause 37.3).",
    "Flexible Shift Paramedic Allowance: $100 per shift; Roster Cycle Allocation Paramedic Allowance: $65 per shift (clause 44.6).",
  ],

  notices: [
    "The Ambulance Victoria Enterprise Agreement 2024 runs to 20 October 2028, with increases each October. The 21 October 2026 increase is already written into the agreement.",
    "Figures are Ambulance Victoria's aggregated base rates. Most on-road paramedics work shift rosters and are paid the higher rolled-in rate, so their actual weekly pay is well above the figures in these tables.",
  ],

  unverified: [
    "Advanced Life Support Ambulance Paramedic - Year 12: the row exists in the agreement, but its aggregated base rate did not survive text extraction from the agreement PDF and is not published here rather than being estimated. (Its rolled-in rate from 21 October 2025 is $2,427.84 a week.)",
    "Relieving, Senior Reserve, Rural Senior Relieving, ARU, flight and community support coordinator classifications are in Appendix 1 of the agreement but are not reproduced here.",
  ],

  sources: [
    {
      title: "Ambulance Victoria Enterprise Agreement 2024 (AE528036), with approval decision [2025] FWCA 586",
      publisher: "Fair Work Commission",
      url: "https://www.fwc.gov.au/documents/agreements/fwa/AE528036.pdf",
    },
  ],

  faqs: [
    {
      q: "How much does a paramedic earn in Victoria?",
      a: "Under the Ambulance Victoria Enterprise Agreement 2024, an Advanced Life Support Ambulance Paramedic's aggregated base rate from 21 October 2025 is $1,713.15 a week in Year 1 rising to $1,908.40 a week in Year 11 - about $89,329 to $99,510 a year. Paramedics on shift rosters are paid a higher rolled-in rate that includes shift penalties.",
    },
    {
      q: "What does a graduate paramedic earn at Ambulance Victoria?",
      a: "A Graduate Ambulance Paramedic Level 1 is paid $1,398.24 a week (about $72,908 a year) and Level 2 is paid $1,443.45 a week (about $75,266 a year) as an aggregated base rate from 21 October 2025. On a shift roster the rolled-in rate is $1,808.49 and $1,860.31 a week.",
    },
    {
      q: "How much does a MICA paramedic earn in Victoria?",
      a: "A MICA (intensive care) Paramedic's aggregated base rate from 21 October 2025 runs from $2,192.51 a week in Year 1 to $2,428.55 a week in Year 12 - about $114,324 to $126,632 a year. A MICA Paramedic Intern is paid $2,120.58 a week.",
    },
    {
      q: "When do Victorian paramedics get their next pay rise?",
      a: "The next increase in the agreement applies from the first full pay period on or after 21 October 2026, with a further increase from 21 October 2027.",
    },
  ],
};

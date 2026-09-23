// =============================================================================
// Northern Territory Public Sector — administrative stream pay (H2).
//
// Source: Northern Territory Public Sector 2025–2029 Enterprise Agreement,
// approved by the Fair Work Commission on 30 January 2026 (AG2025/4592),
// operating from 6 February 2026, nominal expiry 10 August 2029.
// Schedule 11, Part A Salaries — Administrative/Executive Officers table, column
// "SALARY RATES EFFECTIVE 13.08.26 $ p.a." — the 3% increase from the first
// full pay period on or after 10 August 2026 (clause 35.3(b)).
// https://ocpe.nt.gov.au/__data/assets/pdf_file/0008/1590713/ntps-2025-2029-enterprise-agreement.pdf
//
// SECOND SOURCE
// -------------
// The Office of the Commissioner for Public Employment's "General NTPS —
// administrative stream — rates of pay" page, headed "Rates effective
// 13 August 2026", prints the same figures for every AO, SAO and EO point.
// https://ocpe.nt.gov.au/employment-terms-and-conditions/rates-of-pay/general-ntps-administrative-stream
//
// Read 24 September 2026.
// =============================================================================

import type { Jurisdiction } from "./types";

const VERIFIED = "24 September 2026";

export const NT: Jurisdiction = {
  slug: "nt",
  name: "Northern Territory Public Sector",
  shortName: "NTPS",
  label: "NT (AO2–SAO2)",
  verifiedOn: VERIFIED,

  levelGuide: {
    scheduleId: "nt-ea-2026",
    streamIds: ["nt-admin"],
    year: "2026",
    headingTemplate: "NT {label} salary {year}",
    title: "NT Public Sector salary by classification, from 13 August 2026",
    intro:
      "Each administrative classification below lists every pay point in the 13 August 2026 column of Schedule 11 of the Northern Territory Public Sector 2025–2029 Enterprise Agreement. Every salary links to the nearest take-home pay page.",
  },

  headline:
    "From 13 August 2026 a Northern Territory public servant at AO4 is paid $79,664 to $90,824, at AO5 $93,674 to $98,332, at AO6 $102,505 to $114,282 and at AO7 $120,877 to $130,039, under the Northern Territory Public Sector 2025–2029 Enterprise Agreement. The administrative stream runs from $63,931 at AO2 to $171,482 at the top of SAO2.",

  metaTitle: "NT Public Sector Pay Scales 2026 — AO2 to SAO2 Salaries",
  metaDescription:
    "Northern Territory public sector pay from 13 August 2026: every AO2–AO7, SAO1, SAO2 and EO2–EO3 pay point ($63,931 to $187,176) from the NTPS 2025–2029 Enterprise Agreement, with take-home pay.",

  instrument:
    "The Northern Territory Public Sector 2025–2029 Enterprise Agreement, a single-enterprise agreement approved by the Fair Work Commission on 30 January 2026 (AG2025/4592). It covers NT Public Sector employees in the general classifications — administrative, professional, technical, physical and others — with salaries in Part A of Schedule 11. Teachers, nurses and some other groups have their own NTPS agreements.",

  payRise:
    "The agreement makes four increases: 3% from 17 November 2025, 3% from the first full pay period on or after 10 August 2026 (13 August 2026), 3.5% from the first full pay period on or after 10 August 2027, and 3.5% from the first full pay period on or after 10 August 2028 with any Darwin CPI above 3.5% added (clause 35.3). The rates on this page are the 13 August 2026 column. The next increase is 3.5% from 12 August 2027 — for example AO2 rises from $63,931 to $66,169.",

  schedules: [
    {
      id: "nt-ea-2026",
      title: "NTPS 2025–2029 Enterprise Agreement, from 13 August 2026",
      coverage:
        "Northern Territory Public Sector employees in the Administrative Officer, Senior Administrative Officer and Executive Officer 2–3 designations.",
      basis: "agreement",
      effectiveFrom: "13 August 2026",
      rangeMeaning:
        "First and last pay point of the designation. Annual full-time salary only — superannuation is paid on top.",
      sourceId: "nt-ea-2025",
      streams: [
        {
          id: "nt-admin",
          name: "Administrative/Executive Officers (Schedule 11, Part A)",
          code: "AO",
          description:
            "Administrative Officers 2 to 7, then Senior Administrative Officers 1 and 2. Each designation has annual pay points moved through by increment; there is no AO1 designation in the schedule.",
          bands: [
            {
              code: "AO2",
              name: "Administrative Officer 2",
              aliases: ["ao2 nt", "nt ao2", "ntps ao2"],
              summary: "Five pay points. The entry administrative designation.",
              min: 63_931,
              max: 69_226,
              payPoints: [
                { label: "AO2 pay point 1", annual: 63_931 },
                { label: "AO2 pay point 2", annual: 65_468 },
                { label: "AO2 pay point 3", annual: 66_697 },
                { label: "AO2 pay point 4", annual: 67_945 },
                { label: "AO2 pay point 5", annual: 69_226 },
              ],
            },
            {
              code: "AO3",
              name: "Administrative Officer 3",
              aliases: ["ao3 nt", "nt ao3", "ntps ao3"],
              summary: "Four pay points.",
              min: 70_839,
              max: 76_115,
              payPoints: [
                { label: "AO3 pay point 1", annual: 70_839 },
                { label: "AO3 pay point 2", annual: 72_128 },
                { label: "AO3 pay point 3", annual: 73_441 },
                { label: "AO3 pay point 4", annual: 76_115 },
              ],
            },
            {
              code: "AO4",
              name: "Administrative Officer 4",
              aliases: ["ao4 nt", "nt ao4", "ntps ao4"],
              summary: "Six pay points.",
              min: 79_664,
              max: 90_824,
              payPoints: [
                { label: "AO4 pay point 1", annual: 79_664 },
                { label: "AO4 pay point 2", annual: 81_061 },
                { label: "AO4 pay point 3", annual: 83_463 },
                { label: "AO4 pay point 4", annual: 85_867 },
                { label: "AO4 pay point 5", annual: 88_267 },
                { label: "AO4 pay point 6", annual: 90_824 },
              ],
            },
            {
              code: "AO5",
              name: "Administrative Officer 5",
              aliases: ["ao5 nt", "nt ao5", "ntps ao5"],
              summary: "Three pay points.",
              min: 93_674,
              max: 98_332,
              payPoints: [
                { label: "AO5 pay point 1", annual: 93_674 },
                { label: "AO5 pay point 2", annual: 96_003 },
                { label: "AO5 pay point 3", annual: 98_332 },
              ],
            },
            {
              code: "AO6",
              name: "Administrative Officer 6",
              aliases: ["ao6 nt", "nt ao6", "ntps ao6"],
              summary: "Four pay points.",
              min: 102_505,
              max: 114_282,
              payPoints: [
                { label: "AO6 pay point 1", annual: 102_505 },
                { label: "AO6 pay point 2", annual: 106_366 },
                { label: "AO6 pay point 3", annual: 110_267 },
                { label: "AO6 pay point 4", annual: 114_282 },
              ],
            },
            {
              code: "AO7",
              name: "Administrative Officer 7",
              aliases: ["ao7 nt", "nt ao7", "ntps ao7"],
              summary: "Three pay points.",
              min: 120_877,
              max: 130_039,
              payPoints: [
                { label: "AO7 pay point 1", annual: 120_877 },
                { label: "AO7 pay point 2", annual: 125_458 },
                { label: "AO7 pay point 3", annual: 130_039 },
              ],
            },
            {
              code: "SAO1",
              name: "Senior Administrative Officer 1",
              aliases: ["sao1", "nt sao1", "senior administrative officer 1"],
              summary: "Three pay points. Progression is by annual high-performance assessment, not automatic (clause 37).",
              min: 136_380,
              max: 152_357,
              payPoints: [
                { label: "SAO1 pay point 1", annual: 136_380 },
                { label: "SAO1 pay point 2", annual: 143_896 },
                { label: "SAO1 pay point 3", annual: 152_357 },
              ],
            },
            {
              code: "SAO2",
              name: "Senior Administrative Officer 2",
              aliases: ["sao2", "nt sao2", "senior administrative officer 2"],
              summary: "Three pay points. Progression is by annual high-performance assessment, not automatic (clause 37).",
              min: 157_334,
              max: 171_482,
              payPoints: [
                { label: "SAO2 pay point 1", annual: 157_334 },
                { label: "SAO2 pay point 2", annual: 164_256 },
                { label: "SAO2 pay point 3", annual: 171_482 },
              ],
            },
            {
              code: "EO2",
              name: "Executive Officer 2",
              aliases: ["eo2 nt", "nt eo2"],
              summary: "Single rate, printed in the same table.",
              min: 182_000,
              max: 182_000,
            },
            {
              code: "EO3",
              name: "Executive Officer 3",
              aliases: ["eo3 nt", "nt eo3"],
              summary: "Single rate, printed in the same table.",
              min: 187_176,
              max: 187_176,
            },
          ],
        },
      ],
    },
  ],

  progression: [
    "An employee moves up one pay point within their designation after 12 months' continuous service at a pay point, or 12 months' broken service in the preceding 24 months (clause 36.2). Part-time employees progress on the same calendar time as full-time employees (clause 36.3).",
    "Senior Administrative Officers are different: clause 37.1 says their pay progression \"is to be based on high performance\" and \"is not automatic\". It is assessed once a year against criteria such as sustained superior performance or successfully taking on increased duties (clause 37.5).",
    "Moving from one AO designation to the next is a promotion. Earlier higher duties at the new level within the preceding 24 months count towards the next increment date (clause 36.4). The top of AO7 is $130,039 and the bottom of SAO1 is $136,380.",
  ],

  superannuation: {
    rate: null,
    text:
      "Clause 40.2 commits the employer to the minimum contribution that avoids the Superannuation Guarantee charge, so the Superannuation Guarantee rate is what the agreement guarantees. Members of the closed CSS, NTGPASS and NTSSS schemes are covered by those schemes' rules (clause 40.3).",
    sourceId: "nt-ea-2025",
  },

  sources: [
    {
      id: "nt-ea-2025",
      title: "Northern Territory Public Sector 2025–2029 Enterprise Agreement (AG2025/4592) — Schedule 11, Part A",
      publisher: "Office of the Commissioner for Public Employment (NT)",
      url: "https://ocpe.nt.gov.au/__data/assets/pdf_file/0008/1590713/ntps-2025-2029-enterprise-agreement.pdf",
      effectiveFrom: "13 August 2026",
      verifiedOn: VERIFIED,
      note: "Administrative/Executive Officers table, column \"13.08.26\". Clause 35.3 sets the increases; the FWC decision records approval on 30 January 2026 and a nominal expiry of 10 August 2029.",
    },
    {
      id: "nt-ocpe-admin-rates",
      title: "General NTPS — administrative stream — rates of pay (rates effective 13 August 2026)",
      publisher: "Office of the Commissioner for Public Employment (NT)",
      url: "https://ocpe.nt.gov.au/employment-terms-and-conditions/rates-of-pay/general-ntps-administrative-stream",
      effectiveFrom: "13 August 2026",
      verifiedOn: VERIFIED,
      note: "Prints the same AO2 to EO3 figures — the second source for every figure on this page.",
    },
  ],

  unverified: [
    "Professional, technical, physical and other streams in Schedule 11 — published in the same agreement but not transcribed here.",
    "Executive contract officer remuneration above EO3, which is set outside the agreement.",
    "NT teachers, nurses, police and other groups on their own agreements (see the teacher and nurse pages).",
    "Remote and district allowances, which vary by location and are not reproduced.",
  ],

  faqs: [
    {
      q: "What is the NT public service pay scale in 2026?",
      a: "From 13 August 2026 the administrative stream of the Northern Territory Public Sector 2025–2029 Enterprise Agreement runs from $63,931 at AO2 to $130,039 at the top of AO7, then $136,380 to $152,357 at SAO1 and $157,334 to $171,482 at SAO2. EO2 is $182,000 and EO3 $187,176.",
    },
    {
      q: "What does an NT AO5 earn?",
      a: "AO5 has three pay points: $93,674, $96,003 and $98,332 a year from 13 August 2026.",
    },
    {
      q: "When is the next NT public service pay rise?",
      a: "3.5% from the first full pay period on or after 10 August 2027 (12 August 2027), then 3.5% from 10 August 2028 plus any Darwin CPI above 3.5%. The agreement's nominal expiry is 10 August 2029.",
    },
    {
      q: "What does an NT AO6 or AO7 earn?",
      a: "From 13 August 2026 AO6 pays $102,505, $106,366, $110,267 and $114,282, and AO7 pays $120,877, $125,458 and $130,039.",
    },
    {
      q: "How do increments work in the NT public sector?",
      a: "Below the senior levels you move up one pay point after 12 months' continuous service at your current point, or 12 months' broken service in the last 24 months (clause 36.2). Part-time staff progress on the same calendar time as full-time staff.",
    },
  ],
};

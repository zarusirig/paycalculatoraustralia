// =============================================================================
// Tasmanian State Service — Tasmanian State Service Award salaries (H2).
//
// Source: Public Sector Union Wages Agreement 2025 (s55 industrial agreement,
// Tasmanian Industrial Commission), Schedule 1 — Salaries for Tasmanian State
// Service Award, General Stream and Professional Stream tables. Every figure is
// the column headed "Base + 3% increase effective fppcooa 1 Dec 2025": the
// 1 December 2024 salary plus the clause 7.2–7.4 flat structural adjustment
// ($800 to the top of Band 5, $600 at Band 6, $500 at Bands 7 and 8, nil at
// Band 9 and above), then 3% (clause 7.1(i)).
// https://www.tic.tas.gov.au/__data/assets/pdf_file/0010/855154/Public-Sector-Union-Wages-Agreement-2025.pdf
//
// WHEN THESE RATES WERE ACTUALLY PAID
// -----------------------------------
// The agreement applies with effect from 1 July 2025 and runs to 30 June 2028
// (clause 4.2). The Head of the State Service's message of 5 June 2026 says
// agencies "have begun to adjust salaries and backpay to the first full pay in
// December 2025" under the PSUWA, with every agency to finish by 30 June 2026.
//
// SECOND SOURCE
// -------------
// The Department for Education, Children and Young People's "DECYP Salary
// Scales as at 27 August 2026" prints the same Tasmanian State Service Award
// General and Professional Stream figures, row for row, confirming these are
// the rates being paid in August 2026.
//
// Note: the agreement's General Stream table prints "B7-R1-3" twice; the first
// is Band 7 Range 1 Level 2, as the DECYP schedule labels it.
//
// Read 24 September 2026.
// =============================================================================

import type { Jurisdiction, PayPoint } from "./types";

const VERIFIED = "24 September 2026";

function pts(prefix: string, rows: readonly [string, number][]): PayPoint[] {
  return rows.map(([label, annual]) => ({ label: `${prefix} ${label}`, annual }));
}

export const TAS: Jurisdiction = {
  slug: "tas",
  name: "Tasmanian State Service",
  shortName: "Tasmanian State Service",
  label: "Tasmania (General Stream Band 1–9)",
  verifiedOn: VERIFIED,

  levelGuide: {
    scheduleId: "tas-tssa-2025",
    streamIds: ["tas-general"],
    year: "2026",
    headingTemplate: "Tasmanian State Service {label} salary {year}",
    title: "Tasmanian State Service salary by band",
    intro:
      "Each General Stream band below lists every salary point in Schedule 1 of the Public Sector Union Wages Agreement 2025, effective from the first full pay period on or after 1 December 2025. Every salary links to the nearest take-home pay page.",
  },

  headline:
    "A Tasmanian State Service employee at General Stream Band 3 is paid $77,850 to $84,084, at Band 4 $86,325 to $99,237 and at Band 5 $103,290 to $108,307, under the Tasmanian State Service Award as varied by the Public Sector Union Wages Agreement 2025. The General Stream runs from $55,616 at Band 1 to $194,052 at the top of Band 9, from the first full pay period on or after 1 December 2025.",

  metaTitle: "Tasmanian State Service Pay Scales 2026 — Band 1–9 Salaries",
  metaDescription:
    "Tasmanian State Service pay from 1 December 2025: every General Stream Band 1–9 and Professional Stream salary point, from the PSUWA 2025, with take-home pay.",

  instrument:
    "The Tasmanian State Service Award sets the classification structure — a General Stream of Bands 1 to 9 and a Professional Stream of Bands 1 to 6 — and the Public Sector Union Wages Agreement 2025, an industrial agreement under s55 of the Industrial Relations Act 1984 (Tas), sets the salaries in its Schedule 1. The agreement prevails over the award where they differ (clause 6).",

  payRise:
    "The agreement makes three increases: 3% from the first full pay period on or after 1 December 2025, 3% from 1 December 2026 and 2.75% from 1 September 2027 (clause 7.1). Before each of the first two, staff up to the top of General Stream Band 5 get an $800 flat structural adjustment, Band 6 gets $600 and Bands 7 and 8 get $500 (clauses 7.2–7.7). The rates on this page are the 1 December 2025 column. The next increase is due from the first full pay period on or after 1 December 2026 — for example Band 1 Range 1 Level 1 rises to $58,108. The agreement runs to 30 June 2028.",

  schedules: [
    {
      id: "tas-tssa-2025",
      title: "Tasmanian State Service Award salaries, Public Sector Union Wages Agreement 2025, from 1 December 2025",
      coverage:
        "Tasmanian State Service employees covered by the Tasmanian State Service Award in the General and Professional Streams.",
      basis: "agreement",
      effectiveFrom: "the first full pay period on or after 1 December 2025",
      rangeMeaning:
        "First and last salary point of the band. Range 2 of a band is reached through an advancement assessment point. Annual salary only — superannuation is paid on top.",
      sourceId: "tas-psuwa-2025",
      streams: [
        {
          id: "tas-general",
          name: "General Stream (Bands 1–9)",
          description:
            "Nine bands, written Band.Range.Level (B4-R2-3 is Band 4, Range 2, Level 3). Bands 4 to 8 have a second range reached through an advancement assessment point. Band 10 was removed from the General Stream from 1 December 2025 (clause 15).",
          bands: [
            {
              code: "Band 1",
              name: "General Stream Band 1",
              aliases: ["tss band 1", "tasmanian state service band 1", "tas band 1", "general stream band 1"],
              summary: "Entry band, five salary points across two ranges.",
              min: 55_616,
              max: 67_344,
              payPoints: pts("Band 1", [
                ["Range 1 Level 1", 55_616],
                ["Range 1 Level 3", 59_300],
                ["Range 2 Level 2", 62_973],
                ["Range 2 Level 4", 66_430],
                ["Range 2 Level 5", 67_344],
              ]),
            },
            {
              code: "Band 2",
              name: "General Stream Band 2",
              aliases: ["tss band 2", "tasmanian state service band 2", "tas band 2", "general stream band 2"],
              summary: "Five salary points.",
              min: 69_593,
              max: 74_837,
              payPoints: pts("Band 2", [
                ["Range 1 Level 2", 69_593],
                ["Range 1 Level 3", 70_825],
                ["Range 1 Level 4", 72_114],
                ["Range 1 Level 5", 73_808],
                ["Range 1 Level 6", 74_837],
              ]),
            },
            {
              code: "Band 3",
              name: "General Stream Band 3",
              aliases: ["tss band 3", "tasmanian state service band 3", "tas band 3", "general stream band 3"],
              summary: "Five salary points.",
              min: 77_850,
              max: 84_084,
              payPoints: pts("Band 3", [
                ["Range 1 Level 2", 77_850],
                ["Range 1 Level 3", 79_356],
                ["Range 1 Level 4", 80_840],
                ["Range 1 Level 5", 82_875],
                ["Range 1 Level 6", 84_084],
              ]),
            },
            {
              code: "Band 4",
              name: "General Stream Band 4",
              aliases: ["tss band 4", "tasmanian state service band 4", "tas band 4", "general stream band 4"],
              summary: "Seven salary points; Range 2 is reached through an advancement assessment point.",
              min: 86_325,
              max: 99_237,
              payPoints: pts("Band 4", [
                ["Range 1 Level 2", 86_325],
                ["Range 1 Level 3", 88_521],
                ["Range 1 Level 4", 90_842],
                ["Range 2 Level 2", 92_343],
                ["Range 2 Level 3", 94_692],
                ["Range 2 Level 4", 97_793],
                ["Range 2 Level 5", 99_237],
              ]),
            },
            {
              code: "Band 5",
              name: "General Stream Band 5",
              aliases: ["tss band 5", "tasmanian state service band 5", "tas band 5", "general stream band 5"],
              summary: "Four salary points; Range 2 is reached through an advancement assessment point.",
              min: 103_290,
              max: 108_307,
              payPoints: pts("Band 5", [
                ["Range 1 Level 2", 103_290],
                ["Range 1 Level 3", 105_852],
                ["Range 2 Level 1", 107_338],
                ["Range 2 Level 2", 108_307],
              ]),
            },
            {
              code: "Band 6",
              name: "General Stream Band 6",
              aliases: ["tss band 6", "tasmanian state service band 6", "tas band 6", "general stream band 6"],
              summary: "Seven salary points; Range 2 is reached through an advancement assessment point.",
              min: 112_990,
              max: 127_715,
              payPoints: pts("Band 6", [
                ["Range 1 Level 2", 112_990],
                ["Range 1 Level 3", 115_215],
                ["Range 1 Level 4", 118_921],
                ["Range 2 Level 2", 121_906],
                ["Range 2 Level 3", 124_021],
                ["Range 2 Level 4", 126_125],
                ["Range 2 Level 5", 127_715],
              ]),
            },
            {
              code: "Band 7",
              name: "General Stream Band 7",
              aliases: ["tss band 7", "tasmanian state service band 7", "tas band 7", "general stream band 7"],
              summary: "Four salary points; Range 2 is reached through an advancement assessment point.",
              min: 133_696,
              max: 140_687,
              payPoints: pts("Band 7", [
                ["Range 1 Level 2", 133_696],
                ["Range 1 Level 3", 136_336],
                ["Range 2 Level 2", 139_030],
                ["Range 2 Level 3", 140_687],
              ]),
            },
            {
              code: "Band 8",
              name: "General Stream Band 8",
              aliases: ["tss band 8", "tasmanian state service band 8", "tas band 8", "general stream band 8"],
              summary: "Four salary points; Range 2 is reached through an advancement assessment point.",
              min: 145_439,
              max: 155_221,
              payPoints: pts("Band 8", [
                ["Range 1 Level 2", 145_439],
                ["Range 1 Level 3", 148_317],
                ["Range 2 Level 2", 153_494],
                ["Range 2 Level 3", 155_221],
              ]),
            },
            {
              code: "Band 9",
              name: "General Stream Band 9",
              aliases: ["tss band 9", "tasmanian state service band 9", "tas band 9", "general stream band 9"],
              summary: "Four salary points. The top General Stream band since Band 10 was removed on 1 December 2025.",
              min: 175_521,
              max: 194_052,
              payPoints: pts("Band 9", [
                ["Range 1 Level 2", 175_521],
                ["Range 1 Level 3", 183_823],
                ["Range 1 Level 4", 192_129],
                ["Range 1 Level 5", 194_052],
              ]),
            },
          ],
        },
        {
          id: "tas-professional",
          name: "Professional Stream (Bands 1–6)",
          description:
            "A separate stream for positions that require a professional qualification. It shares salary points with the General Stream from Band 2 upward but starts higher at Band 1.",
          bands: [
            {
              code: "Professional Band 1",
              name: "Professional Stream Band 1",
              aliases: ["tss professional band 1", "professional stream band 1"],
              summary: "Six salary points.",
              min: 79_356,
              max: 101_305,
              payPoints: pts("Professional Band 1", [
                ["Range 1 Level 2", 79_356],
                ["Range 1 Level 3", 84_819],
                ["Range 1 Level 4", 88_521],
                ["Range 1 Level 5", 92_343],
                ["Range 1 Level 6", 97_793],
                ["Range 1 Level 7", 101_305],
              ]),
            },
            {
              code: "Professional Band 2",
              name: "Professional Stream Band 2",
              aliases: ["tss professional band 2", "professional stream band 2"],
              summary: "Eight salary points; entry to Band 2 and to its Range 2 is through an advancement assessment point.",
              min: 105_852,
              max: 127_715,
              payPoints: pts("Professional Band 2", [
                ["Range 1 Level 1", 105_852],
                ["Range 1 Level 2", 110_228],
                ["Range 1 Level 3", 115_215],
                ["Range 1 Level 4", 118_921],
                ["Range 1 Level 5", 121_906],
                ["Range 1 Level 6", 124_021],
                ["Range 2 Level 1", 126_125],
                ["Range 2 Level 2", 127_715],
              ]),
            },
            {
              code: "Professional Band 3",
              name: "Professional Stream Band 3",
              aliases: ["tss professional band 3", "professional stream band 3"],
              summary: "Four salary points.",
              min: 133_696,
              max: 140_687,
              payPoints: pts("Professional Band 3", [
                ["Range 1 Level 2", 133_696],
                ["Range 1 Level 3", 136_336],
                ["Range 2 Level 2", 139_030],
                ["Range 2 Level 3", 140_687],
              ]),
            },
            {
              code: "Professional Band 4",
              name: "Professional Stream Band 4",
              aliases: ["tss professional band 4", "professional stream band 4"],
              summary: "Four salary points.",
              min: 145_439,
              max: 155_221,
              payPoints: pts("Professional Band 4", [
                ["Range 1 Level 2", 145_439],
                ["Range 1 Level 3", 148_317],
                ["Range 2 Level 2", 153_494],
                ["Range 2 Level 3", 155_221],
              ]),
            },
            {
              code: "Professional Band 5",
              name: "Professional Stream Band 5",
              aliases: ["tss professional band 5", "professional stream band 5"],
              summary: "Four salary points.",
              min: 175_521,
              max: 194_052,
              payPoints: pts("Professional Band 5", [
                ["Range 1 Level 2", 175_521],
                ["Range 1 Level 3", 183_823],
                ["Range 1 Level 4", 192_129],
                ["Range 1 Level 5", 194_052],
              ]),
            },
            {
              code: "Professional Band 6",
              name: "Professional Stream Band 6",
              aliases: ["tss professional band 6", "professional stream band 6"],
              summary: "Four salary points. The top of the Professional Stream.",
              min: 206_811,
              max: 228_493,
              payPoints: pts("Professional Band 6", [
                ["Range 1 Level 2", 206_811],
                ["Range 1 Level 3", 216_605],
                ["Range 1 Level 4", 226_399],
                ["Range 1 Level 5", 228_493],
              ]),
            },
          ],
        },
      ],
    },
  ],

  progression: [
    "Salary points within a range are written Band, Range and Level — Band 4 Range 1 Level 2 is the first Band 4 point. Movement between levels within a range is by annual increment under the Tasmanian State Service Award.",
    "Bands 4 to 8 of the General Stream have a second range. Crossing from Range 1 to Range 2 is not automatic: the schedule marks an advancement assessment point between them, so the employee has to be assessed as meeting the higher range's requirements.",
    "Moving from one band to the next is a promotion to a position classified at the higher band. The bands do not overlap: the top of Band 5 is $108,307 and the bottom of Band 6 is $112,990.",
  ],

  superannuation: {
    rate: null,
    text:
      "The Public Sector Union Wages Agreement 2025 does not set an employer superannuation rate, so this page does not state one above the Superannuation Guarantee. Check your agency's advice for the rate that applies to your fund.",
    sourceId: "tas-psuwa-2025",
  },

  sources: [
    {
      id: "tas-psuwa-2025",
      title: "Public Sector Union Wages Agreement 2025 — Schedule 1, Salaries for Tasmanian State Service Award",
      publisher: "Tasmanian Industrial Commission",
      url: "https://www.tic.tas.gov.au/__data/assets/pdf_file/0010/855154/Public-Sector-Union-Wages-Agreement-2025.pdf",
      effectiveFrom: "first full pay period on or after 1 December 2025",
      verifiedOn: VERIFIED,
      note: "Column \"Base + 3% increase effective fppcooa 1 Dec 2025\". Clause 7 sets the increases, clause 4.2 the term (1 July 2025 to 30 June 2028), clause 15 removes General Stream Band 10.",
    },
    {
      id: "tas-decyp-scales",
      title: "DECYP Salary Scales as at 27 August 2026",
      publisher: "Department for Education, Children and Young People (Tasmania)",
      url: "https://publicdocumentcentre.education.tas.gov.au/library/Shared%20Documents/Salary-Scales.pdf",
      effectiveFrom: "as at 27 August 2026",
      verifiedOn: VERIFIED,
      note: "Prints the same Tasmanian State Service Award General and Professional Stream salaries — the second source for every figure on this page.",
    },
    {
      id: "tas-hoss-june-2026",
      title: "Wages and conditions update for State Service agreements (5 June 2026)",
      publisher: "Department of Premier and Cabinet, Tasmania",
      url: "https://www.dpac.tas.gov.au/working-in-the-state-service/messages-from-the-head-of-the-state-service/wages-and-conditions-update-for-state-service-agreements",
      verifiedOn: VERIFIED,
      note: "Confirms agencies began adjusting salaries and back-pay to the first full pay in December 2025 under the PSUWA, to be complete by the end of 2025–26.",
    },
  ],

  unverified: [
    "Health and Human Services (Tasmanian State Service) Award salaries — a separate award with different figures, used by the Department of Health. Not transcribed here.",
    "Senior Executive Service remuneration, which is set outside the award and the agreement.",
    "An employer superannuation rate above the Superannuation Guarantee — the agreement states none.",
    "Tasmanian teachers, nurses, allied health professionals and other staff on their own agreements (see the teacher and nurse pages).",
    "The 1 December 2026 and 1 September 2027 columns, which are printed in the agreement but are not yet in force, so only the next rise for Band 1 is quoted.",
  ],

  faqs: [
    {
      q: "What is the Tasmanian State Service pay scale in 2026?",
      a: "From the first full pay period on or after 1 December 2025, the General Stream of the Tasmanian State Service Award runs from $55,616 at Band 1 Range 1 Level 1 to $194,052 at the top of Band 9, under Schedule 1 of the Public Sector Union Wages Agreement 2025. Band 4 pays $86,325 to $99,237 and Band 6 pays $112,990 to $127,715.",
    },
    {
      q: "What does a Tasmanian State Service Band 4 earn?",
      a: "Band 4 has seven salary points: $86,325, $88,521 and $90,842 in Range 1, then $92,343, $94,692, $97,793 and $99,237 in Range 2 after the advancement assessment point.",
    },
    {
      q: "When is the next Tasmanian State Service pay rise?",
      a: "From the first full pay period on or after 1 December 2026: a flat structural adjustment ($800 up to the top of Band 5, $600 at Band 6, $500 at Bands 7 and 8) followed by 3%. A further 2.75% follows from 1 September 2027. The agreement runs to 30 June 2028.",
    },
    {
      q: "What happened to Band 10?",
      a: "Clause 15 of the Public Sector Union Wages Agreement 2025 removed Band 10 from the General Stream from the first full pay period on or after 1 December 2025, so Band 9 is now the top General Stream band.",
    },
    {
      q: "What is the Professional Stream?",
      a: "A parallel stream in the Tasmanian State Service Award for positions that require a professional qualification. Professional Band 1 starts at $79,356 — above General Stream Band 1 — and the stream runs to $228,493 at Professional Band 6.",
    },
    {
      q: "Were the December 2025 pay rises back-paid?",
      a: "Yes. The Head of the State Service said on 5 June 2026 that agencies had begun adjusting salaries and paying back-pay to the first full pay in December 2025, with every agency to finish by the end of the 2025–26 financial year.",
    },
  ],
};

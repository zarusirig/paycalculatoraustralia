// =============================================================================
// South Australian public sector — classification pay.
//
// TWO AGREEMENTS, KEPT APART:
//
//   1. sa-salaried-2026 — South Australian Public Sector Enterprise Agreement:
//      Salaried 2026 (SAET ET-26-00776, approved 4 March 2026, nominal life to
//      1 July 2027). Appendix 2, Schedule 1.1 (Administrative Services Stream,
//      printed pp. 66–67), Schedule 1.11 (Operational Services, p. 82) and
//      Schedule 1.13 (Professional Officers, p. 93). Every figure below is the
//      column headed "First full pay period on or after 1 July 2026" — the
//      rate in force now. Clause 7.2.3 schedules one more increase, from the
//      first full pay period on or after 1 July 2027.
//      https://www.saet.sa.gov.au/app/uploads/2026/03/SA-Public-Sector-Enterprise-Agreement-Salaried-2026-04032026.pdf
//      Cross-checked against the Department for Education rate sheet "PUBLIC
//      SECTOR EMPLOYEES EFFECTIVE 3/07/2026", which matches to the dollar.
//
//   2. sa-sso-2026 — School Services Officers are NOT on the salaried agreement.
//      They are paid under the South Australian School and Preschool Education
//      Staff Enterprise Agreement 2024 (SAET ET-24-00640, approved 25 March
//      2024), Schedule 1.6, column "1st ffpp on or after 1.5.2026" — the last
//      column that agreement makes.
//      https://www.saet.sa.gov.au/app/uploads/2024/03/ET-24-00640-Enterprise-agreement-approval-South-Australian-School-and-Preschool-Education-Staff-Enterprise-Agreement-2024.pdf
//      Cross-checked against the Department for Education sheet "SCHOOL
//      SERVICES OFFICER EFFECTIVE 8/05/2026", which matches to the dollar.
//
// Labels are the agreement's own ("1st year adult" at ASO-1, numbered
// increments elsewhere). The department's sheet calls ASO-1 steps "Tier 5–10";
// the agreement's labels win. PO and OPS are published as bottom and top of
// the level only, because only those two points were transcribed.
//
// Read 23 September 2026.
// =============================================================================

import type { Jurisdiction } from "./types";

const VERIFIED = "23 September 2026";

export const SA: Jurisdiction = {
  slug: "sa",
  name: "South Australian public sector",
  shortName: "SA public sector",
  label: "South Australia (ASO, SSO)",
  verifiedOn: VERIFIED,

  levelGuide: {
    scheduleId: "sa-salaried-2026",
    streamIds: ["sa-aso"],
    extraScheduleIds: ["sa-sso-2026"],
    year: "2026",
    title: "SA public sector salary by level: ASO-1 to ASO-8 and SSO-1 to SSO-6",
    intro:
      "Administrative Services Officers (ASO) and School Services Officers (SSO) are the two South Australian classifications people search for most, so each level has its own section. ASO rates are from the Salaried 2026 agreement from the first full pay period on or after 1 July 2026; SSO rates are from the separate education staff agreement from the first full pay period on or after 1 May 2026. Every salary links to the nearest take-home pay page.",
  },

  headline:
    "From the first full pay period on or after 1 July 2026, an ASO-3 in the South Australian public sector is paid $74,095 to $78,694, an ASO-4 $82,212 to $86,180, an ASO-5 $92,122 to $102,456 and an ASO-6 $105,747 to $111,854, under the South Australian Public Sector Enterprise Agreement: Salaried 2026. School Services Officers are on a separate agreement: from 1 May 2026 an SSO-1 is paid $58,360 to $69,759 and an SSO-2 $73,478 to $80,950.",

  metaTitle: "SA Public Sector Pay Rates 2026 — ASO & SSO Pay Scales (ASO1–8)",
  metaDescription:
    "South Australian public sector pay from July 2026: every ASO-1 to ASO-8 increment, SSO-1 to SSO-6 School Services Officer rates, PO and OPS ranges and take-home pay.",

  instrument:
    "Most South Australian public servants are paid under the South Australian Public Sector Enterprise Agreement: Salaried 2026, approved by the South Australian Employment Tribunal on 4 March 2026. It sets the Administrative Services (ASO), Operational Services (OPS), Professional Officer (PO) and other salaried streams in Appendix 2. School Services Officers in government schools and preschools are covered instead by the South Australian School and Preschool Education Staff Enterprise Agreement 2024.",

  payRise:
    "The Salaried 2026 agreement sets three increases, each from the first full pay period on or after the date: 1 August 2025, 1 July 2026 and 1 July 2027 (clause 7.2). The rates on this page are the 1 July 2026 column; the next increase is from the first full pay period on or after 1 July 2027. SSO rates last moved from the first full pay period on or after 1 May 2026, which is the final increase in the 2024 education staff agreement; that agreement's nominal life runs about 36 months from 25 March 2024, and no later SSO rate is published.",

  schedules: [
    {
      id: "sa-salaried-2026",
      title: "SA Public Sector Enterprise Agreement: Salaried 2026, from 1 July 2026",
      coverage:
        "Salaried employees of South Australian public sector agencies covered by the agreement, including the administrative, operational and professional streams.",
      basis: "agreement",
      effectiveFrom: "the first full pay period on or after 1 July 2026",
      rangeMeaning:
        "First and last increment of the level. Annual salary only — superannuation is paid on top.",
      sourceId: "sa-salaried-2026",
      streams: [
        {
          id: "sa-aso",
          name: "Administrative Services Stream (ASO)",
          code: "ASO",
          description:
            "Appendix 2, Schedule 1.1. Clause 7.17 removed the age-based ASO-1 junior rates from the first full pay period on or after 1 August 2025, so ASO-1 now starts at the first adult year.",
          bands: [
            {
              code: "ASO-1",
              name: "Administrative Services Officer Level 1",
              aliases: ["aso1", "aso-1 salary"],
              summary: "Six increments, labelled by adult year of service.",
              min: 58_626,
              max: 63_695,
              payPoints: [
                { label: "ASO-1 1st year adult", annual: 58_626 },
                { label: "ASO-1 2nd year adult", annual: 59_573 },
                { label: "ASO-1 3rd year adult", annual: 60_603 },
                { label: "ASO-1 4th year adult", annual: 61_720 },
                { label: "ASO-1 5th year adult", annual: 62_665 },
                { label: "ASO-1 6th year adult", annual: 63_695 },
              ],
            },
            {
              code: "ASO-2",
              name: "Administrative Services Officer Level 2",
              aliases: ["aso2", "aso2 salary"],
              summary: "Three increments.",
              min: 66_442,
              max: 69_504,
              payPoints: [
                { label: "ASO-2 increment 1", annual: 66_442 },
                { label: "ASO-2 increment 2", annual: 68_254 },
                { label: "ASO-2 increment 3", annual: 69_504 },
              ],
            },
            {
              code: "ASO-3",
              name: "Administrative Services Officer Level 3",
              aliases: ["aso3", "aso3 salary", "aso3 pay rate"],
              summary: "Three increments.",
              min: 74_095,
              max: 78_694,
              payPoints: [
                { label: "ASO-3 increment 1", annual: 74_095 },
                { label: "ASO-3 increment 2", annual: 76_390 },
                { label: "ASO-3 increment 3", annual: 78_694 },
              ],
            },
            {
              code: "ASO-4",
              name: "Administrative Services Officer Level 4",
              aliases: ["aso4", "aso4 salary", "aso4 pay rate"],
              summary: "Four increments.",
              min: 82_212,
              max: 86_180,
              payPoints: [
                { label: "ASO-4 increment 1", annual: 82_212 },
                { label: "ASO-4 increment 2", annual: 83_995 },
                { label: "ASO-4 increment 3", annual: 85_776 },
                { label: "ASO-4 increment 4", annual: 86_180 },
              ],
            },
            {
              code: "ASO-5",
              name: "Administrative Services Officer Level 5",
              aliases: ["aso5", "aso5 salary"],
              summary: "Four increments.",
              min: 92_122,
              max: 102_456,
              payPoints: [
                { label: "ASO-5 increment 1", annual: 92_122 },
                { label: "ASO-5 increment 2", annual: 95_410 },
                { label: "ASO-5 increment 3", annual: 98_937 },
                { label: "ASO-5 increment 4", annual: 102_456 },
              ],
            },
            {
              code: "ASO-6",
              name: "Administrative Services Officer Level 6",
              aliases: ["aso6", "aso6 salary", "aso6 salary sa government"],
              summary: "Three increments.",
              min: 105_747,
              max: 111_854,
              payPoints: [
                { label: "ASO-6 increment 1", annual: 105_747 },
                { label: "ASO-6 increment 2", annual: 108_800 },
                { label: "ASO-6 increment 3", annual: 111_854 },
              ],
            },
            {
              code: "ASO-7",
              name: "Administrative Services Officer Level 7",
              aliases: ["aso7", "aso7 salary"],
              summary: "Four increments.",
              min: 116_089,
              max: 125_490,
              payPoints: [
                { label: "ASO-7 increment 1", annual: 116_089 },
                { label: "ASO-7 increment 2", annual: 119_294 },
                { label: "ASO-7 increment 3", annual: 122_333 },
                { label: "ASO-7 increment 4", annual: 125_490 },
              ],
            },
            {
              code: "ASO-8",
              name: "Administrative Services Officer Level 8",
              aliases: ["aso8", "aso8 salary"],
              summary: "Three increments — the top of the ASO stream.",
              min: 130_046,
              max: 134_956,
              payPoints: [
                { label: "ASO-8 increment 1", annual: 130_046 },
                { label: "ASO-8 increment 2", annual: 132_500 },
                { label: "ASO-8 increment 3", annual: 134_956 },
              ],
            },
          ],
        },
        {
          id: "sa-mas-sssm",
          name: "Management and senior specialist levels",
          description:
            "Single-rate levels printed in the same schedule as the ASO stream. The agreement notes that there will be no new appointments to MAS 3 after it was approved.",
          bands: [
            {
              code: "MAS 1",
              name: "Management Administrative Services 1",
              aliases: ["mas1"],
              summary: "Single rate.",
              min: 114_204,
              max: 114_204,
            },
            {
              code: "MAS 2",
              name: "Management Administrative Services 2",
              aliases: ["mas2"],
              summary: "Single rate.",
              min: 127_823,
              max: 127_823,
            },
            {
              code: "MAS 3",
              name: "Management Administrative Services 3",
              aliases: ["mas3"],
              summary: "Single rate. Closed to new appointments.",
              min: 137_297,
              max: 137_297,
            },
            {
              code: "SS/SM 1",
              name: "Senior Specialist / Senior Manager 1",
              aliases: ["sssm1"],
              summary: "Single rate.",
              min: 144_421,
              max: 144_421,
            },
            {
              code: "SS/SM 2",
              name: "Senior Specialist / Senior Manager 2",
              aliases: ["sssm2"],
              summary: "Single rate.",
              min: 153_887,
              max: 153_887,
            },
          ],
        },
        {
          id: "sa-po",
          name: "Professional Officers (PO)",
          code: "PO",
          description:
            "Appendix 2, Schedule 1.13. Bottom and top increment of each level only. PO-1 has separate entry points for a three-year degree ($73,533) and a four-year degree ($76,643).",
          bands: [
            { code: "PO-1", name: "Professional Officer 1", aliases: ["sa po1"], summary: "From the three-year-degree entry point to the 5th increment.", min: 73_533, max: 89_764 },
            { code: "PO-2", name: "Professional Officer 2", aliases: ["sa po2"], summary: "1st to 6th increment.", min: 94_769, max: 109_787 },
            { code: "PO-3", name: "Professional Officer 3", aliases: ["sa po3"], summary: "1st to 4th increment.", min: 111_870, max: 119_994 },
            { code: "PO-4", name: "Professional Officer 4", aliases: ["sa po4"], summary: "1st to 4th increment.", min: 122_752, max: 133_635 },
            { code: "PO-5", name: "Professional Officer 5", aliases: ["sa po5"], summary: "1st to 4th increment.", min: 136_746, max: 149_562 },
            { code: "PO-6", name: "Professional Officer 6", aliases: ["sa po6"], summary: "Single rate.", min: 164_221, max: 164_221 },
          ],
        },
        {
          id: "sa-ops",
          name: "Operational Services Stream (OPS)",
          code: "OPS",
          description: "Appendix 2, Schedule 1.11. Bottom and top increment of each level only.",
          bands: [
            { code: "OPS-1", name: "Operational Services Officer 1", aliases: ["ops1"], summary: "1st to 6th adult year.", min: 57_853, max: 63_695 },
            { code: "OPS-2", name: "Operational Services Officer 2", aliases: ["ops2"], summary: "Increments 1 to 3.", min: 66_441, max: 69_504 },
            { code: "OPS-3", name: "Operational Services Officer 3", aliases: ["ops3"], summary: "Increments 1 to 3.", min: 74_095, max: 78_694 },
            { code: "OPS-4", name: "Operational Services Officer 4", aliases: ["ops4"], summary: "Increments 1 to 4.", min: 82_212, max: 86_180 },
            { code: "OPS-5", name: "Operational Services Officer 5", aliases: ["ops5"], summary: "Increments 1 to 3.", min: 88_149, max: 94_236 },
            { code: "OPS-6", name: "Operational Services Officer 6", aliases: ["ops6"], summary: "Increments 1 to 3.", min: 97_292, max: 102_456 },
            { code: "OPS-7", name: "Operational Services Officer 7", aliases: ["ops7"], summary: "Increments 1 to 3.", min: 105_747, max: 111_854 },
          ],
        },
      ],
    },
    {
      id: "sa-sso-2026",
      title: "School Services Officers — Education Staff Enterprise Agreement 2024, from 1 May 2026",
      coverage:
        "School Services Officers in South Australian government schools and preschools, employed by the Department for Education. Not covered by the Salaried 2026 agreement.",
      basis: "agreement",
      effectiveFrom: "the first full pay period on or after 1 May 2026",
      rangeMeaning:
        "First and last increment of the level. The top increment of each SSO level is criteria-based: the department's rate sheet says it is \"only applicable to those with relevant qualifications who have completed the top tier increment process\".",
      sourceId: "sa-education-2024",
      note:
        "These are the standard per-annum rates for School Services Officers with leave conditions. The department also publishes loaded variants — a 16% loading version, the same spread over 52 weeks, and a casual rate — which are not reproduced here.",
      streams: [
        {
          id: "sa-sso",
          name: "School Services Officers (SSO)",
          code: "SSO",
          description:
            "Schedule 1.6 of the South Australian School and Preschool Education Staff Enterprise Agreement 2024. The department's rate sheet calls the increments \"tiers\".",
          bands: [
            {
              code: "SSO-1",
              name: "School Services Officer Level 1",
              aliases: ["sso1", "sso level 1", "sso pay rates"],
              summary: "Seven increments; the seventh is criteria-based.",
              min: 58_360,
              max: 69_759,
              payPoints: [
                { label: "SSO-1 increment 1", annual: 58_360 },
                { label: "SSO-1 increment 2", annual: 61_383 },
                { label: "SSO-1 increment 3", annual: 63_195 },
                { label: "SSO-1 increment 4", annual: 64_856 },
                { label: "SSO-1 increment 5", annual: 66_525 },
                { label: "SSO-1 increment 6", annual: 68_335 },
                { label: "SSO-1 increment 7 (top tier)", annual: 69_759 },
              ],
            },
            {
              code: "SSO-2",
              name: "School Services Officer Level 2",
              aliases: ["sso2", "sso level 2"],
              summary: "Four increments; the fourth is criteria-based.",
              min: 73_478,
              max: 80_950,
              payPoints: [
                { label: "SSO-2 increment 1", annual: 73_478 },
                { label: "SSO-2 increment 2", annual: 76_506 },
                { label: "SSO-2 increment 3", annual: 79_526 },
                { label: "SSO-2 increment 4 (top tier)", annual: 80_950 },
              ],
            },
            {
              code: "SSO-3",
              name: "School Services Officer Level 3",
              aliases: ["sso3", "sso level 3"],
              summary: "Four increments; the fourth is criteria-based.",
              min: 85_566,
              max: 92_870,
              payPoints: [
                { label: "SSO-3 increment 1", annual: 85_566 },
                { label: "SSO-3 increment 2", annual: 88_598 },
                { label: "SSO-3 increment 3", annual: 91_624 },
                { label: "SSO-3 increment 4 (top tier)", annual: 92_870 },
              ],
            },
            {
              code: "SSO-4",
              name: "School Services Officer Level 4",
              aliases: ["sso4", "sso level 4"],
              summary: "Four increments; the fourth is criteria-based.",
              min: 98_271,
              max: 104_058,
              payPoints: [
                { label: "SSO-4 increment 1", annual: 98_271 },
                { label: "SSO-4 increment 2", annual: 100_538 },
                { label: "SSO-4 increment 3", annual: 102_809 },
                { label: "SSO-4 increment 4 (top tier)", annual: 104_058 },
              ],
            },
            {
              code: "SSO-5",
              name: "School Services Officer Level 5",
              aliases: ["sso5", "sso level 5"],
              summary: "Five increments; the fifth is criteria-based.",
              min: 110_667,
              max: 125_220,
              payPoints: [
                { label: "SSO-5 increment 1", annual: 110_667 },
                { label: "SSO-5 increment 2", annual: 114_903 },
                { label: "SSO-5 increment 3", annual: 119_441 },
                { label: "SSO-5 increment 4", annual: 123_974 },
                { label: "SSO-5 increment 5 (top tier)", annual: 125_220 },
              ],
            },
            {
              code: "SSO-6",
              name: "School Services Officer Level 6",
              aliases: ["sso6", "sso level 6"],
              summary: "Four increments; the fourth is criteria-based.",
              min: 130_413,
              max: 139_147,
              payPoints: [
                { label: "SSO-6 increment 1", annual: 130_413 },
                { label: "SSO-6 increment 2", annual: 133_908 },
                { label: "SSO-6 increment 3", annual: 137_901 },
                { label: "SSO-6 increment 4 (top tier)", annual: 139_147 },
              ],
            },
          ],
        },
      ],
    },
  ],

  progression: [
    "Each ASO level has between three and six increments. ASO-1 is the only level labelled by year of service (1st to 6th year adult); every other level numbers its increments. The gap between increments varies from $404 (the last ASO-4 step) to $3,527 (ASO-5 increment 2 to 3), so the bigger movement is between levels, which in South Australia happens by appointment to a position classified at the higher level rather than by time served.",
    "Because the ASO levels do not overlap, the top of one level is always below the bottom of the next: the top of ASO-4 is $86,180 and the bottom of ASO-5 is $92,122, a gap of $5,942. The same holds between ASO-5 ($102,456) and ASO-6 ($105,747).",
    "School Services Officers progress through numbered increments, but the top increment of every SSO level is not automatic. The Department for Education's rate sheet says the top tier is only applicable to those with relevant qualifications who have completed the top tier increment process.",
    "The age-based ASO-1 rates for employees aged 20 and under were removed from the first full pay period on or after 1 August 2025 (clause 7.17 of the Salaried 2026 agreement); the ASO-1 table now starts at the 1st year adult increment.",
  ],

  superannuation: {
    rate: null,
    text:
      "Neither agreement states an employer superannuation percentage. The Department for Education says superannuation is paid to Super SA as the default fund, and that employees have been able to choose their own fund since 30 November 2022. Without a published above-guarantee rate, treat the Superannuation Guarantee as the floor and check your own agency's arrangement before comparing an SA public sector offer with another state.",
    sourceId: "sa-education-rates",
  },

  sources: [
    {
      id: "sa-salaried-2026",
      title: "South Australian Public Sector Enterprise Agreement: Salaried 2026 (ET-26-00776)",
      publisher: "South Australian Employment Tribunal",
      url: "https://www.saet.sa.gov.au/app/uploads/2026/03/SA-Public-Sector-Enterprise-Agreement-Salaried-2026-04032026.pdf",
      effectiveFrom: "first full pay period on or after 1 July 2026",
      verifiedOn: VERIFIED,
      note:
        "Appendix 2, Schedule 1.1 (ASO, MAS, SS/SM, pp. 66–67), Schedule 1.11 (OPS, p. 82) and Schedule 1.13 (PO, p. 93); increases at clause 7.2.",
    },
    {
      id: "sa-education-2024",
      title: "South Australian School and Preschool Education Staff Enterprise Agreement 2024 (ET-24-00640)",
      publisher: "South Australian Employment Tribunal",
      url: "https://www.saet.sa.gov.au/app/uploads/2024/03/ET-24-00640-Enterprise-agreement-approval-South-Australian-School-and-Preschool-Education-Staff-Enterprise-Agreement-2024.pdf",
      effectiveFrom: "first full pay period on or after 1 May 2026",
      verifiedOn: VERIFIED,
      note: "Schedule 1.6 – School Services Officers, printed p. 57, column 1.5.2026.",
    },
    {
      id: "sa-education-rates",
      title: "School Services Officer pay rates, effective 8/05/2026",
      publisher: "Department for Education (SA)",
      url: "https://www.education.sa.gov.au/docs/p-and-c/employee-relations-awards-and-agreements/school-services-officers-pay-rates.pdf",
      effectiveFrom: "8 May 2026",
      verifiedOn: VERIFIED,
      note: "The department's own SSO rate sheet; matches Schedule 1.6 to the dollar.",
    },
    {
      id: "sa-education-ps-rates",
      title: "Public sector employees pay rates, effective 3/07/2026",
      publisher: "Department for Education (SA)",
      url: "https://www.education.sa.gov.au/docs/p-and-c/employee-relations-awards-and-agreements/public-sector-employees-award.pdf",
      effectiveFrom: "3 July 2026",
      verifiedOn: VERIFIED,
      note: "Matches the Salaried 2026 agreement's 1 July 2026 column to the dollar.",
    },
  ],

  unverified: [
    "Every PO and OPS increment between the bottom and top of each level — only the two end points were transcribed, so the page shows the range and not the steps.",
    "Other salaried streams in Appendix 2 of the Salaried 2026 agreement (technical, legal, medical scientist, allied health and so on), which have their own schedules.",
    "The 1 July 2027 column of the Salaried 2026 agreement. It is published, but it is not in force until the first full pay period on or after 1 July 2027 and is not tabled here.",
    "The loaded, 52-week and casual SSO variants on the Department for Education's rate sheet.",
    "An employer superannuation percentage — neither agreement states one.",
    "SA Health nurses and SA teachers, who are on their own agreements (see the nurse and teacher pages).",
  ],

  faqs: [
    {
      q: "What are the SSO pay rates in South Australia?",
      a: "From the first full pay period on or after 1 May 2026, School Services Officers are paid $58,360 to $69,759 at SSO-1, $73,478 to $80,950 at SSO-2, $85,566 to $92,870 at SSO-3, $98,271 to $104,058 at SSO-4, $110,667 to $125,220 at SSO-5 and $130,413 to $139,147 at SSO-6, under the South Australian School and Preschool Education Staff Enterprise Agreement 2024. The top increment of each level is criteria-based.",
    },
    {
      q: "What is an ASO4 salary?",
      a: "From the first full pay period on or after 1 July 2026, ASO-4 pays $82,212, $83,995, $85,776 and $86,180 across its four increments under the South Australian Public Sector Enterprise Agreement: Salaried 2026.",
    },
    {
      q: "What is an ASO6 salary in the SA government?",
      a: "ASO-6 pays $105,747, $108,800 and $111,854 across three increments from the first full pay period on or after 1 July 2026.",
    },
    {
      q: "When is the next SA public sector pay rise?",
      a: "For ASO, OPS and PO employees, from the first full pay period on or after 1 July 2027 (clause 7.2.3 of the Salaried 2026 agreement). The 1 May 2026 SSO increase was the last one in the 2024 education staff agreement, so the next SSO rise depends on a replacement agreement.",
    },
    {
      q: "Are School Services Officers on the same agreement as ASOs?",
      a: "No. ASOs are paid under the South Australian Public Sector Enterprise Agreement: Salaried 2026, and School Services Officers under the South Australian School and Preschool Education Staff Enterprise Agreement 2024. The two move on different dates — 1 July for the salaried agreement and 1 May for the SSO schedule.",
    },
  ],
};

// =============================================================================
// Victorian Public Service (VPS) — classification pay.
//
// Unlike the APS, Victoria does have one salary table: Schedule C of the
// Victorian Public Service Enterprise Agreement 2024 covers every VPS employer,
// with grades 1 to 7 divided into value ranges and each value range divided
// into progression steps. Every step below is transcribed from the 1 May 2026
// column of that schedule — the operative column until 1 May 2027.
//
// Executives sit outside the agreement: their bands are set by the Victorian
// Independent Remuneration Tribunal and are expressed as total remuneration
// package, so they are kept in a separate schedule and never merged with the
// base salaries above them.
// =============================================================================

import type { Jurisdiction } from "./types";

export const VIC: Jurisdiction = {
  slug: "vic",
  name: "Victorian Public Service",
  shortName: "VPS",
  label: "Victoria (VPS)",
  verifiedOn: "28 August 2026",

  headline:
    "From 1 May 2026 a VPS Grade 3 is paid between $81,496 and $98,955, a VPS 4 between $100,894 and $114,476, a VPS 5 between $116,413 and $140,849 and a VPS 6 between $142,790 and $191,084. Those are the value ranges in Schedule C of the Victorian Public Service Enterprise Agreement 2024, which applies across the whole VPS — Victoria, unlike the APS, does publish a single table.",

  metaTitle: "VPS Salary Bands 2026 — Victorian Public Service Pay Scale (VPS 1–7)",
  metaDescription:
    "Every VPS pay point from 1 May 2026: grades 1 to 7, value ranges and progression steps from Schedule C of the Victorian Public Service Enterprise Agreement 2024, plus executive bands and what each band is worth after tax.",

  instrument:
    "Victorian Public Service Enterprise Agreement 2024. Grades and value ranges are defined in Schedule C, and the classification and value range standard descriptors sit alongside the salary table.",

  payRise:
    "The agreement sets four annual increases of 3% each, operative from 1 May 2024, 1 May 2025, 1 May 2026 and 1 May 2027 — 12% over the life of the agreement. The rates on this page are the 1 May 2026 column, which applies until the 1 May 2027 increase.",

  schedules: [
    {
      id: "vps-2026",
      title: "VPS salaries from 1 May 2026 — Enterprise Agreement 2024, Schedule C",
      coverage:
        "All Victorian Public Service employers covered by the agreement, across grades 1 to 7 including the Senior Technical Specialist structure at grade 7.",
      basis: "agreement",
      effectiveFrom: "1 May 2026",
      rangeMeaning:
        "First and last progression step of the value range. Salary only — superannuation is paid on top.",
      sourceId: "vps-ea-2024",
      streams: [
        {
          id: "vps-grades",
          name: "VPS grades and value ranges",
          description:
            "Each grade is divided into value ranges (3.1, 3.2 and so on) that reflect work value, and each value range into progression steps that reflect time and performance. Movement between value ranges follows a job resizing review; movement between steps follows the annual performance cycle.",
          bands: [
            {
              code: "VPS 1.1",
              name: "VPS Grade 1, Value Range 1.1",
              group: "VPS Grade 1",
              aliases: ["vps1", "vps grade 1"],
              summary: "The base of the VPS structure. Four progression steps.",
              min: 56_677,
              max: 60_164,
              payPoints: [
                { label: "1.1.1", annual: 56_677 },
                { label: "1.1.2", annual: 57_836 },
                { label: "1.1.3", annual: 59_000 },
                { label: "1.1.4", annual: 60_164 },
              ],
            },
            {
              code: "VPS 2.1",
              name: "VPS Grade 2, Value Range 2.1",
              group: "VPS Grade 2",
              aliases: ["vps2", "vps grade 2"],
              summary: "Entry value range of grade 2. Eight progression steps.",
              min: 62_104,
              max: 70_930,
              payPoints: [
                { label: "2.1.1", annual: 62_104 },
                { label: "2.1.2", annual: 63_366 },
                { label: "2.1.3", annual: 64_624 },
                { label: "2.1.4", annual: 65_889 },
                { label: "2.1.5", annual: 67_145 },
                { label: "2.1.6", annual: 68_408 },
                { label: "2.1.7", annual: 69_669 },
                { label: "2.1.8", annual: 70_930 },
              ],
            },
            {
              code: "VPS 2.2",
              name: "VPS Grade 2, Value Range 2.2",
              group: "VPS Grade 2",
              aliases: [],
              summary: "Upper value range of grade 2. Seven progression steps.",
              min: 72_189,
              max: 79_753,
              payPoints: [
                { label: "2.2.1", annual: 72_189 },
                { label: "2.2.2", annual: 73_450 },
                { label: "2.2.3", annual: 74_708 },
                { label: "2.2.4", annual: 75_971 },
                { label: "2.2.5", annual: 77_228 },
                { label: "2.2.6", annual: 78_493 },
                { label: "2.2.7", annual: 79_753 },
              ],
            },
            {
              code: "VPS 3.1",
              name: "VPS Grade 3, Value Range 3.1",
              group: "VPS Grade 3",
              aliases: ["vps3", "vps grade 3", "vps3 salary"],
              summary: "Entry value range of grade 3. Six progression steps.",
              min: 81_496,
              max: 90_227,
              payPoints: [
                { label: "3.1.1", annual: 81_496 },
                { label: "3.1.2", annual: 83_244 },
                { label: "3.1.3", annual: 84_989 },
                { label: "3.1.4", annual: 86_735 },
                { label: "3.1.5", annual: 88_479 },
                { label: "3.1.6", annual: 90_227 },
              ],
            },
            {
              code: "VPS 3.2",
              name: "VPS Grade 3, Value Range 3.2",
              group: "VPS Grade 3",
              aliases: [],
              summary: "Upper value range of grade 3. Five progression steps.",
              min: 91_971,
              max: 98_955,
              payPoints: [
                { label: "3.2.1", annual: 91_971 },
                { label: "3.2.2", annual: 93_719 },
                { label: "3.2.3", annual: 95_465 },
                { label: "3.2.4", annual: 97_207 },
                { label: "3.2.5", annual: 98_955 },
              ],
            },
            {
              code: "VPS 4.1",
              name: "VPS Grade 4, Value Range 4.1",
              group: "VPS Grade 4",
              aliases: ["vps4", "vps grade 4"],
              summary:
                "Grade 4 has a single value range with seven progression steps — the widest single range below grade 6.",
              min: 100_894,
              max: 114_476,
              payPoints: [
                { label: "4.1.1", annual: 100_894 },
                { label: "4.1.2", annual: 103_159 },
                { label: "4.1.3", annual: 105_423 },
                { label: "4.1.4", annual: 107_681 },
                { label: "4.1.5", annual: 109_949 },
                { label: "4.1.6", annual: 112_212 },
                { label: "4.1.7", annual: 114_476 },
              ],
            },
            {
              code: "VPS 5.1",
              name: "VPS Grade 5, Value Range 5.1",
              group: "VPS Grade 5",
              aliases: ["vps5", "vps grade 5", "vps5 salary range"],
              summary: "Entry value range of grade 5. Five progression steps.",
              min: 116_413,
              max: 128_631,
              payPoints: [
                { label: "5.1.1", annual: 116_413 },
                { label: "5.1.2", annual: 119_902 },
                { label: "5.1.3", annual: 123_391 },
                { label: "5.1.4", annual: 126_880 },
                { label: "5.1.5", annual: 128_631 },
              ],
            },
            {
              code: "VPS 5.2",
              name: "VPS Grade 5, Value Range 5.2",
              group: "VPS Grade 5",
              aliases: [],
              summary: "Upper value range of grade 5. Five progression steps.",
              min: 128_635,
              max: 140_849,
              payPoints: [
                { label: "5.2.1", annual: 128_635 },
                { label: "5.2.2", annual: 132_122 },
                { label: "5.2.3", annual: 135_612 },
                { label: "5.2.4", annual: 139_100 },
                { label: "5.2.5", annual: 140_849 },
              ],
            },
            {
              code: "VPS 6.1",
              name: "VPS Grade 6, Value Range 6.1",
              group: "VPS Grade 6",
              aliases: ["vps6", "vps grade 6"],
              summary: "Entry value range of grade 6. Seven progression steps.",
              min: 142_790,
              max: 166_938,
              payPoints: [
                { label: "6.1.1", annual: 142_790 },
                { label: "6.1.2", annual: 147_195 },
                { label: "6.1.3", annual: 151_602 },
                { label: "6.1.4", annual: 156_008 },
                { label: "6.1.5", annual: 160_413 },
                { label: "6.1.6", annual: 164_820 },
                { label: "6.1.7", annual: 166_938 },
              ],
            },
            {
              code: "VPS 6.2",
              name: "VPS Grade 6, Value Range 6.2",
              group: "VPS Grade 6",
              aliases: [],
              summary: "Upper value range of grade 6. Seven progression steps.",
              min: 166_939,
              max: 191_084,
              payPoints: [
                { label: "6.2.1", annual: 166_939 },
                { label: "6.2.2", annual: 171_345 },
                { label: "6.2.3", annual: 175_751 },
                { label: "6.2.4", annual: 180_156 },
                { label: "6.2.5", annual: 184_563 },
                { label: "6.2.6", annual: 188_969 },
                { label: "6.2.7", annual: 191_084 },
              ],
            },
            {
              code: "VPS 7.1",
              name: "VPS Grade 7, Value Range 7.1",
              group: "VPS Grade 7",
              aliases: ["vps7", "vps grade 7", "senior technical specialist"],
              summary:
                "Entry value range of grade 7, which also carries the Senior Technical Specialist structure. Five progression steps.",
              min: 193_946,
              max: 217_218,
              payPoints: [
                { label: "7.1.1", annual: 193_946 },
                { label: "7.1.2", annual: 201_184 },
                { label: "7.1.3", annual: 208_423 },
                { label: "7.1.4", annual: 215_660 },
                { label: "7.1.5", annual: 217_218 },
              ],
            },
            {
              code: "VPS 7.2",
              name: "VPS Grade 7, Value Range 7.2",
              group: "VPS Grade 7",
              aliases: [],
              summary: "Middle value range of grade 7. Five progression steps.",
              min: 217_223,
              max: 240_496,
              payPoints: [
                { label: "7.2.1", annual: 217_223 },
                { label: "7.2.2", annual: 224_460 },
                { label: "7.2.3", annual: 231_699 },
                { label: "7.2.4", annual: 238_937 },
                { label: "7.2.5", annual: 240_496 },
              ],
            },
            {
              code: "VPS 7.3",
              name: "VPS Grade 7, Value Range 7.3",
              group: "VPS Grade 7",
              aliases: [],
              summary: "Top value range of the VPS structure. Five progression steps.",
              min: 240_496,
              max: 263_771,
              payPoints: [
                { label: "7.3.1", annual: 240_496 },
                { label: "7.3.2", annual: 247_733 },
                { label: "7.3.3", annual: 254_971 },
                { label: "7.3.4", annual: 262_210 },
                { label: "7.3.5", annual: 263_771 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "vic-executives-2026",
      title: "Victorian public service executives from 1 July 2026",
      coverage:
        "Executives employed in Victorian public service bodies — above the VPS grade structure. Set by determination of the Victorian Independent Remuneration Tribunal, not by the enterprise agreement.",
      basis: "determination",
      effectiveFrom: "1 July 2026",
      rangeMeaning:
        "Base and top of the band, expressed as total remuneration package (TRP) rather than base salary — so these figures are not directly comparable with the VPS salaries above.",
      sourceId: "vic-remuneration-tribunal",
      streams: [
        {
          id: "vic-ses",
          name: "Senior Executive Service bands",
          description:
            "The same band values apply to Administrative Office Heads (SES-1 / AO Head-1 and so on).",
          bands: [
            {
              code: "SES-1",
              name: "Victorian SES-1",
              aliases: ["vic ses 1", "ses 1 victoria"],
              summary: "First executive band above VPS grade 7.",
              min: 240_938,
              max: 310_385,
            },
            {
              code: "SES-2",
              name: "Victorian SES-2",
              aliases: ["vic ses 2", "ses 2 victoria"],
              summary: "Second executive band.",
              min: 310_386,
              max: 447_266,
            },
            {
              code: "SES-3",
              name: "Victorian SES-3",
              aliases: ["vic ses 3", "ses 3 victoria"],
              summary: "Top executive band below department head.",
              min: 447_267,
              max: 594_844,
            },
          ],
        },
      ],
    },
  ],

  progression: [
    "Progression through the steps inside a value range is not automatic. Clause 31 of the agreement ties it to the annual performance cycle: you are eligible to be considered when you have been employed in the VPS continuously for 12 months at the end of the cycle, have been at your current classification and progression step for 12 months, and have a current performance and development plan in place.",
    "If you are already on the top step of your grade or value range and you achieve progression, you receive a top of grade or value range payment instead — a lump sum of 1.5% of your salary as at 30 June of that performance cycle. It replaced a 1% payment from the cycle ending 30 June 2024.",
    "Moving between value ranges (from 3.1 to 3.2, for example) is a different mechanism again. It follows a job resizing review that assesses the work the employer requires and your performance of it against the classification and value range standard descriptors — it is a change in work value, not a time-served increment. The agreement is explicit that progression steps themselves are not points of defined work value.",
    "Because the value ranges overlap at the top, the last step of one grade can pay more than the first step of the next: VPS 4.1.7 pays $114,476 while VPS 5.1.1 pays $116,413, a gap of under $2,000, so a promotion from the top of grade 4 to the bottom of grade 5 is a smaller pay rise than a single step inside grade 4.",
  ],

  superannuation: {
    rate: null,
    text:
      "The VPS agreement does not set an above-guarantee employer contribution. Clause 41.2 requires the employer to contribute enough to avoid the superannuation guarantee charge, which means the ordinary Superannuation Guarantee rate applies to VPS salaries. That is a real difference from the APS, where the median employer contribution is 15.4%: on a VPS 5 salary of about $128,000 the gap between the Superannuation Guarantee rate of 12% and 15.4% is worth about $4,350 a year in total remuneration.",
    sourceId: "vps-ea-2024",
  },

  sources: [
    {
      id: "vps-ea-2024",
      title: "Victorian Public Service Enterprise Agreement 2024 — Schedule C, VPS salaries",
      publisher: "Victorian Government",
      url: "https://www.vic.gov.au/sites/default/files/2024-06/Attachment-A-VPS-Agreement-2024-Master-Agreement.docx",
      effectiveFrom: "1 May 2026",
      verifiedOn: "28 August 2026",
      note:
        "Every progression step is taken from the 1 May 2026 column of the table at clause 1 of Schedule C. Salary increases are at Table 14 (clause 32.1) and progression rules at clause 31.",
    },
    {
      id: "vic-dtf-vps-agreement",
      title: "Victorian Public Service Enterprise Agreement 2024",
      publisher: "Victorian Department of Treasury and Finance",
      url: "https://www.dtf.vic.gov.au/victorian-public-service-enterprise-agreement-2024",
      verifiedOn: "28 August 2026",
      note: "The department's landing page for the agreement and its features.",
    },
    {
      id: "vic-remuneration-tribunal",
      title: "Remuneration bands for executives employed in public service bodies",
      publisher: "Victorian Independent Remuneration Tribunal",
      url: "https://www.remunerationtribunal.vic.gov.au/remuneration-bands-executives-employed-public-service-bodies",
      effectiveFrom: "1 July 2026",
      verifiedOn: "28 August 2026",
    },
  ],

  unverified: [
    "Non-VPS-aligned adaptive structures in Section II of the agreement — custodial officers, sheriff's officers, fisheries officers and similar — which reference the VPS table but carry their own tables. Check the relevant appendix of the agreement rather than reading across from the VPS grade.",
    "The separate Legal Officer, Allied Health and Science adaptive structures at Schedules D, E and F. They use the same value range mechanism but publish their own salary points.",
    "Victorian public sector employers outside the VPS — Victoria Police, teachers, nurses and the wider public sector — bargain separate agreements and are not covered by Schedule C.",
    "Department head (Secretary) and Victorian Public Sector Commissioner remuneration, which the Tribunal sets separately from the SES bands.",
  ],

  faqs: [
    {
      q: "What is the VPS salary scale in 2026?",
      a: "From 1 May 2026 the VPS grades run from $56,677 at VPS 1.1.1 to $263,771 at VPS 7.3.5. Grade 3 pays $81,496 to $98,955, grade 4 pays $100,894 to $114,476, grade 5 pays $116,413 to $140,849 and grade 6 pays $142,790 to $191,084. Every figure comes from Schedule C of the Victorian Public Service Enterprise Agreement 2024.",
    },
    {
      q: "What is a VPS 3 salary?",
      a: "VPS Grade 3 covers two value ranges from 1 May 2026: value range 3.1 runs across six steps from $81,496 to $90,227, and value range 3.2 across five steps from $91,971 to $98,955.",
    },
    {
      q: "What is the VPS 5 salary range?",
      a: "Value range 5.1 pays $116,413 to $128,631 across five steps and value range 5.2 pays $128,635 to $140,849 across five steps, from 1 May 2026.",
    },
    {
      q: "What are the VPS salary bands?",
      a: "Seven grades, most of them split into two or three value ranges, and each value range split into progression steps. Grade 4 is the exception with a single value range of seven steps. Above grade 7 the Victorian Independent Remuneration Tribunal sets executive bands, starting at $240,938 total remuneration package for SES-1 from 1 July 2026.",
    },
    {
      q: "When is the next VPS pay rise?",
      a: "The agreement provides 3% increases on 1 May 2024, 1 May 2025, 1 May 2026 and 1 May 2027. The rates on this page include the 1 May 2026 increase; the next one is 1 May 2027.",
    },
    {
      q: "How do you move up a VPS pay point?",
      a: "Through the annual performance cycle. You need 12 months of continuous VPS employment, 12 months at your current step and a current performance and development plan. At the top of a value range you receive a 1.5% lump sum instead of a step.",
    },
  ],
};

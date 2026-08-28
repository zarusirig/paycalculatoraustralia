// =============================================================================
// Australian Public Service (federal) — classification pay.
//
// THE TRAP THIS FILE EXISTS TO HANDLE: the APS has no single pay scale. Each
// agency bargains its own enterprise agreement, so "the APS 6 salary" is a
// range across ~102 agencies, not one number. Two schedules are published here
// and they are labelled differently on purpose:
//
//   1. apsc-2025 — the APSC's own APS-wide remuneration data at 31 December
//      2025. These are ACTUAL salaries reported by every agency, expressed as
//      percentiles. This is the only APS-wide figure that exists.
//   2. treasury-2026 — ONE named agency's agreement, shown as an example of
//      what a real pay-point scale looks like. It is never presented as "the"
//      APS scale.
//
// Service-wide bargaining since 2023 is narrowing the spread (the APSC calls it
// pay fragmentation) but has not removed it.
// =============================================================================

import type { Jurisdiction } from "./types";

export const APS: Jurisdiction = {
  slug: "aps",
  name: "Australian Public Service",
  shortName: "APS",
  label: "APS (federal)",
  verifiedOn: "28 August 2026",

  headline:
    "There is no single APS pay scale. Across the whole service at 31 December 2025 the median APS 6 base salary was $108,092, with 90% of APS 6 staff paid between $97,316 and $115,199. The median was $92,324 at APS 5, $135,701 at EL 1, $168,064 at EL 2, $253,804 at SES Band 1 and $321,888 at SES Band 2. Each agency bargains its own enterprise agreement, so your agency's number sits somewhere inside those ranges.",

  metaTitle: "APS Pay Scales 2026 — APS 1–6, EL1, EL2 and SES Salary Ranges",
  metaDescription:
    "What each APS level actually pays: APS-wide base salary ranges and medians for APS 1–6, EL 1, EL 2 and SES Bands 1–3 from the APSC's 31 December 2025 remuneration data, plus a real agency pay-point scale and what each band is worth after tax.",

  instrument:
    "Agency enterprise agreements made under the Fair Work Act 2009, using the classifications in the Public Service Classification Rules 2000. Since 2023 they have been bargained service-wide for common terms, but pay ranges are still set agency by agency.",

  payRise:
    "Service-wide bargaining settled an 11.2% pay increase over three years: 4% from the first full pay period after 1 March 2024, 3.8% from the first full pay period after 1 March 2025 and 3.4% from the first full pay period after 1 March 2026. The 3.4% instalment is the most recent increase; the APSC reports that roughly 70 agencies also made small extra adjustments of 0.1% to 1% in 2025 to move their minimum and maximum pay ranges toward the service-wide ranges.",

  schedules: [
    {
      id: "apsc-2025",
      title: "APS-wide base salary by classification, 31 December 2025",
      coverage:
        "Every APS agency. 187,279 employees, collected by the Australian Public Service Commission from all agencies with employees engaged under the Public Service Act 1999.",
      basis: "survey",
      effectiveFrom: "31 December 2025",
      rangeMeaning:
        "5th to 95th percentile of base salaries actually paid — 90% of employees at that level sit inside it. Base Salary excludes superannuation, allowances and bonuses.",
      sourceId: "apsc-rem-2025",
      note:
        "A handful of agencies use local classifications and the APSC maps those to the nearest APS level, which is why the single highest salary reported at some levels is far above the 95th percentile. The percentile range, not the reported maximum, is the useful figure.",
      streams: [
        {
          id: "aps-classifications",
          name: "APS classifications",
          description:
            "The classification structure in the Public Service Classification Rules 2000: APS levels 1 to 6, Executive Levels 1 and 2, and Senior Executive Service Bands 1 to 3, plus the Graduate APS training classification.",
          bands: [
            {
              code: "Graduate",
              name: "Graduate APS",
              aliases: ["graduate aps", "aps graduate", "graduate salary aps"],
              summary:
                "Training classification for employees in an agency graduate programme, normally advancing to APS 4 or APS 5 on completion.",
              min: 72_951,
              max: 86_724,
              median: 79_176,
              reportedMin: 64_169,
              headcount: 1_871,
            },
            {
              code: "APS 1",
              name: "APS Level 1",
              aliases: ["aps1", "aps level 1"],
              summary:
                "Entry level. Routine tasks under close direction, following established procedures.",
              min: 54_516,
              max: 62_600,
              median: 58_408,
              reportedMin: 54_516,
              headcount: 228,
            },
            {
              code: "APS 2",
              name: "APS Level 2",
              aliases: ["aps2", "aps level 2"],
              summary:
                "Administrative and operational support under general direction, with some discretion within defined procedures.",
              min: 59_520,
              max: 71_037,
              median: 64_595,
              reportedMin: 59_520,
              headcount: 1_533,
            },
            {
              code: "APS 3",
              name: "APS Level 3",
              aliases: ["aps3", "aps level 3"],
              summary:
                "Processing, client contact and case work applying legislation and policy to individual cases.",
              min: 67_974,
              max: 78_705,
              median: 72_951,
              reportedMin: 66_823,
              headcount: 11_093,
            },
            {
              code: "APS 4",
              name: "APS Level 4",
              aliases: ["aps4", "aps level 4"],
              summary:
                "More complex case work and technical or specialist support, often supervising APS 1–3 staff.",
              min: 76_714,
              max: 88_200,
              median: 82_906,
              reportedMin: 75_022,
              headcount: 35_095,
            },
            {
              code: "APS 5",
              name: "APS Level 5",
              aliases: ["aps5", "aps level 5"],
              summary:
                "Specialist, project and policy work under general direction; the first level with substantial independent judgement.",
              min: 86_034,
              max: 96_239,
              median: 92_324,
              reportedMin: 84_228,
              headcount: 28_460,
            },
            {
              code: "APS 6",
              name: "APS Level 6",
              aliases: ["aps6", "aps level 6", "aps 6 pay rate"],
              summary:
                "The largest classification in the APS. Complex policy, technical and project work, frequently leading a small team.",
              min: 97_316,
              max: 115_199,
              median: 108_092,
              reportedMin: 92_000,
              headcount: 47_297,
            },
            {
              code: "EL 1",
              name: "Executive Level 1",
              aliases: ["el1", "el1 salary", "executive level 1"],
              summary:
                "Assistant Director. Manages a team or a work programme and is accountable for its outputs.",
              min: 124_861,
              max: 149_271,
              median: 135_701,
              reportedMin: 115_442,
              headcount: 41_032,
            },
            {
              code: "EL 2",
              name: "Executive Level 2",
              aliases: ["el2", "el2 salary", "executive level 2"],
              summary:
                "Director. Runs a branch section, sets work direction and is accountable for a budget or programme.",
              min: 151_518,
              max: 190_446,
              median: 168_064,
              reportedMin: 135_402,
              headcount: 17_210,
            },
            {
              code: "SES Band 1",
              name: "Senior Executive Service Band 1",
              aliases: ["ses band 1", "ses band 1 salary", "ses 1"],
              summary:
                "Assistant Secretary. SES employees are paid under individual determinations or common law arrangements, not the agency enterprise agreement.",
              min: 224_919,
              max: 284_341,
              median: 253_804,
              reportedMin: 181_089,
              headcount: 2_597,
            },
            {
              code: "SES Band 2",
              name: "Senior Executive Service Band 2",
              aliases: ["ses band 2", "ses band 2 salary", "ses 2"],
              summary: "First Assistant Secretary, normally leading a division.",
              min: 290_763,
              max: 363_798,
              median: 321_888,
              reportedMin: 246_652,
              headcount: 711,
            },
            {
              code: "SES Band 3",
              name: "Senior Executive Service Band 3",
              aliases: ["ses band 3", "ses band 3 salary", "ses 3"],
              summary: "Deputy Secretary. The most senior classification below agency head.",
              min: 376_314,
              max: 515_181,
              median: 431_975,
              reportedMin: 351_530,
              headcount: 152,
            },
          ],
        },
      ],
    },
    {
      id: "treasury-2026",
      title: "One agency's scale: Treasury Enterprise Agreement 2024, from 12 March 2026",
      coverage:
        "The Department of the Treasury only. Reproduced because it shows what an actual APS pay-point scale looks like — every other agency has its own, and the figures below are not the APS-wide rates.",
      basis: "agreement",
      effectiveFrom: "12 March 2026",
      rangeMeaning: "Bottom and top pay point of the level in this one agency's agreement.",
      sourceId: "treasury-ea",
      streams: [
        {
          id: "treasury-aps",
          name: "Treasury base salaries",
          description:
            "Appendix A of the Treasury Enterprise Agreement 2024, showing the salary at each pay point after the 3.4% service-wide increase on 12 March 2026.",
          bands: [
            {
              code: "APS 1",
              name: "Treasury APS 1",
              aliases: [],
              summary: "Two pay points.",
              min: 57_497,
              max: 61_822,
              payPoints: [
                { label: "APS 1.1", annual: 57_497 },
                { label: "APS 1.2", annual: 61_822 },
              ],
              note:
                "Treasury records that the pay fragmentation mechanism made the APS 1.1 increase larger than 3.4%.",
            },
            {
              code: "APS 2",
              name: "Treasury APS 2",
              aliases: [],
              summary: "Two pay points.",
              min: 65_619,
              max: 69_966,
              payPoints: [
                { label: "APS 2.1", annual: 65_619 },
                { label: "APS 2.2", annual: 69_966 },
              ],
            },
            {
              code: "APS 3",
              name: "Treasury APS 3",
              aliases: [],
              summary: "Two pay points.",
              min: 74_307,
              max: 78_645,
              payPoints: [
                { label: "APS 3.1", annual: 74_307 },
                { label: "APS 3.2", annual: 78_645 },
              ],
            },
            {
              code: "APS 4",
              name: "Treasury APS 4",
              aliases: [],
              summary: "Two pay points.",
              min: 82_995,
              max: 87_337,
              payPoints: [
                { label: "APS 4.1", annual: 82_995 },
                { label: "APS 4.2", annual: 87_337 },
              ],
            },
            {
              code: "APS 5",
              name: "Treasury APS 5",
              aliases: [],
              summary: "Two pay points.",
              min: 93_312,
              max: 99_287,
              payPoints: [
                { label: "APS 5.1", annual: 93_312 },
                { label: "APS 5.2", annual: 99_287 },
              ],
            },
            {
              code: "APS 6",
              name: "Treasury APS 6",
              aliases: [],
              summary: "Four pay points.",
              min: 105_260,
              max: 127_521,
              payPoints: [
                { label: "APS 6.1", annual: 105_260 },
                { label: "APS 6.2", annual: 111_232 },
                { label: "APS 6.3", annual: 119_921 },
                { label: "APS 6.4", annual: 127_521 },
              ],
            },
            {
              code: "EL 1",
              name: "Treasury EL 1",
              aliases: [],
              summary: "Three pay points.",
              min: 137_301,
              max: 157_498,
              payPoints: [
                { label: "EL 1.1", annual: 137_301 },
                { label: "EL 1.2", annual: 148_073 },
                { label: "EL 1.3", annual: 157_498 },
              ],
            },
            {
              code: "EL 2",
              name: "Treasury EL 2",
              aliases: [],
              summary: "Four pay points.",
              min: 167_708,
              max: 192_469,
              payPoints: [
                { label: "EL 2.1", annual: 167_708 },
                { label: "EL 2.2", annual: 175_962 },
                { label: "EL 2.3", annual: 184_214 },
                { label: "EL 2.4", annual: 192_469 },
              ],
            },
          ],
        },
      ],
    },
  ],

  progression: [
    "Within a classification you move up pay points, and the rules live in your agency's enterprise agreement rather than in any APS-wide document. The usual pattern is one increment a year subject to a satisfactory performance rating: at Treasury, for example, APS 6 runs across four pay points from $105,260 to $127,521 and EL 2 across four from $167,708 to $192,469, so the distance from the bottom to the top of a single classification can be more than $24,000.",
    "At the top of the range some agencies pay a fixed top-of-salary-range payment instead of a further increment. The APSC counted 3,824 APS 6 employees receiving one in 2025, with a median payment of $1,087, and 4,638 EL 1 employees with a median of $1,357. It is a recurring payment, not a salary increase, so it does not lift your base for superannuation purposes in the way an increment does.",
    "Moving between classifications is a promotion to a different job, not an increment, and it resets you to a pay point in the new band — usually the bottom one. That is why the APS-wide percentile ranges overlap: an EL 1 at the bottom of the band earns less than an APS 6 at the top of theirs in the same agency.",
    "Transferring between agencies at the same classification can change your salary in either direction, because the two agencies' agreements set different ranges for the same level. The APSC's 2025 data release notes that around 70 agencies made small adjustments of 0.1% to 1% to their minimum and maximum pay ranges that year to move toward the service-wide ranges, after a larger realignment in 2024.",
  ],

  superannuation: {
    rate: 15.4,
    text:
      "The employer superannuation contribution in the APS is well above the Superannuation Guarantee. The median employer contribution was 15.4% of base salary at every classification from Graduate to SES Band 3 in both 2024 and 2025. On the median APS 6 base salary of $108,092 that is $16,646 a year, and the APSC's own figure for the median APS 6 agency superannuation contribution is $16,707. Add it to base salary before comparing an APS job with a private-sector offer paying the Superannuation Guarantee rate.",
    sourceId: "apsc-rem-2025",
  },

  sources: [
    {
      id: "apsc-rem-2025",
      title: "APS Remuneration Data 31 December 2025 — Appendix 3 data tables",
      publisher: "Australian Public Service Commission",
      url: "https://www.apsc.gov.au/appendix-3-data-tables",
      effectiveFrom: "31 December 2025",
      verifiedOn: "28 August 2026",
      note:
        "Base salary percentiles, medians, headcounts, employer superannuation percentages and fixed top-of-range payments are read from Tables 1, 6, 8 and 26 to 37 of the published workbook.",
    },
    {
      id: "apsc-key-findings",
      title: "APS Remuneration Data 31 December 2025 — Key findings for 2025",
      publisher: "Australian Public Service Commission",
      url: "https://www.apsc.gov.au/key-findings-2025",
      verifiedOn: "28 August 2026",
      note:
        "Source for the 4.2% weighted median base salary increase, the 3.8% service-wide increase paid from 14 March 2025 and the ~70 agencies that adjusted pay ranges in 2025.",
    },
    {
      id: "apsc-bargaining",
      title: "APS Bargaining: Package of common pay and conditions (open letter)",
      publisher: "Australian Public Service Commission",
      url: "https://www.apsc.gov.au/news-and-events/open-letters-australian-public-service/open-letter-australian-public-service-aps-bargaining-package-common-pay-and-conditions",
      verifiedOn: "28 August 2026",
      note: "Source for 11.2% over three years — 4%, 3.8% and 3.4% from March 2024, 2025 and 2026.",
    },
    {
      id: "treasury-ea",
      title: "Treasury Enterprise Agreement 2024 — Appendix A, base salaries",
      publisher: "Department of the Treasury",
      url: "https://ea.treasury.gov.au/appendix-a-base-salaries",
      effectiveFrom: "12 March 2026",
      verifiedOn: "28 August 2026",
    },
    {
      id: "classification-rules",
      title: "Public Service Classification Rules 2000",
      publisher: "Federal Register of Legislation",
      url: "https://www.legislation.gov.au/F2005B01581/latest/text",
      verifiedOn: "28 August 2026",
      note: "The instrument that defines the APS, EL and SES classifications themselves.",
    },
  ],

  unverified: [
    "Pay-point scales for agencies other than Treasury — there are around 102 agency enterprise agreements and each publishes its own. Find yours on your agency's website rather than assuming another agency's rate.",
    "SES Band 1–3 salaries are set by individual determinations, so no rate table exists to publish. The figures shown are the percentile spread of what SES employees were actually paid at 31 December 2025.",
    "The Australian Government Industry Award minimum rates that underpin APS classifications. The APSC publishes them in its annual wage review circular; we have not reproduced them here.",
  ],

  faqs: [
    {
      q: "What is the APS 6 salary in 2026?",
      a: "There is no single figure, because every APS agency bargains its own enterprise agreement. Across the whole APS at 31 December 2025 the median APS 6 base salary was $108,092, and 90% of APS 6 employees were paid between $97,316 and $115,199. As an example of one agency's scale, Treasury pays APS 6 across four pay points from $105,260 to $127,521 from 12 March 2026.",
    },
    {
      q: "What is an EL1 salary?",
      a: "The median EL 1 base salary across the APS was $135,701 at 31 December 2025, with 90% of EL 1 employees between $124,861 and $149,271. The lowest EL 1 base salary reported by any agency was $115,442.",
    },
    {
      q: "What is an EL2 salary?",
      a: "The median EL 2 base salary across the APS was $168,064 at 31 December 2025, with 90% of EL 2 employees between $151,518 and $190,446.",
    },
    {
      q: "What are the APS levels?",
      a: "The Public Service Classification Rules 2000 set out APS levels 1 to 6, Executive Level 1 and Executive Level 2, and Senior Executive Service Bands 1, 2 and 3, plus training classifications such as Graduate APS. APS 6 is the largest single classification, with 47,297 employees at 31 December 2025, followed by APS 4 (35,095) and EL 1 (41,032).",
    },
    {
      q: "What is an SES Band 1 salary?",
      a: "The median SES Band 1 base salary was $253,804 at 31 December 2025, with 90% of SES Band 1 employees between $224,919 and $284,341. SES employees are covered by individual determinations or common law arrangements rather than the agency enterprise agreement, so there is no published SES pay scale.",
    },
    {
      q: "Why does APS 6 pay differ between agencies?",
      a: "Because pay ranges are set in each agency's enterprise agreement. The APSC calls the spread pay fragmentation and has been reducing it through service-wide bargaining since 2023; around 70 agencies made further adjustments of 0.1% to 1% to their minimum and maximum ranges in 2025. Until alignment is complete, the same classification pays differently at different agencies.",
    },
    {
      q: "When was the last APS pay rise?",
      a: "The service-wide package delivered 11.2% over three years: 4% from the first full pay period after 1 March 2024, 3.8% from the first full pay period after 1 March 2025, and 3.4% from the first full pay period after 1 March 2026. Weighted median base salaries across the APS rose 4.2% in the year to 31 December 2025.",
    },
    {
      q: "How much superannuation does the APS pay?",
      a: "The median employer contribution was 15.4% of base salary at every APS classification in 2025, well above the Superannuation Guarantee. On the median APS 6 base salary of $108,092 that is $16,646 a year on top of salary; the APSC's own median APS 6 agency superannuation contribution figure is $16,707.",
    },
  ],
};

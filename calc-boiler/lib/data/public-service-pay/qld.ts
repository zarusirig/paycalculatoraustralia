// =============================================================================
// Queensland public service — classification pay.
//
// Queensland has TWO layers and this file keeps them apart:
//
//   1. award-2026 — the Queensland Public Service Officers and Other Employees
//      Award – State 2015 rates from 1 September 2026, read from the QIRC's
//      reprint "as at 1 September 2026" (clause 12.3(a)-(d), Annual Salary
//      column — the award itself says annual figures are fortnightly x 26.089
//      and "for reference purposes only"). The reprint includes the 4.75%
//      increase ordered by the 2026 State Wage Case ([2026] QIRC 280 and 281,
//      delivered 4 September 2026, operative 1 September 2026).
//      https://www.qirc.qld.gov.au/sites/default/files/2026-09/qld_public_service_010926.pdf
//      Updated 23 September 2026. The 1 September 2025 figures this file used
//      before (AO3 $77,354 – $85,833) are superseded.
//   2. doe-2026 — one agency's certified agreement (Department of Education
//      Certified Agreement 2025) from 1 September 2026, shown because it is a
//      complete agreement schedule. After the 4.75% award increase, several of
//      its rates are now BELOW the award; where that happens the award rate is
//      paid. It is never presented as the whole-of-government rate.
//
// The State Government Entities Certified Agreement 2023 (the Core Agreement),
// which covers most departments, nominally expired on 30 June 2026 and still
// applies while a replacement is negotiated; the unions rejected the
// government's offer on 31 July 2026, and the Queensland Government's page
// (last updated 5 August 2026) records no replacement since.
// =============================================================================

import type { Jurisdiction } from "./types";

export const QLD: Jurisdiction = {
  slug: "qld",
  name: "Queensland public service",
  shortName: "Queensland",
  label: "Queensland (AO, PO, TO, OO)",
  verifiedOn: "23 September 2026",

  levelGuide: {
    scheduleId: "award-2026",
    streamIds: ["ao-award"],
    compare: [
      {
        scheduleId: "doe-2026",
        label: "One agency's agreement rate — Department of Education Certified Agreement 2025, from 1 September 2026 (the award applies wherever it is higher)",
      },
    ],
    year: "2026",
    title: "Queensland AO salary by level",
    intro:
      "The administrative stream is the one most Queensland Government jobs are advertised against, so each AO level has its own section. The main figures are the award rates from 1 September 2026, after the 4.75% State Wage Case increase; the Department of Education Certified Agreement 2025 pay points from the same date are shown beside them as one agency's agreement rates, not as the whole-of-government rate — and where an agreement rate is below the award, the award rate is what is paid. Every salary links to the nearest take-home pay page.",
  },

  headline:
    "From 1 September 2026 a Queensland public servant at AO3 is paid at least $81,032 to $89,903, an AO5 $109,704 to $119,018 and a PO4 $124,627 to $134,019 under the Queensland Public Service Officers and Other Employees Award – State 2015, after the 4.75% State Wage Case increase. The award is the floor: an agency certified agreement pays its own rate or the award rate, whichever is higher.",

  metaTitle: "QLD Government Pay Rates 2026 — AO, PO, TO and OO Salary Scales",
  metaDescription:
    "Queensland public service pay points: AO1–AO8, PO1–PO6, TO1–TO6 and OO1–OO7, from the Queensland Public Service Officers and Other Employees Award – State 2015 and a certified agreement schedule, plus Queensland Health nursing rates and what each level is worth after tax.",

  instrument:
    "The Queensland Public Service Officers and Other Employees Award – State 2015 sets the classification structure — administrative (AO), professional (PO), technical (TO) and operational (OO) streams, each with numbered pay points — and the award rate for each point. Certified agreements set rates for the entities they cover, and an employee is always paid at least the award rate.",

  payRise:
    "Award rates rose 4.75% from 1 September 2026. The Queensland Industrial Relations Commission's 2026 State Wage Case ([2026] QIRC 280, delivered 4 September 2026) ordered that \"the wages or salaries for full-time adult employees in all state awards shall be increased by 4.75%\", operative on and from 1 September 2026, and set the Queensland minimum wage at $1,004.90 a week. Separately, the State Government Entities Certified Agreement 2023 nominally expired on 30 June 2026 and continues to apply until it is replaced; the government's offer of at least 8.5% over the life of a replacement agreement lapsed when the unions did not accept it by 31 July 2026, so the backdating of a first increase to 1 July 2026 is no longer on the table.",

  schedules: [
    {
      id: "award-2026",
      title:
        "Queensland Public Service Officers and Other Employees Award – State 2015, from 1 September 2026",
      coverage:
        "The service-wide award floor for the administrative, professional, technical and operational streams. Every Queensland public service employee covered by the award is paid at least these rates; a certified agreement can pay more, never less.",
      basis: "award",
      effectiveFrom: "1 September 2026",
      rangeMeaning: "Bottom and top pay point of the classification level, annualised.",
      sourceId: "qirc-award-2026",
      note:
        "The award's binding rate is the fortnightly rate; the annual salaries here are the award's own reference figures (fortnightly rate x 26.089). Includes the 4.75% 2026 State Wage Case increase. The lowest pay points of AO1, PO1, TO1 and OO1 are age-based rates for employees under 21.",
      streams: [
        {
          id: "ao-award",
          name: "Administrative stream (AO)",
          code: "AO",
          description:
            "Administrative and corporate roles. Eight levels, each with numbered pay points.",
          bands: [
            {
              code: "AO1",
              name: "Administrative Officer 1",
              aliases: ["ao1", "ao1 salary"],
              summary: "Three pay points, all age-based rates for employees under 21 (77%, 82% and 87% of the age-21 rate). The adult minimum is AO2/1.",
              min: 49_126,
              max: 55_517,
              payPoints: [
                { label: "AO1/1", annual: 49_126 },
                { label: "AO1/2", annual: 52_335 },
                { label: "AO1/3", annual: 55_517 },
              ],
            },
            {
              code: "AO2",
              name: "Administrative Officer 2",
              aliases: ["ao2", "ao2 salary"],
              summary: "Eight pay points — the longest increment ladder in the stream.",
              min: 63_814,
              max: 75_997,
              payPoints: [
                { label: "AO2/1", annual: 63_814 },
                { label: "AO2/2", annual: 65_431 },
                { label: "AO2/3", annual: 67_075 },
                { label: "AO2/4", annual: 68_771 },
                { label: "AO2/5", annual: 70_388 },
                { label: "AO2/6", annual: 72_084 },
                { label: "AO2/7", annual: 73_988 },
                { label: "AO2/8", annual: 75_997 },
              ],
            },
            {
              code: "AO3",
              name: "Administrative Officer 3",
              aliases: ["ao3", "ao3 salary", "ao3 salary queensland government"],
              summary: "Four pay points.",
              min: 81_032,
              max: 89_903,
              payPoints: [
                { label: "AO3/1", annual: 81_032 },
                { label: "AO3/2", annual: 83_954 },
                { label: "AO3/3", annual: 86_955 },
                { label: "AO3/4", annual: 89_903 },
              ],
            },
            {
              code: "AO4",
              name: "Administrative Officer 4",
              aliases: ["ao4", "ao4 salary"],
              summary: "Four pay points.",
              min: 95_173,
              max: 104_304,
              payPoints: [
                { label: "AO4/1", annual: 95_173 },
                { label: "AO4/2", annual: 98_173 },
                { label: "AO4/3", annual: 101_277 },
                { label: "AO4/4", annual: 104_304 },
              ],
            },
            {
              code: "AO5",
              name: "Administrative Officer 5",
              aliases: ["ao5", "ao5 salary"],
              summary: "Four pay points.",
              min: 109_704,
              max: 119_018,
              payPoints: [
                { label: "AO5/1", annual: 109_704 },
                { label: "AO5/2", annual: 112_835 },
                { label: "AO5/3", annual: 115_913 },
                { label: "AO5/4", annual: 119_018 },
              ],
            },
            {
              code: "AO6",
              name: "Administrative Officer 6",
              aliases: ["ao6", "ao6 salary"],
              summary: "Four pay points.",
              min: 125_488,
              max: 134_019,
              payPoints: [
                { label: "AO6/1", annual: 125_488 },
                { label: "AO6/2", annual: 128_332 },
                { label: "AO6/3", annual: 131_202 },
                { label: "AO6/4", annual: 134_019 },
              ],
            },
            {
              code: "AO7",
              name: "Administrative Officer 7",
              aliases: ["ao7", "ao7 salary"],
              summary: "Four pay points.",
              min: 139_941,
              max: 149_933,
              payPoints: [
                { label: "AO7/1", annual: 139_941 },
                { label: "AO7/2", annual: 143_333 },
                { label: "AO7/3", annual: 146_620 },
                { label: "AO7/4", annual: 149_933 },
              ],
            },
            {
              code: "AO8",
              name: "Administrative Officer 8",
              aliases: ["ao8", "ao8 salary"],
              summary: "Four pay points — the top of the administrative stream.",
              min: 154_786,
              max: 163_552,
              payPoints: [
                { label: "AO8/1", annual: 154_786 },
                { label: "AO8/2", annual: 157_786 },
                { label: "AO8/3", annual: 160_656 },
                { label: "AO8/4", annual: 163_552 },
              ],
            },
          ],
        },
        {
          id: "po-award",
          name: "Professional stream (PO)",
          code: "PO",
          description:
            "Roles requiring a professional qualification — engineers, scientists, planners, psychologists and similar. Six levels.",
          bands: [
            {
              code: "PO1",
              name: "Professional Officer 1",
              aliases: ["po1", "po1 salary"],
              summary: "Seven pay points. Pay points 1 to 3 are age-based rates for employees under 21; PO1/4 is the adult minimum.",
              min: 50_482,
              max: 75_032,
              payPoints: [
                { label: "PO1/1", annual: 50_482 },
                { label: "PO1/2", annual: 55_126 },
                { label: "PO1/3", annual: 59_770 },
                { label: "PO1/4", annual: 66_423 },
                { label: "PO1/5", annual: 69_214 },
                { label: "PO1/6", annual: 71_953 },
                { label: "PO1/7", annual: 75_032 },
              ],
            },
            {
              code: "PO2",
              name: "Professional Officer 2",
              aliases: ["po2", "po2 salary"],
              summary: "Six pay points.",
              min: 80_928,
              max: 102_634,
              payPoints: [
                { label: "PO2/1", annual: 80_928 },
                { label: "PO2/2", annual: 85_207 },
                { label: "PO2/3", annual: 89_537 },
                { label: "PO2/4", annual: 93_946 },
                { label: "PO2/5", annual: 98_356 },
                { label: "PO2/6", annual: 102_634 },
              ],
            },
            {
              code: "PO3",
              name: "Professional Officer 3",
              aliases: ["po3", "po3 salary"],
              summary: "Four pay points.",
              min: 107_695,
              max: 117_296,
              payPoints: [
                { label: "PO3/1", annual: 107_695 },
                { label: "PO3/2", annual: 110_852 },
                { label: "PO3/3", annual: 114_087 },
                { label: "PO3/4", annual: 117_296 },
              ],
            },
            {
              code: "PO4",
              name: "Professional Officer 4",
              aliases: ["po4", "po4 salary", "po4 queensland"],
              summary: "Four pay points.",
              min: 124_627,
              max: 134_019,
              payPoints: [
                { label: "PO4/1", annual: 124_627 },
                { label: "PO4/2", annual: 127_758 },
                { label: "PO4/3", annual: 130_941 },
                { label: "PO4/4", annual: 134_019 },
              ],
            },
            {
              code: "PO5",
              name: "Professional Officer 5",
              aliases: ["po5", "po5 salary"],
              summary: "Four pay points, the same rates as AO7.",
              min: 139_941,
              max: 149_933,
              payPoints: [
                { label: "PO5/1", annual: 139_941 },
                { label: "PO5/2", annual: 143_333 },
                { label: "PO5/3", annual: 146_620 },
                { label: "PO5/4", annual: 149_933 },
              ],
            },
            {
              code: "PO6",
              name: "Professional Officer 6",
              aliases: ["po6", "po6 salary"],
              summary: "Four pay points, the same rates as AO8.",
              min: 154_786,
              max: 163_552,
              payPoints: [
                { label: "PO6/1", annual: 154_786 },
                { label: "PO6/2", annual: 157_786 },
                { label: "PO6/3", annual: 160_656 },
                { label: "PO6/4", annual: 163_552 },
              ],
            },
          ],
        },
        {
          id: "to-award",
          name: "Technical stream (TO)",
          code: "TO",
          description:
            "Technical and para-professional roles. Six levels, sharing the PO1 rates at entry.",
          bands: [
            {
              code: "TO1",
              name: "Technical Officer 1",
              aliases: ["to1"],
              summary: "Seven pay points, identical to PO1. Pay points 1 to 3 are age-based rates for employees under 21.",
              min: 50_482,
              max: 75_032,
              payPoints: [
                { label: "TO1/1", annual: 50_482 },
                { label: "TO1/2", annual: 55_126 },
                { label: "TO1/3", annual: 59_770 },
                { label: "TO1/4", annual: 66_423 },
                { label: "TO1/5", annual: 69_214 },
                { label: "TO1/6", annual: 71_953 },
                { label: "TO1/7", annual: 75_032 },
              ],
            },
            {
              code: "TO2",
              name: "Technical Officer 2",
              aliases: ["to2"],
              summary: "Six pay points.",
              min: 76_258,
              max: 89_903,
              payPoints: [
                { label: "TO2/1", annual: 76_258 },
                { label: "TO2/2", annual: 78_971 },
                { label: "TO2/3", annual: 81_632 },
                { label: "TO2/4", annual: 84_502 },
                { label: "TO2/5", annual: 87_242 },
                { label: "TO2/6", annual: 89_903 },
              ],
            },
            {
              code: "TO3",
              name: "Technical Officer 3",
              aliases: ["to3"],
              summary: "Four pay points.",
              min: 95_173,
              max: 102_634,
              payPoints: [
                { label: "TO3/1", annual: 95_173 },
                { label: "TO3/2", annual: 97_625 },
                { label: "TO3/3", annual: 100_156 },
                { label: "TO3/4", annual: 102_634 },
              ],
            },
            {
              code: "TO4",
              name: "Technical Officer 4",
              aliases: ["to4"],
              summary: "Three pay points.",
              min: 107_695,
              max: 114_374,
              payPoints: [
                { label: "TO4/1", annual: 107_695 },
                { label: "TO4/2", annual: 111_009 },
                { label: "TO4/3", annual: 114_374 },
              ],
            },
            {
              code: "TO5",
              name: "Technical Officer 5",
              aliases: ["to5"],
              summary: "Four pay points.",
              min: 119_018,
              max: 129_297,
              payPoints: [
                { label: "TO5/1", annual: 119_018 },
                { label: "TO5/2", annual: 122_462 },
                { label: "TO5/3", annual: 125_879 },
                { label: "TO5/4", annual: 129_297 },
              ],
            },
            {
              code: "TO6",
              name: "Technical Officer 6",
              aliases: ["to6"],
              summary: "Three pay points — the top of the technical stream.",
              min: 133_393,
              max: 139_941,
              payPoints: [
                { label: "TO6/1", annual: 133_393 },
                { label: "TO6/2", annual: 136_759 },
                { label: "TO6/3", annual: 139_941 },
              ],
            },
          ],
        },
        {
          id: "oo-award",
          name: "Operational stream (OO)",
          code: "OO",
          description:
            "Operational roles — trades, facilities, school and support work. Seven levels. Clause 12.3(d) of the award.",
          bands: [
            {
              code: "OO1",
              name: "Operational Officer 1",
              aliases: ["oo1", "oo1 salary"],
              summary: "Six pay points, all age-based rates for employees under 21 (68% to 96% of the age-21 rate). The adult minimum is OO2/1.",
              min: 43_386,
              max: 61_257,
              payPoints: [
                { label: "OO1/1", annual: 43_386 },
                { label: "OO1/2", annual: 47_221 },
                { label: "OO1/3", annual: 50_404 },
                { label: "OO1/4", annual: 54_239 },
                { label: "OO1/5", annual: 57_422 },
                { label: "OO1/6", annual: 61_257 },
              ],
            },
            {
              code: "OO2",
              name: "Operational Officer 2",
              aliases: ["oo2", "oo2 salary"],
              summary: "4 pay points.",
              min: 63_814,
              max: 68_979,
              payPoints: [
                { label: "OO2/1", annual: 63_814 },
                { label: "OO2/2", annual: 65_509 },
                { label: "OO2/3", annual: 67_284 },
                { label: "OO2/4", annual: 68_979 },
              ],
            },
            {
              code: "OO3",
              name: "Operational Officer 3",
              aliases: ["oo3", "oo3 salary"],
              summary: "4 pay points.",
              min: 70_023,
              max: 74_354,
              payPoints: [
                { label: "OO3/1", annual: 70_023 },
                { label: "OO3/2", annual: 71_353 },
                { label: "OO3/3", annual: 72_867 },
                { label: "OO3/4", annual: 74_354 },
              ],
            },
            {
              code: "OO4",
              name: "Operational Officer 4",
              aliases: ["oo4", "oo4 salary"],
              summary: "4 pay points.",
              min: 77_354,
              max: 84_659,
              payPoints: [
                { label: "OO4/1", annual: 77_354 },
                { label: "OO4/2", annual: 79_806 },
                { label: "OO4/3", annual: 82_285 },
                { label: "OO4/4", annual: 84_659 },
              ],
            },
            {
              code: "OO5",
              name: "Operational Officer 5",
              aliases: ["oo5", "oo5 salary"],
              summary: "4 pay points.",
              min: 86_798,
              max: 95_173,
              payPoints: [
                { label: "OO5/1", annual: 86_798 },
                { label: "OO5/2", annual: 89_537 },
                { label: "OO5/3", annual: 92_407 },
                { label: "OO5/4", annual: 95_173 },
              ],
            },
            {
              code: "OO6",
              name: "Operational Officer 6",
              aliases: ["oo6", "oo6 salary"],
              summary: "3 pay points.",
              min: 99_190,
              max: 104_304,
              payPoints: [
                { label: "OO6/1", annual: 99_190 },
                { label: "OO6/2", annual: 101_825 },
                { label: "OO6/3", annual: 104_304 },
              ],
            },
            {
              code: "OO7",
              name: "Operational Officer 7",
              aliases: ["oo7", "oo7 salary"],
              summary: "3 pay points.",
              min: 109_209,
              max: 114_374,
              payPoints: [
                { label: "OO7/1", annual: 109_209 },
                { label: "OO7/2", annual: 111_739 },
                { label: "OO7/3", annual: 114_374 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "doe-2026",
      title: "One agency's agreement: Department of Education Certified Agreement 2025, from 1 September 2026",
      coverage:
        "Queensland Department of Education public servants only. Shown because it is a complete AO, PO, TO and OO schedule with a published effective date — other Queensland entities have their own certified agreements and their rates differ.",
      basis: "agreement",
      effectiveFrom: "1 September 2026",
      rangeMeaning:
        "Bottom and top pay point of the level under this agreement, annualised from a 72.5-hour fortnight.",
      sourceId: "doe-ca-2025",
      note:
        "Wage increases under this agreement are 3.5% from 1 September 2025 (the CPI Uplift Adjustment was triggered in year one), 2.5% from 1 September 2026 and 2.5% from 1 September 2027. Operational stream employees on a 76-hour fortnight are paid different annual salaries at OO1; the figures here are the 72.5-hour column.",
      streams: [
        {
          id: "ao-doe",
          name: "Administrative stream (AO)",
          code: "AO",
          description: "Same eight levels as the award, at agreement rates.",
          bands: [
            {
              code: "AO1",
              name: "Administrative Officer 1",
              aliases: [],
              summary: "Three pay points.",
              min: 48_810,
              max: 55_165,
              payPoints: [
                { label: "AO1/1", annual: 48_810 },
                { label: "AO1/2", annual: 51_982 },
                { label: "AO1/3", annual: 55_165 },
              ],
            },
            {
              code: "AO2",
              name: "Administrative Officer 2",
              aliases: [],
              summary: "Eight pay points.",
              min: 63_394,
              max: 75_515,
              payPoints: [
                { label: "AO2/1", annual: 63_394 },
                { label: "AO2/2", annual: 64_998 },
                { label: "AO2/3", annual: 66_631 },
                { label: "AO2/4", annual: 68_327 },
                { label: "AO2/5", annual: 69_963 },
                { label: "AO2/6", annual: 71_627 },
                { label: "AO2/7", annual: 73_474 },
                { label: "AO2/8", annual: 75_515 },
              ],
            },
            {
              code: "AO3",
              name: "Administrative Officer 3",
              aliases: [],
              summary: "Four pay points.",
              min: 80_505,
              max: 89_326,
              payPoints: [
                { label: "AO3/1", annual: 80_505 },
                { label: "AO3/2", annual: 83_407 },
                { label: "AO3/3", annual: 86_399 },
                { label: "AO3/4", annual: 89_326 },
              ],
            },
            {
              code: "AO4",
              name: "Administrative Officer 4",
              aliases: [],
              summary: "Four pay points.",
              min: 94_567,
              max: 103_665,
              payPoints: [
                { label: "AO4/1", annual: 94_567 },
                { label: "AO4/2", annual: 97_560 },
                { label: "AO4/3", annual: 100_644 },
                { label: "AO4/4", annual: 103_665 },
              ],
            },
            {
              code: "AO5",
              name: "Administrative Officer 5",
              aliases: [],
              summary: "Four pay points.",
              min: 108_997,
              max: 118_243,
              payPoints: [
                { label: "AO5/1", annual: 108_997 },
                { label: "AO5/2", annual: 112_112 },
                { label: "AO5/3", annual: 115_193 },
                { label: "AO5/4", annual: 118_243 },
              ],
            },
            {
              code: "AO6",
              name: "Administrative Officer 6",
              aliases: [],
              summary: "Four pay points.",
              min: 124_692,
              max: 133_171,
              payPoints: [
                { label: "AO6/1", annual: 124_692 },
                { label: "AO6/2", annual: 127_497 },
                { label: "AO6/3", annual: 130_367 },
                { label: "AO6/4", annual: 133_171 },
              ],
            },
            {
              code: "AO7",
              name: "Administrative Officer 7",
              aliases: [],
              summary: "Four pay points.",
              min: 139_060,
              max: 148_924,
              payPoints: [
                { label: "AO7/1", annual: 139_060 },
                { label: "AO7/2", annual: 142_425 },
                { label: "AO7/3", annual: 145_689 },
                { label: "AO7/4", annual: 148_924 },
              ],
            },
            {
              code: "AO8",
              name: "Administrative Officer 8",
              aliases: [],
              summary: "Four pay points.",
              min: 153_771,
              max: 162_521,
              payPoints: [
                { label: "AO8/1", annual: 153_771 },
                { label: "AO8/2", annual: 156_790 },
                { label: "AO8/3", annual: 159_628 },
                { label: "AO8/4", annual: 162_521 },
              ],
            },
          ],
        },
        {
          id: "po-doe",
          name: "Professional stream (PO)",
          code: "PO",
          description: "Six levels at agreement rates.",
          bands: [
            {
              code: "PO1",
              name: "Professional Officer 1",
              aliases: [],
              summary: "Seven pay points.",
              min: 50_167,
              max: 74_557,
              payPoints: [
                { label: "PO1/1", annual: 50_167 },
                { label: "PO1/2", annual: 54_792 },
                { label: "PO1/3", annual: 59_415 },
                { label: "PO1/4", annual: 66_016 },
                { label: "PO1/5", annual: 68_789 },
                { label: "PO1/6", annual: 71_502 },
                { label: "PO1/7", annual: 74_557 },
              ],
            },
            {
              code: "PO2",
              name: "Professional Officer 2",
              aliases: [],
              summary: "Six pay points.",
              min: 80_414,
              max: 101_998,
              payPoints: [
                { label: "PO2/1", annual: 80_414 },
                { label: "PO2/2", annual: 84_669 },
                { label: "PO2/3", annual: 88_956 },
                { label: "PO2/4", annual: 93_367 },
                { label: "PO2/5", annual: 97_714 },
                { label: "PO2/6", annual: 101_998 },
              ],
            },
            {
              code: "PO3",
              name: "Professional Officer 3",
              aliases: [],
              summary: "Four pay points.",
              min: 106_994,
              max: 116_553,
              payPoints: [
                { label: "PO3/1", annual: 106_994 },
                { label: "PO3/2", annual: 110_140 },
                { label: "PO3/3", annual: 113_378 },
                { label: "PO3/4", annual: 116_553 },
              ],
            },
            {
              code: "PO4",
              name: "Professional Officer 4",
              aliases: [],
              summary: "Four pay points.",
              min: 123_829,
              max: 133_171,
              payPoints: [
                { label: "PO4/1", annual: 123_829 },
                { label: "PO4/2", annual: 126_944 },
                { label: "PO4/3", annual: 130_088 },
                { label: "PO4/4", annual: 133_171 },
              ],
            },
            {
              code: "PO5",
              name: "Professional Officer 5",
              aliases: [],
              summary: "Four pay points.",
              min: 139_060,
              max: 148_924,
              payPoints: [
                { label: "PO5/1", annual: 139_060 },
                { label: "PO5/2", annual: 142_425 },
                { label: "PO5/3", annual: 145_689 },
                { label: "PO5/4", annual: 148_924 },
              ],
            },
            {
              code: "PO6",
              name: "Professional Officer 6",
              aliases: [],
              summary: "Four pay points.",
              min: 153_771,
              max: 162_521,
              payPoints: [
                { label: "PO6/1", annual: 153_771 },
                { label: "PO6/2", annual: 156_790 },
                { label: "PO6/3", annual: 159_628 },
                { label: "PO6/4", annual: 162_521 },
              ],
            },
          ],
        },
        {
          id: "to-doe",
          name: "Technical stream (TO)",
          code: "TO",
          description: "Six levels at agreement rates.",
          bands: [
            {
              code: "TO1",
              name: "Technical Officer 1",
              aliases: [],
              summary: "Seven pay points.",
              min: 50_167,
              max: 74_557,
              payPoints: [
                { label: "TO1/1", annual: 50_167 },
                { label: "TO1/2", annual: 54_792 },
                { label: "TO1/3", annual: 59_415 },
                { label: "TO1/4", annual: 66_016 },
                { label: "TO1/5", annual: 68_789 },
                { label: "TO1/6", annual: 71_502 },
                { label: "TO1/7", annual: 74_557 },
              ],
            },
            {
              code: "TO2",
              name: "Technical Officer 2",
              aliases: [],
              summary: "Six pay points.",
              min: 75_791,
              max: 89_326,
              payPoints: [
                { label: "TO2/1", annual: 75_791 },
                { label: "TO2/2", annual: 78_473 },
                { label: "TO2/3", annual: 81_121 },
                { label: "TO2/4", annual: 83_928 },
                { label: "TO2/5", annual: 86_670 },
                { label: "TO2/6", annual: 89_326 },
              ],
            },
            {
              code: "TO3",
              name: "Technical Officer 3",
              aliases: [],
              summary: "Four pay points.",
              min: 94_567,
              max: 101_998,
              payPoints: [
                { label: "TO3/1", annual: 94_567 },
                { label: "TO3/2", annual: 96_970 },
                { label: "TO3/3", annual: 99_498 },
                { label: "TO3/4", annual: 101_998 },
              ],
            },
            {
              code: "TO4",
              name: "Technical Officer 4",
              aliases: [],
              summary: "Three pay points.",
              min: 106_994,
              max: 113_623,
              payPoints: [
                { label: "TO4/1", annual: 106_994 },
                { label: "TO4/2", annual: 110_294 },
                { label: "TO4/3", annual: 113_623 },
              ],
            },
            {
              code: "TO5",
              name: "Technical Officer 5",
              aliases: [],
              summary: "Four pay points.",
              min: 118_243,
              max: 128_452,
              payPoints: [
                { label: "TO5/1", annual: 118_243 },
                { label: "TO5/2", annual: 121_669 },
                { label: "TO5/3", annual: 125_058 },
                { label: "TO5/4", annual: 128_452 },
              ],
            },
            {
              code: "TO6",
              name: "Technical Officer 6",
              aliases: [],
              summary: "Three pay points.",
              min: 132_553,
              max: 139_060,
              payPoints: [
                { label: "TO6/1", annual: 132_553 },
                { label: "TO6/2", annual: 135_882 },
                { label: "TO6/3", annual: 139_060 },
              ],
            },
          ],
        },
        {
          id: "oo-doe",
          name: "Operational stream (OO)",
          code: "OO",
          description:
            "Operational roles — the stream that covers school and facilities operations, trades and support work. Seven levels.",
          bands: [
            {
              code: "OO1",
              name: "Operational Officer 1",
              aliases: [],
              summary: "Six pay points, on a 72.5-hour fortnight.",
              min: 43_107,
              max: 60_868,
              payPoints: [
                { label: "OO1/1", annual: 43_107 },
                { label: "OO1/2", annual: 46_898 },
                { label: "OO1/3", annual: 50_075 },
                { label: "OO1/4", annual: 53_897 },
                { label: "OO1/5", annual: 57_041 },
                { label: "OO1/6", annual: 60_868 },
              ],
              note:
                "On a 76-hour fortnight the same pay points annualise higher, from $45,017 to $62,131.",
            },
            {
              code: "OO2",
              name: "Operational Officer 2",
              aliases: [],
              summary: "Four pay points.",
              min: 63_394,
              max: 68_544,
              payPoints: [
                { label: "OO2/1", annual: 63_394 },
                { label: "OO2/2", annual: 65_089 },
                { label: "OO2/3", annual: 66_845 },
                { label: "OO2/4", annual: 68_544 },
              ],
            },
            {
              code: "OO3",
              name: "Operational Officer 3",
              aliases: [],
              summary: "Four pay points.",
              min: 69_558,
              max: 73_876,
              payPoints: [
                { label: "OO3/1", annual: 69_558 },
                { label: "OO3/2", annual: 70_918 },
                { label: "OO3/3", annual: 72_400 },
                { label: "OO3/4", annual: 73_876 },
              ],
            },
            {
              code: "OO4",
              name: "Operational Officer 4",
              aliases: [],
              summary: "Four pay points.",
              min: 76_869,
              max: 84_114,
              payPoints: [
                { label: "OO4/1", annual: 76_869 },
                { label: "OO4/2", annual: 79_271 },
                { label: "OO4/3", annual: 81_771 },
                { label: "OO4/4", annual: 84_114 },
              ],
            },
            {
              code: "OO5",
              name: "Operational Officer 5",
              aliases: [],
              summary: "Four pay points.",
              min: 86_245,
              max: 94_567,
              payPoints: [
                { label: "OO5/1", annual: 86_245 },
                { label: "OO5/2", annual: 88_956 },
                { label: "OO5/3", annual: 91_820 },
                { label: "OO5/4", annual: 94_567 },
              ],
            },
            {
              code: "OO6",
              name: "Operational Officer 6",
              aliases: [],
              summary: "Three pay points.",
              min: 98_543,
              max: 103_665,
              payPoints: [
                { label: "OO6/1", annual: 98_543 },
                { label: "OO6/2", annual: 101_165 },
                { label: "OO6/3", annual: 103_665 },
              ],
            },
            {
              code: "OO7",
              name: "Operational Officer 7",
              aliases: [],
              summary: "Three pay points — the top of the operational stream.",
              min: 108_504,
              max: 113_623,
              payPoints: [
                { label: "OO7/1", annual: 108_504 },
                { label: "OO7/2", annual: 111_030 },
                { label: "OO7/3", annual: 113_623 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "qld-nursing-2026",
      title: "Queensland Health nursing classifications, from 1 April 2026",
      coverage:
        "The nursing classifications published in the schedule to the Nurses and Midwives (Queensland Health and Department of Education) Certified Agreement (EB12) 2025 that appear in the Department of Education's own wage schedule. It is not the full Queensland Health nursing scale — the registered nurse grades below Clinical Nurse are not reproduced here.",
      basis: "agreement",
      effectiveFrom: "1 April 2026",
      rangeMeaning: "Bottom and top pay point of the classification, annualised.",
      sourceId: "doe-ca-2025",
      note:
        "Increases under EB12 are 3.5% from 1 April 2025 (CPI Uplift Adjustment triggered in year one), 2.5% from 1 April 2026, 2.5% from 1 April 2027 and 3% from 1 December 2027. Queensland Health publishes the complete wage rates for every nursing, health practitioner and medical classification.",
      streams: [
        {
          id: "qld-nursing",
          name: "Nursing classifications",
          code: "NG",
          description:
            "Queensland Health and Department of Education nurses are covered by the same certified agreement, so these rates apply in both.",
          bands: [
            {
              code: "NG6.1",
              name: "Clinical Nurse (classification 6.1)",
              aliases: ["clinical nurse pay qld", "nurse pay rates qld", "qld health pay rates"],
              summary: "Four pay points.",
              min: 114_532,
              max: 122_643,
              payPoints: [
                { label: "6.1/1", annual: 114_532 },
                { label: "6.1/2", annual: 117_227 },
                { label: "6.1/3", annual: 119_925 },
                { label: "6.1/4", annual: 122_643 },
              ],
            },
            {
              code: "NG6.2",
              name: "Associate Clinical Nurse Consultant (classification 6.2)",
              aliases: [],
              summary: "Two pay points.",
              min: 128_740,
              max: 131_440,
              payPoints: [
                { label: "6.2/1", annual: 128_740 },
                { label: "6.2/2", annual: 131_440 },
              ],
            },
            {
              code: "NG7",
              name: "Clinical Nurse Consultant (classification 7)",
              aliases: [],
              summary: "Four pay points.",
              min: 140_632,
              max: 152_685,
              payPoints: [
                { label: "7/1", annual: 140_632 },
                { label: "7/2", annual: 146_997 },
                { label: "7/3", annual: 150_653 },
                { label: "7/4", annual: 152_685 },
              ],
            },
            {
              code: "NG10",
              name: "Senior Nurse Manager (classification 10)",
              aliases: [],
              summary: "Two pay points.",
              min: 165_320,
              max: 173_327,
              payPoints: [
                { label: "10/1", annual: 165_320 },
                { label: "10/2", annual: 173_327 },
              ],
            },
          ],
        },
      ],
    },
  ],

  progression: [
    "Queensland classifications are written as level and pay point — AO3/2, PO4/1, OO5/3. Each level contains several incremental pay points, and the Department of Education states plainly that each classification level contains incremental progression points; the certified agreement and the directives issued for the public sector set when you move up one, not the salary schedule itself.",
    "The width of a level matters more in Queensland than in most services because the levels overlap. AO6/4 and PO4/4 both pay $134,019 under the award from 1 September 2026, and AO7 and PO5 are identical at every pay point, so a move between streams at the equivalent level is not a pay rise. AO2 is the longest ladder, with eight pay points spanning $63,814 to $75,997 — more than $12,000 without a promotion.",
    "An employee is never paid below the award. Where an agreement rate has fallen behind an award increase, the award rate applies instead — and after the 4.75% award increase from 1 September 2026 that now happens at many pay points. The Department of Education's AO3 agreement rates from 1 September 2026, for example, run from $80,505 to $89,326, below the award's $81,032 to $89,903, so the award rate is what an AO3 there is paid.",
    "Senior officer (SO) roles sit above AO8 and are award-free, with conditions set by directive rather than by the award schedule, so they are not included in the tables above.",
  ],

  superannuation: {
    rate: 12.75,
    text:
      "The Queensland Government's employer superannuation contribution is 12.75% for employees under 75 — above the Superannuation Guarantee rate. It is paid on ordinary time earnings including paid leave and ordinary-time allowances such as shift allowances and weekend penalties. On an AO5/1 award salary of $109,704 that is $13,987 a year of employer super, and the 0.75 percentage points above the guarantee rate is worth about $823 a year.",
    sourceId: "qld-super",
  },

  sources: [
    {
      id: "qirc-award-2026",
      title:
        "Queensland Public Service Officers and Other Employees Award – State 2015, reprint as at 1 September 2026",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/sites/default/files/2026-09/qld_public_service_010926.pdf",
      effectiveFrom: "1 September 2026",
      verifiedOn: "23 September 2026",
      note:
        "Clause 12.3(a) to (d): administrative, professional, technical and operational stream minimum salaries, Annual Salary column. Certified by the Industrial Registrar as a true and correct copy of the award as at 1 September 2026.",
    },
    {
      id: "qirc-swc-2026",
      title: "Declaration of General Ruling (State Wage Case 2026) [2026] QIRC 280",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/sites/default/files/2026-09/2026_b59_b60_decision.pdf",
      effectiveFrom: "1 September 2026",
      verifiedOn: "23 September 2026",
      note: "4.75% increase to wages and salaries in all state awards, operative on and from 1 September 2026; delivered 4 September 2026.",
    },
    {
      id: "cdsb-schedules",
      title:
        "Administrative, professional and technical stream salary schedules (award rates from 1 September 2025, superseded)",
      publisher: "Queensland Department of Customer Services",
      url: "https://www.cdsb.qld.gov.au/about-us/working-with-us/our-agreement-and-wages/administrative-salary-schedule",
      effectiveFrom: "1 September 2025",
      verifiedOn: "28 August 2026",
      note:
        "The previous source for this page's award figures. Its 1 September 2025 award column is superseded by the 1 September 2026 reprint above; kept for the record of the August 2026 comparison between award and agreement rates.",
    },
    {
      id: "qirc-award",
      title: "Queensland Public Service Officers and Other Employees Award – State 2015",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/documents/3466",
      verifiedOn: "28 August 2026",
      note: "The award itself, including the reprint operative from 1 September 2025.",
    },
    {
      id: "doe-ca-2025",
      title:
        "Schedule of all salary rates under current certified agreements, uplifted for the CPI Uplift Adjustment",
      publisher: "Queensland Department of Education",
      url: "https://alt-qed.qed.qld.gov.au/workingwithus/induction/centralandregionaloffices/Documents/updated-certified-agreement-wage-rates.xlsx",
      effectiveFrom: "1 September 2026",
      verifiedOn: "28 August 2026",
      note:
        "Department of Education Certified Agreement 2025 rates for the AO, PO, TO and OO streams, and EB12 nursing rates. Cross-checked against the department's own salary schedule at qed.qld.gov.au, which shows the same figures.",
    },
    {
      id: "qld-core-status",
      title: "State Government Entities Certified Agreement — negotiation updates",
      publisher: "Queensland Government (For government)",
      url: "https://www.forgov.qld.gov.au/pay-benefits-and-policy/benefits/state-government-entities-certified-agreement",
      verifiedOn: "28 August 2026",
      note:
        "Source for the Core Agreement's 30 June 2026 nominal expiry, the lapsed offer of at least 8.5%, and the fact that the 2023 agreement continues to apply until replaced. Page last updated 5 August 2026.",
    },
    {
      id: "qirc-wage-case",
      title: "State wage cases — 2026 State Wage Case",
      publisher: "Queensland Industrial Relations Commission",
      url: "https://www.qirc.qld.gov.au/state-wage-cases",
      verifiedOn: "23 September 2026",
      note:
        "Index of state wage cases. The 2026 case was decided on 4 September 2026: 4.75% from 1 September 2026.",
    },
    {
      id: "qld-super",
      title: "Human resources — superannuation",
      publisher: "Queensland Department of Education",
      url: "https://alt-qed.qed.qld.gov.au/working-with-us/induction/central-and-regional-offices/human-resources",
      verifiedOn: "28 August 2026",
      note:
        "States the Queensland Government contribution of 12.75% for employees under 75, paid on ordinary time earnings. Whole-of-government detail is at forgov.qld.gov.au/pay-benefits-and-policy/benefits/superannuation.",
    },
    {
      id: "qld-health-wage-rates",
      title: "Queensland Health wage rates",
      publisher: "Queensland Health",
      url: "https://www.health.qld.gov.au/hrpolicies/wage-rates",
      verifiedOn: "28 August 2026",
      note:
        "The authority for Queensland Health's own administrative, operational, technical, professional, nursing, health practitioner and medical schedules. Its pages did not load for us on the verification date, so no figure on this page is taken from them.",
    },
  ],

  unverified: [
    "Queensland Health's own wage rate schedules. health.qld.gov.au did not load on the verification date, so nothing on this page is sourced from it. The nursing figures shown come from the certified agreement schedule published by the Department of Education, and only for the classifications that appear there — check the Queensland Health wage rates pages for the registered nurse grades, medical officers, dental officers and the health practitioner (HP) stream.",
    "The State Government Entities Certified Agreement 2023 (Core Agreement) wage schedule, which covers most Queensland departments. The published agreement is a large PDF we could not read in full, so its rates are not reproduced. It continues to apply until a replacement is certified.",
    "Senior officer (SO) salary rates, which are award-free and set by directive.",
    "Health practitioner (HP) stream rates. They appear in the departmental schedule but without a named agreement in that document, so they are not published here.",
  ],

  faqs: [
    {
      q: "What is an AO3 salary in the Queensland Government?",
      a: "From 1 September 2026, AO3 pays at least $81,032 at pay point 1 rising to $89,903 at pay point 4 under the Queensland Public Service Officers and Other Employees Award – State 2015, after the 4.75% State Wage Case increase. Some agency agreements are now below that: the Department of Education Certified Agreement 2025 sets AO3 at $80,505 to $89,326 from 1 September 2026, so the higher award rate is what is paid.",
    },
    {
      q: "What is a PO4 salary?",
      a: "PO4 pays $124,627 to $134,019 across four pay points under the award from 1 September 2026. PO4/4 pays exactly the same as AO6/4. The Department of Education Certified Agreement 2025 sets PO4 at $123,829 to $133,171 from 1 September 2026, below the award, so the award rate applies.",
    },
    {
      q: "What are the Queensland Government classification streams?",
      a: "Four: administrative (AO), professional (PO), technical (TO) and operational (OO). Each level contains numbered pay points, written as AO3/2 or PO4/1. Nurses, health practitioners, teachers and medical officers sit outside these streams on their own certified agreements.",
    },
    {
      q: "What are Queensland Health pay rates?",
      a: "Queensland Health's corporate and clinical workforces are covered by several separate certified agreements and Queensland Health publishes a wage rates page for each stream. From the nursing agreement that covers both Queensland Health and the Department of Education, a Clinical Nurse is paid $114,532 to $122,643 and a Clinical Nurse Consultant $140,632 to $152,685 from 1 April 2026. For the registered nurse grades, medical officers and the health practitioner stream, go to the Queensland Health wage rates pages — we could not load them on the date this page was verified and have not estimated them.",
    },
    {
      q: "When is the next Queensland public service pay rise?",
      a: "Award rates rose 4.75% from 1 September 2026 under the 2026 State Wage Case ([2026] QIRC 280), and the rates on this page include that increase. The State Government Entities Certified Agreement 2023 nominally expired on 30 June 2026; the government's offer lapsed on 31 July 2026 when the unions did not accept it, and under Queensland's wages policy the first increase under a replacement agreement will now apply from the first day of the month in which in-principle agreement is reached.",
    },
    {
      q: "How much superannuation does the Queensland Government pay?",
      a: "12.75% of ordinary time earnings for employees under 75, which is above the Superannuation Guarantee rate. Employees aged 75 or over receive the guarantee rate.",
    },
  ],
};

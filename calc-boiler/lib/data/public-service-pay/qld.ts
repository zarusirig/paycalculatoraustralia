// =============================================================================
// Queensland public service — classification pay.
//
// Queensland has TWO layers and this file keeps them apart:
//
//   1. award-2025 — the Queensland Public Service Officers and Other Employees
//      Award – State 2015 rates from 1 September 2025. This is the service-wide
//      floor and it is the figure Queensland Government job ads quote (an AO3
//      advertised at $77,354 – $85,833 is quoting the award).
//   2. doe-2026 — one agency's certified agreement (Department of Education
//      Certified Agreement 2025) from 1 September 2026, shown because agency
//      agreements sit at or above the award and this is what a full agreement
//      schedule looks like. It is never presented as the whole-of-government
//      rate.
//
// The State Government Entities Certified Agreement 2023 (the Core Agreement),
// which covers most departments, nominally expired on 30 June 2026 and still
// applies while a replacement is negotiated; the unions rejected the
// government's offer on 31 July 2026. The 2026 State Wage Case, which seeks
// award increases operative from 1 September 2026, had not been decided when
// this page was verified. Both facts are on the page because they decide
// whether the rates below are about to move.
// =============================================================================

import type { Jurisdiction } from "./types";

export const QLD: Jurisdiction = {
  slug: "qld",
  name: "Queensland public service",
  shortName: "Queensland",
  label: "Queensland (AO, PO, TO, OO)",
  verifiedOn: "28 August 2026",

  headline:
    "In the Queensland public service an AO3 is paid $77,354 to $85,833 and a PO4 $118,966 to $127,940 under the Queensland Public Service Officers and Other Employees Award – State 2015 from 1 September 2025 — the figures Queensland Government job ads quote. Agency certified agreements pay at or above that floor: the Department of Education Certified Agreement 2025, for example, pays AO3 $80,505 to $89,326 and PO4 $123,829 to $133,171 from 1 September 2026.",

  metaTitle: "QLD Government Pay Rates 2026 — AO, PO, TO and OO Salary Scales",
  metaDescription:
    "Queensland public service pay points: AO1–AO8, PO1–PO6, TO1–TO6 and OO1–OO7, from the Queensland Public Service Officers and Other Employees Award – State 2015 and a certified agreement schedule, plus Queensland Health nursing rates and what each level is worth after tax.",

  instrument:
    "The Queensland Public Service Officers and Other Employees Award – State 2015 sets the classification structure — administrative (AO), professional (PO), technical (TO) and operational (OO) streams, each with numbered pay points — and the award rate for each point. Certified agreements then set rates at or above the award for the entities they cover.",

  payRise:
    "Award rates last moved on 1 September 2025. The 2026 State Wage Case was filed with the Queensland Industrial Relations Commission on 2 June 2026 seeking wage adjustments for award employees operative from 1 September 2026, and had not been decided when these figures were verified on 28 August 2026. Separately, the State Government Entities Certified Agreement 2023 nominally expired on 30 June 2026 and continues to apply until it is replaced; the government's offer of at least 8.5% over the life of a replacement agreement lapsed when the unions did not accept it by 31 July 2026, so the backdating of a first increase to 1 July 2026 is no longer on the table.",

  schedules: [
    {
      id: "award-2025",
      title:
        "Queensland Public Service Officers and Other Employees Award – State 2015, from 1 September 2025",
      coverage:
        "The service-wide award floor for the administrative, professional and technical streams. Every Queensland public service employee covered by the award is paid at least these rates; a certified agreement can pay more, never less.",
      basis: "award",
      effectiveFrom: "1 September 2025",
      rangeMeaning: "Bottom and top pay point of the classification level, annualised.",
      sourceId: "cdsb-schedules",
      note:
        "Annualised from a 72.5-hour fortnight, the standard for Queensland public servants. These are the rates Queensland Government job advertisements quote.",
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
              summary: "Entry administrative level, three pay points.",
              min: 46_908,
              max: 52_987,
              payPoints: [
                { label: "AO1/1", annual: 46_908 },
                { label: "AO1/2", annual: 49_960 },
                { label: "AO1/3", annual: 52_987 },
              ],
            },
            {
              code: "AO2",
              name: "Administrative Officer 2",
              aliases: ["ao2", "ao2 salary"],
              summary: "Eight pay points — the longest increment ladder in the stream.",
              min: 60_918,
              max: 72_554,
              payPoints: [
                { label: "AO2/1", annual: 60_918 },
                { label: "AO2/2", annual: 62_457 },
                { label: "AO2/3", annual: 64_022 },
                { label: "AO2/4", annual: 65_640 },
                { label: "AO2/5", annual: 67_205 },
                { label: "AO2/6", annual: 68_823 },
                { label: "AO2/7", annual: 70_623 },
                { label: "AO2/8", annual: 72_554 },
              ],
            },
            {
              code: "AO3",
              name: "Administrative Officer 3",
              aliases: ["ao3", "ao3 salary", "ao3 salary queensland government"],
              summary: "Four pay points.",
              min: 77_354,
              max: 85_833,
              payPoints: [
                { label: "AO3/1", annual: 77_354 },
                { label: "AO3/2", annual: 80_145 },
                { label: "AO3/3", annual: 83_015 },
                { label: "AO3/4", annual: 85_833 },
              ],
            },
            {
              code: "AO4",
              name: "Administrative Officer 4",
              aliases: ["ao4", "ao4 salary"],
              summary: "Four pay points.",
              min: 90_868,
              max: 99_582,
              payPoints: [
                { label: "AO4/1", annual: 90_868 },
                { label: "AO4/2", annual: 93_712 },
                { label: "AO4/3", annual: 96_686 },
                { label: "AO4/4", annual: 99_582 },
              ],
            },
            {
              code: "AO5",
              name: "Administrative Officer 5",
              aliases: ["ao5", "ao5 salary"],
              summary: "Four pay points.",
              min: 104_721,
              max: 113_618,
              payPoints: [
                { label: "AO5/1", annual: 104_721 },
                { label: "AO5/2", annual: 107_721 },
                { label: "AO5/3", annual: 110_670 },
                { label: "AO5/4", annual: 113_618 },
              ],
            },
            {
              code: "AO6",
              name: "Administrative Officer 6",
              aliases: ["ao6", "ao6 salary"],
              summary: "Four pay points.",
              min: 119_801,
              max: 127_940,
              payPoints: [
                { label: "AO6/1", annual: 119_801 },
                { label: "AO6/2", annual: 122_514 },
                { label: "AO6/3", annual: 125_253 },
                { label: "AO6/4", annual: 127_940 },
              ],
            },
            {
              code: "AO7",
              name: "Administrative Officer 7",
              aliases: ["ao7", "ao7 salary"],
              summary: "Four pay points.",
              min: 133_602,
              max: 143_124,
              payPoints: [
                { label: "AO7/1", annual: 133_602 },
                { label: "AO7/2", annual: 136_837 },
                { label: "AO7/3", annual: 139_967 },
                { label: "AO7/4", annual: 143_124 },
              ],
            },
            {
              code: "AO8",
              name: "Administrative Officer 8",
              aliases: ["ao8", "ao8 salary"],
              summary: "Four pay points — the top of the administrative stream.",
              min: 147_768,
              max: 156_143,
              payPoints: [
                { label: "AO8/1", annual: 147_768 },
                { label: "AO8/2", annual: 150_638 },
                { label: "AO8/3", annual: 153_377 },
                { label: "AO8/4", annual: 156_143 },
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
              summary: "Graduate entry level, seven pay points.",
              min: 48_212,
              max: 71_640,
              payPoints: [
                { label: "PO1/1", annual: 48_212 },
                { label: "PO1/2", annual: 52_648 },
                { label: "PO1/3", annual: 57_083 },
                { label: "PO1/4", annual: 63_422 },
                { label: "PO1/5", annual: 66_083 },
                { label: "PO1/6", annual: 68_692 },
                { label: "PO1/7", annual: 71_640 },
              ],
            },
            {
              code: "PO2",
              name: "Professional Officer 2",
              aliases: ["po2", "po2 salary"],
              summary: "Six pay points.",
              min: 77_250,
              max: 97_990,
              payPoints: [
                { label: "PO2/1", annual: 77_250 },
                { label: "PO2/2", annual: 81_346 },
                { label: "PO2/3", annual: 85_468 },
                { label: "PO2/4", annual: 89_694 },
                { label: "PO2/5", annual: 93_894 },
                { label: "PO2/6", annual: 97_990 },
              ],
            },
            {
              code: "PO3",
              name: "Professional Officer 3",
              aliases: ["po3", "po3 salary"],
              summary: "Four pay points.",
              min: 102_817,
              max: 111_974,
              payPoints: [
                { label: "PO3/1", annual: 102_817 },
                { label: "PO3/2", annual: 105_817 },
                { label: "PO3/3", annual: 108_922 },
                { label: "PO3/4", annual: 111_974 },
              ],
            },
            {
              code: "PO4",
              name: "Professional Officer 4",
              aliases: ["po4", "po4 salary", "po4 queensland"],
              summary: "Four pay points.",
              min: 118_966,
              max: 127_940,
              payPoints: [
                { label: "PO4/1", annual: 118_966 },
                { label: "PO4/2", annual: 121_966 },
                { label: "PO4/3", annual: 124_992 },
                { label: "PO4/4", annual: 127_940 },
              ],
            },
            {
              code: "PO5",
              name: "Professional Officer 5",
              aliases: ["po5", "po5 salary"],
              summary: "Four pay points, the same rates as AO7.",
              min: 133_602,
              max: 143_124,
              payPoints: [
                { label: "PO5/1", annual: 133_602 },
                { label: "PO5/2", annual: 136_837 },
                { label: "PO5/3", annual: 139_967 },
                { label: "PO5/4", annual: 143_124 },
              ],
            },
            {
              code: "PO6",
              name: "Professional Officer 6",
              aliases: ["po6", "po6 salary"],
              summary: "Four pay points, the same rates as AO8.",
              min: 147_768,
              max: 156_143,
              payPoints: [
                { label: "PO6/1", annual: 147_768 },
                { label: "PO6/2", annual: 150_638 },
                { label: "PO6/3", annual: 153_377 },
                { label: "PO6/4", annual: 156_143 },
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
              summary: "Seven pay points, identical to PO1.",
              min: 48_212,
              max: 71_640,
              payPoints: [
                { label: "TO1/1", annual: 48_212 },
                { label: "TO1/2", annual: 52_648 },
                { label: "TO1/3", annual: 57_083 },
                { label: "TO1/4", annual: 63_422 },
                { label: "TO1/5", annual: 66_083 },
                { label: "TO1/6", annual: 68_692 },
                { label: "TO1/7", annual: 71_640 },
              ],
            },
            {
              code: "TO2",
              name: "Technical Officer 2",
              aliases: ["to2"],
              summary: "Six pay points.",
              min: 72_788,
              max: 85_833,
              payPoints: [
                { label: "TO2/1", annual: 72_788 },
                { label: "TO2/2", annual: 75_397 },
                { label: "TO2/3", annual: 77_928 },
                { label: "TO2/4", annual: 80_667 },
                { label: "TO2/5", annual: 83_276 },
                { label: "TO2/6", annual: 85_833 },
              ],
            },
            {
              code: "TO3",
              name: "Technical Officer 3",
              aliases: ["to3"],
              summary: "Four pay points.",
              min: 90_868,
              max: 97_990,
              payPoints: [
                { label: "TO3/1", annual: 90_868 },
                { label: "TO3/2", annual: 93_190 },
                { label: "TO3/3", annual: 95_616 },
                { label: "TO3/4", annual: 97_990 },
              ],
            },
            {
              code: "TO4",
              name: "Technical Officer 4",
              aliases: ["to4"],
              summary: "Three pay points.",
              min: 102_817,
              max: 109_182,
              payPoints: [
                { label: "TO4/1", annual: 102_817 },
                { label: "TO4/2", annual: 105_974 },
                { label: "TO4/3", annual: 109_182 },
              ],
            },
            {
              code: "TO5",
              name: "Technical Officer 5",
              aliases: ["to5"],
              summary: "Four pay points.",
              min: 113_618,
              max: 123_427,
              payPoints: [
                { label: "TO5/1", annual: 113_618 },
                { label: "TO5/2", annual: 116_905 },
                { label: "TO5/3", annual: 120_166 },
                { label: "TO5/4", annual: 123_427 },
              ],
            },
            {
              code: "TO6",
              name: "Technical Officer 6",
              aliases: ["to6"],
              summary: "Three pay points — the top of the technical stream.",
              min: 127_340,
              max: 133_602,
              payPoints: [
                { label: "TO6/1", annual: 127_340 },
                { label: "TO6/2", annual: 130_549 },
                { label: "TO6/3", annual: 133_602 },
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
              aliases: ["oo1"],
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
              aliases: ["oo2"],
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
              aliases: ["oo3"],
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
              aliases: ["oo4"],
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
              aliases: ["oo5"],
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
              aliases: ["oo6"],
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
              aliases: ["oo7"],
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
    "The width of a level matters more in Queensland than in most services because the levels overlap. AO6/4 and PO4/4 both pay $127,940 under the award from 1 September 2025, and AO7 and PO5 are identical at every pay point, so a move between streams at the equivalent level is not a pay rise. AO2 is the longest ladder, with eight pay points spanning $60,918 to $72,554 — nearly $12,000 without a promotion.",
    "An agency's certified agreement can only pay above the award, never below it. Where an agreement rate has fallen behind an award increase, the award rate applies instead: the Department of Customer Services publishes exactly that comparison, noting that in August 2026 the award rate was higher than its agreement rate at AO2/7, AO3/2, AO3/3 and AO4/1.",
    "Senior officer (SO) roles sit above AO8 and are award-free, with conditions set by directive rather than by the award schedule, so they are not included in the tables above.",
  ],

  superannuation: {
    rate: 12.75,
    text:
      "The Queensland Government's employer superannuation contribution is 12.75% for employees under 75 — above the Superannuation Guarantee rate. It is paid on ordinary time earnings including paid leave and ordinary-time allowances such as shift allowances and weekend penalties. On an AO5/1 award salary of $104,721 that is $13,352 a year of employer super, and the 0.75 percentage points above the guarantee rate is worth about $785 a year.",
    sourceId: "qld-super",
  },

  sources: [
    {
      id: "cdsb-schedules",
      title:
        "Administrative, professional and technical stream salary schedules — award rates from 1 September 2025",
      publisher: "Queensland Department of Customer Services",
      url: "https://www.cdsb.qld.gov.au/about-us/working-with-us/our-agreement-and-wages/administrative-salary-schedule",
      effectiveFrom: "1 September 2025",
      verifiedOn: "28 August 2026",
      note:
        "The department publishes the Queensland Public Service Officers and Other Employees Award – State 2015 rate alongside its own agreement rate for each pay point. The award column is what is reproduced here. Page last updated 25 August 2026.",
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
      verifiedOn: "28 August 2026",
      note:
        "Applications filed 2 June 2026 seeking wage and allowance adjustments for award employees operative from 1 September 2026; undecided at the date of verification.",
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
    "Operational stream (OO) award rates. The award column is published per stream by Queensland departments and we could only retrieve the administrative, professional and technical streams; the OO figures shown are certified agreement rates, not the award floor.",
    "The State Government Entities Certified Agreement 2023 (Core Agreement) wage schedule, which covers most Queensland departments. The published agreement is a large PDF we could not read in full, so its rates are not reproduced. It continues to apply until a replacement is certified.",
    "Senior officer (SO) salary rates, which are award-free and set by directive.",
    "Health practitioner (HP) stream rates. They appear in the departmental schedule but without a named agreement in that document, so they are not published here.",
  ],

  faqs: [
    {
      q: "What is an AO3 salary in the Queensland Government?",
      a: "AO3 pays $77,354 at pay point 1 rising to $85,833 at pay point 4 under the Queensland Public Service Officers and Other Employees Award – State 2015 from 1 September 2025. That is the range Queensland Government job ads quote. Under one agency agreement — the Department of Education Certified Agreement 2025 — AO3 pays $80,505 to $89,326 from 1 September 2026.",
    },
    {
      q: "What is a PO4 salary?",
      a: "PO4 pays $118,966 to $127,940 across four pay points under the award from 1 September 2025. PO4/4 pays exactly the same as AO6/4. Under the Department of Education Certified Agreement 2025, PO4 pays $123,829 to $133,171 from 1 September 2026.",
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
      a: "Award rates last increased on 1 September 2025. The 2026 State Wage Case, filed on 2 June 2026, seeks adjustments operative from 1 September 2026 and had not been decided as at 28 August 2026. The State Government Entities Certified Agreement 2023 nominally expired on 30 June 2026; the government's offer lapsed on 31 July 2026 when the unions did not accept it, and under Queensland's wages policy the first increase under a replacement agreement will now apply from the first day of the month in which in-principle agreement is reached.",
    },
    {
      q: "How much superannuation does the Queensland Government pay?",
      a: "12.75% of ordinary time earnings for employees under 75, which is above the Superannuation Guarantee rate. Employees aged 75 or over receive the guarantee rate.",
    },
  ],
};

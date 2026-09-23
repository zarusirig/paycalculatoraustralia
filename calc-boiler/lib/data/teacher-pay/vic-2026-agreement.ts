// Victoria — the proposed Victorian Government Schools Agreement 2026.
//
// Source of every salary: Schedule 1 ("Salary Rates") of the Proposed
// Victorian Government Schools Agreement 2026, published by the Department of
// Education on its Enterprise Bargaining resources page and read in full on
// 23 September 2026. Percentages come from the department's Agreement
// Explanation for the same document. Ballot figures come from the department's
// Enterprise Bargaining overview (updated 17 September 2026).
//
// STATUS: approved by an employee ballot (93.1% yes) but NOT yet approved by
// the Fair Work Commission. The agreement starts operating on the seventh day
// after FWC approval (clause 5). Until then the VGSA 2022 rates in vic.ts are
// what is payable. Lodged with the FWC on 23 September 2026 (AG2026/2746);
// the FWC agreements-in-progress list showed "Initial assessment" on
// 24 September 2026. When FWC approves it:
//   1. move the current column into vic.ts scales,
//   2. flip VIC_2026_AGREEMENT.status to "approved" and record the date,
//   3. update vic.ts notices, nextIncrease, faqs and verifiedOn.

export interface ProposedStep {
  label: string;
  /** Salary from the first pay period on or after each date in VIC_2026_EFFECTIVE_DATES, in order. */
  rates: readonly [number, number, number, number, number];
  note?: string;
}

export interface ProposedScale {
  id: string;
  title: string;
  steps: ProposedStep[];
}

/** Schedule 1 column headings, as printed ("Effective from the first pay period on or after"). */
export const VIC_2026_EFFECTIVE_DATES = [
  "10 August 2026",
  "1 October 2026",
  "1 November 2027",
  "1 November 2028",
  "1 November 2029",
] as const;

/** Short column labels for tables. */
export const VIC_2026_COLUMN_LABELS = ["Aug 2026", "Oct 2026", "Nov 2027", "Nov 2028", "Nov 2029"] as const;

/** Salary increase at each date, from the department's Agreement Explanation. */
export const VIC_2026_INCREASES = [
  "3.00% to 6.33%",
  "9.75%",
  "4.00% to 7.12%",
  "4.00%",
  "4.90%",
] as const;

export const VIC_2026_AGREEMENT = {
  name: "Victorian Government Schools Agreement 2026",
  status: "pending-fwc" as "pending-fwc" | "approved",
  /** In-principle offer announced by the government. */
  inPrincipleAnnounced: "17 August 2026",
  /** Ballot result announced. */
  ballotAnnounced: "17 September 2026",
  ballotParticipants: 80_742,
  ballotParticipationPct: 77.1,
  ballotYesPct: 93.1,
  nominalExpiry: "10 August 2030",
  lumpSum: 2_000,
  headlineRiseOverFourYears: "28.3% to 32.4%",
  verifiedOn: "23 September 2026",
  /** Fair Work Commission approval application (agreements-in-progress list). */
  fwcMatter: "AG2026/2746",
  fwcLodged: "23 September 2026",
  /** Last date the FWC list was checked, and the stage it showed. */
  fwcCheckedOn: "24 September 2026",
  fwcStage: "initial assessment",
  fwcProgressUrl:
    "https://www.fwc.gov.au/work-conditions/enterprise-agreements/find-enterprise-agreement/agreements-progress",
  agreementUrl: "https://content.sdp.education.vic.gov.au/media/proposed-vgsa-2026-3615",
  resourcesUrl: "https://www2.education.vic.gov.au/pal/enterprise-bargaining/resources",
  overviewUrl: "https://www2.education.vic.gov.au/pal/enterprise-bargaining/overview",
} as const;

export const VIC_2026_SCALES: ProposedScale[] = [
  {
    id: "classroom-teachers-2026",
    title: "Classroom teachers — Range 1 and Range 2",
    steps: [
      { label: "1-1", rates: [84_631, 92_882, 96_598, 100_462, 105_384], note: "Graduate entry point" },
      { label: "1-2", rates: [86_848, 95_316, 99_128, 103_094, 108_145] },
      { label: "1-3", rates: [89_454, 98_175, 102_102, 106_186, 111_390] },
      { label: "1-4", rates: [92_137, 101_121, 105_165, 109_372, 114_731] },
      { label: "1-5", rates: [94_901, 104_154, 108_320, 112_653, 118_173], note: "Top of Range 1" },
      { label: "2-1", rates: [97_274, 106_758, 111_028, 115_469, 121_127] },
      { label: "2-2", rates: [100_863, 110_697, 115_125, 119_730, 125_597] },
      { label: "2-3", rates: [104_585, 114_782, 119_373, 124_148, 130_232] },
      { label: "2-4", rates: [108_444, 119_018, 123_778, 128_729, 135_037] },
      { label: "2-5", rates: [112_446, 123_409, 128_346, 133_480, 140_020] },
      { label: "2-6", rates: [121_600, 133_456, 138_794, 144_346, 151_419], note: "Top of the classroom teacher scale" },
    ],
  },
  {
    id: "leading-teacher-learning-specialist-2026",
    title: "Leading teachers and learning specialists — Range 3",
    steps: [
      { label: "3-1", rates: [127_690, 140_140, 145_745, 151_575, 159_002] },
      { label: "3-2", rates: [133_430, 146_439, 152_297, 158_389, 166_150] },
    ],
  },
];

/** The proposed salary for a step at a Schedule 1 column index, or null. */
export function proposedRate(scaleId: string, label: string, column: number): number | null {
  const scale = VIC_2026_SCALES.find((s) => s.id === scaleId);
  const step = scale?.steps.find((s) => s.label === label);
  if (!step || column < 0 || column >= step.rates.length) return null;
  return step.rates[column];
}

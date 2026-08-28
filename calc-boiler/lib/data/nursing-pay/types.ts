// =============================================================================
// Public-health nursing and midwifery pay scales — shared types.
//
// Every figure in this directory was read from the instrument or the employer
// wage schedule named next to it, on the date recorded in `verifiedOn`.
// Nothing is estimated, interpolated or averaged. Where a source does not
// publish a rate for a classification, the row is omitted and the omission is
// recorded in `notReproduced` or `unverified` so the page can say so.
//
// THE ONE RULE THAT SHAPES THIS MODEL
// -----------------------------------
// Nursing classifications are genuinely different in every state. NSW pays a
// "Registered Nurse/Midwife 1st Year", Queensland pays a "Nurse Grade 5 pay
// point 1", Victoria pays an "RN Grade 2 Year 1", Western Australia pays a
// "Registered Nurse/Midwife Level 1.1", South Australia pays a "Registered
// Nurse/Midwife (Level 1) 1st increment" and Tasmania pays a "Registered Nurse
// Grade 3 Year 1". Those are not the same job description and they are not on
// the same money. Flattening them onto one invented ladder would be the single
// easiest way to publish a wrong number, so this model never does it: each
// state carries its own `PayScale[]` with the source's own wording verbatim.
//
// `ScaleFamily` exists only so the UI can group and order sections in a
// consistent way across states. It is a presentation grouping, never a claim
// that two states' rows are equivalent.
//
// UNITS
// -----
// States publish different units. NSW publishes weekly only. Victoria
// publishes weekly plus an "Indicative Hourly Rate". Queensland publishes per
// annum, per fortnight, per hour and casual per hour. WA's nurse agreement
// publishes per annum while its enrolled-nurse agreement publishes weekly. SA
// and Tasmania publish per annum only.
//
// `PayPoint` therefore stores only what the source actually printed. Anything
// else is derived at render time by the helpers in ./index.ts, which state the
// arithmetic on the page. A derived figure is never stored as if published.
// =============================================================================

/**
 * States with a spoke page. ACT and NT are deliberately absent: their
 * instruments have not been read yet. Adding one is a new file plus one line
 * in NURSING_PAY_BY_STATE — no type or component change.
 */
export type NursingStateSlug = "nsw" | "vic" | "qld" | "wa" | "sa" | "tas" | "act" | "nt";

export type NursingStateCode = "NSW" | "VIC" | "QLD" | "WA" | "SA" | "TAS" | "ACT" | "NT";

/** A citable document. Every rate on the site traces to one of these. */
export interface RateSource {
  title: string;
  url: string;
  publisher: string;
}

/**
 * An industrial instrument (award, enterprise agreement, certified agreement,
 * industrial agreement) plus the effective date of the rates read from it.
 *
 * A state can carry more than one: WA nurses and WA enrolled nurses are covered
 * by two separate agreements, and Queensland reads wages from a certified
 * agreement but penalties from the parent award.
 */
export interface Instrument {
  /** Stable key referenced by PayScale.instrumentId and PenaltySet.instrumentId. */
  id: string;
  name: string;
  /** Verbatim from the source, e.g. "1 April 2026" or "first full pay period on or after 11 May 2026". */
  effectiveFrom: string;
  /** The next scheduled increase, where the source publishes a dated column for it. */
  nextIncrease?: string;
  /** Tribunal that made or approved the instrument. */
  tribunal: string;
  /** Matter/agreement/case identifier, where the source gives one. */
  reference?: string;
  source: RateSource;
  note?: string;
}

/**
 * One row of a pay scale. Only fields the source itself printed are set.
 * `annual`, `weekly`, `fortnightly`, `hourly` and `casualHourly` are all
 * optional for exactly that reason.
 */
export interface PayPoint {
  /** The source's own label for this step, verbatim. */
  label: string;
  annual?: number;
  weekly?: number;
  fortnightly?: number;
  hourly?: number;
  casualHourly?: number;
  /** Used where a published table has a classification row but no rate yet. */
  note?: string;
}

/**
 * Presentation grouping only. Two states sharing a family do NOT share a
 * classification — see the header note.
 */
export type ScaleFamily =
  | "support"
  | "enrolled"
  | "registered"
  | "midwife"
  | "clinical"
  | "management"
  | "practitioner";

export const SCALE_FAMILY_LABELS: Readonly<Record<ScaleFamily, string>> = {
  support: "Assistants in nursing and undergraduate students",
  enrolled: "Enrolled nurses",
  registered: "Registered nurses and midwives",
  midwife: "Midwives (separate scale)",
  clinical: "Clinical nurse, specialist and consultant grades",
  management: "Unit managers and nursing management",
  practitioner: "Nurse practitioners",
} as const;

/** Render order for the families above. */
export const SCALE_FAMILY_ORDER: readonly ScaleFamily[] = [
  "registered",
  "midwife",
  "enrolled",
  "clinical",
  "management",
  "practitioner",
  "support",
] as const;

export interface PayScale {
  /** The source's own classification name, verbatim. Never renamed. */
  classification: string;
  /** The state's own grade/level code where it publishes one, e.g. "Nurse Grade 5". */
  gradeCode?: string;
  family: ScaleFamily;
  /** Which Instrument.id these rates came from. */
  instrumentId: string;
  points: PayPoint[];
  note?: string;
}

export interface PenaltyRow {
  label: string;
  /** Verbatim from the instrument, e.g. "time and one-half" or "20%". */
  value: string;
  note?: string;
}

export interface PenaltySet {
  instrumentId: string;
  /** Clause number in the instrument the rows were read from. */
  clause: string;
  rows: PenaltyRow[];
  /** Anything the instrument covers that is deliberately not reproduced. */
  incomplete?: string;
}

/** How a figure the source did not print is worked out, if it is at all. */
export interface DerivationNotes {
  /** e.g. "weekly rate x 52 (26 fortnightly pays)". Absent means annual is published. */
  annual?: string;
  /** e.g. "weekly rate divided by 38, as clause 29(iii) prescribes for part-timers". */
  hourly?: string;
}

export interface NursingStateData {
  slug: NursingStateSlug;
  code: NursingStateCode;
  /** "New South Wales" */
  name: string;
  /** "NSW Health" — the employer or employer group the scales apply to. */
  employer: string;
  /** Search-facing short form used in headings, e.g. "QLD". */
  shortName: string;
  /** Ordinary full-time hours per week under the instrument. */
  ordinaryHoursPerWeek: number;
  /** First entry is the primary wage instrument. */
  instruments: Instrument[];
  scales: PayScale[];
  penalties: PenaltySet[];
  derivation: DerivationNotes;
  /**
   * Rows that exist in the published table but are not reproduced here, so the
   * page can say what it left out rather than implying the table is complete.
   */
  notReproduced: string[];
  /** Figures we could not verify and therefore do not publish at all. */
  unverified: string[];
  /** Date every figure above was read from its source. */
  verifiedOn: string;
  /** One paragraph of state-specific framing for the top of the page. */
  intro: string;
  /** Short, checkable, state-specific facts. */
  highlights: string[];
  /** Extra reading beyond the instruments, e.g. an employer salary page. */
  extraSources?: RateSource[];
}

/** Rates for a single classification in the federal Nurses Award 2020. */
export interface AwardPayPoint {
  label: string;
  weekly: number;
  hourly: number;
}

export interface AwardScale {
  classification: string;
  points: AwardPayPoint[];
  note?: string;
}

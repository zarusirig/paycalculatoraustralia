// =============================================================================
// Public-school teacher pay scales, by state and territory — shared types.
//
// Every salary in this directory was read off the enterprise agreement, award
// or department salary schedule named in the state's `sources` array, on the
// date in `verifiedOn`. NOTHING here is estimated, averaged, interpolated or
// carried over from a previous year. If a step could not be read from a primary
// source it is not published: it goes in `unverified` instead, and the page
// tells the reader which parts are missing and where to go for them.
//
// State scales step up on scheduled dates written into the agreement, so each
// state records `ratesEffectiveFrom` (the date the published column took
// effect) and `nextIncrease` (the next scheduled rise, where the instrument
// already publishes one). Re-verify after `nextIncrease.date`.
// =============================================================================

export const TEACHER_STATE_SLUGS = [
  "nsw",
  "vic",
  "qld",
  "wa",
  "sa",
  "tas",
  "act",
  "nt",
] as const;

export type TeacherStateSlug = (typeof TEACHER_STATE_SLUGS)[number];

/** One row of a published salary schedule. */
export interface PayStep {
  /** The classification label exactly as the instrument writes it, e.g. "Step 3", "2-4", "Band 3 Step 2". */
  label: string;
  /** Annual full-time salary in whole dollars, exactly as published. */
  salary: number;
  /** Optional gloss the instrument itself supports, e.g. "Proficient accreditation". */
  note?: string;
}

/** A published schedule — one classification family per table. */
export interface PayScale {
  /** Anchor-safe id, unique within the state. */
  id: string;
  /** Heading shown above the table. */
  title: string;
  /** One sentence saying who the table covers. */
  intro: string;
  steps: PayStep[];
  /** Column header for the step column, e.g. "Step", "Subdivision", "Classification". */
  stepHeading: string;
  /**
   * When THIS table's rates took effect, where that differs from the state's
   * headline `ratesEffectiveFrom`. Queensland's official schedule, for example,
   * dates its classroom teacher column and its leadership columns differently.
   */
  effectiveFrom?: string;
}

/** A daily/hourly casual rate table — kept separate because it is not annual. */
export interface CasualRate {
  label: string;
  /** Rate in dollars. */
  rate: number;
  /** "day" or "hour". */
  unit: "day" | "hour";
  note?: string;
}

export interface TeacherPaySource {
  title: string;
  publisher: string;
  url: string;
}

/** A "which step am I on" rule, quoted or closely paraphrased from the instrument. */
export interface ProgressionRule {
  heading: string;
  body: string[];
}

export interface TeacherPayFaq {
  q: string;
  a: string;
}

export interface TeacherPayState {
  slug: TeacherStateSlug;
  /** "NSW", "VIC", … */
  code: string;
  /** Proper noun, used in titles: "New South Wales", "Australian Capital Territory". */
  name: string;
  /** The same name as it reads mid-sentence: "New South Wales", "the ACT". */
  nameInSentence: string;
  /** How the page refers to the scale's owner, e.g. "NSW Department of Education". */
  employer: string;
  /** Exact title of the instrument the salaries come from. */
  agreementName: string;
  /** Where the reader can read that instrument. */
  agreementUrl: string;
  /** Plain-English date the published column took effect, e.g. "9 October 2025". */
  ratesEffectiveFrom: string;
  /** The next scheduled rise, where the instrument already publishes one. */
  nextIncrease: { date: string; detail: string } | null;
  /** Date every figure on the page was read from its source. */
  verifiedOn: string;
  /** Annual salary schedules, in the order they should be rendered. */
  scales: PayScale[];
  /** Casual / relief teacher rates, if published. */
  casual: CasualRate[];
  /** "Which step am I on" — progression rules for this state. */
  progression: ProgressionRule[];
  /** Caveats the reader needs, e.g. an expired agreement or a pending deal. */
  notices: string[];
  /** Classifications or steps NOT published here, and why. Rendered on the page. */
  unverified: string[];
  sources: TeacherPaySource[];
  faqs: TeacherPayFaq[];
}

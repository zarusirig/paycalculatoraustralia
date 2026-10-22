// =============================================================================
// Public hospital pay for pharmacists, medical imaging and allied health
// professionals, by state (23 October 2026).
//
// Most hospital pharmacists, radiographers, physiotherapists, occupational
// therapists, psychologists and sonographers work for a state public health
// service. They are paid under a STATE instrument (a state award, a certified
// agreement or an enterprise agreement), not the federal award the
// /job-pay-rates/ pages lead with. This module holds those state scales.
//
// SOURCING RULES (the same as the rest of the site):
//   - Every figure is copied from the instrument's own published table. Weekly
//     scales are annualised x 52 by the page and say so; annual and
//     fortnightly scales are printed as published.
//   - Each instrument records the column the figures came from, verbatim, the
//     date it was read, the next increase the instrument itself states (or
//     null), and a proof quote kept for audit.
//   - A state we could not verify is left out and listed in NOT_VERIFIED.
//     Nothing is estimated.
// =============================================================================

export const ALLIED_PROFESSIONS = [
  "pharmacist",
  "radiographer",
  "physiotherapist",
  "psychologist",
  "occupational-therapist",
  "sonographer",
] as const;

export type AlliedProfession = (typeof ALLIED_PROFESSIONS)[number];

export const PUBLIC_HEALTH_STATES = ["nsw", "vic", "qld", "wa", "sa"] as const;

export type PublicHealthState = (typeof PUBLIC_HEALTH_STATES)[number];

export interface PublicPaySource {
  title: string;
  publisher: string;
  url: string;
}

/** One state award, certified agreement or enterprise agreement. */
export interface PublicPayInstrument {
  id: string;
  /** Full name as the instrument prints it. */
  name: string;
  /** Who made, certified or approved it, e.g. "Industrial Relations Commission of NSW". */
  tribunal: string;
  /** When the rates shown took effect, in plain words, e.g. "the first full pay period on or after 1 July 2026". */
  ratesFrom: string;
  /** The column heading the figures were copied from, verbatim. Audit only. */
  column: string;
  /** Where the full text with the pay table can be read. */
  source: PublicPaySource;
  /** Other official pages relied on (approval record, employer rate page, status). */
  extraSources?: PublicPaySource[];
  verifiedOn: string;
  /** The next increase the instrument itself schedules, in plain words; null when it schedules none. */
  nextIncrease: string | null;
  /** One or two plain sentences on where the instrument stands (expiry, replacement). Reader-facing. */
  status: string;
  /** Verbatim words from the source that fix the rates column. Audit only, not rendered. */
  proof: string;
}

/** One pay step. Only the figures the instrument publishes are set. */
export interface PublicPayStep {
  /** Step name, close to the instrument's own wording. */
  label: string;
  weekly?: number;
  fortnightly?: number;
  annual?: number;
  /**
   * The rate for this step at the instrument's next scheduled increase, where
   * the instrument already prints it (annual). Only set when `nextIncrease`
   * is not null.
   */
  nextAnnual?: number;
  /** Short gloss, e.g. "before registration". */
  note?: string;
}

/** One pay table: one classification structure from one instrument. */
export interface PublicPayScale {
  /** Anchor-safe id, unique within the state. */
  id: string;
  state: PublicHealthState;
  /** The professions this table pays. */
  professions: readonly AlliedProfession[];
  instrumentId: string;
  /** Short table name, e.g. "Pharmacists" or "Health professionals (physiotherapy, occupational therapy and others)". */
  title: string;
  /** "published": the instrument prints the annual salary. "weekly x 52": the page annualises a weekly rate. */
  annualBasis: "published" | "weekly x 52";
  /** Ordinary hours a week, where the instrument states them for this table. */
  hoursPerWeek?: number;
  steps: PublicPayStep[];
  /** Label of the first step for a qualified, registered practitioner. The answer box "from" figure. */
  entry: string;
  /** The instrument's starting-step rule in plain words, with its clause. */
  entryRule: string;
  /** Label of the highest step shown. The answer box "top" figure. */
  top: string;
  /** What the top step is, in plain words. */
  topNote: string;
  /** Profession-specific starting rules from the same instrument. */
  professionNotes?: Partial<Record<AlliedProfession, string>>;
  /** Reader-facing caveats for this table. */
  notes?: string[];
}

export interface StatePublicHealthPay {
  state: PublicHealthState;
  /** "NSW" */
  code: string;
  /** "New South Wales" */
  name: string;
  /** "NSW Health" */
  employer: string;
  instruments: PublicPayInstrument[];
  scales: PublicPayScale[];
}

/** A state and profession we looked at but could not verify, and why. */
export interface NotVerified {
  state: string;
  profession: AlliedProfession | "all";
  reason: string;
}

// =============================================================================
// Emergency-service pay (paramedics, police, firefighters) by state and
// territory — shared types. F5 workstream (24 Sep 2026).
//
// These occupations are paid under state enterprise agreements, state awards or
// determinations — NOT a federal modern award — so there is no award "floor" to
// quote. Every salary in this directory was read off the instrument or the
// employer's official published pay table named in the jurisdiction's `sources`,
// on the date in `verifiedOn`. NOTHING is estimated, averaged, interpolated or
// carried forward. A jurisdiction whose table could not be read from a primary
// source has `scales: []` and the page renders a "not yet verified — see the
// official source" card instead of numbers.
// =============================================================================

export const SERVICE_STATE_SLUGS = ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"] as const;
export type ServiceStateSlug = (typeof SERVICE_STATE_SLUGS)[number];

export const SERVICE_OCCUPATIONS = ["paramedic", "police", "firefighter"] as const;
export type ServiceOccupation = (typeof SERVICE_OCCUPATIONS)[number];

/** One row of a published pay table. */
export interface ServicePayStep {
  /** Classification exactly as the instrument writes it, e.g. "Paramedic Year 3", "Constable 1st Year". */
  label: string;
  /**
   * Annual full-time base salary in whole dollars. Where the instrument
   * publishes only a weekly or fortnightly rate, `salary` is that rate × 52.143
   * (weekly) or × 26.0714 (fortnightly), rounded to the dollar, and `note`
   * quotes the published rate so the conversion is visible.
   */
  salary: number;
  note?: string;
}

export interface ServicePayScale {
  /** Anchor-safe id, unique within the jurisdiction. */
  id: string;
  title: string;
  /** One sentence saying who the table covers. */
  intro: string;
  /** Column header for the first column, e.g. "Classification", "Rank and increment". */
  stepHeading: string;
  steps: ServicePayStep[];
  /** When this table's rates took effect, if it differs from the jurisdiction's headline date. */
  effectiveFrom?: string;
}

export interface ServicePaySource {
  title: string;
  publisher: string;
  url: string;
}

export interface ServicePayFaq {
  q: string;
  a: string;
}

export interface ServicePayJurisdiction {
  occupation: ServiceOccupation;
  slug: ServiceStateSlug;
  /** "NSW", "VIC", … */
  code: string;
  /** "New South Wales", "Australian Capital Territory". */
  name: string;
  /** As it reads mid-sentence: "New South Wales", "the ACT". */
  nameInSentence: string;
  /** The employing agency, e.g. "NSW Ambulance", "Victoria Police", "Fire and Rescue NSW". */
  employer: string;
  /** Exact title of the instrument the salaries come from (or the employer page, if that is the only public table). */
  agreementName: string;
  /** Where the reader can read that instrument or official table. */
  agreementUrl: string;
  /** Plain-English date the published rates took effect, e.g. "1 July 2025". Empty string when unverified. */
  ratesEffectiveFrom: string;
  /** The next scheduled rise already written into the instrument, if any. */
  nextIncrease: { date: string; detail: string } | null;
  /** Date the figures were read from the source, e.g. "24 September 2026". */
  verifiedOn: string;
  /** Pay tables in render order. EMPTY when nothing could be verified. */
  scales: ServicePayScale[];
  /** Label (in scales[0]) of the entry-level qualified row: graduate/intern paramedic, probationary constable, recruit firefighter. Defaults to the first row. */
  entryStep?: string;
  /** Label (in scales[0]) of the top of the operational scale the hub compares. Defaults to the last row. */
  topStep?: string;
  /**
   * One short line shown under this state on the hub comparison table when its
   * figures are not like-for-like base salary (e.g. a built-in shift loading).
   */
  hubNote?: string;
  /** Recruit / trainee / academy pay, as sentences quoted or closely paraphrased from the source. */
  traineePay: string[];
  /** Shift penalties, allowances and loadings — short summary lines, each supported by a source. */
  penalties: string[];
  /** Caveats: expired agreement, pending deal, back-pay, etc. */
  notices: string[];
  /** What is NOT published here and why. Rendered on the page. */
  unverified: string[];
  sources: ServicePaySource[];
  faqs: ServicePayFaq[];
}

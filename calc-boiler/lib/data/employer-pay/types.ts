// =============================================================================
// Employer pay rates (Coles, Woolworths, Bunnings, McDonald's …) — shared types.
//
// Every rate in this directory was read off the enterprise agreement or modern
// award named in the employer's `instrument` and `sources`, on the date in
// `verifiedOn`. NOTHING here is estimated, averaged, or carried over from last
// year. Where a figure could not be read from a primary source it is not
// published: it goes in `unverified`, and the page says what is missing.
//
// Where an enterprise agreement's own rate has fallen below the modern award
// rate for the same work, the employer must pay at least the award base rate
// (Fair Work Act s 206). Each data file records which figure it publishes and
// why, and the page carries that as a notice.
//
// This site is not affiliated with any employer listed here. No logos, no
// trade dress: the employer name is used only to say whose pay it is.
// =============================================================================

export const EMPLOYER_SLUGS = [
  "coles",
  "woolworths",
  "bunnings",
  "mcdonalds",
  "chemist-warehouse",
  "kmart",
  // --- T4 (23 Sep 2026) ---
  "subway",
  // --- H1 (24 Sep 2026) ---
  "hungry-jacks",
  "liquorland",
  // --- end H1 ---
] as const;

export type EmployerSlug = (typeof EMPLOYER_SLUGS)[number];

export type InstrumentKind = "enterprise-agreement" | "modern-award";

/** The industrial instrument the published rates come from. */
export interface PayInstrument {
  kind: InstrumentKind;
  /** Exact title, e.g. "Coles Supermarkets Enterprise Agreement 2024". */
  title: string;
  /**
   * The Fair Work Commission reference: an agreement matter number and/or AE
   * number for an EA ("AG2024/1234, AE523456"), or the award code ("MA000003").
   */
  reference: string;
  /** Where the reader can read the instrument itself. */
  url: string;
  /** Plain-English approval date for an EA; omitted for awards. */
  approvedOn?: string;
  /** Plain-English nominal expiry date for an EA; omitted for awards. */
  nominalExpiry?: string;
  /** One or two sentences: who the instrument covers and who it does not. */
  coverage: string;
}

/** One adult classification rate. */
export interface RateRow {
  /** Classification label exactly as the instrument writes it. */
  level: string;
  /** Short plain-English gloss of who sits at this level. */
  description: string;
  /** Adult full-time/part-time hourly base rate, dollars. */
  hourly: number;
  /** Adult casual hourly rate including the casual loading, dollars. */
  casualHourly: number;
  /** Full-time weekly rate where the instrument publishes one. */
  weekly?: number;
}

/** A junior percentage band, as the instrument states it. */
export interface JuniorBand {
  /** Age label as the instrument writes it, e.g. "Under 16", "16", "20". */
  age: string;
  /** Percentage of the adult rate, as a fraction (0.5 = 50%). */
  percentage: number;
}

/** A junior dollar figure the instrument or pay guide itself publishes. */
export interface PublishedJuniorRate {
  age: string;
  hourly: number;
  casualHourly: number;
}

/** A penalty or overtime line, in the instrument's own terms. */
export interface PenaltyRow {
  /** When it applies, e.g. "Monday to Friday after 6pm", "Sunday". */
  when: string;
  /** Full-time / part-time rate as the instrument expresses it: "125%", "+$2.95/hr". */
  permanent: string;
  /** Casual rate as the instrument expresses it (inclusive of casual loading where stated). */
  casual: string;
  note?: string;
}

export interface EmployerPaySource {
  title: string;
  publisher: string;
  url: string;
}

export interface EmployerPayFaq {
  q: string;
  a: string;
}

export interface EmployerPay {
  slug: EmployerSlug;
  /** Name as used in titles: "Coles", "McDonald's", "Big W". */
  name: string;
  /** Legal employer or franchise note, e.g. "Coles Supermarkets Australia Pty Ltd". */
  employerEntity: string;
  /** "supermarket", "fast food", "hardware retail", "pharmacy retail", "department store". */
  industry: string;
  instrument: PayInstrument;
  /**
   * Plain-English date the published rate column took effect,
   * e.g. "the first full pay period on or after 1 July 2026".
   */
  ratesEffectiveFrom: string;
  /** Next scheduled rise, where the instrument already publishes one. */
  nextIncrease: { date: string; detail: string } | null;
  /** Date every figure on the page was read from its source. */
  verifiedOn: string;
  /** Casual loading as a fraction (0.25 = 25%). */
  casualLoading: number;
  /** Adult rates, lowest classification first. rates[0] is the entry level. */
  rates: RateRow[];
  /** Junior scale as the instrument states it. Empty when juniors get adult rates. */
  juniorScale: JuniorBand[];
  /** Which classifications the junior scale applies to, and any exceptions. */
  juniorNote: string;
  /**
   * Junior dollars published by the instrument or the FWO pay guide. When
   * present they are shown instead of our derivation; when absent the page
   * derives them from rates[0] and says so.
   */
  publishedJuniorRates?: PublishedJuniorRate[];
  penalties: PenaltyRow[];
  /** Notes that qualify the penalty table (how casual loading combines, etc.). */
  penaltyNotes: string[];
  overtime: PenaltyRow[];
  /** Caveats the reader needs: expired agreements, award floor, pending votes. */
  notices: string[];
  /** Classifications or details deliberately NOT published, and why. */
  unverified: string[];
  /** On-site award page for the underlying award, where one exists. */
  awardHref?: string;
  /** On-site label for that award page. */
  awardLabel?: string;
  sources: EmployerPaySource[];
  faqs: EmployerPayFaq[];
  // --- H1 (24 Sep 2026): instruments whose casual rate is not base x (1 + loading) ---
  /**
   * Set ONLY when the instrument's casual rate is not the permanent base rate
   * plus `casualLoading` (e.g. Hungry Jack's Schedule B pays casuals the award
   * rate x 125.25% while permanent staff get the award rate x 100.75%). The
   * note is shown under the adult rate table, the generic loading test is
   * skipped, and the employer's own test re-derives every casual figure.
   */
  casualRateNote?: string;
  /**
   * When true, derived junior casual rates are the junior percentage applied
   * to the adult casual rate for rates[0], not the junior base plus the loading.
   */
  juniorCasualFromAdultCasual?: boolean;
  // --- end H1 ---
}

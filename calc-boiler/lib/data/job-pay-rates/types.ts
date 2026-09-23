// =============================================================================
// Occupation pay rates (/job-pay-rates/{occupation}/) — shared types.
//
// Every award figure in this directory was read from the Fair Work Commission's
// consolidated modern award text on awards.fairwork.gov.au, which states the
// date it is consolidated to ("incorporates all amendments up to and including
// 1 July 2026"). Weekly and hourly minimums come from the award's minimum-rates
// clause; casual hourly rates come from the award's own summary schedule, not
// from our arithmetic, wherever the award publishes one. Tests assert that the
// published casual rate is the hourly rate plus 25% to the cent.
//
// The "what people actually earn" figure is the Jobs and Skills Australia
// occupation profile median (ABS Survey of Employee Earnings and Hours, May
// 2025, customised report). It is a market median, never a minimum, and the
// page labels it that way. Where no credible median exists we publish none.
//
// NOTHING here is estimated. A rate we could not read from a primary source is
// listed in `notShown` rather than filled in.
// =============================================================================

export const OCCUPATION_SLUGS = [
  "pharmacist",
  "dental-assistant",
  "electrician",
  "accountant",
  "disability-support-worker",
  "real-estate-agent",
  "property-manager",
  "truck-driver",
  "bus-driver",
  "medical-receptionist",
  "security-guard",
  // W4 (wave 2) — batch 2 occupations.
  "occupational-therapist",
  "physiotherapist",
  "psychologist",
  "social-worker",
  "nurse",
  "carpenter",
  "plumber",
  "apprentice-electrician",
  "crane-operator",
  "engineer",
  "lawyer",
  "doctor",
  "teacher-aide",
  "early-childhood-teacher",
  // T5 (wave 3) — batch 3 occupations.
  "midwife",
  "childcare-worker",
  "aged-care-worker",
  "cleaner",
  "chef",
  "bartender",
  "barista",
  "retail-worker",
  "mechanic",
  "hairdresser",
  "lab-technician",
  "pharmacy-assistant",
  "receptionist",
  "bookkeeper",
  "pathology-collector",
  "dental-hygienist",
] as const;

export type OccupationSlug = (typeof OCCUPATION_SLUGS)[number];

/** The modern award an occupation's minimum rates come from. */
export interface AwardRef {
  /** Full award title, e.g. "Pharmacy Industry Award 2020". */
  name: string;
  /** FWC award code, e.g. "MA000012". */
  code: string;
  /** Consolidated award text on awards.fairwork.gov.au. */
  url: string;
  /** "incorporates all amendments up to and including …" date, as the FWC prints it. */
  consolidatedTo: string;
  /** Where on this site the whole award is covered, when a page exists (or will after merge). */
  awardPageHref?: string;
}

/** One classification row. Dollars exactly as the award publishes them. */
export interface RateRow {
  /** Classification exactly as the award names it. */
  label: string;
  /** Full-time minimum weekly rate (38 hours). */
  weekly: number;
  /** Minimum hourly rate. */
  hourly: number;
  /**
   * Casual ordinary hourly rate (hourly + 25% casual loading). Null when the
   * award provides no casual rate for the classification (e.g. apprentices
   * under the Electrical award, whose Schedule B has no casual table).
   */
  casualHourly: number | null;
  /**
   * The award's own full-time annual salary, for awards that set rates as an
   * annual wage (Professional Employees, Medical Practitioners, Teachers).
   * When absent, the annual figure is weekly x 52.
   */
  annual?: number;
  /** Short gloss the award itself supports, e.g. an indicative role. */
  note?: string;
}

export interface RateTable {
  /** Anchor-safe id, unique within the occupation. */
  id: string;
  title: string;
  /** One or two sentences: who the table covers and where the figures come from. */
  intro: string;
  rows: RateRow[];
  /**
   * Set when the table lawfully sits below the National Minimum Wage — only
   * apprentice and trainee rates, which the NMW order does not bind. States why.
   */
  belowMinimumWage?: string;
}

/** One penalty-rate line, as a percentage of the minimum hourly rate. */
export interface PenaltyRow {
  when: string;
  /** Full-time and part-time rate, e.g. "150%". */
  permanent: string;
  /** Casual rate inclusive of the casual loading, e.g. "175%". */
  casual: string;
}

export interface Allowance {
  name: string;
  /** As the award states it, e.g. "$41.41 per week". */
  amount: string;
  note: string;
}

/** Jobs and Skills Australia occupation-profile median. A market figure, not a minimum. */
export interface MedianEarnings {
  anzscoCode: string;
  anzscoTitle: string;
  /** Median full-time weekly earnings before tax, whole dollars. */
  medianWeekly: number;
  /** Median hourly earnings, whole dollars. */
  medianHourly: number;
  /** The same measure for all occupations, for comparison. */
  allOccupationsWeekly: number;
  url: string;
}

export interface OccupationSource {
  title: string;
  publisher: string;
  url: string;
}

export interface OccupationFaq {
  q: string;
  a: string;
}

export interface Occupation {
  slug: OccupationSlug;
  /** Singular job title in title case, e.g. "Electrician". */
  name: string;
  /** Plural, lower case, for mid-sentence use, e.g. "electricians". */
  plural: string;
  /** The award that sets the minimum, or null when the job is award-free. */
  award: AwardRef | null;
  /**
   * The row the hero, title and after-tax figures are built from: the
   * classification a qualified adult in this job most commonly starts on.
   * Null when the job is award-free and there is no classification.
   */
  headline: { tableId: string; label: string; why: string } | null;
  /** "Which award and classification applies" paragraphs. */
  coverage: string[];
  tables: RateTable[];
  penalties: PenaltyRow[];
  /** One line on how the penalty table should be read (ordinary hours, substitution rules). */
  penaltiesNote: string;
  /** Overtime rules, one bullet each. */
  overtime: string[];
  allowances: Allowance[];
  median: MedianEarnings | null;
  /** Caveats the reader needs before relying on the numbers. */
  notices: string[];
  /** What this page deliberately does not publish, and why. */
  notShown: string[];
  faqs: OccupationFaq[];
  sources: OccupationSource[];
  /** Date every figure was read from its source. */
  verifiedOn: string;
  /** Related pages on this site. */
  related: { href: string; label: string }[];
  /**
   * Optional <title> override, for pages where the headline award rate is not
   * the job title's own minimum (e.g. lawyer: the award covers law graduates,
   * admitted lawyers are award-free).
   */
  metaTitle?: string;
}

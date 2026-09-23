// =============================================================================
// Aviation pay — air traffic controllers (Airservices Australia enterprise
// agreement) and pilots (Air Pilots Award 2020 [MA000046]). F5 workstream,
// 24 Sep 2026.
//
// Same sourcing rule as lib/data/service-pay: every figure was read from the
// instrument named in `sources` on `verifiedOn`. Nothing is estimated. Airline
// enterprise agreements (Qantas, Virgin, Jetstar, Rex …) are described only
// where their pay tables are publicly readable; otherwise they are listed in
// `unverified` with a pointer to the Fair Work Commission agreement search.
// =============================================================================

import type { ServicePayFaq, ServicePayScale, ServicePaySource } from "../service-pay/types";

export type AviationPageSlug = "air-traffic-controller" | "pilot";

/** A named instrument (EA or award) with its status in plain words. */
export interface AviationInstrument {
  name: string;
  url: string;
  /** e.g. "Approved by the FWC on 18 November 2024; nominal expiry 30 June 2027." */
  status: string;
}

export interface AviationPayPage {
  slug: AviationPageSlug;
  /** The instrument the main tables come from. */
  instrument: AviationInstrument;
  /** Plain-English date the main tables took effect. */
  ratesEffectiveFrom: string;
  /** Scheduled increases already written into the instrument. */
  scheduledIncreases: { date: string; detail: string }[];
  verifiedOn: string;
  /** Main pay tables, in render order. */
  scales: ServicePayScale[];
  /** Label (in scales[0]) of the entry row, e.g. "ATC Trainee", "First officer year 1". */
  entryStep?: string;
  /** Label (in scales[0]) of the top row the hero quotes. */
  topStep?: string;
  /** Trainee / cadet pay, sentences quoted or closely paraphrased from the source. */
  traineePay: string[];
  /** Allowances, shift/roster loadings, casual or per-hour rules. */
  allowances: string[];
  /** Other instruments (e.g. airline EAs) — only publicly verifiable ones carry figures. */
  otherInstruments: { name: string; url: string; summary: string }[];
  notices: string[];
  unverified: string[];
  sources: ServicePaySource[];
  faqs: ServicePayFaq[];
}

// =============================================================================
// ATO Australian zone list — aggregated registry.
//
// Add a state by transcribing its ATO page into lib/data/zones/<state>.ts as a
// pipe-delimited block, then registering it below. parseZoneBlock() throws on
// any malformed row, so a bad transcription fails the build rather than
// misclassifying a taxpayer.
// =============================================================================

import { parseZoneBlock, type StateCode, type ZoneEntry } from "./types";
import { NSW_RAW } from "./nsw";
import { NT_RAW } from "./nt";
import { SA_RAW } from "./sa";
import { TAS_RAW } from "./tas";

const RAW_BY_STATE: Partial<Record<StateCode, string>> = {
  NSW: NSW_RAW,
  NT: NT_RAW,
  SA: SA_RAW,
  TAS: TAS_RAW,
};

/** Every transcribed location, across every registered state. */
export const ZONE_LOCATIONS: ZoneEntry[] = Object.entries(RAW_BY_STATE)
  .flatMap(([state, raw]) => parseZoneBlock(state as StateCode, raw as string))
  .sort((a, b) => a.name.localeCompare(b.name) || a.state.localeCompare(b.state));

/** States transcribed so far. Used by the UI to say what is and isn't covered. */
export const COVERED_STATES: StateCode[] = Object.keys(RAW_BY_STATE) as StateCode[];

/** Normalise a search term: casefold, strip punctuation and collapse whitespace. */
export function normaliseLocation(value: string): string {
  return value
    .toLowerCase()
    .replace(/[.'’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Look up locations by name. Exact (normalised) matches first, then
 * starts-with, then contains. Returns at most `limit` results.
 */
export function findZoneLocations(query: string, limit = 8): ZoneEntry[] {
  const q = normaliseLocation(query);
  if (q.length < 2) return [];

  const exact: ZoneEntry[] = [];
  const prefix: ZoneEntry[] = [];
  const contains: ZoneEntry[] = [];

  for (const entry of ZONE_LOCATIONS) {
    const name = normaliseLocation(entry.name);
    if (name === q) exact.push(entry);
    else if (name.startsWith(q)) prefix.push(entry);
    else if (name.includes(q)) contains.push(entry);
  }

  return [...exact, ...prefix, ...contains].slice(0, limit);
}

export * from "./types";

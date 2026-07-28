// =============================================================================
// ATO Australian zone list — shared types and parser.
//
// Source: https://www.ato.gov.au/calculators-and-tools/tax-offsets-australian-zones
// Every state list was last updated by the ATO on 1 July 2026.
//
// Each state is stored as a pipe-delimited block rather than object literals.
// Roughly 5,000 rows of YMYL data have to be transcribed by hand (ato.gov.au
// returns HTTP 403 to non-proxied clients, so this cannot be scripted), and the
// flat format removes almost all the punctuation that transcription can get
// wrong. The parser below is strict: an unknown zone code or a malformed line
// throws at build time rather than silently misclassifying someone's offset.
//
// The ATO states its own list is NOT exhaustive — some locations qualify as
// special areas without appearing. The UI must say so where a lookup misses.
// =============================================================================

/** A = Zone A, B = Zone B, AS/BS = special area within that zone, N = not in a zone. */
export type ZoneCode = "A" | "B" | "AS" | "BS" | "N";

export const ZONE_CODES: readonly ZoneCode[] = ["A", "B", "AS", "BS", "N"] as const;

export type StateCode = "NSW" | "NT" | "QLD" | "SA" | "TAS" | "WA" | "EXT";

export interface ZoneEntry {
  name: string;
  state: StateCode;
  zone: ZoneCode;
}

/** How each code maps back to the ATO's own wording. */
export const ZONE_CODE_LABELS: Readonly<Record<ZoneCode, string>> = {
  A: "Zone A",
  B: "Zone B",
  AS: "Zone A (special area)",
  BS: "Zone B (special area)",
  N: "Not in a zone",
} as const;

/** Which offset area a zone code claims under. `null` means no entitlement. */
export const ZONE_CODE_TO_AREA = {
  A: "zoneA",
  B: "zoneB",
  AS: "specialArea",
  BS: "specialArea",
  N: null,
} as const;

export const STATE_NAMES: Readonly<Record<StateCode, string>> = {
  NSW: "New South Wales",
  NT: "Northern Territory",
  QLD: "Queensland",
  SA: "South Australia",
  TAS: "Tasmania",
  WA: "Western Australia",
  EXT: "External territories and islands",
} as const;

/** ATO list pages, per state, for "check the source" links. */
export const STATE_SOURCE_URLS: Readonly<Record<StateCode, string>> = {
  NSW: "https://www.ato.gov.au/calculators-and-tools/tax-offsets-australian-zones/new-south-wales",
  NT: "https://www.ato.gov.au/calculators-and-tools/tax-offsets-australian-zones/northern-territory",
  QLD: "https://www.ato.gov.au/calculators-and-tools/tax-offsets-australian-zones/queensland",
  SA: "https://www.ato.gov.au/calculators-and-tools/tax-offsets-australian-zones/south-australia",
  TAS: "https://www.ato.gov.au/calculators-and-tools/tax-offsets-australian-zones/tasmania",
  WA: "https://www.ato.gov.au/calculators-and-tools/tax-offsets-australian-zones/western-australia",
  EXT: "https://www.ato.gov.au/calculators-and-tools/tax-offsets-australian-zones/special-area",
} as const;

/** The date the ATO last updated the zone list. Surfaced in the UI. */
export const ZONE_LIST_LAST_UPDATED = "1 July 2026";

function isZoneCode(v: string): v is ZoneCode {
  return (ZONE_CODES as readonly string[]).includes(v);
}

/**
 * Parse a pipe-delimited state block into entries. Throws on any malformed row
 * or unknown zone code — a silent miscategorisation here would understate or
 * overstate a real tax offset.
 */
export function parseZoneBlock(state: StateCode, raw: string): ZoneEntry[] {
  const entries: ZoneEntry[] = [];
  const lines = raw.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;

    const sep = line.lastIndexOf("|");
    if (sep === -1) {
      throw new Error(`${state} line ${i + 1}: missing "|" separator in ${JSON.stringify(line)}`);
    }

    const name = line.slice(0, sep).trim();
    const zone = line.slice(sep + 1).trim();

    if (name === "") {
      throw new Error(`${state} line ${i + 1}: empty location name`);
    }
    if (!isZoneCode(zone)) {
      throw new Error(
        `${state} line ${i + 1}: unknown zone code ${JSON.stringify(zone)} for ${JSON.stringify(name)}`,
      );
    }

    entries.push({ name, state, zone });
  }

  return entries;
}

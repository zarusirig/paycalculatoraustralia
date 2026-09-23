// State pages that are actually built for each emergency-service occupation.
// Kept as plain literals so client components (modules/state/state-sections)
// can link to them without bundling the pay tables. The service-pay test
// asserts these equal verifiedJurisdictions(), so the two cannot drift.

import type { ServiceOccupation, ServiceStateSlug } from "./types";

export const SERVICE_PAY_BUILT: Readonly<Record<ServiceOccupation, readonly ServiceStateSlug[]>> = {
  paramedic: ["nsw", "vic", "qld", "wa", "sa", "tas", "act", "nt"],
  police: ["nsw", "vic", "qld", "wa", "tas", "act", "nt"],
  firefighter: ["nsw", "vic", "qld", "sa", "tas", "act", "nt"],
};

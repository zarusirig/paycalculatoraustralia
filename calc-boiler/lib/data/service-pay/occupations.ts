// Per-occupation copy and routing for the emergency-service pay cluster (F5).
// Kept apart from the state data so the route, hub and sitemap share one
// definition of each occupation's URL and vocabulary.

import type { ServiceOccupation } from "./types";

export interface ServiceOccupationConfig {
  occupation: ServiceOccupation;
  /** Hub path, trailing-slashed: "/paramedic-pay/". */
  hubPath: string;
  /** Route segment: "paramedic-pay". */
  segment: string;
  /** "Paramedic", "Police officer", "Firefighter". */
  singular: string;
  /** "paramedics", "police officers", "firefighters". */
  plural: string;
  /** Search-shaped noun for titles: "Paramedic Salary", "Police Salary", "Firefighter Salary". */
  salaryNoun: string;
  /** Hub breadcrumb / H1 label. */
  hubLabel: string;
  /** Column heading for the entry row on the hub comparison table. */
  entryLabel: string;
  /** Column heading for the top-of-scale row on the hub comparison table. */
  topLabel: string;
  /** The kind of employer, mid-sentence: "state ambulance service". */
  employerKind: string;
  /** Author registry key in lib/authors.ts. */
  authorKey: string;
}

export const SERVICE_OCCUPATION_CONFIG: Readonly<Record<ServiceOccupation, ServiceOccupationConfig>> = {
  paramedic: {
    occupation: "paramedic",
    hubPath: "/paramedic-pay/",
    segment: "paramedic-pay",
    singular: "Paramedic",
    plural: "paramedics",
    salaryNoun: "Paramedic Salary",
    hubLabel: "Paramedic Pay Australia",
    entryLabel: "Graduate / intern",
    topLabel: "Top of paramedic scale",
    employerKind: "ambulance service",
    authorKey: "paramedic-pay",
  },
  police: {
    occupation: "police",
    hubPath: "/police-pay/",
    segment: "police-pay",
    singular: "Police officer",
    plural: "police officers",
    salaryNoun: "Police Salary",
    hubLabel: "Police Pay Australia",
    entryLabel: "Entry constable",
    topLabel: "Top of constable scale",
    employerKind: "police force",
    authorKey: "police-pay",
  },
  firefighter: {
    occupation: "firefighter",
    hubPath: "/firefighter-pay/",
    segment: "firefighter-pay",
    singular: "Firefighter",
    plural: "firefighters",
    salaryNoun: "Firefighter Salary",
    hubLabel: "Firefighter Pay Australia",
    entryLabel: "Recruit",
    topLabel: "Top firefighter rank",
    employerKind: "fire and rescue service",
    authorKey: "firefighter-pay",
  },
};

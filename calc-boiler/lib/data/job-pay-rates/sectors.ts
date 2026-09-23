// Hub grouping for /job-pay-rates/ (T5, wave 3). A presentation grouping only:
// it says nothing about award coverage. Typed as a full Record so adding an
// occupation slug without a sector fails the type check.

import type { OccupationSlug } from "./types";

export const JOB_SECTORS = [
  { id: "health", title: "Health and care" },
  { id: "hospitality-retail", title: "Hospitality, retail and personal services" },
  { id: "trades", title: "Trades, transport and technical" },
  { id: "office", title: "Office, property and professional" },
  { id: "education", title: "Education and childcare" },
] as const;

export type JobSectorId = (typeof JOB_SECTORS)[number]["id"];

export const OCCUPATION_SECTOR: Readonly<Record<OccupationSlug, JobSectorId>> = {
  pharmacist: "health",
  "dental-assistant": "health",
  electrician: "trades",
  accountant: "office",
  "disability-support-worker": "health",
  "real-estate-agent": "office",
  "property-manager": "office",
  "truck-driver": "trades",
  "bus-driver": "trades",
  "medical-receptionist": "health",
  "security-guard": "hospitality-retail",
  "occupational-therapist": "health",
  physiotherapist: "health",
  psychologist: "health",
  "social-worker": "health",
  nurse: "health",
  carpenter: "trades",
  plumber: "trades",
  "apprentice-electrician": "trades",
  "crane-operator": "trades",
  engineer: "office",
  lawyer: "office",
  doctor: "health",
  "teacher-aide": "education",
  "early-childhood-teacher": "education",
  midwife: "health",
  "childcare-worker": "education",
  "aged-care-worker": "health",
  cleaner: "hospitality-retail",
  chef: "hospitality-retail",
  bartender: "hospitality-retail",
  barista: "hospitality-retail",
  "retail-worker": "hospitality-retail",
  mechanic: "trades",
  hairdresser: "hospitality-retail",
  "lab-technician": "trades",
  "pharmacy-assistant": "health",
  receptionist: "office",
  bookkeeper: "office",
  "pathology-collector": "health",
  "dental-hygienist": "health",
  // G3 (wave 4)
  radiographer: "health",
  sonographer: "health",
  "speech-pathologist": "health",
  audiologist: "health",
  podiatrist: "health",
  dietitian: "health",
};

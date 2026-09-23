// ADF pay scales — shared types. See salaries.ts / pay-grades.ts headers for sourcing.

export const ADF_SERVICE_SLUGS = ["army", "navy", "air-force"] as const;
export type AdfServiceSlug = (typeof ADF_SERVICE_SLUGS)[number];

/** Key used in the rank-name and pay-grade maps. */
export type AdfServiceKey = "navy" | "army" | "airForce";

/** One PACMAN salary table: a rank (named per service), rows = increments, columns = pay grades 1–10. */
export interface RankSalaryTable {
  id: string;
  group: "other-ranks" | "officers";
  /** The heading exactly as PACMAN prints it. */
  pacmanHeading: string;
  /** Null where the rank does not exist in that service (e.g. Army-only Staff Sergeant). */
  names: Record<AdfServiceKey, string | null>;
  /** Highest increment first, as PACMAN orders them. salaries[i] is pay grade i + 1; null = no rate. */
  rows: { increment: string; salaries: (number | null)[] }[];
}

export interface PayGradeEntry {
  category: string;
  /** The grade within the employment category, where PACMAN gives one. */
  grade: string | null;
}

/** service -> pay grade (1–10) -> employment categories at that pay grade. */
export type PayGradeListing = Record<AdfServiceKey, Record<number, PayGradeEntry[]>>;

export interface AdfService {
  slug: AdfServiceSlug;
  key: AdfServiceKey;
  /** "Army", "Navy", "Air Force". */
  name: string;
  /** "Australian Army", "Royal Australian Navy", "Royal Australian Air Force". */
  fullName: string;
}

// =============================================================================
// Public-sector pay points near a salary — for /tax-on/[salary]/ (10 Oct 2026).
//
// Reads the verified state teacher scales (lib/data/teacher-pay, rendered on
// /teacher-pay-australia/<state>/) and nursing scales (lib/data/nursing-pay,
// rendered on /healthcare-worker-pay/<state>/). Nothing is typed in here: the
// annual figure is the scale's own (teachers), or annualFor() — published
// annual, else fortnightly × 26, else weekly × 52 — exactly as the nursing
// pages compute it. Each source file carries its own agreement and URL.
// =============================================================================

import { TEACHER_PAY_STATES } from "../teacher-pay/index";
import { NURSING_PAY_BY_STATE, NURSING_PAY_STATES, annualFor } from "../nursing-pay/index";

export interface PublicPayPoint {
  id: string;
  sector: "teacher" | "nurse";
  /** State or territory code, e.g. "QLD". */
  state: string;
  /** Scale or classification, e.g. "Classroom teachers — Stream 1". */
  scale: string;
  /** Step or pay point, e.g. "Band 2, Step 1". */
  step: string;
  annual: number;
  /** When the rate applies from, as the source states it. */
  effectiveFrom: string;
  /** This site's page for the state scale. */
  href: string;
}

/** Every teacher step and nursing pay point with an annual figure, sorted by annual then id. */
export function publicPayPoints(): PublicPayPoint[] {
  const out: PublicPayPoint[] = [];
  for (const st of TEACHER_PAY_STATES) {
    for (const scale of st.scales) {
      for (const step of scale.steps) {
        out.push({
          id: `teacher-${st.slug}-${scale.id}-${step.label}`,
          sector: "teacher",
          state: st.code,
          scale: scale.title,
          step: step.label,
          annual: step.salary,
          effectiveFrom: scale.effectiveFrom ?? st.ratesEffectiveFrom,
          href: `/teacher-pay-australia/${st.slug}/`,
        });
      }
    }
  }
  for (const slug of NURSING_PAY_STATES) {
    const st = NURSING_PAY_BY_STATE[slug];
    if (!st) continue;
    for (const scale of st.scales) {
      const instrument = st.instruments.find((i) => i.id === scale.instrumentId);
      for (const point of scale.points) {
        const annual = annualFor(point);
        if (annual === null) continue;
        out.push({
          id: `nurse-${slug}-${scale.classification}-${scale.gradeCode ?? ""}-${point.label}`,
          sector: "nurse",
          state: st.code,
          scale: scale.classification,
          step: point.label,
          annual,
          effectiveFrom: instrument?.effectiveFrom ?? "",
          href: `/healthcare-worker-pay/${slug}/`,
        });
      }
    }
  }
  return out.sort((a, b) => a.annual - b.annual || a.id.localeCompare(b.id));
}

/**
 * Up to `max` pay points whose annual figure rounds to `salary` on a grid of
 * `step`, closest first but at most one per state scale, returned in salary
 * order. On the $5,000 tax-on grid no point can appear on two pages.
 */
export function payPointsRoundingTo(salary: number, step = 5_000, max = 6): PublicPayPoint[] {
  const hits = publicPayPoints()
    .filter((p) => Math.round(p.annual / step) * step === salary)
    .sort((a, b) => Math.abs(a.annual - salary) - Math.abs(b.annual - salary) || a.id.localeCompare(b.id));
  const seen = new Set<string>();
  const picked: PublicPayPoint[] = [];
  for (const p of hits) {
    const key = `${p.sector}|${p.state}|${p.scale}`;
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(p);
    if (picked.length === max) break;
  }
  return picked.sort((a, b) => a.annual - b.annual || a.id.localeCompare(b.id));
}

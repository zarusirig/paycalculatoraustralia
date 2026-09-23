// =============================================================================
// People Also Ask additions for the public service jurisdiction pages.
//
// jurisdictionFaqs() returns a jurisdiction's own verified FAQs plus answers to
// the PAA questions Google AU showed for its main queries in September 2026
// ("vps pay scales", "vps salary", "aps pay scales", "aps 6 salary" — see
// docs/seo/2026-09-24-paa-optimisation.md). Every figure is read from the same
// band rows the page's tables render, so an answer cannot disagree with the
// table above it. Both the accordion and the FAQPage JSON-LD read this list.
// =============================================================================

import { formatAUD } from "@/lib/constants";
import type { ClassificationBand, Jurisdiction, PayFaq } from "./types";

function bandsIn(j: Jurisdiction, scheduleId: string): readonly ClassificationBand[] {
  return j.schedules.find((s) => s.id === scheduleId)?.streams.flatMap((st) => st.bands) ?? [];
}

function band(j: Jurisdiction, scheduleId: string, code: string): ClassificationBand | undefined {
  return bandsIn(j, scheduleId).find((b) => b.code === code);
}

const range = (b: ClassificationBand) => `${formatAUD(b.min)} to ${formatAUD(b.max)}`;

function steps(b: ClassificationBand): string {
  const n = b.payPoints?.length;
  return n ? ` across ${n} steps` : "";
}

function apsFaqs(j: Jurisdiction): PayFaq[] {
  const S = "apsc-2025";
  const T = "aps-thresholds-2026";
  const surveyDate = j.schedules.find((s) => s.id === S)?.effectiveFrom ?? "";
  const thresholdDate = j.schedules.find((s) => s.id === T)?.effectiveFrom ?? "";
  const aps1 = band(j, S, "APS 1");
  const aps2 = band(j, S, "APS 2");
  const aps3 = band(j, S, "APS 3");
  const aps6 = band(j, S, "APS 6");
  const el1 = band(j, S, "EL 1");
  const t1 = band(j, T, "APS 1");
  const t3 = band(j, T, "APS 3");
  const tEl2 = band(j, T, "EL 2");
  const out: PayFaq[] = [];

  if (t1 && tEl2 && aps3 && aps6 && el1) {
    out.push({
      q: "What are the APS pay rates for 2026?",
      a: `Each agency sets its own APS pay, but from ${thresholdDate} every agency's ranges must meet service-wide minimums, from ${range(t1)} for APS 1 up to ${range(tEl2)} for EL 2. What people were actually paid at ${surveyDate}: median ${formatAUD(aps3.median ?? aps3.min)} at APS 3, ${formatAUD(aps6.median ?? aps6.min)} at APS 6 and ${formatAUD(el1.median ?? el1.min)} at EL 1.`,
    });
  }
  if (aps3 && t3) {
    out.push({
      q: "What does an APS 3 get paid?",
      a: `From ${thresholdDate}, every agency's APS 3 range must reach at least ${range(t3)}. Across the APS at ${surveyDate} the median APS 3 base salary was ${formatAUD(aps3.median ?? aps3.min)}, with 90% of APS 3 staff paid ${range(aps3)}. Superannuation is paid on top. APS 3 work is typically ${aps3.summary.charAt(0).toLowerCase()}${aps3.summary.slice(1)}`,
    });
  }
  if (aps1 && aps2 && aps3 && aps1.headcount && aps2.headcount && aps3.headcount) {
    out.push({
      q: "Is APS 3 entry level?",
      a: `Often, in practice. APS 1 is the lowest classification, but APS 1 and APS 2 together had only ${(aps1.headcount + aps2.headcount).toLocaleString("en-AU")} employees at ${surveyDate}, against ${aps3.headcount.toLocaleString("en-AU")} at APS 3, so many entry-level processing and client-contact roles start at APS 3. Graduates usually join on a separate Graduate APS classification.`,
    });
  }
  if (aps6 && el1 && aps6.headcount) {
    out.push({
      q: "Is APS 6 a high level?",
      a: `APS 6 is the highest of the six APS levels and the one below Executive Level 1. It is also the largest classification, with ${aps6.headcount.toLocaleString("en-AU")} employees at ${surveyDate}. The median APS 6 base salary was ${formatAUD(aps6.median ?? aps6.min)}, against ${formatAUD(el1.median ?? el1.min)} at EL 1. APS 6 roles often lead a small team.`,
    });
  }
  return out;
}

function vicFaqs(j: Jurisdiction): PayFaq[] {
  const S = "vps-2026";
  const from = j.schedules.find((s) => s.id === S)?.effectiveFrom ?? "";
  const g3a = band(j, S, "VPS 3.1");
  const g3b = band(j, S, "VPS 3.2");
  const g4 = band(j, S, "VPS 4.1");
  const g6a = band(j, S, "VPS 6.1");
  const g6b = band(j, S, "VPS 6.2");
  const out: PayFaq[] = [];

  if (g6a && g6b) {
    out.push({
      q: "What is a VPS 6 salary?",
      a: `From ${from} a VPS Grade 6 is paid ${formatAUD(g6a.min)} to ${formatAUD(g6b.max)}. Value range 6.1 runs from ${range(g6a)}${steps(g6a)} and value range 6.2 from ${range(g6b)}${steps(g6b)}. Superannuation is paid on top of these base salaries.`,
    });
  }
  if (g4) {
    out.push({
      q: "What is a VPS 4 salary?",
      a: `From ${from} a VPS Grade 4 is paid ${range(g4)}${steps(g4)}. ${g4.summary} Grade 4 sits between grade 3, which tops out at ${g3b ? formatAUD(g3b.max) : "the end of value range 3.2"}, and grade 5.`,
    });
  }
  if (g3a && g3b) {
    out.push({
      q: "What does VPS grade 3 mean?",
      a: `VPS Grade 3 is the third of the seven Victorian Public Service grades in Schedule C of the VPS Enterprise Agreement 2024. It has two value ranges: 3.1, ${range(g3a)}${steps(g3a)}, and 3.2, ${range(g3b)}${steps(g3b)}, from ${from}. Staff can move up one step a year through the annual performance cycle.`,
    });
  }
  return out;
}

/** The FAQ list a jurisdiction page renders and marks up. */
export function jurisdictionFaqs(j: Jurisdiction): PayFaq[] {
  const extra = j.slug === "aps" ? apsFaqs(j) : j.slug === "vic" ? vicFaqs(j) : [];
  const existing = new Set(j.faqs.map((f) => f.q.toLowerCase()));
  return [...j.faqs, ...extra.filter((f) => !existing.has(f.q.toLowerCase()))];
}

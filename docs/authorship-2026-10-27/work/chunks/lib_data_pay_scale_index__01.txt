// =============================================================================
// Published pay scale index: every full-time annual salary point on the
// public sector, defence, teaching, nursing, emergency services and staff
// specialist scales this site already publishes, in one flat list (10 Oct 2026).
//
// Built only from the verified data modules. Nothing is re-keyed here:
//   - lib/data/public-service-pay   APS, VPS, Queensland, NSW, WA, SA, TAS, ACT
//                                   and NT schedules (agreements, state awards
//                                   and determinations; the APSC survey is left
//                                   out because it reports actual salaries, not
//                                   a rate, and the Queensland Health nursing
//                                   schedule because the nursing data covers it);
//   - lib/data/adf-pay              PACMAN salaries, Permanent Forces;
//   - lib/data/teacher-pay          state school teacher scales;
//   - lib/data/nursing-pay          state public health nurse and midwife scales;
//   - lib/data/service-pay          police, paramedic, firefighter and prison
//                                   officer scales (verified jurisdictions only);
//   - lib/data/aviation-pay         Air Pilots Award minimum salaries and the air
//                                   traffic controller agreement scale;
//   - lib/data/health-salary        NSW, VIC and QLD staff specialist scales.
// Where an instrument gives only a band (no pay points), the bottom and top of
// the band are both entries.
//
// Consumers: /hourly-to-salary/[rate]/ and /salary-to-hourly/[amount]/
// ("published pay scales near $X a year"). Annual salaries only: full-time
// hours differ between these employers, so copy compares the annual figure and
// never turns a point into an hourly rate.
// Relative imports only, so `npm test` compiles it.
// =============================================================================

import { JURISDICTIONS } from "./public-service-pay";
import {
  ADF_PAY_EFFECTIVE,
  OFFICER_SALARIES,
  OTHER_RANK_SALARIES,
  SERVICE_WARRANT_OFFICER_SALARY,
  TRAINEE_SALARIES,
  WO1_SALARIES,
} from "./adf-pay";
import type { RankSalaryTable } from "./adf-pay/types";
import { TEACHER_PAY_STATES } from "./teacher-pay";
import { NURSING_PAY_BY_STATE, annualFor, instrumentFor } from "./nursing-pay";
import { STAFF_SPECIALIST_SCALES } from "./health-salary";
import { isVerified, serviceJurisdictions } from "./service-pay";
import { SERVICE_OCCUPATIONS, type ServiceOccupation } from "./service-pay/types";
import { AVIATION_PATHS, AVIATION_PAY, type AviationPageSlug } from "./aviation-pay";

export type PayScaleKind = "public-service" | "defence" | "teaching" | "nursing" | "service" | "aviation" | "medical";

export interface PayScalePoint {
  kind: PayScaleKind;
  /** The employer or service, for grouping and prose: "Queensland public service", "Australian Defence Force". */
  group: string;
  /** The point as its instrument labels it, with the classification. */
  label: string;
  /** Full-time annual salary, dollars. */
  annual: number;
  /** When the rate applies from, as the source states it. */
  effectiveFrom: string;
  /** Our page for the scale, or null when there is none (staff specialists link the instrument). */
  href: string | null;
  /** The instrument itself, where the data module records a URL for it. */
  sourceUrl: string | null;
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------

/**
 * "Administrative and Clerical Officer, Grade 2" + "Grade 2, thereafter" ->
 * "Administrative and Clerical Officer, Grade 2, thereafter": where the point's
 * label opens with the end of the band name (up to a comma), say it once.
 */
export function joinLabel(band: string, point: string): string {
  if (band === point) return band;
  const comma = point.indexOf(", ");
  const head = comma === -1 ? point : point.slice(0, comma);
  const boundary = band.length === head.length || /[\s,]/.test(band[band.length - head.length - 1]);
  if (head.length >= 3 && band.endsWith(head) && boundary) {
    return comma === -1 ? band : `${band}${point.slice(comma)}`;
  }
  return `${band}, ${point}`;
}

// ---------------------------------------------------------------------------
// Public service
// ---------------------------------------------------------------------------

const publicService: PayScalePoint[] = JURISDICTIONS.flatMap((j) =>
  j.schedules
    .filter((s) => s.basis !== "survey" && !/nursing/i.test(s.id))
    .flatMap((s) => {
      const source = j.sources.find((x) => x.id === s.sourceId)?.url ?? null;
      return s.streams.flatMap((st) =>
        st.bands.flatMap((b) => {
          const base = { kind: "public-service" as const, group: j.name, effectiveFrom: s.effectiveFrom, href: `/public-service-pay-scales/${j.slug}/`, sourceUrl: source };
          if (b.payPoints && b.payPoints.length > 0) {
            return b.payPoints.map((p) => ({ ...base, label: joinLabel(b.name, p.label), annual: p.annual }));
          }
          const ends = [{ label: `${b.name}, bottom of band`, annual: b.min }];
          if (b.max !== b.min) ends.push({ label: `${b.name}, top of band`, annual: b.max });
          return ends.map((e) => ({ ...base, ...e }));
        }),
      );
    }),
);

// ---------------------------------------------------------------------------
// Australian Defence Force (PACMAN)
// ---------------------------------------------------------------------------

function rankName(t: RankSalaryTable): { name: string; service: "army" | "navy" | "air-force" } {
  const names = [t.names.army, t.names.navy, t.names.airForce].filter((n): n is string => n !== null);
  const service = t.names.army ? "army" : t.names.navy ? "navy" : "air-force";
  return { name: [...new Set(names)].join(" / "), service };
}

const ADF_GROUP = "Australian Defence Force";

const defence: PayScalePoint[] = [
  ...[...OTHER_RANK_SALARIES, ...OFFICER_SALARIES, WO1_SALARIES].flatMap((t) => {
    const { name, service } = rankName(t);
    return t.rows.flatMap((r) =>
      r.salaries.flatMap((annual, i) =>
        annual === null
          ? []
          : [
              {
                kind: "defence" as const,
                group: ADF_GROUP,
                label: `${name}, ${/^\d+$/.test(r.increment) ? `increment ${r.increment}` : r.increment}, pay grade ${i + 1}`,
                annual,
                effectiveFrom: ADF_PAY_EFFECTIVE,
                href: `/adf-pay-scales/${service}/`,
                sourceUrl: null,
              },
            ],
      ),
    );
  }),
  {
    kind: "defence",
    group: ADF_GROUP,
    label: "Service Warrant Officer",
    annual: SERVICE_WARRANT_OFFICER_SALARY,
    effectiveFrom: ADF_PAY_EFFECTIVE,
    href: "/adf-pay-scales/army/",
    sourceUrl: null,
  },
  ...TRAINEE_SALARIES.map((t) => ({
    kind: "defence" as const,
    group: ADF_GROUP,
    label: `Trainee: ${t.label}`,
    annual: t.salary,
    effectiveFrom: ADF_PAY_EFFECTIVE,
    href: "/adf-pay-scales/army/",
    sourceUrl: null,
  })),
];

// ---------------------------------------------------------------------------
// Teachers, nurses and midwives, staff specialists
// ---------------------------------------------------------------------------

const teaching: PayScalePoint[] = TEACHER_PAY_STATES.flatMap((t) =>
  t.scales.flatMap((sc) =>
    sc.steps.map((step) => ({
      kind: "teaching" as const,
      group: `${t.code} public school teachers`,
      label: sc.title === step.label ? step.label : `${sc.title}: ${step.label}`,
      annual: step.salary,
      effectiveFrom: sc.effectiveFrom ?? t.ratesEffectiveFrom,
      href: `/teacher-pay-australia/${t.slug}/`,
      sourceUrl: t.agreementUrl,
    })),
  ),
);

const nursing: PayScalePoint[] = Object.values(NURSING_PAY_BY_STATE).flatMap((st) =>
  !st
    ? []
    : st.scales.flatMap((sc) => {
        const instrument = instrumentFor(st, sc.instrumentId);
        return sc.points.flatMap((p) => {
          const annual = annualFor(p);
          return annual === null
            ? []
            : [
                {
                  kind: "nursing" as const,
                  group: `${st.shortName} public health nurses and midwives`,
                  label: joinLabel(sc.classification, p.label),
                  annual,
                  effectiveFrom: instrument?.effectiveFrom ?? "",
                  href: `/healthcare-worker-pay/${st.slug}/`,
                  sourceUrl: instrument?.source.url ?? null,
                },
              ];
        });
      }),
);

const SERVICE_GROUP: Record<ServiceOccupation, string> = {
  police: "police",
  paramedic: "paramedics",
  firefighter: "firefighters",
  "prison-officer": "prison officers",
};

const service: PayScalePoint[] = SERVICE_OCCUPATIONS.flatMap((occupation) =>
  serviceJurisdictions(occupation)
    .filter(isVerified)
    .flatMap((j) =>
      j.scales.flatMap((sc) =>
        sc.steps.map((step) => ({
          kind: "service" as const,
          group: `${j.code} ${SERVICE_GROUP[occupation]}`,
          label: sc.title === step.label ? step.label : `${sc.title}: ${step.label}`,
          annual: step.salary,
          effectiveFrom: sc.effectiveFrom ?? j.ratesEffectiveFrom,
          href: `/${occupation}-pay/${j.slug}/`,
          sourceUrl: j.agreementUrl,
        })),
      ),
    ),
);

const AVIATION_GROUP: Record<AviationPageSlug, string> = {
  pilot: "Pilots (Air Pilots Award minimums)",
  "air-traffic-controller": "Air traffic controllers",
};

const aviation: PayScalePoint[] = (Object.keys(AVIATION_PAY) as AviationPageSlug[]).flatMap((slug) => {
  const page = AVIATION_PAY[slug];
  return page.scales.flatMap((sc) =>
    sc.steps.map((step) => ({
      kind: "aviation" as const,
      group: AVIATION_GROUP[slug],
      label: sc.title === step.label ? step.label : `${sc.title}: ${step.label}`,
      annual: step.salary,
      effectiveFrom: sc.effectiveFrom ?? page.ratesEffectiveFrom,
      href: AVIATION_PATHS[slug],
      sourceUrl: page.instrument.url,
    })),
  );
});

const medical: PayScalePoint[] = STAFF_SPECIALIST_SCALES.flatMap((s) =>
  s.steps.map((step) => ({
    kind: "medical" as const,
    group: `${s.state} public hospital staff specialists`,
    label: step.label,
    annual: step.annual,
    effectiveFrom: s.effectiveFrom,
    href: null,
    sourceUrl: s.url,
  })),
);

/** Every point, ascending by salary. */
export const PAY_SCALE_INDEX: readonly PayScalePoint[] = [...publicService, ...defence, ...teaching, ...nursing, ...service, ...aviation, ...medical]
  .filter((p) => Number.isFinite(p.annual) && p.annual > 0)
  .sort((a, b) => a.annual - b.annual || a.group.localeCompare(b.group, "en-AU") || a.label.localeCompare(b.label, "en-AU"));

/** At most this many points on a page, one per employer. */
export const PAY_SCALE_ROWS = 10;

export interface PayScaleMatch extends PayScalePoint {
  /** annual - target, dollars. */
  diff: number;
}

/**
 * Points within [target - halfWindow, target + halfWindow): the nearest point
 * from each group, nearest groups first but groups in `avoid` (the
 * neighbouring page's) only to fill the table, at most `max`, returned in
 * ascending order of salary. Half-open, so pages whose windows meet never
 * share a point. `skip` leaves out points another page already lists.
 */
export function payScalePointsNear(
  target: number,
  halfWindow: number,
  max = PAY_SCALE_ROWS,
  avoid: ReadonlySet<string> = new Set(),
  skip: (p: PayScalePoint) => boolean = () => false,
): PayScaleMatch[] {
  const inWindow = PAY_SCALE_INDEX.filter((p) => !skip(p))
    .map((p) => ({ ...p, diff: p.annual - target }))
    .filter((p) => p.diff >= -halfWindow && p.diff < halfWindow)
    .sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff) || a.annual - b.annual || a.label.localeCompare(b.label, "en-AU"));
  const groups = new Set<string>();
  const nearestPerGroup: PayScaleMatch[] = [];
  for (const p of inWindow) {
    if (groups.has(p.group)) continue;
    groups.add(p.group);
    nearestPerGroup.push(p);
  }
  return [...nearestPerGroup.filter((p) => !avoid.has(p.group)), ...nearestPerGroup.filter((p) => avoid.has(p.group))]
    .slice(0, max)
    .sort((a, b) => a.annual - b.annual || a.group.localeCompare(b.group, "en-AU"));
}

// Page copy for the data-driven award pages (/fast-food-award-rates/,
// /pharmacy-award-rates/, /manufacturing-award-rates/, /security-award-rates/,
// /clerks-award-rates/).
//
// Shared by the rendered page and the app/ route's metadata + FAQPage JSON-LD
// so title, description, structured data and visible copy cannot drift.
// Every figure is interpolated from lib/constants/modern-awards.ts.

import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import {
  JUNIOR_PHASE_IN,
  MODERN_AWARDS,
  findAwardRate,
  juniorHourly,
  roundCents,
  type ModernAwardData,
  type ModernAwardKey,
} from "@/lib/constants/modern-awards";

export interface AwardFaq {
  q: string;
  a: string;
}

export interface AwardPageCopy {
  /** <title>, also the Article headline. */
  title: string;
  description: string;
  h1: string;
  /** One-sentence standfirst under the H1. */
  standfirst: string;
  /** The boxed direct answer. */
  directAnswer: string;
  /** Award-specific "read this first" callout, if any. */
  trap?: { heading: string; body: string };
  /** Breadcrumb / short label. */
  crumb: string;
  /** Authorship slug in lib/authors.ts. */
  slug: string;
  faqs: readonly AwardFaq[];
}

const pct = (v: number) => {
  const p = Math.round(v * 1000) / 10;
  return `${p % 1 === 0 ? p.toFixed(0) : p.toFixed(1)}%`;
};
const $ = (v: number) => formatAUD(v, 2);
const casual = (a: ModernAwardData, hourly: number) => roundCents(hourly * (1 + a.meta.casualLoading));
const FY = SITE_CONFIG.financialYear;

function first(a: ModernAwardData) {
  return a.rates[0];
}
function last(a: ModernAwardData) {
  return a.rates.reduce((m, r) => (r.hourly > m.hourly ? r : m), a.rates[0]);
}

/** FAQs every award page carries, worded from that award's own data. */
function commonFaqs(a: ModernAwardData): AwardFaq[] {
  const entry = findAwardRate(a, a.entryLevel);
  const top = last(a);
  const out: AwardFaq[] = [
    {
      q: `What are the ${a.meta.shortName.toLowerCase()} pay rates for ${FY}?`,
      a: `Under the ${a.meta.name} (${a.meta.code}), adult minimum rates run from ${$(first(a).hourly)} an hour (${$(first(a).weekly)} a week) for ${first(a).level} to ${$(top.hourly)} an hour (${$(top.weekly)} a week) for ${top.level}. They apply from the first full pay period starting on or after ${a.meta.operativeFrom}.`,
    },
    {
      q: `What is the casual rate under the ${a.meta.shortName}?`,
      a:
        a.casualPenaltyBasis === "compounded"
          ? `Casuals receive a ${pct(a.meta.casualLoading)} loading, so ${a.entryLevel} becomes ${$(casual(a, entry.hourly))} an hour. In this award penalty, shift and overtime percentages for casuals are applied to that casual rate, so they compound: a casual paid 150% receives 150% of ${$(casual(a, entry.hourly))}, which is ${$(roundCents(casual(a, entry.hourly) * 1.5))}.`
          : `Casuals receive a ${pct(a.meta.casualLoading)} loading on the minimum hourly rate, so ${a.entryLevel} becomes ${$(casual(a, entry.hourly))} an hour. Casual penalty rates add the loading rather than multiplying by it — the casual column in the award is the permanent percentage plus 25 percentage points.`,
    },
    {
      q: `What allowances are paid under the ${a.meta.shortName}?`,
      a: `The award's allowances clause (${a.allowancesClause}) includes: ${a.allowances
        .slice(0, 5)
        .map((x) => `${x.name.charAt(0).toLowerCase() + x.name.slice(1)} ${$(x.amount)} ${x.unit}`)
        .join("; ")}. Allowances are paid on top of the classification rate when the employee meets the clause's conditions.`,
    },
  ];
  if (a.junior) {
    const j = a.junior;
    out.push({
      q: `What are the junior rates under the ${a.meta.shortName}?`,
      a: `Junior rates are a percentage of ${j.baseLevel ? `the ${j.baseLevel} rate` : "the adult rate for the classification"} (${j.clause}): ${j.scale
        .filter((b) => b.percentage < 1)
        .map((b) => `${b.age} ${pct(b.percentage)}`)
        .join(", ")}. The full adult rate applies from age ${j.adultAge}. They apply to ${j.appliesTo}.`,
    });
  } else if (a.noJuniorNote) {
    out.push({ q: `Does the ${a.meta.shortName} have junior rates?`, a: a.noJuniorNote });
  }
  if (a.juniorPhaseIn) {
    const s = a.juniorPhaseIn === "pharmacy" ? JUNIOR_PHASE_IN.pharmacy : JUNIOR_PHASE_IN.fastFood;
    out.push({
      q: `Are ${a.meta.shortName.toLowerCase()} junior rates changing on 1 December 2026?`,
      a: `Yes, but it is a phase-in, not an immediate move to the adult rate. Determination ${s.determination}, made on ${JUNIOR_PHASE_IN.decidedOn} under ${JUNIOR_PHASE_IN.decision}, lifts rates for employees aged 18 to 20 who have been employed by their employer for more than 6 months. From the first full pay period on or after 1 December 2026, 18-year-olds move from ${s.qualifyingPeriod.age18}% to ${s.age18[0]}%, 19-year-olds from ${s.qualifyingPeriod.age19}% to ${s.age19[0]}% and 20-year-olds from ${s.qualifyingPeriod.age20}% to ${s.age20[0]}%, reaching 100% by ${s.periods[s.periods.length - 1].replace("From ", "")}. Employees with 6 months or less with the employer, and all under-18s, stay on the current percentages.`,
    });
  }
  out.push({
    q: `When did the new ${a.meta.shortName.toLowerCase()} rates start?`,
    a: `${a.meta.effectiveNote} The ${a.meta.code} rates were varied by determination ${a.meta.determination} following the Annual Wage Review 2026. If your pay period started before ${a.meta.operativeFrom}, the old rate lawfully applies to that whole period.`,
  });
  return out;
}

function fastFood(): AwardPageCopy {
  const a = MODERN_AWARDS["fast-food"];
  const l1 = findAwardRate(a, "Level 1");
  const l2 = findAwardRate(a, "Level 2");
  const top = last(a);
  const s = JUNIOR_PHASE_IN.fastFood;
  const j16 = juniorHourly(l1.weekly, 0.5);
  return {
    slug: "fast-food-award-rates",
    crumb: "Fast Food Award Rates",
    title: `Fast Food Award Pay Rates ${FY} (${a.meta.code}) — Casual, Junior & Penalty Rates`,
    description: `Fast Food Industry Award rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)}/hr (${$(casual(a, l1.hourly))} casual) to ${$(top.hourly)} at Level 3. Every level with weekend, late-night and public holiday rates, junior rates and the 1 December 2026 junior pay rise.`,
    h1: `Fast Food Award Pay Rates ${FY}`,
    standfirst: `Every classification rate under the ${a.meta.name} (${a.meta.code}) — takeaway shops, burger and pizza chains, food courts and delivery — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Level 1 fast food employee aged 21 or over earns at least ${$(l1.hourly)} an hour, or ${$(casual(a, l1.hourly))} as a casual. Level 2 (supervisors, trainers and trade-skilled staff) is ${$(l2.hourly)}, and a Level 3 store manager is ${$(findAwardRate(a, "Level 3 (in charge of one or no person)").hourly)}–${$(top.hourly)}. Saturday is 125% for everyone, but Sunday is 125% at Level 1 and 150% at Levels 2 and 3.`,
    trap: {
      heading: "Junior rates change on 1 December 2026 — gradually",
      body: `From the first full pay period on or after 1 December 2026, fast food workers aged 18–20 who have been with their employer for more than 6 months move up 5 percentage points (18: ${s.qualifyingPeriod.age18}% → ${s.age18[0]}%, 19: ${s.qualifyingPeriod.age19}% → ${s.age19[0]}%, 20: ${s.qualifyingPeriod.age20}% → ${s.age20[0]}%), then 5 more each July and December until they reach the adult rate. It is not the full adult rate on 1 December. Under-18s are unchanged — a 16-year-old at Level 1 stays on ${$(j16)} an hour.`,
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "What is the fast food Sunday rate?",
        a: `It depends on your level. Level 1 employees are paid 125% on a Sunday (casuals 150%) — ${$(roundCents(l1.hourly * 1.25))} an hour for a permanent adult, ${$(roundCents(l1.hourly * 1.5))} for a casual. Levels 2 and 3 are paid 150% (casuals 175%). Saturday is 125% (casuals 150%) at every level, and public holidays are 225% (casuals 250%).`,
      },
      {
        q: "Do fast food workers get paid more for late nights?",
        a: `Yes, Monday to Friday only. Ordinary hours between 10.00 pm and midnight are paid at 110% (casuals 135%), and between midnight and 6.00 am at 115% (casuals 140%). On Level 1 that is ${$(roundCents(l1.hourly * 1.1))} and ${$(roundCents(l1.hourly * 1.15))} an hour for a permanent adult.`,
      },
      {
        q: "What is a fast food Level 2 or Level 3 employee?",
        a: `Level 2 is an employee with the major day-to-day responsibility for supervising Level 1 staff and/or training new employees, or who is required to use trade skills (${$(l2.hourly)} an hour). Level 3 is an employee appointed to be in charge of a shop, food outlet or delivery outlet — ${$(findAwardRate(a, "Level 3 (in charge of one or no person)").hourly)} if in charge of one or no person, ${$(top.hourly)} if in charge of two or more.`,
      },
      {
        q: "What is the minimum shift under the fast food award?",
        a: "Casuals must be engaged for at least 3 consecutive hours a day, and part-time employees rostered for at least 3 consecutive hours a shift.",
      },
    ],
  };
}

function pharmacy(): AwardPageCopy {
  const a = MODERN_AWARDS.pharmacy;
  const pa1 = findAwardRate(a, "Pharmacy assistant level 1");
  const pa4 = findAwardRate(a, "Pharmacy assistant level 4");
  const ph = findAwardRate(a, "Pharmacist");
  const mgr = findAwardRate(a, "Pharmacist manager");
  const s = JUNIOR_PHASE_IN.pharmacy;
  return {
    slug: "pharmacy-award-rates",
    crumb: "Pharmacy Award Rates",
    title: `Pharmacy Award Pay Rates ${FY} (${a.meta.code}) — Assistants, Interns & Pharmacists`,
    description: `Pharmacy Industry Award rates from ${a.meta.operativeFrom}: pharmacy assistant ${$(pa1.hourly)}–${$(pa4.hourly)}/hr, pharmacist ${$(ph.hourly)}, pharmacist manager ${$(mgr.hourly)}. Casual, time-of-day penalty rates, junior rates and allowances.`,
    h1: `Pharmacy Award Pay Rates ${FY}`,
    standfirst: `Every classification rate under the ${a.meta.name} (${a.meta.code}) — pharmacy assistants, students, interns and pharmacists in community pharmacy — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A pharmacy assistant earns ${$(pa1.hourly)} to ${$(pa4.hourly)} an hour depending on level, or ${$(casual(a, pa1.hourly))} to ${$(casual(a, pa4.hourly))} as a casual. A registered pharmacist earns at least ${$(ph.hourly)} an hour (${$(ph.weekly)} a week), rising to ${$(mgr.hourly)} for a pharmacist manager. Penalty rates depend on the time of day: Saturday 8am–6pm is 125%, but before 8am it is 200%.`,
    trap: {
      heading: "Casuals do not get the loading on overtime — and junior pharmacy assistant rates rise from 1 December 2026",
      body: `The Pharmacy award says in terms that the casual loading is not payable on overtime (cl 11.3), which is the opposite of the Fast Food and Clerks awards. And from 1 December 2026 pharmacy assistants at levels 1–2 aged 18–20 with more than 6 months' service move up on an annual schedule — 18-year-olds to ${s.age18[0]}%, then ${s.age18[1]}% from 1 July 2027 — reaching the adult rate on 1 July 2029. That is a different, slower-stepped schedule from retail and fast food.`,
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "How much does a pharmacist earn under the award?",
        a: `A pharmacist earns at least ${$(ph.hourly)} an hour (${$(ph.weekly)} a week). An experienced pharmacist earns ${$(findAwardRate(a, "Experienced pharmacist").hourly)}, a pharmacist in charge ${$(findAwardRate(a, "Pharmacist in charge").hourly)} and a pharmacist manager ${$(mgr.hourly)}. A pharmacy intern earns ${$(findAwardRate(a, "Pharmacy intern — 1st half of training").hourly)} in the first half of training and ${$(findAwardRate(a, "Pharmacy intern — 2nd half of training").hourly)} in the second.`,
      },
      {
        q: "What are the pharmacy award penalty rates?",
        a: `Monday to Friday: 7–8am 150%, 7–9pm 125%, 9pm–midnight 150%. Saturday: 7–8am 200%, 8am–6pm 125%, 6–9pm 150%, 9pm–midnight 175%. Sunday: 7am–9pm 150%, and before 7am or after 9pm 200%. Public holidays are 225%. Casuals are paid 25 percentage points more in each band.`,
      },
      {
        q: "Do junior rates apply to all pharmacy employees?",
        a: "No. Junior percentages apply only to pharmacy assistants at level 1 or level 2. A junior employed in any other classification — including a pharmacy assistant at level 3 or 4, or a pharmacy student — must be paid the adult rate.",
      },
      {
        q: "What is a pharmacy student paid?",
        a: `Pharmacy students are paid by year of their course: ${$(findAwardRate(a, "Pharmacy student — 1st year of course").hourly)} in first year, rising to ${$(findAwardRate(a, "Pharmacy student — 4th year of course").hourly)} in fourth year. A first-year Master of Pharmacy student is treated as being in the 3rd year of a course.`,
      },
    ],
  };
}

function manufacturing(): AwardPageCopy {
  const a = MODERN_AWARDS.manufacturing;
  const c14 = findAwardRate(a, "C14 / V1");
  const c13 = findAwardRate(a, "C13 / V2");
  const c10 = findAwardRate(a, "C10 / V5");
  const top = findAwardRate(a, "C2(b) / V14");
  const cas = casual(a, c14.hourly);
  return {
    slug: "manufacturing-award-rates",
    crumb: "Manufacturing Award Rates",
    title: `Manufacturing Award Pay Rates ${FY} (${a.meta.code}) — C14 to C2 Rates`,
    description: `Manufacturing and Associated Industries Award rates from ${a.meta.operativeFrom}: C14 ${$(c14.hourly)}/hr, C10 tradesperson ${$(c10.hourly)}, up to ${$(top.hourly)} at C2(b). Casual, shift, weekend and overtime rates, junior rates and the tool and leading hand allowances.`,
    h1: `Manufacturing Award Pay Rates ${FY}`,
    standfirst: `Every classification rate under the ${a.meta.name} (${a.meta.code}) — the C14–C2 structure, vehicle manufacturing V levels and driver grades — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A new manufacturing employee at C14 earns at least ${$(c14.hourly)} an hour (${$(c14.weekly)} a week), moving to C13 at ${$(c13.hourly)}. A qualified tradesperson at C10 earns ${$(c10.hourly)} an hour (${$(c10.weekly)} a week), and the top classification, C2(b), is ${$(top.hourly)}. Casuals get 25% on top — ${$(cas)} at C14 — and in this award their penalties and overtime are calculated on that casual rate.`,
    trap: {
      heading: "In this award casual penalties compound",
      body: `Most awards add the casual loading to the penalty (Saturday 150% becomes 175%). The Manufacturing award applies the penalty to the casual ordinary hourly rate instead (cl 11.1(d), 32.1(f)). A casual C14 working at 150% is paid 150% of ${$(cas)}, which is ${$(roundCents(cas * 1.5))} — the award's own Schedule C figure — not ${$(roundCents(c14.hourly * 1.75))}. Weekend work is also not ordinary time for day workers unless it has been agreed; without agreement it is overtime.`,
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "What is the C10 rate under the manufacturing award?",
        a: `C10 — the Engineering/Manufacturing Tradesperson Level I, the base trade rate — is ${$(c10.weekly)} a week or ${$(c10.hourly)} an hour from ${a.meta.operativeFrom}. A tradesperson who supplies their own tools is also paid a ${$(a.allowances.find((x) => x.name.startsWith("Tool allowance — tradesperson"))!.amount)} weekly tool allowance, which is an all-purpose allowance.`,
      },
      {
        q: "What are the manufacturing award shift rates?",
        a: "Afternoon and night shift are 115% of the ordinary hourly rate, and permanent night shift is 130%. Saturday shifts are 150%, Sunday shifts 200% and public holiday shifts 250% (for non-continuous shiftworkers); these weekend and holiday rates replace the shift loading rather than adding to it.",
      },
      {
        q: "How is overtime paid under the manufacturing award?",
        a: "150% for the first 3 hours and 200% after that. Saturday overtime for a day worker is 150% for 3 hours then 200%, with a minimum payment of 4 hours. Sunday overtime is 200% with a 3-hour minimum, and public holiday overtime is 250% for a day worker. Continuous shiftworkers are paid 200% for all overtime.",
      },
    ],
  };
}

function security(): AwardPageCopy {
  const a = MODERN_AWARDS.security;
  const l1 = findAwardRate(a, "Security Officer Level 1");
  const l3 = findAwardRate(a, "Security Officer Level 3");
  const l5 = findAwardRate(a, "Security Officer Level 5");
  return {
    slug: "security-award-rates",
    crumb: "Security Award Rates",
    title: `Security Award Pay Rates ${FY} (${a.meta.code}) — Levels 1–5, Night & Weekend Rates`,
    description: `Security Services Industry Award rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)}/hr to Level 5 ${$(l5.hourly)}/hr. Night rate 121.7%, Saturday 150%, Sunday 200%, casual rates for every level, and the firearm, first aid and supervision allowances.`,
    h1: `Security Award Pay Rates ${FY}`,
    standfirst: `Every Security Officer level under the ${a.meta.name} (${a.meta.code}), operative from ${a.meta.operativeFrom}, with night, weekend and public holiday rates for permanent and casual guards.`,
    directAnswer: `A Security Officer Level 1 earns at least ${$(l1.hourly)} an hour (${$(l1.weekly)} a week), or ${$(casual(a, l1.hourly))} as a casual. Level 3 is ${$(l3.hourly)} and Level 5 is ${$(l5.hourly)}. Weeknight hours between 6pm and 6am are paid at 121.7% (130% on permanent nights), Saturday at 150%, Sunday at 200% and public holidays at 250%.`,
    trap: {
      heading: "The night rate is 121.7%, not 115% or 125%",
      body: `Security night work (6.00 pm to 6.00 am, Monday to Friday) is paid at 121.7% of the minimum hourly rate — ${$(roundCents(l1.hourly * 1.217))} at Level 1 — and 130% for an officer on permanent night work. A casual gets 146.7% (155% on permanent nights). The award has no junior rates, so an 18-year-old guard is owed the full adult rate for their level.`,
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "How much is a security guard paid on a Sunday?",
        a: `Sunday is 200% of the minimum hourly rate for permanent officers and 225% for casuals. At Level 1 that is ${$(roundCents(l1.hourly * 2))} and ${$(roundCents(l1.hourly * 2.25))} an hour. Saturday is 150% (casuals 175%) and public holidays 250% (casuals 275%).`,
      },
      {
        q: "What is permanent night work under the security award?",
        a: "An officer is on permanent night work over a roster cycle if more than two-thirds of their ordinary shifts include the period between midnight and 6.00 am. They are paid 130% for night hours (casuals 155%) instead of 121.7%.",
      },
    ],
  };
}

function clerks(): AwardPageCopy {
  const a = MODERN_AWARDS.clerks;
  const l1 = findAwardRate(a, "Level 1 — Year 1");
  const l2 = findAwardRate(a, "Level 2 — Year 1");
  const l3 = findAwardRate(a, "Level 3");
  const l5 = findAwardRate(a, "Level 5");
  return {
    slug: "clerks-award-rates",
    crumb: "Clerks Award Rates",
    title: `Clerks Award Pay Rates ${FY} (${a.meta.code}) — Private Sector Levels 1–5`,
    description: `Clerks—Private Sector Award rates from ${a.meta.operativeFrom}: Level 1 Year 1 ${$(l1.hourly)}/hr to Level 5 ${$(l5.hourly)}/hr, plus call centre classifications. Casual, Saturday, Sunday and public holiday rates, overtime, junior rates and allowances.`,
    h1: `Clerks Award Pay Rates ${FY}`,
    standfirst: `Every classification rate under the ${a.meta.name} (${a.meta.code}) — administration, reception, office and call-centre staff in the private sector — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Level 1 clerk in their first year earns at least ${$(l1.hourly)} an hour (${$(l1.weekly)} a week), or ${$(casual(a, l1.hourly))} as a casual. Level 2 starts at ${$(l2.hourly)}, Level 3 is ${$(l3.hourly)} and Level 5 is ${$(l5.hourly)}. Saturday morning ordinary hours are 125%, Sunday 200% and public holidays 250%.`,
    trap: {
      heading: "Levels 1 and 2 step up by year of service — and prior experience counts",
      body: "Level 1 has three yearly steps and Level 2 has two. Any service at the classification level, including administrative and clerical experience with a previous employer, counts towards a year (cl 16.2), so a clerk who changes jobs should not restart at Year 1.",
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "What hours are ordinary hours under the clerks award?",
        a: "For non-shiftworkers, ordinary hours are worked between 7.00 am and 7.00 pm Monday to Friday and 7.00 am to 12.30 pm on Saturday, a spread that can be moved by up to an hour by agreement. Work outside that spread is overtime. Ordinary hours on a Sunday arise only where clerks work alongside employees covered by another award that allows them.",
      },
      {
        q: "How is overtime paid under the clerks award?",
        a: "Monday to Saturday overtime is 150% for the first 2 hours and 200% after that; Sunday is 200% and public holidays 250%. Casual overtime includes the 25% loading, so it is 175%, 225%, 225% and 275%. Overtime is calculated daily and is paid once weekly overtime reaches half an hour.",
      },
    ],
  };
}

const BUILDERS: Record<ModernAwardKey, () => AwardPageCopy> = {
  "fast-food": fastFood,
  pharmacy,
  manufacturing,
  security,
  clerks,
};

export function getAwardPageCopy(key: ModernAwardKey): AwardPageCopy {
  return BUILDERS[key]();
}

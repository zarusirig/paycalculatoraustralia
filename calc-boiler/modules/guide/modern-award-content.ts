// Page copy for the data-driven award pages (/fast-food-award-rates/,
// /pharmacy-award-rates/, /manufacturing-award-rates/, /security-award-rates/,
// /clerks-award-rates/, and from T4: /restaurant-award-rates/,
// /nurses-award-rates/, /aged-care-award-rates/, /hair-and-beauty-award-rates/,
// /cleaning-award-rates/, /road-transport-award-rates/).
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
  juniorHourlyFor,
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
  /**
   * Optional section linking the award to the pay instruments that usually
   * sit above it (Nurses: state public health agreements).
   */
  related?: {
    heading: string;
    body: readonly string[];
    links: readonly { href: string; label: string; note?: string }[];
  };
}

const pct = (v: number) => {
  const p = Math.round(v * 1000) / 10;
  return `${p % 1 === 0 ? p.toFixed(0) : p.toFixed(1)}%`;
};
const $ = (v: number) => formatAUD(v, 2);
const casual = (a: ModernAwardData, hourly: number) => roundCents(hourly * (1 + a.meta.casualLoading));
const FY = SITE_CONFIG.financialYear;

/** The lowest adult classification (rates[0] in most awards; not in Nurses, where student ENs sit lower). */
function first(a: ModernAwardData) {
  return a.rates.reduce((m, r) => (r.hourly < m.hourly ? r : m), a.rates[0]);
}
function last(a: ModernAwardData) {
  return a.rates.reduce((m, r) => (r.hourly > m.hourly ? r : m), a.rates[0]);
}

/** ", except …" naming the penalty rows whose casual figure is tabulated rather than +25 points. */
function casualExceptions(a: ModernAwardData): string {
  const rows = a.penalties.filter((p) => p.casualTabulated && p.employment === undefined);
  if (rows.length === 0) return "";
  return `, except ${rows.map((p) => `${p.label.charAt(0).toLowerCase()}${p.label.slice(1)} (casual ${pct(p.casual)})`).join(" and ")}`;
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
      a: a.casualRuleSummary
        ? `${a.entryLevel} is ${$(casual(a, entry.hourly))} an hour as a casual. ${a.casualRuleSummary}`
        : a.casualPenaltyBasis === "compounded"
          ? `Casuals receive a ${pct(a.meta.casualLoading)} loading, so ${a.entryLevel} becomes ${$(casual(a, entry.hourly))} an hour. In this award penalty, shift and overtime percentages for casuals are applied to that casual rate, so they compound: a casual paid 150% receives 150% of ${$(casual(a, entry.hourly))}, which is ${$(roundCents(casual(a, entry.hourly) * 1.5))}.`
          : `Casuals receive a ${pct(a.meta.casualLoading)} loading on the minimum hourly rate, so ${a.entryLevel} becomes ${$(casual(a, entry.hourly))} an hour. Casual penalty rates add the loading rather than multiplying by it — the casual column in the award is the permanent percentage plus 25 percentage points${casualExceptions(a)}.`,
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
      a: `Junior rates are a percentage of ${j.baseLevel ? `the ${j.baseLevel} rate` : `the adult ${j.basis === "hourly" ? "hourly " : ""}rate for the classification`} (${j.clause}): ${j.scale
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
    title: `Fast Food Award Pay Rates ${FY} (${a.meta.code}) — Casual & Junior`,
    description: `Fast Food Industry Award rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)}/hr (${$(casual(a, l1.hourly))} casual) to ${$(top.hourly)} at Level 3. Weekend, late-night, public holiday and junior rates.`,
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
    title: `Pharmacy Award Pay Rates ${FY} (${a.meta.code}) — Assistant Rates`,
    description: `Pharmacy Industry Award rates from ${a.meta.operativeFrom}: pharmacy assistant ${$(pa1.hourly)}–${$(pa4.hourly)}/hr, pharmacist ${$(ph.hourly)}, manager ${$(mgr.hourly)}. Casual, penalty and junior rates.`,
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
    title: `Manufacturing Award Pay Rates ${FY} (${a.meta.code}) — C14 to C2`,
    description: `Manufacturing Award rates from ${a.meta.operativeFrom}: C14 ${$(c14.hourly)}/hr, C10 tradesperson ${$(c10.hourly)}, up to ${$(top.hourly)} at C2(b). Casual, shift and overtime rates.`,
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
    title: `Security Award Pay Rates ${FY} (${a.meta.code}) — Levels 1–5, Nights`,
    description: `Security Services Industry Award rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)}/hr to Level 5 ${$(l5.hourly)}/hr. Night 121.7%, Saturday 150%, Sunday 200% and casual rates.`,
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
    description: `Clerks—Private Sector Award rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)}/hr to Level 5 ${$(l5.hourly)}/hr. Casual, weekend, public holiday, overtime and junior rates.`,
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

// --- T4 awards batch 3 (23 Sep 2026) ----------------------------------------

function restaurant(): AwardPageCopy {
  const a = MODERN_AWARDS.restaurant;
  const intro = findAwardRate(a, "Introductory Level");
  const l1 = findAwardRate(a, "Level 1");
  const l2 = findAwardRate(a, "Level 2");
  const l3 = findAwardRate(a, "Level 3");
  const l4 = findAwardRate(a, "Level 4");
  const l6 = findAwardRate(a, "Level 6");
  return {
    slug: "restaurant-award-rates",
    crumb: "Restaurant Award Rates",
    title: `Restaurant Award Pay Rates ${FY} (${a.meta.code}) — Sunday Rates`,
    description: `Restaurant Industry Award rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)}/hr (${$(casual(a, l1.hourly))} casual), cook grade 3 ${$(l4.hourly)}, chef de partie ${$(l6.hourly)}. Weekend and holiday rates.`,
    h1: `Restaurant Award Pay Rates ${FY}`,
    standfirst: `Every classification rate under the ${a.meta.name} (${a.meta.code}) — waiters, bar and kitchen staff, cooks and chefs in restaurants and cafés — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Level 1 restaurant employee (food and beverage or kitchen attendant grade 1) earns at least ${$(l1.hourly)} an hour, or ${$(casual(a, l1.hourly))} as a casual. A qualified cook (grade 3, Level 4) earns ${$(l4.hourly)} and a chef de partie (Level 6) ${$(l6.hourly)}. Saturday is 125% (casuals 150%) and Sunday 150% — but a casual on Levels 3 to 6 gets 175% on Sunday while a casual on Levels 1 and 2 gets 150%.`,
    trap: {
      heading: "Casual Sunday rates split by level, and late nights are a flat dollar amount",
      body: `A casual at Introductory Level, Level 1 or Level 2 is paid 150% on a Sunday — ${$(roundCents(l1.hourly * 1.5))} at Level 1, the same as a full-timer — while a casual at Level 3 and above gets 175% (${$(roundCents(l3.hourly * 1.75))} at Level 3). Weeknight work after 10.00 pm is not a percentage: it is ${$(2.95)} an hour extra until midnight and ${$(4.42)} an hour extra after midnight. And the adult rate applies from 20, not 21.`,
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "What is the difference between the Restaurant Award and the Hospitality Award?",
        a: "The Restaurant Industry Award covers restaurants, reception centres, night clubs, cafés and roadhouses, including catering by a restaurant business. It does not cover a restaurant operated in premises owned or run by an employer under the Hospitality Industry (General) Award (hotels, pubs, accommodation), the Registered and Licensed Clubs Award or the Fast Food Award. The awards have different Sunday rates, junior scales and weeknight penalties, so check which one your employer operates under.",
      },
      {
        q: "What is the restaurant award Introductory Level?",
        a: `A new starter who does not yet meet the Level 1 competencies can be paid the Introductory Level rate of ${$(intro.hourly)} an hour for up to 3 months while being trained. They then move to Level 1 (${$(l1.hourly)}) unless both parties agree to up to 3 more months of training.`,
      },
      {
        q: "What are restaurant award junior rates?",
        a: `Under 17: 50% of the adult rate; 17: 60%; 18: 70%; 19: 85%; 20 and over: the full adult rate. At Level 1 that is ${$(juniorHourlyFor(a, l1, 0.5))}, ${$(juniorHourlyFor(a, l1, 0.6))}, ${$(juniorHourlyFor(a, l1, 0.7))} and ${$(juniorHourlyFor(a, l1, 0.85))} an hour. A junior working as a liquor service employee must be paid the adult rate.`,
      },
      {
        q: "Do casual restaurant workers get the casual loading on overtime?",
        a: `No. Restaurant award overtime is a percentage of the minimum hourly rate for casuals too — 150% for the first 2 hours on a weekday, 175% for the first 2 hours on a Saturday and 200% after that and on Sundays. At Level 2 that is ${$(roundCents(l2.hourly * 1.5))}, ${$(roundCents(l2.hourly * 1.75))} and ${$(roundCents(l2.hourly * 2))} an hour, whether full-time or casual.`,
      },
    ],
  };
}

function nurses(): AwardPageCopy {
  const a = MODERN_AWARDS.nurses;
  const rn1 = findAwardRate(a, "Registered nurse level 1 — pay point 1");
  const rn1top = findAwardRate(a, "Registered nurse level 1 — pay point 8 and thereafter");
  const en1 = findAwardRate(a, "Enrolled nurse — pay point 1");
  const na1 = findAwardRate(a, "Nursing assistant — 1st year");
  const np1 = findAwardRate(a, "Nurse practitioner — 1st year");
  const acRn1 = findAwardRate(a, "Aged care registered nurse level 1 — first year at level");
  const acEn = findAwardRate(a, "Aged care enrolled nurse supervising other direct care employees");
  const casRn1 = casual(a, rn1.hourly);
  return {
    slug: "nurses-award-rates",
    crumb: "Nurses Award Rates",
    title: `Nurses Award Pay Rates ${FY} (${a.meta.code}) — RN, EN & AIN Rates`,
    description: `Nurses Award 2020 rates: RN level 1 ${$(rn1.hourly)}/hr (${$(rn1.weekly)}/wk), enrolled nurse ${$(en1.hourly)}, aged care RN ${$(acRn1.hourly)} from 1 August 2026. Shift and casual rates.`,
    h1: `Nurses Award Pay Rates ${FY}`,
    standfirst: `Every classification under the ${a.meta.name} (${a.meta.code}) — nursing assistants, enrolled and registered nurses, nurse practitioners and occupational health nurses — in both the general and aged care rate streams.`,
    directAnswer: `A registered nurse on level 1 pay point 1 earns at least ${$(rn1.hourly)} an hour (${$(rn1.weekly)} a week), rising to ${$(rn1top.hourly)} at pay point 8. An enrolled nurse starts at ${$(en1.hourly)} and a first-year nursing assistant at ${$(na1.hourly)}. Registered nurses in aged care have their own, higher scale: ${$(acRn1.hourly)} an hour in the first year at level 1 from 1 August 2026. These are minimums — nurses in state public hospitals are paid under state agreements that are well above the award.`,
    trap: {
      heading: "Two rate streams, and casual weekend rates compound",
      body: `The award has one scale for aged care employees (clause 15.3) and another for everyone else (clause 15.1), and the same nominal level pays differently in each: an aged care RN level 1 starts on ${$(acRn1.hourly)} against ${$(rn1.hourly)} elsewhere. For casuals, afternoon and night shift loadings add to the 25% loading (137.5% and 140%), but weekend and public holiday rates are a percentage of the casual rate — a casual RN level 1 on a Saturday is paid ${$(roundCents(casRn1 * 1.5))}, not ${$(roundCents(rn1.hourly * 1.75))}.`,
    },
    related: {
      heading: "Nurses Award vs Public Hospital Agreements",
      body: [
        "The Nurses Award is the legal minimum, not the pay most nurses receive. Nurses and midwives in state public hospitals are paid under their state's enterprise agreement or state award, which pays well above these rates and usually uses its own grade and year structure. The award matters most in private hospitals, GP and specialist clinics, aged care, schools and agency work where no agreement applies.",
        "If you work in a public hospital, use your state's rates instead:",
      ],
      links: [
        { href: "/healthcare-worker-pay/nsw/", label: "NSW public health nurse pay" },
        { href: "/healthcare-worker-pay/vic/", label: "Victorian public sector nurse pay" },
        { href: "/healthcare-worker-pay/qld/", label: "Queensland Health nurse pay" },
        { href: "/healthcare-worker-pay/wa/", label: "WA Health nurse pay" },
        { href: "/healthcare-worker-pay/sa/", label: "SA Health nurse pay" },
        { href: "/healthcare-worker-pay/tas/", label: "Tasmanian Health Service nurse pay" },
        { href: "/job-pay-rates/nurse/", label: "Nurse pay rates", note: "award and agreement rates side by side" },
        { href: "/aged-care-award-rates/", label: "Aged Care Award rates", note: "personal care workers and nursing assistants in residential aged care" },
      ],
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "How much does a registered nurse earn under the Nurses Award?",
        a: `Outside aged care, a level 1 registered nurse earns ${$(rn1.hourly)} to ${$(rn1top.hourly)} an hour across 8 pay points (${$(rn1.weekly)} to ${$(rn1top.weekly)} a week). A graduate with a 4-year degree starts on ${$(findAwardRate(a, "Registered nurse entry — 4-year degree").hourly)} and one with a Masters degree on ${$(findAwardRate(a, "Registered nurse entry — Masters degree").hourly)}. Level 2 starts at ${$(findAwardRate(a, "Registered nurse level 2 — pay point 1").hourly)} and level 3 at ${$(findAwardRate(a, "Registered nurse level 3 — pay point 1").hourly)}.`,
      },
      {
        q: "What are aged care nurse rates from 1 August 2026?",
        a: `The final aged care work value increase took effect from the first full pay period on or after 1 August 2026 (PR812118). An aged care registered nurse level 1 earns ${$(acRn1.hourly)} an hour in the first year, ${$(findAwardRate(a, "Aged care registered nurse level 1 — over 1 and up to 4 years").hourly)} after one year and ${$(findAwardRate(a, "Aged care registered nurse level 1 — over 4 years").hourly)} after four. An enrolled nurse supervising other direct care employees earns ${$(acEn.hourly)}.`,
      },
      {
        q: "What is the Nurses Award shift penalty?",
        a: `Monday to Friday, an afternoon shift (starting at or after noon and finishing after 6.00 pm) carries a 12.5% loading and a night shift (starting at or after 6.00 pm and finishing before 7.30 am) 15%. Saturday is 150%, Sunday 175% and public holidays 200%. For a level 1 pay point 1 RN that is ${$(roundCents(rn1.hourly * 1.125))}, ${$(roundCents(rn1.hourly * 1.15))}, ${$(roundCents(rn1.hourly * 1.5))}, ${$(roundCents(rn1.hourly * 1.75))} and ${$(roundCents(rn1.hourly * 2))} an hour. Shift loadings do not apply to registered nurse levels 4 and 5.`,
      },
      {
        q: "How much does a nurse practitioner earn under the award?",
        a: `A nurse practitioner earns ${$(np1.hourly)} an hour (${$(np1.weekly)} a week) in the first year and ${$(findAwardRate(a, "Nurse practitioner — 2nd year").hourly)} in the second, or ${$(findAwardRate(a, "Aged care nurse practitioner — 1st year").hourly)} and ${$(findAwardRate(a, "Aged care nurse practitioner — 2nd year").hourly)} in aged care.`,
      },
    ],
  };
}

function agedCare(): AwardPageCopy {
  const a = MODERN_AWARDS["aged-care"];
  const dc1 = findAwardRate(a, "Direct care — level 1 (Introductory)");
  const dc2 = findAwardRate(a, "Direct care — level 2 (Direct Carer)");
  const dc3 = findAwardRate(a, "Direct care — level 3 (Qualified)");
  const dc6 = findAwardRate(a, "Direct care — level 6 (Team Leader)");
  const g1 = findAwardRate(a, "General — level 1");
  const g7 = findAwardRate(a, "General — level 7");
  return {
    slug: "aged-care-award-rates",
    crumb: "Aged Care Award Rates",
    title: `Aged Care Award Pay Rates ${FY} (${a.meta.code}) — Care Workers`,
    description: `Aged Care Award rates from ${a.meta.operativeFrom}: direct care (personal care worker) ${$(dc1.hourly)}–${$(dc6.hourly)}/hr, general staff ${$(g1.hourly)}–${$(g7.hourly)}. Casual, shift and weekend rates.`,
    h1: `Aged Care Award Pay Rates ${FY}`,
    standfirst: `Every classification under the ${a.meta.name} (${a.meta.code}) — personal care workers and other direct care staff, plus the general stream for administration, cleaning, laundry, kitchen and maintenance staff in residential aged care.`,
    directAnswer: `A direct care worker (personal care worker) earns at least ${$(dc1.hourly)} an hour at Introductory level, ${$(dc2.hourly)} as a Direct Carer and ${$(dc3.hourly)} once Qualified — ${$(casual(a, dc3.hourly))} as a casual. General staff earn ${$(g1.hourly)} to ${$(g7.hourly)}. Saturday is 150% (casuals 175%), Sunday 175% (casuals 200%) and public holidays 250% (casuals 275%).`,
    trap: {
      heading: "The work value increases are finished — these rates include them",
      body: `The aged care work value case lifted direct care rates from 1 January 2025, with a second step on 1 October 2025 for the larger increases, and general staff by 3% from 1 January 2025. The 1 July 2026 Annual Wage Review then applied on top. There is no further scheduled increase for Aged Care Award employees; the 1 August 2026 rise was for nurses under the Nurses Award. The award sets weekly rates only, so the hourly figures here are the weekly rate divided by 38.`,
    },
    related: {
      heading: "Aged Care Award, Nurses Award or SCHADS?",
      body: [
        "Three awards divide aged care between them. The Aged Care Award covers personal care workers, nursing assistants and support staff in residential facilities. Registered and enrolled nurses are covered by the Nurses Award, and home care workers by the SCHADS Award.",
      ],
      links: [
        { href: "/nurses-award-rates/", label: "Nurses Award rates", note: "aged care registered and enrolled nurses" },
        { href: "/schads-award-pay-rates/", label: "SCHADS Award rates", note: "home care and disability support" },
      ],
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "How much does a personal care worker earn in aged care?",
        a: `Personal care workers are direct care employees. From ${a.meta.operativeFrom} they earn ${$(dc1.hourly)} an hour at level 1 (Introductory), ${$(dc2.hourly)} at level 2 (Direct Carer), ${$(dc3.hourly)} at level 3 (Qualified), ${$(findAwardRate(a, "Direct care — level 4 (Senior)").hourly)} at level 4 (Senior), ${$(findAwardRate(a, "Direct care — level 5 (Specialist)").hourly)} at level 5 (Specialist) and ${$(dc6.hourly)} as a Team Leader. On a full-time 38-hour week a Qualified carer earns ${$(dc3.weekly)}.`,
      },
      {
        q: "What are aged care award shift penalties?",
        a: `An afternoon shift starting between 10.00 am and 1.00 pm is paid an extra 10%, one starting between 1.00 pm and 4.00 pm 12.5%, a night shift starting between 4.00 pm and 4.00 am 15%, and one starting between 4.00 am and 6.00 am 10%. The allowance is paid for the whole shift. At direct care level 3 the 15% night shift rate is ${$(roundCents(dc3.hourly * 1.15))} an hour.`,
      },
      {
        q: "What is the aged care award casual overtime rate?",
        a: `The award sets it in terms: 187.5% of the hourly rate for the first 2 hours Monday to Friday, 250% after that and on weekends, and 312.5% on public holidays. For a Qualified direct care worker that is ${$(roundCents(dc3.hourly * 1.875))}, ${$(roundCents(dc3.hourly * 2.5))} and ${$(roundCents(dc3.hourly * 3.125))} an hour.`,
      },
      {
        q: "Is there a sleepover allowance under the aged care award?",
        a: `Yes. An employee required to sleep over is paid an allowance of 5.2% of the standard rate — ${$(a.allowances.find((x) => x.name.startsWith("Sleepover"))!.amount)} a night — plus free board and lodging. Any work performed during a sleepover is paid on top, at overtime rates for full-time employees.`,
      },
    ],
  };
}

function hairAndBeauty(): AwardPageCopy {
  const a = MODERN_AWARDS["hair-and-beauty"];
  const l1 = findAwardRate(a, "Level 1");
  const l3 = findAwardRate(a, "Level 3");
  const l6 = findAwardRate(a, "Level 6");
  return {
    slug: "hair-and-beauty-award-rates",
    crumb: "Hair and Beauty Award Rates",
    title: `Hair and Beauty Award Pay Rates ${FY} (${a.meta.code}) — Hairdressers`,
    description: `Hair and Beauty Industry Award rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)}/hr (${$(casual(a, l1.hourly))} casual) to Level 6 ${$(l6.hourly)}. Saturday 133%, Sunday 200% and junior rates.`,
    h1: `Hair and Beauty Award Pay Rates ${FY}`,
    standfirst: `Every adult classification under the ${a.meta.name} (${a.meta.code}) — hairdressers, barbers, beauty therapists, nail technicians and salon staff — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Level 1 hair and beauty employee earns at least ${$(l1.hourly)} an hour, or ${$(casual(a, l1.hourly))} as a casual. A qualified hairdresser or beauty therapist at Level 3 earns ${$(l3.hourly)}, and Level 6 ${$(l6.hourly)}. Saturday between 7.00 am and 6.00 pm is 133% (casuals 158%), Sunday 200% (casuals 225%) and public holidays 250% for everyone.`,
    trap: {
      heading: "Saturday is 133%, casual public holidays are 250%, and adult pay starts at 18",
      body: `Salon Saturdays are paid at 133% (${$(roundCents(l1.hourly * 1.33))} at Level 1), not the 125% most awards use. On a public holiday a casual gets 250% — the same as a permanent employee, because the 25% loading is not added. Juniors reach the adult rate at 18: under-17s get 50% and 17-year-olds 75%.`,
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "How much does a hairdresser earn under the award?",
        a: `A qualified hairdresser is typically classified at Level 3 or above: ${$(l3.hourly)} an hour (${$(l3.weekly)} a week) at Level 3, ${$(findAwardRate(a, "Level 4").hourly)} at Level 4, ${$(findAwardRate(a, "Level 5").hourly)} at Level 5 and ${$(l6.hourly)} at Level 6. Apprentice hairdressers are paid a percentage of the Level 3 rate under clause 18, which this page does not reproduce.`,
      },
      {
        q: "What are hair and beauty junior rates?",
        a: `Under 17: 50% of the adult rate; 17: 75%; 18 and over: the full adult rate. At Level 1 that is ${$(juniorHourlyFor(a, l1, 0.5))} and ${$(juniorHourlyFor(a, l1, 0.75))} an hour — the award's own Schedule B figures.`,
      },
      {
        q: "Do salon workers get paid more for late nights?",
        a: "Ordinary hours can only be worked 7.00 am to 9.00 pm on weekdays, 7.00 am to 6.00 pm on Saturday and 10.00 am to 5.00 pm on Sunday. Full-time and part-time employees working outside those hours are paid overtime. Casuals working before 7.00 am or after 9.00 pm on a weekday, or outside 7.00 am to 6.00 pm on a Saturday, are paid 150%.",
      },
      {
        q: "Is there a tool allowance for hairdressers?",
        a: `Yes. An employee required to provide their own tools, including scissors, is paid ${$(a.allowances.find((x) => x.name.startsWith("Tool"))!.amount)} a week, and must be reimbursed for any electrical equipment they have to buy.`,
      },
    ],
  };
}

function cleaning(): AwardPageCopy {
  const a = MODERN_AWARDS.cleaning;
  const l1 = findAwardRate(a, "Level 1");
  const l2 = findAwardRate(a, "Level 2");
  const l3 = findAwardRate(a, "Level 3");
  const pt = (h: number) => roundCents(h * (1 + (a.meta.partTimeLoading ?? 0)));
  return {
    slug: "cleaning-award-rates",
    crumb: "Cleaning Award Rates",
    title: `Cleaning Award Pay Rates ${FY} (${a.meta.code}) — Casual Cleaners`,
    description: `Cleaning Services Award rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)}/hr full-time, ${$(pt(l1.hourly))} part-time (15% allowance), ${$(casual(a, l1.hourly))} casual. Night, weekend and holiday rates.`,
    h1: `Cleaning Award Pay Rates ${FY}`,
    standfirst: `Every classification under the ${a.meta.name} (${a.meta.code}) — commercial and contract cleaners and shopping trolley collectors — with separate full-time, part-time and casual rates, operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Level 1 cleaner earns at least ${$(l1.hourly)} an hour full-time, ${$(pt(l1.hourly))} part-time and ${$(casual(a, l1.hourly))} casual. Level 2 is ${$(l2.hourly)} and Level 3 ${$(l3.hourly)} (full-time). A weekday shift starting before 6.00 am or finishing after 6.00 pm is paid 115% (part-time 130%, casual 140%) for the whole shift, Saturday 150% and Sunday 200%.`,
    trap: {
      heading: "Part-time cleaners are paid 15% more per hour than full-timers",
      body: `The Cleaning Services Award pays part-time employees a 15% allowance on every ordinary hour (cl 10.2), so a part-time Level 1 cleaner's base rate is ${$(pt(l1.hourly))}, not ${$(l1.hourly)}. The penalty table has a separate part-time column: a part-timer's Saturday is 165% and Sunday 215%. Junior rates apply only to shopping trolley collectors — every other cleaner gets the adult rate at any age.`,
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "What is the cleaning award night shift rate?",
        a: `A Monday to Friday shift that starts before 6.00 am or finishes after 6.00 pm is paid at 115% for the whole shift (part-time 130%, casual 140%). A permanent night shift — one that finishes after midnight and by 8.00 am and does not rotate — is 130% (casual 155%). At Level 1 that is ${$(roundCents(l1.hourly * 1.15))} and ${$(roundCents(l1.hourly * 1.3))} an hour full-time.`,
      },
      {
        q: "What is the minimum shift for a cleaner?",
        a: "It depends on the site. A part-time or casual cleaner must be rostered for at least 1 hour if working alone at a stand-alone site of up to 300 square metres, 2 hours at a site up to 2,000 square metres, 3 hours from 2,000 to 5,000 square metres and 4 hours at 5,000 square metres or more — and paid for the minimum even if the job finishes early.",
      },
      {
        q: "Is there a toilet cleaning allowance?",
        a: `Yes. A cleaner employed for the major part of a shift to clean toilets is paid ${$(a.allowances.find((x) => x.name.startsWith("Toilet"))!.amount)} a shift or $18.17 a week. Other allowances include a broken shift allowance of $4.71 a day and a leading hand allowance from $61.73 a week.`,
      },
      {
        q: "Do junior cleaners get paid less?",
        a: "Only shopping trolley collectors employed by trolley collection contractors can be paid junior rates — 45% of the adult rate under 16, rising to 90% at 20. Every other cleaner covered by the award must be paid the full adult rate regardless of age.",
      },
    ],
  };
}

function roadTransport(): AwardPageCopy {
  const a = MODERN_AWARDS["road-transport"];
  const g1 = findAwardRate(a, "Transport Worker Grade 1");
  const g2 = findAwardRate(a, "Transport Worker Grade 2");
  const g3 = findAwardRate(a, "Transport Worker Grade 3");
  const g6 = findAwardRate(a, "Transport Worker Grade 6");
  const g7 = findAwardRate(a, "Transport Worker Grade 7");
  const g10 = findAwardRate(a, "Transport Worker Grade 10");
  return {
    slug: "road-transport-award-rates",
    crumb: "Road Transport Award Rates",
    title: `Road Transport Award Pay Rates ${FY} (${a.meta.code}) — Truck Drivers`,
    description: `Road Transport Award rates from ${a.meta.operativeFrom}: Grade 1 ${$(g1.hourly)}/hr to Grade 10 ${$(g10.hourly)}/hr; semi-trailer ${$(g6.hourly)}, B-double ${$(g7.hourly)}. Shift, weekend and casual rates.`,
    h1: `Road Transport Award Pay Rates ${FY}`,
    standfirst: `Every transport worker grade and distribution facility level under the ${a.meta.name} (${a.meta.code}) — truck, forklift and delivery drivers, couriers, loaders and warehouse staff — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Transport Worker Grade 1 earns at least ${$(g1.hourly)} an hour, or ${$(casual(a, g1.hourly))} as a casual. A light rigid driver (Grade 2) earns ${$(g2.hourly)}, a forklift or medium rigid driver (Grade 3) ${$(g3.hourly)}, a semi-trailer driver (Grade 6) ${$(g6.hourly)} and a B-double driver (Grade 7) ${$(g7.hourly)}. Saturday is 150% and Sunday 200% (casuals 175% and 225%).`,
    trap: {
      heading: "Casual overtime drops the 25% loading — and junior rates run off the hourly rate",
      body: `A casual on overtime is not paid the 25% loading. They get the overtime rate plus 10% of the minimum hourly rate: 160% for the first 2 hours and 210% after (${$(roundCents(g1.hourly * 1.6))} and ${$(roundCents(g1.hourly * 2.1))} at Grade 1). Full-time day workers are paid public holiday rates on top of their weekly wage. And a junior aged 18 or over driving a vehicle alone must be paid the adult rate for that driving grade.`,
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "How much does a truck driver earn under the award?",
        a: `It depends on the vehicle. A rigid truck up to 4.5 tonnes is Grade 2 (${$(g2.hourly)} an hour); a two-axle rigid up to 13.9 tonnes Grade 3 (${$(g3.hourly)}); a three-axle rigid Grade 4 (${$(findAwardRate(a, "Transport Worker Grade 4").hourly)}); a semi-trailer over 22.4 tonnes Grade 6 (${$(g6.hourly)}); a B-double up to 53.4 tonnes Grade 7 (${$(g7.hourly)}); and heavier combinations Grades 8 to 10 (up to ${$(g10.hourly)}). Full-time, Grade 6 is ${$(g6.weekly)} a week.`,
      },
      {
        q: "What are the road transport award shift rates?",
        a: `Shiftworkers are paid 117.5% on an afternoon shift (finishing after 6.30 pm and by 12.30 am) and 130% on a night shift (finishing after 12.30 am and by 8.30 am); casuals get 142.5% and 155%. At Grade 6 that is ${$(roundCents(g6.hourly * 1.175))} and ${$(roundCents(g6.hourly * 1.3))} an hour full-time. A shift roster that does not run for at least 5 consecutive afternoons or nights is paid 150% for the first 3 hours and 200% after.`,
      },
      {
        q: "What is the minimum engagement for a casual truck driver?",
        a: "A casual must be paid for at least 4 hours each engagement, and anyone required to work on a Saturday or Sunday is paid for at least 4 hours.",
      },
      {
        q: "Is there a dangerous goods allowance?",
        a: "Yes. A driver carrying bulk dangerous goods or explosives by public road is paid $25.07 a day, and one carrying packaged dangerous goods that require placards $10.47 a day. The employer must also reimburse training and medical costs for a dangerous goods licence.",
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
  // --- T4 awards batch 3 ---
  restaurant,
  nurses,
  "aged-care": agedCare,
  "hair-and-beauty": hairAndBeauty,
  cleaning,
  "road-transport": roadTransport,
};

export function getAwardPageCopy(key: ModernAwardKey): AwardPageCopy {
  return BUILDERS[key]();
}

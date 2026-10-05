// Page copy for the October 2026 award pages, batch 2 (Plumbing, Pastoral,
// Horticulture, Health Professionals, Timber, Meat, Commercial Sales, Mining).
// Same contract as modern-award-content-oct.ts: every figure is interpolated
// from lib/constants/modern-awards-oct2.ts, so the title, description, FAQPage
// JSON-LD and visible copy cannot drift from the rate tables.
//
// Imported lazily by modern-award-content.ts (see its BUILDERS table).

import { fitDescription } from "@/lib/seo-title";
import { NMW } from "@/lib/constants/minimum-wage";
import { MODERN_AWARDS, findAwardRate, roundCents } from "@/lib/constants/modern-awards";
import { $, FY, casual, commonFaqs, type AwardPageCopy } from "@/modules/guide/modern-award-content";

const level = (key: keyof typeof MODERN_AWARDS, name: string) => findAwardRate(MODERN_AWARDS[key], name);
const x = (hourly: number, mult: number) => roundCents(hourly * mult);

/**
 * The lowest grade in four of these awards ($25.74) is below the national minimum wage.
 * Fair Work: some awards contain introductory rates that can sit below the NMW, but the
 * lowest award rate that applies to ongoing employment must be at least the NMW.
 */
const nmwFaq = (entry: { level: string; hourly: number }, introNote: string) => ({
  q: `Is the lowest ${entry.level} rate below the national minimum wage?`,
  a: `Yes. The ${entry.level} minimum of ${$(entry.hourly)} an hour is below the national minimum wage of ${$(NMW.hourly)} an hour (${$(NMW.weekly)} a week) that applies from 1 July 2026. Fair Work explains that some awards contain introductory pay rates that can be lower than the National Minimum Wage, but the lowest award rate that applies to ongoing employment must be at least ${$(NMW.hourly)}. ${introNote} If you are being paid less than ${$(NMW.hourly)} an hour after your introductory period, check your level and contact the Fair Work Ombudsman.`,
});

// -----------------------------------------------------------------------------

function plumbing(): AwardPageCopy {
  const a = MODERN_AWARDS.plumbing;
  const w1a = level("plumbing", "Plumbing worker Level 1(a) — new entrant");
  const t1r = level("plumbing", "Plumbing tradesperson Level 1 (registered)");
  const t1n = level("plumbing", "Plumbing tradesperson Level 1 (not registered)");
  const adv2 = level("plumbing", "Plumbing advanced tradesperson Level 2 (registered)");
  const sf1 = level("plumbing", "Sprinkler fitter tradesperson Level 1");
  const sat1 = x(t1r.hourly, 1.5);
  const sat2 = x(t1r.hourly, 2);
  const total = roundCents(sat1 * 2 + sat2 * 3);
  return {
    slug: "plumbing-award-rates",
    crumb: "Plumbing Award Rates",
    title: `Plumbing Award Pay Rates ${FY} (${a.meta.code}) — Plumber & Fire Sprinkler`,
    description: fitDescription(
      `Plumbing and Fire Sprinklers Award (MA000036) rates: registered plumber ${$(t1r.hourly)}/hr, worker ${$(w1a.hourly)}/hr. Overtime, weekend, casual rates and the 16 Sept 2026 allowance variation.`,
      `Plumbing Award MA000036 rates: plumber ${$(t1r.hourly)}/hr registered, ${$(t1n.hourly)} not. Overtime, weekend and casual rates, with the 2026 allowance change.`,
    ),
    h1: `Plumbing Award Pay Rates ${FY}`,
    standfirst: `Ordinary hourly rates for every plumbing, mechanical services and fire sprinkler fitting classification under the ${a.meta.name} (${a.meta.code}), with all-purpose allowances built in — consolidated to the 16 September 2026 variation.`,
    directAnswer: `A registered plumbing tradesperson Level 1 on weekly hire earns ${$(t1r.hourly)} an hour (${$(t1r.weekly)} a week) including the all-purpose allowances, or ${$(casual(a, t1r.hourly))} as a casual. A not-registered tradesperson Level 1 is ${$(t1n.hourly)}; a new-entrant worker Level 1(a) is ${$(w1a.hourly)}; a sprinkler fitter tradesperson Level 1 is ${$(sf1.hourly)}. Saturday is 150% for 2 hours then 200%, Sunday 200% and public holidays 250%.`,
    trap: {
      heading: "The 16 September 2026 variation changed one allowance clause — no rate moved",
      body: `On 16 September 2026 the Fair Work Commission varied clause 21 (Allowances) under its own initiative (determination PR814392, decision [2026] FWC 3528) to fix a cross-referencing error in clause 21.9(f), the mileage allowance. It now reads that the allowance is for an employee entitled to the additional travelling time allowance under cl 21.9(d) who uses their own vehicle for travel beyond the defined radius (cl 21.9(c)(ii)), at ${$(0.55)} per kilometre. The first determination printed $0.54, and a correction (PR814410) the same day restored $0.55, the figure that already applied from 1 July 2026. Every other allowance and every minimum rate on this page is unchanged. And remember the award's table in clause 18 is not what you are paid: the industry, trade, registration and special fixed allowances are paid for all purposes (cl 21.2), so they sit inside the ordinary hourly rate that every penalty and overtime percentage is applied to.`,
    },
    workedExample: {
      heading: "Worked example: a registered plumber's Saturday",
      intro: `Sam is a weekly hire registered plumbing tradesperson Level 1 and is directed to work 5 ordinary hours on a Saturday. His ordinary hourly rate is ${$(t1r.hourly)}: the $1,119.10 minimum plus the $41.41 industry, $33.57 plumbing trade, $44.76 registration and $7.70 special fixed allowances is ${$(t1r.weekly)} a week, divided by 38.`,
      steps: [
        `First 2 hours at 150%: ${$(t1r.hourly)} × 1.5 = ${$(sat1)} an hour → ${$(roundCents(sat1 * 2))}.`,
        `Next 3 hours at 200%: ${$(t1r.hourly)} × 2 = ${$(sat2)} an hour → ${$(roundCents(sat2 * 3))}.`,
        `Total: ${$(total)} before tax. The award guarantees at least 3 hours' work on a Saturday, so a shorter call-in still pays for 3 hours.`,
      ],
      outro: `A casual doing the same shift is paid 175% then 225% of the same ordinary hourly rate. A tradesperson who is not registered has the $44.76 registration allowance missing from the rate, so the same 5 hours is worth less: ${$(roundCents(x(t1n.hourly, 1.5) * 2 + x(t1n.hourly, 2) * 3))}.`,
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "What changed in the Plumbing Award on 16 September 2026?",
        a: "The Fair Work Commission varied clause 21.9(f), the mileage allowance for travel beyond the defined radius, to correct a cross-referencing error (determination PR814392, corrected by PR814410). The allowance is paid at $0.55 a kilometre to an employee who is entitled to the additional travelling time allowance in cl 21.9(d) and uses their own vehicle. No minimum rate, penalty or other allowance changed.",
      },
      {
        q: "What is a plumber's hourly rate under the award?",
        a: `On weekly hire, a registered tradesperson Level 1 earns ${$(t1r.hourly)} an hour ordinary time and a tradesperson Level 2 ${$(level("plumbing", "Plumbing tradesperson Level 2 (registered)").hourly)}, rising to ${$(adv2.hourly)} for an advanced tradesperson Level 2. These include the all-purpose allowances. Without registration the Level 1 rate is ${$(t1n.hourly)}. The bare minimum weekly rates in clause 18 ($1,119.10 at Level 1) are lower because they exclude those allowances.`,
      },
      {
        q: "What is the plumbing registration allowance?",
        a: "An employee in a plumbing and mechanical tradesperson classification who is registered under the relevant State legislation is paid a registration allowance of $44.76 a week, to compensate for the responsibilities of holding and maintaining registration (cl 21.3(c)). It is paid for all purposes, so it is in the ordinary hourly rate that overtime and penalties are calculated on.",
      },
      {
        q: "What are plumbing overtime and weekend rates?",
        a: `Overtime Monday to Friday is 150% for the first 2 hours and 200% after (${$(x(t1r.hourly, 1.5))} and ${$(x(t1r.hourly, 2))} for a registered Level 1 tradesperson). Saturday is 150% for 2 hours then 200%, and 200% after 12 noon; Sunday is 200%; public holidays are 250%. Casuals add the 25% loading: 175%, 225% and 275% (cl 22.1(a)).`,
      },
      {
        q: "Are fire sprinkler fitters paid differently to plumbers?",
        a: `Yes. Sprinkler fitting has its own set of all-purpose allowances (industry disability $42.53, space, height and dirt $39.17, adjustment $36.93, trade allowance $8.39), so a sprinkler fitter tradesperson Level 1 is ${$(sf1.hourly)} an hour against ${$(t1n.hourly)} for an unregistered plumber at the same level. Sprinkler fitters are also paid 200% for Saturday overtime from the first hour and have their own on-call allowances (cl 17.2, 22.1(a)).`,
      },
      {
        q: "Does the award cover apprentice plumbers?",
        a: "Yes, apprentices are covered, but their rates are percentages by year of apprenticeship set out in clause 18.2 and Schedule E, which this page does not reproduce. See the apprentice pay rates page for what apprentices are paid by trade and year.",
      },
    ],
  };
}

// -----------------------------------------------------------------------------

function pastoral(): AwardPageCopy {
  const a = MODERN_AWARDS.pastoral;
  const f1 = level("pastoral", "FLH1");
  const f3 = level("pastoral", "FLH3");
  const f5 = level("pastoral", "FLH5");
  const f8 = level("pastoral", "FLH8");
  const otCas = x(f3.hourly, 1.75);
  const ot = x(f3.hourly, 1.5);
  return {
    slug: "pastoral-award-rates",
    crumb: "Pastoral Award Rates",
    title: `Pastoral Award Pay Rates ${FY} (${a.meta.code}) — Farm Hand Levels`,
    description: fitDescription(
      `Pastoral Award (MA000035) farm and livestock hand rates from ${a.meta.operativeFrom}: FLH1 ${$(f1.hourly)}/hr to FLH8 ${$(f8.hourly)}/hr. Casual, overtime, public holiday and keep. Shearers excluded.`,
      `Pastoral Award MA000035 farm hand rates: FLH1 ${$(f1.hourly)} to FLH8 ${$(f8.hourly)} an hour, with casual, overtime and public holiday rates. Shearing is piece rate.`,
    ),
    h1: `Pastoral Award Pay Rates ${FY}`,
    standfirst: `Hourly rates for farm and livestock hands (FLH1 to FLH8) under Part 6 of the ${a.meta.name} (${a.meta.code}), operative from ${a.meta.operativeFrom}. Shearers and other piece-rate classifications are not covered here.`,
    directAnswer: `A new station hand or farm worker (FLH1) earns at least ${$(f1.hourly)} an hour (${$(f1.weekly)} a week), or ${$(casual(a, f1.hourly))} as a casual. A station hand with 12 months' experience (FLH3) earns ${$(f3.hourly)}, a senior station hand (FLH5) ${$(f5.hourly)} and a senior dairy operator (FLH8) ${$(f8.hourly)}. There is no weekend penalty for ordinary hours; overtime is 150% Monday to Saturday, and 200% on a Sunday except for feeding and watering stock (150%). A public holiday is 200%.`,
    trap: {
      heading: "Shearers are paid by the sheep, not by the hour — and this page excludes them",
      body: "The Pastoral Award has nine parts. This page covers only Part 6, the hourly rates for broadacre farming and livestock hands. Shearers, crutchers and woolpressers are piece-rate workers paid per sheep shorn or bale pressed under Part 9 and Schedule A, and no hourly rate on this page applies to that work. Pig breeding (Part 7), poultry farming (Part 8) and shearing-shed hands are also not reproduced. Check the award text for those classifications.",
    },
    workedExample: {
      heading: "Worked example: a casual station hand's Sunday",
      intro: `Mia is a casual station hand at FLH3 (12 months' experience, ${$(f3.hourly)} an hour minimum). She works 6 hours on a Sunday, none of it feeding or watering stock, and it is beyond her ordinary hours.`,
      steps: [
        `Sunday overtime other than feeding and watering stock is 200% for a permanent employee and 225% for a casual (cl 35.2): ${$(f3.hourly)} × 2.25 = ${$(x(f3.hourly, 2.25))} an hour.`,
        `6 hours × ${$(x(f3.hourly, 2.25))} = ${$(roundCents(x(f3.hourly, 2.25) * 6))} before tax and before any deduction for keep.`,
      ],
      outro: `If the same hours were feeding and watering stock, the Sunday rate falls to 150% for permanent staff and 175% for casuals — ${$(otCas)} an hour for Mia instead of ${$(x(f3.hourly, 2.25))}. A permanent FLH3 doing Monday to Saturday overtime gets ${$(ot)} an hour.`,
    },
    faqs: [
      ...commonFaqs(a),
      nmwFaq(f1, "FLH1 is the entry grade for a station hand, cook or offsider with less than 6 months' experience (cl 31.1)."),
      {
        q: "What does 'with keep' mean in the Pastoral Award?",
        a: "If the employer provides keep (board and lodging), they may deduct up to $165.86 a week from the employee's total weekly wages (cl 32.3). Overtime and public holiday rates are calculated on the ordinary hourly rate before that deduction, not on the wage after it (cl 35.4).",
      },
      {
        q: "Are shearers covered by these rates?",
        a: "No. Shearers, crutchers and woolpressers are piece-rate workers paid per sheep shorn or per bale, with rates and methods set out in Part 9 of the award and Schedule A. The hourly rates on this page are for farm and livestock hands under Part 6 only.",
      },
      {
        q: "Is there a Sunday or Saturday penalty rate in the Pastoral Award?",
        a: "Not for ordinary hours. Ordinary hours are agreed between employer and employees and average no more than 38 a week over 4 weeks (cl 34.1). Time beyond ordinary hours is overtime: 150% Monday to Saturday, 150% on a Sunday for feeding and watering stock, and 200% on a Sunday for other work. Casuals add 25 percentage points.",
      },
      {
        q: "What is a station cook paid?",
        a: `A station cook is classified at FLH1 for the first 6 months (${$(f1.hourly)} an hour) and FLH2 after that. A cook who works more than 5.5 days a week is paid an additional 3/22 of the weekly rate for 6 full days, 3/11 for 6 and a half days or 9/22 for 7 days instead of hourly overtime (cl 34.3). At FLH1 that is $133.38, $266.75 and $400.13 a week.`,
      },
      {
        q: "What is the minimum pay for a farm hand under 20?",
        a: `Juniors are paid a percentage of the adult rate by age: 50% under 16, 60% at 16, 70% at 17, 80% at 18 and 90% at 19, with the adult rate from 20 (cl 32.2). At FLH1 a 16-year-old earns ${$(roundCents((f1.weekly * 0.6) / 38))} an hour.`,
      },
    ],
  };
}

// -----------------------------------------------------------------------------

function horticulture(): AwardPageCopy {
  const a = MODERN_AWARDS.horticulture;
  const l1 = level("horticulture", "Level 1");
  const l2 = level("horticulture", "Level 2");
  const l5 = level("horticulture", "Level 5");
  const cas1 = casual(a, l1.hourly);
  return {
    slug: "horticulture-award-rates",
    crumb: "Horticulture Award Rates",
    title: `Horticulture Award Pay Rates ${FY} (${a.meta.code}) — Picker Hourly Rates`,
    description: fitDescription(
      `Horticulture Award (MA000028) hourly rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)}/hr to Level 5 ${$(l5.hourly)}/hr, casual ${$(cas1)}. Piece rate rules explained.`,
      `Horticulture Award MA000028 rates: Level 1 ${$(l1.hourly)}/hr, casual ${$(cas1)}, to Level 5 ${$(l5.hourly)}. How piece rates and the 15% rule work.`,
    ),
    h1: `Horticulture Award Pay Rates ${FY}`,
    standfirst: `Hourly rates for Levels 1 to 5 under the ${a.meta.name} (${a.meta.code}), operative from ${a.meta.operativeFrom} — and what a piece rate must still guarantee for fruit and vegetable pickers.`,
    directAnswer: `A Level 1 horticulture worker (including a fruit or vegetable picker) earns at least ${$(l1.hourly)} an hour (${$(l1.weekly)} a week), or ${$(cas1)} as a casual. Level 2 is ${$(l2.hourly)}, rising to ${$(l5.hourly)} at Level 5. If paid by piece rate, an average-productivity picker must earn at least 15% more than the hourly rate and every worker must receive at least their hourly rate for each hour worked. Public holidays are 200% (casuals 225%).`,
    trap: {
      heading: "Piecework is allowed — but the hourly rate is a floor you cannot be paid below",
      body: `An employer may pay full-time, part-time or casual horticulture workers a piece rate (cl 15.2). The award does not set the dollars per bucket, punnet or kilogram: the employer must fix a piece rate so that a competent worker (one with at least 76 hours' experience of the task) working at average productivity earns at least 15% more per hour than the hourly rate for their level, including the 25% casual loading for a casual. For a casual Level 1 picker the hourly rate is ${$(cas1)}, so average productivity must produce at least ${$(roundCents(cas1 * 1.15))} an hour. Whatever your piece rate yields, you must receive at least the hourly rate multiplied by the hours worked each day (cl 15.2(f)), and the employer must give you a written piecework record before you start. Overtime and the ordinary hours clauses do not apply to a pieceworker.`,
    },
    workedExample: {
      heading: "Worked example: a casual picker on piece rate versus the hourly floor",
      intro: `Ahmed is a casual Level 1 picker. His hourly rate including the 25% loading is ${$(cas1)} (${$(l1.hourly)} × 1.25). On a 7-hour day he picks and is paid by the kilogram.`,
      steps: [
        `The floor for the day is ${$(cas1)} × 7 hours = ${$(roundCents(cas1 * 7))}. If his piece-rate earnings come to less, the employer must top him up to this amount (cl 15.2(f)).`,
        `The piece rate itself must be set so that an average-productivity competent picker earns at least ${$(roundCents(cas1 * 1.15))} an hour (115% of ${$(cas1)}), which is ${$(roundCents(cas1 * 1.15 * 7))} over 7 hours.`,
        `If the same day were a public holiday and Ahmed were on the hourly rate, it would be paid at 225% of ${$(l1.hourly)}: ${$(x(l1.hourly, 2.25))} an hour, ${$(roundCents(x(l1.hourly, 2.25) * 7))} for 7 hours. A pieceworker is paid 200% of the piece rate on a public holiday (cl 27.3).`,
      ],
      outro: "Slow days, poor crops or a new task can push earnings below the 15% target, but never below the hourly floor. The award requires the employer to keep a record of hours and the piece rate in force for each pieceworker.",
    },
    faqs: [
      ...commonFaqs(a),
      nmwFaq(l1, "Level 1 is a new employee's grade and progresses to Level 2 after no more than 3 months' industry experience (Schedule A.1)."),
      {
        q: "What is the minimum hourly rate for fruit picking?",
        a: `A Level 1 worker, which includes fruit and vegetable picking, thinning and pruning, is paid at least ${$(l1.hourly)} an hour, or ${$(cas1)} as a casual, from ${a.meta.operativeFrom}. Level 2 applies once the worker has 3 months' industry experience. Junior rates apply to workers under 20.`,
      },
      {
        q: "How do piece rates work under the Horticulture Award?",
        a: "The employer chooses the piece rate (per bucket, punnet, kilogram or similar) but must set it so that a competent worker at average productivity earns at least 15% more per hour than the minimum hourly rate (cl 15.2(d)). Competent means at least 76 hours' experience at the task. Every pieceworker must also be paid at least their hourly rate for each hour worked on the day, and must be given a signed written piecework record before starting.",
      },
      {
        q: "Is there a casual loading on top of a piece rate?",
        a: "For a casual pieceworker the 25% casual loading is built into the hourly rate used for the 15% test and the daily floor (cl 15.2(a)(ii), 15.2(f)). It is not added separately to the piece rate itself.",
      },
      {
        q: "Do horticulture workers get weekend penalty rates?",
        a: "Not for ordinary hours. Ordinary hours for full-time and part-time workers run Monday to Friday, or Monday to Saturday by agreement, and casuals can be rostered any day between 5.00 am and 8.30 pm at the same casual rate. Overtime is 150% Monday to Saturday and 200% on a Sunday outside the harvest period, with a minimum of 3 hours on a Sunday (cl 21.3).",
      },
      {
        q: "What are the horticulture casual night rates?",
        a: `A casual's ordinary hours between 8.31 pm and 4.59 am carry a further 15% loading on top of the 25%, making ${$(x(l1.hourly, 1.4))} an hour at Level 1 (cl 13.2(d)).`,
      },
      {
        q: "Are backpackers and working holiday makers covered?",
        a: "Yes. The award covers employees in horticulture regardless of visa status, and the minimum rates and piecework protections apply to everyone. Employees who are underpaid can use the Fair Work Ombudsman's complaint process or our backpay calculator to estimate what is owed.",
      },
    ],
  };
}

// -----------------------------------------------------------------------------

function healthProfessionals(): AwardPageCopy {
  const a = MODERN_AWARDS["health-professionals"];
  const ss1 = level("health-professionals", "Support Services Level 1");
  const ss4 = level("health-professionals", "Support Services Level 4");
  const hp7 = level("health-professionals", "Health Professional Level 1 — AQF 7, 1st year");
  const hp7top = level("health-professionals", "Health Professional Level 1 — AQF 7, 7th year+");
  const hp9 = level("health-professionals", "Health Professional Level 1 — AQF 9, 1st year");
  const l4 = level("health-professionals", "Health Professional Level 4");
  const satCas = x(hp7.hourly, 1.75);
  const otFirst = roundCents(casual(a, hp7.hourly) * 1.5);
  return {
    slug: "health-professionals-award-rates",
    crumb: "Health Professionals Award Rates",
    title: `Health Professionals Award Pay Rates ${FY} (${a.meta.code})`,
    description: fitDescription(
      `Health Professionals and Support Services Award (MA000027): new AQF rates from 1 Oct 2026 (AQF 7 graduate ${$(hp7.hourly)}/hr), support services ${$(ss1.hourly)}+/hr, casual and weekend rates.`,
      `Health Professionals Award MA000027: AQF 7 graduate ${$(hp7.hourly)}/hr from 1 Oct 2026, support services from ${$(ss1.hourly)}. Casual, weekend and overtime rates.`,
    ),
    h1: `Health Professionals Award Pay Rates ${FY}`,
    standfirst: `Hourly rates for Support Services employees (Levels 1–9) and the new Health Professional classification structure (AQF 5–9 and Levels 2–4) under the ${a.meta.name} (${a.meta.code}), consolidated to 1 October 2026.`,
    directAnswer: `From the first full pay period on or after 1 October 2026, a Health Professional Level 1 at AQF 7 (for example a physiotherapist or occupational therapist) is paid at least ${$(hp7.hourly)} an hour (${$(hp7.weekly)} a week) in the 1st year, rising to ${$(hp7top.hourly)} from the 7th year; an AQF 9 first-year professional is ${$(hp9.hourly)} and a Level 4 manager ${$(l4.hourly)}. Support Services Level 1 is ${$(ss1.hourly)} (rates from 1 July 2026). Weekends are 150% (casuals 175%) and public holidays 250% (casuals 275%).`,
    trap: {
      heading: "The Health Professional table changed on 1 October 2026 — and it is only stage one",
      body: `Determination PR814029 substituted clause 17 from the first full pay period starting on or after 1 October 2026. Health professionals are now paid by the AQF level of their profession's standard minimum qualification (AQF 5 to 9) and years of experience in the profession, plus Levels 2.1, 2.2, 3 and 4. The increase is phased: further stages take effect on 30 June in each of 2027, 2028, 2029 and 2030, so the table below is the first-stage rate, not where it will end up. If you were classified as a Health Professional employee on 30 September 2026, you are translated into the new structure under clause J.4 and cannot be paid less than your old rate. Support Services rates (Levels 1–9) were not changed by this variation and are the 1 July 2026 rates. Dental assistants and pathology collectors at some levels have separate transitional rates to 31 December 2026 and are not in the Support Services rows.`,
    },
    workedExample: {
      heading: "Worked example: a casual AQF 7 physio on a Saturday and in overtime",
      intro: `Priya is a casual health professional at Level 1, AQF 7, first year: ${$(hp7.hourly)} an hour minimum (${$(casual(a, hp7.hourly))} as a casual).`,
      steps: [
        `Saturday ordinary hours: a casual is paid 175% of the minimum rate for all time worked and does NOT also get the 25% loading (cl 26.1(b)). ${$(hp7.hourly)} × 1.75 = ${$(satCas)} an hour. A permanent employee is paid 150%: ${$(x(hp7.hourly, 1.5))}.`,
        `Weekday overtime, first 2 hours: for a casual, the 25% loading is added first and then 150% is applied to that, so ${$(casual(a, hp7.hourly))} × 1.5 = ${$(otFirst)} an hour (cl 25.3).`,
        `So 4 hours on a Saturday is ${$(roundCents(satCas * 4))} before tax, a higher hourly rate than 2 hours of weekday overtime.`,
      ],
      outro: "The weekend rate is flat 150% for all ordinary hours between midnight Friday and midnight Sunday (casuals 175%), and overtime rates are paid in place of the weekend penalty, not on top of it.",
    },
    faqs: [
      ...commonFaqs(a).slice(0, -1),
      {
        q: "What changed in the Health Professionals Award on 1 October 2026?",
        a: "Clause 17 was replaced (determination PR814029, decision [2026] FWCFB 231). Health Professional Level 1 is now paid by the AQF level of the profession's standard minimum qualification (5 to 9) and by year of experience (1st, 2nd–3rd, 4th–6th, 7th year or more); Level 2 splits into 2.1 and 2.2, and Levels 3 and 4 have new rates. Employees classified under the old levels on 30 September 2026 are translated under clause J.4 and never receive less than their old rate. Further increases follow on 30 June 2027 to 2030.",
      },
      {
        q: "What does a physiotherapist or occupational therapist earn under the award?",
        a: `Physiotherapists and occupational therapists sit at AQF 7 (a 3-year degree entry translates under J.4.1(e)). From 1 October 2026 the minimum rate is ${$(hp7.hourly)} an hour (${$(hp7.weekly)} a week) in the first year, ${$(level("health-professionals", "Health Professional Level 1 — AQF 7, 2nd–3rd year").hourly)} in years 2–3, ${$(level("health-professionals", "Health Professional Level 1 — AQF 7, 4th–6th year").hourly)} in years 4–6 and ${$(hp7top.hourly)} from year 7. See the physiotherapist and occupational therapist pay pages for annual figures.`,
      },
      {
        q: "What does a psychologist earn under the award?",
        a: `Psychologists are classified at AQF 9. From 1 October 2026 the minimum is ${$(hp9.hourly)} an hour (${$(hp9.weekly)} a week) in the first year, up to ${$(level("health-professionals", "Health Professional Level 1 — AQF 9, 7th year+").hourly)} an hour from the 7th year. Most psychologists in private practice or under an enterprise agreement or State public sector agreement are paid more than the award minimum.`,
      },
      {
        q: "What is the Support Services Level 1 rate?",
        a: `Support Services Level 1 is ${$(ss1.hourly)} an hour (${$(ss1.weekly)} a week), ${$(casual(a, ss1.hourly))} as a casual, from 1 July 2026. Level 4 is ${$(ss4.hourly)}. Level 8 and Level 9 each have three pay points; progression is by annual movement for full-time staff or after 1,824 hours of similar experience for part-time and casual staff (cl 16.1).`,
      },
      {
        q: "Do casuals get penalty rates under the Health Professionals Award?",
        a: `Yes, but they are calculated differently. A casual who works a Saturday or Sunday is paid 175% of the minimum rate for all time worked, with no extra 25% loading. A casual public holiday is 275%. Casual overtime applies the percentage to the casual rate, so 150% becomes 187.5% and 200% becomes 250% of the minimum rate. For an AQF 7 first-year casual that is ${$(satCas)} on a weekend and ${$(otFirst)} for the first 2 hours of overtime.`,
      },
      {
        q: "Are these rates what I will be paid?",
        a: "Not necessarily. Many health professionals are covered by an enterprise agreement or a State public sector award or agreement that pays more. The award is the minimum safety net. The first-stage 1 October 2026 rates are also lower than the later phase-in stages, and a higher existing rate is protected by clause J.4.",
      },
      {
        q: "When did the new rates start?",
        a: "Support Services rates apply from the first full pay period starting on or after 1 July 2026 (determination PR799308, following the Annual Wage Review 2026). Health Professional rates apply from the first full pay period starting on or after 1 October 2026 (PR814029). If your pay period began before the relevant date, the old rate applies for that whole pay period.",
      },
    ],
    related: {
      heading: "Pay pages for the health professions covered by this award",
      body: [
        "The award sets the minimum. For what specific professions earn by year of experience, with hourly, weekly and annual pay and take-home figures, see the pay pages below, and the news explainer on the 1 October 2026 change.",
      ],
      links: [
        { href: "/job-pay-rates/physiotherapist/", label: "Physiotherapist pay rates", note: "AQF 7 pay by year of experience" },
        { href: "/job-pay-rates/occupational-therapist/", label: "Occupational therapist pay rates", note: "AQF 7 pay by year of experience" },
        { href: "/job-pay-rates/psychologist/", label: "Psychologist pay rates", note: "AQF 9 pay by year of experience" },
        { href: "/job-pay-rates/dental-assistant/", label: "Dental assistant pay rates", note: "Support Services transitional rates" },
        { href: "/news/health-professionals-award-changes-october-2026/", label: "Health Professionals Award changes from 1 October 2026", note: "What changed and who is affected" },
      ],
    },
  };
}

// -----------------------------------------------------------------------------

function timber(): AwardPageCopy {
  const a = MODERN_AWARDS.timber;
  const g1 = level("timber", "General Timber — Level 1");
  const g4 = level("timber", "General Timber — Level 4");
  const g7 = level("timber", "General Timber — Level 7");
  const p1 = level("timber", "Pulp and Paper — Level 1");
  const p9 = level("timber", "Pulp and Paper — Level 9");
  const cas = casual(a, g4.hourly);
  const otCas = roundCents(cas * 1.5);
  return {
    slug: "timber-award-rates",
    crumb: "Timber Award Rates",
    title: `Timber Industry Award Pay Rates ${FY} (${a.meta.code})`,
    description: fitDescription(
      `Timber Industry Award (MA000071) rates from ${a.meta.operativeFrom}: General Timber Level 1 ${$(g1.hourly)}/hr to Level 7 ${$(g7.hourly)}/hr, plus furniture and pulp & paper streams. Casual, weekend, overtime.`,
      `Timber Industry Award MA000071 rates: ${$(g1.hourly)}–${$(p9.hourly)}/hr across three streams, with casual, weekend and overtime rates.`,
    ),
    h1: `Timber Industry Award Pay Rates ${FY}`,
    standfirst: `Every classification rate in the General Timber, Wood and Timber Furniture and Pulp and Paper streams of the ${a.meta.name} (${a.meta.code}), operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A General Timber Level 1 worker earns at least ${$(g1.hourly)} an hour (${$(g1.weekly)} a week), or ${$(casual(a, g1.hourly))} as a casual; Level 4 is ${$(g4.hourly)} and Level 7 ${$(g7.hourly)}. Pulp and Paper starts higher: Level 1 is ${$(p1.hourly)}, up to ${$(p9.hourly)} at Level 9. Saturday is 150% for the first 2 hours then 200%, Sunday 200% and public holidays 250% (General Timber casuals 275%).`,
    trap: {
      heading: "Find your stream first: the three tables are different",
      body: `The Timber Industry Award has separate minimum rates for the General Timber stream, the Wood and Timber Furniture stream (which adds a Level 4A) and the Pulp and Paper stream (nine levels, starting at ${$(p1.hourly)} rather than ${$(g1.hourly)}). The casual public holiday rate of 275% is tabulated only for the General Timber stream (cl 27.1(d)), and casual day workers are paid casual overtime rates — not weekend penalty rates — for Saturday and Sunday work unless ordinary weekend hours have been agreed. Forest work and low loader allowances are paid for all purposes and are not in the rate tables.`,
    },
    workedExample: {
      heading: "Worked example: a casual Level 4 sawmill worker on overtime",
      intro: `Tom is a casual General Timber Level 4 (${$(g4.hourly)} an hour minimum). His casual ordinary rate is ${$(cas)} (the minimum plus 25%). He works 3 hours beyond the ordinary daily hours on a Wednesday.`,
      steps: [
        `A casual's overtime percentages apply to the casual rate (cl 12.3, Schedule D.3.3). First 2 hours at 150%: ${$(cas)} × 1.5 = ${$(otCas)} an hour → ${$(roundCents(otCas * 2))}.`,
        `The third hour at 200%: ${$(cas)} × 2 = ${$(roundCents(cas * 2))}.`,
        `Total: ${$(roundCents(otCas * 2 + cas * 2))} before tax. A permanent Level 4 doing the same overtime would earn ${$(x(g4.hourly, 1.5))} an hour for 2 hours and ${$(x(g4.hourly, 2))} for the third.`,
      ],
      outro: "Casual overtime in this award is the casual rate times the overtime percentage, so it compounds: 150% becomes 187.5% and 200% becomes 250% of the minimum rate.",
    },
    faqs: [
      ...commonFaqs(a),
      nmwFaq(g1, "Level 1 is an induction grade, with a term of up to 3 months unless extended under Schedule A."),
      {
        q: "What are the three streams in the Timber Award?",
        a: "The award has a General Timber stream (Schedule A), a Wood and Timber Furniture stream (Schedule B) and a Pulp and Paper stream (Schedule C). Each has its own classification definitions and its own minimum rate table in cl 20.1, and the Furniture stream adds a Level 4A.",
      },
      {
        q: "What are Timber Award weekend rates?",
        a: `For weekly employees (not casuals), Saturday is 150% for the first 2 hours and 200% after, with a 3-hour minimum, and Sunday is 200% with a 3-hour minimum (cl 27.1). At General Timber Level 4 that is ${$(x(g4.hourly, 1.5))}, ${$(x(g4.hourly, 2))} and ${$(x(g4.hourly, 2))}. Pulp and Paper employees working Sunday get 200% for a minimum 4 hours (cl 27.3(c)(ii)).`,
      },
      {
        q: "What is the Timber Award public holiday rate?",
        a: `250% of the ordinary hourly rate for all work, with a minimum 3 hours (cl 27.1(c)). A General Timber casual is paid 275%, the 250% plus the 25% loading (cl 27.1(d)): ${$(x(g4.hourly, 2.75))} an hour at Level 4. The award does not tabulate a casual public holiday rate for the other two streams.`,
      },
      {
        q: "What is the Timber Award forest work allowance?",
        a: "$35.81 a week for employees (other than pieceworkers) working in forests, paid for all purposes (cl 22.3). Because it is paid for all purposes it is part of the ordinary hourly rate that penalties and overtime are calculated on, so it raises those rates for the employees who get it.",
      },
      {
        q: "How are junior timber workers paid?",
        a: "An unapprenticed junior is paid a percentage of the Level 2 rate for their stream: age 16, 40%; 17, 55%; 18, 70%; 19, 85%; and 100% from 20, calculated in multiples of 5 cents (cl 20.6–20.7). Apprentices are paid a percentage of the Level 5 rate by year of apprenticeship (cl 20.3).",
      },
    ],
  };
}

// -----------------------------------------------------------------------------

function meatIndustry(): AwardPageCopy {
  const a = MODERN_AWARDS["meat-industry"];
  const m1 = level("meat-industry", "MI 1");
  const m4 = level("meat-industry", "MI 4");
  const m7 = level("meat-industry", "MI 7");
  const m8 = level("meat-industry", "MI 8");
  return {
    slug: "meat-industry-award-rates",
    crumb: "Meat Industry Award Rates",
    title: `Meat Industry Award Pay Rates ${FY} (${a.meta.code}) — MI 1 to MI 8`,
    description: fitDescription(
      `Meat Industry Award (MA000059) rates from ${a.meta.operativeFrom}: MI 1 ${$(m1.hourly)}/hr to MI 8 ${$(m8.hourly)}/hr. Casual loading, weekend rates by establishment type, overtime and junior rates.`,
      `Meat Industry Award MA000059 rates: MI 1 ${$(m1.hourly)} to MI 8 ${$(m8.hourly)} an hour. Casual, weekend and overtime rates by establishment type.`,
    ),
    h1: `Meat Industry Award Pay Rates ${FY}`,
    standfirst: `Every classification rate (MI 1 to MI 8) under the ${a.meta.name} (${a.meta.code}) for meat processing, manufacturing and retail establishments, operative from ${a.meta.operativeFrom}.`,
    directAnswer: `An MI 1 meat industry employee earns at least ${$(m1.hourly)} an hour (${$(m1.weekly)} a week), or ${$(casual(a, m1.hourly))} as a casual. MI 4 is ${$(m4.hourly)}, MI 7 (the tradesperson level) ${$(m7.hourly)} and MI 8 ${$(m8.hourly)}. Overtime is 150% for 3 hours then 200%, and the casual loading is not paid on overtime. Weekend rates depend on the type of establishment: in a processing plant Saturday and Sunday ordinary hours (if agreed) are 150% and 200%.`,
    trap: {
      heading: "Your weekend rate depends on the type of establishment — and casuals lose the loading on weekends",
      body: `The Meat Industry Award has three sets of ordinary hours and weekend rates. Meat processing establishments work ordinary hours Monday to Friday, with Saturday at 150% and Sunday at 200% only if agreed. Meat manufacturing establishments can work up to 4 ordinary hours on a Saturday at 125%. Meat retail (including retail staff of a processing or manufacturing business) is paid 125% on a Saturday and 150% on a Sunday. For a casual working a weekend, the weekend penalty is paid instead of the 25% loading, not on top of it, so a casual Saturday in retail is 125%, the same as a permanent employee.`,
    },
    workedExample: {
      heading: "Worked example: a casual MI 3 in a processing plant doing overtime",
      intro: `Jess is a casual MI 3 in a meat processing establishment. Her minimum rate is ${$(level("meat-industry", "MI 3").hourly)} an hour and her casual ordinary rate is ${$(casual(a, level("meat-industry", "MI 3").hourly))}. She works 5 hours beyond her ordinary hours on a Wednesday.`,
      steps: [
        `The casual loading is not paid on overtime (cl 22.1(c)), so overtime is worked out on the minimum rate: ${$(level("meat-industry", "MI 3").hourly)}.`,
        `The first 3 hours at 150%: ${$(level("meat-industry", "MI 3").hourly)} × 1.5 = ${$(x(level("meat-industry", "MI 3").hourly, 1.5))} an hour → ${$(roundCents(x(level("meat-industry", "MI 3").hourly, 1.5) * 3))}.`,
        `The next 2 hours at 200%: ${$(x(level("meat-industry", "MI 3").hourly, 2))} an hour → ${$(roundCents(x(level("meat-industry", "MI 3").hourly, 2) * 2))}.`,
        `Total: ${$(roundCents(x(level("meat-industry", "MI 3").hourly, 1.5) * 3 + x(level("meat-industry", "MI 3").hourly, 2) * 2))} before tax.`,
      ],
      outro: "A permanent MI 3 is paid exactly the same overtime rates, which is why the Meat award's casual overtime column matches the permanent one.",
    },
    faqs: [
      ...commonFaqs(a),
      nmwFaq(m1, "Check your classification in Schedule A: the award sets MI 1 as its lowest grade."),
      {
        q: "What are meat industry weekend penalty rates?",
        a: `In a meat processing establishment, ordinary hours may be worked on a Saturday (150%) and Sunday (200%) if agreed (cl 24.1): ${$(x(m1.hourly, 1.5))} and ${$(x(m1.hourly, 2))} at MI 1. In meat manufacturing, up to 4 ordinary hours on a Saturday are 125% (cl 24.2). In meat retail, Saturday is 125% and Sunday 150% (cl 24.3). Casuals receive the weekend rate instead of the 25% loading.`,
      },
      {
        q: "What is the meat industry public holiday rate?",
        a: "It differs by holiday. Employees, including casuals, who work on Christmas Day and Anzac Day are paid 200% of the minimum hourly rate for all time worked; on Good Friday 150% for the first 4 hours and 200% after; and on any other public holiday 150% for the first 2 hours and 200% after. For employees other than casuals those payments are in addition to the minimum rate for the day (cl 31.3). Because of that nuance this page does not publish a single dollar figure.",
      },
      {
        q: "What is MI 8 in the Meat Industry Award?",
        a: `MI 8 is the highest classification at ${$(m8.hourly)} an hour (${$(m8.weekly)} a week). The award's own processing and manufacturing penalty tables stop at MI 7, while the retail establishment tables include MI 8.`,
      },
      {
        q: "How much do meat industry juniors earn?",
        a: `Juniors are paid a percentage of the adult weekly rate for their classification: under 17, 50%; 17, 60%; 18, 75%; 19, 85%; adult rate from 20 (cl 16.2). Part-time and casual juniors are paid the percentage of the adult hourly rate instead, so the hourly figure can differ by a cent from the weekly-based figure on this page. At MI 1 an 18-year-old is paid about ${$(roundCents((m1.weekly * 0.75) / 38))} an hour.`,
      },
      {
        q: "What is the minimum engagement for casuals in the meat industry?",
        a: "4 hours on each day or shift (cl 12.3). Casual cleaners may be engaged for 2 hours and casual bookkeeping clerks for 3 hours (cl 12.2). A casual's ordinary hours cannot exceed 38 in a week.",
      },
    ],
  };
}

// -----------------------------------------------------------------------------

function commercialSales(): AwardPageCopy {
  const a = MODERN_AWARDS["commercial-sales"];
  const pt = level("commercial-sales", "Probationary Traveller");
  const mer = level("commercial-sales", "Merchandiser");
  const ct = level("commercial-sales", "Commercial Traveller / Advertising Sales Representative");
  const sat = x(ct.hourly, 1.5);
  return {
    slug: "commercial-sales-award-rates",
    crumb: "Commercial Sales Award Rates",
    title: `Commercial Sales Award Pay Rates ${FY} (${a.meta.code})`,
    description: fitDescription(
      `Commercial Sales Award (MA000083) rates from ${a.meta.operativeFrom}: commercial traveller / advertising sales rep ${$(ct.hourly)}/hr, merchandiser ${$(mer.hourly)}/hr. Casual, weekend and junior rates.`,
      `Commercial Sales Award MA000083: sales rep ${$(ct.hourly)}/hr, merchandiser ${$(mer.hourly)}/hr, casual, weekend and junior rates.`,
    ),
    h1: `Commercial Sales Award Pay Rates ${FY}`,
    standfirst: `Minimum rates for commercial travellers, merchandisers and advertising sales representatives under the ${a.meta.name} (${a.meta.code}), operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Commercial Traveller or Advertising Sales Representative earns at least ${$(ct.hourly)} an hour (${$(ct.weekly)} a week), or ${$(casual(a, ct.hourly))} as a casual. A Merchandiser is ${$(mer.hourly)} and a Probationary Traveller ${$(pt.hourly)}. Work after 6.00 pm Monday to Friday and on Saturday is 150% (casuals 175%), Sunday is 200% (casuals 225%) and public holidays 250% (casuals 275%).`,
    trap: {
      heading: "Check this award actually covers your job — it is an occupational award that often gives way",
      body: "The Commercial Sales Award covers only commercial travellers, merchandisers and advertising sales representatives, and only where no other modern award has a classification for the work. It does not cover employees under the Clerks—Private Sector Award, the Contract Call Centres Award or the Graphic Arts, Printing and Publishing Award, or anyone covered by an enterprise agreement. Many sales roles are paid by commission on top of a base; the award sets the minimum, and a commercial traveller cannot be paid solely by commission, salary or retainer lower than the award minimum (cl 15.4).",
    },
    workedExample: {
      heading: "Worked example: a sales rep's Saturday trade show",
      intro: `Chen is a full-time Commercial Traveller (${$(ct.hourly)} an hour) who works 8 hours on a Saturday at a trade show.`,
      steps: [
        `Saturday work is paid at 150% of the minimum hourly rate, with a minimum payment of 2 hours (cl 19.1(b)): ${$(ct.hourly)} × 1.5 = ${$(sat)} an hour.`,
        `8 hours × ${$(sat)} = ${$(roundCents(sat * 8))} before tax.`,
      ],
      outro: `A casual Commercial Traveller doing the same shift is paid 175% (${$(x(ct.hourly, 1.75))} an hour, ${$(roundCents(x(ct.hourly, 1.75) * 8))}). If Chen also travelled to the event on a public holiday, the travel time is paid at 150% with a 3-hour minimum (cl 25.4).`,
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "Who is covered by the Commercial Sales Award?",
        a: "Commercial travellers, merchandisers and advertising sales representatives, unless another modern award contains classifications that apply to them. It does not cover employees under the Clerks—Private Sector Award, the Contract Call Centres Award, or the Graphic Arts, Printing and Publishing Award, or those covered by a modern enterprise award, enterprise instrument or State reference public sector award (cl 4).",
      },
      {
        q: "What is a probationary traveller paid?",
        a: `A Probationary Traveller is paid ${$(pt.hourly)} an hour (${$(pt.weekly)} a week), which is 90% of the Commercial Traveller / Advertising Sales Representative weekly rate (cl 15.1).`,
      },
      {
        q: "Do commercial sales employees get weekend penalty rates?",
        a: `Yes. Ordinary hours can be worked on any day (cl 13.3), but any work after 6.00 pm Monday to Friday, on a Saturday or on a Sunday is paid at a higher rate: 150% on weekdays after 6 pm and on Saturday (minimum 2 hours on a Saturday), and 200% on a Sunday (minimum 3 hours). At ${$(ct.hourly)} an hour that is ${$(sat)} and ${$(x(ct.hourly, 2))}. Casuals are paid 175% and 225%.`,
      },
      {
        q: "What allowances do sales reps get?",
        a: "Employers must pay $1.00 a kilometre for the use of an employee's own car and $0.34 a kilometre for a motorcycle, a $66.55 weekend allowance for being away from home for a weekend, and $83.79 a week for 2 or more consecutive nights away from home. They must also reimburse reasonable expenses such as parking, accommodation and meals while away overnight (cl 17.2).",
      },
      {
        q: "What are the junior rates in the Commercial Sales Award?",
        a: `Juniors are paid a percentage of the Commercial Traveller / Advertising Sales Representative hourly rate: under 19, 67.5%; 19, 80%; 20, 90%; and the full rate from 21 (cl 15.3). That is ${$(roundCents(ct.hourly * 0.675))}, ${$(roundCents(ct.hourly * 0.8))} and ${$(roundCents(ct.hourly * 0.9))} an hour.`,
      },
    ],
  };
}

// -----------------------------------------------------------------------------

function mining(): AwardPageCopy {
  const a = MODERN_AWARDS.mining;
  const entry = level("mining", "Entry level (Introductory)");
  const l3 = level("mining", "Level 3 (Competent)");
  const l7 = level("mining", "Level 7 (Dual trade instrumentation)");
  const cas3 = casual(a, l3.hourly);
  return {
    slug: "mining-award-rates",
    crumb: "Mining Award Rates",
    title: `Mining Award Pay Rates ${FY} (${a.meta.code}) — Entry to Level 7`,
    description: fitDescription(
      `Mining Industry Award (MA000011) rates from ${a.meta.operativeFrom}: entry ${$(entry.hourly)}/hr to Level 7 ${$(l7.hourly)}/hr incl. industry allowance. Shift, weekend, casual and overtime rates.`,
      `Mining Industry Award MA000011 rates: ${$(entry.hourly)}–${$(l7.hourly)}/hr incl. industry allowance, with shift, weekend, casual and overtime rates.`,
    ),
    h1: `Mining Award Pay Rates ${FY}`,
    standfirst: `Ordinary hourly rates for every classification under the ${a.meta.name} (${a.meta.code}), with the $41.41 industry allowance built in — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `An entry-level mining employee earns ${$(entry.hourly)} an hour (${$(entry.weekly)} a week) including the industry allowance, or ${$(casual(a, entry.hourly))} as a casual. Level 3 (competent) is ${$(l3.hourly)}, rising to ${$(l7.hourly)} at Level 7. Afternoon and night shifts are 115%, permanent night 130%, Saturday before noon 150% for 3 hours then 200%, and Sunday and public holidays 200% and 250%. For casuals every percentage applies to the casual rate.`,
    trap: {
      heading: "The award's table is not what you are paid: the industry allowance is part of the rate",
      body: `The weekly rates in clause 15.1 are minimum classification rates ($1,119.10 at Level 3). The $41.41 weekly industry allowance (cl 18.2(b)) is paid for all purposes, so it is part of the ordinary hourly rate that every shift, weekend, overtime and public holiday percentage is applied to: Level 3 is ${$(l3.hourly)} an hour here, not $29.45. The electrician's licence allowance ($50.92 a week) is also all-purpose but is not in these rows. For casuals every percentage in the award is applied to the CASUAL rate (${$(cas3)} at Level 3), which is why a casual Sunday at 200% of the casual rate is ${$(x(cas3, 2))}, or 250% of the permanent rate.`,
    },
    workedExample: {
      heading: "Worked example: a Level 3 operator's Saturday and Sunday",
      intro: `Lee is a permanent Level 3 operator (${$(l3.hourly)} ordinary hourly rate including the industry allowance: $1,119.10 + $41.41 = ${$(l3.weekly)} a week, divided by 38). He works 6 hours on a Saturday morning, then 8 hours on Sunday.`,
      steps: [
        `Saturday before noon: the first 3 hours at 150%, ${$(l3.hourly)} × 1.5 = ${$(x(l3.hourly, 1.5))} → ${$(roundCents(x(l3.hourly, 1.5) * 3))}.`,
        `The next 3 hours at 200%: ${$(x(l3.hourly, 2))} → ${$(roundCents(x(l3.hourly, 2) * 3))}.`,
        `Sunday: all hours at 200%, 8 × ${$(x(l3.hourly, 2))} = ${$(roundCents(x(l3.hourly, 2) * 8))}.`,
        `Total for the weekend: ${$(roundCents(x(l3.hourly, 1.5) * 3 + x(l3.hourly, 2) * 3 + x(l3.hourly, 2) * 8))} before tax.`,
      ],
      outro: "For FIFO workers on rostered 12-hour shifts, see the FIFO pay guide: much of FIFO pay is set by an enterprise agreement above these award rates.",
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "How much does a miner earn under the Mining Award?",
        a: `An entry-level mining employee earns ${$(entry.hourly)} an hour and a Level 3 (competent) operator ${$(l3.hourly)}, rising to ${$(l7.hourly)} at Level 7 (dual trade instrumentation), all including the $41.41 industry allowance. Most large mines pay under enterprise agreements at considerably higher rates than the award minimum.`,
      },
      {
        q: "What is the Mining Award industry allowance?",
        a: "$41.41 a week, paid to all employees for all purposes (cl 18.2(b)). It recognises the location and nature of mining operations, clothing, dirt, wet, height, fumes, heat, cold, confined space and other disabilities. Because it is paid for all purposes it is included in the rate on which shift loadings, penalties and overtime are calculated.",
      },
      {
        q: "What are Mining Award shift and weekend rates?",
        a: `Afternoon and night shift is 115% and permanent night shift 130% (cl 21.2). Ordinary hours on a Saturday before noon are 150% for the first 3 hours and 200% after; all Saturday hours after noon and all Sunday hours are 200%; public holidays are 250% (cl 21.3). At Level 3 that is ${$(x(l3.hourly, 1.15))}, ${$(x(l3.hourly, 1.3))}, ${$(x(l3.hourly, 1.5))}, ${$(x(l3.hourly, 2))} and ${$(x(l3.hourly, 2.5))}.`,
      },
      {
        q: "What is the Mining Award overtime rate?",
        a: `150% for the first 3 hours, Monday to noon on Saturday, then 200%; 200% after noon on Saturday and all day Sunday; 250% on a public holiday; and 200% for continuous shiftworkers for all overtime (cl 20). A meal allowance of $22.04 applies on each occasion an employee is entitled to a rest break during overtime.`,
      },
      {
        q: "How are casuals paid in the Mining Award?",
        a: `A casual is paid the ordinary rate plus 25% (cl 11.2) and the loading is part of the all-purpose rate (cl 11.3). Every penalty and overtime percentage is then applied to that casual rate, so a casual Level 3 working a Sunday is paid 200% of ${$(cas3)}, or ${$(x(cas3, 2))} an hour. A casual must be engaged for at least 2 consecutive hours.`,
      },
    ],
    related: {
      heading: "FIFO, camp and roster pay beyond the award",
      body: [
        "The Mining Industry Award sets the safety net. Most mine and FIFO workers are paid under enterprise agreements, with rostered 12-hour shifts, camp conditions and different rates. The FIFO pay guide explains how those arrangements work and how to compare take-home pay.",
      ],
      links: [{ href: "/mining-fifo-pay-guide/", label: "Mining and FIFO pay guide", note: "How FIFO rosters and agreement rates work" }],
    },
  };
}

export const OCT2_BUILDERS = {
  plumbing,
  pastoral,
  horticulture,
  "health-professionals": healthProfessionals,
  timber,
  "meat-industry": meatIndustry,
  "commercial-sales": commercialSales,
  mining,
} as const;

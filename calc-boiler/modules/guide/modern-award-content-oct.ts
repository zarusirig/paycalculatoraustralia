// Page copy for the October 2026 award pages. Same contract as
// modern-award-content.ts: every figure is interpolated from
// lib/constants/modern-awards-oct.ts, so the title, description, FAQPage
// JSON-LD and visible copy cannot drift from the rate tables.
//
// Imported lazily by modern-award-content.ts (see its BUILDERS table).

import { fitDescription } from "@/lib/seo-title";
import { MODERN_AWARDS, findAwardRate, roundCents } from "@/lib/constants/modern-awards";
import { $, FY, casual, commonFaqs, type AwardPageCopy } from "@/modules/guide/modern-award-content";

const level = (key: keyof typeof MODERN_AWARDS, name: string) => findAwardRate(MODERN_AWARDS[key], name);
const x = (hourly: number, mult: number) => roundCents(hourly * mult);

// -----------------------------------------------------------------------------

function miscellaneous(): AwardPageCopy {
  const a = MODERN_AWARDS.miscellaneous;
  const l1 = level("miscellaneous", "Level 1");
  const l2 = level("miscellaneous", "Level 2");
  const l3 = level("miscellaneous", "Level 3");
  const l4 = level("miscellaneous", "Level 4");
  const satCasual = x(l2.hourly, 1.45);
  return {
    slug: "miscellaneous-award-rates",
    crumb: "Miscellaneous Award Rates",
    title: `Miscellaneous Award Pay Rates ${FY} (${a.meta.code}) — Levels 1–4`,
    description: fitDescription(
      `Miscellaneous Award (MA000104) rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)}/hr to Level 4 ${$(l4.hourly)}/hr. Casual, Saturday, Sunday, public holiday and overtime rates.`,
      `Miscellaneous Award MA000104 rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)} to Level 4 ${$(l4.hourly)} an hour, with casual, weekend and overtime rates.`,
    ),
    h1: `Miscellaneous Award Pay Rates ${FY}`,
    standfirst: `Every classification rate under the ${a.meta.name} (${a.meta.code}) — the safety-net award for employees no other modern award covers — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Level 1 employee under the Miscellaneous Award earns at least ${$(l1.hourly)} an hour (${$(l1.weekly)} a week), or ${$(casual(a, l1.hourly))} as a casual. Level 2 is ${$(l2.hourly)}, Level 3 ${$(l3.hourly)} and Level 4 ${$(l4.hourly)}. Saturday is 120% (casuals 145%), Sunday 150% (casuals 175%) and public holidays 250% for everyone.`,
    trap: {
      heading: "Check this is your award first — it only covers people no other award does",
      body: "The Miscellaneous Award is a catch-all. It covers employees in the four levels below who are not covered by any other modern award, and it excludes managerial and professional employees such as accountants, marketers, lawyers, HR and IT specialists (cl 4). If your job fits a specific industry award, that award applies instead and its rates are different. Use Fair Work's award finder if you are unsure.",
    },
    workedExample: {
      heading: "Worked example: a casual Level 2 employee on a Saturday",
      intro: `Priya is a casual Level 2 employee and works 6 ordinary hours on a Saturday. The Level 2 minimum rate is ${$(l2.hourly)} an hour.`,
      steps: [
        `Saturday ordinary hours are paid at 120% for a permanent employee. A casual's column is the permanent percentage plus the 25% loading, so 145% (Schedule A.2.1).`,
        `${$(l2.hourly)} × 145% = ${$(satCasual)} an hour.`,
        `6 hours × ${$(satCasual)} = ${$(roundCents(satCasual * 6))} before tax.`,
      ],
      outro: `A permanent Level 2 employee doing the same shift would earn ${$(x(l2.hourly, 1.2))} an hour, or ${$(roundCents(x(l2.hourly, 1.2) * 6))} for 6 hours.`,
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "Who is covered by the Miscellaneous Award?",
        a: "Employees in the Level 1 to Level 4 classifications who are not covered by any other modern award, throughout Australia (cl 4.1). It does not cover managerial or professional employees such as accountants, marketing, legal, human resources, public relations and IT specialists, or employees covered by an enterprise instrument or a modern enterprise award. It also covers on-hire employees where the labour hire employer is not covered by an award with a more suitable classification.",
      },
      {
        q: "What is the Miscellaneous Award Saturday and Sunday rate?",
        a: `Ordinary hours on a Saturday are paid at 120% of the minimum hourly rate for permanent employees and 145% for casuals — ${$(x(l1.hourly, 1.2))} and ${$(x(l1.hourly, 1.45))} at Level 1. Sunday is 150% (casuals 175%), or ${$(x(l1.hourly, 1.5))} and ${$(x(l1.hourly, 1.75))} at Level 1. Weekday hours outside 7.00 am to 7.00 pm are also 120% (casuals 145%).`,
      },
      {
        q: "What is the Miscellaneous Award overtime rate?",
        a: `150% of the minimum rate for the first 3 hours and 200% after that (${$(x(l1.hourly, 1.5))} and ${$(x(l1.hourly, 2))} at Level 1). Overtime on a public holiday is 250%. The casual loading is not paid on overtime, so casuals get the same overtime percentages as permanent staff.`,
      },
      {
        q: "What do the four levels mean?",
        a: "Level 1 is an employee employed for less than 3 months who is not doing Level 3 or 4 work; Level 2 is the same after at least 3 months; Level 3 is an employee with a trade qualification doing work that needs it; Level 4 has advanced trade qualifications or is a sub-professional (cl 12.1).",
      },
    ],
  };
}

// -----------------------------------------------------------------------------

function buildingConstruction(): AwardPageCopy {
  const a = MODERN_AWARDS["building-construction"];
  const l1a = level("building-construction", "Level 1(a) (CW/ECW 1)");
  const l3 = level("building-construction", "Level 3 (CW/ECW 3)");
  const l9 = level("building-construction", "Level 9 (ECW 9)");
  const resiL3 = roundCents((1119.1 + 53.72) / 38);
  const sat1 = x(l3.hourly, 1.5);
  const sat2 = x(l3.hourly, 2);
  const total = roundCents(sat1 * 2 + sat2 * 3);
  return {
    slug: "building-and-construction-award-rates",
    crumb: "Building & Construction Award Rates",
    title: `Building & Construction Award Pay Rates ${FY} (${a.meta.code})`,
    description: fitDescription(
      `Building and Construction General On-site Award (MA000020) rates from ${a.meta.operativeFrom}: ${$(l1a.hourly)}/hr at Level 1(a) to ${$(l9.hourly)}/hr at Level 9, with Saturday, Sunday and overtime rates.`,
      `Building and Construction Award MA000020 rates from ${a.meta.operativeFrom}: ${$(l1a.hourly)} to ${$(l9.hourly)} an hour, casual and weekend rates.`,
    ),
    h1: `Building and Construction Award Pay Rates ${FY}`,
    standfirst: `Hourly rates for every CW/ECW level under the ${a.meta.name} (${a.meta.code}) on a weekly hire basis, with the industry allowance built in — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Level 1(a) construction worker on weekly hire earns ${$(l1a.hourly)} an hour (${$(l1a.weekly)} a week), or ${$(casual(a, l1a.hourly))} as a casual, including the $67.15 weekly industry allowance. A Level 3 (the trade rate) is ${$(l3.hourly)}. Ordinary hours are Monday to Friday only: Saturday is overtime at 150% then 200%, Sunday is 200% and public holidays 250%.`,
    trap: {
      heading: "The award's rate table is not what you are paid — the allowance is on top, for all purposes",
      body: `The weekly rates in clause 19.1(a) are minimum classification rates only. The industry allowance of $67.15 a week (general building, civil and engineering construction; $53.72 for residential) is paid for all purposes, so it is part of the "ordinary hourly rate" that every penalty and overtime percentage applies to (cl 19.1(b), 19.3(b), 22.3). That is why a CW3 is ${$(l3.hourly)} an hour here, not the ${$(29.45)} in the award's table. Tradespeople who get tool allowances, and daily hire employees, are paid more again — see the notes below.`,
    },
    workedExample: {
      heading: "Worked example: a Level 3 carpenter's Saturday",
      intro: `Dan is a weekly hire CW3 in general building who is asked to work 5 hours on a Saturday. His ordinary hourly rate is ${$(l3.hourly)} (${$(1119.1)} + $67.15 = ${$(roundCents(1119.1 + 67.15))} a week, divided by 38). Ordinary hours are Monday to Friday, so Saturday is overtime.`,
      steps: [
        `First 2 hours at 150%: ${$(l3.hourly)} × 1.5 = ${$(sat1)} an hour → ${$(roundCents(sat1 * 2))}.`,
        `Next 3 hours at 200%: ${$(l3.hourly)} × 2 = ${$(sat2)} an hour → ${$(roundCents(sat2 * 3))}.`,
        `Total: ${$(total)} before tax. The minimum payment for Saturday overtime is 3 hours, so a short call-in still pays at least that.`,
      ],
      outro: "A carpenter or joiner also receives the $41.22 weekly tool allowance for all purposes, which lifts the ordinary rate and every percentage on top of it. See the carpenter pay page for the version with tools included.",
    },
    faqs: [
      {
        q: `What are the building and construction award pay rates for ${FY}?`,
        a: `On a weekly hire basis in general building, civil and metal and engineering construction, the ordinary hourly rate runs from ${$(l1a.hourly)} (Level 1(a), ${$(l1a.weekly)} a week) to ${$(l9.hourly)} (Level 9, ${$(l9.weekly)} a week). That is the cl 19.1(a) minimum weekly rate plus the $67.15 industry allowance, divided by 38. The rates apply from the first full pay period starting on or after ${a.meta.operativeFrom}.`,
      },
      ...commonFaqs(a).slice(1),
      {
        q: "What are weekend rates on a building site?",
        a: `Ordinary hours are Monday to Friday between 7.00 am and 6.00 pm (cl 16.1), so Saturday and Sunday work is paid as overtime. Saturday is 150% for the first 2 hours then 200% (all overtime after 12 noon is 200%), Sunday is 200% and a public holiday 250%. Casuals add the 25% loading: 175%, 225%, 225% and 275%. At Level 3 that is ${$(x(l3.hourly, 1.5))}, ${$(x(l3.hourly, 2))} and ${$(x(l3.hourly, 2.5))} for a permanent worker.`,
      },
      {
        q: "What is the residential industry allowance?",
        a: `Work on single or dual occupancy residential buildings that are not multi-storey attracts a $53.72 weekly industry allowance instead of $67.15 (cl 22.1(b), 22.2). At Level 3 on weekly hire that gives ${$(resiL3)} an hour instead of ${$(l3.hourly)}.`,
      },
      {
        q: "How is a daily hire employee's rate different?",
        a: "Daily hire employees (a tradesperson or labourer engaged by the day) carry a follow-the-job loading: the weekly rate plus allowances is multiplied by 52 over 50.4 before dividing by 38 (cl 19.3(a)), which compensates for time between jobs. We do not publish dollar figures for daily hire, so check your pay guide.",
      },
      {
        q: "How does this page differ from the construction and trades pay guide?",
        a: "This page is the award: the hourly rate for each CW/ECW level, with overtime and weekend multipliers. The construction and trades pay guide covers what tradies and apprentices actually earn, including apprentice wages and take-home pay. Use this page to check an hourly rate against the award, and the guide to see the bigger picture.",
      },
    ],
  };
}

// -----------------------------------------------------------------------------

function legalServices(): AwardPageCopy {
  const a = MODERN_AWARDS["legal-services"];
  const l1 = level("legal-services", "Level 1 — Legal clerical and administrative");
  const l2 = level("legal-services", "Level 2 — Legal clerical and administrative");
  const l5 = level("legal-services", "Level 5 — Legal clerical and administrative");
  const l6 = level("legal-services", "Level 6 — Law clerk");
  const ot1 = x(l2.hourly, 1.5);
  const ot2 = x(l2.hourly, 2);
  return {
    slug: "legal-services-award-rates",
    crumb: "Legal Services Award Rates",
    title: `Legal Services Award Pay Rates ${FY} (${a.meta.code}) — Levels 1–6`,
    description: fitDescription(
      `Legal Services Award (MA000116) rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)}/hr to law clerk ${$(l6.hourly)}/hr. Casual, overtime, shift and junior rates.`,
      `Legal Services Award MA000116 rates from ${a.meta.operativeFrom}: ${$(l1.hourly)} to ${$(l6.hourly)} an hour, with casual, overtime and shift rates.`,
    ),
    h1: `Legal Services Award Pay Rates ${FY}`,
    standfirst: `Every classification under the ${a.meta.name} (${a.meta.code}) — legal secretaries, receptionists, paralegals who are not graduates, law graduates and law clerks — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Level 1 legal clerical employee earns at least ${$(l1.hourly)} an hour (${$(l1.weekly)} a week), or ${$(casual(a, l1.hourly))} as a casual. Level 2 is ${$(l2.hourly)}, Level 5 ${$(l5.hourly)} (the same as a law graduate) and a Level 6 law clerk ${$(l6.hourly)}. Day workers have no weekend penalty rates — work outside Monday to Friday, 7.00 am to 6.30 pm, is overtime at 150% then 200%.`,
    trap: {
      heading: "For a day worker, a Saturday is overtime, not a penalty rate",
      body: `Ordinary hours for day workers are Monday to Friday between 7.00 am and 6.30 pm (cl 13.1). Anything outside that span, including all Saturday and Sunday work, is overtime: 150% for the first 3 hours and 200% after, or 200% flat after 12 noon on a Saturday and on a Sunday, with a 3-hour minimum. Shiftworkers have separate shift and weekend rates. Some employers pay an annualised salary instead; the award allows it (cl 17) but the salary must still cover what the award would give for the hours actually worked.`,
    },
    workedExample: {
      heading: "Worked example: a Level 2 legal clerical employee working back",
      intro: `Mei is a permanent Level 2 legal clerical employee (${$(l2.hourly)} an hour) who works until 9.30 pm on a Tuesday, 4 hours beyond her ordinary hours.`,
      steps: [
        `The first 3 hours of overtime are 150%: ${$(l2.hourly)} × 1.5 = ${$(ot1)} an hour → ${$(roundCents(ot1 * 3))}.`,
        `The 4th hour is 200%: ${$(l2.hourly)} × 2 = ${$(ot2)} → ${$(ot2)}.`,
        `Overtime for the evening: ${$(roundCents(ot1 * 3 + ot2))} before tax, on top of her ordinary pay. She is also entitled to a meal allowance of $20.75 if the overtime runs 1.5 hours past normal finishing time.`,
      ],
      outro: `A casual doing the same overtime is paid 175% for the first 3 hours (${$(x(l2.hourly, 1.75))} an hour) and 225% after (${$(x(l2.hourly, 2.25))}), because the casual loading is included in the overtime rate.`,
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "Do legal secretaries get penalty rates on weekends?",
        a: `Not as day workers. Their ordinary hours are Monday to Friday, 7.00 am to 6.30 pm, so weekend work is overtime: Saturday before noon is 150% for 3 hours then 200%, Saturday after noon and Sunday are 200%, with a 3-hour minimum, and public holidays 250%. Shiftworkers are paid 150% on a Saturday, 200% on a Sunday and 250% on a public holiday.`,
      },
      {
        q: "What is the law graduate rate?",
        a: `A Level 5 law graduate is paid the same minimum as a Level 5 legal clerical and administrative employee: ${$(l5.hourly)} an hour (${$(l5.weekly)} a week). The award sets special conditions for law graduates in cl 28. A Level 6 law clerk is ${$(l6.hourly)} an hour.`,
      },
      {
        q: "What are the Legal Services Award shift rates?",
        a: `Early morning shifts are 110% (casuals 135%), afternoon and night shifts 115% (casuals 140%) and permanent night shifts 130% (casuals 155%). At Level 1 that is ${$(x(l1.hourly, 1.1))}, ${$(x(l1.hourly, 1.15))} and ${$(x(l1.hourly, 1.3))} an hour for a permanent employee. Weekend and public holiday shift rates replace the shift loadings; they do not add to them.`,
      },
      {
        q: "What is the minimum engagement for a casual in a law firm?",
        a: "A casual must be paid for a minimum of 4 hours for each day they are engaged (cl 11.3).",
      },
    ],
  };
}

// -----------------------------------------------------------------------------

function electrical(): AwardPageCopy {
  const a = MODERN_AWARDS.electrical;
  const g1 = level("electrical", "Electrical worker grade 1");
  const g5 = level("electrical", "Electrical worker grade 5");
  const g10 = level("electrical", "Electrical worker grade 10");
  const ot1 = x(g5.hourly, 1.5);
  const ot2 = x(g5.hourly, 2);
  return {
    slug: "electrical-award-rates",
    crumb: "Electrical Award Rates",
    title: `Electrical Award Pay Rates ${FY} (${a.meta.code}) — Grades 1–10`,
    description: fitDescription(
      `Electrical, Electronic and Communications Contracting Award (MA000025) rates from ${a.meta.operativeFrom}: grade 1 ${$(g1.hourly)}/hr to grade 10 ${$(g10.hourly)}/hr. Casual, Sunday and overtime rates.`,
      `Electrical Award MA000025 rates from ${a.meta.operativeFrom}: grade 1 ${$(g1.hourly)} to grade 10 ${$(g10.hourly)} an hour, with casual and overtime rates.`,
    ),
    h1: `Electrical Award Pay Rates ${FY}`,
    standfirst: `Ordinary hourly rates for every grade under the ${a.meta.name} (${a.meta.code}) — electricians, electronics and communications workers, linesworkers and refrigeration tradespeople — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A grade 1 electrical worker is paid ${$(g1.hourly)} an hour (${$(g1.weekly)} a week), or ${$(casual(a, g1.hourly))} as a casual. A grade 5 tradesperson — the standard trade rate — is ${$(g5.hourly)} and a grade 10 is ${$(g10.hourly)}. These include the industry allowance (and the tool allowance from grade 5). Sunday work is 200% (casuals 250%), public holidays 250% (casuals 312.5%).`,
    trap: {
      heading: "The hourly rate you are paid is higher than the award's minimum rate table",
      body: `Clause 16.2 lists minimum rates ($29.45 an hour for a grade 5). But the award adds an all-purpose industry allowance of $41.41 a week to every grade and a $22.31 tool allowance from grade 5, and its ordinary hourly rate — the figure every penalty and overtime percentage applies to — includes both (Schedule B.2.1). So a grade 5 is ${$(g5.hourly)} an hour, not $29.45. Licensed electricians on an unrestricted licence get a further $40.29 a week all-purpose on top, which is not in the table.`,
    },
    workedExample: {
      heading: "Worked example: a grade 5 electrician's Saturday call-out",
      intro: `Sam is a permanent grade 5 electrician (ordinary hourly rate ${$(g5.hourly)}) asked to work 4 hours on a Saturday. His ordinary hours are Monday to Friday, so Saturday is overtime with a 4-hour minimum.`,
      steps: [
        `First 2 hours at 150%: ${$(g5.hourly)} × 1.5 = ${$(ot1)} an hour → ${$(roundCents(ot1 * 2))}.`,
        `Next 2 hours at 200%: ${$(g5.hourly)} × 2 = ${$(ot2)} an hour → ${$(roundCents(ot2 * 2))}.`,
        `Total: ${$(roundCents(ot1 * 2 + ot2 * 2))} before tax. Any further all-purpose allowance, such as an electrician's licence allowance, raises the base before the percentages are applied.`,
      ],
    },
    faqs: [
      {
        q: `What are the electrical award pay rates for ${FY}?`,
        a: `The ordinary hourly rate, which includes the industry allowance and (for grade 5 and above) the tool allowance, runs from ${$(g1.hourly)} an hour for grade 1 to ${$(g10.hourly)} for grade 10 (Schedule B.2.1). The bare minimum rates in cl 16.2 are $26.44 to $37.24 an hour. The rates apply from the first full pay period starting on or after ${a.meta.operativeFrom}.`,
      },
      ...commonFaqs(a).slice(1),
      {
        q: "What is the electrician's Sunday and public holiday rate?",
        a: `Work on a Sunday is paid at 200% of the ordinary hourly rate for a permanent employee and 250% for a casual; a public holiday is 250% and 312.5% (cl 20.4). At grade 5 that is ${$(x(g5.hourly, 2))} and ${$(x(g5.hourly, 2.5))} an hour permanent, and ${$(x(g5.hourly, 2.5))} and ${$(x(g5.hourly, 3.125))} casual. The minimum payment is 4 hours.`,
      },
      {
        q: "What do electrical apprentices earn?",
        a: "For apprentices who started on or after 1 January 2014 the rate is a percentage of the grade 5 minimum rate: 1st year 50% (55% if Year 12 is completed), 2nd year 60% (65%), 3rd year 70%, 4th year 82%, plus the tool allowance and part of the other all-purpose allowances (cl 16.4(a)(ii)). Adult apprentices start at 80% of grade 5 in the first year. We do not publish apprentice dollar rates here.",
      },
      {
        q: "Is the electrician's licence allowance in the table?",
        a: "No. The $40.29 weekly electrician's licence allowance (cl 18.3(b)) is paid to an electrical mechanic who holds, and may be required to use, an unrestricted licence. It is all-purpose, so it is added to the ordinary hourly rate before overtime and penalties. Leading hand, nominee and other all-purpose allowances work the same way.",
      },
    ],
  };
}

// -----------------------------------------------------------------------------

function fitness(): AwardPageCopy {
  const a = MODERN_AWARDS.fitness;
  const l1 = level("fitness", "Level 1");
  const l3 = level("fitness", "Level 3");
  const l5 = level("fitness", "Level 5");
  const l7 = level("fitness", "Level 7");
  const sunCas = x(l3.hourly, 1.3);
  const sunPerm = x(l3.hourly, 1.5);
  return {
    slug: "fitness-industry-award-rates",
    crumb: "Fitness Industry Award Rates",
    title: `Fitness Industry Award Pay Rates ${FY} (${a.meta.code}) — Levels 1–7`,
    description: fitDescription(
      `Fitness Industry Award (MA000094) rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)}/hr to Level 7 ${$(l7.hourly)}/hr. Casual, weekend, public holiday and overtime rates for gym, pool and coaching staff.`,
      `Fitness Industry Award MA000094 rates from ${a.meta.operativeFrom}: ${$(l1.hourly)} to ${$(l7.hourly)} an hour, with casual, weekend and overtime rates.`,
    ),
    h1: `Fitness Industry Award Pay Rates ${FY}`,
    standfirst: `Every classification rate under the ${a.meta.name} (${a.meta.code}) — gym and pool staff, instructors, fitness trainers, lifeguards, swimming and tennis coaches — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Level 1 fitness employee earns at least ${$(l1.hourly)} an hour (${$(l1.weekly)} a week), or ${$(casual(a, l1.hourly))} as a casual. A Level 5 fitness trainer is ${$(l5.hourly)}. Saturday is 125% and Sunday 150% for permanent staff, but casuals get a 30% loading on weekends (130%), so a casual's Sunday rate is below a permanent employee's.`,
    trap: {
      heading: "Casual weekend rates are lower than permanent weekend rates on Sundays",
      body: `The Fitness Industry Award sets the casual loading at 25% Monday to Friday and 30% on Saturday, Sunday and public holidays (cl 12.1). It does not add a penalty rate on top. So at Level 3 a casual earns ${$(sunCas)} an hour on a Sunday, while a permanent Level 3 earns ${$(sunPerm)} (150%). Neither casual loading is paid on overtime (cl 12.2). Check your payslip against the casual figures in the tables below.`,
    },
    workedExample: {
      heading: "Worked example: a casual and a permanent employee on a Sunday",
      intro: `Both Alex (casual) and Jo (permanent) are Level 3 employees (${$(l3.hourly)} an hour) and each works 4 ordinary hours on a Sunday.`,
      steps: [
        `Alex, casual: the loading on a Sunday is 30%, so ${$(l3.hourly)} × 130% = ${$(sunCas)} an hour → ${$(roundCents(sunCas * 4))}.`,
        `Jo, permanent: Sunday is 150%, so ${$(l3.hourly)} × 150% = ${$(sunPerm)} an hour → ${$(roundCents(sunPerm * 4))}.`,
        `Alex is paid ${$(roundCents(sunPerm * 4 - sunCas * 4))} less for the same 4 hours, because the casual loading is the only extra a casual receives and it replaces the leave and notice entitlements they do not get.`,
      ],
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "What is the Fitness Industry Award Saturday and Sunday rate?",
        a: `Permanent and part-time staff are paid 125% on a Saturday and 150% on a Sunday for ordinary hours — ${$(x(l1.hourly, 1.25))} and ${$(x(l1.hourly, 1.5))} at Level 1. Casuals are paid 130% on both days (${$(x(l1.hourly, 1.3))} at Level 1). Public holidays are 250% for permanent staff (${$(x(l1.hourly, 2.5))} at Level 1).`,
      },
      {
        q: "What casual rate applies on a public holiday?",
        a: "The award sends casuals working a public holiday to the 30% casual loading in cl 12.1(b) (cl 26.3(c)), and Schedule B.2 lists 130% for Saturday, Sunday and public holidays together. That is far below the 250% permanent rate, so confirm the figure with your pay guide or the Fair Work Infoline before relying on it. We do not print a public holiday dollar rate for casuals.",
      },
      {
        q: "What are overtime rates in the Fitness Industry Award?",
        a: `Overtime is 150% for the first 2 hours Monday to Saturday and 200% after that, 200% on Sunday and 250% on a public holiday — ${$(x(l1.hourly, 1.5))} and ${$(x(l1.hourly, 2))} at Level 1. Overtime is anything outside 5.00 am to 11.00 pm Monday to Friday and 6.00 am to 9.00 pm on weekends, over 10 hours a day, or over an average of 38 a week over 4 weeks.`,
      },
      {
        q: "Which level is a swimming teacher, lifeguard or personal trainer?",
        a: "A swim and water safety teacher with a qualification is at least Level 2, rising to Level 3 and 4 with teaching hours and further qualifications; a pool lifeguard is Level 3 and a senior pool lifeguard Level 4; a fitness trainer or fitness specialist holding an AQF Diploma is Level 5 (Schedule A). Disputes about swimming teacher or coach classification can go to the Fair Work Commission.",
      },
    ],
  };
}

// -----------------------------------------------------------------------------

function realEstate(): AwardPageCopy {
  const a = MODERN_AWARDS["real-estate"];
  const l1a = level("real-estate", "Level 1 (Associate) — first 12 months");
  const l1b = level("real-estate", "Level 1 (Associate) — after 12 months");
  const l2 = level("real-estate", "Level 2 (Representative)");
  const l4 = level("real-estate", "Level 4 (In-Charge)");
  const ph = x(l2.hourly, 2);
  return {
    slug: "real-estate-award-rates",
    crumb: "Real Estate Award Rates",
    title: `Real Estate Award Pay Rates ${FY} (${a.meta.code}) — Levels 1–4`,
    description: fitDescription(
      `Real Estate Industry Award (MA000106) rates from ${a.meta.operativeFrom}: Level 1 ${$(l1a.hourly)}/hr to Level 4 ${$(l4.hourly)}/hr. Casual, public holiday, overtime and junior rates, and the no-weekend-penalty rule.`,
      `Real Estate Industry Award MA000106 rates from ${a.meta.operativeFrom}: ${$(l1a.hourly)} to ${$(l4.hourly)} an hour, casual, public holiday and junior rates.`,
    ),
    h1: `Real Estate Award Pay Rates ${FY}`,
    standfirst: `Every classification under the ${a.meta.name} (${a.meta.code}) — property managers, sales and leasing staff, assistants and administrators in real estate agencies — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Level 1 (Associate) employee earns at least ${$(l1a.hourly)} an hour (${$(l1a.weekly)} a week) in their first 12 months and ${$(l1b.hourly)} after that; a casual earns 25% more. Level 2 is ${$(l2.hourly)}, Level 3 ${$(level("real-estate", "Level 3 (Supervisory)").hourly)} and Level 4 ${$(l4.hourly)}. There are no Saturday or Sunday penalty rates for ordinary hours; a public holiday is 200% (casuals 200% of their casual rate).`,
    trap: {
      heading: "No weekend penalty rates — but a rostered day off is paid at overtime rates",
      body: "Ordinary hours under the Real Estate Industry Award are 38 a week and can be worked on any day, so Saturday and Sunday open homes inside the week are paid at the ordinary rate. Only a public holiday (200%) or work on a rostered day off (150% for 2 hours, then 200%) pays more. And overtime is only payable for hours the employer specifically directed you to work — hours worked on your own initiative are not (cl 19.1(b)–(c)). Commission-only salespeople are outside these weekly rates entirely.",
    },
    workedExample: {
      heading: "Worked example: a Level 2 employee working a public holiday",
      intro: `Chris is a permanent Level 2 (Representative) employee (${$(l2.hourly)} an hour) who is directed to work a 4-hour shift on a public holiday.`,
      steps: [
        `Public holiday work is 200% of the minimum hourly rate: ${$(l2.hourly)} × 2 = ${$(ph)} an hour.`,
        `4 hours × ${$(ph)} = ${$(roundCents(ph * 4))} before tax. The minimum payment on a public holiday is 3 hours.`,
        `A casual at Level 2 is paid ${$(casual(a, l2.hourly))} an hour on an ordinary day and 200% of that, ${$(roundCents(casual(a, l2.hourly) * 2))}, on a public holiday.`,
      ],
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "Does the real estate award have weekend penalty rates?",
        a: "No. Ordinary hours are 38 a week and may be worked on any day of the week, averaged over up to 8 weeks (cl 13.1–13.2), so ordinary weekend hours are paid at the ordinary rate. Penalty-type rates apply only on public holidays (200%) and for work on a rostered day off (150% for the first 2 hours, 200% after).",
      },
      {
        q: "What is the commission-only rule in the Real Estate Award?",
        a: "A Level 2 or higher salesperson (property sales or commercial, industrial or retail leasing) who is not casual can agree to commission-only pay if they meet strict conditions: a written agreement, a real estate licence or registration, at least 12 consecutive months in sales or leasing in the past 3 years, aged 21 or over, and having met the minimum income threshold. The minimum commission-only rate is 31.5% of the employer's gross commission, and the weekly minimum rates do not apply (cl 16.7).",
      },
      {
        q: "How much is real estate overtime?",
        a: `Hours the employer specifically directs you to work beyond the ordinary hours, other than on a rostered day off, are paid at the ordinary hourly rate (100%; casuals 125%) — not at a penalty rate. On a rostered day or half day off the rate is 150% for the first 2 hours and 200% after, or ${$(x(l2.hourly, 1.5))} and ${$(x(l2.hourly, 2))} at Level 2.`,
      },
      {
        q: "What allowances do real estate staff get?",
        a: "Employees who use their own motor vehicle can claim $1.00 a kilometre up to 400 km a week as an alternative to the standing-charge scale, motorcycles are $0.34 a kilometre, and a mobile phone plan can be reimbursed up to $100 a month (cl 17). Engine-size standing charges and per-kilometre rates also apply; check cl 17.2.",
      },
    ],
  };
}

// -----------------------------------------------------------------------------

function localGovernment(): AwardPageCopy {
  const a = MODERN_AWARDS["local-government"];
  const l1 = level("local-government", "Level 1");
  const l3 = level("local-government", "Level 3");
  const l4 = level("local-government", "Level 4");
  const l11 = level("local-government", "Level 11");
  const sun = x(l3.hourly, 1.75);
  return {
    slug: "local-government-award-rates",
    crumb: "Local Government Award Rates",
    title: `Local Government Award Pay Rates ${FY} (${a.meta.code}) — Levels 1–11`,
    description: fitDescription(
      `Local Government Industry Award (MA000112) rates from ${a.meta.operativeFrom}: Level 1 ${$(l1.hourly)}/hr to Level 11 ${$(l11.hourly)}/hr. Casual, weekend, public holiday and overtime rates.`,
      `Local Government Award MA000112 rates from ${a.meta.operativeFrom}: ${$(l1.hourly)} to ${$(l11.hourly)} an hour, casual, weekend and overtime rates.`,
    ),
    h1: `Local Government Award Pay Rates ${FY}`,
    standfirst: `Every level under the ${a.meta.name} (${a.meta.code}) — council depot, library, customer service, parks, community and childcare staff — operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Level 1 council employee earns at least ${$(l1.hourly)} an hour (${$(l1.weekly)} a week), or ${$(casual(a, l1.hourly))} as a casual. Level 4 is ${$(l4.hourly)} and Level 11 ${$(l11.hourly)}. Saturday is 150% and Sunday 175% only for roles with weekend ordinary hours (airports, libraries, customer service, hospitality, cleaning and similar); everyone else's weekend work is overtime. Public holidays are 250%.`,
    trap: {
      heading: "Weekend penalty rates depend on your role, and many councils pay under an enterprise agreement",
      body: "Most council employees work Monday to Friday, 6.00 am to 6.00 pm, and anything outside that is overtime. Saturday 150% and Sunday 175% apply to ordinary hours worked in the specific roles listed in cl 13.1(e) to (g), and community services and recreation centre employees are not paid weekend penalties between 5.00 am and 10.00 pm (cl 22.3). If a council enterprise agreement covers you, it replaces this award, as long as it leaves you better off overall.",
    },
    workedExample: {
      heading: "Worked example: a library assistant on a Sunday",
      intro: `Nina is a permanent Level 3 library employee (${$(l3.hourly)} an hour) who works 5 ordinary hours on a Sunday. Library ordinary hours can be worked Monday to Sunday, 8.00 am to 9.00 pm (cl 13.1(f)), so the Sunday weekend penalty applies.`,
      steps: [
        `Sunday ordinary hours for a library employee are 175% (cl 22.2(a)(ii)): ${$(l3.hourly)} × 1.75 = ${$(sun)} an hour.`,
        `5 hours × ${$(sun)} = ${$(roundCents(sun * 5))} before tax.`,
        `A casual in the same role is paid 200% (the 175% plus the 25% loading), which is ${$(x(l3.hourly, 2))} an hour.`,
      ],
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "What are the Local Government Award weekend rates?",
        a: `For employees in the roles with weekend ordinary hours, Saturday is 150% and Sunday 175% for permanent staff (${$(x(l1.hourly, 1.5))} and ${$(x(l1.hourly, 1.75))} at Level 1), and 175% and 200% for casuals. Ordinary hours worked Monday to Friday outside the span for your role are 120% (casuals 145%). Everyone else works weekends as overtime.`,
      },
      {
        q: "What is local government overtime pay?",
        a: `150% of the minimum rate for the first 2 hours and 200% after that, Monday to Saturday before noon; 200% from noon on Saturday and all day Sunday; and 250% on a public holiday. The casual loading is not paid on overtime. A recalled employee is paid a minimum of 3 hours (cl 21.5).`,
      },
      {
        q: "What is the on-call allowance for council staff?",
        a: `An employee directed to be on call and who receives the on-call allowance is paid $29.45 a day Monday to Friday, $44.18 on a Saturday and $58.90 on a Sunday or public holiday (cl 19.2(e)), and is paid at overtime rates for time worked.`,
      },
      {
        q: "Is a council worker's casual public holiday rate 275%?",
        a: "The award's Schedule B does not list a casual public holiday rate, and the clauses leave it unclear whether the 25% casual loading is added. We therefore do not print one. Permanent staff are paid 250% for a public holiday. Check your enterprise agreement or the Fair Work pay guide.",
      },
    ],
  };
}

// -----------------------------------------------------------------------------

function livePerformance(): AwardPageCopy {
  const a = MODERN_AWARDS["live-performance"];
  const l1 = level("live-performance", "Level 1 — Production and Support Staff 1 (induction/training)");
  const l3 = level("live-performance", "Level 3 — Production and Support Staff 3");
  const l10 = level("live-performance", "Level 10 — Production and Support Staff 8");
  const sunCas = x(l3.hourly, 2.25);
  return {
    slug: "live-performance-award-rates",
    crumb: "Live Performance Award Rates",
    title: `Live Performance Award Pay Rates ${FY} (${a.meta.code}) — Crew`,
    description: fitDescription(
      `Live Performance Award (MA000081) hourly rates for production and support staff from ${a.meta.operativeFrom}: ${$(l1.hourly)}/hr to ${$(l10.hourly)}/hr. Casual, Sunday, midnight and overtime rates.`,
      `Live Performance Award MA000081 crew rates from ${a.meta.operativeFrom}: ${$(l1.hourly)} to ${$(l10.hourly)} an hour, casual, Sunday and overtime rates.`,
    ),
    h1: `Live Performance Award Pay Rates ${FY}`,
    standfirst: `Hourly rates for production and support staff — stagehands, riggers, lighting, sound and front-of-house crew — under the ${a.meta.name} (${a.meta.code}), operative from ${a.meta.operativeFrom}.`,
    directAnswer: `A Level 1 production and support employee earns at least ${$(l1.hourly)} an hour (${$(l1.weekly)} a week), or ${$(casual(a, l1.hourly))} as a casual. Level 4 is ${$(level("live-performance", "Level 4 — Production and Support Staff 4").hourly)} and the top hourly level, Level 10, ${$(l10.hourly)}. Sunday work, work between midnight and 7.00 am and public holidays are all 200% (casuals 225%).`,
    trap: {
      heading: "This page covers crew, not performers or musicians",
      body: "The Live Performance Award pays performers, company dancers and musicians by the week, performance or call (Parts 5 and 6) and publishes no hourly rate for them. Production and support staff are the classifications with hourly rates, and those are what this page tables. If you are an actor, dancer or musician, your rates are in those parts of the award, and an enterprise agreement, if one covers you, replaces the award.",
    },
    workedExample: {
      heading: "Worked example: a casual Level 3 crew member on a Sunday",
      intro: `Kai is a casual Level 3 production and support employee (${$(l3.hourly)} an hour) who works a 6-hour shift on a Sunday.`,
      steps: [
        `A weekly employee starting work on a Sunday is paid 200% for all time worked; a casual's rate is the loading added, so 225% (cl 63.4).`,
        `${$(l3.hourly)} × 225% = ${$(sunCas)} an hour.`,
        `6 hours × ${$(sunCas)} = ${$(roundCents(sunCas * 6))} before tax. The minimum payment on a Sunday is 4 hours.`,
      ],
    },
    faqs: [
      ...commonFaqs(a),
      {
        q: "What is the Live Performance Award Sunday rate?",
        a: `A full-time or part-time production employee who starts work on a Sunday is paid 200% of the minimum hourly rate for all time worked, including overtime, and a casual 225%, with a minimum payment of 4 hours (cl 63.4). At Level 3 that is ${$(x(l3.hourly, 2))} and ${$(sunCas)} an hour. There is no separate Saturday penalty rate.`,
      },
      {
        q: "What is the late-night rate in the Live Performance Award?",
        a: `All work between midnight and 7.00 am is paid at 200% for permanent staff and 225% for casuals, unless the employee is a cleaner rostered to those hours (20% loading) (cl 63.3(c), 61.1(c)). Ordinary hours are otherwise Monday to Sunday, 7.00 am to midnight.`,
      },
      {
        q: "How much is overtime for theatre crew?",
        a: `Weekly staff are paid 150% for the first 2 hours beyond their rostered daily hours and 200% after (${$(x(l3.hourly, 1.5))} and ${$(x(l3.hourly, 2))} at Level 3), 150% for the first 4 hours on a rostered day off and 200% after. Casuals working over 8 ordinary hours in a day are paid 175% then 225%. Touring sound and lighting crew get a flat 17.5% loading instead.`,
      },
      {
        q: "What is the minimum engagement for casual crew?",
        a: "A casual may be engaged for a minimum of 3 consecutive hours and cannot be paid per performance. Work on a public holiday or a Sunday carries a minimum payment of 4 hours (cl 57.1, 61.2, 21.5, 63.4).",
      },
    ],
  };
}

export const OCT_BUILDERS = {
  miscellaneous,
  "building-construction": buildingConstruction,
  "legal-services": legalServices,
  electrical,
  fitness,
  "real-estate": realEstate,
  "local-government": localGovernment,
  "live-performance": livePerformance,
} as const;

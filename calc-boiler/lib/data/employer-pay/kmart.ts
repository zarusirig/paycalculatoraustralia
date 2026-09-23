// Kmart — retail store team members.
//
// Instrument: Kmart National Agreement 2024, AG2024/3872, AE526796, approved
// [2024] FWCA 4020 (Masson DP, 18 Nov 2024), operative 10 March 2025, nominal
// expiry 17 November 2028. Employer Kmart Australia Limited. Read in full from
// the FWC PDF on 23 September 2026. (Target is a separate employer with its
// own agreement, AE519106 — not covered here.)
//
// ⚠️ THE 2026 DOLLARS ARE THE AGREEMENT'S FORMULA, NOT A PRINTED TABLE. The
// Appendix C tables are 2024 dollars. cl 8.1.2 sets the base rate from the
// first full pay period on or after 1 July 2026 at the "equivalent adult rate
// of pay as at the July 2026 AWR in the GRIA + 15 cents per hour". Check: the
// 2024 Retail Assistant rate of $25.72 in Appendix C = 2024 award $25.65 + 7c,
// so the formula reproduces the printed table.
//
//   Retail Assistant = Retail Award Level 1 ($27.81) + 15c = $27.96
//   Casual = base x 1.25 (weekday 7am–6pm only)
//
// The base rate applies ONLY to Monday–Friday 7am–6pm. Every other hour is
// paid at the Retail Award rate including the award penalty, plus 1c
// (cl 8.1.2, 15.5.1) — so Saturday is award 125% + 1c ($34.77), which is
// LESS than 125% of the Kmart base.
//
// Juniors (cl 8.2.1): the greatest of (a) the 2024 Appendix C junior dollars,
// (b) award Table 5 percentages applied to the Kmart adult base, (c) award
// junior rate + 1c. In 2026 (b) is highest at every age, so this file uses the
// percentages on the Kmart base. Under-20s only, Retail Assistant and Trolley
// Collector only.

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae526796.pdf";

export const KMART_PAY: EmployerPay = {
  slug: "kmart",
  name: "Kmart",
  employerEntity: "Kmart Australia Limited",
  industry: "department store",
  instrument: {
    kind: "enterprise-agreement",
    title: "Kmart National Agreement 2024",
    reference: "AG2024/3872, AE526796",
    url: EA_URL,
    approvedOn: "18 November 2024 ([2024] FWCA 4020), operating from 10 March 2025",
    nominalExpiry: "17 November 2028",
    coverage:
      "It covers team members in Kmart retail stores nationally, including Certificate II and III retail trainees, and replaces the Retail Award for them. Salaried managers are excluded. Target stores are a separate employer with their own agreement.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period on or after 1 July 2027",
    detail:
      "The base rate becomes the July 2027 Retail Award rate for the equivalent level plus 20 cents an hour (plus 25 cents from July 2028). The dollar figure is set once the 2027 Annual Wage Review is decided.",
  },
  verifiedOn: "23 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Retail Assistant", description: "Store team member (Retail Award Level 1 equivalent)", hourly: 27.96, casualHourly: 34.95 },
    { level: "'Ride-on' Trolley Collector", description: "Operates ride-on trolley equipment (Level 2 equivalent)", hourly: 28.6, casualHourly: 35.75 },
    { level: "Clerical Administrator", description: "Store clerical and administration (Level 4 equivalent)", hourly: 29.6, casualHourly: 37.0 },
    { level: "Assistant Supervisor", description: "Assists in supervising the team (Level 4 equivalent)", hourly: 29.6, casualHourly: 37.0 },
    { level: "Supervisor", description: "Supervises the team (Level 6 equivalent)", hourly: 31.26, casualHourly: 39.08 },
  ],
  juniorScale: [
    { age: "Under 16", percentage: 0.45 },
    { age: "16", percentage: 0.5 },
    { age: "17", percentage: 0.6 },
    { age: "18", percentage: 0.7 },
    { age: "19", percentage: 0.8 },
    { age: "20 and over", percentage: 1 },
  ],
  juniorNote:
    "Kmart pays the adult rate from 20. Junior rates apply only to Retail Assistants and Trolley Collectors; under-20s in clerical or supervisor roles get the adult rate (cl 8.2.2). The agreement guarantees juniors the highest of three measures, and in 2026 that is the award percentage applied to the Kmart adult rate.",
  penalties: [
    { when: "Monday to Friday, 7am to 6pm", permanent: "Kmart base rate", casual: "Kmart base + 25%" },
    { when: "Monday to Friday, 6pm to 11pm", permanent: "Award 125% + 1c", casual: "Award 150% + 1c" },
    { when: "Monday to Friday, 5am to 7am and 11pm to midnight", permanent: "Award 150% + 1c", casual: "Award 175% + 1c" },
    { when: "Saturday, 7am to 11pm", permanent: "Award 125% + 1c", casual: "Award 150% + 1c" },
    { when: "Sunday, 9am to 11pm", permanent: "Award 150% + 1c", casual: "Award 175% + 1c" },
    { when: "Public holiday", permanent: "Award 225% + 1c", casual: "Award 250% + 1c" },
  ],
  penaltyNotes: [
    "Outside Monday to Friday 7am–6pm, Kmart pays the Retail Award rate for the hour plus 1 cent — not a percentage of the Kmart base rate. For an adult Retail Assistant that is $34.77 on a Saturday ($41.73 casual), $41.73 on a Sunday ($48.68 casual) and $62.58 on a public holiday ($69.54 casual).",
    "Casual penalty rates already include the 25% loading.",
    "Night shifts starting from 11pm and before 5am are paid for the whole shift at the award night shift rate plus 1c: 130% Monday to Friday, 150% Saturday, 175% Sunday (casual 155%, 175%, 200%).",
    "Less than a 12-hour break between shifts is paid at 200% (casual 225%) until you get one (cl 15.6). The public holiday minimum payment is 3 hours.",
  ],
  overtime: [
    { when: "Monday to Saturday", permanent: "Award 150% for the first 3 hours, then 200%, + 1c", casual: "Award 175%, then 225%, + 1c" },
    { when: "Sunday", permanent: "Award 200% + 1c", casual: "Award 225% + 1c" },
    { when: "Public holiday", permanent: "Award 250% + 1c", casual: "Award 275% + 1c" },
  ],
  notices: [
    "The Kmart agreement prints 2024 rates and then sets each July's base rate by formula: the Retail Award rate for the equivalent level plus 15 cents an hour from July 2026 (cl 8.1.2). The figures here apply that formula to the 1 July 2026 award. Kmart has not published a 2026 table.",
    "The Kmart base rate only applies Monday to Friday, 7am to 6pm. Evening, weekend and public holiday hours are paid at the award penalty rate plus 1 cent, which is slightly less than a percentage of the Kmart base would give.",
  ],
  unverified: [
    "Saved rates for long-serving staff from the 2018 agreement (Appendix E).",
    "Target pay — Target Australia has its own agreement (AE519106); not covered on this page.",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "Kmart National Agreement 2024 (AE526796)", publisher: "Fair Work Commission", url: EA_URL },
    { title: "General Retail Industry Award 2020 (MA000004), rates from 1 July 2026", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
    { title: "Annual Wage Review 2025–26", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/hearings-decisions/major-cases/annual-wage-reviews" },
  ],
  faqs: [
    {
      q: "How much does Kmart pay an hour in 2026?",
      a: "An adult Kmart Retail Assistant is paid $27.96 an hour on weekdays between 7am and 6pm, or $34.95 as a casual, from the first full pay period on or after 1 July 2026. That is the Retail Award Level 1 rate plus 15 cents. Supervisors are paid $31.26.",
    },
    {
      q: "How much does Kmart pay a 15 or 16 year old?",
      a: "A Retail Assistant under 16 is paid 45% of the Kmart adult rate, about $12.58 an hour. At 16 it is 50% (about $13.98), at 17 60% (about $16.78), at 18 70% and at 19 80%. From 20 you get the full adult rate.",
    },
    {
      q: "What are Kmart penalty rates on weekends?",
      a: "Kmart pays the Retail Award weekend rate plus 1 cent: for an adult Retail Assistant, $34.77 an hour on Saturday and $41.73 on Sunday from 9am. Casuals get $41.73 on Saturday and $48.68 on Sunday. Public holidays pay $62.58 ($69.54 casual).",
    },
    {
      q: "What is the Kmart enterprise agreement?",
      a: "The Kmart National Agreement 2024 (AE526796), approved by the Fair Work Commission on 18 November 2024 and operating from 10 March 2025. It covers Kmart store team members nationally and nominally expires on 17 November 2028.",
    },
    {
      q: "Does Kmart pay more than the award?",
      a: "For weekday daytime hours, by 15 cents an hour in 2026, rising to 20 cents in 2027 and 25 cents in 2028. Evening, weekend and public holiday hours are paid at the award rate plus 1 cent.",
    },
  ],
};

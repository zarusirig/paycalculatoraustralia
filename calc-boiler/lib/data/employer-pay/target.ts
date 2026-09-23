// Target — team members in Target and Target Country stores.
//
// Instrument: Target Australia Retail Agreement 2022, AG2022/5310, AE519106,
// approved 8 February 2023 (Masson DP, PR750306), operative 15 February 2023,
// nominal expiry 7 February 2027. Employer Target Australia Pty Ltd. Covers team
// members in Target's Retail Operations at the Customer Service Assistant and
// Team Leader classifications (cl 2.1, 15.3); not salaried/pay-ranged managers,
// apprentices or trainees (cl 2.3). The distribution centres have their own
// agreements (AE521731 Victoria, AE523060 Queensland). Read from the FWC PDF on
// 24 September 2026.
//
// ⚠️ THE 2026 DOLLARS ARE THE AGREEMENT'S FORMULA, NOT A PRINTED TABLE.
// cl 16.1 prints the commencement rates only (CSA $23.38, TL $26.19). cl 19.1:
// from the first full pay period on or after 1 July 2023 and each award
// increase after it,
//   (a) Customer Service Assistant = Retail Award Level 1 hourly + 5 cents
//   (b) Team Leader = 112% of the CSA rate, rounded to 2 decimal places.
//   2026: Retail Award L1 $27.81 → CSA $27.86; TL 27.86 x 1.12 = 31.2032 → $31.20.
// Cross-check: the SDA's July 2025 Target rate sheet prints CSA $26.60 (= award
// $26.55 + 5c) and TL $29.79 (= 26.60 x 1.12) — the same rule one year earlier.
//
// Casual loading 25% of the base rate (cl 12.6(b)). Juniors (cl 17.1): CSAs
// only, 16 and under 50%, 17 60%, 18 70%, 19 80%; adult from 20; juniors working
// as Team Leader get the adult rate (cl 17.2). From 1 Dec 2026 the Retail Award
// phase-in (PR813655) pays 18- and 19-year-olds with >6 months' service 75% /
// 85% of award L1 ($20.86 / $23.64), above Target's 70% / 80% of $27.86 ($19.50
// / $22.29) — s 206 floor, flagged on the page.

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/AE519106.pdf";

export const TARGET_PAY: EmployerPay = {
  slug: "target",
  name: "Target",
  employerEntity: "Target Australia Pty Ltd",
  industry: "department store",
  instrument: {
    kind: "enterprise-agreement",
    title: "Target Australia Retail Agreement 2022",
    reference: "AG2022/5310, AE519106",
    url: EA_URL,
    approvedOn: "8 February 2023 (PR750306), operating from 15 February 2023",
    nominalExpiry: "7 February 2027",
    coverage:
      "It covers Customer Service Assistants and Team Leaders in Target's stores. It does not cover salaried managers (department manager and above), apprentices or trainees, and Target's distribution centres have their own agreements. The agreement keeps operating after its nominal expiry date until it is replaced.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period on or after 1 July 2027",
    detail:
      "Customer Service Assistants move to the new Retail Award Level 1 rate plus 5 cents an hour, and Team Leaders to 112% of that (cl 19.1). Separately, from 1 December 2026 the Retail Award lifts pay for 18- and 19-year-olds with more than 6 months' service above Target's junior rates — see the notice above.",
  },
  verifiedOn: "24 September 2026",
  casualLoading: 0.25,
  rates: [
    { level: "Customer Service Assistant", description: "Customer service, checkouts, stock replenishment, merchandising, online orders, goods receiving — mapped to Retail Award Level 1", hourly: 27.86, casualHourly: 34.83 },
    { level: "Team Leader", description: "A Customer Service Assistant who helps supervise a department or task, opens or closes the store, or secures cash — 112% of the Customer Service Assistant rate", hourly: 31.2, casualHourly: 39.0 },
  ],
  juniorScale: [
    { age: "16 and under", percentage: 0.5 },
    { age: "17", percentage: 0.6 },
    { age: "18", percentage: 0.7 },
    { age: "19", percentage: 0.8 },
    { age: "20 and over", percentage: 1 },
  ],
  juniorNote:
    "Junior rates (cl 17.1) apply to Customer Service Assistants only; a junior working as a Team Leader gets the adult rate (cl 17.2). Adult rates start at 20.",
  penalties: [
    { when: "Monday to Friday, 7am to 6pm", permanent: "100%", casual: "125%" },
    { when: "Monday to Friday, 6pm to 11pm", permanent: "125%", casual: "150%" },
    { when: "Saturday, 7am to 11pm", permanent: "125%", casual: "150%" },
    { when: "Sunday, 9am to 11pm", permanent: "150%", casual: "175%" },
    { when: "Public holiday", permanent: "225%", casual: "250%" },
  ],
  penaltyNotes: [
    "The agreement adds 25% (weeknights after 6pm and Saturdays), 50% (Sundays) or 125% (public holidays) to the base rate; casuals get 50%, 75% and 150%, which already include the casual loading (cl 27.1).",
    "For an adult Customer Service Assistant ($27.86) that is about $34.83 an hour on a weeknight or Saturday ($41.79 casual), $41.79 on a Sunday ($48.76 casual) and $62.69 on a public holiday ($69.65 casual) — our arithmetic on the formula rate.",
    "Staff employed specifically as shiftworkers (shifts starting from 6pm and ending before 5am) get 130% Monday to Friday, 150% Saturday and 175% Sunday (casual 155%, 175% and 200%) instead (cl 28.3).",
  ],
  overtime: [
    { when: "Monday to Saturday, first 3 hours", permanent: "150%", casual: "175%" },
    { when: "Monday to Saturday, after 3 hours", permanent: "200%", casual: "225%" },
    { when: "Sunday", permanent: "200%", casual: "225%" },
    { when: "Public holiday", permanent: "250%", casual: "275%" },
  ],
  notices: [
    "The Target agreement does not print 2026 dollars. It sets the Customer Service Assistant rate at the Retail Award Level 1 rate plus 5 cents, and the Team Leader rate at 112% of that (cl 19.1). The figures here apply that rule to the 1 July 2026 award rate; your payslip may differ by a cent.",
    "From the first full pay period on or after 1 December 2026, the Retail Award pays 18-year-olds with more than 6 months' service 75% of the award rate ($20.86) and 19-year-olds 85% ($23.64). That is more than Target's 70% and 80% of $27.86 ($19.50 and $22.29), and an agreement cannot pay a base rate below the award, so those staff must get at least the award figures.",
  ],
  unverified: [
    "Target's own 2026 pay table — not public; the dollars are the agreement's formula.",
    "Salaried department manager and store manager pay — set by contract, not the agreement.",
    "Distribution centre pay (separate agreements AE521731 and AE523060).",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "Target Australia Retail Agreement 2022 (AE519106), with approval decision PR750306 and undertakings", publisher: "Fair Work Commission", url: EA_URL },
    { title: "General Retail Industry Award 2020 (MA000004)", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
    { title: "Target wage increase July 2025 (rate sheet)", publisher: "SDA", url: "https://content.solcon.org.au/live/files/D2C52A7C-77FF-4162-A419-270419FA6293.pdf" },
    { title: "Junior rates determination PR813655 (Retail Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813655.pdf" },
  ],
  faqs: [
    {
      q: "How much does Target pay an hour in 2026?",
      a: "An adult Customer Service Assistant at Target is paid about $27.86 an hour, or $34.83 as a casual, from the first full pay period on or after 1 July 2026. Team Leaders get about $31.20 ($39.00 casual). The agreement sets these as the Retail Award Level 1 rate plus 5 cents, and 112% of that for Team Leaders.",
    },
    {
      q: "What agreement covers Target staff?",
      a: "The Target Australia Retail Agreement 2022 (AE519106). It started on 15 February 2023 and has a nominal expiry date of 7 February 2027, after which it keeps applying until a new agreement replaces it.",
    },
    {
      q: "How much does Target pay a 16 or 17 year old?",
      a: "Customer Service Assistants aged 16 and under get 50% of the adult rate, about $13.93 an hour ($17.41 casual), and 17-year-olds 60%, about $16.72 ($20.90 casual). At 18 it is 70% and at 19 80%. These are our arithmetic from the agreement's percentages.",
    },
    {
      q: "What does Target pay on Sundays and public holidays?",
      a: "Sundays from 9am pay 150% for permanent staff and 175% for casuals (about $41.79 and $48.76 an hour for an adult Customer Service Assistant). Public holidays pay 225% and 250% (about $62.69 and $69.65).",
    },
    {
      q: "When is the next Target pay rise?",
      a: "From the first full pay period on or after 1 July 2027, when the Retail Award rises. Customer Service Assistants go to the new award Level 1 rate plus 5 cents. Before that, from 1 December 2026, 18- and 19-year-olds with more than 6 months' service must get at least the higher Retail Award junior rates.",
    },
  ],
};

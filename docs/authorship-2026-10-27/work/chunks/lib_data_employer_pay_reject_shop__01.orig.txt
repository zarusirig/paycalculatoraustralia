// The Reject Shop: Team Members and Team Leaders in The Reject Shop stores.
//
// Instrument: The Reject Shop Agreement 2023, AG2023/4375, AE522483 (PR768735),
// approved 28 November 2023 by Gostencnik DP, operative from the first full pay
// period on or after 5 December 2023, nominal expiry 30 June 2026. PAST NOMINAL
// EXPIRY BUT STILL OPERATING: we found no replacement approved by the FWC as at
// 22 October 2026. Read in full from the FWC PDF on 22 October 2026.
//
// THE 2026 DOLLARS ARE CALCULATED, NOT PRINTED. cl 19.1 sets the Team Member
// weekly rate at the Retail Award (GRIA) rate + 0.5% "maintained on an ongoing
// basis", with rises from the first full pay period on or after 1 July; Team
// Leader is 105% of Team Member. The printed year-1 figures reproduce exactly
// from the FWO's 2023 pay guide (GRIA Level 1 $939.60 a week from 1 July 2023):
//   $939.60 x 1.005 = $944.298 -> $944.30 (printed); x 1.05 = $991.52 (printed).
//   2026: $1,056.80 x 1.005 = $1,062.084 -> $1,062.08 -> /38 = $27.95
//         Team Leader $1,062.08 x 1.05 = $1,115.184 -> $1,115.18 -> /38 = $29.35
//   Applying 0.5% to the hourly rate instead gives $1,062.10 and $1,115.21 a
//   week; the hourly figures are the same either way. Disclosed on the page.
// Casual loading (cl 19.4(c)): 25% at commencement, 25.5% from 1 July 2025,
// 26% from 22 June 2026. Casual = base x 1.26.
// Juniors (cl 19.2): 45/50/60/70/80%, adult at 20; the GRIA percentage applies
// where more generous, so PR813655 (18 -> 75%, 19 -> 85% with more than
// 6 months' service, from 1 Dec 2026) flows through on its own.
// Penalties (cls 23 and 25) are "in addition to the ordinary hourly rate";
// casual figures are inclusive of the loading and stepped up with it.

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae522483.pdf";

export const REJECT_SHOP_PAY: EmployerPay = {
  slug: "reject-shop",
  name: "The Reject Shop",
  employerEntity: "The Reject Shop Limited (a subsidiary of Canadian retailer Dollarama since 2025)",
  industry: "discount variety retail",
  instrument: {
    kind: "enterprise-agreement",
    title: "The Reject Shop Agreement 2023",
    reference: "AG2023/4375, AE522483",
    url: EA_URL,
    approvedOn: "28 November 2023 (PR768735), operating from the first full pay period on or after 5 December 2023",
    nominalExpiry: "30 June 2026 (passed; the agreement keeps operating until replaced or terminated)",
    coverage:
      "It covers Team Members and Team Leaders in every store trading as The Reject Shop, TRS or The Reject Shop Discount Variety Store. Store Managers and Assistant Store Managers are excluded (cl 3.1), and the agreement applies to retail shops only.",
  },
  ratesEffectiveFrom: "the first full pay period on or after 1 July 2026",
  nextIncrease: {
    date: "First full pay period on or after 1 July 2027",
    detail:
      "Team Member and Team Leader rates track the Retail Award: the award's Level 1 rate plus 0.5%, then 105% of that for Team Leaders (cl 19.1). So they rise with each Annual Wage Review. Before that, the award's junior phase-in flows through. From the first full pay period on or after 1 December 2026, 18- and 19-year-olds with more than 6 months' service move to 75% and 85%. At award Level 1 that is $20.86 and $23.64. Clause 19.2 applies the award percentage whenever it beats the agreement's 70% and 80%.",
  },
  verifiedOn: "22 October 2026",
  casualLoading: 0.26,
  rates: [
    {
      level: "Team Member",
      description: "Store team member: customer service, pricing and shelf labels, registers and EFTPOS, displays and the register float (cl 21.1); the Retail Award Level 1 rate plus 0.5%",
      weekly: 1062.08,
      hourly: 27.95,
      casualHourly: 35.22,
    },
    {
      level: "Team Leader",
      description: "Appointed Team Member with specialised product or system knowledge who helps supervise, opens and closes the store and secures cash (cl 21.2); 105% of the Team Member rate",
      weekly: 1115.18,
      hourly: 29.35,
      casualHourly: 36.98,
    },
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
    "The agreement's junior percentages (cl 19.2) apply to the Team Member rate and reach the adult rate at 20, a year earlier than the Retail Award. Where the award's percentage is higher, the award's applies: from 1 December 2026 that lifts 18-year-olds with more than 6 months' service to 75% and 19-year-olds to 85%. The dollars below are our arithmetic from the Team Member weekly rate; casuals add the 26% loading.",
  penalties: [
    { when: "Monday to Friday, 7am to 6pm", permanent: "Base rate", casual: "Base + 26%" },
    { when: "Monday to Friday, 6pm to 11pm", permanent: "Base + 25%", casual: "Base + 51%" },
    { when: "Saturday, 7am to 11pm", permanent: "Base + 25%", casual: "Base + 51%" },
    { when: "Sunday, 9am to 11pm", permanent: "Base + 50%", casual: "Base + 76%" },
    { when: "Public holiday", permanent: "Base + 125%", casual: "Base + 151%", note: "Casual penalty paid in place of the loading, minimum 3 hours (cl 25.9)" },
  ],
  penaltyNotes: [
    "Penalties are paid on top of the ordinary hourly rate for your classification (cl 23.1). For a Team Member that is $34.94 an hour on weekday evenings after 6pm and on Saturdays, $41.93 on Sundays and $62.89 on public holidays.",
    "Casual figures include the casual loading, which rose to 26% from the first full pay period on or after 22 June 2026 (cl 19.4(c)). The casual penalties rose by half a point at the same time. For a Team Member that is $42.20 an hour on evenings and Saturdays, $49.19 on Sundays and $70.15 on public holidays.",
    "The Sunday penalty for permanent staff stepped down from 65% at commencement to 55% from July 2024 and 50% from July 2025 (cl 23.2). That is where the Retail Award's 150% Sunday rate sits.",
    "Penalties stand alone: if more than one applies to the same hours, only the highest is paid (cl 23.4). If you come back to work with less than 10 hours' break you are paid double until you get a 10-hour break (cl 23.5).",
  ],
  overtime: [
    { when: "Monday to Saturday, first 3 hours", permanent: "150%", casual: "176%" },
    { when: "Monday to Saturday, after 3 hours", permanent: "200%", casual: "226%" },
    { when: "Sunday", permanent: "200%", casual: "226%" },
    { when: "Public holiday", permanent: "250%", casual: "276%" },
  ],
  notices: [
    "The agreement prints its 2023 rates and then tracks the Retail Award: Team Members get the award's Level 1 rate plus 0.5%, Team Leaders 105% of that (cl 19.1). The 2026 dollars here apply that rule to the award rate from 1 July 2026. Applying the 0.5% to the hourly rather than the weekly award figure gives weekly rates 2 to 3 cents higher ($1,062.10 and $1,115.21), with the same hourly rates. Your payslip may differ by a few cents a week.",
    "The agreement passed its nominal expiry date on 30 June 2026. It keeps applying until it is replaced or terminated, and we found no replacement approved by the Fair Work Commission as at 22 October 2026. The SDA has been seeking to bring Store Managers and Assistant Store Managers, who are excluded from this agreement, into the next round of bargaining.",
    "The Reject Shop Limited was bought by Canadian retailer Dollarama under a scheme of arrangement agreed in March 2025. The employer named in the agreement has not changed, and the agreement continues to bind it.",
    "Casuals get a 26% loading rather than the award's 25%, to make up for the extra annual leave the agreement gives permanent staff (cl 19.4(c)). That makes a Team Member casual $35.22 an hour against $34.76 under the award.",
  ],
  unverified: [
    "Store Manager and Assistant Store Manager pay: excluded from the agreement (cl 3.1) and set by contract.",
    "Allowances (cl 27) as printed in 2023: meal $21.57, first aid $12.94 a week, laundry $6.25 a week or $1.25 a shift, Broken Hill $1.12 an hour. Using your own car pays $0.95 a kilometre. Each is floored at the award's current amount, which we have not re-checked for 2026.",
    "The one-off profit-linked payment in cl 20, which depended on the company's 2023-24 earnings.",
    "Shiftwork rates: the agreement applies the Retail Award's Part 6 shiftwork provisions (cl 4.11).",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "The Reject Shop Agreement 2023 (AE522483), with approval decision PR768735", publisher: "Fair Work Commission", url: EA_URL },
    { title: "General Retail Industry Award 2020 (MA000004), Level 1 from 1 July 2026", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
    { title: "Junior rates determination PR813655 (Retail Award, 26 August 2026)", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/awardsandorders/pdf/pr813655.pdf" },
    { title: "Awards and agreements: The Reject Shop Agreement (listed as current)", publisher: "Shop, Distributive and Allied Employees' Association", url: "https://www.sda.au/your-rights/awards-agreements/" },
    { title: "Scheme booklet for the acquisition of The Reject Shop Limited by Dollarama (16 May 2025)", publisher: "ASX announcements", url: "https://announcements.asx.com.au/asxpdf/20250516/pdf/06jtb84bd2mpg3.pdf" },
  ],
  faqs: [
    {
      q: "How much does The Reject Shop pay an hour in 2026?",
      a: "A Team Member gets $1,062.08 a week, or $27.95 an hour, as a permanent employee, and $35.22 an hour as a casual. That applies from the first full pay period on or after 1 July 2026. A Team Leader gets $29.35 an hour ($36.98 casual). Both are worked out from the agreement's rule of the Retail Award rate plus 0.5%.",
    },
    {
      q: "How much does The Reject Shop pay a 15 or 16 year old?",
      a: "Team Members under 16 get 45% of the adult rate, about $12.58 an hour or $15.85 as a casual. At 16 it is 50% ($13.97, casual $17.60) and at 17 60% ($16.77, casual $21.13). At 18 it is 70% ($19.56), at 19 80% ($22.36), and from 20 the full adult rate.",
    },
    {
      q: "What are The Reject Shop penalty rates?",
      a: "Weekday evenings after 6pm and Saturdays pay base plus 25% ($34.94 an hour for a Team Member), Sundays base plus 50% ($41.93) and public holidays base plus 125% ($62.89). Casual rates include the 26% loading: $42.20, $49.19 and $70.15 for the same hours.",
    },
    {
      q: "Is The Reject Shop enterprise agreement still in force?",
      a: "Yes. Its nominal expiry date was 30 June 2026, but an enterprise agreement keeps operating until the Fair Work Commission approves a replacement or terminates it. We found no replacement approved as at 22 October 2026, so the 2023 agreement, with its award-plus-0.5% formula, still sets pay.",
    },
    {
      q: "Does The Reject Shop pay more than the award?",
      a: "Slightly. Team Members get the Retail Award Level 1 rate plus 0.5% ($27.95 against $27.81 from 1 July 2026). Casuals get a 26% loading instead of 25% ($35.22 against $34.76), and juniors reach the adult rate at 20 rather than 21. Evening, Saturday, Sunday and public holiday penalties match the award's percentages.",
    },
    {
      q: "Who owns The Reject Shop now?",
      a: "Dollarama, a Canadian discount retailer, acquired The Reject Shop Limited under a scheme of arrangement agreed in March 2025. The employer named in the enterprise agreement is still The Reject Shop Limited, so the sale itself did not change store pay or conditions.",
    },
  ],
};

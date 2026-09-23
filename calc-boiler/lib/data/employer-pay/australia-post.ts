// Australia Post — posties (Postal Delivery Officers), corporate Post Office
// counter staff (Postal Services Officers) and mail processing staff.
//
// Instrument: Australia Post Enterprise Agreement 2024, AG2024/3287, AE526228,
// approved [2024] FWCA 3425 (Roberts DP, 11 October 2024), operative
// 18 October 2024, nominal expiry 9 October 2027 (FWC decision and agreement
// list; cl 2.2.2's "three years from operation" would be 18 October 2027).
// Read on 24 September 2026 from the FWC PDF, which includes the decision and
// the incorporated "Rates of Pay Booklet September 2024 – September 2026".
//
// PRINTED SALARIES, DERIVED HOURLY RATES. The Booklet prints ANNUAL salaries in
// four columns; the "4% as at First Full Pay Period September 2026" column
// applies on 24 September 2026 (cl 39.1.1: 4% in each of Sept 2024, 2025,
// 2026 — the last scheduled rise). The hourly rate is the agreement's own
// formula, cl 16.1.3(a): A ÷ 313 × 6 ÷ 36.75, rounded to the cent. The CWU's
// September 2026 sheet shows the same hourly figures for the PDO and PSO
// scales. Casual = hourly × 1.225 (cl 10.1, 22.5% loading) — our arithmetic.
//
// Full-time hours are 36.75 a week (cl 15.1.1), not 38.
//
// Juniors (cl 11.6): junior rates do NOT apply to permanent employees — a
// permanent employee under 21 gets the adult rate. Only non-permanent juniors
// in listed classifications get 50/60/70/81/91% (under 17 to 20), so the page
// shows no junior table; the Booklet's junior trainee salaries are in the note.
//
// Not covered: Licensed Post Offices (privately owned; staff usually on the
// Retail Award) and StarTrack (its own agreements).

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae526228.pdf";

export const AUSTRALIA_POST_PAY: EmployerPay = {
  slug: "australia-post",
  name: "Australia Post",
  employerEntity: "Australian Postal Corporation (Australia Post)",
  industry: "postal",
  instrument: {
    kind: "enterprise-agreement",
    title: "Australia Post Enterprise Agreement 2024",
    reference: "AG2024/3287, AE526228",
    url: EA_URL,
    approvedOn: "11 October 2024 ([2024] FWCA 3425), operating from 18 October 2024",
    nominalExpiry: "9 October 2027",
    coverage:
      "It covers Australia Post employees in the classifications it lists, including posties, corporate Post Office counter staff, mail and parcel processing, transport and administrative staff. It does not cover Licensed Post Offices, which are privately owned, or StarTrack, which has its own agreements.",
  },
  ratesEffectiveFrom: "the first full pay period in September 2026",
  nextIncrease: null,
  verifiedOn: "24 September 2026",
  casualLoading: 0.225,
  rates: [
    { level: "Trainee Postal Delivery Officer (adult)", description: "New postie, for the first 3 months — $56,075 a year. Trainee Mail Officers and Parcel Post Officers are paid the same", hourly: 29.25, casualHourly: 35.83 },
    { level: "Postal Delivery Officer — pay point 1", description: "Qualified postie, lowest point — $59,948 a year (Mail Officers the same)", hourly: 31.27, casualHourly: 38.31 },
    { level: "Postal Delivery Officer — pay point 3", description: "Where Delivery Centre posties start after the trainee period (cl 11.8.4) — $64,138 a year", hourly: 33.46, casualHourly: 40.99 },
    { level: "Postal Delivery Officer — pay point 5", description: "Top of the postie scale — $66,906 a year", hourly: 34.9, casualHourly: 42.75 },
    { level: "Senior Postal Delivery Officer Grade 1", description: "$69,302 a year", hourly: 36.15, casualHourly: 44.28 },
    { level: "Trainee Postal Services Officer (adult)", description: "New Post Office counter staff member, for the first 3 months — $56,979 a year", hourly: 29.72, casualHourly: 36.41 },
    { level: "Postal Services Officer — pay point 1", description: "Post Office counter staff, lowest point — $60,903 a year", hourly: 31.77, casualHourly: 38.92 },
    { level: "Postal Services Officer — pay point 5", description: "Top of the counter staff scale — $73,050 a year", hourly: 38.1, casualHourly: 46.67 },
  ],
  juniorScale: [],
  juniorNote:
    "Australia Post does not pay junior rates to permanent employees: a permanent employee under 21 gets the adult rate (cl 11.6.1). Casual and fixed-term juniors in listed classifications are paid 50% of the adult salary under 17, 60% at 17, 70% at 18, 81% at 19 and 91% at 20 — for a junior trainee postie that is $28,044 to $51,031 a year in the Booklet.",
  penalties: [
    { when: "Monday to Friday", permanent: "Ordinary rate", casual: "Ordinary rate + 22.5%" },
    { when: "Shift any part of which falls between 6pm and 6.30am", permanent: "+ 15% of salary for that shift", casual: "+ 15%, plus the 22.5% loading" },
    { when: "Saturday (ordinary duty)", permanent: "+ 50%", casual: "+ 50%, plus the 22.5% loading (172.5%)" },
    { when: "Sunday (ordinary duty)", permanent: "+ 100%", casual: "+ 100%, plus the 22.5% loading (222.5%)" },
    { when: "Public holiday", permanent: "Extra time and a half for time worked (250% in total)", casual: "Extra time and a half on top of the casual rate (272.5%)", note: "Minimum extra payment of 4 hours (cl 18.8.1)" },
  ],
  penaltyNotes: [
    "Penalties are percentages of the ordinary hourly rate (cl 18.1). They stand alone: they are not counted in overtime and not paid on top of another penalty (cl 18.2).",
    "Casuals get the same penalties as permanent staff, in addition to the 22.5% loading — the two are added, not multiplied (cl 10.3).",
    "For a trainee postie ($29.25 an hour) that is $43.88 on a Saturday ($50.46 casual) and $58.50 on a Sunday ($65.08 casual) — our arithmetic.",
    "Posties are also paid a 15% Delivery Allowance for a shift on which they deliver, unless they already get a shift penalty (cl 13.23). Full-timers on shifts wholly between 6pm and 8am for more than 4 weeks get 30% instead of 15%.",
  ],
  overtime: [
    { when: "Monday to Friday, first 3 hours", permanent: "150%", casual: "150%" },
    { when: "Monday to Friday, after 3 hours", permanent: "200%", casual: "200%" },
    { when: "Saturday", permanent: "150% for the first 3 hours, then 200% (shiftworkers 200%)", casual: "Same as permanent" },
    { when: "Sunday", permanent: "200%", casual: "200%" },
    { when: "Public holiday", permanent: "250%", casual: "250%" },
  ],
  notices: [
    "Australia Post prints annual salaries, not hourly rates. The hourly rates here use the agreement's own formula (annual salary ÷ 313 × 6 ÷ 36.75) and match the union's September 2026 table. Full-time hours are 36.75 a week, so the 38-hour weekly example below slightly overstates a standard full-time week.",
    "The 4% rise in September 2026 is the last pay rise this agreement schedules. It reaches its nominal expiry on 9 October 2027; any later rise depends on a new agreement.",
    "These rates are for Australia Post itself. Staff at Licensed Post Offices work for the private licensee and are usually paid under the General Retail Industry Award, and StarTrack has its own agreements.",
  ],
  unverified: [
    "The exact date the September 2026 rise started — \"the first full pay period in September\", which Australia Post does not print.",
    "Other scales (transport, administrative, Postal Manager, co-ordinator and team roles) — in the Booklet but not shown here.",
    "Casual hourly rates are the formula rate plus 22.5%, rounded to the cent; the union's table can differ by a cent.",
  ],
  sources: [
    { title: "Australia Post Enterprise Agreement 2024 (AE526228), with decision [2024] FWCA 3425 and Rates of Pay Booklet September 2024 – September 2026", publisher: "Fair Work Commission", url: EA_URL },
    { title: "AP — Rates of Pay — September 2026 — 4%", publisher: "Communications Workers Union (CEPU)", url: "https://www.cwu.org.au/view/12801" },
  ],
  faqs: [
    {
      q: "How much does an Australia Post postie earn in 2026?",
      a: "From the first full pay period in September 2026, a trainee Postal Delivery Officer earns $56,075 a year ($29.25 an hour). A qualified postie earns $59,948 to $66,906 ($31.27 to $34.90 an hour); Delivery Centre posties start at $64,138 ($33.46) after the trainee period.",
    },
    {
      q: "What does Australia Post pay Post Office counter staff?",
      a: "A Postal Services Officer at a corporate Post Office earns $60,903 to $73,050 a year ($31.77 to $38.10 an hour) from September 2026, and a trainee $56,979 ($29.72). Licensed Post Offices are privately owned and set their own pay, usually under the Retail Award.",
    },
    {
      q: "What is the casual rate at Australia Post?",
      a: "Casuals get a 22.5% loading on the permanent hourly rate: about $35.83 an hour for a trainee postie and $36.41 for a trainee counter staff member.",
    },
    {
      q: "Does Australia Post pay weekend penalty rates?",
      a: "Yes. Ordinary Saturday duty is paid at 50% extra and Sunday at 100% extra — $43.88 and $58.50 an hour for a trainee postie. Public holiday duty earns an extra time and a half. Casuals get these on top of their 22.5% loading.",
    },
    {
      q: "When is the next Australia Post pay rise?",
      a: "The 4% rise from the first full pay period in September 2026 is the last one in the Australia Post Enterprise Agreement 2024. The agreement's nominal expiry date is 9 October 2027, so the next rise depends on a new agreement.",
    },
  ],
};

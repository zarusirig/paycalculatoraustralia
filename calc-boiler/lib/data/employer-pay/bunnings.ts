// Bunnings — Bunnings Warehouse, smaller-format Bunnings and Bunnings Trade.
//
// Instrument: Bunnings Retail Enterprise Agreement 2023, AG2023/1996,
// AE520766, approved [2023] FWCFB 125 (Full Bench, 14 July 2023), operative
// 13 November 2023, nominal expiry 31 August 2026. PAST ITS NOMINAL EXPIRY BUT
// STILL IN OPERATION — an agreement keeps applying until it is replaced or
// terminated. Read in full from the FWC PDF on 23 September 2026.
//
// The agreement prints only the September 2023 column (cl 1.1(a)); cl 1.5 adds
// 3% from the first full pay cycle after 1 Sep 2024 and 3% after 1 Sep 2025.
// Nothing is scheduled after that. The Sep 2025 base rates below are
// Sep 2023 x 1.03 x 1.03 rounded to the cent, and match the SDA's
// September 2025 Bunnings wage sheet exactly.
//
// ⚠️ CASUAL LOADING IS 22.5%, NOT 25% (cl 1.1(c)). The casual and junior
// dollars are the SDA wage sheet's, which applies the loading/percentage to
// the unrounded base — up to a cent different from applying it to the rounded
// base (Team Member casual $35.09 vs $35.08).
//
// Base rates are "minimum base rates": actual pay is the Contract Rate under
// the performance pay system (cl 1.6), which is at least the base rate.
//
// Award check (MA000004 from 1 July 2026): every adult base rate is above the
// matching Retail Award level (Team Member $28.64 vs Level 1 $27.81). Weekday
// evening (+15%) and Saturday (+17.5%) loadings are below the award's +25%.

import type { EmployerPay } from "./types";

const EA_URL = "https://www.fwc.gov.au/documents/agreements/fwa/ae520766.pdf";

export const BUNNINGS_PAY: EmployerPay = {
  slug: "bunnings",
  name: "Bunnings",
  employerEntity: "Bunnings Group Limited",
  industry: "hardware store",
  instrument: {
    kind: "enterprise-agreement",
    title: "Bunnings Retail Enterprise Agreement 2023",
    reference: "AG2023/1996, AE520766",
    url: EA_URL,
    approvedOn: "14 July 2023 ([2023] FWCFB 125), operating from 13 November 2023",
    nominalExpiry: "31 August 2026 (passed; the agreement keeps operating until replaced)",
    coverage:
      "It covers team members at Bunnings Warehouse, smaller-format Bunnings stores and Bunnings Trade centres nationally. Distribution centres have their own agreements, and Tool Kit Depot is not covered.",
  },
  ratesEffectiveFrom: "the first full pay cycle after 1 September 2025",
  // 22 Oct 2026: the proposed 2026 agreement's first rise. Not yet approved by
  // the FWC, so the rate table above stays on the 2023 agreement.
  nextIncrease: {
    date: "First full pay cycle after 26 October 2026 (proposed agreement, subject to Fair Work Commission approval)",
    detail:
      "The Bunnings Retail Enterprise Agreement 2026, voted up in October 2026, lifts minimum base rates by 4.25%: a Team Member goes from $28.64 to $29.86 an hour ($36.58 casual). Bunnings' summary says the rise is paid from 26 October 2026 with 4.25% back pay for hours worked from 31 August to 25 October 2026, but the new agreement only replaces the 2023 agreement once the Commission approves it. Further rises of 3.25% follow in July 2027 and July 2028.",
  },
  verifiedOn: "23 September 2026",
  casualLoading: 0.225,
  rates: [
    { level: "Team Member", description: "Store team member, trade team member, customer service operator", hourly: 28.64, casualHourly: 35.09 },
    { level: "Team Member (Expert)", description: "Expert team member; special orders, service and trade desk", hourly: 29.1, casualHourly: 35.65 },
    { level: "Specialist", description: "Forklift operator, kitchen specialist, activities organiser, store or trade administrator, inventory specialist", hourly: 29.86, casualHourly: 36.58 },
    { level: "Specialist (higher grade)", description: "Forklift coach, trade qualified team member, trade specialist", hourly: 30.15, casualHourly: 36.93 },
    { level: "Supervisor", description: "Supervisor", hourly: 30.78, casualHourly: 37.7 },
  ],
  juniorScale: [
    { age: "15 and under", percentage: 0.55 },
    { age: "16", percentage: 0.6 },
    { age: "17", percentage: 0.75 },
    { age: "18 and over", percentage: 1 },
  ],
  juniorNote:
    "Bunnings pays the full adult rate from 18. The General Retail Industry Award pays it from 21, or from 20 after more than 6 months with the employer (cl 17.2). Junior rates apply only to Team Member and Team Member (Expert); Specialists and Supervisors are paid the adult rate at any age (cl 1.4).",
  publishedJuniorRates: [
    { age: "15 and under", hourly: 15.75, casualHourly: 19.3 },
    { age: "16", hourly: 17.19, casualHourly: 21.05 },
    { age: "17", hourly: 21.48, casualHourly: 26.31 },
    { age: "18 and over", hourly: 28.64, casualHourly: 35.09 },
  ],
  penalties: [
    { when: "Monday to Friday, 5am to 7am", permanent: "+ 30%", casual: "+ 52.5%" },
    { when: "Monday to Friday, 7am to 6pm", permanent: "Base rate", casual: "+ 22.5% (casual loading)" },
    { when: "Monday to Friday, 6pm to 11pm", permanent: "+ 15%", casual: "+ 37.5%", note: "Trade centres: 6pm to 9pm" },
    { when: "Saturday, 7am to 11pm", permanent: "+ 17.5%", casual: "+ 40%", note: "Trade centres: 7am to 6pm. 5am–7am Saturday is + 40% (casual + 62.5%)" },
    { when: "Sunday, 9am to 9pm", permanent: "+ 50%", casual: "+ 62.5%", note: "Trade centres: 9am to 6pm. Earlier and later Sunday hours pay more; see the agreement cl 2.1" },
    { when: "Public holiday", permanent: "+ 125%", casual: "+ 147.5%" },
  ],
  penaltyNotes: [
    "Bunnings calls these incentive rates. They are added on top of your Contract Rate, and casual figures already include the 22.5% loading; the two are added, not multiplied.",
    "Where two periods overlap, you get the more beneficial rate, not both.",
    "Bunnings store ordinary hours run 5am to 11pm, seven days a week. Trade centre spans are shorter: Monday to Friday 5am to 9pm, Saturday 6am to 6pm and Sunday 7am to 6pm.",
    "The weekday evening (+15%) and Saturday (+17.5%) loadings are lower than the Retail Award's +25%. The agreement passed the better-off-overall test in 2023 on its package as a whole.",
  ],
  overtime: [
    { when: "Monday to Saturday, first 3 hours", permanent: "+ 50%", casual: "+ 72.5%" },
    { when: "Monday to Saturday, after 3 hours", permanent: "+ 100%", casual: "+ 122.5%" },
    { when: "Sunday", permanent: "+ 100%", casual: "+ 122.5%" },
    { when: "Public holiday", permanent: "+ 150%", casual: "+ 172.5%" },
  ],
  notices: [
    "The Bunnings Retail Enterprise Agreement 2023 reached its nominal expiry date on 31 August 2026 and still applies. Its replacement, the Bunnings Retail Enterprise Agreement 2026, was voted up in October 2026 (68% yes, per the SDA) and now goes to the Fair Work Commission for approval. The rates on this page are the 2023 agreement's, which stay the legal minimum until the new agreement is approved. The enterprise agreement section below has the proposed rates and dates.",
    "The Bunnings rates on this page are minimum base rates. Under the agreement's performance pay system you are paid a Contract Rate that is at least the base rate, so your payslip may show more.",
  ],
  unverified: [
    "Approval of the 2026 agreement: on 27 October 2026 the Fair Work Commission's agreements-in-progress list (applications lodged up to 26 October 2026) did not include the Bunnings Retail Enterprise Agreement 2026, and no approval decision had been published. The vote result and the proposed terms come from the SDA's published copy of the agreement and its summary.",
    "Distribution centre and Tool Kit Depot pay: covered by separate agreements or none, not this one.",
    "Sunday early-morning and late-night incentive rates and outside-span rates: in cl 2.1 of the agreement, summarised here only in part.",
  ],
  awardHref: "/retail-award-rates/",
  awardLabel: "Retail Award rates 2026",
  sources: [
    { title: "Bunnings Retail Enterprise Agreement 2023 (AE520766)", publisher: "Fair Work Commission", url: EA_URL },
    { title: "Approval decision [2023] FWCFB 125", publisher: "Fair Work Commission", url: "https://www.fwc.gov.au/documents/decisionssigned/pdf/2023fwcfb125.pdf" },
    { title: "Bunnings wage rates, September 2025 (cross-check of casual and junior dollars)", publisher: "Shop, Distributive and Allied Employees' Association (Victoria)", url: "https://content.solcon.org.au/live/files/144F8800-5328-47C7-8439-95EECA37E73B.pdf" },
    { title: "General Retail Industry Award 2020 (MA000004)", publisher: "Fair Work Commission", url: "https://awards.fairwork.gov.au/MA000004.html" },
    { title: "Proposed Bunnings Retail Enterprise Agreement 2026 (full text, as put to the vote)", publisher: "Shop, Distributive and Allied Employees' Association", url: "https://www.sda.au/wp-content/uploads/2026/10/Bunnings-Retail-Enterprise-Agreement-2026-.pdf" },
    { title: "Bunnings Retail Enterprise Agreement 2026: summary document (wage table, rise dates, back pay)", publisher: "Shop, Distributive and Allied Employees' Association", url: "https://www.sda.au/wp-content/uploads/2026/10/Bunnings_Summary-Doc-2026_Warehouse-Long-FINAL-NATIONAL-1.pdf" },
    { title: "New Bunnings Agreement voted up by workers (68% yes), 20 October 2026", publisher: "Shop, Distributive and Allied Employees' Association", url: "https://www.sda.au/sa-nt/news/new-bunnings-agreement-voted-up-by-workers/" },
  ],
  faqs: [
    {
      q: "How much does Bunnings pay an hour?",
      a: "The minimum base rate for an adult Bunnings Team Member is $28.64 an hour, or $35.09 as a casual, from September 2025. Supervisors are paid at least $30.78. Your actual Contract Rate under the performance pay system can be higher.",
    },
    {
      q: "What is the Bunnings EBA?",
      a: "The Bunnings EBA is the Bunnings Retail Enterprise Agreement 2023 (AE520766), approved by the Fair Work Commission on 14 July 2023. It gave 3% rises in September 2024 and September 2025 and reached its nominal expiry on 31 August 2026, but keeps applying until it is replaced. Its replacement, the Bunnings Retail Enterprise Agreement 2026, was voted up in October 2026 and is before the Commission for approval.",
    },
    {
      q: "How much does Bunnings pay a 15, 16 or 17 year old?",
      a: "A Team Member aged 15 or under is paid 55% of the adult rate ($15.75 an hour), at 16 it is 60% ($17.19) and at 17 it is 75% ($21.48). From 18 Bunnings pays the full adult rate of $28.64.",
    },
    {
      q: "What is the Bunnings casual loading?",
      a: "The Bunnings casual loading is 22.5%, not the 25% in the General Retail Industry Award. An adult casual Team Member is paid $35.09 an hour for weekday daytime hours.",
    },
    {
      q: "What does Bunnings pay on Sundays and public holidays?",
      a: "Between 9am and 9pm on a Sunday in Bunnings stores, permanent staff get base + 50% and casuals base + 62.5%. Public holidays pay + 125% for permanent staff and + 147.5% for casuals.",
    },
    {
      q: "Is Bunnings paid above the award?",
      a: "Yes. An adult Team Member's minimum base rate of $28.64 is 83 cents (about 3%) above the Retail Award Level 1 rate of $27.81 in 2026, and your Contract Rate under the performance pay system can be higher. When the Fair Work Commission approved the 2023 agreement it recorded rates 14.67% to 20.4% above the award (as it stood on 19 June 2023) for permanent staff; award rises from July 2023 to July 2026 have narrowed that gap. The proposed 2026 agreement keeps base rates at least 5% above the award.",
    },
    {
      q: "When is the next Bunnings pay rise?",
      a: "The proposed Bunnings Retail Enterprise Agreement 2026 lifts minimum base rates by 4.25% from the first full pay cycle after 26 October 2026, taking a Team Member from $28.64 to $29.86 an hour, with back pay to 31 August 2026. Further 3.25% rises follow in July 2027 and July 2028. The agreement was voted up in October 2026 and needs Fair Work Commission approval before it legally replaces the 2023 agreement.",
    },
  ],
  // 22 Oct 2026: 2023 facts from the approval decision [2023] FWCFB 125 (FWC
  // PDF); 2026 facts from the SDA's copy of the proposed agreement (cl 1.1, 1.5,
  // 16.2, Appendix 2), its summary document and its 20 Oct 2026 vote report.
  enterpriseAgreement: {
    underlyingAward: { title: "General Retail Industry Award 2020", code: "MA000004", url: "https://awards.fairwork.gov.au/MA000004.html" },
    commencedOn: "13 November 2023",
    status: "replacement-before-fwc",
    statusNote:
      "The current Bunnings agreement is past its nominal expiry date of 31 August 2026 but still in force. The replacement Bunnings Retail Enterprise Agreement 2026 was voted up in October 2026 (68% yes, per the SDA on 20 October 2026) and goes to the Fair Work Commission for approval. If approved on or before 26 February 2027 it starts on 26 April 2027, and it nominally expires on 31 July 2029 (proposed cl 16.2).",
    payRises: [
      { date: "First full pay cycle after 1 September 2024", amount: "3%", source: "2023 agreement cl 1.5", paid: true },
      { date: "First full pay cycle after 1 September 2025", amount: "3% (Team Member $28.64)", source: "2023 agreement cl 1.5", paid: true },
      { date: "First full pay cycle after 26 October 2026", amount: "4.25% (Team Member $28.64 to $29.86, casual $36.58), with 4.25% back pay on hours worked from 31 August to 25 October 2026", source: "Proposed 2026 agreement cl 1.1 and Appendix 2, and Bunnings' summary document; subject to Fair Work Commission approval" },
      { date: "First full pay cycle after 1 July 2027", amount: "3.25%", source: "Proposed 2026 agreement cl 1.5(a); subject to approval" },
      { date: "First full pay cycle after 1 July 2028", amount: "3.25%", source: "Proposed 2026 agreement cl 1.5(a); subject to approval" },
    ],
    aboveAward:
      "When it approved the 2023 agreement the Full Bench recorded wage rates \"from 14.67 per cent to 20.4 per cent above the Award rates for permanent employees, and from 12.37 per cent to 18 per cent above the Award for casual employees\", measured against the award as at 19 June 2023 ([2023] FWCFB 125 at [28]). Award rises from July 2023 to July 2026 have narrowed that gap: on 2026 rates a Team Member's $28.64 is 83 cents (about 3%) above Retail Award Level 1 ($27.81). The proposed 2026 agreement adds a clause keeping base rates at least 5% above the matching award rate (proposed cl 1.5(c)).",
    whatItMeans: [
      "Until the Fair Work Commission approves the 2026 agreement, the 2023 agreement sets your legal minimum: $28.64 an hour for an adult Team Member, with a 22.5% casual loading.",
      "Bunnings' summary of the new agreement says the 4.25% rise is paid from the first full pay cycle after 26 October 2026, with back pay to 31 August 2026, so your payslip may show the higher rate before approval.",
      "Once approved, the new agreement locks in 3.25% rises in July 2027 and July 2028 and keeps base rates at least 5% above the award.",
      "Under the performance pay system you are paid a Contract Rate that is at least the base rate, so the figures here are floors, not your exact rate.",
    ],
    decision: { citation: "[2023] FWCFB 125 (Full Bench), 14 July 2023, approved with undertakings", url: "https://www.fwc.gov.au/documents/decisionssigned/pdf/2023fwcfb125.pdf" },
    verifiedOn: "22 October 2026",
  },
};

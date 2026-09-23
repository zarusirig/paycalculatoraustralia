// Pilot pay — Air Pilots Award 2020 [MA000046] minimum salaries.
//
// Source of every figure: the Fair Work Commission's consolidated Air Pilots
// Award 2020, read in full on 24 September 2026 at
// awards.fairwork.gov.au/MA000046.html. That version incorporates all
// amendments up to and including 14 July 2026 (PR811739). The salary tables were
// varied by PR799326 (the 2025-26 Annual Wage Review) from the first full pay
// period on or after 1 July 2026 ("ppc 01Jul26"); PR811739 added the Second
// Officer under Training rate to clause A.1.2 from the first full pay period on
// or after 14 July 2026.
//
// These are award MINIMUMS. Pilots at the major airlines are paid under their
// airline's enterprise agreement; those tables were not read and are not quoted.
//
// Aerial application (Schedule C) salaries are printed per week; the annual
// figure here is weekly × 52.143, rounded to the dollar, with the weekly rate
// quoted in the note.

import type { AviationPayPage } from "./types";

export const PILOT_PAY: AviationPayPage = {
  slug: "pilot",
  instrument: {
    name: "Air Pilots Award 2020 [MA000046]",
    url: "https://awards.fairwork.gov.au/MA000046.html",
    status:
      "Modern award in operation since 1 January 2010; the Fair Work Commission's consolidated version incorporates amendments up to and including 14 July 2026 (PR811739).",
  },
  ratesEffectiveFrom: "1 July 2026",
  scheduledIncreases: [],
  verifiedOn: "24 September 2026",

  scales: [
    {
      id: "ga-captain",
      title: "Captain — airline and general aviation minimum salaries (clause A.1.1)",
      intro:
        "Minimum annual salaries for full-time captains employed by an airline operation or a general aviation employer (charter, aerial work, private, business and instructional flying), by aircraft type and weight. UTBNI means up to but not including.",
      stepHeading: "Aircraft classification",
      steps: [
        { label: "Single engine UTBNI 1360 kg", salary: 58_226 },
        { label: "Single engine 1360 kg–3359 kg", salary: 60_702 },
        { label: "Single engine 3360 kg & above", salary: 70_496 },
        { label: "Multi engine UTBNI 3360 kg", salary: 67_795 },
        { label: "Multi engine 3360 kg UTBNI 5660 kg", salary: 70_496 },
        { label: "Multi engine 5660 kg UTBNI 8500 kg", salary: 74_353 },
        { label: "Multi engine 8500 kg UTBNI 12000 kg", salary: 79_984 },
        { label: "Multi engine 12000 kg UTBNI 15000 kg", salary: 85_967 },
        { label: "Multi engine 15000 kg UTBNI 19000 kg", salary: 93_682 },
        { label: "Dash 8 100–15650 kg MTOW", salary: 93_682 },
        { label: "Dash 8 200–16466 kg MTOW", salary: 93_682 },
        { label: "Dash 8 300–19505 kg MTOW", salary: 93_682 },
        { label: "Dash 8 400–28998 kg MTOW", salary: 100_078 },
        { label: "Multi engine 19000 kg & above—unless otherwise listed", salary: 100_233 },
      ],
    },
    {
      id: "ga-first-officer",
      title: "First Officer / Second Pilot — airline and general aviation minimum salaries (clause A.1.1)",
      intro:
        "Minimum annual salaries for full-time first officers and second pilots on the same aircraft classifications.",
      stepHeading: "Aircraft classification",
      steps: [
        { label: "Single engine UTBNI 1360 kg", salary: 52_257 },
        { label: "Single engine 1360 kg–3359 kg", salary: 52_257 },
        { label: "Single engine 3360 kg & above", salary: 55_083 },
        { label: "Multi engine UTBNI 3360 kg", salary: 53_036 },
        { label: "Multi engine 3360 kg UTBNI 5660 kg", salary: 55_083 },
        { label: "Multi engine 5660 kg UTBNI 8500 kg", salary: 57_388 },
        { label: "Multi engine 8500 kg UTBNI 12000 kg", salary: 60_952 },
        { label: "Multi engine 12000 kg UTBNI 15000 kg", salary: 64_901 },
        { label: "Multi engine 15000 kg UTBNI 19000 kg", salary: 69_621 },
        { label: "Dash 8 100–15650 kg MTOW", salary: 69_621 },
        { label: "Dash 8 200–16466 kg MTOW", salary: 69_621 },
        { label: "Dash 8 300–19505 kg MTOW", salary: 69_621 },
        { label: "Dash 8 400–28998 kg MTOW", salary: 73_359 },
        { label: "Multi engine 19000 kg & above—unless otherwise listed", salary: 73_359 },
      ],
    },
    {
      id: "larger-aircraft",
      title: "Larger aircraft minimum salaries (clause A.1.2)",
      intro:
        "Minimum annual salaries for full-time pilots on jet and wide-body aircraft under Schedule A. Airline pilots are usually paid above these minimums under their airline's enterprise agreement.",
      stepHeading: "Aircraft and rank",
      steps: [
        { label: "Fokker 28 — Captain", salary: 161_088 },
        { label: "Fokker 28 — First Officer", salary: 106_780 },
        { label: "CRJ-50 — Captain", salary: 161_088 },
        { label: "CRJ-50 — First Officer", salary: 106_780 },
        { label: "BAe-146, Fokker 100, Boeing 717 — Captain", salary: 174_391 },
        { label: "BAe-146, Fokker 100, Boeing 717 — First Officer", salary: 115_162 },
        { label: "Narrow body aircraft — Captain", salary: 182_826 },
        { label: "Narrow body aircraft — First Officer", salary: 120_407 },
        { label: "Wide body aircraft–single deck — Captain", salary: 209_905 },
        { label: "Wide body aircraft–single deck — First Officer", salary: 138_126 },
        { label: "Wide body aircraft–single deck — Second Officer", salary: 83_788 },
        { label: "Wide body aircraft–double deck — Captain", salary: 236_988 },
        { label: "Wide body aircraft–double deck — First Officer", salary: 155_846 },
        { label: "Wide body aircraft–double deck — Second Officer", salary: 94_420 },
        {
          label: "Second Officer under Training (wide body)",
          salary: 75_738,
          note: "85% of the average of the two wide-body Second Officer rates; from the first full pay period on or after 14 July 2026",
        },
      ],
    },
    {
      id: "regional-captain",
      title: "Regional airlines — Captain minimum salaries (clause B.1.1)",
      intro:
        "Minimum annual salaries for full-time captains employed by regional airlines, by the aircraft groups listed in Schedule B.",
      stepHeading: "Aircraft group",
      steps: [
        { label: "Group 1 (Cessna 206, 207, 210)", salary: 66_317 },
        {
          label: "Group 2 (e.g. Beechcraft 55/58, Britten Norman BN2, Cessna 310/402, Piper PA31)",
          salary: 73_481,
        },
        { label: "Group 3 (Beechcraft 65, Cessna 404, Cessna 421, Aero Commander 680)", salary: 75_979 },
        { label: "Group 4 (Cessna 441, Nomad N22/N24, Aero Commander 690)", salary: 81_368 },
        {
          label: "Group 5 (Beechcraft 200, Swearingen 226/227, De Havilland 6-100/200/300, Casa 212, Embraer 110)",
          salary: 92_292,
        },
        { label: "Group 6 (Jetstream 31, Beach 1900, Metro 23)", salary: 94_791 },
        { label: "Group 7 (Cessna 550, McDonnell Douglas, DC3, Shorts SD-330/360, Mohawk)", salary: 98_560 },
        { label: "Group 8 (Saab-Fairchild 340 A)", salary: 105_218 },
        { label: "Group 9 (Dash 8-100, 102, 200 and 300; ATR 42-300; Fokker 50)", salary: 113_588 },
        { label: "Group 9 (Dash 8-400)", salary: 121_376 },
        { label: "Group 10 (Fokker 70 and Fokker 100, Bae-146, Embraer 190/195)", salary: 174_391 },
        { label: "Group 10 (Airbus A319/A320, Boeing 737-300/400)", salary: 182_826 },
      ],
    },
    {
      id: "regional-co-pilot",
      title: "Regional airlines — Co-pilot minimum salaries (clause B.1.1)",
      intro:
        "Minimum annual salaries for full-time co-pilots at regional airlines. Schedule B prints no co-pilot rate for Groups 1 to 4.",
      stepHeading: "Aircraft group",
      steps: [
        { label: "Group 5", salary: 66_833 },
        { label: "Group 6", salary: 67_656 },
        { label: "Group 7", salary: 68_756 },
        { label: "Group 8", salary: 72_110 },
        { label: "Group 9 (Dash 8-100, 102, 200 and 300; ATR 42-300; Fokker 50)", salary: 76_390 },
        { label: "Group 9 (Dash 8-400)", salary: 81_580 },
        { label: "Group 10 (Fokker 70 and Fokker 100, Bae-146, Embraer 190/195)", salary: 115_162 },
        { label: "Group 10 (Airbus A319/A320, Boeing 737-300/400)", salary: 120_407 },
      ],
    },
    {
      id: "helicopter-onshore-single",
      title: "Helicopter pilots — on-shore, single engine (clause D.5.1)",
      intro:
        "Minimum annual salaries for full-time pilots on on-shore helicopter operations flying single-engine helicopters, by year of service.",
      stepHeading: "Year of service",
      steps: [
        { label: "1st year of service", salary: 71_985 },
        { label: "2nd year of service", salary: 73_671 },
        { label: "3rd year of service", salary: 75_285 },
        { label: "4th year of service", salary: 76_871 },
        { label: "5th year of service", salary: 78_555 },
        { label: "6th year of service", salary: 80_241 },
        { label: "7th year of service", salary: 81_929 },
        { label: "8th year of service", salary: 83_617 },
        { label: "9th year of service", salary: 85_301 },
      ],
    },
    {
      id: "aerial-application",
      title: "Aerial application (agricultural) pilots (clause C.9.1)",
      intro:
        "Minimum salaries for full-time aerial application pilots, by aerial application flying hours in the industry. The award prints weekly rates; commission on the aircraft's charge-out price is paid on top.",
      stepHeading: "Industry flying hours",
      steps: [
        { label: "0–1000", salary: 51_001, note: "$978.10 a week × 52.143" },
        { label: "1001–2000", salary: 52_399, note: "$1004.90 a week × 52.143" },
        { label: "2001–3000", salary: 54_010, note: "$1035.80 a week × 52.143" },
        { label: "Over 3000", salary: 58_233, note: "$1116.80 a week × 52.143" },
      ],
    },
  ],
  entryStep: "Single engine UTBNI 1360 kg",
  topStep: "Multi engine 19000 kg & above—unless otherwise listed",

  traineePay: [
    "The award has no separate cadet or student-pilot rate for general aviation. A pilot covered by the award must hold a commercial pilot's licence or airline transport pilot's licence, and the lowest minimum salary is First Officer/Second Pilot on a single engine aircraft UTBNI 1360 kg at $52,257 a year.",
    "Second Officer under Training — defined as \"a pilot under initial training for a second officer position\" — has a minimum of $75,738 a year on wide-body aircraft from the first full pay period on or after 14 July 2026.",
    "Flight instructors (clause A.1.7) are paid on appointment as follows: Grade III at the single engine (or multi engine) charter salary; Grade II at that charter salary plus $4669.27 per annum; Grade I plus $9338.55 per annum. A Grade I single-engine instructor gets increments of $1186.91 per annum in the sixth, seventh and eighth year of service with the same employer.",
    "An aerial application pilot with more than 6 months' industry experience must be paid at least the 1001–2000 flying hours rate ($1004.90 a week) (clause C.9.2).",
  ],
  allowances: [
    "Casual pilots (clause 10.2): \"A casual pilot will be paid per flying hour at the rate of 1/800th of the annual salary prescribed for the class of work performed (including additions to salary).\"",
    "Casual loading (clause 10.4): \"A casual employee will be paid an amount of 25% for each hour in addition to the amount in clause 10.2 or 10.3. This loading is instead of entitlements to leave and other matters from which casuals are excluded by the terms of this award and the NES.\"",
    "Casual minimum payments (clause 10.6): for a period of duty (including rostered stand-by) of 4 hours or less, a minimum payment of 2 hours; for a period of duty exceeding 4 hours, a minimum of 4 hours. Where actual flight time is longer, payment is for each flying hour or part thereof.",
    "Worked casual rate from Schedule F: a casual captain on a single engine aircraft UTBNI 1360 kg is paid $90.98 per flying hour ($58,226 ÷ 800 × 1.25), before any additions to salary.",
    "Clause 10 does not apply to aerial application pilots. A casual aerial application pilot must be paid $301.05 per day, with a minimum of one day's pay for each day they report for work (clauses C.9.3 and C.9.4).",
    "Instrument rating allowance (clause A.1.4): Command or Class 1 $8196.42 a year; Co-pilot or Class 2 $5329.91; Night VFR or Class 4 $2049.11.",
    "Aircraft additions (clause A.1.3): piston engine on commuter operations $2049.11 a year; Airline Transport Pilots Licence $6763.17; turbo-prop $8924.25; turbo jet $14,332.54. A First Officer/Second Pilot receives 65% of the piston, turbo-prop or turbo jet additions (clause A.1.6).",
    "Supervisory additions (clause A.1.14) for non-instructor pilots: from 5% of salary (training pilot or senior pilot, 10 pilots or less) up to 12% (check and training pilot designated as Chief Pilot, 11 pilots or more).",
    "Chief Flying Instructors receive an extra 6%, 8%, 10% or 15% of salary for a private, commercial, instrument or instructor school rating (clause A.1.13).",
    "Ordinary hours of work must not average more than 38 per week (clause 15.2).",
  ],
  otherInstruments: [],
  notices: [
    "These are award minimum salaries. Most airline pilots (Qantas, Virgin Australia, Jetstar, Rex, QantasLink and others) are paid under their airline's enterprise agreement, which usually pays above the award.",
    "Additions to salary (instrument rating, aircraft type, licence and supervisory additions) are paid on top of the minimum salary and count as salary for all purposes.",
    "Other helicopter minimums printed in Schedule D: on-shore twin 0–9000 lbs $76,871 (1st year) to $90,362 (9th year); on-shore twin over 9000 lbs $80,241 to $93,733; off-shore single engine command UTBNI 9000 lbs $75,183 (1st year) to $98,797 (15th year); off-shore all other operations command $83,617 to $107,226, plus the all-purpose special duties addition.",
    "Award minimum rates change each year after the Fair Work Commission's Annual Wage Review, usually from the first full pay period on or after 1 July.",
  ],
  unverified: [
    "Airline enterprise agreements (Qantas, Virgin Australia, Jetstar, Rex, QantasLink and others): pilot pay tables are in each airline's enterprise agreement lodged with the Fair Work Commission. They were not read from an FWC-published copy for this page and are not reproduced. Search the FWC's agreement database at fwc.gov.au to read them.",
    "Salary-survey and media figures for pilot earnings are not used on this page.",
    "Helicopter aircrew (Schedule E) rates are not reproduced here.",
  ],
  sources: [
    {
      title: "Air Pilots Award 2020 [MA000046] — consolidated award incorporating amendments up to and including 14 July 2026",
      publisher: "Fair Work Commission",
      url: "https://awards.fairwork.gov.au/MA000046.html",
    },
  ],
  faqs: [
    {
      q: "How much does a pilot earn in Australia?",
      a: "Under the Air Pilots Award 2020, the minimum salary for a full-time captain in general aviation runs from $58,226 a year (single engine up to 1360 kg) to $100,233 (multi engine 19000 kg and above). Larger aircraft minimums reach $182,826 for a narrow body captain and $236,988 for a double-deck wide body captain. Airline pilots are usually paid more under their airline's enterprise agreement.",
    },
    {
      q: "How are casual pilots paid?",
      a: "Clause 10 of the Air Pilots Award says a casual pilot is paid per flying hour at 1/800th of the annual salary for the class of work (including additions to salary), plus a 25% casual loading. A casual captain on a single engine aircraft up to 1360 kg therefore gets $90.98 per flying hour. Each attendance attracts a minimum payment of 2 hours (duty of 4 hours or less) or 4 hours (duty over 4 hours).",
    },
    {
      q: "What does a first officer earn?",
      a: "The award minimum for a first officer or second pilot in general aviation ranges from $52,257 to $73,359 a year depending on aircraft. On larger aircraft the minimum is $120,407 for a narrow body first officer and $155,846 for a double-deck wide body first officer.",
    },
    {
      q: "What do flight instructors get paid?",
      a: "A Grade III flight instructor is paid the single engine (or multi engine) charter salary. Grade II adds $4669.27 a year and Grade I adds $9338.55 a year. A Chief Flying Instructor gets an extra 6% to 15% of salary depending on the school's rating.",
    },
    {
      q: "What do helicopter pilots earn?",
      a: "An on-shore single engine helicopter pilot has an award minimum of $71,985 in their first year of service, rising to $85,301 in the ninth year. Off-shore command pilots on all other operations range from $83,617 to $107,226 plus the special duties addition.",
    },
  ],
};

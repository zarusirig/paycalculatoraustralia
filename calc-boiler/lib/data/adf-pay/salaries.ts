// =============================================================================
// GENERATED from the ADF Pay and Conditions Manual (PACMAN), Chapter 3 Part 1.
// Do not hand-edit numbers: re-scrape and regenerate.
//
//   Schedule B.12 Part 1 — Other rank salary rates, Permanent Forces
//   Schedule B.3  Part 1 — Officer salary rates, Permanent Forces
//   https://pay-conditions.defence.gov.au/pacman/chapter-3/part-1/schedule-b12
//   https://pay-conditions.defence.gov.au/pacman/chapter-3/part-1/schedule-b3
//
// Both schedules state: "The salary rates in PDF can be found on the ADF
// Military Salary - 6 November 2025." Read 23 September 2026. Yearly rates;
// columns are pay grades 1 to 10; rows are increments within the rank, highest
// increment first, exactly as PACMAN orders them.
//
// Rank names: PACMAN headings list Navy, Army, Air Force in that order
// ("Petty Officer, Sergeant, Sergeant"). Single-service headings (Staff
// Sergeant, Lance Corporal) are Army-only ranks.
// =============================================================================

import type { RankSalaryTable } from "./types";

export const OTHER_RANK_SALARIES: RankSalaryTable[] = [
  {
    id: "wo2",
    group: "other-ranks",
    pacmanHeading: "Chief Petty Officer, Warrant Officer Class 2, Flight Sergeant",
    names: { navy: "Chief Petty Officer", army: "Warrant Officer Class 2", airForce: "Flight Sergeant" },
    rows: [
      { increment: "1", salaries: [111623, 114844, 118979, 123446, 128267, 133473, 139097, 145172, 151730, 158815] },
      { increment: "0", salaries: [109733, 112956, 117094, 121557, 126379, 131586, 137211, 143286, 149842, 156929] },
    ],
  },
  {
    id: "ssgt",
    group: "other-ranks",
    pacmanHeading: "Staff Sergeant",
    names: { navy: null, army: "Staff Sergeant", airForce: null },
    rows: [
      { increment: "0", salaries: [106734, 109956, 114087, 118553, 123376, 128584, 134206, 140278, 146838, 153925] },
    ],
  },
  {
    id: "sgt",
    group: "other-ranks",
    pacmanHeading: "Petty Officer, Sergeant, Sergeant",
    names: { navy: "Petty Officer", army: "Sergeant", airForce: "Sergeant" },
    rows: [
      { increment: "2", salaries: [100898, 104120, 108257, 112718, 117543, 122747, 128371, 134445, 141006, 148091] },
      { increment: "1", salaries: [99220, 102443, 106575, 111041, 115864, 121073, 126690, 132767, 139326, 146413] },
      { increment: "0", salaries: [97575, 100797, 104930, 109397, 114219, 119427, 125047, 131122, 137681, 144768] },
    ],
  },
  {
    id: "cpl",
    group: "other-ranks",
    pacmanHeading: "Leading Seaman, Corporal, Corporal",
    names: { navy: "Leading Seaman", army: "Corporal", airForce: "Corporal" },
    rows: [
      { increment: "2", salaries: [89857, 93081, 97212, 101677, 106503, 111706, 117327, 123404, 129959, 137047] },
      { increment: "1", salaries: [88398, 91620, 95754, 100219, 105042, 110246, 115871, 121945, 128502, 135586] },
      { increment: "0", salaries: [86966, 90189, 94324, 98787, 103607, 108817, 114442, 120514, 127074, 134164] },
    ],
  },
  {
    id: "lcpl",
    group: "other-ranks",
    pacmanHeading: "Lance Corporal",
    names: { navy: null, army: "Lance Corporal", airForce: null },
    rows: [
      { increment: "0", salaries: [81612, 84833, 88963, 93433, 98255, 103459, 109081, 115158, 121713, 128802] },
    ],
  },
  {
    id: "pte-p",
    group: "other-ranks",
    pacmanHeading: "Able Seaman, Private Proficient, Leading Aircraftman",
    names: { navy: "Able Seaman", army: "Private Proficient", airForce: "Leading Aircraftman" },
    rows: [
      { increment: "0", salaries: [80341, 83565, 87700, 92164, 96985, 102194, 107814, 113887, 120448, 127530] },
    ],
  },
  {
    id: "pte",
    group: "other-ranks",
    pacmanHeading: "Seaman, Private, Aircraftman",
    names: { navy: "Seaman", army: "Private", airForce: "Aircraftman" },
    rows: [
      { increment: "0", salaries: [79096, 82322, 86453, 90919, 95741, 100947, 106572, 112644, 119203, 126292] },
    ],
  },
];

export const OFFICER_SALARIES: RankSalaryTable[] = [
  {
    id: "o6",
    group: "officers",
    pacmanHeading: "Captain, Colonel, Group Captain",
    names: { navy: "Captain", army: "Colonel", airForce: "Group Captain" },
    rows: [
      { increment: "O6-1", salaries: [192318, 197710, 203932, 209323, 215338, 222075, 228844, 236158, 243480, 248376] },
      { increment: "O6-0", salaries: [186934, 192324, 198552, 203938, 209953, 216693, 223452, 230777, 238100, 242990] },
    ],
  },
  {
    id: "o5",
    group: "officers",
    pacmanHeading: "Commander, Lieutenant Colonel, Wing Commander",
    names: { navy: "Commander", army: "Lieutenant Colonel", airForce: "Wing Commander" },
    rows: [
      { increment: "O5-1", salaries: [164718, 170113, 176340, 181730, 187741, 194479, 201244, 208567, 215886, 220780] },
      { increment: "O5-0", salaries: [159440, 164832, 171058, 176450, 182462, 189202, 195963, 203286, 210608, 215502] },
    ],
  },
  {
    id: "o4",
    group: "officers",
    pacmanHeading: "Lieutenant Commander, Major, Squadron Leader",
    names: { navy: "Lieutenant Commander", army: "Major", airForce: "Squadron Leader" },
    rows: [
      { increment: "O4-2", salaries: [137420, 142811, 149037, 154428, 160440, 167178, 173943, 181265, 188583, 193476] },
      { increment: "O4-1", salaries: [133718, 139113, 145336, 150726, 156738, 163481, 170243, 177565, 184887, 189775] },
      { increment: "O4-0", salaries: [130007, 135402, 141624, 147014, 153028, 159769, 166532, 173855, 181175, 186067] },
    ],
  },
  {
    id: "o3",
    group: "officers",
    pacmanHeading: "Lieutenant, Captain, Flight Lieutenant",
    names: { navy: "Lieutenant", army: "Captain", airForce: "Flight Lieutenant" },
    rows: [
      { increment: "O3-5", salaries: [123850, 129247, 135472, 140861, 146875, 153614, 160378, 167702, 175024, 179912] },
      { increment: "O3-4", salaries: [120330, 125724, 131950, 137344, 143354, 150093, 156855, 164176, 171501, 176389] },
      { increment: "O3-3", salaries: [116802, 122193, 128418, 133807, 139823, 146563, 153327, 160647, 167970, 172856] },
      { increment: "O3-2", salaries: [113290, 118688, 124909, 130298, 136314, 143052, 149813, 157140, 164463, 169351] },
      { increment: "O3-1", salaries: [109781, 115172, 121395, 126787, 132802, 139539, 146302, 153622, 160944, 165839] },
      { increment: "O3-0", salaries: [106257, 111646, 117869, 123260, 129275, 136012, 142778, 150100, 157417, 162312] },
    ],
  },
  {
    id: "o2",
    group: "officers",
    pacmanHeading: "Sub-Lieutenant, Lieutenant, Flying Officer",
    names: { navy: "Sub-Lieutenant", army: "Lieutenant", airForce: "Flying Officer" },
    rows: [
      { increment: "O2-3", salaries: [100259, 105647, 111872, 117264, 123270, 130010, 136778, 144101, 151421, 156316] },
      { increment: "O2-2", salaries: [97357, 102750, 108973, 114362, 120377, 127117, 133881, 141203, 148526, 153415] },
      { increment: "O2-1", salaries: [94508, 99899, 106126, 111517, 117527, 124265, 131030, 138356, 145675, 150567] },
      { increment: "O2-0", salaries: [91778, 97168, 103395, 108786, 114798, 121538, 128300, 135620, 142944, 147835] },
    ],
  },
  {
    id: "o1",
    group: "officers",
    pacmanHeading: "Acting Sub-Lieutenant, Second Lieutenant, Pilot Officer",
    names: { navy: "Acting Sub-Lieutenant", army: "Second Lieutenant", airForce: "Pilot Officer" },
    rows: [
      { increment: "O1-1", salaries: [89435, 94828, 101055, 106443, 112455, 119196, 125958, 133279, 140603, 145493] },
      { increment: "O1-0", salaries: [87091, 92486, 98708, 104099, 110113, 116850, 123618, 130935, 138260, 143150] },
    ],
  },
];

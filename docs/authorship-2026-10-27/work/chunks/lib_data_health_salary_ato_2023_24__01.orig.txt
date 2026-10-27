// ATO Taxation statistics 2023–24, Individuals Table 15: "Average and median
// taxable income, salary or wages, and total income, by occupation and sex,
// 2023–24 income year" (data.gov.au resource 3286e287…, file
// ts24individual15occupationsex.xlsx). Released 17 June 2026; "sourced from
// 2024 Individual income tax returns processed by 31 October 2025" (note 3).
// Read 9 October 2026 via Firecrawl's parse of the published spreadsheet.
//
// Every row below is transcribed verbatim, whole dollars, in the column order
// the ATO prints: individuals, average taxable income, median taxable income,
// average salary or wage income, median salary or wage income, average total
// income, median total income.
//
// Table 15A is by 6-digit occupation code (ATO salary and wage occupation
// codes, classified to ANZSCO 2024), 15B by unit group and 15D by unit group
// and state. Note 5: taxable income and total income averages and medians use
// everyone who reported at the label, zero or not; the salary or wage figures
// use only people who reported a non-zero salary or wage.
//
// Cross-check: the ATO media release "2023–24 Taxation Statistics released"
// (17 June 2026) says surgeons were the highest-paid occupation, "4,280
// individuals reporting an average taxable income of $519,998" — the 15B
// "2535 Surgeon" total row below, to the dollar.

import type { AtoRow, HealthSalarySource } from "./types";

export const ATO_INCOME_YEAR = "2023–24";

export const ATO_TABLE_15_URL =
  "https://data.gov.au/data/dataset/taxation-statistics-2023-24/resource/3286e287-ee87-4be4-87b2-56c5c6602009";

export const ATO_INDIVIDUALS_URL =
  "https://www.ato.gov.au/about-ato/research-and-statistics/in-detail/taxation-statistics/taxation-statistics-2023-24/statistics-in-taxation-statistics-2023-24/individuals-statistics-for-taxation-statistics-2023-24";

export const ATO_RELEASE_URL = "https://www.ato.gov.au/media-centre/2023-24-taxation-statistics-released";

export const ATO_TABLE_15_SOURCE: HealthSalarySource = {
  title: "Taxation statistics 2023–24, Individuals Table 15: average and median taxable income, salary or wages and total income, by occupation and sex",
  publisher: "Australian Taxation Office (data.gov.au)",
  url: ATO_TABLE_15_URL,
};

export const ATO_INDIVIDUALS_SOURCE: HealthSalarySource = {
  title: "Individuals statistics for Taxation statistics 2023–24",
  publisher: "Australian Taxation Office",
  url: ATO_INDIVIDUALS_URL,
};

/** Seven published columns, in the ATO's order. */
type Seven = [number, number, number, number, number, number, number];

function r(label: string, v: Seven): AtoRow {
  return {
    label,
    individuals: v[0],
    averageTaxableIncome: v[1],
    medianTaxableIncome: v[2],
    averageSalaryOrWages: v[3],
    medianSalaryOrWages: v[4],
    averageTotalIncome: v[5],
    medianTotalIncome: v[6],
  };
}

// ---------------------------------------------------------------------------
// Table 15A — by occupation (6-digit code) and sex.
// ---------------------------------------------------------------------------

export const ATO_15A = {
  dentist: [
    r("Total", [8_859, 162_722, 131_588, 108_448, 95_289, 174_021, 143_097]),
    r("Female", [4_858, 136_824, 117_693, 93_631, 81_727, 146_641, 126_073]),
    r("Male", [4_001, 194_166, 156_393, 126_704, 111_957, 207_267, 168_565]),
  ],
  dentalSpecialist: r("252311 Dental specialist", [1_045, 265_110, 154_164, 126_764, 89_440, 278_961, 167_165]),
  radiologist: [
    r("Total", [2_525, 500_262, 430_250, 383_218, 271_780, 525_048, 451_335]),
    r("Female", [998, 327_963, 209_418, 255_044, 146_504, 344_837, 226_917]),
    r("Male", [1_527, 612_871, 567_330, 467_867, 390_965, 642_828, 595_209]),
  ],
  radiationOncologist: r("253918 Radiation oncologist", [614, 412_937, 347_443, 294_812, 172_875, 433_207, 360_396]),
  anaesthetist: [
    r("Total", [3_735, 475_455, 457_287, 269_923, 235_037, 494_998, 479_642]),
    r("Female", [1_380, 386_868, 368_375, 238_465, 216_977, 406_431, 386_248]),
    r("Male", [2_355, 527_366, 516_292, 288_600, 248_966, 546_897, 534_374]),
  ],
  optometrist: [
    r("Total", [5_540, 107_824, 100_818, 86_992, 92_133, 114_240, 105_993]),
    r("Female", [3_426, 98_911, 94_689, 82_211, 87_058, 104_431, 99_461]),
    r("Male", [2_114, 122_270, 109_838, 94_773, 100_551, 130_139, 116_655]),
  ],
  orthoptist: r("251412 Orthoptist", [1_068, 76_095, 73_881, 70_736, 72_732, 79_634, 77_095]),
  gp: [
    r("Total", [27_776, 196_060, 156_733, 145_370, 122_319, 207_790, 168_497]),
    r("Female", [14_191, 169_131, 139_401, 129_322, 112_830, 180_323, 150_953]),
    r("Male", [13_585, 224_191, 176_809, 162_301, 137_500, 236_483, 187_869]),
  ],
  residentMedicalOfficer: r("253112 Medical officer – resident", [21_380, 140_129, 123_992, 129_927, 122_625, 149_588, 133_824]),
  /** Totals for each 6-digit surgical code in unit group 2535. */
  surgicalSpecialties: [
    r("Surgeon (general)", [1_900, 438_505, 335_144, 239_669, 208_000, 460_978, 356_883]),
    r("Cardiothoracic surgeon", [143, 607_511, 425_275, 337_953, 274_213, 630_688, 442_349]),
    r("Neurosurgeon", [176, 678_611, 537_049, 258_504, 216_904, 705_327, 567_926]),
    r("Orthopaedic surgeon", [981, 554_839, 434_435, 228_289, 183_864, 583_064, 456_699]),
    r("Otorhinolaryngologist (ENT surgeon)", [133, 631_559, 539_017, 213_933, 165_438, 668_856, 558_116]),
    r("Paediatric surgeon", [109, 386_014, 328_980, 276_946, 242_442, 404_022, 347_066]),
    r("Plastic and reconstructive surgeon", [352, 660_492, 525_793, 216_342, 171_845, 686_038, 548_165]),
    r("Urologist", [340, 586_462, 526_801, 206_390, 165_648, 621_021, 550_156]),
    r("Vascular surgeon", [146, 574_393, 504_690, 285_106, 239_809, 596_891, 526_029]),
  ],
} as const;

// ---------------------------------------------------------------------------
// Table 15B — by occupation unit group and sex.
// ---------------------------------------------------------------------------

export const ATO_15B = {
  /** 2535 Surgeon — the figure the ATO's release quotes. */
  surgeon: [
    r("Total", [4_280, 519_998, 403_069, 238_223, 200_000, 545_548, 427_081]),
    r("Female", [912, 338_220, 255_879, 203_492, 182_675, 358_950, 279_842]),
    r("Male", [3_368, 569_221, 463_301, 247_739, 206_385, 596_076, 487_555]),
  ],
  /** 2523 Dental practitioner (dentists plus dental specialists). */
  dentalPractitioner: r("2523 Dental practitioner", [9_904, 173_525, 133_248, 110_386, 94_643, 185_094, 144_637]),
  /** 2514 Optometrist or orthoptist. */
  optometristOrOrthoptist: r("2514 Optometrist or orthoptist", [6_608, 102_696, 94_689, 84_345, 87_688, 108_647, 99_823]),
  /** 2531 General medical practitioner (GPs plus resident medical officers). */
  generalMedicalPractitioner: r("2531 General medical practitioner", [49_156, 171_734, 138_205, 138_539, 122_497, 182_476, 149_282]),
  /** 2539 Other medical practitioners (radiologists and a dozen other specialties). */
  otherMedicalPractitioners: r("2539 Other medical practitioners", [32_087, 277_728, 179_192, 202_843, 151_270, 293_872, 193_188]),
} as const;

// ---------------------------------------------------------------------------
// Table 15D — by unit group and state. "Overseas" rows are omitted from the
// pages (people lodging from overseas), and so is any unit group that mixes
// the job with a different one in large numbers (2531 includes resident
// medical officers; 2539 includes a dozen specialties).
// ---------------------------------------------------------------------------

export const ATO_15D = {
  dentalPractitioner: [
    r("NSW", [2_930, 174_487, 135_288, 114_395, 100_000, 185_681, 145_971]),
    r("VIC", [2_389, 159_963, 119_285, 89_190, 72_365, 171_506, 129_021]),
    r("QLD", [2_394, 181_632, 138_994, 121_115, 107_770, 192_880, 148_658]),
    r("WA", [1_022, 177_131, 139_727, 106_488, 84_351, 190_049, 154_084]),
    r("SA", [681, 162_493, 141_788, 113_090, 97_808, 175_113, 151_290]),
    r("TAS", [179, 201_371, 162_637, 139_435, 129_999, 213_382, 173_974]),
    r("ACT", [217, 220_242, 169_121, 155_455, 122_500, 231_160, 174_155]),
    r("NT", [69, 195_788, 169_829, 136_200, 139_257, 207_825, 190_087]),
  ],
  anaesthetist: [
    r("NSW", [724, 424_496, 385_733, 185_670, 157_661, 440_366, 397_370]),
    r("VIC", [1_075, 519_317, 517_732, 290_699, 265_616, 538_965, 532_359]),
    r("QLD", [836, 512_400, 501_644, 320_550, 311_480, 532_150, 522_675]),
    r("WA", [525, 461_954, 427_328, 274_683, 264_372, 487_925, 465_555]),
    r("SA", [306, 429_798, 426_448, 276_182, 250_628, 447_205, 444_626]),
    r("TAS", [132, 426_781, 438_159, 241_393, 226_406, 448_569, 457_867]),
    r("ACT", [66, 478_133, 423_470, 326_291, 243_237, 495_308, 429_733]),
    r("NT", [34, 469_876, 477_836, 220_999, 201_081, 490_468, 489_960]),
  ],
  surgeon: [
    r("NSW", [951, 409_785, 272_842, 203_083, 180_346, 430_084, 291_978]),
    r("VIC", [1_368, 526_742, 412_684, 217_555, 189_235, 553_604, 433_082]),
    r("QLD", [915, 567_453, 492_536, 285_145, 223_504, 597_206, 517_718]),
    r("WA", [449, 609_719, 477_728, 274_917, 224_750, 636_690, 508_764]),
    r("SA", [360, 519_666, 427_674, 223_129, 205_765, 539_526, 446_499]),
    r("TAS", [94, 723_047, 592_445, 285_660, 223_986, 759_223, 608_352]),
    r("ACT", [73, 587_796, 430_034, 331_323, 271_457, 610_917, 462_143]),
    r("NT", [33, 574_020, 447_906, 244_396, 245_407, 618_972, 483_588]),
  ],
  optometristOrOrthoptist: [
    r("NSW", [2_185, 102_356, 92_063, 82_643, 85_036, 108_210, 96_772]),
    r("VIC", [1_954, 93_214, 86_418, 79_351, 81_078, 98_910, 91_658]),
    r("QLD", [1_264, 107_810, 102_860, 89_803, 92_643, 114_009, 108_147]),
    r("WA", [503, 116_272, 109_460, 88_792, 94_544, 122_828, 116_680]),
    r("SA", [430, 109_869, 104_021, 91_713, 98_766, 115_855, 108_343]),
    r("TAS", [108, 109_888, 105_468, 88_590, 95_159, 116_995, 110_845]),
    r("ACT", [112, 120_671, 104_349, 88_010, 94_137, 126_684, 110_041]),
    r("NT", [39, 127_037, 120_615, 104_477, 106_349, 133_002, 134_747]),
  ],
} as const;

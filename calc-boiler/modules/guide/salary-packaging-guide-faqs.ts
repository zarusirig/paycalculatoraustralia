// Shared FAQ copy for /salary-packaging-guide/ — rendered by the page's
// accordion and turned into FAQPage JSON-LD in app/salary-packaging-guide/page.tsx,
// so the structured data cannot drift from the page. Caps, gross-up rates and
// tax rates come from lib/constants.

import { MEDICARE_LEVY, TAX_BRACKETS, formatAUD, formatPercent } from "@/lib/constants";
import { FBT, FBT_CAPS, capFaceValue, reportableFringeBenefitsAmount } from "@/lib/constants/novated-lease";
import type { FaqItem } from "@/lib/faq";

const PBI_CAP = FBT_CAPS.pbiAndHealthPromotionCharity;
const HOSPITAL_CAP = FBT_CAPS.hospitalAndAmbulance;
const ENT_CAP = FBT_CAPS.salaryPackagedEntertainment;
const PBI_FACE = capFaceValue(PBI_CAP);
const HOSPITAL_FACE = capFaceValue(HOSPITAL_CAP);
const PBI_RFBA = reportableFringeBenefitsAmount(PBI_FACE);
const HOSPITAL_RFBA = reportableFringeBenefitsAmount(HOSPITAL_FACE);
const CENTRELINK_FACTOR = 1 - FBT.rate;

// Laptop example: taxed at the middle (30%) bracket.
const LAPTOP = 2_500;
const MID_RATE = TAX_BRACKETS[2].rate;

export const SALARY_PACKAGING_FAQS: readonly FaqItem[] = [
  {
    q: "What is the difference between salary packaging and salary sacrifice?",
    a: "They are the same arrangement. The ATO says salary sacrificing is also known as salary packaging or total remuneration packaging: you agree to take less pre-tax salary and your employer pays for benefits of similar value instead. The benefits can be extra super contributions, a novated car lease, a work-related laptop and, at some not-for-profit employers, living expenses and meal entertainment. What changes from one benefit to another is the FBT treatment, not the name.",
  },
  {
    q: "Who can package living expenses free of FBT, and how much?",
    a: `Employees of public benevolent institutions (PBIs) and health promotion charities have a ${formatAUD(PBI_CAP)} grossed-up cap per FBT year, about ${formatAUD(PBI_FACE)} of rent, mortgage or other GST-free expenses. Employees of public and not-for-profit hospitals and public ambulance services have a ${formatAUD(HOSPITAL_CAP)} grossed-up cap, about ${formatAUD(HOSPITAL_FACE)}. Both can add a separate ${formatAUD(ENT_CAP)} grossed-up cap (about ${formatAUD(capFaceValue(ENT_CAP))} face value) for salary-packaged meal entertainment. Rebatable employers get a partial FBT rebate rather than an exemption. Private sector employees cannot access these caps. They can still package super, a novated car lease and FBT-exempt work-related items such as a laptop. Other benefits can be packaged too, but the employer pays FBT on them unless an exemption applies.`,
  },
  {
    q: "What counts as meal entertainment?",
    a: "Meal entertainment includes restaurant and cafe dining, takeaway food and drink, catering for social functions, and food consumed at entertainment venues. It does not include regular grocery shopping, meals eaten at your desk, or sustenance food purchased during work travel. The expense must have a social or entertainment element.",
  },
  {
    q: "Does salary packaging affect my Centrelink payments?",
    a: `Salary packaging can affect your Centrelink payments. Services Australia adds your reportable fringe benefits amount (RFBA) to adjusted taxable income for Family Tax Benefit, Child Care Subsidy and Parental Leave Pay. For RFBA from a PBI, health promotion charity, public or not-for-profit hospital or public ambulance service, Services Australia counts only ${formatPercent(CENTRELINK_FACTOR, 0)} of it (1 minus the ${formatPercent(FBT.rate, 0)} FBT rate). A PBI employee's RFBA of about ${formatAUD(PBI_RFBA)} is therefore counted as about ${formatAUD(Math.round(PBI_RFBA * CENTRELINK_FACTOR))} (roughly the amount packaged), so income for these tests ends up close to what it would have been without packaging.`,
  },
  {
    q: "Does salary packaging reduce my HECS-HELP repayments?",
    a: `No, it usually increases them. HECS-HELP repayments are based on repayment income, which is taxable income plus the full grossed-up RFBA plus other reportable items. Packaging ${formatAUD(PBI_FACE)} at a PBI lowers taxable income by ${formatAUD(PBI_FACE)} but adds an RFBA of about ${formatAUD(PBI_RFBA)}, so repayment income rises by about ${formatAUD(PBI_RFBA - PBI_FACE)}. At a public hospital the rise is about ${formatAUD(HOSPITAL_RFBA - HOSPITAL_FACE)}.`,
  },
  {
    q: "Can private sector employees salary package a laptop?",
    a: `Yes. Until 31 March 2027, portable electronic devices used mainly for work are FBT-exempt regardless of employer type. You can package one laptop, one tablet, one mobile phone, and one GPS device per FBT year (${FBT.yearStart} to ${FBT.yearEnd}). The device must be used more than 50% for employment duties. A ${formatAUD(LAPTOP)} laptop at the ${formatPercent(MID_RATE, 0)} tax bracket plus the ${formatPercent(MEDICARE_LEVY.rate, 0)} Medicare levy saves ${formatAUD(LAPTOP * (MID_RATE + MEDICARE_LEVY.rate))} in tax. From 1 April 2027, work-related items provided through salary sacrifice are no longer exempt, so a laptop packaged from that date attracts FBT.`,
  },
  {
    q: "When does the FBT year run?",
    a: `The FBT year runs from ${FBT.yearStart} to ${FBT.yearEnd}, which is different from the financial year (1 July to 30 June). The current FBT year is ${FBT.yearLabel}. The ${formatAUD(PBI_CAP)}, ${formatAUD(HOSPITAL_CAP)} and ${formatAUD(ENT_CAP)} grossed-up caps reset on 1 April each year. They are not pro-rated: the ATO applies the full cap even if you only work for the employer for part of the FBT year.`,
  },
];

import type { Metadata } from "next";
import AnnualLeavePage from "@/modules/guide/annual-leave-calculator";
import { ANNUAL_LEAVE_CALCULATOR_FAQS } from "@/modules/guide/annual-leave-calculator-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";
import { ANNUAL_LEAVE, annualLeaveHoursPerYear } from "@/lib/constants/annual-leave";

// Oct core batch (5 Oct 2026): head term "annual leave calculator". Owns the
// accrual / balance intent. /leave-calculator/ was retargeted to the payout
// intent at the same time so the two do not compete for the same query.

const SLUG = "annual-leave-calculator";
const TITLE = "Annual Leave Calculator Australia: Hours, Balance & Payout";
const DESCRIPTION =
  "Annual leave calculator: 4 weeks a year (152 hours on a 38-hour week), accrual per pay, your balance, 17.5% loading and tax on a payout. Fair Work NES rules.";

// Meta pass 23 Oct 2026: the visible queries are hours-to-days conversions
// ("190 hours annual leave in days", "184 hours annual leave", "200 hours of
// annual leave in days", pos 6 to 11, CTR 0.3%). Payout belongs to
// /leave-calculator/, so the meta title swaps "Payout" for "Hours to Days" and
// the description answers with engine figures. TITLE/DESCRIPTION above still
// feed the JSON-LD unchanged.
const DAY_HOURS = ANNUAL_LEAVE.standardWeeklyHours / 5;
const FT_HOURS = annualLeaveHoursPerYear(ANNUAL_LEAVE.standardWeeklyHours);
const SHIFT_HOURS = annualLeaveHoursPerYear(ANNUAL_LEAVE.standardWeeklyHours, ANNUAL_LEAVE.shiftworkerWeeksPerYear);
const META_TITLE = "Annual Leave Calculator Australia: Hours to Days & Balance";
const META_DESCRIPTION = `${FT_HOURS} hours of annual leave is ${FT_HOURS / DAY_HOURS} days of ${DAY_HOURS} hours (${ANNUAL_LEAVE.weeksPerYear} weeks); ${SHIFT_HOURS} hours is ${SHIFT_HOURS / DAY_HOURS} days. Work out your accrual per pay, balance and its value with ${ANNUAL_LEAVE.loadingRate * 100}% loading.`;

export const metadata: Metadata = withFeaturedImage({
  title: META_TITLE,
  description: META_DESCRIPTION,
  alternates: { canonical: `https://pay-calculator-australia.com/${SLUG}/` },
  openGraph: { title: META_TITLE, description: META_DESCRIPTION, url: `https://pay-calculator-australia.com/${SLUG}/`, siteName: "Pay Calculator Australia", type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: META_TITLE, description: META_DESCRIPTION },
});

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "Annual Leave Calculator Australia: Hours, Balance and Payout",
  crumbs: [{ name: "Leave", path: "/annual-leave-guide/" }, { name: "Annual Leave Calculator", path: `/${SLUG}/` }],
  faqs: ANNUAL_LEAVE_CALCULATOR_FAQS,
  app: { name: "Annual Leave Calculator", description: "Calculates annual leave accrued under the National Employment Standards (4 weeks a year on ordinary hours), the balance after leave taken, its value with optional 17.5% loading, and the tax if it is paid out on leaving." },
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <AnnualLeavePage />
    </>
  );
}

export default withPageEnd(Page, "/annual-leave-calculator/");

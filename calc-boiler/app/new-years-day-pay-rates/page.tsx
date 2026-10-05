import type { Metadata } from "next";
import { SeasonalRoute, seasonalMetadata } from "@/modules/guide/seasonal-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";

export const metadata: Metadata = seasonalMetadata("new-years-day-pay-rates");

function Page() {
  return <SeasonalRoute slug="new-years-day-pay-rates" />;
}

export default withPageEnd(Page, "/new-years-day-pay-rates/");

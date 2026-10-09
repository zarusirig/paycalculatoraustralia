import type { Metadata } from "next";
import { SeasonalRoute, seasonalMetadata } from "@/modules/guide/seasonal-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

export const metadata: Metadata = withFeaturedImage(seasonalMetadata("new-years-day-pay-rates"));

function Page() {
  return <SeasonalRoute slug="new-years-day-pay-rates" />;
}

export default withPageEnd(Page, "/new-years-day-pay-rates/");

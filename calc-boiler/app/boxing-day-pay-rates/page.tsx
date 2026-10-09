import type { Metadata } from "next";
import { SeasonalRoute, seasonalMetadata } from "@/modules/guide/seasonal-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

export const metadata: Metadata = withFeaturedImage(seasonalMetadata("boxing-day-pay-rates"));

function Page() {
  return <SeasonalRoute slug="boxing-day-pay-rates" />;
}

export default withPageEnd(Page, "/boxing-day-pay-rates/");

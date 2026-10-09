import type { Metadata } from "next";
import { SeasonalRoute, seasonalMetadata } from "@/modules/guide/seasonal-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

export const metadata: Metadata = withFeaturedImage(seasonalMetadata("australia-day-public-holiday-pay"));

function Page() {
  return <SeasonalRoute slug="australia-day-public-holiday-pay" />;
}

export default withPageEnd(Page, "/australia-day-public-holiday-pay/");

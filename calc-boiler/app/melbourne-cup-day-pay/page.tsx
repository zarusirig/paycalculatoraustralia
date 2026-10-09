import type { Metadata } from "next";
import { SeasonalRoute, seasonalMetadata } from "@/modules/guide/seasonal-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

export const metadata: Metadata = withFeaturedImage(seasonalMetadata("melbourne-cup-day-pay"));

function Page() {
  return <SeasonalRoute slug="melbourne-cup-day-pay" />;
}

export default withPageEnd(Page, "/melbourne-cup-day-pay/");

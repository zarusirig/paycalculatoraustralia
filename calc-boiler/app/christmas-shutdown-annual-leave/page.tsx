import type { Metadata } from "next";
import { SeasonalRoute, seasonalMetadata } from "@/modules/guide/seasonal-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

export const metadata: Metadata = withFeaturedImage(seasonalMetadata("christmas-shutdown-annual-leave"));

function Page() {
  return <SeasonalRoute slug="christmas-shutdown-annual-leave" />;
}

export default withPageEnd(Page, "/christmas-shutdown-annual-leave/");

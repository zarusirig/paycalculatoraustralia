import type { Metadata } from "next";
import { SeasonalRoute, seasonalMetadata } from "@/modules/guide/seasonal-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";
import { withFeaturedImage } from "@/lib/featured-image";

export const metadata: Metadata = withFeaturedImage(seasonalMetadata("public-holidays-2027"));

function Page() {
  return <SeasonalRoute slug="public-holidays-2027" />;
}

export default withPageEnd(Page, "/public-holidays-2027/");

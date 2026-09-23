import type { Metadata } from "next";
import { AviationRoute, aviationMetadata } from "@/modules/guide/aviation-pay-route";
import { withPageEnd } from "@/components/common/content-slots";

// F5 (24 Sep 2026): Airservices Australia ATC enterprise agreement pay.
export const metadata: Metadata = aviationMetadata("air-traffic-controller");

function Page() {
  return <AviationRoute slug="air-traffic-controller" />;
}

export default withPageEnd(Page, "/air-traffic-controller-salary/");

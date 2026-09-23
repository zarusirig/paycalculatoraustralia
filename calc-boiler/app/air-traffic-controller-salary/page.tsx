import type { Metadata } from "next";
import { AviationRoute, aviationMetadata } from "@/modules/guide/aviation-pay-route";

// F5 (24 Sep 2026): Airservices Australia ATC enterprise agreement pay.
export const metadata: Metadata = aviationMetadata("air-traffic-controller");

export default function Page() {
  return <AviationRoute slug="air-traffic-controller" />;
}

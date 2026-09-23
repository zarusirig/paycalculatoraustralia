import type { Metadata } from "next";
import { AviationRoute, aviationMetadata } from "@/modules/guide/aviation-pay-route";

// F5 (24 Sep 2026): Air Pilots Award 2020 [MA000046] minimum pay.
export const metadata: Metadata = aviationMetadata("pilot");

export default function Page() {
  return <AviationRoute slug="pilot" />;
}

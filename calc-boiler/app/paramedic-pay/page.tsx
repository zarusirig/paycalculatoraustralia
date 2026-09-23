import type { Metadata } from "next";
import { ServiceHubRoute, serviceHubMetadata } from "@/modules/guide/service-pay-routes";

// F5 (24 Sep 2026): paramedic pay by state hub. Copy, metadata and schema live in
// modules/guide/service-pay-routes.tsx, shared with the other service hubs.
export const metadata: Metadata = serviceHubMetadata("paramedic");

export default function Page() {
  return <ServiceHubRoute occupation="paramedic" />;
}

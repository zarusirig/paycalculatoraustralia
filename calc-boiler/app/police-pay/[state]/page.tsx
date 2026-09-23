import type { Metadata } from "next";
import { ServiceStateRoute, serviceStateMetadata, serviceStateParams } from "@/modules/guide/service-pay-routes";

interface PageProps {
  params: Promise<{ state: string }>;
}

// Only states whose table was verified from a primary source get a page; the
// rest are listed on the hub with a link to the official source.
export const dynamicParams = false;

export async function generateStaticParams() {
  return serviceStateParams("police");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params;
  return serviceStateMetadata("police", state);
}

export default async function Page({ params }: PageProps) {
  const { state } = await params;
  return <ServiceStateRoute occupation="police" slug={state} />;
}

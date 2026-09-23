import type { Metadata } from "next";
import {
  PublicHolidayStateRoute,
  publicHolidayStateMetadata,
  publicHolidayStateParams,
} from "@/modules/guide/public-holiday-routes";

interface PageProps {
  params: Promise<{ state: string }>;
}

// Only states whose dates were read from the state government's own page are built.
export const dynamicParams = false;

export async function generateStaticParams() {
  return publicHolidayStateParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params;
  return publicHolidayStateMetadata(state);
}

export default async function Page({ params }: PageProps) {
  const { state } = await params;
  return <PublicHolidayStateRoute slug={state} />;
}

import type { Metadata } from "next";
import {
  PublicHolidayStateRoute,
  publicHolidayStateMetadata,
  publicHolidayStateParams,
} from "@/modules/guide/public-holiday-routes";
import { withPageEnd } from "@/components/common/content-slots";

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

async function Page({ params }: PageProps) {
  const { state } = await params;
  return <PublicHolidayStateRoute slug={state} />;
}

export default withPageEnd(Page, "/public-holiday-pay/[state]/");

import type { Metadata } from "next";
import { FyRoutePage, fyMetadata } from "@/modules/tax-tables/fy-page";
import { fyStaticParams } from "@/modules/tax-tables/fy-tax-table-data";
import { withPageEnd } from "@/components/common/content-slots";

interface PageProps {
  params: Promise<{ fy: string }>;
}

export function generateStaticParams() {
  return fyStaticParams();
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { fy } = await params;
  return fyMetadata("fortnightly", fy);
}

async function Page({ params }: PageProps) {
  const { fy } = await params;
  return <FyRoutePage frequency="fortnightly" rawFy={fy} />;
}

export default withPageEnd(Page, "/fortnightly-tax-table/[fy]/");

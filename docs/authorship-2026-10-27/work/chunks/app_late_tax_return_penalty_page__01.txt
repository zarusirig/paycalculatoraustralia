import type { Metadata } from "next";
import LateTaxReturnPenaltyPage from "@/modules/guide/late-tax-return-penalty";
import { LATE_TAX_RETURN_FAQS } from "@/modules/guide/late-tax-return-penalty-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { FTL_MAX_INDIVIDUAL, PENALTY_UNIT } from "@/lib/constants/tax-calendar-2026-27";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct 2026. Targets: late tax return penalty 390, tax return penalty 140
// (DataForSEO, AU; peaks 1,600 and 720 in Oct 2025).

const SLUG = "late-tax-return-penalty";
const URL = `${SITE_CONFIG.baseUrl}/${SLUG}/`;
const TITLE = "Late Tax Return Penalty: Failure to Lodge Calculator 2026";
const DESCRIPTION = `Late tax return penalty: ${formatAUD(PENALTY_UNIT.amount)} per 28 days overdue, up to ${formatAUD(FTL_MAX_INDIVIDUAL)}. Self-lodge deadline 31 Oct 2026. Calculate yours and see when the ATO waives it.`;

export const metadata: Metadata = withFeaturedImage({
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
});

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "Late Tax Return Penalty: Failure to Lodge Calculator (2026)",
  crumbs: [{ name: "Tax Return 2026", path: "/tax-return-2026/" }, { name: "Late Tax Return Penalty", path: `/${SLUG}/` }],
  faqs: LATE_TAX_RETURN_FAQS,
  app: { name: "Failure-to-Lodge Penalty Calculator", description: "Works out the maximum ATO failure-to-lodge penalty for a late individual tax return: one penalty unit per 28 days overdue, up to five units." },
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <LateTaxReturnPenaltyPage />
    </>
  );
}

export default withPageEnd(Page, "/late-tax-return-penalty/");

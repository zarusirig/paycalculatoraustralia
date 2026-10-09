import type { Metadata } from "next";
import WorkingAustraliansTaxOffsetPage from "@/modules/guide/working-australians-tax-offset";
import { WATO_FAQS } from "@/modules/guide/working-australians-tax-offset-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { SITE_CONFIG, formatAUD } from "@/lib/constants";
import { MAX_COMBINED_GAIN } from "@/lib/constants/tax-2027-28";
import { withFeaturedImage } from "@/lib/featured-image";

// Oct 2026. Targets: working australians tax offset 260, tax cuts 2027 10
// (DataForSEO, AU; re-spikes each Budget and in Jul 2027).

const SLUG = "working-australians-tax-offset";
const URL = `${SITE_CONFIG.baseUrl}/${SLUG}/`;
const TITLE = "Working Australians Tax Offset Calculator (WATO) 2027-28";
const DESCRIPTION = `The $250 Working Australians Tax Offset starts in 2027-28 with the rate cut to 14%. Compare take-home pay in 2027-28 and 2026-27: up to ${formatAUD(MAX_COMBINED_GAIN)} a year better off.`;

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
  headline: "Working Australians Tax Offset Calculator: $250 and the 14% Rate",
  crumbs: [{ name: "Tax Changes 2026-27", path: "/tax-changes-2026-27/" }, { name: "Working Australians Tax Offset", path: `/${SLUG}/` }],
  faqs: WATO_FAQS,
  app: { name: "Working Australians Tax Offset Calculator", description: "Compares take-home pay on the same salary under 2026-27 tax law and 2027-28 law: the 14% second rate and the $250 Working Australians Tax Offset." },
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <WorkingAustraliansTaxOffsetPage />
    </>
  );
}

export default withPageEnd(Page, "/working-australians-tax-offset/");

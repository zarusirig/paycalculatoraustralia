import type { Metadata } from "next";
import { SchoolSupportHubPage } from "@/modules/guide/school-support-pay";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { SCHOOL_SUPPORT_HUB_FAQS } from "@/lib/data/school-support-pay";
import { withPageEnd } from "@/components/common/content-slots";

// J6 (wave 4, 24 Sep 2026). Targets (DataForSEO AU): teacher aide pay /
// teacher aide salary / teacher aide pay rate 1.6k each, education support
// salary 1.3k.

const SLUG = "school-support-staff-pay";
const TITLE = "Teacher Aide Pay by State 2026 — School Support Staff Pay Rates";
const DESCRIPTION =
  "Teacher aide pay in government schools by state: NSW SLSO, VIC Education Support, QLD teacher aide, WA Education Assistant and SA SSO rates, with take-home pay.";
const URL = `https://pay-calculator-australia.com/${SLUG}/`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: "Pay Calculator Australia", type: "article", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

function Page() {
  return (
    <>
      {t3JsonLd({
        slug: SLUG,
        title: TITLE,
        description: DESCRIPTION,
        headline: "Teacher Aide Pay by State 2026: School Support Staff Pay Rates",
        crumbs: [
          { name: "Public Service Pay Scales", path: "/public-service-pay-scales/" },
          { name: "School Support Staff Pay", path: `/${SLUG}/` },
        ],
        faqs: [...SCHOOL_SUPPORT_HUB_FAQS],
        published: "2026-09-24",
      })}
      <SchoolSupportHubPage />
    </>
  );
}

export default withPageEnd(Page, "/school-support-staff-pay/");

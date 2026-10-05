import type { Metadata } from "next";
import CarryForwardConcessionalPage from "@/modules/guide/carry-forward-concessional-contributions";
import { CARRY_FORWARD_FAQS } from "@/modules/guide/carry-forward-concessional-faqs";
import { t3JsonLd } from "@/modules/guide/t3-seo";
import { withPageEnd } from "@/components/common/content-slots";
import { SITE_CONFIG, SUPER_GUARANTEE, formatAUD } from "@/lib/constants";
import { CARRY_FORWARD } from "@/lib/constants/super-contributions";

// Oct 2026. Target: carry forward concessional contributions 1.6k/mo
// (DataForSEO, AU; 4,400 in Jun, 1,300 in Aug, so seasonal into June 2027).

const SLUG = "carry-forward-concessional-contributions-calculator";
const URL = `${SITE_CONFIG.baseUrl}/${SLUG}/`;
const TITLE = "Carry-Forward Concessional Contributions Calculator 2026-27";
const DESCRIPTION = `Use unused super cap from the last 5 years on top of the ${formatAUD(SUPER_GUARANTEE.concessionalCap)} cap if your balance is under ${formatAUD(CARRY_FORWARD.totalSuperBalanceLimit)}. Year-by-year calculator with expiry dates.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: SITE_CONFIG.name, type: "article", locale: "en_AU", images: ["/og-image.png"] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const jsonLd = t3JsonLd({
  slug: SLUG,
  title: TITLE,
  description: DESCRIPTION,
  headline: "Carry-Forward Concessional Contributions Calculator (2026-27)",
  crumbs: [{ name: "Superannuation", path: "/superannuation-guide/" }, { name: "Carry-Forward Contributions", path: `/${SLUG}/` }],
  faqs: CARRY_FORWARD_FAQS,
  app: { name: "Carry-Forward Concessional Contributions Calculator", description: "Works out unused concessional cap amounts from the previous five years, which expire, and your total cap and remaining room for 2026-27." },
  published: "2026-10-05",
});

function Page() {
  return (
    <>
      {jsonLd}
      <CarryForwardConcessionalPage />
    </>
  );
}

export default withPageEnd(Page, "/carry-forward-concessional-contributions-calculator/");

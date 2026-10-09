import type { Metadata } from "next";
import HealthSalaryPageView, { healthSalaryMetadata, healthSalarySchemas } from "@/modules/guide/job-pay-rates-health-salary";
import { JsonLd } from "@/modules/seo/json-ld";
import { ORGANIZATION_SCHEMA } from "@/lib/schema";
import { getHealthSalaryPage } from "@/lib/data/health-salary";
import { withPageEnd } from "@/components/common/content-slots";

// Dentist salary (9 Oct 2026): ATO Taxation statistics 2023–24 Table 15, Jobs
// and Skills Australia, award and state schedules. Data: lib/data/health-salary.
// A static route, so it takes precedence over /job-pay-rates/[occupation]/.

const PAGE = getHealthSalaryPage("dentist");

export const metadata: Metadata = healthSalaryMetadata(PAGE);

function Page() {
  return (
    <>
      <JsonLd code={[...healthSalarySchemas(PAGE), ORGANIZATION_SCHEMA]} />
      <HealthSalaryPageView page={PAGE} />
    </>
  );
}

export default withPageEnd(Page, "/job-pay-rates/dentist/");

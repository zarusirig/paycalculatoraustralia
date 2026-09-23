// F8 (Lever D): CSV downloads for /australian-pay-report-2026/, generated at
// build time from the same data module the page renders, so the files can
// never disagree with the tables. Exported to
// out/australian-pay-report-2026/data/<file>.csv.
import { REPORT_CSV_FILES, isReportCsvFile, reportCsv } from "@/lib/data/pay-report";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return REPORT_CSV_FILES.map((f) => ({ file: f.file }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  if (!isReportCsvFile(file)) return new Response("Not found", { status: 404 });
  return new Response(reportCsv(file), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${file}"`,
    },
  });
}

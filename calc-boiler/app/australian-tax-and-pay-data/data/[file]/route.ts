// CSV and JSON downloads for /australian-tax-and-pay-data/, generated at build
// time from the same data module the page renders, so the files can never
// disagree with the tables. Exported to
// out/australian-tax-and-pay-data/data/<file>.
import { ALL_FILES, fileContent } from "@/lib/data/open-data";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ALL_FILES.map((file) => ({ file }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const out = fileContent(file);
  if (!out) return new Response("Not found", { status: 404 });
  return new Response(out.body, {
    headers: {
      "Content-Type": out.type,
      "Content-Disposition": `attachment; filename="${file}"`,
    },
  });
}

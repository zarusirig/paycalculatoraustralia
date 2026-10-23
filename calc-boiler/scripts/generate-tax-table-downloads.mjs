#!/usr/bin/env node
/**
 * Static PDF + CSV downloads of the 2026-27 weekly, fortnightly and monthly
 * PAYG withholding tables, written to public/downloads/ (copied into the
 * static export as-is) plus a small size manifest the pages read.
 *
 *   node scripts/generate-tax-table-downloads.mjs
 *   GENERATED_DATE=2026-10-23 node scripts/generate-tax-table-downloads.mjs
 *
 * Every amount comes from lib/constants/payg-withholding.ts, the same engine
 * the tax-table pages render (buildTaxTableRows / taxTableCsv), so a file can
 * never disagree with the page. Nothing here retypes a withholding figure.
 *
 * Range and step follow the ATO's own printed look-up PDFs (NAT 1005 / 1006 /
 * 1007, published 17 June 2026, read 23 October 2026): weekly $1 to $3,400 in
 * $1 steps, fortnightly $2 to $6,800 in $2 steps, monthly in the ATO's
 * weekly-dollar x 13/3 steps ($4.33, $8.67, $13.00 ...) to $12,675.00. Above
 * those amounts the ATO tables switch to a formula, and so do the files.
 *
 * The PDF writer is self-contained (no dependency): Helvetica text, Flate
 * compressed content streams, header row repeated in every column block,
 * page numbers, and a link to the ATO source on page 1.
 *
 * Node >= 22.18 strips the TypeScript types; the small resolve hook below lets
 * the engine's extensionless relative imports ("./australian-tax") load.
 */
import { register } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

register(
  "data:text/javascript," +
    encodeURIComponent(`
export async function resolve(spec, ctx, next) {
  try { return await next(spec, ctx); }
  catch (e) {
    if ((spec.startsWith("./") || spec.startsWith("../")) && !/\\.[cm]?[jt]sx?$/.test(spec)) return next(spec + ".ts", ctx);
    throw e;
  }
}`),
);

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const engine = await import(pathToFileURL(join(ROOT, "lib/constants/payg-withholding.ts")).href);
const ato = await import(pathToFileURL(join(ROOT, "modules/tax-tables/ato-schedules.ts")).href);

const { buildTaxTableRows, taxTableCsv, PAYG_YEAR_INFO, FREQUENCY_LABELS } = engine;

const FY = "2026-27";
const SITE = "pay-calculator-australia.com";
const OUT_DIR = join(ROOT, "public/downloads");
const MANIFEST = join(ROOT, "modules/tax-tables/downloads-manifest.json");
const generatedIso = process.env.GENERATED_DATE || new Date().toISOString().slice(0, 10);
const generatedLong = new Date(`${generatedIso}T00:00:00Z`).toLocaleDateString("en-AU", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/**
 * Earnings rows of the ATO's printed look-up tables (see header comment).
 * Monthly rows are each whole weekly dollar converted with x 13/3 and shown to
 * the cent, exactly as NAT 1007 prints them.
 */
const CYCLES = {
  weekly: {
    doc: ato.ATO_WEEKLY,
    earnings: () => Array.from({ length: 3_400 }, (_, i) => i + 1),
    cents: false,
  },
  fortnightly: {
    doc: ato.ATO_FORTNIGHTLY,
    earnings: () => Array.from({ length: 3_400 }, (_, i) => (i + 1) * 2),
    cents: false,
  },
  monthly: {
    doc: ato.ATO_MONTHLY,
    earnings: () => Array.from({ length: 2_925 }, (_, i) => Math.round(((i + 1) * 1_300) / 3) / 100),
    cents: true,
  },
};

/** One row per earnings amount, from the page's own row builder. */
export function rowsFor(frequency) {
  return CYCLES[frequency].earnings().flatMap((g) => buildTaxTableRows(frequency, FY, { from: g, to: g, step: 1 }));
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------
function thousands(n, decimals) {
  return n.toLocaleString("en-AU", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
const longDate = (iso) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Helvetica / Helvetica-Bold advance widths (Adobe AFM), chars 32..126.
// prettier-ignore
const W_REG = [278,278,355,556,556,889,667,222,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,278,278,584,584,584,556,1015,667,667,722,722,667,611,778,722,278,500,667,556,833,722,778,667,778,722,667,611,722,667,944,667,667,611,278,278,278,469,556,222,556,556,500,556,556,278,556,556,222,222,500,222,833,556,556,556,556,333,500,278,556,500,722,500,500,500,334,260,334,584];
// prettier-ignore
const W_BOLD = [278,333,474,556,556,889,722,278,333,333,389,584,278,333,278,278,556,556,556,556,556,556,556,556,556,556,333,333,584,584,584,611,975,722,722,722,722,667,611,778,722,278,556,722,611,833,722,778,667,778,722,667,611,722,667,944,667,667,611,333,278,333,584,556,278,556,611,556,611,556,333,611,611,278,278,556,278,889,611,611,611,611,389,556,333,611,556,778,556,556,500,389,280,389,584];

function textWidth(s, size, bold = false) {
  const w = bold ? W_BOLD : W_REG;
  let t = 0;
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    t += c >= 32 && c <= 126 ? w[c - 32] : 556;
  }
  return (t * size) / 1000;
}

function pdfString(s) {
  if (/[^\x20-\x7e]/.test(s)) throw new Error(`Non-ASCII text in PDF: ${JSON.stringify(s)}`);
  return `(${s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")})`;
}

// ---------------------------------------------------------------------------
// PDF
// ---------------------------------------------------------------------------
const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 32;
const GAP = 16;
const BLOCKS = 2;
const ROW_H = 10.4;
const HEAD_H = 22;
const BOTTOM = 46;
const BLOCK_W = (PAGE_W - 2 * MARGIN - GAP * (BLOCKS - 1)) / BLOCKS;
// Earnings column, then four withholding columns.
const COL_W = [BLOCK_W - 4 * 48, 48, 48, 48, 48];
const HEADERS = [
  ["", "earnings $"],
  ["With tax-free", "threshold $"],
  ["No tax-free", "threshold $"],
  ["Threshold +", "study loan $"],
  ["Foreign", "resident $"],
];

function buildPdf(frequency, rows) {
  const c = CYCLES[frequency];
  const period = FREQUENCY_LABELS[frequency];
  const periodly = `${period}ly`;
  const info = PAYG_YEAR_INFO[FY];
  const toLong = longDate(info.payDatesTo);
  const title = `${titleCase(periodly)} tax table ${FY} (calculated from ATO Schedule 1, ${c.doc.nat})`;
  const short = `${titleCase(periodly)} tax table ${FY} (${c.doc.nat})`;
  const last = rows[rows.length - 1].gross;
  const lastText = `$${thousands(last, c.cents ? 2 : 0)}`;
  const headers = HEADERS.map((h, i) => (i === 0 ? [titleCase(periodly), h[1]] : h));

  const intro = [
    { t: `Applies to ${info.appliesTo} to ${toLong} (ATO ${c.doc.title.toLowerCase()} ${c.doc.nat}, published ${c.doc.published}).`, b: false },
    { t: `Calculated by ${SITE} from the ATO Schedule 1 formula (${ato.ATO_SCHEDULE_1.nat}). This is not an official ATO document.`, b: true },
    { t: `ATO source: ${info.schedule1Url}`, b: false, link: info.schedule1Url },
    { t: `Official ATO table: ${c.doc.pageUrl}`, b: false, link: c.doc.pageUrl },
    { t: `How to use it: ignore cents, find the ${periodly} earnings (or the next lower amount shown) and read across.`, b: false },
    { t: `"Threshold + study loan" adds the Schedule 8 (${ato.ATO_SCHEDULE_8.nat}) study and training support loan amount to column 2.`, b: false },
    { t: `Rows end at ${lastText}, where the ATO table ends. Above that, use the Schedule 1 formula or ${SITE}/tax-withheld-calculator/`, b: false },
    { t: `Generated ${generatedLong}. Latest version: ${SITE}/${frequency}-tax-table/`, b: false },
  ];
  const INTRO_SIZE = 7.6;
  const INTRO_LEAD = 10.6;
  const firstTop = PAGE_H - MARGIN - 18 - 6 - intro.length * INTRO_LEAD - 8;
  const otherTop = PAGE_H - MARGIN - 16;
  const perBlock = (top) => Math.floor((top - HEAD_H - BOTTOM) / ROW_H);

  // Paginate.
  const pages = [];
  let i = 0;
  while (i < rows.length) {
    const top = pages.length === 0 ? firstTop : otherTop;
    const n = perBlock(top);
    const blocks = [];
    for (let b = 0; b < BLOCKS && i < rows.length; b++) {
      blocks.push(rows.slice(i, i + n));
      i += n;
    }
    pages.push({ top, blocks });
  }

  const fmtEarn = (g) => thousands(g, c.cents ? 2 : 0);
  const fmtAmt = (n) => (n === null ? "" : thousands(n, 0));

  const contents = pages.map((page, pi) => {
    const ops = [];
    const annots = [];
    const text = (s, x, y, size, bold = false) =>
      ops.push(`BT /${bold ? "F2" : "F1"} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td ${pdfString(s)} Tj ET`);
    const right = (s, xRight, y, size, bold = false) => text(s, xRight - textWidth(s, size, bold), y, size, bold);

    ops.push("0.05 0.16 0.29 rg"); // navy text
    if (pi === 0) {
      let y = PAGE_H - MARGIN - 14;
      text(title, MARGIN, y, 13.5, true);
      y -= 6;
      for (const line of intro) {
        y -= INTRO_LEAD;
        if (line.link) {
          const label = line.t.slice(0, line.t.indexOf(": ") + 2);
          const lw = textWidth(label, INTRO_SIZE, false);
          text(label, MARGIN, y, INTRO_SIZE, false);
          ops.push("0.0 0.40 0.32 rg");
          text(line.link, MARGIN + lw, y, INTRO_SIZE, false);
          ops.push("0.05 0.16 0.29 rg");
          const w = textWidth(line.link, INTRO_SIZE, false);
          annots.push({ rect: [MARGIN + lw, y - 2, MARGIN + lw + w, y + INTRO_SIZE], uri: line.link });
        } else {
          text(line.t, MARGIN, y, INTRO_SIZE, line.b);
        }
        if (textWidth(line.t, INTRO_SIZE, line.b) > PAGE_W - 2 * MARGIN) throw new Error(`Intro line too wide: ${line.t}`);
      }
    } else {
      text(short, MARGIN, PAGE_H - MARGIN - 4, 9, true);
      right(`Calculated by ${SITE} from ATO Schedule 1. Not an official ATO document.`, PAGE_W - MARGIN, PAGE_H - MARGIN - 4, 7);
    }

    page.blocks.forEach((blockRows, bi) => {
      const x0 = MARGIN + bi * (BLOCK_W + GAP);
      const yHead = page.top;
      // Header band.
      ops.push("0.93 0.91 0.87 rg");
      ops.push(`${x0.toFixed(2)} ${(yHead - HEAD_H).toFixed(2)} ${BLOCK_W.toFixed(2)} ${HEAD_H} re f`);
      ops.push("0.05 0.16 0.29 rg");
      let x = x0;
      headers.forEach((h, ci) => {
        const xr = x + COL_W[ci] - 4;
        right(h[0], xr, yHead - 9, 6.6, true);
        right(h[1], xr, yHead - 18, 6.6, true);
        x += COL_W[ci];
      });
      // Rows.
      blockRows.forEach((r, ri) => {
        const y = yHead - HEAD_H - (ri + 1) * ROW_H + 2.6;
        const cells = [fmtEarn(r.gross), fmtAmt(r.withTFT), fmtAmt(r.noTFT), fmtAmt(r.withTFTAndSTSL), fmtAmt(r.foreignResident)];
        let cx = x0;
        cells.forEach((s, ci) => {
          right(s, cx + COL_W[ci] - 4, y, 7.8, ci === 0);
          cx += COL_W[ci];
        });
        if ((ri + 1) % 5 === 0 && ri + 1 < blockRows.length) {
          const ly = yHead - HEAD_H - (ri + 1) * ROW_H;
          ops.push(`0.82 0.80 0.76 RG 0.4 w ${x0.toFixed(2)} ${ly.toFixed(2)} m ${(x0 + BLOCK_W).toFixed(2)} ${ly.toFixed(2)} l S`);
        }
      });
      const yEnd = yHead - HEAD_H - blockRows.length * ROW_H;
      ops.push(`0.70 0.68 0.64 RG 0.6 w ${x0.toFixed(2)} ${yEnd.toFixed(2)} m ${(x0 + BLOCK_W).toFixed(2)} ${yEnd.toFixed(2)} l S`);
    });

    // Footer.
    ops.push("0.35 0.35 0.35 rg");
    text(`${short}. ${SITE}. Generated ${generatedLong}.`, MARGIN, 26, 7);
    right(`Page ${pi + 1} of ${pages.length}`, PAGE_W - MARGIN, 26, 7);
    return { stream: ops.join("\n"), annots };
  });

  // Serialise.
  const objects = []; // index = object number - 1
  const add = (body) => {
    objects.push(body);
    return objects.length;
  };
  const catalog = add(null);
  const pagesObj = add(null);
  const f1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const f2 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const d = generatedIso.replace(/-/g, "");
  const infoObj = add(
    `<< /Title ${pdfString(title)} /Author ${pdfString(SITE)} /Subject ${pdfString(
      `PAYG withholding amounts for ${periodly} pay, ${FY}, calculated from the ATO Schedule 1 formula. Not an official ATO document.`,
    )} /Creator ${pdfString(`${SITE} generate-tax-table-downloads`)} /CreationDate (D:${d}000000Z) >>`,
  );
  const pageIds = [];
  for (const { stream, annots } of contents) {
    const compressed = deflateSync(Buffer.from(stream, "latin1"), { level: 9 });
    const contentId = add({ dict: `<< /Length ${compressed.length} /Filter /FlateDecode >>`, data: compressed });
    const annotIds = annots.map((a) =>
      add(
        `<< /Type /Annot /Subtype /Link /Rect [${a.rect.map((v) => v.toFixed(2)).join(" ")}] /Border [0 0 0] /A << /S /URI /URI ${pdfString(a.uri)} >> >>`,
      ),
    );
    const pageId = add(
      `<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${contentId} 0 R${
        annotIds.length ? ` /Annots [${annotIds.map((id) => `${id} 0 R`).join(" ")}]` : ""
      } >>`,
    );
    pageIds.push(pageId);
  }
  objects[catalog - 1] = `<< /Type /Catalog /Pages ${pagesObj} 0 R >>`;
  objects[pagesObj - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  const chunks = [Buffer.from("%PDF-1.4\n%\xe2\xe3\xcf\xd3\n", "latin1")];
  let offset = chunks[0].length;
  const offsets = [];
  objects.forEach((obj, idx) => {
    offsets.push(offset);
    const head = Buffer.from(`${idx + 1} 0 obj\n`, "latin1");
    const parts =
      typeof obj === "string"
        ? [head, Buffer.from(`${obj}\nendobj\n`, "latin1")]
        : [head, Buffer.from(`${obj.dict}\nstream\n`, "latin1"), obj.data, Buffer.from("\nendstream\nendobj\n", "latin1")];
    for (const p of parts) {
      chunks.push(p);
      offset += p.length;
    }
  });
  const xref = [`xref\n0 ${objects.length + 1}\n`, "0000000000 65535 f \n", ...offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`)].join("");
  chunks.push(
    Buffer.from(`${xref}trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R /Info ${infoObj} 0 R >>\nstartxref\n${offset}\n%%EOF\n`, "latin1"),
  );
  return { buffer: Buffer.concat(chunks), pages: pages.length };
}

// ---------------------------------------------------------------------------
// CSV: the page's own taxTableCsv, with the provenance lines added on top.
// ---------------------------------------------------------------------------
function buildCsv(frequency, rows) {
  const c = CYCLES[frequency];
  const periodly = `${FREQUENCY_LABELS[frequency]}ly`;
  const body = taxTableCsv(frequency, FY, rows);
  const extra = [
    `# ${titleCase(periodly)} tax table ${FY} (calculated from ATO Schedule 1, ${c.doc.nat}). Applies to ${PAYG_YEAR_INFO[FY].appliesTo} to ${longDate(PAYG_YEAR_INFO[FY].payDatesTo)}.`,
    `# Calculated by ${SITE} from the ATO formula. Not an official ATO document. Official ATO table: ${c.doc.pageUrl}`,
    `# Generated ${generatedLong}. Rows end where the ATO look-up table ends; above that the ATO uses a formula.`,
  ];
  return `${extra.join("\n")}\n${body}`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  mkdirSync(OUT_DIR, { recursive: true });
  const manifest = { fy: FY, generated: generatedIso, files: {} };
  for (const frequency of Object.keys(CYCLES)) {
    const rows = rowsFor(frequency);
    // Guard the monthly x 13/3 rows: each must map back to its own weekly dollar.
    if (frequency === "monthly") {
      rows.forEach((r, idx) => {
        const weekly = Math.floor(((Math.round(r.gross * 100) % 100 === 33 ? r.gross + 0.01 : r.gross) * 3) / 13);
        if (weekly !== idx + 1) throw new Error(`Monthly row ${r.gross} maps to weekly ${weekly}, expected ${idx + 1}`);
      });
    }
    const base = `${frequency}-tax-table-${FY}`;
    const pdf = buildPdf(frequency, rows);
    const csv = Buffer.from(buildCsv(frequency, rows), "utf8");
    writeFileSync(join(OUT_DIR, `${base}.pdf`), pdf.buffer);
    writeFileSync(join(OUT_DIR, `${base}.csv`), csv);
    const last = rows[rows.length - 1].gross;
    manifest.files[frequency] = {
      pdf: { href: `/downloads/${base}.pdf`, bytes: pdf.buffer.length, pages: pdf.pages },
      csv: { href: `/downloads/${base}.csv`, bytes: csv.length },
      rows: rows.length,
      step: frequency === "monthly" ? null : rows[1].gross - rows[0].gross,
      from: rows[0].gross,
      to: last,
    };
    console.log(`${base}: ${rows.length} rows, PDF ${pdf.pages} pages ${(pdf.buffer.length / 1024).toFixed(0)} KB, CSV ${(csv.length / 1024).toFixed(0)} KB`);
  }
  writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(`manifest: ${MANIFEST}`);
}

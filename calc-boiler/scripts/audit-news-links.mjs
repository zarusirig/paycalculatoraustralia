// Audits every /news/ page in out/: internal links resolve, ≥3 internal links per article,
// NewsArticle JSON-LD present, canonical present.
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = new URL("../out", import.meta.url).pathname;
const newsDir = join(OUT, "news");
let failures = 0;

const articleDirs = readdirSync(newsDir).filter((d) => statSync(join(newsDir, d)).isDirectory());
console.log(`Auditing ${articleDirs.length} news articles + hub`);

for (const dir of [...articleDirs.map((d) => join(newsDir, d)), newsDir]) {
  const file = join(dir, "index.html");
  const html = readFileSync(file, "utf8");
  const isArticle = dir !== newsDir;

  if (isArticle && !html.includes('"@type":"NewsArticle"')) {
    console.error(`FAIL ${dir}: missing NewsArticle JSON-LD`); failures++;
  }
  if (!html.includes('rel="canonical"')) {
    console.error(`FAIL ${dir}: missing canonical`); failures++;
  }

  const links = [...html.matchAll(/href="(\/[^"#?]*?)\/?(?:\?[^"]*)?"/g)]
    .map((m) => m[1])
    .filter((h) => !h.startsWith("/_next") && !h.startsWith("/images") && !/\.[a-z0-9]+$/i.test(h));
  const unique = [...new Set(links)];
  for (const href of unique) {
    const target = join(OUT, href.replace(/^\//, ""), "index.html");
    if (!existsSync(target)) { console.error(`FAIL ${dir}: broken internal link ${href}`); failures++; }
  }
  if (isArticle && unique.filter((h) => h !== "/").length < 3) {
    console.error(`FAIL ${dir}: fewer than 3 internal links`); failures++;
  }
}

if (failures) { console.error(`\n${failures} failure(s)`); process.exit(1); }
console.log("All news pages pass.");

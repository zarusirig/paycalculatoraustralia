// =============================================================================
// Featured images: the data contract in lib/data/featured-images.json, its
// files in public/, the lookup in lib/featured-image.ts, and the wiring every
// page relies on. Runs at every stage of the image roll-out: a route whose key
// has no image yet must fall back cleanly.
// =============================================================================

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

import {
  addFeaturedImageToJsonLd,
  featuredImageFor,
  featuredImageFromData,
  featuredOgImages,
  normaliseRoute,
  withFeaturedImage,
  type FeaturedImageData,
} from "../featured-image";

const ROOT = process.cwd();
const DATA: FeaturedImageData = JSON.parse(fs.readFileSync(path.join(ROOT, "lib/data/featured-images.json"), "utf8"));
const NURSE = "/job-pay-rates/nurse/";

test("every key in `images` has its three files in public/", () => {
  const missing: string[] = [];
  for (const key of Object.keys(DATA.images)) {
    for (const file of [`images/featured/${key}.webp`, `images/featured/${key}-640.webp`, `images/og/${key}.jpg`]) {
      if (!fs.existsSync(path.join(ROOT, "public", file))) missing.push(file);
    }
  }
  assert.deepEqual(missing, []);
});

test("every `images` entry is 1200x675 with alt text", () => {
  for (const [key, image] of Object.entries(DATA.images)) {
    assert.equal(image.width, 1200, key);
    assert.equal(image.height, 675, key);
    assert.ok(typeof image.alt === "string" && image.alt.trim().length > 0, `${key}: alt`);
  }
});

test("every route maps to a string key, and routes have leading and trailing slashes", () => {
  const routes = Object.entries(DATA.routes);
  // 719 after the 10 Oct 2026 numbered-page prune; guards against a truncated manifest.
  assert.ok(routes.length > 700, `only ${routes.length} routes`);
  assert.equal(DATA.routes["/"], "home");
  for (const [route, key] of routes) {
    assert.equal(typeof key, "string", route);
    assert.match(key, /^[a-z0-9-]+$/, route);
    assert.equal(normaliseRoute(route), route, `${route} is not normalised`);
  }
});

test("featuredImageFor returns the nurse image for /job-pay-rates/nurse/", () => {
  const expected = {
    src: "/images/featured/job-pay-rates--nurse.webp",
    src640: "/images/featured/job-pay-rates--nurse-640.webp",
    og: "/images/og/job-pay-rates--nurse.jpg",
    alt: DATA.images["job-pay-rates--nurse"].alt,
    width: 1200,
    height: 675,
  };
  assert.deepEqual(featuredImageFor(NURSE), expected);
  // Route normalisation: no slashes, one slash, absolute URL with query/hash.
  assert.deepEqual(featuredImageFor("job-pay-rates/nurse"), expected);
  assert.deepEqual(featuredImageFor("/job-pay-rates/nurse"), expected);
  assert.deepEqual(featuredImageFor("https://pay-calculator-australia.com/job-pay-rates/nurse/?a=1#b"), expected);
});

test("featuredImageFor returns null for a key without an image, and for an unknown route", () => {
  const fixture: FeaturedImageData = {
    routes: { "/with/": "has-image", "/without/": "no-image-yet" },
    images: { "has-image": { alt: "A thing", width: 1200, height: 675 } },
  };
  assert.equal(featuredImageFromData("/without/", fixture), null);
  assert.equal(featuredImageFromData("/not-in-the-map/", fixture), null);
  assert.equal(featuredImageFromData("/with/", fixture)?.src, "/images/featured/has-image.webp");
  // And against the real data, whatever stage the roll-out is at.
  assert.equal(featuredImageFor("/no-such-page/"), null);
  for (const [route, key] of Object.entries(DATA.routes)) {
    if (!DATA.images[key]) assert.equal(featuredImageFor(route), null, route);
  }
});

test("withFeaturedImage: og:image and twitter:image use the og jpg, or /og-image.png", () => {
  const nurse = withFeaturedImage({
    alternates: { canonical: `https://pay-calculator-australia.com${NURSE}` },
    openGraph: { title: "Nurse", type: "article" },
    twitter: { card: "summary_large_image", title: "Nurse" },
  });
  assert.deepEqual(nurse.openGraph?.images, featuredOgImages(NURSE));
  assert.equal((nurse.openGraph as { type?: string }).type, "article");
  assert.deepEqual(nurse.twitter?.images, [{ url: "/images/og/job-pay-rates--nurse.jpg", alt: DATA.images["job-pay-rates--nurse"].alt }]);

  const fake = withFeaturedImage({ alternates: { canonical: "https://pay-calculator-australia.com/no-such-page/" } });
  assert.deepEqual(fake.openGraph?.images, [{ url: "/og-image.png", width: 1200, height: 630, alt: "Pay Calculator Australia — Free Australian Pay Calculator" }]);
  assert.equal((fake.openGraph as { siteName?: string }).siteName, "Pay Calculator Australia");
});

test("addFeaturedImageToJsonLd: image on the WebPage/Article node, never mutating the input", () => {
  const webPage = { "@context": "https://schema.org", "@type": "WebPage", url: `https://pay-calculator-australia.com${NURSE}` };
  const frozen = Object.freeze({ ...webPage });
  const { schemas, applied } = addFeaturedImageToJsonLd([frozen], NURSE);
  assert.equal(applied, true);
  const node = schemas[0] as Record<string, { url?: string; width?: number; height?: number }>;
  assert.equal(node.primaryImageOfPage.url, "https://pay-calculator-australia.com/images/featured/job-pay-rates--nurse.webp");
  assert.equal(node.image.width, 1200);
  assert.equal(node.image.height, 675);
  assert.equal("image" in frozen, false);

  // No WebPage or Article node (a calculator page): one WebPage is added.
  const app = { "@context": "https://schema.org", "@type": "WebApplication", name: "Calc" };
  const added = addFeaturedImageToJsonLd([app], NURSE);
  assert.equal(added.schemas.length, 2);
  assert.equal((added.schemas[1] as { "@type": string })["@type"], "WebPage");
  assert.equal(addFeaturedImageToJsonLd([app], NURSE, { appendWebPage: false }).applied, false);

  // No image yet: untouched.
  const none = addFeaturedImageToJsonLd([webPage], "/no-such-page/");
  assert.equal(none.applied, false);
  assert.equal(none.schemas[0], webPage);
});

test("every app page.tsx sends its metadata through withFeaturedImage", () => {
  const offenders: string[] = [];
  const walk = (dir: string) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name === "page.tsx") {
        const src = fs.readFileSync(full, "utf8");
        const hasMetadata = /export const metadata\b|export (async )?function generateMetadata\b/.test(src);
        if (hasMetadata && !src.includes("withFeaturedImage(")) offenders.push(path.relative(ROOT, full));
      }
    }
  };
  walk(path.join(ROOT, "app"));
  assert.deepEqual(offenders, []);
});

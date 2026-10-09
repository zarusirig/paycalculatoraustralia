// Featured image for every page: one lookup used by the visible <figure>
// (components/common/featured-image.tsx), the og:image / twitter:image
// metadata (withFeaturedImage below), the JSON-LD (modules/seo/json-ld.tsx)
// and the sitemap (app/sitemap.ts).
//
// Data: lib/data/featured-images.json maps every sitemap route to an image
// key; `images` lists the keys whose files exist. Files for key K:
//   public/images/featured/K.webp      1200x675  page display
//   public/images/featured/K-640.webp   640x360  small screens (srcset)
//   public/images/og/K.jpg             1200x630  social share card
// A route whose key is not in `images` yet gets null here: no visible image,
// the default /og-image.png for social cards, no image in JSON-LD or sitemap.
//
// SERVER ONLY. The JSON covers ~1,100 routes; importing this file from a
// "use client" module would ship it to the browser.
//
// Relative imports (not "@/") so the node:test build in package.json can
// compile it.
import type { Metadata } from "next";
import data from "./data/featured-images.json";
import { SITE_CONFIG } from "./constants/australian-tax";

export interface FeaturedImage {
  /** 1200x675 webp, root-relative. */
  src: string;
  /** 640x360 webp, root-relative. */
  src640: string;
  /** 1200x630 jpg for social cards, root-relative. */
  og: string;
  alt: string;
  width: number;
  height: number;
}

/** Shape of lib/data/featured-images.json. */
export interface FeaturedImageData {
  routes: Record<string, string>;
  images: Record<string, { alt: string; width: number; height: number }>;
}

const DATA = data as FeaturedImageData;

/** The site-wide share card, used when a page has no featured image yet. */
export const DEFAULT_OG_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Pay Calculator Australia — Free Australian Pay Calculator",
} as const;

export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/**
 * "/job-pay-rates/nurse/" from "job-pay-rates/nurse", "/job-pay-rates/nurse",
 * "https://pay-calculator-australia.com/job-pay-rates/nurse/?x=1#y" etc.
 * The homepage is "/".
 */
export function normaliseRoute(route: string): string {
  let path = route.trim();
  const origin = path.match(/^[a-z][a-z0-9+.-]*:\/\/[^/?#]*/i);
  if (origin) path = path.slice(origin[0].length);
  path = path.replace(/[?#].*$/, "");
  if (!path.startsWith("/")) path = `/${path}`;
  if (!path.endsWith("/")) path = `${path}/`;
  return path.replace(/\/{2,}/g, "/");
}

/** The image key a route maps to, whether or not its image exists yet. */
export function featuredImageKey(route: string, data: FeaturedImageData = DATA): string | null {
  return data.routes[normaliseRoute(route)] ?? null;
}

/** The page's featured image, or null if the route has none (yet). */
export function featuredImageFor(route: string): FeaturedImage | null {
  return featuredImageFromData(route, DATA);
}

/** featuredImageFor against a given data set (the JSON, or a test fixture). */
export function featuredImageFromData(route: string, data: FeaturedImageData): FeaturedImage | null {
  const key = featuredImageKey(route, data);
  if (!key) return null;
  const image = data.images[key];
  if (!image) return null;
  return {
    src: `/images/featured/${key}.webp`,
    src640: `/images/featured/${key}-640.webp`,
    og: `/images/og/${key}.jpg`,
    alt: image.alt,
    width: image.width,
    height: image.height,
  };
}

/** Absolute URL for a root-relative path, e.g. for JSON-LD and the sitemap. */
export function absoluteUrl(path: string): string {
  return `${SITE_CONFIG.baseUrl}${path}`;
}

type OgImages = NonNullable<NonNullable<Metadata["openGraph"]>["images"]>;
type TwitterImages = NonNullable<NonNullable<Metadata["twitter"]>["images"]>;

/** Metadata `openGraph.images` for a route: its og jpg, or the default card. */
export function featuredOgImages(route: string): OgImages {
  const image = featuredImageFor(route);
  if (!image) return [{ ...DEFAULT_OG_IMAGE }];
  return [{ url: image.og, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: image.alt }];
}

/** Metadata `twitter.images` for a route (summary_large_image takes the og jpg). */
export function featuredTwitterImages(route: string): TwitterImages {
  const image = featuredImageFor(route);
  if (!image) return [{ url: DEFAULT_OG_IMAGE.url, alt: DEFAULT_OG_IMAGE.alt }];
  return [{ url: image.og, alt: image.alt }];
}

/** The route a page's metadata describes, from its canonical URL. */
export function routeFromMetadata(metadata: Metadata): string | null {
  const canonical = metadata.alternates?.canonical;
  const value =
    typeof canonical === "string"
      ? canonical
      : canonical instanceof URL
        ? canonical.href
        : canonical?.url instanceof URL
          ? canonical.url.href
          : canonical?.url;
  if (value) return normaliseRoute(value);
  const ogUrl = metadata.openGraph?.url;
  if (ogUrl) return normaliseRoute(ogUrl instanceof URL ? ogUrl.href : ogUrl);
  return null;
}

/** Fields the root layout's openGraph has, for pages that set none of their own. */
const BASE_OPEN_GRAPH = {
  type: "website",
  locale: "en_AU",
  siteName: SITE_CONFIG.name,
} as const;

/**
 * Every page.tsx in app/ passes its metadata through this
 * (lib/__tests__/featured-image.test.ts checks it):
 *
 *   export const metadata: Metadata = withFeaturedImage({ ...alternates: { canonical } ... });
 *   export async function generateMetadata(...) { return withFeaturedImage({...}); }
 *
 * It sets og:image and twitter:image to the page's featured og jpg when the
 * image exists, and to /og-image.png otherwise. The route comes from
 * `alternates.canonical` (else `openGraph.url`), so dynamic routes get their
 * real path. A page-level `openGraph` replaces the root layout's, so the
 * images must be set here rather than inherited.
 */
export function withFeaturedImage(metadata: Metadata, route?: string): Metadata {
  const path = route ? normaliseRoute(route) : routeFromMetadata(metadata);
  if (!path) return metadata;
  const twitter = (metadata.twitter ?? { card: "summary_large_image" }) as NonNullable<Metadata["twitter"]>;
  return {
    ...metadata,
    openGraph: { ...(metadata.openGraph ?? BASE_OPEN_GRAPH), images: featuredOgImages(path) },
    twitter: { ...twitter, images: featuredTwitterImages(path) } as Metadata["twitter"],
  };
}

// ─── JSON-LD ──────────────────────────────────────────────────────────────

type JsonObject = Record<string, unknown>;

const ARTICLE_TYPES = new Set(["Article", "NewsArticle", "BlogPosting", "Report", "TechArticle", "ScholarlyArticle"]);
// WebPage and its subtypes that describe the page as a whole. FAQPage is left
// out: here it always describes the FAQ section beside the page's own node.
const PAGE_TYPES = new Set(["WebPage", "CollectionPage", "AboutPage", "ContactPage", "ItemPage", "ProfilePage", "MedicalWebPage"]);

function typesOf(node: unknown): string[] {
  if (!node || typeof node !== "object") return [];
  const t = (node as JsonObject)["@type"];
  return Array.isArray(t) ? t.map(String) : typeof t === "string" ? [t] : [];
}
const isArticle = (node: unknown) => typesOf(node).some((t) => ARTICLE_TYPES.has(t));
const isPage = (node: unknown) => typesOf(node).some((t) => PAGE_TYPES.has(t));

/** schema.org ImageObject for a route's featured image, or null. */
export function featuredImageObject(route: string) {
  const image = featuredImageFor(route);
  if (!image) return null;
  const pageUrl = absoluteUrl(normaliseRoute(route));
  return {
    "@type": "ImageObject" as const,
    "@id": `${pageUrl}#primaryimage`,
    url: absoluteUrl(image.src),
    contentUrl: absoluteUrl(image.src),
    width: image.width,
    height: image.height,
  };
}

/**
 * Adds the route's featured image to its JSON-LD (modules/seo/json-ld.tsx
 * calls this for every <JsonLd> on a page):
 *
 * - Article / NewsArticle nodes get `image`, replacing the old /og-image.png.
 * - WebPage nodes (CollectionPage etc.) get `image` and `primaryImageOfPage`.
 * - An Article with no WebPage node beside it gets `primaryImageOfPage` on its
 *   `mainEntityOfPage` WebPage (primaryImageOfPage is a WebPage property).
 * - A page with neither (calculator pages: WebApplication + FAQPage only) gets
 *   a WebPage node carrying the image, when `appendWebPage` is true. JsonLd
 *   passes true only for the first <JsonLd> on the page that needs it, so the
 *   node is never added twice.
 *
 * Returns `{ schemas, applied }`; `applied` is false when nothing changed.
 * Never mutates its input: schema constants such as ORGANIZATION_SCHEMA are
 * shared across pages.
 */
export function addFeaturedImageToJsonLd<T>(
  schemas: T[],
  route: string,
  { appendWebPage = true }: { appendWebPage?: boolean } = {},
): { schemas: T[]; applied: boolean } {
  const imageObject = featuredImageObject(route);
  if (!imageObject) return { schemas, applied: false };
  const pageUrl = absoluteUrl(normaliseRoute(route));

  const nodes = schemas.flatMap((s) => {
    const graph = (s as JsonObject | null)?.["@graph"];
    return Array.isArray(graph) ? graph : [s];
  });
  const hasPage = nodes.some(isPage);
  const hasArticle = nodes.some(isArticle);

  const withImage = (node: unknown): unknown => {
    if (isPage(node)) return { ...(node as JsonObject), image: imageObject, primaryImageOfPage: imageObject };
    if (!isArticle(node)) return node;
    const article: JsonObject = { ...(node as JsonObject), image: imageObject };
    if (!hasPage) {
      const main = article.mainEntityOfPage;
      const mainPage: JsonObject =
        main && typeof main === "object" ? { ...(main as JsonObject) } : { "@type": "WebPage", "@id": typeof main === "string" ? main : pageUrl };
      if (!mainPage["@type"]) mainPage["@type"] = "WebPage";
      mainPage.primaryImageOfPage = imageObject;
      article.mainEntityOfPage = mainPage;
    }
    return article;
  };

  if (hasPage || hasArticle) {
    const out = schemas.map((s) => {
      const graph = (s as JsonObject | null)?.["@graph"];
      return (Array.isArray(graph) ? { ...(s as JsonObject), "@graph": graph.map(withImage) } : withImage(s)) as T;
    });
    return { schemas: out, applied: true };
  }

  if (!appendWebPage) return { schemas, applied: false };
  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageUrl,
    url: pageUrl,
    image: imageObject,
    primaryImageOfPage: imageObject,
  };
  return { schemas: [...schemas, webPage as T], applied: true };
}

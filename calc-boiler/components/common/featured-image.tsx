import { featuredImageFor } from "@/lib/featured-image";
import { getPageRoute } from "@/lib/page-route";
import { cn } from "@/lib/utils";

/**
 * The page's featured image (lib/featured-image.ts). Renders nothing when the
 * page has no image yet, so it is safe to place before the image exists.
 *
 * SERVER component: it reads the route withPageEnd recorded for this render
 * (lib/page-route.ts) and the route→image JSON, which must not reach a client
 * bundle. Client calculator modules get it through a prop or `children`.
 *
 * Placement (one per page):
 * - "intro": guides, award, pay-scale, occupation, programmatic and news pages
 *   with no calculator at the top. After the H1 and intro, before the first
 *   H2, normally inside the first screen, so it loads eagerly at normal
 *   priority (`fetchpriority="auto"`: the H1 stays the LCP candidate). Pass
 *   `lazy` where a long intro pushes it below the first phone screen.
 * - "content": calculator pages. After the calculator and its result, at the
 *   start of the explanatory content, lazy-loaded. It must never sit above a
 *   calculator: on the homepage and the top calculators the first input is
 *   kept within 600px of the top on a 390px phone (26 Sep 2026).
 *   WhatsNextInline renders this one for every calculator that uses it.
 */
export default function FeaturedImage({
  placement = "intro",
  lazy = placement === "content",
  route,
  className,
}: {
  placement?: "intro" | "content";
  lazy?: boolean;
  /** Defaults to the page being rendered. */
  route?: string;
  className?: string;
}) {
  const path = route ?? getPageRoute();
  const image = path ? featuredImageFor(path) : null;
  if (!image) return null;

  return (
    <figure data-featured-image={placement} className={cn("not-prose mx-auto my-8 w-full max-w-4xl", className)}>
      {/* A plain <img>: the export is static with unoptimized images, and the
          srcset below already serves the 640 or 1200 webp. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        srcSet={`${image.src640} 640w, ${image.src} 1200w`}
        sizes="(min-width: 960px) 896px, calc(100vw - 2rem)"
        width={image.width}
        height={image.height}
        alt={image.alt}
        decoding="async"
        loading={lazy ? "lazy" : "eager"}
        fetchPriority={lazy ? undefined : "auto"}
        className="block h-auto w-full rounded-xl border border-sandstone-dark/20 bg-sandstone/40 shadow-sm"
      />
    </figure>
  );
}

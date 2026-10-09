import type { Thing, WithContext } from "schema-dts";
import { addFeaturedImageToJsonLd } from "@/lib/featured-image";
import { getPageRoute, jsonLdImageApplied, markJsonLdImageApplied } from "@/lib/page-route";

type JsonLdProps<T extends Thing = Thing> = {
  code: WithContext<T> | WithContext<T>[];
};

export const JsonLd = <T extends Thing = Thing>({ code }: JsonLdProps<T>) => {
  // Handle both single schema and array of schemas
  let schemas = Array.isArray(code) ? code : [code];

  // The page's featured image goes on its WebPage / Article node (see
  // addFeaturedImageToJsonLd). The route comes from withPageEnd, which wraps
  // every page; outside a page (no route) the schemas pass through as given.
  const route = getPageRoute();
  if (route) {
    const result = addFeaturedImageToJsonLd(schemas, route, { appendWebPage: !jsonLdImageApplied() });
    if (result.applied) {
      schemas = result.schemas;
      markJsonLdImageApplied();
    }
  }

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: "This is a JSON-LD script, not user-generated content."
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};

export * from "schema-dts";

import type { Thing, WithContext } from "schema-dts";

type JsonLdProps<T extends Thing = Thing> = {
  code: WithContext<T> | WithContext<T>[];
};

export const JsonLd = <T extends Thing = Thing>({ code }: JsonLdProps<T>) => {
  // Handle both single schema and array of schemas
  const schemas = Array.isArray(code) ? code : [code];

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

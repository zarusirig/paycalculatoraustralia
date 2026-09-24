/**
 * seo-brain — typed SEO decision layer.
 *
 * Every signal the collector emits and every decision an AI (or a person)
 * proposes is a zod-validated value. Decisions that fail the schema or the
 * cross-checks in validate.mts never reach a page. The union below is closed:
 * a new kind of decision needs a new schema variant, a validator rule and a
 * verifier rule before anyone can emit it.
 */
import { z } from "zod";

export const TITLE_MAX = 65;
export const TITLE_MIN = 25;
export const DESCRIPTION_MAX = 165;
export const DESCRIPTION_MIN = 70;

export const Route = z
  .string()
  .regex(/^\/([a-z0-9-]+\/)*$/, "route must be root-relative, lowercase, trailing slash: /x/ or /x/y/")
  .describe("Site route, e.g. /fortnightly-pay-calculator/");
export type Route = z.infer<typeof Route>;

export const Level = z.enum([
  "technical", // crawl / render / indexation hygiene
  "ctr", // title + description against impressions
  "striking", // page ranks 4–20 for volume; content additions to move it
  "cannibal", // two of our URLs compete for one query
  "links", // internal link and anchor decisions
  "schema", // JSON-LD coverage and AI-citation readiness
  "expansion", // new in-border nodes
]);
export type Level = z.infer<typeof Level>;

export const Template = z.enum([
  "home",
  "calculator",
  "guide",
  "tax-table",
  "award",
  "employer",
  "job",
  "programmatic-salary",
  "state",
  "centrelink",
  "news",
  "hub",
  "legal",
  "other",
]);
export type Template = z.infer<typeof Template>;

// ---------- Signals (collector output) ----------

export const GscRow = z.object({
  clicks: z.number().int().nonnegative(),
  impressions: z.number().int().nonnegative(),
  ctr: z.number().min(0).max(1),
  position: z.number().positive(),
});

export const RankedKeyword = z.object({
  kw: z.string().min(1),
  vol: z.number().int().nonnegative(),
  kd: z.number().int().min(0).max(100).nullable(),
  intent: z.string().nullable(),
  pos: z.number().int().positive(),
});
export type RankedKeyword = z.infer<typeof RankedKeyword>;

export const PageSignals = z.object({
  route: Route,
  template: Template,
  noindex: z.boolean(),
  title: z.string(),
  description: z.string(),
  canonical: z.string(),
  h1: z.string(),
  h2s: z.array(z.string()),
  h3Count: z.number().int().nonnegative(),
  wordCount: z.number().int().nonnegative(),
  tableCount: z.number().int().nonnegative(),
  /** First ~320 chars of main-content prose after the H1 (AI-citation lead). */
  lead: z.string(),
  leadHasNumber: z.boolean(),
  schemaTypes: z.array(z.string()),
  hasFaqSchema: z.boolean(),
  faqCount: z.number().int().nonnegative(),
  ogImage: z.boolean(),
  /** Links to ato.gov.au, fairwork.gov.au, servicesaustralia.gov.au, legislation.gov.au, fwc.gov.au */
  primarySourceLinks: z.number().int().nonnegative(),
  outlinks: z.array(Route),
  inlinkCount: z.number().int().nonnegative(),
  /** Distinct anchors used by other pages to link here (lower-cased). */
  inlinkAnchors: z.array(z.string()),
  sitemapLastmod: z.string().nullable(),
  sitemapPriority: z.number().nullable(),
  gsc: GscRow.nullable(),
  ranked: z.array(RankedKeyword),
});
export type PageSignals = z.infer<typeof PageSignals>;

export const SiteSignals = z.object({
  generatedAt: z.string(),
  buildCommit: z.string(),
  dataDate: z.string(),
  pages: z.array(PageSignals),
  /** Global GSC query rows (no page attribution in the export). */
  queries: z.array(z.object({ query: z.string(), clicks: z.number(), impressions: z.number(), ctr: z.number(), position: z.number() })),
  /** Competitor-gap rows we do not rank for at all. */
  unowned: z.array(z.object({ kw: z.string(), vol: z.number(), kd: z.number().nullable(), best: z.string(), burl: z.string(), ncomp: z.number() })),
});
export type SiteSignals = z.infer<typeof SiteSignals>;

// ---------- Opportunities (collector output, ranked) ----------

export const Opportunity = z.object({
  id: z.string(),
  level: Level,
  route: Route.nullable(),
  score: z.number(),
  summary: z.string(),
  facts: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.string())])),
});
export type Opportunity = z.infer<typeof Opportunity>;

// ---------- Decisions (AI output, validated) ----------

const Evidence = z.object({
  gsc: GscRow.nullable().optional(),
  keywords: z.array(RankedKeyword).default([]),
  note: z.string().max(600).optional(),
});

const base = {
  id: z.string().regex(/^[a-z]+-[a-z0-9-]+-\d{1,3}$/, "id like ctr-fortnightly-pay-calculator-1"),
  level: Level,
  priority: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  rationale: z.string().min(40).max(900),
  evidence: Evidence,
  /** The queries this decision is meant to move. Validator warns if none are in the data. */
  targetQueries: z.array(z.string().min(2)).min(1),
};

export const RewriteTitle = z.object({
  ...base,
  kind: z.literal("rewrite_title"),
  route: Route,
  current: z.string(),
  proposed: z
    .string()
    .min(TITLE_MIN)
    .max(TITLE_MAX)
    .refine((t) => !/\s{2,}/.test(t) && !/[|]{2,}/.test(t), "no double spaces / pipes")
    .refine((t) => !/\b(best|ultimate|#1|top)\b/i.test(t), "no hype words in YMYL titles"),
  /** Tokens from the current title that must survive (protects existing rankings). */
  keepTokens: z.array(z.string()).default([]),
});

export const RewriteDescription = z.object({
  ...base,
  kind: z.literal("rewrite_description"),
  route: Route,
  current: z.string(),
  proposed: z
    .string()
    .min(DESCRIPTION_MIN)
    .max(DESCRIPTION_MAX)
    .refine((d) => /\d/.test(d), "description must contain a concrete figure"),
  /** Figures inside the description must come from constants; name the source symbol. */
  figureSource: z.string().min(3),
});

export const AddSection = z.object({
  ...base,
  kind: z.literal("add_section"),
  route: Route,
  heading: z.string().min(8).max(90),
  placement: z.enum(["after_intro", "after_calculator", "before_faq", "end"]),
  /** 3–8 bullets an implementer must cover. Figures are named by constant, never typed. */
  outline: z.array(z.string().min(10)).min(3).max(8),
  /** Primary source URL(s) the section must cite. */
  sources: z.array(z.string().url()).min(1),
  wordBudget: z.number().int().min(80).max(600),
});

export const AddFaq = z.object({
  ...base,
  kind: z.literal("add_faq"),
  route: Route,
  question: z.string().min(12).max(140).refine((q) => q.trim().endsWith("?"), "question ends with ?"),
  answerOutline: z.string().min(40).max(500),
  sources: z.array(z.string().url()).default([]),
});

export const AddInternalLink = z.object({
  ...base,
  kind: z.literal("add_internal_link"),
  fromRoute: Route,
  toRoute: Route,
  anchor: z.string().min(3).max(70),
  placement: z.enum(["related_links", "in_content", "nav"]),
});

export const Consolidate = z.object({
  ...base,
  kind: z.literal("consolidate"),
  keepRoute: Route,
  loserRoutes: z.array(Route).min(1),
  method: z.enum(["retarget_loser", "canonical_to_keeper", "redirect_301", "differentiate"]),
  /** For retarget/differentiate: the query the loser should own instead. */
  loserNewQuery: z.string().optional(),
});

export const AddSchema = z.object({
  ...base,
  kind: z.literal("add_schema"),
  scope: z.union([Route, z.object({ template: Template })]),
  schemaType: z.enum(["FAQPage", "BreadcrumbList", "Dataset", "HowTo", "Article", "WebApplication", "Table", "ItemList", "Speakable", "Organization"]),
  requiredFields: z.array(z.string()).min(1),
});

export const CitationLead = z.object({
  ...base,
  kind: z.literal("citation_lead"),
  route: Route,
  /** Proposed first sentence(s): definition + figure + FY. Figures by constant name in [[ ]]. */
  proposedLead: z.string().min(60).max(420).refine((s) => /\[\[[A-Za-z0-9_.]+\]\]|\d/.test(s), "lead carries a figure or a [[CONSTANT]] placeholder"),
  addPrimarySource: z.string().url().optional(),
});

export const TechnicalFix = z.object({
  ...base,
  kind: z.literal("technical_fix"),
  scope: z.union([Route, z.literal("*"), z.object({ template: Template })]),
  issue: z.enum(["missing_og_image", "thin_page", "no_h2", "no_schema", "noindex_in_sitemap", "orphan", "slow_template", "duplicate_title", "duplicate_description", "long_title", "long_description", "missing_primary_source", "other"]),
  fix: z.string().min(20).max(600),
});

export const NewPage = z.object({
  ...base,
  kind: z.literal("new_page"),
  route: Route,
  title: z.string().min(TITLE_MIN).max(TITLE_MAX),
  template: Template,
  /** Contextual border — all three must be true (contextual-borders-and-audience-map.md). */
  border: z.object({
    linksToCalculator: z.literal(true),
    degreesFromCentralEntity: z.number().int().min(1).max(3),
    helpsCheckNextPayslip: z.literal(true),
  }),
  outline: z.array(z.string().min(10)).min(4).max(12),
  sources: z.array(z.string().url()).min(1),
  /** Existing routes that must link to it on launch. */
  inlinksFrom: z.array(Route).min(2),
});

export const NoAction = z.object({
  ...base,
  kind: z.literal("no_action"),
  route: Route.nullable(),
});

export const Decision = z.discriminatedUnion("kind", [
  RewriteTitle,
  RewriteDescription,
  AddSection,
  AddFaq,
  AddInternalLink,
  Consolidate,
  AddSchema,
  CitationLead,
  TechnicalFix,
  NewPage,
  NoAction,
]);
export type Decision = z.infer<typeof Decision>;

export const DecisionBatch = z.object({
  level: Level,
  author: z.string().min(2),
  createdAt: z.string(),
  signalsGeneratedAt: z.string(),
  decisions: z.array(Decision).min(1),
});
export type DecisionBatch = z.infer<typeof DecisionBatch>;

/** Expected organic CTR by average position (blend of industry curves and this site's own GSC). */
export function expectedCtr(position: number): number {
  const curve: [number, number][] = [
    [1, 0.27], [2, 0.15], [3, 0.10], [4, 0.07], [5, 0.05], [6, 0.04], [7, 0.032], [8, 0.026],
    [9, 0.022], [10, 0.019], [12, 0.013], [15, 0.009], [20, 0.006], [30, 0.003], [50, 0.001],
  ];
  if (position <= 1) return curve[0][1];
  for (let i = 1; i < curve.length; i++) {
    const [p1, c1] = curve[i - 1];
    const [p2, c2] = curve[i];
    if (position <= p2) return c1 + ((position - p1) / (p2 - p1)) * (c2 - c1);
  }
  return 0.001;
}

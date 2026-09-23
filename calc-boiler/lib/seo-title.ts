/**
 * Google cuts <title> at roughly 600px (~60–65 characters). Templates whose
 * title length depends on data (award names, employer names, occupations)
 * list their forms fullest-first and take the first that fits.
 * scripts/check-meta.mjs warns on anything longer in the build.
 */
export const TITLE_MAX = 65;
export const DESCRIPTION_MAX = 165;

/** First form within TITLE_MAX characters, else the shortest form given last. */
export function fitTitle(...forms: string[]): string {
  return forms.find((t) => t.length <= TITLE_MAX) ?? forms[forms.length - 1];
}

/**
 * Descriptions: first form within DESCRIPTION_MAX, else the last form cut at
 * the last sentence end that fits (never mid-word).
 */
export function fitDescription(...forms: string[]): string {
  const fit = forms.find((d) => d.length <= DESCRIPTION_MAX);
  if (fit) return fit;
  const last = forms[forms.length - 1];
  const cut = last.slice(0, DESCRIPTION_MAX);
  const stop = (cut + " ").lastIndexOf(". ");
  if (stop > 80) return cut.slice(0, stop + 1);
  const words = cut.slice(0, DESCRIPTION_MAX - 1);
  return words.slice(0, words.lastIndexOf(" ")).replace(/[,;:—–-]\s*$/, "") + "…";
}

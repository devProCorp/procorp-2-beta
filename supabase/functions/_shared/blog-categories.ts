// Single source of truth for the 5 real Journal categories, shared between
// get-blog-posts (read) and publish-blog-post (write). Keep this in sync
// with the CATEGORY_TABLE in web/scripts/snapshot-supabase.mjs — that copy
// exists because .mjs build scripts can't import from supabase/functions.
export const CATEGORIES: { id: number; name: string; slug: string }[] = [
  { id: 56, name: "Ciudadanía europea", slug: "ciudadania-europea" },
  { id: 57, name: "Emigrar a España", slug: "emigrar-a-espana" },
  { id: 58, name: "Emigrar a Portugal", slug: "emigrar-a-portugal" },
  { id: 59, name: "Vivir en Europa", slug: "vivir-en-europa" },
  {
    id: 156,
    name: "Nacionalidad española por origen sefardí",
    slug: "nacionalidad-espanola-por-origen-sefardi",
  },
];

const FALLBACK_CATEGORY_ID = 59; // "Vivir en Europa" — same fallback the original WP migration used.

const DIACRITICS_RE = /[̀-ͯ]/g;

function foldDiacritics(value: string): string {
  return value.normalize("NFD").replace(DIACRITICS_RE, "").toLowerCase();
}

/** Resolves a caller-supplied category (id, slug, or name — case/diacritic-insensitive) to a real category. */
export function resolveCategory(input: string | number | undefined | null): {
  id: number;
  name: string;
  inferred: boolean;
} {
  if (input !== undefined && input !== null && input !== "") {
    const asId = typeof input === "number" ? input : Number(input);
    if (Number.isInteger(asId)) {
      const byId = CATEGORIES.find((c) => c.id === asId);
      if (byId) return { id: byId.id, name: byId.name, inferred: false };
    }
    const normalized = foldDiacritics(String(input).trim());
    const byName = CATEGORIES.find(
      (c) => c.slug === normalized || foldDiacritics(c.name) === normalized
    );
    if (byName) return { id: byName.id, name: byName.name, inferred: false };
  }
  const fallback = CATEGORIES.find((c) => c.id === FALLBACK_CATEGORY_ID)!;
  return { id: fallback.id, name: fallback.name, inferred: true };
}

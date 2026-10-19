// Categorías del blog: id/slug como en blog.posts.category_ids y nombre por
// idioma. Mantener en sincronía con supabase/functions/_shared/blog-categories.ts,
// la copia de publish-blog-post y CATEGORY_TABLE de journal-live.ts y
// scripts/snapshot-supabase.mjs. Si aparece una categoría sin traducción, se
// muestra su nombre original.
export const CAT_NAMES: Record<string, Record<string, string>> = {
  "ciudadania-europea": { en: "European Citizenship", es: "Ciudadanía europea", pt: "Cidadania europeia" },
  "emigrar-a-espana": { en: "Moving to Spain", es: "Emigrar a España", pt: "Emigrar para a Espanha" },
  "emigrar-a-portugal": { en: "Moving to Portugal", es: "Emigrar a Portugal", pt: "Emigrar para Portugal" },
  "nacionalidad-espanola-por-origen-sefardi": { en: "Spanish Nationality by Sephardic Origin", es: "Nacionalidad española por origen sefardí", pt: "Nacionalidade espanhola por origem sefardita" },
  "vivir-en-europa": { en: "Living in Europe", es: "Vivir en Europa", pt: "Viver na Europa" },
  "ingenieria-de-negocios": { en: "Business Engineering", es: "Ingeniería de Negocios", pt: "Engenharia de Negócios" },
  "inversiones": { en: "Investments", es: "Inversiones", pt: "Investimentos" },
  "actualidad-internacional": { en: "International Affairs", es: "Actualidad internacional", pt: "Atualidade internacional" },
  "uncategorized": { en: "Uncategorized", es: "Sin categoría", pt: "Sem categoria" },
};

export const catName = (slug: string, fallback: string, lang: string) =>
  CAT_NAMES[slug]?.[lang] ?? fallback;

export const DATE_LOCALE: Record<string, string> = { en: "en-US", es: "es-ES", pt: "pt-PT" };

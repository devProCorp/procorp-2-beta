/**
 * Profession and office shown under the author's name on an article.
 * `blog.posts` only stores `author_name`, so the details live here, keyed by
 * that exact name. Values are LanguageContext keys; offices are the ones on
 * /contact (Bogotá and Madrid). Authors not listed show only their name.
 */
const AUTHOR_DETAILS: Record<string, { role: string; office: string }> = {
  "Humberto Calderón": { role: "journal.author.lawyer.m", office: "journal.author.office.madrid" },
  "Andrea Celis": { role: "journal.author.lawyer.f", office: "journal.author.office.madrid" },
};

export function getAuthorDetails(name: string) {
  return AUTHOR_DETAILS[name.trim()] ?? null;
}

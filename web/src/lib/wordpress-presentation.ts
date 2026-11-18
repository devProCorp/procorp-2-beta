/**
 * Presentation half of the journal snapshot reader: the WPPost shape and the
 * pure helpers that derive display values from it.
 *
 * Split out of wordpress.ts because that module reads the snapshot from disk
 * with node:fs — importing it from a client component would pull fs into the
 * browser bundle. The static export filters the journal client-side, so these
 * helpers had to become importable from both sides. wordpress.ts re-exports
 * everything here, so server-side imports are unchanged.
 */

// ─── Types ────────────────────────────────────────────────────────

export interface WPAuthor {
  id: number;
  name: string;
  description: string;
  slug: string;
  avatar_urls: Record<string, string>;
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  categories: number[];
  tags: number[];
  author: number;
  /** Blogcast audio, migrated from WordPress into Supabase — absent on posts without one. */
  audio_url?: string;
  /** Minutes to read the text, measured from the article itself (readingMinutes). */
  reading_minutes?: number;
  /** Yoast SEO fields, migrated 1:1 from WordPress — prefer these over derived values when present. */
  seo_title?: string;
  seo_description?: string;
  seo_canonical?: string;
  seo_og_image_url?: string;
  seo_schema?: unknown;
  _embedded?: {
    author?: WPAuthor[];
    "wp:featuredmedia"?: WPMedia[];
    "wp:term"?: WPTerm[][];
  };
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details: {
    width: number;
    height: number;
    sizes: Record<
      string,
      { source_url: string; width: number; height: number }
    >;
  };
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// ─── Helpers ──────────────────────────────────────────────────────

export function getFeaturedImageUrl(
  post: WPPost,
  size: "medium_large" | "large" | "full" = "medium_large"
): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;
  return media.media_details?.sizes?.[size]?.source_url ?? media.source_url;
}

export function getFeaturedImageAlt(post: WPPost): string {
  return post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text ?? "";
}

export function getPostCategories(post: WPPost): WPTerm[] {
  return post._embedded?.["wp:term"]?.[0] ?? [];
}

export function getPostAuthor(post: WPPost): WPAuthor | null {
  return post._embedded?.author?.[0] ?? null;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

/**
 * Real reading time: words of the article text at 200 words a minute (a
 * calm pace for analysis in Spanish), at least one minute. Inline <style>
 * and <script> blocks are dropped first so they don't count as words.
 */
export function readingMinutes(html: string): number {
  const text = html
    .replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(dateStr: string, locale = "en-US"): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * "Keep reading" picks for the end of an article: posts sharing a category
 * first, then the most recent ones, never the current post. Content is
 * dropped — the cards only need title, excerpt and image, and a full
 * content.rendered per card would bloat every prebuilt article page.
 */
export function pickRelatedPosts(post: WPPost, posts: WPPost[], limit = 3): WPPost[] {
  const others = posts
    .filter((p) => p.id !== post.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const sameCategory = others.filter((p) =>
    p.categories.some((id) => post.categories.includes(id))
  );
  const picked = [...sameCategory, ...others.filter((p) => !sameCategory.includes(p))];
  return picked.slice(0, limit).map((p) => ({ ...p, content: { rendered: "" } }));
}

/**
 * Candidates for the recommendations at the end of an article, prebuilt with
 * the page so the browser can rank them by popularity and by what this reader
 * has read (lib/journal-engagement). The first three are the classic
 * same-category picks, shown as-is when there is no JavaScript or no data;
 * then more from the same category and the latest of every other category,
 * so a reader's other interests have somewhere to land. Heavy fields are
 * dropped: the cards only need title, excerpt, image and categories.
 */
export function pickRecommendationPool(post: WPPost, posts: WPPost[], size = 18): WPPost[] {
  const others = posts
    .filter((p) => p.id !== post.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const pool: WPPost[] = [];
  const add = (p: WPPost) => {
    if (pool.length < size && !pool.some((x) => x.id === p.id)) pool.push(p);
  };
  pickRelatedPosts(post, posts, 3).forEach((p) => add(others.find((o) => o.id === p.id)!));
  others.filter((p) => p.categories.some((c) => post.categories.includes(c))).slice(0, 6).forEach(add);
  const categories = [...new Set(others.flatMap((p) => p.categories))];
  for (const c of categories) others.filter((p) => p.categories.includes(c)).slice(0, 2).forEach(add);
  others.forEach(add);
  return pool.map((p) => ({
    ...p,
    content: { rendered: "" },
    seo_schema: undefined,
    seo_description: undefined,
    seo_title: undefined,
  }));
}

/**
 * Some articles arrive with their subheadings saved as a paragraph that is
 * entirely bold (`<p><strong>Process Mining: …</strong></p>`) instead of an
 * <h2>. Readers and search engines then see one flat run of paragraphs, so
 * those paragraphs are promoted to <h2>. Only short, bold-only paragraphs
 * that don't end like a sentence or a label ("Fuente:") qualify — a bold
 * sentence inside the text stays a paragraph.
 */
export function normalizeArticleHtml(html: string): string {
  return html.replace(
    /<p\b[^>]*>\s*<(strong|b)>([^<]{3,150})<\/\1>\s*<\/p>/g,
    (match, _tag: string, text: string) =>
      /[.;,:]$/.test(text.replace(/&nbsp;/g, " ").trim()) ? match : `<h2>${text.trim()}</h2>`
  );
}

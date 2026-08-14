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

export function formatDate(dateStr: string, locale = "en-US"): string {
  return new Date(dateStr).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

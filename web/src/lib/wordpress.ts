const WP_API_URL = "https://www.pro-corp.net/wp-json/wp/v2";

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

// ─── Fetch functions ──────────────────────────────────────────────

export async function getPosts(
  page = 1,
  perPage = 12,
  categoryId?: number
): Promise<{ posts: WPPost[]; totalPages: number; total: number }> {
  const params = new URLSearchParams({
    _embed: "true",
    page: String(page),
    per_page: String(perPage),
    orderby: "date",
    order: "desc",
  });

  if (categoryId) {
    params.set("categories", String(categoryId));
  }

  const res = await fetch(`${WP_API_URL}/posts?${params}`, {
    next: { revalidate: 600 },
  });

  if (!res.ok) {
    throw new Error(`WordPress API error: ${res.status}`);
  }

  const posts: WPPost[] = await res.json();
  const totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1);
  const total = Number(res.headers.get("X-WP-Total") ?? 0);

  return { posts, totalPages, total };
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const params = new URLSearchParams({
    _embed: "true",
    slug,
  });

  const res = await fetch(`${WP_API_URL}/posts?${params}`, {
    next: { revalidate: 600 },
  });

  if (!res.ok) return null;

  const posts: WPPost[] = await res.json();
  return posts[0] ?? null;
}

export async function getCategories(): Promise<WPCategory[]> {
  const res = await fetch(`${WP_API_URL}/categories?per_page=100`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) return [];

  const categories: WPCategory[] = await res.json();
  return categories.filter((c) => c.count > 0);
}

export async function getAllPostSlugs(): Promise<
  { slug: string; modified: string }[]
> {
  const result: { slug: string; modified: string }[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const res = await fetch(
      `${WP_API_URL}/posts?per_page=100&page=${page}&_fields=slug,modified`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) break;

    const posts: { slug: string; modified: string }[] = await res.json();
    result.push(...posts);
    totalPages = Number(res.headers.get("X-WP-TotalPages") ?? 1);
    page++;
  }

  return result;
}

/**
 * Journal content reader — serves the snapshotted WordPress export from
 * content/journal/ (see docs/decisions/0001-decommission-wordpress.md).
 * Keeps the WPPost shape and the original fetch-function signatures so
 * consumers did not have to change; there is no WordPress at runtime.
 * Regenerate the snapshot with scripts/snapshot-wp.mjs while WP is alive.
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "journal");

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

// ─── Local content readers ────────────────────────────────────────

// index.json is WPPost minus content.rendered
type WPPostIndex = Omit<WPPost, "content">;

let indexCache: WPPostIndex[] | null = null;
let categoriesCache: WPCategory[] | null = null;

async function readIndex(): Promise<WPPostIndex[]> {
  if (!indexCache) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, "index.json"), "utf8");
    const posts: WPPostIndex[] = JSON.parse(raw);
    posts.sort((a, b) => (a.date < b.date ? 1 : -1));
    indexCache = posts;
  }
  return indexCache;
}

export async function getPosts(
  page = 1,
  perPage = 12,
  categoryId?: number
): Promise<{ posts: WPPost[]; totalPages: number; total: number }> {
  const all = await readIndex();
  const filtered = categoryId
    ? all.filter((p) => p.categories.includes(categoryId))
    : all;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pagePosts = filtered.slice((page - 1) * perPage, page * perPage);

  // List consumers never render content; keep the WPPost shape anyway.
  const posts = pagePosts.map((p) => ({ ...p, content: { rendered: "" } }));
  return { posts, totalPages, total };
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, "posts", `${slug}.json`),
      "utf8"
    );
    return JSON.parse(raw) as WPPost;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<WPCategory[]> {
  if (!categoriesCache) {
    const raw = await fs.readFile(
      path.join(CONTENT_DIR, "categories.json"),
      "utf8"
    );
    const categories: WPCategory[] = JSON.parse(raw);
    categoriesCache = categories.filter((c) => c.count > 0);
  }
  return categoriesCache;
}

export async function getAllPostSlugs(): Promise<
  { slug: string; modified: string }[]
> {
  const all = await readIndex();
  return all.map((p) => ({ slug: p.slug, modified: p.modified }));
}

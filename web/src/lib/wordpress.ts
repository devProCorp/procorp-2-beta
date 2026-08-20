/**
 * Journal content reader — serves the snapshot in content/journal/, now
 * sourced from Supabase (schema `blog`, see
 * docs/decisions/0002-journal-source-supabase.md), originally from WordPress
 * (see docs/decisions/0001-decommission-wordpress.md). Keeps the WPPost shape
 * and the original fetch-function signatures so consumers did not have to
 * change; there is no live dependency on WordPress or Supabase at runtime.
 * Regenerate the snapshot with:
 *   node --env-file=.env.local scripts/snapshot-supabase.mjs
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "journal");

// Types and pure helpers live in wordpress-presentation.ts so client components
// can import them without pulling node:fs into the browser bundle; re-exported
// here to keep every existing `@/lib/wordpress` import working unchanged.
export * from "./wordpress-presentation";
import type { WPPost, WPCategory } from "./wordpress-presentation";

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

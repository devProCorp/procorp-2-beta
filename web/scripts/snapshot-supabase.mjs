/**
 * Snapshot of the Journal from Supabase (schema `blog`, table `posts`) — the
 * successor to snapshot-wp.mjs now that content is migrated off WordPress.
 * See ../../blog migration/blog-migration-wordpress-supabase.md,
 * docs/decisions/0002-journal-source-supabase.md and
 * docs/decisions/0003-blog-fetch-via-edge-function.md.
 *
 * Exports every row from blog.posts into:
 *   web/content/journal/posts/<slug>.json   (full post, WPPost shape)
 *   web/content/journal/index.json          (lightweight list for /journal + sitemap)
 *   web/content/journal/categories.json
 *
 * Unlike snapshot-wp.mjs this does NOT mirror images/audio locally: the
 * migration already rehosted every asset in the public `blog-assets` Supabase
 * Storage bucket and rewrote content_html/seo_schema to point at it, so those
 * URLs are safe to reference directly (Supabase Storage is permanent
 * infrastructure here, unlike the WordPress host that was being decommissioned).
 *
 * Fetches posts over HTTPS from the `get-blog-posts` Supabase Edge Function
 * (supabase/functions/get-blog-posts/) instead of querying blog.posts
 * directly — the service-role key needed to read that RLS-protected schema
 * lives only inside the function's runtime, never in this repo or in
 * web/.env. This script only needs the lightweight SNAPSHOT_SECRET the
 * function checks.
 *
 * Usage: node --env-file=.env scripts/snapshot-supabase.mjs
 * Requires SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SNAPSHOT_SECRET —
 * the latter must match the `SNAPSHOT_SECRET` set on the Edge Function via
 * `supabase secrets set`.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SNAPSHOT_SECRET = process.env.SNAPSHOT_SECRET;

if (!SUPABASE_URL || !SNAPSHOT_SECRET) {
  console.error(
    "Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and/or SNAPSHOT_SECRET.\n" +
      "Run with: node --env-file=.env scripts/snapshot-supabase.mjs"
  );
  process.exit(1);
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content", "journal");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");

// Stable id -> {name, slug} table for the 5 real Journal categories (see the
// migration doc). Posts land in Uncategorized (id 1) only if the migration's
// AI-categorization fallback somehow didn't run — those are skipped from the
// public category list, same as the old WP snapshot did.
const CATEGORY_TABLE = new Map([
  [56, { name: "Ciudadanía europea", slug: "ciudadania-europea" }],
  [57, { name: "Emigrar a España", slug: "emigrar-a-espana" }],
  [58, { name: "Emigrar a Portugal", slug: "emigrar-a-portugal" }],
  [59, { name: "Vivir en Europa", slug: "vivir-en-europa" }],
  [
    156,
    {
      name: "Nacionalidad española por origen sefardí",
      slug: "nacionalidad-espanola-por-origen-sefardi",
    },
  ],
]);

async function fetchAllPosts() {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/get-blog-posts`, {
    headers: { "x-snapshot-secret": SNAPSHOT_SECRET },
  });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText} — ${await res.text()}`);
  }
  return res.json();
}

/** blog.posts row -> WPPost shape, so every journal consumer stays unchanged. */
function toWPPost(row) {
  const categoryIds = row.category_ids ?? [];
  const categoryNames = row.category_names ?? [];
  const tagIds = row.tag_ids ?? [];

  return {
    id: row.wp_id,
    slug: row.slug,
    date: row.published_at,
    modified: row.modified_at,
    title: { rendered: row.title ?? "" },
    excerpt: { rendered: row.excerpt_html ?? "" },
    content: { rendered: row.content_html ?? "" },
    featured_media: row.featured_image_url ? row.wp_id : 0,
    categories: categoryIds,
    tags: tagIds,
    author: row.author_wp_id ?? 0,
    ...(row.audio_url && { audio_url: row.audio_url }),
    ...(row.seo_title && { seo_title: row.seo_title }),
    ...(row.seo_description && { seo_description: row.seo_description }),
    ...(row.seo_canonical && { seo_canonical: row.seo_canonical }),
    ...(row.seo_og_image_url && { seo_og_image_url: row.seo_og_image_url }),
    ...(row.seo_schema && { seo_schema: row.seo_schema }),
    _embedded: {
      ...(row.author_name && {
        author: [
          {
            id: row.author_wp_id ?? 0,
            name: row.author_name,
            description: "",
            slug: String(row.author_wp_id ?? ""),
            avatar_urls: {},
          },
        ],
      }),
      ...(row.featured_image_url && {
        "wp:featuredmedia": [
          {
            id: row.wp_id,
            source_url: row.featured_image_url,
            alt_text: "",
            media_details: { width: 0, height: 0, sizes: {} },
          },
        ],
      }),
      "wp:term": [
        categoryIds.map((id, i) => ({
          id,
          name: categoryNames[i] ?? CATEGORY_TABLE.get(id)?.name ?? "",
          slug: CATEGORY_TABLE.get(id)?.slug ?? String(id),
        })),
      ],
    },
  };
}

async function main() {
  await fs.mkdir(POSTS_DIR, { recursive: true });

  const rows = await fetchAllPosts();
  console.log(`${rows.length} posts fetched from blog.posts`);

  const posts = rows.map(toWPPost);

  // Per-post files (full WPPost, including content.rendered)
  const seenSlugs = new Set();
  for (const post of posts) {
    if (seenSlugs.has(post.slug)) {
      console.warn(`WARNING: duplicate slug skipped: ${post.slug}`);
      continue;
    }
    seenSlugs.add(post.slug);
    await fs.writeFile(
      path.join(POSTS_DIR, `${post.slug}.json`),
      JSON.stringify(post, null, 2)
    );
  }

  // Lightweight index for list pages + sitemap (no content.rendered)
  const index = posts
    .filter((p) => seenSlugs.has(p.slug))
    .map(({ content, ...rest }) => {
      void content;
      return rest;
    });
  await fs.writeFile(
    path.join(CONTENT_DIR, "index.json"),
    JSON.stringify(index, null, 2)
  );

  // Categories, derived from actual post counts (only non-empty, real categories)
  const counts = new Map();
  for (const post of posts) {
    for (const id of post.categories) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  const categories = [...CATEGORY_TABLE.entries()]
    .filter(([id]) => counts.has(id))
    .map(([id, { name, slug }]) => ({ id, name, slug, count: counts.get(id) }));
  await fs.writeFile(
    path.join(CONTENT_DIR, "categories.json"),
    JSON.stringify(categories, null, 2)
  );

  const uncategorized = counts.get(1) ?? 0;
  if (uncategorized > 0) {
    console.warn(
      `WARNING: ${uncategorized} post(s) still in Uncategorized (id 1) — ` +
        `the migration's AI categorization should have resolved this.`
    );
  }

  console.log(`DONE: ${index.length} posts, ${categories.length} categories → content/journal`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

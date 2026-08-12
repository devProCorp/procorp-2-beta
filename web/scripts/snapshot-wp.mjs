/**
 * One-time (re-runnable) snapshot of the legacy WordPress Journal.
 * See docs/decisions/0001-decommission-wordpress.md
 *
 * Exports every post from https://www.pro-corp.net/wp-json/wp/v2 into:
 *   web/content/journal/posts/<slug>.json   (full post, WPPost shape)
 *   web/content/journal/index.json          (lightweight list for /journal + sitemap)
 *   web/content/journal/categories.json
 * Downloads all wp-content/uploads images into:
 *   web/public/journal/media/...            (URLs rewritten to /journal/media/...)
 *
 * Usage: node scripts/snapshot-wp.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WP_API_URL = "https://www.pro-corp.net/wp-json/wp/v2";
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content", "journal");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");
const MEDIA_DIR = path.join(ROOT, "public", "journal", "media");

const UPLOADS_RE = /https?:\/\/(?:www\.)?pro-corp\.net\/wp-content\/uploads\/([^"'\s\\)<>&?#]+)/g;

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return { data: await res.json(), headers: res.headers };
}

async function fetchAllPosts() {
  const posts = [];
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const { data, headers } = await fetchJson(
      `${WP_API_URL}/posts?_embed=true&per_page=100&page=${page}&orderby=date&order=desc`
    );
    posts.push(...data);
    totalPages = Number(headers.get("X-WP-TotalPages") ?? 1);
    console.log(`fetched posts page ${page}/${totalPages} (${posts.length} total)`);
    page++;
  }
  return posts;
}

/** Keep only the fields the app consumes (WPPost shape). */
function trimPost(post) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const author = post._embedded?.author?.[0];
  const terms = post._embedded?.["wp:term"] ?? [];
  return {
    id: post.id,
    slug: post.slug,
    date: post.date,
    modified: post.modified,
    title: { rendered: post.title?.rendered ?? "" },
    excerpt: { rendered: post.excerpt?.rendered ?? "" },
    content: { rendered: post.content?.rendered ?? "" },
    featured_media: post.featured_media ?? 0,
    categories: post.categories ?? [],
    tags: post.tags ?? [],
    author: post.author ?? 0,
    _embedded: {
      ...(author && {
        author: [
          {
            id: author.id,
            name: author.name,
            description: author.description ?? "",
            slug: author.slug,
            avatar_urls: author.avatar_urls ?? {},
          },
        ],
      }),
      ...(media && {
        "wp:featuredmedia": [
          {
            id: media.id,
            source_url: media.source_url,
            alt_text: media.alt_text ?? "",
            media_details: {
              width: media.media_details?.width ?? 0,
              height: media.media_details?.height ?? 0,
              sizes: Object.fromEntries(
                Object.entries(media.media_details?.sizes ?? {}).map(
                  ([k, s]) => [
                    k,
                    { source_url: s.source_url, width: s.width, height: s.height },
                  ]
                )
              ),
            },
          },
        ],
      }),
      "wp:term": terms.map((group) =>
        (group ?? []).map((t) => ({ id: t.id, name: t.name, slug: t.slug }))
      ),
    },
  };
}

function collectUploadUrls(json, into) {
  for (const match of json.matchAll(UPLOADS_RE)) {
    into.set(match[0], match[1]); // full URL -> relative uploads path
  }
}

async function downloadImage(url, relPath) {
  const dest = path.join(MEDIA_DIR, relPath);
  try {
    await fs.access(dest);
    return "cached";
  } catch {}
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} — ${url}`);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return "downloaded";
}

async function main() {
  await fs.mkdir(POSTS_DIR, { recursive: true });
  await fs.mkdir(MEDIA_DIR, { recursive: true });

  // 1. Fetch everything
  const [rawPosts, { data: rawCategories }] = await Promise.all([
    fetchAllPosts(),
    fetchJson(`${WP_API_URL}/categories?per_page=100`),
  ]);

  // 2. Trim + collect image URLs
  const posts = rawPosts.map(trimPost);
  const images = new Map();
  for (const post of posts) collectUploadUrls(JSON.stringify(post), images);
  console.log(`${posts.length} posts, ${images.size} unique images to mirror`);

  // 3. Download images (bounded concurrency)
  const entries = [...images.entries()];
  const failed = [];
  let done = 0;
  const CONCURRENCY = 8;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (entries.length) {
        const [url, relPath] = entries.pop();
        try {
          await downloadImage(url, relPath);
        } catch (err) {
          failed.push({ url, error: String(err) });
        }
        if (++done % 25 === 0) console.log(`images: ${done}/${images.size}`);
      }
    })
  );
  if (failed.length) {
    console.warn(`WARNING: ${failed.length} images failed to download:`);
    failed.forEach((f) => console.warn(`  ${f.url} — ${f.error}`));
  }

  // 4. Rewrite URLs to local paths and write per-post files.
  //    Failed images keep their original remote URL so nothing 404s silently.
  const failedUrls = new Set(failed.map((f) => f.url));
  const seenSlugs = new Set();
  for (const post of posts) {
    if (seenSlugs.has(post.slug)) {
      console.warn(`WARNING: duplicate slug skipped: ${post.slug}`);
      continue;
    }
    seenSlugs.add(post.slug);
    const json = JSON.stringify(post).replaceAll(UPLOADS_RE, (full, rel) =>
      failedUrls.has(full) ? full : `/journal/media/${rel}`
    );
    await fs.writeFile(
      path.join(POSTS_DIR, `${post.slug}.json`),
      JSON.stringify(JSON.parse(json), null, 2)
    );
  }

  // 5. Lightweight index for list pages + sitemap (no content.rendered)
  const index = posts
    .filter((p) => seenSlugs.has(p.slug))
    .map((p) => {
      const { content, ...rest } = p;
      void content;
      return JSON.parse(
        JSON.stringify(rest).replaceAll(UPLOADS_RE, (full, rel) =>
          failedUrls.has(full) ? full : `/journal/media/${rel}`
        )
      );
    });
  await fs.writeFile(
    path.join(CONTENT_DIR, "index.json"),
    JSON.stringify(index, null, 2)
  );

  // 6. Categories (only non-empty, matching previous behavior)
  const categories = rawCategories
    .filter((c) => c.count > 0)
    .map((c) => ({ id: c.id, name: c.name, slug: c.slug, count: c.count }));
  await fs.writeFile(
    path.join(CONTENT_DIR, "categories.json"),
    JSON.stringify(categories, null, 2)
  );

  console.log(
    `DONE: ${index.length} posts → content/journal, ${images.size - failed.length}/${images.size} images → public/journal/media`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

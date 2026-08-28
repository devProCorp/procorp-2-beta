/**
 * Client-side live reader for the Journal — calls the public `get-blog-posts`
 * Supabase Edge Function directly from the browser. The Journal has no
 * build-time snapshot to fall back on: /journal (JournalBrowser) and every
 * article page (app/journal/live-fallback/page.tsx) fetch entirely from
 * here, so a post that changes status (draft → publish, or vice versa)
 * shows up without a rebuild+deploy. See
 * docs/decisions/0004-journal-live-fetch.md.
 *
 * The mapping below (blog.posts row -> WPPost) must be kept in sync with
 * `toWPPost` in scripts/snapshot-supabase.mjs (still used to regenerate the
 * sitemap's post list — see wordpress.ts).
 */
import type { WPCategory, WPPost } from "./wordpress-presentation";

// Same project the snapshot script and next.config.ts's image remotePatterns
// already point at — this is the project URL, not a secret, safe to inline.
const FUNCTIONS_URL = "https://cpojgmwfpbuvtutnbtam.supabase.co/functions/v1/get-blog-posts";
const PREVIEW_FUNCTIONS_URL = "https://cpojgmwfpbuvtutnbtam.supabase.co/functions/v1/preview-blog-post";
const MODERATE_FUNCTIONS_URL = "https://cpojgmwfpbuvtutnbtam.supabase.co/functions/v1/moderate-blog-post";
const TRIGGER_DEPLOY_URL = "https://cpojgmwfpbuvtutnbtam.supabase.co/functions/v1/trigger-deploy";

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

interface BlogPostRow {
  wp_id: number;
  slug: string;
  published_at: string;
  modified_at: string;
  title: string | null;
  excerpt_html: string | null;
  content_html: string | null;
  featured_image_url: string | null;
  category_ids: number[] | null;
  category_names: string[] | null;
  tag_ids: number[] | null;
  author_wp_id: number | null;
  author_name: string | null;
  audio_url?: string;
  seo_title?: string;
  seo_description?: string;
  seo_canonical?: string;
  seo_og_image_url?: string;
  seo_schema?: unknown;
}

function toWPPost(row: BlogPostRow): WPPost {
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
    ...(row.seo_schema != null && { seo_schema: row.seo_schema }),
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

/** Every published post, freshest first. Content-light: list views don't need content.rendered. */
export async function fetchLivePosts(): Promise<WPPost[]> {
  const res = await fetch(FUNCTIONS_URL);
  if (!res.ok) throw new Error(`get-blog-posts: ${res.status}`);
  const rows: BlogPostRow[] = await res.json();
  return rows
    .map(toWPPost)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map((p) => ({ ...p, content: { rendered: "" } }));
}

interface PagedResponse {
  posts: BlogPostRow[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

/**
 * One page of published posts, server-paginated — the `page`/`per_page`
 * form of get-blog-posts. Used for the unfiltered /journal view so paging
 * through the list only ever downloads the page being rendered, not every
 * post's content_html. Category-filtered browsing still needs the full list
 * (fetchLivePosts) since the function has no server-side category filter.
 */
export async function fetchLivePostsPage(
  page: number,
  perPage: number
): Promise<{ posts: WPPost[]; total: number; totalPages: number }> {
  const res = await fetch(
    `${FUNCTIONS_URL}?page=${page}&per_page=${perPage}`
  );
  if (!res.ok) throw new Error(`get-blog-posts: ${res.status}`);
  const body: PagedResponse = await res.json();
  return {
    posts: body.posts.map(toWPPost).map((p) => ({ ...p, content: { rendered: "" } })),
    total: body.total,
    totalPages: body.total_pages,
  };
}

/** Full post (with content) by slug, or null if it doesn't exist / isn't published. */
/**
 * Full post (with content) by id — article URLs are keyed by id (wp_id),
 * not slug, so they keep working if the title/slug is edited later. See
 * docs/decisions/0004-journal-live-fetch.md.
 */
export async function fetchLivePostById(id: string): Promise<WPPost | null> {
  if (!/^\d+$/.test(id)) return null;
  const res = await fetch(`${FUNCTIONS_URL}?id=${encodeURIComponent(id)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`get-blog-posts: ${res.status}`);
  const row: BlogPostRow | null = await res.json();
  return row ? toWPPost(row) : null;
}

/**
 * Draft-only preview by id — calls `preview-blog-post`, a separate Edge
 * Function gated by a shared secret (`key`), never `get-blog-posts` (which
 * only ever returns `status = 'publish'` rows). Used solely by
 * app/journal/preview. Any failure (wrong key, unknown id, or the post isn't
 * a draft) comes back as a 404, so this resolves to null the same way as
 * "doesn't exist" — the caller can't tell those apart, by design.
 */
export async function fetchPreviewPostById(id: string, key: string): Promise<WPPost | null> {
  if (!/^\d+$/.test(id) || !key) return null;
  const res = await fetch(
    `${PREVIEW_FUNCTIONS_URL}?id=${encodeURIComponent(id)}&key=${encodeURIComponent(key)}`
  );
  if (!res.ok) return null;
  const row: BlogPostRow | null = await res.json();
  return row ? toWPPost(row) : null;
}

export interface ModeratePostFields {
  title?: string;
  content_html?: string;
  excerpt_html?: string;
  image_base64?: string;
  image_mime_type?: string;
}

/**
 * Write side of the draft preview: publish/trash/save, all gated by the
 * same PREVIEW_SECRET as fetchPreviewPostById (one internal review
 * workflow — see moderate-blog-post). Never throws; callers branch on `ok`.
 */
export async function moderatePreviewPost(
  id: string,
  key: string,
  action: "publish" | "trash" | "save",
  fields?: ModeratePostFields
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch(MODERATE_FUNCTIONS_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, key, action, ...fields }),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: body?.error ?? `request failed: ${res.status}` };
    return { ok: true };
  } catch {
    return { ok: false, error: "network error" };
  }
}

/**
 * Best-effort: asks GitHub Actions to redeploy production (see
 * .github/workflows/deploy-produccion.yml). The post is already visible on
 * /journal either way — get-blog-posts serves it live — this only makes it
 * show up in the build-time sitemap faster than the next manual deploy.
 * Never blocks or surfaces an error to the caller; a failed trigger just
 * means the sitemap catches up whenever someone deploys next.
 */
export async function triggerDeploy(key: string): Promise<void> {
  try {
    await fetch(TRIGGER_DEPLOY_URL, {
      method: "POST",
      headers: { "x-preview-secret": key },
    });
  } catch {
    // best-effort — nothing to do if this fails
  }
}

/** Real, non-empty categories derived from the live post list — same rule as the snapshot script. */
export async function fetchLiveCategories(): Promise<WPCategory[]> {
  const posts = await fetchLivePosts();
  const counts = new Map<number, number>();
  for (const post of posts) {
    for (const id of post.categories) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return [...CATEGORY_TABLE.entries()]
    .filter(([id]) => counts.has(id))
    .map(([id, { name, slug }]) => ({ id, name, slug, count: counts.get(id)! }));
}

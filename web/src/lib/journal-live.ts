/**
 * Client-side live reader for the Journal — calls the public `get-blog-posts`
 * Supabase Edge Function directly from the browser, so a post that changes
 * status (draft → publish, or vice versa) shows up without a rebuild+deploy.
 * See docs/decisions/0004-journal-live-fetch.md.
 *
 * Complements, not replaces, the build-time snapshot in wordpress.ts: that
 * snapshot still gives crawlers/no-JS visitors real prerendered HTML for
 * posts known at deploy time. This module is used to refresh that data once
 * the page has hydrated (JournalBrowser) and to render posts published after
 * the last deploy (app/journal/_live/page.tsx).
 *
 * The mapping below (blog.posts row -> WPPost) must be kept in sync with
 * `toWPPost` in scripts/snapshot-supabase.mjs.
 */
import type { WPCategory, WPPost } from "./wordpress-presentation";

// Same project the snapshot script and next.config.ts's image remotePatterns
// already point at — this is the project URL, not a secret, safe to inline.
const FUNCTIONS_URL = "https://cpojgmwfpbuvtutnbtam.supabase.co/functions/v1/get-blog-posts";

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
export async function fetchLivePostBySlug(slug: string): Promise<WPPost | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const res = await fetch(`${FUNCTIONS_URL}?slug=${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`get-blog-posts: ${res.status}`);
  const row: BlogPostRow | null = await res.json();
  return row ? toWPPost(row) : null;
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

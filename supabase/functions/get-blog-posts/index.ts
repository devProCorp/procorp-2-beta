// Supabase Edge Function (Deno) — HTTPS endpoint that serves published
// Journal posts. Two callers:
//   1. web/scripts/snapshot-supabase.mjs — build-time snapshot for
//      web/content/journal/ (prebuilt pages, sitemap, SEO). Calls with no
//      `page`/`per_page` params, so it keeps getting every post as a bare
//      array (unchanged contract).
//   2. web/src/lib/journal-live.ts — called directly from the browser at
//      runtime, so /journal reflects a draft→publish change without a
//      redeploy. See docs/decisions/0004-journal-live-fetch.md.
//
// Why this is safe to expose publicly with no auth: the `blog` schema has
// RLS with no public read policy, so reading it still requires the
// service-role key, which lives only in this function's runtime (Supabase
// injects it automatically). The query below is UNCONDITIONALLY filtered to
// status = 'publish' — there is no code path that can return a draft, so
// there is nothing to gate behind a secret.
//
// Pagination: passing `page` and/or `per_page` switches the list endpoint
// to a paginated response — `{ posts, total, page, per_page, total_pages }`
// instead of the bare array — so the browser only downloads one page of
// (content-heavy) rows instead of the whole table on every /journal visit.
// Omitting both keeps the legacy full-list behavior for the build script.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  db: { schema: "blog" },
  auth: { persistSession: false },
});

const PAGE_SIZE = 1000;
const DEFAULT_PER_PAGE = 9; // matches JournalBrowser's PER_PAGE
const MAX_PER_PAGE = 100;

// Public read-only JSON API, called cross-origin from the browser — allow
// any origin (no cookies/credentials are involved, so this is not a CSRF
// concern) and answer CORS preflights.
const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const params = new URL(req.url).searchParams;
  const slug = params.get("slug");

  // Single-post lookup, used by the live article page — avoids shipping
  // every post's full content_html just to render one.
  if (slug) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "publish")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data ?? null), {
      status: data ? 200 : 404,
      headers: { ...CORS_HEADERS, "content-type": "application/json" },
    });
  }

  // Paginated list, used by the browser (JournalBrowser) so it only pulls
  // down one page of full rows (content_html included) instead of the
  // entire table. Opt-in via `page` and/or `per_page` so the build-time
  // snapshot script — which needs every post — can keep calling with no
  // params and get the old bare-array response.
  if (params.has("page") || params.has("per_page")) {
    const page = Math.max(1, Number(params.get("page")) || 1);
    const perPage = Math.min(
      MAX_PER_PAGE,
      Math.max(1, Number(params.get("per_page")) || DEFAULT_PER_PAGE)
    );
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, error, count } = await supabase
      .from("posts")
      .select("*", { count: "exact" })
      .eq("status", "publish")
      .order("published_at", { ascending: false })
      .range(from, to);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, "content-type": "application/json" },
      });
    }

    const total = count ?? 0;
    return new Response(
      JSON.stringify({
        posts: data,
        total,
        page,
        per_page: perPage,
        total_pages: Math.max(1, Math.ceil(total / perPage)),
      }),
      { headers: { ...CORS_HEADERS, "content-type": "application/json" } }
    );
  }

  const posts: Record<string, unknown>[] = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "publish")
      .order("published_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...CORS_HEADERS, "content-type": "application/json" },
      });
    }

    posts.push(...data);
    if (data.length < PAGE_SIZE) break;
  }

  return new Response(JSON.stringify(posts), {
    headers: { ...CORS_HEADERS, "content-type": "application/json" },
  });
});

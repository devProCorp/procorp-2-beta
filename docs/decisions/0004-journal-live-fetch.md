# ADR 0004: Fetch the Journal live from the browser, not just at build time

- **Date:** 2026-08-25
- **Status:** Implemented
- **Decider:** ProCorp (admin@pro-corp.net)

## Context

ADR 0002/0003 gave `/journal` a build-time snapshot of `blog.posts`, read
through the `get-blog-posts` Edge Function. That ADR flagged the open item
directly: "the Journal only updates when someone re-runs the snapshot script
and redeploys; there is no cron/webhook wiring it up automatically." In
practice, flipping a post from draft to publish (or back) in Supabase had no
visible effect on the live site until someone ran `yarn blog:snapshot` and
deployed — the exact gap this ADR closes.

`web` is still a static export served by Apache with no Node runtime, so
there is no request-time rendering to fall back on. The fix has to work
entirely client-side.

## Decision

1. **`get-blog-posts` is now a public, unauthenticated endpoint.** It always
   filtered to `status = 'publish'`, so the `x-snapshot-secret` it used to
   require was never protecting anything beyond that filter — removing it
   just lets the browser call it directly. CORS (`Access-Control-Allow-Origin:
   *`) and an `?slug=` single-post lookup were added for that use.
2. **`web/src/lib/journal-live.ts`** — a client-safe module (no `node:fs`)
   that calls the function directly from the browser: `fetchLivePosts`,
   `fetchLivePostBySlug`, `fetchLiveCategories`. The `blog.posts` row →
   `WPPost` mapping is duplicated from `scripts/snapshot-supabase.mjs`'s
   `toWPPost` (kept in sync manually — one is Deno/Node, the other browser
   TypeScript, so sharing a module isn't practical).
3. **`/journal` (`JournalBrowser`)** still renders the build-time snapshot
   first (unchanged, good for SEO/no-JS), then on mount refetches live data
   and swaps it in. A failed live fetch (offline, function down) just leaves
   the snapshot on screen.
4. **`/journal/<slug>`** for posts already in the snapshot at deploy time is
   unchanged: prebuilt static HTML, real per-post `generateMetadata`. Posts
   that don't have a prebuilt page (published after the last deploy — this is
   exactly the draft → publish case) have no directory in the static export,
   so Apache would otherwise 404 them. `public/.htaccess` now rewrites any
   unmatched `/journal/<slug>/` to `/journal/live-fallback/index.html`
   *internally* (the browser URL is untouched), and that page
   (`app/journal/live-fallback/page.tsx`) reads the slug from
   `window.location.pathname` and fetches it live. Both paths render through
   the same `ArticleView` component, extracted out of `[slug]/page.tsx` so
   there's one implementation of the article markup instead of two.

## Consequences

- New/updated posts appear on `/journal` and at their own URL without a
  redeploy — the primary goal here.
- Posts published after the last deploy are weaker on SEO/social sharing:
  `live-fallback` has no per-post `generateMetadata`, so crawlers that don't
  execute JavaScript (most social-card scrapers) see generic Journal
  metadata until the next deploy rebuilds a real static page for that slug.
  Search engines that do execute JS (Googlebot) still see the real content.
  This is the accepted tradeoff of staying on static hosting with no Node
  runtime; the alternative was migrating off GoDaddy to a host with SSR/ISR.
- A post switched back to draft after being prebuilt keeps its old static
  page live until the next deploy overwrites it — `/journal`'s list refresh
  hides it from the index immediately, but the direct URL isn't retracted.
  Not the scenario this ADR was asked to fix; flagged here as a known gap.
- `public/.htaccess`'s CSP `connect-src` now allow-lists
  `https://cpojgmwfpbuvtutnbtam.supabase.co` so the browser fetch isn't
  blocked; `next.config.ts` already trusted that same host for images.
- `scripts/snapshot-supabase.mjs` keeps working unchanged (minus the now-removed
  secret header) — it's still what produces the prebuilt pages and the
  sitemap.

## Update 2026-08-25: fully live, id-based URLs

The hybrid above (snapshot first, live swap-in after) turned out to be
confusing in practice: the swap is a visible reflow (posts not in the
snapshot pop in and push the rest down), and it got worse the longer a
deploy went without running `yarn blog:snapshot` — everyone kept expecting
"just build it again" to fix a specific post, when the actual gap was a
separate snapshot pipeline (`snapshot-wp.mjs`, still wired into
`deploy-produccion.sh`) silently overwriting the Supabase-sourced snapshot
with stale WordPress data on every production deploy. Decision, given both
problems: drop the prebuilt/snapshot path for the Journal entirely.

1. **`/journal/[slug]` is deleted.** There is no more `generateStaticParams`,
   no per-post prebuilt HTML, no per-post `generateMetadata`. Every article
   renders through `app/journal/live-fallback/page.tsx` — no longer a
   fallback for edge cases, it's the only article page. Kept that directory
   name to avoid re-touching both `.htaccess` files (beta's `public/.htaccess`
   and production's `deploy/journal-fallback.conf`, installed on the server
   by hand) for a cosmetic rename.
2. **`/journal` (`JournalBrowser`) has no snapshot fallback either.** It shows
   a skeleton grid while the first live fetch is in flight, then renders —
   one data source, so there's nothing to reconcile and no reflow.
3. **Articles are now addressed by `id` (the Supabase row's `wp_id`), not
   `slug`** — `/journal/13121/` instead of `/journal/relaciones-complejas-...`.
   Editing a post's title/slug in Supabase no longer breaks its URL.
   `get-blog-posts` gained an `?id=` lookup (`?slug=` stays for compatibility,
   unused by the app now). `ArticleList` links by `post.id`; `sitemap.ts`
   reads ids from the snapshot (`getAllPostIds` in `wordpress.ts`, the one
   remaining use of that file — still needed since sitemaps must be fully
   known at build time, and re-running `yarn blog:snapshot` before each
   deploy is enough to keep it reasonably fresh).
4. **This resets URLs for every already-indexed post** (slug-based →
   id-based) — accepted tradeoff, decided with ProCorp directly. No redirects
   were set up from old slug URLs to new id URLs.

### Consequences of the update

- No more "why didn't rebuilding fix it" confusion — there is exactly one
  source (Supabase, live) for every Journal page, always.
- Every article page is now client-rendered with no prebuilt HTML — worse
  SEO/social-card metadata across the board (not just for very recent posts,
  as before this update), and a brief loading state on every article visit,
  not only new ones. Accepted for the sake of a single, simple data path.
- `scripts/snapshot-supabase.mjs` and `content/journal/` still exist, but
  narrowed to one job: feeding `sitemap.ts` a list of ids to include. Nothing
  else reads them anymore.
- `deploy-produccion.sh` was fixed to call `snapshot-supabase.mjs` instead of
  the legacy `snapshot-wp.mjs`, so production deploys stop overwriting this
  snapshot with WordPress data. 82 posts that existed in WordPress but were
  never migrated into `blog.posts` are consequently absent from the sitemap
  and unreachable via the Journal until/unless they're migrated into
  Supabase — a known, accepted gap, not an oversight.

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

# ADR 0001: Decommission WordPress — snapshot Journal content into the React app

- **Date:** 2026-07-02
- **Status:** Implemented 2026-08-12 (cutover done; WP shutdown pending — see Consequences)
- **Decider:** ProCorp (admin@pro-corp.net)

## Context

The new site (`web/`, Next.js 16 / React 19) is fully React **except** the Journal:
`web/src/lib/wordpress.ts` fetches posts, categories, and sitemap entries live from
the legacy WordPress install at `https://www.pro-corp.net/wp-json/wp/v2`.

As of this decision the WP API is alive and still receiving new posts
(latest: 2026-07-02, Spanish legal/immigration articles). Total posts: **161**.
The publisher of these recurring posts is suspected to be an n8n workflow
(unconfirmed).

## Decision

**Decommission WordPress via one-time snapshot migration:**

1. Export all 161 posts (rendered HTML, metadata, categories, featured images)
   from the WP REST API into the repo (`web/content/journal/`).
2. Download all post images into `web/public/journal/` and rewrite URLs —
   posts must not reference the WP server at runtime.
3. Replace `wordpress.ts` with a local content reader keeping the same function
   signatures; journal pages become fully static (SSG).
4. Preserve `/journal/[slug]` URLs exactly — zero SEO loss.
5. New posts are authored as local content files going forward; WordPress
   receives no new posts after cutover.

## Consequences

- Old posts stay alive forever on the new site, with no WP runtime dependency.
- Journal becomes faster (SSG) and immune to WP outages.
- **Open item:** identify the automation still publishing to WP (suspected n8n)
  and repoint it before shutdown; any WP posts published after the snapshot
  will not appear on the new site.
- WP hosting can be cancelled only after: snapshot verified on the new site,
  publisher repointed, and old-URL redirects checked.

## Implementation notes (2026-08-12)

- `wordpress.ts` is now a local reader over `content/journal/` (same signatures);
  `/journal/[slug]` is SSG (161 pages), `api/revalidate` removed.
- Site logo mirrored to `public/brand/` (was WP-hosted); PDF-viewer iframes now
  load local PDFs directly; in-content cross-links to old post URLs rewritten to
  `/journal/<slug>`, contact/home links to `/contact` and `/`.
- Still referencing the old domain inside post bodies: links to WP *pages* with
  no new-site equivalent (e.g. `/ciudadania-europea/...`) — handle via redirects
  at DNS cutover. `inversion.pro-corp.net` (linked from About) must survive WP
  shutdown — confirm it is a separate deployment.
- Open: repoint the n8n publisher before shutdown (posts published after
  2026-07-02 snapshot won't appear; re-run `scripts/snapshot-wp.mjs` before
  final cutover to capture any stragglers).

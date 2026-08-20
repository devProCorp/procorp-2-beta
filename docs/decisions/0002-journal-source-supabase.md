# ADR 0002: Source the Journal snapshot from Supabase instead of WordPress

- **Date:** 2026-08-20
- **Status:** Implemented and verified against production Supabase data
- **Decider:** ProCorp (admin@pro-corp.net)

## Context

ADR 0001 decommissioned WordPress as a runtime dependency by snapshotting it
into `web/content/journal/` at build time (`scripts/snapshot-wp.mjs`). Since
then, a separate migration (see `blog migration/blog-migration-wordpress-supabase.md`,
done in the `pro-corp-platform` monorepo, `apps/intranet/`) moved the blog's
source of truth into Supabase: schema `blog`, table `blog.posts`, with SEO
(Yoast) fields, categories, and rehosted assets (images + "blogcast" audio in
the public `blog-assets` Storage bucket) migrated 1:1. WordPress itself is
still slated for shutdown.

This repo (`web/`) is the actual public frontend serving `/journal`. It never
read from that Supabase table — it was still keyed off the original 2026-07-02
WordPress snapshot. This ADR replaces that snapshot's source without changing
`web`'s deploy model: it is a static export (`output: "export"`) served by
Apache on GoDaddy shared hosting, with no Node runtime, so Supabase cannot be
queried at request time.

## Decision

**Keep the build-time snapshot architecture from ADR 0001, swap its source:**

1. `scripts/snapshot-supabase.mjs` reads every row from `blog.posts` (via the
   PostgREST REST API, `Accept-Profile: blog`, using a service-role key — the
   `blog` schema has RLS with no public read policy) and maps it into the same
   `WPPost` shape `wordpress.ts`/`wordpress-presentation.ts` already expose, so
   every consumer (`/journal`, `/journal/[slug]`, `sitemap.ts`, category
   filtering) is unchanged.
2. Unlike `snapshot-wp.mjs`, this script does **not** mirror images/audio into
   `public/journal/media/` — the migration already rehosted every asset into
   the public `blog-assets` Supabase Storage bucket and rewrote
   `content_html`/`seo_schema` to point at it. That bucket is permanent
   infrastructure (unlike the WordPress host being decommissioned), so
   referencing it directly is safe and avoids duplicating ~320MB in the repo.
3. Added fields carried through from the migration that the old WP snapshot
   never had: `audio_url` (rendered as an inline `<audio>` player on the
   article page + a headphone badge on list cards), and the Yoast-migrated
   `seo_title`/`seo_description`/`seo_canonical`/`seo_og_image_url`/`seo_schema`
   (used in `generateMetadata` and injected as JSON-LD, falling back to the
   previous derived-from-content behavior when absent).
4. Category ids (56/57/58/59/156) are unchanged between WordPress and
   Supabase, so existing `/journal?cat=<slug>` URLs keep working with no
   rewrite.

Regenerate with:

```bash
cd web && yarn blog:snapshot   # node --env-file=.env scripts/snapshot-supabase.mjs
```

Requires `SUPABASE_SERVICE_ROLE_KEY` and either `SUPABASE_URL` or
`NEXT_PUBLIC_SUPABASE_URL` in `web/.env` (gitignored, never committed — this
repo's `.env` already carries these alongside the anon key used elsewhere).

## Consequences

- `web` still has zero runtime dependency on any external service — same
  guarantee ADR 0001 established, now against Supabase instead of WordPress.
- The Journal only updates when someone re-runs the snapshot script and
  redeploys; there is no cron/webhook wiring it up automatically yet (the
  Supabase-side incremental sync from the migration doc updates `blog.posts`,
  but nothing on this side re-triggers a `web` rebuild+deploy after that).
- `next.config.ts`'s `images.remotePatterns` includes the project's Supabase
  Storage hostname (`cpojgmwfpbuvtutnbtam.supabase.co`, scoped to
  `/storage/v1/object/public/blog-assets/**`).
- `content_html` already embeds a fully-styled "Blogcast" audio widget
  (`procorp-audio-player-*`) at the top of the article body for posts that
  have one — confirmed against real data. The article page does **not** add a
  second player; `audio_url` is only used for the list-view headphone badge.
- `scripts/snapshot-wp.mjs` is kept for historical/reference purposes but
  should no longer be the source of truth — WordPress content published after
  the Supabase migration's cutoff won't reach it.
- Open item, same one flagged as the real blocker in the migration doc: this
  repo already *is* "the frontend of replacement" — once verified against
  production data, WordPress can be pointed away from `pro-corp.net/{slug}/`
  in favor of this static site without SEO loss, as long as the snapshot is
  re-run and redeployed first.

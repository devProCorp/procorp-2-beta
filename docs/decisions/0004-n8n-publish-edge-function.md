# ADR 0004: Publish Journal posts from n8n via a dedicated Edge Function

- **Date:** 2026-08-24
- **Status:** Implemented, pending first deploy + n8n wiring
- **Decider:** ProCorp (admin@pro-corp.net)

## Context

The blogcast pipeline (`automation-py-bogcast`: NotebookLM → MP4 → n8n webhook)
currently ends by publishing into WordPress, which is being decommissioned
(ADR 0001, ADR 0002). The migration doc
(`../../blog migration/blog-migration-wordpress-supabase.md`) already moved
existing content into Supabase (`blog.posts`, bucket `blog-assets`), but
nothing lets n8n *write* new posts directly — the only Edge Function that
exists (`get-blog-posts`, ADR 0003) is read-only.

Naively pointing n8n at Supabase would mean either: (a) handing n8n the
`service_role_key` so it can call Storage + PostgREST directly in two
separate HTTP Request nodes, in the right order (asset upload, then the
`blog.posts` row referencing it), or (b) building a proxy that holds the key
instead. ADR 0003 already rejected (a)'s equivalent for the read path for the
same reason: the service-role key bypasses RLS for the *entire* project, not
just `blog`, so it shouldn't sit in a third-party tool's credential store.

Two blog.posts columns also don't have a clean answer once WordPress is out
of the loop:
- `wp_id` is the primary key and has no default — it was always the real
  WordPress post id. Posts born in n8n have no such id.
- `raw_json`, `link`, `category_ids`/`category_names` are all `NOT NULL`
  columns that used to be filled mechanically from the WP REST response.

## Decision

**One Edge Function, `publish-blog-post`, does the whole write in the
correct order and is the only thing n8n talks to:**

1. n8n sends a single `multipart/form-data` POST with a shared secret header
   (`x-publish-secret`, checked against `PUBLISH_SECRET` — same pattern as
   `SNAPSHOT_SECRET` in ADR 0003) — no service-role key ever leaves Supabase.
   Text fields (title, slug, content_html, category, tags, ...) plus two
   optional binary fields (`audio`, `image`) travel in one request.
   Multipart was chosen over base64-in-JSON specifically to avoid the ~33%
   size inflation on an ~8.7MB average blogcast audio file — Edge Functions
   have a 256MB memory ceiling per invocation, comfortably enough either way,
   but multipart keeps n8n's node graph to one HTTP Request call.
2. Inside the function, in order: resolve/mint the post id → upload `audio`
   and `image` to `blog-assets` (deterministic paths `audio/<slug>.mp4`,
   `images/<slug>.<ext>`, `upsert: true` so republishing a slug overwrites
   cleanly) → embed the resulting public URLs into `content_html`/`audio_url`
   → upsert the `blog.posts` row. Nothing is written to the row until the
   asset URLs it references actually exist.
3. **`wp_id` for native posts**: migration `0001_blog_native_post_sequence.sql`
   adds `blog.native_post_id_seq`, starting at `900000000` (the highest real
   WordPress id ever synced was `13121` as of 2026-08-24 — this range can
   never collide) and an RPC `blog.next_native_post_id()` the function calls
   via `supabase.rpc()`. Re-publishing an existing slug looks up its current
   `wp_id` and updates that row instead of minting a new one, so a retried or
   edited n8n run doesn't duplicate the post.
4. **Category resolution**: `_shared/blog-categories.ts` holds the same 5
   real categories as `snapshot-supabase.mjs`'s `CATEGORY_TABLE` (kept as a
   duplicate on purpose — one is a `.mjs` build script, the other a Deno
   function, no shared import path between them). n8n can send an id, slug,
   or free-text name; unrecognized/missing category falls back to `59`
   ("Vivir en Europa") with `category_inferred = true`, mirroring the
   original migration's AI-fallback behavior so these posts are equally
   filterable for editorial review later.
5. `raw_json` is filled with `{ source: "n8n", received_at, fields: {...} }`
   instead of a WP API response — same "safety net" intent, new origin.
   `link` is set to the post's real URL on the new site
   (`https://pro-corp.net/journal/<slug>`) since nothing downstream reads
   this column (verified against `toWPPost()` in `snapshot-supabase.mjs`),
   it's audit-only.

Deploy / configure (one-time):

```bash
# 1. Apply the sequence + RPC (Supabase Dashboard -> SQL Editor, this repo's
#    convention for one-off schema changes):
#    run supabase/migrations/0001_blog_native_post_sequence.sql

# 2. Set the shared secret and deploy the function
npx supabase secrets set PUBLISH_SECRET=<generate a new random value>
npx supabase functions deploy publish-blog-post --no-verify-jwt
```

n8n side: one HTTP Request node, `POST {SUPABASE_URL}/functions/v1/publish-blog-post`,
body type multipart form-data, header `x-publish-secret: <same value>`.

## Consequences

- n8n's blogcast flow collapses to a single node instead of manually
  sequencing a storage upload and a PostgREST insert — and it never holds
  the service-role key, only `PUBLISH_SECRET` (rotatable independently, same
  blast-radius argument as ADR 0003).
- **`web/` still won't pick this up automatically.** It's a static export
  (ADR 0002) — a new row in `blog.posts` doesn't appear on `pro-corp.net`
  until someone runs `yarn blog:snapshot` and redeploys. This function
  intentionally does not attempt to trigger that — no deploy hook exists yet
  for the GoDaddy/Apache static hosting. Automating that redeploy trigger is
  the next open item if n8n is going to publish unattended.
- `raw_json`/`link` no longer carry any real WordPress data for
  n8n-originated posts — anyone querying `blog.posts` should check
  `raw_json->>'source'` to tell WP-migrated rows (`wordpress`, implicitly,
  by the presence of the original WP shape) from n8n-originated ones
  (`"n8n"`) before assuming WP-specific fields are populated.
- If a post ever needs to move back under a *real* WordPress id (shouldn't
  happen — WP is being shut down per ADR 0001), the `900000000+` range makes
  that visually obvious in the data.

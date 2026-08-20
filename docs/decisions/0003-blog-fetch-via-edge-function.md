# ADR 0003: Fetch the Journal snapshot through a Supabase Edge Function instead of the service-role key directly

- **Date:** 2026-08-20
- **Status:** Implemented (pending first deploy of the Edge Function)
- **Decider:** ProCorp (admin@pro-corp.net)

## Context

ADR 0002 pointed `scripts/snapshot-supabase.mjs` at Supabase: the script read
`SUPABASE_SERVICE_ROLE_KEY` from `web/.env` and queried `blog.posts` directly
over the PostgREST REST API (`Accept-Profile: blog`). That key bypasses RLS
entirely — it can read and write every schema in the project, not just
`blog`. Keeping it in a local `.env` file (even gitignored) means it lives on
every developer machine that runs the snapshot, with no scoping to "read
published blog posts."

## Decision

Move the privileged query behind an HTTPS endpoint that holds the key
instead of handing it out:

1. `supabase/functions/get-blog-posts/index.ts` — a Deno Supabase Edge
   Function. It reads `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from its
   own runtime environment (Supabase injects both into every deployed
   function automatically — no manual secret needed for those two), queries
   `blog.posts` filtered to `status = 'publish'`, and returns the full set as
   JSON. It authorizes requests with a shared secret (`SNAPSHOT_SECRET`,
   header `x-snapshot-secret`) checked inside the function body.
2. `scripts/snapshot-supabase.mjs` now calls
   `${SUPABASE_URL}/functions/v1/get-blog-posts` with that header, instead of
   querying `blog.posts` directly. It no longer needs
   `SUPABASE_SERVICE_ROLE_KEY` at all — only `SUPABASE_URL` (or
   `NEXT_PUBLIC_SUPABASE_URL`) and `SNAPSHOT_SECRET`.
3. The function always filters to `status = 'publish'`, so even if
   `SNAPSHOT_SECRET` ever leaked, the worst case is exposing already-public
   blog content — never drafts, and never write access (the function only
   ever reads).

Deploy / configure (one-time, requires the Supabase CLI and project access):

```bash
npx supabase login
npx supabase link --project-ref cpojgmwfpbuvtutnbtam
npx supabase secrets set SNAPSHOT_SECRET=<same value as web/.env's SNAPSHOT_SECRET>
npx supabase functions deploy get-blog-posts --no-verify-jwt
```

`--no-verify-jwt` is required because the build script is not an
authenticated Supabase user — it calls the function directly with its own
`x-snapshot-secret` header, not a user/anon JWT.

## Consequences

- `SUPABASE_SERVICE_ROLE_KEY` no longer needs to exist outside of Supabase's
  own function secrets — it can eventually be removed from `web/.env`
  entirely once the function is confirmed working (left in place for now
  since nothing currently depends on removing it).
- `scripts/snapshot-supabase.mjs` is simpler: pagination now happens inside
  the function, so the script does a single fetch instead of looping with
  `Range` headers.
- New failure mode: the snapshot now depends on the Edge Function being
  deployed and its `SNAPSHOT_SECRET` matching `web/.env`. Until deployed,
  `yarn blog:snapshot` will fail with a 404/network error instead of a
  PostgREST error.
- Rotating access no longer means rotating the service-role key project-wide
  — rotating `SNAPSHOT_SECRET` (via `supabase secrets set` + updating
  `web/.env`) is enough to revoke/reissue snapshot access.

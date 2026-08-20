// Supabase Edge Function (Deno) — HTTPS endpoint the static site's
// build-time snapshot script (web/scripts/snapshot-supabase.mjs) calls to
// pull published Journal posts.
//
// Why this exists: the `blog` schema has RLS with no public read policy, so
// reading it requires the service-role key. Previously that key lived in
// web/.env on every machine that ran the snapshot. Now the key only lives
// here, injected automatically by the Supabase runtime — callers only need
// a lightweight shared secret (SNAPSHOT_SECRET), never the service role key
// itself. See docs/decisions/0003-blog-fetch-via-edge-function.md.
//
// Always filters to status = 'publish' so a leaked SNAPSHOT_SECRET can
// never expose drafts, regardless of the auth layer above it.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SNAPSHOT_SECRET = Deno.env.get("SNAPSHOT_SECRET")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  db: { schema: "blog" },
  auth: { persistSession: false },
});

const PAGE_SIZE = 1000;

Deno.serve(async (req) => {
  if (req.headers.get("x-snapshot-secret") !== SNAPSHOT_SECRET) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
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
        headers: { "content-type": "application/json" },
      });
    }

    posts.push(...data);
    if (data.length < PAGE_SIZE) break;
  }

  return new Response(JSON.stringify(posts), {
    headers: { "content-type": "application/json" },
  });
});

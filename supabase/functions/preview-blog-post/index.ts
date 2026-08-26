// Supabase Edge Function (Deno) — lets an internal reviewer open a draft
// Journal post before it's published, straight from a link. Called only by
// web/src/app/journal/preview/page.tsx, a client-only page that is never
// linked from the site and is always marked noindex.
//
// GET /preview-blog-post?id=<wp_id>&key=<PREVIEW_SECRET>
//
// The URL itself is the access control: every failure mode (missing id,
// missing/wrong key, unknown id, or a post that isn't currently a draft —
// e.g. it went live in the meantime) returns the exact same 404, so a wrong
// key can't be told apart from "no such post" and the DB never confirms a
// draft exists to an unauthenticated caller.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PREVIEW_SECRET = Deno.env.get("PREVIEW_SECRET")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  db: { schema: "blog" },
  auth: { persistSession: false },
});

// Called cross-origin from the browser (pro-corp.net -> *.supabase.co), same
// as get-blog-posts — no cookies/credentials involved, so open CORS is fine.
const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "content-type",
};

function notFound() {
  return new Response(JSON.stringify({ error: "not found" }), {
    status: 404,
    headers: { ...CORS_HEADERS, "content-type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "GET") {
    return notFound();
  }

  const params = new URL(req.url).searchParams;
  const id = params.get("id");
  const key = params.get("key");

  if (!id || !/^\d+$/.test(id) || !key || key !== PREVIEW_SECRET) {
    return notFound();
  }

  // status = 'draft' is a hard filter, not just a display flag: a post that
  // has since gone live (or was never a draft) must 404 here too — the
  // published copy is what get-blog-posts is for.
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("wp_id", Number(id))
    .eq("status", "draft")
    .maybeSingle();

  if (error || !data) {
    return notFound();
  }

  return new Response(JSON.stringify(data), {
    headers: { ...CORS_HEADERS, "content-type": "application/json" },
  });
});

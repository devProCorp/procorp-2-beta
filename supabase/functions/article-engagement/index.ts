// Supabase Edge Function (Deno) — anonymous reader engagement for the Journal.
// See supabase/migrations/0002_article_engagement.sql.
//
//   POST { id, event, seconds? }  → counts one event for a published article.
//        event: "view" | "read" | "audio" | "invest". Called from the article
//        page (web/src/lib/journal-engagement.ts). No cookie or identifier is
//        sent or stored: only per-article, per-day counters.
//   GET  ?days=30                 → [{ id, score }] for the recommendations
//        at the end of each article. Aggregates only.
//
// Deploy: npx supabase functions deploy article-engagement --no-verify-jwt
//
// Abuse: anyone can POST, so a script could inflate a counter. Mitigations:
// writes are only accepted from the site's origins, the id must be a published
// post, events are a closed list and `seconds` is capped at 30 minutes in SQL.
// The browser also sends each event at most once per article and session.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { db: { schema: "blog" }, auth: { persistSession: false } },
);

const EVENTS = new Set(["view", "read", "audio", "invest"]);
// Origins allowed to write. Requests carrying `x-engagement-dry-run: 1` are
// validated but not counted, so local tests never touch the real figures.
const WRITE_ORIGINS = new Set(["https://www.pro-corp.net", "https://pro-corp.net"]);

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "content-type, x-engagement-dry-run",
};
const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "content-type": "application/json", ...extra },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  if (req.method === "GET") {
    const days = Number(new URL(req.url).searchParams.get("days") ?? 30) || 30;
    const { data, error } = await supabase.rpc("article_popularity", { p_days: days });
    if (error) return json({ error: error.message }, 500);
    const scores = (data ?? [])
      .map((r: { post_id: number; score: number }) => ({ id: Number(r.post_id), score: Number(r.score) }))
      .filter((r: { score: number }) => r.score > 0)
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, 200);
    // Scores move slowly: a short CDN/browser cache keeps this cheap.
    return json(scores, 200, { "cache-control": "public, max-age=600" });
  }

  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  let body: { id?: unknown; event?: unknown; seconds?: unknown };
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }
  const id = Number(body.id);
  const event = String(body.event ?? "");
  const seconds = Math.round(Number(body.seconds ?? 0)) || 0;
  if (!Number.isSafeInteger(id) || id <= 0 || !EVENTS.has(event)) {
    return json({ error: "invalid event" }, 400);
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("wp_id")
    .eq("wp_id", id)
    .eq("status", "publish")
    .maybeSingle();
  if (postError) return json({ error: postError.message }, 500);
  if (!post) return json({ error: "unknown article" }, 404);

  const dryRun = req.headers.get("x-engagement-dry-run") === "1";
  const origin = req.headers.get("origin") ?? "";
  if (dryRun || !WRITE_ORIGINS.has(origin)) {
    return json({ counted: false, reason: dryRun ? "dry-run" : "origin" }, 202);
  }

  const { error } = await supabase.rpc("track_article_event", {
    p_post_id: id,
    p_event: event,
    p_seconds: seconds,
  });
  if (error) return json({ error: error.message }, 500);
  return new Response(null, { status: 204, headers: CORS });
});

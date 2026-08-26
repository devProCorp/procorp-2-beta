// Supabase Edge Function (Deno) — the write side of the internal draft
// preview at web/src/app/journal/preview. Handles the three actions its
// buttons trigger: confirm (draft -> publish), trash (soft-delete parking
// state, not an actual DELETE — someone removes trashed rows by hand later),
// and save (light in-place edits: title/content/excerpt/featured image).
//
// POST /moderate-blog-post
// JSON body: { id, key, action: "publish" | "trash" | "save", ...fields }
//
// Gated by the SAME shared secret as preview-blog-post (PREVIEW_SECRET) —
// this is one internal review workflow, not a separate credential to
// provision. Every auth/validation failure returns a generic 404, matching
// preview-blog-post's "wrong key is indistinguishable from no such post".
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PREVIEW_SECRET = Deno.env.get("PREVIEW_SECRET")!;

const BUCKET = "blog-assets";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  db: { schema: "blog" },
  auth: { persistSession: false },
});

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
};

const IMAGE_MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "content-type": "application/json" },
  });
}

function notFound() {
  return jsonResponse({ error: "not found" }, 404);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "POST") {
    return notFound();
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "expected a JSON body" }, 400);
  }

  const id = body.id;
  const key = typeof body.key === "string" ? body.key : "";
  const action = body.action;

  if (
    typeof id !== "number" && typeof id !== "string" ||
    !/^\d+$/.test(String(id)) ||
    !key ||
    key !== PREVIEW_SECRET
  ) {
    return notFound();
  }
  const wpId = Number(id);

  if (action !== "publish" && action !== "trash" && action !== "save") {
    return jsonResponse({ error: "action must be one of: publish, trash, save" }, 400);
  }

  // Every action targets a currently-draft row — this endpoint is only ever
  // reached from the draft preview page, never from the live site.
  const { data: existing, error: lookupError } = await supabase
    .from("posts")
    .select("wp_id, slug")
    .eq("wp_id", wpId)
    .eq("status", "draft")
    .maybeSingle();
  if (lookupError || !existing) {
    return notFound();
  }

  if (action === "publish" || action === "trash") {
    const { error: updateError } = await supabase
      .from("posts")
      .update({ status: action === "publish" ? "publish" : "trash", modified_at: new Date().toISOString() })
      .eq("wp_id", wpId);
    if (updateError) {
      return jsonResponse({ error: `update failed: ${updateError.message}` }, 500);
    }
    return jsonResponse({ ok: true, wp_id: wpId, status: action === "publish" ? "publish" : "trash" });
  }

  // action === "save": partial edit — only touches columns the caller sent.
  const update: Record<string, unknown> = { modified_at: new Date().toISOString() };

  if (typeof body.title === "string" && body.title.trim()) {
    update.title = body.title.trim();
  }
  if (typeof body.content_html === "string" && body.content_html.trim()) {
    update.content_html = body.content_html;
  }
  if (typeof body.excerpt_html === "string") {
    update.excerpt_html = body.excerpt_html.trim() || null;
  }

  const imageBase64 = typeof body.image_base64 === "string" ? body.image_base64.trim() : "";
  if (imageBase64) {
    const dataUrlMatch = imageBase64.match(/^data:([^;]+);base64,(.+)$/s);
    const raw = (dataUrlMatch ? dataUrlMatch[2] : imageBase64).replace(/\s/g, "");
    const imageMimeType =
      dataUrlMatch?.[1] ??
      (typeof body.image_mime_type === "string" ? body.image_mime_type.trim() : "") ??
      "image/jpeg";
    const ext = IMAGE_MIME_EXT[imageMimeType];
    if (!ext) {
      return jsonResponse(
        { error: `unsupported image type "${imageMimeType}" — expected jpeg, png, or webp` },
        400
      );
    }
    let imageBytes: Uint8Array;
    try {
      imageBytes = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
    } catch {
      return jsonResponse({ error: "image_base64 is not valid base64" }, 400);
    }
    const path = `images/${existing.slug}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, imageBytes, { contentType: imageMimeType, upsert: true });
    if (uploadError) {
      return jsonResponse({ error: `image upload failed: ${uploadError.message}` }, 500);
    }
    update.featured_image_url = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
  }

  const { data: saved, error: updateError } = await supabase
    .from("posts")
    .update(update)
    .eq("wp_id", wpId)
    .select()
    .single();
  if (updateError) {
    return jsonResponse({ error: `save failed: ${updateError.message}` }, 500);
  }

  return jsonResponse({ ok: true, post: saved });
});

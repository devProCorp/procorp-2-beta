// Supabase Edge Function (Deno) — single entry point for n8n to publish a
// Journal post straight into blog.posts, replacing the old
// n8n -> WordPress flow. See docs/decisions/0004-n8n-publish-edge-function.md.
//
// Does the whole thing in the right order in one call: uploads the audio /
// featured image to the public `blog-assets` Storage bucket first, embeds
// the resulting URLs into content_html, THEN upserts the blog.posts row —
// n8n never has to sequence storage-then-db itself or hold the
// service-role key (only this lightweight shared secret).
//
// Request: multipart/form-data POST, header `x-publish-secret`.
// Text fields: title*, slug*, content_html*, excerpt_html, category
//   (id/slug/name of one of the real categories, or up to two separated by
//   commas). Missing, "auto" or unrecognized → Claude picks 1–2 categories
//   from the title and text (category_inferred=true); if that call fails,
//   "Vivir en Europa". Re-posting a slug whose categories were chosen by a
//   person (category_inferred=false) keeps them. tags
//   (comma-separated), author_name, status (default "publish"),
//   published_at (ISO, default now), seo_title, seo_description.
// File fields: audio (mp4/mpeg), image (jpeg/png/webp) — both optional.
// image can also travel as text instead of a binary file: `image_base64`
// (a raw base64 string, or a full `data:<mime>;base64,<...>` URL) plus
// `image_mime_type` when the string isn't a data URL (defaults to
// image/jpeg if omitted). Useful when n8n produces the image inline rather
// than as binary data further up the flow.
//
// Re-posting the same slug updates that row in place (upsert on wp_id,
// resolved by looking up the existing slug first) instead of creating a
// duplicate — safe to retry a failed n8n run.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk@0.135.0";

// Inlined rather than imported from ../_shared/blog-categories.ts: the
// Management API's single-file deploy path (used to ship this function,
// see docs/decisions/0004-n8n-publish-edge-function.md) doesn't have a
// verified story for cross-directory relative imports, so this function is
// kept self-contained. Keep this table in sync with CATEGORIES in
// ../_shared/blog-categories.ts (used by future CLI-deployed functions) and
// CATEGORY_TABLE in web/scripts/snapshot-supabase.mjs.
const CATEGORIES: { id: number; name: string; slug: string }[] = [
  { id: 56, name: "Ciudadanía europea", slug: "ciudadania-europea" },
  { id: 57, name: "Emigrar a España", slug: "emigrar-a-espana" },
  { id: 58, name: "Emigrar a Portugal", slug: "emigrar-a-portugal" },
  { id: 59, name: "Vivir en Europa", slug: "vivir-en-europa" },
  {
    id: 156,
    name: "Nacionalidad española por origen sefardí",
    slug: "nacionalidad-espanola-por-origen-sefardi",
  },
  { id: 157, name: "Ingeniería de Negocios", slug: "ingenieria-de-negocios" },
  { id: 158, name: "Inversiones", slug: "inversiones" },
  { id: 159, name: "Actualidad internacional", slug: "actualidad-internacional" },
];
const FALLBACK_CATEGORY_ID = 59; // "Vivir en Europa" — same fallback the original WP migration used.
const CATEGORY_DIACRITICS_RE = /[̀-ͯ]/g;

function foldDiacritics(value: string): string {
  return value.normalize("NFD").replace(CATEGORY_DIACRITICS_RE, "").toLowerCase();
}

/** Resolves a caller-supplied category (id, slug, or name — case/diacritic-insensitive) to a real category. */
function resolveCategory(input: string | number | undefined | null): {
  id: number;
  name: string;
  inferred: boolean;
} {
  if (input !== undefined && input !== null && input !== "") {
    const asId = typeof input === "number" ? input : Number(input);
    if (Number.isInteger(asId)) {
      const byId = CATEGORIES.find((c) => c.id === asId);
      if (byId) return { id: byId.id, name: byId.name, inferred: false };
    }
    const normalized = foldDiacritics(String(input).trim());
    const byName = CATEGORIES.find(
      (c) => c.slug === normalized || foldDiacritics(c.name) === normalized
    );
    if (byName) return { id: byName.id, name: byName.name, inferred: false };
  }
  const fallback = CATEGORIES.find((c) => c.id === FALLBACK_CATEGORY_ID)!;
  return { id: fallback.id, name: fallback.name, inferred: true };
}

type Category = (typeof CATEGORIES)[number];
type ResolvedCategories = { list: Category[]; inferred: boolean };

/** Up to two categories given by the caller ("56", "inversiones", "157,158"…); null if none is valid. */
function categoriesFromInput(input: string | null): Category[] | null {
  const parts = (input ?? "")
    .split(",")
    .map((p) => p.trim())
    .filter((p) => p && foldDiacritics(p) !== "auto");
  const found: Category[] = [];
  for (const part of parts) {
    const r = resolveCategory(part);
    const c = CATEGORIES.find((x) => x.id === r.id)!;
    if (!r.inferred && !found.includes(c)) found.push(c);
  }
  return found.length ? found.slice(0, 2) : null;
}

// --- Automatic categorization (Claude) ---
// One short structured-output call: the answer can only be slugs from
// CATEGORIES. Any failure (no key, refusal, network) falls back to the old
// behavior instead of failing the publish.
const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
const anthropic = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null;

const CATEGORY_GUIDE: Record<string, string> = {
  "ciudadania-europea": "nacionalidad o ciudadanía de un país europeo (requisitos, leyes de nietos, descendencia, conservación, récords de nacionalizaciones)",
  "emigrar-a-espana": "mudarse, residir o regularizarse en España (visados, residencias, extranjería, vida práctica)",
  "emigrar-a-portugal": "mudarse, residir o nacionalizarse en Portugal",
  "vivir-en-europa": "política migratoria europea o de varios países de Europa, fronteras, UE",
  "nacionalidad-espanola-por-origen-sefardi": "nacionalidad española o portuguesa por origen sefardí",
  "ingenieria-de-negocios": "empresa, procesos, automatización, inteligencia artificial, tecnología, productividad, casos de PRO CORP",
  "inversiones": "invertir, mercado inmobiliario, economía, capital, patrimonio",
  "actualidad-internacional": "noticias políticas, diplomáticas o de actualidad sin foco en trámites migratorios",
};

const stripTags = (html: string) =>
  html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

async function classifyWithClaude(title: string, contentHtml: string): Promise<Category[] | null> {
  if (!anthropic) return null;
  const text = stripTags(contentHtml).slice(0, 6000);
  try {
    const response = await anthropic.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 2000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: {
        effort: "low",
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              categories: {
                type: "array",
                items: { type: "string", enum: CATEGORIES.map((c) => c.slug) },
              },
            },
            required: ["categories"],
            additionalProperties: false,
          },
        },
      },
      system:
        "Clasificas artículos del blog de PRO CORP (Ingeniería de Negocios, inversiones, migración y residencia en España y Portugal). " +
        "Devuelve la categoría principal. Añade una segunda solo si ese segundo tema ocupa una parte central del artículo; una mención o el contexto del país no bastan. En la duda, una sola.\n" +
        CATEGORIES.map((c) => `- ${c.slug}: ${CATEGORY_GUIDE[c.slug] ?? c.name}`).join("\n"),
      messages: [{ role: "user", content: `Título: ${title}\n\nTexto:\n${text}` }],
    });
    if (response.stop_reason === "refusal") return null;
    const block = response.content.find((b) => b.type === "text");
    if (!block || block.type !== "text") return null;
    const slugs: unknown = JSON.parse(block.text)?.categories;
    if (!Array.isArray(slugs)) return null;
    const list = [...new Set(slugs)]
      .map((s) => CATEGORIES.find((c) => c.slug === s))
      .filter((c): c is Category => !!c)
      .slice(0, 2);
    return list.length ? list : null;
  } catch (err) {
    console.error("[publish-blog-post] categorización automática falló:", err);
    return null;
  }
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const PUBLISH_SECRET = Deno.env.get("PUBLISH_SECRET")!;
// Optional (not required for publishing itself): lets the response hand back
// a ready-to-click preview link for drafts. Same project secret
// preview-blog-post/moderate-blog-post already check — no separate
// provisioning needed here.
const PREVIEW_SECRET = Deno.env.get("PREVIEW_SECRET");

const BUCKET = "blog-assets";
const JOURNAL_BASE_URL = "https://www.pro-corp.net/blog";
const PREVIEW_BASE_URL = "https://www.pro-corp.net/blog/preview";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  db: { schema: "blog" },
  auth: { persistSession: false },
});

const IMAGE_MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const DIACRITICS_RE = /[̀-ͯ]/g;

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse({ error: "method not allowed, use POST" }, 405);
  }
  if (req.headers.get("x-publish-secret") !== PUBLISH_SECRET) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonResponse(
      { error: "expected multipart/form-data body" },
      400
    );
  }

  const title = (form.get("title") as string | null)?.trim();
  const slugInput = (form.get("slug") as string | null)?.trim();
  const contentHtml = (form.get("content_html") as string | null)?.trim();

  const missing = [
    !title && "title",
    !slugInput && "slug",
    !contentHtml && "content_html",
  ].filter(Boolean);
  if (missing.length) {
    return jsonResponse({ error: `missing required field(s): ${missing.join(", ")}` }, 400);
  }

  const slug = slugify(slugInput!);
  if (!slug) {
    return jsonResponse({ error: "slug resolved to empty string after normalization" }, 400);
  }

  const tagNames = ((form.get("tags") as string | null) ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const status = (form.get("status") as string | null)?.trim() || "publish";
  const publishedAt = (form.get("published_at") as string | null)?.trim() || new Date().toISOString();
  const authorName = (form.get("author_name") as string | null)?.trim() || null;
  const seoTitle = (form.get("seo_title") as string | null)?.trim() || null;
  const seoDescription = (form.get("seo_description") as string | null)?.trim() || null;
  const excerptHtml = (form.get("excerpt_html") as string | null)?.trim() || null;

  // Find whether this slug already exists — reuse its wp_id (update) or
  // mint a fresh one from the dedicated sequence (insert). Never touches
  // the real WordPress id space (see the 0001 migration for why).
  const { data: existing, error: lookupError } = await supabase
    .from("posts")
    .select("wp_id, category_ids, category_names, category_inferred")
    .eq("slug", slug)
    .maybeSingle();
  if (lookupError) {
    return jsonResponse({ error: `slug lookup failed: ${lookupError.message}` }, 500);
  }

  // Categories: the caller's choice, else the ones a person already set on
  // this slug, else Claude, else the historical fallback.
  let categories: ResolvedCategories;
  const given = categoriesFromInput(form.get("category") as string | null);
  const keptFromHuman =
    existing && existing.category_inferred === false && existing.category_ids?.length
      ? CATEGORIES.filter((c) => existing.category_ids.includes(c.id))
      : [];
  if (given) categories = { list: given, inferred: false };
  else if (keptFromHuman.length) categories = { list: keptFromHuman, inferred: false };
  else {
    const auto = await classifyWithClaude(title!, contentHtml!);
    categories = auto
      ? { list: auto, inferred: true }
      : { list: [CATEGORIES.find((c) => c.id === FALLBACK_CATEGORY_ID)!], inferred: true };
  }

  let wpId: number;
  if (existing) {
    wpId = existing.wp_id;
  } else {
    const { data: nextId, error: seqError } = await supabase.rpc("next_native_post_id");
    if (seqError || nextId == null) {
      return jsonResponse(
        { error: `could not mint a new post id: ${seqError?.message ?? "no value returned"}` },
        500
      );
    }
    wpId = Number(nextId);
  }

  // --- Assets first: content_html/audio_url/featured_image_url all need
  // the final Storage URL, so nothing gets written to blog.posts until
  // these uploads succeed. ---
  let audioUrl: string | null = null;
  const audioFile = form.get("audio");
  if (audioFile instanceof File) {
    const path = `audio/${slug}.mp4`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, audioFile, {
        // Mirrors the historical migration: the real Content-Type off
        // NotebookLM/WordPress is video/mp4, forced to audio/mp4 here so it
        // plays correctly in an <audio> tag.
        contentType: "audio/mp4",
        upsert: true,
      });
    if (uploadError) {
      return jsonResponse({ error: `audio upload failed: ${uploadError.message}` }, 500);
    }
    audioUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
  }

  let featuredImageUrl: string | null = null;
  const imageFile = form.get("image");
  let imageBody: File | Uint8Array | null = null;
  let imageMimeType: string | null = null;

  if (imageFile instanceof File) {
    imageBody = imageFile;
    imageMimeType = imageFile.type;
  } else {
    const imageBase64 = (form.get("image_base64") as string | null)?.trim();
    if (imageBase64) {
      const dataUrlMatch = imageBase64.match(/^data:([^;]+);base64,(.+)$/s);
      const raw = (dataUrlMatch ? dataUrlMatch[2] : imageBase64).replace(/\s/g, "");
      imageMimeType =
        dataUrlMatch?.[1] ?? (form.get("image_mime_type") as string | null)?.trim() ?? "image/jpeg";
      try {
        imageBody = Uint8Array.from(atob(raw), (c) => c.charCodeAt(0));
      } catch {
        return jsonResponse({ error: "image_base64 is not valid base64" }, 400);
      }
    }
  }

  if (imageBody) {
    const ext = imageMimeType ? IMAGE_MIME_EXT[imageMimeType] : undefined;
    if (!ext) {
      return jsonResponse(
        {
          error: `unsupported image type "${imageMimeType ?? "unknown"}" — expected jpeg, png, or webp`,
        },
        400
      );
    }
    const path = `images/${slug}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, imageBody, { contentType: imageMimeType!, upsert: true });
    if (uploadError) {
      return jsonResponse({ error: `image upload failed: ${uploadError.message}` }, 500);
    }
    featuredImageUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
  }

  let finalContentHtml = contentHtml!;
  if (audioUrl && !finalContentHtml.includes("<audio")) {
    finalContentHtml = `<audio controls preload="none" src="${audioUrl}"></audio>\n${finalContentHtml}`;
  }

  const row = {
    wp_id: wpId,
    slug,
    link: `${JOURNAL_BASE_URL}/${slug}`,
    status,
    title: title!,
    excerpt_html: excerptHtml,
    content_html: finalContentHtml,
    author_name: authorName,
    featured_image_url: featuredImageUrl,
    audio_url: audioUrl,
    category_ids: categories.list.map((c) => c.id),
    category_names: categories.list.map((c) => c.name),
    category_inferred: categories.inferred,
    tag_ids: [],
    tag_names: tagNames,
    seo_title: seoTitle,
    seo_description: seoDescription,
    raw_json: {
      source: "n8n",
      received_at: new Date().toISOString(),
      fields: { title, slug, categories: categories.list.map((c) => c.name), tags: tagNames, status, author_name: authorName },
    },
    published_at: publishedAt,
    modified_at: new Date().toISOString(),
    synced_at: new Date().toISOString(),
  };

  const { data: saved, error: upsertError } = await supabase
    .from("posts")
    .upsert(row, { onConflict: "wp_id" })
    .select()
    .single();
  if (upsertError) {
    return jsonResponse({ error: `db upsert failed: ${upsertError.message}` }, 500);
  }

  return jsonResponse({
    ok: true,
    wp_id: saved.wp_id,
    slug: saved.slug,
    journal_url: `${JOURNAL_BASE_URL}/${slug}`,
    categories: categories.list.map((c) => c.name),
    category_inferred: categories.inferred,
    ...(status === "draft" && PREVIEW_SECRET && {
      preview_url: `${PREVIEW_BASE_URL}/?id=${saved.wp_id}&key=${PREVIEW_SECRET}`,
    }),
    note:
      status === "draft"
        ? "Draft — only visible via preview_url above. /journal only ever lists status='publish' posts."
        : "web/ reads the Journal live from Supabase — this post is visible immediately, no redeploy needed.",
  });
});

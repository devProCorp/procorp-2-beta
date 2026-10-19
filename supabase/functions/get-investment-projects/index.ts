// Supabase Edge Function (Deno) — public list of investment projects for the
// /projects/ page of pro-corp.net. Same source as inversion.pro-corp.net:
// `investment_projects` (only is_visible) grouped by `home_categories`
// (only is_visible), so a project published from the intranet appears on the
// website without a redeploy. Two callers:
//   1. web/src/app/projects/page.tsx — at build time, so the static HTML
//      already carries the cards (SEO, no empty first paint).
//   2. web/src/components/projects/ProjectsGrid.tsx — live from the browser.
//
// Why this is safe without auth: it returns a fixed whitelist of public
// fields (name, description, image, category, link) and nothing else — no
// prices, contracts, portals or documents — and the service-role key never
// leaves this function's runtime (Supabase injects it automatically).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const INVERSION_URL = "https://inversion.pro-corp.net";
const FIRMA_URL = "https://villa-valeria.pro-corp.net";

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, OPTIONS",
  "access-control-allow-headers": "content-type",
};

type I18n = Record<string, Record<string, unknown>> | null;

// Same rules as inversiones (app/[locale]/enlaces/page.tsx): absolute URLs as
// they are, `firma:/ruta` to the signing app, anything else is a page of
// inversion.pro-corp.net.
function projectUrl(path: string | null): string | null {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith("firma:")) return `${FIRMA_URL}${path.slice("firma:".length) || "/select-role"}`;
  return `${INVERSION_URL}/${path.replace(/^\//, "")}`;
}

// Some descriptions are stored as HTML (<h1>, <p>, </br>): the cards show
// plain text, so tags go and the basic entities are decoded.
function plainText(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
  return t || null;
}

// Only the translated public fields travel: { en: {name, description}, pt: {...} }.
function pickI18n(i18n: I18n, map: Record<string, string>) {
  const out: Record<string, Record<string, string>> = {};
  for (const [lang, fields] of Object.entries(i18n ?? {})) {
    for (const [from, to] of Object.entries(map)) {
      const v = plainText(fields?.[from]);
      if (v) (out[lang] ??= {})[to] = v;
    }
  }
  return out;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== "GET") {
    return Response.json({ error: "method not allowed, use GET" }, { status: 405, headers: CORS_HEADERS });
  }

  const [cats, projects] = await Promise.all([
    supabase
      .from("home_categories")
      .select("id, category, description, path, order_num, i18n")
      .eq("is_visible", true)
      .order("order_num", { ascending: true }),
    supabase
      .from("investment_projects")
      .select("id, category_id, investment_name, description, path, image_url, project_order, i18n")
      .eq("is_visible", true)
      .order("project_order", { ascending: true, nullsFirst: false })
      .order("investment_name", { ascending: true }),
  ]);
  if (cats.error || projects.error) {
    console.error("[get-investment-projects]", cats.error ?? projects.error);
    return Response.json({ error: "internal_error" }, { status: 500, headers: CORS_HEADERS });
  }

  const categories = (cats.data ?? []).map((c) => ({
    id: c.id,
    name: c.category,
    description: plainText(c.description),
    slug: c.path,
    url: c.path ? `${INVERSION_URL}/${c.path}` : null,
    i18n: pickI18n(c.i18n as I18n, { category: "name", description: "description" }),
  }));
  const visibles = new Set(categories.map((c) => c.id));

  const items = (projects.data ?? [])
    // Un proyecto de una categoría oculta tampoco se ve en inversiones.
    .filter((p) => p.category_id != null && visibles.has(p.category_id))
    .map((p) => ({
      id: p.id,
      category_id: p.category_id,
      name: p.investment_name,
      description: plainText(p.description),
      image_url: p.image_url || null,
      url: projectUrl(p.path),
      i18n: pickI18n(p.i18n as I18n, { investment_name: "name", description: "description" }),
    }));

  return Response.json(
    { categories, projects: items },
    { headers: { ...CORS_HEADERS, "cache-control": "public, max-age=300" } },
  );
});

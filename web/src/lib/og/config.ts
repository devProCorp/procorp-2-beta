// Configuración editable de las tarjetas de vista previa (Open Graph).
// COPIA de packages/ui/src/og/config.ts (repo pro-corp-platform): cambiar ambos.
//
// La edita el «Taller de tarjetas» de la intranet (/tarjetas) y la guardan las
// tablas og_templates / og_overrides de Supabase (migración 091). La leen:
//   · pro-corp-platform, al generar cada tarjeta (servidor, con caché corta);
//   · pro-corp.net (repo procorp-2-beta), durante el build estático — ese repo
//     mantiene una copia de este archivo y de ProCorpOgCard: cambiar los dos.
//
// Regla: una configuración ausente, inválida o ilegible NUNCA rompe una
// tarjeta. normalizeOgConfig() acota cada campo y cae al diseño por defecto,
// que reproduce exactamente la tarjeta anterior al taller.

export const OG_TEMPLATE_KEYS = [
  "site",
  "project",
  "portal",
  "service",
  "article",
] as const;
export type OgTemplateKey = (typeof OG_TEMPLATE_KEYS)[number];

export const OG_TEMPLATE_LABELS: Record<OgTemplateKey, string> = {
  site: "Portada de cada sitio",
  project: "Proyecto de inversión",
  portal: "Portal privado",
  service: "Servicio (pro-corp.net)",
  article: "Artículo del Journal",
};

/** Plantillas cuyas tarjetas genera pro-corp.net en su build estático. */
export const OG_STATIC_SITE_KEYS: readonly OgTemplateKey[] = [
  "site",
  "service",
  "article",
];

export const OG_TARGET_TYPES = ["project", "service", "article"] as const;
export type OgTargetType = (typeof OG_TARGET_TYPES)[number];

export type OgLayout =
  | "photo-right"
  | "photo-left"
  | "photo-background"
  | "no-photo";
export type OgLogoPosition = "top-left" | "top-right" | "bottom-right";
export type OgLogoSize = "s" | "m" | "l";

/** Paleta cerrada: el taller no permite colores fuera de la marca. */
export const OG_BACKGROUNDS = {
  carbon: { label: "Carbón", from: "#171A20", to: "#101216", solid: "#101216" },
  grafito: {
    label: "Grafito",
    from: "#272B33",
    to: "#1A1D23",
    solid: "#1A1D23",
  },
  granate: {
    label: "Granate",
    from: "#5C0A15",
    to: "#33050C",
    solid: "#33050C",
  },
  rojo: {
    label: "Rojo PRO CORP",
    from: "#CE1026",
    to: "#9E0C1D",
    solid: "#9E0C1D",
  },
} as const;
export type OgBackground = keyof typeof OG_BACKGROUNDS;

export const OG_ACCENTS = {
  rojo: { label: "Rojo", bar: "#CE1026", eyebrow: "#E74A5D" },
  blanco: { label: "Blanco", bar: "#F7F7F5", eyebrow: "#F7F7F5" },
  gris: { label: "Gris", bar: "#8E9C95", eyebrow: "#B8BDC6" },
} as const;
export type OgAccent = keyof typeof OG_ACCENTS;

export interface OgLayoutConfig {
  /** Composición. Si la tarjeta no tiene foto se usa siempre «no-photo». */
  layout: OgLayout;
  logoPosition: OgLogoPosition;
  logoSize: OgLogoSize;
  logoVariant: "color" | "white";
  /** Multiplicador del tamaño automático del título (0.8–1.3). */
  titleScale: number;
  titleAlign: "left" | "center";
  titleMaxLines: 2 | 3;
  titleWeight: 600 | 700 | 800;
  showEyebrow: boolean;
  showSubtitle: boolean;
  showDomain: boolean;
  showAccentBar: boolean;
  /** Retícula y escuadras rojas de la versión sin foto. */
  showDecor: boolean;
  background: OgBackground;
  accent: OgAccent;
  /** Opacidad del velo sobre la foto en «photo-background» (0.3–0.9). */
  overlayOpacity: number;
}

/** Ajustes de una tarjeta concreta (proyecto, servicio o artículo). */
export interface OgTargetOverride {
  /** Título solo para la tarjeta; el título real no cambia. */
  title?: string;
  subtitle?: string;
  eyebrow?: string;
  hideSubtitle?: boolean;
  /** Otra foto (URL pública, p. ej. bucket teasers). */
  photoUrl?: string;
  /** Punto de encuadre de la foto, en % (0–100). */
  focalX?: number;
  focalY?: number;
  /** Imagen terminada (Canva/Figma): se sirve tal cual en vez de la tarjeta. */
  finishedImageUrl?: string;
}

export const DEFAULT_OG_CONFIG: OgLayoutConfig = {
  layout: "photo-right",
  logoPosition: "top-left",
  logoSize: "m",
  logoVariant: "color",
  titleScale: 1,
  titleAlign: "left",
  titleMaxLines: 2,
  titleWeight: 800,
  showEyebrow: true,
  showSubtitle: true,
  showDomain: true,
  showAccentBar: true,
  showDecor: true,
  background: "carbon",
  accent: "rojo",
  overlayOpacity: 0.62,
};

/** Diferencias por plantilla respecto al diseño base. */
const TEMPLATE_DEFAULTS: Partial<
  Record<OgTemplateKey, Partial<OgLayoutConfig>>
> = {
  article: { titleMaxLines: 3 },
};

export function defaultOgConfig(key: OgTemplateKey): OgLayoutConfig {
  return { ...DEFAULT_OG_CONFIG, ...TEMPLATE_DEFAULTS[key] };
}

function pick<T extends string | number>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function clamp(value: unknown, min: number, max: number, fallback: number) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function bool(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

/** Acota una configuración arbitraria (de la BD o del editor) a valores válidos. */
export function normalizeOgConfig(
  input: unknown,
  key: OgTemplateKey,
): OgLayoutConfig {
  const base = defaultOgConfig(key);
  const raw =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  return {
    layout: pick(
      raw.layout,
      ["photo-right", "photo-left", "photo-background", "no-photo"] as const,
      base.layout,
    ),
    logoPosition: pick(
      raw.logoPosition,
      ["top-left", "top-right", "bottom-right"] as const,
      base.logoPosition,
    ),
    logoSize: pick(raw.logoSize, ["s", "m", "l"] as const, base.logoSize),
    logoVariant: pick(
      raw.logoVariant,
      ["color", "white"] as const,
      base.logoVariant,
    ),
    titleScale:
      Math.round(clamp(raw.titleScale, 0.8, 1.3, base.titleScale) * 100) / 100,
    titleAlign: pick(
      raw.titleAlign,
      ["left", "center"] as const,
      base.titleAlign,
    ),
    titleMaxLines: pick(raw.titleMaxLines, [2, 3] as const, base.titleMaxLines),
    titleWeight: pick(
      raw.titleWeight,
      [600, 700, 800] as const,
      base.titleWeight,
    ),
    showEyebrow: bool(raw.showEyebrow, base.showEyebrow),
    showSubtitle: bool(raw.showSubtitle, base.showSubtitle),
    showDomain: bool(raw.showDomain, base.showDomain),
    showAccentBar: bool(raw.showAccentBar, base.showAccentBar),
    showDecor: bool(raw.showDecor, base.showDecor),
    background: pick(
      raw.background,
      Object.keys(OG_BACKGROUNDS) as OgBackground[],
      base.background,
    ),
    accent: pick(
      raw.accent,
      Object.keys(OG_ACCENTS) as OgAccent[],
      base.accent,
    ),
    overlayOpacity:
      Math.round(
        clamp(raw.overlayOpacity, 0.3, 0.9, base.overlayOpacity) * 100,
      ) / 100,
  };
}

function cleanText(value: unknown, max: number) {
  if (typeof value !== "string") return undefined;
  const text = value.replace(/\s+/g, " ").trim().slice(0, max);
  return text || undefined;
}

function cleanUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

export function normalizeOgOverride(input: unknown): OgTargetOverride {
  const raw =
    input && typeof input === "object"
      ? (input as Record<string, unknown>)
      : {};
  const override: OgTargetOverride = {
    title: cleanText(raw.title, 140),
    subtitle: cleanText(raw.subtitle, 240),
    eyebrow: cleanText(raw.eyebrow, 60),
    hideSubtitle: raw.hideSubtitle === true ? true : undefined,
    photoUrl: cleanUrl(raw.photoUrl),
    finishedImageUrl: cleanUrl(raw.finishedImageUrl),
  };
  if (raw.focalX != null || raw.focalY != null) {
    override.focalX = Math.round(clamp(raw.focalX, 0, 100, 50));
    override.focalY = Math.round(clamp(raw.focalY, 0, 100, 50));
  }
  for (const k of Object.keys(override) as (keyof OgTargetOverride)[]) {
    if (override[k] === undefined) delete override[k];
  }
  return override;
}

/** Aplica los textos del ajuste por tarjeta sobre los automáticos. */
export function applyOgOverride(
  content: { title: string; subtitle: string; eyebrow?: string },
  override: OgTargetOverride | null | undefined,
) {
  if (!override) return content;
  return {
    title: override.title ?? content.title,
    subtitle: override.hideSubtitle
      ? ""
      : (override.subtitle ?? content.subtitle),
    eyebrow: override.eyebrow ?? content.eyebrow,
  };
}

/** Tamaño del panel de foto que espera la tarjeta según la composición. */
export function ogPhotoSize(config: OgLayoutConfig) {
  return config.layout === "photo-background"
    ? { width: 1200, height: 630 }
    : { width: 460, height: 630 };
}

export interface OgSettings {
  config: OgLayoutConfig;
  override: OgTargetOverride | null;
  /** Cambia cuando se publica algo: sirve para invalidar cachés de URL. */
  revision: string;
}

interface FetchOgSettingsOptions {
  key: OgTemplateKey;
  targetType?: OgTargetType;
  targetId?: string;
  supabaseUrl?: string;
  anonKey?: string;
  /** Segundos de caché de Next para la lectura (servidor). */
  revalidateSeconds?: number;
}

type TemplateRow = { published: unknown; version: number | null };
type OverrideRow = { published: unknown; published_at: string | null };

async function restSelect<T>(
  base: string,
  anonKey: string,
  query: string,
  revalidateSeconds: number,
): Promise<T[]> {
  const response = await fetch(`${base}/rest/v1/${query}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    signal: AbortSignal.timeout(3000),
    // Next.js lo usa para cachear; fuera de Next se ignora.
    next: { revalidate: revalidateSeconds },
  } as RequestInit);
  if (!response.ok) throw new Error(`og settings: ${response.status}`);
  return (await response.json()) as T[];
}

/**
 * Lee la configuración PUBLICADA de una plantilla (y, si se pide, el ajuste de
 * una tarjeta concreta) por la API REST de Supabase con la clave anónima.
 * Ante cualquier fallo devuelve el diseño por defecto.
 */
export async function fetchOgSettings({
  key,
  targetType,
  targetId,
  supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  revalidateSeconds = 120,
}: FetchOgSettingsOptions): Promise<OgSettings> {
  const fallback: OgSettings = {
    config: defaultOgConfig(key),
    override: null,
    revision: "0",
  };
  if (!supabaseUrl || !anonKey) return fallback;

  try {
    const [templates, overrides] = await Promise.all([
      restSelect<TemplateRow>(
        supabaseUrl,
        anonKey,
        `og_templates?select=published,version&key=eq.${encodeURIComponent(key)}&limit=1`,
        revalidateSeconds,
      ),
      targetType && targetId
        ? restSelect<OverrideRow>(
            supabaseUrl,
            anonKey,
            `og_overrides?select=published,published_at&target_type=eq.${encodeURIComponent(targetType)}&target_id=eq.${encodeURIComponent(targetId)}&limit=1`,
            revalidateSeconds,
          ).catch(() => [])
        : Promise.resolve([] as OverrideRow[]),
    ]);
    const template = templates[0];
    const overrideRow = overrides[0];
    const override = overrideRow?.published
      ? normalizeOgOverride(overrideRow.published)
      : null;
    return {
      config: normalizeOgConfig(template?.published, key),
      override: override && Object.keys(override).length ? override : null,
      revision: `${template?.version ?? 0}-${overrideRow?.published_at ? Date.parse(overrideRow.published_at) : 0}`,
    };
  } catch {
    return fallback;
  }
}

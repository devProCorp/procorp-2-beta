import {
  getFeaturedImageUrl,
  getPostCategories,
  stripHtml,
  type WPPost,
} from "@/lib/wordpress-presentation";

// Leftover text of the Blogcast audio player that WordPress copied into
// excerpts and bodies ("PRO CORP — BLOGCAST ▶ Dale click… Tu navegador…").
const PLAYER_TEXT =
  /^(?:PRO CORP\s*[-–—]\s*BLOGCAST\s*)?(?:▶\s*)?(?:Dale click para escuchar este artículo\.?\s*)?(?:Tu navegador no soporta (?:el elemento de audio|audio HTML5)\.?\s*)?/i;

// Placeholder the CMS leaves in seo_description when nobody filled it in.
const PLACEHOLDER_DESCRIPTIONS = new Set(["descripción seo", "descripcion seo"]);

// Shorter than this, a stored description is a fragment, not a summary: in
// 29 migrated posts Yoast saved the player text cut at ~90 characters, so
// what is left after PLAYER_TEXT is "La relación entre España y". Such a
// candidate is skipped and the next one (excerpt, then body) is used.
const MIN_DESCRIPTION_LENGTH = 70;

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pro-corp.net"
).replace(/\/$/, "");

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ",
  hellip: "…", ndash: "–", mdash: "—", lsquo: "‘", rsquo: "’",
  ldquo: "“", rdquo: "”", laquo: "«", raquo: "»", iexcl: "¡", iquest: "¿",
  ordm: "º", ordf: "ª", deg: "°", euro: "€", middot: "·", bull: "•",
  aacute: "á", eacute: "é", iacute: "í", oacute: "ó", uacute: "ú",
  Aacute: "Á", Eacute: "É", Iacute: "Í", Oacute: "Ó", Uacute: "Ú",
  ntilde: "ñ", Ntilde: "Ñ", uuml: "ü", Uuml: "Ü", ccedil: "ç", Ccedil: "Ç",
  atilde: "ã", otilde: "õ", acirc: "â", ecirc: "ê", ocirc: "ô",
  agrave: "à", egrave: "è",
};

function decodeEntities(text: string) {
  // Twice: WordPress content sometimes double-escapes (&amp;iacute;).
  let decoded = text;
  for (let pass = 0; pass < 2; pass++) {
    decoded = decoded.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
      if (entity[0] === "#") {
        const code = entity[1].toLowerCase() === "x"
          ? parseInt(entity.slice(2), 16)
          : parseInt(entity.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : match;
      }
      return NAMED_ENTITIES[entity] ?? match;
    });
  }
  return decoded.replace(/\[…\]/g, "…");
}

export function plainText(html: string | undefined | null) {
  // Article bodies embed <style>/<script> blocks (the audio player); their
  // contents are not text and must not leak into descriptions.
  const withoutCode = (html ?? "").replace(
    /<(style|script|noscript)\b[^>]*>[\s\S]*?<\/\1>/gi,
    " ",
  );
  return decodeEntities(stripHtml(withoutCode)).replace(/\s+/g, " ").trim();
}

export function getArticleTitle(post: WPPost) {
  return plainText(post.title.rendered) || plainText(post.seo_title);
}

// Search results cut titles longer than this; the audit of 2026-11-04 found
// 134 articles above it. Counts the " | PRO CORP" suffix.
const MAX_SEO_TITLE_LENGTH = 65;
const SEO_TITLE_BRAND = " | PRO CORP";
// Yoast saved the site name inside seo_title ("… - Pro Corp Corporate Development").
const SEO_TITLE_SITE_NAME = /\s*[-–|]\s*pro[ -]corp(?: corporate development)?\s*$/i;

/**
 * Title for <title>, og:title and twitter:title. The visible H1 while it fits
 * with the brand; otherwise the CMS «Título SEO» (seo_title) when it fits.
 * The slug and the H1 never change.
 */
export function getArticleSeoTitle(post: WPPost) {
  const title = getArticleTitle(post);
  if ((title + SEO_TITLE_BRAND).length <= MAX_SEO_TITLE_LENGTH) return title;
  const seoTitle = plainText(post.seo_title).replace(SEO_TITLE_SITE_NAME, "").trim();
  return seoTitle && seoTitle.length <= MAX_SEO_TITLE_LENGTH ? seoTitle : title;
}

/** <title>: SEO title plus the brand, without the brand when it does not fit. */
export function getArticleDocumentTitle(post: WPPost) {
  const title = getArticleSeoTitle(post);
  return (title + SEO_TITLE_BRAND).length <= MAX_SEO_TITLE_LENGTH
    ? title + SEO_TITLE_BRAND
    : title;
}

/** Meta description: Yoast/CMS text, then excerpt, then the article body. */
export function getArticleDescription(post: WPPost, maxLength = 160) {
  // The body opens with the Blogcast audio player; the text starts after it.
  const body = post.content.rendered;
  const afterPlayer = body.includes("</audio>")
    ? body.slice(body.lastIndexOf("</audio>") + "</audio>".length)
    : body;
  const candidates = [post.seo_description, post.excerpt.rendered, afterPlayer];
  for (const [index, candidate] of candidates.entries()) {
    const text = plainText(candidate).replace(PLAYER_TEXT, "").trim();
    const isLast = index === candidates.length - 1;
    if (text.length < MIN_DESCRIPTION_LENGTH && !isLast) continue;
    if (text && !PLACEHOLDER_DESCRIPTIONS.has(text.toLowerCase())) {
      return text.length > maxLength
        ? `${text.slice(0, maxLength - 1).trimEnd()}…`
        : text;
    }
  }
  return "";
}

export function getArticleCategory(post: WPPost) {
  return getPostCategories(post)
    .map((term) => term.name)
    .filter(Boolean)[0];
}

/** Photo for the card: the featured image, else the Yoast OG image. */
export function getArticlePhoto(post: WPPost) {
  return getFeaturedImageUrl(post, "full") ?? post.seo_og_image_url ?? null;
}

/**
 * schema.org BlogPosting for posts without the Yoast schema migrated from
 * WordPress (`seo_schema`). Posts written after the migration have none, so
 * 93 of 177 articles carried no structured data (audit 2026-11-04).
 */
export function articleJsonLd(post: WPPost) {
  const url = `${SITE_URL}/blog/${post.slug}/`;
  const image = getArticlePhoto(post);
  const organization = { "@type": "Organization", name: "PRO CORP", url: SITE_URL };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: getArticleTitle(post).slice(0, 110),
    description: getArticleDescription(post),
    datePublished: post.date,
    dateModified: post.modified,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "es",
    ...(image && { image: [image] }),
    author: organization,
    publisher: organization,
  };
}

export function articleOgImagePath(post: WPPost) {
  return `/og/journal/${post.id}.jpg`;
}

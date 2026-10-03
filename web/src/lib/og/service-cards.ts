import { services } from "@/lib/services";

export const OG_DOMAIN = "pro-corp.net";

export const SITE_CARD = {
  title: "Technology-Based Orchestration",
  subtitle:
    "Pro Corp redesigns operating models, automates execution, and integrates assets, capital, and expertise through a transparent exchange platform.",
};

// LanguageContext is a client module, so its translations cannot be read while
// the static export renders these images. Keep these titles in sync with the
// `svc.NN.title` / `svc.NN.detail` keys (English, the site's default language).
const SERVICE_TEXT: Record<string, { title: string; subtitle: string }> = {
  "legal-solutions": {
    title: "Legal Solutions",
    subtitle: "Structured frameworks and cross-border structuring",
  },
  "sustainable-growth": {
    title: "Sustainable Growth - BPA",
    subtitle: "Operating model redesign and KPI systems",
  },
  "ip2-engineering": {
    title: "IP2$ Engineering",
    subtitle: "AI interfaces, simulators, and automation engines",
  },
  "exchange-platform": {
    title: "Exchange Platform",
    subtitle: "Transparent stakeholder portals and real-time simulations",
  },
  "business-process-automation": {
    title: "Business Process Automation",
    subtitle: "Process re-engineering and scalable cloud implementation",
  },
};

/** Narrow remote photos to the card's photo panel so the PNG stays light. */
function cardPhotoUrl(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "images.unsplash.com") {
      parsed.searchParams.set("w", "460");
      parsed.searchParams.set("h", "630");
      parsed.searchParams.set("fit", "crop");
      parsed.searchParams.set("q", "70");
      parsed.searchParams.set("fm", "jpg");
    }
    return parsed.toString();
  } catch {
    return undefined;
  }
}

/** Fetch the photo at build time; any failure falls back to the plain card. */
export async function loadCardPhoto(url: string | undefined) {
  const source = url ? cardPhotoUrl(url) : undefined;
  if (!source) return undefined;
  try {
    const response = await fetch(source, { signal: AbortSignal.timeout(8000) });
    const type = response.headers.get("content-type")?.split(";")[0] ?? "";
    if (!response.ok || !/^image\/(jpeg|png)$/.test(type)) return undefined;
    const bytes = Buffer.from(await response.arrayBuffer());
    return `data:${type};base64,${bytes.toString("base64")}`;
  } catch {
    return undefined;
  }
}

export function getServiceCard(slug: string) {
  const service = services.find((s) => s.slug === slug);
  const text = SERVICE_TEXT[slug];
  if (!service) return null;
  return {
    title: text?.title ?? slug.replace(/-/g, " "),
    subtitle: text?.subtitle ?? SITE_CARD.subtitle,
    photo: service.heroImage,
  };
}

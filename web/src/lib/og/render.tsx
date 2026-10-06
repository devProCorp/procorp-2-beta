import { ImageResponse } from "next/og";
import { PRO_CORP_OG_SIZE, ProCorpOgCard } from "@/lib/og/ProCorpOgCard";
import {
  applyOgOverride,
  fetchOgSettings,
  ogPhotoSize,
  type OgSettings,
  type OgTargetType,
  type OgTemplateKey,
} from "@/lib/og/config";
import { fetchPublicImage, prepareCardPhoto, toCardJpeg } from "@/lib/og/photo";
import { OG_DOMAIN, SITE_CARD, getServiceCard } from "@/lib/og/service-cards";

// Cada tarjeta lee en el build su diseño publicado en el Taller de tarjetas de
// la intranet (plantilla + ajuste de la tarjeta) y devuelve el JPEG final.
// Sin configuración (o si Supabase no responde) sale el diseño clásico.

interface CardContent {
  title: string;
  subtitle: string;
  eyebrow?: string;
  photo?: string | null;
}

/** Revisión publicada, para versionar la URL de la imagen (caché de WhatsApp). */
export async function getCardRevision(
  key: OgTemplateKey,
  targetType?: OgTargetType,
  targetId?: string,
) {
  return (await fetchOgSettings({ key, targetType, targetId })).revision;
}

async function renderCard(content: CardContent, settings: OgSettings) {
  const override = settings.override;

  // Imagen terminada (Canva/Figma) subida en el Taller: se publica tal cual.
  if (override?.finishedImageUrl) {
    const finished = await fetchPublicImage(override.finishedImageUrl, 10000);
    if (finished) {
      try {
        return await toCardJpeg(finished, true);
      } catch {
        // Ilegible: se genera la tarjeta normal.
      }
    }
  }

  const text = applyOgOverride(content, override);
  const imageUrl =
    settings.config.layout === "no-photo"
      ? undefined
      : await prepareCardPhoto(
          override?.photoUrl ?? content.photo,
          ogPhotoSize(settings.config),
          { x: override?.focalX, y: override?.focalY },
        );

  const card = new ImageResponse(
    <ProCorpOgCard
      eyebrow={text.eyebrow}
      title={text.title}
      subtitle={text.subtitle}
      domain={OG_DOMAIN}
      imageUrl={imageUrl}
      config={settings.config}
    />,
    PRO_CORP_OG_SIZE,
  );
  return toCardJpeg(Buffer.from(await card.arrayBuffer()));
}

export async function renderArticleCard(
  articleId: string,
  { title, subtitle, category, photo }: { title: string; subtitle: string; category?: string; photo?: string | null },
) {
  const settings = await fetchOgSettings({ key: "article", targetType: "article", targetId: articleId });
  return renderCard(
    { title, subtitle, eyebrow: category ? `Journal · ${category}` : "Journal", photo },
    settings,
  );
}

export async function renderSiteCard() {
  const settings = await fetchOgSettings({ key: "site" });
  return renderCard({ title: SITE_CARD.title, subtitle: SITE_CARD.subtitle }, settings);
}

export async function renderServiceCard(slug: string) {
  const card = getServiceCard(slug);
  const settings = await fetchOgSettings({ key: "service", targetType: "service", targetId: slug });
  return renderCard(
    {
      eyebrow: "Projects & solutions",
      title: card?.title ?? SITE_CARD.title,
      subtitle: card?.subtitle ?? SITE_CARD.subtitle,
      photo: card?.photo,
    },
    settings,
  );
}

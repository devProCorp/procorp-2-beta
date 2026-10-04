import { ImageResponse } from "next/og";
import { PRO_CORP_OG_SIZE, ProCorpOgCard } from "@/lib/og/ProCorpOgCard";
import {
  OG_DOMAIN,
  SITE_CARD,
  getServiceCard,
  loadCardPhoto,
} from "@/lib/og/service-cards";

export async function renderArticleCard({
  title,
  subtitle,
  category,
  photo,
}: {
  title: string;
  subtitle: string;
  category?: string;
  photo?: string | null;
}) {
  const imageUrl = await loadCardPhoto(photo);

  return new ImageResponse(
    <ProCorpOgCard
      eyebrow={category ? `Journal · ${category}` : "Journal"}
      title={title}
      subtitle={subtitle}
      domain={OG_DOMAIN}
      imageUrl={imageUrl}
    />,
    PRO_CORP_OG_SIZE,
  );
}

export function renderSiteCard() {
  return new ImageResponse(
    <ProCorpOgCard
      title={SITE_CARD.title}
      subtitle={SITE_CARD.subtitle}
      domain={OG_DOMAIN}
    />,
    PRO_CORP_OG_SIZE,
  );
}

export async function renderServiceCard(slug: string) {
  const card = getServiceCard(slug);
  const imageUrl = await loadCardPhoto(card?.photo);

  return new ImageResponse(
    <ProCorpOgCard
      eyebrow="Projects & solutions"
      title={card?.title ?? SITE_CARD.title}
      subtitle={card?.subtitle ?? SITE_CARD.subtitle}
      domain={OG_DOMAIN}
      imageUrl={imageUrl}
    />,
    PRO_CORP_OG_SIZE,
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleView from "@/components/journal/ArticleView";
import {
  fetchPublishedPostsForBuild,
  findPublishedPostForBuild,
} from "@/lib/journal-live";
import {
  articleOgImagePath,
  getArticleDescription,
  getArticleTitle,
} from "@/lib/og/journal-cards";
import { OG_IMAGE_SIZE } from "@/lib/og/paths";
import { getCardRevision } from "@/lib/og/render";

// Prerendered article pages so WhatsApp, LinkedIn and X — which do not run
// JavaScript — get real title, description and card for each article. Built
// for both /journal/<wp_id>/ (links in the listing) and /journal/<slug>/ (the
// 301 targets of the old WordPress URLs). Posts published after the last
// deploy still reach the live shell: Apache only rewrites to
// /journal/live-fallback/ when no prebuilt directory exists.
export const dynamicParams = false;

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await fetchPublishedPostsForBuild();
    const identifiers = new Set(
      posts.flatMap((post) => [String(post.id), post.slug.trim()]).filter(Boolean),
    );
    return [...identifiers].map((id) => ({ id }));
  } catch {
    // Supabase down: skip prebuilt articles, the live fallback keeps serving them.
    return [{ id: "__sin-articulos" }];
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await findPublishedPostForBuild(id).catch(() => null);
  if (!post) return { title: "Artículo no encontrado", robots: { index: false, follow: false } };

  const title = getArticleTitle(post);
  const description = getArticleDescription(post);
  const canonical = `/journal/${post.slug}/`;
  // ?r= revisión publicada en el Taller de tarjetas: Apache la ignora, pero
  // WhatsApp ve una URL nueva y no reutiliza la tarjeta anterior de su caché.
  const revision = await getCardRevision("article", "article", String(post.id));
  const image = `${articleOgImagePath(post)}?r=${revision}`;

  return {
    title: { absolute: `${title} | PRO CORP` },
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      locale: "es_ES",
      siteName: "PRO CORP",
      url: canonical,
      title,
      description,
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: [{ url: image, ...OG_IMAGE_SIZE, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const post = await findPublishedPostForBuild(id).catch(() => null);
  if (!post) notFound();
  return <ArticleView post={post} />;
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleView from "@/components/journal/ArticleView";
import {
  getPostBySlug,
  getAllPostSlugs,
  getFeaturedImageUrl,
  stripHtml,
} from "@/lib/wordpress";

// Fully static: every snapshotted post is prerendered; unknown slugs 404.
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Article Not Found" };

  const title = post.seo_title ?? stripHtml(post.title.rendered);
  const description =
    post.seo_description ?? stripHtml(post.excerpt.rendered).slice(0, 160);
  const image = post.seo_og_image_url ?? getFeaturedImageUrl(post, "large");

  return {
    title,
    description,
    ...(post.seo_canonical && { alternates: { canonical: post.seo_canonical } }),
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      ...(image && {
        images: [{ url: image, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return <ArticleView post={post} />;
}

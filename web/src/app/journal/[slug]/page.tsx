import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getPostBySlug,
  getFeaturedImageUrl,
  getFeaturedImageAlt,
  getPostCategories,
  getPostAuthor,
  stripHtml,
  formatDate,
} from "@/lib/wordpress";

export const revalidate = 600;

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Article Not Found" };

  const title = stripHtml(post.title.rendered);
  const description = stripHtml(post.excerpt.rendered).slice(0, 160);
  const image = getFeaturedImageUrl(post, "large");

  return {
    title,
    description,
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

  const imageUrl = getFeaturedImageUrl(post, "large");
  const imageAlt = getFeaturedImageAlt(post);
  const categories = getPostCategories(post);
  const author = getPostAuthor(post);

  return (
    <main className="min-h-screen bg-background-dark pt-32 pb-20 px-6">
      <article className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-primary transition-colors font-ui mb-12"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Journal
        </Link>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-6">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="text-xs font-bold uppercase tracking-widest text-primary font-ui"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter uppercase font-display text-white leading-[0.95] mb-6"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Author + Date */}
        <div className="flex items-center gap-4 mb-12">
          {author && (
            <div className="flex items-center gap-3">
              {author.avatar_urls["96"] && (
                <Image
                  src={author.avatar_urls["96"]}
                  alt={author.name}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-white/10"
                />
              )}
              <div>
                <span className="block text-sm font-semibold text-white font-ui">
                  {author.name}
                </span>
                {author.description && (
                  <span className="block text-xs text-white/40 font-ui">
                    {author.description}
                  </span>
                )}
              </div>
            </div>
          )}
          {author && (
            <span className="w-px h-8 bg-white/15 hidden sm:block" />
          )}
          <time className="text-sm text-white/40 font-ui uppercase tracking-widest">
            {formatDate(post.date, "en-US")}
          </time>
        </div>

        {/* Featured image */}
        {imageUrl && (
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm bg-white/10 mb-14">
            <Image
              src={imageUrl}
              alt={imageAlt || stripHtml(post.title.rendered)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="wp-content max-w-none font-ui"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* Bottom nav */}
        <div className="border-t border-white/10 mt-20 pt-10">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white/50 hover:text-primary transition-colors font-ui"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            Back to Journal
          </Link>
        </div>
      </article>
    </main>
  );
}

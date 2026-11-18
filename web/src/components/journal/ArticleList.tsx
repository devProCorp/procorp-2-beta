import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Headphones } from "lucide-react";
import type { WPPost } from "@/lib/wordpress-presentation";
import {
  getFeaturedImageUrl,
  getFeaturedImageAlt,
  getPostCategories,
  stripHtml,
} from "@/lib/wordpress-presentation";
import { T, CategoryName, PostDate, ReadTime, AudioBadgeTitle } from "./Txt";

interface ArticleListProps {
  posts: WPPost[];
  /** h2 en el listado (bajo el h1 «Blog»); h3 en «Sigue leyendo», que ya tiene su h2. */
  headingLevel?: "h2" | "h3";
}

export default function ArticleList({ posts, headingLevel = "h2" }: ArticleListProps) {
  const Heading = headingLevel;
  if (posts.length === 0) {
    return (
      <p className="text-gray-300 text-lg py-20 text-center">
        <T k="journal.empty" />
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
      {posts.map((post) => {
        const imageUrl = getFeaturedImageUrl(post, "medium_large");
        const imageAlt = getFeaturedImageAlt(post);
        const categories = getPostCategories(post);
        const excerpt = stripHtml(post.excerpt.rendered);

        return (
          <Link
            key={post.id}
            href={`/blog/${post.slug.trim() || post.id}/`}
            className="group flex min-w-0 flex-col rounded-2xl border border-surface-border bg-surface-dark transition-colors hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-light"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-background-dark">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={imageAlt || stripHtml(post.title.rendered)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              {post.audio_url && (
                <span className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-background-dark/90 text-white">
                  <AudioBadgeTitle>
                    <Headphones size={16} aria-hidden="true" />
                  </AudioBadgeTitle>
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-5 md:p-6">
              {categories.length > 0 && (
                <span className="text-[13px] font-semibold text-gray-200">
                  <CategoryName slug={categories[0].slug} name={categories[0].name} />
                </span>
              )}
              <div className="-mt-2 flex flex-wrap items-center gap-x-2 text-[13px] text-gray-400">
                <PostDate date={post.date} />
                {post.reading_minutes && (
                  <>
                    <span aria-hidden="true">·</span>
                    <ReadTime minutes={post.reading_minutes} />
                  </>
                )}
              </div>
              <Heading
                className="text-xl md:text-[1.375rem] font-bold text-white leading-snug tracking-tight text-balance group-hover:underline decoration-primary-light decoration-2 underline-offset-4"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              {excerpt && (
                <p className="text-gray-300 text-[15px] leading-relaxed line-clamp-3 text-pretty">
                  {excerpt}
                </p>
              )}
              <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-white">
                <T k="journal.readMore" />
                <ArrowRight
                  size={16}
                  aria-hidden="true"
                  className="text-primary-light transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

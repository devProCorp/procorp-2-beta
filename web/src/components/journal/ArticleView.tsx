import Image from "next/image";
import Link from "next/link";
import RelatedArticles from "./RelatedArticles";
import InvestCta from "./InvestCta";
import ArticleTracker from "./ArticleTracker";
import { ArrowLeft } from "lucide-react";
import { T, CategoryName, PostDate, ReadTime } from "./Txt";
import {
  getFeaturedImageUrl,
  getFeaturedImageAlt,
  getPostCategories,
  getPostAuthor,
  stripHtml,
  readingMinutes,
  type WPPost,
} from "@/lib/wordpress-presentation";
import { articleJsonLd } from "@/lib/og/journal-cards";
import { getAuthorDetails } from "@/lib/journal-authors";

/**
 * Article body, shared by the prebuilt /journal/[slug] page and the live
 * fallback at /journal/_live (posts published after the last deploy — see
 * docs/decisions/0004-journal-live-fetch.md). Pure presentation: both
 * callers are responsible for fetching `post` and handling the not-found case.
 * `related` is the pool of candidates for the recommendations at the end
 * (see pickRecommendationPool); the browser picks three of them.
 */
export default function ArticleView({
  post,
  related = [],
}: {
  post: WPPost;
  related?: WPPost[];
}) {
  const imageUrl = getFeaturedImageUrl(post, "large");
  const imageAlt = getFeaturedImageAlt(post);
  const categories = getPostCategories(post);
  const author = getPostAuthor(post);
  const authorDetails = author ? getAuthorDetails(author.name) : null;
  const minutes = post.reading_minutes ?? readingMinutes(post.content.rendered);

  return (
    <main className="min-h-screen bg-background-dark pt-32 pb-20 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Yoast schema when migrated; otherwise a BlogPosting built here.
          // `<` escaped so article text can never close the script tag.
          __html: JSON.stringify(post.seo_schema ?? articleJsonLd(post)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <article className="max-w-[42rem] mx-auto">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors font-ui mb-8"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <T k="journal.back" />
        </Link>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="rounded-full border border-surface-border px-3 py-1 text-[13px] font-medium text-gray-200 font-ui"
              >
                <CategoryName slug={cat.slug} name={cat.name} />
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          className="text-[2rem] md:text-5xl font-bold tracking-tight font-ui text-white leading-[1.12] text-balance mb-8"
          dangerouslySetInnerHTML={{ __html: post.title.rendered }}
        />

        {/* Author + Date */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mb-10">
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
                {authorDetails ? (
                  <span className="block text-[13px] text-gray-300 font-ui">
                    <T k={authorDetails.role} /> · <T k={authorDetails.office} />
                  </span>
                ) : (
                  author.description && (
                    <span className="block text-[13px] text-gray-300 font-ui">
                      {author.description}
                    </span>
                  )
                )}
              </div>
            </div>
          )}
          {author && (
            <span className="w-px h-8 bg-white/15 hidden sm:block" />
          )}
          <span className="text-sm text-gray-300 font-ui">
            <time dateTime={post.date}>
              <PostDate date={post.date} />
            </time>
            <span aria-hidden="true"> · </span>
            <ReadTime minutes={minutes} />
          </span>
        </div>

        {/* Featured image */}
        {imageUrl && (
          <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-white/10 mb-14">
            <Image
              src={imageUrl}
              alt={imageAlt || stripHtml(post.title.rendered)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        )}

        {/* Content */}
        <div
          className="wp-content max-w-none font-ui"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
        <div id="fin-del-articulo" aria-hidden="true" />
        <ArticleTracker id={post.id} categories={post.categories} />

        <InvestCta slug={post.slug} postId={post.id} />
      </article>

      <RelatedArticles post={post} pool={related} />

      {/* Bottom nav */}
      <div className="max-w-[42rem] mx-auto">
        <div className="border-t border-white/10 mt-20 pt-10">
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-gray-300 hover:text-white transition-colors font-ui"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <T k="journal.back" />
          </Link>
        </div>
      </div>
    </main>
  );
}

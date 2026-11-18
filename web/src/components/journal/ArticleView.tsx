import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import RelatedArticles from "./RelatedArticles";
import InvestCta from "./InvestCta";
import ArticleTracker from "./ArticleTracker";
import BlogcastPlayer from "./BlogcastPlayer";
import ShareRow from "./ShareRow";
import { T, CategoryName, PostDate, ReadTime } from "./Txt";
import {
  getFeaturedImageUrl,
  getFeaturedImageAlt,
  getPostCategories,
  getPostAuthor,
  stripHtml,
  readingMinutes,
  withHeadingIds,
  type WPPost,
} from "@/lib/wordpress-presentation";
import { articleJsonLd } from "@/lib/og/journal-cards";
import { getAuthorDetails } from "@/lib/journal-authors";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.pro-corp.net";

/** Texto plano para comparar la entradilla con el comienzo del artículo. */
const plain = (html: string) =>
  stripHtml(html.replace(/<(style|script)[^>]*>[\s\S]*?<\/\1>/gi, " "))
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

/**
 * Article body, shared by the prebuilt /blog/[slug] page and the live
 * fallback (posts published after the last deploy — see
 * docs/decisions/0004-journal-live-fetch.md). Pure presentation: both
 * callers are responsible for fetching `post` and handling the not-found case.
 * `related` is the pool of candidates for the recommendations at the end
 * (see pickRecommendationPool); the browser picks three of them.
 *
 * Layout: propuesta B (2026-11-18) — column of 40rem for reading (~75 characters), wider
 * cover image, own blogcast player, «En este artículo» index built from the
 * article's <h2>, share row and the investment invitation.
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
  const { html, toc } = withHeadingIds(post.content.rendered);
  const titleText = plain(post.title.rendered);
  const url = `${SITE_URL}/blog/${post.slug}/`;

  // Entradilla solo si aporta: no se repite cuando es el primer párrafo.
  const excerpt = plain(post.excerpt.rendered);
  const body = plain(post.content.rendered);
  const dek = excerpt && !body.includes(excerpt.slice(0, 60)) ? excerpt : "";

  return (
    <main className="min-h-screen bg-background-dark pt-6 text-blog-text md:pt-10">
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
      <article className={`px-4 pb-16 md:px-8 ${post.audio_url ? "con-reproductor" : ""}`}>
        <header className="mx-auto max-w-[40rem]">
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center gap-2 text-sm text-blog-soft transition-colors hover:text-blog-text"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <T k="journal.back" />
          </Link>

          {categories.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-full border border-blog-border-strong px-3 py-1 text-[13px] font-medium text-blog-text"
                >
                  <CategoryName slug={cat.slug} name={cat.name} />
                </span>
              ))}
            </div>
          )}

          <h1
            className="mt-5 mb-0 font-blog-title text-[2rem] font-bold leading-[1.12] tracking-[-0.02em] text-blog-text text-balance md:text-5xl"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          {dek && (
            <p className="mt-[18px] mb-0 text-lg leading-relaxed text-blog-soft text-pretty md:text-xl">{dek}</p>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
            {author && (
              <div className="flex items-center gap-3">
                {author.avatar_urls["96"] ? (
                  <Image
                    src={author.avatar_urls["96"]}
                    alt=""
                    width={44}
                    height={44}
                    className="rounded-full border border-blog-border-strong"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-blog-border-strong bg-blog-panel text-[15px] font-semibold"
                  >
                    {initials(author.name)}
                  </span>
                )}
                <div className="text-sm leading-snug">
                  <p className="m-0 font-semibold">{author.name}</p>
                  {authorDetails ? (
                    <p className="m-0 text-blog-meta">
                      <T k={authorDetails.role} /> · <T k={authorDetails.office} />
                    </p>
                  ) : (
                    author.description && <p className="m-0 text-blog-meta">{author.description}</p>
                  )}
                </div>
              </div>
            )}
            {author && <span aria-hidden="true" className="hidden h-8 w-px bg-blog-border sm:block" />}
            <p className="m-0 text-sm text-blog-soft">
              <time dateTime={post.date}>
                <PostDate date={post.date} />
              </time>
              <span aria-hidden="true"> · </span>
              <ReadTime minutes={minutes} />
            </p>
          </div>
        </header>

        {imageUrl && (
          <div className="relative mx-auto mt-10 aspect-[16/9] w-full max-w-[67.5rem] overflow-hidden rounded-xl bg-blog-panel md:aspect-[2/1]">
            <Image
              src={imageUrl}
              alt={imageAlt || titleText}
              fill
              className="object-cover"
              sizes="(max-width: 1080px) 100vw, 1080px"
              priority
            />
          </div>
        )}

        <div className="mx-auto mt-10 max-w-[40rem]">
          {post.audio_url && <BlogcastPlayer src={post.audio_url} />}

          {toc.length >= 3 && (
            <nav aria-labelledby="indice-titulo" className="mt-5 rounded-xl border border-blog-border p-5">
              <h2 id="indice-titulo" className="m-0 mb-2.5 font-blog text-[15px] font-semibold text-blog-text">
                <T k="journal.toc" />
              </h2>
              <ol className="m-0 grid list-decimal gap-x-6 pl-5 text-sm leading-snug text-blog-soft marker:text-blog-meta md:grid-cols-2">
                {toc.map((h) => (
                  <li key={h.id} className="py-1 text-balance">
                    <a href={`#${h.id}`} className="text-blog-text/85 hover:text-blog-text hover:underline underline-offset-4">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="wp-content mt-10 max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
          <div id="fin-del-articulo" aria-hidden="true" />
          <ArticleTracker id={post.id} categories={post.categories} />

          <ShareRow url={url} title={titleText} />

          <InvestCta slug={post.slug} postId={post.id} />
        </div>
      </article>

      <RelatedArticles post={post} pool={related} />
    </main>
  );
}

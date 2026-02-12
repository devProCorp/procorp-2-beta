import Link from "next/link";
import Image from "next/image";
import type { WPPost } from "@/lib/wordpress";
import {
  getFeaturedImageUrl,
  getFeaturedImageAlt,
  getPostCategories,
  getPostAuthor,
  stripHtml,
  formatDate,
} from "@/lib/wordpress";

interface ArticleListProps {
  posts: WPPost[];
}

export default function ArticleList({ posts }: ArticleListProps) {
  if (posts.length === 0) {
    return (
      <p className="text-white/50 font-ui text-lg py-20 text-center">
        No articles found.
      </p>
    );
  }

  return (
    <div className="space-y-0">
      {posts.map((post) => {
        const imageUrl = getFeaturedImageUrl(post, "medium_large");
        const imageAlt = getFeaturedImageAlt(post);
        const categories = getPostCategories(post);
        const author = getPostAuthor(post);
        const excerpt = stripHtml(post.excerpt.rendered);

        return (
          <Link
            key={post.id}
            href={`/journal/${post.slug}`}
            className="group border-t border-white/10 py-10 md:py-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 cursor-pointer hover:bg-white/5 transition-colors px-4 -mx-4 rounded-sm"
          >
            {imageUrl && (
              <div className="relative w-full md:w-48 lg:w-56 aspect-[16/10] md:aspect-[4/3] flex-shrink-0 overflow-hidden rounded-sm bg-white/10">
                <Image
                  src={imageUrl}
                  alt={imageAlt || stripHtml(post.title.rendered)}
                  fill
                  className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  sizes="(max-width: 768px) 100vw, 224px"
                />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                {categories.map((cat) => (
                  <span
                    key={cat.id}
                    className="text-xs font-bold uppercase tracking-widest text-primary font-ui"
                  >
                    {cat.name}
                  </span>
                ))}
              </div>

              <h2
                className="text-2xl md:text-3xl lg:text-4xl font-display font-bold uppercase text-white group-hover:text-primary transition-colors leading-tight"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />

              {excerpt && (
                <p className="mt-3 text-sm text-white/50 font-ui line-clamp-2 max-w-2xl">
                  {excerpt}
                </p>
              )}

              {author && (
                <div className="flex items-center gap-2 mt-4">
                  {author.avatar_urls["48"] && (
                    <Image
                      src={author.avatar_urls["48"]}
                      alt={author.name}
                      width={24}
                      height={24}
                      className="rounded-full ring-1 ring-white/10"
                    />
                  )}
                  <span className="text-xs text-white/50 font-ui">
                    {author.name}
                  </span>
                </div>
              )}
            </div>

            <div className="text-white/40 font-ui text-sm uppercase tracking-widest whitespace-nowrap flex-shrink-0">
              {formatDate(post.date, "en-US")}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

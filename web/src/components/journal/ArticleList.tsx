import Link from "next/link";
import Image from "next/image";
import type { WPPost } from "@/lib/wordpress";
import {
  getFeaturedImageUrl,
  getFeaturedImageAlt,
  getPostCategories,
  stripHtml,
  formatDate,
} from "@/lib/wordpress";

interface ArticleListProps {
  posts: WPPost[];
}

export default function ArticleList({ posts }: ArticleListProps) {
  if (posts.length === 0) {
    return (
      <p className="text-secondary text-lg py-20 text-center">
        No se encontraron artículos.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
      {posts.map((post) => {
        const imageUrl = getFeaturedImageUrl(post, "medium_large");
        const imageAlt = getFeaturedImageAlt(post);
        const categories = getPostCategories(post);
        const excerpt = stripHtml(post.excerpt.rendered);

        return (
          <Link
            key={post.id}
            href={`/journal/${post.slug}`}
            className="flex flex-col group cursor-pointer"
          >
            <div className="relative overflow-hidden rounded-xl aspect-[4/3] mb-5 border border-surface-border group-hover:border-primary/50 transition-colors">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors z-10"></div>
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt || stripHtml(post.title.rendered)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-surface-dark"></div>
              )}
              {categories.length > 0 && (
                <span className="absolute top-4 left-4 z-20 bg-primary/90 backdrop-blur-md px-3 py-1 rounded text-xs font-bold text-white shadow-lg uppercase tracking-wide">
                  {categories[0].name}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-secondary text-xs font-medium uppercase tracking-wide">
                <span>{formatDate(post.date, "es-ES")}</span>
                <span className="w-1 h-1 rounded-full bg-primary"></span>
                <span>5 min lectura</span>
              </div>
              <h3
                className="text-xl font-bold text-white group-hover:text-primary transition-colors leading-snug"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              {excerpt && (
                <p className="text-secondary text-sm line-clamp-2 font-light">
                  {excerpt}
                </p>
              )}
              <span className="inline-flex items-center text-primary font-bold text-sm mt-1 hover:text-white transition-colors uppercase tracking-wide">
                Leer más <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

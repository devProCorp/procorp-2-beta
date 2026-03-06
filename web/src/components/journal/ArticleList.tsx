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
            className="flex flex-col group cursor-pointer glass-panel glass-panel-hover rounded-[2rem] p-4 border border-surface-border/50"
          >
            <div className="relative overflow-hidden rounded-[1.5rem] aspect-[4/3] mb-6 border border-surface-border/50 group-hover:border-primary/30 transition-colors shadow-inner">
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
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
                <span className="absolute top-4 left-4 z-20 bg-background-dark/80 border border-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white shadow-lg uppercase tracking-[0.15em] hover:bg-primary transition-colors">
                  {categories[0].name}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-4 px-2 pb-2">
              <div className="flex items-center gap-3 text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">
                <span>{formatDate(post.date, "es-ES")}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary-light shadow-[0_0_8px_rgba(206,16,38,0.8)] animate-pulse"></span>
                <span>5 min lectura</span>
              </div>
              <h3
                className="text-2xl font-extrabold text-white group-hover:text-primary-light transition-colors leading-[1.2] tracking-tight drop-shadow-sm"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              {excerpt && (
                <p className="text-gray-400 text-[14px] leading-relaxed line-clamp-2 font-light">
                  {excerpt}
                </p>
              )}
              <span className="inline-flex items-center text-primary font-bold text-[11px] uppercase tracking-widest mt-2 hover:text-white transition-colors group/link w-fit">
                Leer más <span className="material-symbols-outlined text-[16px] ml-1 group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

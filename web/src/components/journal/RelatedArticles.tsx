import Link from "next/link";
import ArticleList from "./ArticleList";
import type { WPPost } from "@/lib/wordpress-presentation";

/** "Sigue leyendo" block at the end of an article: keeps the reader in the Journal. */
export default function RelatedArticles({ posts }: { posts: WPPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="sigue-leyendo"
      className="w-full max-w-[1440px] mx-auto border-t border-white/10 mt-20 pt-16 md:px-4 lg:px-14"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <span className="block text-xs font-bold uppercase tracking-widest text-primary font-ui mb-3">
            Journal
          </span>
          <h2
            id="sigue-leyendo"
            className="text-3xl md:text-5xl font-bold tracking-tighter uppercase font-display text-white leading-[0.95]"
          >
            Sigue leyendo
          </h2>
        </div>
        <Link
          href="/blog/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-primary transition-colors font-ui"
        >
          Ver todos los artículos
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
      <ArticleList posts={posts} />
    </section>
  );
}

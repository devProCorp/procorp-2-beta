"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ArticleList from "./ArticleList";
import { T } from "./Txt";
import type { WPPost } from "@/lib/wordpress-presentation";
import { fetchPopularity, rankRecommendations, readHistory } from "@/lib/journal-engagement";

/**
 * Recommendations at the end of an article. The page ships a pool of
 * candidates (pickRecommendationPool); the first three render straight away
 * (also without JavaScript). In the browser they are re-ranked by popularity
 * among readers and by this reader's own history, which never leaves the
 * device. With some history the heading becomes «Recomendado para ti».
 */
export default function RelatedArticles({ post, pool }: { post: WPPost; pool: WPPost[] }) {
  const [posts, setPosts] = useState(() => pool.slice(0, 3));
  const [personal, setPersonal] = useState(false);

  useEffect(() => {
    if (pool.length === 0) return;
    let cancelled = false;
    // The current article is already in the history (ArticleTracker), so
    // «personal» means at least one *other* article read before.
    const history = readHistory().filter((h) => h.id !== post.id);
    const apply = (popularity: Map<number, number>) => {
      if (cancelled) return;
      setPosts(rankRecommendations(pool, post.categories, popularity, history));
      setPersonal(history.length > 0);
    };
    fetchPopularity()
      .then(apply)
      .catch(() => apply(new Map()));
    return () => {
      cancelled = true;
    };
  }, [post.id, post.categories, pool]);

  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="sigue-leyendo"
      className="w-full max-w-[1440px] mx-auto border-t border-white/10 mt-20 pt-16 md:px-4 lg:px-14"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <span className="block text-xs font-bold uppercase tracking-widest text-primary font-ui mb-3">
            <T k="journal.eyebrow" />
          </span>
          <h2
            id="sigue-leyendo"
            className="text-3xl md:text-5xl font-bold tracking-tighter uppercase font-display text-white leading-[0.95]"
          >
            <T k={personal ? "journal.forYou" : "journal.keepReading"} />
          </h2>
        </div>
        <Link
          href="/blog/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-primary transition-colors font-ui"
        >
          <T k="journal.viewAll" />
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </Link>
      </div>
      <ArticleList posts={posts} />
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
      className="mx-auto w-full max-w-[1280px] px-4 pb-18 md:px-8"
    >
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-t border-blog-border pt-10">
        <h2 id="sigue-leyendo" className="m-0 font-blog-title text-[1.625rem] font-bold text-blog-text">
          <T k={personal ? "journal.forYou" : "journal.keepReading"} />
        </h2>
        <Link
          href="/blog/"
          className="inline-flex min-h-11 items-center gap-2 text-[15px] text-blog-text/85 transition-colors hover:text-blog-text hover:underline underline-offset-4"
        >
          <T k="journal.viewAll" />
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <ArticleList posts={posts} />
    </section>
  );
}

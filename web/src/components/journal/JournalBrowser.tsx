"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CategoryFilter from "./CategoryFilter";
import ArticleList from "./ArticleList";
import Pagination from "./Pagination";
import type { WPPost, WPCategory } from "@/lib/wordpress-presentation";
import {
  fetchLiveCategories,
  fetchLivePosts,
  fetchLivePostsPage,
} from "@/lib/journal-live";

const PER_PAGE = 9;

/**
 * The Journal has no build-time snapshot to fall back on — everything comes
 * from the live `get-blog-posts` Edge Function, so there's a single source
 * of truth and nothing to reconcile after the fact (no snapshot-then-swap
 * jump). See docs/decisions/0004-journal-live-fetch.md.
 *
 * - Unfiltered view (no ?cat=): server-paginated — only the page being
 *   rendered (PER_PAGE posts) is fetched.
 * - Filtered view (?cat=...): the function has no server-side category
 *   filter, so this fetches the full list once and filters/paginates in
 *   the browser.
 */
export default function JournalBrowser() {
  const searchParams = useSearchParams();
  const catSlug = searchParams.get("cat") ?? "";
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [categories, setCategories] = useState<WPCategory[] | null>(null);
  const [allPosts, setAllPosts] = useState<WPPost[] | null>(null);
  const [pagedResult, setPagedResult] = useState<{
    posts: WPPost[];
    totalPages: number;
  } | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchLiveCategories()
      .then((live) => {
        if (!cancelled) setCategories(live);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (catSlug) return; // filtered view fetches the full list below instead
    let cancelled = false;
    fetchLivePostsPage(currentPage, PER_PAGE)
      .then((live) => {
        if (!cancelled) setPagedResult({ posts: live.posts, totalPages: live.totalPages });
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [catSlug, currentPage]);

  useEffect(() => {
    if (!catSlug) return; // unfiltered view uses server pagination above instead
    let cancelled = false;
    fetchLivePosts()
      .then((live) => {
        if (!cancelled) setAllPosts(live);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [catSlug]);

  const result = useMemo(() => {
    if (!catSlug) {
      if (!pagedResult) return null;
      return pagedResult;
    }

    if (!allPosts || !categories) return null;

    const activeCategory = categories.find((c) => c.slug === catSlug);
    const filtered = activeCategory
      ? allPosts.filter((p) => p.categories.includes(activeCategory.id))
      : allPosts;

    const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    // Guard against a stale ?page= beyond the end of a narrower filter.
    const page = Math.min(currentPage, pages);

    return {
      posts: filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
      totalPages: pages,
    };
  }, [catSlug, categories, allPosts, pagedResult, currentPage]);

  if (error) {
    return (
      <p className="text-secondary text-lg py-20 text-center">
        No se pudo cargar el Journal. Intenta de nuevo en un momento.
      </p>
    );
  }

  if (!categories || !result) {
    return (
      <>
        <div className="sticky top-20 z-40 h-[68px] mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {Array.from({ length: PER_PAGE }).map((_, i) => (
            <div
              key={i}
              className="rounded-[2rem] p-4 border border-surface-border/50 animate-pulse"
            >
              <div className="rounded-[1.5rem] aspect-[4/3] mb-6 bg-surface-dark" />
              <div className="h-4 w-1/3 bg-surface-dark rounded mb-4" />
              <div className="h-6 w-full bg-surface-dark rounded mb-2" />
              <div className="h-4 w-2/3 bg-surface-dark rounded" />
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <CategoryFilter categories={categories} />
      <ArticleList posts={result.posts} />
      <Pagination
        currentPage={Math.min(currentPage, result.totalPages)}
        totalPages={result.totalPages}
      />
    </>
  );
}

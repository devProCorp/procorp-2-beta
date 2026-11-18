"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import CategoryFilter from "./CategoryFilter";
import ArticleList, { BlogFront } from "./ArticleList";
import { catName } from "@/lib/blog-categories";
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
  const { t, lang } = useLanguage();
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
      <p role="alert" className="text-gray-300 text-lg py-20 text-center">
        {t("journal.loadError")}
      </p>
    );
  }

  if (!categories || !result) {
    return (
      <div aria-busy="true">
        <div className="mb-10 h-[77px]" />
        <div aria-hidden="true" className="flex flex-col gap-14 motion-safe:animate-pulse">
          <div className="grid overflow-hidden rounded-xl border border-blog-border bg-blog-surface md:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div className="aspect-[16/10] bg-blog-panel md:aspect-auto md:min-h-[380px]" />
            <div className="flex flex-col gap-4 p-6 md:p-10">
              <div className="h-4 w-1/3 rounded bg-blog-panel" />
              <div className="h-8 w-full rounded bg-blog-panel" />
              <div className="h-8 w-2/3 rounded bg-blog-panel" />
              <div className="h-4 w-full rounded bg-blog-panel" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="overflow-hidden rounded-xl border border-blog-border bg-blog-surface">
                <div className="aspect-[16/10] bg-blog-panel" />
                <div className="flex flex-col gap-3 p-[22px]">
                  <div className="h-4 w-1/3 rounded bg-blog-panel" />
                  <div className="h-6 w-full rounded bg-blog-panel" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const page = Math.min(currentPage, result.totalPages);
  const front = !catSlug && page === 1;
  const activeCategory = categories.find((c) => c.slug === catSlug);
  const sectionTitle = activeCategory
    ? catName(activeCategory.slug, activeCategory.name, lang)
    : t("journal.pageOf").replace("{n}", String(page)).replace("{total}", String(result.totalPages));

  return (
    <>
      <CategoryFilter categories={categories} />
      {front ? (
        <BlogFront posts={result.posts} />
      ) : (
        <section aria-labelledby="blog-seccion">
          <h2 id="blog-seccion" className="m-0 mb-5 font-blog-title text-[22px] font-bold text-blog-text">
            {sectionTitle}
          </h2>
          <ArticleList posts={result.posts} />
        </section>
      )}
      <Pagination currentPage={page} totalPages={result.totalPages} />
    </>
  );
}

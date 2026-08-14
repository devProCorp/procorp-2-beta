"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import CategoryFilter from "./CategoryFilter";
import ArticleList from "./ArticleList";
import Pagination from "./Pagination";
import type { WPPost, WPCategory } from "@/lib/wordpress-presentation";

const PER_PAGE = 9;

interface JournalBrowserProps {
  /** Every snapshotted post, without content.rendered — the full index. */
  posts: WPPost[];
  categories: WPCategory[];
}

/**
 * Client-side twin of what /journal used to do on the server.
 *
 * The static export has no request at render time, so `?cat=` and `?page=`
 * cannot be read from searchParams during prerender. The page now ships the
 * whole (content-free) index once and this component slices it in the browser,
 * which keeps the existing URLs and UI behaviour identical.
 */
export default function JournalBrowser({
  posts,
  categories,
}: JournalBrowserProps) {
  const searchParams = useSearchParams();
  const catSlug = searchParams.get("cat") ?? "";
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const { pagePosts, totalPages } = useMemo(() => {
    const activeCategory = catSlug
      ? categories.find((c) => c.slug === catSlug)
      : undefined;

    const filtered = activeCategory
      ? posts.filter((p) => p.categories.includes(activeCategory.id))
      : posts;

    const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    // Guard against a stale ?page= beyond the end of a narrower filter.
    const page = Math.min(currentPage, pages);

    return {
      pagePosts: filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
      totalPages: pages,
    };
  }, [posts, categories, catSlug, currentPage]);

  return (
    <>
      <CategoryFilter categories={categories} />
      <ArticleList posts={pagePosts} />
      <Pagination
        currentPage={Math.min(currentPage, totalPages)}
        totalPages={totalPages}
      />
    </>
  );
}

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

interface JournalBrowserProps {
  /** Every snapshotted post, without content.rendered — the full index. */
  posts: WPPost[];
  categories: WPCategory[];
}

/**
 * Client-side twin of what /journal used to do on the server.
 *
 * The static export has no request at render time, so `?cat=` and `?page=`
 * cannot be read from searchParams during prerender. The page ships the
 * whole (content-free) index from the last deploy's snapshot once, and this
 * component slices it in the browser, keeping the existing URLs and UI
 * behaviour identical.
 *
 * A post that changed status (draft -> publish, or the reverse) since the
 * last deploy shows up without a rebuild — see
 * docs/decisions/0004-journal-live-fetch.md — via two live refreshes:
 *
 * - Unfiltered view (no ?cat=): server-paginated. Only the page being
 *   rendered (PER_PAGE posts) is fetched from get-blog-posts, so paging
 *   through the Journal never downloads every post's content_html — the
 *   optimization the `page`/`per_page` support on the function was added
 *   for. Falls back to slicing the build-time snapshot until that resolves.
 * - Filtered view (?cat=...): the function has no server-side category
 *   filter, so this still fetches the full live list once and filters/
 *   paginates in the browser, same as before.
 *
 * Either fetch failing (offline, function down) just leaves whatever's
 * already on screen — snapshot or a previously loaded live page.
 */
export default function JournalBrowser({
  posts: snapshotPosts,
  categories: snapshotCategories,
}: JournalBrowserProps) {
  const searchParams = useSearchParams();
  const catSlug = searchParams.get("cat") ?? "";
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const [categories, setCategories] = useState(snapshotCategories);
  const [allPosts, setAllPosts] = useState(snapshotPosts);
  const [pagedResult, setPagedResult] = useState<{
    posts: WPPost[];
    totalPages: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchLiveCategories()
      .then((live) => {
        if (!cancelled) setCategories(live);
      })
      .catch(() => {});
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
      .catch(() => {});
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
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [catSlug]);

  const { posts: pagePosts, totalPages } = useMemo(() => {
    if (!catSlug) {
      if (pagedResult) return pagedResult;
      // Live page hasn't resolved yet — slice the snapshot the same way so
      // first paint isn't empty.
      const pages = Math.max(1, Math.ceil(allPosts.length / PER_PAGE));
      const page = Math.min(currentPage, pages);
      return {
        posts: allPosts.slice((page - 1) * PER_PAGE, page * PER_PAGE),
        totalPages: pages,
      };
    }

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

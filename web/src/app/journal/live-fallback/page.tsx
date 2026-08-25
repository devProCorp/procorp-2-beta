"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ArticleView from "@/components/journal/ArticleView";
import { fetchLivePostBySlug } from "@/lib/journal-live";
import type { WPPost } from "@/lib/wordpress-presentation";

/**
 * Fallback shell for Journal slugs the static build doesn't know about yet
 * (e.g. a post published after the last deploy). public/.htaccess rewrites
 * any /journal/<slug>/ request that isn't a real prebuilt page to
 * /journal/live-fallback/ — the browser URL stays /journal/<slug>/, so the
 * slug is read from window.location, then fetched live from the
 * get-blog-posts Edge Function. See docs/decisions/0004-journal-live-fetch.md.
 */
export default function LiveArticlePage() {
  const [state, setState] = useState<
    { status: "loading" } | { status: "found"; post: WPPost } | { status: "not-found" }
  >({ status: "loading" });

  useEffect(() => {
    const slug = window.location.pathname.split("/").filter(Boolean).pop() ?? "";
    let cancelled = false;

    fetchLivePostBySlug(slug)
      .then((post) => {
        if (cancelled) return;
        setState(post ? { status: "found", post } : { status: "not-found" });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "not-found" });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "found") return <ArticleView post={state.post} />;

  return (
    <main className="min-h-screen bg-background-dark pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center text-white/60 font-ui">
        {state.status === "loading" ? (
          <p>Loading…</p>
        ) : (
          <>
            <p className="mb-6">Article not found.</p>
            <Link href="/journal" className="text-primary hover:underline">
              Back to Journal
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

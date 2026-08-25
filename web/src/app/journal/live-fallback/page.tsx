"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ArticleView from "@/components/journal/ArticleView";
import { fetchLivePostById } from "@/lib/journal-live";
import { stripHtml } from "@/lib/wordpress-presentation";
import type { WPPost } from "@/lib/wordpress-presentation";

function setMetaTag(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

/**
 * Every Journal article renders here — there is no build-time snapshot to
 * prebuild pages from. public/.htaccess (beta) and deploy/journal-fallback.conf
 * (production) rewrite any /journal/<id>/ request to /journal/live-fallback/ —
 * the browser URL stays /journal/<id>/, so the id is read from
 * window.location and the post is fetched live from the get-blog-posts Edge
 * Function. Articles are keyed by id (wp_id), not slug, so the URL survives
 * a title/slug edit. See docs/decisions/0004-journal-live-fetch.md.
 */
export default function LiveArticlePage() {
  const [state, setState] = useState<
    { status: "loading" } | { status: "found"; post: WPPost } | { status: "not-found" }
  >({ status: "loading" });

  useEffect(() => {
    const id = window.location.pathname.split("/").filter(Boolean).pop() ?? "";
    let cancelled = false;

    fetchLivePostById(id)
      .then((post) => {
        if (cancelled) return;
        if (post) {
          // The static shell has no per-post metadata (no generateMetadata —
          // this is a client-only route). Best-effort fix once the real
          // post is in hand: crawlers that execute JS (Googlebot does) pick
          // this up; those that don't still get the real content once the
          // post is rebuilt into a static page by the deploy pipeline.
          document.title = stripHtml(post.seo_title ?? post.title.rendered);
          const description = post.seo_description ?? stripHtml(post.excerpt.rendered).slice(0, 160);
          if (description) setMetaTag("description", description);
        } else {
          // A genuinely unknown /journal/<id>/ still returns HTTP 200 (static
          // hosting can't do otherwise here), which search engines treat as
          // a soft 404 if left indexable. Tell them not to bother.
          setMetaTag("robots", "noindex");
        }
        setState(post ? { status: "found", post } : { status: "not-found" });
      })
      .catch(() => {
        if (!cancelled) {
          setMetaTag("robots", "noindex");
          setState({ status: "not-found" });
        }
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
          <p>Cargando…</p>
        ) : (
          <>
            <p className="mb-6">Artículo no encontrado.</p>
            <Link href="/journal" className="text-primary hover:underline">
              Volver al Journal
            </Link>
          </>
        )}
      </div>
    </main>
  );
}

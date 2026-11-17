"use client";

import { useEffect } from "react";
import { rememberReading, trackArticle } from "@/lib/journal-engagement";

/**
 * Counts how the article is received (anonymous, see lib/journal-engagement):
 * opened, read to the end (with the time the tab was visible), blogcast played
 * and click towards investment. Also stores the article in this browser's
 * reading history for «Recomendado para ti». Renders nothing.
 */
export default function ArticleTracker({ id, categories }: { id: number; categories: number[] }) {
  useEffect(() => {
    trackArticle(id, "view");
    rememberReading(id, categories);

    // Visible time only: a tab left in the background doesn't count as reading.
    let visibleMs = 0;
    let since = document.visibilityState === "visible" ? Date.now() : 0;
    const onVisibility = () => {
      if (document.visibilityState === "visible") since = Date.now();
      else if (since) {
        visibleMs += Date.now() - since;
        since = 0;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const content = document.querySelector(".wp-content");
    const end = document.getElementById("fin-del-articulo");
    // «Read» = the end of the text is on screen after at least 20 s of visible
    // time (scrolling straight to the bottom isn't reading). Checked when the
    // end comes into view and every few seconds while it stays there.
    let atEnd = false;
    let counted = false;
    const check = () => {
      if (!atEnd || counted) return;
      const seconds = (visibleMs + (since ? Date.now() - since : 0)) / 1000;
      if (seconds >= 20) {
        counted = true;
        trackArticle(id, "read", seconds);
      }
    };
    const observer = end
      ? new IntersectionObserver((entries) => {
          atEnd = entries.some((e) => e.isIntersecting);
          check();
        })
      : undefined;
    if (end) observer?.observe(end);
    const timer = window.setInterval(check, 5000);

    const onPlay = (e: Event) => {
      if ((e.target as HTMLElement)?.tagName === "AUDIO") trackArticle(id, "audio");
    };
    content?.addEventListener("play", onPlay, true);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      observer?.disconnect();
      window.clearInterval(timer);
      content?.removeEventListener("play", onPlay, true);
    };
  }, [id, categories]);

  return null;
}

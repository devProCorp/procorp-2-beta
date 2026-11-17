// Reader engagement and on-device reading history for the Journal.
//
// Two separate things live here:
//  1. Anonymous counters (article-engagement Edge Function): each event is
//     sent at most once per article and browser session. Nothing that
//     identifies the reader is sent.
//  2. Reading history in localStorage, used only by this browser to
//     recommend articles («Recomendado para ti»). It never leaves the device.

const ENGAGEMENT_URL =
  "https://cpojgmwfpbuvtutnbtam.supabase.co/functions/v1/article-engagement";

export type EngagementEvent = "view" | "read" | "audio" | "invest";

// Local builds (yarn dev, previews) validate the event but never count it.
const DRY_RUN =
  typeof window !== "undefined" && !/(^|\.)pro-corp\.net$/.test(window.location.hostname);

export function trackArticle(id: number, event: EngagementEvent, seconds = 0) {
  const key = `pc_eng_${id}_${event}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    /* no sessionStorage: send anyway */
  }
  fetch(ENGAGEMENT_URL, {
    method: "POST",
    keepalive: true,
    headers: {
      "content-type": "application/json",
      ...(DRY_RUN ? { "x-engagement-dry-run": "1" } : {}),
    },
    body: JSON.stringify({ id, event, seconds: Math.round(seconds) }),
  }).catch(() => {
    /* measuring must never break reading */
  });
}

/** Popularity scores (last 30 days), cached for the session. */
export async function fetchPopularity(): Promise<Map<number, number>> {
  const KEY = "pc_eng_popularity";
  try {
    const cached = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as
      | { at: number; scores: { id: number; score: number }[] }
      | null;
    if (cached && Date.now() - cached.at < 10 * 60 * 1000) {
      return new Map(cached.scores.map((s) => [s.id, s.score]));
    }
  } catch {
    /* ignore */
  }
  const res = await fetch(`${ENGAGEMENT_URL}?days=30`);
  if (!res.ok) throw new Error(`popularity ${res.status}`);
  const scores = (await res.json()) as { id: number; score: number }[];
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ at: Date.now(), scores }));
  } catch {
    /* ignore */
  }
  return new Map(scores.map((s) => [s.id, s.score]));
}

// ── On-device reading history ───────────────────────────────────────────────

const HISTORY_KEY = "pc_lecturas";
const HISTORY_MAX = 50;

export interface ReadingEntry {
  id: number;
  categories: number[];
  at: number;
}

export function readHistory(): ReadingEntry[] {
  try {
    const h = JSON.parse(localStorage.getItem(HISTORY_KEY) ?? "[]");
    return Array.isArray(h) ? (h as ReadingEntry[]) : [];
  } catch {
    return [];
  }
}

export function rememberReading(id: number, categories: number[]) {
  try {
    const rest = readHistory().filter((e) => e.id !== id);
    const next = [{ id, categories, at: Date.now() }, ...rest].slice(0, HISTORY_MAX);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  } catch {
    /* no storage: no personal recommendations */
  }
}

/**
 * Picks `limit` recommendations from `pool` (cards prebuilt with the page):
 * popularity among readers, the reader's own interests (categories they have
 * read, newest weighing more) and the current article's category. Articles
 * this browser already opened are left out while there are others to show.
 */
export function rankRecommendations<T extends { id: number; categories: number[]; date: string }>(
  pool: T[],
  currentCategories: number[],
  popularity: Map<number, number>,
  history: ReadingEntry[],
  limit = 3,
): T[] {
  const read = new Set(history.map((h) => h.id));
  const affinity = new Map<number, number>();
  history.slice(0, 20).forEach((h, i) => {
    for (const c of h.categories) affinity.set(c, (affinity.get(c) ?? 0) + 1 / (1 + i * 0.25));
  });
  const maxAffinity = Math.max(1, ...affinity.values());
  const maxPop = Math.max(1, ...popularity.values());
  const newest = Math.max(...pool.map((p) => Date.parse(p.date) || 0));

  const scored = pool.map((p) => {
    const pop = (popularity.get(p.id) ?? 0) / maxPop;
    const aff = Math.max(0, ...p.categories.map((c) => affinity.get(c) ?? 0)) / maxAffinity;
    const same = p.categories.some((c) => currentCategories.includes(c)) ? 1 : 0;
    const ageDays = (newest - (Date.parse(p.date) || 0)) / 86_400_000;
    const fresh = Math.max(0, 1 - ageDays / 180);
    return { p, score: 0.4 * pop + 0.3 * aff + 0.2 * same + 0.1 * fresh, read: read.has(p.id) };
  });
  scored.sort((a, b) => Number(a.read) - Number(b.read) || b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
}

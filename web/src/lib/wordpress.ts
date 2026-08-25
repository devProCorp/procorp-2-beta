/**
 * Sitemap-only reader for the Journal snapshot in content/journal/index.json
 * (sourced from Supabase, see docs/decisions/0002-journal-source-supabase.md).
 * The Journal itself (/journal and every article page) no longer uses this —
 * it fetches live from Supabase instead, see
 * docs/decisions/0004-journal-live-fetch.md and web/src/lib/journal-live.ts.
 * This snapshot only exists now to list article URLs in the sitemap without
 * a network round trip at build time. Regenerate it with:
 *   node scripts/snapshot-supabase.mjs
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "journal");

// Types and pure helpers live in wordpress-presentation.ts so client components
// can import them without pulling node:fs into the browser bundle; re-exported
// here to keep every existing `@/lib/wordpress` import working unchanged.
export * from "./wordpress-presentation";

export async function getAllPostIds(): Promise<
  { id: number; modified: string }[]
> {
  const raw = await fs.readFile(path.join(CONTENT_DIR, "index.json"), "utf8");
  const posts: { id: number; modified: string }[] = JSON.parse(raw);
  return posts.map((p) => ({ id: p.id, modified: p.modified }));
}

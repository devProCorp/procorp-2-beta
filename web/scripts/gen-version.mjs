/**
 * Writes public/version.json so the published site can say which build it is.
 *
 * Without this there is no way to tell what is live: the static export carries
 * no build metadata, and the host is shared with WordPress, so "look at the
 * files" means an SSH session and a guess. Deploys are also invisible behind
 * Sucuri's cache — this file is what distinguishes "the deploy didn't land"
 * from "you are looking at a cached copy".
 *
 * Runs as part of `yarn build` (prebuild), so it cannot be forgotten.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const WEB_DIR = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

/** git may be missing (CI image, tarball build); the field is then "unknown". */
function git(...args) {
  try {
    return execFileSync("git", args, { cwd: WEB_DIR, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

function articleCount() {
  try {
    const index = JSON.parse(
      readFileSync(path.join(WEB_DIR, "content/journal/index.json"), "utf8"),
    );
    return Array.isArray(index) ? index.length : null;
  } catch {
    return null;
  }
}

// A dirty tree means the build does not match the commit it names — worth
// knowing when a published page doesn't behave like the code you are reading.
const dirty = git("status", "--porcelain") !== "";

const version = {
  commit: git("rev-parse", "--short", "HEAD"),
  commit_full: git("rev-parse", "HEAD"),
  branch: git("rev-parse", "--abbrev-ref", "HEAD"),
  commit_date: git("log", "-1", "--format=%cI"),
  subject: git("log", "-1", "--format=%s"),
  built_at: new Date().toISOString(),
  dirty,
  site_url: process.env.NEXT_PUBLIC_SITE_URL ?? null,
  noindex: process.env.NEXT_PUBLIC_NOINDEX === "1",
  journal_snapshot_posts: articleCount(),
};

const target = path.join(WEB_DIR, "public/version.json");
writeFileSync(target, JSON.stringify(version, null, 2) + "\n");
console.log(`version.json: ${version.commit}${dirty ? " (dirty)" : ""} @ ${version.built_at}`);

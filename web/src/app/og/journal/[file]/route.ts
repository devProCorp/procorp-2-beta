import { fetchPublishedPostsForBuild } from "@/lib/journal-live";
import {
  getArticleCategory,
  getArticleDescription,
  getArticlePhoto,
  getArticleTitle,
} from "@/lib/og/journal-cards";
import { renderArticleCard } from "@/lib/og/render";

// One social card per published article, written by the static export as
// /og/journal/<wp_id>.jpg (see app/og/[file]/route.ts for why JPEG files).
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    const posts = await fetchPublishedPostsForBuild();
    return posts.map((post) => ({ file: `${post.id}.jpg` }));
  } catch {
    // Supabase down at build time: no article cards, the site still builds.
    return [{ file: "__sin-articulos.jpg" }];
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const id = file.replace(/\.jpg$/, "");
  const posts = await fetchPublishedPostsForBuild().catch(() => []);
  const post = posts.find((p) => String(p.id) === id);

  const jpeg = await renderArticleCard(
    id,
    post
      ? {
          title: getArticleTitle(post),
          subtitle: getArticleDescription(post, 180),
          category: getArticleCategory(post),
          photo: getArticlePhoto(post),
        }
      : { title: "Journal", subtitle: "PRO CORP" },
  );

  return new Response(new Uint8Array(jpeg), {
    headers: { "Content-Type": "image/jpeg" },
  });
}

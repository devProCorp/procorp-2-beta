import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/wordpress";

// Required by `output: "export"`: metadata routes must be resolved at build time.
export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://procorp.com";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/studio`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/journal`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await getAllPostSlugs();
    blogRoutes = posts.map((post) => ({
      url: `${siteUrl}/journal/${post.slug}`,
      lastModified: new Date(post.modified),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Sitemap still works without blog posts if WP is unreachable
  }

  return [...staticRoutes, ...blogRoutes];
}

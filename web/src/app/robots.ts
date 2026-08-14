import type { MetadataRoute } from "next";

// Required by `output: "export"`: metadata routes must be resolved at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://procorp.com";

  // Staging deploys (beta subdomain) must stay out of the index: the journal is
  // a snapshot of the WordPress site on www.pro-corp.net, so letting crawlers in
  // would put the two copies in competition for the same content.
  if (process.env.NEXT_PUBLIC_NOINDEX === "1") {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // Static HTML export: the target host (GoDaddy shared cPanel) has no Node
  // runtime, so the site is prerendered at build time and served by Apache.
  // Every route is static already — no route handlers, no server actions.
  output: "export",

  // Apache serves `/foo/` as `/foo/index.html`; without this the export emits
  // `/foo.html`, which the host would not resolve from a clean URL.
  trailingSlash: true,

  // /journal and its articles fetch live from Supabase (see ADR 0004) and no
  // longer read the snapshot at render time. Only the sitemap still does —
  // make sure it stays bundled into serverless/standalone output.
  outputFileTracingIncludes: {
    "/sitemap.xml": ["./content/journal/**/*"],
  },

  images: {
    // The optimizer is a server feature; a static export ships the originals.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
        pathname: "/avatar/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/aida-public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cpojgmwfpbuvtutnbtam.supabase.co",
        pathname: "/storage/v1/object/public/blog-assets/**",
      },
    ],
  },

  // NOTE: `headers()` is a server feature and is ignored by `output: "export"`.
  // The full security header set (CSP, HSTS, X-Frame-Options, Permissions-Policy…)
  // now lives in `public/.htaccess`, which the export copies verbatim into `out/`
  // so Apache applies it on the host. Keep both in sync if the CSP changes.
};

export default nextConfig;

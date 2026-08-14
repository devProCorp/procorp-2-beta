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

  // The journal snapshot is read from disk at render time; make sure it is
  // bundled into serverless/standalone output (see ADR 0001).
  outputFileTracingIncludes: {
    "/journal": ["./content/journal/**/*"],
    "/journal/[slug]": ["./content/journal/**/*"],
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
    ],
  },

  // NOTE: `headers()` is a server feature and is ignored by `output: "export"`.
  // The full security header set (CSP, HSTS, X-Frame-Options, Permissions-Policy…)
  // now lives in `public/.htaccess`, which the export copies verbatim into `out/`
  // so Apache applies it on the host. Keep both in sync if the CSP changes.
};

export default nextConfig;

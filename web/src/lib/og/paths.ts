export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** Public path of a prebuilt social card (see app/og/[file]/route.ts). */
export function ogImagePath(slug: "site" | string) {
  return `/og/${slug}.jpg`;
}

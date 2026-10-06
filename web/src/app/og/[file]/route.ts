import { renderServiceCard, renderSiteCard } from "@/lib/og/render";
import { services } from "@/lib/services";

// Social preview cards, written by the static export as plain `.jpg` files so
// Apache serves them with the right MIME type. JPEG keeps photo cards well
// under WhatsApp's ~300 KB preview limit (the PNG versions weigh 400–700 KB).
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { file: "site.jpg" },
    ...services.map(({ slug }) => ({ file: `${slug}.jpg` })),
  ];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const slug = file.replace(/\.jpg$/, "");
  const jpeg = slug === "site" ? await renderSiteCard() : await renderServiceCard(slug);

  return new Response(new Uint8Array(jpeg), {
    headers: { "Content-Type": "image/jpeg" },
  });
}

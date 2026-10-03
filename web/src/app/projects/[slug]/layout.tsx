import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getServiceCard } from '@/lib/og/service-cards';
import { OG_IMAGE_SIZE, ogImagePath } from '@/lib/og/paths';
import { services } from '@/lib/services';

// page.tsx is a client component (it reads the slug via useParams), and a
// client module cannot export generateStaticParams — so the route list for the
// static export is declared here instead. Unknown slugs 404 at build time.
export const dynamicParams = false;

export function generateStaticParams() {
    return services.map(({ slug }) => ({ slug }));
}

// Each service shares its own preview card (built by app/og/[file]/route.ts).
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const card = getServiceCard(slug);
    if (!card) return {};

    const title = `${card.title} | PRO CORP`;
    const image = ogImagePath(slug);
    return {
        openGraph: {
            type: 'website',
            siteName: 'PRO CORP',
            url: `/projects/${slug}/`,
            title,
            description: card.subtitle,
            images: [{ url: image, ...OG_IMAGE_SIZE, alt: title }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: card.subtitle,
            images: [image],
        },
    };
}

export default function ProjectLayout({ children }: { children: ReactNode }) {
    return children;
}

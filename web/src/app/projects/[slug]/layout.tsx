import type { ReactNode } from 'react';
import { services } from '@/lib/services';

// page.tsx is a client component (it reads the slug via useParams), and a
// client module cannot export generateStaticParams — so the route list for the
// static export is declared here instead. Unknown slugs 404 at build time.
export const dynamicParams = false;

export function generateStaticParams() {
    return services.map(({ slug }) => ({ slug }));
}

export default function ProjectLayout({ children }: { children: ReactNode }) {
    return children;
}

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Título de la pestaña y URL canónica: «Crecimiento Sostenible - BPA» en el menú → /sustainable-growth/.
export const metadata: Metadata = {
    title: 'Sustainable Growth - BPA',
    alternates: { canonical: '/sustainable-growth/' },
};

export default function Layout({ children }: { children: ReactNode }) {
    return children;
}

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Título de la pestaña y URL canónica: «Soluciones Legales» en el menú → /legal-solutions/.
export const metadata: Metadata = {
    title: 'Legal Solutions',
    alternates: { canonical: '/legal-solutions/' },
};

export default function Layout({ children }: { children: ReactNode }) {
    return children;
}

import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Título de la pestaña y URL canónica: «Proyectos» en el menú → /projects/.
export const metadata: Metadata = {
    title: 'Investment Projects',
    alternates: { canonical: '/projects/' },
};

export default function Layout({ children }: { children: ReactNode }) {
    return children;
}

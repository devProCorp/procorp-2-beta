import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Título de la pestaña y URL canónica: «Sobre nosotros» en el menú → /about/.
export const metadata: Metadata = {
    title: 'About Us',
    alternates: { canonical: '/about/' },
};

export default function Layout({ children }: { children: ReactNode }) {
    return children;
}

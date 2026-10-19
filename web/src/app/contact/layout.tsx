import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Título de la pestaña y URL canónica: «Contacto» en el menú → /contact/.
export const metadata: Metadata = {
    title: 'Contact',
    alternates: { canonical: '/contact/' },
};

export default function Layout({ children }: { children: ReactNode }) {
    return children;
}

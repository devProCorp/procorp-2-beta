import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Geist, Montserrat } from 'next/font/google';

// Título de la pestaña: «Blog» en el menú → /blog/. La canónica va en
// page.tsx: aquí la heredarían los artículos en vivo (live-fallback).
export const metadata: Metadata = {
    title: 'Blog',
};

// Propuesta B (2026-11-18): títulos en Montserrat y texto en Geist, como el
// sistema de diseño de Pro Corp. Solo se cargan en el blog; el resto de la web
// sigue con Inter.
const montserrat = Montserrat({
    variable: '--font-montserrat',
    weight: ['600', '700'],
    subsets: ['latin'],
});

const geist = Geist({
    variable: '--font-geist',
    subsets: ['latin'],
});

export default function Layout({ children }: { children: ReactNode }) {
    return <div className={`${montserrat.variable} ${geist.variable} font-blog`}>{children}</div>;
}

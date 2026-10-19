import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Título de la pestaña: «Blog» en el menú → /blog/. La canónica va en
// page.tsx: aquí la heredarían los artículos en vivo (live-fallback).
export const metadata: Metadata = {
    title: 'Blog',
};

export default function Layout({ children }: { children: ReactNode }) {
    return children;
}

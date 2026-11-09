import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Landing de las Elecciones Generales del 29 de noviembre de 2026, a partir del MVP
// «Inteligencia electoral» de Innovación (Lina Díaz, 2026-11-09).
export const metadata: Metadata = {
    title: 'Elecciones Generales de España 2026',
    description:
        'Calendario oficial, reparto de escaños, publicaciones del BOE y cómo votar desde el extranjero en las Elecciones Generales del 29 de noviembre de 2026.',
    alternates: { canonical: '/elecciones-2026/' },
};

export default function Layout({ children }: { children: ReactNode }) {
    return children;
}

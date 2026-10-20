import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Sustituye a la página WordPress /estadisticas-espana/ en la misma URL.
export const metadata: Metadata = {
    title: 'Estadísticas de nacionalidad española',
    description:
        'Solicitudes, concesiones y expedientes pendientes de nacionalidad española por residencia, Ley 12/2015 de sefardíes y carta de naturaleza, con datos del Ministerio de Justicia.',
    alternates: { canonical: '/estadisticas-espana/' },
};

export default function Layout({ children }: { children: ReactNode }) {
    return children;
}

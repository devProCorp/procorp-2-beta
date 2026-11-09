import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Centro de novedades: llega quien pulsa «Sí, quiero recibir novedades» en un
// correo de PRO CORP. Es una página personal (el enlace trae un token), así que
// no se indexa. Vive en /centro-de-novedades/ porque /novedades/ ya redirige
// (301 del .htaccess) a un artículo antiguo del blog.
export const metadata: Metadata = {
    title: 'Centro de novedades',
    description:
        'Novedades de PRO CORP para sus clientes: Elecciones Generales del 29 de noviembre, estadísticas de nacionalidad y servicios.',
    robots: { index: false, follow: false },
    alternates: { canonical: '/centro-de-novedades/' },
};

export default function Layout({ children }: { children: ReactNode }) {
    return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Procedimiento de eliminación de datos personales | PRO CORP',
  description: 'Cómo solicitar a PRO CORP S.A.S. la eliminación de datos personales tratados en relación con mensajes directos enviados a @pro.corp.',
  alternates: { canonical: '/eliminacion-de-datos/' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

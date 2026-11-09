import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eliminación de datos | PRO CORP',
  description: 'Cómo pedir a Pro Corp la eliminación de los datos de su conversación por Instagram.',
  alternates: { canonical: '/eliminacion-de-datos/' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidad | PRO CORP',
  alternates: { canonical: '/politica-de-privacidad/' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

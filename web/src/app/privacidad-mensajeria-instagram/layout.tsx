import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacidad de los mensajes de Instagram | PRO CORP',
  description: 'Cómo trata Pro Corp los datos de quienes escriben por mensaje directo a @pro.corp en Instagram.',
  alternates: { canonical: '/privacidad-mensajeria-instagram/' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

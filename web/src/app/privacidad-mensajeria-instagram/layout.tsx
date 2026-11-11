import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacidad de los mensajes de Instagram | PRO CORP',
  description: 'Tratamiento de datos personales de los mensajes directos enviados a @pro.corp y uso de un asistente de inteligencia artificial | PRO CORP S.A.S.',
  alternates: { canonical: '/privacidad-mensajeria-instagram/' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de tratamiento de datos personales | PRO CORP',
  alternates: { canonical: '/tratamiento-de-datos-personales/' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

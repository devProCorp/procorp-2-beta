'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import VentanaSalida from './VentanaSalida';

// Cabecera, pie y ventana de salida de la web. Las landings que traen su propio
// diseño completo (cabecera y pie incluidos) se pintan sin ellos.
const SIN_MARCO = ['/elecciones-2026'];

export default function MarcoSitio({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '';
  if (SIN_MARCO.some((p) => pathname.startsWith(p))) return <>{children}</>;
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <VentanaSalida />
    </>
  );
}

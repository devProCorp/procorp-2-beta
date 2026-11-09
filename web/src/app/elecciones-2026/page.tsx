import type { Metadata } from 'next';
import LandingElectoral from './LandingElectoral';

// Landing «Inteligencia electoral» de Innovación (Lina Díaz). Lleva su propia
// cabecera y su propio pie, así que el layout no pinta los de la web aquí
// (ver MarcoSitio).
export const metadata: Metadata = {
  title: { absolute: 'Inteligencia Electoral | PRO CORP' },
  description:
    'Inteligencia electoral de PRO CORP: información electoral, comparación de programas y oportunidades de inversión.',
  alternates: { canonical: '/elecciones-2026/' },
};

export default function Elecciones2026() {
  return <LandingElectoral />;
}

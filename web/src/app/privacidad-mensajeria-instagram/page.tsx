import PaginaLegal from '@/components/legal/PaginaLegal';
import SeccionesLegales from '@/components/legal/SeccionesLegales';
import secciones from '@/content/legal/privacidad-mensajeria-instagram.json';

// Texto íntegro del documento de Innovación & Legal (Lina Díaz, 10-nov-2026); no editar sin su visto bueno.
// URL de política de privacidad que se declara en la app de Meta del asistente de Instagram.
export default function PrivacidadMensajeriaInstagram() {
  return (
    <PaginaLegal titulo="Privacidad de los mensajes de Instagram"
      subtitulo="Tratamiento mediante asistente de inteligencia artificial | PRO CORP S.A.S."
      actualizado="PRO CORP S.A.S. | 10 de noviembre de 2026">
      <SeccionesLegales secciones={secciones} />
    </PaginaLegal>
  );
}

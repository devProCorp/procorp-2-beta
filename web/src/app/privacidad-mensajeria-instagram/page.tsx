import PaginaLegal from '@/components/legal/PaginaLegal';
import SeccionesLegales from '@/components/legal/SeccionesLegales';
import secciones from '@/content/legal/privacidad-mensajeria-instagram.json';

// URL de política de privacidad que se declara en la app de Meta del asistente de Instagram.
export default function PrivacidadMensajeriaInstagram() {
  return (
    <PaginaLegal titulo="Privacidad de los mensajes de Instagram" actualizado="Última actualización: noviembre de 2026">
      <SeccionesLegales secciones={secciones} />
    </PaginaLegal>
  );
}

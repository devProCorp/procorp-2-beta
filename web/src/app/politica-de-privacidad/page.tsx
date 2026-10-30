import PaginaLegal from '@/components/legal/PaginaLegal';
import parrafos from '@/content/legal/politica-privacidad.json';

// Texto literal de la página de WordPress con la misma URL. Al publicar el sitio,
// Apache sirve este directorio antes que WordPress.
export default function PoliticaDePrivacidad() {
  return (
    <PaginaLegal titulo="Política de Privacidad">
      {parrafos.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </PaginaLegal>
  );
}

import PaginaLegal from '@/components/legal/PaginaLegal';
import SeccionesLegales from '@/components/legal/SeccionesLegales';
import secciones from '@/content/legal/eliminacion-de-datos.json';

// Texto íntegro del documento de Innovación & Legal (Lina Díaz, 10-nov-2026); no editar sin su visto bueno.
// URL de instrucciones de eliminación de datos que se declara en la app de Meta.
export default function EliminacionDeDatos() {
  return (
    <PaginaLegal titulo="Procedimiento de eliminación de datos personales"
      subtitulo="Datos asociados a Instagram | PRO CORP S.A.S."
      actualizado="PRO CORP S.A.S. | 10 de noviembre de 2026">
      <SeccionesLegales secciones={secciones} />
    </PaginaLegal>
  );
}

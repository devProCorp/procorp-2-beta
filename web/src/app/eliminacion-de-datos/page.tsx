import PaginaLegal from '@/components/legal/PaginaLegal';
import SeccionesLegales from '@/components/legal/SeccionesLegales';
import secciones from '@/content/legal/eliminacion-de-datos.json';

// URL de instrucciones de eliminación de datos que se declara en la app de Meta.
export default function EliminacionDeDatos() {
  return (
    <PaginaLegal titulo="Eliminación de datos" actualizado="Última actualización: noviembre de 2026">
      <SeccionesLegales secciones={secciones} />
    </PaginaLegal>
  );
}

import PaginaLegal from '@/components/legal/PaginaLegal';
import VisorPdf from '@/components/legal/VisorPdf';

const TITULO = 'Política de tratamiento de datos personales';

// El documento es el PDF original, sin transcribir.
export default function TratamientoDeDatosPersonales() {
  return (
    <PaginaLegal titulo={TITULO} ancho>
      <VisorPdf url="/legal/politica-tratamiento-datos-personales.pdf" titulo={TITULO} />
    </PaginaLegal>
  );
}

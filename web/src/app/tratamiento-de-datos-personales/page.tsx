import PaginaLegal from '@/components/legal/PaginaLegal';
import bloques from '@/content/legal/tratamiento-datos.json';

type Bloque = { t: string; x: string; n?: number };

// Texto literal del PDF que WordPress incrusta en esta misma URL (documento fechado
// el 01/06/2019). En WordPress solo se veía el visor; aquí es texto que se puede leer
// en el móvil y que los buscadores indexan. El PDF original sigue disponible.
export default function TratamientoDeDatosPersonales() {
  const grupos: (Bloque | Bloque[])[] = [];
  for (const b of bloques as Bloque[]) {
    const ultimo = grupos[grupos.length - 1];
    if (b.t === 'li' && Array.isArray(ultimo)) ultimo.push(b);
    else grupos.push(b.t === 'li' ? [b] : b);
  }

  return (
    <PaginaLegal
      titulo="Política de tratamiento de datos personales"
      actualizado="Última modificación: 01 de junio de 2019"
    >
      {grupos.map((g, i) => {
        if (Array.isArray(g))
          return (
            <ol key={i} className="list-decimal pl-6 space-y-2">
              {g.map((li, j) => (
                <li key={j}>{li.x}</li>
              ))}
            </ol>
          );
        if (g.t === 'h2')
          return (
            <h2 key={i} className="text-xl font-bold text-white pt-6">
              {g.x}
            </h2>
          );
        if (g.t === 'h3')
          return (
            <h3 key={i} className="font-semibold text-white pt-2">
              {g.x}
            </h3>
          );
        return <p key={i}>{g.x}</p>;
      })}
      <p className="pt-6">
        <a
          href="/legal/politica-tratamiento-datos-personales.pdf"
          className="text-primary underline underline-offset-4 hover:text-white"
        >
          Descargar el documento en PDF
        </a>
      </p>
    </PaginaLegal>
  );
}

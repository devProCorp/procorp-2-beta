import Link from 'next/link';
import Bienvenida from '@/components/novedades/Bienvenida';
import { FECHA_CORTE, RESIDENCIA_TOTALES, SEFARDIES_GLOBAL } from '@/lib/estadisticas-espana';
import {
  ARTICULO_ELECCIONES,
  ENLACES_OFICIALES,
  HITOS_ELECCIONES,
  PASOS_VOTO_EXTERIOR,
  SERVICIOS,
} from '@/lib/novedades';

// es-ES no agrupa los números de 4 cifras (7869); de-DE usa el mismo punto y sí lo hace.
const fmt = new Intl.NumberFormat('de-DE');

function Seccion({
  id,
  numero,
  titulo,
  texto,
  children,
}: {
  id: string;
  numero: string;
  titulo: string;
  texto?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-6 scroll-mt-28">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold flex items-baseline gap-3">
          <span className="text-primary font-mono text-sm">{numero}</span>
          {titulo}
        </h2>
        {texto && <p className="mt-3 text-secondary text-sm leading-relaxed max-w-3xl">{texto}</p>}
      </div>
      {children}
    </section>
  );
}

function Cifra({ valor, etiqueta }: { valor: number; etiqueta: string }) {
  return (
    <div className="bg-surface-dark border border-surface-border rounded-2xl p-5">
      <p className="text-2xl md:text-3xl font-black tabular-nums">{fmt.format(valor)}</p>
      <p className="mt-1 text-xs text-secondary leading-snug">{etiqueta}</p>
    </div>
  );
}

export default function Novedades() {
  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 space-y-20">
        <header>
          <Bienvenida />
          <nav aria-label="Secciones" className="mt-8 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wider">
            {[
              ['#elecciones', 'Elecciones 29-N'],
              ['#votar', 'Votar desde el extranjero'],
              ['#estadisticas', 'Estadísticas'],
              ['#servicios', 'Servicios PRO CORP'],
            ].map(([href, texto]) => (
              <a
                key={href}
                href={href}
                className="px-3 py-2 rounded-full border border-surface-border text-secondary hover:text-white hover:border-primary/60 transition-colors"
              >
                {texto}
              </a>
            ))}
          </nav>
        </header>

        <Seccion
          id="elecciones"
          numero="01"
          titulo="Elecciones Generales del 29 de noviembre"
          texto="España vuelve a las urnas antes de lo previsto. Estas son las fechas clave del proceso electoral."
        >
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {HITOS_ELECCIONES.map((h) => (
              <li key={h.fecha} className="bg-surface-dark border border-surface-border rounded-2xl p-5">
                <p className="text-primary text-xs font-bold uppercase tracking-wider">{h.fecha}</p>
                <p className="mt-2 font-bold">{h.titulo}</p>
                <p className="mt-1 text-xs text-secondary leading-snug">{h.detalle}</p>
              </li>
            ))}
          </ol>
          <div className="bg-surface-dark border border-surface-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
            <div>
              <p className="text-xs text-primary font-bold uppercase tracking-wider">BlogCast PRO CORP</p>
              <p className="mt-1 font-bold">España irá a elecciones el 29 de noviembre</p>
              <p className="mt-1 text-sm text-secondary">
                Qué está en juego y qué puede cambiar en extranjería, residencia y nacionalidad. Léalo o escúchelo.
              </p>
            </div>
            <Link
              href={ARTICULO_ELECCIONES}
              className="shrink-0 inline-flex items-center justify-center px-5 py-3 rounded-full bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Escuchar el BlogCast
            </Link>
          </div>
        </Seccion>

        <Seccion
          id="votar"
          numero="02"
          titulo="Cómo votar si reside en el extranjero"
          texto="Si ya cuenta con la nacionalidad española, infórmese con tiempo: el procedimiento lo gestiona su consulado."
        >
          <ol className="grid md:grid-cols-3 gap-3 sm:gap-4">
            {PASOS_VOTO_EXTERIOR.map((p, i) => (
              <li key={p.titulo} className="bg-surface-dark border border-surface-border rounded-2xl p-5">
                <p className="text-primary font-mono text-sm">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-2 font-bold">{p.titulo}</p>
                <p className="mt-2 text-sm text-secondary leading-relaxed">{p.texto}</p>
              </li>
            ))}
          </ol>
          <div className="text-sm text-secondary space-y-2">
            <p>Fuentes oficiales:</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {ENLACES_OFICIALES.map((e) => (
                <li key={e.url}>
                  <a href={e.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                    {e.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-primary/30 bg-primary/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
            <p className="text-sm leading-relaxed max-w-2xl">
              ¿Su nacionalidad está concedida pero aún no ha completado la jura o la inscripción en el Registro Civil?
              Nuestro equipo legal puede revisar su caso.
            </p>
            <Link
              href="/contact/"
              className="shrink-0 inline-flex items-center justify-center px-5 py-3 rounded-full border border-primary text-white text-sm font-bold hover:bg-primary transition-colors"
            >
              Consultar mi caso
            </Link>
          </div>
        </Seccion>

        <Seccion
          id="estadisticas"
          numero="03"
          titulo="Nacionalidad española en cifras"
          texto={`Datos del Ministerio de Justicia a ${FECHA_CORTE}.`}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Cifra valor={SEFARDIES_GLOBAL.concesiones} etiqueta="Concesiones por la Ley 12/2015 de sefardíes" />
            <Cifra valor={SEFARDIES_GLOBAL.pendientes} etiqueta="Expedientes sefardíes pendientes en la DGSJFP" />
            <Cifra valor={RESIDENCIA_TOTALES.concesiones} etiqueta="Concesiones por residencia 2021–2026" />
            <Cifra valor={RESIDENCIA_TOTALES.pendientes} etiqueta="Expedientes por residencia pendientes" />
          </div>
          <Link href="/estadisticas-espana/" className="inline-block text-sm font-bold text-primary hover:underline">
            Ver todas las estadísticas →
          </Link>
        </Seccion>

        <Seccion
          id="servicios"
          numero="04"
          titulo="PRO CORP le acompaña"
          texto="Además de sus trámites en España, PRO CORP amplía sus líneas de negocio."
        >
          <div className="grid md:grid-cols-3 gap-3 sm:gap-4">
            {SERVICIOS.map((s) => (
              <article
                key={s.clave}
                className="bg-surface-dark border border-surface-border rounded-2xl p-6 flex flex-col"
              >
                <p className="text-primary text-xs font-bold uppercase tracking-wider">{s.etiqueta}</p>
                <h3 className="mt-2 text-lg font-bold">{s.titulo}</h3>
                <p className="mt-2 text-sm text-secondary leading-relaxed flex-1">{s.texto}</p>
                <Link
                  href={s.href}
                  className="mt-5 inline-flex items-center justify-center px-5 py-3 rounded-full bg-primary text-white text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  {s.accion}
                </Link>
              </article>
            ))}
          </div>
        </Seccion>

        <footer className="pt-8 border-t border-surface-border text-xs text-secondary space-y-1">
          <p>
            PRO CORP no recomienda el voto a ningún partido: esta información es práctica y se basa en fuentes
            oficiales.
          </p>
          <p>
            Recibe esta información porque aceptó recibir novedades de PRO CORP. Puede darse de baja desde el enlace
            de cualquiera de nuestros correos.
          </p>
        </footer>
      </div>
    </main>
  );
}

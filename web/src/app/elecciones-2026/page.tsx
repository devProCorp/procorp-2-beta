import Link from 'next/link';
import FormularioInversion from '@/components/elecciones/FormularioInversion';
import PublicacionesBOE from '@/components/elecciones/PublicacionesBOE';
import {
  CALENDARIO,
  CONVOCATORIA,
  DIPUTADOS,
  FUENTES_OFICIALES,
  MAYORIA_ABSOLUTA,
  REVISADO,
  SENADO,
  TEMAS_PROGRAMAS,
  TOTAL_DIPUTADOS,
} from '@/lib/elecciones-2026';
import { ARTICULO_ELECCIONES } from '@/lib/novedades';

// Mismos pasos que el Centro de novedades, pero de tú, como el resto de esta página.
const PASOS_VOTO = [
  {
    titulo: 'Comprueba que eres elector',
    texto:
      'Para votar necesitas tener la nacionalidad española inscrita en el Registro Civil y figurar en el censo electoral. Si resides fuera de España, ese censo es el CERA (Censo Electoral de Españoles Residentes Ausentes), al que se accede inscribiéndose como residente en el consulado.',
  },
  {
    titulo: 'Consulta el procedimiento de tu consulado',
    texto:
      'Cada consulado publica las fechas y la forma de votar desde el exterior. No esperes al último momento.',
  },
  {
    titulo: 'Atento a la documentación electoral',
    texto:
      'La documentación puede llegar con retraso al domicilio. Si no la recibes a tiempo, ponte en contacto con tu consulado cuanto antes.',
  },
];

const MAYORES = [...DIPUTADOS].sort((a, b) => b[1] - a[1]);
const MAXIMO = MAYORES[0][1];

function Seccion({ id, titulo, texto, children }: { id: string; titulo: string; texto?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="space-y-6 scroll-mt-28">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{titulo}</h2>
        {texto && <p className="mt-3 text-secondary text-sm md:text-base leading-relaxed max-w-3xl">{texto}</p>}
      </div>
      {children}
    </section>
  );
}

export default function Elecciones2026() {
  return (
    <main className="min-h-screen bg-transparent text-white">
      <header className="relative overflow-hidden border-b border-surface-border">
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" viewBox="0 0 1400 650" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <g stroke="#8090a8" strokeWidth="1" fill="none" opacity=".5">
            <path d="M80 120L210 80L300 190L180 280L80 120M210 80L390 130L300 190L420 310L180 280M920 100L1080 160L1250 90L1320 250L1150 330L1080 160M920 100L850 260L1050 420L1150 330L1320 250M180 480L300 390L420 500L550 420L650 560M850 500L1050 420L1190 530L1320 450" />
          </g>
          <g fill="#d6deea" opacity=".6">
            {[[80, 120], [210, 80], [300, 190], [180, 280], [390, 130], [420, 310], [300, 390], [550, 420], [920, 100], [1080, 160], [1250, 90], [1320, 250], [1150, 330], [1050, 420], [1190, 530]].map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="4" />
            ))}
          </g>
        </svg>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.02] max-w-4xl">
            Elecciones Generales de España 2026
          </h1>
          <p className="mt-6 text-secondary text-lg max-w-2xl">
            Comprende el proceso electoral con datos oficiales, sigue las publicaciones del BOE y descubre
            oportunidades de inversión con PRO CORP.
          </p>
          <p className="mt-8 text-primary text-sm font-bold">Domingo, 29 de noviembre de 2026</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#panorama" className="inline-flex px-6 py-3 rounded-full bg-primary text-white text-sm font-bold hover:opacity-90">
              Explorar las elecciones
            </a>
            <a href="#inversion" className="inline-flex px-6 py-3 rounded-full border border-surface-border text-white text-sm font-bold hover:border-primary/60">
              Oportunidades de inversión
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 space-y-24">
        <div className="grid md:grid-cols-2 gap-5">
          <a href="#panorama" className="group bg-surface-dark border border-surface-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/elecciones/madrid.jpg" alt="Vista aérea de Madrid" className="h-48 w-full object-cover" loading="lazy" />
            <div className="p-6">
              <h2 className="text-xl font-bold">Panorama electoral</h2>
              <p className="mt-2 text-sm text-secondary">Calendario, reparto de escaños y publicaciones oficiales del proceso.</p>
            </div>
          </a>
          <a href="#programas" className="group bg-surface-dark border border-surface-border rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/elecciones/programas.jpg" alt="Persona revisando un documento" className="h-48 w-full object-cover" loading="lazy" />
            <div className="p-6">
              <h2 className="text-xl font-bold">Comparador de programas</h2>
              <p className="mt-2 text-sm text-secondary">Las propuestas de cada formación por temática, con su fuente.</p>
            </div>
          </a>
        </div>

        <Seccion id="panorama" titulo="Panorama electoral" texto={`Datos del ${CONVOCATORIA.titulo.split(',')[0]}, publicado en el ${CONVOCATORIA.boe}.`}>
          <ol className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CALENDARIO.map((h) => (
              <li key={h.fecha} className="bg-surface-dark border border-surface-border rounded-2xl p-5">
                <p className="text-primary text-sm font-bold">{h.fecha}</p>
                <p className="mt-2 font-bold">{h.titulo}</p>
                <p className="mt-1 text-sm text-secondary leading-snug">{h.detalle}</p>
              </li>
            ))}
          </ol>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-surface-dark border border-surface-border rounded-2xl p-6">
              <h3 className="text-lg font-bold">Congreso de los Diputados</h3>
              <p className="mt-2 text-sm text-secondary">
                {TOTAL_DIPUTADOS} diputados en {DIPUTADOS.length} circunscripciones. La mayoría absoluta está en{' '}
                {MAYORIA_ABSOLUTA} escaños.
              </p>
              <p className="mt-5 text-xs font-bold text-gray-300">Circunscripciones con más diputados</p>
              <ul className="mt-3 space-y-2">
                {MAYORES.slice(0, 8).map(([c, n]) => (
                  <li key={c} className="grid grid-cols-[8.5rem_1fr_2rem] items-center gap-3 text-sm">
                    <span className="truncate">{c}</span>
                    <span className="h-2 rounded-full bg-primary/80" style={{ width: `${(n / MAXIMO) * 100}%` }} aria-hidden="true" />
                    <span className="tabular-nums text-right">{n}</span>
                  </li>
                ))}
              </ul>
              <details className="mt-4 text-sm">
                <summary className="cursor-pointer text-primary font-bold">Ver las {DIPUTADOS.length} circunscripciones</summary>
                <ul className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-secondary">
                  {DIPUTADOS.map(([c, n]) => (
                    <li key={c} className="flex justify-between gap-2">
                      <span className="truncate">{c}</span>
                      <span className="tabular-nums text-white">{n}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
            <div className="space-y-5">
              <div className="bg-surface-dark border border-surface-border rounded-2xl p-6">
                <h3 className="text-lg font-bold">Senado</h3>
                <p className="mt-2 text-sm text-secondary leading-relaxed">{SENADO}</p>
              </div>
              <PublicacionesBOE />
            </div>
          </div>
        </Seccion>

        <Seccion
          id="votar"
          titulo="Votar desde el extranjero"
          texto="Si ya tienes la nacionalidad española y resides fuera de España, el procedimiento lo gestiona tu consulado."
        >
          <ol className="grid md:grid-cols-3 gap-4">
            {PASOS_VOTO.map((p) => (
              <li key={p.titulo} className="bg-surface-dark border border-surface-border rounded-2xl p-5">
                <p className="font-bold">{p.titulo}</p>
                <p className="mt-2 text-sm text-secondary leading-relaxed">{p.texto}</p>
              </li>
            ))}
          </ol>
          <p className="text-sm text-secondary">
            Análisis de PRO CORP sobre lo que se juega en estas elecciones:{' '}
            <Link href={ARTICULO_ELECCIONES} className="underline hover:text-white">
              «España irá a elecciones el 29 de noviembre»
            </Link>
            .
          </p>
        </Seccion>

        <Seccion
          id="programas"
          titulo="Comparador de programas"
          texto="Compararemos las propuestas de las formaciones políticas por temática cuando publiquen sus programas. Cada propuesta llevará el documento fuente, la fecha y la página."
        >
          <div className="bg-surface-dark border border-surface-border rounded-2xl p-6 space-y-4">
            <p className="text-sm font-bold text-primary">Próximamente</p>
            <ul className="flex flex-wrap gap-2">
              {TEMAS_PROGRAMAS.map((t) => (
                <li key={t} className="px-3 py-1.5 rounded-full border border-surface-border text-sm text-gray-200">
                  {t}
                </li>
              ))}
            </ul>
            <p className="text-xs text-secondary">
              PRO CORP no recomienda el voto a ninguna formación: el comparador solo recogerá lo que cada partido
              publique en su programa.
            </p>
          </div>
        </Seccion>

        <Seccion
          id="inversion"
          titulo="Descubre oportunidades de inversión"
          texto="Conoce los proyectos y las oportunidades estructurados por PRO CORP. Cuéntanos qué buscas y el equipo te escribirá con las que encajen."
        >
          <div className="bg-surface-dark border border-surface-border rounded-2xl p-6 md:p-8 max-w-4xl">
            <FormularioInversion />
          </div>
        </Seccion>

        <Seccion id="fuentes" titulo="Fuentes oficiales" texto={`Información revisada el ${REVISADO}.`}>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FUENTES_OFICIALES.map((f) => (
              <li key={f.url}>
                <a
                  href={f.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full bg-surface-dark border border-surface-border rounded-2xl p-5 hover:border-primary/50 transition-colors"
                >
                  <p className="font-bold">{f.titulo}</p>
                  <p className="mt-1 text-sm text-secondary">{f.detalle}</p>
                </a>
              </li>
            ))}
          </ul>
          <p className="text-sm text-secondary">
            ¿Quieres recibir las novedades de PRO CORP sobre el proceso?{' '}
            <Link href="/centro-de-novedades/" className="underline hover:text-white">
              Visita el Centro de novedades
            </Link>
            .
          </p>
        </Seccion>
      </div>
    </main>
  );
}

import GraficoColumnas from '@/components/estadisticas/GraficoColumnas';
import GraficoPaises from '@/components/estadisticas/GraficoPaises';
import {
  CARTAS,
  CARTAS_ANIOS,
  FECHA_CORTE,
  FUENTE_URL,
  PDF_URL,
  PENDIENTES,
  PENDIENTES_ANIOS,
  RESIDENCIA,
  RESIDENCIA_ANIOS,
  RESIDENCIA_TOTALES,
  SEFARDIES_GLOBAL,
  SEFARDIES_PAISES,
  SEFARDIES_TRIMESTRAL,
  SEFARDIES_TRIMESTRES,
} from '@/lib/estadisticas-espana';

// es-ES no agrupa los números de 4 cifras (7869); de-DE usa el mismo punto y sí lo hace.
const fmt = new Intl.NumberFormat('de-DE');

function Cifra({ valor, etiqueta }: { valor: number; etiqueta: string }) {
  return (
    <div className="bg-surface-dark border border-surface-border rounded-2xl p-5">
      <p className="text-2xl md:text-3xl font-black tabular-nums">{fmt.format(valor)}</p>
      <p className="mt-1 text-xs text-secondary leading-snug">{etiqueta}</p>
    </div>
  );
}

function Seccion({
  numero,
  titulo,
  texto,
  children,
}: {
  numero: string;
  titulo: string;
  texto?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
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

export default function EstadisticasEspana() {
  return (
    <main className="min-h-screen bg-transparent text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 space-y-20">
        <header>
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-4">
            Datos a {FECHA_CORTE}
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Estadísticas de Nacionalidad de España
          </h1>
          <p className="text-secondary text-sm leading-relaxed max-w-3xl">
            Datos estadísticos básicos de nacionalidad publicados por el Ministerio de Justicia: nacionalidad
            por residencia, Ley 12/2015 de sefardíes originarios de España y cartas de naturaleza. Los datos
            pueden variar a medida que se incorporan expedientes pendientes de digitalización y grabación.
          </p>
        </header>

        <Seccion
          numero="01"
          titulo="Ley 12/2015 — sefardíes originarios de España"
          texto="Evolución trimestral de las solicitudes y resoluciones. Los trimestres de junio y septiembre de 2023 no tienen informe archivado."
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Cifra valor={SEFARDIES_GLOBAL.recibidasNotariado} etiqueta="Recibidas en el Consejo General del Notariado" />
            <Cifra valor={SEFARDIES_GLOBAL.recibidasDGSJFP} etiqueta="Recibidas en la DGSJFP" />
            <Cifra valor={SEFARDIES_GLOBAL.concesiones} etiqueta="Concesiones" />
            <Cifra valor={SEFARDIES_GLOBAL.pendientes} etiqueta="Pendientes en la DGSJFP" />
          </div>
          <GraficoColumnas
            titulo="Ley 12/2015: evolución trimestral"
            categorias={SEFARDIES_TRIMESTRES}
            series={SEFARDIES_TRIMESTRAL}
          />
          <p className="text-xs text-secondary">
            Resueltas: {fmt.format(SEFARDIES_GLOBAL.resueltas)} · Denegaciones: {fmt.format(SEFARDIES_GLOBAL.denegaciones)} ·
            Archivos: {fmt.format(SEFARDIES_GLOBAL.archivos)} · Concesiones por estimación del recurso de alzada:{' '}
            {fmt.format(SEFARDIES_GLOBAL.concesionesRecursoAlzada)} · por ejecución de sentencia:{' '}
            {fmt.format(SEFARDIES_GLOBAL.concesionesSentencia)} · por revocación de una denegación previa:{' '}
            {fmt.format(SEFARDIES_GLOBAL.concesionesRevocacion)}. DGSJFP: Dirección General de Seguridad Jurídica y
            Fe Pública.
          </p>

          <h3 className="text-lg font-bold pt-4">Solicitudes y concesiones por país de origen</h3>
          <GraficoPaises paises={SEFARDIES_PAISES} />
        </Seccion>

        <Seccion
          numero="02"
          titulo="Nacionalidad por residencia"
          texto="Solicitudes por año de presentación del expediente y resoluciones por año de resolución. 2026 incluye hasta el 30 de junio."
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Cifra valor={RESIDENCIA_TOTALES.solicitudes} etiqueta="Solicitudes 2021–2026" />
            <Cifra valor={RESIDENCIA_TOTALES.concesiones} etiqueta="Concesiones 2021–2026" />
            <Cifra valor={RESIDENCIA_TOTALES.denegaciones} etiqueta="Denegaciones 2021–2026" />
            <Cifra valor={RESIDENCIA_TOTALES.pendientes} etiqueta="Expedientes pendientes de resolución" />
          </div>
          <GraficoColumnas titulo="Nacionalidad por residencia por año" categorias={RESIDENCIA_ANIOS} series={RESIDENCIA} />

          <h3 className="text-lg font-bold pt-4">Expedientes pendientes de resolución por año de solicitud</h3>
          <GraficoColumnas
            titulo="Expedientes pendientes por año de solicitud"
            categorias={PENDIENTES_ANIOS}
            series={PENDIENTES}
          />
        </Seccion>

        <Seccion
          numero="03"
          titulo="Cartas de naturaleza"
          texto="Artículo 21 del Código Civil. Además, en 2025 hubo 171 concesiones por carta de naturaleza en aplicación del artículo 33 de la Ley 20/2022 de Memoria Democrática."
        >
          <GraficoColumnas titulo="Cartas de naturaleza por año" categorias={CARTAS_ANIOS} series={CARTAS} />
        </Seccion>

        <footer className="pt-8 border-t border-surface-border text-xs text-secondary space-y-1">
          <p>
            Fuente:{' '}
            <a href={FUENTE_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              Ministerio de Justicia — Estadísticas. Datos básicos
            </a>{' '}
            (
            <a href={PDF_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              PDF a {FECHA_CORTE}
            </a>
            ) e informes trimestrales anteriores.
          </p>
          <p>* 2026: datos hasta el 30 de junio.</p>
        </footer>
      </div>
    </main>
  );
}

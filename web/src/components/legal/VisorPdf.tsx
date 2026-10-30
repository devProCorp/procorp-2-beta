'use client';

import { useEffect, useRef, useState } from 'react';

// Visor de PDF incrustado. Dentro de una página, el visor nativo del navegador no
// funciona en Android y en iOS solo muestra la primera hoja, así que cada hoja se
// dibuja con PDF.js. Se usa la versión «legacy» para Safari anteriores a 17.4. El
// worker es una copia de node_modules: si se actualiza pdfjs-dist, hay que copiarlo.
const ANCHO_DIBUJO = 1600; // Nítido en pantallas densas; el CSS lo ajusta al ancho.

export default function VisorPdf({ url, titulo }: { url: string; titulo: string }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const [estado, setEstado] = useState<'cargando' | 'listo' | 'error'>('cargando');
  const [paginas, setPaginas] = useState(0);

  useEffect(() => {
    let cancelado = false;
    let documento: { destroy: () => Promise<void> } | null = null;

    (async () => {
      const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      pdfjs.GlobalWorkerOptions.workerSrc = '/legal/pdf.worker.min.mjs';
      const tarea = pdfjs.getDocument(url);
      documento = tarea;
      const pdf = await tarea.promise;
      if (cancelado) return;
      setPaginas(pdf.numPages);

      for (let n = 1; n <= pdf.numPages; n++) {
        const pagina = await pdf.getPage(n);
        if (cancelado) return;
        const base = pagina.getViewport({ scale: 1 });
        const vista = pagina.getViewport({ scale: ANCHO_DIBUJO / base.width });
        const lienzo = document.createElement('canvas');
        lienzo.width = Math.floor(vista.width);
        lienzo.height = Math.floor(vista.height);
        lienzo.className = 'block w-full h-auto bg-white rounded-lg';
        lienzo.setAttribute('role', 'img');
        lienzo.setAttribute('aria-label', `${titulo}, página ${n} de ${pdf.numPages}`);
        await pagina.render({ canvasContext: lienzo.getContext('2d')!, viewport: vista }).promise;
        if (cancelado) return;
        contenedor.current?.appendChild(lienzo);
        // La primera hoja ya es contenido: no se espera a las demás para quitar el aviso.
        setEstado('listo');
      }
    })().catch((e) => {
      if (cancelado) return;
      console.error('[visor-pdf]', e);
      setEstado('error');
    });

    return () => {
      cancelado = true;
      void documento?.destroy();
    };
  }, [url, titulo]);

  return (
    <div>
      {estado === 'cargando' && (
        <p role="status" className="text-secondary text-sm py-10">
          Cargando el documento…
        </p>
      )}
      {estado === 'error' && (
        <p role="alert" className="text-secondary text-sm py-10">
          No se pudo mostrar el documento aquí. Usa el enlace de abajo para abrirlo.
        </p>
      )}
      <div ref={contenedor} className="space-y-4" data-paginas={paginas} />
      <p className="mt-6">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary underline underline-offset-4 hover:text-white"
        >
          Abrir el PDF en otra pestaña
        </a>
      </p>
    </div>
  );
}

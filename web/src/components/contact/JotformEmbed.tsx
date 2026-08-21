'use client';

import { useEffect, useState } from 'react';

interface JotformEmbedProps {
  /** ID del formulario: el número de form.jotform.com/<id>. */
  formId: string;
  /** Altura inicial, hasta que el propio formulario informe de la suya. */
  alturaInicial?: number;
  titulo?: string;
}

/** Origen del que se aceptan mensajes; cualquier otro se ignora. */
const ORIGEN_JOTFORM = 'https://form.jotform.com';

/**
 * Formulario de JotForm incrustado.
 *
 * Se incrusta en lugar de enviar desde nuestro propio formulario porque JotForm
 * bloquea con captcha los envíos que no vienen de su página: un POST directo
 * devuelve 200 y descarta el envío en silencio, que es la peor forma de fallar.
 * Incrustado, el visitante resuelve el captcha si aparece y el envío se guarda.
 *
 * El iframe no puede medirse desde fuera por ser de otro origen, así que JotForm
 * publica su altura por postMessage. Aquí se escucha comprobando el origen del
 * mensaje: sin esa comprobación, cualquier página podría redimensionar el marco.
 */
export default function JotformEmbed({
  formId,
  alturaInicial = 800,
  titulo = 'Formulario de contacto',
}: JotformEmbedProps) {
  const [altura, setAltura] = useState(alturaInicial);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    function alRecibirMensaje(evento: MessageEvent) {
      if (evento.origin !== ORIGEN_JOTFORM) return;
      if (typeof evento.data !== 'string') return;

      // JotForm envía "setHeight:<px>:<formID>"
      const [accion, valor] = evento.data.split(':');
      if (accion !== 'setHeight') return;

      const px = Number(valor);
      // Un salto a cero dejaría el formulario invisible; el tope evita que un
      // mensaje inesperado estire la página sin fin.
      if (Number.isFinite(px) && px > 200 && px < 5000) {
        setAltura(px);
      }
    }

    window.addEventListener('message', alRecibirMensaje);
    return () => window.removeEventListener('message', alRecibirMensaje);
  }, []);

  return (
    <div className="relative">
      {!cargado && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-background-dark/40"
          style={{ height: altura }}
          aria-hidden="true"
        >
          <span className="text-sm uppercase tracking-widest text-gray-400">
            Cargando formulario…
          </span>
        </div>
      )}
      <iframe
        title={titulo}
        src={`${ORIGEN_JOTFORM}/${formId}`}
        onLoad={() => setCargado(true)}
        scrolling="no"
        // allow-forms y allow-scripts son imprescindibles para que el formulario
        // funcione; allow-popups permite abrir la política de privacidad.
        sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
        style={{ height: altura }}
        className="w-full rounded-2xl border-0 bg-transparent transition-[height] duration-300"
      />
    </div>
  );
}

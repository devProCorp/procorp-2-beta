'use client';

// Burbuja flotante de WhatsApp SOLO para la landing de Elecciones Generales
// (pedido de Javier Jaramillo vía Lina Díaz, 2026-11-10). Vive en esta ruta y se
// monta desde LandingElectoral, nunca en un layout compartido, para que no aparezca
// en el resto de pro-corp.net. Abre un chat con Javier por WhatsApp Click to Chat.

import { useEffect, useState } from 'react';

// Número de Javier en formato internacional, solo dígitos (sin «+», espacios ni guiones).
export const WHATSAPP_JAVIER = '34677173832';

const MENSAJE = 'Hola, vengo de la página de Elecciones Generales de PRO CORP.';
const ETIQUETA = '¿Necesitas ayuda? Escríbenos';

export default function BurbujaWhatsApp() {
  // La etiqueta aparece sola a los 5 s y se oculta a los 8 s; al pasar el cursor
  // o enfocar el botón con el teclado se ve siempre.
  const [aviso, setAviso] = useState(false);

  useEffect(() => {
    const mostrar = setTimeout(() => setAviso(true), 5000);
    const ocultar = setTimeout(() => setAviso(false), 13000);
    return () => {
      clearTimeout(mostrar);
      clearTimeout(ocultar);
    };
  }, []);

  if (!/^\d{8,15}$/.test(WHATSAPP_JAVIER)) return null;

  const url = `https://wa.me/${WHATSAPP_JAVIER}?text=${encodeURIComponent(MENSAJE)}`;

  return (
    <div className={`burbuja-whatsapp${aviso ? ' con-aviso' : ''}`}>
      <span className="burbuja-whatsapp-etiqueta" aria-hidden="true">
        {ETIQUETA}
      </span>
      <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`${ETIQUETA} (WhatsApp)`} className="burbuja-whatsapp-boton">
        <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" focusable="false">
          <path
            fill="#fff"
            d="M16.04 3C9.03 3 3.33 8.7 3.33 15.7c0 2.24.59 4.43 1.7 6.36L3.2 28.8l6.9-1.8a12.67 12.67 0 0 0 5.94 1.5h.01c7 0 12.7-5.7 12.7-12.7S23.05 3 16.04 3Zm0 23.2h-.01c-1.9 0-3.77-.51-5.4-1.48l-.39-.23-4.1 1.07 1.1-3.99-.25-.41a10.46 10.46 0 0 1-1.61-5.58c0-5.79 4.71-10.5 10.5-10.5 2.8 0 5.44 1.1 7.42 3.08a10.43 10.43 0 0 1 3.07 7.43c0 5.79-4.71 10.5-10.5 10.5Zm5.76-7.86c-.32-.16-1.87-.92-2.16-1.03-.29-.1-.5-.16-.71.16-.21.32-.81 1.03-1 1.24-.18.21-.37.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.76-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.47-.55.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.8.66.75.24 1.44.21 1.98.13.6-.09 1.87-.76 2.13-1.5.26-.74.26-1.37.18-1.5-.08-.13-.29-.21-.6-.37Z"
          />
        </svg>
      </a>
    </div>
  );
}

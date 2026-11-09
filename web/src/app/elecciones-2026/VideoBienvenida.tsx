'use client';

// Ventana con el vídeo de Andrea que aparece al entrar en la landing, antes de la
// interfaz (pedido de Lina Díaz, 2026-11-09). Los navegadores no dejan reproducir
// con sonido sin un gesto del visitante: arranca en silencio y ofrece activarlo.
// Se cierra con el botón, con Escape o pulsando fuera del vídeo.

import { useEffect, useRef, useState } from 'react';

const VIDEO = '/elecciones-2026/video-andrea.mp4';
const PORTADA = '/elecciones-2026/video-andrea.jpg';

export default function VideoBienvenida() {
  const [abierta, setAbierta] = useState(true);
  const [silencio, setSilencio] = useState(true);
  const video = useRef<HTMLVideoElement>(null);
  const cerrarBtn = useRef<HTMLButtonElement>(null);

  const cerrar = () => {
    video.current?.pause();
    setAbierta(false);
  };

  useEffect(() => {
    if (!abierta) return;
    cerrarBtn.current?.focus();
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar();
    };
    document.addEventListener('keydown', tecla);
    return () => {
      document.body.style.overflow = previo;
      document.removeEventListener('keydown', tecla);
    };
  }, [abierta]);

  if (!abierta) return null;

  const activarSonido = () => {
    const v = video.current;
    if (!v) return;
    v.muted = false;
    v.currentTime = 0;
    v.play().catch(() => {});
    setSilencio(false);
  };

  return (
    <div className="video-bienvenida" role="dialog" aria-modal="true" aria-label="Vídeo de bienvenida" onClick={cerrar}>
      <div className="video-bienvenida-caja" onClick={(e) => e.stopPropagation()}>
        <button ref={cerrarBtn} type="button" className="video-bienvenida-cerrar" onClick={cerrar} aria-label="Cerrar el vídeo y ver la página">
          ✕
        </button>
        <video
          ref={video}
          src={VIDEO}
          poster={PORTADA}
          autoPlay
          muted={silencio}
          playsInline
          controls
          preload="auto"
          onVolumeChange={(e) => setSilencio(e.currentTarget.muted)}
        />
        {silencio && (
          <button type="button" className="video-bienvenida-sonido" onClick={activarSonido}>
            🔊 ACTIVAR SONIDO
          </button>
        )}
        <button type="button" className="btn video-bienvenida-continuar" onClick={cerrar}>
          EXPLORA LA PLATAFORMA →
        </button>
      </div>
    </div>
  );
}

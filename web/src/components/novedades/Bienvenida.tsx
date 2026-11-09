'use client';

import { useEffect, useState } from 'react';
import { NOVEDADES_API } from '@/lib/novedades';

// Lee el token del enlace personal (?t=…), lo valida contra la API y registra el
// «Sí». Sin token, o si la API falla, la página se ve igual con un saludo
// genérico: el contenido es público, lo personal es solo el saludo y el alta.

type Estado =
    | { tipo: 'anonimo' }
    | { tipo: 'alta'; nombre: string | null }
    | { tipo: 'baja' }
    | { tipo: 'invalido' };

export default function Bienvenida() {
    const [estado, setEstado] = useState<Estado>({ tipo: 'anonimo' });

    useEffect(() => {
        const t = new URLSearchParams(window.location.search).get('t');
        if (!t) return;
        fetch(`${NOVEDADES_API}/api/novedades/alta`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ t }),
        })
            .then(async (r) => {
                if (!r.ok) throw new Error(String(r.status));
                const j = (await r.json()) as { estado: 'alta' | 'baja'; nombre?: string | null };
                setEstado(j.estado === 'baja' ? { tipo: 'baja' } : { tipo: 'alta', nombre: j.nombre ?? null });
            })
            .catch(() => setEstado({ tipo: 'invalido' }));
    }, []);

    const saludo =
        estado.tipo === 'alta' && estado.nombre ? `Hola, ${estado.nombre}:` : 'Bienvenido/a al Centro de novedades';

    return (
        <div className="space-y-4">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider">
                Centro de novedades PRO CORP
            </span>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">{saludo}</h1>
            {estado.tipo === 'alta' && (
                <p className="text-sm text-emerald-300" role="status">
                    Gracias por su confirmación. A partir de ahora le avisaremos de las novedades que le interesen. Puede
                    darse de baja en cualquier momento desde el enlace de cada correo.
                </p>
            )}
            {estado.tipo === 'baja' && (
                <p className="text-sm text-secondary" role="status">
                    Su suscripción está dada de baja. Puede seguir consultando esta página cuando quiera.
                </p>
            )}
            {estado.tipo === 'invalido' && (
                <p className="text-sm text-amber-300" role="status">
                    No pudimos confirmar su enlace. Puede consultar igualmente toda la información de esta página.
                </p>
            )}
            <p className="text-secondary text-sm leading-relaxed max-w-3xl">
                Información práctica para las Elecciones Generales del 29 de noviembre, las cifras más recientes de
                nacionalidad española y los servicios con los que PRO CORP le acompaña.
            </p>
        </div>
    );
}

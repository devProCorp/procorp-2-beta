// Contenido del Centro de novedades (/centro-de-novedades/).
//
// Las fechas del proceso electoral salen del artículo del Journal «España irá a
// elecciones el 29 de noviembre» (Humberto Calderón, 2026-10-07), que cita el
// Real Decreto 806/2026 publicado en el BOE el 6 de octubre. No se añaden aquí
// plazos del voto exterior que no estén confirmados: el procedimiento concreto
// lo publica cada consulado.

// La lógica (validar el enlace personal, registrar el «Sí», la baja) vive en la
// API de inversion.pro-corp.net, porque esta web es una exportación estática.
export const NOVEDADES_API =
    process.env.NEXT_PUBLIC_NOVEDADES_API ?? 'https://inversion.pro-corp.net';

export const ARTICULO_ELECCIONES =
    '/blog/espana-convoca-elecciones-anticipadas-en-medio-de-crisis-politica/';
export const ARTICULO_TECNOLOGIA =
    '/blog/innovacion-empresarial-con-inteligencia-artificial-y-automatizacion/';

export interface Hito {
    fecha: string;
    titulo: string;
    detalle: string;
}

export const HITOS_ELECCIONES: Hito[] = [
    {
        fecha: '6 de octubre',
        titulo: 'Convocatoria en el BOE',
        detalle: 'Real Decreto 806/2026 de disolución de las Cortes Generales y convocatoria de elecciones.',
    },
    {
        fecha: '13 de noviembre',
        titulo: 'Empieza la campaña electoral',
        detalle: 'La campaña oficial se extiende hasta el 27 de noviembre.',
    },
    {
        fecha: '29 de noviembre',
        titulo: 'Jornada electoral',
        detalle: 'Elecciones Generales al Congreso de los Diputados y al Senado.',
    },
    {
        fecha: '23 de diciembre',
        titulo: 'Constitución de las nuevas Cortes',
        detalle: 'Las Cámaras elegidas inician la nueva legislatura.',
    },
];

export interface PasoVoto {
    titulo: string;
    texto: string;
}

export const PASOS_VOTO_EXTERIOR: PasoVoto[] = [
    {
        titulo: 'Compruebe que es elector',
        texto:
            'Para votar necesita tener la nacionalidad española inscrita en el Registro Civil y figurar en el censo electoral. Si reside fuera de España, ese censo es el CERA (Censo Electoral de Españoles Residentes Ausentes), al que se accede inscribiéndose como residente en su consulado.',
    },
    {
        titulo: 'Consulte el procedimiento de su consulado',
        texto:
            'Cada consulado publica las fechas y la forma de votar: por correo o de manera presencial en el consulado o en los centros habilitados. No espere al último momento.',
    },
    {
        titulo: 'Esté atento a la documentación electoral',
        texto:
            'La documentación puede llegar con retraso al domicilio. Si no la recibe a tiempo, póngase en contacto con su consulado cuanto antes.',
    },
];

export const ENLACES_OFICIALES = [
    { titulo: 'Oficina del Censo Electoral (INE)', url: 'https://www.ine.es/oficina_censo/' },
    { titulo: 'Ministerio de Asuntos Exteriores — consulados', url: 'https://www.exteriores.gob.es/' },
    { titulo: 'Boletín Oficial del Estado', url: 'https://www.boe.es/' },
];

export interface Servicio {
    clave: 'inversiones' | 'tecnologia' | 'legal';
    etiqueta: string;
    titulo: string;
    texto: string;
    accion: string;
    href: string;
    externo?: boolean;
}

export const SERVICIOS: Servicio[] = [
    {
        clave: 'legal',
        etiqueta: 'Legal y migratorio',
        titulo: 'Acompañamiento en sus trámites en España',
        texto:
            'Nacionalidad, residencia, extranjería y documentación. Un equipo que conoce los procedimientos y le avisa de los cambios que le afectan.',
        accion: 'Ver servicios legales',
        href: '/legal-solutions/',
    },
    {
        clave: 'inversiones',
        etiqueta: 'Inversiones',
        titulo: 'Proyectos de inversión seleccionados',
        texto:
            'Oportunidades de inversión con la información de cada proyecto, para valorarlas con calma y sin compromiso.',
        accion: 'Ver proyectos',
        href: '/projects/',
    },
    {
        clave: 'tecnologia',
        etiqueta: 'Tecnología e IA',
        titulo: 'Inteligencia Artificial y automatización para su empresa',
        texto:
            'Optimización de procesos, análisis financiero, contabilidad y gestión de riesgos para operar con más eficiencia y decidir con datos.',
        accion: 'Conocer la nueva línea',
        href: ARTICULO_TECNOLOGIA,
    },
];

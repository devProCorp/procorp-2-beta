// Datos de las Elecciones Generales del 29 de noviembre de 2026 (/elecciones-2026/).
//
// Fuente única: Real Decreto 806/2026, de 5 de octubre, de disolución del Congreso
// y del Senado y de convocatoria de elecciones (BOE núm. 248, 6/10/2026,
// BOE-A-2026-20742). El reparto de diputados es el anexo de ese decreto, copiado
// tal cual (52 circunscripciones, 350 escaños). Si el BOE publica una corrección,
// se cambia aquí y se anota la fecha en REVISADO.

export const REVISADO = '9 de noviembre de 2026';

export const CONVOCATORIA = {
  titulo:
    'Real Decreto 806/2026, de 5 de octubre, de disolución del Congreso de los Diputados y del Senado y de convocatoria de elecciones',
  boe: 'BOE núm. 248, de 6 de octubre de 2026',
  id: 'BOE-A-2026-20742',
  html: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-20742',
  pdf: 'https://www.boe.es/boe/dias/2026/10/06/pdfs/BOE-A-2026-20742.pdf',
};

export interface Hito {
  fecha: string;
  titulo: string;
  detalle: string;
}

// Artículos 2, 4 y 5 del Real Decreto 806/2026.
export const CALENDARIO: Hito[] = [
  { fecha: '6 de octubre', titulo: 'Convocatoria', detalle: 'Publicación del Real Decreto 806/2026 en el BOE y disolución de las Cortes.' },
  { fecha: '13 de noviembre', titulo: 'Empieza la campaña', detalle: 'La campaña electoral dura quince días: del viernes 13 al viernes 27 de noviembre.' },
  { fecha: '29 de noviembre', titulo: 'Jornada electoral', detalle: 'Elecciones al Congreso de los Diputados y al Senado.' },
  { fecha: '23 de diciembre', titulo: 'Nuevas Cortes', detalle: 'Sesiones constitutivas de las Cámaras, a las diez horas.' },
];

/** [circunscripción, diputados] — anexo del Real Decreto 806/2026. */
export const DIPUTADOS: [string, number][] = [
  ['Albacete', 4],
  ['Alicante/Alacant', 12],
  ['Almería', 6],
  ['Araba/Álava', 4],
  ['Asturias', 7],
  ['Ávila', 3],
  ['Badajoz', 5],
  ['Balears (Illes)', 8],
  ['Barcelona', 32],
  ['Bizkaia', 8],
  ['Burgos', 4],
  ['Cáceres', 4],
  ['Cádiz', 8],
  ['Cantabria', 5],
  ['Castellón/Castelló', 5],
  ['Ciudad Real', 5],
  ['Córdoba', 6],
  ['Coruña (A)', 8],
  ['Cuenca', 3],
  ['Gipuzkoa', 6],
  ['Girona', 6],
  ['Granada', 7],
  ['Guadalajara', 3],
  ['Huelva', 5],
  ['Huesca', 3],
  ['Jaén', 5],
  ['León', 4],
  ['Lleida', 4],
  ['Lugo', 4],
  ['Madrid', 38],
  ['Málaga', 11],
  ['Murcia', 10],
  ['Navarra', 5],
  ['Ourense', 4],
  ['Palencia', 3],
  ['Palmas (Las)', 8],
  ['Pontevedra', 7],
  ['Rioja (La)', 4],
  ['Salamanca', 4],
  ['Santa Cruz de Tenerife', 7],
  ['Segovia', 3],
  ['Sevilla', 12],
  ['Soria', 2],
  ['Tarragona', 6],
  ['Teruel', 3],
  ['Toledo', 6],
  ['Valencia/València', 16],
  ['Valladolid', 5],
  ['Zamora', 3],
  ['Zaragoza', 7],
  ['Ceuta', 1],
  ['Melilla', 1],
];

export const TOTAL_DIPUTADOS = DIPUTADOS.reduce((s, [, n]) => s + n, 0);
export const MAYORIA_ABSOLUTA = Math.floor(TOTAL_DIPUTADOS / 2) + 1;

// Artículo 3.2 del Real Decreto 806/2026.
export const SENADO =
  'En cada provincia se eligen cuatro senadores; en las islas, tres en Gran Canaria, Mallorca y Tenerife, y uno en Ibiza, Formentera, Menorca, Fuerteventura, La Gomera, El Hierro, Lanzarote y La Palma. Ceuta y Melilla eligen dos cada una.';

export const FUENTES_OFICIALES = [
  { titulo: 'Boletín Oficial del Estado', detalle: 'Convocatoria, candidaturas y resoluciones', url: 'https://www.boe.es/' },
  { titulo: 'Junta Electoral Central', detalle: 'Acuerdos e instrucciones del proceso', url: 'https://www.juntaelectoralcentral.es/' },
  { titulo: 'Oficina del Censo Electoral (INE)', detalle: 'Censo y voto de residentes en el exterior', url: 'https://www.ine.es/oficina_censo/' },
  { titulo: 'Ministerio de Asuntos Exteriores', detalle: 'Consulados y voto desde el extranjero', url: 'https://www.exteriores.gob.es/' },
];

// Temas del comparador de programas. Se activará cuando cada propuesta tenga
// partido, documento fuente, fecha y página revisados por el equipo.
export const TEMAS_PROGRAMAS = [
  'Economía y fiscalidad',
  'Vivienda e inmobiliario',
  'Inteligencia artificial y tecnología',
  'Empleo',
  'Energía y sostenibilidad',
  'Inversión extranjera',
  'Inmigración y extranjería',
];

// Frases que identifican en el sumario del BOE las publicaciones de ESTAS elecciones.
// Nada genérico («junta electoral», «candidaturas»): el BOE publica a diario
// sustituciones de concejales y otros procesos locales que no tienen que ver.
export const PALABRAS_BOE = [
  '806/2026',
  'elecciones generales',
  'elecciones al congreso de los diputados',
  'congreso de los diputados y al senado',
  'congreso de los diputados y del senado',
  'elecciones a cortes generales',
];

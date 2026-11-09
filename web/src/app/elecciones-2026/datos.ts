// Contenido de la landing de las Elecciones Generales 2026 (/elecciones-2026/).
// Pedido de Innovación (Lina Díaz, 2026-11-09): el «Panorama electoral» se alimenta
// de La Moncloa, el Senado y RTVE; el comparador, del listado del Senado. Cada bloque
// cita su fuente. Revisado el 9 de noviembre de 2026: si una fuente cambia, se
// actualiza aquí y la fecha de REVISADO.

export const REVISADO = '9 de noviembre de 2026';

export const FUENTES = {
  moncloa: {
    titulo: 'La Moncloa — Elecciones en España: qué son los procesos electorales y cuáles son sus etapas (5/10/2026)',
    url: 'https://www.lamoncloa.gob.es/paginas/informacion/que-son-los-procesos-electorales.aspx',
  },
  senadoPartidos: {
    titulo: 'Senado de España — Grupos parlamentarios y partidos políticos',
    url: 'https://www.senado.es/web/composicionorganizacion/gruposparlamentarios/PartidosPoliticos/index.html',
  },
  senadoProgramas: {
    titulo: 'Senado de España — Programas electorales de los partidos políticos representados en el Senado',
    url: 'https://www.senado.es/web/composicionorganizacion/gruposparlamentarios/programaselectoralespartidos/index.html',
  },
  rtve: {
    titulo: 'RTVE — Elecciones generales 2026: calendario y fechas clave de los comicios (19/10/2026)',
    url: 'https://www.rtve.es/noticias/20261019/cuando-son-elecciones-generales-calendario-fechas-clave/17269230.shtml',
  },
  boe: {
    titulo: 'BOE — Real Decreto 806/2026, de disolución de las Cortes y convocatoria de elecciones',
    url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-20742',
  },
};

// La Moncloa y Real Decreto 806/2026.
export const QUE_SE_ELIGE =
  'En las elecciones generales se elige a los representantes en las Cortes Generales: el Congreso de los Diputados (350 escaños en 52 circunscripciones) y el Senado. El derecho de sufragio está recogido en el artículo 23 de la Constitución y es universal, igual, directo, secreto y libre; el voto no es obligatorio.';

// La Moncloa.
export const ETAPAS = [
  { titulo: 'Convocatoria', texto: 'El decreto de convocatoria fija la fecha de la votación y los plazos de todo el proceso.' },
  { titulo: 'Candidaturas', texto: 'Se presentan entre los días 15 y 20 siguientes a la convocatoria y las Juntas Electorales las proclaman el día 27.' },
  { titulo: 'Campaña electoral', texto: 'Dura 15 días y termina a las 00:00 del día anterior a la votación. Después llega la jornada de reflexión, en la que no se puede pedir el voto.' },
  { titulo: 'Votación', texto: 'Los colegios electorales abren de 9 a 20 horas.' },
  { titulo: 'Escrutinio', texto: 'Cada mesa cuenta los votos al cierre (escrutinio provisional). Cinco días después, las Juntas Electorales provinciales hacen el escrutinio general, que incorpora el voto de los españoles residentes en el extranjero (CERA).' },
  { titulo: 'Resultados', texto: 'El proceso termina con la publicación de los resultados oficiales y las candidaturas electas en el BOE.' },
];

// La Moncloa.
export const QUIEN_VOTA = [
  'Pueden votar las personas con nacionalidad española que tengan 18 años cumplidos el día de la votación y estén inscritas en el censo electoral.',
  'Quien reside de forma permanente en el extranjero vota en las elecciones generales a través del voto CERA; quien está fuera temporalmente, con el voto ERTA.',
  'Las personas extranjeras sin nacionalidad española no votan en las elecciones generales.',
];

// RTVE (19/10/2026), salvo lo marcado como Real Decreto 806/2026.
export const CALENDARIO = [
  { fecha: '6 de octubre', texto: 'Publicación en el BOE del Real Decreto 806/2026: disolución de las Cortes y convocatoria.' },
  { fecha: '16 de octubre', texto: 'Fin del plazo para comunicar las coaliciones electorales.' },
  { fecha: '21–26 de octubre', texto: 'Presentación de las listas al Congreso y al Senado ante las Juntas Electorales Provinciales.' },
  { fecha: '28 de octubre', texto: 'Publicación en el BOE de las candidaturas presentadas.' },
  { fecha: '31 de octubre', texto: 'Último día para solicitar el voto de los residentes en España que están temporalmente fuera (ERTA).' },
  { fecha: '31 oct – 4 nov', texto: 'Sorteo de los miembros de las mesas electorales.' },
  { fecha: '2 de noviembre', texto: 'Proclamación de las candidaturas por las Juntas Electorales Provinciales.' },
  { fecha: '3 de noviembre', texto: 'Publicación en el BOE de las candidaturas proclamadas.' },
  { fecha: '2–10 de noviembre', texto: 'Envío de las tarjetas censales con el colegio y la mesa de cada elector.' },
  { fecha: '9 de noviembre', texto: 'Comienza el envío de la documentación del voto por correo.' },
  { fecha: '13–27 de noviembre', texto: 'Campaña electoral.' },
  { fecha: '19 de noviembre', texto: 'Último día para solicitar el voto por correo en España.' },
  { fecha: '21–26 de noviembre', texto: 'Voto en urna en los consulados para los españoles residentes en el extranjero (CERA).', destacado: true },
  { fecha: '23 de noviembre', texto: 'Último día para publicar encuestas.' },
  { fecha: '24 de noviembre', texto: 'Último día para que los electores CERA envíen su voto por correo postal.', destacado: true },
  { fecha: '25 de noviembre', texto: 'Último día para enviar el voto por correo en España.' },
  { fecha: '28 de noviembre', texto: 'Jornada de reflexión.' },
  { fecha: '29 de noviembre', texto: 'Jornada electoral. Los colegios cierran a las 20:00.', destacado: true },
  { fecha: '4 de diciembre', texto: 'Escrutinio general, que incluye el voto CERA.' },
  { fecha: '7 de diciembre', texto: 'Fecha máxima para concluir el escrutinio general.' },
  { fecha: '23 de diciembre', texto: 'Sesiones constitutivas del Congreso y del Senado, a las 10:00 (Real Decreto 806/2026).' },
];

// Senado — grupos parlamentarios de la legislatura disuelta el 6/10/2026.
export const GRUPOS_SENADO = [
  'Grupo Parlamentario Popular en el Senado',
  'Grupo Parlamentario Socialista',
  'Grupo Parlamentario Izquierdas por la Independencia (Esquerra Republicana – Euskal Herria Bildu)',
  'Grupo Parlamentario Plural en el Senado (Junts per Catalunya – Coalición Canaria – Agrupación Herreña Independiente – Bloque Nacionalista Galego)',
  'Grupo Parlamentario Vasco en el Senado (EAJ-PNV)',
  'Grupo Parlamentario Izquierda Confederal (Más Madrid, Eivissa i Formentera al Senat, Compromís, Agrupación Socialista Gomera y Geroa Bai)',
  'Grupo Parlamentario Mixto',
];

// Senado — partidos representados, en el orden de su página, con la web a la que enlaza.
export const PARTIDOS = [
  { nombre: 'Agrupación Herreña Independiente (AHI)', web: 'https://ahi-elhierro.es/' },
  { nombre: 'Agrupación Socialista Gomera (ASG)', web: 'https://www.agrupacionsocialistagomera.es/' },
  { nombre: 'Bloque Nacionalista Galego (BNG)', web: 'https://www.bng.gal/' },
  { nombre: 'Coalición Canaria', web: 'https://coalicioncanaria.org/' },
  { nombre: 'Compromís', web: 'https://compromis.net/' },
  { nombre: 'Esquerra Republicana', web: 'https://www.esquerra.cat/ca/inici' },
  { nombre: 'EH Bildu', web: 'https://ehbildu.eus/es' },
  { nombre: 'Euzko Alderdi Jeltzalea – Partido Nacionalista Vasco (EAJ-PNV)', web: 'https://www.eaj-pnv.eus/es/' },
  { nombre: 'Geroa Bai (GBAI)', web: 'https://geroabai.eus/es' },
  { nombre: 'Junts per Catalunya (JUNTS)', web: 'https://junts.cat/' },
  { nombre: 'Más Madrid', web: 'https://masmadrid.org/' },
  { nombre: 'Partido Popular (PP)', web: 'https://www.pp.es/' },
  { nombre: 'Partido Socialista Obrero Español (PSOE)', web: 'https://www.psoe.es/' },
  { nombre: 'Unión del Pueblo Navarro (UPN)', web: 'https://upn.org/' },
  { nombre: 'VOX', web: 'https://www.voxespana.es/' },
];

// Categorías de investment_projects que se ofrecen en el explorador (las mismas de
// inversion.pro-corp.net). «Predios» y «Legal» no son oportunidades de inversión.
export const SECTORES = [
  'Inmobiliario',
  'Activos regularizados',
  'Energía',
  'Agroindustrial',
  'Fin tech',
  'Immersive Education',
  'Otros mercados',
];

export const HERRAMIENTAS = [
  {
    titulo: 'Diagnóstico de inversión',
    texto: 'Responde unas preguntas y recibe tu perfil de riesgo y los proyectos abiertos de los sectores que te interesan. Si promueves un proyecto, mide su preparación para captar inversión.',
    accion: 'Hacer el diagnóstico',
    url: 'https://inversion.pro-corp.net/es/diagnostico',
  },
  {
    titulo: 'Catálogo de proyectos',
    texto: 'Todos los proyectos de inversión estructurados por PRO CORP, con su información y el estado de cada uno.',
    accion: 'Ver proyectos',
    url: '/projects/',
  },
  {
    titulo: 'Portales privados con simulador',
    texto: 'Proyectos como Yariguíes, Geely o Traventto tienen portal privado con simulador financiero y el asistente LIA para resolver dudas sobre las cifras. El acceso se solicita desde cada proyecto.',
    accion: 'Solicitar acceso',
    url: 'https://inversion.pro-corp.net/',
  },
  {
    titulo: 'Predios',
    texto: 'Si tienes un lote o predio, publícalo y te contactamos si es viable para un desarrollo PRO CORP.',
    accion: 'Publicar un predio',
    url: 'https://predios.pro-corp.net/',
  },
];

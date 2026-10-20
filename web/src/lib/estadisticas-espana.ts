// Estadísticas de nacionalidad española publicadas por el Ministerio de Justicia
// (https://www.mjusticia.gob.es/es/ciudadania/nacionalidad/estadisticas-datos-basicos).
//
// El Ministerio publica un PDF por trimestre y sólo mantiene en línea el último;
// la serie trimestral de la Ley 12/2015 se reconstruyó con la tabla del gráfico
// de Datawrapper de la página WordPress (jun 2020 – mar 2023) y los PDF
// archivados en web.archive.org (dic 2023 en adelante). Jun y sep 2023 no están
// archivados. Al salir un PDF nuevo: añadir su fila a `SEFARDIES_TRIMESTRAL` y
// sustituir el resto de bloques por los del PDF.

export const FECHA_CORTE = '30/06/2026';
export const PDF_URL =
  'https://www.mjusticia.gob.es/es/Ciudadano/Nacionalidad/Documents/Estadisticas%20nacionalidad%2030-06-2026.pdf';
export const FUENTE_URL =
  'https://www.mjusticia.gob.es/es/ciudadania/nacionalidad/estadisticas-datos-basicos';

export type Serie = { clave: string; nombre: string; valores: (number | null)[] };

// ── 1. Nacionalidad por residencia ───────────────────────────────────────────

export const RESIDENCIA_ANIOS = ['2021', '2022', '2023', '2024', '2025', '2026*'];

export const RESIDENCIA: Serie[] = [
  { clave: 'solicitudes', nombre: 'Solicitudes', valores: [146986, 171330, 199710, 246667, 296923, 144026] },
  { clave: 'concesiones', nombre: 'Concesiones', valores: [187480, 121892, 242374, 221466, 221284, 134116] },
  { clave: 'denegaciones', nombre: 'Denegaciones', valores: [8450, 7077, 7400, 20099, 24910, 13385] },
  { clave: 'archivados', nombre: 'Archivados', valores: [6528, 1174, 7144, 10784, 10025, 3436] },
  { clave: 'resoluciones', nombre: 'Total resoluciones', valores: [202458, 130143, 256918, 252349, 256219, 150937] },
];

export const RESIDENCIA_TOTALES = {
  solicitudes: 1205642,
  concesiones: 1128612,
  denegaciones: 81321,
  resoluciones: 1249024,
  pendientes: 251223,
};

export const PENDIENTES_ANIOS = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'];

export const PENDIENTES: Serie[] = [
  {
    clave: 'pendientes',
    nombre: 'Expedientes pendientes',
    valores: [6, 10, 12, 25, 50, 151, 1570, 1909, 4745, 8970, 90120, 143655],
  },
];

// ── 2. Ley 12/2015 — sefardíes originarios de España ─────────────────────────

export const SEFARDIES_GLOBAL = {
  recibidasNotariado: 153774,
  recibidasDGSJFP: 89094,
  resueltas: 81225,
  concesiones: 73019,
  denegaciones: 7345,
  archivos: 861,
  concesionesRecursoAlzada: 1314,
  concesionesSentencia: 164,
  concesionesRevocacion: 3,
  pendientes: 7869,
};

const TRIMESTRAL: [string, number, number, number, number, number, number][] = [
  // [trimestre, recibidas DGSJFP, resoluciones, concesiones, denegaciones, archivos, pendientes]
  ['Jun 2020', 50374, 12055, 12053, 2, 3, 38316],
  ['Sep 2020', 52039, 15700, 15688, 2, 10, 36339],
  ['Dic 2020', 53882, 21233, 21215, 3, 15, 32649],
  ['Mar 2021', 55097, 27905, 27651, 236, 18, 27192],
  ['Jun 2021', 59123, 36018, 33485, 2512, 21, 23105],
  ['Sep 2021', 70323, 41201, 38155, 2980, 24, 29122],
  ['Dic 2021', 78513, 43668, 40618, 3025, 25, 34845],
  ['Mar 2022', 81107, 44921, 41838, 3052, 31, 36186],
  ['Jun 2022', 83484, 45186, 42636, 2519, 31, 37710],
  ['Sep 2022', 84451, 65809, 62033, 3746, 30, 18642],
  ['Dic 2022', 85282, 69055, 64702, 4318, 35, 16228],
  ['Mar 2023', 87061, 70756, 65515, 5206, 35, 16305],
  ['Dic 2023', 88113, 78889, 71882, 6942, 65, 9224],
  ['Mar 2024', 88237, 78995, 71926, 7004, 65, 9242],
  ['Jun 2024', 88391, 79136, 72011, 7061, 64, 9254],
  ['Sep 2024', 88507, 79179, 72073, 7106, 64, 9263],
  ['Dic 2024', 88813, 79452, 72199, 7189, 64, 9361],
  ['Mar 2025', 88869, 79518, 72209, 7245, 64, 9351],
  ['Jun 2025', 88951, 79614, 72297, 7252, 65, 9337],
  ['Sep 2025', 89008, 80374, 73017, 7292, 65, 8634],
  ['Dic 2025', 89047, 80425, 73018, 7340, 67, 8622],
  ['Mar 2026', 89078, 81222, 73017, 7344, 861, 7856],
  ['Jun 2026', 89094, 81225, 73019, 7345, 861, 7869],
];

export const SEFARDIES_TRIMESTRES = TRIMESTRAL.map((f) => f[0]);

const columna = (i: number) => TRIMESTRAL.map((f) => f[i] as number);

// Mismas series y orden que el gráfico de la página WordPress.
export const SEFARDIES_TRIMESTRAL: Serie[] = [
  { clave: 'notariado', nombre: 'Recibidas en el Consejo General del Notariado', valores: TRIMESTRAL.map(() => 153774) },
  { clave: 'dgsjfp', nombre: 'Recibidas en la DGSJFP', valores: columna(1) },
  { clave: 'resoluciones', nombre: 'Resoluciones', valores: columna(2) },
  { clave: 'concesiones', nombre: 'Concesiones', valores: columna(3) },
  { clave: 'denegaciones', nombre: 'Denegaciones', valores: columna(4) },
  { clave: 'archivos', nombre: 'Archivos', valores: columna(5) },
  { clave: 'pendientes', nombre: 'Pendientes en la DGSJFP', valores: columna(6) },
];

export type PaisSefardi = { pais: string; concesiones: number; solicitantes: number };

export const SEFARDIES_PAISES: PaisSefardi[] = [
  { pais: "México", concesiones: 23875, solicitantes: 26989 },
  { pais: "Colombia", concesiones: 18594, solicitantes: 21259 },
  { pais: "Venezuela", concesiones: 9239, solicitantes: 15198 },
  { pais: "Argentina", concesiones: 5224, solicitantes: 5733 },
  { pais: "Israel", concesiones: 3954, solicitantes: 4098 },
  { pais: "Estados Unidos", concesiones: 2366, solicitantes: 3646 },
  { pais: "Panamá", concesiones: 2074, solicitantes: 2345 },
  { pais: "Ecuador", concesiones: 1441, solicitantes: 1586 },
  { pais: "Turquía", concesiones: 1034, solicitantes: 1268 },
  { pais: "Brasil", concesiones: 1115, solicitantes: 1167 },
  { pais: "Perú", concesiones: 624, solicitantes: 1083 },
  { pais: "Chile", concesiones: 664, solicitantes: 762 },
  { pais: "Costa Rica", concesiones: 324, solicitantes: 488 },
  { pais: "Uruguay", concesiones: 379, solicitantes: 408 },
  { pais: "El Salvador", concesiones: 19, solicitantes: 362 },
  { pais: "República Dominicana", concesiones: 246, solicitantes: 358 },
  { pais: "Canadá", concesiones: 252, solicitantes: 307 },
  { pais: "Francia", concesiones: 288, solicitantes: 302 },
  { pais: "Guatemala", concesiones: 148, solicitantes: 292 },
  { pais: "Reino Unido", concesiones: 246, solicitantes: 275 },
  { pais: "Marruecos", concesiones: 236, solicitantes: 241 },
  { pais: "Serbia", concesiones: 161, solicitantes: 171 },
  { pais: "Bolivia", concesiones: 16, solicitantes: 91 },
  { pais: "Rusia", concesiones: 38, solicitantes: 87 },
  { pais: "Cuba", concesiones: 52, solicitantes: 64 },
  { pais: "Honduras", concesiones: 31, solicitantes: 56 },
  { pais: "Bosnia y Herzegovina", concesiones: 49, solicitantes: 52 },
  { pais: "Australia", concesiones: 37, solicitantes: 41 },
  { pais: "Italia", concesiones: 38, solicitantes: 39 },
  { pais: "Grecia", concesiones: 34, solicitantes: 35 },
  { pais: "Túnez", concesiones: 30, solicitantes: 31 },
  { pais: "Suiza", concesiones: 27, solicitantes: 30 },
  { pais: "Nicaragua", concesiones: 0, solicitantes: 29 },
  { pais: "Paraguay", concesiones: 18, solicitantes: 20 },
  { pais: "Bulgaria", concesiones: 18, solicitantes: 19 },
  { pais: "Macedonia", concesiones: 19, solicitantes: 19 },
  { pais: "Puerto Rico", concesiones: 9, solicitantes: 13 },
  { pais: "Jordania", concesiones: 0, solicitantes: 12 },
  { pais: "Rumania", concesiones: 10, solicitantes: 11 },
  { pais: "Sudáfrica", concesiones: 11, solicitantes: 11 },
  { pais: "Alemania", concesiones: 5, solicitantes: 7 },
  { pais: "Palestina", concesiones: 7, solicitantes: 7 },
  { pais: "Bélgica", concesiones: 5, solicitantes: 6 },
  { pais: "Irlanda", concesiones: 5, solicitantes: 5 },
  { pais: "Zimbabue", concesiones: 5, solicitantes: 5 },
  { pais: "Hungría", concesiones: 3, solicitantes: 4 },
  { pais: "Polonia", concesiones: 3, solicitantes: 4 },
  { pais: "Portugal", concesiones: 4, solicitantes: 4 },
  { pais: "Ucrania", concesiones: 4, solicitantes: 4 },
  { pais: "Egipto", concesiones: 3, solicitantes: 3 },
  { pais: "Guinea", concesiones: 2, solicitantes: 3 },
  { pais: "Líbano", concesiones: 2, solicitantes: 3 },
  { pais: "Nueva Zelanda", concesiones: 3, solicitantes: 3 },
  { pais: "Suecia", concesiones: 3, solicitantes: 3 },
  { pais: "Armenia", concesiones: 0, solicitantes: 2 },
  { pais: "Barbados", concesiones: 2, solicitantes: 2 },
  { pais: "Bielorrusia", concesiones: 1, solicitantes: 2 },
  { pais: "Cabo Verde", concesiones: 2, solicitantes: 2 },
  { pais: "Croacia", concesiones: 2, solicitantes: 2 },
  { pais: "Islandia", concesiones: 2, solicitantes: 2 },
  { pais: "Japón", concesiones: 2, solicitantes: 2 },
  { pais: "Kazajistán", concesiones: 1, solicitantes: 2 },
  { pais: "Malta", concesiones: 2, solicitantes: 2 },
  { pais: "Trinidad y Tobago", concesiones: 0, solicitantes: 2 },
  { pais: "Argelia", concesiones: 0, solicitantes: 1 },
  { pais: "Eslovaquia", concesiones: 1, solicitantes: 1 },
  { pais: "Gabón", concesiones: 1, solicitantes: 1 },
  { pais: "Georgia", concesiones: 1, solicitantes: 1 },
  { pais: "Jamaica", concesiones: 1, solicitantes: 1 },
  { pais: "Kenia", concesiones: 0, solicitantes: 1 },
  { pais: "Letonia", concesiones: 1, solicitantes: 1 },
  { pais: "Mauritania", concesiones: 1, solicitantes: 1 },
  { pais: "Mónaco", concesiones: 1, solicitantes: 1 },
  { pais: "Pais No Reconocido", concesiones: 0, solicitantes: 1 },
  { pais: "Países Bajos", concesiones: 1, solicitantes: 1 },
  { pais: "San Cristóbal y Nieves", concesiones: 0, solicitantes: 1 },
  { pais: "Sudán", concesiones: 1, solicitantes: 1 },
  { pais: "Tailandia", concesiones: 1, solicitantes: 1 },
  { pais: "Tuvalu", concesiones: 1, solicitantes: 1 },
];

// ── 3. Cartas de naturaleza (art. 21 del Código Civil) ───────────────────────

export const CARTAS_ANIOS = ['2021', '2022', '2023', '2024', '2025', '2026*'];

export const CARTAS: Serie[] = [
  { clave: 'solicitudes', nombre: 'Solicitudes por año de entrada', valores: [390, 732, 792, 939, 1746, 724] },
  { clave: 'concesiones', nombre: 'Concesiones por año de resolución', valores: [11, 17, 110, 61, 35, 2] },
];

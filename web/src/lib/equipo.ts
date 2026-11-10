// Gerentes de PRO CORP para la sección «Nuestro equipo» de /about (pedido de Javier
// Jaramillo, 2026-11-10: «un nombre visible, una cara visible»). Contenido tomado de
// la página de WordPress pro-corp.net/equipo/; fotos en public/equipo/ recortadas a
// 4:5 desde los originales de esa página.

type Texto = { es: string; en: string; pt: string };

export interface Gerente {
  nombre: string;
  foto: string;
  cargo: Texto;
  formacion: Texto;
  idiomas: Texto;
}

export const GERENTES: Gerente[] = [
  {
    nombre: 'Javier Jaramillo Sanmiguel',
    foto: '/equipo/javier-jaramillo.jpg',
    cargo: { es: 'Socio fundador y presidente', en: 'Founding partner and President', pt: 'Sócio fundador e presidente' },
    formacion: {
      es: 'Abogado de la Pontificia Universidad Javeriana (Bogotá, Colombia), con una maestría en Derecho (LL.M.) en Resolución de Conflictos Internacionales del Institute of International and Development Studies – Universidad de Ginebra (Suiza).',
      en: 'Lawyer from Pontificia Universidad Javeriana (Bogotá, Colombia), with a Master of Laws (LL.M.) in International Dispute Settlement from the Graduate Institute of International and Development Studies – University of Geneva (Switzerland).',
      pt: 'Advogado pela Pontificia Universidad Javeriana (Bogotá, Colômbia), com mestrado em Direito (LL.M.) em Resolução de Conflitos Internacionais pelo Institute of International and Development Studies – Universidade de Genebra (Suíça).',
    },
    idiomas: { es: 'Español, inglés y francés', en: 'Spanish, English and French', pt: 'Espanhol, inglês e francês' },
  },
  {
    nombre: 'Luis Sanmiguel Valderrama',
    foto: '/equipo/luis-sanmiguel.jpg',
    cargo: { es: 'Socio fundador y Chairman', en: 'Founding partner and Chairman', pt: 'Sócio fundador e Chairman' },
    formacion: {
      es: 'Ingeniero de la Universidad Javeriana (Bogotá, Colombia), con posgrados en Dinámica de Negocios del MIT, Juntas Directivas Corporativas de Harvard, y Marketing y Planificación Estratégica de Texas A&M (EE. UU.).',
      en: 'Engineer from Universidad Javeriana (Bogotá, Colombia), with postgraduate studies in Business Dynamics at MIT, Corporate Boards at Harvard, and Marketing and Strategic Planning at Texas A&M (USA).',
      pt: 'Engenheiro pela Universidad Javeriana (Bogotá, Colômbia), com pós-graduações em Dinâmica de Negócios no MIT, Conselhos de Administração em Harvard e Marketing e Planejamento Estratégico na Texas A&M (EUA).',
    },
    idiomas: { es: 'Español e inglés', en: 'Spanish and English', pt: 'Espanhol e inglês' },
  },
  {
    nombre: 'Mauricio Sanmiguel Valderrama',
    foto: '/equipo/mauricio-sanmiguel.jpg',
    cargo: { es: 'Director financiero', en: 'Chief Financial Officer', pt: 'Diretor financeiro' },
    formacion: {
      es: 'Ingeniero de la Universidad de los Andes (Bogotá, Colombia), MBA de INALDE Business School, con estudios en Administración de Negocios en Stanford (EE. UU.) y el TEC de Monterrey (México).',
      en: 'Engineer from Universidad de los Andes (Bogotá, Colombia), MBA from INALDE Business School, with Business Administration studies at Stanford (USA) and TEC de Monterrey (Mexico).',
      pt: 'Engenheiro pela Universidad de los Andes (Bogotá, Colômbia), MBA pela INALDE Business School, com estudos em Administração de Empresas em Stanford (EUA) e no TEC de Monterrey (México).',
    },
    idiomas: { es: 'Español e inglés', en: 'Spanish and English', pt: 'Espanhol e inglês' },
  },
  {
    nombre: 'Carina Vicente Correia',
    foto: '/equipo/carina-correia.jpg',
    cargo: { es: 'Gerente del área legal en Portugal', en: 'Head of Legal, Portugal', pt: 'Gerente da área jurídica em Portugal' },
    formacion: {
      es: 'Abogada colegiada en la Ordem dos Advogados de Portugal, con maestría en Derecho de la Universidad Lusófona (Lisboa, Portugal).',
      en: 'Lawyer admitted to the Portuguese Bar Association (Ordem dos Advogados), with a Master’s in Law from Universidade Lusófona (Lisbon, Portugal).',
      pt: 'Advogada inscrita na Ordem dos Advogados de Portugal, com mestrado em Direito pela Universidade Lusófona (Lisboa, Portugal).',
    },
    idiomas: { es: 'Portugués, español, inglés y alemán', en: 'Portuguese, Spanish, English and German', pt: 'Português, espanhol, inglês e alemão' },
  },
];

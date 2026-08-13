'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type Language = 'en' | 'es' | 'pt';

interface LanguageContextType {
    lang: Language;
    toggleLang: () => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function useLanguage() {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
    return ctx;
}

// ─── TRANSLATIONS ───────────────────────────────────────────────
const translations: Record<string, Partial<Record<Language, string>>> = {

    // ── Navbar ──
    'nav.home': { en: 'Home', es: 'Inicio', pt: 'Início' },
    'nav.blog': { en: 'Blog', es: 'Blog', pt: 'Blog' },
    'nav.legal': { en: 'Legal Solutions', es: 'Soluciones Legales', pt: 'Soluções Legais' },
    'nav.growth': { en: 'Sustainable Growth - BPA', es: 'Crecimiento Sostenible - BPA', pt: 'Crescimento Sustentável - BPA' },
    'nav.about': { en: 'About Us', es: 'Sobre Nosotros', pt: 'Sobre Nós' },
    'nav.contact': { en: 'Contact', es: 'Contacto', pt: 'Contato' },
    'nav.login': { en: 'Login', es: 'Login', pt: 'Login' },
    'nav.services': { en: 'Services', es: 'Servicios', pt: 'Serviços' },
    'nav.journal': { en: 'Journal', es: 'Blog', pt: 'Blog' },

    // ── ScrollHero ──
    'hero.label': { en: 'Technology-Based Orchestration', es: 'Orquestación Basada en Tecnología', pt: 'Orquestração Baseada em Tecnologia' },
    'hero.title.1': { en: 'We design', es: 'Diseñamos', pt: 'Desenhamos' },
    'hero.title.accent1': { en: 'structure.', es: 'estructura.', pt: 'estrutura.' },
    'hero.title.2': { en: 'We orchestrate', es: 'Orquestamos', pt: 'Orquestramos' },
    'hero.title.accent2': { en: 'execution.', es: 'ejecución.', pt: 'execução.' },
    'hero.title.3': { en: 'Automation meets architecture.', es: 'Automatización y arquitectura.', pt: 'Automação encontra arquitetura.' },
    'hero.scroll': { en: 'Scroll to Explore', es: 'Desplázate para explorar', pt: 'Role para Explorar' },

    // ── ScrollHero Phase 2 ──
    'hero.manifesto.label': { en: 'What We Are / Since 2008', es: 'Quiénes Somos / Desde 2008', pt: 'O Que Somos / Desde 2008' },
    'hero.manifesto.text': {
        en: 'Pro Corp redesigns operating models, automates execution, and integrates assets, capital, and expertise through a transparent exchange platform.',
        es: 'Pro Corp rediseña modelos operativos, automatiza la ejecución e integra activos, capital y expertise a través de una plataforma de intercambio transparente.', pt: 'A Pro Corp redesenha modelos operacionais, automatiza a execução e integra ativos, capital e expertise por meio de uma plataforma de intercâmbio transparente.'
    },
    'hero.manifesto.sub': {
        en: 'Not a consulting firm. Not a software house. We do both — re-engineering and execution — amplified by intelligent marketing systems.',
        es: 'No somos una consultora. No somos una casa de software. Hacemos ambas cosas — reingeniería y ejecución — amplificadas por sistemas inteligentes de marketing.', pt: 'Não somos uma consultoria. Não somos uma software house. Fazemos ambos — reengenharia e execução — amplificados por sistemas inteligentes de marketing.'
    },

    // ── ScrollHero Phase 3 (Features) ──
    'hero.f1.title': { en: 'Legal Solutions', es: 'Soluciones Legales', pt: 'Soluções Legais' },
    'hero.f1.desc': {
        en: 'Structured governance frameworks, risk architecture, cross-border structuring, and compliance workflows — enhanced through automation.',
        es: 'Marcos de gobernanza estructurados, arquitectura de riesgo, estructuración transfronteriza y flujos de cumplimiento — potenciados por automatización.', pt: 'Estruturas de governança, arquitetura de risco, estruturação internacional e fluxos de compliance — potencializados pela automação.'
    },
    'hero.f2.title': { en: 'Sustainable Growth - BPA', es: 'Crecimiento Sostenible - BPA', pt: 'Crescimento Sustentável - BPA' },
    'hero.f2.desc': {
        en: 'Operating model redesign, KPI systems, financial simulators, and ongoing operational involvement. We stay in the game.',
        es: 'Rediseño de modelos operativos, sistemas KPI, simuladores financieros e involucramiento operacional continuo. Permanecemos en el juego.', pt: 'Redesenho do modelo operacional, sistemas de KPIs, simuladores financeiros e envolvimento operacional contínuo. Permanecemos no jogo.'
    },
    'hero.f3.title': { en: 'IP2$ Engineering', es: 'IP2$ Ingeniería', pt: 'Engenharia IP2$' },
    'hero.f3.desc': {
        en: 'Proprietary systems: conversational financial simulators, AI interfaces, marketing automation engines, and platform architecture.',
        es: 'Sistemas propietarios: simuladores financieros conversacionales, interfaces IA, motores de automatización de marketing y arquitectura de plataforma.', pt: 'Sistemas proprietários: simuladores financeiros conversacionais, interfaces de IA, motores de automação de marketing e arquitetura de plataforma.'
    },

    // ── Manifesto ──
    'manifesto.label.side': { en: 'ORCHESTRATION / SINCE 2008', es: 'ORQUESTACIÓN / DESDE 2008', pt: 'ORQUESTRAÇÃO / DESDE 2008' },
    'manifesto.label': { en: 'Technology-Based Orchestration', es: 'Orquestación Basada en Tecnología', pt: 'Orquestração Baseada em Tecnologia' },
    'manifesto.title.1': { en: 'We design', es: 'Diseñamos', pt: 'Desenhamos' },
    'manifesto.title.accent1': { en: 'structure.', es: 'estructura.', pt: 'estrutura.' },
    'manifesto.title.2': { en: 'We orchestrate', es: 'Orquestamos', pt: 'Orquestramos' },
    'manifesto.title.accent2': { en: 'execution.', es: 'ejecución.', pt: 'execução.' },
    'manifesto.title.3': { en: 'Automation meets architecture.', es: 'Automatización y arquitectura.', pt: 'Automação encontra arquitetura.' },
    'manifesto.text': {
        en: 'Pro Corp redesigns operating models, automates execution, and integrates assets, capital, and expertise through a transparent exchange platform — amplified by intelligent marketing systems.',
        es: 'Pro Corp rediseña modelos operativos, automatiza la ejecución e integra activos, capital y expertise a través de una plataforma de intercambio transparente — amplificada por sistemas inteligentes de marketing.', pt: 'A Pro Corp redesenha modelos operacionais, automatiza a execução e integra ativos, capital e expertise por meio de uma plataforma de intercâmbio transparente — amplificada por sistemas inteligentes de marketing.'
    },
    'manifesto.p1': {
        en: 'Not a consulting firm. Not a software house. Not a marketplace. We re-engineer processes and implement them through scalable cloud architecture — then amplify through automated marketing systems.',
        es: 'No somos una consultora. No somos una casa de software. No somos un marketplace. Reingenieramos procesos y los implementamos a través de arquitectura cloud escalable — y luego amplificamos con sistemas automatizados de marketing.', pt: 'Não somos uma consultoria. Não somos uma software house. Não somos um marketplace. Reengenhamos processos e os implementamos com arquitetura cloud escalável — e depois amplificamos com sistemas automatizados de marketing.'
    },
    'manifesto.p2': {
        en: 'Automation without re-engineering is inefficient. Re-engineering without execution is theoretical. Pro Corp does both. Complex models become conversational experiences. Technology becomes a bridge — not a barrier.',
        es: 'Automatización sin reingeniería es ineficiente. Reingeniería sin ejecución es teórica. Pro Corp hace ambas. Los modelos complejos se convierten en experiencias conversacionales. La tecnología se convierte en puente — no en barrera.', pt: 'Automação sem reengenharia é ineficiente. Reengenharia sem execução é teórica. A Pro Corp faz ambas. Modelos complexos viram experiências conversacionais. A tecnologia vira uma ponte — não uma barreira.'
    },
    'manifesto.cta': { en: 'Explore our methodology', es: 'Explora nuestra metodología', pt: 'Explore nossa metodologia' },

    // ── FeatureGrid ──
    'features.01.title': { en: 'Legal Solutions', es: 'Soluciones Legales', pt: 'Soluções Legais' },
    'features.01.desc': {
        en: 'Structured governance frameworks, risk architecture, cross-border structuring, and compliance workflows. Enhanced through automation and digital documentation portals.',
        es: 'Marcos de gobernanza estructurados, arquitectura de riesgo, estructuración transfronteriza y flujos de cumplimiento. Potenciados por automatización y portales documentales digitales.', pt: 'Estruturas de governança, arquitetura de risco, estruturação internacional e fluxos de compliance. Potencializados por automação e portais de documentação digital.'
    },
    'features.02.title': { en: 'Sustainable Growth - BPA', es: 'Crecimiento Sostenible - BPA', pt: 'Crescimento Sustentável - BPA' },
    'features.02.desc': {
        en: 'Strategy consulting differentiated by execution. Operating model redesign, KPI systems, financial simulators, and ongoing operational involvement. We stay in the game.',
        es: 'Consultoría estratégica diferenciada por ejecución. Rediseño de modelos operativos, sistemas KPI, simuladores financieros e involucramiento operacional continuo. Permanecemos en el juego.', pt: 'Consultoria estratégica diferenciada pela execução. Redesenho de modelos operacionais, sistemas de KPIs, simuladores financeiros e envolvimento operacional contínuo. Permanecemos no jogo.'
    },
    'features.03.title': { en: 'IP2$ Engineering', es: 'IP2$ Ingeniería', pt: 'Engenharia IP2$' },
    'features.03.desc': {
        en: 'Proprietary systems: conversational financial simulators, AI interfaces, marketing automation engines, platform architecture, and narrative engines. This is where the tech lives.',
        es: 'Sistemas propietarios: simuladores financieros conversacionales, interfaces IA, motores de automatización de marketing, arquitectura de plataforma y motores narrativos. Aquí vive la tecnología.', pt: 'Sistemas proprietários: simuladores financeiros conversacionais, interfaces de IA, motores de automação de marketing, arquitetura de plataforma e motores narrativos. É aqui que a tecnologia vive.'
    },

    // ── LIA Chat Section ──
    'lia.label': { en: 'AI-Powered Agent', es: 'Agente Impulsado por IA', pt: 'Agente com IA' },
    'lia.title': { en: 'Meet Lia', es: 'Conoce a Lia', pt: 'Conheça a Lia' },
    'lia.desc': {
        en: 'LIA is our intelligent Business Engineering agent. She navigates complex processes, automates workflows, and delivers structured answers in real time — turning operational complexity into conversational simplicity.',
        es: 'LIA es nuestro agente inteligente de Ingeniería de Negocios. Navega procesos complejos, automatiza flujos de trabajo y entrega respuestas estructuradas en tiempo real — convirtiendo la complejidad operativa en simplicidad conversacional.', pt: 'A LIA é nosso agente inteligente de Engenharia de Negócios. Ela navega processos complexos, automatiza fluxos de trabalho e entrega respostas estruturadas em tempo real — transformando complexidade operacional em simplicidade conversacional.'
    },
    'lia.status': { en: 'Online', es: 'En línea', pt: 'Online' },
    'lia.powered': { en: 'IP2$ Engine', es: 'Motor IP2$', pt: 'Motor IP2$' },
    'lia.chat.subtitle': { en: 'Business Engineering Agent', es: 'Agente de Ingeniería de Negocios', pt: 'Agente de Engenharia de Negócios' },
    'lia.chat.placeholder': { en: 'Ask LIA anything...', es: 'Pregúntale a LIA...', pt: 'Pergunte qualquer coisa à LIA...' },
    'lia.chat.user1': {
        en: 'I need to set up a cross-border operation between Colombia and Spain. Where do I start?',
        es: 'Necesito montar una operación transfronteriza entre Colombia y España. ¿Por dónde empiezo?'
    },
    'lia.chat.lia1': {
        en: 'I can help with that. First, let me map the governance framework: entity structure, tax residency, and compliance requirements for both jurisdictions. I\'ll generate a diagnostic report in 48 hours.',
        es: 'Puedo ayudarte con eso. Primero, permíteme mapear el marco de gobernanza: estructura de entidad, residencia fiscal y requisitos de cumplimiento para ambas jurisdicciones. Generaré un informe diagnóstico en 48 horas.'
    },
    'lia.chat.user2': {
        en: 'Can you also simulate the financial impact?',
        es: '¿Puedes también simular el impacto financiero?'
    },
    'lia.chat.lia2': {
        en: 'Absolutely. I\'ll activate the conversational financial simulator — you\'ll be able to adjust variables like capital allocation, operational costs, and revenue projections interactively. Real-time results, no spreadsheets needed.',
        es: 'Por supuesto. Activaré el simulador financiero conversacional — podrás ajustar variables como asignación de capital, costos operativos y proyecciones de ingresos de forma interactiva. Resultados en tiempo real, sin hojas de cálculo.'
    },
    'lia.chat.user3': {
        en: 'This is exactly what we needed. How fast can we move?',
        es: 'Esto es exactamente lo que necesitábamos. ¿Qué tan rápido podemos avanzar?'
    },
    'lia.chat.lia3': {
        en: 'The Value Finding Cycle is already in motion: Understand → Model → Simulate → Engineer → Execute → Learn & Repeat — with Real Time monitoring running underneath the entire cycle. I\'ll have your architecture blueprint ready for review by next week.',
        es: 'El Ciclo de Descubrimiento de Valor ya está en marcha: Entender → Modelar → Simular → "Re-Engineer" → Ejecutar → Aprender y Repetir — con monitoreo en Tiempo Real corriendo bajo todo el ciclo. Tendré el plano de tu arquitectura listo para revisión la próxima semana.',
        pt: 'O Ciclo de Descoberta de Valor já está em andamento: Entender → Modelar → Simular → "Re-Engineer" → Executar → Aprender e Repetir — com monitoramento em Tempo Real sob todo o ciclo. Terei o plano da sua arquitetura pronto para revisão na próxima semana.'
    },

    // ── VisualDivider ──
    'divider.title': { en: 'Start your architecture.', es: 'Inicia tu arquitectura.', pt: 'Comece sua arquitetura.' },
    'divider.cta': { en: 'Enter the Platform', es: 'Entra a la Plataforma', pt: 'Entrar na Plataforma' },

    // ── Studio (About) Page ──
    'studio.hero.title.1': { en: 'Technology-based', es: 'Orquestación', pt: 'Orquestração baseada' },
    'studio.hero.title.2': { en: 'orchestration', es: 'basada en tecnología', pt: 'em tecnologia' },
    'studio.hero.p1': {
        en: 'Pro Corp is a technology-based orchestration company specialized in Business Process Automation. We redesign operating models, automate execution, and integrate assets, capital, and expertise through a transparent exchange platform.',
        es: 'Pro Corp es una empresa de orquestación basada en tecnología, especializada en Automatización de Procesos de Negocio. Rediseñamos modelos operativos, automatizamos la ejecución e integramos activos, capital y expertise a través de una plataforma de intercambio transparente.', pt: 'A Pro Corp é uma empresa de orquestração baseada em tecnologia, especializada em Business Process Automation. Redesenhamos modelos operacionais, automatizamos a execução e integramos ativos, capital e expertise por meio de uma plataforma de intercâmbio transparente.'
    },
    'studio.hero.p2': {
        en: 'Prepared with discipline. Structured for scale. Designed for transparent execution.',
        es: 'Preparados con disciplina. Estructurados para escalar. Diseñados para ejecución transparente.', pt: 'Preparada com disciplina. Estruturada para escalar. Desenhada para execução transparente.'
    },
    'studio.hero.cta': { en: 'Explore the platform', es: 'Explora la plataforma', pt: 'Explore a plataforma' },
    'studio.verticals.label': { en: 'Strategic Verticals', es: 'Verticales Estratégicos', pt: 'Verticais Estratégicas' },
    'studio.verticals.title': { en: 'Three pillars. One architecture.', es: 'Tres pilares. Una arquitectura.', pt: 'Três pilares. Uma arquitetura.' },
    'studio.v1.title': { en: '01. Legal Solutions', es: '01. Soluciones Legales', pt: '01. Soluções Legais' },
    'studio.v1.desc': {
        en: 'Structured governance frameworks, risk architecture, cross-border structuring, and compliance workflows. Enhanced through automation and digital documentation portals.',
        es: 'Marcos de gobernanza estructurados, arquitectura de riesgo, estructuración transfronteriza y flujos de cumplimiento. Potenciados por automatización y portales documentales digitales.', pt: 'Estruturas de governança, arquitetura de risco, estruturação internacional e fluxos de compliance. Potencializados por automação e portais de documentação digital.'
    },
    'studio.v1.l1': { en: 'Governance Frameworks', es: 'Marcos de Gobernanza', pt: 'Estruturas de Governança' },
    'studio.v1.l2': { en: 'Risk Architecture', es: 'Arquitectura de Riesgo', pt: 'Arquitetura de Risco' },
    'studio.v1.l3': { en: 'Compliance Workflows', es: 'Flujos de Cumplimiento', pt: 'Fluxos de Compliance' },
    'studio.v1.l4': { en: 'Cross-Border Structuring', es: 'Estructuración Transfronteriza', pt: 'Estruturação Internacional' },
    'studio.v2.title': { en: '02. Sustainable Growth - BPA', es: '02. Crecimiento Sostenible - BPA', pt: '02. Crescimento Sustentável - BPA' },
    'studio.v2.desc': {
        en: "Strategy consulting differentiated by execution. Operating model redesign, KPI systems, financial simulators, and ongoing operational involvement. We stay in the game — we don't just advise.",
        es: 'Consultoría estratégica diferenciada por ejecución. Rediseño de modelos operativos, sistemas KPI, simuladores financieros e involucramiento operacional continuo. Permanecemos en el juego — no solo asesoramos.',
        pt: 'Consultoria estratégica diferenciada pela execução. Redesenho de modelos operacionais, sistemas de KPIs, simuladores financeiros e envolvimento operacional contínuo. Permanecemos no jogo — não apenas aconselhamos.'
    },
    'studio.v2.l1': { en: 'Operating Model Redesign', es: 'Rediseño de Modelo Operativo', pt: 'Redesenho do Modelo Operacional' },
    'studio.v2.l2': { en: 'KPI Systems', es: 'Sistemas KPI', pt: 'Sistemas de KPIs' },
    'studio.v2.l3': { en: 'Financial Simulators', es: 'Simuladores Financieros', pt: 'Simuladores Financeiros' },
    'studio.v3.title': { en: '03. IP2$ Engineering', es: '03. IP2$ Ingeniería', pt: '03. Engenharia IP2$' },
    'studio.v3.desc': {
        en: 'Proprietary systems: conversational financial simulators, AI interfaces, marketing automation engines, platform architecture, Cognitive Echo & narrative engines. This is where the tech lives.',
        es: 'Sistemas propietarios: simuladores financieros conversacionales, interfaces IA, motores de automatización de marketing, arquitectura de plataforma, Cognitive Echo y motores narrativos. Aquí vive la tecnología.', pt: 'Sistemas proprietários: simuladores financeiros conversacionais, interfaces de IA, motores de automação de marketing, arquitetura de plataforma, Cognitive Echo e motores narrativos. É aqui que a tecnologia vive.'
    },
    'studio.v3.l1': { en: 'AI Interfaces', es: 'Interfaces IA', pt: 'Interfaces de IA' },
    'studio.v3.l2': { en: 'Marketing Automation', es: 'Automatización de Marketing', pt: 'Automação de Marketing' },
    'studio.v3.l3': { en: 'Platform Architecture', es: 'Arquitectura de Plataforma', pt: 'Arquitetura de Plataforma' },
    'studio.method.label': { en: '7-Step Methodology', es: 'Metodología de 7 Pasos', pt: 'Metodologia de 7 Passos' },
    'studio.method.title': {
        en: 'Momentum is engineered — not accidental.',
        es: 'El impulso se diseña — no es accidental.', pt: 'O impulso é engenhado — não acidental.'
    },
    'studio.method.desc': {
        en: 'Diagnose. Map. Design. Re-engineer. Implement. Integrate. Amplify. Our methodology transforms operating models through scalable cloud architecture — React, Supabase, Cloud stack — then amplifies through automated marketing systems.',
        es: 'Diagnosticar. Mapear. Diseñar. Reingeniar. Implementar. Integrar. Amplificar. Nuestra metodología transforma modelos operativos a través de arquitectura cloud escalable — React, Supabase, Cloud stack — y luego amplifica con sistemas automatizados de marketing.', pt: 'Diagnosticar. Mapear. Desenhar. Reengenhar. Implementar. Integrar. Amplificar. Nossa metodologia transforma modelos operacionais por meio de arquitetura cloud escalável — React, Supabase, stack Cloud — e depois amplifica com sistemas automatizados de marketing.'
    },
    'studio.method.stat1.value': { en: '7', es: '7', pt: '7' },
    'studio.method.stat1.label': { en: 'Step Process', es: 'Pasos del Proceso', pt: 'Passos do Processo' },
    'studio.method.stat2.value': { en: '4', es: '4', pt: '4' },
    'studio.method.stat2.label': { en: 'Platform Roles', es: 'Roles de Plataforma', pt: 'Papéis na Plataforma' },

    // ── Projects (Services) Page ──
    'projects.title': { en: 'Services', es: 'Servicios' },
    'projects.desc': {
        en: 'Strategic verticals, orchestration systems, and proprietary technology for scalable execution and transparent operations.',
        es: 'Verticales estratégicos, sistemas de orquestación y tecnología propietaria para ejecución escalable y operaciones transparentes.'
    },
    'projects.filter.all': { en: 'All', es: 'Todos' },
    'projects.filter.legal': { en: 'Legal', es: 'Legal' },
    'projects.filter.growth': { en: 'Growth', es: 'Crecimiento' },
    'projects.filter.engineering': { en: 'Engineering', es: 'Ingeniería' },
    'projects.count': { en: 'services available', es: 'servicios disponibles' },
    'projects.footer': { en: 'PRO CORP / TECHNOLOGY-BASED ORCHESTRATION', es: 'PRO CORP / ORQUESTACIÓN BASADA EN TECNOLOGÍA' },
    'projects.privacy': { en: 'Privacy Policy', es: 'Política de Privacidad' },
    'projects.data': { en: 'Data Processing', es: 'Tratamiento de Datos' },
    'projects.terms': { en: 'Legal Terms', es: 'Términos Legales' },

    // Services data
    'svc.01.title': { en: 'LEGAL SOLUTIONS', es: 'SOLUCIONES LEGALES' },
    'svc.01.desc': { en: 'Governance & Compliance', es: 'Gobernanza y Cumplimiento' },
    'svc.01.detail': { en: 'Structured frameworks and cross-border structuring', es: 'Marcos estructurados y estructuración transfronteriza' },
    'svc.02.title': { en: 'SUSTAINABLE GROWTH - BPA', es: 'CRECIMIENTO SOSTENIBLE - BPA', pt: 'CRESCIMENTO SUSTENTÁVEL - BPA' },
    'svc.02.desc': { en: 'Strategy & Execution', es: 'Estrategia y Ejecución' },
    'svc.02.detail': { en: 'Operating model redesign and KPI systems', es: 'Rediseño de modelo operativo y sistemas KPI' },
    'svc.03.title': { en: 'IP2$ ENGINEERING', es: 'IP2$ INGENIERÍA' },
    'svc.03.desc': { en: 'Proprietary Systems', es: 'Sistemas Propietarios' },
    'svc.03.detail': { en: 'AI interfaces, simulators, and automation engines', es: 'Interfaces IA, simuladores y motores de automatización' },
    'svc.04.title': { en: 'EXCHANGE PLATFORM', es: 'PLATAFORMA DE INTERCAMBIO' },
    'svc.04.desc': { en: 'Orchestration Layer', es: 'Capa de Orquestación' },
    'svc.04.detail': { en: 'Transparent stakeholder portals and real-time simulations', es: 'Portales transparentes y simulaciones en tiempo real' },
    'svc.05.title': { en: 'BUSINESS PROCESS AUTOMATION', es: 'AUTOMATIZACIÓN DE PROCESOS' },
    'svc.05.desc': { en: 'BPA', es: 'BPA' },
    'svc.05.detail': { en: 'Process re-engineering and scalable cloud implementation', es: 'Reingeniería de procesos e implementación cloud escalable' },

    // Service detail pages
    'svc.back': { en: 'Back to Services', es: 'Volver a Servicios', pt: 'Voltar aos Serviços' },
    'svc.challenge': { en: 'The Challenge', es: 'El Desafío', pt: 'O Desafio' },
    'svc.solution': { en: 'Our Approach', es: 'Nuestro Enfoque', pt: 'Nossa Abordagem' },
    'svc.capabilities': { en: 'Key Capabilities', es: 'Capacidades Clave', pt: 'Capacidades-Chave' },
    'svc.next': { en: 'Next Service', es: 'Siguiente Servicio', pt: 'Próximo Serviço' },

    // 01 – Legal Solutions
    'svc.01.challenge': {
        en: 'Multinational operations face an increasingly complex regulatory landscape. Fragmented compliance frameworks, jurisdictional ambiguity, and evolving cross-border regulations create significant exposure for organizations scaling internationally.',
        es: 'Las operaciones multinacionales enfrentan un panorama regulatorio cada vez más complejo. Marcos de cumplimiento fragmentados, ambigüedad jurisdiccional y regulaciones transfronterizas en evolución generan una exposición significativa para organizaciones que escalan internacionalmente.'
    },
    'svc.01.solution': {
        en: 'We design unified governance architectures that harmonize regulatory requirements across jurisdictions. Our structured frameworks integrate compliance monitoring, risk assessment, and legal strategy into a single operational layer — reducing friction and eliminating blind spots in cross-border structuring.',
        es: 'Diseñamos arquitecturas de gobernanza unificadas que armonizan requisitos regulatorios entre jurisdicciones. Nuestros marcos estructurados integran monitoreo de cumplimiento, evaluación de riesgos y estrategia legal en una sola capa operativa — reduciendo fricción y eliminando puntos ciegos en la estructuración transfronteriza.'
    },
    'svc.01.feat1.title': { en: 'Cross-Border Structuring', es: 'Estructuración Transfronteriza' },
    'svc.01.feat1.desc': { en: 'Jurisdiction-optimized legal frameworks for international operations and entity management.', es: 'Marcos legales optimizados por jurisdicción para operaciones internacionales y gestión de entidades.' },
    'svc.01.feat2.title': { en: 'Regulatory Compliance', es: 'Cumplimiento Regulatorio' },
    'svc.01.feat2.desc': { en: 'Proactive compliance monitoring and adaptive governance systems across multiple regulatory environments.', es: 'Monitoreo proactivo de cumplimiento y sistemas de gobernanza adaptativos en múltiples entornos regulatorios.' },
    'svc.01.feat3.title': { en: 'Risk Architecture', es: 'Arquitectura de Riesgos' },
    'svc.01.feat3.desc': { en: 'Structured risk assessment models that quantify exposure and map mitigation strategies.', es: 'Modelos estructurados de evaluación de riesgos que cuantifican la exposición y mapean estrategias de mitigación.' },

    // 02 – Sustainable Growth
    'svc.02.challenge': {
        en: 'Growth without structure is entropy. Many organizations pursue revenue targets without the operational infrastructure to sustain them — leading to misaligned teams, opaque KPIs, and scalability bottlenecks that compound over time.',
        es: 'El crecimiento sin estructura es entropía. Muchas organizaciones persiguen metas de ingresos sin la infraestructura operativa para sostenerlas — generando equipos desalineados, KPIs opacos y cuellos de botella de escalabilidad que se acumulan con el tiempo.'
    },
    'svc.02.solution': {
        en: 'We redesign operating models from the ground up — mapping value chains, implementing KPI systems with real accountability, and building execution frameworks that convert strategy into measurable momentum. The result is growth that compounds instead of collapses.',
        es: 'Rediseñamos modelos operativos desde cero — mapeando cadenas de valor, implementando sistemas de KPIs con rendición de cuentas real, y construyendo marcos de ejecución que convierten estrategia en impulso medible. El resultado es crecimiento que se multiplica en vez de colapsar.'
    },
    'svc.02.feat1.title': { en: 'Operating Model Design', es: 'Diseño de Modelo Operativo' },
    'svc.02.feat1.desc': { en: 'End-to-end redesign of organizational structures, processes, and decision-making frameworks.', es: 'Rediseño integral de estructuras organizacionales, procesos y marcos de toma de decisiones.' },
    'svc.02.feat2.title': { en: 'KPI Systems', es: 'Sistemas de KPIs' },
    'svc.02.feat2.desc': { en: 'Performance measurement architectures that align teams, track execution, and drive accountability.', es: 'Arquitecturas de medición de rendimiento que alinean equipos, rastrean ejecución e impulsan responsabilidad.' },
    'svc.02.feat3.title': { en: 'Scalability Engineering', es: 'Ingeniería de Escalabilidad' },
    'svc.02.feat3.desc': { en: 'Infrastructure and process design that anticipates growth instead of reacting to it.', es: 'Diseño de infraestructura y procesos que anticipa el crecimiento en lugar de reaccionar ante él.' },

    // 03 – IP2$ Engineering
    'svc.03.challenge': {
        en: 'Off-the-shelf solutions create dependency. Organizations relying on generic technology inherit limitations in customization, data ownership, and competitive differentiation — leaving critical intellectual property unrealized.',
        es: 'Las soluciones genéricas crean dependencia. Las organizaciones que dependen de tecnología estándar heredan limitaciones en personalización, propiedad de datos y diferenciación competitiva — dejando propiedad intelectual crítica sin realizar.'
    },
    'svc.03.solution': {
        en: 'We engineer proprietary systems — AI interfaces, financial simulators, and automation engines — designed around your specific operational logic. Each system becomes a defensible asset: a competitive moat built on your unique processes and data.',
        es: 'Diseñamos sistemas propietarios — interfaces de IA, simuladores financieros y motores de automatización — construidos alrededor de tu lógica operativa específica. Cada sistema se convierte en un activo defendible: una ventaja competitiva construida sobre tus procesos y datos únicos.'
    },
    'svc.03.feat1.title': { en: 'AI Interfaces', es: 'Interfaces de IA' },
    'svc.03.feat1.desc': { en: 'Conversational and visual AI systems tailored to your domain, data, and decision workflows.', es: 'Sistemas de IA conversacionales y visuales adaptados a tu dominio, datos y flujos de decisión.' },
    'svc.03.feat2.title': { en: 'Financial Simulators', es: 'Simuladores Financieros' },
    'svc.03.feat2.desc': { en: 'Interactive modeling tools that make complex financial scenarios accessible and actionable.', es: 'Herramientas de modelado interactivo que hacen escenarios financieros complejos accesibles y accionables.' },
    'svc.03.feat3.title': { en: 'Automation Engines', es: 'Motores de Automatización' },
    'svc.03.feat3.desc': { en: 'Custom-built engines that eliminate manual workflows and scale operational capacity.', es: 'Motores personalizados que eliminan flujos manuales y escalan la capacidad operativa.' },

    // 04 – Exchange Platform
    'svc.04.challenge': {
        en: 'Stakeholder ecosystems operate in silos. Investors, operators, and partners lack a unified surface for real-time visibility — leading to delayed decisions, misaligned expectations, and friction across the value chain.',
        es: 'Los ecosistemas de stakeholders operan en silos. Inversores, operadores y socios carecen de una superficie unificada para visibilidad en tiempo real — generando decisiones tardías, expectativas desalineadas y fricción en la cadena de valor.'
    },
    'svc.04.solution': {
        en: 'We build shared Business Cockpits — transparent stakeholder portals with live indicators, scenario simulations, and collaborative interfaces. Not a marketplace, but a command center where every participant sees the same truth in real time.',
        es: 'Construimos Business Cockpits compartidos — portales transparentes con indicadores en vivo, simulaciones de escenarios e interfaces colaborativas. No un marketplace, sino un centro de comando donde cada participante ve la misma verdad en tiempo real.'
    },
    'svc.04.feat1.title': { en: 'Stakeholder Portals', es: 'Portales de Stakeholders' },
    'svc.04.feat1.desc': { en: 'Role-based interfaces that give each participant the right level of access, visibility, and control.', es: 'Interfaces basadas en roles que dan a cada participante el nivel adecuado de acceso, visibilidad y control.' },
    'svc.04.feat2.title': { en: 'Real-Time Dashboards', es: 'Dashboards en Tiempo Real' },
    'svc.04.feat2.desc': { en: 'Live data visualization surfaces that transform raw metrics into strategic intelligence.', es: 'Superficies de visualización de datos en vivo que transforman métricas crudas en inteligencia estratégica.' },
    'svc.04.feat3.title': { en: 'Scenario Simulations', es: 'Simulaciones de Escenarios' },
    'svc.04.feat3.desc': { en: 'Interactive what-if modeling that enables data-driven decisions before capital is deployed.', es: 'Modelado interactivo what-if que permite decisiones basadas en datos antes de desplegar capital.' },

    // 05 – Business Process Automation
    'svc.05.challenge': {
        en: 'Manual processes don\'t scale. As organizations grow, operational complexity multiplies — creating bottlenecks, errors, and invisible costs that erode margins and slow execution.',
        es: 'Los procesos manuales no escalan. A medida que las organizaciones crecen, la complejidad operativa se multiplica — creando cuellos de botella, errores y costos invisibles que erosionan márgenes y ralentizan la ejecución.'
    },
    'svc.05.solution': {
        en: 'We re-engineer processes before automating them — because automating a broken workflow only accelerates inefficiency. Our approach combines process architecture with scalable cloud implementation, delivering systems that eliminate friction and grow with the business.',
        es: 'Rediseñamos procesos antes de automatizarlos — porque automatizar un flujo roto solo acelera la ineficiencia. Nuestro enfoque combina arquitectura de procesos con implementación cloud escalable, entregando sistemas que eliminan fricción y crecen con el negocio.'
    },
    'svc.05.feat1.title': { en: 'Process Re-Engineering', es: 'Reingeniería de Procesos' },
    'svc.05.feat1.desc': { en: 'Deep analysis and redesign of workflows before automation — eliminating waste at the source.', es: 'Análisis profundo y rediseño de flujos de trabajo antes de la automatización — eliminando desperdicios desde la fuente.' },
    'svc.05.feat2.title': { en: 'Cloud Implementation', es: 'Implementación Cloud' },
    'svc.05.feat2.desc': { en: 'Scalable, secure cloud architectures that adapt to demand and reduce infrastructure overhead.', es: 'Arquitecturas cloud escalables y seguras que se adaptan a la demanda y reducen costos de infraestructura.' },
    'svc.05.feat3.title': { en: 'Workflow Orchestration', es: 'Orquestación de Flujos' },
    'svc.05.feat3.desc': { en: 'End-to-end automation pipelines that connect systems, eliminate handoffs, and ensure execution consistency.', es: 'Pipelines de automatización end-to-end que conectan sistemas, eliminan transferencias manuales y aseguran consistencia en la ejecución.' },

    // ── Journal Page ──
    'journal.title': { en: 'Journal', es: 'Blog' },
    'journal.desc': {
        en: 'Insight from a field where we practice Business Engineering every day — immigration, residence and cross-border life in Spain and Portugal.',
        es: 'Conocimiento desde un campo donde practicamos la Ingeniería de Negocios cada día — migración, residencia y vida transfronteriza en España y Portugal.',
        pt: 'Conhecimento de um campo onde praticamos a Engenharia de Negócios todos os dias — imigração, residência e vida entre fronteiras na Espanha e em Portugal.'
    },
    'journal.a1.title': { en: 'Why Automation Without Re-Engineering Is Inefficient', es: 'Por Qué la Automatización Sin Reingeniería Es Ineficiente' },
    'journal.a2.title': { en: 'The Exchange Platform: Orchestration, Not Marketplace', es: 'La Plataforma de Intercambio: Orquestación, No Marketplace' },
    'journal.a3.title': { en: 'Operating Model Redesign: From Diagnosis to Amplification', es: 'Rediseño de Modelo Operativo: Del Diagnóstico a la Amplificación' },
    'journal.a4.title': { en: 'Conversational Financial Simulators: Complex Models Made Accessible', es: 'Simuladores Financieros Conversacionales: Modelos Complejos Accesibles' },
    'journal.a5.title': { en: 'Structured Governance Frameworks for Cross-Border Operations', es: 'Marcos de Gobernanza Estructurados para Operaciones Transfronterizas' },
    'journal.newsletter.title': { en: 'Subscribe to our strategic vision', es: 'Suscríbete a nuestra visión estratégica', pt: 'Assine nossa visão estratégica' },
    'journal.newsletter.desc': { en: 'Receive deep analysis on process engineering and legal trends.', es: 'Recibe análisis profundo sobre ingeniería de procesos y tendencias legales.', pt: 'Receba análises profundas sobre engenharia de processos e tendências jurídicas.' },
    'journal.newsletter.placeholder': { en: 'Your corporate email', es: 'Tu correo corporativo', pt: 'Seu e-mail corporativo' },
    'journal.newsletter.button': { en: 'Subscribe', es: 'Suscribirse', pt: 'Assinar' },
    'journal.filter.by': { en: 'Filter by:', es: 'Filtrar por:', pt: 'Filtrar por:' },
    'journal.filter.all': { en: 'All', es: 'Todos', pt: 'Todos' },

    // ── Contact Page ──
    'contact.title.1': { en: 'Start your', es: 'Inicia tu' },
    'contact.title.2': { en: 'architecture.', es: 'arquitectura.' },
    'contact.desc': {
        en: "Ready to redesign your operating model? Let's build the structure. Transparent execution starts with a conversation.",
        es: '¿Listo para rediseñar tu modelo operativo? Construyamos la estructura. La ejecución transparente comienza con una conversación.'
    },
    'contact.offices': { en: 'Our Offices', es: 'Nuestras Oficinas' },
    'contact.hq': { en: 'Bogotá (HQ)', es: 'Bogotá (Sede Principal)' },
    'contact.spain': { en: 'Spain', es: 'España' },
    'contact.spain.type': { en: 'Representative Office', es: 'Oficina de Representación' },
    'contact.portugal': { en: 'Portugal', es: 'Portugal' },
    'contact.portugal.type': { en: 'Representative Office', es: 'Oficina de Representación' },
    'contact.form.name': { en: 'Full Name', es: 'Nombre Completo' },
    'contact.form.name.placeholder': { en: 'e.g. John Smith', es: 'Ej. Juan Pérez' },
    'contact.form.company': { en: 'Company', es: 'Empresa' },
    'contact.form.company.placeholder': { en: 'e.g. Acme Corp', es: 'Ej. Mi Empresa S.A.' },
    'contact.form.email': { en: 'Email', es: 'Correo Electrónico' },
    'contact.form.vertical': { en: 'Vertical of Interest', es: 'Vertical de Interés' },
    'contact.form.vertical.placeholder': { en: 'Select vertical', es: 'Seleccionar vertical' },
    'contact.form.vertical.1': { en: 'Legal Solutions', es: 'Soluciones Legales' },
    'contact.form.vertical.2': { en: 'Sustainable Growth - BPA', es: 'Crecimiento Sostenible - BPA', pt: 'Crescimento Sustentável - BPA' },
    'contact.form.vertical.3': { en: 'IP2$ Engineering', es: 'IP2$ Ingeniería' },
    'contact.form.vertical.4': { en: 'Exchange Platform', es: 'Plataforma de Intercambio' },
    'contact.form.vertical.5': { en: 'Business Process Automation', es: 'Automatización de Procesos' },
    'contact.form.vertical.other': { en: 'Other', es: 'Otro' },
    'contact.form.how': { en: 'How did you find us?', es: '¿Cómo nos encontró?' },
    'contact.form.how.placeholder': { en: 'Select', es: 'Seleccionar' },
    'contact.form.how.social': { en: 'Social Media', es: 'Redes Sociales' },
    'contact.form.how.google': { en: 'Google', es: 'Google' },
    'contact.form.how.referral': { en: 'Referral', es: 'Referido' },
    'contact.form.how.event': { en: 'Event', es: 'Evento' },
    'contact.form.how.other': { en: 'Other', es: 'Otro' },
    'contact.form.message': { en: 'Message', es: 'Mensaje' },
    'contact.form.message.placeholder': {
        en: 'Describe your operational challenge or the architecture you need...',
        es: 'Describe tu desafío operacional o la arquitectura que necesitas...'
    },
    'contact.form.submit': { en: 'Start the Conversation', es: 'Iniciar la Conversación' },
    'contact.form.disclaimer': {
        en: 'By submitting, you accept our data processing policy.',
        es: 'Al enviar, acepta nuestra política de tratamiento de datos.'
    },

    // ── Footer ──
    'footer.contact': { en: 'Contact', es: 'Contacto', pt: 'Contato' },
    'footer.follow': { en: 'Follow Us', es: 'Síguenos', pt: 'Siga-nos' },
    'footer.rights': { en: 'All rights reserved.', es: 'Todos los derechos reservados.', pt: 'Todos os direitos reservados.' },
    'footer.company': { en: 'Company', es: 'Empresa', pt: 'Empresa' },
    'footer.about': { en: 'About Us', es: 'Sobre Nosotros', pt: 'Sobre Nós' },
    'footer.blog': { en: 'Blog', es: 'Blog', pt: 'Blog' },
    'footer.services': { en: 'Services', es: 'Servicios', pt: 'Serviços' },
    'footer.legal.title': { en: 'Legal', es: 'Legal', pt: 'Legal' },
    'footer.legal.solutions': { en: 'Legal Solutions', es: 'Soluciones Legales', pt: 'Soluções Legais' },
    'footer.legal.growth': { en: 'Sustainable Growth - BPA', es: 'Crecimiento Sostenible - BPA', pt: 'Crescimento Sustentável - BPA' },
    'footer.legal.consulting': { en: 'Consulting', es: 'Consultoría', pt: 'Consultoria' },
    'footer.legal.privacy': { en: 'Privacy Policy', es: 'Política de Privacidad', pt: 'Política de Privacidade' },
    'footer.legal.terms': { en: 'Terms of Use', es: 'Términos de Uso', pt: 'Termos de Uso' },
    'footer.legal.cookies': { en: 'Cookies', es: 'Cookies', pt: 'Cookies' },
    'footer.desc': { en: 'Business Engineering for sustainable business growth.', es: 'Ingeniería de Negocios para el crecimiento empresarial sostenible.', pt: 'Engenharia de Negócios para o crescimento empresarial sustentável.' },
    'footer.system': { en: 'System Operational', es: 'Sistema Operativo', pt: 'Sistema Operacional' },

    // ── Home Page ──
    'home.scrollHint': { en: 'Please scroll', es: 'Por favor haz scroll' },
    'home.badge': { en: 'Legal · Automation · Investment', es: 'Legal · Automatización · Inversión' },
    'home.title1': { en: 'We structure, automate', es: 'Estructuramos, automatizamos' },
    'home.title2': { en: 'and scale your business', es: 'y escalamos tu negocio' },
    'home.tagline': { en: 'One integrated partner for companies expanding internationally: legal compliance, process automation, and strategic investment — so you grow with structure, not chaos.', es: 'Un socio integral para empresas que se expanden internacionalmente: cumplimiento legal, automatización de procesos e inversión estratégica — para que crezcas con estructura, no con caos.' },
    'home.desc': { en: 'We take on the complex work — immigration, corporate governance, process re-engineering, and intelligent automation — so you get fewer delays, lower risk, and a business that scales. One model, measurable results.', es: 'Asumimos el trabajo complejo — migración, gobernanza corporativa, reingeniería de procesos y automatización inteligente — para que obtengas menos demoras, menor riesgo y un negocio que escala. Un modelo, resultados medibles.' },
    'home.cta1': { en: 'Explore Strategy', es: 'Explorar Estrategia' },
    'home.cta2': { en: 'View Dashboard Demo', es: 'Ver Dashboard Demo' },
    'home.pillars.label': { en: 'Our Pillars', es: 'Nuestros Pilares' },
    'home.pillars.title': { en: 'Strategic Pillars', es: 'Pilares Estratégicos' },
    'home.pillars.desc': { en: 'Driving the digital and legal transformation of modern corporations through three fundamental axes.', es: 'Impulsando la transformación digital y legal de las corporaciones modernas a través de tres ejes fundamentales.' },
    'home.pillars.viewall': { en: 'View all services', es: 'Ver todos los servicios' },
    'home.workflow.label': { en: 'Intelligent Orchestration', es: 'Orquestación Inteligente' },
    'home.workflow.title': { en: 'Our Engine in Action', es: 'Nuestro Motor en Acción' },
    'home.workflow.desc': { en: 'Real-time visualization of our AI-powered automation workflows — connecting agents, data, and decisions seamlessly.', es: 'Visualización en tiempo real de nuestros flujos de automatización impulsados por IA — conectando agentes, datos y decisiones sin fricción.' },
    'home.pillar1.title': { en: 'Legal Solutions', es: 'Soluciones Legales' },
    'home.pillar1.desc': { en: 'Legal advice adapted to the digital era. We digitize complex legal frameworks into executable code, ensuring real-time regulatory compliance.', es: 'Asesoría jurídica adaptada a la era digital. Digitalizamos marcos legales complejos en código ejecutable, garantizando cumplimiento normativo en tiempo real.' },
    'home.pillar2.title': { en: 'Sustainable Growth - BPA', es: 'Crecimiento Sostenible - BPA', pt: 'Crescimento Sustentável - BPA' },
    'home.pillar2.desc': { en: 'ESG strategies integrated into the core business. Resilient business models designed for the long term.', es: 'Estrategias ESG integradas al core business. Modelos de negocio resilientes diseñados para el largo plazo.' },
    'home.pillar3.title': { en: 'Process Engineering', es: 'Ingeniería de Procesos' },
    'home.pillar3.desc': { en: 'Data intelligence applied to processes (BPA). Workflow optimization through AI and Machine Learning.', es: 'Inteligencia de datos aplicada a procesos (BPA). Optimización de flujos de trabajo mediante IA y Machine Learning.' },
    'home.learnmore': { en: 'Learn more', es: 'Saber más' },
    'home.lia.title1': { en: 'LIA: YOUR', es: 'LIA: TU MOTOR DE' },
    'home.lia.title2': { en: 'ORCHESTRATION ENGINE', es: 'ORQUESTACIÓN INTELIGENTE' },
    'home.lia.desc1': { en: 'LIA not only analyzes,', es: 'LIA no solo analiza,' },
    'home.lia.desc2': { en: 'executes and optimizes', es: 'ejecuta y optimiza' },
    'home.lia.desc3': { en: 'your operating model end to end.', es: 'su modelo operativo de punta a punta.' },
    'home.lia.docs': { en: 'Documents Processed:', es: 'Documentos Procesados:' },
    'home.lia.precision': { en: 'Analysis Precision:', es: 'Precisión de Análisis:' },
    'home.lia.time': { en: 'Time Saved:', es: 'Tiempo Ahorrado:' },
    'home.lia.demo': { en: 'VIEW LIVE DEMO', es: 'VER DEMO EN VIVO' },
    'home.lia.more': { en: 'More information', es: 'Más información' },
    'home.lia.ask': { en: 'Ask us yourself', es: 'Pregúntanos tú mismo' },
    'home.eco.badge': { en: 'Digital Ecosystem', es: 'Ecosistema Digital' },
    'home.eco.title1': { en: 'Total control over your', es: 'Control total sobre tu' },
    'home.eco.title2': { en: 'corporate architecture', es: 'arquitectura corporativa' },
    'home.eco.desc': { en: 'Our platform integrates legality, operations, and sustainability into a single dashboard. Visualize the impact of every decision in real time with our predictive analytics tools.', es: 'Nuestra plataforma integra legalidad, operaciones y sostenibilidad en un solo dashboard. Visualiza el impacto de cada decisión en tiempo real con nuestras herramientas de análisis predictivo.' },
    'home.eco.kpi': { en: 'Real-time KPI monitoring', es: 'Monitoreo de KPIs en tiempo real' },
    'home.eco.alerts': { en: 'Automated compliance alerts', es: 'Alertas de cumplimiento normativo automatizadas' },
    'home.eco.projection': { en: 'Growth scenario projection', es: 'Proyección de escenarios de crecimiento' },
    'home.eco.performance': { en: 'GLOBAL PERFORMANCE', es: 'RENDIMIENTO GLOBAL' },
    'home.eco.legalrisk': { en: 'LEGAL RISK', es: 'RIESGO LEGAL' },
    'home.eco.resources': { en: 'RESOURCES', es: 'RECURSOS' },
    'home.eco.used': { en: 'Used', es: 'Utilizado' },
    'home.eco.available': { en: 'Available', es: 'Disponible' },
    'home.cta.title': { en: 'Ready to scale your corporation?', es: '¿Listo para escalar tu corporación?' },
    'home.cta.desc': { en: 'Join the leading companies already building their future with Pro Corp. Schedule a strategic consultation today.', es: 'Únete a las empresas líderes que ya están construyendo su futuro con Pro Corp. Agenda una consultoría estratégica hoy.' },
    'home.cta.button': { en: 'CONTACT US', es: 'CONTACTANOS' },

    // ── How We Work ──
    'home.howwework.label': { en: 'How We Work', es: 'Cómo Trabajamos' },
    'home.howwework.title': { en: 'From first contact to ongoing results', es: 'Del primer contacto a resultados continuos' },
    'home.howwework.desc': { en: 'A clear and transparent process so you always know what to expect.', es: 'Un proceso claro y transparente para que siempre sepas qué esperar.' },
    'home.howwework.step1.title': { en: 'Evaluation', es: 'Evaluación' },
    'home.howwework.step1.desc': { en: 'We analyze your current situation, identify opportunities, and define the scope of the project together.', es: 'Analizamos tu situación actual, identificamos oportunidades y definimos el alcance del proyecto juntos.' },
    'home.howwework.step2.title': { en: 'Strategy & Budget', es: 'Estrategia y Presupuesto' },
    'home.howwework.step2.desc': { en: 'We design a customized action plan with clear timelines, deliverables, and transparent pricing.', es: 'Diseñamos un plan de acción personalizado con plazos claros, entregables y precios transparentes.' },
    'home.howwework.step3.title': { en: 'Execution & Monitoring', es: 'Ejecución y Seguimiento' },
    'home.howwework.step3.desc': { en: 'We implement the strategy and provide continuous tracking with regular progress reports and direct communication.', es: 'Implementamos la estrategia y proporcionamos seguimiento continuo con reportes de avance y comunicación directa.' },

    // ── Projects Page ──
    'proj.bridge': { en: 'Every solution here — legal, migratory, or investment — passes through the same Business Engineering cycle: see it, simulate it, then build it.', es: 'Cada solución aquí — legal, migratoria o de inversión — pasa por el mismo ciclo de Ingeniería de Negocios: verla, simularla y construirla.', pt: 'Cada solução aqui — legal, migratória ou de investimento — passa pelo mesmo ciclo de Engenharia de Negócios: vê-la, simulá-la e construí-la.' },
    'proj.title1': { en: 'Legal ', es: '', pt: '' },
    'proj.title2': { en: 'Solutions', es: 'Soluciones', pt: 'Soluções' },
    'proj.title3': { en: ' & Immigration', es: ' Legales y Migratorias', pt: ' Legais e Migratórias' },
    'proj.desc': { en: 'Comprehensive legal advisory for immigration & residence in Spain and Portugal, and innovative corporate investment processes with Tokenization and blockchain technologies. We combine specialized legal knowledge with process automation and financial simulation to streamline procedures and ensure compliance.', es: 'Asesoría legal integral para migración y residencia en España y Portugal, y procesos innovadores de inversión corporativa con Tokenización y tecnologías blockchain. Combinamos conocimiento jurídico especializado con automatización de procesos y simulación financiera para agilizar trámites y garantizar el cumplimiento normativo.', pt: 'Assessoria jurídica integral para imigração e residência na Espanha e em Portugal, e processos inovadores de investimento corporativo com Tokenização e tecnologias blockchain. Combinamos conhecimento jurídico especializado com automação de processos e simulação financeira para agilizar trâmites e garantir a conformidade normativa.' },
    'proj.flow': { en: 'Flow Status', es: 'Estado del Flujo', pt: 'Status do Fluxo' },
    'proj.synced': { en: 'Synced', es: 'Sincronizado', pt: 'Sincronizado' },
    'proj.efficiency': { en: 'Operational Progress', es: 'Progreso Operativo', pt: 'Progresso Operacional' },
    'proj.phase': { en: 'Phase', es: 'Fase', pt: 'Fase' },
    'proj.console1': { en: '> Executing BPA sequence...', es: '> Ejecutando secuencia BPA...', pt: '> Executando sequência BPA...' },
    'proj.console2': { en: '> Regulatory validation: OK.', es: '> Validación regulatoria: OK.', pt: '> Validação regulatória: OK.' },
    'proj.console3': { en: '> Node engineering: Active.', es: '> Ingeniería de nodos: Activa.', pt: '> Engenharia de nós: Ativa.' },
    'proj.solutions1': { en: 'Immigration ', es: '', pt: '' },
    'proj.solutions2': { en: 'Solutions', es: 'Soluciones', pt: 'Soluções' },
    'proj.solutions3': { en: '', es: ' Migratorias', pt: ' Migratórias' },
    'proj.solutions.desc': { en: 'Your Personal Cockpit — real-time information and management, built into your case.', es: 'Tu Cockpit personal — información y gestión en tiempo real, integrado a tu caso.', pt: 'Seu Cockpit pessoal — informação e gestão em tempo real, integrado ao seu caso.' },
    'proj.s1.title': { en: 'Social Settlement', es: 'Arraigo Social', pt: 'Arraigo Social' },
    'proj.s1.desc': { en: 'Comprehensive regularization management. We automate documentation and requirement tracking to ensure effective socio-labor integration.', es: 'Gestión integral de regularización por arraigo. Automatizamos la documentación y el seguimiento de requisitos para asegurar la integración sociolaboral efectiva.', pt: 'Gestão integral de regularização por arraigo. Automatizamos a documentação e o acompanhamento de requisitos para assegurar a integração sociolaboral efetiva.' },
    'proj.s1.link': { en: 'View Process', es: 'Ver Proceso', pt: 'Ver Processo' },
    'proj.s2.title': { en: 'Family Settlement', es: 'Arraigo Familiar', pt: 'Arraigo Familiar' },
    'proj.s2.desc': { en: 'Agile solutions for reunification and regularization of family ties. Simplified processes for family members of Spanish citizens.', es: 'Soluciones ágiles para la reagrupación y regularización de vínculos familiares. Procesos simplificados para familiares de ciudadanos españoles.', pt: 'Soluções ágeis para o reagrupamento e a regularização de vínculos familiares. Processos simplificados para familiares de cidadãos espanhóis.' },
    'proj.s2.link': { en: 'View Requirements', es: 'Ver Requisitos', pt: 'Ver Requisitos' },
    'proj.s3.title': { en: 'EU Family Member Card', es: 'Tarjeta de Familiar Comunitario UE', pt: 'Cartão de Familiar Comunitário UE' },
    'proj.s3.desc': { en: 'Expert processing for family members of EU citizens. We optimize residence obtainment times and community rights.', es: 'Tramitación experta para familiares de ciudadanos de la Unión Europea. Optimizamos los tiempos de obtención de residencia y derechos comunitarios.', pt: 'Tramitação especializada para familiares de cidadãos da União Europeia. Otimizamos os tempos de obtenção de residência e direitos comunitários.' },
    'proj.s3.link': { en: 'Start Process', es: 'Iniciar Trámite', pt: 'Iniciar Trâmite' },
    'proj.s4.title': { en: 'Non-Lucrative Residence', es: 'Residencia No Lucrativa', pt: 'Residência Não Lucrativa' },
    'proj.s4.desc': { en: 'Specialized advice for residing in Spain without working. Financial and document planning to guarantee approval.', es: 'Asesoría especializada para residir en España sin ejercer actividad laboral. Planificación financiera y documental para garantizar la aprobación.', pt: 'Assessoria especializada para residir na Espanha sem exercer atividade laboral. Planejamento financeiro e documental para garantir a aprovação.' },
    'proj.s4.link': { en: 'Consult', es: 'Consultar', pt: 'Consultar' },
    'proj.adv.title1': { en: 'Innovative ', es: '', pt: '' },
    'proj.adv.title2': { en: 'Legal Solutions', es: 'Soluciones Legales', pt: 'Soluções Legais' },
    'proj.adv.title3': { en: '', es: ' Innovadoras', pt: ' Inovadoras' },
    'proj.s5.title': { en: 'Investment Legal Support', es: 'Acompañamiento legal de inversiones', pt: 'Acompanhamento legal de investimentos' },
    'proj.s6.title': { en: 'Digital Nomad', es: 'Nómada Digital', pt: 'Nômade Digital' },
    'proj.s6.desc': { en: 'Residence authorization for non-EU workers and professionals who work remotely for companies or clients outside Spain and wish to reside legally in the country.', es: 'Autorización de residencia dirigida a trabajadores y profesionales no europeos que trabajen de forma remota para empresas o clientes fuera de España y deseen residir legalmente en el país.', pt: 'Autorização de residência dirigida a trabalhadores e profissionais não europeus que trabalham remotamente para empresas ou clientes fora da Espanha e desejam residir legalmente no país.' },
    'proj.s6.link': { en: 'Consult', es: 'Consultar', pt: 'Consultar' },
    'proj.s5.desc': { en: 'Legal security for your capital. We provide comprehensive legal support in real estate and business investment processes, mitigating risks and ensuring regulatory compliance.', es: 'Seguridad jurídica para su capital. Brindamos soporte legal integral en procesos de inversión inmobiliaria y empresarial, mitigando riesgos y asegurando el cumplimiento normativo.', pt: 'Segurança jurídica para o seu capital. Oferecemos suporte legal integral em processos de investimento imobiliário e empresarial, mitigando riscos e assegurando a conformidade normativa.' },
    'proj.s5.link': { en: 'Investment Advisory', es: 'Asesoría de Inversión', pt: 'Assessoria de Investimento' },
    'proj.s7.title': { en: 'Tokenization and Blockchain', es: 'Tokenización y Blockchain', pt: 'Tokenização e Blockchain' },
    'proj.s7.desc': { en: 'Legal structuring for tokenized assets and blockchain-based investment vehicles. We design compliant frameworks for digital securities, smart contracts and asset tokenization in International Markets.', es: 'Estructuración legal para activos tokenizados y vehículos de inversión basados en blockchain. Diseñamos marcos conformes para valores digitales, contratos inteligentes y tokenización de activos en mercados internacionales.', pt: 'Estruturação legal para ativos tokenizados e veículos de investimento baseados em blockchain. Desenhamos estruturas conformes para valores digitais, contratos inteligentes e tokenização de ativos em mercados internacionais.' },
    'proj.s7.link': { en: 'Tokenization Advisory', es: 'Asesoría en Tokenización', pt: 'Assessoria em Tokenização' },
    'proj.s8.title': { en: 'Legal "Express"', es: 'Legal "Express"', pt: 'Legal "Express"' },
    'proj.s8.desc': { en: 'A solution combining AI with our traditional legal team, designed to make clients self-sufficient in their day-to-day legal needs — drafting, reviewing and managing routine contracts and documents, with expert oversight on demand.', es: 'Una solución que combina IA con nuestro equipo legal tradicional, diseñada para que los clientes sean autosuficientes en sus necesidades legales del día a día: redactar, revisar y gestionar contratos y documentos rutinarios, con supervisión experta a demanda.', pt: 'Uma solução que combina IA com nossa equipe jurídica tradicional, projetada para tornar os clientes autossuficientes nas necessidades jurídicas do dia a dia: redigir, revisar e gerenciar contratos e documentos rotineiros, com supervisão especializada sob demanda.' },
    'proj.s8.link': { en: 'Explore Legal Express', es: 'Explorar Legal Express', pt: 'Explorar Legal Express' },
    'proj.cta.badge': { en: 'Next Level', es: 'Siguiente Nivel', pt: 'Próximo Nível' },
    'proj.cta.title': { en: 'Ready to engineer your process efficiency?', es: '¿Listo para realizar la ingeniería de eficiencia de sus procesos?', pt: 'Pronto para fazer a engenharia de eficiência dos seus processos?' },
    'proj.cta.desc': { en: 'Request a technical evaluation of your current workflows and discover how BPA automation can reduce risks and operating costs.', es: 'Solicite una evaluación técnica de sus flujos de trabajo actuales y descubra cómo la automatización BPA puede reducir riesgos y costes operativos.', pt: 'Solicite uma avaliação técnica dos seus fluxos de trabalho atuais e descubra como a automação BPA pode reduzir riscos e custos operacionais.' },
    'proj.cta.button': { en: 'Contact Us', es: 'Contactanos', pt: 'Fale Conosco' },

    // ── Studio Page ──
    'studio.title1': { en: 'Sustainable', es: 'Crecimiento', pt: 'Crescimento' },
    'studio.title2': { en: 'Growth', es: 'Sostenible', pt: 'Sustentável' },
    'studio.desc2': { en: 'We uncover what limits growth, simulate what could unlock it, and engineer the processes and capabilities to make it possible. Real-time visibility keeps the business learning and adapting as it grows.\n\nSustainable growth is not simply growing more. It is engineering a business capable of handling what growth demands.', es: 'Descubrimos qué limita el crecimiento, simulamos qué podría desbloquearlo y rediseñamos los procesos y capacidades para hacerlo posible. La visibilidad en tiempo real mantiene al negocio aprendiendo y adaptándose mientras crece.\n\nEl crecimiento sostenible no es simplemente crecer más. Es diseñar un negocio capaz de sostener lo que el crecimiento exige.', pt: 'Descobrimos o que limita o crescimento, simulamos o que poderia destravá-lo e projetamos os processos e capacidades para torná-lo possível. A visibilidade em tempo real mantém o negócio aprendendo e se adaptando enquanto cresce.\n\nCrescimento sustentável não é simplesmente crescer mais. É projetar um negócio capaz de sustentar o que o crescimento exige.' },
    'studio.desc3': { en: 'We engineer and simulate new ventures and growth initiatives before they become commitments — testing their business, operational and financial viability, and what sustainable growth will demand.', es: 'Diseñamos y simulamos nuevas empresas e iniciativas de crecimiento antes de que se conviertan en compromisos — probando su viabilidad de negocio, operativa y financiera, y lo que exigirá el crecimiento sostenible.', pt: 'Projetamos e simulamos novos empreendimentos e iniciativas de crescimento antes que se tornem compromissos — testando sua viabilidade de negócio, operacional e financeira, e o que o crescimento sustentável exigirá.' },
    'studio.cta1': { en: 'Process Audit', es: 'Auditoría de Procesos', pt: 'Auditoria de Processos' },
    'studio.dashboard.status': { en: 'Core Engine Status', es: 'Estado del Motor Central', pt: 'Status do Motor Central' },
    'studio.dashboard.active': { en: 'ACTIVE', es: 'ACTIVO', pt: 'ATIVO' },
    'studio.dashboard.dataflow': { en: 'Data Flow', es: 'Flujo de Datos', pt: 'Fluxo de Dados' },
    'studio.dashboard.automation': { en: 'Automation', es: 'Automatización', pt: 'Automação' },
    'studio.dashboard.scalability': { en: 'Scalability', es: 'Escalabilidad', pt: 'Escalabilidade' },
    'studio.dashboard.latency': { en: 'Latency < 2ms', es: 'Latencia < 2ms', pt: 'Latência < 2ms' },
    'studio.dashboard.coverage': { en: '94% Coverage', es: '94% Cobertura', pt: '94% Cobertura' },
    'studio.dashboard.unlimited': { en: 'Unlimited', es: 'Ilimitada', pt: 'Ilimitada' },
    'studio.dashboard.efficiency': { en: 'Operational Efficiency', es: 'Eficiencia Operativa', pt: 'Eficiência Operacional' },
    'studio.bpa.title1': { en: 'Operating Model ', es: '', pt: '' },
    'studio.bpa.title2': { en: 'Re-Engineering', es: 'Reingeniería', pt: 'Reengenharia' },
    'studio.bpa.title3': { en: '', es: ' del Modelo Operativo', pt: ' do Modelo Operacional' },
    'studio.bpa.desc': { en: "Map processes, understand, simulate, find improvements, Re-Engineer processes, simulate again, and select KPI's that matter and speed up the decision-making protocols.", es: 'Mapear procesos, entender, simular, encontrar mejoras, reingenierizar procesos, simular de nuevo y seleccionar los KPI que importan y aceleran los protocolos de toma de decisiones.', pt: 'Mapear processos, entender, simular, encontrar melhorias, reengenheirar processos, simular novamente e selecionar os KPIs que importam e aceleram os protocolos de tomada de decisão.' },
    'studio.today': { en: 'OPE Today', es: 'OPE Hoy', pt: 'OPE Hoje' },
    'studio.today.sub': { en: 'Manual Model (Obsolete)', es: 'Modelo Manual (Obsoleto)', pt: 'Modelo Manual (Obsoleto)' },
    'studio.today.1.title': { en: 'Fragmented Processes', es: 'Procesos Fragmentados', pt: 'Processos Fragmentados' },
    'studio.today.1.desc': { en: 'Information silos and critical human dependency.', es: 'Silos de información y dependencia humana crítica.', pt: 'Silos de informação e dependência humana crítica.' },
    'studio.today.2.title': { en: 'Data Latency', es: 'Latencia de Datos', pt: 'Latência de Dados' },
    'studio.today.2.desc': { en: 'Decisions based on last week\'s reports.', es: 'Decisiones basadas en reportes de la semana pasada.', pt: 'Decisões baseadas em relatórios da semana passada.' },
    'studio.today.3.title': { en: 'Linear Costs', es: 'Costos Lineales', pt: 'Custos Lineares' },
    'studio.today.3.desc': { en: 'Revenue growth means proportional headcount growth.', es: 'Crecer ingresos significa crecer nómina proporcionalmente.', pt: 'Crescer a receita significa crescer a folha proporcionalmente.' },
    'studio.today.4.title': { en: 'Passive Data', es: 'Datos Pasivos', pt: 'Dados Passivos' },
    'studio.today.4.desc': { en: 'Information sits in files; nobody acts on it.', es: 'La información reposa en archivos; nadie actúa sobre ella.', pt: 'A informação repousa em arquivos; ninguém age sobre ela.' },
    'studio.tomorrow': { en: 'OPE Tomorrow', es: 'OPE Mañana', pt: 'OPE Amanhã' },
    'studio.tomorrow.sub': { en: 'Scalable BPA Model', es: 'Modelo BPA Escalable', pt: 'Modelo BPA Escalável' },
    'studio.tomorrow.1.title': { en: 'Automated Orchestration', es: 'Orquestación Automatizada', pt: 'Orquestração Automatizada' },
    'studio.tomorrow.1.desc': { en: 'Autonomous "Trigger-Action" workflows.', es: 'Workflows autónomos "Trigger-Action".', pt: 'Workflows autônomos "Trigger-Action".' },
    'studio.tomorrow.2.title': { en: 'Real-Time KPIs', es: 'KPIs en Tiempo Real', pt: 'KPIs em Tempo Real' },
    'studio.tomorrow.2.desc': { en: 'Your Cockpit: live instruments for instant direction.', es: 'Tu Cockpit: instrumentos vivos para dirección instantánea.', pt: 'Seu Cockpit: instrumentos vivos para direção instantânea.' },
    'studio.tomorrow.3.title': { en: 'Exponential Scalability', es: 'Escalabilidad Exponencial', pt: 'Escalabilidade Exponencial' },
    'studio.tomorrow.3.desc': { en: 'Infrastructure that supports 10x demand without additional headcount.', es: 'Infraestructura que soporta 10x demanda sin + headcount.', pt: 'Infraestrutura que suporta 10x de demanda sem headcount adicional.' },
    'studio.tomorrow.4.title': { en: 'Alarms', es: 'Alarmas', pt: 'Alarmes' },
    'studio.tomorrow.4.desc': { en: 'Automatic alerts the moment a metric leaves its range.', es: 'Alertas automáticas en el momento en que una métrica sale de su rango.', pt: 'Alertas automáticos no momento em que uma métrica sai da sua faixa.' },
    'studio.sim.title1': { en: "Op's & Financial ", es: '', pt: '' },
    'studio.sim.title2': { en: 'Simulators', es: 'Simuladores', pt: 'Simuladores' },
    'studio.sim.title3': { en: '', es: ' Operativos y Financieros', pt: ' Operacionais e Financeiros' },
    'studio.sim.desc': { en: "Adjust process variables to project Op's or Financial impact.", es: 'Ajuste las variables de proceso para proyectar el impacto operativo o financiero.', pt: 'Ajuste variáveis de processo para projetar o impacto operacional ou financeiro.' },
    'studio.sim.core': { en: 'Core Coverage', es: 'Cobertura Core', pt: 'Cobertura do Núcleo' },
    'studio.sim.error': { en: 'Error Reduction', es: 'Reducción de Error', pt: 'Redução de Erros' },
    'studio.sim.speed': { en: 'Speed (Throughput)', es: 'Velocidad (Throughput)', pt: 'Velocidade (Throughput)' },
    'studio.sim.impact': { en: 'Impact Projection', es: 'Proyección de Impacto', pt: 'Projeção de Impacto' },
    'studio.sim.cockpit': { en: 'Business Cockpit', es: 'Business Cockpit', pt: 'Business Cockpit' },
    'studio.sim.preview': { en: 'Preview', es: 'Vista previa', pt: 'Prévia' },
    'studio.sim.inrange': { en: 'In range', es: 'En rango', pt: 'Na faixa' },
    'studio.sim.outrange': { en: 'Out of range', es: 'Fuera de rango', pt: 'Fora da faixa' },
    'studio.sim.alarm': { en: 'ALARM — projected efficiency below target. The Cockpit flags it while there is still time to act.', es: 'ALARMA — eficiencia proyectada por debajo del objetivo. El Cockpit lo señala mientras aún hay tiempo de actuar.', pt: 'ALARME — eficiência projetada abaixo da meta. O Cockpit sinaliza enquanto ainda há tempo de agir.' },
    'studio.sim.allok': { en: 'All indicators within range', es: 'Todos los indicadores en rango', pt: 'Todos os indicadores na faixa' },
    'studio.sim.disclaimer': { en: 'Illustrative projection based on your inputs — not live client data.', es: 'Proyección ilustrativa basada en tus variables — no son datos reales de clientes.', pt: 'Projeção ilustrativa baseada nas suas variáveis — não são dados reais de clientes.' },
    'studio.sim.scenarios': { en: 'Scenarios', es: 'Escenarios', pt: 'Cenários' },
    'studio.sim.scn.cons': { en: 'Conservative', es: 'Conservador', pt: 'Conservador' },
    'studio.sim.scn.base': { en: 'Base', es: 'Base', pt: 'Base' },
    'studio.sim.scn.aggr': { en: 'Aggressive', es: 'Agresivo', pt: 'Agressivo' },
    'studio.sim.scn.custom': { en: 'Custom', es: 'Personalizado', pt: 'Personalizado' },
    'studio.sim.throughput': { en: 'Throughput', es: 'Capacidad', pt: 'Capacidade' },
    'studio.sim.errorrate': { en: 'Error Rate', es: 'Tasa de Error', pt: 'Taxa de Erro' },
    'studio.sim.projection': { en: '12-Month Scenario Projection', es: 'Proyección del Escenario a 12 Meses', pt: 'Projeção do Cenário em 12 Meses' },
    'studio.sim.band': { en: 'P10–P90 range', es: 'Rango P10–P90', pt: 'Faixa P10–P90' },
    'studio.inv.projects.title': { en: 'Some of our projects', es: 'Algunos de nuestros proyectos', pt: 'Alguns dos nossos projetos' },
    'studio.sim.total': { en: 'Total Operational Efficiency', es: 'Eficiencia Operativa Total', pt: 'Eficiência Operacional Total' },
    'studio.sim.cycle': { en: 'Cycle Time', es: 'Tiempo de Ciclo', pt: 'Tempo de Ciclo' },
    'studio.sim.opex': { en: 'Monthly OPEX Savings', es: 'Ahorro OPEX Mensual', pt: 'Economia Mensal de OPEX' },
    'studio.road.label': { en: 'Implementation', es: 'Implementación', pt: 'Implementação' },
    'studio.road.title1': { en: 'BPA Discovery', es: 'Descubrimiento BPA', pt: 'Descoberta BPA' },
    'studio.road.title2': { en: ' and Execution Roadmap', es: ' y Roadmap de Ejecución', pt: ' e Roteiro de Execução' },
    'studio.road.s1.title': { en: 'Process Mining', es: 'Process Mining', pt: 'Process Mining' },
    'studio.road.s1.desc': { en: 'Digital X-ray of your current operations. We identify invisible bottlenecks and redundancies through log analysis.', es: 'Radiografía digital de sus operaciones actuales. Identificamos cuellos de botella invisibles y redundancias mediante análisis de logs.', pt: 'Raio-X digital das suas operações atuais. Identificamos gargalos invisíveis e redundâncias por meio da análise de logs.' },
    'studio.road.s2.title': { en: 'RPA & Orchestration', es: 'RPA & Orquestación', pt: 'RPA e Orquestração' },
    'studio.road.s2.desc': { en: 'Bot deployment for repetitive tasks and orchestration engine configuration connecting ERP, CRM, and Legacy systems.', es: 'Despliegue de bots para tareas repetitivas y configuración del motor de orquestación que conecta sistemas ERP, CRM y Legacy.', pt: 'Implantação de bots para tarefas repetitivas e configuração do motor de orquestração conectando ERP, CRM e sistemas legados.' },
    'studio.road.s3.title': { en: 'Cognitive Intelligence', es: 'Inteligencia Cognitiva', pt: 'Inteligência Cognitiva' },
    'studio.road.s3.desc': { en: 'Upper AI layer that learns from exceptions and autonomously optimizes workflows in real time.', es: 'Capa superior de IA que aprende de las excepciones y optimiza autónomamente los flujos de trabajo en tiempo real.', pt: 'Camada superior de IA que aprende com as exceções e otimiza fluxos de trabalho de forma autônoma em tempo real.' },
    // ── Investment Portfolio Section ──
    'studio.inv.label': { en: 'Projects & Investment Portfolio', es: 'Portafolio de Proyectos e Inversión', pt: 'Portfólio de Projetos e Investimentos' },
    'studio.inv.title1': { en: 'Strategic', es: 'Sectores', pt: 'Setores' },
    'studio.inv.title2': { en: 'Sectors', es: 'Estratégicos', pt: 'Estratégicos' },
    'studio.inv.desc': { en: 'Over 10 years of experience in asset analysis, providing security and international support to our investors in destinations with stable economies.', es: 'Más de 10 años de experiencia en análisis de activos, brindando seguridad y acompañamiento internacional a inversionistas en destinos con economías estables.', pt: 'Mais de 10 anos de experiência em análise de ativos, oferecendo segurança e acompanhamento internacional aos nossos investidores em destinos com economias estáveis.' },
    'studio.inv.bridge': { en: 'Every project in this portfolio was engineered the same way we advise our clients: understood, modeled and simulated before a single euro was committed.', es: 'Cada proyecto de este portafolio pasó por el mismo proceso con el que asesoramos a nuestros clientes: entendido, modelado y simulado antes de comprometer un solo euro.', pt: 'Cada projeto deste portfólio passou pelo mesmo processo com que assessoramos nossos clientes: entendido, modelado e simulado antes de comprometer um único euro.' },
    'studio.inv.stat1.value': { en: '10+', es: '10+', pt: '10+' },
    'studio.inv.stat1.label': { en: 'Years of Experience', es: 'Años de Experiencia', pt: 'Anos de Experiência' },
    'studio.inv.stat2.value': { en: 'Ontime', es: 'Oportuno', pt: 'Pontual' },
    'studio.inv.stat2.label': { en: 'Support', es: 'Soporte', pt: 'Suporte' },
    'studio.inv.stat3.value': { en: '7', es: '7', pt: '7' },
    'studio.inv.stat3.label': { en: 'Vertical Markets', es: 'Mercados Verticales', pt: 'Mercados Verticais' },
    'studio.inv.re.title': { en: 'Real Estate', es: 'Inmobiliario', pt: 'Imobiliário' },
    'studio.inv.re.desc': { en: 'Real estate investment projects with diverse profitability and appreciation models. Diversification in tangible and secure assets.', es: 'Proyectos de inversión en finca raíz con diversos modelos de rentabilidad y valorización. Diversificación en activos tangibles y seguros.', pt: 'Projetos de investimento imobiliário com diversos modelos de rentabilidade e valorização. Diversificação em ativos tangíveis e seguros.' },
    'studio.inv.re.tag': { en: 'Tangible Assets', es: 'Activos Tangibles', pt: 'Ativos Tangíveis' },
    'studio.inv.da.title': { en: 'Distress Assets', es: 'Activos de Oportunidad', pt: 'Ativos em Dificuldade' },
    'studio.inv.da.desc': { en: 'Acquisition of real estate assets from illiquidity situations or auctions. Purchase at discount over real commercial value, offering immediate profitability margin.', es: 'Adquisición de activos inmobiliarios provenientes de situaciones de iliquidez o remates. Compra con descuento sobre el valor comercial real, ofreciendo margen de rentabilidad inmediato.', pt: 'Aquisição de ativos imobiliários provenientes de situações de iliquidez ou leilões. Compra com desconto sobre o valor comercial real, oferecendo margem de rentabilidade imediata.' },
    'studio.inv.da.tag': { en: 'High Margin', es: 'Alto Margen', pt: 'Alta Margem' },
    'studio.inv.en.title': { en: 'Energy', es: 'Energía', pt: 'Energia' },
    'studio.inv.en.desc': { en: 'Sustainable energy generation from biomass and downstream projects: refining, processing, sales, and distribution.', es: 'Generación de energía sostenible a partir de biomasas y proyectos downstream: refinación, procesamiento, venta y distribución.', pt: 'Geração de energia sustentável a partir de biomassa e projetos downstream: refino, processamento, venda e distribuição.' },
    'studio.inv.en.tag': { en: 'Sustainable', es: 'Sostenible', pt: 'Sustentável' },
    'studio.inv.ft.title': { en: 'Fintech', es: 'Fintech', pt: 'Fintech' },
    'studio.inv.ft.desc': { en: 'Financial technology investments in Colombia. Payroll deduction microcredit model with low risk and high capital turnover.', es: 'Inversiones en tecnología financiera en Colombia. Modelo de microcréditos de libranza con bajo riesgo y alta rotación de capital.', pt: 'Investimentos em tecnologia financeira na Colômbia. Modelo de microcrédito com desconto em folha, de baixo risco e alta rotação de capital.' },
    'studio.inv.ft.tag': { en: 'Low Risk', es: 'Bajo Riesgo', pt: 'Baixo Risco' },
    'studio.inv.av.title': { en: 'Aviation', es: 'Aviación', pt: 'Aviação' },
    'studio.inv.av.desc': { en: 'Comprehensive management of aeronautical assets: purchase and sale, leasing, maintenance, and fleet modernization.', es: 'Gestión integral de activos aeronáuticos: compra y venta, leasing, mantenimiento y modernización de flotas.', pt: 'Gestão integral de ativos aeronáuticos: compra e venda, leasing, manutenção e modernização de frota.' },
    'studio.inv.av.tag': { en: 'Asset Management', es: 'Gestión de Activos', pt: 'Gestão de Ativos' },
    'studio.inv.ed.title': { en: 'Edutainment', es: 'Edutainment', pt: 'Edutainment' },
    'studio.inv.ed.desc': { en: 'Innovative projects combining leisure and immersive learning. Social and educational impact for families and communities.', es: 'Proyectos innovadores que combinan ocio y aprendizaje inmersivo. Impacto social y educativo para familias y comunidades.', pt: 'Projetos inovadores que combinam lazer e aprendizado imersivo. Impacto social e educacional para famílias e comunidades.' },
    'studio.inv.ed.tag': { en: 'Social Impact', es: 'Impacto Social', pt: 'Impacto Social' },
    'studio.inv.tech.title': { en: 'Technology & AI', es: 'Tecnología & IA', pt: 'Tecnologia e IA' },
    'studio.inv.tech.desc': { en: 'Investment in BPA platforms, artificial intelligence, and process automation systems. Scalable digital infrastructure with predictive analytics and cognitive orchestration engines.', es: 'Inversión en plataformas BPA, inteligencia artificial y sistemas de automatización de procesos. Infraestructura digital escalable con analítica predictiva y motores de orquestación cognitiva.', pt: 'Investimento em plataformas BPA, inteligência artificial e sistemas de automação de processos. Infraestrutura digital escalável com análise preditiva e motores de orquestração cognitiva.' },
    'studio.inv.tech.tag': { en: 'Digital Infrastructure', es: 'Infraestructura Digital', pt: 'Infraestrutura Digital' },
    'studio.inv.cta': { en: 'Explore Opportunities', es: 'Explorar Oportunidades', pt: 'Explorar Oportunidades' },

    // Investment Process Steps
    'studio.inv.process.label': { en: 'How to Invest', es: 'Cómo Invertir', pt: 'Como Investir' },
    'studio.inv.process.title': { en: 'Investment Process', es: 'Proceso de Inversión', pt: 'Processo de Investimento' },
    'studio.inv.step1.title': { en: 'Initial Consultation', es: 'Consulta Inicial', pt: 'Consulta Inicial' },
    'studio.inv.step1.desc': { en: 'We evaluate your investor profile, objectives, and risk appetite to identify optimal sectors.', es: 'Evaluamos tu perfil de inversionista, objetivos y apetito de riesgo para identificar los sectores óptimos.', pt: 'Avaliamos seu perfil de investidor, objetivos e apetite de risco para identificar os setores ideais.' },
    'studio.inv.step2.title': { en: 'Due Diligence', es: 'Due Diligence', pt: 'Due Diligence' },
    'studio.inv.step2.desc': { en: 'Legal, financial, and technical review of each project. Full documentation shared before any commitment.', es: 'Revisión legal, financiera y técnica de cada proyecto. Documentación completa compartida antes de cualquier compromiso.', pt: 'Revisão legal, financeira e técnica de cada projeto. Documentação completa compartilhada antes de qualquer compromisso.' },
    'studio.inv.step3.title': { en: 'Structured Participation', es: 'Participación Estructurada', pt: 'Participação Estruturada' },
    'studio.inv.step3.desc': { en: 'Equity participation, project financing, or direct asset acquisition — each model with clear legal frameworks.', es: 'Participación accionaria, financiación de proyectos o adquisición directa de activos — cada modelo con marcos legales claros.', pt: 'Participação acionária, financiamento de projetos ou aquisição direta de ativos — cada modelo com marcos legais claros.' },
    'studio.inv.step4.title': { en: 'Monitoring & Reporting', es: 'Monitoreo y Reportes', pt: 'Monitoramento e Relatórios' },
    'studio.inv.step4.desc': { en: 'Your Investor Cockpit: real-time performance indicators, direct access to project managers, and transparent capital tracking.', es: 'Tu Investor Cockpit: indicadores de rendimiento en tiempo real, acceso directo a gestores del proyecto y seguimiento transparente de capital.', pt: 'Seu Investor Cockpit: indicadores de desempenho em tempo real, acesso direto aos gestores de projeto e rastreamento transparente do capital.' },

    // Key Investment Data

    // Trust Signals
    'studio.inv.security': { en: 'Investment Security', es: 'Seguridad de Inversión', pt: 'Segurança do Investimento' },
    'studio.inv.international': { en: 'International Destinations', es: 'Destinos Internacionales', pt: 'Destinos Internacionais' },
    'studio.inv.track': { en: '10+ Years Track Record', es: '10+ Años de Trayectoria', pt: '10+ Anos de Trajetória' },
    'studio.inv.protection': { en: 'Capital Protection', es: 'Protección de Capital', pt: 'Proteção de Capital' },
    'studio.inv.protection.desc': { en: 'Fiduciary structures and legally constituted vehicles to safeguard investor capital in each project.', es: 'Estructuras fiduciarias y vehículos legalmente constituidos para salvaguardar el capital del inversionista en cada proyecto.', pt: 'Estruturas fiduciárias e veículos legalmente constituídos para proteger o capital do investidor em cada projeto.' },
    'studio.inv.managers': { en: 'Project Managers', es: 'Gestores de Proyecto', pt: 'Gestores de Projeto' },
    'studio.inv.managers.desc': { en: 'Direct point of contact for each investment with periodic reports and full traceability.', es: 'Punto de contacto directo para cada inversión con reportes periódicos y trazabilidad completa.', pt: 'Ponto de contato direto para cada investimento, com relatórios periódicos e rastreabilidade total.' },

    'studio.final.title': { en: 'Activate Your Growth Engine', es: 'Active su Motor de Crecimiento', pt: 'Ative Seu Motor de Crescimento' },
    'studio.final.desc': { en: 'Real scalability begins when processes run on their own. Schedule a technical demo of our BPA solutions.', es: 'La escalabilidad real comienza cuando los procesos funcionan solos. Agende una demo técnica de nuestras soluciones BPA.', pt: 'A escalabilidade real começa quando os processos funcionam sozinhos. Agende uma demonstração técnica das nossas soluções BPA.' },
    'studio.final.cta1': { en: 'Start Transformation', es: 'Iniciar Transformación', pt: 'Iniciar Transformação' },
    'studio.final.cta2': { en: 'Download Whitepaper', es: 'Descargar Whitepaper', pt: 'Baixar Whitepaper' },

    // ── About Page ──
    'about.title1': { en: 'Business', es: 'Ingeniería de', pt: 'Engenharia de' },
    'about.title2': { en: 'Engineering', es: 'Negocios', pt: 'Negócios' },
    'about.desc': { en: 'Business Engineering is built with the client, not around them.\n\nThe client knows the reality of their business. PRO CORP brings the method to challenge it, understand it, simulate alternatives, and transform it. Leadership, the client’s team, and PRO CORP work together on the decisions that matter.', es: 'La Ingeniería de Negocios se construye con el cliente, no alrededor de él.\n\nEl cliente conoce la realidad de su negocio. PRO CORP aporta el método para cuestionarla, entenderla, simular alternativas y transformarla. La dirección, el equipo del cliente y PRO CORP trabajan juntos en las decisiones que importan.', pt: 'A Engenharia de Negócios se constrói com o cliente, não ao redor dele.\n\nO cliente conhece a realidade do seu negócio. A PRO CORP traz o método para desafiá-la, entendê-la, simular alternativas e transformá-la. A liderança, a equipe do cliente e a PRO CORP trabalham juntas nas decisões que importam.' },
    'about.who.title1': { en: 'Who we ', es: 'Para quién ', pt: 'Para quem ' },
    'about.who.title2': { en: 'work for', es: 'trabajamos', pt: 'trabalhamos' },
    'about.who.1': { en: 'Leaders whose business has outgrown its own visibility.', es: 'Líderes cuyo negocio ha crecido más allá de su propia visibilidad.', pt: 'Líderes cujo negócio cresceu além da própria visibilidade.' },
    'about.who.2': { en: 'Companies where the information exists but the picture doesn\'t.', es: 'Empresas donde la información existe pero el panorama no.', pt: 'Empresas onde a informação existe, mas o panorama não.' },
    'about.who.3': { en: 'Owners of complex assets that deserve better decisions.', es: 'Dueños de activos complejos que merecen mejores decisiones.', pt: 'Donos de ativos complexos que merecem decisões melhores.' },
    'about.who.4': { en: 'Entrepreneurs and investors who want new ventures engineered — and simulated — before they commit.', es: 'Emprendedores e inversionistas que quieren sus nuevos proyectos diseñados — y simulados — antes de comprometerse.', pt: 'Empreendedores e investidores que querem seus novos projetos projetados — e simulados — antes de se comprometer.' },
    'about.commit.title1': { en: 'Our ', es: 'Nuestro ', pt: 'Nosso ' },
    'about.commit.title2': { en: 'commitment', es: 'compromiso', pt: 'compromisso' },
    'about.commit.1': { en: 'We engineer businesses for what they could become.', es: 'Ingeniamos negocios por lo que podrían llegar a ser.', pt: 'Engenhamos negócios pelo que eles poderiam se tornar.' },
    'about.commit.2': { en: 'We make complexity understandable and possibilities visible — while there is still time to act.', es: 'Hacemos la complejidad comprensible y las posibilidades visibles — mientras aún hay tiempo de actuar.', pt: 'Tornamos a complexidade compreensível e as possibilidades visíveis — enquanto ainda há tempo de agir.' },
    'about.commit.3': { en: 'Our value is not in any single discipline. It is in connecting them.', es: 'Nuestro valor no está en ninguna disciplina individual. Está en conectarlas.', pt: 'Nosso valor não está em nenhuma disciplina isolada. Está em conectá-las.' },
    'about.commit.4': { en: 'Our sense of urgency and responsiveness is a solid asset for your company.', es: 'Nuestro sentido de urgencia y capacidad de respuesta es un activo sólido para tu empresa.', pt: 'Nosso senso de urgência e capacidade de resposta é um ativo sólido para a sua empresa.' },
    'about.mission.title1': { en: 'What would ', es: '¿Qué resolvería la ', pt: 'O que a ' },
    'about.mission.title2': { en: 'Business Engineering', es: 'Ingeniería de Negocios', pt: 'Engenharia de Negócios' },
    'about.mission.title3': { en: ' solve for you?', es: ' para ti?', pt: ' resolveria para você?' },
    'about.mission.desc': { en: 'Our Business Engineering approach delivers concrete outcomes in every engagement: time saved, risk reduced, costs lowered.', es: 'Nuestro enfoque de Ingeniería de Negocios entrega resultados concretos en cada proyecto: tiempo ahorrado, riesgo reducido, costos disminuidos.', pt: 'Nossa abordagem de Engenharia de Negócios entrega resultados concretos em cada projeto: tempo economizado, risco reduzido, custos menores.' },
    'about.f1.title': { en: 'Legal Solutions', es: 'Soluciones Legales', pt: 'Soluções Legais' },
    'about.f1.desc': { en: 'You need to invest abroad but lack legal certainty? We structure the entire operation — technical structuring and corporate shielding.', es: '¿Necesitas invertir en el exterior pero te falta certeza legal? Estructuramos toda la operación — estructuración técnica y blindaje corporativo.', pt: 'Precisa investir no exterior mas falta certeza jurídica? Estruturamos toda a operação — estruturação técnica e blindagem corporativa.' },
    'about.f2.title': { en: 'Sustainable Growth - BPA', es: 'Crecimiento Sostenible - BPA', pt: 'Crescimento Sustentável - BPA' },
    'about.f2.desc': { en: 'Your operations depend on spreadsheets and manual follow-ups? We re-engineer them into automated workflows designed to support massive load.', es: '¿Tus operaciones dependen de hojas de cálculo y seguimientos manuales? Las reingeniamos en flujos automatizados diseñados para soportar carga masiva.', pt: 'Suas operações dependem de planilhas e acompanhamentos manuais? Nós as reengenhamos em fluxos automatizados projetados para suportar carga massiva.' },
    'about.f3.title': { en: 'IP (Intellectual Property)', es: 'IP (Propiedad Intelectual)' },
    'about.f3.desc': { en: 'Your immigration paperwork takes months? We automate tracking and cut processing time — protecting and structuring your intellectual property assets.', es: '¿Tus trámites migratorios tardan meses? Automatizamos el seguimiento y reducimos los tiempos — protegiendo y estructurando tus activos de propiedad intelectual.' },
    'about.team.label': { en: 'Our Team', es: 'Nuestro Equipo', pt: 'Nossa Equipe' },
    'about.team.title': { en: 'Business Engineers', es: 'Ingenieros de Negocios', pt: 'Engenheiros de Negócios' },
    'about.method.label': { en: 'Our Methodology', es: 'Nuestra Metodología', pt: 'Nossa Metodologia' },
    'about.method.title.pre': { en: 'Pro Corp', es: 'El Ciclo Pro Corp de', pt: 'O Ciclo Pro Corp de' },
    'about.method.title.accent': { en: 'Value Finding and Value Creation', es: 'Descubrimiento y Creación de Valor', pt: 'Descoberta e Criação de Valor' },
    'about.method.title.post': { en: 'Cycle', es: '', pt: '' },
    'about.method.desc': { en: 'Our Business Engineering methodology is a continuous cycle designed to eliminate uncertainty and maximize return.', es: 'Nuestra metodología de Ingeniería de Negocios es un ciclo continuo diseñado para eliminar la incertidumbre y maximizar el retorno.', pt: 'Nossa metodologia de Engenharia de Negócios é um ciclo contínuo projetado para eliminar a incerteza e maximizar o retorno.' },
    'about.step1': { en: 'Understand', es: 'Entender', pt: 'Entender' },
    'about.step1.desc': { en: 'See the business as it really is. People, processes, economics, constraints, opportunities.', es: 'Ver el negocio tal como es. Personas, procesos, economía, restricciones, oportunidades.', pt: 'Ver o negócio como ele realmente é. Pessoas, processos, economia, restrições, oportunidades.' },
    'about.step2': { en: 'Model', es: 'Modelar', pt: 'Modelar' },
    'about.step2.desc': { en: 'Make how the business works visible — a living model of how it behaves.', es: 'Hacer visible cómo funciona el negocio — un modelo vivo de cómo se comporta.', pt: 'Tornar visível como o negócio funciona — um modelo vivo de como ele se comporta.' },
    'about.step3': { en: 'Simulate', es: 'Simular', pt: 'Simular' },
    'about.step3.desc': { en: 'Test what could happen before deciding what should.', es: 'Probar lo que podría pasar antes de decidir lo que debe pasar.', pt: 'Testar o que poderia acontecer antes de decidir o que deve acontecer.' },
    'about.step4': { en: 'Engineer', es: '"Re-Engineer"', pt: '"Re-Engineer"' },
    'about.step4.desc': { en: 'Challenge what is. Design what could be.', es: 'Cuestionar lo que es. Diseñar lo que podría ser.', pt: 'Desafiar o que é. Projetar o que poderia ser.' },
    'about.step5': { en: 'Execute', es: 'Ejecutar', pt: 'Executar' },
    'about.step5.desc': { en: 'Turn the better design into working reality — build, integrate and automate, applying AI and technology where they create real leverage.', es: 'Convertir el mejor diseño en realidad operativa: construir, integrar y automatizar, aplicando IA y tecnología donde crean verdadera palanca.', pt: 'Transformar o melhor design em realidade operacional: construir, integrar e automatizar, aplicando IA e tecnologia onde criam alavancagem real.' },
    'about.step6': { en: 'Learn & Repeat', es: 'Aprender y Repetir', pt: 'Aprender e Repetir' },
    'about.step6.desc': { en: 'Measure reality. Improve the model. Begin again.', es: 'Medir la realidad. Mejorar el modelo. Volver a empezar.', pt: 'Medir a realidade. Melhorar o modelo. Começar de novo.' },
    'about.rt.name': { en: 'Business Cockpit', es: 'Business Cockpit', pt: 'Business Cockpit' },
    'about.rt.label': { en: 'Real Time', es: 'Tiempo Real', pt: 'Tempo Real' },
    'about.rt.desc': { en: 'Know what matters while there is still time to act.', es: 'Saber lo que importa mientras aún hay tiempo de actuar.', pt: 'Saber o que importa enquanto ainda há tempo de agir.' },
    'about.method.repeat': { en: 'Because a business is never finished. Neither is Business Engineering.', es: 'Porque un negocio nunca está terminado. La Ingeniería de Negocios tampoco.', pt: 'Porque um negócio nunca está pronto. A Engenharia de Negócios também não.' },
    'about.cta.title': { en: 'Ready for Business Engineering?', es: '¿Listo para la Ingeniería de Negocios?', pt: 'Pronto para a Engenharia de Negócios?' },
    'about.cta.desc': { en: 'Schedule an initial diagnostic session and discover how our Business Engineering methodology can transform your corporation.', es: 'Agenda una sesión de diagnóstico inicial y descubre cómo nuestra Ingeniería de Negocios puede transformar tu corporación.', pt: 'Agende uma sessão inicial de diagnóstico e descubra como nossa Engenharia de Negócios pode transformar sua corporação.' },
    'about.cta.btn1': { en: 'Start Diagnosis', es: 'Iniciar Diagnóstico', pt: 'Iniciar Diagnóstico' },
    'about.cta.btn2': { en: 'View Some Projects', es: 'Ver Algunos Proyectos', pt: 'Ver Alguns Projetos' },
    'about.desc2': { en: 'Technology is the instrument.\nAI is the accelerator.\nSimulation is understanding.\nExecution is the differentiator.', es: 'La tecnología es el instrumento.\nLa IA es el acelerador.\nLa simulación es entendimiento.\nLa ejecución es el diferenciador.', pt: 'A tecnologia é o instrumento.\nA IA é o acelerador.\nA simulação é entendimento.\nA execução é o diferenciador.' },
    'about.closing': { en: '"See" what is. Imagine what could be. Engineer the difference.', es: '"Ver" lo que es. Imaginar lo que podría ser. "Engineer" la diferencia.', pt: '"Ver" o que é. Imaginar o que poderia ser. "Engineer" a diferença.' },

    // ── Contact Page ──
    'contact.badge': { en: 'Technology enabling business growth', es: 'Tecnología que habilita el crecimiento del negocio', pt: 'Tecnologia que habilita o crescimento do negócio' },
    'contact.title1': { en: 'Start your transformation towards an', es: 'Inicie su transformación hacia un', pt: 'Comece sua transformação rumo a um' },
    'contact.title2': { en: 'automated operating model', es: 'modelo operativo automatizado', pt: 'modelo operacional automatizado' },
    'contact.desc2': { en: 'Connect with our solution architects to implement BPA (Business Process Automation) strategies. We optimize workflows through intelligent automation and real-time monitoring.', es: 'Conecte con nuestros arquitectos de soluciones para implementar estrategias de BPA (Business Process Automation). Optimizamos flujos de trabajo mediante automatización inteligente y monitoreo en tiempo real.', pt: 'Conecte-se com nossos arquitetos de soluções para implementar estratégias de BPA (Business Process Automation). Otimizamos fluxos de trabalho por meio de automação inteligente e monitoramento em tempo real.' },
    'contact.name': { en: 'Full Name', es: 'Nombre Completo', pt: 'Nome Completo' },
    'contact.name.ph': { en: 'e.g. Ana Garcia', es: 'Ej. Ana García', pt: 'ex.: Ana Garcia' },
    'contact.org': { en: 'Organization', es: 'Organización', pt: 'Organização' },
    'contact.org.ph': { en: 'Company name', es: 'Nombre de su empresa', pt: 'Nome da empresa' },
    'contact.email': { en: 'Corporate Email', es: 'Correo Corporativo', pt: 'E-mail Corporativo' },
    'contact.email.ph': { en: 'name@company.com', es: 'nombre@empresa.com', pt: 'nome@empresa.com' },
    'contact.phone': { en: 'Contact Phone', es: 'Teléfono de Contacto', pt: 'Telefone de Contato' },
    'contact.phone.ph': { en: '+57 300 000 0000', es: '+57 300 000 0000', pt: '+57 300 000 0000' },
    'contact.area': { en: 'Area of Interest', es: 'Área de Interés', pt: 'Área de Interesse' },
    'contact.area.ph': { en: 'Select the required service', es: 'Seleccione el servicio requerido', pt: 'Selecione o serviço necessário' },
    'contact.area.1': { en: 'Business Process Automation', es: 'Automatización de Procesos de Negocio', pt: 'Business Process Automation' },
    'contact.area.2': { en: 'Functional Process Mapping', es: 'Mapeo Funcional de Procesos', pt: 'Mapeamento Funcional de Processos' },
    'contact.area.3': { en: 'Operating Model Re-engineering', es: 'Reingeniería de Modelos Operativos', pt: 'Reengenharia de Modelos Operacionais' },
    'contact.area.4': { en: 'LIA Implementation', es: 'Implementación de LIA', pt: 'Implementação da LIA' },
    'contact.area.5': { en: 'Digital Inventory', es: 'Inventario Digital', pt: 'Inventário Digital' },
    'contact.area.6': { en: 'Financial Simulation', es: 'Simulación Financiera', pt: 'Simulação Financeira' },
    'contact.area.7': { en: 'Operations Simulation', es: 'Simulación de Operaciones', pt: 'Simulação de Operações' },
    'contact.area.8': { en: 'Project Mapping and Structuring', es: 'Mapeo y Estructuración de Proyectos', pt: 'Mapeamento e Estruturação de Projetos' },
    'contact.area.9': { en: 'Tokenization', es: 'Tokenización', pt: 'Tokenização' },
    'contact.area.10': { en: 'Legal "Express"', es: 'Legal "Express"', pt: 'Legal "Express"' },
    'contact.area.11': { en: 'Business Cockpit / Real-Time Reporting', es: 'Business Cockpit / Reportes en Tiempo Real', pt: 'Business Cockpit / Relatórios em Tempo Real' },
    'contact.level': { en: 'Current Digitalization Level', es: 'Nivel de Digitalización Actual', pt: 'Nível Atual de Digitalização' },
    'contact.level.ph': { en: 'Indicate your current state', es: 'Indique su estado actual', pt: 'Indique seu estado atual' },
    'contact.level.1': { en: 'Initial (Predominantly manual processes)', es: 'Inicial (Procesos manuales predominantes)', pt: 'Inicial (Processos predominantemente manuais)' },
    'contact.level.2': { en: 'Developing (Isolated tools)', es: 'En desarrollo (Herramientas aisladas)', pt: 'Em desenvolvimento (Ferramentas isoladas)' },
    'contact.level.3': { en: 'Advanced (Integrated systems)', es: 'Avanzado (Sistemas integrados)', pt: 'Avançado (Sistemas integrados)' },
    'contact.level.4': { en: 'Optimized (Intelligent automation)', es: 'Optimizado (Automatización inteligente)', pt: 'Otimizado (Automação inteligente)' },
    'contact.details': { en: 'Project Details', es: 'Detalles del Proyecto', pt: 'Detalhes do Projeto' },
    'contact.details.ph': { en: 'Describe your business, your goals, and what you would want your Business Cockpit to show...', es: 'Describa su negocio, sus objetivos y qué querría ver en su Business Cockpit...', pt: 'Descreva seu negócio, seus objetivos e o que gostaria de ver no seu Business Cockpit...' },
    'contact.privacy': { en: 'I have read and accept the', es: 'He leído y acepto la', pt: 'Li e aceito a' },
    'contact.privacy.link': { en: 'Privacy Policy', es: 'Política de Privacidad', pt: 'Política de Privacidade' },
    'contact.privacy.auth': { en: '. I authorize the analysis of my data for technology architecture proposals.', es: '. Autorizo el análisis de mis datos para propuestas de arquitectura tecnológica.', pt: '. Autorizo a análise dos meus dados para propostas de arquitetura tecnológica.' },
    'contact.submit': { en: 'Request an Opportunity Assessment', es: 'Solicitar una Evaluación de Oportunidad', pt: 'Solicitar uma Avaliação de Oportunidade' },
    'contact.info0.title': { en: 'Houston — Main', es: 'Houston — Principal', pt: 'Houston — Principal' },
    'contact.info0.line1': { en: 'Neils Branch Dr', es: 'Neils Branch Dr', pt: 'Neils Branch Dr' },
    'contact.info0.line2': { en: 'Houston, TX 77077', es: 'Houston, TX 77077', pt: 'Houston, TX 77077' },
    'contact.info0.link': { en: 'View on map', es: 'Ver en mapa', pt: 'Ver no mapa' },
    'contact.info1.title': { en: 'Bogotá — Business Development Office', es: 'Bogotá — Oficina de Desarrollo de Negocios', pt: 'Bogotá — Escritório de Desenvolvimento de Negócios' },
    'contact.info1.line1': { en: 'Calle 127A #7-19, Office 301B', es: 'Calle 127A #7-19, Oficina 301B', pt: 'Calle 127A #7-19, Escritório 301B' },
    'contact.info1.line2': { en: 'Centro Empresarial Acces, Bogotá', es: 'Centro Empresarial Acces, Bogotá', pt: 'Centro Empresarial Acces, Bogotá' },
    'contact.info2.title': { en: 'Madrid — Office', es: 'Madrid — Oficina', pt: 'Madrid — Escritório' },
    'contact.info2.line1': { en: 'Calle Jorge Juan 30, Floor 1', es: 'Calle Jorge Juan 30, Piso 1', pt: 'Calle Jorge Juan 30, 1º Andar' },
    'contact.info2.line2': { en: '28001 Barrio Salamanca, Madrid', es: '28001 Barrio Salamanca, Madrid', pt: '28001 Barrio Salamanca, Madrid' },
    'contact.info2.link': { en: 'View on map', es: 'Ver en mapa', pt: 'Ver no mapa' },
    'contact.info3.title': { en: 'Direct Contact', es: 'Contacto Directo', pt: 'Contato Direto' },
    'contact.info3.line1': { en: 'extranjeria@pro-corp.net', es: 'extranjeria@pro-corp.net', pt: 'extranjeria@pro-corp.net' },
    'contact.info3.line2': { en: '+57 300 929 2911 · +34 665 325 994', es: '+57 300 929 2911 · +34 665 325 994', pt: '+57 300 929 2911 · +34 665 325 994' },
    'contact.info3.link': { en: 'Chat on WhatsApp', es: 'Chatear por WhatsApp', pt: 'Conversar no WhatsApp' },
    'contact.map': { en: 'Business Development Office — Operational', es: 'Oficina de Desarrollo de Negocios — Operativa', pt: 'Escritório de Desenvolvimento de Negócios — Operacional' },
    'footer.location': { en: 'Headquarters', es: 'Sede Central', pt: 'Sede' },
    'footer.location.address': { en: 'Calle 127A #7-19, Office 301B', es: 'Calle 127A #7-19, Oficina 301B', pt: 'Calle 127A #7-19, Escritório 301B' },
    'footer.location.city': { en: 'Centro Empresarial Acces — Bogotá, Colombia', es: 'Centro Empresarial Acces — Bogotá, Colombia', pt: 'Centro Empresarial Acces — Bogotá, Colômbia' },
    'footer.location.cta': { en: 'Get Directions', es: 'Cómo Llegar', pt: 'Como Chegar' },
    'footer.offices': { en: 'Our Offices', es: 'Nuestras Oficinas', pt: 'Nossos Escritórios' },
    'footer.office.houston': { en: 'Houston', es: 'Houston', pt: 'Houston' },
    'footer.office.houston.label': { en: 'Main', es: 'Principal', pt: 'Principal' },
    'footer.office.houston.address': { en: 'Neils Branch Dr, Houston, TX 77077', es: 'Neils Branch Dr, Houston, TX 77077', pt: 'Neils Branch Dr, Houston, TX 77077' },
    'footer.office.bogota': { en: 'Bogotá', es: 'Bogotá', pt: 'Bogotá' },
    'footer.office.bogota.label': { en: 'Business Development Office', es: 'Oficina de Desarrollo de Negocios', pt: 'Escritório de Desenvolvimento de Negócios' },
    'footer.office.bogota.address': { en: 'Calle 127A #7-19, Of. 301B', es: 'Calle 127A #7-19, Of. 301B', pt: 'Calle 127A #7-19, Of. 301B' },
    'footer.office.madrid': { en: 'Madrid', es: 'Madrid', pt: 'Madrid' },
    'footer.office.madrid.label': { en: 'Office', es: 'Oficina', pt: 'Escritório' },
    'footer.office.madrid.address': { en: 'Calle Jorge Juan 30, Floor 1', es: 'Calle Jorge Juan 30, Piso 1', pt: 'Calle Jorge Juan 30, 1º Andar' },
    'footer.office.contact': { en: 'Contact', es: 'Contacto', pt: 'Contato' },
    'footer.office.contact.label': { en: 'Direct Line', es: 'Línea Directa', pt: 'Linha Direta' },
    'footer.office.contact.wa.spain': { en: 'WhatsApp Spain Clients', es: 'WhatsApp Clientes España', pt: 'WhatsApp Clientes Espanha' },
    'footer.office.contact.wa.portugal': { en: 'WhatsApp Portugal Clients', es: 'WhatsApp Clientes Portugal', pt: 'WhatsApp Clientes Portugal' },
    'footer.map.close': { en: 'Close', es: 'Cerrar', pt: 'Fechar' },

    // ── Privacy Policy Page ──
    'privacy.badge': { en: 'Legal', es: 'Legal', pt: 'Legal' },
    'privacy.title': { en: 'Data Processing Policy', es: 'Política de Tratamiento de Datos', pt: 'Política de Tratamento de Dados' },
    'privacy.updated': { en: 'Last updated: March 2026', es: 'Última actualización: Marzo 2026', pt: 'Última atualização: março de 2026' },
    'privacy.intro': {
        en: 'PRO CORP S.A.S. (hereinafter "Pro Corp"), with registered address at Calle 127A #7-19, Office 301B, Centro Empresarial Acces, Bogotá, Colombia, and representative office at Calle Jorge Juan 30, Floor 1, 28001 Madrid, Spain, is committed to protecting the privacy and personal data of its users, clients, and collaborators in accordance with applicable regulations.',
        es: 'PRO CORP S.A.S. (en adelante "Pro Corp"), con domicilio en la Calle 127A #7-19, Oficina 301B, Centro Empresarial Acces, Bogotá, Colombia, y oficina de representación en la Calle Jorge Juan 30, Piso 1, 28001 Madrid, España, se compromete a proteger la privacidad y los datos personales de sus usuarios, clientes y colaboradores de acuerdo con la normativa aplicable.', pt: 'A PRO CORP S.A.S. (doravante "Pro Corp"), com sede na Calle 127A #7-19, Escritório 301B, Centro Empresarial Acces, Bogotá, Colômbia, e escritório de representação na Calle Jorge Juan 30, 1º Andar, 28001 Madri, Espanha, compromete-se a proteger a privacidade e os dados pessoais de seus usuários, clientes e colaboradores de acordo com as normas aplicáveis.'
    },
    'privacy.s1.title': { en: 'Applicable Regulations', es: 'Normativa Aplicable', pt: 'Normas Aplicáveis' },
    'privacy.s1.text': {
        en: 'This policy complies with: (i) Colombian Law 1581 of 2012 and Decree 1377 of 2013 on Personal Data Protection; (ii) EU General Data Protection Regulation (GDPR) 2016/679; (iii) Spanish Organic Law 3/2018 on Personal Data Protection and Digital Rights Guarantee (LOPDGDD).',
        es: 'Esta política cumple con: (i) la Ley 1581 de 2012 y el Decreto 1377 de 2013 sobre Protección de Datos Personales de Colombia; (ii) el Reglamento General de Protección de Datos (RGPD) 2016/679 de la Unión Europea; (iii) la Ley Orgánica 3/2018 de Protección de Datos Personales y Garantía de los Derechos Digitales de España (LOPDGDD).', pt: 'Esta política cumpre: (i) a Lei colombiana 1581 de 2012 e o Decreto 1377 de 2013 sobre Proteção de Dados Pessoais; (ii) o Regulamento Geral de Proteção de Dados da UE (GDPR) 2016/679; (iii) a Lei Orgânica espanhola 3/2018 de Proteção de Dados Pessoais e Garantia dos Direitos Digitais (LOPDGDD).'
    },
    'privacy.s2.title': { en: 'Data Controller', es: 'Responsable del Tratamiento', pt: 'Responsável pelo Tratamento' },
    'privacy.s2.text': {
        en: 'PRO CORP S.A.S.\nCalle 127A #7-19, Office 301B\nCentro Empresarial Acces, Bogotá, Colombia\nEmail: extranjeria@pro-corp.net\nPhone: +57 300 929 2911',
        es: 'PRO CORP S.A.S.\nCalle 127A #7-19, Oficina 301B\nCentro Empresarial Acces, Bogotá, Colombia\nCorreo: extranjeria@pro-corp.net\nTeléfono: +57 300 929 2911', pt: 'PRO CORP S.A.S.\nCalle 127A #7-19, Escritório 301B\nCentro Empresarial Acces, Bogotá, Colômbia\nE-mail: extranjeria@pro-corp.net\nTelefone: +57 300 929 2911'
    },
    'privacy.s3.title': { en: 'Data We Collect', es: 'Datos que Recopilamos', pt: 'Dados que Coletamos' },
    'privacy.s3.text': {
        en: 'We collect the following categories of personal data:\n• Identification data: full name, ID/passport number, nationality\n• Contact data: email, phone number, postal address\n• Professional data: company name, position, industry\n• Service data: immigration case details, corporate structuring information, investment preferences\n• Technical data: IP address, browser type, device information, navigation data\n• Communication data: messages sent through our contact forms and LIA chat assistant',
        es: 'Recopilamos las siguientes categorías de datos personales:\n• Datos de identificación: nombre completo, número de documento/pasaporte, nacionalidad\n• Datos de contacto: correo electrónico, número de teléfono, dirección postal\n• Datos profesionales: nombre de empresa, cargo, sector\n• Datos del servicio: detalles de caso migratorio, información de estructuración corporativa, preferencias de inversión\n• Datos técnicos: dirección IP, tipo de navegador, información del dispositivo, datos de navegación\n• Datos de comunicación: mensajes enviados a través de formularios de contacto y el asistente LIA', pt: 'Coletamos as seguintes categorias de dados pessoais:\n• Dados de identificação: nome completo, número de identidade/passaporte, nacionalidade\n• Dados de contato: e-mail, telefone, endereço postal\n• Dados profissionais: nome da empresa, cargo, setor\n• Dados de serviço: detalhes de casos migratórios, informações de estruturação corporativa, preferências de investimento\n• Dados técnicos: endereço IP, tipo de navegador, informações do dispositivo, dados de navegação\n• Dados de comunicação: mensagens enviadas por nossos formulários de contato e pelo assistente de chat LIA'
    },
    'privacy.s4.title': { en: 'Purpose of Processing', es: 'Finalidad del Tratamiento', pt: 'Finalidade do Tratamento' },
    'privacy.s4.text': {
        en: 'Your personal data is processed for the following purposes:\n• Provision of legal, immigration, and corporate advisory services\n• Management of investment portfolio consultations\n• Communication about the status of your processes and cases\n• Sending relevant information about our services (with prior consent)\n• Compliance with legal and regulatory obligations\n• Improvement of our digital platform and user experience\n• Operation of our AI assistant LIA for customer support',
        es: 'Sus datos personales son tratados para las siguientes finalidades:\n• Prestación de servicios legales, migratorios y de asesoría corporativa\n• Gestión de consultas del portafolio de inversión\n• Comunicación sobre el estado de sus procesos y casos\n• Envío de información relevante sobre nuestros servicios (con consentimiento previo)\n• Cumplimiento de obligaciones legales y regulatorias\n• Mejora de nuestra plataforma digital y experiencia de usuario\n• Operación de nuestro asistente de IA LIA para soporte al cliente', pt: 'Seus dados pessoais são tratados para as seguintes finalidades:\n• Prestação de serviços de assessoria jurídica, migratória e corporativa\n• Gestão de consultas sobre o portfólio de investimentos\n• Comunicação sobre o status dos seus processos e casos\n• Envio de informações relevantes sobre nossos serviços (com consentimento prévio)\n• Cumprimento de obrigações legais e regulatórias\n• Melhoria da nossa plataforma digital e da experiência do usuário\n• Operação da nossa assistente de IA LIA para atendimento ao cliente'
    },
    'privacy.s5.title': { en: 'Legal Basis', es: 'Base Legal', pt: 'Base Legal' },
    'privacy.s5.text': {
        en: 'The processing of your data is based on:\n• Contractual necessity: to provide the services you have requested\n• Legitimate interest: to improve our services and platform\n• Legal obligation: to comply with applicable regulations\n• Consent: for marketing communications and non-essential cookies',
        es: 'El tratamiento de sus datos se basa en:\n• Necesidad contractual: para prestar los servicios que ha solicitado\n• Interés legítimo: para mejorar nuestros servicios y plataforma\n• Obligación legal: para cumplir con la normativa aplicable\n• Consentimiento: para comunicaciones de marketing y cookies no esenciales', pt: 'O tratamento dos seus dados baseia-se em:\n• Necessidade contratual: para prestar os serviços que você solicitou\n• Interesse legítimo: para melhorar nossos serviços e plataforma\n• Obrigação legal: para cumprir as normas aplicáveis\n• Consentimento: para comunicações de marketing e cookies não essenciais'
    },
    'privacy.s6.title': { en: 'International Transfers', es: 'Transferencias Internacionales', pt: 'Transferências Internacionais' },
    'privacy.s6.text': {
        en: 'Given our operations in Colombia and Spain, your data may be transferred internationally between our offices. These transfers are carried out with appropriate safeguards, including standard contractual clauses approved by the European Commission and compliance with Colombian data protection regulations.',
        es: 'Dada nuestra operación en Colombia y España, sus datos pueden ser transferidos internacionalmente entre nuestras oficinas. Estas transferencias se realizan con las garantías adecuadas, incluyendo cláusulas contractuales tipo aprobadas por la Comisión Europea y cumplimiento de la normativa colombiana de protección de datos.', pt: 'Dadas as nossas operações na Colômbia e na Espanha, seus dados podem ser transferidos internacionalmente entre nossos escritórios. Essas transferências são realizadas com salvaguardas adequadas, incluindo cláusulas contratuais padrão aprovadas pela Comissão Europeia e o cumprimento das normas colombianas de proteção de dados.'
    },
    'privacy.s7.title': { en: 'Data Retention', es: 'Conservación de Datos', pt: 'Retenção de Dados' },
    'privacy.s7.text': {
        en: 'Personal data will be retained for the duration of the contractual relationship and, thereafter, for the legally required periods. For immigration and legal cases, data is retained for a minimum of 5 years after case closure as required by applicable regulations.',
        es: 'Los datos personales se conservarán durante la vigencia de la relación contractual y, posteriormente, durante los plazos legalmente exigidos. Para casos migratorios y legales, los datos se conservan por un mínimo de 5 años después del cierre del caso según lo exige la normativa aplicable.', pt: 'Os dados pessoais serão conservados durante a relação contratual e, depois, pelos períodos legalmente exigidos. Para casos migratórios e jurídicos, os dados são conservados por no mínimo 5 anos após o encerramento do caso, conforme exigido pelas normas aplicáveis.'
    },
    'privacy.s8.title': { en: 'Your Rights', es: 'Sus Derechos', pt: 'Seus Direitos' },
    'privacy.s8.text': {
        en: 'You have the right to:\n• Access your personal data\n• Rectify inaccurate or incomplete data\n• Request deletion of your data\n• Object to or restrict processing\n• Data portability\n• Withdraw consent at any time\n\nTo exercise these rights, contact us at extranjeria@pro-corp.net. We will respond within 15 business days (Colombia) or 30 calendar days (EU).',
        es: 'Usted tiene derecho a:\n• Acceder a sus datos personales\n• Rectificar datos inexactos o incompletos\n• Solicitar la supresión de sus datos\n• Oponerse o limitar el tratamiento\n• Portabilidad de datos\n• Retirar su consentimiento en cualquier momento\n\nPara ejercer estos derechos, contáctenos a extranjeria@pro-corp.net. Responderemos en un plazo de 15 días hábiles (Colombia) o 30 días naturales (UE).', pt: 'Você tem direito a:\n• Acessar seus dados pessoais\n• Retificar dados inexatos ou incompletos\n• Solicitar a exclusão dos seus dados\n• Opor-se ao tratamento ou restringi-lo\n• Portabilidade dos dados\n• Retirar o consentimento a qualquer momento\n\nPara exercer esses direitos, contate-nos em extranjeria@pro-corp.net. Responderemos em até 15 dias úteis (Colômbia) ou 30 dias corridos (UE).'
    },
    'privacy.s9.title': { en: 'Contact & Complaints', es: 'Contacto y Reclamaciones', pt: 'Contato e Reclamações' },
    'privacy.s9.text': {
        en: 'For inquiries about data processing: extranjeria@pro-corp.net\n\nYou also have the right to file a complaint with the competent supervisory authority:\n• Colombia: Superintendencia de Industria y Comercio (SIC)\n• Spain: Agencia Española de Protección de Datos (AEPD)',
        es: 'Para consultas sobre tratamiento de datos: extranjeria@pro-corp.net\n\nTambién tiene derecho a presentar una reclamación ante la autoridad de control competente:\n• Colombia: Superintendencia de Industria y Comercio (SIC)\n• España: Agencia Española de Protección de Datos (AEPD)', pt: 'Para consultas sobre o tratamento de dados: extranjeria@pro-corp.net\n\nVocê também tem o direito de apresentar uma reclamação à autoridade de controle competente:\n• Colômbia: Superintendencia de Industria y Comercio (SIC)\n• Espanha: Agencia Española de Protección de Datos (AEPD)'
    },

    // ── Cookie Policy Page ──
    'cookies.badge': { en: 'Legal', es: 'Legal', pt: 'Legal' },
    'cookies.title': { en: 'Cookie Policy', es: 'Política de Cookies', pt: 'Política de Cookies' },
    'cookies.updated': { en: 'Last updated: March 2026', es: 'Última actualización: Marzo 2026', pt: 'Última atualização: março de 2026' },
    'cookies.intro': {
        en: 'This Cookie Policy explains how PRO CORP S.A.S. ("Pro Corp") uses cookies and similar technologies on our website. By continuing to browse our site, you consent to the use of cookies as described in this policy.',
        es: 'Esta Política de Cookies explica cómo PRO CORP S.A.S. ("Pro Corp") utiliza cookies y tecnologías similares en nuestro sitio web. Al continuar navegando en nuestro sitio, usted consiente el uso de cookies según lo descrito en esta política.', pt: 'Esta Política de Cookies explica como a PRO CORP S.A.S. ("Pro Corp") usa cookies e tecnologias similares em nosso site. Ao continuar navegando, você consente com o uso de cookies conforme descrito nesta política.'
    },
    'cookies.s1.title': { en: 'What Are Cookies?', es: '¿Qué Son las Cookies?', pt: 'O Que São Cookies?' },
    'cookies.s1.text': {
        en: 'Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They allow the site to recognize your device and remember certain information about your visit, such as your preferences and settings.',
        es: 'Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (computador, tableta o teléfono móvil) cuando visita un sitio web. Permiten que el sitio reconozca su dispositivo y recuerde cierta información sobre su visita, como sus preferencias y configuraciones.', pt: 'Cookies são pequenos arquivos de texto armazenados no seu dispositivo (computador, tablet ou celular) quando você visita um site. Eles permitem que o site reconheça seu dispositivo e lembre certas informações sobre sua visita, como preferências e configurações.'
    },
    'cookies.s2.title': { en: 'Types of Cookies We Use', es: 'Tipos de Cookies que Utilizamos', pt: 'Tipos de Cookies que Usamos' },
    'cookies.s2.essential.title': { en: 'Essential Cookies', es: 'Cookies Esenciales', pt: 'Cookies Essenciais' },
    'cookies.s2.essential.text': {
        en: 'Required for the website to function properly. They enable core features like page navigation, access to secure areas, and language preferences. The site cannot function correctly without these cookies.',
        es: 'Necesarias para el correcto funcionamiento del sitio web. Habilitan funciones básicas como la navegación entre páginas, acceso a áreas seguras y preferencias de idioma. El sitio no puede funcionar correctamente sin estas cookies.', pt: 'Necessários para o funcionamento adequado do site. Habilitam recursos básicos como navegação entre páginas, acesso a áreas seguras e preferências de idioma. O site não funciona corretamente sem esses cookies.'
    },
    'cookies.s2.analytics.title': { en: 'Analytics Cookies', es: 'Cookies de Analítica', pt: 'Cookies de Análise' },
    'cookies.s2.analytics.text': {
        en: 'We use Google Analytics to understand how visitors interact with our website. These cookies collect information anonymously and help us improve the user experience. Data collected includes pages visited, time spent on the site, and how you arrived at our website.',
        es: 'Utilizamos Google Analytics para comprender cómo los visitantes interactúan con nuestro sitio web. Estas cookies recopilan información de forma anónima y nos ayudan a mejorar la experiencia del usuario. Los datos recopilados incluyen páginas visitadas, tiempo en el sitio y cómo llegó a nuestro sitio web.', pt: 'Usamos o Google Analytics para entender como os visitantes interagem com nosso site. Esses cookies coletam informações de forma anônima e nos ajudam a melhorar a experiência do usuário. Os dados coletados incluem páginas visitadas, tempo no site e como você chegou até nós.'
    },
    'cookies.s2.functional.title': { en: 'Functional Cookies', es: 'Cookies Funcionales', pt: 'Cookies Funcionais' },
    'cookies.s2.functional.text': {
        en: 'These cookies remember your choices (such as language preference and region) and provide enhanced, personalized features. They may also be used to remember changes you have made to text size, fonts, and other customizable elements.',
        es: 'Estas cookies recuerdan sus elecciones (como preferencia de idioma y región) y proporcionan funciones mejoradas y personalizadas. También pueden usarse para recordar cambios que ha realizado en tamaño de texto, fuentes y otros elementos personalizables.', pt: 'Esses cookies lembram suas escolhas (como preferência de idioma e região) e oferecem recursos aprimorados e personalizados. Também podem ser usados para lembrar alterações que você fez em tamanho de texto, fontes e outros elementos personalizáveis.'
    },
    'cookies.s3.title': { en: 'Cookie Details', es: 'Detalle de Cookies', pt: 'Detalhes dos Cookies' },
    'cookies.s3.c1': { en: 'Language preference — Essential — Session', es: 'Preferencia de idioma — Esencial — Sesión', pt: 'Preferência de idioma — Essencial — Sessão' },
    'cookies.s3.c2': { en: '_ga, _ga_* — Analytics (Google Analytics) — 2 years', es: '_ga, _ga_* — Analítica (Google Analytics) — 2 años', pt: '_ga, _ga_* — Análise (Google Analytics) — 2 anos' },
    'cookies.s3.c3': { en: 'lia_wa_id — Functional (LIA Chat session) — Persistent', es: 'lia_wa_id — Funcional (Sesión de Chat LIA) — Persistente', pt: 'lia_wa_id — Funcional (sessão do LIA Chat) — Persistente' },
    'cookies.s4.title': { en: 'How to Manage Cookies', es: 'Cómo Gestionar las Cookies', pt: 'Como Gerenciar Cookies' },
    'cookies.s4.text': {
        en: 'You can control and manage cookies through your browser settings. Most browsers allow you to:\n• View what cookies are stored and delete them individually\n• Block third-party cookies\n• Block cookies from specific sites\n• Block all cookies\n• Delete all cookies when you close the browser\n\nPlease note that blocking certain cookies may affect the functionality of this website.',
        es: 'Puede controlar y gestionar las cookies a través de la configuración de su navegador. La mayoría de los navegadores le permiten:\n• Ver qué cookies están almacenadas y eliminarlas individualmente\n• Bloquear cookies de terceros\n• Bloquear cookies de sitios específicos\n• Bloquear todas las cookies\n• Eliminar todas las cookies al cerrar el navegador\n\nTenga en cuenta que bloquear ciertas cookies puede afectar la funcionalidad de este sitio web.', pt: 'Você pode controlar e gerenciar cookies nas configurações do seu navegador. A maioria dos navegadores permite:\n• Ver quais cookies estão armazenados e excluí-los individualmente\n• Bloquear cookies de terceiros\n• Bloquear cookies de sites específicos\n• Bloquear todos os cookies\n• Excluir todos os cookies ao fechar o navegador\n\nObserve que bloquear certos cookies pode afetar o funcionamento deste site.'
    },
    'cookies.s5.title': { en: 'Changes to This Policy', es: 'Cambios en Esta Política', pt: 'Alterações desta Política' },
    'cookies.s5.text': {
        en: 'We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business operations. We recommend reviewing this page periodically.',
        es: 'Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en la tecnología, legislación o nuestras operaciones. Recomendamos revisar esta página periódicamente.', pt: 'Podemos atualizar esta Política de Cookies periodicamente para refletir mudanças em tecnologia, legislação ou nas nossas operações. Recomendamos revisar esta página periodicamente.'
    },
    'cookies.s6.title': { en: 'Contact', es: 'Contacto', pt: 'Contato' },
    'cookies.s6.text': {
        en: 'For questions about our use of cookies, contact us at extranjeria@pro-corp.net.',
        es: 'Para preguntas sobre nuestro uso de cookies, contáctenos a extranjeria@pro-corp.net.', pt: 'Para dúvidas sobre nosso uso de cookies, contate-nos em extranjeria@pro-corp.net.'
    },
};

// ─── PROVIDER ───────────────────────────────────────────────────
function detectLanguage(): Language {
    if (typeof window === 'undefined') return 'en';
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    if (browserLang.startsWith('es')) return 'es';
    if (browserLang.startsWith('pt')) return 'pt';
    return 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Language>('en');

    useEffect(() => {
        setLang(detectLanguage());
    }, []);

    const toggleLang = useCallback(() => {
        // ciclo EN → ES → PT → EN
        setLang(prev => (prev === 'en' ? 'es' : prev === 'es' ? 'pt' : 'en'));
    }, []);

    const t = useCallback((key: string): string => {
        return translations[key]?.[lang] ?? translations[key]?.en ?? key;
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

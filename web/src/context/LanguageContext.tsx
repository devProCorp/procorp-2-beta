'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'en' | 'es';

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
const translations: Record<string, Record<Language, string>> = {

    // ── Navbar ──
    'nav.home': { en: 'Home', es: 'Inicio' },
    'nav.blog': { en: 'Blog', es: 'Blog' },
    'nav.legal': { en: 'Legal Solutions', es: 'Soluciones Legales' },
    'nav.growth': { en: 'Sustainable Growth', es: 'Crecimiento Sostenible' },
    'nav.about': { en: 'About Us', es: 'Sobre Nosotros' },
    'nav.contact': { en: 'Contact', es: 'Contacto' },
    'nav.login': { en: 'Login', es: 'Login' },
    'nav.services': { en: 'Services', es: 'Servicios' },
    'nav.journal': { en: 'Journal', es: 'Blog' },

    // ── ScrollHero ──
    'hero.label': { en: 'Technology-Based Orchestration', es: 'Orquestación Basada en Tecnología' },
    'hero.title.1': { en: 'We design', es: 'Diseñamos' },
    'hero.title.accent1': { en: 'structure.', es: 'estructura.' },
    'hero.title.2': { en: 'We orchestrate', es: 'Orquestamos' },
    'hero.title.accent2': { en: 'execution.', es: 'ejecución.' },
    'hero.title.3': { en: 'Automation meets architecture.', es: 'Automatización y arquitectura.' },
    'hero.scroll': { en: 'Scroll to Explore', es: 'Desplázate para explorar' },

    // ── ScrollHero Phase 2 ──
    'hero.manifesto.label': { en: 'What We Are / Since 2008', es: 'Quiénes Somos / Desde 2008' },
    'hero.manifesto.text': {
        en: 'Pro Corp redesigns operating models, automates execution, and integrates assets, capital, and expertise through a transparent exchange platform.',
        es: 'Pro Corp rediseña modelos operativos, automatiza la ejecución e integra activos, capital y expertise a través de una plataforma de intercambio transparente.'
    },
    'hero.manifesto.sub': {
        en: 'Not a consulting firm. Not a software house. We do both — re-engineering and execution — amplified by intelligent marketing systems.',
        es: 'No somos una consultora. No somos una casa de software. Hacemos ambas cosas — reingeniería y ejecución — amplificadas por sistemas inteligentes de marketing.'
    },

    // ── ScrollHero Phase 3 (Features) ──
    'hero.f1.title': { en: 'Legal Solutions', es: 'Soluciones Legales' },
    'hero.f1.desc': {
        en: 'Structured governance frameworks, risk architecture, cross-border structuring, and compliance workflows — enhanced through automation.',
        es: 'Marcos de gobernanza estructurados, arquitectura de riesgo, estructuración transfronteriza y flujos de cumplimiento — potenciados por automatización.'
    },
    'hero.f2.title': { en: 'Sustainable Growth', es: 'Crecimiento Sostenible' },
    'hero.f2.desc': {
        en: 'Operating model redesign, KPI systems, financial simulators, and ongoing operational involvement. We stay in the game.',
        es: 'Rediseño de modelos operativos, sistemas KPI, simuladores financieros e involucramiento operacional continuo. Permanecemos en el juego.'
    },
    'hero.f3.title': { en: 'IP2$ Engineering', es: 'IP2$ Ingeniería' },
    'hero.f3.desc': {
        en: 'Proprietary systems: conversational financial simulators, AI interfaces, marketing automation engines, and platform architecture.',
        es: 'Sistemas propietarios: simuladores financieros conversacionales, interfaces IA, motores de automatización de marketing y arquitectura de plataforma.'
    },

    // ── Manifesto ──
    'manifesto.label.side': { en: 'ORCHESTRATION / SINCE 2008', es: 'ORQUESTACIÓN / DESDE 2008' },
    'manifesto.label': { en: 'Technology-Based Orchestration', es: 'Orquestación Basada en Tecnología' },
    'manifesto.title.1': { en: 'We design', es: 'Diseñamos' },
    'manifesto.title.accent1': { en: 'structure.', es: 'estructura.' },
    'manifesto.title.2': { en: 'We orchestrate', es: 'Orquestamos' },
    'manifesto.title.accent2': { en: 'execution.', es: 'ejecución.' },
    'manifesto.title.3': { en: 'Automation meets architecture.', es: 'Automatización y arquitectura.' },
    'manifesto.text': {
        en: 'Pro Corp redesigns operating models, automates execution, and integrates assets, capital, and expertise through a transparent exchange platform — amplified by intelligent marketing systems.',
        es: 'Pro Corp rediseña modelos operativos, automatiza la ejecución e integra activos, capital y expertise a través de una plataforma de intercambio transparente — amplificada por sistemas inteligentes de marketing.'
    },
    'manifesto.p1': {
        en: 'Not a consulting firm. Not a software house. Not a marketplace. We re-engineer processes and implement them through scalable cloud architecture — then amplify through automated marketing systems.',
        es: 'No somos una consultora. No somos una casa de software. No somos un marketplace. Reingenieramos procesos y los implementamos a través de arquitectura cloud escalable — y luego amplificamos con sistemas automatizados de marketing.'
    },
    'manifesto.p2': {
        en: 'Automation without re-engineering is inefficient. Re-engineering without execution is theoretical. Pro Corp does both. Complex models become conversational experiences. Technology becomes a bridge — not a barrier.',
        es: 'Automatización sin reingeniería es ineficiente. Reingeniería sin ejecución es teórica. Pro Corp hace ambas. Los modelos complejos se convierten en experiencias conversacionales. La tecnología se convierte en puente — no en barrera.'
    },
    'manifesto.cta': { en: 'Explore our methodology', es: 'Explora nuestra metodología' },

    // ── FeatureGrid ──
    'features.01.title': { en: 'Legal Solutions', es: 'Soluciones Legales' },
    'features.01.desc': {
        en: 'Structured governance frameworks, risk architecture, cross-border structuring, and compliance workflows. Enhanced through automation and digital documentation portals.',
        es: 'Marcos de gobernanza estructurados, arquitectura de riesgo, estructuración transfronteriza y flujos de cumplimiento. Potenciados por automatización y portales documentales digitales.'
    },
    'features.02.title': { en: 'Sustainable Growth', es: 'Crecimiento Sostenible' },
    'features.02.desc': {
        en: 'Strategy consulting differentiated by execution. Operating model redesign, KPI systems, financial simulators, and ongoing operational involvement. We stay in the game.',
        es: 'Consultoría estratégica diferenciada por ejecución. Rediseño de modelos operativos, sistemas KPI, simuladores financieros e involucramiento operacional continuo. Permanecemos en el juego.'
    },
    'features.03.title': { en: 'IP2$ Engineering', es: 'IP2$ Ingeniería' },
    'features.03.desc': {
        en: 'Proprietary systems: conversational financial simulators, AI interfaces, marketing automation engines, platform architecture, and narrative engines. This is where the tech lives.',
        es: 'Sistemas propietarios: simuladores financieros conversacionales, interfaces IA, motores de automatización de marketing, arquitectura de plataforma y motores narrativos. Aquí vive la tecnología.'
    },

    // ── LIA Chat Section ──
    'lia.label': { en: 'AI-Powered Agent', es: 'Agente Impulsado por IA' },
    'lia.title': { en: 'Meet LIA', es: 'Conoce a LIA' },
    'lia.desc': {
        en: 'LIA is our intelligent orchestration agent. She navigates complex processes, automates workflows, and delivers structured answers in real time — turning operational complexity into conversational simplicity.',
        es: 'LIA es nuestro agente inteligente de orquestación. Navega procesos complejos, automatiza flujos de trabajo y entrega respuestas estructuradas en tiempo real — convirtiendo la complejidad operativa en simplicidad conversacional.'
    },
    'lia.status': { en: 'Online', es: 'En línea' },
    'lia.powered': { en: 'IP2$ Engine', es: 'Motor IP2$' },
    'lia.chat.subtitle': { en: 'Orchestration Agent', es: 'Agente de Orquestación' },
    'lia.chat.placeholder': { en: 'Ask LIA anything...', es: 'Pregúntale a LIA...' },
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
        en: 'The 7-step methodology is already in motion: Diagnose → Map → Design → Re-engineer → Implement → Integrate → Amplify. I\'ll have your architecture blueprint ready for review by next week.',
        es: 'La metodología de 7 pasos ya está en marcha: Diagnosticar → Mapear → Diseñar → Reingeniar → Implementar → Integrar → Amplificar. Tendré el plano de tu arquitectura listo para revisión la próxima semana.'
    },

    // ── VisualDivider ──
    'divider.title': { en: 'Start your architecture.', es: 'Inicia tu arquitectura.' },
    'divider.cta': { en: 'Enter the Platform', es: 'Entra a la Plataforma' },

    // ── Studio (About) Page ──
    'studio.hero.title.1': { en: 'Technology-based', es: 'Orquestación' },
    'studio.hero.title.2': { en: 'orchestration', es: 'basada en tecnología' },
    'studio.hero.p1': {
        en: 'Pro Corp is a technology-based orchestration company specialized in Business Process Automation. We redesign operating models, automate execution, and integrate assets, capital, and expertise through a transparent exchange platform.',
        es: 'Pro Corp es una empresa de orquestación basada en tecnología, especializada en Automatización de Procesos de Negocio. Rediseñamos modelos operativos, automatizamos la ejecución e integramos activos, capital y expertise a través de una plataforma de intercambio transparente.'
    },
    'studio.hero.p2': {
        en: 'Prepared with discipline. Structured for scale. Designed for transparent execution.',
        es: 'Preparados con disciplina. Estructurados para escalar. Diseñados para ejecución transparente.'
    },
    'studio.hero.cta': { en: 'Explore the platform', es: 'Explora la plataforma' },
    'studio.verticals.label': { en: 'Strategic Verticals', es: 'Verticales Estratégicos' },
    'studio.verticals.title': { en: 'Three pillars. One architecture.', es: 'Tres pilares. Una arquitectura.' },
    'studio.v1.title': { en: '01. Legal Solutions', es: '01. Soluciones Legales' },
    'studio.v1.desc': {
        en: 'Structured governance frameworks, risk architecture, cross-border structuring, and compliance workflows. Enhanced through automation and digital documentation portals.',
        es: 'Marcos de gobernanza estructurados, arquitectura de riesgo, estructuración transfronteriza y flujos de cumplimiento. Potenciados por automatización y portales documentales digitales.'
    },
    'studio.v1.l1': { en: 'Governance Frameworks', es: 'Marcos de Gobernanza' },
    'studio.v1.l2': { en: 'Risk Architecture', es: 'Arquitectura de Riesgo' },
    'studio.v1.l3': { en: 'Compliance Workflows', es: 'Flujos de Cumplimiento' },
    'studio.v1.l4': { en: 'Cross-Border Structuring', es: 'Estructuración Transfronteriza' },
    'studio.v2.title': { en: '02. Sustainable Growth', es: '02. Crecimiento Sostenible' },
    'studio.v2.desc': {
        en: "Strategy consulting differentiated by execution. Operating model redesign, KPI systems, financial simulators, and ongoing operational involvement. We stay in the game — we don't just advise.",
        es: 'Consultoría estratégica diferenciada por ejecución. Rediseño de modelos operativos, sistemas KPI, simuladores financieros e involucramiento operacional continuo. Permanecemos en el juego — no solo asesoramos.'
    },
    'studio.v2.l1': { en: 'Operating Model Redesign', es: 'Rediseño de Modelo Operativo' },
    'studio.v2.l2': { en: 'KPI Systems', es: 'Sistemas KPI' },
    'studio.v2.l3': { en: 'Financial Simulators', es: 'Simuladores Financieros' },
    'studio.v3.title': { en: '03. IP2$ Engineering', es: '03. IP2$ Ingeniería' },
    'studio.v3.desc': {
        en: 'Proprietary systems: conversational financial simulators, AI interfaces, marketing automation engines, platform architecture, Cognitive Echo & narrative engines. This is where the tech lives.',
        es: 'Sistemas propietarios: simuladores financieros conversacionales, interfaces IA, motores de automatización de marketing, arquitectura de plataforma, Cognitive Echo y motores narrativos. Aquí vive la tecnología.'
    },
    'studio.v3.l1': { en: 'AI Interfaces', es: 'Interfaces IA' },
    'studio.v3.l2': { en: 'Marketing Automation', es: 'Automatización de Marketing' },
    'studio.v3.l3': { en: 'Platform Architecture', es: 'Arquitectura de Plataforma' },
    'studio.method.label': { en: '7-Step Methodology', es: 'Metodología de 7 Pasos' },
    'studio.method.title': {
        en: 'Momentum is engineered — not accidental.',
        es: 'El impulso se diseña — no es accidental.'
    },
    'studio.method.desc': {
        en: 'Diagnose. Map. Design. Re-engineer. Implement. Integrate. Amplify. Our methodology transforms operating models through scalable cloud architecture — React, Supabase, Cloud stack — then amplifies through automated marketing systems.',
        es: 'Diagnosticar. Mapear. Diseñar. Reingeniar. Implementar. Integrar. Amplificar. Nuestra metodología transforma modelos operativos a través de arquitectura cloud escalable — React, Supabase, Cloud stack — y luego amplifica con sistemas automatizados de marketing.'
    },
    'studio.method.stat1.value': { en: '7', es: '7' },
    'studio.method.stat1.label': { en: 'Step Process', es: 'Pasos del Proceso' },
    'studio.method.stat2.value': { en: '4', es: '4' },
    'studio.method.stat2.label': { en: 'Platform Roles', es: 'Roles de Plataforma' },

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
    'svc.02.title': { en: 'SUSTAINABLE GROWTH', es: 'CRECIMIENTO SOSTENIBLE' },
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
    'svc.back': { en: 'Back to Services', es: 'Volver a Servicios' },
    'svc.challenge': { en: 'The Challenge', es: 'El Desafío' },
    'svc.solution': { en: 'Our Approach', es: 'Nuestro Enfoque' },
    'svc.capabilities': { en: 'Key Capabilities', es: 'Capacidades Clave' },
    'svc.next': { en: 'Next Service', es: 'Siguiente Servicio' },

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
        en: 'We build orchestration layers — transparent stakeholder portals with live dashboards, scenario simulations, and collaborative interfaces. Not a marketplace, but a command center where every participant sees the same truth in real time.',
        es: 'Construimos capas de orquestación — portales transparentes con dashboards en vivo, simulaciones de escenarios e interfaces colaborativas. No un marketplace, sino un centro de comando donde cada participante ve la misma verdad en tiempo real.'
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
        en: 'Structured narratives on orchestration, process automation, platform architecture, and the engineering of momentum.',
        es: 'Narrativas estructuradas sobre orquestación, automatización de procesos, arquitectura de plataforma y la ingeniería del impulso.'
    },
    'journal.a1.title': { en: 'Why Automation Without Re-Engineering Is Inefficient', es: 'Por Qué la Automatización Sin Reingeniería Es Ineficiente' },
    'journal.a2.title': { en: 'The Exchange Platform: Orchestration, Not Marketplace', es: 'La Plataforma de Intercambio: Orquestación, No Marketplace' },
    'journal.a3.title': { en: 'Operating Model Redesign: From Diagnosis to Amplification', es: 'Rediseño de Modelo Operativo: Del Diagnóstico a la Amplificación' },
    'journal.a4.title': { en: 'Conversational Financial Simulators: Complex Models Made Accessible', es: 'Simuladores Financieros Conversacionales: Modelos Complejos Accesibles' },
    'journal.a5.title': { en: 'Structured Governance Frameworks for Cross-Border Operations', es: 'Marcos de Gobernanza Estructurados para Operaciones Transfronterizas' },

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
    'contact.form.vertical.2': { en: 'Sustainable Growth', es: 'Crecimiento Sostenible' },
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
    'footer.contact': { en: 'Contact', es: 'Contacto' },
    'footer.follow': { en: 'Follow Us', es: 'Síguenos' },
    'footer.rights': { en: 'All rights reserved.', es: 'Todos los derechos reservados.' },
    'footer.company': { en: 'Company', es: 'Empresa' },
    'footer.about': { en: 'About Us', es: 'Sobre Nosotros' },
    'footer.blog': { en: 'Blog', es: 'Blog' },
    'footer.services': { en: 'Services', es: 'Servicios' },
    'footer.legal.title': { en: 'Legal', es: 'Legal' },
    'footer.legal.solutions': { en: 'Legal Solutions', es: 'Soluciones Legales' },
    'footer.legal.growth': { en: 'Sustainable Growth', es: 'Crecimiento Sostenible' },
    'footer.legal.consulting': { en: 'Consulting', es: 'Consultoría' },
    'footer.legal.privacy': { en: 'Privacy Policy', es: 'Política de Privacidad' },
    'footer.legal.terms': { en: 'Terms of Use', es: 'Términos de Uso' },
    'footer.legal.cookies': { en: 'Cookies', es: 'Cookies' },
    'footer.desc': { en: 'Strategy, legality, and technology united for sustainable business growth.', es: 'Estrategia, legalidad y tecnología unidas para el crecimiento empresarial sostenible.' },
    'footer.system': { en: 'System Operational', es: 'Sistema Operativo' },

    // ── Home Page ──
    'home.badge': { en: 'Vision 2026-2028', es: 'Visión 2026-2028' },
    'home.title1': { en: 'Technology Engineering', es: 'Ingeniería Tecnológica' },
    'home.title2': { en: 'and Operational BPA', es: 'y BPA Operativo' },
    'home.desc': { en: 'Redefining the corporate future with intelligent legal strategies and sustainable growth. We transform data into decisions through Process Engineering.', es: 'Redefiniendo el futuro corporativo con estrategias legales inteligentes y crecimiento sostenible. Transformamos datos en decisiones mediante Ingeniería de Procesos.' },
    'home.cta1': { en: 'Explore Strategy', es: 'Explorar Estrategia' },
    'home.cta2': { en: 'View Dashboard Demo', es: 'Ver Dashboard Demo' },
    'home.stat1.value': { en: '+25%', es: '+25%' },
    'home.stat1.label': { en: 'Operational Efficiency', es: 'Eficiencia Operativa' },
    'home.stat2.value': { en: '500+', es: '500+' },
    'home.stat2.label': { en: 'Global Clients', es: 'Clientes Globales' },
    'home.stat3.value': { en: '1.2k', es: '1.2k' },
    'home.stat3.label': { en: 'Legal Projects', es: 'Proyectos Legales' },
    'home.pillars.label': { en: 'Our Pillars', es: 'Nuestros Pilares' },
    'home.pillars.title': { en: 'Strategic Pillars', es: 'Pilares Estratégicos' },
    'home.pillars.desc': { en: 'Driving the digital and legal transformation of modern corporations through three fundamental axes.', es: 'Impulsando la transformación digital y legal de las corporaciones modernas a través de tres ejes fundamentales.' },
    'home.pillars.viewall': { en: 'View all services', es: 'Ver todos los servicios' },
    'home.pillar1.title': { en: 'Legal Solutions', es: 'Soluciones Legales' },
    'home.pillar1.desc': { en: 'Legal advice adapted to the digital era. Contract automation and real-time regulatory compliance.', es: 'Asesoría jurídica adaptada a la era digital. Automatización de contratos y compliance normativo en tiempo real.' },
    'home.pillar2.title': { en: 'Sustainable Growth', es: 'Crecimiento Sostenible' },
    'home.pillar2.desc': { en: 'ESG strategies integrated into the core business. Resilient business models designed for the long term.', es: 'Estrategias ESG integradas al core business. Modelos de negocio resilientes diseñados para el largo plazo.' },
    'home.pillar3.title': { en: 'Process Engineering', es: 'Ingeniería de Procesos' },
    'home.pillar3.desc': { en: 'Data intelligence applied to processes (BPA). Workflow optimization through AI and Machine Learning.', es: 'Inteligencia de datos aplicada a procesos (BPA). Optimización de flujos de trabajo mediante IA y Machine Learning.' },
    'home.learnmore': { en: 'Learn more', es: 'Saber más' },
    'home.bpa.title1': { en: 'BPA: Automation &', es: 'BPA: Automatización e' },
    'home.bpa.title2': { en: 'Process Engineering', es: 'Ingeniería de Procesos' },
    'home.bpa.desc1': { en: 'LIA not only analyzes,', es: 'LIA no solo analiza,' },
    'home.bpa.desc2': { en: 'executes and optimizes', es: 'ejecuta y optimiza' },
    'home.bpa.desc3': { en: 'your operating model end to end.', es: 'su modelo operativo de punta a punta.' },
    'home.bpa.ingest': { en: 'Data Ingestion', es: 'Ingesta de Datos' },
    'home.bpa.analysis': { en: 'Analysis & Decision', es: 'Análisis & Decisión' },
    'home.bpa.execution': { en: 'Auto. Execution', es: 'Ejecución Auto.' },
    'home.bpa.acceleration': { en: 'Flow Acceleration', es: 'Aceleración de Flujos' },
    'home.bpa.assets': { en: 'Integrated Assets', es: 'Activos Integrados' },
    'home.bpa.uptime': { en: 'Operational Uptime', es: 'Uptime Operativo' },
    'home.bpa.transform': { en: 'Start your transformation today', es: 'Comience su transformación hoy' },
    'home.bpa.transform.desc': { en: 'Implement LIA in your critical flows in less than 2 weeks.', es: 'Implemente LIA en sus flujos críticos en menos de 2 semanas.' },
    'home.bpa.demo': { en: 'Schedule BPA Demo', es: 'Agendar Demo BPA' },
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

    // ── Projects Page ──
    'proj.badge': { en: 'BPA Technology Engineering', es: 'Ingeniería Tecnológica BPA' },
    'proj.title1': { en: 'Governance &', es: 'Ingeniería de' },
    'proj.title2': { en: 'Process Engineering', es: 'Gobernanza y Procesos' },
    'proj.desc': { en: 'Automation of critical business flows. We engineer regulatory frameworks through Business Process Automation (BPA) to turn efficiency into your greatest strategic asset.', es: 'Automatización de flujos críticos de negocio. Realizamos ingeniería de marcos regulatorios mediante Business Process Automation (BPA) para convertir la eficiencia en su mayor activo estratégico.' },
    'proj.cta1': { en: 'Analyze Processes', es: 'Analizar Procesos' },
    'proj.cta2': { en: 'BPA Demo', es: 'Demo BPA' },
    'proj.flow': { en: 'Flow Status', es: 'Estado del Flujo' },
    'proj.synced': { en: 'Synced', es: 'Sincronizado' },
    'proj.efficiency': { en: 'Operational Efficiency', es: 'Eficiencia Operativa' },
    'proj.console1': { en: '> Executing BPA sequence...', es: '> Ejecutando secuencia BPA...' },
    'proj.console2': { en: '> Regulatory validation: OK.', es: '> Validación regulatoria: OK.' },
    'proj.console3': { en: '> Node engineering: Active.', es: '> Ingeniería de nodos: Activa.' },
    'proj.solutions': { en: 'Solutions Ecosystem', es: 'Ecosistema de Soluciones' },
    'proj.solutions.desc': { en: 'Digital infrastructure for automated risk and corporate process management.', es: 'Infraestructura digital para la gestión automatizada de riesgos y procesos corporativos.' },
    'proj.s1.title': { en: 'Social Settlement', es: 'Arraigo Social' },
    'proj.s1.desc': { en: 'Comprehensive regularization management. We automate documentation and requirement tracking to ensure effective socio-labor integration.', es: 'Gestión integral de regularización por arraigo. Automatizamos la documentación y el seguimiento de requisitos para asegurar la integración sociolaboral efectiva.' },
    'proj.s1.link': { en: 'View Process', es: 'Ver Proceso' },
    'proj.s2.title': { en: 'Family Settlement', es: 'Arraigo Familiar' },
    'proj.s2.desc': { en: 'Agile solutions for reunification and regularization of family ties. Simplified processes for family members of Spanish citizens.', es: 'Soluciones ágiles para la reagrupación y regularización de vínculos familiares. Procesos simplificados para familiares de ciudadanos españoles.' },
    'proj.s2.link': { en: 'View Requirements', es: 'Ver Requisitos' },
    'proj.s3.title': { en: 'EU Family Member Card', es: 'Tarjeta de Familiar Comunitario UE' },
    'proj.s3.desc': { en: 'Expert processing for family members of EU citizens. We optimize residence obtainment times and community rights.', es: 'Tramitación experta para familiares de ciudadanos de la Unión Europea. Optimizamos los tiempos de obtención de residencia y derechos comunitarios.' },
    'proj.s3.link': { en: 'Start Process', es: 'Iniciar Trámite' },
    'proj.s4.title': { en: 'Non-Lucrative Residence', es: 'Residencia No Lucrativa' },
    'proj.s4.desc': { en: 'Specialized advice for residing in Spain without working. Financial and document planning to guarantee approval.', es: 'Asesoría especializada para residir en España sin ejercer actividad laboral. Planificación financiera y documental para garantizar la aprobación.' },
    'proj.s4.link': { en: 'Consult', es: 'Consultar' },
    'proj.s5.title': { en: 'Investment Legal Support', es: 'Acompañamiento legal de inversiones' },
    'proj.s5.desc': { en: 'Legal security for your capital. We provide comprehensive legal support in real estate and business investment processes, mitigating risks and ensuring regulatory compliance.', es: 'Seguridad jurídica para su capital. Brindamos soporte legal integral en procesos de inversión inmobiliaria y empresarial, mitigando riesgos y asegurando el cumplimiento normativo.' },
    'proj.s5.link': { en: 'Investment Advisory', es: 'Asesoría de Inversión' },
    'proj.cta.badge': { en: 'Next Level', es: 'Siguiente Nivel' },
    'proj.cta.title': { en: 'Ready to engineer your process efficiency?', es: '¿Listo para realizar la ingeniería de eficiencia de sus procesos?' },
    'proj.cta.desc': { en: 'Request a technical evaluation of your current workflows and discover how BPA automation can reduce risks and operating costs.', es: 'Solicite una evaluación técnica de sus flujos de trabajo actuales y descubra cómo la automatización BPA puede reducir riesgos y costes operativos.' },
    'proj.cta.button': { en: 'Contact Us', es: 'Contactanos' },

    // ── Studio Page ──
    'studio.badge2': { en: 'Operating Model 2028', es: 'Modelo Operativo 2028' },
    'studio.title1': { en: 'Sustainable', es: 'Crecimiento' },
    'studio.title2': { en: 'Growth', es: 'Sostenible' },
    'studio.desc2': { en: 'Business Process Re-engineering (BPA). We transform operational friction into a predictable and automated growth architecture.', es: 'Reingeniería de Procesos de Negocio (BPA). Transformamos la fricción operativa en una arquitectura de crecimiento predecible y automatizada.' },
    'studio.cta1': { en: 'Process Audit', es: 'Auditoría de Procesos' },
    'studio.cta2': { en: 'Simulate Model', es: 'Simular Modelo' },
    'studio.dashboard.status': { en: 'Core Engine Status', es: 'Core Engine Status' },
    'studio.dashboard.dataflow': { en: 'Data Flow', es: 'Flujo de Datos' },
    'studio.dashboard.automation': { en: 'Automation', es: 'Automatización' },
    'studio.dashboard.scalability': { en: 'Scalability', es: 'Escalabilidad' },
    'studio.dashboard.latency': { en: 'Latency < 2ms', es: 'Latencia < 2ms' },
    'studio.dashboard.coverage': { en: '94% Coverage', es: '94% Cobertura' },
    'studio.dashboard.unlimited': { en: 'Unlimited', es: 'Ilimitada' },
    'studio.dashboard.efficiency': { en: 'Operational Efficiency', es: 'Eficiencia Operativa' },
    'studio.bpa.label': { en: 'Business Process Automation', es: 'Business Process Automation' },
    'studio.bpa.title': { en: 'Operating Model Re-engineering', es: 'Reingeniería del Modelo Operativo' },
    'studio.bpa.desc': { en: 'The 2028 standard is not working harder, it\'s designing systems that work for you. We transform manual friction into continuous digital flow.', es: 'El estándar para 2028 no es trabajar más duro, es diseñar sistemas que trabajen por usted. Transformamos la fricción manual en flujo digital continuo.' },
    'studio.today': { en: 'OPE Today', es: 'OPE Today' },
    'studio.today.sub': { en: 'Manual Model (Obsolete)', es: 'Modelo Manual (Obsoleto)' },
    'studio.today.1.title': { en: 'Fragmented Processes', es: 'Procesos Fragmentados' },
    'studio.today.1.desc': { en: 'Information silos and critical human dependency.', es: 'Silos de información y dependencia humana crítica.' },
    'studio.today.2.title': { en: 'Data Latency', es: 'Latencia de Datos' },
    'studio.today.2.desc': { en: 'Decisions based on last week\'s reports.', es: 'Decisiones basadas en reportes de la semana pasada.' },
    'studio.today.3.title': { en: 'Linear Costs', es: 'Costos Lineales' },
    'studio.today.3.desc': { en: 'Revenue growth means proportional headcount growth.', es: 'Crecer ingresos significa crecer nómina proporcionalmente.' },
    'studio.tomorrow': { en: 'OPE Tomorrow', es: 'OPE Tomorrow' },
    'studio.tomorrow.sub': { en: 'Scalable BPA Model', es: 'Modelo BPA Escalable' },
    'studio.tomorrow.1.title': { en: 'Automated Orchestration', es: 'Orquestación Automatizada' },
    'studio.tomorrow.1.desc': { en: 'Autonomous "Trigger-Action" workflows.', es: 'Workflows autónomos "Trigger-Action".' },
    'studio.tomorrow.2.title': { en: 'Real-Time KPIs', es: 'KPIs en Tiempo Real' },
    'studio.tomorrow.2.desc': { en: 'Live dashboards for instant direction.', es: 'Tableros vivos para dirección instantánea.' },
    'studio.tomorrow.3.title': { en: 'Exponential Scalability', es: 'Escalabilidad Exponencial' },
    'studio.tomorrow.3.desc': { en: 'Infrastructure that supports 10x demand without additional headcount.', es: 'Infraestructura que soporta 10x demanda sin + headcount.' },
    'studio.sim.title': { en: 'Automation Simulator', es: 'Simulador de Automatización' },
    'studio.sim.desc': { en: 'Adjust process variables to project BPA impact.', es: 'Ajuste las variables de proceso para proyectar el impacto BPA.' },
    'studio.sim.core': { en: 'Core Coverage', es: 'Cobertura Core' },
    'studio.sim.error': { en: 'Error Reduction', es: 'Reducción de Error' },
    'studio.sim.speed': { en: 'Speed (Throughput)', es: 'Velocidad (Throughput)' },
    'studio.sim.impact': { en: 'Impact Projection', es: 'Proyección de Impacto' },
    'studio.sim.total': { en: 'Total Operational Efficiency', es: 'Eficiencia Operativa Total' },
    'studio.sim.cycle': { en: 'Cycle Time', es: 'Tiempo de Ciclo' },
    'studio.sim.opex': { en: 'Monthly OPEX Savings', es: 'Ahorro OPEX Mensual' },
    'studio.sim.download': { en: 'Download Report', es: 'Descargar Reporte' },
    'studio.road.label': { en: 'Implementation', es: 'Implementación' },
    'studio.road.title': { en: 'BPA Execution Roadmap', es: 'Roadmap de Ejecución BPA' },
    'studio.road.1': { en: 'Phase 1: Mapping', es: 'Fase 1: Mapeo' },
    'studio.road.2': { en: 'Phase 2: Auto', es: 'Fase 2: Auto' },
    'studio.road.3': { en: 'Phase 3: AI', es: 'Fase 3: IA' },
    'studio.road.s1.title': { en: 'Process Mining', es: 'Process Mining' },
    'studio.road.s1.desc': { en: 'Digital X-ray of your current operations. We identify invisible bottlenecks and redundancies through log analysis.', es: 'Radiografía digital de sus operaciones actuales. Identificamos cuellos de botella invisibles y redundancias mediante análisis de logs.' },
    'studio.road.s2.title': { en: 'RPA & Orchestration', es: 'RPA & Orquestación' },
    'studio.road.s2.desc': { en: 'Bot deployment for repetitive tasks and orchestration engine configuration connecting ERP, CRM, and Legacy systems.', es: 'Despliegue de bots para tareas repetitivas y configuración del motor de orquestación que conecta sistemas ERP, CRM y Legacy.' },
    'studio.road.s3.title': { en: 'Cognitive Intelligence', es: 'Inteligencia Cognitiva' },
    'studio.road.s3.desc': { en: 'Upper AI layer that learns from exceptions and autonomously optimizes workflows in real time.', es: 'Capa superior de IA que aprende de las excepciones y optimiza autónomamente los flujos de trabajo en tiempo real.' },
    'studio.final.title': { en: 'Activate Your Growth Engine', es: 'Active su Motor de Crecimiento' },
    'studio.final.desc': { en: 'Real scalability begins when processes run on their own. Schedule a technical demo of our BPA solutions.', es: 'La escalabilidad real comienza cuando los procesos funcionan solos. Agende una demo técnica de nuestras soluciones BPA.' },
    'studio.final.cta1': { en: 'Start Transformation', es: 'Iniciar Transformación' },
    'studio.final.cta2': { en: 'Download Whitepaper', es: 'Descargar Whitepaper' },

    // ── About Page ──
    'about.badge': { en: 'Strategic Redesign 2026-2028', es: 'Rediseño Estratégico 2026-2028' },
    'about.title1': { en: 'Engineers of', es: 'Ingenieros de' },
    'about.title2': { en: 'Execution', es: 'Ejecución' },
    'about.desc': { en: 'We transform diagnostics into tangible results through Business Engineering. We are the bridge between legal strategy and process automation (BPA).', es: 'Transformamos diagnósticos en resultados tangibles mediante Ingeniería de Negocios. Somos el puente entre la estrategia legal y la automatización de procesos (BPA).' },
    'about.mission.title': { en: 'Beyond traditional consulting', es: 'Más allá de la consultoría tradicional' },
    'about.mission.desc': { en: 'At Pro Corp, we don\'t just deliver documents; we design and implement corporate engineering systems. Our 2028 vision is to establish ourselves as the leading firm in Process Engineering and automated regulatory compliance.', es: 'En Pro Corp, no solo entregamos documentos; diseñamos e implementamos sistemas de ingeniería corporativa. Nuestra visión para 2028 es consolidarnos como la firma líder en Ingeniería de Procesos y cumplimiento normativo automatizado.' },
    'about.f1.title': { en: 'Legal Solutions', es: 'Soluciones Legales' },
    'about.f1.desc': { en: 'Technical structuring and corporate shielding.', es: 'Estructuración técnica y blindaje corporativo.' },
    'about.f2.title': { en: 'Sustainable Growth', es: 'Crecimiento Sostenible' },
    'about.f2.desc': { en: 'Processes designed to support massive load.', es: 'Procesos diseñados para soportar carga masiva.' },
    'about.f3.title': { en: 'BPA (Automation)', es: 'BPA (Automation)' },
    'about.f3.desc': { en: 'Operational efficiency through process automation.', es: 'Eficiencia operativa mediante automatización de procesos.' },
    'about.team.label': { en: 'Our Team', es: 'Nuestro Equipo' },
    'about.team.title': { en: 'Business Engineers', es: 'Ingenieros de Negocios' },
    'about.method.label': { en: 'Our Methodology', es: 'Nuestra Metodología' },
    'about.method.title': { en: 'The Pro Corp Value Cycle', es: 'El Ciclo de Valor Pro Corp' },
    'about.method.desc': { en: 'A linear and hierarchical 7-step engineering process designed to eliminate uncertainty and maximize return.', es: 'Un proceso de ingeniería lineal y jerárquico de 7 pasos diseñado para eliminar la incertidumbre y maximizar el retorno.' },
    'about.step1': { en: 'Diagnosis', es: 'Diagnóstico' },
    'about.step1.desc': { en: 'Technical analysis of current processes.', es: 'Análisis técnico de procesos actuales.' },
    'about.step2': { en: 'Engineering', es: 'Ingeniería' },
    'about.step2.desc': { en: 'Operational structure design.', es: 'Diseño de la estructura operativa.' },
    'about.step3': { en: 'Planning', es: 'Planificación' },
    'about.step3.desc': { en: 'Resource and time logistics.', es: 'Logística de recursos y tiempos.' },
    'about.step4': { en: 'Implementation', es: 'Implementación' },
    'about.step4.desc': { en: 'On-site technical execution.', es: 'Ejecución técnica in-situ.' },
    'about.step5': { en: 'Optimization', es: 'Optimización' },
    'about.step5.desc': { en: 'Continuous process improvement.', es: 'Mejora continua de procesos.' },
    'about.step6': { en: 'Scaling', es: 'Escalamiento' },
    'about.step6.desc': { en: 'Structural expansion.', es: 'Expansión estructural.' },
    'about.step7': { en: 'BPA & Marketing', es: 'BPA & Marketing' },
    'about.step7.desc': { en: 'Demand automation.', es: 'Automatización de demanda.' },
    'about.stat1.label': { en: 'Plan Start', es: 'Inicio Plan' },
    'about.stat2.label': { en: 'Vision Fulfilled', es: 'Visión Cumplida' },
    'about.stat3.label': { en: 'Execution', es: 'Ejecución' },
    'about.stat4.label': { en: 'Key Steps', es: 'Pasos Clave' },
    'about.cta.title': { en: 'Ready for the engineering of your growth?', es: '¿Listo para la ingeniería de su crecimiento?' },
    'about.cta.desc': { en: 'Schedule an initial diagnostic session and discover how our 7-step methodology can transform your corporation.', es: 'Agenda una sesión de diagnóstico inicial y descubre cómo nuestra metodología de 7 pasos puede transformar tu corporación.' },
    'about.cta.btn1': { en: 'Start Diagnosis', es: 'Iniciar Diagnóstico' },
    'about.cta.btn2': { en: 'View Success Cases', es: 'Ver Casos de Éxito' },

    // ── Contact Page ──
    'contact.badge': { en: 'Technology Orchestration 2026-2028', es: 'Orquestación Tecnológica 2026-2028' },
    'contact.title1': { en: 'Start your transformation towards an', es: 'Inicie su transformación hacia un' },
    'contact.title2': { en: 'automated operating model', es: 'modelo operativo automatizado' },
    'contact.desc2': { en: 'Connect with our solution architects to implement BPA (Business Process Automation) strategies. We optimize workflows through intelligent orchestration.', es: 'Conecte con nuestros arquitectos de soluciones para implementar estrategias de BPA (Business Process Automation). Optimizamos flujos de trabajo mediante orquestación inteligente.' },
    'contact.name': { en: 'Full Name', es: 'Nombre Completo' },
    'contact.name.ph': { en: 'e.g. Ana Garcia', es: 'Ej. Ana García' },
    'contact.org': { en: 'Organization', es: 'Organización' },
    'contact.org.ph': { en: 'Company name', es: 'Nombre de su empresa' },
    'contact.email': { en: 'Corporate Email', es: 'Correo Corporativo' },
    'contact.email.ph': { en: 'name@company.com', es: 'nombre@empresa.com' },
    'contact.phone': { en: 'Contact Phone', es: 'Teléfono de Contacto' },
    'contact.phone.ph': { en: '+34 000 000 000', es: '+34 000 000 000' },
    'contact.area': { en: 'Area of Interest (BPA)', es: 'Área de Interés (BPA)' },
    'contact.area.ph': { en: 'Select the required service', es: 'Seleccione el servicio requerido' },
    'contact.area.1': { en: 'Process Automation (BPA)', es: 'Automatización de Procesos (BPA)' },
    'contact.area.2': { en: 'Governance Architecture', es: 'Arquitectura de Gobernanza' },
    'contact.area.3': { en: 'Operating Model Re-engineering', es: 'Reingeniería de Modelos Operativos' },
    'contact.area.4': { en: 'LIA Implementation', es: 'Implementación de LIA' },
    'contact.area.5': { en: 'Digital Transformation Consulting', es: 'Consultoría de Transformación Digital' },
    'contact.level': { en: 'Current Digitalization Level', es: 'Nivel de Digitalización Actual' },
    'contact.level.ph': { en: 'Indicate your current state', es: 'Indique su estado actual' },
    'contact.level.1': { en: 'Initial (Predominantly manual processes)', es: 'Inicial (Procesos manuales predominantes)' },
    'contact.level.2': { en: 'Developing (Isolated tools)', es: 'En desarrollo (Herramientas aisladas)' },
    'contact.level.3': { en: 'Advanced (Integrated systems)', es: 'Avanzado (Sistemas integrados)' },
    'contact.level.4': { en: 'Optimized (Intelligent automation)', es: 'Optimizado (Automatización inteligente)' },
    'contact.details': { en: 'Project Details', es: 'Detalles del Proyecto' },
    'contact.details.ph': { en: 'Describe your automation and orchestration objectives...', es: 'Describa sus objetivos de automatización y orquestación...' },
    'contact.privacy': { en: 'I have read and accept the', es: 'He leído y acepto la' },
    'contact.privacy.link': { en: 'Privacy Policy', es: 'Política de Privacidad' },
    'contact.privacy.auth': { en: '. I authorize the analysis of my data for technology architecture proposals.', es: '. Autorizo el análisis de mis datos para propuestas de arquitectura tecnológica.' },
    'contact.submit': { en: 'Request BPA Evaluation', es: 'Solicitar Evaluación BPA' },
    'contact.info1.title': { en: 'Innovation Center', es: 'Centro de Innovación' },
    'contact.info1.line1': { en: 'Technology District 22@', es: 'Distrito Tecnológico 22@' },
    'contact.info1.line2': { en: '08018 Barcelona, Spain', es: '08018 Barcelona, España' },
    'contact.info2.title': { en: 'Technical Support', es: 'Soporte Técnico' },
    'contact.info2.link': { en: 'Open support ticket', es: 'Abrir ticket de soporte' },
    'contact.info3.title': { en: 'BPA Consulting', es: 'Consultoría BPA' },
    'contact.info3.line2': { en: 'Consulting Hours: 09:00 - 18:00 CET', es: 'Horario de Consultoría: 09:00 - 18:00 CET' },
    'contact.map': { en: 'Tech Hub - Operational', es: 'Tech Hub - Operativo' },
};

// ─── PROVIDER ───────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Language>('en');

    const toggleLang = useCallback(() => {
        setLang(prev => prev === 'en' ? 'es' : 'en');
    }, []);

    const t = useCallback((key: string): string => {
        return translations[key]?.[lang] ?? key;
    }, [lang]);

    return (
        <LanguageContext.Provider value={{ lang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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
    'home.pillar1.title': { en: 'Legal Solutions', es: 'Soluciones Legales' },
    'home.pillar1.desc': { en: 'Legal advice adapted to the digital era. We digitize complex legal frameworks into executable code, ensuring real-time regulatory compliance.', es: 'Asesoría jurídica adaptada a la era digital. Digitalizamos marcos legales complejos en código ejecutable, garantizando cumplimiento normativo en tiempo real.' },
    'home.pillar2.title': { en: 'Sustainable Growth', es: 'Crecimiento Sostenible' },
    'home.pillar2.desc': { en: 'ESG strategies integrated into the core business. Resilient business models designed for the long term.', es: 'Estrategias ESG integradas al core business. Modelos de negocio resilientes diseñados para el largo plazo.' },
    'home.pillar3.title': { en: 'Process Engineering', es: 'Ingeniería de Procesos' },
    'home.pillar3.desc': { en: 'Data intelligence applied to processes (BPA). Workflow optimization through AI and Machine Learning.', es: 'Inteligencia de datos aplicada a procesos (BPA). Optimización de flujos de trabajo mediante IA y Machine Learning.' },
    'home.learnmore': { en: 'Learn more', es: 'Saber más' },
    'home.lia.title1': { en: 'LIA: YOUR', es: 'LIA: TU MOTOR DE' },
    'home.lia.title2': { en: 'LEGAL INTELLIGENCE ENGINE', es: 'INTELIGENCIA LEGAL' },
    'home.lia.desc1': { en: 'LIA not only analyzes,', es: 'LIA no solo analiza,' },
    'home.lia.desc2': { en: 'executes and optimizes', es: 'ejecuta y optimiza' },
    'home.lia.desc3': { en: 'your operating model end to end.', es: 'su modelo operativo de punta a punta.' },
    'home.lia.docs': { en: 'Documents Processed:', es: 'Documentos Procesados:' },
    'home.lia.precision': { en: 'Analysis Precision:', es: 'Precisión de Análisis:' },
    'home.lia.time': { en: 'Time Saved:', es: 'Tiempo Ahorrado:' },
    'home.lia.demo': { en: 'VIEW LIVE DEMO', es: 'VER DEMO EN VIVO' },
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
    'proj.badge': { en: 'Legal Solutions & Immigration', es: 'Soluciones Legales y Migración' },
    'proj.title1': { en: 'Legal Solutions', es: 'Soluciones' },
    'proj.title2': { en: '& Immigration', es: 'Legales y Migratorias' },
    'proj.desc': { en: 'Comprehensive legal advisory for immigration, residence, and corporate investment processes in Spain. We combine specialized legal knowledge with process automation to streamline procedures and ensure compliance.', es: 'Asesoría legal integral para procesos migratorios, de residencia e inversión corporativa en España. Combinamos conocimiento jurídico especializado con automatización de procesos para agilizar trámites y garantizar el cumplimiento normativo.' },
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
    // ── Investment Portfolio Section ──
    'studio.inv.label': { en: 'Investment Portfolio', es: 'Portafolio de Inversión' },
    'studio.inv.title1': { en: 'Strategic', es: 'Sectores' },
    'studio.inv.title2': { en: 'Sectors', es: 'Estratégicos' },
    'studio.inv.desc': { en: 'Over 10 years of experience in asset analysis, providing security and international support to our investors in destinations with stable economies.', es: 'Más de 10 años de experiencia en análisis de activos, brindando seguridad y acompañamiento internacional a inversionistas en destinos con economías estables.' },
    'studio.inv.stat1.value': { en: '10+', es: '10+' },
    'studio.inv.stat1.label': { en: 'Years of Experience', es: 'Años de Experiencia' },
    'studio.inv.stat2.value': { en: '24/7', es: '24/7' },
    'studio.inv.stat2.label': { en: 'Advisory & Support', es: 'Asesoría y Soporte' },
    'studio.inv.stat3.value': { en: '7', es: '7' },
    'studio.inv.stat3.label': { en: 'Investment Sectors', es: 'Sectores de Inversión' },
    'studio.inv.re.title': { en: 'Real Estate', es: 'Inmobiliario' },
    'studio.inv.re.desc': { en: 'Real estate investment projects with diverse profitability and appreciation models. Diversification in tangible and secure assets.', es: 'Proyectos de inversión en finca raíz con diversos modelos de rentabilidad y valorización. Diversificación en activos tangibles y seguros.' },
    'studio.inv.re.tag': { en: 'Tangible Assets', es: 'Activos Tangibles' },
    'studio.inv.da.title': { en: 'Distress Assets', es: 'Activos de Oportunidad' },
    'studio.inv.da.desc': { en: 'Acquisition of real estate assets from illiquidity situations or auctions. Purchase at discount over real commercial value, offering immediate profitability margin.', es: 'Adquisición de activos inmobiliarios provenientes de situaciones de iliquidez o remates. Compra con descuento sobre el valor comercial real, ofreciendo margen de rentabilidad inmediato.' },
    'studio.inv.da.tag': { en: 'High Margin', es: 'Alto Margen' },
    'studio.inv.en.title': { en: 'Energy', es: 'Energía' },
    'studio.inv.en.desc': { en: 'Sustainable energy generation from biomass and downstream projects: refining, processing, sales, and distribution.', es: 'Generación de energía sostenible a partir de biomasas y proyectos downstream: refinación, procesamiento, venta y distribución.' },
    'studio.inv.en.tag': { en: 'Sustainable', es: 'Sostenible' },
    'studio.inv.ft.title': { en: 'Fintech', es: 'Fintech' },
    'studio.inv.ft.desc': { en: 'Financial technology investments in Colombia. Payroll deduction microcredit model with low risk and high capital turnover.', es: 'Inversiones en tecnología financiera en Colombia. Modelo de microcréditos de libranza con bajo riesgo y alta rotación de capital.' },
    'studio.inv.ft.tag': { en: 'Low Risk', es: 'Bajo Riesgo' },
    'studio.inv.av.title': { en: 'Aviation', es: 'Aviación' },
    'studio.inv.av.desc': { en: 'Comprehensive management of aeronautical assets: purchase and sale, leasing, maintenance, and fleet modernization.', es: 'Gestión integral de activos aeronáuticos: compra y venta, leasing, mantenimiento y modernización de flotas.' },
    'studio.inv.av.tag': { en: 'Asset Management', es: 'Gestión de Activos' },
    'studio.inv.ed.title': { en: 'Edutainment', es: 'Edutainment' },
    'studio.inv.ed.desc': { en: 'Innovative projects combining leisure and immersive learning. Social and educational impact for families and communities.', es: 'Proyectos innovadores que combinan ocio y aprendizaje inmersivo. Impacto social y educativo para familias y comunidades.' },
    'studio.inv.ed.tag': { en: 'Social Impact', es: 'Impacto Social' },
    'studio.inv.tech.title': { en: 'Technology & AI', es: 'Tecnología & IA' },
    'studio.inv.tech.desc': { en: 'Investment in BPA platforms, artificial intelligence, and process automation systems. Scalable digital infrastructure with predictive analytics and cognitive orchestration engines.', es: 'Inversión en plataformas BPA, inteligencia artificial y sistemas de automatización de procesos. Infraestructura digital escalable con analítica predictiva y motores de orquestación cognitiva.' },
    'studio.inv.tech.tag': { en: 'Digital Infrastructure', es: 'Infraestructura Digital' },
    'studio.inv.cta': { en: 'Explore Opportunities', es: 'Explorar Oportunidades' },

    // Investment Process Steps
    'studio.inv.process.label': { en: 'How to Invest', es: 'Cómo Invertir' },
    'studio.inv.process.title': { en: 'Investment Process', es: 'Proceso de Inversión' },
    'studio.inv.step1.title': { en: 'Initial Consultation', es: 'Consulta Inicial' },
    'studio.inv.step1.desc': { en: 'We evaluate your investor profile, objectives, and risk appetite to identify optimal sectors.', es: 'Evaluamos tu perfil de inversionista, objetivos y apetito de riesgo para identificar los sectores óptimos.' },
    'studio.inv.step2.title': { en: 'Due Diligence', es: 'Due Diligence' },
    'studio.inv.step2.desc': { en: 'Legal, financial, and technical review of each project. Full documentation shared before any commitment.', es: 'Revisión legal, financiera y técnica de cada proyecto. Documentación completa compartida antes de cualquier compromiso.' },
    'studio.inv.step3.title': { en: 'Structured Participation', es: 'Participación Estructurada' },
    'studio.inv.step3.desc': { en: 'Equity participation, project financing, or direct asset acquisition — each model with clear legal frameworks.', es: 'Participación accionaria, financiación de proyectos o adquisición directa de activos — cada modelo con marcos legales claros.' },
    'studio.inv.step4.title': { en: 'Monitoring & Reporting', es: 'Monitoreo y Reportes' },
    'studio.inv.step4.desc': { en: 'Periodic performance reports, direct access to project managers, and transparent capital tracking.', es: 'Reportes periódicos de rendimiento, acceso directo a gestores del proyecto y seguimiento transparente de capital.' },

    // Key Investment Data
    'studio.inv.data.title': { en: 'Key Information', es: 'Información Clave' },
    'studio.inv.data.entity': { en: 'Operating Entity', es: 'Entidad Operadora' },
    'studio.inv.data.entity.value': { en: 'Pro Corp S.A.S. — NIT 901.234.567-8', es: 'Pro Corp S.A.S. — NIT 901.234.567-8' },
    'studio.inv.data.jurisdiction': { en: 'Jurisdictions', es: 'Jurisdicciones' },
    'studio.inv.data.jurisdiction.value': { en: 'Colombia & Spain (EU)', es: 'Colombia y España (UE)' },
    'studio.inv.data.models': { en: 'Participation Models', es: 'Modelos de Participación' },
    'studio.inv.data.models.value': { en: 'Equity · Project Financing · Direct Acquisition', es: 'Accionario · Financiación de Proyectos · Adquisición Directa' },
    'studio.inv.data.currency': { en: 'Currencies', es: 'Divisas' },
    'studio.inv.data.currency.value': { en: 'COP · USD · EUR', es: 'COP · USD · EUR' },

    // Trust Signals
    'studio.inv.security': { en: 'Investment Security', es: 'Seguridad de Inversión' },
    'studio.inv.international': { en: 'International Destinations', es: 'Destinos Internacionales' },
    'studio.inv.track': { en: '10+ Years Track Record', es: '10+ Años de Trayectoria' },
    'studio.inv.protection': { en: 'Capital Protection', es: 'Protección de Capital' },
    'studio.inv.protection.desc': { en: 'Fiduciary structures and legally constituted vehicles to safeguard investor capital in each project.', es: 'Estructuras fiduciarias y vehículos legalmente constituidos para salvaguardar el capital del inversionista en cada proyecto.' },
    'studio.inv.managers': { en: 'Project Managers', es: 'Gestores de Proyecto' },
    'studio.inv.managers.desc': { en: 'Direct point of contact for each investment with periodic reports and full traceability.', es: 'Punto de contacto directo para cada inversión con reportes periódicos y trazabilidad completa.' },

    'studio.final.title': { en: 'Activate Your Growth Engine', es: 'Active su Motor de Crecimiento' },
    'studio.final.desc': { en: 'Real scalability begins when processes run on their own. Schedule a technical demo of our BPA solutions.', es: 'La escalabilidad real comienza cuando los procesos funcionan solos. Agende una demo técnica de nuestras soluciones BPA.' },
    'studio.final.cta1': { en: 'Start Transformation', es: 'Iniciar Transformación' },
    'studio.final.cta2': { en: 'Download Whitepaper', es: 'Descargar Whitepaper' },

    // ── About Page ──
    'about.badge': { en: 'Strategic Redesign 2026-2028', es: 'Rediseño Estratégico 2026-2028' },
    'about.title1': { en: 'Engineers of', es: 'Ingenieros de' },
    'about.title2': { en: 'Execution', es: 'Ejecución' },
    'about.desc': { en: 'You want to expand internationally but the legal complexity, manual processes, and fragmented operations slow you down. We take that off your plate — structuring your legality, automating your workflows, and connecting you with strategic investment — so you focus on growing your business.', es: 'Quieres expandirte internacionalmente pero la complejidad legal, los procesos manuales y las operaciones fragmentadas te frenan. Nosotros nos encargamos — estructuramos tu legalidad, automatizamos tus flujos de trabajo y te conectamos con inversión estratégica — para que te enfoques en hacer crecer tu negocio.' },
    'about.mission.title': { en: 'What do we solve for you?', es: '¿Qué resolvemos para ti?' },
    'about.mission.desc': { en: 'Your immigration paperwork takes months? We automate tracking and cut processing time. Your operations depend on spreadsheets and manual follow-ups? We re-engineer them into automated workflows. You need to invest abroad but lack legal certainty? We structure the entire operation. At Pro Corp, every engagement delivers a concrete outcome: time saved, risk reduced, costs lowered.', es: '¿Tus trámites migratorios tardan meses? Automatizamos el seguimiento y reducimos los tiempos. ¿Tus operaciones dependen de hojas de cálculo y seguimientos manuales? Las reingeniamos en flujos automatizados. ¿Necesitas invertir en el exterior pero te falta certeza legal? Estructuramos toda la operación. En Pro Corp, cada proyecto entrega un resultado concreto: tiempo ahorrado, riesgo reducido, costos disminuidos.' },
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
    'contact.phone.ph': { en: '+57 300 000 0000', es: '+57 300 000 0000' },
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
    'contact.info1.title': { en: 'Bogotá — Headquarters', es: 'Bogotá — Sede Principal' },
    'contact.info1.line1': { en: 'Calle 127A #7-19, Office 301B', es: 'Calle 127A #7-19, Oficina 301B' },
    'contact.info1.line2': { en: 'Centro Empresarial Acces, Bogotá', es: 'Centro Empresarial Acces, Bogotá' },
    'contact.info2.title': { en: 'Madrid — Office', es: 'Madrid — Oficina' },
    'contact.info2.line1': { en: 'Calle Jorge Juan 30, Floor 1', es: 'Calle Jorge Juan 30, Piso 1' },
    'contact.info2.line2': { en: '28001 Barrio Salamanca, Madrid', es: '28001 Barrio Salamanca, Madrid' },
    'contact.info2.link': { en: 'View on map', es: 'Ver en mapa' },
    'contact.info3.title': { en: 'Direct Contact', es: 'Contacto Directo' },
    'contact.info3.line1': { en: 'extranjeria@pro-corp.net', es: 'extranjeria@pro-corp.net' },
    'contact.info3.line2': { en: '+57 300 929 2911 · +34 665 325 994', es: '+57 300 929 2911 · +34 665 325 994' },
    'contact.info3.link': { en: 'Chat on WhatsApp', es: 'Chatear por WhatsApp' },
    'contact.map': { en: 'Headquarters — Operational', es: 'Sede Principal — Operativa' },
    'footer.location': { en: 'Headquarters', es: 'Sede Central' },
    'footer.location.address': { en: 'Calle 127A #7-19, Office 301B', es: 'Calle 127A #7-19, Oficina 301B' },
    'footer.location.city': { en: 'Centro Empresarial Acces — Bogotá, Colombia', es: 'Centro Empresarial Acces — Bogotá, Colombia' },
    'footer.location.cta': { en: 'Get Directions', es: 'Cómo Llegar' },

    // ── Privacy Policy Page ──
    'privacy.badge': { en: 'Legal', es: 'Legal' },
    'privacy.title': { en: 'Data Processing Policy', es: 'Política de Tratamiento de Datos' },
    'privacy.updated': { en: 'Last updated: March 2026', es: 'Última actualización: Marzo 2026' },
    'privacy.intro': {
        en: 'PRO CORP S.A.S. (hereinafter "Pro Corp"), with registered address at Calle 127A #7-19, Office 301B, Centro Empresarial Acces, Bogotá, Colombia, and representative office at Calle Jorge Juan 30, Floor 1, 28001 Madrid, Spain, is committed to protecting the privacy and personal data of its users, clients, and collaborators in accordance with applicable regulations.',
        es: 'PRO CORP S.A.S. (en adelante "Pro Corp"), con domicilio en la Calle 127A #7-19, Oficina 301B, Centro Empresarial Acces, Bogotá, Colombia, y oficina de representación en la Calle Jorge Juan 30, Piso 1, 28001 Madrid, España, se compromete a proteger la privacidad y los datos personales de sus usuarios, clientes y colaboradores de acuerdo con la normativa aplicable.'
    },
    'privacy.s1.title': { en: 'Applicable Regulations', es: 'Normativa Aplicable' },
    'privacy.s1.text': {
        en: 'This policy complies with: (i) Colombian Law 1581 of 2012 and Decree 1377 of 2013 on Personal Data Protection; (ii) EU General Data Protection Regulation (GDPR) 2016/679; (iii) Spanish Organic Law 3/2018 on Personal Data Protection and Digital Rights Guarantee (LOPDGDD).',
        es: 'Esta política cumple con: (i) la Ley 1581 de 2012 y el Decreto 1377 de 2013 sobre Protección de Datos Personales de Colombia; (ii) el Reglamento General de Protección de Datos (RGPD) 2016/679 de la Unión Europea; (iii) la Ley Orgánica 3/2018 de Protección de Datos Personales y Garantía de los Derechos Digitales de España (LOPDGDD).'
    },
    'privacy.s2.title': { en: 'Data Controller', es: 'Responsable del Tratamiento' },
    'privacy.s2.text': {
        en: 'PRO CORP S.A.S.\nCalle 127A #7-19, Office 301B\nCentro Empresarial Acces, Bogotá, Colombia\nEmail: extranjeria@pro-corp.net\nPhone: +57 300 929 2911',
        es: 'PRO CORP S.A.S.\nCalle 127A #7-19, Oficina 301B\nCentro Empresarial Acces, Bogotá, Colombia\nCorreo: extranjeria@pro-corp.net\nTeléfono: +57 300 929 2911'
    },
    'privacy.s3.title': { en: 'Data We Collect', es: 'Datos que Recopilamos' },
    'privacy.s3.text': {
        en: 'We collect the following categories of personal data:\n• Identification data: full name, ID/passport number, nationality\n• Contact data: email, phone number, postal address\n• Professional data: company name, position, industry\n• Service data: immigration case details, corporate structuring information, investment preferences\n• Technical data: IP address, browser type, device information, navigation data\n• Communication data: messages sent through our contact forms and LIA chat assistant',
        es: 'Recopilamos las siguientes categorías de datos personales:\n• Datos de identificación: nombre completo, número de documento/pasaporte, nacionalidad\n• Datos de contacto: correo electrónico, número de teléfono, dirección postal\n• Datos profesionales: nombre de empresa, cargo, sector\n• Datos del servicio: detalles de caso migratorio, información de estructuración corporativa, preferencias de inversión\n• Datos técnicos: dirección IP, tipo de navegador, información del dispositivo, datos de navegación\n• Datos de comunicación: mensajes enviados a través de formularios de contacto y el asistente LIA'
    },
    'privacy.s4.title': { en: 'Purpose of Processing', es: 'Finalidad del Tratamiento' },
    'privacy.s4.text': {
        en: 'Your personal data is processed for the following purposes:\n• Provision of legal, immigration, and corporate advisory services\n• Management of investment portfolio consultations\n• Communication about the status of your processes and cases\n• Sending relevant information about our services (with prior consent)\n• Compliance with legal and regulatory obligations\n• Improvement of our digital platform and user experience\n• Operation of our AI assistant LIA for customer support',
        es: 'Sus datos personales son tratados para las siguientes finalidades:\n• Prestación de servicios legales, migratorios y de asesoría corporativa\n• Gestión de consultas del portafolio de inversión\n• Comunicación sobre el estado de sus procesos y casos\n• Envío de información relevante sobre nuestros servicios (con consentimiento previo)\n• Cumplimiento de obligaciones legales y regulatorias\n• Mejora de nuestra plataforma digital y experiencia de usuario\n• Operación de nuestro asistente de IA LIA para soporte al cliente'
    },
    'privacy.s5.title': { en: 'Legal Basis', es: 'Base Legal' },
    'privacy.s5.text': {
        en: 'The processing of your data is based on:\n• Contractual necessity: to provide the services you have requested\n• Legitimate interest: to improve our services and platform\n• Legal obligation: to comply with applicable regulations\n• Consent: for marketing communications and non-essential cookies',
        es: 'El tratamiento de sus datos se basa en:\n• Necesidad contractual: para prestar los servicios que ha solicitado\n• Interés legítimo: para mejorar nuestros servicios y plataforma\n• Obligación legal: para cumplir con la normativa aplicable\n• Consentimiento: para comunicaciones de marketing y cookies no esenciales'
    },
    'privacy.s6.title': { en: 'International Transfers', es: 'Transferencias Internacionales' },
    'privacy.s6.text': {
        en: 'Given our operations in Colombia and Spain, your data may be transferred internationally between our offices. These transfers are carried out with appropriate safeguards, including standard contractual clauses approved by the European Commission and compliance with Colombian data protection regulations.',
        es: 'Dada nuestra operación en Colombia y España, sus datos pueden ser transferidos internacionalmente entre nuestras oficinas. Estas transferencias se realizan con las garantías adecuadas, incluyendo cláusulas contractuales tipo aprobadas por la Comisión Europea y cumplimiento de la normativa colombiana de protección de datos.'
    },
    'privacy.s7.title': { en: 'Data Retention', es: 'Conservación de Datos' },
    'privacy.s7.text': {
        en: 'Personal data will be retained for the duration of the contractual relationship and, thereafter, for the legally required periods. For immigration and legal cases, data is retained for a minimum of 5 years after case closure as required by applicable regulations.',
        es: 'Los datos personales se conservarán durante la vigencia de la relación contractual y, posteriormente, durante los plazos legalmente exigidos. Para casos migratorios y legales, los datos se conservan por un mínimo de 5 años después del cierre del caso según lo exige la normativa aplicable.'
    },
    'privacy.s8.title': { en: 'Your Rights', es: 'Sus Derechos' },
    'privacy.s8.text': {
        en: 'You have the right to:\n• Access your personal data\n• Rectify inaccurate or incomplete data\n• Request deletion of your data\n• Object to or restrict processing\n• Data portability\n• Withdraw consent at any time\n\nTo exercise these rights, contact us at extranjeria@pro-corp.net. We will respond within 15 business days (Colombia) or 30 calendar days (EU).',
        es: 'Usted tiene derecho a:\n• Acceder a sus datos personales\n• Rectificar datos inexactos o incompletos\n• Solicitar la supresión de sus datos\n• Oponerse o limitar el tratamiento\n• Portabilidad de datos\n• Retirar su consentimiento en cualquier momento\n\nPara ejercer estos derechos, contáctenos a extranjeria@pro-corp.net. Responderemos en un plazo de 15 días hábiles (Colombia) o 30 días naturales (UE).'
    },
    'privacy.s9.title': { en: 'Contact & Complaints', es: 'Contacto y Reclamaciones' },
    'privacy.s9.text': {
        en: 'For inquiries about data processing: extranjeria@pro-corp.net\n\nYou also have the right to file a complaint with the competent supervisory authority:\n• Colombia: Superintendencia de Industria y Comercio (SIC)\n• Spain: Agencia Española de Protección de Datos (AEPD)',
        es: 'Para consultas sobre tratamiento de datos: extranjeria@pro-corp.net\n\nTambién tiene derecho a presentar una reclamación ante la autoridad de control competente:\n• Colombia: Superintendencia de Industria y Comercio (SIC)\n• España: Agencia Española de Protección de Datos (AEPD)'
    },

    // ── Cookie Policy Page ──
    'cookies.badge': { en: 'Legal', es: 'Legal' },
    'cookies.title': { en: 'Cookie Policy', es: 'Política de Cookies' },
    'cookies.updated': { en: 'Last updated: March 2026', es: 'Última actualización: Marzo 2026' },
    'cookies.intro': {
        en: 'This Cookie Policy explains how PRO CORP S.A.S. ("Pro Corp") uses cookies and similar technologies on our website. By continuing to browse our site, you consent to the use of cookies as described in this policy.',
        es: 'Esta Política de Cookies explica cómo PRO CORP S.A.S. ("Pro Corp") utiliza cookies y tecnologías similares en nuestro sitio web. Al continuar navegando en nuestro sitio, usted consiente el uso de cookies según lo descrito en esta política.'
    },
    'cookies.s1.title': { en: 'What Are Cookies?', es: '¿Qué Son las Cookies?' },
    'cookies.s1.text': {
        en: 'Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They allow the site to recognize your device and remember certain information about your visit, such as your preferences and settings.',
        es: 'Las cookies son pequeños archivos de texto que se almacenan en su dispositivo (computador, tableta o teléfono móvil) cuando visita un sitio web. Permiten que el sitio reconozca su dispositivo y recuerde cierta información sobre su visita, como sus preferencias y configuraciones.'
    },
    'cookies.s2.title': { en: 'Types of Cookies We Use', es: 'Tipos de Cookies que Utilizamos' },
    'cookies.s2.essential.title': { en: 'Essential Cookies', es: 'Cookies Esenciales' },
    'cookies.s2.essential.text': {
        en: 'Required for the website to function properly. They enable core features like page navigation, access to secure areas, and language preferences. The site cannot function correctly without these cookies.',
        es: 'Necesarias para el correcto funcionamiento del sitio web. Habilitan funciones básicas como la navegación entre páginas, acceso a áreas seguras y preferencias de idioma. El sitio no puede funcionar correctamente sin estas cookies.'
    },
    'cookies.s2.analytics.title': { en: 'Analytics Cookies', es: 'Cookies de Analítica' },
    'cookies.s2.analytics.text': {
        en: 'We use Google Analytics to understand how visitors interact with our website. These cookies collect information anonymously and help us improve the user experience. Data collected includes pages visited, time spent on the site, and how you arrived at our website.',
        es: 'Utilizamos Google Analytics para comprender cómo los visitantes interactúan con nuestro sitio web. Estas cookies recopilan información de forma anónima y nos ayudan a mejorar la experiencia del usuario. Los datos recopilados incluyen páginas visitadas, tiempo en el sitio y cómo llegó a nuestro sitio web.'
    },
    'cookies.s2.functional.title': { en: 'Functional Cookies', es: 'Cookies Funcionales' },
    'cookies.s2.functional.text': {
        en: 'These cookies remember your choices (such as language preference and region) and provide enhanced, personalized features. They may also be used to remember changes you have made to text size, fonts, and other customizable elements.',
        es: 'Estas cookies recuerdan sus elecciones (como preferencia de idioma y región) y proporcionan funciones mejoradas y personalizadas. También pueden usarse para recordar cambios que ha realizado en tamaño de texto, fuentes y otros elementos personalizables.'
    },
    'cookies.s3.title': { en: 'Cookie Details', es: 'Detalle de Cookies' },
    'cookies.s3.c1': { en: 'Language preference — Essential — Session', es: 'Preferencia de idioma — Esencial — Sesión' },
    'cookies.s3.c2': { en: '_ga, _ga_* — Analytics (Google Analytics) — 2 years', es: '_ga, _ga_* — Analítica (Google Analytics) — 2 años' },
    'cookies.s3.c3': { en: 'lia_wa_id — Functional (LIA Chat session) — Persistent', es: 'lia_wa_id — Funcional (Sesión de Chat LIA) — Persistente' },
    'cookies.s4.title': { en: 'How to Manage Cookies', es: 'Cómo Gestionar las Cookies' },
    'cookies.s4.text': {
        en: 'You can control and manage cookies through your browser settings. Most browsers allow you to:\n• View what cookies are stored and delete them individually\n• Block third-party cookies\n• Block cookies from specific sites\n• Block all cookies\n• Delete all cookies when you close the browser\n\nPlease note that blocking certain cookies may affect the functionality of this website.',
        es: 'Puede controlar y gestionar las cookies a través de la configuración de su navegador. La mayoría de los navegadores le permiten:\n• Ver qué cookies están almacenadas y eliminarlas individualmente\n• Bloquear cookies de terceros\n• Bloquear cookies de sitios específicos\n• Bloquear todas las cookies\n• Eliminar todas las cookies al cerrar el navegador\n\nTenga en cuenta que bloquear ciertas cookies puede afectar la funcionalidad de este sitio web.'
    },
    'cookies.s5.title': { en: 'Changes to This Policy', es: 'Cambios en Esta Política' },
    'cookies.s5.text': {
        en: 'We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our business operations. We recommend reviewing this page periodically.',
        es: 'Podemos actualizar esta Política de Cookies periódicamente para reflejar cambios en la tecnología, legislación o nuestras operaciones. Recomendamos revisar esta página periódicamente.'
    },
    'cookies.s6.title': { en: 'Contact', es: 'Contacto' },
    'cookies.s6.text': {
        en: 'For questions about our use of cookies, contact us at extranjeria@pro-corp.net.',
        es: 'Para preguntas sobre nuestro uso de cookies, contáctenos a extranjeria@pro-corp.net.'
    },
};

// ─── PROVIDER ───────────────────────────────────────────────────
function detectLanguage(): Language {
    if (typeof window === 'undefined') return 'en';
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    return browserLang.startsWith('es') ? 'es' : 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Language>('en');

    useEffect(() => {
        setLang(detectLanguage());
    }, []);

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

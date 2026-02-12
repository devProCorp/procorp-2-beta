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
    'nav.services': { en: 'Services', es: 'Servicios' },
    'nav.about': { en: 'About', es: 'Nosotros' },
    'nav.journal': { en: 'Journal', es: 'Blog' },
    'nav.contact': { en: 'Contact', es: 'Contacto' },

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

'use client';

// Landing «Inteligencia electoral» de Innovación (Lina Díaz, 2026-11-09), pasada de
// HTML a React con su estructura y estilos (landing.css). Cambios pedidos por Lina el
// mismo día: todo en español, «Panorama electoral» con La Moncloa, el Senado y RTVE,
// comparador a partir del listado del Senado, y oportunidades con los proyectos y
// herramientas reales de PRO CORP. El contenido vive en datos.ts con su fuente.

import { useEffect, useRef, useState } from 'react';
import {
  CALENDARIO,
  ETAPAS,
  FUENTES,
  GRUPOS_SENADO,
  HERRAMIENTAS,
  PARTIDOS,
  PROYECTOS_ABIERTOS,
  QUE_SE_ELIGE,
  QUIEN_VOTA,
  REVISADO,
  SECTORES,
} from './datos';
import BurbujaWhatsApp from './BurbujaWhatsApp';
import VideoBienvenida from './VideoBienvenida';
import './landing.css';

// El mismo logo y tamaño que la cabecera (40 px) y el pie (36 px) del resto de la web.
const LOGO = '/brand/Logo_PCP_Business_Engineering.png';
const API_INTERES = `${process.env.NEXT_PUBLIC_INVERSION_URL ?? 'https://inversion.pro-corp.net'}/api/interes`;

const TEMAS = [
  'Economía y fiscalidad',
  'Vivienda e inmobiliario',
  'Inteligencia artificial y tecnología',
  'Empleo',
  'Energía y sostenibilidad',
  'Inversión extranjera',
  'Inmigración y extranjería',
];

function Fuente({ f }: { f: { titulo: string; url: string } }) {
  return (
    <a href={f.url} target="_blank" rel="noopener noreferrer" className="pill">
      Fuente: {f.titulo}
    </a>
  );
}

export default function LandingElectoral() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modulo, setModulo] = useState<string | null>(null);
  const [tema, setTema] = useState(TEMAS[0]);
  const [form, setForm] = useState({
    interest: SECTORES[0],
    market: 'España',
    capital: 'Menos de 50.000 €',
    horizon: 'Corto plazo',
    name: '',
    email: '',
  });
  const [consent, setConsent] = useState(false);
  const [envio, setEnvio] = useState<'idle' | 'enviando' | 'ok' | 'error'>('idle');
  // Momento en que se abrió la página: la API descarta envíos en menos de 1,5 s (bots).
  const abierto = useRef(0);

  useEffect(() => {
    abierto.current = Date.now();
  }, []);

  const cerrarMenu = () => setMenuAbierto(false);
  const cambiar = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submitInvestment() {
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Por favor, introduce tu nombre y un correo electrónico válido.');
      return;
    }
    if (!consent) {
      alert('Por favor, acepta la autorización de contacto.');
      return;
    }
    const mensaje = [
      'Consulta desde la landing de las Elecciones Generales 2026 (Explorador de inversiones).',
      `Interés de inversión: ${form.interest}`,
      `Mercado de interés: ${form.market}`,
      `Rango de inversión: ${form.capital}`,
      `Horizonte de inversión: ${form.horizon}`,
    ].join('\n');
    setEnvio('enviando');
    try {
      const res = await fetch(API_INTERES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          general: true,
          campos: { nombre: name, email, mensaje },
          consentimiento: true,
          origen: { idioma: 'es', pagina: window.location.pathname, referente: document.referrer },
          sitio_web: (document.getElementById('sitio_web') as HTMLInputElement | null)?.value ?? '',
          ms_abierto: Date.now() - abierto.current,
        }),
      });
      setEnvio(res.ok ? 'ok' : 'error');
    } catch {
      setEnvio('error');
    }
    requestAnimationFrame(() =>
      document.getElementById('investmentResult')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
    );
  }

  return (
    <div className="landing-electoral">
      <VideoBienvenida />
      <BurbujaWhatsApp />
      <header>
        <div className="container nav">
          <a href="#home" className="logo-link" aria-label="PRO CORP, inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-logo" src={LOGO} alt="PRO CORP" />
          </a>
          <nav className={`nav-links${menuAbierto ? ' open' : ''}`} id="navLinks">
            <a href="#home" onClick={cerrarMenu}>Inicio</a>
            <a href="#election" onClick={cerrarMenu}>Elecciones</a>
            <a href="#overview-tool" onClick={() => { cerrarMenu(); setModulo('overview-tool'); }}>Panorama</a>
            <a href="#policies" onClick={() => { cerrarMenu(); setModulo('policies'); }}>Programas</a>
            <a href="#investment" onClick={cerrarMenu}>Inversión</a>
          </nav>
          <div className="nav-actions">
            <span className="lang">🇪🇸 ES</span>
            <a className="btn" href="#investment">CONTACTO</a>
          </div>
          <button className="menu-toggle" aria-label="Abrir navegación" onClick={() => setMenuAbierto((v) => !v)}>
            ☰
          </button>
        </div>
      </header>

      <main>
        <div className="hero" id="home">
          <svg className="network" viewBox="0 0 1400 650" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g stroke="#8090a8" strokeWidth="1" opacity=".32" fill="none">
              <path d="M80 120L210 80L300 190L180 280L80 120M210 80L390 130L300 190L420 310L180 280M920 100L1080 160L1250 90L1320 250L1150 330L1080 160M920 100L850 260L1050 420L1150 330L1320 250M180 480L300 390L420 500L550 420L650 560M850 500L1050 420L1190 530L1320 450" />
              <path d="M80 120L180 280L180 480L300 390L300 190M390 130L420 310L550 420L420 500M850 260L920 100L1150 330L1190 530M1050 420L850 500L650 560" />
            </g>
            <g fill="#d6deea" opacity=".65">
              <circle cx="80" cy="120" r="4" /><circle cx="210" cy="80" r="5" /><circle cx="300" cy="190" r="4" /><circle cx="180" cy="280" r="5" /><circle cx="390" cy="130" r="4" /><circle cx="420" cy="310" r="5" /><circle cx="180" cy="480" r="4" /><circle cx="300" cy="390" r="5" /><circle cx="550" cy="420" r="4" /><circle cx="650" cy="560" r="5" /><circle cx="920" cy="100" r="4" /><circle cx="1080" cy="160" r="5" /><circle cx="1250" cy="90" r="4" /><circle cx="1320" cy="250" r="5" /><circle cx="1150" cy="330" r="4" /><circle cx="1050" cy="420" r="5" /><circle cx="1190" cy="530" r="4" />
            </g>
            <g fill="#d60925"><circle cx="550" cy="420" r="5" /><circle cx="850" cy="500" r="5" /><circle cx="1050" cy="420" r="4" /></g>
          </svg>
          <div className="container hero-content">
            <div className="eyebrow">PRO CORP / INTELIGENCIA ELECTORAL</div>
            <h1>
              Elecciones
              <br />
              <span className="gradient">Generales de España 2026.</span>
            </h1>
            <p>Comprende el panorama político. Compara propuestas. Descubre oportunidades de inversión.</p>
            <div className="date-label">29 DE NOVIEMBRE DE 2026</div>
            <br />
            <a href="#election" className="btn">CONOCER MÁS →</a>
          </div>
        </div>

        <section id="election">
          <div className="container">
            <div className="eyebrow">Conoce más sobre las elecciones</div>
            <h2 className="section-title">
              Comprende qué está pasando en <span className="gradient">España.</span>
            </h2>
            <h3 className="section-title" style={{ fontSize: 30 }} id="overview">Explora las elecciones</h3>
            <p className="section-subtitle">Información política y electoral.</p>
            <div className="modules">
              <article className="module">
                <div className="module-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200')" }} />
                <div className="module-body">
                  <div className="module-number">01 / ELECCIONES</div>
                  <h3>Panorama electoral</h3>
                  <p>Conoce el contexto electoral, los partidos, el calendario y los principales indicadores.</p>
                  <a href="#overview-tool" className="explore" onClick={() => setModulo('overview-tool')}>EXPLORAR →</a>
                </div>
              </article>
              <article className="module">
                <div className="module-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200')" }} />
                <div className="module-body">
                  <div className="module-number">02 / PROGRAMAS</div>
                  <h3>Comparador de programas</h3>
                  <p>Compara las propuestas de las formaciones políticas por temática.</p>
                  <a href="#policies" className="explore" onClick={() => setModulo('policies')}>EXPLORAR →</a>
                </div>
              </article>
            </div>

            <div className={`interactive${modulo === 'overview-tool' ? ' active' : ''}`} id="overview-tool">
              <div className="eyebrow">01 / PANORAMA ELECTORAL</div>
              <h3>Comprende el panorama electoral.</h3>
              <p>Información sobre el proceso electoral, las instituciones y el calendario de las elecciones del 29 de noviembre.</p>
              <div className="comparison-grid">
                <div className="comparison-card">
                  <div className="module-number">QUÉ SE ELIGE</div>
                  <h4>Congreso de los Diputados y Senado</h4>
                  <p>{QUE_SE_ELIGE}</p>
                  <Fuente f={FUENTES.moncloa} />
                </div>
                <div className="comparison-card">
                  <div className="module-number">QUIÉN PUEDE VOTAR</div>
                  <h4>Electores</h4>
                  {QUIEN_VOTA.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                  <Fuente f={FUENTES.moncloa} />
                </div>
              </div>

              <div className="comparison-card" style={{ marginTop: 14 }}>
                <div className="module-number">ETAPAS DEL PROCESO ELECTORAL</div>
                <ol className="lista-etapas">
                  {ETAPAS.map((e, i) => (
                    <li key={e.titulo}>
                      <h4>{i + 1}. {e.titulo}</h4>
                      <p>{e.texto}</p>
                    </li>
                  ))}
                </ol>
                <Fuente f={FUENTES.moncloa} />
              </div>

              <div className="comparison-card" style={{ marginTop: 14 }}>
                <div className="module-number">CALENDARIO ELECTORAL</div>
                <h4>Fechas clave hasta el 23 de diciembre</h4>
                <ul className="calendario">
                  {CALENDARIO.map((c) => (
                    <li key={c.fecha + c.texto} className={c.destacado ? 'destacado' : undefined}>
                      <strong>{c.fecha}</strong>
                      <span>{c.texto}</span>
                    </li>
                  ))}
                </ul>
                <Fuente f={FUENTES.rtve} /> <Fuente f={FUENTES.boe} />
              </div>

              <div className="comparison-card" style={{ marginTop: 14 }}>
                <div className="module-number">PARTIDOS Y GRUPOS PARLAMENTARIOS</div>
                <h4>Grupos parlamentarios del Senado</h4>
                <p>Disueltas las Cámaras el 6 de octubre de 2026, la composición del Senado se reduce a la Diputación Permanente. Estos eran sus grupos parlamentarios:</p>
                <ul className="lista-grupos">
                  {GRUPOS_SENADO.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <Fuente f={FUENTES.senadoPartidos} />
              </div>

              <p className="data-note">Información revisada el {REVISADO}.</p>
            </div>

            <div className={`interactive${modulo === 'policies' ? ' active' : ''}`} id="policies">
              <div className="eyebrow">02 / COMPARADOR DE PROGRAMAS</div>
              <h3>Compara propuestas políticas.</h3>
              <p>Selecciona una temática para consultar las propuestas documentadas de las formaciones políticas representadas en el Senado.</p>
              <div className="field">
                <label htmlFor="policyTopic">SELECCIONA UN TEMA</label>
                <select id="policyTopic" value={tema} onChange={(e) => setTema(e.target.value)}>
                  {TEMAS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="result" style={{ marginBottom: 18 }}>
                <strong>{tema}</strong>
                <p>
                  Estamos revisando los programas electorales de cada formación para el 29 de noviembre. Cada propuesta se
                  publicará aquí con su documento fuente, fecha y página. Mientras tanto, puedes consultar el programa en la
                  web de cada partido.
                </p>
              </div>
              <div className="comparison-grid" id="comparisonResults">
                {PARTIDOS.map((p) => (
                  <div className="comparison-card" key={p.nombre}>
                    <div className="module-number">FORMACIÓN POLÍTICA</div>
                    <h4>{p.nombre}</h4>
                    <a href={p.web} target="_blank" rel="noopener noreferrer" className="pill">
                      Web oficial del partido
                    </a>
                  </div>
                ))}
              </div>
              <p className="data-note">
                Formaciones con representación en el Senado según su listado de programas electorales. PRO CORP no recomienda
                el voto a ninguna formación.
              </p>
              <Fuente f={FUENTES.senadoProgramas} />
            </div>
          </div>
        </section>

        <section className="investment-section" id="investment">
          <div className="container">
            <div className="investment-box">
              <div className="eyebrow">OPORTUNIDADES PRO CORP</div>
              <h2>
                Descubre <span className="gradient">oportunidades</span>
                <br />
                de inversión.
              </h2>
              <p>Conoce los proyectos y las oportunidades de inversión estructurados por PRO CORP y encuentra aquellos que coincidan con tus intereses.</p>

              <h3 style={{ fontSize: 25, margin: '28px 0 20px' }}>Herramientas de inversión</h3>
              <div className="comparison-grid">
                {HERRAMIENTAS.map((h) => (
                  <div className="comparison-card" key={h.titulo}>
                    <h4>{h.titulo}</h4>
                    <p>{h.texto}</p>
                    <a href={h.url} className="explore" {...(h.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                      {h.accion.toUpperCase()} →
                    </a>
                  </div>
                ))}
              </div>

              <h3 style={{ fontSize: 25, margin: '28px 0 8px' }}>Explorador de inversiones</h3>
              <p style={{ marginBottom: 20 }}>Selecciona las opciones de tu interés</p>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="interest">INTERÉS DE INVERSIÓN</label>
                  <select id="interest" value={form.interest} onChange={cambiar('interest')}>
                    {SECTORES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="market">MERCADO DE INTERÉS</label>
                  <select id="market" value={form.market} onChange={cambiar('market')}>
                    <option>España</option>
                    <option>Colombia</option>
                    <option>República Dominicana</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="capital">RANGO DE INVERSIÓN</label>
                  <select id="capital" value={form.capital} onChange={cambiar('capital')}>
                    <option>Menos de 50.000 €</option>
                    <option>50.000 € – 100.000 €</option>
                    <option>100.000 € – 500.000 €</option>
                    <option>Más de 500.000 €</option>
                    <option>Aún no lo he definido</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="horizon">HORIZONTE DE INVERSIÓN</label>
                  <select id="horizon" value={form.horizon} onChange={cambiar('horizon')}>
                    <option>Corto plazo</option>
                    <option>Mediano plazo</option>
                    <option>Largo plazo</option>
                    <option>Aún no lo he definido</option>
                  </select>
                </div>
              </div>

              <div className="result" style={{ margin: '4px 0 18px' }}>
                <strong>Proyectos abiertos</strong>
                {PROYECTOS_ABIERTOS.map((p) => (
                  <p key={p.url}>
                    •{' '}
                    <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
                      {p.nombre}
                    </a>
                  </p>
                ))}
              </div>

              <div className="field">
                <label htmlFor="name">NOMBRE COMPLETO</label>
                <input id="name" type="text" placeholder="Tu nombre" autoComplete="name" value={form.name} onChange={cambiar('name')} />
              </div>
              <div className="field">
                <label htmlFor="email">CORREO ELECTRÓNICO</label>
                <input id="email" type="email" placeholder="tu@correo.com" autoComplete="email" value={form.email} onChange={cambiar('email')} />
              </div>
              {/* Trampa para bots: invisible para las personas. */}
              <div aria-hidden="true" style={{ position: 'absolute', left: -9999, height: 0, overflow: 'hidden' }}>
                <input id="sitio_web" name="sitio_web" tabIndex={-1} autoComplete="off" />
              </div>
              <label className="consent">
                <input type="checkbox" id="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>
                  Autorizo a PRO CORP a tratar mis datos de contacto para responder a mi consulta de inversión. He leído la{' '}
                  <a href="/politica-de-privacidad/" style={{ textDecoration: 'underline' }}>política de privacidad</a>.
                </span>
              </label>
              <button className="btn" onClick={submitInvestment} disabled={envio === 'enviando'}>
                {envio === 'enviando' ? 'ENVIANDO…' : 'EXPLORAR OPORTUNIDADES →'}
              </button>
              <div id="investmentResult" className={`result${envio === 'ok' || envio === 'error' ? '' : ' hidden'}`} aria-live="polite">
                {envio === 'ok' && (
                  <>
                    <strong>Gracias, {form.name.trim()}.</strong>
                    <p>Hemos recibido tu consulta. El equipo de PRO CORP te escribirá con las oportunidades que encajen con tus preferencias.</p>
                  </>
                )}
                {envio === 'error' && (
                  <>
                    <strong>No pudimos enviar tu consulta.</strong>
                    <p>Inténtalo de nuevo en unos minutos o escríbenos desde la página de contacto.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-logo" src={LOGO} alt="PRO CORP" />
          </div>
          <p>Ingeniería de negocios · Tecnología · Inteligencia</p>
          <p>© 2026 PRO CORP. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

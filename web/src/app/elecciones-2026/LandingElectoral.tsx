'use client';

// Landing «Inteligencia electoral» de Innovación (Lina Díaz, 2026-11-09), pasada de
// HTML a React sin cambiar textos, estructura ni estilos (landing.css). Lo que en el
// original eran onclick y innerHTML ahora es estado de React; el comportamiento es
// el mismo, incluidos los avisos con alert() del formulario demostrativo.

import { useState } from 'react';
import './landing.css';

const LOGO = '/elecciones-2026/logo-pro-corp.svg';
const PENDIENTE = 'Contenido pendiente: incorporar la propuesta verificada, el documento fuente y la página de referencia.';

const policyData: Record<string, { title: string; a: string; b: string }> = {
  economy: { title: 'Economía y fiscalidad', a: PENDIENTE, b: PENDIENTE },
  housing: { title: 'Vivienda e inmobiliario', a: PENDIENTE, b: PENDIENTE },
  technology: { title: 'Inteligencia artificial y tecnología', a: PENDIENTE, b: PENDIENTE },
  employment: { title: 'Empleo', a: PENDIENTE, b: PENDIENTE },
  energy: { title: 'Energía y sostenibilidad', a: PENDIENTE, b: PENDIENTE },
  investment: { title: 'Inversión extranjera', a: PENDIENTE, b: PENDIENTE },
};

const demoProjects = [
  { name: 'Sector inmobiliario Project — España', interest: 'realestate', market: 'spain' },
  { name: 'Sector inmobiliario Tokenization — República Dominicana', interest: 'tokenization', market: 'dominican' },
  { name: 'Tecnología Project — Colombia', interest: 'technology', market: 'colombia' },
  { name: 'Energía Project — España', interest: 'energy', market: 'spain' },
];

type Resultado = { nombre: string; matches: string[] } | null;

export default function LandingElectoral() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modulo, setModulo] = useState<string | null>(null);
  const [tema, setTema] = useState('economy');
  const [form, setForm] = useState({ interest: 'realestate', market: 'spain', capital: 'under50', horizon: 'short', name: '', email: '' });
  const [consent, setConsent] = useState(false);
  const [resultado, setResultado] = useState<Resultado>(null);

  const cerrarMenu = () => setMenuAbierto(false);
  const cambiar = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  function submitInvestment() {
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
    const matches = demoProjects
      .filter((p) => p.interest === form.interest && (p.market === form.market || form.market === 'other'))
      .map((p) => p.name);
    setResultado({ nombre: name, matches });
    requestAnimationFrame(() =>
      document.getElementById('investmentResult')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }),
    );
  }

  const d = policyData[tema];

  return (
    <div className="landing-electoral">
      <header>
        <div className="container nav">
          <a href="#home" className="logo-link" aria-label="PRO CORP, inicio">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-logo" src={LOGO} alt="PRO CORP — Business Engineering" />
          </a>
          <nav className={`nav-links${menuAbierto ? ' open' : ''}`} id="navLinks">
            <a href="#home" onClick={cerrarMenu}>Inicio</a>
            <a href="#election" onClick={cerrarMenu}>Elecciones</a>
            <a href="#overview" onClick={cerrarMenu}>Panorama</a>
            <a href="#policies" onClick={cerrarMenu}>Programas</a>
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
            <a href="#election" className="btn">EXPLORA LA PLATAFORMA →</a>
          </div>
        </div>

        <section id="election">
          <div className="container">
            <div className="eyebrow">EXPLORA LA PLATAFORMA</div>
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
              <div className="eyebrow">01 / ELECCIONES OVERVIEW</div>
              <h3>Understand the electoral landscape.</h3>
              <p>Consulta información sobre el proceso electoral, las instituciones y el sistema de representación.</p>
              <div className="comparison-grid">
                <div className="comparison-card">
                  <div className="module-number">SISTEMA ELECTORAL</div>
                  <h4>Congreso de los Diputados</h4>
                  <p>Información explicativa sobre el sistema de representación y la distribución territorial de escaños.</p>
                </div>
                <div className="comparison-card">
                  <div className="module-number">CALENDARIO ELECTORAL</div>
                  <h4>29 November 2026</h4>
                  <p>Fechas, plazos e hitos electorales. Incorporar aquí el calendario oficial validado.</p>
                </div>
              </div>
              <div className="result">
                <strong>Información oficial</strong>
                <p>Conectar con la Junta Electoral Central y el Ministerio del Interior para publicar datos y calendario verificados.</p>
              </div>
              <p className="data-note">Módulo demostrativo. Completar con fuentes oficiales antes de publicar.</p>
            </div>

            <div className={`interactive${modulo === 'policies' ? ' active' : ''}`} id="policies">
              <div className="eyebrow">02 / POLICY COMPARATOR</div>
              <h3>Compara propuestas políticas.</h3>
              <p>Selecciona una temática para consultar las propuestas documentadas de las formaciones políticas.</p>
              <div className="field">
                <label htmlFor="policyTopic">SELECCIONA UN TEMA</label>
                <select id="policyTopic" value={tema} onChange={(e) => setTema(e.target.value)}>
                  <option value="economy">Economía y fiscalidad</option>
                  <option value="housing">Vivienda e inmobiliario</option>
                  <option value="technology">Inteligencia artificial y tecnología</option>
                  <option value="employment">Empleo</option>
                  <option value="energy">Energía y sostenibilidad</option>
                  <option value="investment">Inversión extranjera</option>
                </select>
              </div>
              <div className="comparison-grid" id="comparisonResults">
                <div className="comparison-card">
                  <div className="module-number">FORMACIÓN POLÍTICA A</div>
                  <h4>{d.title}</h4>
                  <p>{d.a}</p>
                  <span className="pill">Fuente pendiente</span>
                </div>
                <div className="comparison-card">
                  <div className="module-number">FORMACIÓN POLÍTICA B</div>
                  <h4>{d.title}</h4>
                  <p>{d.b}</p>
                  <span className="pill">Fuente pendiente</span>
                </div>
              </div>
              <p className="data-note">
                Los partidos y las propuestas que se incorporen deberán identificarse con su fuente, fecha y página. No se
                incluyen posiciones políticas reales en esta demo.
              </p>
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
              <h3 style={{ fontSize: 25, margin: '28px 0 20px' }}>Explorador de inversiones</h3>
              <div className="form-grid">
                <div className="field">
                  <label htmlFor="interest">INTERÉS DE INVERSIÓN</label>
                  <select id="interest" value={form.interest} onChange={cambiar('interest')}>
                    <option value="realestate">Sector inmobiliario</option>
                    <option value="tokenization">Sector inmobiliario Tokenization</option>
                    <option value="technology">Tecnología</option>
                    <option value="energy">Energía</option>
                    <option value="other">Otras oportunidades</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="market">MERCADO DE INTERÉS</label>
                  <select id="market" value={form.market} onChange={cambiar('market')}>
                    <option value="spain">España</option>
                    <option value="colombia">Colombia</option>
                    <option value="dominican">República Dominicana</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="capital">RANGO DE INVERSIÓN</label>
                  <select id="capital" value={form.capital} onChange={cambiar('capital')}>
                    <option value="under50">Menos de 50.000 €</option>
                    <option value="50-100">50.000 € – 100.000 €</option>
                    <option value="100-500">100.000 € – 500.000 €</option>
                    <option value="over500">Más de 500.000 €</option>
                    <option value="undecided">Aún no lo he definido</option>
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="horizon">HORIZONTE DE INVERSIÓN</label>
                  <select id="horizon" value={form.horizon} onChange={cambiar('horizon')}>
                    <option value="short">Corto plazo</option>
                    <option value="medium">Mediano plazo</option>
                    <option value="long">Largo plazo</option>
                    <option value="undecided">Aún no lo he definido</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label htmlFor="name">NOMBRE COMPLETO</label>
                <input id="name" type="text" placeholder="Tu nombre" autoComplete="name" value={form.name} onChange={cambiar('name')} />
              </div>
              <div className="field">
                <label htmlFor="email">CORREO ELECTRÓNICO</label>
                <input id="email" type="email" placeholder="tu@correo.com" autoComplete="email" value={form.email} onChange={cambiar('email')} />
              </div>
              <label className="consent">
                <input type="checkbox" id="consent" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>Autorizo a PRO CORP a tratar mis datos de contacto para responder a mi consulta de inversión. He leído el aviso de privacidad.</span>
              </label>
              <button className="btn" onClick={submitInvestment}>EXPLORAR OPORTUNIDADES →</button>
              <div id="investmentResult" className={`result${resultado ? '' : ' hidden'}`} aria-live="polite">
                {resultado &&
                  (resultado.matches.length ? (
                    <>
                      <strong>Coincidencias demostrativas</strong>
                      <p>Gracias, {resultado.nombre}. Estas categorías de proyectos de ejemplo coinciden con tus selecciones:</p>
                      {resultado.matches.map((m) => (
                        <p key={m}>• {m}</p>
                      ))}
                      <p>Estas entradas son ilustrativas y no constituyen ofertas vigentes. Antes del lanzamiento, conecta el catálogo real de proyectos de PRO CORP y el CRM.</p>
                    </>
                  ) : (
                    <>
                      <strong>Gracias, {resultado.nombre}.</strong>
                      <p>No hay proyectos demostrativos que coincidan con esta selección. El catálogo publicado deberá mostrar únicamente oportunidades realmente disponibles a través de PRO CORP.</p>
                    </>
                  ))}
              </div>
              <p className="data-note">
                Formulario demostrativo: esta versión no transmite ni almacena datos. Antes de recopilar información real,
                conectar un backend seguro e incorporar el aviso de privacidad completo.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="footer-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="brand-logo" src={LOGO} alt="PRO CORP — Business Engineering" />
          </div>
          <p>Business Engineering · Tecnología · Intelligence</p>
          <p>© 2026 PRO CORP. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

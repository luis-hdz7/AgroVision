import { useEffect, useRef, useState, type FormEvent } from 'react';
import logo from '../../assets/logos/imagotipo-V-oscura.svg';
import field from '../../assets/images/parcelasCampoConcept.png';
import map from '../../assets/images/monitoreoMapp.png';
import plant from '../../assets/images/maiz-image.jpg';
import { submitDemoRequest } from './services/demoRequestService';
import type { DemoRequestInput } from './types/demoRequest.types';
import './landing.css';

const features = [
  { number: '01', title: 'Tu campo, en contexto', text: 'Explora parcelas y capas de información en un mapa. Reúne la información de tus cultivos en un mismo lugar.', tag: 'Mapas y parcelas' },
  { number: '02', title: 'Atención donde hace falta', text: 'Consulta alertas, su nivel de riesgo y las evidencias disponibles para priorizar la revisión de tu campo.', tag: 'Alertas y monitoreo' },
  { number: '03', title: 'De los datos a la acción', text: 'Revisa reportes y recomendaciones de apoyo, y registra las actividades de manejo en tu cuaderno de campo.', tag: 'Reportes y seguimiento' },
];

export function LandingPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const requestInFlight = useRef(false);
  const activeRequest = useRef<AbortController | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      activeRequest.current?.abort();
      activeRequest.current = null;
      requestInFlight.current = false;
    };
  }, []);

  async function submitDemo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestInFlight.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get('consent') !== 'true') {
      setStatus('error');
      setMessage('Debes autorizar el contacto para enviar la solicitud.');
      return;
    }
    const input: DemoRequestInput = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      organization: String(data.get('organization') ?? ''),
      message: String(data.get('message') ?? ''),
      consent: 'true',
    };
    const controller = new AbortController();
    requestInFlight.current = true;
    activeRequest.current = controller;
    setStatus('sending');
    setMessage('');
    try {
      const confirmation = await submitDemoRequest(input, { signal: controller.signal });
      if (!mounted.current || activeRequest.current !== controller) return;
      setStatus('success');
      setMessage(`Recibimos tu solicitud #${confirmation.id}. El equipo podrá contactarte al correo indicado.`);
      form.reset();
    } catch {
      if (!mounted.current || activeRequest.current !== controller) return;
      setStatus('error');
      setMessage('No pudimos confirmar el envío. Inténtalo nuevamente.');
    } finally {
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        requestInFlight.current = false;
      }
    }
  }

  return (
    <div className="av-landing">
      <a className="landing-skip" href="#contenido">Saltar al contenido</a>
      <header className="landing-header landing-container">
        <a href="/" aria-label="AgroVision, inicio"><img className="landing-logo" src={logo} alt="AgroVision" /></a>
        <nav aria-label="Navegación principal">
          <a href="#solucion">La solución</a><a href="#plataforma">Plataforma</a><a href="#como-funciona">Cómo funciona</a>
        </nav>
        <a className="landing-access" href="/dashboard">Entrar a AgroVision <span aria-hidden="true">↗</span></a>
      </header>

      <main id="contenido">
        <section className="landing-hero landing-container">
          <div className="landing-hero-copy">
            <p className="landing-eyebrow"><span /> AGRICULTURA CON MÁS VISIÓN</p>
            <h1>Conoce tu campo.<br />Cultiva <em>mejores decisiones.</em></h1>
            <p className="landing-lead">Conecta mapas, monitoreo y alertas para entender lo que sucede en tus cultivos y decidir tu próximo paso con más información.</p>
            <div className="landing-actions"><a className="landing-button" href="#demo">Solicitar una demo <span aria-hidden="true">↗</span></a><a className="landing-text-link" href="#plataforma">Explorar la plataforma <span aria-hidden="true">→</span></a></div>
            <p className="landing-hero-note">Pensado para productores, técnicos y equipos agrícolas.</p>
          </div>
          <div className="landing-hero-visual">
            <img className="landing-field" src={field} alt="Vista ilustrativa de parcelas agrícolas" fetchPriority="high" />
            <div className="landing-visual-label"><span className="landing-live-dot" /> Una nueva perspectiva de tu campo</div>
            <div className="landing-field-card"><span className="landing-card-icon" aria-hidden="true">↗</span><div><strong>Del panorama al detalle</strong><p>Información para acompañar cada decisión.</p></div></div>
            <span className="landing-image-caption">Imagen conceptual · AgroVision</span>
          </div>
        </section>

        <div className="landing-ribbon"><div className="landing-container"><span>UNA VISIÓN MÁS COMPLETA</span><p>Tu parcela <b>＋</b> Tus datos <b>＋</b> Tu experiencia</p></div></div>

        <section id="solucion" className="landing-section landing-container">
          <div className="landing-section-heading"><div><p className="landing-eyebrow">DEL CAMPO A LA INFORMACIÓN</p><h2>Menos información dispersa.<br /><em>Más claridad para actuar.</em></h2></div><p>El trabajo agrícola reúne muchas señales. AgroVision te ayuda a consultarlas juntas y dar seguimiento a lo que merece atención.</p></div>
          <div className="landing-features">{features.map(feature => <article className="landing-feature" key={feature.number}><span className="landing-feature-number">{feature.number} /</span><h3>{feature.title}</h3><p>{feature.text}</p><span className="landing-tag">{feature.tag}</span></article>)}</div>
        </section>

        <section id="plataforma" className="landing-platform">
          <div className="landing-container landing-platform-grid">
            <div className="landing-preview"><div className="landing-preview-bar"><span /><span /><span /><p>AgroVision / Monitoreo</p></div><img src={map} alt="Vista de referencia del monitoreo de parcelas de AgroVision" loading="lazy" /><p className="landing-preview-caption">Vista de referencia. Explora el sistema para conocer su estado actual.</p></div>
            <div><p className="landing-eyebrow">UN SOLO ESPACIO DE TRABAJO</p><h2>Una plataforma.<br /><em>Muchas formas de ver tu cultivo.</em></h2><p>Del mapa de tu parcela al seguimiento de actividades: recorre las herramientas de AgroVision y descubre cómo pueden acompañar tu trabajo.</p><ul className="landing-checks"><li>Mapas y consulta de parcelas</li><li>Alertas y niveles de riesgo</li><li>Reportes y cuaderno de campo</li></ul><a className="landing-button landing-button-light" href="/dashboard">Conocer AgroVision <span aria-hidden="true">↗</span></a><p className="landing-platform-note">Proyecto en desarrollo. Algunas vistas incluyen datos de demostración.</p></div>
          </div>
        </section>

        <section id="como-funciona" className="landing-section landing-container">
          <p className="landing-eyebrow">ASÍ EMPIEZA UNA MEJOR VISIÓN</p><h2>De conocer tu campo<br />a <em>acompañar su evolución.</em></h2>
          <div className="landing-steps">{[{ title: 'Ubica tu parcela', text: 'Explora el mapa y consulta el contexto del área de trabajo.' }, { title: 'Revisa las señales', text: 'Consulta la información disponible, alertas y reportes de tus cultivos.' }, { title: 'Da seguimiento', text: 'Registra actividades y revisa recomendaciones junto con tu criterio técnico.' }].map((step, index) => <article key={step.title}><span>0{index + 1}</span><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
        </section>

        <section id="demo" className="landing-demo landing-container">
          <div className="landing-demo-copy"><img src={plant} alt="Detalle de un cultivo de maíz" loading="lazy" /><div><p className="landing-eyebrow">CONVERSEMOS SOBRE TU CAMPO</p><h2>La próxima decisión<br />empieza con <em>una mejor visión.</em></h2><p>Cuéntanos sobre tu equipo y solicita una demostración de AgroVision.</p></div></div>
          <form className="landing-form" onSubmit={submitDemo} aria-busy={status === 'sending'}>
            <h3>Solicita una demo</h3><p>Déjanos tus datos para coordinar una presentación.</p>
            <label htmlFor="demo-name">Nombre completo<input id="demo-name" name="name" autoComplete="name" placeholder="Tu nombre" required minLength={2} maxLength={100} disabled={status === 'sending'} /></label>
            <label htmlFor="demo-email">Correo electrónico<input id="demo-email" name="email" type="email" autoComplete="email" placeholder="nombre@organizacion.com" required maxLength={254} disabled={status === 'sending'} /></label>
            <label htmlFor="demo-organization">Organización o finca <span>(opcional)</span><input id="demo-organization" name="organization" autoComplete="organization" placeholder="Nombre de tu organización" maxLength={150} disabled={status === 'sending'} /></label>
            <label htmlFor="demo-message">¿Qué te gustaría conocer?<textarea id="demo-message" name="message" placeholder="Cuéntanos sobre tus cultivos o necesidades…" required minLength={10} maxLength={2000} rows={3} disabled={status === 'sending'} /></label>
            <label className="landing-consent"><input type="checkbox" name="consent" value="true" required disabled={status === 'sending'} /><span>Autorizo al equipo de AgroVision a usar estos datos para contactarme sobre esta solicitud.</span></label>
            <button className="landing-button" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Enviando…' : 'Solicitar demostración'}<span aria-hidden="true">↗</span></button>
            <p className={`landing-form-status ${status}`} role="status" aria-live="polite">{message}</p>
          </form>
        </section>
      </main>

      <footer className="landing-footer landing-container"><a href="/" aria-label="AgroVision, inicio"><img className="landing-logo" src={logo} alt="AgroVision" /></a><p>Más información. Mejor perspectiva. AgroVision.</p><a href="#demo">Contactar al equipo ↗</a><span>© {new Date().getFullYear()} AgroVision</span></footer>
    </div>
  );
}

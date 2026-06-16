'use client';

import { useEffect, useRef, useState } from 'react';
import Nav from '../components/Nav';

const s = {
  dark: '#030508',
  mid: '#0a0e14',
  blue: '#1A6DE5',
  grad: 'linear-gradient(135deg,#103FEA 0%,#1A6DE5 60%,#0a2fa8 100%)',
  serif: 'Fraunces, serif',
  sans: 'Inter, sans-serif',
};

const css = `
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(44px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes drawLine {
    from { stroke-dashoffset: 400; }
    to   { stroke-dashoffset: 0; }
  }
  @keyframes growBar {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
  .reveal {
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.72s cubic-bezier(0.22,1,0.36,1), transform 0.72s cubic-bezier(0.22,1,0.36,1);
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .reveal-delay-1 { transition-delay: 0.1s; }
  .reveal-delay-2 { transition-delay: 0.22s; }
  .reveal-delay-3 { transition-delay: 0.34s; }
  .acelera-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: rgba(255,255,255,0.07);
  }
  .acelera-cell {
    background: #030508;
    padding: 40px 24px 36px;
    transition: background 0.25s;
  }
  .acelera-cell:hover { background: #09101e; }
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: rgba(255,255,255,0.06);
  }
  .stats-cell { background: #030508; padding: 60px 52px; }
  .process-row {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 64px;
    align-items: start;
    padding: 44px 0;
    border-bottom: 1px solid rgba(255,255,255,0.07);
  }
  .process-row:last-child { border-bottom: none; }
  .hero-bottom {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 40px;
  }
  .service-entry {
    padding: 36px 0 36px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    border-left: 2px solid transparent;
    cursor: pointer;
    transition: border-color 0.25s, padding-left 0.25s, background 0.25s;
  }
  .service-entry:first-child { border-top: 1px solid rgba(255,255,255,0.08); }
  .service-entry:hover {
    border-left-color: #1A6DE5;
    padding-left: 28px;
    background: rgba(16,63,234,0.04);
  }
  .service-entry.open {
    border-left-color: #1A6DE5;
    padding-left: 28px;
    background: rgba(16,63,234,0.06);
  }
  .service-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.35s;
    opacity: 0;
  }
  .service-body.open {
    max-height: 300px;
    opacity: 1;
  }
  .manifesto-text {
    font-family: Fraunces, serif;
    font-style: italic;
    font-weight: 700;
    font-size: clamp(36px, 4.5vw, 62px);
    line-height: 1.1;
    color: #0a0c10;
    margin-bottom: 40px;
    max-width: 880px;
  }
  .chart-bar { transform-origin: bottom; animation: growBar 0.8s cubic-bezier(0.22,1,0.36,1) forwards; }
  .chart-line { stroke-dasharray: 400; animation: drawLine 1.2s cubic-bezier(0.22,1,0.36,1) forwards; }
  @media (max-width: 900px) {
    .acelera-grid  { grid-template-columns: repeat(3, 1fr) !important; }
    .process-row   { grid-template-columns: 1fr !important; gap: 12px !important; }
    .stats-cell    { padding: 48px 32px !important; }
  }
  @media (max-width: 640px) {
    .acelera-grid  { grid-template-columns: repeat(2, 1fr) !important; }
    .stats-grid    { grid-template-columns: 1fr !important; }
    .hero-bottom   { flex-direction: column; align-items: flex-start; gap: 24px; }
  }
`;

/* ─── REVEAL HOOK ──────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return ref;
}

/* ─── SVG CHARTS ────────────────────────────────────────────── */
function FunnelChart() {
  const stages = [
    { label: 'Visitantes', pct: 100, w: 100 },
    { label: 'Leads',      pct: 38,  w: 72 },
    { label: 'MQLs',       pct: 18,  w: 50 },
    { label: 'SQLs',       pct: 9,   w: 33 },
    { label: 'Clientes',   pct: 4,   w: 20 },
  ];
  return (
    <div style={{ marginTop: '28px' }}>
      {stages.map((st, i) => (
        <div key={i} style={{ marginBottom: '6px' }}>
          <div style={{
            height: '20px',
            width: `${st.w}%`,
            background: `rgba(26,109,229,${0.18 + i * 0.04})`,
            borderLeft: '2px solid rgba(16,63,234,0.6)',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '8px',
            transition: `width 0.8s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s`,
          }} />
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: s.sans,
            fontSize: '10px',
            color: 'rgba(255,255,255,0.28)',
            marginTop: '2px',
            paddingLeft: '2px',
          }}>
            <span>{st.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrendChart() {
  const pts = '20,72 60,60 100,50 140,34 180,24 220,14';
  return (
    <svg viewBox="0 0 240 80" style={{ width: '100%', marginTop: '28px', overflow: 'visible' }}>
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A6DE5" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#1A6DE5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points="20,72 60,60 100,50 140,34 180,24 220,14 220,80 20,80"
        fill="url(#trendFill)"
      />
      <polyline
        points={pts}
        fill="none"
        stroke="#1A6DE5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="chart-line"
      />
      {pts.split(' ').map((pt, i) => {
        const [cx, cy] = pt.split(',');
        return <circle key={i} cx={cx} cy={cy} r="3" fill="#1A6DE5" opacity="0.8" />;
      })}
      <text x="20" y="78" fontFamily="Inter,sans-serif" fontSize="9" fill="rgba(255,255,255,0.22)">Jan</text>
      <text x="208" y="78" fontFamily="Inter,sans-serif" fontSize="9" fill="rgba(255,255,255,0.22)">Jun</text>
    </svg>
  );
}

function CACChart() {
  const bars = [
    { label: 'Sem RevOps', h: 70, shade: 'rgba(255,255,255,0.1)' },
    { label: 'Com RevOps', h: 42, shade: '#1A6DE5' },
  ];
  return (
    <svg viewBox="0 0 120 80" style={{ width: '60%', marginTop: '28px' }}>
      {bars.map((b, i) => (
        <g key={i}>
          <rect
            x={i === 0 ? 16 : 70}
            y={80 - b.h}
            width="34"
            height={b.h}
            fill={b.shade}
            rx="2"
            className="chart-bar"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
          <text
            x={i === 0 ? 33 : 87}
            y="78"
            fontFamily="Inter,sans-serif"
            fontSize="7"
            fill="rgba(255,255,255,0.28)"
            textAnchor="middle"
          >
            {b.label}
          </text>
        </g>
      ))}
      <text x="96" y={80 - 42 + 4} fontFamily="Inter,sans-serif" fontSize="8" fill="#1A6DE5">-40%</text>
    </svg>
  );
}

/* ─── DOT GRID GRAFISMO ─────────────────────────────────────── */
function DotGrid({ cols = 12, rows = 8, opacity = 0.08 }) {
  const dots = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      dots.push(<circle key={`${r}-${c}`} cx={c * 20 + 10} cy={r * 20 + 10} r="1.2" fill="white" />);
  return (
    <svg
      viewBox={`0 0 ${cols * 20} ${rows * 20}`}
      style={{ position: 'absolute', right: '5%', top: '18%', width: '220px', opacity, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {dots}
    </svg>
  );
}

/* ─── CONCENTRIC RINGS GRAFISMO ─────────────────────────────── */
function ConcentricRings({ opacity = 0.07 }) {
  return (
    <svg
      viewBox="0 0 300 300"
      style={{ position: 'absolute', right: '-60px', top: '-60px', width: '340px', opacity, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {[20, 50, 85, 125, 170, 220].map((r, i) => (
        <circle key={i} cx="150" cy="150" r={r} fill="none" stroke="#0a0c10" strokeWidth="1" />
      ))}
    </svg>
  );
}

/* ─── GRID LINES GRAFISMO (CTA bg) ──────────────────────────── */
function GridLines() {
  const lines = [];
  for (let i = 0; i <= 8; i++) {
    lines.push(<line key={`h${i}`} x1="0" y1={i * 40} x2="320" y2={i * 40} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />);
    lines.push(<line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="320" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />);
  }
  return (
    <svg
      viewBox="0 0 320 320"
      style={{ position: 'absolute', left: 0, bottom: 0, width: '380px', opacity: 1, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {lines}
    </svg>
  );
}

/* ─── HERO ──────────────────────────────────────────────────── */
function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };
    el.addEventListener('mousemove', onMove);
    return () => el.removeEventListener('mousemove', onMove);
  }, []);

  const r1 = useReveal(0.1);
  const r2 = useReveal(0.1);

  return (
    <section
      ref={heroRef}
      style={{
        minHeight: '100dvh',
        background: s.dark,
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        padding: '0 60px 56px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* mouse-tracking glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle 600px at var(--mx, 80%) var(--my, 70%), rgba(16,63,234,0.10) 0%, transparent 70%)',
        pointerEvents: 'none',
        transition: 'background 0.1s',
      }} />

      {/* static ambient glow */}
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-8%',
        width: '52vw',
        height: '52vw',
        background: 'radial-gradient(circle, rgba(16,63,234,0.07) 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      <DotGrid />

      {/* top label */}
      <div style={{
        paddingTop: '100px',
        fontFamily: s.sans,
        fontSize: '11px',
        fontWeight: 400,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.25)',
        position: 'relative',
        animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both',
      }}>
        Mutua / Revenue Operations &amp; Growth Intelligence
      </div>

      {/* headline */}
      <div
        ref={r1}
        className="reveal visible"
        style={{ display: 'flex', alignItems: 'center', position: 'relative', animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.25s both' }}
      >
        <h1 style={{
          fontFamily: s.serif,
          fontSize: 'clamp(64px, 9vw, 130px)',
          fontWeight: 700,
          lineHeight: 0.93,
          letterSpacing: '-3px',
          color: '#fff',
          margin: 0,
        }}>
          Crescimento<br />
          <span style={{
            background: s.grad,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            previsível.
          </span>
        </h1>
      </div>

      {/* bottom bar */}
      <div
        className="hero-bottom"
        style={{
          paddingTop: '40px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
          animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.42s both',
        }}
      >
        <p style={{
          fontFamily: s.sans,
          fontSize: '15px',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.42)',
          maxWidth: '340px',
          lineHeight: 1.65,
          margin: 0,
        }}>
          Revenue Ops que transforma funis e métricas em crescimento real e escalável.
        </p>
        <a
          href="#contato"
          style={{
            fontFamily: s.sans,
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            background: s.grad,
            padding: '14px 32px',
            display: 'inline-block',
            transition: 'opacity 0.2s, transform 0.2s',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
          onMouseEnter={e => { e.currentTarget.style.opacity = '0.82'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Diagnóstico gratuito
        </a>
      </div>
    </section>
  );
}

/* ─── MANIFESTO ─────────────────────────────────────────────── */
function Manifesto() {
  const ref = useReveal();
  return (
    <section style={{ background: '#F2F2F0', padding: '100px 60px', position: 'relative', overflow: 'hidden' }}>
      <ConcentricRings />
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        <div ref={ref} className="reveal">
          <p className="manifesto-text">
            Não somos uma agência de marketing.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', maxWidth: '900px' }}>
          <p style={{ fontFamily: s.sans, fontSize: '17px', color: 'rgba(10,12,16,0.6)', lineHeight: 1.75, margin: 0 }}>
            Somos uma operação de Revenue Ops. Tratamos crescimento como engenharia: dados rastreados, funis mapeados, experimentos medidos.
          </p>
          <p style={{ fontFamily: s.sans, fontSize: '17px', color: 'rgba(10,12,16,0.6)', lineHeight: 1.75, margin: 0 }}>
            Resultado previsível, não obra do acaso. Cada real investido em marketing passa a ter uma resposta mensurável.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS ──────────────────────────────────────────────────── */
function Stats() {
  const items = [
    {
      n: '67%',
      label: 'das empresas perdem receita por gaps no funil que nunca foram mapeados',
      chart: <FunnelChart />,
    },
    {
      n: '3x',
      label: 'mais previsibilidade com Revenue Ops estruturado vs. marketing tradicional',
      chart: <TrendChart />,
    },
    {
      n: '40%',
      label: 'do CAC desperdiçado por falta de rastreamento adequado',
      chart: <CACChart />,
    },
  ];

  const refs = [useReveal(), useReveal(), useReveal()];

  return (
    <section style={{ background: s.dark, padding: '0 60px' }}>
      <div className="stats-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {items.map((it, i) => (
          <div key={i} ref={refs[i]} className={`stats-cell reveal reveal-delay-${i + 1}`}>
            <div style={{
              fontFamily: s.serif,
              fontSize: 'clamp(52px, 6vw, 88px)',
              fontWeight: 700,
              background: s.grad,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              marginBottom: '12px',
            }}>
              {it.n}
            </div>
            <p style={{
              fontFamily: s.sans,
              fontSize: '14px',
              fontWeight: 300,
              color: 'rgba(255,255,255,0.42)',
              lineHeight: 1.65,
              maxWidth: '220px',
              margin: 0,
            }}>
              {it.label}
            </p>
            {it.chart}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── FRAMEWORK A.C.E.L.E.R.A ────────────────────────────────── */
function Framework() {
  const steps = [
    { letter: 'A', word: 'Aquisição',    desc: 'Canais, tráfego pago e orgânico com rastreamento de origem.' },
    { letter: 'C', word: 'Conversão',    desc: 'Funil, testes A/B, landing pages e CRO sistemático.' },
    { letter: 'E', word: 'Engajamento',  desc: 'Automações e sequências para avançar oportunidades.' },
    { letter: 'L', word: 'Lead Scoring', desc: 'Qualificação com scoring comportamental e firmográfico.' },
    { letter: 'E', word: 'Eficiência',   desc: 'Redução de CAC e eliminação de gargalos operacionais.' },
    { letter: 'R', word: 'Retenção',     desc: 'Churn prevention, expansão de receita e upsell.' },
    { letter: 'A', word: 'Análise',      desc: 'Dashboards, atribuição e reporting executivo contínuo.' },
  ];
  const ref = useReveal(0.1);

  return (
    <section id="metodologia" style={{ background: s.dark, padding: '100px 60px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
          <h2 className="reveal" ref={ref} style={{
            fontFamily: s.serif,
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.05,
            margin: 0,
            letterSpacing: '-1px',
          }}>
            Framework<br />A.C.E.L.E.R.A
          </h2>
          <p style={{
            fontFamily: s.sans,
            fontSize: '14px',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.38)',
            maxWidth: '280px',
            lineHeight: 1.6,
            margin: 0,
            textAlign: 'right',
          }}>
            Sete camadas integradas cobrindo todo o ciclo de receita, da atração à retenção.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="acelera-grid">
          {steps.map((st, i) => (
            <div key={i} className="acelera-cell">
              <div style={{
                fontFamily: s.serif,
                fontSize: 'clamp(52px, 5.5vw, 80px)',
                fontWeight: 700,
                lineHeight: 0.9,
                background: s.grad,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '20px',
              }}>
                {st.letter}
              </div>
              <div style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '10px', letterSpacing: '0.02em' }}>
                {st.word}
              </div>
              <p style={{ fontFamily: s.sans, fontSize: '12px', fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SERVIÇOS ────────────────────────────────────────────────── */
function Servicos() {
  const [open, setOpen] = useState(null);
  const ref = useReveal();

  const planos = [
    {
      name: 'Funnel Audit',
      tipo: 'Projeto único',
      desc: 'Diagnóstico completo do seu funil de vendas. Identificamos gargalos, perdas e oportunidades com um plano de ação de 90 dias.',
      entregaveis: ['Mapeamento completo do funil', 'Análise de dados e tracking', 'Relatório de prioridades', 'Plano de ação 90 dias'],
    },
    {
      name: 'Growth Operations',
      tipo: 'Mensalidade',
      badge: 'Recomendado',
      desc: 'Somos o time de Revenue Ops dedicado à sua empresa. Execução contínua, tracking em tempo real e relatórios executivos mensais.',
      entregaveis: ['Tudo do Funnel Audit', 'Execução mensal de melhorias', 'Growth experiments mensais', 'Reuniões semanais de performance'],
    },
    {
      name: 'AI Systems',
      tipo: 'Projeto',
      desc: 'Automações e sistemas de IA para escalar marketing e vendas sem aumentar o time. Integrações entre ferramentas e redução de trabalho manual.',
      entregaveis: ['Automação de qualificação de leads', 'Nurturing com IA', 'Integrações entre ferramentas'],
    },
  ];

  return (
    <section id="servicos" style={{ background: s.dark, padding: '100px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px' }}>
          <h2 ref={ref} className="reveal" style={{
            fontFamily: s.serif,
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.05,
            margin: 0,
            letterSpacing: '-1px',
          }}>
            Como podemos<br />trabalhar juntos
          </h2>
          <a
            href="#contato"
            style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '2px', transition: 'color 0.2s, border-color 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
          >
            Falar com especialista
          </a>
        </div>

        <div>
          {planos.map((p, i) => (
            <div
              key={i}
              className={`service-entry${open === i ? ' open' : ''}`}
              onClick={() => setOpen(open === i ? null : i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && setOpen(open === i ? null : i)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                  <h3 style={{
                    fontFamily: s.serif,
                    fontSize: 'clamp(24px, 2.5vw, 36px)',
                    fontWeight: 700,
                    color: '#fff',
                    margin: 0,
                    letterSpacing: '-0.5px',
                  }}>
                    {p.name}
                  </h3>
                  {p.badge && (
                    <span style={{ fontFamily: s.sans, fontSize: '10px', fontWeight: 700, color: '#fff', background: s.grad, padding: '3px 10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                      {p.badge}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontFamily: s.sans, fontSize: '12px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{p.tipo}</span>
                  <span style={{ fontFamily: s.sans, fontSize: '18px', color: open === i ? '#1A6DE5' : 'rgba(255,255,255,0.3)', transition: 'color 0.25s, transform 0.25s', display: 'inline-block', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
                </div>
              </div>

              <div className={`service-body${open === i ? ' open' : ''}`}>
                <div style={{ paddingTop: '16px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px', alignItems: 'start' }}>
                  <p style={{ fontFamily: s.sans, fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, margin: 0 }}>
                    {p.desc}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {p.entregaveis.map(e => (
                      <span key={e} style={{ fontFamily: s.sans, fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 10px' }}>
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── COMO FUNCIONA ───────────────────────────────────────────── */
function Parceria() {
  const steps = [
    { title: 'Diagnóstico',     desc: 'Mapeamos seu funil atual, dados disponíveis e principais oportunidades em uma reunião de 60 minutos.' },
    { title: 'Estratégia',      desc: 'Montamos o plano de Revenue Ops adaptado ao seu momento, recursos e metas de crescimento.' },
    { title: 'Implementação',   desc: 'Executamos as mudanças, configuramos o tracking e lançamos os primeiros experimentos de crescimento.' },
    { title: 'Resultados',      desc: 'Revisões semanais com métricas reais, ajustes rápidos e relatórios executivos mensais.' },
  ];
  const ref = useReveal();

  return (
    <section id="parceria" style={{ background: s.mid, padding: '100px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 ref={ref} className="reveal" style={{
          fontFamily: s.serif,
          fontSize: 'clamp(32px, 4vw, 52px)',
          fontWeight: 700,
          color: '#fff',
          lineHeight: 1.05,
          letterSpacing: '-1px',
          marginBottom: '72px',
        }}>
          Do diagnóstico ao<br />crescimento contínuo
        </h2>

        <div>
          {steps.map((st, i) => (
            <div key={i} className="process-row reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <h3 style={{ fontFamily: s.serif, fontSize: 'clamp(22px, 2vw, 30px)', fontWeight: 700, color: '#fff', lineHeight: 1.1, margin: 0, letterSpacing: '-0.3px' }}>
                {st.title}
              </h3>
              <p style={{ fontFamily: s.sans, fontSize: '15px', fontWeight: 300, color: 'rgba(255,255,255,0.48)', lineHeight: 1.7, margin: 0, maxWidth: '480px' }}>
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FERRAMENTAS (marquee) ───────────────────────────────────── */
function Ferramentas() {
  const tools = ['HubSpot', 'RD Station', 'Salesforce', 'Google Analytics 4', 'Meta Ads', 'Google Ads', 'ActiveCampaign', 'Hotjar', 'Semrush', 'Looker Studio', 'Zapier', 'Make'];
  return (
    <section style={{ background: s.dark, padding: '64px 0', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <p style={{ fontFamily: s.sans, fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', textAlign: 'center', marginBottom: '32px' }}>
        Operamos com as ferramentas do seu stack
      </p>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '0', animation: 'marquee 28s linear infinite', width: 'fit-content' }}>
          {[...tools, ...tools].map((t, i) => (
            <span key={i} style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.25)', padding: '0 40px', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTA() {
  const ref = useReveal(0.2);
  return (
    <section id="contato" style={{ background: s.dark, padding: '140px 60px', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <GridLines />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '60vw', height: '40vw', background: 'radial-gradient(ellipse, rgba(16,63,234,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
        <h2 ref={ref} className="reveal" style={{
          fontFamily: s.serif,
          fontSize: 'clamp(40px, 6vw, 88px)',
          fontWeight: 700,
          color: '#fff',
          lineHeight: 0.95,
          letterSpacing: '-2px',
          marginBottom: '48px',
        }}>
          Pronto para<br />
          <span style={{ background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            crescimento real?
          </span>
        </h2>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href="mailto:contato@mutua.com.br"
            style={{ fontFamily: s.sans, fontSize: '15px', fontWeight: 600, color: '#fff', background: s.grad, padding: '16px 40px', display: 'inline-block', transition: 'opacity 0.2s, transform 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.82'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Diagnóstico gratuito
          </a>
          <span style={{ fontFamily: s.sans, fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.35)' }}>
            60 minutos, sem compromisso
          </span>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────── */
function Footer() {
  const links = [
    { label: 'Metodologia', href: '#metodologia' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Parceria', href: '#parceria' },
    { label: 'Contato', href: '#contato' },
  ];
  return (
    <footer style={{ background: '#010305', padding: '40px 60px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <span style={{ fontFamily: s.serif, fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.35)' }}>Mutua</span>
        <div style={{ display: 'flex', gap: '32px' }}>
          {links.map(({ label, href }) => (
            <a key={label} href={href} style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.22)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.22)'}
            >
              {label}
            </a>
          ))}
        </div>
        <span style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.18)' }}>
          © {new Date().getFullYear()} Mutua
        </span>
      </div>
    </footer>
  );
}

/* ─── PAGE ────────────────────────────────────────────────────── */
export default function Home() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{css}</style>
      <Nav />
      <Hero />
      <Manifesto />
      <Stats />
      <Framework />
      <Servicos />
      <Parceria />
      <Ferramentas />
      <CTA />
      <Footer />
    </>
  );
}

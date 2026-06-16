'use client';

import { useEffect, useRef } from 'react';
import Nav from '../components/Nav';

const CALENDAR = 'https://calendar.app.google/MfDV2fPTurR6msid6';

const s = {
  dark: '#030508',
  mid: '#080c12',
  blue: '#1A6DE5',
  grad: 'linear-gradient(135deg,#103FEA 0%,#1A6DE5 60%,#0a2fa8 100%)',
  serif: 'Fraunces, serif',
  sans: 'Inter, sans-serif',
};

const css = `
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dashFloat {
    0%,100% { transform:perspective(1100px) rotateY(-7deg) rotateX(2deg) translateY(0); }
    50%      { transform:perspective(1100px) rotateY(-7deg) rotateX(2deg) translateY(-12px); }
  }

  .reveal { opacity:0; transform:translateY(36px); transition:opacity 0.72s cubic-bezier(0.22,1,0.36,1), transform 0.72s cubic-bezier(0.22,1,0.36,1); }
  .reveal.in { opacity:1; transform:translateY(0); }
  .d1{transition-delay:0.1s} .d2{transition-delay:0.22s} .d3{transition-delay:0.34s}

  .hero-inner { display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:center; }

  .svc-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(255,255,255,0.07); }
  .svc-card { background:#030508; padding:52px 36px 44px; transition:background 0.3s; }
  .svc-card:hover { background:#060a12; }

  .stats-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(255,255,255,0.06); }
  .stats-cell { background:#030508; padding:56px 48px; }

  .acelera-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:1px; background:rgba(255,255,255,0.07); }
  .acelera-cell { background:#030508; padding:40px 20px 36px; transition:background 0.25s; }
  .acelera-cell:hover { background:#060910; }

  .proc-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:rgba(255,255,255,0.07); }
  .proc-cell { background:#080c12; padding:48px 40px; }

  .pill { display:inline-block; font-family:Inter,sans-serif; font-size:11px; font-weight:500;
    color:rgba(255,255,255,0.32); border:1px solid rgba(255,255,255,0.1); padding:3px 10px; margin:3px 3px 3px 0; }

  .btn-primary { display:inline-block; font-family:Inter,sans-serif; font-size:14px; font-weight:600;
    color:#fff; background:linear-gradient(135deg,#103FEA 0%,#1A6DE5 60%,#0a2fa8 100%);
    padding:14px 32px; text-decoration:none; transition:opacity 0.2s, transform 0.2s; }
  .btn-primary:hover { opacity:0.82; transform:translateY(-2px); }

  .btn-ghost { display:inline-block; font-family:Inter,sans-serif; font-size:13px; font-weight:500;
    color:rgba(255,255,255,0.45); border-bottom:1px solid rgba(255,255,255,0.18); padding-bottom:2px;
    text-decoration:none; transition:color 0.2s, border-color 0.2s; }
  .btn-ghost:hover { color:#fff; border-color:rgba(255,255,255,0.55); }

  @media(max-width:960px) {
    .hero-inner  { grid-template-columns:1fr !important; gap:48px !important; }
    .svc-grid    { grid-template-columns:1fr !important; }
    .stats-grid  { grid-template-columns:1fr 1fr !important; }
    .acelera-grid{ grid-template-columns:repeat(3,1fr) !important; }
    .proc-grid   { grid-template-columns:1fr !important; }
  }
  @media(max-width:640px) {
    .stats-grid  { grid-template-columns:1fr !important; }
    .stats-cell  { padding:40px 28px !important; }
    .svc-card    { padding:40px 24px !important; }
    .acelera-grid{ grid-template-columns:repeat(2,1fr) !important; }
  }
`;

/* ─── INLINE CHARTS ──────────────────────────────────────────── */
function FunnelBars() {
  const rows = [
    { l: 'Visitantes', w: 100 },
    { l: 'Leads',      w: 68  },
    { l: 'MQLs',       w: 30  },
    { l: 'Clientes',   w: 11  },
  ];
  return (
    <div style={{ marginTop: '24px' }}>
      {rows.map((r, i) => (
        <div key={i} style={{ marginBottom: '7px' }}>
          <div style={{ width: `${r.w}%`, height: '18px', background: `rgba(26,109,229,${0.14 + i * 0.06})`, borderLeft: '2px solid rgba(26,109,229,0.5)' }} />
          <div style={{ fontFamily: s.sans, fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: '2px' }}>{r.l}</div>
        </div>
      ))}
    </div>
  );
}

function TrendLine() {
  return (
    <svg viewBox="0 0 240 72" style={{ width: '100%', marginTop: '24px' }}>
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A6DE5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1A6DE5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points="0,68 40,56 80,46 120,32 160,20 200,10 240,4 240,72 0,72" fill="url(#tg)" />
      <polyline points="0,68 40,56 80,46 120,32 160,20 200,10 240,4" fill="none" stroke="#1A6DE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {[[0,68],[40,56],[80,46],[120,32],[160,20],[200,10],[240,4]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill="#1A6DE5" opacity="0.85" />
      ))}
    </svg>
  );
}

function CACBars() {
  return (
    <svg viewBox="0 0 110 80" style={{ width: '55%', marginTop: '24px' }}>
      <rect x="8"  y={76-66} width="34" height="66" fill="rgba(255,255,255,0.1)" rx="2" />
      <rect x="60" y={76-40} width="34" height="40" fill="#1A6DE5" rx="2" />
      <text x="25"  y="79" fontFamily="Inter,sans-serif" fontSize="7" fill="rgba(255,255,255,0.22)" textAnchor="middle">Antes</text>
      <text x="77"  y="79" fontFamily="Inter,sans-serif" fontSize="7" fill="rgba(255,255,255,0.22)" textAnchor="middle">Depois</text>
      <text x="96"  y={76-40} fontFamily="Inter,sans-serif" fontSize="8" fill="#1A6DE5">-40%</text>
    </svg>
  );
}

/* ─── DASHBOARD MOCKUP ───────────────────────────────────────── */
function DashboardMockup() {
  const kpis = [
    { l: 'MRR',   v: 'R$ 84k', d: '+31%' },
    { l: 'Leads', v: '312',    d: '+47%' },
    { l: 'Conv.', v: '4.1%',   d: '+0.8pp' },
  ];
  const funnel = [
    { l: 'Visitantes', p: 100 },
    { l: 'Leads',      p: 58  },
    { l: 'Oport.',     p: 24  },
    { l: 'Clientes',   p: 9   },
  ];

  return (
    <div style={{
      animation: 'dashFloat 7s ease-in-out infinite',
      boxShadow: '28px 40px 72px rgba(0,0,0,0.55), 0 0 64px rgba(16,63,234,0.12)',
    }}>
      <div style={{
        background: '#0d1117',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '22px',
      }}>
        {/* titlebar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
            <span style={{ fontFamily: s.sans, fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Painel de Receita</span>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
              <div key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c, opacity: 0.65 }} />
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '18px' }}>
          {kpis.map((k, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '11px 10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontFamily: s.sans, fontSize: '9px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.07em', marginBottom: '4px' }}>{k.l}</div>
              <div style={{ fontFamily: s.serif, fontSize: '15px', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '3px' }}>{k.v}</div>
              <div style={{ fontFamily: s.sans, fontSize: '10px', color: '#22c55e' }}>{k.d}</div>
            </div>
          ))}
        </div>

        {/* trend */}
        <div style={{ background: 'rgba(255,255,255,0.025)', borderRadius: '8px', padding: '12px', marginBottom: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontFamily: s.sans, fontSize: '9px', color: 'rgba(255,255,255,0.28)', marginBottom: '8px', letterSpacing: '0.06em' }}>Crescimento MRR</div>
          <svg viewBox="0 0 240 52" style={{ width: '100%' }}>
            <defs>
              <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A6DE5" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#1A6DE5" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[13,26,39].map(y => <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}
            <polygon points="0,48 40,40 80,33 120,24 160,15 200,8 240,3 240,52 0,52" fill="url(#mg)" />
            <polyline points="0,48 40,40 80,33 120,24 160,15 200,8 240,3" fill="none" stroke="#1A6DE5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {['Jan','Fev','Mar','Abr','Mai','Jun'].map((m, i) => (
              <text key={i} x={i*48+24} y="52" fontFamily="Inter,sans-serif" fontSize="7" fill="rgba(255,255,255,0.18)" textAnchor="middle">{m}</text>
            ))}
          </svg>
        </div>

        {/* funnel */}
        <div style={{ background: 'rgba(255,255,255,0.025)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontFamily: s.sans, fontSize: '9px', color: 'rgba(255,255,255,0.28)', marginBottom: '10px', letterSpacing: '0.06em' }}>Funil de Conversão</div>
          {funnel.map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < funnel.length - 1 ? '5px' : 0 }}>
              <div style={{ fontFamily: s.sans, fontSize: '8px', color: 'rgba(255,255,255,0.22)', width: '44px', flexShrink: 0 }}>{row.l}</div>
              <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                <div style={{ width: `${row.p}%`, height: '100%', background: `rgba(26,109,229,${0.5 + i * 0.08})`, borderRadius: '2px' }} />
              </div>
              <div style={{ fontFamily: s.sans, fontSize: '8px', color: 'rgba(255,255,255,0.22)', width: '22px', textAlign: 'right' }}>{row.p}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── GRAFISMOS ──────────────────────────────────────────────── */
function DotGrid() {
  const dots = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 12; c++)
      dots.push(<circle key={`${r}-${c}`} cx={c * 20 + 10} cy={r * 20 + 10} r="1.2" fill="white" />);
  return (
    <svg viewBox="0 0 240 160" style={{ position: 'absolute', right: '3%', top: '16%', width: '190px', opacity: 0.07, pointerEvents: 'none' }} aria-hidden>
      {dots}
    </svg>
  );
}

function ConcentricRings() {
  return (
    <svg viewBox="0 0 320 320" style={{ position: 'absolute', right: '-80px', top: '-80px', width: '380px', opacity: 0.07, pointerEvents: 'none' }} aria-hidden>
      {[22, 58, 98, 144, 196, 252].map((r, i) => (
        <circle key={i} cx="160" cy="160" r={r} fill="none" stroke="#0a0c10" strokeWidth="1" />
      ))}
    </svg>
  );
}

function GridLines() {
  const lines = [];
  for (let i = 0; i <= 9; i++) {
    lines.push(<line key={`h${i}`} x1="0" y1={i * 40} x2="360" y2={i * 40} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />);
    lines.push(<line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="360" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />);
  }
  return (
    <svg viewBox="0 0 360 360" style={{ position: 'absolute', left: 0, bottom: 0, width: '420px', pointerEvents: 'none' }} aria-hidden>
      {lines}
    </svg>
  );
}

/* ─── HERO ───────────────────────────────────────────────────── */
function Hero() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = (e) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - left) / width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - top) / height) * 100}%`);
    };
    el.addEventListener('mousemove', fn);
    return () => el.removeEventListener('mousemove', fn);
  }, []);

  return (
    <section ref={ref} style={{
      minHeight: '100dvh',
      background: s.dark,
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      padding: '0 60px 56px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle 700px at var(--mx,78%) var(--my,62%), rgba(16,63,234,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-15%', right: '-5%', width: '55vw', height: '55vw', background: 'radial-gradient(circle, rgba(16,63,234,0.06) 0%, transparent 66%)', pointerEvents: 'none' }} />
      <DotGrid />

      {/* label */}
      <div style={{ paddingTop: '104px', fontFamily: s.sans, fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', position: 'relative', animation: 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}>
        Revenue Operations &amp; Growth Intelligence
      </div>

      {/* split content */}
      <div className="hero-inner" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <div style={{ animation: 'fadeUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.25s both' }}>
          <h1 style={{ fontFamily: s.serif, fontSize: 'clamp(56px,7.5vw,116px)', fontWeight: 700, lineHeight: 0.93, letterSpacing: '-2.5px', color: '#fff', margin: '0 0 28px' }}>
            Crescimento<br />
            <span style={{ background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>previsível.</span>
          </h1>
          <p style={{ fontFamily: s.sans, fontSize: '16px', fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, margin: '0 0 40px', maxWidth: '380px' }}>
            Revenue Ops que transforma funis e métricas em crescimento real e escalável para o seu negócio.
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href={CALENDAR} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Agendar diagnóstico gratuito
            </a>
            <a href="#servicos" className="btn-ghost">Ver serviços</a>
          </div>
        </div>
        <div style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.42s both' }}>
          <DashboardMockup />
        </div>
      </div>

      {/* bottom strip */}
      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', paddingTop: '36px', borderTop: '1px solid rgba(255,255,255,0.07)', position: 'relative', animation: 'fadeUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.56s both' }}>
        {['Dados rastreados', 'Funil mapeado', 'Crescimento mensurável'].map((t, i) => (
          <span key={i} style={{ fontFamily: s.sans, fontSize: '12px', color: 'rgba(255,255,255,0.24)', letterSpacing: '0.06em' }}>{t}</span>
        ))}
      </div>
    </section>
  );
}

/* ─── MANIFESTO ──────────────────────────────────────────────── */
function Manifesto() {
  return (
    <section style={{ background: '#F2F2F0', padding: '100px 60px', position: 'relative', overflow: 'hidden' }}>
      <ConcentricRings />
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        <p className="reveal" style={{ fontFamily: s.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(36px,4.5vw,62px)', lineHeight: 1.1, color: '#0a0c10', marginBottom: '40px', maxWidth: '880px' }}>
          Não somos uma agência de marketing.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', maxWidth: '860px' }}>
          <p className="reveal d1" style={{ fontFamily: s.sans, fontSize: '17px', color: 'rgba(10,12,16,0.58)', lineHeight: 1.75, margin: 0 }}>
            Somos uma operação de Revenue Ops. Tratamos crescimento como engenharia: dados rastreados, funis mapeados, experimentos medidos.
          </p>
          <p className="reveal d2" style={{ fontFamily: s.sans, fontSize: '17px', color: 'rgba(10,12,16,0.58)', lineHeight: 1.75, margin: 0 }}>
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
    { n: '67%', label: 'das empresas perdem receita por gaps no funil nunca mapeados',   chart: <FunnelBars /> },
    { n: '3x',  label: 'mais previsibilidade com Revenue Ops vs. marketing tradicional', chart: <TrendLine /> },
    { n: '40%', label: 'do CAC desperdiçado por falta de rastreamento adequado',          chart: <CACBars /> },
  ];
  return (
    <section style={{ background: s.dark, padding: '0 60px' }}>
      <div className="stats-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {items.map((it, i) => (
          <div key={i} className={`stats-cell reveal d${i + 1}`}>
            <div style={{ fontFamily: s.serif, fontSize: 'clamp(52px,6vw,88px)', fontWeight: 700, background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '12px' }}>{it.n}</div>
            <p style={{ fontFamily: s.sans, fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, maxWidth: '220px', margin: 0 }}>{it.label}</p>
            {it.chart}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── SERVIÇOS ───────────────────────────────────────────────── */
function Servicos() {
  const planos = [
    {
      num: '01', name: 'Funnel Audit', tipo: 'Projeto único',
      headline: 'Descubra onde você está perdendo receita',
      desc: 'Mapeamos cada etapa do seu funil, identificamos os pontos de vazamento e entregamos um plano de ação para os próximos 90 dias.',
      pills: ['Mapeamento de funil', 'Análise de tracking', 'Relatório de gaps', 'Plano 90 dias'],
    },
    {
      num: '02', name: 'Growth Operations', tipo: 'Mensalidade', badge: 'Mais escolhido',
      headline: 'Um time de Revenue Ops dedicado à sua empresa',
      desc: 'A Mutua age como seu time interno de Revenue Ops — executando experimentos, otimizando funil e entregando relatórios executivos todo mês.',
      pills: ['Execução contínua', 'Experiments mensais', 'Dashboard em tempo real', 'Revisões semanais'],
    },
    {
      num: '03', name: 'AI Systems', tipo: 'Projeto',
      headline: 'Automatize e escale sem aumentar o time',
      desc: 'Implementamos sistemas de automação e IA que qualificam leads, nutrem prospects e integram seu stack — sem precisar contratar mais ninguém.',
      pills: ['Qualificação com IA', 'Nurturing automático', 'Integrações de stack'],
    },
  ];

  return (
    <section id="servicos" style={{ background: s.dark, padding: '100px 60px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto 52px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <h2 className="reveal" style={{ fontFamily: s.serif, fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: '#fff', lineHeight: 1.05, margin: 0, letterSpacing: '-1px' }}>
            O que oferecemos
          </h2>
          <a href={CALENDAR} target="_blank" rel="noopener noreferrer" className="btn-ghost reveal d1">
            Falar com especialista
          </a>
        </div>
      </div>

      <div className="svc-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {planos.map((p, i) => (
          <div key={i} className={`svc-card reveal d${i + 1}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <span style={{ fontFamily: s.serif, fontSize: 'clamp(44px,5vw,68px)', fontWeight: 700, lineHeight: 1, background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{p.num}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: s.sans, fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.tipo}</div>
                {p.badge && <div style={{ fontFamily: s.sans, fontSize: '9px', fontWeight: 700, color: '#fff', background: s.grad, padding: '2px 8px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '5px', display: 'inline-block' }}>{p.badge}</div>}
              </div>
            </div>
            <div style={{ fontFamily: s.sans, fontSize: '11px', fontWeight: 500, color: s.blue, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>{p.name}</div>
            <h3 style={{ fontFamily: s.serif, fontSize: 'clamp(21px,2vw,28px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.3px', margin: '0 0 14px' }}>{p.headline}</h3>
            <p style={{ fontFamily: s.sans, fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.44)', lineHeight: 1.72, margin: '0 0 22px' }}>{p.desc}</p>
            <div style={{ marginBottom: '28px' }}>{p.pills.map(pill => <span key={pill} className="pill">{pill}</span>)}</div>
            <a href={CALENDAR} target="_blank" rel="noopener noreferrer" className="btn-ghost">Agendar conversa →</a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── FRAMEWORK ──────────────────────────────────────────────── */
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
  return (
    <section id="metodologia" style={{ background: s.dark, padding: '100px 60px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto 52px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 className="reveal" style={{ fontFamily: s.serif, fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: '#fff', lineHeight: 1.05, margin: 0, letterSpacing: '-1px' }}>
          Framework<br />A.C.E.L.E.R.A
        </h2>
        <p style={{ fontFamily: s.sans, fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.32)', maxWidth: '260px', lineHeight: 1.6, margin: 0, textAlign: 'right' }}>
          Sete camadas integradas cobrindo todo o ciclo de receita.
        </p>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="acelera-grid">
          {steps.map((st, i) => (
            <div key={i} className="acelera-cell">
              <div style={{ fontFamily: s.serif, fontSize: 'clamp(44px,5vw,70px)', fontWeight: 700, lineHeight: 0.9, background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '18px' }}>{st.letter}</div>
              <div style={{ fontFamily: s.sans, fontSize: '12px', fontWeight: 600, color: '#fff', marginBottom: '8px', letterSpacing: '0.02em' }}>{st.word}</div>
              <p style={{ fontFamily: s.sans, fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,0.36)', lineHeight: 1.6, margin: 0 }}>{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── COMO FUNCIONA ──────────────────────────────────────────── */
function Parceria() {
  const steps = [
    { n: '01', title: 'Diagnóstico',   desc: 'Mapeamos seu funil atual, dados disponíveis e principais oportunidades em uma reunião de 60 minutos.' },
    { n: '02', title: 'Estratégia',    desc: 'Montamos o plano de Revenue Ops adaptado ao seu momento, recursos e metas de crescimento.' },
    { n: '03', title: 'Implementação', desc: 'Executamos as mudanças, configuramos o tracking e lançamos os primeiros experimentos de crescimento.' },
    { n: '04', title: 'Resultados',    desc: 'Revisões semanais com métricas reais, ajustes rápidos e relatórios executivos mensais.' },
  ];
  return (
    <section id="parceria" style={{ background: s.mid, padding: '100px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="reveal" style={{ fontFamily: s.serif, fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: '-1px', marginBottom: '60px' }}>
          Do diagnóstico ao<br />crescimento contínuo
        </h2>
        <div className="proc-grid">
          {steps.map((st, i) => (
            <div key={i} className={`proc-cell reveal d${(i % 2) + 1}`}>
              <div style={{ fontFamily: s.serif, fontSize: '40px', fontWeight: 700, background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '14px' }}>{st.n}</div>
              <h3 style={{ fontFamily: s.serif, fontSize: 'clamp(20px,2vw,26px)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '12px', letterSpacing: '-0.3px' }}>{st.title}</h3>
              <p style={{ fontFamily: s.sans, fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.44)', lineHeight: 1.72, margin: 0 }}>{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FERRAMENTAS ────────────────────────────────────────────── */
function Ferramentas() {
  const tools = ['HubSpot','RD Station','Salesforce','Google Analytics 4','Meta Ads','Google Ads','ActiveCampaign','Hotjar','Semrush','Looker Studio','Zapier','Make'];
  return (
    <section style={{ background: s.dark, padding: '64px 0', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <p style={{ fontFamily: s.sans, fontSize: '11px', fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', textAlign: 'center', marginBottom: '28px' }}>
        Operamos com as ferramentas do seu stack
      </p>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', animation: 'marquee 28s linear infinite', width: 'fit-content' }}>
          {[...tools, ...tools].map((t, i) => (
            <span key={i} style={{ fontFamily: s.sans, fontSize: '13px', color: 'rgba(255,255,255,0.22)', padding: '0 40px', whiteSpace: 'nowrap', borderRight: '1px solid rgba(255,255,255,0.07)' }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section id="contato" style={{ background: s.dark, padding: '140px 60px', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <GridLines />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '60vw', height: '40vw', background: 'radial-gradient(ellipse, rgba(16,63,234,0.13) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: '860px', margin: '0 auto', position: 'relative' }}>
        <h2 className="reveal" style={{ fontFamily: s.serif, fontSize: 'clamp(40px,6.5vw,92px)', fontWeight: 700, color: '#fff', lineHeight: 0.93, letterSpacing: '-2px', marginBottom: '48px' }}>
          Pronto para<br />
          <span style={{ background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>crescimento real?</span>
        </h2>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <a href={CALENDAR} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '15px', padding: '16px 44px' }}>
            Agendar diagnóstico gratuito
          </a>
          <span style={{ fontFamily: s.sans, fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.28)' }}>60 minutos, sem compromisso</span>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─────────────────────────────────────────────────── */
function Footer() {
  const links = [
    { label: 'Metodologia', href: '#metodologia' },
    { label: 'Serviços',    href: '#servicos' },
    { label: 'Parceria',    href: '#parceria' },
    { label: 'Contato',     href: '#contato' },
  ];
  return (
    <footer style={{ background: '#010305', padding: '40px 60px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <span style={{ fontFamily: s.serif, fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>Mutua</span>
        <div style={{ display: 'flex', gap: '32px' }}>
          {links.map(({ label, href }) => (
            <a key={label} href={href} style={{ fontFamily: s.sans, fontSize: '13px', color: 'rgba(255,255,255,0.22)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.22)'}
            >{label}</a>
          ))}
        </div>
        <span style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.18)' }}>© {new Date().getFullYear()} Mutua</span>
      </div>
    </footer>
  );
}

/* ─── PAGE ───────────────────────────────────────────────────── */
export default function Home() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.1 }
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
      <Servicos />
      <Framework />
      <Parceria />
      <Ferramentas />
      <CTA />
      <Footer />
    </>
  );
}

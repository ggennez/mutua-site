'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Spline from '@splinetool/react-spline/next';
import Nav from '../components/Nav';

const CALENDAR = 'https://calendar.app.google/MfDV2fPTurR6msid6';

const s = {
  dark:  '#030508',
  mid:   '#070b10',
  blue:  '#1A6DE5',
  grad:  'linear-gradient(135deg,#103FEA 0%,#1A6DE5 60%,#0a2fa8 100%)',
  serif: 'Fraunces, serif',
  sans:  'Inter, sans-serif',
};

const css = `
  @keyframes marquee    { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes fadeUp     { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dashFlt    {
    0%,100%{transform:perspective(1100px) rotateY(-7deg) rotateX(2deg) translateY(0)}
    50%    {transform:perspective(1100px) rotateY(-7deg) rotateX(2deg) translateY(-14px)}
  }
  @keyframes ltrIn      { to{opacity:1;transform:translateY(0)} }
  @keyframes lineExp    { to{width:clamp(110px,18vw,200px)} }
  @keyframes lFdIn      { to{opacity:1} }
  @keyframes drawStroke { to{stroke-dashoffset:0} }


  /* ── loader ───────────────────────────────────────────────── */
  .loader { position:fixed; inset:0; z-index:9999; background:#030508; display:flex; align-items:center; justify-content:center; overflow:hidden; transition:transform .85s cubic-bezier(.76,0,.24,1); }
  .loader.exit { transform:translateY(-100%); }
  .ltr  { font-family:Fraunces,serif; font-weight:700; color:#fff; opacity:0; transform:translateY(22px); display:inline-block; animation:ltrIn .55s cubic-bezier(.22,1,.36,1) forwards; }
  .lline{ width:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent); margin:22px auto; animation:lineExp .8s cubic-bezier(.22,1,.36,1) .56s forwards; }
  .lsub { opacity:0; font-family:Inter,sans-serif; font-size:11px; letter-spacing:.2em; color:rgba(255,255,255,.35); text-transform:uppercase; animation:lFdIn .6s ease 1.15s forwards; }

  /* ── reveal ───────────────────────────────────────────────── */
  .reveal { opacity:0; transform:translateY(44px); transition:opacity .82s cubic-bezier(.22,1,.36,1), transform .82s cubic-bezier(.22,1,.36,1); }
  .reveal.in { opacity:1; transform:translateY(0); }
  .d1{transition-delay:.1s} .d2{transition-delay:.22s} .d3{transition-delay:.34s} .d4{transition-delay:.46s} .d5{transition-delay:.6s}

  /* ── section label ────────────────────────────────────────── */
  .sec-label { display:inline-flex; align-items:center; gap:10px; font-family:Inter,sans-serif; font-size:11px; font-weight:500; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.3); }

  /* ── pill button ──────────────────────────────────────────── */
  .btn-pill { display:inline-flex; align-items:center; gap:14px; font-family:Inter,sans-serif; font-size:14px; font-weight:600; color:#fff; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.14); border-radius:999px; padding:10px 10px 10px 28px; text-decoration:none; transition:background .25s,border-color .25s; white-space:nowrap; align-self:flex-start; }
  .btn-pill:hover { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.3); }
  .pill-circle { width:34px; height:34px; border-radius:50%; background:#1A6DE5; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
  .btn-pill-solid { background:#1A6DE5; border-color:transparent; padding:12px 12px 12px 30px; font-size:15px; }
  .btn-pill-solid:hover { opacity:.88; }
  .btn-pill-solid .pill-circle { background:rgba(0,0,0,.22); }

  /* ── hero grids ───────────────────────────────────────────── */
  .hero-btm   { display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:flex-end; }
  .hero-stats { display:grid; grid-template-columns:repeat(3,1fr); }

  /* ── proof cards ──────────────────────────────────────────── */
  .proof-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(255,255,255,.07); }
  .proof-card { background:#030508; padding:44px 36px; }

  /* ── services ─────────────────────────────────────────────── */
  .svc-hdr  { display:grid; grid-template-columns:1fr auto; gap:48px; align-items:flex-end; }
  .svc-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(255,255,255,.07); }
  .svc-card { background:#030508; padding:52px 36px 48px; transition:background .3s; }
  .svc-card:hover { background:#060b14; }
  .svc-vis-line { stroke-dasharray:300; stroke-dashoffset:300; }
  .svc-card:hover .svc-vis-line { animation:drawStroke 1s cubic-bezier(.22,1,.36,1) forwards; }

  /* ── feature split ────────────────────────────────────────── */
  .feat-split { display:grid; grid-template-columns:1fr 1fr; gap:1px; background:rgba(255,255,255,.07); }
  .feat-left  { background:#030508; padding:64px 52px; }
  .feat-right { background:#070b10; padding:64px 52px; display:flex; align-items:center; justify-content:center; }

  /* ── bene grid ────────────────────────────────────────────── */
  .bene-grid { display:grid; grid-template-columns:240px 1fr; gap:80px; align-items:start; }

  /* ── acelera ──────────────────────────────────────────────── */
  .acelera-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:1px; background:rgba(255,255,255,.07); }
  .acelera-cell { background:#030508; padding:40px 20px 36px; transition:background .25s; }
  .acelera-cell:hover { background:#06090f; }

  /* ── how it works ─────────────────────────────────────────── */
  .how-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(255,255,255,.07); }
  .how-cell { background:#070b10; padding:48px 32px; }

  /* ── pricing ─────────────────────────────────────────────── */
  .pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(255,255,255,.07); }
  .pricing-popular { outline:1px solid rgba(26,109,229,0.32); outline-offset:-1px; }

  /* ── utils ────────────────────────────────────────────────── */
  .pill { display:inline-block; font-family:Inter,sans-serif; font-size:10px; font-weight:500; color:rgba(255,255,255,.3); border:1px solid rgba(255,255,255,.1); padding:3px 10px; margin:3px 3px 3px 0; border-radius:2px; }

  /* ── responsive ───────────────────────────────────────────── */
  @media(max-width:1024px) {
    .proof-grid   { grid-template-columns:1fr!important; }
    .svc-grid     { grid-template-columns:1fr!important; }
    .feat-split   { grid-template-columns:1fr!important; }
    .acelera-grid { grid-template-columns:repeat(4,1fr)!important; }
    .how-grid     { grid-template-columns:repeat(2,1fr)!important; }
    .bene-grid    { grid-template-columns:1fr!important; gap:28px!important; }
    .svc-hdr      { grid-template-columns:1fr!important; }
    .pricing-grid { grid-template-columns:1fr!important; }
  }
  @media(max-width:768px) {
    .hero-btm   { grid-template-columns:1fr!important; gap:32px!important; }
    .hero-stats { grid-template-columns:1fr!important; }
    .how-grid   { grid-template-columns:1fr!important; }
  }
  @media(max-width:640px) {
    .svc-card   { padding:36px 22px!important; }
    .how-cell   { padding:36px 22px!important; }
    .feat-left  { padding:40px 24px!important; }
    .feat-right { padding:40px 24px!important; }
    .acelera-grid { grid-template-columns:repeat(2,1fr)!important; }
  }

  /* ── testimonials ─────────────────────────────────────────────── */
  .tsm-stack  { display:grid; grid-template-areas:'stack'; place-items:start; }
  .tsm-card   { grid-area:stack; position:relative; }
  .tsm-behind { filter:grayscale(1); transition:filter .5s; }
  .tsm-behind::before { content:''; position:absolute; inset:0; border-radius:16px; background:rgba(3,5,8,.65); transition:opacity .5s; pointer-events:none; z-index:1; }
  .tsm-behind:hover { filter:grayscale(0); }
  .tsm-behind:hover::before { opacity:0; }
  .tsm-bento  { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(255,255,255,.07); }
  .tsm-feat   { grid-column:span 2; grid-row:span 2; }
  .tsm-wide   { grid-column:span 2; }
  @media(max-width:1024px) { .tsm-bento { grid-template-columns:repeat(2,1fr)!important; } .tsm-feat { grid-column:span 1!important; grid-row:span 1!important; } .tsm-wide { grid-column:span 1!important; } }
  @media(max-width:640px)  { .tsm-bento { grid-template-columns:1fr!important; } }
`;

/* ─── LOADING SCREEN ──────────────────────────────────────────── */
function LoadingScreen({ onDone }) {
  const [exiting, setExiting] = useState(false);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const t1 = setTimeout(() => setExiting(true), 2000);
    const t2 = setTimeout(() => { document.body.style.overflow = ''; onDone(); }, 2850);
    return () => { clearTimeout(t1); clearTimeout(t2); document.body.style.overflow = ''; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`loader${exiting ? ' exit' : ''}`}>
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ letterSpacing: '-3px' }}>
          {'MUTHUA'.split('').map((l, i) => (
            <span key={i} className="ltr" style={{ fontSize: 'clamp(64px,10vw,100px)', animationDelay: `${i * 0.09}s` }}>{l}</span>
          ))}
        </div>
        <div className="lline" />
        <p className="lsub">Revenue Operations &amp; Growth Intelligence</p>
      </div>
    </div>
  );
}


/* ─── DASHBOARD MOCKUP ────────────────────────────────────────── */
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
    <div style={{ animation: 'dashFlt 7s ease-in-out infinite', boxShadow: '28px 40px 80px rgba(0,0,0,0.6), 0 0 80px rgba(16,63,234,0.14)', width: '100%' }}>
      <div style={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
            <span style={{ fontFamily: s.sans, fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Painel de Receita</span>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {['#ff5f57','#febc2e','#28c840'].map((c,i) => <div key={i} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c, opacity: 0.65 }} />)}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '16px' }}>
          {kpis.map((k,i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '11px 10px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontFamily: s.sans, fontSize: '9px', color: 'rgba(255,255,255,0.28)', letterSpacing: '0.07em', marginBottom: '4px' }}>{k.l}</div>
              <div style={{ fontFamily: s.serif, fontSize: '15px', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '3px' }}>{k.v}</div>
              <div style={{ fontFamily: s.sans, fontSize: '10px', color: '#22c55e' }}>{k.d}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(255,255,255,0.025)', borderRadius: '8px', padding: '12px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontFamily: s.sans, fontSize: '9px', color: 'rgba(255,255,255,0.28)', marginBottom: '8px', letterSpacing: '0.06em' }}>Crescimento MRR</div>
          <svg viewBox="0 0 240 52" style={{ width: '100%' }}>
            <defs>
              <linearGradient id="mg1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1A6DE5" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#1A6DE5" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[13,26,39].map(y => <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />)}
            <polygon points="0,48 40,40 80,33 120,24 160,15 200,8 240,3 240,52 0,52" fill="url(#mg1)" />
            <polyline points="0,48 40,40 80,33 120,24 160,15 200,8 240,3" fill="none" stroke="#1A6DE5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            {['Jan','Fev','Mar','Abr','Mai','Jun'].map((m,i) => <text key={i} x={i*48+24} y="52" fontFamily="Inter,sans-serif" fontSize="7" fill="rgba(255,255,255,0.18)" textAnchor="middle">{m}</text>)}
          </svg>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.025)', borderRadius: '8px', padding: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ fontFamily: s.sans, fontSize: '9px', color: 'rgba(255,255,255,0.28)', marginBottom: '10px', letterSpacing: '0.06em' }}>Funil de Conversão</div>
          {funnel.map((row,i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: i < funnel.length-1 ? '5px' : 0 }}>
              <div style={{ fontFamily: s.sans, fontSize: '8px', color: 'rgba(255,255,255,0.22)', width: '44px', flexShrink: 0 }}>{row.l}</div>
              <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                <div style={{ width: `${row.p}%`, height: '100%', background: `rgba(26,109,229,${0.5+i*0.08})`, borderRadius: '2px' }} />
              </div>
              <div style={{ fontFamily: s.sans, fontSize: '8px', color: 'rgba(255,255,255,0.22)', width: '22px', textAlign: 'right' }}>{row.p}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MINI CHARTS ─────────────────────────────────────────────── */
function FunnelBars() {
  return (
    <div>
      {[['Visitantes',100],['Leads',68],['MQLs',30],['Clientes',11]].map(([l,w],i) => (
        <div key={i} style={{ marginBottom: '6px' }}>
          <div style={{ width: `${w}%`, height: '14px', background: `rgba(26,109,229,${0.14+i*0.07})`, borderLeft: '2px solid rgba(26,109,229,0.5)' }} />
          <div style={{ fontFamily: s.sans, fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: '1px' }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function TrendLine() {
  return (
    <svg viewBox="0 0 220 60" style={{ width: '100%' }}>
      <defs>
        <linearGradient id="tg2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A6DE5" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#1A6DE5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points="0,56 44,46 88,36 132,24 176,14 220,4 220,60 0,60" fill="url(#tg2)" />
      <polyline points="0,56 44,46 88,36 132,24 176,14 220,4" fill="none" stroke="#1A6DE5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {[[0,56],[44,46],[88,36],[132,24],[176,14],[220,4]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="3" fill="#1A6DE5" opacity="0.85" />)}
    </svg>
  );
}

function CACCompareBars() {
  return (
    <svg viewBox="0 0 100 72" style={{ width: '70%' }}>
      <rect x="6"  y={68-62} width="32" height="62" fill="rgba(255,255,255,0.09)" rx="2" />
      <rect x="56" y={68-37} width="32" height="37" fill="#1A6DE5" rx="2" />
      <text x="22" y="72" fontFamily="Inter,sans-serif" fontSize="7" fill="rgba(255,255,255,0.22)" textAnchor="middle">Antes</text>
      <text x="72" y="72" fontFamily="Inter,sans-serif" fontSize="7" fill="rgba(255,255,255,0.22)" textAnchor="middle">Depois</text>
      <text x="90" y={68-37} fontFamily="Inter,sans-serif" fontSize="8" fill="#1A6DE5">-40%</text>
    </svg>
  );
}

/* ─── SERVICE ICONS ───────────────────────────────────────────── */
function FunnelIcon() {
  return (
    <svg viewBox="0 0 64 48" width="56" style={{ opacity: 0.45, marginBottom: '24px' }}>
      <rect x="0"  y="0"  width="64" height="10" fill="#1A6DE5" rx="2" />
      <rect x="8"  y="14" width="48" height="9"  fill="rgba(26,109,229,0.7)" rx="2" />
      <rect x="18" y="27" width="28" height="8"  fill="rgba(26,109,229,0.5)" rx="2" />
      <rect x="26" y="39" width="12" height="7"  fill="rgba(26,109,229,0.3)" rx="2" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 64 40" width="56" style={{ opacity: 0.45, marginBottom: '24px' }}>
      <polyline points="0,36 16,28 32,18 48,10 64,3" fill="none" stroke="#1A6DE5" strokeWidth="2.5" strokeLinecap="round" className="svc-vis-line" />
      {[[0,36],[16,28],[32,18],[48,10],[64,3]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="3" fill="#1A6DE5" opacity="0.9" />)}
    </svg>
  );
}

function NodeIcon() {
  return (
    <svg viewBox="0 0 64 48" width="56" style={{ opacity: 0.45, marginBottom: '24px' }}>
      <line x1="32" y1="24" x2="8"  y2="8"  stroke="rgba(26,109,229,0.4)" strokeWidth="1" />
      <line x1="32" y1="24" x2="56" y2="8"  stroke="rgba(26,109,229,0.4)" strokeWidth="1" />
      <line x1="32" y1="24" x2="8"  y2="40" stroke="rgba(26,109,229,0.4)" strokeWidth="1" />
      <line x1="32" y1="24" x2="56" y2="40" stroke="rgba(26,109,229,0.4)" strokeWidth="1" />
      <circle cx="32" cy="24" r="7" fill="rgba(26,109,229,0.3)" stroke="#1A6DE5" strokeWidth="1.5" />
      {[[8,8],[56,8],[8,40],[56,40]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="4" fill="rgba(26,109,229,0.2)" stroke="rgba(26,109,229,0.5)" strokeWidth="1" />)}
    </svg>
  );
}

/* ─── GRID LINES (CTA decoration) ────────────────────────────── */
function GridLines() {
  const lines = [];
  for (let i = 0; i <= 9; i++) {
    lines.push(<line key={`h${i}`} x1="0" y1={i*40} x2="360" y2={i*40} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />);
    lines.push(<line key={`v${i}`} x1={i*40} y1="0" x2={i*40} y2="360" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />);
  }
  return (
    <svg viewBox="0 0 360 360" style={{ position: 'absolute', left: 0, bottom: 0, width: '420px', pointerEvents: 'none', zIndex: 0 }} aria-hidden>
      {lines}
    </svg>
  );
}

/* ─── SHARED PRIMITIVES ───────────────────────────────────────── */
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
    <path d="M3 7h8M8 4l3 3-3 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function PillBtn({ href, children, solid }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`btn-pill${solid ? ' btn-pill-solid' : ''}`}>
      {children}
      <span className="pill-circle"><ArrowRight /></span>
    </a>
  );
}

function SL({ text, style }) {
  return (
    <div className="sec-label" style={style}>
      <span>←</span>
      <span>{text}</span>
    </div>
  );
}

/* ─── TEXT GRADIENT SCROLL ──────────────────────────────────────── */
function RevealChar({ char, progress, start, end }) {
  const opacity = useTransform(progress, [start, end], [0.12, 1]);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ opacity: 0.12, userSelect: 'none' }}>{char}</span>
      <motion.span style={{ position: 'absolute', top: 0, left: 0, opacity }}>{char}</motion.span>
    </span>
  );
}

function TextGradientReveal({ text, progress }) {
  const words = text.split(' ');
  return (
    <p style={{ margin: 0, display: 'flex', flexWrap: 'wrap', gap: '0 0.3em' }}>
      {words.map((word, wi) => {
        const wStart = wi / words.length;
        const wEnd   = wStart + 1 / words.length;
        const chars  = word.split('');
        const step   = (wEnd - wStart) / chars.length;
        return (
          <span key={wi} style={{ display: 'inline-flex', marginBottom: '0.2em' }}>
            {chars.map((ch, ci) => (
              <RevealChar
                key={ci}
                char={ch}
                progress={progress}
                start={wStart + ci * step}
                end={wStart + (ci + 1) * step}
              />
            ))}
          </span>
        );
      })}
    </p>
  );
}

function ScrollStatement() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const text = 'Não somos uma agência de marketing. Somos a sua operação de Revenue completa — cada funil mapeado, cada experimento medido, cada real rastreado. Crescimento previsível. Não obra do acaso.';
  return (
    <section
      ref={containerRef}
      style={{ background: s.dark, position: 'relative', minHeight: '200vh', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 60px',
      }}>
        <div style={{ maxWidth: '860px', width: '100%' }}>
          <SL text="Manifesto" style={{ marginBottom: '32px' }} />
          <div style={{
            fontFamily: s.serif,
            fontSize: 'clamp(28px,3.8vw,54px)',
            fontWeight: 300,
            color: '#fff',
            lineHeight: 1.25,
            letterSpacing: '-0.5px',
          }}>
            <TextGradientReveal text={text} progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── METRIC STACK (DisplayCards) ───────────────────────────────── */
function MetricStack() {
  const cards = [
    { label: 'Funil com gaps',  metric: '67%', desc: 'das empresas têm vazamentos nunca identificados', tag: 'Problema'  },
    { label: 'Mais previsível', metric: '3×',  desc: 'de previsibilidade com Revenue Ops estruturado',   tag: 'Resultado' },
    { label: 'Redução de CAC',  metric: '40%', desc: 'do investimento desperdiçado sem rastreamento',    tag: 'Impacto'   },
  ];
  return (
    <div style={{ position: 'relative', width: '340px', height: '210px' }}>
      {cards.map((card, i) => {
        const isTop = i === cards.length - 1;
        const off   = cards.length - 1 - i;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top:  `${off * 20}px`,
              left: `${off * 32}px`,
              width: '280px',
              height: '162px',
              background: isTop ? 'rgba(255,255,255,0.07)' : `rgba(255,255,255,${0.03 + i * 0.01})`,
              backdropFilter: `blur(${isTop ? 14 : 8 + i * 2}px)`,
              WebkitBackdropFilter: `blur(${isTop ? 14 : 8 + i * 2}px)`,
              border: `1px solid rgba(255,255,255,${isTop ? 0.14 : 0.06})`,
              borderRadius: '10px',
              padding: '18px 20px',
              transform: 'skewY(-4deg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              zIndex: i,
              transition: 'transform 0.35s cubic-bezier(.22,1,.36,1)',
            }}
            onMouseEnter={isTop ? e => { e.currentTarget.style.transform = 'skewY(-4deg) translateY(-9px)'; } : undefined}
            onMouseLeave={isTop ? e => { e.currentTarget.style.transform = 'skewY(-4deg)'; } : undefined}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: s.sans, fontSize: '9px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>{card.label}</span>
              <span style={{ fontFamily: s.sans, fontSize: '9px', fontWeight: 500, color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.14)', padding: '2px 7px', borderRadius: '2px', letterSpacing: '0.08em' }}>{card.tag}</span>
            </div>
            <div style={{ fontFamily: s.serif, fontSize: 'clamp(34px,4vw,48px)', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{card.metric}</div>
            <p style={{ fontFamily: s.sans, fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,0.38)', lineHeight: 1.5, margin: 0 }}>{card.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

/* ─── REVENUE AREA CHART ─────────────────────────────────────────── */
function RevenueAreaChart() {
  const ref = useRef(null);
  const [visible, setVisible]   = useState(false);
  const [showDots, setShowDots] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          setTimeout(() => setShowDots(true), 2100);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const W = 540, H = 280;
  const pad = { t: 24, r: 16, b: 44, l: 44 };
  const iW  = W - pad.l - pad.r;
  const iH  = H - pad.t - pad.b;

  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const mrr    = [48, 52, 56, 55, 63, 68, 72, 70, 77, 83, 86, 90];
  const maxV   = 100;

  function smooth(pts) {
    let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const cpx = ((pts[i-1].x + pts[i].x) / 2).toFixed(1);
      d += ` C ${cpx},${pts[i-1].y.toFixed(1)} ${cpx},${pts[i].y.toFixed(1)} ${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
    }
    return d;
  }

  const pts    = mrr.map((v, i) => ({ x: pad.l + (i / (mrr.length - 1)) * iW, y: pad.t + (1 - v / maxV) * iH }));
  const line   = smooth(pts);
  const baseY  = (pad.t + iH).toFixed(1);
  const area   = `${line} L ${pts[pts.length-1].x.toFixed(1)},${baseY} L ${pts[0].x.toFixed(1)},${baseY} Z`;
  const gridYs = [0.25, 0.5, 0.75, 1].map(t => ({ v: Math.round(maxV * (1 - t)), y: pad.t + t * iH }));

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div>
          <div style={{ fontFamily: s.sans, fontSize: '9px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '4px' }}>Crescimento MRR</div>
          <div style={{ fontFamily: s.serif, fontSize: '22px', fontWeight: 700, color: '#fff', lineHeight: 1, display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            R$ 84k <span style={{ fontSize: '13px', fontFamily: s.sans, color: '#22c55e', fontWeight: 600 }}>↑ +31%</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['#ff5f57','#febc2e','#28c840'].map((c, i) => (
            <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, opacity: 0.55 }} />
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="rac-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#1A6DE5" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#1A6DE5" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {gridYs.map(({ y, v }) => (
          <g key={v}>
            <line x1={pad.l} y1={y} x2={pad.l + iW} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize="9" fontFamily="Inter,sans-serif" fill="rgba(255,255,255,0.2)">{v}k</text>
          </g>
        ))}

        {months.filter((_, i) => i % 3 === 0).map((m, idx) => {
          const x = pad.l + ((idx * 3) / (months.length - 1)) * iW;
          return <text key={m} x={x} y={H - 6} textAnchor="middle" fontSize="9" fontFamily="Inter,sans-serif" fill="rgba(255,255,255,0.2)">{m}</text>;
        })}

        <path d={area} fill="url(#rac-g)" />

        <path
          d={line}
          fill="none"
          stroke="#1A6DE5"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1500"
          strokeDashoffset={visible ? 0 : 1500}
          style={{ transition: visible ? 'stroke-dashoffset 2s cubic-bezier(.22,1,.36,1)' : 'none' }}
        />

        {showDots && pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#1A6DE5" opacity="0.88" />
        ))}
      </svg>
    </div>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
function Hero() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - r.top)  / r.height) * 100}%`);
    };
    el.addEventListener('mousemove', fn);
    return () => el.removeEventListener('mousemove', fn);
  }, []);

  return (
    <section ref={ref} style={{
      minHeight: '100dvh',
      background: s.dark,
      display: 'flex',
      flexDirection: 'column',
      padding: '0 60px 56px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Spline 3D background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Spline scene="https://prod.spline.design/GDQyht1dh6bt-b7A/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      {/* Dark overlay — lighter at top, heavier at bottom for legibility */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(3,5,8,0.42) 0%, rgba(3,5,8,0.68) 55%, rgba(3,5,8,0.97) 100%)', zIndex: 1 }} />
      {/* Mouse glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle 700px at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.025) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 2 }} />

      {/* Wordmark — hero identity */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 3,
        paddingTop: '80px',
        animation: 'fadeUp 1.1s cubic-bezier(.22,1,.36,1) 0.12s both',
      }}>
        <div style={{
          fontFamily: s.serif,
          fontSize: 'clamp(96px,16vw,220px)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          WebkitTextStroke: '1.5px rgba(255,255,255,0.18)',
          color: 'transparent',
          lineHeight: 0.9,
          userSelect: 'none',
        }}>
          MUTHUA
        </div>
      </div>

      {/* Bottom — headline left + descriptor right */}
      <div style={{ position: 'relative', zIndex: 3, animation: 'fadeUp 0.9s cubic-bezier(.22,1,.36,1) 0.38s both' }}>
        <div className="hero-btm" style={{ marginBottom: '48px' }}>
          <div>
            <SL text="Revenue Operations" style={{ marginBottom: '20px' }} />
            <h1 style={{ fontFamily: s.serif, fontSize: 'clamp(40px,5.5vw,80px)', fontWeight: 300, color: '#fff', lineHeight: 0.94, letterSpacing: '-2px', margin: 0 }}>
              Crescimento<br />
              <em style={{ fontStyle: 'italic', color: '#fff' }}>previsível.</em>
            </h1>
            <div style={{ marginTop: '28px' }}><AvatarGroup /></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            <p style={{ fontFamily: s.sans, fontSize: '15px', fontWeight: 300, color: 'rgba(255,255,255,0.4)', lineHeight: 1.74, margin: '0 0 28px', maxWidth: '360px' }}>
              Revenue Ops que transforma funis e métricas em crescimento real e escalável para o seu negócio.
            </p>
            <PillBtn href={CALENDAR} solid>Agendar diagnóstico gratuito</PillBtn>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '28px' }} />
        <div className="hero-stats">
          {[
            { metric: 'MRR +31%',   label: 'Crescimento de receita' },
            { metric: 'Leads +47%', label: 'Volume de oportunidades' },
            { metric: 'Conv. 4.1%', label: 'Taxa de conversão' },
          ].map((st, i) => (
            <div key={i} style={{
              paddingRight: '24px',
              borderRight: i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              paddingLeft: i > 0 ? '24px' : 0,
            }}>
              <div style={{ fontFamily: s.serif, fontSize: 'clamp(20px,2.2vw,28px)', fontWeight: 700, color: '#fff', marginBottom: '4px', letterSpacing: '-0.5px' }}>{st.metric}</div>
              <div style={{ fontFamily: s.sans, fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── BENEFITS ────────────────────────────────────────────────── */
function Benefits() {
  return (
    <section style={{ background: s.dark, padding: '120px 60px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="bene-grid">
          <div>
            <SL text="Os benefícios" style={{ paddingTop: '6px' }} />
          </div>
          <div>
            <h2 className="reveal" style={{
              fontFamily: s.serif,
              fontSize: 'clamp(28px,3.8vw,54px)',
              fontWeight: 300,
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              margin: '0 0 40px',
            }}>
              Revenue Ops que{' '}
              <em style={{ fontStyle: 'italic' }}>elimina o desperdício</em>
              {' '}e transforma sua operação em crescimento previsível e escalável.
            </h2>
            <PillBtn href={CALENDAR} className="reveal d1">Falar com especialista</PillBtn>
            <div className="reveal d2" style={{ marginTop: '72px' }}>
              <MetricStack />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PROOF CARDS ─────────────────────────────────────────────── */
function ProofCards() {
  const cards = [
    {
      metric: '67%',
      visual: <FunnelBars />,
      title: 'Funil com vazamentos invisíveis',
      desc: 'Das empresas perdem receita em pontos do funil que nunca foram mapeados ou rastreados.',
    },
    {
      metric: '3×',
      visual: <TrendLine />,
      title: 'Mais previsibilidade de receita',
      desc: 'Revenue Ops estruturado entrega 3× mais previsibilidade vs. marketing tradicional.',
    },
    {
      metric: '40%',
      visual: <CACCompareBars />,
      title: 'Redução real no CAC',
      desc: 'Do investimento em marketing é desperdiçado por falta de rastreamento e atribuição.',
    },
  ];

  return (
    <section style={{ background: s.dark, padding: '0 60px 100px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="proof-grid">
          {cards.map((c, i) => (
            <div key={i} className={`proof-card reveal d${i + 1}`}>
              <div style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '22px 22px 16px',
                marginBottom: '28px',
                minHeight: '90px',
                display: 'flex',
                alignItems: 'flex-end',
              }}>
                {c.visual}
              </div>
              <div style={{ fontFamily: s.serif, fontSize: 'clamp(48px,5vw,72px)', fontWeight: 700, color: '#fff', lineHeight: 1, marginBottom: '12px' }}>
                {c.metric}
              </div>
              <h3 style={{ fontFamily: s.serif, fontSize: 'clamp(18px,1.8vw,22px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.3px', margin: '0 0 10px' }}>
                {c.title}
              </h3>
              <p style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.38)', lineHeight: 1.72, margin: 0 }}>
                {c.desc}
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
  const planos = [
    {
      num: '01', name: 'Funnel Audit', tipo: 'Projeto único', icon: <FunnelIcon />,
      headline: 'Descubra onde você está perdendo receita',
      desc: 'Mapeamos cada etapa do seu funil, identificamos os pontos de vazamento e entregamos um plano de ação para os próximos 90 dias.',
      pills: ['Mapeamento de funil','Análise de tracking','Relatório de gaps','Plano 90 dias'],
    },
    {
      num: '02', name: 'Growth Operations', tipo: 'Mensalidade', badge: 'Mais escolhido', icon: <TrendIcon />,
      headline: 'Um time de Revenue Ops dedicado à sua empresa',
      desc: 'A Muthua age como seu time interno de Revenue Ops — executando experimentos, otimizando funil e entregando relatórios executivos todo mês.',
      pills: ['Execução contínua','Experiments mensais','Dashboard em tempo real','Revisões semanais'],
    },
    {
      num: '03', name: 'AI Systems', tipo: 'Projeto', icon: <NodeIcon />,
      headline: 'Automatize e escale sem aumentar o time',
      desc: 'Implementamos sistemas de automação e IA que qualificam leads, nutrem prospects e integram seu stack — sem precisar contratar mais ninguém.',
      pills: ['Qualificação com IA','Nurturing automático','Integrações de stack'],
    },
  ];

  const features = [
    'Data-driven desde o dia 1',
    'Experimentos com métricas reais',
    'Integrado ao seu stack existente',
    'Relatórios executivos mensais',
    'Sem lock-in — seu time aprende',
  ];

  return (
    <section id="servicos" style={{ background: s.dark, padding: '100px 60px 0' }}>
      {/* Section header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
        <div className="svc-hdr">
          <div>
            <SL text="Nossos Serviços" style={{ marginBottom: '20px' }} />
            <h2 className="reveal" style={{
              fontFamily: s.serif,
              fontSize: 'clamp(28px,3.8vw,52px)',
              fontWeight: 300,
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              margin: 0,
            }}>
              Três formas de{' '}
              <em style={{ fontStyle: 'italic' }}>construir revenue.</em>
            </h2>
          </div>
          <div className="reveal d1">
            <PillBtn href={CALENDAR}>Falar com especialista</PillBtn>
          </div>
        </div>
      </div>

      {/* Service cards */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="svc-grid">
          {planos.map((p, i) => (
            <div key={i} className={`svc-card reveal d${i + 1}`}>
              {p.icon}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <span style={{ fontFamily: s.serif, fontSize: 'clamp(36px,4vw,58px)', fontWeight: 700, lineHeight: 1, color: 'rgba(255,255,255,0.22)' }}>{p.num}</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: s.sans, fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.tipo}</div>
                  {p.badge && <div style={{ fontFamily: s.sans, fontSize: '9px', fontWeight: 700, color: '#fff', background: '#1A6DE5', padding: '2px 8px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '5px', display: 'inline-block' }}>{p.badge}</div>}
                </div>
              </div>
              <div style={{ fontFamily: s.sans, fontSize: '10px', fontWeight: 600, color: s.blue, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px' }}>{p.name}</div>
              <h3 style={{ fontFamily: s.serif, fontSize: 'clamp(19px,1.9vw,25px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.3px', margin: '0 0 14px' }}>{p.headline}</h3>
              <p style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.44)', lineHeight: 1.72, margin: '0 0 22px' }}>{p.desc}</p>
              <div style={{ marginBottom: '28px' }}>{p.pills.map(pill => <span key={pill} className="pill">{pill}</span>)}</div>
              <a href={CALENDAR} target="_blank" rel="noopener noreferrer" className="btn-pill" style={{ fontSize: '13px', padding: '8px 8px 8px 22px', gap: '12px' }}>
                Agendar conversa
                <span className="pill-circle" style={{ width: '28px', height: '28px' }}><ArrowRight /></span>
              </a>
            </div>
          ))}
        </div>

        {/* Feature split panel */}
        <div className="feat-split reveal" style={{ marginTop: '1px' }}>
          <div className="feat-left">
            <SL text="Por que funciona" style={{ marginBottom: '28px' }} />
            <h3 style={{ fontFamily: s.serif, fontSize: 'clamp(22px,2.4vw,34px)', fontWeight: 700, color: '#fff', lineHeight: 1.15, letterSpacing: '-0.5px', margin: '0 0 36px' }}>
              Operações construídas para{' '}
              <em style={{ fontStyle: 'italic' }}>resultados reais.</em>
            </h3>
            <div>
              {features.map((f, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 0',
                  borderBottom: i < features.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid rgba(26,109,229,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                      <path d="M1.5 4.5l2 2 4-4" stroke="#1A6DE5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: s.sans, fontSize: '14px', fontWeight: 400, color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="feat-right">
            <RevenueAreaChart />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── METODOLOGIA ─────────────────────────────────────────────── */
function Framework() {
  const steps = [
    { letter:'A', word:'Aquisição',    desc:'Canais, tráfego pago e orgânico com rastreamento de origem.' },
    { letter:'C', word:'Conversão',    desc:'Funil, testes A/B, landing pages e CRO sistemático.' },
    { letter:'E', word:'Engajamento',  desc:'Automações e sequências para avançar oportunidades.' },
    { letter:'L', word:'Lead Scoring', desc:'Qualificação com scoring comportamental e firmográfico.' },
    { letter:'E', word:'Eficiência',   desc:'Redução de CAC e eliminação de gargalos operacionais.' },
    { letter:'R', word:'Retenção',     desc:'Churn prevention, expansão de receita e upsell.' },
    { letter:'A', word:'Análise',      desc:'Dashboards, atribuição e reporting executivo contínuo.' },
  ];

  return (
    <section id="metodologia" style={{ background: s.dark, padding: '100px 60px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
        <SL text="Metodologia" style={{ marginBottom: '20px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'flex-end' }}>
          <h2 className="reveal" style={{ fontFamily: s.serif, fontSize: 'clamp(28px,3.8vw,52px)', fontWeight: 300, color: '#fff', lineHeight: 1.1, letterSpacing: '-1.5px', margin: 0 }}>
            Sete camadas.{' '}
            <em style={{ fontStyle: 'italic' }}>Um resultado.</em>
          </h2>
          <p style={{ fontFamily: s.sans, fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.32)', lineHeight: 1.72, margin: 0, maxWidth: '320px', justifySelf: 'end' }}>
            O framework A.C.E.L.E.R.A cobre todo o ciclo de receita, da aquisição à análise contínua.
          </p>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="acelera-grid">
          {steps.map((st, i) => (
            <div key={i} className="acelera-cell">
              <div style={{ fontFamily: s.serif, fontSize: 'clamp(44px,5vw,68px)', fontWeight: 700, lineHeight: 0.9, color: '#fff', marginBottom: '18px' }}>{st.letter}</div>
              <div style={{ fontFamily: s.sans, fontSize: '11px', fontWeight: 600, color: '#fff', marginBottom: '8px', letterSpacing: '0.02em' }}>{st.word}</div>
              <p style={{ fontFamily: s.sans, fontSize: '11px', fontWeight: 300, color: 'rgba(255,255,255,0.36)', lineHeight: 1.6, margin: 0 }}>{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PARCERIA ────────────────────────────────────────────────── */
function Parceria() {
  const steps = [
    { n: '01', title: 'Diagnóstico',   desc: 'Mapeamos seu funil atual, dados disponíveis e principais oportunidades em uma reunião de 60 minutos.' },
    { n: '02', title: 'Estratégia',    desc: 'Montamos o plano de Revenue Ops adaptado ao seu momento, recursos e metas de crescimento.' },
    { n: '03', title: 'Implementação', desc: 'Executamos as mudanças, configuramos o tracking e lançamos os primeiros experimentos de crescimento.' },
    { n: '04', title: 'Resultados',    desc: 'Revisões semanais com métricas reais, ajustes rápidos e relatórios executivos mensais.' },
  ];

  return (
    <section id="parceria" style={{ background: s.dark, padding: '100px 60px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto 60px' }}>
        <SL text="Como funciona" style={{ marginBottom: '20px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'flex-end' }}>
          <h2 className="reveal" style={{ fontFamily: s.serif, fontSize: 'clamp(28px,3.8vw,52px)', fontWeight: 300, color: '#fff', lineHeight: 1.1, letterSpacing: '-1.5px', margin: 0 }}>
            Do diagnóstico ao{' '}
            <em style={{ fontStyle: 'italic' }}>crescimento contínuo.</em>
          </h2>
          <div className="reveal d1" style={{ justifySelf: 'end' }}>
            <PillBtn href={CALENDAR}>Começar agora</PillBtn>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="how-grid">
          {steps.map((st, i) => (
            <div key={i} className={`how-cell reveal d${i + 1}`}>
              <div style={{ fontFamily: s.serif, fontSize: 'clamp(36px,3.5vw,52px)', fontWeight: 700, color: 'rgba(255,255,255,0.2)', lineHeight: 1, marginBottom: '20px' }}>{st.n}</div>
              <h3 style={{ fontFamily: s.serif, fontSize: 'clamp(18px,1.8vw,22px)', fontWeight: 700, color: '#fff', lineHeight: 1.1, margin: '0 0 12px', letterSpacing: '-0.3px' }}>{st.title}</h3>
              <p style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.44)', lineHeight: 1.72, margin: '0 0 24px' }}>{st.desc}</p>
              <div style={{ width: '20px', height: '1px', background: `rgba(26,109,229,0.4)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FERRAMENTAS ─────────────────────────────────────────────── */
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

/* ─── SOCIAL PROOF ─────────────────────────────────────────────── */
function InlineAvatar({ src, name, quote, expanded, onEnter, onLeave }) {
  return (
    <span
      style={{ display: 'inline-block', verticalAlign: 'middle', position: 'relative', margin: '0 8px' }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <span style={{
        display: 'block',
        width: expanded ? '130px' : '44px',
        height: '44px',
        borderRadius: '999px',
        overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.18)',
        transition: 'width 0.35s cubic-bezier(.22,1,.36,1)',
      }}>
        <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
      </span>
      {expanded && (
        <span style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#fff',
          borderRadius: '12px',
          padding: '16px 18px',
          width: '220px',
          zIndex: 100,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          display: 'block',
          pointerEvents: 'none',
        }}>
          <p style={{ fontFamily: s.sans, fontSize: '13px', lineHeight: 1.5, margin: '0 0 8px', color: '#030508' }}>"{quote}"</p>
          <p style={{ fontFamily: s.sans, fontSize: '12px', fontWeight: 600, margin: 0, color: '#030508' }}>{name}</p>
        </span>
      )}
    </span>
  );
}

function StatCell({ stat }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      style={{ background: s.dark, position: 'relative', overflow: 'hidden', minHeight: '108px', cursor: 'default' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Resting: company label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px',
        transform: hov ? 'translateY(-110%)' : 'translateY(0)',
        opacity: hov ? 0 : 1,
        transition: 'transform 0.3s cubic-bezier(.22,1,.36,1), opacity 0.22s',
      }}>
        <span style={{ fontFamily: s.sans, fontSize: '11px', fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.24)' }}>{stat.company}</span>
        <span style={{ fontFamily: s.sans, fontSize: '10px', color: 'rgba(255,255,255,0.14)', textAlign: 'center', padding: '0 14px' }}>{stat.label}</span>
      </div>
      {/* Hover: stat number */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
        transform: hov ? 'translateY(0)' : 'translateY(110%)',
        opacity: hov ? 1 : 0,
        transition: 'transform 0.3s cubic-bezier(.22,1,.36,1), opacity 0.22s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={stat.up ? '#22c55e' : 'rgba(255,255,255,0.45)'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {stat.up
              ? <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>
              : <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>
            }
          </svg>
          <span style={{ fontFamily: s.serif, fontSize: 'clamp(22px,2.5vw,32px)', fontWeight: 300, fontStyle: 'italic', color: '#fff' }}>{stat.val}</span>
        </div>
        <p style={{ fontFamily: s.sans, fontSize: '11px', color: 'rgba(255,255,255,0.36)', textAlign: 'center', margin: 0, padding: '0 12px' }}>{stat.label}</p>
      </div>
    </div>
  );
}

function SocialProof() {
  const [hovImg, setHovImg] = useState(null);

  const people = [
    { src: 'https://originui.com/avatar-80-04.jpg', name: 'Carla Mendes', quote: 'Em 60 dias, o volume de oportunidades qualificadas triplicou. A Muthua entende de Revenue de verdade.' },
    { src: 'https://originui.com/avatar-80-06.jpg', name: 'Ricardo Faria', quote: 'Previsibilidade de receita foi o que mais mudou. Hoje fazemos forecast com 90% de acurácia.' },
  ];

  const stats = [
    { val: '40%', label: 'redução no CAC', up: false, company: 'E-commerce' },
    { val: '47%', label: 'mais oportunidades', up: true, company: 'SaaS B2B' },
    { val: '31%', label: 'crescimento de MRR', up: true, company: 'Fintech' },
    { val: '2,4×', label: 'de receita em 6 meses', up: true, company: 'Marketplace' },
  ];

  return (
    <section style={{ background: s.mid, padding: '100px 60px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '44px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.36)', padding: '4px 18px', borderRadius: '999px', fontFamily: s.sans, fontSize: '10px', fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            Resultados reais
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{ fontFamily: s.serif, fontSize: 'clamp(22px,3vw,42px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.3 }}>
            Tornamos simples para
            <InlineAvatar {...people[0]} expanded={hovImg === 0} onEnter={() => setHovImg(0)} onLeave={() => setHovImg(null)} />
            empresas B2B
          </div>
          <div style={{ fontFamily: s.serif, fontSize: 'clamp(22px,3vw,42px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.3 }}>
            e suas equipes
            <InlineAvatar {...people[1]} expanded={hovImg === 1} onEnter={() => setHovImg(1)} onLeave={() => setHovImg(null)} />
            crescerem com
          </div>
          <div style={{ fontFamily: s.serif, fontSize: 'clamp(22px,3vw,42px)', fontWeight: 300, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.3 }}>
            receita <em style={{ fontStyle: 'italic' }}>previsível</em>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(255,255,255,0.07)', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
          {stats.map((stat, i) => <StatCell key={i} stat={stat} />)}
        </div>

      </div>
    </section>
  );
}

/* ─── AVATAR GROUP ────────────────────────────────────────────── */
function AvatarGroup() {
  const imgs = [
    'https://originui.com/avatar-80-03.jpg',
    'https://originui.com/avatar-80-04.jpg',
    'https://originui.com/avatar-80-05.jpg',
    'https://originui.com/avatar-80-06.jpg',
  ];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', padding: '4px 14px 4px 4px', gap: '10px' }}>
      <div style={{ display: 'flex' }}>
        {imgs.map((src, i) => (
          <img key={i} src={src} width={22} height={22} alt="" style={{ borderRadius: '50%', outline: '2px solid #030508', marginLeft: i === 0 ? 0 : '-6px', display: 'block' }} />
        ))}
      </div>
      <p style={{ margin: 0, fontFamily: s.sans, fontSize: '12px', color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }}>
        Confiado por <strong style={{ color: '#fff', fontWeight: 600 }}>+30</strong> empresas
      </p>
    </div>
  );
}

/* ─── TWEET CARD ──────────────────────────────────────────────── */
function TweetCard({ username, handle, content, likes, retweets, isBehind, style, onMouseEnter, onMouseLeave }) {
  const ini = handle.replace('@', '').slice(0, 2).toUpperCase();
  return (
    <div
      className={isBehind ? 'tsm-card tsm-behind' : 'tsm-card'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: '300px',
        minHeight: '178px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(26,109,229,0.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: s.sans, fontSize: '11px', fontWeight: 700, color: '#fff' }}>{ini}</span>
          </div>
          <div>
            <div style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{username}</div>
            <div style={{ fontFamily: s.sans, fontSize: '11px', color: 'rgba(255,255,255,0.36)' }}>{handle}</div>
          </div>
        </div>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </div>
      <p style={{ fontFamily: s.sans, fontSize: '13px', color: 'rgba(255,255,255,0.78)', lineHeight: 1.55, margin: '0 0 14px', flex: 1 }}>{content}</p>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span style={{ fontFamily: s.sans, fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>{likes}</span>
        </div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
          <span style={{ fontFamily: s.sans, fontSize: '11px', color: 'rgba(255,255,255,0.28)' }}>{retweets}</span>
        </div>
      </div>
    </div>
  );
}

function StackedTestimonials() {
  const [hovered, setHovered] = useState(null);
  const cards = [
    { username: 'Felipe Torres', handle: '@felipetorres', content: 'A previsibilidade de receita que a Muthua trouxe mudou nossa forma de planejar. Fazemos forecast com 90% de acurácia agora.', likes: 112, retweets: 28 },
    { username: 'Ana Luiza Braga', handle: '@analuiza_cmo', content: 'O mapeamento de funil revelou onde perdíamos 60% dos leads. Em 60 dias, triplicamos as oportunidades qualificadas.', likes: 89, retweets: 19 },
    { username: 'Bruno Alves', handle: '@brunoalves_', content: 'CAC caiu 40% e MRR cresceu 31% nos primeiros 90 dias. Revenue Ops de verdade — não consultoria genérica.', likes: 203, retweets: 45 },
  ];

  const base = [
    { x: 0, y: 0 },
    { x: 24, y: 8 },
    { x: 48, y: 16 },
  ];

  function getT(idx) {
    let { x, y } = base[idx];
    if (hovered === 0) { if (idx === 1) y += 80; if (idx === 2) y += 110; }
    if (hovered === 1 && idx === 2) y += 80;
    return `skewY(-8deg) translateX(${x}px) translateY(${y}px)`;
  }

  return (
    <div className="tsm-stack" style={{ paddingRight: '64px', paddingBottom: '64px' }}>
      {cards.map((card, i) => (
        <TweetCard
          key={i}
          {...card}
          isBehind={i < cards.length - 1}
          style={{ transform: getT(i), zIndex: i, transition: 'transform 0.5s cubic-bezier(.22,1,.36,1)' }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        />
      ))}
    </div>
  );
}

/* ─── TESTIMONIALS GRID ───────────────────────────────────────── */
function TestimonialsGrid() {
  const items = [
    {
      quote: 'A Muthua não é uma agência. É a nossa operação de revenue inteira. Em 3 meses, mapeamos o funil, reduzimos o CAC em 38% e aumentamos a previsibilidade de receita de um jeito que nunca imaginamos ser possível.',
      name: 'Ricardo Mendes', role: 'Co-fundador', company: 'Fintech — SP',
      cls: 'tsm-feat', big: true,
    },
    {
      quote: 'Experimentos sistemáticos, dashboards claros e rastreamento de cada real investido. Finalmente entendemos onde estávamos errando.',
      name: 'Carla Duarte', role: 'Growth Lead', company: '',
      cls: 'tsm-wide', big: false,
    },
    {
      quote: 'Relatórios semanais que realmente fazem sentido. Zero achismo, 100% dados.',
      name: 'Ana Luiza', role: 'CMO', company: '',
      cls: '', big: false,
    },
    {
      quote: 'Em 6 meses, MRR cresceu 2,4×. A Muthua sabe exatamente o que faz.',
      name: 'Lucas Ferreira', role: 'CEO', company: '',
      cls: '', big: false,
    },
  ];

  const Av = ({ name }) => {
    const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2);
    const hue = (name.charCodeAt(0) * 47) % 360;
    return (
      <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: `hsl(${hue},38%,24%)`, border: '1px solid rgba(255,255,255,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>{initials}</span>
      </div>
    );
  };

  return (
    <div className="tsm-bento">
      {items.map((t, i) => (
        <div key={i} className={`reveal ${t.cls}`} style={{ background: s.dark, padding: t.big ? '52px 48px' : '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '28px' }}>
          <blockquote style={{ fontFamily: t.big ? s.serif : s.sans, fontSize: t.big ? 'clamp(16px,1.8vw,20px)' : '14px', fontWeight: t.big ? 400 : 300, color: 'rgba(255,255,255,0.72)', lineHeight: 1.6, margin: 0, flex: 1 }}>
            "{t.quote}"
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Av name={t.name} />
            <div>
              <div style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 600, color: '#fff' }}>{t.name}</div>
              <div style={{ fontFamily: s.sans, fontSize: '12px', color: 'rgba(255,255,255,0.32)' }}>
                {t.role}{t.company ? ` · ${t.company}` : ''}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── DEPOIMENTOS ─────────────────────────────────────────────── */
function Depoimentos() {
  return (
    <section id="depoimentos" style={{ background: s.dark, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '120px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', marginBottom: '80px' }}>
          <div>
            <div style={{ marginBottom: '28px' }}><AvatarGroup /></div>
            <SL text="Depoimentos" style={{ marginBottom: '20px' }} />
            <h2 className="reveal" style={{ fontFamily: s.serif, fontSize: 'clamp(28px,3.8vw,54px)', fontWeight: 300, color: '#fff', lineHeight: 1.1, letterSpacing: '-1.5px', margin: 0 }}>
              O que nossos clientes <em style={{ fontStyle: 'italic' }}>dizem</em>
            </h2>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <StackedTestimonials />
          </div>
        </div>
        <TestimonialsGrid />
      </div>
    </section>
  );
}

/* ─── PRICING ────────────────────────────────────────────────────── */
function Pricing() {
  const plans = [
    {
      name: 'Diagnóstico',
      desc: 'Para empresas que querem mapear e estruturar sua operação de receita do zero.',
      features: [
        'Mapeamento completo do funil',
        'Auditoria de CRM e dados',
        'Setup de rastreamento de campanhas',
        'Dashboard executivo mensal',
        '1 experimento de otimização/mês',
        'Suporte via Slack',
      ],
      cta: 'Começar Diagnóstico',
      popular: false,
    },
    {
      name: 'Aceleração',
      desc: 'Operação completa de Revenue com testes sistemáticos, automações e reporting contínuo.',
      features: [
        'Tudo do Diagnóstico',
        'Operação Revenue Ops completa',
        'Testes A/B e CRO sistemático',
        'Automações de marketing e vendas',
        'Lead scoring comportamental',
        '3 experimentos por mês',
        'Relatórios semanais',
      ],
      cta: 'Começar Aceleração',
      popular: true,
    },
    {
      name: 'Parceria Full',
      desc: 'Time dedicado, estratégia integrada e operação completa para máximo crescimento.',
      features: [
        'Tudo do Aceleração',
        'Time dedicado de Revenue Ops',
        'Planejamento estratégico trimestral',
        'Gestão de tráfego pago incluída',
        'Experimentos ilimitados por mês',
        'Integrações e custom builds',
        'Acesso direto ao time Muthua',
      ],
      cta: 'Falar com especialista',
      popular: false,
    },
  ];

  return (
    <section id="planos" style={{ background: s.dark, padding: '120px 60px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* header */}
        <div style={{ marginBottom: '64px' }}>
          <SL text="Planos" style={{ marginBottom: '20px' }} />
          <h2 className="reveal" style={{
            fontFamily: s.serif,
            fontSize: 'clamp(28px,3.8vw,54px)',
            fontWeight: 300,
            color: '#fff',
            lineHeight: 1.1,
            letterSpacing: '-1.5px',
            margin: 0,
            maxWidth: '440px',
          }}>
            Escolha a intensidade do seu{' '}
            <em style={{ fontStyle: 'italic' }}>crescimento</em>
          </h2>
        </div>

        {/* cards grid */}
        <div className="pricing-grid">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`reveal d${i + 1}${plan.popular ? ' pricing-popular' : ''}`}
              style={{
                background: plan.popular ? 'rgba(26,109,229,0.07)' : s.dark,
                padding: '44px 36px',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
              }}
            >
              {plan.popular && (
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  fontFamily: s.sans, fontSize: '9px', fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: '#fff', background: s.blue, padding: '5px 14px',
                }}>Popular</div>
              )}

              {/* plan name */}
              <div style={{ fontFamily: s.sans, fontSize: '10px', fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.32)', marginBottom: '28px' }}>
                {plan.name}
              </div>

              {/* desc */}
              <p style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.42)', lineHeight: 1.65, margin: '0 0 32px' }}>
                {plan.desc}
              </p>

              {/* features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', flex: 1, marginBottom: '36px' }}>
                {plan.features.map((f, fi) => (
                  <div key={fi} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{
                      width: '16px', height: '16px', borderRadius: '50%',
                      border: `1px solid rgba(26,109,229,${plan.popular ? 0.65 : 0.38})`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: '2px',
                    }}>
                      <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                        <path d="M1 3.5l1.7 1.7 3-3" stroke="#1A6DE5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontFamily: s.sans, fontSize: '13px', color: 'rgba(255,255,255,0.58)' }}>{f}</span>
                  </div>
                ))}
              </div>

              <PillBtn href={CALENDAR} solid={plan.popular}>{plan.cta}</PillBtn>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section id="contato" style={{ background: s.dark, padding: '140px 60px', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <GridLines />
      <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SL text="Pronto para crescer" style={{ marginBottom: '28px' }} />
        <h2 className="reveal" style={{ fontFamily: s.serif, fontSize: 'clamp(36px,6vw,92px)', fontWeight: 300, color: '#fff', lineHeight: 0.92, letterSpacing: '-2.5px', marginBottom: '48px' }}>
          Seu próximo{' '}
          <em style={{ fontStyle: 'italic', color: '#fff' }}>patamar</em>
          <br />começa agora.
        </h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <PillBtn href={CALENDAR} solid>Agendar diagnóstico gratuito</PillBtn>
          <span style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.25)' }}>60 minutos, sem compromisso</span>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ──────────────────────────────────────────────────── */
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
        <span style={{ fontFamily: s.serif, fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>Muthua</span>
        <div style={{ display: 'flex', gap: '32px' }}>
          {links.map(({ label, href }) => (
            <a key={label} href={href} style={{ fontFamily: s.sans, fontSize: '13px', color: 'rgba(255,255,255,0.22)', transition: 'color 0.2s', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.22)'}
            >{label}</a>
          ))}
        </div>
        <span style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.18)' }}>© {new Date().getFullYear()} Muthua</span>
      </div>
    </footer>
  );
}

/* ─── PAGE ────────────────────────────────────────────────────── */
export default function Home() {
  const [showLoader, setShowLoader] = useState(true);
  const [ready, setReady] = useState(false);

  const handleLoaderDone = useCallback(() => {
    setShowLoader(false);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ready]);

  return (
    <>
      <style>{css}</style>
      {showLoader && <LoadingScreen onDone={handleLoaderDone} />}
      <Nav />
      <Hero />
      <Benefits />
      <SocialProof />
      <ProofCards />
      <ScrollStatement />
      <Servicos />
      <Framework />
      <Parceria />
      <Ferramentas />
      <Depoimentos />
      <Pricing />
      <CTA />
      <Footer />
    </>
  );
}

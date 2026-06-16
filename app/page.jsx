'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
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
  @keyframes blobPop    { from{transform:scale(0.1);opacity:0} to{transform:scale(1);opacity:var(--bop,.38)} }
  @keyframes ab1m       { 0%,100%{transform:translate(0,0)} 50%{transform:translate(7%,9%)} }
  @keyframes ab2m       { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-9%,5%)} }
  @keyframes ab3m       { 0%,100%{transform:translate(0,0)} 50%{transform:translate(5%,-8%)} }
  @keyframes ab4m       { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-6%,7%)} }
  @keyframes ltrIn      { to{opacity:1;transform:translateY(0)} }
  @keyframes lineExp    { to{width:clamp(110px,18vw,200px)} }
  @keyframes lFdIn      { to{opacity:1} }
  @keyframes drawStroke { to{stroke-dashoffset:0} }

  /* ── aurora ───────────────────────────────────────────────── */
  .ab { position:absolute; border-radius:50%; filter:blur(120px); pointer-events:none; }
  .ab1 { width:clamp(280px,46vw,580px); height:clamp(280px,46vw,580px); background:#103FEA; --bop:.38; top:-8%; left:-5%; animation:ab1m 15s ease-in-out infinite; }
  .ab2 { width:clamp(240px,38vw,500px); height:clamp(240px,38vw,500px); background:#7B2FF7; --bop:.3;  top:22%; right:-8%; animation:ab2m 19s ease-in-out infinite; }
  .ab3 { width:clamp(200px,32vw,440px); height:clamp(200px,32vw,440px); background:#06B6D4; --bop:.25; bottom:4%; left:18%; animation:ab3m 13s ease-in-out infinite; }
  .ab4 { width:clamp(160px,22vw,300px); height:clamp(160px,22vw,300px); background:#EC4899; --bop:.18; top:52%; right:22%; animation:ab4m 22s ease-in-out infinite; }

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
  .btn-pill { display:inline-flex; align-items:center; gap:14px; font-family:Inter,sans-serif; font-size:14px; font-weight:600; color:#fff; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.14); border-radius:999px; padding:10px 10px 10px 28px; text-decoration:none; transition:background .25s,border-color .25s; white-space:nowrap; }
  .btn-pill:hover { background:rgba(255,255,255,.1); border-color:rgba(255,255,255,.3); }
  .pill-circle { width:34px; height:34px; border-radius:50%; background:linear-gradient(135deg,#103FEA 0%,#1A6DE5 100%); display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
  .btn-pill-solid { background:linear-gradient(135deg,#103FEA 0%,#1A6DE5 100%); border-color:transparent; padding:12px 12px 12px 30px; font-size:15px; }
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

  const blobs = [
    { c: '#103FEA', w: 500, style: { top: '-15%', left: '-8%' },   delay: 0   },
    { c: '#7B2FF7', w: 420, style: { top: '20%',  right: '-8%' },  delay: 0.2 },
    { c: '#06B6D4', w: 360, style: { bottom: '-5%', left: '15%' }, delay: 0.4 },
  ];

  return (
    <div className={`loader${exiting ? ' exit' : ''}`}>
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', width: b.w, height: b.w, borderRadius: '50%',
          background: b.c, filter: 'blur(110px)',
          animation: `blobPop 1.3s cubic-bezier(.22,1,.36,1) ${b.delay}s both`,
          ...b.style,
        }} />
      ))}
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

/* ─── AURORA BG ───────────────────────────────────────────────── */
function AuroraBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <div className="ab ab1" /><div className="ab ab2" />
      <div className="ab ab3" /><div className="ab ab4" />
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
      {/* Hero image */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
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
            <h1 style={{ fontFamily: s.serif, fontSize: 'clamp(40px,5.5vw,80px)', fontWeight: 700, color: '#fff', lineHeight: 0.94, letterSpacing: '-2px', margin: 0 }}>
              Crescimento<br />
              <em style={{ fontStyle: 'italic', background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>previsível.</em>
            </h1>
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
              <strong style={{ fontWeight: 700 }}>elimina o desperdício</strong>
              {' '}e transforma sua operação em crescimento previsível e escalável.
            </h2>
            <PillBtn href={CALENDAR} className="reveal d1">Falar com especialista</PillBtn>
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
              <div style={{ fontFamily: s.serif, fontSize: 'clamp(48px,5vw,72px)', fontWeight: 700, background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '12px' }}>
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
              <strong style={{ fontWeight: 700 }}>construir revenue.</strong>
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
                <span style={{ fontFamily: s.serif, fontSize: 'clamp(36px,4vw,58px)', fontWeight: 700, lineHeight: 1, background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{p.num}</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: s.sans, fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.tipo}</div>
                  {p.badge && <div style={{ fontFamily: s.sans, fontSize: '9px', fontWeight: 700, color: '#fff', background: s.grad, padding: '2px 8px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '5px', display: 'inline-block' }}>{p.badge}</div>}
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
            <DashboardMockup />
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
            <strong style={{ fontWeight: 700 }}>Um resultado.</strong>
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
              <div style={{ fontFamily: s.serif, fontSize: 'clamp(44px,5vw,68px)', fontWeight: 700, lineHeight: 0.9, background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '18px' }}>{st.letter}</div>
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
            <strong style={{ fontWeight: 700 }}>crescimento contínuo.</strong>
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
              <div style={{ fontFamily: s.serif, fontSize: 'clamp(36px,3.5vw,52px)', fontWeight: 700, background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '20px' }}>{st.n}</div>
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

/* ─── CTA ─────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section id="contato" style={{ background: s.dark, padding: '140px 60px', position: 'relative', overflow: 'hidden', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <AuroraBg />
      <GridLines />
      <div style={{ maxWidth: '960px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <SL text="Pronto para crescer" style={{ marginBottom: '28px' }} />
        <h2 className="reveal" style={{ fontFamily: s.serif, fontSize: 'clamp(36px,6vw,92px)', fontWeight: 700, color: '#fff', lineHeight: 0.92, letterSpacing: '-2.5px', marginBottom: '48px' }}>
          Seu próximo{' '}
          <em style={{ fontStyle: 'italic', background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>patamar</em>
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
      <ProofCards />
      <Servicos />
      <Framework />
      <Parceria />
      <Ferramentas />
      <CTA />
      <Footer />
    </>
  );
}

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  /* ── keyframes ───────────────────────────────────────────────── */
  @keyframes marquee  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(44px)} to{opacity:1;transform:translateY(0)} }
  @keyframes dashFlt  {
    0%,100%{transform:perspective(1100px) rotateY(-7deg) rotateX(2deg) translateY(0)}
    50%    {transform:perspective(1100px) rotateY(-7deg) rotateX(2deg) translateY(-14px)}
  }
  @keyframes blobPop  { from{transform:scale(0.1);opacity:0} to{transform:scale(1);opacity:var(--bop,0.38)} }
  @keyframes ab1m { 0%,100%{transform:translate(0,0)} 50%{transform:translate(7%,9%)} }
  @keyframes ab2m { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-9%,5%)} }
  @keyframes ab3m { 0%,100%{transform:translate(0,0)} 50%{transform:translate(5%,-8%)} }
  @keyframes ab4m { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-6%,7%)} }
  @keyframes ltrIn  { to{opacity:1;transform:translateY(0)} }
  @keyframes lineExp{ to{width:clamp(110px,18vw,200px)} }
  @keyframes lFdIn  { to{opacity:1} }
  @keyframes drawStroke { to { stroke-dashoffset: 0; } }

  /* ── aurora blobs ─────────────────────────────────────────────── */
  .ab { position:absolute; border-radius:50%; filter:blur(120px); pointer-events:none; }
  .ab1 { width:clamp(280px,46vw,580px); height:clamp(280px,46vw,580px); background:#103FEA; --bop:0.38; top:-8%; left:-5%; animation:ab1m 15s ease-in-out infinite; }
  .ab2 { width:clamp(240px,38vw,500px); height:clamp(240px,38vw,500px); background:#7B2FF7; --bop:0.3;  top:22%; right:-8%; animation:ab2m 19s ease-in-out infinite; }
  .ab3 { width:clamp(200px,32vw,440px); height:clamp(200px,32vw,440px); background:#06B6D4; --bop:0.25; bottom:4%; left:18%; animation:ab3m 13s ease-in-out infinite; }
  .ab4 { width:clamp(160px,22vw,300px); height:clamp(160px,22vw,300px); background:#EC4899; --bop:0.18; top:52%; right:22%; animation:ab4m 22s ease-in-out infinite; }

  /* ── loader ───────────────────────────────────────────────────── */
  .loader { position:fixed; inset:0; z-index:9999; background:#030508; display:flex; align-items:center; justify-content:center; overflow:hidden; transition:transform 0.85s cubic-bezier(0.76,0,0.24,1); }
  .loader.exit { transform:translateY(-100%); }
  .ltr { font-family:Fraunces,serif; font-weight:700; color:#fff; opacity:0; transform:translateY(22px); display:inline-block; animation:ltrIn 0.55s cubic-bezier(0.22,1,0.36,1) forwards; }
  .lline { width:0; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent); margin:22px auto; animation:lineExp 0.8s cubic-bezier(0.22,1,0.36,1) 0.56s forwards; }
  .lsub  { opacity:0; font-family:Inter,sans-serif; font-size:11px; letter-spacing:0.2em; color:rgba(255,255,255,0.35); text-transform:uppercase; animation:lFdIn 0.6s ease 1.15s forwards; }

  /* ── reveal ───────────────────────────────────────────────────── */
  .reveal { opacity:0; transform:translateY(44px); transition:opacity 0.82s cubic-bezier(0.22,1,0.36,1), transform 0.82s cubic-bezier(0.22,1,0.36,1); }
  .reveal.in { opacity:1; transform:translateY(0); }
  .d1{transition-delay:.1s} .d2{transition-delay:.22s} .d3{transition-delay:.34s} .d4{transition-delay:.46s}

  /* ── hero ─────────────────────────────────────────────────────── */
  .hero-inner { display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:center; }

  /* ── bento ────────────────────────────────────────────────────── */
  .bento-wrap { display:grid; grid-template-columns:1fr 2fr 1fr; gap:1px; background:rgba(255,255,255,0.08); }
  .bento-tile { background:#030508; }
  .bento-dash { grid-row:1/3; grid-column:2; display:flex; align-items:center; justify-content:center; padding:52px 32px; }
  .bento-cta  { background:rgba(16,63,234,0.08); }

  /* ── services ─────────────────────────────────────────────────── */
  .svc-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; background:rgba(255,255,255,0.07); }
  .svc-card { background:#030508; padding:52px 36px 48px; transition:background 0.3s; }
  .svc-card:hover { background:#060b14; }

  /* ── acelera ──────────────────────────────────────────────────── */
  .acelera-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:1px; background:rgba(255,255,255,0.07); }
  .acelera-cell { background:#030508; padding:40px 20px 36px; transition:background 0.25s; }
  .acelera-cell:hover { background:#06090f; }

  /* ── process ──────────────────────────────────────────────────── */
  .proc-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; background:rgba(255,255,255,0.07); }
  .proc-cell { background:#080c12; padding:56px 48px; }

  /* ── utils ────────────────────────────────────────────────────── */
  .pill { display:inline-block; font-family:Inter,sans-serif; font-size:11px; font-weight:500; color:rgba(255,255,255,0.32); border:1px solid rgba(255,255,255,0.1); padding:3px 10px; margin:3px 3px 3px 0; }
  .btn-primary { display:inline-block; font-family:Inter,sans-serif; font-size:14px; font-weight:600; color:#fff; background:linear-gradient(135deg,#103FEA 0%,#1A6DE5 60%,#0a2fa8 100%); padding:14px 32px; text-decoration:none; transition:opacity .2s,transform .2s; white-space:nowrap; }
  .btn-primary:hover { opacity:.82; transform:translateY(-2px); }
  .btn-primary-sm { display:inline-block; font-family:Inter,sans-serif; font-size:12px; font-weight:600; color:#fff; background:linear-gradient(135deg,#103FEA 0%,#1A6DE5 60%,#0a2fa8 100%); padding:11px 22px; text-decoration:none; transition:opacity .2s,transform .2s; white-space:nowrap; }
  .btn-primary-sm:hover { opacity:.82; transform:translateY(-2px); }
  .btn-ghost { display:inline-block; font-family:Inter,sans-serif; font-size:13px; font-weight:500; color:rgba(255,255,255,.45); border-bottom:1px solid rgba(255,255,255,.18); padding-bottom:2px; text-decoration:none; transition:color .2s,border-color .2s; }
  .btn-ghost:hover { color:#fff; border-color:rgba(255,255,255,.55); }

  /* ── manifesto ────────────────────────────────────────────────── */
  .mfst-grid { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start; }

  /* ── svc mini-vis ─────────────────────────────────────────────── */
  .svc-vis-line { stroke-dasharray:300; stroke-dashoffset:300; }
  .svc-card:hover .svc-vis-line { animation:drawStroke 1s cubic-bezier(0.22,1,0.36,1) forwards; }

  /* ── responsive ───────────────────────────────────────────────── */
  @media(max-width:960px) {
    .hero-inner   { grid-template-columns:1fr!important; gap:48px!important; }
    .bento-wrap   { grid-template-columns:1fr!important; }
    .bento-dash   { grid-row:auto!important; grid-column:auto!important; }
    .svc-grid     { grid-template-columns:1fr!important; }
    .acelera-grid { grid-template-columns:repeat(3,1fr)!important; }
    .proc-grid    { grid-template-columns:1fr!important; }
    .mfst-grid    { grid-template-columns:1fr!important; gap:40px!important; }
  }
  @media(max-width:640px) {
    .svc-card  { padding:36px 22px!important; }
    .proc-cell { padding:40px 24px!important; }
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
    { c: '#103FEA', w: 500, style: { top: '-15%', left: '-8%' },  delay: 0 },
    { c: '#7B2FF7', w: 420, style: { top: '20%',  right: '-8%' }, delay: 0.2 },
    { c: '#06B6D4', w: 360, style: { bottom: '-5%', left: '15%' },delay: 0.4 },
  ];

  return (
    <div className={`loader${exiting ? ' exit' : ''}`}>
      {blobs.map((b, i) => (
        <div key={i} style={{
          position: 'absolute', width: b.w, height: b.w, borderRadius: '50%',
          background: b.c, filter: 'blur(110px)',
          animation: `blobPop 1.3s cubic-bezier(0.22,1,0.36,1) ${b.delay}s both`,
          ...b.style,
        }} />
      ))}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div style={{ letterSpacing: '-3px' }}>
          {'MUTUA'.split('').map((l, i) => (
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
      <div className="ab ab1" />
      <div className="ab ab2" />
      <div className="ab ab3" />
      <div className="ab ab4" />
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

/* ─── MINI CHARTS (bento stats) ──────────────────────────────── */
function FunnelBars() {
  return (
    <div style={{ marginTop: '20px' }}>
      {[['Visitantes',100],['Leads',68],['MQLs',30],['Clientes',11]].map(([l,w],i) => (
        <div key={i} style={{ marginBottom: '6px' }}>
          <div style={{ width: `${w}%`, height: '16px', background: `rgba(26,109,229,${0.14+i*0.06})`, borderLeft: '2px solid rgba(26,109,229,0.5)' }} />
          <div style={{ fontFamily: s.sans, fontSize: '9px', color: 'rgba(255,255,255,0.2)', marginTop: '1px' }}>{l}</div>
        </div>
      ))}
    </div>
  );
}

function TrendLine() {
  return (
    <svg viewBox="0 0 220 60" style={{ width: '100%', marginTop: '20px' }}>
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
    <svg viewBox="0 0 100 72" style={{ width: '70%', marginTop: '16px' }}>
      <rect x="6"  y={68-62} width="32" height="62" fill="rgba(255,255,255,0.09)" rx="2" />
      <rect x="56" y={68-37} width="32" height="37" fill="#1A6DE5" rx="2" />
      <text x="22"  y="72" fontFamily="Inter,sans-serif" fontSize="7" fill="rgba(255,255,255,0.22)" textAnchor="middle">Antes</text>
      <text x="72"  y="72" fontFamily="Inter,sans-serif" fontSize="7" fill="rgba(255,255,255,0.22)" textAnchor="middle">Depois</text>
      <text x="90"  y={68-37} fontFamily="Inter,sans-serif" fontSize="8" fill="#1A6DE5">-40%</text>
    </svg>
  );
}

/* ─── SERVICE MINI VISUALS ────────────────────────────────────── */
function FunnelIcon() {
  return (
    <svg viewBox="0 0 64 48" width="64" style={{ opacity: 0.45, marginBottom: '20px' }}>
      <rect x="0" y="0"  width="64" height="10" fill="#1A6DE5" rx="2" />
      <rect x="8" y="14" width="48" height="9"  fill="rgba(26,109,229,0.7)" rx="2" />
      <rect x="18" y="27" width="28" height="8"  fill="rgba(26,109,229,0.5)" rx="2" />
      <rect x="26" y="39" width="12" height="7"  fill="rgba(26,109,229,0.3)" rx="2" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 64 40" width="64" style={{ opacity: 0.45, marginBottom: '20px' }}>
      <polyline points="0,36 16,28 32,18 48,10 64,3" fill="none" stroke="#1A6DE5" strokeWidth="2.5" strokeLinecap="round" className="svc-vis-line" />
      {[[0,36],[16,28],[32,18],[48,10],[64,3]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="3" fill="#1A6DE5" opacity="0.9" />)}
    </svg>
  );
}

function NodeIcon() {
  return (
    <svg viewBox="0 0 64 48" width="64" style={{ opacity: 0.45, marginBottom: '20px' }}>
      <line x1="32" y1="24" x2="8"  y2="8"  stroke="rgba(26,109,229,0.4)" strokeWidth="1" />
      <line x1="32" y1="24" x2="56" y2="8"  stroke="rgba(26,109,229,0.4)" strokeWidth="1" />
      <line x1="32" y1="24" x2="8"  y2="40" stroke="rgba(26,109,229,0.4)" strokeWidth="1" />
      <line x1="32" y1="24" x2="56" y2="40" stroke="rgba(26,109,229,0.4)" strokeWidth="1" />
      <circle cx="32" cy="24" r="7" fill="rgba(26,109,229,0.3)" stroke="#1A6DE5" strokeWidth="1.5" />
      {[[8,8],[56,8],[8,40],[56,40]].map(([cx,cy],i) => <circle key={i} cx={cx} cy={cy} r="4" fill="rgba(26,109,229,0.2)" stroke="rgba(26,109,229,0.5)" strokeWidth="1" />)}
    </svg>
  );
}

/* ─── GRAFISMOS ───────────────────────────────────────────────── */
function DotGrid() {
  const dots = [];
  for (let r = 0; r < 8; r++)
    for (let c = 0; c < 12; c++)
      dots.push(<circle key={`${r}-${c}`} cx={c*20+10} cy={r*20+10} r="1.2" fill="white" />);
  return (
    <svg viewBox="0 0 240 160" style={{ position: 'absolute', right: '3%', top: '16%', width: '190px', opacity: 0.07, pointerEvents: 'none', zIndex: 1 }} aria-hidden>
      {dots}
    </svg>
  );
}

function GridLines() {
  const lines = [];
  for (let i = 0; i <= 9; i++) {
    lines.push(<line key={`h${i}`} x1="0" y1={i*40} x2="360" y2={i*40} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />);
    lines.push(<line key={`v${i}`} x1={i*40} y1="0" x2={i*40} y2="360" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />);
  }
  return (
    <svg viewBox="0 0 360 360" style={{ position: 'absolute', left: 0, bottom: 0, width: '420px', pointerEvents: 'none' }} aria-hidden>
      {lines}
    </svg>
  );
}

/* ─── HERO ────────────────────────────────────────────────────── */
function Hero() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = (e) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX-left)/width)*100}%`);
      el.style.setProperty('--my', `${((e.clientY-top)/height)*100}%`);
    };
    el.addEventListener('mousemove', fn);
    return () => el.removeEventListener('mousemove', fn);
  }, []);

  return (
    <section ref={ref} style={{ minHeight: '100dvh', background: s.dark, display: 'grid', gridTemplateRows: 'auto 1fr auto', padding: '0 60px 56px', position: 'relative', overflow: 'hidden' }}>
      <AuroraBg />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle 600px at var(--mx,75%) var(--my,60%), rgba(255,255,255,0.025) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 1 }} />
      <DotGrid />

      <div style={{ paddingTop: '104px', fontFamily: s.sans, fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', position: 'relative', zIndex: 2, animation: 'fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s both' }}>
        Revenue Operations &amp; Growth Intelligence
      </div>

      <div className="hero-inner" style={{ position: 'relative', zIndex: 2, paddingTop: '32px', paddingBottom: '32px' }}>
        <div style={{ animation: 'fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.28s both' }}>
          <h1 style={{ fontFamily: s.serif, fontSize: 'clamp(56px,7.5vw,120px)', fontWeight: 700, lineHeight: 0.92, letterSpacing: '-3px', color: '#fff', margin: '0 0 28px' }}>
            Crescimento<br />
            <span style={{ background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>previsível.</span>
          </h1>
          <p style={{ fontFamily: s.sans, fontSize: '16px', fontWeight: 300, color: 'rgba(255,255,255,0.42)', lineHeight: 1.72, margin: '0 0 40px', maxWidth: '380px' }}>
            Revenue Ops que transforma funis e métricas em crescimento real e escalável para o seu negócio.
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href={CALENDAR} target="_blank" rel="noopener noreferrer" className="btn-primary">Agendar diagnóstico gratuito</a>
            <a href="#servicos" className="btn-ghost">Ver serviços</a>
          </div>
        </div>
        <div style={{ animation: 'fadeUp 0.95s cubic-bezier(0.22,1,0.36,1) 0.45s both' }}>
          <DashboardMockup />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap', paddingTop: '36px', borderTop: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 2, animation: 'fadeUp 0.85s cubic-bezier(0.22,1,0.36,1) 0.6s both' }}>
        {['Dados rastreados', 'Funil mapeado', 'Crescimento mensurável'].map((t,i) => (
          <span key={i} style={{ fontFamily: s.sans, fontSize: '12px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.06em' }}>{t}</span>
        ))}
      </div>
    </section>
  );
}

/* ─── BENTO STATS ─────────────────────────────────────────────── */
function BentoStats() {
  const n = (txt, small) => (
    <div style={{ fontFamily: s.serif, fontSize: small ? 'clamp(44px,5vw,72px)' : 'clamp(52px,6.5vw,88px)', fontWeight: 700, background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: '10px' }}>{txt}</div>
  );
  return (
    <section style={{ background: s.dark, padding: '0 60px 80px' }}>
      <div className="bento-wrap reveal" style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* col 1 row 1 — stat 67% */}
        <div className="bento-tile" style={{ padding: '52px 40px' }}>
          {n('67%')}
          <p style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, margin: 0 }}>das empresas perdem receita por gaps no funil nunca mapeados</p>
          <FunnelBars />
        </div>

        {/* col 2 row 1-2 — dashboard */}
        <div className="bento-tile bento-dash">
          <DashboardMockup />
        </div>

        {/* col 3 row 1 — quote */}
        <div className="bento-tile" style={{ padding: '52px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: s.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(20px,2.2vw,28px)', color: '#fff', lineHeight: 1.2, margin: '0 0 16px', letterSpacing: '-0.3px' }}>
            "Tratamos crescimento como engenharia."
          </p>
          <p style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.36)', lineHeight: 1.65, margin: 0 }}>
            Dados rastreados, funis mapeados, experimentos medidos.
          </p>
        </div>

        {/* col 1 row 2 — stat 3x */}
        <div className="bento-tile" style={{ padding: '52px 40px' }}>
          {n('3×')}
          <p style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, margin: 0 }}>mais previsibilidade com Revenue Ops vs. marketing tradicional</p>
          <TrendLine />
        </div>

        {/* col 3 row 2 — stat 40% + mini CTA */}
        <div className="bento-tile bento-cta" style={{ padding: '52px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {n('40%', true)}
            <p style={{ fontFamily: s.sans, fontSize: '13px', fontWeight: 300, color: 'rgba(255,255,255,0.38)', lineHeight: 1.65, margin: 0 }}>do CAC desperdiçado por falta de rastreamento adequado</p>
            <CACCompareBars />
          </div>
          <a href={CALENDAR} target="_blank" rel="noopener noreferrer" className="btn-primary-sm" style={{ marginTop: '24px', alignSelf: 'flex-start' }}>
            Diagnóstico gratuito →
          </a>
        </div>

      </div>
    </section>
  );
}

/* ─── MANIFESTO ───────────────────────────────────────────────── */
function Manifesto() {
  return (
    <section style={{ background: '#F0EFE9', padding: '120px 60px', position: 'relative', overflow: 'hidden' }}>
      {/* decorative concentric rings */}
      <svg viewBox="0 0 400 400" style={{ position: 'absolute', right: '-80px', top: '-80px', width: '440px', opacity: 0.08, pointerEvents: 'none' }} aria-hidden>
        {[20,60,104,154,210,272].map((r,i) => <circle key={i} cx="200" cy="200" r={r} fill="none" stroke="#0a0c10" strokeWidth="1" />)}
      </svg>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="mfst-grid">
          <div>
            <p className="reveal" style={{ fontFamily: s.serif, fontStyle: 'italic', fontWeight: 700, fontSize: 'clamp(36px,4.5vw,62px)', lineHeight: 1.08, color: '#0a0c10', margin: '0 0 40px', letterSpacing: '-1px' }}>
              Não somos uma agência de marketing.
            </p>
            <div style={{ width: '48px', height: '2px', background: s.grad, marginBottom: '32px' }} />
            <p className="reveal d1" style={{ fontFamily: s.sans, fontSize: '17px', color: 'rgba(10,12,16,0.58)', lineHeight: 1.78, margin: 0 }}>
              Somos uma operação de Revenue Ops. Tratamos crescimento como engenharia: dados rastreados, funis mapeados, experimentos medidos.
            </p>
          </div>
          <div style={{ paddingTop: '8px' }}>
            <p className="reveal d2" style={{ fontFamily: s.sans, fontSize: '17px', color: 'rgba(10,12,16,0.58)', lineHeight: 1.78, margin: '0 0 40px' }}>
              Resultado previsível, não obra do acaso. Cada real investido em marketing passa a ter uma resposta mensurável e auditável.
            </p>
            {/* visual data art */}
            <div className="reveal d3" style={{ background: 'rgba(10,12,16,0.05)', border: '1px solid rgba(10,12,16,0.08)', borderRadius: '12px', padding: '28px 24px' }}>
              <div style={{ fontFamily: s.sans, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(10,12,16,0.35)', marginBottom: '18px' }}>Pipeline de Receita — Antes vs. Depois</div>
              {[['Aquisição','Sem rastreamento → Rastreamento completo',82],['Conversão','Taxa aleatória → CRO sistemático',67],['Retenção','Reativa → Proativa',91]].map(([label,desc,pct],i) => (
                <div key={i} style={{ marginBottom: i < 2 ? '16px' : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontFamily: s.sans, fontSize: '11px', fontWeight: 600, color: 'rgba(10,12,16,0.6)' }}>{label}</span>
                    <span style={{ fontFamily: s.sans, fontSize: '11px', color: s.blue, fontWeight: 500 }}>+{pct}%</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(10,12,16,0.08)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: s.grad, borderRadius: '2px' }} />
                  </div>
                  <div style={{ fontFamily: s.sans, fontSize: '10px', color: 'rgba(10,12,16,0.4)', marginTop: '4px' }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SERVIÇOS ────────────────────────────────────────────────── */
function Servicos() {
  const planos = [
    {
      num: '01', name: 'Funnel Audit', tipo: 'Projeto único',
      headline: 'Descubra onde você está perdendo receita',
      desc: 'Mapeamos cada etapa do seu funil, identificamos os pontos de vazamento e entregamos um plano de ação para os próximos 90 dias.',
      pills: ['Mapeamento de funil','Análise de tracking','Relatório de gaps','Plano 90 dias'],
      icon: <FunnelIcon />,
    },
    {
      num: '02', name: 'Growth Operations', tipo: 'Mensalidade', badge: 'Mais escolhido',
      headline: 'Um time de Revenue Ops dedicado à sua empresa',
      desc: 'A Mutua age como seu time interno de Revenue Ops — executando experimentos, otimizando funil e entregando relatórios executivos todo mês.',
      pills: ['Execução contínua','Experiments mensais','Dashboard em tempo real','Revisões semanais'],
      icon: <TrendIcon />,
    },
    {
      num: '03', name: 'AI Systems', tipo: 'Projeto',
      headline: 'Automatize e escale sem aumentar o time',
      desc: 'Implementamos sistemas de automação e IA que qualificam leads, nutrem prospects e integram seu stack — sem precisar contratar mais ninguém.',
      pills: ['Qualificação com IA','Nurturing automático','Integrações de stack'],
      icon: <NodeIcon />,
    },
  ];

  return (
    <section id="servicos" style={{ background: s.dark, padding: '100px 60px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto 52px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 className="reveal" style={{ fontFamily: s.serif, fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: '#fff', lineHeight: 1.05, margin: 0, letterSpacing: '-1px' }}>O que oferecemos</h2>
        <a href={CALENDAR} target="_blank" rel="noopener noreferrer" className="btn-ghost reveal d1">Falar com especialista</a>
      </div>
      <div className="svc-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {planos.map((p,i) => (
          <div key={i} className={`svc-card reveal d${i+1}`}>
            {p.icon}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span style={{ fontFamily: s.serif, fontSize: 'clamp(40px,4.5vw,64px)', fontWeight: 700, lineHeight: 1, background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{p.num}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: s.sans, fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{p.tipo}</div>
                {p.badge && <div style={{ fontFamily: s.sans, fontSize: '9px', fontWeight: 700, color: '#fff', background: s.grad, padding: '2px 8px', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '5px', display: 'inline-block' }}>{p.badge}</div>}
              </div>
            </div>
            <div style={{ fontFamily: s.sans, fontSize: '11px', fontWeight: 500, color: s.blue, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>{p.name}</div>
            <h3 style={{ fontFamily: s.serif, fontSize: 'clamp(20px,2vw,27px)', fontWeight: 700, color: '#fff', lineHeight: 1.2, letterSpacing: '-0.3px', margin: '0 0 14px' }}>{p.headline}</h3>
            <p style={{ fontFamily: s.sans, fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.44)', lineHeight: 1.72, margin: '0 0 22px' }}>{p.desc}</p>
            <div style={{ marginBottom: '28px' }}>{p.pills.map(pill => <span key={pill} className="pill">{pill}</span>)}</div>
            <a href={CALENDAR} target="_blank" rel="noopener noreferrer" className="btn-ghost">Agendar conversa →</a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── FRAMEWORK ───────────────────────────────────────────────── */
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
    <section id="metodologia" style={{ background: s.dark, padding: '100px 60px 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto 52px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h2 className="reveal" style={{ fontFamily: s.serif, fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: '#fff', lineHeight: 1.05, margin: 0, letterSpacing: '-1px' }}>Framework<br />A.C.E.L.E.R.A</h2>
        <p style={{ fontFamily: s.sans, fontSize: '14px', fontWeight: 300, color: 'rgba(255,255,255,0.32)', maxWidth: '260px', lineHeight: 1.6, margin: 0, textAlign: 'right' }}>Sete camadas integradas cobrindo todo o ciclo de receita.</p>
      </div>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="acelera-grid">
          {steps.map((st,i) => (
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

/* ─── PARCERIA ────────────────────────────────────────────────── */
function Parceria() {
  const steps = [
    { n:'01', title:'Diagnóstico',   desc:'Mapeamos seu funil atual, dados disponíveis e principais oportunidades em uma reunião de 60 minutos.' },
    { n:'02', title:'Estratégia',    desc:'Montamos o plano de Revenue Ops adaptado ao seu momento, recursos e metas de crescimento.' },
    { n:'03', title:'Implementação', desc:'Executamos as mudanças, configuramos o tracking e lançamos os primeiros experimentos de crescimento.' },
    { n:'04', title:'Resultados',    desc:'Revisões semanais com métricas reais, ajustes rápidos e relatórios executivos mensais.' },
  ];
  return (
    <section id="parceria" style={{ background: s.mid, padding: '100px 60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="reveal" style={{ fontFamily: s.serif, fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: '#fff', lineHeight: 1.05, letterSpacing: '-1px', marginBottom: '60px' }}>
          Do diagnóstico ao<br />crescimento contínuo
        </h2>
        <div className="proc-grid">
          {steps.map((st,i) => (
            <div key={i} className={`proc-cell reveal d${(i%2)+1}`}>
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
          {[...tools,...tools].map((t,i) => (
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
      <div style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h2 className="reveal" style={{ fontFamily: s.serif, fontSize: 'clamp(40px,6.5vw,96px)', fontWeight: 700, color: '#fff', lineHeight: 0.92, letterSpacing: '-2.5px', marginBottom: '48px' }}>
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

/* ─── FOOTER ──────────────────────────────────────────────────── */
function Footer() {
  const links = [
    { label:'Metodologia', href:'#metodologia' },
    { label:'Serviços',    href:'#servicos' },
    { label:'Parceria',    href:'#parceria' },
    { label:'Contato',     href:'#contato' },
  ];
  return (
    <footer style={{ background: '#010305', padding: '40px 60px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <span style={{ fontFamily: s.serif, fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.3)' }}>Mutua</span>
        <div style={{ display: 'flex', gap: '32px' }}>
          {links.map(({ label, href }) => (
            <a key={label} href={href} style={{ fontFamily: s.sans, fontSize: '13px', color: 'rgba(255,255,255,0.22)', transition: 'color 0.2s', textDecoration: 'none' }}
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
      <BentoStats />
      <Manifesto />
      <Servicos />
      <Framework />
      <Parceria />
      <Ferramentas />
      <CTA />
      <Footer />
    </>
  );
}

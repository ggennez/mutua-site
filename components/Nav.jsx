'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/#metodologia', label: 'Metodologia' },
    { href: '/#servicos', label: 'Serviços' },
    { href: '/#parceria', label: 'Parceria' },
    { href: '/calculadora', label: 'Calculadora' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '0 40px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: scrolled ? 'rgba(6,13,13,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
      transition: 'all 0.3s',
    }}>
      <Link href="/" style={{
        fontFamily: 'Fraunces, serif',
        fontSize: '22px',
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '-0.5px',
      }}>
        Muthua
      </Link>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.75)',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.target.style.color = '#fff'}
          onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.75)'}
          >
            {l.label}
          </Link>
        ))}
        <a
          href="https://calendar.app.google/MfDV2fPTurR6msid6"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            color: '#fff',
            background: 'linear-gradient(135deg,#103FEA 0%,#1A6DE5 60%,#0a2fa8 100%)',
            padding: '10px 22px',
            transition: 'opacity 0.2s',
            textDecoration: 'none',
          }}
          onMouseEnter={e => e.target.style.opacity = '0.85'}
          onMouseLeave={e => e.target.style.opacity = '1'}
        >
          Falar com especialista
        </a>
      </div>
    </nav>
  );
}

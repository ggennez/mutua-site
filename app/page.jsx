'use client';

import Nav from '../components/Nav';
import Link from 'next/link';

const s = {
  blue: '#1A6DE5',
  blue2: '#103FEA',
  dark: '#060D0D',
  cream: '#FFFDF3',
  gray: '#E5E5E5',
  grad: 'linear-gradient(135deg,#103FEA 0%,#1A6DE5 60%,#0a2fa8 100%)',
  serif: 'Fraunces, serif',
  sans: 'Inter, sans-serif',
};

/* ─── shared components ─────────────────────────────────── */

function Badge({ children }) {
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: s.sans,
      fontSize: '11px',
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: s.blue,
      background: 'rgba(26,109,229,0.1)',
      padding: '5px 12px',
      marginBottom: '20px',
    }}>
      {children}
    </span>
  );
}

function SectionTitle({ children, light }) {
  return (
    <h2 style={{
      fontFamily: s.serif,
      fontSize: 'clamp(32px,4vw,52px)',
      fontWeight: 700,
      lineHeight: 1.1,
      color: light ? '#fff' : s.dark,
      marginBottom: '20px',
    }}>
      {children}
    </h2>
  );
}

/* ─── HERO ──────────────────────────────────────────────── */
function Hero() {
  return (
    <section style={{
      minHeight: '100dvh',
      background: s.dark,
      display: 'flex',
      alignItems: 'center',
      padding: '120px 40px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '55vw',
        height: '100%',
        background: 'radial-gradient(ellipse at 70% 40%, rgba(16,63,234,0.18) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', position: 'relative' }}>
        <Badge>Revenue Operations & Growth Intelligence</Badge>

        <h1 style={{
          fontFamily: s.serif,
          fontSize: 'clamp(44px,6vw,80px)',
          fontWeight: 700,
          lineHeight: 1.05,
          color: '#fff',
          marginBottom: '28px',
          letterSpacing: '-1px',
          maxWidth: '800px',
        }}>
          Crescimento previsível.<br />
          <span style={{ background: s.grad, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Resultado mensurável.
          </span>
        </h1>

        <p style={{
          fontFamily: s.sans,
          fontSize: '18px',
          color: 'rgba(255,255,255,0.6)',
          maxWidth: '480px',
          lineHeight: 1.7,
          marginBottom: '48px',
        }}>
          Não somos uma agência de marketing. Somos Revenue Ops, transformando funis e métricas em crescimento previsível.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Link
            href="#contato"
            style={{
              fontFamily: s.sans,
              fontSize: '15px',
              fontWeight: 600,
              color: '#fff',
              background: s.grad,
              padding: '16px 36px',
              display: 'inline-block',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Diagnóstico gratuito
          </Link>

          <Link
            href="#metodologia"
            style={{
              fontFamily: s.sans,
              fontSize: '15px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '16px 36px',
              display: 'inline-block',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
          >
            Ver metodologia
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── STATS ─────────────────────────────────────────────── */
function Stats() {
  const items = [
    { n: '67%', label: 'das empresas perdem receita por gaps no funil que nunca foram mapeados' },
    { n: '3x', label: 'mais previsibilidade com Revenue Ops estruturado vs. marketing tradicional' },
    { n: '40%', label: 'do CAC médio é desperdiçado por falta de rastreamento adequado' },
  ];

  return (
    <section style={{ background: '#0d1117', padding: '80px 40px' }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1px',
        background: 'rgba(255,255,255,0.06)',
      }}>
        {items.map((it, i) => (
          <div key={i} style={{ background: '#0d1117', padding: '48px 40px' }}>
            <div style={{
              fontFamily: s.serif,
              fontSize: '56px',
              fontWeight: 700,
              background: s.grad,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: 1,
              marginBottom: '16px',
            }}>
              {it.n}
            </div>
            <p style={{
              fontFamily: s.sans,
              fontSize: '15px',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.6,
            }}>
              {it.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── METODOLOGIA ───────────────────────────────────────── */
/* no badge — eyebrow budget preserved for Servicos + ComoFunciona */
function Metodologia() {
  const steps = [
    { letter: 'A', word: 'Aquisição', desc: 'Estrutura de canais, tráfego pago, orgânico e parcerias com rastreamento de origem.' },
    { letter: 'C', word: 'Conversão', desc: 'Otimização de funil, testes A/B, landing pages e CRO sistemático.' },
    { letter: 'E', word: 'Engajamento', desc: 'Nutrição de leads, automações e sequências para avançar oportunidades.' },
    { letter: 'L', word: 'Lead Scoring', desc: 'Qualificação inteligente com scoring comportamental e firmográfico.' },
    { letter: 'E', word: 'Eficiência', desc: 'Redução de CAC, eliminação de gargalos e otimização operacional.' },
    { letter: 'R', word: 'Retenção', desc: 'Churn prevention, expansão de receita e estratégias de upsell.' },
    { letter: 'A', word: 'Análise', desc: 'Dashboards, métricas, atribuição e reporting executivo contínuo.' },
  ];

  return (
    <section id="metodologia" style={{ background: s.dark, padding: '100px 40px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <SectionTitle light>Framework A.C.E.L.E.R.A</SectionTitle>
        <p style={{
          fontFamily: s.sans,
          fontSize: '17px',
          color: 'rgba(255,255,255,0.55)',
          maxWidth: '520px',
          lineHeight: 1.7,
          marginBottom: '60px',
        }}>
          Sete camadas integradas cobrindo todo o ciclo de receita, da atração à retenção.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {steps.map((st, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '64px 160px 1fr',
              alignItems: 'center',
              gap: '32px',
              padding: '28px 0',
              borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <div style={{
                fontFamily: s.serif,
                fontSize: '36px',
                fontWeight: 700,
                background: s.grad,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
              }}>
                {st.letter}
              </div>
              <div style={{
                fontFamily: s.serif,
                fontSize: '18px',
                fontWeight: 600,
                color: '#fff',
              }}>
                {st.word}
              </div>
              <p style={{
                fontFamily: s.sans,
                fontSize: '15px',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.6,
              }}>
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PILARES ───────────────────────────────────────────── */
/* bento 2+1: card 1 featured (spans 2 rows), cards 2+3 stacked right */
/* no badge — eyebrow budget saved */
function Pilares() {
  const tagStyle = {
    display: 'inline-block',
    fontFamily: s.sans,
    fontSize: '11px',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    border: '1px solid rgba(255,255,255,0.12)',
    padding: '4px 12px',
    marginRight: '6px',
    marginBottom: '6px',
  };

  return (
    <section id="pilares" style={{ background: '#0d1117', padding: '100px 40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <SectionTitle light>Como estruturamos<br />sua operação de receita</SectionTitle>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr 1fr',
          gridTemplateRows: 'auto auto',
          gap: '1px',
          background: 'rgba(255,255,255,0.08)',
          marginTop: '60px',
        }}>
          {/* Card 1: featured, spans both rows */}
          <div style={{
            gridRow: '1 / 3',
            background: '#0d1117',
            padding: '56px 48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '380px',
          }}>
            <div>
              <h3 style={{
                fontFamily: s.serif,
                fontSize: '28px',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '20px',
                lineHeight: 1.2,
              }}>
                Dados & Rastreamento
              </h3>
              <p style={{
                fontFamily: s.sans,
                fontSize: '15px',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7,
                marginBottom: '40px',
                maxWidth: '360px',
              }}>
                Toda decisão baseada em dados reais. Implementamos tracking, atribuição e analytics que mostram o que realmente gera receita.
              </p>
            </div>
            <div>
              {['GA4', 'GTM', 'Pixel', 'CRM', 'Attribution'].map(t => (
                <span key={t} style={tagStyle}>{t}</span>
              ))}
            </div>
          </div>

          {/* Card 2: top right */}
          <div style={{ background: '#0d1117', padding: '40px 36px' }}>
            <h3 style={{
              fontFamily: s.serif,
              fontSize: '22px',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '14px',
            }}>
              Operações de Funil
            </h3>
            <p style={{
              fontFamily: s.sans,
              fontSize: '14px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              marginBottom: '24px',
            }}>
              Mapeamos e otimizamos cada etapa do funil, do primeiro clique à retenção. Eliminamos gargalos e aumentamos a velocidade de receita.
            </p>
            <div>
              {['CRO', 'Funil', 'Automação', 'Lead Score'].map(t => (
                <span key={t} style={tagStyle}>{t}</span>
              ))}
            </div>
          </div>

          {/* Card 3: bottom right */}
          <div style={{ background: '#0d1117', padding: '40px 36px' }}>
            <h3 style={{
              fontFamily: s.serif,
              fontSize: '22px',
              fontWeight: 700,
              color: '#fff',
              marginBottom: '14px',
            }}>
              Crescimento Escalável
            </h3>
            <p style={{
              fontFamily: s.sans,
              fontSize: '14px',
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              marginBottom: '24px',
            }}>
              Estratégias de crescimento orgânico e pago que se retroalimentam. Construímos ativos que geram retorno crescente ao longo do tempo.
            </p>
            <div>
              {['SEO', 'Conteúdo', 'Paid Media', 'Growth Loops'].map(t => (
                <span key={t} style={tagStyle}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SERVIÇOS ──────────────────────────────────────────── */
/* ONE strategic light section — pricing benefits from lighter bg for legibility */
function Servicos() {
  const planos = [
    {
      name: 'Funnel Audit',
      price: 'R$ 3.000',
      tipo: 'Projeto único',
      desc: 'Diagnóstico completo do seu funil de vendas. Identificamos gargalos, perdas e oportunidades imediatas.',
      items: [
        'Mapeamento completo do funil',
        'Análise de dados e tracking',
        'Relatório com prioridades',
        'Apresentação executiva',
        'Plano de ação 90 dias',
      ],
      cta: 'Solicitar diagnóstico',
      highlight: false,
    },
    {
      name: 'Growth Operations',
      price: 'R$ 8.000+',
      tipo: 'Mensalidade',
      desc: 'Operação contínua de crescimento. Somos o time de Revenue Ops dedicado à sua empresa.',
      items: [
        'Tudo do Funnel Audit',
        'Execução mensal de melhorias',
        'Tracking e dashboards em tempo real',
        'Growth experiments mensais',
        'Reuniões semanais de performance',
        'Relatórios executivos',
      ],
      cta: 'Conversar sobre Growth',
      highlight: true,
      badge: 'Recomendado',
    },
    {
      name: 'AI Systems',
      price: 'Consulta',
      tipo: 'Projeto',
      desc: 'Automações e sistemas de IA para escalar operações de marketing e vendas sem aumentar o time.',
      items: [
        'Automação de qualificação de leads',
        'Nurturing com IA',
        'Integrações entre ferramentas',
        'Redução de trabalho manual',
      ],
      cta: 'Entender o projeto',
      highlight: false,
    },
  ];

  return (
    <section id="servicos" style={{ background: s.cream, padding: '100px 40px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <Badge>Opções de parceria</Badge>
        <SectionTitle>Escolha o nível certo<br />para o seu momento</SectionTitle>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '60px',
          alignItems: 'start',
        }}>
          {planos.map((p, i) => (
            <div key={i} style={{
              background: p.highlight ? s.dark : '#fff',
              border: p.highlight ? 'none' : `1px solid ${s.gray}`,
              padding: '40px',
              position: 'relative',
            }}>
              {p.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-1px',
                  left: '40px',
                  background: s.grad,
                  fontFamily: s.sans,
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#fff',
                  padding: '5px 14px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {p.badge}
                </div>
              )}

              <div style={{
                fontFamily: s.sans,
                fontSize: '12px',
                fontWeight: 600,
                color: p.highlight ? 'rgba(255,255,255,0.4)' : 'rgba(6,13,13,0.4)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '8px',
                marginTop: p.badge ? '20px' : '0',
              }}>
                {p.tipo}
              </div>

              <h3 style={{
                fontFamily: s.serif,
                fontSize: '24px',
                fontWeight: 700,
                color: p.highlight ? '#fff' : s.dark,
                marginBottom: '4px',
              }}>
                {p.name}
              </h3>

              <div style={{
                fontFamily: s.serif,
                fontSize: '36px',
                fontWeight: 700,
                color: p.highlight ? '#fff' : s.dark,
                marginBottom: '16px',
              }}>
                {p.price}
              </div>

              <p style={{
                fontFamily: s.sans,
                fontSize: '14px',
                color: p.highlight ? 'rgba(255,255,255,0.6)' : 'rgba(6,13,13,0.6)',
                lineHeight: 1.6,
                marginBottom: '28px',
                paddingBottom: '28px',
                borderBottom: `1px solid ${p.highlight ? 'rgba(255,255,255,0.1)' : s.gray}`,
              }}>
                {p.desc}
              </p>

              <ul style={{ listStyle: 'none', marginBottom: '36px' }}>
                {p.items.map((item, j) => (
                  <li key={j} style={{
                    fontFamily: s.sans,
                    fontSize: '14px',
                    color: p.highlight ? 'rgba(255,255,255,0.75)' : 'rgba(6,13,13,0.75)',
                    padding: '7px 0',
                    borderBottom: `1px solid ${p.highlight ? 'rgba(255,255,255,0.06)' : 'rgba(6,13,13,0.06)'}`,
                    display: 'flex',
                    gap: '10px',
                  }}>
                    <span style={{ color: s.blue, flexShrink: 0 }}>+</span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="#contato"
                style={{
                  display: 'block',
                  fontFamily: s.sans,
                  fontSize: '14px',
                  fontWeight: 600,
                  color: p.highlight ? '#fff' : s.dark,
                  background: p.highlight ? s.grad : 'transparent',
                  border: p.highlight ? 'none' : `1px solid ${s.dark}`,
                  padding: '14px 24px',
                  textAlign: 'center',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── COMO FUNCIONA ─────────────────────────────────────── */
function ComoFunciona() {
  const steps = [
    { title: 'Diagnóstico', desc: 'Mapeamos seu funil atual, dados disponíveis e principais oportunidades em uma reunião de 60 minutos.' },
    { title: 'Estratégia', desc: 'Montamos o plano de Revenue Ops adaptado ao seu momento, recursos e metas de crescimento.' },
    { title: 'Implementação', desc: 'Executamos as mudanças, configuramos o tracking e lançamos os primeiros experimentos de crescimento.' },
    { title: 'Resultados', desc: 'Revisões semanais com métricas reais, ajustes rápidos e relatórios executivos mensais.' },
  ];

  return (
    <section id="parceria" style={{ background: '#0d1117', padding: '100px 40px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <Badge>Como funciona</Badge>
        <SectionTitle light>Do diagnóstico ao<br />crescimento contínuo</SectionTitle>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          marginTop: '60px',
        }}>
          {steps.map((st, i) => (
            <div key={i} style={{
              padding: '40px 32px',
              borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}>
              <div style={{
                width: '28px',
                height: '2px',
                background: s.grad,
                marginBottom: '24px',
              }} />
              <h3 style={{
                fontFamily: s.serif,
                fontSize: '20px',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '12px',
              }}>
                {st.title}
              </h3>
              <p style={{
                fontFamily: s.sans,
                fontSize: '14px',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.7,
              }}>
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FERRAMENTAS ───────────────────────────────────────── */
function Ferramentas() {
  const tools = ['HubSpot', 'RD Station', 'Salesforce', 'Google Analytics 4', 'Meta Ads', 'Google Ads', 'ActiveCampaign', 'Hotjar', 'Semrush', 'Looker Studio', 'Zapier', 'Make'];

  return (
    <section style={{ background: '#0a0f0f', padding: '72px 40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{
          fontFamily: s.sans,
          fontSize: '12px',
          fontWeight: 600,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          marginBottom: '40px',
        }}>
          Operamos com as ferramentas do seu stack
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
          {tools.map(t => (
            <span key={t} style={{
              fontFamily: s.sans,
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.4)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '8px 18px',
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA / CONTATO ─────────────────────────────────────── */
function CTA() {
  return (
    <section id="contato" style={{
      background: s.dark,
      padding: '120px 40px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        bottom: '-30%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(16,63,234,0.2) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
        <SectionTitle light>Pronto para crescimento<br />previsível?</SectionTitle>
        <p style={{
          fontFamily: s.sans,
          fontSize: '17px',
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.7,
          maxWidth: '480px',
          margin: '0 auto 48px',
        }}>
          Comece com um diagnóstico gratuito de 60 minutos. Mapeamos seu funil e identificamos oportunidades de receita.
        </p>

        <a
          href="mailto:contato@mutua.com.br"
          style={{
            display: 'inline-block',
            fontFamily: s.sans,
            fontSize: '16px',
            fontWeight: 600,
            color: '#fff',
            background: s.grad,
            padding: '18px 48px',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          Diagnóstico gratuito
        </a>
      </div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────────────── */
function Footer() {
  const links = [
    { label: 'Metodologia', href: '#metodologia' },
    { label: 'Serviços', href: '#servicos' },
    { label: 'Parceria', href: '#parceria' },
    { label: 'Contato', href: '#contato' },
  ];

  return (
    <footer style={{
      background: '#020609',
      padding: '48px 40px',
      borderTop: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <span style={{
          fontFamily: s.serif,
          fontSize: '18px',
          fontWeight: 700,
          color: 'rgba(255,255,255,0.5)',
        }}>
          Mutua
        </span>

        <div style={{ display: 'flex', gap: '32px' }}>
          {links.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                fontFamily: s.sans,
                fontSize: '13px',
                color: 'rgba(255,255,255,0.25)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
            >
              {label}
            </a>
          ))}
        </div>

        <span style={{
          fontFamily: s.sans,
          fontSize: '13px',
          color: 'rgba(255,255,255,0.2)',
        }}>
          © {new Date().getFullYear()} Mutua
        </span>
      </div>
    </footer>
  );
}

/* ─── PAGE ──────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <Metodologia />
      <Pilares />
      <Servicos />
      <ComoFunciona />
      <Ferramentas />
      <CTA />
      <Footer />
    </>
  );
}

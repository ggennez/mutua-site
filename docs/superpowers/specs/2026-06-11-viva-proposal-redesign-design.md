# Redesign da proposta Vivá — "Estúdio em Cena"

## Contexto

`public/propostas/studio-viva.html` (605 linhas, servido via iframe por
`app/propostas/studio-viva/page.jsx`) é a proposta comercial da Mutua para a
**Vivá Pilates e Saúde**, dirigida aos donos **Érica e Vinícius**, datada de
11 de junho de 2026 ("Proposta Nº 001").

A página atual já é "elaborada" tecnicamente — fundo com gradiente animado,
textura de grain estilo cinema, ticker, contadores animados, scroll-reveal —
mas tem dois problemas:

1. **Visual genérico**: o tema "cinema/gradiente azul-tech" lembra mais um
   pitch de SaaS do que uma proposta para um estúdio de Pilates/bem-estar.
2. **Personalização fraca**: "Érica & Vinícius" aparece apenas como item de
   metadado pequeno dentro do hero (ao lado da data), não como o centro da
   mensagem — apesar de a proposta ser inteiramente para eles.

Há também uma inconsistência de marca: a página usa **"Muthua"** (com H) em
todos os lugares, enquanto o resto do site usa **"Mutua"**.

## Objetivo

Redesenhar a página com um conceito visual novo — **"Estúdio em Cena"**
(bento/modular) — em que:

- O hero abre com os nomes de Érica e Vinícius como manchete principal,
  não como metadado.
- A elaboração visual vem de composição/densidade (grid bento assimétrico),
  não de mais efeitos de animação.
- A marca "Mutua" fica consistente com o resto do site.

## Fora de escopo

- Home principal da Mutua (`app/page.jsx`) — não é tocada.
- Outras páginas/ferramentas (`calculadora`, `apresentacao`, `funil`) — não
  são tocadas.
- Fotografia real do estúdio Vivá — não disponível; o design usa formas/
  blocos gráficos no lugar de imagens.

## Sistema visual

- **Paleta**: reaproveita os tokens já existentes —
  `--blue:#1A6DE5`, `--blue2:#103FEA`, `--blue3:#0a2fa8`, `--dark:#060D0D`,
  `--cream:#FFFDF3`, `--gray:#E5E5E5`, `--gradient` (linear-gradient 135deg
  entre blue2 → blue → blue3). Uso mais intencional: cards escuros para
  impacto, cards claros/cream para conteúdo, gradiente reservado para 1-2
  células de destaque (não fundo de página inteira).
- **Tipografia**: mantém a dupla Fraunces (serif/itálico, para nomes,
  números e destaques) + Inter (sans, para corpo) — igual ao site
  principal.
- **Linguagem de grid**: cantos retos (sem `border-radius`), grids com
  `gap: 1px` sobre fundo compartilhado — o mesmo padrão visual das seções
  Stats/Pilares da home principal, aplicado de forma mais densa.
- **Movimento**: remove o fundo animado em gradiente full-page, o overlay
  de grain e o ticker grande. Mantém o padrão de scroll-reveal via
  `IntersectionObserver` e os contadores animados já existentes.
- **Branding**: substitui todas as ocorrências de "Muthua" por "Mutua"
  (nav, ticker/footer, masthead, textos).

## Hero (núcleo da mudança)

Consolida o masthead gigante ("Vivá") + a seção hero atual em **um único
grid bento assimétrico**:

- **Card grande (~2/3 da largura, fundo dark com leve gradiente no canto)**:
  - Eyebrow: "Proposta de Parceria · Mutua × Vivá Pilates e Saúde"
  - Manchete enorme em serifa: **"Olá, Érica e Vinícius."**
  - Parágrafo curto, tom de carta pessoal (adaptado do parágrafo atual do
    hero), explicando o que a proposta cobre.
  - CTA primário em WhatsApp (reaproveita o link/mensagem pré-preenchida já
    existentes).
- **Coluna direita (~1/3 da largura), 3 cards empilhados**:
  - "Vivá Pilates e Saúde" — card claro estilo "cartão de visita".
  - "11 de junho de 2026 · Proposta Nº 001" — card escuro pequeno.
  - Um número de impacto puxado das stats/planos atuais (ex.: "3 formatos"
    ou um dos contadores existentes), card com acento em gradiente — o
    "gancho" visual.

**Responsivo**: em mobile, empilha em coluna única começando pelo card
grande.

## Demais seções (mesma linguagem bento)

- **Diagnóstico** ("Presença, aquisição e crescimento"): os 3 cards atuais
  passam para grid assimétrico (1 grande + 2 menores), misturando fundos
  claro/escuro.
- **Planos P/M/G**: estrutura e todos os dados de negócio são preservados
  — preços (R$ 4.000 / 6.000 / 8.000), listas de itens por plano, e os
  links de WhatsApp pré-preenchidos por plano (`+5543991118489`). Apenas o
  estilo visual é atualizado para a linguagem de grid de cantos retos.
- **Como funciona**: a timeline em barra (`.bartimeline`) é substituída por
  uma fileira de cards numerados no padrão bento.
- **Contrato**: o layout atual (`.contract`, já quase-bento com 1 item
  grande + 2 menores) é mantido na estrutura, só recebe o novo estilo
  visual.
- **CTA final**: fecha no mesmo tom de carta pessoal — algo como "Érica,
  Vinícius — vamos começar?" — mantendo o botão de WhatsApp existente.
- **Footer**: simplificado, com branding "Mutua" corrigido.

## Abordagem técnica

- Continua como **arquivo HTML único** em
  `public/propostas/studio-viva.html`, servido via iframe por
  `app/propostas/studio-viva/page.jsx` — mesmo padrão usado pelas outras
  páginas de ferramenta/proposta do site.
- Reescreve HTML/CSS/JS para a nova estrutura e sistema visual, preservando:
  - Todos os preços e textos dos planos P/M/G.
  - Número de WhatsApp e mensagens pré-preenchidas por plano/CTA.
  - Termos de contrato (3 meses de experiência + 12 meses de contrato).
  - Lógica de scroll-reveal e contadores animados (adaptada ao novo HTML).
- Sem novos assets de imagem — elementos gráficos (formas, grid, tipografia)
  fazem o trabalho visual.

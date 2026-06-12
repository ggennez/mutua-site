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

A página usa **"Muthua"** (com H) como nome de marca em todas as menções
(nav, hero, rodapé) — confirmado como o nome correto desta proposta pelo
domínio ao vivo `muthuadesign.com.br`. Esse spelling é mantido como está;
não há mudança de branding nesta página.

## Objetivo

Redesenhar a página com um conceito visual novo — **"Estúdio em Cena"**
(bento/modular) — em que:

- O hero abre com os nomes de Érica e Vinícius como manchete principal,
  não como metadado.
- A elaboração visual vem de composição/densidade (grid bento assimétrico),
  não de mais efeitos de animação.
- A página tem um botão para baixar a proposta como PDF leve.

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
  de grain e o ticker grande — substitui por movimento mais refinado e
  intencional:
  - Scroll-reveal via `IntersectionObserver` com easing suave
    (`cubic-bezier(.16,1,.3,1)`), estendido a todos os cards bento, com
    **delay escalonado** entre células do mesmo grid (cascata sutil ao
    rolar a página).
  - Hover sutil nos cards (leve `translateY` + sombra), reforçando a
    sensação de superfícies "tangíveis".
  - Mantém os contadores animados já existentes.
- **Branding**: mantém "Muthua" (com H) em todas as menções — ver
  Contexto. Nenhuma alteração de nome de marca nesta página.

## Hero (núcleo da mudança)

Consolida o masthead gigante ("Vivá") + a seção hero atual em **um único
grid bento assimétrico**:

- **Card grande (~2/3 da largura, fundo dark com leve gradiente no canto)**:
  - Eyebrow: "Proposta de Parceria · Muthua × Vivá Pilates e Saúde"
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

**Entrada animada**: ao carregar a página, os 4 cards do hero (o grande +
os 3 da coluna direita) entram em sequência — fade + leve `translateY`,
mesmo easing do scroll-reveal (`cubic-bezier(.16,1,.3,1)`), com delay
escalonado de ~80-120ms entre eles. Dá ao hero uma sensação "viva" no
primeiro instante, sem depender de fundo animado.

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
- **CTA final**: manchete diz exatamente "Érica e Vinícius, vamos colocar
  a Vivá em movimento?" — eco personalizado do CTA atual ("Vamos colocar
  o studio em movimento?"), mantendo o tom de carta pessoal e o botão de
  WhatsApp existente.
- **Footer**: deixa de ser uma linha única de texto e passa a ser uma
  fileira de 3-4 células bento (mesmo grid de cantos retos, `gap: 1px`),
  ecoando o peso visual do hero:
  - Célula maior: wordmark "Muthua" em Fraunces + uma linha de assinatura
    curta com o posicionamento da Muthua.
  - Célula com contato direto via WhatsApp (reaproveita link/mensagem já
    usados nos CTAs).
  - Célula com os metadados da proposta ("11 de junho de 2026 · Proposta
    Nº 001") — eco do card da coluna direita do hero.
  - Célula pequena com o copyright ("© 2026 Muthua").

## Download em PDF

- Botão "Baixar proposta (PDF)" na nav, estilo secundário ao lado do CTA
  "Falar com a Muthua" — sempre visível.
- Aciona `window.print()` — sem bibliotecas novas.
- Stylesheet `@media print` dedicado:
  - Esconde nav, barra de progresso de scroll, blobs/gradientes decorativos
    e o próprio botão de download.
  - Converte seções dark para fundo claro/texto escuro (legibilidade e
    economia de tinta no papel).
  - Simplifica os grids bento para layout de documento (1-2 colunas), com
    `page-break-inside: avoid` nos cards e quebras de página entre as
    seções principais.
  - Adiciona um cabeçalho impresso: "Muthua × Vivá Pilates e Saúde —
    Proposta de Parceria · 11 de junho de 2026".
  - Links de WhatsApp aparecem como texto com o número visível (não são
    clicáveis no papel).
- Contadores animados (`data-counter`): o evento `beforeprint` dispara
  todos os contadores (além do trigger normal por scroll), garantindo que
  valores finais — não "0" — apareçam no PDF.
- Resultado: PDF gerado pelo navegador, texto selecionável/vetorial
  (leve), sem dependências adicionais, sempre sincronizado com o conteúdo
  da página.

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
- Adiciona o stylesheet `@media print` e o botão/handler de download
  descritos na seção "Download em PDF".
- Sem novos assets de imagem — elementos gráficos (formas, grid, tipografia)
  fazem o trabalho visual.

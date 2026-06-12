# Redesign da proposta Vivá ("Estúdio em Cena") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `public/propostas/studio-viva.html` as a bento/modular "Estúdio em Cena" design — a hero centered on "Olá, Érica e Vinícius.", sharp-corner bento grids throughout, refined scroll/entrance animations, a redesigned bento footer, and a print-to-PDF stylesheet — while preserving every piece of business data (prices, WhatsApp links/messages, contract terms) and the "Muthua" (with H) branding exactly as-is.

**Architecture:** Single static HTML file with an embedded `<style>` and `<script>`, served via iframe by `app/propostas/studio-viva/page.jsx` (unchanged, not touched by this plan). Task 1 replaces the entire file with a CSS foundation + empty `<body>` shell. Each subsequent task appends one page section's CSS (inserted right before `</style>`) and HTML (inserted right before `</body>`), in final document order, so the file is always valid HTML and visually checkable after every task. The last tasks add the JS (scroll progress, staggered reveal, counters, hero entrance, `beforeprint`), the `@media print` stylesheet, and a full end-to-end verification pass.

**Tech Stack:** Plain HTML5 + CSS3 (custom properties, CSS Grid `gap:1px` bento pattern borrowed from `app/page.jsx`'s Stats/Pilares sections, `cubic-bezier(.16,1,.3,1)` easing) + vanilla JS (`IntersectionObserver`, `requestAnimationFrame`, no frameworks/build step) + `window.print()` / `@media print` for PDF export. No new dependencies, no new image assets.

---

## File Structure

This plan modifies **one file only**:

- **Modify (complete rewrite): `public/propostas/studio-viva.html`** — currently 605 lines. Every task in this plan edits this single file. Task 1 overwrites it entirely with a new foundation; Tasks 2–11 use `Edit` to insert new CSS before the `</style>` tag and new HTML before the `</body>` tag, building up the page section by section in final document order (nav → hero → diagnóstico → planos → como funciona → contrato → CTA final → footer → script). Task 11 also adds the `@media print` block. Task 12 is end-to-end verification + commit + push.

No other files are created or modified. Reference spec: `docs/superpowers/specs/2026-06-11-viva-proposal-redesign-design.md`.

**Anchors used by every Edit step below (both are unique in the file after Task 1):**
- CSS insertions: replace `</style>` with `<new rules>\n</style>`
- HTML insertions: replace `</body>` with `<new section>\n</body>`

Because each insertion re-creates the anchor string at the end, later tasks keep finding the same anchor and new sections are appended **after** previously-inserted ones — so document order stays correct (nav inserted in Task 2 ends up before hero inserted in Task 3, etc.).

---

### Task 1: CSS foundation + empty page shell

**Files:**
- Modify (full rewrite): `public/propostas/studio-viva.html`

- [ ] **Step 1: Replace the entire file with the foundation shell**

Use the `Write` tool to overwrite `public/propostas/studio-viva.html` with exactly this content:

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Proposta de Parceria · Muthua × Vivá Pilates e Saúde</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@400;500;600&display=swap');

:root{
  --blue:#1A6DE5;
  --blue2:#103FEA;
  --blue3:#0a2fa8;
  --gray:#E5E5E5;
  --cream:#FFFDF3;
  --dark:#060D0D;
  --gradient:linear-gradient(135deg,#103FEA 0%,#1A6DE5 60%,#0a2fa8 100%);
  --ease:cubic-bezier(.16,1,.3,1);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Inter',sans-serif;background:var(--cream);color:var(--dark);line-height:1.6;overflow-x:hidden}
h1,h2,h3,h4{font-family:'Fraunces',serif}
a{color:inherit;text-decoration:none}
button{cursor:pointer;border:none;background:none;font-family:inherit}

.wrap{max-width:1200px;margin:0 auto;padding:0 24px}

.progress{position:fixed;top:0;left:0;height:3px;background:var(--gradient);z-index:1000;width:0%}

.section{padding:80px 0}
.eyebrow{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;opacity:.6}
.section-title{font-size:clamp(28px,4vw,44px);font-weight:700;margin:12px 0 16px;max-width:18ch}
.section-lead{font-size:16px;opacity:.75;max-width:60ch;margin-bottom:40px}

.bento{display:grid;gap:1px;background:rgba(6,13,13,.08);margin-top:8px}
.cell{padding:40px;display:flex;flex-direction:column;gap:16px;justify-content:center;transition:transform .4s var(--ease),box-shadow .4s var(--ease)}
.cell:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(6,13,13,.12)}
.cell-light{background:var(--cream)}
.cell-dark{background:var(--dark);color:var(--cream)}
.cell-accent{background:var(--gradient);color:#fff}

.reveal{opacity:0;transform:translateY(40px) scale(.97);transition:opacity 1s var(--ease),transform 1s var(--ease)}
.reveal.in{opacity:1;transform:translateY(0) scale(1)}

.hero-enter{opacity:0;transform:translateY(40px);transition:opacity 1s var(--ease),transform 1s var(--ease)}
.hero-enter.in{opacity:1;transform:translateY(0)}

@media (max-width:860px){
  .section{padding:56px 0}
}
</style>
</head>
<body>
<div class="progress" id="progress"></div>
</body>
</html>
```

- [ ] **Step 2: Verify it renders with no console errors**

Open `public/propostas/studio-viva.html` directly in a browser (double-click the file or `open public/propostas/studio-viva.html`). Confirm:
- Page background is the cream color (`#FFFDF3`), no white flash/mismatch.
- DevTools console shows no errors (the `@import` font request should succeed).
- A 3px-tall element with id `progress` exists in the DOM (inspect via DevTools — it's invisible at `width:0%`, that's expected).

- [ ] **Step 3: Commit**

```bash
git add public/propostas/studio-viva.html
git commit -m "Rewrite Vivá proposal: CSS foundation and empty page shell"
```

---

### Task 2: Nav with PDF download button

**Files:**
- Modify: `public/propostas/studio-viva.html`

- [ ] **Step 1: Add nav CSS before `</style>`**

Use `Edit` on `public/propostas/studio-viva.html`. Find this exact text:

```
@media (max-width:860px){
  .section{padding:56px 0}
}
</style>
```

Replace it with:

```
@media (max-width:860px){
  .section{padding:56px 0}
}

.nav{position:fixed;top:0;left:0;right:0;z-index:900;background:rgba(255,253,243,.85);backdrop-filter:blur(12px);border-bottom:1px solid rgba(6,13,13,.08)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;padding:18px 24px}
.logo{font-family:'Fraunces',serif;font-weight:700;font-style:italic;font-size:20px;letter-spacing:-.02em}
.nav-actions{display:flex;align-items:center;gap:12px}
.btn-pdf{font-size:13px;font-weight:600;padding:10px 18px;border:1px solid var(--dark);color:var(--dark);transition:background .3s var(--ease),color .3s var(--ease)}
.btn-pdf:hover{background:var(--dark);color:var(--cream)}
.cta{font-size:13px;font-weight:600;padding:10px 18px;background:var(--gradient);color:#fff;transition:transform .3s var(--ease)}
.cta:hover{transform:translateY(-2px)}
@media (max-width:560px){
  .btn-pdf{display:none}
}
</style>
```

- [ ] **Step 2: Add nav HTML before `</body>`**

Use `Edit` on `public/propostas/studio-viva.html`. Find this exact text:

```
<div class="progress" id="progress"></div>
</body>
```

Replace it with:

```
<div class="progress" id="progress"></div>
<nav class="nav">
  <div class="wrap nav-inner">
    <span class="logo">Muthua</span>
    <div class="nav-actions">
      <button class="btn-pdf" onclick="window.print()">Baixar proposta (PDF)</button>
      <a class="cta" href="#contato">Falar com a Muthua</a>
    </div>
  </div>
</nav>
</body>
```

- [ ] **Step 3: Verify in browser**

Reload `public/propostas/studio-viva.html`. Confirm:
- A fixed translucent nav bar sits at the top with "Muthua" (italic serif) on the left.
- On the right, a "Baixar proposta (PDF)" outlined button and a "Falar com a Muthua" gradient button appear.
- Clicking "Baixar proposta (PDF)" opens the browser's print dialog.
- At a narrow width (resize below 560px), the PDF button disappears and only the gradient CTA remains.

- [ ] **Step 4: Commit**

```bash
git add public/propostas/studio-viva.html
git commit -m "Add nav with Muthua logo, WhatsApp CTA and PDF download button"
```

---

### Task 3: Hero bento (large card + 3-card right column + entrance animation hooks)

**Files:**
- Modify: `public/propostas/studio-viva.html`

- [ ] **Step 1: Add hero CSS before `</style>`**

Use `Edit`. Find:

```
@media (max-width:560px){
  .btn-pdf{display:none}
}
</style>
```

Replace with:

```
@media (max-width:560px){
  .btn-pdf{display:none}
}

.section-hero{padding:140px 0 80px}
.hero-bento{grid-template-columns:2fr 1fr;grid-template-rows:repeat(3,1fr)}
.hero-main{grid-column:1;grid-row:1/-1;align-items:flex-start;gap:24px;padding:64px}
.hero-title{font-size:clamp(40px,6vw,72px);font-weight:700;line-height:1.05;font-style:italic}
.hero-text{font-size:17px;max-width:48ch;opacity:.85}
.cta-large{display:inline-flex;align-items:center;gap:8px;padding:16px 28px;background:var(--gradient);color:#fff;font-weight:600;font-size:15px;margin-top:8px;transition:transform .3s var(--ease)}
.cta-large:hover{transform:translateY(-2px)}
.hero-card-label{font-size:12px;text-transform:uppercase;letter-spacing:.08em;opacity:.5}
.hero-card-name{font-size:22px;font-weight:700}
.hero-card-sub{font-size:14px;opacity:.7}
.hero-meta{font-size:15px;font-weight:600}
.hero-meta-sub{font-size:13px;opacity:.6}
.hero-impact-number{font-family:'Fraunces',serif;font-size:56px;font-weight:700;line-height:1;font-style:italic}
.hero-impact-label{font-size:13px;margin-top:8px;max-width:20ch}
@media (max-width:860px){
  .section-hero{padding:104px 0 56px}
  .hero-bento{grid-template-columns:1fr;grid-template-rows:auto}
  .hero-main{grid-column:1;grid-row:auto;padding:40px 28px}
  .hero-bento .cell{padding:32px 28px}
}
</style>
```

- [ ] **Step 2: Add hero HTML before `</body>`**

Use `Edit`. Find:

```
</nav>
</body>
```

Replace with:

```
</nav>
<section id="hero" class="section section-hero">
  <div class="wrap">
    <div class="bento hero-bento">
      <div class="cell cell-dark hero-main hero-enter">
        <p class="eyebrow">Proposta de Parceria · Muthua × Vivá Pilates e Saúde</p>
        <h1 class="hero-title">Olá, Érica e Vinícius.</h1>
        <p class="hero-text">Preparamos esta proposta pensando na rotina da Vivá: uma forma de fortalecer a presença do studio, atrair novas alunas e organizar o processo comercial — sem perder a identidade que vocês já construíram. A seguir, mostramos como podemos colocar isso em prática juntos.</p>
        <a class="cta-large" href="https://wa.me/5543991118489?text=Ol%C3%A1%21%20Aqui%20s%C3%A3o%20%C3%89rica%20e%20Vin%C3%ADcius%2C%20da%20Viv%C3%A1%20Pilates%20e%20Sa%C3%BAde.%20Vimos%20a%20proposta%20de%20parceria%20com%20a%20Muthua%20e%20gostar%C3%ADamos%20de%20conversar%20sobre%20os%20pr%C3%B3ximos%20passos.">Falar no WhatsApp</a>
      </div>
      <div class="cell cell-light hero-enter">
        <p class="hero-card-label">Para</p>
        <h3 class="hero-card-name">Vivá Pilates e Saúde</h3>
        <p class="hero-card-sub">Érica &amp; Vinícius</p>
      </div>
      <div class="cell cell-dark hero-enter">
        <p class="hero-meta">11 de junho de 2026</p>
        <p class="hero-meta-sub">Proposta Nº 001</p>
      </div>
      <div class="cell cell-accent hero-enter">
        <p class="hero-impact-number" data-counter="3">0</p>
        <p class="hero-impact-label">formatos de parceria — P, M e G — para cada momento do studio</p>
      </div>
    </div>
  </div>
</section>
</body>
```

- [ ] **Step 3: Verify in browser**

Reload `public/propostas/studio-viva.html`. Confirm:
- Below the nav, a dark card takes the left ~2/3 with eyebrow "Proposta de Parceria · Muthua × Vivá Pilates e Saúde", the huge italic headline "Olá, Érica e Vinícius.", a paragraph, and a "Falar no WhatsApp" gradient button.
- The right ~1/3 stacks 3 cards: a light "Vivá Pilates e Saúde / Érica & Vinícius" card, a small dark "11 de junho de 2026 / Proposta Nº 001" card, and a gradient card showing "0" + "formatos de parceria...".
- Resize below 860px: the grid collapses to one column, big card first, then the 3 right cards stacked below it.
- **Expected at this stage:** all 4 hero cards are invisible (`opacity:0`) because the entrance-animation JS doesn't exist yet (added in Task 10). To inspect layout now, open DevTools console and run: `document.querySelectorAll('.hero-enter').forEach(el=>el.classList.add('in'))` — this temporarily reveals them (don't save this as a fix, it's just for visual inspection).

- [ ] **Step 4: Commit**

```bash
git add public/propostas/studio-viva.html
git commit -m "Add hero bento: Ola Erica e Vinicius headline plus 3-card column"
```

---

### Task 4: Diagnóstico section (asymmetric bento)

**Files:**
- Modify: `public/propostas/studio-viva.html`

- [ ] **Step 1: Add diagnóstico CSS before `</style>`**

Use `Edit`. Find:

```
@media (max-width:860px){
  .section-hero{padding:104px 0 56px}
  .hero-bento{grid-template-columns:1fr;grid-template-rows:auto}
  .hero-main{grid-column:1;grid-row:auto;padding:40px 28px}
  .hero-bento .cell{padding:32px 28px}
}
</style>
```

Replace with:

```
@media (max-width:860px){
  .section-hero{padding:104px 0 56px}
  .hero-bento{grid-template-columns:1fr;grid-template-rows:auto}
  .hero-main{grid-column:1;grid-row:auto;padding:40px 28px}
  .hero-bento .cell{padding:32px 28px}
}

.diag-bento{grid-template-columns:2fr 1fr;grid-template-rows:repeat(2,1fr)}
.diag-main{grid-column:1;grid-row:1/-1;align-items:flex-start;gap:16px;padding:56px}
.diag-number{font-family:'Fraunces',serif;font-size:14px;opacity:.4;letter-spacing:.1em}
.diag-title{font-size:24px;font-weight:700}
.diag-text{font-size:15px;opacity:.8;max-width:42ch}
@media (max-width:860px){
  .diag-bento{grid-template-columns:1fr;grid-template-rows:auto}
  .diag-main{grid-column:1;grid-row:auto;padding:40px 28px}
}
</style>
```

- [ ] **Step 2: Add diagnóstico HTML before `</body>`**

Use `Edit`. Find:

```
  </div>
</section>
</body>
```

Replace with:

```
  </div>
</section>
<section id="diagnostico" class="section">
  <div class="wrap">
    <p class="eyebrow reveal">Por que essa proposta</p>
    <h2 class="section-title reveal">Presença, aquisição e crescimento sob o mesmo teto</h2>
    <p class="section-lead reveal">Estúdios de pilates costumam concentrar a captação de alunas em indicação e localização. Isso funciona, mas tem teto. Esta proposta organiza três frentes — comunicação, aquisição paga e estrutura comercial — para que o studio tenha um fluxo mais previsível de novas matrículas, mantendo o padrão e a identidade da marca.</p>
    <div class="bento diag-bento">
      <div class="cell cell-dark diag-main reveal">
        <p class="diag-number">01</p>
        <h3 class="diag-title">Presença consistente</h3>
        <p class="diag-text">Redes sociais ativas e com identidade clara fortalecem a marca e mantêm o estúdio no radar de quem já conhece e de quem ainda vai conhecer.</p>
      </div>
      <div class="cell cell-light reveal">
        <p class="diag-number">02</p>
        <h3 class="diag-title">Aquisição ativa</h3>
        <p class="diag-text">Tráfego pago bem direcionado leva o studio a pessoas que ainda não conhecem o espaço, mas se encaixam no perfil de aluna ideal.</p>
      </div>
      <div class="cell cell-dark reveal">
        <p class="diag-number">03</p>
        <h3 class="diag-title">Operação comercial</h3>
        <p class="diag-text">Processo estruturado de atendimento e conversão de interessados garante que o investimento em mídia vire matrícula — não só curtida.</p>
      </div>
    </div>
  </div>
</section>
</body>
```

Note: the 3-line anchor `  </div>\n</section>\n</body>` stays unique throughout the rest of this plan. Every section ends with `  </div>\n</section>` (closing `.wrap` then `.section`), but only the **last** section in the file is immediately followed by `</body>`. Each insertion replaces this anchor with `[new section]\n</body>`, so the new last section recreates the same unique anchor for the next task.

- [ ] **Step 3: Verify in browser**

Reload `public/propostas/studio-viva.html`. Confirm:
- A new section appears below the hero with eyebrow "Por que essa proposta", title "Presença, aquisição e crescimento sob o mesmo teto", and a lead paragraph.
- Below that, a bento grid: one large dark card ("01 Presença consistente") on the left spanning two rows, with a light card ("02 Aquisição ativa") and a dark card ("03 Operação comercial") stacked on the right.
- Resize below 860px: the grid collapses to a single column, in order 01, 02, 03.
- **Expected at this stage:** all `.reveal` elements (eyebrow, title, lead, 3 cards) are invisible (`opacity:0`) — the scroll-reveal JS is added in Task 10. To inspect now, run in DevTools console: `document.querySelectorAll('.reveal').forEach(el=>el.classList.add('in'))`.

- [ ] **Step 4: Commit**

```bash
git add public/propostas/studio-viva.html
git commit -m "Add Diagnostico section: asymmetric bento (Presenca, Aquisicao, Operacao)"
```

---

### Task 5: Planos P/M/G (preserve prices, items, WhatsApp CTAs)

**Files:**
- Modify: `public/propostas/studio-viva.html`

- [ ] **Step 1: Add planos CSS before `</style>`**

Use `Edit`. Find:

```
@media (max-width:860px){
  .diag-bento{grid-template-columns:1fr;grid-template-rows:auto}
  .diag-main{grid-column:1;grid-row:auto;padding:40px 28px}
}
</style>
```

Replace with:

```
@media (max-width:860px){
  .diag-bento{grid-template-columns:1fr;grid-template-rows:auto}
  .diag-main{grid-column:1;grid-row:auto;padding:40px 28px}
}

.planos-bento{grid-template-columns:repeat(auto-fit,minmax(280px,1fr))}
.plano{align-items:stretch;justify-content:flex-start;gap:14px;position:relative}
.plano-rec{transform:scale(1.02);z-index:1}
.plano-badge{position:absolute;top:0;right:0;background:var(--gradient);color:#fff;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;padding:6px 14px}
.plano-tag{font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;opacity:.55}
.plano-name{font-family:'Fraunces',serif;font-size:26px;font-weight:700;font-style:italic}
.plano-price{font-family:'Fraunces',serif;font-size:36px;font-weight:700;display:flex;align-items:baseline;gap:6px}
.plano-period{font-family:'Inter',sans-serif;font-size:14px;font-weight:400;opacity:.6}
.plano-extra{font-size:12px;opacity:.55}
.plano-ideal{font-size:14px;font-style:italic;opacity:.8;border-left:2px solid currentColor;padding-left:12px}
.plano-desc{font-size:14px;opacity:.8}
.plano-items{list-style:none;display:flex;flex-direction:column;gap:8px;font-size:13.5px}
.plano-items li{padding-left:18px;position:relative;opacity:.85}
.plano-items li::before{content:'—';position:absolute;left:0;opacity:.4}
.plano-cta{margin-top:auto;padding:14px 24px;text-align:center;font-weight:600;font-size:14px;border:1px solid currentColor;transition:background .3s var(--ease),color .3s var(--ease)}
.plano-cta:hover{background:var(--dark);color:var(--cream)}
.plano-cta-accent{background:var(--gradient);color:#fff;border:none}
@media (max-width:860px){.plano-rec{transform:none}}
</style>
```

- [ ] **Step 2: Add planos HTML before `</body>`**

Use `Edit`. Find:

```
  </div>
</section>
</body>
```

Replace with:

```
  </div>
</section>
<section id="planos" class="section">
  <div class="wrap">
    <p class="eyebrow reveal">Opções de parceria</p>
    <h2 class="section-title reveal">Três formatos, um único objetivo</h2>
    <p class="section-lead reveal">Escolha o ponto de partida ideal para o momento atual do studio. É possível evoluir de um plano para outro conforme os resultados aparecem.</p>
    <div class="bento planos-bento">
      <div class="cell cell-light plano reveal">
        <p class="plano-tag">Plano P</p>
        <p class="plano-name">Presença</p>
        <p class="plano-price"><span data-counter="4000" data-prefix="R$ ">0</span><span class="plano-period">/mês</span></p>
        <p class="plano-extra">Sem verba de anúncio</p>
        <p class="plano-ideal">Ideal para fortalecer marca e manter constância de comunicação.</p>
        <p class="plano-desc">Construção de presença digital consistente, com conteúdo regular alinhado à identidade do studio.</p>
        <ul class="plano-items">
          <li>Gestão das redes sociais (Instagram)</li>
          <li>4 publicações por semana (16 posts/mês)</li>
          <li>Planejamento de conteúdo mensal</li>
          <li>Stories e conteúdos de apoio</li>
          <li>Calendário editorial</li>
          <li>Relatório mensal de performance</li>
        </ul>
        <a class="plano-cta" href="https://wa.me/5543991118489?text=Ol%C3%A1%21%20Aqui%20s%C3%A3o%20%C3%89rica%20e%20Vin%C3%ADcius%2C%20da%20Viv%C3%A1%20Pilates%20e%20Sa%C3%BAde.%20Temos%20interesse%20no%20Plano%20P%20%28Presen%C3%A7a%29%20da%20proposta%20e%20gostar%C3%ADamos%20de%20saber%20mais.">Quero o Plano P</a>
      </div>
      <div class="cell cell-dark plano plano-rec reveal">
        <p class="plano-badge">Recomendado</p>
        <p class="plano-tag">Plano M</p>
        <p class="plano-name">Aquisição</p>
        <p class="plano-price"><span data-counter="6000" data-prefix="R$ ">0</span><span class="plano-period">/mês</span></p>
        <p class="plano-extra">+ verba de anúncio (à parte)</p>
        <p class="plano-ideal">Ideal para gerar novas matrículas além da base atual de indicações.</p>
        <p class="plano-desc">Tudo do Plano P, somado a tráfego pago para gerar fluxo constante de novas interessadas.</p>
        <ul class="plano-items">
          <li>Tudo do Plano P</li>
          <li>Gestão de campanhas de tráfego pago (Meta/Google Ads)</li>
          <li>Produção dos criativos para os anúncios</li>
          <li>Segmentação e otimização contínua</li>
          <li>Relatórios de performance de anúncios e redes</li>
        </ul>
        <a class="plano-cta plano-cta-accent" href="https://wa.me/5543991118489?text=Ol%C3%A1%21%20Aqui%20s%C3%A3o%20%C3%89rica%20e%20Vin%C3%ADcius%2C%20da%20Viv%C3%A1%20Pilates%20e%20Sa%C3%BAde.%20Temos%20interesse%20no%20Plano%20M%20%28Aquisi%C3%A7%C3%A3o%29%20da%20proposta%20e%20gostar%C3%ADamos%20de%20saber%20mais.">Quero o Plano M</a>
      </div>
      <div class="cell cell-light plano reveal">
        <p class="plano-tag">Plano G</p>
        <p class="plano-name">Crescimento</p>
        <p class="plano-price"><span data-counter="8000" data-prefix="R$ ">0</span><span class="plano-period">/mês</span></p>
        <p class="plano-extra">+ verba de anúncio (à parte)</p>
        <p class="plano-ideal">Ideal para quem quer uma operação comercial estruturada, não só marketing.</p>
        <p class="plano-desc">Operação comercial completa: da comunicação à conversão, com planejamento e acompanhamento de receita.</p>
        <ul class="plano-items">
          <li>Tudo do Plano M</li>
          <li>Análise comercial completa do estúdio</li>
          <li>Planejamento comercial estratégico</li>
          <li>Estruturação completa da aquisição de clientes (funil + atendimento)</li>
          <li>Acompanhamento de métricas de receita e conversão</li>
          <li>Reuniões periódicas de performance</li>
        </ul>
        <a class="plano-cta" href="https://wa.me/5543991118489?text=Ol%C3%A1%21%20Aqui%20s%C3%A3o%20%C3%89rica%20e%20Vin%C3%ADcius%2C%20da%20Viv%C3%A1%20Pilates%20e%20Sa%C3%BAde.%20Temos%20interesse%20no%20Plano%20G%20%28Crescimento%29%20da%20proposta%20e%20gostar%C3%ADamos%20de%20saber%20mais.">Quero o Plano G</a>
      </div>
    </div>
  </div>
</section>
</body>
```

- [ ] **Step 3: Verify in browser**

Reload `public/propostas/studio-viva.html`. Confirm:
- Section "Opções de parceria" / "Três formatos, um único objetivo" appears with 3 cards: Plano P (light), Plano M (dark, slightly scaled up, "Recomendado" badge top-right), Plano G (light).
- Each card shows the tag, name, price starting at "0" (e.g. "R$ 0/mês" — will animate once Task 10's counters are added), the extra/ideal/desc lines, the item list with "—" bullets, and a CTA button at the bottom.
- Inspect each CTA's `href` in DevTools and confirm they point to `wa.me/5543991118489` with the correct plan name (P/Presença, M/Aquisição, G/Crescimento) in the encoded message.
- Resize below 860px: cards stack to one column and Plano M's scale-up is removed.

- [ ] **Step 4: Commit**

```bash
git add public/propostas/studio-viva.html
git commit -m "Add Planos P/M/G bento: preserve prices, items and WhatsApp CTAs"
```

---

### Task 6: "Como funciona" numbered bento row

**Files:**
- Modify: `public/propostas/studio-viva.html`

- [ ] **Step 1: Add etapas CSS before `</style>`**

Use `Edit`. Find:

```
@media (max-width:860px){.plano-rec{transform:none}}
</style>
```

Replace with:

```
@media (max-width:860px){.plano-rec{transform:none}}

.etapas-bento{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.etapa-numero{font-family:'Fraunces',serif;font-size:32px;font-weight:700;opacity:.3}
.etapa-titulo{font-size:19px;font-weight:700}
.etapa-texto{font-size:14px;opacity:.8}
</style>
```

- [ ] **Step 2: Add etapas HTML before `</body>`**

Use `Edit`. Find:

```
  </div>
</section>
</body>
```

Replace with:

```
  </div>
</section>
<section id="como-funciona" class="section">
  <div class="wrap">
    <p class="eyebrow reveal">Como começamos</p>
    <h2 class="section-title reveal">Da assinatura ao primeiro ciclo de resultados</h2>
    <div class="bento etapas-bento">
      <div class="cell cell-light etapa reveal">
        <p class="etapa-numero">01</p>
        <h3 class="etapa-titulo">Imersão inicial</h3>
        <p class="etapa-texto">Reunião de alinhamento para entender rotina do estúdio, identidade, turmas, ticket médio e metas do studio.</p>
      </div>
      <div class="cell cell-dark etapa reveal">
        <p class="etapa-numero">02</p>
        <h3 class="etapa-titulo">Configuração</h3>
        <p class="etapa-texto">Organização do calendário de conteúdo (e, nos planos M/G, configuração de campanhas e ferramentas de acompanhamento).</p>
      </div>
      <div class="cell cell-light etapa reveal">
        <p class="etapa-numero">03</p>
        <h3 class="etapa-titulo">Execução mensal</h3>
        <p class="etapa-texto">Produção e publicação de conteúdo, gestão de campanhas e acompanhamento contínuo conforme o plano escolhido.</p>
      </div>
      <div class="cell cell-dark etapa reveal">
        <p class="etapa-numero">04</p>
        <h3 class="etapa-titulo">Revisão de resultados</h3>
        <p class="etapa-texto">Relatório mensal com o que foi feito, o que performou e os ajustes para o próximo ciclo.</p>
      </div>
    </div>
  </div>
</section>
</body>
```

- [ ] **Step 3: Verify in browser**

Reload `public/propostas/studio-viva.html`. Confirm a new section "Como começamos" / "Da assinatura ao primeiro ciclo de resultados" appears with 4 numbered cards (01–04) alternating light/dark backgrounds, each with a title and short description. Resize below ~960px and confirm cards wrap to fewer columns gracefully.

- [ ] **Step 4: Commit**

```bash
git add public/propostas/studio-viva.html
git commit -m "Add Como funciona: 4-step numbered bento row"
```

---

### Task 7: Contrato bento (preserve 3-month/12-month terms)

**Files:**
- Modify: `public/propostas/studio-viva.html`

- [ ] **Step 1: Add contrato CSS before `</style>`**

Use `Edit`. Find:

```
.etapas-bento{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.etapa-numero{font-family:'Fraunces',serif;font-size:32px;font-weight:700;opacity:.3}
.etapa-titulo{font-size:19px;font-weight:700}
.etapa-texto{font-size:14px;opacity:.8}
</style>
```

Replace with:

```
.etapas-bento{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}
.etapa-numero{font-family:'Fraunces',serif;font-size:32px;font-weight:700;opacity:.3}
.etapa-titulo{font-size:19px;font-weight:700}
.etapa-texto{font-size:14px;opacity:.8}

.contrato-bento{grid-template-columns:2fr 1fr;grid-template-rows:repeat(2,1fr)}
.contrato-main{grid-column:1;grid-row:1/-1;align-items:flex-start;gap:16px;padding:56px}
.contrato-numero{font-family:'Fraunces',serif;font-size:64px;font-weight:700;font-style:italic}
.contrato-numero-sm{font-size:40px}
.contrato-titulo{font-size:18px;font-weight:700}
.contrato-texto{font-size:14px;opacity:.8}
@media (max-width:860px){
  .contrato-bento{grid-template-columns:1fr;grid-template-rows:auto}
  .contrato-main{grid-column:1;grid-row:auto;padding:40px 28px}
}
</style>
```

- [ ] **Step 2: Add contrato HTML before `</body>`**

Use `Edit`. Find:

```
  </div>
</section>
</body>
```

Replace with:

```
  </div>
</section>
<section id="contrato" class="section">
  <div class="wrap">
    <p class="eyebrow reveal">Modelo de contrato</p>
    <h2 class="section-title reveal">Período de experiência antes do compromisso longo</h2>
    <p class="section-lead reveal">Para que ambos os lados validem o encaixe da parceria antes de um compromisso mais longo.</p>
    <div class="bento contrato-bento">
      <div class="cell cell-dark contrato-main reveal">
        <p class="contrato-numero" data-counter="3" data-suffix=" meses">0 meses</p>
        <h3 class="contrato-titulo">Período de experiência</h3>
        <p class="contrato-texto">Início da parceria com ciclo de 3 meses, tempo necessário para o conteúdo e/ou as campanhas gerarem os primeiros resultados mensuráveis.</p>
      </div>
      <div class="cell cell-light reveal">
        <p class="contrato-numero contrato-numero-sm" data-counter="12" data-suffix=" meses">0 meses</p>
        <h3 class="contrato-titulo">Contrato vigente</h3>
        <p class="contrato-texto">Após o período de experiência, segue-se para um contrato de 12 meses, com os entregáveis do plano escolhido.</p>
      </div>
      <div class="cell cell-dark reveal">
        <h3 class="contrato-titulo">Sobre a verba de anúncio (Planos M e G)</h3>
        <p class="contrato-texto">O valor de mídia paga é investido diretamente pelo studio nas plataformas (Meta Ads / Google Ads), com total transparência de aplicação e relatórios de retorno. O valor mensal da Muthua refere-se à gestão, produção dos criativos e operação — não inclui a verba investida em anúncios.</p>
      </div>
    </div>
  </div>
</section>
</body>
```

- [ ] **Step 3: Verify in browser**

Reload `public/propostas/studio-viva.html`. Confirm a new section "Modelo de contrato" / "Período de experiência antes do compromisso longo" appears with a large dark card on the left (big italic "0 meses" counter + "Período de experiência") spanning two rows, and two cards stacked on the right: a light card ("0 meses" smaller + "Contrato vigente") and a dark card ("Sobre a verba de anúncio (Planos M e G)" with the transparency paragraph). Resize below 860px and confirm it stacks to one column.

- [ ] **Step 4: Commit**

```bash
git add public/propostas/studio-viva.html
git commit -m "Add Contrato bento: preserve 3-month trial and 12-month terms"
```

---

### Task 8: CTA final ("Érica e Vinícius, vamos colocar a Vivá em movimento?")

**Files:**
- Modify: `public/propostas/studio-viva.html`

- [ ] **Step 1: Add CTA-final CSS before `</style>`**

Use `Edit`. Find:

```
@media (max-width:860px){
  .contrato-bento{grid-template-columns:1fr;grid-template-rows:auto}
  .contrato-main{grid-column:1;grid-row:auto;padding:40px 28px}
}
</style>
```

Replace with:

```
@media (max-width:860px){
  .contrato-bento{grid-template-columns:1fr;grid-template-rows:auto}
  .contrato-main{grid-column:1;grid-row:auto;padding:40px 28px}
}

.cta-bento{grid-template-columns:1fr}
.cta-main{padding:72px 64px;align-items:flex-start;gap:20px}
.cta-title{font-size:clamp(28px,5vw,52px);font-weight:700;font-style:italic;max-width:22ch}
.cta-text{font-size:16px;opacity:.8;max-width:50ch}
@media (max-width:860px){.cta-main{padding:48px 28px}}
</style>
```

- [ ] **Step 2: Add CTA-final HTML before `</body>`**

Use `Edit`. Find:

```
  </div>
</section>
</body>
```

Replace with:

```
  </div>
</section>
<section id="contato" class="section">
  <div class="wrap">
    <div class="bento cta-bento">
      <div class="cell cell-dark cta-main reveal">
        <p class="eyebrow">Vamos começar</p>
        <h2 class="cta-title">Érica e Vinícius, vamos colocar a Vivá em movimento?</h2>
        <p class="cta-text">Ficamos à disposição para conversar sobre qualquer detalhe da proposta, ajustar o plano ao momento do studio ou já dar o primeiro passo.</p>
        <a class="cta-large" href="https://wa.me/5543991118489?text=Ol%C3%A1%21%20Aqui%20s%C3%A3o%20%C3%89rica%20e%20Vin%C3%ADcius%2C%20da%20Viv%C3%A1%20Pilates%20e%20Sa%C3%BAde.%20Vimos%20a%20proposta%20de%20parceria%20com%20a%20Muthua%20e%20gostar%C3%ADamos%20de%20conversar%20sobre%20os%20pr%C3%B3ximos%20passos.">Falar no WhatsApp</a>
      </div>
    </div>
  </div>
</section>
</body>
```

Note: this section's `id="contato"` is the target of the nav's "Falar com a Muthua" link (added in Task 2) — clicking it now scrolls here.

- [ ] **Step 3: Verify in browser**

Reload `public/propostas/studio-viva.html`. Confirm a final dark full-width card reads "Vamos começar" / "Érica e Vinícius, vamos colocar a Vivá em movimento?" with a supporting paragraph and a "Falar no WhatsApp" gradient button. Click "Falar com a Muthua" in the nav and confirm the page scrolls smoothly to this section.

- [ ] **Step 4: Commit**

```bash
git add public/propostas/studio-viva.html
git commit -m "Add CTA final: Erica e Vinicius personalized closing"
```

---

### Task 9: Footer bento (Muthua wordmark, contact, metadata, copyright)

**Files:**
- Modify: `public/propostas/studio-viva.html`

- [ ] **Step 1: Add footer CSS before `</style>`**

Use `Edit`. Find:

```
@media (max-width:860px){.cta-main{padding:48px 28px}}
</style>
```

Replace with:

```
@media (max-width:860px){.cta-main{padding:48px 28px}}

.footer-bento{grid-template-columns:2fr 1fr 1fr 0.6fr}
.footer-brand{padding:56px}
.footer-wordmark{font-family:'Fraunces',serif;font-size:32px;font-weight:700;font-style:italic}
.footer-tagline{font-size:14px;opacity:.7;margin-top:8px;max-width:36ch}
.footer-label{font-size:12px;text-transform:uppercase;letter-spacing:.08em;opacity:.5}
.footer-link{font-size:14px;font-weight:600;margin-top:6px}
.footer-meta{font-size:14px;font-weight:600;margin-top:6px;line-height:1.5}
.footer-copy{justify-content:center;align-items:center}
.footer-copyright{font-size:12px;opacity:.5}
@media (max-width:860px){.footer-bento{grid-template-columns:1fr}}
</style>
```

- [ ] **Step 2: Add footer HTML before `</body>`**

Use `Edit`. Find:

```
  </div>
</section>
</body>
```

Replace with:

```
  </div>
</section>
<section id="footer" class="section">
  <div class="wrap">
    <div class="bento footer-bento">
      <div class="cell cell-dark footer-brand reveal">
        <p class="footer-wordmark">Muthua</p>
        <p class="footer-tagline">Marketing e operação comercial para estúdios e negócios de bem-estar.</p>
      </div>
      <div class="cell cell-light reveal">
        <p class="footer-label">Contato</p>
        <a class="footer-link" href="https://wa.me/5543991118489?text=Ol%C3%A1%21%20Aqui%20s%C3%A3o%20%C3%89rica%20e%20Vin%C3%ADcius%2C%20da%20Viv%C3%A1%20Pilates%20e%20Sa%C3%BAde.%20Vimos%20a%20proposta%20de%20parceria%20com%20a%20Muthua%20e%20gostar%C3%ADamos%20de%20conversar%20sobre%20os%20pr%C3%B3ximos%20passos.">WhatsApp +55 43 99111-8489</a>
      </div>
      <div class="cell cell-dark reveal">
        <p class="footer-label">Proposta</p>
        <p class="footer-meta">11 de junho de 2026<br>Proposta Nº 001</p>
      </div>
      <div class="cell cell-light footer-copy reveal">
        <p class="footer-copyright">© 2026 Muthua</p>
      </div>
    </div>
  </div>
</section>
</body>
```

- [ ] **Step 3: Verify in browser**

Reload `public/propostas/studio-viva.html`. Confirm the page ends with a 4-cell bento row: a large dark cell with the italic "Muthua" wordmark + tagline, a light "Contato" cell with a WhatsApp link, a dark "Proposta" cell with "11 de junho de 2026 / Proposta Nº 001", and a small light cell centered with "© 2026 Muthua". Resize below 860px and confirm the row stacks to one column.

- [ ] **Step 4: Commit**

```bash
git add public/propostas/studio-viva.html
git commit -m "Add footer bento: Muthua wordmark, contact, metadata, copyright"
```

---

### Task 10: JS — scroll progress, staggered reveal, hero entrance, counters

**Files:**
- Modify: `public/propostas/studio-viva.html`

- [ ] **Step 1: Add the script before `</body>`**

Use `Edit`. Find:

```
  </div>
</section>
</body>
```

Replace with:

```
  </div>
</section>
<script>
var progressBar = document.getElementById('progress');
window.addEventListener('scroll', function () {
  var h = document.documentElement;
  var pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = pct + '%';
});

var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(function (el) {
  revealObserver.observe(el);
});

document.querySelectorAll('.bento').forEach(function (bento) {
  Array.prototype.forEach.call(bento.children, function (cell, i) {
    if (cell.classList.contains('reveal')) {
      cell.style.transitionDelay = (i * 80) + 'ms';
    }
  });
});

document.querySelectorAll('.hero-enter').forEach(function (el, i) {
  setTimeout(function () { el.classList.add('in'); }, 100 + i * 100);
});

function formatBR(n) {
  return Math.round(n).toLocaleString('pt-BR');
}

function runCounter(el) {
  var target = parseFloat(el.dataset.counter);
  var prefix = el.dataset.prefix || '';
  var suffix = el.dataset.suffix || '';
  var duration = 1400;
  var start = performance.now();
  function tick(now) {
    var p = Math.min((now - start) / duration, 1);
    var eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + formatBR(target * eased) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

var counterObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      entry.target.dataset.done = '1';
      runCounter(entry.target);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll('[data-counter]').forEach(function (el) {
  counterObserver.observe(el);
});

window.addEventListener('beforeprint', function () {
  document.querySelectorAll('[data-counter]').forEach(function (el) {
    if (!el.dataset.done) {
      el.dataset.done = '1';
      runCounter(el);
    }
  });
});
</script>
</body>
```

- [ ] **Step 2: Verify in browser**

Reload `public/propostas/studio-viva.html` (a full reload, not just re-rendering — the script must run on load). Confirm:
- The 4 hero cards fade in with a visible upward-slide, one after another (~100ms apart), within the first second after load.
- The thin gradient progress bar at the very top grows from 0% to 100% width as you scroll from top to bottom of the page.
- Scrolling down, each section's eyebrow/title/lead and bento cards fade+slide in as they enter the viewport; cards within the same bento grid appear in a slight left-to-right/top-to-bottom cascade (staggered by 80ms).
- Hovering over any bento cell lifts it slightly (`translateY(-4px)`) with a soft shadow.
- The Plano P/M/G prices animate from "R$ 0" up to "R$ 4.000", "R$ 6.000", "R$ 8.000" (using `.` as the thousands separator, pt-BR style) when they scroll into view. The Contrato counters animate to "3 meses" and "12 meses". The hero impact card animates from "0" to "3".
- Open DevTools console and confirm no errors are thrown during scroll or load.

- [ ] **Step 3: Commit**

```bash
git add public/propostas/studio-viva.html
git commit -m "Add JS: scroll progress, staggered reveal, hero entrance, counters"
```

---

### Task 11: `@media print` stylesheet for PDF export

**Files:**
- Modify: `public/propostas/studio-viva.html`

- [ ] **Step 1: Add the print stylesheet before `</style>`**

Use `Edit`. Find:

```
@media (max-width:860px){.footer-bento{grid-template-columns:1fr}}
</style>
```

Replace with:

```
@media (max-width:860px){.footer-bento{grid-template-columns:1fr}}

.print-header{display:none}

@media print{
  .progress,.nav,.btn-pdf{display:none!important}
  .print-header{display:block;text-align:center;font-family:'Fraunces',serif;font-weight:700;font-style:italic;font-size:16px;padding:16px 0;border-bottom:1px solid #000;margin-bottom:24px}
  body{background:#fff;color:#000}
  .cell-dark,.cell-accent{background:#fff!important;color:#000!important;border:1px solid #999}
  .bento{background:#999}
  .section{padding:24px 0}
  .section,.cell{page-break-inside:avoid;break-inside:avoid}
  .section-hero{padding:12px 0}
  #hero .hero-bento,#diagnostico .diag-bento,#contrato .contrato-bento{grid-template-columns:1fr!important;grid-template-rows:auto!important}
  #hero .hero-main,#diagnostico .diag-main,#contrato .contrato-main{grid-column:1!important;grid-row:auto!important}
  #planos .planos-bento,#como-funciona .etapas-bento,#footer .footer-bento{grid-template-columns:repeat(2,1fr)!important}
  .plano-rec{transform:none!important}
  a[href^="https://wa.me"]{color:#000;text-decoration:underline}
  a[href^="https://wa.me"]::after{content:" — WhatsApp: +55 43 99111-8489"}
}
</style>
```

- [ ] **Step 2: Add the print header element before `</body>`**

Use `Edit`. Find:

```
<div class="progress" id="progress"></div>
<nav class="nav">
```

Replace with:

```
<div class="progress" id="progress"></div>
<div class="print-header">Muthua × Vivá Pilates e Saúde — Proposta de Parceria · 11 de junho de 2026</div>
<nav class="nav">
```

- [ ] **Step 3: Verify with print preview**

In the browser, open print preview for `public/propostas/studio-viva.html` (Cmd+P on macOS, or click the "Baixar proposta (PDF)" button which calls `window.print()`). Confirm:
- The nav bar, progress bar, and "Baixar proposta (PDF)" button are NOT shown in the preview.
- A centered italic header reads "Muthua × Vivá Pilates e Saúde — Proposta de Parceria · 11 de junho de 2026" at the top of the first page.
- Background is white, all text is black/dark and legible (no light-gray-on-dark or white-on-white text).
- The hero, diagnóstico, and contrato bentos render as a single column (large card, then the smaller cards below it, in order); planos, como funciona, and footer render as 2 columns.
- Each WhatsApp link's visible text is followed by " — WhatsApp: +55 43 99111-8489" and is underlined black text (not the gradient button styling).
- The Plano P/M/G prices and the Contrato/hero counters show their **final** values (R$ 4.000, R$ 6.000, R$ 8.000, 3 meses, 12 meses, 3) — not "0" — because the `beforeprint` handler from Task 10 runs the counters immediately.
- Close the print dialog without printing (or save as PDF to a scratch location to inspect, then discard).

- [ ] **Step 4: Commit**

```bash
git add public/propostas/studio-viva.html
git commit -m "Add @media print stylesheet for PDF export"
```

---

### Task 12: End-to-end verification, sanity checks, and push

**Files:**
- No changes — verification only.

- [ ] **Step 1: Full-page visual pass**

Open `public/propostas/studio-viva.html` in a browser at a desktop width (~1280px) and scroll from top to bottom. Confirm all 8 sections appear in this order, each visually distinct (alternating light/dark/gradient cells, sharp corners, 1px grid lines):
1. Nav (fixed, "Muthua" + PDF button + "Falar com a Muthua")
2. Hero ("Olá, Érica e Vinícius." + 3-card column)
3. Diagnóstico ("Presença, aquisição e crescimento sob o mesmo teto")
4. Planos (P / M-recomendado / G)
5. Como funciona (4 numbered steps)
6. Contrato (3 meses / 12 meses / verba de anúncio)
7. CTA final ("Érica e Vinícius, vamos colocar a Vivá em movimento?")
8. Footer (Muthua wordmark / contato / proposta / copyright)

- [ ] **Step 2: Responsive pass**

Resize the browser (or use DevTools device toolbar) to ~375px (mobile) and ~768px (tablet). Confirm every bento grid collapses to one column on mobile in the correct order (large card first where applicable), the nav's PDF button hides below 560px, and no horizontal scrollbar appears at any width.

- [ ] **Step 3: Branding sanity check**

Run:

```bash
grep -in "mutua" public/propostas/studio-viva.html
```

Expected: every matched line reads **"Muthua"** (with H) — nav logo, hero eyebrow, contrato note about "verba de anúncio", the two WhatsApp pre-filled messages that mention the partnership, and the footer wordmark/copyright. No line should contain "Mutua" without the H.

- [ ] **Step 4: Confirm old cinematic-theme code is gone**

Run:

```bash
grep -in "grad-bg\|blob\|ticker\|masthead\|scene-tag\|bartimeline\|film-grain" public/propostas/studio-viva.html
```

Expected: **no output** — Task 1's full rewrite already removed the animated gradient background, grain overlay, blobs, ticker, masthead, scene-tag framing, and bar-timeline from the old design.

- [ ] **Step 5: Iframe embed check**

With the Next.js dev server running (`npm run dev`), open `/propostas/studio-viva` in the browser. Confirm the page loads inside the iframe defined by `app/propostas/studio-viva/page.jsx`, with no console errors and no layout overflow inside the iframe frame.

- [ ] **Step 6: Push to remote**

```bash
git push
```

Expected: pushes the 11 commits from Tasks 1–11 to `origin/main` (the branch already tracks `origin/main` from earlier commits in this repo).

---

## Self-Review

**Spec coverage** (against `docs/superpowers/specs/2026-06-11-viva-proposal-redesign-design.md`):
- Paleta/tipografia/grid language (main-site tokens, Fraunces+Inter, `gap:1px` bento) → Task 1.
- Movimento: scroll-reveal with staggered cascade, hover lift, counters kept → Task 10 (and `.cell:hover` in Task 1).
- Branding "Muthua" kept everywhere → Tasks 2, 3, 7, 8, 9; checked in Task 12 Step 3.
- Hero bento (large card + 3-card column, "Olá, Érica e Vinícius.", responsive stack, staggered entrance ~100ms) → Task 3.
- Diagnóstico asymmetric bento → Task 4.
- Planos P/M/G with preserved prices/items/WhatsApp links → Task 5.
- Como funciona numbered bento → Task 6.
- Contrato bento (3/12-month terms preserved) → Task 7.
- CTA final exact copy "Érica e Vinícius, vamos colocar a Vivá em movimento?" → Task 8.
- Footer bento (wordmark/signature, WhatsApp, metadata, copyright) → Task 9.
- PDF download button + `window.print()` + `@media print` (hide nav/progress/button, dark→light, grid simplification, print header, WhatsApp as text, `beforeprint` counters) → Tasks 2 and 11.
- "Fora de escopo" items (main homepage, other tool pages, real photos) → untouched by this plan (single file only).

**Placeholder scan:** no "TBD"/"TODO"/"similar to Task N" — every step has full HTML/CSS/JS or an exact shell command.

**Type/naming consistency:** `.reveal`/`.in`, `.hero-enter`/`.in`, `.bento`/`.cell`/`.cell-light`/`.cell-dark`/`.cell-accent`, `data-counter`/`data-prefix`/`data-suffix`, `formatBR`/`runCounter` are defined once (Task 1 and Task 10) and used consistently with the same names across Tasks 3–11. Section ids (`#hero`, `#diagnostico`, `#planos`, `#como-funciona`, `#contrato`, `#contato`, `#footer`) match the print-stylesheet selectors in Task 11.


// node --test scripts/precos-py/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseValor, extrairResumo, resumir } from './parser.mjs';

test('parseValor aceita formatos BR e US', () => {
  assert.equal(parseValor('1.234,56'), 1234.56);
  assert.equal(parseValor('1,234.56'), 1234.56);
  assert.equal(parseValor('799'), 799);
});

test('resumir filtra abaixo do mínimo e calcula mediana', () => {
  assert.deepEqual(resumir([15, 700, 750, 800], 300), {
    min: 700, mediana: 750, max: 800, ofertas: 3,
  });
  assert.equal(resumir([10], 300), null);
});

test('usa JSON-LD quando existe', () => {
  const html = `<script type="application/ld+json">
    {"@type":"Product","offers":{"@type":"AggregateOffer","lowPrice":"689.00","priceCurrency":"USD",
     "offers":[{"price":"689.00","priceCurrency":"USD"},{"price":"3900","priceCurrency":"BRL"}]}}
  </script>`;
  const r = extrairResumo(html, 0);
  assert.equal(r.metodo, 'json-ld');
  assert.equal(r.min, 689);
});

test('cai para texto "US$" sem JSON-LD', () => {
  const html = `<div class="price">US$ <span>712,50</span></div>
    <div>US$ 689,00</div><div>US$ 12,90</div><div>R$ 3.900,00</div>`;
  const r = extrairResumo(html, 300);
  assert.equal(r.metodo, 'texto');
  assert.deepEqual([r.min, r.max, r.ofertas], [689, 712.5, 2]);
});

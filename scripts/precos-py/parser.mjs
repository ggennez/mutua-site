// Extrai preços em US$ do HTML de uma página de busca do Compras Paraguai.
// A estrutura do site pode mudar, então tentamos duas estratégias:
//   1. JSON-LD (schema.org Product/Offer) — mais estável quando existe.
//   2. Texto "US$ 1.234,56" no HTML — fallback genérico.

export function parseValor(txt) {
  // "1.234,56" -> 1234.56 | "1234.56" -> 1234.56 | "1,234.56" -> 1234.56
  let s = String(txt).trim().replace(/\s/g, '');
  if (/,\d{1,2}$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');
  else s = s.replace(/,/g, '');
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

function coletarOffers(no, out) {
  if (!no || typeof no !== 'object') return;
  if (Array.isArray(no)) return no.forEach((x) => coletarOffers(x, out));
  const moeda = no.priceCurrency;
  for (const k of ['price', 'lowPrice']) {
    if (no[k] != null && (!moeda || moeda === 'USD')) {
      const v = parseValor(no[k]);
      if (v) out.push(v);
    }
  }
  for (const v of Object.values(no)) if (typeof v === 'object') coletarOffers(v, out);
}

export function extrairPrecosJsonLd(html) {
  const out = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(re)) {
    try {
      coletarOffers(JSON.parse(m[1]), out);
    } catch {
      // bloco JSON-LD inválido: ignora
    }
  }
  return out;
}

export function extrairPrecosTexto(html) {
  const texto = html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');
  const out = [];
  for (const m of texto.matchAll(/US\$\s*([\d.,]+)/g)) {
    const v = parseValor(m[1]);
    if (v) out.push(v);
  }
  return out;
}

export function resumir(precos, precoMinimoUSD = 0) {
  const validos = precos.filter((p) => p >= precoMinimoUSD).sort((a, b) => a - b);
  if (!validos.length) return null;
  const meio = Math.floor(validos.length / 2);
  const mediana =
    validos.length % 2 ? validos[meio] : (validos[meio - 1] + validos[meio]) / 2;
  return {
    min: validos[0],
    mediana: Math.round(mediana * 100) / 100,
    max: validos[validos.length - 1],
    ofertas: validos.length,
  };
}

export function extrairResumo(html, precoMinimoUSD = 0) {
  const jsonLd = resumir(extrairPrecosJsonLd(html), precoMinimoUSD);
  if (jsonLd) return { ...jsonLd, metodo: 'json-ld' };
  const texto = resumir(extrairPrecosTexto(html), precoMinimoUSD);
  if (texto) return { ...texto, metodo: 'texto' };
  return null;
}

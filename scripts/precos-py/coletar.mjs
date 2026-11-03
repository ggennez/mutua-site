// Coleta preços no Compras Paraguai + cotação do dólar e grava no histórico.
// Uso: node scripts/precos-py/coletar.mjs
// Rodado 3x ao dia pelo workflow .github/workflows/precos-py.yml

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { extrairResumo } from './parser.mjs';

const aqui = dirname(fileURLToPath(import.meta.url));
const CONFIG = resolve(aqui, 'config.json');
const HISTORICO = resolve(aqui, '../../public/data/precos-py/historico.json');
const URL_BUSCA = 'https://www.comprasparaguai.com.br/busca/?q={termo}';
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
  'Accept-Language': 'pt-BR,pt;q=0.9',
};

async function getJson(url) {
  const r = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(20000) });
  if (!r.ok) throw new Error(`${url} -> HTTP ${r.status}`);
  return r.json();
}

async function cotacaoDolar() {
  try {
    const j = await getJson('https://economia.awesomeapi.com.br/json/last/USD-BRL');
    return { valor: Number(j.USDBRL.bid), fonte: 'awesomeapi' };
  } catch (e) {
    console.warn('AwesomeAPI falhou:', e.message);
  }
  try {
    // PTAX venda (série 1 do SGS/BCB) — só atualiza em dias úteis
    const j = await getJson(
      'https://api.bcb.gov.br/dados/serie/bcdata.sgs.1/dados/ultimos/1?formato=json',
    );
    return { valor: Number(j[0].valor), fonte: 'bcb-ptax' };
  } catch (e) {
    console.warn('BCB falhou:', e.message);
  }
  return null;
}

async function buscar(termo, precoMinimoUSD, urlBusca) {
  const url = urlBusca.replace('{termo}', encodeURIComponent(termo).replace(/%20/g, '+'));
  const r = await fetch(url, { headers: HEADERS, signal: AbortSignal.timeout(30000) });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return extrairResumo(await r.text(), precoMinimoUSD);
}

async function lerHistorico() {
  try {
    return JSON.parse(await readFile(HISTORICO, 'utf8'));
  } catch {
    return { atualizadoEm: null, dolar: [], precos: [] };
  }
}

const config = JSON.parse(await readFile(CONFIG, 'utf8'));
const historico = await lerHistorico();
const agora = new Date().toISOString();

const dolar = await cotacaoDolar();
if (dolar) historico.dolar.push({ data: agora, ...dolar });

let falhas = 0;
for (const { termo, precoMinimoUSD = 0 } of config.termos) {
  try {
    const resumo = await buscar(termo, precoMinimoUSD, config.urlBusca || URL_BUSCA);
    if (!resumo) throw new Error('nenhum preço encontrado (layout do site mudou?)');
    historico.precos.push({ data: agora, termo, ...resumo, dolar: dolar?.valor ?? null });
    console.log(`✔ ${termo}: US$ ${resumo.min} (mín) · ${resumo.ofertas} ofertas · ${resumo.metodo}`);
  } catch (e) {
    falhas++;
    console.error(`✘ ${termo}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 3000)); // educação com o servidor
}

historico.atualizadoEm = agora;
await mkdir(dirname(HISTORICO), { recursive: true });
await writeFile(HISTORICO, JSON.stringify(historico, null, 1) + '\n');

if (falhas === config.termos.length) {
  console.error('Todas as buscas falharam.');
  process.exit(1);
}

# Radar Paraguai — MVP

Gerenciador de preços do Compras Paraguai com histórico, tendência, cruzamento com o dólar e custo real da viagem.

## Como funciona

```
GitHub Actions (08h, 14h, 20h BRT)
  └─ scripts/precos-py/coletar.mjs
       ├─ busca cada termo de config.json no Compras Paraguai
       ├─ extrai preços em US$ (JSON-LD → fallback texto "US$ ...")
       ├─ pega o dólar (AwesomeAPI → fallback PTAX/BCB)
       └─ grava public/data/precos-py/historico.json e faz commit
Painel: /precos-py  (public/tools/precos-py.html)
```

- **Termos monitorados:** edite `config.json`. O termo é buscado sempre exatamente igual.
  `precoMinimoUSD` descarta resultados baratos que não são o produto (capinhas, cabos etc.).
- **Rodar manualmente:** `node scripts/precos-py/coletar.mjs` ou "Run workflow" na aba Actions.
- **Testes do parser:** `node --test scripts/precos-py/*.test.mjs`
- **Demonstração sem dados:** abra `/tools/precos-py.html?demo` (dados fictícios, marcados no topo).

## Painel

- Menor preço e mediana em US$ por coleta; dólar e preço convertido em R$ em gráficos separados.
- Tendência = regressão linear dos últimos 14 dias, em % por semana (±1% = estável).
- A variação em R$ é separada em "efeito preço em US$" e "efeito câmbio".
- Calculadora: combustível (km ida×2 ÷ km/l × R$/l), pedágio, estacionamento, comida, valor da sua hora,
  spread+IOF, imposto sobre o que passar da cota e rateio entre pessoas; compara com o preço no Brasil.

## Limitações conhecidas

- O seletor da URL de busca (`/busca/?q=`) e o formato dos preços **não foram validados contra o site real**
  (a rede do ambiente de desenvolvimento bloqueava o domínio). Rode o workflow uma vez e confira o log;
  se aparecer "nenhum preço encontrado", ajuste `parser.mjs` ou defina `urlBusca` em `config.json`.
- Verifique os Termos de Uso do site antes de uso em escala.
- Cota de isenção (US$ 500 por via terrestre), alíquota de 50% e IOF são padrões editáveis no painel;
  confirme as regras vigentes na Receita Federal.

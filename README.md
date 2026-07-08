# LP Service Desk & Field Services — Engemon IT

Landing page em **HTML estático puro** (sem dependência de runtime). Stack alvo: GitHub + Vercel + Web3Forms.

## Estrutura
```
index.html              ← página única (HTML + CSS + JS inline)
assets/                 ← logos Engemon IT
fonts/                  ← Hanken Grotesk (normal + itálico)
screenshots/            ← prévias (não usadas pela página; pode remover antes do deploy)
```

## O que mudou em relação ao export do Claude Design
- Removida a dependência do `support.js` e da sintaxe `<x-dc>` / `{{ }}` / `sc-if`. Tudo virou HTML + JS vanilla.
- Hover states (antes `style-hover`) viraram regras CSS reais.
- O botão simulado virou um `<form>` real que envia para o **Web3Forms**.
- Adicionada captura de **GCLID + UTMs** (campos ocultos, persistidos em localStorage) para fechar o loop de atribuição com Google Ads / Salesforce.
- Adicionado **GTM** (head + noscript) e um `dataLayer.push({event:'lead_form_submit'})` no envio com sucesso.

## Antes de publicar — 2 ajustes obrigatórios

1. **Web3Forms access key** (`index.html`, dentro do `<form>`):
   ```html
   <input type="hidden" name="access_key" value="305caba5-33b3-4d4e-9e4e-d2bdc2037517">
   ```
   Já está com a key que você usa na LP HaaS. Os leads chegam no e-mail vinculado a essa key. Se quiser separar os leads desta LP, gere uma nova key em web3forms.com e troque aqui.

2. **GTM container ID** — substitua `GTM-XXXXXXX` (aparece 3x: script no `<head>`, noscript no `<body>`). Se ainda não for usar GTM, pode deixar como está sem quebrar nada, ou remover os dois blocos marcados com comentário `GOOGLE TAG MANAGER`.

## Deploy (mesmo fluxo da LP HaaS)
1. Suba a pasta no repositório GitHub (pode ser o mesmo padrão `joelaltengemon/...`).
2. No Vercel: New Project → importe o repo → framework preset **Other** → deploy. Sem build, é estático.
3. Aponte o domínio/subdomínio desejado.

## Configuração de conversão (próximo passo, fora desta LP)
- No GTM: tag de conversão do Google Ads disparando no evento `lead_form_submit`.
- Marcar a conversão de lead como **primária** no Google Ads.
- Importação offline do Salesforce via GCLID (já capturado no form) quando o lead virar oportunidade.

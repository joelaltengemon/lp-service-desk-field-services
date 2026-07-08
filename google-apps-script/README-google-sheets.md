# Google Sheets sem custo — via Google Apps Script

Como o Web3Forms no plano Free não libera a integração nativa com Google Sheets,
esta LP grava os leads em uma planilha própria, em paralelo ao envio por
e-mail (que continua indo pelo Web3Forms normalmente). Não depende de nenhum
plano pago.

## Passo a passo (uns 5 minutos)

1. **Crie a planilha.** No Google Drive, crie uma Google Sheet nova.
   Sugestão de nome: `Leads - LP Service Desk e Field Services`.

2. **Abra o editor de script.** Dentro da planilha, no menu:
   `Extensões > Apps Script`.

3. **Cole o código.** Apague o conteúdo padrão do arquivo `Code.gs` que abrir
   e cole todo o conteúdo do arquivo `Code.gs` que está nesta pasta
   (`google-apps-script/Code.gs`). Salve (ícone de disquete ou Ctrl+S).

4. **Implante como App da Web.**
   - Clique em **Implantar** (canto superior direito) → **Nova implantação**.
   - Clique no ícone de engrenagem ao lado de "Selecionar tipo" → **App da Web**.
   - Preencha:
     - **Executar como:** Eu (sua conta)
     - **Quem pode acessar:** Qualquer pessoa
   - Clique em **Implantar**.
   - Na primeira vez, o Google vai pedir autorização — autorize com a conta
     dona da planilha (recomendo uma conta `@engemon`, não pessoal).

5. **Copie a URL do App da Web.** Tem esse formato:
   `https://script.google.com/macros/s/AKfycb........../exec`

6. **Cole a URL no código da LP.** Abra `index.html`, procure por:
   ```js
   var SHEETS_WEBHOOK_URL = 'COLE_AQUI_A_URL_DO_APPS_SCRIPT';
   ```
   e troque pelo link copiado no passo 5, entre aspas. Salve.

7. **Teste.** Preencha o formulário na LP publicada (ou localmente) e envie.
   Volte na planilha — a linha deve aparecer em poucos segundos, com uma aba
   chamada **Leads** e o cabeçalho já formatado em negrito.

## O que cai em cada coluna

| Coluna | Origem |
|---|---|
| Data/Hora | Preenchido automaticamente no envio |
| Nome, Empresa, Cargo, Telefone, E-mail | Campos do formulário |
| Volume de chamados/mês | A pergunta de faixa de chamados |
| Mensagem | Campo livre opcional |
| GCLID | Capturado da URL quando o clique vem do Google Ads |
| UTM Source / Medium / Campaign | Capturados da URL da campanha |
| Página | Fixo: "LP Service Desk e Field Services" |

O GCLID e as UTMs são os mesmos que já alimentam o e-mail do Web3Forms —
aqui você tem os dois canais recebendo os mesmos dados de atribuição.

## Se quiser reautorizar ou atualizar o código depois

Qualquer alteração no `Code.gs` exige um novo **Implantar > Gerenciar
implantações > editar (ícone de lápis) > Nova versão** para valer. Só salvar
o arquivo não atualiza a URL já publicada.

## Por que o e-mail continua funcionando normalmente

O envio para o Apps Script é "fire-and-forget": a LP dispara os dados para a
planilha e, independentemente do resultado dessa chamada, segue com o envio
normal para o Web3Forms (que manda o e-mail e mostra a tela de sucesso). Ou
seja, mesmo que a URL do Apps Script esteja errada, expirada ou fora do ar,
o formulário continua funcionando e você não perde nenhum lead por e-mail —
só deixa de ter aquele lead na planilha até corrigir a URL.

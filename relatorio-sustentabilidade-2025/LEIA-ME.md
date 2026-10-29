# Relatório de Sustentabilidade Engemon 2025

Publicado em https://sustentabilidade.engemon.com.br (o vercel.json da raiz reescreve esse host para esta pasta).

- `index.html`: tela de cadastro por e-mail + leitor do relatório em imagens.
- `p/`: páginas do relatório em JPG (nomes embaralhados de propósito).
- `m.json`: lista das páginas e dos links internos de navegação.
- Os e-mails vão para a planilha do Google via Apps Script (constante `ENDPOINT` no `index.html`).

Para atualizar o relatório: gerar as páginas de novo a partir do PDF final e substituir `p/` e `m.json`.
Não criar um `index.html` na raiz do repositório: ele passaria na frente da reescrita do subdomínio.

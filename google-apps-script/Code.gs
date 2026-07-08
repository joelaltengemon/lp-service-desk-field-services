/**
 * LP Service Desk & Field Services — Engemon IT
 * Recebe os envios do formulário e grava cada lead como uma linha na planilha.
 *
 * COMO INSTALAR (passo a passo completo no README-google-sheets.md):
 * 1. Crie uma Google Sheet nova (ou abra uma existente).
 * 2. No menu: Extensões > Apps Script.
 * 3. Apague o conteúdo padrão (Code.gs) e cole todo este arquivo no lugar.
 * 4. Clique em "Implantar" > "Nova implantação".
 * 5. Tipo: "App da Web". Executar como: "Eu". Quem pode acessar: "Qualquer pessoa".
 * 6. Implante e copie a URL do "App da Web" (algo como
 *    https://script.google.com/macros/s/AKfycb.../exec).
 * 7. Cole essa URL no index.html, na constante SHEETS_WEBHOOK_URL.
 */

var SHEET_NAME = 'Leads';

var HEADERS = [
  'Data/Hora',
  'Nome',
  'Empresa',
  'Cargo',
  'Telefone',
  'E-mail',
  'Volume de chamados/mês',
  'Mensagem',
  'GCLID',
  'UTM Source',
  'UTM Medium',
  'UTM Campaign',
  'Página'
];

function doPost(e) {
  try {
    var sheet = getOrCreateSheet_();
    var p = (e && e.parameter) ? e.parameter : {};

    sheet.appendRow([
      new Date(),
      p.nome || '',
      p.empresa || '',
      p.cargo || '',
      p.telefone || '',
      p.email || '',
      p.volume_chamados || '',
      p.mensagem || '',
      p.gclid || '',
      p.utm_source || '',
      p.utm_medium || '',
      p.utm_campaign || '',
      p.pagina || ''
    ]);

    return jsonResponse_({ result: 'success' });
  } catch (err) {
    return jsonResponse_({ result: 'error', message: String(err) });
  }
}

// Permite abrir a URL no navegador para confirmar que o endpoint está ativo
function doGet(e) {
  return ContentService.createTextOutput('Endpoint ativo. Use POST para enviar dados.');
}

function getOrCreateSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

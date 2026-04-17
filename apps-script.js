// ════════════════════════════════════════════════════════════════
//  GOOGLE APPS SCRIPT — Mapa de Trabalho Secretarias
//  Cole este código em script.google.com e publique como Web App
// ════════════════════════════════════════════════════════════════

const SHEET_NAME = "Respostas"; // nome da aba na planilha

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    saveToSheet(data);
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Permite testar via GET no browser
function doGet(e) {
  return ContentService
    .createTextOutput("Script ativo ✓")
    .setMimeType(ContentService.MimeType.TEXT);
}

function saveToSheet(data) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);

  // Cria a aba se não existir
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Cabeçalhos (só insere se a planilha estiver vazia)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Secretaria",
      "Contato",
      "Cidade",
      "Telefone",
      "E-mail",
      // Cadeiras
      "Cadeiras — Necessita",
      "Cadeiras — Tipo",
      "Cadeiras — Fechamento",
      "Cadeiras — Qtd",
      // Mesas
      "Mesas — Necessita",
      "Mesas — Tipo",
      "Mesas — Fechamento",
      "Mesas — Qtd",
      // Ponto Energia
      "Ponto Energia — Necessita",
      "Ponto Energia — Tipo",
      "Ponto Energia — Fechamento",
      "Ponto Energia — Tensão",
      "Ponto Energia — Amperagem",
      "Ponto Energia — Qtd",
      // Ponto Internet
      "Ponto Internet — Necessita",
      "Ponto Internet — Tipo",
      "Ponto Internet — Fechamento",
      "Ponto Internet — Qtd",
      // Iluminação
      "Iluminação — Necessita",
      "Iluminação — Tipo",
      "Iluminação — Fechamento",
      "Iluminação — Qtd",
      // Tendas
      "Tenda 3x3 — Necessita", "Tenda 3x3 — Tipo", "Tenda 3x3 — Fechamento", "Tenda 3x3 — Qtd",
      "Tenda 4x4 — Necessita", "Tenda 4x4 — Tipo", "Tenda 4x4 — Fechamento", "Tenda 4x4 — Qtd",
      "Tenda 5x5 — Necessita", "Tenda 5x5 — Tipo", "Tenda 5x5 — Fechamento", "Tenda 5x5 — Qtd",
      "Tenda 6x6 — Necessita", "Tenda 6x6 — Tipo", "Tenda 6x6 — Fechamento", "Tenda 6x6 — Qtd",
    ]);

    // Formata cabeçalho
    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    headerRange.setBackground("#1b5e20");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  // Linha de dados
  sheet.appendRow([
    data.timestamp             || "",
    data.secretaria            || "",
    data.contato               || "",
    data.cidade                || "",
    data.telefone              || "",
    data.email                 || "",
    data.cadeiras_necessita    || "",
    data.cadeiras_tipo         || "",
    data.cadeiras_fechamento   || "",
    data.cadeiras_qtd          || "",
    data.mesas_necessita       || "",
    data.mesas_tipo            || "",
    data.mesas_fechamento      || "",
    data.mesas_qtd             || "",
    data.energia_necessita     || "",
    data.energia_tipo          || "",
    data.energia_fechamento    || "",
    data.energia_tensao        || "",
    data.energia_ampere        || "",
    data.energia_qtd           || "",
    data.internet_necessita    || "",
    data.internet_tipo         || "",
    data.internet_fechamento   || "",
    data.internet_qtd          || "",
    data.iluminacao_necessita  || "",
    data.iluminacao_tipo       || "",
    data.iluminacao_fechamento || "",
    data.iluminacao_qtd        || "",
    data.tenda3_necessita      || "", data.tenda3_tipo || "", data.tenda3_fechamento || "", data.tenda3_qtd || "",
    data.tenda4_necessita      || "", data.tenda4_tipo || "", data.tenda4_fechamento || "", data.tenda4_qtd || "",
    data.tenda5_necessita      || "", data.tenda5_tipo || "", data.tenda5_fechamento || "", data.tenda5_qtd || "",
    data.tenda6_necessita      || "", data.tenda6_tipo || "", data.tenda6_fechamento || "", data.tenda6_qtd || "",
  ]);

  setupTotalSheet(ss);
}

function setupTotalSheet(ss) {
  let sheet = ss.getSheetByName("total");
  if (!sheet) {
    sheet = ss.insertSheet("total");
    sheet.appendRow(["Item", "Quantidade Total"]);
    sheet.appendRow(["Cadeiras", "=SUM(Respostas!J:J)"]);
    sheet.appendRow(["Mesas", "=SUM(Respostas!N:N)"]);
    sheet.appendRow(["Ponto Energia", "=SUM(Respostas!T:T)"]);
    sheet.appendRow(["Ponto Internet", "=SUM(Respostas!X:X)"]);
    sheet.appendRow(["Iluminação", "=SUM(Respostas!AB:AB)"]);
    sheet.appendRow(["Tenda 3x3", "=SUM(Respostas!AF:AF)"]);
    sheet.appendRow(["Tenda 4x4", "=SUM(Respostas!AJ:AJ)"]);
    sheet.appendRow(["Tenda 5x5", "=SUM(Respostas!AN:AN)"]);
    sheet.appendRow(["Tenda 6x6", "=SUM(Respostas!AR:AR)"]);

    const headerRange = sheet.getRange("A1:B1");
    headerRange.setBackground("#1b5e20");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, 2);
  }
}

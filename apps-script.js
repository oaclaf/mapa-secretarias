// Google Apps Script - Mapa de Trabalho Secretarias
// Publique como Web App.

const SHEET_NAME = "Respostas";
const SHEET_HEADERS = [
  "Timestamp",
  "Secretaria",
  "Contato",
  "Cidade",
  "Telefone",
  "E-mail",
  "Cadeiras - Necessita",
  "Cadeiras - OBS:",
  "Cadeiras - Fechamento",
  "Cadeiras - Qtd",
  "Mesas - Necessita",
  "Mesas - OBS:",
  "Mesas - Fechamento",
  "Mesas - Qtd",
  "Ponto Energia - Necessita",
  "Ponto Energia - OBS:",
  "Ponto Energia - Fechamento",
  "Ponto Energia - Qtd 110/10A",
  "Ponto Energia - Qtd 220/20A",
  "Ponto Energia - Qtd",
  "Ponto Internet - Necessita",
  "Ponto Internet - OBS:",
  "Ponto Internet - Fechamento",
  "Ponto Internet - Qtd",
  "Iluminacao - Necessita",
  "Iluminacao - OBS:",
  "Iluminacao - Fechamento",
  "Iluminacao - Qtd",
  "Stand 4x3 - OBS:",
  "Stand 4x3 - Fechamento",
  "Stand 4x3 - Qtd",
  "Tenda 3x3 Nova - OBS:",
  "Tenda 3x3 Nova - Fechamento",
  "Tenda 3x3 Nova - Qtd",
  "Tenda 4x4 - Necessita",
  "Tenda 4x4 - OBS:",
  "Tenda 4x4 - Fechamento",
  "Tenda 4x4 - Qtd",
  "Tenda 5x5 - Necessita",
  "Tenda 5x5 - OBS:",
  "Tenda 5x5 - Fechamento",
  "Tenda 5x5 - Qtd",
  "Tenda 6x6 - Necessita",
  "Tenda 6x6 - OBS:",
  "Tenda 6x6 - Fechamento",
  "Tenda 6x6 - Qtd",
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    saveToSheet(data);
    return createOutput_({ status: "ok" }, e);
  } catch (err) {
    return createOutput_({ status: "error", message: err.message }, e);
  }
}

// Permite testar via GET no browser ou retornar os dados do painel.
function doGet(e) {
  if (e && e.parameter && e.parameter.action === "get_data") {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return createOutput_({ status: "error", message: "Aba nao encontrada" }, e);
    }

    const maxRows = sheet.getLastRow();
    const maxCols = sheet.getLastColumn();

    if (maxRows <= 1) {
      return createOutput_({ status: "ok", data: [] }, e);
    }

    const dataRange = sheet.getRange(2, 1, maxRows - 1, maxCols);
    const dataValues = dataRange.getValues();
    const headers = sheet.getRange(1, 1, 1, maxCols).getValues()[0];

    const result = dataValues.map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    });

    return createOutput_({ status: "ok", data: result }, e);
  }

  return ContentService.createTextOutput("Script ativo").setMimeType(
    ContentService.MimeType.TEXT,
  );
}

function createOutput_(payload, e) {
  const callback = e && e.parameter ? e.parameter.callback : "";
  if (callback) {
    return ContentService.createTextOutput(
      callback + "(" + JSON.stringify(payload) + ");",
    ).setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SHEET_HEADERS);

    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    headerRange.setBackground("#1b5e20");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  const existingHeaders = ensureHeaders_(sheet);
  const rowByHeader = {
    "Timestamp": data.timestamp || "",
    "Secretaria": data.secretaria || "",
    "Contato": data.contato || "",
    "Cidade": data.cidade || "",
    "Telefone": data.telefone || "",
    "E-mail": data.email || "",
    "Cadeiras - Necessita": data.cadeiras_necessita || "",
    "Cadeiras - OBS:": data.cadeiras_tipo || "",
    "Cadeiras - Fechamento": data.cadeiras_fechamento || "",
    "Cadeiras - Qtd": data.cadeiras_qtd || "",
    "Mesas - Necessita": data.mesas_necessita || "",
    "Mesas - OBS:": data.mesas_tipo || "",
    "Mesas - Fechamento": data.mesas_fechamento || "",
    "Mesas - Qtd": data.mesas_qtd || "",
    "Ponto Energia - Necessita": data.energia_necessita || "",
    "Ponto Energia - OBS:": data.energia_tipo || "",
    "Ponto Energia - Fechamento": data.energia_fechamento || "",
    "Ponto Energia - Qtd 110/10A": data.energia_qtd_110 || "",
    "Ponto Energia - Qtd 220/20A": data.energia_qtd_220 || "",
    "Ponto Energia - Qtd": (Number(data.energia_qtd_110 || 0) + Number(data.energia_qtd_220 || 0)) || "",
    "Ponto Internet - Necessita": data.internet_necessita || "",
    "Ponto Internet - OBS:": data.internet_tipo || "",
    "Ponto Internet - Fechamento": data.internet_fechamento || "",
    "Ponto Internet - Qtd": data.internet_qtd || "",
    "Iluminacao - Necessita": data.iluminacao_necessita || "",
    "Iluminacao - OBS:": data.iluminacao_tipo || "",
    "Iluminacao - Fechamento": data.iluminacao_fechamento || "",
    "Iluminacao - Qtd": data.iluminacao_qtd || "",
    "Stand 4x3 - OBS:": data.tenda3_tipo || "",
    "Stand 4x3 - Fechamento": "",
    "Stand 4x3 - Qtd": data.tenda3_qtd || "",
    "Tenda 3x3 Nova - OBS:": data.tenda33_tipo || "",
    "Tenda 3x3 Nova - Fechamento": data.tenda33_fechamento || "",
    "Tenda 3x3 Nova - Qtd": data.tenda33_qtd || "",
    "Tenda 4x4 - Necessita": data.tenda4_necessita || "",
    "Tenda 4x4 - OBS:": data.tenda4_tipo || "",
    "Tenda 4x4 - Fechamento": data.tenda4_fechamento || "",
    "Tenda 4x4 - Qtd": data.tenda4_qtd || "",
    "Tenda 5x5 - Necessita": data.tenda5_necessita || "",
    "Tenda 5x5 - OBS:": data.tenda5_tipo || "",
    "Tenda 5x5 - Fechamento": data.tenda5_fechamento || "",
    "Tenda 5x5 - Qtd": data.tenda5_qtd || "",
    "Tenda 6x6 - Necessita": data.tenda6_necessita || "",
    "Tenda 6x6 - OBS:": data.tenda6_tipo || "",
    "Tenda 6x6 - Fechamento": data.tenda6_fechamento || "",
    "Tenda 6x6 - Qtd": data.tenda6_qtd || "",
  };

  const row = existingHeaders.map((header) => rowByHeader[header] || "");
  sheet.appendRow(row);

  setupTotalSheet(ss);
}

function ensureHeaders_(sheet) {
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const currentHeaders = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].filter(Boolean);
  const missingHeaders = SHEET_HEADERS.filter((header) => !currentHeaders.includes(header));

  if (missingHeaders.length) {
    const startColumn = currentHeaders.length + 1;
    sheet.getRange(1, startColumn, 1, missingHeaders.length).setValues([missingHeaders]);

    const newHeaderRange = sheet.getRange(1, startColumn, 1, missingHeaders.length);
    newHeaderRange.setBackground("#1b5e20");
    newHeaderRange.setFontColor("#ffffff");
    newHeaderRange.setFontWeight("bold");
  }

  return currentHeaders.concat(missingHeaders);
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
    sheet.appendRow(["Iluminacao", "=SUM(Respostas!AB:AB)"]);
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

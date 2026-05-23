// Google Apps Script - Mapa de Trabalho Secretarias
// Publique como Web App.

const SHEET_NAME = "Respostas";

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
    sheet.appendRow([
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
      "Tenda 3x3 - Necessita",
      "Tenda 3x3 - OBS:",
      "Tenda 3x3 - Fechamento",
      "Tenda 3x3 - Qtd",
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
    ]);

    const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
    headerRange.setBackground("#1b5e20");
    headerRange.setFontColor("#ffffff");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }

  sheet.appendRow([
    data.timestamp || "",
    data.secretaria || "",
    data.contato || "",
    data.cidade || "",
    data.telefone || "",
    data.email || "",
    data.cadeiras_necessita || "",
    data.cadeiras_tipo || "",
    data.cadeiras_fechamento || "",
    data.cadeiras_qtd || "",
    data.mesas_necessita || "",
    data.mesas_tipo || "",
    data.mesas_fechamento || "",
    data.mesas_qtd || "",
    data.energia_necessita || "",
    data.energia_tipo || "",
    data.energia_fechamento || "",
    data.energia_qtd_110 || "",
    data.energia_qtd_220 || "",
    (Number(data.energia_qtd_110 || 0) + Number(data.energia_qtd_220 || 0)) || "",
    data.internet_necessita || "",
    data.internet_tipo || "",
    data.internet_fechamento || "",
    data.internet_qtd || "",
    data.iluminacao_necessita || "",
    data.iluminacao_tipo || "",
    data.iluminacao_fechamento || "",
    data.iluminacao_qtd || "",
    data.tenda3_necessita || "",
    data.tenda3_tipo || "",
    data.tenda3_fechamento || "",
    data.tenda3_qtd || "",
    data.tenda4_necessita || "",
    data.tenda4_tipo || "",
    data.tenda4_fechamento || "",
    data.tenda4_qtd || "",
    data.tenda5_necessita || "",
    data.tenda5_tipo || "",
    data.tenda5_fechamento || "",
    data.tenda5_qtd || "",
    data.tenda6_necessita || "",
    data.tenda6_tipo || "",
    data.tenda6_fechamento || "",
    data.tenda6_qtd || "",
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

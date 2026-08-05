// ============================================================
//  SoftSync Lab Internship — Backend (Google Apps Script)
//  ------------------------------------------------------------
//  This is the "database" brain for your web app.
//  It talks to your Google Sheet: saves new rows and returns rows.
//
//  STEP 1: Go to https://sheets.new  →  create a spreadsheet
//  STEP 2: Name the FIRST tab exactly like a table, e.g.  products
//          Add a header row:  product_name | category | price | stock
//  STEP 3: In that spreadsheet: Extensions → Apps Script
//  STEP 4: Delete everything, paste THIS whole file, save.
//  STEP 5: Click Deploy → New deployment → Web app
//            - Execute as:  Me
//            - Who has access:  Anyone
//  STEP 6: Copy the Web app URL (ends in /exec)
//  STEP 7: Paste that URL into index.html where it says:
//            const SCRIPT_URL = "PASTE_YOUR_URL_HERE";
// ============================================================

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var output = { success: false, error: "" };

  try {
    var body = {};
    if (e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      body = e.parameter;
    }

    var table = String(body.table || "").trim();
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(table);

    if (!sheet) {
      throw "Sheet '" + table + "' not found. Make sure a tab has exactly this name.";
    }

    if (body.action === "list") {
      output = listRows(sheet);
    } else {
      output = addRow(sheet, body.data || {});
    }
  } catch (err) {
    output = { success: false, error: String(err) };
  }

  return jsonResponse(output);
}

function listRows(sheet) {
  var values = sheet.getDataRange().getValues();
  if (values.length === 0) return { success: true, data: [] };

  var headers = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = values[i][j];
    }
    rows.push(row);
  }
  return { success: true, data: rows };
}

function addRow(sheet, data) {
  var headerRow = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var newRow = [];
  for (var h = 0; h < headerRow.length; h++) {
    var key = String(headerRow[h]).trim();
    newRow.push(data[key] !== undefined && data[key] !== null ? data[key] : "");
  }
  sheet.appendRow(newRow);
  return { success: true, message: "Saved!" };
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

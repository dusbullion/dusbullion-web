// app/lib/google-sheets.ts
import { google } from "googleapis";

const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;
const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY!;

// ✅ Create authorized Sheets client using the *object* form of JWT
function getSheetsClient() {
  const jwt = new google.auth.JWT({
    email: serviceAccountEmail,
    key: serviceAccountKey.replace(/\\n/g, "\n"), // handle escaped newlines
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth: jwt });
}

/**
 * Append a single order row to the "Orders" sheet.
 * Make sure your sheet has an "Orders" tab and header row.
 */
export async function appendOrderToSheet(row: (string | number | null)[]) {
  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Orders!A:Z", // assumes your sheet tab is named "Orders"
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [row],
    },
  });
}

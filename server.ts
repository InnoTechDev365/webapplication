import express from "express";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || "expensecoin-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || `${process.env.APP_URL}/auth/callback`
);

// Helper to get Google Sheets service
const getSheetsService = (tokens: any) => {
  const auth = new google.auth.OAuth2();
  auth.setCredentials(tokens);
  return google.sheets({ version: "v4", auth });
};

// Auth Routes
app.get("/api/auth/url", (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file"
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent"
  });

  res.json({ url });
});

app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    oauth2Client.setCredentials(tokens);
    const userInfo = await oauth2.userinfo.get();

    // Store tokens and user info in session
    (req.session as any).tokens = tokens;
    (req.session as any).user = userInfo.data;

    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Authentication successful. This window should close automatically.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).send("Authentication failed");
  }
});

app.get("/api/user", (req, res) => {
  if (!(req.session as any).user) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  res.json((req.session as any).user);
});

app.post("/api/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ success: true });
  });
});

// Sheet ID management
// For simplicity, we'll store the Sheet ID in the session or look for a sheet named "ExpenseCoin Data"
const getOrCreateSheet = async (tokens: any) => {
  const sheets = getSheetsService(tokens);
  const drive = google.drive({ version: "v3", auth: oauth2Client });
  
  // Search for existing sheet
  const response = await drive.files.list({
    q: "name = 'ExpenseCoin Data' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false",
    fields: "files(id, name)"
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0].id;
  }

  // Create new sheet
  const spreadsheet = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: "ExpenseCoin Data" },
      sheets: [
        { properties: { title: "Transactions" } },
        { properties: { title: "Budgets" } },
        { properties: { title: "Goals" } }
      ]
    }
  });

  const spreadsheetId = spreadsheet.data.spreadsheetId;

  // Initialize headers
  await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId!,
    range: "Transactions!A1:G1",
    valueInputOption: "RAW",
    requestBody: {
      values: [["ID", "Amount", "Category", "Description", "Date", "Type", "Created At"]]
    }
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId!,
    range: "Budgets!A1:E1",
    valueInputOption: "RAW",
    requestBody: {
      values: [["ID", "Category", "Amount", "Period", "Created At"]]
    }
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId!,
    range: "Goals!A1:F1",
    valueInputOption: "RAW",
    requestBody: {
      values: [["ID", "Name", "Target Amount", "Current Amount", "Deadline", "Created At"]]
    }
  });

  return spreadsheetId;
};

// Data Routes
app.get("/api/data", async (req, res) => {
  const tokens = (req.session as any).tokens;
  if (!tokens) return res.status(401).json({ error: "Unauthorized" });

  try {
    const spreadsheetId = await getOrCreateSheet(tokens);
    const sheets = getSheetsService(tokens);

    const [transRes, budgetRes, goalRes] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId: spreadsheetId!, range: "Transactions!A2:G1000" }),
      sheets.spreadsheets.values.get({ spreadsheetId: spreadsheetId!, range: "Budgets!A2:E1000" }),
      sheets.spreadsheets.values.get({ spreadsheetId: spreadsheetId!, range: "Goals!A2:F1000" })
    ]);

    const transactions = (transRes.data.values || []).map(row => ({
      id: row[0], amount: parseFloat(row[1]), category: row[2], description: row[3], date: row[4], type: row[5], created_at: row[6]
    }));

    const budgets = (budgetRes.data.values || []).map(row => ({
      id: row[0], category: row[1], amount: parseFloat(row[2]), period: row[3], created_at: row[4]
    }));

    const goals = (goalRes.data.values || []).map(row => ({
      id: row[0], name: row[1], target_amount: parseFloat(row[2]), current_amount: parseFloat(row[3]), deadline: row[4], created_at: row[5]
    }));

    res.json({ transactions, budgets, goals });
  } catch (error) {
    console.error("Data fetch error:", error);
    res.status(500).json({ error: "Failed to fetch data from Google Sheets" });
  }
});

app.post("/api/transactions", async (req, res) => {
  const tokens = (req.session as any).tokens;
  if (!tokens) return res.status(401).json({ error: "Unauthorized" });

  try {
    const spreadsheetId = await getOrCreateSheet(tokens);
    const sheets = getSheetsService(tokens);
    const id = Math.random().toString(36).substr(2, 9);
    const { amount, category, description, date, type } = req.body;
    const createdAt = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId!,
      range: "Transactions!A:G",
      valueInputOption: "RAW",
      requestBody: {
        values: [[id, amount, category, description, date, type, createdAt]]
      }
    });

    res.json({ id, amount, category, description, date, type, created_at: createdAt });
  } catch (error) {
    res.status(500).json({ error: "Failed to add transaction" });
  }
});

app.delete("/api/transactions/:id", async (req, res) => {
  const tokens = (req.session as any).tokens;
  if (!tokens) return res.status(401).json({ error: "Unauthorized" });

  try {
    const spreadsheetId = await getOrCreateSheet(tokens);
    const sheets = getSheetsService(tokens);
    const { id } = req.params;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId!,
      range: "Transactions!A:A"
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex(row => row[0] === id);

    if (rowIndex !== -1) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId!,
        requestBody: {
          requests: [{
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming Transactions is the first sheet
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1
              }
            }
          }]
        }
      });
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

app.post("/api/budgets", async (req, res) => {
  const tokens = (req.session as any).tokens;
  if (!tokens) return res.status(401).json({ error: "Unauthorized" });

  try {
    const spreadsheetId = await getOrCreateSheet(tokens);
    const sheets = getSheetsService(tokens);
    const id = Math.random().toString(36).substr(2, 9);
    const { category, amount, period } = req.body;
    const createdAt = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId!,
      range: "Budgets!A:E",
      valueInputOption: "RAW",
      requestBody: {
        values: [[id, category, amount, period, createdAt]]
      }
    });

    res.json({ id, category, amount, period, created_at: createdAt });
  } catch (error) {
    res.status(500).json({ error: "Failed to add budget" });
  }
});

app.post("/api/goals", async (req, res) => {
  const tokens = (req.session as any).tokens;
  if (!tokens) return res.status(401).json({ error: "Unauthorized" });

  try {
    const spreadsheetId = await getOrCreateSheet(tokens);
    const sheets = getSheetsService(tokens);
    const id = Math.random().toString(36).substr(2, 9);
    const { name, target_amount, current_amount, deadline } = req.body;
    const createdAt = new Date().toISOString();

    await sheets.spreadsheets.values.append({
      spreadsheetId: spreadsheetId!,
      range: "Goals!A:F",
      valueInputOption: "RAW",
      requestBody: {
        values: [[id, name, target_amount, current_amount, deadline, createdAt]]
      }
    });

    res.json({ id, name, target_amount, current_amount, deadline, created_at: createdAt });
  } catch (error) {
    res.status(500).json({ error: "Failed to add goal" });
  }
});

// Vite middleware for development
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static("dist"));
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

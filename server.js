import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// ID de la hoja de Google Sheets (publica: "Cualquiera con el enlace puede ver")
const SHEET_ID =
  process.env.SHEET_ID || "1i13nEubCyewjxt9mDql-RIIqqeToHR83aBHw_pzPjk0";
const SHEET_NAME = process.env.SHEET_NAME || ""; // opcional: nombre de pestana

function csvUrl() {
  let url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;
  if (SHEET_NAME) url += `&sheet=${encodeURIComponent(SHEET_NAME)}`;
  return url;
}

// Parser CSV simple que respeta comillas y comas/saltos dentro de campos
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n") {
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else if (c === "\r") {
        // ignorar
      } else field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// API: devuelve headers + filas como JSON
app.get("/api/data", async (req, res) => {
  try {
    const resp = await fetch(csvUrl());
    if (!resp.ok) throw new Error(`Google respondio ${resp.status}`);
    const text = await resp.text();
    const rows = parseCSV(text);
    if (rows.length === 0) return res.json({ headers: [], items: [] });
    const headers = rows[0];
    const items = rows.slice(1).map((r) => {
      const obj = {};
      headers.forEach((h, idx) => (obj[h] = r[idx] ?? ""));
      return obj;
    });
    res.json({ headers, items, count: items.length, updated: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static(join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Dashboard en http://localhost:${PORT}`);
});

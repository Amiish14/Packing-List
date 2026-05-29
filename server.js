// ═══════════════════════════════════════════════════════════════
//  Procam Load Planning Platform — backend
//  Serves the static front-end and persists users + sessions in
//  SQLite stored on a persistent disk, so data is NEVER lost on a
//  redeploy or restart.
//
//  Zero npm dependencies: uses Node's built-in http + node:sqlite
//  (Node 18.5+/20/22). No build step, nothing to compile.
// ═══════════════════════════════════════════════════════════════
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

// On Render the persistent disk is mounted at /data (see render.yaml).
// Locally it falls back to ./data so you can test without a disk.
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, "data");
fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_PATH = path.join(DATA_DIR, "procam.db");

const db = new DatabaseSync(DB_PATH);
db.exec("CREATE TABLE IF NOT EXISTS kv (key TEXT PRIMARY KEY, val TEXT NOT NULL)");
const getStmt = db.prepare("SELECT val FROM kv WHERE key = ?");
const setStmt = db.prepare(
  "INSERT INTO kv (key, val) VALUES (?, ?) " +
  "ON CONFLICT(key) DO UPDATE SET val = excluded.val"
);
const read = (key, fallback) => {
  const row = getStmt.get(key);
  if (!row) return fallback;
  try { return JSON.parse(row.val); } catch { return fallback; }
};
const write = (key, value) => setStmt.run(key, JSON.stringify(value));

// Seed default users on first ever boot so the first login works.
const DEF_USERS = [
  { u: "suranjan.aon", p: "procam@123", name: "Suranjan Aon",    role: "admin",      ini: "SA" },
  { u: "nilesh.sinha", p: "procam@456", name: "Nilesh K. Sinha", role: "admin",      ini: "NS" },
  { u: "planner1",     p: "procam@789", name: "Load Planner",    role: "planner",    ini: "LP" },
  { u: "supervisor1",  p: "site@123",   name: "Site Supervisor", role: "supervisor", ini: "SS" },
];
if (read("users", null) === null) {
  write("users", DEF_USERS);
  console.log("[procam] seeded default users into fresh database");
}

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript",
  ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg",
  ".svg": "image/svg+xml", ".ico": "image/x-icon", ".json": "application/json",
};
const sendJSON = (res, code, obj) => {
  const body = JSON.stringify(obj);
  res.writeHead(code, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) });
  res.end(body);
};
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", c => { data += c; if (data.length > 12e6) req.destroy(); });
    req.on("end", () => { try { resolve(data ? JSON.parse(data) : null); } catch (e) { reject(e); } });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = req.url.split("?")[0];

  // ── API ──────────────────────────────────────────────────────
  if (url === "/healthz") return res.end("ok");

  if (url === "/api/data" && req.method === "GET") {
    return sendJSON(res, 200, { users: read("users", DEF_USERS), sessions: read("sessions", []) });
  }
  if (url === "/api/users" && req.method === "PUT") {
    try { const b = await readBody(req);
      if (!Array.isArray(b)) return sendJSON(res, 400, { error: "expected array" });
      write("users", b); return sendJSON(res, 200, { ok: true, count: b.length });
    } catch { return sendJSON(res, 400, { error: "bad json" }); }
  }
  if (url === "/api/sessions" && req.method === "PUT") {
    try { const b = await readBody(req);
      if (!Array.isArray(b)) return sendJSON(res, 400, { error: "expected array" });
      write("sessions", b); return sendJSON(res, 200, { ok: true, count: b.length });
    } catch { return sendJSON(res, 400, { error: "bad json" }); }
  }

  // ── Static files ─────────────────────────────────────────────
  let rel = decodeURIComponent(url === "/" ? "/index.html" : url);
  let filePath = path.normalize(path.join(ROOT, rel));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end("forbidden"); }
  fs.readFile(filePath, (err, buf) => {
    if (err) {                       // unknown path → serve the SPA
      return fs.readFile(path.join(ROOT, "index.html"), (e2, idx) => {
        if (e2) { res.writeHead(404); return res.end("not found"); }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" }); res.end(idx);
      });
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream" });
    res.end(buf);
  });
});

server.listen(PORT, () => console.log(`[procam] listening on :${PORT}  db=${DB_PATH}`));

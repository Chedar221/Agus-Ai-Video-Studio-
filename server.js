import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import generateHandler from "./api/generate.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.disable("x-powered-by");
app.use(express.json({ limit: "12mb" }));
app.use(express.static(path.join(__dirname, "public"), {
  etag: true,
  maxAge: "1h",
  setHeaders(res, filePath) {
    if (filePath.endsWith("index.html")) res.setHeader("Cache-Control", "no-cache");
  }
}));
app.post("/api/generate", generateHandler);
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "AGUS AI VIDEO STUDIO" }));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  app.listen(PORT, () => console.log(`AGUS AI VIDEO STUDIO berjalan di http://localhost:${PORT}`));
}

export default app;

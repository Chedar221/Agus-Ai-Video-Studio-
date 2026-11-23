import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import generateHandler from "./api/generate.js";
import productionToolsHandler from "./api/production-tools.js";
import adminAuthHandler from "./api/admin-auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.disable("x-powered-by");
app.use(express.json({ limit: "12mb" }));
app.use(express.static(path.join(__dirname, "public"), {
  index: false,
  etag: true,
  maxAge: "1h",
  setHeaders(res, filePath) {
    if (filePath.endsWith(".html")) res.setHeader("Cache-Control", "no-cache");
  }
}));
app.post("/api/generate", generateHandler);
app.post("/api/production-tools", productionToolsHandler);
app.all("/api/admin-auth", adminAuthHandler);
app.get("/api/health", (_req, res) => res.json({ ok: true, service: "CHEDAR AI STUDIO", stage: 1 }));
app.get("/", (_req, res) => res.sendFile(path.join(__dirname, "public", "home.html")));
app.get("/workspace", async (_req, res, next) => {
  try {
    const html = await readFile(path.join(__dirname, "public", "index.html"), "utf8");
    const branded = html.replace("</body>", '<script src="/workspace-brand.js"></script></body>');
    res.status(200).type("html").send(branded);
  } catch (error) {
    next(error);
  }
});
app.get("/legacy", (_req, res) => res.redirect(302, "/workspace"));
app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "home.html")));

if (process.env.NODE_ENV !== "production" || process.env.VERCEL !== "1") {
  app.listen(PORT, () => console.log(`CHEDAR AI STUDIO berjalan di http://localhost:${PORT}`));
}

export default app;

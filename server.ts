import express from "express";
import path from "path";
import { exec } from "node:child_process";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Tenzo Cafe and Bakers BMS" });
  });

  // Download entire codebase as ZIP for GitHub
  app.get("/api/download-zip", (req, res) => {
    const zipPath = "/tmp/tenzo-bakers-bms.zip";
    const pyScript = `python3 -c "
import os, zipfile
with zipfile.ZipFile('${zipPath}', 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist', '.cache']]
        for file in files:
            if file.endswith('.zip'): continue
            filepath = os.path.join(root, file)
            zipf.write(filepath, arcname=filepath.lstrip('./'))
"`;
    exec(pyScript, (err: any) => {
      if (err) {
        console.error("ZIP creation error:", err);
        return res.status(500).json({ error: "Failed to generate ZIP" });
      }
      res.download(zipPath, "tenzo-bakers-bms.zip");
    });
  });

  // Vite middleware for development vs static files for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

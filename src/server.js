import express from "express";
import cors from "cors";
import compression from "compression";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "../data");

// Middleware
app.use(compression());
app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

// API Endpoints
app.get("/api/data", (req, res) => {
    try {
        const dataFile = path.join(DATA_DIR, "proyectos-gestion-extracted.json");
        if (fs.existsSync(dataFile)) {
            const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
            res.json(data);
        } else {
            res.status(404).json({ error: "No data extracted yet. Run: npm run extract" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/patterns", (req, res) => {
    try {
        const patternsFile = path.join(DATA_DIR, "patterns.json");
        if (fs.existsSync(patternsFile)) {
            const patterns = JSON.parse(fs.readFileSync(patternsFile, "utf-8"));
            res.json(patterns);
        } else {
            res.status(404).json({ error: "No patterns analyzed yet. Run: npm run analyze" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/api/status", (req, res) => {
    const status = {
        dataExtracted: fs.existsSync(path.join(DATA_DIR, "proyectos-gestion-extracted.json")),
        patternsAnalyzed: fs.existsSync(path.join(DATA_DIR, "patterns.json")),
        timestamp: new Date().toISOString()
    };
    res.json(status);
});

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║  Glide BI Dashboard - Gestión         ║
    ║  http://localhost:${PORT}                  ║
    ╚════════════════════════════════════════╝
    `);
});

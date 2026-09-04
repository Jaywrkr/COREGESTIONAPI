import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");

export default async function handler(req, res) {
    // CORS
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    const status = {
        environment: "vercel",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
        dataExtracted: fs.existsSync(path.join(DATA_DIR, "proyectos-gestion-extracted.json")),
        patternsAnalyzed: fs.existsSync(path.join(DATA_DIR, "patterns.json")),
        apis: {
            data: "/api/data",
            patterns: "/api/patterns",
            status: "/api/status"
        }
    };

    res.status(200).json(status);
}

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");
const PATTERNS_FILE = path.join(DATA_DIR, "patterns.json");

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

    try {
        if (fs.existsSync(PATTERNS_FILE)) {
            const patterns = JSON.parse(fs.readFileSync(PATTERNS_FILE, "utf-8"));
            res.status(200).json(patterns);
        } else {
            res.status(404).json({
                error: "No patterns analyzed yet",
                message: "Run: npm run analyze"
            });
        }
    } catch (error) {
        console.error("Error reading patterns:", error);
        res.status(500).json({
            error: error.message,
            details: "Failed to load patterns"
        });
    }
}

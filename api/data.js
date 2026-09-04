import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");
const EXTRACTED_FILE = path.join(DATA_DIR, "proyectos-gestion-extracted.json");

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
        if (fs.existsSync(EXTRACTED_FILE)) {
            const data = JSON.parse(fs.readFileSync(EXTRACTED_FILE, "utf-8"));
            res.status(200).json(data);
        } else {
            res.status(404).json({
                error: "No data extracted yet",
                message: "Run: npm run extract"
            });
        }
    } catch (error) {
        console.error("Error reading data:", error);
        res.status(500).json({
            error: error.message,
            details: "Failed to load extracted data"
        });
    }
}

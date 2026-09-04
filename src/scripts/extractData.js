import * as glide from "@glideapps/tables";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { proyectosGestionTable, columnLabels } from "../config/proyectosGestion.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../../data");
const EXTRACTED_FILE = path.join(DATA_DIR, "proyectos-gestion-extracted.json");

// Crear directorio si no existe
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

/**
 * Extrae datos reales de Glide
 */
async function extractData() {
    console.log("🚀 Extrayendo datos de Proyectos Gestión desde Glide...\n");

    try {
        const proyectos = await proyectosGestionTable.get();

        console.log(`✅ Se extrajeron ${proyectos.length} proyectos\n`);

        const extractedData = {
            metadata: {
                extractedAt: new Date().toISOString(),
                totalProyectos: proyectos.length,
                columnLabels
            },
            proyectos: proyectos
        };

        // Guardar en archivo
        fs.writeFileSync(
            EXTRACTED_FILE,
            JSON.stringify(extractedData, null, 2)
        );

        console.log(`📊 Datos guardados en: ${EXTRACTED_FILE}`);
        return extractedData;

    } catch (error) {
        console.error("❌ Error extrayendo datos:", error.message);
        throw error;
    }
}

export default extractData;

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    extractData().catch(console.error);
}

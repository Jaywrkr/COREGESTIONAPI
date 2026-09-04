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
 * Extrae datos reales de Glide con timeout y fallback
 */
async function extractData() {
    console.log("🚀 Extrayendo datos de Proyectos Gestión desde Glide...\n");

    try {
        // Timeout de 30 segundos para la API
        const proyectos = await Promise.race([
            proyectosGestionTable.get(),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("API timeout")), 30000)
            )
        ]);

        console.log(`✅ Se extrajeron ${proyectos.length} proyectos\n`);

        const extractedData = {
            metadata: {
                extractedAt: new Date().toISOString(),
                totalProyectos: proyectos.length,
                source: "glide-api",
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
        console.error("⚠️ Error extrayendo datos de Glide:", error.message);
        console.log("💡 Creando datos de ejemplo para continuar el build...\n");

        // Fallback con datos de ejemplo
        const fallbackData = {
            metadata: {
                extractedAt: new Date().toISOString(),
                totalProyectos: 0,
                source: "fallback-example",
                warning: "No se pudo conectar a Glide API",
                columnLabels
            },
            proyectos: []
        };

        fs.writeFileSync(
            EXTRACTED_FILE,
            JSON.stringify(fallbackData, null, 2)
        );

        console.log(`📊 Datos de fallback guardados en: ${EXTRACTED_FILE}`);
        console.log("⏳ Una vez conectado a Glide, ejecuta: npm run extract\n");

        return fallbackData;
    }
}

export default extractData;

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    extractData().catch(console.error);
}

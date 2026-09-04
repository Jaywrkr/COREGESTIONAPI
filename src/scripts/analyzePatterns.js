import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import pkg from "lodash";
const { countBy, groupBy, orderBy, sumBy, meanBy } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../../data");
const EXTRACTED_FILE = path.join(DATA_DIR, "proyectos-gestion-extracted.json");
const PATTERNS_FILE = path.join(DATA_DIR, "patterns.json");

/**
 * Análisis de patrones en datos de proyectos
 */
async function analyzePatterns() {
    console.log("🔍 Analizando patrones en Proyectos de Gestión...\n");

    // Leer datos extraídos
    if (!fs.existsSync(EXTRACTED_FILE)) {
        console.error("❌ No hay datos extraídos. Ejecuta: npm run extract");
        process.exit(1);
    }

    const { proyectos } = JSON.parse(
        fs.readFileSync(EXTRACTED_FILE, "utf-8")
    );

    const patterns = {
        resumen: {},
        estados: {},
        documentos: {},
        administradores: {},
        formasPago: {},
        retrasos: {},
        completitud: {},
        riesgos: {}
    };

    // 1. RESUMEN GENERAL
    console.log("📋 1. Resumen General");
    patterns.resumen = {
        totalProyectos: proyectos.length,
        proyectosActivos: proyectos.filter(p => p.column5 === "En Curso").length,
        proyectosCompletados: proyectos.filter(p => p.column5 === "Completado").length,
        valorTotalProyectos: sumBy(proyectos, p => parseFloat(p.column8) || 0),
        valorPromedio: meanBy(proyectos, p => parseFloat(p.column8) || 0)
    };
    console.log(patterns.resumen);

    // 2. DISTRIBUCIÓN DE ESTADOS
    console.log("\n📊 2. Distribución de Estados");
    patterns.estados = countBy(proyectos, "column5");
    console.log(patterns.estados);

    // 3. DOCUMENTACIÓN REQUERIDA
    console.log("\n📄 3. Completitud de Documentación");
    const docFields = [
        "adjudicacion",
        "actaDeNegociacion",
        "contrato",
        "polizaFiel",
        "polizaBuen",
        "actaEntregaRecepcion"
    ];

    docFields.forEach(field => {
        const completados = proyectos.filter(p => p[field] === true).length;
        patterns.documentos[field] = {
            completados,
            porcentaje: ((completados / proyectos.length) * 100).toFixed(2) + "%"
        };
    });
    console.log(patterns.documentos);

    // 4. TOP ADMINISTRADORES
    console.log("\n👤 4. Top Administradores por Proyectos");
    const porAdministrador = groupBy(proyectos, "administrador");
    patterns.administradores = Object.entries(porAdministrador)
        .map(([admin, proys]) => ({
            administrador: admin || "Sin Asignar",
            cantidad: proys.length,
            porcentaje: ((proys.length / proyectos.length) * 100).toFixed(2) + "%"
        }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 10);
    console.log(patterns.administradores);

    // 5. FORMAS DE PAGO
    console.log("\n💳 5. Formas de Pago Utilizadas");
    patterns.formasPago = countBy(proyectos, "formaDePago");
    console.log(patterns.formasPago);

    // 6. DETECCIÓN DE RETRASOS
    console.log("\n⏰ 6. Análisis de Retrasos");
    const hoy = new Date();
    const proyectosConRetraso = proyectos.filter(p => {
        const fechaFin = new Date(p.column7);
        return fechaFin < hoy && (p.column5 === "En Curso" || p.column5 === "En Validación");
    });
    patterns.retrasos = {
        proyectosRetrasados: proyectosConRetraso.length,
        porcentaje: ((proyectosConRetraso.length / proyectos.length) * 100).toFixed(2) + "%",
        proyectos: proyectosConRetraso.slice(0, 5).map(p => ({
            codigo: p.column1,
            nombre: p.column2,
            estado: p.column5,
            fechaPlanificada: p.column7
        }))
    };
    console.log(patterns.retrasos);

    // 7. COMPLETITUD DE REGISTRO
    console.log("\n✅ 7. Completitud de Datos");
    const emptyFields = {};
    docFields.forEach(field => {
        const vacios = proyectos.filter(p => !p[field] || p[field] === "").length;
        emptyFields[field] = {
            vacios,
            porcentaje: ((vacios / proyectos.length) * 100).toFixed(2) + "%"
        };
    });
    patterns.completitud = emptyFields;
    console.log(patterns.completitud);

    // 8. PROYECTOS CON RIESGOS
    console.log("\n⚠️ 8. Proyectos en Riesgo");
    const enRiesgo = proyectos.filter(p => {
        const docIncompleto = docFields.filter(f => !p[f]).length > 3;
        const retrasado = new Date(p.column7) < hoy && (p.column5 === "En Curso" || p.column5 === "En Validación");
        return docIncompleto || retrasado;
    });
    patterns.riesgos = {
        totalEnRiesgo: enRiesgo.length,
        porcentaje: ((enRiesgo.length / proyectos.length) * 100).toFixed(2) + "%",
        proyectos: enRiesgo.slice(0, 5).map(p => ({
            codigo: p.column1,
            nombre: p.column2,
            estado: p.column5,
            docsIncompletos: docFields.filter(f => !p[f]).length
        }))
    };
    console.log(patterns.riesgos);

    // Guardar patrones
    fs.writeFileSync(
        PATTERNS_FILE,
        JSON.stringify(patterns, null, 2)
    );

    console.log(`\n✅ Patrones guardados en: ${PATTERNS_FILE}`);
    return patterns;
}

export default analyzePatterns;

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    analyzePatterns().catch(console.error);
}

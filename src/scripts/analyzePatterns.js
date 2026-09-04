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
        riesgos: {},
        scoreRiesgo: {},
        processMining: {}
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

    // 9. SCORE DE RIESGO POR PROYECTO (modelo explicable, no caja negra)
    console.log("\n🎯 9. Score de Riesgo por Proyecto");
    patterns.scoreRiesgo = calcularScoreRiesgo(proyectos, docFields, hoy);
    console.log(`   ${patterns.scoreRiesgo.resumen.alto} en riesgo ALTO, ${patterns.scoreRiesgo.resumen.medio} MEDIO, ${patterns.scoreRiesgo.resumen.bajo} BAJO`);

    // 10. PROCESS MINING - tiempos entre hitos del ciclo contractual
    console.log("\n⛏️ 10. Process Mining - Ciclo Contractual");
    patterns.processMining = analizarProcessMining(proyectos);
    console.log(`   Cuello de botella detectado: ${patterns.processMining.cuelloDeBotella?.etapa || "N/A"}`);

    // Guardar patrones
    fs.writeFileSync(
        PATTERNS_FILE,
        JSON.stringify(patterns, null, 2)
    );

    console.log(`\n✅ Patrones guardados en: ${PATTERNS_FILE}`);
    return patterns;
}

/**
 * Modelo de Score de Riesgo explicable (no caja negra).
 * Combina 4 factores con pesos claros para poder justificar el número:
 *   40% Documentación faltante   - cuántos de los docs obligatorios no están
 *   30% Retraso vs fecha planificada - días vencidos sin cerrar
 *   15% Antigüedad sin cierre    - días desde adjudicación aún "En Curso"
 *   15% Valor relativo del contrato - contratos grandes pesan más si fallan
 */
function calcularScoreRiesgo(proyectos, docFields, hoy) {
    const valores = proyectos.map(p => parseFloat(p.column8) || 0);
    const maxValor = Math.max(...valores, 1);

    const items = proyectos.map(p => {
        const docsFaltantes = docFields.filter(f => !p[f]).length;
        const pctDocsFaltantes = docsFaltantes / docFields.length;

        const enCurso = p.column5 === "En Curso" || p.column5 === "En Validación";

        const fechaFin = p.column7 ? new Date(p.column7) : null;
        const diasRetraso = fechaFin && fechaFin < hoy && enCurso
            ? Math.floor((hoy - fechaFin) / (1000 * 60 * 60 * 24))
            : 0;
        const pctRetraso = Math.min(diasRetraso / 60, 1); // 60+ días = riesgo máximo

        const fechaAdj = p.fechaAdjudicacionOrden ? new Date(p.fechaAdjudicacionOrden) : null;
        const diasSinCerrar = fechaAdj && enCurso
            ? Math.floor((hoy - fechaAdj) / (1000 * 60 * 60 * 24))
            : 0;
        const pctAntiguedad = Math.min(Math.max(diasSinCerrar, 0) / 180, 1); // 180+ días = riesgo máximo

        const valor = parseFloat(p.column8) || 0;
        const pctValor = valor / maxValor;

        const score = Math.round(
            pctDocsFaltantes * 40 +
            pctRetraso * 30 +
            pctAntiguedad * 15 +
            pctValor * 15
        );

        const nivel = score >= 60 ? "ALTO" : score >= 30 ? "MEDIO" : "BAJO";
        const semaforo = score >= 60 ? "🔴" : score >= 30 ? "🟡" : "🟢";

        return {
            codigo: p.column1,
            nombre: p.column2,
            administrador: p.administrador,
            estado: p.column5,
            score,
            nivel,
            semaforo,
            factores: {
                docsFaltantes: `${docsFaltantes}/${docFields.length}`,
                diasRetraso,
                diasSinCerrar,
                valor
            }
        };
    });

    const ordenados = orderBy(items, ["score"], ["desc"]);

    return {
        resumen: {
            alto: items.filter(i => i.nivel === "ALTO").length,
            medio: items.filter(i => i.nivel === "MEDIO").length,
            bajo: items.filter(i => i.nivel === "BAJO").length
        },
        top10MasRiesgosos: ordenados.slice(0, 10),
        metodologia: {
            pesos: { documentacion: "40%", retraso: "30%", antiguedad: "15%", valor: "15%" },
            umbrales: { alto: ">=60", medio: "30-59", bajo: "<30" }
        }
    };
}

/**
 * Process Mining sobre el ciclo de vida contractual:
 * Adjudicación -> Contrato -> Anticipo -> Entrega -> Acta
 * Calcula duración promedio/mediana de cada etapa y detecta el cuello de botella.
 */
function analizarProcessMining(proyectos) {
    const etapas = [
        { nombre: "Adjudicación → Contrato", desde: "fechaAdjudicacionOrden", hasta: "column9" },
        { nombre: "Contrato → Anticipo", desde: "column9", hasta: "fechaAnticipo" },
        { nombre: "Anticipo → Entrega", desde: "fechaAnticipo", hasta: "column10" },
        { nombre: "Entrega → Acta", desde: "column10", hasta: "fechaActa" }
    ];

    const resultados = etapas.map(etapa => {
        const duraciones = proyectos
            .map(p => {
                const desde = p[etapa.desde] ? new Date(p[etapa.desde]) : null;
                const hasta = p[etapa.hasta] ? new Date(p[etapa.hasta]) : null;
                if (!desde || !hasta || isNaN(desde) || isNaN(hasta)) return null;
                const dias = Math.floor((hasta - desde) / (1000 * 60 * 60 * 24));
                return dias >= 0 ? dias : null;
            })
            .filter(d => d !== null);

        const ordenadas = [...duraciones].sort((a, b) => a - b);
        const mediana = ordenadas.length
            ? ordenadas[Math.floor(ordenadas.length / 2)]
            : null;
        const promedio = duraciones.length
            ? Math.round(duraciones.reduce((a, b) => a + b, 0) / duraciones.length)
            : null;

        return {
            etapa: etapa.nombre,
            proyectosConDatos: duraciones.length,
            promedioDias: promedio,
            medianaDias: mediana,
            maximoDias: ordenadas.length ? ordenadas[ordenadas.length - 1] : null
        };
    });

    const conDatos = resultados.filter(r => r.promedioDias !== null);
    const cuelloDeBotella = conDatos.length
        ? orderBy(conDatos, ["promedioDias"], ["desc"])[0]
        : null;

    return {
        etapas: resultados,
        cuelloDeBotella: cuelloDeBotella
            ? { etapa: cuelloDeBotella.etapa, promedioDias: cuelloDeBotella.promedioDias }
            : null
    };
}

export default analyzePatterns;

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    analyzePatterns().catch(console.error);
}

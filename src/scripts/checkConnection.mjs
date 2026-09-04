/**
 * Diagnóstico de conexión con Glide.
 * Uso: node src/scripts/checkConnection.mjs [codigoProyecto]
 *
 * Prueba una llamada real a table.get() y reporta el motivo exacto de fallo
 * (403 = token inválido o plan de Glide insuficiente; el SDK requiere Business
 * plan o superior para getRows()). Si conecta, imprime un registro completo
 * para verificar el mapeo de columnas contra la UI real de Glide.
 */
import { proyectosGestionTable } from "../config/proyectosGestion.js";

const codigoBuscado = process.argv[2] || "CS-804";

try {
    const rows = await Promise.race([
        proyectosGestionTable.get(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout tras 20s")), 20000))
    ]);

    console.log(`✅ Conectado. Total filas: ${rows.length}\n`);

    const normalizado = s => (s || "").toString().replace(/\s|-/g, "").toUpperCase();
    const encontrado = rows.find(r => normalizado(r.column1) === normalizado(codigoBuscado));

    if (encontrado) {
        console.log(`Proyecto ${codigoBuscado} encontrado:\n`);
        console.log(JSON.stringify(encontrado, null, 2));
    } else {
        console.log(`⚠️ No se encontró "${codigoBuscado}". Mostrando el primer registro:\n`);
        console.log(JSON.stringify(rows[0], null, 2));
    }
} catch (err) {
    console.error(`❌ ERROR: ${err.message}\n`);
    if (err.message.includes("403")) {
        console.error("El token fue rechazado por Glide. Verifica:");
        console.error("  1. El plan de la app debe ser Business o superior (requisito de getRows()).");
        console.error("  2. El token no debe haber sido rotado/revocado en Glide.");
    }
    process.exit(1);
}
